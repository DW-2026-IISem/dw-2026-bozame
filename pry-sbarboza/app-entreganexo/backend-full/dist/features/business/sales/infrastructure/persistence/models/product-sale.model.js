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
import { SaleModel } from './sale.model.js';
import { ProductModel } from '../../../../products/infrastructure/persistence/models/product.model.js';
let ProductSaleModel = class ProductSaleModel extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], ProductSaleModel.prototype, "id", void 0);
__decorate([
    ForeignKey(() => SaleModel),
    Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], ProductSaleModel.prototype, "saleId", void 0);
__decorate([
    ForeignKey(() => ProductModel),
    Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], ProductSaleModel.prototype, "productId", void 0);
__decorate([
    Column({ type: DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductSaleModel.prototype, "quantity", void 0);
__decorate([
    Column({ type: DataType.DECIMAL(10, 2), allowNull: false }),
    __metadata("design:type", Number)
], ProductSaleModel.prototype, "unitPrice", void 0);
__decorate([
    Column({ type: DataType.DECIMAL(10, 2), allowNull: false }),
    __metadata("design:type", Number)
], ProductSaleModel.prototype, "total", void 0);
__decorate([
    BelongsTo(() => SaleModel),
    __metadata("design:type", Function)
], ProductSaleModel.prototype, "sale", void 0);
__decorate([
    BelongsTo(() => ProductModel),
    __metadata("design:type", ProductModel)
], ProductSaleModel.prototype, "product", void 0);
ProductSaleModel = __decorate([
    Table({ tableName: 'product_sales', timestamps: true })
], ProductSaleModel);
export { ProductSaleModel };
//# sourceMappingURL=product-sale.model.js.map