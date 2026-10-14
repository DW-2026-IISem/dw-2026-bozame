import { CreateUserDto } from '../../../application/dto/create-user.dto.js';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case.js';
import { GetUsersUseCase } from '../../../application/use-cases/get-users.use-case.js';
export declare class UsersController {
    private readonly createUser;
    private readonly getUsers;
    constructor(createUser: CreateUserUseCase, getUsers: GetUsersUseCase);
    create(dto: CreateUserDto): Promise<{
        user: {
            id: number;
            username: string;
            email: string;
            avatar: string | null;
            status: string;
        };
    }>;
    list(): Promise<{
        users: {
            id: number;
            username: string;
            email: string;
            avatar: string | null;
            status: string;
        }[];
    }>;
    findOne(id: number): Promise<{
        user: {
            id: number;
            username: string;
            email: string;
            avatar: string | null;
            status: string;
        };
    }>;
}
