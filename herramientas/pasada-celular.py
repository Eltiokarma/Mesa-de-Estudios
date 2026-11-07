import glob,os
# Pasada para escenas nuevas: carga nucleo/celular.js, usa Celular.dpr() y Celular.variable. Uso: python3 herramientas/pasada-celular.py
# (la1b, 7 nov 2026). Avisa con QUEDA lo que no pudo cambiar solo.
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'plantillas'))
TAG='<script src="../../nucleo/celular.js"></script>'
for p in sorted(glob.glob('*/index.html')):
    s=open(p).read(); o=s
    if 'nucleo/celular.js' not in s:
        m='<script src="../../nucleo/medicion.js"></script>\n'
        assert s.count(m)==1,p
        s=s.replace(m,m+TAG+'\n')
    s=s.replace('window.devicePixelRatio || 1','Celular.dpr()')
    s=s.replace("const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();","const css = Celular.variable; // guardada hasta que cambie el tema o el tamaño (nucleo/celular.js)")
    if s!=o: open(p,'w').write(s); print('editado', p)
    if 'devicePixelRatio' in s or 'getComputedStyle' in s: print('QUEDA', p)
