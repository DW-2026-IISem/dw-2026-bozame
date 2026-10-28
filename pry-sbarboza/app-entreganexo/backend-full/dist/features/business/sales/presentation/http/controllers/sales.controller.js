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
import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSaleDto } from '../../../application/dto/create-sale.dto.js';
import { CreateSaleUseCase } from '../../../application/use-cases/create-sale.use-case.js';
import { GetSaleByIdUseCase } from '../../../application/use-cases/get-sale-by-id.use-case.js';
import { ListSalesUseCase } from '../../../application/use-cases/list-sales.use-case.js';
import { SaleMapper } from '../../../application/mappers/sale.mapper.js';
import { SaleModel } from '../../../infrastructure/persistence/models/sale.model.js';
let SalesController = class SalesController {
    createSale;
    getSale;
    listSales;
    constructor(createSale, getSale, listSales) {
        this.createSale = createSale;
        this.getSale = getSale;
        this.listSales = listSales;
    }
    async create(dto) {
        const sale = await this.createSale.execute(dto);
        return SaleMapper.toResponse(sale);
    }
    async list(page = '1', limit = '10') {
        return this.listSales.execute(Number(page), Number(limit));
    }
    async findOne(id) {
        const sale = await this.getSale.execute(id);
        return SaleMapper.toResponse(sale);
    }
    async deactivate(id) {
        const found = await SaleModel.findByPk(id);
        if (found) {
            await found.update({ status: 'canceled' });
        }
        return { success: true };
    }
    async remove(id) {
        const found = await SaleModel.findByPk(id);
        if (found) {
            await found.destroy();
        }
        return { success: true };
    }
};
__decorate([
    Post(),
    HttpCode(201),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSaleDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "list", null);
__decorate([
    Get(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "findOne", null);
__decorate([
    Patch(':id/deactivate'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "deactivate", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "remove", null);
SalesController = __decorate([
    ApiTags('sales'),
    Controller(['sales', 'ventas']),
    __metadata("design:paramtypes", [CreateSaleUseCase,
        GetSaleByIdUseCase,
        ListSalesUseCase])
], SalesController);
export { SalesController };
//# sourceMappingURL=sales.controller.js.map