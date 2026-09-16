import { Inject, Injectable } from '@nestjs/common';
import { MerchantNameExistsException } from '../../domain/exceptions/merchant-name-exists.exception.js';
import { MERCHANT_REPOSITORY } from '../../domain/interfaces/merchant.repository.js';
import type { IMerchantRepository } from '../../domain/interfaces/merchant.repository.js';
import { CreateMerchantDto } from '../dto/create-merchant.dto.js';
import { MerchantMapper } from '../mappers/merchant.mapper.js';
import type { Merchant } from '../../domain/entities/merchant.entity.js';

@Injectable()
export class CreateMerchantUseCase {
  constructor(
    @Inject(MERCHANT_REPOSITORY) private readonly repository: IMerchantRepository,
  ) {}

  async execute(dto: CreateMerchantDto): Promise<Merchant> {
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new MerchantNameExistsException(dto.name);
    }
    return this.repository.create(MerchantMapper.toEntity(dto));
  }
}
