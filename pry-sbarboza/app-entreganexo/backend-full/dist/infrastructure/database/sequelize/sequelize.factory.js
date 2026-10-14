import { Sequelize } from 'sequelize-typescript';
import { getDbBlock } from '../../../config/environment/db-env.js';
import { ClientModel } from '../../../features/business/clients/infrastructure/persistence/models/client.model.js';
import { ProductTypeModel } from '../../../features/business/product-types/infrastructure/persistence/models/product-type.model.js';
import { ProductModel } from '../../../features/business/products/infrastructure/persistence/models/product.model.js';
import { SaleModel } from '../../../features/business/sales/infrastructure/persistence/models/sale.model.js';
import { ProductSaleModel } from '../../../features/business/sales/infrastructure/persistence/models/product-sale.model.js';
import { User } from '../../../features/auth/users/user.model.js';
import { Role } from '../../../features/auth/roles/role.model.js';
import { Resource } from '../../../features/auth/resources/resource.model.js';
import { RoleUser } from '../../../features/auth/role-users/role-user.model.js';
import { ResourceRole } from '../../../features/auth/resource-roles/resource-role.model.js';
import { RefreshToken } from '../../../features/auth/refresh-tokens/refresh-token.model.js';
export const ALL_MODELS = [
    ClientModel, ProductTypeModel, ProductModel, SaleModel, ProductSaleModel,
    User, Role, Resource, RoleUser, ResourceRole, RefreshToken
];
export function sequelizeFactory(cfg) {
    const block = getDbBlock(cfg);
    const options = {
        dialect: cfg.dbDialect,
        host: block.host,
        port: block.port,
        username: block.username,
        password: block.password,
        database: block.name,
        models: ALL_MODELS,
        logging: false,
    };
    return new Sequelize(options);
}
//# sourceMappingURL=sequelize.factory.js.map