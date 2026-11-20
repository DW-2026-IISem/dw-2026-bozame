"""Copia los archivos del ISS-09 (shared/auth, shared/http y modelos de auth) y
parchea los imports de config/index.ts y database/seeders/index.ts."""
import os
import shutil

SRC = "/mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad/iss09-src"
DST = os.path.expanduser("~/ia-lab/pry-sbarboza/app-entreganexo/backend-express")

files = [
    "src/shared/auth/password.ts",
    "src/shared/auth/jwt.ts",
    "src/shared/auth/resource-match.ts",
    "src/shared/auth/auth-user.ts",
    "src/shared/http/error-response.ts",
    "src/shared/http/base-controller.ts",
    "src/shared/http/swagger-security.ts",
    "src/features/auth/users/user.model.ts",
    "src/features/auth/roles/role.model.ts",
    "src/features/auth/resources/resource.model.ts",
    "src/features/auth/role-users/role-user.model.ts",
    "src/features/auth/resource-roles/resource-role.model.ts",
    "src/features/auth/refresh-tokens/refresh-token.model.ts",
    "src/features/auth/rbac.associations.ts",
]
for rel in files:
    dst = os.path.join(DST, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copyfile(os.path.join(SRC, rel), dst)
    print("ok", rel)

AUTH_IMPORTS = (
    "// Fase II — Auth con RBAC: primero los seis modelos, después las asociaciones\n"
    "// (las asociaciones referencian los modelos, no al revés).\n"
    'import "PFX/auth/users/user.model";\n'
    'import "PFX/auth/roles/role.model";\n'
    'import "PFX/auth/resources/resource.model";\n'
    'import "PFX/auth/role-users/role-user.model";\n'
    'import "PFX/auth/resource-roles/resource-role.model";\n'
    'import "PFX/auth/refresh-tokens/refresh-token.model";\n'
    'import "PFX/auth/rbac.associations";\n'
)


def patch(path, anchor, prefix):
    p = os.path.join(DST, path)
    s = open(p, encoding="utf-8").read()
    if "auth/rbac.associations" in s:
        print("ya parcheado", path)
        return
    assert s.count(anchor) == 1, (path, anchor)
    s = s.replace(anchor, anchor + AUTH_IMPORTS.replace("PFX", prefix))
    open(p, "w", encoding="utf-8", newline="").write(s)
    print("parcheado", path)


patch("src/config/index.ts",
      'import "../features/business/product-sales/product-sales.associations";\n',
      "../features")
patch("src/database/seeders/index.ts",
      'import "../../features/business/product-sales/product-sales.associations";\n',
      "../../features")
