var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, Min, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator';
export class SaleItemDto {
    productId;
    quantity;
    unitPrice;
}
__decorate([
    ApiProperty(),
    IsNumber(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "productId", void 0);
__decorate([
    ApiProperty(),
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "quantity", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "unitPrice", void 0);
export class CreateSaleDto {
    clientId;
    items;
    tax;
    discounts;
}
__decorate([
    ApiProperty(),
    IsNumber(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "clientId", void 0);
__decorate([
    ApiProperty({ type: [SaleItemDto] }),
    ValidateNested({ each: true }),
    Type(() => SaleItemDto),
    ArrayMinSize(1),
    __metadata("design:type", Array)
], CreateSaleDto.prototype, "items", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "tax", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "discounts", void 0);
//# sourceMappingURL=create-sale.dto.js.map