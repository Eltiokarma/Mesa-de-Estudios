/*
 * Generador: geometría analítica de admisión (baricentro, ángulo entre rectas, elipse en forma
 * general y corte de dos parábolas). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['geo-analitica']) y en Node (require). No usa ningún motor.
 *
 * Tipos y campos de _datos (todos los datos del enunciado están en _datos):
 *   baricentro   sub 'banderin': banderín isósceles con la base sobre el eje Y, de (0; y1) a (0; y2),
 *                y la punta a d unidades a la derecha del eje (la punta está a la altura del punto medio
 *                de la base, por ser isósceles). sub 'base-x': base sobre el eje X, de (x1; 0) a (x2; 0),
 *                y la punta a la altura hgt sobre el punto medio de la base. sub 'general': vértices
 *                A, B, C dados como [x, y]. Se pide el baricentro; respuesta: clave 'vec:x/1,y/1' de
 *                Predicciones.vector (fracciones exactas).
 *   angulo       sub 'rectangulo': rectángulo ABCD (A, B, C, D dados como [x, y], en orden), O = corte de
 *                las diagonales; se pide tan del ángulo AOB (puede ser negativa: ángulo obtuso).
 *                sub 'rectas': L1: a1x + b1y + c1 = 0 y L2: a2x + b2y + c2 = 0 (coeficientes en l1 y l2);
 *                θ es el ángulo medido desde L1 hasta L2 en sentido antihorario; se pide tan θ.
 *                Respuesta: clave 'fr:n/d' (fracción reducida, d > 0).
 *   elipse       La elipse se da en forma general A·x² + C·y² + D·x + E·y + F = 0 (coeficientes en
 *                'general' = [A, C, D, E, F]); proviene de centro (h; k), semiejes a > b, c² = a² − b²,
 *                eje mayor paralelo al eje 'x' o al eje 'y' (campo eje).
 *                sub 'foco': se pide el foco de mayor abscisa (eje x) o de mayor ordenada (eje y);
 *                respuesta: clave de vector. sub 'recta': V1 es el vértice de mayor abscisa (eje x) o de
 *                mayor ordenada (eje y); F2 es el foco de menor abscisa (eje x) o de menor ordenada (eje y);
 *                B1 es el extremo del eje menor de mayor ordenada (eje x) o de mayor abscisa (eje y).
 *                Se pide la recta por V1 paralela (rel 'paralela') o perpendicular (rel 'perpendicular')
 *                al segmento F2B1, como «px + qy + r = 0» con enteros primos entre sí y p > 0
 *                (o p = 0 y q > 0); respuesta: clave 'recta:p,q,r'.
 *   parabolas    P1: y = a·x² + c1 (a > 0) y P2: y = −b·x² + c2 (b > 0); a y b se guardan como
 *                [num, den]. Un cilindro recto tiene su eje sobre el eje Y, su base inferior en el plano
 *                y = 0 y el borde de su base superior pasa por los dos puntos de corte de P1 y P2.
 *                Se pide su volumen (múltiplo de π).
 *
 * Errores: CO1, CO7, CO8 y CO18 de docs/investigacion/matematica-avanzada-ideas-erroneas.md (todos
 * hipótesis, según el informe); TR12 llevado al signo del ángulo entre rectas (hipótesis); GE19 radio
 * por diámetro (hipótesis); el resto, códigos nuevos con prefijo GA, hipótesis.
 * calc: funciones puras de cálculo (las usa papel.json).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const v = P.v;
  const n = x => (x < 0 ? `−${Math.abs(x)}` : `${x}`);
  const pto = (x, y) => `(${n(x)}; ${n(y)})`;
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const fr = (num, den) => { const q = P.frac(num, den); return { clave: `fr:${q.n}/${q.d}`, texto: P.textoFraccion(q), n: q.n, d: q.d }; };
  const err = (id, obj, explicacion) => (obj ? { id, clave: obj.clave, texto: obj.texto, explicacion, respaldo: 'hipotesis', fuente: null } : null);

  // Texto de un polinomio: términos [coef, 'x²'] → «16x² + 25y² − 64x + 150y − 111 = 0».
  function polinomio(terminos) {
    let t = '';
    for (const [c, lit] of terminos) {
      if (c === 0) continue;
      const abs = Math.abs(c), cuerpo = (abs === 1 && lit ? '' : String(abs)) + lit;
      t += t === '' ? (c < 0 ? '−' : '') + cuerpo : (c < 0 ? ' − ' : ' + ') + cuerpo;
    }
    return (t || '0') + ' = 0';
  }
  // Recta px + qy + r = 0 normalizada: enteros primos entre sí, p > 0 (o p = 0 y q > 0).
  function recta(p, q, r) {
    const g = mcd(mcd(p, q), r) || 1;
    p /= g; q /= g; r /= g;
    if (p < 0 || (p === 0 && q < 0)) { p = -p; q = -q; r = -r; }
    p += 0; q += 0; r += 0;
    return { clave: `recta:${p},${q},${r}`, texto: polinomio([[p, 'x'], [q, 'y'], [r, '']]), coef: [p, q, r] };
  }
  // Recta por (x0; y0) con pendiente num/den (den ≠ 0): num·x − den·y + (den·y0 − num·x0) = 0.
  const rectaPendiente = (x0, y0, num, den) => recta(num, -den, den * y0 - num * x0);

  // ---------- Cálculo puro ----------
  const calc = {
    baricentro: (A, B, C) => [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3],
    tanEntreRectas: (m1, m2) => (m2 - m1) / (1 + m1 * m2),
    tanAOB(A, B, C, D) {
      const O = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
      const u = [A[0] - O[0], A[1] - O[1]], w = [B[0] - O[0], B[1] - O[1]];
      return Math.abs(u[0] * w[1] - u[1] * w[0]) / (u[0] * w[0] + u[1] * w[1]);
    },
    // Completa cuadrados en A x² + C y² + D x + E y + F = 0.
    elipse([A, C, D, E, F]) {
      const h = -D / (2 * A), k = -E / (2 * C);
      const lado = A * h * h + C * k * k - F; // A(x − h)² + C(y − k)² = lado
      const ax = Math.sqrt(lado / A), ay = Math.sqrt(lado / C);
      const eje = ax > ay ? 'x' : 'y', a = Math.max(ax, ay), b = Math.min(ax, ay), c = Math.sqrt(a * a - b * b);
      return { h, k, a, b, c, eje };
    },
    rectaPorPunto: (x0, y0, num, den) => rectaPendiente(x0, y0, num, den).texto,
    corteParabolas(a, c1, b, c2) { const x2 = (c2 - c1) / (a + b); return { x: Math.sqrt(x2), y: a * x2 + c1 }; },
    volumenCilindro: (r, hh) => Math.PI * r * r * hh,
  };

  function generar(semilla) {
    const rng = Azar.crear('geo-analitica|' + semilla);
    for (let intento = 0; intento < 80; intento++) {
      const pr = construir(rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const TIPOS = ['baricentro', 'angulo', 'elipse', 'parabolas'];

  function construir(rng, semilla) {
    const tipo = rng.elegir(TIPOS);
    const r = ({ baricentro, angulo, elipse, parabolas })[tipo](rng);
    if (!r) return null;
    let alternativas;
    if (r.claves) alternativas = P.armarTexto({ correcta: r.correcta, errores: r.errores.filter(Boolean), rng });
    else alternativas = P.armar({ correcta: r.correcta, errores: r.errores, rng, formato: 'pi', unidad: r.unidad });
    return {
      id: `geo-analitica#${semilla}`, variables: r.variables, enunciado: r.enunciado, pregunta: r.pregunta,
      datos: '', alternativas, solucion: r.solucion,
      respuesta: { valor: r.claves ? r.correcta.clave : r.correcta, unidad: r.unidad },
      _datos: r.datos,
    };
  }

  // ---------- Baricentro ----------
  function baricentro(rng) {
    const sub = rng.elegir(['banderin', 'base-x', 'general']);
    const variables = { A: { nombre: 'primer vértice', color: 'o' }, B: { nombre: 'segundo vértice', color: 'i' }, C: { nombre: 'tercer vértice', color: 'h' }, G: { nombre: 'baricentro', color: 'd' } };
    let A, B, C, enunciado, datos, pasoPunta = null;
    if (sub === 'banderin') {
      const y1 = rng.entero(1, 6), y2 = y1 + 2 * rng.entero(2, 5), d = rng.entero(4, 15);
      A = [0, y1]; B = [0, y2]; C = [d, (y1 + y2) / 2];
      enunciado = ['Un banderín tiene forma de triángulo isósceles. Su base está sujeta a un asta que coincide con el eje Y, entre los puntos ',
        v('A', pto(...A)), ' y ', v('B', pto(...B)), `, y su punta está a ${d} unidades a la derecha del asta.`];
      pasoPunta = ['Por ser isósceles, la punta está a la altura del punto medio de la base: ', v('C', pto(...C)), '.'];
      datos = { tipo: 'baricentro', sub, y1, y2, d };
    } else if (sub === 'base-x') {
      const x1 = rng.entero(-6, 4), x2 = x1 + 2 * rng.entero(2, 5), hgt = rng.entero(4, 15);
      A = [x1, 0]; B = [x2, 0]; C = [(x1 + x2) / 2, hgt];
      enunciado = ['Una carpa vista de frente es un triángulo isósceles. Su base está sobre el eje X, entre ',
        v('A', pto(...A)), ' y ', v('B', pto(...B)), `, y su punta está a ${hgt} unidades de altura.`];
      pasoPunta = ['Por ser isósceles, la punta está sobre el punto medio de la base: ', v('C', pto(...C)), '.'];
      datos = { tipo: 'baricentro', sub, x1, x2, hgt };
    } else {
      for (;;) {
        A = [rng.entero(-6, 8), rng.entero(-6, 8)]; B = [rng.entero(-6, 8), rng.entero(-6, 8)]; C = [rng.entero(-6, 8), rng.entero(-6, 8)];
        const area2 = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
        if (area2 !== 0 && (A[0] + B[0] + C[0]) % 3 === 0 && (A[1] + B[1] + C[1]) % 3 === 0) break;
      }
      enunciado = ['Tres antenas están en los puntos ', v('A', pto(...A)), ', ', v('B', pto(...B)), ' y ', v('C', pto(...C)), ' de un plano. Se quiere poner un repetidor en el baricentro del triángulo que forman.'];
      datos = { tipo: 'baricentro', sub, A, B, C };
    }
    const sx = A[0] + B[0] + C[0], sy = A[1] + B[1] + C[1];
    const correcta = P.vector([[sx, 3], [sy, 3]]);
    const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    const vec = (x, y) => P.vector([P.frac(Math.round(x * 6), 6), P.frac(Math.round(y * 6), 6)]);
    const errores = [
      err('GA-baricentro-entre-2', P.vector([[sx, 2], [sy, 2]]), 'Sumaste las tres coordenadas y dividiste entre 2, como en el punto medio. El baricentro es el promedio de los tres vértices: se divide entre 3.'),
      err('GA-punto-medio-base', vec(...M), sub === 'general' ? 'Ese es el punto medio de AB. El baricentro es el corte de las tres medianas, a un tercio de cada mediana desde el lado.' : 'Ese es el punto medio de la base. El baricentro está sobre la mediana, a un tercio de su longitud desde la base.'),
      err('GA-dos-tercios-desde-base', vec(M[0] + 2 * (C[0] - M[0]) / 3, M[1] + 2 * (C[1] - M[1]) / 3), 'Ubicaste el baricentro a dos tercios de la mediana medidos desde el lado. Está a dos tercios desde el vértice, es decir, a un tercio desde el lado.'),
      err('GA-mitad-mediana', vec((M[0] + C[0]) / 2, (M[1] + C[1]) / 2), 'Tomaste el punto medio de la mediana. El baricentro divide cada mediana en razón 2 : 1 desde el vértice.'),
      err('GA-sin-dividir', P.vector([sx, sy]), 'Sumaste las coordenadas y no dividiste entre 3.'),
    ];
    const solucion = [];
    if (pasoPunta) solucion.push(pasoPunta);
    solucion.push(['El baricentro es el promedio de los tres vértices: G = ((x₁ + x₂ + x₃)/3; (y₁ + y₂ + y₃)/3).']);
    const sm = (p, q, r) => [p, q, r].map((z, i) => (i && z < 0 ? `(${n(z)})` : n(z))).join(' + ');
    solucion.push([`x: (${sm(A[0], B[0], C[0])})/3 = ${n(sx)}/3 = ${P.textoFraccion([sx, 3])};  y: (${sm(A[1], B[1], C[1])})/3 = ${n(sy)}/3 = ${P.textoFraccion([sy, 3])}.`]);
    solucion.push(['G = ', v('G', correcta.texto), '.']);
    return {
      variables, unidad: '', claves: true, correcta, errores, enunciado, solucion,
      pregunta: [sub === 'general' ? '¿En qué punto se pone el repetidor?' : '¿Cuáles son las coordenadas del baricentro del triángulo?'],
      datos,
    };
  }

  // ---------- Ángulo entre rectas ----------
  const PEND = [[0, 1], [1, 1], [-1, 1], [2, 1], [-2, 1], [3, 1], [-3, 1], [1, 2], [-1, 2], [1, 3], [-1, 3], [3, 2], [-3, 2], [2, 3], [-2, 3]];
  function angulo(rng) {
    const sub = rng.elegir(['rectangulo', 'rectangulo', 'rectas']);
    if (sub === 'rectangulo') {
      for (;;) {
        const u = rng.elegir([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, -1], [2, -1], [1, -2]]);
        const [s1, s2] = rng.elegir([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]);
        const esc = rng.elegir([1, 2]);
        const U = [esc * s1 * u[0], esc * s1 * u[1]], W = [-esc * s2 * u[1], esc * s2 * u[0]];
        const A = [rng.entero(-5, 4), rng.entero(-5, 4)];
        const B = [A[0] + U[0], A[1] + U[1]], C = [B[0] + W[0], B[1] + W[1]], D = [A[0] + W[0], A[1] + W[1]];
        if ((A[0] + C[0]) % 2 || (A[1] + C[1]) % 2) continue; // centro con coordenadas enteras
        const O = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
        const LU = s1 * s1, LW = s2 * s2; // |U|²/|W|² en proporción
        const correcta = fr(2 * s1 * s2, LW - LU);
        const variables = { A: { nombre: 'A', color: 'o' }, B: { nombre: 'B', color: 'i' }, O: { nombre: 'centro O', color: 'h' }, t: { nombre: 'tan AOB', color: 'd' } };
        // Pendientes de las diagonales (si existen), para el error del denominador.
        const pend = (P1, P2) => (P2[0] === P1[0] ? null : [P2[1] - P1[1], P2[0] - P1[0]]);
        const m1 = pend(A, C), m2 = pend(B, D);
        let errDen = null;
        if (m1 && m2) {
          const [a1, b1] = m1, [a2, b2] = m2;
          const num = a2 * b1 - a1 * b2, den = b1 * b2 - a1 * a2; // (m2 − m1)/(1 − m1·m2)
          if (den !== 0) errDen = fr(num, den);
        }
        const errores = [
          err('TR12-signo-del-agudo', fr(2 * s1 * s2, Math.abs(LW - LU)), LW - LU < 0 ? 'Esa es la tangente del ángulo agudo entre las diagonales. El ángulo AOB abarca el lado más largo del rectángulo: es obtuso y su tangente es negativa.' : 'Cambiaste el signo. El ángulo AOB abarca el lado más corto del rectángulo: es agudo y su tangente es positiva.'),
          err('GA-cotangente', fr(LW - LU, 2 * s1 * s2), 'Invertiste la fracción: esa es la cotangente del ángulo.'),
          err('GA-angulo-mitad', fr(s1, s2), 'Esa es la tangente de la mitad del ángulo AOB (en el triángulo rectángulo con la mitad de AB y la mitad de BC). Falta usar la tangente del ángulo doble.'),
          errDen ? err('GA-denominador-menos', errDen, 'Usaste 1 − m₁·m₂ en el denominador. La fórmula es tan θ = (m₂ − m₁)/(1 + m₁·m₂).') : null,
          err('GA-doble-sin-formula', fr(2 * s1, s2), 'Multiplicaste por 2 la tangente de la mitad del ángulo. La tangente del doble no es el doble de la tangente: tan 2α = 2 tan α/(1 − tan² α).'),
        ];
        const ab = Math.hypot(U[0], U[1]), bc = Math.hypot(W[0], W[1]);
        const tm = fr(s1, s2);
        return {
          variables, unidad: '', claves: true, correcta, errores,
          enunciado: ['Un terreno rectangular tiene vértices ', v('A', `A${pto(...A)}`), ', ', v('B', `B${pto(...B)}`), `, C${pto(...C)} y D${pto(...D)}. Sus diagonales AC y BD se cortan en el punto O.`],
          pregunta: ['¿Cuánto vale la tangente del ángulo AOB?'],
          solucion: [
            ['O es el punto medio de AC: ', v('O', `O${pto(...O)}`), `. AB = ${P.radical(ab)} y BC = ${P.radical(bc)}.`],
            ['En el triángulo rectángulo formado por O, el punto medio de AB y ', v('B', 'B'), ', el ángulo α = AOB/2 cumple tan α = (AB/2)/(BC/2) = ', `${tm.texto}.`],
            ['tan AOB = tan 2α = 2 tan α/(1 − tan² α) = ', v('t', correcta.texto), LW - LU < 0 ? ': negativa, porque AOB abarca el lado más largo y es obtuso.' : '.'],
          ],
          datos: { tipo: 'angulo', sub, A, B, C, D },
        };
      }
    }
    for (;;) {
      const p1 = rng.elegir(PEND), p2 = rng.elegir(PEND);
      const [n1, d1] = p1, [n2, d2] = p2;
      if (n1 * d2 === n2 * d1) continue; // paralelas
      if (d1 * d2 + n1 * n2 === 0) continue; // perpendiculares
      // L: n·x − d·y + c = 0 tiene pendiente n/d.
      const c1 = rng.entero(-9, 9), c2 = rng.entero(-9, 9);
      const s1 = rng.elegir([1, -1]), s2 = rng.elegir([1, -1]);
      const l1 = recta(s1 * n1, -s1 * d1, c1).coef, l2 = recta(s2 * n2, -s2 * d2, c2).coef;
      const correcta = fr(n2 * d1 - n1 * d2, d1 * d2 + n1 * n2);
      const variables = { m1: { nombre: 'pendiente de L₁', color: 'o' }, m2: { nombre: 'pendiente de L₂', color: 'i' }, t: { nombre: 'tan θ', color: 'd' } };
      const t1 = polinomio([[l1[0], 'x'], [l1[1], 'y'], [l1[2], '']]), t2 = polinomio([[l2[0], 'x'], [l2[1], 'y'], [l2[2], '']]);
      const m1t = P.textoFraccion([n1, d1]), m2t = P.textoFraccion([n2, d2]);
      const den1 = d1 * d2 - n1 * n2;
      const errores = [
        err('TR12-orden-cambiado', fr(n1 * d2 - n2 * d1, d1 * d2 + n1 * n2), 'Restaste al revés (m₁ − m₂). θ se mide desde L₁ hasta L₂: en el numerador va la pendiente final menos la inicial, m₂ − m₁.'),
        den1 !== 0 ? err('GA-denominador-menos', fr(n2 * d1 - n1 * d2, den1), 'Usaste 1 − m₁·m₂ en el denominador. La fórmula es tan θ = (m₂ − m₁)/(1 + m₁·m₂).') : null,
        err('GA-numerador-suma', fr(n2 * d1 + n1 * d2, d1 * d2 + n1 * n2), 'Sumaste las pendientes en el numerador. Va la diferencia m₂ − m₁.'),
        err('GA-cotangente', fr(d1 * d2 + n1 * n2, n2 * d1 - n1 * d2), 'Invertiste la fracción: esa es la cotangente de θ.'),
      ];
      return {
        variables, unidad: '', claves: true, correcta, errores,
        enunciado: ['Dos caminos rectos se dibujan en un plano como las rectas L₁: ', t1, ' y L₂: ', t2, '. θ es el ángulo que se mide desde L₁ hasta L₂ en sentido antihorario.'],
        pregunta: ['¿Cuánto vale tan θ?'],
        solucion: [
          ['En ax + by + c = 0 la pendiente es −a/b: ', v('m1', `m₁ = ${m1t}`), ' y ', v('m2', `m₂ = ${m2t}`), '.'],
          ['tan θ = (m₂ − m₁)/(1 + m₁·m₂), con m₂ la pendiente de la recta a la que se llega.'],
          ['tan θ = (', v('m2', m2t), ' − (', v('m1', m1t), `))/(1 + (${m1t})·(${m2t})) = `, v('t', correcta.texto), '.'],
        ],
        datos: { tipo: 'angulo', sub, l1, l2 },
      };
    }
  }

  // ---------- Elipse en forma general ----------
  const TERNAS = [[5, 4, 3], [5, 3, 4], [10, 8, 6], [10, 6, 8]];
  function elipse(rng) {
    const sub = rng.elegir(['foco', 'recta', 'recta']);
    const [a, b, c] = rng.elegir(TERNAS);
    const eje = rng.elegir(['x', 'y']);
    let hh, k;
    do { hh = rng.entero(-5, 5); k = rng.entero(-5, 5); } while (hh === 0 || k === 0 || hh === k || hh === -k);
    // eje x: b²(x − h)² + a²(y − k)² = a²b²; eje y: a²(x − h)² + b²(y − k)² = a²b².
    const ax2 = eje === 'x' ? b * b : a * a, ay2 = eje === 'x' ? a * a : b * b;
    let G = [ax2, ay2, -2 * ax2 * hh, -2 * ay2 * k, ax2 * hh * hh + ay2 * k * k - a * a * b * b];
    const gg = G.reduce((s, x) => mcd(s, x), 0);
    G = G.map(x => x / gg + 0);
    const ec = polinomio([[G[0], 'x²'], [G[1], 'y²'], [G[2], 'x'], [G[3], 'y'], [G[4], '']]);
    const variables = { h: { nombre: 'centro', color: 'o' }, a: { nombre: 'semieje mayor a', color: 'i' }, c: { nombre: 'distancia focal c', color: 'h' }, R: { nombre: 'respuesta', color: 'd' } };
    const pasoCentro = [
      ['Se completan cuadrados: ', `${ax2 / gg === 1 ? '' : ax2 / gg}(x ${hh < 0 ? '+' : '−'} ${Math.abs(hh)})² + ${ay2 / gg === 1 ? '' : ay2 / gg}(y ${k < 0 ? '+' : '−'} ${Math.abs(k)})² = ${a * a * b * b / gg}, es decir, (x ${hh < 0 ? '+' : '−'} ${Math.abs(hh)})²/${eje === 'x' ? a * a : b * b} + (y ${k < 0 ? '+' : '−'} ${Math.abs(k)})²/${eje === 'x' ? b * b : a * a} = 1.`],
      ['Centro ', v('h', pto(hh, k)), ` (ojo con los signos: «x ${hh < 0 ? '+' : '−'} ${Math.abs(hh)}» da h = ${n(hh)}). El denominador mayor está bajo ${eje}: el eje mayor es paralelo al eje ${eje.toUpperCase()}, `, v('a', `a = ${a}`), `, b = ${b}.`],
      ['c² = a² − b² = ', `${a * a} − ${b * b} → `, v('c', `c = ${c}`), '.'],
    ];
    // Elementos en función de (centro, eje, c usado).
    const elem = (H, K, E, cc, aa = a, bb = b) => {
      const V1 = E === 'x' ? [H + aa, K] : [H, K + aa], F1 = E === 'x' ? [H + cc, K] : [H, K + cc];
      const F2 = E === 'x' ? [H - cc, K] : [H, K - cc], B1 = E === 'x' ? [H, K + bb] : [H + bb, K];
      const V2 = E === 'x' ? [H - aa, K] : [H, K - aa];
      return { V1, V2, F1, F2, B1 };
    };
    const otro = eje === 'x' ? 'y' : 'x';
    const ok = elem(hh, k, eje, c);
    if (sub === 'foco') {
      const correcta = P.vector(ok.F1);
      const errores = [
        err('CO8-centro-signos', P.vector(elem(-hh, -k, eje, c).F1), `Tomaste el centro con los signos cambiados. En (x ${hh < 0 ? '+' : '−'} ${Math.abs(hh)})² el centro tiene h = ${n(hh)}.`),
        err('CO7-ejes-cambiados', P.vector(elem(hh, k, otro, c).F1), `Pusiste el eje mayor paralelo al eje ${otro.toUpperCase()}. El eje mayor va donde está el denominador mayor (a² = ${a * a}, bajo ${eje}).`),
        err('CO18-foco-en-vertice', P.vector(ok.V1), 'Ese es un vértice. Los focos están dentro de la elipse, a la distancia c del centro (c < a).'),
        err('GA-foco-con-b', P.vector(elem(hh, k, eje, b).F1), 'Usaste b como distancia del centro al foco. Esa distancia es c, con c² = a² − b².'),
        err('CO7-y-CO8', P.vector(elem(-hh, -k, otro, c).F1), 'Cambiaste los signos del centro y además el eje mayor.'),
      ];
      return {
        variables, unidad: '', claves: true, correcta, errores,
        enunciado: ['La pista de un velódromo se dibuja en un plano como la elipse ', ec, '.'],
        pregunta: [`¿Cuáles son las coordenadas del foco de mayor ${eje === 'x' ? 'abscisa' : 'ordenada'}?`],
        solucion: [...pasoCentro, ['Foco: el centro más c en la dirección del eje mayor: ', v('R', correcta.texto), '.']],
        datos: { tipo: 'elipse', sub, general: G, eje, h: hh, k, a, b, c },
      };
    }
    const rel = rng.elegir(['paralela', 'perpendicular']);
    const linea = (el, relacion) => {
      const dx = el.B1[0] - el.F2[0], dy = el.B1[1] - el.F2[1];
      return relacion === 'paralela' ? rectaPendiente(el.V1[0], el.V1[1], dy, dx) : rectaPendiente(el.V1[0], el.V1[1], -dx, dy);
    };
    const correcta = linea(ok, rel);
    const contraria = rel === 'paralela' ? 'perpendicular' : 'paralela';
    const dx = ok.B1[0] - ok.F2[0], dy = ok.B1[1] - ok.F2[1];
    const mTxt = P.textoFraccion([dy, dx]);
    const sinSigno = rel === 'perpendicular' ? rectaPendiente(ok.V1[0], ok.V1[1], dx, dy) : null;
    const errores = [
      err('CO8-centro-signos', linea(elem(-hh, -k, eje, c), rel), `Tomaste el centro con los signos cambiados. En (x ${hh < 0 ? '+' : '−'} ${Math.abs(hh)})² el centro tiene h = ${n(hh)}.`),
      err('CO7-ejes-cambiados', linea(elem(hh, k, otro, c), rel), `Pusiste el eje mayor paralelo al eje ${otro.toUpperCase()}. Va donde está el denominador mayor (a² = ${a * a}, bajo ${eje}).`),
      rel === 'perpendicular'
        ? err('GA-perpendicular-sin-signo', sinSigno, 'Invertiste la pendiente pero olvidaste cambiarle el signo. Dos rectas son perpendiculares si m₁·m₂ = −1: m⊥ = −1/m.')
        : err('GA-paralela-por-perpendicular', linea(ok, contraria), 'Usaste la pendiente perpendicular (−1/m). Las rectas paralelas tienen la misma pendiente.'),
      rel === 'perpendicular' ? err('GA-perpendicular-por-paralela', linea(ok, contraria), 'Usaste la misma pendiente del segmento: así sale la paralela. La perpendicular tiene pendiente −1/m.') : null,
      err('CO18-foco-en-vertice', linea(elem(hh, k, eje, a), rel), 'Pusiste el foco en el vértice (c = a). El foco está a la distancia c del centro, con c² = a² − b².'),
      err('GA-otro-vertice', rectaPendiente(ok.V2[0], ok.V2[1], ...(rel === 'paralela' ? [dy, dx] : [-dx, dy])), `Pasaste la recta por el otro vértice, ${pto(...ok.V2)}. Se pide el vértice de mayor ${eje === 'x' ? 'abscisa' : 'ordenada'}.`),
    ];
    return {
      variables, unidad: '', claves: true, correcta, errores,
      enunciado: ['El borde de una mesa se dibuja como la elipse ', ec, `. Sea V₁ el vértice de mayor ${eje === 'x' ? 'abscisa' : 'ordenada'}, F₂ el foco de menor ${eje === 'x' ? 'abscisa' : 'ordenada'} y B₁ el extremo del eje menor de mayor ${eje === 'x' ? 'ordenada' : 'abscisa'}.`],
      pregunta: [`¿Cuál es la ecuación de la recta que pasa por V₁ y es ${rel} al segmento F₂B₁?`],
      solucion: [
        ...pasoCentro,
        [`V₁ = ${pto(...ok.V1)}, F₂ = ${pto(...ok.F2)} y B₁ = ${pto(...ok.B1)}. Pendiente de F₂B₁: ${dy}/${dx}${`${dy}/${dx}` === mTxt ? '' : ` = ${mTxt}`}.`],
        [rel === 'paralela' ? `La paralela tiene la misma pendiente, ${mTxt}` : `La perpendicular tiene pendiente −1/m = ${P.textoFraccion([-dx, dy])}`, `; por V₁${pto(...ok.V1)}: `, v('R', correcta.texto), '.'],
      ],
      datos: { tipo: 'elipse', sub, general: G, eje, h: hh, k, a, b, c, rel },
    };
  }

  // ---------- Corte de dos parábolas y un cilindro ----------
  const COEF = [[1, 1], [2, 1], [1, 2], [3, 1]];
  const coefTxt = ([p, q], lit) => (q === 1 ? (p === 1 ? lit : `${p}${lit}`) : (p === 1 ? `${lit}/${q}` : `${p}${lit}/${q}`));
  function parabolas(rng) {
    for (;;) {
      const A = rng.elegir(COEF), B = rng.elegir(COEF);
      const x0 = rng.entero(1, 4), y0 = rng.entero(2, 12);
      const ax = A[0] * x0 * x0 / A[1], bx = B[0] * x0 * x0 / B[1];
      if (!Number.isInteger(ax) || !Number.isInteger(bx)) continue;
      const c1 = y0 - ax, c2 = y0 + bx;
      if (c1 === 0) continue;
      const a = A[0] / A[1], b = B[0] / B[1];
      const p1 = `y = ${coefTxt(A, 'x²')} ${c1 < 0 ? '−' : '+'} ${Math.abs(c1)}`, p2 = `y = ${c2} − ${coefTxt(B, 'x²')}`;
      const V = Math.PI * x0 * x0 * y0;
      const variables = { x: { nombre: 'radio', color: 'o' }, y: { nombre: 'altura', color: 'i' }, V: { nombre: 'volumen', color: 'd' } };
      const errores = [
        { id: 'GE19-diametro-como-radio', valor: 4 * V, explicacion: `Tomaste como radio la distancia entre los dos puntos de corte (${2 * x0}). Esa distancia es el diámetro: el radio es ${x0}.`, respaldo: 'hipotesis', fuente: null },
        { id: 'GA-radio-altura-cambiados', valor: Math.PI * y0 * y0 * x0, explicacion: 'Cambiaste el radio por la altura. El radio es la abscisa del punto de corte (distancia al eje Y) y la altura es su ordenada.', respaldo: 'hipotesis', fuente: null },
        x0 > 1 ? { id: 'GA-sin-raiz', valor: Math.PI * x0 ** 4 * y0, explicacion: `Usaste x² = ${x0 * x0} como radio. El radio es x = ${x0}; en la fórmula del volumen ya se eleva al cuadrado.`, respaldo: 'hipotesis', fuente: null } : null,
        { id: 'GA-altura-del-vertice', valor: Math.PI * x0 * x0 * c2, explicacion: `Tomaste como altura el vértice de la segunda parábola (${c2}). El cilindro llega solo hasta los puntos de corte, a la altura ${y0}.`, respaldo: 'hipotesis', fuente: null },
        a !== b ? (() => {
          const xx = (c2 - c1) / (a - b);
          if (!(xx > 0)) return null;
          return { id: 'GA-signo-al-igualar', valor: Math.PI * xx * (a * xx + c1), explicacion: 'Al igualar las dos expresiones restaste los coeficientes de x² en vez de sumarlos: el término −x² de la segunda pasa al otro lado con signo +.', respaldo: 'hipotesis', fuente: null };
        })() : null,
        { id: 'GE20-tercio-de-mas', valor: V / 3, explicacion: 'Multiplicaste por 1/3, como en el cono. El cilindro no lleva el 1/3.', respaldo: 'hipotesis', fuente: null },
      ].filter(Boolean);
      const sumaTxt = A[1] === 1 && B[1] === 1 ? `${a + b}` : P.textoFraccion(P.frac(A[0] * B[1] + B[0] * A[1], A[1] * B[1]));
      return {
        variables, unidad: 'u³', correcta: V, errores,
        enunciado: ['En un plano, las parábolas P₁: ', p1, ' y P₂: ', p2, ' se cortan en dos puntos. Un cilindro recto tiene su eje sobre el eje Y, su base inferior en el eje X (y = 0) y el borde de su base superior pasa por los dos puntos de corte.'],
        pregunta: ['¿Cuál es el volumen del cilindro?'],
        solucion: [
          ['Se igualan: ', `${coefTxt(A, 'x²')} ${c1 < 0 ? '−' : '+'} ${Math.abs(c1)} = ${c2} − ${coefTxt(B, 'x²')} → ${sumaTxt === '1' ? '' : `(${sumaTxt})`}x² = ${c2 - c1}.`],
          ['x² = ', `${x0 * x0} → `, v('x', `x = ±${x0}`), '; y = ', v('y', `${y0}`), '.'],
          ['Radio = distancia del punto de corte al eje Y = ', v('x', `${x0}`), '; altura = ', v('y', `${y0}`), '.'],
          ['V = π·', v('x', x0), '²·', v('y', y0), ' = ', v('V', P.pi(V, 'u³')), '.'],
        ],
        datos: { tipo: 'parabolas', a: A, c1, b: B, c2 },
      };
    }
  }

  return { id: 'geo-analitica', titulo: 'Geometría analítica: baricentro, rectas, elipse y parábolas', generar, calc, TIPOS };
});
