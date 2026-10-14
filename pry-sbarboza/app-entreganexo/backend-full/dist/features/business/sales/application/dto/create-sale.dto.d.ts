export declare class SaleItemDto {
    productId: number;
    quantity: number;
    unitPrice?: number;
}
export declare class CreateSaleDto {
    clientId: number;
    items: SaleItemDto[];
    tax?: number;
    discounts?: number;
}
