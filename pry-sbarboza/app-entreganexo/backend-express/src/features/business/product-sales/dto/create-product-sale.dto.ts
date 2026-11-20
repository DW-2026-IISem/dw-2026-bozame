/** Datos de entrada de `POST /api/detalle-ventas`. */
export interface CreateProductSaleDto {
  sale_id: number;
  product_id: number;
  quantity: number;
  /** Opcional: por defecto `active`. Tras crearla, el estado sólo cambia con el borrado lógico. */
  status?: "active" | "inactive";
}
