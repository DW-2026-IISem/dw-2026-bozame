import { type IProductTypeRepository } from '../../domain/interfaces/product-type.repository.js';
export declare class ListProductTypesUseCase {
    private readonly repo;
    constructor(repo: IProductTypeRepository);
    execute(page: number, limit: number): Promise<{
        items: {
            id: number | null;
            name: string;
            description: string | null;
            status: import("../../domain/entities/product-type.entity.js").ProductTypeStatus;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
