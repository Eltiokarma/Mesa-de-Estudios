#!/usr/bin/env python3
"""bloque.py MAIN WT START [END]
Copia de MAIN (archivo del árbol principal) el bloque que empieza en la línea que contiene START
y termina antes de la primera línea en blanco (o antes de la línea que contiene END si se da; END
puede ser 'TEST' = hasta '});' inclusive). Lo inserta en WT después de la última línea anterior al
bloque en MAIN que exista una sola vez en WT."""
import sys
main, wt, start = sys.argv[1], sys.argv[2], sys.argv[3]
end = sys.argv[4] if len(sys.argv) > 4 else None
M = open(main).read().split('\n'); W = open(wt).read().split('\n')
i = next(k for k, l in enumerate(M) if start in l)
if end == 'TEST':
    j = next(k for k in range(i, len(M)) if M[k].startswith('});')) + 1
elif end:
    j = next(k for k in range(i + 1, len(M)) if end in M[k])
else:
    j = next(k for k in range(i, len(M)) if M[k].strip() == '')
blk = M[i:j]
if any(start in l for l in W):
    print('ya está:', start); sys.exit(0)
for k in range(i - 1, -1, -1):
    c = [n for n, l in enumerate(W) if l == M[k]]
    if len(c) == 1 and M[k].strip():
        pos = c[0] + 1; break
else:
    sys.exit('sin ancla para ' + start)
if end == 'TEST' or (j < len(M) and M[j].strip() == '' and not end):
    pass
W[pos:pos] = blk + ([''] if end == 'TEST' else [])
open(wt, 'w').write('\n'.join(W))
print('ok', start, len(blk), 'líneas tras', repr(W[pos-1][:60]))
