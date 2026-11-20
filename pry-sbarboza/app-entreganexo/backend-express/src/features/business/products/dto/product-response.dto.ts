import { Product, ProductI } from "../product.model";

/**
 * Respuesta HTTP de un producto. Lo usan `GET /api/productos`,
 * `GET /api/productos/:id` y la salida de create/update/delete lógico.
 *
 * Regla del DTO de respuesta: la API expone **sólo** lo que declara este tipo.
 * `Product` no guarda campos internos, por eso el contrato coincide hoy con el
 * modelo. Si mañana aparece uno (ej. `cost`), la proyección se vuelve explícita
 * aquí y el mapper lo omite:
 *
 * ```ts
 * export type ProductResponseDto = Omit<ProductI, "cost">;
 * ```
 */
export type ProductResponseDto = ProductI;

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toProductResponse(product: Product): ProductResponseDto {
  return product.toJSON() as ProductResponseDto;
}
