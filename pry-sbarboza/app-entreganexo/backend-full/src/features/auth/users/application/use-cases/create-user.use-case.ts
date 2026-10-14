import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UserConflictException } from '../../domain/exceptions/user.exceptions.js';
import { UserMapper } from '../mappers/user.mapper.js';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(dto: CreateUserDto) {
    const conflicts = await this.repo.findConflicts(dto.username, dto.email);
    if (conflicts.length > 0) {
      const taken = conflicts[0];
      throw new UserConflictException(taken.username === dto.username.trim().toLowerCase() ? 'username' : 'email');
    }

    const user = await this.repo.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      avatar: dto.avatar ?? null,
      status: 'active'
    });
    return UserMapper.toResponse(user);
  }
}
