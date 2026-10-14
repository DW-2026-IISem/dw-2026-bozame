var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ForbiddenException } from '@nestjs/common';
import { ResourceRoleRepository } from '../../features/auth/resource-roles/infrastructure/persistence/repositories/resource-role.repository.js';
import { pathMatches } from '../auth/resource-match.util.js';
let RbacGuard = class RbacGuard {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const user = req.auth;
        if (!user)
            throw new ForbiddenException('Usuario no identificado');
        const method = req.method;
        const path = req.path;
        const permissions = await this.repo.findEffectiveForUser(user.id);
        const isGranted = permissions.some(p => p.method.toUpperCase() === method.toUpperCase() &&
            pathMatches(p.path, path));
        if (!isGranted) {
            throw new ForbiddenException(`403 Prohibido — autenticado, pero sin concesión activa para ${method} ${path} (deny by default)`);
        }
        return true;
    }
};
RbacGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ResourceRoleRepository])
], RbacGuard);
export { RbacGuard };
//# sourceMappingURL=rbac.guard.js.map