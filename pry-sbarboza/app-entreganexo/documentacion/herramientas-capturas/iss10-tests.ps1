$S="C:\Users\sharo\AppData\Local\Temp\claude\41cd62183949314b\71109e37-3f68-47c4-b6ff-e469d45fbc45\scratchpad\shot.ps1"
$d="~/ia-lab/pry-sbarboza/app-entreganexo/backend-express"
$U="http://localhost:3002/api/usuarios"

& $S -Dir $d -Cmd "npm run db:seed" -Name "iss10-14-db-seed"

$c = @'
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "SELECT id, username, email, LEFT(password, 29) AS password_hash, status FROM users;" 2>/dev/null'
'@
& $S -Dir $d -Cmd $c.Trim() -Name "iss10-15-tabla-users"

$c = @'
curl -s -w '  -> %{http_code}\n' URL; curl -s -w '  -> %{http_code}\n' -H 'Authorization: Bearer token-inventado' URL
'@
& $S -Dir $d -Cmd $c.Trim().Replace("URL",$U) -Name "iss10-16-sin-token-401"

$c = @'
TOKEN=$(npx ts-node -e 'require("dotenv").config({ quiet: true }); const { signAccessToken } = require("./src/shared/auth/jwt"); console.log(signAccessToken({ id: 1, username: "admin" }).token)') && echo "token de admin: ${TOKEN:0:40}..." && curl -s -w '  -> %{http_code}\n' -H "Authorization: Bearer $TOKEN" URL
'@
& $S -Dir $d -Cmd $c.Trim().Replace("URL",$U) -Name "iss10-17-token-valido-403"

$c = @'
TOKEN=$(npx ts-node -e 'require("dotenv").config({ quiet: true }); const { signAccessToken } = require("./src/shared/auth/jwt"); console.log(signAccessToken({ id: 999, username: "fantasma" }).token)') && curl -s -w '  -> %{http_code}\n' -H "Authorization: Bearer $TOKEN" URL
'@
& $S -Dir $d -Cmd $c.Trim().Replace("URL",$U) -Name "iss10-18-usuario-inexistente-401"

& $S -Dir $d -Cmd "for r in clientes product-types productos ventas detalle-ventas; do curl -s -o /dev/null -w `"GET /api/`$r -> %{http_code}\n`" http://localhost:3002/api/`$r; done" -Name "iss10-19-business-sin-auth"
