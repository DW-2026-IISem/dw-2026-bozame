/**
 * Catálogo de los **68 recursos** del sistema (fuente única).
 *
 * Un recurso es un par `(method, path)`; un permiso es la concesión de un
 * recurso a un rol. Este archivo es la definición en código del catálogo que
 * puebla el seeder de `resources` y del que se derivan las concesiones de los
 * roles (`ADMIN` recibe los 68; `SELLER`, los 7 marcados con `seller: true`).
 *
 * Composición (base: `docs/bd-storelab.md` §21 de la guía, con 10 recursos más de ventas):
 *
 * | Grupo                                        | Recursos |
 * |----------------------------------------------|---------:|
 * | Clientes                                     | 7 |
 * | Tipos de producto                            | 7 |
 * | Productos                                    | 7 |
 * | Ventas                                       | 7 |
 * | Detalle de ventas                            | 7 |
 * | Usuarios (+ cambio de contraseña + permisos) | 9 |
 * | Roles                                        | 7 |
 * | Recursos                                     | 7 |
 * | Asignaciones usuario-rol                     | 5 |
 * | Concesiones rol-recurso                      | 5 |
 * | **Total**                                    | **68** |
 *
 * Nota: las operaciones de sesión (`/api/auth/*`, `/api/permisos` y `/api/sesiones/*`) **no**
 * son recursos RBAC. Son las modalidades OPEN y JWT: no dependen de la matriz
 * de permisos, sino de poseer (o no) una identidad válida.
 */
export interface CatalogResource {
  method: string;
  path: string;
  description: string;
  /** `true` si el rol `SELLER` recibe esta concesión (7 en total). */
  seller?: boolean;
}

