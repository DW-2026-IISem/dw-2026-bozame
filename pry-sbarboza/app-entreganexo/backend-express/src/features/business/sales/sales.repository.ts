import { CreationAttributes, Transaction } from "sequelize";
import { Sale, SaleI } from "./sale.model";
import { ProductSale } from "../product-sales/product-sale.model";

/**
 * Capa Repository del feature Sales.
 *
 * Única responsable de hablar con Sequelize (el modelo `Sale`).
 * Incluye la hidratación de líneas (`ProductSale`) para las lecturas.
 */
export class SalesRepository {
  /** Ventas activas con sus líneas. */
  public async findAllActiveWithItems(): Promise<Sale[]> {
    return Sale.findAll({
      where: { status: "active" },
      include: [{ model: ProductSale, as: "items" }],
    });
  }

  /**
   * Una venta con sus líneas (o `null`), sin filtrar por `status`.
   *
   * El filtro de borrado lógico es una regla de negocio y vive en el service;
   * por eso este método no lo aplica y lo reutilizan tanto las lecturas
   * (que sí lo exigen) como la purga (`deletePhysical`).
   */
  public async findWithItemsById(id: number, transaction?: Transaction): Promise<Sale | null> {
    return Sale.findByPk(id, {
      include: [{ model: ProductSale, as: "items" }],
      transaction,
    });
  }

  /** Una venta por PK sin líneas (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<Sale | null> {
    return Sale.findByPk(id, { transaction });
  }

  /** Una venta por PK bloqueando la fila (`SELECT ... FOR UPDATE`). */
  public async findByIdForUpdate(id: number, transaction: Transaction): Promise<Sale | null> {
    return Sale.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
  }

  /** Inserta la cabecera de una venta. */
  public async create(
    data: CreationAttributes<Sale>,
    transaction?: Transaction
  ): Promise<Sale> {
    return Sale.create(data, { transaction });
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(
    sale: Sale,
    data: Partial<SaleI>,
    transaction?: Transaction
  ): Promise<Sale> {
    return sale.update(data, { transaction });
  }

  /** Elimina físicamente una instancia. */
  public async delete(sale: Sale, transaction?: Transaction): Promise<void> {
    await sale.destroy({ transaction });
  }
}
