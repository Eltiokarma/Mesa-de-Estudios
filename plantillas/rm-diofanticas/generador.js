/*
 * Generador: enteros que hay que buscar entre todas las soluciones (razonamiento matemático).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-diofanticas']) y en Node (require). No usa ningún motor.
 * Toda respuesta sale de enumerar las soluciones (o de una búsqueda exhaustiva), nunca de un atajo.
 *
 * Tipos y sus _datos:
 *   dos-articulos { tipo, ctx, a, b, T, pide: 'cuantas'|'mas'|'menos' }  a·x + b·y = T, x, y ≥ 1
 *   palitos       { tipo, a, b, L }  a·x + b·y = L, x, y ≥ 0; menor x + y
 *   monedas       { tipo, den: [céntimos…], S (céntimos), k }  suma S, al menos k de cada tipo; máximo de monedas
 *   grupos        { tipo, den: [d1, d2, d3], cant: [c1, c2, c3], G }  máximo de grupos disjuntos que suman G
 *   tres-precios  { tipo, p: [p1, p2, p3], g: [g1, g2, g3], T, m }  gasto exacto T, al menos m de cada tipo;
 *                 mayor ganancia Σ g·x
 *   dardos        { tipo, sectores: [...], S, pide: 'tiros'|'costo', costo }  puntaje exacto S con el menor
 *                 número de lanzamientos (un sector se puede repetir)
 *   alcanza       { tipo, l, d, k, a1, b1, a2, b3 }  lapicero l, cuaderno l + d; k lapiceros y un cuaderno
 *                 cuestan (k + 1)l + d; D ≥ a1·c + b1·l, D < a2·c, D < b3·l; mayor D entero
 *   reparto       { tipo, C, f, lo, hi }  n con lo < n < hi que divide a C + f (y f < n)
 *   borrar        { tipo, bloque: '2034', r, S }  número con el bloque escrito r veces; máximo de cifras
 *                 a borrar para que las que quedan sumen S
 *   expresion     { tipo, nums: [...5], ops: [...4] }  ubicar los números en □ op □ op … para el mayor
 *                 resultado entero, con jerarquía de operaciones
 *
 * calc expone: soluciones2, palitos, monedas, grupos, tresPrecios, dardos, alcanza, reparto, borrar,
 * expresion, evaluar (con 'jerarquia' | 'izquierda' | 'suma-primero').
 *
 * Errores: RMP2 (primera solución sin optimizar, o el extremo equivocado), RMP51 (condición olvidada:
 * los mínimos por tipo, que sea exacto, los ceros, que sea entero), RMP53 (el borde cuenta: «no
 * alcanza» tomado como «alcanza justo»), RMP58 (jerarquía de operaciones), AR5 (dato intermedio),
 * RMP80 (das por posible uno más allá del óptimo sin comprobarlo: una moneda en dos grupos, un dardo
 * menos), AR18 (enumeración sin sistema, parcial) y RM1 (traducción: «faltan» leído como «sobran», hipótesis).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const RM = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion, respaldo = 'hipotesis', fuente = null) => ({ id, valor, explicacion, respaldo, fuente });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const ent = x => Number.isInteger(x) && x > 0;
  const corto = x => Number.isFinite(x) && x > 0 && Math.abs(x * 100 - Math.round(x * 100)) < 1e-7;
  const pl = (x, uno, varios) => `${f(x)} ${x === 1 ? uno : varios}`;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const soles = c => 'S/ ' + (c / 100).toFixed(2).replace('.', ',');

  // ---------------------------------------------------------------- fracciones exactas (para ÷)
  const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const OPS = {
    '+': (a, b) => Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]),
    '−': (a, b) => Q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]),
    '×': (a, b) => Q(a[0] * b[0], a[1] * b[1]),
    '÷': (a, b) => Q(a[0] * b[1], a[1] * b[0]),
  };
  const ALTA = op => op === '×' || op === '÷';
  function permutaciones(l) {
    if (l.length <= 1) return [l.slice()];
    const r = [];
    l.forEach((x, i) => { for (const p of permutaciones(l.filter((_, j) => j !== i))) r.push([x, ...p]); });
    return r;
  }

  // ------------------------------------------------------------------ cálculo puro
  const calc = {
    // Todas las soluciones (x, y) de a·x + b·y = T con x, y ≥ min, de menor a mayor x.
    soluciones2(a, b, T, min = 1) {
      const r = [];
      for (let x = min; a * x <= T - b * min; x++) if ((T - a * x) % b === 0) r.push([x, (T - a * x) / b]);
      return r;
    },
    palitos(a, b, L) {
      const sol = calc.soluciones2(a, b, L, 0);
      const piezas = sol.map(([x, y]) => x + y);
      return { soluciones: sol, min: Math.min(...piezas), max: Math.max(...piezas) };
    },
    // Monedas: todas las combinaciones (enumeración) con al menos k de cada tipo y suma S.
    monedas(den, S, k) {
      let max = -Infinity, min = Infinity, mejor = null;
      const rec = (i, resto, cuenta, usadas) => {
        if (i === den.length - 1) {
          if (resto % den[i] === 0 && resto / den[i] >= k) {
            const c = cuenta + resto / den[i], u = [...usadas, resto / den[i]];
            if (c > max) { max = c; mejor = u; }
            if (c < min) min = c;
          }
          return;
        }
        const minResto = den.slice(i + 1).reduce((s, d) => s + k * d, 0);
        for (let x = k; den[i] * x <= resto - minResto; x++) rec(i + 1, resto - den[i] * x, cuenta + x, [...usadas, x]);
      };
      rec(0, S, 0, []);
      return max === -Infinity ? null : { max, min, mejor };
    },
    // Máximo de grupos disjuntos que suman G, con las existencias dadas (búsqueda con memoria).
    grupos(den, cant, G) {
      const patrones = [];
      for (let a = 0; a * den[0] <= G; a++) for (let b = 0; a * den[0] + b * den[1] <= G; b++) {
        const r = G - a * den[0] - b * den[1];
        if (r % den[2] === 0) patrones.push([a, b, r / den[2]]);
      }
      const memo = new Map();
      const rec = c => {
        const key = c.join(',');
        if (memo.has(key)) return memo.get(key);
        let mejor = 0;
        for (const p of patrones) if (p.every((x, i) => x <= c[i])) mejor = Math.max(mejor, 1 + rec(c.map((x, i) => x - p[i])));
        memo.set(key, mejor);
        return mejor;
      };
      const max = rec(cant), reparto = [];
      let c = cant.slice();
      while (rec(c) > 0) {
        const p = patrones.find(p => p.every((x, i) => x <= c[i]) && 1 + rec(c.map((x, i) => x - p[i])) === rec(c));
        reparto.push(p); c = c.map((x, i) => x - p[i]);
      }
      return { max, patrones, reparto };
    },
    tresPrecios(p, g, T, m) {
      const sol = [];
      for (let x = m; p[0] * x <= T; x++) for (let y = m; p[0] * x + p[1] * y <= T; y++) {
        const r = T - p[0] * x - p[1] * y;
        if (r % p[2] === 0 && r / p[2] >= m) sol.push([x, y, r / p[2]]);
      }
      const gan = s => s[0] * g[0] + s[1] * g[1] + s[2] * g[2];
      if (!sol.length) return null;
      let mejor = sol[0];
      for (const s of sol) if (gan(s) > gan(mejor)) mejor = s;
      return { soluciones: sol, mejor, ganancia: gan(mejor), gan };
    },
    // Menor número de lanzamientos para sumar S exacto (programación dinámica sobre el puntaje).
    dardos(sectores, S) {
      const dp = new Array(S + 1).fill(Infinity); dp[0] = 0;
      for (let s = 1; s <= S; s++) for (const x of sectores) if (x <= s && dp[s - x] + 1 < dp[s]) dp[s] = dp[s - x] + 1;
      return Number.isFinite(dp[S]) ? dp[S] : null;
    },
    alcanza({ l, d, k, a1, b1, a2, b3 }) {
      const c = l + d;
      const desde = a1 * c + b1 * l, hasta = Math.min(a2 * c, b3 * l) - 1;
      return { c, Q: (k + 1) * l + d, desde, hasta };
    },
    reparto({ C, f: falta, lo, hi }) {
      const r = [];
      for (let n = lo + 1; n < hi; n++) if ((C + falta) % n === 0 && falta < n) r.push(n);
      return r;
    },
    borrar({ bloque, r, S }) {
      const cifras = bloque.repeat(r).split('').map(Number);
      const total = cifras.length;
      // Menor y mayor número de cifras distintas de cero que suman S (mochila 0/1 por cuenta).
      const INF = Infinity;
      let menos = new Array(S + 1).fill(INF), mas = new Array(S + 1).fill(-INF);
      menos[0] = 0; mas[0] = 0;
      for (const c of cifras) {
        if (c === 0) continue;
        for (let s = S; s >= c; s--) {
          if (menos[s - c] + 1 < menos[s]) menos[s] = menos[s - c] + 1;
          if (mas[s - c] + 1 > mas[s]) mas[s] = mas[s - c] + 1;
        }
      }
      if (!Number.isFinite(menos[S])) return null;
      return { total, ceros: cifras.filter(c => c === 0).length, quedanMin: menos[S], quedanMax: mas[S], borrar: total - menos[S] };
    },
    evaluar(nums, ops, modo = 'jerarquia') {
      const q = nums.map(x => Q(x));
      if (modo === 'izquierda') return ops.reduce((acc, op, i) => OPS[op](acc, q[i + 1]), q[0]);
      const alta = modo === 'jerarquia' ? ALTA : (op => !ALTA(op));
      // Primero se agrupan los términos unidos por operaciones de prioridad alta.
      const terminos = [q[0]], unen = [];
      ops.forEach((op, i) => {
        if (alta(op)) terminos[terminos.length - 1] = OPS[op](terminos[terminos.length - 1], q[i + 1]);
        else { terminos.push(q[i + 1]); unen.push(op); }
      });
      return unen.reduce((acc, op, i) => OPS[op](acc, terminos[i + 1]), terminos[0]);
    },
    // Mayor valor de la expresión: entre todos los órdenes, con resultado entero (o cualquiera).
    expresion(nums, ops, modo = 'jerarquia', soloEnteros = true) {
      let mejor = null, arreglo = null;
      for (const p of permutaciones(nums)) {
        const [n, d] = calc.evaluar(p, ops, modo);
        if (soloEnteros && d !== 1) continue;
        if (!Number.isFinite(n / d)) continue;
        if (mejor === null || n / d > mejor) { mejor = n / d; arreglo = p; }
      }
      return { max: mejor, arreglo };
    },
  };

  // ------------------------------------------------------------------ armado
  const TIPOS = ['dos-articulos', 'dos-articulos', 'palitos', 'monedas', 'grupos', 'tres-precios', 'dardos', 'alcanza', 'reparto', 'borrar', 'expresion'];

  function generar(semilla) {
    const rng = Azar.crear('rm-diofanticas|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = CONSTRUIR[tipo](rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cerrar(rng, semilla, o) {
    const errores = o.errores.filter(e => (o.decimal ? corto(e.valor) : ent(e.valor)) && (!o.tope || e.valor <= o.tope));
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.texto });
    const pr = {
      id: `rm-diofanticas#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad || '' }, _datos: o.datos,
    };
    if (o.figura) pr.figura = o.figura;
    return pr;
  }
  const lista = sol => sol.map(s => `(${s.join(', ')})`).join(', ');

  // ---------------------------------------------------------------- dos artículos
  const CTX2 = [
    { A: 'cuadernos', a1: 'cuaderno', B: 'libros de cuentos', b1: 'libro de cuentos', lugar: 'la feria escolar' },
    { A: 'empanadas', a1: 'empanada', B: 'jugos', b1: 'jugo', lugar: 'la cafetería del colegio', fa: true },
    { A: 'lapiceros', a1: 'lapicero', B: 'cartucheras', b1: 'cartuchera', lugar: 'una librería de Juliaca', fb: true },
  ];
  function dosArticulos(rng, semilla) {
    const ci = rng.entero(0, CTX2.length - 1), cx = CTX2[ci];
    const a = rng.entero(2, 9), b = rng.entero(a + 1, 16), T = rng.entero(40, 220);
    const pide = rng.elegir(['cuantas', 'mas', 'menos']);
    const sol = calc.soluciones2(a, b, T, 1);
    if (sol.length < 2 || sol.length > 8) return null;
    const sol0 = calc.soluciones2(a, b, T, 0);
    const items = sol.map(([x, y]) => x + y);
    const enunciado = [`En ${cx.lugar}, ${cx.fa ? 'una' : 'un'} ${cx.a1} cuesta `, v('a', `S/ ${a}`), ` y ${cx.fb ? 'una' : 'un'} ${cx.b1}, `, v('b', `S/ ${b}`),
      '. Rosa gastó exactamente ', v('T', `S/ ${T}`), ` comprando de los dos (al menos un artículo de cada tipo).`];
    const variables = { a: { nombre: `precio de ${cx.a1}`, color: 'o' }, b: { nombre: `precio de ${cx.b1}`, color: 'i' }, T: { nombre: 'gasto', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const paso = [[`Si compra x ${cx.A} e y ${cx.B}: `, v('a', a), 'x + ', v('b', b), 'y = ', v('T', T), ', con x e y enteros desde 1.'],
      [`Se prueba x = 1, 2, 3, … y se mira si ${T} − ${a}x se divide entre ${b}. Soluciones (x, y): ${lista(sol)}.`]];
    let correcta, errores, pregunta, texto;
    if (pide === 'cuantas') {
      correcta = sol.length;
      texto = x => pl(x, 'manera', 'maneras');
      errores = [
        h('RMP51-con-cero', sol0.length, `Contaste también compras con 0 ${cx.A} o 0 ${cx.B}. El enunciado dice que compró de los dos.`),
        h('RMP51-con-un-cero', calc.soluciones2(a, b, T, 0).filter(([x, y]) => y > 0).length, `Aceptaste una compra con 0 ${cx.A}. Tiene que comprar al menos un artículo de cada tipo.`),
        h('AR18-olvida-una', sol.length - 1, `Se te pasó una solución. Si pruebas los valores en orden, verás que x avanza de ${b / gcd(a, b)} en ${b / gcd(a, b)}: así no se escapa ninguna.`, 'parcial', RM),
        h('RMP2-primera', 1, 'Encontraste una compra que cumple y te detuviste. Hay que buscarlas todas.'),
      ];
      pregunta = ['¿De cuántas maneras distintas pudo hacer su compra?'];
    } else if (pide === 'mas' || pide === 'menos') {
      const mas = pide === 'mas';
      correcta = mas ? Math.max(...items) : Math.min(...items);
      texto = x => pl(x, 'artículo', 'artículos');
      const conCero = items.concat(sol0.filter(([x, y]) => x === 0 || y === 0).map(([x, y]) => x + y));
      const opt = sol[items.indexOf(correcta)];
      const r1 = mas ? (T - b) % a : (T - a) % b;
      errores = [
        h('RMP2-primera', mas ? items[0] : items[items.length - 1], mas
          ? `Te quedaste con la primera compra que encontraste (empezando por ${cx.fa ? 'pocas' : 'pocos'} ${cx.A}). Hay que comparar todas: la de más artículos lleva más ${cx.A}, que son ${cx.fa ? 'más baratas' : 'más baratos'}.`
          : `Te quedaste con la primera compra que encontraste (empezando por ${cx.fb ? 'pocas' : 'pocos'} ${cx.B}). Hay que comparar todas: la de menos artículos lleva más ${cx.B}, que son ${cx.fb ? 'más caras' : 'más caros'}.`),
        h('RMP2-al-reves', mas ? Math.min(...items) : Math.max(...items), mas ? 'Esa es la compra con menos artículos. Se pide la que tiene más.' : 'Esa es la compra con más artículos. Se pide la que tiene menos.'),
        h('RMP51-con-cero', mas ? Math.max(...conCero) : Math.min(...conCero), `Aceptaste comprar de un solo tipo. El enunciado dice que compró de los dos.`),
        ...(r1 !== 0 ? [h('RMP51-sin-exacto', mas ? 1 + Math.floor((T - b) / a) : 1 + Math.floor((T - a) / b), mas
          ? `Pusiste ${cx.fb ? 'una' : 'un'} ${cx.b1} y con el resto el máximo de ${cx.A}, pero así no gastas exactamente S/ ${T}: sobran S/ ${r1}.`
          : `Pusiste ${cx.fa ? 'una' : 'un'} ${cx.a1} y con el resto el máximo de ${cx.B}, pero así no gastas exactamente S/ ${T}: sobran S/ ${r1}.`)] : []),
        h('AR5-un-solo-tipo', mas ? opt[0] : opt[1], mas ? `${cx.fa ? 'Esas son solo las' : 'Esos son solo los'} ${cx.A} de esa compra. Falta sumar ${cx.fb ? 'las' : 'los'} ${cx.B}.` : `${cx.fb ? 'Esas son solo las' : 'Esos son solo los'} ${cx.B} de esa compra. Falta sumar ${cx.fa ? 'las' : 'los'} ${cx.A}.`),
      ];
      pregunta = [mas ? '¿Cuál es la mayor cantidad de artículos que pudo comprar?' : '¿Cuál es la menor cantidad de artículos que pudo comprar?'];
    }
    const solucion = [...paso, ['Respuesta: ', v('x', texto(correcta)), pide === 'cuantas' ? ', una por cada pareja de la lista.' : ` (la compra ${pide === 'mas' ? 'con más' : 'con menos'} artículos, comparando x + y en todas).`]];
    return cerrar(rng, semilla, { correcta, errores, texto, variables, enunciado, pregunta, solucion, datos: { tipo: 'dos-articulos', ctx: ci, a, b, T, pide } });
  }

  // ---------------------------------------------------------------- palitos
  function palitos(rng, semilla) {
    const a = rng.entero(3, 11), b = rng.entero(a + 2, 19), L = rng.entero(50, 200);
    const pz = calc.palitos(a, b, L);
    if (pz.soluciones.length < 2) return null;
    const opt = pz.soluciones.find(([x, y]) => x + y === pz.min);
    if (opt[0] === 0 || L % b === 0) return null;
    const porY = pz.soluciones.slice().sort((p, q) => p[1] - q[1]);
    const errores = [
      h('RMP2-primera', porY[0][0] + porY[0][1], `Te quedaste con la primera combinación que encontraste (con pocos palitos de ${b} cm). Hay que comparar todas: con más palitos largos se usan menos piezas.`),
      h('RMP2-al-reves', pz.max, 'Esa es la combinación con más palitos. Se pide la que usa menos.'),
      h('RMP51-sin-exacto', Math.ceil(L / b), `Usaste solo palitos de ${b} cm y redondeaste: con ${Math.ceil(L / b)} te pasas de ${L} cm. La varilla tiene que medir exactamente ${L} cm.`),
      h('RMP51-sin-exacto-abajo', Math.floor(L / b), `Con ${Math.floor(L / b)} palitos de ${b} cm no llegas: faltan ${L - b * Math.floor(L / b)} cm, y no hay palito de esa medida.`),
      h('AR5-solo-largos', opt[1], `Esos son solo los palitos de ${b} cm de la mejor combinación. Falta sumar los de ${a} cm.`),
    ];
    const enunciado = ['Se quiere armar una varilla de exactamente ', v('L', `${L} cm`), ' uniendo, uno tras otro, palitos de ', v('a', `${a} cm`), ' y de ', v('b', `${b} cm`),
      '. Hay muchos palitos de cada medida y no se pueden cortar.'];
    const solucion = [
      ['Con x palitos de ', v('a', a), ' cm e y de ', v('b', b), ' cm: ', `${a}x + ${b}y = `, v('L', L), ', con x, y ≥ 0.'],
      [`Soluciones (x, y): ${lista(pz.soluciones)}. Piezas en cada una: ${pz.soluciones.map(([x, y]) => x + y).join(', ')}.`],
      ['La menor es ', v('n', pl(pz.min, 'palito', 'palitos')), ` (${opt[0]} de ${a} cm y ${opt[1]} de ${b} cm).`],
    ];
    return cerrar(rng, semilla, { correcta: pz.min, errores, texto: x => pl(x, 'palito', 'palitos'), enunciado, solucion,
      variables: { L: { nombre: 'largo pedido', color: 'h' }, a: { nombre: 'palito corto', color: 'o' }, b: { nombre: 'palito largo', color: 'i' }, n: { nombre: 'palitos', color: 'd' } },
      pregunta: ['¿Cuál es el menor número de palitos que se necesitan?'], datos: { tipo: 'palitos', a, b, L } });
  }

  // ---------------------------------------------------------------- monedas
  const DEN = [[20, 50, 100], [20, 50, 200], [20, 50, 100, 200], [20, 50, 500], [10, 20, 50]];
  function monedas(rng, semilla) {
    const den = rng.elegir(DEN), k = rng.elegir([1, 1, 2]);
    const S = 10 * rng.entero(60, 220);
    const r = calc.monedas(den, S, k);
    if (!r) return null;
    const sinMin = calc.monedas(den, S, 0);
    const k1 = k === 2 ? calc.monedas(den, S, 1) : null;
    const base = k * den.reduce((s, d) => s + d, 0);
    const resto = S - base;
    const errores = [
      h('RMP51-sin-minimo', sinMin.max, `Olvidaste que debe haber al menos ${k === 1 ? 'una' : 'dos'} de cada tipo.`),
      h('RMP2-al-reves', r.min, 'Esa es la menor cantidad de monedas posible, con muchas monedas grandes. Se pide la mayor.'),
      ...(resto % den[0] !== 0 ? [h('RMP51-sin-exacto', k * den.length + Math.floor(resto / den[0]), `Pusiste ${k === 1 ? 'una' : 'dos'} de cada tipo y el resto en monedas de ${soles(den[0])}, pero así no llegas exacto a ${soles(S)}: faltan ${soles(resto % den[0])}.`)] : []),
      h('AR5-de-la-menor', r.mejor[0], `Esas son solo las monedas de ${soles(den[0])}. Falta sumar las de los otros tipos.`),
      ...(k1 ? [h('RMP51-un-solo-minimo', k1.max, 'Pusiste al menos una de cada tipo, pero el enunciado pide al menos dos.')] : []),
    ];
    const enunciado = ['Una alcancía tiene ', v('S', soles(S)), ` en monedas de ${den.map(soles).slice(0, -1).join(', ')} y ${soles(den[den.length - 1])}. Hay `, v('k', k === 1 ? 'al menos una' : 'al menos dos'), ' de cada tipo.'];
    const solucion = [
      ['Para tener muchas monedas conviene usar muchas de las más chicas, pero la suma debe dar exactamente ', v('S', soles(S)), ' y hay que respetar ', v('k', k === 1 ? 'al menos una' : 'al menos dos'), ' de cada tipo.'],
      [`Primero se ponen ${k === 1 ? 'una' : 'dos'} de cada tipo: ${soles(base)}. Quedan ${soles(resto)} por repartir.`],
      [`Revisando todas las combinaciones, la de más monedas es: ${r.mejor.map((x, i) => `${x} de ${soles(den[i])}`).join(', ')}.`],
      ['En total, ', v('n', pl(r.max, 'moneda', 'monedas')), '.'],
    ];
    return cerrar(rng, semilla, { correcta: r.max, errores, texto: x => pl(x, 'moneda', 'monedas'), enunciado, solucion,
      variables: { S: { nombre: 'dinero', color: 'h' }, k: { nombre: 'mínimo por tipo', color: 'o' }, n: { nombre: 'monedas', color: 'd' } },
      pregunta: ['¿Cuántas monedas puede haber, como máximo, en la alcancía?'], datos: { tipo: 'monedas', den, S, k } });
  }

  // ---------------------------------------------------------------- grupos
  function grupos(rng, semilla) {
    const den = [1, 2, 5], cant = [rng.entero(2, 10), rng.entero(2, 10), rng.entero(2, 7)], G = rng.entero(6, 13);
    const { max, patrones, reparto } = calc.grupos(den, cant, G);
    if (max < 2) return null;
    const total = cant.reduce((s, c, i) => s + c * den[i], 0);
    // Voraz: cada grupo con todas las monedas grandes que se pueda.
    let c = cant.slice(), voraz = 0;
    const orden = patrones.slice().sort((p, q) => q[2] - p[2] || q[1] - p[1]);
    for (;;) { const p = orden.find(p => p.every((x, i) => x <= c[i])); if (!p) break; voraz++; c = c.map((x, i) => x - p[i]); }
    const unPatron = Math.max(...patrones.map(p => Math.min(...p.map((x, i) => (x === 0 ? Infinity : Math.floor(cant[i] / x))))));
    const errores = [
      h('RMP51-sin-existencias', Math.floor(total / G), `Dividiste todo el dinero (S/ ${total}) entre S/ ${G}. No basta con que alcance el dinero: cada grupo tiene que sumar exacto con las monedas que hay.`),
      h('RMP2-voraz', voraz, 'Armaste cada grupo con todas las monedas grandes que pudiste. Así se gastan pronto las de S/ 5 o las de S/ 1 que hacen falta para cerrar otros grupos: hay que comparar repartos.'),
      h('RMP2-un-patron', unPatron, 'Armaste todos los grupos iguales. Combinando grupos de formas distintas se aprovechan mejor las monedas.'),
      h('RMP80-moneda-repetida', max + 1, `Armando los grupos al tanteo, usaste alguna moneda en dos grupos. Cuenta las monedas de cada tipo que gasta tu reparto: con las que hay no se llega a ${max + 1} grupos.`),
    ].filter(e => !(e.id === 'RMP2-voraz' && e.valor > max) && !(e.id === 'RMP2-un-patron' && e.valor > max));
    const enunciado = ['Juan tiene ', v('c1', `${cant[0]} monedas de S/ 1`), ', ', v('c2', `${cant[1]} de S/ 2`), ' y ', v('c5', `${cant[2]} de S/ 5`),
      '. Quiere formar grupos de monedas que sumen exactamente ', v('G', `S/ ${G}`), ' cada uno, sin que una moneda esté en dos grupos.'];
    const pats = patrones.filter(p => p.every((x, i) => x <= cant[i])).map(p => `${p[2]}×5 + ${p[1]}×2 + ${p[0]}×1`).join('; ');
    const solucion = [
      [`Formas de juntar S/ ${G}: ${pats}.`],
      [`Total de dinero: S/ ${total}, así que no puede haber más de ${Math.floor(total / G)} grupos; pero también deben alcanzar las monedas de cada tipo.`],
      [`Un reparto que lo logra: ${reparto.map(p => '(' + [p[2] ? `${p[2]}×5` : '', p[1] ? `${p[1]}×2` : '', p[0] ? `${p[0]}×1` : ''].filter(Boolean).join(' + ') + ')').join(', ')}. Revisando todos los repartos posibles, no se puede formar uno más: lo máximo es ${pl(max, 'grupo', 'grupos')}.`],
    ];
    return cerrar(rng, semilla, { correcta: max, errores, texto: x => pl(x, 'grupo', 'grupos'), enunciado, solucion,
      variables: { c1: { nombre: 'monedas de S/ 1', color: 'o' }, c2: { nombre: 'monedas de S/ 2', color: 'i' }, c5: { nombre: 'monedas de S/ 5', color: 'h' }, G: { nombre: 'valor del grupo', color: 'd' } },
      pregunta: ['¿Cuántos grupos puede formar, como máximo?'], datos: { tipo: 'grupos', den, cant, G } });
  }

  // ---------------------------------------------------------------- tres precios
  function tresPrecios(rng, semilla) {
    const p = rng.barajar([3, 4, 5, 6, 7, 8, 9, 10, 12, 15]).slice(0, 3).sort((x, y) => x - y);
    const g = [rng.entero(1, 3), rng.entero(1, 4), rng.entero(2, 6)];
    const m = rng.entero(1, 3), T = rng.entero(60, 180);
    const r = calc.tresPrecios(p, g, T, m);
    if (!r || r.soluciones.length < 3 || r.soluciones.length > 25) return null;
    const sin = calc.tresPrecios(p, g, T, 0);
    const cajas = s => s[0] + s[1] + s[2];
    const masArt = r.soluciones.reduce((b, s) => (cajas(s) > cajas(b) ? s : b));
    const empateCajas = r.soluciones.filter(s => cajas(s) === cajas(masArt)).length > 1;
    const errores = [
      h('RMP51-sin-minimos', sin.ganancia, `Olvidaste que debe comprar al menos ${m} de cada tipo.`),
      // Si dos compras empatan en el máximo de cajas, «la de más cajas» no es una sola: no se ofrece.
      ...(empateCajas ? [] : [h('RMP2-mas-articulos', r.gan(masArt), 'Elegiste la compra con más cajas. Más cajas no es más ganancia: hay que calcular la ganancia de cada compra posible.')]),
      h('RMP2-primera', r.gan(r.soluciones[0]), 'Te quedaste con la primera compra que cumple. Hay que comparar la ganancia de todas.'),
      h('AR5-cajas', r.mejor[0] + r.mejor[1] + r.mejor[2], 'Ese es el número de cajas de la mejor compra. La pregunta pide la ganancia.'),
    ];
    const enunciado = ['Una bodeguera va a gastar exactamente ', v('T', `S/ ${T}`), ' en cajas para revender: de galletas a ', v('p', `S/ ${p[0]}`), ', de caramelos a ', v('p', `S/ ${p[1]}`),
      ' y de chocolates a ', v('p', `S/ ${p[2]}`), ' cada una. Gana ', v('g', `S/ ${g[0]}`), ', ', v('g', `S/ ${g[1]}`), ' y ', v('g', `S/ ${g[2]}`),
      ', respectivamente, por cada caja que revende. Compra ', v('m', `al menos ${m}`), ' de cada tipo y revende todo.'];
    const solucion = [
      [`Con x, y, z cajas: ${p[0]}x + ${p[1]}y + ${p[2]}z = `, v('T', T), ', con x, y, z ≥ ', v('m', m), '.'],
      [`Hay ${r.soluciones.length} compras posibles. Ganancia = ${g[0]}x + ${g[1]}y + ${g[2]}z en cada una; por ejemplo, ${r.soluciones.slice(0, 3).map(s => `(${s.join(', ')}) da S/ ${r.gan(s)}`).join('; ')}.`],
      [`La mayor ganancia es con (${r.mejor.join(', ')}): ${g[0]}·${r.mejor[0]} + ${g[1]}·${r.mejor[1]} + ${g[2]}·${r.mejor[2]} = S/ ${r.ganancia}.`],
    ];
    return cerrar(rng, semilla, { correcta: r.ganancia, errores, texto: x => `S/ ${f(x)}`, enunciado, solucion,
      variables: { T: { nombre: 'gasto', color: 'h' }, p: { nombre: 'precios', color: 'o' }, g: { nombre: 'ganancias', color: 'i' }, m: { nombre: 'mínimo por tipo', color: 'd' } },
      pregunta: ['¿Cuál es la mayor ganancia que puede obtener?'], datos: { tipo: 'tres-precios', p, g, T, m } });
  }

  // ---------------------------------------------------------------- dardos
  function figuraDardos(sect) {
    const rad = [88, 66, 44, 22].slice(0, sect.length), cy = 98;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" font-size="14" fill="currentColor">`;
    const cols = ['var(--card)', 'var(--line)', 'var(--card)', 'var(--line)'];
    rad.forEach((r, i) => { s += `<circle cx="160" cy="${cy}" r="${r}" style="fill:${cols[i]}" stroke="currentColor" stroke-width="2"/>`; });
    sect.forEach((x, i) => {
      // Al centro de cada banda (el último, en el centro del círculo); +5 baja la línea base al medio del texto.
      const y = (i === sect.length - 1 ? cy : cy - (rad[i] + rad[i + 1]) / 2) + 5;
      s += `<text x="160" y="${y}" text-anchor="middle" font-weight="bold">${P.xml(x)}</text>`;
    });
    return s + '</svg>';
  }
  function dardos(rng, semilla) {
    const sect = rng.barajar([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 19, 20, 23, 25]).slice(0, 4).sort((x, y) => x - y);
    if (sect.reduce(gcd) !== 1) return null;
    const S = rng.entero(30, 110);
    const best = calc.dardos(sect, S);
    if (best === null || best < 3) return null;
    // Voraz con vuelta atrás: tantos del mayor como se pueda, luego el siguiente…; la primera combinación exacta.
    const voraz = (i, resto) => {
      if (resto === 0) return 0;
      if (i < 0) return null;
      for (let c = Math.floor(resto / sect[i]); c >= 0; c--) { const r = voraz(i - 1, resto - c * sect[i]); if (r !== null) return c + r; }
      return null;
    };
    const vz = voraz(sect.length - 1, S);
    const pide = rng.elegir(['tiros', 'tiros', 'costo']);
    const costo = pide === 'costo' ? rng.elegir([2, 3, 5]) : 1;
    const maxT = S % sect[0] === 0 ? S / sect[0] : null;
    const errores = [
      h('RMP2-voraz', vz * costo, `Tiraste primero todo lo que pudiste al ${sect[3]} y completaste con los demás: esa es la primera combinación que encuentras, no necesariamente la más corta. Hay que comparar.`),
      h('RMP51-sin-exacto', Math.ceil(S / sect[3]) * costo, `Dividiste ${S} entre ${sect[3]} y redondeaste, pero con esos dardos no se logra exactamente ${S}.`),
      ...(maxT ? [h('RMP2-al-reves', maxT * costo, `Esa es la combinación con más dardos (todos al ${sect[0]}). Se pide la que usa menos.`)] : []),
      h('RMP80-uno-menos', (best - 1) * costo, `Con ${best - 1} ${best - 1 === 1 ? 'dardo' : 'dardos'} no hay ninguna combinación que sume ${S}: revísalo probando con sistema.`),
      ...(pide === 'costo' ? [h('AR5-tiros', best, 'Ese es el número de dardos. La pregunta pide cuánto se paga.')] : []),
    ];
    const enunciado = ['En la feria, una diana tiene anillos que valen ', ...sect.flatMap((x, i) => [v('s', x), i < sect.length - 2 ? ', ' : i === sect.length - 2 ? ' y ' : '']), ' puntos (ver la figura). Cada dardo cae en un anillo, y se puede repetir anillo. Para ganar el premio hay que sumar exactamente ',
      v('S', `${S} puntos`), pide === 'costo' ? ['. Cada dardo cuesta ', v('c', `S/ ${costo}`), '.'] : '.'].flat();
    const ejemplo = (() => {
      const dp = new Array(S + 1).fill(Infinity), de = new Array(S + 1).fill(0); dp[0] = 0;
      for (let s = 1; s <= S; s++) for (const x of sect) if (x <= s && dp[s - x] + 1 < dp[s]) { dp[s] = dp[s - x] + 1; de[s] = x; }
      const r = []; let s = S; while (s > 0) { r.push(de[s]); s -= de[s]; } return r.sort((a, b) => b - a);
    })();
    const solucion = [
      [`Con ${best - 1} dardos no se llega: probando todas las combinaciones de ${best - 1} anillos, ninguna suma `, v('S', S), '.'],
      [`Con ${best} sí: ${ejemplo.join(' + ')} = ${S}. Es el menor número de dardos.`],
      ...(pide === 'costo' ? [[`Costo: ${best} × `, v('c', `S/ ${costo}`), ` = S/ ${best * costo}.`]] : []),
    ];
    return cerrar(rng, semilla, { correcta: best * costo, errores, texto: pide === 'costo' ? (x => `S/ ${f(x)}`) : (x => pl(x, 'dardo', 'dardos')), enunciado, solucion,
      tope: pide === 'costo' ? 60 * costo : 40, figura: { svg: figuraDardos(sect), alt: `Diana de ${sect.length} anillos. Del borde hacia el centro valen ${sect.join(', ')} puntos.` },
      variables: { s: { nombre: 'valores de los anillos', color: 'i' }, S: { nombre: 'puntaje pedido', color: 'h' }, ...(pide === 'costo' ? { c: { nombre: 'precio por dardo', color: 'd' } } : {}) },
      pregunta: [pide === 'costo' ? '¿Cuánto se paga, como mínimo, para lograrlo?' : '¿Cuántos dardos se necesitan, como mínimo?'], datos: { tipo: 'dardos', sectores: sect, S, pide, costo } });
  }

  // ---------------------------------------------------------------- alcanza / no alcanza
  function alcanza(rng, semilla) {
    const l = rng.entero(2, 8), d = rng.entero(1, 6), k = rng.entero(1, 4);
    const c = l + d;
    const a1 = rng.entero(1, 4), b1 = rng.entero(1, 5);
    const A = a1 * c + b1 * l;
    const a2 = Math.ceil((A + 2) / c) + rng.entero(0, 2), b3 = Math.ceil((A + 2) / l) + rng.entero(0, 3);
    const al = calc.alcanza({ l, d, k, a1, b1, a2, b3 });
    const B = a2 * c, Cc = b3 * l;
    if (B === Cc || al.hasta < A + 1) return null;
    const lMal = al.Q / (k + 1);
    const sinDif = Number.isInteger(lMal) ? Math.min(a2 * lMal, b3 * lMal) - 1 : NaN;
    const errores = [
      h('RMP53-borde', Math.min(B, Cc), `Tomaste «no me alcanza» como si alcanzara justo. Si no alcanza para S/ ${Math.min(B, Cc)}, tengo como máximo S/ ${Math.min(B, Cc) - 1}.`),
      h('RMP51-una-condicion', Math.max(B, Cc) - 1, `Usaste solo una de las dos condiciones de «no me alcanza». Las dos deben cumplirse: manda la más exigente.`),
      h('RMP2-al-reves', A, 'Esa es la menor cantidad que cumple las condiciones. Se pide la mayor.'),
      h('RMP51-sin-diferencia', sinDif, `Repartiste los S/ ${al.Q} como si el cuaderno costara lo mismo que el lapicero. El cuaderno cuesta S/ ${d} más.`),
    ];
    const enunciado = ['Un cuaderno cuesta ', v('d', `S/ ${d}`), ' más que un lapicero, y ', String(k), ` ${k === 1 ? 'lapicero' : 'lapiceros'} con un cuaderno cuestan `, v('Q', `S/ ${al.Q}`),
      '. Tengo una cantidad entera de soles. Me alcanza para comprar ', v('A', `${a1} ${a1 === 1 ? 'cuaderno' : 'cuadernos'} y ${b1} ${b1 === 1 ? 'lapicero' : 'lapiceros'}`),
      ', pero no me alcanza para ', v('B', `${a2} cuadernos`), ' ni para ', v('B', `${b3} lapiceros`), '.'];
    const solucion = [
      ['Si el lapicero cuesta l, el cuaderno cuesta l + ', v('d', d), `: ${k}l + l + ${d} = `, v('Q', al.Q), `, ${k + 1}l = ${al.Q - d}, l = S/ ${l} y el cuaderno, S/ ${c}.`],
      ['Alcanza: D ≥ ', v('A', `${a1}·${c} + ${b1}·${l} = ${A}`), '. No alcanza: D < ', v('B', `${a2}·${c} = ${B}`), ' y D < ', v('B', `${b3}·${l} = ${Cc}`), '.'],
      [`Entonces ${A} ≤ D < ${Math.min(B, Cc)}: lo más que puedo tener es S/ ${al.hasta}.`],
    ];
    return cerrar(rng, semilla, { correcta: al.hasta, errores, texto: x => `S/ ${f(x)}`, enunciado, solucion,
      variables: { d: { nombre: 'diferencia de precios', color: 'd' }, Q: { nombre: 'precio de la compra', color: 'h' }, A: { nombre: 'lo que alcanza', color: 'o' }, B: { nombre: 'lo que no alcanza', color: 'i' } },
      pregunta: ['¿Cuánto dinero tengo, como máximo?'], datos: { tipo: 'alcanza', l, d, k, a1, b1, a2, b3 } });
  }

  // ---------------------------------------------------------------- reparto exacto
  const divisores = N => { const r = []; for (let i = 1; i <= N; i++) if (N % i === 0) r.push(i); return r; };
  const factorizar = N => { const r = []; let n = N; for (let p = 2; p * p <= n; p++) while (n % p === 0) { r.push(p); n /= p; } if (n > 1) r.push(n); return r; };
  function reparto(rng, semilla) {
    const n = rng.entero(12, 45), q = rng.entero(3, 30), falta = rng.entero(1, Math.min(n - 1, 15));
    const C = n * q - falta, N = C + falta;
    const ancho = rng.entero(6, 14), lo = rng.entero(n - ancho + 1, n - 1), hi = lo + ancho;
    const cand = calc.reparto({ C, f: falta, lo, hi });
    if (cand.length !== 1 || cand[0] !== n) return null;
    // Solo un divisor de C + f en el rango, aunque no se mire que f < n: así no hay dos respuestas defendibles.
    if (divisores(N).filter(x => x > lo && x < hi).length !== 1) return null;
    const enRango = M => divisores(M).filter(x => x > lo && x < hi);
    const dC = enRango(C), dR = C - falta > 0 ? enRango(C - falta) : [];
    const fuera = divisores(N).filter(x => x > 1 && x < N && (x <= lo || x >= hi)).sort((a, b) => Math.min(Math.abs(a - lo), Math.abs(a - hi)) - Math.min(Math.abs(b - lo), Math.abs(b - hi)));
    const errores = [
      ...(dC.length === 1 ? [h('RMP51-sin-faltan', dC[0], `Buscaste un divisor de ${C}, pero con ${C} caramelos el reparto no es exacto: faltan ${falta}. Hay que trabajar con ${C} + ${falta} = ${N}.`)] : []),
      ...(dR.length === 1 ? [h('RM1-sobran', dR[0], `Restaste los ${falta} caramelos, como si sobraran. Faltan: hay que sumarlos, ${C} + ${falta} = ${N}.`)] : []),
      h('AR5-cada-uno', q, `Eso es lo que recibe cada alumno (${N} ÷ ${n}). La pregunta pide cuántos alumnos hay.`),
      ...(fuera.length ? [h('RMP51-fuera-de-rango', fuera[0], `${fuera[0]} divide a ${N}, pero el aula tiene más de ${lo} y menos de ${hi} alumnos.`)] : []),
      ...(fuera.length > 1 ? [h('RMP51-fuera-de-rango-2', fuera[1], `${fuera[1]} divide a ${N}, pero el aula tiene más de ${lo} y menos de ${hi} alumnos.`)] : []),
    ];
    const enunciado = ['Se quieren repartir ', v('C', `${C} caramelos`), ' en partes iguales entre los alumnos de un aula, sin que sobre ninguno. Para lograrlo faltan ', v('f', `${falta} ${falta === 1 ? 'caramelo' : 'caramelos'}`),
      ` (con ${falta === 1 ? 'uno' : falta} más el reparto sería exacto). En el aula hay `, v('r', `más de ${lo} y menos de ${hi} alumnos`), '.'];
    const fs = factorizar(N);
    const solucion = [
      ['Con lo que falta, el reparto es exacto: el número de alumnos divide a ', v('C', C), ' + ', v('f', falta), ` = ${N}.`],
      [`${N} = ${fs.join(' × ')}. Sus divisores son ${divisores(N).join(', ')}.`],
      ['El único entre ', v('r', `${lo} y ${hi}`), ' es ', v('n', `${n}`), `. Además ${falta} < ${n}, así que de verdad faltan ${falta} (no se podía con menos).`],
    ];
    return cerrar(rng, semilla, { correcta: n, errores, texto: x => pl(x, 'alumno', 'alumnos'), enunciado, solucion,
      variables: { C: { nombre: 'caramelos', color: 'o' }, f: { nombre: 'lo que falta', color: 'i' }, r: { nombre: 'rango de alumnos', color: 'h' }, n: { nombre: 'alumnos', color: 'd' } },
      pregunta: ['¿Cuántos alumnos hay en el aula?'], datos: { tipo: 'reparto', C, f: falta, lo, hi } });
  }

  // ---------------------------------------------------------------- borrar cifras
  function borrar(rng, semilla) {
    const largo = rng.entero(3, 5);
    let cifras = [0, ...Array.from({ length: largo - 1 }, () => rng.entero(1, 9))];
    cifras = rng.barajar(cifras);
    if (cifras[0] === 0) cifras.push(cifras.shift());
    const bloque = cifras.join('');
    const r = rng.entero(4, 8);
    const sumaTotal = cifras.reduce((s, x) => s + x, 0) * r;
    const S = rng.entero(12, Math.floor(sumaTotal * 0.6));
    const b = calc.borrar({ bloque, r, S });
    if (!b) return null;
    const errores = [
      h('RMP51-sin-ceros', b.borrar - b.ceros, `No borraste los ceros. Los ceros no suman nada: se pueden borrar todos y la suma no cambia.`),
      h('AR5-quedan', b.quedanMin, 'Esas son las cifras que quedan. La pregunta pide cuántas se borran.'),
      h('RMP2-al-reves', b.total - b.quedanMax, 'Dejaste las cifras más chicas. Para borrar muchas hay que dejar pocas, y por eso conviene quedarse con las más grandes.'),
    ];
    const enunciado = ['Se escribe ', v('r', `${r} veces`), ' seguidas el bloque ', v('B', bloque), ` y se forma un número de ${b.total} cifras: `, v('B', bloque.repeat(r)),
      '. Se borran algunas cifras, sin mover las demás, y las cifras que quedan suman ', v('S', S), '.'];
    const cuenta = [...new Set(cifras)].filter(x => x > 0).sort((a, b) => b - a).map(x => `${cifras.filter(y => y === x).length * r} cifras ${x}`).join(', ');
    const solucion = [
      [`Borrar muchas es dejar pocas. Los ceros se borran todos (${b.ceros}), porque no suman.`],
      [`Cifras distintas de cero: ${cuenta}. Para llegar a `, v('S', S), ` con pocas cifras se usan las más grandes; probando, lo mínimo es dejar ${b.quedanMin}.`],
      [`Se borran ${b.total} − ${b.quedanMin} = `, v('n', b.borrar), ' cifras.'],
    ];
    return cerrar(rng, semilla, { correcta: b.borrar, errores, texto: x => pl(x, 'cifra', 'cifras'), enunciado, solucion,
      variables: { r: { nombre: 'repeticiones', color: 'o' }, B: { nombre: 'bloque', color: 'i' }, S: { nombre: 'suma pedida', color: 'h' }, n: { nombre: 'cifras borradas', color: 'd' } },
      pregunta: ['¿Cuántas cifras se pueden borrar, como máximo?'], datos: { tipo: 'borrar', bloque, r, S } });
  }

  // ---------------------------------------------------------------- expresión
  const PATRONES = [['+', '×', '−', '÷'], ['×', '−', '÷', '+'], ['÷', '+', '×', '−'], ['−', '×', '+', '÷'], ['×', '+', '÷', '−'], ['+', '÷', '×', '−']];
  const CONJUNTOS = [[2, 3, 5, 7, 11], [3, 5, 7, 11, 13], [2, 3, 5, 7, 13]];
  function expresion(rng, semilla) {
    const ops = rng.elegir(PATRONES);
    const primos = rng.moneda();
    const nums = primos ? rng.elegir(CONJUNTOS) : rng.barajar([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5).sort((a, b) => a - b);
    const e = calc.expresion(nums, ops);
    if (e.max === null || e.max <= 0) return null;
    const izq = calc.expresion(nums, ops, 'izquierda');
    const suma = calc.expresion(nums, ops, 'suma-primero');
    const real = calc.expresion(nums, ops, 'jerarquia', false);
    const errores = [
      h('RMP58-izquierda', izq.max, 'Hiciste las operaciones de izquierda a derecha. Primero van × y ÷; después, + y −.'),
      h('RMP58-suma-primero', suma.max, 'Hiciste primero las sumas y restas. La jerarquía es al revés: primero × y ÷.'),
      h('RMP51-no-entero', real.max, 'Ese valor no es entero. La pregunta pide el mayor resultado entero.'),
    ];
    const expr = ops.map(op => `□ ${op} `).join('') + '□';
    const conArreglo = ops.map((op, i) => `${e.arreglo[i]} ${op} `).join('') + e.arreglo[4];
    const enunciado = [primos ? 'Se tienen los números primos ' : 'Se tienen los números ', ...nums.flatMap((x, i) => [v('n', x), i < 3 ? ', ' : i === 3 ? ' y ' : '']),
      '. Hay que ubicarlos en las casillas de la expresión ', v('e', expr), ', uno en cada casilla y sin repetir, respetando la jerarquía de operaciones (primero × y ÷, de izquierda a derecha; después + y −).'];
    const solucion = [
      ['Se prueban los órdenes con sentido (los números grandes donde se multiplica o se suma, los chicos donde se resta o se divide) y se calcula cada uno con la jerarquía.'],
      [`El mejor orden entero es `, v('e', conArreglo), ` = ${f(e.max)}.`],
      ['Revisando los 120 órdenes posibles, ninguno da un entero mayor.'],
    ];
    return cerrar(rng, semilla, { correcta: e.max, errores, decimal: true, texto: x => f(x), enunciado, solucion,
      variables: { n: { nombre: 'números', color: 'o' }, e: { nombre: 'expresión', color: 'i' } },
      pregunta: ['¿Cuál es el mayor resultado entero que se puede obtener?'], datos: { tipo: 'expresion', nums, ops } });
  }

  const CONSTRUIR = { 'dos-articulos': dosArticulos, palitos, monedas, grupos, 'tres-precios': tresPrecios, dardos, alcanza, reparto, borrar, expresion };

  return { id: 'rm-diofanticas', titulo: 'Enteros que cumplen la cuenta: compras, monedas y cifras', generar, calc };
});
