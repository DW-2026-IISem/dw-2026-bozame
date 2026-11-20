import { UpdateProductTypeDto } from "./update-product-type.dto";

/** Datos de entrada de `PATCH /api/product-types/:id` (actualización parcial). */
export type PatchProductTypeDto = Partial<UpdateProductTypeDto>;
