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
import { Role } from '../../../role.model.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
let RoleRepository = class RoleRepository {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    get repo() { return this.sequelize.getRepository(Role); }
    async findAllActive() { return this.repo.findAll({ where: { status: 'active' } }); }
    async findById(id) { return this.repo.findByPk(id); }
    async findByName(name) { return this.repo.findOne({ where: { name: name.trim().toUpperCase() } }); }
    async create(data) { return this.repo.create(data); }
    async update(role, data) { return role.update(data); }
};
RoleRepository = __decorate([
    Injectable(),
    __param(0, Inject(SEQUELIZE)),
    __metadata("design:paramtypes", [Sequelize])
], RoleRepository);
export { RoleRepository };
//# sourceMappingURL=role.repository.js.map