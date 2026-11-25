import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Resource, ResourcePayload } from '../../../core/models/resource.model';

/** /api/recursos — catálogo de pares (method, path) protegibles. */
@Injectable({ providedIn: 'root' })
export class ResourceApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/recursos`;

  list(): Observable<Resource[]> {
    return this.http.get<{ resources: Resource[] }>(this.base).pipe(map((res) => res.resources ?? []));
  }

  get(id: number): Observable<Resource> {
    return this.http.get<{ resource: Resource }>(`${this.base}/${id}`).pipe(map((res) => res.resource));
  }

  create(payload: ResourcePayload): Observable<Resource> {
    return this.http.post<{ resource: Resource }>(this.base, payload).pipe(map((res) => res.resource));
  }

  update(id: number, payload: Partial<ResourcePayload>): Observable<Resource> {
    return this.http
      .patch<{ resource: Resource }>(`${this.base}/${id}`, payload)
      .pipe(map((res) => res.resource));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  /** Úsalo con cuidado: rompe las concesiones históricas que apunten al recurso. */
  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
