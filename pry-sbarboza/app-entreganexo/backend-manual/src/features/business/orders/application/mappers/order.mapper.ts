import { Order } from '../../domain/entities/order.entity.js';

export class OrderMapper {
  static toResponse(order: Order) {
    return {
      id: order.id,
      clientId: order.clientId,
      merchantId: order.merchantId,
      channel: order.channel,
      date: order.date,
      subtotal: order.subtotal,
      total: order.total,
      status: order.status,
      items: order.items.map((i) => ({
        id: i.id,
        orderId: i.orderId,
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.total,
        observations: i.observations,
      })),
    };
  }
}
