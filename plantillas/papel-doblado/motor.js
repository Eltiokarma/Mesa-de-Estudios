/*
 * Motor de «La hoja que se dobla, se corta y se voltea» (razonamiento matemático: papel doblado y cortado,
 * reflexión de una loseta respecto de un vértice y fichas de dos caras que se voltean en grupo).
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorPapel) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * CONVENCIONES
 *   Puntos { x, y } con el eje y hacia arriba; la unidad es el lado de un cuadrito de la cuadrícula (1 cm).
 *   La hoja es el rectángulo { ancho, alto } con esquinas (0; 0) y (ancho; alto).
 *   Una recta: { x: k } (vertical), { y: k } (horizontal), { m, n } (y = m·x + n), { a, b, c } (a·x + b·y + c = 0)
 *   o { A, B } (pasa por dos puntos).
 *   Un doblez es { recta, mueve }: la parte del paquete que está del lado «mueve» de la recta da media vuelta sobre
 *   la recta y cae encima del otro lado (es una reflexión). mueve = 'derecha' | 'izquierda' (x mayor o menor que en
 *   la recta; solo si la recta no es horizontal) o 'arriba' | 'abajo' (y mayor o menor; solo si no es vertical).
 *   Los dobleces se hacen en orden sobre el paquete que va quedando; todos atraviesan todas las capas.
 *   Un corte (se hace con el paquete doblado y atraviesa todas las capas):
 *     { tipo:'circulo', centro, r }            agujero redondo. Un círculo con el centro sobre un doblez o sobre el
 *                                              borde del paquete se ve como un medio círculo (el corte semicircular)
 *     { tipo:'rombo', centro, dx, dy }        rombo de semidiagonales dx (horizontal) y dy (vertical)
 *     { tipo:'poligono', puntos }             cualquier polígono simple (agujero con esa forma)
 *     { tipo:'linea', A, B }                  un tijeretazo de A a B (sin ancho): separa, no quita papel
 *   Lo que de un corte cae fuera del paquete corta aire. Los bordes de los cortes deben cruzar los dobleces y los
 *   bordes de la hoja (no ir montados sobre ellos).
 *   Un «exacto» es un texto como '24 + 4π', '32 + 4√5' o '7,5': parte racional, raíces (de menor a mayor) y π.
 *   Las fracciones van con barra ('15/2') en los textos exactos; 'valor' es el número decimal.
 *
 * DOBLAR Y DESDOBLAR
 *   recta(o)                        { a, b, c } con a² + b² = 1 (y a > 0, o a = 0 y b > 0)
 *   doblar(hoja, dobleces)          { celdas, capas, caja }: cada celda es un trozo convexo de la hoja que viaja
 *                                   entero: { poli (en la hoja), g (la isometría hoja → paquete), hist (para cada
 *                                   doblez, si esa celda dio media vuelta en él), img (poli en el paquete), cara (+1
 *                                   si muestra la cara de arriba, −1 si quedó volteada), z (su altura en la pila tras
 *                                   cada doblez; z[0] antes del primero) }. capas = el mayor número de capas que se
 *                                   enciman en algún punto del paquete; caja = [x0, x1, y0, y1] del paquete
 *   capasEn(hoja, dobleces, P)      cuántas capas hay en el punto P del paquete (P no debe estar sobre un borde)
 *   desplegar(hoja, dobleces, cortes)
 *                                   lo que se ve al abrir la hoja:
 *                                     capas, copias (cuántas capas toca cada corte: una lista, un número por corte),
 *                                     agujeros (huecos que no tocan el borde de la hoja), muescas (los que lo tocan),
 *                                     piezas (trozos de papel separados), piezasCuadradas, areas (de cada pieza, de
 *                                     mayor a menor), perimetro (la suma de los bordes de todas las piezas, con los
 *                                     de los agujeros: { valor, exacto }), agujerosDetalle ([{ celdas: de cuántas
 *                                     capas sale ese agujero, area }]); las áreas se cuentan en una rejilla de 1/16 y
 *                                     son exactas solo si los bordes de la pieza son horizontales o verticales.
 *                                     Para el dibujo: celdas (cada una con huecos, polígonos en la hoja, y tajos,
 *                                     [A, B] en la hoja), trozos ({ poli, celda, pieza }: las celdas partidas por los
 *                                     tajos) y dibujoErrores ({ unaCapa, soloDoblez: [...], corrida (RME152: cada copia
 *                                     corrida a su lugar sin reflejarla) }, listas de polígonos en la hoja). Y
 *                                   errores (lo que da cada error típico):
 *                                     unaCapa        RME40: el corte se hace en una sola capa (la de abajo, que no se
 *                                                    movió): { agujeros, muescas, piezas, perimetro }
 *                                     soloDoblez     RME153: lista; soloDoblez[i] es lo que sale si solo se deshace el
 *                                                    doblez i (solo cortan las capas que no se movieron o que se
 *                                                    movieron únicamente en el doblez i): { agujeros, muescas, piezas,
 *                                                    perimetro }
 *                                     sinRestarBorde RME43: perímetro sumando los bordes del corte sin restar el
 *                                                    borde de la hoja que se va con él: { valor, exacto }
 *                                     tramosDelDoblez RME158: perímetro contando además, como borde, los tramos de
 *                                                    los dobleces que quedan dentro del corte, cada capa por su lado
 *                                                    (un tramo de doblez lo comparten dos capas: cuenta dos veces):
 *                                                    { valor, exacto }
 *                                     enteroPorCapa  RME159: como si cada capa tocada diera la figura entera del
 *                                                    corte: perímetro = perímetro de la hoja + copias × perímetro de la
 *                                                    figura completa (círculo 2πr, rombo 4·lado, polígono, tajo 2·largo),
 *                                                    sin restar nada: { valor, exacto }; y agujeros = suma de copias
 *                                     sinUniones     RME41: piezas contando cada capa como una hoja suelta
 *                                     cortesComoPiezas RME157: cuántos tajos hay al abrir (se cuentan los cortes en
 *                                                    vez de las piezas)
 *   pose(celda, dobleces, etapa, t) para animar: la transformación afín { a, b, c, d, e, f } (x′ = a·x + b·y + e,
 *                                   y′ = c·x + d·y + f) que lleva la celda de la hoja al dibujo cuando ya se hicieron
 *                                   los dobleces 0 … etapa − 1 y el doblez «etapa» va por la fracción t ∈ [0, 1]
 *                                   (vista desde arriba: la parte que gira se acorta por cos(π·t)); más mueve (si
 *                                   la celda gira en ese doblez) y alto (sen(π·t) · distancia a la recta)
 *
 * ESQUINA SOBRE ESQUINA (rectángulo a × b, a ≥ b, con A(0; 0), B(a; 0), C(a; b), D(0; b); se dobla de modo que C
 * caiga sobre A: el doblez es la mediatriz de AC)
 *   esquinaSobreEsquina(a, b)       { x: AE con E en AB (AE = EC: x² = (a − x)² + b², x = (a² + b²)/(2a)),
 *                                   resto: EB = a − x, doblez: EF (valor), doblezExacto, diagonal, E, F,
 *                                   dobleces: [{ recta, mueve }] para doblar(), errores: { diagonal, mitadDiagonal
 *                                   (RME150), ladoCorto (RME151: doblez paralelo al lado corto), xMitad (RME151:
 *                                   E en el punto medio de AB), xHipotenusa (RME151: x² + b² = (a − x)²) } }
 *   ladoDesdeDoblez(b, L)           el lado largo a si el lado corto es b y el doblez mide L: a = b²/√(L² − b²);
 *                                   { a, exacto, errores: { comoDiagonal: √(L² − b²) (RME150) } }
 *
 * LA LOSETA (cuadrado de lado 2 con dos marcas que no tienen ninguna simetría)
 *   loseta(x0, y0)                  { borde, marcas: [triángulo, barra], esquinas }: el cuadrado de esquina inferior
 *                                   izquierda (x0; y0), con un triángulo en su esquina de arriba a la izquierda,
 *                                   (x0; y0 + 2), (x0 + 1; y0 + 2), (x0; y0 + 1), y una barra (x0 + 1,25; y0 + 0,25) a
 *                                   (x0 + 1,75; y0 + 1,25)
 *   transformar(L, t)               la loseta transformada: t = { tipo:'central', O } (simetría respecto del punto O),
 *                                   { tipo:'eje', recta }, { tipo:'giro', O, grados } (antihorario si grados > 0) o
 *                                   { tipo:'traslacion', v }. Las listas de puntos conservan su orden
 *   imagen(P, t)                    la imagen del punto P por t
 *   iguales(L1, L2)                 si dos losetas ocupan lo mismo (borde y marcas, sin importar el orden de los
 *                                   vértices)
 *   reflejoEnVertice(x0, y0, O)     la predicción de la escena: { correcta (simetría respecto de O), errores:
 *                                   { ejeVertical, ejeHorizontal (RME24: reflejo en la recta vertical u horizontal por
 *                                   O), trasladada (RME152: la loseta corrida al lugar de la imagen sin voltearla) },
 *                                   igualGiro180 (si la simetría central es el giro de 180°), igualDosEjes (si es el
 *                                   reflejo en la vertical por O seguido del de la horizontal por O) }; cada loseta con
 *                                   triangulo: el vértice del ángulo recto del triángulo (la esquina de la marca)
 *
 * FICHAS DE DOS CARAS EN FILA (cartas, vasos): un estado es un texto de '1' (boca arriba) y '0' (boca abajo)
 *   jugadas(n, { k, contiguas })    las jugadas posibles: listas de k posiciones (desde 0) que se voltean a la vez;
 *                                   contiguas = true si tienen que estar juntas
 *   aplicar(estado, jugada)         el estado tras voltear esas fichas
 *   voltear(inicio, meta, { k, contiguas })
 *                                   búsqueda en anchura sobre todos los estados: { posible, minimo (null si no se
 *                                   puede), camino (las jugadas), diferentes (las fichas que están distintas),
 *                                   errores: { unoPorUno: diferentes (RME154), dividir: ⌈diferentes/k⌉ (RME155),
 *                                   cadaGrupo: n − k + 1, una jugada por cada grupo de la fila (RME155, para fichas
 *                                   contiguas) }, paridad: { k par: si con k par se conserva la paridad de las
 *                                   boca arriba, iguales: si inicio y meta tienen esa paridad igual } }
 *
 *   azar(semilla)                   generador con semilla para las pruebas
 *
 * Los casos de casos.json llaman a estas funciones con fn, args y espera. Un campo con punto (copias.0,
 * errores.unaCapa.perimetro.exacto, errores.soloDoblez.1.agujeros) entra en objetos y listas.
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.MotorPapel = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const EPS = 1e-9;

  // ---------------- fracciones y números exactos ----------------
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  function fr(n, d) { if (d < 0) { n = -n; d = -d; } const g = mcd(n, d); return [n / g, d / g]; }
  const suma = (p, q) => fr(p[0] * q[1] + q[0] * p[1], p[1] * q[1]);
  const por = (p, q) => fr(p[0] * q[0], p[1] * q[1]);
  // un decimal que viene de datos enteros, como fracción (denominador hasta 720)
  function rat(x) {
    for (let d = 1; d <= 720; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-7 * Math.max(1, Math.abs(x))) return fr(n, d); }
    return null;
  }
  // √(n/d) = (s/d)·√k con k libre de cuadrados
  function raiz(q) {
    let m = q[0] * q[1], s = 1;
    for (let p = 2; p * p <= m; p++) while (m % (p * p) === 0) { m /= p * p; s *= p; }
    return { k: m, coef: fr(s, q[1]) };
  }
  // Exacto: mapa 'q' → racional, 'r<k>' → coeficiente de √k, 'pi' → coeficiente de π. ok = false si algo no se pudo.
  const nuevoExacto = () => ({ t: {}, ok: true });
  function sumar(E, clave, q) { if (!q) { E.ok = false; return; } E.t[clave] = E.t[clave] ? suma(E.t[clave], q) : q; }
  function sumarLargo(E, dx, dy, veces) {
    const qx = rat(dx), qy = rat(dy);
    if (!qx || !qy) { E.ok = false; return; }
    const s = suma(por(qx, qx), por(qy, qy));
    if (s[0] === 0) return;
    const { k, coef } = raiz(s);
    sumar(E, k === 1 ? 'q' : 'r' + k, por(coef, fr(veces, 1)));
  }
  function sumarArco(E, r, dtheta, veces) { sumar(E, 'pi', rat(r * dtheta / Math.PI * veces)); }
  function juntar(A, B, signo) { const E = { t: Object.assign({}, A.t), ok: A.ok && B.ok }; for (const [k, q] of Object.entries(B.t)) sumar(E, k, por(q, fr(signo, 1))); return E; }
  const fmtQ = q => (q[1] === 1 ? String(q[0]) : `${q[0]}/${q[1]}`);
  function texto(E) {
    if (!E.ok) return null;
    const claves = Object.keys(E.t).filter(k => E.t[k][0] !== 0);
    const orden = k => (k === 'q' ? -1 : k === 'pi' ? 1e9 : +k.slice(1));
    claves.sort((a, b) => orden(a) - orden(b));
    if (!claves.length) return '0';
    let out = '';
    claves.forEach((k, i) => {
      const q = E.t[k], neg = q[0] < 0, ab = [Math.abs(q[0]), q[1]];
      const sim = k === 'q' ? '' : k === 'pi' ? 'π' : '√' + k.slice(1);
      let c = sim && ab[0] === 1 && ab[1] === 1 ? '' : fmtQ(ab);
      if (sim && ab[1] !== 1) c = (ab[0] === 1 ? '' : ab[0]) + sim + '/' + ab[1]; else c = c + sim;
      out += i === 0 ? (neg ? '−' : '') + c : (neg ? ' − ' : ' + ') + c;
    });
    return out;
  }
  function valorDe(E) { let v = 0; for (const [k, q] of Object.entries(E.t)) v += q[0] / q[1] * (k === 'q' ? 1 : k === 'pi' ? Math.PI : Math.sqrt(+k.slice(1))); return v; }
  const empaquetar = (E, v) => ({ valor: limpio(v === undefined ? valorDe(E) : v), exacto: texto(E) });
  const limpio = v => { const r = Math.round(v); return Math.abs(v - r) < 1e-9 ? r : v; };

  // ---------------- geometría plana ----------------
  function recta(o) {
    let a, b, c;
    if (!o || typeof o !== 'object') throw new Error('recta: falta la recta');
    if (o.x !== undefined && o.y === undefined && o.a === undefined) { a = 1; b = 0; c = -o.x; }
    else if (o.y !== undefined && o.x === undefined && o.a === undefined) { a = 0; b = 1; c = -o.y; }
    else if (o.m !== undefined) { a = -o.m; b = 1; c = -(o.n || 0); }
    else if (o.A && o.B) { a = o.B.y - o.A.y; b = o.A.x - o.B.x; c = -(a * o.A.x + b * o.A.y); }
    else if (o.a !== undefined) { a = o.a; b = o.b; c = o.c; }
    else throw new Error('recta: formato desconocido');
    const n = Math.hypot(a, b);
    if (n < EPS) throw new Error('recta: los dos puntos coinciden');
    a /= n; b /= n; c /= n;
    if (a < -EPS || (Math.abs(a) <= EPS && b < 0)) { a = -a; b = -b; c = -c; }
    return { a: Math.abs(a) <= EPS ? 0 : a, b: Math.abs(b) <= EPS ? 0 : b, c };
  }
  const val = (r, P) => r.a * P.x + r.b * P.y + r.c;
  // Isometrías (y afines): x′ = a·x + b·y + e; y′ = c·x + d·y + f
  const ID = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  const ap = (g, P) => ({ x: g.a * P.x + g.b * P.y + g.e, y: g.c * P.x + g.d * P.y + g.f });
  const comp = (h, g) => ({ a: h.a * g.a + h.b * g.c, b: h.a * g.b + h.b * g.d, c: h.c * g.a + h.d * g.c, d: h.c * g.b + h.d * g.d,
    e: h.a * g.e + h.b * g.f + h.e, f: h.c * g.e + h.d * g.f + h.f });
  function inv(g) {
    const det = g.a * g.d - g.b * g.c;
    const a = g.d / det, b = -g.b / det, c = -g.c / det, d = g.a / det;
    return { a, b, c, d, e: -(a * g.e + b * g.f), f: -(c * g.e + d * g.f) };
  }
  function reflexion(r) { // P − 2(a x + b y + c)(a, b)
    return { a: 1 - 2 * r.a * r.a, b: -2 * r.a * r.b, c: -2 * r.a * r.b, d: 1 - 2 * r.b * r.b, e: -2 * r.a * r.c, f: -2 * r.b * r.c };
  }
  function signoMueve(r, mueve) {
    if (mueve === 'derecha' || mueve === 'izquierda') { if (Math.abs(r.a) < EPS) throw new Error('doblez: una recta horizontal no tiene «derecha» ni «izquierda»'); return (mueve === 'derecha' ? 1 : -1) * Math.sign(r.a); }
    if (mueve === 'arriba' || mueve === 'abajo') { if (Math.abs(r.b) < EPS) throw new Error('doblez: una recta vertical no tiene «arriba» ni «abajo»'); return (mueve === 'arriba' ? 1 : -1) * Math.sign(r.b); }
    throw new Error('doblez: mueve debe ser derecha, izquierda, arriba o abajo');
  }
  // recorta un polígono convexo (o cualquiera, contra un semiplano) y deja la parte con s·(a x + b y + c) ≥ 0
  function recortar(poli, r, s) {
    const out = [], n = poli.length;
    for (let i = 0; i < n; i++) {
      const P = poli[i], Q = poli[(i + 1) % n], vp = s * val(r, P), vq = s * val(r, Q);
      if (vp >= -EPS) out.push(P);
      if ((vp > EPS && vq < -EPS) || (vp < -EPS && vq > EPS)) { const t = vp / (vp - vq); out.push({ x: P.x + t * (Q.x - P.x), y: P.y + t * (Q.y - P.y) }); }
    }
    return limpiarPoli(out);
  }
  function limpiarPoli(p) {
    const out = [];
    for (const P of p) if (!out.length || Math.hypot(P.x - out[out.length - 1].x, P.y - out[out.length - 1].y) > 1e-9) out.push(P);
    while (out.length > 1 && Math.hypot(out[0].x - out[out.length - 1].x, out[0].y - out[out.length - 1].y) <= 1e-9) out.pop();
    return out;
  }
  function area(p) { let s = 0; for (let i = 0; i < p.length; i++) { const P = p[i], Q = p[(i + 1) % p.length]; s += P.x * Q.y - Q.x * P.y; } return s / 2; }
  // recorta el polígono sujeto (cualquiera) con un convexo (Sutherland–Hodgman)
  function recortarConvexo(sujeto, ventana) {
    let out = sujeto.slice();
    const ccw = area(ventana) > 0 ? 1 : -1;
    for (let i = 0; i < ventana.length && out.length; i++) {
      const A = ventana[i], B = ventana[(i + 1) % ventana.length];
      const r = { a: -(B.y - A.y) * ccw, b: (B.x - A.x) * ccw, c: 0 }; r.c = -(r.a * A.x + r.b * A.y);
      out = recortar(out, r, 1);
    }
    return out;
  }
  function dentroConvexo(p, P, tol) { // estrictamente dentro (a más de tol del borde)
    const s = area(p) > 0 ? 1 : -1, t = tol === undefined ? 1e-9 : tol;
    for (let i = 0; i < p.length; i++) {
      const A = p[i], B = p[(i + 1) % p.length], L = Math.hypot(B.x - A.x, B.y - A.y);
      if (s * ((B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x)) / L <= t) return false;
    }
    return true;
  }
  function dentroPoli(p, P) { // cualquier polígono simple, por rayos
    let d = false;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const A = p[i], B = p[j];
      if ((A.y > P.y) !== (B.y > P.y) && P.x < (B.x - A.x) * (P.y - A.y) / (B.y - A.y) + A.x) d = !d;
    }
    return d;
  }
  const rect = (x0, x1, y0, y1) => [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];

  // ---------------- cortes ----------------
  function normalizarCorte(c) {
    if (c.tipo === 'rombo') return { tipo: 'poligono', puntos: [{ x: c.centro.x + c.dx, y: c.centro.y }, { x: c.centro.x, y: c.centro.y + c.dy }, { x: c.centro.x - c.dx, y: c.centro.y }, { x: c.centro.x, y: c.centro.y - c.dy }], original: c };
    if (c.tipo === 'circulo' || c.tipo === 'poligono' || c.tipo === 'linea') return Object.assign({ original: c }, c);
    throw new Error('corte: tipo desconocido ' + c.tipo);
  }
  const quita = c => c.tipo !== 'linea';
  function dentroCorte(c, P) {
    if (c.tipo === 'circulo') return Math.hypot(P.x - c.centro.x, P.y - c.centro.y) < c.r - 1e-12;
    if (c.tipo === 'poligono') return dentroPoli(c.puntos, P);
    return false;
  }
  function poliCorte(c, n) { // polígono que aproxima el corte (para recortar y dibujar)
    if (c.tipo === 'poligono') return c.puntos;
    const k = n || 96;
    return Array.from({ length: k }, (_, i) => ({ x: c.centro.x + c.r * Math.cos(2 * Math.PI * i / k), y: c.centro.y + c.r * Math.sin(2 * Math.PI * i / k) }));
  }
  // parámetros t ∈ (0, 1) donde el segmento PQ cruza el borde de un corte
  function crucesSegCorte(P, Q, c) {
    const ts = [];
    if (c.tipo === 'circulo') {
      const dx = Q.x - P.x, dy = Q.y - P.y, fx = P.x - c.centro.x, fy = P.y - c.centro.y;
      const A = dx * dx + dy * dy, B = 2 * (fx * dx + fy * dy), C = fx * fx + fy * fy - c.r * c.r, D = B * B - 4 * A * C;
      if (D > 0) { const s = Math.sqrt(D); ts.push((-B - s) / (2 * A), (-B + s) / (2 * A)); }
    } else if (c.tipo === 'poligono') {
      const p = c.puntos;
      for (let i = 0; i < p.length; i++) { const t = cruceSeg(P, Q, p[i], p[(i + 1) % p.length]); if (t !== null) ts.push(t); }
    }
    return ts.filter(t => t > 1e-12 && t < 1 - 1e-12);
  }
  // t sobre PQ donde corta al segmento AB (o null)
  function cruceSeg(P, Q, A, B) {
    const rx = Q.x - P.x, ry = Q.y - P.y, sx = B.x - A.x, sy = B.y - A.y, den = rx * sy - ry * sx;
    if (Math.abs(den) < 1e-14) return null;
    const t = ((A.x - P.x) * sy - (A.y - P.y) * sx) / den, u = ((A.x - P.x) * ry - (A.y - P.y) * rx) / den;
    return t >= -1e-12 && t <= 1 + 1e-12 && u >= -1e-12 && u <= 1 + 1e-12 ? t : null;
  }
  // ángulos donde la circunferencia corta un segmento
  function angulosCircSeg(c, A, B) {
    const ts = [];
    const dx = B.x - A.x, dy = B.y - A.y, fx = A.x - c.centro.x, fy = A.y - c.centro.y;
    const a = dx * dx + dy * dy, b = 2 * (fx * dx + fy * dy), cc = fx * fx + fy * fy - c.r * c.r, D = b * b - 4 * a * cc;
    if (D >= 0) { const s = Math.sqrt(D); for (const t of [(-b - s) / (2 * a), (-b + s) / (2 * a)]) if (t >= -1e-12 && t <= 1 + 1e-12) ts.push(Math.atan2(A.y + t * dy - c.centro.y, A.x + t * dx - c.centro.x)); }
    return ts;
  }

  // ---------------- doblar ----------------
  function hojaPoli(h) {
    if (!h || !(h.ancho > 0) || !(h.alto > 0)) throw new Error('hoja: se pide { ancho, alto } positivos');
    return rect(0, h.ancho, 0, h.alto);
  }
  function prepararDobleces(dobleces) {
    return (dobleces || []).map((d, i) => { const r = recta(d.recta); return { r, s: signoMueve(r, d.mueve), R: reflexion(r), i }; });
  }
  function doblar(hoja, dobleces) {
    const D = prepararDobleces(dobleces);
    let celdas = [{ poli: hojaPoli(hoja), g: ID, hist: [], z: [0] }];
    for (const d of D) {
      const quedan = [], van = [];
      for (const c of celdas) {
        // semiplano en la hoja: s·val(r, g(P)) ≥ 0 es la parte que se mueve
        const rg = { a: d.r.a * c.g.a + d.r.b * c.g.c, b: d.r.a * c.g.b + d.r.b * c.g.d, c: d.r.a * c.g.e + d.r.b * c.g.f + d.r.c };
        const mov = recortar(c.poli, rg, d.s), qd = recortar(c.poli, rg, -d.s);
        if (qd.length >= 3 && Math.abs(area(qd)) > 1e-9) quedan.push({ poli: qd, g: c.g, hist: c.hist.concat(false), z: c.z.slice() });
        if (mov.length >= 3 && Math.abs(area(mov)) > 1e-9) van.push({ poli: mov, g: comp(d.R, c.g), hist: c.hist.concat(true), z: c.z.slice() });
      }
      celdas = quedan.concat(van.reverse());
      celdas.forEach((c, k) => c.z.push(k));
    }
    celdas.forEach(c => { c.img = c.poli.map(P => ap(c.g, P)); c.cara = Math.sign(c.g.a * c.g.d - c.g.b * c.g.c); });
    const todos = celdas.flatMap(c => c.img);
    const caja = [Math.min(...todos.map(P => P.x)), Math.max(...todos.map(P => P.x)), Math.min(...todos.map(P => P.y)), Math.max(...todos.map(P => P.y))].map(limpio);
    // capas: el máximo en una rejilla fina del paquete
    let capas = 0;
    const h = Math.max(caja[1] - caja[0], caja[3] - caja[2]) / 61;
    const lados = celdas.map(c => { const s = area(c.img) > 0 ? 1 : -1; return c.img.map((A, i) => { const B = c.img[(i + 1) % c.img.length]; return [A.x, A.y, s * (B.x - A.x), s * (B.y - A.y)]; }); });
    for (let x = caja[0] + h * 0.513; x < caja[1]; x += h) for (let y = caja[2] + h * 0.487; y < caja[3]; y += h) {
      let n = 0; for (const L of lados) if (L.every(([ax, ay, dx, dy]) => dx * (y - ay) - dy * (x - ax) > 1e-9)) n++;
      if (n > capas) capas = n;
    }
    return { celdas, capas, caja };
  }
  function capasEn(hoja, dobleces, P) {
    const { celdas } = doblar(hoja, dobleces);
    return celdas.filter(c => dentroConvexo(c.img, P)).length;
  }
  function pose(celda, dobleces, etapa, t) {
    const D = prepararDobleces(dobleces);
    let M = ID;
    for (let i = 0; i < Math.min(etapa, D.length); i++) if (celda.hist[i]) M = comp(D[i].R, M);
    let mueve = false, alto = 0;
    if (etapa < D.length && celda.hist[etapa] && t > 0) {
      const { r } = D[etapa], k = 1 - Math.cos(Math.PI * Math.max(0, Math.min(1, t)));
      const F = { a: 1 - k * r.a * r.a, b: -k * r.a * r.b, c: -k * r.a * r.b, d: 1 - k * r.b * r.b, e: -k * r.a * r.c, f: -k * r.b * r.c };
      const cen = celda.poli.reduce((s, P) => ({ x: s.x + P.x / celda.poli.length, y: s.y + P.y / celda.poli.length }), { x: 0, y: 0 });
      alto = Math.sin(Math.PI * t) * Math.abs(val(r, ap(M, cen)));
      M = comp(F, M); mueve = true;
    }
    return Object.assign({}, M, { mueve, alto });
  }

  // ---------------- desplegar ----------------
  // ¿el segmento AB (de una celda) está sobre el borde de la hoja?
  function sobreBorde(A, B, W, H) {
    const t = 1e-9;
    return (Math.abs(A.x) < t && Math.abs(B.x) < t) || (Math.abs(A.x - W) < t && Math.abs(B.x - W) < t) || (Math.abs(A.y) < t && Math.abs(B.y) < t) || (Math.abs(A.y - H) < t && Math.abs(B.y - H) < t);
  }
  // partes del segmento PQ que cumplen dentro(punto medio); los cortes en ts (más 0 y 1)
  function tramos(P, Q, ts, dentro) {
    const s = [0, 1].concat(ts.filter(t => t > 0 && t < 1)).sort((a, b) => a - b), out = [];
    for (let i = 0; i + 1 < s.length; i++) {
      if (s[i + 1] - s[i] < 1e-12) continue;
      const m = (s[i] + s[i + 1]) / 2, M = { x: P.x + m * (Q.x - P.x), y: P.y + m * (Q.y - P.y) };
      if (dentro(M)) out.push([{ x: P.x + s[i] * (Q.x - P.x), y: P.y + s[i] * (Q.y - P.y) }, { x: P.x + s[i + 1] * (Q.x - P.x), y: P.y + s[i + 1] * (Q.y - P.y) }]);
    }
    return out;
  }
  function crucesPoli(P, Q, poli) { const ts = []; for (let i = 0; i < poli.length; i++) { const t = cruceSeg(P, Q, poli[i], poli[(i + 1) % poli.length]); if (t !== null) ts.push(t); } return ts; }
  // borde de un corte que cae dentro de la celda (imagen convexa) y fuera de los otros cortes: suma al exacto
  function bordeCorteEnCelda(E, c, img, otros, veces) {
    const dentro = M => dentroConvexo(img, M) && !otros.some(o => dentroCorte(o, M));
    if (c.tipo === 'circulo') {
      let angs = [];
      for (let i = 0; i < img.length; i++) angs = angs.concat(angulosCircSeg(c, img[i], img[(i + 1) % img.length]));
      for (const o of otros) if (o.tipo === 'poligono') for (let i = 0; i < o.puntos.length; i++) angs = angs.concat(angulosCircSeg(c, o.puntos[i], o.puntos[(i + 1) % o.puntos.length]));
      angs = angs.map(a => (a + 2 * Math.PI) % (2 * Math.PI)).sort((a, b) => a - b);
      if (!angs.length) angs = [0];
      angs.push(angs[0] + 2 * Math.PI);
      let largo = 0;
      for (let i = 0; i + 1 < angs.length; i++) {
        const d = angs[i + 1] - angs[i]; if (d < 1e-12) continue;
        const m = (angs[i] + angs[i + 1]) / 2;
        if (dentro({ x: c.centro.x + c.r * Math.cos(m), y: c.centro.y + c.r * Math.sin(m) })) { sumarArco(E, c.r, d, veces); largo += c.r * d * veces; }
      }
      return largo;
    }
    const segs = c.tipo === 'linea' ? [[c.A, c.B]] : c.puntos.map((P, i) => [P, c.puntos[(i + 1) % c.puntos.length]]);
    let largo = 0;
    for (const [P, Q] of segs) {
      let ts = crucesPoli(P, Q, img);
      for (const o of otros) ts = ts.concat(crucesSegCorte(P, Q, o));
      for (const [A, B] of tramos(P, Q, ts, dentro)) { sumarLargo(E, B.x - A.x, B.y - A.y, veces); largo += Math.hypot(B.x - A.x, B.y - A.y) * veces; }
    }
    return largo;
  }
  // tramos del segmento PQ (en el paquete) que caen dentro de algún corte que quita papel
  function dentroDeCortes(E, P, Q, cortes, veces) {
    let ts = [];
    for (const c of cortes) ts = ts.concat(crucesSegCorte(P, Q, c));
    let largo = 0;
    for (const [A, B] of tramos(P, Q, ts, M => cortes.some(c => dentroCorte(c, M)))) { sumarLargo(E, B.x - A.x, B.y - A.y, veces); largo += Math.hypot(B.x - A.x, B.y - A.y) * veces; }
    return largo;
  }
  function perimetroDe(hoja, celdas, cortes, filtro, modo) {
    const W = hoja.ancho, H = hoja.alto, region = cortes.filter(quita), lineas = cortes.filter(c => !quita(c));
    const E = nuevoExacto(); let v = 0;
    sumar(E, 'q', rat(2 * (W + H))); v += 2 * (W + H);
    celdas.forEach((ce, k) => {
      if (!filtro(ce, k)) return;
      region.forEach((c, j) => { v += bordeCorteEnCelda(E, c, ce.img, region.filter((_, i) => i !== j), 1); });
      lineas.forEach(c => { v += bordeCorteEnCelda(E, c, ce.img, region, 2); });
      for (let i = 0; i < ce.poli.length; i++) {
        const A = ce.poli[i], B = ce.poli[(i + 1) % ce.poli.length], borde = sobreBorde(A, B, W, H);
        if (borde && modo !== 'sinRestar') v += dentroDeCortes(E, ap(ce.g, A), ap(ce.g, B), region, -1);
        if (!borde && modo === 'tramos') v += dentroDeCortes(E, ap(ce.g, A), ap(ce.g, B), region, 1);
      }
    });
    return empaquetar(E, v);
  }
  // perímetro de la figura completa de un corte (para «cada capa da la figura entera»)
  function perimetroCorte(c, E) {
    if (c.tipo === 'circulo') { sumarArco(E, c.r, 2 * Math.PI, 1); return 2 * Math.PI * c.r; }
    if (c.tipo === 'linea') { sumarLargo(E, c.B.x - c.A.x, c.B.y - c.A.y, 2); return 2 * Math.hypot(c.B.x - c.A.x, c.B.y - c.A.y); }
    let v = 0; c.puntos.forEach((P, i) => { const Q = c.puntos[(i + 1) % c.puntos.length]; sumarLargo(E, Q.x - P.x, Q.y - P.y, 1); v += Math.hypot(Q.x - P.x, Q.y - P.y); });
    return v;
  }
  function tocaCelda(c, img) { // el corte quita (o tajea) algo de esa capa
    if (c.tipo === 'linea') return tramos(c.A, c.B, crucesPoli(c.A, c.B, img), M => dentroConvexo(img, M)).length > 0;
    const p = recortarConvexo(poliCorte(c, 192), img);
    return p.length >= 3 && Math.abs(area(p)) > 1e-6;
  }
  // Rejilla fina de la hoja: qué queda, qué se quitó y qué está unido con qué (conteo por fuerza bruta)
  // datos de la rejilla que no dependen del filtro: en qué celda cae cada punto, adónde va al doblar, si cae en un
  // corte que quita papel y si entre él y su vecino de la derecha (o de arriba) pasa un tajo
  function baseRejilla(hoja, celdas, cortes) {
    const W = hoja.ancho, H = hoja.alto, h = Math.max(1 / 16, Math.max(W, H) / 320);
    const nx = Math.round(W / h), ny = Math.round(H / h), N = nx * ny, ox = h * 0.5 + h * 0.0123, oy = h * 0.5 + h * 0.0071;
    const region = cortes.filter(quita), lineas = cortes.filter(c => !quita(c));
    const lados = celdas.map(c => { const s = area(c.poli) > 0 ? 1 : -1; return c.poli.map((A, i) => { const B = c.poli[(i + 1) % c.poli.length]; return [A.x, A.y, s * (B.x - A.x), s * (B.y - A.y)]; }); });
    const enCelda = (k, x, y) => lados[k].every(([ax, ay, dx, dy]) => dx * (y - ay) - dy * (x - ax) >= -1e-12);
    const celda = new Int32Array(N), enCorte = new Uint8Array(N), F = new Float64Array(2 * N);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const id = j * nx + i, x = i * h + ox, y = j * h + oy;
      let k = 0; while (k < celdas.length - 1 && !enCelda(k, x, y)) k++;
      celda[id] = k;
      const Q = ap(celdas[k].g, { x, y }); F[2 * id] = Q.x; F[2 * id + 1] = Q.y;
      enCorte[id] = region.some(c => dentroCorte(c, Q)) ? 1 : 0;
    }
    const cruza = (p, q) => { const P = { x: F[2 * p], y: F[2 * p + 1] }, Q = { x: F[2 * q], y: F[2 * q + 1] }; return lineas.some(c => cruceSeg(P, Q, c.A, c.B) !== null); };
    const der = new Uint8Array(N), arr = new Uint8Array(N);
    if (lineas.length) for (let p = 0; p < N; p++) { const i = p % nx; if (i < nx - 1) der[p] = cruza(p, p + 1) ? 1 : 0; if (p + nx < N) arr[p] = cruza(p, p + nx) ? 1 : 0; }
    return { h, nx, ny, N, celda, enCorte, der, arr, celdas };
  }
  function rejilla(B, filtro, separarCapas) {
    const { h, nx, ny, N, celda, enCorte, der, arr, celdas } = B;
    const corta = celdas.map((c, k) => !!filtro(c, k));
    const quitado = new Uint8Array(N);
    for (let p = 0; p < N; p++) quitado[p] = enCorte[p] && corta[celda[p]] ? 1 : 0;
    const unidos = (p, q) => {
      if (quitado[p] || quitado[q]) return false;
      if (separarCapas && celda[p] !== celda[q]) return false;
      const a = Math.min(p, q), b = Math.max(p, q), tajo = b === a + 1 ? der[a] : arr[a];
      return !(tajo && (corta[celda[p]] || corta[celda[q]]));
    };
    // piezas
    const pieza = new Int32Array(N).fill(-1), piezas = [];
    for (let s = 0; s < N; s++) {
      if (quitado[s] || pieza[s] >= 0) continue;
      const id = piezas.length, pila = [s]; pieza[s] = id;
      let n = 0, x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      while (pila.length) {
        const p = pila.pop(), i = p % nx, j = (p - i) / nx; n++;
        if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j;
        if (i > 0 && pieza[p - 1] < 0 && unidos(p, p - 1)) { pieza[p - 1] = id; pila.push(p - 1); }
        if (i < nx - 1 && pieza[p + 1] < 0 && unidos(p, p + 1)) { pieza[p + 1] = id; pila.push(p + 1); }
        if (j > 0 && pieza[p - nx] < 0 && unidos(p, p - nx)) { pieza[p - nx] = id; pila.push(p - nx); }
        if (j < ny - 1 && pieza[p + nx] < 0 && unidos(p, p + nx)) { pieza[p + nx] = id; pila.push(p + nx); }
      }
      piezas.push({ area: limpio(n * h * h), ancho: limpio((x1 - x0 + 1) * h), alto: limpio((y1 - y0 + 1) * h) });
    }
    // huecos
    const hueco = new Int32Array(N).fill(-1); let agujeros = 0, muescas = 0; const detalle = [];
    for (let s = 0; s < N; s++) {
      if (!quitado[s] || hueco[s] >= 0) continue;
      const pila = [s]; hueco[s] = 1; let borde = false, n = 0; const cs = new Set();
      while (pila.length) {
        const p = pila.pop(), i = p % nx, j = (p - i) / nx; n++; cs.add(celda[p]);
        if (i === 0 || j === 0 || i === nx - 1 || j === ny - 1) borde = true;
        for (const q of [i > 0 ? p - 1 : -1, i < nx - 1 ? p + 1 : -1, j > 0 ? p - nx : -1, j < ny - 1 ? p + nx : -1]) if (q >= 0 && quitado[q] && hueco[q] < 0) { hueco[q] = 1; pila.push(q); }
      }
      if (borde) muescas++; else { agujeros++; detalle.push({ celdas: cs.size, area: n * h * h }); }
    }
    return { piezas, agujeros, muescas, detalle, h, nx, ny, pieza };
  }
  function desplegar(hoja, dobleces, cortesIn) {
    const cortes = (cortesIn || []).map(normalizarCorte);
    const { celdas, capas, caja } = doblar(hoja, dobleces);
    const nD = (dobleces || []).length;
    const todos = () => true;
    const B = baseRejilla(hoja, celdas, cortes), R = rejilla(B, todos, false);
    const copias = cortes.map(c => celdas.filter(ce => tocaCelda(c, ce.img)).length);
    const tol = R.h * R.h * 2;
    const cuadradas = R.piezas.filter(p => Math.abs(p.ancho - p.alto) < R.h / 2 && Math.abs(p.area - p.ancho * p.alto) < tol).length;
    const resumen = filtro => { const r = rejilla(B, filtro, false); return { agujeros: r.agujeros, muescas: r.muescas, piezas: r.piezas.length, perimetro: perimetroDe(hoja, celdas, cortes, filtro, '') }; };
    const quieta = ce => ce.hist.every(b => !b);
    const enteroE = nuevoExacto(); sumar(enteroE, 'q', rat(2 * (hoja.ancho + hoja.alto)));
    let enteroV = 2 * (hoja.ancho + hoja.alto);
    cortes.forEach((c, j) => { for (let n = 0; n < copias[j]; n++) enteroV += perimetroCorte(c, enteroE); });
    const errores = {
      unaCapa: resumen(quieta),
      soloDoblez: Array.from({ length: nD }, (_, i) => resumen(ce => ce.hist.every((b, j) => !b || j === i))),
      sinRestarBorde: perimetroDe(hoja, celdas, cortes, todos, 'sinRestar'),
      tramosDelDoblez: perimetroDe(hoja, celdas, cortes, todos, 'tramos'),
      enteroPorCapa: { agujeros: copias.reduce((a, b) => a + b, 0), perimetro: empaquetar(enteroE, enteroV) },
      sinUniones: rejilla(B, todos, true).piezas.length,
      cortesComoPiezas: cortes.reduce((s, c, j) => s + (quita(c) ? 0 : copias[j]), 0)
    };
    // para el dibujo: huecos y tajos de cada celda, en la hoja
    const centro = p => { let A = 0, x = 0, y = 0; p.forEach((P, i) => { const Q = p[(i + 1) % p.length], w = P.x * Q.y - Q.x * P.y; A += w; x += (P.x + Q.x) * w; y += (P.y + Q.y) * w; }); return Math.abs(A) < 1e-12 ? p[0] : { x: x / (3 * A), y: y / (3 * A) }; };
    const corridos = [];
    const dib = celdas.map(ce => {
      const gi = inv(ce.g), huecos = [], tajos = [];
      for (const c of cortes) {
        if (quita(c)) {
          const p = recortarConvexo(poliCorte(c, 96), ce.img);
          if (p.length >= 3 && Math.abs(area(p)) > 1e-6) {
            const q = p.map(P => ap(gi, P)); huecos.push(q);
            const a = centro(p), b = centro(q); corridos.push(p.map(P => ({ x: P.x + b.x - a.x, y: P.y + b.y - a.y })));
          }
        } else for (const [A, B] of tramos(c.A, c.B, crucesPoli(c.A, c.B, ce.img), M => dentroConvexo(ce.img, M))) tajos.push([ap(gi, A), ap(gi, B)]);
      }
      return { poli: ce.poli, img: ce.img, hist: ce.hist, z: ce.z, cara: ce.cara, huecos, tajos };
    });
    // trozos: cada celda partida por sus tajos, con el número de pieza al que pertenece (para separar las piezas)
    const ox = R.h * 0.5 + R.h * 0.0123, oy = R.h * 0.5 + R.h * 0.0071;
    const trozos = [];
    dib.forEach((ce, k) => {
      let partes = [ce.poli];
      for (const [A, B] of ce.tajos) { const r = recta({ A, B }); partes = partes.flatMap(p => [recortar(p, r, 1), recortar(p, r, -1)].filter(q => q.length >= 3 && Math.abs(area(q)) > 1e-9)); }
      for (const p of partes) {
        const m = centro(p), i = Math.max(0, Math.min(R.nx - 1, Math.round((m.x - ox) / R.h))), j = Math.max(0, Math.min(R.ny - 1, Math.round((m.y - oy) / R.h)));
        trozos.push({ poli: p, celda: k, pieza: R.pieza[j * R.nx + i] });
      }
    });
    const quietos = dib.filter(ce => ce.hist.every(b => !b));
    const dibujoErrores = {
      unaCapa: quietos.flatMap(ce => ce.huecos),
      soloDoblez: Array.from({ length: nD }, (_, i) => dib.filter(ce => ce.hist.every((b, j) => !b || j === i)).flatMap(ce => ce.huecos)),
      corrida: corridos
    };
    return {
      capas, caja, copias, agujeros: R.agujeros, muescas: R.muescas, piezas: R.piezas.length, piezasCuadradas: cuadradas,
      areas: R.piezas.map(p => p.area).sort((a, b) => b - a), perimetro: perimetroDe(hoja, celdas, cortes, todos, ''),
      agujerosDetalle: R.detalle.map(d => ({ celdas: d.celdas, area: d.area })), errores, celdas: dib, trozos, dibujoErrores
    };
  }

  // ---------------- esquina sobre esquina ----------------
  function esquinaSobreEsquina(a, b) {
    if (!(a > 0 && b > 0) || a < b) throw new Error('esquinaSobreEsquina: se pide a ≥ b > 0');
    const x = (a * a + b * b) / (2 * a), E = { x: limpio(x), y: 0 }, F = { x: limpio(a - x), y: b };
    const ex = nuevoExacto(); sumarLargo(ex, F.x - E.x, F.y - E.y, 1);
    const diag = Math.hypot(a, b);
    return {
      x: limpio(x), resto: limpio(a - x), doblez: limpio(Math.hypot(F.x - E.x, b)), doblezExacto: texto(ex), diagonal: limpio(diag), E, F,
      dobleces: [{ recta: { A: E, B: F }, mueve: 'arriba' }],
      errores: { diagonal: limpio(diag), mitadDiagonal: limpio(diag / 2), ladoCorto: b, xMitad: limpio(a / 2), xHipotenusa: limpio((a * a - b * b) / (2 * a)) }
    };
  }
  function ladoDesdeDoblez(b, L) {
    if (!(L > b && b > 0)) throw new Error('ladoDesdeDoblez: el doblez debe ser mayor que el lado corto');
    const a = b * b / Math.sqrt(L * L - b * b);
    if (a < b - 1e-9) throw new Error('ladoDesdeDoblez: con esos datos el lado «largo» sale menor que b');
    const q = rat(a);
    return { a: limpio(a), exacto: q ? fmtQ(q) : null, errores: { comoDiagonal: limpio(Math.sqrt(L * L - b * b)) } };
  }

  // ---------------- la loseta ----------------
  function loseta(x0, y0) {
    x0 = x0 || 0; y0 = y0 || 0;
    return {
      borde: rect(x0, x0 + 2, y0, y0 + 2),
      marcas: [[{ x: x0, y: y0 + 2 }, { x: x0 + 1, y: y0 + 2 }, { x: x0, y: y0 + 1 }],
               [{ x: x0 + 1.25, y: y0 + 0.25 }, { x: x0 + 1.75, y: y0 + 0.25 }, { x: x0 + 1.75, y: y0 + 1.25 }, { x: x0 + 1.25, y: y0 + 1.25 }]]
    };
  }
  function matriz(t) {
    if (t.tipo === 'central') return { a: -1, b: 0, c: 0, d: -1, e: 2 * t.O.x, f: 2 * t.O.y };
    if (t.tipo === 'eje') return reflexion(recta(t.recta));
    if (t.tipo === 'giro') { const u = t.grados * Math.PI / 180, c = Math.cos(u), s = Math.sin(u); return { a: c, b: -s, c: s, d: c, e: t.O.x - c * t.O.x + s * t.O.y, f: t.O.y - s * t.O.x - c * t.O.y }; }
    if (t.tipo === 'traslacion') return { a: 1, b: 0, c: 0, d: 1, e: t.v.x, f: t.v.y };
    throw new Error('transformar: tipo desconocido');
  }
  const limpioP = P => ({ x: limpio(P.x) + 0, y: limpio(P.y) + 0 });
  function imagen(P, t) { return limpioP(ap(matriz(t), P)); }
  function transformar(L, t) { const g = matriz(t); return { borde: L.borde.map(P => limpioP(ap(g, P))), marcas: L.marcas.map(m => m.map(P => limpioP(ap(g, P)))) }; }
  function mismoPoli(p, q) {
    if (p.length !== q.length) return false;
    const k = (P) => `${Math.round(P.x * 1e6)},${Math.round(P.y * 1e6)}`;
    const a = p.map(k).sort().join(';'), b = q.map(k).sort().join(';');
    return a === b;
  }
  function iguales(L1, L2) { return mismoPoli(L1.borde, L2.borde) && L1.marcas.length === L2.marcas.length && L1.marcas.every((m, i) => mismoPoli(m, L2.marcas[i])); }
  function reflejoEnVertice(x0, y0, O) {
    const L = loseta(x0, y0), cen = { x: x0 + 1, y: y0 + 1 };
    const correcta = transformar(L, { tipo: 'central', O });
    const v = { x: 2 * O.x - 2 * cen.x, y: 2 * O.y - 2 * cen.y };
    const con = M => Object.assign(M, { triangulo: M.marcas[0][0] });
    return {
      original: con(L), correcta: con(correcta),
      errores: {
        ejeVertical: con(transformar(L, { tipo: 'eje', recta: { x: O.x } })),
        ejeHorizontal: con(transformar(L, { tipo: 'eje', recta: { y: O.y } })),
        trasladada: con(transformar(L, { tipo: 'traslacion', v }))
      },
      igualGiro180: iguales(correcta, transformar(L, { tipo: 'giro', O, grados: 180 })),
      igualDosEjes: iguales(correcta, transformar(transformar(L, { tipo: 'eje', recta: { x: O.x } }), { tipo: 'eje', recta: { y: O.y } }))
    };
  }

  // ---------------- fichas de dos caras ----------------
  function validarEstado(s) { if (typeof s !== 'string' || !/^[01]+$/.test(s)) throw new Error('fichas: el estado es un texto de 0 y 1'); }
  function jugadas(n, o) {
    const k = o.k, out = [];
    if (!(k >= 1 && k <= n)) throw new Error('fichas: k debe estar entre 1 y n');
    if (o.contiguas) { for (let i = 0; i + k <= n; i++) out.push(Array.from({ length: k }, (_, j) => i + j)); return out; }
    const rec = (ini, act) => { if (act.length === k) { out.push(act.slice()); return; } for (let i = ini; i < n; i++) { act.push(i); rec(i + 1, act); act.pop(); } };
    rec(0, []);
    return out;
  }
  function aplicar(estado, jugada) { validarEstado(estado); const a = estado.split(''); for (const i of jugada) a[i] = a[i] === '1' ? '0' : '1'; return a.join(''); }
  function voltear(inicio, meta, o) {
    validarEstado(inicio); validarEstado(meta);
    if (inicio.length !== meta.length) throw new Error('fichas: inicio y meta deben tener las mismas fichas');
    const n = inicio.length;
    if (n > 16) throw new Error('fichas: hasta 16 fichas');
    const J = jugadas(n, o), mask = J.map(j => j.reduce((m, i) => m | (1 << i), 0));
    const num = s => s.split('').reduce((m, c, i) => m | (c === '1' ? 1 << i : 0), 0);
    const a = num(inicio), b = num(meta), padre = new Int32Array(1 << n).fill(-1), via = new Int32Array(1 << n);
    padre[a] = a; const cola = [a];
    for (let q = 0; q < cola.length && padre[b] < 0; q++) {
      const s = cola[q];
      for (let j = 0; j < mask.length; j++) { const t = s ^ mask[j]; if (padre[t] < 0) { padre[t] = s; via[t] = j; cola.push(t); } }
    }
    const diferentes = inicio.split('').filter((c, i) => c !== meta[i]).length;
    const kPar = o.k % 2 === 0, cuenta = s => s.split('').filter(c => c === '1').length;
    const res = {
      diferentes,
      errores: { unoPorUno: diferentes, dividir: Math.ceil(diferentes / o.k), cadaGrupo: o.contiguas ? n - o.k + 1 : null },
      paridad: { kPar, iguales: cuenta(inicio) % 2 === cuenta(meta) % 2 }
    };
    if (padre[b] < 0) return Object.assign({ posible: false, minimo: null, camino: [] }, res);
    const camino = [];
    for (let s = b; s !== a; s = padre[s]) camino.unshift(J[via[s]]);
    return Object.assign({ posible: true, minimo: camino.length, camino }, res);
  }

  // azar con semilla para las pruebas (mulberry32)
  function azar(semilla) {
    let a = semilla >>> 0;
    return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  return {
    recta, doblar, capasEn, desplegar, pose,
    esquinaSobreEsquina, ladoDesdeDoblez,
    loseta, transformar, imagen, iguales, reflejoEnVertice,
    jugadas, aplicar, voltear,
    azar,
    _interno: { reflexion, ap, comp, inv, area, recortarConvexo, dentroConvexo, poliCorte }
  };
});
