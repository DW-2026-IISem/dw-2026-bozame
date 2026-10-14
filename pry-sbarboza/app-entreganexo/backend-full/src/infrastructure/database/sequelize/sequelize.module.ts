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
        await sequelize.sync({ alter: false });
        return sequelize;
      },
    },
  ],
  exports: [SEQUELIZE],
})
export class SequelizeModule {}
