import { Merchant } from '../../domain/entities/merchant.entity.js';
import { CreateMerchantDto } from '../dto/create-merchant.dto.js';

export class MerchantMapper {
  static toEntity(dto: CreateMerchantDto): Merchant {
    return new Merchant({
      name: dto.name,
      description: dto.description ?? null,
      isActive: true,
    });
  }

  static toResponse(merchant: Merchant) {
    return {
      id: merchant.id,
      name: merchant.name,
      description: merchant.description,
      isActive: merchant.isActive,
    };
  }
}
