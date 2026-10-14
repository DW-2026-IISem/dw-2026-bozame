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
var _a;
import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDto } from '../../../application/dto/create-product.dto.js';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case.js';
import { GetProductsUseCase } from '../../../application/use-cases/get-products.use-case.js';
import { JwtAuthGuard } from '../../../../../../common/guards/jwt-auth.guard.js';
import { RbacGuard } from '../../../../../../common/guards/rbac.guard.js';
let ProductsController = class ProductsController {
    createProduct;
    getProducts;
    constructor(createProduct, getProducts) {
        this.createProduct = createProduct;
        this.getProducts = getProducts;
    }
    async create(dto) {
        const product = await this.createProduct.execute(dto);
        return { product };
    }
    async list() {
        const products = await this.getProducts.findAll();
        return { products };
    }
    async findOne(id) {
        const product = await this.getProducts.findOne(id);
        return { product };
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "list", null);
__decorate([
    Get(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
ProductsController = __decorate([
    ApiTags('products'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RbacGuard),
    Controller('productos'),
    __metadata("design:paramtypes", [CreateProductUseCase, typeof (_a = typeof GetProductsUseCase !== "undefined" && GetProductsUseCase) === "function" ? _a : Object])
], ProductsController);
export { ProductsController };
//# sourceMappingURL=products.controller.js.map