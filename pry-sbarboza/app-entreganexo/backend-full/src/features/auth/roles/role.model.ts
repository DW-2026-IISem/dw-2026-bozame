import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { RoleUser } from '../role-users/role-user.model.js';
import type { RoleUser as IRoleUser } from '../role-users/role-user.model.js';
import { ResourceRole } from '../resource-roles/resource-role.model.js';
import type { ResourceRole as IResourceRole } from '../resource-roles/resource-role.model.js';

@Table({ tableName: 'roles', timestamps: true })
export class Role extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING(80), allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'inactive' })
  declare status: string;

  @HasMany(() => RoleUser)
  declare roleUsers?: IRoleUser[];

  @HasMany(() => ResourceRole)
  declare resourceRoles?: IResourceRole[];
}
