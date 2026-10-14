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
import { ResourceRoleRepository } from '../../infrastructure/persistence/repositories/resource-role.repository.js';
import { SEQUELIZE } from '../../../../../infrastructure/database/sequelize/sequelize.module.js';
let ResourceRolesService = class ResourceRolesService {
    repo;
    sequelize;
    constructor(repo, sequelize) {
        this.repo = repo;
        this.sequelize = sequelize;
    }
    async reconcileRole(roleId, resourceIds) {
        const wanted = new Set(resourceIds);
        return this.sequelize.transaction(async (t) => {
            const existing = await this.repo.findAllByRole(roleId, t);
            const byResource = new Map(existing.map((row) => [row.resourceId, row]));
            let activated = 0;
            let deactivated = 0;
            for (const resourceId of wanted) {
                const row = byResource.get(resourceId);
                if (!row) {
                    await this.repo.create({ roleId, resourceId, status: 'active' }, t);
                    activated++;
                }
                else if (row.status !== 'active') {
                    await this.repo.update(row, { status: 'active' }, t);
                    activated++;
                }
            }
            for (const row of existing) {
                if (!wanted.has(row.resourceId) && row.status === 'active') {
                    await this.repo.update(row, { status: 'inactive' }, t);
                    deactivated++;
                }
            }
            return { role_id: roleId, activated, deactivated, total_active: wanted.size };
        });
    }
    async findAll() { return this.repo.findAllActive(); }
};
ResourceRolesService = __decorate([
    Injectable(),
    __param(1, Inject(SEQUELIZE)),
    __metadata("design:paramtypes", [ResourceRoleRepository,
        Sequelize])
], ResourceRolesService);
export { ResourceRolesService };
//# sourceMappingURL=resource-roles.service.js.map