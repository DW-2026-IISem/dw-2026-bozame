import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { RoleUserRepository } from '../../infrastructure/persistence/repositories/role-user.repository.js';
import { CreateRoleUserDto } from '../dto/create-role-user.dto.js';

@Injectable()
export class RoleUsersService {
  constructor(private readonly repo: RoleUserRepository) {}

  async assign(dto: CreateRoleUserDto) {
    const existing = await this.repo.findByUserAndRole(dto.user_id, dto.role_id);
    if (existing) {
      if (existing.status === 'active') throw new ConflictException('El rol ya está asignado a este usuario');
      return this.repo.update(existing, { status: 'active' });
    }
    return this.repo.create({ userId: dto.user_id, roleId: dto.role_id, status: 'active' });
  }

  async findAll() { return this.repo.findAllActive(); }

  async deactivate(id: number) {
    const assignment = await this.repo.findById(id);
    if (!assignment || assignment.status !== 'active') throw new NotFoundException('Asignación no encontrada');
    return this.repo.update(assignment, { status: 'inactive' });
  }
}
