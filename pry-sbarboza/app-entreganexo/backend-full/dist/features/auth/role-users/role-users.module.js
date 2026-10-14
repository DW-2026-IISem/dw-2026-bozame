var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { RoleUsersController } from './presentation/http/controllers/role-users.controller.js';
import { RoleUsersService } from './application/services/role-users.service.js';
import { RoleUserRepository } from './infrastructure/persistence/repositories/role-user.repository.js';
import { RoleUserSeeder } from './infrastructure/persistence/seeders/role-user.seeder.js';
let RoleUsersModule = class RoleUsersModule {
};
RoleUsersModule = __decorate([
    Module({
        controllers: [RoleUsersController],
        providers: [RoleUsersService, RoleUserRepository, RoleUserSeeder],
        exports: [RoleUserSeeder],
    })
], RoleUsersModule);
export { RoleUsersModule };
//# sourceMappingURL=role-users.module.js.map