import { Module } from '@nestjs/common';
import { ResourceRolesController } from './presentation/http/controllers/resource-roles.controller.js';
import { ResourceRolesService } from './application/services/resource-roles.service.js';
import { ResourceRoleRepository } from './infrastructure/persistence/repositories/resource-role.repository.js';
import { ResourceRoleSeeder } from './infrastructure/persistence/seeders/resource-role.seeder.js';

@Module({
  controllers: [ResourceRolesController],
  providers: [ResourceRolesService, ResourceRoleRepository, ResourceRoleSeeder],
  exports: [ResourceRoleSeeder],
})
export class ResourceRolesModule {}
