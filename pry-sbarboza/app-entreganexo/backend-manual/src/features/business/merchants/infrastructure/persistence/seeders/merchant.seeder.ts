import { Inject, Injectable, Logger } from "@nestjs/common";
import { Merchant } from '../../../domain/entities/merchant.entity.js';
import { MERCHANT_REPOSITORY } from '../../../domain/interfaces/merchant.repository.js';
import type { IMerchantRepository } from '../../../domain/interfaces/merchant.repository.js';

@Injectable()
export class MerchantSeeder {
  private readonly logger = new Logger(MerchantSeeder.name);

  constructor(
    @Inject(MERCHANT_REPOSITORY) private readonly repository: IMerchantRepository,
  ) {}

  async seed(): Promise<void> {
    const name = 'Supermercado Riohacha';
    const existing = await this.repository.findByName(name);
    if (existing) {
      this.logger.log('Seeder merchants: ya existía el comercio demo (idempotente)');
      return;
    }
    await this.repository.create(
      new Merchant({
        name,
        description: 'Punto principal de abastecimiento local',
        isActive: true,
      }),
    );
    this.logger.log('Seeder merchants: comercio demo creado exitosamente');
  }
}
