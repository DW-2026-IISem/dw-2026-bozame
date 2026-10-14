import { Injectable, Inject, Logger } from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity.js';
import { PRODUCT_REPOSITORY, type IProductRepository } from '../../../domain/interfaces/product.repository.js';
import { PRODUCT_TYPE_REPOSITORY, type IProductTypeRepository } from '../../../../product-types/domain/interfaces/product-type.repository.js';

@Injectable()
export class ProductSeeder {
  private readonly logger = new Logger(ProductSeeder.name);

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(PRODUCT_TYPE_REPOSITORY)
    private readonly typeRepo: IProductTypeRepository,
  ) {}

  async seed(): Promise<void> {
    const { items: types } = await this.typeRepo.findAll(1, 100);
    const activeType = types.find((t) => t.status === 'active');
    
    if (!activeType || activeType.id === null) {
      this.logger.warn('Seeder products: No hay tipos de producto activos, omitiendo.');
      return;
    }
    
    const { items: existingProducts } = await this.productRepo.findAll(1, 100);
    const demoExists = existingProducts.some(p => p.name === 'Producto Demo' && p.productTypeId === activeType.id);
    
    if (demoExists) {
      this.logger.log('Seeder products: ya existía el producto demo');
      return;
    }
    
    await this.productRepo.create(new Product({
      name: 'Producto Demo',
      brand: 'Marca Demo',
      price: 15000,
      minStock: 5,
      quantity: 50,
      productTypeId: activeType.id,
      status: 'active',
    }));
    this.logger.log('Seeder products: Producto demo creado');
  }
}
