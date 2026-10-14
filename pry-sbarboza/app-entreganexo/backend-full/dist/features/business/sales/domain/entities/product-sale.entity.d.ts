export interface ProductSaleProps {
    id?: number | null;
    saleId?: number | null;
    productId: number;
    quantity: number;
    unitPrice: number;
    total: number;
}
export declare class ProductSale {
    readonly id: number | null;
    readonly saleId: number | null;
    readonly productId: number;
    readonly quantity: number;
    readonly unitPrice: number;
    readonly total: number;
    constructor(props: ProductSaleProps);
}
