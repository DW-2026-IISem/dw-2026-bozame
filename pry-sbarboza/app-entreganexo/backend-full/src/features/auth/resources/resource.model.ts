import { Table, Column, Model, DataType, HasMany, Index } from 'sequelize-typescript';
import { ResourceRole } from '../resource-roles/resource-role.model.js';
import type { ResourceRole as IResourceRole } from '../resource-roles/resource-role.model.js';

@Table({ tableName: 'resources', timestamps: true })
export class Resource extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Index({ name: 'uq_resources_method_path', unique: true })
  @Column({ type: DataType.STRING(10), allowNull: false })
  declare method: string;

  @Index({ name: 'uq_resources_method_path', unique: true })
  @Column({ type: DataType.STRING(255), allowNull: false })
  declare path: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'inactive' })
  declare status: string;

  @HasMany(() => ResourceRole)
  declare resourceRoles?: IResourceRole[];
}
