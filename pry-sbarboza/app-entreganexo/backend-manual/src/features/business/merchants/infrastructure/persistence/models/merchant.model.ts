import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'merchants', timestamps: true })
export class MerchantModel extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING(150), allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;
}
