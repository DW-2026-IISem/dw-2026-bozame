import { Sequelize } from 'sequelize-typescript';
import { IEnvConfig } from '../../../config/environment/env.interface.js';
export declare const ALL_MODELS: any[];
export declare function sequelizeFactory(cfg: IEnvConfig): Sequelize;
