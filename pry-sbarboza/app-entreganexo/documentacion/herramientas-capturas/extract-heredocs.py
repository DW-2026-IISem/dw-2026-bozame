"""Extrae los bloques `: > path` + `cat >> path << 'EOF'` ... `EOF` de un trozo de la guía
y los escribe bajo un directorio destino, corrigiendo el mojibake (UTF-8 leído como cp1252)."""
import os
import sys

src, outdir = sys.argv[1], sys.argv[2]


def fix(line: str) -> str:
    try:
        b = bytearray()
        for ch in line:
            o = ord(ch)
            if o < 256:
                b.append(o)
            else:
                b.extend(ch.encode("cp1252"))
        return b.decode("utf-8")
    except Exception:
        return line


lines = open(src, encoding="utf-8").read().split("\n")
i = 0
written = []
while i < len(lines):
    l = lines[i]
    if l.startswith("cat >> ") and l.rstrip().endswith("<< 'EOF'"):
        path = l[len("cat >> "):].split(" <<")[0].strip()
        body = []
        i += 1
        while i < len(lines) and lines[i] != "EOF":
            body.append(fix(lines[i]))
            i += 1
        dest = os.path.join(outdir, path)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "w", encoding="utf-8", newline="\n") as f:
            f.write("\n".join(body) + "\n")
        written.append(path)
    i += 1
for p in written:
    print(p)
