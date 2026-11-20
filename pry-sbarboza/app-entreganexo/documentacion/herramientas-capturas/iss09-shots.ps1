$S="C:\Users\sharo\AppData\Local\Temp\claude\41cd62183949314b\71109e37-3f68-47c4-b6ff-e469d45fbc45\scratchpad\shot.ps1"
$d="~/ia-lab/pry-sbarboza/app-entreganexo/backend-express"
$SA="src/shared/auth"
$SH="src/shared/http"
$FA="src/features/auth"

$c = @'
grep -A 12 'Fase II' .env | sed 's/^\(JWT_SECRET=\).*/\1********************/'
'@
& $S -Dir $d -Cmd $c.Trim() -Name "iss09-03-env-jwt"
& $S -Dir $d -Cmd "cat $SA/password.ts" -Name "iss09-04-cat-password"
& $S -Dir $d -Cmd "cat $SA/jwt.ts" -Name "iss09-05-cat-jwt"
& $S -Dir $d -Cmd "cat $SA/resource-match.ts" -Name "iss09-06-cat-resource-match"
& $S -Dir $d -Cmd "cat $SA/auth-user.ts" -Name "iss09-07-cat-auth-user"
& $S -Dir $d -Cmd "tail -n +1 $SH/error-response.ts $SH/base-controller.ts" -Name "iss09-08-cat-error-response"
& $S -Dir $d -Cmd "cat $SH/swagger-security.ts" -Name "iss09-09-cat-swagger-security"
& $S -Dir $d -Cmd "cat $FA/users/user.model.ts" -Name "iss09-10-cat-user-model"
& $S -Dir $d -Cmd "tail -n +1 $FA/roles/role.model.ts $FA/role-users/role-user.model.ts" -Name "iss09-11-cat-role-models"
& $S -Dir $d -Cmd "tail -n +1 $FA/resources/resource.model.ts $FA/resource-roles/resource-role.model.ts" -Name "iss09-12-cat-resource-models"
& $S -Dir $d -Cmd "cat $FA/refresh-tokens/refresh-token.model.ts" -Name "iss09-13-cat-refresh-token-model"
& $S -Dir $d -Cmd "cat $FA/rbac.associations.ts" -Name "iss09-14-cat-rbac-associations"
& $S -Dir $d -Cmd "grep -n 'features/auth' src/config/index.ts src/database/seeders/index.ts" -Name "iss09-15-cableado"
& $S -Dir $d -Cmd "npx tsc --noEmit && echo 'tsc OK: sin errores de tipos'" -Name "iss09-16-tsc"
& $S -Dir $d -Cmd "npm run db:seed" -Name "iss09-17-db-seed"

$c = @'
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "SHOW TABLES; SELECT TABLE_NAME, CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND CONSTRAINT_TYPE = \"UNIQUE\" ORDER BY TABLE_NAME;" 2>/dev/null'
'@
& $S -Dir $d -Cmd $c.Trim() -Name "iss09-18-tablas-uk"

$c = @'
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (\"role_users\", \"resource_roles\", \"refresh_tokens\") AND REFERENCED_TABLE_NAME IS NOT NULL ORDER BY TABLE_NAME;" 2>/dev/null'
'@
& $S -Dir $d -Cmd $c.Trim() -Name "iss09-19-fks-auth"
