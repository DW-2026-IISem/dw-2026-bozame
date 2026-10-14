import { User } from '../../user.model.js';
export declare class UserMapper {
    static toResponse(user: User): {
        id: number;
        username: string;
        email: string;
        avatar: string | null;
        status: string;
    };
}
