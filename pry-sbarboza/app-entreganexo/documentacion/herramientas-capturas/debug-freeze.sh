#!/usr/bin/env bash
cd /tmp
F="$HOME/.local/bin/freeze"
OUT=/mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad
mkdir -p "$HOME/.local/share/fonts"
cp "$HOME/.local/share/freeze-fonts/CascadiaMono.ttf" "$HOME/.local/share/fonts/" 2>/dev/null
fc-cache -f >/dev/null 2>&1
fc-list | grep -i -E "cascadia|ubuntu mono" | head -4
printf '\033[1;38;2;22;198;12mverde\033[0m texto normal lI10O\n' > /tmp/dbg.ansi
"$F" --language ansi --font.family "Ubuntu Mono" --output "$OUT/dbg-ubuntu.png" < /tmp/dbg.ansi
"$F" --language ansi --font.family "Cascadia Mono" --output "$OUT/dbg-cascadia.png" < /tmp/dbg.ansi
