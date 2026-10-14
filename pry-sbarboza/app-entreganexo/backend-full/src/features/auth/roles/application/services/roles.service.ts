import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { RoleRepository } from '../../infrastructure/persistence/repositories/role.repository.js';
import { CreateRoleDto } from '../dto/create-role.dto.js';

@Injectable()
export class RolesService {
  constructor(private readonly repo: RoleRepository) {}

  async create(dto: CreateRoleDto) {
    const existing = await this.repo.findByName(dto.name);
    if (existing) throw new ConflictException('Role name already in use');
    return this.repo.create({ ...dto, name: dto.name.trim().toUpperCase(), status: 'active' });
  }

  async findAll() { return this.repo.findAllActive(); }

  async findOne(id: number) {
    const role = await this.repo.findById(id);
    if (!role || role.status !== 'active') throw new NotFoundException('Role not found');
    return role;
  }
}
