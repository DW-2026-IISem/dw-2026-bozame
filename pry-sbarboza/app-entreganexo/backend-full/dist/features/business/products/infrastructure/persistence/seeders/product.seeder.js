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
var ProductSeeder_1;
import { Injectable, Inject, Logger } from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity.js';
import { PRODUCT_REPOSITORY } from '../../../domain/interfaces/product.repository.js';
import { PRODUCT_TYPE_REPOSITORY } from '../../../../product-types/domain/interfaces/product-type.repository.js';
let ProductSeeder = ProductSeeder_1 = class ProductSeeder {
    productRepo;
    typeRepo;
    logger = new Logger(ProductSeeder_1.name);
    constructor(productRepo, typeRepo) {
        this.productRepo = productRepo;
        this.typeRepo = typeRepo;
    }
    async seed() {
        const { items: types } = await this.typeRepo.findAll(1, 100);
        const activeType = types.find((t) => t.status === 'active');
        if (!activeType || activeType.id === null) {
            this.logger.warn('Seeder products: No hay tipos de producto activos, omitiendo.');
            return;
        }
        const { items: existingProducts } = await this.productRepo.findAll(1, 100);
        const demoExists = existingProducts.some(p => p.name === 'Producto Demo' && p.productTypeId === activeType.id);
        if (demoExists) {
            this.logger.log('Seeder products: ya existía el producto demo');
            return;
        }
        await this.productRepo.create(new Product({
            name: 'Producto Demo',
            brand: 'Marca Demo',
            price: 15000,
            minStock: 5,
            quantity: 50,
            productTypeId: activeType.id,
            status: 'active',
        }));
        this.logger.log('Seeder products: Producto demo creado');
    }
};
ProductSeeder = ProductSeeder_1 = __decorate([
    Injectable(),
    __param(0, Inject(PRODUCT_REPOSITORY)),
    __param(1, Inject(PRODUCT_TYPE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], ProductSeeder);
export { ProductSeeder };
//# sourceMappingURL=product.seeder.js.map