"""Crea un archivo de autoría autocontenido para una selección original de RM."""
from pathlib import Path
import argparse
TEMPLATE=r'''from base_lote_fisica import *
from fractions import Fraction
import itertools as it,sys
BOOKID=__BOOK__
configure(BOOKID,__TITLE__,__PREFIX__,'qa-fisica-extra-'+BOOKID,kind='resuelto',offset={p:f'{2*p-4}–{2*p-3}' for p in range(1,200)})
PRE="""from fractions import Fraction
import itertools as it
def lin(A,b):
 m=[[Fraction(x) for x in row]+[Fraction(y)] for row,y in zip(A,b)]
 n=len(A[0]);assert len(m)==n
 for j in range(n):
  i=next(i for i in range(j,n) if m[i][j]);m[j],m[i]=m[i],m[j];q=m[j][j];m[j]=[v/q for v in m[j]]
  for i in range(n):
   if i!=j:
    q=m[i][j];m[i]=[v-q*w for v,w in zip(m[i],m[j])]
 x=[r[-1] for r in m];assert all(sum(Fraction(a)*v for a,v in zip(row,x))==z for row,z in zip(A,b))
 return x
def sd(n):return sum(map(int,str(n)))
"""
exec(PRE)
THEME=__THEME__
def flow(labels):
 labels=list(labels)[:3]
 g=scene([(str(i),[[0,2-i-.25],[3,2-i-.25],[3,2-i+.25],[0,2-i+.25],[0,2-i-.25]]) for i in range(len(labels))],[([.05,2-i],z) for i,z in enumerate(labels)])
 g.update(sin_ejes=True,leyenda=False,puntos_ocultos=True);return g
def diagram(P,edges,marks=()):
 g=scene([(a+b,[P[a],P[b]]) for a,b in edges],[(v,k) for k,v in P.items()]+list(marks));g.update(sin_ejes=True,leyenda=False,puntos_ocultos=True);return g
def C(n,p,sub,t,e,s,r,c,plot=None,state='verificado',note='',labels=None):
 add(n,p,t,e,s,r,PRE+c,plot if plot is not None else (flow(labels) if labels else None),state,'Enunciado cotejado visualmente; solución propia. No se presupone cotejada la resolución editorial completa. '+note)
 E[-1]['cobertura']={'curso':'razonamiento-matematico','tema_id':THEME,'subtema_id':sub,'metodo':'cotejo_manual_por_ejercicio'}
def equation(row,rhs,vs):
 xs=[]
 for a,v in zip(row,vs):
  if a:
   term=('−' if a<0 else ('+' if xs else ''))+(str(abs(a)) if abs(a)!=1 else '')+v;xs.append(term)
 return ''.join(xs)+'='+str(rhs)
def L(n,p,sub,t,e,A,b,vs,q,want,ask=None,state='verificado',note=''):
 x=lin(A,b);v=sum(Fraction(a)*z for a,z in zip(q,x));assert v==Fraction(str(want)),(n,v,want)
 eqs=[equation(row,r,vs) for row,r in zip(A,b)];values=', '.join(k+'='+str(z) for k,z in zip(vs,x))
 steps='Definir '+', '.join(vs)+'. El texto da: '+'; '.join(eqs)+'.|Resolver por eliminación exacta: '+values+'.|'+(ask or 'Evaluar lo pedido')+' = '+str(v)+'. Comprobar sustituyendo en las ecuaciones.'
 check=f'A={A!r};b={b!r};x=lin(A,b);q={q!r};assert sum(Fraction(a)*z for a,z in zip(q,x))==Fraction({str(want)!r})'
 C(n,p,sub,t,e,steps,str(v)+'.',check,state=state,note=note,labels=eqs[:2]+[(ask or 'resultado')+': '+str(v)])
'''
def main():
 a=argparse.ArgumentParser();a.add_argument('archivo');a.add_argument('book');a.add_argument('titulo');a.add_argument('prefix');a.add_argument('tema');x=a.parse_args()
 p=Path(__file__).resolve().parent/x.archivo
 assert not p.exists(),p
 s=TEMPLATE.replace('__BOOK__',repr(x.book)).replace('__TITLE__',repr(x.titulo)).replace('__PREFIX__',repr(x.prefix)).replace('__THEME__',repr(x.tema))
 p.write_text(s,encoding='utf8');print(p.name)
if __name__=='__main__':main()
