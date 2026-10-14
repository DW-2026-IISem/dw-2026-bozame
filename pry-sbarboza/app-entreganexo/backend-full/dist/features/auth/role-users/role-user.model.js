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
import { Role } from '../roles/role.model.js';
let RoleUser = class RoleUser extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], RoleUser.prototype, "id", void 0);
__decorate([
    ForeignKey(() => User),
    Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' }),
    __metadata("design:type", Number)
], RoleUser.prototype, "userId", void 0);
__decorate([
    ForeignKey(() => Role),
    Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'role_id' }),
    __metadata("design:type", Number)
], RoleUser.prototype, "roleId", void 0);
__decorate([
    Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'inactive' }),
    __metadata("design:type", String)
], RoleUser.prototype, "status", void 0);
__decorate([
    BelongsTo(() => User),
    __metadata("design:type", Function)
], RoleUser.prototype, "user", void 0);
__decorate([
    BelongsTo(() => Role),
    __metadata("design:type", Function)
], RoleUser.prototype, "role", void 0);
RoleUser = __decorate([
    Table({
        tableName: 'role_users',
        timestamps: true,
        indexes: [
            { name: 'uq_role_users_user_role', unique: true, fields: ['user_id', 'role_id'] }
        ]
    })
], RoleUser);
export { RoleUser };
//# sourceMappingURL=role-user.model.js.map