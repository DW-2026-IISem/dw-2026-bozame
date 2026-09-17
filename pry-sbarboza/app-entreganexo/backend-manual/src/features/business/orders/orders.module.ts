import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module.js';
import { MerchantsModule } from '../merchants/merchants.module.js';
import { CatalogModule } from '../catalog/catalog.module.js';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case.js';
import { GetOrderByIdUseCase } from './application/use-cases/get-order-by-id.use-case.js';
import { ORDER_REPOSITORY } from './domain/interfaces/order.repository.js';
import { OrderRepository } from './infrastructure/persistence/repositories/order.repository.js';
import { OrdersController } from './presentation/http/controllers/orders.controller.js';

@Module({
  imports: [ClientsModule, MerchantsModule, CatalogModule],
  controllers: [OrdersController],
  providers: [
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
  ],
  exports: [ORDER_REPOSITORY],
})
export class OrdersModule {}
