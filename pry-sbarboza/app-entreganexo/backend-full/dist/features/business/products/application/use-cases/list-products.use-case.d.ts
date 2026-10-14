import { type IProductRepository } from '../../domain/interfaces/product.repository.js';
export declare class ListProductsUseCase {
    private readonly repo;
    constructor(repo: IProductRepository);
    execute(page: number, limit: number): Promise<{
        items: {
            id: number | null;
            name: string;
            brand: string | null;
            price: number;
            minStock: number;
            quantity: number;
            productTypeId: number;
            status: import("../../domain/entities/product.entity.js").ProductStatus;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
