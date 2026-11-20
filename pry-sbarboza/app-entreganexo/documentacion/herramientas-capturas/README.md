# Herramientas de capturas (copia de seguridad temporal)

Copia de los scripts con los que Claude genera las capturas de `proceso_express.md`.
**No subir a GitHub: borrar esta carpeta cuando ya no haga falta.**

Los originales están en la carpeta temporal de la sesión de Claude Code
(`C:\Users\sharo\AppData\Local\Temp\claude\...\scratchpad`). Si esa carpeta se borra,
estos archivos permiten reconstruirla: hay que cambiar la ruta `$scratchWin` / `$scratchWsl`
de `shot.ps1` (y de los demás scripts) por la nueva ubicación.

Piezas principales:

- `shot.ps1` → ejecuta un comando en una terminal virtual de WSL y produce el PNG en `documentacion/images/express/`.
- `term-shot.sh` → terminal virtual (`script`) con el prompt de Ubuntu; envía Ctrl+C real para `npm run dev`.
- `render-ansi.sh` + `wrapansi.py` → ajustan la salida a 90 columnas y la renderizan con `freeze` (`~/.local/bin/freeze`, fuente Ubuntu Mono).
- `svg2png.ps1` → convierte el SVG a PNG con Edge headless a resolución doble.
- `rerender.ps1` → vuelve a renderizar una captura desde su `.ansi`.
- `server.sh start|stop` → servidor de pruebas en segundo plano (puerto 3002).
- `extract-heredocs.py`, `prose.py`, `fixguide.py`, `guia-ok.txt` → extracción del código y del texto de la guía.

`make-env.sh` no se copió porque contiene contraseñas.
