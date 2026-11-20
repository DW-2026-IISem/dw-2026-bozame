#!/usr/bin/env bash
set -euo pipefail
dest="$HOME/.local/share/freeze-fonts"
mkdir -p "$dest"
if [ -f "$dest/CascadiaMono.ttf" ]; then echo "ya existe"; exit 0; fi
url=$(curl -fsSL https://api.github.com/repos/microsoft/cascadia-code/releases/latest | grep -o 'https://[^"]*CascadiaCode-[^"]*\.zip' | head -1)
echo "$url"
d=$(mktemp -d)
curl -fsSL "$url" -o "$d/c.zip"
cd "$d"
python3 - <<'PY'
import zipfile
z = zipfile.ZipFile("c.zip")
names = [n for n in z.namelist() if n.lower().endswith(".ttf") and "mono" in n.lower()]
print("\n".join(names))
pick = next((n for n in names if n.endswith("static/CascadiaMono-Regular.ttf")), None) \
    or next((n for n in names if n.endswith("CascadiaMono.ttf")), None)
print("elegido:", pick)
open("CascadiaMono.ttf", "wb").write(z.read(pick))
PY
cp CascadiaMono.ttf "$dest/"
rm -rf "$d"
ls -la "$dest"
