var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, HasMany, Index } from 'sequelize-typescript';
import { ResourceRole } from '../resource-roles/resource-role.model.js';
let Resource = class Resource extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], Resource.prototype, "id", void 0);
__decorate([
    Index({ name: 'uq_resources_method_path', unique: true }),
    Column({ type: DataType.STRING(10), allowNull: false }),
    __metadata("design:type", String)
], Resource.prototype, "method", void 0);
__decorate([
    Index({ name: 'uq_resources_method_path', unique: true }),
    Column({ type: DataType.STRING(255), allowNull: false }),
    __metadata("design:type", String)
], Resource.prototype, "path", void 0);
__decorate([
    Column({ type: DataType.STRING(255), allowNull: true }),
    __metadata("design:type", Object)
], Resource.prototype, "description", void 0);
__decorate([
    Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'inactive' }),
    __metadata("design:type", String)
], Resource.prototype, "status", void 0);
__decorate([
    HasMany(() => ResourceRole),
    __metadata("design:type", Array)
], Resource.prototype, "resourceRoles", void 0);
Resource = __decorate([
    Table({ tableName: 'resources', timestamps: true })
], Resource);
export { Resource };
//# sourceMappingURL=resource.model.js.map