import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsEmail, IsOptional } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Ana María Pérez' })
  @IsString()
  @IsNotEmpty({ message: 'name es requerido' })
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: 'ana@demo.com' })
  @IsOptional()
  @IsEmail({}, { message: 'email debe ser un correo válido' })
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;
}
