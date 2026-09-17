import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ProductModel } from '../../../../catalog/infrastructure/persistence/models/product.model.js';
import { OrderModel } from './order.model.js';

@Table({ tableName: 'order_details', timestamps: true })
export class OrderDetailModel extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ForeignKey(() => OrderModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare orderId: number;

  @ForeignKey(() => ProductModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare productId: number;

  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare quantity: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare unitPrice: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare total: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare observations: string | null;

  @BelongsTo(() => OrderModel)
  order?: OrderModel;

  @BelongsTo(() => ProductModel)
  product?: ProductModel;
}
