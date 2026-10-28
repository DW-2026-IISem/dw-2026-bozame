import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Sale,
  SaleCreatePayload,
  SaleUpdatePayload,
} from '../../core/models/sale.model';

function normalizeSale(item: any): Sale {
  if (!item) return item;
  return {
    id: item.id,
    sale_date: item.sale_date ?? item.saleDate ?? item.createdAt ?? '',
    subtotal: item.subtotal !== undefined ? Number(item.subtotal) : 0,
    tax: item.tax !== undefined ? Number(item.tax) : 0,
    discounts: item.discounts !== undefined ? Number(item.discounts) : 0,
    total: item.total !== undefined ? Number(item.total) : 0,
    client_id: item.client_id ?? item.clientId ?? null,
    status: (item.status === 'active' || item.status === 'completed') ? 'active' : 'inactive',
    created_at: item.createdAt ?? item.created_at ?? '',
    updated_at: item.updatedAt ?? item.updated_at ?? '',
    items: Array.isArray(item.items)
      ? item.items.map((it: any) => ({
          id: it.id,
          sale_id: it.sale_id ?? it.saleId,
          product_id: it.product_id ?? it.productId,
          quantity: it.quantity !== undefined ? Number(it.quantity) : 0,
          unit_price:
            it.unit_price !== undefined
              ? Number(it.unit_price)
              : it.unitPrice !== undefined
                ? Number(it.unitPrice)
                : 0,
          total: it.total !== undefined ? Number(it.total) : 0,
        }))
      : [],
  };
}

function unwrapList(res: any): Sale[] {
  const payload = res?.data !== undefined ? res.data : res;
  let list: any[] = [];
  if (Array.isArray(payload)) {
    list = payload;
  } else if (Array.isArray(payload?.items)) {
    list = payload.items;
  } else if (Array.isArray(payload?.sales)) {
    list = payload.sales;
  } else if (Array.isArray(payload?.sales?.items)) {
    list = payload.sales.items;
  } else if (Array.isArray(payload?.data)) {
    list = payload.data;
  } else if (Array.isArray(res?.sales)) {
    list = res.sales;
  } else if (Array.isArray(res?.items)) {
    list = res.items;
  }
  return list.map(normalizeSale);
}

function unwrapItem(res: any): Sale {
  const payload = res?.data !== undefined ? res.data : res;
  const item = payload?.sale ?? payload;
  return normalizeSale(item);
}

function toBackendSalePayload(payload: SaleCreatePayload): any {
  return {
    clientId: payload.client_id ?? (payload as any).clientId,
    tax: payload.tax !== undefined ? Number(payload.tax) : 0,
    discounts: payload.discounts !== undefined ? Number(payload.discounts) : 0,
    items: (payload.items ?? []).map((it) => ({
      productId: it.product_id ?? (it as any).productId,
      quantity: Number(it.quantity),
    })),
  };
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
    return this.http
      .post<any>(this.base, toBackendSalePayload(payload))
      .pipe(map(unwrapItem));
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
