import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SaleModel } from './sale.model.js';
import type { SaleModel as ISaleModel } from './sale.model.js';
import { ProductModel } from '../../../../products/infrastructure/persistence/models/product.model.js';

@Table({ tableName: 'product_sales', timestamps: true })
export class ProductSaleModel extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ForeignKey(() => SaleModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare saleId: number;

  @ForeignKey(() => ProductModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare productId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare unitPrice: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare total: number;

  @BelongsTo(() => SaleModel)
  declare sale?: ISaleModel;

  @BelongsTo(() => ProductModel)
  declare product?: ProductModel;
}
