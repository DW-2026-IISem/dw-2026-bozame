import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { catchError, forkJoin, of } from 'rxjs';
import { Role } from '../../../../core/models/role.model';
import { RoleUser } from '../../../../core/models/role-user.model';
import { User } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { RoleApi } from '../../roles/role-api';
import { UserApi } from '../../users/user-api';
import { RoleUserApi } from '../role-user-api';

@Component({
  selector: 'app-role-user-list',
  imports: [
    DatePipe, FormsModule, ButtonModule, DialogModule, MessageModule, SelectModule, TableModule, TagModule,
    TooltipModule, HasPermission, EmptyState, PageHeader,
  ],
  templateUrl: './role-user-list.html',
  styleUrl: './role-user-list.css',
})
export class RoleUserList {
  private readonly api = inject(RoleUserApi);
  private readonly usersApi = inject(UserApi);
  private readonly rolesApi = inject(RoleApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly rows = signal<RoleUser[]>([]);
  readonly users = signal<User[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  // Filtros locales
  readonly userFilter = signal<User | null>(null);
  readonly roleFilter = signal<Role | null>(null);

  readonly visibleRows = computed(() => {
    const user = this.userFilter();
    const role = this.roleFilter();
    return this.rows().filter(
      (row) => (!user || row.user_id === user.id) && (!role || row.role_id === role.id),
    );
  });

  // Diálogo "Asignar rol"
  readonly dialogVisible = signal(false);
  readonly selectedUser = signal<User | null>(null);
  readonly selectedRole = signal<Role | null>(null);
  readonly canSave = computed(() => !!this.selectedUser() && !!this.selectedRole());

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      rows: this.api.list(),
      users: this.usersApi.list().pipe(catchError(() => of([] as User[]))),
      roles: this.rolesApi.list().pipe(catchError(() => of([] as Role[]))),
    }).subscribe({
      next: ({ rows, users, roles }) => {
        this.rows.set(rows);
        this.users.set(users);
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  username(row: RoleUser): string {
    return row.user?.username ?? this.users().find((u) => u.id === row.user_id)?.username ?? `Usuario #${row.user_id}`;
  }

  email(row: RoleUser): string {
    return row.user?.email ?? this.users().find((u) => u.id === row.user_id)?.email ?? '';
  }

  roleName(row: RoleUser): string {
    return row.role?.name ?? this.roles().find((r) => r.id === row.role_id)?.name ?? `Rol #${row.role_id}`;
  }

  /** Quitarte tu propio rol puede dejarte sin acceso a esta misma pantalla. */
  isSelf(row: RoleUser): boolean {
    return this.session.user()?.id === row.user_id;
  }

  openAssign(): void {
    this.selectedUser.set(this.userFilter());
    this.selectedRole.set(this.roleFilter());
    this.dialogVisible.set(true);
  }

  assign(): void {
    const user = this.selectedUser();
    const role = this.selectedRole();
    if (!user || !role) return;
    this.saving.set(true);
    this.api.create({ user_id: user.id, role_id: role.id }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success('Rol asignado', `${user.username} → ${role.name}`);
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo asignar', toApiMessage(error));
      },
    });
  }

  revoke(row: RoleUser): void {
    const warning = this.isSelf(row) ? ' Es tu propio usuario: podrías perder el acceso a esta pantalla.' : '';
    this.confirmation.confirm({
      header: 'Retirar rol',
      message: `¿Retirar el rol ${this.roleName(row)} a ${this.username(row)}?${warning}`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Rol retirado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo retirar', toApiMessage(error)),
        });
      },
    });
  }
}
