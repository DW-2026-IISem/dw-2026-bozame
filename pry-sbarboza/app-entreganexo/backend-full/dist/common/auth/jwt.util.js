import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { ApplicationException } from '../exceptions/application.exception.js';
const ALGORITHM = 'HS256';
export const TOKEN_ISSUER = 'app-storelab-express';
export const TOKEN_AUDIENCE = 'app-storelab-api';
export function signAccessToken(user) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = Number(process.env.JWT_ACCESS_TTL ?? 900);
    const token = jwt.sign({ username: user.username }, secret, {
        algorithm: ALGORITHM,
        subject: String(user.id),
        issuer: TOKEN_ISSUER,
        audience: TOKEN_AUDIENCE,
        expiresIn,
        jwtid: randomUUID(),
    });
    return { token, expiresIn };
}
export function verifyAccessToken(token) {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: [ALGORITHM],
            issuer: TOKEN_ISSUER,
            audience: TOKEN_AUDIENCE,
            clockTolerance: 5,
        });
        if (!payload.sub || !payload.jti)
            throw new Error();
        return payload;
    }
    catch {
        throw new ApplicationException(401, 'Token de acceso inválido o expirado');
    }
}
//# sourceMappingURL=jwt.util.js.map