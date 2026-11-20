#!/usr/bin/env python3
"""avblk.py MAIN_REPO WT UNIDAD TESTMARK
Copia de MAIN a WT la entrada de UNIDAD en REHECHAS_E6 (nucleo/avance.js, con sus comentarios previos) y la prueba de
nucleo/avance.test.js que empieza en el comentario que contiene TESTMARK (hasta su '});'), al final del archivo."""
import sys, re
main, wt, uni, mark = sys.argv[1:5]
# avance.js
M = open(f'{main}/nucleo/avance.js').read().split('\n'); W = open(f'{wt}/nucleo/avance.js').read().split('\n')
i = next(k for k, l in enumerate(M) if f"u: '{uni}'" in l)
s = i
while M[s-1].strip().startswith('//'): s -= 1
e = i
while not M[e].rstrip().endswith('},'): e += 1
blk = M[s:e+1]
if any(f"u: '{uni}'" in l for l in W): print('avance.js: ya está')
else:
    r = next(k for k, l in enumerate(W) if 'REHECHAS_E6' in l and '=' in l)
    end = next(k for k in range(r, len(W)) if W[k].strip() == '];')
    W[end:end] = blk
    open(f'{wt}/nucleo/avance.js', 'w').write('\n'.join(W)); print('avance.js +', len(blk))
# avance.test.js
M = open(f'{main}/nucleo/avance.test.js').read().split('\n'); W = open(f'{wt}/nucleo/avance.test.js').read()
i = next(k for k, l in enumerate(M) if l.startswith('//') and mark in l)
j = next(k for k in range(i, len(M)) if M[k].startswith('});'))
blk = '\n'.join(M[i:j+1])
if blk.split('\n')[1] in W: print('test: ya está')
else:
    W = W.rstrip('\n') + '\n\n' + blk + '\n'
    open(f'{wt}/nucleo/avance.test.js', 'w').write(W); print('test +', j-i+1)
