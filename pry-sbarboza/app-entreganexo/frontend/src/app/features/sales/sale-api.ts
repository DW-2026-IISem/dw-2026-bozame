import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Sale,
  SaleCreatePayload,
  SaleUpdatePayload,
} from '../../core/models/sale.model';

function unwrapList(res: any): Sale[] {
  const payload = res?.data !== undefined ? res.data : res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.sales)) return payload.sales;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function unwrapItem(res: any): Sale {
  const payload = res?.data !== undefined ? res.data : res;
  return payload?.sale ?? payload;
}

@Injectable({ providedIn: 'root' })
export class SaleApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/ventas`;

  list(): Observable<Sale[]> {
    return this.http.get<any>(this.base).pipe(map(unwrapList));
  }

  get(id: number): Observable<Sale> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(unwrapItem));
  }

  create(payload: SaleCreatePayload): Observable<Sale> {
    return this.http.post<any>(this.base, payload).pipe(map(unwrapItem));
  }

  update(id: number, payload: SaleUpdatePayload): Observable<Sale> {
    return this.http.patch<any>(`${this.base}/${id}`, payload).pipe(map(unwrapItem));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
