import { CreationAttributes, Transaction } from "sequelize";
import { ProductSale, ProductSaleI } from "./product-sale.model";

/**
 * Capa Repository del feature ProductSales (tabla `product_sales`).
 *
 * Única responsable de hablar con Sequelize (el modelo `ProductSale`).
 */
export class ProductSalesRepository {
  /** Todas las líneas activas. */
  public async findAllActive(): Promise<ProductSale[]> {
    return ProductSale.findAll({ where: { status: "active" } });
  }

  /** Una línea por PK (o `null`). */
  public async findById(
    id: number,
    transaction?: Transaction
  ): Promise<ProductSale | null> {
    return ProductSale.findByPk(id, { transaction });
  }

  /** Una línea por PK bloqueando la fila (`SELECT ... FOR UPDATE`). */
  public async findByIdForUpdate(
    id: number,
    transaction: Transaction
  ): Promise<ProductSale | null> {
    return ProductSale.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
  }

  /** Líneas activas de una venta (para recalcular subtotal/total). */
  public async findActiveBySaleId(
    sale_id: number,
    transaction?: Transaction
  ): Promise<ProductSale[]> {
    return ProductSale.findAll({
      where: { sale_id, status: "active" },
      transaction,
    });
  }

  /** Inserta una línea. */
  public async create(
    data: CreationAttributes<ProductSale>,
    transaction?: Transaction
  ): Promise<ProductSale> {
    return ProductSale.create(data, { transaction });
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(
    productSale: ProductSale,
    data: Partial<ProductSaleI>,
    transaction?: Transaction
  ): Promise<ProductSale> {
    return productSale.update(data, { transaction });
  }

  /** Elimina físicamente una instancia. */
  public async delete(productSale: ProductSale, transaction?: Transaction): Promise<void> {
    await productSale.destroy({ transaction });
  }

  /** Elimina físicamente todas las líneas de una venta. */
  public async deleteBySaleId(sale_id: number, transaction?: Transaction): Promise<number> {
    return ProductSale.destroy({ where: { sale_id }, transaction });
  }

  /** Desactiva (borrado lógico) todas las líneas de una venta. */
  public async deactivateBySaleId(
    sale_id: number,
    transaction?: Transaction
  ): Promise<number> {
    const [affected] = await ProductSale.update(
      { status: "inactive" },
      { where: { sale_id }, transaction }
    );
    return affected;
  }
}
