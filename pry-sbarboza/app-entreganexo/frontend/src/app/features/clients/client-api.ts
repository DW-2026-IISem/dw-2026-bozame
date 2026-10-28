import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, ClientPayload } from '../../core/models/client.model';

function normalizeClient(item: any): Client {
  if (!item) return item;
  return {
    id: item.id,
    name: item.name,
    email: item.email ?? null,
    phone: item.phone ?? null,
    address: item.address ?? null,
    status: item.status ?? 'active',
    created_at: item.createdAt ?? item.created_at ?? '',
    updated_at: item.updatedAt ?? item.updated_at ?? '',
  };
}

function unwrapList(res: any): Client[] {
  const payload = res?.data !== undefined ? res.data : res;
  let list: any[] = [];
  if (Array.isArray(payload)) {
    list = payload;
  } else if (Array.isArray(payload?.items)) {
    list = payload.items;
  } else if (Array.isArray(payload?.clients)) {
    list = payload.clients;
  } else if (Array.isArray(payload?.data)) {
    list = payload.data;
  } else if (Array.isArray(res?.clients)) {
    list = res.clients;
  } else if (Array.isArray(res?.items)) {
    list = res.items;
  }
  return list.map(normalizeClient);
}

function unwrapItem(res: any): Client {
  const payload = res?.data !== undefined ? res.data : res;
  const item = payload?.client ?? payload;
  return normalizeClient(item);
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
