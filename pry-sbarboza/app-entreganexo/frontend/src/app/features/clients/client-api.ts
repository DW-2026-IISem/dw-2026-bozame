import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, ClientPayload } from '../../core/models/client.model';

function unwrapList(res: any): Client[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.clients)) return res.clients;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.clients)) return res.data.clients;
  return [];
}

function unwrapItem(res: any): Client {
  return res?.client ?? res?.data?.client ?? res?.data ?? res;
}

@Injectable({ providedIn: 'root' })
export class ClientApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/clientes`;

  list(): Observable<Client[]> {
    return this.http.get<any>(this.base).pipe(map(unwrapList));
  }

  get(id: number): Observable<Client> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(unwrapItem));
  }

  create(payload: ClientPayload): Observable<Client> {
    return this.http.post<any>(this.base, payload).pipe(map(unwrapItem));
  }

  update(id: number, payload: Partial<ClientPayload>): Observable<Client> {
    return this.http.patch<any>(`${this.base}/${id}`, payload).pipe(map(unwrapItem));
  }

  replace(id: number, payload: ClientPayload): Observable<Client> {
    return this.http.put<any>(`${this.base}/${id}`, payload).pipe(map(unwrapItem));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
