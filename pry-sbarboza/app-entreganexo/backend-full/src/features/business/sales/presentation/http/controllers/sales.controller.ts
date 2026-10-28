import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSaleDto } from '../../../application/dto/create-sale.dto.js';
import { CreateSaleUseCase } from '../../../application/use-cases/create-sale.use-case.js';
import { GetSaleByIdUseCase } from '../../../application/use-cases/get-sale-by-id.use-case.js';
import { ListSalesUseCase } from '../../../application/use-cases/list-sales.use-case.js';
import { SaleMapper } from '../../../application/mappers/sale.mapper.js';
import { SaleModel } from '../../../infrastructure/persistence/models/sale.model.js';

@ApiTags('sales')
@Controller(['sales', 'ventas'])
export class SalesController {
  constructor(
    private readonly createSale: CreateSaleUseCase,
    private readonly getSale: GetSaleByIdUseCase,
    private readonly listSales: ListSalesUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateSaleDto) {
    const sale = await this.createSale.execute(dto);
    return SaleMapper.toResponse(sale);
  }

  @Get()
  async list(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.listSales.execute(Number(page), Number(limit));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const sale = await this.getSale.execute(id);
    return SaleMapper.toResponse(sale);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    const found = await SaleModel.findByPk(id);
    if (found) {
      await found.update({ status: 'canceled' });
    }
    return { success: true };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const found = await SaleModel.findByPk(id);
    if (found) {
      await found.destroy();
    }
    return { success: true };
  }
}
