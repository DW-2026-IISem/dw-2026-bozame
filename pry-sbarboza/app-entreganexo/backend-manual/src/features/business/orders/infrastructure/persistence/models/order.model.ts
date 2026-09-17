import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ClientModel } from '../../../../clients/infrastructure/persistence/models/client.model.js';
import { MerchantModel } from '../../../../merchants/infrastructure/persistence/models/merchant.model.js';

@Table({ tableName: 'orders', timestamps: true })
export class OrderModel extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare date: Date;

  @Column({ type: DataType.STRING(50), allowNull: true, defaultValue: 'app' })
  declare channel: string | null;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare subtotal: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare total: number;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'pending' })
  declare status: string;

  @ForeignKey(() => ClientModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare clientId: number;

  @ForeignKey(() => MerchantModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare merchantId: number;

  @BelongsTo(() => ClientModel)
  client?: ClientModel;

  @BelongsTo(() => MerchantModel)
  merchant?: MerchantModel;
}
