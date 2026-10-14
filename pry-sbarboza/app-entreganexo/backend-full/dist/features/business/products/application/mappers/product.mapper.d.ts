import { Product } from '../../domain/entities/product.entity.js';
import { CreateProductDto } from '../dto/create-product.dto.js';
export declare class ProductMapper {
    static toEntity(dto: CreateProductDto): Product;
    static toResponse(p: Product): {
        id: number | null;
        name: string;
        brand: string | null;
        price: number;
        minStock: number;
        quantity: number;
        productTypeId: number;
        status: import("../../domain/entities/product.entity.js").ProductStatus;
    };
}
