import { Inject, Injectable } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../../clients/domain/interfaces/client.repository.js';
import type { IClientRepository } from '../../../clients/domain/interfaces/client.repository.js';
import { ClientNotFoundException } from '../../../clients/domain/exceptions/client-not-found.exception.js';
import { MERCHANT_REPOSITORY } from '../../../merchants/domain/interfaces/merchant.repository.js';
import type { IMerchantRepository } from '../../../merchants/domain/interfaces/merchant.repository.js';
import { MerchantNotFoundException } from '../../../merchants/domain/exceptions/merchant-not-found.exception.js';
import { PRODUCT_REPOSITORY } from '../../../catalog/domain/interfaces/product.repository.js';
import type { IProductRepository } from '../../../catalog/domain/interfaces/product.repository.js';
import { ProductNotFoundException } from '../../../catalog/domain/exceptions/product-not-found.exception.js';
import type { Product } from '../../../catalog/domain/entities/product.entity.js';
import { OrderDetail } from '../../domain/entities/order-detail.entity.js';
import { Order } from '../../domain/entities/order.entity.js';
import { EmptyOrderException } from '../../domain/exceptions/empty-order.exception.js';
import { OrderCalculator } from '../../domain/services/order-calculator.js';
import { ORDER_REPOSITORY } from '../../domain/interfaces/order.repository.js';
import type { IOrderRepository } from '../../domain/interfaces/order.repository.js';
import { CreateOrderDto } from '../dto/create-order.dto.js';

@Injectable()
export class CreateOrderUseCase {
  private readonly calculator = new OrderCalculator();

  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: IClientRepository,
    @Inject(MERCHANT_REPOSITORY) private readonly merchantRepo: IMerchantRepository,
    @Inject(PRODUCT_REPOSITORY) private readonly productRepo: IProductRepository,
    @Inject(ORDER_REPOSITORY) private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    const client = await this.clientRepo.findById(dto.clientId);
    if (!client) throw new ClientNotFoundException(dto.clientId);

    const merchant = await this.merchantRepo.findById(dto.merchantId);
    if (!merchant) throw new MerchantNotFoundException(dto.merchantId);

    if (!dto.items || dto.items.length === 0) throw new EmptyOrderException();

    const products = new Map<number, Product>();
    for (const it of dto.items) {
      const product = await this.productRepo.findById(it.productId);
      if (!product) throw new ProductNotFoundException(it.productId);
      products.set(it.productId, product);
    }

    const items: OrderDetail[] = dto.items.map((it) => {
      const product = products.get(it.productId)!;
      const unitPrice = it.unitPrice ?? product.price;
      const quantity = it.quantity;
      return new OrderDetail({
        productId: it.productId,
        quantity,
        unitPrice,
        total: quantity * unitPrice,
        observations: it.observations,
      });
    });

    const subtotal = this.calculator.subtotal(items);
    const total = this.calculator.total(subtotal);

    const order = new Order({
      clientId: dto.clientId,
      merchantId: dto.merchantId,
      channel: dto.channel,
      subtotal,
      total,
      status: 'pending',
      items,
    });

    return this.orderRepo.create(order);
  }
}
