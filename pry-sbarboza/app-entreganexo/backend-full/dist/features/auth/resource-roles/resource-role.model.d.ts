import { Model } from 'sequelize-typescript';
import type { Role as IRole } from '../roles/role.model.js';
import type { Resource as IResource } from '../resources/resource.model.js';
export declare class ResourceRole extends Model {
    id: number;
    roleId: number;
    resourceId: number;
    status: string;
    role?: IRole;
    resource?: IResource;
}
