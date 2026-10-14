import { Model } from 'sequelize-typescript';
import type { ResourceRole as IResourceRole } from '../resource-roles/resource-role.model.js';
export declare class Resource extends Model {
    id: number;
    method: string;
    path: string;
    description: string | null;
    status: string;
    resourceRoles?: IResourceRole[];
}
