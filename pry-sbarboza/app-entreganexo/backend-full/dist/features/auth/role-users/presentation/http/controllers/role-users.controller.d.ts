import { CreateRoleUserDto } from '../../../application/dto/create-role-user.dto.js';
import { RoleUsersService } from '../../../application/services/role-users.service.js';
export declare class RoleUsersController {
    private readonly service;
    constructor(service: RoleUsersService);
    assign(dto: CreateRoleUserDto): Promise<{
        assignment: import("../../../role-user.model.js").RoleUser;
    }>;
    list(): Promise<{
        assignments: import("../../../role-user.model.js").RoleUser[];
    }>;
    deactivate(id: number): Promise<{
        message: string;
        assignment: import("../../../role-user.model.js").RoleUser;
    }>;
}
