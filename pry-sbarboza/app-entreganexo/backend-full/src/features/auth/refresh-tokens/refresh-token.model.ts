import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model.js';
import type { User as IUser } from '../users/user.model.js';

@Table({ tableName: 'refresh_tokens', timestamps: true })
export class RefreshToken extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' })
  declare userId: number;

  @Column({ type: DataType.STRING(255), allowNull: false, unique: true, field: 'token_hash' })
  declare tokenHash: string;

  @Column({ type: DataType.STRING(100), allowNull: false, field: 'family_id' })
  declare familyId: string;

  @Column({ type: DataType.STRING(500), allowNull: true, field: 'device_info' })
  declare deviceInfo: string | null;

  @Column({ type: DataType.DATE, allowNull: false, field: 'expires_at' })
  declare expiresAt: Date;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'active' })
  declare status: string;

  @BelongsTo(() => User)
  declare user?: IUser;
}
