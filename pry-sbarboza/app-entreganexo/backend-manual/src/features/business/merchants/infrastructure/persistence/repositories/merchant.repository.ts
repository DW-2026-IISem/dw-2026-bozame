import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { Merchant } from '../../../domain/entities/merchant.entity.js';
import { IMerchantRepository } from '../../../domain/interfaces/merchant.repository.js';
import { MerchantModel } from '../models/merchant.model.js';

@Injectable()
export class MerchantRepository implements IMerchantRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() {
    return this.sequelize.getRepository(MerchantModel);
  }

  async create(merchant: Merchant): Promise<Merchant> {
    const created = await this.repo.create({
      name: merchant.name,
      description: merchant.description,
      isActive: merchant.isActive,
    });
    return this.toDomain(created);
  }

  async findAll(page: number, limit: number) {
    const { rows, count } = await this.repo.findAndCountAll({
      offset: (page - 1) * limit,
      limit,
      order: [['id', 'ASC']],
    });
    return { items: rows.map((r) => this.toDomain(r)), total: count };
  }

  async findById(id: number): Promise<Merchant | null> {
    const found = await this.repo.findByPk(id);
    return found ? this.toDomain(found) : null;
  }

  async findByName(name: string): Promise<Merchant | null> {
    const found = await this.repo.findOne({ where: { name } });
    return found ? this.toDomain(found) : null;
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  private toDomain(m: MerchantModel): Merchant {
    return new Merchant({
      id: m.id,
      name: m.name,
      description: m.description ?? null,
      isActive: m.isActive,
    });
  }
}
