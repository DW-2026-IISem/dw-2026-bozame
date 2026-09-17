import { OrderDetail } from './order-detail.entity.js';

export type OrderStatus = 'pending' | 'assigned' | 'completed' | 'cancelled';

export interface OrderProps {
  id?: number | null;
  clientId: number;
  merchantId: number;
  channel?: string | null;
  date?: Date;
  subtotal: number;
  total: number;
  status?: OrderStatus;
  items: OrderDetail[];
}

export class Order {
  readonly id: number | null;
  readonly clientId: number;
  readonly merchantId: number;
  readonly channel: string | null;
  readonly date: Date;
  readonly subtotal: number;
  readonly total: number;
  readonly status: OrderStatus;
  readonly items: OrderDetail[];

  constructor(props: OrderProps) {
    this.id = props.id ?? null;
    this.clientId = props.clientId;
    this.merchantId = props.merchantId;
    this.channel = props.channel ?? 'app';
    this.date = props.date ?? new Date();
    this.subtotal = props.subtotal;
    this.total = props.total;
    this.status = props.status ?? 'pending';
    this.items = props.items;
  }
}
