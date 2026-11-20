import { normalizePath } from "../../../shared/auth/resource-match";

/**
 * **Modo laboratorio** (ISS-13 §18.7): con `AUTH_ENABLED=false` en el `.env`, las
 * cinco rutas de negocio vuelven a ser OPEN, como en la Fase I.
 *
 * No es un cuarto modo de acceso: es un interruptor explícito y reversible que
 * solo afecta a estos prefijos. Sesión, permisos y administración de seguridad
 * conservan su modalidad (OPEN / JWT / JWT + RBAC) aunque el interruptor esté en `false`.
 *
 * La lista es explícita a propósito: una ruta de negocio nueva no se abre por
 * accidente, y `/api/productos-falsos` no coincide con `/api/productos`.
 */
export const BUSINESS_PREFIXES = [
  "/api/clientes",
  "/api/product-types",
  "/api/productos",
  "/api/ventas",
  "/api/detalle-ventas",
] as const;

/** `true` salvo que el `.env` diga exactamente `AUTH_ENABLED=false`. */
export function isAuthEnabled(): boolean {
  return (process.env.AUTH_ENABLED ?? "true").trim().toLowerCase() !== "false";
}

/**
 * ¿Debe esta petición saltarse autenticación y autorización?
 * Solo si el modo laboratorio está activo **y** la ruta es de negocio.
 */
export function isLabBusinessRequest(url: string): boolean {
  if (isAuthEnabled()) {
    return false;
  }
  const path = normalizePath(url);
  return BUSINESS_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
