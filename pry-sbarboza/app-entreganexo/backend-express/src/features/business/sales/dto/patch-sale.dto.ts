import { UpdateSaleDto } from "./update-sale.dto";

/**
 * Datos de entrada de `PATCH /api/ventas/:id` (actualización parcial).
 *
 * Nota: `total` y `subtotal` **no** están aquí a propósito; son derivados y
 * los calcula el service a partir de las líneas.
 */
export type PatchSaleDto = Partial<UpdateSaleDto>;
