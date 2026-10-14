import { CreateSaleDto } from '../../../application/dto/create-sale.dto.js';
import { CreateSaleUseCase } from '../../../application/use-cases/create-sale.use-case.js';
import { GetSaleByIdUseCase } from '../../../application/use-cases/get-sale-by-id.use-case.js';
export declare class SalesController {
    private readonly createSale;
    private readonly getSale;
    constructor(createSale: CreateSaleUseCase, getSale: GetSaleByIdUseCase);
    create(dto: CreateSaleDto): Promise<{
        id: number | null;
        saleDate: Date;
        subtotal: number;
        tax: number;
        discounts: number;
        total: number;
        status: import("../../../domain/entities/sale.entity.js").SaleStatus;
        clientId: number;
        items: {
            id: number | null;
            productId: number;
            quantity: number;
            unitPrice: number;
            total: number;
        }[];
    }>;
    findOne(id: number): Promise<{
        id: number | null;
        saleDate: Date;
        subtotal: number;
        tax: number;
        discounts: number;
        total: number;
        status: import("../../../domain/entities/sale.entity.js").SaleStatus;
        clientId: number;
        items: {
            id: number | null;
            productId: number;
            quantity: number;
            unitPrice: number;
            total: number;
        }[];
    }>;
}
