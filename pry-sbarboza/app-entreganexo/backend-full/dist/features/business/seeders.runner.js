var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SeedersRunner_1;
import { Injectable, Logger } from '@nestjs/common';
import { ClientSeeder } from './clients/infrastructure/persistence/seeders/client.seeder.js';
import { ProductTypeSeeder } from './product-types/infrastructure/persistence/seeders/product-type.seeder.js';
import { ProductSeeder } from './products/infrastructure/persistence/seeders/product.seeder.js';
import { UserSeeder } from '../auth/users/infrastructure/persistence/seeders/user.seeder.js';
import { RoleSeeder } from '../auth/roles/infrastructure/persistence/seeders/role.seeder.js';
import { ResourceSeeder } from '../auth/resources/infrastructure/persistence/seeders/resource.seeder.js';
import { RoleUserSeeder } from '../auth/role-users/infrastructure/persistence/seeders/role-user.seeder.js';
import { ResourceRoleSeeder } from '../auth/resource-roles/infrastructure/persistence/seeders/resource-role.seeder.js';
let SeedersRunner = SeedersRunner_1 = class SeedersRunner {
    clientSeeder;
    productTypeSeeder;
    productSeeder;
    userSeeder;
    roleSeeder;
    resourceSeeder;
    roleUserSeeder;
    resourceRoleSeeder;
    logger = new Logger(SeedersRunner_1.name);
    constructor(clientSeeder, productTypeSeeder, productSeeder, userSeeder, roleSeeder, resourceSeeder, roleUserSeeder, resourceRoleSeeder) {
        this.clientSeeder = clientSeeder;
        this.productTypeSeeder = productTypeSeeder;
        this.productSeeder = productSeeder;
        this.userSeeder = userSeeder;
        this.roleSeeder = roleSeeder;
        this.resourceSeeder = resourceSeeder;
        this.roleUserSeeder = roleUserSeeder;
        this.resourceRoleSeeder = resourceRoleSeeder;
    }
    async onApplicationBootstrap() {
        this.logger.log('Verificando datos base (Seeders)...');
        await this.userSeeder.seed();
        await this.roleSeeder.seed();
        await this.resourceSeeder.seed();
        await this.roleUserSeeder.seed();
        await this.resourceRoleSeeder.seed();
        await this.clientSeeder.seed();
        await this.productTypeSeeder.seed();
        await this.productSeeder.seed();
        this.logger.log('Seeders verificados correctamente.');
    }
};
SeedersRunner = SeedersRunner_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ClientSeeder,
        ProductTypeSeeder,
        ProductSeeder,
        UserSeeder,
        RoleSeeder,
        ResourceSeeder,
        RoleUserSeeder,
        ResourceRoleSeeder])
], SeedersRunner);
export { SeedersRunner };
//# sourceMappingURL=seeders.runner.js.map