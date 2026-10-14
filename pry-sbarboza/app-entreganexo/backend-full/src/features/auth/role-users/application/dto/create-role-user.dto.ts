import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRoleUserDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  user_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  role_id!: number;
}
