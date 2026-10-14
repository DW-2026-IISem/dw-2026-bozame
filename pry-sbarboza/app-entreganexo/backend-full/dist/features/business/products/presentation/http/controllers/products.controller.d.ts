import { CreateProductDto } from '../../../application/dto/create-product.dto.js';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case.js';
import { GetProductsUseCase } from '../../../application/use-cases/get-products.use-case.js';
export declare class ProductsController {
    private readonly createProduct;
    private readonly getProducts;
    constructor(createProduct: CreateProductUseCase, getProducts: GetProductsUseCase);
    create(dto: CreateProductDto): Promise<{
        product: import("../../../domain/entities/product.entity.js").Product;
    }>;
    list(): Promise<{
        products: any;
    }>;
    findOne(id: number): Promise<{
        product: any;
    }>;
}
