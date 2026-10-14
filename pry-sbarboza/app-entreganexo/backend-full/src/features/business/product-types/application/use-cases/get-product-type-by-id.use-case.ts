import { Injectable, Inject } from '@nestjs/common';
import { ProductType } from '../../domain/entities/product-type.entity.js';
import { PRODUCT_TYPE_REPOSITORY, type IProductTypeRepository } from '../../domain/interfaces/product-type.repository.js';
import { ProductTypeNotFoundException } from '../../domain/exceptions/product-type.exceptions.js';

@Injectable()
export class GetProductTypeByIdUseCase {
  constructor(
    @Inject(PRODUCT_TYPE_REPOSITORY)
    private readonly repo: IProductTypeRepository,
  ) {}

  async execute(id: number): Promise<ProductType> {
    const pt = await this.repo.findById(id);
    if (!pt) {
      throw new ProductTypeNotFoundException(id);
    }
    return pt;
  }
}
