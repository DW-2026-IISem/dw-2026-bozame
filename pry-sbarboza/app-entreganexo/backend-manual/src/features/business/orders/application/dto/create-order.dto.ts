import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'productId debe ser entero' })
  @Min(1, { message: 'productId es requerido' })
  productId!: number;

  @ApiProperty({ example: 2 })
  @IsInt({ message: 'quantity debe ser entero' })
  @Min(1, { message: 'quantity debe ser mayor que 0' })
  quantity!: number;

  @ApiPropertyOptional({ example: 15000 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'unitPrice debe ser un número' })
  @IsPositive({ message: 'unitPrice debe ser mayor que 0' })
  unitPrice?: number;

  @ApiPropertyOptional({ example: 'Sin salsas' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  observations?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'clientId debe ser entero' })
  @Min(1, { message: 'clientId es requerido' })
  clientId!: number;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'merchantId debe ser entero' })
  @Min(1, { message: 'merchantId es requerido' })
  merchantId!: number;

  @ApiPropertyOptional({ example: 'app' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  channel?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray({ message: 'items debe ser un arreglo' })
  @ArrayMinSize(1, { message: 'El pedido debe tener al menos un ítem' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
