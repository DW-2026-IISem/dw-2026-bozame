import { LoginDto } from '../dto/login.dto.js';
import { ResourceRoleRepository } from '../../../resource-roles/infrastructure/persistence/repositories/resource-role.repository.js';
export declare class AuthService {
    private readonly resourceRoleRepo;
    constructor(resourceRoleRepo: ResourceRoleRepository);
    login(dto: LoginDto): Promise<{
        message: string;
        user: {
            id: number;
            username: string;
            email: string;
            avatar: string | null;
            status: string;
        };
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
        refresh_expires_in: number;
        permissions: {
            resource_id: number;
            method: string;
            path: string;
            description: string | null;
            role_id: number;
            role_name: string;
        }[];
    }>;
    getProfile(userId: number): Promise<{
        user: {
            id: number;
            username: string;
            email: string;
            avatar: string | null;
            status: string;
        };
    }>;
    getPermissions(userId: number): Promise<{
        permissions: {
            resource_id: number;
            method: string;
            path: string;
            description: string | null;
            role_id: number;
            role_name: string;
        }[];
    }>;
    refresh(body: {
        refresh_token?: string;
    }): Promise<{
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
        refresh_expires_in: number;
    }>;
}
