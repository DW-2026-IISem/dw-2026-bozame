param([Parameter(Mandatory)][string]$Name)
# Re-renderiza una captura desde su .ansi guardado (sin volver a ejecutar el comando)
$ErrorActionPreference = "Stop"
$scratchWin = "C:\Users\sharo\AppData\Local\Temp\claude\41cd62183949314b\71109e37-3f68-47c4-b6ff-e469d45fbc45\scratchpad"
$scratchWsl = "/mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad"
$destDir = "\\wsl.localhost\Ubuntu\home\sharon\ia-lab\pry-sbarboza\app-entreganexo\documentacion\images\express"
$work = Join-Path $scratchWin "shots"
wsl.exe -d Ubuntu -- bash "$scratchWsl/render-ansi.sh" "$scratchWsl/shots/$Name.ansi" "$scratchWsl/shots/$Name.png" | Out-Null
if (-not (Test-Path "$work\$Name.svg")) { throw "freeze no genero $Name.svg" }
& "$scratchWin\svg2png.ps1" -Svg "$work\$Name.svg" -Png "$work\$Name.png" | Out-Null
Copy-Item "$work\$Name.png" "$destDir\$Name.png" -Force
Remove-Item "$work\$Name.svg" -ErrorAction SilentlyContinue
"images/express/$Name.png"
