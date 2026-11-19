import {
  ClientResponseDto,
  CreateClientDto,
  PatchClientDto,
  UpdateClientDto,
  toClientResponse,
} from "./dto";
import { ClientsRepository } from "./clients.repository";
import { Client } from "./client.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Clients.
 * Reglas de negocio; no conoce req/res ni Sequelize (delega en el repository)
 * y devuelve DTOs, nunca instancias del modelo.
 */
export class ClientsService {
  public constructor(
    private readonly repository: ClientsRepository = new ClientsRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<ClientResponseDto[]> {
    const clients = await this.repository.findAllActive();
    return clients.map((client) => toClientResponse(client));
  }

  public async getOne(id: number): Promise<ClientResponseDto> {
    return toClientResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateClientDto): Promise<ClientResponseDto> {
    const client = await this.repository.create({
      name: body.name,
      address: body.address,
      phone: body.phone,
      email: body.email,
      password: body.password,
      status: body.status ?? "active",
    });
    return toClientResponse(client);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateClientDto): Promise<ClientResponseDto> {
    const client = await this.findOrFail(id);
    await this.repository.update(client, {
      name: body.name,
      address: body.address,
      phone: body.phone,
      email: body.email,
      password: body.password ?? client.password,
    });
    return toClientResponse(client);
  }

  public async updatePatch(id: number, body: PatchClientDto): Promise<ClientResponseDto> {
    const client = await this.findOrFail(id);
    await this.repository.update(client, body);
    return toClientResponse(client);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    // `onlyActive: false` -> también permite purgar un registro ya desactivado.
    const client = await this.findOrFail(id, false);
    await this.repository.delete(client);
  }

  /** Eliminación lógica -> `status = inactive`. */
  public async deleteLogical(id: number): Promise<ClientResponseDto> {
    const client = await this.findOrFail(id);
    await this.repository.update(client, { status: "inactive" });
    return toClientResponse(client);
  }

  // ================== HELPERS ==================
  /** Único lugar donde se decide qué es «no existe» (404). */
  private async findOrFail(id: number, onlyActive = true): Promise<Client> {
    const client = await this.repository.findById(id);
    if (!client || (onlyActive && client.status !== "active")) {
      throw new AppError(404, "Client not found");
    }
    return client;
  }
}