export const RESOURCE_CATALOG: readonly CatalogResource[] = [
  // ── Clientes (7) ──────────────────────────────────────────────
  { method: "GET", path: "/api/clientes", description: "Listar clientes", seller: true },
  { method: "GET", path: "/api/clientes/:id", description: "Consultar cliente", seller: true },
  { method: "POST", path: "/api/clientes", description: "Crear cliente" },
  { method: "PUT", path: "/api/clientes/:id", description: "Reemplazar cliente" },
  { method: "PATCH", path: "/api/clientes/:id", description: "Modificar cliente" },
  { method: "DELETE", path: "/api/clientes/:id", description: "Eliminar cliente" },
  { method: "PATCH", path: "/api/clientes/:id/deactivate", description: "Desactivar cliente" },

  // ── Tipos de producto (7) ─────────────────────────────────────
  { method: "GET", path: "/api/product-types", description: "Listar tipos de producto" },
  { method: "GET", path: "/api/product-types/:id", description: "Consultar tipo de producto" },
  { method: "POST", path: "/api/product-types", description: "Crear tipo de producto" },
  { method: "PUT", path: "/api/product-types/:id", description: "Reemplazar tipo de producto" },
  { method: "PATCH", path: "/api/product-types/:id", description: "Modificar tipo de producto" },
  { method: "DELETE", path: "/api/product-types/:id", description: "Eliminar tipo de producto" },
  {
    method: "PATCH",
    path: "/api/product-types/:id/deactivate",
    description: "Desactivar tipo de producto",
  },

  // ── Productos (7) ─────────────────────────────────────────────
  { method: "GET", path: "/api/productos", description: "Listar productos", seller: true },
  { method: "GET", path: "/api/productos/:id", description: "Consultar producto", seller: true },
  { method: "POST", path: "/api/productos", description: "Crear producto" },
  { method: "PUT", path: "/api/productos/:id", description: "Reemplazar producto" },
  { method: "PATCH", path: "/api/productos/:id", description: "Modificar producto" },
  { method: "DELETE", path: "/api/productos/:id", description: "Eliminar producto" },
  { method: "PATCH", path: "/api/productos/:id/deactivate", description: "Desactivar producto" },

  // ── Ventas (7) ────────────────────────────────────────────────
  // EntregaNexo: la guía solo cataloga 3; se añaden PUT/PATCH/DELETE/deactivate
  // porque el frontend edita, desactiva y elimina ventas (solo para ADMIN).
  { method: "GET", path: "/api/ventas", description: "Listar ventas", seller: true },
  { method: "GET", path: "/api/ventas/:id", description: "Consultar venta", seller: true },
  { method: "POST", path: "/api/ventas", description: "Registrar venta", seller: true },
  { method: "PUT", path: "/api/ventas/:id", description: "Reemplazar cabecera de venta" },
  { method: "PATCH", path: "/api/ventas/:id", description: "Modificar cabecera de venta" },
  { method: "DELETE", path: "/api/ventas/:id", description: "Eliminar venta" },
  { method: "PATCH", path: "/api/ventas/:id/deactivate", description: "Desactivar venta" },

  // ── Detalle de ventas (7) ─────────────────────────────────────
  // EntregaNexo: la guía solo cataloga el listado; se añaden el resto de
  // operaciones de /api/detalle-ventas (solo para ADMIN).
  { method: "GET", path: "/api/detalle-ventas", description: "Listar detalle de ventas" },
  { method: "GET", path: "/api/detalle-ventas/:id", description: "Consultar línea de venta" },
  { method: "POST", path: "/api/detalle-ventas", description: "Añadir línea a una venta" },
  { method: "PUT", path: "/api/detalle-ventas/:id", description: "Reemplazar cantidad de línea" },
  { method: "PATCH", path: "/api/detalle-ventas/:id", description: "Modificar línea de venta" },
  { method: "DELETE", path: "/api/detalle-ventas/:id", description: "Eliminar línea de venta" },
  {
    method: "PATCH",
    path: "/api/detalle-ventas/:id/deactivate",
    description: "Desactivar línea de venta",
  },

  // ── Usuarios (9) ──────────────────────────────────────────────
  { method: "GET", path: "/api/usuarios", description: "Listar usuarios" },
  { method: "GET", path: "/api/usuarios/:id", description: "Consultar usuario" },
  { method: "POST", path: "/api/usuarios", description: "Crear usuario" },
  { method: "PUT", path: "/api/usuarios/:id", description: "Reemplazar usuario" },
  { method: "PATCH", path: "/api/usuarios/:id", description: "Modificar usuario" },
  { method: "DELETE", path: "/api/usuarios/:id", description: "Eliminar usuario" },
  { method: "PATCH", path: "/api/usuarios/:id/deactivate", description: "Desactivar usuario" },
  {
    method: "PATCH",
    path: "/api/usuarios/:id/password",
    description: "Cambiar contraseña de usuario",
  },
  {
    method: "GET",
    path: "/api/usuarios/:id/permisos",
    description: "Consultar permisos efectivos del usuario",
  },

  // ── Roles (7) ─────────────────────────────────────────────────
  { method: "GET", path: "/api/roles", description: "Listar roles" },
  { method: "GET", path: "/api/roles/:id", description: "Consultar rol" },
  { method: "POST", path: "/api/roles", description: "Crear rol" },
  { method: "PUT", path: "/api/roles/:id", description: "Reemplazar rol" },
  { method: "PATCH", path: "/api/roles/:id", description: "Modificar rol" },
  { method: "DELETE", path: "/api/roles/:id", description: "Eliminar rol" },
  { method: "PATCH", path: "/api/roles/:id/deactivate", description: "Desactivar rol" },

  // ── Recursos (7) ──────────────────────────────────────────────
  { method: "GET", path: "/api/recursos", description: "Listar recursos" },
  { method: "GET", path: "/api/recursos/:id", description: "Consultar recurso" },
  { method: "POST", path: "/api/recursos", description: "Crear recurso" },
  { method: "PUT", path: "/api/recursos/:id", description: "Reemplazar recurso" },
  { method: "PATCH", path: "/api/recursos/:id", description: "Modificar recurso" },
  { method: "DELETE", path: "/api/recursos/:id", description: "Eliminar recurso" },
  { method: "PATCH", path: "/api/recursos/:id/deactivate", description: "Desactivar recurso" },

  // ── Asignaciones usuario ↔ rol (5) ────────────────────────────
  { method: "GET", path: "/api/asignaciones-rol", description: "Listar asignaciones usuario-rol" },
  {
    method: "GET",
    path: "/api/asignaciones-rol/:id",
    description: "Consultar asignación usuario-rol",
  },
  {
    method: "POST",
    path: "/api/asignaciones-rol",
    description: "Asignar rol a usuario",
  },
  {
    method: "PATCH",
    path: "/api/asignaciones-rol/:id/deactivate",
    description: "Retirar rol a usuario",
  },
  {
    method: "PATCH",
    path: "/api/asignaciones-rol/:id/reactivate",
    description: "Reactivar rol a usuario",
  },

  // ── Concesiones rol ↔ recurso (5) ─────────────────────────────
  { method: "GET", path: "/api/concesiones-rol", description: "Listar concesiones rol-recurso" },
  {
    method: "GET",
    path: "/api/concesiones-rol/:id",
    description: "Consultar concesión rol-recurso",
  },
  {
    method: "POST",
    path: "/api/concesiones-rol",
    description: "Conceder recurso a rol",
  },
  {
    method: "PATCH",
    path: "/api/concesiones-rol/:id/deactivate",
    description: "Retirar recurso a rol",
  },
  {
    method: "PATCH",
    path: "/api/concesiones-rol/:id/reactivate",
    description: "Reactivar recurso a rol",
  },
];

/** Recursos que recibe el rol `SELLER` (7). Derivado del catálogo, no duplicado. */
export const SELLER_RESOURCES: readonly CatalogResource[] = RESOURCE_CATALOG.filter(
  (resource) => resource.seller === true
);
