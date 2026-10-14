import jwt, { JwtPayload } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { ApplicationException } from '../exceptions/application.exception.js';

const ALGORITHM = 'HS256';
export const TOKEN_ISSUER = 'app-storelab-express';
export const TOKEN_AUDIENCE = 'app-storelab-api';

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  username: string;
  jti: string;
}

export function signAccessToken(user: { id: number; username: string }) {
  const secret = process.env.JWT_SECRET!;
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

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: [ALGORITHM],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
      clockTolerance: 5,
    }) as JwtPayload;

    if (!payload.sub || !payload.jti) throw new Error();
    return payload as AccessTokenPayload;
  } catch {
    throw new ApplicationException(401, 'Token de acceso inválido o expirado');
  }
}
