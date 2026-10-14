import { Module, Global } from '@nestjs/common';
import { ENV_CONFIG } from '../../../config/environment/env.config.js';
import { IEnvConfig } from '../../../config/environment/env.interface.js';
import { sequelizeFactory } from './sequelize.factory.js';

export const SEQUELIZE = 'SEQUELIZE';

@Global()
@Module({
  providers: [
    {
      provide: SEQUELIZE,
      inject: [ENV_CONFIG],
      useFactory: async (cfg: IEnvConfig) => {
        const sequelize = sequelizeFactory(cfg);
        await sequelize.authenticate();
        // Al poner alter: true, Sequelize agregará las columnas faltantes (como address) automáticamente
        await sequelize.sync({ alter: true });
        return sequelize;
      },
    },
  ],
  exports: [SEQUELIZE],
})
export class SequelizeModule {}
