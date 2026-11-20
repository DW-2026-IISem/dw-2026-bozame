import sys
# Uso: sections.py <guia.txt> <salida> <prefijo-de-encabezado> [max_lineas_por_bloque]
src, dst, prefix = sys.argv[1], sys.argv[2], sys.argv[3]
maxl = int(sys.argv[4]) if len(sys.argv) > 4 else 400
t = open(src, encoding="utf-8").read().split("\n")
lvl = len(prefix) - len(prefix.lstrip("#"))
out = []
for i, l in enumerate(t):
    if l.startswith(prefix):
        out.append("=== L%d %s" % (i + 1, l))
        j = i + 1
        n = 0
        while j < len(t) and n < maxl:
            s = t[j]
            if s.startswith("#"):
                k = len(s) - len(s.lstrip("#"))
                if k <= lvl:
                    break
            out.append(s[:220])
            j += 1
            n += 1
open(dst, "w", encoding="utf-8").write("\n".join(out))
print(len(out))
