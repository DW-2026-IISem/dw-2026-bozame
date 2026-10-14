import { Controller, Get, Post, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateResourceDto } from '../../../application/dto/create-resource.dto.js';
import { ResourcesService } from '../../../application/services/resources.service.js';

@ApiTags('resources')
@Controller('recursos')
export class ResourcesController {
  constructor(private readonly service: ResourcesService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateResourceDto) {
    const resource = await this.service.create(dto);
    return { resource };
  }

  @Get()
  async list() {
    const resources = await this.service.findAll();
    return { resources };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const resource = await this.service.findOne(id);
    return { resource };
  }
}
