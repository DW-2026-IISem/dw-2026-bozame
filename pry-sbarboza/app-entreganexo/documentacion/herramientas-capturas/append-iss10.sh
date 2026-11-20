#!/usr/bin/env bash
cd ~/ia-lab/pry-sbarboza/app-entreganexo/documentacion || exit 1
tail -c 6 proceso_express.md | od -c | head -1
sed 's/$/\r/' /mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad/md-iss10.md >> proceso_express.md
for f in $(grep -o 'images/express/iss10-[^)]*' proceso_express.md | sort -u); do [ -f "$f" ] || echo "FALTA $f"; done
echo "refs iss10: $(grep -c 'images/express/iss10' proceso_express.md) / archivos: $(ls images/express/iss10-* | wc -l)"
grep -n '### Paso 22[56]\|### Paso 246' proceso_express.md
