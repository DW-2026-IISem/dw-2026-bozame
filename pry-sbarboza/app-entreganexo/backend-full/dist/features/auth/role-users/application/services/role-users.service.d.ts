import { RoleUserRepository } from '../../infrastructure/persistence/repositories/role-user.repository.js';
import { CreateRoleUserDto } from '../dto/create-role-user.dto.js';
export declare class RoleUsersService {
    private readonly repo;
    constructor(repo: RoleUserRepository);
    assign(dto: CreateRoleUserDto): Promise<import("../../role-user.model.js").RoleUser>;
    findAll(): Promise<import("../../role-user.model.js").RoleUser[]>;
    deactivate(id: number): Promise<import("../../role-user.model.js").RoleUser>;
}
