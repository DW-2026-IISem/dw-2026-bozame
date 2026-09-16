import { Client } from '../../domain/entities/client.entity.js';
import { CreateClientDto } from '../dto/create-client.dto.js';

export class ClientMapper {
  static toEntity(dto: CreateClientDto): Client {
    return new Client({
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      name: dto.name,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
      isActive: true,
    });
  }

  static toResponse(client: Client) {
    return {
      id: client.id,
      documentType: client.documentType,
      documentNumber: client.documentNumber,
      name: client.name,
      phone: client.phone,
      email: client.email,
      isActive: client.isActive,
    };
  }
}
