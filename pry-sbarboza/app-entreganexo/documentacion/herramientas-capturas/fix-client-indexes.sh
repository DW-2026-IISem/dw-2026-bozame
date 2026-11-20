#!/usr/bin/env bash
# Elimina los índices únicos duplicados de clients.email (email, email_2 ... email_N)
# que dejó el bug de sync({ alter: true }) con `unique: true` sin nombre.
# El SQL va por stdin para que ningún shell interprete comillas ni backticks.
q() { docker exec -i entreganexo-mysql sh -c 'mysql -N -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express 2>/dev/null'; }
IDX=$(echo "SELECT DISTINCT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'clients' AND (INDEX_NAME = 'email' OR INDEX_NAME REGEXP '^email_[0-9]+\$');" | q)
N=$(echo "$IDX" | grep -c .)
echo "índices duplicados encontrados: $N"
if [ "$N" -gt 0 ]; then
  SQL="ALTER TABLE clients $(echo "$IDX" | sed 's/.*/DROP INDEX `&`/' | paste -sd, -);"
  echo "$SQL" | q
fi
echo "índices restantes en clients:"
echo "SELECT DISTINCT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'clients';" | q
