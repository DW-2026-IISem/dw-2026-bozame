import { ResourceRepository } from '../../infrastructure/persistence/repositories/resource.repository.js';
import { CreateResourceDto } from '../dto/create-resource.dto.js';
export declare class ResourcesService {
    private readonly repo;
    constructor(repo: ResourceRepository);
    create(dto: CreateResourceDto): Promise<import("../../resource.model.js").Resource>;
    findAll(): Promise<import("../../resource.model.js").Resource[]>;
    findOne(id: number): Promise<import("../../resource.model.js").Resource>;
}
