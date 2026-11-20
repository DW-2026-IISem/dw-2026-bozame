#!/usr/bin/env bash
# Añade las variables JWT al .env de backend-express (sin imprimir el secreto).
cd ~/ia-lab/pry-sbarboza/app-entreganexo/backend-express || exit 1
if grep -q '^JWT_SECRET=' .env; then echo "ya existe JWT_SECRET"; exit 0; fi
SECRET=$(openssl rand -base64 48 | tr -d '\n')
# asegurar salto de línea final antes de añadir
[ -n "$(tail -c1 .env)" ] && echo >> .env
cat >> .env <<EOF

# ─────────────────────────────────────────────────────────────
# Fase II — Seguridad (JWT + RBAC)
# ─────────────────────────────────────────────────────────────
# Secreto de firma del access token (HMAC SHA-256). Mínimo 32 caracteres.
# Generado con \`openssl rand -base64 48\`. NO versionarlo.
JWT_SECRET=$SECRET
# Vida útil del access token en segundos (900 = 15 min).
JWT_ACCESS_TTL=900
# Vida útil del refresh token en días.
JWT_REFRESH_TTL_DAYS=7
EOF
echo "variables añadidas"; grep -c '^JWT_' .env
git -C .. check-ignore -q backend-express/.env && echo ".env ignorado por git"
