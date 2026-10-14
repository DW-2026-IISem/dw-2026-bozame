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
import { Controller, Get, Post, Patch, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRoleUserDto } from '../../../application/dto/create-role-user.dto.js';
import { RoleUsersService } from '../../../application/services/role-users.service.js';
let RoleUsersController = class RoleUsersController {
    service;
    constructor(service) {
        this.service = service;
    }
    async assign(dto) {
        const assignment = await this.service.assign(dto);
        return { assignment };
    }
    async list() {
        const assignments = await this.service.findAll();
        return { assignments };
    }
    async deactivate(id) {
        const assignment = await this.service.deactivate(id);
        return { message: "Asignación desactivada", assignment };
    }
};
__decorate([
    Post(),
    HttpCode(201),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRoleUserDto]),
    __metadata("design:returntype", Promise)
], RoleUsersController.prototype, "assign", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoleUsersController.prototype, "list", null);
__decorate([
    Patch(':id/deactivate'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RoleUsersController.prototype, "deactivate", null);
RoleUsersController = __decorate([
    ApiTags('role-users'),
    Controller('asignaciones-rol'),
    __metadata("design:paramtypes", [RoleUsersService])
], RoleUsersController);
export { RoleUsersController };
//# sourceMappingURL=role-users.controller.js.map