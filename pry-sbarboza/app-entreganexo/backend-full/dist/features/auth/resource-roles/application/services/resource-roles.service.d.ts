import { Sequelize } from 'sequelize-typescript';
import { ResourceRoleRepository } from '../../infrastructure/persistence/repositories/resource-role.repository.js';
export declare class ResourceRolesService {
    private readonly repo;
    private readonly sequelize;
    constructor(repo: ResourceRoleRepository, sequelize: Sequelize);
    reconcileRole(roleId: number, resourceIds: number[]): Promise<{
        role_id: number;
        activated: number;
        deactivated: number;
        total_active: number;
    }>;
    findAll(): Promise<import("../../resource-role.model.js").ResourceRole[]>;
}
