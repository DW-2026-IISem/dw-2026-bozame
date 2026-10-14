import { Controller, Get, Post, Patch, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRoleUserDto } from '../../../application/dto/create-role-user.dto.js';
import { RoleUsersService } from '../../../application/services/role-users.service.js';

@ApiTags('role-users')
@Controller('asignaciones-rol')
export class RoleUsersController {
  constructor(private readonly service: RoleUsersService) {}

  @Post()
  @HttpCode(201)
  async assign(@Body() dto: CreateRoleUserDto) {
    const assignment = await this.service.assign(dto);
    return { assignment };
  }

  @Get()
  async list() {
    const assignments = await this.service.findAll();
    return { assignments };
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    const assignment = await this.service.deactivate(id);
    return { message: "Asignación desactivada", assignment };
  }
}
