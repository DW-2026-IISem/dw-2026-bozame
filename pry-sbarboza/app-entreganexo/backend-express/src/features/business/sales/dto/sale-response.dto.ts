import { Sale, SaleI } from "../sale.model";
import { ProductSaleResponseDto } from "../../product-sales/dto";

/**
 * Respuesta HTTP de una venta. Lo usan `GET /api/ventas`,
 * `GET /api/ventas/:id` y la salida de update/delete lógico.
 *
 * `items` es opcional porque la venta puede leerse con o sin sus líneas
 * (el repository decide el `include`); cuando viaja, cada línea ya es un
 * `ProductSaleResponseDto`, nunca una instancia de Sequelize.
 */
export type SaleResponseDto = SaleI & { items?: ProductSaleResponseDto[] };

/** Salida de `POST /api/ventas`: la cabecera creada y sus líneas. */
export interface CreateSaleResultDto {
  sale: SaleResponseDto;
  items: ProductSaleResponseDto[];
}

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toSaleResponse(sale: Sale): SaleResponseDto {
  return sale.toJSON() as SaleResponseDto;
}
