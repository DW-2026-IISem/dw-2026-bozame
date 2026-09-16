import { Inject, Injectable } from '@nestjs/common';
import { MerchantNotFoundException } from '../../domain/exceptions/merchant-not-found.exception.js';
import { MERCHANT_REPOSITORY } from '../../domain/interfaces/merchant.repository.js';
import type { IMerchantRepository } from '../../domain/interfaces/merchant.repository.js';
import type { Merchant } from '../../domain/entities/merchant.entity.js';

@Injectable()
export class GetMerchantByIdUseCase {
  constructor(
    @Inject(MERCHANT_REPOSITORY) private readonly repository: IMerchantRepository,
  ) {}

  async execute(id: number): Promise<Merchant> {
    const merchant = await this.repository.findById(id);
    if (!merchant) {
      throw new MerchantNotFoundException(id);
    }
    return merchant;
  }
}
