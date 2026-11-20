/** Una línea (producto + cantidad) dentro del `POST /api/ventas`. */
export interface SaleItemDto {
  product_id: number;
  quantity: number;
}

/** Datos de entrada de `POST /api/ventas` (cabecera + líneas, transaccional). */
export interface CreateSaleDto {
  client_id: number;
  tax?: number;
  discounts?: number;
  sale_date?: Date | string;
  /** Opcional: por defecto `active`. Tras crearla, el estado sólo cambia con el borrado lógico. */
  status?: "active" | "inactive";
  items: SaleItemDto[];
}
