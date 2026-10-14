import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResourceRolesService } from '../../../application/services/resource-roles.service.js';

@ApiTags('resource-roles')
@Controller('concesiones-rol')
export class ResourceRolesController {
  constructor(private readonly service: ResourceRolesService) {}

  @Get()
  async list() {
    const grants = await this.service.findAll();
    return { grants };
  }
}
