import jwt from 'jsonwebtoken';
const JWT_SECRET = 'super-secret-key-entreganexo-2026';
export function generateAccessToken(payload) {
    return jwt.sign({ sub: payload.id, username: payload.username }, JWT_SECRET, { expiresIn: '8h' });
}
export function verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
//# sourceMappingURL=jwt.util.js.map