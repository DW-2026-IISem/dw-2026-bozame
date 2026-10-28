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
import { Product, ProductPayload } from '../../../core/models/product.model';
import { ProductType } from '../../../core/models/product-type.model';
import { NotificationService } from '../../../core/services/notification';
import { SessionStore } from '../../../core/services/session-store';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { HasPermission } from '../../../shared/directives/has-permission';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ProductTypeApi } from '../../product-types/product-type-api';
import { ProductApi } from '../product-api';
import { ProductForm } from '../product-form/product-form';

@Component({
  selector: 'app-product-list',
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
    ProductForm,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private readonly api = inject(ProductApi);
  private readonly typesApi = inject(ProductTypeApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly rows = signal<Product[]>([]);
  readonly types = signal<ProductType[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [row.name, row.brand]),
  );

  readonly typeName = computed(() => {
    const map = new Map(this.types().map((type) => [type.id, type.name]));
    return (id: number) => map.get(id) ?? `Tipo #${id}`;
  });

  readonly lowStockCount = computed(
    () =>
      this.rows().filter(
        (product) => product.quantity <= (product.min_stock ?? 0),
      ).length,
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Product | null>(null);
  readonly title = computed(() =>
    this.editing() ? 'Editar producto' : 'Nuevo producto',
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      products: this.api.list(),
      types: this.typesApi.list().pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ products, types }) => {
        this.rows.set(Array.isArray(products) ? products : []);
        this.types.set(Array.isArray(types) ? types : []);
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

  openEdit(row: Product): void {
    this.editing.set(row);
    this.dialogVisible.set(true);
  }

  save(payload: ProductPayload): void {
    const current = this.editing();
    this.saving.set(true);
    const request = current
      ? this.api.update(current.id, payload)
      : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(
          current ? 'Producto actualizado' : 'Producto creado',
        );
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  deactivate(row: Product): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar el producto ${row.name}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Producto desactivado');
            this.load();
          },
        });
      },
    });
  }

  remove(row: Product): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `¿Eliminar el producto ${row.name}?`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Producto eliminado');
            this.load();
          },
        });
      },
    });
  }
}
