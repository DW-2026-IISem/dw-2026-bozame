$S="C:\Users\sharo\AppData\Local\Temp\claude\41cd62183949314b\71109e37-3f68-47c4-b6ff-e469d45fbc45\scratchpad\shot.ps1"
$d="~/ia-lab/pry-sbarboza/app-entreganexo/backend-express"
$A="http://localhost:3002/api"
$H="-H 'Content-Type: application/json'"
function W($label) { return "-o /dev/null -w '$label -> %{http_code}\n'" }

& $S -Dir $d -Cmd "ls src/features/business/*" -Name "cierre1-01-features"
& $S -Dir $d -Cmd "npx tsc --noEmit && echo 'tsc OK: sin errores de tipos'" -Name "cierre1-02-tsc"

$q = @'
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "SELECT \"clients\" AS tabla, COUNT(*) AS filas FROM clients UNION ALL SELECT \"product_types\", COUNT(*) FROM product_types UNION ALL SELECT \"products\", COUNT(*) FROM products UNION ALL SELECT \"sales\", COUNT(*) FROM sales UNION ALL SELECT \"product_sales\", COUNT(*) FROM product_sales;" 2>/dev/null'
'@
& $S -Dir $d -Cmd $q.Trim() -Name "cierre1-03-tablas"

$c = "for r in clientes product-types productos ventas detalle-ventas; do curl -s -o /dev/null -w `"GET /api/`$r -> %{http_code}\n`" $A/`$r; done"
& $S -Dir $d -Cmd $c -Name "cierre1-04-get-todas"

$c = @(
  "curl -s -X POST $A/clientes $H -d '{`"name`":`"Cliente Cierre`",`"address`":`"Calle 1`",`"phone`":`"555-0101`",`"email`":`"cierre@example.com`",`"password`":`"Password123!`"}' $(W 'POST /api/clientes')",
  "curl -s -X POST $A/product-types $H -d '{`"name`":`"Cierre`",`"description`":`"Tipo de prueba`"}' $(W 'POST /api/product-types')",
  "curl -s -X POST $A/productos $H -d '{`"name`":`"Producto Cierre`",`"brand`":`"Lab`",`"price`":10,`"min_stock`":1,`"quantity`":20,`"product_type_id`":27}' $(W 'POST /api/productos')",
  "curl -s -X POST $A/ventas $H -d '{`"client_id`":6,`"items`":[{`"product_id`":16,`"quantity`":2}]}' $(W 'POST /api/ventas')",
  "curl -s -X POST $A/detalle-ventas $H -d '{`"sale_id`":6,`"product_id`":16,`"quantity`":1}' $(W 'POST /api/detalle-ventas')"
) -join "; "
& $S -Dir $d -Cmd $c -Name "cierre1-05-post-todas"

& $S -Dir $d -Cmd "curl -s $A/ventas/6 | python3 -m json.tool --no-ensure-ascii" -Name "cierre1-06-venta-cadena"

$c = @(
  "curl -s -X PATCH $A/clientes/6 $H -d '{`"phone`":`"555-0202`"}' $(W 'PATCH  /api/clientes/6')",
  "curl -s -X DELETE $A/ventas/6 $(W 'DELETE /api/ventas/6')",
  "curl -s -X DELETE $A/productos/16 $(W 'DELETE /api/productos/16')",
  "curl -s -X DELETE $A/product-types/27 $(W 'DELETE /api/product-types/27')",
  "curl -s -X DELETE $A/clientes/6 $(W 'DELETE /api/clientes/6')"
) -join "; "
& $S -Dir $d -Cmd $c -Name "cierre1-07-limpieza"

$c = @'
curl -s -o /dev/null -w 'GET /api/docs/ -> %{http_code}\n' http://localhost:3002/api/docs/; curl -s http://localhost:3002/api/docs.json | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d["info"]["title"], "-", len(d["paths"]), "rutas"); [print(" ", p) for p in d["paths"]]'
'@
& $S -Dir $d -Cmd $c.Trim() -Name "cierre1-08-docs"

& $S -Dir $d -Cmd $q.Trim() -Name "cierre1-09-tablas-final"
