/*
 * Motor de «La región que se arma»: programación lineal con dos variables.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorProgLineal) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json. Todo se calcula con fracciones exactas: los vértices,
 * los valores de la función objetivo y las pendientes nunca pasan por decimales.
 *
 * Una restricción a·x + b·y (≤, <, ≥, >, =) c se escribe como lista [a, b, '<=', c] o como objeto
 * { a, b, op, c }; op acepta '<=', '<', '>=', '>', '=' y también '≤', '≥'. La función objetivo
 * z = a·x + b·y va como [a, b] o { a, b }. Los puntos son [x, y] y se escriben (x; y), con punto y coma.
 *
 *   restriccion(r)                      la restricción normalizada y su texto (3x + y ≤ 21)
 *   traducir({ porUnidad, total, frase })   de «cada chompa usa 3 h… a lo más 21 h» a 3x + y ≤ 21
 *   prueba({ r, P })                    reemplaza un punto: 3·0 + 0 = 0 ≤ 21, ¿cumple?
 *   semiplano({ r })                    recta frontera (continua o punteada), qué lado se sombrea, prueba del origen,
 *                                       despeje en y (con el sentido invertido si se divide entre un negativo)
 *   interseccion({ r1, r2 })            el punto donde se cruzan dos rectas frontera, o paralelas / coincidentes
 *   vertices({ restricciones, noNegativas })   vértices de la región (con x ≥ 0 e y ≥ 0 si se piden), en orden
 *                                       antihorario; si es vacía y si es acotada
 *   poligono({ restricciones, noNegativas, ventana })   la región recortada a una ventana, para dibujarla
 *   evaluar({ objetivo, P })            z en un punto, con la cuenta
 *   optimizar({ restricciones, noNegativas, objetivo, sentido, anterior })
 *                                       método de los vértices: tabla, máximo o mínimo, óptimo único o un lado entero
 *                                       (óptimos múltiples), sin óptimo si la región no es acotada en esa dirección
 *                                       o si es vacía; rango de z para deslizar la recta de nivel
 *   rectaNivel({ objetivo, k })         la recta z = k: pendiente −a/b, cortes, gradiente (dirección de mejora)
 *   desplazar({ objetivo, k1, k2 })     cuánto y hacia dónde se mueve la recta de nivel al pasar de k1 a k2
 *   redundante({ restricciones, noNegativas, indice })   si quitar una restricción cambia o no la región
 *
 * Cada resultado que es la respuesta de una predicción trae 'errores': lo que da cada error típico.
 * Un error que con esos números da lo mismo que la respuesta correcta NO va en 'errores': va en 'coinciden'.
 * Si dos errores dan lo mismo, queda el primero y el otro va a 'repetidos' ({ otro: 'primero' }).
 *
 * Códigos de error (docs/investigacion/algebra-funciones-ideas-erroneas.md no tiene datos de programación lineal):
 *   PL1  sombrear el lado contrario (no probar con un punto)                        hipótesis
 *   PL2  recta continua por punteada o al revés (≤ contra <)                        hipótesis
 *   PL3  creer que el óptimo está en el interior de la región                       hipótesis
 *   PL4  el óptimo es el vértice más lejano del origen (o el más cercano, al minimizar)   hipótesis
 *   PL5  el óptimo es el vértice de mayor x (o de mayor y)                          hipótesis
 *   PL6  olvidar x ≥ 0 e y ≥ 0                                                      hipótesis
 *   PL7  evaluar solo algunos vértices (por ejemplo, solo los de los ejes)          hipótesis
 *   PL8  confundir máximo con mínimo                                                hipótesis
 *   PL9  creer que el óptimo siempre es único                                       hipótesis
 *   PL10 intersección mal calculada (coordenadas cruzadas, cortes mezclados, signo al despejar)   hipótesis
 *   PL11 pendiente de la recta objetivo mal leída (−b/a o a/b en vez de −a/b)       hipótesis
 *   PL12 tratar la inecuación como ecuación: solo la recta                          parcial (mismo mecanismo que AL19,
 *        Tsamir y Almog 2001, con cautela: allí son inecuaciones de una variable)
 *   PL13 no invertir el sentido al dividir entre un negativo al despejar y          hipótesis (es AL20, que el informe
 *        también tiene como hipótesis)
 *   PL14 coeficientes cruzados al traducir el enunciado (3x + y por x + 3y)         parcial (se parece a la inversión de
 *        AL1, Clement 1982, pero no es el mismo ítem)
 *   PL15 «a lo más» leído como ≥                                                    hipótesis
 *   PL16 en una región no acotada, dar como máximo el mejor vértice                 hipótesis
 *   PL17 tomar como óptimo un cruce de rectas que no cumple todas las restricciones hipótesis
 *   PL18 creer que toda restricción nueva agrega un vértice o baja el óptimo        hipótesis
 *   PL19 dirección de mejora al revés (la recta de nivel se acerca al origen al subir k)   hipótesis
 *   PL20 tomar el origen como mínimo aunque no esté en la región                    hipótesis
 *   PL21 creer que el óptimo no cambia al cambiar los precios                       hipótesis
 *   PL22 creer que una región no acotada no tiene ni mínimo ni máximo               hipótesis
 *   PL23 ignorar una restricción nueva y quedarse con el óptimo de antes            hipótesis
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorProgLineal = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MENOS = '−';

  // ---------- Fracciones exactas ----------
  function mcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
  function F(n, d) {
    if (d === undefined) d = 1;
    if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d)) throw new Error('números demasiado grandes para el motor');
    if (d === 0) throw new Error('división entre cero');
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d) || 1;
    return { n: n / g + 0, d: d / g };
  }
  const CERO = F(0), UNO = F(1);
  const fSum = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
  const fRes = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
  const fMul = (a, b) => F(a.n * b.n, a.d * b.d);
  const fDiv = (a, b) => { if (b.n === 0) throw new Error('división entre cero'); return F(a.n * b.d, a.d * b.n); };
  const fNeg = a => F(-a.n, a.d);
  const fCmp = (a, b) => Math.sign(a.n * b.d - b.n * a.d);
  const fIgual = (a, b) => a.n === b.n && a.d === b.d;
  const fNum = a => a.n / a.d + 0;
  const fSigno = a => Math.sign(a.n);
  function aF(x, que) {
    if (x && typeof x === 'object' && 'n' in x && 'd' in x) return F(x.n, x.d);
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que || 'el valor'} debe ser un número`);
    for (let q = 1; q <= 1e6; q *= 10) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    for (let q = 2; q <= 2000; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    throw new Error(`${que || 'el valor'} no tiene una fracción exacta corta`);
  }
  const txF = a => (a.n < 0 ? MENOS : '') + (a.d === 1 ? String(Math.abs(a.n)) : `${Math.abs(a.n)}/${a.d}`);

  // ---------- Puntos ----------
  function punto(P, que) {
    if (!Array.isArray(P) || P.length !== 2) throw new Error(`${que || 'el punto'} debe ser [x, y]`);
    return [aF(P[0], `la x de ${que || 'el punto'}`), aF(P[1], `la y de ${que || 'el punto'}`)];
  }
  const txP = P => `(${txF(P[0])}; ${txF(P[1])})`;
  const numP = P => [fNum(P[0]), fNum(P[1])];
  const mismoPunto = (P, Q) => fIgual(P[0], Q[0]) && fIgual(P[1], Q[1]);
  const pt = P => ({ punto: numP(P), texto: txP(P) });

  // ---------- Restricciones ----------
  const OPS = { '<=': '<=', '≤': '<=', '<': '<', '>=': '>=', '≥': '>=', '>': '>', '=': '=' };
  const SIMBOLO = { '<=': '≤', '<': '<', '>=': '≥', '>': '>', '=': '=' };
  const OPUESTO = { '<=': '>=', '<': '>', '>=': '<=', '>': '<', '=': '=' };
  function norm(r, que) {
    que = que || 'la restricción';
    let a, b, op, c;
    if (Array.isArray(r)) [a, b, op, c] = r;
    else if (r && typeof r === 'object') ({ a, b, op, c } = r);
    else throw new Error(`${que} debe ser [a, b, op, c] o { a, b, op, c }`);
    if (r && r._norm) return r;
    const o = OPS[op];
    if (!o) throw new Error(`${que}: el signo debe ser ≤, <, ≥, > o =`);
    const R = { a: aF(a, `${que}: a`), b: aF(b, `${que}: b`), op: o, c: aF(c, `${que}: c`), _norm: true };
    if (R.a.n === 0 && R.b.n === 0) throw new Error(`${que}: a y b no pueden ser los dos cero`);
    return R;
  }
  // a·x + b·y como texto: 3x + y, −x + 2y, (1/2)x, 0 se omite
  function lado(a, b) {
    const term = (k, v, primero) => {
      if (k.n === 0) return '';
      const abs = F(Math.abs(k.n), k.d), coef = fIgual(abs, UNO) ? '' : (abs.d === 1 ? String(abs.n) : `(${txF(abs)})`);
      const s = k.n < 0 ? (primero ? MENOS : ` ${MENOS} `) : (primero ? '' : ' + ');
      return s + coef + v;
    };
    const t1 = term(a, 'x', true);
    return t1 + term(b, 'y', t1 === '');
  }
  const texto = R => `${lado(R.a, R.b)} ${SIMBOLO[R.op]} ${txF(R.c)}`;
  // a·x₀ + b·y₀ con los números: 3·5 + 6, 2·0 − 0, −(−2) + 4·3
  function cuenta(a, b, P) {
    const par = k => (k.n < 0 ? `(${txF(k)})` : txF(k));
    const term = (k, x, primero) => {
      if (k.n === 0) return '';
      const abs = F(Math.abs(k.n), k.d), t = fIgual(abs, UNO) ? par(x) : `${txF(abs)}·${par(x)}`;
      return (k.n < 0 ? (primero ? MENOS : ` ${MENOS} `) : (primero ? '' : ' + ')) + t;
    };
    const t1 = term(a, P[0], true);
    return t1 + term(b, P[1], t1 === '');
  }
  const valorEn = (R, P) => fSum(fMul(R.a, P[0]), fMul(R.b, P[1]));
  function cumpleR(R, P, cerrada) {
    const s = fCmp(valorEn(R, P), R.c);
    switch (R.op) {
      case '<=': return s <= 0;
      case '<': return cerrada ? s <= 0 : s < 0;
      case '>=': return s >= 0;
      case '>': return cerrada ? s >= 0 : s > 0;
      default: return s === 0;
    }
  }
  const NONEG = [norm([1, 0, '>=', 0]), norm([0, 1, '>=', 0])];
  function lista(restricciones, noNegativas) {
    if (!Array.isArray(restricciones) || !restricciones.length) throw new Error('faltan las restricciones');
    const L = restricciones.map((r, i) => norm(r, `la restricción ${i + 1}`));
    return noNegativas ? L.concat(NONEG) : L;
  }
  function restriccion(r) {
    const R = norm(r);
    return { a: fNum(R.a), b: fNum(R.b), op: R.op, simbolo: SIMBOLO[R.op], c: fNum(R.c), texto: texto(R), frontera: `${lado(R.a, R.b)} = ${txF(R.c)}` };
  }

  // Reparte los errores (como en las otras escenas): coinciden, repetidos y noAplica
  const casi = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  function igualErr(a, b) {
    if (a.texto !== undefined && b.texto !== undefined) return a.texto === b.texto;
    return JSON.stringify(a) === JSON.stringify(b);
  }
  function apartar(errores, correcta) {
    const r = {}, coinciden = [], noAplica = [], repetidos = {};
    for (const [k, v] of Object.entries(errores)) {
      if (v === null || v === undefined) { noAplica.push(k); continue; }
      if (igualErr(v, correcta)) { coinciden.push(k); continue; }
      const antes = Object.keys(r).find(q => igualErr(r[q], v));
      if (antes) repetidos[k] = antes; else r[k] = v;
    }
    return { errores: r, coinciden, noAplica, repetidos };
  }

  // ---------- Traducir el enunciado ----------
  const FRASES = {
    'a lo más': '<=', 'como máximo': '<=', 'no más de': '<=', 'hasta': '<=',
    'al menos': '>=', 'como mínimo': '>=', 'no menos de': '>=', 'por lo menos': '>=',
    'menos de': '<', 'más de': '>', 'exactamente': '='
  };
  function traducir(o) {
    if (!o || !Array.isArray(o.porUnidad) || o.porUnidad.length !== 2) throw new Error('porUnidad debe ser [lo que usa cada x, lo que usa cada y]');
    const op = FRASES[o.frase];
    if (!op) throw new Error(`no conozco la frase «${o.frase}»`);
    const [p, q] = o.porUnidad, R = norm([p, q, op, o.total]);
    const conOp = nuevo => texto(Object.assign({}, R, { op: nuevo }));
    const cruz = norm([q, p, op, o.total]);
    const estricto = { '<=': '<', '>=': '>', '<': '<=', '>': '>=', '=': null }[op];
    const errores = {
      cruzada: { texto: texto(cruz) },                                     // PL14
      sentido: op === '=' ? null : { texto: conOp(OPUESTO[op]) },          // PL15
      igualdad: op === '=' ? null : { texto: conOp('=') },                 // PL12
      estricta: estricto ? { texto: conOp(estricto) } : null               // PL2
    };
    const ap = apartar(errores, { texto: texto(R) });
    return Object.assign({ op, simbolo: SIMBOLO[op], texto: texto(R), restriccion: [fNum(R.a), fNum(R.b), op, fNum(R.c)] }, ap);
  }

  // ---------- Probar un punto ----------
  function prueba(o) {
    const R = norm(o.r), P = punto(o.P, 'el punto de prueba'), v = valorEn(R, P);
    const cumple = cumpleR(R, P, false), enFrontera = fIgual(v, R.c);
    return { izquierda: fNum(v), derecha: fNum(R.c), cumple, enFrontera,
      texto: `${cuenta(R.a, R.b, P)} = ${txF(v)} ${SIMBOLO[R.op]} ${txF(R.c)}`, veredicto: cumple ? 'cumple' : 'no cumple' };
  }

  // ---------- Semiplano ----------
  function semiplano(o) {
    const R = norm(o.r);
    const trazo = R.op === '=' ? 'solo la recta' : (R.op === '<' || R.op === '>') ? 'punteada' : 'continua';
    const O = [CERO, CERO], pasaOrigen = R.c.n === 0;
    const origen = cumpleR(R, O, false);
    let ladoS;
    if (R.op === '=') ladoS = 'solo la recta';
    else if (pasaOrigen) ladoS = 'la frontera pasa por el origen';
    else ladoS = origen ? 'origen' : 'contrario';
    // Punto de prueba si la frontera pasa por el origen: (1; 0) o (0; 1)
    let otraPrueba = null;
    if (pasaOrigen && R.op !== '=') { const Q = R.a.n !== 0 ? [UNO, CERO] : [CERO, UNO]; otraPrueba = { punto: numP(Q), texto: txP(Q), cumple: cumpleR(R, Q, false) }; }
    // Despeje: y (op) m x + q; si b < 0, al dividir se invierte el sentido. Si b = 0, x (op) k.
    let despeje, sinInvertir = null;
    const sentidoY = op => ({ '<=': 'abajo', '<': 'abajo', '>=': 'arriba', '>': 'arriba', '=': 'sobre la recta' }[op]);
    const sentidoX = op => ({ '<=': 'izquierda', '<': 'izquierda', '>=': 'derecha', '>': 'derecha', '=': 'sobre la recta' }[op]);
    if (R.b.n !== 0) {
      const m = fNeg(fDiv(R.a, R.b)), q = fDiv(R.c, R.b), op = fSigno(R.b) < 0 ? OPUESTO[R.op] : R.op;
      const der = (m.n === 0 ? '' : lado(m, CERO)) + (q.n === 0 ? (m.n === 0 ? '0' : '') : (m.n === 0 ? txF(q) : (q.n < 0 ? ` ${MENOS} ${txF(F(-q.n, q.d))}` : ` + ${txF(q)}`)));
      despeje = { texto: `y ${SIMBOLO[op]} ${der}`, sentido: sentidoY(op), pendiente: fNum(m), pendienteTexto: txF(m), corteY: fNum(q) };
      if (fSigno(R.b) < 0 && R.op !== '=') sinInvertir = { texto: `y ${SIMBOLO[R.op]} ${der}`, sentido: sentidoY(R.op) };   // PL13
    } else {
      const k = fDiv(R.c, R.a), op = fSigno(R.a) < 0 ? OPUESTO[R.op] : R.op;
      despeje = { texto: `x ${SIMBOLO[op]} ${txF(k)}`, sentido: sentidoX(op), pendiente: null, pendienteTexto: null, corteY: null };
      if (fSigno(R.a) < 0 && R.op !== '=') sinInvertir = { texto: `x ${SIMBOLO[R.op]} ${txF(k)}`, sentido: sentidoX(R.op) };
    }
    const cortes = { x: R.a.n === 0 ? null : fNum(fDiv(R.c, R.a)), y: R.b.n === 0 ? null : fNum(fDiv(R.c, R.b)) };
    const opuestoLado = { origen: 'contrario', contrario: 'origen' }[ladoS];
    const correcta = { texto: `${ladoS}|${trazo}` };
    const errores = {
      ladoContrario: opuestoLado ? { lado: opuestoLado, texto: `${opuestoLado}|${trazo}` } : null,           // PL1
      trazoContrario: trazo === 'solo la recta' ? null : { trazo: trazo === 'continua' ? 'punteada' : 'continua', texto: `${ladoS}|${trazo === 'continua' ? 'punteada' : 'continua'}` },  // PL2
      comoEcuacion: R.op === '=' ? null : { trazo: 'solo la recta', texto: 'solo la recta|solo la recta' },   // PL12
      sinInvertir: sinInvertir ? Object.assign({}, sinInvertir, { texto: `despeje|${sinInvertir.texto}` }) : null   // PL13
    };
    const ap = apartar(errores, correcta);
    return Object.assign({ texto: texto(R), frontera: `${lado(R.a, R.b)} = ${txF(R.c)}`, trazo, lado: ladoS, origen: { cumple: origen, texto: prueba({ r: R, P: [0, 0] }).texto },
      otraPrueba, despeje, cortes }, ap);
  }

  // ---------- Intersección de dos rectas frontera ----------
  function cruce(R1, R2) {
    const det = fRes(fMul(R1.a, R2.b), fMul(R2.a, R1.b));
    if (det.n === 0) return null;
    const x = fDiv(fRes(fMul(R1.c, R2.b), fMul(R2.c, R1.b)), det);
    const y = fDiv(fRes(fMul(R1.a, R2.c), fMul(R2.a, R1.c)), det);
    return [x, y];
  }
  function interseccion(o) {
    const R1 = norm(o.r1, 'la primera recta'), R2 = norm(o.r2, 'la segunda recta');
    const P = cruce(R1, R2);
    if (!P) {
      // ¿la misma recta? a1/a2 = b1/b2 = c1/c2
      const coinc = fIgual(fMul(R1.a, R2.c), fMul(R2.a, R1.c)) && fIgual(fMul(R1.b, R2.c), fMul(R2.b, R1.c));
      return { tipo: coinc ? 'coincidentes' : 'paralelas', punto: null, texto: coinc ? 'la misma recta' : 'no se cortan', errores: {}, coinciden: [], noAplica: [], repetidos: {} };
    }
    const cx1 = R1.a.n === 0 ? null : fDiv(R1.c, R1.a), cy2 = R2.b.n === 0 ? null : fDiv(R2.c, R2.b);
    // Signo al despejar: la x sale bien, pero de la segunda recta se despeja y = (c₂ + a₂x)/b₂ (AL16, hipótesis)
    const ySigno = R2.b.n === 0 ? null : fDiv(fSum(R2.c, fMul(R2.a, P[0])), R2.b);
    const errores = {
      intercambiada: pt([P[1], P[0]]),                                       // PL10
      cortesMezclados: cx1 && cy2 ? pt([cx1, cy2]) : null,                   // PL10
      signoDespeje: ySigno ? pt([P[0], ySigno]) : null                       // PL10 (AL16)
    };
    const ap = apartar(errores, pt(P));
    return Object.assign({ tipo: 'punto' }, pt(P), ap);
  }

  // ---------- Vértices de la región ----------
  // Ordena puntos en sentido antihorario alrededor de su promedio, empezando por el de menor y (y menor x).
  function ordenar(Ps) {
    if (Ps.length < 3) return Ps.slice().sort((P, Q) => fCmp(P[1], Q[1]) || fCmp(P[0], Q[0]));
    const cx = Ps.reduce((s, P) => s + fNum(P[0]), 0) / Ps.length, cy = Ps.reduce((s, P) => s + fNum(P[1]), 0) / Ps.length;
    const ang = P => Math.atan2(fNum(P[1]) - cy, fNum(P[0]) - cx);
    const inicio = Ps.slice().sort((P, Q) => fCmp(P[1], Q[1]) || fCmp(P[0], Q[0]))[0], a0 = ang(inicio);
    const rel = P => { let a = ang(P) - a0; while (a < -1e-12) a += 2 * Math.PI; return a; };
    return Ps.slice().sort((P, Q) => rel(P) - rel(Q));
  }
  // Direcciones en las que la región se va al infinito (cono de recesión): d con a·d ≤ 0 en cada ≤, etc.
  function enCono(L, d) {
    return L.every(R => {
      const s = fSigno(fSum(fMul(R.a, d[0]), fMul(R.b, d[1])));
      return R.op === '=' ? s === 0 : (R.op === '<=' || R.op === '<') ? s <= 0 : s >= 0;
    });
  }
  function direccionesCandidatas(L, extra) {
    const D = [];
    for (const R of L) { D.push([fNeg(R.b), R.a], [R.b, fNeg(R.a)], [R.a, R.b], [fNeg(R.a), fNeg(R.b)]); }
    D.push([UNO, CERO], [CERO, UNO], [fNeg(UNO), CERO], [CERO, fNeg(UNO)]);
    if (extra) D.push(...extra);
    return D.filter(d => d[0].n !== 0 || d[1].n !== 0);
  }
  function analizar(L) {
    const Ps = [];
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
      const P = cruce(L[i], L[j]); if (!P) continue;
      if (!L.every(R => cumpleR(R, P, true))) continue;
      const ya = Ps.find(V => mismoPunto(V.P, P));
      if (ya) { if (!ya.rectas.includes(i)) ya.rectas.push(i); if (!ya.rectas.includes(j)) ya.rectas.push(j); continue; }
      Ps.push({ P, rectas: [i, j] });
    }
    let vacia = Ps.length === 0;
    if (vacia) {
      // Sin vértices, la región (si existe) contiene una recta: basta probar el origen y un punto de cada frontera
      const cand = [[CERO, CERO]];
      for (const R of L) cand.push(R.b.n !== 0 ? [CERO, fDiv(R.c, R.b)] : [fDiv(R.c, R.a), CERO]);
      vacia = !cand.some(P => L.every(R => cumpleR(R, P, true)));
    }
    const acotada = !vacia && !direccionesCandidatas(L).some(d => enCono(L, d));
    const orden = ordenar(Ps.map(v => v.P));
    const vs = orden.map(P => { const v = Ps.find(q => mismoPunto(q.P, P)); return { P, rectas: v.rectas.sort((a, b) => a - b), enRegion: L.every(R => cumpleR(R, P, false)) }; });
    return { vacia, acotada, vs };
  }
  function vertices(o) {
    const L = lista(o.restricciones, o.noNegativas), A = analizar(L);
    return { vacia: A.vacia, acotada: A.vacia ? null : A.acotada, n: A.vs.length,
      vertices: A.vs.map(v => Object.assign(pt(v.P), { rectas: v.rectas, enRegion: v.enRegion })),
      textos: A.vs.map(v => txP(v.P)) };
  }

  // ---------- Polígono para dibujar (recortado a una ventana) ----------
  function recortar(poli, R) {
    const lado = P => { const s = fCmp(valorEn(R, P), R.c); return (R.op === '<=' || R.op === '<') ? s <= 0 : (R.op === '>=' || R.op === '>') ? s >= 0 : s === 0; };
    if (R.op === '=') {
      // la región es un segmento de la recta: se queda con los cruces del borde con la recta
      const out = [];
      for (let i = 0; i < poli.length; i++) {
        const P = poli[i], Q = poli[(i + 1) % poli.length];
        if (lado(P)) out.push(P);
        const vp = fRes(valorEn(R, P), R.c), vq = fRes(valorEn(R, Q), R.c);
        if (fSigno(vp) * fSigno(vq) < 0) { const t = fDiv(vp, fRes(vp, vq)); out.push([fSum(P[0], fMul(t, fRes(Q[0], P[0]))), fSum(P[1], fMul(t, fRes(Q[1], P[1])))]); }
      }
      return out.filter((P, i) => !out.slice(0, i).some(Q => mismoPunto(P, Q)));
    }
    const out = [];
    for (let i = 0; i < poli.length; i++) {
      const P = poli[i], Q = poli[(i + 1) % poli.length], inP = lado(P), inQ = lado(Q);
      if (inP) out.push(P);
      if (inP !== inQ) {
        const vp = fRes(valorEn(R, P), R.c), vq = fRes(valorEn(R, Q), R.c);
        if (vp.n !== 0 && vq.n !== 0) { const t = fDiv(vp, fRes(vp, vq)); out.push([fSum(P[0], fMul(t, fRes(Q[0], P[0]))), fSum(P[1], fMul(t, fRes(Q[1], P[1])))]); }
      }
    }
    return out.filter((P, i) => !out.slice(0, i).some(Q => mismoPunto(P, Q)));
  }
  function poligono(o) {
    const L = lista(o.restricciones, o.noNegativas), v = o.ventana;
    if (!v) throw new Error('falta la ventana { x0, x1, y0, y1 }');
    const [x0, x1, y0, y1] = [aF(v.x0), aF(v.x1), aF(v.y0), aF(v.y1)];
    let poli = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    for (const R of L) { poli = recortar(poli, R); if (!poli.length) break; }
    return { vacia: poli.length === 0, puntos: poli.map(numP), textos: poli.map(txP) };
  }

  // ---------- Función objetivo ----------
  function obj(o) {
    if (Array.isArray(o)) return { a: aF(o[0], 'a de z'), b: aF(o[1], 'b de z') };
    if (o && typeof o === 'object') return { a: aF(o.a, 'a de z'), b: aF(o.b, 'b de z') };
    throw new Error('el objetivo debe ser [a, b] o { a, b }');
  }
  const zEn = (Z, P) => fSum(fMul(Z.a, P[0]), fMul(Z.b, P[1]));
  const cuentaZ = (Z, P) => `${cuenta(Z.a, Z.b, P)} = ${txF(zEn(Z, P))}`;
  function evaluar(o) {
    const Z = obj(o.objetivo), P = punto(o.P);
    return { valor: fNum(zEn(Z, P)), texto: txF(zEn(Z, P)), cuenta: cuentaZ(Z, P) };
  }
  const textoZ = Z => `z = ${lado(Z.a, Z.b)}`;

  function optimizar(o) {
    const L = lista(o.restricciones, o.noNegativas), Z = obj(o.objetivo);
    const sentido = o.sentido === 'min' ? 'min' : 'max', mejor = sentido === 'max' ? 1 : -1;
    if (o.sentido && o.sentido !== 'min' && o.sentido !== 'max') throw new Error("sentido debe ser 'max' o 'min'");
    const A = analizar(L);
    const base = { sentido, objetivo: textoZ(Z), gradiente: [fNum(Z.a), fNum(Z.b)], direccion: sentido === 'max' ? [fNum(Z.a), fNum(Z.b)] : [-fNum(Z.a), -fNum(Z.b)] };
    if (A.vacia) return Object.assign(base, { tipo: 'vacia', valor: null, texto: 'no hay: la región es vacía', optimos: [], lado: null, tabla: [], rango: null, errores: {}, coinciden: [], noAplica: [], repetidos: {} });
    const tabla = A.vs.map(v => ({ P: v.P, z: zEn(Z, v.P), enRegion: v.enRegion }));
    const filas = tabla.map(f => Object.assign(pt(f.P), { valor: fNum(f.z), z: txF(f.z), cuenta: cuentaZ(Z, f.P) }));
    // ¿Se puede mejorar sin fin? Una dirección del cono de recesión con c·d > 0 (max) o < 0 (min)
    const dirs = direccionesCandidatas(L, [[Z.a, Z.b], [fNeg(Z.a), fNeg(Z.b)]]).filter(d => enCono(L, d));
    const mejora = d => mejor * fSigno(fSum(fMul(Z.a, d[0]), fMul(Z.b, d[1]))) > 0;
    const sinFin = dirs.some(mejora);
    const peor = dirs.some(d => -mejor * fSigno(fSum(fMul(Z.a, d[0]), fMul(Z.b, d[1]))) > 0);
    const zs = tabla.map(f => f.z);
    const mx = zs.length ? zs.reduce((m, z) => (fCmp(z, m) > 0 ? z : m)) : null, mn = zs.length ? zs.reduce((m, z) => (fCmp(z, m) < 0 ? z : m)) : null;
    const rango = { min: (sentido === 'max' ? peor : sinFin) || mn === null ? null : fNum(mn), max: (sentido === 'max' ? sinFin : peor) || mx === null ? null : fNum(mx) };
    // Errores que dependen de los vértices (cada uno da un vértice y su z)
    const fila = P => { const f = filas.find(q => q.texto === txP(P)); return f ? { punto: f.punto, texto: f.texto, valor: f.valor } : null; };
    const elegir = (cands, clave) => { if (!cands.length) return null; let m = cands[0]; for (const c of cands) if (clave(c, m) > 0) m = c; return fila(m.P); };
    const d2 = P => fSum(fMul(P[0], P[0]), fMul(P[1], P[1]));
    const optDe = signo => { const zz = signo > 0 ? mx : mn; return tabla.filter(f => fIgual(f.z, zz)); };
    const errVert = {
      sentidoContrario: (() => { if (peor) return null; const fs = optDe(-mejor); return fs.length === 1 ? fila(fs[0].P) : null; })(),   // PL8
      masLejano: elegir(tabla, (a, b) => fCmp(d2(a.P), d2(b.P))),                                    // PL4
      masCercano: elegir(tabla, (a, b) => -fCmp(d2(a.P), d2(b.P))),                                  // PL4 (al minimizar)
      mayorX: elegir(tabla, (a, b) => fCmp(a.P[0], b.P[0]) || fCmp(a.P[1], b.P[1])),                // PL5
      mayorY: elegir(tabla, (a, b) => fCmp(a.P[1], b.P[1]) || fCmp(a.P[0], b.P[0])),                // PL5
      soloEjes: elegir(tabla.filter(f => f.P[0].n === 0 || f.P[1].n === 0), (a, b) => mejor * fCmp(a.z, b.z)),   // PL7
      soloCruces: elegir(tabla.filter(f => f.P[0].n !== 0 && f.P[1].n !== 0), (a, b) => mejor * fCmp(a.z, b.z)), // PL7
      origen: (() => { const O = [CERO, CERO]; if (L.every(R => cumpleR(R, O, true))) return null; return { punto: [0, 0], texto: txP(O), valor: 0 }; })(),   // PL20
      anterior: (() => {                                                                               // PL21
        if (!o.anterior) return null;
        const Z0 = obj(o.anterior), z0 = tabla.map(f => zEn(Z0, f.P));
        const m0 = z0.reduce((m, z) => (mejor * fCmp(z, m) > 0 ? z : m)), fs = tabla.filter((f, i) => fIgual(z0[i], m0));
        return fs.length === 1 ? fila(fs[0].P) : null; })()
    };
    // Un punto interior: el promedio de los vértices (si la región es acotada y tiene área)
    let interior = null;
    if (A.acotada && A.vs.length >= 3) {
      const n = F(A.vs.length), C = [fDiv(A.vs.reduce((s, v) => fSum(s, v.P[0]), CERO), n), fDiv(A.vs.reduce((s, v) => fSum(s, v.P[1]), CERO), n)];
      interior = Object.assign(pt(C), { valor: fNum(zEn(Z, C)) });                                    // PL3
    }
    if (sinFin) {
      // Sin óptimo en ese sentido: el error es dar el mejor vértice como si la región fuera cerrada (PL16)
      const mv = elegir(tabla, (a, b) => mejor * fCmp(a.z, b.z));
      const errores = Object.assign({ soloVertices: mv }, { origen: errVert.origen });
      const ap = apartar(errores, { texto: 'sin óptimo' });
      return Object.assign(base, { tipo: 'noAcotado', valor: null, texto: sentido === 'max' ? 'no hay máximo: z crece sin fin' : 'no hay mínimo: z baja sin fin',
        optimos: [], lado: null, tabla: filas, rango, acotada: A.acotada }, ap);
    }
    const zOpt = sentido === 'max' ? mx : mn, opts = tabla.filter(f => fIgual(f.z, zOpt));
    const multiple = opts.length > 1;
    const alcanzado = opts.some(f => f.enRegion);
    const correcta = multiple ? { texto: opts.map(f => txP(f.P)).join(' a ') } : { texto: txP(opts[0].P) };
    // Para óptimos múltiples, quedarse con uno solo (PL9): cada vértice del lado es un error distinto
    const errores = Object.assign({ unicoPrimero: multiple ? fila(opts[0].P) : null, unicoUltimo: multiple ? fila(opts[opts.length - 1].P) : null },   // PL9
      errVert, { interior });
    // Si el óptimo es un lado, un vértice de ese lado no es «la» respuesta, pero da el mismo z: lo dejamos como error
    const igual = v => (multiple ? false : v.texto === correcta.texto);
    const r = {}, coinciden = [], noAplica = [], repetidos = {};
    for (const [k, v] of Object.entries(errores)) {
      if (v === null || v === undefined) { noAplica.push(k); continue; }
      if (igual(v)) { coinciden.push(k); continue; }
      const antes = Object.keys(r).find(q => r[q].texto === v.texto);
      if (antes) repetidos[k] = antes; else r[k] = v;
    }
    return Object.assign(base, { tipo: multiple ? 'multiple' : 'unico', valor: fNum(zOpt), texto: txF(zOpt), alcanzado,
      optimo: numP(opts[0].P), optimoTexto: txP(opts[0].P), optimos: opts.map(f => txP(f.P)), lado: multiple ? [numP(opts[0].P), numP(opts[opts.length - 1].P)] : null,
      tabla: filas, rango, acotada: A.acotada, errores: r, coinciden, noAplica, repetidos });
  }

  // ---------- Recta de nivel ----------
  function rectaNivel(o) {
    const Z = obj(o.objetivo), k = aF(o.k === undefined ? 0 : o.k, 'k');
    const vertical = Z.b.n === 0;
    const m = vertical ? null : fNeg(fDiv(Z.a, Z.b));
    const R = { a: Z.a, b: Z.b, op: '=', c: k };
    const errores = {
      invertida: vertical || Z.a.n === 0 ? null : { pendiente: fNum(fNeg(fDiv(Z.b, Z.a))), texto: txF(fNeg(fDiv(Z.b, Z.a))) },   // PL11: −b/a
      signo: vertical || Z.a.n === 0 ? null : { pendiente: fNum(fDiv(Z.a, Z.b)), texto: txF(fDiv(Z.a, Z.b)) },                 // PL11: a/b
      direccionContraria: { gradiente: [-fNum(Z.a), -fNum(Z.b)], texto: 'contra' }                                         // PL19
    };
    const ap = apartar(errores, { texto: m ? txF(m) : 'vertical' });
    // Al subir k, la recta avanza en la dirección del gradiente (a; b)
    const g2 = fSum(fMul(Z.a, Z.a), fMul(Z.b, Z.b));
    const pie = [fDiv(fMul(k, Z.a), g2), fDiv(fMul(k, Z.b), g2)];   // el punto de la recta más cercano al origen
    return Object.assign({ texto: `${lado(Z.a, Z.b)} = ${txF(k)}`, pendiente: m ? fNum(m) : null, pendienteTexto: m ? txF(m) : null, vertical,
      cortes: { x: Z.a.n === 0 ? null : fNum(fDiv(k, Z.a)), y: Z.b.n === 0 ? null : fNum(fDiv(k, Z.b)) },
      gradiente: [fNum(Z.a), fNum(Z.b)], pie: numP(pie), pieTexto: txP(pie), alSubirK: 'avanza en la dirección del gradiente' }, ap);
  }
  function desplazar(o) {
    const Z = obj(o.objetivo), k1 = aF(o.k1, 'k1'), k2 = aF(o.k2, 'k2');
    const g2 = fSum(fMul(Z.a, Z.a), fMul(Z.b, Z.b)), dk = fRes(k2, k1), t = fDiv(dk, g2);
    const v = [fMul(t, Z.a), fMul(t, Z.b)];
    const d0 = Math.abs(fNum(k1)) / Math.sqrt(fNum(g2)), d1 = Math.abs(fNum(k2)) / Math.sqrt(fNum(g2));
    return { vector: numP(v), vectorTexto: txP(v), distancia: Math.abs(fNum(dk)) / Math.sqrt(fNum(g2)),
      sentido: dk.n > 0 ? 'gradiente' : dk.n < 0 ? 'contra el gradiente' : 'quieta',
      origen: d1 > d0 + 1e-12 ? 'se aleja del origen' : d1 < d0 - 1e-12 ? 'se acerca al origen' : 'a la misma distancia del origen' };
  }

  // ---------- Restricción redundante ----------
  function redundante(o) {
    const L = lista(o.restricciones, false), i = o.indice;
    if (!Number.isInteger(i) || i < 0 || i >= L.length) throw new Error('indice fuera de rango');
    const extra = o.noNegativas ? NONEG : [];
    const con = analizar(L.concat(extra)), sin = analizar(L.filter((_, j) => j !== i).concat(extra));
    const igualV = con.vs.length === sin.vs.length && con.vs.every(v => sin.vs.some(w => mismoPunto(v.P, w.P)));
    const es = con.vacia === sin.vacia && con.acotada === sin.acotada && igualV;
    // Error PL18: creer que la recta nueva agrega su corte con el eje x como vértice
    const R = L[i], cx = R.a.n === 0 ? null : [fDiv(R.c, R.a), CERO], cy = R.b.n === 0 ? null : [CERO, fDiv(R.c, R.b)];
    const nuevo = cx || cy;
    const errores = { nuevoVertice: nuevo && !con.vs.some(v => mismoPunto(v.P, nuevo)) ? pt(nuevo) : null };
    const ap = apartar(errores, { texto: es ? 'redundante' : 'cambia' });
    return Object.assign({ redundante: es, texto: texto(R), verticesCon: con.vs.map(v => txP(v.P)), verticesSin: sin.vs.map(v => txP(v.P)) }, ap);
  }

  return { restriccion, traducir, prueba, semiplano, interseccion, vertices, poligono, evaluar, optimizar, rectaNivel, desplazar, redundante,
    textoFraccion: x => txF(aF(x)), textoPunto: P => txP(punto(P)),
    textoObjetivo: o => textoZ(obj(o)), cumple: (r, P) => cumpleR(norm(r), punto(P), false) };
});
