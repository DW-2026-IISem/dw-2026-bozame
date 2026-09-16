import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMerchantDto } from '../../../application/dto/create-merchant.dto.js';
import { MerchantMapper } from '../../../application/mappers/merchant.mapper.js';
import { CreateMerchantUseCase } from '../../../application/use-cases/create-merchant.use-case.js';
import { GetMerchantByIdUseCase } from '../../../application/use-cases/get-merchant-by-id.use-case.js';
import { ListMerchantsUseCase } from '../../../application/use-cases/list-merchants.use-case.js';

@ApiTags('merchants')
@Controller('merchants')
export class MerchantsController {
  constructor(
    private readonly createMerchant: CreateMerchantUseCase,
    private readonly listMerchants: ListMerchantsUseCase,
    private readonly getMerchant: GetMerchantByIdUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Crear comercio' })
  async create(@Body() dto: CreateMerchantDto) {
    const merchant = await this.createMerchant.execute(dto);
    return MerchantMapper.toResponse(merchant);
  }

  @Get()
  @ApiOperation({ summary: 'Listar comercios (paginado)' })
  async list(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.listMerchants.execute(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener comercio por id' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const merchant = await this.getMerchant.execute(id);
    return MerchantMapper.toResponse(merchant);
  }
}
