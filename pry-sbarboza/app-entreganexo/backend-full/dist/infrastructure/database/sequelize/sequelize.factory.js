import { Sequelize } from 'sequelize-typescript';
import { getDbBlock } from '../../../config/environment/db-env.js';
import { ClientModel } from '../../../features/business/clients/infrastructure/persistence/models/client.model.js';
import { ProductTypeModel } from '../../../features/business/product-types/infrastructure/persistence/models/product-type.model.js';
export const ALL_MODELS = [
    ClientModel,
    ProductTypeModel
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
    if (cfg.dbDialect === 'oracle' && block.connectString) {
        options.connectString = block.connectString;
    }
    return new Sequelize(options);
}
//# sourceMappingURL=sequelize.factory.js.map