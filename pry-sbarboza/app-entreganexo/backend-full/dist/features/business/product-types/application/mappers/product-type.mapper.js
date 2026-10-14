import { ProductType } from '../../domain/entities/product-type.entity.js';
export class ProductTypeMapper {
    static toEntity(dto) {
        return new ProductType({
            name: dto.name,
            description: dto.description ?? null,
            status: 'active',
        });
    }
    static toResponse(pt) {
        return {
            id: pt.id,
            name: pt.name,
            description: pt.description,
            status: pt.status,
        };
    }
}
//# sourceMappingURL=product-type.mapper.js.map