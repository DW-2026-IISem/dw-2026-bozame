import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'CC' })
  @IsString()
  @IsNotEmpty({ message: 'El tipo de documento es requerido' })
  @MaxLength(10)
  documentType!: string;

  @ApiProperty({ example: '1010101010' })
  @IsString()
  @IsNotEmpty({ message: 'El número de documento es requerido' })
  @MaxLength(20)
  documentNumber!: string;

  @ApiProperty({ example: 'Carlos Martínez' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: '3001234567' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'carlos@demo.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @MaxLength(150)
  email?: string;
}
