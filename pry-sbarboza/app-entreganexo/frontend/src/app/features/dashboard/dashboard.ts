import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { forkJoin, of } from 'rxjs';
import { Client } from '../../core/models/client.model';
import { Product } from '../../core/models/product.model';
import { Sale } from '../../core/models/sale.model';
import { NotificationService } from '../../core/services/notification';
import { SessionStore } from '../../core/services/session-store';
import { toApiMessage } from '../../core/utils/api-error';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { ClientApi } from '../clients/client-api';
import { ProductApi } from '../products/product-api';
import { SaleApi } from '../sales/sale-api';

@Component({
  selector: 'app-dashboard',
  imports: [
    CurrencyPipe, RouterLink, ButtonModule, MessageModule, TableModule, TagModule, PageHeader
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly clientApi = inject(ClientApi);
  private readonly productApi = inject(ProductApi);
  private readonly saleApi = inject(SaleApi);
  private readonly session = inject(SessionStore);
  private readonly notify = inject(NotificationService);

  readonly clients = signal<Client[]>([]);
  readonly products = signal<Product[]>([]);
  readonly sales = signal<Sale[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly totalRevenue = computed(() =>
    this.sales()
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => sum + Number(s.total ?? 0), 0),
  );

  readonly activeClientsCount = computed(
    () => this.clients().filter((c) => c.status === 'active').length,
  );

  readonly lowStockProducts = computed(() =>
    this.products().filter((p) => p.quantity <= p.min_stock && p.status === 'active'),
  );

  readonly recentSales = computed(() => [...this.sales()].slice(0, 5));

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      clients: this.session.canPermission('GET /api/clientes') ? this.clientApi.list() : of([]),
      products: this.session.canPermission('GET /api/productos') ? this.productApi.list() : of([]),
      sales: this.session.canPermission('GET /api/ventas') ? this.saleApi.list() : of([]),
    }).subscribe({
      next: ({ clients, products, sales }) => {
        this.clients.set(Array.isArray(clients) ? clients : []);
        this.products.set(Array.isArray(products) ? products : []);
        this.sales.set(Array.isArray(sales) ? sales : []);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(toApiMessage(error));
        this.loading.set(false);
        this.notify.error('Error al cargar métricas', toApiMessage(error));
      },
    });
  }
}
