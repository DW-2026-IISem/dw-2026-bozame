import { Sequelize } from 'sequelize-typescript';
import { Product } from '../../../domain/entities/product.entity.js';
import type { IProductRepository } from '../../../domain/interfaces/product.repository.js';
export declare class ProductRepository implements IProductRepository {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    private get repo();
    create(p: Product): Promise<Product>;
    findAll(page: number, limit: number): Promise<{
        items: Product[];
        total: number;
    }>;
    findById(id: number): Promise<Product | null>;
    count(): Promise<number>;
    private toDomain;
}
