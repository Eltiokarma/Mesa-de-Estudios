/*
 * Motor de «El plano con imán»: geometría analítica de la recta.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorAnalitica) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json. Todo se calcula con fracciones exactas; las raíces
 * quedan simplificadas (√20 = 2√5) y racionalizadas (7/√5 = 7√5/5), como en las academias.
 *
 * Los puntos son listas [x, y]; las rectas en forma general Ax + By + C = 0 son listas [A, B, C].
 * Los puntos se escriben (x; y), con punto y coma, porque la coma es decimal.
 *
 *   distancia({ A, B })                 d(A, B) = √(Δx² + Δy²), con el triángulo de catetos Δx y Δy
 *   puntoMedio({ A, B })                M = ((x₁ + x₂)/2; (y₁ + y₂)/2)
 *   divide({ A, B, m, n })              el punto P del segmento AB con AP : PB = m : n
 *   pendiente({ A, B })                 m = Δy/Δx, su signo, el ángulo de inclinación; la recta vertical no tiene
 *   recta({ A, B } | { P, m })          la recta en sus tres formas: punto-pendiente, pendiente-intercepto y general
 *   rectaGeneral([A, B, C])             lo mismo, desde la forma general
 *   posicion({ L1, L2 })                paralelas, coincidentes, perpendiculares o secantes; ángulo e intersección
 *   perpendicular({ m } | { L }, P)     la pendiente perpendicular (m₁·m₂ = −1) y, si se da P, la recta
 *   paralela({ m } | { L }, P)          la recta paralela por P
 *   distanciaPuntoRecta({ P, L })       |Ax₀ + By₀ + C|/√(A² + B²) y el pie de la perpendicular
 *   distanciaParalelas({ L1, L2 })      |C₁ − C₂|/√(A² + B²), después de igualar A y B
 *   area({ vertices })                  el «zapatito»: productos que bajan y que suben, determinante y |det|/2
 *   ordenCruzado({ vertices, orden })   qué da el zapatito si los vértices se recorren en otro orden (el lazo)
 *   masEmpinada({ m1, m2 })             cuál de dos rectas está más inclinada: la de mayor |m|
 *   circunferencia({ centro, r2 } | { A, B })   (x − h)² + (y − k)² = r² (la de diámetro AB, si se dan A y B)
 *
 * Cada resultado que es la respuesta de una predicción trae 'errores': lo que da cada error típico.
 * Respaldos (docs/investigacion/): G2 de cinemática (pendiente como cociente de un solo punto, Beichner 1994),
 * AL25 de álgebra (el orden cruzado de los puntos sale de ese mecanismo, pero el error mismo es hipótesis),
 * GE11 de geometría (Pitágoras mal aplicado, parcial). Lo demás son hipótesis nuestras.
 * Un error que con esos números da lo mismo que la respuesta correcta NO va en 'errores': va en 'coinciden'.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorAnalitica = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MENOS = '−';
  function numero(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x;
  }

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
  const fSum = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
  const fRes = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
  const fMul = (a, b) => F(a.n * b.n, a.d * b.d);
  const fDiv = (a, b) => { if (b.n === 0) throw new Error('división entre cero'); return F(a.n * b.d, a.d * b.n); };
  const fNeg = a => F(-a.n, a.d);
  const fAbs = a => F(Math.abs(a.n), a.d);
  const fIgual = (a, b) => a.n === b.n && a.d === b.d;
  const fNum = a => a.n / a.d + 0;
  const fCero = a => a.n === 0;
  // Un número de JavaScript a fracción exacta (enteros, decimales cortos o fracciones de denominador chico).
  function aF(x, que) {
    numero(x, que || 'el valor');
    for (let q = 1; q <= 1e6; q *= 10) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    for (let q = 2; q <= 2000; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    throw new Error(`${que || 'el valor'} no tiene una fracción exacta corta`);
  }
  const txF = a => (a.n < 0 ? MENOS : '') + (a.d === 1 ? String(Math.abs(a.n)) : `${Math.abs(a.n)}/${a.d}`);

  // ---------- Raíces: c·√s, con c fracción y s entero sin cuadrados ----------
  function sacarCuadrados(k) {
    let a = 1, s = k;
    for (let p = 2; p * p <= s; p++) while (s % (p * p) === 0) { s /= p * p; a *= p; }
    return { a, s };
  }
  // √f, con f fracción no negativa: √(p/q) = √(pq)/q
  function raizF(f) {
    if (f.n < 0) throw new Error('raíz de un número negativo');
    const { a, s } = sacarCuadrados(f.n * f.d);
    return { c: F(a, f.d), s };
  }
  // Un radical c·√s como resultado: { valor, texto, c, s }
  function radical(c, s) {
    const valor = fNum(c) * Math.sqrt(s);
    let texto;
    if (s === 1 || c.n === 0) texto = txF(c);
    else {
      const k = Math.abs(c.n);
      texto = (c.n < 0 ? MENOS : '') + (k === 1 ? '' : String(k)) + '√' + s + (c.d === 1 ? '' : '/' + c.d);
    }
    return { valor, texto, c: txF(c), s };
  }
  const deF = f => ({ valor: fNum(f), texto: txF(f) });
  // q/√S racionalizado, con q fracción y S fracción positiva
  // q/√S = q/(c√s) = q√s/(c·s), con √S = c√s
  function entreRaiz(q, S) { const r = raizF(S); return radical(fDiv(q, fMul(r.c, F(r.s))), r.s); }

  // ---------- Puntos y textos ----------
  function punto(P, que) {
    if (!Array.isArray(P) || P.length !== 2) throw new Error(`${que} debe ser un punto [x, y]`);
    return [aF(P[0], `la x de ${que}`), aF(P[1], `la y de ${que}`)];
  }
  const txP = P => `(${txF(P[0])}; ${txF(P[1])})`;
  const numP = P => [fNum(P[0]), fNum(P[1])];
  const mismoPunto = (P, Q) => fIgual(P[0], Q[0]) && fIgual(P[1], Q[1]);
  const pt = P => ({ punto: numP(P), texto: txP(P) });

  // Quita los errores que coinciden con la respuesta (o que no existen) y los anota en 'coinciden'.
  function apartar(errores, esIgual) {
    const r = {}, coinciden = [];
    for (const [k, v] of Object.entries(errores)) {
      if (v === null || v === undefined) continue;
      if (esIgual(v)) coinciden.push(k); else r[k] = v;
    }
    return { errores: r, coinciden };
  }
  const casi = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

  // ---------- Distancia entre dos puntos ----------
  function distancia(o) {
    const A = punto(o.A, 'A'), B = punto(o.B, 'B');
    const dx = fRes(B[0], A[0]), dy = fRes(B[1], A[1]);
    const dx2 = fMul(dx, dx), dy2 = fMul(dy, dy), d2 = fSum(dx2, dy2);
    const r = raizF(d2), d = radical(r.c, r.s);
    const sx = fSum(A[0], B[0]), sy = fSum(A[1], B[1]);
    const dif = fAbs(fRes(dx2, dy2)), rd = raizF(dif), rs = raizF(fSum(fMul(sx, sx), fMul(sy, sy)));
    const e = {
      sinRaiz: deF(d2),                                         // se queda en Δx² + Δy² (hipótesis)
      sumaCatetos: deF(fSum(fAbs(dx), fAbs(dy))),               // el camino por la rejilla: |Δx| + |Δy| (hipótesis)
      restaCuadrados: fCero(dx) || fCero(dy) ? null : radical(rd.c, rd.s),   // resta los cuadrados (GE11, parcial)
      sumaEnVezDeResta: radical(rs.c, rs.s),                    // suma las coordenadas en vez de restarlas (hipótesis)
    };
    const { errores, coinciden } = apartar(e, v => casi(v.valor, d.valor));
    return { dx: fNum(dx), dy: fNum(dy), dx2: fNum(dx2), dy2: fNum(dy2), d2: fNum(d2), valor: d.valor, texto: d.texto,
      exacta: r.s === 1, recto: numP([B[0], A[1]]), errores, coinciden };
  }

  // ---------- Punto medio y punto que divide un segmento ----------
  function puntoMedio(o) {
    const A = punto(o.A, 'A'), B = punto(o.B, 'B'), dos = F(2);
    const M = [fDiv(fSum(A[0], B[0]), dos), fDiv(fSum(A[1], B[1]), dos)];
    const e = {
      semiResta: pt([fDiv(fRes(B[0], A[0]), dos), fDiv(fRes(B[1], A[1]), dos)]),   // (x₂ − x₁)/2: la mitad de Δx (hipótesis)
      sinDividir: pt([fSum(A[0], B[0]), fSum(A[1], B[1])]),                         // suma sin dividir entre 2 (hipótesis)
      cruzaCoordenadas: pt([M[1], M[0]]),                                            // (y; x) (hipótesis)
    };
    const { errores, coinciden } = apartar(e, v => casi(v.punto[0], fNum(M[0])) && casi(v.punto[1], fNum(M[1])));
    return { x: fNum(M[0]), y: fNum(M[1]), punto: numP(M), texto: txP(M), errores, coinciden };
  }
  // AP : PB = m : n  ⇒  P = (n·A + m·B)/(m + n) = A + (m/(m + n))·(B − A)
  function divide(o) {
    const A = punto(o.A, 'A'), B = punto(o.B, 'B');
    const m = aF(o.m, 'm'), n = aF(o.n, 'n');
    if (!(fNum(m) > 0) || !(fNum(n) > 0)) throw new Error('la razón m : n debe tener m y n mayores que cero');
    const s = fSum(m, n), k = fDiv(m, s);
    const en = (t, X, Y) => fSum(X, fMul(t, fRes(Y, X)));
    const P = [en(k, A[0], B[0]), en(k, A[1], B[1])];
    const kr = fDiv(n, s), kf = fDiv(m, n);
    const e = {
      alReves: pt([en(kr, A[0], B[0]), en(kr, A[1], B[1])]),                         // pesos cruzados: (m·A + n·B)/(m + n) (hipótesis)
      comoFraccion: pt([en(kf, A[0], B[0]), en(kf, A[1], B[1])]),                    // toma m : n como la fracción m/n de AB (hipótesis)
      sinDividir: pt([fSum(fMul(n, A[0]), fMul(m, B[0])), fSum(fMul(n, A[1]), fMul(m, B[1]))]),   // olvida dividir entre m + n (hipótesis)
    };
    const { errores, coinciden } = apartar(e, v => casi(v.punto[0], fNum(P[0])) && casi(v.punto[1], fNum(P[1])));
    return { x: fNum(P[0]), y: fNum(P[1]), punto: numP(P), texto: txP(P), fraccion: txF(k), k: fNum(k), errores, coinciden };
  }

  // ---------- Pendiente ----------
  const grados = r => { const g = r * 180 / Math.PI; return Math.abs(g - Math.round(g)) < 1e-9 ? Math.round(g) : g; };
  function pendienteF(A, B) {
    const dx = fRes(B[0], A[0]), dy = fRes(B[1], A[1]);
    if (fCero(dx) && fCero(dy)) throw new Error('A y B son el mismo punto: no definen una recta');
    return { dx, dy, m: fCero(dx) ? null : fDiv(dy, dx) };
  }
  function pendiente(o) {
    const A = punto(o.A, 'A'), B = punto(o.B, 'B');
    const { dx, dy, m } = pendienteF(A, B);
    const base = { dx: fNum(dx), dy: fNum(dy), subida: fNum(dy), avance: fNum(dx) };
    if (m === null) {
      const { errores, coinciden } = apartar({ cero: deF(F(0)), subida: deF(dy) }, () => false);
      return Object.assign(base, { vertical: true, valor: null, texto: 'no existe', tipo: 'vertical', angulo: 90, errores, coinciden });
    }
    const v = fNum(m), ang = v >= 0 ? grados(Math.atan(v)) : grados(Math.PI + Math.atan(v));
    const e = {
      invertida: fCero(dy) ? null : deF(fDiv(dx, dy)),                              // Δx/Δy (hipótesis)
      ordenCruzado: deF(fNeg(m)),                                                    // (y₂ − y₁)/(x₁ − x₂) (hipótesis; mecanismo AL25)
      unPunto: fCero(B[0]) ? null : deF(fDiv(B[1], B[0])),                           // y/x de un solo punto, como si pasara por el origen (G2)
    };
    const { errores, coinciden } = apartar(e, w => casi(w.valor, v));
    return Object.assign(base, { vertical: false, valor: v, texto: txF(m), tipo: v > 0 ? 'creciente' : v < 0 ? 'decreciente' : 'horizontal',
      angulo: ang, errores, coinciden });
  }

  // ---------- La recta y sus tres formas ----------
  // Un término «coef·letra» con su signo, para encadenar: ' + 3x', ' − y', '(2/3)x'
  function termino(c, letra, primero) {
    const neg = c.n < 0, a = fAbs(c);
    let cuerpo;
    if (!letra) cuerpo = txF(a);
    else if (a.n === 1 && a.d === 1) cuerpo = letra;
    else cuerpo = (a.d === 1 ? String(a.n) : `(${txF(a)})`) + letra;
    if (primero) return (neg ? MENOS : '') + cuerpo;
    return (neg ? ` ${MENOS} ` : ' + ') + cuerpo;
  }
  // «x − 2», «x + 3» o «x»
  const menosValor = (letra, v) => (fCero(v) ? letra : `${letra}${v.n > 0 ? ` ${MENOS} ` : ' + '}${txF(fAbs(v))}`);
  function mcm(a, b) { return a / mcd(a, b) * b; }
  // Forma general con enteros primos entre sí y A > 0 (o B > 0 si A = 0)
  function normalGeneral(A, B, C) {
    const L = mcm(mcm(A.d, B.d), C.d);
    let a = A.n * (L / A.d), b = B.n * (L / B.d), c = C.n * (L / C.d);
    const g = mcd(mcd(a, b), c) || 1; a /= g; b /= g; c /= g;
    if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; c = -c; }
    return [a + 0, b + 0, c + 0];
  }
  function txGeneral(G) {
    const [a, b, c] = G.map(x => F(x));
    const partes = [];
    if (!fCero(a)) partes.push(termino(a, 'x', true));
    if (!fCero(b)) partes.push(termino(b, 'y', !partes.length));
    if (!fCero(c)) partes.push(termino(c, '', !partes.length));
    return partes.join('') + ' = 0';
  }
  function construirRecta(P, m, Q) {
    // P: un punto de la recta; m: pendiente (null si es vertical); Q: otro punto (opcional)
    if (m === null) {
      const k = P[0], G = normalGeneral(F(1), F(0), fNeg(k));
      return { vertical: true, m: null, b: null, texto: `x = ${txF(k)}`, puntoPendiente: `x = ${txF(k)}`, pendienteIntercepto: null,
        general: { A: G[0], B: G[1], C: G[2], texto: txGeneral(G) }, interceptoX: fNum(k), interceptoY: null };
    }
    const b = fRes(P[1], fMul(m, P[0]));
    const G = normalGeneral(m, F(-1), b);
    const pi = fCero(m) ? `y = ${txF(b)}` : `y = ${termino(m, 'x', true)}${fCero(b) ? '' : termino(b, '', false)}`;
    let pp;
    if (fCero(m)) pp = `${menosValor('y', P[1])} = 0`;
    else {
      const mm = fAbs(m), sig = m.n < 0 ? MENOS : '';
      const coef = mm.n === 1 && mm.d === 1 ? sig : sig + (mm.d === 1 ? String(mm.n) : `(${txF(mm)})`);
      let der;
      if (fCero(P[0])) der = coef + 'x';
      else if (coef === '') der = menosValor('x', P[0]);
      else der = `${coef}(${menosValor('x', P[0])})`;
      pp = `${menosValor('y', P[1])} = ${der}`;
    }
    return { vertical: false, m: fNum(m), mTexto: txF(m), b: fNum(b), bTexto: txF(b), texto: pi, puntoPendiente: pp, pendienteIntercepto: pi,
      general: { A: G[0], B: G[1], C: G[2], texto: txGeneral(G) },
      interceptoX: fCero(m) ? null : fNum(fDiv(fNeg(b), m)), interceptoY: fNum(b), _m: m, _b: b, _P: P, _Q: Q };
  }
  const publica = R => { const r = Object.assign({}, R); delete r._m; delete r._b; delete r._P; delete r._Q; return r; };
  function recta(o) {
    let P, m, Q = null;
    if (o.A !== undefined) {
      P = punto(o.A, 'A'); Q = punto(o.B, 'B'); m = pendienteF(P, Q).m;
    } else {
      P = punto(o.P, 'P');
      if (o.m === null || o.m === 'vertical') m = null; else m = aF(o.m, 'm');
    }
    const R = construirRecta(P, m, Q);
    if (!R.vertical) {
      // Errores al calcular b = y₁ − m·x₁ (hipótesis nuestras)
      const e = {
        signoCambiado: deF(fSum(P[1], fMul(m, P[0]))),                 // b = y₁ + m·x₁
        interceptoX: fCero(m) ? null : deF(fDiv(fNeg(R._b), m)),     // toma el corte con el eje x como b
        bEsY1: deF(P[1]),                                             // b = y₁, la y del punto dado
      };
      const { errores, coinciden } = apartar(e, v => casi(v.valor, R.b));
      return Object.assign(publica(R), { errores, coinciden });
    }
    return Object.assign(publica(R), { errores: {}, coinciden: [] });
  }
  function leerGeneral(L, que) {
    if (!Array.isArray(L) || L.length !== 3) throw new Error(`${que} debe ser una recta [A, B, C] de Ax + By + C = 0`);
    const [A, B, C] = L.map((x, k) => aF(x, `${'ABC'[k]} de ${que}`));
    if (fCero(A) && fCero(B)) throw new Error(`${que}: A y B no pueden ser cero a la vez`);
    return [A, B, C];
  }
  function rectaGeneral(L) {
    const [A, B, C] = leerGeneral(L, 'la recta');
    if (fCero(B)) return publica(construirRecta([fDiv(fNeg(C), A), F(0)], null));
    return publica(construirRecta([F(0), fDiv(fNeg(C), B)], fDiv(fNeg(A), B)));
  }
  const mDe = ([A, B]) => (fCero(B) ? null : fDiv(fNeg(A), B));

  // ---------- Posición de dos rectas ----------
  function relacionF(L1, L2) {
    const [A1, B1, C1] = L1, [A2, B2, C2] = L2;
    const cruz = fRes(fMul(A1, B2), fMul(A2, B1));
    if (fCero(cruz)) {
      const coinc = fCero(fRes(fMul(A1, C2), fMul(A2, C1))) && fCero(fRes(fMul(B1, C2), fMul(B2, C1)));
      return coinc ? 'coincidentes' : 'paralelas';
    }
    return fCero(fSum(fMul(A1, A2), fMul(B1, B2))) ? 'perpendiculares' : 'secantes';
  }
  function posicion(o) {
    const L1 = leerGeneral(o.L1, 'L1'), L2 = leerGeneral(o.L2, 'L2');
    const rel = relacionF(L1, L2), m1 = mDe(L1), m2 = mDe(L2);
    let interseccion = null;
    const cruz = fRes(fMul(L1[0], L2[1]), fMul(L2[0], L1[1]));
    if (!fCero(cruz)) interseccion = numP([fDiv(fRes(fMul(L1[1], L2[2]), fMul(L2[1], L1[2])), cruz), fDiv(fRes(fMul(L1[2], L2[0]), fMul(L2[2], L1[0])), cruz)]);
    // ángulo agudo entre las rectas, con los vectores directores (B, −A)
    const u = [fNum(L1[1]), -fNum(L1[0])], v = [fNum(L2[1]), -fNum(L2[0])];
    const cos = Math.abs(u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v));
    const angulo = grados(Math.acos(Math.min(1, cos)));
    // Errores (hipótesis): tomar el coeficiente de x como pendiente; creer que m₂ = −m₁ basta para ser perpendiculares
    const relX = (() => {
      // con m = A (coeficiente de x) en las dos
      const a = L1[0], b = L2[0];
      if (fIgual(a, b)) return 'paralelas';
      return fIgual(fMul(a, b), F(-1)) ? 'perpendiculares' : 'secantes';
    })();
    const opuestas = m1 && m2 && !fCero(m1) && fIgual(m2, fNeg(m1)) ? 'perpendiculares' : null;
    const { errores, coinciden } = apartar({ coeficienteX: relX, opuestas }, v2 => v2 === rel);
    return { relacion: rel, m1: m1 && fNum(m1), m2: m2 && fNum(m2), m1Texto: m1 ? txF(m1) : 'no existe', m2Texto: m2 ? txF(m2) : 'no existe',
      producto: m1 && m2 ? fNum(fMul(m1, m2)) : null, angulo, interseccion, interseccionTexto: interseccion ? txP(interseccion.map(aF)) : null, errores, coinciden };
  }

  // ---------- Perpendicular y paralela ----------
  function mDeEntrada(o) {
    if (o.L !== undefined) return mDe(leerGeneral(o.L, 'L'));
    if (o.m === null || o.m === 'vertical') return null;
    return aF(o.m, 'm');
  }
  function perpendicular(o, Pdado) {
    const m1 = mDeEntrada(o), P = Pdado ? punto(Pdado, 'P') : (o.P ? punto(o.P, 'P') : null);
    let m2;
    if (m1 === null) m2 = F(0);
    else if (fCero(m1)) m2 = null;
    else m2 = fDiv(F(-1), m1);
    const val = m2 === null ? null : fNum(m2);
    const e = m1 === null ? { igual: null } : fCero(m1) ? { cero: deF(F(0)) } : {
      opuesta: deF(fNeg(m1)),                 // m₂ = −m₁ (hipótesis)
      inversa: deF(fDiv(F(1), m1)),          // m₂ = 1/m₁, sin el signo (hipótesis)
      igual: deF(m1),                         // la misma pendiente: eso es paralela (hipótesis)
    };
    const { errores, coinciden } = apartar(e, v => val !== null && casi(v.valor, val));
    const r = { m1: m1 === null ? null : fNum(m1), valor: val, texto: m2 === null ? 'no existe' : txF(m2), vertical: m2 === null,
      producto: m1 && m2 ? fNum(fMul(m1, m2)) : null, errores, coinciden };
    if (P) r.recta = publica(construirRecta(P, m2));
    return r;
  }
  function paralela(o, Pdado) {
    const m = mDeEntrada(o), P = punto(Pdado || o.P, 'P');
    return Object.assign({ valor: m === null ? null : fNum(m) }, { recta: publica(construirRecta(P, m)) });
  }

  // ---------- Distancia de un punto a una recta ----------
  function distanciaPuntoRecta(o) {
    const P = punto(o.P, 'P');
    const [A, B, C] = leerGeneral(o.L, 'L');
    const N = fSum(fSum(fMul(A, P[0]), fMul(B, P[1])), C);
    const S = fSum(fMul(A, A), fMul(B, B));
    const d = entreRaiz(fAbs(N), S);
    // pie de la perpendicular: P − (N/S)·(A, B)
    const t = fDiv(N, S), H = [fRes(P[0], fMul(t, A)), fRes(P[1], fMul(t, B))];
    const sinC = fSum(fMul(A, P[0]), fMul(B, P[1]));
    const e = {
      sinAbs: entreRaiz(N, S),                                       // olvida el valor absoluto: «distancia» negativa (hipótesis)
      sinRaiz: deF(fDiv(fAbs(N), S)),                                // divide entre A² + B² sin la raíz (hipótesis)
      sinDenominador: deF(fAbs(N)),                                  // no divide (hipótesis)
      sinC: entreRaiz(fAbs(sinC), S),                                // olvida C (hipótesis)
    };
    const { errores, coinciden } = apartar(e, v => casi(v.valor, d.valor));
    return { N: fNum(N), S: fNum(S), raizS: radical(raizF(S).c, raizF(S).s).texto, valor: d.valor, texto: d.texto, pie: numP(H), pieTexto: txP(H),
      lado: N.n > 0 ? 1 : N.n < 0 ? -1 : 0, errores, coinciden };
  }
  function distanciaParalelas(o) {
    const L1 = leerGeneral(o.L1, 'L1'), L2 = leerGeneral(o.L2, 'L2');
    const rel = relacionF(L1, L2);
    if (rel !== 'paralelas' && rel !== 'coincidentes') throw new Error('las rectas no son paralelas: se cortan');
    // k tal que L2 = k·(A₁, B₁, C₂')
    const k = fCero(L1[0]) ? fDiv(L2[1], L1[1]) : fDiv(L2[0], L1[0]);
    const C2 = fDiv(L2[2], k);
    const S1 = fSum(fMul(L1[0], L1[0]), fMul(L1[1], L1[1])), S2 = fSum(fMul(L2[0], L2[0]), fMul(L2[1], L2[1]));
    const d = entreRaiz(fAbs(fRes(L1[2], C2)), S1);
    const e = {
      sinIgualar: entreRaiz(fAbs(fRes(L1[2], L2[2])), S1),          // resta las C sin igualar los coeficientes (hipótesis)
      otraRaiz: entreRaiz(fAbs(fRes(L1[2], L2[2])), S2),            // ídem, con la raíz de la otra recta (hipótesis)
      sumaC: entreRaiz(fAbs(fSum(L1[2], C2)), S1),                  // suma las C en vez de restarlas (hipótesis)
    };
    const { errores, coinciden } = apartar(e, v => casi(v.valor, d.valor));
    return { valor: d.valor, texto: d.texto, C2: fNum(C2), C2Texto: txF(C2), igualada: { A: fNum(L1[0]), B: fNum(L1[1]), C: fNum(C2) }, errores, coinciden };
  }

  // ---------- Área por coordenadas: el «zapatito» ----------
  function zapatito(V) {
    const n = V.length, bajada = [], subida = [];
    for (let i = 0; i < n; i++) {
      const P = V[i], Q = V[(i + 1) % n];
      bajada.push(fMul(P[0], Q[1]));   // x_i·y_{i+1}: la flecha que baja en la tabla
      subida.push(fMul(P[1], Q[0]));   // y_i·x_{i+1}: la flecha que sube
    }
    const sb = bajada.reduce(fSum, F(0)), ss = subida.reduce(fSum, F(0));
    return { bajada, subida, sb, ss, det: fRes(sb, ss) };
  }
  function cruzan(P, Q, R, S) {
    const o = (a, b, c) => Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
    return o(P, Q, R) * o(P, Q, S) < 0 && o(R, S, P) * o(R, S, Q) < 0;
  }
  function simple(V) {
    const n = V.length, X = V.map(numP);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if (j === i + 1 || (i === 0 && j === n - 1)) continue;
      if (cruzan(X[i], X[(i + 1) % n], X[j], X[(j + 1) % n])) return false;
    }
    return true;
  }
  function leerVertices(vs) {
    if (!Array.isArray(vs) || vs.length < 3) throw new Error('hacen falta al menos tres vértices');
    return vs.map((P, k) => punto(P, `el vértice ${k + 1}`));
  }
  function area(o) {
    const V = leerVertices(o.vertices), Z = zapatito(V);
    const A = fDiv(fAbs(Z.det), F(2));
    const e = {
      sinMitad: deF(fAbs(Z.det)),                                    // olvida el 1/2 (hipótesis)
      sinAbs: deF(fDiv(Z.det, F(2))),                                // olvida el valor absoluto: área negativa (hipótesis)
      sumaProductos: deF(fDiv(fSum(Z.sb, Z.ss), F(2))),              // suma las dos diagonales en vez de restarlas (hipótesis)
    };
    const { errores, coinciden } = apartar(e, v => casi(v.valor, fNum(A)));
    return { n: V.length, bajada: Z.bajada.map(fNum), subida: Z.subida.map(fNum), sumaBajada: fNum(Z.sb), sumaSubida: fNum(Z.ss),
      det: fNum(Z.det), valor: fNum(A), texto: txF(A), sentido: Z.det.n > 0 ? 'antihorario' : Z.det.n < 0 ? 'horario' : 'degenerado',
      simple: simple(V), errores, coinciden };
  }
  // Recorrer los vértices en otro orden (por ejemplo A, C, B, D): si el camino se cruza, el zapatito da la diferencia de
  // los dos lazos, no el área. 'orden' son los índices de los vértices en el nuevo recorrido.
  function ordenCruzado(o) {
    const V = leerVertices(o.vertices), orden = o.orden || [0, 2, 1, 3];
    if (orden.length !== V.length || new Set(orden).size !== V.length || orden.some(k => !(k >= 0 && k < V.length))) throw new Error('el orden debe usar cada vértice una vez');
    const W = orden.map(k => V[k]);
    const bien = area({ vertices: o.vertices }), Z = zapatito(W), valor = fDiv(fAbs(Z.det), F(2));
    // los dos lazos cuando hay un solo cruce (cuatro vértices): el punto de cruce X y las áreas con signo de cada lazo
    let lazos = null;
    if (W.length === 4) {
      const w = W.map(numP);
      let par = null;
      if (cruzan(w[0], w[1], w[2], w[3])) par = [0, 2];
      else if (cruzan(w[1], w[2], w[3], w[0])) par = [1, 3];
      if (par) {
        const [i, j] = par, P1 = W[i], P2 = W[i + 1], Q1 = W[j], Q2 = W[(j + 1) % 4];
        const den = fRes(fMul(fRes(P2[0], P1[0]), fRes(Q2[1], Q1[1])), fMul(fRes(P2[1], P1[1]), fRes(Q2[0], Q1[0])));
        const t = fDiv(fRes(fMul(fRes(Q1[0], P1[0]), fRes(Q2[1], Q1[1])), fMul(fRes(Q1[1], P1[1]), fRes(Q2[0], Q1[0]))), den);
        const Xp = [fSum(P1[0], fMul(t, fRes(P2[0], P1[0]))), fSum(P1[1], fMul(t, fRes(P2[1], P1[1])))];
        const lazo1 = [Xp, W[i + 1], W[j]], lazo2 = [Xp, W[(j + 1) % 4], W[i]];
        const sA = L => fDiv(zapatito(L).det, F(2));
        lazos = { cruce: numP(Xp), cruceTexto: txP(Xp), uno: { vertices: lazo1.map(numP), area: fNum(sA(lazo1)) }, otro: { vertices: lazo2.map(numP), area: fNum(sA(lazo2)) } };
      }
    }
    const e = {
      ordenNoImporta: { valor: bien.valor, texto: bien.texto },                        // cree que da el área de siempre (hipótesis)
      sinMitad: deF(fAbs(Z.det)),                                                      // olvida el 1/2 (hipótesis)
      sinAbs: deF(fDiv(Z.det, F(2))),                                                  // se queda con el signo (hipótesis)
      seAnula: deF(F(0)),                                                              // «si el camino se cruza, todo se anula» (hipótesis)
    };
    const { errores, coinciden } = apartar(e, v => casi(v.valor, fNum(valor)));
    return { area: bien.valor, valor: fNum(valor), texto: txF(valor), det: fNum(Z.det), simple: simple(W), lazos, errores, coinciden };
  }

  // ---------- Inclinación ----------
  function masEmpinada(o) {
    const m1 = aF(o.m1, 'm1'), m2 = aF(o.m2, 'm2');
    const a1 = fAbs(m1), a2 = fAbs(m2);
    if (fIgual(a1, a2)) throw new Error('las dos rectas tienen la misma inclinación respecto de la horizontal');
    const cual = fNum(a1) > fNum(a2) ? 1 : 2;
    const conSigno = fNum(m1) > fNum(m2) ? 1 : 2;     // compara m con su signo (hipótesis)
    const ang = m => grados(Math.atan(Math.abs(fNum(m))));
    const { errores, coinciden } = apartar({ conSigno }, v => v === cual);
    return { cual, angulo1: ang(m1), angulo2: ang(m2), inclinacion1: fNum(m1) >= 0 ? grados(Math.atan(fNum(m1))) : grados(Math.PI + Math.atan(fNum(m1))),
      inclinacion2: fNum(m2) >= 0 ? grados(Math.atan(fNum(m2))) : grados(Math.PI + Math.atan(fNum(m2))), errores, coinciden };
  }

  // ---------- Circunferencia ----------
  function circunferencia(o) {
    let Cc, r2;
    if (o.A !== undefined) {
      const A = punto(o.A, 'A'), B = punto(o.B, 'B');
      Cc = [fDiv(fSum(A[0], B[0]), F(2)), fDiv(fSum(A[1], B[1]), F(2))];
      const dx = fRes(B[0], A[0]), dy = fRes(B[1], A[1]);
      r2 = fDiv(fSum(fMul(dx, dx), fMul(dy, dy)), F(4));
    } else {
      Cc = punto(o.centro, 'el centro'); r2 = aF(o.r2, 'r²');
      if (!(fNum(r2) > 0)) throw new Error('r² debe ser mayor que cero');
    }
    const r = raizF(r2), rr = radical(r.c, r.s);
    const cuad = (letra, v) => (fCero(v) ? `${letra}²` : `(${menosValor(letra, v)})²`);
    const D = fMul(F(-2), Cc[0]), E = fMul(F(-2), Cc[1]), Fc = fRes(fSum(fMul(Cc[0], Cc[0]), fMul(Cc[1], Cc[1])), r2);
    const partes = ['x² + y²'];
    if (!fCero(D)) partes.push(termino(D, 'x', false));
    if (!fCero(E)) partes.push(termino(E, 'y', false));
    if (!fCero(Fc)) partes.push(termino(Fc, '', false));
    return { h: fNum(Cc[0]), k: fNum(Cc[1]), centro: numP(Cc), centroTexto: txP(Cc), r2: fNum(r2), r: rr.valor, rTexto: rr.texto,
      ecuacion: `${cuad('x', Cc[0])} + ${cuad('y', Cc[1])} = ${txF(r2)}`, general: partes.join('') + ' = 0', D: fNum(D), E: fNum(E), F: fNum(Fc) };
  }

  return { distancia, puntoMedio, divide, pendiente, recta, rectaGeneral, posicion, perpendicular, paralela,
    distanciaPuntoRecta, distanciaParalelas, area, ordenCruzado, masEmpinada, circunferencia,
    textoFraccion: x => txF(aF(x)), textoPunto: P => txP(punto(P, 'el punto')) };
});
