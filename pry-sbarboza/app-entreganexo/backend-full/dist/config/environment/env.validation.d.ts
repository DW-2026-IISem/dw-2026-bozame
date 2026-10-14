export declare class EnvVariables {
    DB_DIALECT: string;
    DB_MYSQL_HOST?: string;
    DB_POSTGRES_HOST?: string;
    DB_MSSQL_HOST?: string;
    DB_ORACLE_HOST?: string;
}
export declare function validateEnv(raw: Record<string, unknown>): EnvVariables;
