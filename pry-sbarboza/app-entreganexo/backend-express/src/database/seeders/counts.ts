/**
 * Cantidad de registros por tabla (snake_case = nombre de tabla BD).
 * Prioridad: CLI (--clients=N) > env (SEED_CLIENTS) > default de este archivo.
 *
 * Solo las tablas con datos **variables** tienen conteo. Los catálogos de
 * seguridad (`roles`, `resources`, `role_users`, `resource_roles`) son
 * deterministas: su contenido vive en el código
 * (`resource-catalog.ts` y los `*.seeder.ts` de cada feature de auth), no en un
 * número. `refresh_tokens` no tiene seeder: lo puebla el login.
 *
 * Cuando agregues features, suma aquí la clave (nombre de tabla) y léela en el runner.
 */
export type SeedCounts = {
  users: number;
  clients: number;
  product_types: number;
  products: number;
  sales: number;
  product_sales: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  // 2 usuarios canónicos: admin (ADMIN, 68 permisos) y seller (SELLER, 7 permisos).
  users: 2,
  clients: 10,
  product_types: 25,
  products: 15,
  sales: 5,
  product_sales: 12,
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envMap: Array<[keyof SeedCounts, string | undefined]> = [
    ["users", process.env.SEED_USERS],
    ["clients", process.env.SEED_CLIENTS],
    ["product_types", process.env.SEED_PRODUCT_TYPES],
    ["products", process.env.SEED_PRODUCTS],
    ["sales", process.env.SEED_SALES],
    ["product_sales", process.env.SEED_PRODUCT_SALES],
  ];
  for (const [key, value] of envMap) {
    if (value !== undefined && value !== "") {
      counts[key] = Number(value);
    }
  }

  for (const arg of argv) {
    const m = arg.match(/^--([a-zA-Z_]+)=(\d+)$/);
    if (!m) continue;
    const key = m[1] as keyof SeedCounts;
    const value = Number(m[2]);
    if (key in counts) {
      counts[key] = value;
    }
  }

  return counts;
}
