import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model.js';
import type { User as IUser } from '../users/user.model.js';
import { Role } from '../roles/role.model.js';
import type { Role as IRole } from '../roles/role.model.js';

@Table({
  tableName: 'role_users',
  timestamps: true,
  indexes: [
    { name: 'uq_role_users_user_role', unique: true, fields: ['user_id', 'role_id'] }
  ]
})
export class RoleUser extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' })
  declare userId: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'role_id' })
  declare roleId: number;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'inactive' })
  declare status: string;

  @BelongsTo(() => User)
  declare user?: IUser;

  @BelongsTo(() => Role)
  declare role?: IRole;
}
