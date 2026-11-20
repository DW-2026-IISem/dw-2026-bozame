#!/usr/bin/env bash
q() { docker exec -i entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express 2>/dev/null'; }
echo "SELECT email, COUNT(*) c FROM clients WHERE email IS NOT NULL GROUP BY email HAVING c > 1;" | q
echo "ALTER TABLE clients ADD UNIQUE INDEX uq_clients_email (email);" | q
cd ~/ia-lab/pry-sbarboza/app-entreganexo/backend-express && npm run db:seed >/dev/null 2>&1
echo "SELECT DISTINCT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'clients';" | q
