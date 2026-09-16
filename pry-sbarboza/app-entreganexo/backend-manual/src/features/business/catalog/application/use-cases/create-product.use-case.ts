import { Inject, Injectable } from '@nestjs/common';
import { MERCHANT_REPOSITORY } from '../../../merchants/domain/interfaces/merchant.repository.js';
import type { IMerchantRepository } from '../../../merchants/domain/interfaces/merchant.repository.js';
import { MerchantNotFoundException } from '../../../merchants/domain/exceptions/merchant-not-found.exception.js';
import { MerchantInactiveException } from '../../../merchants/domain/exceptions/merchant-inactive.exception.js';
import { PRODUCT_REPOSITORY } from '../../domain/interfaces/product.repository.js';
import type { IProductRepository } from '../../domain/interfaces/product.repository.js';
import { ProductSkuExistsException } from '../../domain/exceptions/product-sku-exists.exception.js';
import type { Product } from '../../domain/entities/product.entity.js';
import { CreateProductDto } from '../dto/create-product.dto.js';
import { ProductMapper } from '../mappers/product.mapper.js';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepo: IProductRepository,
    @Inject(MERCHANT_REPOSITORY) private readonly merchantRepo: IMerchantRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    const merchant = await this.merchantRepo.findById(dto.merchantId);
    if (!merchant) throw new MerchantNotFoundException(dto.merchantId);
    if (!merchant.isActive) throw new MerchantInactiveException(dto.merchantId);

    const existingSku = await this.productRepo.findBySku(dto.sku);
    if (existingSku) throw new ProductSkuExistsException(dto.sku);

    return this.productRepo.create(ProductMapper.toEntity(dto));
  }
}
