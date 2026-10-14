import { Sale } from '../../domain/entities/sale.entity.js';
import { type ISaleRepository } from '../../domain/interfaces/sale.repository.js';
export declare class GetSaleByIdUseCase {
    private readonly repo;
    constructor(repo: ISaleRepository);
    execute(id: number): Promise<Sale>;
}
