#!/usr/bin/env python3
"""verblk.py MAIN_REPO WT CLAVES  (p. ej. ep-01,ep-02)
Copia de MAIN a WT, en catalogo/pruebas/verificar.js, el bloque de comentario y verificadores de esas claves; lo pone
después de la línea anterior del bloque en MAIN, que debe estar una sola vez en WT."""
import sys, re
main, wt, claves = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
P = 'catalogo/pruebas/verificar.js'
M = open(f'{main}/{P}').read().split('\n'); W = open(f'{wt}/{P}').read().split('\n')
k0 = next(k for k, l in enumerate(M) if l.startswith(f"  '{claves[0]}'"))
s = k0
while M[s-1].startswith('  //'): s -= 1
e = k0
while True:
    n = M[e+1]
    m = re.match(r"^  '([a-z]+-\d+)'", n)
    if (m and m.group(1) in claves) or n.startswith('    ') or n.rstrip() == '  },': e += 1; continue
    break
while M[s-1].strip() == '': s -= 1
blk = M[s:e+1]
if any(l.startswith(f"  '{claves[0]}'") for l in W): sys.exit('ya está')
anc = M[s-1]
c = [k for k, l in enumerate(W) if l == anc]
if len(c) == 1:
    pos = c[0] + 1
else:
    # la clave anterior al bloque en MAIN; en WT, el final de su entrada
    kp = next(k for k in range(s-1, -1, -1) if re.match(r"^  '[a-z]+-\d+'", M[k]))
    key = re.match(r"^  ('[a-z]+-\d+')", M[kp]).group(1)
    w0 = next(k for k, l in enumerate(W) if l.startswith('  ' + key))
    pos = w0 + 1
    while W[pos].startswith('    ') or W[pos].rstrip() == '  },': pos += 1
W[pos:pos] = blk
open(f'{wt}/{P}', 'w').write('\n'.join(W)); print('verificar +', len(blk))
