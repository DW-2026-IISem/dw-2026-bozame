import { Controller, Get, Post, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSaleDto } from '../../../application/dto/create-sale.dto.js';
import { CreateSaleUseCase } from '../../../application/use-cases/create-sale.use-case.js';
import { GetSaleByIdUseCase } from '../../../application/use-cases/get-sale-by-id.use-case.js';
import { SaleMapper } from '../../../application/mappers/sale.mapper.js';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(
    private readonly createSale: CreateSaleUseCase,
    private readonly getSale: GetSaleByIdUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateSaleDto) {
    const sale = await this.createSale.execute(dto);
    return SaleMapper.toResponse(sale);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const sale = await this.getSale.execute(id);
    return SaleMapper.toResponse(sale);
  }
}
