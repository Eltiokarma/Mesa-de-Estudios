/*
 * Teoría de «Productos notables» (algebra.productos-notables), unidad nueva del 17 nov: sale de «Exponentes, radicales y
 * productos notables», que Gerson aprobó partir en dos como Magnitudes y Vectores (docs/etapa3/decisiones.md, «Segunda
 * ronda»; docs/etapa3/propuesta-algebra-exponentes.md §9, pregunta 1). La unidad vieja conserva su id como «Exponentes y
 * radicales» (contenido/teoria/algebra/exponentes-y-productos-notables.js). Avance.migrar (nucleo/avance.js) pasa a esta
 * unidad lo hecho en `cuadrado-suma`, `radicales-dobles`, `racionalizar` y las mesas `cubo-se-abre` y `rectangulo-x-p-q`
 * (las ideas 2 y 3 son nuevas: nadie tiene avance viejo en ellas).
 *
 * Etapa 3 del método (18 nov): las cinco ideas rehechas contra el contrato, en el orden de la propuesta aprobada
 * (docs/etapa3/propuesta-algebra-exponentes.md, Productos notables, con todas sus recomendaciones; decisiones.md, rondas
 * 2 a 4): 1 «El cuadrado de una suma» (`cuadrado-suma`, el terreno de Juan; visto bueno de Gerson el 18 nov), 2 «Suma
 * por diferencia» (`suma-por-diferencia`, nueva: el triplay de la carpintería), 3 «El cubo de una suma» (`cubo-binomio`,
 * nueva: el taco de madera), 4 «Dos números que suman y multiplican» (`radicales-dobles`, reescrita: la mesa de cuatro
 * planchas) y 5 «Racionalizar es multiplicar por uno» (`racionalizar`, reescrita: la cometa). Cada objeto es de la pieza
 * alg-objeto (dibujo de prueba). La unidad declara calidad: 2.
 * Nada antes de Predice (título, pregunta del Resumen, Lee, glosario) delata su respuesta, y los ejemplos de nivel 1 no
 * usan la situación de la predicción (Gerson, 18 nov; productos-notables.test.js lo comprueba).
 *
 * REGLA DE COLORES DE LA UNIDAD (docs/molde-unidad.md §5b; decisiones, 17 nov): un color fijo por magnitud, en la tabla
 * COLORES (def.colores):
 *   - naranja (c-o): el primer término, a (el lado de antes, la plancha, el primer tramo del taco), sus a², a³; la plancha
 *     x de la mesa y √x; el primer radicando √a;
 *   - turquesa (c-i): el segundo término, b (la franja, la esquina, el segundo tramo), sus b², b³; la plancha y y √y; √b;
 *   - violeta (c-f): las piezas del medio que se olvidan: el doble producto 2ab (las dos franjas, las dos planchas
 *     rectangulares √(xy)), las piezas a²b del cubo y px, qx de (x + p)(x + q); los lados del tablero (a + b y a − b); el
 *     factor que vale 1 al racionalizar; y la letra de una alternativa, en negrita;
 *   - tinta: el total ((a + b)², (a + b)³, la mesa, la cometa), las piezas ab² del cubo, lo que se pide con «?»;
 *   - ni carmín (es de los ángulos) ni verde (iría junto al naranja), tampoco en las mesas del laboratorio (cubo-se-abre
 *     con datos.colores; rectangulo-x-p-q con q en tinta).
 *
 * Molde: docs/teoria.md. Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 3), expediente teoria-152-unidades
 * (Álgebra y sus precisiones: la figura de áreas ilustra lados positivos; la identidad vale por distributividad) e
 * historia-ecuaciones (pp. 57–68). Errores: AL8, AL9 y AL11 de docs/investigacion/algebra-funciones-ideas-erroneas.md;
 * los TAL-* son hipótesis de diseño (rutinas/teoria-algebra.md).
 * Laboratorio: el rectángulo (x + p)(x + q) de dos esquinas cuelga de la idea 2 y el cubo que se abre (3D), de la idea 3.
 * La idea 1 conserva el gesto directo de la ronda 2 (las esquinas del terreno de antes y del terreno nuevo).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    return r;
  }
  const mcd = (x, y) => { x = Math.abs(x); y = Math.abs(y); while (y) [x, y] = [y, x % y]; return x; };
  // √k escrito sin raíz si k es un cuadrado perfecto.
  const esCuad = k => Number.isInteger(Math.sqrt(k));
  const rz = k => (esCuad(k) ? String(Math.sqrt(k)) : `√${k}`);

  const BALD = () => Kit.piezas['alg-baldosas'];

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba productos-notables.test.js) ----------
  const COLORES = { 'primer término': 'o', 'segundo término': 'i', 'doble producto': 'f', 'piezas del medio': 'f',
    'lados del tablero': 'f', 'factor uno': 'f', 'letra de alternativa': 'f' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: String(t), m: mg });
  const T1 = ficha('primer término'), T2 = ficha('segundo término'), DP = ficha('doble producto');
  const PM = ficha('piezas del medio'), LT = ficha('lados del tablero'), F1 = ficha('factor uno');
  const aa = T1('a'), bb = T2('b');
  const SEP = '   ·   ';
  // La letra de una alternativa, en negrita (Gerson, mesa de revisión, 17 nov), en violeta como en la unidad hermana.
  // El U+2060 (invisible) evita que la letra sola salga en cursiva como una variable.
  const letra = L => ({ v: 'c-f', t: `${L}⁠`, m: 'letra de alternativa' });
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

  // Polinomio con sus signos: [3, −2, 5] con 'x' → «3x² − 2x + 5» (coeficientes de mayor a menor grado; los 0 no van).
  function poli(cs, v = 'x') {
    const g = cs.length - 1, pot = n => (n === 0 ? '' : n === 1 ? v : `${v}${{ 2: '²', 3: '³', 4: '⁴' }[n]}`);
    let t = '';
    cs.forEach((c, i) => {
      if (!c) return;
      const n = g - i, m = Math.abs(c), cuerpo = n === 0 ? String(m) : `${m === 1 ? '' : m}${pot(n)}`;
      t += t ? ` ${c < 0 ? '−' : '+'} ${cuerpo}` : `${c < 0 ? '−' : ''}${cuerpo}`;
    });
    return t || '0';
  }
  const sg = x => (x < 0 ? '−' : '+');

  // ---------- Idea 2 (nueva, 18 nov): suma por diferencia ----------
  // Propuesta aprobada: docs/etapa3/propuesta-algebra-exponentes.md (§1 a §6, idea 5). Objeto de la primera pantalla: la
  // plancha cuadrada de triplay de la carpintería, a la que se le corta una esquina; la tira que sobra se gira y se pega
  // al costado (pieza alg-objeto, objeto 'triplay', dibujo de prueba).
  // Cambia: el lado de la plancha (a), el de la esquina (b) y si el tablero ya está armado (f). · Permanece: la escala
  // (13 por dm). · Progresa: la L que queda se vuelve un tablero de a + b por a − b. · Se reserva: multiplicar dos números
  // cercanos (la predicción: 31 · 29); el juego nunca lo hace (b va de 2 a 4). · Debe verse: (a + b)(a − b) = a² − b².
  // Errores (hipótesis de diseño): TAL-DIFCUAD-FALTA se olvida de quitar la esquina · TAL-DIFCUAD-SUMA la suma ·
  // TAL-DIFCUAD-2B resta 2b en vez de b² · TAL-COEF no eleva el coeficiente · TAL-MEDIO deja piezas del medio que se
  // anulan · TAL-XPQ-CAMBIA cambia la suma y el producto de p y q · TAL-XPQ-MEDIO se olvida del término del medio ·
  // TAL-SIGNO un signo · TAL-LEG-DOS y TAL-LEG-CUATRO dividen mal 4ab · TAL-LEG-PROD da a² − b² · TAL-POT-* en a⁴ − b⁴.
  const TR = datos => ({ pieza: 'alg-objeto', datos: Object.assign({ objeto: 'triplay' }, datos), estado: {} });
  const ESC_TR = 13;   // el juego: a + b llega a 16 dm (208 px) y a, a 12 dm (156 px)
  const DF2 = {
    sxd: ['(', aa, ' + ', bb, ')(', aa, ' − ', bb, ') = ', aa, '² − ', bb, '²'],
    xpq: '(x + p)(x + q) = x² + (p + q)x + pq',
    rect: 'Área de un rectángulo = largo · ancho',
  };
  // Ahora tú 1: el producto de dos números cercanos, sin la multiplicación larga.
  function casoCercanos(r) {
    const M = r.uno([20, 30, 40, 50, 60, 70, 80, 90, 100]), d = r.ent(1, 4), N1 = M + d, N2 = M - d, bien = M * M - d * d;
    return {
      pregunta: `¿Cuánto vale ${N1} · ${N2}, sin hacer la multiplicación larga?`,
      datos: [DF2.sxd],
      opciones: opcionesP([String(bien)], [
        { id: 'falta', texto: [String(M * M)], error: 'TAL-DIFCUAD-FALTA', siFuera: `Bien ${M}² = ${M * M}. Pero falta quitar la esquina: ${d}² = ${d * d}.` },
        { id: 'suma', texto: [String(M * M + d * d)], error: 'TAL-DIFCUAD-SUMA', siFuera: `Bien ${M}² y ${d}². Pero la esquina se quita, no se suma.` },
        { id: 'dos', texto: [String(M * M - 2 * d)], error: 'TAL-DIFCUAD-2B', siFuera: `Bien quitarle algo a ${M * M}. Pero se quita ${d}² = ${d * d}, no 2 · ${d}.` },
      ]),
      solucion: { texto: `${N1} y ${N2} son ${M} + ${d} y ${M} − ${d}: una suma por su diferencia.`, ecuacion: [`${N1} · ${N2} = `, T1(`${M}²`), ' − ', T2(`${d}²`), ` = ${bien}`] },
    };
  }
  // Ahora tú 2: desarrollar una suma por su diferencia, con coeficiente.
  function casoSxD(r) {
    const p = r.uno([2, 3, 4, 5]), k = r.ent(1, 9), x = ct(p, 'x');
    return {
      pregunta: ['Desarrolla (', T1(x), ' + ', T2(k), ')(', T1(x), ' − ', T2(k), ').'],
      datos: [DF2.sxd],
      opciones: opcionesP([poli([p * p, 0, -k * k])], [
        { id: 'suma', texto: [poli([p * p, 0, k * k])], error: 'TAL-DIFCUAD-SUMA', siFuera: 'Bien los dos cuadrados. Pero el segundo se resta: es la esquina que se quita.' },
        { id: 'coef', texto: [poli([p, 0, -k * k])], error: 'TAL-COEF', siFuera: `Bien la resta de cuadrados. Pero el primer término es ${x}: su cuadrado es ${p * p}x².` },
        { id: 'medio', texto: [poli([p * p, -2 * p * k, -k * k])], error: 'TAL-MEDIO', siFuera: `Bien los dos cuadrados. Pero las piezas del medio, +${p * k}x y −${p * k}x, se anulan.` },
      ]),
      solucion: { texto: 'Las piezas del medio se anulan: queda el primer cuadrado menos el segundo.', ecuacion: ['(', T1(x), ' + ', T2(k), ')(', T1(x), ' − ', T2(k), ') = ', T1(`${p * p}x²`), ' − ', T2(k * k)] },
    };
  }
  // Ahora tú 3: (x + p)(x + q), con signos.
  function casoXPQ(r) {
    let p, q;
    do { p = r.ent(-9, 9); q = r.ent(-9, 9); } while (!p || !q || p === q || p === -q);
    const s = p + q, m = p * q;
    return {
      pregunta: ['Desarrolla (', T1('x'), ` ${sg(p)} `, T2(Math.abs(p)), `)(`, T1('x'), ` ${sg(q)} ${Math.abs(q)}).`],
      datos: [DF2.xpq],
      opciones: opcionesP([poli([1, s, m])], [
        { id: 'cambia', texto: [poli([1, m, s])], error: 'TAL-XPQ-CAMBIA', siFuera: `Bien p + q = ${z(s)} y p · q = ${z(m)}. Pero la suma va con la x, y el producto, solo.` },
        { id: 'medio', texto: [poli([1, 0, m])], error: 'TAL-XPQ-MEDIO', siFuera: `Bien x² y ${z(m)}. Pero p y q no son opuestos: el medio no se anula.` },
        { id: 'signo', texto: [poli([1, s, -m])], error: 'TAL-SIGNO', siFuera: `Bien el término del medio. Pero p · q = ${z(p)} · ${z(q)} = ${z(m)}: revisa su signo.` },
      ]),
      solucion: { texto: `p = ${z(p)} y q = ${z(q)}: suman ${z(s)} y multiplican ${z(m)}.`, ecuacion: ['(x ', sg(p), ` ${Math.abs(p)})(x `, sg(q), ` ${Math.abs(q)}) = x² `, PM(`${sg(s)} ${Math.abs(s) === 1 ? '' : Math.abs(s)}x`), ` ${sg(m)} ${Math.abs(m)}`] },
    };
  }
  // Ahora tú 4 (nivel examen): con a + b y a − b, el producto ab (Legendre, San Marcos 2026-I).
  function casoLegendre(r) {
    const x = r.ent(3, 9), y = r.ent(1, x - 1), S = x + y, D = x - y, Q = S * S - D * D;
    return {
      pregunta: ['Si ', aa, ' + ', bb, ` = ${S} y `, aa, ' − ', bb, ` = ${D}, ¿cuánto vale `, aa, bb, '?'],
      datos: [DF2.sxd, DF.suma, DF.resta],
      opciones: opcionesP([String(x * y)], [
        { id: 'dos', texto: [String(Q / 2)], error: 'TAL-LEG-DOS', siFuera: `Bien ${S}² − ${D}² = ${Q}. Pero eso es 4ab: se divide entre 4, no entre 2.` },
        { id: 'cuatro', texto: [String(Q)], error: 'TAL-LEG-CUATRO', siFuera: `Bien la resta de cuadrados, ${Q}. Pero eso es 4ab: falta dividir entre 4.` },
        { id: 'prod', texto: [String(S * D)], error: 'TAL-LEG-PROD', siFuera: `${S} · ${D} = ${S * D} está bien: es a² − b². Pero piden ab.` },
      ]),
      solucion: { texto: '(a + b)² − (a − b)² es una suma por diferencia: (2a)(2b) = 4ab.', ecuacion: [`${S}² − ${D}² = ${Q} = 4`, aa, bb, '   →   ', aa, bb, ` = ${x * y}`] },
    };
  }
  // Ahora tú 5 (nivel examen): a⁴ − b⁴ con la suma, la diferencia y la suma de cuadrados.
  function casoCuartas(r) {
    const x = r.ent(2, 6), y = r.ent(1, x - 1), S = x + y, D = x - y, Q = x * x + y * y, bien = Q * S * D;
    return {
      pregunta: ['Si ', aa, ' + ', bb, ` = ${S}, `, aa, ' − ', bb, ` = ${D} y `, aa, '² + ', bb, `² = ${Q}, ¿cuánto vale `, aa, '⁴ − ', bb, '⁴?'],
      datos: [DF2.sxd, 'a⁴ = (a²)²'],
      opciones: opcionesP([String(bien)], [
        { id: 'factor', texto: [String(Q * S)], error: 'TAL-POT-FACTOR', siFuera: `Bien ${Q} · ${S}. Pero a² − b² = (a + b)(a − b): falta el factor ${D}.` },
        { id: 'cuad', texto: [String((S * D) ** 2)], error: 'TAL-POT-CUAD', siFuera: `${S} · ${D} = ${S * D} es a² − b², bien. Pero a⁴ − b⁴ no es su cuadrado.` },
        { id: 'suma', texto: [String(Q + S * D)], error: 'TAL-POT-SUMA', siFuera: `Bien a² + b² = ${Q} y a² − b² = ${S * D}. Pero se multiplican, no se suman.` },
      ]),
      solucion: { texto: 'a⁴ − b⁴ = (a² + b²)(a² − b²), y a² − b² = (a + b)(a − b).', ecuacion: [aa, '⁴ − ', bb, `⁴ = ${Q} · ${S} · ${D} = ${bien}`] },
    };
  }

  // Ejemplos resueltos de la idea 2. Cuentas rehechas aparte (scratchpad, cuentas-productos-f3.py): 9 + 2 = 11 y 9 − 2 = 7;
  // (x + 6)(x − 6) = x² − 36; x² − 49 = (x + 7)(x − 7); 12² − 5² = 119; 7² − 3² = 10 · 4 = 40; 52 · 48 = 2496;
  // (3x + 4)(3x − 4) = 9x² − 16; (x + 5)(x + 3) = x² + 8x + 15; (x + 7)(x − 4) = x² + 3x − 28; 75² − 25² = 5000;
  // a + b = 9, a − b = 5 → ab = 14 (56, 28, 45); (x + 1)⁴ − (x − 1)⁴ = 8x³ + 8x; a³ − b³ = 7, a⁶ − b⁶ = 63 → a³ = 8;
  // (x + 1)(x + 4) − (x + 2)(x + 3) = −2; 1001 · 999 − 1000² = −1. El nivel 1 no multiplica dos números cercanos (es la
  // predicción); ninguna figura muestra lo que se pide.
  const BALD_XPQ = (p, q) => ({ pieza: 'alg-baldosas', estado: {}, datos: {
    anchos: [{ t: 'x', v: 6, color: 'o' }, { t: String(p), v: p, color: 'i' }], altos: [{ t: 'x', v: 6, color: 'o' }, { t: String(q), v: q }],
    celdas: [[{ t: 'x²', color: 'o' }, { t: '', color: 'f' }], [{ t: '', color: 'f' }, { t: '' }]], escala: 16,
    alt: `Rectángulo de x + ${p} por x + ${q}: un cuadrado x², dos piezas del medio y una esquina` } });
  const EJEMPLOS_SXD = [
    { nivel: 1, titulo: 'El tablero de la carpintería',
      enunciado: ['Una plancha cuadrada de triplay mide ', T1(9), ' dm de lado. Se le corta una esquina de ', T2(2), ' dm de lado y se arma un tablero. ¿Cuánto mide de largo y de ancho?'],
      datos: [DF2.sxd],
      figura: TR({ a: 9, b: 2, f: 0 }),
      solucion: [{ texto: 'Al girar la tira, un lado de la plancha crece lo que mide la esquina y el otro baja lo mismo.', ecuacion: [LT('9 + 2 = 11'), ' y ', LT('9 − 2 = 7')] }],
      respuesta: [LT('11 dm'), ' por ', LT('7 dm')] },
    { nivel: 1, titulo: 'Desarrollar',
      enunciado: ['Desarrolla (', T1('x'), ' + ', T2(6), ')(', T1('x'), ' − ', T2(6), ').'],
      datos: [DF2.sxd],
      solucion: [{ texto: 'a es x y b es 6: el cuadrado del primero menos el del segundo.', ecuacion: ['(', T1('x'), ' + ', T2(6), ')(', T1('x'), ' − ', T2(6), ') = ', T1('x²'), ' − ', T2(36)] }],
      respuesta: [T1('x²'), ' − ', T2(36)] },
    { nivel: 1, titulo: 'Al revés',
      enunciado: ['Escribe ', T1('x²'), ' − ', T2(49), ' como un producto.'],
      datos: [DF2.sxd],
      solucion: [{ texto: 'x² es el cuadrado de x y 49 es el cuadrado de 7: la regla se lee de derecha a izquierda.', ecuacion: [T1('x²'), ' − ', T2('7²'), ' = (', T1('x'), ' + ', T2(7), ')(', T1('x'), ' − ', T2(7), ')'] }],
      respuesta: ['(', T1('x'), ' + ', T2(7), ')(', T1('x'), ' − ', T2(7), ')'] },
    { nivel: 1, titulo: 'Lo que queda de la plancha',
      enunciado: ['De una plancha cuadrada de ', T1(12), ' dm de lado se corta una esquina de ', T2(5), ' dm de lado. ¿Cuánto triplay queda?'],
      datos: [DF.area],
      figura: TR({ a: 12, b: 5, f: 0, area: 'Queda: ? dm²' }),
      solucion: [{ texto: 'Queda la plancha menos la esquina.', ecuacion: [T1('12²'), ' − ', T2('5²'), ' = ', T1(144), ' − ', T2(25), ' = 119'] }],
      respuesta: '119 dm²' },
    { nivel: 1, titulo: 'Una resta sin cuadrados',
      enunciado: ['¿Cuánto vale ', T1(7), '² − ', T2(3), '², usando la suma por la diferencia?'],
      datos: [DF2.sxd],
      solucion: [{ texto: 'a es 7 y b es 3: la suma es 10 y la diferencia, 4.', ecuacion: [T1('7²'), ' − ', T2('3²'), ' = ', LT('(7 + 3)'), LT('(7 − 3)'), ' = 10 · 4 = 40'] }],
      respuesta: '40' },
    { nivel: 2, titulo: 'Un producto de cabeza',
      enunciado: '¿Cuánto vale 52 · 48, sin hacer la multiplicación larga?',
      datos: [DF2.sxd],
      solucion: [
        { texto: '52 y 48 están a 2 de 50: uno arriba y el otro abajo.', ecuacion: ['52 · 48 = (', T1(50), ' + ', T2(2), ')(', T1(50), ' − ', T2(2), ')'] },
        { texto: 'Es el cuadrado de 50 menos el de 2.', ecuacion: [T1('50²'), ' − ', T2('2²'), ' = ', T1(2500), ' − ', T2(4), ' = 2496'] },
      ],
      respuesta: '52 · 48 = 2496' },
    { nivel: 2, titulo: 'Con un coeficiente',
      enunciado: ['Desarrolla (', T1('3x'), ' + ', T2(4), ')(', T1('3x'), ' − ', T2(4), ').'],
      datos: [DF2.sxd],
      solucion: [
        { texto: 'El primer término es 3x: su cuadrado es 3x · 3x = 9x², no 3x².', ecuacion: [{ sup: [{ par: [T1('3x')] }, '2'] }, ' = ', T1('9x²')] },
        { texto: 'El segundo es 4: su cuadrado es 16, y se resta.', ecuacion: ['(', T1('3x'), ' + ', T2(4), ')(', T1('3x'), ' − ', T2(4), ') = ', T1('9x²'), ' − ', T2(16)] },
      ],
      respuesta: [T1('9x²'), ' − ', T2(16)] },
    { nivel: 2, titulo: 'Un rectángulo de piezas',
      enunciado: ['Desarrolla (', T1('x'), ' + ', T2(5), ')(', T1('x'), ' + 3).'],
      datos: [DF2.xpq],
      figura: BALD_XPQ(5, 3),
      solucion: [
        { texto: 'El rectángulo tiene cuatro piezas: x², dos piezas del medio, 5x y 3x, y la esquina, 5 · 3.', ecuacion: [T1('x²'), ' + ', PM('5x'), ' + ', PM('3x'), ' + 15'] },
        { texto: 'Las del medio se juntan: 5x + 3x = 8x.', ecuacion: ['(', T1('x'), ' + ', T2(5), ')(', T1('x'), ' + 3) = ', T1('x²'), ' + ', PM('8x'), ' + 15'] },
      ],
      respuesta: [T1('x²'), ' + ', PM('8x'), ' + 15'] },
    { nivel: 2, titulo: 'Signos distintos',
      enunciado: ['Desarrolla (', T1('x'), ' + ', T2(7), ')(', T1('x'), ' − 4).'],
      datos: [DF2.xpq],
      solucion: [
        { texto: 'Aquí p = 7 y q = −4. Su suma, 7 − 4 = 3, va con la x.', ecuacion: ['p + q = 3   →   ', PM('3x')] },
        { texto: 'Su producto, 7 · (−4) = −28, va solo.', ecuacion: ['(', T1('x'), ' + ', T2(7), ')(', T1('x'), ' − 4) = ', T1('x²'), ' + ', PM('3x'), ' − 28'] },
      ],
      respuesta: [T1('x²'), ' + ', PM('3x'), ' − 28'] },
    { nivel: 2, titulo: 'Una resta de cuadrados grandes',
      enunciado: ['¿Cuánto vale ', T1(75), '² − ', T2(25), '², sin elevar al cuadrado?'],
      datos: [DF2.sxd],
      solucion: [
        { texto: 'Es una diferencia de cuadrados: se escribe como la suma por la diferencia.', ecuacion: [T1('75²'), ' − ', T2('25²'), ' = ', LT('(75 + 25)'), LT('(75 − 25)')] },
        { texto: 'La suma da 100 y la diferencia, 50.', ecuacion: ['100 · 50 = 5000'] },
      ],
      respuesta: '5000' },
    { nivel: 3, titulo: 'Suma y diferencia',
      enunciado: ['Si ', aa, ' + ', bb, ' = 9 y ', aa, ' − ', bb, ' = 5, ¿cuánto vale ', aa, bb, '?'],
      alternativas: ['56', '28', '14', '45', '7'],
      datos: [DF2.sxd, DF.suma, DF.resta],
      solucion: [
        { texto: '(a + b)² − (a − b)² es una suma por diferencia de los dos paréntesis.', ecuacion: ['9² − 5² = (9 + 5)(9 − 5) = 14 · 4 = 56'] },
        { texto: 'Esa misma resta, con letras: la suma de los paréntesis da 2a y su diferencia, 2b. Entonces vale 4ab.', ecuacion: ['4', aa, bb, ' = 56   →   ', aa, bb, ' = 14'] },
        { texto: ['La ', letra('A'), ' se queda en 4ab; la ', letra('B'), ' divide entre 2; la ', letra('D'), ' multiplica 9 · 5, que es a² − b².'] },
      ],
      respuesta: [letra('C'), ', 14'] },
    { nivel: 3, titulo: 'Cuartas potencias',
      enunciado: 'Reduce (x + 1)⁴ − (x − 1)⁴.',
      alternativas: ['8x³ + 8x', '0', '4x', '8x³', '2x⁴ + 2'],
      datos: [DF2.sxd, DF.suma, DF.resta],
      solucion: [
        { texto: 'Es una diferencia de cuadrados: el primero es (x + 1)² y el segundo, (x − 1)².', ecuacion: ['[(x + 1)² + (x − 1)²] · [(x + 1)² − (x − 1)²]'] },
        { texto: 'La suma da 2x² + 2. En la resta se van x² y 1, y queda el doble producto dos veces: 4x.', ecuacion: ['(2x² + 2) · 4x = 8x³ + 8x'] },
        { texto: ['La ', letra('B'), ' cree que todo se anula; la ', letra('C'), ' se queda con un solo factor.'] },
      ],
      respuesta: [letra('A'), ', 8x³ + 8x'] },
    { nivel: 3, titulo: 'Sextas potencias',
      enunciado: 'Si a³ − b³ = 7 y a⁶ − b⁶ = 63, ¿cuánto vale a³?',
      alternativas: ['8', '9', '1', '56', '4,5'],
      datos: [DF2.sxd, 'a⁶ = (a³)²'],
      solucion: [
        { texto: 'a⁶ − b⁶ es una diferencia de cuadrados: los de a³ y b³.', ecuacion: ['63 = (a³ + b³)(a³ − b³) = (a³ + b³) · 7'] },
        { texto: 'Entonces a³ + b³ = 9. Se suma con a³ − b³ = 7: se van las b³.', ecuacion: ['2a³ = 9 + 7 = 16   →   a³ = 8'] },
        { texto: ['La ', letra('B'), ' se queda en a³ + b³; la ', letra('C'), ' da b³; la ', letra('D'), ' resta 63 − 7.'] },
      ],
      respuesta: [letra('A'), ', 8'] },
    { nivel: 3, titulo: 'Una diferencia constante',
      enunciado: 'Reduce (x + 1)(x + 4) − (x + 2)(x + 3).',
      alternativas: ['−2', '2', '0', '10', '2x + 2'],
      datos: [DF2.xpq],
      solucion: [
        { texto: 'Los dos productos tienen p + q = 5: los dos traen x² y el mismo término del medio, 5x.', ecuacion: ['(x + 1)(x + 4) = x² + ', PM('5x'), ' + 4'] },
        { texto: 'El otro es x² + 5x + 6. Al restar, se van x² y 5x: queda 4 − 6.', ecuacion: ['(x² + ', PM('5x'), ' + 4) − (x² + ', PM('5x'), ' + 6) = −2'] },
        { texto: ['La ', letra('B'), ' resta al revés; la ', letra('C'), ' cree que todo se anula.'] },
      ],
      respuesta: [letra('A'), ', −2'] },
    { nivel: 3, titulo: 'Un número enorme',
      enunciado: '¿Cuánto vale 1001 · 999 − 1000²?',
      alternativas: ['0', '−1', '1', '−2', '1999'],
      datos: [DF2.sxd],
      solucion: [
        { texto: '1001 es 1000 + 1 y 999 es 1000 − 1: una suma por su diferencia.', ecuacion: ['1001 · 999 = ', T1('1000²'), ' − ', T2('1²')] },
        { texto: 'Al restar 1000², solo queda la esquina, con signo menos.', ecuacion: [T1('1000²'), ' − ', T2(1), ' − ', T1('1000²'), ' = −1'] },
        { texto: ['La ', letra('A'), ' se olvida de la esquina; la ', letra('C'), ' la suma.'] },
      ],
      respuesta: [letra('B'), ', −1'] },
  ];

  // «Mira» de la idea 2: 31 · 29 (la predicción), como un cuadrado de 30 sin la esquina de 1.
  const MIRA_SXD = { objeto: 'triplay', a: 30, b: 1, unidad: '', pasos: [
    { soloTablero: true, rot: { tablero: '?' }, area: '31 · 29 = ?' },
    { f: 1, area: '31 = 30 + 1 y 29 = 30 − 1' },
    { f: 0, area: '30 · 30 = 900, sin la esquina de 1 · 1' },
    { f: 1, area: '900 − 1 = 899' },
  ] };
  const sumaPorDif = {
    id: 'suma-por-diferencia',
    titulo: 'Suma por diferencia',
    pregunta: '¿Cómo se calcula 31 · 29 sin multiplicar?',
    temas: ['Productos notables'],
    pieza: 'alg-objeto',
    aprendizaje: 'Una plancha a² sin su esquina b² se rearma en un tablero de a + b por a − b: (a + b)(a − b) = a² − b².',
    actividad: 'Cortar la esquina de un triplay y rearmarlo en un tablero.',
    // Lee: la plancha, la esquina que se corta y lo que queda. No dice cuánto miden los lados del tablero (es el juego).
    lee: {
      tarjetas: [
        { titulo: 'El triplay de la carpintería', texto: 'En una carpintería de Juliaca hay una plancha cuadrada de triplay de 10 dm de lado (1 m = 10 dm). Para un pedido le cortan una esquina cuadrada. Con lo que queda van a armar un tablero rectangular.',
          pieza: 'alg-objeto', dibujo: TR({ a: 10, b: 2, f: 0, escala: ESC_TR, area: 'Plancha: 100 dm²' }) },
        { titulo: 'Lo que queda', texto: 'La plancha tiene 10 · 10 = 100 dm². Si la esquina mide 2 dm por 2 dm, se van 4 dm² y quedan 96 dm², en forma de L. Ese triplay no se bota: la tira de abajo se corta y se gira.',
          ecuacion: [T1('10²'), ' − ', T2('2²'), ' = 100 − 4 = 96'] },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a elegir el lado de la plancha, ', aa, ', y el de la esquina, ', bb, '. Mira cuánto miden los lados del tablero que se arma y compáralos con a y b.'] },
      ],
    },
    ejemplos: EJEMPLOS_SXD,
    juega: {
      pieza: 'alg-objeto',
      consigna: 'En la carpintería cortan la esquina de una plancha de triplay. La tira de abajo se gira y se pega al costado: sale un tablero.',
      mision: {
        texto: ['La plancha mide ', T1(10), ' dm. Arma un tablero de 13 dm por 7 dm.'],
        logrado: val => val.a === 10 && val.b === 3 && val.f === 1,
        bien: 'Un lado creció 3 y el otro bajó 3: es la plancha sin su esquina.',
      },
      voz: 'Mira los lados del tablero: uno crece y el otro baja.',
      leyenda: [
        { s: aa, t: 'lado de la plancha' },
        { s: bb, t: 'lado de la esquina que se corta' },
        { s: T1('a²'), t: 'la plancha entera' },
        { s: T2('b²'), t: 'la esquina cortada' },
        { s: LT('a + b'), t: 'el lado largo del tablero' },
        { s: LT('a − b'), t: 'el lado corto del tablero' },
        { s: 'dm', t: 'decímetro: 10 dm = 1 m' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Lado de la plancha, a (dm)', color: 'c-o', min: 6, max: 12, paso: 1, inicio: 8, decimales: 0 },
        { id: 'b', etiqueta: 'Lado de la esquina, b (dm)', color: 'c-i', min: 2, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'f', etiqueta: 'La tira', opciones: [{ valor: 0, texto: 'Cortada' }, { valor: 1, texto: 'Girada: tablero' }] },
      ],
      dibujo: v => TR({ a: v.a, b: v.b, f: v.f, escala: ESC_TR, area: v.f ? `Tablero: ${v.a * v.a - v.b * v.b} dm²` : `Queda: ${v.a * v.a - v.b * v.b} dm²` }),
      // La relación: lo que queda de la plancha es el tablero.
      lectura: v => (v.f
        ? [LT(v.a + v.b), ' · ', LT(v.a - v.b), ` = ${v.a * v.a - v.b * v.b} dm² = `, T1(`${v.a}²`), ' − ', T2(`${v.b}²`)]
        : [T1(`${v.a}²`), ' − ', T2(`${v.b}²`), ` = ${v.a * v.a} − ${v.b * v.b} = ${v.a * v.a - v.b * v.b} dm²`]),
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuánto vale 31 · 29, sin hacer la multiplicación larga?',
      datos: ['31 = 30 + 1', '29 = 30 − 1', '30 · 30 = 900'],
      voz: 'Piensa en el tablero: un lado creció 1 y el otro bajó 1.',
      opciones: [
        { id: 'c', texto: '899', correcta: true },
        { id: 'falta', texto: '900', error: 'TAL-DIFCUAD-FALTA', siFuera: 'Bien partir de 30 · 30 = 900. Pero falta quitar la esquina de 1 · 1.' },
        { id: 'suma', texto: '901', error: 'TAL-DIFCUAD-SUMA', siFuera: 'Bien partir de 900 y mirar la esquina. Pero la esquina se quita, no se suma.' },
        { id: 'dos', texto: '898', error: 'TAL-DIFCUAD-2B', siFuera: 'Bien quitarle algo a 900. Pero la esquina es 1 · 1 = 1, no 1 + 1.' },
      ],
      dibujo: TR({ a: 30, b: 1, unidad: '', soloTablero: true, rot: { tablero: '?' }, area: '31 · 29 = ?' }),
      revelar: TR({ a: 30, b: 1, f: 1, unidad: '', area: '30 · 30 − 1 · 1 = 899' }),
      coincide: 'Coincide: 31 · 29 = 30² − 1² = 900 − 1 = 899.',
      noCoincide: 'Revisemos: es un cuadrado de 30 por 30 sin una esquina de 1 por 1.',
    },
    mira: {
      pieza: 'alg-objeto',
      datos: MIRA_SXD,
      voz: 'Miremos el rectángulo como un cuadrado sin esquina.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Un rectángulo de 31 por 29: su área es lo que se pide.', ecuacion: ['31 · 29 = ?'] },
        { estado: { paso: 1 }, texto: 'Un lado es 30 + 1 y el otro, 30 − 1.', ecuacion: ['(', T1(30), ' + ', T2(1), ')(', T1(30), ' − ', T2(1), ')'] },
        { estado: { paso: 2 }, texto: 'Es un cuadrado de 30 por 30 sin una esquina de 1 por 1.', ecuacion: [T1('30²'), ' − ', T2('1²')] },
        { estado: { paso: 3 }, texto: 'La tira de abajo se gira y completa el rectángulo.', ecuacion: [T1(900), ' − ', T2(1), ' = 899'] },
        { estado: { paso: 3 }, texto: 'Con letras es una identidad: vale para todo a y b.', ecuacion: DF2.sxd },
      ],
    },
    regla: {
      texto: 'La suma por la diferencia de dos términos es el cuadrado del primero menos el del segundo. En (x + p)(x + q), el medio es (p + q)x.',
      ecuacion: ['(', aa, ' + ', bb, ')(', aa, ' − ', bb, ') = ', aa, '² − ', bb, '²', SEP,
        '(x + p)(x + q) = x² + ', { llave: ['(p + q)x'], nota: 'el término del medio', color: 'c-f' }, ' + pq'],
      condicion: 'Vale para todo a y b. Si q = −p, el término del medio se anula y vuelve la suma por diferencia.',
      voz: 'Las piezas del medio se anulan: queda la resta de los cuadrados.',
    },
    // Así se resuelve: el tablero que se arma con una plancha (largo, ancho y área). «Ahora tú» pide otra cosa: un producto
    // de números cercanos, desarrollar, (x + p)(x + q), ab con la suma y la diferencia, o a⁴ − b⁴.
    resuelve: {
      pieza: 'alg-objeto',
      generar(s) {
        const r = azar(s + 900), A = r.ent(6, 12), B = r.ent(2, 4), L = A + B, C = A - B, ar = A * A - B * B;
        return {
          enunciado: ['Una plancha cuadrada de triplay mide ', T1(A), ' dm de lado. Se le corta una esquina de ', T2(B), ' dm de lado y con lo que queda se arma un tablero. ¿Cuánto mide el tablero?'],
          datos: [DF2.sxd, DF2.rect],
          dibujo: TR({ a: A, b: B, f: 0 }),
          pasos: [
            { tipo: 'pide', texto: 'Piden el largo y el ancho del tablero, y su área.' },
            { tipo: 'regla', texto: 'Al girar la tira, un lado de la plancha crece lo que mide la esquina y el otro baja lo mismo: el tablero mide a + b por a − b.', ecuacion: DF2.sxd },
            { tipo: 'cuentas', texto: `Largo: ${A} + ${B} = ${L} dm. Ancho: ${A} − ${B} = ${C} dm.`, ecuacion: [LT(L), ' · ', LT(C), ` = ${ar} dm²`], dibujo: TR({ a: A, b: B, f: 1, area: `Tablero: ${ar} dm²` }) },
            { tipo: 'sentido', texto: `Lo reviso: la plancha tenía ${A * A} dm² y la esquina, ${B * B}. ${A * A} − ${B * B} = ${ar}. Cuadra: no se perdió triplay.` },
          ],
          respuesta: [LT(`${L} dm`), ' por ', LT(`${C} dm`), `: ${ar} dm²`],
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-objeto',
      voz: 'Busca la suma y la diferencia de los mismos dos términos.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoCercanos, r);
        if (tipo === 1) return conCuatro(casoSxD, r);
        if (tipo === 2) return conCuatro(casoXPQ, r);
        if (tipo === 3) return conCuatro(casoLegendre, r);
        return conCuatro(casoCuartas, r);
      },
    },
  };

  // ---------- Idea 3 (nueva, 18 nov): el cubo de una suma ----------
  // Propuesta aprobada: §1 a §6, idea 6. Objeto de la primera pantalla: el taco cúbico de madera que el carpintero corta con
  // tres cortes, uno en cada dirección (pieza alg-objeto, objeto 'taco', dibujo de prueba).
  // Cambia: los tramos a y b de cada arista, y si el taco está abierto. · Permanece: el taco, que abrir no agranda. · Progresa: las
  // ocho piezas: a³, tres a²b, tres ab² y b³. · Se reserva: la suma de dos cubos con la suma y el producto (la predicción:
  // suman 7 y multiplican 10; el juego no llega a 5). · Debe verse: (a + b)³ = a³ + 3a²b + 3ab² + b³.
  // Pregunta del Resumen: «¿Qué piezas forman el cubo de una suma?» (la de la propuesta, «¿Por qué (a + b)³ no es
  // a³ + b³?», descartaba una alternativa de Predice; mismo criterio que en Exponentes y radicales, 17 nov).
  // Errores (hipótesis de diseño; AL11 de docs/investigacion/algebra-funciones-ideas-erroneas.md, con base en Matz; trampa
  // de San Marcos 2024-I): AL11 (a + b)³ = a³ + b³ · TAL-CUBO-SUMA resta 3ab sin multiplicar por a + b · TAL-CUBO-TRES
  // cuenta una pieza de cada tipo · TAL-CUBO-CAMBIA cambia a²b por ab² · TAL-CUBO-UNA olvida un tipo de pieza ·
  // TAL-CUBO-SIGNO el signo de b³ en una resta · TAL-CUBO-CUAD (a − b)² en lugar de a² − ab + b² · TAL-SIGNO.
  const TA = datos => ({ pieza: 'alg-objeto', datos: Object.assign({ objeto: 'taco' }, datos), estado: {} });
  const DF3 = {
    cubo: ['(', aa, ' + ', bb, ')³ = ', aa, '³ + 3', aa, '²', bb, ' + 3', aa, bb, '² + ', bb, '³'],
    cuboR: ['(', aa, ' − ', bb, ')³ = ', aa, '³ − 3', aa, '²', bb, ' + 3', aa, bb, '² − ', bb, '³'],
    sumaC: 'a³ + b³ = (a + b)(a² − ab + b²)',
    difC: 'a³ − b³ = (a − b)(a² + ab + b²)',
    vol: 'Volumen de una caja = largo · ancho · alto',
  };
  // Ahora tú 1: desarrollar el cubo de una suma.
  function casoCubo(r) {
    const k = r.ent(2, 6);
    return {
      pregunta: ['Desarrolla (', T1('x'), ' + ', T2(k), ')³.'],
      datos: [DF3.cubo],
      opciones: opcionesP([poli([1, 3 * k, 3 * k * k, k ** 3])], [
        { id: 'al11', texto: [poli([1, 0, 0, k ** 3])], error: 'AL11', siFuera: `Bien x³ y ${k}³. Pero faltan las seis piezas del medio.` },
        { id: 'tres', texto: [poli([1, k, k * k, k ** 3])], error: 'TAL-CUBO-TRES', siFuera: 'Bien las cuatro clases de piezas. Pero de las del medio hay tres de cada una.' },
        { id: 'cambia', texto: [poli([1, 3 * k * k, 3 * k, k ** 3])], error: 'TAL-CUBO-CAMBIA', siFuera: `Bien los coeficientes 3. Pero con x² va ${k} una vez, y con x va ${k}².` },
      ]),
      solucion: { texto: `Tres piezas x² · ${k} y tres x · ${k}², entre los dos cubos.`, ecuacion: ['(', T1('x'), ' + ', T2(k), ')³ = ', T1('x³'), ' + ', PM(`${3 * k}x²`), ` + ${3 * k * k}x + `, T2(k ** 3)] },
    };
  }
  // Ahora tú 2: el cubo de una resta.
  function casoCuboResta(r) {
    const k = r.ent(2, 6);
    return {
      pregunta: ['Desarrolla (', T1('x'), ' − ', T2(k), ')³.'],
      datos: [DF3.cuboR],
      opciones: opcionesP([poli([1, -3 * k, 3 * k * k, -(k ** 3)])], [
        { id: 'al11', texto: [poli([1, 0, 0, -(k ** 3)])], error: 'AL11', siFuera: `Bien x³ − ${k ** 3}. Pero faltan las piezas del medio.` },
        { id: 'signo', texto: [poli([1, -3 * k, -3 * k * k, -(k ** 3)])], error: 'TAL-SIGNO', siFuera: 'Bien las cuatro piezas. Pero los signos se alternan: −, +, −.' },
        { id: 'esquina', texto: [poli([1, -3 * k, 3 * k * k, k ** 3])], error: 'TAL-CUBO-SIGNO', siFuera: `Bien las tres primeras. Pero (−${k})³ es negativo: −${k ** 3}.` },
      ]),
      solucion: { texto: 'Las mismas cuatro piezas, con los signos alternados.', ecuacion: ['(', T1('x'), ' − ', T2(k), ')³ = ', T1('x³'), ' − ', PM(`${3 * k}x²`), ` + ${3 * k * k}x − `, T2(k ** 3)] },
    };
  }
  // Ahora tú 3: un número al cubo, sin la multiplicación larga.
  function casoCuboNum(r) {
    const M = r.uno([10, 20, 30]), d = r.ent(1, 2), N = M + d, bien = N ** 3;
    return {
      pregunta: `¿Cuánto vale ${N}³, sin hacer la multiplicación larga?`,
      datos: [`${N} = ${M} + ${d}`, DF3.cubo],
      opciones: opcionesP([String(bien)], [
        { id: 'al11', texto: [String(M ** 3 + d ** 3)], error: 'AL11', siFuera: `Bien ${M}³ y ${d}³. Pero faltan las seis piezas del medio.` },
        { id: 'tres', texto: [String(M ** 3 + M * M * d + M * d * d + d ** 3)], error: 'TAL-CUBO-TRES', siFuera: 'Bien las cuatro clases de piezas. Pero del medio hay tres de cada una.' },
        { id: 'una', texto: [String(M ** 3 + 3 * M * M * d + d ** 3)], error: 'TAL-CUBO-UNA', siFuera: `Bien las tres piezas de ${M} · ${M} · ${d}. Faltan las tres de ${M} · ${d} · ${d}.` },
      ]),
      solucion: { texto: `${N} es ${M} + ${d}: los dos cubos y las seis piezas del medio.`, ecuacion: [T1(M ** 3), ' + ', PM(3 * M * M * d), ` + ${3 * M * d * d} + `, T2(d ** 3), ` = ${bien}`] },
    };
  }
  // Ahora tú 4 (nivel examen, San Marcos 2024-I): a³ + b³ con la suma y el producto.
  function casoCuboSP(r) {
    let x, y;
    do { x = r.ent(1, 9); y = r.ent(1, 9); } while (x === y);
    const S = x + y, P = x * y, bien = S ** 3 - 3 * P * S;
    return {
      pregunta: ['Si ', aa, ' + ', bb, ` = ${S} y `, aa, bb, ` = ${P}, ¿cuánto vale `, aa, '³ + ', bb, '³?'],
      datos: [DF3.cubo],
      opciones: opcionesP([String(bien)], [
        { id: 'al11', texto: [String(S ** 3)], error: 'AL11', siFuera: `${S}³ está bien calculado. Pero ahí están también las seis piezas del medio.` },
        { id: 'suma', texto: [String(S ** 3 - 3 * P)], error: 'TAL-CUBO-SUMA', siFuera: `Bien quitar 3ab. Pero las piezas del medio son 3ab(a + b): por ${S}.` },
        { id: 'tres', texto: [String(S ** 3 - P * S)], error: 'TAL-CUBO-TRES', siFuera: `Bien quitar ab(a + b) = ${P * S}. Pero son tres veces: ${3 * P * S}.` },
      ]),
      solucion: { texto: 'Al cubo de la suma se le quitan las seis piezas del medio, 3ab(a + b).', ecuacion: [aa, '³ + ', bb, `³ = ${S}³ − `, PM(`3 · ${P} · ${S}`), ` = ${bien}`] },
    };
  }
  // Ahora tú 5 (nivel examen, San Marcos 2025-I): factorizar una suma o una diferencia de cubos.
  function casoSumaCubos(r) {
    const k = r.ent(1, 6), mas = r() < 0.5, s1 = mas ? '+' : '−', s2 = mas ? '−' : '+', K = k ** 3, kx = ct(k, 'x');
    const fac = (m, c) => `(x ${s1} ${k})(x² ${m} ${c} + ${k * k})`;
    return {
      pregunta: `Factoriza x³ ${s1} ${K}.`,
      datos: [DF3.sumaC, DF3.difC],
      opciones: opcionesP([fac(s2, kx)], [
        { id: 'al11', texto: [`(x ${s1} ${k})³`], error: 'AL11', siFuera: `Bien ver un cubo: ${K} = ${k}³. Pero (x ${s1} ${k})³ trae también las piezas del medio.` },
        { id: 'signo', texto: [fac(s1, kx)], error: 'TAL-SIGNO', siFuera: `Bien el factor x ${s1} ${k}. Pero en el otro, el signo del medio es el contrario.` },
        { id: 'cuad', texto: [fac(s2, ct(2 * k, 'x'))], error: 'TAL-CUBO-CUAD', siFuera: `Bien el primer factor. Pero el segundo es a² ${s2} ab + b², no un cuadrado: va ${kx}.` },
      ]),
      solucion: { texto: `${K} = ${k}³: es una ${mas ? 'suma' : 'diferencia'} de cubos, con a = x y b = ${k}.`, ecuacion: [`x³ ${s1} ${K} = ${fac(s2, kx)}`] },
    };
  }

  // Ejemplos resueltos de la idea 3. Cuentas rehechas aparte (cuentas-productos-f3.py): 3 · 3 · 1 = 9; (x + 2)³ =
  // x³ + 6x² + 12x + 8; (2 + 1)³ = 27 contra 9 (faltan 18 = 12 + 6); 11³ = 1331; en (x + 5)³, 15x²; (x − 3)³ =
  // x³ − 9x² + 27x − 27; (2x + 1)³ = 8x³ + 12x² + 6x + 1; x³ + 8 = (x + 2)(x² − 2x + 4); 8x³ − 27 = (2x − 3)(4x² + 6x + 9);
  // 99³ = 970 299; a + b = 5, ab = 3 → 80; a + b = 4, a³ + b³ = 28 → ab = 3; a − b = 2, ab = 15 → 98; x + 1/x = 3 → 18;
  // a + b = 3, a² + b² = 5 → 9. El nivel 1 no halla a³ + b³ con la suma y el producto (es la predicción).
  const EJEMPLOS_CUBO = [
    { nivel: 1, titulo: 'Las piezas del taco',
      enunciado: ['Un taco cúbico de arista ', T1(3), ' + ', T2(1), ' dm se corta en sus ocho piezas. ¿Cuánto mide cada pieza a²b?'],
      datos: [DF3.vol],
      figura: TA({ a: 3, b: 1, abrir: 1, rot: { a2b: '?' } }),
      solucion: [{ texto: 'Una pieza a²b mide a de largo, a de ancho y b de alto.', ecuacion: [PM('3 · 3 · 1 = 9')] }],
      respuesta: [PM('9 dm³')] },
    { nivel: 1, titulo: 'Desarrollar un cubo',
      enunciado: ['Desarrolla (', T1('x'), ' + ', T2(2), ')³.'],
      datos: [DF3.cubo],
      solucion: [{ texto: 'a es x y b es 2: x³, tres piezas x² · 2, tres x · 2² y 2³.', ecuacion: ['(', T1('x'), ' + ', T2(2), ')³ = ', T1('x³'), ' + ', PM('6x²'), ' + 12x + ', T2(8)] }],
      respuesta: [T1('x³'), ' + ', PM('6x²'), ' + 12x + ', T2(8)] },
    { nivel: 1, titulo: '¿Bastan las esquinas?',
      enunciado: ['¿Es (', T1(2), ' + ', T2(1), ')³ igual a ', T1(2), '³ + ', T2(1), '³?'],
      datos: [DF3.cubo],
      solucion: [{ texto: '(2 + 1)³ = 3³ = 27, pero 2³ + 1³ = 8 + 1 = 9. Faltan las seis piezas del medio: 3 · 4 + 3 · 2 = 18.', ecuacion: ['27 = 9 + ', PM(12), ' + 6'] }],
      respuesta: 'No: faltan las piezas del medio, 18' },
    { nivel: 1, titulo: 'Un número al cubo',
      enunciado: '¿Cuánto vale 11³, sin hacer la multiplicación larga?',
      datos: ['11 = 10 + 1', DF3.cubo],
      solucion: [{ texto: '11 es 10 + 1: el cubo de 10, tres piezas de 10 · 10 · 1, tres de 10 · 1 · 1 y el cubo de 1.', ecuacion: [T1(1000), ' + ', PM(300), ' + 30 + ', T2(1), ' = 1331'] }],
      respuesta: '11³ = 1331' },
    { nivel: 1, titulo: 'Un término del desarrollo',
      enunciado: ['En el desarrollo de (', T1('x'), ' + ', T2(5), ')³, ¿cuál es el término con x²?'],
      datos: [DF3.cubo],
      solucion: [{ texto: 'Es el de las piezas a²b: tres veces x² por 5.', ecuacion: ['3 · ', T1('x²'), ' · ', T2(5), ' = ', PM('15x²')] }],
      respuesta: ['El término es ', PM('15x²')] },
    { nivel: 2, titulo: 'Con una resta',
      enunciado: ['Desarrolla (', T1('x'), ' − ', T2(3), ')³.'],
      datos: [DF3.cuboR],
      solucion: [
        { texto: 'Las mismas cuatro piezas: x³, 3 · x² · 3 = 9x², 3 · x · 9 = 27x y 3³ = 27.', ecuacion: [T1('x³'), '   ', PM('9x²'), '   27x   ', T2(27)] },
        { texto: 'Con la resta, los signos se alternan: −, +, −.', ecuacion: ['(', T1('x'), ' − ', T2(3), ')³ = ', T1('x³'), ' − ', PM('9x²'), ' + 27x − ', T2(27)] },
      ],
      respuesta: [T1('x³'), ' − ', PM('9x²'), ' + 27x − ', T2(27)] },
    { nivel: 2, titulo: 'Con un coeficiente',
      enunciado: ['Desarrolla (', T1('2x'), ' + ', T2(1), ')³.'],
      datos: [DF3.cubo],
      solucion: [
        { texto: 'El primer término es 2x: su cubo es 2x · 2x · 2x = 8x³, y su cuadrado, 4x².', ecuacion: [{ sup: [{ par: [T1('2x')] }, '3'] }, ' = ', T1('8x³')] },
        { texto: 'Las del medio: 3 · 4x² · 1 = 12x² y 3 · 2x · 1 = 6x. La otra esquina: 1.', ecuacion: ['(', T1('2x'), ' + ', T2(1), ')³ = ', T1('8x³'), ' + ', PM('12x²'), ' + 6x + ', T2(1)] },
      ],
      respuesta: [T1('8x³'), ' + ', PM('12x²'), ' + 6x + ', T2(1)] },
    { nivel: 2, titulo: 'Suma de cubos',
      enunciado: ['Factoriza ', T1('x³'), ' + ', T2(8), '.'],
      datos: [DF3.sumaC],
      solucion: [
        { texto: '8 es 2³: es una suma de cubos, con a = x y b = 2.', ecuacion: [T1('x³'), ' + ', T2('2³')] },
        { texto: 'Se aplica la fórmula: a² − ab + b² es x² − 2x + 4.', ecuacion: ['x³ + 8 = (x + 2)(x² − 2x + 4)'] },
      ],
      respuesta: '(x + 2)(x² − 2x + 4)' },
    { nivel: 2, titulo: 'Diferencia de cubos',
      enunciado: ['Factoriza ', T1('8x³'), ' − ', T2(27), '.'],
      datos: [DF3.difC],
      solucion: [
        { texto: '8x³ es (2x)³ y 27 es 3³: a = 2x y b = 3.', ecuacion: [{ sup: [{ par: [T1('2x')] }, '3'] }, ' − ', T2('3³')] },
        { texto: 'a² + ab + b² es 4x² + 6x + 9.', ecuacion: ['8x³ − 27 = (2x − 3)(4x² + 6x + 9)'] },
      ],
      respuesta: '(2x − 3)(4x² + 6x + 9)' },
    { nivel: 2, titulo: 'Casi cien',
      enunciado: '¿Cuánto vale 99³, sin hacer la multiplicación larga?',
      datos: ['99 = 100 − 1', DF3.cuboR],
      solucion: [
        { texto: '99 es 100 − 1: el cubo de una resta.', ecuacion: [T1('100³'), ' − ', PM('3 · 100² · 1'), ' + 3 · 100 · 1² − ', T2('1³')] },
        { texto: 'Con los signos alternados:', ecuacion: ['1 000 000 − ', PM('30 000'), ' + 300 − 1 = 970 299'] },
      ],
      respuesta: '99³ = 970 299' },
    { nivel: 3, titulo: 'Suma y producto',
      enunciado: ['Si ', aa, ' + ', bb, ' = 5 y ', aa, bb, ' = 3, ¿cuánto vale ', aa, '³ + ', bb, '³?'],
      alternativas: ['125', '110', '80', '170', '45'],
      datos: [DF3.cubo],
      solucion: [
        { texto: '(a + b)³ trae a³ + b³ y las seis piezas del medio, que juntas son 3ab(a + b).', ecuacion: ['5³ = ', aa, '³ + ', bb, '³ + ', PM('3 · 3 · 5')] },
        { texto: 'Se quitan las del medio.', ecuacion: [aa, '³ + ', bb, '³ = 125 − ', PM(45), ' = 80'] },
        { texto: ['La ', letra('A'), ' no quita nada; la ', letra('B'), ' quita 3ab sin multiplicar por a + b; la ', letra('D'), ' las suma; la ', letra('E'), ' da el medio.'] },
      ],
      respuesta: [letra('C'), ', 80'] },
    { nivel: 3, titulo: 'Al revés',
      enunciado: ['Si ', aa, ' + ', bb, ' = 4 y ', aa, '³ + ', bb, '³ = 28, ¿cuánto vale ', aa, bb, '?'],
      alternativas: ['3', '9', '12', '36', '1'],
      datos: [DF3.cubo],
      solucion: [
        { texto: 'El cubo de la suma son las dos esquinas y las piezas del medio, 3ab(a + b) = 12ab.', ecuacion: ['4³ = 28 + ', PM('3 · ab · 4'), '   →   64 = 28 + ', PM('12ab')] },
        { texto: 'Se despeja: 12ab = 36. (Con 3 y 1: 27 + 1 = 28. Cuadra.)', ecuacion: [aa, bb, ' = 36 ÷ 12 = 3'] },
        { texto: ['La ', letra('B'), ' se olvida del 3; la ', letra('C'), ' no divide entre a + b; la ', letra('D'), ' se queda en 36.'] },
      ],
      respuesta: [letra('A'), ', 3'] },
    { nivel: 3, titulo: 'Diferencia y producto',
      enunciado: ['Si ', aa, ' − ', bb, ' = 2 y ', aa, bb, ' = 15, ¿cuánto vale ', aa, '³ − ', bb, '³?'],
      alternativas: ['8', '98', '53', '−82', '30'],
      datos: [DF3.cuboR],
      solucion: [
        { texto: 'En el cubo de una resta, las piezas del medio se restan: −3ab(a − b).', ecuacion: ['2³ = ', aa, '³ − ', bb, '³ − ', PM('3 · 15 · 2')] },
        { texto: 'Se despeja. (Con 5 y 3: 125 − 27 = 98. Cuadra.)', ecuacion: [aa, '³ − ', bb, '³ = 8 + ', PM(90), ' = 98'] },
        { texto: ['La ', letra('A'), ' olvida el medio; la ', letra('C'), ' no multiplica por a − b; la ', letra('D'), ' resta en vez de sumar.'] },
      ],
      respuesta: [letra('B'), ', 98'] },
    { nivel: 3, titulo: 'Un número y su inverso',
      enunciado: 'Si x + 1/x = 3, ¿cuánto vale x³ + 1/x³?',
      alternativas: ['27', '24', '18', '9', '26'],
      datos: [DF3.cubo, 'x · (1/x) = 1, con x ≠ 0'],
      solucion: [
        { texto: 'a es x y b es 1/x, con ab = 1. Las piezas del medio: 3 · 1 · (x + 1/x) = 9.', ecuacion: ['3³ = x³ + 1/x³ + ', PM(9)] },
        { texto: 'Se quitan las del medio.', ecuacion: ['x³ + 1/x³ = 27 − ', PM(9), ' = 18'] },
        { texto: ['La ', letra('A'), ' no quita nada; la ', letra('B'), ' quita solo 3ab = 3; la ', letra('D'), ' da el medio.'] },
      ],
      respuesta: [letra('C'), ', 18'] },
    { nivel: 3, titulo: 'Cuadrados y cubos',
      enunciado: ['Si ', aa, ' + ', bb, ' = 3 y ', aa, '² + ', bb, '² = 5, ¿cuánto vale ', aa, '³ + ', bb, '³?'],
      alternativas: ['27', '21', '9', '15', '18'],
      datos: [DF.suma, DF3.cubo],
      solucion: [
        { texto: 'Primero ab, con el cuadrado de la suma: 9 = 5 + 2ab.', ecuacion: ['3² = 5 + ', DP('2ab'), '   →   ', aa, bb, ' = 2'] },
        { texto: 'Después el cubo: se quitan las piezas del medio, 3 · 2 · 3 = 18. (Con 1 y 2: 1 + 8 = 9.)', ecuacion: [aa, '³ + ', bb, '³ = 27 − ', PM(18), ' = 9'] },
        { texto: ['La ', letra('A'), ' no quita nada; la ', letra('B'), ' quita solo 3ab; la ', letra('D'), ' multiplica 3 · 5; la ', letra('E'), ' da el medio.'] },
      ],
      respuesta: [letra('C'), ', 9'] },
  ];

  // «Mira» de la idea 3: suman 7 y multiplican 10 (la predicción), con el taco de 5 + 2.
  const MIRA_CUBO = { objeto: 'taco', a: 5, b: 2, escala: 18, pasos: [
    { cortes: false, arista: 'arista: a + b = 7 dm', total: 'volumen: 7³ = 343 dm³' },
    { abrir: 1, tramos: false, total: '343 = a³ + b³ + las seis del medio' },
    { abrir: 1, tramos: false, solo: 'medio', total: 'medio: 3ab(a + b) = 3 · 10 · 7 = 210' },
    { abrir: 1, tramos: false, solo: 'esquinas', total: 'a³ + b³ = 343 − 210 = 133' },
  ] };
  const cuboBinomio = {
    id: 'cubo-binomio',
    titulo: 'El cubo de una suma',
    pregunta: '¿Qué piezas forman el cubo de una suma?',
    temas: ['Productos notables'],
    pieza: 'alg-objeto',
    aprendizaje: '(a + b)³ son ocho piezas: a³, b³, tres a²b y tres ab²; así a³ + b³ = (a + b)³ − 3ab(a + b).',
    actividad: 'Cortar un taco de madera en ocho piezas y medirlas.',
    // Lee: el taco, los tres cortes y el volumen de una caja. No dice cuántas piezas salen ni cuánto miden (es el juego).
    lee: {
      tarjetas: [
        { titulo: 'El taco del carpintero', texto: 'En la carpintería hay un taco de madera con forma de cubo. Cada arista mide 5 dm, así que tiene 5 · 5 · 5 = 125 dm³ de madera. El carpintero lo va a cortar en piezas.',
          pieza: 'alg-objeto', dibujo: TA({ a: 3, b: 2, cortes: false, arista: 'arista: 5 dm', total: 'volumen: 125 dm³' }) },
        { titulo: 'Tres cortes', texto: 'Hace un corte a lo ancho, otro a lo largo y otro a lo alto, los tres a la misma distancia de una esquina. Así cada arista queda partida en dos tramos: a y b.',
          ecuacion: ['arista = ', aa, ' + ', bb] },
        { titulo: 'El volumen de una caja', texto: 'Una caja guarda largo por ancho por alto: una de 3 dm por 2 dm por 2 dm guarda 12 dm³. Un cubo de arista a guarda a · a · a = a³.',
          ecuacion: ['3 · 2 · 2 = 12'] },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a cambiar los tramos ', aa, ' y ', bb, ' y abrir el taco. Cuenta cuántas piezas salen y cuánto mide cada una.'] },
      ],
    },
    ejemplos: EJEMPLOS_CUBO,
    juega: {
      pieza: 'alg-objeto',
      consigna: 'El carpintero corta un taco cúbico con tres cortes, uno en cada dirección. Cada arista queda en dos tramos: a y b.',
      mision: {
        texto: ['El taco se corta a ', T1(3), ' dm de una esquina. Ábrelo y logra 125 dm³.'],
        logrado: val => val.a === 3 && val.b === 2 && val.abrir === 1,
        bien: 'a³ y b³ son solo 35 de 125 dm³: el resto está en el medio.',
      },
      voz: 'Cuenta las piezas: ¿cuántas hay de cada forma?',
      leyenda: [
        { s: aa, t: 'primer tramo de cada arista' },
        { s: bb, t: 'segundo tramo de cada arista' },
        { s: T1('a³'), t: 'el cubo de una esquina' },
        { s: PM('a²b'), t: 'tres piezas de a por a por b' },
        { s: 'ab²', t: 'tres piezas de a por b por b' },
        { s: T2('b³'), t: 'el cubo de la otra esquina' },
        { s: '(a + b)³', t: 'el taco entero, de arista a + b' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Tramo a (dm)', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'Tramo b (dm)', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
        { id: 'abrir', etiqueta: 'El taco', opciones: [{ valor: 0, texto: 'Cortado' }, { valor: 1, texto: 'Abierto' }] },
      ],
      dibujo: v => TA({ a: v.a, b: v.b, abrir: v.abrir, total: true, rot: { a3: true, a2b: true, ab2: true } }),
      // La relación: el taco entero son sus ocho piezas.
      lectura: v => [`(${v.a} + ${v.b})³ = ${(v.a + v.b) ** 3}: `, T1(v.a ** 3), ' + ', PM(3 * v.a * v.a * v.b), ` + ${3 * v.a * v.b * v.b} + `, T2(v.b ** 3)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Dos números suman 7 y su producto es 10. ¿Cuánto vale la suma de sus cubos?',
      datos: ['a + b = 7', 'a · b = 10', '7³ = 343'],
      voz: 'Piensa en el taco: ¿qué hay entre las dos esquinas?',
      opciones: [
        { id: 'c', texto: '133', correcta: true },
        { id: 'al11', texto: '343', error: 'AL11', siFuera: 'Bien 7³ = 343. Pero ahí están también las seis piezas del medio: hay que quitarlas.' },
        { id: 'suma', texto: '313', error: 'TAL-CUBO-SUMA', siFuera: 'Bien quitar 3 · 10 por las piezas del medio. Pero cada una se multiplica por a + b = 7.' },
        { id: 'tres', texto: '273', error: 'TAL-CUBO-TRES', siFuera: 'Bien quitar 10 · 7 = 70. Pero son tres veces: 3 · 10 · 7 = 210.' },
      ],
      dibujo: TA({ a: 5, b: 2, cortes: false, arista: 'arista: a + b = 7', total: 'a³ + b³ = ?' }),
      revelar: TA({ a: 5, b: 2, abrir: 1, tramos: false, solo: 'esquinas', total: 'a³ + b³ = 343 − 210 = 133' }),
      coincide: 'Coincide: al taco de 343 se le quitan las seis piezas del medio, 3 · 10 · 7 = 210.',
      noCoincide: 'Revisemos: (a + b)³ trae, además de a³ y b³, seis piezas del medio.',
    },
    mira: {
      pieza: 'alg-objeto',
      datos: MIRA_CUBO,
      voz: 'Abramos el taco y separemos las esquinas del medio.',
      pasos: [
        { estado: { paso: 0 }, texto: 'El taco entero tiene arista a + b = 7: su volumen es 343.', ecuacion: ['(a + b)³ = 7³ = 343'] },
        { estado: { paso: 1 }, texto: 'Abierto: dos cubos en las esquinas y seis piezas en el medio.', ecuacion: ['343 = ', T1('a³'), ' + ', T2('b³'), ' + ', PM('3a²b'), ' + 3ab²'] },
        { estado: { paso: 2 }, texto: 'Las seis del medio juntas son 3ab(a + b).', ecuacion: [PM('3a²b'), ' + 3ab² = 3ab(a + b) = 3 · 10 · 7 = 210'] },
        { estado: { paso: 3 }, texto: 'Se quitan del taco entero: quedan las dos esquinas.', ecuacion: [T1('a³'), ' + ', T2('b³'), ' = 343 − 210 = 133'] },
        { estado: { paso: 3 }, texto: 'Con letras, el cubo de una suma:', ecuacion: DF3.cubo },
      ],
    },
    regla: {
      texto: 'El cubo de un binomio son ocho piezas: los dos cubos de las esquinas, tres a²b y tres ab². Con una resta, los signos se alternan.',
      ecuacion: ['(', aa, ' + ', bb, ')³ = ', aa, '³ + ', { llave: ['3', aa, '²', bb], nota: 'piezas del medio', color: 'c-f' }, ' + 3', aa, bb, '² + ', bb, '³', SEP,
        '(', aa, ' − ', bb, ')³ = ', aa, '³ − 3', aa, '²', bb, ' + 3', aa, bb, '² − ', bb, '³', SEP,
        aa, '³ + ', bb, '³ = (', aa, ' + ', bb, ')³ − 3', aa, bb, '(', aa, ' + ', bb, ')', SEP,
        aa, '³ ± ', bb, '³ = (', aa, ' ± ', bb, ')(', aa, '² ∓ ', aa, bb, ' + ', bb, '²)'],
      condicion: 'Vale para todo a y b, también negativos; el taco solo muestra tramos positivos.',
      voz: 'Ocho piezas: no te olvides de las seis del medio.',
    },
    // Así se resuelve: la madera de las seis piezas del medio de un taco. «Ahora tú» pide otra cosa: desarrollar (con suma
    // o resta), un número al cubo, a³ + b³ con la suma y el producto, o factorizar una suma o diferencia de cubos.
    resuelve: {
      pieza: 'alg-objeto',
      generar(s) {
        const r = azar(s + 900);
        let A, B;
        do { A = r.ent(2, 5); B = r.ent(1, 3); } while (A === B);
        const p1 = A * A * B, p2 = A * B * B, tot = 3 * p1 + 3 * p2, V = (A + B) ** 3;
        return {
          enunciado: ['Un taco cúbico de madera se corta a ', T1(A), ' dm de una esquina, en las tres direcciones; el otro tramo mide ', T2(B), ' dm. ¿Cuánta madera hay en las seis piezas del medio?'],
          datos: [DF3.vol, DF3.cubo],
          dibujo: TA({ a: A, b: B, abrir: 1, rot: { a2b: '?', ab2: '?' } }),
          pasos: [
            { tipo: 'pide', texto: 'Piden las seis piezas del medio, no el taco entero.' },
            { tipo: 'regla', texto: 'El taco se abre en ocho piezas: los cubos a³ y b³ de las esquinas y, en el medio, tres a²b y tres ab².', ecuacion: DF3.cubo },
            { tipo: 'cuentas', texto: `Tres piezas de ${A} · ${A} · ${B} = ${p1} y tres de ${A} · ${B} · ${B} = ${p2}.`,
              ecuacion: [PM(`3 · ${p1}`), ` + 3 · ${p2} = `, PM(3 * p1), ` + ${3 * p2} = ${tot}`], dibujo: TA({ a: A, b: B, abrir: 1, solo: 'medio', rot: { a2b: true, ab2: true } }) },
            { tipo: 'sentido', texto: `Lo reviso: el taco mide ${A + B}³ = ${V} dm³; sin las esquinas, ${A ** 3} y ${B ** 3}, quedan ${V - A ** 3 - B ** 3}. Cuadra.` },
          ],
          respuesta: `Las seis del medio: ${tot} dm³`,
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-objeto',
      voz: 'Ocho piezas: los dos cubos y las seis del medio.',
      generar(sem) {
        const r = azar(sem + 47), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoCubo, r);
        if (tipo === 1) return conCuatro(casoCuboResta, r);
        if (tipo === 2) return conCuatro(casoCuboNum, r);
        if (tipo === 3) return conCuatro(casoCuboSP, r);
        return conCuatro(casoSumaCubos, r);
      },
    },
  };

  // ---------- Idea 4 (reescrita con el método, 18 nov): radicales dobles ----------
  // Propuesta aprobada: §1 a §6, idea 7. Objeto de la primera pantalla: la mesa cuadrada que se arma con cuatro planchas,
  // dos cuadradas de x e y dm² y dos rectangulares de √x por √y (pieza alg-objeto, objeto 'mesa', dibujo de prueba).
  // Cambia: las dos planchas cuadradas (x de 4 a 8, y de 1 a 4). · Permanece: la mesa cuadrada, del mismo ancho en pantalla. · Progresa: el área
  // de la mesa, x + y + 2√(xy), y su lado √x + √y. · Se reserva: el radical doble con un menos (la predicción, 7 − 2√12);
  // el juego solo arma mesas («+»). · Debe verse: √(A + 2√B) = √x + √y si x + y = A y xy = B.
  // Errores (hipótesis de diseño; AL9 de docs/investigacion/algebra-funciones-ideas-erroneas.md, parcial): AL9 reparte la
  // raíz sobre la suma · TAL-RD-ORDEN con el menos pone primero el menor · TAL-RD-PRODUCTO un par que suma pero no
  // multiplica · TAL-RD-SIGNO cambia el signo · TAL-RD-DOS busca el producto sin sacar el 2 · TAL-RD-CANCELA cree que las
  // raíces chicas se anulan adentro · TAL-RD-CRUZA se queda con la otra raíz.
  const ME = datos => ({ pieza: 'alg-objeto', datos: Object.assign({ objeto: 'mesa' }, datos), estado: {} });
  const RD = t => ({ raiz: Array.isArray(t) ? t : [t] });
  const DF4 = {
    rd: '√(A + 2√B) = √x + √y, si x + y = A y x · y = B',
    rdm: '√(A − 2√B) = √x − √y, con x mayor que y',
    cuad: '(√x + √y)² = x + y + 2√(xy)',
    meter: 'k√M = √(k² · M), con k positivo',
    prod: '√x · √y = √(xy)',
  };
  // Tabla de los pares que suman A (para Predice y Mira): x naranja, y turquesa, el producto que da B en violeta.
  const pares = A => { const l = []; for (let x = A - 1; x >= A / 2; x--) l.push([x, A - x]); return l; };
  const tablaPares = (A, B, ocultar = false, desde = {}) => ({
    columnas: ['x', 'y', 'x + y', 'x · y'], colorCol: ['o', 'i', null, null],
    filas: pares(A).map(([x, y]) => [{ t: String(x), desde: desde.par || 0 }, { t: String(y), desde: desde.par || 0 }, { t: String(A), desde: desde.par || 0 },
      ocultar ? { t: '?' } : { t: String(x * y), desde: desde.prod || 0, color: x * y === B ? 'f' : null, fuerte: x * y === B, marca: x * y === B ? 'ok' : undefined }]),
    alt: ocultar ? `Pares de números que suman ${A}; su producto, por hallar` : `Pares que suman ${A}; el de producto ${B} da el radical simple`,
  });
  // Un par x > y con x + y entre 5 y 15 y xy sin raíz exacta.
  function parRD(r) {
    let x, y;
    do { x = r.ent(3, 11); y = r.ent(1, x - 1); } while (esCuad(x * y) || x + y > 15 || x + y < 5);
    return [x, y];
  }
  const otroPar = (A, B, x) => pares(A).find(([u, w]) => u > w && u * w !== B && u !== x);
  // Ahora tú 1 y 2: un radical doble con «+» o con «−».
  function casoRD(r, menos) {
    const [x, y] = parRD(r), A = x + y, B = x * y, s = menos ? '−' : '+', otro = otroPar(A, B, x);
    return {
      pregunta: ['¿A qué es igual ', RD(`${A} ${s} 2√${B}`), '?'],
      datos: menos ? [DF4.rd, DF4.rdm] : [DF4.rd],
      opciones: opcionesP([`${rz(x)} ${s} ${rz(y)}`], [
        menos ? { id: 'orden', texto: [`${rz(y)} − ${rz(x)}`], error: 'TAL-RD-ORDEN', siFuera: `Bien ${x} y ${y}. Pero ${rz(y)} − ${rz(x)} es negativo, y una raíz no lo es.` }
          : { id: 'signo', texto: [`${rz(x)} − ${rz(y)}`], error: 'TAL-RD-SIGNO', siFuera: `Bien ${x} y ${y}. Pero el signo es el mismo del radical doble: +.` },
        { id: 'reparte', texto: [`√${A} ${s} √${B}`], error: 'AL9', siFuera: 'Bien buscar dos raíces. Pero la raíz grande no se reparte sobre la suma.' },
        otro && { id: 'par', texto: [`${rz(otro[0])} ${s} ${rz(otro[1])}`], error: 'TAL-RD-PRODUCTO', siFuera: `Bien: ${otro[0]} + ${otro[1]} = ${A}. Pero ${otro[0]} · ${otro[1]} = ${otro[0] * otro[1]}, no ${B}.` },
      ].filter(Boolean)),
      solucion: { texto: `${x} + ${y} = ${A} y ${x} · ${y} = ${B}${menos ? '; con el menos, primero el mayor' : ''}.`, ecuacion: [RD(`${A} ${s} 2√${B}`), ' = ', T1(rz(x)), ` ${s} `, T2(rz(y))] },
    };
  }
  // Ahora tú 3: sin el 2 delante de la raíz chica: √(A + √C), con C = 4B.
  function casoRDSin2(r) {
    const [x, y] = parRD(r), A = x + y, B = x * y, C = 4 * B, otro = otroPar(A, B, x);
    return {
      pregunta: ['¿A qué es igual ', RD(`${A} + √${C}`), '?'],
      datos: [DF4.rd, DF4.meter],
      opciones: opcionesP([`${rz(x)} + ${rz(y)}`], [
        { id: 'reparte', texto: [`√${A} + √${C}`], error: 'AL9', siFuera: 'Bien ver dos raíces. Pero la raíz grande no se reparte sobre la suma.' },
        { id: 'signo', texto: [`${rz(x)} − ${rz(y)}`], error: 'TAL-RD-SIGNO', siFuera: `Bien ${x} y ${y}. Pero el signo es el mismo del radical doble: +.` },
        otro && { id: 'par', texto: [`${rz(otro[0])} + ${rz(otro[1])}`], error: 'TAL-RD-PRODUCTO', siFuera: `Bien: ${otro[0]} + ${otro[1]} = ${A}. Pero su producto es ${otro[0] * otro[1]}, no ${B}.` },
      ].filter(Boolean)),
      solucion: { texto: `Primero se saca el 2: √${C} = 2√${B}. Después, ${x} + ${y} = ${A} y ${x} · ${y} = ${B}.`, ecuacion: [RD(`${A} + √${C}`), ' = ', RD(`${A} + 2√${B}`), ' = ', T1(rz(x)), ' + ', T2(rz(y))] },
    };
  }
  // Ahora tú 4 (nivel examen): la suma o la resta de dos radicales dobles con los mismos A y B.
  function casoRDSuma(r) {
    const [x, y] = parRD(r), A = x + y, B = x * y, suma = r() < 0.5;
    const dos = v => (esCuad(v) ? String(2 * Math.sqrt(v)) : `2√${v}`);
    return {
      pregunta: ['¿Cuánto vale ', RD(`${A} + 2√${B}`), suma ? ' + ' : ' − ', RD(`${A} − 2√${B}`), '?'],
      datos: [DF4.rd, DF4.rdm],
      opciones: opcionesP([suma ? dos(x) : dos(y)], [
        { id: 'cancela', texto: [suma ? `2√${A}` : '0'], error: 'TAL-RD-CANCELA', siFuera: suma ? `Bien sumar dos raíces de ${A}. Pero cada radical doble se escribe primero como √x ± √y.` : 'Bien ver que algo se anula. Pero se anulan las raíces de x, no todo.' },
        { id: 'cruza', texto: [suma ? dos(y) : dos(x)], error: 'TAL-RD-CRUZA', siFuera: `Bien ${x} y ${y}. Pero al ${suma ? 'sumar se anulan las √y' : 'restar se anulan las √x'}.` },
        { id: 'uno', texto: [`${rz(x)} + ${rz(y)}`], error: 'TAL-RD-SIGNO', siFuera: `Bien el primer radical doble, ${rz(x)} + ${rz(y)}. Falta el segundo.` },
      ]),
      solucion: { texto: `${x} + ${y} = ${A} y ${x} · ${y} = ${B}: los dos usan √${x} y √${y}.`, ecuacion: [`(${rz(x)} + ${rz(y)}) ${suma ? '+' : '−'} (${rz(x)} − ${rz(y)}) = ${suma ? dos(x) : dos(y)}`] },
    };
  }
  // Ahora tú 5 (nivel examen): un número delante de la raíz chica, como √(9 + 4√5).
  function casoRDCoef(r) {
    let x, y, c, M;
    do {
      [x, y] = parRD(r);
      c = 1; for (let k = 2; k * k <= x * y; k++) if ((x * y) % (k * k) === 0) c = k;
      M = (x * y) / (c * c);
    } while (c < 2 || M === 1);
    const A = x + y, B = x * y, k = 2 * c, otro = otroPar(A, B, x);
    return {
      pregunta: ['¿A qué es igual ', RD(`${A} + ${k}√${M}`), '?'],
      datos: [DF4.rd, DF4.meter],
      opciones: opcionesP([`${rz(x)} + ${rz(y)}`], [
        { id: 'reparte', texto: [`√${A} + √${M}`], error: 'AL9', siFuera: `Bien buscar dos raíces. Pero la raíz grande no se reparte, y el ${k} no se pierde.` },
        { id: 'signo', texto: [`${rz(x)} − ${rz(y)}`], error: 'TAL-RD-SIGNO', siFuera: `Bien ${x} y ${y}. Pero el signo es el mismo del radical doble: +.` },
        otro && { id: 'par', texto: [`${rz(otro[0])} + ${rz(otro[1])}`], error: 'TAL-RD-PRODUCTO', siFuera: `Bien: ${otro[0]} + ${otro[1]} = ${A}. Pero su producto es ${otro[0] * otro[1]}, no ${B}.` },
      ].filter(Boolean)),
      solucion: { texto: `Se mete el número: ${k}√${M} = 2√${B}. Después, ${x} + ${y} = ${A} y ${x} · ${y} = ${B}.`, ecuacion: [RD(`${A} + ${k}√${M}`), ' = ', RD(`${A} + 2√${B}`), ' = ', T1(rz(x)), ' + ', T2(rz(y))] },
    };
  }

  // Ejemplos resueltos de la idea 4. Cuentas rehechas aparte (cuentas-productos-f3.py): lado √6 + √2; √(5 + 2√6) = √3 + √2;
  // √(9 + 2√20) = √5 + 2; 6 · 2 = 12 ≠ 15; 7 + 3 + 2√21; √(8 − 2√15) = √5 − √3; √(7 + √40) = √5 + √2; √(11 + 4√6) =
  // 2√2 + √3; (√7 + √2)² = 9 + 2√14; √(6 − √20) = √5 − 1; suma de √(5 ± 2√6) = 2√3; √(9 − 2√14) = √7 − √2;
  // √(3 + √8) − √2 = 1; 12 + 2√35 → lado √7 + √5, perímetro 4√7 + 4√5; √(16 − 6√7) = 3 − √7. El nivel 1 solo usa «+»
  // (el menos es la predicción).
  const EJEMPLOS_RD = [
    { nivel: 1, titulo: 'El lado de la mesa',
      enunciado: ['Una mesa se arma con dos planchas cuadradas, de ', T1(6), ' dm² y de ', T2(2), ' dm², y dos rectangulares iguales. ¿Cuánto mide su lado?'],
      datos: ['Lado de un cuadrado = √(su área)'],
      figura: ME({ x: 6, y: 2, lados: false, lado: '?' }),
      solucion: [{ texto: 'El lado de la mesa es el lado de una plancha cuadrada más el de la otra.', ecuacion: ['lado = ', T1('√6'), ' + ', T2('√2')] }],
      respuesta: ['Mide ', T1('√6'), ' + ', T2('√2'), ' dm'] },
    { nivel: 1, titulo: 'Un radical doble',
      enunciado: ['¿A qué es igual ', RD('5 + 2√6'), '?'],
      datos: [DF4.rd],
      solucion: [{ texto: '3 + 2 = 5 y 3 · 2 = 6: x es 3 e y es 2.', ecuacion: [RD('5 + 2√6'), ' = ', T1('√3'), ' + ', T2('√2')] }],
      respuesta: [T1('√3'), ' + ', T2('√2')] },
    { nivel: 1, titulo: 'Con un cuadrado perfecto',
      enunciado: ['¿A qué es igual ', RD('9 + 2√20'), '?'],
      datos: [DF4.rd],
      solucion: [{ texto: '5 + 4 = 9 y 5 · 4 = 20. Y √4 es exacta: vale 2.', ecuacion: [RD('9 + 2√20'), ' = ', T1('√5'), ' + ', T2('√4'), ' = ', T1('√5'), ' + ', T2(2)] }],
      respuesta: [T1('√5'), ' + ', T2(2)] },
    { nivel: 1, titulo: '¿Sirven estos números?',
      enunciado: ['¿Sirven 6 y 2 para escribir ', RD('8 + 2√15'), ' como dos raíces simples?'],
      datos: [DF4.rd],
      solucion: [{ texto: 'Suman 6 + 2 = 8, pero multiplican 6 · 2 = 12, no 15.', ecuacion: [T1(6), ' · ', T2(2), ' = 12 ≠ 15'] }],
      respuesta: 'No: el producto no da 15' },
    { nivel: 1, titulo: 'El área de la mesa',
      enunciado: ['Una mesa se arma con planchas cuadradas de ', T1(7), ' dm² y de ', T2(3), ' dm², y dos rectangulares iguales. ¿Cuál es su área?'],
      datos: [DF4.prod],
      figura: ME({ x: 7, y: 3, rot: { xy: '?' }, total: '?' }),
      solucion: [{ texto: 'Cada plancha rectangular mide √7 por √3: √21 dm². Son dos.', ecuacion: [T1(7), ' + ', T2(3), ' + ', DP('2√21'), ' = 10 + ', DP('2√21')] }],
      respuesta: ['10 + ', DP('2√21'), ' dm²'] },
    { nivel: 2, titulo: 'Con una resta',
      enunciado: ['¿A qué es igual ', RD('8 − 2√15'), '?'],
      datos: [DF4.rd, DF4.rdm],
      solucion: [
        { texto: '5 + 3 = 8 y 5 · 3 = 15: x es 5 e y es 3.', ecuacion: [T1(5), ' + ', T2(3), ' = 8   y   ', T1(5), ' · ', T2(3), ' = 15'] },
        { texto: 'Con el menos, primero va la raíz mayor: así no sale negativo.', ecuacion: [RD('8 − 2√15'), ' = ', T1('√5'), ' − ', T2('√3')] },
      ],
      respuesta: [T1('√5'), ' − ', T2('√3')] },
    { nivel: 2, titulo: 'Sin el 2',
      enunciado: ['¿A qué es igual ', RD('7 + √40'), '?'],
      datos: [DF4.rd, DF4.meter],
      solucion: [
        { texto: 'Falta el 2 delante de la raíz chica. Se saca: 40 = 4 · 10.', ecuacion: ['√40 = √(4 · 10) = 2√10'] },
        { texto: '5 + 2 = 7 y 5 · 2 = 10.', ecuacion: [RD('7 + 2√10'), ' = ', T1('√5'), ' + ', T2('√2')] },
      ],
      respuesta: [T1('√5'), ' + ', T2('√2')] },
    { nivel: 2, titulo: 'Con un número delante',
      enunciado: ['¿A qué es igual ', RD('11 + 4√6'), '?'],
      datos: [DF4.rd, DF4.meter],
      solucion: [
        { texto: 'Se deja solo un 2 afuera: 4√6 = 2 · 2√6 = 2√24.', ecuacion: ['4√6 = 2√(4 · 6) = 2√24'] },
        { texto: '8 + 3 = 11 y 8 · 3 = 24. Y √8 = 2√2.', ecuacion: [RD('11 + 2√24'), ' = ', T1('√8'), ' + ', T2('√3'), ' = ', T1('2√2'), ' + ', T2('√3')] },
      ],
      respuesta: [T1('2√2'), ' + ', T2('√3')] },
    { nivel: 2, titulo: 'Comprobar al cuadrado',
      enunciado: ['¿Es (', T1('√7'), ' + ', T2('√2'), ')² igual a 9 + 2√14?'],
      datos: [DF.suma, DF4.prod],
      solucion: [
        { texto: 'Los dos cuadrados: 7 y 2. El doble producto: 2 · √7 · √2 = 2√14.', ecuacion: ['(', T1('√7'), ' + ', T2('√2'), ')² = ', T1(7), ' + ', DP('2√14'), ' + ', T2(2)] },
        { texto: '7 + 2 = 9: sí da 9 + 2√14.', ecuacion: ['9 + ', DP('2√14')] },
      ],
      respuesta: 'Sí: da 9 + 2√14' },
    { nivel: 2, titulo: 'Una resta sin el 2',
      enunciado: ['¿A qué es igual ', RD('6 − √20'), '?'],
      datos: [DF4.rd, DF4.rdm, DF4.meter],
      solucion: [
        { texto: 'Se saca el 2: 20 = 4 · 5, así que √20 = 2√5.', ecuacion: [RD('6 − √20'), ' = ', RD('6 − 2√5')] },
        { texto: '5 + 1 = 6 y 5 · 1 = 5. Primero el mayor, y √1 = 1.', ecuacion: [RD('6 − 2√5'), ' = ', T1('√5'), ' − ', T2(1)] },
      ],
      respuesta: [T1('√5'), ' − ', T2(1)] },
    { nivel: 3, titulo: 'Dos radicales dobles',
      enunciado: ['¿Cuánto vale ', RD('5 + 2√6'), ' + ', RD('5 − 2√6'), '?'],
      alternativas: ['2√5', '2√3', '2√2', '0', '√3 + √2'],
      datos: [DF4.rd, DF4.rdm],
      solucion: [
        { texto: 'Los dos usan 3 y 2, que suman 5 y multiplican 6.', ecuacion: ['(', T1('√3'), ' + ', T2('√2'), ') + (', T1('√3'), ' − ', T2('√2'), ')'] },
        { texto: 'Las √2 se anulan y quedan dos √3.', ecuacion: ['= ', T1('2√3')] },
        { texto: ['La ', letra('A'), ' cree que las raíces chicas se anulan adentro; la ', letra('C'), ' se queda con la √2; la ', letra('E'), ' es solo el primero.'] },
      ],
      respuesta: [letra('B'), ', ', T1('2√3')] },
    { nivel: 3, titulo: 'El orden importa',
      enunciado: ['¿A qué es igual ', RD('9 − 2√14'), '?'],
      alternativas: ['√2 − √7', '√9 − √14', '√7 − √2', '√7 + √2', '3 − √14'],
      datos: [DF4.rd, DF4.rdm],
      solucion: [
        { texto: '7 + 2 = 9 y 7 · 2 = 14.', ecuacion: [T1(7), ' + ', T2(2), ' = 9   y   ', T1(7), ' · ', T2(2), ' = 14'] },
        { texto: 'Con el menos, primero la raíz mayor.', ecuacion: [RD('9 − 2√14'), ' = ', T1('√7'), ' − ', T2('√2')] },
        { texto: ['La ', letra('A'), ' es negativa; la ', letra('B'), ' y la ', letra('E'), ' reparten la raíz; la ', letra('D'), ' cambia el signo.'] },
      ],
      respuesta: [letra('C'), ', ', T1('√7'), ' − ', T2('√2')] },
    { nivel: 3, titulo: 'Una resta que da entero',
      enunciado: ['¿Cuánto vale ', RD('3 + √8'), ' − √2?'],
      alternativas: ['1', '√3', '√2', '0', '2√2 + 1'],
      datos: [DF4.rd, DF4.meter],
      solucion: [
        { texto: 'Se saca el 2: √8 = 2√2. Luego 2 + 1 = 3 y 2 · 1 = 2.', ecuacion: [RD('3 + 2√2'), ' = ', T1('√2'), ' + ', T2(1)] },
        { texto: 'Al restar √2, queda 1.', ecuacion: ['√2 + 1 − √2 = 1'] },
        { texto: ['La ', letra('B'), ' reparte la raíz; la ', letra('E'), ' saca el 2 y lo deja afuera.'] },
      ],
      respuesta: [letra('A'), ', 1'] },
    { nivel: 3, titulo: 'El perímetro de la mesa',
      enunciado: ['Una mesa cuadrada de 12 + 2√35 dm² se arma con dos planchas cuadradas y dos rectangulares iguales. ¿Cuál es su perímetro?'],
      alternativas: ['4√7 + 4√5', '4√12 + 4√35', '2√7 + 2√5', '√7 + √5', '4√35'],
      datos: [DF4.rd, 'Perímetro de un cuadrado = 4 · lado'],
      figura: ME({ x: 7, y: 5, areas: false, lados: false, total: 'mesa: 12 + 2√35 dm²', lado: '?' }),
      solucion: [
        { texto: 'Las planchas cuadradas suman 12 y multiplican 35: son de 7 y 5 dm².', ecuacion: ['lado = ', RD('12 + 2√35'), ' = ', T1('√7'), ' + ', T2('√5')] },
        { texto: 'El perímetro son cuatro lados.', ecuacion: ['4(', T1('√7'), ' + ', T2('√5'), ') = 4√7 + 4√5'] },
        { texto: ['La ', letra('B'), ' reparte la raíz; la ', letra('D'), ' da el lado, no el perímetro.'] },
      ],
      respuesta: [letra('A'), ', 4√7 + 4√5 dm'] },
    { nivel: 3, titulo: 'Con número delante y resta',
      enunciado: ['¿A qué es igual ', RD('16 − 6√7'), '?'],
      alternativas: ['√7 − 3', '3 − √7', '4 − √6', '√16 − √63', '3 + √7'],
      datos: [DF4.rd, DF4.rdm, DF4.meter],
      solucion: [
        { texto: 'Se deja solo un 2 afuera: 6√7 = 2 · 3√7 = 2√63.', ecuacion: [RD('16 − 6√7'), ' = ', RD('16 − 2√63')] },
        { texto: '9 + 7 = 16 y 9 · 7 = 63. Primero el mayor, y √9 = 3.', ecuacion: [T1('√9'), ' − ', T2('√7'), ' = ', T1(3), ' − ', T2('√7')] },
        { texto: ['La ', letra('A'), ' es negativa; la ', letra('D'), ' reparte la raíz; la ', letra('E'), ' cambia el signo.'] },
      ],
      respuesta: [letra('B'), ', ', T1(3), ' − ', T2('√7')] },
  ];

  const dobles = {
    id: 'radicales-dobles',
    titulo: 'Dos números que suman y multiplican',
    pregunta: '¿Cómo se quita una raíz que está dentro de otra?',
    temas: ['Radicales dobles'],
    pieza: 'alg-objeto',
    aprendizaje: '√(A + 2√B) = √x + √y si x + y = A y xy = B: es el lado de una mesa de dos planchas cuadradas y dos rectangulares.',
    actividad: 'Armar una mesa cuadrada con cuatro planchas de madera.',
    // Lee: la mesa y qué es un radical doble. No dice cómo se encuentran las planchas (es el juego) ni qué pasa con un menos.
    lee: {
      tarjetas: [
        { titulo: 'La mesa de planchas', texto: 'En la carpintería arman mesas cuadradas con cuatro planchas: dos cuadradas, una de 3 dm² y otra de 2 dm², y dos rectangulares iguales que completan el cuadrado.',
          pieza: 'alg-objeto', dibujo: ME({ x: 3, y: 2, lados: false, rot: { xy: '?' } }) },
        { titulo: 'Una raíz dentro de otra', texto: 'Una plancha cuadrada de 3 dm² mide √3 dm de lado. Si el área de una mesa trae una raíz, como 5 + 2√6, su lado es una raíz con otra adentro: un radical doble.',
          ecuacion: ['lado = ', RD('5 + 2√6')] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir las dos planchas cuadradas. Mira cuánto suman sus áreas, cuánto mide cada plancha rectangular y el área de toda la mesa.' },
      ],
    },
    ejemplos: EJEMPLOS_RD,
    juega: {
      pieza: 'alg-objeto',
      consigna: 'En la carpintería arman una mesa cuadrada con dos planchas cuadradas y dos rectangulares iguales.',
      mision: {
        texto: 'Elige las dos planchas cuadradas para armar una mesa de 8 + 2√15 dm².',
        logrado: val => val.x === 5 && val.y === 3,
        bien: 'Las planchas suman 8 y multiplican 15: el número bajo la raíz chica.',
      },
      voz: 'Mira las planchas rectangulares: ¿cuánto mide cada una?',
      leyenda: [
        { s: T1('x'), t: 'área de la plancha cuadrada grande (dm²)' },
        { s: T2('y'), t: 'área de la plancha cuadrada chica' },
        { s: T1('√x'), t: 'lado de la plancha grande' },
        { s: T2('√y'), t: 'lado de la plancha chica' },
        { s: DP('√(xy)'), t: 'área de cada plancha rectangular' },
        { s: '√x + √y', t: 'el lado de la mesa' },
      ],
      controles: [
        { id: 'x', etiqueta: 'Plancha grande, x (dm²)', color: 'c-o', min: 4, max: 8, paso: 1, inicio: 4, decimales: 0 },
        { id: 'y', etiqueta: 'Plancha chica, y (dm²)', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => ME({ x: v.x, y: v.y, total: true }),
      // La relación: lo que suman y lo que multiplican las planchas da el área de la mesa.
      lectura: v => ['Suman ', T1(v.x), ' + ', T2(v.y), ` = ${v.x + v.y} y multiplican ${v.x * v.y}: mesa de ${v.x + v.y} + 2√${v.x * v.y}`],
      minimo: 3,
    },
    predice: {
      pieza: 'alg-tabla',
      pregunta: ['¿A qué es igual ', RD('7 − 2√12'), '?'],
      datos: ['√4 = 2'],
      voz: 'Busca dos números que sumen 7. ¿Cuál par multiplica 12?',
      opciones: [
        { id: 'c', texto: '2 − √3', correcta: true },
        { id: 'orden', texto: '√3 − 2', error: 'TAL-RD-ORDEN', siFuera: 'Bien 4 y 3, que suman 7 y multiplican 12. Pero √3 − 2 es negativo, y una raíz no.' },
        { id: 'reparte', texto: '√7 − √12', error: 'AL9', siFuera: 'Bien separar en dos raíces. Pero la raíz grande no se reparte sobre la resta.' },
        { id: 'par', texto: '√6 − 1', error: 'TAL-RD-PRODUCTO', siFuera: 'Bien: 6 + 1 = 7. Pero 6 · 1 = 6, no 12.' },
      ],
      dibujo: { datos: tablaPares(7, 12, true), estado: {} },
      revelar: { datos: tablaPares(7, 12), estado: {} },
      coincide: 'Coincide: 4 + 3 = 7 y 4 · 3 = 12; con el menos va primero la mayor, √4 = 2.',
      noCoincide: 'Revisemos: se buscan dos números que sumen 7 y multipliquen 12.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: tablaPares(7, 12, false, { par: 1, prod: 2 }),
      voz: 'Primero la suma; el producto decide.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se buscan dos números que sumen 7: los pares posibles.', ecuacion: [T1('x'), ' + ', T2('y'), ' = 7'] },
        { estado: { corte: 2 }, texto: 'De esos, solo 4 y 3 multiplican 12.', ecuacion: [T1('x'), ' · ', T2('y'), ' = 12'] },
        { estado: { corte: 2 }, texto: 'Con el signo menos, va primero la raíz mayor.', ecuacion: [RD('7 − 2√12'), ' = ', T1('√4'), ' − ', T2('√3'), ' = 2 − √3'] },
        { estado: { corte: 2 }, texto: 'Se comprueba al cuadrado: vuelve el radical doble.', ecuacion: ['(2 − √3)² = 4 − 4√3 + 3 = 7 − 2√12'] },
        { estado: { corte: 2 }, texto: 'Y 2 − √3 ≈ 0,27 es positivo, como toda raíz.', ecuacion: ['2 − 1,73 ≈ 0,27'] },
      ],
    },
    regla: {
      texto: 'Un radical doble √(A ± 2√B) se vuelve dos raíces simples si hay x e y que suman A y multiplican B. Con el menos, va primero el mayor.',
      ecuacion: [RD(['A ± 2', RD('B')]), ' = ', RD([T1('x')]), ' ± ', RD([T2('y')]), SEP,
        { llave: [T1('x'), ' + ', T2('y')], nota: 'suman A' }, ' = A', SEP,
        { llave: [T1('x'), ' · ', T2('y')], nota: 'multiplican B', color: 'c-f' }, ' = B'],
      condicion: 'x mayor que y, ambos positivos. Si no hay un 2 delante de la raíz chica, se hace: √C = 2√(C/4).',
      voz: 'Suman lo de afuera y multiplican lo de adentro.',
    },
    // Así se resuelve: las dos planchas y el lado de una mesa. «Ahora tú» pide otra cosa: radicales dobles con +, con −,
    // sin el 2, con un número delante, o la suma o resta de dos de ellos.
    resuelve: {
      pieza: 'alg-objeto',
      generar(s) {
        const r = azar(s + 900), [x, y] = parRD(r), A = x + y, B = x * y;
        return {
          enunciado: `Una mesa cuadrada de ${A} + 2√${B} dm² se arma con dos planchas cuadradas y dos rectangulares iguales. ¿De qué área es cada plancha cuadrada y cuánto mide el lado?`,
          datos: [DF4.rd, DF4.cuad],
          dibujo: ME({ x, y, lados: false, areas: false, rot: { x: '?', y: '?' }, total: `mesa: ${A} + 2√${B} dm²` }),
          pasos: [
            { tipo: 'pide', texto: 'Piden las dos planchas cuadradas y el lado de la mesa.' },
            { tipo: 'datos', texto: `El área de la mesa son sus cuatro planchas: x + y de las cuadradas y 2√(xy) de las rectangulares. Aquí x + y = ${A} y xy = ${B}.`, ecuacion: DF4.cuad },
            { tipo: 'regla', texto: `Busco dos números que sumen ${A} y multipliquen ${B}: son las áreas de las planchas cuadradas.` },
            { tipo: 'cuentas', texto: `Solo ${x} y ${y} cumplen: ${x} + ${y} = ${A} y ${x} · ${y} = ${B}.`, ecuacion: ['lado = ', T1(`√${x}`), ' + ', T2(`√${y}`)], dibujo: ME({ x, y, lado: true, total: true }) },
            { tipo: 'sentido', texto: `Lo reviso: (√${x} + √${y})² = ${x} + ${y} + 2√${B} = ${A} + 2√${B}. Vuelve el área de la mesa.` },
          ],
          respuesta: ['Planchas de ', T1(x), ' y ', T2(y), ` dm²; lado √${x} + √${y} dm`],
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-objeto',
      voz: 'Dos números: que sumen lo de afuera y multipliquen lo de adentro.',
      generar(sem) {
        const r = azar(sem + 61), tipo = sem % 5;
        if (tipo === 0) return conCuatro(rr => casoRD(rr, false), r);
        if (tipo === 1) return conCuatro(rr => casoRD(rr, true), r);
        if (tipo === 2) return conCuatro(casoRDSin2, r);
        if (tipo === 3) return conCuatro(casoRDSuma, r);
        return conCuatro(casoRDCoef, r);
      },
    },
  };

  // ---------- Idea 5 (reescrita con el método, 18 nov): racionalizar ----------
  // Propuesta aprobada: §1 a §6, idea 8. Objeto de la primera pantalla: una cometa cuadrada (las de agosto en Puno) cuya
  // varilla de punta a punta es la diagonal: el lado es d/√2 (pieza alg-objeto, objeto 'cometa', dibujo de prueba).
  // Cambia: el largo de la varilla (d) y por qué se multiplica arriba y abajo. · Permanece: la cometa (su lado no cambia
  // con la forma de escribirlo). · Progresa: la fracción que se reescribe. · Se reserva: el conjugado (la predicción:
  // 1/(√5 − √3)); el juego solo tiene una raíz abajo. · Debe verse: multiplicar por algo que vale 1 no cambia el valor.
  // Errores (hipótesis de diseño): TAL-RAC-MISMO multiplica por lo mismo y no por el conjugado · TAL-RAC-UNA usa la raíz
  // sola con dos raíces abajo · TAL-RAC-UNO multiplica solo arriba o solo abajo (cambia el valor) · TAL-RAC-DEN no divide
  // entre lo que quedó abajo · TAL-RAC-SUMA pone a + b abajo · TAL-RAC-INV invierte la fracción · TAL-RAC-CUBO usa ∛a
  // como si fuera √a · TAL-RAC-CANCELA cree que dos fracciones conjugadas se anulan · TAL-SIGNO.
  const CM = datos => ({ pieza: 'alg-objeto', datos: Object.assign({ objeto: 'cometa' }, datos), estado: {} });
  const DF5 = {
    uno: '√a · √a = a',
    conj: '(√a + √b)(√a − √b) = a − b',
    conjN: '(√a + c)(√a − c) = a − c²',
    cubo: '∛a · ∛(a²) = ∛(a³) = a',
    diag: 'Diagonal de un cuadrado = lado · √2',
  };
  // k√A/den escrito corto: «2√3», «√5/5», «3√2/2».
  const coefRaiz = (k, raiz) => `${k === 1 ? '' : k}${raiz}`;
  const fraccion = (arriba, den) => (den === 1 ? [arriba] : [{ frac: [arriba, String(den)] }]);
  // El lado de la cometa de varilla d, sin raíz abajo: d√2/2, simplificado.
  const ladoCometa = d => (d % 2 === 0 ? coefRaiz(d / 2, '√2') : `${coefRaiz(d, '√2')}/2`);
  function casoUnaRaiz(r) {
    let A;
    do { A = r.ent(2, 15); } while (esCuad(A));
    const K = r.ent(1, 12), g = mcd(K, A), c = K / g, den = A / g, g2 = mcd(K, A);
    return {
      pregunta: ['Racionaliza ', { frac: [String(K), `√${A}`] }, '.'],
      datos: [DF5.uno],
      opciones: opcionesP(fraccion(coefRaiz(c, `√${A}`), den), [
        { id: 'uno', texto: fraccion(String(K / g2), A / g2), error: 'TAL-RAC-UNO', siFuera: `Bien que abajo quede ${A}. Pero si solo cambias abajo, cambia el valor: arriba también va √${A}.` },
        { id: 'den', texto: [coefRaiz(K, `√${A}`)], error: 'TAL-RAC-DEN', siFuera: `Bien ${K}√${A} arriba. Pero abajo quedó √${A} · √${A} = ${A}: falta dividir.` },
        { id: 'inv', texto: fraccion(`√${A}`, K), error: 'TAL-RAC-INV', siFuera: `Bien llevar la raíz arriba. Pero arriba queda ${K}√${A} y abajo ${A}: no se invierte.` },
      ]),
      solucion: { texto: `Se multiplica arriba y abajo por √${A}: abajo queda ${A}.`, ecuacion: [{ frac: [String(K), `√${A}`] }, ' · ', F1(`√${A}/√${A}`), ' = ', ...fraccion(coefRaiz(c, `√${A}`), den)] },
    };
  }
  // Dos raíces abajo, o una raíz y un entero: con el conjugado.
  function casoConj(r, conEntero) {
    let A, B, c = 0;
    if (conEntero) { c = r.ent(1, 3); do { A = r.ent(c * c + 1, 15); } while (esCuad(A)); B = c * c; }
    else { do { A = r.ent(3, 15); B = r.ent(2, A - 1); } while (esCuad(A) || esCuad(B)); }
    const K = r.uno([1, 2, 3, 4, 6]), s = r() < 0.5 ? '+' : '−', inv = s === '+' ? '−' : '+';
    const segundo = conEntero ? String(c) : `√${B}`, Dv = A - B, g = mcd(K, Dv), cc = K / g, den = Dv / g;
    const arriba = (signo, k) => (k === 1 ? `√${A} ${signo} ${segundo}` : `${k}(√${A} ${signo} ${segundo})`);
    const g2 = mcd(K, A + B);
    return {
      pregunta: ['Racionaliza ', { frac: [String(K), `√${A} ${s} ${segundo}`] }, '.'],
      datos: [conEntero ? DF5.conjN : DF5.conj],
      opciones: opcionesP(fraccion(arriba(inv, cc), den), [
        { id: 'mismo', texto: fraccion(arriba(s, cc), den), error: 'TAL-RAC-MISMO', siFuera: `Bien dividir entre ${Dv}. Pero arriba va el conjugado: el signo cambia a ${inv}.` },
        { id: 'suma', texto: fraccion(arriba(inv, K / g2), (A + B) / g2), error: 'TAL-RAC-SUMA', siFuera: `Bien el conjugado arriba. Pero abajo queda ${A} − ${B}, no ${A} + ${B}.` },
        { id: 'sin', texto: [arriba(inv, K)], error: 'TAL-RAC-DEN', siFuera: `Bien el conjugado. Pero falta dividir entre ${Dv}, lo que quedó abajo.` },
      ]),
      solucion: { texto: `Se multiplica por el conjugado; abajo queda ${A} − ${B} = ${Dv}.`, ecuacion: [{ frac: [String(K), `√${A} ${s} ${segundo}`] }, ' = ', ...fraccion(arriba(inv, cc), den)] },
    };
  }
  // Ahora tú 4 (nivel examen): una raíz cúbica abajo.
  function casoCubica(r) {
    const A = r.uno([2, 3, 5, 6, 7]), K = r.ent(1, 6), g = mcd(K, A), c = K / g, den = A / g;
    return {
      pregunta: ['Racionaliza ', { frac: [String(K), `∛${A}`] }, '.'],
      datos: [DF5.cubo],
      opciones: opcionesP(fraccion(coefRaiz(c, `∛${A * A}`), den), [
        { id: 'cubo', texto: fraccion(coefRaiz(c, `∛${A}`), den), error: 'TAL-RAC-CUBO', siFuera: `Bien la idea de multiplicar por 1. Pero ∛${A} · ∛${A} no da ${A}: faltan tres factores.` },
        { id: 'den', texto: [coefRaiz(K, `∛${A * A}`)], error: 'TAL-RAC-DEN', siFuera: `Bien ∛${A * A} arriba. Pero abajo quedó ∛${A ** 3} = ${A}: falta dividir.` },
        { id: 'uno', texto: fraccion(String(K / g), den), error: 'TAL-RAC-UNO', siFuera: `Bien que abajo quede ${A}. Pero si solo cambias abajo, cambia el valor.` },
      ]),
      solucion: { texto: `Para que abajo haya tres factores ∛${A}, se multiplica por ∛${A}² = ∛${A * A}.`, ecuacion: [{ frac: [String(K), `∛${A}`] }, ' · ', F1(`∛${A * A}/∛${A * A}`), ' = ', ...fraccion(coefRaiz(c, `∛${A * A}`), den)] },
    };
  }
  // Ahora tú 5 (nivel examen): la suma o la resta de dos fracciones con denominadores conjugados.
  function casoDosFracciones(r) {
    let A, B;
    do { A = r.ent(3, 15); B = r.ent(2, A - 1); } while (esCuad(A) || esCuad(B));
    const suma = r() < 0.5, Dv = A - B, g = mcd(2, Dv);
    const res = v => fraccion(coefRaiz(2 / g, `√${v}`), Dv / g), g2 = mcd(2, A + B);
    return {
      pregunta: ['¿Cuánto vale ', { frac: ['1', `√${A} − √${B}`] }, suma ? ' + ' : ' − ', { frac: ['1', `√${A} + √${B}`] }, '?'],
      datos: [DF5.conj],
      opciones: opcionesP(res(suma ? A : B), [
        { id: 'cancela', texto: ['0'], error: 'TAL-RAC-CANCELA', siFuera: 'Bien ver que algo se anula. Pero arriba quedan dos raíces iguales que no se van.' },
        { id: 'cruza', texto: res(suma ? B : A), error: 'TAL-SIGNO', siFuera: `Bien el denominador ${Dv}. Pero al ${suma ? 'sumar se anulan las √' + B : 'restar se anulan las √' + A}.` },
        { id: 'suma', texto: fraccion(coefRaiz(2 / g2, `√${suma ? A : B}`), (A + B) / g2), error: 'TAL-RAC-SUMA', siFuera: `Bien los conjugados. Pero abajo queda ${A} − ${B}, no ${A} + ${B}.` },
      ]),
      solucion: { texto: `Se racionaliza cada una: abajo queda ${A} − ${B} = ${Dv}; arriba, √${A} ± √${B}.`, ecuacion: [`(√${A} + √${B}) ${suma ? '+' : '−'} (√${A} − √${B}) = 2√${suma ? A : B}   →   `, ...res(suma ? A : B)] },
    };
  }

  // Ejemplos resueltos de la idea 5. Cuentas rehechas aparte (cuentas-productos-f3.py): 3/√2 = 3√2/2 ≈ 2,12;
  // 1/√5 = √5/5; 6/√3 = 2√3; 1/√2 = √2/2 ≈ 0,707; √3/√2 = √6/2; 2/(√3 + 1) = √3 − 1; 4/(√7 − √3) = √7 + √3;
  // 3/(2√3) = √3/2; 1/∛2 = ∛4/2; 4/√2 = 2√2 ≈ 2,83; 1/(√5 − 2) + 1/(√5 + 2) = 2√5; 1/(√3 − √2) − 1/(√3 + √2) = 2√2;
  // 1/(∛3 − ∛2) = ∛9 + ∛6 + ∛4; x = 1/(√2 − 1) → x − 1/x = 2; 1/√(3 + 2√2) = √2 − 1. El nivel 1 no usa el conjugado
  // (es la predicción).
  const EJEMPLOS_RAC = [
    { nivel: 1, titulo: 'El lado de una cometa',
      enunciado: 'La varilla de punta a punta de una cometa cuadrada mide 3 m. ¿Cuánto mide su lado, sin raíz en el denominador?',
      datos: [DF5.diag, DF5.uno],
      figura: CM({ d: 3, lado: '?' }),
      solucion: [{ texto: 'El lado es 3/√2. Se multiplica arriba y abajo por √2, que es multiplicar por 1.', ecuacion: [{ frac: ['3', '√2'] }, ' · ', F1('√2/√2'), ' = ', { frac: ['3√2', '2'] }, ' ≈ 2,12'] }],
      respuesta: 'Lado: 3√2/2 m, unos 2,12 m' },
    { nivel: 1, titulo: 'Una raíz abajo',
      enunciado: ['Racionaliza ', { frac: ['1', '√5'] }, '.'],
      datos: [DF5.uno],
      solucion: [{ texto: 'Se multiplica arriba y abajo por √5: abajo queda √5 · √5 = 5.', ecuacion: [{ frac: ['1', '√5'] }, ' · ', F1('√5/√5'), ' = ', { frac: ['√5', '5'] }] }],
      respuesta: [{ frac: ['√5', '5'] }] },
    { nivel: 1, titulo: 'Se simplifica',
      enunciado: ['Racionaliza ', { frac: ['6', '√3'] }, '.'],
      datos: [DF5.uno],
      solucion: [{ texto: 'Por √3 arriba y abajo: queda 6√3/3, y 6 entre 3 es 2.', ecuacion: [{ frac: ['6', '√3'] }, ' · ', F1('√3/√3'), ' = ', { frac: ['6√3', '3'] }, ' = 2√3'] }],
      respuesta: '2√3' },
    { nivel: 1, titulo: '¿Cambió el valor?',
      enunciado: '¿Es √2/2 el mismo número que 1/√2?',
      datos: [DF5.uno],
      solucion: [{ texto: 'Si 1/√2 se multiplica arriba y abajo por √2, da √2/2. Eso es multiplicar por 1: el valor no cambia, unos 0,707.', ecuacion: [{ frac: ['1', '√2'] }, ' · ', F1('√2/√2'), ' = ', { frac: ['√2', '2'] }] }],
      respuesta: 'Sí: es el mismo número' },
    { nivel: 1, titulo: 'Raíz arriba y abajo',
      enunciado: ['Racionaliza ', { frac: ['√3', '√2'] }, '.'],
      datos: [DF5.uno, '√a · √b = √(ab)'],
      solucion: [{ texto: 'Por √2 arriba y abajo: arriba √3 · √2 = √6 y abajo, 2.', ecuacion: [{ frac: ['√3', '√2'] }, ' · ', F1('√2/√2'), ' = ', { frac: ['√6', '2'] }] }],
      respuesta: [{ frac: ['√6', '2'] }] },
    { nivel: 2, titulo: 'Con el conjugado',
      enunciado: ['Racionaliza ', { frac: ['2', '√3 + 1'] }, '.'],
      datos: [DF5.conjN],
      solucion: [
        { texto: 'Se multiplica por el conjugado, √3 − 1, arriba y abajo. Abajo queda 3 − 1 = 2.', ecuacion: [{ frac: ['2', '√3 + 1'] }, ' · ', F1('(√3 − 1)/(√3 − 1)'), ' = ', { frac: ['2(√3 − 1)', '2'] }] },
        { texto: 'El 2 de arriba y el de abajo se van.', ecuacion: ['= √3 − 1'] },
      ],
      respuesta: '√3 − 1' },
    { nivel: 2, titulo: 'Dos raíces abajo',
      enunciado: ['Racionaliza ', { frac: ['4', '√7 − √3'] }, '.'],
      datos: [DF5.conj],
      solucion: [
        { texto: 'El conjugado de √7 − √3 es √7 + √3. Abajo queda 7 − 3 = 4.', ecuacion: [{ frac: ['4', '√7 − √3'] }, ' · ', F1('(√7 + √3)/(√7 + √3)'), ' = ', { frac: ['4(√7 + √3)', '4'] }] },
        { texto: 'Se simplifica el 4.', ecuacion: ['= √7 + √3'] },
      ],
      respuesta: '√7 + √3' },
    { nivel: 2, titulo: 'Un número con la raíz',
      enunciado: ['Racionaliza ', { frac: ['3', '2√3'] }, '.'],
      datos: [DF5.uno],
      solucion: [
        { texto: 'Basta multiplicar por √3: el 2 no tiene raíz.', ecuacion: [{ frac: ['3', '2√3'] }, ' · ', F1('√3/√3'), ' = ', { frac: ['3√3', '2 · 3'] }] },
        { texto: 'Abajo, 2 · 3 = 6, y 3/6 = 1/2.', ecuacion: ['= ', { frac: ['√3', '2'] }] },
      ],
      respuesta: [{ frac: ['√3', '2'] }] },
    { nivel: 2, titulo: 'Una raíz cúbica',
      enunciado: ['Racionaliza ', { frac: ['1', '∛2'] }, '.'],
      datos: [DF5.cubo],
      solucion: [
        { texto: 'Con ∛2 abajo no basta multiplicar por ∛2: hacen falta tres factores ∛2. Faltan dos: ∛4.', ecuacion: ['∛2 · ∛4 = ∛8 = 2'] },
        { texto: 'Se multiplica arriba y abajo por ∛4.', ecuacion: [{ frac: ['1', '∛2'] }, ' · ', F1('∛4/∛4'), ' = ', { frac: ['∛4', '2'] }] },
      ],
      respuesta: [{ frac: ['∛4', '2'] }] },
    { nivel: 2, titulo: 'La cometa grande',
      enunciado: 'La varilla de punta a punta de una cometa cuadrada mide 4 m. ¿Cuánto mide su lado, sin raíz abajo?',
      datos: [DF5.diag, DF5.uno],
      figura: CM({ d: 4, lado: '?' }),
      solucion: [
        { texto: 'El lado es la varilla entre √2.', ecuacion: ['lado = ', { frac: ['4', '√2'] }] },
        { texto: 'Por √2 arriba y abajo, y 4 entre 2 es 2.', ecuacion: [{ frac: ['4', '√2'] }, ' · ', F1('√2/√2'), ' = ', { frac: ['4√2', '2'] }, ' = 2√2 ≈ 2,83'] },
      ],
      respuesta: 'Lado: 2√2 m, unos 2,83 m' },
    { nivel: 3, titulo: 'Suma con conjugados',
      enunciado: ['¿Cuánto vale ', { frac: ['1', '√5 − 2'] }, ' + ', { frac: ['1', '√5 + 2'] }, '?'],
      alternativas: ['2√5', '4', '0', '√5', '2√5 + 4'],
      datos: [DF5.conjN],
      solucion: [
        { texto: 'Abajo, con el conjugado: 5 − 4 = 1. Así la primera es √5 + 2 y la segunda, √5 − 2.', ecuacion: [{ frac: ['1', '√5 − 2'] }, ' = √5 + 2   y   ', { frac: ['1', '√5 + 2'] }, ' = √5 − 2'] },
        { texto: 'Al sumar, los 2 se anulan.', ecuacion: ['(√5 + 2) + (√5 − 2) = 2√5'] },
        { texto: ['La ', letra('B'), ' resta en vez de sumar; la ', letra('C'), ' cree que todo se anula.'] },
      ],
      respuesta: [letra('A'), ', 2√5'] },
    { nivel: 3, titulo: 'Resta con conjugados',
      enunciado: ['¿Cuánto vale ', { frac: ['1', '√3 − √2'] }, ' − ', { frac: ['1', '√3 + √2'] }, '?'],
      alternativas: ['2√3', '0', '2√2', '√2', '2√6'],
      datos: [DF5.conj],
      solucion: [
        { texto: 'Abajo, 3 − 2 = 1: la primera es √3 + √2 y la segunda, √3 − √2.', ecuacion: [{ frac: ['1', '√3 − √2'] }, ' = √3 + √2'] },
        { texto: 'Al restar, se van las √3 y quedan dos √2.', ecuacion: ['(√3 + √2) − (√3 − √2) = 2√2'] },
        { texto: ['La ', letra('A'), ' suma en vez de restar; la ', letra('B'), ' cree que todo se anula.'] },
      ],
      respuesta: [letra('C'), ', 2√2'] },
    { nivel: 3, titulo: 'Con raíces cúbicas',
      enunciado: ['Racionaliza ', { frac: ['1', '∛3 − ∛2'] }, '.'],
      alternativas: ['∛3 + ∛2', '∛9 + ∛6 + ∛4', '∛9 − ∛6 + ∛4', '(∛3 + ∛2)/5', '∛9 + ∛4'],
      datos: [DF3.difC],
      solucion: [
        { texto: 'Con a = ∛3 y b = ∛2, a³ − b³ = 3 − 2 = 1. Se multiplica por a² + ab + b².', ecuacion: ['(∛3 − ∛2)(∛9 + ∛6 + ∛4) = 3 − 2 = 1'] },
        { texto: 'Abajo queda 1: la fracción es lo de arriba.', ecuacion: [{ frac: ['1', '∛3 − ∛2'] }, ' = ∛9 + ∛6 + ∛4'] },
        { texto: ['La ', letra('A'), ' usa el conjugado de las raíces cuadradas, que aquí no sirve; la ', letra('C'), ' cambia un signo.'] },
      ],
      respuesta: [letra('B'), ', ∛9 + ∛6 + ∛4'] },
    { nivel: 3, titulo: 'Un número y su inverso',
      enunciado: ['Si x = ', { frac: ['1', '√2 − 1'] }, ', ¿cuánto vale x − 1/x?'],
      alternativas: ['2', '2√2', '0', '1', '√2'],
      datos: [DF5.conjN],
      solucion: [
        { texto: 'Con el conjugado, abajo queda 2 − 1 = 1: x = √2 + 1. Y 1/x es √2 − 1.', ecuacion: ['x = √2 + 1   y   1/x = √2 − 1'] },
        { texto: 'Al restar, se van las √2.', ecuacion: ['(√2 + 1) − (√2 − 1) = 2'] },
        { texto: ['La ', letra('B'), ' suma en vez de restar; la ', letra('C'), ' cree que todo se anula.'] },
      ],
      respuesta: [letra('A'), ', 2'] },
    { nivel: 3, titulo: 'Un radical doble abajo',
      enunciado: ['Racionaliza ', { frac: ['1', ['√(3 + 2√2)']] }, '.'],
      alternativas: ['√2 + 1', '√2 − 1', '1/3', '√3 − √2', '3 − 2√2'],
      datos: [DF4.rd, DF5.conjN],
      solucion: [
        { texto: 'Primero el radical doble: 2 + 1 = 3 y 2 · 1 = 2, así que √(3 + 2√2) = √2 + 1.', ecuacion: [{ frac: ['1', '√2 + 1'] }] },
        { texto: 'Con el conjugado, abajo queda 2 − 1 = 1.', ecuacion: [{ frac: ['1', '√2 + 1'] }, ' · ', F1('(√2 − 1)/(√2 − 1)'), ' = √2 − 1'] },
        { texto: ['La ', letra('A'), ' no cambia el signo; la ', letra('D'), ' reparte la raíz; la ', letra('E'), ' se olvida de la raíz grande.'] },
      ],
      respuesta: [letra('B'), ', √2 − 1'] },
  ];

  // El juego de la idea 5: qué pasa con el lado según por qué se multiplica.
  const POR = {
    nada: { texto: 'Sin multiplicar' }, raiz: { texto: 'Por √2/√2' }, dos: { texto: 'Por 2/2' }, arriba: { texto: 'Por √2, solo arriba' },
  };
  const ladoJuego = (d, por) => (por === 'raiz' ? `${ladoCometa(d)} m` : por === 'dos' ? `${2 * d}/(2√2) m` : por === 'arriba' ? `${d} m` : `${d}/√2 m`);
  const racionalizar = {
    id: 'racionalizar',
    titulo: 'Racionalizar es multiplicar por uno',
    pregunta: '¿Cómo se saca una raíz del denominador sin cambiar el valor?',
    temas: ['Racionalización'],
    pieza: 'alg-objeto',
    aprendizaje: 'Racionalizar es multiplicar arriba y abajo por algo que vale 1 hasta que abajo no quede raíz: √a por √a; √a − √b por √a + √b.',
    actividad: 'Calcular el lado de una cometa sin dividir entre una raíz.',
    // Lee: la cometa, por qué su lado es d/√2 y la palabra «racionalizar». No dice qué hacer con dos raíces abajo (la
    // predicción).
    lee: {
      tarjetas: [
        { titulo: 'La cometa', texto: 'En agosto, en Puno, los chicos hacen volar cometas. Esta tiene forma de cuadrado, y su varilla larga, de punta a punta, mide 1 m. Esa varilla es la diagonal del cuadrado.',
          pieza: 'alg-objeto', dibujo: CM({ d: 1 }) },
        { titulo: 'El lado de la cometa', texto: 'En un cuadrado, la diagonal mide el lado por √2. Así que el lado mide 1 entre √2: dividir entre 1,4142…, un número cuyas cifras no terminan. Sin calculadora, es incómodo.',
          ecuacion: ['lado = ', { frac: ['1', '√2'] }, ' m'] },
        { titulo: 'Racionalizar', texto: 'Cambiar una fracción por otra del mismo valor, pero sin raíces en el denominador, el número de abajo, se llama racionalizar.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir por qué multiplicar arriba y abajo. Compara el lado de la cometa antes y después: ¿cambió?' },
      ],
    },
    ejemplos: EJEMPLOS_RAC,
    juega: {
      pieza: 'alg-objeto',
      consigna: 'La varilla de punta a punta de una cometa cuadrada es su diagonal. Su lado mide la varilla entre √2.',
      mision: {
        texto: 'Con la varilla de 1 m, elige el factor que deja el denominador sin raíz.',
        logrado: val => val.d === 1 && val.por === 'raiz',
        bien: 'Multiplicar arriba y abajo por √2 es multiplicar por 1: el lado no cambió.',
      },
      voz: 'Compara el lado de la cometa antes y después.',
      leyenda: [
        { s: 'd', t: 'largo de la varilla (la diagonal), en m' },
        { s: 'd/√2', t: 'el lado de la cometa' },
        { s: F1('√2/√2'), t: 'un factor que vale 1' },
        { s: 'm', t: 'metro' },
      ],
      controles: [
        { id: 'd', etiqueta: 'Varilla, d (m)', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'por', etiqueta: 'Multiplicar', opciones: Object.entries(POR).map(([valor, x]) => ({ valor, texto: x.texto })) },
      ],
      dibujo: v => CM({ d: v.d, lado: ladoJuego(v.d, v.por), otro: v.por === 'arriba' ? v.d : undefined }),
      // La relación: lo que se hace con la fracción y lo que pasa con el lado.
      lectura: v => {
        const val = f(v.d / Math.SQRT2, 3), fr = `${v.d}/√2`;
        if (v.por === 'raiz') return [fr, ' · ', F1('√2/√2'), ` = ${ladoCometa(v.d)} ≈ ${val} m: el mismo lado`];
        if (v.por === 'dos') return [fr, ' · ', F1('2/2'), ` = ${2 * v.d}/(2√2) ≈ ${val} m: queda raíz abajo`];
        if (v.por === 'arriba') return [`${fr} · √2 = ${v.d} m, no ${val}: cambió el valor`];
        return [`${fr} ≈ ${val} m: hay que dividir entre √2`];
      },
      minimo: 3,
    },
    predice: {
      pieza: 'alg-tabla',
      pregunta: ['¿Por qué expresión conviene multiplicar ', { frac: ['1', '√5 − √3'] }, ' para que el denominador quede sin raíces?'],
      datos: ['(√5)² = 5', '(√3)² = 3'],
      voz: 'Buscamos un 1 que deje abajo un número sin raíz.',
      opciones: [
        { id: 'c', texto: [{ frac: ['√5 + √3', '√5 + √3'] }], correcta: true },
        { id: 'mismo', texto: [{ frac: ['√5 − √3', '√5 − √3'] }], error: 'TAL-RAC-MISMO', siFuera: 'Bien multiplicar por 1. Pero abajo queda (√5 − √3)² = 8 − 2√15: sigue con raíz.' },
        { id: 'una', texto: [{ frac: ['√5', '√5'] }], error: 'TAL-RAC-UNA', siFuera: 'Bien: así se hace con una sola raíz. Aquí abajo queda 5 − √15.' },
        { id: 'solo', texto: '√5 + √3, solo arriba', error: 'TAL-RAC-UNO', siFuera: 'Bien elegir √5 + √3. Pero solo arriba cambia el valor: va arriba y abajo.' },
      ],
      dibujo: { datos: { columnas: ['expresión', '≈ valor'], filas: [['1/(√5 − √3)', f(1 / (Math.sqrt(5) - Math.sqrt(3)), 3)], ['× ?', ''], ['?', '']], alt: 'Uno sobre raíz de 5 menos raíz de 3, y un factor por elegir' }, estado: {} },
      revelar: { datos: { columnas: ['expresión', '≈ valor'], filas: [['1/(√5 − √3)', f(1 / (Math.sqrt(5) - Math.sqrt(3)), 3)], [{ t: '× (√5 + √3)/(√5 + √3)', color: 'f' }, 'por 1'], [{ t: '(√5 + √3)/2', fuerte: true }, { t: f((Math.sqrt(5) + Math.sqrt(3)) / 2, 3), fuerte: true }]], alt: 'Con el conjugado, el denominador queda 5 − 3 = 2 y el valor no cambia' }, estado: {} },
      coincide: 'Coincide: (√5 − √3)(√5 + √3) = 5 − 3 = 2, sin raíces.',
      noCoincide: 'Revisemos: (√5 − √3)(√5 + √3) es una suma por diferencia.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: {
        columnas: ['paso', 'expresión'],
        filas: [['de partida', '1/(√5 − √3)'], [{ t: 'por 1', desde: 1 }, { t: '× (√5 + √3)/(√5 + √3)', desde: 1, color: 'f' }], [{ t: 'abajo', desde: 2 }, { t: '(√5)² − (√3)² = 2', desde: 2 }], [{ t: 'resultado', desde: 3 }, { t: '(√5 + √3)/2', desde: 3, fuerte: true }]],
        alt: 'Multiplicar por el conjugado sobre sí mismo deja el denominador 5 − 3 = 2',
      },
      voz: 'Un 1 bien elegido: el conjugado sobre sí mismo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se multiplica por el conjugado sobre sí mismo: eso vale 1.', ecuacion: [F1('(√5 + √3)/(√5 + √3)'), ' = 1'] },
        { estado: { corte: 2 }, texto: 'Abajo queda una suma por diferencia: las raíces se van.', ecuacion: ['(√5 − √3)(√5 + √3) = 5 − 3 = 2'] },
        { estado: { corte: 3 }, texto: 'Arriba queda √5 + √3, y abajo, 2.', ecuacion: [{ frac: ['√5 + √3', '2'] }] },
        { estado: { corte: 3 }, texto: 'El valor no cambió: los dos dan lo mismo.', ecuacion: [`1/(√5 − √3) ≈ ${f(1 / (Math.sqrt(5) - Math.sqrt(3)), 3)} ≈ (√5 + √3)/2`] },
      ],
    },
    regla: {
      texto: 'Se multiplica arriba y abajo por un mismo factor, que vale 1, hasta que abajo no quede raíz: √a con √a, √a − √b con su conjugado, ∛a con ∛a².',
      ecuacion: [{ frac: ['1', ['√', aa]] }, ' = ', { frac: [['√', aa], aa] }, SEP,
        { frac: ['1', ['√', aa, ' − √', bb]] }, ' = ', { frac: [{ llave: ['√', aa, ' + √', bb], nota: 'el conjugado', color: 'c-f', arriba: true }, { llave: [aa, ' − ', bb], nota: 'sin raíces' }] }, SEP,
        { frac: ['1', ['∛', aa]] }, ' = ', { frac: [['∛', aa, '²'], aa] }],
      condicion: 'a y b positivos y distintos, para que abajo no quede cero. El valor de la fracción no cambia.',
      voz: 'Multiplicar por 1 no cambia el valor, solo la forma.',
    },
    // Así se resuelve: el lado de una cometa. «Ahora tú» pide otra cosa: racionalizar una raíz, dos raíces o una raíz y un
    // entero (conjugado), una raíz cúbica, o sumar y restar fracciones conjugadas.
    resuelve: {
      pieza: 'alg-objeto',
      generar(s) {
        const r = azar(s + 900), D = r.ent(1, 8), lado = ladoCometa(D), val = f(D / Math.SQRT2, 2);
        return {
          enunciado: `La varilla de punta a punta de una cometa cuadrada mide ${D} m. ¿Cuánto mide su lado, escrito sin raíz en el denominador?`,
          datos: [DF5.diag, DF5.uno],
          dibujo: CM({ d: D, lado: '?' }),
          pasos: [
            { tipo: 'pide', texto: 'Piden el lado de la cometa, sin raíz abajo.' },
            { tipo: 'regla', texto: `La diagonal es el lado por √2, así que el lado es ${D}/√2. Para sacar la raíz de abajo, multiplico arriba y abajo por √2: es multiplicar por 1.`, ecuacion: ['lado = ', { frac: [String(D), '√2'] }] },
            { tipo: 'cuentas', texto: `Abajo queda √2 · √2 = 2.${D % 2 === 0 ? ` Y ${D} entre 2 es ${D / 2}.` : ''}`,
              ecuacion: [{ frac: [String(D), '√2'] }, ' · ', F1('√2/√2'), ' = ', { frac: [`${D}√2`, '2'] }, ...(D % 2 === 0 ? [` = ${lado}`] : [])], dibujo: CM({ d: D, lado: `${lado} m` }) },
            { tipo: 'sentido', texto: `Lo reviso: ${D}/√2 ≈ ${val} y ${lado} ≈ ${val}. Es el mismo lado, y es menor que la varilla, como debe ser.` },
          ],
          respuesta: `Lado: ${lado} m, unos ${val} m`,
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-objeto',
      voz: 'Busca el factor que vale 1 y deja abajo un número sin raíz.',
      generar(sem) {
        const r = azar(sem + 73), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoUnaRaiz, r);
        if (tipo === 1) return conCuatro(rr => casoConj(rr, false), r);
        if (tipo === 2) return conCuatro(rr => casoConj(rr, true), r);
        if (tipo === 3) return conCuatro(casoCubica, r);
        return conCuatro(casoDosFracciones, r);
      },
    },
  };

  // ---------- Laboratorio (cada mesa cuelga de su idea, con la paleta de la unidad) ----------
  // Mesa de la idea 2: el rectángulo (x + p)(x + q); si q = −p no se puede dibujar, pero con p = q vuelve el cuadrado de la
  // idea 1. x naranja, p turquesa, q en tinta con su rótulo; las dos piezas del medio, px y qx, violeta; la esquina pq en
  // tinta.
  const ESC_N = 24;   // px por unidad: x + p llega a 8 y el lado a 192 px, lo que cabe en la pieza
  // Con la escala fija, un tramo de menos de 56 px muestra solo su letra (el valor está en el control y la lectura).
  const rot = (t, v, val = v) => (v * ESC_N >= 56 ? `${t} = ${val}` : t);
  const xx = T1('x'), pp = T2('p');
  const rectXPQ = v => ({
    anchos: [{ t: rot('x', v.x), v: v.x, color: 'o' }, { t: rot('p', v.p), v: v.p, color: 'i' }],
    altos: [{ t: 'x', v: v.x, color: 'o' }, { t: rot('q', v.q), v: v.q }],
    celdas: [[{ t: rot('x²', v.x, v.x * v.x), color: 'o' }, { t: `${v.p * v.x}`, color: 'f' }], [{ t: `${v.q * v.x}`, color: 'f' }, { t: `${v.p * v.q}` }]],
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
      { id: 'q', etiqueta: 'q', min: 1, max: 3, paso: 1, inicio: 3, decimales: 0 },
    ],
    dibujo: v => ({ datos: rectXPQ(v), estado: {} }),
    lectura: v => [xx, ` = ${v.x}, `, pp, ` = ${v.p}, q = ${v.q}: área ${(v.x + v.p) * (v.x + v.q)}`],
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

  // Mesa de la idea 3: el cubo que se abre (laboratorio 3D, 15 nov: exploración libre, sin predicciones). Las ocho piezas
  // y sus volúmenes los arma plantillas/cuadrado-crece/motor.js (piezasCubo) a través de la pieza alg-cubo-3d: los retos
  // miden lo mismo que se dibuja (regla 1). abrir es el control de tiempo: nada se anima solo. Con la paleta de la unidad
  // (datos.colores): a³ naranja, a²b violeta, ab² en tinta, b³ turquesa.
  const CUBO3 = () => Kit.piezas['alg-cubo-3d'];
  const cuentaCubo = v => CUBO3().cuenta(v);
  const vol = (v, k) => cuentaCubo(v).tipos[k].volumen;
  const COLORES_CUBO = { a3: 'c-o', a2b: 'c-f', ab2: 'ink', b3: 'c-i' };
  const mesaCubo = {
    id: 'cubo-se-abre', titulo: 'El cubo que se abre', pieza: 'alg-cubo-3d',
    consigna: 'Gira el cubo con el dedo y ábrelo. Cambia a y b: mira qué piezas crecen entre las dos esquinas.',
    controles: [
      { id: 'a', etiqueta: 'a', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      { id: 'b', etiqueta: 'b', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      { id: 'abrir', etiqueta: 'Abrir', min: 0, max: 1, paso: 0.25, inicio: 0, decimales: 2 },
    ],
    dibujo: v => ({ datos: { a: v.a, b: v.b, abrir: v.abrir, colores: COLORES_CUBO }, estado: {} }),
    lectura: v => {
      const c = cuentaCubo(v), t = c.tipos;
      return [`(a + b)³ = ${f(c.suma)}: `, T1(f(t.a3.volumen)), ' + ', PM(f(3 * t.a2b.volumen)), ` + ${f(3 * t.ab2.volumen)} + `, T2(f(t.b3.volumen))];
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
    version: '0.4.0',
    // Fase 3 del método (18 nov): las cinco ideas rehechas contra el contrato; la unidad pasa a calidad 2.
    calidad: 2,
    // Un color fijo por magnitud (cabecera); lo comprueba productos-notables.test.js.
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
    // Glosario por tema (docs/teoria.md §4d): las palabras que esta unidad estrena en álgebra, en el orden de sus ideas.
    // Ninguna muestra la respuesta de una predicción (Gerson, 18 nov): ni (a − b)², ni 31 · 29, ni la suma de cubos con
    // la suma y el producto, ni un radical doble con menos, ni el conjugado multiplicado.
    glosario: [
      // Los tres que estrena la idea 1 (rehecha, 18 nov), con su aproximación (simple) y tres ejemplos.
      { termino: 'producto notable', formas: ['producto notable', 'productos notables'],
        def: 'Multiplicación que aparece tanto que conviene reconocer sus piezas sin hacer toda la cuenta.',
        simple: 'Una multiplicación de forma conocida, como (a + b)², que se arma con piezas.', ver: ['binomio', 'doble producto'],
        ejemplos: ['(a + b)² = a² + 2ab + b².', '(x + 3)² = x² + 6x + 9.', '(2x + 1)² = 4x² + 4x + 1.'] },
      // «binomio» se define en «Binomio de Newton» (Gerson, mesa del 18 nov, cuarta ronda): aquí no se repite; el lector
      // lo marca igual, con «Se explica en…» esa unidad (nucleo/glosario.js: un término del curso vale en todo el curso).
      { termino: 'doble producto', formas: ['doble producto', 'dobles productos'], def: 'Dos veces el producto de los dos términos de un binomio: 2ab.',
        simple: 'Las dos franjas iguales del medio: 2 · a · b.', ver: ['binomio'],
        ejemplos: ['En (x + 3)², es 2 · x · 3 = 6x.', 'En (10 + 2)², es 2 · 10 · 2 = 40.', 'Es lo que falta si se cree que (a + b)² = a² + b².'] },
      { termino: 'distributiva', formas: ['distributiva', 'distributividad'], def: 'Propiedad que reparte un producto sobre una suma: a(b + c) = ab + ac.',
        simple: 'Multiplicar una suma es multiplicar cada sumando y juntar.',
        ejemplos: ['3(x + 2) = 3x + 6.', '5 · 12 = 5 · 10 + 5 · 2 = 60.', '(a + b)(a + b) = aa + ab + ba + bb.'] },
      // Los dos que estrena la idea 2 (nueva, 18 nov).
      { termino: 'diferencia de cuadrados', formas: ['diferencia de cuadrados', 'diferencias de cuadrados'],
        def: 'La resta de dos números elevados al cuadrado, a² − b²; se escribe como (a + b)(a − b).',
        simple: 'Un cuadrado menos otro cuadrado.', ver: ['producto notable', 'identidad'],
        ejemplos: ['x² − 9 lo es: 9 = 3².', '10² − 3² = 100 − 9 = 91.', '(x + 4)(x − 4) da x² − 16.'] },
      { termino: 'identidad', formas: ['identidad', 'identidades'], def: 'Igualdad que se cumple con cualquier valor de las letras, no solo con algunos.',
        simple: 'Una igualdad que vale siempre, con los números que pongas.',
        ejemplos: ['x + x = 2x vale para todo x.', '(a + b)² = a² + 2ab + b² vale para todo a y b.', 'x + 2 = 5 no lo es: solo vale con x = 3.'] },
      // Los tres que estrena la idea 3 (nueva, 18 nov).
      { termino: 'arista', formas: ['arista', 'aristas'], def: 'Cada borde recto de un cubo o de una caja, donde se juntan dos caras.',
        simple: 'El borde de una caja, donde se juntan dos caras.', ver: ['volumen'],
        ejemplos: ['Un cubo tiene 12 aristas iguales.', 'Un cubo de arista 3 tiene volumen 3 · 3 · 3 = 27.', 'Una caja de 3 por 2 por 1 tiene aristas de 3, 2 y 1.'] },
      { termino: 'volumen', formas: ['volumen', 'volúmenes'], def: 'Cuánto espacio ocupa un cuerpo: en una caja, largo por ancho por alto.',
        simple: 'Cuánto espacio ocupa algo, contado en cubitos.', ver: ['arista'],
        ejemplos: ['Un cubo de arista 2 tiene volumen 2 · 2 · 2 = 8.', 'Una caja de 3 por 2 por 2 dm guarda 12 dm³.', 'Un litro es 1 dm³.'] },
      { termino: 'suma de cubos', formas: ['suma de cubos', 'sumas de cubos'], def: 'La suma de dos números elevados al cubo: a³ + b³.',
        simple: 'Un cubo más otro cubo.', ver: ['volumen'],
        ejemplos: ['2³ + 1³ = 8 + 1 = 9.', 'x³ + 27 lo es: 27 = 3³.', '4³ + 1³ = 64 + 1 = 65.'] },
      // Los dos que estrena la idea 4 (reescrita, 18 nov).
      { termino: 'radical doble', formas: ['radical doble', 'radicales dobles'], def: 'Una raíz con otra raíz adentro, de la forma √(A ± 2√B).',
        simple: 'Una raíz con otra raíz adentro.', ver: ['radical', 'radical simple'],
        ejemplos: ['√(5 + 2√6) es uno.', '√(8 + 2√15) = √5 + √3, porque 5 + 3 = 8 y 5 · 3 = 15.', 'El lado de una mesa de 5 + 2√6 dm² es uno.'] },
      { termino: 'radical simple', formas: ['radical simple', 'radicales simples', 'raíces simples', 'raíz simple'], def: 'Una raíz sola, sin otra raíz adentro.',
        simple: 'Una raíz sin otra raíz adentro, como √5.', ver: ['radical doble'],
        ejemplos: ['√5 y √3 lo son.', 'En √3 + √2 hay dos.', '√(5 + 2√6) no lo es, pero vale √3 + √2.'] },
      // Los tres que estrena la idea 5 (reescrita, 18 nov). El conjugado, sin multiplicarlo (es la predicción).
      { termino: 'racionalizar', formas: ['racionalizar', 'racionaliza', 'racionalización'],
        def: 'Cambiar una fracción por otra de igual valor cuyo denominador ya no tenga raíces.',
        simple: 'Sacar la raíz de abajo de una fracción sin cambiar su valor.', ver: ['conjugado', 'denominador'],
        ejemplos: ['1/√2 = √2/2.', '6/√3 = 2√3.', 'El lado de la cometa de 1 m, 1/√2 m, se escribe √2/2 m.'] },
      { termino: 'denominador', formas: ['denominador', 'denominadores'], def: 'El número de abajo en una fracción: entre cuánto se divide.',
        simple: 'El número de abajo de una fracción.',
        ejemplos: ['En 3/4 es el 4.', 'En 1/√2 es √2.', 'En √2/2 es 2: ya no tiene raíz.'] },
      { termino: 'conjugado', formas: ['conjugado', 'conjugados', 'conjugada'],
        def: 'La misma pareja de términos con el signo del medio cambiado: √a − √b y √a + √b.',
        simple: 'La misma pareja con el signo del medio al revés.', ver: ['racionalizar', 'diferencia de cuadrados'],
        ejemplos: ['El de x + 2 es x − 2.', 'El de 3 − √2 es 3 + √2.', 'El de √7 + 1 es √7 − 1.'] },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'cubo-se-abre': ['cubo-binomio'],
      'rectangulo-x-p-q': ['suma-por-diferencia'],
    },
    ideas: [notables, sumaPorDif, cuboBinomio, dobles, racionalizar],
  };
});
