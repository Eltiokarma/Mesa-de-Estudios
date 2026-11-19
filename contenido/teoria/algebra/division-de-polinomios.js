/*
 * Teoría de «División de polinomios y cocientes notables» (algebra.division-de-polinomios), cuarta unidad de la rama
 * «Expresiones algebraicas», después de «Polinomios».
 *
 * Etapa 6 del método (19 nov 2026; docs/etapa6/propuesta-algebra.md, con sus «Decisiones tomadas»): seis ideas, con el
 * pasadizo del maestro Rubén (pieza alg-reparto, dibujos de prueba) como hilo: 1 «Algoritmo de la división»
 * (`algoritmo`: el pedido acomodado en un pasadizo de ancho dado), 2 «División clásica y Horner» (`horner`, nueva: la
 * cuenta por columnas en el cuaderno), 3 «Regla de Ruffini» (`ruffini`: la tabla de tres filas), 4 «Divisor de la forma
 * cx + b» (`divisor-k`: el pasadizo más ancho), 5 «Teorema del resto» (`teorema-resto`: el piso que se angosta) y
 * 6 «Cocientes notables» (`cocientes-notables`: la calculadora con x = 10). Los ids de la ronda 2 no cambian; la idea
 * nueva no reemplaza a ninguna, así que no hay avance que migrar.
 *
 * Letras (las de «Las cuatro operaciones»): D dividendo, d divisor, q cociente, r resto; la tabla entera va en `letras`.
 * REGLA DE COLORES DE LA UNIDAD (docs/molde-unidad.md §5b; propuesta §6), en la tabla COLORES (def.colores):
 *   - tinta: el dividendo D (el pedido entero, el total), las letras x e y y lo que se pide con «?»;
 *   - turquesa (c-i): el divisor d (el ancho del pasadizo) y lo que sale de él: a (el número que lo anula), c y b;
 *   - violeta (c-f): el cociente q (el largo), lo que casi siempre se pide, y los 0 de las potencias que faltan (lo que
 *     se olvida, como en Polinomios);
 *   - naranja (c-o): el resto r, lo que sobra (como en «Las cuatro operaciones»);
 *   - ni carmín ni verde (division-de-polinomios.test.js lo comprueba en todas las fichas y figuras).
 * Nada antes de Predice de cada idea (título, Resumen, Lee, glosario, juego) dice su respuesta (prueba propia).
 * No se adelanta Factorización: no se dice «factor» como teorema ni «raíz»; D(a) = 0 es «división exacta».
 *
 * Errores: PO1–PO35 de plantillas/polinomios/ (hipótesis del proyecto) y TAL-* (hipótesis de diseño; los de cada idea
 * en su comentario). Práctica: plantillas/division-practica/ (formato «predicciones», tipos por idea). La escena vieja
 * «La máquina de Ruffini» (plantillas/polinomios/) va a «Más mesas del tema» en esta unidad ("rehacer").
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
    r();
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r.noCero = (lo, hi) => { let v = 0; while (v === 0) v = lo + Math.floor(r() * (hi - lo + 1)); return v; };
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { if (!o || o.texto === null || o.texto === undefined || o.texto === '') continue; const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  const ops = lista => distintas(lista).slice(0, 4);
  function conCuatro(caso, r) {
    for (let i = 0; i < 80; i++) { const c = caso(r); if (c && c.opciones.length >= 4) return c; }   // null: el caso no sirve, otro
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  // ---------- Escritura de polinomios ----------
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = n => String(n).split('').map(c => SUP[c]).join('');
  const pot = (v, e) => (e === 0 ? '' : e === 1 ? v : v + sup(e));
  // Polinomio en x con coeficientes de mayor a menor grado: [2, 0, −5, 1] → «2x³ − 5x + 1».
  function poli(cs, v = 'x') {
    const n = cs.length - 1, out = [];
    cs.forEach((c, k) => { if (c !== 0) out.push([c, n - k]); });
    if (!out.length) return '0';
    return out.map(([c, e], i) => {
      const abs = Math.abs(c), lit = pot(v, e), num = abs === 1 && lit ? '' : f(abs);
      return (c < 0 ? (i ? ' − ' : '−') : (i ? ' + ' : '')) + num + lit;
    }).join('');
  }
  const par = v => (v < 0 ? `(${f(v)})` : f(v));
  const conPar = t => (/[+−]/.test(t.slice(1)) ? `(${t})` : t);   // un polinomio de varios términos va entre paréntesis
  const evaluar = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
  const multiplicar = (A, B) => { const out = Array(A.length + B.length - 1).fill(0); A.forEach((u, i) => B.forEach((w, j) => { out[i + j] += u * w; })); return out; };
  const sumar = (A, B) => { const n = Math.max(A.length, B.length), a = Array(n - A.length).fill(0).concat(A), b = Array(n - B.length).fill(0).concat(B); return a.map((v, i) => v + b[i]); };
  const sinCeros = cs => { const i = cs.findIndex(c => c !== 0); return i < 0 ? [0] : cs.slice(i); };
  // División larga (el primer coeficiente de d divide a todos los de q, como en los ejercicios de la unidad).
  function dividir(cs, d) {
    const cur = cs.slice(), q = [];
    for (let k = 0; k + d.length <= cur.length; k++) { const c = cur[k] / d[0]; q.push(c); d.forEach((u, i) => { cur[k + i] -= c * u; }); }
    return { q, r: sinCeros(cur.slice(cur.length - (d.length - 1))) };
  }
  // Ruffini de cs entre x − a: la fila de abajo (el cociente y, al final, el resto).
  const ruffini = (cs, x) => cs.reduce((b, c, i) => [...b, i ? c + x * b[i - 1] : c], []);
  const divisorTxt = a => (a < 0 ? `x + ${f(-a)}` : `x − ${f(a)}`);

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba la prueba propia) ----------
  const COLORES = { divisor: 'i', 'número del divisor': 'i', cociente: 'f', 'lo que se olvida': 'f', resto: 'o' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: String(t), m: mg });
  const DV = ficha('divisor'), NA = ficha('número del divisor'), QC = ficha('cociente'), OLV = ficha('lo que se olvida'), RS = ficha('resto');
  const d_ = DV('d'), q_ = QC('q'), r_ = RS('r');
  // La letra de una alternativa, en negrita y en tinta (Gerson, mesa del 17 nov). El U+2060 (invisible) queda para que la
  // letra no se lea como variable.
  const letra = L => ({ negrita: `${L}⁠` });
  const SEP = '   ·   ';
  const RP = datos => ({ pieza: 'alg-reparto', datos, estado: {} });
  const LO = datos => ({ pieza: 'alg-losetas', datos, estado: {} });
  const TB = datos => ({ pieza: 'alg-tabla', datos, estado: {} });

  // Datos que se repiten (herramientas, no el paso hecho).
  const DD = {
    ident: 'Al dividir D entre d: D = d · q + r, con r de grado menor que d',
    grado: 'Grado de un polinomio de una letra: su mayor exponente de x',
    prodPot: 'xᵐ · xⁿ = xᵐ⁺ⁿ',
    cubre: 'Una loseta cubre x² dm²; una tira, x dm²; un cuadradito, 1 dm²',
    mult: 'Para multiplicar polinomios, cada término de uno multiplica a cada término del otro',
    sumaCoef: 'Suma de coeficientes de un polinomio P: P(1)',
    indep: 'Término independiente de un polinomio P: P(0)',
    evaluar: 'P(k): el valor de P cuando x vale k',
    paso: 'Término de q: el primero de lo que queda entre el primero de d; luego se resta d por ese término',
    horner: 'Horner: a la izquierda, el primero de d y los demás con el signo cambiado; los productos se suman en diagonal',
  };

  // ---------- Idea 1: algoritmo de la división ----------
  // Propuesta: docs/etapa6/propuesta-algebra.md (§1 a §6, idea 1). Objeto: el pasadizo de (x + 2) dm de ancho que Rubén
  // enchapa con su pedido de x² + 5x + 7 dm² (pieza alg-reparto, 'pasadizo'): el ancho es el divisor, el largo el cociente
  // y lo que sobra el resto.
  // Cambia: el largo del pasadizo (x + k, k de 0 a 4). · Permanece: el pedido y el ancho. · Progresa: lo que sobra, que
  // baja de 3x + 7 a 1. · Se reserva: el grado del cociente cuando D y d tienen otros grados (la predicción: 7 entre 3).
  // · Debe verse: se alarga mientras lo que sobra alcanza para otro tramo; al final sobra algo de grado menor que d.
  // Errores (hipótesis de diseño): TAL-GRADO-SUMA suma los grados · TAL-GRADO-DIVISOR da el grado de d · TAL-RESTO-COC
  // confunde el grado del cociente con el del resto · TAL-GRADO-RESTO cree que r puede tener el grado de d ·
  // TAL-RESTO-CTE cree que el resto siempre es un número · TAL-OLVIDA-RESTO usa D = d · q sin r · TAL-SOLO-Q suma q y r
  // sin multiplicar por d · TAL-SUMA-TODO suma d, q y r · TAL-SIGNO-D toma d(0) con el signo cambiado.
  const PEDIDO = [1, 5, 7];          // x² + 5x + 7: 1 loseta, 5 tiras, 7 cuadraditos
  const pasadizo = (k, extra) => RP(Object.assign({ objeto: 'pasadizo', ancho: [1, 2], largo: [1, k], pedido: PEDIDO, tope: [1, 4] }, extra));
  const largoTxt = k => (k ? `x + ${k}` : 'x');
  // Lo que sobra con el largo x + k: (5 − k − 2)x + (7 − 2k).
  const sobraJ = k => sinCeros([5 - k - 2, 7 - 2 * k]);

  // Ahora tú 1: el grado del cociente.
  function casoGradoQ(r) {
    const gD = r.ent(4, 9), gd = r.ent(1, Math.min(4, gD - 1)), bien = gD - gd;
    if (gD === 7 && gd === 3) return null;   // la predicción de la idea
    return {
      pregunta: ['Se divide un D de grado ', f(gD), ' entre un ', d_, ' de grado ', f(gd), '. ¿Qué grado tiene el cociente ', q_, '?'],
      datos: [DD.ident, DD.grado, DD.prodPot],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'suma', texto: f(gD + gd), error: 'TAL-GRADO-SUMA', siFuera: `Bien que los grados se combinan. Pero ${gD} + ${gd} sería el grado de D · d, no de q.` },
        { id: 'div', texto: f(gd), error: 'TAL-GRADO-DIVISOR', siFuera: `Bien leído el grado de d. Pero q es otro polinomio: d · q debe llegar a grado ${gD}.` },
        { id: 'resto', texto: f(gd - 1), error: 'TAL-RESTO-COC', siFuera: `Bien: ${gd - 1} es el mayor grado que puede tener el resto. El cociente es otro.` },
      ]),
      solucion: { texto: 'd · q tiene el grado de D: los grados de d y q suman el de D.', ecuacion: [`${gd} + grado de `, q_, ` = ${gD}   →   grado de `, q_, ' = ', QC(bien)] },
    };
  }
  // Ahora tú 2: el mayor grado del resto.
  function casoGradoR(r) {
    const gD = r.ent(5, 9), gd = r.ent(2, Math.min(5, gD - 1)), bien = gd - 1;
    return {
      pregunta: ['Se divide un D de grado ', f(gD), ' entre un ', d_, ' de grado ', f(gd), '. ¿Cuál es el mayor grado que puede tener el resto ', r_, '?'],
      datos: [DD.ident, DD.grado],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'igual', texto: f(gd), error: 'TAL-GRADO-RESTO', siFuera: `Bien que el resto se compara con d. Pero con grado ${gd} todavía se podría seguir dividiendo.` },
        { id: 'coc', texto: f(gD - gd), error: 'TAL-RESTO-COC', siFuera: `Bien la resta ${gD} − ${gd}. Pero ese es el grado del cociente, no el del resto.` },
        { id: 'cero', texto: '0', error: 'TAL-RESTO-CTE', siFuera: 'Bien que el resto puede ser un número. Pero solo es seguro si d tiene grado 1.' },
      ]),
      solucion: { texto: 'r tiene grado menor que d: a lo más, uno menos.', ecuacion: ['grado de ', r_, ` ≤ ${gd} − 1 = `, RS(bien)] },
    };
  }
  // Ahora tú 3: la suma de coeficientes del dividendo, sin armarlo.
  function casoSumaCoef(r) {
    let d, q, rr;
    do { d = [1, r.noCero(-4, 4)]; q = [r.noCero(-3, 3), r.ent(-4, 4), r.ent(-5, 5)]; rr = r.noCero(-6, 6); } while (evaluar(d, 1) === 0 || evaluar(q, 1) === 0 || evaluar(q, 1) === 1);
    const d1 = evaluar(d, 1), q1 = evaluar(q, 1), bien = d1 * q1 + rr;
    return {
      pregunta: ['Al dividir D entre ', DV(poli(d)), ', el cociente es ', QC(poli(q)), ' y el resto es ', RS(f(rr)), '. ¿Cuánto suman los coeficientes de D?'],
      datos: [DD.ident, DD.sumaCoef],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'sinr', texto: f(d1 * q1), error: 'TAL-OLVIDA-RESTO', siFuera: `Bien d(1) · q(1) = ${f(d1 * q1)}. Pero falta sumarle el resto, ${f(rr)}.` },
        { id: 'sind', texto: f(q1 + rr), error: 'TAL-SOLO-Q', siFuera: `Bien q(1) y el resto. Pero q va multiplicado por d: falta d(1) = ${f(d1)}.` },
        { id: 'todo', texto: f(d1 + q1 + rr), error: 'TAL-SUMA-TODO', siFuera: `Bien los tres valores. Pero d y q se multiplican, no se suman: ${f(d1)} · ${par(q1)}.` },
      ]),
      solucion: { texto: 'La suma de coeficientes es D(1), y D = d · q + r vale también en x = 1.', ecuacion: ['D(1) = ', DV(f(d1)), ' · ', QC(par(q1)), ' + ', RS(par(rr)), ' = ', f(bien)] },
    };
  }
  // Ahora tú 4 (nivel examen, como San Marcos 2025-I): el término independiente del dividendo sale de D(0).
  function casoIdentidadCero(r) {
    let d, q, rr, D;
    do {
      d = [1, r.ent(-3, 3), r.noCero(-4, 4)]; q = [1, r.noCero(-4, 4), r.noCero(-5, 5)]; rr = [r.noCero(-6, 6), r.noCero(-7, 7)];
      D = sumar(multiplicar(d, q), rr);
    } while (D.some(c => c === 0) || D[4] === rr[1] || D[4] === d[2] * q[2] || Math.abs(D[4]) > 40);
    const bien = D[4], vista = poli(D.slice(0, 4).concat([0])).replace(/x$/, 'x') + ' + n';
    return {
      pregunta: ['Al dividir ', vista, ' entre ', DV(poli(d)), ', el cociente es ', QC(poli(q)), ' y el resto es ', RS(poli(rr)), '. ¿Cuánto vale n?'],
      datos: [DD.ident, DD.indep],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'sinr', texto: f(d[2] * q[2]), error: 'TAL-OLVIDA-RESTO', siFuera: `Bien d(0) · q(0) = ${f(d[2] * q[2])}. Pero falta sumar r(0) = ${f(rr[1])}.` },
        { id: 'suma', texto: f(q[2] + rr[1]), error: 'TAL-SOLO-Q', siFuera: `Bien q(0) y r(0). Pero q(0) se multiplica por d(0) = ${f(d[2])}.` },
        { id: 'signo', texto: f(-d[2] * q[2] + rr[1]), error: 'TAL-SIGNO-D', siFuera: `Bien la cuenta d(0) · q(0) + r(0). Pero d(0) vale ${f(d[2])}, con su signo.` },
      ]),
      solucion: { texto: 'n es D(0), y D(0) = d(0) · q(0) + r(0).', ecuacion: ['n = ', DV(par(d[2])), ' · ', QC(par(q[2])), ' + ', RS(par(rr[1])), ' = ', f(bien)] },
    };
  }

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h). Cuentas rehechas aparte con sympy (scratchpad de la
  // sesión, e6-algebra/scripts/cuentas-ejemplos.py), sin el código de la unidad: (x + 1)(x + 3) + 2 = x² + 4x + 5;
  // (x + 3)(2x + 1) + 5 = 2x² + 7x + 8; 47 = 6 · 7 + 5; (x − 2)(x + 4) + 3 = x² + 2x − 5; x³ + 2x² + 5 = (x² + 1)(x + 2) +
  // 3 − x; 2x² + 7x + 6 = (x + 2)(2x + 3); (x + 1)(x² − 3x + 2) + 4 en x = 1 da 4; (x² + x − 1)(x² − 3x + 9) + 2x + 5 =
  // x⁴ − 2x³ + 5x² + 14x − 4; (x² − 1)(x + 2) + 3x − 1 en x = 2 da 17; 3x² + 8x + 9 = (x + 2)(3x + 2) + 5;
  // (x² + 3)(2x − 1) + 5x + 4 = 2x³ − x² + 11x + 1. Cada distractor de nivel 3 rehace su error. Las letras de las
  // respuestas de nivel 3 van A, B, C, D, E (una vez cada una en la idea). Ninguna figura muestra lo que se pide.
  const EJEMPLOS_ALGORITMO = [
    { nivel: 1, titulo: 'Lo que sobra del pasadizo',
      enunciado: ['Rubén acomoda un pedido de (x² + 4x + 5) dm² en un pasadizo de ', DV('(x + 1) dm'), ' de ancho y ', QC('(x + 3) dm'), ' de largo. ¿Cuántos dm² quedan aparte?'],
      datos: [DD.ident, DD.cubre, DD.mult],
      figura: RP({ objeto: 'pasadizo', ancho: [1, 1], largo: [1, 3], pedido: [1, 4, 5], sobran: false }),
      solucion: [
        { texto: 'El pasadizo cubre ancho por largo. Lo multiplico término a término.', ecuacion: ['(', DV('x + 1'), ')(', QC('x + 3'), ') = x² + 3x + x + 3 = x² + 4x + 3'] },
        { texto: 'Lo que queda aparte es el pedido menos lo que cubre el pasadizo: solo cuadraditos.', ecuacion: ['x² + 4x + 5 − (x² + 4x + 3) = ', RS('2')] },
      ],
      respuesta: [RS('2'), ' dm²'] },
    { nivel: 1, titulo: 'Cociente y resto',
      enunciado: ['Al dividir 2x² + 7x + 8 entre ', DV('x + 3'), ' se cumple 2x² + 7x + 8 = (x + 3)(2x + 1) + 5. ¿Cuál es el cociente y cuál el resto?'],
      datos: [DD.ident],
      solucion: [{ texto: 'Comparo con D = d · q + r: lo que multiplica al divisor x + 3 es el cociente, y lo que se suma al final es el resto.',
        ecuacion: ['2x² + 7x + 8 = (', DV('x + 3'), ')(', QC('2x + 1'), ') + ', RS('5')] }],
      respuesta: [q_, ' = ', QC('2x + 1'), ' y ', r_, ' = ', RS('5')] },
    { nivel: 1, titulo: 'El grado del cociente',
      enunciado: ['Se divide un D de grado 5 entre un ', d_, ' de grado 2. ¿Qué grado tiene el cociente ', q_, '?'],
      datos: [DD.ident, DD.grado, DD.prodPot],
      solucion: [{ texto: 'd · q tiene que llegar al grado 5 de D, y al multiplicar los grados se suman. El resto no sube el grado.', ecuacion: ['2 + grado de ', q_, ' = 5   →   grado de ', q_, ' = ', QC('3')] }],
      respuesta: ['grado de ', q_, ' = ', QC('3')] },
    { nivel: 1, titulo: 'El grado del resto',
      enunciado: ['Se divide un polinomio entre un ', d_, ' de grado 3. ¿Cuál es el mayor grado que puede tener el resto ', r_, '?'],
      datos: [DD.ident, DD.grado],
      solucion: [{ texto: 'El resto tiene grado menor que el divisor. Menor que 3 es, a lo más, 2.', ecuacion: ['grado de ', r_, ' < 3   →   grado de ', r_, ' ≤ ', RS('2')] }],
      respuesta: [RS('2')] },
    { nivel: 1, titulo: 'Primero con números',
      enunciado: ['Escribe la división 47 ÷ 6 en la forma D = d · q + r.'],
      datos: ['D = d · q + r, con r menor que d'],
      solucion: [{ texto: '6 cabe 7 veces en 47, porque 6 · 7 = 42; sobran 47 − 42 = 5, y 5 es menor que 6.', ecuacion: ['47 = ', DV('6'), ' · ', QC('7'), ' + ', RS('5')] }],
      respuesta: ['47 = ', DV('6'), ' · ', QC('7'), ' + ', RS('5')] },
    { nivel: 2, titulo: 'Armar el dividendo',
      enunciado: ['Al dividir D entre ', DV('x − 2'), ', el cociente es ', QC('x + 4'), ' y el resto es ', RS('3'), '. ¿Cuál es el dividendo D?'],
      datos: [DD.ident, DD.mult],
      solucion: [
        { texto: 'Multiplico el divisor por el cociente, término a término.', ecuacion: ['(', DV('x − 2'), ')(', QC('x + 4'), ') = x² + 4x − 2x − 8 = x² + 2x − 8'] },
        { texto: 'Le sumo el resto y junto los números.', ecuacion: ['D = x² + 2x − 8 + ', RS('3'), ' = x² + 2x − 5'] },
      ],
      respuesta: ['D = x² + 2x − 5'] },
    { nivel: 2, titulo: '¿Ya terminó la división?',
      enunciado: ['Al dividir x³ + 2x² + 5 entre ', DV('x² + 1'), ', Ana llega a x³ + 2x² + 5 = (x² + 1) · x + 2x² − x + 5. ¿Terminó? Si no, halla el cociente y el resto.'],
      datos: [DD.ident, DD.mult],
      solucion: [
        { texto: 'Lo que queda, 2x² − x + 5, tiene grado 2: igual al de x² + 1. Todavía cabe otra vez el divisor: no terminó.' },
        { texto: '2x² entre x² da 2. Resto 2 veces el divisor de lo que quedaba.', ecuacion: ['2x² − x + 5 − 2(', DV('x² + 1'), ') = −x + 3'] },
        { texto: 'Ahora queda grado 1, menor que 2. El cociente juntó x y 2.', ecuacion: ['x³ + 2x² + 5 = (', DV('x² + 1'), ')(', QC('x + 2'), ') + (', RS('−x + 3'), ')'] },
      ],
      respuesta: ['No: ', q_, ' = ', QC('x + 2'), ' y ', r_, ' = ', RS('−x + 3')] },
    { nivel: 2, titulo: 'El largo sin sobrante',
      enunciado: ['Rubén acomoda (2x² + 7x + 6) dm² de piezas en un pasadizo de ', DV('(x + 2) dm'), ' de ancho, sin huecos, y no le queda nada aparte. ¿Cuánto mide el largo?'],
      datos: [DD.ident, DD.cubre, DD.mult],
      figura: RP({ objeto: 'pasadizo', ancho: [1, 2], largo: [2, 3], piezas: false, rotuloLargo: '?', sobran: false }),
      solucion: [
        { texto: 'Hay 2 losetas, y cada loseta del ancho x pide x de largo: el largo empieza con 2x. Lo escribo 2x + m, con m por hallar.', ecuacion: ['(', DV('x + 2'), ')(', QC('2x + m'), ') = 2x² + (m + 4)x + 2m'] },
        { texto: 'Igualo con el pedido: m + 4 = 7 da m = 3, y entonces 2m = 6, justo los cuadraditos. No sobra nada.', ecuacion: ['2x² + 7x + 6 = (', DV('x + 2'), ')(', QC('2x + 3'), ')'] },
      ],
      respuesta: [QC('(2x + 3) dm')] },
    { nivel: 2, titulo: 'Suma de coeficientes',
      enunciado: ['Al dividir D entre ', DV('x + 1'), ', el cociente es ', QC('x² − 3x + 2'), ' y el resto es ', RS('4'), '. ¿Cuánto suman los coeficientes de D?'],
      datos: [DD.ident, DD.sumaCoef],
      solucion: [
        { texto: 'La suma de coeficientes es D(1). Evalúo cada parte de D = d · q + r en x = 1.', ecuacion: ['d(1) = 1 + 1 = 2,   q(1) = 1 − 3 + 2 = 0'] },
        { texto: 'El cociente vale 0 en x = 1, así que solo queda el resto.', ecuacion: ['D(1) = ', DV('2'), ' · ', QC('0'), ' + ', RS('4'), ' = 4'] },
      ],
      respuesta: ['4'] },
    { nivel: 2, titulo: 'De qué grado es el divisor',
      enunciado: ['Un D de grado 6 dividido entre un divisor ', d_, ' da un cociente ', q_, ' de grado 4. ¿Qué grado tiene d y cuál es el mayor grado posible del resto?'],
      datos: [DD.ident, DD.grado, DD.prodPot],
      solucion: [
        { texto: 'Los grados de d y q suman el de D.', ecuacion: ['grado de ', d_, ' + 4 = 6   →   grado de ', d_, ' = 2'] },
        { texto: 'El resto tiene grado menor que d: a lo más, 1.', ecuacion: ['grado de ', r_, ' ≤ 2 − 1 = ', RS('1')] },
      ],
      respuesta: ['grado de ', d_, ' = 2; grado de ', r_, ' a lo más ', RS('1')] },
    { nivel: 3, titulo: 'Un coeficiente que falta',
      enunciado: ['Al dividir x⁴ − 2x³ + 5x² + 14x + n entre ', DV('x² + x − 1'), ', el cociente es ', QC('x² − 3x + 9'), ' y el resto es ', RS('2x + 5'), '. ¿Cuánto vale n?'],
      alternativas: ['−4', '14', '−9', '5', '9'],
      datos: [DD.ident, DD.indep],
      solucion: [
        { texto: 'n es el término independiente de D, que es D(0). Evalúo D = d · q + r en x = 0: cada polinomio deja su término sin x.', ecuacion: ['d(0) = −1,   q(0) = 9,   r(0) = 5'] },
        { texto: 'Multiplico y sumo.', ecuacion: ['n = ', DV('(−1)'), ' · ', QC('9'), ' + ', RS('5'), ' = ', '−4'] },
        { texto: ['La ', letra('B'), ' suma q(0) y r(0) sin multiplicar por d(0): 9 + 5 = 14. La ', letra('C'), ' olvida el resto: (−1) · 9 = −9.'] },
        { texto: ['La ', letra('D'), ' se queda con el resto: 5. La ', letra('E'), ' se queda con el término independiente del cociente: 9.'] },
      ],
      respuesta: [letra('A'), ', n = −4'] },
    { nivel: 3, titulo: 'Grados con una letra',
      enunciado: ['Un polinomio de grado 10 se divide entre otro de grado n, y el cociente sale de grado 7. ¿Cuál es el mayor grado que puede tener el resto?'],
      alternativas: ['3', '2', '7', '17', '0'],
      datos: [DD.ident, DD.grado, DD.prodPot],
      solucion: [
        { texto: 'Los grados del divisor y del cociente suman el del dividendo.', ecuacion: ['n + 7 = 10   →   n = 3'] },
        { texto: 'El resto tiene grado menor que el divisor: menor que 3.', ecuacion: ['grado de ', r_, ' ≤ 3 − 1 = ', RS('2')] },
        { texto: ['La ', letra('A'), ' da el grado del divisor, 3: con ese grado se podría seguir dividiendo. La ', letra('C'), ' da el grado del cociente.'] },
        { texto: ['La ', letra('D'), ' suma 10 + 7 = 17. La ', letra('E'), ' cree que el resto siempre es un número; eso pasa solo si el divisor es de grado 1.'] },
      ],
      respuesta: [letra('B'), ', ', RS('2')] },
    { nivel: 3, titulo: 'Evaluar sin dividir',
      enunciado: ['Al dividir P(x) entre ', DV('x² − 1'), ', el cociente es ', QC('x + 2'), ' y el resto es ', RS('3x − 1'), '. ¿Cuánto vale P(2)?'],
      alternativas: ['12', '5', '17', '25', '11'],
      datos: [DD.ident, DD.evaluar],
      solucion: [
        { texto: 'P = d · q + r vale para todo x. Evalúo cada parte en x = 2.', ecuacion: ['d(2) = 4 − 1 = 3,   q(2) = 4,   r(2) = 6 − 1 = 5'] },
        { texto: 'Multiplico y sumo.', ecuacion: ['P(2) = ', DV('3'), ' · ', QC('4'), ' + ', RS('5'), ' = 17'] },
        { texto: ['La ', letra('A'), ' olvida el resto: 3 · 4 = 12. La ', letra('B'), ' se queda con el resto: 5. La ', letra('E'), ' evalúa el resto en 0: 12 − 1 = 11.'] },
        { texto: ['La ', letra('D'), ' lee el divisor como x² + 1: 5 · 4 + 5 = 25.'] },
      ],
      respuesta: [letra('C'), ', P(2) = 17'] },
    { nivel: 3, titulo: 'El pasadizo más largo',
      enunciado: ['Rubén tiene (3x² + 8x + 9) dm² de piezas y un pasadizo de ', DV('(x + 2) dm'), ' de ancho. Lo arma lo más largo que puede sin dejar huecos. ¿Cuántos dm² quedan aparte?'],
      alternativas: ['9', '1', '4', '5', '3'],
      datos: [DD.ident, DD.cubre, DD.mult],
      figura: RP({ objeto: 'pasadizo', ancho: [1, 2], largo: [3, 2], piezas: false, rotuloLargo: '?', sobran: false }),
      solucion: [
        { texto: 'Las 3 losetas dan un largo que empieza en 3x. Con un largo 3x + m, el pasadizo pide (6 + m) tiras y 2m cuadraditos.', ecuacion: ['(', DV('x + 2'), ')(', QC('3x + m'), ') = 3x² + (6 + m)x + 2m'] },
        { texto: 'Hay 8 tiras: 6 + m = 8 da m = 2. El pasadizo usa 2 · 2 = 4 cuadraditos y sobran 9 − 4.', ecuacion: ['3x² + 8x + 9 = (', DV('x + 2'), ')(', QC('3x + 2'), ') + ', RS('5')] },
        { texto: ['La ', letra('A'), ' cree que sobran todos los cuadraditos: 9. La ', letra('C'), ' da los que usa el pasadizo: 4. La ', letra('E'), ' cuenta las losetas: 3.'] },
        { texto: ['La ', letra('B'), ' alarga hasta 3x + 4: usaría 8 cuadraditos y dejaría 1, pero quedarían huecos de 2 tiras.'] },
      ],
      respuesta: [letra('D'), ', ', RS('5'), ' dm²'] },
    { nivel: 3, titulo: 'Un término del dividendo',
      enunciado: ['Al dividir D entre ', DV('x² + 3'), ', el cociente es ', QC('2x − 1'), ' y el resto es ', RS('5x + 4'), '. ¿Cuál es el coeficiente de x en D?'],
      alternativas: ['6', '5', '1', '−1', '11'],
      datos: [DD.ident, DD.mult],
      solucion: [
        { texto: 'Multiplico el divisor por el cociente.', ecuacion: ['(', DV('x² + 3'), ')(', QC('2x − 1'), ') = 2x³ − x² + 6x − 3'] },
        { texto: 'Le sumo el resto y junto los términos con x.', ecuacion: ['D = 2x³ − x² + 6x − 3 + ', RS('5x + 4'), ' = 2x³ − x² + 11x + 1'] },
        { texto: ['La ', letra('A'), ' olvida el resto: 6. La ', letra('B'), ' toma solo el resto: 5. La ', letra('C'), ' da el término independiente: −3 + 4 = 1.'] },
        { texto: ['La ', letra('D'), ' da el coeficiente de x²: −1.'] },
      ],
      respuesta: [letra('E'), ', 11'] },
  ];

  const algoritmo = {
    id: 'algoritmo',
    titulo: 'Algoritmo de la división',
    pregunta: '¿Qué buscas cuando divides un polinomio entre otro?',
    temas: ['Algoritmo de la división'],
    pieza: 'alg-reparto',
    aprendizaje: 'Dividir es hallar el cociente y el resto que reconstruyen el dividendo; el resto tiene grado menor que el divisor.',
    actividad: 'Acomodar un pedido de losetas en un pasadizo y ver qué sobra.',
    // Lee: el pedido, la división con números (Las cuatro operaciones), los cuatro nombres y qué mirar. No dice nada del
    // grado del cociente (es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El pasadizo de Rubén', texto: 'El maestro Rubén tiene un pedido de 1 loseta, 5 tiras y 7 cuadraditos: cubre (x² + 5x + 7) dm². Quiere enchapar con él un pasadizo de (x + 2) dm de ancho.',
          pieza: 'alg-losetas', dibujo: LO({ objeto: 'pedido', filas: [{ nombre: 'Pedido', cuenta: PEDIDO }] }) },
        { titulo: 'Como al dividir números', texto: ['En «Las cuatro operaciones», 17 ÷ 5 da cociente 3 y resto 2, porque 5 · 3 = 15 y sobran 2. El resto es menor que 5: si no, alcanzaría para uno más.'],
          ecuacion: ['17 = ', DV('5'), ' · ', QC('3'), ' + ', RS('2')] },
        { titulo: 'Los cuatro nombres', texto: ['El pedido entero es el dividendo, D. El ancho del pasadizo es el divisor, ', d_, '. El largo es el cociente, ', q_, ', y lo que sobra es el resto, ', r_, '.'],
          pieza: 'alg-reparto', dibujo: pasadizo(1) },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a alargar el pasadizo de tramo en tramo. Mira qué piezas quedan aparte y cuándo ya no alcanzan para otro tramo sin dejar huecos.' },
      ],
    },
    ejemplos: EJEMPLOS_ALGORITMO,
    juega: {
      pieza: 'alg-reparto',
      consigna: 'Rubén acomoda su pedido de (x² + 5x + 7) dm² en un pasadizo de (x + 2) dm de ancho.',
      mision: {
        texto: 'Arma el pasadizo más largo que puedas sin dejar huecos; lo que no entre queda aparte.',
        logrado: v => v.k === 3,
        bien: 'Listo: queda aparte 1 cuadradito, y un cuadradito no alcanza para otro tramo de x + 2.',
      },
      voz: 'Agrega un tramo y mira qué le pasa a lo que sobra.',
      leyenda: [
        { s: 'x', t: 'lado de la loseta, en dm' },
        { s: DV('(x + 2) dm'), t: 'ancho del pasadizo: el divisor' },
        { s: QC('(x + 1) dm'), t: 'largo del pasadizo: el cociente' },
        { s: RS('Sobran'), t: 'piezas que quedan aparte: el resto' },
        { s: 'Faltan', t: 'huecos: piezas que el pedido no tiene' },
      ],
      controles: [{ id: 'k', etiqueta: 'Tramos de 1 dm en el largo', color: 'c-f', min: 0, max: 4, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: v => pasadizo(v.k),
      // La relación: ancho por largo, más lo que sobra, es el pedido.
      lectura: v => (v.k <= 3
        ? ['(', DV('x + 2'), ') · ', QC(conPar(largoTxt(v.k))), ' + ', RS(conPar(poli(sobraJ(v.k)))), ' = x² + 5x + 7']
        : ['(', DV('x + 2'), ') · ', QC(conPar(largoTxt(v.k))), ' = x² + 6x + 8: quedan huecos']),
      minimo: 3,
    },
    predice: {
      pregunta: ['Se divide un dividendo D de grado 7 entre un divisor ', d_, ' de grado 3. ¿Qué grado tiene el cociente ', q_, '?'],
      datos: [DD.grado, DD.prodPot],
      voz: 'Piensa qué grado debe tener d · q.',
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'suma', texto: '10', error: 'TAL-GRADO-SUMA', siFuera: 'Bien que los grados se combinan. Pero 10 sería el grado de D · d; aquí d · q da grado 7.' },
        { id: 'divisor', texto: '3', error: 'TAL-GRADO-DIVISOR', siFuera: 'Bien leído el grado de d. Pero q es otro polinomio: d · q debe llegar a grado 7.' },
        { id: 'resto', texto: '2', error: 'TAL-RESTO-COC', siFuera: 'Bien que algo queda por debajo de 3: es el resto, que llega a grado 2.' },
      ],
      dibujo: TB({ columnas: ['D', 'd', 'q'], colorCol: [null, 'i', 'f'], rotulosFila: ['grado'], filas: [['7', '3', { t: '?', hueco: true }]], alt: 'Grados: D de grado 7, d de grado 3 y q por hallar' }),
      revelar: TB({ columnas: ['D', 'd', 'q'], colorCol: [null, 'i', 'f'], rotulosFila: ['grado'], filas: [['7', '3', { t: '4', color: 'f', fuerte: true }]], alt: 'Grados: D de grado 7, d de grado 3 y q de grado 4' }),
      coincide: 'Coincide: d · q llega al grado 7 con 3 + 4, y el resto queda con grado menor que 3.',
      noCoincide: 'Revisemos: d · q tiene que llegar al grado 7 de D, y al multiplicar los grados se suman.',
    },
    mira: {
      pieza: 'alg-reparto',
      datos: { objeto: 'pasadizo', ancho: [1, 2], pedido: PEDIDO, tope: [1, 4], pasos: [{ largo: [1, 0] }, { largo: [1, 1] }, { largo: [1, 3] }, { largo: [1, 3] }, { largo: [1, 3] }] },
      voz: 'Alarguemos tramo por tramo y miremos lo que sobra.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Con un largo de x dm entran la loseta y 2 tiras.', ecuacion: ['(', DV('x + 2'), ') · ', QC('x'), ' = x² + 2x'] },
        { estado: { paso: 1 }, texto: 'Cada tramo de 1 dm más pide 1 tira y 2 cuadraditos.', ecuacion: ['(', DV('x + 2'), ') · 1 = x + 2'] },
        { estado: { paso: 2 }, texto: 'Con 3 tramos sobra 1 cuadradito: ya no alcanza para otro.', ecuacion: ['x² + 5x + 7 = (', DV('x + 2'), ')(', QC('x + 3'), ') + ', RS('1')] },
        { estado: { paso: 3 }, texto: 'Lo que sobra tiene grado 0, menor que el grado 1 de d.', ecuacion: ['grado de ', r_, ' = 0,   grado de ', d_, ' = 1'] },
        { estado: { paso: 4 }, texto: 'El grado del cociente es el de D menos el de d.', ecuacion: ['grado de ', q_, ' = 2 − 1 = 1'] },
      ],
    },
    regla: {
      texto: 'Dividir D entre d es hallar el cociente q y el resto r que reconstruyen D. El resto tiene grado menor que d: a lo más, uno menos.',
      ecuacion: ['D = ', { llave: [d_, ' · ', q_], nota: 'divisor por cociente' }, ' + ', { llave: [r_], nota: 'grado menor que d', color: 'c-o' }, SEP,
        'grado de ', q_, ' = grado de D − grado de ', d_],
      condicion: 'el divisor d no es el polinomio 0.',
      voz: 'Se divide mientras lo que queda alcance para otra vez el divisor.',
      dibujo: pasadizo(3),
    },
    // Así se resuelve: armar D a partir de d, q y r. «Ahora tú» pide otra cosa: grados, suma de coeficientes y la
    // identidad evaluada en 0.
    resuelve: {
      pieza: 'alg-reparto',
      generar(s) {
        const r = azar(s + 900);
        const d = [1, r.noCero(-4, 4)], q = [r.ent(1, 3), r.noCero(-4, 4), r.ent(-5, 5)], rr = r.noCero(-6, 6);
        const dq = multiplicar(d, q), D = sumar(dq, [rr]);
        return {
          enunciado: ['Al dividir D entre ', DV(poli(d)), ', el cociente es ', QC(poli(q)), ' y el resto es ', RS(f(rr)), '. ¿Cuál es el dividendo D?'],
          datos: [DD.ident, DD.mult],
          pasos: [
            { tipo: 'pide', texto: 'Piden el dividendo D: el polinomio que, dividido entre d, da ese cociente y ese resto.' },
            { tipo: 'datos', texto: ['El divisor es ', DV(poli(d)), ', el cociente ', QC(poli(q)), ' y el resto ', RS(f(rr)), '.'] },
            { tipo: 'regla', texto: 'El dividendo se reconstruye: divisor por cociente, más el resto.', ecuacion: ['D = ', d_, ' · ', q_, ' + ', r_] },
            { tipo: 'cuentas', texto: 'Multiplico cada término del divisor por cada término del cociente y junto los semejantes.',
              ecuacion: ['(', DV(poli(d)), ')(', QC(poli(q)), ') = ', poli(dq)] },
            { tipo: 'cuentas', texto: 'Le sumo el resto al término independiente.', ecuacion: dq[dq.length - 1] === 0 ? ['D = ', poli(dq), ' ', RS(rr < 0 ? `− ${f(-rr)}` : `+ ${f(rr)}`)]
              : ['D = ', poli(dq), ' ', RS(rr < 0 ? `− ${f(-rr)}` : `+ ${f(rr)}`), ' = ', poli(D)] },
            { tipo: 'sentido', texto: `Reviso el grado: 1 + 2 = 3, el grado de D. El resto, un número, tiene grado 0, menor que el 1 del divisor.` },
          ],
          respuesta: ['D = ', poli(D)],
        };
      },
    },
    ahoraTu: {
      voz: 'Primero piensa qué parte de D = d · q + r te dan.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoGradoQ, r);
        if (tipo === 1) return conCuatro(casoGradoR, r);
        if (tipo === 2) return conCuatro(casoSumaCoef, r);
        return conCuatro(casoIdentidadCero, r);
      },
    },
  };

  // ---------- Ayudantes del cuaderno (pieza alg-reparto, 'cuaderno') ----------
  const POTX = e => (e === 0 ? 'x⁰' : e === 1 ? 'x' : `x${sup(e)}`);
  // Un término c·xᵉ con su signo: 3x², −x, 2.
  const termino = (c, e) => `${c < 0 ? '−' : ''}${Math.abs(c) === 1 && e ? '' : f(Math.abs(c))}${pot('x', e)}`;
  const celD = c => (c === 0 ? { t: '0', c: 'f' } : f(c));   // un coeficiente del dividendo; el 0 que se olvida, en violeta
  // La división por columnas: la fila de D, y por cada término del cociente, «término · d» y lo que queda.
  function larga(D, d, { cabeza, hasta = 99 } = {}) {
    const n = D.length, filas = [{ rotulo: 'D', celdas: D.map(celD) }], cur = D.slice(), q = [];
    for (let k = 0; k + d.length <= n && k < hasta; k++) {
      const c = cur[k] / d[0]; q.push(c);
      const prod = Array(n).fill(''); d.forEach((u, i) => { prod[k + i] = f(c * u); });
      filas.push({ rotulo: [[termino(c, n - d.length - k), 'f', 700], [' · d', null, 400]], celdas: prod });
      d.forEach((u, i) => { cur[k + i] -= c * u; });
      const ultimo = k + d.length === n;
      filas.push({ rotulo: 'queda', raya: true, celdas: cur.map((v, j) => (j <= k ? '' : { t: f(v), c: ultimo && j > n - d.length ? 'o' : null })) });
    }
    return { objeto: 'cuaderno', tipo: 'larga', potencias: D.map((_, i) => POTX(n - 1 - i)), filas, cabeza };
  }
  // El esquema de Horner: el primero de d arriba a la izquierda y los demás con el signo cambiado; una fila de productos
  // por cada término del cociente; abajo, q (violeta) y r (naranja).
  function horner(D, d, { cabeza, hasta = 99 } = {}) {
    const n = D.length, m = d.length - 1, nq = n - m, acc = D.slice(), q = [], filas = [];
    for (let k = 0; k < nq; k++) {
      const c = acc[k] / d[0]; q.push(c);
      const fila = Array(n).fill('');
      if (k < hasta) for (let i = 1; i <= m; i++) { const v = c * -d[i]; fila[k + i] = f(v); acc[k + i] += v; }
      else for (let i = 1; i <= m; i++) acc[k + i] += c * -d[i];
      filas.push(fila);
    }
    const r = acc.slice(nq);
    const abajo = [...q.map((v, k) => (k < hasta ? { t: f(v), c: 'f' } : '')), ...r.map(v => (hasta >= nq ? { t: f(v), c: 'o' } : ''))];
    return { objeto: 'cuaderno', tipo: 'horner', coefs: D.map(celD), divisor: [{ t: f(d[0]), c: 'i' }, ...d.slice(1).map(v => ({ t: f(-v), c: 'i' }))], filas, abajo, corte: nq, cabeza };
  }
  // La tabla de Ruffini de D entre x − a: hasta (cuántas casillas de abajo se ven), oculta (la que va con «?»).
  function rufTabla(D, a, { hasta = 99, oculta = null, flechas = true, cabeza, pie, aTexto } = {}) {
    const b = ruffini(D, a), n = D.length;
    return {
      objeto: 'cuaderno', tipo: 'ruffini', coefs: D.map(celD), a: { t: aTexto || f(a), c: 'i' },
      medio: b.slice(0, -1).map((v, k) => (k + 1 < hasta || k + 1 === oculta ? (k + 1 === oculta ? '' : f(v * a)) : '')),
      abajo: b.map((v, k) => (k === oculta ? { hueco: true } : k < hasta ? { t: f(v), c: k === n - 1 ? 'o' : 'f' } : '')),
      flechas, cabeza, pie,
    };
  }
  const CU = datos => RP(datos);
  const lineaD = (D, d) => [[`${poli(D)} entre `, null, 400], [poli(d), 'i', 700]];

  // ---------- Idea 2 (nueva, 19 nov): división clásica y Horner ----------
  // Objeto: la hoja del cuaderno de Rubén con la división por columnas, como la del colegio (alg-reparto, 'cuaderno').
  // Cambia: los dos coeficientes del cociente q = px + s que elige el alumno. · Permanece: D = x³ + 4x² + x − 2 y
  // d = x² + x − 1. · Progresa: lo que queda, D − d · q. · Se reserva: un divisor cuyo primer coeficiente no es 1 (la
  // predicción: 6x⁴ entre 2x²). · Debe verse: cada término de q borra la columna más alta de lo que queda; se para
  // cuando lo que queda tiene grado menor que d.
  // Errores (hipótesis de diseño): TAL-COEF-PRINC no divide entre el primer coeficiente de d · TAL-EXP-SUMA suma los
  // exponentes al dividir · TAL-COEF-RESTA resta los coeficientes · TAL-HORNER-SUMA suma en vez de restar al bajar ·
  // TAL-COPIA-D copia el coeficiente de D · TAL-RESTA-AL-REVES resta d · q menos D · TAL-UNA-RESTA olvida restar en
  // una columna · AL16 despeja con el signo cambiado · TAL-SOLO-UNO da solo uno de los dos números · TAL-PIDE da el
  // producto y no la suma.
  const DJ2 = [1, 4, 1, -2], dJ2 = [1, 1, -1];
  const quedaJ2 = (p, s) => sumar(DJ2, multiplicar(dJ2, [p, s]).map(v => -v));
  const gradoDe = cs => { const t = sinCeros(cs); return t.length === 1 && t[0] === 0 ? 0 : t.length - 1; };
  function cuadernoJ2(p, s) {
    const dq = multiplicar(dJ2, [p, s]), qd = quedaJ2(p, s), g = gradoDe(qd), fin = g < 2;
    return CU({ objeto: 'cuaderno', tipo: 'larga', potencias: ['x³', 'x²', 'x', 'x⁰'],
      cabeza: [[['d = ', null, 400], ['x² + x − 1', 'i', 700], ['     q = ', null, 400], [poli(sinCeros([p, s])), 'f', 700]]],
      filas: [{ rotulo: 'D', celdas: DJ2.map(f) }, { rotulo: [['d · ', null, 400], ['q', 'f', 700]], celdas: dq.map(f) },
        { rotulo: 'queda', raya: true, celdas: qd.map((v, j) => ({ t: f(v), c: fin && j >= 2 ? 'o' : null })) }] });
  }
  // Ahora tú 1: el primer término del cociente, con un divisor que no empieza con 1.
  function casoPrimerTermino(r) {
    const c = r.uno([2, 3, 4]), m = r.ent(2, 3), e = r.ent(m + 1, m + 3), k = r.noCero(-4, 5), A = c * k;
    const dc = Array(m + 1).fill(0); dc[0] = c; dc[m - 1] = r.noCero(-5, 5); dc[m] = r.noCero(-6, 6);
    const Dc = Array(e + 1).fill(0); Dc[0] = A; Dc[e - 2] = r.noCero(-7, 7); Dc[e] = r.noCero(-5, 5);
    const dTxt = poli(dc), D1 = termino(A, e);
    return {
      pregunta: ['Se divide ', poli(Dc), ' entre ', DV(dTxt), '. ¿Cuál es el primer término del cociente?'],
      datos: ['El primer término de q: el primer término de D dividido entre el primero de d', 'xᵐ ÷ xⁿ = xᵐ⁻ⁿ'],
      opciones: ops([
        { id: 'c', texto: termino(k, e - m), correcta: true },
        { id: 'sinc', texto: termino(A, e - m), error: 'TAL-COEF-PRINC', siFuera: `Bien el exponente, ${e} − ${m}. Pero el ${f(A)} también se divide entre el ${c} de d.` },
        { id: 'exp', texto: termino(k, e + m), error: 'TAL-EXP-SUMA', siFuera: `Bien ${f(A)} ÷ ${c}. Pero al dividir potencias los exponentes se restan: ${e} − ${m}.` },
        { id: 'resta', texto: A - c === 0 ? null : termino(A - c, e - m), error: 'TAL-COEF-RESTA', siFuera: `Bien el exponente. Pero los coeficientes se dividen: ${f(A)} ÷ ${c}, no ${f(A)} − ${c}.` },
      ]),
      solucion: { texto: 'Se divide el primer término de D entre el primero de d.', ecuacion: [D1, ' ÷ ', DV(`${c}x${sup(m)}`), ' = ', QC(termino(k, e - m))] },
    };
  }
  // Ahora tú 2: un coeficiente del cociente (el de x) en una división entre un divisor de grado 2 que empieza con 1.
  function casoCoefQ(r) {
    let d, q, rr, D;
    do { d = [1, r.noCero(-3, 3), r.noCero(-4, 4)]; q = [r.ent(1, 3), r.noCero(-4, 4), r.ent(-4, 4)]; rr = [r.noCero(-5, 5), r.ent(-6, 6)]; D = sumar(multiplicar(d, q), rr); } while (D[1] === q[1] || D[1] + q[0] * d[1] === q[1]);
    return {
      pregunta: ['Al dividir ', poli(D), ' entre ', DV(poli(d)), ', ¿cuál es el coeficiente de x en el cociente?'],
      datos: [DD.ident, DD.paso],
      opciones: ops([
        { id: 'c', texto: f(q[1]), correcta: true },
        { id: 'suma', texto: f(D[1] + q[0] * d[1]), error: 'TAL-HORNER-SUMA', siFuera: `Bien el primer término, ${termino(q[0], 2)}. Pero al bajar se resta: ${f(D[1])} − ${par(q[0] * d[1])}.` },
        { id: 'copia', texto: f(D[1]), error: 'TAL-COPIA-D', siFuera: `Bien la columna de x³. Pero antes de dividir hay que restarle ${termino(q[0], 2)} · d.` },
        { id: 'prim', texto: f(q[0]), error: 'TAL-PIDE', siFuera: `Bien: ${f(q[0])} es el coeficiente de x², el primero de q. Piden el de x.` },
      ]),
      solucion: { texto: 'Tras restar el primer término por d, la columna de x³ da el coeficiente de x.', ecuacion: [`${f(D[1])} − ${par(q[0] * d[1])} = `, QC(f(q[1]))] },
    };
  }
  // Ahora tú 3: el resto entre un divisor de grado 2.
  function casoRestoCuad(r) {
    let d, q, rr, D;
    do { d = [1, r.noCero(-3, 3), r.noCero(-3, 3)]; q = [1, r.noCero(-3, 3)]; rr = [r.noCero(-5, 5), r.noCero(-6, 6)]; D = sumar(multiplicar(d, q), rr); } while (D.some(v => v === 0));
    // Error de una resta: en la primera vuelta se suma x · d en vez de restarlo.
    const mal = (() => { const cur = D.slice(); d.forEach((u, i) => { cur[i] += u; }); const c2 = cur[1] / d[0]; d.forEach((u, i) => { cur[1 + i] -= c2 * u; }); return cur.slice(2); })();
    const D0 = D.slice(2); D0[1] = D[3];
    return {
      pregunta: ['¿Cuál es el resto de dividir ', poli(D), ' entre ', DV(poli(d)), '?'],
      datos: [DD.ident, DD.paso],
      opciones: ops([
        { id: 'c', texto: poli(rr), correcta: true },
        { id: 'reves', texto: poli(rr.map(v => -v)), error: 'TAL-RESTA-AL-REVES', siFuera: 'Bien las columnas. Pero lo que queda es D − d · q, no d · q − D.' },
        { id: 'suma', texto: poli(sinCeros(mal)) === poli(rr) ? null : poli(sinCeros(mal)), error: 'TAL-HORNER-SUMA', siFuera: 'Bien el primer término de q. Pero en la primera vuelta se suma x · d en vez de restarlo.' },
        { id: 'ultima', texto: poli([rr[0], D[3]]) === poli(rr) ? null : poli([rr[0], D[3]]), error: 'TAL-UNA-RESTA', siFuera: `Bien la columna de x. Pero la última también se resta: queda ${f(rr[1])}, no ${f(D[3])}.` },
      ]),
      solucion: { texto: 'Se divide hasta que lo que queda tiene grado 1.', ecuacion: [poli(D), ' = (', DV(poli(d)), ')(', QC(poli(q)), ') + (', RS(poli(rr)), ')'] },
    };
  }
  // Ahora tú 4 (nivel examen): m y n para que la división entre un divisor de grado 2 sea exacta.
  function casoExactaMN(r) {
    let d, q, base, rho;
    do {
      d = [1, r.noCero(-2, 2), r.noCero(-3, 3)]; q = [1, r.ent(-3, 3), r.ent(-3, 3)];
      base = multiplicar(d, q).slice(0, 3);      // x⁴, x³ y x² de D: lo demás lo ponen m y n
      rho = dividir(base.concat([0, 0]), d).r;   // resto de x⁴ + … + βx² entre d
      if (rho.length < 2) rho = [0, ...rho];
    } while (rho[0] === 0 || rho[1] === 0 || rho[0] === rho[1] || rho[0] === -rho[1]);
    const m = -rho[0], n = -rho[1];
    const vista = `${poli(base.concat([0, 0]))} + mx + n`;
    return {
      pregunta: ['¿Para qué valores de m y n la división de ', vista, ' entre ', DV(poli(d)), ' es exacta? Da m + n.'],
      datos: [DD.ident, 'División exacta: el resto es 0', DD.paso],
      opciones: ops([
        { id: 'c', texto: f(m + n), correcta: true },
        { id: 'signo', texto: f(-(m + n)), error: 'AL16', siFuera: `Bien el resto (${f(rho[0])} + m)x + (${f(rho[1])} + n). Pero al igualarlo a 0, m y n cambian de signo.` },
        { id: 'uno', texto: f(m), error: 'TAL-SOLO-UNO', siFuera: `Bien m = ${f(m)}. Pero piden m + n: falta n = ${f(n)}.` },
        { id: 'prod', texto: m * n === m + n ? null : f(m * n), error: 'TAL-PIDE', siFuera: `Bien m = ${f(m)} y n = ${f(n)}. Pero piden la suma, no el producto.` },
      ]),
      solucion: { texto: 'Sin m ni n queda un resto; m y n deben volverlo 0.', ecuacion: ['(', f(rho[0]), ' + m)x + (', f(rho[1]), ' + n) = 0   →   m + n = ', f(m + n)] },
    };
  }

  // Ejemplos de la idea 2. Cuentas rehechas aparte con sympy (e6-algebra/scripts/cuentas-ejemplos.py): 8x⁵ ÷ 2x² = 4x³;
  // x⁴ − 3x + 2 → 1, 0, 0, −3, 2; x³ + 4x² + x − 3 − x(x² + 2x) = 2x² + x − 3; (6x³ + 4x²) ÷ 2x = 3x² + 2x;
  // x³ + 3x² + 5x + 4 = (x² + x + 1)(x + 2) + 2x + 2; 4x³ + 2x² − 1 = (2x² − 1)(2x + 1) + 2x; x⁴ + 2x³ − x² + 3x − 2 =
  // (x² + x − 1)(x² + x − 1) + 5x − 3; 2x⁴ + 3x² − x + 5 = (x² − x + 2)(2x² + 2x + 1) − 4x + 3; x⁴ + 2x³ + mx + n con
  // x² + x − 1: resto (m − 1)x + (n + 0)…; 3x⁴ + 5x³ − x² + 2x + 1 = (3x² − x + 1)(x² + 2x) + 1; 2x⁵ − x³ + 3x − 4 con
  // x² − 2: resto 9x − 4; x⁴ − x³ + 2x² + 5 = (x² + 2x − 1)(x² − 3x + 9) − 21x + 14.
  const EJEMPLOS_HORNER = [
    { nivel: 1, titulo: 'Dividir dos términos',
      enunciado: '¿Cuánto es 8x⁵ entre 2x²?',
      datos: ['xᵐ ÷ xⁿ = xᵐ⁻ⁿ'],
      solucion: [{ texto: 'Se dividen los coeficientes y se restan los exponentes.', ecuacion: ['8x⁵ ÷ ', DV('2x²'), ' = (8 ÷ 2)x⁵⁻² = ', QC('4x³')] }],
      respuesta: [QC('4x³')] },
    { nivel: 1, titulo: 'Escribir todas las columnas',
      enunciado: 'Para dividir x⁴ − 3x + 2 por columnas, ¿qué coeficientes se escriben, de x⁴ a x⁰?',
      datos: ['Una potencia que falta se escribe con coeficiente 0'],
      figura: CU({ objeto: 'cuaderno', tipo: 'larga', potencias: ['x⁴', 'x³', 'x²', 'x', 'x⁰'], filas: [{ rotulo: 'D', celdas: [{ hueco: true }, { hueco: true }, { hueco: true }, { hueco: true }, { hueco: true }] }] }),
      solucion: [{ texto: 'Faltan x³ y x²: sus casillas llevan 0. Si no, las columnas quedan corridas.', ecuacion: ['1   ', OLV('0'), '   ', OLV('0'), '   −3   2'] }],
      respuesta: ['1, ', OLV('0'), ', ', OLV('0'), ', −3, 2'] },
    { nivel: 1, titulo: 'Un paso de la división',
      enunciado: ['Al dividir x³ + 4x² + x − 3 entre ', DV('x² + 2x'), ', el primer término del cociente es ', QC('x'), '. ¿Qué queda después de restar?'],
      datos: [DD.mult],
      solucion: [{ texto: 'Multiplico el divisor por x y lo resto de D, columna por columna.', ecuacion: ['x³ + 4x² + x − 3 − ', QC('x'), '(', DV('x² + 2x'), ') = 2x² + x − 3'] }],
      respuesta: ['2x² + x − 3'] },
    { nivel: 1, titulo: '¿Ya se para?',
      enunciado: ['Al dividir entre ', DV('x² + 1'), ', lo que queda es 3x − 5. ¿Se sigue dividiendo?'],
      datos: [DD.ident, DD.grado],
      solucion: [{ texto: '3x − 5 tiene grado 1, menor que el grado 2 del divisor: ya no se puede restar otra vez x² + 1. Ahí se para, y eso es el resto.', ecuacion: [r_, ' = ', RS('3x − 5')] }],
      respuesta: ['No: el resto es ', RS('3x − 5')] },
    { nivel: 1, titulo: 'Entre un monomio',
      enunciado: ['¿Cuánto es (6x³ + 4x²) entre ', DV('2x'), '?'],
      datos: ['xᵐ ÷ xⁿ = xᵐ⁻ⁿ', 'Al dividir una suma entre un término, se divide cada sumando'],
      solucion: [{ texto: 'Cada término se divide entre 2x: 6x³ ÷ 2x = 3x² y 4x² ÷ 2x = 2x. No sobra nada.', ecuacion: ['(6x³ + 4x²) ÷ ', DV('2x'), ' = ', QC('3x² + 2x')] }],
      respuesta: [QC('3x² + 2x')] },
    { nivel: 2, titulo: 'Una división completa',
      enunciado: ['Divide x³ + 3x² + 5x + 4 entre ', DV('x² + x + 1'), '. ¿Cuáles son el cociente y el resto?'],
      datos: [DD.ident, DD.paso],
      figura: CU(larga([1, 3, 5, 4], [1, 1, 1], { hasta: 0, cabeza: [lineaD([1, 3, 5, 4], [1, 1, 1])] })),
      solucion: [
        { texto: 'x³ ÷ x² = x. Resto x(x² + x + 1) = x³ + x² + x.', ecuacion: ['queda 2x² + 4x + 4'] },
        { texto: '2x² ÷ x² = 2. Resto 2(x² + x + 1) = 2x² + 2x + 2.', ecuacion: ['queda 2x + 2, de grado 1'] },
        { texto: 'El cociente juntó x y 2.', ecuacion: [q_, ' = ', QC('x + 2'), ',   ', r_, ' = ', RS('2x + 2')] },
      ],
      respuesta: [q_, ' = ', QC('x + 2'), '; ', r_, ' = ', RS('2x + 2')] },
    { nivel: 2, titulo: 'Divisor que empieza con 2',
      enunciado: ['Divide 4x³ + 2x² − 1 entre ', DV('2x² − 1'), '.'],
      datos: [DD.ident, DD.paso, 'Una potencia que falta se escribe con coeficiente 0'],
      solucion: [
        { texto: 'Columnas de x³ a x⁰: 4, 2, 0, −1. El primero de d es 2x²: 4x³ ÷ 2x² = 2x.', ecuacion: ['4x³ + 2x² + 0x − 1 − 2x(', DV('2x² − 1'), ') = 2x² + 2x − 1'] },
        { texto: '2x² ÷ 2x² = 1. Resto una vez el divisor.', ecuacion: ['2x² + 2x − 1 − (', DV('2x² − 1'), ') = 2x'] },
        { texto: 'Queda grado 1: se para.', ecuacion: [q_, ' = ', QC('2x + 1'), ',   ', r_, ' = ', RS('2x')] },
      ],
      respuesta: [q_, ' = ', QC('2x + 1'), '; ', r_, ' = ', RS('2x')] },
    { nivel: 2, titulo: 'La misma cuenta en Horner',
      enunciado: ['Divide x⁴ + 2x³ − x² + 3x − 2 entre ', DV('x² + x − 1'), ' con el esquema de Horner.'],
      datos: [DD.ident, DD.horner],
      figura: CU(horner([1, 2, -1, 3, -2], [1, 1, -1], { hasta: 0 })),
      solucion: [
        { texto: 'A la izquierda van 1 y, con el signo cambiado, −1 y 1. Se baja el 1: es el primer número de q.', ecuacion: ['1 · (−1) = −1,   1 · 1 = 1'] },
        { texto: 'Columna de x³: 2 − 1 = 1. Columna de x²: −1 + 1 − 1 = −1. Cada uno da sus productos en diagonal.', ecuacion: [q_, ' = ', QC('x² + x − 1')] },
        { texto: 'Las dos últimas columnas ya no se dividen: 3 + 1 + 1 = 5 y −2 − 1 = −3. Son el resto.', ecuacion: [r_, ' = ', RS('5x − 3')] },
      ],
      respuesta: [q_, ' = ', QC('x² + x − 1'), '; ', r_, ' = ', RS('5x − 3')] },
    { nivel: 2, titulo: 'Con una potencia que falta',
      enunciado: ['Divide 2x⁴ + 3x² − x + 5 entre ', DV('x² − x + 2'), '.'],
      datos: [DD.ident, DD.paso, 'Una potencia que falta se escribe con coeficiente 0'],
      figura: CU(larga([2, 0, 3, -1, 5], [1, -1, 2], { hasta: 0, cabeza: [lineaD([2, 0, 3, -1, 5], [1, -1, 2])] })),
      solucion: [
        { texto: 'Falta x³: su columna lleva 0. 2x⁴ ÷ x² = 2x²; al restar 2x²(x² − x + 2) queda 2x³ − x² − x + 5.' },
        { texto: '2x³ ÷ x² = 2x; al restar 2x(x² − x + 2) queda x² − 5x + 5. Después, 1; al restar queda −4x + 3.', ecuacion: [q_, ' = ', QC('2x² + 2x + 1')] },
        { texto: 'Lo último tiene grado 1, menor que 2: es el resto.', ecuacion: [r_, ' = ', RS('−4x + 3')] },
      ],
      respuesta: [q_, ' = ', QC('2x² + 2x + 1'), '; ', r_, ' = ', RS('−4x + 3')] },
    { nivel: 2, titulo: 'El término independiente del cociente',
      enunciado: ['Al dividir x⁴ − x³ + 2x² + 5 entre ', DV('x² + 2x − 1'), ', ¿cuál es el término independiente del cociente?'],
      datos: [DD.ident, DD.paso],
      solucion: [
        { texto: 'x⁴ ÷ x² = x²; al restar queda −3x³ + 3x² + 0x + 5. Después, −3x; al restar queda 9x² − 3x + 5.' },
        { texto: '9x² ÷ x² = 9: es el último término del cociente, el que no tiene x.', ecuacion: [q_, ' = ', QC('x² − 3x + 9')] },
      ],
      respuesta: [QC('9')] },
    { nivel: 3, titulo: 'Para que salga exacta',
      enunciado: ['¿Para qué valores de m y n la división de x⁴ + 2x³ + mx + n entre ', DV('x² + x − 1'), ' es exacta? Da m + n.'],
      alternativas: ['−1', '1', '0', '2', '−2'],
      datos: [DD.ident, 'División exacta: el resto es 0'],
      solucion: [
        { texto: 'Divido x⁴ + 2x³ + 0x² sin m ni n: x², después x. Lo que queda de esa parte es x.', ecuacion: ['x⁴ + 2x³ = (', DV('x² + x − 1'), ')(', QC('x² + x'), ') + x'] },
        { texto: 'Con m y n, el resto es (1 + m)x + n. Para que sea 0: m = −1 y n = 0.', ecuacion: ['m + n = −1 + 0 = −1'] },
        { texto: ['La ', letra('B'), ' cambia el signo al despejar: m = 1. La ', letra('C'), ' da n, que vale 0. La ', letra('E'), ' cree que n también vale −1.'] },
        { texto: ['La ', letra('D'), ' suma los coeficientes del cociente, 1 + 1 = 2: el cociente no se pregunta.'] },
      ],
      respuesta: [letra('A'), ', m + n = −1'] },
    { nivel: 3, titulo: 'Horner con primer coeficiente 3',
      enunciado: ['Divide 3x⁴ + 5x³ − x² + 2x + 1 entre ', DV('3x² − x + 1'), '. ¿Cuál es el resto?'],
      alternativas: ['−2x − 3', '1', '2x + 1', '−1', 'x² + 2x'],
      datos: [DD.ident, DD.horner],
      figura: CU(horner([3, 5, -1, 2, 1], [3, -1, 1], { hasta: 0 })),
      solucion: [
        { texto: 'A la izquierda van 3 y, con el signo cambiado, 1 y −1. Cada columna se divide entre 3 antes de bajar: 3 ÷ 3 = 1.', ecuacion: ['1 · 1 = 1,   1 · (−1) = −1'] },
        { texto: 'Columna de x³: 5 + 1 = 6, y 6 ÷ 3 = 2. Columna de x²: −1 − 1 + 2 = 0: el cociente no tiene número.', ecuacion: [q_, ' = ', QC('x² + 2x')] },
        { texto: 'Las dos últimas: 2 − 2 = 0 y 1 + 0 = 1.', ecuacion: [r_, ' = ', RS('1')] },
        { texto: ['La ', letra('A'), ' no divide entre 3 antes de bajar. La ', letra('C'), ' olvida el −2 en la columna de x. La ', letra('D'), ' cambia el signo. La ', letra('E'), ' da el cociente.'] },
      ],
      respuesta: [letra('B'), ', ', r_, ' = ', RS('1')] },
    { nivel: 3, titulo: 'Un resto sin dividir',
      enunciado: ['¿Cuál es el resto de dividir 2x⁵ − x³ + 3x − 4 entre ', DV('x² − 2'), '?'],
      alternativas: ['3x − 4', '−4', '9x − 4', '5x − 4', '9x + 4'],
      datos: [DD.ident, 'Si d = x² − 2, d vale 0 cuando x² vale 2'],
      solucion: [
        { texto: 'En D = d · q + r, si x² vale 2, d vale 0 y queda solo r. Cambio x² por 2 en D: el resto no cambia.', ecuacion: ['2x⁵ = 2x · (x²)² → 2x · 4 = 8x,   x³ = x · x² → 2x'] },
        { texto: 'Junto los términos.', ecuacion: ['8x − 2x + 3x − 4 = ', RS('9x − 4')] },
        { texto: ['La ', letra('A'), ' borra los términos con potencias altas. La ', letra('B'), ' se queda con el número. La ', letra('D'), ' cambia (x²)² por 2 y no por 4: 4x − 2x + 3x.'] },
        { texto: ['La ', letra('E'), ' cambia el signo del −4.'] },
      ],
      respuesta: [letra('C'), ', ', r_, ' = ', RS('9x − 4')] },
    { nivel: 3, titulo: 'El coeficiente de x del resto',
      enunciado: ['Al dividir x⁴ − x³ + 2x² + 5 entre ', DV('x² + 2x − 1'), ', ¿cuál es el coeficiente de x en el resto?'],
      alternativas: ['14', '−3', '21', '−21', '9'],
      datos: [DD.ident, DD.paso],
      solucion: [
        { texto: 'El cociente sale x² − 3x + 9. Al restar 9(x² + 2x − 1) de 9x² − 3x + 5, queda la columna de x y la de x⁰.', ecuacion: ['9x² − 3x + 5 − (9x² + 18x − 9) = −21x + 14'] },
        { texto: 'El coeficiente de x del resto es −21.', ecuacion: [r_, ' = ', RS('−21x + 14')] },
        { texto: ['La ', letra('A'), ' da el término independiente del resto. La ', letra('B'), ' copia el −3x sin restar. La ', letra('C'), ' suma 18x en vez de restarlo.'] },
        { texto: ['La ', letra('E'), ' da el término independiente del cociente.'] },
      ],
      respuesta: [letra('D'), ', −21'] },
    { nivel: 3, titulo: 'Exacta con dos letras',
      enunciado: ['¿Para qué valores de m y n la división de x⁴ − 3x³ + 5x² + mx + n entre ', DV('x² − x + 1'), ' es exacta? Da m − n.'],
      alternativas: ['6', '−4', '2', '−8', '−6'],
      datos: [DD.ident, 'División exacta: el resto es 0'],
      solucion: [
        { texto: 'Divido x⁴ − 3x³ + 5x² sin m ni n: el cociente sale x² − 2x + 2 y lo que queda de esa parte es 4x − 2.', ecuacion: ['x⁴ − 3x³ + 5x² = (', DV('x² − x + 1'), ')(', QC('x² − 2x + 2'), ') + 4x − 2'] },
        { texto: 'Con m y n, el resto es (4 + m)x + (n − 2). Es 0 con m = −4 y n = 2.', ecuacion: ['m − n = −4 − 2 = −6'] },
        { texto: ['La ', letra('A'), ' cambia los signos al despejar: 4 − (−2) = 6. La ', letra('B'), ' da solo m. La ', letra('C'), ' da solo n.'] },
        { texto: ['La ', letra('D'), ' multiplica: (−4) · 2 = −8.'] },
      ],
      respuesta: [letra('E'), ', m − n = −6'] },
  ];

  const DP2 = [6, 1, 0, 4, -1], dP2 = [2, 1, -1];   // la predicción y «Mira»: 6x⁴ + x³ + 4x − 1 entre 2x² + x − 1
  const hornerIdea = {
    id: 'horner',
    titulo: 'División clásica y Horner',
    pregunta: '¿Cómo se divide entre un polinomio de grado 2?',
    temas: ['Algoritmo de la división', 'Métodos de Horner y Ruffini'],
    pieza: 'alg-reparto',
    aprendizaje: 'Se divide el primer término de lo que queda entre el primero de d, se resta d por ese término y se repite.',
    actividad: 'Elegir el cociente en el cuaderno hasta que lo que queda tenga grado menor.',
    // Lee: la división del colegio, las columnas y qué mirar. No dice qué pasa si d no empieza con 1 (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'La división del colegio', texto: 'Para dividir 1375 entre 12 en el cuaderno, se toma la parte de adelante, se ve cuántas veces cabe 12, se multiplica y se resta. Después se baja la cifra que sigue.',
          ecuacion: ['1375 = ', DV('12'), ' · ', QC('114'), ' + ', RS('7')] },
        { titulo: 'Con polinomios, por columnas', texto: 'Con polinomios cada columna es una potencia de x, de la mayor a x⁰. Se escriben todos los coeficientes del dividendo, también los 0 de las potencias que faltan.',
          pieza: 'alg-reparto', dibujo: CU({ objeto: 'cuaderno', tipo: 'larga', potencias: ['x³', 'x²', 'x', 'x⁰'], filas: [{ rotulo: 'D', celdas: DJ2.map(f) }], cabeza: [[['d = ', null, 400], ['x² + x − 1', 'i', 700]]] }) },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir los dos números del cociente. Mira la fila de lo que queda: qué columna se vuelve 0 con cada número que eliges.' },
      ],
    },
    ejemplos: EJEMPLOS_HORNER,
    juega: {
      pieza: 'alg-reparto',
      consigna: 'Rubén divide x³ + 4x² + x − 2 entre x² + x − 1 en su cuaderno.',
      mision: {
        texto: 'Elige el cociente para que lo que queda tenga grado menor que el divisor.',
        logrado: v => gradoDe(quedaJ2(v.p, v.s)) < 2,
        bien: 'Listo: q = x + 3 y queda −x + 1, de grado 1.',
      },
      voz: 'Primero haz 0 la columna de x³; después, la de x².',
      leyenda: [
        { s: DV('d'), t: 'el divisor, x² + x − 1' },
        { s: QC('q'), t: 'el cociente que eliges' },
        { s: 'queda', t: 'D − d · q, columna por columna' },
        { s: 'x³, x², x, x⁰', t: 'una columna por potencia' },
      ],
      controles: [
        { id: 'p', etiqueta: 'Coeficiente de x en q', color: 'c-f', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
        { id: 's', etiqueta: 'Término sin x de q', color: 'c-f', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => cuadernoJ2(v.p, v.s),
      lectura: v => { const qd = quedaJ2(v.p, v.s), g = gradoDe(qd); return ['Queda ', g < 2 ? RS(poli(qd)) : poli(qd), `: grado ${g} ${g < 2 ? '<' : '≥'} 2`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Se divide 6x⁴ + x³ + 4x − 1 entre ', DV('2x² + x − 1'), '. ¿Cuál es el primer término del cociente?'],
      datos: ['xᵐ ÷ xⁿ = xᵐ⁻ⁿ'],
      voz: 'Mira el primer término de cada uno.',
      opciones: [
        { id: 'c', texto: '3x²', correcta: true },
        { id: 'sinc', texto: '6x²', error: 'TAL-COEF-PRINC', siFuera: 'Bien el x²: 4 − 2. Pero el 6 también se divide entre el 2 de 2x².' },
        { id: 'exp', texto: '3x⁶', error: 'TAL-EXP-SUMA', siFuera: 'Bien 6 ÷ 2 = 3. Pero al dividir potencias los exponentes se restan: 4 − 2.' },
        { id: 'resta', texto: '4x²', error: 'TAL-COEF-RESTA', siFuera: 'Bien el x². Pero los coeficientes se dividen, 6 ÷ 2, no se restan.' },
      ],
      dibujo: CU({ objeto: 'cuaderno', tipo: 'larga', potencias: ['x⁴', 'x³', 'x²', 'x', 'x⁰'], filas: [{ rotulo: 'D', celdas: DP2.map(celD) }], cabeza: [[['d = ', null, 400], ['2x² + x − 1', 'i', 700], ['     q = ?', null, 700]]] }),
      revelar: CU(larga(DP2, dP2, { hasta: 1, cabeza: [[['d = ', null, 400], ['2x² + x − 1', 'i', 700], ['     q = ', null, 400], ['3x² …', 'f', 700]]] })),
      coincide: 'Coincide: 6x⁴ ÷ 2x² = 3x². El 6 se divide entre 2 y el exponente baja de 4 a 2.',
      noCoincide: 'Revisemos: 3x² · 2x² = 6x⁴, y así se borra la columna de x⁴.',
    },
    mira: {
      pieza: 'alg-reparto',
      datos: Object.assign(larga(DP2, dP2, { hasta: 0, cabeza: [lineaD(DP2, dP2)] }), { pasos: [0, 1, 1, 2, 3, 'h'].map(k => (k === 'h' ? horner(DP2, dP2, { cabeza: [[['Horner: ', null, 700], ['2', 'i', 700], [' y, con el signo cambiado, ', null, 400], ['−1 y 1', 'i', 700]]] }) : larga(DP2, dP2, { hasta: k, cabeza: [lineaD(DP2, dP2)] }))) }),
      voz: 'Columna por columna, como en el colegio.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Se escriben todos los coeficientes, con 0 en x².', ecuacion: ['6   1   ', OLV('0'), '   4   −1'] },
        { estado: { paso: 1 }, texto: '6x⁴ entre 2x² da 3x². Se resta 3x² · d.', ecuacion: ['6x⁴ ÷ ', DV('2x²'), ' = ', QC('3x²')] },
        { estado: { paso: 2 }, texto: 'Queda −2x³ + 3x² + 4x − 1, todavía de grado 3.', ecuacion: ['−2x³ ÷ ', DV('2x²'), ' = ', QC('−x')] },
        { estado: { paso: 3 }, texto: 'Después de −x, queda 4x² + 3x − 1: entra un 2.', ecuacion: ['4x² ÷ ', DV('2x²'), ' = ', QC('2')] },
        { estado: { paso: 4 }, texto: 'Queda x + 1, de grado 1: es el resto.', ecuacion: [q_, ' = ', QC('3x² − x + 2'), ',   ', r_, ' = ', RS('x + 1')] },
        { estado: { paso: 5 }, texto: 'Horner hace la misma cuenta y suma, con los signos cambiados.', ecuacion: ['−(x − 1) = ', DV('−x + 1')] },
      ],
    },
    regla: {
      texto: 'Cada término de q es el primero de lo que queda entre el primero de d. Se resta d por ese término, hasta bajar del grado de d.',
      ecuacion: ['6x⁴ ÷ ', DV('2x²'), ' = ', { llave: [QC('3x²')], nota: 'un término de q', color: 'c-f' }, SEP, 'queda: D − ', d_, ' · ', QC('3x²')],
      condicion: 'D y d están ordenados de la potencia mayor a la menor, con 0 en las que faltan.',
      voz: 'Horner es esta misma cuenta, en una tabla y sumando.',
      dibujo: CU(horner(DP2, dP2)),
    },
    // Así se resuelve: la división completa (cociente y resto). «Ahora tú» pide una parte: el primer término, un
    // coeficiente, el resto, o m y n para que sea exacta.
    resuelve: {
      pieza: 'alg-reparto',
      generar(s) {
        const r = azar(s + 900);
        let d, q, rr, D;
        do { d = [r.uno([1, 2]), r.noCero(-3, 3), r.noCero(-3, 3)]; q = [r.ent(1, 3), r.noCero(-3, 3), r.ent(-4, 4)]; rr = [r.noCero(-5, 5), r.ent(-6, 6)]; D = sumar(multiplicar(d, q), rr); } while (D[0] === 0);
        const pasosQ = dividir(D, d).q;
        const t0 = termino(pasosQ[0], 2), t1 = termino(pasosQ[1], 1);
        return {
          enunciado: ['Divide ', poli(D), ' entre ', DV(poli(d)), '. ¿Cuáles son el cociente y el resto?'],
          datos: [DD.ident, DD.paso],
          dibujo: CU(larga(D, d, { hasta: 0, cabeza: [lineaD(D, d)] })),
          pasos: [
            { tipo: 'pide', texto: ['Piden el cociente ', q_, ' y el resto ', r_, ' de dividir entre un polinomio de grado 2.'] },
            { tipo: 'regla', texto: 'Divido el primer término de lo que queda entre el primero de d; ese término va a q y resto d por él. Paro al llegar a grado 1.' },
            { tipo: 'cuentas', texto: `${termino(D[0], 4)} entre ${termino(d[0], 2)} da ${t0}. Al restar ${t0} · d, la columna de x⁴ queda en 0.`, ecuacion: [QC(t0)] },
            { tipo: 'cuentas', texto: `El primero que queda, dividido entre ${termino(d[0], 2)}, da ${t1}; después sale ${termino(pasosQ[2], 0)}. Cada vez resto d por ese término.`,
              ecuacion: [q_, ' = ', QC(poli(pasosQ))], dibujo: CU(larga(D, d, { cabeza: [lineaD(D, d)] })) },
            { tipo: 'sentido', texto: 'Lo que queda tiene grado 1, menor que el 2 del divisor. Reviso: d · q + r reconstruye D.',
              ecuacion: ['(', DV(poli(d)), ')(', QC(poli(q)), ') + (', RS(poli(rr)), ') = ', poli(D)] },
          ],
          respuesta: [q_, ' = ', QC(poli(q)), '; ', r_, ' = ', RS(poli(rr))],
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-reparto',
      voz: 'Escribe las columnas completas antes de dividir.',
      generar(sem) {
        const r = azar(sem + 47), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoPrimerTermino, r);
        if (tipo === 1) return conCuatro(casoCoefQ, r);
        if (tipo === 2) return conCuatro(casoRestoCuad, r);
        return conCuatro(casoExactaMN, r);
      },
    },
  };

  // ---------- Idea 3: regla de Ruffini ----------
  // Objeto: la misma hoja del cuaderno, con la tabla de tres filas (alg-reparto, 'cuaderno', tipo 'ruffini').
  // Cambia: a, el número del divisor x − a (de −3 a 3). · Permanece: D = x³ + 2x² − x + 3, completo. · Progresa: la
  // fila de abajo, casilla por casilla. · Se reserva: un dividendo con una potencia que falta (la predicción:
  // 2x³ − 5x + 1). · Debe verse: cada casilla nueva sale de la de arriba y de a por la anterior; la última es el resto.
  // Errores: PO1 sin el 0 de la potencia que falta · PO2 usa −a · TAL-RUF-PRODUCTO solo multiplica, sin sumar ·
  // TAL-RUF-RESTA resta el producto · TAL-RUF-BAJA copia el de arriba · TAL-RESTO-EN-Q mete el resto en el cociente ·
  // PO7 da la suma de coeficientes de D · TAL-PIDE da otra casilla · AL16 despeja con el signo cambiado.
  const DJ3 = [1, 2, -1, 3];
  const cabezaRuf = (D, a) => [[[`${poli(D)} entre `, null, 400], [divisorTxt(a), 'i', 700]]];
  const conSigno = v => (v < 0 ? `− ${f(-v)}` : `+ ${f(v)}`);
  // Ahora tú 1: una casilla de la fila de abajo.
  function casoCasilla(r) {
    const cs = [r.noCero(-3, 3), r.ent(-4, 4), r.ent(-5, 5), r.ent(-6, 6)];
    const x = r.noCero(-3, 3), b = ruffini(cs, x), k = r.ent(1, 2);
    return {
      pregunta: ['En la tabla de Ruffini de ', poli(cs), ' entre ', DV(divisorTxt(x)), ', ¿qué número va en la casilla «?» de la fila de abajo?'],
      dibujo: CU(rufTabla(cs, x, { hasta: k, oculta: k, cabeza: cabezaRuf(cs, x) })),
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior', `${divisorTxt(x)} = x − ${par(x)}`],
      opciones: ops([
        { id: 'c', texto: f(b[k]), correcta: true },
        { id: 'resta', texto: f(cs[k] - x * b[k - 1]), error: 'TAL-RUF-RESTA', siFuera: `Bien el producto ${par(x)} · ${par(b[k - 1])}. Pero se suma al de arriba, no se resta.` },
        { id: 'signo', texto: f(cs[k] - x * b[k - 1]) === f(ruffini(cs, -x)[k]) ? null : f(ruffini(cs, -x)[k]), error: 'PO2', siFuera: `Bien la cuenta. Pero ${divisorTxt(x)} se anula en ${f(x)}: a vale ${f(x)}, no ${f(-x)}.` },
        { id: 'prod', texto: f(x * b[k - 1]), error: 'TAL-RUF-PRODUCTO', siFuera: `Bien ${par(x)} · ${par(b[k - 1])}. Pero falta sumarle el ${f(cs[k])} de arriba.` },
        { id: 'arriba', texto: f(cs[k]), error: 'TAL-RUF-BAJA', siFuera: 'Bien leído el de arriba. Pero solo el primero se baja tal cual; los demás suman el producto.' },
      ]),
      solucion: { texto: 'El de arriba más a por la casilla anterior.', ecuacion: [`${f(cs[k])} + `, NA(par(x)), ` · ${par(b[k - 1])} = `, QC(f(b[k]))] },
    };
  }
  // Ahora tú 2: el resto, con una potencia que falta.
  function casoRestoRuf(r) {
    const cs = [r.noCero(-2, 3), 0, r.noCero(-5, 5), r.ent(-6, 6)];
    if (r() < 0.5) { cs.splice(1, 0, r.noCero(-3, 3)); }
    const x = r.noCero(-3, 3), b = ruffini(cs, x), sin0 = ruffini(cs.filter((c, i) => c !== 0 || i === 0), x);
    if (poli(cs) === '2x³ − 5x + 1' && x === 2) return null;   // la predicción de la idea
    return {
      pregunta: ['Con la tabla de Ruffini, ¿cuál es el resto de dividir ', poli(cs), ' entre ', DV(divisorTxt(x)), '?'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior', 'Una potencia que falta se escribe con coeficiente 0', `${divisorTxt(x)} = x − ${par(x)}`],
      opciones: ops([
        { id: 'c', texto: f(b[b.length - 1]), correcta: true },
        { id: 'sin0', texto: f(sin0[sin0.length - 1]), error: 'PO1', siFuera: 'Bien las cuentas. Pero falta la casilla con 0 de la potencia que no está: las columnas se corren.' },
        { id: 'signo', texto: f(ruffini(cs, -x)[cs.length - 1]), error: 'PO2', siFuera: `Bien la tabla. Pero ${divisorTxt(x)} se anula en ${f(x)}: a vale ${f(x)}.` },
        { id: 'indep', texto: f(cs[cs.length - 1]), error: 'PO27', siFuera: 'Bien que el resto va al final. Pero es la última casilla de abajo, no el último coeficiente de arriba.' },
      ]),
      solucion: { texto: 'La última casilla de abajo es el resto.', ecuacion: [`Abajo: ${b.map(f).join('   ')}   →   `, r_, ' = ', RS(f(b[b.length - 1]))] },
    };
  }
  // Ahora tú 3: el cociente completo.
  function casoCocienteRuf(r) {
    const cs = [r.noCero(-2, 3), r.ent(-4, 4), r.ent(-5, 5), r.noCero(-6, 6)];
    const x = r.noCero(-3, 3), b = ruffini(cs, x), bs = ruffini(cs, -x);
    return {
      pregunta: ['Con la tabla de Ruffini, ¿cuál es el cociente de dividir ', poli(cs), ' entre ', DV(divisorTxt(x)), '?'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior', 'La fila de abajo, sin la última casilla: los coeficientes del cociente', `${divisorTxt(x)} = x − ${par(x)}`],
      opciones: ops([
        { id: 'c', texto: poli(b.slice(0, -1)), correcta: true },
        { id: 'signo', texto: poli(bs.slice(0, -1)), error: 'PO2', siFuera: `Bien la tabla. Pero ${divisorTxt(x)} se anula en ${f(x)}: a vale ${f(x)}.` },
        { id: 'todo', texto: poli(b), error: 'TAL-RESTO-EN-Q', siFuera: 'Bien las casillas. Pero la última es el resto: el cociente tiene un grado menos que D.' },
        { id: 'baja', texto: poli(cs.slice(0, -1)), error: 'TAL-RUF-BAJA', siFuera: 'Bien que el cociente tiene un grado menos. Pero sus coeficientes son los de abajo, no los de arriba.' },
      ]),
      solucion: { texto: 'Las casillas de abajo, menos la última, son el cociente.', ecuacion: [`Abajo: ${b.map(f).join('   ')}   →   `, q_, ' = ', QC(poli(b.slice(0, -1)))] },
    };
  }
  // Ahora tú 4 (nivel examen): la suma de coeficientes del cociente, con grado 4 y x + a.
  function casoSumaQRuf(r) {
    const cs = [1, r.ent(-3, 3), r.ent(-4, 4), r.ent(-4, 4), r.noCero(-6, 6)];
    const x = -r.ent(1, 3), b = ruffini(cs, x), sq = b.slice(0, -1).reduce((u, w) => u + w, 0);
    return {
      pregunta: ['Al dividir ', poli(cs), ' entre ', DV(divisorTxt(x)), ', ¿cuánto suman los coeficientes del cociente?'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior', `${divisorTxt(x)} = x − ${par(x)}`, 'La fila de abajo, sin la última casilla: los coeficientes del cociente'],
      opciones: ops([
        { id: 'c', texto: f(sq), correcta: true },
        { id: 'todo', texto: f(sq + b[4]), error: 'TAL-RESTO-EN-Q', siFuera: `Bien la fila de abajo. Pero la última casilla, ${f(b[4])}, es el resto: no va en el cociente.` },
        { id: 'signo', texto: f(ruffini(cs, -x).slice(0, -1).reduce((u, w) => u + w, 0)), error: 'PO2', siFuera: `Bien la suma. Pero ${divisorTxt(x)} se anula en ${f(x)}, no en ${f(-x)}.` },
        { id: 'D1', texto: f(evaluar(cs, 1)), error: 'PO7', siFuera: 'Esa es la suma de los coeficientes de D. Piden la del cociente, que sale de la tabla.' },
      ]),
      solucion: { texto: 'Sumo las casillas de abajo, menos la última.', ecuacion: [b.slice(0, -1).map(par).join(' + '), ' = ', QC(f(sq))] },
    };
  }

  // Ejemplos de la idea 3 (cuentas aparte en e6-algebra/scripts/cuentas-ejemplos.py): 2x² + 5x − 3 entre x − 1 → 2, 7,
  // 4; x + 4 → a = −4; x³ − 2x + 5 → 1, 0, −2, 5; x³ − 4x² + x + 6 entre x − 3 → 1, −1, −2, 0; −4 + (−2) · 3 = −10;
  // 2x³ + 3x² − 5 entre x + 2 → 2, −1, 2, −9; x⁴ − 3x + 1 entre x − 1 → 1, 1, 1, −2, −1; 2x⁴ + x³ − 3x² + x − 4 entre
  // x + 1 → 2, −1, −2, 3, −7; 3x⁴ − 2x³ + 4x + 1 entre x + 1 → 3, −5, 5, −1, 2; x³ + mx² − 4x + 6 entre x − 2 con resto
  // 14 → m = 2; x⁴ − 2x³ + 3x − 5 entre x + 2 → 1, −4, 8, −13, 21; x³ − 7x + 6 → 1, 2, −3, 0 con a = 2;
  // 2x³ − 3x² + 4x − 1 entre x − 3 → 2, 3, 13, 38; x⁵ + 2x⁴ − x² + 3 entre x + 2 → 1, 0, 0, −1, 2, −1.
  const EJEMPLOS_RUFFINI = [
    { nivel: 1, titulo: 'Una casilla de la tabla',
      enunciado: ['En la tabla de Ruffini de 2x² + 5x − 3 entre ', DV('x − 1'), ', ya se bajó el 2. ¿Qué número va en la segunda casilla de abajo?'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior'],
      figura: CU(rufTabla([2, 5, -3], 1, { hasta: 1, oculta: 1, flechas: false })),
      solucion: [{ texto: 'x − 1 se anula en 1: a = 1. El de arriba es 5 y la casilla anterior, 2.', ecuacion: ['5 + ', NA('1'), ' · 2 = ', QC('7')] }],
      respuesta: [QC('7')] },
    { nivel: 1, titulo: 'El número de la izquierda',
      enunciado: ['Para dividir entre ', DV('x + 4'), ' con Ruffini, ¿qué número va a la izquierda de la tabla?'],
      datos: ['A la izquierda va a, el número que anula al divisor x − a'],
      solucion: [{ texto: 'x + 4 es lo mismo que x − (−4): vale 0 con x = −4.', ecuacion: [DV('x + 4'), ' = 0   →   x = ', NA('−4')] }],
      respuesta: [NA('−4')] },
    { nivel: 1, titulo: 'La fila de arriba',
      enunciado: ['Para dividir x³ − 2x + 5 con Ruffini, ¿qué va en la fila de arriba?'],
      datos: ['Una potencia que falta se escribe con coeficiente 0'],
      solucion: [{ texto: 'Van los coeficientes de x³ a x⁰. Falta x²: su casilla lleva 0.', ecuacion: ['1   ', OLV('0'), '   −2   5'] }],
      respuesta: ['1, ', OLV('0'), ', −2, 5'] },
    { nivel: 1, titulo: 'Leer la fila de abajo',
      enunciado: ['La tabla de Ruffini de x³ − 4x² + x + 6 entre ', DV('x − 3'), ' deja abajo 1, −1, −2 y 0. ¿Cuáles son el cociente y el resto?'],
      datos: ['La fila de abajo, sin la última casilla: los coeficientes del cociente; la última: el resto'],
      // La fila de abajo en tinta y sin la caja del resto: el color diría cuál es el cociente y cuál el resto.
      figura: CU(Object.assign(rufTabla([1, -4, 1, 6], 3), { abajo: ['1', '−1', '−2', '0'], caja: false })),
      solucion: [{ texto: 'D tiene grado 3, así que el cociente tiene grado 2: 1, −1 y −2 son sus coeficientes. La última casilla es el resto.', ecuacion: [q_, ' = ', QC('x² − x − 2'), ',   ', r_, ' = ', RS('0')] }],
      respuesta: [q_, ' = ', QC('x² − x − 2'), '; ', r_, ' = ', RS('0')] },
    { nivel: 1, titulo: 'Una cuenta con a negativo',
      enunciado: ['En una tabla de Ruffini con a = −2, arriba hay −4 y la casilla anterior de abajo es 3. ¿Qué número va en la casilla nueva?'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior'],
      solucion: [{ texto: 'Multiplico la anterior por a y le sumo el de arriba.', ecuacion: ['−4 + ', NA('(−2)'), ' · 3 = −4 − 6 = ', QC('−10')] }],
      respuesta: [QC('−10')] },
    { nivel: 2, titulo: 'Dividir entre x + 2',
      enunciado: ['Divide 2x³ + 3x² − 5 entre ', DV('x + 2'), ' con Ruffini.'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior', 'Una potencia que falta se escribe con coeficiente 0'],
      figura: CU(rufTabla([2, 3, 0, -5], -2, { hasta: 0 })),
      solucion: [
        { texto: 'x + 2 se anula en −2. Arriba: 2, 3, 0 y −5 (falta x). Se baja el 2.', ecuacion: ['3 + (−2) · 2 = −1,   0 + (−2)(−1) = 2'] },
        { texto: 'La última: −5 + (−2) · 2 = −9.', ecuacion: [q_, ' = ', QC('2x² − x + 2'), ',   ', r_, ' = ', RS('−9')] },
      ],
      respuesta: [q_, ' = ', QC('2x² − x + 2'), '; ', r_, ' = ', RS('−9')] },
    { nivel: 2, titulo: 'Dos potencias que faltan',
      enunciado: ['Divide x⁴ − 3x + 1 entre ', DV('x − 1'), ' con Ruffini.'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior', 'Una potencia que falta se escribe con coeficiente 0'],
      figura: CU(rufTabla([1, 0, 0, -3, 1], 1, { hasta: 0 })),
      solucion: [
        { texto: 'Faltan x³ y x²: arriba van 1, 0, 0, −3 y 1. Con a = 1, cada casilla es la de arriba más la anterior.', ecuacion: ['1,   0 + 1 = 1,   0 + 1 = 1,   −3 + 1 = −2,   1 − 2 = −1'] },
        { texto: 'Cuatro casillas son el cociente, de grado 3; la última, el resto.', ecuacion: [q_, ' = ', QC('x³ + x² + x − 2'), ',   ', r_, ' = ', RS('−1')] },
      ],
      respuesta: [q_, ' = ', QC('x³ + x² + x − 2'), '; ', r_, ' = ', RS('−1')] },
    { nivel: 2, titulo: 'Comprobar la tabla',
      enunciado: ['Ruffini dio ', q_, ' = ', QC('2x² − x + 2'), ' y ', r_, ' = ', RS('−9'), ' al dividir 2x³ + 3x² − 5 entre ', DV('x + 2'), '. Compruébalo con D = d · q + r.'],
      datos: [DD.ident, DD.mult],
      solucion: [
        { texto: 'Multiplico el divisor por el cociente.', ecuacion: ['(', DV('x + 2'), ')(', QC('2x² − x + 2'), ') = 2x³ − x² + 2x + 4x² − 2x + 4 = 2x³ + 3x² + 4'] },
        { texto: 'Le sumo el resto: 4 − 9 = −5. Sale el dividendo.', ecuacion: ['2x³ + 3x² + 4 ', RS('− 9'), ' = 2x³ + 3x² − 5'] },
      ],
      respuesta: ['Cuadra: d · q + r = 2x³ + 3x² − 5'] },
    { nivel: 2, titulo: 'Grado 4 entre x + 1',
      enunciado: ['Divide 2x⁴ + x³ − 3x² + x − 4 entre ', DV('x + 1'), ' con Ruffini.'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior'],
      figura: CU(rufTabla([2, 1, -3, 1, -4], -1, { hasta: 0 })),
      solucion: [
        { texto: 'Con a = −1, cada casilla es la de arriba menos la anterior.', ecuacion: ['2,   1 − 2 = −1,   −3 + 1 = −2,   1 + 2 = 3,   −4 − 3 = −7'] },
        { texto: 'El cociente tiene grado 3.', ecuacion: [q_, ' = ', QC('2x³ − x² − 2x + 3'), ',   ', r_, ' = ', RS('−7')] },
      ],
      respuesta: [q_, ' = ', QC('2x³ − x² − 2x + 3'), '; ', r_, ' = ', RS('−7')] },
    { nivel: 2, titulo: 'Un 0 en medio',
      enunciado: ['¿Cuál es el resto de dividir 3x⁴ − 2x³ + 4x + 1 entre ', DV('x + 1'), '?'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior', 'Una potencia que falta se escribe con coeficiente 0'],
      solucion: [
        { texto: 'Falta x²: arriba van 3, −2, 0, 4 y 1. Con a = −1:', ecuacion: ['3,   −2 − 3 = −5,   0 + 5 = 5,   4 − 5 = −1,   1 + 1 = 2'] },
        { texto: 'La última casilla es el resto.', ecuacion: [r_, ' = ', RS('2')] },
      ],
      respuesta: [r_, ' = ', RS('2')] },
    { nivel: 3, titulo: 'Un coeficiente por hallar',
      enunciado: ['En la tabla de Ruffini de x³ + mx² − 4x + 6 entre ', DV('x − 2'), ', el resto sale 14. ¿Cuánto vale m?'],
      alternativas: ['−2', '2', '5', '14', '0'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior'],
      solucion: [
        { texto: 'Lleno la tabla con m: se baja 1; después m + 2; después −4 + 2(m + 2) = 2m.', ecuacion: ['resto = 6 + 2 · 2m = 6 + 4m'] },
        { texto: 'Igualo al resto dado y despejo.', ecuacion: ['6 + 4m = 14   →   m = 2'] },
        { texto: ['La ', letra('A'), ' despeja con el signo cambiado. La ', letra('C'), ' suma el 6 en vez de restarlo: 4m = 20.'] },
        { texto: ['La ', letra('D'), ' da el resto. La ', letra('E'), ' es el m que deja resto 6, el término independiente.'] },
      ],
      respuesta: [letra('B'), ', m = 2'] },
    { nivel: 3, titulo: 'Suma de coeficientes del cociente',
      enunciado: ['Al dividir x⁴ − 2x³ + 3x − 5 entre ', DV('x + 2'), ', ¿cuánto suman los coeficientes del cociente?'],
      alternativas: ['21', '13', '−3', '−8', '4'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior', 'Una potencia que falta se escribe con coeficiente 0'],
      solucion: [
        { texto: 'Arriba: 1, −2, 0, 3 y −5. Con a = −2:', ecuacion: ['1,   −4,   8,   −13,   21'] },
        { texto: 'El cociente son las cuatro primeras casillas.', ecuacion: ['1 − 4 + 8 − 13 = ', QC('−8')] },
        { texto: ['La ', letra('A'), ' da el resto. La ', letra('B'), ' suma también el resto: −8 + 21. La ', letra('C'), ' suma los coeficientes de D.'] },
        { texto: ['La ', letra('E'), ' usa a = 2: el cociente sería x³ + 3, que suma 4.'] },
      ],
      respuesta: [letra('D'), ', ', QC('−8')] },
    { nivel: 3, titulo: 'El número a de la tabla',
      enunciado: ['En una tabla de Ruffini de x³ − 7x + 6 entre x − a, la fila de abajo es 1, 2, −3 y 0. ¿Cuánto vale a?'],
      alternativas: ['−2', '0', '6', '1', '2'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior', 'Una potencia que falta se escribe con coeficiente 0'],
      solucion: [
        { texto: 'Arriba van 1, 0, −7 y 6. La segunda casilla de abajo es 0 + a · 1, y vale 2.', ecuacion: ['0 + ', NA('a'), ' · 1 = 2   →   ', NA('a'), ' = 2'] },
        { texto: 'Compruebo las otras: −7 + 2 · 2 = −3 y 6 + 2 · (−3) = 0. Cuadran.' },
        { texto: ['La ', letra('A'), ' lee el divisor como x + a. La ', letra('B'), ' da el resto. La ', letra('C'), ' da el último de arriba.'] },
        { texto: ['La ', letra('D'), ' da la casilla que se baja.'] },
      ],
      respuesta: [letra('E'), ', ', NA('a'), ' = 2'] },
    { nivel: 3, titulo: 'El número sin x del cociente',
      enunciado: ['Al dividir 2x³ − 3x² + 4x − 1 entre ', DV('x − 3'), ', ¿cuál es el término independiente del cociente?'],
      alternativas: ['13', '38', '4', '−1', '31'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior'],
      solucion: [
        { texto: 'Con a = 3:', ecuacion: ['2,   −3 + 6 = 3,   4 + 9 = 13,   −1 + 39 = 38'] },
        { texto: 'El cociente es 2x² + 3x + 13: su término sin x es la tercera casilla.', ecuacion: [QC('13')] },
        { texto: ['La ', letra('B'), ' da el resto. La ', letra('C'), ' copia el de arriba. La ', letra('D'), ' da el término independiente de D.'] },
        { texto: ['La ', letra('E'), ' usa a = −3: la tercera casilla sería 31.'] },
      ],
      respuesta: [letra('A'), ', ', QC('13')] },
    { nivel: 3, titulo: 'Resto con cuatro ceros posibles',
      enunciado: ['¿Cuál es el resto de dividir x⁵ + 2x⁴ − x² + 3 entre ', DV('x + 2'), '?'],
      alternativas: ['3', '5', '−1', '63', '1'],
      datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior', 'Una potencia que falta se escribe con coeficiente 0'],
      solucion: [
        { texto: 'Faltan x³ y x: arriba van 1, 2, 0, −1, 0 y 3. Con a = −2:', ecuacion: ['1,   0,   0,   −1,   2,   −1'] },
        { texto: 'La última casilla es el resto.', ecuacion: [r_, ' = ', RS('−1')] },
        { texto: ['La ', letra('A'), ' da el término independiente. La ', letra('B'), ' no escribe los 0: con 1, 2, −1 y 3 sale 5.'] },
        { texto: ['La ', letra('D'), ' usa a = 2 y da 63. La ', letra('E'), ' da la casilla que se baja.'] },
      ],
      respuesta: [letra('C'), ', ', r_, ' = ', RS('−1')] },
  ];

  const PR3 = [2, 0, -5, 1];   // la predicción y «Mira»: 2x³ − 5x + 1 entre x − 2
  const ruffiniIdea = {
    id: 'ruffini',
    titulo: 'Regla de Ruffini',
    pregunta: '¿Cómo se divide rápido entre x − a?',
    temas: ['Métodos de Horner y Ruffini'],
    pieza: 'alg-reparto',
    aprendizaje: 'Para dividir entre x − a se baja el primero, y cada casilla nueva es el de arriba más a por la anterior.',
    actividad: 'Elegir el número a y ver cómo se llena la tabla en el cuaderno.',
    // Lee: el atajo, las tres filas y qué mirar. No dice qué hacer con una potencia que falta (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Un atajo para x − a', texto: 'Cuando el divisor es x − a, la división por columnas cabe en una tabla de tres filas. Se llama regla de Ruffini, por el matemático italiano Paolo Ruffini.' },
        { titulo: 'El número de la izquierda', texto: 'A la izquierda va a, el número que anula al divisor: x − 3 vale 0 con x = 3, y x + 2 = x − (−2) vale 0 con x = −2.',
          ecuacion: [DV('x + 2'), ' = 0   →   x = ', NA('−2')] },
        { titulo: 'Qué mirar al jugar', texto: 'Arriba van los coeficientes del dividendo. Sigue una flecha: va de una casilla de abajo a la fila del medio. Descubre qué cuenta hace.',
          pieza: 'alg-reparto', dibujo: CU(rufTabla(DJ3, 1, { cabeza: cabezaRuf(DJ3, 1) })) },
      ],
    },
    ejemplos: EJEMPLOS_RUFFINI,
    juega: {
      pieza: 'alg-reparto',
      consigna: 'Rubén divide x³ + 2x² − x + 3 entre x − a con la tabla corta de su cuaderno.',
      mision: {
        texto: 'Elige a para que el cociente sea x² + 4x + 7.',
        logrado: v => v.a === 2,
        bien: 'Listo: abajo quedan 1, 4, 7 y 17; el 17 es el resto.',
      },
      voz: 'Sigue cada flecha: multiplica por a y suma.',
      leyenda: [
        { s: NA('a'), t: 'el número que anula a x − a' },
        { s: QC('abajo'), t: 'el cociente, un grado menos que D' },
        { s: RS('la caja'), t: 'la última casilla: el resto' },
        { s: DV('flecha'), t: 'multiplica por a y sube' },
      ],
      controles: [{ id: 'a', etiqueta: 'a', color: 'c-i', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: v => CU(rufTabla(DJ3, v.a, { cabeza: cabezaRuf(DJ3, v.a) })),
      lectura: v => { const b = ruffini(DJ3, v.a), R = b[b.length - 1]; return ['(', DV(divisorTxt(v.a)), ')(', QC(poli(b.slice(0, -1))), ')', R ? ' ' : '', R ? RS(conSigno(R)) : '', ' = x³ + 2x² − x + 3']; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Con la tabla de Ruffini, ¿cuál es el resto de dividir 2x³ − 5x + 1 entre ', DV('x − 2'), '?'],
      datos: ['x − 2 vale 0 con x = 2'],
      voz: 'Piensa qué va en cada columna de arriba.',
      opciones: [
        { id: 'c', texto: '7', correcta: true },
        { id: 'sin0', texto: '−1', error: 'PO1', siFuera: 'Bien las cuentas de la tabla. Pero falta la columna de x², con 0: sin ella, todo se corre.' },
        { id: 'signo', texto: '−5', error: 'PO2', siFuera: 'Bien la tabla con el 0. Pero x − 2 vale 0 con 2, no con −2.' },
        { id: 'prod', texto: '6', error: 'TAL-RUF-PRODUCTO', siFuera: 'Bien 2 · 3 = 6. Pero falta sumarle el 1 de arriba.' },
      ],
      dibujo: CU({ objeto: 'cuaderno', tipo: 'larga', filas: [], cabeza: [[['2x³ − 5x + 1 entre ', null, 400], ['x − 2', 'i', 700]], [['resto = ?', null, 700]]] }),
      revelar: CU(rufTabla(PR3, 2, { cabeza: cabezaRuf(PR3, 2) })),
      coincide: 'Coincide: con el 0 de x² arriba, abajo quedan 2, 4, 3 y 7. La última casilla, 7, es el resto.',
      noCoincide: 'Revisemos: 2x³ − 5x + 1 no tiene x²; su columna lleva 0 y la tabla tiene cuatro columnas.',
    },
    mira: {
      pieza: 'alg-reparto',
      datos: Object.assign(rufTabla(PR3, 2, { hasta: 0, cabeza: cabezaRuf(PR3, 2) }), { pasos: [0, 1, 2, 3, 4, 4].map(k => rufTabla(PR3, 2, { hasta: k, cabeza: cabezaRuf(PR3, 2) })) }),
      voz: 'Una columna por vez, de izquierda a derecha.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Arriba, los coeficientes, con 0 por el x² que falta.', ecuacion: ['2   ', OLV('0'), '   −5   1'] },
        { estado: { paso: 1 }, texto: 'Se baja el primero, el 2.', ecuacion: [QC('2')] },
        { estado: { paso: 2 }, texto: '2 · 2 = 4 sube a la columna del 0; 0 + 4 = 4.', ecuacion: ['0 + ', NA('2'), ' · 2 = ', QC('4')] },
        { estado: { paso: 3 }, texto: '4 · 2 = 8 sube; −5 + 8 = 3.', ecuacion: ['−5 + ', NA('2'), ' · 4 = ', QC('3')] },
        { estado: { paso: 4 }, texto: '3 · 2 = 6 sube; 1 + 6 = 7: la última casilla es el resto.', ecuacion: ['1 + ', NA('2'), ' · 3 = ', RS('7')] },
        { estado: { paso: 5 }, texto: 'Las demás casillas son el cociente, un grado menos.', ecuacion: [q_, ' = ', QC('2x² + 4x + 3'), ',   ', r_, ' = ', RS('7')] },
      ],
    },
    regla: {
      texto: 'Arriba van los coeficientes de D, con 0 en las potencias que faltan. Se baja el primero; cada casilla nueva es el de arriba más a por la anterior.',
      ecuacion: ['nueva = ', { llave: ['arriba'], nota: 'coeficiente de D' }, ' + ', NA('a'), ' · ', { llave: [QC('anterior')], nota: 'la de su izquierda', color: 'c-f' }],
      condicion: 'el divisor es x − a; con x + a se usa −a, porque x + a = x − (−a).',
      voz: 'Las casillas de abajo, menos la última, son el cociente.',
      dibujo: CU(rufTabla(PR3, 2, { cabeza: cabezaRuf(PR3, 2) })),
    },
    // Así se resuelve: la tabla entera con x + a y un 0 (cociente y resto). «Ahora tú» pide una casilla, el resto, el
    // cociente o la suma de sus coeficientes.
    resuelve: {
      pieza: 'alg-reparto',
      generar(s) {
        const r = azar(s + 900);
        const cs = [r.noCero(-3, 3), 0, r.noCero(-5, 5), r.ent(-6, 6)];
        const x = -r.ent(1, 3), b = ruffini(cs, x);
        return {
          enunciado: ['Divide ', poli(cs), ' entre ', DV(divisorTxt(x)), ' con Ruffini. ¿Cuáles son el cociente y el resto?'],
          datos: ['Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior', 'Una potencia que falta se escribe con coeficiente 0'],
          dibujo: CU(rufTabla(cs, x, { hasta: 0, cabeza: cabezaRuf(cs, x) })),
          pasos: [
            { tipo: 'pide', texto: ['Piden el cociente ', q_, ' y el resto ', r_, '.'] },
            { tipo: 'datos', texto: [`${divisorTxt(x)} = x − (${f(x)}): a la izquierda va `, NA(f(x)), '. Falta x²: arriba van ', cs.map(f).join(', '), '.'] },
            { tipo: 'regla', texto: 'Se baja el primero; cada casilla nueva es el de arriba más a por la anterior.' },
            { tipo: 'cuentas', texto: `Lleno la fila de abajo de izquierda a derecha: ${b.map(f).join(', ')}.`, ecuacion: [b.slice(1).map((v, k) => `${f(cs[k + 1])} + (${f(x)})(${f(b[k])}) = ${f(v)}`).join(',   ')],
              dibujo: CU(rufTabla(cs, x, { cabeza: cabezaRuf(cs, x) })) },
            { tipo: 'sentido', texto: 'D tiene grado 3: el cociente tiene grado 2, con tres casillas. La cuarta es el resto, un número.', ecuacion: [q_, ' = ', QC(poli(b.slice(0, -1))), ',   ', r_, ' = ', RS(f(b[3]))] },
          ],
          respuesta: [q_, ' = ', QC(poli(b.slice(0, -1))), '; ', r_, ' = ', RS(f(b[3]))],
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-reparto',
      voz: 'Primero el número de la izquierda; después, todas las columnas de arriba.',
      generar(sem) {
        const r = azar(sem + 59), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoCasilla, r);
        if (tipo === 1) return conCuatro(casoRestoRuf, r);
        if (tipo === 2) return conCuatro(casoCocienteRuf, r);
        return conCuatro(casoSumaQRuf, r);
      },
    },
  };

  // ---------- Idea 4: divisor de la forma cx + b ----------
  // Objeto: el pasadizo de Rubén con el mismo pedido, 6x² + 6x + 1 dm², ahora 1, 2, 3 o 6 veces más ancho
  // (alg-reparto, 'pasadizo'): el ancho c(x + 1) multiplica por c lo que cubre cada tramo de largo.
  // Cambia: c, el ancho cx + c. · Permanece: el pedido y lo que queda aparte (1 cuadradito). · Progresa: el largo, que
  // se divide entre c. · Se reserva: un divisor con fracción (la predicción: 2x − 1, con x = 1/2). · Debe verse: más
  // ancho, más corto; lo que sobra no cambia.
  // Errores: PO3 se queda con el cociente falso · PO4 divide también el resto entre c · PO2 usa b/c en vez de −b/c ·
  // PO8 evalúa con el signo cambiado · PO27 da el término independiente · TAL-RESTO-EN-Q mete el resto en el cociente ·
  // TAL-K-MULT multiplica por c · TAL-K-DOBLE divide dos veces entre c · TAL-EVAL-COEF evalúa en el coeficiente del
  // divisor y no en el número que lo anula (trampa de San Marcos 2025-II).
  const PED4 = [6, 6, 1];
  const pasadizo4 = (c, extra) => RP(Object.assign({ objeto: 'pasadizo', ancho: [c, c], largo: [6 / c, 0], pedido: PED4, tope: [6, 0], topeAncho: [6, 6] }, extra));
  const DK = {
    falso: 'Para dividir entre cx + b: Ruffini con x = −b/c da el cociente falso q′',
    cociente: 'Cociente: q = q′ ÷ c. Resto: la última casilla, sin dividir',
    casilla: 'Cada casilla nueva de abajo: el coeficiente de arriba más a por la casilla anterior',
  };
  const fr = (num, den) => { const g = (function m(u, w) { return w ? m(w, u % w) : Math.abs(u); })(num, den) || 1; let n = num / g, dd = den / g; if (dd < 0) { n = -n; dd = -dd; } return dd === 1 ? f(n) : `${n < 0 ? '−' : ''}${Math.abs(n)}/${dd}`; };
  const divK = (c, b) => poli([c, b]);
  // Un caso «cx + b»: c de 2 a 3, x₀ = −b/c entero o fracción, cociente Qc entero y resto Rr.
  function casoK(r, entero) {
    const c = r.uno([2, 3]); let b;
    do { b = r.noCero(-6, 6); } while (entero ? b % c !== 0 : b % c === 0);
    const Qc = [r.noCero(-3, 3), r.ent(-4, 4), r.ent(-4, 4)], Rr = r.noCero(-6, 6);
    const D = sumar(multiplicar([c, b], Qc), [Rr]);
    return { c, b, Qc, Rr, D, x0: fr(-b, c), falso: Qc.map(v => v * c) };
  }
  // Ahora tú 1: el cociente.
  function casoCocienteK(r) {
    const k = casoK(r, r() < 0.6);
    return {
      pregunta: ['¿Cuál es el cociente de dividir ', poli(k.D), ' entre ', DV(divK(k.c, k.b)), '?'],
      datos: [DK.falso, DK.cociente, DK.casilla],
      opciones: ops([
        { id: 'c', texto: poli(k.Qc), correcta: true },
        { id: 'falso', texto: poli(k.falso), error: 'PO3', siFuera: `Bien la tabla con x = ${k.x0}. Pero ese es el cociente falso: falta dividirlo entre ${k.c}.` },
        { id: 'mult', texto: poli(k.falso.map(v => v * k.c)), error: 'TAL-K-MULT', siFuera: `Bien la tabla. Pero el divisor es ${k.c} veces más grande: el cociente se divide entre ${k.c}, no se multiplica.` },
        { id: 'resto', texto: poli(sumar(k.Qc, [k.Rr])), error: 'TAL-RESTO-EN-Q', siFuera: `Bien el cociente. Pero la última casilla, ${f(k.Rr)}, es el resto: no se suma al cociente.` },
      ]),
      solucion: { texto: `Ruffini con x = ${k.x0} da el cociente falso; se divide entre ${k.c}.`, ecuacion: [q_, ' = (', QC(poli(k.falso)), ') ÷ ', NA(k.c), ' = ', QC(poli(k.Qc))] },
    };
  }
  // Ahora tú 2: el resto.
  function casoRestoK(r) {
    const k = casoK(r, false);
    const enB = evaluar(k.D, -k.b), enC = evaluar(k.D, k.c);
    return {
      pregunta: ['¿Cuál es el resto de dividir ', poli(k.D), ' entre ', DV(divK(k.c, k.b)), '?'],
      datos: [DK.falso, DK.cociente, DK.casilla],
      opciones: ops([
        { id: 'c', texto: f(k.Rr), correcta: true },
        { id: 'div', texto: fr(k.Rr, k.c), error: 'PO4', siFuera: `Bien la última casilla, ${f(k.Rr)}. Pero el resto no se divide entre ${k.c}: solo el cociente.` },
        { id: 'coef', texto: Math.abs(enC) > 999 ? null : f(enC), error: 'TAL-EVAL-COEF', siFuera: `Bien la idea de evaluar. Pero se evalúa en x = ${k.x0}, que anula al divisor, no en ${k.c}.` },
        { id: 'indep', texto: f(k.D[3]), error: 'PO27', siFuera: 'Bien que el resto es un número. Pero es la última casilla de abajo, no el último coeficiente de D.' },
        { id: 'b', texto: Math.abs(enB) > 999 ? null : f(enB), error: 'TAL-EVAL-COEF', siFuera: `Bien la idea de evaluar. Pero en x = ${k.x0}, no en ${f(-k.b)}.` },
      ]),
      solucion: { texto: `Ruffini con x = ${k.x0}; la última casilla es el resto, sin dividir.`, ecuacion: [r_, ' = ', RS(f(k.Rr))] },
    };
  }
  // Ahora tú 3: la suma de los coeficientes del cociente.
  function casoSumaK(r) {
    const k = casoK(r, r() < 0.5), s = k.Qc.reduce((u, w) => u + w, 0);
    if (s === 0) return null;
    return {
      pregunta: ['Al dividir ', poli(k.D), ' entre ', DV(divK(k.c, k.b)), ', ¿cuánto suman los coeficientes del cociente?'],
      datos: [DK.falso, DK.cociente, DK.casilla],
      opciones: ops([
        { id: 'c', texto: f(s), correcta: true },
        { id: 'falso', texto: f(s * k.c), error: 'PO3', siFuera: `Bien la suma de la tabla. Pero es la del cociente falso: falta dividirla entre ${k.c}.` },
        { id: 'resto', texto: f(s + k.Rr), error: 'TAL-RESTO-EN-Q', siFuera: `Bien los coeficientes del cociente. Pero el resto, ${f(k.Rr)}, no es parte del cociente.` },
        { id: 'doble', texto: fr(s, k.c), error: 'TAL-K-DOBLE', siFuera: `Bien dividir entre ${k.c}. Pero se divide una sola vez, el cociente falso; aquí se dividió dos veces.` },
      ]),
      solucion: { texto: 'Divido el cociente falso entre c y sumo sus coeficientes.', ecuacion: [q_, ' = ', QC(poli(k.Qc)), '   →   ', k.Qc.map(par).join(' + '), ' = ', QC(f(s))] },
    };
  }
  // Ahora tú 4 (nivel examen): el cociente con x = −b/c en fracción y D de grado 4.
  function casoCuartoK(r) {
    const c = 2, b = r.uno([-1, 1]);
    const Qc = [r.noCero(-3, 3), r.ent(-3, 3), r.ent(-3, 3), r.ent(-4, 4)], Rr = r.noCero(-5, 5);
    const D = sumar(multiplicar([c, b], Qc), [Rr]);
    if (D[0] === 0 || Qc[3] === 0) return null;
    return {
      pregunta: ['¿Cuál es el cociente de dividir ', poli(D), ' entre ', DV(divK(c, b)), '?'],
      datos: [DK.falso, DK.cociente, DK.casilla],
      opciones: ops([
        { id: 'c', texto: poli(Qc), correcta: true },
        { id: 'falso', texto: poli(Qc.map(v => v * c)), error: 'PO3', siFuera: `Bien la tabla con x = ${fr(-b, c)}. Pero falta dividir el cociente falso entre 2.` },
        { id: 'resto', texto: poli(sumar(Qc, [Rr])), error: 'TAL-RESTO-EN-Q', siFuera: `Bien el cociente. Pero el ${f(Rr)} de la última casilla es el resto.` },
        { id: 'signo', texto: poli(Qc.map((v, i) => (i % 2 ? -v : v))), error: 'PO2', siFuera: `Bien la idea. Pero ${divK(c, b)} se anula en x = ${fr(-b, c)}, no en ${fr(b, c)}.` },
      ]),
      solucion: { texto: `Ruffini con x = ${fr(-b, c)} y después se divide entre 2.`, ecuacion: [q_, ' = (', QC(poli(Qc.map(v => v * c))), ') ÷ ', NA(2), ' = ', QC(poli(Qc))] },
    };
  }

  // Ejemplos de la idea 4 (cuentas aparte en e6-algebra/scripts/cuentas-ejemplos.py): 3x − 2 → x = 2/3; 6x² + x − 2
  // entre 2x − 1 → 6, 4, 0 → q = 3x + 2; 8x³ − 2x² + 3x + 1 entre 2x − 1 → 8, 2, 4, 3; 4x² + 4x + 1 = (2x + 2) · 2x + 1;
  // 4x² + 8x + 7 entre 2x + 1 → 4, 6, 4; 6x³ − 5x² + 4x − 1 entre 3x − 1 → 6, −3, 3, 0; 6x³ + 7x² + 2x + 4 entre
  // 3x + 2 → 6, 3, 0, 4; 4x⁴ − x² + 2x + 3 entre 2x + 1 → 4, −2, 0, 2, 2; 4x³ − 6x² + 8x − 3 entre 2x − 1 → 4, −4, 6, 0;
  // 6x³ + x² + x + 3 entre 2x + 1 → q = 3x² − x + 1, r = 2; 6x² + 9x + 4 = (3x + 3)(2x + 1) + 1.
  const EJEMPLOS_K = [
    { nivel: 1, titulo: 'El número que anula',
      enunciado: ['¿Qué número va a la izquierda de la tabla de Ruffini para dividir entre ', DV('3x − 2'), '?'],
      datos: ['A la izquierda va el x que anula al divisor'],
      solucion: [{ texto: 'Igualo el divisor a 0 y despejo x.', ecuacion: [DV('3x − 2'), ' = 0   →   3x = 2   →   x = ', NA('2/3')] }],
      respuesta: [NA('2/3')] },
    { nivel: 1, titulo: 'Del cociente falso al cociente',
      enunciado: ['Al dividir 6x² + x − 2 entre ', DV('2x − 1'), ', la tabla de Ruffini con x = 1/2 deja abajo 6, 4 y 0. ¿Cuál es el cociente?'],
      datos: [DK.cociente],
      figura: CU({ objeto: 'cuaderno', tipo: 'ruffini', coefs: ['6', '1', '−2'], a: { t: '1/2', c: 'i' }, medio: ['3', '2'], abajo: [{ t: '6', c: 'f' }, { t: '4', c: 'f' }, { t: '0', c: 'o' }], cabeza: [lineaD([6, 1, -2], [2, -1])] }),
      solucion: [{ texto: 'La tabla da el cociente falso, 6x + 4. Como 2x − 1 = 2(x − 1/2), se divide entre 2.', ecuacion: [q_, ' = (', QC('6x + 4'), ') ÷ ', NA('2'), ' = ', QC('3x + 2')] }],
      respuesta: [q_, ' = ', QC('3x + 2')] },
    { nivel: 1, titulo: 'El resto no se divide',
      enunciado: ['Al dividir 8x³ − 2x² + 3x + 1 entre ', DV('2x − 1'), ', la tabla con x = 1/2 deja abajo 8, 2, 4 y 3. ¿Cuál es el resto?'],
      datos: [DK.cociente],
      solucion: [{ texto: 'La última casilla es el resto y no se divide entre 2: solo el cociente se reparte.', ecuacion: [r_, ' = ', RS('3')] }],
      respuesta: [r_, ' = ', RS('3')] },
    { nivel: 1, titulo: '¿Cuál es mónico?',
      enunciado: ['¿Cuál de estos divisores es mónico: 2x + 1, x − 5 o 3x − 3?'],
      datos: ['Mónico: un polinomio cuyo primer coeficiente es 1'],
      solucion: [{ texto: 'En 2x + 1 y 3x − 3, x va con 2 y con 3. Solo en x − 5 el primer coeficiente es 1.', ecuacion: [DV('x − 5'), ' = 1 · x − 5'] }],
      respuesta: [DV('x − 5')] },
    { nivel: 1, titulo: 'Más ancho, más corto',
      enunciado: ['Rubén acomoda (4x² + 4x + 1) dm² en un pasadizo de ', DV('(2x + 2) dm'), ' de ancho, sin huecos. ¿Cuánto mide el largo y qué queda aparte?'],
      datos: [DD.ident, DD.cubre, DD.mult],
      figura: pasadizo4(2, { pedido: [4, 4, 1], largo: [2, 0], tope: [2, 0], topeAncho: [2, 2], piezas: false, rotuloLargo: '?', sobran: false }),
      solucion: [{ texto: 'El ancho 2x + 2 lleva 2 losetas por tramo de x: con 4 losetas, el largo es 2x. Eso usa 4 tiras; queda 1 cuadradito.', ecuacion: ['(', DV('2x + 2'), ') · ', QC('2x'), ' + ', RS('1'), ' = 4x² + 4x + 1'] }],
      respuesta: ['largo ', QC('2x'), ' dm; queda ', RS('1'), ' dm²'] },
    { nivel: 2, titulo: 'Dividir entre 2x + 1',
      enunciado: ['Divide 4x² + 8x + 7 entre ', DV('2x + 1'), '.'],
      datos: [DK.falso, DK.cociente, DK.casilla],
      figura: CU({ objeto: 'cuaderno', tipo: 'ruffini', coefs: ['4', '8', '7'], a: { t: '−1/2', c: 'i' }, medio: ['', ''], abajo: ['', '', ''], cabeza: [lineaD([4, 8, 7], [2, 1])] }),
      solucion: [
        { texto: '2x + 1 se anula en x = −1/2. La tabla: 4; 8 − 2 = 6; 7 − 3 = 4.', ecuacion: ['abajo: 4,   6,   4'] },
        { texto: 'Cociente falso 4x + 6; entre 2 da el cociente. El 4 del final es el resto.', ecuacion: [q_, ' = ', QC('2x + 3'), ',   ', r_, ' = ', RS('4')] },
      ],
      respuesta: [q_, ' = ', QC('2x + 3'), '; ', r_, ' = ', RS('4')] },
    { nivel: 2, titulo: 'Dividir entre 3x − 1',
      enunciado: ['Divide 6x³ − 5x² + 4x − 1 entre ', DV('3x − 1'), '.'],
      datos: [DK.falso, DK.cociente, DK.casilla],
      solucion: [
        { texto: '3x − 1 se anula en x = 1/3. Cada casilla nueva es la de arriba más un tercio de la anterior.', ecuacion: ['6,   −5 + 2 = −3,   4 − 1 = 3,   −1 + 1 = 0'] },
        { texto: 'Cociente falso 6x² − 3x + 3, entre 3. La división es exacta.', ecuacion: [q_, ' = ', QC('2x² − x + 1'), ',   ', r_, ' = ', RS('0')] },
      ],
      respuesta: [q_, ' = ', QC('2x² − x + 1'), '; ', r_, ' = ', RS('0')] },
    { nivel: 2, titulo: 'Dividir entre 3x + 2',
      enunciado: ['Divide 6x³ + 7x² + 2x + 4 entre ', DV('3x + 2'), '.'],
      datos: [DK.falso, DK.cociente, DK.casilla],
      solucion: [
        { texto: '3x + 2 se anula en x = −2/3. La tabla:', ecuacion: ['6,   7 − 4 = 3,   2 − 2 = 0,   4 − 0 = 4'] },
        { texto: 'Cociente falso 6x² + 3x + 0, entre 3.', ecuacion: [q_, ' = ', QC('2x² + x'), ',   ', r_, ' = ', RS('4')] },
      ],
      respuesta: [q_, ' = ', QC('2x² + x'), '; ', r_, ' = ', RS('4')] },
    { nivel: 2, titulo: 'Grado 4 entre 2x + 1',
      enunciado: ['Divide 4x⁴ − x² + 2x + 3 entre ', DV('2x + 1'), '.'],
      datos: [DK.falso, DK.cociente, DK.casilla, 'Una potencia que falta se escribe con coeficiente 0'],
      solucion: [
        { texto: 'Falta x³: arriba van 4, 0, −1, 2 y 3. Con x = −1/2:', ecuacion: ['4,   −2,   0,   2,   2'] },
        { texto: 'Cociente falso 4x³ − 2x² + 0x + 2, entre 2. El último 2 es el resto.', ecuacion: [q_, ' = ', QC('2x³ − x² + 1'), ',   ', r_, ' = ', RS('2')] },
      ],
      respuesta: [q_, ' = ', QC('2x³ − x² + 1'), '; ', r_, ' = ', RS('2')] },
    { nivel: 2, titulo: 'Comprobar con D = d · q + r',
      enunciado: ['Al dividir 4x² + 8x + 7 entre ', DV('2x + 1'), ' salió ', q_, ' = ', QC('2x + 3'), ' y ', r_, ' = ', RS('4'), '. Compruébalo.'],
      datos: [DD.ident, DD.mult],
      solucion: [
        { texto: 'Multiplico el divisor por el cociente.', ecuacion: ['(', DV('2x + 1'), ')(', QC('2x + 3'), ') = 4x² + 6x + 2x + 3 = 4x² + 8x + 3'] },
        { texto: 'Le sumo el resto. Si el cociente no se hubiera dividido entre 2, saldría el doble.', ecuacion: ['4x² + 8x + 3 + ', RS('4'), ' = 4x² + 8x + 7'] },
      ],
      respuesta: ['Cuadra: d · q + r = 4x² + 8x + 7'] },
    { nivel: 3, titulo: 'Suma de coeficientes del cociente',
      enunciado: ['Al dividir 8x³ − 2x² + 3x + 1 entre ', DV('2x − 1'), ', ¿cuánto suman los coeficientes del cociente?'],
      alternativas: ['14', '17', '7', '10', '7/2'],
      datos: [DK.falso, DK.cociente, DK.casilla],
      solucion: [
        { texto: 'Con x = 1/2 la tabla deja 8, 2, 4 y 3. El cociente falso es 8x² + 2x + 4; entre 2:', ecuacion: [q_, ' = ', QC('4x² + x + 2')] },
        { texto: 'Sumo sus coeficientes.', ecuacion: ['4 + 1 + 2 = ', QC('7')] },
        { texto: ['La ', letra('A'), ' suma el cociente falso: 14. La ', letra('B'), ' le suma además el resto: 17. La ', letra('D'), ' suma el cociente y el resto: 10.'] },
        { texto: ['La ', letra('E'), ' divide dos veces entre 2.'] },
      ],
      respuesta: [letra('C'), ', ', QC('7')] },
    { nivel: 3, titulo: 'El cociente con x = 1/2',
      enunciado: ['¿Cuál es el cociente de dividir 4x³ − 6x² + 8x − 3 entre ', DV('2x − 1'), '?'],
      alternativas: ['2x² − 2x + 3', '4x² − 4x + 6', 'x² − x + 3/2', '2x² − 4x + 6', 'x² − x + 3'],
      datos: [DK.falso, DK.cociente, DK.casilla],
      solucion: [
        { texto: 'Con x = 1/2: 4; −6 + 2 = −4; 8 − 2 = 6; −3 + 3 = 0. La división es exacta.', ecuacion: ['cociente falso: ', QC('4x² − 4x + 6')] },
        { texto: 'Se divide entre 2.', ecuacion: [q_, ' = ', QC('2x² − 2x + 3')] },
        { texto: ['La ', letra('B'), ' deja el cociente falso. La ', letra('C'), ' divide dos veces entre 2. La ', letra('D'), ' usa x = −1/2.'] },
        { texto: ['La ', letra('E'), ' divide entre 2 solo los dos primeros términos.'] },
      ],
      respuesta: [letra('A'), ', ', q_, ' = ', QC('2x² − 2x + 3')] },
    { nivel: 3, titulo: 'El resto con 2x + 1',
      enunciado: ['¿Cuál es el resto de dividir 6x³ + x² + x + 3 entre ', DV('2x + 1'), '?'],
      alternativas: ['1', '3', '9/2', '2', '−3'],
      datos: [DK.falso, DK.cociente, DK.casilla],
      solucion: [
        { texto: '2x + 1 se anula en x = −1/2. La tabla:', ecuacion: ['6,   1 − 3 = −2,   1 + 1 = 2,   3 − 1 = 2'] },
        { texto: 'La última casilla es el resto; no se divide.', ecuacion: [r_, ' = ', RS('2')] },
        { texto: ['La ', letra('A'), ' divide el resto entre 2. La ', letra('B'), ' da el término independiente. La ', letra('C'), ' evalúa en x = 1/2.'] },
        { texto: ['La ', letra('E'), ' evalúa en x = −1, el número del divisor sin dividir entre 2.'] },
      ],
      respuesta: [letra('D'), ', ', r_, ' = ', RS('2')] },
    { nivel: 3, titulo: 'El pasadizo de ancho 3x + 3',
      enunciado: ['Rubén tiene (6x² + 9x + 4) dm² de piezas y un pasadizo de ', DV('(3x + 3) dm'), ' de ancho. Lo arma lo más largo que puede sin huecos. ¿Cuánto mide el largo?'],
      alternativas: ['6x + 3', '2x + 3', 'x + 1', '2x', '2x + 1'],
      datos: [DD.ident, DD.cubre, DD.mult],
      figura: RP({ objeto: 'pasadizo', ancho: [3, 3], largo: [2, 1], piezas: false, rotuloLargo: '?', sobran: false }),
      solucion: [
        { texto: '3x + 3 = 3(x + 1). Ruffini con x = −1 deja 6, 3 y 1: el cociente falso es 6x + 3.', ecuacion: ['(6x + 3) ÷ ', NA('3'), ' = ', QC('2x + 1')] },
        { texto: 'Compruebo: el pasadizo usa 6 losetas, 9 tiras y 3 cuadraditos; queda 1 aparte.', ecuacion: ['(', DV('3x + 3'), ')(', QC('2x + 1'), ') + ', RS('1'), ' = 6x² + 9x + 4'] },
        { texto: ['La ', letra('A'), ' deja el cociente falso. La ', letra('B'), ' pone un tramo por cada tira que pasa de 6. La ', letra('C'), ' divide el ancho entre 3.'] },
        { texto: ['La ', letra('D'), ' usa solo las losetas y olvida el tramo de 1 dm.'] },
      ],
      respuesta: [letra('E'), ', ', QC('(2x + 1) dm')] },
    { nivel: 3, titulo: 'Cociente y resto juntos',
      enunciado: ['Al dividir 4x⁴ − x² + 2x + 3 entre ', DV('2x + 1'), ', ¿cuánto vale la suma de coeficientes del cociente más el resto?'],
      alternativas: ['3', '4', '6', '2', '8'],
      datos: [DK.falso, DK.cociente, DK.casilla, 'Una potencia que falta se escribe con coeficiente 0'],
      solucion: [
        { texto: 'Con x = −1/2 la tabla deja 4, −2, 0, 2 y 2. El cociente es (4x³ − 2x² + 2) ÷ 2 y el resto, 2.', ecuacion: [q_, ' = ', QC('2x³ − x² + 1'), ',   ', r_, ' = ', RS('2')] },
        { texto: 'Sumo los coeficientes del cociente y le agrego el resto.', ecuacion: ['(2 − 1 + 1) + 2 = 4'] },
        { texto: ['La ', letra('A'), ' divide también el resto: 2 + 1. La ', letra('C'), ' usa el cociente falso: 4 + 2. La ', letra('D'), ' olvida el resto.'] },
        { texto: ['La ', letra('E'), ' suma los coeficientes de D: 4 − 1 + 2 + 3.'] },
      ],
      respuesta: [letra('B'), ', 4'] },
  ];

  const divisorK = {
    id: 'divisor-k',
    titulo: 'Divisor de la forma cx + b',
    pregunta: '¿Qué cambia si el divisor empieza con 2x o 3x?',
    temas: ['Métodos de Horner y Ruffini', 'Algoritmo de la división'],
    pieza: 'alg-reparto',
    aprendizaje: 'Para dividir entre cx + b se usa Ruffini con x = −b/c, y el cociente que sale se divide entre c; el resto no cambia.',
    actividad: 'Ensanchar el pasadizo y ver qué le pasa al largo y a lo que queda.',
    // Lee: el mismo pedido en pasadizos más anchos, el número que anula a cx + b y qué mirar. No dice qué se hace con
    // el cociente de la tabla (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Más ancho, más corto', texto: 'Rubén tiene (6x² + 6x + 1) dm² de piezas. Puede armar un pasadizo de (x + 1) dm de ancho, o uno del doble de ancho, (2x + 2) dm, o del triple.',
          pieza: 'alg-reparto', dibujo: pasadizo4(6) },
        { titulo: 'El número de la tabla', texto: 'La tabla de Ruffini usa el x que anula al divisor. 2x − 1 vale 0 con x = 1/2, porque 2 · 1/2 − 1 = 0. 2x + 2 vale 0 con x = −1.',
          ecuacion: [DV('2x − 1'), ' = 0   →   x = ', NA('1/2')] },
        { titulo: 'Mónico', texto: 'x − 3 es mónico: su primer coeficiente es 1. 2x − 1 no lo es: su primer coeficiente es 2.' },
        { titulo: 'Qué mirar al jugar', texto: 'Ensancha el pasadizo. Mira qué le pasa al largo y qué le pasa a lo que queda aparte.' },
      ],
    },
    ejemplos: EJEMPLOS_K,
    juega: {
      pieza: 'alg-reparto',
      consigna: 'El mismo pedido, (6x² + 6x + 1) dm², ahora en pasadizos más anchos.',
      mision: {
        texto: 'Elige el ancho para que el pasadizo mida 3x dm de largo.',
        logrado: v => v.c === 2,
        bien: 'Listo: con (2x + 2) dm de ancho, el largo es 3x. El cuadradito sigue aparte.',
      },
      voz: 'Ensancha y mira el largo.',
      leyenda: [
        { s: 'x', t: 'lado de la loseta, en dm' },
        { s: DV('(x + 1) dm'), t: 'ancho del pasadizo: el divisor' },
        { s: QC('6x dm'), t: 'largo del pasadizo: el cociente' },
        { s: RS('Sobran'), t: 'lo que queda aparte: el resto' },
      ],
      controles: [{ id: 'c', etiqueta: 'Ancho del pasadizo', color: 'c-i', opciones: [1, 2, 3, 6].map(c => ({ valor: c, texto: `${divK(c, c)} dm` })) }],
      dibujo: v => pasadizo4(v.c),
      lectura: v => ['(', DV(divK(v.c, v.c)), ') · ', QC(termino(6 / v.c, 1)), ' + ', RS('1'), ' = 6x² + 6x + 1'],
      minimo: 3,
    },
    predice: {
      pregunta: ['Se divide 4x² − 2x + 5 entre ', DV('2x − 1'), '. La tabla de Ruffini con x = 1/2 deja abajo 4, 0 y 5. ¿Cuál es el cociente ', q_, '?'],
      datos: ['2x − 1 vale 0 con x = 1/2'],
      voz: 'Piensa en qué divisor usó la tabla.',
      opciones: [
        { id: 'c', texto: '2x', correcta: true },
        { id: 'sin-k', texto: '4x', error: 'PO3', siFuera: 'Bien leída la tabla: 4x sería el cociente entre x − 1/2. Pero 2x − 1 es el doble.' },
        { id: 'con-resto', texto: '2x + 5', error: 'TAL-RESTO-EN-Q', siFuera: 'Bien el 2x. Pero el 5 de la última casilla es el resto: no va en el cociente.' },
        { id: 'por-k', texto: '8x', error: 'TAL-K-MULT', siFuera: 'Bien que el 2 importa. Pero con un divisor el doble de grande, el cociente es la mitad.' },
      ],
      dibujo: CU({ objeto: 'cuaderno', tipo: 'ruffini', coefs: ['4', '−2', '5'], a: { t: '1/2', c: 'i' }, medio: ['2', '0'], abajo: [{ t: '4', c: 'f' }, { t: '0', c: 'f' }, { t: '5', c: 'o' }], cabeza: [lineaD([4, -2, 5], [2, -1])], pie: [[['q = ?', null, 700]]] }),
      revelar: CU({ objeto: 'cuaderno', tipo: 'ruffini', coefs: ['4', '−2', '5'], a: { t: '1/2', c: 'i' }, medio: ['2', '0'], abajo: [{ t: '4', c: 'f' }, { t: '0', c: 'f' }, { t: '5', c: 'o' }], cabeza: [lineaD([4, -2, 5], [2, -1])], pie: [[['q = 4x ÷ 2 = ', null, 400], ['2x', 'f', 700], ['    r = ', null, 400], ['5', 'o', 700]]] }),
      coincide: 'Coincide: (x − 1/2) · 4x = (2x − 1) · 2x. El resto sigue siendo 5.',
      noCoincide: 'Revisemos: la tabla dividió entre x − 1/2, y 2x − 1 = 2(x − 1/2) es el doble.',
    },
    mira: {
      pieza: 'alg-reparto',
      datos: { objeto: 'cuaderno', tipo: 'ruffini', coefs: ['6', '6', '1'], a: { t: '−1', c: 'i' }, medio: ['−6', '0'], abajo: [{ t: '6', c: 'f' }, { t: '0', c: 'f' }, { t: '1', c: 'o' }], cabeza: [lineaD(PED4, [2, 2])],
        pasos: [{ pie: [] }, { pie: [[['q′ = ', null, 400], ['6x', 'f', 700]]] }, { pie: [[['2x + 2 = 2(x + 1)', null, 400]]] }, { pie: [[['q = 6x ÷ 2 = ', null, 400], ['3x', 'f', 700]]] }, { pie: [[['q = ', null, 400], ['3x', 'f', 700], ['    r = ', null, 400], ['1', 'o', 700]]] }] },
      voz: 'Yo había comprimido un paso. Abrámoslo.',
      pasos: [
        { estado: { paso: 0 }, texto: '2x + 2 vale 0 con x = −1: la tabla usa −1.', ecuacion: [DV('2x + 2'), ' = 0   →   x = ', NA('−1')] },
        { estado: { paso: 1 }, texto: 'La tabla da 6x y deja 1: es la división entre x + 1.', ecuacion: ['6x² + 6x + 1 = (', DV('x + 1'), ') · ', QC('6x'), ' + ', RS('1')] },
        { estado: { paso: 2 }, texto: 'Pero 2x + 2 es el doble de x + 1.', ecuacion: [DV('2x + 2'), ' = 2(x + 1)'] },
        { estado: { paso: 3 }, texto: 'El 2 pasa al cociente: el cociente falso se divide entre 2.', ecuacion: [q_, ' = ', QC('6x'), ' ÷ ', NA('2'), ' = ', QC('3x')] },
        { estado: { paso: 4 }, texto: 'El resto no se divide: sigue siendo 1.', ecuacion: ['6x² + 6x + 1 = (', DV('2x + 2'), ') · ', QC('3x'), ' + ', RS('1')] },
      ],
    },
    regla: {
      texto: 'Para dividir entre cx + b, la tabla de Ruffini usa x = −b/c y da el cociente falso q′. El cociente es q′ entre c; el resto sale tal cual.',
      ecuacion: ['x = −', NA('b'), '/', NA('c'), SEP, q_, ' = ', { frac: [QC('q′'), NA('c')] }, SEP, r_, ' = la última casilla'],
      condicion: 'c es distinto de 0.',
      voz: 'cx + b = c(x + b/c): la c pasa al cociente, no al resto.',
      dibujo: CU({ objeto: 'cuaderno', tipo: 'ruffini', coefs: ['6', '6', '1'], a: { t: '−1', c: 'i' }, medio: ['−6', '0'], abajo: [{ t: '6', c: 'f' }, { t: '0', c: 'f' }, { t: '1', c: 'o' }], cabeza: [lineaD(PED4, [2, 2])], pie: [[['q = 6x ÷ 2 = ', null, 400], ['3x', 'f', 700], ['    r = ', null, 400], ['1', 'o', 700]]] }),
    },
    // Así se resuelve: cociente y resto a la vez con x entero. «Ahora tú» pide solo una parte o la suma.
    resuelve: {
      pieza: 'alg-reparto',
      generar(s) {
        const r = azar(s + 900), k = casoK(r, true), x0 = -k.b / k.c, b = ruffini(k.D, x0);
        return {
          enunciado: ['Divide ', poli(k.D), ' entre ', DV(divK(k.c, k.b)), '. ¿Cuáles son el cociente y el resto?'],
          datos: [DK.falso, DK.cociente, DK.casilla],
          dibujo: CU(rufTabla(k.D, x0, { hasta: 0, cabeza: [lineaD(k.D, [k.c, k.b])] })),
          pasos: [
            { tipo: 'pide', texto: ['Piden el cociente ', q_, ' y el resto ', r_, ` de dividir entre ${divK(k.c, k.b)}.`] },
            { tipo: 'datos', texto: `${divK(k.c, k.b)} = ${k.c}(${divisorTxt(x0)}): vale 0 con x = ${f(x0)}, y su primer coeficiente es ${k.c}.` },
            { tipo: 'regla', texto: `La tabla con x = ${f(x0)} divide entre ${divisorTxt(x0)}. Como el divisor es ${k.c} veces eso, su cociente se divide entre ${k.c}; el resto queda igual.` },
            { tipo: 'cuentas', texto: `La tabla deja ${b.map(f).join(', ')}. Divido entre ${k.c} todas las casillas menos la última.`,
              ecuacion: [q_, ' = (', QC(poli(k.falso)), ') ÷ ', NA(k.c), ' = ', QC(poli(k.Qc)), ',   ', r_, ' = ', RS(f(k.Rr))], dibujo: CU(rufTabla(k.D, x0, { cabeza: [lineaD(k.D, [k.c, k.b])] })) },
            { tipo: 'sentido', texto: 'Compruebo: el divisor por el cociente, más el resto, vuelve a dar el dividendo.',
              ecuacion: ['(', DV(divK(k.c, k.b)), ')(', QC(poli(k.Qc)), ') ', RS(conSigno(k.Rr)), ' = ', poli(k.D)] },
          ],
          respuesta: [q_, ' = ', QC(poli(k.Qc)), '; ', r_, ' = ', RS(f(k.Rr))],
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-reparto',
      voz: 'Primero el x que anula al divisor; después, entre c.',
      generar(sem) {
        const r = azar(sem + 71), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoCocienteK, r);
        if (tipo === 1) return conCuatro(casoRestoK, r);
        if (tipo === 2) return conCuatro(casoSumaK, r);
        return conCuatro(casoCuartoK, r);
      },
    },
  };

  // ---------- Idea 5: teorema del resto ----------
  // Objeto: el piso de Rubén de (x² + x + 1) dm², visto como un rectángulo de (x − 2) por (x + 3) dm más 7 cuadraditos
  // sueltos (alg-reparto, 'angosto'). Al achicar la loseta, el rectángulo se angosta; con x = 2 desaparece.
  // Cambia: el lado x de la loseta (de 2 a 6 dm, de medio en medio). · Permanece: D = (x − 2)(x + 3) + 7. · Progresa:
  // el ancho x − 2, hasta 0. · Se reserva: un divisor con un número negativo y potencias altas (la predicción:
  // x⁵ − 3x² + 7 entre x + 1). · Debe verse: en x = a el divisor vale 0 y de D solo queda el resto.
  // Errores: PO8 evalúa con el signo cambiado · PO27 da el término independiente · PO7 da la suma de coeficientes ·
  // PO15 lee una potencia par de un negativo como negativa · TAL-IMPAR-POS lee una impar como positiva · PO17 plantea
  // D(−a) = 0 · AL16 despeja con el signo cambiado · TAL-EVAL-COEF evalúa en el coeficiente del divisor (trampa de San
  // Marcos 2025-II) · TAL-RESTO-SUMA suma los dos restos · TAL-RESTO-CRUZA cruza m y n · TAL-SIGNO-RAIZ usa los números
  // que anulan al divisor con el signo cambiado.
  const DT = {
    teo: 'Teorema del resto: el resto de dividir D(x) entre x − a es D(a)',
    exacta: 'División exacta: el resto es 0',
    k: 'Con cx + b, se evalúa en el x que lo anula: x = −b/c',
    neg: 'Con un número negativo: (−2)² = 4 y (−2)³ = −8',
    cuad: 'Si d se anula en x = a, entonces D(a) = r(a)',
    grado1: 'Con d de grado 2, el resto es de grado 1 a lo más: r(x) = mx + n',
  };
  const PISO = { a: 2, q: [1, 3], r: 7, xMax: 6 };
  const piso = (x, extra) => RP(Object.assign({ objeto: 'angosto', x }, PISO, extra));
  const D5 = x => x * x + x + 1;
  // La suma que se ve al evaluar: «2 · (−8) + 3 · 4 − 1».
  function evalTxt(cs, x) {
    const n = cs.length - 1, out = [];
    cs.forEach((c, k) => { if (!c) return; const e = n - k, p = e === 0 ? '' : e === 1 ? par(x) : `${par(x)}${sup(e)}`; const t = Math.abs(c) === 1 && p ? p : `${f(Math.abs(c))}${p ? ' · ' + p : ''}`; out.push([c < 0, t]); });
    return out.map(([neg, t], i) => (i ? (neg ? ' − ' : ' + ') : neg ? '−' : '') + t).join('');
  }
  // Ahora tú 1: el resto entre x − a.
  function casoResto(r) {
    const cs = [r.noCero(-2, 3), r.ent(-4, 4), r.ent(-4, 4), r.noCero(-6, 6)], x = r.noCero(-3, 3);
    return {
      pregunta: ['¿Cuál es el resto de dividir ', poli(cs), ' entre ', DV(divisorTxt(x)), '?'],
      datos: x < 0 ? [DT.teo, `${divisorTxt(x)} = x − (${f(x)})`] : [DT.teo],
      opciones: ops([
        { id: 'c', texto: f(evaluar(cs, x)), correcta: true },
        { id: 'signo', texto: f(evaluar(cs, -x)), error: 'PO8', siFuera: `Bien la idea de evaluar. Pero ${divisorTxt(x)} vale 0 con x = ${f(x)}, no con ${f(-x)}.` },
        { id: 'indep', texto: f(cs[3]), error: 'PO27', siFuera: 'Bien que el resto es un número. Pero el término independiente sería el resto entre x.' },
        { id: 'suma', texto: f(evaluar(cs, 1)), error: 'PO7', siFuera: 'Esa es la suma de coeficientes, D(1): sería el resto entre x − 1.' },
      ]),
      solucion: { texto: `El resto es D(${f(x)}).`, ecuacion: [r_, ` = D(`, NA(f(x)), `) = ${evalTxt(cs, x)} = `, RS(f(evaluar(cs, x)))] },
    };
  }
  // Ahora tú 2: potencias altas de un número negativo.
  function casoRestoNeg(r) {
    // Con potencias pares e impares a la vez (si no, los errores de signo coinciden con la correcta).
    const n = r.ent(4, 7), m = n - 1 - 2 * r.ent(0, Math.floor((n - 3) / 2)), A = r.noCero(-3, 3), B = r.noCero(-5, 5), C = r.noCero(-6, 6);
    const cs = Array(n + 1).fill(0); cs[0] = 1; cs[n - m] = A; cs[n - 1] = cs[n - 1] + B; cs[n] = C;
    const x = -r.ent(1, 2), bien = evaluar(cs, x);
    const conSignoMal = (cond) => cs.reduce((acc, c, k) => { const e = n - k; if (!c) return acc; const v = cond(e) ? -(Math.abs(x) ** e) : x ** e; return acc + c * v; }, 0);
    // (Leer una potencia impar como positiva da D(−x), el mismo valor de PO8: no va como opción aparte.)
    const par0 = conSignoMal(e => e % 2 === 0 && e > 0);
    return {
      pregunta: ['¿Cuál es el resto de dividir ', poli(cs), ' entre ', DV(divisorTxt(x)), '?'],
      datos: [DT.teo, `${divisorTxt(x)} = x − (${f(x)})`, DT.neg],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'par', texto: f(par0), error: 'PO15', siFuera: `Bien el reemplazo por ${f(x)}. Pero una potencia par de un negativo es positiva.` },
        { id: 'indep', texto: f(C), error: 'PO27', siFuera: 'Bien que el resto es un número. Pero el término independiente sería el resto entre x.' },
        { id: 'signo', texto: f(evaluar(cs, -x)), error: 'PO8', siFuera: `Bien la idea de evaluar. Pero ${divisorTxt(x)} vale 0 con x = ${f(x)}.` },
      ]),
      solucion: { texto: `El resto es D(${f(x)}), con cada potencia con su signo.`, ecuacion: [r_, ' = D(', NA(f(x)), `) = `, RS(f(bien))] },
    };
  }
  // Ahora tú 3: el resto entre cx + b (con la trampa de San Marcos 2025-II: evaluar en c).
  function casoRestoCB(r) {
    const c = 2, b = r.uno([-1, 1]), Qc = [r.noCero(-3, 3), r.ent(-3, 3), r.ent(-4, 4)], Rr = r.noCero(-6, 6);
    const D = sumar(multiplicar([c, b], Qc), [Rr]);
    return {
      pregunta: ['¿Cuál es el resto de dividir ', poli(D), ' entre ', DV(poli([c, b])), '?'],
      datos: [DT.teo, DT.k],
      opciones: ops([
        { id: 'c', texto: f(Rr), correcta: true },
        { id: 'coef', texto: Math.abs(evaluar(D, c)) > 999 ? null : f(evaluar(D, c)), error: 'TAL-EVAL-COEF', siFuera: `Bien la idea de evaluar. Pero en el x que anula al divisor, ${fr(-b, c)}, no en su coeficiente ${c}.` },
        { id: 'signo', texto: fr(evaluar(D.map((v, i) => v * 2 ** i), b) / 1, 2 ** (D.length - 1)), error: 'PO8', siFuera: `Bien la idea de evaluar. Pero ${poli([c, b])} vale 0 con x = ${fr(-b, c)}, no con ${fr(b, c)}.` },
        { id: 'indep', texto: f(D[3]), error: 'PO27', siFuera: 'Bien que el resto es un número. Pero el término independiente sería el resto entre x.' },
      ]),
      solucion: { texto: `${poli([c, b])} vale 0 con x = ${fr(-b, c)}: el resto es D(${fr(-b, c)}).`, ecuacion: [r_, ' = D(', NA(fr(-b, c)), ') = ', RS(f(Rr))] },
    };
  }
  // Ahora tú 4: divisibilidad, el m que hace exacta la división.
  function casoDivisibleM(r) {
    let x, m, c, d;
    do { x = r.noCero(-3, 3); m = r.noCero(-4, 4); c = r.ent(-5, 5); d = -(x ** 3 + m * x * x + c * x); } while (d === 0 || d === m || d === -m || Math.abs(d) > 40);
    const mMal = (-((-x) ** 3) - c * (-x) - d) / (x * x);
    const txt = `x³ + mx²${c === 0 ? '' : ` ${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}x`} ${d < 0 ? '−' : '+'} ${Math.abs(d)}`;
    return {
      pregunta: ['¿Qué valor de m hace que ', txt, ' sea divisible entre ', DV(divisorTxt(x)), '?'],
      datos: [DT.teo, 'Divisible: la división es exacta, con resto 0'],
      opciones: ops([
        { id: 'c', texto: f(m), correcta: true },
        { id: 'signo', texto: Number.isInteger(mMal) ? f(mMal) : fr(-((-x) ** 3) - c * (-x) - d, x * x), error: 'PO17', siFuera: `Bien plantear resto 0. Pero ${divisorTxt(x)} vale 0 con x = ${f(x)}: D(${f(x)}) = 0.` },
        { id: 'despeje', texto: f(-m), error: 'AL16', siFuera: `Bien la ecuación D(${f(x)}) = 0. Pero al despejar m, el número pasa con el signo cambiado.` },
        { id: 'indep', texto: f(d), error: 'PO27', siFuera: 'Bien leído el término independiente. Pero piden m, que sale de D(a) = 0.' },
      ]),
      solucion: { texto: `Divisible: D(${f(x)}) = 0.`, ecuacion: [`${f(x ** 3)} + ${f(x * x)}m ${c * x + d < 0 ? '−' : '+'} ${Math.abs(c * x + d)} = 0   →   m = `, f(m)] },
    };
  }
  // Ahora tú 5 (nivel examen, como San Marcos 2024-I): el resto entre (x − a)(x − b) a partir de los dos restos.
  function casoRestoDos(r) {
    let a, b, m, n;
    do { a = r.noCero(-3, 3); b = r.noCero(-3, 3); m = r.noCero(-4, 4); n = r.noCero(-5, 5); } while (a === b || a === -b || m === n || m === -n);
    const Ra = m * a + n, Rb = m * b + n;
    // Con los números del divisor cambiados de signo (−a, −b): otro sistema.
    const ms = (Ra - Rb) / (-a + b), ns = Ra - ms * -a;
    const da = `(${divisorTxt(a)})(${divisorTxt(b)})`;
    return {
      pregunta: ['P(x) deja resto ', RS(f(Ra)), ' al dividirlo entre ', DV(divisorTxt(a)), ' y resto ', RS(f(Rb)), ' entre ', DV(divisorTxt(b)), '. ¿Cuál es el resto de dividirlo entre ', DV(da), '?'],
      datos: [DT.teo, DT.cuad, DT.grado1],
      opciones: ops([
        { id: 'c', texto: poli([m, n]), correcta: true },
        { id: 'suma', texto: f(Ra + Rb), error: 'TAL-RESTO-SUMA', siFuera: 'Bien los dos restos. Pero con d de grado 2 el resto es mx + n, no un número.' },
        { id: 'cruza', texto: poli([n, m]), error: 'TAL-RESTO-CRUZA', siFuera: `Bien m = ${f(m)} y n = ${f(n)}. Pero m va con x y n es el número suelto.` },
        { id: 'signo', texto: Number.isInteger(ms) && Number.isInteger(ns) ? poli([ms, ns]) : null, error: 'TAL-SIGNO-RAIZ', siFuera: `Bien el sistema. Pero ${divisorTxt(a)} vale 0 con x = ${f(a)}, no con ${f(-a)}.` },
        { id: 'prod', texto: f(Ra * Rb), error: 'TAL-RESTO-SUMA', siFuera: 'Bien los dos restos. Pero no se multiplican: el resto es mx + n, con r(a) y r(b).' },
      ]),
      solucion: { texto: `r(x) = mx + n cumple r(${f(a)}) = ${f(Ra)} y r(${f(b)}) = ${f(Rb)}.`, ecuacion: [`${termino(a, 0) === '1' ? '' : termino(a, 0) === '−1' ? '−' : f(a)}m + n = ${f(Ra)},   ${termino(b, 0) === '1' ? '' : termino(b, 0) === '−1' ? '−' : f(b)}m + n = ${f(Rb)}   →   `, r_, ' = ', RS(poli([m, n]))] },
    };
  }

  // Ejemplos de la idea 5 (cuentas aparte en e6-algebra/scripts/cuentas-ejemplos.py): D(2) de x³ − 2x² + 5 es 5;
  // D(−1) de x⁴ + 3x − 2 es −4; D(3) de x² − 5x + 6 es 0; 4x³ − x + 7 entre x deja 7; D(1/2) de 8x³ − 4x + 5 es 4;
  // x³ + mx − 6 divisible entre x − 2 da m = −1; D(−2) de x⁵ + 2x⁴ − x + 3 es 5; D(1) de x¹⁰ − 3x⁷ + 2 es 0; D(4) de
  // x² + x + 1 es 21; restos 5 y −4 entre x − 1 y x + 2 dan r = 3x + 2; V(5) = 5 · 20 · 10 = 1000; x³ + mx² + nx − 6
  // divisible entre x − 1 y x + 2 da m = 4, n = 1; x² + mx + n con restos 3 y 7 da x² − 2x + 4 y P(2) = 4;
  // D(−1) de x²⁰ − 3x¹⁵ + 5x − 2 es −3.
  const EJEMPLOS_RESTO = [
    { nivel: 1, titulo: 'Resto entre x − 2',
      enunciado: ['¿Cuál es el resto de dividir x³ − 2x² + 5 entre ', DV('x − 2'), '?'],
      datos: [DT.teo],
      solucion: [{ texto: 'x − 2 vale 0 con x = 2. Evalúo D en 2.', ecuacion: ['D(', NA('2'), ') = 8 − 8 + 5 = ', RS('5')] }],
      respuesta: [r_, ' = ', RS('5')] },
    { nivel: 1, titulo: 'Resto entre x + 1',
      enunciado: ['¿Cuál es el resto de dividir x⁴ + 3x − 2 entre ', DV('x + 1'), '?'],
      datos: [DT.teo, 'x + 1 = x − (−1)', '(−1)⁴ = 1'],
      solucion: [{ texto: 'x + 1 vale 0 con x = −1. Evalúo D en −1.', ecuacion: ['D(', NA('−1'), ') = 1 − 3 − 2 = ', RS('−4')] }],
      respuesta: [r_, ' = ', RS('−4')] },
    { nivel: 1, titulo: '¿Es divisible?',
      enunciado: ['¿Es x² − 5x + 6 divisible entre ', DV('x − 3'), '?'],
      datos: [DT.teo, 'Divisible: la división es exacta, con resto 0'],
      solucion: [{ texto: 'El resto es D(3). Si vale 0, la división es exacta.', ecuacion: ['D(', NA('3'), ') = 9 − 15 + 6 = ', RS('0')] }],
      respuesta: ['Sí: el resto es ', RS('0')] },
    { nivel: 1, titulo: 'Resto entre x',
      enunciado: ['¿Cuál es el resto de dividir 4x³ − x + 7 entre ', DV('x'), '?'],
      datos: [DT.teo],
      solucion: [{ texto: 'x = x − 0: se evalúa en 0, y todos los términos con x se anulan.', ecuacion: ['D(', NA('0'), ') = ', RS('7')] }],
      respuesta: [r_, ' = ', RS('7')] },
    { nivel: 1, titulo: 'Dónde se evalúa',
      enunciado: ['Para hallar el resto de dividir un polinomio entre ', DV('x + 5'), ', ¿en qué número se evalúa?'],
      datos: [DT.teo],
      solucion: [{ texto: 'x + 5 = x − (−5): vale 0 con x = −5.', ecuacion: [DV('x + 5'), ' = 0   →   x = ', NA('−5')] }],
      respuesta: ['En ', NA('−5')] },
    { nivel: 2, titulo: 'Resto entre 2x − 1',
      enunciado: ['¿Cuál es el resto de dividir 8x³ − 4x + 5 entre ', DV('2x − 1'), '?'],
      datos: [DT.teo, DT.k],
      solucion: [
        { texto: '2x − 1 vale 0 con x = 1/2.', ecuacion: [DV('2x − 1'), ' = 0   →   x = ', NA('1/2')] },
        { texto: 'Evalúo D en 1/2: (1/2)³ = 1/8.', ecuacion: ['D(', NA('1/2'), ') = 8 · 1/8 − 4 · 1/2 + 5 = 1 − 2 + 5 = ', RS('4')] },
      ],
      respuesta: [r_, ' = ', RS('4')] },
    { nivel: 2, titulo: 'Un m para que sea exacta',
      enunciado: ['¿Qué valor de m hace que x³ + mx − 6 sea divisible entre ', DV('x − 2'), '?'],
      datos: [DT.teo, 'Divisible: la división es exacta, con resto 0'],
      solucion: [
        { texto: 'Divisible quiere decir resto 0: D(2) = 0.', ecuacion: ['8 + 2m − 6 = 0'] },
        { texto: 'Despejo m.', ecuacion: ['2m = −2   →   m = −1'] },
      ],
      respuesta: ['m = −1'] },
    { nivel: 2, titulo: 'Potencias de −2',
      enunciado: ['¿Cuál es el resto de dividir x⁵ + 2x⁴ − x + 3 entre ', DV('x + 2'), '?'],
      datos: [DT.teo, '(−2)⁵ = −32 y (−2)⁴ = 16'],
      solucion: [
        { texto: 'x + 2 vale 0 con x = −2. Cada potencia lleva su signo.', ecuacion: ['(−2)⁵ + 2 · (−2)⁴ − (−2) + 3 = −32 + 32 + 2 + 3'] },
        { texto: 'Sumo.', ecuacion: [r_, ' = ', RS('5')] },
      ],
      respuesta: [r_, ' = ', RS('5')] },
    { nivel: 2, titulo: 'Un grado alto',
      enunciado: ['¿Cuál es el resto de dividir x¹⁰ − 3x⁷ + 2 entre ', DV('x − 1'), '?'],
      datos: [DT.teo],
      solucion: [
        { texto: 'Dividir con la tabla pediría once casillas. Con el teorema basta evaluar en 1: toda potencia de 1 vale 1.', ecuacion: ['D(', NA('1'), ') = 1 − 3 + 2 = ', RS('0')] },
        { texto: 'El resto es 0: la división es exacta.' },
      ],
      respuesta: [r_, ' = ', RS('0'), ': exacta'] },
    { nivel: 2, titulo: 'Losetas de 4 dm',
      enunciado: ['El piso de Rubén cubre (x² + x + 1) dm². ¿Cuál es el resto de dividir x² + x + 1 entre ', DV('x − 4'), '?'],
      datos: [DT.teo],
      figura: piso(4, { valores: false, resto: '?' }),
      solucion: [
        { texto: 'El resto es D(4): lo que cubre el piso con losetas de 4 dm.', ecuacion: ['D(', NA('4'), ') = 16 + 4 + 1 = ', RS('21')] },
        { texto: 'Compruebo: x² + x + 1 = (x − 4)(x + 5) + 21, y con x = 4 el primer sumando vale 0.' },
      ],
      respuesta: [r_, ' = ', RS('21')] },
    { nivel: 3, titulo: 'Resto entre dos factores',
      enunciado: ['P(x) deja resto 5 al dividirlo entre ', DV('x − 1'), ' y resto −4 entre ', DV('x + 2'), '. ¿Cuál es el resto de dividirlo entre ', DV('(x − 1)(x + 2)'), '?'],
      alternativas: ['1', '2x + 3', '−3x + 2', '3x + 2', '3x − 2'],
      datos: [DT.teo, DT.cuad, DT.grado1],
      solucion: [
        { texto: 'El divisor tiene grado 2: el resto es r(x) = mx + n.' },
        { texto: 'El divisor vale 0 en 1 y en −2. Así, r(1) = P(1) = 5 y r(−2) = P(−2) = −4.', ecuacion: ['m + n = 5,   −2m + n = −4'] },
        { texto: 'Resto las dos ecuaciones: 3m = 9. Entonces m = 3 y n = 2.', ecuacion: [r_, ' = ', RS('3x + 2')] },
        { texto: ['La ', letra('A'), ' suma los restos. La ', letra('B'), ' cruza m y n. La ', letra('C'), ' usa −1 y 2. La ', letra('E'), ' cambia el signo de n.'] },
      ],
      respuesta: [letra('D'), ', ', r_, ' = ', RS('3x + 2')] },
    { nivel: 3, titulo: 'La caja de cartulina',
      enunciado: ['Una caja sin tapa, hecha con una cartulina de 30 cm por 20 cm, tiene volumen V(x) = x(30 − 2x)(20 − 2x) cm³. ¿Cuál es el resto de dividir V(x) entre ', DV('x − 5'), '?'],
      alternativas: ['−6000', '1000', '600', '0', '1875'],
      datos: [DT.teo, 'x: el lado, en cm, del cuadrado que se corta en cada esquina', 'Volumen de una caja: largo · ancho · alto'],
      fuente: 'Situación del tipo de San Marcos 2021 (pregunta 35), con otros números.',
      solucion: [
        { texto: 'El resto es V(5): el volumen de la caja con cortes de 5 cm.', ecuacion: ['V(', NA('5'), ') = 5 · (30 − 10) · (20 − 10) = 5 · 20 · 10'] },
        { texto: 'Multiplico.', ecuacion: [r_, ' = ', RS('1000')] },
        { texto: ['La ', letra('A'), ' evalúa en −5. La ', letra('C'), ' da el área de la cartulina. La ', letra('D'), ' cree que la división es exacta.'] },
        { texto: ['La ', letra('E'), ' quita 5 cm una sola vez de cada lado: 5 · 25 · 15.'] },
      ],
      respuesta: [letra('B'), ', ', RS('1000')] },
    { nivel: 3, titulo: 'Divisible entre dos binomios',
      enunciado: ['x³ + mx² + nx − 6 es divisible entre ', DV('x − 1'), ' y entre ', DV('x + 2'), '. ¿Cuánto vale m + n?'],
      alternativas: ['6', '−5', '1', '4', '5'],
      datos: [DT.teo, 'Divisible: la división es exacta, con resto 0'],
      solucion: [
        { texto: 'Divisible entre x − 1 quiere decir D(1) = 0. Ahí ya aparece m + n.', ecuacion: ['1 + m + n − 6 = 0   →   m + n = 5'] },
        { texto: 'La otra condición, D(−2) = 0, da 4m − 2n = 14: con ella, m = 4 y n = 1. No hace falta para la suma.' },
        { texto: ['La ', letra('A'), ' olvida el 1 de x³. La ', letra('B'), ' despeja con el signo cambiado. La ', letra('C'), ' da n y la ', letra('D'), ', m.'] },
      ],
      respuesta: [letra('E'), ', m + n = 5'] },
    { nivel: 3, titulo: 'Un polinomio con dos restos',
      enunciado: ['P(x) = x² + mx + n deja resto 3 al dividirlo entre ', DV('x − 1'), ' y resto 7 entre ', DV('x + 1'), '. ¿Cuánto vale P(2)?'],
      alternativas: ['12', '0', '4', '3', '7'],
      datos: [DT.teo, DD.evaluar],
      solucion: [
        { texto: 'Por el teorema del resto, P(1) = 3 y P(−1) = 7.', ecuacion: ['1 + m + n = 3,   1 − m + n = 7'] },
        { texto: 'Sumo las dos: 2 + 2n = 10, n = 4; entonces m = −2. P(x) = x² − 2x + 4.', ecuacion: ['P(2) = 4 − 4 + 4 = 4'] },
        { texto: ['La ', letra('A'), ' toma m = 2. La ', letra('B'), ' olvida el x²: −4 + 4. La ', letra('D'), ' da el resto entre x − 1 y la ', letra('E'), ', el resto entre x + 1.'] },
      ],
      respuesta: [letra('C'), ', P(2) = 4'] },
    { nivel: 3, titulo: 'Potencias altas de −1',
      enunciado: ['¿Cuál es el resto de dividir x²⁰ − 3x¹⁵ + 5x − 2 entre ', DV('x + 1'), '?'],
      alternativas: ['−3', '1', '−9', '−5', '−2'],
      datos: [DT.teo, 'x + 1 = x − (−1)', 'Una potencia par de −1 vale 1; una impar, −1'],
      solucion: [
        { texto: 'Evalúo en −1: (−1)²⁰ = 1 y (−1)¹⁵ = −1.', ecuacion: ['1 − 3 · (−1) + 5 · (−1) − 2 = 1 + 3 − 5 − 2'] },
        { texto: 'Sumo.', ecuacion: [r_, ' = ', RS('−3')] },
        { texto: ['La ', letra('B'), ' evalúa en 1. La ', letra('C'), ' lee (−1)¹⁵ como 1. La ', letra('D'), ' lee (−1)²⁰ como −1.'] },
        { texto: ['La ', letra('E'), ' da el término independiente.'] },
      ],
      respuesta: [letra('A'), ', ', r_, ' = ', RS('−3')] },
  ];

  const resto = {
    id: 'teorema-resto',
    titulo: 'Teorema del resto',
    pregunta: '¿Cómo hallas el resto sin hacer la división?',
    temas: ['Teorema del resto', 'Divisibilidad de polinomios'],
    pieza: 'alg-reparto',
    aprendizaje: 'El resto de dividir D(x) entre x − a es D(a); si vale 0, la división es exacta.',
    actividad: 'Achicar la loseta y ver qué queda del piso.',
    // Lee: el piso visto como rectángulo y resto, para qué sirve un atajo y qué mirar. No dice que el resto es D(a)
    // (la predicción pide un resto).
    lee: {
      tarjetas: [
        { titulo: 'Otra forma del piso', texto: 'El piso de Rubén cubre (x² + x + 1) dm². Se puede ver como un rectángulo de (x − 2) dm por (x + 3) dm, más 7 cuadraditos sueltos.',
          ecuacion: ['x² + x + 1 = (', DV('x − 2'), ')(', QC('x + 3'), ') + ', RS('7')], pieza: 'alg-reparto', dibujo: piso(5) },
        { titulo: 'Solo el resto', texto: 'Dividir un polinomio de grado 5 con la tabla de Ruffini pide escribir seis coeficientes y hacer cinco cuentas. En el examen, muchas veces solo preguntan el resto.' },
        { titulo: 'Qué mirar al jugar', texto: 'Achica la loseta. Mira el ancho x − 2 del rectángulo y cuánto cubre todo el piso mientras se angosta.' },
      ],
    },
    ejemplos: EJEMPLOS_RESTO,
    juega: {
      pieza: 'alg-reparto',
      consigna: 'El piso cubre (x² + x + 1) dm²: un rectángulo de (x − 2) por (x + 3) dm y 7 cuadraditos.',
      mision: {
        texto: 'Achica la loseta hasta que el rectángulo desaparezca.',
        logrado: v => v.x === 2,
        bien: 'Listo: con x = 2 el ancho vale 0 y el piso cubre solo 7 dm².',
      },
      voz: 'Mira el ancho del rectángulo mientras achicas.',
      leyenda: [
        { s: 'x', t: 'lado de la loseta, en dm' },
        { s: DV('x − 2'), t: 'ancho del rectángulo: el divisor' },
        { s: QC('x + 3'), t: 'largo del rectángulo: el cociente' },
        { s: RS('7 dm²'), t: 'los cuadraditos sueltos: el resto' },
      ],
      controles: [{ id: 'x', etiqueta: 'Lado de la loseta, x (dm)', min: 2, max: 6, paso: 0.5, inicio: 5, decimales: 1 }],
      dibujo: v => piso(v.x),
      lectura: v => ['D(', f(v.x), ') = (', f(v.x), ' − ', NA('2'), ') · ', QC(f(v.x + 3)), ' + ', RS('7'), ` = ${f(D5(v.x))} dm²`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuál es el resto de dividir x⁵ − 3x² + 7 entre ', DV('x + 1'), '?'],
      datos: ['x + 1 = x − (−1)'],
      voz: 'Piensa en qué x se hace 0 el divisor.',
      opciones: [
        { id: 'c', texto: '3', correcta: true },
        { id: 'signo', texto: '5', error: 'PO8', siFuera: 'Bien la idea de evaluar. Pero 5 es D(1): x + 1 vale 0 con x = −1.' },
        { id: 'indep', texto: '7', error: 'PO27', siFuera: 'Bien que el resto es un número. Pero 7 sería el resto de dividir entre x.' },
        { id: 'par', texto: '9', error: 'PO15', siFuera: 'Bien evaluar en −1. Pero (−1)² = 1, no −1: el término −3x² vale −3.' },
      ],
      dibujo: CU({ objeto: 'cuaderno', tipo: 'larga', filas: [], cabeza: [[['D = x⁵ − 3x² + 7', null, 400]], [['d = ', null, 400], ['x + 1', 'i', 700], ['     r = ?', null, 700]]] }),
      revelar: CU({ objeto: 'cuaderno', tipo: 'larga', filas: [], cabeza: [[['D = x⁵ − 3x² + 7', null, 400]], [['d = ', null, 400], ['x + 1', 'i', 700], ['     r = D(−1) = −1 − 3 + 7 = ', null, 400], ['3', 'o', 700]]] }),
      coincide: 'Coincide: x + 1 vale 0 con x = −1, y D(−1) = −1 − 3 + 7 = 3.',
      noCoincide: 'Revisemos: con x = −1, el divisor x + 1 vale 0 y de D solo queda el resto.',
    },
    mira: {
      pieza: 'alg-reparto',
      datos: Object.assign({ objeto: 'angosto', x: 5 }, PISO, { pasos: [{ x: 5 }, { x: 3 }, { x: 2 }, { x: 2 }, { x: 2 }] }),
      voz: 'Achiquemos la loseta hasta el ancho 0.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Para cualquier loseta, D(x) = (x − 2)(x + 3) + 7.', ecuacion: ['D(5) = 3 · 8 + 7 = 31'] },
        { estado: { paso: 1 }, texto: 'Con x = 3 el ancho vale 1.', ecuacion: ['D(3) = 1 · 6 + 7 = 13'] },
        { estado: { paso: 2 }, texto: 'Con x = 2 el ancho vale 0: solo quedan los 7 dm².', ecuacion: ['D(', NA('2'), ') = 0 · 5 + 7 = ', RS('7')] },
        { estado: { paso: 3 }, texto: 'Con cualquier divisor x − a pasa lo mismo en x = a.', ecuacion: ['D(', NA('a'), ') = 0 · ', q_, '(', NA('a'), ') + ', r_, ' = ', r_] },
        { estado: { paso: 4 }, texto: 'Si D(a) = 0, el resto es 0: la división es exacta.', ecuacion: ['x² − 5x + 6 entre ', DV('x − 3'), ':   D(3) = 0'] },
      ],
    },
    regla: {
      texto: 'El resto de dividir D(x) entre x − a es D(a), porque en x = a el divisor vale 0. Si D(a) = 0, la división es exacta.',
      ecuacion: ['D(x) = ', d_, ' · ', q_, ' + ', r_, SEP, 'si ', d_, '(', NA('a'), ') = 0:   ', r_, '(', NA('a'), ') = D(', NA('a'), ')'],
      condicion: 'el divisor vale 0 en x = a; para cx + b, ese número es −b/c.',
      voz: 'Con un divisor de grado 2 que vale 0 en dos números, el resto mx + n sale de dos cuentas.',
      dibujo: piso(2),
    },
    // Así se resuelve: el resto del volumen de una caja (San Marcos 2021, con otros números). «Ahora tú» pide restos de
    // polinomios dados, divisibilidad y el resto entre dos binomios.
    resuelve: {
      pieza: 'alg-reparto',
      generar(s) {
        const r = azar(s + 900), L = r.uno([24, 30, 36]), A = r.uno([16, 20]), k = r.ent(2, 7);
        const V = k * (L - 2 * k) * (A - 2 * k);
        return {
          enunciado: [`Se cortan cuadrados de x cm de lado en las esquinas de una cartulina de ${L} cm por ${A} cm y se arma una caja sin tapa. ¿Cuál es el resto de dividir su volumen V(x) entre `, DV(divisorTxt(k)), '?'],
          datos: [DT.teo, 'Volumen de una caja: largo · ancho · alto'],
          pasos: [
            { tipo: 'pide', texto: ['Piden el resto ', r_, ` de dividir V(x) entre ${divisorTxt(k)}, sin hacer la división.`] },
            { tipo: 'datos', texto: `Al doblar, el alto es x, el largo ${L} − 2x y el ancho ${A} − 2x: a cada lado se le quitan dos cuadrados.`, ecuacion: [`V(x) = x(${L} − 2x)(${A} − 2x)`] },
            { tipo: 'regla', texto: ['Por el teorema del resto, el resto entre x − ', NA(f(k)), ' es V(', NA(f(k)), '): el volumen con cortes de ', f(k), ' cm.'] },
            { tipo: 'cuentas', texto: `Reemplazo x por ${k}.`, ecuacion: ['V(', NA(f(k)), `) = ${k} · (${L} − ${2 * k}) · (${A} − ${2 * k}) = ${k} · ${L - 2 * k} · ${A - 2 * k} = `, RS(f(V))] },
            { tipo: 'sentido', texto: `Un volumen en cm³ y positivo: con cortes de ${k} cm, la caja mide ${L - 2 * k} por ${A - 2 * k} por ${k} cm.` },
          ],
          respuesta: [r_, ' = ', RS(f(V))],
        };
      },
    },
    ahoraTu: {
      voz: 'Busca el número que hace 0 al divisor.',
      generar(sem) {
        const r = azar(sem + 83), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoResto, r);
        if (tipo === 1) return conCuatro(casoRestoNeg, r);
        if (tipo === 2) return conCuatro(casoRestoCB, r);
        if (tipo === 3) return conCuatro(casoDivisibleM, r);
        return conCuatro(casoRestoDos, r);
      },
    },
  };

  // ---------- Idea 6: cocientes notables ----------
  // Objeto: la calculadora (pieza arit-calculadora): con x = 10, (xⁿ − aⁿ) ÷ (x − a) es una división de números, y sus
  // cifras son las potencias de a mientras no pasen de 9 (9984 ÷ 8 = 1248).
  // Cambia: n (de 2 a 5) y a (de 1 a 3). · Permanece: x = 10. · Progresa: la cantidad de cifras y las potencias de a.
  // · Se reserva: n = 6 y el lugar de un término (la predicción: el cuarto término de (x⁶ − 64) ÷ (x − 2)). · Debe
  // verse: el cociente tiene n términos; x baja de uno en uno y a sube.
  // Errores: TAL-TK-EXP da a el exponente k · TAL-TK-X da x un exponente de más · TAL-CONTEO toma el término de al lado ·
  // TAL-TK-SIGNO no alterna los signos con x + a · TAL-NT-EXP da el exponente como número de términos · TAL-CONTEO-MAS
  // cuenta uno de más · TAL-CENTRAL-MAL toma el término de al lado del central · TAL-GRADO-D da el grado del dividendo ·
  // TAL-EXP-DIRECTO suma los exponentes del término sin despejar · TAL-EXACTA confunde cuándo la división es exacta.
  const sNum = n => (Math.abs(n) >= 10000 ? f(n) : String(n));
  const calc = (n, a, extra) => ({ pieza: 'arit-calculadora', datos: Object.assign({ casillas: 8, calcs: [{ cuenta: `${sNum(10 ** n - a ** n)} ÷ ${10 - a}`, pantalla: String((10 ** n - a ** n) / (10 - a)) }] }, extra), estado: {} });
  const cocNot = (n, a) => Array.from({ length: n }, (_, k) => a ** k);     // coeficientes de x^(n−1), …, x⁰
  // El término de lugar k de (xⁿ ± yⁿ) ÷ (x ± y), con su signo: «x²y³», «−xy⁴».
  const tk = (n, k, sg = 1, base = 'y') => `${sg < 0 ? '−' : ''}${pot('x', n - k)}${pot(base, k - 1)}` || '1';
  // Ahora tú 1: el término de lugar k con «−».
  function casoTk(r) {
    const n = r.ent(5, 11), k = r.ent(2, n - 1);
    return {
      pregunta: [`En el cociente de (x${sup(n)} − y${sup(n)}) ÷ (`, DV('x − y'), `), ¿cuál es el término de lugar ${k}?`],
      datos: ['(xⁿ − yⁿ) ÷ (x − y): en el término de lugar k, x lleva n − k e y lleva k − 1'],
      opciones: ops([
        { id: 'c', texto: tk(n, k), correcta: true },
        { id: 'exp-a', texto: `${pot('x', n - k)}${pot('y', k)}`, error: 'TAL-TK-EXP', siFuera: `Bien el exponente de x. Pero y empieza en 0: en el lugar ${k} lleva ${k - 1}.` },
        { id: 'exp-x', texto: `${pot('x', n - k + 1)}${pot('y', k - 1)}`, error: 'TAL-TK-X', siFuera: `Bien el de y. Pero x baja desde ${n - 1}: en el lugar ${k} lleva ${n - k}.` },
        { id: 'cuenta', texto: tk(n, k + 1), error: 'TAL-CONTEO', siFuera: `Bien la forma. Pero ese es el término de lugar ${k + 1}.` },
      ]),
      solucion: { texto: `x baja desde ${n - 1} e y sube desde 0.`, ecuacion: [{ sub: ['t', String(k)] }, ' = ', QC(tk(n, k))] },
    };
  }
  // Ahora tú 2: con x + y, los signos se alternan.
  function casoTkMas(r) {
    const n = 2 * r.ent(2, 5) + 1, k = r.ent(2, n - 1), sg = k % 2 ? 1 : -1;
    return {
      pregunta: [`En el cociente de (x${sup(n)} + y${sup(n)}) ÷ (`, DV('x + y'), `), ¿cuál es el término de lugar ${k}?`],
      datos: ['(xⁿ ± yⁿ) ÷ (x ± y): en el término de lugar k, x lleva n − k e y lleva k − 1', 'Con x + y en el divisor, los signos se alternan: +, −, +, …'],
      opciones: ops([
        { id: 'c', texto: tk(n, k, sg), correcta: true },
        { id: 'signo', texto: tk(n, k, -sg), error: 'TAL-TK-SIGNO', siFuera: 'Bien los exponentes. Pero con x + y los lugares impares van con + y los pares con −.' },
        { id: 'exp-a', texto: `${sg < 0 ? '−' : ''}${pot('x', n - k)}${pot('y', k)}`, error: 'TAL-TK-EXP', siFuera: `Bien el signo. Pero y empieza en 0: en el lugar ${k} lleva ${k - 1}.` },
        { id: 'cuenta', texto: tk(n, k + 1, -sg), error: 'TAL-CONTEO', siFuera: `Bien la forma. Pero ese es el término de lugar ${k + 1}.` },
      ]),
      solucion: { texto: `Lugar ${k}: ${k % 2 ? 'impar, signo +' : 'par, signo −'}.`, ecuacion: [{ sub: ['t', String(k)] }, ' = ', QC(tk(n, k, sg))] },
    };
  }
  // Ahora tú 3: cuántos términos, con potencias en el divisor.
  function casoNumTerm(r) {
    let p, s, N;
    do { p = r.ent(2, 5); s = r.ent(1, 4); N = r.ent(4, 9); } while (p === s);
    return {
      pregunta: [`¿Cuántos términos tiene el cociente de (x${sup(p * N)} − y${sup(s * N)}) ÷ (`, DV(`x${sup(p)} − ${pot('y', s)}`), ')?'],
      datos: ['(xⁿ − aⁿ) ÷ (x − a) tiene n términos', `Si el divisor es x${sup(p)} − ${pot('y', s)}, el dividendo debe ser (x${sup(p)})ⁿ − (${pot('y', s)})ⁿ`],
      opciones: ops([
        { id: 'c', texto: f(N), correcta: true },
        { id: 'exp', texto: f(p * N), error: 'TAL-NT-EXP', siFuera: `Bien la idea. Pero ${p * N} es el exponente de x: los términos son ${p * N} ÷ ${p}.` },
        { id: 'mas', texto: f(N + 1), error: 'TAL-CONTEO-MAS', siFuera: `Bien ${p * N} ÷ ${p} = ${N}. Pero ese ya es el número de términos: no se suma 1.` },
        { id: 'y', texto: s * N === N + 1 || s * N === p * N ? null : f(s * N), error: 'TAL-NT-EXP', siFuera: `Bien la idea. Pero ${s * N} es el exponente de y: los términos son ${s * N} ÷ ${s}.` },
      ]),
      solucion: { texto: 'Cada exponente de arriba, entre el de abajo, da el número de términos.', ecuacion: [`${p * N} ÷ ${p} = ${s * N} ÷ ${s} = `, QC(f(N))] },
    };
  }
  // Ahora tú 4 (nivel examen, como San Marcos 2023-II): el grado del término central.
  function casoCentral(r) {
    let p, s, N;
    do { p = r.ent(2, 5); s = r.ent(1, 4); N = 2 * r.ent(2, 5) + 1; } while (p === s);
    const k = (N + 1) / 2, g = kk => p * (N - kk) + s * (kk - 1);
    return {
      pregunta: [`¿Cuál es el grado del término central del cociente de (x${sup(p * N)} − y${sup(s * N)}) ÷ (`, DV(`x${sup(p)} − ${pot('y', s)}`), ')?'],
      datos: ['(xⁿ − aⁿ) ÷ (x − a) tiene n términos; en el de lugar k, x lleva n − k y a lleva k − 1', `Si el divisor es x${sup(p)} − ${pot('y', s)}, el dividendo debe ser (x${sup(p)})ⁿ − (${pot('y', s)})ⁿ`, 'Grado de un término: la suma de los exponentes de sus letras'],
      opciones: ops([
        { id: 'c', texto: f(g(k)), correcta: true },
        { id: 'antes', texto: f(g(k - 1)), error: 'TAL-CENTRAL-MAL', siFuera: `Bien la forma del término. Pero el central de ${N} términos es el de lugar ${k}, no ${k - 1}.` },
        { id: 'despues', texto: f(g(k + 1)), error: 'TAL-CENTRAL-MAL', siFuera: `Bien la forma del término. Pero el central de ${N} términos es el de lugar ${k}, no ${k + 1}.` },
        { id: 'D', texto: f(p * N + s * N), error: 'TAL-GRADO-D', siFuera: 'Ese es el grado del dividendo. El término central es un solo término del cociente.' },
        { id: 'exp', texto: f(p * (N - k) + s * k), error: 'TAL-TK-EXP', siFuera: `Bien el lugar ${k}. Pero la segunda base empieza con exponente 0: en el lugar ${k} lleva ${k - 1}.` },
      ]),
      solucion: { texto: `${N} términos: el central es el de lugar ${k}.`, ecuacion: [`(x${sup(p)})${sup(N - k)}(${pot('y', s)})${sup(k - 1)} = x${sup(p * (N - k))}${pot('y', s * (k - 1))}   →   grado `, QC(f(g(k)))] },
    };
  }
  // Ahora tú 5 (nivel examen, como San Marcos 2023-I): los exponentes del dividendo a partir de un término.
  function casoExponentes(r) {
    let p, s, N, k;
    do { p = r.ent(2, 4); s = r.ent(2, 4); N = r.ent(5, 9); k = r.ent(2, N - 1); } while (p === s);
    const ex = p * (N - k), ey = s * (k - 1), bien = (p + s) * N;
    return {
      pregunta: ['(xᵐ − yˢ) ÷ (', DV(`x${sup(p)} − y${sup(s)}`), `) es un cociente notable y uno de sus términos es x${sup(ex)}y${sup(ey)}. ¿Cuánto vale m + s?`],
      datos: ['(xⁿ − aⁿ) ÷ (x − a): en el término de lugar k, x lleva n − k y a lleva k − 1', `Si el divisor es x${sup(p)} − y${sup(s)}, el dividendo debe ser (x${sup(p)})ⁿ − (y${sup(s)})ⁿ, con n términos`],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'directo', texto: f(ex + ey), error: 'TAL-EXP-DIRECTO', siFuera: 'Bien leídos los exponentes del término. Pero m y s son los del dividendo, que salen del número de términos.' },
        { id: 'menos', texto: f((p + s) * (N - 1)), error: 'TAL-CONTEO', siFuera: `Bien el lugar k = ${k}. Pero x lleva n − k: hay ${ex / p} + ${k} = ${N} términos.` },
        { id: 'mas', texto: f((p + s) * (N + 1)), error: 'TAL-CONTEO-MAS', siFuera: `Bien el lugar k = ${k}. Pero x lleva n − k, no n − k − 1: hay ${N} términos.` },
      ]),
      solucion: { texto: `y lleva ${s}(k − 1) = ${ey}: k = ${k}. x lleva ${p}(n − ${k}) = ${ex}: n = ${N}.`, ecuacion: [`m = ${p} · ${N} = ${p * N},   s = ${s} · ${N} = ${s * N},   m + s = `, QC(f(bien))] },
    };
  }

  // Ejemplos de la idea 6 (cuentas aparte en e6-algebra/scripts/cuentas-ejemplos.py): (x⁷ − a⁷) ÷ (x − a): 7 términos;
  // (x⁵ − 32) ÷ (x − 2) empieza con x⁴; t₃ de (x⁵ − y⁵) ÷ (x − y) = x²y²; el último de (x⁴ − 81) ÷ (x − 3) es 27;
  // (x³ + 8) ÷ (x + 2) = x² − 2x + 4; t₄ de (x⁵ + y⁵) ÷ (x + y) = −xy³; (x⁴ − 16) ÷ (x − 2) = x³ + 2x² + 4x + 8;
  // (x¹² − y⁸) ÷ (x³ − y²): 4 términos, t₂ = x⁶y²; 9919 ÷ 7 = 1417; (x³⁵ − y²¹) ÷ (x⁵ − y³): t₄ = x¹⁵y⁹, grado 24;
  // x⁸y⁹ con x² − y³: k = 4, N = 8, m + n = 40; (x⁴² − y²¹) ÷ (x² − y): 21 términos, 10 antes del central;
  // t₅ de (x⁷ + 128) ÷ (x + 2) = 16x²; exactas: solo (x⁵ + 32) ÷ (x + 2).
  const EJEMPLOS_NOTABLES = [
    { nivel: 1, titulo: 'Cuántos términos',
      enunciado: ['¿Cuántos términos tiene el cociente de (x⁷ − a⁷) ÷ (', DV('x − a'), ')?'],
      datos: ['(xⁿ − aⁿ) ÷ (x − a) tiene n términos'],
      solucion: [{ texto: 'El exponente es 7: el cociente tiene 7 términos, de x⁶ a a⁶.', ecuacion: ['x⁶ + x⁵a + … + a⁶'] }],
      respuesta: [QC('7'), ' términos'] },
    { nivel: 1, titulo: 'El primer término',
      enunciado: ['¿Cuál es el primer término del cociente de (x⁵ − 32) ÷ (', DV('x − 2'), ')?'],
      datos: ['(xⁿ − aⁿ) ÷ (x − a): en el término de lugar k, x lleva n − k y a lleva k − 1', '32 = 2⁵'],
      solucion: [{ texto: 'En el lugar 1, x lleva 5 − 1 = 4 y el 2 lleva 0.', ecuacion: [{ sub: ['t', '1'] }, ' = x⁴ · 2⁰ = ', QC('x⁴')] }],
      respuesta: [QC('x⁴')] },
    { nivel: 1, titulo: 'El tercer término',
      enunciado: ['¿Cuál es el tercer término del cociente de (x⁵ − y⁵) ÷ (', DV('x − y'), ')?'],
      datos: ['(xⁿ − yⁿ) ÷ (x − y): en el término de lugar k, x lleva n − k e y lleva k − 1'],
      solucion: [{ texto: 'Con n = 5 y k = 3: x lleva 2 e y lleva 2.', ecuacion: [{ sub: ['t', '3'] }, ' = ', QC('x²y²')] }],
      respuesta: [QC('x²y²')] },
    { nivel: 1, titulo: 'El último término',
      enunciado: ['¿Cuál es el último término del cociente de (x⁴ − 81) ÷ (', DV('x − 3'), ')?'],
      datos: ['(xⁿ − aⁿ) ÷ (x − a) tiene n términos; en el de lugar k, x lleva n − k y a lleva k − 1', '81 = 3⁴'],
      solucion: [{ texto: 'Hay 4 términos; en el cuarto, x lleva 0 y el 3 lleva 3.', ecuacion: [{ sub: ['t', '4'] }, ' = 3³ = ', QC('27')] }],
      respuesta: [QC('27')] },
    { nivel: 1, titulo: '¿Sale exacta?',
      enunciado: ['¿Es exacta la división (x³ + 8) ÷ (', DV('x + 2'), ')? Si lo es, escribe el cociente.'],
      datos: ['Con x + a en el divisor, xⁿ + aⁿ sale exacta si n es impar, y los signos se alternan', '8 = 2³'],
      solucion: [{ texto: 'n = 3 es impar: sale exacta. Los signos se alternan: +, −, +.', ecuacion: ['(x³ + 8) ÷ (', DV('x + 2'), ') = ', QC('x² − 2x + 4')] }],
      respuesta: ['Sí: ', QC('x² − 2x + 4')] },
    { nivel: 2, titulo: 'Signos que se alternan',
      enunciado: ['¿Cuál es el cuarto término del cociente de (x⁵ + y⁵) ÷ (', DV('x + y'), ')?'],
      datos: ['(xⁿ ± yⁿ) ÷ (x ± y): en el término de lugar k, x lleva n − k e y lleva k − 1', 'Con x + y en el divisor, los signos se alternan: +, −, +, …'],
      solucion: [
        { texto: 'Exponentes: x lleva 5 − 4 = 1 e y lleva 3.', ecuacion: ['xy³'] },
        { texto: 'El lugar 4 es par: signo −.', ecuacion: [{ sub: ['t', '4'] }, ' = ', QC('−xy³')] },
      ],
      respuesta: [QC('−xy³')] },
    { nivel: 2, titulo: 'Escribir el cociente entero',
      enunciado: ['Escribe el cociente de (x⁴ − 16) ÷ (', DV('x − 2'), ') sin dividir.'],
      datos: ['(xⁿ − aⁿ) ÷ (x − a) tiene n términos; en el de lugar k, x lleva n − k y a lleva k − 1', '16 = 2⁴'],
      solucion: [
        { texto: 'Cuatro términos: x baja de 3 a 0 y el 2 sube de 0 a 3.', ecuacion: ['x³ · 1 + x² · 2 + x · 4 + 8'] },
        { texto: 'Compruebo con Ruffini: 1, 2, 4, 8 y resto 0.', ecuacion: [QC('x³ + 2x² + 4x + 8')] },
      ],
      respuesta: [QC('x³ + 2x² + 4x + 8')] },
    { nivel: 2, titulo: 'Con potencias en el divisor',
      enunciado: ['¿Cuántos términos tiene el cociente de (x¹² − y⁸) ÷ (', DV('x³ − y²'), ')?'],
      datos: ['(xⁿ − aⁿ) ÷ (x − a) tiene n términos', 'Si el divisor es x³ − y², el dividendo debe ser (x³)ⁿ − (y²)ⁿ'],
      solucion: [{ texto: 'x³ y y² hacen el papel de x y de a: x¹² = (x³)⁴ y y⁸ = (y²)⁴.', ecuacion: ['12 ÷ 3 = 8 ÷ 2 = ', QC('4')] }],
      respuesta: [QC('4'), ' términos'] },
    { nivel: 2, titulo: 'Un término con potencias',
      enunciado: ['¿Cuál es el segundo término del cociente de (x¹² − y⁸) ÷ (', DV('x³ − y²'), ')?'],
      datos: ['(xⁿ − aⁿ) ÷ (x − a): en el término de lugar k, x lleva n − k y a lleva k − 1', 'Si el divisor es x³ − y², el dividendo debe ser (x³)ⁿ − (y²)ⁿ'],
      solucion: [
        { texto: 'Hay 4 términos, con x³ en lugar de x y y² en lugar de a.', ecuacion: [{ sub: ['t', '2'] }, ' = (x³)² · (y²)¹'] },
        { texto: 'Elevo cada potencia.', ecuacion: [{ sub: ['t', '2'] }, ' = ', QC('x⁶y²')] },
      ],
      respuesta: [QC('x⁶y²')] },
    { nivel: 2, titulo: 'En la calculadora',
      enunciado: ['¿Qué número muestra la calculadora al hacer 9919 ÷ 7? Usa que 9919 = 10⁴ − 3⁴.'],
      datos: ['(xⁿ − aⁿ) ÷ (x − a) tiene n términos; en el de lugar k, x lleva n − k y a lleva k − 1'],
      figura: { pieza: 'arit-calculadora', datos: { casillas: 8, calcs: [{ cuenta: '9919 ÷ 7', pantalla: '?' }] }, estado: {} },
      solucion: [
        { texto: 'Es el cociente notable con x = 10 y a = 3: x³ + 3x² + 9x + 27.', ecuacion: ['1000 + 300 + 90 + 27'] },
        { texto: 'Aquí 27 pasa de 9: las cifras ya no son las potencias de 3.', ecuacion: [QC('1417')] },
      ],
      respuesta: [QC('1417')] },
    { nivel: 3, titulo: 'El grado del término central',
      enunciado: ['¿Cuál es el grado del término central del cociente de (x³⁵ − y²¹) ÷ (', DV('x⁵ − y³'), ')?'],
      alternativas: ['56', '26', '22', '27', '24'],
      datos: ['(xⁿ − aⁿ) ÷ (x − a) tiene n términos; en el de lugar k, x lleva n − k y a lleva k − 1', 'Si el divisor es x⁵ − y³, el dividendo debe ser (x⁵)ⁿ − (y³)ⁿ', 'Grado de un término: la suma de los exponentes de sus letras'],
      fuente: 'Del tipo de San Marcos 2023-II (pregunta 40), con otros números.',
      solucion: [
        { texto: '35 ÷ 5 = 21 ÷ 3 = 7 términos: el central es el cuarto.', ecuacion: [{ sub: ['t', '4'] }, ' = (x⁵)³(y³)³ = x¹⁵y⁹'] },
        { texto: 'Su grado es 15 + 9.', ecuacion: ['grado ', QC('24')] },
        { texto: ['La ', letra('A'), ' da el grado del dividendo. La ', letra('B'), ' toma el tercer término y la ', letra('C'), ', el quinto.'] },
        { texto: ['La ', letra('D'), ' le pone a y³ el exponente 4 y no 3.'] },
      ],
      respuesta: [letra('E'), ', ', QC('24')] },
    { nivel: 3, titulo: 'Exponentes por hallar',
      enunciado: ['(xᵐ − yˢ) ÷ (', DV('x² − y³'), ') es un cociente notable y uno de sus términos es x⁸y⁹. ¿Cuánto vale m + s?'],
      alternativas: ['17', '35', '40', '45', '16'],
      datos: ['(xⁿ − aⁿ) ÷ (x − a): en el término de lugar k, x lleva n − k y a lleva k − 1', 'Si el divisor es x² − y³, el dividendo debe ser (x²)ⁿ − (y³)ⁿ, con n términos'],
      fuente: 'Del tipo de San Marcos 2023-I (pregunta 38), con otros números.',
      solucion: [
        { texto: 'Con x² y y³ en lugar de x y a, el término de lugar k es (x²)ⁿ⁻ᵏ(y³)ᵏ⁻¹.' },
        { texto: 'De y: 3(k − 1) = 9, así que k = 4. De x: 2(n − 4) = 8, así que hay n = 8 términos.' },
        { texto: 'm = 2 · 8 y s = 3 · 8.', ecuacion: ['m + s = 16 + 24 = ', QC('40')] },
        { texto: ['La ', letra('A'), ' suma los exponentes del término: 8 + 9. La ', letra('B'), ' toma 7 términos y la ', letra('D'), ', 9. La ', letra('E'), ' da solo m.'] },
      ],
      respuesta: [letra('C'), ', m + s = ', QC('40')] },
    { nivel: 3, titulo: 'Una fila de términos',
      enunciado: ['Los términos del cociente de (x⁴² − y²¹) ÷ (', DV('x² − y'), ') se escriben en fila. ¿Cuántos términos van antes del central?'],
      alternativas: ['11', '10', '21', '20', '9'],
      datos: ['(xⁿ − aⁿ) ÷ (x − a) tiene n términos', 'Si el divisor es x² − y, el dividendo debe ser (x²)ⁿ − yⁿ'],
      fuente: 'Del tipo de San Marcos 2026-I (pregunta 39), con otros números.',
      solucion: [
        { texto: '42 ÷ 2 = 21 ÷ 1 = 21 términos. El central es el de lugar 11: deja 10 a cada lado.', ecuacion: ['21 = 10 + 1 + 10'] },
        { texto: 'Antes del central hay 10.', ecuacion: [QC('10')] },
        { texto: ['La ', letra('A'), ' da el lugar del central: cuenta al central entre los de delante. La ', letra('C'), ' da el total.'] },
        { texto: ['La ', letra('D'), ' resta 1 al total. La ', letra('E'), ' quita uno de más.'] },
      ],
      respuesta: [letra('B'), ', ', QC('10')] },
    { nivel: 3, titulo: 'Un término con x + 2',
      enunciado: ['¿Cuál es el quinto término del cociente de (x⁷ + 128) ÷ (', DV('x + 2'), ')?'],
      alternativas: ['16x²', '−16x²', '32x²', '16x³', '8x³'],
      datos: ['(xⁿ ± aⁿ) ÷ (x ± a): en el término de lugar k, x lleva n − k y a lleva k − 1', 'Con x + a en el divisor, los signos se alternan: +, −, +, …', '128 = 2⁷'],
      solucion: [
        { texto: 'n = 7 y k = 5: x lleva 2 y el 2 lleva 4, que da 16.', ecuacion: ['x² · 2⁴ = 16x²'] },
        { texto: 'El lugar 5 es impar: signo +.', ecuacion: [{ sub: ['t', '5'] }, ' = ', QC('16x²')] },
        { texto: ['La ', letra('B'), ' pone el signo de un lugar par. La ', letra('C'), ' le da al 2 el exponente 5. La ', letra('D'), ' le da a x uno de más.'] },
        { texto: ['La ', letra('E'), ' calcula el cuarto término, sin su signo.'] },
      ],
      respuesta: [letra('A'), ', ', QC('16x²')] },
    { nivel: 3, titulo: '¿Cuál sale exacta?',
      enunciado: ['¿Cuáles de estas divisiones son exactas: (x⁴ + 16) ÷ (x + 2), (x⁵ + 32) ÷ (x + 2) y (x⁵ − 32) ÷ (x + 2)?'],
      alternativas: ['Solo la primera', 'Las tres', 'La primera y la tercera', 'Solo la segunda', 'Ninguna'],
      datos: ['Con x + a en el divisor, xⁿ + aⁿ sale exacta si n es impar, y xⁿ − aⁿ si n es par', '16 = 2⁴ y 32 = 2⁵'],
      solucion: [
        { texto: 'Con x + 2 abajo, el resto es el dividendo evaluado en −2.', ecuacion: ['16 + 16 = 32,   −32 + 32 = 0,   −32 − 32 = −64'] },
        { texto: 'Solo la segunda deja resto 0: xⁿ + aⁿ con n = 5, impar.' },
        { texto: ['La ', letra('A'), ' cree que n par basta con «+». La ', letra('B'), ' cree que toda división notable es exacta. La ', letra('C'), ' cambia las dos reglas.'] },
        { texto: ['La ', letra('E'), ' cree que con x + 2 ninguna lo es.'] },
      ],
      respuesta: [letra('D'), ', solo la segunda'] },
  ];

  const P6 = [1, 0, 0, 0, 0, 0, -64];   // la predicción y «Mira»: x⁶ − 64 entre x − 2
  const notables = {
    id: 'cocientes-notables',
    titulo: 'Cocientes notables',
    pregunta: '¿Cómo escribes un término de xⁿ − aⁿ entre x − a sin dividir?',
    temas: ['Cocientes notables y término general'],
    pieza: 'arit-calculadora',
    aprendizaje: '(xⁿ − aⁿ) ÷ (x − a) es exacta y tiene n términos: en el de lugar k, x lleva n − k y a lleva k − 1.',
    actividad: 'Dividir en la calculadora números como 9984 ÷ 8 y leer sus cifras.',
    // Lee: el polinomio con x = 10, qué es un cociente notable y qué mirar. No dice cómo se arma un término de lugar k
    // (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Un polinomio con x = 10', texto: 'Con x = 10, el polinomio x² + 2x + 4 vale 100 + 20 + 4 = 124: sus coeficientes se leen como cifras, mientras ninguno pase de 9.' },
        { titulo: 'Divisiones que se repiten', texto: 'Un cociente notable es una división que sale exacta y se escribe sin dividir. En «Productos notables» viste x² − a² = (x + a)(x − a); por eso (x² − a²) ÷ (x − a) = x + a.' },
        { titulo: 'Qué mirar al jugar', texto: 'Con x = 10, (xⁿ − aⁿ) ÷ (x − a) es una división de números. Elige n y a, y mira qué cifras salen en la pantalla y cuántas son.',
          pieza: 'arit-calculadora', dibujo: calc(3, 2) },
      ],
    },
    ejemplos: EJEMPLOS_NOTABLES,
    juega: {
      pieza: 'arit-calculadora',
      consigna: 'Con x = 10, un cociente notable se lee en la calculadora: (10ⁿ − aⁿ) ÷ (10 − a).',
      mision: {
        texto: 'Haz que la calculadora muestre 1248.',
        logrado: v => v.n === 4 && v.a === 2,
        bien: 'Listo: 9984 ÷ 8 = 1248, y sus cifras son 1, 2, 4 y 8.',
      },
      voz: 'Compara las cifras con el número a.',
      leyenda: [
        { s: 'x = 10', t: 'con x = 10, cada coeficiente es una cifra' },
        { s: 'n', t: 'el exponente de xⁿ − aⁿ' },
        { s: NA('a'), t: 'el número de x − a' },
        { s: QC('pantalla'), t: 'el cociente, escrito como número' },
      ],
      controles: [
        { id: 'n', etiqueta: 'n', min: 2, max: 5, paso: 1, inicio: 3, decimales: 0 },
        { id: 'a', etiqueta: 'a', color: 'c-i', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => calc(v.n, v.a),
      lectura: v => [`(x${sup(v.n)} − `, NA(`${v.a}${sup(v.n)}`), ') ÷ (x − ', NA(String(v.a)), ') = ', QC(poli(cocNot(v.n, v.a)))],
      minimo: 3,
    },
    predice: {
      pregunta: ['En el cociente de (x⁶ − 64) ÷ (', DV('x − 2'), '), ¿cuál es el cuarto término?'],
      datos: ['64 = 2⁶'],
      voz: 'Piensa cómo cambian los exponentes de un término al siguiente.',
      opciones: [
        { id: 'c', texto: '8x²', correcta: true },
        { id: 'exp-a', texto: '16x²', error: 'TAL-TK-EXP', siFuera: 'Bien el x². Pero el primer término lleva 2⁰: en el cuarto, el 2 lleva exponente 3.' },
        { id: 'exp-x', texto: '8x³', error: 'TAL-TK-X', siFuera: 'Bien el 8. Pero x baja desde 5: en el cuarto término lleva 6 − 4 = 2.' },
        { id: 'tercero', texto: '4x³', error: 'TAL-CONTEO', siFuera: 'Bien la forma: 4x³ es el tercer término. El cuarto viene después.' },
      ],
      dibujo: CU(rufTabla(P6, 2, { hasta: 1, cabeza: cabezaRuf(P6, 2), flechas: false })),
      revelar: CU(rufTabla(P6, 2, { cabeza: cabezaRuf(P6, 2), flechas: false })),
      coincide: 'Coincide: x⁵, 2x⁴, 4x³, 8x²: en el cuarto, x lleva 2 y el 2 lleva 3.',
      noCoincide: 'Revisemos: los términos son x⁵, 2x⁴, 4x³, … y el cuarto viene después de 4x³.',
    },
    mira: {
      pieza: 'alg-reparto',
      datos: Object.assign(rufTabla(P6, 2, { hasta: 0, cabeza: cabezaRuf(P6, 2), flechas: false }), { pasos: [0, 3, 6, 7, 7].map(k => rufTabla(P6, 2, { hasta: k, cabeza: cabezaRuf(P6, 2), flechas: false })) }),
      voz: 'Miremos la tabla entera.',
      pasos: [
        { estado: { paso: 0 }, texto: 'x⁶ − 64 = x⁶ − 2⁶: entre los dos van cinco ceros.', ecuacion: ['1   ', OLV('0   0   0   0   0'), '   −64'] },
        { estado: { paso: 1 }, texto: 'Cada casilla es la anterior por 2: potencias de 2.', ecuacion: ['1,   2,   4,   …'] },
        { estado: { paso: 2 }, texto: 'Llegan hasta 2⁵ = 32: son 6 términos.', ecuacion: ['1,   2,   4,   8,   16,   32'] },
        { estado: { paso: 3 }, texto: 'La última da −64 + 64 = 0: la división es exacta.', ecuacion: [r_, ' = ', RS('0')] },
        { estado: { paso: 4 }, texto: 'x baja de 5 a 0, y el 2 sube desde 0.', ecuacion: [QC('x⁵ + 2x⁴ + 4x³ + 8x² + 16x + 32')] },
      ],
    },
    regla: {
      texto: '(xⁿ − aⁿ) ÷ (x − a) da n términos: x baja desde n − 1 y a sube desde 0. Con x + a abajo, los signos se alternan: +, −, +, …',
      ecuacion: [{ sub: ['t', 'k'] }, ' = ', { llave: [{ sup: ['x', 'n − k'] }], nota: 'baja de uno en uno', color: 'c-f' }, ' · ', { llave: [{ sup: [NA('a'), 'k − 1'] }], nota: 'sube desde 0', color: 'c-i' }],
      condicion: 'la división es exacta: con x + a abajo, eso pide n impar en xⁿ + aⁿ y n par en xⁿ − aⁿ.',
      voz: 'Si x y a vienen con exponente, como x³ y y², cada uno cuenta como una letra.',
      dibujo: CU(rufTabla(P6, 2, { cabeza: cabezaRuf(P6, 2), flechas: false })),
    },
    // Así se resuelve: un término con potencias en el divisor (cuántos términos y cuál va en el lugar k). «Ahora tú»
    // pide términos con x − y y x + y, el número de términos, el término central y los exponentes por hallar.
    resuelve: {
      pieza: 'alg-reparto',
      generar(s) {
        const r = azar(s + 900);
        let p, q, N, k;
        do { p = r.ent(2, 4); q = r.ent(2, 4); N = r.ent(4, 8); k = r.ent(2, N - 1); } while (p === q);
        const ex = p * (N - k), ey = q * (k - 1), dv = `x${sup(p)} − y${sup(q)}`;
        return {
          enunciado: [`¿Cuál es el término de lugar ${k} del cociente de (x${sup(p * N)} − y${sup(q * N)}) ÷ (`, DV(dv), ')?'],
          datos: ['(xⁿ − aⁿ) ÷ (x − a): en el término de lugar k, x lleva n − k y a lleva k − 1', `Si el divisor es ${dv}, el dividendo debe ser (x${sup(p)})ⁿ − (y${sup(q)})ⁿ`],
          pasos: [
            { tipo: 'pide', texto: `Piden el término de lugar ${k} del cociente, sin dividir.` },
            { tipo: 'datos', texto: `x${sup(p)} y y${sup(q)} hacen de x y de a: x${sup(p * N)} = (x${sup(p)})${sup(N)} y y${sup(q * N)} = (y${sup(q)})${sup(N)}. Son ${N} términos.` },
            { tipo: 'regla', texto: `En el lugar ${k}, la primera base lleva ${N} − ${k} y la segunda, ${k} − 1.` },
            { tipo: 'cuentas', texto: 'Elevo cada potencia: los exponentes se multiplican.', ecuacion: [{ sub: ['t', String(k)] }, ` = (x${sup(p)})${sup(N - k)}(y${sup(q)})${sup(k - 1)} = `, QC(`x${sup(ex)}y${sup(ey)}`)] },
            { tipo: 'sentido', texto: `Reviso: el grado del término, ${ex} + ${ey} = ${ex + ey}, sale de ${p} · ${N - k} + ${q} · ${k - 1}.` },
          ],
          respuesta: [{ sub: ['t', String(k)] }, ' = ', QC(`x${sup(ex)}y${sup(ey)}`)],
        };
      },
    },
    ahoraTu: {
      voz: 'Primero cuenta los términos; después, el lugar.',
      generar(sem) {
        const r = azar(sem + 97), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoTk, r);
        if (tipo === 1) return conCuatro(casoTkMas, r);
        if (tipo === 2) return conCuatro(casoNumTerm, r);
        if (tipo === 3) return conCuatro(casoCentral, r);
        return conCuatro(casoExponentes, r);
      },
    },
  };

  // ---------- Laboratorio (las tres mesas de la ronda 2, con los colores y las letras de la unidad) ----------
  // Mesa 1: el teorema del resto con un cúbico que el alumno arma y a en pasos de medio.
  const muestra = (cs, x0, x1) => Array.from({ length: Math.round((x1 - x0) * 10) + 1 }, (_, k) => { const t = x0 + k / 10; return [Math.round(t * 10) / 10, evaluar(cs, t)]; });
  const EJES = () => Kit.piezas.ejes;
  const inversa = (escala, p, q) => px => p + (px - escala(p)) * (q - p) / (escala(q) - escala(p));
  const cub = v => [1, v.b, v.c, v.d];
  const restoLab = v => {
    const cs = cub(v), Rv = evaluar(cs, v.a), ys = muestra(cs, -3, 3).map(z => z[1]);
    const lo = Math.floor(Math.min(0, ...ys) / 10) * 10, hi = Math.ceil(Math.max(0, ...ys) / 10) * 10;
    return {
      x: { min: -3, max: 3, paso: 1, nombre: 'x', decimales: 0, color: 'i' },
      y: { min: lo, max: hi, paso: hi - lo > 60 ? 20 : 10, nombre: 'D(x)', decimales: 0 },
      curvas: [{ puntos: muestra(cs, -3, 3), color: 'f', rotulo: 'D', en: [3, evaluar(cs, 3)] }],
      puntos: [{ x: v.a, y: Rv, color: 'o', guias: true, rotulo: `r = ${f(Rv, 3)}` }],
      alt: `D(x) = ${poli(cs)} entre x − ${f(v.a, 1)}: el resto es D(${f(v.a, 1)}) = ${f(Rv, 3)}`,
    };
  };
  const mesaResto = {
    id: 'resto-libre', titulo: 'El resto de tu polinomio', pieza: 'ejes',
    consigna: 'D(x) = x³ + bx² + cx + d entre x − a. Arrastra el punto por la curva: su altura es el resto.',
    controles: [
      { id: 'a', etiqueta: 'a', min: -3, max: 3, paso: 0.5, inicio: 1, decimales: 1, color: 'c-i' },
      { id: 'b', etiqueta: 'b', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
      { id: 'c', etiqueta: 'c', min: -6, max: 6, paso: 1, inicio: -4, decimales: 0 },
      { id: 'd', etiqueta: 'd', min: -6, max: 6, paso: 1, inicio: 0, decimales: 0 },
    ],
    dibujo: v => ({ datos: restoLab(v), estado: {} }),
    lectura: v => ['D = ', poli(cub(v)), '; ', r_, ` = D(${f(v.a, 1)}) = `, RS(f(evaluar(cub(v), v.a), 3))],
    arrastres: [{ id: 'punto', etiqueta: 'punto (a; D(a)) de la curva', color: 'c-i',
      donde: v => { const g = EJES().geometria(restoLab(v)); return { x: g.X(v.a), y: g.Y(evaluar(cub(v), v.a)) }; },
      mover: (pt, v) => { const g = EJES().geometria(restoLab(v)); return { a: inversa(g.X, -3, 3)(pt.x) }; } }],
    // Retos comprobados (docs/teoria.md §4d): el resto es evaluar(cub(v), a), la misma altura del punto.
    invitaciones: [
      { texto: 'Haz que el resto valga 0.', logrado: v => evaluar(cub(v), v.a) === 0, bien: 'Resto 0: la división es exacta y el punto quedó sobre el eje x.' },
      { texto: 'Con a = 2 o a = −2, logra que los dos restos sean iguales.', logrado: v => Math.abs(v.a) === 2 && evaluar(cub(v), 2) === evaluar(cub(v), -2), bien: 'D(2) − D(−2) = 16 + 4c: con c = −4 se empatan.' },
      { texto: 'Arma un polinomio divisible entre x, x − 1 y x + 1 a la vez.', logrado: v => [0, 1, -1].every(z => evaluar(cub(v), z) === 0), bien: 'x³ − x: tres restos 0 a la vez.' },
      { texto: 'Busca el resto más grande de toda la mesa.', logrado: v => evaluar(cub(v), v.a) === MAX_RESTO, bien: 'Todo al máximo y a = 3: 27 + 27 + 18 + 6 = 78.' },
    ],
  };
  const MAX_RESTO = (() => { let m = -Infinity; for (let a = -3; a <= 3; a += 0.5) for (let b = -3; b <= 3; b++) for (let c = -6; c <= 6; c++) for (let d = -6; d <= 6; d++) m = Math.max(m, evaluar([1, b, c, d], a)); return m; })();
  // Mesa 2: Ruffini con los cuatro coeficientes y a libres.
  const cuatro = v => [v.p, v.q, v.s, v.t];
  const mesaRuffini = {
    id: 'ruffini-libre', titulo: 'Tu propia tabla de Ruffini', pieza: 'alg-reparto',
    consigna: 'Arma un dividendo de grado 3 con sus cuatro coeficientes y divídelo entre x − a. Compara la última casilla con D(a).',
    controles: [
      { id: 'a', etiqueta: 'a', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      { id: 'p', etiqueta: 'Coeficiente de x³', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
      { id: 'q', etiqueta: 'Coeficiente de x²', min: -5, max: 5, paso: 1, inicio: 0, decimales: 0 },
      { id: 's', etiqueta: 'Coeficiente de x', min: -5, max: 5, paso: 1, inicio: -3, decimales: 0 },
      { id: 't', etiqueta: 'Término independiente', min: -6, max: 6, paso: 1, inicio: 2, decimales: 0 },
    ],
    dibujo: v => CU(rufTabla(cuatro(v), v.a, { cabeza: cabezaRuf(cuatro(v), v.a) })),
    lectura: v => { const b = ruffini(cuatro(v), v.a); return [q_, ` = ${poli(b.slice(0, -1))}; `, r_, ' = ', RS(f(b[3])), ` = D(${f(v.a)})`]; },
    invitaciones: [
      { texto: 'Haz que la última casilla sea 0.', logrado: v => ruffini(cuatro(v), v.a)[3] === 0, bien: 'División exacta: D(a) = 0.' },
      { texto: 'Consigue un cociente con sus tres casillas iguales.', logrado: v => { const b = ruffini(cuatro(v), v.a); return b[0] !== 0 && b[0] === b[1] && b[1] === b[2]; }, bien: 'Cada paso sumó justo lo que hacía falta para repetir.' },
      { texto: 'Haz que el cociente tenga un 0 en la casilla del medio.', logrado: v => { const b = ruffini(cuatro(v), v.a); return b[0] !== 0 && b[1] === 0; }, bien: 'El cociente no tiene término en x: le falta una potencia.' },
      { texto: 'Busca un resto mayor que 50.', logrado: v => ruffini(cuatro(v), v.a)[3] > 50, bien: 'Con a = 3, cada casilla se triplica antes de sumar.' },
    ],
  };
  // Mesa 3: el cociente notable con «+»: los signos se alternan y el resto depende de n.
  const restoMas = v => { const b = ruffini([1, ...Array(v.n - 1).fill(0), v.a ** v.n], -v.a); return b[b.length - 1]; };
  const mesaSigno = {
    id: 'notable-con-mas', titulo: 'Cociente notable con signo más', pieza: 'alg-reparto',
    consigna: 'Divide xⁿ + aⁿ entre x + a: en la tabla se usa −a. ¿Para qué n el resto es 0?',
    controles: [
      { id: 'n', etiqueta: 'n', min: 2, max: 6, paso: 1, inicio: 3, decimales: 0 },
      { id: 'a', etiqueta: 'a', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
    ],
    dibujo: v => CU(rufTabla([1, ...Array(v.n - 1).fill(0), v.a ** v.n], -v.a, { flechas: false, cabeza: [[[`x${sup(v.n)} + ${v.a ** v.n} entre `, null, 400], [`x + ${v.a}`, 'i', 700]]] })),
    lectura: v => [`n = ${v.n}; `, r_, ' = ', RS(f(restoMas(v))), restoMas(v) === 0 ? ': exacta' : ''],
    invitaciones: [
      { texto: 'Busca otro n, distinto de 3, que dé división exacta.', logrado: v => v.n !== 3 && restoMas(v) === 0, bien: 'Con n impar, (−a)ⁿ + aⁿ = 0: queda exacta.' },
      { texto: 'Haz que el resto sea 32.', logrado: v => restoMas(v) === 32, bien: 'n par: el resto es 2aⁿ, y 2 · 2⁴ = 32.' },
      { texto: 'Busca el mayor resto de la mesa.', logrado: v => restoMas(v) === Math.max(...[2, 3, 4, 5, 6].flatMap(n => [1, 2, 3].map(a => restoMas({ n, a })))), bien: '2 · 3⁶ = 1458: con n par el resto crece muy rápido.' },
      { texto: 'Guarda dos casos con el mismo a: uno exacto y otro con resto.',
        logrado: (v, guardados) => guardados.some(g => g.a === v.a && (restoMas(g) === 0) !== (restoMas(v) === 0)) && guardados.some(g => g.a === v.a && g.n === v.n),
        bien: 'Lo decide n: impar exacta, par con resto.' },
    ],
  };

  return {
    unidad: 'algebra.division-de-polinomios',
    version: '0.3.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/alg-losetas.js', '/nucleo/kit/piezas/alg-reparto.js', '/nucleo/kit/piezas/arit-calculadora.js'],
    colores: COLORES,
    // Tabla de letras de la unidad (propuesta §5; docs/metodo/unidad/reglas-validador.md, letras-datos).
    letras: {
      D: 'el dividendo', d: 'el divisor', q: 'el cociente', r: 'el resto', 'q′': 'el cociente falso, antes de dividir entre c',
      x: 'la variable; en las ideas 1, 4 y 5, el lado de la loseta en dm', y: 'la segunda variable',
      a: 'el número que anula al divisor x − a; en xⁿ − aⁿ, la segunda base', c: 'el primer coeficiente del divisor cx + b',
      b: 'el término independiente del divisor cx + b', n: 'el exponente de xⁿ − aⁿ y el número de términos de su cociente',
      k: 'el lugar de un término del cociente notable', m: 'un número por hallar, o un exponente cualquiera en una ley de exponentes',
      s: 'un exponente por hallar', P: 'el nombre de un polinomio en un enunciado', V: 'el volumen de una caja', t_k: 'el término de lugar k',
    },
    laboratorio: [mesaResto, mesaRuffini, mesaSigno],
    // Glosario por tema (docs/teoria.md §4d): las palabras que esta unidad estrena en álgebra, en la idea que las estrena.
    // Ninguna dice la respuesta de la predicción de su idea. «cociente» va como local: Inecuaciones lo define con otro
    // sentido (propuesta, decisión 8).
    glosario: [
      { termino: 'dividendo', simbolo: 'D', def: 'El polinomio que se reparte en una división: el que va antes del signo ÷.',
        simple: 'Todo lo que se reparte, como el pedido entero de Rubén.', ver: ['divisor'],
        ejemplos: ['En (x² − 1) ÷ (x − 1), es x² − 1.', 'En 17 ÷ 5, es 17.', 'En el pasadizo, es el pedido de piezas.'] },
      { termino: 'divisor', formas: ['divisor', 'divisores'], simbolo: 'd', def: 'El polinomio entre el que se divide.',
        simple: 'Entre qué se reparte, como el ancho del pasadizo.', ver: ['dividendo', 'resto'],
        ejemplos: ['En (x² − 1) ÷ (x − 1), es x − 1.', 'En 17 ÷ 5, es 5.', 'En un pasadizo de (x + 2) dm de ancho, es x + 2.'] },
      { termino: 'cociente', formas: ['cociente', 'cocientes'], simbolo: 'q', local: true, def: 'El polinomio que, multiplicado por el divisor, se acerca al dividendo lo más posible.',
        simple: 'Cuántas veces cabe el divisor, como el largo del pasadizo.', ver: ['resto'],
        ejemplos: ['(x² + 1) ÷ (x − 1) da x + 1, y sobra 2.', 'En 17 ÷ 5, es 3.', 'x² + 5x + 7 entre x + 2 da x + 3.'] },
      { termino: 'resto', formas: ['resto', 'restos'], simbolo: 'r', def: 'Lo que sobra al dividir; su grado es menor que el del divisor.',
        simple: 'Lo que sobra cuando ya no cabe otra vez el divisor.', ver: ['divisor'],
        ejemplos: ['(x² + 1) ÷ (x − 1): sobra 2.', 'En 17 ÷ 5, es 2.', 'x² + 5x + 7 entre x + 2 deja 1.'] },
      // Idea 2: división clásica, método de Horner y división exacta. Ninguno dice qué pasa con un primer coeficiente
      // distinto de 1 (la predicción).
      { termino: 'división clásica', formas: ['división clásica', 'divisiones clásicas', 'división por columnas'], def: 'La división hecha término a término, con una columna por cada potencia de x.',
        simple: 'La cuenta de dividir del colegio, columna por columna.', ver: ['método de Horner'],
        ejemplos: ['(x³ + 2x² + 4) ÷ (x² + 1) da cociente x + 2.', 'Cada columna es una potencia: x³, x², x, x⁰.', 'Lleva un 0 en cada potencia que falta.'] },
      { termino: 'método de Horner', formas: ['método de Horner', 'esquema de Horner', 'Horner'], def: 'La división clásica escrita solo con coeficientes, con los signos del divisor cambiados para sumar en vez de restar.',
        simple: 'La división por columnas, en una tabla y sumando.', ver: ['división clásica'],
        ejemplos: ['Para x² + x − 1, a la izquierda van 1, −1 y 1.', 'Sirve con divisores de grado 2 o más.', 'Da el mismo cociente y el mismo resto que la división clásica.'] },
      { termino: 'división exacta', formas: ['división exacta', 'divisiones exactas', 'exacta', 'exactas'], def: 'La división cuyo resto es 0.',
        simple: 'La que se reparte sin que sobre nada.', ver: ['divisible'],
        ejemplos: ['(x² − 1) ÷ (x − 1) = x + 1, sin resto.', 'x⁴ + 2x³ − x + 0 entre x² + x − 1 no lo es: deja resto.', '17 ÷ 5 no lo es: sobran 2.'] },
      // Idea 3: regla de Ruffini y anular. Ninguno habla de una potencia que falta (la predicción).
      { termino: 'regla de Ruffini', formas: ['regla de Ruffini', 'tabla de Ruffini', 'Ruffini'], def: 'Tabla corta para dividir entre x − a con los coeficientes: bajar, multiplicar por a y sumar.',
        simple: 'Una tabla de tres filas para dividir rápido entre x − a.', ver: ['anular'],
        ejemplos: ['Para dividir entre x − 3, a la izquierda va 3.', 'Para dividir entre x + 1, va −1.', 'La última casilla de abajo es el resto.'] },
      { termino: 'anular', formas: ['anula', 'anulan', 'anular', 'anule'], def: 'Hacer que un polinomio valga 0 al darle un valor a x.',
        simple: 'Hacer que algo valga 0.',
        ejemplos: ['x = 3 anula a x − 3.', 'x = −2 anula a x + 2.', 'x = 1/2 anula a 2x − 1.'] },
      // Idea 4: cociente falso y mónico. Ninguno dice qué se hace con el cociente falso (la predicción).
      { termino: 'cociente falso', formas: ['cociente falso', 'cocientes falsos'], simbolo: 'q′', def: 'Lo que da la tabla de Ruffini con un divisor cx + b, antes de dividirlo entre c.',
        simple: 'Lo que deja la tabla cuando el divisor empieza con 2x o 3x.', ver: ['mónico'],
        ejemplos: ['Con 2x + 2, la tabla usa x = −1.', 'Con 3x − 1, la tabla usa x = 1/3.', 'Con x − 5 no hay cociente falso: el divisor es mónico.'] },
      { termino: 'mónico', formas: ['mónico', 'mónicos', 'mónica'], def: 'Así es un polinomio cuyo primer coeficiente es 1.',
        simple: 'Que empieza con coeficiente 1, como x − 3.',
        ejemplos: ['x² − 3x + 1 lo es.', '2x + 1 no lo es: empieza con 2.', 'x − 5 lo es.'] },
      // Idea 5: teorema del resto y divisible. Ninguno evalúa el polinomio de la predicción.
      { termino: 'teorema del resto', def: 'Al dividir D(x) entre x − a, lo que sobra es D(a): basta evaluar, sin dividir.',
        simple: 'Para saber lo que sobra, basta evaluar: no hace falta dividir.', ver: ['resto', 'evaluar'],
        ejemplos: ['x² + 1 entre x − 2 deja 4 + 1 = 5.', 'x³ − 4x entre x − 1 deja 1 − 4 = −3.', 'Entre x + 3 se evalúa en −3.'] },
      { termino: 'divisible', def: 'Así es un polinomio cuando la división entre otro no deja nada sobrante.',
        simple: 'Que se puede repartir sin que sobre nada.', ver: ['división exacta'],
        ejemplos: ['x² − 9 lo es entre x − 3.', 'x² + 1 no lo es entre x − 1: deja 2.', 'Un polinomio que vale 0 en x = 4 lo es entre x − 4.'] },
      // Idea 6: cociente notable y término de lugar k. Ninguno dice el cuarto término de (x⁶ − 64) ÷ (x − 2).
      { termino: 'cociente notable', formas: ['cociente notable', 'cocientes notables'],
        def: 'División como (xⁿ − aⁿ) ÷ (x − a), que sale exacta y cuyo resultado se escribe sin dividir.',
        simple: 'Una división exacta que se escribe sin hacer la cuenta.',
        ejemplos: ['(x² − a²) ÷ (x − a) = x + a.', '(x³ − 1) ÷ (x − 1) = x² + x + 1.', '(x³ + 8) ÷ (x + 2) = x² − 2x + 4.'] },
      { termino: 'término de lugar k', formas: ['término de lugar k', 'término de lugar'], simbolo: 't_k', def: 'El término que ocupa el puesto k del cociente, contando desde el primero.',
        simple: 'El que está en el puesto k, contando desde el primero.',
        ejemplos: ['En x² + x + 1, el de lugar 2 es x.', 'En x³ + 2x² + 4x + 8, el de lugar 1 es x³.', 'El de lugar 3 de x⁴ + x³y + x²y² + … es x²y².'] },
    ],
    historia: {
      texto: 'Ordenar los coeficientes para evaluar y dividir rápido no tiene un solo inventor. El llamado método de Horner tiene antecedentes, y su artículo de 1819 ni siquiera trae el procedimiento moderno, que aparece recién en uno de 1830. Más que el nombre, importa por qué funciona: la división entre x − a junta cociente, resto y el valor P(a) en una sola tabla.',
      pregunta: '¿Por qué ordenar los coeficientes ahorra operaciones?',
      fuente: { titulo: 'O’Connor y Robertson, William Horner — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Horner/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'resto-libre': ['teorema-resto'],
      'ruffini-libre': ['ruffini', 'teorema-resto'],
      'notable-con-mas': ['cocientes-notables'],
    },
    // Orden de la propuesta (docs/etapa6/propuesta-algebra.md §1): la idea nueva de Horner en el segundo lugar.
    ideas: [algoritmo, hornerIdea, ruffiniIdea, divisorK, resto, notables],
  };
});
