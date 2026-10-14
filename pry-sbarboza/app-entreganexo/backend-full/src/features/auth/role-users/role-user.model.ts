import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { User } from '../users/user.model.js';
import { Role } from '../roles/role.model.js';

@Table({ tableName: 'role_users', timestamps: true })
export class RoleUser extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Index({ name: 'uq_role_users_user_role', unique: true })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' })
  declare userId: number;

  @Index({ name: 'uq_role_users_user_role', unique: true })
  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'role_id' })
  declare roleId: number;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'inactive' })
  declare status: string;

  @BelongsTo(() => User)
  declare user?: User;

  @BelongsTo(() => Role)
  declare role?: Role;
}
