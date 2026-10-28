import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Sale, SaleStatus } from '../../../domain/entities/sale.entity.js';
import { ProductSale } from '../../../domain/entities/product-sale.entity.js';
import type { ISaleRepository } from '../../../domain/interfaces/sale.repository.js';
import { SaleModel } from '../models/sale.model.js';
import { ProductSaleModel } from '../models/product-sale.model.js';
import { ProductModel } from '../../../../products/infrastructure/persistence/models/product.model.js';
import { InsufficientStockException } from '../../../../products/domain/exceptions/product.exceptions.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';

@Injectable()
export class SaleRepository implements ISaleRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  async create(sale: Sale): Promise<Sale> {
    const saleRepo = this.sequelize.getRepository(SaleModel);
    const psRepo = this.sequelize.getRepository(ProductSaleModel);
    const productRepo = this.sequelize.getRepository(ProductModel);

    return this.sequelize.transaction(async (t) => {
      const persistedItems: ProductSaleModel[] = [];

      for (const item of sale.items) {
        const product = await productRepo.findByPk(item.productId, {
          lock: Transaction.LOCK.UPDATE,
          transaction: t,
        });

        if (!product) {
          throw new Error(`Producto ${item.productId} desapareció durante la transacción`);
        }

        if (product.quantity < item.quantity) {
          throw new InsufficientStockException(item.productId, product.quantity, item.quantity);
        }

        await product.update(
          { quantity: product.quantity - item.quantity },
          { transaction: t }
        );
      }

      const createdSale = await saleRepo.create({
        saleDate: sale.saleDate,
        subtotal: sale.subtotal,
        tax: sale.tax,
        discounts: sale.discounts,
        total: sale.total,
        status: sale.status,
        clientId: sale.clientId,
      }, { transaction: t });

      for (const item of sale.items) {
        const createdItem = await psRepo.create({
          saleId: createdSale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        }, { transaction: t });
        persistedItems.push(createdItem);
      }

      return this.toDomain(createdSale, persistedItems);
    });
  }

  async findById(id: number): Promise<Sale | null> {
    const saleRepo = this.sequelize.getRepository(SaleModel);
    const psRepo = this.sequelize.getRepository(ProductSaleModel);

    const found = await saleRepo.findByPk(id);
    if (!found) return null;

    const items = await psRepo.findAll({
      where: { saleId: id },
      order: [['id', 'ASC']],
    });

    return this.toDomain(found, items);
  }

  async findAll(page = 1, limit = 10): Promise<{ items: Sale[]; total: number }> {
    const saleRepo = this.sequelize.getRepository(SaleModel);
    const psRepo = this.sequelize.getRepository(ProductSaleModel);

    const offset = (page - 1) * limit;
    const { rows, count } = await saleRepo.findAndCountAll({
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    const items = await Promise.all(
      rows.map(async (sale) => {
        const saleItems = await psRepo.findAll({
          where: { saleId: sale.id },
          order: [['id', 'ASC']],
        });
        return this.toDomain(sale, saleItems);
      }),
    );

    return { items, total: count };
  }

  private toDomain(s: SaleModel, items: ProductSaleModel[]): Sale {
    const domainItems = items.map(i => new ProductSale({
      id: i.id,
      saleId: i.saleId,
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
      total: Number(i.total),
    }));

    return new Sale({
      id: s.id,
      saleDate: s.saleDate,
      subtotal: Number(s.subtotal),
      tax: Number(s.tax),
      discounts: Number(s.discounts),
      total: Number(s.total),
      status: (s.status as SaleStatus) ?? 'completed',
      clientId: s.clientId,
      items: domainItems,
    });
  }
}
