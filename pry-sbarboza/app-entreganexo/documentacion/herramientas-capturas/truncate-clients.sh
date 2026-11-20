#!/usr/bin/env bash
# Vacía la tabla de pruebas clients de la base entreganexo_express (no toca la base entreganexo)
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "TRUNCATE TABLE clients; SELECT COUNT(*) AS filas FROM clients;" 2>/dev/null'
