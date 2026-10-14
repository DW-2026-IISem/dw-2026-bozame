import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { ResourceRole } from '../../../resource-role.model.js';
export declare class ResourceRoleRepository {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    private get repo();
    findAllActive(): Promise<ResourceRole[]>;
    findAllByRole(roleId: number, transaction?: Transaction): Promise<ResourceRole[]>;
    create(data: Partial<ResourceRole>, transaction?: Transaction): Promise<ResourceRole>;
    update(resourceRole: ResourceRole, data: Partial<ResourceRole>, transaction?: Transaction): Promise<ResourceRole>;
    findEffectiveForUser(userId: number): Promise<{
        method: string;
        path: string;
    }[]>;
}
