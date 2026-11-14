/*
 * Teoría de «Exponentes, radicales y productos notables» (algebra.exponentes-y-productos-notables). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 3), expediente teoria-152-unidades (Álgebra y sus
 * precisiones: la figura de áreas ilustra lados positivos; la identidad vale por distributividad) e
 * historia-ecuaciones (pp. 57–68). Errores: AL8, AL9 y AL11 de docs/investigacion/algebra-funciones-ideas-erroneas.md;
 * los TAL-* son hipótesis de diseño (rutinas/teoria-algebra.md).
 * Colores (regla 4): a y el exponente m naranja (c-o), b y el exponente n turquesa (c-i), lo que se suma o resulta
 * verde (c-d), lo que falta o el contraejemplo rojo (c-h).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · transformar potencias y radicales sin perder sus condiciones, y reconocer los productos notables.
 * Persona y condiciones · 3.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · simplifica aᵐ·aⁿ, √(x²), (a + b)², √(A ± 2√B) y racionaliza un denominador.
 * Orden de atención · 1.º la figura (tabla, cuadrado de piezas, gráfica) · 2.º la pieza o fila que cambia · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué (a + b)² no es a² + b² y √(a + b) no es √a + √b.
 *
 * Ronda 2 (14 nov 2026): gesto directo en «El cuadrado de una suma» (las esquinas de a² y del cuadrado, con la escala
 * fija de alg-baldosas), llaves en las reglas y en «Mira», separador «   ·   » y laboratorio de tres mesas: el
 * rectángulo (x + p)(x + q) con dos esquinas, índice par contra impar con el punto que se arrastra hasta los negativos y
 * la tabla de exponentes con signo. Las ideas 1, 2, 4 y 5 juegan con tablas: no hay figura que agarrar (sus filas se
 * reacomodan con el valor) y se quedan con − y +.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const a = { v: 'c-o', t: 'a' }, b = { v: 'c-i', t: 'b' }, m = { v: 'c-o', t: 'm' }, n = { v: 'c-i', t: 'n' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    return r;
  }
  // Opciones distintas por su texto: la correcta primero; un distractor que repite un texto se descarta.
  function distintas(ops, max = 4) {
    const vistos = new Set(), out = [];
    for (const o of ops) { if (!o) continue; const t = JSON.stringify(o.texto); if (vistos.has(t) || /NaN|undefined/.test(t)) continue; vistos.add(t); out.push(o); }
    return out.slice(0, max);
  }
  // Exponente entero en superíndice Unicode: 2 → «²», −3 → «⁻³».
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const sup = e => String(e).split('').map(c => SUP[c] || c).join('');
  const pot = (base, e) => `${base}${sup(e)}`;
  const mcd = (x, y) => { x = Math.abs(x); y = Math.abs(y); while (y) [x, y] = [y, x % y]; return x; };
  // Valor exacto de bᵉ como texto: entero o fracción 1/bᵏ.
  const valorPot = (base, e) => (e >= 0 ? f(base ** e, 0) : `1/${f(base ** -e, 0)}`);
  // √k escrito sin raíz si k es un cuadrado perfecto.
  const esCuad = k => Number.isInteger(Math.sqrt(k));
  const rz = k => (esCuad(k) ? String(Math.sqrt(k)) : `√${k}`);

  const BALD = () => Kit.piezas['alg-baldosas'], EJES = () => Kit.piezas.ejes;
  const inversa = (escala, p, q) => px => p + (px - escala(p)) * (q - p) / (escala(q) - escala(p));

  // ---------- Idea 1: los exponentes cuentan factores ----------
  // Cambia: la base y los dos exponentes · Permanece: la tabla «expresión, factores, valor» · Progresa: los
  // factores que se juntan · Se reserva: el exponente negativo, que no cuenta factores sino divisiones
  // · Debe verse: juntar m factores con n factores da m + n factores.
  const factores = (base, e) => (e === 0 ? 'ninguno' : Array(e).fill(base).join('·'));
  const leyes = {
    id: 'leyes-exponentes',
    titulo: 'El exponente cuenta factores',
    temas: ['Leyes de exponentes'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Elige la base y dos exponentes. La tabla escribe cada potencia como factores y junta los dos productos.',
      voz: 'Cuenta los factores de la última fila.',
      controles: [
        { id: 'a', etiqueta: 'Base', min: 2, max: 5, paso: 1, inicio: 2, decimales: 0 },
        { id: 'm', etiqueta: 'm', min: 0, max: 4, paso: 1, inicio: 3, decimales: 0, color: 'c-o' },
        { id: 'n', etiqueta: 'n', min: 0, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({
        datos: {
          columnas: ['potencia', 'factores', 'valor'],
          filas: [
            [{ t: pot(v.a, v.m), color: 'o', fuerte: true }, factores(v.a, v.m), f(v.a ** v.m, 0)],
            [{ t: pot(v.a, v.n), color: 'i', fuerte: true }, factores(v.a, v.n), f(v.a ** v.n, 0)],
            [{ t: `${pot(v.a, v.m)} · ${pot(v.a, v.n)}`, fuerte: true }, factores(v.a, v.m + v.n), f(v.a ** (v.m + v.n), 0)],
            [{ t: pot(v.a, v.m + v.n), color: 'd', fuerte: true }, `${v.m} + ${v.n} factores`, { t: f(v.a ** (v.m + v.n), 0), color: 'd', fuerte: true }],
          ],
          alt: `${v.a} elevado a ${v.m} por ${v.a} elevado a ${v.n} junta ${v.m + v.n} factores`,
        }, estado: {},
      }),
      lectura: v => [`${pot(v.a, v.m)} · ${pot(v.a, v.n)} = ${pot(v.a, v.m + v.n)} = ${f(v.a ** (v.m + v.n), 0)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Si aᵐ · aⁿ = aᵐ⁺ⁿ debe valer también con exponentes negativos, ¿cuánto vale 2⁻³?'],
      opciones: [
        { id: 'c', texto: [{ frac: ['1', '8'] }], correcta: true },
        { id: 'negativo', texto: '−8', error: 'TAL-EXP-NEG', siFuera: '−8 es −(2³). El exponente negativo no cambia el signo: indica dividir.' },
        { id: 'por', texto: '−6', error: 'TAL-EXP-POR', siFuera: '−6 es 2 · (−3). Una potencia no multiplica la base por el exponente.' },
        { id: 'sexto', texto: [{ frac: ['1', '6'] }], error: 'TAL-EXP-POR', siFuera: '1/6 divide entre 2 · 3. Hay que dividir entre 2 · 2 · 2.' },
      ],
      dibujo: { datos: { columnas: ['potencia', 'valor'], filas: [['2³', '8'], ['2²', '4'], ['2¹', '2'], ['2⁰', { t: '1', desde: 1 }], ['2⁻¹', { t: '1/2', desde: 1 }], ['2⁻³', { t: '?', fuerte: true }]], alt: 'Potencias de 2 desde el cubo hacia abajo' }, estado: {} },
      revelar: { datos: { columnas: ['potencia', 'valor'], filas: [['2³', '8'], ['2²', '4'], ['2¹', '2'], ['2⁰', '1'], ['2⁻¹', '1/2'], [{ t: '2⁻³', color: 'd', fuerte: true }, { t: '1/8', color: 'd', fuerte: true }]], alt: 'Cada vez que el exponente baja 1, el valor se divide entre 2: 2 elevado a −3 es 1/8' }, estado: {} },
      coincide: 'Coincide: 2³ · 2⁻³ = 2⁰ = 1, así que 2⁻³ es 1/8.',
    },
    mira: {
      datos: {
        columnas: ['potencia', 'valor', ''],
        filas: [3, 2, 1, 0, -1, -2, -3].map((e, k) => [{ t: pot(2, e), fuerte: e < 0 }, { t: valorPot(2, e), color: e < 0 ? 'd' : null, desde: e > 0 ? 1 : e === 0 ? 2 : 3 }, { t: k ? '÷ 2' : '', desde: e > 0 ? 1 : e === 0 ? 2 : 3 }]),
        alt: 'Potencias de 2 del 3 al −3: cada fila es la anterior dividida entre 2',
      },
      voz: 'Creo que el patrón decide. Bajemos de a un exponente.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Bajar el exponente en 1 quita un factor 2: se divide entre 2.', ecuacion: ['8 → 4 → 2'] },
        { estado: { corte: 2 }, texto: 'Un paso más: 2 ÷ 2 = 1. Por eso a⁰ = 1.', ecuacion: ['2⁰ = 1'] },
        { estado: { corte: 3 }, texto: 'Si se sigue dividiendo, aparecen fracciones, no negativos.', ecuacion: ['2⁻³ = ', { frac: ['1', '2³'] }, ' = ', { frac: ['1', '8'] }] },
        { estado: { corte: 3 }, texto: 'Con la ley de la suma: 2³ · 2⁻³ = 2⁰ = 1.', ecuacion: ['2³ · 2⁻³ = ', { llave: ['2³⁺⁽⁻³⁾'], nota: 'se suman', color: 'c-d' }, ' = 1'] },
      ],
    },
    regla: {
      texto: 'Al multiplicar potencias de igual base se suman los exponentes; al elevar una potencia, se multiplican. Un exponente negativo indica dividir.',
      ecuacion: [{ sup: [a, m] }, ' · ', { sup: [a, n] }, ' = ', { llave: [{ sup: [a, [m, ' + ', n]] }], nota: 'se suman', color: 'c-d' }, '   ·   ',
        { sup: [{ par: [{ sup: [a, m] }] }, n] }, ' = ', { llave: [{ sup: [a, [m, n]] }], nota: 'se multiplican', color: 'c-d' }, '   ·   ',
        { sup: [a, ['−', n]] }, ' = ', { llave: [{ frac: ['1', { sup: [a, n] }] }], nota: 'indica dividir', color: 'c-d' }],
      condicion: 'a ≠ 0 cuando el exponente es cero o negativo; 0⁰ y 0⁻¹ no se definen. Las leyes piden la misma base.',
      voz: 'Misma base, exponentes que se suman. Revisemos la base primero.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), B = r.uno([2, 3, 5, 10]);
        const p = r.uno([-2, -1, 1, 2, 3, 4, 5]), q = r.uno([-3, -2, -1, 2, 3, 4]), w = r.ent(1, 4), tipo = s % 3;
        let expr, bien, dist, pasos;
        if (tipo === 0) {
          expr = `${pot(B, p)} · ${pot(B, q)} ÷ ${pot(B, w)}`; bien = p + q - w; pasos = `${p} + (${q}) − ${w}`;
          dist = [{ e: p * q - w, error: 'TAL-EXP-PRODUCTO', siFuera: 'Eso multiplica los exponentes del producto; en un producto se suman.' },
            { e: p + q + w, error: 'TAL-EXP-COCIENTE', siFuera: 'Eso suma el exponente del divisor; al dividir se resta.' },
            { e: w - p - q, error: 'TAL-EXP-SIGNO', siFuera: 'Eso invierte la resta: se resta el exponente del divisor.' }];
        } else if (tipo === 1) {
          expr = `(${pot(B, p)})${sup(w)} · ${pot(B, q)}`; bien = p * w + q; pasos = `${p} · ${w} + (${q})`;
          dist = [{ e: p + w + q, error: 'TAL-EXP-ELEVAR', siFuera: 'Eso suma al elevar; elevar una potencia multiplica los exponentes.' },
            { e: p * w * q, error: 'TAL-EXP-PRODUCTO', siFuera: `Eso multiplica también por ${q}; en el producto final se suma.` },
            { e: p * w - q, error: 'TAL-EXP-SIGNO', siFuera: 'Eso resta el último exponente; en un producto se suma.' }];
        } else {
          expr = `${pot(B, p)} · ${pot(B, q)} · ${pot(B, -w)}`; bien = p + q - w; pasos = `${p} + (${q}) + (−${w})`;
          dist = [{ e: p * q * -w, error: 'TAL-EXP-PRODUCTO', siFuera: 'Eso multiplica los exponentes; en un producto se suman.' },
            { e: p + q + w, error: 'TAL-EXP-NEG', siFuera: `Eso suma ${w} en vez de −${w}: el signo del exponente cuenta.` },
            { e: Math.abs(p) + Math.abs(q) + w, error: 'TAL-EXP-NEG', siFuera: 'Eso quita los signos de los exponentes; un negativo resta.' }];
        }
        return {
          pregunta: `Escribe ${expr} como una sola potencia de ${B}.`,
          opciones: distintas([{ id: 'c', texto: pot(B, bien), correcta: true }, ...dist.map((d, k) => ({ id: `d${k}`, texto: pot(B, d.e), error: d.error, siFuera: d.siFuera }))]),
          solucion: { texto: ['Misma base: en el producto se suman exponentes y se resta el del divisor.', 'Elevar multiplica los exponentes; después, el producto los suma.', 'Misma base: en un producto se suman los exponentes, con su signo.'][tipo], ecuacion: [`${pasos} = ${bien}   →   ${pot(B, bien)} = ${valorPot(B, bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: la raíz principal no es negativa ----------
  // Cambia: los dos números bajo la raíz · Permanece: las cuatro filas de la tabla · Progresa: la diferencia
  // entre √(a + b) y √a + √b · Se reserva: el x negativo bajo el cuadrado · Debe verse: √(x²) = |x|.
  // Dos representaciones a propósito (hallazgo 9): el juego compara sumas y productos en la tabla, sin negativos, para
  // que la predicción sobre √((−5)²) sea algo no visto; «Mira» pasa a la gráfica porque el caso negativo es lo nuevo.
  // El laboratorio (índice par contra impar) junta las dos cosas con el punto que se arrastra.
  const ejesRaiz = (extra = {}) => Object.assign({
    x: { min: -6, max: 6, paso: 2, nombre: 'x', decimales: 0, color: 'o' },
    y: { min: -6, max: 6, paso: 2, nombre: 'y', decimales: 0 },
  }, extra);
  const VX = Array.from({ length: 13 }, (_, k) => k - 6);
  const radicales = {
    id: 'radicales',
    titulo: 'La raíz principal nunca es negativa',
    temas: ['Propiedades de radicales'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Elige a y b. Compara la raíz de la suma con la suma de raíces, y la raíz del producto con el producto de raíces.',
      voz: 'Mira cuándo coinciden y cuándo no.',
      controles: [
        { id: 'a', etiqueta: 'a', min: 0, max: 16, paso: 1, inicio: 9, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: 0, max: 16, paso: 1, inicio: 16, decimales: 0, color: 'c-i' },
      ],
      dibujo: v => {
        const s1 = Math.sqrt(v.a + v.b), s2 = Math.sqrt(v.a) + Math.sqrt(v.b), p1 = Math.sqrt(v.a * v.b), p2 = Math.sqrt(v.a) * Math.sqrt(v.b);
        const ig = (x, y) => Math.abs(x - y) < 1e-9;
        return {
          datos: {
            columnas: ['expresión', 'valor'],
            filas: [[`√(${v.a} + ${v.b})`, f(s1)], [`√${v.a} + √${v.b}`, { t: f(s2), color: ig(s1, s2) ? 'd' : 'h', fuerte: true }], [`√(${v.a} · ${v.b})`, f(p1)], [`√${v.a} · √${v.b}`, { t: f(p2), color: ig(p1, p2) ? 'd' : 'h', fuerte: true }]],
            separador: { fila: 2 },
            alt: `Raíz de la suma ${f(s1)} contra suma de raíces ${f(s2)}; raíz del producto ${f(p1)} igual al producto de raíces`,
          }, estado: {},
        };
      },
      lectura: v => [`√(a + b) = ${f(Math.sqrt(v.a + v.b))}`, '   ·   ', `√a + √b = ${f(Math.sqrt(v.a) + Math.sqrt(v.b))}`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuánto vale √((−5)²)?',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'menos', texto: '−5', error: 'TAL-RAIZ-X', siFuera: '−5 sería cierto si √(x²) fuera siempre x. La raíz principal nunca es negativa.' },
        { id: 'doble', texto: '±5', error: 'TAL-RAIZ-DOBLE', siFuera: '±5 son las soluciones de x² = 25; el símbolo √ da solo la no negativa.' },
        { id: 'cuadrado', texto: '25', error: 'TAL-RAIZ-FALTA', siFuera: '25 es (−5)²; falta sacar la raíz.' },
      ],
      pieza: 'ejes',
      dibujo: { datos: ejesRaiz({ curvas: [{ puntos: [[-6, -6], [6, 6]], color: 'h', discontinua: true, rotulo: 'y = x', en: [4, 4] }], alt: 'Plano con la recta y = x, sin la gráfica de la raíz' }), estado: {} },
      revelar: { datos: ejesRaiz({ curvas: [{ puntos: [[-6, -6], [6, 6]], color: 'h', discontinua: true, rotulo: 'y = x', en: [4, 4] }, { puntos: VX.map(x => [x, Math.abs(x)]), color: 'd', rotulo: 'y = √(x²)', en: [-6, 6] }], puntos: [{ x: -5, y: 5, color: 'd', rotulo: '5', guias: true }], alt: 'La gráfica de raíz de x al cuadrado es la de valor absoluto: en x = −5 vale 5' }), estado: {} },
      coincide: 'Coincide: (−5)² = 25 y la raíz principal de 25 es 5.',
    },
    mira: {
      pieza: 'ejes',
      datos: ejesRaiz({
        curvas: [{ puntos: [[-6, -6], [6, 6]], color: 'h', discontinua: true, rotulo: 'y = x', en: [4, 4], desde: 1 },
          { puntos: VX.filter(x => x >= 0).map(x => [x, x]), color: 'd', desde: 1 },
          { puntos: VX.filter(x => x <= 0).map(x => [x, -x]), color: 'd', rotulo: 'y = √(x²)', en: [-6, 6], desde: 2 }],
        puntos: [{ x: -3, y: 3, color: 'd', rotulo: '|−3| = 3', guias: true, desde: 3 }],
        alt: 'Raíz de x al cuadrado coincide con x si x es positivo y con −x si es negativo: es |x|',
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Para x ≥ 0, √(x²) coincide con x.', ecuacion: ['√(3²) = √9 = 3'] },
        { estado: { corte: 2 }, texto: 'Para x < 0, el cuadrado borra el signo y la raíz da el positivo.', ecuacion: ['√((−3)²) = √9 = 3'] },
        { estado: { corte: 3 }, texto: 'En los dos casos el resultado es la distancia al cero.', ecuacion: [{ raiz: ['x²'] }, ' = ', { llave: [{ abs: ['x'] }], nota: 'distancia al cero', color: 'c-d' }] },
        { estado: { corte: 3 }, texto: 'El producto se reparte; la suma no.', ecuacion: ['√(9 · 16) = 3 · 4 = 12', '   ·   ', '√(9 + 16) = 5 ≠ 7'] },
      ],
    },
    regla: {
      texto: 'El símbolo √ da la raíz principal, que nunca es negativa; por eso √(x²) = |x|. La raíz se reparte sobre un producto de no negativos, nunca sobre una suma.',
      ecuacion: [{ raiz: ['x²'] }, ' = ', { llave: [{ abs: ['x'] }], nota: 'nunca negativo', color: 'c-d' }, '   ·   ', { raiz: [a, ' · ', b] }, ' = ', { raiz: [a] }, ' · ', { raiz: [b] }],
      condicion: 'en los reales, la raíz de índice par pide radicando no negativo (a, b ≥ 0); la impar admite negativos: ∛(−8) = −2.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const k = r.ent(2, 12), neg = s % 2 === 0, x = neg ? -k : k;
          return {
            pregunta: `Si x = ${f(x, 0)}, ¿cuánto vale √(x²)?`,
            opciones: distintas([{ id: 'c', texto: f(k, 0), correcta: true },
              { id: 'x', texto: f(-k, 0), error: 'TAL-RAIZ-X', siFuera: neg ? 'Eso sería cierto si √(x²) fuera x; la raíz principal no es negativa.' : `Con x = ${k}, √(x²) = ${k}: la raíz principal no es negativa.` },
              { id: 'pm', texto: `±${k}`, error: 'TAL-RAIZ-DOBLE', siFuera: `±${k} resuelve t² = ${k * k}; √ da solo la no negativa.` },
              { id: 'cuad', texto: f(k * k, 0), error: 'TAL-RAIZ-FALTA', siFuera: `${k * k} es x²; falta sacar la raíz.` }]),
            solucion: { texto: 'La raíz del cuadrado es el valor absoluto.', ecuacion: [{ raiz: [`(${f(x, 0)})²`] }, ` = √${k * k} = ${k}`] },
          };
        }
        if (tipo === 1) {
          const c = r.ent(2, 6), t = r.uno([2, 3, 5, 6, 7]), N = c * c * t;
          return {
            pregunta: `Simplifica √${N} sacando de la raíz todo lo que se pueda.`,
            opciones: distintas([{ id: 'c', texto: `${c}√${t}`, correcta: true },
              { id: 'adentro', texto: `${c * c}√${t}`, error: 'TAL-RAIZ-FALTA', siFuera: `${c * c} sale de la raíz como √${c * c} = ${c}, no como ${c * c}.` },
              { id: 'invertido', texto: `${t}√${c}`, error: 'TAL-RAIZ-SIMP', siFuera: `${t}√${c} da √${t * t * c}; el que sale es el cuadrado ${c * c}.` },
              { id: 'suma', texto: `${c} + √${t}`, error: 'AL9', siFuera: `Eso sería √(${c * c} + ${t}) repartida; aquí es un producto: ${c * c} · ${t}.` }]),
            solucion: { texto: `${N} = ${c * c} · ${t}, y ${c * c} es un cuadrado.`, ecuacion: [`√${N} = √${c * c} · √${t} = ${c}√${t}`] },
          };
        }
        const [p, q, h] = r.uno([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]);
        return {
          pregunta: ['Si ', a, ` = ${p} y `, b, ` = ${q}, ¿cuánto vale `, { raiz: [a, '² + ', b, '²'] }, '?'],
          opciones: distintas([{ id: 'c', texto: f(h, 0), correcta: true },
            { id: 'suma', texto: f(p + q, 0), error: 'AL9', siFuera: `${p + q} sería cierto si la raíz se repartiera sobre la suma; no se reparte.` },
            { id: 'sin', texto: f(p * p + q * q, 0), error: 'TAL-RAIZ-FALTA', siFuera: `${p * p + q * q} es a² + b²; falta sacar la raíz.` },
            { id: 'resta', texto: f(q - p, 0), error: 'AL9', siFuera: 'La raíz de una suma no se calcula con a y b sueltos.' }]),
          solucion: { texto: 'Primero se suma bajo la raíz; después se saca la raíz.', ecuacion: [`√(${p * p} + ${q * q}) = √${h * h} = ${h}`] },
        };
      },
    },
  };

  // ---------- Idea 3: el cuadrado de una suma tiene cuatro piezas ----------
  // Cambia: los largos a y b · Permanece: el cuadrado de lado a + b, a escala · Progresa: las piezas que lo llenan
  // · Se reserva: los dos rectángulos ab · Debe verse: a² + b² no alcanza a cubrir (a + b)².
  // Gesto: el alumno estira el cuadrado por sus esquinas; los huecos ab crecen con él a la vista.
  const cuadrado = (va, vb, conAB, extra = {}) => ({
    anchos: [{ t: `a = ${va}`, v: va, color: 'o' }, { t: `b = ${vb}`, v: vb, color: 'i' }],
    altos: [{ t: 'a', v: va, color: 'o' }, { t: 'b', v: vb, color: 'i' }],
    celdas: [[{ t: `a² = ${va * va}`, color: 'o' }, conAB ? { t: `ab = ${va * vb}`, color: 'd', desde: conAB === true ? 0 : conAB } : null],
      [conAB ? { t: `ab = ${va * vb}`, color: 'd', desde: conAB === true ? 0 : conAB } : null, { t: `b² = ${vb * vb}`, color: 'i' }]],
    total: { t: `(a + b)² = ${(va + vb) ** 2}` },
    alt: `Cuadrado de lado ${va} + ${vb}: ${conAB ? 'a², b² y dos rectángulos ab' : 'a² y b² dejan dos huecos'}`,
    ...extra,
  });
  // Gesto: la esquina interior de a² (diagonal) cambia a; la esquina de afuera de b² cambia b. Con escala fija
  // (alg-baldosas `escala`), el cuadrado crece de verdad: lo que se ve es a + b, no una proporción.
  const ESC_N = 24;   // px por unidad: a + b llega a 8 y el lado a 192 px, lo que cabe en la pieza
  // Con la escala fija, un tramo de menos de 56 px muestra solo su letra (el valor está en el control y la lectura).
  const rot = (t, v, val = v) => (v * ESC_N >= 56 ? `${t} = ${val}` : t);
  const cuadJ = v => ({
    anchos: [{ t: rot('a', v.a), v: v.a, color: 'o' }, { t: rot('b', v.b), v: v.b, color: 'i' }],
    altos: [{ t: 'a', v: v.a, color: 'o' }, { t: 'b', v: v.b, color: 'i' }],
    celdas: [[{ t: rot('a²', v.a, v.a * v.a), color: 'o' }, null], [null, { t: rot('b²', v.b, v.b * v.b), color: 'i' }]],
    total: { t: `(a + b)² = ${(v.a + v.b) ** 2}` },
    escala: ESC_N,
    alt: `Cuadrado de lado ${v.a} + ${v.b}: a² y b² dejan dos huecos`,
  });
  const notables = {
    id: 'cuadrado-suma',
    titulo: 'El cuadrado de una suma',
    temas: ['Productos notables'],
    pieza: 'alg-baldosas',
    juega: {
      consigna: 'Elige los largos a y b. El cuadrado mide a + b de lado; adentro ya están las piezas a² y b².',
      voz: 'Mira lo que queda sin cubrir.',
      controles: [
        { id: 'a', etiqueta: 'a', min: 1, max: 5, paso: 1, inicio: 4, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: cuadJ(v), estado: {} }),
      lectura: v => [`(a + b)² = ${(v.a + v.b) ** 2}`, '   ·   ', `a² + b² = ${v.a ** 2 + v.b ** 2}`],
      minimo: 3,
      arrastres: [
        { id: 'esquina-a', etiqueta: 'esquina de la pieza a²', color: 'c-o',
          donde: v => { const g = BALD().geometria(cuadJ(v)); return { x: g.xs[0][1], y: g.ys[0][1] }; },
          mover: (pt, v) => { const g = BALD().geometria(cuadJ(v)); return { a: ((pt.x - g.x0) + (pt.y - g.y0)) / 2 / g.esc }; } },
        { id: 'esquina-b', etiqueta: 'esquina de afuera del cuadrado', color: 'c-i',
          donde: v => { const g = BALD().geometria(cuadJ(v)); return { x: g.xs[1][1], y: g.ys[1][1] }; },
          mover: (pt, v) => { const g = BALD().geometria(cuadJ(v)); return { b: ((pt.x - g.xs[1][0]) + (pt.y - g.ys[1][0])) / 2 / g.esc }; } },
      ],
    },
    predice: {
      pregunta: ['Con ', a, ' = 5 y ', b, ' = 2, ¿cuánto le falta a ', a, '² + ', b, '² para llegar a (', a, ' + ', b, ')²?'],
      opciones: [
        { id: 'c', texto: '20', correcta: true },
        { id: 'cero', texto: '0', error: 'AL8', siFuera: '0 sería cierto si (a + b)² fuera a² + b². Quedan dos rectángulos sin cubrir.' },
        { id: 'uno', texto: '10', error: 'TAL-2AB', siFuera: '10 es un solo rectángulo ab; hay dos, uno en cada esquina.' },
        { id: 'b2', texto: '4', error: 'TAL-2AB', siFuera: '4 es b². Lo que falta mide a de un lado y b del otro.' },
      ],
      dibujo: { datos: cuadrado(5, 2, false), estado: {} },
      revelar: { datos: cuadrado(5, 2, true), estado: {} },
      coincide: 'Coincide: faltan dos rectángulos de 5 · 2 = 10 cada uno.',
    },
    mira: {
      datos: (() => {
        const d = cuadrado(3, 2, 3);
        d.celdas[0][0].desde = 1; d.celdas[1][1].desde = 2; d.total.desde = 4;
        return d;
      })(),
      voz: 'Creo que la figura alcanza para lados positivos. Después, el álgebra.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La esquina de a por a: a².', ecuacion: [a, '² = 9'] },
        { estado: { corte: 2 }, texto: 'La esquina opuesta, de b por b: b².', ecuacion: [b, '² = 4'] },
        { estado: { corte: 3 }, texto: 'Los dos huecos miden a por b: son 2ab.', ecuacion: [{ llave: ['2', a, b], nota: 'dos rectángulos', color: 'c-d' }, ' = 2 · 3 · 2 = 12'] },
        { estado: { corte: 4 }, texto: 'Las cuatro piezas llenan el cuadrado de lado a + b.', ecuacion: ['9 + 12 + 4 = 25 = 5²'] },
        { estado: { corte: 4 }, texto: 'Con a = −3 no hay figura, pero la distributividad da igual.', ecuacion: ['(−3 + 2)² = 1 = 9 − 12 + 4'] },
      ],
    },
    regla: {
      texto: 'El cuadrado de una suma tiene dos cuadrados y dos rectángulos iguales. La suma por la diferencia deja solo la resta de los cuadrados.',
      ecuacion: ['(', a, ' + ', b, ')² = ', a, '² + ', { llave: ['2', a, b], nota: 'huecos', color: 'c-d' }, ' + ', b, '²', '   ·   ',
        '(', a, ' + ', b, ')(', a, ' − ', b, ') = ', a, '² − ', b, '²'],
      condicion: 'valen para todo par de números reales a y b; la figura de áreas solo ilustra el caso de lados positivos.',
    },
    ahoraTu: {
      pieza: 'alg-baldosas',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const va = r.ent(2, 7), vb = r.ent(1, 5), S = va + vb, P = va * vb, bien = S * S - 2 * P;
          return {
            pregunta: ['Si ', a, ' + ', b, ` = ${S} y `, a, b, ` = ${P}, ¿cuánto vale `, a, '² + ', b, '²?'],
            opciones: distintas([{ id: 'c', texto: f(bien, 0), correcta: true },
              { id: 'al8', texto: f(S * S, 0), error: 'AL8', siFuera: `${S * S} sería cierto si (a + b)² fuera a² + b²; sobran los dos rectángulos ab.` },
              { id: 'uno', texto: f(S * S - P, 0), error: 'TAL-2AB', siFuera: `Eso resta un solo rectángulo ab; son dos: 2 · ${P}.` },
              { id: 'suma', texto: f(S * S + 2 * P, 0), error: 'TAL-2AB', siFuera: 'Los rectángulos ya están dentro de (a + b)²: se restan, no se suman.' }]),
            solucion: { texto: 'Al cuadrado de la suma se le quitan los dos rectángulos.', ecuacion: [a, '² + ', b, `² = ${S}² − 2 · ${P} = ${bien}`], dibujo: { datos: cuadrado(va, vb, true), estado: {} } },
          };
        }
        if (tipo === 1) {
          const k = r.ent(2, 9), signo = s % 2 ? '−' : '+', c = signo === '+' ? 2 * k : -2 * k;
          return {
            pregunta: `Al desarrollar (x ${signo} ${k})², ¿qué coeficiente acompaña a x?`,
            opciones: distintas([{ id: 'c', texto: f(c, 0), correcta: true },
              { id: 'uno', texto: f(c / 2, 0), error: 'TAL-2AB', siFuera: `Eso cuenta un solo rectángulo; son dos: 2 · ${k}.` },
              { id: 'cero', texto: '0', error: 'AL8', siFuera: `0 sería cierto si (x ${signo} ${k})² fuera x² + ${k * k}. Faltan los dos rectángulos.` },
              { id: 'signo', texto: f(-c, 0), error: 'TAL-SIGNO', siFuera: `El término cruzado lleva el signo de ${signo} ${k}.` }]),
            solucion: { texto: `Los dos productos cruzados x · (${signo}${k}) se suman.`, ecuacion: [`(x ${signo} ${k})² = x² ${c < 0 ? '−' : '+'} ${Math.abs(c)}x + ${k * k}`] },
          };
        }
        const M = r.uno([20, 30, 40, 50, 60, 70]), d = r.ent(1, 4);
        return {
          pregunta: `Calcula ${M + d} · ${M - d} como (m + d)(m − d), con m = ${M}.`,
          opciones: distintas([{ id: 'c', texto: f(M * M - d * d, 0), correcta: true },
            { id: 'mas', texto: f(M * M + d * d, 0), error: 'TAL-DIFCUAD', siFuera: 'Los productos cruzados se anulan, y d · (−d) resta d².' },
            { id: 'cuad', texto: f(M * M, 0), error: 'TAL-DIFCUAD', siFuera: `Falta restar ${d}² = ${d * d}.` },
            { id: 'dos', texto: f(M * M - 2 * d, 0), error: 'TAL-DIFCUAD', siFuera: `Se resta d² = ${d * d}, no 2d.` }]),
          solucion: { texto: 'La suma por la diferencia deja m² − d².', ecuacion: [`${M}² − ${d}² = ${M * M} − ${d * d} = ${M * M - d * d}`] },
        };
      },
    },
  };

  // ---------- Idea 4: radicales dobles, buscar suma y producto ----------
  // Cambia: el radical doble elegido · Permanece: la tabla de pares que suman A · Progresa: los productos que se
  // calculan · Se reserva: el par cuyo producto es B · Debe verse: la suma da A y el producto da B a la vez.
  const pares = A => { const l = []; for (let x = A - 1; x >= A / 2; x--) l.push([x, A - x]); return l; };
  const tablaPares = (A, B, ocultar = false, desde = {}) => ({
    columnas: ['x', 'y', 'x + y', 'x · y'], colorCol: ['o', 'i', null, null],
    filas: pares(A).map(([x, y]) => [{ t: String(x), desde: desde.par || 0 }, { t: String(y), desde: desde.par || 0 }, { t: String(A), desde: desde.par || 0 },
      { t: String(x * y), desde: ocultar ? 1 : desde.prod || 0, color: x * y === B ? 'd' : null, fuerte: x * y === B, marca: x * y === B ? 'ok' : undefined }]),
    alt: `Pares que suman ${A}; el de producto ${B} da el radical simple`,
  });
  const EJEMPLOS = [[5, 6], [8, 15], [9, 14], [11, 30]];
  const parDe = (A, B) => pares(A).find(([x, y]) => x * y === B);
  const dobles = {
    id: 'radicales-dobles',
    titulo: 'Dos números que suman y multiplican',
    temas: ['Radicales dobles'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Elige un radical doble √(A + 2√B). La tabla lista los pares que suman A y su producto. Busca el producto B.',
      voz: 'La suma ya está; el producto decide.',
      controles: [
        { id: 'ej', etiqueta: 'Radical', opciones: EJEMPLOS.map(([A, B], k) => ({ valor: k, texto: `√(${A} + 2√${B})` })) },
        { id: 'sg', etiqueta: 'Signo', opciones: [{ valor: '+', texto: '+' }, { valor: '−', texto: '−' }] },
      ],
      dibujo: v => { const [A, B] = EJEMPLOS[v.ej]; return { datos: tablaPares(A, B), estado: {} }; },
      lectura: v => { const [A, B] = EJEMPLOS[v.ej], [x, y] = parDe(A, B); return [`√(${A} ${v.sg} 2√${B}) = ${rz(x)} ${v.sg} ${rz(y)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: '¿A qué es igual √(7 + 2√12)?',
      opciones: [
        { id: 'c', texto: '2 + √3', correcta: true },
        { id: 'reparte', texto: '√7 + √12', error: 'AL9', siFuera: 'Sería cierto si la raíz se repartiera sobre la suma; (√7 + √12)² da 19 + 2√84.' },
        { id: 'suma', texto: '1 + √6', error: 'TAL-RD-PRODUCTO', siFuera: '1 y 6 suman 7, pero su producto es 6, no 12.' },
        { id: 'raiz', texto: '√7 + 2√3', error: 'AL9', siFuera: 'Eso saca √12 = 2√3 y deja √7 suelto; la raíz grande no se reparte.' },
      ],
      dibujo: { datos: tablaPares(7, 12, true), estado: {} },
      revelar: { datos: tablaPares(7, 12), estado: {} },
      coincide: 'Coincide: 4 + 3 = 7 y 4 · 3 = 12, así que queda √4 + √3 = 2 + √3.',
    },
    mira: {
      datos: tablaPares(7, 12, false, { par: 1, prod: 2 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Se buscan x e y que sumen 7: los pares posibles.', ecuacion: ['x + y = 7'] },
        { estado: { corte: 2 }, texto: 'De esos, el que multiplica 12 es 4 y 3.', ecuacion: ['x · y = 12'] },
        { estado: { corte: 2 }, texto: 'Entonces √(7 + 2√12) = √4 + √3 = 2 + √3.', ecuacion: ['√(7 + 2√12) = √4 + √3'] },
        { estado: { corte: 2 }, texto: 'Se comprueba elevando al cuadrado: vuelve el radical doble.', ecuacion: ['(2 + √3)² = 4 + 4√3 + 3 = 7 + 2√12'] },
      ],
    },
    regla: {
      texto: 'Un radical doble √(A ± 2√B) se vuelve simple si hay dos números x e y que suman A y se multiplican B.',
      ecuacion: [{ raiz: ['A ± 2', { raiz: ['B'] }] }, ' = ', { raiz: [{ v: 'c-o', t: 'x' }] }, ' ± ', { raiz: [{ v: 'c-i', t: 'y' }] }, '   ·   ',
        { llave: [{ v: 'c-o', t: 'x' }, ' + ', { v: 'c-i', t: 'y' }], nota: 'suman A', color: 'c-d' }, ' = A', '   ·   ', { llave: [{ v: 'c-o', t: 'x' }, ' · ', { v: 'c-i', t: 'y' }], nota: 'multiplican B', color: 'c-d' }, ' = B'],
      condicion: 'x ≥ y ≥ 0, y con el signo menos va primero el mayor: así nada queda negativo.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let x, y;
        do { x = r.ent(3, 11); y = r.ent(1, x - 1); } while (esCuad(x * y) || x + y > 15 || x + y < 5);
        const A = x + y, B = x * y, sg = s % 2 ? '−' : '+';
        const otro = pares(A).find(([u, w]) => u > w && u * w !== B && u !== x);
        return {
          pregunta: `¿A qué es igual √(${A} ${sg} 2√${B})?`,
          opciones: distintas([{ id: 'c', texto: `${rz(x)} ${sg} ${rz(y)}`, correcta: true },
            sg === '−' ? { id: 'orden', texto: `${rz(y)} − ${rz(x)}`, error: 'TAL-RD-ORDEN', siFuera: `Ese resultado es negativo; una raíz principal no lo es. Va primero ${rz(x)}.` }
              : { id: 'menos', texto: `${rz(x)} − ${rz(y)}`, error: 'TAL-RD-SIGNO', siFuera: 'El signo del radical simple es el mismo del radical doble.' },
            { id: 'reparte', texto: `√${A} ${sg} √${B}`, error: 'AL9', siFuera: 'Sería cierto si la raíz se repartiera sobre la suma; no se reparte.' },
            otro && { id: 'par', texto: `${rz(otro[0])} ${sg} ${rz(otro[1])}`, error: 'TAL-RD-PRODUCTO', siFuera: `${otro[0]} y ${otro[1]} suman ${A}, pero su producto es ${otro[0] * otro[1]}, no ${B}.` }]),
          solucion: { texto: `${x} + ${y} = ${A} y ${x} · ${y} = ${B}.`, ecuacion: [`√(${A} ${sg} 2√${B}) = √${x} ${sg} √${y}${esCuad(x) || esCuad(y) ? ` = ${rz(x)} ${sg} ${rz(y)}` : ''}`] },
        };
      },
    },
  };

  // ---------- Idea 5: racionalizar es multiplicar por uno ----------
  // Cambia: el número bajo la raíz y la forma del denominador · Permanece: el valor decimal de cada fila
  // · Progresa: la expresión que se transforma · Se reserva: el conjugado · Debe verse: el valor no cambia.
  const RACIONAL = {
    simple: A => ({ filas: [[`1/√${A}`, f(1 / Math.sqrt(A), 3)], [`× √${A}/√${A}`, 'por 1'], [{ t: `√${A}/${A}`, color: 'd', fuerte: true }, { t: f(Math.sqrt(A) / A, 3), color: 'd' }]] }),
    conj: A => ({ filas: [[`1/(√${A} − 1)`, f(1 / (Math.sqrt(A) - 1), 3)], [`× (√${A} + 1)/(√${A} + 1)`, 'por 1'], [{ t: `(√${A} + 1)/${A - 1}`, color: 'd', fuerte: true }, { t: f((Math.sqrt(A) + 1) / (A - 1), 3), color: 'd' }]] }),
  };
  const racionalizar = {
    id: 'racionalizar',
    titulo: 'Racionalizar es multiplicar por uno',
    temas: ['Racionalización'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Elige el número bajo la raíz y la forma del denominador. Mira la expresión que resulta y su valor decimal en cada fila.',
      voz: 'Compara los valores de la primera y la última fila.',
      controles: [
        { id: 'A', etiqueta: 'Bajo la raíz', min: 2, max: 10, paso: 1, inicio: 5, decimales: 0, color: 'c-o' },
        { id: 'forma', etiqueta: 'Forma', opciones: [{ valor: 'simple', texto: '1/√A' }, { valor: 'conj', texto: '1/(√A − 1)' }] },
      ],
      dibujo: v => ({ datos: Object.assign({ columnas: ['expresión', '≈ valor'], alt: 'La expresión cambia de forma y su valor decimal se mantiene' }, RACIONAL[v.forma](v.A)), estado: {} }),
      lectura: v => [`El valor no cambia: ≈ ${v.forma === 'simple' ? f(1 / Math.sqrt(v.A), 3) : f(1 / (Math.sqrt(v.A) - 1), 3)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Por qué expresión conviene multiplicar ', { frac: ['1', '√5 − √3'] }, ' para que el denominador quede sin raíces?'],
      opciones: [
        { id: 'c', texto: [{ frac: ['√5 + √3', '√5 + √3'] }], correcta: true },
        { id: 'mismo', texto: [{ frac: ['√5 − √3', '√5 − √3'] }], error: 'TAL-RAC-MISMO', siFuera: 'Así el denominador queda (√5 − √3)² = 8 − 2√15: sigue con raíz.' },
        { id: 'una', texto: [{ frac: ['√5', '√5'] }], error: 'TAL-RAC-UNA', siFuera: 'Eso sirve con una sola raíz; aquí queda 5 − √15 abajo.' },
        { id: 'solo', texto: '√5 + √3', error: 'TAL-RAC-UNO', siFuera: 'Multiplicar solo por √5 + √3 cambia el valor; hay que multiplicar por 1.' },
      ],
      dibujo: { datos: { columnas: ['expresión', '≈ valor'], filas: [['1/(√5 − √3)', f(1 / (Math.sqrt(5) - Math.sqrt(3)), 3)], ['× ?', ''], ['?', '']], alt: 'Uno sobre raíz de 5 menos raíz de 3, y un factor por elegir' }, estado: {} },
      revelar: { datos: { columnas: ['expresión', '≈ valor'], filas: [['1/(√5 − √3)', f(1 / (Math.sqrt(5) - Math.sqrt(3)), 3)], ['× (√5 + √3)/(√5 + √3)', 'por 1'], [{ t: '(√5 + √3)/2', color: 'd', fuerte: true }, { t: f((Math.sqrt(5) + Math.sqrt(3)) / 2, 3), color: 'd' }]], alt: 'Con el conjugado, el denominador queda 5 − 3 = 2 y el valor no cambia' }, estado: {} },
      coincide: 'Coincide: (√5 − √3)(√5 + √3) = 5 − 3 = 2, sin raíces.',
    },
    mira: {
      datos: {
        columnas: ['paso', 'expresión'],
        filas: [['original', '1/(√5 − √3)'], [{ t: 'por 1', desde: 1 }, { t: '× (√5 + √3)/(√5 + √3)', desde: 1 }], [{ t: 'abajo', desde: 2 }, { t: '(√5)² − (√3)² = 2', desde: 2, color: 'd' }], [{ t: 'resultado', desde: 3 }, { t: '(√5 + √3)/2', desde: 3, color: 'd', fuerte: true }]],
        alt: 'Multiplicar por el conjugado sobre sí mismo deja el denominador 5 − 3 = 2',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Se multiplica por el conjugado sobre sí mismo: eso vale 1.', ecuacion: [{ frac: ['√5 + √3', '√5 + √3'] }, ' = 1'] },
        { estado: { corte: 2 }, texto: 'Abajo queda una suma por diferencia: desaparecen las raíces.', ecuacion: ['(√5 − √3)(√5 + √3) = 5 − 3 = 2'] },
        { estado: { corte: 3 }, texto: 'El resultado tiene el mismo valor que la expresión original.', ecuacion: [{ frac: ['√5 + √3', '2'] }, ` ≈ ${f((Math.sqrt(5) + Math.sqrt(3)) / 2, 3)}`] },
      ],
    },
    regla: {
      texto: 'Racionalizar es multiplicar por una expresión igual a 1 que deja el denominador sin raíces. Con √a − √b se usa su conjugado √a + √b.',
      ecuacion: [{ frac: ['1', ['√', a, ' − √', b]] }, ' = ', { frac: [{ llave: ['√', a, ' + √', b], nota: 'el conjugado', color: 'c-d', arriba: true }, { llave: [a, ' − ', b], nota: 'sin raíces', color: 'c-d' }] }],
      condicion: 'a ≠ b y el denominador no vale cero; el valor de la expresión y sus restricciones no cambian.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let A, B;
        do { A = r.ent(3, 15); B = r.ent(2, A - 1); } while (esCuad(A) || esCuad(B));
        const K = r.uno([1, 2, 3, 4, 6]), sg = s % 2 ? '+' : '−', inv = sg === '+' ? '−' : '+';
        const D = A - B, g = mcd(K, D), c = K / g, den = D / g;
        const arriba = (signo, coef) => (coef === 1 ? `√${A} ${signo} √${B}` : `${coef}(√${A} ${signo} √${B})`);
        const escribe = (signo, coef, d) => (d === 1 ? arriba(signo, coef) : [{ frac: [arriba(signo, coef), String(d)] }]);
        const g2 = mcd(K, A + B);
        return {
          pregunta: ['Racionaliza ', { frac: [String(K), `√${A} ${sg} √${B}`] }, '.'],
          opciones: distintas([
            { id: 'c', texto: escribe(inv, c, den), correcta: true },
            { id: 'mismo', texto: escribe(sg, c, den), error: 'TAL-RAC-MISMO', siFuera: `Arriba va el conjugado: el signo cambia a ${inv}.` },
            { id: 'suma', texto: escribe(inv, K / g2, (A + B) / g2), error: 'TAL-RAC-SUMA', siFuera: `Abajo queda ${A} − ${B}, no ${A} + ${B}: es suma por diferencia.` },
            { id: 'sin', texto: escribe(inv, K, 1), error: 'TAL-RAC-DEN', siFuera: `Falta dividir entre ${D}, lo que quedó en el denominador.` },
          ]),
          solucion: { texto: `Se multiplica por el conjugado; abajo queda ${A} − ${B} = ${D}.`, ecuacion: [{ frac: [String(K), `√${A} ${sg} √${B}`] }, ' = ', ...[].concat(escribe(inv, c, den))] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: el rectángulo (x + p)(x + q), con dos tramos distintos; si p = q vuelve el cuadrado de la idea 3.
  const xx = { v: 'c-o', t: 'x' }, pp = { v: 'c-i', t: 'p' }, qq = { v: 'c-d', t: 'q' };
  const rectXPQ = v => ({
    anchos: [{ t: rot('x', v.x), v: v.x, color: 'o' }, { t: rot('p', v.p), v: v.p, color: 'i' }],
    altos: [{ t: 'x', v: v.x, color: 'o' }, { t: rot('q', v.q), v: v.q, color: 'd' }],
    celdas: [[{ t: rot('x²', v.x, v.x * v.x), color: 'o' }, { t: `${v.p * v.x}`, color: 'i' }], [{ t: `${v.q * v.x}`, color: 'd' }, { t: `${v.p * v.q}`, color: 'f' }]],
    total: { t: `x² + ${v.p + v.q}x + ${v.p * v.q} = ${(v.x + v.p) * (v.x + v.q)}` },
    escala: ESC_N,
    alt: `Rectángulo de ${v.x} + ${v.p} por ${v.x} + ${v.q}: x², px, qx y pq suman ${(v.x + v.p) * (v.x + v.q)}`,
  });
  const mesaRect = {
    id: 'rectangulo-x-p-q', titulo: 'El rectángulo (x + p)(x + q)', pieza: 'alg-baldosas',
    consigna: 'Arrastra la esquina de x² para cambiar x y la esquina de afuera para cambiar p y q. ¿Cuándo vuelve a ser un cuadrado?',
    controles: [
      { id: 'x', etiqueta: 'x', min: 1, max: 5, paso: 1, inicio: 4, decimales: 0, color: 'c-o' },
      { id: 'p', etiqueta: 'p', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      { id: 'q', etiqueta: 'q', min: 1, max: 3, paso: 1, inicio: 3, decimales: 0, color: 'c-d' },
    ],
    dibujo: v => ({ datos: rectXPQ(v), estado: {} }),
    lectura: v => [xx, ` = ${v.x}, `, pp, ` = ${v.p}, `, qq, ` = ${v.q}: área ${(v.x + v.p) * (v.x + v.q)}`],
    arrastres: [
      { id: 'esquina-x', etiqueta: 'esquina de la pieza x²', color: 'c-o',
        donde: v => { const g = BALD().geometria(rectXPQ(v)); return { x: g.xs[0][1], y: g.ys[0][1] }; },
        mover: (pt, v) => { const g = BALD().geometria(rectXPQ(v)); return { x: ((pt.x - g.x0) + (pt.y - g.y0)) / 2 / g.esc }; } },
      { id: 'esquina-pq', etiqueta: 'esquina de afuera: p a lo ancho, q a lo alto', color: 'c-i',
        donde: v => { const g = BALD().geometria(rectXPQ(v)); return { x: g.xs[1][1], y: g.ys[1][1] }; },
        mover: (pt, v) => { const g = BALD().geometria(rectXPQ(v)); return { p: (pt.x - g.xs[1][0]) / g.esc, q: (pt.y - g.ys[1][0]) / g.esc }; } },
    ],
  };
  // Mesa 2: la raíz del cuadrado contra la raíz cúbica del cubo, con x negativo (lo que la idea 2 reserva).
  const ejesIndice = v => ejesRaiz({
    curvas: [{ puntos: [[-6, -6], [6, 6]], color: 'h', discontinua: true, rotulo: 'y = x', en: [4.5, 3] },
      { puntos: VX.map(x => [x, v.k === 2 ? Math.abs(x) : x]), color: 'd', rotulo: v.k === 2 ? 'y = √(x²)' : 'y = ∛(x³)', en: v.k === 2 ? [-6, 6] : [-6, -6] }],
    puntos: [{ x: v.x, y: v.k === 2 ? Math.abs(v.x) : v.x, color: 'o', rotulo: f(v.k === 2 ? Math.abs(v.x) : v.x, 0), guias: true }],
    alt: v.k === 2 ? `Raíz de x al cuadrado: en x = ${v.x} vale ${Math.abs(v.x)}` : `Raíz cúbica de x al cubo: en x = ${v.x} vale ${v.x}`,
  });
  const mesaIndice = {
    id: 'raiz-de-la-potencia', titulo: 'Índice par contra índice impar', pieza: 'ejes',
    consigna: 'Arrastra el punto por la gráfica, también hacia los negativos. Cambia el índice y compara.',
    controles: [
      { id: 'x', etiqueta: 'x', min: -6, max: 6, paso: 1, inicio: -3, decimales: 0, color: 'c-o' },
      { id: 'k', etiqueta: 'Índice', opciones: [{ valor: 2, texto: '√(x²)' }, { valor: 3, texto: '∛(x³)' }] },
    ],
    dibujo: v => ({ datos: ejesIndice(v), estado: {} }),
    lectura: v => (v.k === 2 ? [{ v: 'c-o', t: 'x' }, ` = ${f(v.x, 0)}   →   √(x²) = ${f(Math.abs(v.x), 0)}`] : [{ v: 'c-o', t: 'x' }, ` = ${f(v.x, 0)}   →   ∛(x³) = ${f(v.x, 0)}`]),
    arrastres: [
      { id: 'punto', etiqueta: 'punto de la gráfica', color: 'c-o',
        donde: v => { const g = EJES().geometria(ejesIndice(v)); return { x: g.X(v.x), y: g.Y(v.k === 2 ? Math.abs(v.x) : v.x) }; },
        mover: (pt, v) => { const g = EJES().geometria(ejesIndice(v)); return { x: inversa(g.X, -6, 6)(pt.x) }; } },
    ],
  };
  // Mesa 3: la tabla de la idea 1 con exponentes negativos, que la idea solo deja predecir.
  const factoresConSigno = (base, e) => (e >= 0 ? factores(base, e) : `1/(${factores(base, -e)})`);
  const mesaSigno = {
    id: 'exponentes-con-signo', titulo: 'Exponentes con signo', pieza: 'alg-tabla',
    consigna: 'Elige la base y dos exponentes, también negativos. La última fila suma los exponentes: ¿el valor coincide?',
    controles: [
      { id: 'a', etiqueta: 'Base', min: 2, max: 5, paso: 1, inicio: 2, decimales: 0 },
      { id: 'm', etiqueta: 'm', min: -3, max: 3, paso: 1, inicio: 3, decimales: 0, color: 'c-o' },
      { id: 'n', etiqueta: 'n', min: -3, max: 3, paso: 1, inicio: -2, decimales: 0, color: 'c-i' },
    ],
    dibujo: v => ({
      datos: {
        columnas: ['potencia', 'factores', 'valor'],
        filas: [
          [{ t: pot(v.a, v.m), color: 'o', fuerte: true }, factoresConSigno(v.a, v.m), valorPot(v.a, v.m)],
          [{ t: pot(v.a, v.n), color: 'i', fuerte: true }, factoresConSigno(v.a, v.n), valorPot(v.a, v.n)],
          [{ t: pot(v.a, v.m + v.n), color: 'd', fuerte: true }, `${f(v.m, 0)} + (${f(v.n, 0)}) = ${f(v.m + v.n, 0)}`, { t: valorPot(v.a, v.m + v.n), color: 'd', fuerte: true }],
        ],
        alt: `${v.a} elevado a ${v.m} por ${v.a} elevado a ${v.n} es ${v.a} elevado a ${v.m + v.n}, que vale ${valorPot(v.a, v.m + v.n)}`,
      }, estado: {},
    }),
    lectura: v => [`${pot(v.a, v.m)} · ${pot(v.a, v.n)} = ${pot(v.a, v.m + v.n)} = ${valorPot(v.a, v.m + v.n)}`],
  };

  return {
    unidad: 'algebra.exponentes-y-productos-notables',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/alg-baldosas.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'En La Géométrie, de 1637, Descartes mostró que los problemas de figuras podían escribirse y resolverse con relaciones algebraicas. No inventó cada identidad escolar: su obra continuó una tradición. Aquí las potencias y los productos notables traducen figuras en expresiones, con un límite: una partición de áreas explica una igualdad para lados positivos, y extenderla a negativos pide razones algebraicas.',
      pregunta: '¿Una figura demuestra una igualdad para todos los números?',
      fuente: { titulo: 'O’Connor y Robertson, René Descartes — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/' },
    },
    laboratorio: [mesaRect, mesaIndice, mesaSigno],
    ideas: [leyes, radicales, notables, dobles, racionalizar],
  };
});
