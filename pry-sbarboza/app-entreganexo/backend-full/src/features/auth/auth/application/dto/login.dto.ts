import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'admin', required: false })
  @IsString()
  @IsOptional()
  identifier?: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
