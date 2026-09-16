import { Inject, Injectable, Logger } from "@nestjs/common";
import { MERCHANT_REPOSITORY } from '../../../../merchants/domain/interfaces/merchant.repository.js';
import type { IMerchantRepository } from '../../../../merchants/domain/interfaces/merchant.repository.js';
import { Product } from '../../../domain/entities/product.entity.js';
import { PRODUCT_REPOSITORY } from '../../../domain/interfaces/product.repository.js';
import type { IProductRepository } from '../../../domain/interfaces/product.repository.js';

@Injectable()
export class ProductSeeder {
  private readonly logger = new Logger(ProductSeeder.name);

  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepo: IProductRepository,
    @Inject(MERCHANT_REPOSITORY) private readonly merchantRepo: IMerchantRepository,
  ) {}

  async seed(): Promise<void> {
    const { items: merchants } = await this.merchantRepo.findAll(1, 10);
    const activeMerchant = merchants.find((m) => m.isActive);
    if (!activeMerchant || !activeMerchant.id) {
      this.logger.warn('Seeder products: no hay un comercio activo, no se siembra producto');
      return;
    }

    const sku = 'SKU-DEMO-01';
    const existing = await this.productRepo.findBySku(sku);
    if (existing) {
      this.logger.log('Seeder products: ya existía el producto demo (idempotente)');
      return;
    }

    await this.productRepo.create(
      new Product({
        sku,
        name: 'Producto Demo Inicial',
        description: 'Creado automáticamente por el seeder',
        price: 15000,
        isActive: true,
        merchantId: activeMerchant.id,
      })
    );
    this.logger.log('Seeder products: producto demo creado exitosamente');
  }
}
