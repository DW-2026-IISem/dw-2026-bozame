#!/usr/bin/env bash
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "TRUNCATE TABLE product_types; SELECT COUNT(*) AS filas FROM product_types;" 2>/dev/null'
