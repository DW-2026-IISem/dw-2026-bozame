import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { ClientModel } from '../../../../clients/infrastructure/persistence/models/client.model.js';
import { ProductSaleModel } from './product-sale.model.js';
import type { ProductSaleModel as IProductSaleModel } from './product-sale.model.js';

@Table({ tableName: 'sales', timestamps: true })
export class SaleModel extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare saleDate: Date;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare subtotal: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0 })
  declare tax: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0 })
  declare discounts: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare total: number;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'completed' })
  declare status: string;

  @ForeignKey(() => ClientModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare clientId: number;

  @BelongsTo(() => ClientModel)
  declare client?: ClientModel;

  @HasMany(() => ProductSaleModel)
  declare items?: IProductSaleModel[];
}
