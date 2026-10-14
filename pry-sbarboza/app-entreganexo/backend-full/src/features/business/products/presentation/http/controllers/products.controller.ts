import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDto } from '../../../application/dto/create-product.dto.js';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case.js';
import { GetProductsUseCase } from '../../../application/use-cases/get-products.use-case.js';
import { JwtAuthGuard } from '../../../../../../common/guards/jwt-auth.guard.js';
import { RbacGuard } from '../../../../../../common/guards/rbac.guard.js';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard) // ¡AQUÍ ESTÁ EL ESCUDO!
@Controller('productos')
export class ProductsController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly getProducts: GetProductsUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const product = await this.createProduct.execute(dto);
    return { product };
  }

  @Get()
  async list() {
    const products = await this.getProducts.findAll();
    return { products };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.getProducts.findOne(id);
    return { product };
  }
}
