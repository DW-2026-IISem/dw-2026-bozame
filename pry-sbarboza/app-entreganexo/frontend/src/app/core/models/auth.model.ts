import { HttpMethod } from './resource.model';
import { User } from './user.model';

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface SessionTokens {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

export interface ProfilePayload {
  user: User;
}

export interface EffectivePermission {
  resource_id: number;
  method: HttpMethod;
  path: string;
  description: string | null;
  role_id: number;
  role_name: string;
}

export interface PermissionsPayload {
  permissions: EffectivePermission[];
}

export interface AccessPayload {
  user: User;
  permissions: EffectivePermission[];
}
