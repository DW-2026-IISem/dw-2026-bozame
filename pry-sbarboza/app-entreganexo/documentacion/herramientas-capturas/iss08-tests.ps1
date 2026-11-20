$S="C:\Users\sharo\AppData\Local\Temp\claude\41cd62183949314b\71109e37-3f68-47c4-b6ff-e469d45fbc45\scratchpad\shot.ps1"
$d="~/ia-lab/pry-sbarboza/app-entreganexo/backend-express"
$J="| python3 -m json.tool --no-ensure-ascii"
$U="http://localhost:3002/api/ventas"
$L="http://localhost:3002/api/detalle-ventas"
$W="curl -s -w '  -> %{http_code}\n'"
function Fill($c) { return $c.Trim().Replace("URL",$U).Replace("LIN",$L).Replace("JJ",$J).Replace("WW",$W) }
function Sql($q) {
  $t = @'
docker exec entreganexo-mysql sh -c 'mysql --default-character-set=utf8mb4 -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "QQ" 2>/dev/null'
'@
  return $t.Trim().Replace("QQ",$q)
}
$STOCK = Sql "SELECT id, name, price, quantity FROM products WHERE id IN (1,2,3);"

& $S -Dir $d -Cmd (Fill "curl -s URL JJ") -Name "iss08-20-get-all-vacio"
& $S -Dir $d -Cmd $STOCK -Name "iss08-21-stock-antes"

$c = @'
curl -s -X POST URL -H 'Content-Type: application/json' -d '{"client_id":1,"tax":19,"discounts":5,"items":[{"product_id":1,"quantity":2},{"product_id":2,"quantity":1}]}' JJ
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss08-22-create-venta"
& $S -Dir $d -Cmd $STOCK -Name "iss08-23-stock-despues"

$c = @'
curl -s -X POST URL -H 'Content-Type: application/json' -d '{"clientId":2,"tax":0,"discounts":0,"items":[{"productId":3,"quantity":1}]}' JJ
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss08-24-create-camelcase"

& $S -Dir $d -Cmd (Fill "curl -s URL/1 JJ") -Name "iss08-25-get-one-items"

$c = @'
WW -X POST URL -H 'Content-Type: application/json' -d '{"client_id":1,"items":[{"product_id":2,"quantity":1},{"product_id":1,"quantity":99999}]}'
'@
$c = (Fill $c) + "; " + (Sql "SELECT COUNT(*) AS ventas FROM sales; SELECT id, quantity FROM products WHERE id IN (1,2);")
& $S -Dir $d -Cmd $c -Name "iss08-26-stock-insuficiente"

$c = @'
WW -X POST URL -H 'Content-Type: application/json' -d '{"client_id":999,"items":[{"product_id":1,"quantity":1}]}'; WW -X POST URL -H 'Content-Type: application/json' -d '{"client_id":1,"items":[]}'
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss08-27-errores-create"

$c = @'
curl -s -X PATCH URL/1 -H 'Content-Type: application/json' -d '{"tax":15,"discounts":0}' JJ
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss08-28-patch-venta"

$c = @'
curl -s -X POST LIN -H 'Content-Type: application/json' -d '{"sale_id":1,"product_id":3,"quantity":2}' JJ
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss08-29-create-linea"
$TOT = Sql "SELECT id, subtotal, tax, discounts, total FROM sales WHERE id = 1; SELECT id, quantity FROM products WHERE id = 3;"
& $S -Dir $d -Cmd $TOT -Name "iss08-30-totales-linea"

$c = @'
curl -s -X PATCH LIN/4 -H 'Content-Type: application/json' -d '{"quantity":1}' JJ
'@
& $S -Dir $d -Cmd (Fill $c) -Name "iss08-31-patch-linea"
& $S -Dir $d -Cmd (Fill "curl -s -X PATCH LIN/4/deactivate JJ") -Name "iss08-32-deactivate-linea"
& $S -Dir $d -Cmd $TOT -Name "iss08-33-totales-tras-linea"

& $S -Dir $d -Cmd (Fill "curl -s LIN JJ") -Name "iss08-34-get-detalle"

& $S -Dir $d -Cmd (Fill "curl -s -X PATCH URL/2/deactivate JJ") -Name "iss08-35-delete-logico-venta"
$c = (Fill "WW URL/2") + "; " + (Sql "SELECT id, sale_id, product_id, quantity, status FROM product_sales WHERE sale_id = 2; SELECT id, quantity FROM products WHERE id = 3;")
& $S -Dir $d -Cmd $c -Name "iss08-36-venta-inactiva"

& $S -Dir $d -Cmd (Fill "curl -s -X DELETE URL/2 JJ") -Name "iss08-37-delete-fisico-venta"
& $S -Dir $d -Cmd (Fill "WW URL/999; WW URL/abc") -Name "iss08-38-errores-404-400"

& $S -Dir $d -Cmd (Sql "SELECT id, client_id, subtotal, tax, discounts, total, status FROM sales; SELECT id, sale_id, product_id, quantity, unit_price, line_total, status FROM product_sales;") -Name "iss08-39-tablas-mysql"

$c = @'
docker exec entreganexo-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (\"sales\", \"product_sales\") AND REFERENCED_TABLE_NAME IS NOT NULL;" 2>/dev/null'
'@
& $S -Dir $d -Cmd $c.Trim() -Name "iss08-40-fks"
