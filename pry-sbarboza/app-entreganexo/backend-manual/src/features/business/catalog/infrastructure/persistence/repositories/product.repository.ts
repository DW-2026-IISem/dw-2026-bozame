import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { Product } from '../../../domain/entities/product.entity.js';
import { IProductRepository } from '../../../domain/interfaces/product.repository.js';
import { ProductModel } from '../models/product.model.js';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() { return this.sequelize.getRepository(ProductModel); }

  async create(p: Product): Promise<Product> {
    const created = await this.repo.create({
      sku: p.sku,
      name: p.name,
      description: p.description,
      price: p.price,
      isActive: p.isActive,
      merchantId: p.merchantId,
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

  async findById(id: number): Promise<Product | null> {
    const found = await this.repo.findByPk(id);
    return found ? this.toDomain(found) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const found = await this.repo.findOne({ where: { sku } });
    return found ? this.toDomain(found) : null;
  }

  async count(): Promise<number> { return this.repo.count(); }

  private toDomain(m: ProductModel): Product {
    return new Product({
      id: m.id,
      sku: m.sku,
      name: m.name,
      description: m.description ?? null,
      price: Number(m.price),
      isActive: m.isActive,
      merchantId: m.merchantId,
    });
  }
}
