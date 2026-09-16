import { Module } from '@nestjs/common';
import { CreateMerchantUseCase } from './application/use-cases/create-merchant.use-case.js';
import { GetMerchantByIdUseCase } from './application/use-cases/get-merchant-by-id.use-case.js';
import { ListMerchantsUseCase } from './application/use-cases/list-merchants.use-case.js';
import { MERCHANT_REPOSITORY } from './domain/interfaces/merchant.repository.js';
import { MerchantRepository } from './infrastructure/persistence/repositories/merchant.repository.js';
import { MerchantSeeder } from './infrastructure/persistence/seeders/merchant.seeder.js';
import { MerchantsController } from './presentation/http/controllers/merchants.controller.js';

@Module({
  controllers: [MerchantsController],
  providers: [
    CreateMerchantUseCase,
    ListMerchantsUseCase,
    GetMerchantByIdUseCase,
    MerchantSeeder,
    { provide: MERCHANT_REPOSITORY, useClass: MerchantRepository },
  ],
  exports: [MERCHANT_REPOSITORY, MerchantSeeder],
})
export class MerchantsModule {}
