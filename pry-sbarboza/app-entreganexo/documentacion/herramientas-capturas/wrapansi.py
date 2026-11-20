"""Normaliza un flujo ANSI como lo pintaría Windows Terminal con el esquema "Ubuntu"
(colores medidos de una captura real) y lo ajusta a N columnas visibles.

Uso: python3 wrapansi.py COLS < entrada > salida

- Traduce los colores básicos (30-37, 90-97, 40-47, 100-107, 38;5;n), negrita
  (intensa = brillante) y tenue (dim = 50 %) a color verdadero (38;2;r;g;b).
- Parte las líneas a COLS columnas conservando el color activo.
- Rellena la primera línea hasta COLS para que todas las capturas tengan el mismo ancho.
"""
import re
import sys
import unicodedata

cols = int(sys.argv[1])

# Esquema "Ubuntu" de Windows Terminal (verde, azul brillante, amarillo, fondo y blanco medidos)
FG_DEFAULT = (255, 255, 255)
BG = (0x30, 0x0A, 0x24)
PALETTE = [
    (0x17, 0x14, 0x21), (0xC2, 0x1A, 0x23), (0x26, 0xA2, 0x69), (0xA2, 0x73, 0x4C),
    (0x00, 0x37, 0xDA), (0x88, 0x17, 0x98), (0x3A, 0x96, 0xDD), (0xCC, 0xCC, 0xCC),
    (0x76, 0x76, 0x76), (0xC0, 0x1C, 0x28), (0x26, 0xA2, 0x69), (0xA2, 0x73, 0x4C),
    (0x08, 0x45, 0x8F), (0xA3, 0x47, 0xBA), (0x2C, 0x9F, 0xB3), (0xF2, 0xF2, 0xF2),
]


def xterm256(n):
    if n < 16:
        return PALETTE[n]
    if n < 232:
        n -= 16
        steps = [0, 95, 135, 175, 215, 255]
        return (steps[n // 36], steps[(n // 6) % 6], steps[n % 6])
    v = 8 + (n - 232) * 10
    return (v, v, v)


class State:
    def __init__(self):
        self.fg = None      # None = por defecto; int = índice de paleta; tuple = RGB
        self.bg = None
        self.bold = False
        self.dim = False
        self.italic = False
        self.underline = False

    def apply(self, params):
        p = [int(x) if x else 0 for x in params.split(";")] if params else [0]
        i = 0
        while i < len(p):
            c = p[i]
            if c == 0:
                self.__init__()
            elif c == 1:
                self.bold = True
            elif c == 2:
                self.dim = True
            elif c == 3:
                self.italic = True
            elif c == 4:
                self.underline = True
            elif c == 22:
                self.bold = self.dim = False
            elif c == 23:
                self.italic = False
            elif c == 24:
                self.underline = False
            elif 30 <= c <= 37:
                self.fg = c - 30
            elif 90 <= c <= 97:
                self.fg = c - 90 + 8
            elif c == 39:
                self.fg = None
            elif 40 <= c <= 47:
                self.bg = c - 40
            elif 100 <= c <= 107:
                self.bg = c - 100 + 8
            elif c == 49:
                self.bg = None
            elif c in (38, 48) and i + 1 < len(p):
                if p[i + 1] == 5 and i + 2 < len(p):
                    val = xterm256(p[i + 2]); i += 2
                elif p[i + 1] == 2 and i + 4 < len(p):
                    val = (p[i + 2], p[i + 3], p[i + 4]); i += 4
                else:
                    val = None
                if c == 38:
                    self.fg = val
                else:
                    self.bg = val
            i += 1

    def sgr(self):
        if isinstance(self.fg, int):
            idx = self.fg + 8 if (self.bold and self.fg < 8) else self.fg  # intenso = brillante
            fg = PALETTE[idx]
        elif isinstance(self.fg, tuple):
            fg = self.fg
        else:
            fg = FG_DEFAULT
        if self.dim:
            fg = tuple(int(v * 0.5) for v in fg)  # blanco tenue -> #7F7F7F, como Windows Terminal
        # freeze falla si se combinan varios parámetros en una secuencia: una por atributo
        out = "\x1b[0m\x1b[38;2;%d;%d;%dm" % fg
        # Fondos de color omitidos: freeze los dibuja desplazados con fuentes que no son la suya
        if self.italic:
            out += "\x1b[3m"
        if self.underline:
            out += "\x1b[4m"
        return out


def width(ch):
    if unicodedata.combining(ch):
        return 0
    return 2 if unicodedata.east_asian_width(ch) in ("W", "F") else 1


SGR = re.compile(r"\x1b\[([0-9;]*)m")
OTHER_ESC = re.compile(r"\x1b\[[0-9;?]*[A-Za-ln-z]|\x1b\][^\x07]*\x07")

data = sys.stdin.buffer.read().decode("utf-8", errors="replace")
data = OTHER_ESC.sub("", data).replace("\r\n", "\n")
# Retorno de carro dentro de una línea (spinners de npm): la terminal muestra solo lo último escrito
lines_in = []
for ln in data.split("\n"):
    if "\r" in ln:
        segs = [s for s in ln.split("\r") if SGR.sub("", s).strip()]
        ln = segs[-1] if segs else ""
    # Spinner de npm (caracteres braille): la terminal real lo borra; se elimina
    if re.search("[⠀-⣿]", ln):
        ln = re.sub("[⠀-⣿]", "", ln)
    lines_in.append(ln)

st = State()
out_lines = []
for raw in lines_in:
    cur, w, pos = [st.sgr()], 0, 0
    while pos < len(raw):
        m = SGR.match(raw, pos)
        if m:
            st.apply(m.group(1))
            cur.append(st.sgr())
            pos = m.end()
            continue
        ch = raw[pos]
        if ch == "\t":
            spaces = 8 - (w % 8)
            if w + spaces > cols:
                out_lines.append("".join(cur))
                cur, w = [st.sgr()], 0
                spaces = 8
            cur.append(" " * spaces)
            w += spaces
            pos += 1
            continue
        cw = width(ch)
        if w + cw > cols:
            out_lines.append("".join(cur))
            cur, w = [st.sgr()], 0
        cur.append(ch)
        w += cw
        pos += 1
    out_lines.append("".join(cur))

# freeze falla con líneas finales que solo contienen códigos de color: se eliminan
while out_lines and not SGR.sub("", out_lines[-1]).strip():
    out_lines.pop()

if out_lines:
    vis = SGR.sub("", out_lines[0])
    pad = cols - sum(width(c) for c in vis)
    if pad > 0:
        out_lines[0] += "\x1b[0m" + " " * pad
sys.stdout.write("\n".join(out_lines))
