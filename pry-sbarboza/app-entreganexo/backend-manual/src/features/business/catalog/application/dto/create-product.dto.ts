import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'SKU-1001' })
  @IsString()
  @IsNotEmpty({ message: 'El SKU es requerido' })
  @MaxLength(50)
  sku!: string;

  @ApiProperty({ example: 'Arroz Diana 1kg' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: 'Bolsa de arroz blanco' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ example: 3500 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser numérico' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  price!: number;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'merchantId debe ser entero' })
  @Min(1, { message: 'merchantId es requerido' })
  merchantId!: number;
}
