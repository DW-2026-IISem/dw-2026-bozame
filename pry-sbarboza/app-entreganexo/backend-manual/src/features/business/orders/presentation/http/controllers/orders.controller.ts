import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from '../../../application/dto/create-order.dto.js';
import { OrderMapper } from '../../../application/mappers/order.mapper.js';
import { CreateOrderUseCase } from '../../../application/use-cases/create-order.use-case.js';
import { GetOrderByIdUseCase } from '../../../application/use-cases/get-order-by-id.use-case.js';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrder: GetOrderByIdUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Crear pedido transaccionalmente' })
  async create(@Body() dto: CreateOrderDto) {
    const order = await this.createOrder.execute(dto);
    return OrderMapper.toResponse(order);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pedido por id con sus detalles' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.getOrder.execute(id);
    return OrderMapper.toResponse(order);
  }
}
