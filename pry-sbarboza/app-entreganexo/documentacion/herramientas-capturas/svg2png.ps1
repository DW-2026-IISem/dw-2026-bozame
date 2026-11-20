param([Parameter(Mandatory)][string]$Svg, [Parameter(Mandatory)][string]$Png)
# Convierte un SVG de freeze a PNG usando Edge headless (respeta la fuente incrustada).
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$xml = [xml](Get-Content -Raw -Encoding UTF8 $Svg)
$w = [math]::Ceiling([double]($xml.svg.width -replace '[^\d.]', ''))
$h = [math]::Ceiling([double]($xml.svg.height -replace '[^\d.]', ''))
$html = Join-Path ([IO.Path]::GetDirectoryName($Svg)) (([IO.Path]::GetFileNameWithoutExtension($Svg)) + ".html")
$svgText = Get-Content -Raw -Encoding UTF8 $Svg
@"
<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head>
<body>$svgText</body></html>
"@ | Set-Content -Encoding UTF8 $html
$profileDir = Join-Path $env:TEMP "edge-headless-shot"
$ErrorActionPreference = "Continue"   # Edge escribe su aviso en stderr; no es un error
& $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 `
  --user-data-dir="$profileDir" --window-size="$w,$h" --screenshot="$Png" ("file:///" + ($html -replace '\\', '/')) 2>$null | Out-Null
Remove-Item $html -ErrorAction SilentlyContinue
if (Test-Path $Png) { "OK $Png (${w}x${h})" } else { "FALLO $Png" }
