"""Instala el feature Users (ISS-10) adaptado a EntregaNexo:
- quita la consulta de permisos efectivos (depende de resource-roles, ISS-12);
- .http con puerto 3002 y /api/auth/login (ruta del frontend) en vez de /api/sesion;
- correos de los usuarios canónicos con dominio entreganexo.local;
- crea features/auth/access con `authenticate` (el del ISS-13) y un `authorize`
  provisional que deniega todo hasta que exista la matriz RBAC (ISS-12/13)."""
import os
import re
import shutil

SCR = "/mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad"
SRC = f"{SCR}/iss10-src/src/features/auth/users"
ACC = f"{SCR}/iss13-src/src/features/auth/access"
DST_ROOT = os.path.expanduser("~/ia-lab/pry-sbarboza/app-entreganexo/backend-express")
DST = f"{DST_ROOT}/src/features/auth/users"


def read(p):
    return open(p, encoding="utf-8").read()


def write(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", encoding="utf-8", newline="\n").write(s)
    print("ok", os.path.relpath(p, DST_ROOT))


def sub1(s, old, new, label):
    assert s.count(old) == 1, (label, old[:60], s.count(old))
    return s.replace(old, new)


# --- DTOs y repository: tal cual ---
for rel in ["dto/create-user.dto.ts", "dto/update-user.dto.ts", "dto/patch-user.dto.ts",
            "dto/change-password.dto.ts", "dto/user-response.dto.ts", "dto/index.ts",
            "users.repository.ts"]:
    write(f"{DST}/{rel}", read(f"{SRC}/{rel}"))

# --- service: sin permisos efectivos (vuelve en ISS-12) ---
s = read(f"{SRC}/users.service.ts")
s = sub1(s, 'import { ResourceRolesService } from "../resource-roles/resource-roles.service";\n'
            'import { EffectivePermissionDto } from "../resource-roles/dto";\n', "", "svc imports")
s = sub1(s, "  public constructor(\n"
            "    private readonly repository: UsersRepository = new UsersRepository(),\n"
            "    private readonly resourceRolesService: ResourceRolesService = new ResourceRolesService()\n"
            "  ) {}",
         "  public constructor(private readonly repository: UsersRepository = new UsersRepository()) {}",
         "svc ctor")
s = re.sub(r"\n(  /\*\*(?:(?!\*/).)*?\*/\n)?  public async getEffectivePermissions\(id: number\)[^\n]*\n.*?\n  }\n",
           "\n", s, count=1, flags=re.S)
assert "getEffectivePermissions" not in s and "resourceRolesService" not in s, "svc perms"
write(f"{DST}/users.service.ts", s)

# --- controller: sin getEffectivePermissions ---
c = read(f"{SRC}/users.controller.ts")
c = re.sub(r"\n  /\*\* Permisos efectivos del usuario[^\n]*\*/\n  public async getEffectivePermissions.*?\n  }\n",
           "\n", c, count=1, flags=re.S)
assert "getEffectivePermissions" not in c, "ctrl perms"
write(f"{DST}/users.controller.ts", c)

# --- routes: sin /permisos ---
r = read(f"{SRC}/users.routes.ts")
r = re.sub(r"\n\n    // permisos efectivos del usuario\n.*?\);\n", "\n", r, count=1, flags=re.S)
assert "permisos\")" not in r and "getEffectivePermissions" not in r, "routes perms"
write(f"{DST}/users.routes.ts", r)

# --- seeder: dominio de EntregaNexo ---
sd = read(f"{SRC}/users.seeder.ts").replace("@storelab.local", "@entreganexo.local")
write(f"{DST}/users.seeder.ts", sd)

# --- swagger: sin el path /permisos ---
sw = read(f"{SRC}/users.swagger.ts")
sw = re.sub(r'\n    "/api/usuarios/\{id\}/permisos": \{\n.*?\n    \},\n(?=  \},\n  components)', "\n", sw, count=1, flags=re.S)
assert "/permisos" not in sw.split("components")[0].split("paths")[1], "swagger perms"
sw = sw.replace(" + permisos efectivos", "")
write(f"{DST}/users.swagger.ts", sw)

# --- .http: puerto, login del frontend, dominio ---
for rel in ["http/users.get.http", "http/users.create.http"]:
    h = read(f"{SRC}/{rel}")
    h = h.replace("localhost:4000", "localhost:3002").replace("/api/sesion/login", "/api/auth/login")
    h = h.replace("@storelab.local", "@entreganexo.local")
    write(f"{DST}/{rel}", h)

# --- access: authenticate real + authorize provisional ---
write(f"{DST_ROOT}/src/features/auth/access/authenticate.middleware.ts", read(f"{ACC}/authenticate.middleware.ts"))
write(f"{DST_ROOT}/src/features/auth/access/index.ts", read(f"{ACC}/index.ts"))
write(f"{DST_ROOT}/src/features/auth/access/authorize.middleware.ts", '''import { NextFunction, Request, Response } from "express";
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
  next: NextFunction
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
  void next;
}
''')
