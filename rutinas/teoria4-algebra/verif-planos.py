# Verificación aparte de tres planos: rango por menores (no por eliminación), punto por la inversa (adjunta / det),
# rectas comprobadas sustituyendo dos puntos en las tres ecuaciones. Fracciones exactas.
import json, itertools
from fractions import Fraction as Fr
def det(M):
    n=len(M)
    if n==1: return M[0][0]
    return sum((-1)**j*M[0][j]*det([r[:j]+r[j+1:] for r in M[1:]]) for j in range(n))
def rango(M):
    m,n=len(M),len(M[0])
    for k in range(min(m,n),0,-1):
        for fs in itertools.combinations(range(m),k):
            for cs in itertools.combinations(range(n),k):
                if det([[M[i][j] for j in cs] for i in fs])!=0: return k
    return 0
casos=[
 ("punto (1; 1; 1)", [[1,1,1,3],[1,-1,1,1],[1,0,-1,0]]),
 ("punto con fracciones", [[1,1,1,3],[1,-1,1,1],[2,1,0,4]]),
 ("punto lejos del origen", [[2,-1,0,1],[0,1,3,2],[1,0,-1,4]]),
 ("recta común", [[1,1,1,3],[1,-1,1,1],[1,0,1,2]]),
 ("recta: dos planos iguales", [[1,1,1,3],[1,-1,1,1],[2,2,2,6]]),
 ("prisma", [[1,1,1,3],[1,-1,1,1],[1,0,1,5]]),
 ("paralelos", [[1,1,1,3],[1,-1,1,1],[1,1,1,7]]),
 ("plano común", [[1,2,-1,2],[2,4,-2,4],[-1,-2,1,-2]]),
 ("tres paralelos distintos", [[0,0,1,0],[0,0,1,1],[0,0,2,5]]),
 ("ecuación imposible", [[1,1,1,3],[1,-1,1,1],[0,0,0,2]]),
 ("ecuación 0 = 0", [[1,1,1,3],[1,-1,1,1],[0,0,0,0]]),
]
out=[]
for nombre,P in casos:
    P=[[Fr(v) for v in p] for p in P]
    A=[p[:3] for p in P]; b=[p[3] for p in P]
    rA,rB=rango(A),rango(P)
    e={"rango":rA,"rangoAmpliado":rB}
    if rA<rB: e["tipo"]="ninguna"
    elif rA==3:
        D=det(A)
        # x = A^{-1} b con la adjunta: cof(i,j) traspuesto
        cof=lambda i,j: (-1)**(i+j)*det([[A[r][c] for c in range(3) if c!=j] for r in range(3) if r!=i])
        x=[sum(cof(j,i)*b[j] for j in range(3))/D for i in range(3)]
        assert all(sum(A[i][k]*x[k] for k in range(3))==b[i] for i in range(3))
        e["tipo"]="punto"; e["punto"]=[float(v) for v in x]; e["texto"]="una solución: ("+"; ".join(("−" if v<0 else "")+str(abs(v)) for v in x)+")"
    elif rA==2: e["tipo"]="recta"
    elif rA==1: e["tipo"]="plano"
    out.append({"nombre":nombre,"planos":[[int(v) for v in p] for p in P],"espera":e})
json.dump(out,open('planos.json','w'),ensure_ascii=False,indent=1)
for o in out: print(o["nombre"], o["espera"])
