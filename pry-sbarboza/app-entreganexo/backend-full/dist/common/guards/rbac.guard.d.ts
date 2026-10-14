import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ResourceRoleRepository } from '../../features/auth/resource-roles/infrastructure/persistence/repositories/resource-role.repository.js';
export declare class RbacGuard implements CanActivate {
    private readonly repo;
    constructor(repo: ResourceRoleRepository);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
