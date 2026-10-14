import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { User } from '../../../user.model.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';

@Injectable()
export class UserRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() {
    return this.sequelize.getRepository(User);
  }

  async findAllActive(): Promise<User[]> {
    return this.repo.findAll({ where: { status: 'active' }, attributes: { exclude: ['password'] } });
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findByPk(id, { attributes: { exclude: ['password'] } });
  }

  async findByIdWithPassword(id: number): Promise<User | null> {
    return this.repo.findByPk(id);
  }

  async findConflicts(username: string, email: string): Promise<User[]> {
    return this.repo.findAll({
      where: {
        [Op.or]: [
          { username: username.trim().toLowerCase() },
          { email: email.trim().toLowerCase() }
        ]
      },
      attributes: ['id', 'username', 'email']
    });
  }

  async create(data: Partial<User>): Promise<User> {
    return this.repo.create(data as any);
  }

  async update(user: User, data: Partial<User>): Promise<User> {
    return user.update(data);
  }

  async delete(user: User): Promise<void> {
    await user.destroy();
  }
}
