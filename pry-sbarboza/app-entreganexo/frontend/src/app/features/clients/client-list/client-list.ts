import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Client, ClientPayload } from '../../../core/models/client.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { HasPermission } from '../../../shared/directives/has-permission';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ClientApi } from '../client-api';
import { ClientForm } from '../client-form/client-form';

@Component({
  selector: 'app-client-list',
  imports: [
    ButtonModule, DialogModule, InputTextModule, MessageModule, TableModule, TagModule, TooltipModule,
    HasPermission, EmptyState, PageHeader, StatusTag, ClientForm
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css',
})
export class ClientList {
  private readonly api = inject(ClientApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Client[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (client) => [
      client.name, client.email, client.phone, client.address,
    ]),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Client | null>(null);
  readonly title = computed(() => (this.editing() ? 'Editar cliente' : 'Nuevo cliente'));

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

  openCreate(): void {
    this.editing.set(null);
    this.dialogVisible.set(true);
  }

  openEdit(client: Client): void {
    this.editing.set(client);
    this.dialogVisible.set(true);
  }

  save(payload: ClientPayload): void {
    const current = this.editing();
    this.saving.set(true);
    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);
    
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Cliente actualizado' : 'Cliente creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  deactivate(client: Client): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar a ${client.name}? status pasará a inactive.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(client.id).subscribe({
          next: () => {
            this.notify.warn('Cliente desactivado');
            this.load();
          },
        });
      },
    });
  }

  remove(client: Client): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `DELETE /api/clientes/${client.id} es físico e irreversible.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(client.id).subscribe({
          next: () => {
            this.notify.success('Cliente eliminado');
            this.load();
          },
        });
      },
    });
  }
}
