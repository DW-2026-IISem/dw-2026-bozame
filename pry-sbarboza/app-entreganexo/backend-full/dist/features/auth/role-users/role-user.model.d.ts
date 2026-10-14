import { Model } from 'sequelize-typescript';
import type { User as IUser } from '../users/user.model.js';
import type { Role as IRole } from '../roles/role.model.js';
export declare class RoleUser extends Model {
    id: number;
    userId: number;
    roleId: number;
    status: string;
    user?: IUser;
    role?: IRole;
}
