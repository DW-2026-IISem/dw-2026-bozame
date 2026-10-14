import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../../../common/guards/jwt-auth.guard.js';
import { RbacGuard } from '../../../../../../common/guards/rbac.guard.js';
import { CreateProductDto } from '../../../application/dto/create-product.dto.js';

// Tus verdaderos Casos de Uso
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case.js';
import { ListProductsUseCase } from '../../../application/use-cases/list-products.use-case.js';
import { GetProductByIdUseCase } from '../../../application/use-cases/get-product-by-id.use-case.js';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard) // ¡EL ESCUDO!
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
    // Le pasamos tu paginación convirtiendo los strings de la URL a números
    const products = await this.listProducts.execute(Number(page), Number(limit));
    return { products };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.getProductById.execute(id);
    return { product };
  }
}