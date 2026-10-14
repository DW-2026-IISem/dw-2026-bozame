import { JwtPayload } from 'jsonwebtoken';
export declare const TOKEN_ISSUER = "app-storelab-express";
export declare const TOKEN_AUDIENCE = "app-storelab-api";
export interface AccessTokenPayload extends JwtPayload {
    sub: string;
    username: string;
    jti: string;
}
export declare function signAccessToken(user: {
    id: number;
    username: string;
}): {
    token: string;
    expiresIn: number;
};
export declare function verifyAccessToken(token: string): AccessTokenPayload;
