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
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../../application/services/auth.service.js';
import { JwtAuthGuard } from '../../../../../../common/guards/jwt-auth.guard.js';
let PermisosController = class PermisosController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async getPermissions(req) {
        const user = req.auth;
        return this.authService.getPermissions(user.id);
    }
};
__decorate([
    Get(),
    UseGuards(JwtAuthGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "getPermissions", null);
PermisosController = __decorate([
    ApiTags('permisos'),
    Controller('permisos'),
    __metadata("design:paramtypes", [AuthService])
], PermisosController);
export { PermisosController };
//# sourceMappingURL=permisos.controller.js.map