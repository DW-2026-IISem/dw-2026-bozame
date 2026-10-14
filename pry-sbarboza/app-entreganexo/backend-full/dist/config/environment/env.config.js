import { config as loadDotenv } from 'dotenv';
import { validateEnv } from './env.validation.js';
export const ENV_CONFIG = Symbol('ENV_CONFIG');
function toBlock(prefix, raw, defaultPort) {
    return {
        host: String(raw[`DB_${prefix}_HOST`] ?? 'localhost'),
        port: Number(raw[`DB_${prefix}_PORT`] ?? defaultPort),
        username: String(raw[`DB_${prefix}_USERNAME`] ?? ''),
        password: String(raw[`DB_${prefix}_PASSWORD`] ?? ''),
        name: String(raw[`DB_${prefix}_NAME`] ?? ''),
        connectString: raw[`DB_${prefix}_CONNECT_STRING`] ? String(raw[`DB_${prefix}_CONNECT_STRING`]) : undefined,
    };
}
export function loadEnvConfig() {
    loadDotenv();
    const raw = process.env;
    validateEnv(raw);
    const dialect = String(raw.DB_DIALECT);
    return {
        port: Number(raw.PORT ?? 3002),
        nodeEnv: String(raw.NODE_ENV ?? 'development'),
        dbDialect: dialect,
        mysql: toBlock('MYSQL', raw, 3306),
        postgres: toBlock('POSTGRES', raw, 5432),
        mssql: toBlock('MSSQL', raw, 1433),
        oracle: toBlock('ORACLE', raw, 1521),
    };
}
//# sourceMappingURL=env.config.js.map