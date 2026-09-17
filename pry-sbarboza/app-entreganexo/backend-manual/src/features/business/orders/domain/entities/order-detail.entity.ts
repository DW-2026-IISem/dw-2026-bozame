export interface OrderDetailProps {
  id?: number | null;
  orderId?: number | null;
  productId: number;
  quantity: number;
  unitPrice: number;
  total: number;
  observations?: string | null;
}

export class OrderDetail {
  readonly id: number | null;
  readonly orderId: number | null;
  readonly productId: number;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly total: number;
  readonly observations: string | null;

  constructor(props: OrderDetailProps) {
    this.id = props.id ?? null;
    this.orderId = props.orderId ?? null;
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
    this.total = props.total;
    this.observations = props.observations ?? null;
  }
}
