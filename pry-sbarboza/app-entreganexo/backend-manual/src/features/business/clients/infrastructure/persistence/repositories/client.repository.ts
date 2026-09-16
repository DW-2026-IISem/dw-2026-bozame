import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { Client } from '../../../domain/entities/client.entity.js';
import { IClientRepository } from '../../../domain/interfaces/client.repository.js';
import { ClientModel } from '../models/client.model.js';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() { return this.sequelize.getRepository(ClientModel); }

  async create(client: Client): Promise<Client> {
    const created = await this.repo.create({
      documentType: client.documentType,
      documentNumber: client.documentNumber,
      name: client.name,
      phone: client.phone,
      email: client.email,
      isActive: client.isActive,
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

  async findById(id: number): Promise<Client | null> {
    const found = await this.repo.findByPk(id);
    return found ? this.toDomain(found) : null;
  }

  async findByDocument(documentNumber: string): Promise<Client | null> {
    const found = await this.repo.findOne({ where: { documentNumber } });
    return found ? this.toDomain(found) : null;
  }

  async count(): Promise<number> { return this.repo.count(); }

  private toDomain(m: ClientModel): Client {
    return new Client({
      id: m.id,
      documentType: m.documentType,
      documentNumber: m.documentNumber,
      name: m.name,
      phone: m.phone ?? null,
      email: m.email ?? null,
      isActive: m.isActive,
    });
  }
}
