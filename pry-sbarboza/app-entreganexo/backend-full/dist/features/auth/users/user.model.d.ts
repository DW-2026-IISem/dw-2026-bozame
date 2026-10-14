import { Model } from 'sequelize-typescript';
import type { RoleUser as IRoleUser } from '../role-users/role-user.model.js';
import type { RefreshToken as IRefreshToken } from '../refresh-tokens/refresh-token.model.js';
export declare class User extends Model {
    id: number;
    username: string;
    email: string;
    password: string;
    avatar: string | null;
    status: string;
    roleUsers?: IRoleUser[];
    refreshTokens?: IRefreshToken[];
    static hookHashPassword(user: User): Promise<void>;
}
