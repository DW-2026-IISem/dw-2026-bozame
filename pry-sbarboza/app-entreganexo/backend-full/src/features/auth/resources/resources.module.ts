import { Module } from '@nestjs/common';
import { ResourcesController } from './presentation/http/controllers/resources.controller.js';
import { ResourcesService } from './application/services/resources.service.js';
import { ResourceRepository } from './infrastructure/persistence/repositories/resource.repository.js';
import { ResourceSeeder } from './infrastructure/persistence/seeders/resource.seeder.js';

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService, ResourceRepository, ResourceSeeder],
  exports: [ResourceSeeder],
})
export class ResourcesModule {}
