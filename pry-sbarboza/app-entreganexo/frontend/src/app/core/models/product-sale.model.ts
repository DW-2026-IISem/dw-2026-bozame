import { Money, Status, Timestamps } from './api.model';

export interface ProductSale extends Timestamps {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: Money;
  line_total: Money;
  status: Status;
}

export interface ProductSalePayload {
  sale_id: number;
  product_id: number;
  quantity: number;
  status?: Status;
}
