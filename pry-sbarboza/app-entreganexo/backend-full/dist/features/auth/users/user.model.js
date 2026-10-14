var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, HasMany, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { hashPassword } from '../../../common/auth/password.util.js';
import { RoleUser } from '../role-users/role-user.model.js';
import { RefreshToken } from '../refresh-tokens/refresh-token.model.js';
let User = class User extends Model {
    static async hookHashPassword(user) {
        if (user.changed('password') && user.password) {
            user.password = await hashPassword(user.password);
        }
    }
};
__decorate([
    Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Column({ type: DataType.STRING(80), allowNull: false, unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Column({ type: DataType.STRING(150), allowNull: false, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ type: DataType.STRING(255), allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Column({ type: DataType.STRING(500), allowNull: true }),
    __metadata("design:type", Object)
], User.prototype, "avatar", void 0);
__decorate([
    Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'inactive' }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    HasMany(() => RoleUser),
    __metadata("design:type", Array)
], User.prototype, "roleUsers", void 0);
__decorate([
    HasMany(() => RefreshToken),
    __metadata("design:type", Array)
], User.prototype, "refreshTokens", void 0);
__decorate([
    BeforeCreate,
    BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hookHashPassword", null);
User = __decorate([
    Table({ tableName: 'users', timestamps: true })
], User);
export { User };
//# sourceMappingURL=user.model.js.map