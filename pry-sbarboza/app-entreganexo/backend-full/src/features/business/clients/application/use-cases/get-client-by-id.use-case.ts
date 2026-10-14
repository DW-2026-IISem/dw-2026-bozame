import { Injectable, Inject } from '@nestjs/common';
import { Client } from '../../domain/entities/client.entity.js';
import { CLIENT_REPOSITORY, type IClientRepository } from '../../domain/interfaces/client.repository.js';
import { ClientNotFoundException } from '../../domain/exceptions/client.exceptions.js';

@Injectable()
export class GetClientByIdUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(id: number): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new ClientNotFoundException(id);
    }
    return client;
  }
}
