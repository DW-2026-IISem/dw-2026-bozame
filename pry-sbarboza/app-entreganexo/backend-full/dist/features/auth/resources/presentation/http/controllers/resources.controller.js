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
import { Controller, Get, Post, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateResourceDto } from '../../../application/dto/create-resource.dto.js';
import { ResourcesService } from '../../../application/services/resources.service.js';
let ResourcesController = class ResourcesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(dto) {
        const resource = await this.service.create(dto);
        return { resource };
    }
    async list() {
        const resources = await this.service.findAll();
        return { resources };
    }
    async findOne(id) {
        const resource = await this.service.findOne(id);
        return { resource };
    }
};
__decorate([
    Post(),
    HttpCode(201),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateResourceDto]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "list", null);
__decorate([
    Get(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "findOne", null);
ResourcesController = __decorate([
    ApiTags('resources'),
    Controller('recursos'),
    __metadata("design:paramtypes", [ResourcesService])
], ResourcesController);
export { ResourcesController };
//# sourceMappingURL=resources.controller.js.map