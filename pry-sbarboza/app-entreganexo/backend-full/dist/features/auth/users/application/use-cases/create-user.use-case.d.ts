import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
export declare class CreateUserUseCase {
    private readonly repo;
    constructor(repo: UserRepository);
    execute(dto: CreateUserDto): Promise<{
        id: number;
        username: string;
        email: string;
        avatar: string | null;
        status: string;
    }>;
}
