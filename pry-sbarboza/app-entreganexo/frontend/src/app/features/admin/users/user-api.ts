import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EffectivePermission } from '../../../core/models/auth.model';
import { User, UserPayload } from '../../../core/models/user.model';

/** /api/usuarios — la respuesta nunca incluye `password`. */
@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/usuarios`;

  list(): Observable<User[]> {
    return this.http.get<{ users: User[] }>(this.base).pipe(map((res) => res.users ?? []));
  }

  get(id: number): Observable<User> {
    return this.http.get<{ user: User }>(`${this.base}/${id}`).pipe(map((res) => res.user));
  }

  create(payload: UserPayload): Observable<User> {
    return this.http.post<{ user: User }>(this.base, payload).pipe(map((res) => res.user));
  }

  /** PATCH solo acepta username, email y avatar. */
  update(id: number, payload: Partial<UserPayload>): Observable<User> {
    return this.http.patch<{ user: User }>(`${this.base}/${id}`, payload).pipe(map((res) => res.user));
  }

  /** Permisos efectivos: la misma consulta que usa el middleware `authorize`. */
  permissions(id: number): Observable<EffectivePermission[]> {
    return this.http
      .get<{ permissions: EffectivePermission[] }>(`${this.base}/${id}/permisos`)
      .pipe(map((res) => res.permissions ?? []));
  }

  changePassword(id: number, payload: { current_password: string; new_password: string }): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/password`, payload);
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
