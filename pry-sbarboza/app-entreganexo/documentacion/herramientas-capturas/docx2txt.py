import sys, zipfile, re
from xml.etree import ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
src, dst = sys.argv[1], sys.argv[2]
z = zipfile.ZipFile(src)
root = ET.fromstring(z.read("word/document.xml"))
body = root.find(W + "body")

def ptext(p):
    out = []
    for node in p.iter():
        if node.tag == W + "t" and node.text:
            out.append(node.text)
        elif node.tag == W + "tab":
            out.append("\t")
        elif node.tag in (W + "br", W + "cr"):
            out.append("\n")
        elif node.tag.endswith("}drawing") or node.tag.endswith("}pict"):
            out.append("[IMAGEN]")
    return "".join(out)

def pstyle(p):
    ps = p.find(W + "pPr/" + W + "pStyle")
    return ps.get(W + "val") if ps is not None else ""

def is_list(p):
    return p.find(W + "pPr/" + W + "numPr") is not None

lines = []
for el in body:
    if el.tag == W + "p":
        t = ptext(el)
        st = pstyle(el)
        m = re.match(r"(?i)(heading|ttulo|titulo)\s*(\d)", st)
        if st.lower() == "title":
            lines.append("# " + t)
        elif m:
            lines.append("#" * (int(m.group(2)) + 1) + " " + t)
        elif is_list(el):
            lines.append("- " + t)
        else:
            lines.append(("[" + st + "] " if st and st.lower() not in ("normal", "listparagraph") else "") + t)
    elif el.tag == W + "tbl":
        lines.append("<<TABLA>>")
        for tr in el.iter(W + "tr"):
            cells = []
            for tc in tr.findall(W + "tc"):
                cells.append(" / ".join(ptext(p) for p in tc.iter(W + "p")).strip())
            lines.append("| " + " | ".join(cells) + " |")
        lines.append("<</TABLA>>")
open(dst, "w", encoding="utf-8").write("\n".join(lines))
media = [n for n in z.namelist() if n.startswith("word/media/")]
print("lineas:", len(lines), "imagenes:", len(media))
