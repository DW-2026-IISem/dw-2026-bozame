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
import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
export class CreateResourceDto {
    method;
    path;
    description;
}
__decorate([
    ApiProperty({ example: 'POST' }),
    IsString(),
    IsNotEmpty(),
    IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
    __metadata("design:type", String)
], CreateResourceDto.prototype, "method", void 0);
__decorate([
    ApiProperty({ example: '/api/reportes/:id' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateResourceDto.prototype, "path", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateResourceDto.prototype, "description", void 0);
//# sourceMappingURL=create-resource.dto.js.map