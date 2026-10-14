import { Sale } from '../../domain/entities/sale.entity.js';
import { type ISaleRepository } from '../../domain/interfaces/sale.repository.js';
import { CreateSaleDto } from '../dto/create-sale.dto.js';
import { type IClientRepository } from '../../../clients/domain/interfaces/client.repository.js';
import { type IProductRepository } from '../../../products/domain/interfaces/product.repository.js';
export declare class CreateSaleUseCase {
    private readonly saleRepo;
    private readonly clientRepo;
    private readonly productRepo;
    private readonly calculator;
    constructor(saleRepo: ISaleRepository, clientRepo: IClientRepository, productRepo: IProductRepository);
    execute(dto: CreateSaleDto): Promise<Sale>;
}
