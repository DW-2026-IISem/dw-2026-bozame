import { ResourceRolesService } from '../../../application/services/resource-roles.service.js';
export declare class ResourceRolesController {
    private readonly service;
    constructor(service: ResourceRolesService);
    list(): Promise<{
        grants: import("../../../resource-role.model.js").ResourceRole[];
    }>;
}
