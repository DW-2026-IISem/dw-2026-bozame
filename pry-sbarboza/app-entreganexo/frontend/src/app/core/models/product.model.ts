import { Money, Status, Timestamps } from './api.model';

export interface Product extends Timestamps {
  id: number;
  name: string;
  brand: string;
  price: Money;
  min_stock: number;
  quantity: number;
  product_type_id: number;
  status: Status;
}

export interface ProductPayload {
  name: string;
  brand: string;
  price: number;
  min_stock: number;
  quantity: number;
  product_type_id: number;
  status?: Status;
}
