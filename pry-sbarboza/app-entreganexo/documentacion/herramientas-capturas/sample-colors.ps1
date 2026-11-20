Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("\\wsl.localhost\Ubuntu\home\sharon\ia-lab\pry-sbarboza\app-entreganexo\documentacion\images\clipboard-1255704125.png")
# Regiones (x1,y1,x2,y2) en pixeles originales; se reporta el color no-fondo mas frecuente
$regions = [ordered]@{
  "prompt user@host" = @(10, 360, 260, 410)
  "prompt ruta"      = @(290, 360, 990, 410)
  "texto normal"     = @(1310, 490, 1520, 535)
  "nodemon amarillo" = @(10, 690, 310, 745)
  "nodemon starting" = @(10, 845, 820, 900)
  "tip gris"         = @(620, 880, 1650, 935)
  "ls carpeta azul"  = @(10, 300, 290, 345)
  "fondo"            = @(1500, 1150, 1700, 1190)
}
foreach ($k in $regions.Keys) {
  $r = $regions[$k]; $counts = @{}
  for ($x = $r[0]; $x -lt [Math]::Min($r[2], $img.Width); $x += 2) {
    for ($y = $r[1]; $y -lt [Math]::Min($r[3], $img.Height); $y += 2) {
      $c = $img.GetPixel($x, $y)
      $isBg = ([Math]::Abs($c.R - 0x30) + [Math]::Abs($c.G - 0x0A) + [Math]::Abs($c.B - 0x24)) -lt 40
      if ($k -eq "fondo" -or -not $isBg) {
        $hex = "#{0:X2}{1:X2}{2:X2}" -f $c.R, $c.G, $c.B
        $counts[$hex] = 1 + [int]$counts[$hex]
      }
    }
  }
  $top = $counts.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 3 | ForEach-Object { "$($_.Key)($($_.Value))" }
  "{0,-18} {1}" -f $k, ($top -join "  ")
}
"tamano: $($img.Width) x $($img.Height)"
$img.Dispose()
