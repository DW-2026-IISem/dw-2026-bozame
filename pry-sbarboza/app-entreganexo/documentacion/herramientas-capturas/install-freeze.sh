#!/usr/bin/env bash
set -euo pipefail
d=$(mktemp -d)
cd "$d"
base=https://github.com/charmbracelet/freeze/releases/download/v0.2.2
f=freeze_0.2.2_Linux_x86_64.tar.gz
curl -fsSL "$base/$f" -o "$f"
curl -fsSL "$base/checksums.txt" -o checksums.txt
grep " $f\$" checksums.txt | sha256sum -c -
tar xzf "$f"
mkdir -p "$HOME/.local/bin"
cp "$(find . -name freeze -type f | head -1)" "$HOME/.local/bin/freeze"
chmod +x "$HOME/.local/bin/freeze"
"$HOME/.local/bin/freeze" --version
rm -rf "$d"
