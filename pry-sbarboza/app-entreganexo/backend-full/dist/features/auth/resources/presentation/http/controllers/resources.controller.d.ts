import { CreateResourceDto } from '../../../application/dto/create-resource.dto.js';
import { ResourcesService } from '../../../application/services/resources.service.js';
export declare class ResourcesController {
    private readonly service;
    constructor(service: ResourcesService);
    create(dto: CreateResourceDto): Promise<{
        resource: import("../../../resource.model.js").Resource;
    }>;
    list(): Promise<{
        resources: import("../../../resource.model.js").Resource[];
    }>;
    findOne(id: number): Promise<{
        resource: import("../../../resource.model.js").Resource;
    }>;
}
