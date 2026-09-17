import { Order } from '../entities/order.entity.js';

export const ORDER_REPOSITORY = 'IOrderRepository';

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: number): Promise<Order | null>;
}
