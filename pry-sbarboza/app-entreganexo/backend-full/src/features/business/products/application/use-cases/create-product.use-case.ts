import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity.js';
import { PRODUCT_REPOSITORY, type IProductRepository } from '../../domain/interfaces/product.repository.js';
import { PRODUCT_TYPE_REPOSITORY, type IProductTypeRepository } from '../../../product-types/domain/interfaces/product-type.repository.js';
import { CreateProductDto } from '../dto/create-product.dto.js';
import { ProductMapper } from '../mappers/product.mapper.js';
import { ProductTypeInactiveException } from '../../domain/exceptions/product.exceptions.js';
import { ProductTypeNotFoundException } from '../../../product-types/domain/exceptions/product-type.exceptions.js';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(PRODUCT_TYPE_REPOSITORY)
    private readonly typeRepo: IProductTypeRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    const type = await this.typeRepo.findById(dto.productTypeId);
    if (!type) {
      throw new ProductTypeNotFoundException(dto.productTypeId);
    }
    if (type.status !== 'active') {
      throw new ProductTypeInactiveException(dto.productTypeId);
    }
    return this.productRepo.create(ProductMapper.toEntity(dto));
  }
}
