"""Contraste con enteros y fracciones: no importa ni llama al motor JavaScript.
El grado se obtiene por diferencias finitas de evaluaciones, no por máximos de exponentes.
"""
from pathlib import Path
from fractions import Fraction
import json,html

HERE=Path(__file__).resolve().parent

def difference_degree(values):
    degree=-1
    while any(values):
        degree+=1
        values=[b-a for a,b in zip(values,values[1:])]
    return None if degree<0 else degree

def degrees(terms):
    bound=max((t['x']+t['y'] for t in terms),default=0)
    def value(x,y):return sum(t['c']*x**t['x']*y**t['y'] for t in terms)
    found={'grado':[],'x':[],'y':[]}
    # Más direcciones/valores fijos que el grado: una parte homogénea no nula
    # no puede anularse en todos ellos. Incluye cancelaciones reales del polinomio.
    for k in range(1,bound+2):
        for key,seq in [('grado',[value(t,k*t) for t in range(bound+2)]),
                        ('x',[value(t,k) for t in range(bound+2)]),
                        ('y',[value(k,t) for t in range(bound+2)])]:
            d=difference_degree(seq)
            if d is not None:found[key].append(d)
    return {k:max(v) if v else None for k,v in found.items()}

def admissible(family,start,end):
    return [n for n in range(start,end+1) if all(
        (v:=Fraction(t[axis]['a']*n+t[axis]['b'],t[axis]['d'])).denominator==1 and v>=0
        for t in family for axis in ['x','y'])]

def main():
    cases=json.loads((HERE/'casos.json').read_text(encoding='utf-8'))
    for c in cases['polinomios']:
        result=degrees(c['entrada']);want=c['esperado']
        assert result=={'grado':want['grado'],**want['gradosRelativos']},(c['id'],result)
    f=cases['familia'];assert admissible(f['entrada'],f['desde'],f['hasta'])==f['valores']
    paper=json.loads((HERE/'papel.json').read_text(encoding='utf-8'))['ejercicios']
    for p in paper:
        if 'terminos' in p:assert degrees(p['terminos'])['grado']==p['grado'],p['id']
        else:assert admissible(p['familia'],p['desde'],p['hasta'])==p['valores']
    doc='<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Polinomios · Lápiz y papel</title><link rel="stylesheet" href="estilos.css"><main><p class="eyebrow">CINCO EJERCICIOS PROPIOS</p><h1>Ahora, lápiz y papel.</h1><p>Resuelve primero. Abre después cada explicación para contrastar tu procedimiento.</p>'
    for i,p in enumerate(paper,1):doc+=f'<article><h2>Ejercicio {i}</h2><p>{html.escape(p["enunciado"])}</p><details><summary>Ver solución</summary><p>{html.escape(p["solucion"])}</p></details></article>'
    doc+='<a href="index.html">Volver a la prueba</a></main></html>'
    (HERE/'papel.html').write_text(doc,encoding='utf-8')
    print('Contraste independiente aprobado: 7 polinomios, 1 familia y 5 ejercicios de papel.')

if __name__=='__main__':main()
