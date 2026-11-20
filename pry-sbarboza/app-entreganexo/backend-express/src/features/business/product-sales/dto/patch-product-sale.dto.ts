import { UpdateProductSaleDto } from "./update-product-sale.dto";

/** Datos de entrada de `PATCH /api/detalle-ventas/:id` (actualización parcial). */
export type PatchProductSaleDto = Partial<UpdateProductSaleDto>;
