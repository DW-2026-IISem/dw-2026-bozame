import { Controller, Get, Post, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from '../../../application/dto/create-role.dto.js';
import { RolesService } from '../../../application/services/roles.service.js';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateRoleDto) {
    const role = await this.service.create(dto);
    return { role };
  }

  @Get()
  async list() {
    const roles = await this.service.findAll();
    return { roles };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const role = await this.service.findOne(id);
    return { role };
  }
}
