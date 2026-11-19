import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AccessPayload,
  LoginRequest,
  PermissionsPayload,
  ProfilePayload,
  SessionTokens,
} from '../models/auth.model';
import { SessionStore } from './session-store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionStore);
  private readonly base = `${environment.apiUrl}/auth`;
  private readonly permissionsUrl = `${environment.apiUrl}/permisos`;

  login(credentials: LoginRequest): Observable<AccessPayload> {
    const payload = {
      username: credentials.identifier || (credentials as any).username,
      identifier: credentials.identifier || (credentials as any).username,
      password: credentials.password,
    };

    return this.http.post<any>(`${this.base}/login`, payload).pipe(
      map((res) => res?.data ?? res),
      tap((data) => {
        const tokens: SessionTokens = {
          access_token: data.access_token,
          token_type: data.token_type ?? 'Bearer',
          expires_in: data.expires_in ?? 28800,
          refresh_token: data.refresh_token ?? data.access_token,
          refresh_expires_in: data.refresh_expires_in ?? 86400,
        };
        this.session.setTokens(tokens);

        if (data.user && Array.isArray(data.permissions)) {
          this.session.setAccess({
            user: data.user,
            permissions: data.permissions,
          });
        }
      }),
      switchMap((data) =>
        this.me().pipe(
          catchError((error: unknown) => {
            // Si el backend ya devolvió user y permissions en el login, usamos esa respuesta
            if (data?.user) {
              const fallbackAccess: AccessPayload = {
                user: data.user,
                permissions: data.permissions ?? [],
              };
              this.session.setAccess(fallbackAccess);
              return of(fallbackAccess);
            }
            this.session.clear();
            return throwError(() => error);
          }),
        ),
      ),
    );
  }

  me(): Observable<AccessPayload> {
    return forkJoin({
      profile: this.http.get<any>(`${this.base}/perfil`).pipe(map((res) => res?.data ?? res)),
      permissions: this.http.get<any>(this.permissionsUrl).pipe(map((res) => res?.data ?? res)),
    }).pipe(
      map(({ profile, permissions }) => ({
        user: profile.user ?? profile,
        permissions: permissions.permissions ?? (Array.isArray(permissions) ? permissions : []),
      })),
      tap((access) => this.session.setAccess(access)),
    );
  }

  refresh(): Observable<SessionTokens> {
    const refresh_token = this.session.refreshToken();
    if (!refresh_token) {
      return throwError(() => new Error('No hay refresh token en la sesión'));
    }
    return this.http
      .post<any>(`${this.base}/refresh`, { refresh_token })
      .pipe(
        map((res) => res?.data ?? res),
        tap((tokens) => this.session.setTokens(tokens)),
      );
  }

  logout(): Observable<unknown> {
    const refresh_token = this.session.refreshToken();
    return this.http.post(`${this.base}/logout`, { refresh_token }).pipe(
      catchError(() => of(null)),
      finalize(() => this.session.clear()),
    );
  }
}
