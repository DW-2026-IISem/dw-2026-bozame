var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ResourceRoleSeeder_1;
import { Injectable, Logger } from '@nestjs/common';
import { ResourceRolesService } from '../../../application/services/resource-roles.service.js';
import { Resource } from '../../../../resources/resource.model.js';
import { Role } from '../../../../roles/role.model.js';
import { RESOURCE_CATALOG, SELLER_RESOURCES } from '../../../../resources/domain/constants/resource-catalog.js';
let ResourceRoleSeeder = ResourceRoleSeeder_1 = class ResourceRoleSeeder {
    service;
    logger = new Logger(ResourceRoleSeeder_1.name);
    constructor(service) {
        this.service = service;
    }
    async seed() {
        const resources = await Resource.findAll({ where: { status: 'active' } });
        const idByOperation = new Map(resources.map((r) => [`${r.method} ${r.path}`, r.id]));
        const idsFor = (catalog) => catalog.map((item) => idByOperation.get(`${item.method} ${item.path}`)).filter((id) => typeof id === 'number');
        const admin = await Role.findOne({ where: { name: 'ADMIN' } });
        if (admin) {
            const res = await this.service.reconcileRole(admin.id, idsFor(RESOURCE_CATALOG));
            this.logger.log(`ADMIN -> ${res.total_active} recursos concedidos`);
        }
        const seller = await Role.findOne({ where: { name: 'SELLER' } });
        if (seller) {
            const res = await this.service.reconcileRole(seller.id, idsFor(SELLER_RESOURCES));
            this.logger.log(`SELLER -> ${res.total_active} recursos concedidos`);
        }
    }
};
ResourceRoleSeeder = ResourceRoleSeeder_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ResourceRolesService])
], ResourceRoleSeeder);
export { ResourceRoleSeeder };
//# sourceMappingURL=resource-role.seeder.js.map