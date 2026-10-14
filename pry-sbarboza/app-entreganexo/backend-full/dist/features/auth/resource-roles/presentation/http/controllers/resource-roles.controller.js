var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResourceRolesService } from '../../../application/services/resource-roles.service.js';
let ResourceRolesController = class ResourceRolesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async list() {
        const grants = await this.service.findAll();
        return { grants };
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResourceRolesController.prototype, "list", null);
ResourceRolesController = __decorate([
    ApiTags('resource-roles'),
    Controller('concesiones-rol'),
    __metadata("design:paramtypes", [ResourceRolesService])
], ResourceRolesController);
export { ResourceRolesController };
//# sourceMappingURL=resource-roles.controller.js.map