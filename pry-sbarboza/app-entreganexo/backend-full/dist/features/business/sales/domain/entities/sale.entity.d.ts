import { ProductSale } from './product-sale.entity.js';
export type SaleStatus = 'completed' | 'canceled';
export interface SaleProps {
    id?: number | null;
    saleDate?: Date;
    subtotal: number;
    tax: number;
    discounts: number;
    total: number;
    status?: SaleStatus;
    clientId: number;
    items: ProductSale[];
}
export declare class Sale {
    readonly id: number | null;
    readonly saleDate: Date;
    readonly subtotal: number;
    readonly tax: number;
    readonly discounts: number;
    readonly total: number;
    readonly status: SaleStatus;
    readonly clientId: number;
    readonly items: ProductSale[];
    constructor(props: SaleProps);
}
