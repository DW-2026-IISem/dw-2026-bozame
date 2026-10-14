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
import { Product } from '../../../domain/entities/product.entity.js';
import { ProductModel } from '../models/product.model.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
let ProductRepository = class ProductRepository {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    get repo() {
        return this.sequelize.getRepository(ProductModel);
    }
    async create(p) {
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
    async findAll(page, limit) {
        const offset = (page - 1) * limit;
        const { rows, count } = await this.repo.findAndCountAll({ offset, limit });
        return { items: rows.map(r => this.toDomain(r)), total: count };
    }
    async findById(id) {
        const found = await this.repo.findByPk(id);
        return found ? this.toDomain(found) : null;
    }
    async count() {
        return this.repo.count();
    }
    toDomain(m) {
        return new Product({
            id: m.id,
            name: m.name,
            brand: m.brand ?? null,
            price: Number(m.price),
            minStock: m.minStock,
            quantity: m.quantity,
            productTypeId: m.productTypeId,
            status: m.status ?? 'active',
        });
    }
};
ProductRepository = __decorate([
    Injectable(),
    __param(0, Inject(SEQUELIZE)),
    __metadata("design:paramtypes", [Sequelize])
], ProductRepository);
export { ProductRepository };
//# sourceMappingURL=product.repository.js.map