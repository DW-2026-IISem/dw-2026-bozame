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
import { RoleUserRepository } from '../../infrastructure/persistence/repositories/role-user.repository.js';
let RoleUsersService = class RoleUsersService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async assign(dto) {
        const existing = await this.repo.findByUserAndRole(dto.user_id, dto.role_id);
        if (existing) {
            if (existing.status === 'active')
                throw new ConflictException('El rol ya está asignado a este usuario');
            return this.repo.update(existing, { status: 'active' });
        }
        return this.repo.create({ userId: dto.user_id, roleId: dto.role_id, status: 'active' });
    }
    async findAll() { return this.repo.findAllActive(); }
    async deactivate(id) {
        const assignment = await this.repo.findById(id);
        if (!assignment || assignment.status !== 'active')
            throw new NotFoundException('Asignación no encontrada');
        return this.repo.update(assignment, { status: 'inactive' });
    }
};
RoleUsersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [RoleUserRepository])
], RoleUsersService);
export { RoleUsersService };
//# sourceMappingURL=role-users.service.js.map