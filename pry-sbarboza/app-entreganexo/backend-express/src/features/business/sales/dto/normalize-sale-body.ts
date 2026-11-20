/**
 * Compatibilidad con el frontend de EntregaNexo.
 *
 * El frontend Angular envía la venta con `clientId` y cada línea con
 * `productId` (camelCase), herencia del backend NestJS. La API Express trabaja
 * en snake_case (`client_id`, `product_id`), así que aquí se traducen esas
 * claves antes de llegar al service. Si el cuerpo ya viene en snake_case, se
 * respeta tal cual.
 */
export function normalizeSaleBody(body: unknown): Record<string, unknown> {
  const data: Record<string, unknown> = { ...((body ?? {}) as Record<string, unknown>) };

  if (data.client_id === undefined && data.clientId !== undefined) {
    data.client_id = data.clientId;
  }
  delete data.clientId;

  if (Array.isArray(data.items)) {
    data.items = data.items.map((raw) => {
      const item: Record<string, unknown> = { ...((raw ?? {}) as Record<string, unknown>) };
      if (item.product_id === undefined && item.productId !== undefined) {
        item.product_id = item.productId;
      }
      delete item.productId;
      return item;
    });
  }

  return data;
}
