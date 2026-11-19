import type { Request } from 'express';
import { AuthService } from '../../../application/services/auth.service.js';
import { LoginDto } from '../../../application/dto/login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: Request): Promise<{
        user: {
            id: number;
            username: string;
            email: string;
            avatar: string | null;
            status: string;
        };
    }>;
    refresh(body: any): Promise<{
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
        refresh_expires_in: number;
    }>;
    logout(): Promise<{
        message: string;
    }>;
}
