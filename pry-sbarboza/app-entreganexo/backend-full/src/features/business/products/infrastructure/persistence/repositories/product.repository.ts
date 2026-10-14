import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Product, ProductStatus } from '../../../domain/entities/product.entity.js';
import type { IProductRepository } from '../../../domain/interfaces/product.repository.js';
import { ProductModel } from '../models/product.model.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() {
    return this.sequelize.getRepository(ProductModel);
  }

  async create(p: Product): Promise<Product> {
    const created = await this.repo.create({
      name: p.name,
      brand: p.brand,
      price: p.price,
      minStock: p.minStock,
      quantity: p.quantity,
      productTypeId: p.productTypeId,
      status: p.status,
    });
    return this.toDomain(created);
  }

  async findAll(page: number, limit: number): Promise<{ items: Product[]; total: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await this.repo.findAndCountAll({ offset, limit });
    return { items: rows.map(r => this.toDomain(r)), total: count };
  }

  async findById(id: number): Promise<Product | null> {
    const found = await this.repo.findByPk(id);
    return found ? this.toDomain(found) : null;
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  private toDomain(m: ProductModel): Product {
    return new Product({
      id: m.id,
      name: m.name,
      brand: m.brand ?? null,
      price: Number(m.price),
      minStock: m.minStock,
      quantity: m.quantity,
      productTypeId: m.productTypeId,
      status: (m.status as ProductStatus) ?? 'active',
    });
  }
}
