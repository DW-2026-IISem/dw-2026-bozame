import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository.js';
import { UserMapper } from '../mappers/user.mapper.js';
import { UserNotFoundException } from '../../domain/exceptions/user.exceptions.js';

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly repo: UserRepository) {}

  async findAll() {
    const users = await this.repo.findAllActive();
    return users.map(UserMapper.toResponse);
  }

  async findOne(id: number) {
    const user = await this.repo.findById(id);
    if (!user || user.status !== 'active') throw new UserNotFoundException(id);
    return UserMapper.toResponse(user);
  }
}
