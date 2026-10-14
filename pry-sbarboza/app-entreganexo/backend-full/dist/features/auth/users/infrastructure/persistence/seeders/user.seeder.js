var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UserSeeder_1;
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../../../user.model.js';
let UserSeeder = UserSeeder_1 = class UserSeeder {
    logger = new Logger(UserSeeder_1.name);
    async seed() {
        const SEED_USERS = [
            { username: 'admin', email: 'admin@storelab.local', password: 'Admin123!' },
            { username: 'seller', email: 'seller@storelab.local', password: 'Seller123!' },
        ];
        let created = 0;
        for (const item of SEED_USERS) {
            const [user, wasCreated] = await User.findOrCreate({
                where: { username: item.username },
                defaults: { ...item, status: 'active' },
            });
            if (wasCreated) {
                created++;
            }
            else if (user.status !== 'active') {
                await user.update({ status: 'active' });
            }
        }
        if (created > 0) {
            this.logger.log(`Seeder users: insertados ${created} usuario(s) canónico(s)`);
        }
        else {
            this.logger.log(`Seeder users: usuarios canónicos ya existían (idempotente)`);
        }
    }
};
UserSeeder = UserSeeder_1 = __decorate([
    Injectable()
], UserSeeder);
export { UserSeeder };
//# sourceMappingURL=user.seeder.js.map