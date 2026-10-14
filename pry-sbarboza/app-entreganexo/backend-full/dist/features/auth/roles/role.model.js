var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { RoleUser } from '../role-users/role-user.model.js';
import { ResourceRole } from '../resource-roles/resource-role.model.js';
let Role = class Role extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], Role.prototype, "id", void 0);
__decorate([
    Column({ type: DataType.STRING(80), allowNull: false, unique: true }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    Column({ type: DataType.STRING(255), allowNull: true }),
    __metadata("design:type", Object)
], Role.prototype, "description", void 0);
__decorate([
    Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'inactive' }),
    __metadata("design:type", String)
], Role.prototype, "status", void 0);
__decorate([
    HasMany(() => RoleUser),
    __metadata("design:type", Array)
], Role.prototype, "roleUsers", void 0);
__decorate([
    HasMany(() => ResourceRole),
    __metadata("design:type", Array)
], Role.prototype, "resourceRoles", void 0);
Role = __decorate([
    Table({ tableName: 'roles', timestamps: true })
], Role);
export { Role };
//# sourceMappingURL=role.model.js.map