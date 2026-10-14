var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Sale } from '../../../domain/entities/sale.entity.js';
import { ProductSale } from '../../../domain/entities/product-sale.entity.js';
import { SaleModel } from '../models/sale.model.js';
import { ProductSaleModel } from '../models/product-sale.model.js';
import { ProductModel } from '../../../../products/infrastructure/persistence/models/product.model.js';
import { InsufficientStockException } from '../../../../products/domain/exceptions/product.exceptions.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
let SaleRepository = class SaleRepository {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    async create(sale) {
        const saleRepo = this.sequelize.getRepository(SaleModel);
        const psRepo = this.sequelize.getRepository(ProductSaleModel);
        const productRepo = this.sequelize.getRepository(ProductModel);
        return this.sequelize.transaction(async (t) => {
            const persistedItems = [];
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
                await product.update({ quantity: product.quantity - item.quantity }, { transaction: t });
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
    async findById(id) {
        const saleRepo = this.sequelize.getRepository(SaleModel);
        const psRepo = this.sequelize.getRepository(ProductSaleModel);
        const found = await saleRepo.findByPk(id);
        if (!found)
            return null;
        const items = await psRepo.findAll({
            where: { saleId: id },
            order: [['id', 'ASC']],
        });
        return this.toDomain(found, items);
    }
    toDomain(s, items) {
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
            status: s.status ?? 'completed',
            clientId: s.clientId,
            items: domainItems,
        });
    }
};
SaleRepository = __decorate([
    Injectable(),
    __param(0, Inject(SEQUELIZE)),
    __metadata("design:paramtypes", [Sequelize])
], SaleRepository);
export { SaleRepository };
//# sourceMappingURL=sale.repository.js.map