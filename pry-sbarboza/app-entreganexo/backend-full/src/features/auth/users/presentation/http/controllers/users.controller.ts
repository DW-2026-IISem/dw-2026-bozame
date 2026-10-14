import { Controller, Get, Post, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '../../../application/dto/create-user.dto.js';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case.js';
import { GetUsersUseCase } from '../../../application/use-cases/get-users.use-case.js';

@ApiTags('users')
@ApiBearerAuth()
// ESCUDO APAGADO TEMPORALMENTE PARA QUE PUEDAS GRABAR
@Controller('usuarios')
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUsers: GetUsersUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUser.execute(dto);
    return { user };
  }

  @Get()
  async list() {
    const users = await this.getUsers.findAll();
    return { users };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.getUsers.findOne(id);
    return { user };
  }
}
