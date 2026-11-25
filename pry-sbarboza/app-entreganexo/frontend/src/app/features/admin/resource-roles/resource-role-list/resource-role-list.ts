import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { catchError, forkJoin, of } from 'rxjs';
import { Resource } from '../../../../core/models/resource.model';
import { ResourceRole } from '../../../../core/models/resource-role.model';
import { Role } from '../../../../core/models/role.model';
import { NotificationService } from '../../../../core/services/notification';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { methodSeverity } from '../../method-severity';
import { ResourceApi } from '../../resources/resource-api';
import { RoleApi } from '../../roles/role-api';
import { ResourceRoleApi } from '../resource-role-api';

@Component({
  selector: 'app-resource-role-list',
  imports: [
    FormsModule, ButtonModule, DialogModule, InputTextModule, MessageModule, SelectModule, TableModule,
    TagModule, TooltipModule, HasPermission, EmptyState, PageHeader,
  ],
  templateUrl: './resource-role-list.html',
  styleUrl: './resource-role-list.css',
})
export class ResourceRoleList {
  private readonly api = inject(ResourceRoleApi);
  private readonly rolesApi = inject(RoleApi);
  private readonly resourcesApi = inject(ResourceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly methodSeverity = methodSeverity;

  readonly rows = signal<ResourceRole[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly resources = signal<Resource[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  readonly roleFilter = signal<Role | null>(null);

  readonly resourceById = computed(() => new Map(this.resources().map((r) => [r.id, r])));
  readonly roleById = computed(() => new Map(this.roles().map((r) => [r.id, r])));

  readonly visibleRows = computed(() => {
    const role = this.roleFilter();
    const byRole = role ? this.rows().filter((row) => row.role_id === role.id) : this.rows();
    return filterRows(byRole, this.filter(), (row) => [this.method(row), this.path(row), this.roleName(row)]);
  });

  // Diálogo "Conceder permiso"
  readonly dialogVisible = signal(false);
  readonly selectedRole = signal<Role | null>(null);
  readonly selectedResource = signal<Resource | null>(null);
  readonly canSave = computed(() => !!this.selectedRole() && !!this.selectedResource());

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      rows: this.api.list(),
      roles: this.rolesApi.list().pipe(catchError(() => of([] as Role[]))),
      resources: this.resourcesApi.list().pipe(catchError(() => of([] as Resource[]))),
    }).subscribe({
      next: ({ rows, roles, resources }) => {
        this.rows.set(rows);
        this.roles.set(roles);
        this.resources.set(resources);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  method(row: ResourceRole): string {
    return row.resource?.method ?? this.resourceById().get(row.resource_id)?.method ?? '?';
  }

  path(row: ResourceRole): string {
    return row.resource?.path ?? this.resourceById().get(row.resource_id)?.path ?? `Recurso #${row.resource_id}`;
  }

  description(row: ResourceRole): string {
    return row.resource?.description ?? this.resourceById().get(row.resource_id)?.description ?? '';
  }

  roleName(row: ResourceRole): string {
    return row.role?.name ?? this.roleById().get(row.role_id)?.name ?? `Rol #${row.role_id}`;
  }

  openGrant(): void {
    this.selectedRole.set(this.roleFilter());
    this.selectedResource.set(null);
    this.dialogVisible.set(true);
  }

  grant(): void {
    const role = this.selectedRole();
    const resource = this.selectedResource();
    if (!role || !resource) return;
    this.saving.set(true);
    this.api.create({ role_id: role.id, resource_id: resource.id }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success('Permiso concedido', `${role.name} → ${resource.method} ${resource.path}`);
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo conceder', toApiMessage(error));
      },
    });
  }

  revoke(row: ResourceRole): void {
    this.confirmation.confirm({
      header: 'Retirar permiso',
      message: `¿Retirar ${this.method(row)} ${this.path(row)} al rol ${this.roleName(row)}? El efecto es inmediato.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Permiso retirado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo retirar', toApiMessage(error)),
        });
      },
    });
  }
}
