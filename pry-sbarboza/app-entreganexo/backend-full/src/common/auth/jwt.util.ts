import jwt from 'jsonwebtoken';

// En producción esto iría en el .env
const JWT_SECRET = 'super-secret-key-entreganexo-2026'; 

export function generateAccessToken(payload: { id: number; username: string }): string {
  return jwt.sign({ sub: payload.id, username: payload.username }, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyAccessToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
