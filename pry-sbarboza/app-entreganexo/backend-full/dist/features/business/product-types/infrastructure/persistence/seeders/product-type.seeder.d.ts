import { type IProductTypeRepository } from '../../../domain/interfaces/product-type.repository.js';
export declare class ProductTypeSeeder {
    private readonly repo;
    private readonly logger;
    constructor(repo: IProductTypeRepository);
    seed(): Promise<void>;
}
