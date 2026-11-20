#!/usr/bin/env bash
# server.sh start|stop  — levanta/detiene backend-express en segundo plano (para las pruebas con curl)
DIR=~/ia-lab/pry-sbarboza/app-entreganexo/backend-express
LOG=/tmp/backend-express.log
PIDF=/tmp/backend-express.pid
case "$1" in
  start)
    cd "$DIR" || exit 1
    setsid nohup npx ts-node src/server.ts > "$LOG" 2>&1 &
    echo $! > "$PIDF"
    for i in $(seq 1 60); do
      if grep -q "Servidor ejecutándose" "$LOG"; then echo "arriba"; tail -3 "$LOG"; exit 0; fi
      if grep -q "Error" "$LOG"; then cat "$LOG"; exit 1; fi
      sleep 1
    done
    echo "timeout"; cat "$LOG"; exit 1 ;;
  stop)
    if [ -f "$PIDF" ]; then kill -- -"$(cat "$PIDF")" 2>/dev/null || kill "$(cat "$PIDF")" 2>/dev/null; rm -f "$PIDF"; fi
    sleep 1
    ss -ltnp 2>/dev/null | grep -q ':3002 ' && echo "sigue ocupado" || echo "detenido" ;;
esac
