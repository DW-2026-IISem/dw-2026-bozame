import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({ example: 'POST' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  method!: string;

  @ApiProperty({ example: '/api/reportes/:id' })
  @IsString()
  @IsNotEmpty()
  path!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
