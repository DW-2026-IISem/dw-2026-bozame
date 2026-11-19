import type { Request } from 'express';
import { AuthService } from '../../../application/services/auth.service.js';
export declare class PermisosController {
    private readonly authService;
    constructor(authService: AuthService);
    getPermissions(req: Request): Promise<{
        permissions: {
            resource_id: number;
            method: string;
            path: string;
            description: string | null;
            role_id: number;
            role_name: string;
        }[];
    }>;
}
