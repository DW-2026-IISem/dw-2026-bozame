/**
 * Compatibilidad con el frontend de EntregaNexo.
 *
 * El frontend Angular envía `minStock` y `productTypeId` (camelCase), herencia
 * del backend NestJS. La API Express trabaja en snake_case (`min_stock`,
 * `product_type_id`), así que aquí se traducen esas dos claves antes de llegar
 * al service. Si el cuerpo ya viene en snake_case, se respeta tal cual.
 */
export function normalizeProductBody(body: unknown): Record<string, unknown> {
  const data: Record<string, unknown> = { ...((body ?? {}) as Record<string, unknown>) };

  if (data.min_stock === undefined && data.minStock !== undefined) {
    data.min_stock = data.minStock;
  }
  if (data.product_type_id === undefined && data.productTypeId !== undefined) {
    data.product_type_id = data.productTypeId;
  }
  delete data.minStock;
  delete data.productTypeId;

  return data;
}
