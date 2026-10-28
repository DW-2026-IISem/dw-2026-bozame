import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDto } from '../../../application/dto/create-product.dto.js';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case.js';
import { ListProductsUseCase } from '../../../application/use-cases/list-products.use-case.js';
import { GetProductByIdUseCase } from '../../../application/use-cases/get-product-by-id.use-case.js';
import { ProductModel } from '../../../infrastructure/persistence/models/product.model.js';

@ApiTags('products')
@ApiBearerAuth()
@Controller('productos')
export class ProductsController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly listProducts: ListProductsUseCase,
    private readonly getProductById: GetProductByIdUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const product = await this.createProduct.execute(dto);
    return { product };
  }

  @Get()
  async list(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.listProducts.execute(Number(page), Number(limit));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.getProductById.execute(id);
    return { product };
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    const found = await ProductModel.findByPk(id);
    if (found) {
      await found.update({ status: 'inactive' });
    }
    return { success: true };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const found = await ProductModel.findByPk(id);
    if (found) {
      await found.destroy();
    }
    return { success: true };
  }
}
