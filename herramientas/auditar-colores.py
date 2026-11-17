# Auditoría de la paleta de variables de la app (skill teoría del color): contraste de texto y de línea contra la
# tarjeta, el chip (12 % del color sobre la tarjeta), gris equivalente y distancias OKLab entre pares, normal y simulado.
import math, itertools, sys
def dec(c): return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4
def enc(c):
    c = max(0, min(1, c)); return 12.92*c if c <= 0.0031308 else 1.055*c**(1/2.4)-0.055
def lin(h): h = h.lstrip('#'); return [dec(int(h[i:i+2], 16)/255) for i in (0, 2, 4)]
def hexl(l): return '#' + ''.join('%02X' % round(enc(c)*255) for c in l)
def Y(h): r, g, b = lin(h); return 0.2126*r + 0.7152*g + 0.0722*b
def contraste(a, b): a, b = sorted((Y(a), Y(b))); return (b+0.05)/(a+0.05)
def gris(h): return round(enc(Y(h))*255)
def mix_srgb(a, b, t):  # color-mix(in srgb, a t, b)
    A=[int(a[i:i+2],16) for i in (1,3,5)]; B=[int(b[i:i+2],16) for i in (1,3,5)]
    return '#'+''.join('%02X'%round(x*t+y*(1-t)) for x,y in zip(A,B))
def oklab(l):
    r, g, b = l
    L = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b
    M = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b
    S = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b
    L, M, S = (math.copysign(abs(x)**(1/3), x) for x in (L, M, S))
    return [0.2104542553*L + 0.7936177850*M - 0.0040720468*S, 1.9779984951*L - 2.4285922050*M + 0.4505937099*S, 0.0259040371*L + 0.7827717662*M - 0.8086757660*S]
def dist(a, b): return math.dist(oklab(lin(a)), oklab(lin(b)))
CVD = {'protan': [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
 'deutan': [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
 'tritan': [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]]}
def simular(h, t): l = lin(h); return hexl([sum(m*c for m, c in zip(f, l)) for f in CVD[t]])

def auditar(nombre, pal, card, ink):
    print(f'\n== {nombre} (tarjeta {card}, tinta {ink})')
    print('var        hex      gris  texto/tarjeta  texto/chip  línea/tarjeta')
    for k, h in pal.items():
        chip = mix_srgb(h, card, 0.12)
        print(f'{k:10} {h}  {gris(h):4}  {contraste(h, card):5.2f}         {contraste(h, chip):5.2f}       {contraste(h, card):5.2f}')
    print('pares (OKLab): normal | protan | deutan | tritan  — el más cercano marca el riesgo')
    filas = []
    for (a, ha), (b, hb) in itertools.combinations(pal.items(), 2):
        d = [dist(ha, hb)] + [dist(simular(ha, t), simular(hb, t)) for t in ('protan', 'deutan', 'tritan')]
        filas.append((min(d), a, b, d, contraste(ha, hb)))
    for m, a, b, d, c in sorted(filas):
        print(f'  {a}-{b}: ' + ' | '.join(f'{x:.3f}' for x in d) + f'   contraste entre sí {c:.2f}' + ('  <-- riesgo' if m < 0.06 else ''))

if __name__ == '__main__':
    claro = {'o': '#a95300', 'i': '#07746e', 'h': '#c02a5c', 'd': '#3d6b0c', 'f': '#6b3dbd'}
    oscuro = {'o': '#f0a04a', 'i': '#3dcdc3', 'h': '#f17384', 'd': '#a3d65e', 'f': '#ab8cf2'}
    auditar('app, claro', claro, '#fffaf6', '#2d2340')
    auditar('app, oscuro', oscuro, '#2a2135', '#f1ebf7')
    # Escena de vectores (17 nov): papeles con los tokens de la app; x/D, y/sb y û/z son los colores aparte (no se ven
    # juntos dentro de cada pareja). Los pares que importan son los de una misma pantalla (ver el comentario de la escena).
    esc_claro = {'a': '#a95300', 'b': '#07746e', 'R': '#6b3dbd', 'th': '#c02a5c', 'c': '#3d6b0c',
                 'x': '#0b5a8c', 'y': '#561a6e', 'u': '#5c0300'}
    esc_oscuro = {'a': '#f0a04a', 'b': '#3dcdc3', 'R': '#ab8cf2', 'th': '#f17384', 'c': '#a3d65e',
                  'x': '#b3d9ff', 'y': '#e0a6ff', 'u': '#c6916e'}
    # Paleta de lectura (razonamiento verbal, teoría y app/lectura.js; Gerson, 17 nov): evidencia turquesa, distractor
    # naranja e idea violeta (antes verde: «idea-verde» queda para comparar; con protanopía, verde y naranja daban 0,010).
    auditar('lectura, claro', {'evidencia': claro['i'], 'distractor': claro['o'], 'idea': claro['f'], 'idea-verde': claro['d']}, '#fffaf6', '#2d2340')
    auditar('lectura, oscuro', {'evidencia': oscuro['i'], 'distractor': oscuro['o'], 'idea': oscuro['f'], 'idea-verde': oscuro['d']}, '#2a2135', '#f1ebf7')
    auditar('escena vectores, claro', esc_claro, '#fffaf6', '#2d2340')
    auditar('escena vectores, oscuro', esc_oscuro, '#2a2135', '#f1ebf7')
