import { CreateRoleDto } from '../../../application/dto/create-role.dto.js';
import { RolesService } from '../../../application/services/roles.service.js';
export declare class RolesController {
    private readonly service;
    constructor(service: RolesService);
    create(dto: CreateRoleDto): Promise<{
        role: import("../../../role.model.js").Role;
    }>;
    list(): Promise<{
        roles: import("../../../role.model.js").Role[];
    }>;
    findOne(id: number): Promise<{
        role: import("../../../role.model.js").Role;
    }>;
}
