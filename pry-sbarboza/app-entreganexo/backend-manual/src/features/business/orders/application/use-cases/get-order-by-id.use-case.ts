import { Inject, Injectable } from '@nestjs/common';
import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception.js';
import { ORDER_REPOSITORY } from '../../domain/interfaces/order.repository.js';
import type { IOrderRepository } from '../../domain/interfaces/order.repository.js';
import type { Order } from '../../domain/entities/order.entity.js';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(@Inject(ORDER_REPOSITORY) private readonly repo: IOrderRepository) {}

  async execute(id: number): Promise<Order> {
    const order = await this.repo.findById(id);
    if (!order) throw new OrderNotFoundException(id);
    return order;
  }
}
