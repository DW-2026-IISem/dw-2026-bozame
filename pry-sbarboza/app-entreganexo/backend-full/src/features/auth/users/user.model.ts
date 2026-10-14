import { Table, Column, Model, DataType, HasMany, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { hashPassword } from '../../../common/auth/password.util.js';
import { RoleUser } from '../role-users/role-user.model.js';
import type { RoleUser as IRoleUser } from '../role-users/role-user.model.js';
import { RefreshToken } from '../refresh-tokens/refresh-token.model.js';
import type { RefreshToken as IRefreshToken } from '../refresh-tokens/refresh-token.model.js';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING(80), allowNull: false, unique: true })
  declare username: string;

  @Column({ type: DataType.STRING(150), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING(500), allowNull: true })
  declare avatar: string | null;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'inactive' })
  declare status: string;

  @HasMany(() => RoleUser)
  declare roleUsers?: IRoleUser[];

  @HasMany(() => RefreshToken)
  declare refreshTokens?: IRefreshToken[];

  @BeforeCreate
  @BeforeUpdate
  static async hookHashPassword(user: User) {
    if (user.changed('password') && user.password) {
      user.password = await hashPassword(user.password);
    }
  }
}
