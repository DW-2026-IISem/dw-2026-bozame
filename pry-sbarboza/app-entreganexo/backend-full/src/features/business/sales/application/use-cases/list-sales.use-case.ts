import { Injectable, Inject } from '@nestjs/common';
import { SALE_REPOSITORY, type ISaleRepository } from '../../domain/interfaces/sale.repository.js';
import { SaleMapper } from '../mappers/sale.mapper.js';

@Injectable()
export class ListSalesUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly repo: ISaleRepository,
  ) {}

  async execute(page: number, limit: number) {
    const { items, total } = await this.repo.findAll(page, limit);
    return {
      items: items.map(SaleMapper.toResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
