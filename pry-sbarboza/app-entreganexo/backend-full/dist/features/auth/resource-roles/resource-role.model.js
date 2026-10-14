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
import { Role } from '../roles/role.model.js';
import { Resource } from '../resources/resource.model.js';
let ResourceRole = class ResourceRole extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], ResourceRole.prototype, "id", void 0);
__decorate([
    ForeignKey(() => Role),
    Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'role_id' }),
    __metadata("design:type", Number)
], ResourceRole.prototype, "roleId", void 0);
__decorate([
    ForeignKey(() => Resource),
    Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, field: 'resource_id' }),
    __metadata("design:type", Number)
], ResourceRole.prototype, "resourceId", void 0);
__decorate([
    Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'inactive' }),
    __metadata("design:type", String)
], ResourceRole.prototype, "status", void 0);
__decorate([
    BelongsTo(() => Role),
    __metadata("design:type", Function)
], ResourceRole.prototype, "role", void 0);
__decorate([
    BelongsTo(() => Resource),
    __metadata("design:type", Function)
], ResourceRole.prototype, "resource", void 0);
ResourceRole = __decorate([
    Table({
        tableName: 'resource_roles',
        timestamps: true,
        indexes: [
            { name: 'uq_resource_roles_role_resource', unique: true, fields: ['role_id', 'resource_id'] }
        ]
    })
], ResourceRole);
export { ResourceRole };
//# sourceMappingURL=resource-role.model.js.map