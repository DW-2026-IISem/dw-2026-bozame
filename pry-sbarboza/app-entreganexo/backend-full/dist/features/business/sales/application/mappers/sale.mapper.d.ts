import { Sale } from '../../domain/entities/sale.entity.js';
export declare class SaleMapper {
    static toResponse(s: Sale): {
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
    };
}
