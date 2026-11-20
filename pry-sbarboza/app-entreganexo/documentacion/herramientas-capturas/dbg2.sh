#!/usr/bin/env bash
S=/mnt/c/Users/sharo/AppData/Local/Temp/claude/41cd62183949314b/71109e37-3f68-47c4-b6ff-e469d45fbc45/scratchpad
cd ~/ia-lab/pry-sbarboza/app-entreganexo/backend-express
bash -c "$(cat $S/shots/t.cmd.txt)" 2>&1 | python3 -I $S/wrapansi.py 90 > /tmp/t.ansi
cat -A /tmp/t.ansi | head -20
~/.local/bin/freeze --language ansi --output /tmp/t.svg < /tmp/t.ansi; echo "freeze rc=$?"; ls -la /tmp/t.svg
