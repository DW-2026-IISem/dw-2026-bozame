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
        };
        access_token: string;
    }>;
}
