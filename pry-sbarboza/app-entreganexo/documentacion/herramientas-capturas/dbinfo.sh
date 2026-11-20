#!/usr/bin/env bash
cd ~/ia-lab/pry-sbarboza/app-entreganexo
echo "--- backend-full/.env (sin contraseñas)"
grep -E '^(DB_DIALECT|DB_MYSQL_HOST|DB_MYSQL_PORT|DB_MYSQL_USERNAME|DB_MYSQL_NAME|PORT)=' backend-full/.env
echo "--- .env de docker (sin contraseñas)"
grep -E '^(MYSQL_DATABASE|POSTGRES_USER|POSTGRES_DB)=' .env
echo "--- bases de datos y tablas"
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "SHOW DATABASES; SELECT table_schema, COUNT(*) tablas FROM information_schema.tables WHERE table_schema NOT IN (\"mysql\",\"sys\",\"performance_schema\",\"information_schema\") GROUP BY table_schema;" 2>/dev/null'
