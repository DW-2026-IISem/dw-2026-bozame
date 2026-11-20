/**
 * Datos de entrada de `PUT /api/product-types/:id` (reemplazo completo).
 *
 * `status` **no** está aquí a propósito: el estado sólo cambia con el borrado
 * lógico (`PATCH /api/product-types/:id/deactivate`).
 */
export interface UpdateProductTypeDto {
  name: string;
  description?: string | null;
}
