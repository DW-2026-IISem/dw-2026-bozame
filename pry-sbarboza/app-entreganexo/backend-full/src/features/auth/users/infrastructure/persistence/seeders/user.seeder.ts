import { Injectable, Logger } from '@nestjs/common';
import { User } from '../../../user.model.js';

@Injectable()
export class UserSeeder {
  private readonly logger = new Logger(UserSeeder.name);

  async seed(): Promise<void> {
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
      } else if (user.status !== 'active') {
        await user.update({ status: 'active' });
      }
    }

    if (created > 0) {
      this.logger.log(`Seeder users: insertados ${created} usuario(s) canónico(s)`);
    } else {
      this.logger.log(`Seeder users: usuarios canónicos ya existían (idempotente)`);
    }
  }
}
