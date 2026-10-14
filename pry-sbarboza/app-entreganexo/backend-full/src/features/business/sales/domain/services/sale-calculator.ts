export interface SaleItemLike {
  quantity: number;
  unitPrice: number;
}

export class SaleCalculator {
  subtotal(items: SaleItemLike[]): number {
    return items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  }

  total(subtotal: number, tax: number, discounts: number): number {
    return subtotal + tax - discounts;
  }
}
