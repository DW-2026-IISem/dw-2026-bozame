import { Injectable, Inject } from '@nestjs/common';
import { Sale } from '../../domain/entities/sale.entity.js';
import { SALE_REPOSITORY, type ISaleRepository } from '../../domain/interfaces/sale.repository.js';
import { SaleNotFoundException } from '../../domain/exceptions/sale.exceptions.js';

@Injectable()
export class GetSaleByIdUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly repo: ISaleRepository,
  ) {}

  async execute(id: number): Promise<Sale> {
    const sale = await this.repo.findById(id);
    if (!sale) {
      throw new SaleNotFoundException(id);
    }
    return sale;
  }
}
