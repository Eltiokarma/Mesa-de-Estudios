/*
 * Motor de «El polígono que se abre»: ángulos, diagonales y cuadriláteros.
 *
 * Aquí vive toda la geometría de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorPoligono) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json.
 *
 *   poligono(n)                     polígono convexo de n lados: suma de interiores 180(n − 2), exteriores 360,
 *                                   triángulos desde un vértice n − 2, diagonales n(n − 3)/2 y desde un vértice
 *                                   n − 3, y los ángulos del polígono regular (interior, exterior y central)
 *   nDesdeAngulo({ interior | exterior | central })   cuántos lados tiene el regular con ese ángulo
 *   nDesdeSuma(suma)                cuántos lados tiene el polígono cuyos interiores suman eso
 *   nDesdeDiagonales(d)             cuántos lados tiene el polígono con d diagonales
 *   diagonalesDesdeVertices(n, k)   diagonales trazadas desde k vértices consecutivos: k·n − (k + 1)(k + 2)/2
 *   regular({ n, lado | radio | apotema })   lado, radio, apotema, perímetro y área por triángulos centrales
 *   verticesRegular(n, { radio, centro, giro })   coordenadas de los vértices (para dibujar)
 *   triangulacion(n)                los n − 2 triángulos desde el vértice 0 (índices)
 *   listaDiagonales(n)              todas las diagonales, ordenadas por el vértice del que salen (sin repetir)
 *   poligonoVertices(puntos)        polígono dado por sus vértices: área por determinante, ángulos por vectores
 *                                   (el entrante mide más de 180°), exteriores con signo, si es simple y si es convexo
 *   cuadrilatero(A, B, C, D)        lados, ángulos, paralelos, diagonales y clasificación por propiedades,
 *                                   con todos los nombres que le corresponden (el cuadrado también es rombo y rectángulo)
 *   trapecio({ B, b })              mediana (B + b)/2 y segmento que une los puntos medios de las diagonales (B − b)/2
 *   girar(puntos, grados, centro)   gira una figura: las medidas no cambian
 *   rombo(lado, angulo)             vértices de un rombo con ese ángulo en A (con 90°, el cuadrado)
 *
 * Clasificación de los cuadriláteros como en las academias peruanas: paralelogramos (dos pares de lados
 * paralelos: romboide, rombo, rectángulo y cuadrado), trapecios (exactamente un par: escaleno, isósceles y
 * rectángulo) y trapezoides (ningún par; el simétrico tiene dos pares de lados consecutivos iguales).
 * El cuadrado es a la vez rombo, rectángulo y paralelogramo; el rombo y el rectángulo son paralelogramos.
 *
 * Cada resultado trae un campo 'errores' con lo que dan los errores típicos (GE23 de
 * docs/investigacion/geometria-ideas-erroneas.md: 180°·n y n(n − 1)/2; GE9 y GE10: el cuadrado girado
 * y la inclusión de clases; y las hipótesis propias: apotema como mitad del lado, mediana como B − b…).
 * Son las opciones incorrectas de las predicciones. Un error que en un caso particular da la respuesta
 * correcta (la apotema del cuadrado sí es la mitad del lado) no se incluye: no puede ser una opción incorrecta.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorPoligono = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9;
  const GRAD = 180 / Math.PI;

  // ---------- Entradas ----------
  function entero(n, que, min) {
    if (typeof n !== 'number' || !Number.isFinite(n)) throw new Error(`${que} debe ser un número`);
    if (!Number.isInteger(n)) throw new Error(`${que} debe ser un número entero`);
    if (n < min) throw new Error(`${que} debe ser al menos ${min}`);
    return n;
  }
  function positivo(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (!(x > 0)) throw new Error(`${que} debe ser positivo`);
    return x;
  }
  function punto(p, nombre) {
    let x, y;
    if (Array.isArray(p)) { x = p[0]; y = p[1]; }
    else if (p && typeof p === 'object') { x = p.x; y = p.y; }
    if (typeof x !== 'number' || typeof y !== 'number' || !Number.isFinite(x) || !Number.isFinite(y))
      throw new Error(`el vértice ${nombre} debe tener coordenadas numéricas x e y`);
    return { x: x + 0, y: y + 0 };
  }

  // ---------- Números ----------
  const iguales = (a, b) => (Array.isArray(a) || Array.isArray(b))
    ? (Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, k) => iguales(v, b[k])))
    : (typeof a === 'number' && typeof b === 'number'
      ? Math.abs(a - b) <= TOL * Math.max(1, Math.abs(a), Math.abs(b))
      : a === b);
  // Redondea el ruido de coma flotante cerca de un entero o de una fracción simple (para que 720 salga 720).
  function limpio(x) {
    if (!Number.isFinite(x)) return x;
    const r = Math.round(x);
    if (Math.abs(x - r) <= 1e-9 * Math.max(1, Math.abs(x))) return r + 0;
    return x;
  }
  const esEntero = x => Number.isFinite(x) && Math.abs(x - Math.round(x)) <= 1e-9 * Math.max(1, Math.abs(x));
  // Quita de 'errores' los que coinciden con la respuesta correcta: un error así no puede ser opción incorrecta.
  function sinCorrecta(errores, correcta) {
    const out = {};
    for (const [k, v] of Object.entries(errores)) if (!iguales(v, correcta)) out[k] = Array.isArray(v) ? v : limpio(v);
    return out;
  }

  // ---------- Polígono convexo de n lados ----------
  const NOMBRES = { 3: 'triángulo', 4: 'cuadrilátero', 5: 'pentágono', 6: 'hexágono', 7: 'heptágono', 8: 'octógono',
    9: 'eneágono', 10: 'decágono', 11: 'endecágono', 12: 'dodecágono', 15: 'pentadecágono', 20: 'icoságono' };
  const nombre = n => NOMBRES[n] || `polígono de ${n} lados`;

  function poligono(n0) {
    const n = entero(n0, 'el número de lados', 3);
    const suma = 180 * (n - 2), diag = n * (n - 3) / 2;
    const interior = limpio(suma / n), exterior = limpio(360 / n);
    return {
      n, nombre: nombre(n),
      sumaInteriores: suma, sumaExteriores: 360,
      triangulosDesdeVertice: n - 2, diagonales: diag, diagonalesDesdeVertice: n - 3,
      // del polígono regular (todos los lados y ángulos iguales)
      regular: { interior, exterior, central: exterior },
      errores: {
        sumaInteriores: sinCorrecta({
          con180n: 180 * n,             // GE23: un triángulo por lado, sin restar los 360° del centro
          siempre360: 360,              // confunde con la suma de los exteriores (hipótesis)
          conNmenos1: 180 * (n - 1),    // cuenta n − 1 triángulos desde un vértice (hipótesis)
        }, suma),
        sumaExteriores: sinCorrecta({
          comoInteriores: suma,         // cree que crece con n, como los interiores (hipótesis)
          con180n: 180 * n,             // suma 180° por vértice (interior + exterior) y no resta los interiores
        }, 360),
        diagonales: sinCorrecta({
          conLados: n * (n - 1) / 2,    // GE23: une todos los pares de vértices y cuenta también los lados
          sinDividir: n * (n - 3),      // cuenta cada diagonal dos veces, una desde cada extremo
          soloDesdeUnVertice: n - 3,    // se queda con las de un solo vértice
          conLadosSinDividir: n * (n - 1),   // une cada vértice con todos los demás y no divide entre 2
        }, diag),
        diagonalesDesdeVertice: sinCorrecta({
          conVecinos: n - 1,            // une el vértice con todos los demás, también con los dos vecinos (que dan lados)
          comoTriangulos: n - 2,        // confunde diagonales con triángulos
        }, n - 3),
        triangulosDesdeVertice: sinCorrecta({
          unoPorLado: n,                // un triángulo por lado, como desde el centro
          comoDiagonales: n - 3,        // confunde triángulos con diagonales
        }, n - 2),
        interiorRegular: sinCorrecta({
          comoCentral: 360 / n,         // confunde el ángulo interior con el central (o el exterior)
          con180n: 180,                 // reparte 180°·n entre n ángulos
        }, interior),
      },
    };
  }

  // n a partir de un ángulo del polígono regular. Si no sale un entero ≥ 3, ese polígono no existe.
  function nDesdeAngulo(o) {
    if (!o || typeof o !== 'object') throw new Error('falta el ángulo: { interior }, { exterior } o { central }');
    let exterior, dado, valor;
    if (o.interior !== undefined) { valor = positivo(o.interior, 'el ángulo interior'); if (valor >= 180) throw new Error('el ángulo interior de un polígono convexo es menor que 180°'); exterior = 180 - valor; dado = 'interior'; }
    else if (o.exterior !== undefined) { valor = positivo(o.exterior, 'el ángulo exterior'); if (valor >= 180) throw new Error('el ángulo exterior de un polígono convexo es menor que 180°'); exterior = valor; dado = 'exterior'; }
    else if (o.central !== undefined) { valor = positivo(o.central, 'el ángulo central'); if (valor >= 180) throw new Error('el ángulo central de un polígono regular es menor que 180°'); exterior = valor; dado = 'central'; }
    else throw new Error('falta el ángulo: { interior }, { exterior } o { central }');
    const n = limpio(360 / exterior), existe = esEntero(n) && n >= 3;
    const errores = {};
    if (dado === 'interior') {
      errores.con180 = 180 / exterior;            // usa 180° en vez de 360° para los exteriores (hipótesis)
      errores.interiorComoCentral = 360 / valor;  // divide 360° entre el ángulo interior (hipótesis)
      errores.interiorComoSuma = valor / 180 + 2; // toma el ángulo como si fuera la suma de todos (hipótesis)
    } else {
      errores.comoInterior = 360 / (180 - valor); // toma el exterior (o el central) como si fuera el interior
    }
    return { n, existe, exterior: limpio(exterior), interior: limpio(180 - exterior), nombre: existe ? nombre(Math.round(n)) : null,
      errores: sinCorrecta(errores, n) };
  }

  function nDesdeSuma(suma0) {
    const suma = positivo(suma0, 'la suma de los ángulos interiores');
    const n = limpio(suma / 180 + 2), existe = esEntero(n) && n >= 3;
    return { n, existe, nombre: existe ? nombre(Math.round(n)) : null,
      errores: sinCorrecta({ con180n: suma / 180, conNmenos1: suma / 180 + 1 }, n) };
  }

  function nDesdeDiagonales(d0) {
    if (typeof d0 !== 'number' || !Number.isFinite(d0) || d0 < 0) throw new Error('el número de diagonales debe ser un número no negativo');
    const n = limpio((3 + Math.sqrt(9 + 8 * d0)) / 2), existe = esEntero(n) && n >= 3;
    return { n, existe, nombre: existe ? nombre(Math.round(n)) : null,
      errores: sinCorrecta({
        conLados: (1 + Math.sqrt(1 + 8 * d0)) / 2,   // resuelve n(n − 1)/2 = d
        sinDividir: (3 + Math.sqrt(9 + 4 * d0)) / 2, // resuelve n(n − 3) = d
      }, n) };
  }

  // Diagonales trazadas desde k vértices consecutivos de un polígono de n lados (sin contar dos veces las que unen
  // dos de esos vértices): el primero traza n − 3, el segundo n − 3, el tercero n − 4, …
  function diagonalesDesdeVertices(n0, k0) {
    const n = entero(n0, 'el número de lados', 3), k = entero(k0, 'el número de vértices', 1);
    if (k > n) throw new Error('no hay tantos vértices');
    // conteo directo con la lista de diagonales
    const usadas = listaDiagonales(n).filter(([i, j]) => i < k || j < k).length;
    const formula = k * n - (k + 1) * (k + 2) / 2;
    return { n, k, diagonales: usadas, porFormula: k <= n - 1 ? formula : usadas,
      errores: sinCorrecta({ cuentaDoble: k * (n - 3) }, usadas) };
  }

  // ---------- Polígono regular ----------
  function regular(o) {
    if (!o || typeof o !== 'object') throw new Error('falta { n, lado }, { n, radio } o { n, apotema }');
    const n = entero(o.n, 'el número de lados', 3), a = Math.PI / n;
    let R;
    if (o.lado !== undefined) R = positivo(o.lado, 'el lado') / (2 * Math.sin(a));
    else if (o.radio !== undefined) R = positivo(o.radio, 'el radio');
    else if (o.apotema !== undefined) R = positivo(o.apotema, 'la apotema') / Math.cos(a);
    else throw new Error('falta el lado, el radio o la apotema');
    const lado = limpio(2 * R * Math.sin(a)), apotema = limpio(R * Math.cos(a)), radio = limpio(R);
    const perimetro = limpio(n * lado), area = limpio(perimetro * apotema / 2);
    return {
      n, nombre: n === 3 ? 'triángulo equilátero' : n === 4 ? 'cuadrado' : `${nombre(n)} regular`, lado, radio, apotema, perimetro, area,
      anguloCentral: limpio(360 / n), interior: limpio(180 * (n - 2) / n), exterior: limpio(360 / n),
      triangulo: { base: lado, altura: apotema, area: limpio(lado * apotema / 2), cantidad: n },   // cada triángulo central
      errores: {
        apotema: sinCorrecta({
          mitadDelLado: lado / 2,       // la apotema como la mitad del lado (hipótesis; solo es cierto en el cuadrado)
          comoRadio: radio,             // confunde la apotema con el radio (al vértice)
          comoLado: lado,               // la toma igual al lado
          distanciaEntreLados: 2 * apotema,   // la distancia entre lados opuestos (en n par), no hasta el centro
        }, apotema),
        area: sinCorrecta({
          sinMitad: perimetro * apotema,      // olvida el ½ del triángulo
          conRadio: perimetro * radio / 2,    // usa el radio en vez de la apotema
          conMitadDelLado: perimetro * lado / 4,   // usa la mitad del lado como apotema
        }, area),
        radio: sinCorrecta({ comoApotema: apotema, mitadDelLado: lado / 2 }, radio),
      },
    };
  }

  function verticesRegular(n0, o) {
    const n = entero(n0, 'el número de lados', 3), op = o || {};
    const R = op.radio === undefined ? 1 : positivo(op.radio, 'el radio');
    const c = op.centro ? punto(op.centro, 'centro') : { x: 0, y: 0 };
    // Por omisión, con el lado de abajo horizontal: el primer vértice abajo a la izquierda y en sentido antihorario.
    const g0 = (op.giro === undefined ? -90 - 180 / n : -90 - 180 / n + op.giro) / GRAD;
    const out = [];
    for (let k = 0; k < n; k++) {
      const t = g0 + 2 * Math.PI * k / n;
      out.push({ x: limpio(c.x + R * Math.cos(t)), y: limpio(c.y + R * Math.sin(t)) });
    }
    return out;
  }

  function triangulacion(n0) {
    const n = entero(n0, 'el número de lados', 3), t = [];
    for (let k = 1; k <= n - 2; k++) t.push([0, k, k + 1]);
    return t;
  }

  function listaDiagonales(n0) {
    const n = entero(n0, 'el número de lados', 3), d = [];
    for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) d.push([i, j]);
    return d;
  }

  // ---------- Polígono por sus vértices ----------
  const resta = (P, Q) => ({ x: P.x - Q.x, y: P.y - Q.y });
  const pvec = (u, v) => u.x * v.y - u.y * v.x;
  const pesc = (u, v) => u.x * v.x + u.y * v.y;
  const dist = (P, Q) => Math.hypot(P.x - Q.x, P.y - Q.y);

  // ¿Se cortan los segmentos PQ y RS (sin contar extremos compartidos)?
  function cortan(P, Q, R, S) {
    const d1 = pvec(resta(Q, P), resta(R, P)), d2 = pvec(resta(Q, P), resta(S, P));
    const d3 = pvec(resta(S, R), resta(P, R)), d4 = pvec(resta(S, R), resta(Q, R));
    const e = 1e-12 * Math.max(1, dist(P, Q) * dist(R, S));
    return ((d1 > e && d2 < -e) || (d1 < -e && d2 > e)) && ((d3 > e && d4 < -e) || (d3 < -e && d4 > e));
  }

  function poligonoVertices(puntos) {
    if (!Array.isArray(puntos) || puntos.length < 3) throw new Error('un polígono necesita al menos 3 vértices');
    const P = puntos.map((p, k) => punto(p, String(k + 1)));
    const n = P.length;
    let doble = 0;
    for (let k = 0; k < n; k++) doble += pvec(P[k], P[(k + 1) % n]);
    const escala = Math.max(...P.map(p => Math.max(Math.abs(p.x), Math.abs(p.y))), 1);
    if (Math.abs(doble) <= 1e-12 * escala * escala) throw new Error('los vértices no encierran ninguna región');
    const orient = Math.sign(doble);   // 1: antihorario
    const lados = [], angulos = [], exteriores = [];
    for (let k = 0; k < n; k++) {
      const A = P[(k - 1 + n) % n], V = P[k], B = P[(k + 1) % n];
      if (dist(V, B) <= 1e-12 * escala) throw new Error('hay dos vértices seguidos que coinciden');
      lados.push(limpio(dist(V, B)));
      const u = resta(V, A), w = resta(B, V);
      // giro con signo al pasar del lado que llega al lado que sale (positivo hacia la orientación del polígono)
      const giro = Math.atan2(pvec(u, w), pesc(u, w)) * GRAD * orient;
      exteriores.push(limpio(giro));
      angulos.push(limpio(180 - giro));
    }
    let simple = true;
    for (let i = 0; i < n && simple; i++) for (let j = i + 1; j < n; j++) {
      if (j === i + 1 || (i === 0 && j === n - 1)) continue;
      if (cortan(P[i], P[(i + 1) % n], P[j], P[(j + 1) % n])) { simple = false; break; }
    }
    const llanos = angulos.some(a => Math.abs(a - 180) <= 1e-7);
    const convexo = simple && angulos.every(a => a < 180 - 1e-7);
    const area = limpio(Math.abs(doble) / 2);
    const suma = limpio(angulos.reduce((s, a) => s + a, 0)), sumaExt = limpio(exteriores.reduce((s, a) => s + a, 0));
    const entrantes = angulos.map((a, k) => (a > 180 + 1e-7 ? k : -1)).filter(k => k >= 0);
    return {
      n, area, areaConSigno: limpio(doble / 2), orientacion: orient > 0 ? 'antihoraria' : 'horaria',
      perimetro: limpio(lados.reduce((s, a) => s + a, 0)), lados, angulos, exteriores,
      sumaInteriores: suma, sumaExteriores: sumaExt, sumaSegunFormula: 180 * (n - 2),
      simple, convexo, llanos, entrantes,
      errores: {
        area: sinCorrecta({ sinMitad: Math.abs(doble) }, area),
        // en el no convexo, medir el entrante "por fuera" (360° − el ángulo): el ángulo que se ve más chico
        sumaInteriores: sinCorrecta({
          entranteMedidoPorFuera: angulos.reduce((s, a) => s + (a > 180 + 1e-7 ? 360 - a : a), 0),
          con180n: 180 * n,
        }, suma),
      },
    };
  }

  function girar(puntos, grados, centro) {
    if (!Array.isArray(puntos) || !puntos.length) throw new Error('faltan los vértices');
    if (typeof grados !== 'number' || !Number.isFinite(grados)) throw new Error('el giro debe ser un número de grados');
    const P = puntos.map((p, k) => punto(p, String(k + 1)));
    const O = centro ? punto(centro, 'centro') : { x: P.reduce((s, p) => s + p.x, 0) / P.length, y: P.reduce((s, p) => s + p.y, 0) / P.length };
    const r = grados / GRAD, co = Math.cos(r), si = Math.sin(r);
    return P.map(p => { const v = resta(p, O); return { x: limpio(O.x + v.x * co - v.y * si), y: limpio(O.y + v.x * si + v.y * co) }; });
  }

  // Rombo de lado dado con un ángulo dado en A (vértices A, B, C, D; AB sobre el eje x). Con 90° es un cuadrado.
  function rombo(lado0, angulo0) {
    const lado = positivo(lado0, 'el lado'), a = positivo(angulo0, 'el ángulo');
    if (a >= 180) throw new Error('el ángulo del rombo debe ser menor que 180°');
    const t = a / GRAD, dx = limpio(lado * Math.cos(t)), dy = limpio(lado * Math.sin(t));
    return [{ x: 0, y: 0 }, { x: lado, y: 0 }, { x: limpio(lado + dx), y: dy }, { x: dx, y: dy }];
  }

  // ---------- Cuadriláteros ----------
  function cuadrilatero(A0, B0, C0, D0) {
    const V = [punto(A0, 'A'), punto(B0, 'B'), punto(C0, 'C'), punto(D0, 'D')];
    const [A, B, C, D] = V;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++)
      if (dist(V[i], V[j]) <= 1e-12 * Math.max(1, Math.abs(V[i].x), Math.abs(V[i].y))) throw new Error('dos vértices coinciden');
    // Cruzado (los lados AB y CD, o BC y DA, se cortan) o con tres vértices alineados: no tiene nombre de clase.
    const cruzado = cortan(A, B, C, D) || cortan(B, C, D, A);
    const alineado = [0, 1, 2, 3].some(k => {
      const P = V[(k + 3) % 4], Q = V[k], R = V[(k + 1) % 4];
      return Math.abs(pvec(resta(Q, P), resta(R, Q))) <= 1e-9 * dist(P, Q) * dist(Q, R);
    });
    if (cruzado || alineado) {
      const tipo = cruzado ? 'cuadrilátero cruzado' : 'tres vértices alineados';
      return { tipo, nombres: [tipo], convexo: false, simple: !cruzado, degenerado: true, trapecio: null,
        lados: { AB: limpio(dist(A, B)), BC: limpio(dist(B, C)), CD: limpio(dist(C, D)), DA: limpio(dist(D, A)) },
        esParalelogramo: false, esRectangulo: false, esRombo: false, esCuadrado: false, esTrapecio: false, errores: { nombres: {} } };
    }
    const pol = poligonoVertices(V);
    const escala = Math.max(...pol.lados);
    const paralelo = (P, Q, R, S) => Math.abs(pvec(resta(Q, P), resta(S, R))) <= 1e-9 * dist(P, Q) * dist(R, S);
    const ig = (x, y) => Math.abs(x - y) <= 1e-9 * escala;
    const [ab, bc, cd, da] = pol.lados;
    const [aA, aB, aC, aD] = pol.angulos;
    const p1 = paralelo(A, B, D, C), p2 = paralelo(B, C, A, D);   // AB ∥ CD y BC ∥ AD
    const rectos = pol.angulos.map(a => Math.abs(a - 90) <= 1e-7);
    const AC = limpio(dist(A, C)), BD = limpio(dist(B, D));
    const mAC = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 }, mBD = { x: (B.x + D.x) / 2, y: (B.y + D.y) / 2 };
    const diagonales = {
      AC, BD, iguales: ig(AC, BD),
      perpendiculares: Math.abs(pesc(resta(C, A), resta(D, B))) <= 1e-9 * AC * BD,
      seCortanEnSuPuntoMedio: dist(mAC, mBD) <= 1e-9 * escala,
    };
    let tipo, nombres, trapecio = null;
    if (!pol.convexo) { tipo = 'cuadrilátero no convexo'; nombres = ['cuadrilátero no convexo']; }
    else if (p1 && p2) {
      const rect = rectos.every(Boolean), rombo = ig(ab, bc) && ig(bc, cd) && ig(cd, da);
      nombres = ['paralelogramo'];
      if (rect) nombres.push('rectángulo');
      if (rombo) nombres.push('rombo');
      if (rect && rombo) nombres.push('cuadrado');
      if (!rect && !rombo) nombres.push('romboide');
      tipo = rect && rombo ? 'cuadrado' : rect ? 'rectángulo' : rombo ? 'rombo' : 'romboide';
    } else if (p1 || p2) {
      // bases: el par paralelo; laterales: los otros dos
      const [b1, b2, l1, l2] = p1 ? [[A, B], [D, C], [B, C], [A, D]] : [[B, C], [A, D], [A, B], [D, C]];
      const L1 = dist(...b1), L2 = dist(...b2), lat1 = dist(...l1), lat2 = dist(...l2);
      const mayor = Math.max(L1, L2), menor = Math.min(L1, L2);
      const medio = (P, Q) => ({ x: limpio((P.x + Q.x) / 2), y: limpio((P.y + Q.y) / 2) });
      // altura: distancia entre las rectas de las bases
      const u = resta(b1[1], b1[0]), altura = Math.abs(pvec(u, resta(b2[0], b1[0]))) / Math.hypot(u.x, u.y);
      const isosceles = ig(lat1, lat2), rect = rectos.some(Boolean);
      const sub = rect ? 'trapecio rectángulo' : isosceles ? 'trapecio isósceles' : 'trapecio escaleno';
      tipo = sub; nombres = ['trapecio', sub];
      const T = trapecioBases({ B: mayor, b: menor });
      trapecio = { bases: p1 ? ['AB', 'CD'] : ['BC', 'AD'], baseMayor: limpio(mayor), baseMenor: limpio(menor),
        laterales: [limpio(lat1), limpio(lat2)], altura: limpio(altura), mediana: T.mediana, segmentoDiagonales: T.segmentoDiagonales,
        extremosMediana: [medio(...l1), medio(...l2)], extremosSegmentoDiagonales: [medio(A, C), medio(B, D)], area: limpio((mayor + menor) / 2 * altura), errores: T.errores };
    } else {
      // trapezoide simétrico (deltoide): dos pares de lados consecutivos iguales
      const sim = (ig(ab, bc) && ig(cd, da)) || (ig(bc, cd) && ig(da, ab));
      tipo = sim ? 'trapezoide simétrico' : 'trapezoide';
      nombres = sim ? ['trapezoide', 'trapezoide simétrico'] : ['trapezoide'];
    }
    // ¿Algún lado está horizontal o vertical? (solo para el error de posición: el cuadrado "de punta")
    const ejes = (P, Q) => Math.abs(P.x - Q.x) <= 1e-9 * escala || Math.abs(P.y - Q.y) <= 1e-9 * escala;
    const ladoEnEje = [[A, B], [B, C], [C, D], [D, A]].some(([P, Q]) => ejes(P, Q));
    const diagEnEje = ejes(A, C) && ejes(B, D);
    const errNombres = { soloElMasEspecifico: [tipo] };
    if (tipo === 'cuadrado') {
      errNombres.cuadradoNoEsRombo = nombres.filter(t => t !== 'rombo');           // GE10: sin inclusión de clases
      errNombres.cuadradoNoEsRectangulo = nombres.filter(t => t !== 'rectángulo'); // GE10
      if (!ladoEnEje && diagEnEje) errNombres.porPosicion = ['paralelogramo', 'rombo'];   // GE9: "de punta" parece solo un rombo
    }
    if (tipo === 'rombo' || tipo === 'rectángulo') errNombres.noEsParalelogramo = nombres.filter(t => t !== 'paralelogramo');
    return {
      lados: { AB: ab, BC: bc, CD: cd, DA: da }, angulos: { A: aA, B: aB, C: aC, D: aD },
      sumaAngulos: pol.sumaInteriores, area: pol.area, perimetro: pol.perimetro,
      paralelos: { AB_CD: p1, BC_AD: p2 }, rectos: { A: rectos[0], B: rectos[1], C: rectos[2], D: rectos[3] },
      diagonales, convexo: pol.convexo, simple: pol.simple, degenerado: false, tipo, nombres, trapecio,
      esParalelogramo: nombres.includes('paralelogramo'), esRectangulo: nombres.includes('rectángulo'),
      esRombo: nombres.includes('rombo'), esCuadrado: nombres.includes('cuadrado'), esTrapecio: nombres.includes('trapecio'),
      ladoEnEje, diagonalesEnEje: diagEnEje,
      errores: { nombres: sinCorrecta(errNombres, nombres) },
    };
  }

  // Trapecio por sus bases: la mediana (une los puntos medios de los laterales) y el segmento que une los puntos
  // medios de las diagonales.
  function trapecioBases(o) {
    if (!o || typeof o !== 'object') throw new Error('faltan las bases { B, b }');
    const B = positivo(o.B, 'la base mayor'), b = positivo(o.b, 'la base menor');
    if (b > B) throw new Error('la base menor no puede ser mayor que la base mayor');
    if (iguales(b, B)) throw new Error('con las dos bases iguales es un paralelogramo, no un trapecio');
    const mediana = limpio((B + b) / 2), seg = limpio((B - b) / 2);
    return {
      B, b, mediana, segmentoDiagonales: seg,
      errores: {
        mediana: sinCorrecta({
          resta: B - b,              // la mediana como B − b (hipótesis)
          suma: B + b,               // olvida dividir entre 2
          mitadDeLaResta: (B - b) / 2,   // confunde con el segmento entre los puntos medios de las diagonales
        }, mediana),
        segmentoDiagonales: sinCorrecta({ comoMediana: (B + b) / 2, resta: B - b }, seg),
      },
    };
  }

  return { TOL, NOMBRES, nombre, poligono, nDesdeAngulo, nDesdeSuma, nDesdeDiagonales, diagonalesDesdeVertices,
    regular, verticesRegular, triangulacion, listaDiagonales, poligonoVertices, girar, rombo, cuadrilatero, trapecio: trapecioBases };
});
