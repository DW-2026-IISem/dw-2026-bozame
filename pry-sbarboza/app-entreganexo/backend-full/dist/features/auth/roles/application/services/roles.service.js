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
import { RoleRepository } from '../../infrastructure/persistence/repositories/role.repository.js';
let RolesService = class RolesService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        const existing = await this.repo.findByName(dto.name);
        if (existing)
            throw new ConflictException('Role name already in use');
        return this.repo.create({ ...dto, name: dto.name.trim().toUpperCase(), status: 'active' });
    }
    async findAll() { return this.repo.findAllActive(); }
    async findOne(id) {
        const role = await this.repo.findById(id);
        if (!role || role.status !== 'active')
            throw new NotFoundException('Role not found');
        return role;
    }
};
RolesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [RoleRepository])
], RolesService);
export { RolesService };
//# sourceMappingURL=roles.service.js.map