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
import { Op } from 'sequelize';
import { User } from '../../../user.model.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
let UserRepository = class UserRepository {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    get repo() {
        return this.sequelize.getRepository(User);
    }
    async findAllActive() {
        return this.repo.findAll({ where: { status: 'active' }, attributes: { exclude: ['password'] } });
    }
    async findById(id) {
        return this.repo.findByPk(id, { attributes: { exclude: ['password'] } });
    }
    async findByIdWithPassword(id) {
        return this.repo.findByPk(id);
    }
    async findConflicts(username, email) {
        return this.repo.findAll({
            where: {
                [Op.or]: [
                    { username: username.trim().toLowerCase() },
                    { email: email.trim().toLowerCase() }
                ]
            },
            attributes: ['id', 'username', 'email']
        });
    }
    async create(data) {
        return this.repo.create(data);
    }
    async update(user, data) {
        return user.update(data);
    }
    async delete(user) {
        await user.destroy();
    }
};
UserRepository = __decorate([
    Injectable(),
    __param(0, Inject(SEQUELIZE)),
    __metadata("design:paramtypes", [Sequelize])
], UserRepository);
export { UserRepository };
//# sourceMappingURL=user.repository.js.map