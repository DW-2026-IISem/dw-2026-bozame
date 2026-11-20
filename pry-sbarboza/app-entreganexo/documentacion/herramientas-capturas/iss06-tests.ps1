$S="C:\Users\sharo\AppData\Local\Temp\claude\41cd62183949314b\71109e37-3f68-47c4-b6ff-e469d45fbc45\scratchpad\shot.ps1"
$d="~/ia-lab/pry-sbarboza/app-entreganexo/backend-express"
$J=" | python3 -m json.tool --no-ensure-ascii"
$U="http://localhost:3002/api/product-types"

& $S -Dir $d -Cmd ("curl -s $U" + $J) -Name "iss06-10-get-all-vacio"

$c1 = @'
curl -s -X POST URL -H 'Content-Type: application/json' -d '{"name":"Electrónica","description":"Dispositivos y accesorios","status":"active"}' JJ
'@
& $S -Dir $d -Cmd $c1.Trim().Replace("URL",$U).Replace("JJ",$J.Trim()) -Name "iss06-11-create-electronica"

$c2 = @'
curl -s -X POST URL -H 'Content-Type: application/json' -d '{"name":"Bebidas","description":"Refrescos y jugos"}' JJ
'@
& $S -Dir $d -Cmd $c2.Trim().Replace("URL",$U).Replace("JJ",$J.Trim()) -Name "iss06-12-create-bebidas"

& $S -Dir $d -Cmd ("curl -s $U" + $J) -Name "iss06-13-get-all"

$c3 = @'
curl -s -X PUT URL/1 -H 'Content-Type: application/json' -d '{"name":"Electrónica Actualizada","description":"Categoría renovada","status":"inactive"}' JJ
'@
& $S -Dir $d -Cmd $c3.Trim().Replace("URL",$U).Replace("JJ",$J.Trim()) -Name "iss06-14-put"

$c4 = @'
curl -s -X PATCH URL/1 -H 'Content-Type: application/json' -d '{"description":"Descripción parcial"}' JJ
'@
& $S -Dir $d -Cmd $c4.Trim().Replace("URL",$U).Replace("JJ",$J.Trim()) -Name "iss06-15-patch"

$c5 = "curl -s -w '  -> %{http_code}\n' $U/999; curl -s -w '  -> %{http_code}\n' $U/abc"
& $S -Dir $d -Cmd $c5 -Name "iss06-16-errores-404-400"

& $S -Dir $d -Cmd ("curl -s -X PATCH $U/2/deactivate" + $J) -Name "iss06-17-delete-logico"

$c6 = "curl -s -w '  -> %{http_code}\n' $U/2; curl -s $U" + $J
& $S -Dir $d -Cmd $c6 -Name "iss06-18-inactivo-oculto"

& $S -Dir $d -Cmd ("curl -s -X DELETE $U/2" + $J) -Name "iss06-19-delete-fisico"

$c7 = @'
docker exec entreganexo-mysql sh -c 'mysql --default-character-set=utf8mb4 -uroot -p"$MYSQL_ROOT_PASSWORD" entreganexo_express -e "SELECT id, name, description, status FROM product_types;" 2>/dev/null'
'@
& $S -Dir $d -Cmd $c7.Trim() -Name "iss06-20-tabla-product-types"
