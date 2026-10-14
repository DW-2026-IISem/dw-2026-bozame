export type ProductStatus = 'active' | 'inactive';
export interface ProductProps {
    id?: number | null;
    name: string;
    brand?: string | null;
    price: number;
    minStock?: number;
    quantity?: number;
    productTypeId: number;
    status?: ProductStatus;
}
export declare class Product {
    readonly id: number | null;
    readonly name: string;
    readonly brand: string | null;
    readonly price: number;
    readonly minStock: number;
    quantity: number;
    readonly productTypeId: number;
    readonly status: ProductStatus;
    constructor(props: ProductProps);
    reduceStock(n: number): void;
}
