import { Inject, Injectable } from '@nestjs/common';
import { MERCHANT_REPOSITORY } from '../../domain/interfaces/merchant.repository.js';
import type { IMerchantRepository } from '../../domain/interfaces/merchant.repository.js';
import { MerchantMapper } from '../mappers/merchant.mapper.js';

@Injectable()
export class ListMerchantsUseCase {
  constructor(
    @Inject(MERCHANT_REPOSITORY) private readonly repository: IMerchantRepository,
  ) {}

  async execute(page: number, limit: number) {
    const { items, total } = await this.repository.findAll(page, limit);
    return {
      items: items.map(MerchantMapper.toResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
