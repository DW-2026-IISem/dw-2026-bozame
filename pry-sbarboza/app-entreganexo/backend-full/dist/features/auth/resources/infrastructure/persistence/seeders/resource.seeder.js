var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ResourceSeeder_1;
import { Injectable, Logger } from '@nestjs/common';
import { Resource } from '../../../resource.model.js';
import { RESOURCE_CATALOG } from '../../../domain/constants/resource-catalog.js';
let ResourceSeeder = ResourceSeeder_1 = class ResourceSeeder {
    logger = new Logger(ResourceSeeder_1.name);
    async seed() {
        let created = 0;
        for (const item of RESOURCE_CATALOG) {
            const [resource, wasCreated] = await Resource.findOrCreate({
                where: { method: item.method, path: item.path },
                defaults: { ...item, status: 'active' },
            });
            if (wasCreated)
                created++;
            else if (resource.status !== 'active')
                await resource.update({ status: 'active' });
        }
        this.logger.log(`Seeder resources: catálogo reconciliado (58 recursos, ${created} nuevos)`);
    }
};
ResourceSeeder = ResourceSeeder_1 = __decorate([
    Injectable()
], ResourceSeeder);
export { ResourceSeeder };
//# sourceMappingURL=resource.seeder.js.map