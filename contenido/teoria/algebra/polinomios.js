/*
 * Teoría de «Polinomios» (algebra.polinomios). Molde: docs/teoria.md; forma de Álgebra: logica-y-conjuntos.js.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 7), expediente teoria-152-unidades (Álgebra) y
 * historia-ecuaciones (pp. 57–68). Errores: PO1–PO35 de plantillas/polinomios/ (hipótesis del proyecto), AL16 de
 * docs/investigacion/algebra-funciones-ideas-erroneas.md y TAL-* nuevos (hipótesis, rutinas/teoria-algebra.md).
 * Colores (regla 4): exponente o término de x y el polinomio P naranja (c-o); exponente de y y el polinomio Q
 * turquesa (c-i); grado, valor o resultado verde (c-d); lo que falta o el error rojo (c-h).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · leer la estructura de un polinomio (grados, casillas, coeficientes) y operar sin perder un término.
 * Persona y condiciones · 3.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · halla grados, valores numéricos y coeficientes de un producto; decide si dos polinomios son iguales.
 * Orden de atención · 1.º la tabla de casillas o la curva · 2.º la casilla o el punto que cambia · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué dos polinomios que valen lo mismo en un punto no son, por eso, el mismo polinomio.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const P = { v: 'c-o', t: 'P' }, Q = { v: 'c-i', t: 'Q' }, x = { v: 'c-o', t: 'x' };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r();                                  // la primera salida se parece entre semillas vecinas: se descarta
    r.noCero = (lo, hi) => { let v = 0; while (v === 0) v = lo + Math.floor(r() * (hi - lo + 1)); return v; };
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  // ---------- Escritura de polinomios ----------
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = n => String(n).split('').map(c => SUP[c]).join('');
  const pot = (v, e) => (e === 0 ? '' : e === 1 ? v : v + sup(e));
  // Un monomio c·x^a·y^b con su signo; primero: sin «+» delante.
  function mono(c, partes, primero) {
    const lit = partes.map(([v, e]) => pot(v, e)).join('');
    const abs = Math.abs(c), num = abs === 1 && lit ? '' : f(abs);
    const signo = c < 0 ? (primero ? '−' : ' − ') : (primero ? '' : ' + ');
    return signo + num + lit;
  }
  // Polinomio en x con coeficientes de mayor a menor grado: [2, 0, −5, 1] → «2x³ − 5x + 1».
  function poli(cs, v = 'x') {
    const n = cs.length - 1, out = [];
    cs.forEach((c, k) => { if (c !== 0) out.push([c, n - k]); });
    if (!out.length) return '0';
    return out.map(([c, e], i) => mono(c, [[v, e]], i === 0)).join('');
  }
  const par = v => (v < 0 ? `(${f(v)})` : f(v));
  const evaluar = (cs, a) => cs.reduce((acc, c) => acc * a + c, 0);
  const multiplicar = (A, B) => { const out = Array(A.length + B.length - 1).fill(0); A.forEach((a, i) => B.forEach((b, j) => { out[i + j] += a * b; })); return out; };

  // ---------- Idea 1: el grado se suma dentro del término ----------
  // Cambia: los exponentes del primer término · Permanece: los otros dos términos · Progresa: las columnas de
  // exponentes y de grado · Se reserva: la fila que da el grado absoluto · Debe verse: suma dentro, máximo entre filas.
  const tablaGrados = (terminos, cortes = {}) => {
    const gr = terminos.map(([, a, b]) => a + b), max = Math.max(...gr);
    return {
      columnas: ['término', 'exp. de x', 'exp. de y', 'grado'], colorCol: [null, 'o', 'i', 'd'],
      filas: terminos.map(([c, a, b], k) => [mono(c, [['x', a], ['y', b]], true) || f(c), { t: f(a), desde: cortes.x || 0, color: 'o' }, { t: f(b), desde: cortes.y || 0, color: 'i' }, { t: f(gr[k]), desde: cortes.g || 0, color: 'd', fuerte: gr[k] === max }]),
      resaltes: gr.map((g, k) => (g === max ? { f: k, c: 0, ancho: 4, color: 'd', desde: cortes.max || 0 } : null)).filter(Boolean),
      alt: `Términos con sus exponentes de x y de y; el grado mayor es ${max}`,
    };
  };
  const PRED1 = [[3, 2, 1], [-2, 1, 3], [1, 0, 0]];   // 3x²y − 2xy³ + 1
  const grados = {
    id: 'grados',
    titulo: 'El grado se suma por término',
    temas: ['Grado absoluto y relativo'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'P = 3xᵃyᵇ − 2xy³ + 5x². Cambia los exponentes del primer término y mira el grado de cada fila y el de todo P.',
      voz: 'Creo que conviene mirar fila por fila.',
      controles: [
        { id: 'a', etiqueta: 'exp. de x', min: 0, max: 5, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'exp. de y', min: 0, max: 5, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      ],
      dibujo: val => ({ datos: tablaGrados([[3, val.a, val.b], [-2, 1, 3], [5, 2, 0]]), estado: {} }),
      lectura: val => {
        const t = [[val.a, val.b], [1, 3], [2, 0]];
        return [`GR(x) = ${Math.max(...t.map(z => z[0]))} · GR(y) = ${Math.max(...t.map(z => z[1]))} · GA = ${Math.max(...t.map(z => z[0] + z[1]))}`];
      },
      minimo: 3,
    },
    predice: (() => {
      const gr = PRED1.map(([, a, b]) => a + b), GA = Math.max(...gr);
      const GRx = Math.max(...PRED1.map(t => t[1])), GRy = Math.max(...PRED1.map(t => t[2]));
      const todos = PRED1.reduce((s, t) => s + t[1] + t[2], 0);
      return {
        pregunta: '¿Cuál es el grado absoluto de 3x²y − 2xy³ + 1?',
        opciones: [
          { id: 'c', texto: f(GA), correcta: true },
          { id: 'relativo', texto: f(Math.max(GRx, GRy)), error: 'PO10', siFuera: `${Math.max(GRx, GRy)} es el mayor grado relativo, el de y. El absoluto suma los exponentes de cada término.` },
          { id: 'todos', texto: f(todos), error: 'PO11', siFuera: `${todos} suma los exponentes de todos los términos; el grado se suma dentro de cada término.` },
          { id: 'suma-rel', texto: f(GRx + GRy), error: 'PO28', siFuera: `${GRx + GRy} suma los dos grados relativos, que salen de términos distintos.` },
        ],
        dibujo: { datos: tablaGrados(PRED1, { g: 1, max: 1 }), estado: { corte: 0 } },
        revelar: { datos: tablaGrados(PRED1), estado: {} },
        coincide: `Coincide: los términos tienen grados ${gr.join(', ')}; el mayor es ${GA}.`,
      };
    })(),
    mira: {
      datos: tablaGrados(PRED1, { x: 1, y: 2, g: 3, max: 4 }),
      voz: 'Las formas cambian; el grado se lee igual en cada fila.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Exponentes de x en cada término. El mayor, 2, es GR(x).', ecuacion: ['GR(', x, ') = 2'] },
        { estado: { corte: 2 }, texto: 'Exponentes de y. El mayor, 3, es GR(y).', ecuacion: ['GR(', { v: 'c-i', t: 'y' }, ') = 3'] },
        { estado: { corte: 3 }, texto: 'Grado de cada término: sus exponentes sumados.', ecuacion: ['2 + 1 = 3   ·   1 + 3 = 4   ·   0 + 0 = 0'] },
        { estado: { corte: 4 }, texto: 'El grado absoluto es el mayor de esos grados.', ecuacion: ['GA = máx(3; 4; 0) = 4'] },
      ],
    },
    regla: {
      texto: 'El grado de un término es la suma de sus exponentes. El grado absoluto es el mayor de esos grados; el relativo a x, el mayor exponente de x.',
      ecuacion: ['GA = máx(grados de los términos)'],
      condicion: 'los exponentes son enteros no negativos; el polinomio cero no tiene grado y se trata por convención aparte.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let ts;
        do { ts = [0, 1, 2].map(() => [r.noCero(-6, 7), r.ent(0, 5), r.ent(0, 5)]); } while (new Set(ts.map(t => t[1] + ',' + t[2])).size < 3 || ts.some(t => t[1] + t[2] === 0));
        const gr = ts.map(t => t[1] + t[2]), GA = Math.max(...gr), GRx = Math.max(...ts.map(t => t[1])), GRy = Math.max(...ts.map(t => t[2]));
        const todos = ts.reduce((a, t) => a + t[1] + t[2], 0), sx = ts.reduce((a, t) => a + t[1], 0);
        const texto = ts.map(([c, a, b], i) => mono(c, [['x', a], ['y', b]], i === 0)).join('');
        const pide = ['GA', 'GR(x)', 'GR(y)'][s % 3];
        let bien, ds;
        if (pide === 'GA') {
          bien = GA;
          ds = [{ id: 'rel', v: Math.max(GRx, GRy), error: 'PO10', siFuera: 'Ese es un grado relativo. El absoluto suma los exponentes dentro de cada término.' },
            { id: 'todos', v: todos, error: 'PO11', siFuera: 'Eso suma los exponentes de todos los términos juntos.' },
            { id: 'sumarel', v: GRx + GRy, error: 'PO28', siFuera: 'Eso suma los grados relativos, que salen de términos distintos.' },
            { id: 'n', v: 3, error: 'PO9', siFuera: 'Eso cuenta los términos; el grado mira los exponentes.' }];
        } else {
          const enX = pide === 'GR(x)';
          bien = enX ? GRx : GRy;
          ds = [{ id: 'ga', v: GA, error: 'TAL-GA-GR', siFuera: 'Ese es el grado absoluto. El relativo mira solo una letra.' },
            { id: 'otra', v: enX ? GRy : GRx, error: 'TAL-LETRA', siFuera: `Ese es el mayor exponente de ${enX ? 'y' : 'x'}.` },
            { id: 'suma', v: enX ? sx : ts.reduce((a, t) => a + t[2], 0), error: 'PO11', siFuera: 'Eso suma los exponentes de esa letra; el grado relativo es el mayor.' }];
        }
        return {
          pregunta: `¿Cuál es ${pide === 'GA' ? 'el grado absoluto' : `el grado relativo a ${pide[3]}`} de ${texto}?`,
          opciones: distintas([{ id: 'c', texto: f(bien), correcta: true }, ...ds.map(d => ({ id: d.id, texto: f(d.v), error: d.error, siFuera: d.siFuera }))]).slice(0, 4),
          solucion: {
            texto: pide === 'GA' ? `Grados de los términos: ${gr.join(', ')}. El mayor es ${GA}.` : `Exponentes de ${pide[3]}: ${ts.map(t => (pide === 'GR(x)' ? t[1] : t[2])).join(', ')}. El mayor es ${bien}.`,
            ecuacion: [`${pide} = ${bien}`],
            dibujo: { datos: tablaGrados(ts), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: evaluar es reemplazar en cada x ----------
  // Cambia: el valor de x · Permanece: la curva de P · Progresa: el punto (a; P(a)) y su altura · Se reserva:
  // x = 1 y x = 0 como valores especiales · Debe verse: P(a) es una altura de la curva, no un coeficiente.
  const muestra = (cs, a, b) => Array.from({ length: Math.round((b - a) * 10) + 1 }, (_, k) => { const t = a + k / 10; return [Math.round(t * 10) / 10, evaluar(cs, t)]; });
  const rango = (cs, a, b, extra = []) => {
    const ys = [...muestra(cs, a, b).map(p => p[1]), ...extra, 0];
    const paso = Math.max(...ys.map(Math.abs)) > 40 ? 20 : 10;
    return { min: Math.floor(Math.min(...ys) / paso) * paso, max: Math.ceil(Math.max(...ys) / paso) * paso, paso };
  };
  const curvaP = (cs, a, b, puntos, rot) => {
    const rg = rango(cs, a, b);
    return {
      x: { min: a, max: b, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: rg.min, max: rg.max, paso: rg.paso, nombre: 'P(x)', decimales: 0, color: 'd' },
      curvas: [{ puntos: muestra(cs, a, b), color: 'o', rotulo: rot }],
      puntos, alt: `Gráfica de P(x) = ${poli(cs)}${puntos.length ? ': ' + puntos.filter(p => p.rotulo).map(p => p.rotulo).join('; ') : ''}`,
    };
  };
  const J2 = [1, 0, -3, 1];          // x³ − 3x + 1
  const PRED2 = [2, -1, 3, -5];      // 2x³ − x² + 3x − 5
  const valor = {
    id: 'valor-numerico',
    titulo: 'Evaluar es reemplazar cada x',
    temas: ['Valor numérico'],
    pieza: 'ejes',
    juega: {
      consigna: 'P(x) = x³ − 3x + 1. Elige un valor de x: el punto marca su altura, que es P(x).',
      voz: 'Prueba también valores negativos de x.',
      controles: [{ id: 'a', etiqueta: 'x', min: -2, max: 2, paso: 1, inicio: 0, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: curvaP(J2, -2, 2, [{ x: val.a, y: evaluar(J2, val.a), color: 'd', guias: true, rotulo: `P(${f(val.a)}) = ${f(evaluar(J2, val.a))}` }], 'P'), estado: {} }),
      lectura: val => [P, `(${f(val.a)}) = ${f(evaluar(J2, val.a))}`],
      minimo: 3,
    },
    predice: (() => {
      const v1 = evaluar(PRED2, 1), sinSigno = PRED2.reduce((s, c) => s + Math.abs(c), 0);
      return {
        pregunta: ['Si ', P, '(x) = 2x³ − x² + 3x − 5, ¿cuánto vale ', P, '(1)?'],
        opciones: [
          { id: 'c', texto: f(v1), correcta: true },
          { id: 'indep', texto: f(PRED2[3]), error: 'PO12', siFuera: '−5 es P(0), el término independiente. Con x = 1 cuentan todos los coeficientes.' },
          { id: 'abs', texto: f(sinSigno), error: 'PO21', siFuera: `${sinSigno} suma los coeficientes sin sus signos; −x² y −5 restan.` },
          { id: 'principal', texto: f(PRED2[0]), error: 'PO20', siFuera: '2 es el coeficiente principal; P(1) suma todos los coeficientes.' },
        ],
        dibujo: { datos: curvaP(PRED2, -2, 2, [], 'P'), estado: {} },
        revelar: { datos: curvaP(PRED2, -2, 2, [{ x: 1, y: v1, color: 'd', guias: true, rotulo: `P(1) = ${f(v1)}` }], 'P'), estado: {} },
        coincide: `Coincide: con x = 1 cada potencia vale 1, y queda 2 − 1 + 3 − 5 = ${f(v1)}.`,
      };
    })(),
    mira: {
      datos: curvaP(PRED2, -1, 2, [
        { x: 0, y: evaluar(PRED2, 0), color: 'd', rotulo: f(evaluar(PRED2, 0)), desde: 1 },
        { x: 1, y: evaluar(PRED2, 1), color: 'd', rotulo: f(evaluar(PRED2, 1)), guias: true, desde: 2 },
        { x: -1, y: evaluar(PRED2, -1), color: 'h', rotulo: f(evaluar(PRED2, -1)), guias: true, desde: 3 },
      ], 'P'),
      pasos: [
        { estado: { corte: 1 }, texto: 'Con x = 0 se anulan todos los términos con x.', ecuacion: [P, `(0) = ${f(evaluar(PRED2, 0))}`] },
        { estado: { corte: 2 }, texto: 'Con x = 1 cada potencia vale 1: queda la suma de coeficientes.', ecuacion: [P, `(1) = 2 − 1 + 3 − 5 = ${f(evaluar(PRED2, 1))}`] },
        { estado: { corte: 3 }, texto: 'Con x = −1, las potencias impares cambian de signo y las pares no.', ecuacion: [P, `(−1) = 2(−1) − 1 + 3(−1) − 5 = ${f(evaluar(PRED2, -1))}`] },
      ],
    },
    regla: {
      texto: 'Evaluar es reemplazar x por el número en cada término y operar. P(1) es la suma de los coeficientes y P(0), el término independiente.',
      ecuacion: [P, '(1) = suma de los coeficientes'],
      condicion: 'se respeta cada signo y cada potencia: (−2)² = 4, pero (−2)³ = −8.',
    },
    ahoraTu: {
      pieza: 'ejes',
      generar(s) {
        const r = azar(s);
        const cs = [r.noCero(-3, 3), r.ent(-4, 4), r.ent(-4, 4), r.ent(-6, 6)];
        const a = [-2, -1, 2, 1, 0][s % 5];
        const bien = evaluar(cs, a);
        // (−a)ⁿ par leído como negativo: cada potencia par de un negativo cambia de signo.
        const malPar = a < 0 ? cs.reduce((acc, c, k) => { const e = 3 - k; const p = e % 2 === 0 && e > 0 ? -Math.pow(-a, e) : Math.pow(a, e); return acc + c * p; }, 0) : NaN;
        const ds = [
          { id: 'par', v: malPar, error: 'PO15', siFuera: 'Una potencia par de un negativo es positiva: (−2)² = 4.' },
          { id: 'menos', v: evaluar(cs, -a), error: 'TAL-SIGNO-X', siFuera: `Ese es P(${f(-a)}): el valor se reemplaza con su signo.` },
          { id: 'suma', v: evaluar(cs, 1), error: 'PO7', siFuera: 'Esa es la suma de coeficientes, P(1).' },
          { id: 'indep', v: cs[3], error: 'PO12', siFuera: 'Ese es el término independiente, P(0).' },
          { id: 'princ', v: cs[0] * a, error: 'TAL-PRINCIPAL', siFuera: 'Eso usa solo el primer coeficiente; cada término aporta.' },
        ].filter(d => Number.isFinite(d.v) && d.v !== bien);
        return {
          pregunta: ['Si ', P, `(x) = ${poli(cs)}, ¿cuánto vale `, P, `(${f(a)})?`],
          opciones: distintas([{ id: 'c', texto: f(bien), correcta: true }, ...ds.map(d => ({ id: d.id, texto: f(d.v), error: d.error, siFuera: d.siFuera }))]).slice(0, 4),
          solucion: {
            texto: `Se reemplaza x por ${f(a)} en cada término.`,
            ecuacion: [P, `(${f(a)}) = ${f(bien)}`],
            dibujo: { datos: curvaP(cs, -2, 2, [{ x: a, y: bien, color: 'd', guias: true, rotulo: `P(${f(a)}) = ${f(bien)}` }], 'P'), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 3: una casilla por potencia ----------
  // Cambia: el polinomio · Permanece: las casillas de x⁵ a x⁰ · Progresa: los ceros que llenan las casillas vacías
  // · Se reserva: el conteo n + 1 · Debe verse: completo significa ninguna casilla vacía, el cero también cuenta.
  const POT = [5, 4, 3, 2, 1, 0];
  const POLS = {
    'x⁴ − 3x² + 1': [[1, 4], [-3, 2], [1, 0]],
    '2x³ + x² − x + 4': [[2, 3], [1, 2], [-1, 1], [4, 0]],
    '5 − x + x³': [[5, 0], [-1, 1], [1, 3]],
    'x² + 3x⁴ − 1': [[1, 2], [3, 4], [-1, 0]],
  };
  const ordenado = ts => { const e = ts.map(t => t[1]); return e.every((v, i) => !i || v < e[i - 1]) || e.every((v, i) => !i || v > e[i - 1]); };
  const tablaCasillas = (ts, { ceros = true, desdeCeros = 0, conOrden = true } = {}) => {
    const grado = Math.max(...ts.map(t => t[1]));
    const cols = POT.filter(e => e <= Math.max(grado, 0));
    const fila = cols.map(e => { const i = ts.findIndex(t => t[1] === e); return i >= 0 ? { t: f(ts[i][0]), color: 'o', fuerte: true } : (ceros ? { t: '0', color: 'h', hueco: true, desde: desdeCeros } : ''); });
    const orden = cols.map(e => { const i = ts.findIndex(t => t[1] === e); return i >= 0 ? `${i + 1}.º` : ''; });
    return {
      columnas: cols.map(e => (e === 0 ? 'x⁰' : pot('x', e) === 'x' ? 'x¹' : pot('x', e))),
      rotulosFila: conOrden ? ['coef.', 'escrito'] : ['coef.'],
      filas: conOrden ? [fila, orden] : [fila],
      alt: `Casillas de las potencias de x, de x${sup(grado)} a x⁰, con los coeficientes; las vacías llevan 0`,
    };
  };
  const especiales = {
    id: 'completo-ordenado',
    titulo: 'Una casilla por cada potencia',
    temas: ['Polinomios especiales'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Elige un polinomio. Arriba va cada coeficiente en la casilla de su potencia; abajo, en qué orden se escribió cada término.',
      voz: 'Fíjate en las casillas que quedan con cero.',
      controles: [{ id: 'p', etiqueta: 'Polinomio', opciones: Object.keys(POLS).map(t => ({ valor: t, texto: t })) }],
      dibujo: val => ({ datos: tablaCasillas(POLS[val.p]), estado: {} }),
      lectura: val => {
        const ts = POLS[val.p], g = Math.max(...ts.map(t => t[1])), faltan = g + 1 - ts.length;
        return [`Completo: ${faltan ? `no, faltan ${faltan}` : 'sí'} · ordenado: ${ordenado(ts) ? 'sí' : 'no'}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Si x⁵ − 3x² + 1 se escribe completo y ordenado, ¿cuántos términos tiene?',
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'sin-ceros', texto: '3', error: 'PO1', siFuera: '3 son los términos escritos. Completo pide también los de coeficiente 0.' },
        { id: 'sin-x0', texto: '5', error: 'PO9', siFuera: '5 serían de x⁵ a x¹. Falta la casilla de x⁰, el término independiente.' },
        { id: 'cuatro', texto: '4', error: 'TAL-COMPLETO', siFuera: 'Completar no es agregar uno: van todas las potencias de x⁵ a x⁰.' },
      ],
      dibujo: { datos: tablaCasillas([[1, 5], [-3, 2], [1, 0]], { ceros: false, conOrden: false }), estado: {} },
      revelar: { datos: tablaCasillas([[1, 5], [-3, 2], [1, 0]], { conOrden: false }), estado: {} },
      coincide: 'Coincide: de x⁵ a x⁰ hay 6 casillas; tres llevan 0.',
    },
    mira: {
      datos: tablaCasillas([[1, 5], [-3, 2], [1, 0]], { desdeCeros: 2, conOrden: false }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada coeficiente va en la casilla de su potencia.', ecuacion: ['x⁵ − 3x² + 1'] },
        { estado: { corte: 2 }, texto: 'Las potencias que no aparecen llevan coeficiente 0.', ecuacion: ['x⁵ + 0x⁴ + 0x³ − 3x² + 0x + 1'] },
        { estado: { corte: 2 }, texto: 'De x⁵ a x⁰ hay 5 + 1 = 6 casillas: 6 términos.', ecuacion: ['grado 5 → 6 términos'] },
      ],
    },
    regla: {
      texto: 'Completo: tiene todas las potencias, del grado hasta x⁰. Ordenado: los exponentes solo bajan o solo suben. Homogéneo: todos sus términos tienen el mismo grado.',
      ecuacion: ['grado n → n + 1 casillas'],
      condicion: 'las casillas de coeficiente 0 cuentan al completar; la homogeneidad mira el grado de cada término no nulo.',
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const n = r.ent(3, 8), m = r.ent(2, Math.min(4, n));
          return {
            pregunta: `Un polinomio de grado ${n} tiene ${m} términos escritos. Si se completa, ¿cuántos términos tendrá?`,
            opciones: distintas([
              { id: 'c', texto: f(n + 1), correcta: true },
              { id: 'n', texto: f(n), error: 'PO9', siFuera: `Eso olvida la casilla de x⁰: de x${sup(n)} a x⁰ hay ${n + 1}.` },
              { id: 'm', texto: f(m), error: 'PO1', siFuera: 'Esos son los términos escritos; completar agrega los de coeficiente 0.' },
              { id: 'falta', texto: f(n + 1 - m), error: 'TAL-COMPLETO', siFuera: 'Esos son los términos que faltan, no el total.' },
            ]),
            solucion: { texto: `Hay una casilla por cada potencia, de x${sup(n)} a x⁰.`, ecuacion: [`${n} + 1 = ${n + 1}`] },
          };
        }
        // Homogéneo: halla m para que los tres términos tengan el mismo grado.
        let g, a1, b1, a2, b2, a3, b3;
        do { g = r.ent(5, 9); a2 = r.ent(1, g - 1); b2 = g - a2; a3 = r.ent(0, g); b3 = g - a3; b1 = r.ent(1, g - 1); a1 = g - b1; } while (a2 === a3 || a1 === a2 || a1 === a3);
        const t2 = mono(r.noCero(-5, 5), [['x', a2], ['y', b2]], false), t3 = mono(r.noCero(-5, 5), [['x', a3], ['y', b3]], false);
        return {
          pregunta: `¿Qué valor de m hace homogéneo a 2xᵐ${pot('y', b1)}${t2}${t3}?`,
          opciones: distintas([
            { id: 'c', texto: f(a1), correcta: true },
            { id: 'g', texto: f(g), error: 'TAL-HOMOG', siFuera: `${g} es el grado común; m es el exponente que lo completa.` },
            { id: 'igual', texto: f(a2), error: 'TAL-HOMOG-EXP', siFuera: 'Homogéneo no pide exponentes iguales, sino grados iguales.' },
            { id: 'suma', texto: f(g + b1), error: 'TAL-HOMOG-SIGNO', siFuera: `Eso suma ${b1}; hay que restarlo del grado común.` },
          ]),
          solucion: { texto: `Los otros términos tienen grado ${g}; m + ${b1} = ${g}.`, ecuacion: [`m = ${g} − ${b1} = ${a1}`] },
        };
      },
    },
  };

  // ---------- Idea 4: iguales casilla por casilla ----------
  // Cambia: los coeficientes a y b · Permanece: Q y el término independiente · Progresa: las casillas que
  // coinciden · Se reserva: el punto donde dos polinomios distintos valen igual · Debe verse: igualdad = cada casilla.
  const Qcs = [2, 5, 3];
  const tablaIgualdad = (pc, qc, marcar = true) => ({
    columnas: ['x²', 'x¹', 'x⁰'], rotulosFila: ['P', 'Q'], colorFila: ['o', 'i'],
    filas: [pc.map((c, k) => ({ t: f(c), color: 'o', fuerte: true, marca: marcar ? (c === qc[k] ? 'ok' : 'no') : undefined })), qc.map(c => ({ t: f(c), color: 'i', fuerte: true }))],
    resaltes: marcar ? pc.map((c, k) => (c === qc[k] ? { f: 0, c: k, alto: 2, color: 'd' } : null)).filter(Boolean) : [],
    alt: 'Coeficientes de P y de Q, casilla por casilla',
  });
  const dosCurvas = (cp, cq, puntos, extra = {}) => ({
    x: { min: -1, max: 3, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
    y: { min: -2, max: 10, paso: 2, nombre: 'y', decimales: 0 },
    curvas: [{ puntos: muestra(cp, -1, 3), color: 'o', rotulo: 'P', en: [2.6, evaluar(cp, 2.6)] }, { puntos: muestra(cq, -1, 3), color: 'i', rotulo: 'Q', en: [2.6, evaluar(cq, 2.6)] }],
    puntos, alt: 'P(x) = x² + 1 y Q(x) = 2x: se tocan en x = 1 y se separan en los demás valores', ...extra,
  });
  const igualdad = {
    id: 'igualdad',
    titulo: 'Iguales casilla por casilla',
    temas: ['Igualdad de polinomios'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'P = ax² + (b − 1)x + 3 y Q = 2x² + 5x + 3. Ajusta a y b hasta que P y Q coincidan en todas las casillas.',
      voz: 'Una casilla a la vez. Las demás no se mueven.',
      controles: [
        { id: 'a', etiqueta: 'a', min: -2, max: 5, paso: 1, inicio: 0, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: -2, max: 8, paso: 1, inicio: 0, decimales: 0, color: 'c-o' },
      ],
      dibujo: val => ({ datos: tablaIgualdad([val.a, val.b - 1, 3], Qcs), estado: {} }),
      lectura: val => {
        const k = [val.a, val.b - 1, 3].filter((c, i) => c === Qcs[i]).length;
        return [`Coinciden ${k} de 3 casillas${k === 3 ? ': P ≡ Q' : ''}`];
      },
      minimo: 3,
    },
    predice: {
      pieza: 'ejes',
      pregunta: ['', P, '(x) = x² + 1 y ', Q, '(x) = 2x valen 2 cuando x = 1. ¿Son el mismo polinomio?'],
      opciones: [
        { id: 'c', texto: 'No: sus coeficientes son distintos', correcta: true },
        { id: 'un-valor', texto: 'Sí: valen lo mismo en x = 1', error: 'TAL-UNVALOR', siFuera: 'Coinciden en x = 1, pero con x = 0 valen 1 y 0.' },
        { id: 'grado', texto: 'No se sabe sin conocer más valores', error: 'TAL-COEF', siFuera: 'Los coeficientes ya deciden: x² + 0x + 1 frente a 0x² + 2x + 0.' },
      ],
      dibujo: { datos: dosCurvas([1, 0, 1], [2, 0], [{ x: 1, y: 2, color: 'd', rotulo: '(1; 2)' }]), estado: {} },
      revelar: { datos: dosCurvas([1, 0, 1], [2, 0], [{ x: 1, y: 2, color: 'd', rotulo: '(1; 2)' }, { x: 0, y: 1, color: 'o' }, { x: 0, y: 0, color: 'i' }]), estado: {} },
      coincide: 'Coincide: se tocan en x = 1 y se separan en los demás valores.',
    },
    mira: {
      pieza: 'ejes',
      datos: dosCurvas([1, 0, 1], [2, 0], [
        { x: 1, y: 2, color: 'd', rotulo: '(1; 2)', desde: 1 },
        { x: 0, y: 1, color: 'o', desde: 2 }, { x: 0, y: 0, color: 'i', desde: 2 },
        { x: 2, y: 5, color: 'o', desde: 3 }, { x: 2, y: 4, color: 'i', desde: 3 },
      ]),
      pasos: [
        { estado: { corte: 1 }, texto: 'En x = 1 las dos curvas pasan por el mismo punto.', ecuacion: [P, '(1) = 2 = ', Q, '(1)'] },
        { estado: { corte: 2 }, texto: 'En x = 0 ya no: P vale 1 y Q vale 0.', ecuacion: [P, '(0) = 1 ≠ 0 = ', Q, '(0)'] },
        { estado: { corte: 3 }, texto: 'En x = 2 tampoco. Un punto común no las hace iguales.', ecuacion: [P, '(2) = 5 ≠ 4 = ', Q, '(2)'] },
        { estado: { corte: 3 }, texto: 'Casilla por casilla: 1 ≠ 0 en x², 0 ≠ 2 en x.', ecuacion: ['x² + 0x + 1  ≢  0x² + 2x + 0'] },
      ],
    },
    regla: {
      texto: 'Dos polinomios son idénticos si tienen el mismo coeficiente en cada potencia: a = m, b = n y c = p. Entonces valen lo mismo para todo x.',
      ecuacion: ['ax² + bx + c ≡ mx² + nx + p'],
      condicion: 'coincidir en uno o en dos valores de x no basta; los coeficientes deben ser iguales en todas las casillas.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const p = r.ent(1, 5), q = r.ent(1, 5), A = r.noCero(-4, 6), B = r.noCero(-4, 8), c = r.noCero(-5, 5);
        // P = (m − p)x² + (n + q)x + c ≡ Q = A x² + B x + c → m = A + p, n = B − q.
        const m = A + p, n = B - q, pide = s % 2 ? 'm + n' : 'm · n';
        const val = (mm, nn) => (pide === 'm + n' ? mm + nn : mm * nn);
        return {
          pregunta: [P, `(x) = (m − ${p})x² + (n + ${q})x ${c < 0 ? '−' : '+'} ${Math.abs(c)} y `, Q, `(x) = ${poli([A, B, c])} son idénticos. ¿Cuánto vale ${pide}?`],
          opciones: distintas([
            { id: 'c', texto: f(val(m, n)), correcta: true },
            { id: 'signos', texto: f(val(A - p, B + q)), error: 'AL16', siFuera: `Al despejar m, el ${p} pasa sumando: m = ${A} + ${p}.` },
            { id: 'solo-m', texto: f(val(m, B)), error: 'TAL-COEF', siFuera: `n + ${q} es el coeficiente; n vale ${B} − ${q}.` },
            { id: 'coef', texto: f(val(A, B)), error: 'TAL-COEF', siFuera: 'Esos son los coeficientes de Q, no los valores de m y n.' },
            { id: 'solo-n', texto: f(val(A, n)), error: 'TAL-COEF', siFuera: `m − ${p} es el coeficiente; m vale ${A} + ${p}.` },
          ]).slice(0, 4),
          solucion: { texto: 'Se iguala cada casilla: la de x² y la de x.', ecuacion: [`m − ${p} = ${f(A)} → m = ${f(m)}   ·   n + ${q} = ${f(B)} → n = ${f(n)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: cada término por cada término ----------
  // Cambia: a en P = x + a y b en Q = x² + bx + 2 · Permanece: la cuadrícula 2 × 3 · Progresa: los productos que
  // se llenan · Se reserva: las dos casillas que dan x² · Debe verse: los semejantes salen de casillas distintas.
  const tablaProducto = (pc, qc, cortes = {}) => {
    const pt = pc.map((c, i) => [c, pc.length - 1 - i]), qt = qc.map((c, j) => [c, qc.length - 1 - j]);
    const term = ([c, e], primero = true) => mono(c, [['x', e]], primero) || f(c);
    return {
      columnas: qt.map(t => term(t)), colorCol: qt.map(() => 'i'),
      rotulosFila: pt.map(t => term(t)), colorFila: pt.map(() => 'o'),
      filas: pt.map(([a, e], i) => qt.map(([b, g]) => ({ t: a * b === 0 ? '0' : term([a * b, e + g]), desde: cortes[`f${i}`] || 0 }))),
      resaltes: (cortes.resaltar || []).map(([fi, cj]) => ({ f: fi, c: cj, color: 'd', desde: cortes.desdeR || 0 })),
      alt: `Cuadrícula del producto (${poli(pc)})(${poli(qc)}): cada término de P por cada término de Q`,
    };
  };
  const operaciones = {
    id: 'operaciones',
    titulo: 'Cada término por cada término',
    temas: ['Operaciones con polinomios'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'P = x + a y Q = x² + bx + 2. Cada casilla multiplica un término de P (fila) por uno de Q (columna). Cambia a y b.',
      voz: 'Busca las casillas con la misma potencia de x.',
      controles: [
        { id: 'a', etiqueta: 'a', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      ],
      dibujo: val => ({ datos: tablaProducto([1, val.a], [1, val.b, 2]), estado: {} }),
      lectura: val => [P, '·', Q, ` = ${poli(multiplicar([1, val.a], [1, val.b, 2]))}`],
      minimo: 3,
    },
    predice: (() => {
      const pc = [1, 2], qc = [1, -3, 1], prod = multiplicar(pc, qc);
      return {
        pregunta: '¿Cuál es el coeficiente de x² en (x + 2)(x² − 3x + 1)?',
        opciones: [
          { id: 'c', texto: f(prod[1]), correcta: true },
          { id: 'una', texto: '−3', error: 'TAL-SEMEJANTE', siFuera: '−3 sale de x · (−3x). También 2 · x² da x²: hay dos casillas.' },
          { id: 'otra', texto: '2', error: 'TAL-SEMEJANTE', siFuera: '2 sale de 2 · x². Falta x · (−3x), que también da x².' },
          { id: 'coef', texto: '−6', error: 'TAL-COEF-MULT', siFuera: '−6 multiplica 2 por −3, que da un término en x, no en x².' },
        ],
        dibujo: { datos: tablaProducto(pc, qc, { f0: 1, f1: 1 }), estado: { corte: 0 } },
        revelar: { datos: tablaProducto(pc, qc, { resaltar: [[0, 1], [1, 0]] }), estado: {} },
        coincide: `Coincide: x · (−3x) = −3x² y 2 · x² = 2x²; juntos, ${f(prod[1])}x².`,
      };
    })(),
    mira: (() => {
      const pc = [1, 2], qc = [1, -3, 1], prod = multiplicar(pc, qc);
      return {
        datos: tablaProducto(pc, qc, { f0: 1, f1: 2, resaltar: [[0, 1], [1, 0]], desdeR: 3 }),
        pasos: [
          { estado: { corte: 1 }, texto: 'x multiplica a cada término de Q.', ecuacion: ['x³ − 3x² + x'] },
          { estado: { corte: 2 }, texto: '2 multiplica a cada término de Q.', ecuacion: ['2x² − 6x + 2'] },
          { estado: { corte: 3 }, texto: 'Las casillas con x² son semejantes: se suman sus coeficientes.', ecuacion: ['−3x² + 2x² = −x²'] },
          { estado: { corte: 3 }, texto: 'Grado 1 por grado 2 da grado 3.', ecuacion: [`${poli(prod)}`] },
        ],
      };
    })(),
    regla: {
      texto: 'Multiplicar es multiplicar cada término por cada término y luego juntar los semejantes. Sumar solo junta términos con la misma parte literal.',
      ecuacion: ['grado(', P, '·', Q, ') = grado ', P, ' + grado ', Q],
      condicion: 'solo se suman coeficientes de términos semejantes; al juntarlos algún término puede cancelarse.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const m = r.ent(2, 6), n = r.ent(1, 5);
          return {
            pregunta: `P tiene grado ${m} y Q tiene grado ${n}. ¿Qué grado tiene P · Q?`,
            opciones: distintas([
              { id: 'c', texto: f(m + n), correcta: true },
              { id: 'mult', texto: f(m * n), error: 'PO5', siFuera: 'Los grados no se multiplican: xᵐ · xⁿ = xᵐ⁺ⁿ.' },
              { id: 'max', texto: f(Math.max(m, n)), error: 'PO23', siFuera: 'Ese es el grado de P + Q (si no se cancela); el producto suma grados.' },
              { id: 'dif', texto: f(Math.abs(m - n)), error: 'TAL-GRADO-RESTA', siFuera: 'Restar grados corresponde a dividir, no a multiplicar.' },
            ]),
            solucion: { texto: 'El término de mayor grado sale de multiplicar los dos principales.', ecuacion: [`${m} + ${n} = ${m + n}`] },
          };
        }
        const a = r.noCero(-4, 4), b = r.noCero(-4, 4), c = r.noCero(-5, 5);
        const prod = multiplicar([1, a], [1, b, c]);
        const enX2 = s % 3 === 0;
        const bien = enX2 ? prod[1] : prod[2];
        const ds = enX2
          ? [{ id: 'una', v: b, siFuera: `Falta ${f(a)} · x², que también da x².` }, { id: 'otra', v: a, siFuera: `Falta x · (${f(b)}x), que también da x².` }, { id: 'mult', v: a * b, siFuera: `${f(a)} · ${par(b)} da un término en x, no en x².` }]
          : [{ id: 'una', v: c, siFuera: `Falta ${f(a)} · ${par(b)}x, que también da x.` }, { id: 'otra', v: a * b, siFuera: `Falta x · ${par(c)}, que también da x.` }, { id: 'mult', v: a * c, siFuera: `${f(a)} · ${par(c)} da el término independiente.` }];
        return {
          pregunta: `¿Cuál es el coeficiente de ${enX2 ? 'x²' : 'x'} en (${poli([1, a])})(${poli([1, b, c])})?`,
          opciones: distintas([{ id: 'c', texto: f(bien), correcta: true }, ...ds.map(d => ({ id: d.id, texto: f(d.v), error: d.id === 'mult' ? 'TAL-COEF-MULT' : 'TAL-SEMEJANTE', siFuera: d.siFuera }))]),
          solucion: {
            texto: `Dos casillas dan ${enX2 ? 'x²' : 'x'}; se suman.`,
            ecuacion: [enX2 ? `${f(b)} + ${par(a)} = ${f(bien)}` : `${f(c)} + ${f(a)} · ${par(b)} = ${f(bien)}`],
            dibujo: { datos: tablaProducto([1, a], [1, b, c], { resaltar: enX2 ? [[0, 1], [1, 0]] : [[0, 2], [1, 1]] }), estado: {} },
          },
        };
      },
    },
  };

  return {
    unidad: 'algebra.polinomios',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'En 1591, François Viète defendió usar letras para las cantidades conocidas y para las desconocidas. No era todavía nuestra escritura de polinomios, pero permitió razonar sobre familias enteras de problemas y no solo sobre ejemplos con números. Esa es la idea de esta unidad: coeficientes, exponentes y variables cumplen papeles distintos, y operar debe conservar el valor de la expresión.',
      pregunta: '¿Qué ganas al escribir una letra en vez de un número?',
      fuente: { titulo: 'O’Connor y Robertson, François Viète — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Viete/' },
    },
    ideas: [grados, valor, especiales, igualdad, operaciones],
  };
});
