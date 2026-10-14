import { Module } from '@nestjs/common';
import { RolesController } from './presentation/http/controllers/roles.controller.js';
import { RolesService } from './application/services/roles.service.js';
import { RoleRepository } from './infrastructure/persistence/repositories/role.repository.js';
import { RoleSeeder } from './infrastructure/persistence/seeders/role.seeder.js';

@Module({
  controllers: [RolesController],
  providers: [RolesService, RoleRepository, RoleSeeder],
  exports: [RoleSeeder],
})
export class RolesModule {}
