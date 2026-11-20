#!/usr/bin/env bash
# Copia los scripts de capturas a documentacion/herramientas-capturas (sin make-env.sh, que tiene contraseñas).
S=/mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad
D=~/ia-lab/pry-sbarboza/app-entreganexo/documentacion/herramientas-capturas
mkdir -p "$D"
cd "$S" || exit 1
for f in *.ps1 *.sh *.py guia-ok.txt; do
  [ "$f" = "make-env.sh" ] && continue
  cp "$f" "$D/"
done
cp README-herramientas.md "$D/README.md"
echo "archivos: $(ls "$D" | wc -l)"; du -sh "$D"
if grep -lE '(MYSQL|POSTGRES|MSSQL|ORACLE)_PASSWORD=[A-Za-z0-9]' "$D"/* ; then echo "OJO: contraseñas"; else echo "sin contraseñas"; fi
