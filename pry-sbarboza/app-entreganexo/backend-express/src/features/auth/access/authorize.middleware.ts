import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/app-error";
import { sendError } from "../../../shared/http/error-response";

/**
 * **MODALIDAD 3 — RBAC.** Versión PROVISIONAL (ISS-10).
 *
 * La matriz de permisos (`roles`, `resources`, `role_users`, `resource_roles`)
 * todavía no tiene features ni datos: llegan en los ISS-11 y ISS-12. Mientras
 * tanto, este middleware aplica **deny by default** en su forma más estricta:
 *
 *  - **401** si no hay identidad (no pasó por `authenticate`);
 *  - **403** para cualquier identidad válida, porque aún no existe ninguna concesión.
 *
 * En el ISS-13 se reemplaza por la versión definitiva, que consulta la cadena
 * `role_users → roles → resource_roles → resources` del usuario.
 */
export async function authorize(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  try {
    if (!req.auth) {
      throw new AppError(401, "Authentication required");
    }
    const method = req.method.toUpperCase();
    throw new AppError(403, `Forbidden: no grant for ${method} ${req.originalUrl}`);
  } catch (error) {
    sendError(res, error);
  }
}
