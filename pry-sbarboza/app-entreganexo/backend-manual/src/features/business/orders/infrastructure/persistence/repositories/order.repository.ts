import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { OrderDetail } from '../../../domain/entities/order-detail.entity.js';
import { Order } from '../../../domain/entities/order.entity.js';
import type { OrderStatus } from '../../../domain/entities/order.entity.js';
import { IOrderRepository } from '../../../domain/interfaces/order.repository.js';
import { OrderDetailModel } from '../models/order-detail.model.js';
import { OrderModel } from '../models/order.model.js';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  async create(order: Order): Promise<Order> {
    // Implementación de transacción atómica para insertar cabecera y detalles
    return this.sequelize.transaction(async (t) => {
      const orderRepo = this.sequelize.getRepository(OrderModel);
      const detailRepo = this.sequelize.getRepository(OrderDetailModel);

      // 1. Insertar la cabecera del pedido
      const createdOrder = await orderRepo.create(
        {
          clientId: order.clientId,
          merchantId: order.merchantId,
          channel: order.channel,
          date: order.date,
          subtotal: order.subtotal,
          total: order.total,
          status: order.status,
        },
        { transaction: t },
      );

      // 2. Insertar los ítems del detalle
      const persistedItems: OrderDetail[] = [];
      for (const item of order.items) {
        const detail = await detailRepo.create(
          {
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            observations: item.observations,
          },
          { transaction: t },
        );
        persistedItems.push(
          new OrderDetail({
            id: detail.id,
            orderId: detail.orderId,
            productId: detail.productId,
            quantity: detail.quantity,
            unitPrice: Number(detail.unitPrice),
            total: Number(detail.total),
            observations: detail.observations,
          }),
        );
      }

      return this.toDomain(createdOrder, persistedItems);
    });
  }

  async findById(id: number): Promise<Order | null> {
    const orderRepo = this.sequelize.getRepository(OrderModel);
    const detailRepo = this.sequelize.getRepository(OrderDetailModel);
    
    const found = await orderRepo.findByPk(id);
    if (!found) return null;

    const itemModels = await detailRepo.findAll({
      where: { orderId: id },
      order: [['id', 'ASC']],
    });

    const items = itemModels.map(
      (m) =>
        new OrderDetail({
          id: m.id,
          orderId: m.orderId,
          productId: m.productId,
          quantity: m.quantity,
          unitPrice: Number(m.unitPrice),
          total: Number(m.total),
          observations: m.observations,
        }),
    );
    return this.toDomain(found, items);
  }

  private toDomain(m: OrderModel, items: OrderDetail[]): Order {
    return new Order({
      id: m.id,
      clientId: m.clientId,
      merchantId: m.merchantId,
      channel: m.channel ?? null,
      date: m.date,
      subtotal: Number(m.subtotal),
      total: Number(m.total),
      status: (m.status as OrderStatus) ?? 'pending',
      items,
    });
  }
}
