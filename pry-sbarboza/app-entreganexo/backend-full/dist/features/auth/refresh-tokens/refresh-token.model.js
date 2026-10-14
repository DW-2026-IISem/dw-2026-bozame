var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model.js';
let RefreshToken = class RefreshToken extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], RefreshToken.prototype, "id", void 0);
__decorate([
    ForeignKey(() => User),
    Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' }),
    __metadata("design:type", Number)
], RefreshToken.prototype, "userId", void 0);
__decorate([
    Column({ type: DataType.STRING(255), allowNull: false, unique: true, field: 'token_hash' }),
    __metadata("design:type", String)
], RefreshToken.prototype, "tokenHash", void 0);
__decorate([
    Column({ type: DataType.STRING(100), allowNull: false, field: 'family_id' }),
    __metadata("design:type", String)
], RefreshToken.prototype, "familyId", void 0);
__decorate([
    Column({ type: DataType.STRING(500), allowNull: true, field: 'device_info' }),
    __metadata("design:type", Object)
], RefreshToken.prototype, "deviceInfo", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false, field: 'expires_at' }),
    __metadata("design:type", Date)
], RefreshToken.prototype, "expiresAt", void 0);
__decorate([
    Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'active' }),
    __metadata("design:type", String)
], RefreshToken.prototype, "status", void 0);
__decorate([
    BelongsTo(() => User),
    __metadata("design:type", Function)
], RefreshToken.prototype, "user", void 0);
RefreshToken = __decorate([
    Table({ tableName: 'refresh_tokens', timestamps: true })
], RefreshToken);
export { RefreshToken };
//# sourceMappingURL=refresh-token.model.js.map