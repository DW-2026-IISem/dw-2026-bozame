import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductPayload } from '../../core/models/product.model';

function normalizeProduct(item: any): Product {
  if (!item) return item;
  return {
    id: item.id,
    name: item.name,
    brand: item.brand ?? '',
    price: item.price !== undefined ? Number(item.price) : 0,
    min_stock:
      item.min_stock !== undefined
        ? Number(item.min_stock)
        : item.minStock !== undefined
          ? Number(item.minStock)
          : 0,
    quantity: item.quantity !== undefined ? Number(item.quantity) : 0,
    product_type_id:
      item.product_type_id !== undefined
        ? Number(item.product_type_id)
        : item.productTypeId !== undefined
          ? Number(item.productTypeId)
          : item.product_type?.id ?? item.productType?.id ?? null,
    status: item.status ?? 'active',
    created_at: item.createdAt ?? item.created_at ?? '',
    updated_at: item.updatedAt ?? item.updated_at ?? '',
  };
}

function unwrapList(res: any): Product[] {
  const payload = res?.data !== undefined ? res.data : res;
  let list: any[] = [];
  if (Array.isArray(payload)) {
    list = payload;
  } else if (Array.isArray(payload?.items)) {
    list = payload.items;
  } else if (Array.isArray(payload?.products)) {
    list = payload.products;
  } else if (Array.isArray(payload?.products?.items)) {
    list = payload.products.items;
  } else if (Array.isArray(payload?.data)) {
    list = payload.data;
  } else if (Array.isArray(res?.products)) {
    list = res.products;
  } else if (Array.isArray(res?.items)) {
    list = res.items;
  }
  return list.map(normalizeProduct);
}

function unwrapItem(res: any): Product {
  const payload = res?.data !== undefined ? res.data : res;
  const item = payload?.product ?? payload;
  return normalizeProduct(item);
}

function toBackendProductPayload(payload: Partial<ProductPayload>): any {
  const body: any = {
    name: payload.name,
    brand: payload.brand,
    price: payload.price !== undefined ? Number(payload.price) : undefined,
    minStock:
      payload.min_stock !== undefined
        ? Number(payload.min_stock)
        : (payload as any).minStock,
    quantity:
      payload.quantity !== undefined ? Number(payload.quantity) : undefined,
    productTypeId:
      payload.product_type_id !== undefined
        ? Number(payload.product_type_id)
        : (payload as any).productTypeId,
  };
  Object.keys(body).forEach((key) => body[key] === undefined && delete body[key]);
  return body;
}

@Injectable({ providedIn: 'root' })
export class ProductApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/productos`;

  list(): Observable<Product[]> {
    return this.http.get<any>(this.base).pipe(map(unwrapList));
  }

  get(id: number): Observable<Product> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(unwrapItem));
  }

  create(payload: ProductPayload): Observable<Product> {
    return this.http
      .post<any>(this.base, toBackendProductPayload(payload))
      .pipe(map(unwrapItem));
  }

  update(id: number, payload: Partial<ProductPayload>): Observable<Product> {
    return this.http
      .patch<any>(`${this.base}/${id}`, toBackendProductPayload(payload))
      .pipe(map(unwrapItem));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
