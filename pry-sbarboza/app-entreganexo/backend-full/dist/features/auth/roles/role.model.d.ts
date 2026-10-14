import { Model } from 'sequelize-typescript';
import type { RoleUser as IRoleUser } from '../role-users/role-user.model.js';
import type { ResourceRole as IResourceRole } from '../resource-roles/resource-role.model.js';
export declare class Role extends Model {
    id: number;
    name: string;
    description: string | null;
    status: string;
    roleUsers?: IRoleUser[];
    resourceRoles?: IResourceRole[];
}
