/**
 * Datos de entrada de `PUT /api/ventas/:id` (reemplazo de la cabecera).
 *
 * Semántica de PUT: `tax` y `discounts` que no lleguen valen `0` (la cabecera
 * se reemplaza). En `PATCH` los omitidos se conservan. `subtotal` y `total` no
 * aparecen porque son derivados y los calcula el service.
 *
 * `status` **no** está aquí a propósito: la venta se desactiva (junto con sus
 * líneas) con `PATCH /api/ventas/:id/deactivate`.
 */
export interface UpdateSaleDto {
  /** Si no se envía, el service conserva el cliente actual. */
  client_id?: number;
  /** Si no se envía, se asume 0. */
  tax?: number;
  /** Si no se envía, se asume 0. */
  discounts?: number;
  sale_date?: Date | string;
}
