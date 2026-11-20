#!/usr/bin/env bash
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "TRUNCATE TABLE products; SELECT COUNT(*) AS filas FROM products;" 2>/dev/null'
