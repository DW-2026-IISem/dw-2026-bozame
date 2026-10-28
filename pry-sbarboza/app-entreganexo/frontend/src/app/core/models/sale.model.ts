import { Money, Status, Timestamps } from './api.model';
import { ProductSale } from './product-sale.model';

export interface Sale extends Timestamps {
  id: number;
  sale_date: string;
  subtotal: Money;
  tax: Money;
  discounts: Money;
  total: Money;
  client_id: number;
  status: Status;
  items?: ProductSale[];
}

export interface SaleItemInput {
  product_id: number;
  quantity: number;
}

export interface SaleCreatePayload {
  client_id: number;
  tax?: number;
  discounts?: number;
  sale_date?: string;
  items: SaleItemInput[];
}

export interface SaleUpdatePayload {
  client_id?: number;
  tax?: number;
  discounts?: number;
  sale_date?: string;
}
