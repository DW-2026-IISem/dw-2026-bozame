import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { MerchantModel } from '../../../merchants/infrastructure/persistence/models/merchant.model.js';

@Table({ tableName: 'products', timestamps: true })
export class ProductModel extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  declare sku: string;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @ForeignKey(() => MerchantModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare merchantId: number;

  @BelongsTo(() => MerchantModel)
  merchant?: MerchantModel;
}
