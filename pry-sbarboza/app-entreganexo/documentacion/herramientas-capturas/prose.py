"""Imprime un tramo de guia-ok.txt sin los cuerpos de los heredocs (solo la prosa)."""
import sys

path, start, end = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
lines = open(path, encoding="utf-8").read().split("\n")[start - 1:end]
inside = False
for i, l in enumerate(lines, start):
    if inside:
        if l == "EOF":
            inside = False
        continue
    if l.startswith("cat >> ") and l.rstrip().endswith("<< 'EOF'"):
        inside = True
        print(f"{i}: [heredoc {l[7:].split(' <<')[0]}]")
        continue
    if " cat >> " in l and len(l) > 300:
        continue  # versión en una sola línea del mismo bloque
    print(f"{i}: {l[:300]}")
