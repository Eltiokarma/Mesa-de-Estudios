/*
 * Teoría de «Segmentos y ángulos» (geometria.segmentos-y-angulos), para 5.º de secundaria y preuniversitario. Molde:
 * docs/teoria.md y docs/molde-unidad.md. Fuente: docs/teoria/matriz/geometria.json (unidad 1), expediente
 * teoria-152-unidades (precisiones de Geometría). Compañera: Neri (nutria). Piezas: geo-objeto (objetos de prueba) y
 * geo-figura (las ideas que todavía no se rehacen y la mesa «B fuera de la recta»).
 *
 * Etapa 3 del plan de calidad (17 nov): la propuesta aprobada por Gerson (docs/etapa3/propuesta-geometria.md, con todas
 * las recomendaciones de su §9) y docs/etapa3/decisiones.md, que manda. Seis ideas: suma-de-segmentos, punto-medio
 * (nueva), abertura, bisectrices, paralelas y quiebre. Fase 2 del método (docs/metodo/unidad/): por ahora solo la idea 1,
 * «Suma de segmentos», está rehecha con todo el contrato (objeto en la primera pantalla, misión, leyenda, predicción sin
 * Pitágoras y con datos sin fórmula, «Mira» con la regla del mapa, regla, «Así se resuelve» distinto de «Ahora tú»,
 * «Ahora tú» con datos y de nivel examen, glosario con simple y tres ejemplos, y 15 ejemplos resueltos con las cuentas
 * rehechas aparte). Las ideas 2 a 5 de abajo son las de antes (v0.2.0) y esperan su turno; punto-medio se escribe
 * después del visto bueno de Gerson a la idea 1. Por eso la unidad aún no declara calidad: 2; la prueba propia
 * (segmentos-y-angulos.test.js) le exige el contrato completo a la idea 1.
 *
 * REGLA DE COLORES DE LA UNIDAD (decisiones de la etapa 3; molde §5b: un color fijo por magnitud, aquí por lo que cada
 * cosa ES en la figura, porque las letras AB, AC o θ cambian de un problema a otro):
 *   - segmentos: el todo (el tramo de punta a punta, el viaje directo) en tinta, con su cota; los tramos que se juntan,
 *     naranja (o) el primero de la carretera, de izquierda a derecha, y turquesa (i) el segundo; lo que se pide, con «?»
 *     en tinta, para que el color no lo delate; el resultado ya calculado, en violeta (f), solo en el texto del resuelto
 *     y en la respuesta, nunca en la figura ni en el enunciado; el verde no se usa;
 *   - ángulos (ideas 3 a 6, cuando se rehagan): el ángulo dado y sus iguales en carmín (h), con arco y letra; su
 *     compañero (90° − α o 180° − θ) en turquesa; en los ejercicios de las ideas 4 a 6, todo ángulo dado en carmín;
 *   - la pieza geo-objeto pone el color de cada tramo por su papel (todo, pide, dato) y el texto lo toma de la figura
 *     (pinta): un tramo no puede llevar en el texto otro color que en el dibujo. Sin figura (qué punto está entre los
 *     otros dos), ningún tramo lleva color: el color diría cuál es el de punta a punta.
 *   La comprueba segmentos-y-angulos.test.js en cada figura y cada texto de la idea 1 (juego en toda su grilla, «Lee»,
 *   predicción, «Mira», ejemplos, y «Así se resuelve» y «Ahora tú» en 400 semillas): falla si un tramo cambia de color,
 *   si el texto lo pinta distinto que la figura o lo deja sin color, o si aparece violeta en una figura o un enunciado.
 * Notación: AB nombra el segmento y su medida (se dice en «Lee»); m∠AOB para la medida de un ángulo en enunciados y
 * datos, y C(x), S(x) para complemento y suplemento, sin puntos C ni S en esas figuras (ideas 3 a 6, cuando se rehagan).
 * Códigos de error: GE17 (docs/investigacion/geometria-ideas-erroneas.md); los GE-SEG, GE-RAZ, GE-ANG, GE-CS, GE-BIS y
 * GE-QB son hipótesis de aula, sin medir (rutinas/teoria-geometria.md y el bloque de cada idea).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: distinguir lo que el dibujo sugiere de lo que la condición garantiza, en segmentos y ángulos.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de gama baja a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: resuelve sumas de segmentos (también los que se pisan y las razones con k), clasifica
 *     ángulos, usa complemento, suplemento y bisectriz, y encuentra ángulos entre paralelas, justificando con su condición.
 *   Orden de atención: 1.º la carretera y sus tramos · 2.º la misión · acción: correr el paradero · fondo: Neri.
 *   Estados: jugando (casos probados) · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿por qué es igual?» se contesta con una condición (entre, paralelas, adyacentes), no con el aspecto.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/kit/piezas/geo-figura.js'), require('../../../nucleo/kit/piezas/geo-objeto.js'))
    : fabrica(root.Kit, root.Kit.piezas['geo-figura'], root.Kit.piezas['geo-objeto']);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, G, PO) {
  'use strict';
  const U = G.util;
  const f = (n, d = 1) => Kit.formatear(n, d);
  const gr = n => `${f(n)}°`;
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura; aPlano la vuelve coordenadas del
  // problema y el lector ajusta cada valor al paso y al rango de su control.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, pt) => G.aPlano(datos, pt);
  const giro360 = (c, q) => { const g = U.grados(Math.atan2(q[1] - c[1], q[0] - c[0])); return g < -1e-9 ? g + 360 : g; };
  function opciones(correcta, distractores, fmt, n = 4) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor <= 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, n);
  }

  // ---------- Idea 1 (rehecha, 17 nov): suma de segmentos ----------
  // Propuesta aprobada por Gerson: docs/etapa3/propuesta-geometria.md y docs/etapa3/decisiones.md (mandan sobre la
  // propuesta). Objeto de la primera pantalla: la combi en una carretera recta, con los paraderos A, B y C (pieza
  // geo-objeto, dibujo de prueba).
  // Cambia: el paradero B, por la carretera (también antes de A y más allá de C). · Permanece: A, C y AC = 10 km.
  // Progresa: el recorrido AB + BC en la lectura. · Se reserva: B fuera de la carretera (la predicción, sin Pitágoras:
  // «Mira» lo mide con la regla del mapa). · Debe verse: AB + BC = AC solo con B entre A y C; si no, el camino es más largo.
  // Colores (regla de la unidad, arriba): la pieza los pone por el papel de cada tramo y el texto los toma de la figura
  // (pinta), así que un tramo no puede llevar en el texto otro color que en el dibujo.
  // Errores (hipótesis, sin medir; rutinas/teoria-geometria.md y la propuesta): GE-SEG1 suma los tramos sin mirar si B
  // está entre A y C, GE-SEG2 suma el desvío a AC, GE-SEG6 (nuevo) cree que el rodeo acorta, GE-SEG4 cuenta dos veces el
  // tramo que se pisa, GE-SEG5 hace una resta válida que da otro tramo, GE-SEG7 (nuevo) toma por punto del medio una punta
  // del tramo más largo, GE-SEG8 (nuevo) cree que la letra del medio es el punto del medio, GE-SEG9 (nuevo) cree que, sin
  // el orden dicho, ninguno está entre los otros, GE-SEG11 (nuevo) parte una suma entre dos, GE-SEG12 (nuevo) parte entre
  // dos lo que ya era el tramo, GE-SEG14 (nuevo) quita el tramo equivocado, GE-RAZ1 (nuevo) da la otra parte de la razón,
  // GE-RAZ2 (nuevo) se queda en k, GE-RAZ3 (nuevo) resta los números de la razón a una medida.
  const GO = 'geo-objeto';
  const dO = t => ({ v: 'c-o', t }), dI = t => ({ v: 'c-i', t }), dF = t => ({ v: 'c-f', t });
  // Una letra sola en violeta, derecha (el U+2060 invisible evita la cursiva de variable de nucleo/ecuacion.js).
  const letraF = L => dF(`${L}⁠`);
  const SEP = '   ·   ';
  // Una relación que no se parte en dos líneas: sus espacios pasan a espacios duros (como en razones trigonométricas).
  const junto = x => (typeof x === 'string' ? x.replace(/ /g, ' ') : Array.isArray(x) ? x.map(junto) : x);
  // El tramo con el color que le da la figura (la pieza lo decide por su papel), o en tinta si la figura no lo pinta.
  const pinta = (datos, nom) => { const c = PO.colorDe(datos, nom); return c ? { v: `c-${c}`, t: nom } : nom; };
  const fig = datos => ({ pieza: GO, datos, estado: {} });
  const pto = (id, km, alto) => (alto ? { id, km, alto } : { id, km });
  const tr = (de, a, texto, nivel, papel) => Object.assign({ de, a, nivel: nivel || 1 }, texto !== undefined ? { texto } : {}, papel ? { papel } : {});
  const km = (x, u = 'km') => `${f(x)} ${u}`;
  // Cuatro opciones siempre en «Ahora tú»: si dos errores coinciden por los números, se arma otro caso con el mismo azar.
  function conCuatro(caso, r) {
    for (let i = 0; i < 80; i++) { const c = caso(r); if (c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }

  // Lo que se da en los ejercicios (contrato, punto 13): la definición de «entre» y la suma de tramos, una por línea.
  const D_ENTRE = 'Un punto está entre otros dos si sus dos tramos suman el tramo de punta a punta.';
  // Con los tramos pintados como en la figura del ejercicio (sin figura, en tinta).
  const dOrden = F => ['Con puntos en orden, cada medida es la suma de sus tramos: AD = ', ...['AB', 'BC', 'CD'].flatMap((x, i) => [i ? ' + ' : '', F ? pinta(F, x) : x]), '.'];
  const D_RAZON = (x, y, m, n) => ['Razón ', x, ' : ', y, ` = ${m} : ${n}: `, x, ` = ${m}k y `, y, ` = ${n}k, con k la medida de una parte.`];

  // El juego: A en el km 0 y C en el 10; B se corre de −2 a 12. La vista es fija (el dedo sigue al paradero).
  const VISTA_J = [-3, 13];
  const figJ = bx => ({ objeto: 'carretera', vista: VISTA_J, hitos: 1, combi: 2,
    puntos: [pto('A', 0), pto('B', bx), pto('C', 10)],
    tramos: [tr('A', 'B', km(Math.abs(bx)), 1), tr('B', 'C', km(Math.abs(10 - bx)), 2), tr('A', 'C', '10 km', -1, 'todo')] });
  const AB1 = dO('AB'), BC1 = dI('BC');
  // La predicción y «Mira»: B a 3 km de la carretera, frente al km 4. Los caminos AB = 5 km y BC = √45 ≈ 6,7 km los
  // calcula el código; el alumno no los saca con Pitágoras (llega ocho unidades después): «Mira» los mide con la regla.
  const BX = 4, BY = 3, dAB = Math.hypot(BX, BY), dBC = Math.hypot(10 - BX, BY);
  const figP = (o = {}) => ({ objeto: 'carretera', vista: [-1, 11],
    puntos: [pto('A', 0), pto('B', BX, BY), pto('C', 10)],
    tramos: [tr('A', 'B', o.ab), tr('B', 'C', o.bc), tr('A', 'C', '10 km', -1, 'todo')],
    alturas: [{ punto: 'B', texto: `${f(BY)} km` }], reglas: o.reglas, nota: o.nota });
  const largo = x => `${Math.abs(x - Math.round(x)) < 1e-9 ? '' : '≈ '}${f(x, 1)} km`;

  // Ejemplos resueltos de «Suma de segmentos» (pestaña «Ejemplos»; molde §3). Cuentas rehechas con un script aparte, sin
  // el código de la unidad (scratchpad e3-geo/cuentas-idea1.js): 7 + 5 = 12; 18 − 11 = 7; con A en medio 5 + 3 = 8 (y
  // con B o C en medio, 13 y 11, que no dan); 10 + 3 = 13; 2 + 10 = 12; 13 + 3 = 16; 2400 − 900 = 1500; 12 − 3 − 4 = 5;
  // 9 + 11 − 15 = 5; 5k = 20 → k = 4 y 3k = 12; x + BC = 14 y BC + 2x = 17 → x = 3, BC = 11; 30 − 21 = 9; 2k = 8 →
  // k = 4 y 8k = 32; 12 − 5 = 7 o 12 + 5 = 17; 6k = 36 → k = 6, AC = 18, BD = 30 y 48. La figura muestra el
  // planteamiento: lo que se pide va con «?» en tinta; ningún dibujo trae la respuesta.
  const EJ = [];
  {
    // 1. Un paso: la suma.
    const F = { objeto: 'carretera', combi: 1.6, puntos: [pto('A', 0), pto('B', 7), pto('C', 12)], tramos: [tr('A', 'B', '7 km'), tr('B', 'C', '5 km'), tr('A', 'C', '?', -1, 'pide')] };
    const AB = pinta(F, 'AB'), BC = pinta(F, 'BC');
    EJ.push({ nivel: 1, titulo: 'De A a C por B', figura: fig(F),
      enunciado: ['La combi va del paradero A al C por una carretera recta, y B está entre los dos: ', AB, ' = 7 km y ', BC, ' = 5 km. ¿Cuántos kilómetros recorre de A a C?'],
      datos: [['B entre A y C: ', AB, ' + ', BC, ' = AC.']],
      solucion: [{ texto: 'B está entre A y C: los dos tramos se suman.', ecuacion: junto(['AC = ', AB, ' + ', BC, ' = 7 + 5 = ', dF('12 km')]) }],
      respuesta: ['AC = ', dF('12 km')] });
  }
  {
    // 2. Un paso: la resta.
    const F = { objeto: 'carretera', puntos: [pto('A', 0), pto('B', 11), pto('C', 18)], tramos: [tr('A', 'B', '11 km'), tr('B', 'C', '?', 1, 'pide'), tr('A', 'C', '18 km', -1, 'todo')] };
    const AB = pinta(F, 'AB');
    EJ.push({ nivel: 1, titulo: 'El tramo que falta', figura: fig(F),
      enunciado: ['A, B y C son paraderos de una carretera recta, en ese orden. De A a C hay 18 km, y ', AB, ' = 11 km. ¿Cuánto mide BC?'],
      datos: [['B entre A y C: ', AB, ' + BC = AC.']],
      solucion: [{ texto: ['B está entre A y C: ', AB, ' y BC juntos hacen los 18 km de AC. Le quito ', AB, ':'], ecuacion: junto(['BC = 18 − 11 = ', dF('7 km')]) }],
      respuesta: ['BC = ', dF('7 km')] });
  }
  // 3. Un paso: decidir qué punto está entre los otros dos. Sin figura y sin colores: el dibujo o el color dirían cuál
  // es el tramo de punta a punta, que es justo lo que se averigua.
  EJ.push({ nivel: 1, titulo: '¿Cuál está en medio?',
    enunciado: 'En una carretera recta hay tres paraderos, A, B y C. AB = 5 km, BC = 8 km y AC = 3 km. ¿Cuál de los tres está entre los otros dos?',
    datos: [D_ENTRE],
    solucion: [
      { texto: 'El tramo más largo, BC = 8 km, va de punta a punta: B y C son los extremos. Queda A.' },
      { texto: 'Compruebo con A en medio: sus dos tramos suman BC.', ecuacion: junto(['BA + AC = 5 + 3 = 8 km = BC']) },
    ],
    respuesta: ['El paradero ', letraF('A')] });
  {
    // 4. Un paso: el del medio es C.
    const F = { objeto: 'carretera', puntos: [pto('A', 0), pto('C', 10), pto('B', 13)], tramos: [tr('A', 'C', '10 km'), tr('C', 'B', '3 km'), tr('A', 'B', '?', -1, 'pide')] };
    const AC = pinta(F, 'AC'), CB = pinta(F, 'CB');
    EJ.push({ nivel: 1, titulo: 'Más allá de C', figura: fig(F),
      enunciado: ['En una carretera recta, el paradero C está entre A y B: ', AC, ' = 10 km y ', CB, ' = 3 km. ¿Cuánto mide AB?'],
      datos: [['C entre A y B: ', AC, ' + ', CB, ' = AB.']],
      solucion: [{ texto: ['Ahora el paradero del medio es C: ', AC, ' y ', CB, ' se suman.'], ecuacion: junto(['AB = ', AC, ' + ', CB, ' = 10 + 3 = ', dF('13 km')]) }],
      respuesta: ['AB = ', dF('13 km')] });
  }
  {
    // 5. Un paso: el del medio es A.
    const F = { objeto: 'carretera', puntos: [pto('B', -2), pto('A', 0), pto('C', 10)], tramos: [tr('B', 'A', '2 km'), tr('A', 'C', '10 km'), tr('B', 'C', '?', -1, 'pide')] };
    const BA = pinta(F, 'BA'), AC = pinta(F, 'AC');
    EJ.push({ nivel: 1, titulo: 'Antes de A', figura: fig(F),
      enunciado: ['El paradero B está en la carretera, 2 km antes de A, y de A a C hay 10 km. ¿Cuánto mide BC?'],
      datos: [['A entre B y C: ', BA, ' + ', AC, ' = BC.']],
      solucion: [
        { texto: 'B queda antes de A, y C después: el paradero del medio es A.' },
        { texto: 'Sumo los dos tramos que tocan a A:', ecuacion: junto(['BC = ', BA, ' + ', AC, ' = 2 + 10 = ', dF('12 km')]) },
      ],
      respuesta: ['BC = ', dF('12 km')] });
  }
  {
    // 6. Dos pasos: el recorrido con B más allá de C (ida y vuelta por el mismo tramo).
    const F = { objeto: 'carretera', combi: 1.6, puntos: [pto('A', 0), pto('C', 10), pto('B', 13)], tramos: [tr('A', 'C', '10 km'), tr('C', 'B', '3 km')] };
    const AC = pinta(F, 'AC'), CB = pinta(F, 'CB');
    EJ.push({ nivel: 2, titulo: 'El recorrido de la combi', figura: fig(F),
      enunciado: ['La combi va de A a C, pero antes pasa por B, que está 3 km más allá de C en la misma carretera. ', AC, ' = 10 km. ¿Cuántos kilómetros recorre en total?'],
      datos: [['C entre A y B: ', AC, ' + ', CB, ' = AB.'], ['Recorrido de A a C pasando por B: AB + ', CB, '.']],
      solucion: [
        { texto: 'Primero va de A a B, y en el camino pasa por C:', ecuacion: junto(['AB = ', AC, ' + ', CB, ' = 10 + 3 = 13 km']) },
        { texto: 'Después vuelve de B a C: otros 3 km.', ecuacion: junto(['AB + ', CB, ' = 13 + 3 = ', dF('16 km')]) },
      ],
      respuesta: ['Recorre ', dF('16 km')] });
  }
  {
    // 7. Unidades mezcladas: km y m.
    const F = { objeto: 'carretera', puntos: [pto('A', 0), pto('B', 1.5), pto('C', 2.4)], tramos: [tr('A', 'B', '?', 1, 'pide'), tr('B', 'C', '900 m'), tr('A', 'C', '2,4 km', -1, 'todo')] };
    const BC = pinta(F, 'BC');
    EJ.push({ nivel: 2, titulo: 'Metros y kilómetros', figura: fig(F),
      enunciado: ['En una avenida recta, el paradero B está entre A y C. AC = 2,4 km y ', BC, ' = 900 m. ¿Cuántos metros mide AB?'],
      datos: ['1 km = 1000 m', ['B entre A y C: AB + ', BC, ' = AC.']],
      solucion: [
        { texto: 'Primero paso AC a metros, para restar en la misma unidad:', ecuacion: junto(['AC = 2,4 · 1000 m = 2400 m']) },
        { texto: ['B está entre A y C: a AC le quito ', BC, '.'], ecuacion: junto(['AB = 2400 − 900 = ', dF('1500 m')]) },
      ],
      respuesta: ['AB = ', dF('1500 m')] });
  }
  {
    // 8. Dos pasos: cuatro paraderos, el tramo del medio.
    const F = { objeto: 'carretera', puntos: [pto('A', 0), pto('B', 3), pto('C', 8), pto('D', 12)], tramos: [tr('A', 'B', '3 km'), tr('C', 'D', '4 km'), tr('B', 'C', '?', 2, 'pide'), tr('A', 'D', '12 km', -1, 'todo')] };
    const AB = pinta(F, 'AB'), CD = pinta(F, 'CD');
    EJ.push({ nivel: 2, titulo: 'Cuatro paraderos', figura: fig(F),
      enunciado: ['A, B, C y D son paraderos de una carretera recta, en ese orden. ', AB, ' = 3 km, ', CD, ' = 4 km y AD = 12 km. ¿Cuánto mide BC?'],
      datos: [['Con puntos en orden, cada medida es la suma de sus tramos: AD = ', AB, ' + BC + ', CD, '.']],
      solucion: [
        { texto: ['AD está hecho de tres tramos: ', AB, ', BC y ', CD, '.'], ecuacion: junto(['3 + BC + 4 = 12']) },
        { texto: 'A los 12 km les quito los dos tramos que conozco:', ecuacion: junto(['BC = 12 − 3 − 4 = ', dF('5 km')]) },
      ],
      respuesta: ['BC = ', dF('5 km')] });
  }
  {
    // 9. Dos pasos: dos tramos que se pisan.
    const F = { objeto: 'carretera', puntos: [pto('A', 0), pto('B', 4), pto('C', 9), pto('D', 15)], tramos: [tr('B', 'C', '?', 1, 'pide'), tr('A', 'C', '9 km', 2), tr('B', 'D', '11 km', 3), tr('A', 'D', '15 km', -1, 'todo')] };
    const AC = pinta(F, 'AC'), BD = pinta(F, 'BD');
    EJ.push({ nivel: 2, titulo: 'Dos tramos que se pisan', figura: fig(F),
      enunciado: ['A, B, C y D están en ese orden en una carretera recta. ', AC, ' = 9 km, ', BD, ' = 11 km y AD = 15 km. ¿Cuánto mide BC?'],
      datos: [dOrden(F)],
      solucion: [
        { texto: [AC, ' y ', BD, ' juntos cubren de A a D, y los dos traen BC: BC queda contado dos veces.'], ecuacion: junto([AC, ' + ', BD, ' = AD + BC']) },
        { texto: 'Le quito AD a la suma:', ecuacion: junto(['BC = 9 + 11 − 15 = ', dF('5 km')]) },
      ],
      respuesta: ['BC = ', dF('5 km')] });
  }
  {
    // 10. Dos pasos: la razón con k.
    const F = { objeto: 'carretera', puntos: [pto('A', 0), pto('B', 8), pto('C', 20)], tramos: [tr('A', 'B', '2k'), tr('B', 'C', '3k'), tr('A', 'C', '20 km', -1, 'todo')] };
    const AB = pinta(F, 'AB'), BC = pinta(F, 'BC');
    EJ.push({ nivel: 2, titulo: 'La razón 2 : 3', figura: fig(F),
      enunciado: ['B está entre A y C en una carretera recta, con ', AB, ' : ', BC, ' = 2 : 3 y AC = 20 km. ¿Cuánto mide ', BC, '?'],
      datos: [D_RAZON(AB, BC, 2, 3), ['B entre A y C: ', AB, ' + ', BC, ' = AC.']],
      solucion: [
        { texto: 'Los dos tramos juntan 2 + 3 = 5 partes iguales, que hacen AC:', ecuacion: [junto('2k + 3k = 20 km'), '   →   ', junto('5k = 20 km'), '   →   ', junto('k = 4 km')] },
        { texto: [BC, ' tiene 3 de esas partes:'], ecuacion: junto([BC, ' = 3 · 4 km = ', dF('12 km')]) },
      ],
      respuesta: [BC, ' = ', dF('12 km')] });
  }
  {
    // 11. Examen: un tramo es el doble de otro.
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('B', 3), pto('C', 14), pto('D', 20)], tramos: [tr('B', 'C', '?', 1, 'pide'), tr('A', 'C', '14 cm', 2), tr('B', 'D', '17 cm', 3)] };
    const AC = pinta(F, 'AC'), BD = pinta(F, 'BD');
    EJ.push({ nivel: 3, titulo: 'CD es el doble de AB', figura: fig(F),
      enunciado: ['A, B, C y D están en ese orden sobre una recta. ', AC, ' = 14 cm, ', BD, ' = 17 cm y CD mide el doble de AB. ¿Cuánto mide BC?'],
      datos: [['Con puntos en orden, cada medida es la suma de sus tramos: ', AC, ' = AB + BC y ', BD, ' = BC + CD.']],
      solucion: [
        { texto: 'Llamo x a AB; entonces CD = 2x. Los dos datos quedan así:', ecuacion: [junto(['x + BC = 14']), SEP, junto(['BC + 2x = 17'])] },
        { texto: 'Resto la primera de la segunda: BC se cancela y queda x.', ecuacion: [junto('2x − x = 17 − 14'), '   →   ', junto('x = 3 cm')] },
        { texto: 'Vuelvo a la primera:', ecuacion: junto(['BC = 14 − 3 = ', dF('11 cm')]) },
      ],
      respuesta: ['BC = ', dF('11 cm')] });
  }
  {
    // 12. Examen: solo se conoce la suma de los que se pisan (el error típico es partirla entre dos).
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('B', 5), pto('C', 14), pto('D', 21)], tramos: [tr('B', 'C', '?', 1, 'pide'), tr('A', 'C', 'AC', 2), tr('B', 'D', 'BD', 3), tr('A', 'D', '21 cm', -1, 'todo')] };
    const AC = pinta(F, 'AC'), BD = pinta(F, 'BD');
    EJ.push({ nivel: 3, titulo: 'Solo se sabe la suma', figura: fig(F),
      enunciado: ['A, B, C y D están en ese orden sobre una recta. ', AC, ' + ', BD, ' = 30 cm y AD = 21 cm. ¿Cuánto mide BC?'],
      datos: [dOrden(F)],
      solucion: [
        { texto: [AC, ' y ', BD, ' juntos cubren AD una vez y BC una vez más.'], ecuacion: junto([AC, ' + ', BD, ' = AD + BC']) },
        { texto: 'Reemplazo y despejo:', ecuacion: junto(['30 = 21 + BC   →   BC = ', dF('9 cm')]) },
        { texto: ['Partir 30 cm entre dos daría 15 cm: es el error típico. ', AC, ' y ', BD, ' no tienen por qué medir igual.'] },
      ],
      respuesta: ['BC = ', dF('9 cm')] });
  }
  {
    // 13. Examen: razón y diferencia.
    const F = { objeto: 'carretera', puntos: [pto('A', 0), pto('B', 12), pto('C', 32)], tramos: [tr('A', 'B', '3k'), tr('B', 'C', '5k'), tr('A', 'C', '?', -1, 'pide')] };
    const AB = pinta(F, 'AB'), BC = pinta(F, 'BC');
    EJ.push({ nivel: 3, titulo: 'Razón y diferencia', figura: fig(F),
      enunciado: ['En una avenida recta, el paradero B está entre A y C. ', AB, ' : ', BC, ' = 3 : 5, y ', BC, ' mide 8 m más que ', AB, '. ¿Cuánto mide AC?'],
      datos: [D_RAZON(AB, BC, 3, 5), ['B entre A y C: ', AB, ' + ', BC, ' = AC.']],
      solucion: [
        { texto: [BC, ' tiene 2 partes más que ', AB, ', y esas 2 partes miden 8 m:'], ecuacion: [junto('5k − 3k = 8 m'), '   →   ', junto('2k = 8 m'), '   →   ', junto('k = 4 m')] },
        { texto: 'AC junta 3 + 5 = 8 partes:', ecuacion: junto(['AC = 8 · 4 m = ', dF('32 m')]) },
      ],
      respuesta: ['AC = ', dF('32 m')] });
  }
  {
    // 14. Examen: sin el orden, dos respuestas (la trampa es dar solo una).
    const F = { objeto: 'recta', vista: [-6, 18], puntos: [pto('A', 0), pto('B', 12)], tramos: [tr('A', 'B', '12 cm')] };
    const AB = pinta(F, 'AB'), BC = dI('BC');
    EJ.push({ nivel: 3, titulo: 'Dos lugares posibles', figura: fig(F),
      enunciado: ['En una recta están A, B y C, pero no se sabe en qué orden. ', AB, ' = 12 cm y ', BC, ' = 5\u00a0cm. ¿Cuánto puede medir AC?'],
      datos: [D_ENTRE],
      solucion: [
        { texto: ['C está a 5 cm de B, de un lado o del otro. A no puede ir en medio: ', AB, ' ya pasa de ', BC, '.'] },
        { texto: 'Si C está entre A y B:', ecuacion: junto(['AC = ', AB, ' − ', BC, ' = 12 − 5 = ', dF('7 cm')]) },
        { texto: 'Si B está entre A y C:', ecuacion: junto(['AC = ', AB, ' + ', BC, ' = 12 + 5 = ', dF('17 cm')]) },
      ],
      respuesta: ['AC = ', dF('7 cm'), ' o ', dF('17 cm')] });
  }
  {
    // 15. Examen: tres tramos en razón. Ningún tramo va en color: se piden AC y BD, y los tres de la razón no se dan.
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('B', 6), pto('C', 18), pto('D', 36)], tramos: [tr('A', 'C', 'AC = ?', 1, 'pide'), tr('B', 'D', 'BD = ?', 2, 'pide'), tr('A', 'D', '36 m', -1, 'todo')] };
    EJ.push({ nivel: 3, titulo: 'Tres tramos en razón', figura: fig(F),
      enunciado: 'A, B, C y D están en ese orden sobre una recta, con AB : BC : CD = 1 : 2 : 3 y AD = 36 m. ¿Cuánto vale AC + BD?',
      datos: ['Razón a : b : c entre tres tramos: miden a·k, b·k y c·k, con k la medida de una parte.', dOrden(F)],
      solucion: [
        { texto: 'Los tres tramos juntan 1 + 2 + 3 = 6 partes, que hacen AD:', ecuacion: [junto('6k = 36 m'), '   →   ', junto('k = 6 m')] },
        { texto: 'Entonces AB = 6 m, BC = 12 m y CD = 18 m.', ecuacion: [junto(['AC = 6 + 12 = 18 m']), SEP, junto(['BD = 12 + 18 = 30 m'])] },
        { texto: 'Sumo las dos medidas:', ecuacion: junto(['AC + BD = 18 + 30 = ', dF('48 m')]) },
      ],
      respuesta: ['AC + BD = ', dF('48 m')] });
  }

  // «Así se resuelve» y «Ahora tú»: lugares y unidades (km en la carretera; metros en la avenida, de 100 en 100).
  const LUGARES = [{ lugar: 'una carretera recta', u: 'km', k: 1 }, { lugar: 'una avenida recta', u: 'm', k: 100 }];
  const cuatro = (a, b, c) => [pto('A', 0), pto('B', a), pto('C', a + b), pto('D', a + b + c)];

  // «Ahora tú», tipo 0: qué paradero está entre los otros dos (sin figura ni colores: dirían la respuesta).
  const LETRAS = [['A', 'B', 'C'], ['P', 'Q', 'R'], ['M', 'N', 'T']];
  function casoEntre(r) {
    const ls = r.de(LETRAS), orden = r.de([[0, 1, 2], [1, 0, 2], [0, 2, 1]]);   // quién va en medio: ls[orden[1]]
    const Y = ls[orden[0]], X = ls[orden[1]], Z = ls[orden[2]];
    const p = r.ent(2, 9), q0 = r.ent(2, 9), q = q0 === p ? p + 1 : q0;
    const dist = { [Y + X]: p, [X + Y]: p, [X + Z]: q, [Z + X]: q, [Y + Z]: p + q, [Z + Y]: p + q };
    const [L1, L2, L3] = ls, mayor = [Y, Z].sort().join('');
    const ops = [{ id: 'c', texto: `El paradero ${X}`, correcta: true }];
    for (const L of ls) if (L !== X) {
      ops.push(L === L2
        ? { id: `l${L}`, texto: `El paradero ${L}`, error: 'GE-SEG8', siFuera: 'Su letra va en medio, es cierto; pero el orden de los paraderos lo dicen las medidas, no las letras.' }
        : { id: `l${L}`, texto: `El paradero ${L}`, error: 'GE-SEG7', siFuera: `Buscar el tramo más largo está bien: es ${mayor}. Pero ${L} es una de sus puntas.` });
    }
    ops.push({ id: 'ninguno', texto: 'Ninguno de los tres', error: 'GE-SEG9', siFuera: 'Sin el orden dicho parece imposible; pero las tres medidas lo deciden: dos tramos suman el tercero.' });
    return {
      pregunta: `En una carretera recta hay tres paraderos, ${L1}, ${L2} y ${L3}. ${L1}${L2} = ${dist[L1 + L2]} km, ${L2}${L3} = ${dist[L2 + L3]} km y ${L1}${L3} = ${dist[L1 + L3]} km. ¿Cuál está entre los otros dos?`,
      datos: [D_ENTRE],
      opciones: ops,
      solucion: { texto: `El más largo, ${mayor} = ${p + q} km, va de punta a punta; ${X} queda en medio: ${p} + ${q} = ${p + q}.` },
    };
  }
  // «Ahora tú», tipo 1: dos tramos que se pisan (AC y BD) y la medida de punta a punta.
  function casoPisan(r) {
    const L = r.de(LUGARES), a = r.ent(2, 9), b = r.ent(2, 9), c = r.ent(2, 9), p = a + b, q = b + c, t = a + b + c, u = L.u, K = L.k;
    const F = { objeto: 'carretera', puntos: cuatro(a, b, c), tramos: [tr('B', 'C', '?', 1, 'pide'), tr('A', 'C', km(p * K, u), 2), tr('B', 'D', km(q * K, u), 3), tr('A', 'D', km(t * K, u), -1, 'todo')] };
    const AC = pinta(F, 'AC'), BD = pinta(F, 'BD');
    return {
      pregunta: [`A, B, C y D están en ese orden en ${L.lugar}. `, AC, ` = ${km(p * K, u)}, `, BD, ` = ${km(q * K, u)} y AD = ${km(t * K, u)}. ¿Cuánto mide BC?`],
      datos: [dOrden(F)],
      dibujo: { datos: F, estado: {} },
      opciones: opciones(b * K, [
        { id: 'doble', valor: (p + q) * K, error: 'GE-SEG4', siFuera: 'Sumar AC y BD tiene sentido; pero así BC queda contado dos veces.' },
        { id: 'cd', valor: (t - p) * K, error: 'GE-SEG5', siFuera: 'AD − AC sí es una resta válida: da CD, no BC.' },
        { id: 'mitad', valor: (p + q) * K / 2, error: 'GE-SEG11', siFuera: 'Partir la suma entre dos serviría si AC y BD no se pisaran.' },
      ], x => km(x, u)),
      solucion: { texto: [AC, ' y ', BD, ' juntos cubren AD y repiten BC: a su suma le quito AD.'], ecuacion: [junto([AC, ' + ', BD, ' − AD']), ' ', junto(`= ${f(p * K)} + ${f(q * K)} − ${f(t * K)}`), ' ', junto(['= ', dF(km(b * K, u))])] },
    };
  }
  // «Ahora tú», tipo 2: la razón con k (se pide una de las dos partes).
  const RAZONES = [[2, 3], [3, 2], [1, 3], [3, 4], [2, 5], [4, 3], [3, 5], [5, 2]];
  function casoRazon(r) {
    const L = r.de(LUGARES), [m, n] = r.de(RAZONES), k = r.ent(2, 6), u = L.u, K = L.k, t = (m + n) * k, pideAB = r() < 0.5;
    const F = { objeto: 'carretera', puntos: [pto('A', 0), pto('B', m * k), pto('C', t)], tramos: [tr('A', 'B', `${m}k`), tr('B', 'C', `${n}k`), tr('A', 'C', km(t * K, u), -1, 'todo')] };
    const AB = pinta(F, 'AB'), BC = pinta(F, 'BC'), X = pideAB ? AB : BC, partes = pideAB ? m : n, otras = pideAB ? n : m;
    return {
      pregunta: [`En ${L.lugar}, B está entre A y C, con `, AB, ' : ', BC, ` = ${m} : ${n} y AC = ${km(t * K, u)}. ¿Cuánto mide `, X, '?'],
      datos: [D_RAZON(AB, BC, m, n), ['B entre A y C: ', AB, ' + ', BC, ' = AC.']],
      dibujo: { datos: F, estado: {} },
      opciones: opciones(partes * k * K, [
        { id: 'otra', valor: otras * k * K, error: 'GE-RAZ1', siFuera: 'Repartir AC en partes está bien; pero esa medida es del otro tramo.' },
        { id: 'k', valor: k * K, error: 'GE-RAZ2', siFuera: `Hallar k está bien: es una sola parte. El tramo tiene ${partes} partes.` },
        { id: 'resta', valor: (t - otras) * K, error: 'GE-RAZ3', siFuera: `Quitar algo a AC tiene sentido; pero ${otras} cuenta partes, no ${u}.` },
      ], x => km(x, u)),
      solucion: { texto: `AC junta ${m} + ${n} = ${m + n} partes: k = ${km(t * K, u)} ÷ ${m + n} = ${km(k * K, u)}. El tramo tiene ${partes} partes.`, ecuacion: junto([X, ` = ${partes} · ${km(k * K, u)} = `, dF(km(partes * k * K, u))]) },
    };
  }
  // «Ahora tú», tipo 3 (examen): o solo se sabe la suma de los que se pisan, o un tramo es el doble de otro.
  function casoExamen(r) {
    if (r() < 0.5) {
      const a = r.ent(2, 12), b = r.ent(2, 12), c = r.ent(2, 12), s = 2 * b + a + c, t = a + b + c;
      const F = { objeto: 'recta', puntos: cuatro(a, b, c), tramos: [tr('B', 'C', '?', 1, 'pide'), tr('A', 'C', 'AC', 2), tr('B', 'D', 'BD', 3), tr('A', 'D', `${t} cm`, -1, 'todo')] };
      const AC = pinta(F, 'AC'), BD = pinta(F, 'BD');
      return {
        pregunta: ['A, B, C y D están en ese orden sobre una recta. ', AC, ' + ', BD, ` = ${s} cm y AD = ${t} cm. ¿Cuánto mide BC?`],
        datos: [dOrden(F)],
        dibujo: { datos: F, estado: {} },
        opciones: opciones(b, [
          { id: 'mitad', valor: s / 2, error: 'GE-SEG11', siFuera: 'Partir la suma entre dos daría el promedio de AC y BD, no el tramo que comparten.' },
          { id: 'puntas', valor: 2 * t - s, error: 'GE-SEG5', siFuera: 'Esa resta es válida, pero da los dos extremos juntos, AB + CD, no BC.' },
          { id: 'media', valor: (s - t) / 2, error: 'GE-SEG12', siFuera: 'Restar AD a la suma está bien; lo que sobra ya es BC, sin partirlo.' },
        ], x => `${f(x)} cm`),
        solucion: { texto: [AC, ' + ', BD, ' cubre AD una vez y BC otra vez: le quito AD.'], ecuacion: junto(['BC = ', `${s} − ${t} = `, dF(`${b} cm`)]) },
      };
    }
    const a = r.ent(2, 6), b = r.ent(a + 1, a + 8), p = a + b, q = b + 2 * a;
    const F = { objeto: 'recta', puntos: cuatro(a, b, 2 * a), tramos: [tr('B', 'C', '?', 1, 'pide'), tr('A', 'C', `${p} cm`, 2), tr('B', 'D', `${q} cm`, 3)] };
    const AC = pinta(F, 'AC'), BD = pinta(F, 'BD');
    return {
      pregunta: ['A, B, C y D están en ese orden sobre una recta. ', AC, ` = ${p} cm, `, BD, ` = ${q} cm y CD mide el doble de AB. ¿Cuánto mide BC?`],
      datos: [['Con puntos en orden, cada medida es la suma de sus tramos: ', AC, ' = AB + BC y ', BD, ' = BC + CD.']],
      dibujo: { datos: F, estado: {} },
      opciones: opciones(b, [
        { id: 'ab', valor: q - p, error: 'GE-SEG5', siFuera: 'BD − AC está bien planteado: da CD − AB, que aquí es AB, no BC.' },
        { id: 'mitad', valor: (p + q) / 2, error: 'GE-SEG11', siFuera: 'El promedio de AC y BD serviría si AB y CD midieran igual.' },
        { id: 'cd', valor: b - a, error: 'GE-SEG14', siFuera: 'Quitarle un tramo a AC está bien; pero se le quita AB, no CD.' },
      ], x => `${f(x)} cm`),
      solucion: { texto: ['Con AB = x y CD = 2x: ', BD, ' − ', AC, ` = x, así que AB = ${q} − ${p} = ${a} cm.`], ecuacion: junto(['BC = ', `${p} − ${a} = `, dF(`${b} cm`)]) },
    };
  }

  const suma = {
    id: 'suma-de-segmentos',
    titulo: 'Suma de segmentos',
    pregunta: '¿Cuándo el camino de A a C pasando por B mide lo mismo que AC?',
    temas: ['Punto, recta y plano', 'Segmentos y su medida'],
    pieza: GO,
    aprendizaje: 'AB + BC = AC solo si B está entre A y C; si B queda fuera, el camino por B es más largo.',
    actividad: 'Mover un paradero por la carretera y comparar el recorrido de la combi con AC.',
    // Lee: punto, recta, plano, segmento y «entre», con la carretera. No dice qué pasa con la suma (eso es el juego) ni con
    // B fuera de la carretera (eso es «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Una carretera recta', texto: 'Mira el mapa: una carretera recta con tres paraderos, A, B y C. Cada paradero es un punto: un lugar exacto, sin tamaño. La carretera hace de recta, y la hoja del mapa es un plano. Por dos puntos pasa una sola recta.',
          pieza: GO, dibujo: { datos: { objeto: 'carretera', combi: 2, puntos: [pto('A', 0), pto('B', 4), pto('C', 10)] }, estado: {} } },
        { titulo: 'Segmento y su medida', texto: ['El tramo de carretera entre dos paraderos es un segmento. Se nombra con sus puntos: ', AB1, ' va de A a B. Su medida es lo que recorre la combi en ese tramo: ', AB1, ' = 4 km. ', AB1, ' nombra el segmento y también su medida.'],
          pieza: GO, dibujo: { datos: { objeto: 'carretera', puntos: [pto('A', 0), pto('B', 4), pto('C', 10)], tramos: [tr('A', 'B', '4 km')] }, estado: {} } },
        { titulo: 'Qué quiere decir «entre»', texto: 'B está entre A y C cuando está en la recta AC y en el tramo que va de A a C. Si B estuviera en la carretera, pero más allá de C, el paradero del medio sería C: C quedaría entre A y B.' },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a mover el paradero B por la carretera, también antes de A y más allá de C. Compara el recorrido de la combi, ', AB1, ' + ', BC1, ', con AC = 10 km.'] },
      ],
    },
    ejemplos: EJ,
    juega: {
      pieza: GO,
      consigna: 'De A a C hay 10 km por una carretera recta. La combi sale de A, pasa por el paradero B y termina en C.',
      mision: {
        texto: 'Pon B donde el recorrido de A a C, pasando por B, mida 14 km.',
        logrado: v => Math.abs(v.bx) + Math.abs(10 - v.bx) === 14,
        bien: 'Listo: 14 km, con B fuera del tramo AC. Entre A y C daba 10 km.',
      },
      voz: '¿Dónde tiene que estar B para que la combi recorra más?',
      leyenda: [
        { s: 'A, B, C', t: 'paraderos; B se mueve' },
        { s: dO('naranja'), t: 'AB: tramo de A a B' },
        { s: dI('turquesa'), t: 'BC: tramo de B a C' },
        { s: 'AC', t: 'de A a C, directo por la carretera' },
        { s: 'km', t: 'kilómetro: 1000 m' },
      ],
      controles: [{ id: 'bx', etiqueta: 'Kilómetro de B (A en el 0)', min: -2, max: 12, paso: 1, inicio: 4, unidad: 'km', decimales: 0 }],
      dibujo: v => ({ datos: figJ(v.bx), estado: {} }),
      // Gesto directo: el paradero B se agarra y se corre por la carretera; la vista es fija, así que sigue al dedo.
      arrastres: [{ id: 'paradero-b', etiqueta: 'paradero B: se corre por la carretera',
        donde: v => { const p = PO.geometria(figJ(v.bx)).P.B; return { x: p[0], y: p[1] }; },
        mover: (pt, v) => ({ bx: PO.geometria(figJ(v.bx)).km(pt.x) }) }],
      // La relación, sin «·» entre dos igualdades.
      lectura: v => {
        const a = Math.abs(v.bx), b = Math.abs(10 - v.bx);
        return v.bx >= 0 && v.bx <= 10 ? [AB1, ' + ', BC1, ` = ${a} + ${b} = 10 km: igual a AC`]
          : [AB1, ' + ', BC1, ` = ${a} + ${b} = ${a + b} km: más que AC = 10 km`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Otro día, el paradero B queda fuera de la carretera, y la combi va de A a B y de B a C por caminos rectos. ¿Cuánto recorre de A a C pasando por B?',
      datos: ['De A a C por la carretera: 10 km', 'B está a 3 km de la carretera, frente al kilómetro 4'],
      voz: 'Piensa en el camino de la combi, no solo en los 3 km.',
      opciones: [
        { id: 'c', texto: 'Más de 10 km, pero menos de 13 km', correcta: true },
        { id: 'igual', texto: 'Exactamente 10 km: B sigue entre A y C', error: 'GE-SEG1', siFuera: '10 km sería cierto con B en la carretera, entre A y C. Fuera de ella, el camino rodea.' },
        { id: 'suma', texto: 'Exactamente 13 km: los 10 km más los 3 del desvío', error: 'GE-SEG2', siFuera: 'Que el desvío alarga el viaje está bien. Pero cada camino va inclinado: los 3 km no se suben aparte.' },
        { id: 'atajo', texto: 'Menos de 10 km: el desvío acorta', error: 'GE-SEG6', siFuera: 'Un desvío puede ahorrar tráfico, pero no distancia: el camino directo de A a C es el más corto.' },
      ],
      dibujo: { datos: figP(), estado: {} },
      revelar: { datos: figP({ ab: largo(dAB), bc: largo(dBC), nota: `${f(dAB, 1)} + ${f(dBC, 1)} ≈ ${f(dAB + dBC, 1)} km` }), estado: {} },
      coincide: `Coincide: ${f(dAB, 1)} + ${f(dBC, 1)} ≈ ${f(dAB + dBC, 1)} km. El rodeo pasa de los 10 km de AC, pero no llega a 13.`,
      noCoincide: `Revisemos: medidos con la regla del mapa, los dos caminos suman unos ${f(dAB + dBC, 1)} km.`,
    },
    mira: {
      pieza: GO,
      datos: figP({ reglas: [{ de: 'A', a: 'B', texto: largo(dAB), paso: 1 }, { de: 'B', a: 'C', texto: largo(dBC), paso: 2 }] }),
      voz: 'Avanza paso a paso: la regla del mapa mide cada camino.',
      pasos: [
        { estado: { paso: 0 }, texto: 'La combi va de A a B y luego a C, en línea recta.' },
        { estado: { paso: 1 }, texto: 'La regla del mapa mide el primer camino.', ecuacion: junto([AB1, ` = ${largo(dAB)}`]) },
        { estado: { paso: 2 }, texto: 'Y el segundo, un poco más largo.', ecuacion: junto([BC1, ` ${largo(dBC)}`]) },
        { estado: { paso: 2 }, texto: 'Juntos pasan de los 10 km de AC: el rodeo alarga el viaje.', ecuacion: [junto([AB1, ' + ', BC1, ` ≈ ${f(dAB, 1)} + ${f(dBC, 1)} = ${f(dAB + dBC, 1)} km`]), ' ', junto('> 10 km = AC')] },
        { estado: { paso: 2 }, texto: 'El 13 suma los 3 km aparte; pero cada camino sube mientras avanza.', ecuacion: junto([`${f(dAB + dBC, 1)} km < 13 km = 10 km + 3 km`]) },
        { estado: { paso: 2 }, texto: 'Solo con B en la carretera, entre A y C, desaparece el rodeo.', ecuacion: junto([AB1, ' + ', BC1, ' = AC']) },
      ],
    },
    regla: {
      texto: 'Si B está en el segmento AC, AB + BC = AC; fuera de él, AB + BC es mayor. Con puntos en orden, cada medida suma sus tramos.',
      ecuacion: [junto(['B entre A y C: ', AB1, ' + ', BC1, ' = AC']), SEP, junto(['B fuera: ', AB1, ' + ', BC1, ' > AC'])],
      condicion: 'B está entre A y C cuando está en la recta AC y en el tramo de A a C.',
      voz: 'El dibujo sugiere; «entre A y C» lo garantiza.',
    },
    // Así se resuelve: cuatro paraderos en orden y el tramo del medio con dos restas. «Ahora tú» pide otras cosas: qué
    // punto está entre los otros, tramos que se pisan, la razón con k y dos de examen.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900), L = r.de(LUGARES), a = r.ent(3, 9), b = r.ent(3, 9), c = r.ent(3, 9), t = a + b + c, u = L.u, K = L.k;
        const F = { objeto: 'carretera', puntos: cuatro(a, b, c), tramos: [tr('A', 'B', km(a * K, u)), tr('C', 'D', km(c * K, u)), tr('B', 'C', '?', 2, 'pide'), tr('A', 'D', km(t * K, u), -1, 'todo')] };
        const AB = pinta(F, 'AB'), CD = pinta(F, 'CD');
        return {
          enunciado: [`En ${L.lugar} están los paraderos A, B, C y D, en ese orden. `, AB, ` = ${km(a * K, u)}, `, CD, ` = ${km(c * K, u)} y AD = ${km(t * K, u)}. ¿Cuánto mide BC?`],
          datos: [dOrden(F)],
          dibujo: { datos: F, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden BC, el tramo del medio, entre B y C.' },
            { tipo: 'datos', texto: ['Tengo los dos tramos de las puntas, ', AB, ' y ', CD, ', y AD, que va de punta a punta.'] },
            { tipo: 'regla', texto: 'Con los puntos en orden, la medida de punta a punta es la suma de sus tramos.', ecuacion: junto(['AD = ', AB, ' + BC + ', CD]) },
            { tipo: 'cuentas', texto: 'A AD le quito los dos tramos que conozco: lo que queda es BC.', ecuacion: [junto(`BC = ${f(t * K)} − ${f(a * K)} − ${f(c * K)}`), ' ', junto(['= ', dF(km(b * K, u))])] },
            { tipo: 'sentido', texto: `Compruebo: ${f(a * K)} + ${f(b * K)} + ${f(c * K)} = ${km(t * K, u)}, que es AD.` },
          ],
          respuesta: ['BC = ', dF(km(b * K, u))],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Ubica los puntos en orden antes de sumar o restar.',
      generar(s) {
        const r = azar(s + 31);
        return conCuatro([casoEntre, casoPisan, casoRazon, casoExamen][s % 4], r);
      },
    },
  };

  // Mesa «B fuera de la recta» del laboratorio (geo-figura): B libre en el plano. El todo, AC, en tinta (regla de la unidad).
  const AB = AB1, BC = BC1;
  const tramos = (bx, by = 0) => ({
    alt: `A y C a 10 cm; B en (${f(bx)}; ${f(by)}). AB más BC ${Math.abs(by) < 1e-9 && bx >= 0 && bx <= 10 ? 'es igual a' : 'es mayor que'} AC`,
    vista: { x: [-3, 13], y: [-1.4, 3.6] },
    puntos: [
      { id: 'A', x: 0, y: 0, rotulo: 'A', lado: -90 }, { id: 'C', x: 10, y: 0, rotulo: 'C', lado: -90 },
      { id: 'B', x: bx, y: by, rotulo: 'B', color: 'o', lado: by > 0 ? 90 : -90 },
      ...(by ? [] : [{ id: 'a1', x: 0, y: 0.9, sinPunto: true }, { id: 'b1', x: bx, y: 0.9, sinPunto: true },
        { id: 'b2', x: bx, y: 1.9, sinPunto: true }, { id: 'c2', x: 10, y: 1.9, sinPunto: true }]),
      { id: 'a3', x: 0, y: -0.9, sinPunto: true }, { id: 'c3', x: 10, y: -0.9, sinPunto: true },
    ],
    segmentos: [
      { de: 'A', a: 'C', recta: true, grosor: 'fino' },
      ...(by ? [{ de: 'A', a: 'B', color: 'o', grosor: 'variable' }, { de: 'B', a: 'C', color: 'i', grosor: 'variable' }]
        : [{ de: 'a1', a: 'b1', color: 'o', grosor: 'variable', texto: `${f(Math.abs(bx))} cm` },
          { de: 'b2', a: 'c2', color: 'i', grosor: 'variable', texto: `${f(Math.abs(10 - bx))} cm` }]),
      { de: 'a3', a: 'c3', texto: 'AC = 10 cm' },
    ],
  });

  // ---------- Idea 2: el ángulo mide la abertura, no el largo de sus lados ----------
  // Cambia: la abertura del ángulo · Permanece: el largo de los lados y el vértice · Progresa: la clase (agudo → llano → no convexo) ·
  // Se reserva: dos ángulos con lados de largos distintos · Debe verse: al alargar un lado, los grados no cambian.
  const CLASES = [[0, 0, 'nulo'], [0, 90, 'agudo'], [90, 90, 'recto'], [90, 180, 'obtuso'], [180, 180, 'llano'], [180, 360, 'no convexo']];
  const clase = g => (g === 0 ? 'nulo' : g < 90 ? 'agudo' : g === 90 ? 'recto' : g < 180 ? 'obtuso' : g === 180 ? 'llano' : 'no convexo');
  const abertura = g => ({
    alt: `Ángulo AOB de ${g}°: ${clase(g)}`,
    vista: { x: [-3.6, 3.6], y: [-3.4, 3.6] },
    puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: g > 180 ? g / 2 + 180 : g > 0 && g < 180 ? -120 : 135 }, { id: 'A', x: 3, y: 0, rotulo: 'A', lado: -90 },
      { id: 'B', x: 3 * Math.cos(U.rad(g)), y: 3 * Math.sin(U.rad(g)), rotulo: 'B', color: 'o', lado: g + 20 }],
    segmentos: [{ de: 'O', a: 'A' }, { de: 'O', a: 'B', color: 'o', grosor: 'variable' }],
    angulos: g > 0 ? [{ en: 'O', de: 'A', a: 'B', texto: `${g}°`, color: 'o', mayor: g > 180 }] : [],
  });
  const P1 = 40, Q1 = 65;
  const dosAngulos = (medidas, prolongar) => ({
    alt: medidas ? 'El ángulo P, de lados largos, mide 40°; el Q, de lados cortos, mide 65°' : 'Dos ángulos: P con lados largos y Q con lados cortos',
    vista: { x: [-0.6, 10.4], y: [-0.8, 4.4] },
    puntos: [
      { id: 'P', x: 0, y: 0, rotulo: 'P', lado: -120 }, { id: 'P1', x: 6, y: 0, sinPunto: true }, { id: 'P2', x: 6 * Math.cos(U.rad(P1)), y: 6 * Math.sin(U.rad(P1)), sinPunto: true },
      { id: 'Q', x: 7.6, y: 0, rotulo: 'Q', lado: -120 }, { id: 'Q1', x: 9.1, y: 0, sinPunto: true }, { id: 'Q2', x: 7.6 + 1.5 * Math.cos(U.rad(Q1)), y: 1.5 * Math.sin(U.rad(Q1)), sinPunto: true },
      { id: 'Q3', x: 10.2, y: 0, sinPunto: true }, { id: 'Q4', x: 7.6 + 4.2 * Math.cos(U.rad(Q1)), y: 4.2 * Math.sin(U.rad(Q1)), sinPunto: true },
    ],
    segmentos: [{ de: 'P', a: 'P1' }, { de: 'P', a: 'P2', color: 'i' }, { de: 'Q', a: 'Q1' }, { de: 'Q', a: 'Q2', color: 'o' },
      ...(prolongar ? [{ de: 'Q1', a: 'Q3', discontinua: true }, { de: 'Q2', a: 'Q4', color: 'o', discontinua: true, desde: prolongar }] : [])],
    angulos: medidas ? [{ en: 'P', de: 'P1', a: 'P2', texto: `${P1}°`, color: 'i', radio: 34, desde: medidas }, { en: 'Q', de: 'Q1', a: 'Q2', texto: `${Q1}°`, color: 'o', radio: 22, desde: medidas }] : [],
  });
  const aberturaIdea = {
    id: 'abertura',
    titulo: 'El ángulo mide la abertura',
    temas: ['Clases de ángulos'],
    pieza: 'geo-figura',
    // Lee (fase 2): partes del ángulo, grados y nombres. No dice si el largo de los lados cuenta (eso es «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Dos rayos y un vértice', texto: 'Un ángulo se forma con dos rayos que salen del mismo punto, el vértice. En ∠AOB, la letra del medio, O, es el vértice; OA y OB son sus lados.' },
        { titulo: 'Se mide en grados', texto: 'Una vuelta completa son 360°. Si giras en tu sitio hasta mirar al lado contrario, das media vuelta: 180°. En Juliaca, doblar en la esquina de dos calles que se cruzan derechas es un cuarto de vuelta: 90°.' },
        { titulo: 'Cada medida, un nombre', texto: 'Según cuántos grados mide, un ángulo es agudo, recto, obtuso, llano o no convexo. Al jugar, gira OB y fíjate en qué medida cambia el nombre.' },
      ],
    },
    juega: {
      consigna: 'Gira el lado OB. Mira cómo cambian la medida y el nombre del ángulo AOB, incluso cuando pasa de 180°.',
      voz: 'Gira OB y fíjate en el nombre que toma cada medida.',
      controles: [{ id: 'g', etiqueta: '∠AOB', min: 0, max: 330, paso: 15, inicio: 45, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: abertura(v.g), estado: {} }),
      // Se agarra la punta B del lado OB: gira alrededor de O (de 0° a 330°, contra el reloj desde OA).
      arrastres: [{ id: 'punta-b', etiqueta: 'punta B del lado OB', color: 'c-o',
        donde: v => enPantalla(abertura(v.g), U.polar([0, 0], 3, v.g)),
        mover: (pt, v) => { const g = giro360([0, 0], alPlano(abertura(v.g), pt)); return { g: g > 345 ? 0 : g }; } }],
      lectura: v => [{ v: 'c-o', t: '∠AOB' }, ` = ${v.g}°   ·   ${clase(v.g)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'El ángulo P tiene lados largos y el ángulo Q, lados cortos. ¿Cuál de los dos mide más?',
      voz: 'Antes de medir, decide qué mira la medida de un ángulo.',
      opciones: [
        { id: 'c', texto: 'Q, aunque sus lados sean cortos', correcta: true },
        { id: 'largo', texto: 'P, porque sus lados son más largos', error: 'GE-ANG1', siFuera: 'Los lados largos sí agrandan el dibujo. La medida del ángulo cuenta la abertura, no el largo.' },
        { id: 'iguales', texto: 'Miden lo mismo', error: 'GE-ANG2', siFuera: 'Serían iguales si sus aberturas coincidieran. Al prolongar los lados de Q, su abertura sigue siendo mayor.' },
      ],
      dibujo: { datos: dosAngulos(0, 0), estado: {} },
      revelar: { datos: dosAngulos(0.5, 0.5), estado: { corte: 1 } },
      coincide: 'Coincide: Q mide 65° y P, 40°. El largo de los lados no entra en la medida.',
    },
    // Hallazgo 9: «Mira» usa los dos ángulos de la predicción, no el de la bisagra del juego: la duda que resuelve
    // (¿cuenta el largo de los lados?) solo aparece al comparar dos ángulos.
    mira: {
      datos: dosAngulos(1, 2),
      voz: 'Compara aberturas. El largo de los lados queda fuera.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada ángulo se mide con el arco entre sus dos lados.', ecuacion: ['∠P = 40°', '   ·   ', { v: 'c-o', t: '∠Q' }, ' = 65°'] },
        { estado: { corte: 2 }, texto: 'Prolonga los lados de Q: la abertura no cambia.', ecuacion: [{ v: 'c-o', t: '∠Q' }, ' sigue en 65°'] },
        { estado: { corte: 2 }, texto: 'Los dos son agudos: miden más de 0° y menos de 90°.', ecuacion: ['0° < 40° < 65° < 90°'] },
      ],
    },
    regla: {
      texto: 'Un ángulo mide la abertura entre sus lados, no su largo. Es agudo si mide menos de 90°, recto con 90°, obtuso entre 90° y 180°, y llano con 180°.',
      condicion: 'los lados son rayos: prolongarlos no cambia la medida. Más de 180° es un ángulo no convexo.',
      voz: 'Al alargar los lados, la medida permanece. Esa es la clave.',
    },
    // Así se resuelve (fase 2): consecutivos que se suman y se nombran, como «Ahora tú», con la semilla s + 900.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), a = 5 * r.ent(3, 20), b = 5 * r.ent(2, 22), t = a + b, bien = clase(t);
        const at = aberturaIdea.ahoraTu.generar(s + 900);
        const ubica = { agudo: 'Queda por debajo de 90°: es agudo.', recto: 'Es justo 90°: es recto.', obtuso: 'Queda entre 90° y 180°: es obtuso.',
          llano: 'Es justo 180°: es llano.', 'no convexo': 'Pasa de 180°: es no convexo.' }[bien];
        return {
          enunciado: [`Los ángulos AOB = ${a}° y BOC = ${b}° son consecutivos: OB queda entre OA y OC. ¿Qué clase de ángulo es AOC?`],
          dibujo: at.dibujo,
          pasos: [
            { tipo: 'pide', texto: 'Piden la clase de ∠AOC: su nombre según cuántos grados mide.' },
            { tipo: 'datos', texto: `∠AOB mide ${a}° y ∠BOC mide ${b}°. Comparten el lado OB, que queda en medio.` },
            { tipo: 'regla', texto: 'Si OB está entre OA y OC, la abertura de AOC es la de los dos ángulos juntos. Después comparo el total con 90° y con 180°.' },
            { tipo: 'cuentas', texto: `Sumo las dos aberturas. ${ubica}`, ecuacion: [`∠AOC = ${a}° + ${b}° = ${t}°`], dibujo: at.solucion.dibujo },
            { tipo: 'sentido', texto: `Compruebo al revés: ${t}° − ${b}° = ${a}°, que es ∠AOB. La suma cuadra.` },
          ],
          respuesta: [`∠AOC = ${t}°: ${bien}`],
        };
      },
    },
    ahoraTu: {
      voz: 'Junta las dos aberturas y nombra el resultado.',
      generar(s) {
        const r = azar(s), a = 5 * r.ent(3, 20), b = 5 * r.ent(2, 22), giro = 15 * r.ent(0, 23), t = a + b;
        const p = g => [2.6 * Math.cos(U.rad(giro + g)), 2.6 * Math.sin(U.rad(giro + g))];
        const fig = sol => ({
          datos: {
            alt: `Ángulos consecutivos AOB de ${a}° y BOC de ${b}°${sol ? `; AOC mide ${t}°` : ''}`,
            vista: { x: [-3.4, 3.4], y: [-3.2, 3.2] },
            puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: giro + 180 + (a + b) / 2 }, { id: 'A', x: p(0)[0], y: p(0)[1], rotulo: 'A', lado: giro - 20 },
              { id: 'B', x: p(a)[0], y: p(a)[1], rotulo: 'B', lado: giro + a }, { id: 'C', x: p(t)[0], y: p(t)[1], rotulo: 'C', lado: giro + t + 20 }],
            segmentos: [{ de: 'O', a: 'A' }, { de: 'O', a: 'B', color: 'i' }, { de: 'O', a: 'C' }],
            angulos: [{ en: 'O', de: 'A', a: 'B', texto: `${a}°`, color: 'o', radio: 30 }, { en: 'O', de: 'B', a: 'C', texto: `${b}°`, color: 'i', radio: 30, mayor: b > 180 },
              ...(sol ? [{ en: 'O', de: 'A', a: 'C', color: 'h', radio: 46, mayor: t > 180 }] : [])],
          },
          estado: {},
        });
        const rango = { agudo: 'fuera menor que 90°', recto: 'fuera exactamente 90°', obtuso: 'estuviera entre 90° y 180°', llano: 'fuera exactamente 180°', 'no convexo': 'pasara de 180°' };
        const bien = clase(t);
        const nombres = ['agudo', 'recto', 'obtuso', 'llano', 'no convexo'];
        const ops = [{ id: 'c', texto: bien, correcta: true }];
        for (const n of nombres) if (n !== bien && ops.length < 4 && (Math.abs(nombres.indexOf(n) - nombres.indexOf(bien)) <= 2))
          ops.push({ id: n.replace(' ', '-'), texto: n, error: 'GE-ANG3', siFuera: `«${n}» sería el nombre si ${a}° + ${b}° ${rango[n]}.` });
        return {
          pregunta: [`Los ángulos AOB = ${a}° y BOC = ${b}° son consecutivos: OB queda entre OA y OC. ¿Qué clase de ángulo es AOC?`],
          dibujo: fig(false),
          opciones: ops,
          solucion: { texto: 'Las aberturas consecutivas se suman.', ecuacion: [`∠AOC = ${a}° + ${b}° = ${t}°: ${bien}`], dibujo: fig(true) },
        };
      },
    },
  };

  // ---------- Idea 3: bisectriz, complemento y suplemento ----------
  // Cambia: α y su suplemento β · Permanece: la recta AC y el vértice O · Progresa: las mitades α/2 y β/2 ·
  // Se reserva: las dos bisectrices juntas (90°) · Debe verse: las mitades suman la mitad de 180°.
  const al = { v: 'c-o', t: 'α' }, be = { v: 'c-i', t: 'β' }, x = { v: 'c-o', t: 'x' };
  const par = (a, bis, pasos) => {
    const A = [-3, 0], C = [3, 0], B = U.polar([0, 0], 3, a), M1 = U.polar([0, 0], 3, a / 2), M2 = U.polar([0, 0], 3, 90 + a / 2);
    const k = pasos || 0;
    return {
      alt: `α = ${a}° y su suplemento β = ${180 - a}° comparten el lado OB${bis ? '; sus bisectrices forman 90°' : ''}`,
      vista: { x: [-3.6, 3.6], y: [-0.6, 3.6] },
      puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: -90 }, { id: 'A', x: A[0], y: 0, rotulo: 'A', lado: -90 }, { id: 'C', x: C[0], y: 0, rotulo: 'C', lado: -90 },
        { id: 'B', x: B[0], y: B[1], rotulo: 'B', lado: a }, { id: 'M', x: M1[0], y: M1[1], sinPunto: true }, { id: 'N', x: M2[0], y: M2[1], sinPunto: true }],
      segmentos: [{ de: 'A', a: 'C' }, { de: 'O', a: 'B' },
        ...(bis ? [{ de: 'O', a: 'M', color: 'd', discontinua: true, desde: Math.min(k, 1) }, { de: 'O', a: 'N', color: 'd', discontinua: true, desde: Math.min(k, 2) }] : [])],
      angulos: bis
        ? [{ en: 'O', de: 'C', a: 'M', color: 'o', radio: 40, rayita: 1, texto: `${a / 2}°`, desde: Math.min(k, 1) }, { en: 'O', de: 'M', a: 'B', color: 'o', radio: 40, rayita: 1, desde: Math.min(k, 1) },
          { en: 'O', de: 'B', a: 'N', color: 'i', radio: 40, rayita: 2, desde: Math.min(k, 2) }, { en: 'O', de: 'N', a: 'A', color: 'i', radio: 40, rayita: 2, texto: `${(180 - a) / 2}°`, desde: Math.min(k, 2) },
          { en: 'O', de: 'M', a: 'N', color: 'h', texto: '90°', desde: Math.min(k, 3) }]
        : [{ en: 'O', de: 'C', a: 'B', color: 'o', texto: `${a}°`, radio: 30 }, { en: 'O', de: 'B', a: 'A', color: 'i', texto: `${180 - a}°`, radio: 24 }],
    };
  };
  const bisectriz = {
    id: 'bisectrices',
    titulo: 'Mitades que suman noventa',
    temas: ['Bisectriz', 'Ángulos complementarios y suplementarios'],
    pieza: 'geo-figura',
    // Lee (fase 2): complemento, suplemento y bisectriz. No dice qué forman las dos bisectrices (eso es «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Lo que falta para 90°', texto: 'En la esquina de una cancha de fulbito, las líneas forman 90°. Si una raya sale de esa esquina y abre 30° con un lado, al otro le quedan 60°. Esos 60° son el complemento de 30°.' },
        { titulo: 'Lo que falta para 180°', texto: 'Una recta es media vuelta: 180°. Si un rayo sale de un punto de la recta, la parte en dos ángulos. Lo que a uno le falta para llegar a 180° es su suplemento.' },
        { titulo: 'Partir en dos', texto: ['La bisectriz es el rayo que parte un ángulo en dos ángulos iguales. Al jugar, mueve ', al, ' y sigue a ', be, ': mira qué le pasa a uno cuando el otro crece.'] },
      ],
    },
    juega: {
      consigna: 'Cambia α. El ángulo β completa la recta AC. Observa qué le pasa a β cuando α crece.',
      voz: 'Mueve α y sigue a β: cambian juntos.',
      controles: [{ id: 'a', etiqueta: 'α', min: 20, max: 160, paso: 10, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: par(v.a, false), estado: {} }),
      // Se agarra la punta B del lado común OB: al girarla, α crece y β se achica.
      arrastres: [{ id: 'punta-b', etiqueta: 'punta B del lado común', color: 'c-o',
        donde: v => enPantalla(par(v.a, false), U.polar([0, 0], 3, v.a)),
        mover: (pt, v) => { const q = alPlano(par(v.a, false), pt); return { a: U.grados(Math.atan2(Math.max(q[1], 0), q[0])) }; } }],
      lectura: v => [al, ` = ${v.a}°   ·   `, be, ` = ${180 - v.a}°   ·   `, al, ' + ', be, ' = 180°'],
      minimo: 3,
    },
    predice: {
      pregunta: ['Con ', al, ' = 50°, trazamos la bisectriz de ', al, ' y la de ', be, '. ¿Qué ángulo forman las dos bisectrices?'],
      voz: 'Decide antes de trazar. Luego comprobamos con las mitades.',
      opciones: [
        { id: 'c', texto: '90°', correcta: true },
        { id: 'depende', texto: 'Depende de α', error: 'GE-BIS1', siFuera: 'Cada mitad sí cambia con α. Pero juntas son la mitad de 180°, para cualquier α.' },
        { id: 'llano', texto: '180°', error: 'GE-BIS2', siFuera: '180° es lo que suman α y β completos. Las bisectrices toman solo la mitad de cada uno.' },
        { id: 'alfa', texto: '50°', error: 'GE-BIS3', siFuera: '50° sería cierto si las bisectrices fueran los lados de α. Cada una parte su ángulo en dos.' },
      ],
      dibujo: { datos: par(50, false), estado: {} },
      revelar: { datos: par(50, true, 3), estado: { corte: 3 } },
      coincide: 'Coincide: 25° + 65° = 90°, la mitad de la recta.',
    },
    mira: {
      datos: par(50, true, 3),
      voz: 'Sigue las marcas: iguales dentro de cada ángulo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La bisectriz de α lo parte en dos ángulos iguales.', ecuacion: [{ frac: [al, '2'] }, ' = 25°'] },
        { estado: { corte: 2 }, texto: 'La bisectriz de β parte sus 130° en dos de 65°.', ecuacion: [{ frac: [be, '2'] }, ' = 65°'] },
        { estado: { corte: 3 }, texto: 'Entre las bisectrices quedan una mitad de cada ángulo.', ecuacion: [{ frac: [al, '2'] }, ' + ', { frac: [be, '2'] }, ' = ', { frac: [[al, ' + ', be], '2'] }, ' = ', { frac: ['180°', '2'] }, ' = 90°'] },
      ],
    },
    regla: {
      texto: 'La bisectriz divide un ángulo en dos iguales. Dos ángulos complementarios suman 90°; dos suplementarios, 180°. Las bisectrices de dos suplementarios adyacentes forman 90°.',
      ecuacion: [{ llave: ['C(', x, ')'], nota: 'complemento', color: 'c-o' }, ' = 90° − ', x, '   ·   ', { llave: ['S(', x, ')'], nota: 'suplemento', color: 'c-o' }, ' = 180° − ', x],
      condicion: 'el complemento existe si x < 90° y el suplemento si x < 180°; el resultado de 90° pide ángulos adyacentes.',
      voz: 'Deshaz las operaciones desde afuera hacia adentro.',
    },
    // Así se resuelve (fase 2): los tres tipos de «Ahora tú» (s % 3, y 900 es múltiplo de 3), con las mismas cuentas.
    // La figura es la del juego (par): x en naranja y su suplemento en turquesa; en las cuentas aparecen sus medidas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = s % 3;
        const fig = (v, medidas) => {
          const d = par(v, false);
          if (medidas) d.alt = `x = ${v}° y su suplemento, ${180 - v}°, comparten el lado OB sobre la recta AC`;
          else {
            d.alt = 'El ángulo x y su suplemento comparten el lado OB sobre la recta AC';
            d.angulos = d.angulos.map((an, i) => Object.assign({}, an, { texto: i === 0 ? 'x' : 'S(x)' }));
          }
          return { datos: d, estado: {} };
        };
        const restas = ['C(', x, ') = 90° − ', x, '   ·   S(', x, ') = 180° − ', x];
        const regla = { tipo: 'regla', texto: 'El complemento es lo que falta para 90°; el suplemento, lo que falta para 180°. Escribo cada uno como una resta.', ecuacion: restas };
        const pide = { tipo: 'pide', texto: ['Piden ', x, ', el ángulo del que parten las operaciones.'] };
        let v, enunciado, datos, cuentas, sentido;
        if (tipo === 0) {
          v = 5 * r.ent(2, 16); const k = 90 + v;
          enunciado = ['El suplemento del complemento de ', x, ` mide ${k}°. ¿Cuánto mide `, x, '?'];
          datos = `Primero se toma el complemento de x; después, el suplemento de ese resultado. Al final da ${k}°.`;
          cuentas = { texto: ['Pongo el complemento dentro del suplemento, simplifico y despejo ', x, '.'],
            ecuacion: ['180° − (90° − ', x, ') = 90° + ', x, ` = ${k}°  →  `, x, ` = ${v}°`] };
          sentido = `Compruebo: el complemento de ${v}° es ${90 - v}°, y el suplemento de ${90 - v}° es ${180 - (90 - v)}°. Cuadra.`;
        } else if (tipo === 1) {
          v = 5 * r.ent(2, 16); const k = 270 - 2 * v;
          enunciado = ['El complemento de ', x, ' más el suplemento de ', x, ` suman ${k}°. ¿Cuánto mide `, x, '?'];
          datos = `El complemento de x y el suplemento de x, juntos, suman ${k}°.`;
          cuentas = { texto: ['Sumo las dos restas: ', x, ' aparece dos veces, restando.'],
            ecuacion: ['270° − 2', x, ` = ${k}°  →  2`, x, ` = ${270 - k}°  →  `, x, ` = ${v}°`] };
          sentido = `Compruebo: el complemento de ${v}° es ${90 - v}° y el suplemento, ${180 - v}°. Suman ${(90 - v) + (180 - v)}°. Cuadra.`;
        } else {
          const m = r.de([3, 4, 7, 10]); v = (90 * m - 180) / (m - 1);
          enunciado = ['El suplemento de ', x, ` es ${m} veces su complemento. ¿Cuánto mide `, x, '?'];
          datos = `El suplemento de x es ${m} veces su complemento.`;
          cuentas = { texto: ['Escribo las dos restas, reparto el ', String(m), ' y despejo ', x, '.'],
            ecuacion: ['180° − ', x, ` = ${m}(90° − `, x, `)  →  ${m - 1}`, x, ` = ${90 * m - 180}°  →  `, x, ` = ${gr(v)}`] };
          sentido = `Compruebo: el suplemento de ${gr(v)} es ${gr(180 - v)} y el complemento, ${gr(90 - v)}. Y ${m} · ${gr(90 - v)} = ${gr(m * (90 - v))}. Cuadra.`;
        }
        return {
          enunciado,
          dibujo: fig(v, false),
          pasos: [pide, { tipo: 'datos', texto: datos }, regla,
            Object.assign({ tipo: 'cuentas', dibujo: fig(v, true) }, cuentas),
            { tipo: 'sentido', texto: sentido }],
          respuesta: [x, ` = ${gr(v)}`],
        };
      },
    },
    ahoraTu: {
      voz: 'Escribe cada operación como una resta y despeja.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const v = 5 * r.ent(2, 16), k = 90 + v;
          return {
            pregunta: ['El suplemento del complemento de ', x, ` mide ${k}°. ¿Cuánto mide `, x, '?'],
            opciones: opciones(v, [
              { id: 'solo-s', valor: 180 - k, error: 'GE-CS1', siFuera: `${180 - k}° deshace solo el suplemento. Falta deshacer el complemento.` },
              { id: 'orden', valor: k + 90, error: 'GE-CS2', siFuera: 'Eso sería si el complemento fuera la operación de afuera.' },
              { id: 'mitad', valor: k / 2, error: 'GE-CS3', siFuera: 'Dividir entre 2 serviría con una bisectriz; aquí hay dos restas.' },
            ], gr),
            solucion: { texto: 'S(C(x)) = 180° − (90° − x) = 90° + x.', ecuacion: ['90° + ', x, ` = ${k}° → `, x, ` = ${v}°`] },
          };
        }
        if (tipo === 1) {
          const v = 5 * r.ent(2, 16), k = 270 - 2 * v;
          return {
            pregunta: ['El complemento de ', x, ' más el suplemento de ', x, ` suman ${k}°. ¿Cuánto mide `, x, '?'],
            opciones: opciones(v, [
              { id: 'sin-2', valor: 270 - k, error: 'GE-CS4', siFuera: `Restar de 270° va bien, pero x aparece dos veces: 270° − 2x = ${k}°.` },
              { id: 'solo-c', valor: 90 - k / 2, error: 'GE-CS3', siFuera: 'Repartir la suma en mitades iguales serviría si el complemento y el suplemento midieran igual.' },
              { id: 'solo-s', valor: 180 - k / 2, error: 'GE-CS3', siFuera: 'Repartir la suma en mitades iguales serviría si el complemento y el suplemento midieran igual.' },
            ], gr),
            solucion: { texto: 'Suma las dos restas: (90° − x) + (180° − x).', ecuacion: ['270° − 2', x, ` = ${k}° → `, x, ` = ${v}°`] },
          };
        }
        const m = r.de([3, 4, 7, 10]), v = (90 * m - 180) / (m - 1);
        return {
          pregunta: ['El suplemento de ', x, ` es ${m} veces su complemento. ¿Cuánto mide `, x, '?'],
          opciones: opciones(v, [
            { id: 'al-reves', valor: (180 * m - 90) / (m - 1), error: 'GE-CS2', siFuera: `Eso pone el ${m} del lado del suplemento. El enunciado multiplica al complemento.` },
            { id: 'dividir', valor: 180 / m, error: 'GE-CS4', siFuera: `Dividir 180° entre ${m} olvida que el complemento también depende de x.` },
            { id: 'noventa', valor: 90 / m, error: 'GE-CS4', siFuera: `Dividir 90° entre ${m} olvida que el suplemento también depende de x.` },
          ], gr),
          solucion: { texto: 'Escribe las dos restas y despeja x.', ecuacion: ['180° − ', x, ` = ${m}(90° − `, x, `) → `, x, ` = ${gr(v)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: paralelas y una secante ----------
  // Cambia: la inclinación θ de la secante · Permanece: dos rectas paralelas · Progresa: qué pares son iguales y cuáles suman 180° ·
  // Se reserva: una recta que deja de ser paralela · Debe verse: la igualdad depende del paralelismo, no del aspecto.
  const th = { v: 'c-o', t: 'θ' };
  // Las medidas que la figura rotula: el naranja de abajo (en P), el de arriba (en Q) y el conjugado turquesa en Q.
  const medidasSecante = (t, giro = 0) => ({ abajo: t, arriba: t - giro, conjugado: 180 - t + giro });
  const secante = (t, o = {}) => {
    const giro = o.giro || 0, h = 2.4, m = medidasSecante(t, giro);
    const dx = h / Math.tan(U.rad(t)), P = [-dx / 2, 0], Q = [dx / 2, h];
    const up = U.polar(Q, 1.6, t), dn = U.polar(P, -1.6, t);
    const R = U.polar(Q, 3, giro), L = U.polar(Q, -3, giro);
    const e = o.etapa === undefined ? 9 : o.etapa;
    const txt = (v, k) => (o.textos === false ? undefined : (e >= k ? `${v}°` : undefined));
    const angs = [
      { en: 'P', de: 'Pd', a: 'Q', color: 'o', texto: txt(m.abajo, 0), radio: 24 },
      { en: 'Q', de: 'Qd', a: 'Qu', color: 'o', texto: txt(m.arriba, 1), radio: 24, desde: o.pasos ? 1 : 0 },
      { en: 'Q', de: 'Qi', a: 'P', color: 'o', texto: txt(m.arriba, 3), radio: 24, desde: o.pasos ? 3 : 0 },
      { en: 'Q', de: 'Qd', a: 'P', color: 'i', texto: txt(m.conjugado, 4), radio: 30, desde: o.pasos ? 4 : 0 },
    ];
    if (o.pasos) angs.splice(2, 0, { en: 'Q', de: 'Qi', a: 'Qb', color: 'o', texto: undefined, radio: 18, desde: 2 });
    return {
      alt: giro ? `La recta de arriba giró ${giro}°: los ángulos correspondientes miden ${t}° y ${t - giro}°` : `Paralelas cortadas por una secante de ${t}°: correspondientes y alternos internos de ${t}°, conjugados que suman 180°`,
      vista: { x: [-4, 4], y: [-1.4, 3.8] },
      puntos: [{ id: 'P', x: P[0], y: 0, rotulo: 'P', lado: -60 }, { id: 'Q', x: Q[0], y: Q[1], rotulo: 'Q', lado: 120 },
        { id: 'Pd', x: P[0] + 3, y: 0, sinPunto: true }, { id: 'Pi', x: P[0] - 3, y: 0, sinPunto: true }, { id: 'Qd', x: R[0], y: R[1], sinPunto: true }, { id: 'Qi', x: L[0], y: L[1], sinPunto: true },
        { id: 'Qu', x: up[0], y: up[1], sinPunto: true }, { id: 'Pb', x: dn[0], y: dn[1], sinPunto: true }, { id: 'Qb', x: Q[0] - Math.cos(U.rad(t)), y: Q[1] - Math.sin(U.rad(t)), sinPunto: true }],
      segmentos: [{ de: 'Pi', a: 'Pd', recta: true, paralela: giro ? 0 : 1 }, { de: 'Qi', a: 'Qd', recta: true, paralela: giro ? 0 : 1, color: giro ? 'h' : undefined }, { de: 'Pb', a: 'Qu', recta: true, grosor: 'fino' }],
      angulos: angs,
    };
  };
  // La secante pasa por el punto medio (0; 1,2) de PQ para todo θ: su punta Qu está a θ de ese centro.
  const arrastreSecante = dib => ({ id: 'secante', etiqueta: 'punta de la secante', color: 'c-o',
    donde: v => { const t = v.t, Q = [1.2 / Math.tan(U.rad(t)), 2.4]; return enPantalla(dib(t, v), U.polar(Q, 1.6, t)); },
    mover: (pt, v) => { const q = alPlano(dib(v.t, v), pt); return { t: U.grados(Math.atan2(Math.max(q[1] - 1.2, 0.01), q[0])) }; } });
  const paralelas = {
    id: 'paralelas',
    titulo: 'Paralelas: ángulos iguales y suplementarios',
    temas: ['Rectas paralelas y una secante'],
    pieza: 'geo-figura',
    // Lee (fase 2): paralelas, secante y los nombres de los pares. No dice qué pares son iguales ni qué pasa si una
    // recta gira (eso lo descubre al jugar y en «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Rieles que no se juntan', texto: 'Los rieles del tren que sale de Juliaca hacia Cusco van siempre a la misma distancia: nunca se cruzan. Dos rectas así, en el mismo plano, se llaman rectas paralelas.' },
        { titulo: 'La recta que corta', texto: 'Una recta que corta a las dos paralelas es una secante. En cada cruce se forman cuatro ángulos; en total, ocho. Cada par de ángulos tiene un nombre según dónde está.' },
        { titulo: 'Los nombres de cada par', texto: 'Los correspondientes ocupan el mismo lugar en cada cruce. Los alternos internos están entre las rectas y a distinto lado de la secante. Los conjugados internos están entre las rectas y del mismo lado.' },
        { titulo: 'Qué mirar', texto: 'Al jugar, inclina la secante y sigue a los ángulos naranjas y al turquesa. Fíjate cuáles cambian juntos y cuáles no.' },
      ],
    },
    juega: {
      consigna: 'Inclina la secante que corta las dos rectas paralelas. Mira qué ángulos naranjas siguen iguales y cuál turquesa los acompaña.',
      voz: 'Inclina la secante. Comprueba qué pares permanecen iguales.',
      controles: [{ id: 't', etiqueta: 'θ', min: 30, max: 150, paso: 10, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: secante(v.t), estado: {} }),
      // Se agarra la punta de arriba de la secante: gira alrededor del punto medio de PQ, que no se mueve.
      arrastres: [arrastreSecante(t => secante(t))],
      lectura: v => ['naranjas: ', `${v.t}°`, '   ·   turquesa: ', `${180 - v.t}°`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora la recta de arriba gira 12° y deja de ser paralela; la secante no se mueve. ¿Qué pasa con los dos ángulos correspondientes?',
      voz: 'El dibujo cambió poco. Decide con la condición.',
      opciones: [
        { id: 'c', texto: 'Dejan de ser iguales: difieren en 12°', correcta: true },
        { id: 'iguales', texto: 'Siguen iguales: es la misma secante', error: 'GE17', siFuera: 'Seguirían iguales si las rectas fueran paralelas. Al girar una, su ángulo gira con ella.' },
        { id: 'suman', texto: 'Ahora suman 180°', error: 'GE17', siFuera: 'Sumar 180° es propio de los conjugados internos entre paralelas, no de los correspondientes.' },
      ],
      dibujo: { datos: secante(60, { giro: 12, textos: false }), estado: {} },
      revelar: { datos: secante(60, { giro: 12 }), estado: {} },
      coincide: 'Coincide: 60° abajo y 48° arriba. Sin paralelas, la igualdad se pierde.',
    },
    mira: {
      datos: secante(60, { pasos: true }),
      voz: 'Cada igualdad se apoya en la anterior. Síguelas en cadena.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Correspondientes: la secante cruza dos paralelas con la misma inclinación.', ecuacion: [th, ' en P = ', th, ' en Q'] },
        { estado: { corte: 2 }, texto: 'En Q, el ángulo opuesto por el vértice es igual.', ecuacion: ['opuestos por el vértice: ', th] },
        { estado: { corte: 3 }, texto: 'Así, los alternos internos también son iguales.', ecuacion: ['alternos internos: ', th, ' = ', th] },
        { estado: { corte: 4 }, texto: 'Los conjugados internos completan una recta: suman 180°.', ecuacion: [th, ' + ', { v: 'c-i', t: 'β' }, ' = 180°'] },
      ],
    },
    regla: {
      texto: 'Si dos rectas paralelas son cortadas por una secante, los correspondientes y los alternos internos son iguales, y los conjugados internos suman 180°.',
      ecuacion: [{ llave: [th], nota: 'correspondiente', color: 'c-o' }, ' = ', { llave: [th], nota: 'alterno', color: 'c-o' }, '   ·   ', th, ' + ', { llave: [{ v: 'c-i', t: 'β' }], nota: 'conjugado', color: 'c-i' }, ' = 180°'],
      condicion: 'las rectas son paralelas. Al revés también vale: si dos correspondientes son iguales, las rectas son paralelas.',
      voz: 'Primero la condición de paralelas; después las igualdades.',
    },
    // Así se resuelve (fase 2): alternos (s par) o conjugados (s impar), como «Ahora tú»; 900 es par, así que
    // paralelas.ahoraTu.generar(s + 900) es el mismo caso y da la figura. En las cuentas, la figura pasa a grados.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), conj = s % 2 === 1, v = r.ent(8, 28), a1 = r.ent(2, 5);
        let a2 = r.ent(1, 4); if (a2 === a1) a2 = a1 + 1;
        const t1 = conj ? 5 * r.ent(8, 26) : 5 * r.ent(8, 28);
        const ang2 = conj ? 180 - t1 : t1, b1 = t1 - a1 * v, b2 = ang2 - a2 * v;
        const ex = (a, b) => `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}°`, cx_ = k => (k === 1 ? 'x' : `${k}x`);
        const e1 = ex(a1, b1), e2 = ex(a2, b2), nombre = conj ? 'conjugados internos' : 'alternos internos';
        const at = paralelas.ahoraTu.generar(s + 900);
        const enGrados = { datos: Object.assign({}, at.dibujo.datos, {
          alt: `Con x = ${v}: los ${nombre} miden ${t1}° y ${ang2}°`,
          angulos: at.dibujo.datos.angulos.map((an, i) => Object.assign({}, an, { texto: `${i === 0 ? t1 : ang2}°` })) }), estado: {} };
        let despeje;
        if (conj) despeje = [`${e1} + ${e2} = 180°  →  ${cx_(a1 + a2)} = ${180 - b1 - b2}°  →  x = ${v}`];
        else if (a1 > a2) despeje = [`${e1} = ${e2}  →  ${cx_(a1 - a2)} = ${b2 - b1}°  →  x = ${v}`];
        else despeje = [`${e1} = ${e2}  →  ${cx_(a2 - a1)} = ${b1 - b2}°  →  x = ${v}`];
        return {
          enunciado: [`Las dos rectas son paralelas. Los ángulos marcados son ${nombre}: ${e1} y ${e2}. ¿Cuánto vale x?`],
          dibujo: at.dibujo,
          pasos: [
            { tipo: 'pide', texto: 'Piden x, el número que hace verdaderas las dos expresiones a la vez.' },
            { tipo: 'datos', texto: `Las rectas son paralelas. El ángulo naranja mide ${e1} y el turquesa, ${e2}: son ${nombre}.` },
            { tipo: 'regla', texto: conj ? 'Entre paralelas, los conjugados internos completan media vuelta: juntos suman 180°.'
              : 'Entre paralelas, los alternos internos tienen la misma abertura: igualo las dos expresiones.',
              ecuacion: conj ? ['conjugados: ', th, ' + ', { v: 'c-i', t: 'β' }, ' = 180°'] : ['alternos internos: ', th, ' = ', th] },
            { tipo: 'cuentas', texto: conj ? 'Sumo las dos expresiones, igualo a 180° y despejo x.' : 'Igualo las dos expresiones, junto las x a un lado y despejo.',
              ecuacion: despeje, dibujo: enGrados },
            { tipo: 'sentido', texto: `Reemplazo x = ${v}: el naranja mide ${a1 * v + b1}° y el turquesa, ${a2 * v + b2}°. ${conj ? `Suman ${a1 * v + b1 + a2 * v + b2}°, como deben.` : 'Son iguales, como deben.'}` },
          ],
          respuesta: [`x = ${v}`],
        };
      },
    },
    ahoraTu: {
      voz: 'Decide si el par es igual o suplementario, y plantea.',
      generar(s) {
        const r = azar(s), conj = s % 2 === 1, v = r.ent(8, 28), a1 = r.ent(2, 5);
        let a2 = r.ent(1, 4); if (a2 === a1) a2 = a1 + 1;
        const t1 = conj ? 5 * r.ent(8, 26) : 5 * r.ent(8, 28); // ángulo de abajo
        const ang2 = conj ? 180 - t1 : t1;
        const b1 = t1 - a1 * v, b2 = ang2 - a2 * v;
        const ex = (a, b) => `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}°`;
        const d = secante(t1, { textos: false });
        d.angulos = [{ en: 'P', de: 'Pd', a: 'Q', color: 'o', texto: ex(a1, b1), radio: 24 },
          conj ? { en: 'Q', de: 'Qd', a: 'P', color: 'i', texto: ex(a2, b2), radio: 24 } : { en: 'Q', de: 'Qi', a: 'P', color: 'i', texto: ex(a2, b2), radio: 24 }];
        d.alt = `Paralelas y secante: ${conj ? 'conjugados internos' : 'alternos internos'} ${ex(a1, b1)} y ${ex(a2, b2)}`;
        const otro = conj ? (b2 - b1) / (a1 - a2) : (180 - b1 - b2) / (a1 + a2);
        return {
          pregunta: [`Las dos rectas son paralelas. Los ángulos marcados son ${conj ? 'conjugados internos' : 'alternos internos'}: ${ex(a1, b1)} y ${ex(a2, b2)}. ¿Cuánto vale x?`],
          dibujo: { datos: d, estado: {} },
          opciones: opciones(v, [
            { id: 'cambio', valor: otro, error: 'GE17', siFuera: conj ? 'Igualarlos valdría para alternos internos; los conjugados internos suman 180°.' : 'Sumar 180° valdría para conjugados internos; los alternos internos son iguales.' },
            { id: 'angulo', valor: t1, error: 'GE-QB2', siFuera: `${t1}° es el ángulo de abajo. La pregunta pide x.` },
            { id: 'uno-mas', valor: v + 2, error: 'GE-QB2', siFuera: 'Revisa el despeje: reemplaza x en las dos expresiones y compara.' },
          ], n => `${f(n, 2)}`),
          solucion: {
            texto: conj ? 'Los conjugados internos suman 180°.' : 'Los alternos internos son iguales.',
            ecuacion: conj ? [`${ex(a1, b1)} + ${ex(a2, b2)} = 180° → x = ${v}`] : [`${ex(a1, b1)} = ${ex(a2, b2)} → x = ${v}`],
          },
        };
      },
    },
  };

  // ---------- Idea 5: el quiebre entre paralelas ----------
  // Cambia: a y b, los ángulos de cada tramo con su paralela · Permanece: las paralelas · Progresa: la paralela auxiliar por V ·
  // Se reserva: la línea auxiliar (aparece en la predicción) · Debe verse: x se parte en a y b, alternos internos.
  const ca = { v: 'c-o', t: 'a' }, cb = { v: 'c-i', t: 'b' }, cx = { v: 'c-h', t: 'x' };
  // El quiebre que rotula la figura (x = a + b, por la paralela auxiliar).
  const quiebreX = v => v.a + v.b;
  const quiebre = (a, b, o = {}) => {
    const V = [3.4, 1.5];
    const T1 = U.polar(V, 1.5 / Math.sin(U.rad(a)), 180 - a), B1 = U.polar(V, 1.5 / Math.sin(U.rad(b)), 180 + b);
    const aux = o.aux || 0;
    return {
      alt: `Quiebre V entre dos paralelas: a = ${a}°, b = ${b}°${o.x ? `, x = ${a + b}°` : ''}`,
      vista: { x: [-2.6, 5.2], y: [-0.6, 3.6] },
      puntos: [{ id: 'V', x: V[0], y: V[1], rotulo: 'V', lado: 0 }, { id: 'T', x: T1[0], y: T1[1], rotulo: 'T', lado: 110 }, { id: 'B', x: B1[0], y: B1[1], rotulo: 'B', lado: -110 },
        { id: 'Td', x: T1[0] + 2, y: 3, sinPunto: true }, { id: 'Ti', x: -3, y: 3, sinPunto: true }, { id: 'Bd', x: B1[0] + 2, y: 0, sinPunto: true }, { id: 'Bi', x: -3, y: 0, sinPunto: true },
        { id: 'Vi', x: V[0] - 2, y: V[1], sinPunto: true }],
      segmentos: [{ de: 'Ti', a: 'Td', recta: true, paralela: 1 }, { de: 'Bi', a: 'Bd', recta: true, paralela: 1 },
        { de: 'V', a: 'T', grosor: 'variable' }, { de: 'V', a: 'B', grosor: 'variable' },
        ...(aux ? [{ de: 'Vi', a: 'V', recta: true, discontinua: true, grosor: 'fino', desde: o.pasos ? 1 : 0 }] : [])],
      angulos: [{ en: 'T', de: 'Td', a: 'V', color: 'o', texto: `${a}°` }, { en: 'B', de: 'Bd', a: 'V', color: 'i', texto: `${b}°` },
        ...(aux ? [{ en: 'V', de: 'T', a: 'Vi', color: 'o', radio: 30, desde: o.pasos ? 2 : 0, texto: o.x ? undefined : `${a}°` }, { en: 'V', de: 'Vi', a: 'B', color: 'i', radio: 30, desde: o.pasos ? 3 : 0, texto: o.x ? undefined : `${b}°` }] : []),
        { en: 'V', de: 'T', a: 'B', color: 'h', radio: 44, texto: o.x ? `x = ${a + b}°` : 'x', desde: o.pasos ? 4 : 0 }],
    };
  };
  // T está en y = 3 y B en y = 0, los dos a 1,5 de la altura de V (3,4; 1,5): el ángulo sale de atan2(1,5; 3,4 − x).
  const angTramo = x => U.grados(Math.atan2(1.5, 3.4 - x));
  const arrastresQuiebre = dib => [
    { id: 'punto-t', etiqueta: 'punto T en la paralela de arriba', color: 'c-o',
      donde: v => enPantalla(dib(v.a, v.b, v), U.polar([3.4, 1.5], 1.5 / Math.sin(U.rad(v.a)), 180 - v.a)),
      mover: (pt, v) => ({ a: angTramo(alPlano(dib(v.a, v.b, v), pt)[0]) }) },
    { id: 'punto-b', etiqueta: 'punto B en la paralela de abajo', color: 'c-i',
      donde: v => enPantalla(dib(v.a, v.b, v), U.polar([3.4, 1.5], 1.5 / Math.sin(U.rad(v.b)), 180 + v.b)),
      mover: (pt, v) => ({ b: angTramo(alPlano(dib(v.a, v.b, v), pt)[0]) }) },
  ];
  const QUIEBRES = [];   // todos los x de la grilla del juego (a y b de 20° a 70°, de 5° en 5°)
  for (let a = 20; a <= 70; a += 5) for (let b = 20; b <= 70; b += 5) QUIEBRES.push(quiebreX({ a, b }));
  const quiebreIdea = {
    id: 'quiebre',
    titulo: 'El quiebre entre paralelas',
    temas: ['Rectas paralelas y una secante'],
    pieza: 'geo-figura',
    // Lee (fase 2): línea quebrada y qué ángulo es cada letra. No dice en qué partes deja la paralela auxiliar el
    // quiebre (eso es «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Una línea que dobla', texto: 'El camino que sube en zigzag a un cerro de Juliaca va derecho, dobla y sigue derecho. En geometría, el punto donde una línea así cambia de dirección se llama vértice.' },
        { titulo: 'Entre dos paralelas', texto: ['Aquí la línea TVB empieza en una paralela, dobla en V y termina en la otra. El tramo de arriba forma ', ca, ' con su paralela; el de abajo, ', cb, '. El ángulo en V es el quiebre, ', cx, '.'] },
        { titulo: 'Qué mirar', texto: ['Al jugar, cambia ', ca, ' y ', cb, ' por separado. Mira cuánto mide ', cx, ' en cada caso y busca qué cuenta con ', ca, ' y ', cb, ' da ese número.'] },
      ],
    },
    juega: {
      consigna: 'La línea TVB se quiebra entre dos paralelas. Cambia los ángulos a y b, y compara el quiebre x con su suma.',
      voz: 'Cambia a y b. Mira cómo responde x.',
      controles: [
        { id: 'a', etiqueta: 'a', min: 20, max: 70, paso: 5, inicio: 40, unidad: '°', decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: 20, max: 70, paso: 5, inicio: 30, unidad: '°', decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: quiebre(v.a, v.b, { x: true }), estado: {} }),
      // Se agarran T y B, que corren por su paralela: V queda fijo y cada tramo se inclina.
      arrastres: arrastresQuiebre((a, b) => quiebre(a, b, { x: true })),
      lectura: v => [cx, ` = ${quiebreX(v)}°   ·   `, ca, ' + ', cb, ` = ${v.a + v.b}°`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Para explicar por qué x = a + b, trazamos por V una paralela a las dos rectas. ¿En qué dos ángulos queda partido x?',
      voz: 'Piensa en la línea auxiliar antes de verla.',
      opciones: [
        { id: 'c', texto: 'Uno igual a a y otro igual a b', correcta: true },
        { id: 'mitades', texto: 'En dos mitades iguales', error: 'GE-QB1', siFuera: 'Mitades iguales sería cierto si a y b midieran lo mismo. La paralela copia cada uno.' },
        { id: 'supl', texto: 'En 180° − a y 180° − b', error: 'GE17', siFuera: 'Esos serían los conjugados internos. Con la paralela por V, cada par es alterno interno.' },
      ],
      dibujo: { datos: quiebre(40, 30), estado: {} },
      revelar: { datos: quiebre(40, 30, { aux: 1 }), estado: {} },
      coincide: 'Coincide: la paralela por V copia a arriba y b abajo.',
    },
    mira: {
      datos: quiebre(40, 30, { aux: 1, pasos: true, x: true }),
      voz: 'Sigue la paralela auxiliar: ella hace el trabajo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Por V trazamos una paralela a las dos rectas.', ecuacion: ['tres paralelas'] },
        { estado: { corte: 2 }, texto: 'Con la recta de arriba, VT forma alternos internos: a.', ecuacion: [ca, ' = 40°'] },
        { estado: { corte: 3 }, texto: 'Con la de abajo, VB forma alternos internos: b.', ecuacion: [cb, ' = 30°'] },
        { estado: { corte: 4 }, texto: 'El quiebre x reúne las dos partes.', ecuacion: [cx, ' = ', ca, ' + ', cb, ' = 70°'] },
      ],
    },
    regla: {
      texto: 'Si una línea se quiebra entre dos paralelas, el ángulo del quiebre es la suma de los ángulos que cada tramo forma con su paralela.',
      ecuacion: [{ llave: [cx], nota: 'quiebre', color: 'c-h' }, ' = ', { llave: [ca], nota: 'arriba', color: 'c-o' }, ' + ', { llave: [cb], nota: 'abajo', color: 'c-i' }],
      condicion: 'las rectas son paralelas y a y b se miden del lado donde está el vértice del quiebre.',
      voz: 'Una paralela auxiliar convierte el quiebre en dos alternos.',
    },
    // Así se resuelve (fase 2): pide x (s par) o b (s impar), como «Ahora tú»; la figura es la de
    // quiebreIdea.ahoraTu.generar(s + 900) y, en las cuentas, aparece la paralela auxiliar por V.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), a = 5 * r.ent(4, 14), b = 5 * r.ent(4, 14), pideX = s % 2 === 0, xx = quiebreX({ a, b });
        const at = quiebreIdea.ahoraTu.generar(s + 900);
        const regla = { tipo: 'regla', texto: 'Por V trazo una paralela auxiliar. Parte el quiebre en dos alternos internos: uno copia a y el otro copia b.',
          ecuacion: [cx, ' = ', ca, ' + ', cb] };
        const conAux = { datos: quiebre(a, b, pideX ? { aux: 1, x: true } : { aux: 1 }), estado: {} };
        return {
          enunciado: pideX ? [`Las rectas son paralelas. Si a = ${a}° y b = ${b}°, ¿cuánto mide el quiebre `, cx, '?']
            : [`Las rectas son paralelas. Si a = ${a}° y el quiebre mide `, cx, ` = ${xx}°, ¿cuánto mide b?`],
          // La figura de «Ahora tú» nombra b en su texto alternativo; aquí, cuando se pide b, no se adelanta.
          dibujo: pideX ? at.dibujo : { datos: Object.assign({}, at.dibujo.datos, { alt: `Quiebre V entre dos paralelas: a = ${a}°, b sin medida y x = ${xx}°` }), estado: {} },
          pasos: pideX ? [
            { tipo: 'pide', texto: ['Piden ', cx, ', el ángulo del quiebre en V.'] },
            { tipo: 'datos', texto: ['Las rectas son paralelas. El tramo de arriba forma ', ca, ` = ${a}° con su recta y el de abajo, `, cb, ` = ${b}°.`] },
            regla,
            { tipo: 'cuentas', texto: 'El quiebre reúne las dos partes: las sumo.', ecuacion: [cx, ` = ${a}° + ${b}° = ${xx}°`], dibujo: conAux },
            { tipo: 'sentido', texto: `${xx}° es mayor que ${a}° y que ${b}°, porque el quiebre contiene a los dos. Y es menor que 180°: la línea sí dobla.` },
          ] : [
            { tipo: 'pide', texto: ['Piden ', cb, ', el ángulo que el tramo de abajo forma con su paralela.'] },
            { tipo: 'datos', texto: ['Las rectas son paralelas. Arriba, ', ca, ` = ${a}°; el quiebre completo mide `, cx, ` = ${xx}°.`] },
            regla,
            { tipo: 'cuentas', texto: ['Como ', cx, ' es la suma, ', cb, ' es lo que queda al quitarle ', ca, '.'], ecuacion: [cb, ` = ${xx}° − ${a}° = ${xx - a}°`], dibujo: conAux },
            { tipo: 'sentido', texto: `Compruebo: ${a}° + ${xx - a}° = ${xx}°, el quiebre completo.` },
          ],
          respuesta: pideX ? [cx, ` = ${xx}°`] : [cb, ` = ${xx - a}°`],
        };
      },
    },
    ahoraTu: {
      voz: 'Ubica a, b y x antes de operar.',
      generar(s) {
        const r = azar(s), a = 5 * r.ent(4, 14), b = 5 * r.ent(4, 14), pideX = s % 2 === 0;
        const d = quiebre(a, b);
        if (!pideX) d.angulos = d.angulos.map(an => an.color === 'i' ? Object.assign({}, an, { texto: 'b' }) : an.color === 'h' ? Object.assign({}, an, { texto: `${a + b}°` }) : an);
        const bien = pideX ? a + b : b;
        return {
          pregunta: pideX ? [`Las rectas son paralelas. Si a = ${a}° y b = ${b}°, ¿cuánto mide el quiebre `, cx, '?'] : [`Las rectas son paralelas. Si a = ${a}° y el quiebre mide `, cx, ` = ${a + b}°, ¿cuánto mide b?`],
          dibujo: { datos: d, estado: {} },
          opciones: opciones(bien, pideX ? [
            { id: 'supl', valor: 180 - a - b, error: 'GE17', siFuera: 'Restar de 180° sería para conjugados; aquí los pares son alternos internos.' },
            { id: 'mitad', valor: (a + b) / 2, error: 'GE-QB1', siFuera: 'El promedio sería cierto si x fuera la mitad de la suma; x es la suma.' },
            { id: 'resta', valor: Math.abs(a - b), error: 'GE-QB1', siFuera: 'Restar serviría si los tramos quedaran a lados opuestos del vértice.' },
          ] : [
            { id: 'suma', valor: a + (a + b), error: 'GE-QB1', siFuera: 'Sumar todo serviría si x fuera una parte; x es el total.' },
            { id: 'supl', valor: 180 - (a + b) - a, error: 'GE17', siFuera: 'Restar de 180° sería para conjugados; aquí los pares son alternos internos.' },
            { id: 'igual', valor: a, error: 'GE-QB1', siFuera: 'b sería igual a a solo si el quiebre fuera simétrico.' },
            { id: 'todo', valor: a + b, error: 'GE-QB1', siFuera: 'Ese es el quiebre completo; b es solo una de sus partes.' },
            { id: 'supl-x', valor: 180 - (a + b), error: 'GE17', siFuera: 'Restar el quiebre de 180° sería para conjugados; aquí los pares son alternos.' },
          ], gr),
          solucion: { texto: 'La paralela por V parte x en a y b.', ecuacion: pideX ? [cx, ` = ${a}° + ${b}° = ${a + b}°`] : [cb, ` = ${a + b}° − ${a}° = ${b}°`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 4: además de inclinar la secante, se gira la recta de arriba. Deja probar lo que la
  // idea reserva para la predicción: qué pasa con los correspondientes y los conjugados cuando las rectas no son paralelas.
  const mesaSecante = {
    id: 'secante-y-giro', titulo: 'Paralelas o casi paralelas', pieza: 'geo-figura',
    consigna: 'Inclina la secante y gira la recta de arriba. Busca cuándo los dos naranjas vuelven a ser iguales.',
    controles: [
      { id: 't', etiqueta: 'θ', min: 40, max: 140, paso: 5, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' },
      { id: 'g', etiqueta: 'Giro de arriba', min: -20, max: 20, paso: 2, inicio: 10, unidad: '°', decimales: 0, color: 'c-h' },
    ],
    dibujo: v => ({ datos: secante(v.t, { giro: v.g }), estado: {} }),
    arrastres: [
      arrastreSecante((t, v) => secante(t, { giro: v.g })),
      // Se agarra el extremo derecho de la recta de arriba: gira alrededor de Q.
      { id: 'recta-arriba', etiqueta: 'extremo de la recta de arriba', color: 'c-h',
        donde: v => { const Q = [1.2 / Math.tan(U.rad(v.t)), 2.4]; return enPantalla(secante(v.t, { giro: v.g }), U.polar(Q, 3, v.g)); },
        mover: (pt, v) => {
          const Q = [1.2 / Math.tan(U.rad(v.t)), 2.4], q = alPlano(secante(v.t, { giro: v.g }), pt);
          return { g: U.grados(Math.atan(Math.max(-1e3, Math.min(1e3, (q[1] - Q[1]) / Math.max(q[0] - Q[0], 0.05))))) };
        } },
    ],
    lectura: v => { const m = medidasSecante(v.t, v.g); return ['naranjas ', `${m.abajo}° y ${m.arriba}°   ·   conjugados ${m.abajo + m.conjugado}°${v.g === 0 ? ': paralelas' : ''}`]; },
    // Retos comprobados con las medidas que rotula la figura (medidasSecante).
    invitaciones: [
      { texto: 'Haz que los dos ángulos naranjas vuelvan a ser iguales.',
        logrado: v => { const m = medidasSecante(v.t, v.g); return m.abajo === m.arriba; },
        bien: 'Iguales solo con giro cero: correspondientes iguales garantizan rectas paralelas.' },
      { texto: 'Consigue que los dos naranjas difieran lo más posible.',
        logrado: v => { const m = medidasSecante(v.t, v.g); return Math.abs(m.abajo - m.arriba) === Math.max(-mesaSecante.controles[1].min, mesaSecante.controles[1].max); },
        bien: 'La diferencia es el giro de la recta de arriba, no la secante.' },
      { texto: 'Haz que la secante forme un ángulo recto con la recta de abajo.',
        logrado: v => medidasSecante(v.t, v.g).abajo === 90,
        bien: 'Secante perpendicular. ¿Lo es también a la de arriba? Mira el giro.' },
      { texto: 'Haz que los conjugados internos sumen 170°.',
        logrado: v => { const m = medidasSecante(v.t, v.g); return m.abajo + m.conjugado === 170; },
        bien: 'Sumar menos de 180° delata que las rectas no son paralelas.' },
      { texto: 'Guarda dos casos con el mismo giro y distinta secante. Compara sus naranjas.',
        logrado: (v, gs) => { const d = c => { const m = medidasSecante(c.t, c.g); return m.abajo - m.arriba; };
          return v.g !== 0 && gs.some(c => c.g === v.g && c.t !== v.t && d(c) === d(v)) && gs.some(c => c.g === v.g && c.t === v.t); },
        bien: 'Otra secante, la misma diferencia: la culpa es del giro.' },
    ],
  };
  // Mesa 2: B libre en el plano, no solo en la recta. La idea 1 deja a B fuera de la recta solo en la predicción.
  // El camino A → B → C que dibuja tramosLibre; el rodeo es lo que pasa de AC = 10.
  const camino = v => Math.hypot(v.bx, v.by) + Math.hypot(10 - v.bx, v.by);
  let CAMINO_MAX = 0;   // el mayor de la grilla de la mesa (bx de −2 a 12, by de 0 a 3,5, de 0,5 en 0,5)
  for (let i = 0; i <= 28; i++) for (let j = 0; j <= 7; j++) CAMINO_MAX = Math.max(CAMINO_MAX, camino({ bx: -2 + i / 2, by: j / 2 }));
  const tramosLibre = (bx, by) => Object.assign(tramos(bx, by), { vista: { x: [-3, 13], y: [-1.4, 4.2] } });
  const mesaPunto = {
    id: 'punto-libre', titulo: 'B fuera de la recta', pieza: 'geo-figura',
    consigna: 'Arrastra B por todo el plano. Mira cuánto más largo es el camino por B que el directo de A a C.',
    controles: [
      { id: 'bx', etiqueta: 'B a lo ancho', min: -2, max: 12, paso: 0.5, inicio: 4, unidad: 'cm', decimales: 1, color: 'c-o' },
      { id: 'by', etiqueta: 'B a lo alto', min: 0, max: 3.5, paso: 0.5, inicio: 3, unidad: 'cm', decimales: 1, color: 'c-o' },
    ],
    dibujo: v => ({ datos: tramosLibre(v.bx, v.by), estado: {} }),
    // Se agarra B: se mueve en las dos direcciones.
    arrastres: [{ id: 'punto-b', etiqueta: 'punto B', color: 'c-o',
      donde: v => enPantalla(tramosLibre(v.bx, v.by), [v.bx, v.by]),
      mover: (pt, v) => { const q = alPlano(tramosLibre(v.bx, v.by), pt); return { bx: q[0], by: q[1] }; } }],
    lectura: v => { const s = camino(v); return [AB, ' + ', BC, ` ≈ ${f(s)} cm   ·   rodeo ${f(s - 10)} cm`]; },
    invitaciones: [
      { texto: 'Deja el rodeo en cero: que el camino por B mida igual que AC.',
        logrado: v => Math.abs(camino(v) - 10) < 1e-9,
        bien: 'Rodeo cero solo con B entre A y C. ¿Y si B pasa de C?' },
      { texto: 'Pon B sobre la recta, pero fuera del tramo entre A y C.',
        logrado: v => v.by === 0 && (v.bx < 0 || v.bx > 10),
        bien: 'En la recta y con rodeo: «en la recta» no basta, falta «entre».' },
      { texto: 'Busca el rodeo más grande que permite la mesa.',
        logrado: v => Math.abs(camino(v) - CAMINO_MAX) < 1e-9,
        bien: 'Lejos y alto: el rodeo crece. La suma nunca baja de AC.' },
      { texto: 'Guarda dos casos con el mismo rodeo y B en lugares distintos.',
        logrado: (v, gs) => gs.some(c => (c.bx !== v.bx || c.by !== v.by) && Math.abs(camino(c) - camino(v)) < 1e-9) && gs.some(c => c.bx === v.bx && c.by === v.by),
        bien: 'Mismo rodeo en dos lugares. ¿Están en espejo respecto del medio de AC?' },
    ],
  };

  return {
    unidad: 'geometria.segmentos-y-angulos',
    version: '0.3.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js', '/nucleo/kit/piezas/geo-objeto.js'],
    historia: {
      texto: 'Los Elementos de Euclides separan el objeto ideal de su dibujo: el punto no tiene tamaño y una marca de tinta solo lo representa. Una regla sirve para explorar una figura, pero su precisión no prueba una igualdad para todos los casos. Esta unidad hereda esa separación entre dibujar, medir y justificar.',
      pregunta: '¿Basta que dos líneas parezcan paralelas?',
      fuente: { titulo: 'Euclides, Elementos, libro I (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/bookI.html' },
    },
    // Laboratorio: la secante con la recta que gira y B libre en el plano son más ricas que sus ideas; la tercera mesa es
    // el quiebre con sus dos manijas.
    // Glosario: las palabras que el curso estrena aquí (docs/teoria.md, 4d). Es la primera unidad de geometría, así que
    // trae el vocabulario de base. Triángulo, altura, hipotenusa y cateto también salen aquí, pero se definen en
    // «Triángulos» y «Congruencia», donde son el tema; el lector los marca igual.
    glosario: [
      { termino: 'arco', def: 'Parte de una circunferencia entre dos de sus puntos. Sirve para medir la abertura de un ángulo.', ver: ['ángulo'] },
      // Las cuatro que estrena la idea 1, con su aproximación de todos los días (simple) y tres ejemplos (calidad 2).
      { termino: 'punto', def: 'Lugar exacto, sin tamaño. Se nombra con una letra mayúscula, como A o B.',
        simple: 'Un lugar exacto, como un paradero marcado en el mapa.',
        ejemplos: ['Cada paradero del mapa de la carretera: A, B o C.', 'La esquina de tu carpeta.', 'El cruce de dos calles en el mapa del celular.'] },
      { termino: 'recta', def: 'Línea derecha sin principio ni fin. Por dos puntos pasa una sola.', ver: ['segmento', 'rayo'],
        simple: 'Una línea derecha que no se acaba hacia ningún lado.',
        ejemplos: ['Una carretera larga y derecha, si la imaginas sin fin.', 'El borde de una regla, alargado hacia los dos lados.', 'La línea que pasa por los paraderos A y C: hay una sola.'] },
      { termino: 'plano', def: 'Superficie lisa que se extiende sin fin en todas direcciones, como una hoja que nunca acaba.',
        simple: 'Una superficie lisa, como la hoja del mapa, pero sin bordes.',
        ejemplos: ['La hoja donde está dibujado el mapa de la carretera.', 'El piso liso de la cancha, imaginado sin fin.', 'La pizarra del salón, si no tuviera bordes.'] },
      { termino: 'segmento', def: 'Trozo de recta entre dos puntos, sus extremos. Tiene una medida fija.', ver: ['recta'],
        simple: 'El tramo que va de un punto a otro, como de paradero a paradero.',
        ejemplos: ['El tramo de carretera entre dos paraderos: AB va del paradero A al B.', 'Un lado de tu cuaderno, de una esquina a la otra.', `Con B entre A y C, AB = 4 km y BC = 6 km: AC = ${4 + 6} km.`] },
      { termino: 'rayo', def: 'Parte de una recta que empieza en un punto y sigue sin fin hacia un solo lado.', ver: ['ángulo'] },
      { termino: 'ángulo', simbolo: '∠', medida: '°', def: 'Abertura entre dos rayos que salen del mismo punto. Se mide en grados.',
        ejemplo: '∠AOB: el vértice es O y los lados son OA y OB.', ver: ['vértice', 'bisectriz'] },
      { termino: 'vértice', def: 'Punto donde se juntan los lados de un ángulo o de una figura.' },
      { termino: 'ángulo agudo', formas: ['ángulo agudo', 'ángulos agudos', 'agudo', 'agudos'], def: 'El que mide más de 0° y menos de 90°: más cerrado que una esquina.' },
      { termino: 'ángulo recto', formas: ['ángulo recto', 'ángulos rectos'], def: 'El que mide exactamente 90°, como la esquina de una hoja.' },
      { termino: 'ángulo obtuso', formas: ['ángulo obtuso', 'ángulos obtusos', 'obtuso', 'obtusos'], def: 'El que mide más de 90° y menos de 180°: más abierto que una esquina.' },
      { termino: 'ángulo llano', formas: ['ángulo llano', 'ángulos llanos', 'llano'], def: 'El que mide 180°: sus dos lados forman una sola recta.' },
      { termino: 'ángulo no convexo', formas: ['ángulo no convexo', 'ángulos no convexos', 'no convexo'], def: 'El que mide más de 180° y menos de 360°: su abertura rodea por afuera.' },
      { termino: 'bisectriz', def: 'Rayo que parte un ángulo en dos ángulos iguales.', ejemplo: `La de un ángulo de 50° deja dos de ${50 / 2}°.`, ver: ['incentro'] },
      { termino: 'complemento', formas: ['complemento', 'complementos', 'complementarios', 'complementario'],
        def: 'Lo que le falta a un ángulo para llegar a 90°.', ejemplo: `El de 35° es ${90 - 35}°, porque 35° + ${90 - 35}° = 90°.`, ver: ['suplemento'] },
      { termino: 'suplemento', formas: ['suplemento', 'suplementos', 'suplementarios', 'suplementario'],
        def: 'Lo que le falta a un ángulo para llegar a 180°.', ejemplo: `El de 35° es ${180 - 35}°, porque 35° + ${180 - 35}° = 180°.`, ver: ['complemento'] },
      { termino: 'rectas paralelas', simbolo: '∥', formas: ['rectas paralelas', 'paralelas', 'paralela', 'paralelos', 'paralelo'],
        def: 'Rectas de un mismo plano que nunca se cortan, por más que se prolonguen.', ver: ['secante'] },
      { termino: 'secante', def: 'Recta que corta a otras líneas o a una curva. Al cruzar dos paralelas forma ocho ángulos.',
        ver: ['ángulos correspondientes', 'alternos internos', 'conjugados internos'] },
      { termino: 'ángulos correspondientes', formas: ['ángulos correspondientes', 'correspondientes', 'correspondiente'],
        def: 'Los que ocupan el mismo lugar en cada cruce de la secante. Entre paralelas, son iguales.', ver: ['secante'] },
      { termino: 'alternos internos', formas: ['alternos internos', 'alterno interno', 'alternos', 'alterno'],
        def: 'Ángulos entre las dos rectas y a distinto lado de la secante. Entre paralelas, son iguales.', ver: ['conjugados internos'] },
      { termino: 'conjugados internos', formas: ['conjugados internos', 'conjugado interno', 'conjugados', 'conjugado'],
        def: 'Ángulos entre las dos rectas y al mismo lado de la secante. Entre paralelas, suman 180°.',
        ejemplo: `Si uno mide 60°, el otro mide ${180 - 60}°.`, ver: ['alternos internos'] },
      { termino: 'opuestos por el vértice', formas: ['opuestos por el vértice', 'opuesto por el vértice'],
        def: 'Los dos ángulos que quedan frente a frente cuando se cruzan dos rectas. Siempre son iguales.' },
      { termino: 'adyacentes', formas: ['adyacentes', 'adyacente'], def: 'Ángulos que comparten el vértice y un lado, uno al costado del otro, sin encimarse.' },
      { termino: 'línea auxiliar', formas: ['paralela auxiliar', 'línea auxiliar', 'figura auxiliar', 'auxiliar'],
        def: 'Línea extra que se traza en la figura para hacer visible una relación y poder justificarla.' },
    ],
    laboratorio: [mesaSecante, mesaPunto, Object.assign({ id: 'quiebre', titulo: 'El quiebre entre paralelas', pieza: 'geo-figura',
      invitaciones: [
        { texto: 'Haz que el quiebre x mida justo 90°.',
          logrado: v => quiebreX(v) === 90,
          bien: 'Un quiebre recto con a + b = 90°. ¿Cuántas parejas lo logran?' },
        { texto: 'Busca el quiebre más cerrado que permite la mesa.',
          logrado: v => quiebreX(v) === Math.min(...QUIEBRES),
          bien: 'Los dos tramos casi pegados a sus paralelas: x se cierra.' },
        { texto: 'Haz el quiebre simétrico: el mismo ángulo arriba y abajo.',
          logrado: v => v.a === v.b,
          bien: 'Simétrico: la paralela auxiliar parte x en dos mitades iguales.' },
        { texto: 'Guarda dos casos con el mismo quiebre x y distintos a y b.',
          logrado: (v, gs) => gs.some(c => c.a !== v.a && quiebreX(c) === quiebreX(v)) && gs.some(c => c.a === v.a && c.b === v.b),
          bien: 'El mismo x por dos caminos: solo cuenta la suma a + b.' },
      ] }, quiebreIdea.juega)],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'secante-y-giro': ['paralelas'],
      'punto-libre': ['suma-de-segmentos'],
      'quiebre': ['quiebre'],
    },
    ideas: [suma, aberturaIdea, bisectriz, paralelas, quiebreIdea],
  };
});
