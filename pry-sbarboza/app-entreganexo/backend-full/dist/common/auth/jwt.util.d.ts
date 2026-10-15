export declare function generateAccessToken(payload: {
    id: number;
    username: string;
}): string;
export declare function verifyAccessToken(token: string): any;
