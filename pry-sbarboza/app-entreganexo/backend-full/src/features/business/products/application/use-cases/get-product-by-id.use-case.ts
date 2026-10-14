import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity.js';
import { PRODUCT_REPOSITORY, type IProductRepository } from '../../domain/interfaces/product.repository.js';
import { ProductNotFoundException } from '../../domain/exceptions/product.exceptions.js';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repo: IProductRepository,
  ) {}

  async execute(id: number): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) {
      throw new ProductNotFoundException(id);
    }
    return product;
  }
}
