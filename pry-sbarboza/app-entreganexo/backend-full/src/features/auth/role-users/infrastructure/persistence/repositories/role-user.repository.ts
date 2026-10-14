import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { RoleUser } from '../../../role-user.model.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';

@Injectable()
export class RoleUserRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}
  private get repo() { return this.sequelize.getRepository(RoleUser); }

  async findAllActive(): Promise<RoleUser[]> { return this.repo.findAll({ where: { status: 'active' } }); }
  async findById(id: number): Promise<RoleUser | null> { return this.repo.findByPk(id); }
  async findByUserAndRole(userId: number, roleId: number): Promise<RoleUser | null> {
    return this.repo.findOne({ where: { userId, roleId } });
  }
  async create(data: Partial<RoleUser>): Promise<RoleUser> { return this.repo.create(data as any); }
  async update(roleUser: RoleUser, data: Partial<RoleUser>): Promise<RoleUser> { return roleUser.update(data); }
}
