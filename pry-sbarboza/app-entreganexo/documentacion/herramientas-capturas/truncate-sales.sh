#!/usr/bin/env bash
curl -s -X DELETE http://localhost:3002/api/ventas/1; echo
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "SET FOREIGN_KEY_CHECKS = 0; TRUNCATE TABLE product_sales; TRUNCATE TABLE sales; SET FOREIGN_KEY_CHECKS = 1; SELECT COUNT(*) AS ventas FROM sales; SELECT id, quantity FROM products WHERE id IN (1,2,3);" 2>/dev/null'
