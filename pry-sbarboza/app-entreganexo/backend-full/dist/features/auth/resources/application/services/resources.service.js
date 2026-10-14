var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ResourceRepository } from '../../infrastructure/persistence/repositories/resource.repository.js';
let ResourcesService = class ResourcesService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        const existing = await this.repo.findByOperation(dto.method, dto.path);
        if (existing)
            throw new ConflictException(`Resource ${dto.method.toUpperCase()} ${dto.path} already exists`);
        let cleanPath = dto.path.split('?')[0].split('#')[0].replace(/\/{2,}/g, '/').replace(/\/+$/, '');
        if (cleanPath === '')
            cleanPath = '/';
        return this.repo.create({ ...dto, method: dto.method.trim().toUpperCase(), path: cleanPath, status: 'active' });
    }
    async findAll() { return this.repo.findAllActive(); }
    async findOne(id) {
        const resource = await this.repo.findById(id);
        if (!resource || resource.status !== 'active')
            throw new NotFoundException('Resource not found');
        return resource;
    }
};
ResourcesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ResourceRepository])
], ResourcesService);
export { ResourcesService };
//# sourceMappingURL=resources.service.js.map