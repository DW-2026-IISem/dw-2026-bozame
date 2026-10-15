import { LoginDto } from '../dto/login.dto.js';
export declare class AuthService {
    login(dto: LoginDto): Promise<{
        message: string;
        user: {
            id: number;
            username: string;
        };
        access_token: string;
    }>;
}
