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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '../../../application/dto/create-user.dto.js';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case.js';
import { GetUsersUseCase } from '../../../application/use-cases/get-users.use-case.js';
let UsersController = class UsersController {
    createUser;
    getUsers;
    constructor(createUser, getUsers) {
        this.createUser = createUser;
        this.getUsers = getUsers;
    }
    async create(dto) {
        const user = await this.createUser.execute(dto);
        return { user };
    }
    async list() {
        const users = await this.getUsers.findAll();
        return { users };
    }
    async findOne(id) {
        const user = await this.getUsers.findOne(id);
        return { user };
    }
};
__decorate([
    Post(),
    HttpCode(201),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "list", null);
__decorate([
    Get(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
UsersController = __decorate([
    ApiTags('users'),
    ApiBearerAuth(),
    Controller('usuarios'),
    __metadata("design:paramtypes", [CreateUserUseCase,
        GetUsersUseCase])
], UsersController);
export { UsersController };
//# sourceMappingURL=users.controller.js.map