#!/usr/bin/env bash
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "ANALYZE TABLE clients, product_types, products, sales, product_sales; SELECT TABLE_NAME, AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE();" 2>/dev/null' | grep -v analyze
grep -n "name\|address\|phone\|email\|password" ~/ia-lab/pry-sbarboza/app-entreganexo/backend-express/src/features/business/clients/dto/create-client.dto.ts
