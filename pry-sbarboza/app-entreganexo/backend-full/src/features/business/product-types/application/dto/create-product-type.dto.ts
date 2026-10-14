import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateProductTypeDto {
  @ApiProperty({ example: 'Bebidas' })
  @IsString()
  @IsNotEmpty({ message: 'name es requerido' })
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: 'Bebidas frías y calientes' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
