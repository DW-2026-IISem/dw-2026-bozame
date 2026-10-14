import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { ResourceRole } from '../../../resource-role.model.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';

@Injectable()
export class ResourceRoleRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}
  private get repo() { return this.sequelize.getRepository(ResourceRole); }

  async findAllActive(): Promise<ResourceRole[]> { return this.repo.findAll({ where: { status: 'active' } }); }
  async findAllByRole(roleId: number, transaction?: Transaction): Promise<ResourceRole[]> {
    return this.repo.findAll({ where: { roleId }, transaction });
  }
  async create(data: Partial<ResourceRole>, transaction?: Transaction): Promise<ResourceRole> {
    return this.repo.create(data as any, { transaction });
  }
  async update(resourceRole: ResourceRole, data: Partial<ResourceRole>, transaction?: Transaction): Promise<ResourceRole> {
    return resourceRole.update(data, { transaction });
  }
}
