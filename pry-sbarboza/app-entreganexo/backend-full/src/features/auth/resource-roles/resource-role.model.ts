import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { Role } from '../roles/role.model.js';
import { Resource } from '../resources/resource.model.js';

@Table({ tableName: 'resource_roles', timestamps: true })
export class ResourceRole extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Index({ name: 'uq_resource_roles_role_resource', unique: true })
  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'role_id' })
  declare roleId: number;

  @Index({ name: 'uq_resource_roles_role_resource', unique: true })
  @ForeignKey(() => Resource)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'resource_id' })
  declare resourceId: number;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'inactive' })
  declare status: string;

  @BelongsTo(() => Role)
  declare role?: Role;

  @BelongsTo(() => Resource)
  declare resource?: Resource;
}
