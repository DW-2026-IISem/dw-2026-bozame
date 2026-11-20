import { ClientsRoutes } from "../features/business/clients/clients.routes";
import { ProductTypesRoutes } from "../features/business/product-types/product-types.routes";
import { ProductsRoutes } from "../features/business/products/products.routes";
import { SalesRoutes } from "../features/business/sales/sales.routes";
import { ProductSalesRoutes } from "../features/business/product-sales/product-sales.routes";
import { SessionRoutes } from "../features/auth/session/session.routes";
import { RefreshTokensRoutes } from "../features/auth/refresh-tokens/refresh-tokens.routes";
import { UsersRoutes } from "../features/auth/users/users.routes";
import { RolesRoutes } from "../features/auth/roles/roles.routes";
import { ResourcesRoutes } from "../features/auth/resources/resources.routes";
import { RoleUsersRoutes } from "../features/auth/role-users/role-users.routes";
import { ResourceRolesRoutes } from "../features/auth/resource-roles/resource-roles.routes";

/**
 * Registro de features. Cada feature expone sus propias rutas y decide su
 * **modalidad de acceso** (OPEN, JWT o JWT + RBAC) middleware a middleware.
 *
 * Fase I  — Business: 5 features (JWT + RBAC).
 * Fase II — Auth: 7 features: sesión (OPEN/JWT), sesiones propias (JWT),
 *           usuarios, roles, recursos, asignaciones y concesiones (JWT + RBAC).
 */
export class Routes {
  // Fase I — Business
  public clientsRoutes: ClientsRoutes = new ClientsRoutes();
  public productTypesRoutes: ProductTypesRoutes = new ProductTypesRoutes();
  public productsRoutes: ProductsRoutes = new ProductsRoutes();
  public salesRoutes: SalesRoutes = new SalesRoutes();
  public productSalesRoutes: ProductSalesRoutes = new ProductSalesRoutes();

  // Fase II — Auth con RBAC
  public sessionRoutes: SessionRoutes = new SessionRoutes();
  public refreshTokensRoutes: RefreshTokensRoutes = new RefreshTokensRoutes();
  public usersRoutes: UsersRoutes = new UsersRoutes();
  public rolesRoutes: RolesRoutes = new RolesRoutes();
  public resourcesRoutes: ResourcesRoutes = new ResourcesRoutes();
  public roleUsersRoutes: RoleUsersRoutes = new RoleUsersRoutes();
  public resourceRolesRoutes: ResourceRolesRoutes = new ResourceRolesRoutes();
}
