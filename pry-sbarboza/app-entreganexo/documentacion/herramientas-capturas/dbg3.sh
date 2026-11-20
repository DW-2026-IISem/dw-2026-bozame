#!/usr/bin/env bash
# Busca qué secuencias ANSI hacen fallar a freeze
S=/mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad
python3 -I $S/wrapansi.py 90 < $S/shots/iss03-29-npm-run-dev-final.ansi > /tmp/w.ansi
echo "secuencias distintas:"; grep -oP '\x1b\[[0-9;]*m' /tmp/w.ansi | sort | uniq -c | cat -v
n=$(wc -l < /tmp/w.ansi)
for i in $(seq 1 $((n+1))); do
  sed -n "${i}p" /tmp/w.ansi > /tmp/l.ansi
  if ! ~/.local/bin/freeze --language ansi --output /tmp/l.svg < /tmp/l.ansi >/dev/null 2>&1; then
    echo "FALLA linea $i:"; cat -v /tmp/l.ansi | head -c 400; echo
  fi
done
