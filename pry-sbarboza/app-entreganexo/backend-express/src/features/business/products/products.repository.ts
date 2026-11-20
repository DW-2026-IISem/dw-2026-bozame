import { CreationAttributes, Transaction } from "sequelize";
import { Product, ProductI } from "./product.model";

/**
 * Capa Repository del feature Products.
 *
 * Única responsable de hablar con Sequelize (el modelo `Product`).
 * Expone variantes con `transaction`/`lock` que usan los flujos de ventas.
 */
export class ProductsRepository {
  /** Todos los productos activos. */
  public async findAllActive(): Promise<Product[]> {
    return Product.findAll({ where: { status: "active" } });
  }

  /** Un producto por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<Product | null> {
    return Product.findByPk(id, { transaction });
  }

  /** Un producto por PK bloqueando la fila (`SELECT ... FOR UPDATE`). */
  public async findByIdForUpdate(
    id: number,
    transaction: Transaction
  ): Promise<Product | null> {
    return Product.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
  }

  /** Inserta un producto. */
  public async create(data: CreationAttributes<Product>): Promise<Product> {
    return Product.create(data);
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(
    product: Product,
    data: Partial<ProductI>,
    transaction?: Transaction
  ): Promise<Product> {
    return product.update(data, { transaction });
  }

  /** Elimina físicamente una instancia. */
  public async delete(product: Product): Promise<void> {
    await product.destroy();
  }
}
