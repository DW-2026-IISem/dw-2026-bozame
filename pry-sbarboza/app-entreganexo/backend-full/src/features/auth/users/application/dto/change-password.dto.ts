import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  current_password!: string;

  @ApiProperty({ example: 'NuevaPassword456!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  new_password!: string;
}
