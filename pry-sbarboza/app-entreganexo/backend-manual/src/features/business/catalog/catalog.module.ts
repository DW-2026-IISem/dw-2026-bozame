import { Module } from '@nestjs/common';
import { MerchantsModule } from '../merchants/merchants.module.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case.js';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case.js';
import { PRODUCT_REPOSITORY } from './domain/interfaces/product.repository.js';
import { ProductRepository } from './infrastructure/persistence/repositories/product.repository.js';
import { ProductSeeder } from './infrastructure/persistence/seeders/product.seeder.js';
import { ProductsController } from './presentation/http/controllers/products.controller.js';

@Module({
  imports: [MerchantsModule],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductByIdUseCase,
    ProductSeeder,
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
  ],
  exports: [PRODUCT_REPOSITORY, ProductSeeder],
})
export class CatalogModule {}
