import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMerchantDto {
  @ApiProperty({ example: 'Distribuidora Central' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: 'Venta de víveres y abarrotes' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
