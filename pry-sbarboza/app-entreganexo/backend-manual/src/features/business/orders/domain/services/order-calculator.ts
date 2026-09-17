export interface OrderItemLike {
  quantity: number;
  unitPrice: number;
}

export class OrderCalculator {
  subtotal(items: OrderItemLike[]): number {
    return items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  }
  
  // En el futuro, aquí puedes sumar costos de envío
  total(subtotal: number): number {
    return subtotal;
  }
}
