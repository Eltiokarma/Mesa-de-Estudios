/*
 * Motor de «El espejo en la cuadrícula»: simetría respecto de una recta, de un punto y de un plano.
 *
 * Aquí vive toda la geometría de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorSimetria) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * CONVENCIONES
 *   Puntos del plano: { x, y }, con el eje y hacia arriba. Puntos del espacio: { x, y, z }.
 *   Ángulos en grados, medidos desde el eje x en sentido antihorario.
 *   Una recta se puede dar de varias formas (todas las funciones aceptan cualquiera):
 *     { A:{x,y}, B:{x,y} }   la recta que pasa por A y B
 *     { punto:{x,y}, angulo } la recta que pasa por el punto con esa dirección
 *     { m, n }               y = m·x + n
 *     { x: k } o { y: k }    la recta vertical x = k o la horizontal y = k
 *     { a, b, c }            a·x + b·y + c = 0
 *   Un plano del espacio: { normal:{x,y,z}, d } con normal·P = d, o { punto, normal }.
 *   Números «limpios»: lo que está a menos de 1e-9 de un entero se devuelve como ese entero.
 *
 * SIMETRÍA RESPECTO DE UNA RECTA (reflexión)
 *   recta(o)                    normaliza la recta: { a, b, c } con a² + b² = 1, más { punto, angulo } (angulo en [0, 180))
 *   reflejar(P, r)              P′ simétrico de P respecto de r: P′ = 2H − P, con H el pie de la perpendicular.
 *                               Devuelve { P: P′, H, d (distancia de P a r), errores }, con los errores típicos:
 *                                 errores.pie        se queda en H (la mitad del camino)
 *                                 errores.vertical   va en vertical hasta la recta y sigue otro tanto (no en perpendicular);
 *                                                    null si r es vertical
 *                                 errores.horizontal lo mismo en horizontal; null si r es horizontal
 *                                 errores.intercambia cambia x por y (lo que vale solo para y = x)
 *   reflejarFigura(pts, r)      la lista de puntos reflejada
 *   pliegue(P, r, t)            el punto a la fracción t ∈ [0, 1] del doblez: H + (P − H)·cos(π·t). En t = 1 es P′.
 *                               Sirve para animar el espejo que dobla la figura.
 *   efe(o) / reflejoEfe(o)     la letra F de los pasos 1 y 7 y lo que pasa con ella al reflejarla en la recta vertical
 *                               x = o.espejo. o = { tallo, alto, larga, corta, espejo } (por defecto tallo en x = 2,
 *                               alto 4, larga 3, corta 2, espejo 0). La F: tallo de (tallo; 0) a (tallo; alto); barra larga
 *                               de (tallo; alto) a (tallo + larga; alto); barra corta de (tallo; alto/2) a
 *                               (tallo + corta; alto/2). reflejoEfe devuelve { apunta:'izquierda'|'derecha' (hacia dónde
 *                               salen las barras), larga:'arriba'|'abajo', puntos, original, errores:{ copia (corrida sin
 *                               voltear), giro180 (media vuelta alrededor de (espejo; 0)), horizontal (volteada de arriba
 *                               abajo y corrida) } }, cada error con { apunta, larga, puntos }.
 *
 * SIMETRÍA RESPECTO DE UN PUNTO (simetría central)
 *   central(P, O)               P′ = 2O − P (O es el punto medio de PP′). errores: reflejo en la recta vertical u
 *                               horizontal que pasa por O y giro de 90° alrededor de O (antihorario)
 *   girar(P, O, grados)         giro alrededor de O (antihorario si grados > 0)
 *   trasladar(P, v)             P + v
 *   orientacion(pts)            'antihorario' | 'horario' | 'degenerado' según el área con signo del polígono
 *   areaConSigno(pts)           fórmula del zapatero (positiva si va en sentido antihorario)
 *   centralTriangulo(pts, O)    el triángulo simétrico respecto de O y su sentido; errores con lo que da cada
 *                               confusión (reflejo en una recta por O, giro de 90°): { puntos, sentido }
 *
 * DOS REFLEXIONES SEGUIDAS
 *   componer(r1, r2)            primero r1 y después r2. Si son paralelas: traslación perpendicular a ellas de
 *                               módulo 2·(distancia), en el sentido de r1 hacia r2: { tipo:'traslacion', vector,
 *                               distancia, modulo }. Si se cortan en Q formando el ángulo θ (de r1 a r2, en
 *                               (−90°, 90°]): giro alrededor de Q de 2θ: { tipo:'giro', centro, theta, angulo }.
 *                               Si coinciden: { tipo:'identidad' }. errores: sinDuplicar (d o θ), tercerEspejo
 *                               (cree que sale otra reflexión) y vuelveAlInicio (cree que se cancelan).
 *   aplicarDos(P, r1, r2)       reflejar(reflejar(P, r1), r2): cálculo independiente de componer
 *
 * EJES Y CENTRO DE SIMETRÍA DE UNA FIGURA PLANA
 *   figura(nombre, ...)         figuras de ejemplo como { segmentos:[[P, Q], …], nombre }:
 *                               'rectangulo'(b, h), 'cuadrado'(l), 'rombo'(d1, d2), 'romboide'(b, h, corrimiento),
 *                               'equilatero'(l), 'isosceles'(base, altura), 'escaleno'() con vértices fijos (0; 0), (6; 0) y (1; 3),
 *                               'trapecio'(B, b, h) isósceles, 'trapecioRecto'(B, b, h), 'regular'(n, R),
 *                               'letra'(L) con L en A, E, H, I, N, S, T, U, X, Z, 'segmentos'([[[x1, y1], [x2, y2]], …])
 *                               con segmentos libres, y 'circunferencia'(R) → { circunferencia, R }.
 *                               Las letras se trazan con segmentos sobre la cuadrícula (puntos [x, y]):
 *                                 A: (0;0)-(2;4), (2;4)-(4;0), (1;2)-(3;2)          E: (0;0)-(0;4), (0;4)-(3;4), (0;2)-(2;2), (0;0)-(3;0)
 *                                 H: (0;0)-(0;4), (3;0)-(3;4), (0;2)-(3;2)          I: (0;4)-(2;4), (1;4)-(1;0), (0;0)-(2;0)
 *                                 N: (0;0)-(0;4), (0;4)-(3;0), (3;0)-(3;4)  (caja 3 × 4)
 *                                 S: quebrada (3;4), (0;4), (0;2), (3;2), (3;0), (0;0)   T: (0;4)-(4;4), (2;4)-(2;0)
 *                                 U: quebrada (0;4), (0;0), (3;0), (3;4)              Z: quebrada (0;4), (3;4), (0;0), (3;0)
 *                                 X: (0;0)-(3;4), (0;4)-(3;0)  (caja 3 × 4, NO cuadrada: por eso 2 ejes; en caja cuadrada
 *                                    serían 4, porque las diagonales de la caja también serían ejes)
 *   poligono(pts)               un polígono cerrado (lista de vértices) como figura de segmentos
 *   girarFigura(fig, grados, O) la figura girada (por defecto alrededor de su centro de puntos)
 *   simetrias(fig)              { ejes:[{ punto, angulo }], numEjes, centro:{x,y}|null, tieneCentro, G }.
 *                               Busca por fuerza bruta: todo eje pasa por G (el promedio de los extremos distintos de
 *                               los segmentos) y lleva un extremo P0 a otro extremo Q; se prueba cada candidato
 *                               (la mediatriz de P0Q, o la recta GP0 si Q = P0) reflejando todos los segmentos.
 *                               Para la circunferencia: numEjes = 'infinitos' y centro en (0, 0).
 *   coincide(fig, r)            ¿la figura reflejada en r cae sobre sí misma? (para el espejo que gira)
 *   prediccionEjes(fig)         { ejes, centro, errores } con los errores típicos para predicciones:
 *                                 conDiagonales   ejes + las diagonales que no son ejes (solo cuadriláteros)
 *                                 unoPorLado      el número de lados (solo polígonos)
 *                                 dobleCuenta     2·ejes (cuenta por separado los dos extremos de cada eje)
 *                                 soloRectos      cuántos ejes son horizontales o verticales tal como está dibujada
 *                                                 (lee la figura por su posición: GE9)
 *                                 soloVertical    cuántos ejes son verticales tal como está dibujada (solo «el del medio»)
 *                                 ninguno         0 (cree que la figura no tiene ejes); solo si en verdad tiene alguno
 *
 * SIMETRÍA RESPECTO DE UN PLANO (en el espacio)
 *   simetricoEspacio(P, plano)  { P: P′, H (pie), d, errores: { pie, centralOrigen (−P), ejeNormal (simétrico respecto de la
 *                               recta normal al plano por el origen) } }
 *   poliedro(nombre, ...)       { vertices, lista (aristas como pares de índices), caras, aristas } para
 *                               'prismaRegular'(n, lado, h) (base: polígono regular de n lados centrado en el eje z), 'cubo'(a), 'caja'(a, b, c), 'prismaCuadrado'(a, h),
 *                               'tetraedro'(a) regular y 'piramideCuadrada'(a, h)
 *   reflejarEnPlano(P, plano)   el simétrico de P respecto del plano
 *   planos(poli)                { planos:[{ normal, d }], numPlanos, G }: fuerza bruta con los planos mediadores de
 *                               pares de vértices y los planos que pasan por G y dos vértices
 *   prediccionPlanos(poli)      { planos, errores: { soloCaras (paralelos a las caras), unoPorCara, unoPorArista,
 *                               comoCubo (9), comoPrisma (5, el
 *                               prisma de base cuadrada) } } (las caras y aristas se cuentan del poliedro convexo)
 *   seccion(poli, plano)        el corte del poliedro con el plano: polígono ordenado (para dibujar el plano)
 *   girar3D(P, grados, C)       giro alrededor de la recta vertical (eje z) que pasa por C (por defecto el origen)
 *   quiralidad(u, v, w)         'derecha' | 'izquierda' según el signo del producto mixto u·(v × w)
 *                               (pulgar u, índice v, medio w: la mano derecha da 'derecha')
 *   manoEnEspejo(mano, plano)   { imagen, trasGiro, errores } para mano = { pulgar, indice, medio } (vectores):
 *                               imagen = quiralidad del reflejo; trasGiro = quiralidad del reflejo después de girarlo
 *                               media vuelta alrededor del eje vertical z (un giro no cambia la mano); errores.copia
 *                               y errores.giroLaVuelve = la original. La mano derecha de la escena: pulgar (0; 0; 1)
 *                               hacia arriba, índice (0; 1; 0) hacia el espejo y medio (−1; 0; 0) hacia la izquierda.
 *
 * Cada resultado de predicción trae 'errores' con lo que da cada idea errónea. Ninguna sale del informe
 * docs/investigacion/geometria-ideas-erroneas.md salvo soloRectos (GE9, figura prototípica, parcial): las demás
 * son hipótesis nuestras.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorSimetria = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-7;
  const RAD = Math.PI / 180;
  const limpio = x => (Math.abs(x) < 1e-12 ? 0 : Math.abs(x - Math.round(x)) < 1e-9 ? Math.round(x) : x);
  const num = (x, que) => {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x;
  };
  const pto = (P, que) => {
    if (!P || typeof P !== 'object') throw new Error(`${que || 'el punto'} debe ser { x, y }`);
    return { x: num(P.x, `${que || 'el punto'}.x`), y: num(P.y, `${que || 'el punto'}.y`) };
  };
  const L = P => ({ x: limpio(P.x), y: limpio(P.y) });
  const igual = (P, Q, t) => Math.abs(P.x - Q.x) <= (t || TOL) && Math.abs(P.y - Q.y) <= (t || TOL);
  const n180 = a => { let r = ((a % 180) + 180) % 180; if (Math.abs(r - 180) < 1e-9) r = 0; return limpio(r); };

  // ================= Rectas =================
  function recta(o) {
    if (!o || typeof o !== 'object') throw new Error('falta la recta');
    let a, b, c;
    if (o.A && o.B) {
      const A = pto(o.A, 'A'), B = pto(o.B, 'B');
      if (igual(A, B, 1e-12)) throw new Error('A y B coinciden: no definen una recta');
      a = A.y - B.y; b = B.x - A.x; c = -(a * A.x + b * A.y);
    } else if (o.punto && o.angulo !== undefined) {
      const P = pto(o.punto, 'punto'), t = num(o.angulo, 'angulo') * RAD;
      a = Math.sin(t); b = -Math.cos(t); c = -(a * P.x + b * P.y);
    } else if (o.m !== undefined) {
      a = num(o.m, 'm'); b = -1; c = num(o.n === undefined ? 0 : o.n, 'n');
    } else if (o.a !== undefined || o.b !== undefined) {
      a = num(o.a || 0, 'a'); b = num(o.b || 0, 'b'); c = num(o.c || 0, 'c');
    } else if (o.x !== undefined && o.y === undefined) {
      a = 1; b = 0; c = -num(o.x, 'x');
    } else if (o.y !== undefined && o.x === undefined) {
      a = 0; b = 1; c = -num(o.y, 'y');
    } else throw new Error('no se reconoce la recta');
    const n = Math.hypot(a, b);
    if (n < 1e-12) throw new Error('a y b no pueden ser los dos 0');
    a /= n; b /= n; c /= n;
    // forma canónica: primer coeficiente no nulo positivo
    if (a < -1e-12 || (Math.abs(a) <= 1e-12 && b < 0)) { a = -a; b = -b; c = -c; }
    const punto = { x: limpio(-a * c), y: limpio(-b * c) };          // el pie desde el origen
    const angulo = n180(Math.atan2(a, -b) / RAD);                    // dirección (−b, a)
    return { a: limpio(a), b: limpio(b), c: limpio(c), punto, angulo, dir: { x: -b, y: a } };
  }
  const R = o => (o && o.dir && o.a !== undefined ? o : recta(o));
  const distanciaFirmada = (P, r) => r.a * P.x + r.b * P.y + r.c;

  function pie(P, r) {
    const s = distanciaFirmada(P, r);
    return { x: P.x - s * r.a, y: P.y - s * r.b };
  }
  function reflejar(P, ro) {
    P = pto(P); const r = R(ro);
    const H = pie(P, r), Pp = { x: 2 * H.x - P.x, y: 2 * H.y - P.y };
    const err = { pie: L(H), intercambia: L({ x: P.y, y: P.x }), vertical: null, horizontal: null };
    if (Math.abs(r.b) > 1e-12) { const yr = -(r.a * P.x + r.c) / r.b; err.vertical = L({ x: P.x, y: 2 * yr - P.y }); }
    if (Math.abs(r.a) > 1e-12) { const xr = -(r.b * P.y + r.c) / r.a; err.horizontal = L({ x: 2 * xr - P.x, y: P.y }); }
    return { P: L(Pp), H: L(H), d: limpio(Math.abs(distanciaFirmada(P, r))), errores: err };
  }
  const reflejarFigura = (pts, r) => pts.map(P => reflejar(P, r).P);
  function pliegue(P, ro, t) {
    P = pto(P); const r = R(ro); const H = pie(P, r), k = Math.cos(Math.PI * Math.max(0, Math.min(1, num(t, 't'))));
    return L({ x: H.x + (P.x - H.x) * k, y: H.y + (P.y - H.y) * k });
  }

  // ================= La letra F de los pasos 1 y 7 =================
  // Tallo vertical de (x; 0) a (x; alto); barra larga arriba, de (x; alto) a (x + larga; alto); barra corta a media
  // altura, de (x; alto/2) a (x + corta; alto/2). Las barras salen hacia la derecha.
  function efe(o) {
    o = Object.assign({ tallo: 2, alto: 4, larga: 3, corta: 2 }, o);
    const x = num(o.tallo, 'tallo'), h = num(o.alto, 'alto'), a = num(o.larga, 'larga'), b = num(o.corta, 'corta');
    if (!(h > 0 && a > b && b > 0)) throw new Error('la F necesita alto > 0 y larga > corta > 0');
    return { pie: { x, y: 0 }, punta: { x, y: h }, larga: [{ x, y: h }, { x: x + a, y: h }], corta: [{ x, y: h / 2 }, { x: x + b, y: h / 2 }] };
  }
  const mapaEfe = (F, f) => ({ pie: f(F.pie), punta: f(F.punta), larga: F.larga.map(f), corta: F.corta.map(f) });
  function leerEfe(F) {
    return { apunta: F.larga[1].x > F.larga[0].x ? 'derecha' : 'izquierda', larga: F.larga[0].y > (F.pie.y + F.punta.y) / 2 ? 'arriba' : 'abajo' };
  }
  function reflejoEfe(o) {
    o = Object.assign({ espejo: 0 }, o);
    const F = efe(o), xe = num(o.espejo, 'espejo');
    if (F.pie.x <= xe) throw new Error('la F debe estar a la derecha del espejo');
    const r = { x: xe }, O = { x: xe, y: 0 }, d = 2 * (F.pie.x - xe);
    const img = mapaEfe(F, P => reflejar(P, r).P);
    const copia = mapaEfe(F, P => L({ x: P.x - d, y: P.y }));
    const giro = mapaEfe(F, P => central(P, O).P);
    const hor = mapaEfe(F, P => L({ x: P.x - d, y: -P.y }));
    const con = X => Object.assign(leerEfe(X), { puntos: X });
    return Object.assign(leerEfe(img), { original: con(F), puntos: img,
      errores: { copia: con(copia), giro180: con(giro), horizontal: con(hor) } });
  }

  // ================= Simetría central y giros =================
  function girar(P, O, g) {
    P = pto(P); O = pto(O || { x: 0, y: 0 }, 'O'); const t = num(g, 'el ángulo') * RAD, c = Math.cos(t), s = Math.sin(t);
    const dx = P.x - O.x, dy = P.y - O.y;
    return L({ x: O.x + dx * c - dy * s, y: O.y + dx * s + dy * c });
  }
  function central(P, O) {
    P = pto(P); O = pto(O, 'O');
    return {
      P: L({ x: 2 * O.x - P.x, y: 2 * O.y - P.y }), medio: L(O), d: limpio(Math.hypot(P.x - O.x, P.y - O.y)),
      errores: { reflejoVertical: reflejar(P, { x: O.x }).P, reflejoHorizontal: reflejar(P, { y: O.y }).P, giro90: girar(P, O, 90) }
    };
  }
  const trasladar = (P, v) => { P = pto(P); v = pto(v, 'v'); return L({ x: P.x + v.x, y: P.y + v.y }); };
  function areaConSigno(pts) {
    if (!Array.isArray(pts) || pts.length < 3) throw new Error('hacen falta al menos tres puntos');
    let s = 0;
    for (let i = 0; i < pts.length; i++) { const P = pto(pts[i]), Q = pto(pts[(i + 1) % pts.length]); s += P.x * Q.y - Q.x * P.y; }
    return limpio(s / 2);
  }
  function orientacion(pts) { const a = areaConSigno(pts); return Math.abs(a) < 1e-12 ? 'degenerado' : a > 0 ? 'antihorario' : 'horario'; }
  function centralTriangulo(pts, O) {
    if (!Array.isArray(pts) || pts.length !== 3) throw new Error('hacen falta tres vértices');
    O = pto(O, 'O');
    const img = pts.map(P => central(P, O).P), rv = pts.map(P => reflejar(P, { x: O.x }).P), g90 = pts.map(P => girar(P, O, 90));
    return {
      puntos: img, sentido: orientacion(img), sentidoOriginal: orientacion(pts), area: Math.abs(areaConSigno(img)),
      giro: 180,
      errores: { comoReflexion: { puntos: rv, sentido: orientacion(rv) }, giro90: { puntos: g90, sentido: orientacion(g90) },
        // cree que la media vuelta voltea la figura: el sentido contrario
        invierteSentido: { sentido: orientacion(pts) === 'antihorario' ? 'horario' : 'antihorario' } }
    };
  }

  // ================= Dos reflexiones seguidas =================
  function corte(r1, r2) {
    const det = r1.a * r2.b - r2.a * r1.b;
    if (Math.abs(det) < 1e-12) return null;
    return { x: (r1.b * r2.c - r2.b * r1.c) / det, y: (r2.a * r1.c - r1.a * r2.c) / det };
  }
  function componer(ro1, ro2) {
    const r1 = R(ro1), r2 = R(ro2), Q = corte(r1, r2);
    if (!Q) {
      // paralelas: llevar r2 a la misma normal que r1
      const s = r1.a * r2.a + r1.b * r2.b > 0 ? 1 : -1, c2 = r2.c * s;
      const dist = limpio(Math.abs(c2 - r1.c));
      if (dist < 1e-12) return { tipo: 'identidad', errores: {} };
      // un punto de r1 y su pie en r2 dan el vector de r1 hacia r2
      const P1 = { x: -r1.a * r1.c, y: -r1.b * r1.c }, H2 = pie(P1, r2);
      const v = L({ x: 2 * (H2.x - P1.x), y: 2 * (H2.y - P1.y) });
      return { tipo: 'traslacion', vector: v, distancia: dist, modulo: limpio(2 * dist),
        errores: { sinDuplicar: dist, tercerEspejo: 'reflexion', vuelveAlInicio: 0 } };
    }
    let th = r2.angulo - r1.angulo;
    while (th > 90 + 1e-9) th -= 180;
    while (th <= -90 + 1e-9) th += 180;
    th = limpio(th);
    return { tipo: 'giro', centro: L(Q), theta: th, angulo: limpio(2 * th),
      errores: { sinDuplicar: th, mitad: limpio(th / 2), tercerEspejo: 'reflexion', vuelveAlInicio: 0 } };
  }
  const aplicarDos = (P, r1, r2) => reflejar(reflejar(P, r1).P, r2).P;

  // ================= Figuras planas =================
  function poligono(pts, nombre) {
    if (!Array.isArray(pts) || pts.length < 2) throw new Error('el polígono necesita vértices');
    const v = pts.map(P => pto(P));
    const segmentos = v.map((P, i) => [P, v[(i + 1) % v.length]]);
    return { segmentos, vertices: v, nombre: nombre || 'polígono', lados: v.length };
  }
  const deSegmentos = (s, nombre) => ({ segmentos: s.map(([P, Q]) => [pto(P), pto(Q)]), nombre });
  const LETRAS = {
    A: [[[0, 0], [2, 4]], [[2, 4], [4, 0]], [[1, 2], [3, 2]]],
    E: [[[0, 0], [0, 4]], [[0, 4], [3, 4]], [[0, 2], [2, 2]], [[0, 0], [3, 0]]],
    H: [[[0, 0], [0, 4]], [[3, 0], [3, 4]], [[0, 2], [3, 2]]],
    I: [[[0, 4], [2, 4]], [[1, 4], [1, 0]], [[0, 0], [2, 0]]],
    N: [[[0, 0], [0, 4]], [[0, 4], [3, 0]], [[3, 0], [3, 4]]],
    S: [[[3, 4], [0, 4]], [[0, 4], [0, 2]], [[0, 2], [3, 2]], [[3, 2], [3, 0]], [[3, 0], [0, 0]]],
    T: [[[0, 4], [4, 4]], [[2, 4], [2, 0]]],
    U: [[[0, 4], [0, 0]], [[0, 0], [3, 0]], [[3, 0], [3, 4]]],
    X: [[[0, 0], [3, 4]], [[0, 4], [3, 0]]],
    Z: [[[0, 4], [3, 4]], [[3, 4], [0, 0]], [[0, 0], [3, 0]]]
  };
  function figura(nombre, a, b, c) {
    const p = (x, y) => ({ x, y });
    switch (nombre) {
      case 'rectangulo': { a = num(a, 'la base'); b = num(b, 'la altura'); return poligono([p(0, 0), p(a, 0), p(a, b), p(0, b)], 'rectángulo'); }
      case 'cuadrado': { a = num(a, 'el lado'); return poligono([p(0, 0), p(a, 0), p(a, a), p(0, a)], 'cuadrado'); }
      case 'rombo': { a = num(a, 'd1') / 2; b = num(b, 'd2') / 2; return poligono([p(a, 0), p(0, b), p(-a, 0), p(0, -b)], 'rombo'); }
      case 'romboide': { a = num(a, 'la base'); b = num(b, 'la altura'); c = num(c === undefined ? 2 : c, 'el corrimiento');
        return poligono([p(0, 0), p(a, 0), p(a + c, b), p(c, b)], 'romboide'); }
      case 'equilatero': { a = num(a, 'el lado'); return poligono([p(0, 0), p(a, 0), p(a / 2, a * Math.sqrt(3) / 2)], 'triángulo equilátero'); }
      case 'isosceles': { a = num(a, 'la base'); b = num(b, 'la altura'); return poligono([p(0, 0), p(a, 0), p(a / 2, b)], 'triángulo isósceles'); }
      case 'escaleno': return poligono([p(0, 0), p(6, 0), p(1, 3)], 'triángulo escaleno');
      case 'trapecio': { a = num(a, 'la base mayor'); b = num(b, 'la base menor'); c = num(c, 'la altura');
        return poligono([p(0, 0), p(a, 0), p((a + b) / 2, c), p((a - b) / 2, c)], 'trapecio isósceles'); }
      case 'trapecioRecto': { a = num(a, 'la base mayor'); b = num(b, 'la base menor'); c = num(c, 'la altura');
        return poligono([p(0, 0), p(a, 0), p(b, c), p(0, c)], 'trapecio rectángulo'); }
      case 'regular': {
        const n = num(a, 'n'), r = num(b === undefined ? 1 : b, 'R');
        if (!Number.isInteger(n) || n < 3) throw new Error('n debe ser un entero de 3 o más');
        return poligono(Array.from({ length: n }, (_, k) => p(r * Math.cos((90 + 360 * k / n) * RAD), r * Math.sin((90 + 360 * k / n) * RAD))), `polígono regular de ${n} lados`);
      }
      case 'letra': {
        const s = LETRAS[a];
        if (!s) throw new Error(`no hay letra ${a}`);
        return deSegmentos(s.map(([P, Q]) => [p(P[0], P[1]), p(Q[0], Q[1])]), `letra ${a}`);
      }
      case 'segmentos': {
        if (!Array.isArray(a) || !a.length) throw new Error('faltan los segmentos');
        return deSegmentos(a.map(([P, Q]) => [p(P[0], P[1]), p(Q[0], Q[1])]), 'figura de segmentos');
      }
      case 'circunferencia': return { circunferencia: true, R: num(a === undefined ? 1 : a, 'R'), nombre: 'circunferencia', segmentos: [] };
      default: throw new Error(`figura desconocida: ${nombre}`);
    }
  }
  function extremos(fig) {
    const out = [];
    for (const [P, Q] of fig.segmentos) for (const X of [P, Q]) if (!out.some(Y => igual(X, Y))) out.push(X);
    return out;
  }
  const centroDe = pts => ({ x: pts.reduce((s, P) => s + P.x, 0) / pts.length, y: pts.reduce((s, P) => s + P.y, 0) / pts.length });
  function girarFigura(fig, g, O) {
    if (fig.circunferencia) return fig;
    const C = O ? pto(O, 'O') : centroDe(extremos(fig));
    const s = fig.segmentos.map(([P, Q]) => [girar(P, C, g), girar(Q, C, g)]);
    return Object.assign({}, fig, { segmentos: s, vertices: fig.vertices ? fig.vertices.map(P => girar(P, C, g)) : undefined });
  }
  function mismoConjunto(s1, s2) {
    if (s1.length !== s2.length) return false;
    return s1.every(([P, Q]) => s2.some(([A, B]) => (igual(P, A, 1e-6) && igual(Q, B, 1e-6)) || (igual(P, B, 1e-6) && igual(Q, A, 1e-6))));
  }
  function coincide(fig, ro) {
    if (fig.circunferencia) { const r = R(ro); return Math.abs(r.c) < 1e-9; }
    const r = R(ro);
    return mismoConjunto(fig.segmentos, fig.segmentos.map(([P, Q]) => [reflejar(P, r).P, reflejar(Q, r).P]));
  }
  function simetrias(fig) {
    if (!fig || !Array.isArray(fig.segmentos)) throw new Error('la figura debe traer segmentos');
    if (fig.circunferencia) return { ejes: [], numEjes: 'infinitos', centro: { x: 0, y: 0 }, tieneCentro: true, G: { x: 0, y: 0 } };
    const pts = extremos(fig);
    if (!pts.length) throw new Error('la figura está vacía');
    const G = centroDe(pts);
    const P0 = pts.find(P => !igual(P, G));
    if (!P0) throw new Error('la figura es un solo punto');
    const cand = [];
    const dP0 = Math.hypot(P0.x - G.x, P0.y - G.y);
    for (const Q of pts) {
      if (Math.abs(Math.hypot(Q.x - G.x, Q.y - G.y) - dP0) > 1e-6) continue;
      let ang;
      if (igual(Q, P0)) ang = Math.atan2(P0.y - G.y, P0.x - G.x) / RAD;
      else ang = Math.atan2(Q.y - P0.y, Q.x - P0.x) / RAD + 90;           // mediatriz de P0Q (pasa por G)
      cand.push(n180(ang));
    }
    const ejes = [];
    for (const ang of cand) {
      if (ejes.some(e => Math.abs(e.angulo - ang) < 1e-6 || Math.abs(Math.abs(e.angulo - ang) - 180) < 1e-6)) continue;
      if (coincide(fig, { punto: G, angulo: ang })) ejes.push({ punto: L(G), angulo: ang });
    }
    ejes.sort((p, q) => p.angulo - q.angulo);
    const tieneCentro = mismoConjunto(fig.segmentos, fig.segmentos.map(([P, Q]) => [central(P, G).P, central(Q, G).P]));
    return { ejes, numEjes: ejes.length, centro: tieneCentro ? L(G) : null, tieneCentro, G: L(G) };
  }
  function prediccionEjes(fig) {
    const s = simetrias(fig);
    const errores = { dobleCuenta: s.numEjes === 'infinitos' ? 'infinitos' : 2 * s.numEjes };
    if (!fig.circunferencia) {
      errores.soloRectos = s.ejes.filter(e => Math.abs(e.angulo) < 1e-6 || Math.abs(e.angulo - 90) < 1e-6).length;
      errores.soloVertical = s.ejes.filter(e => Math.abs(e.angulo - 90) < 1e-6).length;
      if (s.numEjes > 0) errores.ninguno = 0;
    }
    if (fig.vertices) {
      errores.unoPorLado = fig.vertices.length;
      if (fig.vertices.length === 4) {
        const v = fig.vertices, diag = [[v[0], v[2]], [v[1], v[3]]];
        const noEje = diag.filter(([P, Q]) => !s.ejes.some(e => Math.abs(distanciaFirmada(P, R(e))) < 1e-6 && Math.abs(distanciaFirmada(Q, R(e))) < 1e-6)).length;
        errores.conDiagonales = s.numEjes + noEje;
      }
    }
    return { ejes: s.numEjes, centro: s.tieneCentro, simetrias: s, errores };
  }

  // ================= Espacio =================
  const p3 = (P, que) => {
    if (!P || typeof P !== 'object') throw new Error(`${que || 'el punto'} debe ser { x, y, z }`);
    return { x: num(P.x, 'x'), y: num(P.y, 'y'), z: num(P.z, 'z') };
  };
  const resta = (P, Q) => ({ x: P.x - Q.x, y: P.y - Q.y, z: P.z - Q.z });
  const punto3 = (P, Q) => P.x * Q.x + P.y * Q.y + P.z * Q.z;
  const cruz = (P, Q) => ({ x: P.y * Q.z - P.z * Q.y, y: P.z * Q.x - P.x * Q.z, z: P.x * Q.y - P.y * Q.x });
  const norma = P => Math.hypot(P.x, P.y, P.z);
  const L3 = P => ({ x: limpio(P.x), y: limpio(P.y), z: limpio(P.z) });
  const igual3 = (P, Q) => Math.abs(P.x - Q.x) < 1e-6 && Math.abs(P.y - Q.y) < 1e-6 && Math.abs(P.z - Q.z) < 1e-6;
  function plano(o) {
    if (!o || !o.normal) throw new Error('el plano necesita normal');
    const n = p3(o.normal, 'normal'), m = norma(n);
    if (m < 1e-12) throw new Error('la normal no puede ser cero');
    const u = { x: n.x / m, y: n.y / m, z: n.z / m };
    const d = o.punto ? punto3(u, p3(o.punto, 'punto')) : num(o.d || 0, 'd') / m;
    return { normal: u, d };
  }
  function reflejarEnPlano(P, po) {
    P = p3(P); const pl = plano(po), s = punto3(pl.normal, P) - pl.d;
    return L3({ x: P.x - 2 * s * pl.normal.x, y: P.y - 2 * s * pl.normal.y, z: P.z - 2 * s * pl.normal.z });
  }
  // Simétrico de P respecto de un plano, con el pie H y los errores típicos: se queda en el pie, toma el simétrico
  // respecto del origen (central) o respecto de la recta normal que pasa por el origen (el eje).
  function simetricoEspacio(P, po) {
    P = p3(P); const pl = plano(po), s = punto3(pl.normal, P) - pl.d, n = pl.normal;
    const H = L3({ x: P.x - s * n.x, y: P.y - s * n.y, z: P.z - s * n.z });
    const k = punto3(n, P);
    return { P: reflejarEnPlano(P, po), H, d: limpio(Math.abs(s)),
      errores: { pie: H, centralOrigen: L3({ x: -P.x, y: -P.y, z: -P.z }), ejeNormal: L3({ x: 2 * k * n.x - P.x, y: 2 * k * n.y - P.y, z: 2 * k * n.z - P.z }) } };
  }
  function poliedro(nombre, a, b, c) {
    const v = (x, y, z) => ({ x, y, z });
    const caja = (A, B, C) => [v(0, 0, 0), v(A, 0, 0), v(A, B, 0), v(0, B, 0), v(0, 0, C), v(A, 0, C), v(A, B, C), v(0, B, C)];
    const ARISTAS_CAJA = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    switch (nombre) {
      case 'cubo': { a = num(a === undefined ? 2 : a, 'la arista'); return { nombre: 'cubo', vertices: caja(a, a, a), caras: 6, aristas: 12, lista: ARISTAS_CAJA }; }
      case 'caja': return { nombre: 'caja', vertices: caja(num(a, 'a'), num(b, 'b'), num(c, 'c')), caras: 6, aristas: 12, lista: ARISTAS_CAJA };
      case 'prismaCuadrado': { a = num(a, 'a'); return { nombre: 'prisma de base cuadrada', vertices: caja(a, a, num(b, 'h')), caras: 6, aristas: 12, lista: ARISTAS_CAJA }; }
      case 'tetraedro': { a = num(a === undefined ? 2 : a, 'la arista'); const k = a / (2 * Math.SQRT2);
        return { nombre: 'tetraedro regular', vertices: [v(k, k, k), v(k, -k, -k), v(-k, k, -k), v(-k, -k, k)], caras: 4, aristas: 6,
          lista: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]] }; }
      case 'piramideCuadrada': { a = num(a, 'a'); const h = num(b, 'h');
        return { nombre: 'pirámide de base cuadrada', vertices: [v(0, 0, 0), v(a, 0, 0), v(a, a, 0), v(0, a, 0), v(a / 2, a / 2, h)], caras: 5, aristas: 8,
          lista: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [2, 4], [3, 4]] }; }
      case 'prismaRegular': {
        const n = num(a, 'n'), l = num(b, 'el lado'), h = num(c, 'la altura');
        if (!Number.isInteger(n) || n < 3) throw new Error('n debe ser un entero de 3 o más');
        const R = l / (2 * Math.sin(Math.PI / n)), base = Array.from({ length: n }, (_, k) => ({ x: R * Math.cos(2 * Math.PI * k / n), y: R * Math.sin(2 * Math.PI * k / n) }));
        const lista = [];
        for (let k = 0; k < n; k++) lista.push([k, (k + 1) % n], [n + k, n + (k + 1) % n], [k, n + k]);
        return { nombre: `prisma regular de ${n} lados`, vertices: base.map(P => v(P.x, P.y, 0)).concat(base.map(P => v(P.x, P.y, h))), caras: n + 2, aristas: 3 * n, lista };
      }
      default: throw new Error(`poliedro desconocido: ${nombre}`);
    }
  }
  function planos(poli) {
    if (!poli || !Array.isArray(poli.vertices) || poli.vertices.length < 4) throw new Error('el poliedro necesita al menos cuatro vértices');
    const V = poli.vertices.map(P => p3(P));
    const G = { x: V.reduce((s, P) => s + P.x, 0) / V.length, y: V.reduce((s, P) => s + P.y, 0) / V.length, z: V.reduce((s, P) => s + P.z, 0) / V.length };
    const normales = [];
    const agregar = n => { const m = norma(n); if (m < 1e-9) return; const u = { x: n.x / m, y: n.y / m, z: n.z / m }; normales.push(u); };
    for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) {
      if (Math.abs(norma(resta(V[i], G)) - norma(resta(V[j], G))) < 1e-6) agregar(resta(V[i], V[j]));   // plano mediador
      agregar(cruz(resta(V[i], G), resta(V[j], G)));                                                      // por G, Vi y Vj
    }
    const hallados = [];
    for (const u of normales) {
      if (hallados.some(h => Math.abs(Math.abs(punto3(h.normal, u)) - 1) < 1e-9)) continue;
      const pl = { normal: u, d: punto3(u, G) };
      const ok = V.every(P => { const Q = reflejarEnPlano(P, pl); return V.some(X => igual3(X, Q)); });
      if (ok) {
        // normal canónica: primera componente no nula positiva
        const s = u.x > 1e-9 || (Math.abs(u.x) <= 1e-9 && (u.y > 1e-9 || (Math.abs(u.y) <= 1e-9 && u.z > 0))) ? 1 : -1;
        hallados.push({ normal: L3({ x: s * u.x, y: s * u.y, z: s * u.z }), d: limpio(s * pl.d) });
      }
    }
    return { planos: hallados, numPlanos: hallados.length, G: L3(G) };
  }
  function prediccionPlanos(poli) {
    const r = planos(poli);
    // paralelos a alguna cara: la normal del plano es paralela a la normal de una cara de la caja (ejes x, y, z)
    const soloCaras = r.planos.filter(p => [p.normal.x, p.normal.y, p.normal.z].filter(c => Math.abs(c) > 1e-9).length === 1).length;
    // comoPrisma: lo que tendría un prisma de base cuadrada (1 plano horizontal + 4 verticales)
    return { planos: r.numPlanos, lista: r.planos, errores: { soloCaras, unoPorCara: poli.caras, unoPorArista: poli.aristas, comoCubo: 9, comoPrisma: 5 } };
  }
  // Corte del poliedro convexo con un plano: los puntos donde el plano corta las aristas (y los vértices que caen en
  // él), ordenados alrededor de su centro. Sirve para dibujar el plano de simetría dentro del sólido.
  function seccion(poli, po) {
    const pl = plano(po), V = poli.vertices.map(P => p3(P)), out = [];
    const agregar = P => { if (!out.some(X => igual3(X, P))) out.push(L3(P)); };
    const f = P => punto3(pl.normal, P) - pl.d;
    for (const [i, j] of poli.lista || []) {
      const a = f(V[i]), b = f(V[j]);
      if (Math.abs(a) < 1e-9) agregar(V[i]);
      if (Math.abs(b) < 1e-9) agregar(V[j]);
      if (a * b < -1e-18) { const t = a / (a - b); agregar({ x: V[i].x + t * (V[j].x - V[i].x), y: V[i].y + t * (V[j].y - V[i].y), z: V[i].z + t * (V[j].z - V[i].z) }); }
    }
    if (out.length < 3) return out;
    const C = { x: out.reduce((s, P) => s + P.x, 0) / out.length, y: out.reduce((s, P) => s + P.y, 0) / out.length, z: out.reduce((s, P) => s + P.z, 0) / out.length };
    const e1 = resta(out[0], C), n1 = norma(e1), u = { x: e1.x / n1, y: e1.y / n1, z: e1.z / n1 }, w = cruz(pl.normal, u);
    return out.map(P => ({ P, t: Math.atan2(punto3(resta(P, C), w), punto3(resta(P, C), u)) })).sort((p, q) => p.t - q.t).map(o => o.P);
  }
  // Giro alrededor de la recta vertical (paralela al eje z) que pasa por C.
  function girar3D(P, g, C) {
    P = p3(P); C = C ? p3(C, 'C') : { x: 0, y: 0, z: 0 };
    const t = num(g, 'el ángulo') * RAD, c = Math.cos(t), s = Math.sin(t), dx = P.x - C.x, dy = P.y - C.y;
    return L3({ x: C.x + dx * c - dy * s, y: C.y + dx * s + dy * c, z: P.z });
  }
  function quiralidad(u, v, w) {
    const t = punto3(p3(u, 'u'), cruz(p3(v, 'v'), p3(w, 'w')));
    if (Math.abs(t) < 1e-12) throw new Error('los tres vectores están en un mismo plano');
    return t > 0 ? 'derecha' : 'izquierda';
  }
  function manoEnEspejo(mano, po) {
    const pl = plano(po), O = { x: 0, y: 0, z: 0 };
    // un vector se refleja como la diferencia de dos puntos reflejados
    const vr = w => resta(reflejarEnPlano(p3(w), pl), reflejarEnPlano(O, pl));
    const r = { pulgar: vr(mano.pulgar), indice: vr(mano.indice), medio: vr(mano.medio) };
    const giro = w => girar3D(w, 180);                                 // media vuelta alrededor del eje vertical z
    const original = quiralidad(mano.pulgar, mano.indice, mano.medio);
    return {
      original, imagen: quiralidad(r.pulgar, r.indice, r.medio), reflejo: r,
      trasGiro: quiralidad(giro(r.pulgar), giro(r.indice), giro(r.medio)),
      errores: { copia: original, giroLaVuelve: original }
    };
  }

  // azar con semilla para las pruebas (mulberry32)
  function azar(semilla) {
    let a = semilla >>> 0;
    return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  return {
    recta, reflejar, reflejarFigura, pliegue, efe, reflejoEfe, seccion, girar3D, simetricoEspacio,
    central, girar, trasladar, orientacion, areaConSigno, centralTriangulo,
    componer, aplicarDos,
    figura, poligono, girarFigura, simetrias, coincide, prediccionEjes, LETRAS: Object.keys(LETRAS),
    poliedro, reflejarEnPlano, planos, prediccionPlanos, quiralidad, manoEnEspejo,
    azar
  };
});
