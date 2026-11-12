# python3 csvset.py modulo_viejo 'patron_regex_falta' modulo_nuevo
import csv,sys,re,io
viejo,pat,nuevo=sys.argv[1:4]
p='docs/datos/admision-unmsm.csv'
raw=open(p,newline='').read()
rows=list(csv.reader(io.StringIO(raw)))
h=rows[0]; im,ic,ifa,icu=h.index('modulo'),h.index('cobertura'),h.index('falta'),h.index('curso')
n=0
for r in rows[1:]:
    if r[icu]=='fisica' and r[ic]!='si' and r[im]==viejo and re.search(pat,r[ifa]):
        r[im]=nuevo; r[ic]='si'; r[ifa]=''; n+=1
out=io.StringIO(); w=csv.writer(out,lineterminator='\r\n'); w.writerows(rows)
open(p,'w',newline='').write(out.getvalue())
print(nuevo,n)
