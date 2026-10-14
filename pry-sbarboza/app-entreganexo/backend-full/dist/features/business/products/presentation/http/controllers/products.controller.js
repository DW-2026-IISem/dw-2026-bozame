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
import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../../../common/guards/jwt-auth.guard.js';
import { RbacGuard } from '../../../../../../common/guards/rbac.guard.js';
import { CreateProductDto } from '../../../application/dto/create-product.dto.js';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case.js';
import { ListProductsUseCase } from '../../../application/use-cases/list-products.use-case.js';
import { GetProductByIdUseCase } from '../../../application/use-cases/get-product-by-id.use-case.js';
let ProductsController = class ProductsController {
    createProduct;
    listProducts;
    getProductById;
    constructor(createProduct, listProducts, getProductById) {
        this.createProduct = createProduct;
        this.listProducts = listProducts;
        this.getProductById = getProductById;
    }
    async create(dto) {
        const product = await this.createProduct.execute(dto);
        return { product };
    }
    async list(page = '1', limit = '10') {
        const products = await this.listProducts.execute(Number(page), Number(limit));
        return { products };
    }
    async findOne(id) {
        const product = await this.getProductById.execute(id);
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
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
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
    __metadata("design:paramtypes", [CreateProductUseCase,
        ListProductsUseCase,
        GetProductByIdUseCase])
], ProductsController);
export { ProductsController };
//# sourceMappingURL=products.controller.js.map