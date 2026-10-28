import { type ISaleRepository } from '../../domain/interfaces/sale.repository.js';
export declare class ListSalesUseCase {
    private readonly repo;
    constructor(repo: ISaleRepository);
    execute(page: number, limit: number): Promise<{
        items: {
            id: number | null;
            saleDate: Date;
            subtotal: number;
            tax: number;
            discounts: number;
            total: number;
            status: import("../../domain/entities/sale.entity.js").SaleStatus;
            clientId: number;
            items: {
                id: number | null;
                productId: number;
                quantity: number;
                unitPrice: number;
                total: number;
            }[];
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
