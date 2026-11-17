/*
 * Teoría de «Productos notables» (algebra.productos-notables), unidad nueva del 17 nov: sale de «Exponentes, radicales y
 * productos notables», que Gerson aprobó partir en dos como Magnitudes y Vectores (docs/etapa3/decisiones.md, «Segunda
 * ronda»; docs/etapa3/propuesta-algebra-exponentes.md §9, pregunta 1). La unidad vieja conserva su id como «Exponentes y
 * radicales» (contenido/teoria/algebra/exponentes-y-productos-notables.js). Avance.migrar (nucleo/avance.js) pasa a esta
 * unidad lo hecho en `cuadrado-suma`, `radicales-dobles`, `racionalizar` y las mesas `cubo-se-abre` y `rectangulo-x-p-q`.
 *
 * Etapa 3, fase 2 del método (18 nov): está rehecha SOLO la idea 1, «El cuadrado de una suma» (`cuadrado-suma`), para
 * el visto bueno de Gerson. Las otras dos ideas que vinieron (`radicales-dobles` y `racionalizar`) siguen como estaban,
 * con sus colores viejos (abajo) y la numeración de ideas del comentario original (4 y 5), hasta que les toque; las
 * nuevas de la propuesta (`suma-por-diferencia` y `cubo-binomio`) todavía no están. Por eso la unidad no declara
 * calidad: 2; productos-notables.test.js corre la idea 1 sola con calidad 2. Las mesas `cubo-se-abre` y
 * `rectangulo-x-p-q` siguen en la idea 1 hasta que existan sus ideas (cubo-binomio y suma-por-diferencia).
 * Objeto de la primera pantalla de la idea 1: el terreno cuadrado de Juan, en Juliaca, que compra una franja por el
 * costado y otra por el fondo (pieza alg-objeto, objeto 'terreno', dibujo de prueba). La predicción cede franjas (una
 * resta): nada antes de ella (título, Resumen, glosario, pestaña Ejemplos) usa el cuadrado de una resta (Gerson, 18 nov).
 *
 * REGLA DE COLORES DE LA UNIDAD (idea 1; docs/molde-unidad.md §5b; decisiones, 17 nov): un color fijo por magnitud,
 * en la tabla COLORES (def.colores):
 *   - naranja (c-o): el primer término, a (el lado de antes del terreno) y su cuadrado a²;
 *   - turquesa (c-i): el segundo término, b (el ancho de las franjas) y la esquina b²;
 *   - violeta (c-f): las piezas del medio que se olvidan, el doble producto 2ab (las dos franjas); y la letra de una
 *     alternativa, en negrita;
 *   - tinta: el total (a + b)², lo que queda al ceder y lo que se pide con «?»;
 *   - ni carmín (es de los ángulos) ni verde (iría junto al naranja).
 *
 * Molde: docs/teoria.md. Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 3), expediente teoria-152-unidades
 * (Álgebra y sus precisiones: la figura de áreas ilustra lados positivos; la identidad vale por distributividad) e
 * historia-ecuaciones (pp. 57–68). Errores: AL8, AL9 y AL11 de docs/investigacion/algebra-funciones-ideas-erroneas.md;
 * los TAL-* son hipótesis de diseño (rutinas/teoria-algebra.md).
 * Colores viejos de las ideas 4 y 5 y de las mesas (regla 4): a naranja (c-o), b turquesa (c-i), lo que se suma o
 * resulta verde (c-d), lo que falta o el contraejemplo rojo (c-h).
 *
 * Ronda 2 (14 nov 2026): laboratorio con el rectángulo (x + p)(x + q) de dos esquinas y el cubo que se abre (3D). Las
 * ideas 4 y 5 juegan con tablas: no hay figura que agarrar. La idea 1 conserva el gesto directo de la ronda 2 (las
 * esquinas del terreno de antes y del terreno nuevo), ahora sobre el terreno.
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

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba productos-notables.test.js) ----------
  // Solo la idea 1 está rehecha (18 nov); las ideas viejas conservan sus colores hasta que les toque.
  const COLORES = { 'primer término': 'o', 'segundo término': 'i', 'doble producto': 'f', 'letra de alternativa': 'f' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: String(t), m: mg });
  const T1 = ficha('primer término'), T2 = ficha('segundo término'), DP = ficha('doble producto');
  const aa = T1('a'), bb = T2('b');
  const SEP = '   ·   ';
  // La letra de una alternativa, en negrita (Gerson, mesa de revisión, 17 nov), en violeta como en la unidad hermana.
  // El U+2060 (invisible) evita que la letra sola salga en cursiva como una variable.
  const letra = L => ({ v: 'c-f', t: `${L}⁠`, m: 'doble producto' });
  // Texto plano de partes (para comparar opciones).
  const txt = x => (Array.isArray(x) ? x.map(txt).join('') : x && typeof x === 'object' ? (x.t !== undefined ? String(x.t) : '') : String(x));
  function opcionesP(correcta, distractores) {
    const ops = [{ id: 'c', texto: correcta, correcta: true }], vistos = new Set([txt(correcta)]);
    for (const x of distractores) {
      const t = txt(x.texto);
      if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue;
      vistos.add(t);
      ops.push({ id: x.id, texto: x.texto, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  function conCuatro(caso, r) {
    for (let i = 0; i < 80; i++) { const c = caso(r); if (c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  const z = x => (x < 0 ? `−${-x}` : String(x));

  // ---------- Idea 1 (rehecha, 18 nov): el cuadrado de una suma ----------
  // Propuesta aprobada: docs/etapa3/propuesta-algebra-exponentes.md (§1 a §6, idea 4, la primera de Productos notables).
  // Objeto de la primera pantalla: el terreno cuadrado de Juan, en Juliaca, que compra una franja por el costado y otra
  // por el fondo para que siga cuadrado (pieza alg-objeto, objeto 'terreno', dibujo de prueba).
  // Cambia: el lado de antes (a) y el ancho de las franjas (b). · Permanece: la escala del terreno (11 por m). · Progresa:
  // las cuatro piezas del terreno nuevo: a², dos franjas ab y la esquina b². · Se reserva: ceder franjas, una resta (la
  // predicción: el vecino cede 2 m de un terreno de 7 m). · Debe verse: (a + b)² = a² + 2ab + b²; el 2ab no se olvida.
  // Nada antes de Predice dice qué pasa con una resta (Gerson, 18 nov: ni el título, ni el Resumen, ni la pestaña
  // Ejemplos): ningún ejemplo ni término del glosario usa (a − b)²; «Ahora tú» sí, ya después de predecir.
  // Errores (hipótesis de diseño; AL8 de docs/investigacion/algebra-funciones-ideas-erroneas.md, parcial): AL8 (a ± b)² =
  // a² ± b² · TAL-2AB cuenta una sola franja ab («omitir el término cruzado», Kombat y otros 2023, estudios débiles; trampa
  // de San Marcos 2025-I) · TAL-ESQUINA en una resta quita las dos franjas y no devuelve la esquina (o se olvida de b²) ·
  // TAL-SIGNO cambia el signo del doble producto o de la esquina · TAL-RAIZ-FALTA da el área cuando se pide el lado.
  const TE = datos => ({ pieza: 'alg-objeto', datos: Object.assign({ objeto: 'terreno' }, datos), estado: {} });
  const ESC_T = 11;   // el juego: a + b llega a 16 m, 176 px
  const DF = {
    suma: ['(', aa, ' + ', bb, ')² = ', aa, '² + 2', aa, bb, ' + ', bb, '²'],
    resta: ['(', aa, ' − ', bb, ')² = ', aa, '² − 2', aa, bb, ' + ', bb, '²'],
    area: 'Área de un cuadrado = lado · lado',
    dist: 'Propiedad distributiva: p · (q + r) = p · q + p · r',
  };
  // Un término con su coeficiente: 1·x² → «x²», 4·x² → «4x²».
  const ct = (c, v) => (c === 1 ? v : `${c}${v}`);
  // Ahora tú 1: desarrollar el cuadrado de una suma.
  function casoDesarrolla(r) {
    const p = r.uno([1, 1, 2, 3]), k = r.ent(2, 9), x = ct(p, 'x');
    const op = (c2, c1, c0) => [[ct(c2, 'x²'), c1 ? ` + ${ct(c1, 'x')}` : '', c0 ? ` + ${c0}` : ''].join('')];
    return {
      pregunta: ['Desarrolla (', T1(x), ' + ', T2(k), ')².'],
      datos: [DF.suma],
      opciones: opcionesP(op(p * p, 2 * p * k, k * k), [
        { id: 'al8', texto: op(p * p, 0, k * k), error: 'AL8', siFuera: `Bien los dos cuadrados. Pero faltan las dos franjas del medio: 2 · ${x} · ${k}.` },
        { id: 'una', texto: op(p * p, p * k, k * k), error: 'TAL-2AB', siFuera: `Bien que pongas el producto ${x} · ${k}. Pero son dos franjas: va dos veces.` },
        { id: 'esquina', texto: op(p * p, 2 * p * k, 0), error: 'TAL-ESQUINA', siFuera: `Bien el doble producto. Falta la esquina: ${k}² = ${k * k}.` },
      ]),
      solucion: { texto: 'Dos cuadrados y el doble producto en el medio.', ecuacion: ['(', T1(x), ' + ', T2(k), ')² = ', T1(ct(p * p, 'x²')), ' + ', DP(ct(2 * p * k, 'x')), ' + ', T2(k * k)] },
    };
  }
  // Ahora tú 2: el cuadrado de una resta (ya después de predecir).
  function casoResta(r) {
    const k = r.ent(2, 9);
    const op = (s1, c1, s0, c0) => [`x² ${s1} ${c1}x ${s0} ${c0}`.replace(/ \+ 0x| − 0x/, '')];
    return {
      pregunta: ['Desarrolla (', T1('x'), ' − ', T2(k), ')².'],
      datos: [DF.resta],
      opciones: opcionesP(op('−', 2 * k, '+', k * k), [
        { id: 'al8', texto: [`x² − ${k * k}`], error: 'AL8', siFuera: `Bien los dos cuadrados. Pero faltan las dos franjas: 2 · x · ${k}, que se restan.` },
        { id: 'esquina', texto: op('−', 2 * k, '−', k * k), error: 'TAL-ESQUINA', siFuera: `Restar las dos franjas está bien. Pero la esquina se quitó dos veces: se devuelve, + ${k * k}.` },
        { id: 'signo', texto: op('+', 2 * k, '+', k * k), error: 'TAL-SIGNO', siFuera: 'Bien las tres piezas. Pero en una resta las dos franjas se quitan: van con −.' },
      ]),
      solucion: { texto: 'Se quitan las dos franjas y se devuelve la esquina.', ecuacion: ['(', T1('x'), ' − ', T2(k), ')² = ', T1('x²'), ' − ', DP(`${2 * k}x`), ' + ', T2(k * k)] },
    };
  }
  // Ahora tú 3: un número al cuadrado sin multiplicar (con suma o con resta).
  function casoNumero(r) {
    const M = r.uno([20, 30, 40, 50, 60, 70, 80, 90, 100]), d = r.ent(1, 3), mas = r() < 0.5, N = mas ? M + d : M - d, sg = mas ? 1 : -1;
    const bien = M * M + sg * 2 * M * d + d * d;
    return {
      pregunta: `¿Cuánto vale ${N}², sin hacer la multiplicación larga?`,
      datos: [`${N} = ${M} ${mas ? '+' : '−'} ${d}`, mas ? DF.suma : DF.resta],
      opciones: opcionesP([String(bien)], [
        { id: 'al8', texto: [String(M * M + sg * d * d)], error: 'AL8', siFuera: `Bien ${M}² y ${d}². Pero faltan las dos franjas: 2 · ${M} · ${d} = ${2 * M * d}.` },
        { id: 'una', texto: [String(M * M + sg * M * d + d * d)], error: 'TAL-2AB', siFuera: `Bien la franja de ${M * d}. Pero son dos: ${2 * M * d}.` },
        { id: 'esquina', texto: [String(M * M + sg * 2 * M * d - (mas ? 0 : d * d))], error: 'TAL-ESQUINA', siFuera: mas ? `Bien el doble producto. Falta la esquina: ${d}² = ${d * d}.` : `Bien quitar las dos franjas. Pero la esquina se devuelve: + ${d * d}.` },
      ]),
      solucion: { texto: `Se escribe ${N} como ${M} ${mas ? '+' : '−'} ${d} y se arma el cuadrado.`, ecuacion: [`(${M} ${mas ? '+' : '−'} ${d})² = `, T1(M * M), ` ${mas ? '+' : '−'} `, DP(2 * M * d), ' + ', T2(d * d), ` = ${bien}`] },
    };
  }
  // Ahora tú 4 (nivel examen): a² + b² sin conocer a ni b.
  function casoSumaProducto(r) {
    let x, y;
    do { x = r.ent(1, 9); y = r.ent(1, 9); } while (x === y);
    const S = x + y, P = x * y, bien = S * S - 2 * P;
    return {
      pregunta: ['Si ', aa, ' + ', bb, ` = ${S} y `, aa, bb, ` = ${P}, ¿cuánto vale `, aa, '² + ', bb, '²?'],
      datos: [DF.suma],
      opciones: opcionesP([String(bien)], [
        { id: 'al8', texto: [String(S * S)], error: 'AL8', siFuera: `${S}² está bien calculado. Pero ahí están también las dos franjas ab: hay que quitarlas.` },
        { id: 'una', texto: [String(S * S - P)], error: 'TAL-2AB', siFuera: `Quitar las franjas está bien. Pero son dos: 2 · ${P}.` },
        { id: 'signo', texto: [String(S * S + 2 * P)], error: 'TAL-SIGNO', siFuera: `Bien el doble producto, 2 · ${P}. Pero ya está dentro de ${S}²: se resta.` },
      ]),
      solucion: { texto: 'Al cuadrado de la suma se le quitan las dos franjas.', ecuacion: [aa, '² + ', bb, `² = ${S}² − `, DP(`2 · ${P}`), ` = ${bien}`] },
    };
  }
  // Ahora tú 5 (nivel examen): un terreno partido en dos cuadrados y dos rectángulos iguales; se pide el lado.
  const raizT = v => { const q = Math.sqrt(v); return Number.isInteger(q) ? String(q) : `≈ ${f(q, 1)}`; };
  function casoFigura(r) {
    let x, y;
    do { x = r.ent(2, 9); y = r.ent(1, 7); } while (x === y);
    const X = x * x + y * y, Y = x * y, L = x + y;
    return {
      pregunta: `Un terreno cuadrado se parte en dos cuadrados y dos rectángulos iguales. Los dos cuadrados suman ${X} m² y cada rectángulo mide ${Y} m². ¿Cuánto mide el lado del terreno?`,
      datos: [DF.area],
      dibujo: TE({ a: x, b: y, lados: false, total: false, rot: { a2: '?', b2: '?', ab: `${Y} m²` } }),
      opciones: opcionesP([`${L} m`], [
        { id: 'una', texto: [`${raizT(X + Y)} m`], error: 'TAL-2AB', siFuera: `Bien sumar las piezas y sacar la raíz. Pero son dos rectángulos: ${X} + 2 · ${Y}.` },
        { id: 'al8', texto: [`${raizT(X)} m`], error: 'AL8', siFuera: `Bien que uses los dos cuadrados, ${X} m². Pero el terreno también tiene los dos rectángulos.` },
        { id: 'raiz', texto: [`${L * L} m`], error: 'TAL-RAIZ-FALTA', siFuera: `${L * L} m² es el área del terreno, bien sumada. Falta sacar la raíz: piden el lado.` },
      ]),
      solucion: { texto: 'El área son las cuatro piezas; el lado es su raíz.', ecuacion: [`${X} + `, DP(`2 · ${Y}`), ` = ${L * L}   →   lado = √${L * L} = ${L}`] },
    };
  }

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h). Cuentas rehechas aparte (scratchpad,
  // cuentas-productos1.py): (8 + 3)² = 121; (x + 4)² = x² + 8x + 16; en (x + 7)², 14x; 31² = 961; (5 + 3)² = 64 contra
  // 34; (3x + 2)² = 9x² + 12x + 4; x² + 10x + 25 = (x + 5)²; a + b = 9, ab = 20 → 41; 2,1² = 4,41; 15² − 12² = 81 =
  // 2 · 12 · 3 + 9; 34 + 2 · 15 = 64 → 8 (errores 7 y √34); a + b = 7, ab = 12 → 25 (errores 49, 37, 73);
  // (√3 + √2)² = 5 + 2√6; x + 1/x = 5 → 23 (errores 25, 27, 24); 2 · 3 · a + 9 = 69 → a = 10 (errores 11,5 y 13).
  // Ninguno usa (a − b)² ni una franja que se cede (es la predicción); ninguna figura muestra lo que se pide.
  const EJEMPLOS_CUADRADO = [
    { nivel: 1, titulo: 'El terreno nuevo',
      enunciado: ['Un terreno cuadrado de ', T1(8), ' m de lado se amplía con una franja de ', T2(3), ' m por el costado y otra por el fondo. ¿Cuántos m² mide ahora?'],
      datos: [DF.area],
      figura: TE({ a: 8, b: 3, total: '?' }),
      solucion: [{ texto: 'El terreno nuevo tiene cuatro piezas: el de antes, dos franjas de 8 por 3 y la esquina de 3 por 3.', ecuacion: [T1(64), ' + ', DP(24), ' + ', DP(24), ' + ', T2(9), ' = 121 = 11²'] }],
      respuesta: '121 m²' },
    { nivel: 1, titulo: 'Desarrollar un cuadrado',
      enunciado: ['Desarrolla (', T1('x'), ' + ', T2(4), ')².'],
      datos: [DF.suma],
      solucion: [{ texto: 'a es x y b es 4: los dos cuadrados y, en el medio, dos veces x por 4.', ecuacion: ['(', T1('x'), ' + ', T2(4), ')² = ', T1('x²'), ' + ', DP('8x'), ' + ', T2(16)] }],
      respuesta: [T1('x²'), ' + ', DP('8x'), ' + ', T2(16)] },
    { nivel: 1, titulo: 'El doble producto',
      enunciado: ['En el desarrollo de (', T1('x'), ' + ', T2(7), ')², ¿cuál es el doble producto?'],
      datos: [DF.suma],
      solucion: [{ texto: 'El doble producto es dos veces el primer término por el segundo: las dos franjas del medio.', ecuacion: ['2 · ', T1('x'), ' · ', T2(7), ' = ', DP('14x')] }],
      respuesta: ['El doble producto es ', DP('14x')] },
    { nivel: 1, titulo: 'Un número al cuadrado',
      enunciado: '¿Cuánto vale 31², sin hacer la multiplicación larga?',
      datos: ['31 = 30 + 1', DF.suma],
      solucion: [{ texto: '31 es 30 + 1: el cuadrado de 30, dos franjas de 30 por 1 y la esquina de 1 por 1.', ecuacion: ['(', T1(30), ' + ', T2(1), ')² = ', T1(900), ' + ', DP(60), ' + ', T2(1), ' = 961'] }],
      respuesta: '31² = 961' },
    { nivel: 1, titulo: '¿Basta con los cuadrados?',
      enunciado: ['¿Es (', T1(5), ' + ', T2(3), ')² igual a ', T1(5), '² + ', T2(3), '²?'],
      datos: [DF.suma],
      solucion: [{ texto: '(5 + 3)² = 8² = 64, pero 5² + 3² = 25 + 9 = 34. Faltan las dos franjas: 2 · 5 · 3 = 30.', ecuacion: ['64 = 34 + ', DP(30)] }],
      respuesta: ['No: falta el doble producto, ', DP(30)] },
    { nivel: 2, titulo: 'Con un coeficiente',
      enunciado: ['Desarrolla (', T1('3x'), ' + ', T2(2), ')².'],
      datos: [DF.suma],
      solucion: [
        { texto: 'El primer término es 3x: su cuadrado es 3x · 3x = 9x², no 3x².', ecuacion: [{ sup: [{ par: [T1('3x')] }, '2'] }, ' = ', T1('9x²')] },
        { texto: 'El doble producto: 2 · 3x · 2 = 12x. La esquina: 2² = 4.', ecuacion: ['(', T1('3x'), ' + ', T2(2), ')² = ', T1('9x²'), ' + ', DP('12x'), ' + ', T2(4)] },
      ],
      respuesta: [T1('9x²'), ' + ', DP('12x'), ' + ', T2(4)] },
    { nivel: 2, titulo: 'La esquina que falta',
      enunciado: ['¿Qué número hay que sumarle a ', T1('x²'), ' + ', DP('10x'), ' para que sea el cuadrado de un binomio?'],
      datos: [DF.suma],
      solucion: [
        { texto: 'x² es el cuadrado del primer término, x. Las dos franjas, 10x, son 2 · x · b: entonces b = 5.', ecuacion: [DP('10x'), ' = 2 · ', T1('x'), ' · ', T2(5)] },
        { texto: 'Falta la esquina, b²: 5² = 25. Así queda un cuadrado completo.', ecuacion: [T1('x²'), ' + ', DP('10x'), ' + ', T2(25), ' = (', T1('x'), ' + ', T2(5), ')²'] },
      ],
      respuesta: ['Hay que sumarle ', T2(25)] },
    { nivel: 2, titulo: 'Suma y producto',
      enunciado: ['Si ', aa, ' + ', bb, ' = 9 y ', aa, bb, ' = 20, ¿cuánto vale ', aa, '² + ', bb, '²?'],
      datos: [DF.suma],
      solucion: [
        { texto: 'El cuadrado de la suma trae a² + b² y, además, las dos franjas ab.', ecuacion: ['9² = ', aa, '² + ', bb, '² + ', DP('2 · 20')] },
        { texto: 'Le quito las dos franjas.', ecuacion: [aa, '² + ', bb, '² = 81 − ', DP(40), ' = 41'] },
      ],
      respuesta: [aa, '² + ', bb, '² = 41'] },
    { nivel: 2, titulo: 'Con decimales',
      enunciado: '¿Cuánto vale 2,1², sin calculadora?',
      datos: ['2,1 = 2 + 0,1', DF.suma],
      solucion: [
        { texto: 'Escribo 2,1 como 2 + 0,1: un cuadrado de 2, dos franjas de 2 por 0,1 y una esquina chiquita.', ecuacion: ['(', T1(2), ' + ', T2('0,1'), ')² = ', T1(4), ' + ', DP('0,4'), ' + ', T2('0,01')] },
        { texto: 'Se suman las tres partes.', ecuacion: ['4 + 0,4 + 0,01 = 4,41'] },
      ],
      respuesta: '2,1² = 4,41' },
    { nivel: 2, titulo: 'Lo que compró Juan',
      enunciado: ['El terreno de Juan medía ', T1(12), ' m de lado y compró franjas de ', T2(3), ' m por el costado y por el fondo. ¿Cuántos m² compró?'],
      datos: [DF.area, DF.suma],
      figura: TE({ a: 12, b: 3, total: false, rot: { ab: '?', b2: '?' } }),
      solucion: [
        { texto: 'Compró las dos franjas, de 12 por 3, y la esquina, de 3 por 3.', ecuacion: [DP('2 · 12 · 3'), ' + ', T2('3²'), ' = ', DP(72), ' + ', T2(9), ' = 81'] },
        { texto: 'Lo reviso: el terreno nuevo mide 15² = 225 y el de antes, 12² = 144. La diferencia es 81. Cuadra.' },
      ],
      respuesta: '81 m²' },
    { nivel: 3, titulo: 'Las piezas de un terreno',
      enunciado: 'Un terreno cuadrado se parte en dos cuadrados y dos rectángulos iguales. Los dos cuadrados suman 34 m² y cada rectángulo mide 15 m². ¿Cuánto mide el lado del terreno?',
      alternativas: ['7 m', '8 m', '√34 m', '64 m', '6 m'],
      datos: [DF.area],
      figura: TE({ a: 5, b: 3, lados: false, total: false, rot: { a2: '?', b2: '?', ab: '15 m²' } }),
      solucion: [
        { texto: 'El área del terreno son sus cuatro piezas: los dos cuadrados y los dos rectángulos.', ecuacion: ['34 + ', DP('2 · 15'), ' = 64'] },
        { texto: 'El lado es la raíz del área.', ecuacion: ['lado = √64 = 8'] },
        { texto: ['La ', letra('A'), ' cuenta un solo rectángulo: √(34 + 15) = 7. La ', letra('D'), ' da el área, no el lado.'] },
      ],
      respuesta: [letra('B'), ', 8 m'] },
    { nivel: 3, titulo: 'Sin conocer los números',
      enunciado: ['Si ', aa, ' + ', bb, ' = 7 y ', aa, bb, ' = 12, ¿cuánto vale ', aa, '² + ', bb, '²?'],
      alternativas: ['49', '37', '25', '1', '73'],
      datos: [DF.suma],
      solucion: [
        { texto: 'No hace falta hallar a ni b. El cuadrado de la suma trae a² + b² más las dos franjas.', ecuacion: ['7² = ', aa, '² + ', bb, '² + ', DP('2 · 12')] },
        { texto: 'Le quito las dos franjas: 49 − 24 = 25. (Con 3 y 4: 9 + 16 = 25. Cuadra.)', ecuacion: [aa, '² + ', bb, '² = 49 − ', DP(24), ' = 25'] },
        { texto: ['La ', letra('A'), ' no quita las franjas; la ', letra('B'), ' quita una sola; la ', letra('E'), ' las suma.'] },
      ],
      respuesta: [letra('C'), ', 25'] },
    { nivel: 3, titulo: 'Con raíces',
      enunciado: ['Desarrolla (', T1('√3'), ' + ', T2('√2'), ')².'],
      alternativas: ['5', '5 + √6', '5 + 2√6', '25', '6 + 2√5'],
      datos: [DF.suma, '√a · √b = √(a · b), con a, b ≥ 0'],
      solucion: [
        { texto: 'Los dos cuadrados: (√3)² = 3 y (√2)² = 2. El doble producto: 2 · √3 · √2 = 2√6.', ecuacion: ['(', T1('√3'), ' + ', T2('√2'), ')² = ', T1(3), ' + ', DP('2√6'), ' + ', T2(2)] },
        { texto: 'Se juntan los números sin raíz: 3 + 2 = 5.', ecuacion: ['5 + ', DP('2√6')] },
        { texto: ['La ', letra('A'), ' se olvida de las franjas, y la ', letra('B'), ' cuenta una sola.'] },
      ],
      respuesta: [letra('C'), ', 5 + ', DP('2√6')] },
    { nivel: 3, titulo: 'Un número y su inverso',
      enunciado: 'Si x + 1/x = 5, ¿cuánto vale x² + 1/x²?',
      alternativas: ['25', '23', '27', '24', '10'],
      datos: [DF.suma, 'x · (1/x) = 1, con x ≠ 0'],
      solucion: [
        { texto: 'Elevo al cuadrado los dos lados: a es x y b es 1/x. El doble producto es 2 · x · (1/x) = 2.', ecuacion: ['(', T1('x'), ' + ', T2('1/x'), ')² = ', T1('x²'), ' + ', DP(2), ' + ', T2('1/x²'), ' = 25'] },
        { texto: 'Le quito el doble producto a los dos lados.', ecuacion: ['x² + 1/x² = 25 − ', DP(2), ' = 23'] },
        { texto: ['La ', letra('A'), ' se olvida del doble producto; la ', letra('C'), ' lo suma, y la ', letra('D'), ' quita solo 1.'] },
      ],
      respuesta: [letra('B'), ', 23'] },
    { nivel: 3, titulo: 'El lado de antes',
      enunciado: 'Juan amplía su terreno cuadrado con franjas de 3 m por el costado y por el fondo, y el área crece 69 m². ¿Cuánto medía el lado de antes?',
      alternativas: ['10 m', '11,5 m', '13 m', '23 m', '7 m'],
      datos: [DF.area, DF.suma],
      figura: TE({ a: 10, b: 3, ladoA: '?', total: false }),
      solucion: [
        { texto: 'Lo que crece son las dos franjas y la esquina: 2 · a · 3 + 3² = 6a + 9.', ecuacion: [DP('6a'), ' + ', T2(9), ' = 69'] },
        { texto: 'Despejo: 6a = 60, así que a = 10. Lo reviso: 13² − 10² = 169 − 100 = 69. Cuadra.', ecuacion: ['6a = 60   →   a = 10'] },
        { texto: ['La ', letra('B'), ' se olvida de la esquina: 69 ÷ 6. La ', letra('C'), ' da el lado nuevo.'] },
      ],
      respuesta: [letra('A'), ', ', T1('10 m')] },
  ];

  // «Mira»: el vecino cede las dos franjas, paso a paso (la situación de la predicción).
  const MIRA_CEDE = { objeto: 'terreno', modo: 'cede', a: 7, b: 2, escala: 22, total: false, pasos: [
    {}, { costado: true, piezas: true }, { costado: true, fondo: true, esquina: 'doble' },
    { costado: true, fondo: true, esquina: 'devuelta' }, { costado: true, fondo: true, esquina: 'devuelta', resto: '25 m²' },
  ] };
  const notables = {
    id: 'cuadrado-suma',
    titulo: 'El cuadrado de una suma',
    pregunta: '¿Por qué (a + b)² no es a² + b²?',
    temas: ['Productos notables'],
    pieza: 'alg-objeto',
    aprendizaje: '(a + b)² son cuatro piezas: a², b² y dos rectángulos ab; con una resta, se quitan las dos franjas y la esquina se devuelve.',
    actividad: 'Ampliar un terreno cuadrado por dos lados y medir sus piezas.',
    // Lee: el terreno, el binomio y la distributiva. No dice qué piezas salen (es el juego) ni qué pasa al ceder.
    lee: {
      tarjetas: [
        { titulo: 'El terreno de Juan', texto: 'Juan tiene en Juliaca un terreno cuadrado de 10 m de lado: 10 · 10 = 100 m². Quiere comprar una franja por el costado y otra por el fondo, del mismo ancho, para que siga cuadrado.',
          pieza: 'alg-objeto', dibujo: TE({ a: 10, b: 2, comprar: true, total: false, rot: { a2: '100 m²' }, escala: ESC_T }) },
        { titulo: 'Un binomio al cuadrado', texto: 'El lado nuevo mide 10 + 2: una suma de dos términos, un binomio. El área es lado por lado: (10 + 2)(10 + 2), que se escribe (10 + 2)². Multiplicaciones así, que salen tanto, se llaman productos notables.',
          ecuacion: ['(', T1(10), ' + ', T2(2), ')(', T1(10), ' + ', T2(2), ') = (', T1(10), ' + ', T2(2), ')²'] },
        { titulo: 'Multiplicar una suma', texto: 'Para multiplicar por una suma, se multiplica cada sumando y se junta todo: 3 · (x + 2) = 3x + 6. Es la propiedad distributiva.',
          ecuacion: ['3 · (x + 2) = 3 · x + 3 · 2 = 3x + 6'] },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a cambiar el lado del terreno, ', aa, ', y el ancho de las franjas, ', bb, '. Mira qué piezas forman el terreno nuevo y cuánto mide cada una.'] },
      ],
    },
    ejemplos: EJEMPLOS_CUADRADO,
    juega: {
      pieza: 'alg-objeto',
      consigna: 'Juan amplía su terreno cuadrado con una franja por el costado y otra por el fondo, del mismo ancho, para que siga cuadrado.',
      mision: {
        texto: ['El terreno de Juan mide ', T1(10), ' m de lado. Amplíalo por dos lados hasta 144 m².'],
        logrado: val => val.a === 10 && val.b === 2,
        bien: 'Listo: 2 m por lado no suman 4 m²: suman dos franjas y una esquina.',
      },
      voz: 'Cuenta las piezas del terreno nuevo.',
      leyenda: [
        { s: aa, t: 'lado del terreno de antes' },
        { s: bb, t: 'ancho de cada franja comprada' },
        { s: T1('a²'), t: 'el terreno de antes' },
        { s: DP('ab'), t: 'cada franja: a de largo, b de ancho' },
        { s: T2('b²'), t: 'la esquina que completa el cuadrado' },
        { s: '(a + b)²', t: 'el terreno nuevo, de lado a + b' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Lado de antes, a (m)', color: 'c-o', min: 4, max: 12, paso: 1, inicio: 10, decimales: 0 },
        { id: 'b', etiqueta: 'Ancho de las franjas, b (m)', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => TE({ a: v.a, b: v.b, piezas: true, escala: ESC_T }),
      // La relación: el terreno nuevo son cuatro piezas.
      lectura: v => [`(${v.a} + ${v.b})² = ${(v.a + v.b) ** 2}: `, T1(v.a * v.a), ' + ', DP(v.a * v.b), ' + ', DP(v.a * v.b), ' + ', T2(v.b * v.b)],
      minimo: 3,
      // Gesto directo: la esquina del terreno de antes cambia a; la esquina de afuera, b (escala fija de la pieza).
      arrastres: [
        { id: 'esquina-a', etiqueta: 'esquina del terreno de antes', color: 'c-o',
          donde: v => { const g = Kit.piezas['alg-objeto'].geometria(TE({ a: v.a, b: v.b, escala: ESC_T }).datos); return { x: g.x0 + g.A, y: g.y0 + g.A }; },
          mover: (pt, v) => { const g = Kit.piezas['alg-objeto'].geometria(TE({ a: v.a, b: v.b, escala: ESC_T }).datos); return { a: ((pt.x - g.x0) + (pt.y - g.y0)) / 2 / g.k }; } },
        { id: 'esquina-b', etiqueta: 'esquina de afuera del terreno nuevo', color: 'c-i',
          donde: v => { const g = Kit.piezas['alg-objeto'].geometria(TE({ a: v.a, b: v.b, escala: ESC_T }).datos); return { x: g.x0 + g.W2, y: g.y0 + g.W2 }; },
          mover: (pt, v) => { const g = Kit.piezas['alg-objeto'].geometria(TE({ a: v.a, b: v.b, escala: ESC_T }).datos); return { b: ((pt.x - g.x0 - g.A) + (pt.y - g.y0 - g.A)) / 2 / g.k }; } },
      ],
    },
    predice: {
      pregunta: 'El vecino de Juan tiene un terreno cuadrado de 7 m de lado. Cede una franja de 2 m por el costado y otra por el fondo para la vereda, y le queda un cuadrado. ¿Cuántos m² le quedan?',
      datos: ['Terreno de 7 m de lado', 'Franjas de 2 m de ancho'],
      voz: 'Piensa qué parte del terreno está en las dos franjas.',
      opciones: [
        { id: 'c', texto: '25 m²', correcta: true },
        { id: 'al8', texto: '45 m²', error: 'AL8', siFuera: 'Bien que le quites algo a 49. Pero no se quita un cuadrito de 2 · 2, sino dos franjas.' },
        { id: 'esquina', texto: '21 m²', error: 'TAL-ESQUINA', siFuera: 'Bien: dos franjas de 7 · 2. Pero la esquina estaba en las dos: se quitó dos veces.' },
        { id: 'una', texto: '35 m²', error: 'TAL-2AB', siFuera: 'Quitar una franja de 14 m² está bien. Pero son dos: el costado y el fondo.' },
      ],
      dibujo: TE({ modo: 'cede', a: 7, b: 2, escala: 22, costado: true, fondo: true, resto: '?', total: false }),
      revelar: TE({ modo: 'cede', a: 7, b: 2, escala: 22, costado: true, fondo: true, esquina: 'doble', piezas: true, resto: '25 m²', total: false }),
      coincide: 'Coincide: quedan 5 · 5 = 25 m². Las dos franjas se pisan en la esquina.',
      noCoincide: 'Revisemos: lo que queda es un cuadrado de 7 − 2 = 5 m de lado.',
    },
    mira: {
      pieza: 'alg-objeto',
      datos: MIRA_CEDE,
      voz: 'Quitemos una franja a la vez.',
      pasos: [
        { estado: { paso: 0 }, texto: 'El terreno del vecino: un cuadrado de 7 m de lado.', ecuacion: [T1(7), '² = 49'] },
        { estado: { paso: 1 }, texto: 'Ceder la franja del costado quita 7 · 2 = 14 m².', ecuacion: ['49 − ', DP(14), ' = 35'] },
        { estado: { paso: 2 }, texto: 'La del fondo quita otros 14, pero la esquina ya se había quitado.', ecuacion: ['35 − ', DP(14), ' = 21'] },
        { estado: { paso: 3 }, texto: 'Se devuelve la esquina una vez: 2 · 2 = 4 m².', ecuacion: ['21 + ', T2(4), ' = 25'] },
        { estado: { paso: 4 }, texto: 'Queda un cuadrado de 5 m de lado. Con letras:', ecuacion: ['(', aa, ' − ', bb, ')² = ', aa, '² − 2', aa, bb, ' + ', bb, '²'] },
      ],
    },
    regla: {
      texto: 'El cuadrado de un binomio son cuatro piezas: dos cuadrados y dos rectángulos iguales, el doble producto. Con una resta, el doble producto se quita y la esquina se suma.',
      ecuacion: ['(', aa, ' + ', bb, ')² = ', aa, '² + ', { llave: ['2', aa, bb], nota: 'doble producto', color: 'c-f' }, ' + ', bb, '²', SEP,
        '(', aa, ' − ', bb, ')² = ', aa, '² − ', { llave: ['2', aa, bb], nota: 'se quita', color: 'c-f' }, ' + ', bb, '²'],
      condicion: 'Vale para todo a y b, también negativos o con letras; el terreno solo muestra lados positivos.',
      voz: 'Dos cuadrados y dos franjas: no se olvida ninguna.',
    },
    // Así se resuelve: cuántos m² compra Juan (las dos franjas y la esquina). «Ahora tú» pide otra cosa: desarrollar,
    // un cuadrado con resta, un número al cuadrado, a² + b² con la suma y el producto, o el lado de un terreno partido.
    resuelve: {
      pieza: 'alg-objeto',
      generar(s) {
        const r = azar(s + 900), A = r.ent(6, 12), B = r.ent(1, 4), compra = 2 * A * B + B * B;
        return {
          enunciado: ['El terreno de Juan mide ', T1(A), ' m de lado. Compra una franja de ', T2(B), ' m por el costado y otra por el fondo. ¿Cuántos m² compra?'],
          datos: [DF.area, DF.suma],
          dibujo: TE({ a: A, b: B, total: false, rot: { ab: '?', b2: '?' } }),
          pasos: [
            { tipo: 'pide', texto: 'Piden lo que compra, no el terreno entero: las piezas nuevas.' },
            { tipo: 'regla', texto: 'El terreno nuevo, de lado a + b, tiene cuatro piezas. Las nuevas son las dos franjas ab y la esquina b².', ecuacion: DF.suma },
            { tipo: 'cuentas', texto: `Dos franjas de ${A} por ${B} y una esquina de ${B} por ${B}.`,
              ecuacion: [DP(`2 · ${A} · ${B}`), ' + ', T2(`${B}²`), ' = ', DP(2 * A * B), ' + ', T2(B * B), ` = ${compra}`], dibujo: TE({ a: A, b: B, total: false, piezas: true }) },
            { tipo: 'sentido', texto: `Lo reviso: el terreno nuevo mide ${(A + B) ** 2} m² y el de antes, ${A * A}; la diferencia es ${(A + B) ** 2 - A * A}. Cuadra.` },
          ],
          respuesta: `Compra ${compra} m²`,
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-objeto',
      voz: 'Dos cuadrados y dos franjas: revisa los signos.',
      generar(sem) {
        const r = azar(sem + 23), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoDesarrolla, r);
        if (tipo === 1) return conCuatro(casoResta, r);
        if (tipo === 2) return conCuatro(casoNumero, r);
        if (tipo === 3) return conCuatro(casoSumaProducto, r);
        return conCuatro(casoFigura, r);
      },
    },
  };

  // Escala fija de alg-baldosas en la mesa del rectángulo (x + p)(x + q): un tramo de menos de 56 px muestra solo su letra.
  const ESC_N = 24;   // px por unidad: a + b llega a 8 y el lado a 192 px, lo que cabe en la pieza
  // Con la escala fija, un tramo de menos de 56 px muestra solo su letra (el valor está en el control y la lectura).
  const rot = (t, v, val = v) => (v * ESC_N >= 56 ? `${t} = ${val}` : t);

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
    version: '0.3.0',
    // Un color fijo por magnitud (cabecera); lo comprueba productos-notables.test.js (hoy en la idea 1).
    colores: COLORES,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-objeto.js', '/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/alg-baldosas.js', '/plantillas/cuadrado-crece/motor.js', '/nucleo/kit/piezas/alg-cubo-3d.js'],
    // Historia (18 nov): la de Descartes no se pudo comprobar en su fuente y salió. Esta sí está comprobada en el texto
    // completo (docs/investigacion/historia-ganchos.md, verificación del 8 nov: Rosen 1831, pp. 13-16; MacTutor, 1999).
    historia: {
      texto: 'En Bagdad, en el siglo IX, al-Juarismi resolvió x² + 10x = 39 con una figura: un cuadrado x² y dos rectángulos pegados a sus lados, que juntos suman 39. Para completar un cuadrado grande le faltaba una esquina de 5 por 5. Con ella, 39 + 25 = 64: un cuadrado de lado 8, así que x = 8 − 5 = 3. Lo escribió con palabras, sin letras: la identidad del terreno de Juan.',
      pregunta: '¿Qué pieza le faltaba para completar el cuadrado?',
      fuente: { titulo: 'Rosen (1831), The Algebra of Mohammed ben Musa, pp. 13-16', url: 'https://archive.org/details/algebraofmohamme00khuwuoft' },
    },
    laboratorio: [mesaCubo, mesaRect],
    // «raíz» (de una ecuación) se define en Ecuaciones; aquí no se marca: la raíz de esta unidad es la raíz cuadrada.
    glosarioSin: ['raíz'],
    // Glosario por tema (docs/teoria.md §4d): las palabras que esta unidad estrena en álgebra.
    glosario: [
      // Los cuatro que estrena la idea 1 (rehecha, 18 nov), con su aproximación (simple) y tres ejemplos. Ninguno muestra
      // el cuadrado de una resta (es la predicción).
      { termino: 'producto notable', formas: ['producto notable', 'productos notables'],
        def: 'Multiplicación que aparece tanto que conviene reconocer sus piezas sin hacer toda la cuenta.',
        simple: 'Una multiplicación de forma conocida, como (a + b)², que se arma con piezas.', ver: ['binomio', 'doble producto'],
        ejemplos: ['(a + b)² = a² + 2ab + b².', '(x + 3)² = x² + 6x + 9.', '(2x + 1)² = 4x² + 4x + 1.'] },
      { termino: 'binomio', formas: ['binomio', 'binomios'], def: 'Expresión de dos términos sumados o restados.',
        simple: 'Dos términos unidos por un + o un −.', ver: ['producto notable', 'binomio de Newton'],
        ejemplos: ['a + b es un binomio.', 'x − 5 también: sus términos son x y −5.', '(10 + 2)² es el cuadrado de un binomio.'] },
      { termino: 'doble producto', formas: ['doble producto', 'dobles productos'], def: 'Dos veces el producto de los dos términos de un binomio: 2ab.',
        simple: 'Las dos franjas iguales del medio: 2 · a · b.', ver: ['binomio'],
        ejemplos: ['En (x + 3)², es 2 · x · 3 = 6x.', 'En (10 + 2)², es 2 · 10 · 2 = 40.', 'Es lo que falta si se cree que (a + b)² = a² + b².'] },
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
        simple: 'Multiplicar una suma es multiplicar cada sumando y juntar.',
        ejemplos: ['3(x + 2) = 3x + 6.', '5 · 12 = 5 · 10 + 5 · 2 = 60.', '(a + b)(a + b) = aa + ab + ba + bb.'] },
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
