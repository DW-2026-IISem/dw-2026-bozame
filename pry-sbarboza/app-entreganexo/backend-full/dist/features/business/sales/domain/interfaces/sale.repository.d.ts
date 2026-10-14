import { Sale } from '../entities/sale.entity.js';
export declare const SALE_REPOSITORY = "ISaleRepository";
export interface ISaleRepository {
    create(sale: Sale): Promise<Sale>;
    findById(id: number): Promise<Sale | null>;
}
