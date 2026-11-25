import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Role, RolePayload } from '../../../core/models/role.model';

/** /api/roles — el nombre del rol no autoriza nada por sí solo. */
@Injectable({ providedIn: 'root' })
export class RoleApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/roles`;

  list(): Observable<Role[]> {
    return this.http.get<{ roles: Role[] }>(this.base).pipe(map((res) => res.roles ?? []));
  }

  create(payload: RolePayload): Observable<Role> {
    return this.http.post<{ role: Role }>(this.base, payload).pipe(map((res) => res.role));
  }

  update(id: number, payload: Partial<RolePayload>): Observable<Role> {
    return this.http.patch<{ role: Role }>(`${this.base}/${id}`, payload).pipe(map((res) => res.role));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
