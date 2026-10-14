import { Product } from '../../domain/entities/product.entity.js';
import { type IProductRepository } from '../../domain/interfaces/product.repository.js';
export declare class GetProductByIdUseCase {
    private readonly repo;
    constructor(repo: IProductRepository);
    execute(id: number): Promise<Product>;
}
