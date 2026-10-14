import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, Min, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator';

export class SaleItemDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  productId!: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}

export class CreateSaleDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  clientId!: number;

  @ApiProperty({ type: [SaleItemDto] })
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  @ArrayMinSize(1)
  items!: SaleItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  discounts?: number;
}
