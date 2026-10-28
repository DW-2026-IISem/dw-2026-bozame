import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module.js';
import { ProductsModule } from '../products/products.module.js';
import { SalesController } from './presentation/http/controllers/sales.controller.js';
import { CreateSaleUseCase } from './application/use-cases/create-sale.use-case.js';
import { GetSaleByIdUseCase } from './application/use-cases/get-sale-by-id.use-case.js';
import { ListSalesUseCase } from './application/use-cases/list-sales.use-case.js';
import { SaleRepository } from './infrastructure/persistence/repositories/sale.repository.js';
import { SALE_REPOSITORY } from './domain/interfaces/sale.repository.js';

@Module({
  imports: [ClientsModule, ProductsModule],
  controllers: [SalesController],
  providers: [
    CreateSaleUseCase,
    GetSaleByIdUseCase,
    ListSalesUseCase,
    { provide: SALE_REPOSITORY, useClass: SaleRepository },
  ],
  exports: [SALE_REPOSITORY],
})
export class SalesModule {}
