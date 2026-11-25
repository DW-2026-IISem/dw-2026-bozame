import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { toNumber } from '../../../core/models/api.model';
import { Product } from '../../../core/models/product.model';
import { Sale } from '../../../core/models/sale.model';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';

/**
 * Detalle de una venta (cabecera + líneas). Componente presentacional: no llama
 * al backend; recibe la venta ya cargada y los productos para resolver nombres.
 */
@Component({
  selector: 'app-sale-detail',
  imports: [CurrencyPipe, DatePipe, TableModule, StatusTag],
  templateUrl: './sale-detail.html',
  styleUrl: './sale-detail.css',
})
export class SaleDetail {
  readonly sale = input.required<Sale>();
  readonly products = input<Product[]>([]);
  readonly clientName = input<string>('');

  readonly productName = computed(() => {
    const map = new Map(this.products().map((product) => [product.id, product.name]));
    return (id: number) => map.get(id) ?? `Producto #${id}`;
  });

  readonly itemCount = computed(() =>
    (this.sale().items ?? []).reduce((sum, item) => sum + item.quantity, 0),
  );

  /** Total de la línea: el frontend lo normaliza como `total`; el backend también envía `line_total`. */
  lineTotal(item: { total?: unknown; line_total?: unknown }): number {
    return toNumber((item.total ?? item.line_total) as number | string | undefined);
  }
}
