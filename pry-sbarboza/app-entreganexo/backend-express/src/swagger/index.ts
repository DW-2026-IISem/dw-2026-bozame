import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { clientsSwagger } from "../features/business/clients/clients.swagger";
import { productTypesSwagger } from "../features/business/product-types/product-types.swagger";
import { productsSwagger } from "../features/business/products/products.swagger";
import { salesSwagger } from "../features/business/sales/sales.swagger";
import { productSalesSwagger } from "../features/business/product-sales/product-sales.swagger";
import { sessionSwagger } from "../features/auth/session/session.swagger";
import { refreshTokensSwagger } from "../features/auth/refresh-tokens/refresh-tokens.swagger";
import { usersSwagger } from "../features/auth/users/users.swagger";
import { rolesSwagger } from "../features/auth/roles/roles.swagger";
import { resourcesSwagger } from "../features/auth/resources/resources.swagger";
import { roleUsersSwagger } from "../features/auth/role-users/role-users.swagger";
import { resourceRolesSwagger } from "../features/auth/resource-roles/resource-roles.swagger";
import {
  bearerSecurityScheme,
  forbiddenResponse,
  unauthorizedResponse,
} from "../shared/http/swagger-security";

export type FeatureSwaggerModule = {
  tags: unknown[];
  paths: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

/**
 * Registry externo: importa la documentación OpenAPI de cada feature
 * (mismo patrón que SeedersRunner).
 */
const featureSwaggerModules: FeatureSwaggerModule[] = [
  sessionSwagger,
  refreshTokensSwagger,
  usersSwagger,
  rolesSwagger,
  resourcesSwagger,
  roleUsersSwagger,
  resourceRolesSwagger,
  clientsSwagger,
  productTypesSwagger,
  productsSwagger,
  salesSwagger,
  productSalesSwagger,
];

export function buildOpenApiDocument() {
  const tags: unknown[] = [];
  const paths: Record<string, unknown> = {};
  const schemas: Record<string, unknown> = {};

  for (const mod of featureSwaggerModules) {
    tags.push(...mod.tags);
    Object.assign(paths, mod.paths);
    if (mod.components?.schemas) {
      Object.assign(schemas, mod.components.schemas);
    }
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "EntregaNexo API",
      version: "1.0.0",
      description:
        "API EntregaNexo (Express + Sequelize). Desde el ISS-13 todas las rutas son **JWT + RBAC** salvo las de sesión; pulsa **Authorize** con `Bearer <access_token>`.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: "Local",
      },
    ],
    tags,
    paths,
    // Seguro por defecto: toda operación que no declare su propio `security` exige
    // el access token. Las operaciones OPEN (login, refresh, logout) lo anulan con `security: []`.
    security: [{ bearerAuth: [] }],
    components: {
      // Esquema `bearerAuth` (Authorization: Bearer <access_token>): activa el botón
      // Authorize de Swagger UI.
      securitySchemes: bearerSecurityScheme,
      responses: {
        Unauthorized: unauthorizedResponse,
        Forbidden: forbiddenResponse,
      },
      schemas,
    },
  };
}

/** Monta Swagger UI y el JSON OpenAPI */
export function setupSwagger(app: Application): void {
  const document = buildOpenApiDocument();
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api/docs.json", (_req, res) => {
    res.json(document);
  });
  console.log("📚 Swagger UI: /api/docs  |  OpenAPI JSON: /api/docs.json");
}
