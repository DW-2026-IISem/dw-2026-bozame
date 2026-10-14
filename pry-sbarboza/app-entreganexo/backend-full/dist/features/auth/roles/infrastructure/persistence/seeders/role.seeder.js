var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RoleSeeder_1;
import { Injectable, Logger } from '@nestjs/common';
import { Role } from '../../../role.model.js';
let RoleSeeder = RoleSeeder_1 = class RoleSeeder {
    logger = new Logger(RoleSeeder_1.name);
    async seed() {
        const SEED_ROLES = [
            { name: 'ADMIN', description: 'Administración del sistema' },
            { name: 'SELLER', description: 'Operación de ventas' },
        ];
        let created = 0;
        for (const item of SEED_ROLES) {
            const [role, wasCreated] = await Role.findOrCreate({
                where: { name: item.name },
                defaults: { ...item, status: 'active' },
            });
            if (wasCreated)
                created++;
            else if (role.status !== 'active')
                await role.update({ status: 'active' });
        }
        this.logger.log(`Seeder roles: catálogo reconciliado (${created} nuevos)`);
    }
};
RoleSeeder = RoleSeeder_1 = __decorate([
    Injectable()
], RoleSeeder);
export { RoleSeeder };
//# sourceMappingURL=role.seeder.js.map