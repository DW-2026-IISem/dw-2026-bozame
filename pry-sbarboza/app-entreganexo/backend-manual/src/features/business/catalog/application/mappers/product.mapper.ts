import { Product } from '../../domain/entities/product.entity.js';
import { CreateProductDto } from '../dto/create-product.dto.js';

export class ProductMapper {
  static toEntity(dto: CreateProductDto): Product {
    return new Product({
      sku: dto.sku,
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      isActive: true,
      merchantId: dto.merchantId,
    });
  }

  static toResponse(p: Product) {
    return {
      id: p.id,
      sku: p.sku,
      name: p.name,
      description: p.description,
      price: p.price,
      isActive: p.isActive,
      merchantId: p.merchantId,
    };
  }
}
