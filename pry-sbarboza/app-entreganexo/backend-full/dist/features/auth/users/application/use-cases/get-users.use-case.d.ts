import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository.js';
export declare class GetUsersUseCase {
    private readonly repo;
    constructor(repo: UserRepository);
    findAll(): Promise<{
        id: number;
        username: string;
        email: string;
        avatar: string | null;
        status: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        username: string;
        email: string;
        avatar: string | null;
        status: string;
    }>;
}
