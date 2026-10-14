export interface SaleItemLike {
    quantity: number;
    unitPrice: number;
}
export declare class SaleCalculator {
    subtotal(items: SaleItemLike[]): number;
    total(subtotal: number, tax: number, discounts: number): number;
}
