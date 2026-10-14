import { Sequelize } from 'sequelize-typescript';
import { User } from '../../../user.model.js';
export declare class UserRepository {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    private get repo();
    findAllActive(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByIdWithPassword(id: number): Promise<User | null>;
    findConflicts(username: string, email: string): Promise<User[]>;
    create(data: Partial<User>): Promise<User>;
    update(user: User, data: Partial<User>): Promise<User>;
    delete(user: User): Promise<void>;
}
