import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ResourceRoleRepository } from '../../infrastructure/persistence/repositories/resource-role.repository.js';
import { SEQUELIZE } from '../../../../../infrastructure/database/sequelize/sequelize.module.js';

@Injectable()
export class ResourceRolesService {
  constructor(
    private readonly repo: ResourceRoleRepository,
    @Inject(SEQUELIZE) private readonly sequelize: Sequelize
  ) {}

  async reconcileRole(roleId: number, resourceIds: number[]) {
    const wanted = new Set(resourceIds);
    return this.sequelize.transaction(async (t) => {
      const existing = await this.repo.findAllByRole(roleId, t);
      const byResource = new Map(existing.map((row) => [row.resourceId, row]));
      
      let activated = 0; let deactivated = 0;

      for (const resourceId of wanted) {
        const row = byResource.get(resourceId);
        if (!row) {
          await this.repo.create({ roleId, resourceId, status: 'active' }, t);
          activated++;
        } else if (row.status !== 'active') {
          await this.repo.update(row, { status: 'active' }, t);
          activated++;
        }
      }

      for (const row of existing) {
        if (!wanted.has(row.resourceId) && row.status === 'active') {
          await this.repo.update(row, { status: 'inactive' }, t);
          deactivated++;
        }
      }
      return { role_id: roleId, activated, deactivated, total_active: wanted.size };
    });
  }

  async findAll() { return this.repo.findAllActive(); }
}
