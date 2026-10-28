import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from '../../../application/dto/create-client.dto.js';
import { CreateClientUseCase } from '../../../application/use-cases/create-client.use-case.js';
import { ListClientsUseCase } from '../../../application/use-cases/list-clients.use-case.js';
import { GetClientByIdUseCase } from '../../../application/use-cases/get-client-by-id.use-case.js';
import { ClientMapper } from '../../../application/mappers/client.mapper.js';
import { ClientModel } from '../../../infrastructure/persistence/models/client.model.js';

@ApiTags('clients')
@Controller('clientes')
export class ClientsController {
  constructor(
    private readonly createClient: CreateClientUseCase,
    private readonly listClients: ListClientsUseCase,
    private readonly getClient: GetClientByIdUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateClientDto) {
    const client = await this.createClient.execute(dto);
    return ClientMapper.toResponse(client);
  }

  @Get()
  async list(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.listClients.execute(Number(page), Number(limit));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const client = await this.getClient.execute(id);
    return ClientMapper.toResponse(client);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    const found = await ClientModel.findByPk(id);
    if (found) {
      await found.update({ status: 'inactive' });
    }
    return { success: true };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const found = await ClientModel.findByPk(id);
    if (found) {
      await found.destroy();
    }
    return { success: true };
  }
}
