$S="C:\Users\sharo\AppData\Local\Temp\claude\41cd62183949314b\71109e37-3f68-47c4-b6ff-e469d45fbc45\scratchpad\shot.ps1"
$d="~/ia-lab/pry-sbarboza/app-entreganexo/backend-express"
$J="| python3 -m json.tool --no-ensure-ascii"
$U="http://localhost:3002/api/productos"
$T="http://localhost:3002/api/product-types"
function Fill($c) { return $c.Trim().Replace("URL",$U).Replace("TYP",$T).Replace("JJ",$J) }

& $S -Dir $d -Cmd ("curl -s $U " + $J) -Name "iss07-12-get-all-vacio"

$c = @'
curl -s -X POST URL -H 'Content-Type: application/json' -d '{"name":"Laptop Pro","brand":"TechBrand","price":1299.99,"min_stock":5,"quantity":50,"product_type_id":1,"status":"active"}' JJ
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss07-13-create-laptop"

$c = @'
curl -s -X POST URL -H 'Content-Type: application/json' -d '{"name":"Mouse Inalámbrico","brand":"TechBrand","price":25.5,"minStock":10,"quantity":80,"productTypeId":1}' JJ
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss07-14-create-camelcase"

& $S -Dir $d -Cmd ("curl -s $U " + $J) -Name "iss07-15-get-all"

$c = @'
curl -s -X PUT URL/1 -H 'Content-Type: application/json' -d '{"name":"Laptop Pro Max","brand":"TechBrand","price":1499.99,"min_stock":5,"quantity":40,"product_type_id":1,"status":"inactive"}' JJ
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss07-16-put"

$c = @'
curl -s -X PATCH URL/1 -H 'Content-Type: application/json' -d '{"price":1399.99,"quantity":45}' JJ
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss07-17-patch"

$c = @'
curl -s -w '  -> %{http_code}\n' -X POST URL -H 'Content-Type: application/json' -d '{"name":"Producto huérfano","brand":"Sin marca","price":10,"min_stock":1,"quantity":5,"product_type_id":9999}'
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss07-18-tipo-inexistente"

$c = @'
curl -s -X POST TYP -H 'Content-Type: application/json' -d '{"name":"Descontinuados","description":"Tipo fuera de catálogo"}' JJ; curl -s -X PATCH TYP/26/deactivate JJ
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss07-19-tipo-inactivo"

$c = @'
curl -s -w '  -> %{http_code}\n' -X PATCH URL/2 -H 'Content-Type: application/json' -d '{"product_type_id":26}'
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss07-20-tipo-inactivo-400"

$c = "curl -s -w '  -> %{http_code}\n' $U/999; curl -s -w '  -> %{http_code}\n' $U/abc"
& $S -Dir $d -Cmd $c -Name "iss07-21-errores-404-400"

& $S -Dir $d -Cmd ("curl -s -X PATCH $U/2/deactivate " + $J) -Name "iss07-22-delete-logico"

$c = "curl -s -w '  -> %{http_code}\n' $U/2; curl -s $U " + $J
& $S -Dir $d -Cmd $c -Name "iss07-23-inactivo-oculto"

& $S -Dir $d -Cmd ("curl -s -X DELETE $U/2 " + $J) -Name "iss07-24-delete-fisico"

$c = @'
docker exec entreganexo-mysql sh -c 'mysql --default-character-set=utf8mb4 -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "SELECT p.id, p.name, p.price, p.quantity, p.product_type_id, t.name AS tipo, p.status FROM products p JOIN product_types t ON t.id = p.product_type_id;" 2>/dev/null'
'@
& $S -Dir $d -Cmd $c.Trim() -Name "iss07-25-tabla-products"

$c = @'
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = \"products\" AND REFERENCED_TABLE_NAME IS NOT NULL;" 2>/dev/null'
'@
& $S -Dir $d -Cmd $c.Trim() -Name "iss07-26-fk"
