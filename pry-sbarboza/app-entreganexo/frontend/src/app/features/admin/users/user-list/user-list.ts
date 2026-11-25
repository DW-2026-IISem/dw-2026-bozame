import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { EffectivePermission } from '../../../../core/models/auth.model';
import { User, UserPayload } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { methodSeverity } from '../../method-severity';
import { UserApi } from '../user-api';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-user-list',
  imports: [
    DatePipe,
    ButtonModule,
    DialogModule,
    InputTextModule,
    MessageModule,
    TableModule,
    TagModule,
    TooltipModule,
    HasPermission,
    EmptyState,
    PageHeader,
    StatusTag,
    UserForm,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  private readonly api = inject(UserApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly methodSeverity = methodSeverity;

  readonly rows = signal<User[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [row.username, row.email]),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<User | null>(null);
  readonly title = computed(() => (this.editing() ? 'Editar usuario' : 'Nuevo usuario'));

  // Diálogo "Ver permisos": la forma más rápida de diagnosticar un 403.
  readonly accessVisible = signal(false);
  readonly accessLoading = signal(false);
  readonly accessUser = signal<User | null>(null);
  readonly access = signal<EffectivePermission[]>([]);
  readonly accessRoles = computed(() => {
    const byId = new Map<number, string>();
    for (const permission of this.access()) {
      byId.set(permission.role_id, permission.role_name);
    }
    return [...byId.entries()].map(([id, name]) => ({ id, name }));
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.list().subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  /** Protección contra auto-bloqueo: no puedes desactivar ni borrar tu propio usuario. */
  isSelf(user: User): boolean {
    return this.session.user()?.id === user.id;
  }

  initials(user: User): string {
    return user.username.slice(0, 2).toUpperCase();
  }

  openCreate(): void {
    this.editing.set(null);
    this.dialogVisible.set(true);
  }

  openEdit(row: User): void {
    this.editing.set(row);
    this.dialogVisible.set(true);
  }

  openAccess(row: User): void {
    this.accessUser.set(row);
    this.access.set([]);
    this.accessLoading.set(true);
    this.accessVisible.set(true);
    this.api.permissions(row.id).subscribe({
      next: (permissions) => {
        this.access.set(permissions);
        this.accessLoading.set(false);
      },
      error: (error: unknown) => {
        this.accessLoading.set(false);
        this.notify.error('No se pudieron cargar los permisos', toApiMessage(error));
      },
    });
  }

  save(payload: UserPayload): void {
    const current = this.editing();
    this.saving.set(true);
    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Usuario actualizado' : 'Usuario creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  deactivate(row: User): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar al usuario ${row.username}? Ya no podrá iniciar sesión.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Usuario desactivado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo desactivar', toApiMessage(error)),
        });
      },
    });
  }

  remove(row: User): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `¿Eliminar al usuario ${row.username}?`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Usuario eliminado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo eliminar', toApiMessage(error)),
        });
      },
    });
  }
}
