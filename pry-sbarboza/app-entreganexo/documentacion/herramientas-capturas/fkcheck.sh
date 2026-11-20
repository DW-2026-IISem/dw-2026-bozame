#!/usr/bin/env bash
curl -s localhost:3002/api/productos; echo
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "SHOW CREATE TABLE products\G" 2>/dev/null'
