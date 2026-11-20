#!/usr/bin/env bash
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "SELECT id, name, status FROM clients; SELECT id, name, price, quantity, status FROM products WHERE id <= 4; SHOW TABLES;" 2>/dev/null'
