#!/usr/bin/env bash
# Uso: render-ansi.sh <entrada.ansi> <salida.png>
# Convierte la salida cruda de una terminal en SVG (estilo Windows Terminal "Ubuntu");
# el PNG final lo genera svg2png.ps1 con Edge.
set -uo pipefail
IN="$1"; OUT="$2"
HERE="$(dirname "$0")"
FREEZE="$HOME/.local/bin/freeze"
COLS="${TERM_COLS:-90}"
TMP=$(mktemp)
python3 -I "$HERE/wrapansi.py" "$COLS" < "$IN" > "$TMP"
"$FREEZE" --language ansi --background "#300A24" \
  --font.file /usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf --font.family "Ubuntu Mono" \
  --font.size 17 --line-height 1.1 \
  --border.radius 0 --padding "8,10" --margin 0 \
  --output "${OUT%.png}.svg" < "$TMP" >/dev/null
rm -f "$TMP"
