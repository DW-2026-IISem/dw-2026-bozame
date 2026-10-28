import { Sequelize } from 'sequelize-typescript';
import { Sale } from '../../../domain/entities/sale.entity.js';
import type { ISaleRepository } from '../../../domain/interfaces/sale.repository.js';
export declare class SaleRepository implements ISaleRepository {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    create(sale: Sale): Promise<Sale>;
    findById(id: number): Promise<Sale | null>;
    findAll(page?: number, limit?: number): Promise<{
        items: Sale[];
        total: number;
    }>;
    private toDomain;
}
