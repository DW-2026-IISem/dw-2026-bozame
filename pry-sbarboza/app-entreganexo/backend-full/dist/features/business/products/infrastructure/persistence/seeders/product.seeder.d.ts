import { type IProductRepository } from '../../../domain/interfaces/product.repository.js';
import { type IProductTypeRepository } from '../../../../product-types/domain/interfaces/product-type.repository.js';
export declare class ProductSeeder {
    private readonly productRepo;
    private readonly typeRepo;
    private readonly logger;
    constructor(productRepo: IProductRepository, typeRepo: IProductTypeRepository);
    seed(): Promise<void>;
}
