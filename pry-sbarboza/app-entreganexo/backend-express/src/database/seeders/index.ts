import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/clients/client.model";
import "../../features/business/product-types/product-type.model";
import "../../features/business/products/product.model";
import "../../features/business/sales/sale.model";
import "../../features/business/product-sales/product-sale.model";
import "../../features/business/products/products.associations";
import "../../features/business/sales/sales.associations";
import "../../features/business/product-sales/product-sales.associations";
import "../../features/auth/users/user.model";
import "../../features/auth/roles/role.model";
import "../../features/auth/resources/resource.model";
import "../../features/auth/role-users/role-user.model";
import "../../features/auth/resource-roles/resource-role.model";
import "../../features/auth/refresh-tokens/refresh-token.model";
import "../../features/auth/rbac.associations";
import { seedRoles } from "../../features/auth/roles/roles.seeder";
import { seedResources } from "../../features/auth/resources/resources.seeder";
import { seedUsers } from "../../features/auth/users/users.seeder";
import { seedRoleUsers } from "../../features/auth/role-users/role-users.seeder";
import { seedResourceRoles } from "../../features/auth/resource-roles/resource-roles.seeder";
import { seedClients } from "../../features/business/clients/clients.seeder";
import { seedProductTypes } from "../../features/business/product-types/product-types.seeder";
import { seedProducts } from "../../features/business/products/products.seeder";
import { seedSales } from "../../features/business/sales/sales.seeder";
import { seedProductSales } from "../../features/business/product-sales/product-sales.seeder";
import { resolveSeedCounts } from "./counts";

dotenv.config();

/**
 * SeedersRunner — ejecuta los seeders de TODAS las tablas (features).
 *
 * Orden: seguridad (Fase II) → negocio (Fase I).
 *
 * ```text
 * Fase II  roles → resources → users → role_users → resource_roles
 * Fase I   clients → product_types → products → sales → product_sales
 * ```
 *
 * La seguridad va primero porque deja el sistema **operable de inmediato**: los
 * dos usuarios canónicos con sus roles y sus concesiones, es decir, con la matriz
 * RBAC completa. A partir de ahí, cualquier petición de negocio ya tiene sentido.
 *
 * Ejecutar seeders de todas las tablas:
 *   npm run db:seed
 *
 * Variar cantidades (CLI o env; claves = nombre de tabla):
 *   npm run db:seed -- --users=5 --clients=20 --products=15
 *   SEED_USERS=2 SEED_CLIENTS=5 npm run db:seed
 *
 * Defaults: ver `counts.ts`. Los seeders de catálogo (roles, resources, ...) son
 * deterministas y **reconciliadores**: reejecutarlos deja la matriz exacta.
 * Ubicación de cada seeder: `src/features/.../<plural>.seeder.ts`
 * Este archivo solo orquesta; no define datos.
 */
export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);

  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }

  const isMysql =
    sequelize.getDialect() === "mysql" || sequelize.getDialect() === "mariadb";
  if (isMysql) {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  }
  try {
    await sequelize.sync({ force: false, alter: true });
  } finally {
    if (isMysql) {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    }
  }

  // Fase II — Auth con RBAC (el orden respeta las dependencias de la cadena)
  await seedRoles();
  await seedResources();
  await seedUsers(counts.users);
  await seedRoleUsers();
  await seedResourceRoles();

  // Fase I — Business (padres → hijos)
  await seedClients(counts.clients);
  await seedProductTypes(counts.product_types);
  await seedProducts(counts.products);
  await seedSales(counts.sales);
  await seedProductSales(counts.product_sales);

  console.log("🌱 SeedersRunner finalizado");
}

if (require.main === module) {
  runAllSeeders()
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error en seeders:", err);
      await sequelize.close();
      process.exit(1);
    });
}
