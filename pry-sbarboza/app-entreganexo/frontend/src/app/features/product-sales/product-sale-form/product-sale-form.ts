import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../core/models/api.model';
import { Product } from '../../../core/models/product.model';
import { ProductSale, ProductSalePayload } from '../../../core/models/product-sale.model';
import { Sale } from '../../../core/models/sale.model';

@Component({
  selector: 'app-product-sale-form',
  imports: [ReactiveFormsModule, ButtonModule, InputNumberModule, SelectModule],
  templateUrl: './product-sale-form.html',
  styleUrl: './product-sale-form.css',
})
export class ProductSaleForm {
  readonly line = input<ProductSale | null>(null);
  readonly sales = input<Sale[]>([]);
  readonly products = input<Product[]>([]);
  readonly saving = input(false);
  readonly saved = output<ProductSalePayload>();
  readonly cancelled = output<void>();
  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    sale_id: [null as number | null, [Validators.required]],
    product_id: [null as number | null, [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.line();
      this.form.reset({
        sale_id: current?.sale_id ?? null,
        product_id: current?.product_id ?? null,
        quantity: current?.quantity ?? 1,
        status: current?.status ?? 'active',
      });
      // En edición solo cambia la cantidad: el backend no actualiza venta,
      // producto ni estado por PATCH (el estado va con /deactivate).
      if (current) {
        this.form.controls.sale_id.disable();
        this.form.controls.product_id.disable();
        this.form.controls.status.disable();
      } else {
        this.form.controls.sale_id.enable();
        this.form.controls.product_id.enable();
        this.form.controls.status.enable();
      }
    });
  }

  saleLabel(sale: Sale): string {
    return `Venta #${sale.id}`;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({
      sale_id: Number(value.sale_id),
      product_id: Number(value.product_id),
      quantity: Number(value.quantity),
      // `status` solo al crear; en edición se usa /deactivate.
      ...(this.line() ? {} : { status: value.status }),
    });
  }
}
