import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'clients', timestamps: true })
export class ClientModel extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING(10), allowNull: false })
  declare documentType: string;

  @Column({ type: DataType.STRING(20), allowNull: false, unique: true })
  declare documentNumber: string;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(30), allowNull: true })
  declare phone: string | null;

  @Column({ type: DataType.STRING(150), allowNull: true })
  declare email: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;
}
