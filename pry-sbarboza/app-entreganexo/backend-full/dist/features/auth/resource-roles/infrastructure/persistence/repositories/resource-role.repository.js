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
import { ResourceRole } from '../../../resource-role.model.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
let ResourceRoleRepository = class ResourceRoleRepository {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    get repo() { return this.sequelize.getRepository(ResourceRole); }
    async findAllActive() { return this.repo.findAll({ where: { status: 'active' } }); }
    async findAllByRole(roleId, transaction) {
        return this.repo.findAll({ where: { roleId }, transaction });
    }
    async create(data, transaction) {
        return this.repo.create(data, { transaction });
    }
    async update(resourceRole, data, transaction) {
        return resourceRole.update(data, { transaction });
    }
};
ResourceRoleRepository = __decorate([
    Injectable(),
    __param(0, Inject(SEQUELIZE)),
    __metadata("design:paramtypes", [Sequelize])
], ResourceRoleRepository);
export { ResourceRoleRepository };
//# sourceMappingURL=resource-role.repository.js.map