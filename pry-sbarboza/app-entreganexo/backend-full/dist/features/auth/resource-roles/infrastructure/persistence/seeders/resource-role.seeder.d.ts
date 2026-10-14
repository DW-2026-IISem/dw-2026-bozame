import { ResourceRolesService } from '../../../application/services/resource-roles.service.js';
export declare class ResourceRoleSeeder {
    private readonly service;
    private readonly logger;
    constructor(service: ResourceRolesService);
    seed(): Promise<void>;
}
