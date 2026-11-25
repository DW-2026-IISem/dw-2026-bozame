import { Status } from './api.model';

/**
 * Sesión persistida (tabla `refresh_tokens`) tal como la devuelve `/api/sesiones`.
 * El backend omite `token_hash` a propósito: nunca sale de la API.
 */
export interface UserSession {
  id: number;
  user_id: number;
  family_id: string;
  device_info?: string | null;
  expires_at: string;
  status: Status;
  /** Derivado en el backend: `expires_at` ya pasó. */
  is_expired: boolean;
  createdAt?: string;
  updatedAt?: string;
}
