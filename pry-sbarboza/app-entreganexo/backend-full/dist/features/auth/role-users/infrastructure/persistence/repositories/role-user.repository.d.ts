import { Sequelize } from 'sequelize-typescript';
import { RoleUser } from '../../../role-user.model.js';
export declare class RoleUserRepository {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    private get repo();
    findAllActive(): Promise<RoleUser[]>;
    findById(id: number): Promise<RoleUser | null>;
    findByUserAndRole(userId: number, roleId: number): Promise<RoleUser | null>;
    create(data: Partial<RoleUser>): Promise<RoleUser>;
    update(roleUser: RoleUser, data: Partial<RoleUser>): Promise<RoleUser>;
}
