import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { catchError, forkJoin, of } from 'rxjs';
import { Client } from '../../../core/models/client.model';
import { Product } from '../../../core/models/product.model';
import { Sale } from '../../../core/models/sale.model';
import { NotificationService } from '../../../core/services/notification';
import { SessionStore } from '../../../core/services/session-store';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { HasPermission } from '../../../shared/directives/has-permission';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ClientApi } from '../../clients/client-api';
import { ProductApi } from '../../products/product-api';
import { SaleDetail } from '../sale-detail/sale-detail';
import { SaleApi } from '../sale-api';

@Component({
  selector: 'app-sale-list',
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
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
    SaleDetail,
  ],
  templateUrl: './sale-list.html',
  styleUrl: './sale-list.css',
})
export class SaleList {
  private readonly api = inject(SaleApi);
  private readonly clientsApi = inject(ClientApi);
  private readonly productsApi = inject(ProductApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly rows = signal<Sale[]>([]);
  readonly clients = signal<Client[]>([]);
  readonly products = signal<Product[]>([]);

  // Diálogo de detalle (cabecera + líneas)
  readonly selected = signal<Sale | null>(null);
  readonly detailVisible = signal(false);
  readonly detailTitle = computed(() => {
    const sale = this.selected();
    return sale ? `Venta #${sale.id}` : 'Detalle de venta';
  });
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.id,
      row.sale_date,
      this.clientName()(row.client_id),
    ]),
  );

  readonly clientName = computed(() => {
    const map = new Map(this.clients().map((client) => [client.id, client.name]));
    return (id: number) => map.get(id) ?? `Cliente #${id}`;
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      sales: this.api.list(),
      clients: this.clientsApi.list().pipe(catchError(() => of([]))),
      products: this.productsApi.list().pipe(catchError(() => of([] as Product[]))),
    }).subscribe({
      next: ({ sales, clients, products }) => {
        this.rows.set(Array.isArray(sales) ? sales : []);
        this.clients.set(Array.isArray(clients) ? clients : []);
        this.products.set(Array.isArray(products) ? products : []);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openDetail(sale: Sale): void {
    this.selected.set(sale);
    this.detailVisible.set(true);
  }

  itemCount(sale: Sale): number {
    return (sale.items ?? []).reduce((sum, item) => sum + item.quantity, 0);
  }

  deactivate(sale: Sale): void {
    this.confirmation.confirm({
      header: 'Cancelar venta',
      message: `¿Cancelar la venta #${sale.id}? El stock será restaurado.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Cancelar venta',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(sale.id).subscribe({
          next: () => {
            this.notify.warn('Venta cancelada y stock restaurado');
            this.load();
          },
        });
      },
    });
  }

  remove(sale: Sale): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `¿Eliminar la venta #${sale.id}?`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(sale.id).subscribe({
          next: () => {
            this.notify.success('Venta eliminada');
            this.load();
          },
        });
      },
    });
  }
}
