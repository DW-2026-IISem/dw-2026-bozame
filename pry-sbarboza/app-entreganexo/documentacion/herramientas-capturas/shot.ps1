param(
  [Parameter(Mandatory)][string]$Dir,   # directorio en WSL donde se ejecuta (ej: ~/ia-lab/...)
  [Parameter(Mandatory)][string]$Cmd,   # comando real a ejecutar
  [Parameter(Mandatory)][string]$Name,  # nombre del png (sin extension)
  [int]$StopAfter = 0                   # >0: corta el comando a los N segundos (como Ctrl+C)
)
# Genera una captura de consola estilo Ubuntu y la deja en documentacion/images/express/
$ErrorActionPreference = "Stop"
$scratchWin = "C:\Users\sharo\AppData\Local\Temp\claude\41cd62183949314b\71109e37-3f68-47c4-b6ff-e469d45fbc45\scratchpad"
$scratchWsl = "/mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad"
$destDir = "\\wsl.localhost\Ubuntu\home\sharon\ia-lab\pry-sbarboza\app-entreganexo\documentacion\images\express"
$work = Join-Path $scratchWin "shots"
New-Item -ItemType Directory -Force $work, $destDir | Out-Null
$wslDir = $Dir -replace '^~', '/home/sharon'
[IO.File]::WriteAllText("$work\$Name.cmd.txt", $Cmd, (New-Object Text.UTF8Encoding $false))
$stopArg = if ($StopAfter -gt 0) { "$StopAfter" } else { "" }
wsl.exe -d Ubuntu -- bash "$scratchWsl/term-shot.sh" ubuntu "$wslDir" "@$scratchWsl/shots/$Name.cmd.txt" "$scratchWsl/shots/$Name.png" $stopArg | Out-Null
if (-not (Test-Path "$work\$Name.svg")) { throw "freeze no genero $Name.svg" }
& "$scratchWin\svg2png.ps1" -Svg "$work\$Name.svg" -Png "$work\$Name.png" | Out-Null
Copy-Item "$work\$Name.png" "$destDir\$Name.png" -Force
Remove-Item "$work\$Name.svg", "$work\$Name.cmd.txt" -ErrorAction SilentlyContinue
"images/express/$Name.png"
