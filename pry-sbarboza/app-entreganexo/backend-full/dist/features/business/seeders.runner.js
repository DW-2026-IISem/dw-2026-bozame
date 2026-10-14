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
let SeedersRunner = SeedersRunner_1 = class SeedersRunner {
    clientSeeder;
    productTypeSeeder;
    productSeeder;
    userSeeder;
    logger = new Logger(SeedersRunner_1.name);
    constructor(clientSeeder, productTypeSeeder, productSeeder, userSeeder) {
        this.clientSeeder = clientSeeder;
        this.productTypeSeeder = productTypeSeeder;
        this.productSeeder = productSeeder;
        this.userSeeder = userSeeder;
    }
    async onApplicationBootstrap() {
        this.logger.log('Verificando datos base (Seeders)...');
        await this.userSeeder.seed();
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
        UserSeeder])
], SeedersRunner);
export { SeedersRunner };
//# sourceMappingURL=seeders.runner.js.map