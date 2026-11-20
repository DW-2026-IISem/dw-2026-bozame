"""Copia los archivos del ISS-08 extraídos de la guía a backend-express, adaptando
Swagger a SIN AUTH (Fase I) y los .http al puerto 3002 sin login."""
import os
import re
import shutil

SRC = "/mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad/iss08-src"
DST = os.path.expanduser("~/ia-lab/pry-sbarboza/app-entreganexo/backend-express")

copy = []
for root, _, files in os.walk(os.path.join(SRC, "src/features")):
    for f in files:
        copy.append(os.path.relpath(os.path.join(root, f), SRC))
copy += ["src/database/seeders/counts.ts", "src/database/seeders/index.ts"]


def swagger_sin_auth(text: str) -> str:
    text = re.sub(r'import \{\n(?:  \w+,\n)+\} from "\.\./\.\./\.\./shared/http/swagger-security";\n\n', "", text)
    text = re.sub(r"\n *security: bearerSecurity,", "", text)
    text = re.sub(r'\n *"401": unauthorizedResponse,', "", text)
    text = re.sub(r'\n *"403": forbiddenResponse,', "", text)
    text = text.replace("**JWT + RBAC** (authenticate + authorize)", "**SIN AUTH**")
    text = text.replace("JWT + RBAC", "SIN AUTH")
    text = re.sub(
        r" \* Leyenda: todos los endpoints son \*\*SIN AUTH\*\* \(`authenticate` \+ `authorize`\)\.\n \* La modalidad se declara por operación: aquí heredan el `security` global del documento\.\n",
        " * Leyenda: en la Fase I todos los endpoints son **SIN AUTH**.\n",
        text,
    )
    return text


for rel in copy:
    src = os.path.join(SRC, rel)
    dst = os.path.join(DST, rel)
    if rel.endswith(".http"):
        continue  # los .http se escriben a mano (SIN AUTH, puerto 3002)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    text = open(src, encoding="utf-8").read()
    if rel.endswith(".swagger.ts"):
        text = swagger_sin_auth(text)
        assert "bearerSecurity" not in text and "Response," not in text, rel
    open(dst, "w", encoding="utf-8", newline="\n").write(text)
    print("ok", rel)
