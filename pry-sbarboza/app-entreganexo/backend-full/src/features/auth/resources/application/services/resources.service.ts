import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ResourceRepository } from '../../infrastructure/persistence/repositories/resource.repository.js';
import { CreateResourceDto } from '../dto/create-resource.dto.js';

@Injectable()
export class ResourcesService {
  constructor(private readonly repo: ResourceRepository) {}

  async create(dto: CreateResourceDto) {
    const existing = await this.repo.findByOperation(dto.method, dto.path);
    if (existing) throw new ConflictException(`Resource ${dto.method.toUpperCase()} ${dto.path} already exists`);
    
    // Función simple para normalizar la ruta quitando dobles barras y barra final
    let cleanPath = dto.path.split('?')[0].split('#')[0].replace(/\/{2,}/g, '/').replace(/\/+$/, '');
    if (cleanPath === '') cleanPath = '/';

    return this.repo.create({ ...dto, method: dto.method.trim().toUpperCase(), path: cleanPath, status: 'active' });
  }

  async findAll() { return this.repo.findAllActive(); }

  async findOne(id: number) {
    const resource = await this.repo.findById(id);
    if (!resource || resource.status !== 'active') throw new NotFoundException('Resource not found');
    return resource;
  }
}
