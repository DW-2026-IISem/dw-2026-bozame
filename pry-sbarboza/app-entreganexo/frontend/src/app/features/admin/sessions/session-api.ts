import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserSession } from '../../../core/models/session.model';

/**
 * /api/sesiones — sesiones (refresh tokens) del **usuario autenticado**.
 * Son rutas JWT sin RBAC: cualquier usuario con sesión puede ver y cerrar las suyas,
 * por eso no figuran en el catálogo de recursos.
 */
@Injectable({ providedIn: 'root' })
export class SessionApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/sesiones`;

  list(): Observable<UserSession[]> {
    return this.http
      .get<{ sessions: UserSession[] }>(this.base)
      .pipe(map((res) => res.sessions ?? []));
  }

  /** Cierra (revoca) una sesión propia. */
  revoke(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  /** Cierra todas las sesiones propias, incluida la de este navegador. */
  revokeAll(): Observable<{ revoked: number }> {
    return this.http.patch<{ revoked: number }>(`${this.base}/deactivate-all`, {});
  }

  /** Borra definitivamente las sesiones propias ya cerradas o caducadas. */
  purge(): Observable<{ purged: number }> {
    return this.http.delete<{ purged: number }>(this.base);
  }
}
