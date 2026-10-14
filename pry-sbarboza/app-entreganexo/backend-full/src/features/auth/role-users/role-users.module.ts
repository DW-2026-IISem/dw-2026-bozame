import { Module } from '@nestjs/common';
import { RoleUsersController } from './presentation/http/controllers/role-users.controller.js';
import { RoleUsersService } from './application/services/role-users.service.js';
import { RoleUserRepository } from './infrastructure/persistence/repositories/role-user.repository.js';
import { RoleUserSeeder } from './infrastructure/persistence/seeders/role-user.seeder.js';

@Module({
  controllers: [RoleUsersController],
  providers: [RoleUsersService, RoleUserRepository, RoleUserSeeder],
  exports: [RoleUserSeeder],
})
export class RoleUsersModule {}
