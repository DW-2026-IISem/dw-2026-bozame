import { RoleRepository } from '../../infrastructure/persistence/repositories/role.repository.js';
import { CreateRoleDto } from '../dto/create-role.dto.js';
export declare class RolesService {
    private readonly repo;
    constructor(repo: RoleRepository);
    create(dto: CreateRoleDto): Promise<import("../../role.model.js").Role>;
    findAll(): Promise<import("../../role.model.js").Role[]>;
    findOne(id: number): Promise<import("../../role.model.js").Role>;
}
