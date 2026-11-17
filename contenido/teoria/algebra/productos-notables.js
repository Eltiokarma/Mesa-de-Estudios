/*
 * Teoría de «Productos notables» (algebra.productos-notables), unidad nueva del 17 nov: sale de «Exponentes, radicales y
 * productos notables», que Gerson aprobó partir en dos como Magnitudes y Vectores (docs/etapa3/decisiones.md, «Segunda
 * ronda»; docs/etapa3/propuesta-algebra-exponentes.md §9, pregunta 1). La unidad vieja conserva su id como «Exponentes y
 * radicales» (contenido/teoria/algebra/exponentes-y-productos-notables.js). Avance.migrar (nucleo/avance.js) pasa a esta
 * unidad lo hecho en `cuadrado-suma`, `radicales-dobles`, `racionalizar` y las mesas `cubo-se-abre` y `rectangulo-x-p-q`.
 *
 * ESTE ARCHIVO ES EL CONTENIDO VIEJO, MOVIDO TAL CUAL (ideas, mesas, glosario e historia), a la espera de rehacerse con el
 * método (docs/metodo/unidad/): ideas `cuadrado-suma`, `suma-por-diferencia` (nueva), `cubo-binomio` (nueva),
 * `radicales-dobles` y `racionalizar`; colores aprobados: a naranja, b turquesa, el total en tinta y violeta a las piezas
 * del medio que se olvidan (2ab, 3a²b); sin carmín ni verde junto a naranja. Hasta entonces quedan los colores viejos
 * (de abajo) y la numeración de ideas del comentario original (3 a 5).
 *
 * Molde: docs/teoria.md. Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 3), expediente teoria-152-unidades
 * (Álgebra y sus precisiones: la figura de áreas ilustra lados positivos; la identidad vale por distributividad) e
 * historia-ecuaciones (pp. 57–68). Errores: AL8, AL9 y AL11 de docs/investigacion/algebra-funciones-ideas-erroneas.md;
 * los TAL-* son hipótesis de diseño (rutinas/teoria-algebra.md).
 * Colores (regla 4, viejos): a naranja (c-o), b turquesa (c-i), lo que se suma o resulta verde (c-d), lo que falta o el
 * contraejemplo rojo (c-h).
 *
 * Ronda 2 (14 nov 2026): gesto directo en «El cuadrado de una suma» (las esquinas de a² y del cuadrado, con la escala
 * fija de alg-baldosas), llaves en las reglas y en «Mira» y laboratorio: el rectángulo (x + p)(x + q) con dos esquinas y
 * el cubo que se abre (3D). Las ideas 4 y 5 juegan con tablas: no hay figura que agarrar.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const a = { v: 'c-o', t: 'a' }, b = { v: 'c-i', t: 'b' };
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
  const mcd = (x, y) => { x = Math.abs(x); y = Math.abs(y); while (y) [x, y] = [y, x % y]; return x; };
  // √k escrito sin raíz si k es un cuadrado perfecto.
  const esCuad = k => Number.isInteger(Math.sqrt(k));
  const rz = k => (esCuad(k) ? String(Math.sqrt(k)) : `√${k}`);

  const BALD = () => Kit.piezas['alg-baldosas'];

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
    // Lee (fase 2): el área de un cuadrado de lado a + b y el nombre «producto notable»; no dice qué falta («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Un patio cuadrado', texto: 'En una casa de Juliaca, un patio cuadrado mide a metros hasta una columna y b metros más hasta la pared. Su lado es a + b, y su área es el lado por el lado.',
          ecuacion: ['(', a, ' + ', b, ')(', a, ' + ', b, ') = (', a, ' + ', b, ')²'] },
        { titulo: 'Productos notables', texto: 'Algunas multiplicaciones salen tanto en los exámenes que conviene saber su resultado sin hacer toda la cuenta. Se llaman productos notables, y el cuadrado de una suma es el primero de la lista.' },
        { titulo: 'Qué mirar al jugar', texto: 'El cuadrado grande ya trae dos piezas: a² en una esquina y b² en la opuesta. Cambia a y b, y fíjate si esas dos piezas alcanzan a cubrir todo el cuadrado.' },
      ],
    },
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
      texto: 'Son productos notables: el cuadrado de una suma tiene dos cuadrados y dos rectángulos iguales; la suma por la diferencia deja una diferencia de cuadrados.',
      ecuacion: ['(', a, ' + ', b, ')² = ', a, '² + ', { llave: ['2', a, b], nota: 'huecos', color: 'c-d' }, ' + ', b, '²', '   ·   ',
        '(', a, ' + ', b, ')(', a, ' − ', b, ') = ', a, '² − ', b, '²'],
      condicion: 'valen para todo par de números reales a y b; la figura de áreas solo ilustra el caso de lados positivos.',
    },
    resuelve: {
      pieza: 'alg-baldosas',
      generar(s) {
        const r = azar(s + 900), tipo = s % 3;
        if (tipo === 0) {
          const va = r.ent(2, 7), vb = r.ent(1, 5), Sv = va + vb, Pv = va * vb, bien = Sv * Sv - 2 * Pv;
          return {
            enunciado: ['Si ', a, ' + ', b, ` = ${Sv} y `, a, b, ` = ${Pv}, ¿cuánto vale `, a, '² + ', b, '²?'],
            dibujo: { datos: cuadrado(va, vb, false), estado: {} },
            pasos: [
              { tipo: 'pide', texto: ['Piden ', a, '² + ', b, '², sin conocer ', a, ' ni ', b, ' por separado.'] },
              { tipo: 'datos', texto: ['La suma ', a, ' + ', b, ` vale ${Sv} y el producto `, a, b, ` vale ${Pv}.`] },
              { tipo: 'regla', texto: 'El cuadrado de lado a + b tiene cuatro piezas: a², b² y dos rectángulos ab. Si le quito los dos rectángulos, quedan a² y b².',
                ecuacion: ['(', a, ' + ', b, ')² = ', a, '² + 2', a, b, ' + ', b, '²'] },
              { tipo: 'cuentas', texto: ['Al cuadrado de la suma le resto dos veces el producto.'], ecuacion: [a, '² + ', b, `² = ${Sv}² − 2 · ${Pv} = ${Sv * Sv} − ${2 * Pv} = ${bien}`],
                dibujo: { datos: cuadrado(va, vb, true), estado: {} } },
              { tipo: 'sentido', texto: `Los números ${va} y ${vb} suman ${Sv} y multiplican ${Pv}. Con ellos: ${va * va} + ${vb * vb} = ${bien}. Cuadra.` },
            ],
            respuesta: [a, '² + ', b, `² = ${bien}`],
          };
        }
        if (tipo === 1) {
          const k = r.ent(2, 9), mas = r() < 0.5, signo = mas ? '+' : '−', c = mas ? 2 * k : -2 * k;
          const des = `x² ${c < 0 ? '−' : '+'} ${Math.abs(c)}x + ${k * k}`, uno = (1 + (mas ? k : -k)) ** 2, seg = mas ? `${k}` : `(−${k})`;
          return {
            enunciado: `Al desarrollar (x ${signo} ${k})², ¿qué coeficiente acompaña a x?`,
            pasos: [
              { tipo: 'pide', texto: `Piden el número que multiplica a x cuando se desarrolla (x ${signo} ${k})².` },
              { tipo: 'datos', texto: `Es el cuadrado de un binomio: el primer término es x y el segundo es ${signo === '+' ? '' : '−'}${k}.` },
              { tipo: 'regla', texto: 'Al cuadrado de una suma salen los dos cuadrados y dos veces el producto de los términos, con su signo.',
                ecuacion: ['(', a, ' + ', b, ')² = ', a, '² + 2', a, b, ' + ', b, '²'] },
              { tipo: 'cuentas', texto: `El término del medio es 2 · x · ${seg}, y el último, ${k}² = ${k * k}.`, ecuacion: [`(x ${signo} ${k})² = x² + 2 · ${seg} · x + ${k}² = ${des}`] },
              { tipo: 'sentido', texto: `Pruebo con x = 1: (1 ${signo} ${k})² = ${uno}, y 1 ${c < 0 ? '−' : '+'} ${Math.abs(c)} + ${k * k} = ${1 + c + k * k}. Cuadra.` },
            ],
            respuesta: `El coeficiente de x es ${f(c, 0)}.`,
          };
        }
        const M = r.uno([20, 30, 40, 50, 60, 70]), d = r.ent(1, 4);
        return {
          enunciado: `Calcula ${M + d} · ${M - d} como (m + d)(m − d), con m = ${M}.`,
          pasos: [
            { tipo: 'pide', texto: `Piden el producto ${M + d} · ${M - d} sin hacer la multiplicación larga.` },
            { tipo: 'datos', texto: `Los dos números están a ${d} de ${M}: uno es ${M} + ${d} y el otro, ${M} − ${d}.` },
            { tipo: 'regla', texto: 'La suma por la diferencia de dos números da la diferencia de sus cuadrados: los productos cruzados se anulan.',
              ecuacion: ['(', a, ' + ', b, ')(', a, ' − ', b, ') = ', a, '² − ', b, '²'] },
            { tipo: 'cuentas', texto: `Elevo ${M} y ${d} al cuadrado y resto.`, ecuacion: [`${M}² − ${d}² = ${M * M} − ${d * d} = ${M * M - d * d}`] },
            { tipo: 'sentido', texto: `Queda un poco menos que ${M}² = ${M * M}: un factor subió ${d} y el otro bajó ${d}, y eso resta solo ${d * d}.` },
          ],
          respuesta: `${M + d} · ${M - d} = ${M * M - d * d}`,
        };
      },
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
    // Lee (fase 2): qué es un radical doble y de dónde sale; el par que lo desarma lo busca el juego.
    lee: {
      tarjetas: [
        { titulo: 'Una raíz con otra adentro', texto: 'A veces una raíz trae otra raíz adentro, como √(8 + 2√15). Eso es un radical doble. En los exámenes piden escribirlo con raíces sueltas, que son más fáciles de sumar y comparar.' },
        { titulo: 'De dónde sale', texto: 'Si elevas al cuadrado una suma de dos raíces, como (√x + √y)², sale un número más otra raíz: un radical doble. Simplificarlo es recorrer ese camino al revés.' },
        { titulo: 'Qué mirar al jugar', texto: 'En la tabla, cada fila trae dos números x e y que suman A. Mira la última columna: el producto cambia de fila en fila, aunque la suma sea la misma.' },
      ],
    },
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
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        let xv, yv;
        do { xv = r.ent(3, 11); yv = r.ent(1, xv - 1); } while (esCuad(xv * yv) || xv + yv > 15 || xv + yv < 5);
        const A = xv + yv, B = xv * yv, sg = s % 2 ? '−' : '+';
        const X = { v: 'c-o', t: 'x' }, Y = { v: 'c-i', t: 'y' };
        const simple = `√${xv} ${sg} √${yv}${esCuad(xv) || esCuad(yv) ? ` = ${rz(xv)} ${sg} ${rz(yv)}` : ''}`;
        return {
          enunciado: `¿A qué es igual √(${A} ${sg} 2√${B})?`,
          dibujo: { datos: tablaPares(A, B, true), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden escribir √(${A} ${sg} 2√${B}) con dos raíces simples.` },
            { tipo: 'datos', texto: `Es un radical doble: bajo la raíz grande está ${A}, y bajo la raíz chica, después del 2, está ${B}.` },
            { tipo: 'regla', texto: ['Busco dos números ', X, ' e ', Y, ` que sumen ${A} y se multipliquen ${B}. Si existen, el radical doble es √x ${sg} √y, con el mayor primero.`] },
            { tipo: 'cuentas', texto: `De los pares que suman ${A}, solo ${xv} y ${yv} multiplican ${B}.`,
              ecuacion: [X, ' + ', Y, ` = ${xv} + ${yv} = ${A}`, '   ·   ', X, ' · ', Y, ` = ${xv} · ${yv} = ${B}`],
              dibujo: { datos: tablaPares(A, B), estado: {} } },
            { tipo: 'sentido', texto: `Elevo al cuadrado: (√${xv} ${sg} √${yv})² = ${xv} + ${yv} ${sg} 2√${B} = ${A} ${sg} 2√${B}. Vuelve el radical de partida.${sg === '−' ? ` Y como ${xv} > ${yv}, no sale negativo.` : ''}` },
          ],
          respuesta: `√(${A} ${sg} 2√${B}) = ${simple}`,
        };
      },
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
    // Lee (fase 2): por qué molesta una raíz abajo y el nombre «racionalizar»; el conjugado queda para «Predice».
    lee: {
      tarjetas: [
        { titulo: 'Cifras que no terminan', texto: '√2 vale 1,4142… y sus cifras siguen sin fin. Dividir entre un número así es incómodo, por eso en los exámenes piden fracciones sin raíces en el denominador, el número de abajo.' },
        { titulo: 'Racionalizar', texto: 'Cambiar una fracción por otra del mismo valor, pero sin raíces abajo, se llama racionalizar. Arriba pueden quedar raíces: lo que importa es que el denominador quede limpio.' },
        { titulo: 'Qué mirar al jugar', texto: 'En la tabla, la primera fila es la fracción de partida y la última, la nueva. Compara sus valores decimales y mira qué se hace en la fila del medio.' },
      ],
    },
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
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        let A, B;
        do { A = r.ent(3, 15); B = r.ent(2, A - 1); } while (esCuad(A) || esCuad(B));
        const K = r.uno([1, 2, 3, 4, 6]), sg = s % 2 ? '+' : '−', inv = sg === '+' ? '−' : '+';
        const Dv = A - B, g = mcd(K, Dv), c = K / g, den = Dv / g;
        const arriba = (signo, coef) => (coef === 1 ? `√${A} ${signo} √${B}` : `${coef}(√${A} ${signo} √${B})`);
        const escribe = (signo, coef, d) => (d === 1 ? arriba(signo, coef) : [{ frac: [arriba(signo, coef), String(d)] }]);
        const orig = K / (Math.sqrt(A) + (sg === '+' ? 1 : -1) * Math.sqrt(B)), fin = c * (Math.sqrt(A) + (inv === '+' ? 1 : -1) * Math.sqrt(B)) / den;
        const tabla = conFin => ({ datos: { columnas: ['expresión', '≈ valor'], filas: [[`${K}/(√${A} ${sg} √${B})`, f(orig, 3)],
          conFin ? [`× (√${A} ${inv} √${B})/(√${A} ${inv} √${B})`, 'por 1'] : ['× ?', ''], conFin ? [{ t: `${c === 1 ? '' : c}(√${A} ${inv} √${B})${den === 1 ? '' : `/${den}`}`, color: 'd', fuerte: true }, { t: f(fin, 3), color: 'd' }] : ['?', '']],
          alt: 'La fracción de partida, el factor que vale 1 y la fracción sin raíces abajo, con su valor decimal' }, estado: {} });
        return {
          enunciado: ['Racionaliza ', { frac: [String(K), `√${A} ${sg} √${B}`] }, '.'],
          dibujo: tabla(false),
          pasos: [
            { tipo: 'pide', texto: 'Piden otra fracción del mismo valor, sin raíces en el denominador.' },
            { tipo: 'datos', texto: `Arriba está ${K}. Abajo hay dos raíces con un signo ${sg} en medio: √${A} ${sg} √${B}.` },
            { tipo: 'regla', texto: `Multiplico arriba y abajo por el conjugado, que cambia el signo del medio a ${inv}. Abajo queda una diferencia de cuadrados, sin raíces.` },
            { tipo: 'cuentas', texto: `Abajo: (√${A} ${sg} √${B})(√${A} ${inv} √${B}) = ${A} − ${B} = ${Dv}.${g > 1 ? ` Después simplifico entre ${g}.` : ''}`,
              ecuacion: [{ frac: [String(K), `√${A} ${sg} √${B}`] }, ' = ', { frac: [arriba(inv, K), String(Dv)] }, ...(g > 1 || den === 1 ? [' = ', ...[].concat(escribe(inv, c, den))] : [])],
              dibujo: tabla(true) },
            { tipo: 'sentido', texto: `Comparo los valores decimales: la de partida vale ≈ ${f(orig, 3)} y la nueva, ≈ ${f(fin, 3)}. Son iguales: solo cambió la forma.` },
          ],
          respuesta: [].concat(escribe(inv, c, den)),
        };
      },
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
    // Retos comprobados (docs/teoria.md §4d): miden las mismas piezas que pinta rectXPQ (x², px, qx y pq).
    invitaciones: [
      { texto: 'Haz que el rectángulo vuelva a ser un cuadrado.',
        logrado: v => v.x + v.p === v.x + v.q,
        bien: 'Con p = q sale (x + p)²: las dos piezas del medio son iguales.' },
      { texto: 'Busca un caso con área total 30.',
        logrado: v => (v.x + v.p) * (v.x + v.q) === 30,
        bien: 'x² + (p + q)x + pq dio 30. ¿Hay otro trío que lo logre?' },
      { texto: 'Haz que las dos piezas del medio juntas midan lo mismo que x².',
        logrado: v => v.p * v.x + v.q * v.x === v.x * v.x,
        bien: 'Pasa cuando x = p + q: el término en x iguala al cuadrado.' },
      { texto: 'Guarda dos casos con el mismo x y el mismo p + q, pero distinto pq.',
        logrado: (v, guardados) => guardados.some(g => g.x === v.x && g.p + g.q === v.p + v.q && g.p * g.q !== v.p * v.q)
          && guardados.some(g => g.x === v.x && g.p === v.p && g.q === v.q),
        bien: 'Las piezas del medio suman igual; solo cambia la de la esquina.' },
    ],
  };

  // ---------- El cubo que se abre (laboratorio 3D, 15 nov: exploración libre, sin predicciones) ----------
  // Las ocho piezas y sus volúmenes los arma plantillas/cuadrado-crece/motor.js (piezasCubo) a través de la pieza
  // alg-cubo-3d: los retos miden lo mismo que se dibuja (regla 1). abrir es el control de tiempo: nada se anima solo.
  const CUBO3 = () => Kit.piezas['alg-cubo-3d'];
  const cuentaCubo = v => CUBO3().cuenta(v);
  const vol = (v, k) => cuentaCubo(v).tipos[k].volumen;
  const mesaCubo = {
    id: 'cubo-se-abre', titulo: 'El cubo que se abre', pieza: 'alg-cubo-3d',
    consigna: 'Gira el cubo con el dedo y ábrelo. Cambia a y b: mira qué piezas crecen entre las dos esquinas.',
    controles: [
      { id: 'a', etiqueta: 'a', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      { id: 'b', etiqueta: 'b', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      { id: 'abrir', etiqueta: 'Abrir', min: 0, max: 1, paso: 0.25, inicio: 0, decimales: 2 },
    ],
    dibujo: v => ({ datos: { a: v.a, b: v.b, abrir: v.abrir }, estado: {} }),
    lectura: v => {
      const c = cuentaCubo(v), t = c.tipos;
      return [`(a + b)³ = ${f(c.suma)}: `, { v: 'c-o', t: f(t.a3.volumen) }, ' + ', { v: 'c-d', t: f(3 * t.a2b.volumen) }, ' + ',
        { v: 'c-f', t: f(3 * t.ab2.volumen) }, ' + ', { v: 'c-i', t: f(t.b3.volumen) }];
    },
    invitaciones: [
      { texto: 'Abre el cubo: logra que a³ y b³ juntos superen a las seis del medio.',
        logrado: v => v.abrir >= 0.5 && vol(v, 'a3') + vol(v, 'b3') > 3 * (vol(v, 'a2b') + vol(v, 'ab2')),
        bien: 'Pasa solo con a mucho mayor que b. Casi siempre, el medio pesa más.',
        pista: 'Creo que conviene un a grande y un b chico. Ábrelo y compara.' },
      { texto: 'Haz que las seis piezas del medio sean iguales entre sí.',
        logrado: v => vol(v, 'a2b') === vol(v, 'ab2'),
        bien: 'Con a = b, cada pieza del medio mide lo mismo que a³.',
        pista: 'a²b y ab² cambian una letra por otra. ¿Cuándo da igual?' },
      { texto: 'Arma un cubo de volumen 125 y ábrelo del todo.',
        logrado: v => cuentaCubo(v).suma === 125 && v.abrir === 1,
        bien: 'Arista 5: el volumen sale de a + b, no de a³ + b³.',
        pista: '125 = 5 · 5 · 5. ¿Cuánto debe sumar a + b?' },
      { texto: 'Consigue que una sola pieza ab² mida 18.',
        logrado: v => vol(v, 'ab2') === 18,
        bien: '2 · 3 · 3 = 18: dos lados miden b y uno mide a.',
        pista: 'Toca una pieza ab²: dos de sus lados miden b.' },
      { texto: 'Guarda dos cubos con la misma arista y distinto a³ + b³.',
        logrado: (v, guardados) => guardados.some(x => guardados.some(y => x.a + x.b === y.a + y.b
          && vol(x, 'a3') + vol(x, 'b3') !== vol(y, 'a3') + vol(y, 'b3'))),
        bien: 'El total no cambió; las esquinas y el medio se repartieron distinto.' },
    ],
  };

  return {
    unidad: 'algebra.productos-notables',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/alg-baldosas.js', '/plantillas/cuadrado-crece/motor.js', '/nucleo/kit/piezas/alg-cubo-3d.js'],
    historia: {
      texto: 'En La Géométrie, de 1637, Descartes mostró que los problemas de figuras podían escribirse y resolverse con relaciones algebraicas. No inventó cada identidad escolar: su obra continuó una tradición. Aquí las potencias y los productos notables traducen figuras en expresiones, con una salvedad: una partición de áreas explica una igualdad para lados positivos, y extenderla a negativos pide razones algebraicas.',
      pregunta: '¿Una figura demuestra una igualdad para todos los números?',
      fuente: { titulo: 'O’Connor y Robertson, René Descartes — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/' },
    },
    laboratorio: [mesaCubo, mesaRect],
    // Glosario por tema (docs/teoria.md §4d): las palabras que esta unidad estrena en álgebra.
    glosario: [
      { termino: 'producto notable', formas: ['producto notable', 'productos notables'],
        def: 'Multiplicación tan frecuente que su resultado se escribe de memoria, sin hacer toda la cuenta.',
        ejemplo: '(a + b)² = a² + 2ab + b².', ver: ['diferencia de cuadrados', 'identidad'] },
      { termino: 'diferencia de cuadrados', formas: ['diferencia de cuadrados', 'diferencias de cuadrados'],
        def: 'La resta a² − b²; sale de multiplicar la suma por la diferencia: (a + b)(a − b).',
        ejemplo: '7² − 3² = (7 + 3)(7 − 3) = 40.', ver: ['producto notable'] },
      { termino: 'arista', formas: ['arista', 'aristas'], def: 'Cada borde recto de un cubo o de una caja, donde se juntan dos caras.',
        ejemplo: 'Un cubo de arista 3 tiene volumen 3³ = 27.', ver: ['volumen'] },
      { termino: 'volumen', formas: ['volumen', 'volúmenes'], def: 'Cuánto espacio ocupa un cuerpo: en una caja, largo por ancho por alto.',
        ejemplo: 'Una caja de 2 por 1 por 1 tiene volumen 2.', ver: ['arista'] },
      { termino: 'identidad', def: 'Igualdad que se cumple con cualquier valor de las letras, no solo con algunos.',
        ejemplo: '(a + b)² = a² + 2ab + b² vale para todo a y b.' },
      { termino: 'distributiva', formas: ['distributiva', 'distributividad'], def: 'Propiedad que reparte un producto sobre una suma: a(b + c) = ab + ac.',
        ejemplo: '3(x + 2) = 3x + 6.' },
      { termino: 'radical doble', formas: ['radical doble', 'radicales dobles'], def: 'Una raíz con otra raíz adentro, de la forma √(A ± 2√B).',
        ejemplo: '√(5 + 2√6) = √3 + √2, porque 3 + 2 = 5 y 3 · 2 = 6.', ver: ['radical'] },
      { termino: 'denominador', def: 'El número de abajo en una fracción: entre cuánto se divide.', ejemplo: 'En 3/4 es el 4.' },
      { termino: 'racionalizar', formas: ['racionalizar', 'racionaliza', 'racionalización'],
        def: 'Cambiar una fracción por otra de igual valor cuyo denominador ya no tenga raíces.',
        ejemplo: '1/√2 = √2/2.', ver: ['conjugado', 'denominador'] },
      { termino: 'conjugado', formas: ['conjugado', 'conjugados', 'conjugada'],
        def: 'La misma pareja de términos con el signo del medio cambiado: √a − √b y √a + √b.',
        ejemplo: '(√5 − √3)(√5 + √3) = 5 − 3 = 2.', ver: ['racionalizar', 'diferencia de cuadrados'] },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'cubo-se-abre': ['cuadrado-suma'],
      'rectangulo-x-p-q': ['cuadrado-suma'],
    },
    ideas: [notables, dobles, racionalizar],
  };
});
