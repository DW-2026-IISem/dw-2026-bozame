import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Role } from '../roles/role.model.js';
import type { Role as IRole } from '../roles/role.model.js';
import { Resource } from '../resources/resource.model.js';
import type { Resource as IResource } from '../resources/resource.model.js';

@Table({
  tableName: 'resource_roles',
  timestamps: true,
  indexes: [
    { name: 'uq_resource_roles_role_resource', unique: true, fields: ['role_id', 'resource_id'] }
  ]
})
export class ResourceRole extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'role_id' })
  declare roleId: number;

  @ForeignKey(() => Resource)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'resource_id' })
  declare resourceId: number;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'inactive' })
  declare status: string;

  @BelongsTo(() => Role)
  declare role?: IRole;

  @BelongsTo(() => Resource)
  declare resource?: IResource;
}
