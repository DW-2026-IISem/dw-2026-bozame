import { Sequelize } from 'sequelize-typescript';
import { Resource } from '../../../resource.model.js';
export declare class ResourceRepository {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    private get repo();
    findAllActive(): Promise<Resource[]>;
    findById(id: number): Promise<Resource | null>;
    findByOperation(method: string, path: string): Promise<Resource | null>;
    create(data: Partial<Resource>): Promise<Resource>;
}
