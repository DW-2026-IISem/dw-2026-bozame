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
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';
export class CreateProductDto {
    name;
    brand;
    price;
    minStock;
    quantity;
    productTypeId;
}
__decorate([
    ApiProperty({ example: 'Café de Colombia' }),
    IsString(),
    IsNotEmpty({ message: 'name es requerido' }),
    MaxLength(150),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateProductDto.prototype, "brand", void 0);
__decorate([
    ApiProperty({ example: 15000 }),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    ApiPropertyOptional({ example: 5 }),
    IsOptional(),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "minStock", void 0);
__decorate([
    ApiPropertyOptional({ example: 50 }),
    IsOptional(),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "quantity", void 0);
__decorate([
    ApiProperty({ example: 1 }),
    IsNumber(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "productTypeId", void 0);
//# sourceMappingURL=create-product.dto.js.map