import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Resource } from '../../../resource.model.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';

@Injectable()
export class ResourceRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}
  private get repo() { return this.sequelize.getRepository(Resource); }
  
  async findAllActive(): Promise<Resource[]> { return this.repo.findAll({ where: { status: 'active' } }); }
  async findById(id: number): Promise<Resource | null> { return this.repo.findByPk(id); }
  async findByOperation(method: string, path: string): Promise<Resource | null> {
    return this.repo.findOne({ where: { method: method.trim().toUpperCase(), path: path.trim() } });
  }
  async create(data: Partial<Resource>): Promise<Resource> { return this.repo.create(data as any); }
}
