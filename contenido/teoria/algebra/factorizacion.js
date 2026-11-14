/*
 * Teoría de «Factorización» (algebra.factorizacion). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 9), expediente teoria-152-unidades (Álgebra; precisión:
 * factorizar es reescribir como producto, y los lados de la figura ilustran casos con interpretación geométrica válida)
 * e historia-ecuaciones (pp. 57–68). Errores: AL8 de docs/investigacion/algebra-funciones-ideas-erroneas.md; los
 * TAL-* son hipótesis de diseño (rutinas/teoria-algebra.md).
 * Colores (regla 4): x y el primer factor naranja (c-o), el número que acompaña y el segundo factor turquesa (c-i),
 * lo que se comprueba o el término central verde (c-d), lo que falta o no cumple rojo (c-h).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · reescribir un polinomio como producto sin cambiarlo, y comprobarlo multiplicando.
 * Persona y condiciones · 3.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · saca factor común, arma un aspa que reconstruye el término central, usa P(a) = 0 y halla MCD y MCM.
 * Orden de atención · 1.º la figura (rectángulo de piezas, aspa, gráfica) · 2.º el término que se reconstruye · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · cuándo una factorización está completa y cómo saber que no cambió el polinomio.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const X = { v: 'c-o', t: 'x' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r.mezclar = l => { const x = l.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
    return r;
  }
  function distintas(ops, max = 4) {
    const vistos = new Set(), out = [];
    for (const o of ops) { if (!o) continue; const t = JSON.stringify(o.texto); if (vistos.has(t) || /NaN|undefined/.test(t)) continue; vistos.add(t); out.push(o); }
    return out.slice(0, max);
  }
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const sup = e => String(e).split('').map(c => SUP[c] || c).join('');
  const mcd = (x, y) => { x = Math.abs(x); y = Math.abs(y); while (y) [x, y] = [y, x % y]; return x; };
  // Polinomio por coeficientes (de mayor a menor grado) como texto: [2, 0, −18, 0] → «2x³ − 18x».
  function poli(cs, v = 'x') {
    const g = cs.length - 1;
    let s = '';
    cs.forEach((c, k) => {
      if (!c) return;
      const e = g - k, ab = Math.abs(c);
      const coef = e > 0 && ab === 1 ? '' : f(ab, 0), lit = e === 0 ? '' : e === 1 ? v : `${v}${sup(e)}`;
      s += s ? ` ${c < 0 ? '−' : '+'} ${coef}${lit}` : `${c < 0 ? '−' : ''}${coef}${lit}`;
    });
    return s || '0';
  }
  // Producto de polinomios por coeficientes.
  const mult = (p, q) => { const r = Array(p.length + q.length - 1).fill(0); p.forEach((a, i) => q.forEach((b, j) => { r[i + j] += a * b; })); return r; };
  const evaluar = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
  // Factor lineal x − r como texto: r = 3 → «x − 3», r = −2 → «x + 2».
  const fx = r => (r === 0 ? 'x' : r > 0 ? `x − ${r}` : `x + ${-r}`);
  const lin = (m, p) => `${m === 1 ? '' : m}x ${p < 0 ? '−' : '+'} ${Math.abs(p)}`;     // mx + p
  const conPot = (t, e) => (e === 0 ? '' : e === 1 ? `(${t})` : `(${t})${sup(e)}`);

  // ---------- Idea 1: factor común, después identidades ----------
  // Cambia: el número k y el factor común m · Permanece: el rectángulo de alto mx · Progresa: el ancho x + k
  // · Se reserva: la diferencia de cuadrados que todavía se factoriza · Debe verse: la suma es un solo rectángulo.
  const rectangulo = (m, k) => ({
    anchos: [{ t: 'x', v: 3, color: 'o' }, { t: String(k), v: k, color: 'i' }],
    altos: [{ t: m === 1 ? 'x' : `${m}x`, v: 3 * m, color: 'o' }],
    celdas: [[{ t: poli([m, 0, 0]), color: 'o' }, { t: poli([m * k, 0]), color: 'i' }]],
    total: { t: `${poli([m, m * k, 0])} = ${m === 1 ? '' : m}x(x + ${k})` },
    alt: `Rectángulo de alto ${m === 1 ? '' : m}x y ancho x + ${k}: sus dos piezas suman ${poli([m, m * k, 0])}`,
  });
  const comun = {
    id: 'factor-comun',
    titulo: 'Primero el factor común',
    temas: ['Factor común e identidades'],
    pieza: 'alg-baldosas',
    juega: {
      consigna: 'Elige el número k y el factor m. Las dos piezas comparten el mismo alto: juntas forman un solo rectángulo.',
      voz: 'Lo que comparten las dos piezas es el factor común.',
      controles: [
        { id: 'k', etiqueta: 'k', min: 1, max: 5, paso: 1, inicio: 3, decimales: 0, color: 'c-i' },
        { id: 'm', etiqueta: 'm', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: rectangulo(v.m, v.k), estado: {} }),
      lectura: v => [`${poli([v.m, v.m * v.k, 0])} = ${v.m === 1 ? '' : v.m}x(x + ${v.k})`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuál es la factorización completa de 2x³ − 18x?',
      opciones: [
        { id: 'c', texto: '2x(x + 3)(x − 3)', correcta: true },
        { id: 'incompleta', texto: '2x(x² − 9)', error: 'TAL-INCOMPLETA', siFuera: 'Es correcta, pero no completa: x² − 9 todavía es (x + 3)(x − 3).' },
        { id: 'cuadrado', texto: '2x(x − 3)²', error: 'AL8', siFuera: 'Al multiplicarla da 2x³ − 12x² + 18x: aparece un término en x².' },
        { id: 'sin-2', texto: 'x(2x² − 18)', error: 'TAL-INCOMPLETA', siFuera: 'El 2 también es común, y lo de adentro se sigue factorizando.' },
      ],
      dibujo: { datos: { columnas: ['paso', 'expresión'], filas: [['original', '2x³ − 18x'], ['factor común', '?'], ['identidad', '?']], alt: 'Dos x al cubo menos 18 x, y dos pasos por completar' }, estado: {} },
      revelar: { datos: { columnas: ['paso', 'expresión'], filas: [['original', '2x³ − 18x'], ['factor común', '2x(x² − 9)'], ['identidad', { t: '2x(x + 3)(x − 3)', color: 'd', fuerte: true }]], alt: 'Factor común 2x y luego diferencia de cuadrados' }, estado: {} },
      coincide: 'Coincide: se saca 2x y después x² − 9 se abre como suma por diferencia.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: {
        columnas: ['paso', 'expresión'],
        filas: [['original', '2x³ − 18x'], [{ t: 'factor común', desde: 1 }, { t: '2x(x² − 9)', desde: 1 }], [{ t: 'identidad', desde: 2 }, { t: '2x(x + 3)(x − 3)', desde: 2, color: 'd', fuerte: true }], [{ t: 'comprobar', desde: 3 }, { t: `2x(x² − 9) = ${poli(mult([2, 0], [1, 0, -9]))}`, desde: 3, marca: 'ok' }]],
        alt: 'Factorización de 2x³ − 18x en tres pasos y su comprobación',
      },
      voz: 'Creo que conviene sacar primero lo común. Después revisamos lo de adentro.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Los dos términos tienen 2 y x: ese es el factor común.', ecuacion: ['2x³ − 18x = 2x(x² − 9)'] },
        { estado: { corte: 2 }, texto: 'Lo de adentro es una diferencia de cuadrados.', ecuacion: ['x² − 9 = (x + 3)(x − 3)'] },
        { estado: { corte: 3 }, texto: 'Se comprueba multiplicando: vuelve el polinomio original.', ecuacion: ['2x(x + 3)(x − 3) = 2x³ − 18x'] },
        { estado: { corte: 3 }, texto: 'Con racionales, x² − 2 no se abre; con reales, sí.', ecuacion: ['x² − 2 = (x − √2)(x + √2)'] },
      ],
    },
    regla: {
      texto: 'Factorizar es reescribir como producto sin cambiar el polinomio. Primero se saca el factor común; después se reconocen identidades. Se comprueba multiplicando.',
      ecuacion: ['ab + ac = a(b + c)   ;   a² − b² = (a + b)(a − b)   ;   a² + 2ab + b² = (a + b)²'],
      condicion: '«completa» depende de los números permitidos: x² − 2 no factoriza con racionales, pero con reales sí.',
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const k = r.uno([1, 2, 3, 5]), p = r.ent(1, 2), c = r.ent(1, 5);
          const xp = p === 1 ? 'x' : `x${sup(p)}`, K = k === 1 ? '' : String(k);
          const cs = mult([k, ...Array(p).fill(0)], [1, 0, -c * c]);
          return {
            pregunta: `¿Cuál es la factorización completa de ${poli(cs)}?`,
            opciones: distintas([
              { id: 'c', texto: `${K}${xp}(x + ${c})(x − ${c})`, correcta: true },
              { id: 'inc', texto: `${K}${xp}(x² − ${c * c})`, error: 'TAL-INCOMPLETA', siFuera: `Es correcta, pero x² − ${c * c} todavía se abre en (x + ${c})(x − ${c}).` },
              { id: 'cuad', texto: `${K}${xp}(x − ${c})²`, error: 'AL8', siFuera: `Al multiplicarla aparece −${2 * c * k}x${sup(p + 1)}, que no está en el polinomio.` },
              { id: 'sinx', texto: `${k === 1 ? '' : k}(x + ${c})(x − ${c})`, error: 'TAL-COMUN', siFuera: `Falta el factor común ${xp}: al multiplicar no se llega al grado ${p + 2}.` },
            ]),
            solucion: { texto: `Se saca ${K}${xp} y queda una diferencia de cuadrados.`, ecuacion: [`${poli(cs)} = ${K}${xp}(x² − ${c * c}) = ${K}${xp}(x + ${c})(x − ${c})`] },
          };
        }
        const c = r.ent(2, 7), sg = s % 4 === 1 ? '+' : '−', cc = sg === '+' ? c : -c;
        return {
          pregunta: `¿Cuál es la factorización de x² ${sg} ${2 * c}x + ${c * c}?`,
          opciones: distintas([
            { id: 'c', texto: `(x ${sg} ${c})²`, correcta: true },
            { id: 'dif', texto: `(x + ${c})(x − ${c})`, error: 'TAL-IDENTIDAD', siFuera: `Ese producto da x² − ${c * c}: los términos cruzados se anulan.` },
            { id: 'doble', texto: `(x ${sg} ${2 * c})²`, error: 'TAL-2AB', siFuera: `Ese da ${poli(mult([1, 2 * cc], [1, 2 * cc]))}: el término central sería ${4 * c}x.` },
            { id: 'otro', texto: `(x ${sg === '+' ? '−' : '+'} ${c})²`, error: 'TAL-SIGNO', siFuera: `Ese da x² ${sg === '+' ? '−' : '+'} ${2 * c}x + ${c * c}: el signo del centro cambia.` },
          ]),
          solucion: { texto: `Dos cuadrados (x² y ${c}²) y el doble producto 2 · x · ${c}.`, ecuacion: [`x² ${sg} ${2 * c}x + ${c * c} = (x ${sg} ${c})²`] },
        };
      },
    },
  };

  // ---------- Idea 2: el aspa reconstruye el término central ----------
  // Cambia: los números p y q · Permanece: el rectángulo con x de lado · Progresa: los dos rectángulos px y qx
  // · Se reserva: los signos negativos, donde la figura ya no sirve · Debe verse: px + qx da el término central.
  const piezas = (p, q) => ({
    anchos: [{ t: 'x', v: 4, color: 'o' }, { t: String(p), v: p, color: 'i' }],
    altos: [{ t: 'x', v: 4, color: 'o' }, { t: String(q), v: q, color: 'i' }],
    celdas: [[{ t: 'x²', color: 'o' }, { t: `${p}x`, color: 'd' }], [{ t: `${q}x`, color: 'd' }, { t: String(p * q), color: 'i' }]],
    total: { t: `(x + ${p})(x + ${q})` },
    alt: `Rectángulo de lados x + ${p} y x + ${q}: piezas x², ${p}x, ${q}x y ${p * q}`,
  });
  // Encabezado de espacios: ensancha la columna hueca (alg-tabla mide el texto) sin dibujar nada.
  const HUECO = ' '.repeat(14);
  // Aspa en la tabla: término, hueco (por donde cruzan las flechas), número y producto cruzado.
  const aspaTabla = (filas, cruz, pie, desde = {}) => ({
    columnas: ['término', HUECO, 'número', 'cruzado'],
    filas: filas.map((fila, k) => [{ t: fila[0], color: 'o', fuerte: true, desde: desde.a || 0 }, '', { t: fila[1], color: 'i', fuerte: true, desde: desde.b || 0 }, { t: cruz[k], color: 'd', desde: desde.c || 0 }]),
    flechas: [{ de: [0, 0], a: [1, 2], color: 'd', desde: desde.c || 0 }, { de: [1, 0], a: [0, 2], color: 'd', desde: desde.c || 0 }],
    pie, alt: `Aspa: ${filas.map(f2 => f2.join(' ')).join(' y ')}; productos cruzados ${cruz.join(' y ')}`,
  });
  const aspa = {
    id: 'aspa-simple',
    titulo: 'El aspa reconstruye el centro',
    temas: ['Aspa simple, doble y doble especial'],
    pieza: 'alg-baldosas',
    juega: {
      consigna: 'Elige p y q. El rectángulo de lados x + p y x + q tiene cuatro piezas; las dos verdes son el término central.',
      voz: 'Suma las dos piezas verdes.',
      controles: [
        { id: 'p', etiqueta: 'p', min: 1, max: 5, paso: 1, inicio: 3, decimales: 0, color: 'c-i' },
        { id: 'q', etiqueta: 'q', min: 1, max: 5, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: piezas(v.p, v.q), estado: {} }),
      lectura: v => [`${poli([1, v.p + v.q, v.p * v.q])} = (x + ${v.p})(x + ${v.q})`],
      minimo: 3,
    },
    predice: (() => {
      const P = [1, -1, -12];
      const da = (p, q) => poli(mult([1, p], [1, q]));
      return {
        pregunta: '¿Cuál es la factorización de x² − x − 12?',
        opciones: [
          { id: 'c', texto: '(x − 4)(x + 3)', correcta: true },
          { id: 'signo', texto: '(x + 4)(x − 3)', error: 'TAL-ASPA-SIGNO', siFuera: `El producto −12 está bien, pero da ${da(4, -3)}: el centro sale +x.` },
          { id: 'centro', texto: '(x − 6)(x + 2)', error: 'TAL-ASPA-MEDIO', siFuera: `El producto −12 está bien, pero da ${da(-6, 2)}: el centro no coincide.` },
          { id: 'lejos', texto: '(x − 12)(x + 1)', error: 'TAL-ASPA-MEDIO', siFuera: `Da ${da(-12, 1)}: los cruzados suman −11x, no −x.` },
        ],
        pieza: 'alg-tabla',
        dibujo: { datos: aspaTabla([['x', '?'], ['x', '?']], ['', ''], `${poli(P)}: el centro es −x`), estado: {} },
        revelar: { datos: aspaTabla([['x', '−4'], ['x', '+3']], ['+3x', '−4x'], '3x − 4x = −x ✓'), estado: {} },
        coincide: 'Coincide: −4 · 3 = −12 y los cruzados suman 3x − 4x = −x.',
      };
    })(),
    mira: {
      pieza: 'alg-tabla',
      datos: aspaTabla([['3x', '−1'], ['2x', '+3']], ['+9x', '−2x'], '9x − 2x = 7x ✓', { a: 1, b: 2, c: 3 }),
      voz: 'Creo que esta partición sirve. Comprobemos el centro.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El primer término se parte en dos factores.', ecuacion: ['6x² = 3x · 2x'] },
        { estado: { corte: 2 }, texto: 'El último también: −3 = (−1) · 3.', ecuacion: ['−3 = (−1)(+3)'] },
        { estado: { corte: 3 }, texto: 'Los productos en cruz deben sumar el término central.', ecuacion: ['3x · 3 + 2x · (−1) = 9x − 2x = 7x'] },
        { estado: { corte: 3 }, texto: 'Se leen los factores por filas.', ecuacion: ['6x² + 7x − 3 = (3x − 1)(2x + 3)'] },
      ],
    },
    regla: {
      texto: 'En el aspa, los extremos se parten en productos y los productos en cruz deben sumar el término central. Si no suman, se prueba otra partición.',
      ecuacion: ['ax² + bx + c = (mx + p)(nx + q),  con  mq + np = b'],
      condicion: 'se comprueba multiplicando; si ninguna partición con enteros reconstruye el centro, no factoriza con enteros.',
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s);
        let M, N, P, Q;
        do { M = r.ent(1, 3); N = r.ent(1, 3); P = r.uno([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]); Q = r.uno([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]); }
        while (mcd(M, P) !== 1 || mcd(N, Q) !== 1 || M * Q + N * P === 0 || (M === N && P === Q));
        const cs = mult([M, P], [N, Q]), txt = (m1, p1, n1, q1) => `(${lin(m1, p1)})(${lin(n1, q1)})`;
        const igual = (m1, p1, n1, q1) => JSON.stringify(mult([m1, p1], [n1, q1])) === JSON.stringify(cs);
        const cand = [
          { m: M, p: -P, n: N, q: -Q, error: 'TAL-ASPA-SIGNO', siFuera: 'Los extremos coinciden, pero el centro sale con el signo contrario.' },
          { m: M, p: Q, n: N, q: P, error: 'TAL-ASPA-MEDIO', siFuera: 'Los extremos coinciden, pero los cruzados no suman el centro.' },
          { m: M, p: -Q, n: N, q: -P, error: 'TAL-ASPA-MEDIO', siFuera: 'Los cruzados no reconstruyen el término central.' },
          { m: M * N, p: P, n: 1, q: Q, error: 'TAL-ASPA-MEDIO', siFuera: 'El primer término está bien partido, pero el centro no coincide.' },
        ].filter((c, k, l) => !igual(c.m, c.p, c.n, c.q) && l.findIndex(o => JSON.stringify(mult([o.m, o.p], [o.n, o.q])) === JSON.stringify(mult([c.m, c.p], [c.n, c.q]))) === k);
        const datos = aspaTabla([[`${M === 1 ? '' : M}x`, `${P > 0 ? '+' : '−'}${Math.abs(P)}`], [`${N === 1 ? '' : N}x`, `${Q > 0 ? '+' : '−'}${Math.abs(Q)}`]],
          [`${M * Q > 0 ? '+' : '−'}${Math.abs(M * Q)}x`, `${N * P > 0 ? '+' : '−'}${Math.abs(N * P)}x`], `cruzados: ${poli([M * Q + N * P, 0])} ✓`);
        return {
          pregunta: `¿Cuál es la factorización de ${poli(cs)}?`,
          opciones: distintas([{ id: 'c', texto: txt(M, P, N, Q), correcta: true }, ...cand.map((c, k) => ({ id: `d${k}`, texto: txt(c.m, c.p, c.n, c.q), error: c.error, siFuera: c.siFuera }))]),
          solucion: { texto: 'Los extremos se parten y los cruzados suman el centro.', ecuacion: [`${poli(cs)} = ${txt(M, P, N, Q)}`], dibujo: { datos, estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: aspa doble y doble especial ----------
  // Cambia: el ejemplo y el paso · Permanece: las dos filas de factores · Progresa: las aspas que se verifican
  // · Se reserva: lo que falta del término central en la doble especial · Debe verse: cada aspa rehace un término.
  const DOBLE = {
    titulo: '2x² + 7xy + 3y² + 7x + 11y + 6', columnas: ['x', HUECO, 'y', HUECO, 'número'],
    filas: [['2x', 'y', '3'], ['x', '3y', '2']],
    pasos: [
      { flechas: [[0, 1]], pie: '2x · 3y + x · y = 7xy ✓' },
      { flechas: [[1, 2]], pie: 'y · 2 + 3y · 3 = 11y ✓' },
      { flechas: [[0, 2]], pie: '2x · 2 + x · 3 = 7x ✓' },
    ],
    final: '(2x + y + 3)(x + 3y + 2)',
  };
  const ESPECIAL = {
    titulo: 'x⁴ + 5x³ + 9x² + 7x + 2', columnas: ['x²', HUECO, 'x', HUECO, 'número'],
    filas: [['x²', '2x', '1'], ['x²', '3x', '2']],
    pasos: [
      { flechas: [[0, 2]], pie: '2x² + x² = 3x²; faltan 6x²' },
      { flechas: [[0, 1]], pie: '6x² = 2x · 3x; 3x³ + 2x³ = 5x³ ✓' },
      { flechas: [[1, 2]], pie: '2x · 2 + 3x · 1 = 7x ✓' },
    ],
    final: '(x² + 2x + 1)(x² + 3x + 2)',
  };
  // Columnas 0, 2 y 4: los tres términos de cada factor; 1 y 3 son huecos por donde cruzan las aspas.
  const conHuecos = fila => [fila[0], '', fila[1], '', fila[2]];
  const COL = k => (k === 0 ? 'o' : k === 2 ? 'd' : k === 4 ? 'i' : null);
  const tablaDoble = (E, paso) => ({
    columnas: E.columnas,
    filas: E.filas.map(fila => conHuecos(fila).map((t, c) => ({ t, color: COL(c), fuerte: true }))),
    flechas: E.pasos.slice(0, paso).flatMap(pp => pp.flechas.flatMap(([c1, c2]) => [{ de: [0, 2 * c1], a: [1, 2 * c2], color: 'd' }, { de: [1, 2 * c1], a: [0, 2 * c2], color: 'd' }])),
    pie: paso ? E.pasos[paso - 1].pie : E.titulo,
    alt: `Aspa con las filas ${E.filas.map(x => x.join(', ')).join(' y ')}`,
  });
  const doble = {
    id: 'aspa-doble',
    titulo: 'Tres aspas para seis términos',
    temas: ['Aspa simple, doble y doble especial'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Elige un ejemplo y avanza el paso. Cada paso traza un aspa y comprueba el término que reconstruye.',
      voz: 'Cada aspa usa dos columnas.',
      controles: [
        { id: 'ej', etiqueta: 'Ejemplo', opciones: [{ valor: 'doble', texto: 'doble' }, { valor: 'especial', texto: 'doble especial' }] },
        { id: 'paso', etiqueta: 'Paso', min: 0, max: 3, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDoble(v.ej === 'doble' ? DOBLE : ESPECIAL, v.paso), estado: {} }),
      lectura: v => [v.paso === 3 ? (v.ej === 'doble' ? DOBLE : ESPECIAL).final : `Paso ${v.paso} de 3`],
      minimo: 4,
    },
    predice: (() => {
      // (x² + x + 1)(x² + 3x + 3) = x⁴ + 4x³ + 7x² + 6x + 3
      const P = mult([1, 1, 1], [1, 3, 3]), cruce = 1 * 3 + 1 * 1, falta = P[2] - cruce;
      return {
        pregunta: `En ${poli(P)}, el aspa de los extremos (x² · x² y 1 · 3) da ${cruce}x². ¿Cuánto falta para el término en x²?`,
        opciones: [
          { id: 'c', texto: `${falta}x²`, correcta: true },
          { id: 'todo', texto: `${P[2]}x²`, error: 'TAL-DE-FALTA', siFuera: `${P[2]}x² es el término entero; ya hay ${cruce}x² de los extremos.` },
          { id: 'suma', texto: `${P[2] + cruce}x²`, error: 'TAL-DE-FALTA', siFuera: 'Lo de los extremos ya está dentro: se resta, no se suma.' },
          { id: 'cruce', texto: `${cruce}x²`, error: 'TAL-DE-FALTA', siFuera: `${cruce}x² es lo que ya dieron los extremos, no lo que falta.` },
        ],
        dibujo: { datos: { columnas: ['x²', HUECO, 'x', HUECO, 'número'], filas: [[{ t: 'x²', color: 'o' }, '', '?', '', { t: '1', color: 'i' }], [{ t: 'x²', color: 'o' }, '', '?', '', { t: '3', color: 'i' }]], flechas: [{ de: [0, 0], a: [1, 4], color: 'd' }, { de: [1, 0], a: [0, 4], color: 'd' }], pie: `extremos: ${cruce}x²`, alt: 'Aspa de los extremos de un polinomio de cuarto grado' }, estado: {} },
        revelar: { datos: { columnas: ['x²', HUECO, 'x', HUECO, 'número'], filas: [[{ t: 'x²', color: 'o' }, '', { t: 'x', color: 'd', fuerte: true }, '', { t: '1', color: 'i' }], [{ t: 'x²', color: 'o' }, '', { t: '3x', color: 'd', fuerte: true }, '', { t: '3', color: 'i' }]], flechas: [{ de: [0, 0], a: [1, 4], color: 'd' }, { de: [1, 0], a: [0, 4], color: 'd' }], pie: `${P[2]}x² − ${cruce}x² = ${falta}x² = x · 3x`, alt: 'Lo que falta se reparte entre los términos de en medio' }, estado: {} },
        coincide: `Coincide: faltan ${falta}x², que se parten como x · 3x.`,
      };
    })(),
    mira: {
      datos: {
        columnas: ESPECIAL.columnas,
        filas: ESPECIAL.filas.map(fila => conHuecos(fila).map((t, c) => ({ t, color: COL(c), fuerte: true, desde: c === 2 ? 2 : 1 }))),
        flechas: [{ de: [0, 0], a: [1, 4], color: 'd', desde: 1 }, { de: [1, 0], a: [0, 4], color: 'd', desde: 1 },
          { de: [0, 0], a: [1, 2], color: 'd', desde: 3 }, { de: [1, 0], a: [0, 2], color: 'd', desde: 3 },
          { de: [0, 2], a: [1, 4], color: 'd', desde: 4 }, { de: [1, 2], a: [0, 4], color: 'd', desde: 4 }],
        alt: 'Aspa doble especial de x⁴ + 5x³ + 9x² + 7x + 2',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Se parten los extremos: x⁴ = x² · x² y 2 = 1 · 2.', ecuacion: ['cruzados: 2x² + x² = 3x²'] },
        { estado: { corte: 2 }, texto: 'Faltan 9x² − 3x² = 6x², que se parten en 2x · 3x.', ecuacion: ['6x² = 2x · 3x'] },
        { estado: { corte: 3 }, texto: 'Aspa de la izquierda: rehace el término en x³.', ecuacion: ['x² · 3x + x² · 2x = 5x³ ✓'] },
        { estado: { corte: 4 }, texto: 'Aspa de la derecha: rehace el término en x.', ecuacion: ['2x · 2 + 3x · 1 = 7x ✓'] },
        { estado: { corte: 4 }, texto: 'Se leen los factores por filas y se siguen abriendo.', ecuacion: ['(x² + 2x + 1)(x² + 3x + 2) = (x + 1)³(x + 2)'] },
      ],
    },
    regla: {
      texto: 'El aspa doble verifica tres aspas, una por cada par de columnas. En la doble especial, lo que falta del término central se reparte entre los términos de en medio.',
      ecuacion: ['(2x + y + 3)(x + 3y + 2):   2x · 3y + x · y = 7xy'],
      condicion: 'cada producto cruzado debe reconstruir su término; si alguno falla, se cambia la partición y se comprueba multiplicando.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const a1 = r.ent(1, 3), b1 = r.ent(1, 3), a2 = r.ent(1, 4), b2 = r.ent(1, 4);
          const P = mult([1, a1, b1], [1, a2, b2]), cruce = b1 + b2, falta = P[2] - cruce;
          return {
            pregunta: `En ${poli(P)}, se parte x⁴ = x² · x² y ${P[4]} = ${b1} · ${b2}. ¿Cuánto falta para el término en x²?`,
            opciones: distintas([
              { id: 'c', texto: `${falta}x²`, correcta: true },
              { id: 'todo', texto: `${P[2]}x²`, error: 'TAL-DE-FALTA', siFuera: `${P[2]}x² es el término entero; los extremos ya dan ${cruce}x².` },
              { id: 'suma', texto: `${P[2] + cruce}x²`, error: 'TAL-DE-FALTA', siFuera: 'Lo que dan los extremos se resta, no se suma.' },
              { id: 'cruce', texto: `${cruce}x²`, error: 'TAL-DE-FALTA', siFuera: `${cruce}x² es lo que dieron los extremos, no lo que falta.` },
            ]),
            solucion: { texto: `Los extremos dan x² · ${b2} + x² · ${b1} = ${cruce}x².`, ecuacion: [`${P[2]}x² − ${cruce}x² = ${falta}x² = ${a1 === 1 ? '' : a1}x · ${a2 === 1 ? '' : a2}x`] },
          };
        }
        const m = r.ent(1, 3), p = r.ent(1, 3), c = r.ent(1, 5), n = r.ent(1, 3), q = r.ent(1, 3), d = r.ent(1, 5);
        const t = (k, v) => `${k === 1 ? '' : k}${v}`;
        return {
          pregunta: `Al multiplicar (${t(m, 'x')} + ${t(p, 'y')} + ${c})(${t(n, 'x')} + ${t(q, 'y')} + ${d}), ¿qué coeficiente tiene el término en x?`,
          opciones: distintas([
            { id: 'c', texto: f(m * d + n * c, 0), correcta: true },
            { id: 'xx', texto: f(m * n, 0), error: 'TAL-AUXILIAR', siFuera: `${m * n} acompaña a x²: es el producto de los términos en x.` },
            { id: 'cc', texto: f(c * d, 0), error: 'TAL-AUXILIAR', siFuera: `${c * d} es el término independiente: no lleva x.` },
            { id: 'mal', texto: f(m * c + n * d, 0), error: 'TAL-AUXILIAR', siFuera: 'El aspa cruza: cada x se multiplica por el número de la otra fila.' },
          ]),
          solucion: { texto: 'Es el aspa auxiliar: los x por los números, en cruz.', ecuacion: [`${t(m, 'x')} · ${d} + ${t(n, 'x')} · ${c} = ${m * d + n * c}x`] },
        };
      },
    },
  };

  // ---------- Idea 4: P(a) = 0 dice que x − a es factor ----------
  // Cambia: el valor a · Permanece: la gráfica de P · Progresa: el punto (a, P(a)) que recorre la curva
  // · Se reserva: el signo del factor (x − a con a negativo) · Debe verse: donde P vale 0, hay un factor.
  const PF = [1, -2, -5, 6];                      // (x − 1)(x + 2)(x − 3)
  const curvaP = () => Array.from({ length: 71 }, (_, k) => { const x = -3 + k * 0.1; return [x, evaluar(PF, x)]; });
  const ejesP = (extra = {}) => Object.assign({
    x: { min: -3, max: 4, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
    y: { min: -25, max: 20, paso: 10, nombre: 'P', decimales: 0, color: 'd' },
    curvas: [{ puntos: curvaP(), color: 'd', rotulo: 'P(x)', en: [3.6, evaluar(PF, 3.6)] }],
  }, extra);
  const factorTeo = {
    id: 'teorema-factor',
    titulo: 'Si P(a) = 0, hay factor',
    temas: ['Divisores binómicos', 'Teorema del factor'],
    pieza: 'ejes',
    juega: {
      consigna: 'P(x) = x³ − 2x² − 5x + 6. Mueve a y mira el valor de P(a). Busca dónde la curva corta el eje.',
      voz: 'Anota los valores de a donde P vale cero.',
      controles: [{ id: 'a', etiqueta: 'a', min: -3, max: 4, paso: 1, inicio: 0, decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: ejesP({ puntos: [{ x: v.a, y: evaluar(PF, v.a), color: 'o', rotulo: `P(${v.a}) = ${f(evaluar(PF, v.a), 0)}`, guias: true }] }), estado: {} }),
      lectura: v => [`P(${f(v.a, 0)}) = ${f(evaluar(PF, v.a), 0)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Sabemos que P(−2) = 0. ¿Cuál de estos binomios es un factor de P(x)?',
      opciones: [
        { id: 'c', texto: 'x + 2', correcta: true },
        { id: 'signo', texto: 'x − 2', error: 'TAL-FACTOR-SIGNO', siFuera: `x − 2 se anula en x = 2, y P(2) = ${evaluar(PF, 2)}, no 0.` },
        { id: 'x', texto: 'x', error: 'TAL-FACTOR-X', siFuera: `x sería factor si P(0) fuera 0; P(0) = ${evaluar(PF, 0)}.` },
        { id: 'seis', texto: 'x + 6', error: 'TAL-FACTOR-SIGNO', siFuera: `x + 6 se anula en −6, y P(−6) = ${f(evaluar(PF, -6), 0)}.` },
      ],
      dibujo: { datos: ejesP({ puntos: [{ x: -2, y: 0, color: 'o', rotulo: 'P(−2) = 0' }] }), estado: {} },
      revelar: { datos: ejesP({ puntos: [{ x: -2, y: 0, color: 'o', rotulo: 'x + 2 = 0', guias: true }] }), estado: {} },
      coincide: 'Coincide: x + 2 vale 0 justo en x = −2, donde P se anula.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: {
        columnas: ['candidato', 'P(c)', 'factor'],
        filas: [1, -1, 2, -2, 3, -3, 6, -6].map(c => [{ t: f(c, 0), desde: 1, color: 'o' }, { t: f(evaluar(PF, c), 0), desde: 2, color: evaluar(PF, c) === 0 ? 'd' : null, fuerte: evaluar(PF, c) === 0 }, { t: evaluar(PF, c) === 0 ? fx(c) : '', desde: 3, color: 'd', fuerte: true, marca: evaluar(PF, c) === 0 ? 'ok' : undefined }]),
        alt: 'Candidatos ±1, ±2, ±3 y ±6: P se anula en 1, −2 y 3',
      },
      voz: 'Creo que hay pocos candidatos. Probémoslos todos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Una raíz entera debe dividir al término independiente, 6.', ecuacion: ['candidatos: ±1, ±2, ±3, ±6'] },
        { estado: { corte: 2 }, texto: 'Se evalúa P en cada candidato.', ecuacion: ['P(1) = 1 − 2 − 5 + 6 = 0'] },
        { estado: { corte: 3 }, texto: 'Cada cero da un factor x − c.', ecuacion: ['P(1) = P(−2) = P(3) = 0'] },
        { estado: { corte: 3 }, texto: 'Tres factores de grado 1 completan el grado 3.', ecuacion: [`P(x) = (${fx(1)})(${fx(-2)})(${fx(3)})`] },
      ],
    },
    regla: {
      texto: 'x − a es factor de P(x) exactamente cuando P(a) = 0. Con coeficientes enteros, una raíz entera divide al término independiente.',
      ecuacion: ['P(', { v: 'c-o', t: 'a' }, ') = 0   ⇔   (x − ', { v: 'c-o', t: 'a' }, ') es factor de P(x)'],
      condicion: 'la lista de candidatos pide coeficientes enteros; si el principal no es 1, se prueban fracciones p/q. Ser candidato no basta.',
    },
    ahoraTu: {
      pieza: 'ejes',
      generar(s) {
        const r = azar(s);
        let raices;
        do { raices = [r.ent(-4, 4), r.ent(-4, 4), r.ent(-4, 4)]; } while (new Set(raices).size < 3 || raices.includes(0));
        const cs = raices.reduce((acc, a) => mult(acc, [1, -a]), [1]);
        const c0 = cs[3], rr = r.uno(raices);
        const divs = []; for (let d = 1; d <= Math.abs(c0); d++) if (c0 % d === 0) divs.push(d, -d);
        const noRaiz = divs.filter(d => !raices.includes(d));
        const d1 = r.uno(noRaiz.length ? noRaiz : [9]);
        const opts = [
          { id: 'c', texto: fx(rr), correcta: true },
          !raices.includes(-rr) && { id: 'signo', texto: fx(-rr), error: 'TAL-FACTOR-SIGNO', siFuera: `${fx(-rr)} se anula en ${f(-rr, 0)}, y P(${f(-rr, 0)}) = ${f(evaluar(cs, -rr), 0)}.` },
          { id: 'div', texto: fx(d1), error: 'TAL-FACTOR-CAND', siFuera: `${f(d1, 0)} divide a ${f(c0, 0)}, pero P(${f(d1, 0)}) = ${f(evaluar(cs, d1), 0)}: ser candidato no basta.` },
          { id: 'x', texto: 'x', error: 'TAL-FACTOR-X', siFuera: `x sería factor si P(0) fuera 0; P(0) = ${f(c0, 0)}.` },
        ];
        const lo = Math.min(...raices) - 1, hi = Math.max(...raices) + 1;
        const pts = Array.from({ length: 41 }, (_, k) => { const x = lo + (hi - lo) * k / 40; return [x, evaluar(cs, x)]; });
        const ys = pts.map(p => p[1]), ymin = Math.min(...ys), ymax = Math.max(...ys);
        return {
          pregunta: `¿Cuál de estos binomios es un factor de P(x) = ${poli(cs)}?`,
          opciones: distintas(opts),
          solucion: {
            texto: `P(${f(rr, 0)}) = 0, así que ${fx(rr)} es factor.`, ecuacion: [`P(x) = ${raices.map(a => `(${fx(a)})`).join('')}`],
            dibujo: { datos: { x: { min: lo, max: hi, paso: 1, nombre: 'x', decimales: 0, color: 'o' }, y: { min: Math.floor(ymin), max: Math.ceil(ymax), paso: Math.max(1, Math.ceil((ymax - ymin) / 50) * 10), nombre: 'P', decimales: 0, color: 'd' }, curvas: [{ puntos: pts, color: 'd' }], puntos: raices.map(a => ({ x: a, y: 0, color: 'o', rotulo: f(a, 0) })), alt: `Gráfica de P: corta el eje en ${raices.join(', ')}` }, estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 5: MCD con el menor exponente, MCM con el mayor ----------
  // Cambia: los exponentes de (x − 1) en P y en Q · Permanece: la tabla de factores · Progresa: las columnas MCD y
  // MCM · Se reserva: el factor que solo tiene uno · Debe verse: mínimo para el MCD, máximo para el MCM.
  const tablaMult = (rows, nombres = ['P', 'Q']) => ({
    columnas: ['factor', nombres[0], nombres[1], 'MCD', 'MCM'], colorCol: ['', 'o', 'i', 'd', 'h'],
    filas: rows.map(([fac, i, j, des]) => [{ t: fac, fuerte: true }, String(i), String(j), { t: String(Math.min(i, j)), color: 'd', fuerte: true, desde: des || 0 }, { t: String(Math.max(i, j)), color: 'h', fuerte: true, desde: des || 0 }]),
    alt: 'Exponente de cada factor en P y Q; el MCD toma el menor y el MCM el mayor',
  });
  const escribir = rows => rows.map(([fac, e]) => conPot(fac, e)).join('') || '1';
  const mcdmcm = {
    id: 'mcd-mcm',
    titulo: 'Menor exponente, mayor exponente',
    temas: ['MCD y MCM de polinomios'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'P = (x − 1)ⁱ(x + 2)² y Q = (x − 1)ʲ(x + 2)(x + 3). Cambia i y j; mira MCD y MCM.',
      voz: 'Compara cada exponente de MCD con los de P y Q.',
      controles: [
        { id: 'i', etiqueta: 'i', min: 0, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
        { id: 'j', etiqueta: 'j', min: 0, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: tablaMult([['x − 1', v.i, v.j], ['x + 2', 2, 1], ['x + 3', 0, 1]]), estado: {} }),
      lectura: v => [`MCD = ${escribir([['x − 1', Math.min(v.i, v.j)], ['x + 2', 1]])}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'P = x² − 1 y Q = x² − 2x + 1. ¿Cuál es el MCD de P y Q?',
      opciones: [
        { id: 'c', texto: 'x − 1', correcta: true },
        { id: 'max', texto: '(x − 1)²', error: 'TAL-MCD-MAX', siFuera: '(x − 1)² no divide a x² − 1, que tiene a x − 1 una sola vez.' },
        { id: 'sin', texto: 'x² − 1', error: 'TAL-MCD-SINFACTOR', siFuera: 'x² − 1 no divide a Q: Q no tiene el factor x + 1.' },
        { id: 'uno', texto: '1', error: 'TAL-MCD-PRIMOS', siFuera: 'Serían primos entre sí sin factor común; los dos se anulan en x = 1.' },
      ],
      dibujo: { datos: { columnas: ['polinomio', 'factorizado'], filas: [[{ t: 'x² − 1', color: 'o' }, '?'], [{ t: 'x² − 2x + 1', color: 'i' }, '?']], alt: 'P y Q sin factorizar' }, estado: {} },
      revelar: { datos: tablaMult([['x − 1', 1, 2], ['x + 1', 1, 0]]), estado: {} },
      coincide: 'Coincide: P = (x + 1)(x − 1), Q = (x − 1)², y lo común es x − 1 una vez.',
    },
    mira: {
      datos: Object.assign(tablaMult([['x − 1', 1, 2, 2], ['x + 1', 1, 0, 2]]), { filas: tablaMult([['x − 1', 1, 2, 2], ['x + 1', 1, 0, 2]]).filas.map(fl => fl.map((c, k) => (k === 1 || k === 2 ? { t: c, desde: 1 } : c))) }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Primero se factoriza cada polinomio por completo.', ecuacion: ['P = (x + 1)(x − 1)   ;   Q = (x − 1)²'] },
        { estado: { corte: 2 }, texto: 'MCD: los factores comunes con su menor exponente.', ecuacion: ['MCD = (x − 1)¹ = x − 1'] },
        { estado: { corte: 2 }, texto: 'MCM: todos los factores con su mayor exponente.', ecuacion: ['MCM = (x + 1)(x − 1)²'] },
        { estado: { corte: 2 }, texto: 'Comprobación: MCD por MCM da P por Q.', ecuacion: ['(x − 1) · (x + 1)(x − 1)² = P · Q'] },
      ],
    },
    regla: {
      texto: 'Se factorizan los polinomios por completo. El MCD lleva los factores comunes con su menor exponente; el MCM, todos los factores con su mayor exponente.',
      ecuacion: ['MCD · MCM = P · Q   (para P y Q mónicos)'],
      condicion: 'MCD y MCM se fijan salvo una constante: se eligen mónicos, con coeficiente principal 1.',
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s);
        const [a, b, c] = r.mezclar([-3, -2, -1, 1, 2, 3, 4]).slice(0, 3);
        const i = r.ent(1, 3), j = r.ent(1, 2), l = r.ent(1, 2); let k = r.ent(1, 3); if (k === i) k = i === 3 ? 1 : i + 1;
        const P = [[fx(a), i], [fx(b), j]], Q = [[fx(a), k], [fx(c), l]];
        const pide = s % 2 ? 'MCM' : 'MCD';
        const mcdT = escribir([[fx(a), Math.min(i, k)]]), mcmT = escribir([[fx(a), Math.max(i, k)], [fx(b), j], [fx(c), l]]);
        const bien = pide === 'MCD' ? mcdT : mcmT;
        const opts = pide === 'MCD' ? [
          { id: 'max', texto: escribir([[fx(a), Math.max(i, k)]]), error: 'TAL-MCD-MAX', siFuera: 'El MCD toma el menor exponente: debe dividir a los dos.' },
          { id: 'todos', texto: escribir([[fx(a), Math.min(i, k)], [fx(b), j]]), error: 'TAL-MCD-SINFACTOR', siFuera: `${fx(b)} no está en Q: no es común.` },
          { id: 'mcm', texto: mcmT, error: 'TAL-MCD-MCM', siFuera: 'Ese es el MCM: lleva todos los factores con su mayor exponente.' },
        ] : [
          { id: 'min', texto: escribir([[fx(a), Math.min(i, k)], [fx(b), j], [fx(c), l]]), error: 'TAL-MCM-MIN', siFuera: 'El MCM toma el mayor exponente: debe ser múltiplo de los dos.' },
          { id: 'comun', texto: mcdT, error: 'TAL-MCD-MCM', siFuera: 'Ese es el MCD: solo los factores comunes.' },
          { id: 'suma', texto: escribir([[fx(a), i + k], [fx(b), j], [fx(c), l]]), error: 'TAL-MCM-SUMA', siFuera: 'Eso es P · Q: el factor común se cuenta dos veces.' },
        ];
        return {
          pregunta: `P = ${escribir(P)} y Q = ${escribir(Q)}. ¿Cuál es el ${pide} de P y Q?`,
          opciones: distintas([{ id: 'c', texto: bien, correcta: true }, ...opts]),
          solucion: { texto: pide === 'MCD' ? 'Solo lo común, con el menor exponente.' : 'Todos los factores, con el mayor exponente.', ecuacion: [`${pide} = ${bien}`], dibujo: { datos: tablaMult([[fx(a), i, k], [fx(b), j, 0], [fx(c), 0, l]]), estado: {} } },
        };
      },
    },
  };

  return {
    unidad: 'algebra.factorizacion',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/alg-baldosas.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'La proposición II.4 de los Elementos de Euclides parte el cuadrado sobre un segmento en dos cuadrados y dos rectángulos. Euclides lo dice con geometría; leerlo como (a + b)² es una interpretación moderna. Leer esa relación en los dos sentidos lleva de expandir a factorizar, con un límite: las longitudes no son negativas, y la identidad algebraica vale más allá de la figura.',
      pregunta: '¿Qué cambia si lees la misma igualdad al revés?',
      fuente: { titulo: 'Euclides, Elementos II.4; edición y comentario de David E. Joyce — Clark University', url: 'https://mathcs.clarku.edu/~djoyce/elements/bookII/propII4.html' },
    },
    ideas: [comun, aspa, doble, factorTeo, mcdmcm],
  };
});
