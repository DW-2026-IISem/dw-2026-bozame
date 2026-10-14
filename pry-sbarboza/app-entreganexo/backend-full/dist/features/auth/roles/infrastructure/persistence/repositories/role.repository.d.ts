import { Sequelize } from 'sequelize-typescript';
import { Role } from '../../../role.model.js';
export declare class RoleRepository {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    private get repo();
    findAllActive(): Promise<Role[]>;
    findById(id: number): Promise<Role | null>;
    findByName(name: string): Promise<Role | null>;
    create(data: Partial<Role>): Promise<Role>;
    update(role: Role, data: Partial<Role>): Promise<Role>;
}
