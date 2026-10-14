import { Injectable, Logger } from '@nestjs/common';
import { RoleUser } from '../../../role-user.model.js';
import { User } from '../../../../users/user.model.js';
import { Role } from '../../../../roles/role.model.js';

@Injectable()
export class RoleUserSeeder {
  private readonly logger = new Logger(RoleUserSeeder.name);

  async seed(): Promise<void> {
    const SEED_ROLE_USERS = [
      { username: 'admin', roleName: 'ADMIN' },
      { username: 'seller', roleName: 'SELLER' },
    ];
    let created = 0;
    for (const item of SEED_ROLE_USERS) {
      const user = await User.findOne({ where: { username: item.username } });
      const role = await Role.findOne({ where: { name: item.roleName } });
      if (!user || !role) continue;

      const [assignment, wasCreated] = await RoleUser.findOrCreate({
        where: { userId: user.id, roleId: role.id },
        defaults: { userId: user.id, roleId: role.id, status: 'active' },
      });
      if (wasCreated) created++;
      else if (assignment.status !== 'active') await assignment.update({ status: 'active' });
    }
    this.logger.log(`Seeder role_users: asignaciones reconciliadas (${created} nuevas)`);
  }
}
