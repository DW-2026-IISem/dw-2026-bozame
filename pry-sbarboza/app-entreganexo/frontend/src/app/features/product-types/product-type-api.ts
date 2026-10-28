import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductType, ProductTypePayload } from '../../core/models/product-type.model';

function unwrapList(res: any): ProductType[] {
  const payload = res?.data !== undefined ? res.data : res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.product_types)) return payload.product_types;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function unwrapItem(res: any): ProductType {
  const payload = res?.data !== undefined ? res.data : res;
  return payload?.product_type ?? payload;
}

@Injectable({ providedIn: 'root' })
export class ProductTypeApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/product-types`;

  list(): Observable<ProductType[]> {
    return this.http.get<any>(this.base).pipe(map(unwrapList));
  }

  get(id: number): Observable<ProductType> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(unwrapItem));
  }

  create(payload: ProductTypePayload): Observable<ProductType> {
    return this.http.post<any>(this.base, payload).pipe(map(unwrapItem));
  }

  update(id: number, payload: Partial<ProductTypePayload>): Observable<ProductType> {
    return this.http.patch<any>(`${this.base}/${id}`, payload).pipe(map(unwrapItem));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
