import sys


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


src, dst = sys.argv[1], sys.argv[2]
with open(src, encoding="utf-8") as f, open(dst, "w", encoding="utf-8", newline="\n") as out:
    for line in f.read().split("\n"):
        out.write(fix(line) + "\n")
