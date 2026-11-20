#!/usr/bin/env bash
# Genera dos ejemplos de captura de consola con freeze (solo lectura sobre el proyecto).
set -euo pipefail
OUT=/mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad
PROJ=/home/sharon/ia-lab/pry-sbarboza/app-entreganexo/backend-full
FREEZE="$HOME/.local/bin/freeze"
FONT=/usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf
CMD="cat tsconfig.json"

# Salida real: prompt estilo Ubuntu + resultado del comando (con colores ANSI)
cd "$PROJ"
{
  printf '\033[1;32m%s@%s\033[0m:\033[1;34m%s\033[0m$ %s\n' "$USER" "$(hostname)" "~/ia-lab/pry-sbarboza/app-entreganexo/backend-full" "$CMD"
  bash -c "$CMD"
} > /tmp/fz-out.ansi 2>&1

# A) Estilo por defecto de freeze
"$FREEZE" --language ansi --window --border.radius 8 --padding 20 --margin 20 \
  --output "$OUT/ejemplo-A-freeze-default.png" < /tmp/fz-out.ansi

# B) Imitando la terminal de Ubuntu (fondo morado, Ubuntu Mono, sin bordes)
"$FREEZE" --language ansi --background "#300A24" --font.file "$FONT" --font.size 16 --line-height 1.25 \
  --border.radius 0 --padding 16 --margin 0 \
  --output "$OUT/ejemplo-B-ubuntu.png" < /tmp/fz-out.ansi

ls -la "$OUT"/ejemplo-*.png
