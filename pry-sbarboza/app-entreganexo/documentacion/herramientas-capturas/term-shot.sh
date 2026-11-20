#!/usr/bin/env bash
# Uso: term-shot.sh <estilo> <directorio> <comando|@archivo> <salida.png> [segundos_servidor]
# Ejecuta el comando DE VERDAD en <directorio> y renderiza: prompt + comando + salida real.
#  - Sin [segundos]: al final aparece el prompt con el cursor (comando terminado).
#  - Con [segundos]: el comando (un servidor) se captura mientras corre; al final solo el cursor.
# Guarda además la salida cruda en <salida>.ansi para poder re-renderizar sin re-ejecutar.
set -uo pipefail
STYLE="$1"; DIR="$2"; CMD="$3"; OUT="$4"; STOP_AFTER="${5:-}"
if [[ "$CMD" == @* ]]; then CMD="$(cat "${CMD#@}")"; fi
HERE="$(dirname "$0")"

# Prompt idéntico al PS1 por defecto de Ubuntu: \[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$
prompt() { local d="${1/#$HOME/\~}"; printf '\033[01;32m%s@%s\033[00m:\033[01;34m%s\033[00m$ ' "$USER" "$(hostname)" "$d"; }

RAW="${OUT%.png}.ansi"; PWDF=$(mktemp); RUNF=$(mktemp)
# El comando corre dentro de una terminal virtual (script) de 90x50: ls, npm, dotenv, etc.
# se comportan igual que en una terminal real (columnas, colores, texto tenue).
printf 'stty cols %s rows 50 2>/dev/null\nshopt -s expand_aliases\nalias ls="ls --color=auto"; alias grep="grep --color=auto"\neval "$(dircolors -b)"\ncd %q || exit 1\n%s\n__rc=$?\npwd > %q\nexit $__rc\n' \
  "${TERM_COLS:-90}" "$DIR" "$CMD" "$PWDF" > "$RUNF"
echo "$DIR" > "$PWDF"
run_tty() { TERM=xterm-256color script -qefc "bash $RUNF" /dev/null < /dev/null; }
{
  prompt "$DIR"; printf '%s\n' "$CMD"
  if [[ -n "$STOP_AFTER" ]]; then
    # Servidor: se toma la "foto" mientras corre (se descarta lo que imprime al detenerlo)
    # Igual que en una terminal real al pulsar Ctrl+C: la terminal escribe "^C" y nodemon
    # responde en la misma línea ("^C[nodemon] still waiting..."); luego línea en blanco y prompt.
    # Solo se descarta el aviso propio de la terminal virtual ("Session terminated...").
    # Se "pulsa" Ctrl+C (byte 0x03) dentro de la terminal virtual, tal cual lo hace el teclado.
    { sleep "$STOP_AFTER"; printf '\003'; sleep 4; } \
      | TERM=xterm-256color timeout 30 script -qefc "bash $RUNF" /dev/null 2>&1 \
      | grep -av "Session terminated" \
      | sed -e :a -e '/^[[:space:]]*$/{$d;N;ba' -e '}'
    printf '\n'
    prompt "$DIR"; printf '\n'
  else
    run_tty 2>&1
    prompt "$(cat "$PWDF")"; printf '\xe2\x96\x88\n'
  fi
} > "$RAW"
rm -f "$PWDF" "$RUNF"

bash "$HERE/render-ansi.sh" "$RAW" "$OUT"
