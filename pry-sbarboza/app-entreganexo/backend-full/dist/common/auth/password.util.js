import { hash, compare } from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
const SALT_ROUNDS = 12;
export async function hashPassword(plain) {
    return hash(plain, SALT_ROUNDS);
}
export async function comparePassword(plain, passwordHash) {
    return compare(plain, passwordHash);
}
export function sha256Hex(value) {
    return createHash('sha256').update(value).digest('hex');
}
export function generateOpaqueToken() {
    return randomBytes(64).toString('base64url');
}
//# sourceMappingURL=password.util.js.map