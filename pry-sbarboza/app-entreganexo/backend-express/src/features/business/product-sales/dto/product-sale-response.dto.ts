import { ProductSale, ProductSaleI } from "../product-sale.model";

/**
 * Respuesta HTTP de una línea de venta. Lo usan `GET /api/detalle-ventas`,
 * `GET /api/detalle-ventas/:id` y el array `items` de una venta.
 *
 * Regla del DTO de respuesta: la API expone **sólo** lo que declara este tipo.
 * `ProductSale` no guarda campos internos, por eso el contrato coincide hoy con
 * el modelo. Si mañana aparece uno, la proyección se vuelve explícita aquí
 * (`Omit<ProductSaleI, "...">`) y el mapper lo omite.
 */
export type ProductSaleResponseDto = ProductSaleI;

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toProductSaleResponse(productSale: ProductSale): ProductSaleResponseDto {
  return productSale.toJSON() as ProductSaleResponseDto;
}
