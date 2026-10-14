import { Injectable, Logger } from '@nestjs/common';
import { ResourceRolesService } from '../../../application/services/resource-roles.service.js';
import { Resource } from '../../../../resources/resource.model.js';
import { Role } from '../../../../roles/role.model.js';
import { RESOURCE_CATALOG, SELLER_RESOURCES } from '../../../../resources/domain/constants/resource-catalog.js';

@Injectable()
export class ResourceRoleSeeder {
  private readonly logger = new Logger(ResourceRoleSeeder.name);
  constructor(private readonly service: ResourceRolesService) {}

  async seed(): Promise<void> {
    const resources = await Resource.findAll({ where: { status: 'active' } });
    const idByOperation = new Map(resources.map((r) => [`${r.method} ${r.path}`, r.id]));

    const idsFor = (catalog: ReadonlyArray<{ method: string; path: string }>) =>
      catalog.map((item) => idByOperation.get(`${item.method} ${item.path}`)).filter((id): id is number => typeof id === 'number');

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
}
