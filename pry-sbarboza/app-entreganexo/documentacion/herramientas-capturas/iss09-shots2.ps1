$S="C:\Users\sharo\AppData\Local\Temp\claude\41cd62183949314b\71109e37-3f68-47c4-b6ff-e469d45fbc45\scratchpad\shot.ps1"
$d="~/ia-lab/pry-sbarboza/app-entreganexo/backend-express"

$c = @'
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "SELECT TABLE_NAME, GROUP_CONCAT(DISTINCT INDEX_NAME ORDER BY INDEX_NAME) AS indices FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() GROUP BY TABLE_NAME;" 2>/dev/null'
'@
& $S -Dir $d -Cmd $c.Trim() -Name "iss09-18-tablas-indices"

& $S -Dir $d -Cmd "grep -n -A 9 'email: {' src/features/business/clients/client.model.ts" -Name "iss09-20-fix-client-email"
