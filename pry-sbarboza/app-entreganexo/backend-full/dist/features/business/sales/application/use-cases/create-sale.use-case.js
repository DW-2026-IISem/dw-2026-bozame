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
import { Sale } from '../../domain/entities/sale.entity.js';
import { ProductSale } from '../../domain/entities/product-sale.entity.js';
import { SaleCalculator } from '../../domain/services/sale-calculator.js';
import { SALE_REPOSITORY } from '../../domain/interfaces/sale.repository.js';
import { EmptySaleException } from '../../domain/exceptions/sale.exceptions.js';
import { CLIENT_REPOSITORY } from '../../../clients/domain/interfaces/client.repository.js';
import { ClientNotFoundException } from '../../../clients/domain/exceptions/client.exceptions.js';
import { PRODUCT_REPOSITORY } from '../../../products/domain/interfaces/product.repository.js';
import { ProductNotFoundException } from '../../../products/domain/exceptions/product.exceptions.js';
let CreateSaleUseCase = class CreateSaleUseCase {
    saleRepo;
    clientRepo;
    productRepo;
    calculator = new SaleCalculator();
    constructor(saleRepo, clientRepo, productRepo) {
        this.saleRepo = saleRepo;
        this.clientRepo = clientRepo;
        this.productRepo = productRepo;
    }
    async execute(dto) {
        const client = await this.clientRepo.findById(dto.clientId);
        if (!client)
            throw new ClientNotFoundException(dto.clientId);
        if (!dto.items || dto.items.length === 0)
            throw new EmptySaleException();
        const products = new Map();
        for (const it of dto.items) {
            const product = await this.productRepo.findById(it.productId);
            if (!product)
                throw new ProductNotFoundException(it.productId);
            products.set(it.productId, product);
        }
        const items = dto.items.map((it) => {
            const product = products.get(it.productId);
            const unitPrice = it.unitPrice ?? product.price;
            product.reduceStock(it.quantity);
            return new ProductSale({
                productId: it.productId,
                quantity: it.quantity,
                unitPrice,
                total: it.quantity * unitPrice,
            });
        });
        const subtotal = this.calculator.subtotal(items);
        const tax = dto.tax ?? 0;
        const discounts = dto.discounts ?? 0;
        const total = this.calculator.total(subtotal, tax, discounts);
        return this.saleRepo.create(new Sale({
            clientId: dto.clientId,
            subtotal,
            tax,
            discounts,
            total,
            status: 'completed',
            items,
        }));
    }
};
CreateSaleUseCase = __decorate([
    Injectable(),
    __param(0, Inject(SALE_REPOSITORY)),
    __param(1, Inject(CLIENT_REPOSITORY)),
    __param(2, Inject(PRODUCT_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateSaleUseCase);
export { CreateSaleUseCase };
//# sourceMappingURL=create-sale.use-case.js.map