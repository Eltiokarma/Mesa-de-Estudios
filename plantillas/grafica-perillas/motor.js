/*
 * Motor de «La gráfica con perillas»: funciones y sus transformaciones.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorGrafica) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Una función se describe con una "ficha" { base, a, b, h, k }: g(x) = a·f(b(x − h)) + k, donde f es una de
 * las funciones base:
 *   lineal x · cuadratica x² · abs |x| · raiz √x · cubica x³ · exp2 2^x · log2 log₂ x · reciproca 1/x
 *   (y, para las inversas: cbrt ∛x y cuadraticaPos x² con x ≥ 0)
 * Faltan a o b: valen 1; faltan h o k: valen 0. a y b no pueden ser 0.
 *
 *   evaluar(ficha, x)            g(x), o definido: false si x no está en el dominio
 *   gemelo(ficha, x0)            a dónde va el punto (x0; f(x0)) de la base: (h + x0/b; a·f(x0) + k)
 *   ancla(ficha), desdeAncla     el punto que se arrastra en la escena y las perillas h, k que le corresponden
 *   dominio(ficha), rango(ficha) como uniones de intervalos, con su texto (notación peruana: ⟨a; b], ℝ, ∅)
 *   vertice(ficha), ceros(ficha), cortes(ficha), resolver(ficha, c) (todos los x con g(x) = c)
 *   cuadraticaGeneral(A, B, C)   vértice, discriminante y ceros de Ax² + Bx + C
 *   inversa(ficha), inversaEn(ficha, y)   despeje simbólico: la inversa es otra ficha; si g no es inyectiva,
 *                                dice por qué (dos x con la misma y) y da la inversa de una rama
 *   reciproco(ficha, x)          1/g(x): lo que se calcula si se lee f⁻¹ como exponente
 *   muestrear, muestrearReciproco, muestrearReflejo, reflejoAnimado   puntos para dibujar g, 1/g y el reflejo de g en y = x
 *   pendiente(ficha, x), secante(ficha, x1, x2), compararRectas(A, B, x)
 *   cortesVertical(relacion, x), esFuncion(relacion, x0, x1)   prueba de la recta vertical
 *   conjuntoSimple(op, v), inecuacionLineal(m, n, op, c), inecuacionCuadratica(A, B, C, op),
 *   valorAbsoluto(c, r, op) (|x − c| op r), absIgual(p, q, r, s) (|px + q| = rx + s),
 *   inecuacionRacional(n, p, op, c) (n/(x − p) op c), posicionRecta(transformacion, u, t)
 *   formula(ficha)               el texto de g(x) y sus partes, cada una con la perilla que la cambia
 *
 * Cada resultado que alimenta una predicción trae 'errores': lo que da cada error típico de
 * docs/investigacion/algebra-funciones-ideas-erroneas.md (AL16, AL19, AL20, AL22, AL25, AL27, AL28, AL29…).
 *
 * Intervalos: { lo, hi, cLo, cHi } con lo/hi que pueden ser ±Infinity (cLo/cHi: si el extremo entra).
 * Un punto suelto es { lo: p, hi: p, cLo: true, cHi: true }.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorGrafica = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9;
  const INF = Infinity;
  const LN2 = Math.LN2;
  const limpio = x => (Math.abs(x) < 1e-12 ? 0 : x);

  // ---------- Números en texto: coma decimal, signo menos tipográfico y fracciones cortas ----------
  function num(x) {
    if (x === INF) return '+∞';
    if (x === -INF) return '−∞';
    if (!Number.isFinite(x)) return '—';
    const s = x < 0 ? '−' : '', v = Math.abs(x);
    if (Math.abs(v - Math.round(v)) < 1e-9) return s + String(Math.round(v));
    for (let d = 2; d <= 12; d++) {
      const n = Math.round(v * d);
      if (Math.abs(v * d - n) < 1e-9) return s + n + '/' + d;
    }
    return s + String(Math.round(v * 1e4) / 1e4).replace('.', ',');
  }

  // ---------- Intervalos ----------
  const R = () => [{ lo: -INF, hi: INF, cLo: false, cHi: false }];
  const iv = (lo, hi, cLo, cHi) => ({ lo, hi, cLo: lo === -INF ? false : !!cLo, cHi: hi === INF ? false : !!cHi });
  function ordenar(c) { return c.slice().sort((p, q) => p.lo - q.lo || (p.cLo === q.cLo ? 0 : p.cLo ? -1 : 1)); }
  // Une intervalos que se tocan o se enciman ([1; 2] ∪ ⟨2; 3⟩ = [1; 3⟩).
  function unir(c) {
    const o = ordenar(c.filter(I => I.lo < I.hi || (I.lo === I.hi && I.cLo && I.cHi))), r = [];
    for (const I of o) {
      const u = r[r.length - 1];
      if (u && (I.lo < u.hi || (I.lo === u.hi && (u.cHi || I.cLo)))) {
        if (I.hi > u.hi || (I.hi === u.hi && I.cHi)) { u.hi = I.hi; u.cHi = I.cHi; }
      } else r.push({ ...I });
    }
    return r;
  }
  // Imagen de un intervalo por x ↦ s·x + t (s ≠ 0): si s < 0 se dan vuelta los extremos.
  function afin(I, s, t) {
    const a = s * I.lo + t, b = s * I.hi + t;
    return s > 0 ? iv(a, b, I.cLo, I.cHi) : iv(b, a, I.cHi, I.cLo);
  }
  function pertenece(c, x) {
    return c.some(I => (x > I.lo || (x === I.lo && I.cLo)) && (x < I.hi || (x === I.hi && I.cHi)));
  }
  function textoIntervalo(I) {
    if (I.lo === I.hi) return '{' + num(I.lo) + '}';
    return (I.cLo ? '[' : '⟨') + num(I.lo) + '; ' + num(I.hi) + (I.cHi ? ']' : '⟩');
  }
  function texto(c) {
    const u = unir(c);
    if (!u.length) return '∅';
    if (u.length === 1 && u[0].lo === -INF && u[0].hi === INF) return 'ℝ';
    // ℝ sin un punto: ⟨−∞; p⟩ ∪ ⟨p; +∞⟩
    if (u.length === 2 && u[0].lo === -INF && u[1].hi === INF && u[0].hi === u[1].lo && !u[0].cHi && !u[1].cLo)
      return 'ℝ − {' + num(u[0].hi) + '}';
    // los puntos sueltos van juntos entre llaves: {−1/3; 3}
    if (u.every(I => I.lo === I.hi)) return '{' + u.map(I => num(I.lo)).join('; ') + '}';
    return u.map(textoIntervalo).join(' ∪ ');
  }
  function conjunto(c) { const u = unir(c); return { intervalos: u, texto: texto(u) }; }

  const OPS = ['<', '<=', '>', '>='];
  const SIMBOLO = { '<': '<', '<=': '≤', '>': '>', '>=': '≥' };
  const VOLTEA = { '<': '>', '<=': '>=', '>': '<', '>=': '<=' };    // al multiplicar por un negativo
  function operador(op) { if (!OPS.includes(op)) throw new Error(`el operador debe ser uno de ${OPS.join(' ')}`); return op; }
  function cumple(v, op) {
    // v es (lado izquierdo − lado derecho); con tolerancia, cerca de 0 cuenta como 0
    const z = Math.abs(v) <= 1e-12 ? 0 : v;
    return op === '<' ? z < 0 : op === '<=' ? z <= 0 : op === '>' ? z > 0 : z >= 0;
  }
  // { x : x op v }
  function conjuntoSimple(op, v) {
    operador(op);
    if (op === '<') return [iv(-INF, v, false, false)];
    if (op === '<=') return [iv(-INF, v, false, true)];
    if (op === '>') return [iv(v, INF, false, false)];
    return [iv(v, INF, true, false)];
  }
  // Resuelve F(x) op 0 por signos: F solo cambia de signo en los puntos críticos (o donde no está definida).
  function porSignos(F, criticos, op) {
    const p = [...new Set(criticos.filter(Number.isFinite).map(limpio))].sort((x, y) => x - y);
    const c = [];
    const prueba = x => { const v = F(x); return v !== null && Number.isFinite(v) && cumple(v, op); };
    const bordes = [-INF, ...p, INF];
    for (let i = 0; i + 1 < bordes.length; i++) {
      const lo = bordes[i], hi = bordes[i + 1];
      const m = lo === -INF ? (hi === INF ? 0 : hi - 1) : hi === INF ? lo + 1 : (lo + hi) / 2;
      if (prueba(m)) c.push(iv(lo, hi, false, false));
    }
    for (const x of p) if (prueba(x)) c.push(iv(x, x, true, true));
    return conjunto(c);
  }

  // ---------- Funciones base ----------
  const pos = u => u >= 0, positivo = u => u > 0, noCero = u => u !== 0, todo = () => true;
  const SOLO_POS = () => [iv(0, INF, true, false)];
  const FAMILIAS = {
    lineal: { f: u => u, d: () => 1, en: todo, dom: R, ran: R, pre: v => [v], inv: 'lineal', ancla: 0, nombre: 'x' },
    cuadratica: { f: u => u * u, d: u => 2 * u, en: todo, dom: R, ran: SOLO_POS,
      pre: v => (v > 0 ? [-Math.sqrt(v), Math.sqrt(v)] : v === 0 ? [0] : []), inv: null, rama: 'raiz', ancla: 0, nombre: 'x²' },
    abs: { f: Math.abs, d: u => (u === 0 ? null : Math.sign(u)), en: todo, dom: R, ran: SOLO_POS,
      pre: v => (v > 0 ? [-v, v] : v === 0 ? [0] : []), inv: null, rama: 'lineal', ancla: 0, nombre: '|x|' },
    raiz: { f: Math.sqrt, d: u => (u > 0 ? 1 / (2 * Math.sqrt(u)) : null), en: pos, dom: SOLO_POS, ran: SOLO_POS,
      pre: v => (v >= 0 ? [v * v] : []), inv: 'cuadraticaPos', ancla: 0, nombre: '√x' },
    cuadraticaPos: { f: u => u * u, d: u => 2 * u, en: pos, dom: SOLO_POS, ran: SOLO_POS,
      pre: v => (v >= 0 ? [Math.sqrt(v)] : []), inv: 'raiz', ancla: 0, nombre: 'x² (x ≥ 0)' },
    cubica: { f: u => u * u * u, d: u => 3 * u * u, en: todo, dom: R, ran: R, pre: v => [Math.cbrt(v)], inv: 'cbrt', ancla: 0, nombre: 'x³' },
    cbrt: { f: Math.cbrt, d: u => (u === 0 ? null : 1 / (3 * Math.cbrt(u) * Math.cbrt(u))), en: todo, dom: R, ran: R,
      pre: v => [v * v * v], inv: 'cubica', ancla: 0, nombre: '∛x' },
    exp2: { f: u => Math.pow(2, u), d: u => LN2 * Math.pow(2, u), en: todo, dom: R, ran: () => [iv(0, INF, false, false)],
      pre: v => (v > 0 ? [Math.log2(v)] : []), inv: 'log2', ancla: 0, nombre: '2^x' },
    log2: { f: Math.log2, d: u => 1 / (u * LN2), en: positivo, dom: () => [iv(0, INF, false, false)], ran: R,
      pre: v => [Math.pow(2, v)], inv: 'exp2', ancla: 1, nombre: 'log₂ x' },
    reciproca: { f: u => 1 / u, d: u => -1 / (u * u), en: noCero, dom: () => [iv(-INF, 0, false, false), iv(0, INF, false, false)],
      ran: () => [iv(-INF, 0, false, false), iv(0, INF, false, false)], pre: v => (v !== 0 ? [1 / v] : []), inv: 'reciproca', ancla: null, nombre: '1/x' },
  };
  const BASES = Object.keys(FAMILIAS);

  function ficha(o) {
    if (!o || typeof o !== 'object') throw new Error('la función debe ser una ficha { base, a, b, h, k }');
    const F = FAMILIAS[o.base];
    if (!F) throw new Error(`base desconocida: ${o.base} (use ${BASES.join(', ')})`);
    const r = { base: o.base };
    for (const [k, v0] of [['a', 1], ['b', 1], ['h', 0], ['k', 0]]) {
      const v = o[k] === undefined ? v0 : o[k];
      if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${k} debe ser un número`);
      r[k] = v + 0;
    }
    if (r.a === 0) throw new Error('a no puede ser 0: la gráfica se aplastaría en una recta horizontal');
    if (r.b === 0) throw new Error('b no puede ser 0');
    return r;
  }
  const fam = g => FAMILIAS[g.base];

  // ---------- Evaluar ----------
  function valor(g, x) {
    const F = fam(g), u = g.b * (x - g.h);
    if (!F.en(limpio(u))) return null;
    const y = g.a * F.f(limpio(u)) + g.k;
    return Number.isFinite(y) ? y : null;
  }
  function evaluar(g0, x) {
    const g = ficha(g0);
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error('x debe ser un número');
    const v = valor(g, x);
    return {
      x, valor: v, definido: v !== null,
      errores: {
        // AL28: mover la gráfica al revés, como si f(x − h) fuera f(x + h)
        hAlReves: valor({ ...g, h: -g.h }, x),
        // AL27: f(x − h) como f(x) − h (el desplazamiento horizontal leído como vertical)
        hComoVertical: (() => { const s = valor({ ...g, h: 0 }, x); return s === null ? null : s - g.h; })(),
      },
    };
  }

  // f(x0 + d): AL27, la función tratada como multiplicación (f(x + d) = f(x) + d, f(a + b) = f(a) + f(b)).
  function evaluarSuma(g0, x0, d) {
    const g = ficha(g0), v = valor(g, x0 + d), f0 = valor(g, x0), fd = valor(g, d);
    const errores = { sumaFuera: f0 === null ? null : f0 + d, sumaDePartes: f0 === null || fd === null ? null : f0 + fd };
    // Solo para la cuadrática a(x − h)² + k: (x0 + d)² como x0² + d² (AL8 dentro de la función)
    if (g.base === 'cuadratica' && g.h === 0 && g.b === 1) errores.cuadradoPorPartes = g.a * (x0 * x0 + d * d) + g.k;
    return { x: x0 + d, valor: v, errores };
  }

  // ---------- Punto gemelo ----------
  function gemelo(g0, x0) {
    const g = ficha(g0), F = fam(g);
    if (typeof x0 !== 'number' || !Number.isFinite(x0)) throw new Error('x0 debe ser un número');
    if (!F.en(x0)) return { base: null, gemelo: null, definido: false };
    const y0 = F.f(x0), x1 = g.h + x0 / g.b, y1 = g.a * y0 + g.k;
    return {
      definido: true,
      base: { x: x0, y: y0 }, gemelo: { x: limpio(x1), y: limpio(y1) },
      desplazamiento: { dx: limpio(x1 - x0), dy: limpio(y1 - y0) },
      // comprobación: el gemelo está sobre g
      sobreG: valor(g, x1),
      errores: {
        hAlReves: { x: limpio(x0 / g.b - g.h), y: limpio(y1) },          // AL28: corre a la izquierda con h > 0
        hComoVertical: { x: x0, y: limpio(y1 - g.h) },                    // lee h como subida o bajada
      },
    };
  }
  // El punto que se arrastra: el gemelo del punto ancla de la base (en 1/x, el cruce de las asíntotas).
  function ancla(g0) {
    const g = ficha(g0), F = fam(g);
    if (F.ancla === null) return { x: g.h, y: g.k, asintotas: true };
    const p = gemelo(g, F.ancla).gemelo;
    return { x: p.x, y: p.y, asintotas: false };
  }
  // Perillas h y k que ponen el ancla en P.
  function desdeAncla(g0, P) {
    const g = ficha(g0), F = fam(g);
    if (!P || !Number.isFinite(P.x) || !Number.isFinite(P.y)) throw new Error('el punto debe tener x e y numéricas');
    if (F.ancla === null) return { h: P.x, k: P.y };
    return { h: limpio(P.x - F.ancla / g.b), k: limpio(P.y - g.a * F.f(F.ancla)) };
  }

  // ---------- Dominio, rango, vértice, ceros ----------
  function dominio(g0) { const g = ficha(g0); return conjunto(fam(g).dom().map(I => afin(I, 1 / g.b, g.h))); }
  function rango(g0) { const g = ficha(g0); return conjunto(fam(g).ran().map(I => afin(I, g.a, g.k))); }
  function resolver(g0, c) {
    const g = ficha(g0);
    if (typeof c !== 'number' || !Number.isFinite(c)) throw new Error('el valor debe ser un número');
    const v = limpio((c - g.k) / g.a);
    const xs = fam(g).pre(v).filter(u => fam(g).en(limpio(u))).map(u => limpio(g.h + u / g.b));
    return [...new Set(xs)].sort((p, q) => p - q);
  }
  function ceros(g0) {
    const g = ficha(g0), xs = resolver(g, 0);
    return { ceros: xs, cuantos: xs.length, errores: { hAlReves: resolver({ ...g, h: -g.h }, 0) } };
  }
  function cortes(g0) {
    const g = ficha(g0), y0 = valor(g, 0);
    return { ejeY: y0 === null ? null : { x: 0, y: limpio(y0) }, ejeX: resolver(g, 0).map(x => ({ x, y: 0 })) };
  }
  function vertice(g0) {
    const g = ficha(g0);
    if (g.base !== 'cuadratica' && g.base !== 'abs') throw new Error('solo la cuadrática y el valor absoluto tienen vértice');
    const minimo = g.a > 0;
    return {
      x: g.h, y: g.k, tipo: minimo ? 'mínimo' : 'máximo', abre: minimo ? 'arriba' : 'abajo',
      ejeSimetria: g.h,
      errores: {
        hAlReves: { x: limpio(-g.h), y: g.k },                // AL28: 2 a la izquierda
        hComoVertical: { x: 0, y: limpio(g.k - g.h) },        // lee el "− h" como bajada: (0; k − h)
        hkCruzados: { x: g.k, y: g.h },
      },
    };
  }
  function cuadraticaGeneral(A, B, C) {
    for (const [n, v] of [['A', A], ['B', B], ['C', C]]) if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${n} debe ser un número`);
    if (A === 0) throw new Error('A no puede ser 0: no sería cuadrática');
    const xv = limpio(-B / (2 * A)), yv = limpio(C - B * B / (4 * A)), D = B * B - 4 * A * C;
    const g = { base: 'cuadratica', a: A, b: 1, h: xv, k: yv };
    return {
      vertice: { x: xv, y: yv }, discriminante: D, ceros: resolver(g, 0), canonica: g,
      errores: {
        verticeSignoMal: limpio(B / (2 * A)),                     // −b/2a sin el menos
        discriminanteSignoMal: B * B + 4 * A * C,                 // el signo de −4AC cambiado: B² + 4AC
      },
    };
  }

  // ---------- Inversa ----------
  // De y = a·f(b(x − h)) + k se despeja x = h + f⁻¹((y − k)/a)/b: es otra ficha, con a' = 1/b, b' = 1/a, h' = k, k' = h.
  const intercambiar = (g, base) => ({ base, a: 1 / g.b, b: 1 / g.a, h: g.k, k: g.h });
  function lineal(g) { return { m: g.a * g.b, n: limpio(g.k - g.a * g.b * g.h) }; }
  function inversa(g0) {
    const g = ficha(g0), F = fam(g);
    if (F.inv) {
      let s = intercambiar(g, F.inv);
      // la inversa de a/(x − h) + k se escribe a/(x − k) + h (sin un b fraccionario)
      if (s.base === 'reciproca') s = { ...s, a: s.a / s.b, b: 1 };
      const r = {
        invertible: true, ficha: s, texto: formula(s).texto,
        dominio: rango(g), rango: dominio(g),
      };
      if (g.base === 'lineal') {
        const { m, n } = lineal(g);
        r.recta = { m: 1 / m, n: limpio(-n / m) };
        r.texto = textoInversaLineal(m, n);
        r.errores = {
          reciproco: { texto: '1/(' + textoRecta(m, n) + ')' },                   // AL29: el −1 como exponente
          ordenSinInvertir: { m: 1 / m, n: limpio(-n), texto: textoRecta(1 / m, -n) },   // deshace ×m y +n sin invertir el orden
          signoMal: { m: 1 / m, n: limpio(n / m), texto: textoInversaLineal(m, -n) },   // pasa n sin cambiarle el signo (AL16)
        };
      }
      return r;
    }
    // No es inyectiva: la recta horizontal y = a + k corta en x = h ± 1/b.
    const x1 = g.h - 1 / Math.abs(g.b), x2 = g.h + 1 / Math.abs(g.b), y = g.a + g.k;
    const rama = intercambiar(g, F.rama);
    // La rama de la derecha del vértice, x ≥ h: allí b(x − h) ≥ 0 si b > 0.
    return {
      invertible: false,
      motivo: `no es inyectiva: la recta horizontal y = ${num(y)} la corta en x = ${num(x1)} y en x = ${num(x2)}`,
      testigo: { y, xs: [x1, x2] },
      rama: { ficha: rama, texto: formula(rama).texto, desde: g.h, dominio: rango(g), rango: conjunto([iv(g.h, INF, true, false)]) },
    };
  }
  function inversaEn(g0, y) {
    const g = ficha(g0), I = inversa(g);
    if (typeof y !== 'number' || !Number.isFinite(y)) throw new Error('y debe ser un número');
    const xs = resolver(g, y), gy = valor(g, y);
    const r = {
      valor: I.invertible ? (xs.length ? xs[0] : null) : null, todos: xs,
      comprobacion: xs.length ? valor(g, xs[0]) : null,
      errores: {
        reciproco: gy === null || gy === 0 ? null : 1 / gy,     // AL29: f⁻¹(y) = 1/f(y)
        directo: gy,                                          // calcula f(y) en vez de f⁻¹(y)
      },
    };
    if (g.base === 'lineal') { const { m, n } = lineal(g); r.errores.despejeAlReves = (y - n) * m; }   // (10 − 6)·2
    return r;
  }
  function reciproco(g0, x) { const v = valor(ficha(g0), x); return { valor: v === null || v === 0 ? null : 1 / v }; }

  // ---------- Fórmulas en texto ----------
  function textoRecta(m, n) {
    const d = 1 / Math.abs(m), fr = Math.abs(d - Math.round(d)) < 1e-9 && Math.round(d) > 1;
    const mx = m === 1 ? 'x' : m === -1 ? '−x' : fr ? (m < 0 ? '−' : '') + 'x/' + Math.round(d) : conParentesis(num(m)) + 'x';
    return n === 0 ? mx : mx + (n > 0 ? ' + ' : ' − ') + num(Math.abs(n));
  }
  // La inversa de mx + n escrita como (x − n)/m cuando se puede
  function textoInversaLineal(m, n) {
    const arriba = n === 0 ? 'x' : 'x' + (n > 0 ? ' − ' : ' + ') + num(Math.abs(n));
    if (m === 1) return arriba;
    if (m === -1) return n === 0 ? '−x' : '−(' + arriba + ')';
    if (Number.isInteger(m)) return (n === 0 ? 'x' : '(' + arriba + ')') + '/' + (m < 0 ? '(' + num(m) + ')' : num(m));
    return textoRecta(1 / m, limpio(-n / m));
  }
  // Un coeficiente fraccionario va entre paréntesis, para que (5/2)x no se lea 5/(2x)
  const conParentesis = t => (t.includes('/') ? '(' + t + ')' : t);
  // Partes de g(x): cada una con la perilla que la cambia ('a', 'h', 'k' o null). 'sup': va de exponente.
  function formula(g0) {
    let g = ficha(g0);
    if (g.base === 'reciproca' && g.b !== 1) g = { ...g, a: g.a / g.b, b: 1 };   // a/(b(x − h)) = (a/b)/(x − h)
    const P = [];
    const add = (t, v, sup) => P.push(sup ? [t, v || null, 'sup'] : [t, v || null]);
    const dentro = sup => {
      // x − h, o (x − h)/n, o b(x − h)
      const hx = () => { add('x', null, sup); if (g.h !== 0) add((g.h > 0 ? ' − ' : ' + ') + num(Math.abs(g.h)), 'h', sup); };
      if (g.b === 1) hx();
      else if (g.b === -1) { if (g.h === 0) add('−x', null, sup); else { add('−(', null, sup); hx(); add(')', null, sup); } }
      else if (Number.isInteger(1 / g.b) && 1 / g.b > 0) { if (g.h !== 0) add('(', null, sup); hx(); if (g.h !== 0) add(')', null, sup); add('/' + num(1 / g.b), null, sup); }
      else { add(conParentesis(num(g.b)) + (g.h !== 0 ? '(' : ''), null, sup); hx(); if (g.h !== 0) add(')', null, sup); }
    };
    const simple = g.h === 0 && g.b === 1;
    const coef = (pegado) => { if (g.a === 1) return; if (g.a === -1) { add('−', 'a'); return; } add(conParentesis(num(g.a)) + (pegado ? '' : '·'), 'a'); };
    const B = g.base;
    if (B === 'lineal') { coef(true); if (simple) add('x'); else { add('('); dentro(); add(')'); } }
    else if (B === 'cuadratica' || B === 'cuadraticaPos' || B === 'cubica') {
      coef(true); const e = B === 'cubica' ? '³' : '²';
      if (simple) add('x' + e); else { add('('); dentro(); add(')' + e); }
    } else if (B === 'abs') { coef(true); add('|'); dentro(); add('|'); }
    else if (B === 'raiz' || B === 'cbrt') { coef(true); const r = B === 'raiz' ? '√' : '∛'; if (simple) add(r + 'x'); else { add(r + '('); dentro(); add(')'); } }
    else if (B === 'exp2') { coef(false); add('2'); dentro(true); }
    else if (B === 'log2') { coef(false); if (simple) add('log₂ x'); else { add('log₂('); dentro(); add(')'); } }
    else if (B === 'reciproca') { add(g.a === 1 ? '1' : conParentesis(num(g.a)), g.a === 1 ? null : 'a'); add('/'); if (simple) add('x'); else { add('('); dentro(); add(')'); } }
    if (g.k !== 0) add((g.k > 0 ? ' + ' : ' − ') + num(Math.abs(g.k)), 'k');
    // en el texto plano, el exponente de 2^(...) va entre paréntesis
    let plano = '', enSup = false;
    for (const p of P) {
      if (p[2] === 'sup' && !enSup) { plano += '^('; enSup = true; }
      if (p[2] !== 'sup' && enSup) { plano += ')'; enSup = false; }
      plano += p[0];
    }
    if (enSup) plano += ')';
    if (B === 'exp2' && simple) plano = plano.replace('^(x)', '^x');
    return { texto: plano, partes: P };
  }

  // ---------- Muestreo para dibujar ----------
  // Tramos de puntos [x, y] de g entre x0 y x1. Se corta donde g no está definida y donde se sale mucho
  // de la ventana vertical [y0, y1] (asíntotas); el punto que se sale queda pegado al borde ampliado.
  function muestrear(g0, x0, x1, o) {
    const g = ficha(g0), bordes = [];
    for (const I of dominio(g).intervalos) bordes.push(I.lo, I.hi);
    return muestrearCon(x => valor(g, x), bordes, x0, x1, o);
  }
  // 1/g(x): se corta donde g vale 0 (asíntotas nuevas) y donde g no está definida.
  function muestrearReciproco(g0, x0, x1, o) {
    const g = ficha(g0), bordes = resolver(g, 0);
    for (const I of dominio(g).intervalos) bordes.push(I.lo, I.hi);
    return muestrearCon(x => { const v = valor(g, x); return v === null || Math.abs(v) < 1e-12 ? null : 1 / v; }, bordes, x0, x1, o);
  }
  function muestrearCon(F, bordes, x0, x1, o) {
    if (![x0, x1].every(Number.isFinite) || !(x1 > x0)) throw new Error('la ventana debe ir de un x menor a uno mayor');
    o = o || {};
    const n = o.n || 400, y0 = o.y0 === undefined ? -1e6 : o.y0, y1 = o.y1 === undefined ? 1e6 : o.y1;
    const M = Math.max(1, y1 - y0), lo = y0 - M, hi = y1 + M;
    const xs = [];
    for (let i = 0; i <= n; i++) xs.push(x0 + (x1 - x0) * i / n);
    // puntos extra pegados a los bordes del dominio (raíz que empieza, asíntotas)
    for (const e of bordes) if (Number.isFinite(e) && e >= x0 && e <= x1) {
      for (let j = 1; j <= 9; j++) { const d = (x1 - x0) * Math.pow(10, -j) / 2; xs.push(e - d, e + d); }
      xs.push(e);
    }
    xs.sort((p, q) => p - q);
    const tramos = []; let t = [], pend = null, antes = null;
    for (const x of xs) {
      if (x < x0 || x > x1 || x === antes) continue;
      antes = x;
      const y = F(x);
      if (y === null) { if (t.length) tramos.push(t); t = []; pend = null; continue; }
      if (y < lo || y > hi) {
        // se sale por arriba o por abajo: el tramo termina pegado al borde ampliado
        const yc = y < lo ? lo : hi;
        if (t.length) { t.push([x, yc]); tramos.push(t); t = []; }
        pend = [x, yc];
        continue;
      }
      if (!t.length && pend) t.push(pend);
      pend = null;
      t.push([x, y]);
    }
    if (t.length) tramos.push(t);
    // tramos de un solo punto pegado al borde no sirven
    return tramos.filter(tr => tr.length > 1).map(tr => tr.map(([x, y]) => [limpio(x), limpio(y)]));
  }
  // El reflejo de g en y = x: los puntos (g(x); x). Para la ventana [X0, X1] × [Y0, Y1] del reflejo.
  function muestrearReflejo(g0, X0, X1, Y0, Y1, o) {
    return muestrear(g0, Y0, Y1, Object.assign({}, o, { y0: X0, y1: X1 })).map(tr => tr.map(([x, y]) => [y, x]));
  }
  // Animación del reflejo: el punto se "dobla" sobre la recta y = x, como una hoja que gira sobre ese pliegue.
  function reflejoAnimado(p, t) {
    const x = Array.isArray(p) ? p[0] : p.x, y = Array.isArray(p) ? p[1] : p.y;
    const m = (x + y) / 2, c = Math.cos(Math.PI * t);
    return { x: m + (x - m) * c, y: m + (y - m) * c };
  }

  // ---------- Pendiente ----------
  function pendiente(g0, x) {
    const g = ficha(g0), F = fam(g), u = limpio(g.b * (x - g.h));
    if (!F.en(u)) return { valor: null };
    const d = F.d(u);
    return { valor: d === null || !Number.isFinite(d) ? null : limpio(g.a * g.b * d), altura: valor(g, x) };
  }
  function secante(g0, x1, x2) {
    const g = ficha(g0), y1 = valor(g, x1), y2 = valor(g, x2);
    if (x1 === x2) throw new Error('los dos x deben ser distintos');
    if (y1 === null || y2 === null) return { valor: null };
    return { valor: (y2 - y1) / (x2 - x1), sube: y2 - y1, avanza: x2 - x1, alturas: [y1, y2] };
  }
  // Dos rectas y = m·x + n: dónde se cruzan, cuál está más arriba en x y cuál crece más rápido.
  function compararRectas(A, B, x) {
    for (const [n, r] of [['A', A], ['B', B]]) if (!r || !Number.isFinite(r.m) || !Number.isFinite(r.n)) throw new Error(`la recta ${n} debe tener m y n numéricos`);
    const yA = A.m * x + A.n, yB = B.m * x + B.n;
    const cruce = A.m === B.m ? null : (() => { const xc = (B.n - A.n) / (A.m - B.m); return { x: limpio(xc), y: limpio(A.m * xc + A.n) }; })();
    const masAlta = Math.abs(yA - yB) < TOL ? 'iguales' : yA > yB ? 'A' : 'B';
    const masRapida = A.m === B.m ? 'iguales' : A.m > B.m ? 'A' : 'B';
    return {
      cruce, alturas: { A: yA, B: yB }, pendientes: { A: A.m, B: B.m }, masAlta, masRapida,
      errores: { alturaComoPendiente: masAlta, igualesPorCruzarse: 'iguales' },   // AL25 y confusión intervalo-punto
    };
  }

  // ---------- Prueba de la recta vertical ----------
  // relación: { tipo: 'funcion', ficha } · { tipo: 'reflejo', ficha } (x = g(y)) · { tipo: 'circulo', centro: [cx, cy], r }
  //           { tipo: 'vertical', x } · { tipo: 'constante', c } · { tipo: 'puntos', puntos: [[x, y], …] }
  function cortesVertical(rel, x) {
    if (!rel || typeof rel !== 'object') throw new Error('falta la relación');
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error('x debe ser un número');
    let ys;
    switch (rel.tipo) {
      case 'funcion': { const v = valor(ficha(rel.ficha), x); ys = v === null ? [] : [v]; break; }
      case 'reflejo': ys = resolver(rel.ficha, x); break;
      case 'circulo': {
        const [cx, cy] = rel.centro, d = rel.r * rel.r - (x - cx) * (x - cx);
        ys = d > TOL ? [cy - Math.sqrt(d), cy + Math.sqrt(d)] : Math.abs(d) <= TOL ? [cy] : []; break;
      }
      case 'vertical': return { x, ys: [], cortes: x === rel.x ? INF : 0 };
      case 'constante': ys = [rel.c]; break;
      case 'puntos': ys = [...new Set(rel.puntos.filter(p => p[0] === x).map(p => p[1]))].sort((p, q) => p - q); break;
      default: throw new Error(`tipo de relación desconocido: ${rel.tipo}`);
    }
    return { x, ys: ys.map(limpio), cortes: ys.length };
  }
  function esFuncion(rel, x0, x1, paso) {
    const p = paso || 0.25, xs = [];
    for (let x = x0; x <= x1 + 1e-12; x += p) xs.push(Math.round(x * 1e9) / 1e9);
    if (rel.tipo === 'vertical' || rel.tipo === 'circulo') xs.push(rel.tipo === 'vertical' ? rel.x : rel.centro[0]);
    if (rel.tipo === 'puntos') rel.puntos.forEach(q => xs.push(q[0]));
    let testigo = null;
    for (const x of xs) {
      const c = cortesVertical(rel, x);
      if (c.cortes >= 2 && (!testigo || c.cortes > testigo.cortes)) testigo = c;
    }
    return {
      esFuncion: !testigo, testigo,
      // Argumentos que llevan a decir "sí" a una relación que no es función (AL26: función = fórmula)
      errores: { porTenerFormula: true, porSerReflejoDeUnaFuncion: rel.tipo === 'reflejo' },
    };
  }

  // ---------- Inecuaciones ----------
  // m·x + n op c, paso a paso; cada paso dice qué le pasa a la recta numérica.
  function inecuacionLineal(m, n, op, c) {
    operador(op);
    for (const [k, v] of [['m', m], ['n', n], ['c', c]]) if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${k} debe ser un número`);
    if (m === 0) throw new Error('m no puede ser 0');
    const frontera = limpio((c - n) / m), opF = m < 0 ? VOLTEA[op] : op;
    const pasos = [{ texto: `${textoRecta(m, n)} ${SIMBOLO[op]} ${num(c)}`, m, op, valor: c, transformacion: null }];
    let mm = m, oo = op, vv = c;
    if (n !== 0) { vv = c - n; pasos.push({ texto: `${textoRecta(mm, 0)} ${SIMBOLO[oo]} ${num(vv)}`, m: mm, op: oo, valor: vv, transformacion: { tipo: 'trasladar', d: -n }, explica: `se resta ${num(n)} a los dos lados` }); }
    if (mm < 0) { mm = -mm; oo = VOLTEA[oo]; vv = limpio(-vv); pasos.push({ texto: `${textoRecta(mm, 0)} ${SIMBOLO[oo]} ${num(vv)}`, m: mm, op: oo, valor: vv, transformacion: { tipo: 'girar' }, explica: 'se multiplica por −1: la recta da media vuelta y el sentido se invierte' }); }
    if (mm !== 1) { vv = limpio(vv / mm); pasos.push({ texto: `x ${SIMBOLO[oo]} ${num(vv)}`, m: 1, op: oo, valor: vv, transformacion: { tipo: 'escalar', f: 1 / mm }, explica: `se divide entre ${num(mm)}, que es positivo: el sentido no cambia` }); mm = 1; }
    const sol = conjunto(conjuntoSimple(opF, frontera));
    const malT = limpio((c + n) / m);
    return {
      frontera, op: opF, invierte: m < 0, pasos, ...sol,
      textoX: `x ${SIMBOLO[opF]} ${num(frontera)}`,
      errores: {
        sinInvertir: Object.assign(conjunto(conjuntoSimple(op, frontera)), { textoX: `x ${SIMBOLO[op]} ${num(frontera)}` }),     // AL20
        transponeMal: Object.assign(conjunto(conjuntoSimple(opF, malT)), { textoX: `x ${SIMBOLO[opF]} ${num(malT)}` }),         // AL16
        comoEcuacion: Object.assign(conjunto([iv(frontera, frontera, true, true)]), { textoX: `x = ${num(frontera)}` }),          // AL19
      },
    };
  }
  // A·x² + B·x + C op 0
  function inecuacionCuadratica(A, B, C, op) {
    operador(op);
    const q = cuadraticaGeneral(A, B, C), F = x => A * x * x + B * x + C;
    const sol = porSignos(F, q.ceros, op);
    const r = q.ceros, mayor = r.length ? r[r.length - 1] : null;
    const errores = {
      alReves: porSignos(F, q.ceros, VOLTEA[op]),                 // toma la región de afuera por la de adentro, o al revés
    };
    // AL19: x² < 9 ⇒ x < 3 (se resuelve como ecuación y se "pone el signo" con la raíz positiva)
    if (mayor !== null) errores.comoEcuacion = Object.assign(conjunto(conjuntoSimple(A > 0 ? op : VOLTEA[op], mayor)), { textoX: `x ${SIMBOLO[A > 0 ? op : VOLTEA[op]]} ${num(mayor)}` });
    return { raices: r, discriminante: q.discriminante, ...sol, errores };
  }
  // |x − c| op r: la distancia de x a c comparada con r
  function valorAbsoluto(c, r, op) {
    operador(op);
    if (typeof c !== 'number' || typeof r !== 'number' || !Number.isFinite(c) || !Number.isFinite(r)) throw new Error('c y r deben ser números');
    const F = x => Math.abs(x - c) - r;
    const crit = r >= 0 ? [c - r, c + r] : [];
    const sol = porSignos(F, crit.concat([c]), op);
    const dentro = op === '<' || op === '<=';
    return {
      centro: c, radio: r, dentro, ...sol,
      errores: {
        quitaBarras: Object.assign(conjunto(conjuntoSimple(op, c + r)), { textoX: `x ${SIMBOLO[op]} ${num(c + r)}` }),   // AL22: x − c op r
        alReves: porSignos(F, crit.concat([c]), VOLTEA[op]),                                                         // adentro por afuera
        separaBarras: valorAbsolutoSolo(r + c, op),                                                                  // |x| − c op r ⇒ |x| op r + c
      },
    };
  }
  function valorAbsolutoSolo(r, op) { return porSignos(x => Math.abs(x) - r, r >= 0 ? [-r, r, 0] : [0], op); }
  // |p·x + q| = r·x + s, con la verificación que suele olvidarse (AL23)
  function absIgual(p, q, r, s) {
    for (const [k, v] of [['p', p], ['q', q], ['r', r], ['s', s]]) if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${k} debe ser un número`);
    const cand = [];
    if (p !== r) cand.push(limpio((s - q) / (p - r)));       // p x + q = r x + s
    if (p !== -r) cand.push(limpio((-s - q) / (p + r)));     // p x + q = −(r x + s)
    const unicos = [...new Set(cand)].sort((x, y) => x - y);
    const cumpleX = x => r * x + s >= -1e-12 && Math.abs(Math.abs(p * x + q) - (r * x + s)) <= 1e-9 * Math.max(1, Math.abs(r * x + s));
    const soluciones = unicos.filter(cumpleX), descartadas = unicos.filter(x => !cumpleX(x));
    return {
      soluciones, descartadas, texto: soluciones.length ? texto(soluciones.map(x => iv(x, x, true, true))) : '∅',
      errores: { sinVerificar: unicos },
    };
  }
  // n/(x − p) op c
  function inecuacionRacional(n, p, op, c) {
    operador(op);
    for (const [k, v] of [['n', n], ['p', p], ['c', c]]) if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${k} debe ser un número`);
    if (n === 0) throw new Error('n no puede ser 0');
    const F = x => (x === p ? null : n / (x - p) - c);
    const crit = [p].concat(c !== 0 ? [p + n / c] : []);
    const sol = porSignos(F, crit, op);
    const errores = {};
    // AL21: multiplicar por (x − p) como si fuera positivo: n op c(x − p)
    if (c !== 0) errores.multiplicaSinSigno = inecuacionLineal(c, -c * p, VOLTEA[op], n);
    return { excluido: p, ...sol, errores };
  }
  // Posición (en la recta) del número u durante una transformación, con t de 0 a 1. 'girar' es media vuelta
  // alrededor del 0: el punto sale de la recta y vuelve del otro lado.
  function posicionRecta(tr, u, t) {
    if (!tr) return { x: u, y: 0 };
    if (tr.tipo === 'trasladar') return { x: u + tr.d * t, y: 0 };
    if (tr.tipo === 'girar') return { x: limpio(u * Math.cos(Math.PI * t)), y: limpio(u * Math.sin(Math.PI * t)) };
    if (tr.tipo === 'escalar') return { x: u * (1 + (tr.f - 1) * t), y: 0 };
    throw new Error(`transformación desconocida: ${tr.tipo}`);
  }

  // Azar con semilla (para las pruebas).
  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  return {
    TOL, BASES, num, texto, conjunto, pertenece, conjuntoSimple, unir,
    ficha, evaluar, evaluarSuma, gemelo, ancla, desdeAncla, dominio, rango, resolver, ceros, cortes, vertice, cuadraticaGeneral,
    inversa, inversaEn, reciproco, formula, textoRecta, muestrear, muestrearReciproco, muestrearReflejo, reflejoAnimado,
    pendiente, secante, compararRectas, cortesVertical, esFuncion,
    inecuacionLineal, inecuacionCuadratica, valorAbsoluto, absIgual, inecuacionRacional, posicionRecta, azar,
  };
});
