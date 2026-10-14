import { Module } from '@nestjs/common';
import { UsersController } from './presentation/http/controllers/users.controller.js';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case.js';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case.js';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository.js';
import { UserSeeder } from './infrastructure/persistence/seeders/user.seeder.js';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    GetUsersUseCase,
    UserRepository,
    UserSeeder
  ],
  exports: [UserSeeder],
})
export class UsersModule {}
