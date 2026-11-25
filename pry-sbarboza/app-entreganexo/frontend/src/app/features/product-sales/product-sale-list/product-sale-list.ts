import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { catchError, forkJoin, of } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { ProductSale, ProductSalePayload } from '../../../core/models/product-sale.model';
import { Sale } from '../../../core/models/sale.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { HasPermission } from '../../../shared/directives/has-permission';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ProductApi } from '../../products/product-api';
import { SaleApi } from '../../sales/sale-api';
import { ProductSaleApi } from '../product-sale-api';
import { ProductSaleForm } from '../product-sale-form/product-sale-form';

@Component({
  selector: 'app-product-sale-list',
  imports: [
    CurrencyPipe,
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
    ProductSaleForm,
  ],
  templateUrl: './product-sale-list.html',
  styleUrl: './product-sale-list.css',
})
export class ProductSaleList {
  private readonly api = inject(ProductSaleApi);
  private readonly salesApi = inject(SaleApi);
  private readonly productsApi = inject(ProductApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<ProductSale[]>([]);
  readonly sales = signal<Sale[]>([]);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly productName = computed(() => {
    const map = new Map(this.products().map((product) => [product.id, product.name]));
    return (id: number) => map.get(id) ?? `Producto #${id}`;
  });

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.id,
      `#${row.sale_id}`,
      this.productName()(row.product_id),
    ]),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<ProductSale | null>(null);
  readonly title = computed(() => (this.editing() ? 'Editar cantidad de la línea' : 'Nueva línea de venta'));

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      lines: this.api.list(),
      // Los catálogos son de apoyo: si falta el permiso, la tabla sigue funcionando.
      sales: this.salesApi.list().pipe(catchError(() => of([] as Sale[]))),
      products: this.productsApi.list().pipe(catchError(() => of([] as Product[]))),
    }).subscribe({
      next: ({ lines, sales, products }) => {
        this.rows.set(lines);
        this.sales.set(sales);
        this.products.set(products);
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

  openEdit(row: ProductSale): void {
    this.editing.set(row);
    this.dialogVisible.set(true);
  }

  save(value: ProductSalePayload): void {
    const current = this.editing();
    this.saving.set(true);
    const request = current
      ? this.api.update(current.id, { quantity: value.quantity })
      : this.api.create(value);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Cantidad actualizada' : 'Línea añadida', 'Stock y totales recalculados');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  deactivate(row: ProductSale): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar la línea #${row.id}? Se devolverán ${row.quantity} unidad(es) al stock.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Línea desactivada y stock restaurado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo desactivar', toApiMessage(error)),
        });
      },
    });
  }

  remove(row: ProductSale): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `¿Eliminar la línea #${row.id}?`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Línea eliminada');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo eliminar', toApiMessage(error)),
        });
      },
    });
  }
}
