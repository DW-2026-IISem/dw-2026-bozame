import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductType, ProductTypePayload } from '../../core/models/product-type.model';

function normalizeProductType(item: any): ProductType {
  if (!item) return item;
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? null,
    status: item.status ?? 'active',
    created_at: item.createdAt ?? item.created_at ?? '',
    updated_at: item.updatedAt ?? item.updated_at ?? '',
  };
}

function unwrapList(res: any): ProductType[] {
  const payload = res?.data !== undefined ? res.data : res;
  let list: any[] = [];
  if (Array.isArray(payload)) {
    list = payload;
  } else if (Array.isArray(payload?.items)) {
    list = payload.items;
  } else if (Array.isArray(payload?.product_types)) {
    list = payload.product_types;
  } else if (Array.isArray(payload?.data)) {
    list = payload.data;
  } else if (Array.isArray(res?.product_types)) {
    list = res.product_types;
  } else if (Array.isArray(res?.items)) {
    list = res.items;
  }
  return list.map(normalizeProductType);
}

function unwrapItem(res: any): ProductType {
  const payload = res?.data !== undefined ? res.data : res;
  const item = payload?.product_type ?? payload;
  return normalizeProductType(item);
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
