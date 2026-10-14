import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Role } from '../../role.model.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';

@Injectable()
export class RoleRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}
  private get repo() { return this.sequelize.getRepository(Role); }
  
  async findAllActive(): Promise<Role[]> { return this.repo.findAll({ where: { status: 'active' } }); }
  async findById(id: number): Promise<Role | null> { return this.repo.findByPk(id); }
  async findByName(name: string): Promise<Role | null> { return this.repo.findOne({ where: { name: name.trim().toUpperCase() } }); }
  async create(data: Partial<Role>): Promise<Role> { return this.repo.create(data as any); }
  async update(role: Role, data: Partial<Role>): Promise<Role> { return role.update(data); }
}
