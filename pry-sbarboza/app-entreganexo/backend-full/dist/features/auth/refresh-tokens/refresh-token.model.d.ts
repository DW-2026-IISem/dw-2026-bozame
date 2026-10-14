import { Model } from 'sequelize-typescript';
import type { User as IUser } from '../users/user.model.js';
export declare class RefreshToken extends Model {
    id: number;
    userId: number;
    tokenHash: string;
    familyId: string;
    deviceInfo: string | null;
    expiresAt: Date;
    status: string;
    user?: IUser;
}
