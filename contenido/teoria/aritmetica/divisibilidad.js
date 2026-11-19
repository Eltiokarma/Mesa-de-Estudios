/*
 * Teoría de «Divisibilidad» (aritmetica.divisibilidad), para 5.º de secundaria y preuniversitario. Fuente del contenido:
 * docs/teoria/matriz/aritmetica.json (unidad 13) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 *
 * Etapa 5 del plan de calidad (19 nov), EN PROCESO: la propuesta es docs/etapa5/propuesta-aritmetica.md (Gerson delegó
 * el criterio y la revisa después). Seis ideas, en el orden de su §1, todas rehechas contra el contrato con sus 15
 * ejemplos: 1 `filas-de-m` (múltiplo), 2 `restos-suman` (principios), 3 `criterios` (últimas cifras y suma de cifras),
 * 4 `restos-potenciales`, 5 `criterios-pesos` (nueva: el 11, el 7 y el 13) y 6 `diofanticas`. La unidad todavía NO
 * lleva calidad: 2: la marca la sesión después del lector en frío y del auditor. Hilo de la unidad: el puesto de
 * caramelos de doña Juana (pieza arit-puesto, dibujo de prueba), la rifa de la promoción (piezas arit-boletos y
 * arit-boleto, de prueba) y las monedas del mostrador (pieza arit-monedas, de prueba). Práctica por idea:
 * plantillas/divisibilidad-restos (TIPOS_POR_IDEA).
 *
 * Letras (propuesta §6; def.letras): N es el número que se estudia (el dividendo, que Las cuatro operaciones llamó D:
 * aquí va N, como en el examen) y d el divisor, lo que lleva una bolsita. El múltiplo de d se escribe con un circulito
 * encima ({ mult } de nucleo/ecuacion.js), como en el examen: N = 7̊ + 3. k es el entero que multiplica (N = d × k); con
 * resto, q, r y rₑ, los de Las cuatro operaciones. × para multiplicar; nunca «·» (el «   ·   » solo separa dos
 * relaciones en una regla). a, b y c son cifras; ninguna letra para la base ni el exponente de una potencia.
 *
 * REGLA DE COLORES DE LA UNIDAD: un color fijo por magnitud (docs/molde-unidad.md §5b; propuesta §7), en la tabla
 * COLORES (def.colores). El criterio es el de la rama, lo que cada cosa es en el puesto:
 *   - turquesa (c-i), «envase»: el divisor d (lo que lleva una bolsita), el número bajo el circulito y los boletos
 *     premiados (los múltiplos de d);
 *   - naranja (c-o), «sobra»: el resto, los sueltos que quedan (también cuando es lo que se pide);
 *   - violeta (c-f), «busca»: lo que se busca y no es un resto: cuántos múltiplos hay, el número que se pide, la cifra
 *     oculta, x e y; y el resto por exceso, como en Las cuatro operaciones;
 *   - tinta: N cuando se da, k y q, las cifras conocidas, los caramelos, «?»;
 *   - ni verde ni carmín.
 *   La letra de una alternativa va en negrita y en tinta ({ negrita }). Cada ficha de color dice su
 *   magnitud (m); contenido/teoria/aritmetica/divisibilidad.test.js falla si una cambia de color.
 * Errores: los AT-* son hipótesis de aula (tabla «Divisibilidad (19 nov)» de
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md); ver el bloque de cada idea.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver la divisibilidad como empacar sin que sobre, y los restos como lo único que hay que seguir.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, sin audio, con lápiz al lado.
 *   Resultado observable: dice si un número es múltiplo de otro, cuenta múltiplos en un tramo, halla restos de sumas,
 *     productos y potencias, usa un criterio con cifras ocultas y resuelve ax + by = c con enteros.
 *   Orden de atención: 1.º el objeto (el pedido en bolsitas o la plancha de boletos) · 2.º la lectura · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · misión lograda · predicción · coincide / no coincide · paso a paso ·
 *     caso nuevo · «No sé».
 *   Duda que resuelve: «¿cuándo no sobra nada, y cómo se sabe sin hacer toda la división?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const mod = (x, k) => ((x % k) + k) % k;
  const mcd = (x, y) => (y ? mcd(y, x % y) : Math.abs(x));
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = x => String(x).split('').map(c => SUP[+c]).join('');
  const powmod = (b, e, k) => { let x = 1; for (let i = 0; i < e; i++) x = (x * b) % k; return x; };
  function azar(s) {
    let z0 = (s * 2654435761 + 12345) >>> 0;
    const g = () => { z0 = (z0 + 0x6D2B79F5) >>> 0; let z = z0; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    g.ent = (lo, hi) => lo + Math.floor(g() * (hi - lo + 1));
    g.de = xs => xs[Math.floor(g() * xs.length)];
    return g;
  }
  function opciones(correcta, distractores, fmt = x => String(x)) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      if (x.valor === null || x.valor === undefined || (typeof x.valor === 'number' && !Number.isFinite(x.valor))) continue;
      const txt = fmt(x.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Gesto directo (docs/teoria.md §4b). Las fichas cuelgan de arriba (arit-fichas, arriba: true): la ficha número k
  // no se mueve cuando n crece, así que la última ficha se puede agarrar. Como el tamaño de la ficha cambia con la
  // cantidad de filas, mover no invierte una escala: elige el valor cuya manija quedaría más cerca del dedo. Eso
  // depende solo del dedo, y la manija no se dispara aunque la figura se reacomode.
  const FICHAS = () => Kit.piezas['arit-fichas'], TABLA = () => Kit.piezas['arit-tabla'];
  const rango = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const masCerca = (cands, pos, pt) => {
    let mejor = cands[0], dm = Infinity;
    for (const c of cands) { const p = pos(c), d2 = (p.x - pt.x) ** 2 + (p.y - pt.y) ** 2; if (d2 < dm - 1e-9) { dm = d2; mejor = c; } }
    return mejor;
  };
  const ultima = (datos, k, n) => FICHAS().geometria(datos).ficha(k, n - 1);
  // El borde izquierdo de la primera fila (el bloque está centrado: crece hacia los dos lados). El derecho quedaba bajo
  // el botón de la lupa, arriba a la derecha.
  const bordeFila = (datos, k) => { const g = FICHAS().geometria(datos), c = g.caja(k); return { x: c.x, y: c.y + g.paso / 2 }; };
  // En la tabla se arrastra la fila por su borde derecho (como en lógica): la fila elegida es el exponente.
  const manijaFila = (datos, i) => { const g = TABLA().geometria(datos); return { x: g.xs[g.xs.length - 1] - 12, y: g.filaY(i) + g.altoFila / 2 }; };
  const filaEn = (datos, y, hasta) => { const g = TABLA().geometria(datos); return Math.max(0, Math.min(hasta, Math.floor((y - g.filaY(0)) / g.altoFila))); };
  const ARRIBA = { arriba: true };
  const filas = (nv, mv, extra = {}) => {
    const rv = nv % mv;
    return Object.assign({ bloques: [{ n: nv, columnas: mv, color: 'i', marcoFilas: true, rotulo: rv ? `${nv} = ${mv} × ${Math.floor(nv / mv)} + ${rv}` : `${nv} = ${mv} × ${nv / mv}`, tramos: rv ? [{ de: nv - rv, a: nv - 1, color: 'o' }] : [] }], altoMax: 160, ficha: 24, alt: `${nv} fichas en filas de ${mv}: ${Math.floor(nv / mv)} filas llenas${rv ? ` y sobran ${rv}` : ', no sobra ninguna'}` }, extra);
  };

  // Arrastres de las fichas en filas: los usa la mesa del laboratorio «filas-grandes» (el juego de la idea 1 ya es el
  // puesto de doña Juana).
  const arrastresFilas = (nMin, nMax, mMin, mMax, extra) => [
    { id: 'ultima', etiqueta: 'última ficha (cuántas hay)',
      donde: v => ultima(filas(v.n, v.m, extra), 0, v.n),
      mover: (pt, v) => ({ n: masCerca(rango(nMin, nMax), c => ultima(filas(c, v.m, extra), 0, c), pt) }) },
    { id: 'fila', etiqueta: 'borde de la primera fila (su largo)', color: 'c-i',
      donde: v => bordeFila(filas(v.n, v.m, extra), 0),
      mover: (pt, v) => ({ m: masCerca(rango(mMin, Math.min(mMax, v.n)), c => ({ x: bordeFila(filas(v.n, c, extra), 0).x, y: pt.y }), pt) }) },
  ];

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba divisibilidad.test.js) ----------
  const COLORES = { envase: 'i', sobra: 'o', busca: 'f' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: String(t), m: mg });
  const bas = ficha('envase'), sob = ficha('sobra'), res = ficha('busca');
  // «Múltiplo de d», como en el examen: el número con su circulito ({ mult } de nucleo/ecuacion.js).
  const MU = d => ({ mult: [bas(d)] });
  // La letra de una alternativa, en negrita y en tinta: sin color, para que una trampa no parezca la respuesta.
  const letra = L => ({ negrita: [L] });
  // Entre dos relaciones de una misma ecuación (en la regla, cada una en su línea).
  const SEP = '   ·   ';
  const sobranT = k => (k === 1 ? 'sobra 1' : `sobran ${k}`);
  function conCuatro(caso, r) {
    for (let i = 0; i < 4000; i++) { const c = caso(r); if (c && c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }

  // ---------- Idea 1 (rehecha, 19 nov): múltiplo: bolsitas llenas, ningún suelto (múltiplos y divisores) ----------
  // Propuesta: docs/etapa5/propuesta-aritmetica.md §1 a §7. Conserva el id `filas-de-m` y los controles `n` y `m` (no se
  // pierde el avance de nadie); la mesa `filas-grandes` sigue con las fichas en filas.
  // Objeto: el puesto de doña Juana (pieza arit-puesto, dibujo de prueba), con los caramelos empacados en bolsitas de d,
  // y la plancha de boletos de la rifa de la promoción (pieza arit-boletos, de prueba), con un premio cada d boletos.
  // Cambia: cuántos caramelos hay y cuántos lleva una bolsita. · Permanece: la regla de empacar y la escala. · Progresa:
  // bolsitas llenas → los sueltos que quedan → ningún suelto. · Se reserva: contar cuántos múltiplos hay hasta un número
  // (los premios de la rifa): es de la predicción. · Debe verse: N es múltiplo de d justo cuando no queda ningún suelto.
  // Errores (hipótesis de aula, sin medir: el informe de aritmética no trae divisibilidad): AT-CONTEO-ARRIBA redondea el
  // cociente hacia arriba · AT-MULT-PROPIO no cuenta al número como múltiplo de sí mismo · AT-MULT-TERMINA toma por
  // múltiplos los que terminan en esa cifra · AT-MULT-VECINO acepta un número que está a 1 de un múltiplo · AT-MULT-
  // CIFRAS suma las cifras donde no toca · AT-MULT-EXTREMO responde el mayor o el menor número sin comprobar ·
  // AT-MULT-ANTERIOR, AT-MULT-PASA se quedan un múltiplo antes o se pasan · AT-CONTEO-RESTO responde lo que sobra ·
  // AT-CONTEO-SIN-QUITAR cuenta desde el 1 · AT-CONTEO-POSTE resta los extremos y no suma 1 · AT-CONTEO-QUITA-MAL
  // quita otro tramo · AT-RAZON-TOTAL, AT-RAZON-RESTO, AT-RAZON-GRUPOS responden el total, la otra parte o los grupos.
  const PU = 'arit-puesto', BO = 'arit-boletos';
  const PUESTO = () => Kit.piezas[PU];
  const fig = datos => ({ pieza: PU, datos, estado: {} });
  const plancha = datos => ({ pieza: BO, datos, estado: {} });
  // Un montón sin empacar junto al letrero de la bolsita: el planteamiento de un ejemplo, sin la respuesta.
  const monton = (d, N) => fig({ n: d, sueltos: N, regla: 1, rotulos: { sueltos: `${N} caramelos` } });
  const cartel = d => [['Premio: múltiplos de '], [String(d), 'i', 700]];
  // Datos que se repiten (punto 13: herramientas, no el paso hecho). Toda letra se dice en su línea o en def.letras.
  const DM = {
    def: ['N es múltiplo de ', bas('d'), ' si N = ', bas('d'), ' × k, con k un entero'],
    div: ['N = ', bas('d'), ' × q + ', sob('r'), ': q bolsitas llenas de ', bas('d'), ' y sobran ', sob('r')],
    conteo: ['Del 1 al N hay tantos múltiplos de ', bas('d'), ' como el cociente entero de N ÷ ', bas('d')],
    dos: 'Los números de dos cifras van del 10 al 99',
    tres: 'Los números de tres cifras van del 100 al 999',
  };
  const CTRL_M = [
    { id: 'n', etiqueta: 'Caramelos que tiene', min: 12, max: 40, paso: 1, inicio: 30, decimales: 0 },
    { id: 'm', etiqueta: 'Caramelos por bolsita', color: 'c-i', min: 2, max: 9, paso: 1, inicio: 4, decimales: 0 },
  ];
  const puestoM = (v, escala) => {
    const q = Math.floor(v.n / v.m), r = v.n % v.m;
    // El letrero dice también cuántos caramelos hay (dos líneas: no queda una sola flotando; revisión del 19 nov).
    return { n: v.m, bolsitas: q, sueltos: r, ceros: true, escala, colorCifras: false,
      regla: [[['1 bolsita = '], [String(v.m), 'i', 700], [' caramelos']], [[`Tiene ${v.n} caramelos`]]],
      rotulos: { bolsitas: q === 1 ? '1 bolsita llena' : `${q} bolsitas llenas`, sueltos: r ? [[String(r), 'o', 700], [r === 1 ? ' suelto' : ' sueltos']] : 'ningún suelto' } };
  };
  // Una escala por tamaño de bolsita (la que hace caber el pedido más grande con esa bolsita): al cambiar los caramelos
  // el dibujo no salta, y al cambiar la bolsita, que ya es otro envase, se aprovecha la altura del puesto (revisión del
  // 19 nov: con una sola escala quedaba una franja vacía sobre las bolsitas).
  const escM = {};
  const escalaM = m => {
    if (escM[m]) return escM[m];
    let mn = 1.7;
    for (let n = 12; n <= 40; n++) mn = Math.min(mn, PUESTO().geometria(puestoM({ n, m })).sCabe);
    return (escM[m] = Math.floor(mn * 100) / 100);
  };
  // Predice, «Mira» y la regla: la plancha de la rifa del 1 al 50, con premio para los múltiplos de 6.
  const RIFA = { desde: 1, hasta: 50, premio: 6, letrero: cartel(6) };
  const MIRA_RIFA = Object.assign({}, RIFA, { pasos: [
    { marcar: false },
    { marcar: 1 },
    { marcar: true },
    { grupos: true },
    { grupos: true, sobran: true },
    { grupos: true, sobran: true, pie: [['8', 'f', 700], [' premios: uno por cada grupo completo']] },
  ] });

  // Ahora tú · tipo 0: ¿cuál de cuatro pedidos se empaca sin sueltos? (reconocer un múltiplo; las trampas son números).
  function casoCual(r) {
    const d = r.de([6, 7, 8]), k = r.ent(7, 13), N = d * k;
    const kv = r.ent(7, 13), vecino = d * kv + r.de([-1, 1]);
    const termina = r.de([2, 3, 4, 5, 6, 7, 8, 9].map(x => 10 * x + d).filter(x => x % d !== 0));
    const cifras = r.de(Array.from({ length: 90 }, (_, i) => 10 + i).filter(x => Math.floor(x / 10) + (x % 10) === d && x % d !== 0));
    if (new Set([N, vecino, termina, cifras]).size < 4 || vecino % d === 0) return null;
    const cerca = Math.round(vecino / d) * d;
    return {
      pregunta: ['Doña Juana tiene bolsitas de ', bas(d), ' caramelos. ¿Cuál de estos pedidos se empaca sin que quede ningún caramelo suelto?'],
      datos: [DM.def, DM.div],
      opciones: opciones(N, [
        { id: 'vecino', valor: vecino, error: 'AT-MULT-VECINO', siFuera: `Está cerca: ${cerca} sí es múltiplo de ${d}. Pero con ${vecino} ${vecino > cerca ? 'sobra' : 'falta'} 1.` },
        { id: 'termina', valor: termina, error: 'AT-MULT-TERMINA', siFuera: `Terminar en ${d} no basta: ${termina} = ${d} × ${Math.floor(termina / d)} + ${termina % d}, ${sobranT(termina % d)}.` },
        { id: 'cifras', valor: cifras, error: 'AT-MULT-CIFRAS', siFuera: `Que sus cifras sumen ${d} no lo decide: ${cifras} = ${d} × ${Math.floor(cifras / d)} + ${cifras % d}.` },
      ], x => `${x} caramelos`),
      solucion: { texto: `${N} llena ${k} bolsitas de ${d}, sin sueltos.`, ecuacion: [`${N} = `, bas(d), ` × ${k}`] },
    };
  }
  // Ahora tú · tipo 1: el mayor múltiplo de dos cifras o el menor de tres.
  function casoExtremo(r) {
    const d = r.de([6, 7, 8, 12, 13, 14, 15, 16, 17, 18, 19]), mayor = r() < 0.5;
    const tope = mayor ? 99 : 100, q = Math.floor(tope / d), rr = tope % d;
    if (!rr) return null;
    const M = mayor ? d * q : d * (q + 1);
    return {
      pregunta: [mayor ? '¿Cuál es el mayor múltiplo de ' : '¿Cuál es el menor múltiplo de ', bas(d), mayor ? ' que tiene dos cifras?' : ' que tiene tres cifras?'],
      datos: [DM.def, DM.div, mayor ? DM.dos : DM.tres],
      opciones: opciones(M, [
        { id: 'extremo', valor: tope, error: 'AT-MULT-EXTREMO', siFuera: `${tope} es el ${mayor ? 'mayor de dos' : 'menor de tres'} cifras, pero ${tope} = ${d} × ${q} + ${rr}: ${sobranT(rr)}.` },
        { id: 'antes', valor: M - d, error: 'AT-MULT-ANTERIOR', siFuera: mayor ? `Es múltiplo de ${d}, pero hay uno mayor de dos cifras: súmale ${d}.` : `Es múltiplo de ${d}, pero tiene dos cifras: no llega a 100.` },
        { id: 'despues', valor: M + d, error: 'AT-MULT-PASA', siFuera: mayor ? `Es múltiplo de ${d}, pero ya tiene tres cifras: se pasó de 99.` : `Es múltiplo de ${d}, pero hay uno menor de tres cifras: réstale ${d}.` },
      ]),
      solucion: mayor
        ? { texto: `99 = ${d} × ${q} + ${rr}: se le quita lo que sobra.`, ecuacion: ['99 − ', sob(rr), ' = ', res(M)] }
        : { texto: `100 = ${d} × ${q} + ${rr}: el siguiente múltiplo es una bolsita más.`, ecuacion: [bas(d), ` × ${q + 1} = `, res(M)] },
    };
  }
  // Ahora tú · tipo 2: cuántos premios en una plancha del 1 al N.
  function casoPremios(r) {
    const d = r.de([6, 7, 8, 9]), N = r.ent(60, 200), q = Math.floor(N / d), rr = N % d;
    if (!rr) return null;
    const terminan = Math.floor((N - d) / 10) + 1;
    return {
      pregunta: ['La promoción vende los boletos del 1 al ', String(N), '. Hay premio para cada boleto cuyo número es múltiplo de ', bas(d), '. ¿Cuántos premios se entregan?'],
      datos: [DM.def, DM.conteo],
      opciones: opciones(q, [
        { id: 'arriba', valor: q + 1, error: 'AT-CONTEO-ARRIBA', siFuera: `Dividir está bien. Pero el grupo ${q + 1} no se completa: su premio sería el boleto ${d * (q + 1)}.` },
        { id: 'propio', valor: q - 1, error: 'AT-MULT-PROPIO', siFuera: `Contar de ${d} en ${d} está bien. Pero el boleto ${d} también gana: ${d} = ${d} × 1.` },
        { id: 'termina', valor: terminan, error: 'AT-MULT-TERMINA', siFuera: `Esos son los boletos que terminan en ${d}. Un múltiplo de ${d} es ${d} por un entero.` },
        { id: 'resto', valor: rr, error: 'AT-CONTEO-RESTO', siFuera: `${rr === 1 ? '1 es el boleto que sobra' : `${rr} son los boletos que sobran`} al final. Los premios son los grupos completos.` },
      ]),
      solucion: { texto: `Cada grupo completo de ${d} boletos termina en un premio: ${N} = ${d} × ${q} + ${rr}.`, ecuacion: ['hay ', res(q), ' premios'] },
    };
  }
  // Ahora tú · tipo 3 (nivel examen): cuántos múltiplos de d tienen tres cifras.
  function casoTresCifras(r) {
    const d = r.ent(7, 45), A = Math.floor(999 / d), B = Math.floor(99 / d), U = Math.floor(9 / d), c = A - B;
    return {
      pregunta: ['¿Cuántos múltiplos de ', bas(d), ' tienen tres cifras?'],
      datos: [DM.def, DM.conteo, DM.tres],
      opciones: opciones(c, [
        { id: 'sin', valor: A, error: 'AT-CONTEO-SIN-QUITAR', siFuera: `Hasta 999 hay ${A}, es cierto. Pero ${B} de ellos tienen menos de tres cifras.` },
        { id: 'poste', valor: c - 1, error: 'AT-CONTEO-POSTE', siFuera: 'Restar el último menos el primero y dividir está bien. Pero falta sumar 1: se cuentan los dos extremos.' },
        { id: 'quita', valor: U ? A - U : c + 1, error: 'AT-CONTEO-QUITA-MAL', siFuera: `Quitar los de antes está bien. Pero antes del 100 hay ${B}: los de una y de dos cifras.` },
      ]),
      solucion: { texto: `Hasta 999 hay ${A}; se quitan los ${B} que no llegan a 100.`, ecuacion: [`${A} − ${B} = `, res(c)] },
    };
  }
  // Ahora tú · tipo 4 (nivel examen; San Marcos 2019-I): «p de cada d» obliga a que el total sea múltiplo de d.
  function casoRazon(r) {
    const d = r.ent(7, 12), k = r.ent(5, 12), p = r.ent(2, d - 2), T = d * k;
    const L = T - r.ent(1, d - 1), U = T + r.ent(1, d - 1);
    if (2 * p === d) return null;
    return {
      pregunta: `En una rifa, ${p} de cada ${d} boletos vendidos los compraron alumnos de quinto. Se vendieron más de ${L} y menos de ${U} boletos. ¿Cuántos compraron los de quinto?`,
      datos: [`«${p} de cada ${d}»: por cada grupo de ${d} boletos, ${p}`, DM.def],
      opciones: opciones(p * k, [
        { id: 'total', valor: T, error: 'AT-RAZON-TOTAL', siFuera: `${T} son todos los boletos vendidos. Se piden los que compraron los de quinto.` },
        { id: 'otros', valor: (d - p) * k, error: 'AT-RAZON-RESTO', siFuera: `Esos son los que no compraron los de quinto: ${d - p} de cada ${d}.` },
        { id: 'grupos', valor: k, error: 'AT-RAZON-GRUPOS', siFuera: `${k} son los grupos de ${d} boletos. En cada grupo, ${p} son de quinto.` },
      ]),
      solucion: { texto: `El total es múltiplo de ${d}: entre ${L} y ${U} solo está ${T} = ${d} × ${k}.`, ecuacion: [`${p} × ${k} = `, res(p * k)] },
    };
  }

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h): 5 de nivel 1, 5 de nivel 2 y 5 de nivel 3, estos con
  // cinco alternativas (A a E). Cuentas rehechas aparte, sin este archivo (scratchpad de la sesión, e5-aritmetica/
  // cuentas-idea1.js, por fuerza bruta): 35 = 7 × 5; 45 = 6 × 7 + 3; múltiplos de 12: 12, 24, 36, 48 y 60; 48 = 6 × 8;
  // 0 = 7 × 0 y 7 = 1 × 7; del 1 al 75 hay 9 múltiplos de 8 (75 = 8 × 9 + 3); 99 = 8 × 12 + 3 → 96; 100 = 7 × 14 + 2 →
  // 105; 63 = 7 × 9, y con 6 y con 8 sobran 3 y 7; del 20 al 70 hay 11 − 3 = 8 múltiplos de 6 (24 a 66); múltiplos de 7
  // de dos cifras: 14 − 1 = 13 (trampas 12, 14, 15 y 90); entre 50 y 60 solo 56 = 8 × 7 es múltiplo de 8 → 5 × 7 = 35
  // (trampas 21, 56, 7 y 40); 999 = 13 × 76 + 11 → 988, cifras 25 (trampas 27, 21, 2 y 11); 91 = 7 × 13 → 13 bolsitas
  // (con 9, 11 y 17 bolsitas sobran 1, 3 y 6); del 1 al 150 hay 37 múltiplos de 4 → 113 no lo son (trampas 37, 112, 114
  // y 146). La figura muestra lo que da el enunciado (el montón, la plancha sin marcar), nunca el resultado. Ningún
  // ejemplo usa los números de la predicción (boletos del 1 al 50, múltiplos de 6) ni de la misión (28 y 7).
  const EJEMPLOS_MULTIPLO = [
    { nivel: 1, titulo: 'Un pedido sin sueltos',
      enunciado: 'Doña Juana empaca 35 caramelos en bolsitas de 7. ¿Sobra alguno? ¿Es 35 múltiplo de 7?',
      datos: [DM.def, DM.div],
      figura: monton(7, 35),
      solucion: [{ texto: 'Llena 5 bolsitas: 7 × 5 es justo 35. No queda ningún caramelo suelto.', ecuacion: ['35 = ', bas(7), ' × 5'] }],
      respuesta: ['Sobran ', sob(0), ': 35 sí es múltiplo de ', bas(7)] },
    { nivel: 1, titulo: 'Un pedido con sueltos',
      enunciado: '¿Es 45 múltiplo de 6?',
      datos: [DM.def, DM.div],
      figura: monton(6, 45),
      solucion: [{ texto: 'El múltiplo de 6 que queda justo debajo de 45 es 42: se llenan 7 bolsitas y sobran 3.', ecuacion: ['45 = ', bas(6), ' × 7 + ', sob(3)] }],
      respuesta: ['No: sobran ', sob(3)] },
    { nivel: 1, titulo: 'Los primeros múltiplos',
      enunciado: '¿Cuáles son los cinco primeros múltiplos positivos de 12?',
      datos: [DM.def],
      solucion: [{ texto: 'Se multiplica 12 por 1, 2, 3, 4 y 5. Salen de 12 en 12.', ecuacion: [bas(12), ' × 1 = 12 ; ', bas(12), ' × 2 = 24 ; … ; ', bas(12), ' × 5 = 60'] }],
      respuesta: [res('12, 24, 36, 48 y 60')] },
    { nivel: 1, titulo: 'Múltiplo y divisor a la vez',
      enunciado: 'En 48 = 6 × 8, ¿qué es 48 de 6, y qué es 6 de 48?',
      datos: [DM.def, ['Si N es múltiplo de ', bas('d'), ', entonces ', bas('d'), ' es divisor de N']],
      solucion: [
        { texto: '48 es 6 por un entero: es múltiplo de 6. Y 6 lo divide sin que sobre nada: es su divisor.', ecuacion: ['48 = ', MU(6)] },
        { texto: 'Con el 8 pasa igual: 48 es múltiplo de 8, y 8 es divisor de 48.', ecuacion: ['48 = ', MU(8)] },
      ],
      respuesta: ['48 es ', res('múltiplo'), ' de 6; 6 es ', res('divisor'), ' de 48'] },
    { nivel: 1, titulo: 'El cero y el uno',
      enunciado: '¿Es 0 múltiplo de 7? ¿Es 7 múltiplo de 1?',
      datos: [DM.def],
      solucion: [
        { texto: 'Cero bolsitas de 7 son 0 caramelos: 0 es 7 por un entero.', ecuacion: ['0 = ', bas(7), ' × 0'] },
        { texto: 'En bolsitas de 1 caramelo nunca sobra nada: llena 7.', ecuacion: ['7 = ', bas(1), ' × 7'] },
      ],
      respuesta: [res('Sí'), ', las dos veces'] },
    { nivel: 2, titulo: 'Premios de una rifa',
      enunciado: 'Se venden los boletos del 1 al 75. Hay premio para cada boleto cuyo número es múltiplo de 8. ¿Cuántos premios hay?',
      datos: [DM.def, DM.conteo],
      figura: plancha({ desde: 1, hasta: 75, premio: 8, marcar: false, letrero: cartel(8) }),
      solucion: [
        { texto: 'Cada grupo completo de 8 boletos seguidos termina en un premio. Divido 75 entre 8.', ecuacion: ['75 = ', bas(8), ' × 9 + ', sob(3)] },
        { texto: 'Son 9 grupos completos. Los 3 boletos que sobran no alcanzan para otro premio.' },
      ],
      respuesta: [res(9), ' premios'] },
    { nivel: 2, titulo: 'El mayor de dos cifras',
      enunciado: '¿Cuál es el mayor múltiplo de 8 que tiene dos cifras?',
      datos: [DM.def, DM.div, DM.dos],
      solucion: [
        { texto: 'El mayor número de dos cifras es 99. Lo divido entre 8.', ecuacion: ['99 = ', bas(8), ' × 12 + ', sob(3)] },
        { texto: 'Le quito los 3 que sobran y queda un múltiplo de 8.', ecuacion: ['99 − ', sob(3), ' = ', res(96)] },
      ],
      respuesta: [res(96), ', que es 8 × 12'] },
    { nivel: 2, titulo: 'El menor de tres cifras',
      enunciado: '¿Cuál es el menor múltiplo de 7 que tiene tres cifras?',
      datos: [DM.def, DM.div, DM.tres],
      solucion: [
        { texto: 'El menor número de tres cifras es 100. Lo divido entre 7.', ecuacion: ['100 = ', bas(7), ' × 14 + ', sob(2)] },
        { texto: '100 no es múltiplo: sobran 2. El siguiente múltiplo tiene una bolsita más.', ecuacion: [bas(7), ' × 15 = ', res(105)] },
      ],
      respuesta: [res(105), ', que es 7 × 15'] },
    { nivel: 2, titulo: '¿De cuántos es la bolsita?',
      enunciado: 'Doña Juana empaca 63 caramelos sin que sobre ninguno, en bolsitas de más de 5 y menos de 10 caramelos. ¿De cuántos caramelos puede ser la bolsita?',
      datos: [DM.def, DM.div],
      solucion: [
        { texto: 'Pruebo cada tamaño. Con 6 sobran 3 y con 8 sobran 7. Con 7 no sobra nada, y con 9 tampoco.', ecuacion: ['63 = ', bas(7), ' × 9 = ', bas(9), ' × 7'] },
        { texto: 'Los dos van juntos: 9 bolsitas de 7 son los mismos caramelos que 7 bolsitas de 9.' },
      ],
      respuesta: ['De ', bas(7), ' o de ', bas(9), ' caramelos'] },
    { nivel: 2, titulo: 'Múltiplos en un tramo',
      enunciado: '¿Cuántos múltiplos de 6 hay del 20 al 70?',
      datos: [DM.def, DM.conteo],
      figura: plancha({ desde: 20, hasta: 70, premio: 6, marcar: false }),
      solucion: [
        { texto: 'Del 1 al 70 hay 11 múltiplos de 6.', ecuacion: ['70 = ', bas(6), ' × 11 + ', sob(4)] },
        { texto: 'Tres de ellos quedan antes del 20: son 6, 12 y 18. Se quitan.', ecuacion: ['19 = ', bas(6), ' × 3 + ', sob(1), ' ; 11 − 3 = ', res(8)] },
        { texto: 'Compruebo: van del 24 al 66, de 6 en 6.', ecuacion: ['(66 − 24) ÷ 6 + 1 = ', res(8)] },
      ],
      respuesta: [res(8), ' múltiplos'] },
    { nivel: 3, titulo: 'Múltiplos de dos cifras',
      enunciado: '¿Cuántos múltiplos de 7 tienen dos cifras?',
      alternativas: ['12', '13', '14', '15', '90'],
      datos: [DM.def, DM.conteo, DM.dos],
      solucion: [
        { texto: 'Del 1 al 99 hay 14 múltiplos de 7.', ecuacion: ['99 = ', bas(7), ' × 14 + ', sob(1)] },
        { texto: 'Uno de ellos, el 7, tiene una sola cifra: se quita.', ecuacion: ['14 − 1 = ', res(13)] },
        { texto: ['Las trampas: ', letra('A'), ' resta 98 − 14 y no suma 1; ', letra('C'), ' cuenta el 7; ', letra('D'), ' redondea hacia arriba; ', letra('E'), ' cuenta todos los números.'] },
      ],
      respuesta: [letra('B'), ': ', res(13), ' múltiplos'] },
    { nivel: 3, titulo: 'Tres de cada ocho',
      enunciado: 'En una kermés, 3 de cada 8 asistentes compraron rifa. Asistieron más de 50 y menos de 60 personas. ¿Cuántas no compraron rifa?',
      alternativas: ['21', '56', '7', '35', '40'],
      datos: ['«3 de cada 8»: por cada grupo de 8 asistentes, 3', DM.def],
      solucion: [
        { texto: 'Los asistentes se cuentan en grupos completos de 8: el total es múltiplo de 8. Entre 50 y 60 solo está 56.', ecuacion: ['56 = ', bas(8), ' × 7'] },
        { texto: 'Son 7 grupos, y en cada uno 8 − 3 = 5 no compraron.', ecuacion: ['5 × 7 = ', res(35)] },
        { texto: ['Las trampas: ', letra('A'), ' son los que compraron; ', letra('B'), ', todos; ', letra('C'), ', los grupos; ', letra('E'), ' usa 64, que pasa de 60.'] },
      ],
      respuesta: [letra('D'), ': ', res(35), ' personas'] },
    { nivel: 3, titulo: 'El mayor de tres cifras',
      enunciado: '¿Cuánto suman las cifras del mayor múltiplo de 13 que tiene tres cifras?',
      alternativas: ['25', '27', '21', '2', '11'],
      datos: [DM.def, DM.div, DM.tres],
      solucion: [
        { texto: 'El mayor número de tres cifras es 999. Lo divido entre 13.', ecuacion: ['999 = ', bas(13), ' × 76 + ', sob(11)] },
        { texto: 'Le quito los 11 que sobran: 988. Sumo sus cifras.', ecuacion: ['9 + 8 + 8 = ', res(25)] },
        { texto: ['Las trampas: ', letra('B'), ' usa 999; ', letra('C'), ', 975, un múltiplo antes; ', letra('D'), ', 1 001, de cuatro cifras; ', letra('E'), ' es lo que sobra.'] },
      ],
      respuesta: [letra('A'), ': suman ', res(25)] },
    { nivel: 3, titulo: 'Un reparto exacto',
      enunciado: 'Doña Juana reparte 91 caramelos en bolsitas iguales, sin que sobre ninguno. Arma más de 10 bolsitas y cada una lleva más de 1 caramelo. ¿Cuántas bolsitas arma?',
      alternativas: ['7', '9', '11', '17', '13'],
      datos: [DM.def, DM.div],
      solucion: [
        { texto: 'Busco un divisor de 91. Con 2, 3 y 5 siempre sobra 1. Con 7 no sobra nada.', ecuacion: ['91 = ', bas(7), ' × 13'] },
        { texto: 'Las bolsitas son más de 10: arma 13 bolsitas, de 7 caramelos cada una.' },
        { texto: ['Las trampas: ', letra('A'), ' es lo que lleva cada bolsita; con ', letra('B'), ', ', letra('C'), ' o ', letra('D'), ' bolsitas sobrarían 1, 3 y 6 caramelos.'] },
      ],
      respuesta: [letra('E'), ': ', res(13), ' bolsitas'] },
    { nivel: 3, titulo: 'Los que no son múltiplos',
      enunciado: 'Del 1 al 150, ¿cuántos números no son múltiplos de 4?',
      alternativas: ['37', '112', '113', '114', '146'],
      datos: [DM.def, DM.conteo],
      solucion: [
        { texto: 'Primero cuento los que sí son múltiplos de 4, del 1 al 150.', ecuacion: ['150 = ', bas(4), ' × 37 + ', sob(2)] },
        { texto: 'Son 37. Todos los demás no lo son.', ecuacion: ['150 − 37 = ', res(113)] },
        { texto: ['Las trampas: ', letra('A'), ' cuenta los que sí son; ', letra('B'), ' redondea a 38; ', letra('D'), ' no cuenta el 4; ', letra('E'), ' resta 150 − 4.'] },
      ],
      respuesta: [letra('C'), ': ', res(113), ' números'] },
  ];

  const multiplos = {
    id: 'filas-de-m',
    titulo: 'Múltiplo: bolsitas llenas, ningún suelto',
    pregunta: '¿Cuándo un número es múltiplo de otro?',
    temas: ['Múltiplos y divisores'],
    pieza: PU,
    aprendizaje: 'N es múltiplo de d, y d divisor de N, si N caramelos llenan bolsitas de d sin sueltos: N = d × k.',
    actividad: 'Cambiar el tamaño de la bolsita hasta que no quede ningún caramelo suelto.',
    // Lee: el puesto, las dos palabras (ya son de Las cuatro operaciones), la escritura del examen y la rifa. No cuenta
    // cuántos múltiplos hay hasta un número (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'Empacar sin que sobre', texto: ['Doña Juana empaca 27 caramelos en bolsitas de ', bas(9), ': llena 3 y no queda ninguno suelto. Con bolsitas de 5 llenaría 5 y le sobrarían 2. Cuando no sobra nada, la división es exacta.'],
          pieza: PU, dibujo: { datos: { n: 9, bolsitas: 3, sueltos: 0, ceros: true, regla: 1, colorCifras: false, rotulos: { bolsitas: '3 bolsitas llenas', sueltos: 'ningún suelto' } }, estado: {} } },
        { titulo: 'Múltiplo y divisor', texto: ['Como no sobra ninguno, 27 es múltiplo de ', bas(9), ', y ', bas(9), ' es divisor de 27: 27 es divisible entre 9. En el examen se escribe con un circulito encima, y se lee «27 es múltiplo de 9».'],
          ecuacion: ['27 = ', bas(9), ' × 3   →   27 = ', { llave: [MU(9)], nota: 'múltiplo de 9', color: 'c-i' }] },
        { titulo: 'Van de 9 en 9', texto: ['Cada bolsita llena que agrega da otro múltiplo de ', bas(9), ': 9, 18, 27, 36… En la rifa, si hay premio cada 9 boletos, ganan esos números. Los múltiplos de 2 son los números pares; los demás, los números impares.'],
          pieza: BO, dibujo: { datos: { desde: 1, hasta: 40, premio: 9, letrero: [['Premio: cada '], ['9', 'i', 700], [' boletos']] }, estado: {} } },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar cuántos caramelos lleva cada bolsita. Mira los sueltos: busca los tamaños de bolsita con los que no queda ninguno.' },
      ],
    },
    ejemplos: EJEMPLOS_MULTIPLO,
    juega: {
      pieza: PU,
      consigna: 'Doña Juana empaca sus caramelos en bolsitas iguales. Elige cuántos tiene y cuántos lleva cada bolsita.',
      mision: {
        // Una sola respuesta con los controles: de las bolsitas de 5 a 9, solo la de 7 deja 28 sin sueltos (la prueba lo
        // comprueba en toda la grilla).
        texto: 'Pon 28 caramelos. Elige una bolsita de más de 4 caramelos que no deje ninguno suelto.',
        logrado: v => v.n === 28 && v.m > 4 && v.n % v.m === 0,
        bien: '28 = 7 × 4: cuatro bolsitas de 7 y ningún suelto. 28 es múltiplo de 7.',
      },
      voz: 'Cambia la bolsita y mira si queda algún suelto.',
      leyenda: [
        { s: bas('bolsita'), t: 'lo que lleva cada una: el divisor' },
        { s: sob('sueltos'), t: 'los que sobran: el resto' },
      ],
      controles: CTRL_M,
      dibujo: v => ({ datos: puestoM(v, escalaM(v.m)), estado: {} }),
      // La relación: lo que hay, en bolsitas llenas y sueltos, y si eso lo hace múltiplo.
      lectura: v => {
        const q = Math.floor(v.n / v.m), r = v.n % v.m;
        return r ? [`${v.n} = `, bas(v.m), ` × ${q} + `, sob(r), ': no es múltiplo de ', bas(v.m)] : [`${v.n} = `, bas(v.m), ` × ${q}: es múltiplo de `, bas(v.m)];
      },
      minimo: 3,
    },
    predice: {
      pieza: BO,
      pregunta: ['La promoción vende los boletos del 1 al 50. Hay premio para cada boleto cuyo número es múltiplo de ', bas(6), '. ¿Cuántos premios se entregan?'],
      datos: ['Los boletos van del 1 al 50, sin saltarse ninguno'],
      voz: 'Piensa cada cuántos boletos sale un premio.',
      opciones: [
        { id: 'c', texto: '8', correcta: true },
        { id: 'arriba', texto: '9', error: 'AT-CONTEO-ARRIBA', siFuera: 'Dividir 50 entre 6 está bien. Pero el noveno grupo no se completa: su premio sería el boleto 54.' },
        { id: 'propio', texto: '7', error: 'AT-MULT-PROPIO', siFuera: 'Contar de 6 en 6 está bien. Pero el boleto 6 también gana: 6 = 6 × 1.' },
        { id: 'termina', texto: '5', error: 'AT-MULT-TERMINA', siFuera: 'Esos son los que terminan en 6. Un múltiplo de 6 es 6 por un entero: 12, 18…' },
      ],
      dibujo: plancha(Object.assign({}, RIFA, { marcar: false })),
      revelar: plancha(Object.assign({}, RIFA, { grupos: true, sobran: true, pie: [['8', 'f', 700], [' premios: uno por cada grupo completo']] })),
      coincide: 'Coincide: 50 = 6 × 8 + 2, ocho grupos completos de 6 boletos.',
      noCoincide: 'Revisemos: cada premio cierra un grupo de 6 boletos seguidos.',
    },
    mira: {
      pieza: BO,
      datos: MIRA_RIFA,
      voz: 'Cada premio cierra un grupo de 6 boletos.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Boletos del 1 al 50. Ganan los múltiplos de 6.' },
        { estado: { paso: 1 }, texto: 'El primero es el 6: todo número es múltiplo de sí mismo.', ecuacion: ['6 = ', bas(6), ' × 1'] },
        { estado: { paso: 2 }, texto: 'Los demás salen de 6 en 6: 12, 18, 24…', ecuacion: [bas(6), ' × 2 = 12 ; ', bas(6), ' × 3 = 18 ; …'] },
        { estado: { paso: 3 }, texto: 'Cada premio cierra un grupo de 6 boletos: hay 8 grupos.', ecuacion: [bas(6), ' × 8 = 48'] },
        { estado: { paso: 4 }, texto: 'Sobran el 49 y el 50: no completan otro grupo.', ecuacion: ['50 = ', bas(6), ' × 8 + ', sob(2)] },
        { estado: { paso: 5 }, texto: 'Es como empacar 50 caramelos en bolsitas de 6: 8 llenas.', ecuacion: ['múltiplos de ', bas(6), ' del 1 al 50: ', res(8)] },
      ],
    },
    regla: {
      texto: 'N es múltiplo de d si N = d × k, con k entero: no sobra nada. Del 1 al N hay tantos múltiplos de d como el cociente entero.',
      // Cada relación en su línea: la definición con la escritura del examen, y cómo se listan los múltiplos.
      // Cada letra, dicha en su llave la primera vez (N, d y k no salen en Lee: allí todo va con números).
      ecuacion: [{ llave: ['N'], nota: 'caramelos' }, ' = ', { llave: [bas('d')], nota: 'por bolsita', color: 'c-i' }, ' × ', { llave: ['k'], nota: 'bolsitas' }, SEP,
        'se escribe N = ', { llave: [MU('d')], nota: 'múltiplo de d', color: 'c-i' }, SEP, 'múltiplos de ', bas('d'), ': ', bas('d'), ', 2 × ', bas('d'), ', 3 × ', bas('d'), '…'],
      // Se lee después de «Vale si» (captura del 19 nov: «Vale si El 0 es…» no se entendía).
      condicion: 'd no es 0. El 0 es múltiplo de todos, y todo número lo es de 1 y de sí mismo.',
      voz: 'Sin sueltos, es múltiplo. Los múltiplos van de d en d.',
    },
    // Así se resuelve: cuántos premios hay en una plancha que no empieza en el 1 (los múltiplos de un tramo). «Ahora tú»
    // pide otra cosa: reconocer un múltiplo, el mayor o el menor con ciertas cifras, los premios desde el 1, los
    // múltiplos de tres cifras y un total que tiene que ser múltiplo.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const d = r.ent(6, 13), a = r.ent(21, 60), b = a + r.ent(40, 90);
          const q2 = Math.floor(b / d), r2 = b % d, q1 = Math.floor((a - 1) / d), r1 = (a - 1) % d;
          if (!r2 || !r1 || a % d === 0) continue;
          const cuenta = q2 - q1, primero = d * (q1 + 1), ultimo = d * q2;
          return {
            enunciado: ['La promoción vende otra plancha, con los boletos del ', String(a), ' al ', String(b), '. Hay premio para los múltiplos de ', bas(d), '. ¿Cuántos premios hay en esa plancha?'],
            datos: [DM.def, DM.conteo],
            pasos: [
              { tipo: 'pide', texto: ['Piden cuántos números del ', String(a), ' al ', String(b), ' son múltiplos de ', bas(d), '.'] },
              { tipo: 'regla', texto: `Cuento los múltiplos del 1 al ${b} y les quito los que quedan antes de la plancha, del 1 al ${a - 1}.` },
              { tipo: 'cuentas', texto: `Del 1 al ${b}: el cociente entero es ${q2}.`, ecuacion: [`${b} = `, bas(d), ` × ${q2} + `, sob(r2)] },
              { tipo: 'cuentas', texto: `Del 1 al ${a - 1}: el cociente entero es ${q1}. Esos no están en la plancha.`, ecuacion: [`${a - 1} = `, bas(d), ` × ${q1} + `, sob(r1), ` ; ${q2} − ${q1} = `, res(cuenta)] },
              { tipo: 'sentido', texto: `Compruebo: el primero es ${primero} y el último, ${ultimo}; van de ${d} en ${d}.`, ecuacion: [`(${ultimo} − ${primero}) ÷ ${d} + 1 = `, res(cuenta)] },
            ],
            respuesta: ['Hay ', res(cuenta), cuenta === 1 ? ' premio' : ' premios'],
          };
        }
      },
    },
    ahoraTu: {
      voz: 'Sin sueltos, es múltiplo.',
      generar(sem) {
        const r = azar(sem + 53), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoCual, r);
        if (tipo === 1) return conCuatro(casoExtremo, r);
        if (tipo === 2) return conCuatro(casoPremios, r);
        if (tipo === 3) return conCuatro(casoTresCifras, r);
        return conCuatro(casoRazon, r);
      },
    },
  };

  // ---------- Idea 2 (rehecha, 19 nov): al operar, mandan los sueltos (principios de la divisibilidad) ----------
  // Propuesta §1 a §7. Conserva el id `restos-suman` y los controles `a` y `b`; la mesa `juntar-sobrantes` sigue con fichas.
  // Objeto: dos pedidos que se juntan en el mostrador, en bolsitas de 7 (arit-puesto): las llenas siguen llenas y los
  // sueltos de los dos forman un montón aparte, con un aro cuando alcanzan para otra bolsita.
  // Cambia: los dos pedidos. · Permanece: la bolsita de 7 y la escala. · Progresa: sueltos de cada pedido → juntos →
  // otra bolsita si alcanzan. · Se reserva: multiplicar (varios pedidos iguales): es de la predicción. · Debe verse: el
  // resto del total sale solo de los restos.
  // Errores (hipótesis de aula; la trampa 18 de San Marcos respalda AT-EXCESO-IGUAL): AT-RESTO-MAYOR opera los restos y
  // no vuelve a empacar · AT-RESTO-SUMA suma donde hay que multiplicar · AT-DEPENDE cree que hace falta el número entero
  // · AT-RESTO-IGUAL cree que el resto no cambia · AT-RESTO-INVIERTE resta el menor del mayor · AT-RESTO-OPERA suma en
  // vez de restar · AT-EXCESO-IGUAL lee «faltan k» como «sobran k» · AT-EXCESO-DIVISOR responde el divisor ·
  // AT-EXCESO-CERO cree que si falta algo no sobra nada · AT-RESTO-OLVIDA olvida el término suelto · AT-CUADRADO-DOBLE
  // dobla en vez de elevar.
  const RE = { sub: [res('r'), 'e'] };
  const D2 = {
    suma: ['(', MU('d'), ' + ', sob('r'), ') + (', MU('d'), ' + ', sob('s'), ') = ', MU('d'), ' + (', sob('r'), ' + ', sob('s'), ')'],
    resta: ['(', MU('d'), ' + ', sob('r'), ') − (', MU('d'), ' + ', sob('s'), ') = ', MU('d'), ' + (', sob('r'), ' − ', sob('s'), ')'],
    prod: ['(', MU('d'), ' + ', sob('r'), ') × (', MU('d'), ' + ', sob('s'), ') = ', MU('d'), ' + ', sob('r'), ' × ', sob('s')],
    forma: ['N = ', MU('d'), ' + ', sob('r'), ': al dividir N entre ', bas('d'), ' sobran ', sob('r')],
    falta: ['Si a N le faltan k para ser múltiplo de ', bas('d'), ': N = ', MU('d'), ' − k'],
    empaca: ['Un resto es menor que ', bas('d'), ': si llega a ', bas('d'), ', se divide otra vez'],
  };
  const REGLA7 = [[['1 bolsita = '], ['7', 'i', 700], [' caramelos']]];
  const CTRL_S = [
    { id: 'a', etiqueta: 'Pedido de la mañana', min: 12, max: 40, paso: 1, inicio: 30, decimales: 0 },
    { id: 'b', etiqueta: 'Pedido de la tarde', min: 11, max: 40, paso: 1, inicio: 15, decimales: 0 },
  ];
  const puestoS = (v, escala) => {
    const qa = Math.floor(v.a / 7), ra = v.a % 7, qb = Math.floor(v.b / 7), rb = v.b % 7, t = ra + rb;
    return { n: 7, bolsitas: qa + qb, sueltos: t, ceros: true, regla: REGLA7, escala, colorCifras: false, juntar: t >= 7 ? 'sueltos' : undefined,
      rotulos: { bolsitas: `${qa} + ${qb} bolsitas`, sueltos: [[`${ra} + ${rb}`, 'o', 700], [' sueltos']] } };
  };
  let escS = null;
  const escalaS = () => {
    if (escS) return escS;
    let mn = 1.7;
    for (let a = 12; a <= 40; a++) for (let b = 11; b <= 40; b++) mn = Math.min(mn, PUESTO().geometria(puestoS({ a, b })).sCabe);
    return (escS = Math.floor(mn * 100) / 100);
  };
  // Predice y «Mira»: cinco pedidos iguales que dejan 4 sueltos cada uno, a una sola escala (la prueba comprueba que cabe).
  const ESC_P2 = 1.7; // cabe hasta 1,9 (paso 4: 2 bolsitas y 6 sueltos); 0,8 dejaba el mostrador casi vacío
  const P2 = { n: 7, ceros: true, colorCifras: false, escala: ESC_P2, regla: REGLA7.concat([[['Son 5 pedidos iguales']]]) };
  const MIRA_P2 = Object.assign({}, P2, { pasos: [
    { sueltos: 4, rotulos: { sueltos: [['4', 'o', 700], [' sueltos de un pedido']] } },
    { sueltos: 20, rotulos: { sueltos: [['5 × 4', 'o', 700], [' sueltos']] } },
    { sueltos: 20, juntar: 'sueltos', rotulos: { sueltos: [['20', 'o', 700], [' sueltos']] } },
    { bolsitas: 2, sueltos: 6, rotulos: { bolsitas: 'se llenan 2 más', sueltos: [['6', 'o', 700], [' sueltos']] } },
    { bolsitas: 2, sueltos: 6, rotulos: { bolsitas: 'se llenan 2 más', sueltos: [['6', 'o', 700], [' sueltos']] } },
  ] });

  // Ahora tú · tipo 0: el resto de varios pedidos iguales (un producto).
  function casoVeces(r) {
    const d = r.ent(5, 11), rr = r.ent(2, d - 1), k = r.ent(2, 9), bruto = k * rr, v = bruto % d;
    if (bruto < d) return null;
    return {
      pregunta: ['Un pedido deja ', sob(rr), ' sueltos al empacarlo en bolsitas de ', bas(d), `. Doña Juana junta ${k} pedidos iguales. ¿Cuántos sueltos quedan?`],
      datos: [D2.prod, D2.empaca],
      opciones: opciones(v, [
        { id: 'mayor', valor: bruto, error: 'AT-RESTO-MAYOR', siFuera: `Multiplicar los sueltos está bien: ${bruto}. Pero con ${bruto} se llenan más bolsitas de ${d}.` },
        { id: 'suma', valor: (k + rr) % d, error: 'AT-RESTO-SUMA', siFuera: `Son ${k} pedidos con ${rr} sueltos cada uno: se multiplica, no se suma.` },
        { id: 'igual', valor: rr, error: 'AT-RESTO-IGUAL', siFuera: `${rr} deja un pedido solo. Con ${k} pedidos se juntan ${k} veces esos sueltos.` },
      ]),
      solucion: { texto: `Se juntan ${k} × ${rr} = ${bruto} sueltos y se vuelven a empacar.`, ecuacion: [`${bruto} = `, bas(d), ` × ${Math.floor(bruto / d)} + `, sob(v)] },
    };
  }
  // Ahora tú · tipo 1: el resto de una resta que obliga a abrir una bolsita.
  function casoResta(r) {
    const d = r.ent(6, 12), ra = r.ent(1, d - 2), rb = r.ent(ra + 1, d - 1), v = ra - rb + d;
    return {
      pregunta: ['Un pedido deja ', sob(ra), ra === 1 ? ' suelto en bolsitas de ' : ' sueltos en bolsitas de ', bas(d), '. Doña Juana despacha de ahí otro que deja ', sob(rb), '. ¿Cuántos sueltos deja lo que queda?'],
      datos: [D2.resta, ['Si no alcanzan los sueltos, se abre una bolsita de ', bas(d)]],
      opciones: opciones(v, [
        { id: 'invierte', valor: rb - ra, error: 'AT-RESTO-INVIERTE', siFuera: `Restar los sueltos está bien. Pero ${ra} no alcanza para quitar ${rb}: se abre una bolsita.` },
        { id: 'opera', valor: (ra + rb) % d, error: 'AT-RESTO-OPERA', siFuera: 'Eso deja la suma de los dos pedidos. Aquí uno se despacha: se resta.' },
        { id: 'igual', valor: ra, error: 'AT-RESTO-IGUAL', siFuera: `${ra} dejaba el pedido antes de despachar. Al quitar caramelos, los sueltos cambian.` },
      ]),
      solucion: { texto: `Abre una bolsita: ${d} + ${ra} = ${d + ra} sueltos, y quita ${rb}.`, ecuacion: [`${d + ra} − ${rb} = `, sob(v)] },
    };
  }
  // Ahora tú · tipo 2 (San Marcos 2023-II, la parte de un solo divisor): «le faltan k» es un resto por exceso.
  function casoFaltan(r) {
    const d = r.ent(6, 15), k = r.ent(1, Math.floor((d - 1) / 2)), v = d - k;
    return {
      pregunta: ['A un pedido le ', k === 1 ? 'falta 1 caramelo' : `faltan ${k} caramelos`, ' para llenar justo bolsitas de ', bas(d), '. ¿Qué resto deja el pedido al dividirlo entre ', bas(d), '?'],
      datos: [D2.falta, D2.forma],
      opciones: opciones(v, [
        { id: 'igual', valor: k, error: 'AT-EXCESO-IGUAL', siFuera: `${k} es lo que falta. El resto es lo que ya hay en la última bolsita.` },
        { id: 'divisor', valor: d, error: 'AT-EXCESO-DIVISOR', siFuera: `Un resto es menor que ${d}: con ${d} sueltos se llenaría otra bolsita.` },
        { id: 'cero', valor: 0, error: 'AT-EXCESO-CERO', siFuera: 'Resto 0 sería si no faltara ni sobrara nada. Aquí la última bolsita está empezada.' },
      ]),
      solucion: { texto: `La última bolsita tiene ${d} − ${k} caramelos: esos sobran.`, ecuacion: [MU(d), ' − ', res(k), ' = ', MU(d), ' + ', sob(v)] },
    };
  }
  // Ahora tú · tipo 3 (nivel examen): el resto de p × N + c conociendo el de N.
  function casoExpresion(r) {
    const d = r.ent(6, 11), rr = r.ent(2, d - 1), p = r.ent(2, 6), c = r.ent(2, 9), bruto = p * rr + c, v = bruto % d;
    if (bruto < d || p % d === 0) return null;
    return {
      pregunta: ['Un número N deja resto ', sob(rr), ' al dividirlo entre ', bas(d), `. ¿Qué resto deja ${p} × N + ${c} entre `, bas(d), '?'],
      datos: [D2.prod, D2.suma, D2.empaca],
      opciones: opciones(v, [
        { id: 'mayor', valor: bruto, error: 'AT-RESTO-MAYOR', siFuera: `Operar los restos está bien: ${bruto}. Pero un resto entre ${d} es menor que ${d}.` },
        { id: 'olvida', valor: (p * rr) % d, error: 'AT-RESTO-OLVIDA', siFuera: `Ese es el resto de ${p} × N. Falta sumar ${c}.` },
        { id: 'suma', valor: (p + rr + c) % d, error: 'AT-RESTO-SUMA', siFuera: `${p} × N son ${p} veces el resto de N: se multiplica, no se suma.` },
        { id: 'igual', valor: rr, error: 'AT-RESTO-IGUAL', siFuera: `${rr} deja N. La cuenta ${p} × N + ${c} cambia el resto.` },
      ]),
      solucion: { texto: `${p} × ${rr} + ${c} = ${bruto}, y se vuelve a dividir entre ${d}.`, ecuacion: [`${bruto} = `, bas(d), ` × ${Math.floor(bruto / d)} + `, sob(v)] },
    };
  }
  // Ahora tú · tipo 4 (nivel examen): el resto de un cuadrado.
  function casoCuadrado(r) {
    const d = r.ent(5, 13), rr = r.ent(3, d - 1), bruto = rr * rr, v = bruto % d;
    return {
      pregunta: ['Un número N es ', MU(d), ' + ', sob(rr), '. ¿Qué resto deja N × N al dividirlo entre ', bas(d), '?'],
      datos: [D2.prod, D2.empaca],
      opciones: opciones(v, [
        { id: 'mayor', valor: bruto, error: 'AT-RESTO-MAYOR', siFuera: `Multiplicar los restos está bien: ${bruto}. Pero un resto entre ${d} es menor que ${d}.` },
        { id: 'doble', valor: (2 * rr) % d, error: 'AT-CUADRADO-DOBLE', siFuera: `Eso deja N + N. En N × N los restos se multiplican: ${rr} × ${rr}.` },
        { id: 'igual', valor: rr, error: 'AT-RESTO-IGUAL', siFuera: `${rr} deja N. Al multiplicarlo por sí mismo, el resto cambia.` },
      ]),
      solucion: { texto: `${rr} × ${rr} = ${bruto}, y se vuelve a dividir entre ${d}.`, ecuacion: [`${bruto} = `, bas(d), ` × ${Math.floor(bruto / d)} + `, sob(v)] },
    };
  }

  // Ejemplos resueltos de la idea 2. Cuentas rehechas aparte (cuentas-ideas.js): 3 + 2 = 5; 5 + 4 = 9 = 7 + 2;
  // 21 + 35 = 56 = 7 × 8; 47 = 6 × 7 + 5; 8 − 5 = 3; 4 × 3 = 12 = 5 × 2 + 2; 6 + 5 + 4 = 15 = 9 + 6; 9 − 5 = 4
  // (30 − 12 = 18 = 7 × 2 + 4); 6k = 3 × 2k y 9 = 6 + 3; 9 − 2 = 7 (25 = 9 × 2 + 7); 3 × 4 + 5 = 17 = 7 × 2 + 3 (trampas
  // 17, 5, 4 y 6); 25 = 9 × 2 + 7 (trampas 25, 1, 5 y 2); 3 × 7 = 21 = 8 × 2 + 5 (trampas 3, 21, 7 y 1); 9 + 7 = 16 =
  // 11 + 5 (trampas 13, 2, 4 y 6); 12k = 4 × 3k, y 12 no es múltiplo de 24, 8, 9 ni 5.
  const EJEMPLOS_RESTOS = [
    { nivel: 1, titulo: 'El resto de una suma',
      enunciado: 'Un pedido deja 3 sueltos en bolsitas de 7 y otro deja 2. Si doña Juana los junta, ¿cuántos sueltos quedan?',
      datos: [D2.suma],
      solucion: [{ texto: 'Las bolsitas llenas siguen llenas. Solo se juntan los sueltos: 3 + 2 = 5, que no llenan otra.', ecuacion: ['(', MU(7), ' + ', sob(3), ') + (', MU(7), ' + ', sob(2), ') = ', MU(7), ' + ', sob(5)] }],
      respuesta: ['Quedan ', sob(5), ' sueltos'] },
    { nivel: 1, titulo: 'Los sueltos llenan otra',
      enunciado: 'Un pedido deja 5 sueltos en bolsitas de 7 y otro deja 4. Si se juntan, ¿cuántos sueltos quedan?',
      datos: [D2.suma, D2.empaca],
      figura: fig({ n: 7, sueltos: 9, regla: REGLA7, colorCifras: false, rotulos: { sueltos: [['5 + 4', 'o', 700], [' sueltos']] } }),
      solucion: [{ texto: 'Se juntan 5 + 4 = 9 sueltos. Con 7 se llena otra bolsita y quedan 2.', ecuacion: ['9 = ', bas(7), ' + ', sob(2)] }],
      respuesta: ['Quedan ', sob(2), ' sueltos'] },
    { nivel: 1, titulo: 'Múltiplo más múltiplo',
      enunciado: 'Doña Juana junta un pedido de 21 caramelos y otro de 35, y los empaca en bolsitas de 7. ¿Sobra alguno?',
      datos: [DM.def, D2.suma],
      solucion: [{ texto: 'Los dos son múltiplos de 7: ninguno deja sueltos, y juntos tampoco.', ecuacion: ['21 + 35 = ', bas(7), ' × 3 + ', bas(7), ' × 5 = ', bas(7), ' × 8'] }],
      respuesta: ['No: sobran ', sob(0)] },
    { nivel: 1, titulo: 'Con el circulito',
      enunciado: 'Escribe 47 como un múltiplo de 6 más su resto.',
      datos: [D2.forma],
      solucion: [{ texto: 'El múltiplo de 6 que queda justo debajo de 47 es 42: sobran 5.', ecuacion: ['47 = ', bas(6), ' × 7 + ', sob(5)] }],
      respuesta: ['47 = ', MU(6), ' + ', sob(5)] },
    { nivel: 1, titulo: 'Sobra y falta',
      enunciado: 'Un pedido deja 5 sueltos en bolsitas de 8. ¿Cuántos caramelos le faltan para llenar otra bolsita?',
      datos: [D2.forma, D2.falta],
      solucion: [{ texto: 'La última bolsita lleva 8 y tiene 5: le faltan 8 − 5.', ecuacion: [MU(8), ' + ', sob(5), ' = ', MU(8), ' − ', res(3)] }],
      respuesta: ['Le faltan ', res(3)] },
    { nivel: 2, titulo: 'El resto de un producto',
      enunciado: 'Un pedido deja 3 sueltos en bolsitas de 5. Doña Juana arma 4 pedidos iguales y los junta. ¿Cuántos sueltos quedan?',
      datos: [D2.prod, D2.empaca],
      solucion: [
        { texto: 'Cada pedido aporta 3 sueltos: son 4 × 3 = 12.', ecuacion: ['4 × ', sob(3), ' = 12'] },
        { texto: 'Con 12 sueltos se llenan 2 bolsitas de 5 y quedan 2.', ecuacion: ['12 = ', bas(5), ' × 2 + ', sob(2)] },
      ],
      respuesta: ['Quedan ', sob(2), ' sueltos'] },
    { nivel: 2, titulo: 'Tres pedidos',
      enunciado: 'Tres pedidos dejan 6, 5 y 4 sueltos al empacarlos en bolsitas de 9. Si se juntan, ¿cuántos sueltos quedan?',
      datos: [D2.suma, D2.empaca],
      solucion: [
        { texto: 'Se juntan los sueltos de los tres.', ecuacion: [sob(6), ' + ', sob(5), ' + ', sob(4), ' = 15'] },
        { texto: 'Con 15 se llena una bolsita de 9 y quedan 6.', ecuacion: ['15 = ', bas(9), ' + ', sob(6)] },
      ],
      respuesta: ['Quedan ', sob(6), ' sueltos'] },
    { nivel: 2, titulo: 'El resto de una resta',
      enunciado: 'Un pedido deja 2 sueltos en bolsitas de 7. Doña Juana despacha de ahí otro que deja 5. ¿Cuántos sueltos deja lo que le queda?',
      datos: [D2.resta, ['Si no alcanzan los sueltos, se abre una bolsita de ', bas(7)]],
      solucion: [
        { texto: 'No alcanzan 2 sueltos para quitar 5: abre una bolsita y tiene 7 + 2 = 9.', ecuacion: ['9 − 5 = ', sob(4)] },
        { texto: 'Compruebo con 30 y 12, que dejan 2 y 5: quedan 18.', ecuacion: ['18 = ', bas(7), ' × 2 + ', sob(4)] },
      ],
      respuesta: ['Quedan ', sob(4), ' sueltos'] },
    { nivel: 2, titulo: 'Bolsitas de 6 y de 3',
      enunciado: 'Un pedido llena bolsitas de 6 sin que sobre ninguno. Si se reempaca en bolsitas de 3, ¿puede sobrar algún caramelo?',
      datos: [DM.def],
      solucion: [
        { texto: 'Cada bolsita de 6 se parte en 2 bolsitas de 3, sin sueltos.', ecuacion: ['6 × k = ', bas(3), ' × (2 × k)'] },
        { texto: 'Al revés no siempre: 9 llena bolsitas de 3 y, en bolsitas de 6, deja 3.' },
      ],
      respuesta: ['No: sobran ', sob(0), ', sea cual sea el pedido'] },
    { nivel: 2, titulo: 'Le faltan 2',
      enunciado: 'A un pedido le faltan 2 caramelos para llenar justo bolsitas de 9. ¿Qué resto deja al dividirlo entre 9?',
      datos: [D2.falta, D2.forma],
      solucion: [
        { texto: 'Si le faltan 2, la última bolsita tiene 9 − 2 = 7 caramelos: esos son los que sobran.', ecuacion: [MU(9), ' − ', res(2), ' = ', MU(9), ' + ', sob(7)] },
        { texto: 'Compruebo con 25, al que le faltan 2 para 27.', ecuacion: ['25 = ', bas(9), ' × 2 + ', sob(7)] },
      ],
      respuesta: ['Deja resto ', sob(7)] },
    { nivel: 3, titulo: 'El resto de una expresión',
      enunciado: ['Un número N es ', MU(7), ' + 4. ¿Qué resto deja 3 × N + 5 al dividirlo entre 7?'],
      alternativas: ['17', '5', '3', '4', '6'],
      datos: [D2.prod, D2.suma, D2.empaca],
      solucion: [
        { texto: 'El resto de 3 × N sale de 3 × 4 = 12; el 5 se suma tal cual.', ecuacion: ['3 × ', sob(4), ' + 5 = 17'] },
        { texto: '17 pasa de 7: se vuelve a empacar.', ecuacion: ['17 = ', bas(7), ' × 2 + ', sob(3)] },
        { texto: ['Las trampas: ', letra('A'), ' no reduce; ', letra('B'), ' olvida sumar 5; ', letra('D'), ' deja el resto de N; ', letra('E'), ' hace 3 × (4 + 5).'] },
      ],
      respuesta: [letra('C'), ': deja resto ', sob(3)] },
    { nivel: 3, titulo: 'El resto de un cuadrado',
      enunciado: ['Un número N es ', MU(9), ' + 5. ¿Qué resto deja N × N al dividirlo entre 9?'],
      alternativas: ['25', '1', '5', '7', '2'],
      datos: [D2.prod, D2.empaca],
      solucion: [
        { texto: 'En un producto se multiplican los restos.', ecuacion: [sob(5), ' × ', sob(5), ' = 25'] },
        { texto: '25 pasa de 9: se vuelve a empacar.', ecuacion: ['25 = ', bas(9), ' × 2 + ', sob(7)] },
        { texto: ['Las trampas: ', letra('A'), ' no reduce; ', letra('B'), ' hace 5 + 5; ', letra('C'), ' deja el resto de N; ', letra('E'), ' responde el cociente.'] },
      ],
      respuesta: [letra('D'), ': deja resto ', sob(7)] },
    { nivel: 3, titulo: 'Le faltaba uno',
      enunciado: 'Doña Juana empaca sus caramelos de 8 en 8 y le falta 1 para llenar la última bolsita. Si compra el triple, ¿cuántos sueltos le quedan al empacar de 8 en 8?',
      alternativas: ['5', '3', '21', '7', '1'],
      datos: [D2.falta, D2.prod, D2.empaca],
      solucion: [
        { texto: 'Si le falta 1, le sobran 8 − 1 = 7.', ecuacion: ['N = ', MU(8), ' − ', res(1), ' = ', MU(8), ' + ', sob(7)] },
        { texto: 'El triple deja 3 × 7 = 21 sueltos, que se vuelven a empacar.', ecuacion: ['21 = ', bas(8), ' × 2 + ', sob(5)] },
        { texto: ['Las trampas: ', letra('B'), ' lee «le falta 1» como «sobra 1»; ', letra('C'), ' no reduce; ', letra('D'), ' no triplica; ', letra('E'), ' es lo que faltaba.'] },
      ],
      respuesta: [letra('A'), ': quedan ', sob(5), ' sueltos'] },
    { nivel: 3, titulo: 'A uno sobra, a otro falta',
      enunciado: 'El número a deja resto 9 al dividirlo entre 11, y al número b le faltan 4 para ser múltiplo de 11. ¿Qué resto deja a + b entre 11?',
      alternativas: ['13', '2', '4', '6', '5'],
      datos: [D2.falta, D2.suma, D2.empaca],
      solucion: [
        { texto: 'A b le faltan 4: deja 11 − 4 = 7.', ecuacion: ['b = ', MU(11), ' − ', res(4), ' = ', MU(11), ' + ', sob(7)] },
        { texto: 'Sumo los restos y vuelvo a empacar.', ecuacion: ['9 + 7 = 16 = ', bas(11), ' + ', sob(5)] },
        { texto: ['Las trampas: ', letra('A'), ' suma 9 + 4; ', letra('B'), ' además lo reduce; ', letra('C'), ' es lo que le falta a b; ', letra('D'), ', lo que le falta a la suma.'] },
      ],
      respuesta: [letra('E'), ': deja resto ', sob(5)] },
    { nivel: 3, titulo: 'Una bolsita que siempre sirve',
      enunciado: 'Un pedido se empaca en bolsitas de 12 sin que sobre ninguno. ¿Con cuál de estas bolsitas tampoco sobrará nunca, sea cual sea el pedido?',
      alternativas: ['de 24', 'de 4', 'de 8', 'de 9', 'de 5'],
      datos: [DM.def],
      solucion: [
        { texto: 'Cada bolsita de 12 se parte en 3 bolsitas de 4: nunca sobra.', ecuacion: ['12 × k = ', bas(4), ' × (3 × k)'] },
        { texto: 'Con las otras falla el pedido de 12 caramelos: 12 no es múltiplo de 24, de 8, de 9 ni de 5.' },
        { texto: ['Por eso ', letra('A'), ', ', letra('C'), ', ', letra('D'), ' y ', letra('E'), ' no sirven siempre.'] },
      ],
      respuesta: [letra('B'), ': bolsitas ', bas('de 4')] },
  ];

  const teoremas = {
    id: 'restos-suman',
    titulo: 'Al operar, mandan los sueltos',
    pregunta: '¿Qué resto deja una suma o un producto?',
    temas: ['Principios de la divisibilidad'],
    pieza: PU,
    aprendizaje: 'Al sumar o multiplicar, las bolsitas llenas siguen llenas: el resto del resultado sale de operar solo los restos y volver a empacar.',
    actividad: 'Juntar dos pedidos y ver qué pasa con los sueltos de cada uno.',
    lee: {
      tarjetas: [
        { titulo: 'Un múltiplo, más lo que sobra', texto: ['Doña Juana empaca 30 caramelos en bolsitas de ', bas(7), ': llena 4 y le quedan 2 sueltos. 30 no es múltiplo de 7: es un múltiplo de 7, más 2. Ese 2 es el resto.'],
          ecuacion: ['30 = ', bas(7), ' × 4 + ', sob(2), '   →   30 = ', MU(7), ' + ', sob(2)],
          pieza: PU, dibujo: { datos: { n: 7, bolsitas: 4, sueltos: 2, regla: 1, colorCifras: false, rotulos: { bolsitas: '4 bolsitas llenas', sueltos: [['2', 'o', 700], [' sueltos']] } }, estado: {} } },
        { titulo: 'Sobran 2 o faltan 5', texto: 'El mismo pedido se puede contar al revés: a 30 le faltan 5 caramelos para llenar otra bolsita y llegar a 35. Es el resto por exceso. Las dos maneras dicen lo mismo.',
          ecuacion: ['30 = ', MU(7), ' + ', sob(2), ' = ', MU(7), ' − ', res(5)],
          pieza: PU, dibujo: { datos: { n: 7, bolsitas: 4, incompleta: { de: 7, tiene: 2 }, regla: 1, colorCifras: false, rotulos: { bolsitas: '4 bolsitas llenas', incompleta: [['2', 'o', 700], [' sueltos, faltan '], ['5', 'f', 700]] } }, estado: {} } },
        { titulo: 'Como lo escriben los libros', texto: ['Que 30 y 2 dejan el mismo resto entre 7 también se escribe con el signo ≡, y se lee «30 es congruente con 2, módulo 7». El módulo es el divisor: lo que lleva la bolsita.'],
          ecuacion: ['30 ≡ 2  (mód ', bas(7), ')'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a juntar dos pedidos empacados en bolsitas de 7. Las bolsitas llenas no cambian: mira solo los sueltos de cada pedido y lo que pasa cuando se juntan.' },
      ],
    },
    ejemplos: EJEMPLOS_RESTOS,
    juega: {
      pieza: PU,
      consigna: 'A doña Juana le llegan dos pedidos, cada uno empacado en bolsitas de 7 con sus sueltos. Los junta en el mostrador.',
      mision: {
        // Una sola respuesta: con 25 en la mañana (sobran 4), de 11 a 19 solo el 17 (sobran 3) completa otra bolsita.
        texto: 'Mañana: 25. Busca el pedido de la tarde, menor que 20, que no deje sueltos.',
        logrado: v => v.a === 25 && v.b < 20 && (v.a + v.b) % 7 === 0,
        bien: 'Los 4 sueltos de la mañana y los 3 de la tarde llenaron otra bolsita.',
      },
      voz: 'Mira solo los sueltos: ¿alcanzan para otra bolsita?',
      leyenda: [
        { s: bas('7'), t: 'caramelos por bolsita: el divisor' },
        { s: sob('sueltos'), t: 'lo que sobra de cada pedido' },
      ],
      controles: CTRL_S,
      dibujo: v => ({ datos: puestoS(v, escalaS()), estado: {} }),
      lectura: v => {
        const ra = v.a % 7, rb = v.b % 7, t = ra + rb;
        return t < 7 ? [sob(ra), ' + ', sob(rb), ' = ', sob(t), ': el total deja ', sob(t), ' sueltos']
          : [sob(ra), ' + ', sob(rb), ` = ${t} = `, bas(7), ' + ', sob(t - 7), ': deja ', sob(t - 7)];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['Un pedido deja ', sob(4), ' sueltos al empacarlo en bolsitas de ', bas(7), '. Doña Juana prepara 5 pedidos iguales y los junta. ¿Cuántos sueltos quedan?'],
      datos: ['1 bolsita = 7 caramelos', 'Cada pedido deja 4 sueltos'],
      voz: 'Piensa qué pasa con todos los sueltos juntos.',
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'mayor', texto: '20', error: 'AT-RESTO-MAYOR', siFuera: 'Juntar 5 × 4 = 20 sueltos está bien. Pero con 20 sueltos se llenan más bolsitas de 7.' },
        { id: 'suma', texto: '2', error: 'AT-RESTO-SUMA', siFuera: 'Son 5 pedidos con 4 sueltos cada uno: se multiplica, 5 × 4, no se suma 5 + 4.' },
        { id: 'depende', texto: 'No se puede saber sin el tamaño del pedido', error: 'AT-DEPENDE', siFuera: 'Las bolsitas llenas de cada pedido siguen llenas: solo cuentan los sueltos.' },
      ],
      dibujo: fig(Object.assign({}, P2, { sueltos: 4, rotulos: { sueltos: [['4', 'o', 700], [' sueltos de un pedido']] } })),
      revelar: fig(Object.assign({}, P2, { bolsitas: 2, sueltos: 6, rotulos: { bolsitas: 'se llenan 2 más', sueltos: [['6', 'o', 700], [' sueltos']] } })),
      coincide: 'Coincide: 5 × 4 = 20 sueltos llenan 2 bolsitas y quedan 6.',
      noCoincide: 'Revisemos: se juntan los sueltos de los 5 pedidos y se vuelven a empacar.',
    },
    mira: {
      pieza: PU,
      datos: MIRA_P2,
      voz: 'Los sueltos se juntan y se vuelven a empacar.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Cada pedido deja 4 sueltos; sus bolsitas llenas no cambian.', ecuacion: [MU(7), ' + ', sob(4)] },
        { estado: { paso: 1 }, texto: 'Cinco pedidos juntan 5 × 4 = 20 sueltos.', ecuacion: ['5 × ', sob(4), ' = 20'] },
        { estado: { paso: 2 }, texto: 'Con 20 sueltos se llenan más bolsitas de 7.', ecuacion: ['20 = ', bas(7), ' × 2 + ', sob(6)] },
        { estado: { paso: 3 }, texto: 'Se llenan 2 y quedan 6: ese es el resto.', ecuacion: ['5 × (', MU(7), ' + ', sob(4), ') = ', MU(7), ' + ', sob(6)] },
        { estado: { paso: 4 }, texto: 'Vale para todo pedido que deje 4, como 11.', ecuacion: ['5 × 11 = 55 = ', bas(7), ' × 7 + ', sob(6)] },
      ],
    },
    regla: {
      texto: 'Las bolsitas llenas siguen llenas: el resto de una suma, una resta o un producto sale de operar solo los restos y volver a empacar.',
      ecuacion: ['(', MU('d'), ' + ', sob('r'), ') + (', MU('d'), ' + ', sob('s'), ') = ', MU('d'), ' + ', sob('r'), ' + ', sob('s'), SEP,
        '(', MU('d'), ' + ', sob('r'), ') × (', MU('d'), ' + ', sob('s'), ') = ', MU('d'), ' + ', sob('r'), ' × ', sob('s'), SEP,
        MU('d'), ' + ', sob('r'), ' = ', MU('d'), ' − ', { llave: [RE], nota: 'lo que falta', color: 'c-f' }],
      condicion: 'r y s son los restos entre el mismo d. Lo que sobra y lo que falta suman d.',
      voz: 'Opera los restos y vuelve a empacar.',
    },
    // Así se resuelve: tres pedidos que se juntan. «Ahora tú» pide otra cosa: varios pedidos iguales, una resta, «le
    // faltan k», una expresión y un cuadrado.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const d = r.ent(6, 12), rs = [r.ent(1, d - 1), r.ent(1, d - 1), r.ent(1, d - 1)], S = rs[0] + rs[1] + rs[2], v = S % d;
          if (S < d || new Set(rs).size < 3) continue;
          const ns = [d + rs[0], 2 * d + rs[1], d + rs[2]], T = ns[0] + ns[1] + ns[2];
          return {
            enunciado: [`Tres pedidos dejan ${rs[0]}, ${rs[1]} y ${rs[2]} sueltos al empacarlos en bolsitas de `, bas(d), '. Si doña Juana los junta, ¿cuántos sueltos quedan?'],
            datos: [D2.suma, D2.empaca],
            pasos: [
              { tipo: 'pide', texto: ['Piden el resto de la suma de los tres pedidos entre ', bas(d), '.'] },
              { tipo: 'datos', texto: ['No sé cuántos caramelos tiene cada pedido, solo lo que sobra: ', sob(rs[0]), ', ', sob(rs[1]), ' y ', sob(rs[2]), '.'] },
              { tipo: 'regla', texto: 'Las bolsitas llenas de cada pedido siguen llenas. Sumo solo los sueltos y, si alcanzan, los vuelvo a empacar.' },
              { tipo: 'cuentas', texto: `Los sueltos juntos: ${rs.join(' + ')} = ${S}.`, ecuacion: [`${S} = `, bas(d), ` × ${Math.floor(S / d)} + `, sob(v)] },
              { tipo: 'sentido', texto: `Compruebo con pedidos de ${ns[0]}, ${ns[1]} y ${ns[2]}, que dejan esos restos: suman ${T}.`, ecuacion: [`${T} = `, bas(d), ` × ${Math.floor(T / d)} + `, sob(T % d)] },
            ],
            respuesta: v === 1 ? ['Queda ', sob(1), ' suelto'] : ['Quedan ', sob(v), ' sueltos'],
          };
        }
      },
    },
    ahoraTu: {
      voz: 'Opera los restos y vuelve a empacar.',
      generar(sem) {
        const r = azar(sem + 71), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoVeces, r);
        if (tipo === 1) return conCuatro(casoResta, r);
        if (tipo === 2) return conCuatro(casoFaltan, r);
        if (tipo === 3) return conCuatro(casoExpresion, r);
        return conCuatro(casoCuadrado, r);
      },
    },
  };

  // Fichas de la mesa «juntar-sobrantes» del laboratorio (el juego de la idea 2 ya es el puesto de doña Juana).
  const juntar = (av, bv, mv) => ({ bloques: [
    { n: av, columnas: mv, color: 'i', marcoFilas: true, rotulo: `mañana: ${av % mv}`, tramos: av % mv ? [{ de: av - (av % mv), a: av - 1, color: 'o' }] : [] },
    { n: bv, columnas: mv, color: 'i', marcoFilas: true, rotulo: `tarde: ${bv % mv}`, tramos: bv % mv ? [{ de: bv - (bv % mv), a: bv - 1, color: 'o' }] : [] },
    // Los sobrantes juntos, en filas de m; los huecos punteados completan la fila (el bloque mide m de ancho siempre).
    { n: (av % mv) + (bv % mv), columnas: mv, color: 'o', marcoFilas: true, rotulo: `juntos: ${(av % mv) + (bv % mv)}`, paso: 1, huecos: ((av % mv) + (bv % mv)) % mv ? mv - (((av % mv) + (bv % mv)) % mv) : 0, huecosPaso: 1 },
  ], altoMax: 130, ficha: 22, arriba: true, alt: `a = ${av} y b = ${bv} en filas de ${mv}; sus sobrantes juntos son ${(av % mv) + (bv % mv)}` });
  // Manijas en la última ficha de a y de b (los bloques cuelgan de arriba).
  const arrastresJuntar = (lo, hi, mDe) => [
    { id: 'a', etiqueta: 'última ficha del pedido de la mañana',
      donde: v => ultima(juntar(v.a, v.b, mDe(v)), 0, v.a),
      mover: (pt, v) => ({ a: masCerca(rango(lo, hi), c => ultima(juntar(c, v.b, mDe(v)), 0, c), pt) }) },
    { id: 'b', etiqueta: 'última ficha del pedido de la tarde',
      donde: v => ultima(juntar(v.a, v.b, mDe(v)), 1, v.b),
      mover: (pt, v) => ({ b: masCerca(rango(lo, hi), c => ultima(juntar(v.a, c, mDe(v)), 1, c), pt) }) },
  ];

  // ---------- Idea 3 (rehecha, 19 nov): criterios: lo que deja cada envase (últimas cifras y suma de cifras) ----------
  // Propuesta §1 a §7. Conserva el id `criterios`. Objeto: el pedido en cajas de 100, bolsitas de 10 y sueltos
  // (arit-puesto en base 10), que doña Juana reempaca en bolsitas de 9: de cada bolsita y de cada caja sobra 1.
  // Cambia: cuántas cajas, bolsitas y sueltos hay. · Permanece: se reempaca de 9 en 9. · Progresa: lo que deja cada
  // envase → todo lo que sobra junto → otra bolsita de 9 si alcanza. · Se reserva: reempacar de 4 en 4 (la caja ya no
  // deja nada): es de la predicción. · Debe verse: el resto entre 9 es el de la suma de las cifras.
  // Errores (hipótesis de aula): AT-CRITERIO-SUMA suma las cifras con un divisor que no es 3 ni 9 · AT-CRITERIO-ULTIMA
  // mira solo la última cifra · AT-CRITERIO-MEZCLA suma las dos últimas cifras en vez de leerlas como un número ·
  // AT-RESTO-MAYOR no reduce · AT-CRITERIO-NUEVE reduce entre 9 cuando el divisor es 3 · AT-CRITERIO-RESTO responde lo
  // que sobra en vez de la cifra que falta · AT-CRITERIO-DECENA completa a la decena · AT-CRITERIO-TRES usa el 3 donde va
  // el 9 · AT-CRITERIO-PARIDAD toma las cifras pares donde van las impares (o al revés) · AT-CRITERIO-CERO toma la última
  // cifra como 0 · AT-RESPONDE-OTRA responde la otra cifra.
  const BL = 'arit-boleto';
  const boleto = datos => ({ pieza: BL, datos, estado: {} });
  const num4 = t => [{ raya: [t] }];
  const D3 = {
    envases: '10 = 9 + 1; 100 = 99 + 1; 1 000 = 999 + 1',
    lugares: [{ raya: ['abc'] }, ' = a × 100 + b × 10 + c, con a, b y c cifras'],
    nueve: ['Entre 9 y entre 3: N deja el mismo resto que la suma de sus cifras'],
    cuatro: ['Entre 4 y entre 25: N deja el mismo resto que el número de sus dos últimas cifras'],
    ocho: ['Entre 8: N deja el mismo resto que el número de sus tres últimas cifras'],
    cinco: ['Entre 2 y entre 5: N deja el mismo resto que su última cifra'],
    cien: '100 = 4 × 25; 1 000 = 8 × 125',
    seis: 'Un número es múltiplo de 6 si es par y múltiplo de 3',
  };
  const REGLA9 = [[['1 bolsita = 10 = 9 + '], ['1', 'o', 700]], [['1 caja = 100 = 99 + '], ['1', 'o', 700]]];
  const CTRL_C = [
    { id: 'c', etiqueta: 'Cajas de 100', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
    { id: 'b', etiqueta: 'Bolsitas de 10', min: 0, max: 9, paso: 1, inicio: 4, decimales: 0 },
    { id: 's', etiqueta: 'Sueltos', min: 0, max: 9, paso: 1, inicio: 3, decimales: 0 },
  ];
  const puestoC = (v, escala) => ({ n: 10, cajas: v.c, bolsitas: v.b, sueltos: v.s, ceros: true, colorCifras: false, escala, regla: REGLA9,
    rotulos: { cajas: [['deja '], [String(v.c), 'o', 700]], bolsitas: [['deja '], [String(v.b), 'o', 700]], sueltos: [[String(v.s), 'o', 700], [v.s === 1 ? ' suelto' : ' sueltos']] } });
  let escC = null;
  const escalaC = () => {
    if (escC) return escC;
    let mn = 1.7;
    for (let c = 1; c <= 4; c++) for (let b = 0; b <= 9; b++) for (const s of [0, 9]) mn = Math.min(mn, PUESTO().geometria(puestoC({ c, b, s })).sCabe);
    return (escC = Math.floor(mn * 100) / 100);
  };
  // Predice y «Mira»: 237 caramelos (2 cajas, 3 bolsitas y 7 sueltos) que se reempacan de 4 en 4.
  const ESC_P3 = 0.8;
  const P3 = { n: 10, cajas: 2, bolsitas: 3, sueltos: 7, ceros: true, colorCifras: false, escala: ESC_P3, regla: [[['Se reempaca en bolsitas de '], ['4', 'i', 700]]] };
  const ROT3 = { cajas: '2 cajas', bolsitas: '3 bolsitas', sueltos: '7 sueltos' };
  const ROT3b = { cajas: [['dejan '], ['0', 'o', 700]], bolsitas: '3 bolsitas', sueltos: '7 sueltos' };
  const ROT3c = { cajas: [['dejan '], ['0', 'o', 700]], bolsitas: '37 caramelos', sueltos: [['sobra '], ['1', 'o', 700]] };
  const MIRA_P3 = Object.assign({}, P3, { pasos: [{ rotulos: ROT3 }, { rotulos: ROT3b }, { rotulos: ROT3b }, { rotulos: ROT3c }, { rotulos: ROT3c }] });
  const cifrasDe = N => String(N).split('').map(Number);
  const sumaCifras = N => cifrasDe(N).reduce((a, x) => a + x, 0);

  // Ahora tú · tipo 0: el resto entre 3 con la suma de cifras.
  function casoTres(r) {
    const N = r.ent(1000, 9999), S = sumaCifras(N), v = N % 3;
    if (N % 9 < 3) return null;
    return {
      pregunta: `Doña Juana reempaca ${f(N, 0)} caramelos en bolsitas de 3. ¿Cuántos sueltos quedan?`,
      datos: [D3.nueve, D2.empaca],
      opciones: opciones(v, [
        { id: 'mayor', valor: S, error: 'AT-RESTO-MAYOR', siFuera: `Sumar las cifras está bien: ${S}. Pero un resto entre 3 es menor que 3.` },
        { id: 'nueve', valor: N % 9, error: 'AT-CRITERIO-NUEVE', siFuera: 'Ese es el resto entre 9. La bolsita es de 3: se reduce entre 3.' },
        { id: 'ultima', valor: (N % 10) % 3 === v ? (N % 10) : (N % 10) % 3, error: 'AT-CRITERIO-ULTIMA', siFuera: 'La última cifra sola sirve entre 2 y 5. Entre 3 cuentan todas las cifras.' },
      ]),
      solucion: { texto: `Las cifras suman ${S}, y ${S} = 3 × ${Math.floor(S / 3)} + ${S % 3}.`, ecuacion: [`${f(N, 0)} = `, MU(3), ' + ', sob(v)] },
    };
  }
  // Ahora tú · tipo 1: el resto entre 4 con las dos últimas cifras.
  function casoCuatro(r) {
    const N = r.ent(1000, 9999), u2 = N % 100, v = u2 % 4, S = sumaCifras(N);
    if (u2 < 10) return null;
    return {
      pregunta: `¿Qué resto deja ${f(N, 0)} al dividirlo entre 4?`,
      datos: [D3.cuatro, D3.cien],
      opciones: opciones(v, [
        { id: 'ultima', valor: (N % 10) % 4, error: 'AT-CRITERIO-ULTIMA', siFuera: 'La última cifra sola sirve entre 2 y 5. Entre 4, las decenas también dejan resto.' },
        { id: 'suma', valor: S % 4, error: 'AT-CRITERIO-SUMA', siFuera: 'Sumar las cifras sirve entre 3 y 9. Entre 4 se miran las dos últimas cifras.' },
        { id: 'mezcla', valor: (Math.floor(u2 / 10) + (u2 % 10)) % 4, error: 'AT-CRITERIO-MEZCLA', siFuera: `Las dos últimas cifras cuentan, pero como el número ${u2}, no sumadas.` },
        { id: 'mayor', valor: u2, error: 'AT-RESTO-MAYOR', siFuera: `Mirar ${u2} está bien. Falta dividirlo entre 4: un resto es menor que 4.` },
      ]),
      solucion: { texto: `Las centenas y los millares no dejan nada; queda ${u2}.`, ecuacion: [`${u2} = `, bas(4), ` × ${Math.floor(u2 / 4)} + `, sob(v)] },
    };
  }
  // Ahora tú · tipo 2: la cifra que falta para un múltiplo de 9.
  function casoOculta9(r) {
    const p = r.ent(1, 9), q = r.ent(0, 9), u = r.ent(0, 9), S = p + q + u, a = (9 - (S % 9)) % 9;
    if (S % 9 === 0) return null;
    return {
      pregunta: ['¿Qué cifra a hace que ', ...num4(`${p}a${q}${u}`), ' sea múltiplo de 9?'],
      datos: [D3.nueve, [{ raya: [`${p}a${q}${u}`] }, `: numeral de cifras ${p}, a, ${q} y ${u}`]],
      dibujo: boleto({ cifras: `${p}?${q}${u}`, letrero: [['Gana si es múltiplo de '], ['9', 'i', 700]] }),
      opciones: opciones(a, [
        { id: 'resto', valor: S % 9, error: 'AT-CRITERIO-RESTO', siFuera: `${S % 9} es lo que sobra de ${S} entre 9. La cifra tiene que completar otro 9.` },
        { id: 'decena', valor: (10 - (S % 10)) % 10, error: 'AT-CRITERIO-DECENA', siFuera: 'Eso completa la suma a una decena. Tiene que llegar a un múltiplo de 9.' },
        { id: 'tres', valor: (3 - (S % 3)) % 3, error: 'AT-CRITERIO-TRES', siFuera: 'Con esa cifra la suma es múltiplo de 3, pero no de 9.' },
        { id: 'uno', valor: (a + 1) % 10, error: 'AT-CONTEO', siFuera: 'Suma otra vez las cifras con ese valor: no da un múltiplo de 9.' },
      ]),
      solucion: { texto: `Las otras cifras suman ${S}; el siguiente múltiplo de 9 es ${S + a}.`, ecuacion: [`${S} + `, res(a), ` = ${S + a} = `, MU(9)] },
    };
  }
  // Ahora tú · tipo 3 (nivel examen): la suma de las cifras que hacen un múltiplo de 4.
  function casoSuma4(r) {
    const p = r.ent(1, 9), q0 = r.ent(1, 9), u = r.de([0, 2, 4, 6, 8]);
    const sirven = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => (10 * a + u) % 4 === 0), v = sirven.reduce((x, y) => x + y, 0);
    const mezcla = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => (a + u) % 4 === 0).reduce((x, y) => x + y, 0);
    return {
      pregunta: ['¿Cuánto suman todas las cifras a que hacen de ', ...num4(`${p}${q0}a${u}`), ' un múltiplo de 4?'],
      datos: [D3.cuatro, [{ raya: [`${p}${q0}a${u}`] }, `: numeral de cifras ${p}, ${q0}, a y ${u}`]],
      opciones: opciones(v, [
        { id: 'paridad', valor: 45 - v, error: 'AT-CRITERIO-PARIDAD', siFuera: `Prueba una: con a = ${sirven[0] + 1}, las dos últimas cifras forman ${10 * (sirven[0] + 1) + u}, que no es múltiplo de 4.` },
        { id: 'todas', valor: 45, error: 'AT-CRITERIO-ULTIMA', siFuera: 'Que la última cifra sea par no basta entre 4: cuentan las dos últimas.' },
        { id: 'mezcla', valor: mezcla, error: 'AT-CRITERIO-MEZCLA', siFuera: 'Las dos últimas cifras se leen como un número de dos cifras: no se suman.' },
        { id: 'cuantas', valor: sirven.length, error: 'AT-RESPONDE-OTRA', siFuera: `${sirven.length} son las cifras que sirven. Se pide cuánto suman.` },
      ]),
      solucion: { texto: `Sirven ${sirven.join(', ')}: con ellas, las dos últimas cifras forman un múltiplo de 4.`, ecuacion: [sirven.join(' + '), ' = ', res(v)] },
    };
  }
  // Ahora tú · tipo 4 (nivel examen; San Marcos 2023-II, la parte del 9): dos cifras ocultas con dos criterios.
  function casoDosCifras(r) {
    const p = r.ent(1, 9), q = r.ent(0, 9), S = p + q + 5, a = (9 - (S % 9)) % 9, a0 = (9 - ((p + q) % 9)) % 9;
    if (S % 9 === 0 || (p + q) % 9 === 0) return null;
    return {
      pregunta: ['El número ', ...num4(`${p}a${q}b`), ' es múltiplo de 5 y de 9, y b no es 0. ¿Cuánto vale a?'],
      datos: [D3.cinco, D3.nueve, [{ raya: [`${p}a${q}b`] }, `: numeral de cifras ${p}, a, ${q} y b`]],
      opciones: opciones(a, [
        { id: 'cero', valor: a0, error: 'AT-CRITERIO-CERO', siFuera: 'Eso sale con b = 0. El enunciado dice que b no es 0: b = 5.' },
        { id: 'resto', valor: S % 9, error: 'AT-CRITERIO-RESTO', siFuera: `${S % 9} es lo que sobra de ${S} entre 9. La cifra tiene que completar otro 9.` },
        { id: 'otra', valor: 5, error: 'AT-RESPONDE-OTRA', siFuera: '5 es b, la última cifra. Se pide a.' },
        { id: 'uno', valor: (a + 2) % 10, error: 'AT-CONTEO', siFuera: 'Suma las cifras con ese valor y con b = 5: no da un múltiplo de 9.' },
      ]),
      solucion: { texto: `Por el 5, b = 5. Las cifras suman ${S} + a, que tiene que ser múltiplo de 9.`, ecuacion: [`${S} + `, res(a), ` = ${S + a}`] },
    };
  }

  // Ejemplos resueltos de la idea 3. Cuentas rehechas aparte (cuentas-ideas.js): 2 143 → 10 → resto 1; 471 → 12, múltiplo
  // de 3; 3 487 entre 5 → 2; 5 318 entre 4 → 18 → 2; 7 359 entre 2 → 1; 98 765 → 35 → 8; 4 683 entre 25 → 83 → 8; 13 124
  // entre 8 → 124 → 4; 5a7 con 9: a = 6; 4 314 par y suma 12: múltiplo de 6; 4a3b con 5 y 9, b ≠ 0: b = 5, a = 6
  // (trampas 2, 3, 5 y 8); 7 438 + 2 = 7 440 (trampas 6, 0, 4 y 8); 251 348 entre 8 → 348 → 4 (trampas 0, 7, 3 y 48);
  // 73a6 con 4: a impar, suman 25 (trampas 20, 45, 8 y 5); con 2, 5 y 8 solo 528 y 852 (trampas 6, 0, 4 y 1).
  const EJEMPLOS_CRITERIOS = [
    { nivel: 1, titulo: 'La suma de las cifras',
      enunciado: '¿Qué resto deja 2 143 al dividirlo entre 9?',
      datos: [D3.nueve, D3.envases],
      solucion: [{ texto: 'Cada cajón, caja y bolsita deja 1 por cifra: se suman las cifras. 10 pasa de 9: se reduce.', ecuacion: ['2 + 1 + 4 + 3 = 10 = ', bas(9), ' + ', sob(1)] }],
      respuesta: ['Deja resto ', sob(1)] },
    { nivel: 1, titulo: '¿Múltiplo de 3?',
      enunciado: '¿Es 471 múltiplo de 3?',
      datos: [D3.nueve],
      solucion: [{ texto: 'Sus cifras suman 12, que es múltiplo de 3: no sobra nada.', ecuacion: ['4 + 7 + 1 = 12 = ', bas(3), ' × 4'] }],
      respuesta: ['Sí: deja resto ', sob(0)] },
    { nivel: 1, titulo: 'La última cifra',
      enunciado: '¿Qué resto deja 3 487 al dividirlo entre 5?',
      datos: [D3.cinco, '10 = 5 × 2'],
      solucion: [{ texto: 'Las bolsitas de 10 son múltiplos de 5: solo cuentan los 7 sueltos.', ecuacion: ['7 = ', bas(5), ' + ', sob(2)] }],
      respuesta: ['Deja resto ', sob(2)] },
    { nivel: 1, titulo: 'Las dos últimas cifras',
      enunciado: '¿Qué resto deja 5 318 al dividirlo entre 4?',
      datos: [D3.cuatro, D3.cien],
      solucion: [{ texto: 'Las cajas de 100 son múltiplos de 4: solo cuentan los últimos 18 caramelos.', ecuacion: ['18 = ', bas(4), ' × 4 + ', sob(2)] }],
      respuesta: ['Deja resto ', sob(2)] },
    { nivel: 1, titulo: 'Par o impar',
      enunciado: '¿Qué resto deja 7 359 al dividirlo entre 2? ¿Es par o impar?',
      datos: [D3.cinco, '10 = 2 × 5'],
      solucion: [{ texto: 'Solo cuenta la última cifra, 9, que deja 1 entre 2.', ecuacion: ['9 = ', bas(2), ' × 4 + ', sob(1)] }],
      respuesta: ['Deja resto ', sob(1), ': es impar'] },
    { nivel: 2, titulo: 'Reducir dos veces',
      enunciado: '¿Qué resto deja 98 765 al dividirlo entre 9?',
      datos: [D3.nueve, D2.empaca],
      solucion: [
        { texto: 'Sumo las cifras.', ecuacion: ['9 + 8 + 7 + 6 + 5 = 35'] },
        { texto: '35 todavía pasa de 9: lo reduzco. También sirve sumar sus cifras: 3 + 5.', ecuacion: ['35 = ', bas(9), ' × 3 + ', sob(8)] },
      ],
      respuesta: ['Deja resto ', sob(8)] },
    { nivel: 2, titulo: 'Entre 25',
      enunciado: 'Doña Juana reempaca 4 683 caramelos en bolsas de 25. ¿Cuántos sueltos quedan?',
      datos: [D3.cuatro, D3.cien],
      solucion: [
        { texto: 'Cada caja de 100 son 4 bolsas de 25: no deja nada. Quedan los últimos 83.' },
        { texto: 'Con 83 se llenan 3 bolsas de 25 y sobran 8.', ecuacion: ['83 = ', bas(25), ' × 3 + ', sob(8)] },
      ],
      respuesta: ['Quedan ', sob(8), ' sueltos'] },
    { nivel: 2, titulo: 'Entre 8',
      enunciado: '¿Qué resto deja 13 124 al dividirlo entre 8?',
      datos: [D3.ocho, D3.cien],
      solucion: [
        { texto: 'Un cajón de 1 000 son 125 bolsitas de 8: no deja nada. Quedan las tres últimas cifras, 124.' },
        { texto: 'Divido 124 entre 8.', ecuacion: ['124 = ', bas(8), ' × 15 + ', sob(4)] },
      ],
      respuesta: ['Deja resto ', sob(4)] },
    { nivel: 2, titulo: 'La cifra que falta',
      enunciado: ['¿Qué cifra a hace que ', ...num4('5a7'), ' sea múltiplo de 9?'],
      datos: [D3.nueve, [{ raya: ['5a7'] }, ': numeral de cifras 5, a y 7']],
      figura: boleto({ cifras: '5?7', letrero: [['Gana si es múltiplo de '], ['9', 'i', 700]] }),
      solucion: [
        { texto: 'Las cifras que se ven suman 5 + 7 = 12.' },
        { texto: 'El múltiplo de 9 que sigue a 12 es 18: faltan 6. Con 27 haría falta 15, que no es una cifra.', ecuacion: ['12 + ', res(6), ' = 18 = ', MU(9)] },
      ],
      respuesta: ['a = ', res(6)] },
    { nivel: 2, titulo: 'Múltiplo de 6',
      enunciado: '¿Es 4 314 múltiplo de 6?',
      datos: [D3.seis, D3.cinco, D3.nueve],
      solucion: [
        { texto: 'Termina en 4: es par.', ecuacion: ['4 = ', bas(2), ' × 2'] },
        { texto: 'Sus cifras suman 12: es múltiplo de 3. Cumple las dos cosas.', ecuacion: ['4 + 3 + 1 + 4 = 12 = ', bas(3), ' × 4'] },
      ],
      respuesta: ['Sí: deja resto ', sob(0), ' entre 6'] },
    { nivel: 3, titulo: 'Dos cifras ocultas',
      enunciado: ['El número ', ...num4('4a3b'), ' es múltiplo de 5 y de 9, y b no es 0. ¿Cuánto vale a?'],
      alternativas: ['2', '3', '5', '8', '6'],
      datos: [D3.cinco, D3.nueve, [{ raya: ['4a3b'] }, ': numeral de cifras 4, a, 3 y b']],
      solucion: [
        { texto: 'Por el 5, la última cifra es 0 o 5. No es 0: b = 5.' },
        { texto: 'Las cifras suman 4 + 3 + 5 + a = 12 + a, que tiene que ser múltiplo de 9.', ecuacion: ['12 + ', res(6), ' = 18'] },
        { texto: ['Las trampas: ', letra('A'), ' toma b = 0; ', letra('B'), ' es lo que sobra de 12; ', letra('C'), ' es b; ', letra('D'), ' completa 20, un múltiplo de 5.'] },
      ],
      respuesta: [letra('E'), ': a = ', res(6)] },
    { nivel: 3, titulo: 'Lo menos que se agrega',
      enunciado: '¿Cuál es el menor número de caramelos que hay que agregar a 7 438 para empacarlos en bolsitas de 4 sin que sobre ninguno?',
      alternativas: ['2', '6', '0', '4', '8'],
      datos: [D3.cuatro, D2.falta],
      solucion: [
        { texto: 'Solo cuentan las dos últimas cifras: 38 deja 2 entre 4.', ecuacion: ['38 = ', bas(4), ' × 9 + ', sob(2)] },
        { texto: 'Sobran 2: para otra bolsita de 4 faltan 2. Queda 7 440.', ecuacion: ['4 − ', sob(2), ' = ', res(2)] },
        { texto: ['Las trampas: ', letra('B'), ' va hasta 44; ', letra('C'), ' mira solo el 8 final; ', letra('D'), ' es la bolsita; ', letra('E'), ' completa el 8 hasta 16.'] },
      ],
      respuesta: [letra('A'), ': hay que agregar ', res(2)] },
    { nivel: 3, titulo: 'Las tres últimas cifras',
      enunciado: '¿Qué resto deja 251 348 al dividirlo entre 8?',
      alternativas: ['0', '4', '7', '3', '48'],
      datos: [D3.ocho, D3.cien],
      solucion: [
        { texto: 'Los millares son múltiplos de 8: quedan las tres últimas cifras, 348.', ecuacion: ['348 = ', bas(8), ' × 43 + ', sob(4)] },
        { texto: ['Las trampas: ', letra('A'), ' mira solo 48; ', letra('C'), ' suma las cifras; ', letra('D'), ' divide 251; ', letra('E'), ' no divide las dos últimas.'] },
      ],
      respuesta: [letra('B'), ': deja resto ', sob(4)] },
    { nivel: 3, titulo: 'Todas las cifras que sirven',
      enunciado: ['¿Cuánto suman todas las cifras a que hacen de ', ...num4('73a6'), ' un múltiplo de 4?'],
      alternativas: ['20', '45', '25', '8', '5'],
      datos: [D3.cuatro, [{ raya: ['73a6'] }, ': numeral de cifras 7, 3, a y 6']],
      solucion: [
        { texto: 'Las dos últimas cifras forman 16, 36, 56, 76 o 96 si a es impar: todos múltiplos de 4. Con a par, no.' },
        { texto: 'Sumo las cifras que sirven.', ecuacion: ['1 + 3 + 5 + 7 + 9 = ', res(25)] },
        { texto: ['Las trampas: ', letra('A'), ' toma las pares; ', letra('B'), ', todas; ', letra('D'), ' hace a + 6 múltiplo de 4; ', letra('E'), ' cuenta cuántas son.'] },
      ],
      respuesta: [letra('C'), ': suman ', res(25)] },
    { nivel: 3, titulo: 'Con tres cifras dadas',
      enunciado: 'Con las cifras 2, 5 y 8, usando cada una una sola vez, ¿cuántos números de tres cifras son múltiplos de 4?',
      alternativas: ['6', '0', '4', '2', '1'],
      datos: [D3.cuatro],
      solucion: [
        { texto: 'Mandan las dos últimas cifras. De 25, 28, 52, 58, 82 y 85, solo 28 y 52 son múltiplos de 4.', ecuacion: ['28 = ', bas(4), ' × 7 ; 52 = ', bas(4), ' × 13'] },
        { texto: 'La cifra que queda va adelante: 528 y 852.' },
        { texto: ['Las trampas: ', letra('A'), ' cuenta todos; ', letra('B'), ' usa la suma de cifras; ', letra('C'), ', los que terminan en par; ', letra('E'), ' se queda con uno.'] },
      ],
      respuesta: [letra('D'), ': son ', res(2)] },
  ];

  const criterios = {
    id: 'criterios',
    titulo: 'Criterios: lo que deja cada envase',
    pregunta: '¿Por qué sumar las cifras dice si un número es múltiplo de 9?',
    temas: ['Criterios de divisibilidad'],
    pieza: PU,
    aprendizaje: 'Entre 9 y 3, cada envase deja 1 por cifra: se suman las cifras. Entre 2, 4, 5 y 25 bastan las últimas cifras.',
    actividad: 'Reempacar cajas y bolsitas de 10 en bolsitas de 9 y juntar lo que sobra.',
    lee: {
      tarjetas: [
        { titulo: 'Reempacar de 9 en 9', texto: ['Doña Juana abre una bolsita de 10 caramelos y los pasa a una de ', bas(9), ': le sobra 1. Con una caja de 100 pasa igual: llena 11 bolsitas de 9 y le sobra 1.'],
          ecuacion: ['10 = ', bas(9), ' + ', sob(1), ' ; 100 = ', bas(9), ' × 11 + ', sob(1)],
          pieza: PU, dibujo: { datos: { n: 10, cajas: 1, bolsitas: 1, sueltos: 0, colorCifras: false, regla: REGLA9, rotulos: { cajas: [['deja '], ['1', 'o', 700]], bolsitas: [['deja '], ['1', 'o', 700]] } }, estado: {} } },
        { titulo: 'Cada cifra cuenta envases', texto: 'En 243 hay 2 cajas, 4 bolsitas y 3 sueltos: cada cifra dice cuántos envases hay de su tamaño. La suma de cifras de 243 es 2 + 4 + 3.',
          ecuacion: ['243 = 2 × 100 + 4 × 10 + 3'] },
        { titulo: 'Un criterio', texto: 'Un criterio de divisibilidad dice qué resto deja un número mirando solo sus cifras, sin hacer la división. Sale de lo que deja cada envase: la bolsita de 10, la caja de 100, el cajón de 1 000.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a reempacar cajas y bolsitas en bolsitas de 9. Mira cuánto deja cada caja y cada bolsita, y junta todo lo que sobra con los sueltos.' },
      ],
    },
    ejemplos: EJEMPLOS_CRITERIOS,
    juega: {
      pieza: PU,
      consigna: 'Doña Juana tiene cajas de 100, bolsitas de 10 y sueltos. Quiere reempacar todo en bolsitas de 9.',
      mision: {
        // Una sola respuesta: 2 + b + 5 múltiplo de 9 con b de 0 a 9 solo da b = 2 (225 = 9 × 25).
        texto: 'Con 2 cajas y 5 sueltos, elige las bolsitas para que no sobre nada.',
        logrado: v => v.c === 2 && v.s === 5 && (v.c + v.b + v.s) % 9 === 0,
        bien: 'Cada caja y cada bolsita dejó 1; con los 5 sueltos llenaron otra.',
      },
      voz: 'Mira lo que deja cada envase al reempacar.',
      leyenda: [
        { s: sob('deja'), t: 'lo que sobra de esos envases' },
        { s: sob('1'), t: 'sobra de cada bolsita o caja' },
      ],
      controles: CTRL_C,
      dibujo: v => ({ datos: puestoC(v, escalaC()), estado: {} }),
      lectura: v => { const t = v.c + v.b + v.s; return [`${100 * v.c + 10 * v.b + v.s}: `, sob(v.c), ' + ', sob(v.b), ' + ', sob(v.s), ` = ${t}: deja `, sob(t % 9), ' entre 9']; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Doña Juana tiene 2 cajas, 3 bolsitas y 7 sueltos: 237 caramelos. Los reempaca en bolsitas de ', bas(4), '. ¿Cuántos sueltos quedan?'],
      datos: ['1 caja = 100 caramelos; 1 bolsita = 10 caramelos', '100 = 4 × 25', '10 = 4 × 2 + 2'],
      voz: 'Piensa qué deja ahora cada caja.',
      opciones: [
        { id: 'c', texto: '1', correcta: true },
        { id: 'suma', texto: '0', error: 'AT-CRITERIO-SUMA', siFuera: 'Sumar las cifras sirve entre 9, donde cada envase deja 1. Entre 4, la caja no deja nada.' },
        { id: 'ultima', texto: '3', error: 'AT-CRITERIO-ULTIMA', siFuera: 'Mirar los 7 sueltos está bien, pero no basta: cada bolsita de 10 deja 2 entre 4.' },
        { id: 'mezcla', texto: '2', error: 'AT-CRITERIO-MEZCLA', siFuera: 'Las bolsitas y los sueltos cuentan, pero como 37 caramelos, no como 3 + 7.' },
      ],
      dibujo: fig(Object.assign({}, P3, { rotulos: ROT3 })),
      revelar: fig(Object.assign({}, P3, { rotulos: ROT3c })),
      coincide: 'Coincide: las cajas no dejan nada y 37 = 4 × 9 + 1.',
      noCoincide: 'Revisemos: cada caja de 100 son 25 bolsitas de 4, sin sueltos.',
    },
    mira: {
      pieza: PU,
      datos: MIRA_P3,
      voz: 'La caja no deja nada: cuentan las dos últimas cifras.',
      pasos: [
        { estado: { paso: 0 }, texto: '237 son 2 cajas, 3 bolsitas y 7 sueltos.', ecuacion: ['237 = 2 × 100 + 3 × 10 + 7'] },
        { estado: { paso: 1 }, texto: 'Cada caja de 100 son 25 bolsitas de 4: no deja nada.', ecuacion: ['100 = ', bas(4), ' × 25'] },
        { estado: { paso: 2 }, texto: 'Quedan 3 bolsitas y 7 sueltos: 37 caramelos.', ecuacion: ['237 = ', MU(4), ' + 37'] },
        { estado: { paso: 3 }, texto: 'Con 37 se llenan 9 bolsitas de 4 y sobra 1.', ecuacion: ['37 = ', bas(4), ' × 9 + ', sob(1)] },
        { estado: { paso: 4 }, texto: 'Entre 4 bastan las dos últimas cifras.', ecuacion: ['237 = ', MU(4), ' + ', sob(1)] },
      ],
    },
    regla: {
      texto: 'Entre 9 y 3 se suman las cifras: cada envase deja 1. Entre 2 y 5 basta la última cifra; entre 4 y 25, las dos últimas.',
      ecuacion: [{ llave: [{ raya: ['abc'] }], nota: 'cifras a, b y c' }, ' = ', MU(9), ' + ', sob('a + b + c'), SEP, { raya: ['abc'] }, ' = ', MU(4), ' + ', { raya: ['bc'] }, SEP, { raya: ['abc'] }, ' = ', MU(5), ' + c'],
      condicion: 'el número está en base 10. Entre 8 valen las tres últimas cifras; entre 6, par y múltiplo de 3.',
      voz: 'Mira qué deja cada envase entre ese divisor.',
    },
    // Así se resuelve: el resto entre 9 de un pedido de cuatro cifras, con la comprobación por la división. «Ahora tú»
    // pide el resto entre 3 y entre 4, y cifras ocultas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const N = r.ent(1000, 9999), cs = cifrasDe(N), S = sumaCifras(N), v = N % 9;
          if (S < 10 || v === 0) continue;
          return {
            enunciado: `El pedido de la semana fue de ${f(N, 0)} caramelos. Si doña Juana los reempaca en bolsitas de 9, ¿cuántos sueltos quedan?`,
            datos: [D3.nueve, D3.envases, D2.empaca],
            pasos: [
              { tipo: 'pide', texto: ['Piden el resto de ', f(N, 0), ' entre ', bas(9), ', sin hacer la división larga.'] },
              { tipo: 'datos', texto: `Las cifras son ${cs.join(', ')}: cajones de 1 000, cajas de 100, bolsitas de 10 y sueltos.` },
              { tipo: 'regla', texto: 'Entre 9, cada cajón, caja y bolsita deja 1: el número deja el mismo resto que la suma de sus cifras.' },
              { tipo: 'cuentas', texto: `Sumo las cifras y reduzco: ${S} pasa de 9.`, ecuacion: [`${cs.join(' + ')} = ${S} = `, bas(9), ` × ${Math.floor(S / 9)} + `, sob(v)] },
              { tipo: 'sentido', texto: 'Compruebo con la división completa: da el mismo resto.', ecuacion: [`${f(N, 0)} = `, bas(9), ` × ${f(Math.floor(N / 9), 0)} + `, sob(v)] },
            ],
            respuesta: v === 1 ? ['Queda ', sob(1), ' suelto'] : ['Quedan ', sob(v), ' sueltos'],
          };
        }
      },
    },
    ahoraTu: {
      pieza: BL,
      voz: 'Mira qué deja cada envase entre ese divisor.',
      generar(sem) {
        const r = azar(sem + 89), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoTres, r);
        if (tipo === 1) return conCuatro(casoCuatro, r);
        if (tipo === 2) return conCuatro(casoOculta9, r);
        if (tipo === 3) return conCuatro(casoSuma4, r);
        return conCuatro(casoDosCifras, r);
      },
    },
  };

  // ---------- Idea 4 (rehecha, 19 nov): los restos de potencias se repiten (restos potenciales) ----------
  // Propuesta §1 a §7. Conserva el id `restos-potenciales` y los controles `e` y `k`; la mesa `ciclos-largos` sigue con
  // la tabla. Objeto: el pedido que doña Juana duplica cada día (2, 4, 8… caramelos), empacado en bolsitas (arit-puesto),
  // con los sueltos de cada día anotados en el letrero (lo anterior queda como rastro).
  // Cambia: el día y el tamaño de la bolsita. · Permanece: cada día es el doble del anterior. · Progresa: sueltos del
  // día → el rastro de sueltos → uno que se repite. · Se reserva: saltar a un día muy lejano: es de la predicción.
  // · Debe verse: cuando un resto se repite, todo lo que sigue se repite.
  // Errores (hipótesis de aula): AT-CICLO-LUGAR responde el lugar en el ciclo y no el resto de ese lugar · AT-CICLO-FIN
  // cree que un exponente grande cae al final del ciclo · AT-POTENCIA-ENTERA cree que hay que calcular la potencia ·
  // AT-EXP-DIVISOR reduce el exponente entre el divisor y no entre el largo del ciclo · AT-CICLO-PRIMERO da el resto de
  // la primera potencia · AT-POTENCIA-MULTIPLO cree que la potencia es múltiplo del divisor · AT-RESTO-OLVIDA olvida un
  // término · AT-POTENCIA-PRODUCTO multiplica por el exponente en vez de elevar · AT-RESTO-IGUAL cree que el resto no cambia.
  const ciclo = (b, k) => { const xs = []; let x = b % k; const visto = new Map(); while (!visto.has(x)) { visto.set(x, xs.length); xs.push(x); x = (x * b) % k; } return { xs, ini: visto.get(x) }; };
  const largoDe = (b, k) => { const c = ciclo(b, k); return c.xs.length - c.ini; };
  // La tabla del ciclo (arit-tabla): potencia en tinta, su resto en naranja; los del ciclo, resaltados.
  const tablaPot = (b, k, n = 8, pasos) => {
    const c = ciclo(b, k), L = c.xs.length - c.ini, filasT = [];
    for (let e = 1; e <= n; e++) {
      const rv = powmod(b, e, k), enCiclo = e - 1 >= c.ini && (e - 1 - c.ini) < L;
      filasT.push([{ t: `${b}${sup(e)}`, paso: pasos ? e : 0 }, { t: String(rv), color: 'o', resalta: enCiclo, paso: pasos ? e : 0 }]);
    }
    return { columnas: [{ t: 'potencia' }, { t: `resto entre ${k}`, color: 'o' }], filas: filasT, filasMax: n, cabeza: true };
  };
  const lecturaPot = (b, k, e) => { const c = ciclo(b, k); return [`${b}${sup(e)} deja `, sob(powmod(b, e, k)), `; ciclo de ${c.xs.length - c.ini}${c.xs.length - c.ini <= 6 ? ': ' + c.xs.slice(c.ini).join(', ') : ''}`]; };
  const arrastrePot = n => ({ id: 'fila', etiqueta: 'fila de la tabla (el exponente)',
    donde: v => manijaFila(tablaPot(v.b, v.k, n), v.e - 1),
    mover: (pt, v) => ({ e: filaEn(tablaPot(v.b, v.k, n), pt.y, n - 1) + 1 }) });
  const pot = (b, e) => ({ sup: [String(b), String(e)] });
  const D4 = {
    ciclo: 'Los restos de las potencias de un número se repiten en ciclo: se calculan hasta que uno se repite',
    sigue: 'Cada resto sale de multiplicar el anterior por la base y volver a dividir',
    lugar: 'Dos potencias cuyos exponentes dejan el mismo resto entre el largo del ciclo dejan el mismo resto',
    ultima: 'La última cifra de un número es su resto entre 10',
    semana: 'La semana se repite cada 7 días',
  };
  const CTRL_P = [
    { id: 'e', etiqueta: 'Día', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0 },
    { id: 'k', etiqueta: 'Caramelos por bolsita', opciones: [{ valor: 5, texto: '5' }, { valor: 7, texto: '7' }, { valor: 9, texto: '9' }] },
  ];
  const puestoP = (v, escala) => {
    const N = 2 ** v.e, q = Math.floor(N / v.k), r = N % v.k, rastro = [];
    for (let e = 1; e <= v.e; e++) rastro.push((2 ** e) % v.k);
    return { n: v.k, bolsitas: q, sueltos: r, ceros: true, colorCifras: false, escala,
      regla: [[['1 bolsita = '], [String(v.k), 'i', 700], [' caramelos']], [[`Día ${v.e}: ${N} caramelos`]], [['Sueltos por día: '], [rastro.join(', '), 'o', 700]]],
      rotulos: { bolsitas: q === 1 ? '1 bolsita llena' : `${q} bolsitas llenas`, sueltos: [[String(r), 'o', 700], [r === 1 ? ' suelto' : ' sueltos']] } };
  };
  let escP = null;
  const escalaP = () => {
    if (escP) return escP;
    let mn = 1.7;
    for (let e = 1; e <= 6; e++) for (const k of [5, 7, 9]) mn = Math.min(mn, PUESTO().geometria(puestoP({ e, k })).sCabe);
    return (escP = Math.floor(mn * 100) / 100);
  };
  const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  // Ahora tú · tipos 0 y 1: el resto de una potencia (tipo 1: su última cifra, que es el resto entre 10).
  function casoPotencia(r, ultima) {
    const b = ultima ? r.de([2, 3, 7, 8, 12, 13]) : r.de([2, 3, 4, 5]), d = ultima ? 10 : r.de([7, 9, 11, 13].filter(x => x !== b)), n = r.ent(21, 99);
    const c = ciclo(b, d), L = c.xs.length - c.ini, lugar = n % L, v = powmod(b, n, d);
    // Ciclos de 3 a 6 restos: la tabla los muestra enteros y la solución cabe en 20 palabras.
    if (c.ini !== 0 || L < 3 || L > 6 || lugar === 0 && ultima) return null;
    const cic = c.xs.join(', ');
    return {
      pregunta: ultima ? ['¿En qué cifra termina ', pot(b, n), '?'] : ['¿Qué resto deja ', pot(b, n), ' al dividirlo entre ', bas(d), '?'],
      datos: ultima ? [D4.ultima, D4.ciclo, D4.lugar] : [D4.ciclo, D4.sigue, D4.lugar],
      dibujo: { pieza: 'arit-tabla', datos: tablaPot(b, d, Math.min(7, L + 1)), estado: {} },
      opciones: opciones(v, [
        { id: 'lugar', valor: lugar, error: 'AT-CICLO-LUGAR', siFuera: `${lugar} es el lugar en el ciclo (${n} entre ${L} deja ${lugar}). Falta ver qué resto hay en ese lugar.` },
        { id: 'fin', valor: c.xs[L - 1], error: 'AT-CICLO-FIN', siFuera: `En ${c.xs[L - 1]} termina el ciclo; ahí cae solo si el exponente es múltiplo de ${L}.` },
        { id: 'primero', valor: c.xs[0], error: 'AT-CICLO-PRIMERO', siFuera: 'Ese es el resto de la primera potencia. El exponente es mucho mayor.' },
        { id: 'expdiv', valor: powmod(b, (n % d) || d, d), error: 'AT-EXP-DIVISOR', siFuera: `El exponente se reduce entre el largo del ciclo, ${L}, no entre ${d}.` },
      ]),
      solucion: { texto: `El ciclo es ${cic} (largo ${L}); ${n} entre ${L} deja ${lugar}${lugar ? '' : ': toca el último'}.`, ecuacion: [pot(b, n), ultima ? ' termina en ' : ' deja ', sob(v)] },
    };
  }
  // Ahora tú · tipo 2: el día de la semana dentro de 2ⁿ días.
  function casoSemana(r) {
    const n = r.ent(20, 80), hoy = r.ent(0, 6), lugar = n % 3, resto = powmod(2, n, 7);
    const dia = k => DIAS[(hoy + k) % 7];
    return {
      pregunta: [`Hoy es ${DIAS[hoy]}. ¿Qué día de la semana será dentro de `, pot(2, n), ' días?'],
      datos: [D4.semana, D4.ciclo, D4.lugar],
      opciones: opciones(resto, [
        { id: 'lugar', valor: lugar || 3, error: 'AT-CICLO-LUGAR', siFuera: `Eso avanza el lugar en el ciclo. Hay que avanzar el resto que hay en ese lugar.` },
        { id: 'multiplo', valor: 0, error: 'AT-POTENCIA-MULTIPLO', siFuera: 'Caería el mismo día si la potencia fuera múltiplo de 7. Una potencia de 2 nunca lo es.' },
        { id: 'fin', valor: resto === 1 ? 2 : 1, error: 'AT-CICLO-FIN', siFuera: 'Ese día toca en otro lugar del ciclo de restos: revisa qué deja el exponente entre 3.' },
      ], dia),
      solucion: { texto: `Los restos entre 7 van 2, 4, 1; ${n} entre 3 deja ${lugar}: avanzan ${resto} ${resto === 1 ? 'día' : 'días'}.`, ecuacion: [pot(2, n), ' = ', MU(7), ' + ', sob(resto)] },
    };
  }
  // Ahora tú · tipo 3 (nivel examen): una potencia más un número.
  function casoPotMas(r) {
    const b = r.de([2, 3]), d = r.de([5, 7, 11]), n = r.ent(21, 90), c = r.ent(2, d - 1), L = largoDe(b, d), rp = powmod(b, n, d), bruto = rp + c, v = bruto % d;
    if (bruto < d) return null;
    return {
      pregunta: ['¿Qué resto deja ', pot(b, n), ` + ${c} al dividirlo entre `, bas(d), '?'],
      datos: [D4.ciclo, D4.lugar, D2.suma, D2.empaca],
      opciones: opciones(v, [
        { id: 'mayor', valor: bruto, error: 'AT-RESTO-MAYOR', siFuera: `Sumar los restos está bien: ${bruto}. Pero un resto entre ${d} es menor que ${d}.` },
        { id: 'olvida', valor: rp, error: 'AT-RESTO-OLVIDA', siFuera: `Ese es el resto de la potencia sola. Falta sumar ${c}.` },
        { id: 'multiplo', valor: c, error: 'AT-POTENCIA-MULTIPLO', siFuera: `Quedaría ${c} si la potencia fuera múltiplo de ${d}. No lo es: deja ${rp}.` },
        { id: 'lugar', valor: ((n % L) + c) % d, error: 'AT-CICLO-LUGAR', siFuera: 'El lugar en el ciclo no es el resto: hay que ver qué resto hay en ese lugar.' },
      ]),
      solucion: { texto: `La potencia deja ${rp} (ciclo de ${L}); con ${c} más son ${bruto}.`, ecuacion: [`${bruto} = `, bas(d), ' + ', sob(v)] },
    };
  }
  // Ahora tú · tipo 4 (nivel examen): la potencia de un número del que solo se sabe el resto.
  function casoBinomio(r) {
    const d = r.de([7, 9, 11]), rr = r.de([2, 3]), n = r.ent(20, 60), L = largoDe(rr, d), v = powmod(rr, n, d);
    return {
      pregunta: ['Un número N es ', MU(d), ' + ', sob(rr), '. ¿Qué resto deja ', { sup: ['N', String(n)] }, ' al dividirlo entre ', bas(d), '?'],
      datos: [D2.prod, D4.ciclo, D4.lugar],
      opciones: opciones(v, [
        { id: 'igual', valor: rr, error: 'AT-RESTO-IGUAL', siFuera: `${rr} deja N. Al multiplicarlo ${n} veces por sí mismo, el resto cambia.` },
        { id: 'producto', valor: (n * rr) % d, error: 'AT-POTENCIA-PRODUCTO', siFuera: `Eso deja ${n} × N. En una potencia los restos se multiplican entre sí.` },
        { id: 'lugar', valor: n % L, error: 'AT-CICLO-LUGAR', siFuera: 'Ese es el lugar en el ciclo. Falta ver qué resto hay en ese lugar.' },
        { id: 'fin', valor: 1, error: 'AT-CICLO-FIN', siFuera: `En 1 termina el ciclo; ahí cae solo si el exponente es múltiplo de ${L}.` },
      ]),
      solucion: { texto: `Los restos se multiplican: es el resto de ${rr} elevado a ${n}. Ciclo de ${L}; ${n} entre ${L} deja ${n % L}.`, ecuacion: [{ sup: ['N', String(n)] }, ' = ', MU(d), ' + ', sob(v)] },
    };
  }

  // Ejemplos resueltos de la idea 4. Cuentas rehechas aparte (cuentas-ideas.js): 3, 9 y 27 entre 5 dejan 3, 4 y 2; 2 × 2
  // = 4; potencias de 2 entre 7: 2, 4, 1 (largo 3); 3⁴ = 81; 2⁹ = 512 = 7 × 73 + 1; 2³⁵: 35 = 3 × 11 + 2 → 4; 3²⁰ entre
  // 5: ciclo 3, 4, 2, 1 → 1; 7²³: ciclo 7, 9, 3, 1; 23 = 4 × 5 + 3 → 3; 2²⁰ entre 7 → 4: viernes; 10, 100 y 1 000 entre 7
  // dejan 3, 2 y 6; 2¹⁰⁰: 100 = 3 × 33 + 1 → 2; 3⁴⁷: 47 = 4 × 11 + 3 → termina en 7; 2⁴¹ → 4, más 3 = 7 → 0; 2⁴⁰ entre 9:
  // ciclo 2, 4, 8, 7, 5, 1; 40 = 6 × 6 + 4 → 7; 3¹⁰⁰ entre 7: ciclo 3, 2, 6, 4, 5, 1; 100 = 6 × 16 + 4 → 4: sábado.
  const EJEMPLOS_POTENCIAS = [
    { nivel: 1, titulo: 'Los primeros restos',
      enunciado: ['¿Qué restos dejan 3, ', pot(3, 2), ' y ', pot(3, 3), ' al dividirlos entre 5?'],
      datos: [[pot(3, 2), ' = 9; ', pot(3, 3), ' = 27']],
      solucion: [{ texto: 'Divido cada potencia entre 5.', ecuacion: ['3 = ', sob(3), ' ; 9 = ', bas(5), ' + ', sob(4), ' ; 27 = ', bas(5), ' × 5 + ', sob(2)] }],
      respuesta: ['Dejan ', sob('3, 4 y 2')] },
    { nivel: 1, titulo: 'El resto que sigue',
      enunciado: [pot(2, 4), ' deja resto 2 al dividirlo entre 7. ¿Qué resto deja ', pot(2, 5), '?'],
      datos: [D4.sigue],
      solucion: [{ texto: 'La potencia siguiente es el doble: los sueltos también se duplican.', ecuacion: ['2 × ', sob(2), ' = ', sob(4)] }],
      respuesta: ['Deja resto ', sob(4)] },
    { nivel: 1, titulo: 'El largo del ciclo',
      enunciado: 'Los restos de las potencias de 2 entre 7 son 2, 4, 1, 2, 4, 1… ¿Cuánto mide el ciclo?',
      datos: [D4.ciclo],
      solucion: [{ texto: 'Después de 2, 4 y 1 vuelve a salir el 2: se repiten de tres en tres.' }],
      respuesta: ['El ciclo mide ', res(3)] },
    { nivel: 1, titulo: 'La última cifra',
      enunciado: ['¿En qué cifra termina ', pot(3, 4), '?'],
      datos: [D4.ultima],
      solucion: [{ texto: 'Multiplico 3 cuatro veces: 3, 9, 27 y 81.', ecuacion: [pot(3, 4), ' = 81 = ', MU(10), ' + ', sob(1)] }],
      respuesta: ['Termina en ', sob(1)] },
    { nivel: 1, titulo: 'Un día del ciclo',
      enunciado: ['Los restos de las potencias de 2 entre 7 van 2, 4, 1 y se repiten. ¿Qué resto deja ', pot(2, 9), '?'],
      datos: [D4.lugar],
      solucion: [{ texto: '9 es múltiplo de 3: se completan tres vueltas y toca el último del ciclo.', ecuacion: ['9 = 3 × 3'] }],
      respuesta: ['Deja resto ', sob(1)] },
    { nivel: 2, titulo: 'Un exponente grande',
      enunciado: ['¿Qué resto deja ', pot(2, 35), ' al dividirlo entre 7?'],
      datos: [D4.ciclo, D4.lugar],
      figura: { pieza: 'arit-tabla', datos: tablaPot(2, 7, 4), estado: {} },
      solucion: [
        { texto: 'El ciclo de restos es 2, 4, 1: mide 3. Divido el exponente entre 3.', ecuacion: ['35 = 3 × 11 + 2'] },
        { texto: 'Sobran 2: toca el segundo del ciclo.', ecuacion: [pot(2, 35), ' = ', MU(7), ' + ', sob(4)] },
      ],
      respuesta: ['Deja resto ', sob(4)] },
    { nivel: 2, titulo: 'Hallar el ciclo',
      enunciado: ['¿Qué resto deja ', pot(3, 20), ' al dividirlo entre 5?'],
      datos: [D4.ciclo, D4.sigue, D4.lugar],
      solucion: [
        { texto: 'Calculo restos hasta que se repitan: 3; 3 × 3 = 9 deja 4; 3 × 4 = 12 deja 2; 3 × 2 = 6 deja 1.' },
        { texto: 'El ciclo 3, 4, 2, 1 mide 4, y 20 es múltiplo de 4: toca el último.', ecuacion: ['20 = 4 × 5'] },
      ],
      respuesta: ['Deja resto ', sob(1)] },
    { nivel: 2, titulo: 'La última cifra de una potencia',
      enunciado: ['¿En qué cifra termina ', pot(7, 23), '?'],
      datos: [D4.ultima, D4.ciclo, D4.lugar],
      solucion: [
        { texto: 'Las potencias de 7 terminan en 7, 9, 3, 1 y se repiten: el ciclo mide 4.' },
        { texto: 'Divido 23 entre 4: sobran 3. Toca el tercero del ciclo.', ecuacion: ['23 = 4 × 5 + 3'] },
      ],
      respuesta: ['Termina en ', sob(3)] },
    { nivel: 2, titulo: 'El día de la semana',
      enunciado: ['Hoy es lunes. ¿Qué día de la semana será dentro de ', pot(2, 20), ' días?'],
      datos: [D4.semana, D4.ciclo, D4.lugar],
      solucion: [
        { texto: 'Los restos de las potencias de 2 entre 7 van 2, 4, 1. Como 20 = 3 × 6 + 2, toca el segundo: 4.' },
        { texto: 'Las semanas completas no cambian el día: avanzo 4 días desde el lunes.' },
      ],
      respuesta: ['Será ', res('viernes')] },
    { nivel: 2, titulo: 'Las potencias de 10 entre 7',
      enunciado: '¿Qué restos dejan 10, 100 y 1 000 al dividirlos entre 7?',
      datos: [D4.sigue],
      solucion: [
        { texto: '10 deja 3. Para 100, multiplico ese resto por 10: 30 deja 2.', ecuacion: ['10 = ', bas(7), ' + ', sob(3), ' ; 30 = ', bas(7), ' × 4 + ', sob(2)] },
        { texto: 'Para 1 000, otra vez por 10: 20 deja 6.', ecuacion: ['20 = ', bas(7), ' × 2 + ', sob(6)] },
      ],
      respuesta: ['Dejan ', sob('3, 2 y 6')] },
    { nivel: 3, titulo: 'Una potencia enorme',
      enunciado: ['¿Qué resto deja ', pot(2, 100), ' al dividirlo entre 7?'],
      alternativas: ['1', '4', '0', '2', '3'],
      datos: [D4.ciclo, D4.lugar],
      solucion: [
        { texto: 'El ciclo de restos es 2, 4, 1: mide 3.', ecuacion: ['100 = 3 × 33 + 1'] },
        { texto: 'Sobra 1: toca el primero del ciclo.', ecuacion: [pot(2, 100), ' = ', MU(7), ' + ', sob(2)] },
        { texto: ['Las trampas: ', letra('A'), ' cae al final del ciclo; ', letra('B'), ' toma el segundo; ', letra('C'), ' la cree múltiplo de 7; ', letra('E'), ' es el largo del ciclo.'] },
      ],
      respuesta: [letra('D'), ': deja resto ', sob(2)] },
    { nivel: 3, titulo: 'Una cifra final lejana',
      enunciado: ['¿En qué cifra termina ', pot(3, 47), '?'],
      alternativas: ['3', '7', '9', '1', '4'],
      datos: [D4.ultima, D4.ciclo, D4.lugar],
      solucion: [
        { texto: 'Las potencias de 3 terminan en 3, 9, 7, 1 y se repiten: el ciclo mide 4.', ecuacion: ['47 = 4 × 11 + 3'] },
        { texto: 'Sobran 3: toca el tercero del ciclo.' },
        { texto: ['Las trampas: ', letra('A'), ' es el primero; ', letra('C'), ', el segundo; ', letra('D'), ', el último; ', letra('E'), ' es el largo del ciclo.'] },
      ],
      respuesta: [letra('B'), ': termina en ', sob(7)] },
    { nivel: 3, titulo: 'Una potencia más tres',
      enunciado: ['¿Qué resto deja ', pot(2, 41), ' + 3 al dividirlo entre 7?'],
      alternativas: ['7', '4', '5', '3', '0'],
      datos: [D4.ciclo, D4.lugar, D2.suma, D2.empaca],
      solucion: [
        { texto: 'El ciclo es 2, 4, 1. Como 41 = 3 × 13 + 2, la potencia deja 4.' },
        { texto: 'Sumo el 3 y vuelvo a empacar: con 7 se llena otra bolsita.', ecuacion: [sob(4), ' + 3 = 7 = ', bas(7), ' + ', sob(0)] },
        { texto: ['Las trampas: ', letra('A'), ' no reduce; ', letra('B'), ' olvida el 3; ', letra('C'), ' suma el lugar, 2 + 3; ', letra('D'), ' cree que la potencia es múltiplo.'] },
      ],
      respuesta: [letra('E'), ': deja resto ', sob(0)] },
    { nivel: 3, titulo: 'Solo se sabe el resto',
      enunciado: ['Un número N es ', MU(9), ' + 2. ¿Qué resto deja ', { sup: ['N', '40'] }, ' al dividirlo entre 9?'],
      alternativas: ['7', '2', '8', '1', '4'],
      datos: [D2.prod, D4.ciclo, D4.lugar],
      solucion: [
        { texto: 'En un producto se multiplican los restos: es el resto de 2 elevado a 40.' },
        { texto: 'Entre 9, las potencias de 2 dejan 2, 4, 8, 7, 5, 1: el ciclo mide 6. Toca el cuarto.', ecuacion: ['40 = 6 × 6 + 4'] },
        { texto: ['Las trampas: ', letra('B'), ' deja el resto de N; ', letra('C'), ' hace 40 × 2; ', letra('D'), ' cae al final; ', letra('E'), ' es el lugar en el ciclo.'] },
      ],
      respuesta: [letra('A'), ': deja resto ', sob(7)] },
    { nivel: 3, titulo: 'Dentro de muchos días',
      enunciado: ['Hoy es martes. ¿Qué día de la semana será dentro de ', pot(3, 100), ' días?'],
      alternativas: ['martes', 'miércoles', 'sábado', 'viernes', 'domingo'],
      datos: [D4.semana, D4.ciclo, D4.sigue, D4.lugar],
      solucion: [
        { texto: 'Entre 7, las potencias de 3 dejan 3, 2, 6, 4, 5, 1: el ciclo mide 6.', ecuacion: ['100 = 6 × 16 + 4'] },
        { texto: 'Toca el cuarto del ciclo: 4. Avanzo 4 días desde el martes.' },
        { texto: ['Las trampas: ', letra('A'), ' la cree múltiplo de 7; ', letra('B'), ' avanza 1; ', letra('D'), ' avanza 3; ', letra('E'), ' avanza 5: otros lugares del ciclo.'] },
      ],
      respuesta: [letra('C'), ': será ', res('sábado')] },
  ];

  const potencias = {
    id: 'restos-potenciales',
    titulo: 'Los restos de potencias se repiten',
    pregunta: '¿Qué resto deja una potencia enorme?',
    temas: ['Restos potenciales'],
    pieza: PU,
    aprendizaje: 'Los restos de las potencias de un número se repiten en ciclo: el exponente se cambia por su resto entre el largo del ciclo.',
    actividad: 'Duplicar el pedido cada día y anotar los sueltos hasta que se repitan.',
    lee: {
      tarjetas: [
        { titulo: 'El pedido que se duplica', texto: ['Para la fiesta de la promoción, doña Juana duplica el pedido cada día: 2 caramelos el día 1, 4 el día 2, 8 el día 3. El día 3 llena una bolsita de ', bas(7), ' y le queda 1 suelto.'],
          ecuacion: ['2 × 2 × 2 = 8 = ', bas(7), ' + ', sob(1)],
          pieza: PU, dibujo: { datos: { n: 7, bolsitas: 1, sueltos: 1, regla: [[['1 bolsita = '], ['7', 'i', 700], [' caramelos']], [['Día 3: 8 caramelos']]], colorCifras: false, rotulos: { bolsitas: '1 bolsita llena', sueltos: [['1', 'o', 700], [' suelto']] } }, estado: {} } },
        { titulo: 'Potencia y exponente', texto: ['2 × 2 × 2 se escribe ', pot(2, 3), ': es una potencia de 2. El 3 es el exponente: dice cuántas veces se multiplica el 2. Los restos de las potencias de un número se llaman restos potenciales.'],
          ecuacion: [pot(2, 3), ' = 2 × 2 × 2 = 8'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a avanzar los días. Mira el letrero «Sueltos por día» y busca cuándo vuelve a salir un número que ya había salido.' },
      ],
    },
    ejemplos: EJEMPLOS_POTENCIAS,
    juega: {
      pieza: PU,
      consigna: 'Doña Juana duplica el pedido cada día y lo empaca en bolsitas iguales. El letrero anota los sueltos de cada día.',
      mision: {
        texto: 'Con bolsitas de 7, busca el siguiente día en que vuelven a quedar 2 sueltos.',
        logrado: v => v.k === 7 && v.e === 4,
        bien: 'El día 4 quedan 2 sueltos, como el día 1: desde ahí todo se repite.',
      },
      voz: 'Avanza los días y mira los sueltos.',
      leyenda: [
        { s: bas('bolsita'), t: 'lo que lleva cada una' },
        { s: sob('sueltos'), t: 'el resto de ese día' },
      ],
      controles: CTRL_P,
      dibujo: v => ({ datos: puestoP(v, escalaP()), estado: {} }),
      lectura: v => { const N = 2 ** v.e; return [`día ${v.e}: 2${sup(v.e)} = ${N} = `, bas(v.k), ` × ${Math.floor(N / v.k)} + `, sob(N % v.k)]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Si sigue duplicando, el día 50 tendrá ', pot(2, 50), ' caramelos. Con bolsitas de ', bas(7), ', ¿cuántos sueltos quedan ese día?'],
      datos: ['1 bolsita = 7 caramelos', 'Sueltos de los días 1 a 6: 2, 4, 1, 2, 4 y 1'],
      voz: 'No hace falta calcular la potencia.',
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'lugar', texto: '2', error: 'AT-CICLO-LUGAR', siFuera: '50 entre 3 deja 2: ese es el lugar en el ciclo. En el segundo lugar hay 4 sueltos.' },
        { id: 'fin', texto: '1', error: 'AT-CICLO-FIN', siFuera: 'En 1 termina el ciclo cuando el día es múltiplo de 3. El 50 no lo es.' },
        { id: 'entera', texto: 'No se puede saber sin calcular la potencia', error: 'AT-POTENCIA-ENTERA', siFuera: 'No hace falta: los sueltos se repiten cada 3 días, y con eso se salta al día 50.' },
      ],
      // Predice dibuja la pregunta y lo que revela con una misma pieza: la tabla de los seis primeros días.
      pieza: 'arit-tabla',
      dibujo: { datos: tablaPot(2, 7, 6), estado: {} },
      revelar: { datos: tablaPot(2, 7, 6), estado: { fila: 1 } },
      coincide: 'Coincide: 50 = 3 × 16 + 2, y el segundo del ciclo es 4.',
      noCoincide: 'Revisemos: los sueltos van 2, 4, 1 y se repiten cada 3 días.',
    },
    mira: {
      pieza: 'arit-tabla',
      datos: tablaPot(2, 7, 6, true),
      voz: 'Cuando un resto se repite, todo se repite.',
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'Día 1: 2 caramelos, 2 sueltos.', ecuacion: ['2 = ', sob(2)] },
        { estado: { paso: 3, fila: 2 }, texto: 'Cada día se duplican los sueltos del anterior: 2, 4, 8.', ecuacion: ['8 = ', bas(7), ' + ', sob(1)] },
        { estado: { paso: 6, fila: [3, 4, 5] }, texto: 'Después de 1 vuelve el 2: el ciclo 2, 4, 1 mide 3.' },
        { estado: { paso: 6, fila: 1 }, texto: 'Divido 50 entre 3: sobran 2. Toca el segundo del ciclo.', ecuacion: ['50 = 3 × 16 + 2'] },
        { estado: { paso: 6, fila: 1 }, texto: 'El día 50 quedan los mismos sueltos que el día 2.', ecuacion: [pot(2, 50), ' = ', MU(7), ' + ', sob(4)] },
      ],
    },
    regla: {
      texto: 'Los restos de las potencias de un número se repiten en ciclo. El exponente se cambia por su resto entre el largo del ciclo; si es 0, vale el último.',
      ecuacion: ['ciclo de restos: ', { llave: [sob('2, 4, 1')], nota: 'largo 3', color: 'c-o' }, SEP, '50 = 3 × 16 + ', { llave: ['2'], nota: 'lugar en el ciclo' }, SEP, pot(2, 50), ' = ', MU(7), ' + ', sob(4)],
      condicion: 'el ciclo se halla calculando restos hasta que uno se repite. La última cifra de una potencia es su resto entre 10.',
      voz: 'Busca el ciclo y reduce el exponente.',
    },
    // Así se resuelve: el resto de una potencia de 3, 4 o 5 entre 7, con la tabla del ciclo. «Ahora tú» cambia de base y
    // de divisor, y pide además la última cifra, el día de la semana, una suma y la potencia de un múltiplo más algo.
    resuelve: {
      pieza: 'arit-tabla',
      generar(s) {
        const r = azar(s + 900), b = r.de([3, 4, 5]), n = r.ent(100, 160), c = ciclo(b, 7), L = c.xs.length, p = n % L, lugar = p === 0 ? L : p, v = powmod(b, n, 7);
        const tabla = fila => ({ pieza: 'arit-tabla', datos: tablaPot(b, 7, L + 1), estado: fila === undefined ? {} : { fila } });
        return {
          enunciado: ['¿Qué resto deja ', pot(b, n), ' al dividirlo entre ', bas(7), '?'],
          datos: [D4.ciclo, D4.sigue, D4.lugar],
          dibujo: tabla(),
          pasos: [
            { tipo: 'pide', texto: ['Piden el resto de ', pot(b, n), ' entre ', bas(7), '. Es un número enorme: no lo voy a calcular entero.'] },
            { tipo: 'regla', texto: 'Cada resto sale del anterior por la base, así que se repiten en ciclo. Cambio el exponente por lo que sobra al dividirlo entre el largo del ciclo.' },
            { tipo: 'cuentas', texto: `Calculo restos hasta que se repitan: ${c.xs.join(', ')}. El ciclo mide ${L}.` },
            { tipo: 'cuentas', texto: p === 0 ? `${n} es múltiplo de ${L}: toca el último del ciclo.` : `${n} entre ${L} deja ${p}: toca el lugar ${p} del ciclo.`,
              ecuacion: [`${n} = ${L} × ${Math.floor(n / L)} + ${p}   →   `, pot(b, n), ' = ', MU(7), ' + ', sob(v)], dibujo: tabla(lugar - 1) },
            { tipo: 'sentido', texto: ['Compruebo: ', pot(b, L), ' deja 1, así que cada vuelta completa del ciclo no cambia el resto.'] },
          ],
          respuesta: ['Deja resto ', sob(v)],
        };
      },
    },
    ahoraTu: {
      pieza: 'arit-tabla',
      voz: 'Busca el ciclo y reduce el exponente.',
      generar(sem) {
        const r = azar(sem + 113), tipo = sem % 5;
        if (tipo === 0) return conCuatro(q => casoPotencia(q, false), r);
        if (tipo === 1) return conCuatro(q => casoPotencia(q, true), r);
        if (tipo === 2) return conCuatro(casoSemana, r);
        if (tipo === 3) return conCuatro(casoPotMas, r);
        return conCuatro(casoBinomio, r);
      },
    },
  };

  // ---------- Idea 5 (nueva, 19 nov): criterios del 11, 7 y 13 (cada lugar con su peso) ----------
  // Propuesta §1 a §7. Objeto: un boleto de la rifa con una cifra borrada por la lluvia (pieza arit-boleto, de prueba);
  // debajo de cada cifra, el peso de su lugar. Cambia: la cifra que se prueba. · Permanece: el boleto y sus pesos.
  // · Progresa: la suma con signos → lo que sobra o falta → cero. · Se reserva: los pesos del 7 (1, 3, 2): son de la
  // predicción. · Debe verse: entre 11, lo que sobra en unos lugares compensa lo que falta en los otros.
  // Errores (hipótesis de aula): AT-CRITERIO-SUMA-7 suma las cifras con el 7, el 11 o el 13 · AT-CRITERIO-ALTERNA alterna
  // signos con un divisor que no es 11 · AT-PESO-SIN-REDUCIR no reduce · AT-PESO-SIGNO empieza restando las unidades ·
  // AT-PESO-NEGATIVO le quita el signo a un total negativo · AT-PESO-ORDEN lee los pesos desde la izquierda ·
  // AT-PESO-SIN-SIGNO usa los pesos sin su signo · AT-PESO-OTRO usa los pesos de otro divisor.
  const P11 = [1, -1, 1, -1, 1, -1], P7 = [1, 3, 2, -1, -3, -2], P13 = [1, -3, -4, -1, 3, 4];
  const pesada = (N, P) => String(N).split('').reverse().reduce((a, c, i) => a + +c * P[i % 6], 0);
  const menosT = x => String(x).replace('-', '−');
  const pesosT = (k, P) => Array.from({ length: k }, (_, i) => (P[k - 1 - i] > 0 && P === P11 ? '+' : '') + menosT(P[k - 1 - i]));
  // Las cifras a (de 0 a 9) que cumplen una condición al ponerlas en el lugar de la «a» de un patrón como '2a5'.
  const cifrasQue = (patron, cumple) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => cumple(+patron.replace(/a/g, String(a)), a));
  const D5 = {
    regla: 'Resto de N = resto de la suma de cada cifra por el peso de su lugar',
    once: ['Pesos entre ', bas(11), ', desde las unidades: +1, −1, +1, −1…'],
    siete: ['Pesos entre ', bas(7), ', desde las unidades: 1, 3, 2, −1, −3, −2'],
    trece: ['Pesos entre ', bas(13), ', desde las unidades: 1, −3, −4, −1, 3, 4'],
    negativo: 'Si el total sale negativo, se le suma el divisor hasta que deje de serlo',
  };
  const GANA11 = [['Gana si es múltiplo de '], ['11', 'i', 700]];

  // Ahora tú · tipo 0: el resto entre 11 con la suma alternada.
  function casoOnce(r) {
    const N = r.ent(1000, 9999), alt = pesada(N, P11), v = mod(alt, 11), S = sumaCifras(N);
    if (alt === 0 || alt === v && r() < 0.5) return null;
    return {
      pregunta: `¿Qué resto deja ${f(N, 0)} al dividirlo entre 11?`,
      datos: [D5.regla, D5.once, D5.negativo],
      opciones: opciones(v, [
        { id: 'suma', valor: S % 11, error: 'AT-CRITERIO-SUMA-7', siFuera: 'Sumar todas las cifras sirve entre 9. Entre 11 se suman y se restan alternando.' },
        { id: 'signo', valor: mod(-alt, 11), error: 'AT-PESO-SIGNO', siFuera: 'Los signos van al revés: las unidades se suman, las decenas se restan.' },
        { id: 'negativo', valor: alt < 0 ? -alt : null, error: 'AT-PESO-NEGATIVO', siFuera: `El total es ${menosT(alt)}: faltan ${-alt} para un múltiplo de 11. Lo que sobra es 11 − ${-alt}.` },
        { id: 'ultima', valor: N % 10, error: 'AT-CRITERIO-ULTIMA', siFuera: 'La última cifra sola sirve entre 2 y 5.' },
      ]),
      solucion: { texto: `Desde las unidades, sumando y restando: ${menosT(alt)}${alt < 0 ? `, y ${menosT(alt)} + 11 = ${v}` : alt >= 11 ? `, y ${alt} − 11 = ${v}` : ''}.`, ecuacion: [`${f(N, 0)} = `, MU(11), ' + ', sob(v)] },
    };
  }
  // Ahora tú · tipo 1: el resto entre 7 con los pesos 1, 3 y 2.
  function casoSiete(r) {
    const N = r.ent(112, 999), cs = cifrasDe(N), tot = pesada(N, P7), v = N % 7;
    return {
      pregunta: `¿Qué resto deja ${N} al dividirlo entre 7?`,
      datos: [D5.regla, D5.siete],
      opciones: opciones(v, [
        { id: 'suma', valor: sumaCifras(N) % 7, error: 'AT-CRITERIO-SUMA-7', siFuera: 'Sumar las cifras sirve entre 9. Entre 7, la decena pesa 3 y la centena 2.' },
        { id: 'orden', valor: (cs[0] + 3 * cs[1] + 2 * cs[2]) % 7, error: 'AT-PESO-ORDEN', siFuera: 'Los pesos 1, 3 y 2 se cuentan desde las unidades, no desde la izquierda.' },
        { id: 'alterna', valor: mod(cs[2] - cs[1] + cs[0], 7), error: 'AT-CRITERIO-ALTERNA', siFuera: 'Alternar signos es del 11. Entre 7 los pesos son 1, 3 y 2.' },
        { id: 'sin', valor: tot, error: 'AT-PESO-SIN-REDUCIR', siFuera: `Los pesos están bien: ${tot}. Falta reducir: un resto entre 7 es menor que 7.` },
      ]),
      solucion: { texto: `${cs[2]} × 1 + ${cs[1]} × 3 + ${cs[0]} × 2 = ${tot}, y se reduce entre 7.`, ecuacion: [`${tot} = `, bas(7), ` × ${Math.floor(tot / 7)} + `, sob(v)] },
    };
  }
  // Ahora tú · tipo 2: la cifra borrada de un boleto que es múltiplo de 11.
  function casoBorrada(r) {
    const p = r.ent(1, 9), q = r.ent(0, 9), u = r.ent(0, 9), pat = `${p}a${q}${u}`;
    const ok = cifrasQue(pat, N => N % 11 === 0), suma = cifrasQue(pat, N => sumaCifras(N) % 11 === 0), resto = mod(u - q - p, 11);
    if (ok.length !== 1 || suma.length !== 1) return null;
    const a = ok[0];
    return {
      pregunta: ['La lluvia borró una cifra del boleto ', ...num4(`${p}☐${q}${u}`), ', que es múltiplo de ', bas(11), '. ¿Qué cifra era?'],
      datos: [D5.regla, D5.once],
      dibujo: boleto({ cifras: `${p}?${q}${u}`, pesos: pesosT(4, P11), letrero: GANA11 }),
      opciones: opciones(a, [
        { id: 'suma', valor: suma[0], error: 'AT-CRITERIO-SUMA-7', siFuera: 'Con esa cifra, las cifras suman un múltiplo de 11. Pero entre 11 se suman y se restan alternando.' },
        { id: 'resto', valor: resto > 9 ? null : resto, error: 'AT-CRITERIO-RESTO', siFuera: 'Eso dejan las otras tres cifras. La borrada lleva peso +1: tiene que compensar lo que falta.' },
        { id: 'uno', valor: (a + 1) % 10, error: 'AT-CONTEO', siFuera: 'Haz la cuenta con esa cifra: no da 0 ni un múltiplo de 11.' },
        { id: 'cinco', valor: (a + 5) % 10, error: 'AT-CONTEO', siFuera: 'Haz la cuenta con esa cifra: no da 0 ni un múltiplo de 11.' },
      ]),
      solucion: { texto: `${u} − ${q} + a − ${p} tiene que ser 0 o un múltiplo de 11.`, ecuacion: ['a = ', res(a)] },
    };
  }
  // Ahora tú · tipos 3 y 4 (nivel examen; San Marcos 2023-II y 2027-I): una cifra oculta con el 7 o con el 13.
  function casoOculta(r, d) {
    const P = d === 7 ? P7 : P13, p = r.ent(1, 9), u = r.ent(0, 9), pat = `${p}a${u}`;
    const ok = cifrasQue(pat, N => N % d === 0), suma = cifrasQue(pat, N => sumaCifras(N) % d === 0);
    const orden = cifrasQue(pat, (N, a) => mod(p * P[0] + a * P[1] + u * P[2], d) === 0), sinSigno = cifrasQue(pat, (N, a) => (u * Math.abs(P[0]) + a * Math.abs(P[1]) + p * Math.abs(P[2])) % d === 0);
    const otro = cifrasQue(pat, N => mod(pesada(N, d === 7 ? P11 : P7), d) === 0);
    if (ok.length !== 1) return null;
    const a = ok[0], uno = x => (x.length === 1 && x[0] !== a ? x[0] : null);
    return {
      pregunta: ['El número ', ...num4(pat), ' es múltiplo de ', bas(d), '. ¿Cuánto vale la cifra a?'],
      datos: [D5.regla, d === 7 ? D5.siete : D5.trece, [{ raya: [pat] }, `: numeral de cifras ${p}, a y ${u}`]],
      opciones: opciones(a, [
        { id: 'suma', valor: uno(suma), error: 'AT-CRITERIO-SUMA-7', siFuera: `Con esa cifra, las cifras suman un múltiplo de ${d}. Pero cada lugar tiene su peso.` },
        { id: 'orden', valor: uno(orden), error: 'AT-PESO-ORDEN', siFuera: 'Los pesos se cuentan desde las unidades, no desde la izquierda.' },
        { id: 'otro', valor: uno(otro), error: d === 7 ? 'AT-CRITERIO-ALTERNA' : 'AT-PESO-OTRO', siFuera: d === 7 ? 'Alternar signos es del 11. Entre 7 los pesos son 1, 3 y 2.' : 'Esos son los pesos del 7. Entre 13 son 1, −3 y −4.' },
        { id: 'sin', valor: d === 13 ? uno(sinSigno) : null, error: 'AT-PESO-SIN-SIGNO', siFuera: 'Los pesos de la decena y la centena son negativos: −3 y −4.' },
        { id: 'uno', valor: (a + 5) % 10, error: 'AT-CONTEO', siFuera: `Haz la cuenta con esa cifra: no da un múltiplo de ${d}.` },
      ]),
      solucion: { texto: `${u} × ${menosT(P[0])} + a × ${menosT(P[1])} + ${p} × ${menosT(P[2])} tiene que ser múltiplo de ${d}.`, ecuacion: ['a = ', res(a), `: ${pat.replace('a', a)} = `, bas(d), ` × ${+pat.replace('a', a) / d}`] },
    };
  }

  // Ejemplos resueltos de la idea 5. Cuentas rehechas aparte (cuentas-ideas.js): 2 574 → 4 − 7 + 5 − 2 = 0; 936 → 6 − 3 + 9
  // = 12 → 1; 191 → 1 − 9 + 1 = −7 → 4; 46 → 6 + 12 = 18 → 4; 100 = 7 × 14 + 2; 523 → 3 + 6 + 10 = 19 → 5; 3a52 con 11:
  // a = 6; 345 entre 13 → 5 − 12 − 12 = −19 → 7; 6 125 → 5 + 6 + 2 − 6 = 7 → 0; a − b + b − a = 0; 2a5 con 7: a = 4
  // (trampas 7, 0, 3 y 5); 5a2a con 11: 2a − 7 = 11 → a = 9 (trampas 7, 3, 2 y 4); 3a1 con 13: a = 5 (trampas 9, 2, 4 y
  // 0); 1a7b con 5 y 11, b ≠ 0: b = 5, a = 3 (trampas 8, 9, 5 y 6); abab = 101 × ab (1 212 no es múltiplo de 7, 11, 13 ni 9).
  const EJEMPLOS_PESOS = [
    { nivel: 1, titulo: 'La suma alternada',
      enunciado: '¿Es 2 574 múltiplo de 11?',
      datos: [D5.regla, D5.once],
      figura: boleto({ cifras: '2574', pesos: pesosT(4, P11) }),
      solucion: [{ texto: 'Desde las unidades, sumo y resto alternando. Da 0: lo que sobra y lo que falta se compensan.', ecuacion: ['4 − 7 + 5 − 2 = ', sob(0)] }],
      respuesta: ['Sí: deja resto ', sob(0)] },
    { nivel: 1, titulo: 'Un resto entre 11',
      enunciado: '¿Qué resto deja 936 al dividirlo entre 11?',
      datos: [D5.regla, D5.once],
      solucion: [{ texto: 'Sumo y resto alternando desde las unidades. 12 pasa de 11: se reduce.', ecuacion: ['6 − 3 + 9 = 12 = ', bas(11), ' + ', sob(1)] }],
      respuesta: ['Deja resto ', sob(1)] },
    { nivel: 1, titulo: 'Cuando sale negativo',
      enunciado: '¿Qué resto deja 191 al dividirlo entre 11?',
      datos: [D5.regla, D5.once, D5.negativo],
      solucion: [{ texto: 'La cuenta da −7: a 191 le faltan 7 para ser múltiplo de 11. Entonces le sobran 11 − 7.', ecuacion: ['1 − 9 + 1 = −7 ; −7 + 11 = ', sob(4)] }],
      respuesta: ['Deja resto ', sob(4)] },
    { nivel: 1, titulo: 'Los pesos del 7',
      enunciado: '¿Qué resto deja 46 al dividirlo entre 7, usando los pesos?',
      datos: [D5.regla, D5.siete],
      solucion: [{ texto: 'La unidad pesa 1 y la decena pesa 3.', ecuacion: ['6 × 1 + 4 × 3 = 18 = ', bas(7), ' × 2 + ', sob(4)] }],
      respuesta: ['Deja resto ', sob(4)] },
    { nivel: 1, titulo: 'De dónde sale un peso',
      enunciado: 'Entre 7, ¿por qué la centena pesa 2?',
      datos: ['El peso de un lugar es el resto de su potencia de 10'],
      solucion: [{ texto: 'Una caja de 100, reempacada de 7 en 7, llena 14 bolsitas y deja 2 sueltos.', ecuacion: ['100 = ', bas(7), ' × 14 + ', sob(2)] }],
      respuesta: ['Porque 100 deja resto ', sob(2), ' entre 7'] },
    { nivel: 2, titulo: 'Entre 7 con tres cifras',
      enunciado: '¿Qué resto deja 523 al dividirlo entre 7?',
      datos: [D5.regla, D5.siete],
      figura: boleto({ cifras: '523', pesos: ['2', '3', '1'] }),
      solucion: [
        { texto: 'Cada cifra por el peso de su lugar.', ecuacion: ['3 × 1 + 2 × 3 + 5 × 2 = 19'] },
        { texto: '19 pasa de 7: se reduce.', ecuacion: ['19 = ', bas(7), ' × 2 + ', sob(5)] },
      ],
      respuesta: ['Deja resto ', sob(5)] },
    { nivel: 2, titulo: 'La cifra del boleto',
      enunciado: ['La lluvia borró una cifra del boleto ', ...num4('3☐52'), ', que es múltiplo de 11. ¿Qué cifra era?'],
      datos: [D5.regla, D5.once],
      figura: boleto({ cifras: '3?52', pesos: pesosT(4, P11), letrero: GANA11 }),
      solucion: [
        { texto: 'Llamo a a la cifra borrada y hago la cuenta desde las unidades.', ecuacion: ['2 − 5 + a − 3 = a − 6'] },
        { texto: 'Para que dé 0, a = 6. Con 11 o con −11, a no sería una cifra.', ecuacion: ['a = ', res(6)] },
      ],
      respuesta: ['Era el ', res(6)] },
    { nivel: 2, titulo: 'Entre 13',
      enunciado: '¿Qué resto deja 345 al dividirlo entre 13?',
      datos: [D5.regla, D5.trece, D5.negativo],
      solucion: [
        { texto: 'La unidad pesa 1; la decena, −3; la centena, −4.', ecuacion: ['5 × 1 − 4 × 3 − 3 × 4 = −19'] },
        { texto: 'Sale negativo: le sumo 13 dos veces.', ecuacion: ['−19 + 26 = ', sob(7)] },
      ],
      respuesta: ['Deja resto ', sob(7)] },
    { nivel: 2, titulo: 'Un peso negativo del 7',
      enunciado: '¿Es 6 125 múltiplo de 7?',
      datos: [D5.regla, D5.siete],
      solucion: [
        { texto: 'Los pesos desde las unidades son 1, 3, 2 y −1.', ecuacion: ['5 × 1 + 2 × 3 + 1 × 2 − 6 × 1 = 7'] },
        { texto: '7 es múltiplo de 7: no sobra nada.', ecuacion: ['7 = ', bas(7), ' + ', sob(0)] },
      ],
      respuesta: ['Sí: deja resto ', sob(0)] },
    { nivel: 2, titulo: 'Un capicúa de cuatro cifras',
      enunciado: ['¿Qué resto deja entre 11 cualquier número de la forma ', ...num4('abba'), '?'],
      datos: [D5.regla, D5.once, [{ raya: ['abba'] }, ': numeral de cifras a, b, b y a']],
      solucion: [
        { texto: 'Hago la cuenta con letras, desde las unidades.', ecuacion: ['a − b + b − a = ', sob(0)] },
        { texto: 'Siempre da 0. Por ejemplo, 4 774 = 11 × 434.' },
      ],
      respuesta: ['Deja resto ', sob(0), ': siempre es múltiplo de 11'] },
    { nivel: 3, titulo: 'Una cifra con el 7',
      enunciado: ['El número ', ...num4('2a5'), ' es múltiplo de 7. ¿Cuánto vale a?'],
      alternativas: ['4', '7', '0', '3', '5'],
      datos: [D5.regla, D5.siete, [{ raya: ['2a5'] }, ': numeral de cifras 2, a y 5']],
      solucion: [
        { texto: 'Cada cifra por su peso, desde las unidades.', ecuacion: ['5 × 1 + a × 3 + 2 × 2 = 9 + 3 × a'] },
        { texto: 'Con a = 4 da 21, múltiplo de 7. La otra, a = 11, no es una cifra.', ecuacion: ['9 + 3 × ', res(4), ' = 21 = ', bas(7), ' × 3'] },
        { texto: ['Las trampas: ', letra('B'), ' suma las cifras; ', letra('C'), ' alterna signos; ', letra('D'), ' lee los pesos al revés; ', letra('E'), ' usa pesos 1, 2, 3.'] },
      ],
      respuesta: [letra('A'), ': a = ', res(4)] },
    { nivel: 3, titulo: 'La misma cifra dos veces',
      enunciado: ['El boleto ', ...num4('5a2a'), ' es múltiplo de 11. ¿Cuánto vale a?'],
      alternativas: ['7', '3', '9', '2', '4'],
      datos: [D5.regla, D5.once, [{ raya: ['5a2a'] }, ': numeral de cifras 5, a, 2 y a']],
      solucion: [
        { texto: 'Desde las unidades: a − 2 + a − 5.', ecuacion: ['2 × a − 7'] },
        { texto: 'No puede dar 0, porque 7 es impar. Da 11 con a = 9.', ecuacion: ['2 × ', res(9), ' − 7 = 11'] },
        { texto: ['Las trampas: ', letra('D'), ' suma las cifras; ', letra('B'), ' y ', letra('E'), ' buscan que dé 0 y redondean; ', letra('A'), ' toma el 7 de la cuenta.'] },
      ],
      respuesta: [letra('C'), ': a = ', res(9)] },
    { nivel: 3, titulo: 'Con el 13',
      enunciado: ['El número ', ...num4('3a1'), ' es múltiplo de 13. ¿Cuánto vale a?'],
      alternativas: ['9', '2', '4', '5', '0'],
      datos: [D5.regla, D5.trece, [{ raya: ['3a1'] }, ': numeral de cifras 3, a y 1']],
      solucion: [
        { texto: 'Cada cifra por su peso, desde las unidades.', ecuacion: ['1 × 1 − a × 3 − 3 × 4 = −11 − 3 × a'] },
        { texto: 'Con a = 5 da −26, múltiplo de 13.', ecuacion: ['−11 − 3 × ', res(5), ' = −26'] },
        { texto: ['Las trampas: ', letra('A'), ' suma las cifras; ', letra('B'), ' usa los pesos del 7; ', letra('C'), ' alterna signos; ', letra('E'), ' quita los signos.'] },
      ],
      respuesta: [letra('D'), ': a = ', res(5)] },
    { nivel: 3, titulo: 'Dos cifras, dos criterios',
      enunciado: ['El número ', ...num4('1a7b'), ' es múltiplo de 5 y de 11, y b no es 0. ¿Cuánto vale a?'],
      alternativas: ['8', '3', '9', '5', '6'],
      datos: [D3.cinco, D5.regla, D5.once, [{ raya: ['1a7b'] }, ': numeral de cifras 1, a, 7 y b']],
      solucion: [
        { texto: 'Por el 5, la última cifra es 0 o 5. No es 0: b = 5.' },
        { texto: 'Entre 11, desde las unidades: 5 − 7 + a − 1 = a − 3. Da 0 con a = 3.', ecuacion: ['a = ', res(3)] },
        { texto: ['Las trampas: ', letra('A'), ' toma b = 0; ', letra('C'), ' suma las cifras; ', letra('D'), ' es b; ', letra('E'), ' duplica el 3.'] },
      ],
      respuesta: [letra('B'), ': a = ', res(3)] },
    { nivel: 3, titulo: 'Un divisor que nunca falla',
      enunciado: ['¿Cuál de estos números divide siempre a un número de la forma ', ...num4('abab'), ', sean cuales sean sus cifras?'],
      alternativas: ['7', '11', '13', '9', '101'],
      datos: [[{ raya: ['abab'] }, ' = a × 1 000 + b × 100 + a × 10 + b, con a y b cifras']],
      solucion: [
        { texto: 'Junto las a y las b.', ecuacion: ['1 010 × a + 101 × b = ', bas(101), ' × (10 × a + b)'] },
        { texto: 'Siempre es 101 por un entero. Por ejemplo, 1 212 = 101 × 12.' },
        { texto: ['Con 1 212 fallan las demás: ', letra('A'), ', ', letra('B'), ', ', letra('C'), ' y ', letra('D'), ' no lo dividen.'] },
      ],
      respuesta: [letra('E'), ': el ', bas(101)] },
  ];

  const CTRL_X = [{ id: 'x', etiqueta: 'Cifra borrada', min: 0, max: 9, paso: 1, inicio: 0, decimales: 0 }];
  const boletoJ = v => ({ cifras: '4?73', hallada: { 1: String(v.x) }, pesos: pesosT(4, P11), letrero: GANA11 });
  const criteriosPesos = {
    id: 'criterios-pesos',
    titulo: 'Criterios del 11, 7 y 13',
    pregunta: '¿Cómo se sabe si un número es múltiplo de 11 o de 7?',
    temas: ['Criterios de divisibilidad'],
    pieza: BL,
    aprendizaje: 'Cada lugar pesa lo que deja su potencia de 10: entre 11, más 1 y menos 1 alternados; entre 7, pesan 1, 3 y 2.',
    actividad: 'Probar cifras en un boleto borroso hasta que gane el premio.',
    lee: {
      tarjetas: [
        { titulo: 'Al 10 le falta 1', texto: ['Una bolsita de 10 caramelos no llena ninguna de ', bas(11), ': le falta 1. Una caja de 100 llena 9 bolsitas de 11 y le sobra 1. Entre 11, los lugares se van turnando: sobra 1, falta 1.'],
          ecuacion: ['10 = ', MU(11), ' − ', res(1), ' ; 100 = ', MU(11), ' + ', sob(1)],
          pieza: BL, dibujo: { datos: { cifras: '583', pesos: pesosT(3, P11) }, estado: {} } },
        { titulo: 'El peso de cada lugar', texto: 'Lo que deja un lugar es su peso, y va debajo de la cifra. El peso de cada lugar puede ser negativo: −1 dice que ahí falta 1. La suma alternada es sumar y restar las cifras, una sí y una no, desde las unidades.',
          ecuacion: ['583: 3 − 8 + 5 = ', sob(0)] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a probar cifras en la casilla borrada de un boleto. Mira la cuenta de abajo: lo que sobra en unos lugares tiene que compensar lo que falta en los otros.' },
      ],
    },
    ejemplos: EJEMPLOS_PESOS,
    juega: {
      pieza: BL,
      consigna: 'La lluvia borró una cifra de este boleto de la rifa. Gana si su número es múltiplo de 11.',
      mision: {
        // Una sola respuesta: 3 − 7 + x − 4 = x − 8 solo es múltiplo de 11 con x = 8 (4 873 = 11 × 443).
        texto: 'Elige la cifra borrada que hace ganar al boleto.',
        logrado: v => v.x === 8,
        bien: 'Con el 8, lo que sobra y lo que falta se compensan: 4 873 = 11 × 443.',
      },
      voz: 'Prueba cifras hasta que no sobre ni falte.',
      leyenda: [
        { s: sob('+1'), t: 'en ese lugar sobra 1 por cifra' },
        { s: sob('−1'), t: 'en ese lugar falta 1 por cifra' },
        { s: res('cifra'), t: 'la que tú pruebas' },
      ],
      controles: CTRL_X,
      dibujo: v => ({ datos: boletoJ(v), estado: {} }),
      lectura: v => { const S = v.x - 8; return ['3 − 7 + ', res(v.x), ` − 4 = ${menosT(S)}`, ...(S === 0 ? [': es múltiplo de 11'] : S < 0 ? [': faltan ', res(-S)] : [': sobra ', sob(S)])]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Qué resto deja 415 al dividirlo entre ', bas(7), '?'],
      datos: ['10 = 7 + 3', '100 = 7 × 14 + 2'],
      voz: 'Piensa cuánto pesa cada lugar entre 7.',
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'suma', texto: '3', error: 'AT-CRITERIO-SUMA-7', siFuera: 'Sumar las cifras sirve entre 9, donde cada lugar deja 1. Entre 7, la decena deja 3.' },
        { id: 'alterna', texto: '1', error: 'AT-CRITERIO-ALTERNA', siFuera: 'Alternar signos es del 11, donde a 10 le falta 1. Entre 7, a 10 le sobran 3.' },
        { id: 'sin', texto: '16', error: 'AT-PESO-SIN-REDUCIR', siFuera: 'Los pesos están bien: 8 + 3 + 5 = 16. Falta reducir: un resto entre 7 es menor que 7.' },
      ],
      dibujo: boleto({ cifras: '415', letrero: [['¿Qué resto deja entre '], ['7', 'i', 700], ['?']] }),
      revelar: boleto({ cifras: '415', letrero: [['¿Qué resto deja entre '], ['7', 'i', 700], ['?']], pesos: ['2', '3', '1'], pie: [['4 × 2 + 1 × 3 + 5 × 1 = 16 = 7 × 2 + '], ['2', 'o', 700]] }),
      coincide: 'Coincide: 4 × 2 + 1 × 3 + 5 × 1 = 16, y 16 deja 2.',
      noCoincide: 'Revisemos: entre 7, la decena pesa 3 y la centena pesa 2.',
    },
    mira: {
      pieza: BL,
      datos: { cifras: '415', letrero: [['¿Qué resto deja entre '], ['7', 'i', 700], ['?']], pasos: [{}, { pesos: ['2', '3', '1'] }, { pesos: ['2', '3', '1'], pie: '4 × 2 + 1 × 3 + 5 × 1 = 16' }, { pesos: ['2', '3', '1'], pie: [['16 = 7 × 2 + '], ['2', 'o', 700]] }] },
      voz: 'Cada cifra, por el peso de su lugar.',
      pasos: [
        { estado: { paso: 0 }, texto: 'El 415 tiene 4 centenas, 1 decena y 5 unidades.' },
        { estado: { paso: 1 }, texto: 'Entre 7, la unidad pesa 1; la decena, 3; la centena, 2.', ecuacion: ['10 = ', bas(7), ' + ', sob(3), ' ; 100 = ', bas(7), ' × 14 + ', sob(2)] },
        { estado: { paso: 2 }, texto: 'Cada cifra se multiplica por el peso de su lugar.', ecuacion: ['4 × ', sob(2), ' + 1 × ', sob(3), ' + 5 × ', sob(1), ' = 16'] },
        { estado: { paso: 3 }, texto: 'Se reduce: 16 deja 2 entre 7.', ecuacion: ['415 = ', MU(7), ' + ', sob(2)] },
      ],
    },
    regla: {
      texto: 'Cada lugar pesa lo que deja su potencia de 10. Las cifras se multiplican por su peso, se suman y se reduce.',
      ecuacion: ['entre ', bas(11), ': ', { llave: [sob('+1, −1, +1, −1…')], nota: 'desde las unidades', color: 'c-o' }, SEP, 'entre ', bas(7), ': ', sob('1, 3, 2, −1, −3, −2'), SEP, 'entre ', bas(13), ': ', sob('1, −3, −4, −1, 3, 4')],
      condicion: 'los pesos se leen desde las unidades. Un peso negativo es lo que le falta a ese lugar.',
      voz: 'Cada cifra, por el peso de su lugar.',
    },
    // Así se resuelve: el resto entre 11 de un número de cinco cifras, con la comprobación. «Ahora tú» pide restos entre
    // 11 (de cuatro cifras) y entre 7, la cifra borrada de un boleto y cifras ocultas con el 7 y el 13.
    resuelve: {
      pieza: BL,
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const N = r.ent(10000, 99999), cs = cifrasDe(N).reverse(), alt = pesada(N, P11), v = mod(alt, 11);
          if (alt === 0 || Math.abs(alt) > 21) continue;
          const cuenta = cs.map((c, i) => (i ? (i % 2 ? ` − ${c}` : ` + ${c}`) : String(c))).join('');
          return {
            enunciado: `¿Qué resto deja ${f(N, 0)} al dividirlo entre 11?`,
            datos: [D5.regla, D5.once, D5.negativo],
            dibujo: boleto({ cifras: String(N), pesos: pesosT(5, P11) }),
            pasos: [
              { tipo: 'pide', texto: ['Piden el resto de ', f(N, 0), ' entre ', bas(11), ', usando solo sus cifras.'] },
              { tipo: 'regla', texto: 'Entre 11, los lugares pesan +1 y −1 alternados desde las unidades: sumo y resto las cifras, una sí y una no.' },
              { tipo: 'cuentas', texto: 'Empiezo por las unidades, que se suman.', ecuacion: [`${cuenta} = ${menosT(alt)}`] },
              { tipo: 'cuentas', texto: alt < 0 ? `Sale negativo: le faltan ${-alt}. Le sumo 11${alt < -11 ? ' dos veces' : ''}.` : alt >= 11 ? `${alt} pasa de 11: lo reduzco.` : `${alt} es menor que 11: ya es el resto.`,
                ecuacion: [alt < 0 ? `${menosT(alt)} + ${alt < -11 ? 22 : 11} = ` : alt >= 11 ? `${alt} − 11 = ` : `${alt} = `, sob(v)] },
              { tipo: 'sentido', texto: 'Compruebo con la división completa: da el mismo resto.', ecuacion: [`${f(N, 0)} = `, bas(11), ` × ${f(Math.floor(N / 11), 0)} + `, sob(v)] },
            ],
            respuesta: ['Deja resto ', sob(v)],
          };
        }
      },
    },
    ahoraTu: {
      pieza: BL,
      voz: 'Cada cifra, por el peso de su lugar.',
      generar(sem) {
        const r = azar(sem + 137), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoOnce, r);
        if (tipo === 1) return conCuatro(casoSiete, r);
        if (tipo === 2) return conCuatro(casoBorrada, r);
        if (tipo === 3) return conCuatro(q => casoOculta(q, 7), r);
        return conCuatro(q => casoOculta(q, 13), r);
      },
    },
  };

  // ---------- Idea 6 (rehecha, 19 nov): pagar justo con dos monedas (ecuaciones diofánticas lineales) ----------
  // Propuesta §1 a §7. Conserva el id `diofanticas` y los controles `a` y `b`. Objeto: las monedas de S/ 2 y de S/ 5 con
  // que un cliente paga su cuenta en el puesto (pieza arit-monedas, de prueba). Se enseña sin el MCD (es de MCD y MCM):
  // con restos y con «si las dos monedas son múltiplos de un número y la cuenta no, es imposible».
  // Cambia: cuántas monedas de cada clase. · Permanece: la cuenta de S/ 23. · Progresa: lo que suman → lo que falta o
  // sobra → justo. · Se reserva: cuántas maneras hay de pagar: es de la predicción. · Debe verse: no toda cantidad de
  // monedas de S/ 5 sirve: lo que falta tiene que ser múltiplo de 2.
  // Errores (hipótesis de aula): AT-DIOF-TODAS cuenta toda cantidad de una moneda sin ver si la otra cuadra · AT-DIOF-CERO
  // deja fuera (o mete) las maneras con cero de una clase · AT-DIOF-DIVIDE divide la cuenta entre una moneda · AT-DIOF-
  // MAXIMO da la manera con más monedas · AT-DIOF-PRIMERA se queda con la primera que encuentra · AT-DIOF-UNA mira una
  // sola moneda · AT-RESPONDE-OTRA responde la otra cantidad.
  const MO = 'arit-monedas';
  const monedas = datos => ({ pieza: MO, datos, estado: {} });
  // Todas las maneras de pagar c con monedas de a y de b (x de a, y de b), sin negativos.
  const pagos = (a, b, c) => { const out = []; for (let y = 0; b * y <= c; y++) if ((c - b * y) % a === 0) out.push([(c - b * y) / a, y]); return out; };
  const D6 = {
    ec: (a, b, c) => [bas(a), ' × ', res('x'), ' + ', bas(b), ' × ', res('y'), ` = ${c}, con `, res('x'), ' e ', res('y'), ' enteros que no son negativos'],
    xy: (qa, qb) => [res('x'), `: ${qa}; `, res('y'), `: ${qb}`],
  };
  // La tabla de «Mira»: con cada cantidad de monedas de S/ 5, lo que falta y si se completa con monedas de S/ 2.
  const tablaPago = (c, pasos) => {
    const filasT = [];
    for (let y = 0; 5 * y <= c; y++) {
      const falta = c - 5 * y, ok = falta % 2 === 0, p = pasos ? y + 1 : 0;
      filasT.push([{ t: String(y), color: 'f', paso: p }, { t: `S/ ${falta}`, paso: p }, Object.assign({ t: ok ? String(falta / 2) : 'no se puede', resalta: ok, tenue: !ok, paso: p }, ok ? { color: 'f' } : {})]);
    }
    return { columnas: [{ t: 'de S/ 5', color: 'f' }, { t: 'falta' }, { t: 'de S/ 2', color: 'f' }], filas: filasT, filasMax: 9, cabeza: true, alt: `Maneras de pagar ${c} soles: con cada cantidad de monedas de 5 soles, lo que falta y cuántas monedas de 2 soles lo completan` };
  };
  const CTRL_Y = [
    { id: 'a', etiqueta: 'Monedas de S/ 2', min: 0, max: 12, paso: 1, inicio: 5, decimales: 0 },
    { id: 'b', etiqueta: 'Monedas de S/ 5', min: 0, max: 5, paso: 1, inicio: 3, decimales: 0 },
  ];
  const soles = x => `S/ ${x}`;

  // Ahora tú · tipo 0: cuántas maneras de pagar.
  const yLista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : String(xs[0]));
  function casoManeras(r) {
    const [a, b, clase] = r.de([[2, 5, 'monedas'], [2, 5, 'monedas'], [10, 20, 'billetes'], [20, 50, 'billetes']]);
    const c = clase === 'monedas' ? r.ent(21, 60) : 10 * r.ent(7, 20), ps = pagos(a, b, c), n = ps.length, ambas = ps.filter(p => p[0] && p[1]).length;
    if (n < 2 || n > 9) return null;
    return {
      pregunta: `¿De cuántas maneras se pueden pagar ${soles(c)} justos con ${clase} de ${soles(a)} y de ${soles(b)}? También vale usar una sola clase.`,
      datos: [D6.ec(a, b, c), D6.xy(`${clase} de ${soles(a)}`, `${clase} de ${soles(b)}`)],
      opciones: opciones(n, [
        { id: 'todas', valor: Math.floor(c / b) + 1, error: 'AT-DIOF-TODAS', siFuera: `Probar cada cantidad de ${soles(b)} está bien. Pero solo sirve si lo que falta es múltiplo de ${a}.` },
        { id: 'cero', valor: ambas, error: 'AT-DIOF-CERO', siFuera: 'Esas son las maneras que usan las dos clases. También vale pagar con una sola.' },
        { id: 'divide', valor: Math.floor(c / b), error: 'AT-DIOF-DIVIDE', siFuera: `Eso es cuántas de ${soles(b)} caben en la cuenta. Se pide cuántas maneras hay.` },
        { id: 'mas', valor: n + 1, error: 'AT-CONTEO', siFuera: 'Lista las maneras una por una: hay una menos.' },
      ]),
      // Con más de cuatro, solo los extremos: el tope de «solucion» es de 20 palabras.
      solucion: { texto: `De ${soles(b)} sirven ${n > 4 ? `${ps[0][1]}, ${ps[1][1]}, … y ${ps[n - 1][1]}` : yLista(ps.map(p => p[1]))}: con ellas lo que falta es múltiplo de ${a}.`, ecuacion: ['son ', res(n), ' maneras'] },
    };
  }
  // Ahora tú · tipo 1: la manera con menos monedas.
  function casoMenos(r) {
    const c = r.ent(21, 59), ps = pagos(2, 5, c), ns = ps.map(p => p[0] + p[1]);
    if (ps.length < 3) return null;
    const min = Math.min(...ns), max = Math.max(...ns), orden = ns.slice().sort((x, y) => x - y);
    return {
      pregunta: `Un cliente paga ${soles(c)} justos con monedas de S/ 2 y de S/ 5. ¿Cuál es la menor cantidad de monedas que puede usar?`,
      datos: [D6.ec(2, 5, c), D6.xy('monedas de S/ 2', 'monedas de S/ 5')],
      opciones: opciones(min, [
        { id: 'maximo', valor: max, error: 'AT-DIOF-MAXIMO', siFuera: 'Esa es la manera con más monedas. Con más monedas de S/ 5 se usan menos.' },
        { id: 'primera', valor: orden[1], error: 'AT-DIOF-PRIMERA', siFuera: 'Esa manera paga justo, pero hay otra con más monedas de S/ 5 y menos monedas en total.' },
        { id: 'divide', valor: Math.floor(c / 5), error: 'AT-DIOF-DIVIDE', siFuera: `Con ${Math.floor(c / 5)} monedas de S/ 5 se pagan ${soles(5 * Math.floor(c / 5))}; falta completar con monedas de S/ 2.` },
        { id: 'pasa', valor: Math.ceil(c / 5), error: 'AT-DIOF-UNA', siFuera: `Con ${Math.ceil(c / 5)} monedas de S/ 5 se pasa de la cuenta, y no hay vuelto.` },
      ]),
      solucion: { texto: `Con ${ps[ps.length - 1][1]} de S/ 5 y ${ps[ps.length - 1][0]} de S/ 2, lo más que se puede de S/ 5.`, ecuacion: [`${ps[ps.length - 1][0]} + ${ps[ps.length - 1][1]} = `, res(min)] },
    };
  }
  // Ahora tú · tipo 2: la cuenta que no se puede pagar con dos billetes.
  function casoImposible(r) {
    const [a, b] = r.de([[10, 20], [20, 50], [10, 50]]), g = a === 20 ? 10 : 10;
    const malas = [], buenas = [];
    for (let c = a; c <= 200; c += 5) (pagos(a, b, c).length ? buenas : malas).push(c);
    const mala = r.de(malas.filter(c => c > a)), bs = [r.de(buenas.filter(c => c % b === 0 && c > b)), r.de(buenas.filter(c => c % b !== 0)), r.de(buenas.filter(c => c > b && c % a === 0))];
    if (new Set(bs).size < 3) return null;
    return {
      pregunta: `¿Cuál de estas cuentas no se puede pagar justo con billetes de ${soles(a)} y de ${soles(b)}?`,
      datos: [D6.ec(a, b, 'la cuenta'), D6.xy(`billetes de ${soles(a)}`, `billetes de ${soles(b)}`)],
      opciones: opciones(mala, bs.map((c, i) => {
        const p = pagos(a, b, c)[0];
        return { id: `si${i}`, valor: c, error: 'AT-DIOF-UNA', siFuera: `${soles(c)} sí se puede: ${p[0]} de ${soles(a)} y ${p[1]} de ${soles(b)}.` };
      }), soles),
      solucion: { texto: mala % g ? `Todo lo que se arma es múltiplo de ${g}, y ${mala} no lo es.` : `Ninguna cantidad de billetes de ${soles(b)} deja un múltiplo de ${a} por pagar.`, ecuacion: [res(soles(mala)), ' no se puede'] },
    };
  }
  // Ahora tú · tipo 3 (nivel examen; San Marcos 2023-II, razonamiento matemático): dos artículos con un gasto fijo.
  function casoArticulos(r) {
    // Precios que «Así se resuelve» no usa (sus pares son 3 y 4, 3 y 5, 4 y 5, 3 y 7).
    const [p, q] = r.de([[4, 7], [4, 9], [5, 7], [3, 8], [5, 8], [2, 7]]), c = r.ent(40, 99), ps = pagos(p, q, c).filter(s => s[0] && s[1]);
    if (ps.length < 2) return null;
    const ult = ps[ps.length - 1], pri = ps[0];
    return {
      pregunta: `Rosa gasta justo ${soles(c)} en bolsas de ${soles(p)} y cajas de ${soles(q)}, y lleva al menos una de cada una. Si compra la mayor cantidad posible de cajas, ¿cuántas bolsas lleva?`,
      datos: [D6.ec(p, q, c), D6.xy('las bolsas', 'las cajas')],
      opciones: opciones(ult[0], [
        { id: 'primera', valor: pri[0], error: 'AT-DIOF-PRIMERA', siFuera: `Esa compra gasta justo, pero con ${pri[1]} ${pri[1] === 1 ? 'caja' : 'cajas'}. Se piden las más cajas posibles.` },
        { id: 'otra', valor: ult[1], error: 'AT-RESPONDE-OTRA', siFuera: `${ult[1]} son las cajas. Se piden las bolsas.` },
        { id: 'divide', valor: Math.floor(c / q), error: 'AT-DIOF-DIVIDE', siFuera: `${Math.floor(c / q)} cajas es lo más que cabe en ${soles(c)}, pero lo que sobra no se completa con bolsas.` },
        { id: 'suma', valor: ult[0] + ult[1], error: 'AT-RESPONDE-OTRA', siFuera: 'Esas son las bolsas y las cajas juntas. Se piden solo las bolsas.' },
      ]),
      solucion: { texto: `Con ${ult[1]} cajas quedan ${soles(c - q * ult[1])}, que es múltiplo de ${p}; con más cajas, no.`, ecuacion: [`${c - q * ult[1]} ÷ ${p} = `, res(ult[0])] },
    };
  }

  // Ejemplos resueltos de la idea 6. Cuentas rehechas aparte (cuentas-ideas.js): 2 × 6 + 5 × 3 = 27; 19 − 15 = 4 → 2
  // monedas; 18 − 5 = 13, impar; 11 = 2 × 3 + 5; 35 no es múltiplo de 10; S/ 20: (10, 0), (5, 2) y (0, 4); S/ 31: (13, 1),
  // (8, 3) y (3, 5) → 8 monedas; 3x + 7y = 34 con las dos: (9, 1) y (2, 4); 2x + 5y = 33: (14, 1), (9, 3), (4, 5); 3x +
  // 7y = 40: y = 1 o 4; 3x + 5y = 60 con las dos: (15, 3), (10, 6), (5, 9) → 3 (trampas 5, 11, 12 y 20); 4x + 9y = 47:
  // solo (5, 3) (trampas 3, 11, 2 y 8); S/ 30 no se arma con billetes de 20 y 50; S/ 43: (4, 7) → 11 monedas (trampas 20,
  // 14, 8 y 9); 3x + 5y = 49: (13, 2), (8, 5), (3, 8) → con más de S/ 5, 11 boletos (trampas 13, 15, 8 y 3).
  const EJEMPLOS_PAGOS = [
    { nivel: 1, titulo: 'Lo que suman las monedas',
      enunciado: 'Un cliente pone sobre el mostrador 6 monedas de S/ 2 y 3 de S/ 5. ¿Cuánto paga?',
      datos: ['Valor de una fila = lo que vale la moneda × cuántas hay'],
      figura: monedas({ filas: [{ valor: 2, cuantas: 6 }, { valor: 5, cuantas: 3 }], total: false }),
      solucion: [{ texto: 'Cada fila vale su moneda por cuántas hay.', ecuacion: [bas(2), ' × 6 + ', bas(5), ' × 3 = 12 + 15 = ', res(27)] }],
      respuesta: ['Paga ', res('S/ 27')] },
    { nivel: 1, titulo: 'Completar con las de S/ 2',
      enunciado: 'La cuenta es de S/ 19. Un cliente ya puso 3 monedas de S/ 5. ¿Cuántas monedas de S/ 2 le faltan para pagar justo?',
      datos: [D6.ec(2, 5, 19), D6.xy('monedas de S/ 2', 'monedas de S/ 5')],
      figura: monedas({ cuenta: 19, filas: [{ valor: 2, cuantas: '?' }, { valor: 5, cuantas: 3 }] }),
      solucion: [{ texto: 'Con las de S/ 5 ya pagó 15. Faltan 4, que son 2 monedas de S/ 2.', ecuacion: ['19 − 15 = 4 = ', bas(2), ' × ', res(2)] }],
      respuesta: ['Le faltan ', res(2), ' monedas'] },
    { nivel: 1, titulo: 'No siempre se puede completar',
      enunciado: 'La cuenta es de S/ 18. Con una sola moneda de S/ 5, ¿se puede completar el pago con monedas de S/ 2?',
      datos: [D6.ec(2, 5, 18), D6.xy('monedas de S/ 2', 'monedas de S/ 5')],
      solucion: [{ texto: 'Faltan 18 − 5 = 13, y 13 es impar: no es múltiplo de 2.', ecuacion: ['13 = ', bas(2), ' × 6 + ', sob(1)] }],
      respuesta: ['No: quedaría ', sob(1), ' sol sin pagar'] },
    { nivel: 1, titulo: 'Una manera de pagar',
      enunciado: 'Halla una manera de pagar S/ 11 justos con monedas de S/ 2 y de S/ 5.',
      datos: [D6.ec(2, 5, 11), D6.xy('monedas de S/ 2', 'monedas de S/ 5')],
      solucion: [{ texto: 'Con 1 de S/ 5 faltan 6, que son 3 de S/ 2. Con 0 o con 2 de S/ 5 faltaría un número impar.', ecuacion: [bas(2), ' × ', res(3), ' + ', bas(5), ' × ', res(1), ' = 11'] }],
      respuesta: [res(3), ' de S/ 2 y ', res(1), ' de S/ 5'] },
    { nivel: 1, titulo: 'Billetes de 10 y de 20',
      enunciado: '¿Se puede pagar S/ 35 justos solo con billetes de S/ 10 y de S/ 20?',
      datos: [D6.ec(10, 20, 35), DM.def],
      solucion: [{ texto: 'Los dos billetes son múltiplos de 10: todo lo que se arme con ellos también. 35 no lo es.', ecuacion: ['35 = ', bas(10), ' × 3 + ', sob(5)] }],
      respuesta: ['No: siempre sobran ', sob(5)] },
    { nivel: 2, titulo: 'Todas las maneras',
      enunciado: '¿De cuántas maneras se pueden pagar S/ 20 justos con monedas de S/ 2 y de S/ 5? También vale usar una sola clase.',
      datos: [D6.ec(2, 5, 20), D6.xy('monedas de S/ 2', 'monedas de S/ 5')],
      figura: monedas({ cuenta: 20, filas: [{ valor: 2, cuantas: '?' }, { valor: 5, cuantas: '?' }] }),
      solucion: [
        { texto: 'Pruebo las de S/ 5: con 0, 2 o 4 falta un número par (20, 10 o 0). Con 1 o 3 falta un impar.' },
        { texto: 'Las de S/ 2 salen de dividir lo que falta entre 2.', ecuacion: ['(10, 0), (5, 2), (0, 4)'] },
      ],
      respuesta: [res(3), ' maneras'] },
    { nivel: 2, titulo: 'La de menos monedas',
      enunciado: 'Un cliente paga S/ 31 justos con monedas de S/ 2 y de S/ 5. ¿Cuál es la menor cantidad de monedas?',
      datos: [D6.ec(2, 5, 31), D6.xy('monedas de S/ 2', 'monedas de S/ 5')],
      solucion: [
        { texto: 'Las de S/ 5 tienen que ser impares para que falte un par: 1, 3 o 5.', ecuacion: ['(13, 1), (8, 3), (3, 5)'] },
        { texto: 'Cuantas más de S/ 5, menos monedas en total.', ecuacion: ['3 + 5 = ', res(8)] },
      ],
      respuesta: [res(8), ' monedas'] },
    { nivel: 2, titulo: 'Bolsas y cajas',
      enunciado: 'Rosa gasta justo S/ 34 en bolsas de S/ 3 y cajas de S/ 7, y lleva al menos una de cada una. ¿De cuántas maneras puede comprar?',
      datos: [D6.ec(3, 7, 34), D6.xy('las bolsas', 'las cajas')],
      solucion: [
        { texto: 'Pruebo las cajas: con 1 quedan 27 y con 4 quedan 6, múltiplos de 3. Con 2 o 3 quedan 20 o 13: no.' },
        { texto: 'Salen dos compras.', ecuacion: ['(9, 1), (2, 4)'] },
      ],
      respuesta: [res(2), ' maneras'] },
    { nivel: 2, titulo: 'De salto en salto',
      enunciado: 'Una manera de pagar S/ 33 es con 14 monedas de S/ 2 y 1 de S/ 5. ¿Cuáles son las otras?',
      datos: [D6.ec(2, 5, 33), D6.xy('monedas de S/ 2', 'monedas de S/ 5')],
      solucion: [
        { texto: 'Cambio 5 monedas de S/ 2 por 2 de S/ 5: son los mismos S/ 10. Las de S/ 2 bajan de 5 en 5.', ecuacion: ['(14, 1) → (9, 3) → (4, 5)'] },
        { texto: 'Otro salto dejaría −1 monedas de S/ 2: no se puede.' },
      ],
      respuesta: [res('9 y 3'), ', o ', res('4 y 5')] },
    { nivel: 2, titulo: 'Con los restos',
      enunciado: 'En 3x + 7y = 40, con x e y enteros positivos, ¿qué valores puede tomar y?',
      datos: [D6.ec(3, 7, 40), D2.forma],
      solucion: [
        { texto: 'Miro los restos entre 3: el término 3x no deja nada; 7y deja lo mismo que y; 40 deja 1. Entonces y deja 1.' },
        { texto: 'Los que dejan 1 entre 3 y caben: 1 y 4. Con 7 ya se pasa.', ecuacion: ['(11, 1), (4, 4)'] },
      ],
      respuesta: ['y puede ser ', res(1), ' o ', res(4)] },
    { nivel: 3, titulo: 'Con las dos clases',
      enunciado: 'Rosa gasta justo S/ 60 en bolsas de S/ 3 y cajas de S/ 5, y lleva al menos una de cada una. ¿De cuántas maneras puede comprar?',
      alternativas: ['5', '3', '11', '12', '20'],
      datos: [D6.ec(3, 5, 60), D6.xy('las bolsas', 'las cajas')],
      solucion: [
        { texto: 'Lo que queda al pagar las cajas tiene que ser múltiplo de 3: las cajas van de 3 en 3.', ecuacion: ['(15, 3), (10, 6), (5, 9)'] },
        { texto: 'Con 0 o con 12 cajas faltaría una de las dos clases: no cuentan.' },
        { texto: ['Las trampas: ', letra('A'), ' cuenta esas dos; ', letra('C'), ', toda cantidad de cajas; ', letra('D'), ' y ', letra('E'), ' dividen 60 entre un precio.'] },
      ],
      respuesta: [letra('B'), ': ', res(3), ' maneras'] },
    { nivel: 3, titulo: 'Una sola compra posible',
      enunciado: 'Con S/ 47 justos se compran bolsas de S/ 4 y cajas de S/ 9, al menos una de cada una. ¿Cuántas bolsas se llevan?',
      alternativas: ['3', '11', '2', '8', '5'],
      datos: [D6.ec(4, 9, 47), D6.xy('las bolsas', 'las cajas')],
      solucion: [
        { texto: 'Pruebo las cajas: con 1, 2, 4 o 5 quedan 38, 29, 11 o 2, que no son múltiplos de 4.' },
        { texto: 'Con 3 cajas quedan 20: son 5 bolsas.', ecuacion: ['47 − 27 = 20 = ', bas(4), ' × ', res(5)] },
        { texto: ['Las trampas: ', letra('A'), ' son las cajas; ', letra('B'), ' divide 47 entre 4; ', letra('C'), ' es lo que queda con 5 cajas; ', letra('D'), ', bolsas y cajas juntas.'] },
      ],
      respuesta: [letra('E'), ': ', res(5), ' bolsas'] },
    { nivel: 3, titulo: 'Un pago imposible',
      enunciado: '¿Cuál de estas cuentas no se puede pagar justo con billetes de S/ 20 y de S/ 50?',
      alternativas: ['S/ 70', 'S/ 90', 'S/ 30', 'S/ 120', 'S/ 100'],
      datos: [D6.ec(20, 50, 'la cuenta'), D6.xy('billetes de S/ 20', 'billetes de S/ 50')],
      solucion: [
        { texto: 'Un billete de S/ 50 ya pasa de S/ 30, y con billetes de S/ 20 se arma 20 o 40: no hay manera.' },
        { texto: 'Que 30 sea múltiplo de 10 no basta: tiene que salir con cantidades que no sean negativas.' },
        { texto: [letra('A'), ' y ', letra('B'), ' llevan un billete de S/ 50; ', letra('D'), ' y ', letra('E'), ' se arman solo con billetes de S/ 20.'] },
      ],
      respuesta: [letra('C'), ': ', res('S/ 30')] },
    { nivel: 3, titulo: 'Lo menos posible',
      enunciado: 'Se pagan S/ 43 justos con monedas de S/ 2 y de S/ 5. ¿Cuál es la menor cantidad de monedas?',
      alternativas: ['20', '14', '8', '11', '9'],
      datos: [D6.ec(2, 5, 43), D6.xy('monedas de S/ 2', 'monedas de S/ 5')],
      solucion: [
        { texto: 'Las de S/ 5 tienen que ser impares: 1, 3, 5 o 7. Con 9 ya se pasa de S/ 43.', ecuacion: ['(19, 1), (14, 3), (9, 5), (4, 7)'] },
        { texto: 'La que usa más monedas de S/ 5 usa menos en total.', ecuacion: ['4 + 7 = ', res(11)] },
        { texto: ['Las trampas: ', letra('A'), ' y ', letra('B'), ' son otras maneras; ', letra('C'), ' deja S/ 3 sin pagar; ', letra('E'), ' se pasa de la cuenta.'] },
      ],
      respuesta: [letra('D'), ': ', res(11), ' monedas'] },
    { nivel: 3, titulo: 'Los boletos de la rifa',
      enunciado: 'En una rifa se vendieron boletos de S/ 3 y de S/ 5 por S/ 49 en total. Si se vendieron más boletos de S/ 5 que de S/ 3, ¿cuántos boletos se vendieron?',
      alternativas: ['11', '13', '15', '8', '3'],
      datos: [D6.ec(3, 5, 49), D6.xy('boletos de S/ 3', 'boletos de S/ 5')],
      solucion: [
        { texto: 'Lo que queda al quitar los de S/ 5 tiene que ser múltiplo de 3.', ecuacion: ['(13, 2), (8, 5), (3, 8)'] },
        { texto: 'Solo en la última hay más boletos de S/ 5.', ecuacion: ['3 + 8 = ', res(11)] },
        { texto: ['Las trampas: ', letra('B'), ' y ', letra('C'), ' son las otras dos ventas; ', letra('D'), ' y ', letra('E'), ' cuentan una sola clase.'] },
      ],
      respuesta: [letra('A'), ': ', res(11), ' boletos'] },
  ];

  const diofanticas = {
    id: 'diofanticas',
    titulo: 'Pagar justo con dos monedas',
    pregunta: '¿Cuándo se puede pagar justo con dos monedas?',
    temas: ['Ecuaciones diofánticas lineales'],
    pieza: MO,
    aprendizaje: 'Una cuenta se paga justo con dos monedas si hay cantidades enteras que la cumplen: se prueba una y la otra sale de un múltiplo.',
    actividad: 'Elegir cuántas monedas de cada clase pagan justo la cuenta.',
    lee: {
      tarjetas: [
        { titulo: 'Pagar sin vuelto', texto: 'En el puesto de doña Juana no hay vuelto. Un cliente paga S/ 16 con 3 monedas de S/ 2 y 2 de S/ 5. Nadie paga con media moneda: las dos cantidades son números enteros.',
          ecuacion: [bas(2), ' × ', res(3), ' + ', bas(5), ' × ', res(2), ' = 16'],
          pieza: MO, dibujo: { datos: { cuenta: 16, filas: [{ valor: 2, cuantas: 3 }, { valor: 5, cuantas: 2 }] }, estado: {} } },
        { titulo: 'Una ecuación con dos incógnitas', texto: 'Si x son las monedas de S/ 2 e y las de S/ 5, pagar S/ 16 es cumplir esta igualdad. Una ecuación así, de la que solo sirve cada solución entera, se llama ecuación diofántica. El 2 y el 5 son sus coeficientes.',
          ecuacion: [bas(2), ' × ', res('x'), ' + ', bas(5), ' × ', res('y'), ' = 16'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a poner y quitar monedas hasta pagar justo. Fíjate en lo que falta después de poner las de S/ 5: tiene que poder completarse con monedas de S/ 2.' },
      ],
    },
    ejemplos: EJEMPLOS_PAGOS,
    juega: {
      pieza: MO,
      consigna: 'Un cliente paga su cuenta en el puesto solo con monedas de S/ 2 y de S/ 5. No hay vuelto.',
      mision: {
        // Una sola respuesta: S/ 23 se paga con (9, 1) o con (4, 3); la de menos monedas es (4, 3).
        texto: 'Paga los S/ 23 justos usando la menor cantidad de monedas.',
        logrado: v => v.a === 4 && v.b === 3,
        bien: 'Con 4 y 3 son siete monedas; con 9 y 1 serían diez.',
      },
      voz: 'Mira si lo que falta se completa con monedas de S/ 2.',
      leyenda: [
        { s: bas('S/ 2'), t: 'lo que vale cada moneda' },
        { s: res('cuántas'), t: 'las monedas de cada clase' },
      ],
      controles: CTRL_Y,
      dibujo: v => ({ datos: { cuenta: 23, filas: [{ valor: 2, cuantas: v.a }, { valor: 5, cuantas: v.b }] }, estado: {} }),
      lectura: v => { const t = 2 * v.a + 5 * v.b; return [bas(2), ' × ', res(v.a), ' + ', bas(5), ' × ', res(v.b), ` = ${t}`, t === 23 ? ': justo' : t < 23 ? `: faltan ${23 - t}` : `: sobran ${t - 23}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: '¿De cuántas maneras se pueden pagar S/ 40 justos con monedas de S/ 2 y de S/ 5? También vale usar una sola clase de moneda.',
      datos: ['Las monedas son de S/ 2 y de S/ 5', 'La cuenta es de S/ 40 y no hay vuelto'],
      voz: 'Piensa con cuántas de S/ 5 se puede completar.',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'todas', texto: '9', error: 'AT-DIOF-TODAS', siFuera: 'Probar de 0 a 8 de S/ 5 está bien. Pero con 1, 3, 5 o 7 falta un impar.' },
        { id: 'cero', texto: '3', error: 'AT-DIOF-CERO', siFuera: 'Esas son las maneras que usan las dos monedas. También vale pagar todo con una sola clase.' },
        { id: 'divide', texto: '8', error: 'AT-DIOF-DIVIDE', siFuera: 'Con 8 monedas de S/ 5 se paga justo: es una manera. Se pide cuántas maneras hay.' },
      ],
      dibujo: monedas({ cuenta: 40, filas: [{ valor: 2, cuantas: '?' }, { valor: 5, cuantas: '?' }] }),
      revelar: monedas({ cuenta: 40, filas: [{ valor: 2, cuantas: '?' }, { valor: 5, cuantas: '?' }], pie: [['de S/ 5 sirven 0, 2, 4, 6 u 8: '], ['5', 'f', 700], [' maneras']] }),
      coincide: 'Coincide: sirven 0, 2, 4, 6 y 8 monedas de S/ 5.',
      noCoincide: 'Revisemos: lo que falta después de las de S/ 5 tiene que ser par.',
    },
    mira: {
      pieza: 'arit-tabla',
      datos: tablaPago(40, true),
      voz: 'Lo que falta tiene que ser múltiplo de 2.',
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'Sin monedas de S/ 5, los S/ 40 son 20 monedas de S/ 2.', ecuacion: [bas(2), ' × ', res(20), ' = 40'] },
        { estado: { paso: 2, fila: 1 }, texto: 'Con 1 de S/ 5 faltan S/ 35: impar, no se puede.' },
        { estado: { paso: 3, fila: 2 }, texto: 'Con 2 de S/ 5 faltan S/ 30: son 15 de S/ 2.', ecuacion: [bas(2), ' × ', res(15), ' + ', bas(5), ' × ', res(2), ' = 40'] },
        { estado: { paso: 9, fila: [0, 2, 4, 6, 8] }, texto: 'Sirven 0, 2, 4, 6 y 8 de S/ 5: de 2 en 2.' },
        { estado: { paso: 9, fila: [0, 2, 4, 6, 8] }, texto: 'Son 5 maneras, y las de S/ 2 bajan de 5 en 5.', ecuacion: ['(20, 0), (15, 2), (10, 4), (5, 6), (0, 8)'] },
      ],
    },
    regla: {
      texto: 'Para pagar justo con dos monedas se prueba una clase y se ve si lo que falta es múltiplo de la otra. Las soluciones van de salto en salto.',
      ecuacion: [bas(2), ' × ', { llave: [res('x')], nota: 'monedas de S/ 2', color: 'c-f' }, ' + ', bas(5), ' × ', { llave: [res('y')], nota: 'monedas de S/ 5', color: 'c-f' }, ' = 40', SEP, res('y'), ' sube de 2 en 2 y ', res('x'), ' baja de 5 en 5'],
      condicion: 'x e y son enteros no negativos. Si las monedas son múltiplos de un número y la cuenta no, es imposible.',
      voz: 'Prueba una moneda; la otra sale de un múltiplo.',
    },
    // Así se resuelve: todas las compras de bolsas y cajas con un gasto fijo, listadas. «Ahora tú» pide cuántas maneras
    // (con monedas o billetes), la de menos monedas, la cuenta imposible y las bolsas con la mayor cantidad de cajas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const [p, q] = r.de([[3, 4], [3, 5], [4, 5], [3, 7]]), c = r.ent(25, 60), ps = pagos(p, q, c), ymax = Math.floor(c / q);
          if (ps.length < 2 || ps.length > 5) continue;
          const no = []; for (let y = 0; y <= ymax; y++) if ((c - q * y) % p) no.push(y);
          return {
            enunciado: `Doña Juana vende bolsas de ${soles(p)} y cajas de ${soles(q)}. Un cliente gasta justo ${soles(c)}. ¿Qué compras puede haber hecho? Puede llevar de una sola clase.`,
            datos: [D6.ec(p, q, c), D6.xy('las bolsas', 'las cajas')],
            pasos: [
              { tipo: 'pide', texto: 'Piden todas las parejas de cantidades enteras, desde cero, que gastan justo el total.' },
              { tipo: 'regla', texto: ['Pruebo cada cantidad de cajas. Sirve si lo que queda es múltiplo de ', bas(p), ': con eso se pagan las bolsas.'] },
              { tipo: 'cuentas', texto: `Las cajas van de 0 a ${ymax}. Con ${ps.map(x => x[1]).join(', ')} queda un múltiplo de ${p}${no.length ? `; con ${no.slice(0, 4).join(', ')}${no.length > 4 ? '…' : ''}, no` : ''}.` },
              { tipo: 'cuentas', texto: 'Divido lo que queda entre el precio de la bolsa y anoto cada compra como (bolsas, cajas).', ecuacion: [ps.map(x => `(${x[0]}, ${x[1]})`).join(', ')] },
              { tipo: 'sentido', texto: `Compruebo la última: ${p} × ${ps[ps.length - 1][0]} + ${q} × ${ps[ps.length - 1][1]} = ${c}. De una a otra, las cajas saltan de ${p} en ${p}.` },
            ],
            respuesta: [res(ps.length), ' compras posibles'],
          };
        }
      },
    },
    ahoraTu: {
      voz: 'Prueba una moneda; la otra sale de un múltiplo.',
      generar(sem) {
        const r = azar(sem + 151), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoManeras, r);
        if (tipo === 1) return conCuatro(casoMenos, r);
        if (tipo === 2) return conCuatro(casoImposible, r);
        return conCuatro(casoArticulos, r);
      },
    },
  };

  // Fichas del laboratorio: cuelgan de arriba y la ficha es más chica, para que quepan 16 filas.
  const LAB = { arriba: true, altoMax: 200, ficha: 20 };
  // Lo que miden las mesas (las mismas cuentas que rotulan las fichas y la tabla).
  const sobra = v => v.n % v.m;
  const juntos = v => (v.a % v.m) + (v.b % v.m);
  const largo = v => { const c = ciclo(v.b, v.k); return c.xs.length - c.ini; };
  let MAX_L = 0; for (let b0 = 2; b0 <= 12; b0++) for (let k0 = 2; k0 <= 10; k0++) MAX_L = Math.max(MAX_L, largo({ b: b0, k: k0 }));

  return {
    unidad: 'aritmetica.divisibilidad',
    version: '0.4.0',
    // Sin calidad: 2 todavía: la marca la sesión después del lector en frío y del auditor.
    estado: 'completa',
    // Un color fijo por magnitud (cabecera); lo comprueba divisibilidad.test.js en las seis ideas.
    colores: COLORES,
    // Tabla de letras de la unidad (propuesta §6): las que pueden ir en una línea de Datos sin volver a decirse.
    letras: { N: 'el número que se estudia', d: 'el divisor: lo que lleva una bolsita', k: 'el entero que multiplica al divisor', q: 'el cociente entero: las bolsitas llenas', r: 'el resto: los sueltos que sobran',
      s: 'el resto del segundo número', a: 'una cifra de un numeral', b: 'una cifra de un numeral', c: 'una cifra de un numeral', x: 'cuántas hay de la primera clase', y: 'cuántas hay de la segunda clase' },
    requiere: ['/nucleo/kit/piezas/arit-puesto.js', '/nucleo/kit/piezas/arit-boletos.js', '/nucleo/kit/piezas/arit-boleto.js', '/nucleo/kit/piezas/arit-monedas.js', '/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/arit-tabla.js'],
    // Glosario: las palabras que esta unidad estrena en el curso (docs/teoria.md §4d). «número primo» se estrena
    // en lógica proposicional y conjuntos («x es primo»): aquí no se repite.
    glosario: [
      // De 2 a 4 palabras por idea, con su aproximación y tres ejemplos. «múltiplo», «divisor», «división exacta», «resto»
      // y «resto por exceso» son de Las cuatro operaciones y de Numeración: aquí no se definen (el lector los marca «se
      // explica en…»). «máximo común divisor» se mudó a MCD y MCM (19 nov). Ningún ejemplo resuelve una predicción.
      { termino: 'divisible', formas: ['divisible', 'divisibles'], def: 'Que se puede repartir entre otro número sin que sobre nada: es su múltiplo.',
        simple: 'Que se empaca en bolsitas iguales sin dejar caramelos sueltos.', ver: ['divisor', 'múltiplo', 'división exacta'],
        ejemplos: ['35 lo es entre 7: 35 = 7 × 5.', '45 no lo es entre 6: sobran 3.', 'Todo número lo es entre 1 y entre sí mismo.'] },
      { termino: 'número par', formas: ['número par', 'números pares'], def: 'Entero que es múltiplo de 2: se reparte en dos mitades iguales.',
        simple: 'El que se reparte entre dos sin que sobre nada.', ver: ['número impar', 'múltiplo'],
        ejemplos: ['14 lo es: 14 = 2 × 7.', 'El 0 también: 0 = 2 × 0.', 'Su última cifra también lo es: 30, 52, 74, 96.'] },
      { termino: 'número impar', formas: ['número impar', 'números impares'], def: 'Entero que no es múltiplo de 2: al repartirlo entre dos sobra 1.',
        simple: 'El que deja 1 suelto al repartirlo entre dos.', ver: ['número par'],
        ejemplos: ['15 lo es: 15 = 2 × 7 + 1.', 'Van saltando de 2 en 2: 1, 3, 5, 7…', 'Dos de ellos suman un par: 5 + 9 = 14.'] },
      { termino: 'módulo', simbolo: 'mód', def: 'El divisor con el que se comparan los restos: el número que va bajo el circulito.',
        simple: 'Lo que lleva la bolsita: de cuánto en cuánto se empaca.', ver: ['congruencia', 'divisor'],
        ejemplos: ['En «30 es múltiplo de 7, más 2» es el 7.', 'Con bolsitas de 5, es 5.', 'En 17 ≡ 2 (mód 5) es el 5.'] },
      { termino: 'congruencia', simbolo: '≡', formas: ['congruencia', 'congruencias', 'congruente', 'congruentes'],
        def: 'Relación entre dos números que dejan el mismo resto al dividirlos entre un mismo divisor. Se escribe con ≡.',
        simple: 'Dos pedidos que dejan los mismos sueltos con la misma bolsita.', ver: ['módulo', 'resto'],
        ejemplos: ['17 ≡ 2 (mód 5): los dos dejan resto 2.', '30 y 9 dejan lo mismo entre 7: 2.', '12 y 20 no dejan lo mismo entre 5: 2 y 0.'] },
      { termino: 'criterio de divisibilidad', formas: ['criterio de divisibilidad', 'criterios de divisibilidad'],
        def: 'Regla para saber el resto, o si sobra algo, mirando solo las cifras, sin hacer la división.',
        simple: 'Un atajo que mira las cifras en vez de dividir.', ver: ['suma de cifras', 'cifra'],
        ejemplos: ['Entre 9: se suman las cifras.', 'Entre 5: basta mirar la última cifra.', 'Entre 4: bastan las dos últimas cifras.'] },
      { termino: 'suma de cifras', formas: ['suma de cifras', 'suma de sus cifras', 'suma de las cifras'],
        def: 'Resultado de sumar, una por una, las cifras con que se escribe un número.',
        simple: 'Juntar las cifras de un número, sin importar su lugar.', ver: ['criterio de divisibilidad'],
        ejemplos: ['La de 243 es 2 + 4 + 3 = 9.', 'La de 1 005 es 6.', 'La de 99 es 18.'] },
      { termino: 'restos potenciales', formas: ['restos potenciales', 'resto potencial'],
        def: 'Los restos que dejan las potencias de un número al dividirlas entre un mismo divisor.',
        simple: 'Los sueltos que quedan cada día, si el pedido se duplica.', ver: ['ciclo', 'potencia'],
        ejemplos: ['Entre 7, los de 2, 4 y 8 son 2, 4 y 1.', 'Entre 5, los de 3, 9 y 27 son 3, 4 y 2.', 'Entre 10, son la última cifra de cada potencia.'] },
      { termino: 'ciclo', formas: ['ciclo', 'ciclos'], def: 'Grupo de restos que se repite una y otra vez, siempre en el mismo orden.',
        simple: 'La parte que se repite, como los días de la semana.', ver: ['restos potenciales'],
        ejemplos: ['3, 4, 2, 1, 3, 4, 2, 1…: se repite de cuatro en cuatro.', 'Las potencias de 3 terminan en 3, 9, 7, 1 y vuelven a empezar.', 'La semana: se repite cada 7 días.'] },
      { termino: 'exponente', formas: ['exponente', 'exponentes'], def: 'Número pequeño, arriba a la derecha, que dice cuántas veces se multiplica la base.',
        simple: 'Cuántas veces se multiplica un número por sí mismo.', ver: ['potencia'],
        ejemplos: ['En 2³ = 8 es el 3: 2 × 2 × 2.', 'En 10² = 100 es el 2.', 'En 5¹ es el 1: un solo 5.'] },
      { termino: 'suma alternada', formas: ['suma alternada', 'sumas alternadas'],
        def: 'Cuenta en la que las cifras de un número se suman y se restan, una sí y una no.',
        simple: 'Sumar una cifra, restar la siguiente, y así.', ver: ['peso de cada lugar'],
        ejemplos: ['La de 583, desde las unidades: 3 − 8 + 5 = 0.', 'La de 936: 6 − 3 + 9 = 12.', 'La de 71: 1 − 7 = −6.'] },
      { termino: 'peso de cada lugar', formas: ['peso de cada lugar', 'peso de su lugar', 'peso de un lugar'],
        def: 'El resto que deja la potencia de 10 de ese lugar entre el divisor.',
        simple: 'Lo que deja cada bolsita, caja o cajón al reempacar.', ver: ['suma alternada', 'criterio de divisibilidad'],
        ejemplos: ['Entre 9, todos valen 1.', 'Entre 11, el de la decena es −1: a 10 le falta 1.', 'Entre 5, el de la decena es 0: 10 = 5 × 2.'] },
      { termino: 'ecuación diofántica', formas: ['ecuación diofántica', 'ecuaciones diofánticas', 'diofántica'],
        def: 'Ecuación con más de una incógnita en la que solo valen números enteros.',
        simple: 'Una cuenta que se paga con monedas enteras, sin partir ninguna.', ver: ['coeficiente', 'solución entera'],
        ejemplos: ['2x + 5y = 16 tiene x = 3, y = 2.', '10x + 20y = 35 no tiene: 35 no es múltiplo de 10.', '3x + 7y = 34 tiene x = 9, y = 1.'] },
      { termino: 'coeficiente', formas: ['coeficiente', 'coeficientes'], def: 'Número que multiplica a una letra en una ecuación.',
        simple: 'Lo que vale cada moneda en la cuenta.', ver: ['ecuación diofántica'],
        ejemplos: ['En 2x + 5y = 16 son 2 y 5.', 'En 3x + 7y = 34 son 3 y 7.', 'En 10x + 20y son 10 y 20.'] },
      { termino: 'solución entera', formas: ['solución entera', 'soluciones enteras'], def: 'Valores enteros de las incógnitas que cumplen la ecuación.',
        simple: 'Cantidades sin partir que hacen cuadrar la cuenta.', ver: ['ecuación diofántica'],
        ejemplos: ['x = 3, y = 2 lo es de 2x + 5y = 16.', 'x = 0,5 no vale: no hay media moneda.', '2x + 5y = 11 tiene una sola sin negativos: x = 3, y = 1.'] },
    ],
    // Laboratorio: juego libre, sin preguntas. «Filas grandes» abre n hasta 48 y filas hasta 12; «Juntar sobrantes»
    // deja elegir el divisor (el juego lo fija en 5); «Ciclos largos» llega a la potencia 9 y a la base 12, con divisores que
    // comparten factores con la base (ciclos que no empiezan en la primera potencia).
    laboratorio: [
      {
        id: 'filas-grandes', titulo: 'Filas grandes', pieza: 'arit-fichas',
        consigna: 'Hasta 48 fichas en filas de 3 a 12. Arrastra la última ficha o el borde de la fila.',
        controles: [
          { id: 'n', etiqueta: 'Fichas', min: 13, max: 48, paso: 1, inicio: 36, decimales: 0 },
          { id: 'm', etiqueta: 'Fichas por fila', color: 'c-i', min: 3, max: 12, paso: 1, inicio: 7, decimales: 0 },
        ],
        dibujo: v => ({ datos: filas(v.n, v.m, LAB), estado: {} }),
        lectura: v => (sobra(v) ? [`${v.n} en filas de ${v.m}: sobran `, sob(sobra(v))] : [`${v.n} en filas de ${v.m}: no sobra nada`]),
        invitaciones: [
          { texto: 'Busca el mayor n que llene filas de 7 sin sobrar.',
            logrado: v => v.m === 7 && sobra(v) === 0 && v.n + v.m > 48,
            bien: '42 = 7 × 6: el siguiente múltiplo de 7, 49, ya no cabe.' },
          { texto: 'Con filas de 12, haz que sobre lo más posible.',
            logrado: v => v.m === 12 && sobra(v) === v.m - 1,
            bien: 'Sobran 11: con una ficha más se llena otra fila.' },
          { texto: 'Haz exactamente 4 filas llenas, sin nada suelto.',
            logrado: v => sobra(v) === 0 && v.n / v.m === 4,
            bien: 'Cuatro filas llenas: las fichas son múltiplo del largo de la fila.' },
          { texto: 'Busca un n que deje sobrante con cualquier largo de fila.',
            logrado: v => { for (let c = 3; c <= 12; c++) if (sobra({ n: v.n, m: c }) === 0) return false; return true; },
            bien: 'Ningún largo de 3 a 12 lo llena. ¿Probaste con filas de 2?' },
          { texto: 'Guarda dos largos de fila distintos que llenen el mismo n.',
            logrado: (v, guardados) => sobra(v) === 0 && guardados.some(g => g.n === v.n && g.m !== v.m && sobra(g) === 0),
            bien: 'Mismo n, dos divisores: hay varias maneras de llenarlo.' },
        ],
        arrastres: arrastresFilas(13, 48, 3, 12, LAB),
      },
      {
        id: 'juntar-sobrantes', titulo: 'Juntar sobrantes', pieza: 'arit-fichas',
        consigna: 'Dos pedidos en filas iguales. Elige cuántas fichas lleva cada fila y mira los sobrantes juntos.',
        controles: [
          { id: 'a', etiqueta: 'Pedido de la mañana', min: 3, max: 30, paso: 1, inicio: 17, decimales: 0 },
          { id: 'b', etiqueta: 'Pedido de la tarde', min: 3, max: 30, paso: 1, inicio: 11, decimales: 0 },
          { id: 'm', etiqueta: 'Fichas por fila', color: 'c-i', min: 3, max: 8, paso: 1, inicio: 6, decimales: 0 },
        ],
        dibujo: v => ({ datos: juntar(v.a, v.b, v.m), estado: { paso: 1 } }),
        lectura: v => [`Filas de ${v.m}: sobran ${v.a % v.m} + ${v.b % v.m}; los ${v.a + v.b} juntos dejan `, sob((v.a + v.b) % v.m)],
        invitaciones: [
          { texto: 'Haz que los sobrantes juntos llenen justo una fila.',
            logrado: v => juntos(v) === v.m,
            bien: 'Los sobrantes completaron una fila: los dos pedidos juntos son múltiplo del largo de la fila.' },
          { texto: 'Con filas de 8, junta la mayor cantidad posible de sobrantes.',
            logrado: v => v.m === 8 && juntos(v) === 2 * (v.m - 1),
            bien: '7 + 7 = 14: una fila llena y sobran 6. Ese es el resto.' },
          { texto: 'Haz que juntos sobren tantos como la mañana, con una tarde de más de una fila.',
            logrado: v => v.b > v.m && (v.a + v.b) % v.m === v.a % v.m,
            bien: 'La tarde no cambió el resto: es múltiplo del largo de la fila.' },
          { texto: 'Guarda dos casos con las mismas filas, otra mañana y los mismos sobrantes.',
            logrado: (v, guardados) => guardados.some(g => g.m === v.m && g.a !== v.a && g.a % g.m === v.a % v.m && g.b % g.m === v.b % v.m),
            bien: 'Otros pedidos, los mismos sobrantes: el resto de los dos juntos no cambió.' },
        ],
        arrastres: arrastresJuntar(3, 30, v => v.m),
      },
      {
        id: 'ciclos-largos', titulo: 'Ciclos largos', pieza: 'arit-tabla',
        consigna: 'Base de 2 a 12 y divisor de 2 a 10. Prueba un divisor que comparta factores con la base.',
        controles: [
          { id: 'b', etiqueta: 'base', min: 2, max: 12, paso: 1, inicio: 2, decimales: 0 },
          { id: 'k', etiqueta: 'divisor', color: 'c-i', min: 2, max: 10, paso: 1, inicio: 10, decimales: 0 },
          { id: 'e', etiqueta: 'exponente', min: 1, max: 9, paso: 1, inicio: 1, decimales: 0 },
        ],
        dibujo: v => ({ datos: tablaPot(v.b, v.k, 9), estado: { fila: v.e - 1 } }),
        lectura: v => lecturaPot(v.b, v.k, v.e),
        // Retos: ciclo() y powmod() son las mismas que llenan la tabla.
        invitaciones: [
          { texto: 'Busca el ciclo más largo que deja esta mesa.',
            logrado: v => largo(v) === MAX_L,
            bien: 'Largo 6: con divisores hasta 10, ningún ciclo es más largo.' },
          { texto: 'Haz que el ciclo no empiece en la primera potencia.',
            logrado: v => ciclo(v.b, v.k).ini > 0,
            bien: 'Base y divisor comparten un factor: los primeros restos ya no vuelven.' },
          { texto: 'Haz que todas las potencias dejen resto 0.',
            logrado: v => ciclo(v.b, v.k).xs.every(x => x === 0),
            bien: 'El divisor divide a la base: cada potencia es su múltiplo.' },
          { texto: 'Con divisor 7, busca una potencia con exponente mayor que 1 que deje resto 1.',
            logrado: v => v.k === 7 && v.e > 1 && powmod(v.b, v.e, v.k) === 1,
            bien: 'Resto 1: desde la potencia siguiente, el ciclo vuelve a empezar.' },
          { texto: 'Guarda dos exponentes distintos, con la misma base y divisor, y el mismo resto.',
            logrado: (v, guardados) => guardados.some(g => g.b === v.b && g.k === v.k && g.e !== v.e && powmod(g.b, g.e, g.k) === powmod(v.b, v.e, v.k)),
            bien: 'Mismo resto: los exponentes se diferencian en un múltiplo del largo del ciclo.' },
        ],
        arrastres: [arrastrePot(9)],
      },
    ],
    historia: {
      texto: 'Las preguntas sobre restos son muy antiguas, pero en 1801 Gauss las ordenó en sus Disquisitiones Arithmeticae con el lenguaje de las congruencias. Ese lenguaje permite trabajar con lo que sobra de una división sin calcular el número completo. Los criterios de divisibilidad que vemos aquí salen de él: de lo que deja cada potencia de 10.',
      pregunta: '¿Se puede saber lo que sobra sin dividir todo?',
      fuente: { titulo: 'O’Connor y Robertson, Carl Friedrich Gauss — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Gauss/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'filas-grandes': ['filas-de-m'],
      'juntar-sobrantes': ['restos-suman'],
      'ciclos-largos': ['restos-potenciales'],
    },
    // Orden de la propuesta (docs/etapa5/propuesta-aritmetica.md §1): los restos potenciales van antes del 11, el 7 y el 13.
    ideas: [multiplos, teoremas, criterios, potencias, criteriosPesos, diofanticas],
  };
});
