/**
 * Datos de entrada de `PUT /api/detalle-ventas/:id` (reemplazo completo).
 *
 * `status` **no** está aquí a propósito: al desactivar una línea hay que
 * **restaurar stock** y recalcular la venta, y eso lo garantiza el borrado
 * lógico (`PATCH /api/detalle-ventas/:id/deactivate`). Permitir `status` por
 * PUT/PATCH dejaría el stock inconsistente.
 */
export interface UpdateProductSaleDto {
  quantity: number;
}
