/*
 * Teoría de «Segmentos y ángulos» (geometria.segmentos-y-angulos), para 5.º de secundaria y preuniversitario. Molde:
 * docs/teoria.md y docs/molde-unidad.md. Fuente: docs/teoria/matriz/geometria.json (unidad 1), expediente
 * teoria-152-unidades (precisiones de Geometría). Compañera: Neri (nutria). Piezas: geo-objeto (objetos de prueba y
 * escenas con ángulos, que trazan con geo-figura) y geo-figura (la mesa «B fuera de la recta»).
 *
 * Etapa 3 del plan de calidad (17 nov): la propuesta aprobada por Gerson (docs/etapa3/propuesta-geometria.md, con todas
 * las recomendaciones de su §9) y docs/etapa3/decisiones.md, que manda. Seis ideas: suma-de-segmentos, punto-medio
 * (nueva), abertura, bisectrices, paralelas y quiebre. Fases 2 y 3 del método (docs/metodo/unidad/): la idea 1 tuvo el
 * visto bueno de Gerson (mesa, segunda ronda) y las ideas 2 a 6 se escribieron con el mismo nivel (17 nov): objeto en la
 * primera pantalla (geo-objeto: la soga del tira y afloja, el reloj de la plaza, la tranquera, los rieles del tren y el
 * pasaje entre avenidas, todos de prueba), misión, leyenda, predicción con datos sin fórmula, «Mira», regla, «Así se
 * resuelve» distinto de «Ahora tú», «Ahora tú» con datos y de nivel examen, glosario con simple y tres ejemplos, y 15
 * ejemplos resueltos por idea con las cuentas rehechas aparte (scratchpad segmentos-f3/cuentas.js). La unidad declara
 * calidad: 2; la práctica (fase 5) todavía no está.
 *
 * REGLA DE COLORES DE LA UNIDAD (decisiones de la etapa 3; molde §5b: un color fijo por magnitud, aquí por lo que cada
 * cosa ES en la figura, porque las letras AB, AC o θ cambian de un problema a otro):
 *   - segmentos: el todo (el tramo de punta a punta, el viaje directo) en tinta, con su cota; los tramos que se juntan,
 *     naranja (o) el primero de la carretera, de izquierda a derecha, y turquesa (i) el segundo; lo que se pide, con «?»
 *     en tinta, para que el color no lo delate; el resultado ya calculado, en violeta (f), solo en el texto del resuelto
 *     y en la respuesta, nunca en la figura ni en el enunciado; el verde no se usa;
 *   - ángulos (ideas 3 a 6): el ángulo dado y sus iguales en carmín (h), con arco y letra; su compañero (90° − α o
 *     180° − θ) en turquesa; en los ejercicios (ejemplos, «Así se resuelve», «Ahora tú») de las ideas 3 a 6, todo ángulo
 *     dado en carmín y lo pedido («?», x) en tinta: el turquesa diría si es igual o suplementario. Un ángulo recto que se
 *     pide va con arco, no con el cuadradito (geo-objeto), para no delatar los 90°;
 *   - la pieza geo-objeto pone el color de cada tramo por su papel (todo, pide, dato) y el texto lo toma de la figura
 *     (pinta): un tramo no puede llevar en el texto otro color que en el dibujo. Sin figura (qué punto está entre los
 *     otros dos), ningún tramo lleva color: el color diría cuál es el de punta a punta.
 *   La comprueba segmentos-y-angulos.test.js en cada figura y cada texto de la idea 1 (juego en toda su grilla, «Lee»,
 *   predicción, «Mira», ejemplos, y «Así se resuelve» y «Ahora tú» en 400 semillas): falla si un tramo cambia de color,
 *   si el texto lo pinta distinto que la figura o lo deja sin color, o si aparece violeta en una figura o un enunciado.
 * Notación: AB nombra el segmento y su medida (se dice en «Lee»); m∠AOB para la medida de un ángulo en enunciados y
 * datos, y C(x), S(x) para complemento y suplemento, sin puntos C ni S en esas figuras (lo comprueba la prueba).
 * Letras y grados (decisiones, cuarta ronda, 18 nov: «x sin °»): una letra latina que vale un número (x, y, k, a, b, m)
 * es un número y se escribe sin «°», ella y su valor: «m∠AOB = 3x + 29°» y «x = 17», nunca «x°» ni «x = 17°». El grado
 * va en lo que se mide: «m∠AOB = 80°», «90° − x», los rótulos con números. Al despejar, el lado que queda solo con la
 * letra deja al otro sin grado («4x = 160», «x < 25»); al reemplazar, la letra se cambia por su número («3 · 17 + 29° =
 * 80°»). Si se pide x, la respuesta es «x = 17»; si se pide un ángulo, su medida con grado. Una letra griega (θ, α)
 * nombra un ángulo, y su medida lleva grado («θ = 60°»). Lo comprueba la prueba «x sin °».
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
  // Lo que vale una letra (x, y, k, a, b) es un número: sin «°» (decisiones, cuarta ronda).
  const NUM = n => f(n);
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
  // está entre A y C, GE-SEG2 suma el desvío a AC (ya no es opción de la predicción: auditoría, 17 nov), GE-SEG6 (nuevo) cree que el rodeo acorta, GE-SEG4 cuenta dos veces el
  // tramo que se pisa, GE-SEG5 hace una resta válida que da otro tramo, GE-SEG7 (nuevo) toma por punto del medio una punta
  // del tramo más largo, GE-SEG8 (nuevo) cree que la letra del medio es el punto del medio, GE-SEG9 (nuevo) cree que, sin
  // el orden dicho, ninguno está entre los otros, GE-SEG11 (nuevo) parte una suma entre dos, GE-SEG12 (nuevo) parte entre
  // dos lo que ya era el tramo, GE-SEG14 (nuevo) quita el tramo equivocado, GE-RAZ1 (nuevo) da la otra parte de la razón,
  // GE-RAZ2 (nuevo) se queda en k, GE-RAZ3 (nuevo) resta los números de la razón a una medida, GE-SEG19 (nuevo, 17 nov)
  // cree que el lado de la recta en que queda el punto cambia la suma.
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
  const tr = (de, a, texto, nivel, papel) => Object.assign({ de, a, nivel: nivel === 0 ? 0 : nivel || 1 }, texto !== undefined ? { texto } : {}, papel ? { papel } : {});
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
  // La predicción y «Mira»: B a 3 km de la carretera, frente al km 4 (rotulado debajo de la pista). Ronda 2 del lector
  // (18 nov): nada de la idea usa Pitágoras (llega ocho unidades después; la propuesta lo sacó de la idea), así que ningún
  // texto ni dibujo da el largo de los caminos AB y BC (eran 5 km y ≈ 6,7 km). «Mira» compara cada camino con su tramo
  // de carretera con la regla del mapa: puesta en AB desde A, su marca de 4 km queda antes de B (AB > 4 km); puesta en
  // BC desde C, su marca de 6 km queda antes de B (BC > 6 km). Juntos, más de 4 + 6 = 10 km.
  const BX = 4, BY = 3;
  const REGLAS_P = (p1, p2) => [{ de: 'A', a: 'B', marca: BX, paso: p1 }, { de: 'C', a: 'B', marca: 10 - BX, paso: p2 }];
  const figP = (o = {}) => ({ objeto: 'carretera', vista: [-1, 11],
    puntos: [pto('A', 0), pto('B', BX, BY), pto('C', 10)],
    tramos: [tr('A', 'B', o.ab), tr('B', 'C', o.bc), tr('A', 'C', '10 km', -1, 'todo')],
    alturas: [{ punto: 'B', texto: `${f(BY)} km` }], kmRotulo: [BX], reglas: o.reglas, nota: o.nota });

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
      // (Ronda 2 del lector, 18 nov: con «AD = AB + BC + CD» en Datos el planteamiento venía hecho; queda la regla general.)
      datos: ['Con puntos en orden, cada medida es la suma de sus tramos.'],
      solucion: [
        { texto: ['AD está hecho de tres tramos: ', AB, ', BC y ', CD, '.'], ecuacion: junto(['AD = ', AB, ' + BC + ', CD, ' → 3 + BC + 4 = 12']) },
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
        { texto: ['C está a 5 cm de B, a un lado o al otro. A no va en medio: ', AB, ' + AC tendría que dar ', BC, ', y ', AB, ' ya es mayor.'] },
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
      // Ronda 2 del lector (18 nov): con «pasa por B y termina en C», 14 km parecía imposible (entre A y C siempre da 10).
      // La consigna dice que B puede quedar antes de A o pasado C, y que la combi igual va de A a B y de B a C, sin decir
      // dónde queda B para los 14 km.
      consigna: 'De A a C hay 10 km de carretera recta. La combi va de A hasta el paradero B, y de B hasta C.',
      mision: {
        texto: 'Corre B, también antes de A o pasado C, hasta que la combi recorra 14 km.',
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
      // Sin el tope de 13 km (auditoría, 17 nov): «menos de 13» solo vale por dónde está B y no se sabe sin Pitágoras (con B
      // frente al km 0, el camino mide 3 + √109 ≈ 13,4 km). Lo que el alumno puede decidir es que el rodeo alarga.
      opciones: [
        { id: 'c', texto: 'Más de 10 km: el rodeo alarga el viaje', correcta: true },
        { id: 'igual', texto: 'Exactamente 10 km: B sigue entre A y C', error: 'GE-SEG1', siFuera: '10 km sería cierto con B en la carretera, entre A y C. Fuera de ella, el camino rodea.' },
        { id: 'atajo', texto: 'Menos de 10 km: el desvío acorta', error: 'GE-SEG6', siFuera: 'Un desvío puede ahorrar tráfico, pero no distancia: el camino directo de A a C es el más corto.' },
        { id: 'lado', texto: 'Depende del lado de la carretera en que esté B', error: 'GE-SEG19', siFuera: 'El lado cambia el dibujo, es cierto; pero de cualquier lado B queda fuera y el camino rodea.' },
      ],
      dibujo: { datos: figP(), estado: {} },
      revelar: { datos: figP({ reglas: REGLAS_P(0, 0) }), estado: {} },
      coincide: `Coincide: con la regla del mapa, AB pasa de ${f(BX)} km y BC pasa de ${f(10 - BX)} km. Juntos pasan de los 10 km de AC.`,
      noCoincide: `Revisemos: con la regla del mapa, AB pasa de ${f(BX)} km y BC pasa de ${f(10 - BX)} km. Juntos, más de 10 km.`,
    },
    mira: {
      pieza: GO,
      datos: figP({ reglas: REGLAS_P(1, 2) }),
      voz: 'Avanza paso a paso: la regla del mapa compara cada camino con la carretera.',
      pasos: [
        { estado: { paso: 0 }, texto: 'La combi va de A a B y luego a C, en línea recta.' },
        { estado: { paso: 0 }, texto: `B queda frente al km ${f(BX)}: de ahí a C quedan ${f(10 - BX)} km.`, ecuacion: junto(`${f(BX)} km + ${f(10 - BX)} km = 10 km = AC`) },
        { estado: { paso: 1 }, texto: ['Regla en ', AB1, `, desde A: su marca de ${f(BX)} km no llega a B.`], ecuacion: junto([AB1, ` > ${f(BX)} km`]) },
        { estado: { paso: 2 }, texto: ['Regla en ', BC1, `, desde C: su marca de ${f(10 - BX)} km tampoco llega a B.`], ecuacion: junto([BC1, ` > ${f(10 - BX)} km`]) },
        { estado: { paso: 2 }, texto: 'Cada camino sube mientras avanza: juntos pasan de los 10 km de AC.', ecuacion: [junto([AB1, ' + ', BC1, ` > ${f(BX)} km + ${f(10 - BX)} km`]), ' ', junto('= 10 km = AC')] },
        { estado: { paso: 2 }, texto: 'Solo con B en la carretera, entre A y C, desaparece el rodeo.', ecuacion: junto([AB1, ' + ', BC1, ' = AC']) },
      ],
    },
    regla: {
      texto: 'Si B está en el segmento AC, sus dos tramos suman AC; si queda fuera, el camino por B es más largo. En orden, cada medida suma sus tramos.',
      ecuacion: [junto(['B entre A y C: ', AB1, ' + ', BC1, ' = AC']), SEP, junto(['B fuera: ', AB1, ' + ', BC1, ' > AC'])],
      condicion: 'B está en la recta AC y en el tramo de A a C.',
      voz: 'Que se vea en medio no basta: tiene que estar entre A y C.',
      // Dibujo propio (docs/teoria.md 4i; ronda 2 del lector, 18 nov): antes la regla mostraba el último paso de «Mira», con
      // «5 km» y «≈ 6,7 km», largos que salen de Pitágoras. Ahora, B fuera de la carretera con sus caminos rotulados con
      // las letras del texto (AB naranja, BC turquesa y AC en tinta), sin ninguna medida.
      dibujo: { pieza: GO, datos: { objeto: 'carretera', vista: [-1, 11], puntos: [pto('A', 0), pto('B', BX, BY), pto('C', 10)],
        tramos: [tr('A', 'B', 'AB'), tr('B', 'C', 'BC'), tr('A', 'C', 'AC', -1, 'todo')] }, estado: {} },
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

  // ---------- Idea 2 (17 nov): el punto medio ----------
  // Objeto de la primera pantalla: el tira y afloja del aniversario del colegio (geo-objeto, soga): la soga de 10 m con
  // sus puntas A y C, el pañuelo M atado a su mitad y la raya B pintada en el patio.
  // Cambia: cuánta soga queda del lado de tu equipo (AB). · Permanece: la soga de 10 m, el pañuelo a su mitad y la raya.
  // Progresa: la lectura compara AB − BC con BM. · Se reserva: dos puntos medios a la vez (la predicción de las bancas).
  // Debe verse: el pañuelo se aleja de la raya la mitad de lo que se diferencian los dos lados.
  // Errores (hipótesis, sin medir; nuevos): GE-PM1 suma AC y BD y no divide, GE-PM2 divide entre 4 («dos medios, dos
  // mitades»), GE-PM3 no parte la diferencia entre 2, GE-PM4 se queda en AM (la mitad) y no llega al tramo pedido, GE-PM5
  // parte el tramo equivocado, GE-PM6 toma «el doble» al revés, GE-SEG3 cree que falta un dato.
  const SOGA = 10;
  const mt = (x, u = 'm') => `${f(x)} ${u}`;
  const figSoga = ab => ({ objeto: 'soga', vista: [-9, 9], soga: ['A', 'C'], panuelo: 'M', raya: 'B',
    puntos: [pto('A', -ab), pto('B', 0), pto('M', SOGA / 2 - ab), pto('C', SOGA - ab)],
    tramos: [tr('A', 'B', mt(ab), 1), tr('B', 'C', mt(SOGA - ab), 1), tr('A', 'C', mt(SOGA), 2, 'todo'),
      ...(Math.abs(ab - SOGA / 2) > 1e-9 ? [tr('B', 'M', mt(Math.abs(ab - SOGA / 2)), -1, 'otro')] : [])] });
  const AB2 = dO('AB'), BC2 = dI('BC');
  const igual = (de, a, k, texto, nivel) => Object.assign(tr(de, a, texto, nivel === undefined ? 0 : nivel, 'igual'), { marcas: k });
  const D_SUMA = 'Con puntos en orden, cada tramo largo es la suma de los tramos que lo forman.';
  // Con la figura F, cada tramo lleva el color que tiene en ella (pinta); sin figura, en tinta.
  const dMedio = (M, X, Y, F) => { const p = nom => (F ? pinta(F, nom) : nom); return [`${M} es el punto medio de `, p(X + Y), `: está entre ${X} y ${Y}, y `, p(X + M), ' = ', p(M + Y), '.']; };
  const dSumaMedio = (M, X, Y, F) => { const p = nom => (F ? pinta(F, nom) : nom); return [p(X + Y), ' = ', p(X + M), ' + ', p(M + Y)]; };
  // La predicción y «Mira»: los paraderos A, B, C y D de una avenida, con las bancas M (medio de AB) y N (medio de CD).
  // B en el 6 (antes en el 4): con AB = 4 m, las rayitas de AM y MB no cabían lejos de los puntos (auditoría, 17 nov).
  // AC = 12 m y BD = 18 m siguen igual, y MN = 15 m.
  const PA = 0, PB = 6, PC = 12, PD = 24, PM = (PA + PB) / 2, PN = (PC + PD) / 2;
  const figBancas = o => ({ objeto: 'carretera',
    puntos: [pto('A', PA), pto('M', PM), pto('B', PB), pto('C', PC), pto('N', PN), pto('D', PD)],
    tramos: [tr('A', 'C', mt(PC - PA), 1), tr('B', 'D', mt(PD - PB), 2), tr('M', 'N', o.mn, -1, o.papel || 'pide'),
      ...(o.mitades ? [igual('A', 'M', 1), igual('M', 'B', 1), igual('C', 'N', 2), igual('N', 'D', 2)] : [])] });
  const MN_P = PN - PM;
  const igualesPaso = (k, paso) => [igual('A', 'M', 1), igual('M', 'B', 1), igual('C', 'N', 2), igual('N', 'D', 2)].map(t => Object.assign(t, { paso }));

  // Ejemplos resueltos de «El punto medio». Cuentas rehechas aparte (scratchpad segmentos-f3/cuentas.js): 14 ÷ 2 = 7;
  // 2,5 + 2,5 = 5; 4 ≠ 6 y 10 ÷ 2 = 5; x + 3 = 11 → 8; 6 − 2 = 4; 1500 ÷ 2 = 750; 10 ÷ 2 = 5 y 7 − 5 = 2; (13 + 5) ÷ 2 = 9
  // y 13 − 9 = 4; 4 + 6 = 10; 3x − 1 = x + 7 → x = 4, AM = 11, AB = 22; (20 + 26) ÷ 2 = 23; 16 ÷ 2 = 8; 19 − 7 = 12,
  // 7 + 6 = 13; 18 ÷ 2 = 9; 4k = 32 → k = 8, AM = 16, BM = 8. Las figuras van a escala y lo pedido lleva «?».
  const EJ2 = [];
  {
    const F = { objeto: 'soga', soga: ['A', 'C'], panuelo: 'M', puntos: [pto('A', 0), pto('M', 7), pto('C', 14)],
      tramos: [Object.assign(tr('A', 'M', '?', 1, 'pide'), { marcas: 1 }), igual('M', 'C', 1, undefined, 1), tr('A', 'C', '14 m', 2, 'todo')] };
    EJ2.push({ nivel: 1, titulo: 'La mitad de la soga', figura: fig(F),
      enunciado: 'La soga del tira y afloja mide 14 m, y el pañuelo M está atado a su mitad. ¿Cuánto hay de la punta A al pañuelo?',
      datos: [dMedio('M', 'A', 'C', F), [pinta(F, 'AM'), ' + ', pinta(F, 'MC'), ' = ', pinta(F, 'AC')]],
      solucion: [{ texto: 'Las dos mitades miden igual y juntas hacen los 14 m: parto en dos.', ecuacion: junto(['AM = 14 ÷ 2 = ', dF('7 m')]) }],
      respuesta: ['AM = ', dF('7 m')] });
  }
  {
    const F = { objeto: 'carretera', puntos: [pto('A', 0), pto('M', 2.5), pto('B', 5)],
      tramos: [Object.assign(tr('A', 'M', '2,5 km', 1), { marcas: 1 }), igual('M', 'B', 1), tr('A', 'B', '?', -1, 'pide')] };
    const AM = pinta(F, 'AM');
    EJ2.push({ nivel: 1, titulo: 'El doble de la mitad', figura: fig(F),
      enunciado: ['En una carretera recta, el paradero M está a la mitad entre A y B, y ', AM, ' = 2,5 km. ¿Cuánto mide AB?'],
      datos: [dMedio('M', 'A', 'B', F), dSumaMedio('M', 'A', 'B', F)],
      solucion: [{ texto: ['MB mide lo mismo que ', AM, ': AB junta las dos mitades.'], ecuacion: junto(['AB = 2,5 + 2,5 = ', dF('5 km')]) }],
      respuesta: ['AB = ', dF('5 km')] });
  }
  {
    // Antes: «¿M es el punto medio?», con AM = 4 y MB = 6 a escala: se veía a ojo (auditoría, 17 nov). Ahora se pide dónde
    // queda el punto medio, que no está dibujado con su medida.
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('P', 4), pto('M', 5), pto('B', 10)], tramos: [tr('A', 'P', '4 cm', 1), tr('P', 'B', '6 cm', 1), tr('A', 'M', '?', -1, 'pide')] };
    const AP = pinta(F, 'AP'), PB = pinta(F, 'PB');
    EJ2.push({ nivel: 1, titulo: '¿Dónde queda el punto medio?', figura: fig(F),
      enunciado: ['A, P y B están en ese orden sobre una recta, con ', AP, ' = 4 cm y ', PB, ' = 6 cm. M es el punto medio de AB. ¿A cuántos centímetros de A queda M?'],
      datos: [dMedio('M', 'A', 'B'), D_SUMA],
      solucion: [
        { texto: ['Primero AB, que junta ', AP, ' y ', PB, ':'], ecuacion: junto(['AB = 4 + 6 = 10 cm']) },
        { texto: 'M está a la mitad de AB:', ecuacion: junto(['AM = 10 ÷ 2 = ', dF('5 cm')]) },
        { texto: 'P no es el punto medio: queda a 4 cm de A, y 4 cm ≠ 5 cm.' },
      ],
      respuesta: ['AM = ', dF('5 cm')] });
  }
  {
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('M', 11), pto('B', 22)], tramos: [Object.assign(tr('A', 'M', 'x + 3', 1), { marcas: 1 }), Object.assign(tr('M', 'B', '11 cm', 1), { marcas: 1 })] };
    const AM = pinta(F, 'AM'), MB = pinta(F, 'MB');
    EJ2.push({ nivel: 1, titulo: 'Una mitad con letra', figura: fig(F),
      enunciado: ['M es el punto medio del segmento AB. ', AM, ' mide x + 3 (en cm) y ', MB, ' = 11 cm. ¿Cuánto vale x?'],
      datos: [dMedio('M', 'A', 'B', F)],
      solucion: [{ texto: ['Las dos mitades miden igual: igualo ', AM, ' con ', MB, '.'], ecuacion: [junto('x + 3 = 11'), '   →   ', junto(['x = ', dF('8')])] }],
      respuesta: ['x = ', dF('8')] });
  }
  {
    const F = { objeto: 'soga', soga: ['A', 'C'], panuelo: 'M', raya: 'B', puntos: [pto('A', 0), pto('M', 6), pto('B', 8), pto('C', 12)],
      tramos: [tr('M', 'B', '2 m', 1), tr('M', 'C', '6 m', 2), tr('B', 'C', '?', -1, 'pide')] };
    const MB = pinta(F, 'MB'), MC = pinta(F, 'MC');
    EJ2.push({ nivel: 1, titulo: 'De la raya a la punta', figura: fig(F),
      enunciado: ['En el tira y afloja, la raya B quedó entre el pañuelo M y la punta C. ', MC, ' = 6 m y ', MB, ' = 2 m. ¿Cuánto mide BC?'],
      datos: [['B entre M y C: ', MB, ' + BC = ', MC, '.']],
      solucion: [{ texto: ['A ', MC, ' le quito el tramo del pañuelo a la raya:'], ecuacion: junto(['BC = 6 − 2 = ', dF('4 m')]) }],
      respuesta: ['BC = ', dF('4 m')] });
  }
  {
    const F = { objeto: 'carretera', puntos: [pto('A', 0), pto('M', 0.75), pto('B', 1.5)], tramos: [tr('A', 'M', '?', 1, 'pide'), igual('M', 'B', 1, undefined, 1), tr('A', 'B', '1,5 km', -1, 'todo')] };
    EJ2.push({ nivel: 2, titulo: 'La mitad en metros', figura: fig(F),
      enunciado: 'Una avenida recta va de A a B y mide 1,5 km. En su punto medio M ponen un semáforo. ¿Cuántos metros hay de A al semáforo?',
      datos: ['1 km = 1000 m', dMedio('M', 'A', 'B', F)],
      solucion: [
        { texto: 'Paso AB a metros:', ecuacion: junto('AB = 1,5 · 1000 m = 1500 m') },
        { texto: 'AM es la mitad de AB:', ecuacion: junto(['AM = 1500 ÷ 2 = ', dF('750 m')]) },
      ],
      respuesta: ['AM = ', dF('750 m')] });
  }
  {
    const F = { objeto: 'soga', soga: ['A', 'C'], panuelo: 'M', raya: 'B', puntos: [pto('A', 0), pto('M', 5), pto('B', 7), pto('C', 10)],
      tramos: [tr('A', 'B', '7 m', 1), tr('A', 'C', '10 m', 2, 'todo'), tr('M', 'B', '?', -1, 'pide')] };
    const AB = pinta(F, 'AB');
    EJ2.push({ nivel: 2, titulo: 'El pañuelo y la raya', figura: fig(F),
      enunciado: ['La soga del tira y afloja mide 10 m, con el pañuelo M a su mitad. La raya B quedó a ', AB, ' = 7 m de la punta A. ¿A cuánto está el pañuelo de la raya?'],
      datos: [dMedio('M', 'A', 'C', F), D_SUMA],
      solucion: [
        { texto: 'El pañuelo está a la mitad de la soga:', ecuacion: junto('AM = 10 ÷ 2 = 5 m') },
        { texto: ['La raya está más lejos de A que el pañuelo: a ', AB, ' le quito AM.'], ecuacion: junto(['BM = 7 − 5 = ', dF('2 m')]) },
      ],
      respuesta: ['BM = ', dF('2 m')] });
  }
  {
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('M', 9), pto('B', 13), pto('C', 18)],
      tramos: [tr('A', 'B', '13 cm', 1), tr('B', 'C', '5 cm', 1), igual('A', 'M', 1), igual('M', 'C', 1), tr('B', 'M', '?', -1, 'pide')] };
    const AB = pinta(F, 'AB'), BC = pinta(F, 'BC');
    EJ2.push({ nivel: 2, titulo: 'Un punto entre los extremos', figura: fig(F),
      enunciado: ['B está entre A y C sobre una recta, con ', AB, ' = 13 cm y ', BC, ' = 5 cm. M es el punto medio de AC. ¿Cuánto mide BM?'],
      datos: [dMedio('M', 'A', 'C', F), D_SUMA],
      solucion: [
        { texto: 'Primero AC, y después su mitad:', ecuacion: [junto(['AC = 13 + 5 = 18 cm']), SEP, junto('AM = 18 ÷ 2 = 9 cm')] },
        { texto: ['B está más lejos de A que M: a ', AB, ' le quito AM.'], ecuacion: junto(['BM = 13 − 9 = ', dF('4 cm')]) },
      ],
      respuesta: ['BM = ', dF('4 cm')] });
  }
  {
    const F = { objeto: 'carretera', puntos: [pto('A', 0), pto('M', 4), pto('B', 8), pto('N', 14), pto('C', 20)],
      tramos: [tr('A', 'B', '8 m', 1), tr('B', 'C', '12 m', 1), igual('A', 'M', 1), igual('M', 'B', 1), igual('B', 'N', 2), igual('N', 'C', 2), tr('M', 'N', '?', -1, 'pide')] };
    const AB = pinta(F, 'AB'), BC = pinta(F, 'BC');
    EJ2.push({ nivel: 2, titulo: 'Dos bancas', figura: fig(F),
      enunciado: ['En una avenida recta, B está entre A y C: ', AB, ' = 8 m y ', BC, ' = 12 m. Hay una banca M a la mitad de ', AB, ' y otra, N, a la mitad de ', BC, '. ¿Cuánto hay de banca a banca?'],
      datos: [dMedio('M', 'A', 'B', F), dMedio('N', 'B', 'C', F)],
      solucion: [
        { texto: 'Cada banca está a la mitad de su tramo:', ecuacion: [junto('MB = 8 ÷ 2 = 4 m'), SEP, junto('BN = 12 ÷ 2 = 6 m')] },
        { texto: 'De M a N pasan por B: sumo los dos pedazos.', ecuacion: junto(['MN = 4 + 6 = ', dF('10 m')]) },
      ],
      respuesta: ['MN = ', dF('10 m')] });
  }
  {
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('M', 11), pto('B', 22)],
      tramos: [Object.assign(tr('A', 'M', '3x − 1', 1), { marcas: 1 }), Object.assign(tr('M', 'B', 'x + 7', 1), { marcas: 1 }), tr('A', 'B', '?', -1, 'pide')] };
    const AM = pinta(F, 'AM'), MB = pinta(F, 'MB');
    EJ2.push({ nivel: 2, titulo: 'Las dos mitades con x', figura: fig(F),
      enunciado: ['M es el punto medio de AB. En centímetros, ', AM, ' = 3x − 1 y ', MB, ' = x + 7. ¿Cuánto mide AB?'],
      datos: [dMedio('M', 'A', 'B', F), dSumaMedio('M', 'A', 'B', F)],
      solucion: [
        { texto: ['Las mitades miden igual: igualo ', AM, ' y ', MB, '.'], ecuacion: [junto('3x − 1 = x + 7'), '   →   ', junto('2x = 8'), '   →   ', junto('x = 4')] },
        { texto: 'Cada mitad mide 4 + 7 = 11 cm, y AB tiene dos:', ecuacion: junto(['AB = 2 · 11 = ', dF('22 cm')]) },
      ],
      respuesta: ['AB = ', dF('22 cm')] });
  }
  {
    // AB = 8, BC = 12 y CD = 14 (antes 6, 14 y 12): AC = 20 y BD = 26 siguen, y las rayitas de AM y MB caben.
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('M', 4), pto('B', 8), pto('C', 20), pto('N', 27), pto('D', 34)],
      tramos: [tr('A', 'C', '20 cm', 1), tr('B', 'D', '26 cm', 2), igual('A', 'M', 1), igual('M', 'B', 1), igual('C', 'N', 2), igual('N', 'D', 2), tr('M', 'N', '?', -1, 'pide')] };
    const AC = pinta(F, 'AC'), BD = pinta(F, 'BD');
    EJ2.push({ nivel: 3, titulo: 'Dos puntos medios', figura: fig(F),
      enunciado: ['A, B, C y D están en ese orden sobre una recta. M es el punto medio de AB y N, el de CD. Si ', AC, ' = 20 cm y ', BD, ' = 26 cm, ¿cuánto mide MN?'],
      datos: [dMedio('M', 'A', 'B', F), dMedio('N', 'C', 'D', F), D_SUMA],
      solucion: [
        { texto: 'MN junta media AB, todo BC y media CD.', ecuacion: junto(['MN = ', { frac: ['AB', '2'] }, ' + BC + ', { frac: ['CD', '2'] }, ' = ', { frac: ['AB + 2 · BC + CD', '2'] }]) },
        { texto: [AC, ' + ', BD, ' trae justo AB, CD y dos veces BC:'], ecuacion: junto(['MN = ', { frac: [[AC, ' + ', BD], '2'] }, ' = ', { frac: ['20 + 26', '2'] }, ' = ', dF('23 cm')]) },
        { texto: 'El error típico es dar 46 cm (no dividir) o 11,5 cm (dividir entre 4).' },
      ],
      respuesta: ['MN = ', dF('23 cm')] });
  }
  {
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('M', 14), pto('B', 22), pto('C', 28)],
      tramos: [tr('A', 'B', 'AB', 1), tr('B', 'C', 'BC', 1), igual('A', 'M', 1), igual('M', 'C', 1), tr('B', 'M', '?', -1, 'pide')] };
    const AB = pinta(F, 'AB'), BC = pinta(F, 'BC');
    EJ2.push({ nivel: 3, titulo: 'Un punto equidistante', figura: fig(F),
      enunciado: ['Sobre una recta, B está entre A y C, y M es el punto de AC equidistante de A y de C. Si ', AB, ' − ', BC, ' = 16 cm, ¿cuánto mide BM?'],
      datos: [['M equidistante de A y C, y entre ellos: AM = MC = ', { frac: ['AC', '2'] }, '.'], D_SUMA],
      solucion: [
        { texto: ['AC = ', AB, ' + ', BC, ', así que AM es la mitad de esa suma. B está más allá de M:'], ecuacion: junto(['BM = ', AB, ' − AM = ', AB, ' − ', { frac: [[AB, ' + ', BC], '2'] }]) },
        { texto: 'Junto todo en una sola fracción y reemplazo la diferencia:', ecuacion: junto(['BM = ', { frac: [[AB, ' − ', BC], '2'] }, ' = ', { frac: ['16', '2'] }, ' = ', dF('8 cm')]) },
        { texto: ['No hacía falta conocer ', AB, ' ni ', BC, ': basta su diferencia.'] },
      ],
      respuesta: ['BM = ', dF('8 cm')] });
  }
  {
    const F = { objeto: 'recta', puntos: [pto('O', 0), pto('A', 7), pto('M', 13), pto('B', 19)],
      tramos: [tr('O', 'A', '7 cm', 1), tr('O', 'B', '19 cm', 2), igual('A', 'M', 1), igual('M', 'B', 1), tr('O', 'M', '?', -1, 'pide')] };
    const OA = pinta(F, 'OA'), OB = pinta(F, 'OB');
    EJ2.push({ nivel: 3, titulo: 'Desde un punto de afuera', figura: fig(F),
      enunciado: ['O, A, M y B están en ese orden sobre una recta, y M es el punto medio de AB. Si ', OA, ' = 7 cm y ', OB, ' = 19 cm, ¿cuánto mide OM?'],
      datos: [dMedio('M', 'A', 'B', F), D_SUMA],
      solucion: [
        { texto: ['AB es lo que va de A a B:'], ecuacion: junto(['AB = ', OB, ' − ', OA, ' = 19 − 7 = 12 cm']) },
        { texto: 'Su mitad es AM = 6 cm. OM llega de O a A y sigue hasta M:', ecuacion: junto(['OM = 7 + 6 = ', dF('13 cm')]) },
        { texto: ['Es también el promedio de ', OA, ' y ', OB, ': (7 + 19) ÷ 2 = 13.'] },
      ],
      respuesta: ['OM = ', dF('13 cm')] });
  }
  {
    // AB = 8 (antes 12): con AB = 12, la «/» de MB y las «//» de AN se juntaban. BC = 18 y MN = 9 siguen.
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('M', 4), pto('B', 8), pto('N', 13), pto('C', 26)],
      tramos: [tr('B', 'C', '18 cm', 1), igual('A', 'M', 1), igual('M', 'B', 1), igual('A', 'N', 2), igual('N', 'C', 2), tr('M', 'N', '?', -1, 'pide')] };
    const BC = pinta(F, 'BC');
    EJ2.push({ nivel: 3, titulo: 'Sin saber cuánto mide AB', figura: fig(F),
      enunciado: ['A, B y C están en ese orden sobre una recta, con ', BC, ' = 18 cm. M es el punto medio de AB y N, el de AC. ¿Cuánto mide MN?'],
      datos: [dMedio('M', 'A', 'B', F), dMedio('N', 'A', 'C', F), D_SUMA],
      solucion: [
        { texto: ['No sé AB: lo llamo a. Entonces AM = a ÷ 2 y AC = a + 18.'], ecuacion: junto(['AN = ', { frac: ['a + 18', '2'] }, ' = ', { frac: ['a', '2'] }, ' + 9']) },
        { texto: 'M y N están en orden desde A, así que MN = AN − AM. La a se cancela:', ecuacion: junto(['MN = AN − AM = ', { frac: ['a', '2'] }, ' + 9 − ', { frac: ['a', '2'] }, ' = ', dF('9 cm')]) },
        { texto: ['Sale la mitad de ', BC, ', mida lo que mida AB.'] },
      ],
      respuesta: ['MN = ', dF('9 cm')] });
  }
  {
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('B', 8), pto('M', 16), pto('C', 32)],
      tramos: [tr('A', 'B', 'k', 1), tr('B', 'C', '3k', 1), tr('A', 'C', '32 cm', 2, 'todo'), igual('A', 'M', 1), igual('M', 'C', 1), tr('B', 'M', '?', -1, 'pide')] };
    const AB = pinta(F, 'AB'), BC = pinta(F, 'BC');
    EJ2.push({ nivel: 3, titulo: 'Razón y punto medio', figura: fig(F),
      enunciado: ['B está entre A y C sobre una recta, con ', AB, ' : ', BC, ' = 1 : 3 y AC = 32 cm. M es el punto medio de AC. ¿Cuánto mide BM?'],
      datos: [D_RAZON(AB, BC, 1, 3), dMedio('M', 'A', 'C', F), D_SUMA],
      solucion: [
        { texto: 'AC junta 1 + 3 = 4 partes:', ecuacion: [junto('4k = 32 cm'), '   →   ', junto('k = 8 cm'), SEP, junto([AB, ' = 8 cm'])] },
        { texto: 'El punto medio está a 32 ÷ 2 = 16 cm de A, más allá de B:', ecuacion: junto(['BM = AM − ', AB, ' = 16 − 8 = ', dF('8 cm')]) },
      ],
      respuesta: ['BM = ', dF('8 cm')] });
  }

  // «Ahora tú» de la idea 2. Tipo 0: B entre M y C (o entre A y M), con AB y BC dados: BM.
  function casoMedio(r) {
    const q = r.ent(2, 9), k = r.ent(1, 7), p = q + 2 * k, ac = p + q, m = ac / 2;
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('M', m), pto('B', p), pto('C', ac)],
      tramos: [tr('A', 'B', `${p} cm`, 1), tr('B', 'C', `${q} cm`, 1), igual('A', 'M', 1), igual('M', 'C', 1), tr('B', 'M', '?', -1, 'pide')] };
    const AB = pinta(F, 'AB'), BC = pinta(F, 'BC');
    return {
      pregunta: ['B está entre A y C sobre una recta, con ', AB, ` = ${p} cm y `, BC, ` = ${q} cm. M es el punto medio de AC. ¿Cuánto mide BM?`],
      datos: [dMedio('M', 'A', 'C', F), D_SUMA],
      dibujo: { datos: F, estado: {} },
      opciones: opciones(k, [
        { id: 'resta', valor: p - q, error: 'GE-PM3', siFuera: 'Comparar AB con BC va bien; pero esa diferencia se reparte: BM es su mitad.' },
        { id: 'am', valor: m, error: 'GE-PM4', siFuera: `Hallar AM = ${f(m)} cm está bien; falta ir de M a B.` },
        { id: 'ab2', valor: p / 2, error: 'GE-PM5', siFuera: 'Partir en dos está bien, pero se parte AC, no AB.' },
      ], x => `${f(x)} cm`),
      solucion: { texto: `AC = ${p} + ${q} = ${ac} cm y AM = ${f(m)} cm. B está más allá de M:`, ecuacion: junto(['BM = ', `${p} − ${f(m)} = `, dF(`${f(k)} cm`)]) },
    };
  }
  // Tipo 1: dos puntos medios (M de AB y N de CD) con AC y BD dados.
  function casoDosMedios(r) {
    const a = 2 * r.ent(1, 6), b = r.ent(2, 12), c = 2 * r.ent(1, 6), p = a + b, q = b + c, mn = (p + q) / 2, u = r.de(['cm', 'm']);
    const F = { objeto: u === 'm' ? 'carretera' : 'recta', puntos: [pto('A', 0), pto('M', a / 2), pto('B', a), pto('C', a + b), pto('N', a + b + c / 2), pto('D', a + b + c)],
      tramos: [tr('A', 'C', `${p} ${u}`, 1), tr('B', 'D', `${q} ${u}`, 2), igual('A', 'M', 1), igual('M', 'B', 1), igual('C', 'N', 2), igual('N', 'D', 2), tr('M', 'N', '?', -1, 'pide')] };
    const AC = pinta(F, 'AC'), BD = pinta(F, 'BD');
    const fm = x => `${f(x)} ${u}`;
    const ops = [{ id: 'c', texto: fm(mn), correcta: true },
      { id: 'suma', texto: fm(p + q), error: 'GE-PM1', siFuera: 'Sumar AC y BD va bien; pero esa suma trae AB y CD enteros y BC dos veces: falta partirla.' },
      { id: 'cuarto', texto: fm((p + q) / 4), error: 'GE-PM2', siFuera: 'Dividir está bien, una sola vez: entre 4 se parte también BC.' },
      { id: 'falta', texto: 'No se puede: falta BC', error: 'GE-SEG3', siFuera: 'Con BC saldría, es cierto; pero no hace falta: en la cuenta, BC se junta solo.' }];
    return {
      pregunta: ['A, B, C y D están en ese orden sobre una recta. M es el punto medio de AB y N, el de CD. Si ', AC, ` = ${p} ${u} y `, BD, ` = ${q} ${u}, ¿cuánto mide MN?`],
      datos: [dMedio('M', 'A', 'B', F), dMedio('N', 'C', 'D', F), D_SUMA],
      dibujo: { datos: F, estado: {} },
      opciones: ops,
      solucion: { texto: ['MN junta media AB, todo BC y media CD: la mitad de ', AC, ' + ', BD, '.'], ecuacion: junto(['MN = ', { frac: [`${p} + ${q}`, '2'] }, ' = ', dF(fm(mn))]) },
    };
  }
  // Tipo 2 (examen, como San Marcos 2025-II): el punto equidistante y la diferencia de los dos tramos.
  function casoEquidistante(r) {
    const k = r.ent(2, 12), q = r.ent(2, 9), p = q + 2 * k, ac = p + q;
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('M', ac / 2), pto('B', p), pto('C', ac)],
      tramos: [tr('A', 'B', 'AB', 1), tr('B', 'C', 'BC', 1), igual('A', 'M', 1), igual('M', 'C', 1), tr('B', 'M', '?', -1, 'pide')] };
    const AB = pinta(F, 'AB'), BC = pinta(F, 'BC'), d = 2 * k;
    const ops = [{ id: 'c', texto: `${k} cm`, correcta: true },
      { id: 'resta', texto: `${d} cm`, error: 'GE-PM3', siFuera: 'Usar la diferencia es la idea; pero BM es solo su mitad.' },
      { id: 'doble', texto: `${2 * d} cm`, error: 'GE-PM6', siFuera: 'La diferencia y BM sí van juntas por un 2; pero BM es la mitad, no el doble.' },
      { id: 'falta', texto: ['No se puede: faltan ', AB, ' y ', BC], error: 'GE-SEG3', siFuera: 'Con AB y BC saldría; pero basta su diferencia: lo demás se cancela.' }];
    return {
      pregunta: ['Sobre una recta, B está entre A y C, y M es el punto de AC equidistante de A y de C. Si ', AB, ' − ', BC, ` = ${d} cm, ¿cuánto mide BM?`],
      datos: [['M equidistante de A y C, y entre ellos: AM = MC = ', { frac: ['AC', '2'] }, '.'], D_SUMA],
      dibujo: { datos: F, estado: {} },
      opciones: ops,
      solucion: { texto: ['BM = ', AB, ' − AM, y AM es la mitad de ', AB, ' + ', BC, ':'], ecuacion: junto(['BM = ', { frac: [[AB, ' − ', BC], '2'] }, ` = ${d} ÷ 2 = `, dF(`${k} cm`)]) },
    };
  }
  // Tipo 3 (examen): un punto O afuera del segmento y M, el punto medio de AB.
  function casoAfuera(r) {
    const oa = r.ent(2, 12), h = r.ent(2, 9), ob = oa + 2 * h, om = oa + h, u = r.de(['cm', 'm']);
    const F = { objeto: u === 'm' ? 'carretera' : 'recta', puntos: [pto('O', 0), pto('A', oa), pto('M', om), pto('B', ob)],
      tramos: [tr('O', 'A', `${oa} ${u}`, 1), tr('O', 'B', `${ob} ${u}`, 2), igual('A', 'M', 1), igual('M', 'B', 1), tr('O', 'M', '?', -1, 'pide')] };
    const OA = pinta(F, 'OA'), OB = pinta(F, 'OB');
    return {
      pregunta: ['O, A, M y B están en ese orden sobre una recta, y M es el punto medio de AB. Si ', OA, ` = ${oa} ${u} y `, OB, ` = ${ob} ${u}, ¿cuánto mide OM?`],
      datos: [dMedio('M', 'A', 'B', F), D_SUMA],
      dibujo: { datos: F, estado: {} },
      opciones: opciones(om, [
        { id: 'am', valor: h, error: 'GE-PM4', siFuera: `La mitad de AB es ${h} ${u}, bien; falta sumarle OA para llegar de O a M.` },
        { id: 'ab', valor: 2 * h, error: 'GE-SEG5', siFuera: `${ob} − ${oa} es una resta válida: da AB, no OM.` },
        { id: 'suma', valor: oa + ob, error: 'GE-PM3', siFuera: 'Juntar OA y OB va bien; pero esa suma es el doble de OM.' },
      ], x => `${f(x)} ${u}`),
      solucion: { texto: `AB = ${ob} − ${oa} = ${2 * h} ${u}; su mitad es AM = ${h} ${u}.`, ecuacion: junto(['OM = ', `${oa} + ${h} = `, dF(`${om} ${u}`)]) },
    };
  }

  const medio = {
    id: 'punto-medio',
    titulo: 'El punto medio',
    pregunta: '¿Dónde queda el punto medio si hay otro punto entre los extremos?',
    temas: ['Segmentos y su medida'],
    pieza: GO,
    aprendizaje: 'M, el punto medio de AC, deja dos mitades iguales; si B está entre A y C, BM es la mitad de AB − BC.',
    actividad: 'Jalar la soga del tira y afloja y comparar dónde queda el pañuelo con la raya.',
    // Lee: el tira y afloja, el punto medio, «equidistante» y qué mirar. No dice qué pasa con dos puntos medios (eso es
    // «Predice») ni la cuenta de BM (eso se descubre al jugar).
    lee: {
      tarjetas: [
        { titulo: 'El tira y afloja', texto: 'En el aniversario del colegio, dos equipos jalan una soga de 10 m. Sus puntas son A y C. Un pañuelo atado a la mitad de la soga marca el punto M, y en el patio hay una raya pintada: el punto B.',
          // La raya y el pañuelo separados (auditoría, 17 nov: con la soga pareja, B y M caían en el mismo punto y se leía «BM»).
          pieza: GO, dibujo: { datos: { objeto: 'soga', vista: [-9, 9], soga: ['A', 'C'], panuelo: 'M', raya: 'B', puntos: [pto('A', -7), pto('B', 0), pto('M', -2), pto('C', 3)], tramos: [tr('A', 'C', '10 m', 1, 'todo')] }, estado: {} } },
        { titulo: 'El punto medio', texto: 'M es el punto medio de AC: está entre A y C y parte la soga en dos mitades iguales, AM = MC = 5 m. Por eso M es equidistante de A y de C. Las mitades llevan arcos con la misma rayita: miden lo mismo.',
          // Las mitades con su arco, como en todos los ejercicios (ronda 2 del lector, 18 nov: la rayita sobre la línea se leía
          // como el tramo de otro punto).
          pieza: GO, dibujo: { datos: { objeto: 'soga', vista: [-9, 9], soga: ['A', 'C'], panuelo: 'M', puntos: [pto('A', -5), pto('M', 0), pto('C', 5)], tramos: [tr('A', 'C', '10 m', 1, 'todo'), igual('A', 'M', 1), igual('M', 'C', 1)] }, estado: {} } },
        { titulo: 'Qué mirar al jugar', texto: ['Tu equipo jala de la punta A. Mira ', AB2, ', la soga de tu lado de la raya, y ', BC2, ', la del otro lado. Compara cuánto se diferencian con BM, lo que el pañuelo se alejó de la raya.'] },
      ],
    },
    ejemplos: EJ2,
    juega: {
      pieza: GO,
      consigna: 'Dos equipos jalan una soga de 10 m con un pañuelo atado a su mitad. Tu equipo jala de la punta A.',
      mision: {
        texto: 'Jala hasta que el pañuelo quede de tu lado, a 1,5 m de la raya.',
        logrado: v => Math.abs(v.ab - 6.5) < 1e-9,
        bien: 'Listo: 6,5 − 3,5 = 3 m, el doble de BM = 1,5 m.',
      },
      voz: '¿Cuánto se mueve el pañuelo si tu lado gana un metro?',
      leyenda: [
        { s: 'A, C', t: 'las puntas de la soga' },
        { s: 'M', t: 'el pañuelo, a la mitad' },
        { s: 'B', t: 'la raya pintada en el patio' },
        { s: dO('naranja'), t: 'AB: soga de tu lado' },
        { s: dI('turquesa'), t: 'BC: soga del otro lado' },
        { s: 'BM', t: 'del pañuelo a la raya' },
      ],
      controles: [{ id: 'ab', etiqueta: 'Soga de tu lado de la raya (AB)', min: 2, max: 8, paso: 0.5, inicio: 5, unidad: 'm', decimales: 1 }],
      dibujo: v => ({ datos: figSoga(v.ab), estado: {} }),
      // Gesto directo: se agarra el pañuelo y se corre la soga entera; la raya no se mueve.
      arrastres: [{ id: 'panuelo', etiqueta: 'el pañuelo: corre la soga',
        donde: v => { const p = PO.geometria(figSoga(v.ab)).P.M; return { x: p[0], y: p[1] }; },
        mover: (pt, v) => ({ ab: SOGA / 2 - PO.geometria(figSoga(v.ab)).km(pt.x) }) }],
      lectura: v => {
        const ab = v.ab, bc = SOGA - ab, bm = Math.abs(ab - SOGA / 2);
        if (bm < 1e-9) return [AB2, ' = ', BC2, ' = 5 m: el pañuelo está sobre la raya'];
        return ab > bc ? [AB2, ' − ', BC2, ` = ${f(ab - bc)} m, el doble de BM = ${f(bm)} m`]
          : [BC2, ' − ', AB2, ` = ${f(bc - ab)} m, el doble de BM = ${f(bm)} m`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'En una avenida recta están, en orden, los paraderos A, B, C y D. Ponen una banca M a la mitad de AB y otra, N, a la mitad de CD. ¿Cuánto hay de banca a banca?',
      datos: [[dO('AC'), ' = 12 m'], [dI('BD'), ' = 18 m']],
      voz: 'No hace falta medir BC. Piensa qué trae cada tramo.',
      opciones: [
        { id: 'c', texto: '15 m', correcta: true },
        { id: 'suma', texto: '30 m', error: 'GE-PM1', siFuera: 'Sumar AC y BD va bien; pero la suma trae AB y CD enteros y BC dos veces.' },
        { id: 'cuarto', texto: '7,5 m', error: 'GE-PM2', siFuera: 'Dividir está bien, una sola vez: entre 4 se parte también BC.' },
        { id: 'falta', texto: 'No se puede: falta cuánto mide BC', error: 'GE-SEG3', siFuera: 'Con BC saldría, es cierto; pero no hace falta: en la cuenta, BC se junta solo.' },
      ],
      dibujo: { datos: figBancas({ mn: '?' }), estado: {} },
      revelar: { datos: figBancas({ mn: mt(MN_P), papel: 'otro', mitades: true }), estado: {} },
      coincide: `Coincide: MN = ${f(MN_P)} m, la mitad de AC + BD = ${f(PC - PA + PD - PB)} m.`,
      noCoincide: `Revisemos: de banca a banca hay ${f(MN_P)} m, la mitad de 12 m + 18 m.`,
    },
    mira: {
      pieza: GO,
      datos: { objeto: 'carretera', puntos: figBancas({}).puntos,
        tramos: [tr('A', 'C', '12 m', 1), tr('B', 'D', '18 m', 2), ...igualesPaso(0, 0),
          Object.assign(tr('M', 'N', [{ t: '?', paso: 1 }, { t: mt(MN_P), paso: 3 }], -1, 'pide'), { paso: 1 })] },
      voz: 'Sigue las mitades: cada banca toma la mitad de su tramo.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Cada banca parte su tramo en dos mitades iguales.' },
        { estado: { paso: 1 }, texto: 'De banca a banca hay media AB, todo BC y media CD.', ecuacion: junto(['MN = MB + BC + CN']) },
        { estado: { paso: 2 }, texto: [dO('AC'), ' y ', dI('BD'), ' juntos traen AB, CD y dos veces BC.'], ecuacion: junto([dO('AC'), ' + ', dI('BD'), ' = AB + 2 · BC + CD = 30 m']) },
        { estado: { paso: 3 }, texto: 'MN es justo la mitad de esa suma.', ecuacion: junto(['MN = ', { frac: [[dO('AC'), ' + ', dI('BD')], '2'] }, ' = ', { frac: ['30', '2'] }, ` = ${f(MN_P)} m`]) },
        { estado: { paso: 3 }, texto: 'Entre 4 se partiría también BC: por eso 7,5 m no cuadra.', ecuacion: junto('30 ÷ 4 = 7,5 m ≠ MN') },
      ],
    },
    // La regla tiene su propio dibujo (regla.dibujo, docs/teoria.md 4i; mesa del 18 nov, auditoría M2: junto a las bancas
    // el lector en frío se perdió): la recta de examen con M en la mitad de AC y B entre M y C, a escala, con las mismas
    // (B en 6,5 y no en 7: en 7 caía casi en la mitad de MC y su rayita lo tachaba; la prueba M6 pide 16 px en la regla)
    // letras y colores que el texto (AB naranja, BC turquesa; AC, las mitades y BM en tinta). Sin medidas: las cotas
    // llevan el nombre del tramo, así que no da ninguna respuesta de «Ahora tú». Los dos puntos medios (las bancas) se
    // quedan en la predicción y en «Mira».
    regla: {
      texto: 'El punto medio M parte AC en dos mitades iguales. Si B está entre A y C, BM es la mitad de la diferencia de sus dos tramos.',
      ecuacion: [junto(['AM = MC = ', { frac: ['AC', '2'] }]), SEP, junto(['BM = ', { frac: [[AB2, ' − ', BC2], '2'] }])],
      condicion: 'M está entre A y C, con AM = MC, y B está entre M y C.',
      voz: 'El punto medio reparte en mitades; las diferencias también se reparten.',
      dibujo: { pieza: GO, datos: { objeto: 'recta', puntos: [pto('A', 0), pto('M', 5), pto('B', 6.5), pto('C', 10)],
        tramos: [tr('A', 'B', 'AB', 1), tr('B', 'C', 'BC', 1), tr('A', 'C', 'AC', 2, 'todo'), igual('A', 'M', 1), igual('M', 'C', 1), tr('B', 'M', 'BM', -1, 'otro')] }, estado: {} },
    },
    // Así se resuelve: las dos mitades con expresiones (se igualan). «Ahora tú» pide otras cosas: BM con B entre los
    // extremos, dos puntos medios, el punto equidistante con una diferencia y un punto de afuera.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900), v = r.ent(2, 9), a1 = r.ent(3, 5), a2 = r.ent(1, a1 - 1), b1 = r.ent(-3, 6), h = a1 * v + b1, b2 = h - a2 * v;
        const ex = (a, b) => `${a === 1 ? '' : a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`.replace(/ \+ 0$/, '');
        const e1 = ex(a1, b1), e2 = ex(a2, b2);
        const F = { objeto: 'recta', puntos: [pto('A', 0), pto('M', h), pto('B', 2 * h)],
          tramos: [Object.assign(tr('A', 'M', e1, 1), { marcas: 1 }), Object.assign(tr('M', 'B', e2, 1), { marcas: 1 }), tr('A', 'B', '?', -1, 'pide')] };
        const AM = pinta(F, 'AM'), MB = pinta(F, 'MB');
        return {
          enunciado: ['M es el punto medio de AB. En centímetros, ', AM, ` = ${e1} y `, MB, ` = ${e2}. ¿Cuánto mide AB?`],
          datos: [dMedio('M', 'A', 'B', F), dSumaMedio('M', 'A', 'B', F)],
          dibujo: { datos: F, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden AB, el segmento entero.' },
            { tipo: 'datos', texto: ['M es el punto medio, y sus dos mitades vienen con x: ', AM, ` = ${e1} y `, MB, ` = ${e2}.`] },
            { tipo: 'regla', texto: 'El punto medio deja dos mitades iguales: igualo las dos expresiones para hallar x.', ecuacion: junto([AM, ' = ', MB]) },
            { tipo: 'cuentas', texto: `Despejo x y reemplazo: cada mitad mide ${h} cm, y AB tiene dos.`, ecuacion: [junto(`${e1} = ${e2}`), '   →   ', junto(`x = ${v}`), SEP, junto(['AB = 2 · ', `${h} = `, dF(`${2 * h} cm`)])] },
            { tipo: 'sentido', texto: `Compruebo con x = ${v}: ${a1} · ${v} ${b1 < 0 ? '−' : '+'} ${Math.abs(b1)} = ${h} y ${a2} · ${v} ${b2 < 0 ? '−' : '+'} ${Math.abs(b2)} = ${h}. Las dos mitades miden igual.` },
          ],
          respuesta: ['AB = ', dF(`${2 * h} cm`)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Marca las mitades iguales antes de sumar o restar.',
      // Si las rayitas de «miden igual» no caben lejos de los puntos (M6 de la auditoría), otro caso con el mismo azar.
      generar(s) { const caso = [casoMedio, casoDosMedios, casoEquidistante, casoAfuera][s % 4]; return conCuatro(r => { for (let k = 0; ; k++) { const c = caso(r); if (!c.dibujo || PO.marcasCaben(c.dibujo.datos) || k > 200) return c; } }, azar(s + 57)); },
    },
  };

  // ---------- Ideas 3 a 6: ángulos ----------
  // Las figuras son escenas de geo-objeto: los trazos y los arcos los dibuja geo-figura a escala (cada ángulo con su
  // valor real) y la pieza pone el objeto debajo y los rótulos donde no pisan los lados. Las de examen son
  // { objeto: 'angulos', figura } con rayos, rectas y ángulos; cada ángulo lleva mide (su valor en el problema), que
  // segmentos-y-angulos.test.js compara con lo que se dibuja.
  const dH = t => ({ v: 'c-h', t });
  const L1 = { sub: ['L', '1'] }, L2 = { sub: ['L', '2'] };
  const figA = (figura, ls) => ({ pieza: GO, datos: Object.assign({ objeto: 'angulos', figura }, ls ? { ls } : {}), estado: {} });
  const esc = datos => ({ pieza: GO, datos, estado: {} });
  // Rayos desde O: rayos [{ id, dir (grados), largo, discontinua }], angs [{ de, a, texto, color, mide, mayor, radio }].
  // O va del lado contrario a los rayos; la vista abraza los rayos.
  function abanico(rayos, angs, o = {}) {
    const R = o.R || 2.5;
    const pts = rayos.map(q => { const p = U.polar([0, 0], q.largo || R, q.dir); return { id: q.id, x: p[0], y: p[1], rotulo: q.rotulo === undefined ? q.id : q.rotulo, lado: q.dir, sinPunto: true }; });
    // La O va en la bisectriz del hueco más ancho entre los rayos (el lado libre, o el ángulo mayor si dan la vuelta).
    const ds = rayos.filter(q => !q.sinRayo).map(q => ((q.dir % 360) + 360) % 360).sort((a, b) => a - b);
    let hueco = [ds[ds.length - 1], ds[0] + 360];
    for (let i = 1; i < ds.length; i++) if (ds[i] - ds[i - 1] > hueco[1] - hueco[0]) hueco = [ds[i - 1], ds[i]];
    const ladoO = o.ladoO !== undefined ? o.ladoO : (hueco[0] + hueco[1]) / 2;
    const conMayor = angs.some(a => a.mayor), pad = o.pad || (conMayor ? 1.25 : 0.8);
    const xs = [0, ...pts.map(p => p.x)], ys = [0, ...pts.map(p => p.y)];
    return { alt: o.alt, vista: { x: [Math.min(...xs) - pad, Math.max(...xs) + pad], y: [Math.min(...ys) - pad, Math.max(...ys) + pad] }, alto: o.alto || 230,
      puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: ladoO }, ...pts],
      segmentos: [...(o.rectas || []).map(([a, b, dis]) => ({ de: a, a: b, discontinua: !!dis })), ...rayos.filter(q => !q.sinRayo).map(q => ({ de: 'O', a: q.id, discontinua: q.discontinua }))],
      angulos: angs.map(a => Object.assign({ en: 'O', radio: 28 }, a)) };
  }
  const clase = g => (g === 0 ? 'nulo' : g < 90 ? 'agudo' : g === 90 ? 'recto' : g < 180 ? 'obtuso' : g === 180 ? 'llano' : 'no convexo');
  const CLASES = ['agudo', 'recto', 'obtuso', 'llano', 'no convexo'];
  const D_CLASES = 'Agudo: menos de 90°. Recto: 90°. Obtuso: entre 90° y 180°. Llano: 180°. No convexo: más de 180°.';
  const D_CONSEC = (a, b, c) => `Consecutivos: m∠${a}O${c} = m∠${a}O${b} + m∠${b}O${c}.`;
  const D_VUELTA = 'Una vuelta completa: 360°.';
  const D_RELOJ = 'El reloj tiene 12 números a igual distancia.';

  // ---------- Idea 3 (17 nov): clases de ángulos ----------
  // Objeto de la primera pantalla: el reloj de la plaza (geo-objeto, reloj; dibujo de prueba), con el minutero en las 12.
  // Cambia: la hora en punto (el horario). · Permanece: el minutero en las 12 y el largo de las agujas. · Progresa: la
  // clase del ángulo, de nulo a no convexo. · Se reserva: dos relojes de tamaño distinto (la predicción). · Debe verse:
  // la medida cuenta la abertura (los espacios de 30°), no el largo de las agujas.
  // Colores: el ángulo entre las agujas en carmín; las agujas en tinta. En los ejercicios, todo ángulo dado en carmín y
  // lo pedido con «?» en tinta.
  // Errores (hipótesis, sin medir): GE-ANG1 el ángulo crece con el largo de los lados (el «error objetivo» de la matriz),
  // GE-ANG2 mismo tipo de hora, mismo ángulo, GE-ANG3 nombra mal la clase, GE-ANG4 (nuevo) cree que no se pueden comparar
  // ángulos de figuras de distinto tamaño, GE-ANG5 (nuevo) toma el arco mayor del reloj, GE-ANG6 (nuevo) cuenta 6° por
  // número (los de un minuto), GE-ANG7 (nuevo) reparte media vuelta entre 12, GE-ANG8 (nuevo) se queda en x, GE-ANG9
  // (nuevo) da el otro ángulo, GE-ANG10 (nuevo) cree que alrededor de un punto se suma 180°.
  const reloj1 = (hora, o = {}) => ({ objeto: 'reloj', relojes: [Object.assign({ hora, tam: 'plaza', O: true, arco: hora % 12 ? { texto: `${(hora % 12) * 30}°`, color: 'h' } : null }, o)] });
  const relojes2 = o => ({ objeto: 'reloj', relojes: [{ hora: 1, tam: 'plaza', arco: o.a }, { hora: 2, tam: 'pulsera', arco: o.b, alarga: o.alarga }] });
  const consec = (a, b, giro, o = {}) => abanico([{ id: 'A', dir: giro }, { id: 'B', dir: giro + a }, { id: 'C', dir: giro + a + b }],
    [{ de: 'A', a: 'B', texto: o.ta || `${a}°`, color: o.ta === '?' ? undefined : 'h', mide: a, radio: 24 }, { de: 'B', a: 'C', texto: o.tb || `${b}°`, color: o.tb === '?' ? undefined : 'h', mide: b, radio: 24 },
      ...(o.total === false ? [] : [{ de: 'A', a: 'C', texto: o.tt || '?', color: o.ct, mide: a + b, radio: 46, mayor: a + b > 180 }])],
    { alt: o.alt || 'Tres rayos OA, OB y OC: ∠AOB y ∠BOC son consecutivos.' });

  // Ejemplos de «Clases de ángulos». Cuentas rehechas aparte (cuentas.js): 3 × 30 = 90; 135 entre 90 y 180; 35 + 50 = 85;
  // 40 se queda; 180 − 70 = 110; reloj de las 10: 2 × 30 = 60 (y 300 el otro); 25 + 40 + 55 = 120; 3k = 150 → 50 y
  // 100; x + 20 + 2x = 110 → x = 30, 60; 360 − 140 = 220; 10x = 360 → 36, 144; las 7: 5 × 30 = 150; 4x + 20 = 180 → 40,
  // 110; 3x + 150 = 360 → 70, 140 y 100; 80 + 100 − 150 = 30.
  const EJ3 = [];
  EJ3.push({ nivel: 1, titulo: 'Las agujas a las 3:00', figura: esc(reloj1(3, { arco: { texto: '?' }, O: false })),
    enunciado: 'El minutero del reloj de la plaza marca las 12 y el horario, las 3. ¿Cuánto mide el ángulo entre las agujas y qué clase de ángulo es?',
    datos: [D_VUELTA, D_RELOJ, D_CLASES],
    solucion: [
      { texto: 'De un número al siguiente hay 360° ÷ 12 = 30°. De las 12 a las 3 hay 3 espacios:', ecuacion: junto(['3 × 30° = ', dF('90°')]) },
      { texto: 'Justo 90°: es un ángulo recto.' },
    ],
    respuesta: [dF('90°'), ': ángulo recto'] });
  EJ3.push({ nivel: 1, titulo: 'Un ángulo de 135°', figura: figA(abanico([{ id: 'A', dir: 0 }, { id: 'B', dir: 135 }], [{ de: 'A', a: 'B', texto: '135°', color: 'h', mide: 135 }], { alt: 'Ángulo AOB de 135°.' })),
    enunciado: 'El ángulo AOB mide 135°. ¿Qué clase de ángulo es?',
    datos: [D_CLASES],
    solucion: [{ texto: '135° pasa de 90° y no llega a 180°:', ecuacion: junto('90° < 135° < 180°') }],
    respuesta: ['Es ', dF('obtuso')] });
  EJ3.push({ nivel: 1, titulo: 'Dos consecutivos', figura: figA(consec(35, 50, 10)),
    enunciado: '∠AOB y ∠BOC son consecutivos: comparten el lado OB, que queda en medio. m∠AOB = 35° y m∠BOC = 50°. ¿Cuánto mide ∠AOC?',
    datos: [D_CONSEC('A', 'B', 'C')],
    solucion: [{ texto: 'OB está entre OA y OC: las dos aberturas se suman.', ecuacion: junto(['m∠AOC = 35° + 50° = ', dF('85°')]) }],
    respuesta: ['m∠AOC = ', dF('85°')] });
  EJ3.push({ nivel: 1, titulo: 'Lados más largos', figura: figA(abanico([{ id: 'A', dir: 0, largo: 1.4, rotulo: '' }, { id: 'B', dir: 40, largo: 1.4, rotulo: '' }, { id: 'P', dir: 0, rotulo: 'A', sinRayo: true }, { id: 'Q', dir: 40, rotulo: 'B', sinRayo: true }],
    [{ de: 'A', a: 'B', texto: '40°', color: 'h', mide: 40 }], { alt: 'Ángulo AOB de 40°, con sus lados alargados en discontinuo.', rectas: [['A', 'P', true], ['B', 'Q', true]] })),
    enunciado: 'El ángulo AOB mide 40° y sus lados miden 2 cm. Si alargamos los dos lados hasta 10 cm, ¿cuánto mide el ángulo?',
    datos: ['La medida de un ángulo es su abertura, en grados.'],
    solucion: [{ texto: 'Al alargar los lados, la abertura entre ellos no cambia: el ángulo sigue igual.', ecuacion: junto(['m∠AOB = ', dF('40°')]) }],
    respuesta: ['Sigue midiendo ', dF('40°')] });
  EJ3.push({ nivel: 1, titulo: 'Media vuelta', figura: figA(abanico([{ id: 'A', dir: 0 }, { id: 'B', dir: 70 }, { id: 'D', dir: 180 }], [{ de: 'A', a: 'B', texto: '70°', color: 'h', mide: 70 }, { de: 'B', a: 'D', texto: '?', mide: 110, radio: 30 }], { alt: 'A, O y D en una recta; el rayo OB forma 70° con OA.' })),
    enunciado: 'A, O y D están en una recta, con O en medio. El rayo OB forma m∠AOB = 70°. ¿Cuánto mide ∠BOD?',
    datos: ['Ángulo llano: 180°.', D_CONSEC('A', 'B', 'D')],
    solucion: [
      { texto: '∠AOD es llano: OA y OD forman una recta.', ecuacion: junto('m∠AOB + m∠BOD = 180°') },
      { texto: 'Le quito los 70°:', ecuacion: junto(['m∠BOD = 180° − 70° = ', dF('110°')]) },
    ],
    respuesta: ['m∠BOD = ', dF('110°')] });
  EJ3.push({ nivel: 2, titulo: 'Las agujas a las 10:00', figura: esc(reloj1(10, { arco: { texto: '?', corto: true }, O: false })),
    enunciado: 'El reloj de la plaza marca las 10:00. ¿Cuánto mide el ángulo convexo que forman las agujas y qué clase de ángulo es?',
    datos: [D_VUELTA, D_RELOJ, D_CLASES],
    solucion: [
      { texto: 'Entre el 10 y el 12 hay 2 espacios de 360° ÷ 12 = 30°:', ecuacion: junto(['2 × 30° = ', dF('60°')]) },
      { texto: 'El otro arco mide 360° − 60° = 300°: ese es el no convexo. El convexo, 60°, es agudo.' },
    ],
    respuesta: [dF('60°'), ': agudo'] });
  {
    const F = abanico([{ id: 'A', dir: 0 }, { id: 'B', dir: 25 }, { id: 'C', dir: 65 }, { id: 'D', dir: 120 }],
      [{ de: 'A', a: 'B', texto: '25°', color: 'h', mide: 25, radio: 24 }, { de: 'B', a: 'C', texto: '40°', color: 'h', mide: 40, radio: 24 }, { de: 'C', a: 'D', texto: '55°', color: 'h', mide: 55, radio: 24 }, { de: 'A', a: 'D', texto: '?', mide: 120, radio: 50, centro: true }],
      { alt: 'Cuatro rayos OA, OB, OC y OD, en ese orden.' });
    EJ3.push({ nivel: 2, titulo: 'Tres consecutivos', figura: figA(F),
      enunciado: 'Los rayos OA, OB, OC y OD salen de O en ese orden. m∠AOB = 25°, m∠BOC = 40° y m∠COD = 55°. ¿Cuánto mide ∠AOD y qué clase es?',
      datos: ['Consecutivos: sus medidas se suman.', D_CLASES],
      solucion: [
        { texto: 'Los tres ángulos van uno al lado del otro: sumo.', ecuacion: junto(['m∠AOD = 25° + 40° + 55° = ', dF('120°')]) },
        { texto: '120° está entre 90° y 180°: es obtuso.' },
      ],
      respuesta: ['m∠AOD = ', dF('120°'), ', obtuso'] });
  }
  EJ3.push({ nivel: 2, titulo: 'Uno es el doble del otro', figura: figA(consec(100, 50, 15, { ta: '2k', tb: 'k', tt: '150°', ct: 'h' })),
    enunciado: '∠AOB y ∠BOC son consecutivos, m∠AOC = 150° y ∠AOB mide el doble que ∠BOC. ¿Cuánto mide cada uno?',
    // (Ronda 2 del lector, 18 nov: «miden 2k y k» en Datos daba el planteamiento hecho; queda en la figura.)
    datos: [D_CONSEC('A', 'B', 'C')],
    solucion: [
      { texto: 'Llamo k a m∠BOC; m∠AOB, el doble, es 2k. Juntos son 3k, y hacen los 150°:', ecuacion: [junto('3k = 150'), '   →   ', junto('k = 50')] },
      { texto: 'Entonces:', ecuacion: [junto(['m∠BOC = ', dF('50°')]), SEP, junto(['m∠AOB = 2 · 50 = ', dF('100°')])] },
    ],
    respuesta: ['m∠AOB = ', dF('100°'), ' y m∠BOC = ', dF('50°')] });
  EJ3.push({ nivel: 2, titulo: 'Con una x', figura: figA(consec(50, 60, 20, { ta: 'x + 20°', tb: '2x', total: false })),
    enunciado: '∠AOB y ∠BOC son consecutivos. m∠AOB = x + 20°, m∠BOC = 2x y m∠AOC = 110°. ¿Cuánto mide ∠BOC?',
    datos: [D_CONSEC('A', 'B', 'C')],
    solucion: [
      { texto: 'Sumo las dos expresiones e igualo a 110°:', ecuacion: [junto('x + 20° + 2x = 110°'), '   →   ', junto('3x = 90'), '   →   ', junto('x = 30')] },
      { texto: 'Me piden ∠BOC, no x:', ecuacion: junto(['m∠BOC = 2 · 30 = ', dF('60°')]) },
    ],
    respuesta: ['m∠BOC = ', dF('60°')] });
  EJ3.push({ nivel: 2, titulo: 'El ángulo no convexo', figura: figA(abanico([{ id: 'A', dir: 20 }, { id: 'B', dir: 160 }], [{ de: 'A', a: 'B', texto: '140°', color: 'h', mide: 140, radio: 24 }, { de: 'A', a: 'B', texto: '?', mide: 220, mayor: true, radio: 34 }], { alt: 'Los rayos OA y OB forman un ángulo convexo de 140°; el otro lado es el no convexo.' })),
    enunciado: 'Los rayos OA y OB forman un ángulo convexo de 140°. ¿Cuánto mide el ángulo no convexo AOB, el que rodea por el otro lado?',
    datos: [D_VUELTA],
    solucion: [{ texto: 'Los dos ángulos juntos dan una vuelta completa:', ecuacion: junto(['360° − 140° = ', dF('220°')]) }],
    respuesta: ['Mide ', dF('220°')] });
  {
    const ds = [0, 36, 108, 216], ms = [36, 72, 108, 144];
    const F = abanico([{ id: 'A', dir: ds[0] }, { id: 'B', dir: ds[1] }, { id: 'C', dir: ds[2] }, { id: 'D', dir: ds[3] }],
      [{ de: 'A', a: 'B', texto: 'x', color: 'h', mide: ms[0] }, { de: 'B', a: 'C', texto: '2x', color: 'h', mide: ms[1] }, { de: 'C', a: 'D', texto: '3x', color: 'h', mide: ms[2] }, { de: 'D', a: 'A', texto: '4x', color: 'h', mide: ms[3] }],
      { alt: 'Cuatro ángulos alrededor del punto O.' });
    EJ3.push({ nivel: 3, titulo: 'Alrededor de un punto', figura: figA(F),
      enunciado: 'Alrededor del punto O hay cuatro ángulos consecutivos que miden x, 2x, 3x y 4x, y cubren toda la vuelta. ¿Cuánto mide el mayor?',
      datos: [D_VUELTA, 'Consecutivos: sus medidas se suman.'],
      solucion: [
        { texto: 'Los cuatro juntos dan una vuelta:', ecuacion: [junto('x + 2x + 3x + 4x = 360'), '   →   ', junto('10x = 360'), '   →   ', junto('x = 36')] },
        { texto: 'El mayor es 4x:', ecuacion: junto(['m∠DOA = 4 · 36 = ', dF('144°')]) },
        { texto: 'Con 180° en vez de 360° saldría 72°: alrededor de un punto se da la vuelta entera.' },
      ],
      respuesta: ['El mayor mide ', dF('144°')] });
  }
  EJ3.push({ nivel: 3, titulo: 'Las agujas a las 7:00', figura: esc(reloj1(7, { arco: { texto: '?', corto: true }, O: false })),
    enunciado: 'El reloj de la plaza marca las 7:00. ¿Cuánto mide el ángulo convexo entre las agujas?',
    datos: [D_VUELTA, D_RELOJ],
    solucion: [
      { texto: 'Contar desde las 12 hasta el 7 da 7 × 30° = 210°: pasa de 180°, es el arco no convexo.' },
      { texto: 'Por el otro lado, del 7 al 12, hay 5 espacios:', ecuacion: junto(['5 × 30° = ', dF('150°')]) },
      { texto: 'Los dos arcos dan la vuelta:', ecuacion: junto('210° + 150° = 360°') },
    ],
    respuesta: [dF('150°')] });
  EJ3.push({ nivel: 3, titulo: 'Consecutivos sobre una recta', figura: figA(abanico([{ id: 'A', dir: 0 }, { id: 'B', dir: 110 }, { id: 'D', dir: 180 }],
    [{ de: 'A', a: 'B', texto: '3x − 10°', color: 'h', mide: 110 }, { de: 'B', a: 'D', texto: 'x + 30°', color: 'h', mide: 70, radio: 30 }], { alt: 'A, O y D en una recta; el rayo OB entre OA y OD.' })),
    enunciado: 'A, O y D están en una recta, y OB sale de O. m∠AOB = 3x − 10° y m∠BOD = x + 30°. ¿Cuánto mide ∠AOB y qué clase es?',
    datos: ['Ángulo llano: 180°.', D_CONSEC('A', 'B', 'D'), D_CLASES],
    solucion: [
      { texto: 'Los dos juntos forman el ángulo llano AOD:', ecuacion: [junto('3x − 10° + x + 30° = 180°'), '   →   ', junto('4x = 160'), '   →   ', junto('x = 40')] },
      { texto: 'Reemplazo en ∠AOB:', ecuacion: junto(['m∠AOB = 3 · 40 − 10° = ', dF('110°')]) },
      { texto: 'Está entre 90° y 180°: es obtuso.' },
    ],
    respuesta: ['m∠AOB = ', dF('110°'), ', obtuso'] });
  EJ3.push({ nivel: 3, titulo: 'Tres ángulos y una vuelta', figura: figA(abanico([{ id: 'A', dir: 0 }, { id: 'B', dir: 120 }, { id: 'D', dir: 260 }],
    [{ de: 'A', a: 'B', texto: '120°', color: 'h', mide: 120 }, { de: 'B', a: 'D', texto: '2x', color: 'h', mide: 140 }, { de: 'D', a: 'A', texto: 'x + 30°', color: 'h', mide: 100 }], { alt: 'Tres ángulos alrededor del punto O.' })),
    enunciado: 'Alrededor de O hay tres ángulos consecutivos que dan la vuelta: m∠AOB = 120°, m∠BOD = 2x y m∠DOA = x + 30°. ¿Cuánto mide el mayor de los tres?',
    datos: [D_VUELTA, 'Consecutivos: sus medidas se suman.'],
    solucion: [
      { texto: 'Los tres dan la vuelta:', ecuacion: [junto('120° + 2x + x + 30° = 360°'), '   →   ', junto('3x + 150° = 360°'), '   →   ', junto('3x = 210'), '   →   ', junto('x = 70')] },
      { texto: 'Reemplazo:', ecuacion: [junto(['m∠BOD = 2 · 70 = ', dF('140°')]), SEP, junto('m∠DOA = 70 + 30° = 100°')] },
      { texto: 'El mayor es ∠BOD: 140° pasa a 120° y a 100°.' },
    ],
    respuesta: ['El mayor mide ', dF('140°')] });
  {
    const F = abanico([{ id: 'A', dir: 10 }, { id: 'B', dir: 60 }, { id: 'C', dir: 90 }, { id: 'D', dir: 160 }],
      [{ de: 'A', a: 'C', texto: '80°', color: 'h', mide: 80, radio: 26 }, { de: 'B', a: 'D', texto: '100°', color: 'h', mide: 100, radio: 40 }, { de: 'B', a: 'C', texto: '?', mide: 30, radio: 56 }],
      { alt: 'Cuatro rayos OA, OB, OC y OD, en ese orden.' });
    EJ3.push({ nivel: 3, titulo: 'Dos ángulos que se pisan', figura: figA(F),
      enunciado: 'Los rayos OA, OB, OC y OD salen de O en ese orden. m∠AOC = 80°, m∠BOD = 100° y m∠AOD = 150°. ¿Cuánto mide ∠BOC?',
      datos: ['Consecutivos: sus medidas se suman. m∠AOD = m∠AOB + m∠BOC + m∠COD.'],
      solucion: [
        { texto: '∠AOC y ∠BOD juntos cubren ∠AOD y repiten ∠BOC:', ecuacion: junto('m∠AOC + m∠BOD = m∠AOD + m∠BOC') },
        { texto: 'Reemplazo y despejo:', ecuacion: junto(['m∠BOC = 80° + 100° − 150° = ', dF('30°')]) },
      ],
      respuesta: ['m∠BOC = ', dF('30°')] });
  }

  // «Ahora tú» de la idea 3. Tipo 0: la clase de la suma de dos consecutivos. Con OB entre OA y OC, ∠AOC es el convexo
  // que contiene a OB: la suma no pasa de 180° (auditoría, 17 nov: con 80° + 105° se daba por buena «no convexo», y ∠AOC
  // sin más es el convexo, de 175°, obtuso). Como en el generador, la suma se queda en 180° o menos.
  function casoClase(r) {
    let a, b, t;
    do { a = 5 * r.ent(6, 20); b = 5 * r.ent(6, 22); t = a + b; } while (t > 180);
    const giro = 15 * r.ent(0, 6), bien = clase(t);
    const rango = { agudo: 'fuera menor que 90°', recto: 'fuera justo 90°', obtuso: 'estuviera entre 90° y 180°', llano: 'fuera justo 180°', 'no convexo': 'pasara de 180°' };
    const ops = [{ id: 'c', texto: bien, correcta: true }];
    const cerca = CLASES.filter(n => n !== bien).sort((x, y) => Math.abs(CLASES.indexOf(x) - CLASES.indexOf(bien)) - Math.abs(CLASES.indexOf(y) - CLASES.indexOf(bien)));
    for (const n of cerca.slice(0, 3)) ops.push({ id: n.replace(' ', '-'), texto: n, error: 'GE-ANG3', siFuera: `«${n}» sería el nombre si ${a}° + ${b}° ${rango[n]}.` });
    return {
      pregunta: `∠AOB y ∠BOC son consecutivos: OB queda entre OA y OC. m∠AOB = ${a}° y m∠BOC = ${b}°. ¿Qué clase de ángulo es ∠AOC?`,
      datos: [D_CONSEC('A', 'B', 'C'), D_CLASES],
      dibujo: esc({ objeto: 'angulos', figura: consec(a, b, giro, { total: false }) }),
      opciones: ops,
      solucion: { texto: `Las aberturas consecutivas se suman: ${t}°.`, ecuacion: junto(`m∠AOC = ${a}° + ${b}° = ${t}°: ${bien}`) },
    };
  }
  // Tipo 1: el ángulo convexo de las agujas a una hora en punto.
  function casoReloj(r) {
    const h = r.de([1, 2, 4, 5, 7, 8, 10, 11]), esp = Math.min(h, 12 - h), bien = 30 * esp, mayor = 360 - bien;
    const ops = [{ id: 'c', texto: `${bien}°`, correcta: true },
      { id: 'mayor', texto: `${mayor}°`, error: 'GE-ANG5', siFuera: 'Ese también es un ángulo de las agujas, el que rodea por el otro lado; piden el convexo.' },
      { id: 'seis', texto: `${6 * esp}°`, error: 'GE-ANG6', siFuera: 'Contar espacios va bien; pero entre dos números hay 30°, no 6°: 6° es un minuto.' },
      { id: 'media', texto: `${15 * esp}°`, error: 'GE-ANG7', siFuera: 'Repartir entre 12 va bien; pero se reparte la vuelta entera, 360°, no 180°.' }];
    return {
      pregunta: `El reloj de la plaza marca las ${h}:00. ¿Cuánto mide el ángulo convexo que forman las agujas?`,
      datos: [D_VUELTA, D_RELOJ],
      dibujo: esc(reloj1(h, { arco: { texto: '?', corto: true }, O: false })),
      opciones: ops,
      solucion: { texto: `Por el lado corto hay ${esp} espacios de 360° ÷ 12 = 30°.`, ecuacion: junto(`${esp} × 30° = ${bien}°`) },
    };
  }
  // Tipo 2: dos consecutivos con x; se pide uno de los ángulos.
  function casoConsecX(r) {
    const v = 5 * r.ent(2, 8), a1 = r.ent(1, 4), a2 = r.ent(1, 4), b1 = 5 * r.ent(-2, 6), b2 = 5 * r.ent(0, 6);
    const m1 = a1 * v + b1, m2 = a2 * v + b2, t = m1 + m2;
    if (m1 < 30 || m2 < 30 || t >= 180) return casoConsecX(r);
    const ex = (a, b) => `${a === 1 ? '' : a}x${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}°` : ''}`;
    return {
      pregunta: `∠AOB y ∠BOC son consecutivos. m∠AOB = ${ex(a1, b1)}, m∠BOC = ${ex(a2, b2)} y m∠AOC = ${t}°. ¿Cuánto mide ∠BOC?`,
      datos: [D_CONSEC('A', 'B', 'C')],
      dibujo: esc({ objeto: 'angulos', figura: consec(m1, m2, 10, { ta: ex(a1, b1), tb: ex(a2, b2), total: false }) }),
      opciones: opciones(m2, [
        { id: 'x', valor: v, error: 'GE-ANG8', siFuera: `Hallar x = ${v} está bien; falta reemplazarlo en ∠BOC.` },
        { id: 'otro', valor: m1, error: 'GE-ANG9', siFuera: 'La cuenta está bien hecha; pero ese es ∠AOB, no ∠BOC.' },
        { id: 'mitad', valor: t / 2, error: 'GE-ANG3', siFuera: 'Partir ∠AOC en dos iguales serviría si OB lo partiera por la mitad; aquí no.' },
      ], gr),
      solucion: { texto: `Sumo e igualo a ${t}°: x = ${v}.`, ecuacion: junto(`m∠BOC = ${ex(a2, b2).replace(/x/, ` · ${v}`).replace(/^ · /, '')} = ${m2}°`) },
    };
  }
  // Tipo 3 (examen): cuatro ángulos alrededor de un punto, proporcionales a cuatro números.
  const VUELTAS = [[20, [2, 4, 5, 7]], [15, [3, 4, 6, 11]], [18, [2, 3, 6, 9]], [10, [5, 6, 8, 17]], [30, [1, 2, 4, 5]], [36, [1, 2, 3, 4]], [24, [2, 3, 4, 6]]];
  function casoVuelta(r) {
    const [x, ks] = r.de(VUELTAS), S = ks.reduce((s, k) => s + k, 0), mx = Math.max(...ks) * x;
    const ex = k => (k === 1 ? 'x' : `${k}x`);
    let d = 0; const rayos = [], angs = [];
    ks.forEach((k, i) => { rayos.push({ id: 'ABCD'[i], dir: d }); d += k * x; });
    ks.forEach((k, i) => angs.push({ de: 'ABCD'[i], a: 'ABCD'[(i + 1) % 4], texto: ex(k), color: 'h', mide: k * x }));
    return {
      pregunta: `Alrededor del punto O hay cuatro ángulos consecutivos que dan la vuelta entera: ${ks.map(ex).join(', ')}. ¿Cuánto mide el mayor?`,
      datos: [D_VUELTA, 'Consecutivos: sus medidas se suman.'],
      dibujo: esc({ objeto: 'angulos', figura: abanico(rayos, angs, { alt: 'Cuatro ángulos alrededor del punto O.' }) }),
      opciones: opciones(mx, [
        { id: 'x', valor: x, error: 'GE-ANG8', siFuera: `Hallar x = ${x} está bien; falta multiplicar por ${Math.max(...ks)}.` },
        { id: 'media', valor: mx / 2, error: 'GE-ANG10', siFuera: 'Sumar los cuatro va bien; pero alrededor de un punto suman 360°, no 180°.' },
        { id: 'menor', valor: Math.min(...ks) * x, error: 'GE-ANG9', siFuera: 'La x está bien hallada; pero ese es el menor de los cuatro.' },
      ], gr),
      solucion: { texto: `Los cuatro dan la vuelta: ${S}x = 360, así que x = ${x}.`, ecuacion: junto(`m∠${'ABCD'[ks.indexOf(Math.max(...ks))]}O${'ABCD'[(ks.indexOf(Math.max(...ks)) + 1) % 4]} = ${Math.max(...ks)} · ${x} = ${mx}°`) },
    };
  }

  const aberturaIdea = {
    id: 'abertura',
    titulo: 'Clases de ángulos',
    pregunta: '¿Qué mide un ángulo: la abertura o el largo de sus lados?',
    temas: ['Clases de ángulos'],
    pieza: GO,
    aprendizaje: 'Un ángulo mide cuánto se abren sus lados, no cuánto miden: así es agudo, recto, obtuso, llano o no convexo. Los consecutivos se suman.',
    actividad: 'Mover el horario del reloj de la plaza y nombrar el ángulo que forman las agujas.',
    lee: {
      tarjetas: [
        { titulo: 'Dos agujas y un vértice', texto: 'En el reloj de la plaza, las dos agujas salen del mismo eje, como dos rayos que salen de un punto. Ese punto es el vértice, O. Entre las agujas se forma un ángulo, y las agujas son sus lados.',
          pieza: GO, dibujo: esc(Object.assign(reloj1(2), { relojes: [{ hora: 2, tam: 'plaza', O: true, arco: { color: 'h' } }] })) },
        // m∠ dicho en palabras, con A y B en las agujas (auditoría, 17 nov: «“m∠” no sé qué significa»).
        { titulo: 'Se mide en grados', texto: 'Una vuelta mide 360°, y el reloj tiene 12 números a igual distancia: de uno al siguiente hay 30°. A las 4:00 hay 4 espacios: 4 × 30° = 120°. Se escribe m∠AOB = 120°: «la medida del ángulo AOB».',
          pieza: GO, dibujo: esc(reloj1(4, { letras: ['A', 'B'] })) },
        { titulo: 'Cada medida, un nombre', texto: 'Un ángulo es agudo si mide menos de 90°, recto si mide 90°, obtuso entre 90° y 180°, llano si mide 180° y no convexo si pasa de 180°: rodea por el otro lado.' },
        { titulo: 'Ángulos consecutivos', texto: '∠AOB y ∠BOC son consecutivos: comparten el vértice O y el lado OB, uno al lado del otro. Al jugar, mueve el horario y fíjate en qué medida cambia el nombre del ángulo.',
          pieza: GO, dibujo: figA(consec(50, 40, 15, { total: false, ta: '', tb: '' })) },
      ],
    },
    ejemplos: EJ3,
    juega: {
      pieza: GO,
      consigna: 'En el reloj de la plaza, el minutero se queda en las 12 y el horario se mueve de hora en hora.',
      mision: {
        texto: 'Pon una hora en punto en que las agujas formen un ángulo llano.',
        logrado: v => v.g === 180,
        bien: 'Listo: a las 6:00 las agujas forman una sola recta, 180°.',
      },
      // Ronda 2 del lector (18 nov): la voz preguntaba por el largo de las agujas, que aquí no se puede cambiar; el «× 30°»
      // de la lectura no se explicaba hasta «Mira» (va en la leyenda); y «m∠AOB» no tenía A ni B en el reloj (la leyenda
      // dice ahora qué es m∠, sin letras: con A y B en las agujas, a las 12:00 la B tapaba el 12).
      voz: 'Mueve el horario: ¿a qué hora cambia el nombre del ángulo?',
      leyenda: [
        { s: 'O', t: 'el eje: vértice del ángulo' },
        { s: dH('carmín'), t: 'el ángulo, del minutero al horario' },
        { s: '°', t: 'grado: una vuelta tiene 360°' },
        { s: '30°', t: 'de un número al siguiente: 360° ÷ 12' },
        { s: 'm∠', t: 'la medida de un ángulo' },
      ],
      controles: [{ id: 'g', etiqueta: 'Giro del horario desde las 12', min: 0, max: 330, paso: 30, inicio: 60, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: reloj1(v.g / 30), estado: {} }),
      // Gesto directo: se agarra la punta del horario y se gira alrededor del eje.
      arrastres: [{ id: 'horario', etiqueta: 'punta del horario: gira', color: 'c-h',
        donde: v => PO.aPantalla(reloj1(v.g / 30), U.polar([0, 0], 0.4, 90 - v.g)),
        mover: (pt, v) => { const q = PO.aPlano(reloj1(v.g / 30), pt); const g = ((90 - U.grados(Math.atan2(q[1], q[0]))) % 360 + 360) % 360; return { g: g > 345 ? 0 : g }; } }],
      lectura: v => {
        const h = v.g / 30;
        if (!h) return '12:00: las agujas se tapan: 0°, ángulo nulo';
        if (v.g > 180) return [`${h}:00: el arco marcado mide `, dH(`${v.g}°`), `, no convexo; el otro, ${360 - v.g}°`];
        return [`${h}:00: ${h} × 30° = `, dH(`${v.g}°`), `: ángulo ${clase(v.g)}`];
      },
      minimo: 4,
    },
    predice: {
      pregunta: 'Dos fotos: el reloj de la plaza, con agujas de 1 m, a la 1:00, y tu reloj de pulsera, con agujas de 1 cm, a las 2:00. ¿En cuál forman las agujas el ángulo mayor?',
      datos: [D_VUELTA, D_RELOJ],
      voz: 'Antes de contar, decide qué mira la medida de un ángulo.',
      opciones: [
        { id: 'c', texto: 'En el reloj de pulsera', correcta: true },
        { id: 'largo', texto: 'En el de la plaza: sus agujas son más largas', error: 'GE-ANG1', siFuera: 'Las agujas largas sí agrandan el dibujo; pero el ángulo cuenta la abertura, no el largo.' },
        { id: 'iguales', texto: 'Iguales: los dos marcan una hora en punto', error: 'GE-ANG2', siFuera: 'Serían iguales a la misma hora; a las 2:00 hay un espacio más que a la 1:00.' },
        { id: 'tamano', texto: 'No se pueden comparar: son de distinto tamaño', error: 'GE-ANG4', siFuera: 'Comparar tamaños sí sería difícil; pero los grados no dependen del tamaño del reloj.' },
      ],
      dibujo: esc(relojes2({ a: { texto: '?' }, b: { texto: '?' } })),
      revelar: esc(relojes2({ a: { texto: '30°', color: 'h' }, b: { texto: '60°', color: 'h' } })),
      coincide: 'Coincide: la plaza marca 30° y la pulsera, 60°. El largo de las agujas no entra en la medida.',
      noCoincide: 'Revisemos: la plaza, a la 1:00, marca 30°; la pulsera, a las 2:00, marca 60°.',
    },
    mira: {
      pieza: GO,
      datos: relojes2({ a: { texto: '30°', color: 'h', desde: 1 }, b: { texto: '60°', color: 'h', desde: 2 }, alarga: 3 }),
      voz: 'Cuenta espacios de 30°. El largo de las agujas queda fuera.',
      pasos: [
        { estado: { corte: 0 }, texto: 'De un número al siguiente hay 30°.', ecuacion: junto('360° ÷ 12 = 30°') },
        { estado: { corte: 1 }, texto: 'La plaza, a la 1:00: un espacio.', ecuacion: junto(['1 × 30° = ', dH('30°')]) },
        { estado: { corte: 2 }, texto: 'La pulsera, a las 2:00: dos espacios.', ecuacion: junto(['2 × 30° = ', dH('60°')]) },
        { estado: { corte: 3 }, texto: 'Alarga las agujas de la pulsera: la abertura no cambia.', ecuacion: junto(['sigue en ', dH('60°')]) },
        { estado: { corte: 3 }, texto: 'Los dos son agudos: miden menos de 90°.', ecuacion: junto('0° < 30° < 60° < 90°') },
      ],
    },
    regla: {
      texto: 'Un ángulo mide la abertura entre sus lados, no su largo, y su medida le da el nombre. Dos consecutivos se suman, y una vuelta completa mide 360°.',
      ecuacion: [junto('agudo: menos de 90°'), SEP, junto('recto: 90°'), SEP, junto('obtuso: entre 90° y 180°'), SEP, junto('llano: 180°'), SEP, junto('no convexo: más de 180°')],
      condicion: 'los lados son rayos: alargarlos no cambia la medida. Los consecutivos comparten el vértice y un lado.',
      voz: 'Se cuenta la abertura; el largo de los lados no entra.',
    },
    // Así se resuelve: el ángulo que falta entre dos consecutivos y su clase. «Ahora tú» pide la clase de una suma, el
    // reloj, consecutivos con x y la vuelta alrededor de un punto.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900), t = 5 * r.ent(20, 34), a = 5 * r.ent(6, t / 5 - 6), b = t - a, giro = 15 * r.ent(0, 4), bien = clase(b);
        return {
          enunciado: `∠AOB y ∠BOC son consecutivos, con m∠AOC = ${t}° y m∠AOB = ${a}°. ¿Cuánto mide ∠BOC y qué clase de ángulo es?`,
          datos: [D_CONSEC('A', 'B', 'C'), D_CLASES],
          dibujo: esc({ objeto: 'angulos', figura: consec(a, b, giro, { tb: '?', total: false }) }),
          pasos: [
            { tipo: 'pide', texto: 'Piden ∠BOC: cuánto mide y su nombre.' },
            { tipo: 'datos', texto: `∠AOC mide ${t}° y ∠AOB, ${a}°. OB queda en medio.` },
            { tipo: 'regla', texto: 'Con OB entre OA y OC, ∠AOC junta las dos aberturas.', ecuacion: junto('m∠AOC = m∠AOB + m∠BOC') },
            { tipo: 'cuentas', texto: `A ${t}° le quito ${a}°. ${bien === 'agudo' ? 'Queda por debajo de 90°: agudo.' : bien === 'recto' ? 'Es justo 90°: recto.' : 'Queda entre 90° y 180°: obtuso.'}`, ecuacion: junto(`m∠BOC = ${t}° − ${a}° = ${b}°`) },
            { tipo: 'sentido', texto: `Compruebo: ${a}° + ${b}° = ${t}°, que es ∠AOC.` },
          ],
          respuesta: [`m∠BOC = ${b}°: `, dF(bien)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Junta las aberturas y nombra el resultado.',
      generar(s) { return conCuatro([casoClase, casoReloj, casoConsecX, casoVuelta][s % 4], azar(s + 13)); },
    },
  };

  // ---------- Idea 4 (17 nov): complemento, suplemento y bisectriz ----------
  // Objeto de la primera pantalla: la tranquera de un estacionamiento (geo-objeto, tranquera; dibujo de prueba): el poste
  // en O, la pista y la barra que sube desde O.
  // Cambia: α, el ángulo de la barra con la pista. · Permanece: el poste (90° con la pista) y la pista (una recta).
  // Progresa: los dos compañeros, 90° − α y 180° − α. · Se reserva: las dos bisectrices (la predicción). · Debe verse:
  // los compañeros cambian al revés que α y juntos completan 90° o 180°.
  // Colores: α y sus mitades en carmín; sus compañeros (con el poste y con la pista del otro lado) en turquesa. En los
  // ejercicios, todo ángulo dado en carmín (el turquesa diría cuál es el suplemento). Sin puntos C ni S en las figuras
  // (C(x) y S(x) son complemento y suplemento).
  // Errores (hipótesis, sin medir; rutinas/teoria-geometria.md): GE-BIS1 no ve que las mitades suman la mitad de 180°,
  // GE-BIS2 suma los ángulos completos, GE-BIS3 toma las bisectrices por los lados, GE-CS1 deshace solo una operación,
  // GE-CS2 cambia el orden, GE-CS3 reparte en mitades, GE-CS4 olvida que el otro también depende de x, GE-CS5 (nuevo)
  // confunde complemento con suplemento, GE-CS6 (nuevo) da el complemento o el suplemento en vez del ángulo, GE-ANG11
  // (nuevo) incluye el valor límite que la desigualdad estricta excluye, GE-ANG12 (nuevo) usa 180° donde va 90°; y, del
  // generador, GE-BIS4 toma la mitad de uno solo y GE-BIS5 cree que entre bisectrices siempre hay 90°; nuevos (17 nov):
  // GE-BIS6 se queda en la mitad del ángulo pedido, GE-BIS7 le quita a ∠MON el ángulo entero y no su mitad, GE-BIS8 da
  // ∠AOD, el ángulo entero.
  const tranq = (a, o = {}) => Object.assign({ objeto: 'tranquera', alfa: a }, o);
  const tranqJuego = a => tranq(a, { pista: { texto: `${a}°`, color: 'h' }, poste: a < 90 ? { texto: `${90 - a}°`, color: 'i' } : null, otro: { texto: `${180 - a}°`, color: 'i' } });
  const D_C = 'Complemento: C(x) = 90° − x, si x < 90.';
  const D_S = 'Suplemento: S(x) = 180° − x, si x < 180.';
  const D_BIS = 'La bisectriz parte un ángulo en dos ángulos iguales.';
  const D_ADY = 'Dos adyacentes sobre una recta suman 180°.';
  const lineaRayo = (t, extra, angs, alt) => abanico([{ id: 'A', dir: 0 }, { id: 'B', dir: t }, { id: 'E', dir: 180 }, ...extra], angs, { alt });

  // Ejemplos de «Complemento, suplemento y bisectriz». Cuentas rehechas aparte (cuentas.js): 90 − 35 = 55; 180 − 48 =
  // 132; 76 ÷ 2 = 38; 180 − 115 = 65; 120 no tiene complemento, 180 − 120 = 60; C(30) = 60 y S(60) = 120; 90 − x = 2x →
  // 30; 35 + 110 = 145; 270 − 2x = 200 → 35; 90 − 25 = 65 y 180 − 25 = 155; 180 − x = 4(90 − x) → 60; 3x + 15 < 90 → x
  // < 25 → 24; 4x + 40 = 180 → 35 y las bisectrices a 90; 90 + x = 4x → 30; 30 + 50 = 80.
  const EJ4 = [];
  EJ4.push({ nivel: 1, titulo: 'El complemento de 35°', figura: figA(abanico([{ id: 'A', dir: 0 }, { id: 'B', dir: 35 }, { id: 'D', dir: 90 }], [{ de: 'A', a: 'B', texto: '35°', color: 'h', mide: 35 }, { de: 'B', a: 'D', texto: '?', mide: 55, radio: 30 }], { alt: '∠AOD es recto; el rayo OB forma 35° con OA.' })),
    enunciado: 'El ángulo AOD es recto y el rayo OB lo parte: m∠AOB = 35°. ¿Cuánto mide ∠BOD, el complemento de 35°?',
    datos: [D_C],
    solucion: [{ texto: 'Lo que le falta a 35° para llegar a 90°:', ecuacion: junto(['C(35°) = 90° − 35° = ', dF('55°')]) }],
    respuesta: ['m∠BOD = ', dF('55°')] });
  EJ4.push({ nivel: 1, titulo: 'El suplemento de 48°', enunciado: '¿Cuánto mide el suplemento de un ángulo de 48°?',
    datos: [D_S],
    solucion: [{ texto: 'Lo que le falta a 48° para llegar a 180°:', ecuacion: junto(['S(48°) = 180° − 48° = ', dF('132°')]) }],
    respuesta: ['S(48°) = ', dF('132°')] });
  EJ4.push({ nivel: 1, titulo: 'La bisectriz de 76°', figura: figA(abanico([{ id: 'A', dir: 10 }, { id: 'D', dir: 48, discontinua: true }, { id: 'B', dir: 86 }], [{ de: 'A', a: 'B', texto: '76°', color: 'h', mide: 76, radio: 46, centro: true }, { de: 'A', a: 'D', texto: '?', rayita: 1, mide: 38, radio: 26 }, { de: 'D', a: 'B', rayita: 1, mide: 38, radio: 26 }], { alt: 'Ángulo AOB de 76° con su bisectriz OD.' })),
    enunciado: 'OD es la bisectriz del ángulo AOB, que mide 76°. ¿Cuánto mide ∠AOD?',
    datos: [D_BIS],
    solucion: [{ texto: 'La bisectriz deja dos ángulos iguales:', ecuacion: junto(['m∠AOD = 76° ÷ 2 = ', dF('38°')]) }],
    respuesta: ['m∠AOD = ', dF('38°')] });
  EJ4.push({ nivel: 1, titulo: 'Dos adyacentes', figura: figA(lineaRayo(115, [], [{ de: 'A', a: 'B', texto: '115°', color: 'h', mide: 115 }, { de: 'B', a: 'E', texto: '?', mide: 65, radio: 30 }], 'A, O y E en una recta; el rayo OB forma 115° con OA.')),
    enunciado: 'A, O y E están en una recta, y el rayo OB forma m∠AOB = 115°. ¿Cuánto mide ∠BOE?',
    datos: [D_ADY],
    solucion: [{ texto: '∠AOB y ∠BOE son adyacentes sobre la recta: suman 180°.', ecuacion: junto(['m∠BOE = 180° − 115° = ', dF('65°')]) }],
    respuesta: ['m∠BOE = ', dF('65°')] });
  EJ4.push({ nivel: 1, titulo: '¿Tiene complemento?', enunciado: 'Un ángulo mide 120°. ¿Tiene complemento? ¿Y suplemento?',
    datos: [D_C, D_S],
    solucion: [
      { texto: '120° ya pasa de 90°: no le falta nada para 90°. No tiene complemento.' },
      { texto: 'Sí tiene suplemento:', ecuacion: junto(['S(120°) = 180° − 120° = ', dF('60°')]) },
    ],
    respuesta: ['Complemento no; suplemento, ', dF('60°')] });
  EJ4.push({ nivel: 2, titulo: 'Suplemento del complemento', enunciado: '¿Cuánto mide el suplemento del complemento de 30°?',
    datos: [D_C, D_S],
    solucion: [
      { texto: 'Primero, el de adentro: el complemento.', ecuacion: junto('C(30°) = 90° − 30° = 60°') },
      { texto: 'Después, el suplemento de ese resultado:', ecuacion: junto(['S(60°) = 180° − 60° = ', dF('120°')]) },
    ],
    respuesta: ['S(C(30°)) = ', dF('120°')] });
  EJ4.push({ nivel: 2, titulo: 'El complemento es el doble', enunciado: 'El complemento de un ángulo mide el doble que el ángulo. ¿Cuánto mide el ángulo?',
    datos: [D_C],
    solucion: [
      { texto: 'Llamo x a lo que mide el ángulo; su complemento es 90° − x, y eso vale 2x:', ecuacion: [junto('90° − x = 2x'), '   →   ', junto('3x = 90')] },
      { texto: 'Despejo: x = 30. Piden la medida del ángulo:', ecuacion: junto(['mide ', dF('30°')]) },
    ],
    respuesta: ['El ángulo mide ', dF('30°')] });
  EJ4.push({ nivel: 2, titulo: 'Bisectriz y suplemento', figura: figA(lineaRayo(70, [{ id: 'D', dir: 35, discontinua: true }], [{ de: 'A', a: 'B', texto: '70°', color: 'h', mide: 70, radio: 40, centro: true }, { de: 'A', a: 'D', rayita: 1, mide: 35, radio: 26 }, { de: 'D', a: 'B', rayita: 1, mide: 35, radio: 26 }, { de: 'D', a: 'E', texto: '?', mide: 145, radio: 64, centro: true }], 'A, O y E en una recta; OB forma 70° con OA y OD es su bisectriz.')),
    enunciado: 'A, O y E están en una recta. m∠AOB = 70° y OD es la bisectriz de ∠AOB. ¿Cuánto mide ∠DOE?',
    datos: [D_BIS, D_ADY],
    solucion: [
      { texto: 'La bisectriz OD deja dos mitades iguales:', ecuacion: junto('m∠AOD = m∠DOB = 70° ÷ 2 = 35°') },
      { texto: 'Del otro lado de OB queda el suplemento:', ecuacion: junto('m∠BOE = 180° − 70° = 110°') },
      { texto: '∠DOE junta una mitad y ∠BOE:', ecuacion: junto(['m∠DOE = 35° + 110° = ', dF('145°')]) },
    ],
    respuesta: ['m∠DOE = ', dF('145°')] });
  EJ4.push({ nivel: 2, titulo: 'Complemento más suplemento', enunciado: 'El complemento de un ángulo más su suplemento suman 200°. ¿Cuánto mide el ángulo?',
    datos: [D_C, D_S],
    solucion: [
      { texto: 'Si el ángulo mide x, escribo cada uno como una resta y sumo: x aparece dos veces.', ecuacion: [junto('(90° − x) + (180° − x) = 200°'), '   →   ', junto('270° − 2x = 200°')] },
      { texto: 'Despejo x. El ángulo mide x grados:', ecuacion: [junto('2x = 70'), '   →   ', junto('x = 35'), '   →   ', junto(['mide ', dF('35°')])] },
    ],
    respuesta: ['El ángulo mide ', dF('35°')] });
  EJ4.push({ nivel: 2, titulo: 'La barra a 25°', figura: esc(tranq(25, { pista: { texto: '25°', color: 'h' }, poste: { texto: '?' }, otro: { texto: '?' } })),
    enunciado: 'La barra de la tranquera forma 25° con la pista. ¿Qué ángulo forma con el poste? ¿Y con la pista del otro lado?',
    datos: ['El poste forma 90° con la pista.', 'La pista es una recta: 180°.'],
    solucion: [
      { texto: 'Con el poste, lo que le falta a 25° para 90°:', ecuacion: junto(['C(25°) = 90° − 25° = ', dF('65°')]) },
      { texto: 'Con la pista del otro lado, lo que le falta para 180°:', ecuacion: junto(['S(25°) = 180° − 25° = ', dF('155°')]) },
    ],
    respuesta: ['Con el poste, ', dF('65°'), '; con la pista, ', dF('155°')] });
  EJ4.push({ nivel: 3, titulo: 'Cuatro veces el complemento', enunciado: 'El suplemento de un ángulo es igual a cuatro veces su complemento. ¿Cuánto mide el ángulo?',
    datos: [D_C, D_S],
    solucion: [
      { texto: 'Si el ángulo mide x, escribo las dos restas; el 4 multiplica al complemento entero:', ecuacion: junto('180° − x = 4(90° − x)') },
      { texto: 'Reparto y junto las x. El ángulo mide x grados:', ecuacion: [junto('180° − x = 360° − 4x'), '   →   ', junto('3x = 180'), '   →   ', junto('x = 60'), '   →   ', junto(['mide ', dF('60°')])] },
      { texto: 'Compruebo: S(60°) = 120° y C(60°) = 30°; 4 · 30° = 120°.' },
    ],
    respuesta: ['El ángulo mide ', dF('60°')] });
  // Dibujado con x = 24, la respuesta (2x mide 48° y x + 15°, 39°): los rótulos con x valen lo que se dibuja.
  EJ4.push({ nivel: 3, titulo: 'El mayor valor entero', figura: figA(abanico([{ id: 'A', dir: 0 }, { id: 'B', dir: 48 }, { id: 'D', dir: 87 }], [{ de: 'A', a: 'B', texto: '2x', color: 'h', mide: 48 }, { de: 'B', a: 'D', texto: 'x + 15°', color: 'h', mide: 39, radio: 34 }], { alt: '∠AOB y ∠BOD consecutivos.' })),
    enunciado: '∠AOB y ∠BOD son consecutivos, con m∠AOB = 2x y m∠BOD = x + 15°. Si ∠AOD es agudo, ¿cuál es el mayor valor entero de x?',
    datos: [D_CONSEC('A', 'B', 'D'), 'Agudo: más de 0° y menos de 90°.'],
    solucion: [
      { texto: '∠AOD junta los dos y tiene que quedar por debajo de 90°:', ecuacion: [junto('2x + x + 15° < 90°'), '   →   ', junto('3x < 75'), '   →   ', junto('x < 25')] },
      { texto: 'x = 25 no sirve: ∠AOD mediría justo 90°, recto. El mayor entero que queda es 24.' },
    ],
    respuesta: ['x = ', dF('24')] });
  EJ4.push({ nivel: 3, titulo: 'Las bisectrices de dos adyacentes', figura: figA(lineaRayo(105, [{ id: 'M', dir: 52.5, discontinua: true }, { id: 'N', dir: 142.5, discontinua: true }],
    [{ de: 'A', a: 'B', texto: '3x', color: 'h', mide: 105, radio: 26, centro: true }, { de: 'B', a: 'E', texto: 'x + 40°', color: 'h', mide: 75, radio: 26, centro: true }, { de: 'M', a: 'N', texto: '?', mide: 90, radio: 70, centro: true }],
    'A, O y E en una recta; OB entre ellos; OM y ON son las bisectrices de ∠AOB y ∠BOE.')),
    enunciado: 'A, O y E están en una recta. m∠AOB = 3x y m∠BOE = x + 40°. OM y ON son las bisectrices de ∠AOB y ∠BOE. ¿Cuánto mide ∠MON?',
    datos: [D_ADY, D_BIS],
    solucion: [
      { texto: 'Los dos son adyacentes: 4x + 40° = 180°, x = 35. Miden 105° y 75°.' },
      { texto: '∠MON junta una mitad de cada uno:', ecuacion: junto(['m∠MON = 52,5° + 37,5° = ', dF('90°')]) },
      { texto: 'Con cualquier x da 90°: es la mitad de los 180° de la recta. La x no hacía falta.' },
    ],
    respuesta: ['m∠MON = ', dF('90°')] });
  EJ4.push({ nivel: 3, titulo: 'Cuatro veces el ángulo', enunciado: 'El suplemento del complemento de un ángulo es igual a cuatro veces el ángulo. ¿Cuánto mide el ángulo?',
    datos: [D_C, D_S],
    solucion: [
      // (Ronda 2 del lector, 18 nov: «de adentro hacia afuera» y «el ángulo mide lo que vale x» no se entendían.)
      { texto: 'Si el ángulo mide x, primero su complemento, 90° − x. Después, el suplemento de ese complemento:', ecuacion: junto('180° − (90° − x) = 90° + x') },
      { texto: 'Eso es igual a cuatro veces el ángulo, 4x. El ángulo mide x grados:', ecuacion: [junto('90° + x = 4x'), '   →   ', junto('3x = 90'), '   →   ', junto('x = 30'), '   →   ', junto(['mide ', dF('30°')])] },
    ],
    respuesta: ['El ángulo mide ', dF('30°')] });
  EJ4.push({ nivel: 3, titulo: 'Bisectrices de dos consecutivos', figura: figA(abanico([{ id: 'A', dir: 0 }, { id: 'M', dir: 30, discontinua: true }, { id: 'B', dir: 60 }, { id: 'N', dir: 110, discontinua: true }, { id: 'D', dir: 160 }],
    [{ de: 'A', a: 'M', rayita: 1, mide: 30, radio: 24 }, { de: 'M', a: 'B', rayita: 1, mide: 30, radio: 24 }, { de: 'B', a: 'N', rayita: 2, mide: 50, radio: 24 }, { de: 'N', a: 'D', rayita: 2, mide: 50, radio: 24 },
      { de: 'A', a: 'B', texto: '60°', color: 'h', mide: 60, radio: 34, centro: true }, { de: 'B', a: 'D', texto: '100°', color: 'h', mide: 100, radio: 34, centro: true }, { de: 'M', a: 'N', texto: '?', mide: 80, radio: 74, centro: true }],
    { alt: '∠AOB y ∠BOD consecutivos, con sus bisectrices OM y ON.' })),
    enunciado: '∠AOB = 60° y ∠BOD = 100° son consecutivos. OM y ON son sus bisectrices. ¿Cuánto mide ∠MON?',
    datos: [D_BIS, 'Consecutivos: sus medidas se suman.'],
    solucion: [
      { texto: 'Cada bisectriz se queda con la mitad de su ángulo:', ecuacion: [junto('60° ÷ 2 = 30°'), SEP, junto('100° ÷ 2 = 50°')] },
      { texto: 'Entre OM y ON, una mitad de cada uno:', ecuacion: junto(['m∠MON = 30° + 50° = ', dF('80°')]) },
      { texto: 'Aquí no da 90°: los dos no forman una recta (60° + 100° = 160°).' },
    ],
    respuesta: ['m∠MON = ', dF('80°')] });

  // «Ahora tú» de la idea 4. Tipo 0 (17 nov, auditoría: la idea se llama «… y bisectriz» y ningún tipo pedía una):
  // bisectrices de dos consecutivos; se pide ∠MON con los dos ángulos, o ∠BOD con ∠AOB y ∠MON. Cuentas: m∠MON =
  // (a + b) ÷ 2 y m∠BOD = 2 · m∠MON − a (a y b de 10 en 10, así que las mitades y ∠MON salen enteros de 5 en 5).
  function casoBisectriz(r) {
    let a, b, giro, m, pideMON, F;
    for (let k = 0; ; k++) {
      do { a = 10 * r.ent(3, 11); b = 10 * r.ent(3, 11); } while (a === b || a + b >= 170 || a + b < 90);
      giro = 5 * r.ent(0, 4); m = (a + b) / 2; pideMON = r() < 0.5;
      F = abanico([{ id: 'A', dir: giro }, { id: 'M', dir: giro + a / 2, discontinua: true }, { id: 'B', dir: giro + a }, { id: 'N', dir: giro + a + b / 2, discontinua: true }, { id: 'D', dir: giro + a + b }],
      [{ de: 'A', a: 'M', rayita: 1, mide: a / 2, radio: 24 }, { de: 'M', a: 'B', rayita: 1, mide: a / 2, radio: 24 }, { de: 'B', a: 'N', rayita: 2, mide: b / 2, radio: 24 }, { de: 'N', a: 'D', rayita: 2, mide: b / 2, radio: 24 },
        { de: 'A', a: 'B', texto: `${a}°`, color: 'h', mide: a, radio: 34, centro: true },
        Object.assign({ de: 'B', a: 'D', mide: b, radio: 34, centro: true }, pideMON ? { texto: `${b}°`, color: 'h' } : { texto: '?' }),
        Object.assign({ de: 'M', a: 'N', mide: m, radio: 74, centro: true }, pideMON ? { texto: '?' } : { texto: `${m}°`, color: 'h' })],
      { alt: '∠AOB y ∠BOD consecutivos, con sus bisectrices OM y ON.' });
      // Si los rótulos no caben (ángulos chicos), otro caso.
      if (PO.escenaCabe({ objeto: 'angulos', figura: F }) || k > 200) break;
    }
    const comun = { datos: [D_BIS, 'Consecutivos: sus medidas se suman.'], dibujo: esc({ objeto: 'angulos', figura: F }) };
    if (pideMON) return Object.assign(comun, {
      pregunta: `∠AOB y ∠BOD son consecutivos, con m∠AOB = ${a}° y m∠BOD = ${b}°. OM y ON son sus bisectrices. ¿Cuánto mide ∠MON?`,
      opciones: opciones(m, [
        { id: 'suma', valor: a + b, error: 'GE-BIS2', siFuera: 'Juntar los dos ángulos va bien; pero OM y ON toman solo la mitad de cada uno.' },
        { id: 'recta', valor: 90, error: 'GE-BIS5', siFuera: 'Recordar los 90° de dos adyacentes va bien; aquí los dos no forman una recta.' },
        { id: 'uno', valor: a / 2 + b, error: 'GE-BIS4', siFuera: 'Tomar la mitad de ∠AOB va bien; falta tomar también la mitad de ∠BOD.' },
        { id: 'mitad', valor: a / 2, error: 'GE-BIS4', siFuera: 'Tomar la mitad de ∠AOB va bien; falta sumarle la mitad de ∠BOD.' },
      ], gr),
      solucion: { texto: `Cada bisectriz toma la mitad de su ángulo: ${f(a / 2)}° y ${f(b / 2)}°.`, ecuacion: junto(`m∠MON = ${f(a / 2)}° + ${f(b / 2)}° = ${f(m)}°`) },
    });
    return Object.assign(comun, {
      pregunta: `∠AOB y ∠BOD son consecutivos, con m∠AOB = ${a}°. OM y ON son sus bisectrices, y m∠MON = ${m}°. ¿Cuánto mide ∠BOD?`,
      opciones: opciones(b, [
        { id: 'mitad', valor: b / 2, error: 'GE-BIS6', siFuera: `Quitarle a ∠MON la mitad de ∠AOB va bien: da ∠BON = ${f(b / 2)}°. ∠BOD es el doble.` },
        { id: 'todo', valor: 2 * m, error: 'GE-BIS8', siFuera: 'Doblar ∠MON va bien: da ∠AOD. Falta quitarle ∠AOB.' },
        { id: 'entero', valor: m - a, error: 'GE-BIS7', siFuera: `A ∠MON se le quita la mitad de ∠AOB, ${f(a / 2)}°, no el ángulo entero.` },
        { id: 'recta', valor: 180 - a, error: 'GE-BIS5', siFuera: 'Eso valdría si los dos formaran una recta; aquí ∠MON no mide 90°.' },
      ], gr),
      solucion: { texto: `∠MON junta la mitad de ∠AOB, ${f(a / 2)}°, y la mitad de ∠BOD.`, ecuacion: [junto(`m∠BON = ${f(m)}° − ${f(a / 2)}° = ${f(b / 2)}°`), '   →   ', junto(`m∠BOD = 2 · ${f(b / 2)}° = ${b}°`)] },
    });
  }
  // Antes, tipo 0: el complemento o el suplemento es m veces el ángulo (sigue en los ejemplos 7 y 11 y en el generador,
  // veces-x).
  function casoVecesX(r) {
    const esS = r() < 0.5, m = r.de(esS ? [1, 2, 3, 4, 5, 8] : [1, 2, 4, 5, 8]), base = esS ? 180 : 90, v = base / (m + 1), otra = esS ? 90 : 180;
    const nom = esS ? 'suplemento' : 'complemento', veces = m === 1 ? 'mide lo mismo que' : `es ${m} veces`;
    return {
      pregunta: `El ${nom} de un ángulo ${veces} el ángulo. ¿Cuánto mide el ángulo?`,
      datos: [D_C, D_S],
      opciones: opciones(v, [
        { id: 'olvida', valor: base / m, error: 'GE-CS4', siFuera: `Repartir ${base}° va bien; pero el ángulo también entra: ${base}° − x = ${m === 1 ? 'x' : `${m}x`}.` },
        { id: 'cambia', valor: otra / (m + 1), error: 'GE-CS5', siFuera: `La cuenta va bien con ${otra}°; pero el ${nom} es lo que falta para ${base}°.` },
        { id: 'el-otro', valor: base - v, error: 'GE-CS6', siFuera: `${gr(base - v)} es el ${nom}; piden el ángulo.` },
      ], gr),
      solucion: { texto: `Si el ángulo mide x: ${base}° − x = ${m === 1 ? 'x' : `${m}x`}, así que ${m + 1}x = ${base}.`, ecuacion: junto(`x = ${base} ÷ ${m + 1} = ${f(v)}: mide ${gr(v)}`) },
    };
  }
  // Tipo 1: el suplemento del complemento.
  function casoCadena(r) {
    const v = 5 * r.ent(2, 16), k = 90 + v;
    return {
      pregunta: `Un ángulo mide x, y el suplemento de su complemento mide ${k}°. ¿Cuánto vale x?`,
      datos: [D_C, D_S],
      opciones: opciones(v, [
        { id: 'solo-s', valor: 180 - k, error: 'GE-CS1', siFuera: `${180 - k}° deshace solo el suplemento: es C(x). Falta deshacer el complemento.` },
        { id: 'orden', valor: k + 90, error: 'GE-CS2', siFuera: 'Eso saldría si el complemento fuera la operación de afuera.' },
        { id: 'mitad', valor: k / 2, error: 'GE-CS3', siFuera: 'Dividir entre 2 serviría con una bisectriz; aquí hay dos restas.' },
      ], NUM),
      solucion: { texto: 'S(C(x)) = 180° − (90° − x) = 90° + x.', ecuacion: junto(`90° + x = ${k}°  →  x = ${v}`) },
    };
  }
  // Tipo 2: el suplemento es m veces el complemento.
  function casoVeces(r) {
    const m = r.de([3, 4, 7, 10]), v = (90 * m - 180) / (m - 1);
    return {
      pregunta: `El suplemento de un ángulo es ${m} veces su complemento. ¿Cuánto mide el ángulo?`,
      datos: [D_C, D_S],
      opciones: opciones(v, [
        { id: 'al-reves', valor: (180 * m - 90) / (m - 1), error: 'GE-CS2', siFuera: `Eso pone el ${m} en el suplemento; el enunciado multiplica al complemento.` },
        { id: 'dividir', valor: 180 / m, error: 'GE-CS4', siFuera: `Repartir 180° entre ${m} olvida que el complemento también depende de x.` },
        { id: 'el-otro', valor: 90 - v, error: 'GE-CS6', siFuera: `${gr(90 - v)} es el complemento; piden el ángulo.` },
      ], gr),
      solucion: { texto: `Si el ángulo mide x: 180° − x = ${m}(90° − x). Reparto y junto las x.`, ecuacion: junto(`${m - 1}x = ${90 * m - 180}  →  x = ${f(v)}: mide ${gr(v)}`) },
    };
  }
  // Tipo 3 (examen, como San Marcos 2026-I): el mayor valor entero con un ángulo agudo.
  // (p, q, c): m∠AOB = px, m∠BOD = qx + c; el límite (90° − c) ÷ (p + q) es entero y, con el mayor x, los dos ángulos
  // miden 25° o más (se dibujan legibles).
  const MAXIMOS = [[1, 2, 0], [2, 1, 0], [2, 1, 15], [2, 2, 10], [2, 3, 0], [2, 3, 15], [3, 1, 10], [3, 2, 15], [3, 2, 20], [3, 3, 0], [4, 1, 15], [4, 2, 0], [1, 1, 20], [5, 3, 10]];
  function casoMaximo(r) {
    const [p, q, c] = r.de(MAXIMOS), lim = (90 - c) / (p + q), bien = lim - 1;
    const xd = bien, ex = (k, cc) => `${k === 1 ? '' : k}x${cc ? ` + ${cc}°` : ''}`;
    const F = abanico([{ id: 'A', dir: 0 }, { id: 'B', dir: p * xd }, { id: 'D', dir: (p + q) * xd + c }],
      [{ de: 'A', a: 'B', texto: ex(p, 0), color: 'h', mide: p * xd }, { de: 'B', a: 'D', texto: ex(q, c), color: 'h', mide: q * xd + c, radio: 34 }],
      { alt: '∠AOB y ∠BOD consecutivos.' });
    return {
      pregunta: `∠AOB y ∠BOD son consecutivos, con m∠AOB = ${ex(p, 0)} y m∠BOD = ${ex(q, c)}. Si ∠AOD es agudo, ¿cuál es el mayor valor entero de x?`,
      datos: [D_CONSEC('A', 'B', 'D'), 'Agudo: más de 0° y menos de 90°.'],
      dibujo: esc({ objeto: 'angulos', figura: F }),
      opciones: opciones(bien, [
        { id: 'limite', valor: lim, error: 'GE-ANG11', siFuera: `Plantear la desigualdad va bien; pero con x = ${lim} el ángulo mide 90°: recto, no agudo.` },
        { id: 'llano', valor: Math.ceil((180 - c) / (p + q)) - 1, error: 'GE-ANG12', siFuera: 'Poner un tope está bien; pero el tope del agudo es 90°, no 180°.' },
        { id: 'angulo', valor: (p + q) * bien + c, error: 'GE-ANG8', siFuera: `Eso mide ∠AOD con x = ${bien}; piden x.` },
      ], NUM),
      solucion: { texto: `${c ? `${p + q}x + ${c}° < 90°` : `${p + q}x < 90`}, así que x < ${lim}. El límite no entra.`, ecuacion: junto(`x = ${bien}`) },
    };
  }

  const bisectriz = {
    id: 'bisectrices',
    titulo: 'Complemento, suplemento y bisectriz',
    pregunta: '¿Cuánto le falta a un ángulo para llegar a 90° o a 180°?',
    temas: ['Bisectriz', 'Ángulos complementarios y suplementarios'],
    pieza: GO,
    aprendizaje: 'El complemento de x es 90° − x; su suplemento, 180° − x. La bisectriz parte un ángulo en dos iguales.',
    actividad: 'Subir la barra de la tranquera y comparar sus ángulos con la pista y el poste.',
    lee: {
      tarjetas: [
        { titulo: 'La tranquera', texto: 'En la entrada de un estacionamiento hay una tranquera: un poste derecho junto a la pista y una barra que sube desde su pie, O. El poste forma 90° con la pista. La barra forma con la pista un ángulo α.',
          pieza: GO, dibujo: esc(tranq(35, { pista: { texto: 'α', color: 'h' } })) },
        { titulo: 'Complemento y suplemento', texto: 'Si un ángulo mide x, lo que le falta para llegar a 90° es su complemento, C(x). Lo que le falta para 180° es su suplemento, S(x). Dos ángulos son adyacentes si comparten un lado y los otros dos forman una recta.' },
        { titulo: 'Partir en dos', texto: 'La bisectriz de un ángulo es el rayo que lo parte en dos ángulos iguales. Al jugar, sube la barra y sigue a los dos turquesas: el ángulo con el poste y el de la pista del otro lado.' },
      ],
    },
    ejemplos: EJ4,
    juega: {
      pieza: GO,
      consigna: 'La barra de la tranquera sube desde la pista hasta el poste. Forma un ángulo α con la pista.',
      mision: {
        texto: 'Súbela hasta que α sea el doble de su ángulo con el poste.',
        logrado: v => v.a === 60,
        bien: 'Listo: 60° = 2 × 30°. Con el poste queda el complemento: 90° − 60°.',
      },
      voz: 'Cuando α crece, ¿qué les pasa a los dos turquesas?',
      leyenda: [
        { s: 'O', t: 'el pie del poste: vértice' },
        { s: dH('α'), t: 'la barra con la pista' },
        { s: dI('turquesa'), t: 'lo que falta para 90° o 180°' },
      ],
      controles: [{ id: 'a', etiqueta: 'α, la barra con la pista', min: 20, max: 90, paso: 10, inicio: 30, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: tranqJuego(v.a), estado: {} }),
      arrastres: [{ id: 'barra', etiqueta: 'punta de la barra: sube o baja', color: 'c-h',
        donde: v => PO.aPantalla(tranqJuego(v.a), U.polar([0, 0], 2.5, v.a)),
        mover: (pt, v) => { const q = PO.aPlano(tranqJuego(v.a), pt); return { a: Math.max(0, Math.min(90, U.grados(Math.atan2(Math.max(q[1], 0), q[0])))) }; } }],
      lectura: v => [dH(`${v.a}°`), ' + ', dI(`${90 - v.a}°`), ' = 90° y ', dH(`${v.a}°`), ' + ', dI(`${180 - v.a}°`), ' = 180°'],
      minimo: 3,
    },
    predice: {
      pregunta: 'La barra forma 50° con la pista. Se traza la bisectriz de ese ángulo y la del ángulo que la barra forma con la pista del otro lado. ¿Qué ángulo forman las dos bisectrices?',
      datos: ['La pista es una recta: 180°.'],
      voz: 'Decide antes de trazar. Luego comprobamos con las mitades.',
      opciones: [
        { id: 'c', texto: '90°', correcta: true },
        { id: 'depende', texto: 'Depende de cuánto suba la barra', error: 'GE-BIS1', siFuera: 'Cada mitad sí cambia con la barra; pero juntas son la mitad de 180°.' },
        { id: 'llano', texto: '180°', error: 'GE-BIS2', siFuera: '180° es lo que suman los dos ángulos completos; las bisectrices toman la mitad de cada uno.' },
        { id: 'alfa', texto: '50°', error: 'GE-BIS3', siFuera: '50° sería cierto si las bisectrices fueran los lados del ángulo; cada una lo parte.' },
      ],
      dibujo: esc(tranq(50, { pista: { texto: '50°', color: 'h' }, bisectrices: 0, entre: { texto: '?' } })),
      revelar: esc(tranq(50, { bisectrices: 0, mitades: { texto1: '25°', texto2: '65°', color1: 'h', color2: 'i' }, entre: { texto: '90°' } })),
      coincide: 'Coincide: 25° + 65° = 90°, la mitad de los 180° de la pista.',
      noCoincide: 'Revisemos: una mitad de cada lado, 25° + 65° = 90°.',
    },
    mira: {
      pieza: GO,
      datos: tranq(50, { pista: { texto: '50°', color: 'h', hasta: 0 }, bisectrices: { primera: 1, segunda: 3 }, otro: { texto: '130°', color: 'i', desde: 2, hasta: 2 },
        mitades: { texto1: '25°', texto2: '65°', color1: 'h', color2: 'i', desde1: 1, desde2: 3 }, entre: { texto: '90°', desde: 4 } }),
      voz: 'Sigue las rayitas: iguales dentro de cada ángulo.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La barra forma 50° con la pista.', ecuacion: junto(['α = ', dH('50°')]) },
        { estado: { corte: 1 }, texto: 'Su bisectriz parte los 50° en dos de 25°.', ecuacion: junto(['50° ÷ 2 = ', dH('25°')]) },
        { estado: { corte: 2 }, texto: 'Del otro lado queda el suplemento de 50°.', ecuacion: junto(['S(50°) = 180° − 50° = ', dI('130°')]) },
        { estado: { corte: 3 }, texto: 'Su bisectriz parte los 130° en dos de 65°.', ecuacion: junto(['130° ÷ 2 = ', dI('65°')]) },
        { estado: { corte: 4 }, texto: 'Entre las bisectrices queda una mitad de cada lado.', ecuacion: junto([dH('25°'), ' + ', dI('65°'), ' = 90°']) },
        { estado: { corte: 4 }, texto: 'Con cualquier barra da 90°: la mitad de 180°.', ecuacion: junto([{ frac: [dH('α'), '2'] }, ' + ', { frac: [[dI('180° − α')], '2'] }, ' = ', { frac: ['180°', '2'] }, ' = 90°']) },
      ],
    },
    // La regla dice también lo que pide «Ahora tú» de las bisectrices (dos consecutivos: la mitad de su suma) y su
    // ecuación no lleva frases largas sin corte (auditoría, 17 nov: «bisectrices de dos adyacentes: 90°» se cortaba a
    // 390 px; la prueba mide cada tramo que no se parte).
    regla: {
      texto: 'C(x) es lo que a x le falta para 90°; S(x), lo que le falta para 180°. Las bisectrices de dos consecutivos forman la mitad de su suma.',
      ecuacion: [junto(['C(x) = 90° − x']), SEP, junto(['S(x) = 180° − x']), SEP, junto([{ frac: [dH('x'), '2'] }, ' + ', { frac: [[dI('180° − x')], '2'] }, ' = 90°'])],
      condicion: 'x < 90 para C(x) y x < 180 para S(x). Dos adyacentes suman 180°: sus bisectrices forman 90°.',
      voz: 'Primero el complemento, después el suplemento.',
      // Dibujo propio (4i): la tranquera con las letras de la regla, no los 50° de «Mira». Ronda 2 del lector (18 nov): el
      // «90°» entre las bisectrices quedaba pegado al poste y se leía como el ángulo del poste con la pista; y C(x) no
      // estaba en el dibujo. Ahora x, C(x) (con el poste) y S(x) (con la pista del otro lado), con los nombres de la regla;
      // las bisectrices y sus 90° ya se vieron en «Mira».
      dibujo: esc(tranq(35, { pista: { texto: 'x', color: 'h' }, poste: { texto: 'C(x)', color: 'i', lejos: 2.2 }, otro: { texto: 'S(x)', color: 'i' } })),
    },
    // Así se resuelve: la bisectriz y el suplemento juntos (A, O y E en una recta). «Ahora tú» pide las bisectrices de dos
    // consecutivos, ecuaciones con C(x) y S(x) y el mayor entero.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900), t = 10 * r.ent(6, 15), h = t / 2, de = h + 180 - t;
        const F = lineaRayo(t, [{ id: 'D', dir: h, discontinua: true }], [{ de: 'A', a: 'B', texto: `${t}°`, color: 'h', mide: t, radio: 40, centro: true }, { de: 'A', a: 'D', rayita: 1, mide: h, radio: 26 }, { de: 'D', a: 'B', rayita: 1, mide: h, radio: 26 }, { de: 'D', a: 'E', texto: '?', mide: de, radio: 64, centro: true }],
          'A, O y E en una recta; OB sale de O y OD es la bisectriz de ∠AOB.');
        return {
          enunciado: `A, O y E están en una recta. m∠AOB = ${t}° y OD es la bisectriz de ∠AOB. ¿Cuánto mide ∠DOE?`,
          datos: [D_BIS, D_ADY],
          dibujo: esc({ objeto: 'angulos', figura: F }),
          pasos: [
            { tipo: 'pide', texto: '∠DOE: de la bisectriz OD hasta el rayo OE, pasando por OB.' },
            { tipo: 'datos', texto: `∠AOB mide ${t}°, OD lo parte en dos, y A, O y E forman una recta.` },
            { tipo: 'regla', texto: 'La bisectriz deja dos mitades iguales, y dos adyacentes sobre la recta suman 180°.', ecuacion: [junto(`m∠DOB = ${t}° ÷ 2`), SEP, junto(`m∠BOE = 180° − ${t}°`)] },
            { tipo: 'cuentas', texto: '∠DOE junta la mitad y el suplemento:', ecuacion: [junto(`${f(h)}° + ${180 - t}° = `), dF(`${f(de)}°`)] },
            { tipo: 'sentido', texto: `Compruebo: ${f(h)}° + ${f(de)}° = 180°, la recta entera de A a E.` },
          ],
          respuesta: ['m∠DOE = ', dF(`${f(de)}°`)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      // (Ronda 2 del lector, 18 nov: «como una resta» no servía para ∠MON, que se resuelve sumando mitades.)
      voz: 'El complemento y el suplemento son restas; cada bisectriz toma una mitad.',
      generar(s) { return conCuatro([casoBisectriz, casoCadena, casoVeces, casoMaximo][s % 4], azar(s + 7)); },
    },
  };

  // ---------- Idea 5 (17 nov): paralelas cortadas por una secante ----------
  // Objeto de la primera pantalla: los rieles del tren a Cusco y una calle que los cruza (geo-objeto, rieles; dibujo de
  // prueba), vistos desde arriba.
  // Cambia: θ, la inclinación de la calle. · Permanece: los dos rieles, paralelos. · Progresa: los ocho ángulos, que
  // tienen solo dos medidas. · Se reserva: un riel que deja de ser paralelo (la predicción). · Debe verse: las igualdades
  // dependen de que los rieles sean paralelos, no del aspecto.
  // Colores: θ y sus tres iguales en carmín; sus compañeros (180° − θ) en turquesa. En los ejercicios, todo ángulo dado en
  // carmín y lo pedido con «x» o «?» en tinta (el turquesa diría si es igual o suplementario).
  // Errores: GE17-a iguala o suplementa al revés y GE17-b asume paralelas por el aspecto (las dos mitades de GE17,
  // docs/investigacion/geometria-ideas-erroneas.md); hipótesis nuevas: GE-PAR1 cuenta el giro dos veces, GE-PAR2 usa el
  // complemento, GE-PAR3 resta de una vuelta, GE-PAR4 da x en vez del ángulo, GE-PAR5 cree que sin medir no se sabe, GE-PAR6 tolera una diferencia chica.
  const rielesJ = t => ({ objeto: 'rieles', theta: t, angulos: ['ad', 'ai', 'bi', 'bd'].flatMap(c => ['P', 'Q'].map(k => ({ cruce: k, cuad: c, texto: `${c === 'ad' || c === 'bi' ? t : 180 - t}°`, color: c === 'ad' || c === 'bi' ? 'h' : 'i' }))) });
  const IGUAL_TH = c => c === 'ad' || c === 'bi';
  // Los pares entre los dos cruces (P en L₂, abajo; Q en L₁, arriba) y si son iguales o suman 180°.
  const PARES = [
    { nombre: 'correspondientes', p: 'ad', q: 'ad', igual: true }, { nombre: 'correspondientes', p: 'ai', q: 'ai', igual: true },
    { nombre: 'correspondientes', p: 'bd', q: 'bd', igual: true }, { nombre: 'correspondientes', p: 'bi', q: 'bi', igual: true },
    { nombre: 'alternos internos', p: 'ad', q: 'bi', igual: true }, { nombre: 'alternos internos', p: 'ai', q: 'bd', igual: true },
    { nombre: 'alternos externos', p: 'bi', q: 'ad', igual: true }, { nombre: 'alternos externos', p: 'bd', q: 'ai', igual: true },
    { nombre: 'conjugados internos', p: 'ad', q: 'bd', igual: false }, { nombre: 'conjugados internos', p: 'ai', q: 'bi', igual: false },
    { nombre: 'conjugados externos', p: 'bd', q: 'ad', igual: false }, { nombre: 'conjugados externos', p: 'bi', q: 'ai', igual: false },
  ];
  const D_IGUALES = 'Entre paralelas: correspondientes, alternos internos y alternos externos son iguales.';
  const D_SUMAN = 'Entre paralelas: conjugados internos y conjugados externos suman 180°.';
  const D_CRUCE = 'En un cruce: opuestos por el vértice iguales; vecinos, suman 180°.';
  // Dos paralelas y una secante, de examen: L₂ abajo (cruce P), L₁ arriba (cruce Q); giro: toda la figura girada;
  // abre: cuánto se abre L₁ (0: paralelas). marcas: [{ cruce, cuad, texto, color, mide }].
  function paralelasFig(th, marcas, o = {}) {
    const giro = o.giro || 0, abre = o.abre || 0, h = 3.6, t = Math.tan(U.rad(th));
    const rot = p => { const c = Math.cos(U.rad(giro)), s = Math.sin(U.rad(giro)); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; };
    const P = [-h / 2 / t, 0], Q = [h / 2 / t, h], u = U.polar([0, 0], 1, th), w = U.polar([0, 0], 1, abre);
    const base = { P, Q, Pd: [P[0] + 1, 0], Pi: [P[0] - 1, 0], Pu: [P[0] + u[0], u[1]], Pb: [P[0] - u[0], -u[1]],
      Qd: [Q[0] + w[0], h + w[1]], Qi: [Q[0] - w[0], h - w[1]], Qu: [Q[0] + u[0], h + u[1]], Qb: [Q[0] - u[0], h - u[1]] };
    const pts = Object.entries(base).map(([id, p]) => { const q = rot(p); return { id, x: q[0], y: q[1], sinPunto: true }; });
    const LADOS = { ad: ['d', 'u'], ai: ['u', 'i'], bi: ['i', 'b'], bd: ['b', 'd'] };
    const R = 3.4, rp = (p, k) => rot([p[0] + k, p[1]]);
    const esq = [rp([0, 0], -R), rp([0, 0], R), rp([0, h], -R), rp([0, h], R)];
    const xs = esq.map(p => p[0]), ys = esq.map(p => p[1]);
    return {
      fig: { alt: o.alt || 'Dos rectas cortadas por una secante.', vista: { x: [Math.min(...xs) - 0.7, Math.max(...xs) + 0.7], y: [Math.min(...ys) - (giro ? 2.1 : 1.6), Math.max(...ys) + (giro ? 2.1 : 1.6)] }, alto: 260,
        puntos: pts, segmentos: [{ de: 'Pi', a: 'Pd', recta: true, paralela: o.marcarParalelas === false || abre ? 0 : 1 }, { de: 'Qi', a: 'Qd', recta: true, paralela: o.marcarParalelas === false || abre ? 0 : 1 }, { de: 'Pb', a: 'Qu', recta: true }],
        angulos: marcas.map(m => { const [l1, l2] = LADOS[m.cuad]; return Object.assign({ en: m.cruce, de: m.cruce + l1, a: m.cruce + l2, texto: m.texto, color: m.color, mide: m.mide, radio: m.radio || 22, holgura: 6 }, m.sector ? { sector: m.sector.map(x => x + giro) } : {}, m.centro ? { centro: true } : {}); }) },
      // L₁ y L₂ van en la punta de su recta más lejana de su cruce con la secante (ahí no hay ángulos ni la secante), y
      // afuera de la franja entre las dos: L₁ encima de la de arriba, L₂ debajo de la de abajo (auditoría, 17 nov: L₂
      // encima de su recta quedaba pegado a un ángulo del cruce de arriba).
      ls: [{ p: rot([P[0] < 0 ? R - 0.75 : -R + 0.35, -0.95]), k: 2 }, (() => { const x = Q[0] < 0 ? R - 0.75 : -R + 0.35; return { p: rot([x, h + (x - Q[0]) * Math.tan(U.rad(abre)) + 0.6]), k: 1 }; })()],
    };
  }
  const medidaEn = (th, cuad) => (IGUAL_TH(cuad) ? th : 180 - th);
  const figPar = (th, marcas, o) => { const z = paralelasFig(th, marcas, o); return { pieza: GO, datos: { objeto: 'angulos', figura: z.fig, ls: z.ls }, estado: {} }; };
  const mk = (cruce, cuad, th, texto, color) => ({ cruce, cuad, texto, color, mide: medidaEn(th, cuad) });

  // Ejemplos de «Paralelas cortadas por una secante». Cuentas rehechas aparte (cuentas.js): correspondientes 70 = 70;
  // alternos internos 115; conjugados 180 − 65 = 115; opuestos 40; alternos externos 130; 3x + 10 = 5x − 30 → 20, 70;
  // 2x + 20 + 3x + 10 = 180 → 30; 180 − 112 = 68; x + 40 + 2x + 20 = 180 → 40; 72 ≠ 70; 4x − 15 = 2x + 35 → 25, 85;
  // 2·20 + 30 = 70 = 4·20 − 10; 2k + 3k = 180 → 72 y 108; 4θ = 220 → 55, 125; bisectrices de conjugados: 90.
  const EJ5 = [];
  const ej5 = (nivel, titulo, th, marcas, enunciado, datos, solucion, respuesta, o) => EJ5.push({ nivel, titulo, figura: figPar(th, marcas, o), enunciado, datos, solucion, respuesta });
  ej5(1, 'Correspondientes', 70, [mk('P', 'ad', 70, '70°', 'h'), mk('Q', 'ad', 70, 'x')],
    ['Las rectas ', L1, ' y ', L2, ' son paralelas. En la figura, x y el ángulo de 70° ocupan el mismo lugar en cada cruce. ¿Cuánto vale x?'], [D_IGUALES],
    [{ texto: 'Ocupan el mismo lugar en los dos cruces: son correspondientes, y entre paralelas son iguales.', ecuacion: junto(['x = ', dF('70')]) }], ['x = ', dF('70')]);
  ej5(1, 'Alternos internos', 65, [mk('P', 'ai', 65, '115°', 'h'), mk('Q', 'bd', 65, 'x')],
    ['', L1, ' ∥ ', L2, '. x y el ángulo de 115° están entre las rectas y a distinto lado de la secante. ¿Cuánto vale x?'], [D_IGUALES],
    [{ texto: 'Son alternos internos: entre paralelas, iguales.', ecuacion: junto(['x = ', dF('115')]) }], ['x = ', dF('115')]);
  ej5(1, 'Conjugados internos', 65, [mk('P', 'ad', 65, '65°', 'h'), mk('Q', 'bd', 65, 'x')],
    ['', L1, ' ∥ ', L2, '. x y el ángulo de 65° están entre las rectas y del mismo lado de la secante. ¿Cuánto vale x?'], [D_SUMAN],
    [{ texto: 'Son conjugados internos: suman 180°.', ecuacion: [junto('x + 65° = 180°'), '   →   ', junto(['x = ', dF('115')])] }], ['x = ', dF('115')]);
  ej5(1, 'Opuestos por el vértice', 40, [mk('P', 'ad', 40, '40°', 'h'), mk('P', 'bi', 40, 'x')],
    ['', L1, ' ∥ ', L2, '. En el cruce de abajo, x queda frente a frente con el ángulo de 40°. ¿Cuánto vale x?'], [D_CRUCE],
    [{ texto: 'Son opuestos por el vértice: los dos son suplemento del mismo vecino, así que miden igual.', ecuacion: junto(['x = ', dF('40')]) }], ['x = ', dF('40')]);
  ej5(1, 'Alternos externos', 50, [mk('P', 'bd', 50, '130°', 'h'), mk('Q', 'ai', 50, 'x')],
    ['', L1, ' ∥ ', L2, '. x y el ángulo de 130° están fuera de las rectas y a distinto lado de la secante. ¿Cuánto vale x?'], [D_IGUALES],
    [{ texto: 'Son alternos externos: entre paralelas, iguales.', ecuacion: junto(['x = ', dF('130')]) }], ['x = ', dF('130')]);
  ej5(2, 'Con una ecuación', 70, [mk('P', 'ad', 70, '3x + 10°', 'h'), mk('Q', 'bi', 70, '5x − 30°', 'h')],
    ['', L1, ' ∥ ', L2, '. Los ángulos 3x + 10° y 5x − 30° de la figura son alternos internos. ¿Cuánto vale x y cuánto mide cada ángulo?'], [D_IGUALES],
    [{ texto: 'Alternos internos: iguales. Igualo y junto las x.', ecuacion: [junto('3x + 10° = 5x − 30°'), '   →   ', junto('2x = 40'), '   →   ', junto(['x = ', dF('20')])] },
      { texto: 'Cada ángulo:', ecuacion: [junto('3 · 20 + 10° = 70°'), ' y ', junto('5 · 20 − 30° = 70°')] }], ['x = ', dF('20'), '; cada ángulo, 70°']);
  // Dibujado con θ = 100°: con x = 30, 2x + 20° = 80° (P, arriba a la izquierda) y 3x + 10° = 100° (Q, abajo a la
  // izquierda). Con θ = 60° el rótulo que vale 80° caía en un obtuso (auditoría, 17 nov).
  ej5(2, 'Suman 180°', 100, [mk('P', 'ai', 100, '2x + 20°', 'h'), mk('Q', 'bi', 100, '3x + 10°', 'h')],
    ['', L1, ' ∥ ', L2, '. Los ángulos 2x + 20° y 3x + 10° son conjugados internos. ¿Cuánto vale x?'], [D_SUMAN],
    [{ texto: 'Conjugados internos: suman 180°.', ecuacion: [junto('2x + 20° + 3x + 10° = 180°'), '   →   ', junto('5x = 150'), '   →   ', junto(['x = ', dF('30')])] },
      { texto: 'Compruebo: 80° + 100° = 180°.' }], ['x = ', dF('30')]);
  // (Ronda 2 del lector, 18 nov: el de 112° tiene dos vecinos y la figura no marcaba cuál se usa: va con β.)
  ej5(2, 'En dos pasos', 68, [mk('P', 'ai', 68, '112°', 'h'), mk('P', 'ad', 68, 'β'), mk('Q', 'ad', 68, 'x')],
    ['', L1, ' ∥ ', L2, '. En el cruce de abajo, un ángulo mide 112°. ¿Cuánto vale x, en el cruce de arriba?'], [D_IGUALES, D_CRUCE],
    [{ texto: 'En el cruce de abajo, β es vecino del de 112°: suman 180°.', ecuacion: junto('β = 180° − 112° = 68°') },
      { texto: 'β y x ocupan el mismo lugar en los dos cruces: son correspondientes.', ecuacion: junto(['x = ', dF('68')]) }], ['x = ', dF('68')]);
  ej5(2, 'Conjugados externos', 80, [mk('P', 'bd', 80, '2x + 20°', 'h'), mk('Q', 'ad', 80, 'x + 40°', 'h')],
    ['', L1, ' ∥ ', L2, '. Los ángulos x + 40° y 2x + 20° son conjugados externos. ¿Cuánto vale x?'], [D_SUMAN],
    [{ texto: 'Conjugados externos: suman 180°.', ecuacion: [junto('x + 40° + 2x + 20° = 180°'), '   →   ', junto('3x = 120'), '   →   ', junto(['x = ', dF('40')])] },
      { texto: 'Compruebo: 80° + 100° = 180°.' }], ['x = ', dF('40')]);
  ej5(2, '¿Son paralelas?', 72, [mk('P', 'ad', 72, '72°', 'h'), { cruce: 'Q', cuad: 'ad', texto: '70°', color: 'h', mide: 70 }],
    ['La secante corta a ', L1, ' y ', L2, '. Los dos ángulos correspondientes de la figura miden 72° y 70°. ¿', L1, ' y ', L2, ' son paralelas?'],
    [D_IGUALES, 'Al revés: si dos correspondientes son iguales, las rectas son paralelas.'],
    [{ texto: 'Si fueran paralelas, los correspondientes medirían igual. No miden igual:', ecuacion: junto('72° ≠ 70°') },
      { texto: 'No son paralelas, aunque en el dibujo casi lo parezcan: se juntan lejos, a la derecha.' }], [dF('No'), ': los correspondientes no son iguales'], { abre: 2 });
  ej5(3, 'La figura girada', 85, [mk('P', 'bi', 85, '4x − 15°', 'h'), mk('Q', 'ad', 85, '2x + 35°', 'h')],
    ['', L1, ' ∥ ', L2, ', aunque la figura esté girada. Los ángulos 4x − 15° y 2x + 35° son alternos externos. ¿Cuánto mide cada uno?'], [D_IGUALES],
    [{ texto: 'Girar la figura no cambia los ángulos. Alternos externos: iguales.', ecuacion: [junto('4x − 15° = 2x + 35°'), '   →   ', junto('2x = 50'), '   →   ', junto('x = 25')] },
      { texto: 'Me piden los ángulos, no x:', ecuacion: junto(['4 · 25 − 15° = ', dF('85°')]) }], ['Cada uno mide ', dF('85°')], { giro: 35 });
  ej5(3, '¿Paralelas con x?', 70, [mk('P', 'ad', 70, '2x + 30°', 'h'), mk('Q', 'bi', 70, '4x − 10°', 'h')],
    ['Una secante corta a ', L1, ' y ', L2, '. Dos alternos internos miden 2x + 30° y 4x − 10°, con x = 20. ¿', L1, ' y ', L2, ' son paralelas?'],
    [D_IGUALES, 'Al revés: si dos alternos internos son iguales, las rectas son paralelas.'],
    [{ texto: 'Reemplazo x = 20 en los dos:', ecuacion: [junto('2 · 20 + 30° = 70°'), SEP, junto('4 · 20 − 10° = 70°')] },
      { texto: 'Los alternos internos miden igual: las rectas son paralelas.' }], [dF('Sí'), ': los dos miden 70°'], { marcarParalelas: false });
  ej5(3, 'Conjugados en razón', 72, [mk('P', 'ad', 72, '2k', 'h'), mk('Q', 'bd', 72, '3k', 'h')],
    ['', L1, ' ∥ ', L2, '. Dos conjugados internos están en razón 2 : 3. ¿Cuánto mide cada uno?'], [D_SUMAN, 'Razón 2 : 3: miden 2k y 3k.'],
    [{ texto: 'Conjugados internos: suman 180°.', ecuacion: [junto('2k + 3k = 180'), '   →   ', junto('k = 36')] },
      { texto: 'Cada uno:', ecuacion: [junto(['2 · 36 = ', dF('72°')]), SEP, junto(['3 · 36 = ', dF('108°')])] }], [dF('72°'), ' y ', dF('108°')]);
  // Ronda 2 del lector (18 nov): «Los cuatro agudos» (todos rotulados θ: el dibujo ya decía que eran iguales) no era más
  // difícil que el 8, y sus arcos θ, «?» y θ se fundían. Ahora dos ángulos que no forman un par con nombre: hay que pasar
  // por el opuesto por el vértice para ver los conjugados, plantear, despejar y multiplicar. Cuentas: 2x + 15 + 5x + 25 =
  // 180 → 7x = 140 → x = 20; agudo 55°, obtuso 125° (55 + 125 = 180); 4 · 55 = 220.
  ej5(3, 'Agudos y obtusos', 55, [mk('P', 'bi', 55, '2x + 15°', 'h'), mk('Q', 'bd', 55, '5x + 25°', 'h')],
    ['', L1, ' ∥ ', L2, '. En la figura, un ángulo agudo mide 2x + 15° y un obtuso del otro cruce mide 5x + 25°. ¿Cuánto suman los cuatro ángulos agudos de la figura?'], [D_IGUALES, D_SUMAN, D_CRUCE],
    [{ texto: 'El opuesto por el vértice de 2x + 15° queda entre las rectas, del mismo lado que 5x + 25°: son conjugados internos y suman 180°.', ecuacion: [junto('2x + 15° + 5x + 25° = 180°'), '   →   ', junto('7x = 140'), '   →   ', junto('x = 20')] },
      { texto: 'Cada agudo mide 2 · 20 + 15° = 55°, y entre paralelas los cuatro agudos son iguales:', ecuacion: junto(['4 · 55° = ', dF('220°')]) }], ['Los cuatro agudos suman ', dF('220°')]);
  {
    // Bisectrices de los dos conjugados internos de la derecha: se cortan en K, entre las paralelas, a 90°.
    const th = 64, h = 3.6, t = Math.tan(U.rad(th)), P = [-h / 2 / t, 0], Q = [h / 2 / t, h];
    const bP = U.polar(P, 1, th / 2), bQ = U.polar(Q, 1, 180 + th + (180 - th) / 2);
    const K = U.corte(P, bP, Q, bQ);
    const z = paralelasFig(th, [Object.assign(mk('P', 'ad', th, '64°', 'h'), { centro: true, radio: 30 })]);
    z.fig.puntos.push({ id: 'K', x: K[0], y: K[1], rotulo: 'K', lado: 0 });
    z.fig.segmentos.push({ de: 'P', a: 'K', discontinua: true }, { de: 'Q', a: 'K', discontinua: true });
    z.fig.angulos.push({ en: 'K', de: 'P', a: 'Q', texto: '?', mide: 90, radio: 14, holgura: 6 });
    z.fig.alt = 'Dos paralelas y una secante; las bisectrices de los dos conjugados internos de la derecha se cortan en K.';
    EJ5.push({ nivel: 3, titulo: 'Bisectrices entre paralelas', figura: { pieza: GO, datos: { objeto: 'angulos', figura: z.fig, ls: z.ls }, estado: {} },
      enunciado: ['', L1, ' ∥ ', L2, '. Los dos conjugados internos de la derecha miden 64° y 116°. Sus bisectrices se cortan en K. ¿Cuánto mide el ángulo en K?'],
      datos: [D_BIS, 'Los tres ángulos de un triángulo suman 180°.'],
      solucion: [
        { texto: 'Las bisectrices toman la mitad de cada conjugado:', ecuacion: [junto('64° ÷ 2 = 32°'), SEP, junto('116° ÷ 2 = 58°')] },
        { texto: 'En el triángulo de P, Q y K, el ángulo en K es lo que falta:', ecuacion: junto(['180° − 32° − 58° = ', dF('90°')]) },
        { texto: 'Siempre da 90°: las dos mitades suman la mitad de 180°.' },
      ],
      respuesta: ['El ángulo en K mide ', dF('90°')] });
  }

  // «Ahora tú» de la idea 5. Tipo 0: un ángulo dado y x en otro lugar de la figura (sin decir el par).
  const CUADS = ['ad', 'ai', 'bi', 'bd'];
  function casoPar(r) {
    const th = 5 * r.ent(10, 26), c1 = r.de(CUADS), k1 = r.de(['P', 'Q']);
    let c2 = r.de(CUADS), k2 = r.de(['P', 'Q']); if (c2 === c1 && k2 === k1) k2 = k1 === 'P' ? 'Q' : 'P';
    const v = medidaEn(th, c1), x = medidaEn(th, c2), otro = 180 - x, giro = r.de([0, 0, 15, -20]);
    return {
      pregunta: ['', L1, ' ∥ ', L2, ` y una secante las corta. Uno de los ángulos mide ${v}°. ¿Cuánto vale x?`],
      datos: [D_IGUALES, D_SUMAN, D_CRUCE],
      dibujo: figPar(th, [mk(k1, c1, th, `${v}°`, 'h'), mk(k2, c2, th, 'x')], { giro }),
      opciones: opciones(x, [
        { id: 'cambio', valor: otro, error: 'GE17-a', siFuera: x === v ? 'Sumar 180° vale para conjugados y vecinos; estos dos ocupan lugares que miden igual.' : 'Igualar vale para correspondientes, alternos y opuestos; estos dos suman 180°.' },
        { id: 'comp', valor: Math.abs(90 - v), error: 'GE-PAR2', siFuera: 'Buscar lo que falta es buena idea; pero entre paralelas se completa 180°, no 90°.' },
        { id: 'vuelta', valor: 360 - v, error: 'GE-PAR3', siFuera: 'Una vuelta mide 360°, cierto; pero estos dos no dan la vuelta entera.' },
      ], NUM),
      solucion: { texto: x === v ? 'Ocupan lugares de igual medida.' : 'Ocupan lugares que juntos suman 180°.', ecuacion: junto(x === v ? `x = ${x}` : `x + ${v}° = 180°  →  x = ${x}`) },
    };
  }
  // Tipo 1: dos expresiones con x en lugares de la figura (sin decir el par).
  function casoEcuacion(r) {
    const par = r.de(PARES), th = 5 * r.ent(10, 26), m1 = medidaEn(th, par.p), m2 = medidaEn(th, par.q), v = r.ent(5, 25);
    const a1 = r.ent(2, 5), a2 = r.ent(1, 4) === a1 ? a1 - 1 : r.ent(1, 4), b1 = m1 - a1 * v, b2 = m2 - a2 * v;
    if (a1 === a2 || Math.abs(b1) > 60 || Math.abs(b2) > 60 || !b1 || !b2) return casoEcuacion(r);
    const ex = (a, b) => `${a === 1 ? '' : a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}°`;
    const otro = par.igual ? (180 - b1 - b2) / (a1 + a2) : (b2 - b1) / (a1 - a2);
    return {
      pregunta: ['', L1, ' ∥ ', L2, `. Dos ángulos de la figura miden ${ex(a1, b1)} y ${ex(a2, b2)}. ¿Cuánto vale x?`],
      datos: [D_IGUALES, D_SUMAN, D_CRUCE],
      dibujo: figPar(th, [mk('P', par.p, th, ex(a1, b1), 'h'), mk('Q', par.q, th, ex(a2, b2), 'h')]),
      opciones: opciones(v, [
        { id: 'cambio', valor: otro, error: 'GE17-a', siFuera: par.igual ? 'Sumar 180° vale para conjugados; estos dos son iguales.' : 'Igualar vale para correspondientes y alternos; estos dos suman 180°.' },
        { id: 'angulo', valor: m1, error: 'GE-PAR4', siFuera: `${m1}° es lo que mide el ángulo; piden x.` },
        { id: 'otro-angulo', valor: m2 === m1 ? 180 - m1 : m2, error: 'GE-PAR4', siFuera: 'Ese valor es la medida de un ángulo de la figura; piden x.' },
      ], NUM),
      solucion: { texto: `Son ${par.nombre}: ${par.igual ? 'iguales' : 'suman 180°'}.`, ecuacion: junto(par.igual ? `${ex(a1, b1)} = ${ex(a2, b2)}  →  x = ${v}` : `${ex(a1, b1)} + ${ex(a2, b2)} = 180°  →  x = ${v}`) },
    };
  }
  // Tipo 2 (examen): ¿son paralelas? Dos ángulos de un par; las rectas se dibujan como de verdad son.
  function casoSonParalelas(r) {
    const par = r.de(PARES), th = 5 * r.ent(10, 26), si = r() < 0.5, d = si ? 0 : r.de([2, 3, 4, 5]) * r.de([1, -1]);
    const mP = medidaEn(th, par.p), mQ = medidaEn(th - d, par.q);
    const regla = par.igual ? 'ser iguales' : 'sumar 180°', otra = par.igual ? 'sumar 180°' : 'ser iguales';
    const ops = si ? [
      { id: 'si', texto: 'Sí: los dos cumplen la regla de su par', correcta: true },
      { id: 'regla', texto: `No: para ser paralelas deberían ${otra}`, error: 'GE17-a', siFuera: `Revisar la regla del par es la idea; pero los ${par.nombre} deben ${regla}.` },
      { id: 'marca', texto: 'No: en el dibujo no están marcadas como paralelas', error: 'GE17-b', siFuera: 'Las marcas ayudan a leer la figura; pero aquí lo deciden los ángulos.' },
      { id: 'medir', texto: 'No se sabe sin medir la distancia entre ellas', error: 'GE-PAR5', siFuera: 'Medir la distancia en varios lugares serviría; pero un par de ángulos ya lo decide.' },
    ] : [
      { id: 'no', texto: `No: los ${par.nombre} no cumplen su regla`, correcta: true },
      { id: 'aspecto', texto: 'Sí: en el dibujo se ven paralelas', error: 'GE17-b', siFuera: 'Mirar el dibujo ayuda a ubicarse; pero solo los ángulos lo deciden.' },
      { id: 'chica', texto: `Sí: la diferencia de ${Math.abs(d)}° es muy chica`, error: 'GE-PAR6', siFuera: 'La diferencia es chica, es cierto; pero con cualquier diferencia las rectas se cortan lejos.' },
      { id: 'medir', texto: 'No se sabe sin medir la distancia entre ellas', error: 'GE-PAR5', siFuera: 'Medir la distancia en varios lugares serviría; pero un par de ángulos ya lo decide.' },
    ];
    return {
      pregunta: ['Una secante corta a ', L1, ' y ', L2, `. Dos ${par.nombre} miden ${mP}° y ${mQ}°. ¿`, L1, ' y ', L2, ' son paralelas?'],
      datos: [D_IGUALES, D_SUMAN, 'Al revés: si un par cumple su regla, las rectas son paralelas.'],
      dibujo: figPar(th, [{ cruce: 'P', cuad: par.p, texto: `${mP}°`, color: 'h', mide: mP }, { cruce: 'Q', cuad: par.q, texto: `${mQ}°`, color: 'h', mide: mQ }], { abre: d, marcarParalelas: false }),
      opciones: ops,
      solucion: { texto: `Los ${par.nombre} ${par.igual ? 'deben medir igual' : 'deben sumar 180°'}.`, ecuacion: junto(par.igual ? `${mP}° ${mP === mQ ? '=' : '≠'} ${mQ}°` : `${mP}° + ${mQ}° = ${mP + mQ}°`) },
    };
  }
  // Tipo 3 (examen): la figura girada; se pide la medida del ángulo, no x.
  function casoGirada(r) {
    const par = r.de(PARES.filter(p => p.nombre.endsWith('externos'))), th = 5 * r.ent(12, 24), m1 = medidaEn(th, par.p), m2 = medidaEn(th, par.q), v = r.ent(6, 25);
    const a1 = r.ent(2, 5), a2 = r.ent(1, a1 - 1), b1 = m1 - a1 * v, b2 = m2 - a2 * v;
    if (Math.abs(b1) > 60 || Math.abs(b2) > 60 || b1 === 0 || b2 === 0) return casoGirada(r);
    const ex = (a, b) => `${a === 1 ? '' : a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}°`, giro = r.de([25, 35, -30, 50, -45]);
    return {
      pregunta: ['', L1, ' ∥ ', L2, `, aunque la figura esté girada. Los ${par.nombre} miden ${ex(a1, b1)} y ${ex(a2, b2)}. ¿Cuánto mide el ángulo ${ex(a1, b1)}?`],
      datos: [D_IGUALES, D_SUMAN],
      dibujo: figPar(th, [mk('P', par.p, th, ex(a1, b1), 'h'), mk('Q', par.q, th, ex(a2, b2), 'h')], { giro }),
      opciones: opciones(m1, [
        { id: 'x', valor: v, error: 'GE-PAR4', siFuera: `Hallar x = ${v} está bien; falta reemplazarlo en el ángulo.` },
        { id: 'supl', valor: 180 - m1, error: 'GE17-a', siFuera: par.igual ? 'Ese es el vecino del ángulo; estos dos se igualan.' : 'Ese es el otro ángulo del par; piden este.' },
        { id: 'cambio', valor: par.igual ? a1 * ((180 - b1 - b2) / (a1 + a2)) + b1 : a1 * ((b2 - b1) / (a1 - a2)) + b1, error: 'GE17-a', siFuera: par.igual ? 'Sumar 180° vale para conjugados; los alternos externos son iguales.' : 'Igualar vale para alternos; los conjugados externos suman 180°.' },
      ], gr),
      solucion: { texto: `Girar no cambia nada. Son ${par.nombre}: ${par.igual ? 'iguales' : 'suman 180°'}, y x = ${v}.`, ecuacion: junto(`${a1} · ${v} ${b1 < 0 ? '−' : '+'} ${Math.abs(b1)}° = ${m1}°`) },
    };
  }

  const paralelas = {
    id: 'paralelas',
    titulo: 'Paralelas cortadas por una secante',
    pregunta: '¿Qué ángulos son iguales cuando una recta corta dos paralelas?',
    temas: ['Rectas paralelas y una secante'],
    pieza: GO,
    aprendizaje: 'Entre paralelas, los ocho ángulos tienen solo dos medidas: correspondientes y alternos son iguales y los conjugados suman 180°. Sin paralelas, nada de eso vale.',
    actividad: 'Girar la calle que cruza los rieles del tren y comparar los ocho ángulos.',
    lee: {
      tarjetas: [
        { titulo: 'Rieles que no se juntan', texto: 'Los rieles del tren que sale de Juliaca hacia Cusco van siempre a la misma distancia: nunca se cruzan. Dos rectas así, en un mismo plano, son paralelas: L₁ ∥ L₂. En las figuras, las flechas iguales (>) marcan las paralelas.',
          pieza: GO, dibujo: esc({ objeto: 'rieles', theta: 60, calle: false }) },
        { titulo: 'La calle que cruza', texto: 'Una calle recta cruza los dos rieles. Su línea es una secante: corta a las dos paralelas, en P y en Q. En cada cruce se forman cuatro ángulos; en total, ocho.',
          pieza: GO, dibujo: esc({ objeto: 'rieles', theta: 60, letras: true }) },
        { titulo: 'Opuestos por el vértice', texto: 'En un cruce, dos ángulos vecinos forman una recta: suman 180°. Los que quedan frente a frente son opuestos por el vértice: los dos son suplemento del mismo vecino, así que miden igual.',
          pieza: GO, dibujo: esc({ objeto: 'rieles', theta: 60, letras: true, angulos: [{ cruce: 'P', cuad: 'ad', texto: '60°', color: 'h' }, { cruce: 'P', cuad: 'bi', texto: '60°', color: 'h' }, { cruce: 'P', cuad: 'ai', texto: '120°', color: 'i' }, { cruce: 'P', cuad: 'bd', texto: '120°', color: 'i' }] }) },
        // Con dibujo (auditoría, 17 nov: sin él, «alternos internos» no se ubicaba en ninguna figura antes de resolver):
        // dos correspondientes con c y dos alternos internos con a.
        { titulo: 'Los nombres de cada par', texto: 'Correspondientes (c en el dibujo): el mismo lugar en cada cruce. Alternos internos (a): entre los rieles, a distinto lado de la calle. Conjugados internos: entre los rieles, del mismo lado. Afuera están los alternos y los conjugados externos.',
          pieza: GO, dibujo: esc({ objeto: 'rieles', theta: 60, letras: true, angulos: [{ cruce: 'P', cuad: 'ad', texto: 'c', color: 'h' }, { cruce: 'Q', cuad: 'ad', texto: 'c', color: 'h' }, { cruce: 'P', cuad: 'ai', texto: 'a', color: 'i' }, { cruce: 'Q', cuad: 'bd', texto: 'a', color: 'i' }] }) },
      ],
    },
    ejemplos: EJ5,
    juega: {
      pieza: GO,
      consigna: 'Una calle recta cruza los dos rieles del tren. Los rieles son paralelos y la calle se puede girar.',
      mision: {
        texto: 'Gira la calle hasta que, en un cruce, un ángulo mida el doble que su vecino.',
        logrado: v => v.t === 60 || v.t === 120,
        bien: 'Listo: 120° = 2 × 60°. El otro cruce repite las mismas dos medidas.',
      },
      voz: 'Gira la calle y cuenta cuántas medidas distintas ves.',
      leyenda: [
        { s: [L1, ', ', L2], t: 'los rieles: rectas paralelas' },
        { s: 'calle', t: 'la secante que corta los rieles' },
        { s: dH('carmín'), t: 'θ y los ángulos que miden igual' },
        { s: dI('turquesa'), t: 'los que miden 180° − θ' },
      ],
      controles: [{ id: 't', etiqueta: 'θ, la calle con los rieles', min: 40, max: 140, paso: 10, inicio: 70, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: rielesJ(v.t), estado: {} }),
      // Gesto directo: la calle gira alrededor del punto medio entre los dos cruces, que no se mueve.
      arrastres: [{ id: 'calle', etiqueta: 'la calle: gira', color: 'c-h',
        donde: v => PO.aPantalla(rielesJ(v.t), U.polar([0, 1.2], 2.4, v.t)),
        mover: (pt, v) => { const q = PO.aPlano(rielesJ(v.t), pt); return { t: U.grados(Math.atan2(Math.max(q[1] - 1.2, 0.01), q[0])) }; } }],
      lectura: v => ['En los dos cruces: ', dH(`${v.t}°`), ' y ', dI(`${180 - v.t}°`), '; suman 180°'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Más allá, en un desvío, el riel de arriba se abre 8° y deja de ser paralelo al de abajo; la calle no se mueve. ¿Qué pasa con los dos ángulos correspondientes?',
      datos: ['La calle forma 60° con el riel de abajo.', 'El riel de arriba gira 8°.'],
      voz: 'El dibujo cambió poco. Decide con la condición.',
      opciones: [
        { id: 'c', texto: 'Dejan de ser iguales: difieren en 8°', correcta: true },
        { id: 'iguales', texto: 'Siguen iguales: es la misma calle', error: 'GE17-b', siFuera: 'Seguirían iguales con rieles paralelos; al girar uno, su ángulo gira con él.' },
        { id: 'suman', texto: 'Ahora suman 180°', error: 'GE17-a', siFuera: 'Sumar 180° es de los conjugados entre paralelas, no de los correspondientes.' },
        { id: 'doble', texto: 'Difieren en 16°: el giro cuenta dos veces', error: 'GE-PAR1', siFuera: 'El giro sí cambia un ángulo; pero solo el del riel que gira, una vez.' },
      ],
      dibujo: esc({ objeto: 'rieles', theta: 60, giro: 8, letras: true, angulos: [{ cruce: 'P', cuad: 'ad', texto: '60°', color: 'h' }, { cruce: 'Q', cuad: 'ad', texto: '?' }] }),
      revelar: esc({ objeto: 'rieles', theta: 60, giro: 8, letras: true, angulos: [{ cruce: 'P', cuad: 'ad', texto: '60°', color: 'h' }, { cruce: 'Q', cuad: 'ad', texto: '52°' }] }),
      coincide: 'Coincide: 60° abajo y 52° arriba. Sin paralelas, la igualdad se pierde.',
      noCoincide: 'Revisemos: abajo sigue en 60°, arriba quedan 52°. Difieren en 8°.',
    },
    mira: {
      pieza: GO,
      datos: { objeto: 'rieles', theta: 60, letras: true, angulos: [
        { cruce: 'P', cuad: 'ad', texto: '60°', color: 'h' }, { cruce: 'Q', cuad: 'ad', texto: '60°', color: 'h', desde: 1 }, { cruce: 'Q', cuad: 'bi', texto: '60°', color: 'h', desde: 2 },
        { cruce: 'Q', cuad: 'bd', texto: '120°', color: 'i', desde: 3 }, { cruce: 'P', cuad: 'bi', texto: '60°', color: 'h', desde: 4 }, { cruce: 'P', cuad: 'ai', texto: '120°', color: 'i', desde: 4 },
        { cruce: 'P', cuad: 'bd', texto: '120°', color: 'i', desde: 4 }, { cruce: 'Q', cuad: 'ai', texto: '120°', color: 'i', desde: 4 }] },
      voz: 'Cada igualdad se apoya en la anterior. Síguelas en cadena.',
      pasos: [
        { estado: { corte: 0 }, texto: 'En P, la calle forma 60° con el riel de abajo.', ecuacion: junto(['θ = ', dH('60°')]) },
        { estado: { corte: 1 }, texto: 'Correspondientes: en Q, la calle cruza con la misma inclinación.', ecuacion: junto(['correspondientes: ', dH('60°'), ' = ', dH('60°')]) },
        { estado: { corte: 2 }, texto: 'Su opuesto en Q mide 60°: es alterno interno con el de P.', ecuacion: junto(['alternos internos: ', dH('60°'), ' = ', dH('60°')]) },
        { estado: { corte: 3 }, texto: 'Los vecinos de un cruce suman 180°: así salen los conjugados.', ecuacion: junto(['conjugados internos: ', dH('60°'), ' + ', dI('120°'), ' = 180°']) },
        { estado: { corte: 4 }, texto: 'Afuera pasa lo mismo: los ocho tienen solo dos medidas.', ecuacion: junto([dH('60°'), ' y ', dI('120°')]) },
      ],
    },
    regla: {
      texto: 'Si dos rectas paralelas son cortadas por una secante, los correspondientes, los alternos internos y los alternos externos son iguales; los conjugados, internos o externos, suman 180°.',
      ecuacion: [junto([{ llave: [dH('θ')], nota: 'correspondientes y alternos', color: 'c-h' }, ' = ', dH('θ')]), SEP, junto([dH('θ'), ' + ', { llave: [dI('180° − θ')], nota: 'su conjugado', color: 'c-i' }, ' = 180°'])],
      condicion: 'las rectas son paralelas. Al revés también vale: si dos correspondientes son iguales, las rectas son paralelas.',
      voz: 'Primero la condición de paralelas; después las igualdades.',
      // Dibujo propio (4i): los ocho ángulos con las letras de la regla (θ y 180° − θ), no los 60° y 120° de «Mira».
      dibujo: esc({ objeto: 'rieles', theta: 60, letras: true, angulos: ['ad', 'ai', 'bi', 'bd'].flatMap(c => ['P', 'Q'].map(k => ({ cruce: k, cuad: c, texto: c === 'ad' || c === 'bi' ? 'θ' : '180° − θ', color: c === 'ad' || c === 'bi' ? 'h' : 'i' }))) }),
    },
    // Así se resuelve: un par con nombre y dos expresiones. «Ahora tú» no dice el par: hay que reconocerlo en la figura.
    resuelve: {
      pieza: GO,
      generar(s) {
        // Expresiones cortas (|b| ≤ 60°): dos rótulos largos entre las mismas rectas se pisarían.
        const r = azar(s + 900), par = PARES[s % PARES.length];
        let th, m1, m2, v, a1, a2, b1, b2;
        do { th = 5 * r.ent(10, 26); m1 = medidaEn(th, par.p); m2 = medidaEn(th, par.q); v = r.ent(5, 25); a1 = r.ent(2, 5); a2 = r.ent(1, a1 - 1); b1 = m1 - a1 * v; b2 = m2 - a2 * v; }
        while (Math.abs(b1) > 60 || Math.abs(b2) > 60 || !b1 || !b2);
        const ex = (a, b) => `${a === 1 ? '' : a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}°`, e1 = ex(a1, b1), e2 = ex(a2, b2);
        const despeje = par.igual ? `${a1 - a2 === 1 ? '' : a1 - a2}x = ${b2 - b1}` : `${a1 + a2}x = ${180 - b1 - b2}`;
        return {
          enunciado: ['', L1, ' ∥ ', L2, `. Los ángulos ${e1} y ${e2} de la figura son ${par.nombre}. ¿Cuánto vale x?`],
          datos: [par.igual ? D_IGUALES : D_SUMAN],
          dibujo: figPar(th, [mk('P', par.p, th, e1, 'h'), mk('Q', par.q, th, e2, 'h')]),
          pasos: [
            { tipo: 'pide', texto: 'Piden x, el número que hace verdaderas las dos expresiones.' },
            { tipo: 'datos', texto: ['Las rectas son paralelas, y los dos ángulos son ', par.nombre, '.'] },
            { tipo: 'regla', texto: par.igual ? `Entre paralelas, los ${par.nombre} son iguales: igualo las expresiones.` : `Entre paralelas, los ${par.nombre} suman 180°: sumo e igualo a 180°.`,
              ecuacion: junto(par.igual ? `${e1} = ${e2}` : `${e1} + ${e2} = 180°`) },
            { tipo: 'cuentas', texto: 'Junto las x a un lado y los números al otro.', ecuacion: [junto(despeje), '   →   ', junto(['x = ', dF(`${v}`)])] },
            { tipo: 'sentido', texto: `Con x = ${v}: los ángulos miden ${m1}° y ${m2}°. ${par.igual ? 'Son iguales, como deben.' : 'Suman 180°, como deben.'}` },
          ],
          respuesta: ['x = ', dF(`${v}`)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Ubica el par en la figura: ¿iguales o suman 180°?',
      generar(s) { return conCuatro([casoPar, casoEcuacion, casoSonParalelas, casoGirada][s % 4], azar(s + 3)); },
    },
  };

  // ---------- Idea 6 (17 nov): el quiebre entre paralelas ----------
  // Objeto de la primera pantalla: un pasaje que une dos avenidas paralelas y dobla una vez (geo-objeto, pasaje; dibujo
  // de prueba), como en el mapa del celular. Los puntos del pasaje son P, V y Q (antes T, V y B).
  // Cambia: a y b, los ángulos de cada tramo con su avenida. · Permanece: las avenidas paralelas. · Progresa: la paralela
  // auxiliar por V. · Se reserva: la paralela auxiliar (la predicción). · Debe verse: x se parte en a y b, alternos internos.
  // Colores: a, b y sus copias en V en carmín; el quiebre x en tinta (en los ejercicios, lo pedido va en tinta con «x» o
  // «?», y todo ángulo dado en carmín).
  // Errores (hipótesis, sin medir): GE-QB1 cree que la paralela es bisectriz o promedia, GE17-a usa conjugados donde van
  // alternos, GE-QB3 (nuevo) mezcla un alterno con un conjugado, GE-QB4 (nuevo) da el otro tramo, GE-QB5 (nuevo) usa el
  // ángulo de afuera sin pasarlo, GE-QB6 (nuevo) suma todos los ángulos del serrucho, GE-QB7 (nuevo) ignora el quiebre del
  // medio.
  const pasajeJ = (a, b) => ({ objeto: 'pasaje', a, b, angulos: { a: { texto: `${a}°`, color: 'h' }, b: { texto: `${b}°`, color: 'h' }, x: { texto: `x = ${a + b}` } } });
  const D_QUIEBRE = 'Por V se puede trazar una paralela a las dos rectas.';
  const D_ALT = 'Entre paralelas, los alternos internos son iguales.';
  const quiebreFig = (a, b, A, o = {}) => esc(Object.assign({ objeto: 'pasaje', a, b, examen: true, angulos: A }, o));
  // En los resueltos, la paralela por V que la solución dice trazar se ve trazada (auditoría, 17 nov; molde §3: lo que el
  // resuelto dice que hace, se ve hecho). No delata nada: el dato «Por V se puede trazar una paralela» ya la nombra.
  const quiebreEj = (a, b, A, o = {}) => quiebreFig(a, b, A, Object.assign({ aux: 0 }, o));
  // El serrucho: P en L₁, V₁ (abre a la izquierda), V₂ (abre a la derecha), Q en L₂. a, m, b: los ángulos de cada tramo
  // con la horizontal; x = a + m en V₁ e y = m + b en V₂ (cada quiebre, con su paralela auxiliar).
  // aux: las paralelas punteadas por M y por N (las que la solución dice trazar); los rótulos de los quiebres van sobre su
  // bisectriz y la paralela se corta debajo.
  function serruchoFig(a, m, b, textos, aux = false) {
    const P = [0, 3.6], V1 = [P[0] + 1.6 / Math.tan(U.rad(a)), 2.0], V2 = [V1[0] - 1.0 / Math.tan(U.rad(m)), 1.0], Q = [V2[0] + 1.0 / Math.tan(U.rad(b)), 0];
    const xs = [P[0], V1[0], V2[0], Q[0]], cx = (Math.min(...xs) + Math.max(...xs)) / 2, sh = p => [p[0] - cx, p[1]];
    const [p, v1, v2, q] = [P, V1, V2, Q].map(sh);
    const puntos = [{ id: 'P', x: p[0], y: p[1], rotulo: 'P', lado: 120 }, { id: 'V1', x: v1[0], y: v1[1], rotulo: 'M', lado: aux ? 62 : 0 }, { id: 'V2', x: v2[0], y: v2[1], rotulo: 'N', lado: aux ? 118 : 180 }, { id: 'Q', x: q[0], y: q[1], rotulo: 'Q', lado: -60 },
      { id: 'Pd', x: p[0] + 1, y: 3.6, sinPunto: true }, { id: 'Qi', x: q[0] - 1, y: 0, sinPunto: true }, { id: 'Ti', x: -3.2, y: 3.6, sinPunto: true }, { id: 'Td', x: 3.2, y: 3.6, sinPunto: true }, { id: 'Bi', x: -3.2, y: 0, sinPunto: true }, { id: 'Bd', x: 3.2, y: 0, sinPunto: true },
      { id: 'm1', x: v1[0] - 1, y: v1[1], sinPunto: true }, { id: 'm2', x: v1[0] + 1, y: v1[1], sinPunto: true }, { id: 'n1', x: v2[0] - 1, y: v2[1], sinPunto: true }, { id: 'n2', x: v2[0] + 1, y: v2[1], sinPunto: true }];
    const auxs = aux ? [{ de: 'm1', a: 'm2', recta: true, discontinua: true, grosor: 'fino' }, { de: 'n1', a: 'n2', recta: true, discontinua: true, grosor: 'fino' }] : [];
    return { pieza: GO, estado: {}, datos: { objeto: 'angulos', ls: [{ p: [-3.1, 3.9], k: 1 }, { p: [-3.1, 0.3], k: 2 }], figura: {
      alt: 'Una línea quebrada P–M–N–Q entre dos paralelas: dobla en M y en N.', vista: { x: [-3.3, 3.3], y: [-0.8, 4.4] }, alto: 250, puntos,
      segmentos: [{ de: 'Ti', a: 'Td', recta: true, paralela: 1 }, { de: 'Bi', a: 'Bd', recta: true, paralela: 1 }, ...auxs, { de: 'P', a: 'V1', grosor: 'variable' }, { de: 'V1', a: 'V2', grosor: 'variable' }, { de: 'V2', a: 'Q', grosor: 'variable' }],
      angulos: [{ en: 'P', de: 'Pd', a: 'V1', texto: textos.a, color: textos.ca, mide: a, radio: 22, holgura: 6 }, { en: 'V1', de: 'P', a: 'V2', texto: textos.x, color: textos.cx, mide: a + m, radio: 22, holgura: 6, centro: aux },
        { en: 'V2', de: 'V1', a: 'Q', texto: textos.y, color: textos.cy, mide: m + b, radio: 22, holgura: 6, centro: aux }, { en: 'Q', de: 'Qi', a: 'V2', texto: textos.b, color: textos.cb, mide: b, radio: 22, holgura: 6 }] } } };
  }

  // Ejemplos de «El quiebre entre paralelas». Cuentas rehechas aparte (cuentas.js): 35 + 45 = 80; 100 − 60 = 40; 25 + 25
  // = 50 (ronda 2: 35 + 35 = 70); 90 − 35 = 55; 20 + 65 = 85; 2y + 3y = 75 → 15; 180 − 145 = 35 y 35 + 40 = 75; 3b = 40 + b → 20, x = 60; 2k +
  // 3k = 100 → 40 y 60; 180 − 130 = 50, 180 − 150 = 30 → 80; serrucho 30 + 75 = x + 40 → 65; 2y + 50 = 70 + y → 20;
  // 4b = 60 + b → 20 y x = 80; 84 ÷ 2 = 42 (ronda 2: 2y + 6 = 3y − 12 → y = 18, 42 + 42 = 84); 25 + 65 + 40 = x + 50 → 80.
  const EJ6 = [];
  const ej6 = (nivel, titulo, figura, enunciado, datos, solucion, respuesta) => EJ6.push({ nivel, titulo, figura, enunciado, datos, solucion, respuesta });
  const L12 = ['Las rectas ', L1, ' y ', L2, ' son paralelas. '];
  ej6(1, 'El quiebre con a y b', quiebreEj(35, 45, { a: { texto: '35°', color: 'h' }, b: { texto: '45°', color: 'h' }, x: { texto: 'x' } }),
    [...L12, 'La línea PVQ dobla en V; sus tramos forman 35° y 45° con las rectas. ¿Cuánto vale x, el quiebre en V?'], [D_QUIEBRE, D_ALT],
    [{ texto: 'La paralela por V parte x en dos alternos internos: uno copia 35° y el otro, 45°.', ecuacion: junto(['x = 35 + 45 = ', dF('80')]) }], ['x = ', dF('80')]);
  ej6(1, 'Lo que falta del quiebre', quiebreEj(60, 40, { a: { texto: '60°', color: 'h' }, b: { texto: '?' }, x: { texto: '100°', color: 'h' } }),
    [...L12, 'El quiebre en V mide 100° y el tramo de arriba forma 60° con ', L1, '. ¿Qué ángulo forma el tramo de abajo con ', L2, '?'], [D_QUIEBRE, D_ALT],
    [{ texto: 'El quiebre es la suma de los dos: al total le quito 60°.', ecuacion: junto(['100° − 60° = ', dF('40°')]) }], [dF('40°')]);
  // Ronda 2 del lector (18 nov): con 25° y 25° el quiebre era tan cerrado que «x» no cabía fuera de la paralela punteada;
  // y «x junta las dos copias» y «aquí la paralela sí es bisectriz» no se entendían. Ahora 35° y 35° (x = 70, agudo).
  ej6(1, 'Un quiebre simétrico', quiebreEj(35, 35, { a: { texto: '35°', color: 'h' }, b: { texto: '35°', color: 'h' }, x: { texto: 'x' } }),
    [...L12, 'Los dos tramos de PVQ forman 35° con su recta. ¿Cuánto vale x y qué clase de ángulo es el quiebre?'], [D_QUIEBRE, D_ALT, 'Agudo: menos de 90°.'],
    [{ texto: 'La paralela por V parte x en dos alternos internos: cada uno copia los 35° de su tramo.', ecuacion: junto(['x = 35 + 35 = ', dF('70')]) }, { texto: 'El quiebre mide 70°, menos de 90°: agudo.' }], ['x = ', dF('70'), '; el quiebre es agudo']);
  ej6(1, 'Un quiebre recto', quiebreEj(55, 35, { a: { texto: '?' }, b: { texto: '35°', color: 'h' }, x: { texto: '90°', color: 'h' } }),
    [...L12, 'La línea PVQ dobla en ángulo recto en V. El tramo de abajo forma 35° con ', L2, '. ¿Qué ángulo forma el de arriba con ', L1, '?'], [D_QUIEBRE, D_ALT],
    [{ texto: 'El quiebre de 90° es la suma de los dos ángulos de los tramos:', ecuacion: junto(['90° − 35° = ', dF('55°')]) }], [dF('55°')]);
  ej6(1, 'Pasaje entre avenidas', esc({ objeto: 'pasaje', a: 20, b: 65, aux: 0, angulos: { a: { texto: '20°', color: 'h' }, b: { texto: '65°', color: 'h' }, x: { texto: 'x' } } }),
    'Un pasaje une dos avenidas paralelas y dobla en V. Sale de una formando 20° con ella y llega a la otra formando 65°. ¿Cuánto mide el quiebre?', [D_QUIEBRE, D_ALT],
    [{ texto: 'El quiebre suma los dos ángulos de los tramos:', ecuacion: junto(['20° + 65° = ', dF('85°')]) }], ['El quiebre mide ', dF('85°')]);
  ej6(2, 'Con una letra', quiebreEj(30, 45, { a: { texto: '2y', color: 'h' }, b: { texto: '3y', color: 'h' }, x: { texto: '75°', color: 'h' } }),
    [...L12, 'Los tramos de PVQ forman 2y y 3y con las rectas, y el quiebre mide 75°. ¿Cuánto vale y?'], [D_QUIEBRE, D_ALT],
    [{ texto: 'El quiebre es la suma:', ecuacion: [junto('2y + 3y = 75'), '   →   ', junto('5y = 75'), '   →   ', junto(['y = ', dF('15')])] }], ['y = ', dF('15')]);
  ej6(2, 'El ángulo de afuera', quiebreEj(35, 40, { afP: { texto: '145°', color: 'h' }, b: { texto: '40°', color: 'h' }, x: { texto: 'x' } }),
    [...L12, 'Arriba, el tramo PV forma 145° con ', L1, ', medido del otro lado. Abajo, VQ forma 40° con ', L2, '. ¿Cuánto vale x?'], [D_QUIEBRE, D_ALT, 'En P, los dos ángulos vecinos suman 180°.'],
    [{ texto: 'Primero el ángulo del lado de V:', ecuacion: junto('180° − 145° = 35°') }, { texto: 'Ahora sí, la suma:', ecuacion: junto(['x = 35 + 40 = ', dF('75')]) }], ['x = ', dF('75')]);
  ej6(2, 'El triple de b', quiebreEj(40, 20, { a: { texto: '40°', color: 'h' }, b: { texto: 'b', color: 'h' }, x: { texto: '3b', color: 'h' } }),
    [...L12, 'El tramo de arriba forma 40° con ', L1, ', el de abajo forma b con ', L2, ', y el quiebre mide 3b. ¿Cuánto mide el quiebre?'], [D_QUIEBRE, D_ALT],
    [{ texto: 'La paralela por V parte el quiebre en dos alternos internos, 40° y b: el quiebre es su suma.', ecuacion: [junto('3b = 40° + b'), '   →   ', junto('2b = 40'), '   →   ', junto('b = 20')] }, { texto: 'Piden el quiebre:', ecuacion: junto(['3 · 20 = ', dF('60°')]) }], ['El quiebre mide ', dF('60°')]);
  ej6(2, 'En razón 2 : 3', quiebreEj(40, 60, { a: { texto: '2k', color: 'h' }, b: { texto: '3k', color: 'h' }, x: { texto: '100°', color: 'h' } }),
    [...L12, 'El quiebre mide 100°, y los ángulos de los tramos con las rectas están en razón 2 : 3. ¿Cuánto mide cada uno?'], [D_QUIEBRE, D_ALT, 'Razón 2 : 3: miden 2k y 3k.'],
    [{ texto: 'Los dos suman el quiebre:', ecuacion: [junto('2k + 3k = 100'), '   →   ', junto('k = 20')] }, { texto: 'Entonces:', ecuacion: [junto(['2 · 20 = ', dF('40°')]), SEP, junto(['3 · 20 = ', dF('60°')])] }], [dF('40°'), ' y ', dF('60°')]);
  ej6(2, 'Los dos de afuera', quiebreEj(50, 30, { afP: { texto: '130°', color: 'h' }, afQ: { texto: '150°', color: 'h' }, x: { texto: 'x' } }),
    [...L12, 'Los tramos de PVQ forman 130° con ', L1, ' y 150° con ', L2, ', medidos del lado contrario a V. ¿Cuánto vale x?'], [D_QUIEBRE, D_ALT, 'En P y en Q, los dos ángulos vecinos suman 180°.'],
    [{ texto: 'Paso cada uno al lado de V:', ecuacion: [junto('180° − 130° = 50°'), SEP, junto('180° − 150° = 30°')] }, { texto: 'Sumo:', ecuacion: junto(['x = 50 + 30 = ', dF('80')]) },
      { texto: 'Sumar 130° + 150° daría 280°: el error típico de no pasar al lado de V.' }], ['x = ', dF('80')]);
  ej6(3, 'El serrucho', serruchoFig(30, 35, 40, { a: '30°', ca: 'h', x: '?', y: '75°', cy: 'h', b: '40°', cb: 'h' }, true),
    [...L12, 'La línea P–M–N–Q dobla dos veces. En P forma 30° con ', L1, ', en Q forma 40° con ', L2, ' y en N dobla 75°. ¿Cuánto mide el quiebre en M?'],
    ['Por M y por N se pueden trazar paralelas a las rectas.', 'Cada quiebre mide la suma de los ángulos de sus tramos con una paralela.'],
    [{ texto: 'Llamo m al ángulo del tramo MN con la horizontal. El quiebre en N:', ecuacion: [junto('75° = m + 40°'), '   →   ', junto('m = 35')] },
      { texto: 'El quiebre en M:', ecuacion: junto(['30° + 35° = ', dF('65°')]) },
      { texto: 'Los que abren a un lado suman lo que los del otro: 30° + 75° = 65° + 40°.' }], ['El quiebre en M mide ', dF('65°')]);
  ej6(3, 'Serrucho con letras', serruchoFig(50, 20, 50, { a: '2y + 10°', ca: 'h', x: '70°', cx: 'h', y: 'y + 50°', cy: 'h', b: '50°', cb: 'h' }, true),
    [...L12, 'La línea P–M–N–Q dobla dos veces. En P forma 2y + 10° con ', L1, ', en Q forma 50°, en M dobla 70° y en N, y + 50°. ¿Cuánto vale y?'],
    ['Por M y por N se pueden trazar paralelas a las rectas.', 'Cada quiebre mide la suma de los ángulos de sus tramos con una paralela.'],
    [{ texto: 'Con las paralelas por M y N, lo que abre a la derecha suma lo que abre a la izquierda:', ecuacion: junto('(2y + 10°) + (y + 50°) = 70° + 50°') },
      { texto: 'Despejo:', ecuacion: [junto('3y + 60° = 120°'), '   →   ', junto(['y = ', dF('20')])] }], ['y = ', dF('20')]);
  ej6(3, 'El quiebre es el cuádruple', quiebreEj(60, 20, { a: { texto: '60°', color: 'h' }, b: { texto: '?' }, x: { texto: '4b', color: 'h' } }),
    [...L12, 'El tramo de arriba forma 60° con ', L1, ' y el quiebre mide el cuádruple del ángulo b del tramo de abajo. ¿Cuánto vale b?'], [D_QUIEBRE, D_ALT],
    [{ texto: 'El quiebre suma 60° y b:', ecuacion: [junto('4b = 60° + b'), '   →   ', junto('3b = 60'), '   →   ', junto(['b = ', dF('20')])] }, { texto: 'Compruebo: el quiebre mide 60° + 20° = 80°, y 4b = 4 · 20 = 80.' }], ['b = ', dF('20')]);
  // Ronda 2 del lector (18 nov): antes era 84° ÷ 2, un solo paso, más fácil que el 8 (nivel 2). Ahora la bisectriz da la
  // ecuación, se despeja y después se junta: 2y + 6 = 3y − 12 → y = 18; cada parte 42°; el quiebre 84°.
  // (En la figura van a y b: «2y + 6°» no cabe junto a un ángulo de 42° sin irse hasta V.)
  ej6(3, 'La paralela como bisectriz', quiebreEj(42, 42, { a: { texto: 'a', color: 'h' }, b: { texto: 'b', color: 'h' }, x: { texto: '?' } }),
    [...L12, 'La paralela por V es la bisectriz del quiebre. Los tramos forman 2y + 6° con ', L1, ' (el ángulo a) y 3y − 12° con ', L2, ' (el ángulo b). ¿Cuánto mide el quiebre?'], [D_ALT, 'La bisectriz parte un ángulo en dos ángulos iguales.'],
    [{ texto: 'La paralela por V parte el quiebre en dos alternos internos: uno copia a y el otro, b. Como es bisectriz, miden igual:', ecuacion: [junto('2y + 6° = 3y − 12°'), '   →   ', junto('y = 18')] },
      { texto: 'Cada parte mide 2 · 18 + 6° = 42°, y el quiebre junta las dos:', ecuacion: junto(['42° + 42° = ', dF('84°')]) }], ['El quiebre mide ', dF('84°')]);
  ej6(3, 'Tres quiebres', (() => {
    // P, M, N, R, Q: a = 25 (en P), M abre a la izquierda, N a la derecha, R a la izquierda, b = 40 (en Q).
    const a = 25, m1 = 40, m2 = 25, b = 40, P = [0, 3.4], M1 = [P[0] + 0.9 / Math.tan(U.rad(a)), 2.5], N1 = [M1[0] - 0.8 / Math.tan(U.rad(m1)), 1.7], R1 = [N1[0] + 0.8 / Math.tan(U.rad(m2)), 0.9], Q = [R1[0] - 0.9 / Math.tan(U.rad(b)), 0];
    const xs = [P, M1, N1, R1, Q].map(p => p[0]), cx = (Math.min(...xs) + Math.max(...xs)) / 2, sh = p => [p[0] - cx, p[1]];
    const pt2 = (id, p, rot, lado) => ({ id, x: sh(p)[0], y: sh(p)[1], rotulo: rot, lado });
    return { pieza: GO, estado: {}, datos: { objeto: 'angulos', ls: [{ p: [-3.1, 3.7], k: 1 }, { p: [-3.1, 0.3], k: 2 }], figura: {
      alt: 'Una línea quebrada P–M–N–R–Q entre dos paralelas: dobla en M, en N y en R.', vista: { x: [-3.3, 3.3], y: [-0.8, 4.2] }, alto: 250,
      puntos: [pt2('P', P, 'P', 120), pt2('M', M1, 'M', 62), pt2('N', N1, 'N', 242), pt2('R', R1, 'R', 62), pt2('Q', Q, 'Q', -120),
        { id: 'Pd', x: sh(P)[0] + 1, y: 3.4, sinPunto: true }, { id: 'Qd', x: sh(Q)[0] + 1, y: 0, sinPunto: true },
        { id: 'Ti', x: -3.2, y: 3.4, sinPunto: true }, { id: 'Td', x: 3.2, y: 3.4, sinPunto: true }, { id: 'Bi', x: -3.2, y: 0, sinPunto: true }, { id: 'Bd', x: 3.2, y: 0, sinPunto: true },
        ...[['M', M1], ['N', N1], ['R', R1]].flatMap(([k, q]) => [{ id: `${k}1`, x: sh(q)[0] - 1, y: q[1], sinPunto: true }, { id: `${k}2`, x: sh(q)[0] + 1, y: q[1], sinPunto: true }])],
      segmentos: [{ de: 'Ti', a: 'Td', recta: true, paralela: 1 }, { de: 'Bi', a: 'Bd', recta: true, paralela: 1 },
        ...['M', 'N', 'R'].map(k => ({ de: `${k}1`, a: `${k}2`, recta: true, discontinua: true, grosor: 'fino' })),
        { de: 'P', a: 'M', grosor: 'variable' }, { de: 'M', a: 'N', grosor: 'variable' }, { de: 'N', a: 'R', grosor: 'variable' }, { de: 'R', a: 'Q', grosor: 'variable' }],
      angulos: [{ en: 'P', de: 'Pd', a: 'M', texto: '25°', color: 'h', mide: a, radio: 22, holgura: 6 }, { en: 'M', de: 'P', a: 'N', texto: '65°', color: 'h', mide: a + m1, radio: 22, holgura: 6, centro: true },
        { en: 'N', de: 'M', a: 'R', texto: 'x', mide: m1 + m2, radio: 22, holgura: 6, centro: true }, { en: 'R', de: 'N', a: 'Q', texto: '65°', color: 'h', mide: m2 + b, radio: 22, holgura: 6, centro: true },
        { en: 'Q', de: 'Qd', a: 'R', texto: '40°', color: 'h', mide: b, radio: 22, holgura: 6 }] } } };
  })(),
    [...L12, 'La línea P–M–N–R–Q dobla en M, N y R. Forma 25° con ', L1, ' y 40° con ', L2, '; M y R doblan 65° cada uno. ¿Cuánto vale x, en N?'],
    ['Por cada quiebre se puede trazar una paralela a las rectas.', 'Cada quiebre mide la suma de los ángulos de sus tramos con una paralela.'],
    [{ texto: 'Con las paralelas por M, N y R, lo que abre a la derecha suma lo que abre a la izquierda.', ecuacion: junto('25° + x + 40° = 65° + 65°') },
      { texto: 'Despejo:', ecuacion: [junto('x + 65° = 130°'), '   →   ', junto(['x = ', dF('65')])] }], ['x = ', dF('65')]);

  // «Ahora tú» de la idea 6. Tipo 0: el quiebre con a y b.
  function casoQuiebre(r) {
    const a = 5 * r.ent(4, 13), b = 5 * r.ent(4, 13), x = a + b;
    return {
      pregunta: ['', L1, ' ∥ ', L2, `. Los tramos de PVQ forman ${a}° y ${b}° con las rectas. ¿Cuánto vale x, el quiebre en V?`],
      datos: [D_QUIEBRE, D_ALT],
      dibujo: quiebreFig(a, b, { a: { texto: `${a}°`, color: 'h' }, b: { texto: `${b}°`, color: 'h' }, x: { texto: 'x' } }),
      opciones: opciones(x, [
        { id: 'supl', valor: 180 - x, error: 'GE17-a', siFuera: 'Restar de 180° vale para conjugados; con la paralela por V, cada par es alterno.' },
        { id: 'mitad', valor: x / 2, error: 'GE-QB1', siFuera: 'Partir en mitades serviría si la paralela fuera bisectriz; x es la suma entera.' },
        { id: 'resta', valor: Math.abs(a - b), error: 'GE-QB3', siFuera: 'Comparar los dos tramos no basta: la paralela por V los junta, no los resta.' },
      ], NUM),
      solucion: { texto: `La paralela por V parte el quiebre en dos: ${a}° y ${b}°.`, ecuacion: junto(`x = ${a} + ${b} = ${x}`),
        dibujo: quiebreFig(a, b, { a: { texto: `${a}°`, color: 'h' }, b: { texto: `${b}°`, color: 'h' }, a2: { texto: `${a}°`, color: 'h' }, b2: { texto: `${b}°`, color: 'h' }, x: { texto: 'x' } }, { aux: 0 }) },
    };
  }
  // Tipo 1: un tramo es m veces el otro y se conoce el quiebre.
  function casoQuiebreVeces(r) {
    const m = r.de([2, 3]), b = 5 * r.ent(4, Math.floor(70 / m / 5)), a = m * b, x = a + b;
    return {
      pregunta: ['', L1, ' ∥ ', L2, `. El quiebre en V mide ${x}°, y el ángulo a del tramo de arriba es ${m} veces el ángulo b del de abajo. ¿Cuánto vale a?`],
      datos: [D_QUIEBRE, D_ALT],
      dibujo: quiebreFig(a, b, { a: { texto: '?' }, b: { texto: 'b', color: 'h' }, x: { texto: `${x}°`, color: 'h' } }),
      opciones: opciones(a, [
        { id: 'b', valor: b, error: 'GE-QB4', siFuera: `Hallar b = ${b} está bien; falta multiplicar por ${m} para tener a.` },
        { id: 'mitad', valor: x / 2, error: 'GE-QB1', siFuera: 'Partir el quiebre en mitades serviría si a y b midieran igual.' },
        { id: 'reparte', valor: x / m, error: 'GE-QB4', siFuera: `Repartir ${x}° va bien, pero entre ${m + 1} partes, no entre ${m}.` },
      ], NUM),
      solucion: { texto: `a + b = ${x} y a = ${m}b: ${m + 1}b = ${x}, b = ${b}.`, ecuacion: junto(`a = ${m} · ${b} = ${a}`),
        dibujo: quiebreFig(a, b, { a: { texto: '?' }, b: { texto: 'b', color: 'h' }, x: { texto: `${x}°`, color: 'h' } }, { aux: 0 }) },
    };
  }
  // Tipo 2: el ángulo de arriba, medido del otro lado.
  function casoAfuera6(r) {
    const a = 5 * r.ent(4, 13), b = 5 * r.ent(4, 13), af = 180 - a, x = a + b;
    return {
      pregunta: ['', L1, ' ∥ ', L2, `. Arriba, el tramo PV forma ${af}° con `, L1, `, medido del otro lado; abajo, VQ forma ${b}° con `, L2, '. ¿Cuánto vale x, el quiebre en V?'],
      datos: [D_QUIEBRE, D_ALT, 'En P, los dos ángulos vecinos suman 180°.'],
      dibujo: quiebreFig(a, b, { afP: { texto: `${af}°`, color: 'h' }, b: { texto: `${b}°`, color: 'h' }, x: { texto: 'x' } }),
      opciones: opciones(x, [
        { id: 'directo', valor: af + b, error: 'GE-QB5', siFuera: 'Sumar los ángulos de los tramos es la idea; pero primero se pasa el de arriba al lado de V.' },
        { id: 'supl', valor: 180 - x, error: 'GE17-a', siFuera: 'Restar de 180° vale para conjugados; con la paralela por V, cada par es alterno.' },
        { id: 'a', valor: a, error: 'GE-QB4', siFuera: `Pasar ${af}° al lado de V va bien: da ${a}°. Falta sumarle el de abajo.` },
      ], NUM),
      solucion: { texto: `Del lado de V, el tramo de arriba forma 180° − ${af}° = ${a}°.`, ecuacion: junto(`x = ${a} + ${b} = ${x}`),
        // La solución, ya pasado al lado de V, con la paralela por V.
        dibujo: quiebreFig(a, b, { a: { texto: `${a}°`, color: 'h' }, b: { texto: `${b}°`, color: 'h' }, x: { texto: 'x' } }, { aux: 0 }) },
    };
  }
  // Tipo 3 (examen): el serrucho con dos quiebres; se pide el quiebre en M.
  function casoSerrucho(r) {
    const a = 5 * r.ent(5, 11), m = 5 * r.ent(5, 9), b = 5 * r.ent(5, 11), x = a + m, y = m + b;
    return {
      pregunta: ['', L1, ' ∥ ', L2, `. La línea P–M–N–Q dobla dos veces. En P forma ${a}° con `, L1, `, en Q forma ${b}° con `, L2, ` y en N dobla ${y}°. ¿Cuánto mide el quiebre en M?`],
      datos: ['Por M y por N se pueden trazar paralelas a las rectas.', 'Cada quiebre mide la suma de los ángulos de sus tramos con una paralela.'],
      dibujo: serruchoFig(a, m, b, { a: `${a}°`, ca: 'h', x: '?', y: `${y}°`, cy: 'h', b: `${b}°`, cb: 'h' }),
      opciones: opciones(x, [
        { id: 'todo', valor: a + y + b, error: 'GE-QB6', siFuera: 'Juntar ángulos es la idea; pero los de un lado se igualan con los del otro, no se suman todos.' },
        { id: 'sin-medio', valor: a + b, error: 'GE-QB7', siFuera: `Con un solo quiebre sería ${a}° + ${b}°; aquí el tramo del medio también cuenta.` },
        { id: 'resta', valor: Math.abs(y - b), error: 'GE-QB4', siFuera: `${Math.abs(y - b)}° es el ángulo del tramo del medio; falta sumarle ${a}°.` },
      ], gr),
      solucion: { texto: `En N: ${y}° = m + ${b}°, así que m = ${m}: el tramo del medio forma ${m}°.`, ecuacion: junto(`quiebre en M: ${a}° + ${m}° = ${x}°`),
        dibujo: serruchoFig(a, m, b, { a: `${a}°`, ca: 'h', x: '?', y: `${y}°`, cy: 'h', b: `${b}°`, cb: 'h' }, true) },
    };
  }

  const quiebreIdea = {
    id: 'quiebre',
    titulo: 'El quiebre entre paralelas',
    pregunta: '¿Cuánto mide el ángulo donde una línea dobla entre dos paralelas?',
    temas: ['Rectas paralelas y una secante'],
    pieza: GO,
    aprendizaje: 'Si una línea se quiebra entre dos paralelas, el quiebre mide la suma de los ángulos de cada tramo con su paralela.',
    actividad: 'Mover las puntas del pasaje por las avenidas y comparar el quiebre con a y b.',
    lee: {
      tarjetas: [
        { titulo: 'Un pasaje que dobla', texto: 'En el mapa del celular, un pasaje une dos avenidas paralelas. Sale de P en una avenida, dobla en V y llega a Q en la otra. V es el vértice donde dobla.',
          pieza: GO, dibujo: esc({ objeto: 'pasaje', a: 40, b: 30 }) },
        { titulo: 'Los ángulos de cada tramo', texto: 'El tramo PV forma un ángulo a con su avenida, del lado donde está V; el tramo VQ forma un ángulo b con la otra. El ángulo en V es el quiebre, x.',
          pieza: GO, dibujo: esc({ objeto: 'pasaje', a: 40, b: 30, angulos: { a: { texto: 'a', color: 'h' }, b: { texto: 'b', color: 'h' }, x: { texto: 'x' } } }) },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve P y Q por sus avenidas. Mira cuánto mide x en cada caso y busca qué cuenta con a y b da ese número.' },
      ],
    },
    ejemplos: EJ6,
    juega: {
      pieza: GO,
      consigna: 'Un pasaje une dos avenidas paralelas y dobla una vez, en V. Sus puntas P y Q corren por las avenidas.',
      mision: {
        texto: 'Haz que el pasaje doble en ángulo recto sin que a y b sean iguales.',
        logrado: v => v.a + v.b === 90 && v.a !== v.b,
        bien: 'Listo: x = a + b = 90, aunque a y b no sean iguales.',
      },
      voz: 'Cambia a y b por separado. Mira cómo responde x.',
      leyenda: [
        { s: [L1, ', ', L2], t: 'las avenidas: rectas paralelas' },
        { s: 'P, V, Q', t: 'el pasaje; dobla en V' },
        { s: dH('a, b'), t: 'cada tramo con su avenida' },
        { s: 'x', t: 'el quiebre en V' },
      ],
      controles: [
        { id: 'a', etiqueta: 'a, el tramo de arriba', min: 30, max: 70, paso: 5, inicio: 40, unidad: '°', decimales: 0, color: 'c-h' },
        { id: 'b', etiqueta: 'b, el tramo de abajo', min: 30, max: 70, paso: 5, inicio: 30, unidad: '°', decimales: 0, color: 'c-h' },
      ],
      dibujo: v => ({ datos: pasajeJ(v.a, v.b), estado: {} }),
      // Gesto directo: P y Q corren por su avenida; V no se mueve.
      arrastres: [
        { id: 'punta-p', etiqueta: 'punta P, en la avenida de arriba', color: 'c-h',
          donde: v => PO.aPantalla(pasajeJ(v.a, v.b), [2.9 - 1.5 / Math.tan(U.rad(v.a)), 3]),
          mover: (pt, v) => ({ a: U.grados(Math.atan2(1.5, Math.max(0.05, 2.9 - PO.aPlano(pasajeJ(v.a, v.b), pt)[0]))) }) },
        { id: 'punta-q', etiqueta: 'punta Q, en la avenida de abajo', color: 'c-h',
          donde: v => PO.aPantalla(pasajeJ(v.a, v.b), [2.9 - 1.5 / Math.tan(U.rad(v.b)), 0]),
          mover: (pt, v) => ({ b: U.grados(Math.atan2(1.5, Math.max(0.05, 2.9 - PO.aPlano(pasajeJ(v.a, v.b), pt)[0]))) }) },
      ],
      lectura: v => [`x = ${v.a + v.b} y `, dH('a'), ' + ', dH('b'), ` = ${v.a} + ${v.b}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Para explicar el quiebre, se traza por V una tercera calle paralela a las avenidas. ¿En qué dos ángulos queda partido x?',
      datos: ['a = 40', 'b = 30', 'Las tres calles son paralelas.'],
      voz: 'Piensa en la calle nueva antes de verla.',
      opciones: [
        { id: 'c', texto: 'Uno igual a a y otro igual a b', correcta: true },
        { id: 'mitades', texto: 'En dos mitades iguales', error: 'GE-QB1', siFuera: 'Mitades iguales sería cierto si a y b midieran lo mismo; la paralela copia cada uno.' },
        { id: 'supl', texto: 'En 180° − a y 180° − b', error: 'GE17-a', siFuera: 'Esos serían los conjugados; con la paralela por V, cada par es alterno interno.' },
        { id: 'mezcla', texto: 'En a y 180° − b', error: 'GE-QB3', siFuera: 'Arriba va bien, la copia de a; abajo también es un alterno, no un conjugado.' },
      ],
      dibujo: esc({ objeto: 'pasaje', a: 40, b: 30, aux: 0, angulos: { a: { texto: '40°', color: 'h' }, b: { texto: '30°', color: 'h' }, x: { texto: 'x' } } }),
      revelar: esc({ objeto: 'pasaje', a: 40, b: 30, aux: 0, angulos: { a: { texto: '40°', color: 'h' }, b: { texto: '30°', color: 'h' }, a2: { texto: '40°', color: 'h' }, b2: { texto: '30°', color: 'h' }, x: { texto: 'x' } } }),
      coincide: 'Coincide: la paralela por V copia 40° arriba y 30° abajo.',
      noCoincide: 'Revisemos: arriba queda la copia de a, 40°; abajo, la de b, 30°.',
    },
    mira: {
      pieza: GO,
      datos: { objeto: 'pasaje', a: 40, b: 30, aux: 1, angulos: { a: { texto: '40°', color: 'h' }, b: { texto: '30°', color: 'h' }, a2: { texto: '40°', color: 'h', desde: 2 }, b2: { texto: '30°', color: 'h', desde: 3 }, x: { texto: 'x = 70', desde: 4 } } },
      voz: 'Sigue la paralela auxiliar: ella hace el trabajo.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Los tramos forman 40° y 30° con sus avenidas.', ecuacion: [junto([dH('a'), ' = 40']), ' y ', junto([dH('b'), ' = 30'])] },
        { estado: { corte: 1 }, texto: 'Por V trazamos una paralela a las dos avenidas.', ecuacion: junto(['tres paralelas']) },
        { estado: { corte: 2 }, texto: 'Con la avenida de arriba, PV forma alternos internos: copia a.', ecuacion: junto([dH('a'), ' = 40']) },
        { estado: { corte: 3 }, texto: 'Con la de abajo, VQ forma alternos internos: copia b.', ecuacion: junto([dH('b'), ' = 30']) },
        { estado: { corte: 4 }, texto: 'El quiebre x reúne las dos partes.', ecuacion: junto(['x = ', dH('a'), ' + ', dH('b'), ' = 70']) },
      ],
    },
    regla: {
      // (Ronda 2 del lector, 18 nov: «los de un lado suman igual que los del otro» no tenía dibujo y no se sabía qué lados.
      // Con varios quiebres basta la misma regla en cada vértice, como lo resuelven los ejemplos del serrucho.)
      texto: 'Entre paralelas, el quiebre de una línea suma los ángulos de sus tramos con una paralela. Con varios quiebres, una paralela por vértice y la misma suma.',
      ecuacion: [junto([{ llave: ['x'], nota: 'quiebre' }, ' = ', { llave: [dH('a')], nota: 'arriba', color: 'c-h' }, ' + ', { llave: [dH('b')], nota: 'abajo', color: 'c-h' }])],
      condicion: 'las rectas son paralelas, y a y b se miden del lado donde está el vértice del quiebre.',
      voz: 'Una paralela auxiliar convierte el quiebre en dos alternos.',
      // Dibujo propio (4i): el pasaje con la paralela por V y las letras de la regla (a, b y x), no los 40° y 30° de «Mira».
      // Sin las copias de a y b en V: con ellas, geo-objeto deja a x sin rótulo.
      dibujo: esc({ objeto: 'pasaje', a: 40, b: 30, aux: 0, angulos: { a: { texto: 'a', color: 'h' }, b: { texto: 'b', color: 'h' }, x: { texto: 'x' } } }),
    },
    // Así se resuelve: se conoce el quiebre y un tramo; se pide el otro. «Ahora tú» pide el quiebre, un tramo que es
    // varias veces el otro, el ángulo de afuera y el serrucho.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900), a = 5 * r.ent(4, 13), b = 5 * r.ent(4, 13), x = a + b;
        return {
          enunciado: ['', L1, ' ∥ ', L2, `. El quiebre en V mide ${x}° y el tramo de arriba forma ${a}° con `, L1, '. ¿Cuánto vale b, el ángulo del tramo de abajo con ', L2, '?'],
          datos: [D_QUIEBRE, D_ALT],
          dibujo: quiebreFig(a, b, { a: { texto: `${a}°`, color: 'h' }, b: { texto: 'b' }, x: { texto: `${x}°`, color: 'h' } }),
          pasos: [
            { tipo: 'pide', texto: 'Piden b, el ángulo del tramo de abajo con su recta.' },
            { tipo: 'datos', texto: `Las rectas son paralelas; arriba, a = ${a}, y el quiebre completo mide ${x}°.` },
            { tipo: 'regla', texto: 'Por V trazo una paralela: parte el quiebre en dos alternos internos, uno copia a y el otro copia b.', ecuacion: junto('x = a + b'),
              dibujo: quiebreFig(a, b, { a: { texto: `${a}°`, color: 'h' }, b: { texto: 'b' }, a2: { texto: `${a}°`, color: 'h' }, b2: { texto: 'b' }, x: { texto: `${x}°`, color: 'h' } }, { aux: 0 }) },
            { tipo: 'cuentas', texto: 'Como el quiebre es la suma, b es lo que queda al quitarle a.', ecuacion: junto(['b = ', `${x} − ${a} = `, dF(`${b}`)]) },
            { tipo: 'sentido', texto: `Compruebo: ${a}° + ${b}° = ${x}°, el quiebre completo.` },
          ],
          respuesta: ['b = ', dF(`${b}`)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Ubica a, b y el quiebre antes de operar.',
      generar(s) { return conCuatro([casoQuiebre, casoQuiebreVeces, casoAfuera6, casoSerrucho][s % 4], azar(s + 21)); },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 5: además de inclinar la calle, se gira el riel de arriba. Deja probar lo que la idea
  // reserva para la predicción: qué pasa con los correspondientes y los conjugados cuando los rieles no son paralelos.
  // Colores: el ángulo de abajo (θ) en carmín; el de arriba, en carmín solo si mide lo mismo; el conjugado, turquesa.
  const medidasSecante = (t, giro = 0) => ({ abajo: t, arriba: t - giro, conjugado: 180 - t + giro });
  const rielesMesa = v => { const m = medidasSecante(v.t, v.g); return { objeto: 'rieles', theta: v.t, giro: v.g, angulos: [
    { cruce: 'P', cuad: 'ad', texto: `${m.abajo}°`, color: 'h' }, { cruce: 'Q', cuad: 'ad', texto: `${m.arriba}°`, color: m.arriba === m.abajo ? 'h' : undefined },
    { cruce: 'Q', cuad: 'bd', texto: `${m.conjugado}°`, color: 'i' }] }; };
  const mesaSecante = {
    id: 'secante-y-giro', titulo: 'Paralelas o casi paralelas', pieza: GO,
    consigna: 'Inclina la calle y gira el riel de arriba. Busca cuándo los dos correspondientes vuelven a ser iguales.',
    controles: [
      { id: 't', etiqueta: 'θ, la calle con el riel de abajo', min: 40, max: 140, paso: 5, inicio: 60, unidad: '°', decimales: 0, color: 'c-h' },
      { id: 'g', etiqueta: 'Giro del riel de arriba', min: -20, max: 20, paso: 2, inicio: 10, unidad: '°', decimales: 0 },
    ],
    dibujo: v => ({ datos: rielesMesa(v), estado: {} }),
    arrastres: [
      { id: 'calle', etiqueta: 'la calle: gira', color: 'c-h',
        donde: v => PO.aPantalla(rielesMesa(v), U.polar([0, 1.2], 2.4, v.t)),
        mover: (pt, v) => { const q = PO.aPlano(rielesMesa(v), pt); return { t: U.grados(Math.atan2(Math.max(q[1] - 1.2, 0.01), q[0])) }; } },
      { id: 'riel-arriba', etiqueta: 'extremo del riel de arriba',
        donde: v => { const Q = [1.2 / Math.tan(U.rad(v.t)), 2.4]; return PO.aPantalla(rielesMesa(v), U.polar(Q, 1.6, v.g)); },
        mover: (pt, v) => {
          const Q = [1.2 / Math.tan(U.rad(v.t)), 2.4], q = PO.aPlano(rielesMesa(v), pt);
          return { g: U.grados(Math.atan(Math.max(-1e3, Math.min(1e3, (q[1] - Q[1]) / Math.max(q[0] - Q[0], 0.05))))) };
        } },
    ],
    lectura: v => { const m = medidasSecante(v.t, v.g); return [`correspondientes ${m.abajo}° y ${m.arriba}°; conjugados, ${m.abajo + m.conjugado}°${v.g === 0 ? ': paralelos' : ''}`]; },
    // Retos comprobados con las medidas que rotula la figura (medidasSecante).
    invitaciones: [
      { texto: 'Haz que los dos correspondientes vuelvan a ser iguales.',
        logrado: v => { const m = medidasSecante(v.t, v.g); return m.abajo === m.arriba; },
        bien: 'Iguales solo con giro cero: correspondientes iguales garantizan rieles paralelos.' },
      { texto: 'Consigue que los dos correspondientes difieran lo más posible.',
        logrado: v => { const m = medidasSecante(v.t, v.g); return Math.abs(m.abajo - m.arriba) === Math.max(-mesaSecante.controles[1].min, mesaSecante.controles[1].max); },
        bien: 'La diferencia es el giro del riel de arriba, no la calle.' },
      { texto: 'Haz que la calle forme un ángulo recto con el riel de abajo.',
        logrado: v => medidasSecante(v.t, v.g).abajo === 90,
        bien: 'Calle perpendicular. ¿Lo es también al riel de arriba? Mira el giro.' },
      { texto: 'Haz que los conjugados internos sumen 170°.',
        logrado: v => { const m = medidasSecante(v.t, v.g); return m.abajo + m.conjugado === 170; },
        bien: 'Sumar menos de 180° delata que los rieles no son paralelos.' },
      { texto: 'Guarda dos casos con el mismo giro y distinta calle. Compara sus correspondientes.',
        logrado: (v, gs) => { const d = c => { const m = medidasSecante(c.t, c.g); return m.abajo - m.arriba; };
          return v.g !== 0 && gs.some(c => c.g === v.g && c.t !== v.t && d(c) === d(v)) && gs.some(c => c.g === v.g && c.t === v.t); },
        bien: 'Otra calle, la misma diferencia: la culpa es del giro.' },
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
    lectura: v => { const s = camino(v); return [AB, ' + ', BC, ` ≈ ${f(s)} cm: un rodeo de ${f(s - 10)} cm sobre AC`]; },
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
  // Mesa 3: el quiebre, con el pasaje de la idea 6 y sus dos manijas.
  const quiebreX = v => v.a + v.b;
  const QUIEBRES = [];   // todos los x de la grilla del juego
  for (let a = quiebreIdea.juega.controles[0].min; a <= quiebreIdea.juega.controles[0].max; a += 5) for (let b = quiebreIdea.juega.controles[1].min; b <= quiebreIdea.juega.controles[1].max; b += 5) QUIEBRES.push(quiebreX({ a, b }));
  const mesaQuiebre = Object.assign({ id: 'quiebre', titulo: 'El quiebre entre paralelas', pieza: GO,
    invitaciones: [
      { texto: 'Haz que el quiebre mida justo 100°.',
        logrado: v => quiebreX(v) === 100,
        bien: 'Un quiebre de 100°, con a + b = 100. ¿Cuántas parejas lo logran?' },
      { texto: 'Busca el quiebre más cerrado que permite la mesa.',
        logrado: v => quiebreX(v) === Math.min(...QUIEBRES),
        bien: 'Los dos tramos casi pegados a sus avenidas: x se cierra.' },
      { texto: 'Haz el quiebre simétrico: el mismo ángulo arriba y abajo.',
        logrado: v => v.a === v.b && v.a !== 40,
        bien: 'Simétrico: la paralela auxiliar parte x en dos mitades iguales.' },
      { texto: 'Guarda dos casos con el mismo quiebre x y distintos a y b.',
        logrado: (v, gs) => gs.some(c => c.a !== v.a && quiebreX(c) === quiebreX(v)) && gs.some(c => c.a === v.a && c.b === v.b),
        bien: 'El mismo x por dos caminos: solo cuenta la suma a + b.' },
    ] }, quiebreIdea.juega);
  delete mesaQuiebre.mision;

  return {
    unidad: 'geometria.segmentos-y-angulos',
    version: '0.4.0',
    estado: 'completa',
    calidad: 2,
    requiere: ['/nucleo/kit/piezas/geo-figura.js', '/nucleo/kit/piezas/geo-objeto.js'],
    historia: {
      texto: 'Los Elementos de Euclides separan el objeto ideal de su dibujo: el punto no tiene tamaño y una marca de tinta solo lo representa. Una regla sirve para explorar una figura, pero su precisión no prueba una igualdad para todos los casos. Esta unidad hereda esa separación entre dibujar, medir y justificar.',
      pregunta: '¿Basta que dos líneas parezcan paralelas?',
      fuente: { titulo: 'Euclides, Elementos, libro I (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/bookI.html' },
    },
    // Glosario: las palabras que el curso estrena aquí (docs/teoria.md, 4d), con el tope de 30. Es la primera unidad de
    // geometría, así que trae el vocabulario de base. Cada idea estrena de 2 a 4 con su aproximación (simple); todos
    // traen tres ejemplos o más (calidad 2).
    glosario: [
      { termino: 'arco', def: 'Parte de una circunferencia entre dos de sus puntos. Sirve para marcar la abertura de un ángulo.', ver: ['ángulo'],
        ejemplos: ['El arco carmín entre las agujas del reloj marca el ángulo que forman.', 'El borde de una rodaja de piña, de un corte al otro.', 'La curva que dibuja el compás entre dos puntos.'] },
      // Idea 1.
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
      // Idea 2.
      { termino: 'punto medio', formas: ['punto medio', 'puntos medios'], def: 'Punto de un segmento que lo parte en dos partes de igual medida.', ver: ['segmento'],
        simple: 'El lugar justo a la mitad entre dos puntos.',
        ejemplos: ['El pañuelo atado a la mitad de la soga del tira y afloja.', `En una soga de 10 m, a ${10 / 2} m de cada punta.`, 'La línea del medio de la cancha, entre los dos arcos.'] },
      { termino: 'equidistante', formas: ['equidistante', 'equidistantes'], def: 'Que está a la misma distancia de dos o más puntos.', ver: ['punto medio'],
        simple: 'A la misma distancia de los dos.',
        ejemplos: ['El pañuelo, a 5 m de cada punta de la soga.', 'Tu casa, si queda a dos cuadras del colegio y dos del mercado.', 'Cualquier punto de la línea del medio, igual de lejos de los dos arcos.'] },
      // Idea 3.
      { termino: 'rayo', def: 'Parte de una recta que empieza en un punto y sigue sin fin hacia un solo lado.', ver: ['ángulo'],
        simple: 'Una línea derecha que sale de un punto y sigue sin fin.',
        ejemplos: ['Cada aguja del reloj, si la alargas sin fin desde el eje.', 'La luz de una linterna, que sale de ella y sigue.', 'OA en ∠AOB: empieza en O y pasa por A.'] },
      { termino: 'ángulo', simbolo: '∠', medida: '°', def: 'Abertura entre dos rayos que salen del mismo punto. Se mide en grados; m∠AOB es su medida.', ver: ['vértice', 'bisectriz'],
        simple: 'Cuánto se abren dos líneas que salen del mismo punto.',
        ejemplos: ['Las agujas del reloj a las 3:00 forman un ángulo de 90°.', '∠AOB: el vértice es O y los lados son OA y OB.', 'Lo que gira una puerta al abrirse, desde cerrada.'] },
      { termino: 'vértice', def: 'Punto donde se juntan los lados de un ángulo o de una figura.',
        simple: 'El punto de donde salen los dos lados.',
        ejemplos: ['El eje del reloj, de donde salen las dos agujas.', 'La O de ∠AOB: la letra del medio.', 'La punta de una escuadra.'] },
      { termino: 'ángulos consecutivos', formas: ['ángulos consecutivos', 'ángulo consecutivo', 'consecutivos', 'consecutivo'], def: 'Ángulos que comparten el vértice y un lado, uno al lado del otro.', ver: ['ángulo'],
        simple: 'Dos aberturas pegadas, una al lado de la otra, con un lado en común.',
        ejemplos: ['∠AOB y ∠BOC: comparten el lado OB.', 'Las tajadas de una torta, vistas desde el centro.', `Si miden 35° y 50°, juntos forman ${35 + 50}°.`] },
      { termino: 'ángulo agudo', formas: ['ángulo agudo', 'ángulos agudos', 'agudo', 'agudos'], def: 'El que mide más de 0° y menos de 90°: más cerrado que una esquina.',
        ejemplos: ['Las agujas del reloj a la 1:00: 30°.', 'La punta de una tajada de pizza.', 'Una barra que forma 50° con la pista.'] },
      { termino: 'ángulo recto', formas: ['ángulo recto', 'ángulos rectos'], def: 'El que mide exactamente 90°, como la esquina de una hoja.',
        ejemplos: ['Las agujas del reloj a las 3:00.', 'La esquina de tu cuaderno.', 'El poste de la tranquera con la pista.'] },
      { termino: 'ángulo obtuso', formas: ['ángulo obtuso', 'ángulos obtusos', 'obtuso', 'obtusos'], def: 'El que mide más de 90° y menos de 180°: más abierto que una esquina.',
        ejemplos: ['Las agujas del reloj a las 4:00: 120°.', 'Una laptop abierta hacia atrás.', 'Un ángulo de 135°.'] },
      { termino: 'ángulo llano', formas: ['ángulo llano', 'ángulos llanos', 'llano'], def: 'El que mide 180°: sus dos lados forman una sola recta.',
        ejemplos: ['Las agujas del reloj a las 6:00.', 'Un libro abierto del todo sobre la mesa.', 'Media vuelta en tu sitio.'] },
      { termino: 'ángulo no convexo', formas: ['ángulo no convexo', 'ángulos no convexos', 'no convexo'], def: 'El que mide más de 180° y menos de 360°: su abertura rodea por afuera.',
        ejemplos: ['El arco largo entre las agujas a las 8:00: 240°.', 'Lo que queda de una torta después de sacar una tajada.', 'El otro lado de un ángulo de 140°: 220°.'] },
      // Idea 4.
      { termino: 'complemento', formas: ['complemento', 'complementos', 'complementarios', 'complementario'],
        def: 'Lo que le falta a un ángulo para llegar a 90°.', ver: ['suplemento'],
        simple: 'Lo que le falta a un ángulo para hacer una esquina.',
        ejemplos: [`El de 35° es ${90 - 35}°, porque 35° + ${90 - 35}° = 90°.`, 'La barra a 60° de la pista forma 30° con el poste.', 'Un ángulo de 120° no tiene: ya pasa de 90°.'] },
      { termino: 'suplemento', formas: ['suplemento', 'suplementos', 'suplementarios', 'suplementario'],
        def: 'Lo que le falta a un ángulo para llegar a 180°.', ver: ['complemento'],
        simple: 'Lo que le falta a un ángulo para hacer una línea derecha.',
        ejemplos: [`El de 35° es ${180 - 35}°, porque 35° + ${180 - 35}° = 180°.`, 'La barra a 50° de un lado de la pista forma 130° con el otro.', 'Los vecinos de un cruce de calles.'] },
      { termino: 'bisectriz', def: 'Rayo que parte un ángulo en dos ángulos iguales.', ver: ['incentro'],
        simple: 'La línea que parte una abertura justo por la mitad.',
        ejemplos: [`La de un ángulo de 50° deja dos de ${50 / 2}°.`, 'El doblez que junta los dos lados de una esquina de papel.', 'La raya que parte una tajada de torta en dos iguales.'] },
      { termino: 'adyacentes', formas: ['adyacentes', 'adyacente'], def: 'Dos ángulos consecutivos cuyos lados no comunes forman una recta: suman 180°.',
        simple: 'Dos aberturas vecinas que juntas forman una línea derecha.',
        ejemplos: ['La barra con la pista de un lado y con la del otro.', `Si uno mide 115°, el otro mide ${180 - 115}°.`, 'Los dos ángulos que un rayo deja sobre una recta.'] },
      // Idea 5.
      { termino: 'rectas paralelas', simbolo: '∥', formas: ['rectas paralelas', 'paralelas', 'paralela', 'paralelos', 'paralelo'],
        def: 'Rectas de un mismo plano que nunca se cortan, por más que se prolonguen.', ver: ['secante'],
        simple: 'Líneas que van siempre a la misma distancia y nunca se juntan.',
        ejemplos: ['Los dos rieles del tren a Cusco.', 'Las líneas de tu cuaderno.', 'Dos avenidas que nunca se cruzan, como en el mapa del pasaje.'] },
      { termino: 'secante', def: 'Recta que corta a otras líneas o a una curva. Al cruzar dos paralelas forma ocho ángulos.',
        ver: ['ángulos correspondientes', 'alternos internos', 'conjugados internos'],
        simple: 'Una línea que cruza a otras, como una calle que cruza los rieles.',
        ejemplos: ['La calle que cruza los dos rieles del tren.', 'Una diagonal que corta las líneas del cuaderno.', 'Al cortar dos paralelas, forma cuatro ángulos en cada cruce.'] },
      { termino: 'ángulos correspondientes', formas: ['ángulos correspondientes', 'correspondientes', 'correspondiente'],
        def: 'Los que ocupan el mismo lugar en cada cruce de la secante. Entre paralelas, son iguales.', ver: ['secante'],
        simple: 'Los que están en el mismo lugar en los dos cruces.',
        ejemplos: ['Arriba a la derecha de la calle en cada riel.', 'Si uno mide 70° y las rectas son paralelas, el otro también.', 'Si miden 72° y 70°, las rectas no son paralelas.'] },
      { termino: 'alternos internos', formas: ['alternos internos', 'alterno interno'],
        def: 'Ángulos entre las dos rectas y a distinto lado de la secante. Entre paralelas, son iguales.', ver: ['conjugados internos'],
        simple: 'Los de adentro, cada uno de un lado de la calle.',
        ejemplos: ['Entre los rieles: uno a la derecha de la calle en un riel, otro a la izquierda en el otro.', 'Si uno mide 115°, entre paralelas el otro también.', 'Los que forma la paralela auxiliar en el quiebre.'] },
      { termino: 'alternos externos', formas: ['alternos externos', 'alterno externo'],
        def: 'Ángulos fuera de las dos rectas y a distinto lado de la secante. Entre paralelas, son iguales.', ver: ['alternos internos'],
        ejemplos: ['Afuera de los rieles: uno arriba a la derecha y otro abajo a la izquierda.', 'Si uno mide 130°, entre paralelas el otro también.', 'Con 4x − 15° y 2x + 35°, se igualan.'] },
      { termino: 'conjugados internos', formas: ['conjugados internos', 'conjugado interno'],
        def: 'Ángulos entre las dos rectas y al mismo lado de la secante. Entre paralelas, suman 180°.', ver: ['alternos internos'],
        ejemplos: [`Si uno mide 60°, el otro mide ${180 - 60}°.`, 'Entre los rieles, los dos a la derecha de la calle.', 'Con 2x + 20° y 3x + 10°, suman 180°.'] },
      { termino: 'conjugados externos', formas: ['conjugados externos', 'conjugado externo'],
        def: 'Ángulos fuera de las dos rectas y al mismo lado de la secante. Entre paralelas, suman 180°.', ver: ['conjugados internos'],
        ejemplos: [`Si uno mide 80°, el otro mide ${180 - 80}°.`, 'Afuera de los rieles, los dos a la derecha de la calle.', 'Con x + 40° y 2x + 20°, suman 180°.'] },
      { termino: 'opuestos por el vértice', formas: ['opuestos por el vértice', 'opuesto por el vértice'],
        def: 'Los dos ángulos que quedan frente a frente cuando se cruzan dos rectas. Siempre son iguales.',
        ejemplos: ['En el cruce de la calle con un riel, los dos de 60°.', 'Las dos puntas de una tijera abierta.', 'En una X, el ángulo de arriba y el de abajo.'] },
      // Idea 6.
      { termino: 'quiebre', formas: ['quiebre', 'quiebres'], def: 'Ángulo que forma una línea en el punto donde cambia de dirección.', ver: ['vértice'],
        simple: 'El ángulo donde un camino dobla.',
        ejemplos: ['Donde el pasaje dobla, en V.', `Con tramos a 40° y 30° de sus avenidas, mide ${40 + 30}°.`, 'Cada vuelta del camino en zigzag de un cerro.'] },
      { termino: 'línea auxiliar', formas: ['paralela auxiliar', 'línea auxiliar', 'auxiliar'],
        def: 'Línea extra que se traza en la figura para hacer visible una relación y poder justificarla.',
        simple: 'Una línea de ayuda que trazas tú para ver la relación.',
        ejemplos: ['La paralela por V que parte el quiebre en dos.', 'Las paralelas por M y N en el serrucho.', 'Una raya punteada que no estaba en el problema.'] },
    ],
    // Laboratorio: la secante con el riel que gira y B libre en el plano son más ricas que sus ideas; la tercera mesa es
    // el quiebre con sus dos manijas.
    laboratorio: [mesaSecante, mesaPunto, mesaQuiebre],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'secante-y-giro': ['paralelas'],
      'punto-libre': ['suma-de-segmentos'],
      'quiebre': ['quiebre'],
    },
    ideas: [suma, medio, aberturaIdea, bisectriz, paralelas, quiebreIdea],
  };
});
