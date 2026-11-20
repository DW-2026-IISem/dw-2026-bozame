#!/usr/bin/env bash
cd ~/ia-lab/pry-sbarboza/app-entreganexo/documentacion || exit 1
tail -c 20 proceso_express.md | od -c | head -3
sed 's/$/\r/' /mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad/md-iss08.md >> proceso_express.md
for f in $(grep -o 'images/express/iss08-[^)]*' proceso_express.md | sort -u); do [ -f "$f" ] || echo "FALTA $f"; done
grep -c 'images/express/iss07' proceso_express.md
grep -n '### Paso 14[78]\|### Paso 194' proceso_express.md
