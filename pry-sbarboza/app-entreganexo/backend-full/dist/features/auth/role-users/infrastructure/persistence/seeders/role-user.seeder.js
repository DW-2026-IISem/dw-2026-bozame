var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RoleUserSeeder_1;
import { Injectable, Logger } from '@nestjs/common';
import { RoleUser } from '../../../role-user.model.js';
import { User } from '../../../../users/user.model.js';
import { Role } from '../../../../roles/role.model.js';
let RoleUserSeeder = RoleUserSeeder_1 = class RoleUserSeeder {
    logger = new Logger(RoleUserSeeder_1.name);
    async seed() {
        const SEED_ROLE_USERS = [
            { username: 'admin', roleName: 'ADMIN' },
            { username: 'seller', roleName: 'SELLER' },
        ];
        let created = 0;
        for (const item of SEED_ROLE_USERS) {
            const user = await User.findOne({ where: { username: item.username } });
            const role = await Role.findOne({ where: { name: item.roleName } });
            if (!user || !role)
                continue;
            const [assignment, wasCreated] = await RoleUser.findOrCreate({
                where: { userId: user.id, roleId: role.id },
                defaults: { userId: user.id, roleId: role.id, status: 'active' },
            });
            if (wasCreated)
                created++;
            else if (assignment.status !== 'active')
                await assignment.update({ status: 'active' });
        }
        this.logger.log(`Seeder role_users: asignaciones reconciliadas (${created} nuevas)`);
    }
};
RoleUserSeeder = RoleUserSeeder_1 = __decorate([
    Injectable()
], RoleUserSeeder);
export { RoleUserSeeder };
//# sourceMappingURL=role-user.seeder.js.map