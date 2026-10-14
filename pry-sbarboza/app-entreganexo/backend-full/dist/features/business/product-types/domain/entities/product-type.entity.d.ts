export type ProductTypeStatus = 'active' | 'inactive';
export interface ProductTypeProps {
    id?: number | null;
    name: string;
    description?: string | null;
    status?: ProductTypeStatus;
}
export declare class ProductType {
    readonly id: number | null;
    readonly name: string;
    readonly description: string | null;
    readonly status: ProductTypeStatus;
    constructor(props: ProductTypeProps);
}
