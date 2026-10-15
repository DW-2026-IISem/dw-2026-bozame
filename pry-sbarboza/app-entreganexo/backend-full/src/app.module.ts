import { Module } from '@nestjs/common';
import { EnvironmentModule } from './config/environment/environment.module.js';
import { SequelizeModule } from './infrastructure/database/sequelize/sequelize.module.js';
import { HealthController } from './health/health.controller.js';
import { BusinessModule } from './features/business/business.module.js';
import { SeedersRunner } from './features/business/seeders.runner.js';
import { UsersModule } from './features/auth/users/users.module.js';
import { RolesModule } from './features/auth/roles/roles.module.js';
import { ResourcesModule } from './features/auth/resources/resources.module.js';
import { RoleUsersModule } from './features/auth/role-users/role-users.module.js';
import { ResourceRolesModule } from './features/auth/resource-roles/resource-roles.module.js';
import { AuthModule } from './features/auth/auth/auth.module.js';

@Module({
  imports: [
    EnvironmentModule, 
    SequelizeModule, 
    BusinessModule,
    UsersModule,
    RolesModule,
    ResourcesModule,
    RoleUsersModule,
    ResourceRolesModule,
    AuthModule
  ],
  controllers: [HealthController],
  providers: [SeedersRunner],
})
export class AppModule {}
