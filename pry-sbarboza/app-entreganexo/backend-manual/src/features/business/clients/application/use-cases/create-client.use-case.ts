import { Inject, Injectable } from '@nestjs/common';
import { ClientDocumentExistsException } from '../../domain/exceptions/client-document-exists.exception.js';
import { CLIENT_REPOSITORY } from '../../domain/interfaces/client.repository.js';
import type { IClientRepository } from '../../domain/interfaces/client.repository.js';
import { CreateClientDto } from '../dto/create-client.dto.js';
import { ClientMapper } from '../mappers/client.mapper.js';
import type { Client } from '../../domain/entities/client.entity.js';

@Injectable()
export class CreateClientUseCase {
  constructor(@Inject(CLIENT_REPOSITORY) private readonly repo: IClientRepository) {}

  async execute(dto: CreateClientDto): Promise<Client> {
    const existing = await this.repo.findByDocument(dto.documentNumber);
    if (existing) {
      throw new ClientDocumentExistsException(dto.documentNumber);
    }
    return this.repo.create(ClientMapper.toEntity(dto));
  }
}
