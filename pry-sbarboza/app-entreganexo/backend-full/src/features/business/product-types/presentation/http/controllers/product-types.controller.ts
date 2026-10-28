import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductTypeDto } from '../../../application/dto/create-product-type.dto.js';
import { CreateProductTypeUseCase } from '../../../application/use-cases/create-product-type.use-case.js';
import { ListProductTypesUseCase } from '../../../application/use-cases/list-product-types.use-case.js';
import { GetProductTypeByIdUseCase } from '../../../application/use-cases/get-product-type-by-id.use-case.js';
import { ProductTypeMapper } from '../../../application/mappers/product-type.mapper.js';
import { ProductTypeModel } from '../../../infrastructure/persistence/models/product-type.model.js';

@ApiTags('product-types')
@Controller('product-types')
export class ProductTypesController {
  constructor(
    private readonly createProductType: CreateProductTypeUseCase,
    private readonly listProductTypes: ListProductTypesUseCase,
    private readonly getProductType: GetProductTypeByIdUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateProductTypeDto) {
    const pt = await this.createProductType.execute(dto);
    return ProductTypeMapper.toResponse(pt);
  }

  @Get()
  async list(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.listProductTypes.execute(Number(page), Number(limit));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const pt = await this.getProductType.execute(id);
    return ProductTypeMapper.toResponse(pt);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    const found = await ProductTypeModel.findByPk(id);
    if (found) {
      await found.update({ status: 'inactive' });
    }
    return { success: true };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const found = await ProductTypeModel.findByPk(id);
    if (found) {
      await found.destroy();
    }
    return { success: true };
  }
}
