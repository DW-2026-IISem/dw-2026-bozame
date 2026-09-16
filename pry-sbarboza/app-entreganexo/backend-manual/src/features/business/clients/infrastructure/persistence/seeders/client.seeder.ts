import { Inject, Injectable, Logger } from "@nestjs/common";
import { Client } from '../../../domain/entities/client.entity.js';
import { CLIENT_REPOSITORY } from '../../../domain/interfaces/client.repository.js';
import type { IClientRepository } from '../../../domain/interfaces/client.repository.js';

@Injectable()
export class ClientSeeder {
  private readonly logger = new Logger(ClientSeeder.name);

  constructor(@Inject(CLIENT_REPOSITORY) private readonly repo: IClientRepository) {}

  async seed(): Promise<void> {
    const documentNumber = '1234567890';
    const existing = await this.repo.findByDocument(documentNumber);
    if (existing) {
      this.logger.log('Seeder clients: ya existía el cliente demo (idempotente)');
      return;
    }
    await this.repo.create(
      new Client({
        documentType: 'CC',
        documentNumber,
        name: 'Cliente Demo',
        phone: '3000000000',
        email: 'demo@entreganexo.com',
        isActive: true,
      })
    );
    this.logger.log('Seeder clients: cliente demo creado exitosamente');
  }
}
