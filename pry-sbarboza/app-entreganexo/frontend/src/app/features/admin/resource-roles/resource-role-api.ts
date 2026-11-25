import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResourceRole, ResourceRolePayload } from '../../../core/models/resource-role.model';

/** /api/concesiones-rol — cada fila activa ES un permiso (rol + recurso). */
@Injectable({ providedIn: 'root' })
export class ResourceRoleApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/concesiones-rol`;

  list(filters: { role_id?: number; resource_id?: number } = {}): Observable<ResourceRole[]> {
    let params = new HttpParams();
    if (filters.role_id) params = params.set('role_id', filters.role_id);
    if (filters.resource_id) params = params.set('resource_id', filters.resource_id);
    return this.http
      .get<{ grants: ResourceRole[] }>(this.base, { params })
      .pipe(map((res) => res.grants ?? []));
  }

  /** Concede el recurso al rol (o reactiva la concesión inactiva). Responde `{ message, grant }`. */
  create(payload: ResourceRolePayload): Observable<ResourceRole> {
    return this.http
      .post<{ grant: ResourceRole }>(this.base, payload)
      .pipe(map((res) => res.grant));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  reactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/reactivate`, {});
  }
}
