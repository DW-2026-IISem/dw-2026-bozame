import { Injectable, Logger } from '@nestjs/common';
import { Role } from '../../role.model.js';

@Injectable()
export class RoleSeeder {
  private readonly logger = new Logger(RoleSeeder.name);

  async seed(): Promise<void> {
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
      if (wasCreated) created++;
      else if (role.status !== 'active') await role.update({ status: 'active' });
    }
    this.logger.log(`Seeder roles: catálogo reconciliado (${created} nuevos)`);
  }
}
