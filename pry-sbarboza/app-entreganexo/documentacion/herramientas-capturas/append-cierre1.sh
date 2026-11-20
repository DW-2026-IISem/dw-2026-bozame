#!/usr/bin/env bash
bash /mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad/server.sh stop
cd ~/ia-lab/pry-sbarboza/app-entreganexo/documentacion || exit 1
tail -c 6 proceso_express.md | od -c | head -1
sed 's/$/\r/' /mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad/md-cierre1.md >> proceso_express.md
for f in $(grep -o 'images/express/cierre1-[^)]*' proceso_express.md | sort -u); do [ -f "$f" ] || echo "FALTA $f"; done
grep -c 'images/express/cierre1' proceso_express.md
grep -n '### Paso 19[45]\|### Paso 203' proceso_express.md
