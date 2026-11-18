/*
 * Teoría de «Las cuatro operaciones» (aritmetica.cuatro-operaciones), para 5.º de secundaria y preuniversitario. Fuente
 * del contenido: docs/teoria/matriz/aritmetica.json (unidad 12) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 *
 * Etapa 4 del plan de calidad (18 nov): la propuesta aprobada por Gerson con todas sus recomendaciones
 * (docs/etapa4/propuesta-aritmetica.md) y docs/etapa4/decisiones.md, que manda. Siete ideas (septimaIdea: la resta y las
 * cifras ocultas son 4 de las 6 preguntas de San Marcos), en el orden de la propuesta §1: 1 `otras-bases` (la llevada),
 * 2 `prestamo`, 3 `complemento`, 4 `cifras-ocultas`, 5 `multiplicar-partes`, 6 `defecto-exceso` y 7 `cifras-producto`.
 * Las sumatorias se mudaron a Sucesiones y series (idea `suma-rectangulo` y mesa `escaleras-a-z`), con el avance migrado
 * por nucleo/avance.js (partición `mudadoSum`). Hilo de la unidad: el puesto de caramelos de doña Juana en el mercado de
 * Juliaca (pieza arit-puesto, dibujo de prueba), en base 10, con su cuaderno de cuentas (opción cuenta: llevadas,
 * préstamos tachados y manchas de chicha morada) y su calculadora de 8 casillas (pieza arit-calculadora, de prueba).
 *
 * Letras (propuesta §6): n es la base, como en Numeración; sin base escrita, es 10. 34₍₅₎ y a̅b̅c̅ con raya ({ raya } de
 * nucleo/ecuacion.js). × para multiplicar; nunca «·» (el «   ·   » solo separa dos relaciones en una regla, cada una
 * en su línea). a, b y c son cifras ocultas; ☐ es una mancha. N es el número del complemento y k sus cifras (10ᵏ). D, d,
 * q, r y rₑ en la división (q + 1 es el cociente por exceso). A y B en la idea 7, con sus cifras dichas en palabras. Lo
 * que sube un factor va en palabras; en la regla, F y G son los factores y s lo que sube F.
 *
 * REGLA DE COLORES DE LA UNIDAD: un color fijo por magnitud (docs/molde-unidad.md §5b; propuesta §7, aprobada), en la
 * tabla COLORES (def.colores). El criterio es lo que cada cosa es en el puesto:
 *   - turquesa (c-i), «envase»: la base (10, o n), lo que lleva una bolsita, el divisor d, las metas 10ᵏ del complemento
 *     y las casillas de la calculadora;
 *   - naranja (c-o), «muda»: lo que se muda o queda suelto: la llevada, el préstamo (la cifra tachada y lo que queda en la
 *     columna) y el resto por defecto r;
 *   - violeta (c-f), «busca»: lo que se busca casi siempre: el resultado de la cuenta (también cuando se da), el
 *     complemento, lo que sube un producto, el resto por exceso rₑ y la cantidad de cifras;
 *   - tinta: los números que se operan (sumandos, minuendo, sustraendo, factores, N, D), el cociente q, las bolsas, los
 *     caramelos dibujados, «?» y las manchas;
 *   - ni verde ni carmín.
 *   La respuesta lleva el color de su magnitud; la letra de una alternativa va en negrita con ese color. Cada ficha de
 *   color dice su magnitud (m); contenido/teoria/aritmetica/cuatro-operaciones.test.js falla si una cambia de color.
 * Errores: los AT-* son hipótesis de aula (el informe de aritmética no trae cifras de las cuatro operaciones); ver el
 * bloque de cada idea. Las trampas 18 y 29 de docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md respaldan
 * las del resto por exceso y las del préstamo olvidado y el complemento.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: cada operación es algo que doña Juana hace en el puesto: juntar, abrir, completar, repartir, multiplicar.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, sin audio, con lápiz al lado.
 *   Resultado observable: suma y resta por columnas en base 10 y en base n, saca el complemento, reconstruye cifras
 *     manchadas, sabe cuánto sube un producto, usa los dos restos de una división y acota las cifras de un producto.
 *   Orden de atención: 1.º el objeto (pedido, cuaderno o calculadora) · 2.º la lectura · acción: tocar o el botón fijo.
 *   Estados: juego sin tocar · casos probados · misión lograda · predicción · coincide / no coincide · paso a paso ·
 *     caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué se lleva, se presta o sobra lo que sobra, y cómo se sabe sin hacer toda la cuenta?».
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/cuatro-operaciones junta, abre y cuenta por columnas (juegos y mesas; regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/cuatro-operaciones/motor.js'))
    : fabrica(root.Kit, root.MotorCuatroOperaciones);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MCO) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const enBase = (x, base) => { if (x === 0) return '0'; let s = ''; while (x > 0) { s = String(x % base) + s; x = Math.floor(x / base); } return s; };
  const valor = (c, base) => c.split('').reduce((v, x) => v * base + +x, 0);
  const cifras = x => String(Math.abs(Math.round(x))).length;
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
      if (x.valor === null || x.valor === undefined || (typeof x.valor === 'number' && (!Number.isFinite(x.valor) || x.valor < 0))) continue;
      const txt = fmt(x.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba cuatro-operaciones.test.js) ----------
  const COLORES = { envase: 'i', muda: 'o', busca: 'f' };
  const ficha = m => t => ({ v: `c-${COLORES[m]}`, t: String(t), m });
  const bas = ficha('envase'), lleva = ficha('muda'), res = ficha('busca');
  // Un numeral que se opera (tinta) y uno del resultado (violeta), con la base de subíndice entre paréntesis, en
  // turquesa: 34₍₅₎. En base 10 no se escribe la base.
  const conBase = (c, base) => (base === 10 || base === undefined ? null : bas(`(${base})`));
  const sumN = (c, base) => (conBase(c, base) ? { sub: [String(c), conBase(c, base)] } : String(c));
  const resN = (c, base) => (conBase(c, base) ? { sub: [res(c), conBase(c, base)] } : res(c));
  // La letra de una alternativa, en negrita (Gerson, mesa de revisión, 17 nov), con el color de lo que nombra. El U+2060
  // (invisible) evita que la letra sola salga en cursiva como una variable.
  const letra = (L, m = 'busca') => ({ v: `c-${COLORES[m]}`, t: `${L}⁠`, m });
  // El resto por exceso: rₑ, con subíndice de verdad y en violeta (lo que se busca). El resto por defecto r, en naranja.
  const RE = { sub: [res('r'), 'e'] }, R_ = lleva('r'), D_ = bas('d');
  // Entre dos relaciones de una misma ecuación (en la regla, cada una en su línea).
  const SEP = '   ·   ';
  const inversa = (escala, a0, b0) => px => a0 + (px - escala(a0)) * (b0 - a0) / (escala(b0) - escala(a0));
  const RECTA = () => Kit.piezas.recta, TIRAS = () => Kit.piezas['arit-tiras'];

  // ---------- Idea 1 (rehecha, 18 nov): la llevada llena una bolsita (adición con llevadas y otras bases) ----------
  // Propuesta aprobada: docs/etapa4/propuesta-aritmetica.md (§1 a §7, con todas sus recomendaciones) y
  // docs/etapa4/decisiones.md. Conserva el id `otras-bases` (no se pierde el avance de nadie); el control `b` del juego
  // viejo pasa al laboratorio (mesa `juego-otras-bases`, el mismo id que tenía el juego como mesa: los casos guardados
  // siguen abriendo).
  // Objeto: el puesto de doña Juana (pieza arit-puesto, dibujo de prueba), ahora en base 10, con su cuaderno de cuentas
  // (opción cuenta de la pieza: la cuenta escrita en columnas, con un icono de caramelo, bolsita y caja sobre cada una).
  // Cambia: los dos pedidos y si los sueltos ya se juntaron. · Permanece: la regla del puesto (10 sueltos = 1 bolsita) y la
  // escala del dibujo. · Progresa: sueltos de los dos pedidos → bolsita que sube → total anotado. · Se reserva: la segunda
  // llevada (bolsitas que llenan una caja) y las otras bases: son de la predicción (34₍₅₎ + 23₍₅₎). · Debe verse: cuando
  // una columna junta 10, la bolsita llena se muda a la columna de al lado; en la columna se anota lo que sobra.
  // El juego llega a pedidos de 11 a 49 (no de 11 a 89, como decía la propuesta): con dos pedidos de hasta 49 nunca se
  // llena una caja (4 + 4 + 1 = 9 bolsitas como mucho) y 9 bolsitas de 10 caben a una escala legible junto al cuaderno
  // (0,73); con 89 + 89 harían falta 17 bolsitas y una caja. La caja es de la predicción.
  // Errores (hipótesis de aula, sin medir: el informe de aritmética no trae cifras de las cuatro operaciones; la trampa 29
  // de docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md respalda las de la llevada olvidada):
  // AT-DECIMAL lleva al llegar a 10 en otra base · AT-LLEVA-OLVIDA no suma la llevada en la columna siguiente ·
  // AT-LLEVA-FINAL no anota la última llevada · AT-LLEVA-UNO lleva 1 donde van 2 o más · AT-LLEVA-CIFRA confunde lo que
  // se anota con lo que se lleva · AT-LLEVA-TODO lleva la suma entera de la columna · AT-CADENA no cuenta la llevada que
  // forma otra · AT-MENOR toma la menor base posible sin comprobar la cuenta · AT-SUMA-COLUMNA toma la suma de las
  // unidades como base.
  const PU = 'arit-puesto';
  const PUESTO = () => Kit.piezas[PU];
  const fig = datos => ({ pieza: PU, datos, estado: {} });
  // Solo el cuaderno, abierto sobre el mostrador: la cuenta como la dan los datos (lo que se pide, con «?»).
  const cuaderno = (sumandos, o = {}) => fig({ cuenta: Object.assign({ solo: true, sumandos: sumandos.map(String), resultado: '?' }, o) });
  // Datos que se repiten (punto 13: herramientas, no el paso hecho). La fórmula de una columna va en los ejemplos y en
  // «Ahora tú», nunca en Predice.
  const DO = {
    bolsita: n => ['1 bolsita = ', bas(n), ' caramelos'],
    caja: n => ['1 caja = ', bas(n), ' bolsitas'],
    todo: n => ['1 bolsita = ', bas(n), ' caramelos; 1 caja = ', bas(n), ' bolsitas; 1 cajón = ', bas(n), ' cajas'],
    base: n => ['En base ', bas(n), ', ', bas(n), ' de una columna forman 1 de la columna siguiente'],
    columna: ['suma de una columna = ', lleva('llevada'), ' × ', bas('n'), ' + ', res('cifra que se anota')],
    cifras: ['En base ', bas('n'), ', las cifras van de 0 a ', bas('n'), ' − 1'],
    ordenes: 'Unidades, decenas y centenas: sueltos, bolsitas y cajas',
    f2: n => [{ sub: [{ raya: ['ab'] }, bas(`(${n})`)] }, ' = a × ', bas(n), ' + b'],
    f3: n => [{ sub: [{ raya: ['abc'] }, bas(`(${n})`)] }, ' = a × ', { sup: [bas(n), '2'] }, ' + b × ', bas(n), ' + c'],
  };
  // Lo que pasa en cada columna, como ecuación: «8 + 7 + 9 = 24 = 2 × 10 + 4» (las cuentas, del motor de la escena).
  const ecColumna = (c, n) => {
    const partes = [c.entran.join(' + ')];
    if (c.llevadaEntra) partes.push(' + ', lleva(c.llevadaEntra));
    partes.push(` = ${c.total}`);
    if (c.llevadaSale) partes.push(' = ', lleva(c.llevadaSale), ' × ', bas(n), ' + ', res(c.cifra));
    return partes;
  };
  const NOMBRE_COL = ['Sueltos', 'Bolsitas', 'Cajas', 'Cajones'];
  // Una base al azar para un numeral de k cifras (la primera no es 0).
  const numeralAzar = (r, k, n) => [r.ent(1, n - 1)].concat(Array.from({ length: k - 1 }, () => r.ent(0, n - 1))).join('');
  // Descomposición con números (la del sentido): 1242₍₆₎ = 1 × 216 + 2 × 36 + 4 × 6 + 2.
  const poli = (c, n) => c.split('').map((d, i, xs) => { const e = xs.length - 1 - i; return e === 0 ? d : `${d} × ${n ** e}`; }).join(' + ');

  // El juego: dos pedidos de base 10 juntos sobre el mostrador, columna por columna (aMano del motor de la escena), y
  // tocar los sueltos junta 10 en una bolsita (juntarMano). La misión la comprueba el mismo motor (regla 1).
  const manoJ = v => {
    let m = MCO.aMano('suma', String(v.p1), String(v.p2), 10);
    const lleno = m.cuentas[0] >= 10, junto = !!(v.ju && lleno);
    if (junto) m = MCO.juntarMano(m, 0);
    return { m, lleno, junto };
  };
  const uni = x => x % 10, dec = x => Math.floor(x / 10);
  const puestoJ = (v, escala) => {
    const { m, lleno, junto } = manoJ(v), [s, b] = m.cuentas;
    return { n: 10, bolsitas: b, sueltos: s, ceros: true, regla: 1, escala, colorCifras: false,
      juntar: lleno && !junto ? 'sueltos' : undefined,
      llevada: junto ? { bolsitas: 1 } : undefined,
      rotulos: { bolsitas: [[`${dec(v.p1)} + ${dec(v.p2)}`]].concat(junto ? [[' + '], ['1', 'o', 700]] : [], [[' bolsitas']]),
        sueltos: junto ? `${s} ${s === 1 ? 'suelto' : 'sueltos'}` : `${uni(v.p1)} + ${uni(v.p2)} sueltos` },
      toque: [{ orden: 'sueltos', control: 'ju', titulo: junto ? 'Tocar para soltar la bolsita otra vez' : 'Tocar para juntar 10 sueltos en una bolsita' }],
      cuenta: { sumandos: [String(v.p1), String(v.p2)], op: '+', llevadas: junto ? { 1: 1 } : {}, resultado: m.listo ? m.texto : '?' } };
  };
  let escJ = null;
  const escalaJ = () => {
    if (escJ) return escJ;
    let mn = 1.7;
    for (let p1 = 11; p1 <= 49; p1++) for (let p2 = 11; p2 <= 49; p2++) for (const ju of [0, 1]) mn = Math.min(mn, PUESTO().geometria(puestoJ({ p1, p2, ju })).sCabe);
    return (escJ = Math.floor(mn * 100) / 100);
  };
  // Predice, «Mira» y la regla: el puesto de bolsitas de 5 con 34₍₅₎ + 23₍₅₎, a una sola escala (la que hace caber el
  // paso más ancho; cuatro-operaciones.test.js comprueba que ninguno la necesite menor).
  const ESC5 = 0.85;
  const P5 = { n: 5, ceros: true, regla: 2, colorCifras: false, escala: ESC5 };
  const CU5 = o => Object.assign({ sumandos: ['34', '23'], base: '5', op: '+', resultado: '?' }, o);
  const ROT5 = { bolsitas: '3 + 2 bolsitas', sueltos: '4 + 3 sueltos' };
  const ROT5b = { bolsitas: [['3 + 2 + '], ['1', 'o', 700], [' bolsitas']], sueltos: '2 sueltos' };
  const ROT5c = { cajas: [['1', 'o', 700], [' caja']], bolsitas: '1 bolsita', sueltos: '2 sueltos' };
  const MIRA5 = Object.assign({}, P5, { pasos: [
    { bolsitas: 5, sueltos: 7, rotulos: ROT5, cuenta: CU5() },
    { bolsitas: 5, sueltos: 7, juntar: 'sueltos', rotulos: ROT5, cuenta: CU5({ foco: 0 }) },
    { bolsitas: 6, sueltos: 2, llevada: { bolsitas: 1 }, rotulos: ROT5b, cuenta: CU5({ foco: 0, llevadas: { 1: 1 }, resultado: '2' }) },
    { bolsitas: 6, sueltos: 2, juntar: 'bolsitas', rotulos: ROT5b, cuenta: CU5({ foco: 1, llevadas: { 1: 1 }, resultado: '2' }) },
    { cajas: 1, bolsitas: 1, sueltos: 2, llevada: { cajas: 1 }, rotulos: ROT5c, cuenta: CU5({ foco: 2, llevadas: { 1: 1, 2: 1 }, resultado: '112' }) },
    { cajas: 1, bolsitas: 1, sueltos: 2, rotulos: ROT5c, cuenta: CU5({ llevadas: { 1: 1, 2: 1 }, resultado: '112' }) },
  ] });

  // Cuatro opciones siempre en «Ahora tú»: si dos errores dan el mismo texto, se arma otro caso con el mismo azar.
  function conCuatro(caso, r) {
    for (let i = 0; i < 4000; i++) { const c = caso(r); if (c && c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  const planoP = x => (Array.isArray(x) ? x.map(planoP).join('') : x && typeof x === 'object'
    ? (x.t !== undefined ? String(x.t) : x.sub ? planoP(x.sub[0]) + planoP(x.sub[1]) : x.raya ? planoP(x.raya) : '') : String(x));
  function opcionesNum(correcta, distractores) {
    const ops = [{ id: 'c', texto: correcta, correcta: true }], vistos = new Set([planoP(correcta)]);
    for (const x of distractores) {
      const t = planoP(x.texto);
      if (vistos.has(t)) continue;
      vistos.add(t);
      ops.push({ id: x.id, texto: x.texto, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  const suma = xs => xs.reduce((a, x) => a + x, 0);
  // Suma con el error «lleva 1 donde van 2»: anota lo que sobra, pero nunca lleva más de 1.
  const sumaLlevaUno = (xs, n) => {
    const L = Math.max(...xs.map(x => x.length)), cs = xs.map(x => x.split('').reverse().map(Number));
    let out = '', ll = 0;
    for (let k = 0; k < L; k++) { const t = suma(cs.map(c => c[k] || 0)) + ll; out = String(t % n) + out; ll = t >= n ? 1 : 0; }
    return (ll ? '1' : '') + out;
  };

  // Ahora tú · tipo 0: ¿cuánto se lleva de los sueltos a las bolsitas? (base 10, tres o cuatro sumandos).
  function casoCuantoLleva(r, k) {
    const xs = Array.from({ length: k }, () => r.ent(12, 98)), us = xs.map(uni), S = suma(us), L = Math.floor(S / 10), w = S % 10;
    if (L < 2 || w === 1 || w === L) return null;
    return {
      pregunta: ['Doña Juana suma en su cuaderno ', xs.join(' + '), '. ¿Cuántas bolsitas lleva de la columna de los sueltos a la de las bolsitas?'],
      datos: [DO.bolsita(10), DO.columna],
      dibujo: cuaderno(xs, { foco: 0 }),
      opciones: opciones(L, [
        { id: 'cifra', valor: w, error: 'AT-LLEVA-CIFRA', siFuera: `Sumar la columna está bien. Pero el ${w} se anota; lo que sube son las bolsitas llenas.` },
        { id: 'uno', valor: 1, error: 'AT-LLEVA-UNO', siFuera: 'Llevar está bien, pero no siempre se lleva 1: depende de cuántas bolsitas se llenan.' },
        { id: 'todo', valor: S, error: 'AT-LLEVA-TODO', siFuera: 'Bien que sumes toda la columna. Pero solo suben las bolsitas llenas; los sueltos que sobran se anotan.' },
      ]),
      solucion: { texto: `La columna junta ${S} sueltos: llena ${L} bolsitas y sobran ${w}.`, ecuacion: [us.join(' + '), ` = ${S} = `, lleva(L), ' × ', bas(10), ' + ', res(w)] },
    };
  }
  // Ahora tú · tipo 1 (nivel examen): tres sumandos en base n, con alguna columna que lleva 2.
  function casoTres(r) {
    const n = r.ent(4, 9), xs = [0, 1, 2].map(() => numeralAzar(r, 3, n));
    const C = MCO.sumaColumnas(xs, n);
    if (!C.columnas.some(c => c.llevadaSale >= 2) || C.texto.length <= 3) return null;
    const dec10 = String(suma(xs.map(Number)));
    return {
      pregunta: ['¿Cuánto es ', sumN(xs[0], n), ' + ', sumN(xs[1], n), ' + ', sumN(xs[2], n), '?'],
      datos: [DO.base(n), DO.columna],
      dibujo: cuaderno(xs, { base: String(n) }),
      opciones: opcionesNum([resN(C.texto, n)], [
        { id: 'decimal', texto: [resN(dec10, n)], error: 'AT-DECIMAL', siFuera: `Sumar por columnas está bien. Pero así se suma en base 10; en base ${n} se lleva al juntar ${n}.` },
        { id: 'uno', texto: [resN(sumaLlevaUno(xs, n), n)], error: 'AT-LLEVA-UNO', siFuera: `Anotar lo que sobra está bien. Pero si la columna junta dos veces ${n}, se llevan 2, no 1.` },
        { id: 'final', texto: [resN(C.texto.slice(1), n)], error: 'AT-LLEVA-FINAL', siFuera: 'Las columnas están bien. Pero la última llevada también se anota: abre una columna nueva.' },
      ]),
      solucion: { texto: `Por columnas, desde los sueltos; si una columna junta dos veces ${n}, se llevan 2.`,
        ecuacion: [sumN(xs[0], n), ' + ', sumN(xs[1], n), ' + ', sumN(xs[2], n), ' = ', resN(C.texto, n)] },
    };
  }
  // Ahora tú · tipo 2 (nivel examen): la base que hace cuadrar una suma (base desconocida, de Numeración, con la llevada).
  function casoBaseOculta(r) {
    const n = r.ent(5, 9), a = numeralAzar(r, 2, n), b = numeralAzar(r, 2, n);
    const C = MCO.sumaColumnas([a, b], n), z = C.texto, c0 = C.columnas[0];
    if (c0.llevadaSale !== 1) return null;
    const mayor = Math.max(...(a + b + z).split('').map(Number)), S = c0.total;
    const sirven = []; for (let m = mayor + 1; m <= 20; m++) if (valor(a, m) + valor(b, m) === valor(z, m)) sirven.push(m);
    if (sirven.length !== 1 || sirven[0] !== n || mayor + 1 === n) return null;
    const N_ = sumNL => sumN(sumNL, 'n');
    return {
      pregunta: ['En cierta base ', bas('n'), ' se cumple ', N_(a), ' + ', N_(b), ' = ', resN(z, 'n'), '. ¿Cuál es ', bas('n'), '?'],
      datos: [DO.columna, DO.cifras],
      dibujo: cuaderno([a, b], { base: 'n', resultado: z }),
      opciones: opciones(n, [
        { id: 'menor', valor: mayor + 1, error: 'AT-MENOR', siFuera: 'Mirar la cifra mayor está bien: la base tiene que pasarla. Pero con esa base la cuenta no cuadra.' },
        { id: 'columna', valor: S, error: 'AT-SUMA-COLUMNA', siFuera: 'Sumar las unidades está bien. Pero esa suma es una bolsita más lo que se anota, no solo la bolsita.' },
        { id: 'diez', valor: 10, error: 'AT-DECIMAL', siFuera: 'Sin base escrita sería 10, es cierto. Pero en base 10 esa cuenta no cuadra.' },
      ], x => `base ${x}`),
      solucion: { texto: `Unidades: ${c0.entran.join(' + ')} = ${S}, y se anota ${c0.cifra}: la bolsita que subió tiene ${S} − ${c0.cifra} = ${n}.`,
        ecuacion: [`${S} = `, lleva(1), ' × ', bas('n'), ' + ', res(c0.cifra), '   →   ', bas('n'), ' = ', bas(n)] },
    };
  }
  // Ahora tú · tipo 3: la cifra de las centenas, con lo que le llega llevado de las decenas (2 o más).
  function casoCentenas(r) {
    const xs = [0, 1, 2].map(() => r.ent(100, 9999)), C = MCO.sumaColumnas(xs.map(String), 10), c2 = C.columnas[2];
    const ll = c2.llevadaEntra, sin = suma(c2.entran), olvida = sin % 10, unoV = (sin + 1) % 10;
    if (ll < 2 || new Set([c2.cifra, olvida, unoV, c2.llevadaSale]).size < 4) return null;
    return {
      pregunta: ['Doña Juana suma ', xs.join(' + '), '. ¿Qué cifra anota en la columna de las centenas?'],
      datos: [DO.ordenes, DO.columna],
      dibujo: cuaderno(xs, { foco: 2 }),
      opciones: opciones(c2.cifra, [
        { id: 'olvida', valor: olvida, error: 'AT-LLEVA-OLVIDA', siFuera: 'Sumar la columna de las centenas está bien. Pero falta lo que llega llevado de las decenas.' },
        { id: 'uno', valor: unoV, error: 'AT-LLEVA-UNO', siFuera: `Sumar lo que llega llevado está bien. Pero de las decenas llegan ${ll}, no 1.` },
        { id: 'sale', valor: c2.llevadaSale, error: 'AT-LLEVA-CIFRA', siFuera: 'Esa es la llevada que sale de las centenas. Se anota lo que sobra después de llevar.' },
      ]),
      solucion: { texto: `Las decenas le llevan ${ll}; la columna junta ${c2.total} y se anota ${c2.cifra}.`, ecuacion: ecColumna(c2, 10) },
    };
  }
  // Ahora tú · tipo 4 (nivel examen): ¿en cuántas columnas se lleva? (base n, con una llevada que forma otra y la final).
  function casoLlevadas(r) {
    const n = r.ent(4, 8), a = numeralAzar(r, 3, n), b = numeralAzar(r, 3, n), C = MCO.sumaColumnas([a, b], n);
    const L = C.llevadas, cadena = C.columnas.filter(c => suma(c.entran) >= n).length;
    const decimal = MCO.sumaColumnas([a, b], 10).llevadas, final = C.texto.length > 3 ? L - 1 : null;
    if (L < 2 || final === null || new Set([L, cadena, decimal, final]).size < 4) return null;
    return {
      pregunta: ['Al sumar ', sumN(a, n), ' + ', sumN(b, n), ', ¿en cuántas columnas se lleva algo a la columna siguiente?'],
      datos: [DO.base(n), DO.columna],
      dibujo: cuaderno([a, b], { base: String(n) }),
      opciones: opciones(L, [
        { id: 'cadena', valor: cadena, error: 'AT-CADENA', siFuera: 'Mirar si las cifras pasan de la base está bien. Pero la llevada que llega también suma.' },
        { id: 'decimal', valor: decimal, error: 'AT-DECIMAL', siFuera: `Contar las llevadas está bien. Pero en base ${n} se lleva al juntar ${n}, no al pasar de 9.` },
        { id: 'final', valor: final, error: 'AT-LLEVA-FINAL', siFuera: 'Las columnas de adentro están bien contadas. Pero la última también lleva: abre una columna nueva.' },
      ], x => (x === 1 ? '1 columna' : `${x} columnas`)),
      solucion: { texto: `Cuento las columnas que juntan ${n} o más, con lo que les llega llevado: ${L}.`,
        ecuacion: [sumN(a, n), ' + ', sumN(b, n), ' = ', resN(C.texto, n)] },
    };
  }

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h): 5 de nivel 1, 5 de nivel 2 y 5 de nivel 3. Cuentas
  // rehechas aparte, sin este archivo (scratchpad de la sesión, cuentas-idea1.js, que suma en cualquier base con su
  // propio código): 6 + 7 = 13; 52 + 36 = 88 sin llevadas; 29 + 45 = 74; 4 + 5 = 9 = 1 × 6 + 3; 6 + 8 = 14 bolsitas;
  // 478 + 356 = 834; 58 + 67 + 49 = 174 (llevada 2); 123₍₄₎ + 213₍₄₎ = 1002₍₄₎ (27 + 39 = 66); 45₍₇₎ + 36₍₇₎ = 114₍₇₎
  // (33 + 27 = 60); 386 + 475 + 299: llegan 2 a las centenas; 35₍ₙ₎ + 24₍ₙ₎ = 62₍ₙ₎ solo con n = 7; 245₍₆₎ + 354₍₆₎ +
  // 155₍₆₎ = 1242₍₆₎ (101 + 142 + 71 = 314), con las trampas 754, 1132 y 242; 3 × 777₍₈₎ = 2775₍₈₎ (3 × 511 = 1533),
  // cifras 21, con las trampas 18, 19 y 9; cuatro cifras de 9 dan 36: se llevan 3; 4999 + 5001 = 10 000 con 4 llevadas.
  // La figura muestra lo que cada dato marca por sí solo (los sumandos escritos, el montón que se da), nunca el
  // resultado: lo que se pide va con «?» en tinta. Ningún ejemplo usa los números de la predicción ni de la misión.
  const EJEMPLOS_LLEVADA = [
    { nivel: 1, titulo: 'Una columna que pasa de 9',
      enunciado: 'En la columna de los sueltos, doña Juana junta 6 + 7 = 13 caramelos. ¿Qué anota en esa columna y qué lleva a la de las bolsitas?',
      datos: [DO.bolsita(10)],
      figura: fig({ n: 10, sueltos: 13, regla: 1, rotulos: { sueltos: '6 + 7 sueltos' } }),
      solucion: [
        { texto: ['Con ', bas(10), ' de los 13 se llena una bolsita; sobran 3, menos que 10.'], ecuacion: ['13 = ', lleva(1), ' × ', bas(10), ' + ', res(3)] },
        { texto: 'Los 3 sueltos se anotan en su columna; la bolsita llena sube a la columna de las bolsitas.' },
      ],
      respuesta: ['Anota ', res(3), ' y lleva ', lleva(1)] },
    { nivel: 1, titulo: '¿Hay algo que llevar?',
      enunciado: 'Doña Juana suma 52 + 36 en su cuaderno. ¿Tiene que llevar algo a otra columna?',
      datos: [DO.bolsita(10), DO.caja(10)],
      figura: cuaderno(['52', '36']),
      solucion: [
        { texto: 'Sueltos: 2 + 6 = 8, menos que 10: no llenan una bolsita. Bolsitas: 5 + 3 = 8, tampoco llenan una caja.' },
        { texto: 'Ninguna columna llega a 10: se anota cada suma tal cual.', ecuacion: ['52 + 36 = ', res(88)] },
      ],
      respuesta: ['No: ninguna columna llega a 10; da ', res(88)] },
    { nivel: 1, titulo: 'Una sola llevada',
      enunciado: 'Doña Juana junta un pedido de 29 caramelos y otro de 45. ¿Cuántos caramelos tiene ahora?',
      datos: [DO.bolsita(10)],
      figura: cuaderno(['29', '45']),
      solucion: [
        { texto: 'Sueltos: 9 + 5 = 14. Se llena una bolsita y sobran 4.', ecuacion: ['9 + 5 = 14 = ', lleva(1), ' × ', bas(10), ' + ', res(4)] },
        { texto: 'Bolsitas: 2 + 4, más la que subió.', ecuacion: ['2 + 4 + ', lleva(1), ' = ', res(7)] },
      ],
      respuesta: [res(74), ' caramelos'] },
    { nivel: 1, titulo: 'Una llevada en base 6',
      enunciado: ['En el puesto de bolsitas de ', bas(6), ', la columna de los sueltos junta 4 + 5 = 9 caramelos. ¿Qué se anota en esa columna y qué se lleva?'],
      datos: [DO.bolsita(6)],
      figura: fig({ n: 6, sueltos: 9, regla: 1, rotulos: { sueltos: '4 + 5 sueltos' } }),
      solucion: [
        { texto: ['Con ', bas(6), ' se llena una bolsita; sobran 3, menos que 6.'], ecuacion: ['9 = ', lleva(1), ' × ', bas(6), ' + ', res(3)] },
        { texto: 'En base 6 no se espera a juntar 10: la bolsita se llena con 6.' },
      ],
      respuesta: ['Se anota ', res(3), ' y se lleva ', lleva(1)] },
    { nivel: 1, titulo: 'Bolsitas que llenan una caja',
      enunciado: 'Al sumar dos pedidos, la columna de las bolsitas junta 6 + 8 = 14 bolsitas de 10. ¿Qué se anota en esa columna y qué se lleva a la de las cajas?',
      datos: [DO.bolsita(10), DO.caja(10)],
      figura: fig({ n: 10, bolsitas: 14, regla: 2, rotulos: { bolsitas: '6 + 8 bolsitas' } }),
      solucion: [
        { texto: ['Con ', bas(10), ' bolsitas se llena una caja; sobran 4 bolsitas.'], ecuacion: ['14 = ', lleva(1), ' × ', bas(10), ' + ', res(4)] },
        { texto: 'Las 4 bolsitas se anotan en su columna; la caja sube a la columna de las cajas: es la llevada.' },
      ],
      respuesta: ['Se anota ', res(4), ' y se lleva ', lleva(1), ' caja'] },
    { nivel: 2, titulo: 'Dos llevadas seguidas',
      enunciado: '¿Cuánto es 478 + 356?',
      datos: [DO.ordenes, DO.columna],
      figura: cuaderno(['478', '356']),
      solucion: [
        { texto: 'Unidades: 8 + 6 = 14. Se anota 4 y se lleva 1.', ecuacion: ['8 + 6 = 14 = ', lleva(1), ' × ', bas(10), ' + ', res(4)] },
        { texto: 'Decenas: 7 + 5 más la que llega. Se anota 3 y se lleva 1.', ecuacion: ['7 + 5 + ', lleva(1), ' = 13 = ', lleva(1), ' × ', bas(10), ' + ', res(3)] },
        { texto: 'Centenas: 4 + 3 más la que llega.', ecuacion: ['4 + 3 + ', lleva(1), ' = ', res(8)] },
      ],
      respuesta: ['478 + 356 = ', res(834)] },
    { nivel: 2, titulo: 'Se llevan 2',
      enunciado: 'Doña Juana suma tres pedidos: 58, 67 y 49 caramelos. ¿Cuántos caramelos son en total?',
      datos: [DO.bolsita(10), DO.columna],
      figura: cuaderno(['58', '67', '49']),
      solucion: [
        { texto: 'Sueltos: 8 + 7 + 9 = 24. Llenan 2 bolsitas y sobran 4: esta vez la llevada es 2.', ecuacion: ['8 + 7 + 9 = 24 = ', lleva(2), ' × ', bas(10), ' + ', res(4)] },
        { texto: 'Bolsitas: 5 + 6 + 4, más las 2 que suben. Llenan 1 caja y sobran 7.', ecuacion: ['5 + 6 + 4 + ', lleva(2), ' = 17 = ', lleva(1), ' × ', bas(10), ' + ', res(7)] },
        { texto: 'La caja abre la columna de las cajas.', ecuacion: ['58 + 67 + 49 = ', res(174)] },
      ],
      respuesta: [res(174), ' caramelos'] },
    { nivel: 2, titulo: 'Una suma en base 4',
      enunciado: ['¿Cuánto es ', sumN('123', 4), ' + ', sumN('213', 4), '?'],
      datos: [DO.base(4), DO.columna],
      figura: cuaderno(['123', '213'], { base: '4' }),
      solucion: [
        { texto: 'Sueltos: 3 + 3 = 6. Se anota 2 y se lleva 1.', ecuacion: ['3 + 3 = 6 = ', lleva(1), ' × ', bas(4), ' + ', res(2)] },
        { texto: 'Bolsitas: 2 + 1 más la que llega = 4. Se anota 0 y se lleva 1.', ecuacion: ['2 + 1 + ', lleva(1), ' = 4 = ', lleva(1), ' × ', bas(4), ' + ', res(0)] },
        { texto: 'Cajas: 1 + 2 más la que llega = 4. Se anota 0, y la llevada abre otra columna.', ecuacion: ['1 + 2 + ', lleva(1), ' = 4 = ', lleva(1), ' × ', bas(4), ' + ', res(0)] },
      ],
      respuesta: [sumN('123', 4), ' + ', sumN('213', 4), ' = ', resN('1002', 4)] },
    { nivel: 2, titulo: 'Comprobar en base 10',
      enunciado: ['Suma ', sumN('45', 7), ' + ', sumN('36', 7), ' y comprueba el total pasando todo a base 10.'],
      datos: [DO.base(7), DO.f2(7), DO.f3(7)],
      figura: cuaderno(['45', '36'], { base: '7' }),
      solucion: [
        { texto: 'Sueltos: 5 + 6 = 11. Se anota 4 y se lleva 1.', ecuacion: ['5 + 6 = 11 = ', lleva(1), ' × ', bas(7), ' + ', res(4)] },
        { texto: 'Bolsitas: 4 + 3 más la que llega = 8. Se anota 1 y se lleva 1, que abre otra columna.', ecuacion: ['4 + 3 + ', lleva(1), ' = 8 = ', lleva(1), ' × ', bas(7), ' + ', res(1)] },
        { texto: ['En base 10: los sumandos valen 4 × 7 + 5 = 33 y 3 × 7 + 6 = 27, que suman 60.'], ecuacion: [resN('114', 7), ' = 1 × 49 + 1 × 7 + 4 = ', res(60)] },
      ],
      respuesta: [resN('114', 7), ', que vale ', res(60)] },
    { nivel: 2, titulo: '¿Cuánto llega a las centenas?',
      enunciado: 'Doña Juana suma 386 + 475 + 299 en su cuaderno. ¿Cuánto lleva a la columna de las centenas?',
      datos: [DO.ordenes, DO.columna],
      figura: cuaderno(['386', '475', '299']),
      solucion: [
        { texto: 'Unidades: 6 + 5 + 9 = 20. Se anota 0 y se llevan 2.', ecuacion: ['6 + 5 + 9 = 20 = ', lleva(2), ' × ', bas(10), ' + ', res(0)] },
        { texto: 'Decenas: 8 + 7 + 9, más las 2 que llegan, da 26. Se anota 6 y se llevan 2.', ecuacion: ['8 + 7 + 9 + ', lleva(2), ' = 26 = ', lleva(2), ' × ', bas(10), ' + ', res(6)] },
      ],
      respuesta: ['Lleva ', lleva(2), ' a las centenas'] },
    { nivel: 3, titulo: 'La base que hace cuadrar',
      enunciado: ['En cierta base ', bas('n') , ' se cumple ', sumN('35', 'n'), ' + ', sumN('24', 'n'), ' = ', resN('62', 'n'), '. ¿Cuál es ', bas('n'), '?'],
      alternativas: ['6', '7', '8', '9'],
      datos: [DO.columna, DO.cifras],
      figura: cuaderno(['35', '24'], { base: 'n', resultado: '62' }),
      solucion: [
        { texto: 'Sueltos: 5 + 4 = 9, pero se anota 2: subió una bolsita de n y sobraron 2.', ecuacion: ['9 = ', lleva(1), ' × ', bas('n'), ' + ', res(2), '   →   ', bas('n'), ' = ', bas(7)] },
        { texto: 'Compruebo la otra columna: 3 + 2 más la que llega da 6, menos que 7. Se anota 6, como dice la cuenta.', ecuacion: ['3 + 2 + ', lleva(1), ' = ', res(6)] },
        { texto: ['Con 6 no sirve: 9 = 1 × 6 + 3 y se anotaría 3. Con 8 o con 9 se anotaría 1 o 0.'] },
      ],
      respuesta: [letra('B', 'envase'), ': ', bas('n'), ' = ', bas(7)] },
    { nivel: 3, titulo: 'Tres sumandos en base 6',
      enunciado: ['¿Cuánto es ', sumN('245', 6), ' + ', sumN('354', 6), ' + ', sumN('155', 6), '?'],
      alternativas: [[sumN('754', 6)], [sumN('1132', 6)], [sumN('242', 6)], [sumN('1242', 6)]],
      datos: [DO.base(6), DO.columna],
      figura: cuaderno(['245', '354', '155'], { base: '6' }),
      solucion: [
        { texto: 'Sueltos: 5 + 4 + 5 = 14. Se anota 2 y se llevan 2.', ecuacion: ['5 + 4 + 5 = 14 = ', lleva(2), ' × ', bas(6), ' + ', res(2)] },
        { texto: 'Bolsitas: 4 + 5 + 5 más las 2 que llegan = 16. Se anota 4 y se llevan 2.', ecuacion: ['4 + 5 + 5 + ', lleva(2), ' = 16 = ', lleva(2), ' × ', bas(6), ' + ', res(4)] },
        { texto: 'Cajas: 2 + 3 + 1 más las 2 = 8. Se anota 2 y se lleva 1, que abre otra columna.', ecuacion: ['2 + 3 + 1 + ', lleva(2), ' = 8 = ', lleva(1), ' × ', bas(6), ' + ', res(2)] },
        { texto: ['Las trampas: ', letra('A'), ' suma en base 10; ', letra('B'), ' lleva 1 donde van 2; ', letra('C'), ' olvida la última llevada.'] },
      ],
      respuesta: [letra('D'), ': ', resN('1242', 6)] },
    { nivel: 3, titulo: 'Las cifras del total',
      enunciado: ['Si ', sumN('777', 8), ' + ', sumN('777', 8), ' + ', sumN('777', 8), ' = ', { sub: [{ raya: [res('abcd')] }, bas('(8)')] }, ', ¿cuánto vale a + b + c + d?'],
      alternativas: ['18', '21', '19', '9'],
      datos: [DO.base(8), DO.columna, [{ raya: ['abcd'] }, ': numeral de cifras a, b, c y d']],
      figura: cuaderno(['777', '777', '777'], { base: '8' }),
      solucion: [
        { texto: 'Sueltos: 7 + 7 + 7 = 21. Se anota 5 y se llevan 2.', ecuacion: ['21 = ', lleva(2), ' × ', bas(8), ' + ', res(5)] },
        { texto: 'Las otras dos columnas reciben esas 2: 21 + 2 = 23. Se anota 7 y se llevan 2.', ecuacion: ['21 + ', lleva(2), ' = 23 = ', lleva(2), ' × ', bas(8), ' + ', res(7)] },
        { texto: ['La última llevada, 2, abre otra columna: el total es ', resN('2775', 8), '.'], ecuacion: ['2 + 7 + 7 + 5 = ', res(21)] },
        { texto: ['Las trampas: ', letra('A'), ' lleva 1 donde van 2; ', letra('C'), ' olvida la última llevada; ', letra('D'), ' suma en base 10.'] },
      ],
      respuesta: [letra('B'), ': ', res(21)] },
    { nivel: 3, titulo: 'La mayor llevada',
      enunciado: 'Doña Juana suma cuatro números de dos cifras. ¿Cuál es la mayor llevada que puede pasar de la columna de las unidades a la de las decenas?',
      alternativas: ['1', '2', '3', '4'],
      datos: [DO.columna, 'La mayor cifra en base 10 es 9'],
      figura: cuaderno(['??', '??', '??', '??'], { foco: 0 }),
      solucion: [
        { texto: 'La columna de las unidades junta cuatro cifras. Lo más que puede juntar es 9 + 9 + 9 + 9 = 36.' },
        { texto: 'Con 36 se llenan 3 bolsitas de 10 y sobran 6. Para llevar 4 harían falta 40, y no alcanza.', ecuacion: ['36 = ', lleva(3), ' × ', bas(10), ' + ', res(6)] },
      ],
      respuesta: [letra('C', 'muda'), ': ', lleva(3)] },
    { nivel: 3, titulo: 'Llevadas en cadena',
      enunciado: '¿En cuántas columnas se lleva algo al sumar 4999 + 5001?',
      alternativas: ['1', '3', '4', '5'],
      datos: [DO.todo(10)],
      figura: cuaderno(['4999', '5001']),
      solucion: [
        { texto: 'Unidades: 9 + 1 = 10. Se anota 0 y se lleva 1.', ecuacion: ['9 + 1 = 10 = ', lleva(1), ' × ', bas(10), ' + ', res(0)] },
        { texto: 'Decenas y centenas: 9 + 0 más la que llega da 10 en cada una. Otra vez 0, y se lleva 1.', ecuacion: ['9 + 0 + ', lleva(1), ' = 10 = ', lleva(1), ' × ', bas(10), ' + ', res(0)] },
        { texto: 'Millares: 4 + 5 más la que llega da 10. La última llevada abre otra columna.', ecuacion: ['4999 + 5001 = ', res('10 000')] },
        { texto: ['Las cuatro columnas llevaron 1. ', letra('A'), ' solo mira las unidades; ', letra('B'), ' olvida la última; ', letra('D'), ' cuenta las cifras del total.'] },
      ],
      respuesta: [letra('C'), ': ', res(4), ' columnas'] },
  ];

  const otrasBases = {
    id: 'otras-bases',
    titulo: 'La llevada llena una bolsita',
    pregunta: '¿Por qué se lleva 1 cuando una columna pasa de 9?',
    temas: ['Adición con llevadas', 'Operaciones en otras bases'],
    pieza: PU,
    aprendizaje: 'Por columnas, cada 10 de una columna (n en base n) forman 1 de la siguiente: eso es llevar; se anota lo que sobra.',
    actividad: 'Juntar dos pedidos y empacar de 10 en 10 hasta poder anotar el total.',
    // Lee: el puesto en base 10, los sumandos y el cuaderno, y qué mirar. No dice qué pasa en otra base ni con una
    // segunda llevada (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'El puesto en base 10', texto: ['Doña Juana ahora empaca de ', bas(10), ' en ', bas(10), ': 10 sueltos llenan una bolsita y 10 bolsitas, una caja. Es la base 10, la de todos los días: 26 caramelos son 2 bolsitas y 6 sueltos.'],
          pieza: PU, dibujo: { datos: { n: 10, bolsitas: 2, sueltos: 6, regla: 2, rotulos: true, colorCifras: false }, estado: {} } },
        { titulo: 'Sumar es juntar', texto: 'Si le llegan dos pedidos, los junta: suma. Cada pedido es uno de los sumandos. En su cuaderno los escribe uno debajo del otro, sueltos bajo sueltos y bolsitas bajo bolsitas, y suma cada columna.',
          pieza: PU, dibujo: { datos: { n: 10, bolsitas: 3, sueltos: 9, ceros: true, regla: 1, rotulos: { bolsitas: '2 + 1 bolsitas', sueltos: '6 + 3 sueltos' }, cuenta: { sumandos: ['26', '13'], resultado: '39' } }, estado: {} } },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a juntar dos pedidos. Mira la columna de los sueltos: si junta 10 o más, toca el montón y doña Juana llena una bolsita. Fíjate a qué columna se va esa bolsita.' },
      ],
    },
    ejemplos: EJEMPLOS_LLEVADA,
    juega: {
      pieza: PU,
      consigna: 'A doña Juana le llegaron dos pedidos y los junta en el mostrador. Empaca de 10 en 10 y anota la cuenta en su cuaderno.',
      mision: {
        texto: 'Junta los pedidos de 47 y 38, y empaca hasta poder anotar el total.',
        logrado: v => [v.p1, v.p2].sort((x, y) => x - y).join() === '38,47' && manoJ(v).m.listo,
        bien: '15 sueltos llenaron una bolsita que subió: 4 + 3 + 1 = 8 bolsitas y 5 sueltos.',
      },
      voz: 'Toca el montón de sueltos cuando alcance para una bolsita.',
      leyenda: [
        { s: bas('10'), t: 'caramelos por bolsita: la base' },
        { s: lleva('1'), t: 'la llevada: la bolsita llena que sube' },
        { s: res('cifra'), t: 'lo que se anota en el cuaderno' },
        { s: '?', t: 'lo que todavía no se puede anotar' },
      ],
      controles: [
        { id: 'p1', etiqueta: 'Pedido de la mañana', min: 11, max: 49, paso: 1, inicio: 26, decimales: 0 },
        { id: 'p2', etiqueta: 'Pedido de la tarde', min: 11, max: 49, paso: 1, inicio: 15, decimales: 0 },
        { id: 'ju', etiqueta: 'Sueltos', opciones: [{ valor: 0, texto: 'Sin juntar' }, { valor: 1, texto: 'Juntar 10 en una bolsita' }] },
      ],
      dibujo: v => ({ datos: puestoJ(v, escalaJ()), estado: {} }),
      // La relación: lo que junta la columna de los sueltos, y qué pasa con 10 de ellos.
      lectura: v => {
        const { m, lleno, junto } = manoJ(v), us = uni(v.p1) + uni(v.p2);
        if (!lleno) return [`${uni(v.p1)} + ${uni(v.p2)} = `, res(us), ' sueltos: no llenan una bolsita'];
        if (!junto) return [`${uni(v.p1)} + ${uni(v.p2)} = ${us} sueltos: alcanzan para `, lleva(1), ' bolsita'];
        return [`${us} sueltos = `, lleva(1), ' bolsita + ', res(us - 10), `; ahora hay ${m.cuentas[1]} bolsitas`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['En otro puesto, doña Juana usa bolsitas de ', bas(5), ' y cajas de ', bas(5), ' bolsitas. Junta un pedido de ', sumN('34', 5), ' y otro de ', sumN('23', 5), '. ¿Qué total anota en su cuaderno?'],
      datos: [DO.bolsita(5), DO.caja(5)],
      voz: 'Piensa qué hace doña Juana cuando una columna se llena.',
      opciones: [
        { id: 'c', texto: [resN('112', 5)], correcta: true },
        { id: 'decimal', texto: [resN('57', 5)], error: 'AT-DECIMAL', siFuera: 'Sumar por columnas está bien. Pero así se lleva al llegar a 10; aquí 5 sueltos ya llenan una bolsita.' },
        { id: 'diez', texto: [resN('102', 5)], error: 'AT-LLEVA-OLVIDA', siFuera: 'Bien: los 7 sueltos llenan una bolsita y sobran 2. Pero esa bolsita se suma a las otras 3 + 2.' },
        { id: 'sin-lleva', texto: [resN('12', 5)], error: 'AT-LLEVA-FINAL', siFuera: 'Las dos columnas están bien hechas. Pero la caja que se llenó también se anota: abre otra columna.' },
      ],
      dibujo: fig(Object.assign({}, P5, { bolsitas: 5, sueltos: 7, rotulos: ROT5, cuenta: CU5() })),
      revelar: fig(Object.assign({}, P5, { cajas: 1, bolsitas: 1, sueltos: 2, llevada: { cajas: 1 }, rotulos: ROT5c, cuenta: CU5({ llevadas: { 1: 1, 2: 1 }, resultado: '112' }) })),
      coincide: 'Coincide: 7 sueltos dan 1 bolsita y sobran 2; 6 bolsitas dan 1 caja y sobra 1.',
      noCoincide: 'Revisemos: con 5 sueltos ya se llena una bolsita, y con 5 bolsitas, una caja.',
    },
    mira: {
      pieza: PU,
      datos: MIRA5,
      voz: 'Columna por columna, desde los sueltos.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Junto los dos pedidos: 3 + 2 bolsitas y 4 + 3 sueltos.', ecuacion: [sumN('34', 5), ' + ', sumN('23', 5)] },
        { estado: { paso: 1 }, texto: 'Sueltos: 4 + 3 = 7. Con 5 se llena una bolsita y sobran 2.', ecuacion: ['4 + 3 = 7 = ', lleva(1), ' × ', bas(5), ' + ', res(2)] },
        { estado: { paso: 2 }, texto: 'La bolsita sube a la otra columna: es la llevada. Se anota 2.', ecuacion: ['sube ', lleva(1), ', se anota ', res(2)] },
        { estado: { paso: 3 }, texto: 'Bolsitas: 3 + 2 + 1 = 6. Con 5 se llena una caja y sobra 1.', ecuacion: ['3 + 2 + ', lleva(1), ' = 6 = ', lleva(1), ' × ', bas(5), ' + ', res(1)] },
        { estado: { paso: 4 }, texto: ['La caja sube y abre una columna nueva: el total es ', resN('112', 5), '.'], ecuacion: [sumN('34', 5), ' + ', sumN('23', 5), ' = ', resN('112', 5)] },
        { estado: { paso: 5 }, texto: ['En base 10 cuadra: 19 + 13 = 32, y ', resN('112', 5), ' vale 25 + 5 + 2.'], ecuacion: [resN('112', 5), ' = 1 × 25 + 1 × ', bas(5), ' + 2 = ', res(32)] },
      ],
    },
    regla: {
      texto: 'Se suma por columnas, desde las unidades. Cada 10 de una columna forman 1 de la siguiente: se lleva y se anota lo que sobra. En base n, cada n.',
      // Cada relación en su línea y corta, para que quepa a 360 px: la suma de una columna se parte en lo que sube y lo
      // que se anota; lo que se anota es una cifra de la base.
      // (L y c, dichas en las llaves: lo que se lleva y la cifra que se anota.)
      ecuacion: ['columna = ', { llave: [lleva('L'), ' × ', bas('n')], nota: 'L: se lleva', color: 'c-o' }, ' + ', { llave: [res('c')], nota: 'c: se anota', color: 'c-f' }, SEP, '0 ≤ ', res('c'), ' ≤ ', bas('n'), ' − 1'],
      condicion: 'Con varios sumandos se puede llevar 2 o más. La última llevada también se anota: abre una columna nueva.',
      voz: 'Lo que llena un envase sube; lo que sobra se anota.',
    },
    // Así se resuelve: juntar dos pedidos de otro puesto (dos sumandos de tres cifras en base n, con dos llevadas o más),
    // columna por columna, y comprobar en base 10. «Ahora tú» pide otra cosa: cuánto se lleva, tres sumandos, la base
    // que hace cuadrar, una cifra del total o cuántas llevadas hay.
    resuelve: {
      pieza: PU,
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const n = r.de([3, 4, 6, 7, 8, 9]), A = numeralAzar(r, 3, n), B = numeralAzar(r, 3, n), C = MCO.sumaColumnas([A, B], n);
          if (C.llevadas < 2) continue;
          const uso = C.columnas.slice(0, 3);                // las tres columnas de los sumandos
          const extra = C.texto.length > 3;                  // la última llevada abre otra columna
          const paso = (c, k) => {
            const ll = Object.fromEntries(C.columnas.slice(0, k + 1).filter(x => x.llevadaSale).map(x => [x.orden + 1, x.llevadaSale]));
            const parcial = C.texto.slice(C.texto.length - k - 1);
            const ultimo = k === uso.length - 1;
            return { tipo: 'cuentas',
              texto: `${NOMBRE_COL[k]}: ${c.entran.join(' + ')}${c.llevadaEntra ? ` más ${c.llevadaEntra === 1 ? 'la que llega' : `las ${c.llevadaEntra} que llegan`}` : ''} = ${c.total}. Se anota ${c.cifra}${c.llevadaSale ? ` y se lleva ${c.llevadaSale}` : ''}.${ultimo && extra ? ' La llevada abre otra columna.' : ''}`,
              ecuacion: ecColumna(c, n),
              dibujo: cuaderno([A, B], { base: String(n), foco: k, llevadas: ll, resultado: ultimo && extra ? C.texto : parcial }) };
          };
          const T = C.texto, vA = valor(A, n), vB = valor(B, n);
          return {
            enunciado: ['En el puesto de bolsitas de ', bas(n), ', doña Juana junta un pedido de ', sumN(A, n), ' y otro de ', sumN(B, n), '. ¿Qué total anota en su cuaderno?'],
            datos: [DO.base(n), DO.f3(n)],
            dibujo: cuaderno([A, B], { base: String(n) }),
            pasos: [
              { tipo: 'pide', texto: ['Piden el total, escrito en base ', bas(n), ': lo que queda cuando ninguna columna llega a ', bas(n), '.'] },
              { tipo: 'regla', texto: ['Sumo por columnas, desde los sueltos. Cada ', bas(n), ' de una columna forman 1 de la siguiente: se lleva y se anota lo que sobra.'] },
              ...uso.map(paso),
              { tipo: 'sentido', texto: `Compruebo en base 10: los pedidos valen ${vA} y ${vB}, que suman ${vA + vB}; el total también.`,
                ecuacion: [resN(T, n), ` = ${poli(T, n)} = `, res(valor(T, n))] },
            ],
            respuesta: ['Anota ', resN(T, n)],
          };
        }
      },
    },
    ahoraTu: {
      pieza: PU,
      voz: 'Columna por columna: lo que llena un envase sube.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 5;
        if (tipo === 0) return conCuatro(q => casoCuantoLleva(q, 3 + (Math.floor(sem / 5) % 2)), r);
        if (tipo === 1) return conCuatro(casoTres, r);
        if (tipo === 2) return conCuatro(casoBaseOculta, r);
        if (tipo === 3) return conCuatro(casoCentenas, r);
        return conCuatro(casoLlevadas, r);
      },
    },
  };

  // Mesa del laboratorio de la idea 1: cualquier suma de dos pedidos, en la base que elijas (de 6 a 10; la base 5 es de
  // la predicción). Se llama `juego-otras-bases`, como se llamaba el juego viejo en el laboratorio, para que los casos
  // guardados con su control `b` sigan abriendo. Las llevadas las cuenta el motor de la escena (sumaColumnas).
  const sumaLab = v => MCO.sumaColumnas([enBase(v.x, v.b), enBase(v.y, v.b)], v.b);
  const mesaBases = {
    id: 'juego-otras-bases', titulo: 'Sumar en cualquier base', pieza: PU,
    consigna: 'Dos pedidos de caramelos y el tamaño de la bolsita. El cuaderno los suma en esa base, con sus llevadas.',
    controles: [
      { id: 'b', etiqueta: 'Caramelos por bolsita, n', color: 'c-i', min: 6, max: 10, paso: 1, inicio: 6, decimales: 0 },
      { id: 'x', etiqueta: 'Primer pedido (caramelos)', min: 6, max: 99, paso: 1, inicio: 16, decimales: 0 },
      { id: 'y', etiqueta: 'Segundo pedido (caramelos)', min: 6, max: 99, paso: 1, inicio: 15, decimales: 0 },
    ],
    dibujo: v => {
      const C = sumaLab(v), ll = Object.fromEntries(C.columnas.filter(c => c.llevadaSale).map(c => [c.orden + 1, c.llevadaSale]));
      return { datos: { cuenta: { solo: true, sumandos: [enBase(v.x, v.b), enBase(v.y, v.b)], base: v.b === 10 ? '' : String(v.b), llevadas: ll, resultado: C.texto } }, estado: {} };
    },
    lectura: v => [`${v.x} + ${v.y} = `, res(v.x + v.y), ` caramelos; ${sumaLab(v).llevadas} llevadas en base `, bas(v.b)],
    invitaciones: [
      { texto: 'Haz que la suma no lleve nada en ninguna columna.',
        logrado: v => sumaLab(v).llevadas === 0,
        bien: 'Ninguna columna llegó a la base: cada suma se anota tal cual.' },
      { texto: 'Consigue una suma con dos llevadas.',
        logrado: v => sumaLab(v).llevadas === 2,
        bien: 'Dos columnas llenaron un envase: dos llevadas.' },
      { texto: 'Haz que el total tenga una cifra más que los dos pedidos.',
        logrado: v => { const C = sumaLab(v); return C.texto.length > Math.max(...C.sumandos.map(x => x.length)); },
        bien: 'La última llevada abrió una columna nueva.' },
      { texto: 'Guarda dos casos con los mismos pedidos y distinta cantidad de llevadas.',
        logrado: (v, guardados) => guardados.some(g => g.x === v.x && g.y === v.y && g.b !== v.b && sumaLab(g).llevadas !== sumaLab(v).llevadas),
        bien: 'Los mismos caramelos: con otra bolsita, las columnas se llenan distinto.' },
    ],
  };

  // Escalas fijas de «Mira» (el pedido no cambia de tamaño entre pasos; cuatro-operaciones.test.js comprueba que cada
  // paso quepa con ella).
  const ESC_M5 = 0.84, ESC_D6 = 1.2;

  // Cifras de un numeral, desde las unidades: '432' → [2, 3, 4].
  const digitos = x => String(x).split('').reverse().map(Number);
  // Datos que se repiten en las ideas 2 a 7 (punto 13: herramientas, no el paso hecho).
  const DR = {
    abrir: n => ['Abrir 1 de una columna da ', bas(n), ' de la columna de su derecha'],
    resta: ['cifra = arriba + ', lleva('p'), ' × ', bas('n'), ' − abajo, con ', lleva('p'), ' = 1 si se abrió un envase'],
    prueba: 'minuendo = sustraendo + diferencia',
    ca: ['CA(N) = ', { sup: [bas('10'), 'k'] }, ' − N, con k las cifras de N'],
    caBase: ['En base n: CA(N) = ', { sup: [bas('n'), 'k'] }, ' − N, con k las cifras de N'],
    mancha: 'Bajo cada mancha ☐ hay una cifra de 0 a 9',
    bien: 'La cuenta del cuaderno está bien hecha',
    abc: [{ raya: ['abc'] }, ' = 100 × a + 10 × b + c'],
    reverso: [{ raya: ['cba'] }, ' es el reverso de ', { raya: ['abc'] }, ': las mismas cifras al revés'],
    distrib: '(F + s) × G = F × G + s × G',
    div: ['D = ', D_, ' × q + ', R_, ', con 0 ≤ ', R_, ' < ', D_],
    exceso: ['D = ', D_, ' × (q + 1) − ', RE],
    cifrasK: ['Un número de k cifras va de ', { sup: ['10', 'k − 1'] }, ' a ', { sup: ['10', 'k'] }, ' − 1'],
  };

  // ---------- Idea 2: abrir una bolsita para restar (sustracción y préstamos) ----------
  // Propuesta §1 a §7 (aprobada). Objeto: el puesto en base 10, con el cuaderno; doña Juana despacha un pedido.
  // Cambia: el pedido y qué envases se abren. · Permanece: la regla del puesto (10 sueltos = 1 bolsita) y la escala. ·
  // Progresa: una columna que no alcanza → se abre 1 de la izquierda → esa columna queda con uno menos → se anota. · Se
  // reserva: el 0 que presta (préstamos en cadena): es de la predicción (5 003 − 1 478). · Debe verse: abrir una bolsita
  // da 10 sueltos y deja una bolsita menos; lo que hay no cambia.
  // El juego no tiene ceros en lo que hay (432, 312, 213, 321 o 231 caramelos): nunca un 0 que preste. Las cifras son
  // chicas y el pedido va de 100 a 199 (la propuesta decía hasta 399) para que, con una caja abierta, las 12 bolsitas
  // quepan junto al cuaderno a una escala legible (0,51).
  // Errores (hipótesis de aula; la trampa 29 de San Marcos, 2024-I, respalda AT-SIN-DESCONTAR): AT-MENOR-MAYOR resta en
  // cada columna el menor del mayor · AT-SIN-DESCONTAR presta sin quitarle 1 a la columna que prestó · AT-CERO-DIEZ los
  // ceros que prestan quedan en 10 (en n), no en 9 · AT-DECIMAL resta como en base 10 · AT-PRESTA-COLUMNAS cuenta solo las
  // columnas que no alcanzan, sin los ceros que también abren · AT-PRESTA-CEROS cuenta los ceros · AT-DOBLE-DESCUENTO le
  // quita 1 de más a la columna que prestó · AT-RESTA-TOTAL, AT-RESTA-TERCIO y AT-RESTA-CUARTO toman mal el minuendo
  // desde la suma de los tres términos.
  const NOMBRE_R = ['sueltos', 'bolsitas', 'cajas', 'cajones'];
  const MINUENDOS = [432, 312, 213, 321, 231];
  // El estado del juego, del motor de la escena (regla 1): lo que hay, abriendo una caja y una bolsita si se pidió.
  const manoR = v => {
    let m = MCO.aMano('resta', String(v.M), String(v.S), 10);
    if (v.oc) m = MCO.abrirMano(m, 2);
    if (v.ob) m = MCO.abrirMano(m, 1);
    return m;
  };
  const prestaDe = (orig, cuentas) => { const p = {}; cuentas.forEach((x, k) => { if (x !== orig[k]) p[k] = String(x); }); return p; };
  const puestoR = (v, escala) => {
    const m = manoR(v), [s, b, c] = m.cuentas, o = digitos(v.M);
    // Lo que tiene cada columna; si cambió por un préstamo, el número en naranja (como en el cuaderno).
    const rot = (k, tipo) => { const x = m.cuentas[k], t = ` ${x === 1 ? tipo.replace(/s$/, '') : tipo}`; return x !== o[k] ? [[String(x), 'o', 700], [t]] : `${x}${t}`; };
    return { n: 10, cajas: c, bolsitas: b, sueltos: s, ceros: true, regla: 2, escala, colorCifras: false,
      rotulos: { cajas: rot(2, 'cajas'), bolsitas: rot(1, 'bolsitas'), sueltos: rot(0, 'sueltos') },
      toque: [{ orden: 'bolsitas', control: 'ob', titulo: v.ob ? 'Tocar para volver a cerrar la bolsita' : 'Tocar para abrir una bolsita' },
        { orden: 'cajas', control: 'oc', titulo: v.oc ? 'Tocar para volver a cerrar la caja' : 'Tocar para abrir una caja' }],
      cuenta: { sumandos: [String(v.M), String(v.S)], op: '−', presta: prestaDe(o, m.cuentas), resultado: m.listo ? m.texto : '?' } };
  };
  const CTRL_R = [
    { id: 'M', etiqueta: 'Caramelos que tiene', opciones: MINUENDOS.map(x => ({ valor: x, texto: String(x) })), inicio: 321 },
    { id: 'S', etiqueta: 'Caramelos que despacha', min: 100, max: 199, paso: 1, inicio: 145, decimales: 0 },
    { id: 'ob', etiqueta: 'Una bolsita', opciones: [{ valor: 0, texto: 'Cerrada' }, { valor: 1, texto: 'Abrirla en 10 sueltos' }] },
    { id: 'oc', etiqueta: 'Una caja', opciones: [{ valor: 0, texto: 'Cerrada' }, { valor: 1, texto: 'Abrirla en 10 bolsitas' }] },
  ];
  // La escala del juego: la que hace caber el caso más ancho de la grilla (no salta al mover un control).
  const escalaDe = (ctr, datosDe) => { let mn = 1.7; for (const v of grillaSimple(ctr)) mn = Math.min(mn, PUESTO().geometria(datosDe(v)).sCabe); return Math.floor(mn * 100) / 100; };
  function grillaSimple(ctr) {
    let casos = [{}];
    for (const c of ctr) {
      const vs = c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => c.min + k * c.paso);
      casos = casos.flatMap(v => vs.map(x => Object.assign({}, v, { [c.id]: x })));
    }
    return casos;
  }
  let escR = null;
  const escalaR = () => escR || (escR = escalaDe(CTRL_R, v => puestoR(v)));
  // Predice, «Mira» y la regla: 5 003 − 1 478 en el cuaderno, solo y grande (con el pedido al lado no se leía: 5
  // cajones, 10 cajas y 10 bolsitas no caben a una escala legible junto al cuaderno). El pedido que se abre ya lo vio el
  // alumno en el juego; aquí el texto dice qué envase se abre en cada paso.
  const CU2 = o => ({ cuenta: Object.assign({ solo: true, sumandos: ['5003', '1478'], op: '−', resultado: '?' }, o) });
  const PASOS2 = [
    CU2(), CU2({ foco: 0 }), CU2({ presta: { 3: '4', 2: '10' } }), CU2({ presta: { 3: '4', 2: '9', 1: '10' } }),
    CU2({ presta: { 3: '4', 2: '9', 1: '9', 0: '13' }, foco: 0 }), CU2({ presta: { 3: '4', 2: '9', 1: '9', 0: '13' }, resultado: '3525' }),
    CU2({ presta: { 3: '4', 2: '9', 1: '9', 0: '13' }, resultado: '3525', foco: 2 }),
  ];
  const fig2 = k => fig(PASOS2[k]);

  // Ahora tú · las restas, con las cuentas del motor de la escena (restaColumnas: el resultado y lo que da cada error).
  // Un minuendo de 4 cifras con dos ceros o más (los préstamos en cadena) y un sustraendo menor.
  function restaConCeros(r) {
    const M = r.de([`${r.ent(2, 9)}00${r.ent(1, 9)}`, `${r.ent(2, 9)}0${r.ent(1, 9)}0`, `${r.ent(2, 9)}000`, `${r.ent(1, 9)}${r.ent(1, 9)}00`]);
    const S = String(r.ent(1000, +M - 100));
    return { M, S, R: MCO.restaColumnas(M, S, 10) };
  }
  function casoRestaCeros(r) {
    const { M, S, R } = restaConCeros(r), e = R.errores;
    if (R.prestamos.every(p => p.desde === p.para + 1)) return null;
    return {
      pregunta: `Doña Juana tiene ${f(+M, 0)} caramelos y despacha ${f(+S, 0)}. ¿Cuántos le quedan?`,
      datos: [['1 bolsita = ', bas(10), ' caramelos; 1 caja = ', bas(10), ' bolsitas; 1 cajón = ', bas(10), ' cajas'], DR.resta],
      dibujo: cuaderno([M, S], { op: '−' }),
      opciones: opciones(+R.texto, [
        { id: 'menor', valor: e.menorDelMayor === undefined ? null : +e.menorDelMayor, error: 'AT-MENOR-MAYOR', siFuera: 'Restar por columnas está bien. Pero arriba menos abajo: si no alcanza, se abre un envase, no se da vuelta.' },
        { id: 'sin', valor: e.sinDescontar === undefined ? null : +e.sinDescontar, error: 'AT-SIN-DESCONTAR', siFuera: 'Abrir un envase está bien. Pero la columna que prestó queda con uno menos.' },
        { id: 'ceros', valor: e.cerosComoB === undefined ? null : +e.cerosComoB, error: 'AT-CERO-DIEZ', siFuera: 'La cadena de préstamos está bien. Pero un 0 que presta recibe 10 y da 1: queda en 9.' },
      ], x => f(x, 0)),
      solucion: { texto: 'Se abre el primer envase que hay a la izquierda; los ceros del camino quedan en 9.', ecuacion: [`${f(+M, 0)} − ${f(+S, 0)} = `, res(f(+R.texto, 0))] },
    };
  }
  // En base n (nivel examen): un minuendo de 4 cifras con un 0.
  function casoRestaBase(r) {
    const n = r.ent(4, 9), M = `${r.ent(1, n - 1)}0${r.ent(0, n - 1)}${r.ent(0, n - 2)}`;
    const vM = valor(M, n), vS = r.ent(n * n, vM - 1), S = enBase(vS, n);
    if (S.length < 3) return null;
    const R = MCO.restaColumnas(M, S, n), e = R.errores;
    if (!R.prestamos.length) return null;
    const op = t => [resN(t, n)];
    return {
      pregunta: ['¿Cuánto es ', sumN(M, n), ' − ', sumN(S, n), '?'],
      datos: [DR.abrir(n), DR.resta],
      dibujo: cuaderno([M, S], { op: '−', base: String(n) }),
      opciones: opcionesNum(op(R.texto), [
        { id: 'decimal', texto: e.comoDecimal === undefined ? [] : op(e.comoDecimal), error: 'AT-DECIMAL', siFuera: `Restar por columnas está bien. Pero así se resta en base 10; en base ${n} un envase abierto da ${n}.` },
        { id: 'sin', texto: e.sinDescontar === undefined ? [] : op(e.sinDescontar), error: 'AT-SIN-DESCONTAR', siFuera: 'Abrir un envase está bien. Pero la columna que prestó queda con uno menos.' },
        { id: 'ceros', texto: e.cerosComoB === undefined ? [] : op(e.cerosComoB), error: 'AT-CERO-DIEZ', siFuera: `La cadena está bien. Pero un 0 que presta queda en ${n - 1}, no en ${n}.` },
        { id: 'menor', texto: e.menorDelMayor === undefined ? [] : op(e.menorDelMayor), error: 'AT-MENOR-MAYOR', siFuera: 'Restar por columnas está bien. Pero arriba menos abajo: si no alcanza, se abre un envase.' },
      ].filter(x => x.texto.length)),
      solucion: { texto: `Por columnas; cada envase abierto da ${n} a la columna de su derecha.`, ecuacion: [sumN(M, n), ' − ', sumN(S, n), ' = ', resN(R.texto, n)] },
    };
  }
  // ¿Cuántas veces se abre un envase? (los ceros del camino también se abren).
  function casoAperturas(r) {
    const { M, S, R } = restaConCeros(r);
    const abiertos = R.acciones.filter(x => x.tipo === 'abrir').length, columnas = R.prestamos.length, ceros = digitos(M).filter(x => x === 0).length;
    if (new Set([abiertos, columnas, ceros, abiertos + 1]).size < 4) return null;
    const veces = x => (x === 1 ? '1 vez' : `${x} veces`);
    return {
      pregunta: `Para despachar ${f(+S, 0)} de sus ${f(+M, 0)} caramelos, ¿cuántas veces abre doña Juana un envase (bolsita, caja o cajón)?`,
      datos: [['Abrir 1 envase da ', bas(10), ' del envase más chico'], 'Un envase vacío no se puede abrir'],
      dibujo: cuaderno([M, S], { op: '−' }),
      opciones: opciones(abiertos, [
        { id: 'columnas', valor: columnas, error: 'AT-PRESTA-COLUMNAS', siFuera: 'Ver qué columnas no alcanzan está bien. Pero si al lado hay un 0, se abre también lo siguiente.' },
        { id: 'ceros', valor: ceros, error: 'AT-PRESTA-CEROS', siFuera: 'Mirar los ceros está bien. Pero se cuenta cada envase que se abre, no cada 0.' },
        { id: 'mas', valor: abiertos + 1, error: 'AT-DOBLE-DESCUENTO', siFuera: 'Contar la cadena está bien. Pero cada envase se abre una sola vez.' },
      ], veces),
      solucion: { texto: `Cada columna que no alcanza abre el de su izquierda; un 0 obliga a ir más allá: ${veces(abiertos)}.`, ecuacion: [`${f(+M, 0)} − ${f(+S, 0)} = `, res(f(+R.texto, 0))] },
    };
  }
  // La cifra de una columna con préstamos en cadena (nivel examen).
  function casoCifraColumna(r) {
    const { M, S, R } = restaConCeros(r), e = R.errores, k = r.ent(1, 2);
    const cif = t => (t === undefined ? null : +(String(t).padStart(4, '0')[3 - k]));
    const bien = cif(R.texto), doble = (bien + 9) % 10;
    const vals = [bien, cif(e.sinDescontar), cif(e.cerosComoB), cif(e.menorDelMayor), doble];
    if (vals.slice(1, 4).filter(x => x !== null && x !== bien).length < 2) return null;
    const nombre = ['unidades', 'decenas', 'centenas'][k];
    return {
      pregunta: `Al restar ${f(+M, 0)} − ${f(+S, 0)}, ¿qué cifra se anota en la columna de las ${nombre}?`,
      datos: [['1 bolsita = ', bas(10), ' caramelos; 1 caja = ', bas(10), ' bolsitas; 1 cajón = ', bas(10), ' cajas'], DR.resta],
      dibujo: cuaderno([M, S], { op: '−', foco: k }),
      opciones: opciones(bien, [
        { id: 'sin', valor: cif(e.sinDescontar), error: 'AT-SIN-DESCONTAR', siFuera: 'Abrir un envase está bien. Pero la columna que prestó queda con uno menos.' },
        { id: 'ceros', valor: cif(e.cerosComoB), error: 'AT-CERO-DIEZ', siFuera: 'La cadena está bien. Pero un 0 que presta queda en 9, no en 10.' },
        { id: 'menor', valor: cif(e.menorDelMayor), error: 'AT-MENOR-MAYOR', siFuera: 'Restar por columnas está bien. Pero arriba menos abajo: si no alcanza, se abre un envase.' },
        { id: 'doble', valor: doble, error: 'AT-DOBLE-DESCUENTO', siFuera: 'Descontar el préstamo está bien. Pero se descuenta una sola vez.' },
      ]),
      solucion: { texto: `Resto toda la cuenta desde las unidades y miro las ${nombre}.`, ecuacion: [`${f(+M, 0)} − ${f(+S, 0)} = `, res(f(+R.texto, 0))] },
    };
  }

  // Ejemplos resueltos de la idea 2. Cuentas rehechas aparte, sin este archivo (scratchpad de la sesión,
  // cuentas-ideas.js, que resta por columnas con su propio código y prueba cada error): 3 + 10 − 7 = 6; 87 − 35 = 52;
  // 62 − 27 = 35; 1 + 5 − 4 = 2; 452 − 128: las bolsitas quedan en 4; 623 − 357 = 266; 405 − 128 = 277; 312₍₆₎ −
  // 145₍₆₎ = 123₍₆₎ (116 − 65 = 51); 800 − 365 = 435 y 435 + 365 = 800; 3 002 − 1 245 = 1 757 con 3 envases abiertos;
  // 6 000 − 2 347 = 3 653 (trampas 4 347, 4 763, 3 763); 1003₍₇₎ − 256₍₇₎ = 414₍₇₎ (346 − 139 = 207; trampas 1253, 1524,
  // 524); 7 004 − 2 386 = 4 618, centenas 6 (trampas 3, 5, 7); minuendo + sustraendo + diferencia = 1 848 → minuendo 924;
  // 53₍ₙ₎ − 26₍ₙ₎ = 24₍ₙ₎ solo con n = 7. La figura muestra los datos (lo que hay y el pedido); lo que se pide va con «?».
  const EJEMPLOS_PRESTAMO = [
    { nivel: 1, titulo: 'Una columna que no alcanza',
      enunciado: 'En la columna de los sueltos, doña Juana tiene 3 caramelos y debe quitar 7. ¿Qué hace y cuántos sueltos le quedan?',
      datos: [DO.bolsita(10)],
      figura: fig({ n: 10, bolsitas: 2, sueltos: 3, regla: 1, rotulos: { bolsitas: '2 bolsitas', sueltos: '3 sueltos' } }),
      solucion: [
        { texto: '3 no alcanza para quitar 7: abre una bolsita y sus 10 caramelos pasan a los sueltos.', ecuacion: ['3 + ', bas(10), ' = ', lleva(13)] },
        { texto: 'Ahora sí quita los 7.', ecuacion: ['13 − 7 = ', res(6)] },
      ],
      respuesta: ['Abre 1 bolsita y le quedan ', res(6), ' sueltos'] },
    { nivel: 1, titulo: '¿Hace falta un préstamo?',
      enunciado: '¿Hace falta abrir algún envase para restar 87 − 35?',
      datos: [DO.bolsita(10)],
      figura: cuaderno(['87', '35'], { op: '−' }),
      solucion: [
        { texto: 'Sueltos: 7 alcanza para quitar 5. Bolsitas: 8 alcanza para quitar 3. No se abre nada.' },
        { texto: 'Cada columna se resta tal cual.', ecuacion: ['87 − 35 = ', res(52)] },
      ],
      respuesta: ['No; la diferencia es ', res(52)] },
    { nivel: 1, titulo: 'Un préstamo',
      enunciado: '¿Cuánto es 62 − 27?',
      datos: [DO.bolsita(10), DR.resta],
      figura: cuaderno(['62', '27'], { op: '−' }),
      solucion: [
        { texto: 'Sueltos: 2 no alcanza para 7. Se abre una bolsita: 12 − 7 = 5.', ecuacion: ['2 + ', bas(10), ' − 7 = ', res(5)] },
        { texto: 'Las bolsitas quedan en 5: 5 − 2 = 3.', ecuacion: [lleva(5), ' − 2 = ', res(3)] },
      ],
      respuesta: ['62 − 27 = ', res(35)] },
    { nivel: 1, titulo: 'Un préstamo en base 5',
      enunciado: ['En el puesto de bolsitas de ', bas(5), ', la columna de los sueltos tiene 1 caramelo y hay que quitar 4. ¿Cuántos quedan en esa columna?'],
      datos: [DO.bolsita(5)],
      figura: fig({ n: 5, bolsitas: 2, sueltos: 1, regla: 1, rotulos: { bolsitas: '2 bolsitas', sueltos: '1 suelto' } }),
      solucion: [
        { texto: ['Se abre una bolsita de ', bas(5), ': 1 + 5 = 6 sueltos.'], ecuacion: ['1 + ', bas(5), ' = ', lleva(6)] },
        { texto: 'En base 5 la bolsita trae 5, no 10.', ecuacion: ['6 − 4 = ', res(2)] },
      ],
      respuesta: ['Quedan ', res(2), ' sueltos'] },
    { nivel: 1, titulo: 'La columna que prestó',
      enunciado: 'Doña Juana resta 452 − 128. ¿Con cuántas bolsitas queda la columna de las bolsitas después de prestar?',
      datos: [DO.bolsita(10)],
      figura: cuaderno(['452', '128'], { op: '−' }),
      solucion: [
        { texto: 'Sueltos: 2 no alcanza para quitar 8, así que se abre una bolsita.' },
        { texto: 'Las bolsitas eran 5 y una se abrió.', ecuacion: ['5 − 1 = ', lleva(4)] },
      ],
      respuesta: ['Queda con ', lleva(4), ' bolsitas'] },
    { nivel: 2, titulo: 'Dos préstamos seguidos',
      enunciado: '¿Cuánto es 623 − 357?',
      datos: [DO.ordenes, DR.resta],
      figura: cuaderno(['623', '357'], { op: '−' }),
      solucion: [
        { texto: 'Unidades: 3 no alcanza para 7; se abre una bolsita.', ecuacion: ['3 + ', bas(10), ' − 7 = ', res(6)] },
        { texto: 'Decenas: quedaron en 1, que no alcanza para 5; se abre una caja.', ecuacion: [lleva(1), ' + ', bas(10), ' − 5 = ', res(6)] },
        { texto: 'Centenas: quedaron en 5.', ecuacion: [lleva(5), ' − 3 = ', res(2), '   →   623 − 357 = ', res(266)] },
      ],
      respuesta: ['623 − 357 = ', res(266)] },
    { nivel: 2, titulo: 'Un cero en medio',
      enunciado: '¿Cuánto es 405 − 128?',
      datos: [DO.ordenes, DR.resta],
      figura: cuaderno(['405', '128'], { op: '−' }),
      solucion: [
        { texto: 'Unidades: 5 no alcanza para 8, y las decenas están en 0: no tienen qué prestar.' },
        { texto: 'Se abre una caja (las centenas quedan en 3) y después una bolsita: las decenas quedan en 9.', ecuacion: ['5 + ', bas(10), ' − 8 = ', res(7)] },
        { texto: 'Decenas y centenas, con lo que les quedó.', ecuacion: [lleva(9), ' − 2 = ', res(7), '   ;   ', lleva(3), ' − 1 = ', res(2)] },
      ],
      respuesta: ['405 − 128 = ', res(277)] },
    { nivel: 2, titulo: 'Una resta en base 6',
      enunciado: ['¿Cuánto es ', sumN('312', 6), ' − ', sumN('145', 6), '?'],
      datos: [DR.abrir(6), DR.resta],
      figura: cuaderno(['312', '145'], { op: '−', base: '6' }),
      solucion: [
        { texto: ['Sueltos: 2 no alcanza para 5. Se abre una bolsita de ', bas(6), '.'], ecuacion: ['2 + ', bas(6), ' − 5 = ', res(3)] },
        { texto: 'Bolsitas: quedaron en 0, que no alcanza para 4. Se abre una caja.', ecuacion: [lleva(0), ' + ', bas(6), ' − 4 = ', res(2)] },
        { texto: 'Cajas: quedaron en 2.', ecuacion: [lleva(2), ' − 1 = ', res(1)] },
      ],
      respuesta: [sumN('312', 6), ' − ', sumN('145', 6), ' = ', resN('123', 6)] },
    { nivel: 2, titulo: 'Comprobar con una suma',
      enunciado: 'Resta 800 − 365 y comprueba el resultado con una suma.',
      datos: [DR.resta, DR.prueba],
      figura: cuaderno(['800', '365'], { op: '−' }),
      solucion: [
        { texto: 'Unidades: 0 no alcanza para 5 y las decenas están en 0. Se abre una caja y después una bolsita.', ecuacion: ['0 + ', bas(10), ' − 5 = ', res(5)] },
        { texto: 'Las decenas quedaron en 9 y las centenas en 7.', ecuacion: [lleva(9), ' − 6 = ', res(3), '   ;   ', lleva(7), ' − 3 = ', res(4)] },
        { texto: 'Compruebo: la diferencia más el sustraendo da el minuendo.', ecuacion: ['435 + 365 = 800'] },
      ],
      respuesta: ['800 − 365 = ', res(435)] },
    { nivel: 2, titulo: '¿Cuántos envases se abren?',
      enunciado: '¿Cuántas veces hay que abrir un envase (bolsita, caja o cajón) para restar 3 002 − 1 245?',
      datos: [DO.todo(10), 'Un envase vacío no se puede abrir'],
      figura: cuaderno(['3002', '1245'], { op: '−' }),
      solucion: [
        { texto: 'Unidades: 2 no alcanza para 5. Decenas y centenas están en 0: hay que ir hasta los millares.' },
        { texto: 'Se abre un cajón, después una caja y después una bolsita: tres aperturas. Después ya no hace falta abrir nada.', ecuacion: ['3 002 − 1 245 = ', res('1 757')] },
      ],
      respuesta: ['Se abren ', res(3), ' envases'] },
    { nivel: 3, titulo: 'Tres ceros seguidos',
      enunciado: '¿Cuánto es 6 000 − 2 347?',
      alternativas: ['4 347', '4 763', '3 763', '3 653'],
      datos: [DO.todo(10), DR.resta],
      figura: cuaderno(['6000', '2347'], { op: '−' }),
      solucion: [
        { texto: 'Unidades: 0 no alcanza para 7 y los tres ceros de la izquierda no tienen qué prestar. Se abre un cajón: los millares quedan en 5.' },
        { texto: 'En la cadena, cada 0 recibe 10 y da 1: queda en 9. Las unidades reciben 10.', ecuacion: ['10 − 7 = ', res(3), ' ; ', lleva(9), ' − 4 = ', res(5), ' ; ', lleva(9), ' − 3 = ', res(6), ' ; ', lleva(5), ' − 2 = ', res(3)] },
        { texto: ['Las trampas: ', letra('A'), ' resta en cada columna el menor del mayor; ', letra('B'), ' presta sin descontar; ', letra('C'), ' deja los ceros en 10.'] },
      ],
      respuesta: [letra('D'), ': ', res('3 653')] },
    { nivel: 3, titulo: 'Una resta en base 7',
      enunciado: ['¿Cuánto es ', sumN('1003', 7), ' − ', sumN('256', 7), '?'],
      alternativas: [[sumN('1253', 7)], [sumN('414', 7)], [sumN('1524', 7)], [sumN('524', 7)]],
      datos: [DR.abrir(7), DR.resta],
      figura: cuaderno(['1003', '256'], { op: '−', base: '7' }),
      solucion: [
        { texto: ['Sueltos: 3 no alcanza para 6, y al lado hay dos ceros. Se abre un cajón, una caja y una bolsita: cada 0 queda en ', bas(7), ' − 1 = 6.'] },
        { texto: 'Columna por columna, con lo que quedó.', ecuacion: ['3 + ', bas(7), ' − 6 = ', res(4), ' ; ', lleva(6), ' − 5 = ', res(1), ' ; ', lleva(6), ' − 2 = ', res(4)] },
        { texto: ['Compruebo en base 10: 346 − 139 = 207 = 4 × 49 + 1 × 7 + 4. Las trampas: ', letra('A'), ' menor del mayor; ', letra('C'), ' sin descontar; ', letra('D'), ' deja los ceros en 7.'] },
      ],
      respuesta: [letra('B'), ': ', resN('414', 7)] },
    { nivel: 3, titulo: 'La cifra de las centenas',
      enunciado: 'Al restar 7 004 − 2 386, ¿qué cifra se anota en la columna de las centenas?',
      alternativas: ['3', '5', '6', '7'],
      datos: [DO.todo(10), DR.resta],
      figura: cuaderno(['7004', '2386'], { op: '−', foco: 2 }),
      solucion: [
        { texto: 'Unidades: 4 no alcanza para 6, y decenas y centenas están en 0. Se abre un cajón (millares en 6), una caja y una bolsita.' },
        { texto: 'Las centenas recibieron 10 y prestaron 1: quedaron en 9.', ecuacion: [lleva(9), ' − 3 = ', res(6), '   →   7 004 − 2 386 = ', res('4 618')] },
        { texto: ['Las trampas: ', letra('A'), ' resta el menor del mayor; ', letra('B'), ' descuenta dos veces; ', letra('D'), ' deja el 0 en 10.'] },
      ],
      respuesta: [letra('C'), ': ', res(6)] },
    { nivel: 3, titulo: 'Los tres términos de una resta',
      enunciado: 'En una resta, el minuendo más el sustraendo más la diferencia suman 1 848. ¿Cuál es el minuendo?',
      alternativas: ['616', '924', '462', '1 848'],
      datos: [DR.prueba],
      solucion: [
        { texto: 'El sustraendo más la diferencia dan el minuendo. Entonces la suma de los tres es dos veces el minuendo.', ecuacion: ['minuendo + (sustraendo + diferencia) = 2 × minuendo'] },
        { texto: 'Divido entre 2.', ecuacion: ['1 848 ÷ 2 = ', res(924)] },
        { texto: ['Las trampas: ', letra('A'), ' divide entre 3, como si los tres términos fueran iguales; ', letra('C'), ' divide entre 4; ', letra('D'), ' toma la suma entera.'] },
      ],
      respuesta: [letra('B'), ': el minuendo es ', res(924)] },
    { nivel: 3, titulo: 'La base de una resta',
      enunciado: ['En cierta base ', bas('n'), ' se cumple ', sumN('53', 'n'), ' − ', sumN('26', 'n'), ' = ', resN('24', 'n'), '. ¿Cuál es ', bas('n'), '?'],
      alternativas: ['6', '7', '8', '9'],
      datos: [DR.resta, DO.cifras],
      figura: cuaderno(['53', '26'], { op: '−', base: 'n', resultado: '24' }),
      solucion: [
        { texto: ['La cifra 6 obliga a que ', bas('n'), ' sea 7 o más. Unidades: 3 no alcanza para 6, así que se abrió una bolsita de ', bas('n'), '.'], ecuacion: ['3 + ', bas('n'), ' − 6 = ', res(4), '   →   ', bas('n'), ' = ', bas(7)] },
        { texto: 'Compruebo las bolsitas: quedaron en 4, y 4 − 2 = 2, como dice la cuenta.', ecuacion: [lleva(4), ' − 2 = ', res(2)] },
        { texto: ['Con 8 o 9 las unidades darían 5 o 6, no 4; con 6 no se puede escribir la cifra 6.'] },
      ],
      respuesta: [letra('B', 'envase'), ': ', bas('n'), ' = ', bas(7)] },
  ];

  const prestamo = {
    id: 'prestamo',
    titulo: 'Abrir una bolsita para restar',
    pregunta: '¿Por qué al restar a veces se abre una bolsita?',
    temas: ['Sustracción y préstamos', 'Operaciones en otras bases'],
    pieza: PU,
    aprendizaje: 'Si arriba no alcanza, se abre 1 de la columna izquierda en 10 (n en base n), que queda con uno menos.',
    actividad: 'Despachar un pedido abriendo bolsitas y cajas solo cuando hace falta.',
    // Lee: despachar es restar, los nombres de la resta y qué es abrir. No dice qué pasa con un 0 (es de Predice).
    lee: {
      tarjetas: [
        { titulo: 'Despachar es restar', texto: 'Cuando doña Juana despacha un pedido, quita caramelos: resta. Lo que tiene es el minuendo; lo que se lleva el cliente, el sustraendo; lo que le queda, la diferencia.',
          pieza: PU, dibujo: { datos: { n: 10, bolsitas: 3, sueltos: 8, ceros: true, regla: 1, colorCifras: false, rotulos: { bolsitas: '3 bolsitas', sueltos: '8 sueltos' }, cuenta: { sumandos: ['38', '15'], op: '−', resultado: '23' } }, estado: {} } },
        { titulo: 'Abrir una bolsita', texto: 'Si en los sueltos no le alcanza, abre una bolsita: sus 10 caramelos pasan a los sueltos. Eso es un préstamo, y la columna de las bolsitas queda con una menos.',
          pieza: PU, dibujo: { datos: { n: 10, bolsitas: 1, sueltos: 14, ceros: true, regla: 1, colorCifras: false, rotulos: { bolsitas: '1 bolsita', sueltos: [['4 + '], ['10', 'o', 700], [' sueltos']] } }, estado: {} } },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a despachar un pedido. Si una columna no alcanza, toca el envase de su izquierda para abrirlo. Fíjate en lo que queda en la columna que prestó.' },
      ],
    },
    ejemplos: EJEMPLOS_PRESTAMO,
    juega: {
      pieza: PU,
      consigna: 'Doña Juana despacha pedidos de su puesto. Si una columna no alcanza, abre una bolsita o una caja y anota lo que le queda.',
      mision: {
        texto: 'Con 432 caramelos, despacha 178 abriendo solo lo que haga falta.',
        logrado: v => v.M === 432 && v.S === 178 && manoR(v).listo,
        bien: 'Abrió una bolsita y una caja: quedan 254, y cada columna que prestó tiene uno menos.',
      },
      voz: 'Si no alcanza, toca el envase de la izquierda.',
      leyenda: [
        { s: bas('10'), t: 'caramelos por bolsita: la base' },
        { s: lleva('naranja'), t: 'lo que tiene la columna tras el préstamo' },
        { s: res('cifra'), t: 'lo que le queda: la diferencia' },
        { s: '?', t: 'lo que todavía no se puede anotar' },
      ],
      controles: CTRL_R,
      dibujo: v => ({ datos: puestoR(v, escalaR()), estado: {} }),
      // La relación: la primera columna que no alcanza, o lo que pasa al abrir de más, o la resta lista.
      lectura: v => {
        const m = manoR(v), k = m.faltan[0];
        if (k !== undefined) return [m.cuentas[k] === 1 ? `1 ${NOMBRE_R[k].replace(/s$/, '')} no alcanza para quitar ${m.abajo[k]}: falta abrir` : `${m.cuentas[k]} ${NOMBRE_R[k]} no alcanzan para quitar ${m.abajo[k]}: falta abrir`];
        const de = m.resultado.findIndex(x => x >= 10);
        if (de >= 0) return [`Abrió de más: quedarían ${m.resultado[de]} ${NOMBRE_R[de]}, más de 9`];
        const abrio = v.ob || v.oc;
        return abrio ? [`${v.M} − ${v.S} = `, res(m.texto), ': la columna que prestó tiene uno menos'] : [`${v.M} − ${v.S} = `, res(m.texto), ': no hizo falta abrir nada'];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Doña Juana tiene 5 003 caramelos y le piden 1 478. ¿Cuántos le quedan?',
      datos: [['1 bolsita = ', bas(10), ' caramelos'], ['1 caja = ', bas(10), ' bolsitas'], ['1 cajón = ', bas(10), ' cajas']],
      voz: 'Piensa qué abre si al lado no hay nada.',
      opciones: [
        { id: 'c', texto: [res('3 525')], correcta: true },
        { id: 'menor', texto: [res('4 475')], error: 'AT-MENOR-MAYOR', siFuera: 'Restar por columnas está bien. Pero se resta arriba menos abajo: 3 menos 8 no se da vuelta.' },
        { id: 'sin', texto: [res('4 635')], error: 'AT-SIN-DESCONTAR', siFuera: 'Abrir un envase está bien. Pero el cajón que se abrió deja 4 cajones, no 5.' },
        { id: 'diez', texto: [res('3 635')], error: 'AT-CERO-DIEZ', siFuera: 'La cadena de préstamos está bien. Pero cada 0 que presta recibe 10 y da 1: queda en 9.' },
      ],
      dibujo: fig2(0),
      revelar: fig2(5),
      coincide: 'Coincide: se abrió un cajón, después una caja y después una bolsita.',
      noCoincide: 'Revisemos: un 0 no tiene qué prestar; primero se abre lo de su izquierda.',
    },
    mira: {
      pieza: PU,
      datos: Object.assign({ pasos: PASOS2 }, PASOS2[0]),
      voz: 'Columna por columna, desde los sueltos.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Arriba, lo que tiene: 5 cajones y 3 sueltos. Abajo, el pedido.', ecuacion: ['5 003 − 1 478'] },
        { estado: { paso: 1 }, texto: 'Sueltos: 3 no alcanzan para 8, y no hay bolsitas ni cajas que abrir.', ecuacion: ['3 < 8'] },
        { estado: { paso: 2 }, texto: 'Se abre un cajón: 10 cajas. Los cajones quedan en 4.', ecuacion: ['5 − 1 = ', lleva(4)] },
        { estado: { paso: 3 }, texto: 'Se abre una caja: 10 bolsitas. Las cajas quedan en 9.', ecuacion: ['10 − 1 = ', lleva(9)] },
        { estado: { paso: 4 }, texto: 'Se abre una bolsita: 13 sueltos. Las bolsitas quedan en 9.', ecuacion: ['3 + ', bas(10), ' = ', lleva(13)] },
        { estado: { paso: 5 }, texto: 'Ahora cada columna alcanza: 13 − 8, 9 − 7, 9 − 4 y 4 − 1.', ecuacion: ['5 003 − 1 478 = ', res('3 525')] },
        { estado: { paso: 6 }, texto: 'Cada 0 que prestó recibió 10 y dio 1: quedó en 9.', ecuacion: ['0 + ', bas(10), ' − 1 = ', lleva(9)] },
      ],
    },
    regla: {
      texto: 'Por columnas, desde las unidades. Si arriba no alcanza, se abre 1 de la columna izquierda en 10 (n en base n); esa columna queda con uno menos.',
      ecuacion: [res('cifra'), ' = arriba + ', { llave: [lleva('p'), ' × ', bas('n')], nota: 'p = 1 si se abrió', color: 'c-o' }, ' − abajo', SEP, 'la de la izquierda: arriba − ', lleva('p')],
      condicion: 'Un 0 no presta: se abre lo de su izquierda y ese 0 queda en 9 (n − 1 en base n).',
      voz: 'Lo que no alcanza se abre; el que presta queda con uno menos.',
    },
    // Así se resuelve: una resta en base n que cruza un 0 (302₍₅₎ − 143₍₅₎ es el caso de la escena), columna por
    // columna. «Ahora tú» pide otra cosa: restas en base 10 con varios ceros, en base n de 4 cifras, cuántos envases se
    // abren o la cifra de una columna.
    resuelve: {
      pieza: PU,
      generar(s) {
        const r = azar(s + 900);
        const n = r.de([4, 5, 6, 7, 8, 9]), a2 = r.ent(3, n - 1), a0 = r.ent(0, n - 2);
        const M = `${a2}0${a0}`, S = `${r.ent(1, a2 - 2)}${r.ent(1, n - 1)}${r.ent(a0 + 1, n - 1)}`;
        const [b0, b1, b2] = digitos(S), c0 = a0 + n - b0, c1 = n - 1 - b1, c2 = a2 - 1 - b2;
        const T = `${c2}${c1}${c0}`, vM = valor(M, n), vS = valor(S, n);
        const pr = { 2: String(a2 - 1), 1: String(n - 1), 0: String(a0 + n) };
        const cu = (o = {}) => cuaderno([M, S], Object.assign({ op: '−', base: String(n) }, o));
        return {
          enunciado: ['En el puesto de bolsitas de ', bas(n), ', doña Juana tiene ', sumN(M, n), ' caramelos y despacha ', sumN(S, n), '. ¿Cuántos le quedan?'],
          datos: [DR.abrir(n), DR.resta, DO.f3(n)],
          dibujo: cu(),
          pasos: [
            { tipo: 'pide', texto: ['Piden la diferencia, escrita en base ', bas(n), '.'] },
            { tipo: 'regla', texto: ['Resto por columnas, desde los sueltos. Si arriba no alcanza, abro 1 de la izquierda en ', bas(n), '; un 0 no presta y queda en ', bas(n - 1), '.'] },
            { tipo: 'cuentas', texto: `Sueltos: ${a0} no alcanza para ${b0}, y las bolsitas están en 0. Abro una caja y después una bolsita: ${a0} + ${n} = ${a0 + n}.`,
              ecuacion: [`${a0} + `, bas(n), ` − ${b0} = `, res(c0)], dibujo: cu({ presta: pr, foco: 0, resultado: String(c0) }) },
            { tipo: 'cuentas', texto: `Bolsitas: recibieron ${n} y dieron 1, quedan ${n - 1}.`,
              ecuacion: [lleva(n - 1), ` − ${b1} = `, res(c1)], dibujo: cu({ presta: pr, foco: 1, resultado: `${c1}${c0}` }) },
            { tipo: 'cuentas', texto: `Cajas: prestaron 1, quedan ${a2 - 1}.`,
              ecuacion: [lleva(a2 - 1), ` − ${b2} = `, res(c2)], dibujo: cu({ presta: pr, foco: 2, resultado: T }) },
            { tipo: 'sentido', texto: `Compruebo en base 10: ${vM} − ${vS} = ${vM - vS}, y el resultado también vale ${valor(T, n)}.`,
              ecuacion: [resN(T, n), ` = ${poli(T, n)} = `, res(valor(T, n))] },
          ],
          respuesta: ['Le quedan ', resN(T, n)],
        };
      },
    },
    ahoraTu: {
      pieza: PU,
      voz: 'Desde las unidades: lo que no alcanza se abre.',
      generar(sem) {
        const r = azar(sem + 47), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoRestaCeros, r);
        if (tipo === 1) return conCuatro(casoRestaBase, r);
        if (tipo === 2) return conCuatro(casoAperturas, r);
        return conCuatro(casoCifraColumna, r);
      },
    },
  };

  // ---------- Idea 3: lo que falta para llenar (complemento aritmético) ----------
  // Propuesta §1 a §7. Objeto: el cajón de 1 000 del puesto (juego) y el vuelto de un billete de S/ 100 (Lee).
  // Cambia: lo que tiene y lo que agrega. · Permanece: la meta, un cajón lleno de 1 000, y la escala. · Progresa: lo que
  // agrega llena las bolsitas, las bolsitas una caja y las cajas el cajón. · Se reserva: el número de 4 cifras con un 0 en
  // medio (meta 10 000): es de la predicción (4 073). · Debe verse: llenar justo el envase es el complemento; cada columna
  // lleva 1 a la siguiente.
  // El juego va de 100 a 990 de 10 en 10 (la propuesta decía de 20 a 980): con 3 cifras la meta siempre es 1 000 y el
  // juego nunca llega a 10 000.
  // Errores (hipótesis de aula; la trampa 29 de San Marcos, 2026-I, respalda AT-CA9): AT-CA9 resta de 9 todas las
  // cifras, también la última · AT-CERO-QUEDA deja un 0 del medio como 0 · AT-CA-K usa una potencia de 10 de más ·
  // AT-CA-MISMO toma el complemento como si fuera el número · AT-CA-DIEZ resta de 10 todas · AT-CA-SIN-RESTAR deja la
  // cifra del medio sin restarla de 9 · AT-CA-DECIMAL saca el complemento en base 10 · AT-CA-MITAD, AT-CA-TERCIO
  // toman mal la relación entre el número y su complemento · AT-SUFICIENCIA cree que faltan datos.
  const ca = x => 10 ** cifras(x) - x;
  const puestoC = (v, escala) => {
    const t = v.N + v.ag, C = MCO.sumaColumnas([String(v.N), String(v.ag)], 10);
    const ll = Object.fromEntries(C.columnas.filter(c => c.llevadaSale).map(c => [c.orden + 1, c.llevadaSale]));
    return { n: 10, cajones: Math.floor(t / 1000), cajas: Math.floor(t / 100) % 10, bolsitas: Math.floor(t / 10) % 10, sueltos: t % 10,
      regla: 3, escala, colorCifras: false,
      cuenta: { sumandos: [String(v.N), String(v.ag)], llevadas: ll, resultado: String(t) } };
  };
  const CTRL_C = [
    { id: 'N', etiqueta: 'Caramelos que tiene', min: 100, max: 990, paso: 10, inicio: 380, decimales: 0 },
    { id: 'ag', etiqueta: 'Caramelos que agrega', min: 0, max: 990, paso: 10, inicio: 0, decimales: 0 },
  ];
  let escC = null;
  const escalaC = () => escC || (escC = escalaDe(CTRL_C, v => puestoC(v)));
  // Lo que da cada error del complemento (las cuentas de la idea; la prueba las rehace aparte).
  const caNueve = x => 10 ** cifras(x) - 1 - x;
  const caCeroQueda = x => { const s = String(x), u = s.replace(/0+$/, '').length - 1; return +s.split('').map((c, i) => (i > u ? '0' : c === '0' && i < u ? '0' : String((i === u ? 10 : 9) - +c))).join(''); };
  function casoCA(r) {
    const k = r.ent(4, 5), s = [String(r.ent(1, 9))];
    for (let i = 1; i < k - 1; i++) s.push(String(r.ent(0, 9)));
    s.push(String(r.ent(1, 9)));
    const N = +s.join('');
    if (!s.slice(1, -1).includes('0')) return null;
    return {
      pregunta: `¿Cuál es el complemento aritmético de ${f(N, 0)}?`,
      datos: [DR.ca],
      dibujo: cuaderno([String(10 ** k), String(N)], { op: '−' }),
      opciones: opciones(ca(N), [
        { id: 'nueve', valor: caNueve(N), error: 'AT-CA9', siFuera: 'Restar de 9 está bien en las primeras cifras. Pero la última que no es 0 se resta de 10.' },
        { id: 'cero', valor: caCeroQueda(N), error: 'AT-CERO-QUEDA', siFuera: 'El atajo está bien. Pero un 0 del medio también se resta de 9: da 9.' },
        { id: 'k', valor: 10 ** (k + 1) - N, error: 'AT-CA-K', siFuera: `Usar una potencia de 10 está bien. Pero con ${k} cifras la meta es un 1 con ${k} ceros.` },
      ], x => f(x, 0)),
      solucion: { texto: `Tiene ${k} cifras: la meta es un 1 con ${k} ceros.`, ecuacion: [`${f(10 ** k, 0)} − ${f(N, 0)} = `, res(f(ca(N), 0))] },
    };
  }
  // En base n: la meta es nᵏ (nivel examen).
  function casoCABase(r) {
    const n = r.ent(4, 9), N = `${r.ent(1, n - 1)}${r.ent(0, n - 1)}${r.ent(1, n - 1)}`, v = valor(N, n);
    const bien = enBase(n ** 3 - v, n), nueve = enBase(n ** 3 - 1 - v, n), k4 = enBase(n ** 4 - v, n);
    const dec = String(1000 - +N), decOk = [...dec].every(c => +c < n) ? dec : null;
    const op = t => [resN(t, n)];
    return {
      pregunta: ['¿Cuál es el complemento aritmético de ', sumN(N, n), '?'],
      datos: [DR.caBase, DO.f3(n)],
      dibujo: cuaderno(['1000', N], { op: '−', base: String(n) }),
      opciones: opcionesNum(op(bien), [
        { id: 'nueve', texto: op(nueve), error: 'AT-CA9', siFuera: `Restar de ${n - 1} está bien en las primeras cifras. Pero la última que no es 0 se resta de ${n}.` },
        { id: 'k', texto: op(k4), error: 'AT-CA-K', siFuera: 'Usar una potencia de la base está bien. Pero el número tiene 3 cifras: la meta tiene 3 ceros.' },
        ...(decOk ? [{ id: 'decimal', texto: op(decOk), error: 'AT-CA-DECIMAL', siFuera: `Restar de 1 000 está bien en base 10. Pero en base ${n} la meta vale ${n}³.` }] : []),
        ...(N.includes('0') ? [] : [{ id: 'diez', texto: op(N.split('').map(d => n - +d).join('')), error: 'AT-CA-DIEZ', siFuera: `La última se resta de ${n}, es cierto. Pero las demás se restan de ${n - 1}.` }]),
      ]),
      solucion: { texto: ['Tiene 3 cifras: la meta es ', bas(`1000₍${n}₎`), `, que vale ${n}³ = ${n ** 3}.`], ecuacion: [`${n ** 3} − ${v} = ${n ** 3 - v} = `, resN(bien, n)] },
    };
  }
  // Del complemento al número.
  function casoDesdeCA(r) {
    const k = r.ent(3, 5), N = r.ent(10 ** (k - 1) + 1, 10 ** k - 1);
    if (N % 10 === 0) return null;
    const C = ca(N);
    if (cifras(C) !== k) return null;
    return {
      pregunta: `El complemento aritmético de un número de ${k} cifras es ${f(C, 0)}. ¿Cuál es el número?`,
      datos: [DR.ca, 'N + CA(N) = 10ᵏ'],
      opciones: opciones(N, [
        { id: 'mismo', valor: C, error: 'AT-CA-MISMO', siFuera: 'El número y su complemento son distintos: juntos llenan la meta.' },
        { id: 'nueve', valor: 10 ** k - 1 - C, error: 'AT-CA9', siFuera: 'Restar de 9 está bien en las primeras cifras. Pero la última que no es 0 se resta de 10.' },
        { id: 'k', valor: 10 ** (k + 1) - C, error: 'AT-CA-K', siFuera: `La meta es un 1 con ${k} ceros, no con ${k + 1}.` },
      ], x => f(x, 0)),
      solucion: { texto: 'El número y su complemento llenan la meta.', ecuacion: [`${f(10 ** k, 0)} − ${f(C, 0)} = `, `${f(N, 0)}`] },
    };
  }
  // Complemento con cifras ocultas (San Marcos 2026-I, nivel examen): CA(a̅m̅b̅) = (9 − a)c(10 − b), con c = 9 − m.
  function casoCAOculto(r) {
    const a = r.ent(1, 8), m = r.ent(0, 9), b = r.ent(1, 9), c = 9 - m;
    const ver = `${9 - a}c${10 - b}`, bien = a + b + c;
    return {
      pregunta: ['Si CA(', { raya: [`a${m}b`] }, ') = ', { raya: [res(ver)] }, ', ¿cuánto vale a + b + c?'],
      datos: [DR.ca, 'a, b y c son cifras'],
      opciones: opciones(bien, [
        { id: 'nueve', valor: bien - 1, error: 'AT-CA9', siFuera: 'Restar de 9 las primeras está bien. Pero la última cifra se resta de 10.' },
        { id: 'diez', valor: bien + 2, error: 'AT-CA-DIEZ', siFuera: 'Restar de 10 la última está bien. Pero las demás se restan de 9.' },
        { id: 'medio', valor: a + b + m, error: 'AT-CA-SIN-RESTAR', siFuera: `La cifra c es la del complemento: 9 − ${m}, no ${m}.` },
      ], x => String(x)),
      solucion: { texto: `De 9 las dos primeras y de 10 la última: a = ${a}, c = ${c} y b = ${b}.`, ecuacion: [`${a} + ${b} + ${c} = `, res(bien)] },
    };
  }

  // Ejemplos resueltos de la idea 3. Cuentas rehechas aparte (cuentas-ideas.js, con su propio código): CA(58) = 42;
  // CA(7) = 3; CA(306) = 694; CA(250) = 750; CA(4 815) = 5 185; CA(80 400) = 19 600; CA(1 001) = 8 999; CA(245₍₆₎) =
  // 311₍₆₎ (216 − 101 = 115); CA = 2 370 → N = 7 630; N + CA(N) = 1 000; CA(a̅b̅c̅) = 258 → 742, a + b + c = 13 (trampas
  // 12 y 15); CA(1030₍₅₎) = 3420₍₅₎ (625 − 140 = 485; trampas 3414, 3020, 43420); CA(7 040 600) = 2 959 400, cifras 29
  // (trampas 46, 11, 38); N − CA(N) = 286 → N = 643; CA(N) = N ÷ 3 → N = 750.
  const EJEMPLOS_COMPLEMENTO = [
    { nivel: 1, titulo: 'El vuelto de un billete',
      enunciado: 'Compras pan por S/ 58 y pagas con un billete de S/ 100. ¿Cuánto te dan de vuelto?',
      datos: [DR.ca, 'S/ 100 es un 1 con dos ceros'],
      figura: cuaderno(['100', '58'], { op: '−' }),
      solucion: [
        { texto: ['El vuelto es lo que le falta a 58 para llegar a ', bas(100), ': su complemento aritmético.'], ecuacion: ['CA(58) = ', bas(100), ' − 58 = ', res(42)] },
      ],
      respuesta: ['El vuelto es S/ ', res(42)] },
    { nivel: 1, titulo: 'Un número de una cifra',
      enunciado: '¿Cuál es el complemento aritmético de 7?',
      datos: [DR.ca],
      solucion: [{ texto: ['7 tiene 1 cifra: la meta es ', bas(10), '.'], ecuacion: ['CA(7) = ', bas(10), ' − 7 = ', res(3)] }],
      respuesta: ['CA(7) = ', res(3)] },
    { nivel: 1, titulo: 'Un cero en medio',
      enunciado: '¿Cuál es el complemento aritmético de 306?',
      datos: [DR.ca],
      figura: cuaderno(['1000', '306'], { op: '−' }),
      solucion: [
        { texto: ['306 tiene 3 cifras: la meta es ', bas('1 000'), '. El 0 del medio también se resta de 9.'], ecuacion: [bas('1 000'), ' − 306 = ', res(694)] },
      ],
      respuesta: ['CA(306) = ', res(694)] },
    { nivel: 1, titulo: 'Un cero al final',
      enunciado: '¿Cuál es el complemento aritmético de 250?',
      datos: [DR.ca],
      figura: cuaderno(['1000', '250'], { op: '−' }),
      solucion: [{ texto: ['Tiene 3 cifras: la meta es ', bas('1 000'), '. El 0 del final se queda.'], ecuacion: [bas('1 000'), ' − 250 = ', res(750)] }],
      respuesta: ['CA(250) = ', res(750)] },
    { nivel: 1, titulo: '¿Cuál es la meta?',
      enunciado: '¿Cuál es el complemento aritmético de 4 815?',
      datos: [DR.ca],
      solucion: [
        { texto: ['4 815 tiene 4 cifras: la meta es un 1 con 4 ceros, ', bas('10 000'), '.'], ecuacion: [bas('10 000'), ' − 4 815 = ', res('5 185')] },
      ],
      respuesta: ['CA(4 815) = ', res('5 185')] },
    { nivel: 2, titulo: 'Varios ceros al final',
      enunciado: '¿Cuál es el complemento aritmético de 80 400?',
      datos: [DR.ca],
      solucion: [
        { texto: ['Tiene 5 cifras: la meta es ', bas('100 000'), '. La última cifra que no es 0 es el 4.'] },
        { texto: 'Atajo: el 8 se resta de 9, el 0 del medio también, el 4 de 10, y los dos ceros del final se quedan.', ecuacion: ['9 − 8 = 1 ; 9 − 0 = 9 ; 10 − 4 = 6 ; 0 ; 0   →   ', res('19 600')] },
      ],
      respuesta: ['CA(80 400) = ', res('19 600')] },
    { nivel: 2, titulo: 'Un número con unos',
      enunciado: '¿Cuál es el complemento aritmético de 1 001?',
      datos: [DR.ca],
      figura: cuaderno(['10000', '1001'], { op: '−' }),
      solucion: [
        { texto: ['Tiene 4 cifras: la meta es ', bas('10 000'), '.'], ecuacion: [bas('10 000'), ' − 1 001 = ', res('8 999')] },
        { texto: 'Con el atajo: de 9 el 1, el 0 y el 0 dan 8, 9 y 9; de 10 el último 1 da 9.' },
      ],
      respuesta: ['CA(1 001) = ', res('8 999')] },
    { nivel: 2, titulo: 'En base 6',
      enunciado: ['¿Cuál es el complemento aritmético de ', sumN('245', 6), '?'],
      datos: [DR.caBase, DO.f3(6)],
      figura: cuaderno(['1000', '245'], { op: '−', base: '6' }),
      solucion: [
        { texto: ['Tiene 3 cifras: la meta es ', { sup: [bas(6), '3'] }, ' = 216. El número vale 2 × 36 + 4 × 6 + 5 = 101.'], ecuacion: ['216 − 101 = 115 = 3 × 36 + 1 × 6 + 1'] },
        { texto: ['Con el atajo en base 6: de 5 el 2 y el 4, de 6 el 5.'], ecuacion: ['5 − 2 = 3 ; 5 − 4 = 1 ; 6 − 5 = 1   →   ', resN('311', 6)] },
      ],
      respuesta: ['CA(', sumN('245', 6), ') = ', resN('311', 6)] },
    { nivel: 2, titulo: 'Del complemento al número',
      enunciado: 'El complemento aritmético de un número de 4 cifras es 2 370. ¿Cuál es el número?',
      datos: [DR.ca, 'N + CA(N) = 10ᵏ'],
      solucion: [
        { texto: ['El número y su complemento juntos llenan la meta: ', bas('10 000'), '.'], ecuacion: ['N = ', bas('10 000'), ' − 2 370 = 7 630'] },
        { texto: 'Compruebo: 7 630 + 2 370 = 10 000.' },
      ],
      respuesta: ['El número es 7 630'] },
    { nivel: 2, titulo: 'Un número más su complemento',
      enunciado: 'Si N tiene 3 cifras, ¿cuánto vale N + CA(N)?',
      datos: [DR.ca],
      solucion: [
        { texto: ['Con 3 cifras, el complemento es lo que le falta a N para llegar a ', bas('1 000'), '.'], ecuacion: ['N + (', bas('1 000'), ' − N) = ', bas('1 000')] },
        { texto: 'No importa cuál sea N: juntos siempre llenan el cajón de 1 000.' },
      ],
      respuesta: ['N + CA(N) = ', bas('1 000')] },
    { nivel: 3, titulo: 'Cifras ocultas en el complemento',
      enunciado: ['Si CA(', { raya: ['abc'] }, ') = ', { raya: [res('258')] }, ', ¿cuánto vale a + b + c?'],
      alternativas: ['12', '13', '15', 'No se puede saber'],
      datos: [DR.ca, 'a, b y c son cifras; c no es 0'],
      solucion: [
        { texto: 'La última cifra que no es 0 es c: se restó de 10. Las otras dos, de 9.', ecuacion: ['9 − a = 2 ; 9 − b = 5 ; 10 − c = 8'] },
        { texto: 'Entonces a = 7, b = 4 y c = 2: el número es 742, y 1 000 − 742 = 258.', ecuacion: ['7 + 4 + 2 = ', res(13)] },
        { texto: ['Las trampas: ', letra('A'), ' resta c de 9; ', letra('C'), ' suma las cifras del complemento; ', letra('D'), ' cree que faltan datos.'] },
      ],
      respuesta: [letra('B'), ': ', res(13)] },
    { nivel: 3, titulo: 'Base 5 con un cero',
      enunciado: ['¿Cuál es el complemento aritmético de ', sumN('1030', 5), '?'],
      alternativas: [[sumN('3414', 5)], [sumN('3020', 5)], [sumN('3420', 5)], [sumN('43420', 5)]],
      datos: [DR.caBase, ['En base 5: ', { sup: ['5', '4'] }, ' = 625']],
      figura: cuaderno(['10000', '1030'], { op: '−', base: '5' }),
      solucion: [
        { texto: ['Tiene 4 cifras: la meta es ', { sup: [bas(5), '4'] }, ' = 625. El número vale 125 + 15 = 140.'], ecuacion: ['625 − 140 = 485 = 3 × 125 + 4 × 25 + 2 × 5'] },
        { texto: 'Atajo en base 5: de 4 el 1 y el 0, de 5 el 3, y el 0 del final se queda.', ecuacion: ['4 − 1 = 3 ; 4 − 0 = 4 ; 5 − 3 = 2 ; 0   →   ', resN('3420', 5)] },
        { texto: ['Las trampas: ', letra('A'), ' resta todo de 4; ', letra('B'), ' deja el 0 del medio; ', letra('D'), ' usa una cifra de más.'] },
      ],
      respuesta: [letra('C'), ': ', resN('3420', 5)] },
    { nivel: 3, titulo: 'Las cifras del complemento',
      enunciado: '¿Cuánto suman las cifras del complemento aritmético de 7 040 600?',
      alternativas: ['29', '46', '11', '38'],
      datos: [DR.ca],
      solucion: [
        { texto: ['Tiene 7 cifras: la meta es un 1 con 7 ceros. La última cifra que no es 0 es el 6.'] },
        { texto: 'De 9: 7, 0, 4 y 0 dan 2, 9, 5 y 9. De 10: el 6 da 4. Los dos ceros del final se quedan.', ecuacion: ['CA = ', res('2 959 400'), '   →   2 + 9 + 5 + 9 + 4 = ', res(29)] },
        { texto: ['Las trampas: ', letra('B'), ' resta todo de 9; ', letra('C'), ' deja los ceros del medio; ', letra('D'), ' usa un 1 con 8 ceros.'] },
      ],
      respuesta: [letra('A'), ': ', res(29)] },
    { nivel: 3, titulo: 'Un número y su complemento',
      enunciado: 'Un número de tres cifras menos su complemento aritmético da 286. ¿Cuál es el número?',
      alternativas: ['357', '643', '286', '714'],
      datos: [DR.ca],
      solucion: [
        { texto: ['El número N y su complemento suman ', bas('1 000'), ' y se diferencian en 286.'], ecuacion: ['N + CA = 1 000 ; N − CA = 286'] },
        { texto: 'Sumo las dos: dos veces N es 1 286.', ecuacion: ['N = 1 286 ÷ 2 = 643 ; CA = 357'] },
        { texto: ['Las trampas: ', letra('A'), ' es el complemento; ', letra('C'), ' es la diferencia; ', letra('D'), ' es 1 000 − 286.'] },
      ],
      respuesta: [letra('B'), ': el número es 643'] },
    { nivel: 3, titulo: 'Un tercio de sí mismo',
      enunciado: 'El complemento aritmético de un número de tres cifras es la tercera parte del número. ¿Cuál es el número?',
      alternativas: ['250', '333', '500', '750'],
      datos: [DR.ca],
      solucion: [
        { texto: ['El número y su complemento suman ', bas('1 000'), ', y el complemento es un tercio del número: el número son 3 partes y el complemento 1.'] },
        { texto: 'Las 4 partes suman 1 000: cada parte vale 250.', ecuacion: ['N = 3 × 250 = 750 ; CA = ', res(250)] },
        { texto: ['Las trampas: ', letra('A'), ' es el complemento; ', letra('B'), ' divide 1 000 entre 3; ', letra('C'), ' toma la mitad.'] },
      ],
      respuesta: [letra('D'), ': el número es 750'] },
  ];

  const complemento = {
    id: 'complemento',
    titulo: 'Lo que falta para llenar',
    pregunta: '¿Qué es el complemento aritmético de un número?',
    temas: ['Complemento aritmético', 'Operaciones en otras bases'],
    pieza: PU,
    aprendizaje: 'El complemento aritmético es lo que le falta a un número para llegar a un 1 con tantos ceros como cifras tiene.',
    actividad: 'Agregar caramelos hasta llenar justo el cajón.',
    lee: {
      tarjetas: [
        { titulo: 'El cajón de 1 000', texto: 'En el puesto, 10 cajas llenan un cajón: un cajón lleno tiene 1 000 caramelos. Si doña Juana tiene menos, al cajón le falta algo para llenarse.',
          pieza: PU, dibujo: { datos: { n: 10, cajones: 1, regla: 3, rotulos: { cajones: '1 cajón = 1 000 caramelos' } }, estado: {} } },
        { titulo: 'El vuelto', texto: 'Compras algo de S/ 37 y pagas con un billete de S/ 100. El vuelto, S/ 63, es lo que le falta a 37 para llegar a 100: su complemento aritmético.',
          ecuacion: ['CA(37) = 100 − 37 = ', res(63)] },
        { titulo: 'Qué mirar al jugar', texto: 'Doña Juana tiene un cajón a medio llenar. Agrega caramelos hasta llenarlo justo y mira qué pasa en cada columna del cuaderno.' },
      ],
    },
    ejemplos: EJEMPLOS_COMPLEMENTO,
    juega: {
      pieza: PU,
      consigna: 'Doña Juana quiere llenar justo un cajón, que lleva 1 000 caramelos. Elige cuántos tiene y cuántos agrega.',
      mision: {
        texto: 'Tiene 740 caramelos: agrega los que faltan para llenar justo el cajón.',
        logrado: v => v.N === 740 && v.ag === 260,
        bien: 'Con 260 más, las bolsitas llenaron una caja y las cajas, el cajón.',
      },
      voz: 'Mira si el cajón queda justo, corto o pasado.',
      leyenda: [
        { s: bas('1 000'), t: 'caramelos de un cajón lleno: la meta' },
        { s: lleva('lleva'), t: 'la llevada: un envase lleno que sube' },
        { s: res('total'), t: 'lo que tiene después de agregar' },
      ],
      controles: CTRL_C,
      dibujo: v => ({ datos: puestoC(v, escalaC()), estado: {} }),
      lectura: v => {
        const t = v.N + v.ag;
        if (t === 1000) return [`${v.N} + ${v.ag} = `, res('1 000'), ': llenó justo el cajón'];
        return [`${v.N} + ${v.ag} = `, res(f(t, 0)), t < 1000 ? ': menos de 1 000, no llena el cajón' : ': más de 1 000, se pasó'];
      },
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuál es el complemento aritmético de 4 073?',
      datos: ['4 073 tiene 4 cifras', [{ sup: ['10', '4'] }, ' = 10 000']],
      voz: 'Piensa cuál es la meta y qué pasa con el 0.',
      opciones: [
        { id: 'c', texto: [res('5 927')], correcta: true },
        { id: 'nueve', texto: [res('5 926')], error: 'AT-CA9', siFuera: 'Restar de 9 las primeras está bien. Pero la última cifra que no es 0 se resta de 10.' },
        { id: 'cero', texto: [res('5 027')], error: 'AT-CERO-QUEDA', siFuera: 'El 0 del medio también se resta: le faltan 9 para llenar su columna.' },
        { id: 'k', texto: [res('95 927')], error: 'AT-CA-K', siFuera: '4 073 tiene 4 cifras: la meta es 10 000, no 100 000.' },
      ],
      dibujo: fig({ n: 10, cajones: 4, bolsitas: 7, sueltos: 3, ceros: true, regla: 3, colorCifras: false, rotulos: { cajones: '4 cajones', bolsitas: '7 bolsitas', sueltos: '3 sueltos' } }),
      revelar: cuaderno(['4073', '5927'], { resultado: '10000', llevadas: { 1: 1, 2: 1, 3: 1, 4: 1 } }),
      coincide: 'Coincide: 4 073 + 5 927 = 10 000, y cada columna lleva 1.',
      noCoincide: 'Revisemos: la meta tiene tantos ceros como cifras tiene el número.',
    },
    mira: {
      pieza: PU,
      datos: { cuenta: { solo: true, sumandos: ['10000', '4073'], op: '−', resultado: '?' }, pasos: [
        {},
        { cuenta: { solo: true, sumandos: ['10000', '4073'], op: '−', resultado: '?', presta: { 4: '0', 3: '9', 2: '9', 1: '9', 0: '10' } } },
        { cuenta: { solo: true, sumandos: ['10000', '4073'], op: '−', resultado: '5927', presta: { 4: '0', 3: '9', 2: '9', 1: '9', 0: '10' } } },
        { cuenta: { solo: true, sumandos: ['10000', '4073'], op: '−', resultado: '5927', presta: { 4: '0', 3: '9', 2: '9', 1: '9', 0: '10' }, foco: 0 } },
        { cuenta: { solo: true, sumandos: ['10000', '2600'], op: '−', resultado: '7400' } },
        { cuenta: { solo: true, sumandos: ['4073', '5927'], resultado: '10000', llevadas: { 1: 1, 2: 1, 3: 1, 4: 1 } } },
      ] },
      voz: 'La meta primero; después, columna por columna.',
      pasos: [
        { estado: { paso: 0 }, texto: '4 073 tiene 4 cifras: la meta es un 1 con 4 ceros.', ecuacion: ['CA(4 073) = ', bas('10 000'), ' − 4 073'] },
        { estado: { paso: 1 }, texto: 'Restar de 10 000 abre envases en cadena: los ceros quedan en 9.', ecuacion: ['0 + ', bas(10), ' − 1 = ', lleva(9)] },
        { estado: { paso: 2 }, texto: 'Columna por columna: 10 − 3, 9 − 7, 9 − 0 y 9 − 4.', ecuacion: [bas('10 000'), ' − 4 073 = ', res('5 927')] },
        { estado: { paso: 3 }, texto: 'Atajo: cada cifra se resta de 9, y la última cifra significativa, de 10.', ecuacion: ['9 − 4 ; 9 − 0 ; 9 − 7 ; 10 − 3'] },
        { estado: { paso: 4 }, texto: 'Si termina en ceros, esos ceros se quedan.', ecuacion: ['CA(2 600) = ', res('7 400')] },
        { estado: { paso: 5 }, texto: 'Comprueba: el número y su complemento llenan la meta.', ecuacion: ['4 073 + 5 927 = ', bas('10 000')] },
      ],
    },
    regla: {
      texto: 'CA(N) es lo que le falta a N para llegar a un 1 con tantos ceros como cifras tiene N. En base n, la meta es nᵏ.',
      ecuacion: [res('CA(N)'), ' = ', { llave: [{ sup: [bas('10'), 'k'] }], nota: 'k: cifras de N', color: 'c-i' }, ' − N', SEP, 'N + ', res('CA(N)'), ' = ', { sup: [bas('10'), 'k'] }],
      condicion: 'Atajo: de 9 cada cifra y de 10 la última que no es 0; los ceros del final se quedan.',
      voz: 'Lo que falta para llenar la meta.',
    },
    // Así se resuelve: el complemento de un número con ceros al final (3 740 → 6 260 es el caso de la escena), con el
    // atajo y su comprobación. «Ahora tú» pide un 0 en medio, la base n, el número desde su complemento o cifras ocultas.
    resuelve: {
      pieza: PU,
      generar(s) {
        const r = azar(s + 900), ceros = r.ent(1, 2), k = 4;
        const cs = Array.from({ length: k - ceros }, () => r.ent(1, 9));
        const N = +(cs.join('') + '0'.repeat(ceros)), C = ca(N), u = cs.length - 1;
        const partes = cs.map((d, i) => (i < u ? `9 − ${d} = ${9 - d}` : `10 − ${d} = ${10 - d}`)).join(' ; ');
        return {
          enunciado: `¿Cuál es el complemento aritmético de ${f(N, 0)}?`,
          datos: [DR.ca],
          dibujo: cuaderno(['10000', String(N)], { op: '−' }),
          pasos: [
            { tipo: 'pide', texto: `Piden lo que le falta a ${f(N, 0)} para llegar a su meta.` },
            { tipo: 'datos', texto: [`${f(N, 0)} tiene ${k} cifras: la meta es un 1 con ${k} ceros, `, bas('10 000'), `. Termina en ${ceros === 1 ? 'un 0' : 'dos ceros'}.`] },
            { tipo: 'regla', texto: 'Atajo: cada cifra se resta de 9 y la última que no es 0, de 10; los ceros del final se quedan.' },
            { tipo: 'cuentas', texto: `Aplico el atajo y copio ${ceros === 1 ? 'el 0' : 'los dos ceros'} del final.`, ecuacion: [partes, '   →   ', res(f(C, 0))],
              dibujo: cuaderno(['10000', String(N)], { op: '−', resultado: String(C) }) },
            { tipo: 'sentido', texto: 'Compruebo: el número y su complemento llenan la meta.', ecuacion: [`${f(N, 0)} + ${f(C, 0)} = `, bas('10 000')] },
          ],
          respuesta: ['CA = ', res(f(C, 0))],
        };
      },
    },
    ahoraTu: {
      pieza: PU,
      voz: 'Primero la meta: un 1 con tantos ceros como cifras.',
      generar(sem) {
        const r = azar(sem + 61), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoCA, r);
        if (tipo === 1) return conCuatro(casoCABase, r);
        if (tipo === 2) return conCuatro(casoDesdeCA, r);
        return conCuatro(casoCAOculto, r);
      },
    },
  };

  // ---------- Idea 4: cifras que faltan, columna por columna (cifras ocultas en las operaciones) ----------
  // Propuesta §1 a §7. Objeto: el cuaderno de cuentas de doña Juana con cifras manchadas de chicha morada (opción cuenta
  // de arit-puesto, con '#' para una mancha; dibujo de prueba).
  // Cambia: la cifra que se prueba bajo cada mancha. · Permanece: la cuenta (bien hecha) y el resultado. · Progresa:
  // unidades → decenas → centenas, cada una con lo que le lleva la anterior. · Se reserva: la resta manchada, con
  // préstamos: es de la predicción (8☐2 − ☐57 = 375). · Debe verse: lo que se lleva de una columna decide la cifra de la
  // siguiente; la mancha tiene una sola cifra posible.
  // Errores (hipótesis de aula; la trampa 29 de San Marcos, 2022 y 2024-I, respalda AT-SIN-DESCONTAR): AT-SIN-DESCONTAR
  // olvida que la columna prestó · AT-DOBLE-DESCUENTO descuenta dos préstamos · AT-SUFICIENCIA cree que con dos manchas
  // faltan datos (el código es de razonamiento numérico) · AT-MENOR-MAYOR resta el menor del mayor · AT-LLEVA-OLVIDA no
  // suma la llevada · AT-REVERSO-CIEN mira solo las centenas · AT-REVERSO-NOVENTA olvida las unidades · AT-REVERSO-ONCE
  // usa el 11 de una suma con el reverso · AT-MEDIO-CERO no aprovecha la cifra del medio · AT-REVERSO-C toma c = a − c ·
  // AT-MENOR toma el menor número posible · AT-LLEVA-DOBLE suma dos veces la llevada.
  // La cuenta del juego: ☐85 + 6☐☐ = 1 282 (una sola solución, 585 + 697, como en cifrasFaltantes del motor).
  const NOM_COL = ['Unidades', 'Decenas', 'Centenas', 'Millares'];
  const cuentaO = v => [`${v.x}85`, `6${v.y}${v.z}`];
  // Columna por columna con las cifras que se prueban: la primera que no termina en la cifra del cuaderno.
  function revisaSuma(filas, total) {
    const L = total.length, cols = [];
    let ll = 0;
    for (let k = 0; k < L; k++) {
      const dig = filas.map(x => +(x[x.length - 1 - k] || 0)), t = dig.reduce((a, b) => a + b, 0) + ll;
      cols.push({ k, dig, entra: ll, t, cifra: t % 10, debe: +total[L - 1 - k], sale: Math.floor(t / 10) });
      ll = Math.floor(t / 10);
    }
    const ultima = cols[L - 1];
    // La última columna del total (los millares) es solo la llevada: cuadra si coincide.
    const mal = cols.find(c => (c.k < L - 1 || c.dig.some(x => x)) && c.cifra !== c.debe) || (ultima.dig.every(x => !x) && ultima.entra !== ultima.debe ? ultima : null);
    return { cols, mal };
  }
  const puestoO = v => {
    const { cols } = revisaSuma(cuentaO(v), '1282');
    const ll = Object.fromEntries(cols.filter(c => c.sale && c.k < 3).map(c => [c.k + 1, c.sale]));
    return { cuenta: { solo: true, sumandos: cuentaO(v), resultado: '1282', manchas: [[0, 2], [1, 1], [1, 0]], llevadas: ll } };
  };
  // Resolver por fuerza bruta una cuenta con manchas ('#'), con la regla de la cuenta que se da: la bien hecha o una con
  // un error al prestar o al llevar (así salen las opciones incorrectas: lo que encontraría quien comete ese error).
  function digCol(filas, op, modo) {
    // Las cifras del resultado (desde las unidades) según el modo: 'olvida' suma sin llevar; 'sin' presta sin quitarle 1
    // a la columna que prestó; 'menor' resta en cada columna el menor del mayor.
    const L = Math.max(...filas.map(x => x.length)) + 1, A = digitos(filas[0]), B = digitos(filas[1]), out = [];
    if (op === '+') {
      let ll = 0;
      for (let k = 0; k < L; k++) { const t = (A[k] || 0) + (B[k] || 0) + (modo === 'olvida' ? 0 : ll); out.push(t % 10); ll = t >= 10 ? 1 : 0; }
      return out;
    }
    const a = A.slice(); while (a.length < L) a.push(0);
    for (let k = 0; k < L; k++) {
      const b = B[k] || 0;
      if (modo === 'menor') out.push(Math.abs(a[k] - b));
      else if (a[k] < b) { if (modo !== 'sin') a[k + 1] -= 1; out.push(a[k] + 10 - b); }
      else out.push(a[k] - b);
    }
    return out;
  }
  function soluciones(filas, total, op, modo) {
    const huecos = [];
    filas.forEach((x, i) => x.split('').forEach((c, j) => { if (c === '#') huecos.push([i, j]); }));
    total.split('').forEach((c, j) => { if (c === '#') huecos.push([2, j]); });
    const sols = [];
    for (let t = 0; t < 10 ** huecos.length; t++) {
      const ds = String(t).padStart(huecos.length, '0').split('');
      const F = filas.map(x => x.split('')), Z = total.split('');
      huecos.forEach(([i, j], h) => { if (i < 2) F[i][j] = ds[h]; else Z[j] = ds[h]; });
      if (F.some(x => x[0] === '0' && x.length > 1) || (Z[0] === '0' && Z.length > 1)) continue;
      const fs = F.map(x => x.join('')), z = Z.join('');
      let ok;
      if (modo === 'bien') ok = (op === '+' ? +fs[0] + +fs[1] : +fs[0] - +fs[1]) === +z;
      else { const d = digCol(fs, op, modo), zz = digitos(z); ok = d.every((x, k) => (k < zz.length ? x === zz[k] : x === 0)); }
      if (ok) sols.push(ds.map(Number));
    }
    return sols;
  }
  // Ahora tú · tipo 0 (examen, como San Marcos 2022 y 2024-I): una resta con dos manchas; la suma de las cifras manchadas.
  function casoRestaManchada(r) {
    const M = r.ent(400, 999), S = r.ent(101, M - 100), D = M - S, m = String(M), s = String(S);
    if (!(+m[2] < +s[2] && +m[1] - 1 < +s[1])) return null;
    const filas = [`${m[0]}#${m[2]}`, `#${s.slice(1)}`], total = String(D);
    const ok = soluciones(filas, total, '-', 'bien'), sin = soluciones(filas, total, '-', 'sin');
    if (ok.length !== 1 || sin.length !== 1) return null;
    const bien = ok[0][1];
    return {
      pregunta: ['En el cuaderno, ', `${m[0]}☐${m[2]} − ☐${s.slice(1)} = ${total}`, '. ¿Qué cifra está bajo la mancha del sustraendo?'],
      datos: [DR.mancha, DR.bien, DR.resta],
      dibujo: cuaderno(filas, { op: '−', resultado: total }),
      opciones: opciones(bien, [
        { id: 'sin', valor: sin[0][1], error: 'AT-SIN-DESCONTAR', siFuera: 'Ver el préstamo de las unidades está bien. Pero las centenas también prestaron: quedan con uno menos.' },
        { id: 'doble', valor: bien - 1, error: 'AT-DOBLE-DESCUENTO', siFuera: 'Descontar el préstamo está bien. Pero las centenas prestaron una sola vez.' },
        { id: 'nose', valor: 'No se puede saber', error: 'AT-SUFICIENCIA', siFuera: 'Con dos manchas parece que faltan datos, pero cada columna deja una sola cifra posible.' },
      ], x => String(x)),
      solucion: { texto: `Desde las unidades, con cada préstamo: ${M} − ${S} = ${D}.`, ecuacion: ['☐ = ', res(bien)] },
    };
  }
  // Ahora tú · tipo 1: una suma con dos manchas; la cifra de una de ellas (la de las decenas del segundo sumando).
  function casoSumaManchada(r) {
    const A = r.ent(100, 899), B = r.ent(100, 999 - A + 900), C = A + B, a = String(A), b = String(B), c = String(C);
    if (!(+a[2] + +b[2] >= 10)) return null;
    const filas = [`#${a.slice(1)}`, `${b[0]}#${b[2]}`], total = c;
    const ok = soluciones(filas, total, '+', 'bien'), olv = soluciones(filas, total, '+', 'olvida');
    if (ok.length !== 1 || olv.length !== 1) return null;
    const bien = ok[0][1], olvida = olv[0][1];
    const doble = (bien + 9) % 10;
    return {
      pregunta: ['En el cuaderno, ', `☐${a.slice(1)} + ${b[0]}☐${b[2]} = ${f(C, 0)}`, '. ¿Qué cifra está bajo la mancha del segundo sumando?'],
      datos: [DR.mancha, DR.bien, DO.columna],
      dibujo: cuaderno(filas, { resultado: total }),
      opciones: opciones(bien, [
        { id: 'olvida', valor: olvida, error: 'AT-LLEVA-OLVIDA', siFuera: 'Ir por columnas está bien. Pero las unidades llevan 1 a las decenas.' },
        { id: 'doble', valor: doble, error: 'AT-LLEVA-DOBLE', siFuera: 'Contar la llevada está bien. Pero se suma una sola vez.' },
        { id: 'nose', valor: 'No se puede saber', error: 'AT-SUFICIENCIA', siFuera: 'Con dos manchas parece que faltan datos, pero cada columna deja una sola cifra posible.' },
      ], x => String(x)),
      solucion: { texto: `Unidades: ${a[2]} + ${b[2]} = ${+a[2] + +b[2]}, se lleva 1. Decenas: ${a[1]} + ☐ + 1 debe terminar en ${c[c.length - 2]}.`, ecuacion: ['☐ = ', res(bien)] },
    };
  }
  // Ahora tú · tipo 2: un número de tres cifras menos su reverso, con a − c dado.
  function casoReverso(r) {
    const k = r.ent(2, 8);
    return {
      pregunta: ['Las cifras de ', { raya: ['abc'] }, ' cumplen a − c = ', String(k), '. ¿Cuánto es ', { raya: ['abc'] }, ' − ', { raya: ['cba'] }, '?'],
      datos: [DR.abc, DR.reverso],
      opciones: opciones(99 * k, [
        { id: 'cien', valor: 100 * k, error: 'AT-REVERSO-CIEN', siFuera: 'Las centenas aportan 100 × (a − c), es cierto. Pero las unidades restan a − c.' },
        { id: 'noventa', valor: 90 * k, error: 'AT-REVERSO-NOVENTA', siFuera: 'Ver que las decenas se anulan está bien. Pero es 100 × (a − c) menos 1 × (a − c).' },
        { id: 'once', valor: 11 * k, error: 'AT-REVERSO-ONCE', siFuera: 'El 11 es de una suma de dos cifras con su reverso. Aquí son tres cifras y se resta.' },
      ], x => f(x, 0)),
      solucion: { texto: 'Las decenas se anulan; quedan 100 × a + c − 100 × c − a.', ecuacion: [{ raya: ['abc'] }, ' − ', { raya: ['cba'] }, ` = 99 × ${k} = `, res(f(99 * k, 0))] },
    };
  }
  // Ahora tú · tipo 3 (examen, como San Marcos 2019-II): el mayor a̅b̅c̅ con a̅b̅c̅ − c̅b̅a̅ dado.
  function casoMayorReverso(r) {
    const k = r.ent(2, 8), D = 99 * k;
    const mayor = 990 + (9 - k), medio = 900 + (9 - k), conC = 990 + k, menor = (k + 1) * 100 + 1;
    return {
      pregunta: ['Si ', { raya: ['abc'] }, ' − ', { raya: ['cba'] }, ` = ${D}, ¿cuál es el mayor valor que puede tener `, { raya: ['abc'] }, '?'],
      datos: [DR.abc, DR.reverso, 'a, b y c son cifras; a y c no son 0'],
      opciones: opciones(mayor, [
        { id: 'medio', valor: medio, error: 'AT-MEDIO-CERO', siFuera: 'Poner a = 9 está bien. Pero la cifra del medio no cambia la resta: puede ser 9.' },
        { id: 'conc', valor: conC, error: 'AT-REVERSO-C', siFuera: `a − c = ${k} está bien. Pero c es 9 − ${k}, no ${k}.` },
        { id: 'menor', valor: menor, error: 'AT-MENOR', siFuera: 'Ese cumple la resta, pero es el menor posible. Se pide el mayor.' },
      ], x => String(x)),
      solucion: { texto: `${D} = 99 × ${k}: a − c = ${k}. Para el mayor, a = 9, b = 9 y c = ${9 - k}.`, ecuacion: [`${mayor} − ${String(mayor).split('').reverse().join('')} = ${D}`] },
    };
  }

  // Ejemplos resueltos de la idea 4. Cuentas rehechas aparte (cuentas-ideas.js: fuerza bruta propia sobre cada mancha):
  // 4☐ + 25 = 72 → 7; 36 + 47 = 8☐ → 3; 9☐ − 34 = 58 → 2; 726 − 627 = 99; 456; ☐7 + 5☐ = 112 → 5 y 5; 5☐0 − ☐27 = 373
  // → 0 y 1; 732 − 237 = 495 = 99 × 5; 854 − 458 = 396; c̅b̅a̅ − a̅b̅c̅ = 198; 7☐8 − 6☐9 = ☐89 → 9, 0, 1 (suma 10; sin
  // descontar salen 9 u 11); a̅b̅c̅ − c̅b̅a̅ = 396 → 995; a − c = 6 → 594, cifras 18; ☐12 + 7☐7 = 17☐9 → 9, 9, 0 (suma 18; sin
  // llevar no cuadra ninguna; anotando 1 en vez de 0, 19); a̅b̅c̅ + c̅b̅a̅ = 1 332 con cifras consecutivas → 567.
  const cuO = (filas, o = {}) => cuaderno(filas, o);
  const EJEMPLOS_OCULTAS = [
    { nivel: 1, titulo: 'Una mancha en las unidades',
      enunciado: 'En el cuaderno se lee 4☐ + 25 = 72. ¿Qué cifra está bajo la mancha?',
      datos: [DR.mancha, DR.bien],
      figura: cuO(['4#', '25'], { resultado: '72' }),
      solucion: [
        { texto: 'Unidades: ☐ + 5 termina en 2. Solo puede ser 12: ☐ = 7, y se lleva 1.', ecuacion: ['7 + 5 = 12 = ', lleva(1), ' × ', bas(10), ' + 2'] },
        { texto: 'Compruebo las decenas: 4 + 2 + 1 = 7, como dice el cuaderno.' },
      ],
      respuesta: ['☐ = ', res(7)] },
    { nivel: 1, titulo: 'Una mancha en el resultado',
      enunciado: 'En el cuaderno se lee 36 + 47 = 8☐. ¿Qué cifra está bajo la mancha?',
      datos: [DR.mancha, DR.bien],
      figura: cuO(['36', '47'], { resultado: '8#' }),
      solucion: [{ texto: 'Unidades: 6 + 7 = 13. Se anota 3 y se lleva 1; las decenas dan 3 + 4 + 1 = 8, como dice el cuaderno.', ecuacion: ['6 + 7 = 13 = ', lleva(1), ' × ', bas(10), ' + ', res(3)] }],
      respuesta: ['☐ = ', res(3)] },
    { nivel: 1, titulo: 'Una mancha en una resta',
      enunciado: 'En el cuaderno se lee 9☐ − 34 = 58. ¿Qué cifra está bajo la mancha?',
      datos: [DR.mancha, DR.bien, DR.resta],
      figura: cuO(['9#', '34'], { op: '−', resultado: '58' }),
      solucion: [
        { texto: 'Decenas: 9 − 3 da 6, pero el cuaderno dice 5: las decenas prestaron 1.' },
        { texto: 'Unidades: con el préstamo, ☐ + 10 − 4 = 8.', ecuacion: ['☐ + 10 − 4 = 8   →   ☐ = ', res(2)] },
      ],
      respuesta: ['☐ = ', res(2)] },
    { nivel: 1, titulo: 'Un número y su reverso',
      enunciado: 'Escribe el reverso de 726 y réstalo del número.',
      datos: [DR.reverso],
      solucion: [{ texto: 'El reverso tiene las mismas cifras al revés: 627.', ecuacion: ['726 − 627 = ', res(99)] }],
      respuesta: ['726 − 627 = ', res(99)] },
    { nivel: 1, titulo: 'Tres cifras consecutivas',
      enunciado: 'Un número de tres cifras consecutivas y crecientes empieza con 4. ¿Cuál es?',
      datos: ['Consecutivas: van de 1 en 1, sin saltarse ninguna'],
      solucion: [{ texto: 'Después del 4 vienen el 5 y el 6.', ecuacion: ['4, 5, 6   →   ', res(456)] }],
      respuesta: ['El número es ', res(456)] },
    { nivel: 2, titulo: 'Dos manchas en una suma',
      enunciado: 'En el cuaderno se lee ☐7 + 5☐ = 112. ¿Qué cifras están bajo las manchas?',
      datos: [DR.mancha, DR.bien, DO.columna],
      figura: cuO(['#7', '5#'], { resultado: '112' }),
      solucion: [
        { texto: 'Unidades: 7 + ☐ termina en 2: solo 12. La mancha de abajo es 5, y se lleva 1.', ecuacion: ['7 + 5 = 12 = ', lleva(1), ' × ', bas(10), ' + 2'] },
        { texto: 'Decenas: ☐ + 5 + 1 tiene que dar 11 (se anota 1 y el otro 1 abre las centenas).', ecuacion: ['☐ + 5 + ', lleva(1), ' = 11   →   ☐ = ', res(5)] },
      ],
      respuesta: [res(57), ' + ', res(55), ' = 112'] },
    { nivel: 2, titulo: 'Una resta con un cero',
      enunciado: 'En el cuaderno se lee 5☐0 − ☐27 = 373. ¿Qué cifras están bajo las manchas?',
      datos: [DR.mancha, DR.bien, DR.resta],
      figura: cuO(['5#0', '#27'], { op: '−', resultado: '373' }),
      solucion: [
        { texto: 'Unidades: 0 no alcanza para 7; con el préstamo, 10 − 7 = 3, como dice el cuaderno.' },
        { texto: 'Decenas: la mancha prestó 1 y tiene que dar 7 al quitar 2. Solo cuadra con otro préstamo: ☐ − 1 + 10 − 2 = 7.', ecuacion: ['☐ = ', res(0)] },
        { texto: 'Centenas: prestaron 1, quedan 4: 4 − ☐ = 3.', ecuacion: ['☐ = ', res(1), '   →   500 − 127 = 373'] },
      ],
      respuesta: ['Arriba ', res(0), ' y abajo ', res(1)] },
    { nivel: 2, titulo: 'Un número menos su reverso',
      enunciado: '¿Cuánto es 732 − 237? Compáralo con la resta de la primera y la última cifra.',
      datos: [DR.abc, DR.reverso],
      figura: cuO(['732', '237'], { op: '−' }),
      solucion: [
        { texto: 'Por columnas: 12 − 7 = 5, 12 − 3 = 9 y 6 − 2 = 4.', ecuacion: ['732 − 237 = ', res(495)] },
        { texto: 'Y 7 − 2 = 5: la diferencia es 99 × 5.', ecuacion: ['99 × 5 = 495'] },
      ],
      respuesta: ['732 − 237 = ', res(495), ' = 99 × 5'] },
    { nivel: 2, titulo: 'La cifra del medio',
      enunciado: '¿Qué cifra tiene en las decenas la resta 854 − 458?',
      datos: [DR.abc, DR.reverso],
      figura: cuO(['854', '458'], { op: '−', foco: 1 }),
      solucion: [
        { texto: '458 es el reverso de 854, y 8 − 4 = 4: la diferencia es 99 × 4.', ecuacion: ['99 × 4 = 396'] },
        { texto: 'Las decenas: 5 − 1 no alcanza para 5, se abre una caja: 4 + 10 − 5 = 9.', ecuacion: ['4 + 10 − 5 = ', res(9)] },
      ],
      respuesta: ['La cifra de las decenas es ', res(9)] },
    { nivel: 2, titulo: 'Consecutivas al revés',
      enunciado: ['Las cifras de ', { raya: ['abc'] }, ' son consecutivas y crecientes. ¿Cuánto es ', { raya: ['cba'] }, ' − ', { raya: ['abc'] }, '?'],
      datos: [DR.abc, DR.reverso],
      solucion: [
        { texto: 'Crecientes y consecutivas: c es 2 más que a. Las decenas se anulan.', ecuacion: [{ raya: ['cba'] }, ' − ', { raya: ['abc'] }, ' = 100 × (c − a) − (c − a)'] },
        { texto: 'Con c − a = 2:', ecuacion: ['99 × 2 = ', res(198)] },
      ],
      respuesta: [{ raya: ['cba'] }, ' − ', { raya: ['abc'] }, ' = ', res(198)] },
    { nivel: 3, titulo: 'Una resta con tres manchas',
      enunciado: 'En el cuaderno se lee 7☐8 − 6☐9 = ☐89. ¿Cuánto suman las tres cifras manchadas?',
      alternativas: ['9', '10', '11', 'No se puede saber'],
      datos: [DR.mancha, DR.bien, DR.resta],
      figura: cuO(['7#8', '6#9'], { op: '−', resultado: '#89' }),
      solucion: [
        { texto: 'Unidades: 8 no alcanza para 9; con el préstamo, 18 − 9 = 9, como dice el cuaderno.' },
        { texto: 'Decenas: la mancha de arriba prestó 1 y tiene que dar 8. Si no presta otra vez, ☐ − 1 − ☐ = 8: arriba 9 y abajo 0.', ecuacion: ['9 − 1 − 0 = 8'] },
        { texto: 'Centenas: 7 − 6 = 1. Las manchas son 9, 0 y 1.', ecuacion: ['9 + 0 + 1 = ', res(10)] },
        { texto: ['Las trampas: ', letra('A'), ' y ', letra('C'), ' olvidan que las decenas prestaron (8 − 0 o 9 − 1); ', letra('D'), ' cree que faltan datos.'] },
      ],
      respuesta: [letra('B'), ': ', res(10)] },
    { nivel: 3, titulo: 'El mayor número con su reverso',
      enunciado: ['Si ', { raya: ['abc'] }, ' − ', { raya: ['cba'] }, ' = 396, ¿cuál es el mayor valor de ', { raya: ['abc'] }, '?'],
      alternativas: ['905', '994', '995', '501'],
      datos: [DR.abc, DR.reverso, 'a, b y c son cifras; a y c no son 0'],
      solucion: [
        { texto: 'La resta es 99 × (a − c), y 396 = 99 × 4: entonces a − c = 4.' },
        { texto: 'Para el mayor: a = 9, c = 5, y la cifra del medio, que no cambia la resta, también 9.', ecuacion: ['995 − 599 = 396'] },
        { texto: ['Las trampas: ', letra('A'), ' pone 0 en el medio; ', letra('B'), ' toma c = 4; ', letra('D'), ' es el menor posible.'] },
      ],
      respuesta: [letra('C'), ': ', res(995)] },
    { nivel: 3, titulo: 'La diferencia suma 18',
      enunciado: ['Si ', { raya: ['abc'] }, ' − ', { raya: ['cba'] }, ' = ', { raya: [res('mnp')] }, ' y a − c = 6, ¿cuánto vale m + n + p?'],
      alternativas: ['9', '18', '6', '27'],
      datos: [DR.abc, DR.reverso],
      solucion: [
        { texto: 'La resta es 99 × (a − c) = 99 × 6.', ecuacion: ['99 × 6 = ', res(594)] },
        { texto: 'Las cifras de la diferencia suman 5 + 9 + 4.', ecuacion: ['5 + 9 + 4 = ', res(18)] },
        { texto: ['Las trampas: ', letra('A'), ' olvida el 9 del medio; ', letra('C'), ' toma a − c; ', letra('D'), ' suma tres nueves.'] },
      ],
      respuesta: [letra('B'), ': ', res(18)] },
    { nivel: 3, titulo: 'Una suma con tres manchas',
      enunciado: 'En el cuaderno se lee ☐12 + 7☐7 = 17☐9. ¿Cuánto suman las tres cifras manchadas?',
      alternativas: ['9', '18', '19', 'No se puede saber'],
      datos: [DR.mancha, DR.bien, DO.columna],
      figura: cuO(['#12', '7#7'], { resultado: '17#9' }),
      solucion: [
        { texto: 'Unidades: 2 + 7 = 9, sin llevada. Centenas: ☐ + 7, más lo que llegue de las decenas, tiene que dar 17.' },
        { texto: 'Sin llevada, la mancha sería 10, que no es una cifra: las decenas llevan 1, y la mancha de arriba es 9.', ecuacion: ['9 + 7 + ', lleva(1), ' = 17'] },
        { texto: 'Decenas: 1 + ☐ llegó a 10 o más: ☐ = 9, y en el total se anota 0.', ecuacion: ['912 + 797 = 1 709   →   9 + 9 + 0 = ', res(18)] },
        { texto: ['Las trampas: ', letra('A'), ' cuenta una sola mancha; ', letra('C'), ' anota 1 en el total en vez de 0; ', letra('D'), ' olvida la llevada y no le cuadra nada.'] },
      ],
      respuesta: [letra('B'), ': ', res(18)] },
    { nivel: 3, titulo: 'Consecutivas que suman',
      enunciado: ['Las cifras de ', { raya: ['abc'] }, ' son consecutivas y crecientes, y ', { raya: ['abc'] }, ' + ', { raya: ['cba'] }, ' = 1 332. ¿Cuál es ', { raya: ['abc'] }, '?'],
      alternativas: ['456', '567', '678', '666'],
      datos: [DR.abc, DR.reverso],
      solucion: [
        { texto: 'Con b = a + 1 y c = a + 2, la suma es 101 × (a + c) + 20 × b.', ecuacion: ['101 × (2a + 2) + 20 × (a + 1) = 222 × a + 222'] },
        { texto: '222 × a + 222 = 1 332, así que 222 × a = 1 110 y a = 5.', ecuacion: ['567 + 765 = 1 332'] },
        { texto: ['Las trampas: ', letra('A'), ' y ', letra('C'), ' dan 1 110 y 1 554; ', letra('D'), ' divide 1 332 entre 2.'] },
      ],
      respuesta: [letra('B'), ': ', res(567)] },
  ];

  const cifrasOcultas = {
    id: 'cifras-ocultas',
    titulo: 'Cifras que faltan, columna por columna',
    pregunta: '¿Cómo se descubre una cifra manchada?',
    temas: ['Cifras ocultas en las operaciones'],
    pieza: PU,
    aprendizaje: 'Una cuenta con cifras ocultas se reconstruye desde las unidades: en cada columna, la llevada o el préstamo de la anterior decide qué cifra cabe.',
    actividad: 'Probar cifras bajo las manchas hasta que la cuenta del cuaderno cuadre.',
    lee: {
      tarjetas: [
        { titulo: 'El cuaderno manchado', texto: 'A doña Juana se le volteó un vaso de chicha morada sobre el cuaderno. Bajo cada mancha hay una cifra de 0 a 9, y la cuenta estaba bien hecha.',
          pieza: PU, dibujo: { datos: { cuenta: { solo: true, sumandos: ['5#3', '#28'], resultado: '901' } }, estado: {} } },
        { titulo: 'Reverso y consecutivos', texto: 'El reverso de 365 es 563: las mismas cifras al revés. Las cifras de 345 son consecutivas: van de 1 en 1, sin saltarse ninguna.' },
        { titulo: 'Qué mirar al jugar', texto: 'Prueba una cifra bajo cada mancha. Empieza por las unidades: lo que se lleva de una columna cambia la siguiente.' },
      ],
    },
    ejemplos: EJEMPLOS_OCULTAS,
    juega: {
      pieza: PU,
      consigna: 'Se mancharon tres cifras del cuaderno de doña Juana: ☐85 + 6☐☐ = 1 282. Prueba una cifra en cada mancha.',
      mision: {
        texto: 'Encuentra las tres cifras para que la cuenta del cuaderno cuadre.',
        logrado: v => !revisaSuma(cuentaO(v), '1282').mal,
        bien: 'La llevada de cada columna decidió la cifra de la siguiente: 585 + 697 = 1 282.',
      },
      voz: 'Empieza por las unidades.',
      leyenda: [
        { s: '☐', t: 'una mancha: la cifra que se busca' },
        { s: lleva('lleva'), t: 'lo que pasa a la columna siguiente' },
        { s: res('total'), t: 'el resultado: está bien hecho' },
      ],
      controles: [
        { id: 'x', etiqueta: 'Mancha de las centenas, arriba', min: 0, max: 9, paso: 1, inicio: 0, decimales: 0 },
        { id: 'y', etiqueta: 'Mancha de las decenas, abajo', min: 0, max: 9, paso: 1, inicio: 0, decimales: 0 },
        { id: 'z', etiqueta: 'Mancha de las unidades, abajo', min: 0, max: 9, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => ({ datos: puestoO(v), estado: {} }),
      lectura: v => {
        const { mal } = revisaSuma(cuentaO(v), '1282');
        if (!mal) return ['Cuadra: ', `${cuentaO(v).join(' + ')} = `, res('1 282')];
        const sum = mal.dig.filter((x, i) => mal.k < 3 || x).map(String);
        return [`${NOM_COL[mal.k]}: ${sum.join(' + ')}`, ...(mal.entra ? [' + ', lleva(mal.entra)] : []), ` = ${mal.t}, no termina en `, res(mal.debe)];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'En el cuaderno hay una resta manchada: 8☐2 − ☐57 = 375. ¿Qué cifra está bajo la mancha del 57?',
      datos: ['La resta está bien hecha', 'Bajo cada mancha hay una cifra de 0 a 9'],
      voz: 'Columna por columna, desde las unidades.',
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'sin', texto: '5', error: 'AT-SIN-DESCONTAR', siFuera: 'Restar 8 − ☐ = 3 está bien si nadie prestó. Pero las centenas le prestaron a las decenas.' },
        { id: 'doble', texto: '3', error: 'AT-DOBLE-DESCUENTO', siFuera: 'Descontar el préstamo está bien. Pero las centenas prestaron una sola vez.' },
        { id: 'nose', texto: 'No se puede saber', error: 'AT-SUFICIENCIA', siFuera: 'Con dos manchas parece que faltan datos, pero cada columna deja una sola cifra posible.' },
      ],
      dibujo: cuO(['8#2', '#57'], { op: '−', resultado: '375' }),
      revelar: cuO(['832', '457'], { op: '−', resultado: '375', manchas: [[0, 1], [1, 2]], presta: { 0: '12', 1: '12', 2: '7' } }),
      coincide: 'Coincide: 832 − 457 = 375; las centenas prestaron y quedaron en 7.',
      noCoincide: 'Revisemos: las decenas pidieron prestado, así que las centenas quedan con uno menos.',
    },
    mira: {
      pieza: PU,
      datos: { cuenta: { solo: true, sumandos: ['8#2', '#57'], op: '−', resultado: '375', foco: 0 }, pasos: [
        {},
        { cuenta: { solo: true, sumandos: ['8#2', '#57'], op: '−', resultado: '375', foco: 0, presta: { 0: '12' } } },
        { cuenta: { solo: true, sumandos: ['8#2', '#57'], op: '−', resultado: '375', foco: 1, presta: { 0: '12' } } },
        { cuenta: { solo: true, sumandos: ['832', '#57'], op: '−', resultado: '375', foco: 1, manchas: [[0, 1]], presta: { 0: '12', 1: '12' } } },
        { cuenta: { solo: true, sumandos: ['832', '457'], op: '−', resultado: '375', foco: 2, manchas: [[0, 1], [1, 2]], presta: { 0: '12', 1: '12', 2: '7' } } },
        { cuenta: { solo: true, sumandos: ['832', '457'], op: '−', resultado: '375', manchas: [[0, 1], [1, 2]], presta: { 0: '12', 1: '12', 2: '7' } } },
        { cuenta: { solo: true, sumandos: ['914', '419'], op: '−', resultado: '495' } },
      ] },
      voz: 'Lo que pasa en una columna decide la siguiente.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Empiezo por las unidades: 2 no alcanza para quitar 7.', ecuacion: ['2 < 7'] },
        { estado: { paso: 1 }, texto: 'Se abrió una bolsita: 12 − 7 = 5, como dice el cuaderno.', ecuacion: ['12 − 7 = ', res(5)] },
        { estado: { paso: 2 }, texto: 'Decenas: la mancha prestó 1; para dejar 7 al quitar 5, recibió otro.', ecuacion: ['☐ − 1 + 10 − 5 = 7'] },
        { estado: { paso: 3 }, texto: 'Entonces la mancha de arriba es 3.', ecuacion: ['☐ = 3'] },
        { estado: { paso: 4 }, texto: 'Centenas: prestaron 1 y quedan 7. Si 7 − ☐ = 3, la mancha es 4.', ecuacion: [lleva(7), ' − ☐ = 3   →   ☐ = 4'] },
        { estado: { paso: 5 }, texto: 'Compruebo: cada mancha tiene una sola cifra posible.', ecuacion: ['832 − 457 = ', res(375)] },
        { estado: { paso: 6 }, texto: 'Con el reverso pasa algo fijo: 914 − 419 = 99 × (9 − 4).', ecuacion: ['914 − 419 = ', res(495), ' = 99 × 5'] },
      ],
    },
    regla: {
      texto: 'Se empieza por las unidades. En cada columna, la llevada o el préstamo que viene de la anterior decide qué cifra cabe. Una letra que se repite vale lo mismo.',
      ecuacion: [{ raya: ['abc'] }, ' − ', { raya: ['cba'] }, ' = ', res('99 × (a − c)'), SEP, { raya: ['abc'] }, ' = 100 × a + 10 × b + c'],
      condicion: 'Con a mayor que c. Si a − c = 1, la diferencia es 99; si no, sus cifras suman 18.',
      voz: 'Columna por columna: cada una le deja algo a la siguiente.',
    },
    // Así se resuelve: una suma con dos manchas (una en cada sumando), columna por columna. «Ahora tú» pide restas
    // manchadas, una mancha de una suma, un número menos su reverso o el mayor a̅b̅c̅ con su reverso.
    resuelve: {
      pieza: PU,
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const A = r.ent(100, 899), B = r.ent(100, 899), C = A + B, a = String(A), b = String(B), c = String(C);
          if (+a[2] + +b[2] < 10) continue;
          const filas = [`${a[0]}#${a[2]}`, `${b[0]}${b[1]}#`];
          if (soluciones(filas, c, '+', 'bien').length !== 1) continue;
          const u = +b[2], ll = 1, t1 = +a[1] + +b[1] + ll;
          return {
            enunciado: ['En el cuaderno se lee ', `${a[0]}☐${a[2]} + ${b[0]}${b[1]}☐ = ${f(C, 0)}`, '. ¿Qué cifras están bajo las manchas?'],
            datos: [DR.mancha, DR.bien, DO.columna],
            dibujo: cuO(filas, { resultado: c }),
            pasos: [
              { tipo: 'pide', texto: 'Piden las dos cifras manchadas: una en las decenas de arriba y otra en las unidades de abajo.' },
              { tipo: 'regla', texto: 'Empiezo por las unidades; lo que se lleva de una columna entra en la siguiente.' },
              { tipo: 'cuentas', texto: `Unidades: ${a[2]} + ☐ termina en ${c[c.length - 1]}, que es menos que ${a[2]}: la columna pasó de 10. ${a[2]} + ☐ = ${10 + +c[c.length - 1]}, así que ☐ = ${u}, y se lleva 1.`,
                ecuacion: [`${a[2]} + `, res(u), ` = ${+a[2] + u} = `, lleva(1), ' × ', bas(10), ` + ${c[c.length - 1]}`], dibujo: cuO([`${a[0]}#${a[2]}`, b], { resultado: c, manchas: [[1, 0]], llevadas: { 1: 1 } }) },
              { tipo: 'cuentas', texto: `Decenas: ☐ + ${b[1]} + 1 termina en ${c[c.length - 2]}: ☐ = ${a[1]}.`,
                ecuacion: [res(a[1]), ` + ${b[1]} + `, lleva(1), ` = ${t1}`], dibujo: cuO([a, b], { resultado: c, manchas: [[0, 1], [1, 0]], llevadas: Object.assign({ 1: 1 }, t1 >= 10 ? { 2: 1 } : {}) }) },
              { tipo: 'sentido', texto: 'Compruebo la cuenta entera con las dos cifras.', ecuacion: [`${A} + ${B} = ${f(C, 0)}`] },
            ],
            respuesta: ['Arriba ', res(a[1]), ' y abajo ', res(u)],
          };
        }
      },
    },
    ahoraTu: {
      pieza: PU,
      voz: 'Desde las unidades, con lo que lleva o presta cada columna.',
      generar(sem) {
        const r = azar(sem + 73), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoRestaManchada, r);
        if (tipo === 1) return conCuatro(casoSumaManchada, r);
        if (tipo === 2) return conCuatro(casoReverso, r);
        return conCuatro(casoMayorReverso, r);
      },
    },
  };

  // ---------- Idea 5: multiplicar es juntar bolsas iguales (multiplicación) ----------
  // Propuesta §1 a §7. Objeto: bolsas de sorpresa de 24 caramelos sobre el mostrador (arit-puesto, con `extra`: los
  // caramelos agregados van en violeta, arriba en cada bolsa).
  // Cambia: cuántas bolsas y cuántos caramelos más lleva cada una. · Permanece: los 24 de cada bolsa y la escala. ·
  // Progresa: 7 bolsas de 24 → 3 más en cada una → 7 grupos de 3 que se suman. · Se reserva: el camino al revés (del
  // aumento a las bolsas): es de la predicción. · Debe verse: lo agregado es una fila igual en cada bolsa; sube eso por
  // la cantidad de bolsas.
  // El juego usa `a` (caramelos en cada bolsa, de 24 a 32) y `b` (bolsas, de 3 a 9), como proponía la propuesta; el
  // pedido de partida siempre lleva 24 por bolsa, y lo que pasa de 24 es lo agregado.
  // Errores (hipótesis de aula): AT-RESTA-AUMENTO, AT-SUMA-AUMENTO y AT-MULTIPLICA operan el aumento con lo que sube en
  // vez de dividir · AT-SUBE-SOLO cree que el producto sube lo mismo que el factor · AT-SUBE-MISMO multiplica el aumento
  // por el factor que cambió · AT-PRODUCTO-NUEVO da el producto nuevo en vez de lo que sube · AT-SUMA-AUMENTOS y
  // AT-SUMA-FACTORES suman en vez de multiplicar · AT-SIN-ESQUINA olvida la parte de los dos aumentos · AT-DECIMAL,
  // AT-LLEVA-UNO y AT-LLEVA-OLVIDA al multiplicar en base n · AT-SUFICIENCIA cree que faltan datos.
  const BASE5 = 24;
  const puestoM = (v, escala) => {
    const ex = v.a - BASE5;
    return { n: v.a, bolsitas: v.b, extra: ex, escala, colorCifras: false,
      regla: [[['Cada bolsa: 24'], ...(ex ? [[' + '], [String(ex), 'f', 700]] : []), [' caramelos']]],
      rotulos: { bolsitas: `${v.b} bolsas de ${v.a}` } };
  };
  const CTRL_M = [
    { id: 'b', etiqueta: 'Bolsas', min: 3, max: 9, paso: 1, inicio: 4, decimales: 0 },
    { id: 'a', etiqueta: 'Caramelos en cada bolsa', min: 24, max: 32, paso: 1, inicio: 24, decimales: 0 },
  ];
  let escM = null;
  const escalaM = () => escM || (escM = escalaDe(CTRL_M, v => puestoM(v)));
  // Multiplicar por una cifra en base n, columna por columna, y lo que da cada error (con código propio).
  function porCifra(X, m, n) {
    const d = digitos(X), cols = [];
    let ll = 0, out = '';
    for (const [k, x] of d.entries()) { const t = x * m + ll; cols.push({ k, x, entra: ll, t, cifra: t % n, sale: Math.floor(t / n) }); out = (t % n) + out; ll = Math.floor(t / n); }
    if (ll) out = enBase(ll, n) + out;
    let u1 = '', l1 = 0; for (const x of d) { const t = x * m + l1; u1 = (t % n) + u1; l1 = t >= n ? 1 : 0; } if (l1) u1 = '1' + u1;
    let ol = '', ul = 0; for (const x of d) { const t = x * m; ol = (t % n) + ol; ul = Math.floor(t / n); } if (ul) ol = enBase(ul, n) + ol;
    const dec = String(+X * m), decOk = [...dec].every(c => +c < n) ? dec : null;
    return { texto: out, cols, unaLlevada: u1, olvida: ol, decimal: decOk };
  }
  function casoFactorFalta(r) {
    const s = r.ent(2, 9), x = r.ent(6, 25), S = s * x;
    if (s === 4 && S === 52) return null;
    return {
      pregunta: `Doña Juana agrega ${s} caramelos a cada bolsa de un pedido, y el pedido sube ${S} caramelos. ¿Cuántas bolsas hay?`,
      datos: ['Todas las bolsas llevan lo mismo', DR.distrib],
      opciones: opciones(x, [
        { id: 'resta', valor: S - s, error: 'AT-RESTA-AUMENTO', siFuera: `Usar el aumento está bien. Pero ${S} es ${s} por cada bolsa: se divide.` },
        { id: 'suma', valor: S + s, error: 'AT-SUMA-AUMENTO', siFuera: `Usar el aumento está bien. Pero ${S} es ${s} por cada bolsa: se divide.` },
        { id: 'mult', valor: S * s, error: 'AT-MULTIPLICA', siFuera: `${s} por bolsa y ${S} en total: las bolsas son ${S} entre ${s}, no por ${s}.` },
      ], x => String(x)),
      solucion: { texto: `Cada bolsa aporta ${s} a la subida.`, ecuacion: [`${S} ÷ ${s} = ${x}`] },
    };
  }
  function casoCuantoSube(r) {
    const F = r.ent(12, 60), G = r.ent(4, 15), s = r.ent(2, 9);
    return {
      pregunta: ['En ', `${F} × ${G}`, `, el primer factor sube ${s}. ¿Cuánto sube el producto?`],
      datos: [DR.distrib],
      opciones: opciones(s * G, [
        { id: 'solo', valor: s, error: 'AT-SUBE-SOLO', siFuera: `Ver que el factor sube ${s} está bien. Pero cada uno de los ${G} grupos recibe ${s}.` },
        { id: 'mismo', valor: s * F, error: 'AT-SUBE-MISMO', siFuera: `Multiplicar el aumento está bien. Pero por el otro factor, ${G}, no por ${F}.` },
        { id: 'nuevo', valor: (F + s) * G, error: 'AT-PRODUCTO-NUEVO', siFuera: 'Ese es el producto nuevo. Se pide cuánto sube.' },
      ], x => f(x, 0)),
      solucion: { texto: `Se agregan ${G} grupos de ${s}.`, ecuacion: [`(${F} + ${s}) × ${G} = ${F} × ${G} + `, res(`${s} × ${G}`), ' = ', `${f(F * G, 0)} + `, res(s * G)] },
    };
  }
  // Los dos factores cambian (nivel examen): de los aumentos se sacan los factores.
  function casoDosAumentos(r) {
    const F = r.ent(12, 40), G = r.ent(12, 40), s = r.ent(2, 9), t = r.ent(2, 9), P1 = s * G, P2 = t * F;
    return {
      pregunta: `Si el primer factor de un producto sube ${s}, el producto sube ${P1}; si en cambio el segundo sube ${t}, el producto sube ${P2}. ¿Cuál es el producto?`,
      datos: [DR.distrib, 'F × (G + t) = F × G + F × t'],
      opciones: opciones(F * G, [
        { id: 'suma', valor: P1 + P2, error: 'AT-SUMA-AUMENTOS', siFuera: 'Usar los dos aumentos está bien. Pero de cada uno sale un factor, y el producto los multiplica.' },
        { id: 'fact', valor: F + G, error: 'AT-SUMA-FACTORES', siFuera: `Hallar los factores está bien: ${F} y ${G}. Pero el producto los multiplica.` },
        { id: 'nuevo', valor: (F + s) * (G + t), error: 'AT-PRODUCTO-NUEVO', siFuera: 'Ese sería el producto con los dos aumentos a la vez. Se pide el de antes.' },
      ], x => f(x, 0)),
      solucion: { texto: `${P1} ÷ ${s} = ${G} es el segundo factor; ${P2} ÷ ${t} = ${F}, el primero.`, ecuacion: [`${F} × ${G} = `, res(f(F * G, 0))] },
    };
  }
  // Multiplicar por una cifra en base n (nivel examen).
  function casoPorCifraBase(r) {
    const n = r.ent(5, 9), X = `${r.ent(1, n - 1)}${r.ent(0, n - 1)}${r.ent(1, n - 1)}`, m = r.ent(2, n - 1), P = porCifra(X, m, n);
    if (P.cols.filter(c => c.sale >= 2).length < 1) return null;
    const op = t => [resN(t, n)];
    return {
      pregunta: ['¿Cuánto es ', sumN(X, n), ` × ${m}?`],
      datos: [DO.base(n), DO.columna],
      dibujo: cuaderno([X, String(m)], { op: '×', base: String(n) }),
      opciones: opcionesNum(op(P.texto), [
        ...(P.decimal ? [{ id: 'decimal', texto: op(P.decimal), error: 'AT-DECIMAL', siFuera: `Multiplicar cada cifra está bien. Pero se lleva de ${n} en ${n}, no de 10 en 10.` }] : []),
        { id: 'uno', texto: op(P.unaLlevada), error: 'AT-LLEVA-UNO', siFuera: `Llevar está bien. Pero si una columna junta varias veces ${n}, se lleva más de 1.` },
        { id: 'olvida', texto: op(P.olvida), error: 'AT-LLEVA-OLVIDA', siFuera: 'Calcular cada llevada está bien. Pero hay que sumarla en la columna siguiente.' },
      ]),
      solucion: { texto: `Cada cifra por ${m}, con lo que llega; de ${n} en ${n} se lleva.`, ecuacion: [sumN(X, n), ` × ${m} = `, resN(P.texto, n)] },
    };
  }
  // Cifras ocultas en un producto por una cifra (nivel examen): ☐d × m = p☐q.
  function casoProductoManchado(r) {
    const X = r.ent(12, 99), m = r.ent(3, 9), P = X * m, x = String(X), p = String(P);
    if (p.length !== 3) return null;
    const pat = [`#${x[1]}`, String(m)], tot = `${p[0]}#${p[2]}`;
    const prueba = modo => {
      const out = [];
      for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) {
        const u = +x[1] * m, lu = modo === 'olvida' ? 0 : modo === 'uno' ? (u >= 10 ? 1 : 0) : Math.floor(u / 10);
        if (u % 10 !== +p[2]) continue;
        const t = a * m + lu;
        if (t === +`${p[0]}${b}`) out.push([a, b]);
      }
      return out;
    };
    const ok = prueba('bien'), ol = prueba('olvida'), un = prueba('uno');
    if (ok.length !== 1) return null;
    const s = xs => xs[0] + xs[1];
    return {
      pregunta: ['En el cuaderno se lee ', `☐${x[1]} × ${m} = ${p[0]}☐${p[2]}`, '. ¿Cuánto suman las dos cifras manchadas?'],
      datos: [DR.mancha, DR.bien, DO.columna],
      dibujo: cuaderno(pat, { op: '×', resultado: tot }),
      opciones: opciones(s(ok[0]), [
        { id: 'olvida', valor: ol.length === 1 ? s(ol[0]) : null, error: 'AT-LLEVA-OLVIDA', siFuera: `${x[1]} × ${m} = ${+x[1] * m}: esa llevada se suma en las decenas.` },
        { id: 'uno', valor: un.length === 1 ? s(un[0]) : null, error: 'AT-LLEVA-UNO', siFuera: `Llevar está bien. Pero de ${+x[1] * m} se llevan ${Math.floor(+x[1] * m / 10)}, no 1.` },
        { id: 'nose', valor: 'No se puede saber', error: 'AT-SUFICIENCIA', siFuera: 'Con dos manchas parece que faltan datos, pero las decenas dejan una sola cifra posible.' },
      ], x => String(x)),
      solucion: { texto: `${x[1]} × ${m} = ${+x[1] * m}: se lleva ${Math.floor(+x[1] * m / 10)}. Entonces ${X} × ${m} = ${P}.`, ecuacion: [`${ok[0][0]} + ${ok[0][1]} = `, res(s(ok[0]))] },
    };
  }

  // Ejemplos resueltos de la idea 5. Cuentas rehechas aparte (cuentas-ideas.js): 6 × 15 = 90; 8 × 7 = 56; 12 × 2 =
  // 24; 37 × 10 = 370; 23 × 4 = 80 + 12 = 92; 47 × 6 = 282 (llevada 4); 32₍₅₎ × 3 = 201₍₅₎ (17 × 3 = 51); 84 ÷ 6 = 14;
  // 35 × 8 − 5 × 8 = 240; 17 × 11 = 187 = 120 + 16 + 45 + 6; 140 ÷ 5 = 28, 102 ÷ 3 = 34, 34 × 28 = 952 (trampas 242, 62,
  // 1 209); ☐3 × 8 = 7☐4 → 93 × 8 = 744, suma 13 (sin llevar da 11; llevando 1, 12); 356₍₇₎ × 4 = 2123₍₇₎ (188 × 4 = 752;
  // trampas 1424, 1603, 1563); 48 × 73 − 48 × 37 = 48 × 36 = 1 728; 28 × 20 − 25 × 18 = 560 − 450 = 110 (trampas 6,
  // 104, 560).
  const bolsas = (n, b, o = {}) => fig(Object.assign({ n, bolsitas: b, colorCifras: false, rotulos: { bolsitas: `${b} bolsas de ${n}` } }, o));
  const EJEMPLOS_MULT = [
    { nivel: 1, titulo: 'Bolsas iguales',
      enunciado: '¿Cuántos caramelos hay en 6 bolsas de 15 caramelos cada una?',
      datos: ['Juntar bolsas iguales es multiplicar'],
      figura: bolsas(15, 6),
      solucion: [{ texto: 'Son 6 grupos de 15.', ecuacion: ['15 × 6 = ', res(90)] }],
      respuesta: [res(90), ' caramelos'] },
    { nivel: 1, titulo: 'Lo que se lleva',
      enunciado: 'Al multiplicar en columnas, en una columna sale 8 × 7. ¿Qué se anota en esa columna y cuánto se lleva?',
      datos: [DO.columna],
      solucion: [{ texto: '8 × 7 = 56: se llenan 5 bolsitas de 10 y sobran 6.', ecuacion: ['56 = ', lleva(5), ' × ', bas(10), ' + ', res(6)] }],
      respuesta: ['Se anota ', res(6), ' y se lleva ', lleva(5)] },
    { nivel: 1, titulo: '¿Cuánto sube?',
      enunciado: 'Hay 12 bolsas y cada una recibe 2 caramelos más. ¿Cuánto sube el pedido?',
      datos: [DR.distrib],
      figura: bolsas(10, 12, { extra: 2, rotulos: { bolsitas: '12 bolsas, 2 más en cada una' } }),
      solucion: [{ texto: 'Lo agregado son 12 grupos de 2.', ecuacion: ['2 × 12 = ', res(24)] }],
      respuesta: ['Sube ', res(24), ' caramelos'] },
    { nivel: 1, titulo: 'Por 10',
      enunciado: '¿Cuánto es 37 × 10?',
      datos: [DO.bolsita(10)],
      solucion: [{ texto: 'Cada uno de los 37 se repite 10 veces: 37 grupos de 10 son 37 bolsitas.', ecuacion: ['37 × 10 = ', res(370)] }],
      respuesta: ['37 × 10 = ', res(370)] },
    { nivel: 1, titulo: 'Por partes',
      enunciado: '¿Cuánto es 23 × 4, multiplicando por partes?',
      datos: ['(F + s) × G = F × G + s × G'],
      solucion: [{ texto: '23 es 20 + 3: multiplico cada parte por 4 y junto.', ecuacion: ['20 × 4 + 3 × 4 = 80 + 12 = ', res(92)] }],
      respuesta: ['23 × 4 = ', res(92)] },
    { nivel: 2, titulo: 'Se llevan 4',
      enunciado: '¿Cuánto es 47 × 6?',
      datos: [DO.columna],
      figura: cuaderno(['47', '6'], { op: '×' }),
      solucion: [
        { texto: 'Unidades: 7 × 6 = 42. Se anota 2 y se llevan 4.', ecuacion: ['42 = ', lleva(4), ' × ', bas(10), ' + ', res(2)] },
        { texto: 'Decenas: 4 × 6 = 24, más las 4 que llegan.', ecuacion: ['24 + ', lleva(4), ' = ', res(28)] },
      ],
      respuesta: ['47 × 6 = ', res(282)] },
    { nivel: 2, titulo: 'En base 5',
      enunciado: ['¿Cuánto es ', sumN('32', 5), ' × 3?'],
      datos: [DO.base(5), DO.columna],
      figura: cuaderno(['32', '3'], { op: '×', base: '5' }),
      solucion: [
        { texto: ['Sueltos: 2 × 3 = 6 = 1 × ', bas(5), ' + 1. Se anota 1 y se lleva 1.'], ecuacion: ['6 = ', lleva(1), ' × ', bas(5), ' + ', res(1)] },
        { texto: 'Bolsitas: 3 × 3 = 9, más la que llega: 10 = 2 × 5 + 0.', ecuacion: ['9 + ', lleva(1), ' = 10 = ', lleva(2), ' × ', bas(5), ' + ', res(0)] },
        { texto: 'La última llevada, 2, abre otra columna. En base 10: 17 × 3 = 51 = 2 × 25 + 1.' },
      ],
      respuesta: [sumN('32', 5), ' × 3 = ', resN('201', 5)] },
    { nivel: 2, titulo: 'El factor que falta',
      enunciado: 'Cada bolsa de un pedido recibe 6 caramelos más y el pedido sube 84. ¿Cuántas bolsas hay?',
      datos: ['Todas las bolsas llevan lo mismo', DR.distrib],
      solucion: [
        { texto: 'La subida son 6 por cada bolsa: 6 × bolsas = 84.' },
        { texto: 'Divido la subida entre lo que recibe cada una.', ecuacion: ['84 ÷ 6 = 14'] },
      ],
      respuesta: ['Hay 14 bolsas'] },
    { nivel: 2, titulo: 'Un factor que baja',
      enunciado: '35 × 8 = 280. Si el 35 baja a 30, ¿cuánto vale el producto?',
      datos: ['(F − s) × G = F × G − s × G'],
      solucion: [
        { texto: 'Baja 5 en cada uno de los 8 grupos: el producto baja 5 × 8 = 40.' },
        { texto: 'Lo quito del producto de antes.', ecuacion: ['280 − 40 = ', res(240)] },
      ],
      respuesta: ['30 × 8 = ', res(240)] },
    { nivel: 2, titulo: 'Los dos factores suben',
      enunciado: '15 × 8 = 120. Si el 15 sube 2 y el 8 sube 3, ¿cuánto vale el producto?',
      datos: ['(F + s) × (G + t) = F × G + s × G + F × t + s × t'],
      solucion: [
        { texto: 'Se agregan tres partes: 2 × 8 por subir el 15, 15 × 3 por subir el 8, y 2 × 3 de las dos subidas juntas.' },
        { texto: 'Las sumo al producto de antes.', ecuacion: ['120 + 16 + 45 + 6 = ', res(187), ' = 17 × 11'] },
      ],
      respuesta: ['17 × 11 = ', res(187)] },
    { nivel: 3, titulo: 'Dos aumentos',
      enunciado: 'Si el primer factor de un producto sube 5, el producto sube 140; si en cambio el segundo sube 3, el producto sube 102. ¿Cuál es el producto?',
      alternativas: ['242', '62', '952', '1 209'],
      datos: [DR.distrib, 'F × (G + t) = F × G + F × t'],
      solucion: [
        { texto: 'Si el primero sube 5, el producto sube 5 por el segundo: el segundo es 140 ÷ 5 = 28.' },
        { texto: 'Si el segundo sube 3, sube 3 por el primero: el primero es 102 ÷ 3 = 34.', ecuacion: ['34 × 28 = ', res(952)] },
        { texto: ['Las trampas: ', letra('A'), ' suma los aumentos; ', letra('B'), ' suma los factores; ', letra('D'), ' es 39 × 31, con los dos aumentos.'] },
      ],
      respuesta: [letra('C'), ': ', res(952)] },
    { nivel: 3, titulo: 'Cifras ocultas en un producto',
      enunciado: 'En el cuaderno se lee ☐3 × 8 = 7☐4. ¿Cuánto suman las dos cifras manchadas?',
      alternativas: ['11', '12', '13', 'No se puede saber'],
      datos: [DR.mancha, DR.bien, DO.columna],
      figura: cuaderno(['#3', '8'], { op: '×', resultado: '7#4' }),
      solucion: [
        { texto: 'Unidades: 3 × 8 = 24. Se anota 4, como dice el cuaderno, y se llevan 2.', ecuacion: ['24 = ', lleva(2), ' × ', bas(10), ' + 4'] },
        { texto: 'Decenas: ☐ × 8 + 2 tiene que dar un número entre 70 y 79. Solo ☐ = 9: 72 + 2 = 74.', ecuacion: ['93 × 8 = 744   →   9 + 4 = ', res(13)] },
        { texto: ['Las trampas: ', letra('A'), ' no suma la llevada (72); ', letra('B'), ' lleva 1 en vez de 2 (73); ', letra('D'), ' cree que faltan datos.'] },
      ],
      respuesta: [letra('C'), ': ', res(13)] },
    { nivel: 3, titulo: 'Multiplicar en base 7',
      enunciado: ['¿Cuánto es ', sumN('356', 7), ' × 4?'],
      alternativas: [[sumN('1424', 7)], [sumN('1603', 7)], [sumN('1563', 7)], [sumN('2123', 7)]],
      datos: [DO.base(7), DO.columna],
      figura: cuaderno(['356', '4'], { op: '×', base: '7' }),
      solucion: [
        { texto: ['Sueltos: 6 × 4 = 24 = 3 × ', bas(7), ' + 3. Bolsitas: 5 × 4 + 3 = 23 = 3 × 7 + 2.'], ecuacion: ['24 = ', lleva(3), ' × ', bas(7), ' + ', res(3), ' ; 23 = ', lleva(3), ' × ', bas(7), ' + ', res(2)] },
        { texto: 'Cajas: 3 × 4 + 3 = 15 = 2 × 7 + 1, y la llevada 2 abre otra columna.', ecuacion: ['15 = ', lleva(2), ' × ', bas(7), ' + ', res(1)] },
        { texto: ['Compruebo en base 10: 188 × 4 = 752 = 2 × 343 + 1 × 49 + 2 × 7 + 3. Las trampas: ', letra('A'), ' multiplica en base 10; ', letra('B'), ' lleva siempre 1; ', letra('C'), ' no suma las llevadas.'] },
      ],
      respuesta: [letra('D'), ': ', resN('2123', 7)] },
    { nivel: 3, titulo: 'Se equivocó de factor',
      enunciado: 'Doña Juana debía multiplicar 48 por 73, pero multiplicó 48 por 37. ¿Cuánto le faltó?',
      alternativas: ['36', '1 728', '3 504', '1 776'],
      datos: ['F × G − F × H = F × (G − H)'],
      solucion: [
        { texto: 'Le faltaron 73 − 37 = 36 grupos de 48.' },
        { texto: 'Multiplico la diferencia de factores por 48.', ecuacion: ['48 × 36 = ', res('1 728')] },
        { texto: ['Las trampas: ', letra('A'), ' resta los factores y no multiplica; ', letra('C'), ' es el producto correcto; ', letra('D'), ' es el que hizo.'] },
      ],
      respuesta: [letra('B'), ': le faltaron ', res('1 728')] },
    { nivel: 3, titulo: 'Más bolsas y más caramelos',
      enunciado: 'Una caja trae 25 bolsas de 18 caramelos. Si cada bolsa trae 2 más y la caja trae 3 bolsas más, ¿cuántos caramelos más trae la caja?',
      alternativas: ['6', '104', '110', '560'],
      datos: ['(F + s) × (G + t) = F × G + s × G + F × t + s × t'],
      solucion: [
        { texto: 'Antes: 25 × 18 = 450. Ahora: 28 bolsas de 20.', ecuacion: ['28 × 20 = 560'] },
        { texto: 'Lo que sube: 2 × 25 + 18 × 3 + 2 × 3.', ecuacion: ['50 + 54 + 6 = ', res(110), ' = 560 − 450'] },
        { texto: ['Las trampas: ', letra('A'), ' es solo la parte 2 × 3; ', letra('B'), ' olvida esa parte; ', letra('D'), ' es el total nuevo.'] },
      ],
      respuesta: [letra('C'), ': ', res(110), ' más'] },
  ];

  const multiplicacion = {
    id: 'multiplicar-partes',
    titulo: 'Multiplicar es juntar bolsas iguales',
    pregunta: '¿Cuánto sube un producto si un factor crece?',
    temas: ['Multiplicación', 'Operaciones en otras bases'],
    pieza: PU,
    aprendizaje: 'Un producto junta bolsas iguales: si cada bolsa recibe unos caramelos más, el producto sube esos caramelos por la cantidad de bolsas.',
    actividad: 'Agregar caramelos a cada bolsa y ver cuánto sube el pedido.',
    lee: {
      tarjetas: [
        { titulo: 'Bolsas de sorpresa', texto: 'Para una promoción del colegio, doña Juana arma bolsas de sorpresa iguales, cada una con 24 caramelos. Juntar bolsas iguales es multiplicar.',
          pieza: PU, dibujo: { datos: { n: 24, bolsitas: 3, colorCifras: false, rotulos: { bolsitas: '3 bolsas de 24' } }, estado: {} } },
        { titulo: 'Factores y producto', texto: 'En 24 × 3 = 72, los números que se multiplican son los factores: 24 caramelos y 3 bolsas. El total, 72, es el producto.',
          ecuacion: ['24 × 3 = ', res(72)] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a agregar caramelos a cada bolsa. En violeta verás los que agregas: mira cuántos hay en cada bolsa y cuántas bolsas hay.' },
      ],
    },
    ejemplos: EJEMPLOS_MULT,
    juega: {
      pieza: PU,
      consigna: 'Doña Juana arma bolsas de sorpresa para una promoción: cada bolsa empieza con 24 caramelos. Elige cuántas bolsas arma y cuántos caramelos lleva cada una.',
      mision: {
        texto: 'Con 7 bolsas, agrega a cada una lo justo para que el pedido suba 21.',
        logrado: v => v.b === 7 && v.a === 27,
        bien: '3 más en cada bolsa, por 7 bolsas: el pedido subió 21.',
      },
      voz: 'Mira la fila violeta de cada bolsa.',
      leyenda: [
        { s: bas('bolsa'), t: 'una bolsa de sorpresa' },
        { s: '24', t: 'caramelos con que empieza cada bolsa' },
        { s: res('agregados'), t: 'los caramelos que agregas a cada bolsa' },
      ],
      controles: CTRL_M,
      dibujo: v => ({ datos: puestoM(v, escalaM()), estado: {} }),
      lectura: v => {
        const ex = v.a - BASE5;
        if (!ex) return [`${v.b} bolsas de 24: 24 × ${v.b} = `, res(24 * v.b)];
        return [`${v.a} × ${v.b} = ${24 * v.b} + ${ex} × ${v.b}: subió `, res(ex * v.b)];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Doña Juana agrega 4 caramelos a cada bolsa de un pedido, y el pedido sube 52 caramelos. ¿Cuántas bolsas hay?',
      datos: ['Todas las bolsas llevan la misma cantidad', 'A cada bolsa se le agregan 4 caramelos'],
      voz: 'Piensa qué aporta cada bolsa a la subida.',
      opciones: [
        { id: 'c', texto: '13 bolsas', correcta: true },
        { id: 'resta', texto: '48 bolsas', error: 'AT-RESTA-AUMENTO', siFuera: 'Usar el aumento está bien. Pero 52 son 4 por cada bolsa: hay que repartir.' },
        { id: 'suma', texto: '56 bolsas', error: 'AT-SUMA-AUMENTO', siFuera: 'Sumar no reparte: los 52 se forman con 4 de cada bolsa.' },
        { id: 'mult', texto: '208 bolsas', error: 'AT-MULTIPLICA', siFuera: 'Multiplicar sería cierto si cada bolsa subiera 52. Sube 4.' },
      ],
      dibujo: fig({ n: 12, bolsitas: 1, extra: 4, colorCifras: false, regla: [[['El pedido sube '], ['52', 'f', 700], [' caramelos']]], rotulos: { bolsitas: '4 más en cada bolsa; ¿cuántas bolsas?' } }),
      revelar: cuaderno(['13', '4'], { op: '×', resultado: '52' }),
      coincide: 'Coincide: 13 bolsas con 4 más cada una suben 13 × 4 = 52.',
      noCoincide: 'Revisemos: cada bolsa aporta 4 a la subida; ¿cuántos 4 forman 52?',
    },
    mira: {
      pieza: PU,
      datos: { n: 24, bolsitas: 7, colorCifras: false, escala: ESC_M5, regla: [[['Cada bolsa: 24 caramelos']]], rotulos: { bolsitas: '7 bolsas de 24' }, pasos: [
        {},
        { n: 27, extra: 3, regla: [[['Cada bolsa: 24'], [' + '], ['3', 'f', 700], [' caramelos']]], rotulos: { bolsitas: '7 bolsas de 27' } },
        { n: 27, extra: 3, regla: [[['Cada bolsa: 24'], [' + '], ['3', 'f', 700], [' caramelos']]], rotulos: { bolsitas: '7 bolsas de 27' } },
        { cuenta: { solo: true, sumandos: ['13', '4'], op: '×', resultado: '52' } },
        { cuenta: { solo: true, sumandos: ['24', '7'], op: '×', llevadas: { 1: 2 }, resultado: '8' } },
        { cuenta: { solo: true, sumandos: ['24', '7'], op: '×', llevadas: { 1: 2 }, resultado: '168' } },
      ] },
      voz: 'Lo agregado es igual en cada bolsa.',
      pasos: [
        { estado: { paso: 0 }, texto: '7 bolsas de 24 caramelos: el pedido es 24 × 7.', ecuacion: ['24 × 7 = ', res(168)] },
        { estado: { paso: 1 }, texto: 'Agrego 3 a cada bolsa: en violeta, 3 en cada una de las 7.', ecuacion: ['27 × 7'] },
        { estado: { paso: 2 }, texto: 'Es la propiedad distributiva: lo agregado son 7 grupos de 3.', ecuacion: ['27 × 7 = 24 × 7 + ', res('3 × 7'), ' = 168 + ', res(21)] },
        { estado: { paso: 3 }, texto: 'Al revés: si sube 52 con 4 por bolsa, las bolsas son 52 ÷ 4.', ecuacion: ['52 ÷ 4 = 13'] },
        { estado: { paso: 4 }, texto: 'En columnas: 4 × 7 = 28. Se anota 8 y se llevan 2.', ecuacion: ['28 = ', lleva(2), ' × ', bas(10), ' + ', res(8)] },
        { estado: { paso: 5 }, texto: 'Después 2 × 7 = 14, más las 2 que llegan: 16.', ecuacion: ['14 + ', lleva(2), ' = ', res(16), '   →   24 × 7 = ', res(168)] },
      ],
    },
    regla: {
      texto: 'Si un factor sube, el producto sube eso por el otro factor. En columnas se lleva de 10 en 10 (de n en n), aunque la llevada pase de 1.',
      ecuacion: ['(F + s) × G = F × G + ', { llave: [res('s × G')], nota: 'lo que sube', color: 'c-f' }, SEP, 'columna = ', lleva('L'), ' × ', bas('n'), ' + ', res('c')],
      condicion: 'F y G: los factores; s: lo que sube F. Si también sube G, se suman todas las partes nuevas.',
      voz: 'Cada bolsa recibe lo mismo: se multiplica.',
    },
    // Así se resuelve: multiplicar por una cifra en base n (34₍₅₎ × 3 = 212₍₅₎ es el caso de la escena), columna por
    // columna. «Ahora tú» pide el factor que falta, cuánto sube, los dos aumentos, la base n con otras trampas o un
    // producto manchado.
    resuelve: {
      pieza: PU,
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const n = r.de([4, 5, 6, 7, 8, 9]), X = `${r.ent(1, n - 1)}${r.ent(1, n - 1)}`, m = r.ent(2, n - 1), P = porCifra(X, m, n);
          if (!P.cols.some(c => c.sale >= 1) || P.texto.length < 3) continue;
          const vX = valor(X, n);
          const paso = (c, k) => ({ tipo: 'cuentas',
            texto: `${['Sueltos', 'Bolsitas'][k]}: ${c.x} × ${m} = ${c.x * m}${c.entra ? `, más ${c.entra === 1 ? 'la que llega' : `las ${c.entra} que llegan`}` : ''}: ${c.t}. Se anota ${c.cifra}${c.sale ? ` y se lleva ${c.sale}` : ''}.`,
            ecuacion: [`${c.t} = `, lleva(c.sale), ' × ', bas(n), ' + ', res(c.cifra)],
            dibujo: cuaderno([X, String(m)], { op: '×', base: String(n), llevadas: Object.fromEntries(P.cols.slice(0, k + 1).filter(x => x.sale).map(x => [x.k + 1, x.sale])), resultado: k === P.cols.length - 1 ? P.texto : P.texto.slice(-(k + 1)) }) });
          return {
            enunciado: ['En el puesto de bolsitas de ', bas(n), ', doña Juana arma ', String(m), ' pedidos iguales de ', sumN(X, n), ' caramelos. ¿Cuántos caramelos son en total?'],
            datos: [DO.base(n), DO.columna, DO.f3(n)],
            dibujo: cuaderno([X, String(m)], { op: '×', base: String(n) }),
            pasos: [
              { tipo: 'pide', texto: ['Piden ', sumN(X, n), ` × ${m}, escrito en base `, bas(n), '.'] },
              { tipo: 'regla', texto: ['Multiplico cada cifra, desde los sueltos, y sumo lo que llega. Cada ', bas(n), ' de una columna forman 1 de la siguiente.'] },
              ...P.cols.map(paso),
              { tipo: 'sentido', texto: `Compruebo en base 10: ${vX} × ${m} = ${vX * m}, y el total también.`, ecuacion: [resN(P.texto, n), ` = ${poli(P.texto, n)} = `, res(valor(P.texto, n))] },
            ],
            respuesta: ['Son ', resN(P.texto, n), ' caramelos'],
          };
        }
      },
    },
    ahoraTu: {
      pieza: PU,
      voz: 'Cada grupo recibe lo mismo: se multiplica.',
      generar(sem) {
        const r = azar(sem + 89), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoFactorFalta, r);
        if (tipo === 1) return conCuatro(casoCuantoSube, r);
        if (tipo === 2) return conCuatro(casoDosAumentos, r);
        if (tipo === 3) return conCuatro(casoPorCifraBase, r);
        return conCuatro(casoProductoManchado, r);
      },
    },
  };

  // ---------- Idea 6: sobran o faltan para otra bolsita (división entera por defecto y por exceso) ----------
  // Propuesta §1 a §7. Objeto: bolsitas de d caramelos (arit-puesto, con `incompleta`: la bolsita a medio llenar, con
  // sus sueltos y sus huecos punteados en violeta).
  // Cambia: cuántos caramelos hay y cuántos lleva una bolsita. · Permanece: la regla de empacar y la escala. · Progresa:
  // bolsitas llenas → los sueltos que sobran → los huecos de la bolsita que falta. · Se reserva: el reparto entre
  // personas (uno más a cada uno): es de la predicción. · Debe verse: sueltos y huecos juntos llenan una bolsita.
  // Errores (hipótesis de aula; la trampa 18 de San Marcos, 2023-I y 2023-II, respalda AT-EXCESO-IGUAL): AT-EXCESO-IGUAL
  // cree que el resto por exceso es el mismo que por defecto · AT-EXCESO-DIVISOR responde el divisor · AT-EXCESO-SUMA suma
  // el resto y el divisor · AT-EXCESO-RESTA usa q en vez de q + 1 · AT-EXCESO-MAS suma el resto por exceso · AT-EXCESO-
  // CAMBIA cambia un resto por el otro · AT-RESTO-MAX, AT-RESTO-MITAD dan el mayor resto o la mitad · AT-REPARTO-SIN-
  // DIVIDIR no reparte la diferencia · AT-REPARTO-TOTAL responde los caramelos · AT-REPARTO-RESTA resta los restos ·
  // AT-REPARTO-CUENTA responde cuántos son · AT-REPARTO-NUEVO, AT-REPARTO-SIN-RESTO arman mal el total.
  const puestoD = (v, escala) => {
    const q = Math.floor(v.a / v.d), r = v.a % v.d;
    return { n: v.d, bolsitas: q, regla: 1, escala, colorCifras: false, incompleta: r ? { de: v.d, tiene: r } : undefined,
      rotulos: { bolsitas: `${q} bolsitas llenas`, incompleta: r ? [[String(r), 'o', 700], [r === 1 ? ' suelto, ' : ' sueltos, ']].concat([[String(v.d - r), 'f', 700], [v.d - r === 1 ? ' hueco' : ' huecos']]) : null } };
  };
  const CTRL_D = [
    { id: 'a', etiqueta: 'Caramelos que tiene', min: 20, max: 60, paso: 1, inicio: 30, decimales: 0 },
    { id: 'd', etiqueta: 'Caramelos por bolsita', color: 'c-i', min: 3, max: 9, paso: 1, inicio: 4, decimales: 0 },
  ];
  let escD = null;
  const escalaD = () => escD || (escD = escalaDe(CTRL_D, v => puestoD(v)));
  const bolsitasD = (d, q, r, o = {}) => fig(Object.assign({ n: d, bolsitas: q, sueltos: r, regla: 1, colorCifras: false, rotulos: { bolsitas: `${q} bolsitas`, sueltos: `${r} ${r === 1 ? 'suelto' : 'sueltos'}` } }, o));
  function casoExcesoDesdeR(r) {
    const d = r.ent(4, 9), q = r.ent(4, 9), rr = r.ent(1, d - 1), D = d * q + rr;
    if (2 * rr === d) return null;
    return {
      pregunta: `Doña Juana empaca ${D} caramelos en bolsitas de ${d}: llena ${q} y le sobran ${rr}. ¿Cuántos le faltan para llenar otra bolsita?`,
      datos: [DR.div, DR.exceso],
      dibujo: bolsitasD(d, q, rr),
      opciones: opciones(d - rr, [
        { id: 'igual', valor: rr, error: 'AT-EXCESO-IGUAL', siFuera: `${rr} es lo que sobra. Lo que falta es lo que necesita la bolsita para llegar a ${d}.` },
        { id: 'div', valor: d, error: 'AT-EXCESO-DIVISOR', siFuera: `${d} lleva una bolsita entera, pero ya tiene ${rr} sueltos para empezarla.` },
        { id: 'suma', valor: d + rr, error: 'AT-EXCESO-SUMA', siFuera: 'Los sueltos y lo que falta llenan juntos una bolsita: se restan, no se suman.' },
      ]),
      solucion: { texto: 'Sueltos y huecos llenan una bolsita.', ecuacion: [D_, ' − ', R_, ' = ', `${d} − ${rr} = `, res(d - rr)] },
    };
  }
  function casoDDesdeExceso(r) {
    const d = r.ent(12, 30), q = r.ent(6, 25), re = r.ent(1, d - 1), D = d * q + (d - re);
    return {
      pregunta: `En una división, el divisor es ${d}, el cociente por defecto es ${q} y el resto por exceso es ${re}. ¿Cuál es el dividendo?`,
      datos: [DR.div, DR.exceso],
      opciones: opciones(D, [
        { id: 'resta', valor: d * q - re, error: 'AT-EXCESO-RESTA', siFuera: `Restar el resto por exceso está bien, pero desde ${d} × ${q + 1}: el cociente por exceso es q + 1.` },
        { id: 'mas', valor: d * (q + 1) + re, error: 'AT-EXCESO-MAS', siFuera: 'Usar q + 1 está bien. Pero el resto por exceso falta: se resta.' },
        { id: 'cambia', valor: d * q + re, error: 'AT-EXCESO-CAMBIA', siFuera: `Ese sería si sobraran ${re}. Faltan ${re}: sobran ${d} − ${re}.` },
      ], x => f(x, 0)),
      solucion: { texto: `Sobran ${d} − ${re} = ${d - re}.`, ecuacion: [`D = ${d} × ${q} + ${d - re} = ${f(D, 0)}`] },
    };
  }
  function casoRestosRelacion(r) {
    const k = r.ent(2, 4), rr = r.ent(2, 6), d = rr * (k + 1), re = k * rr;
    const veces = ['', '', 'el doble', 'el triple', 'el cuádruple'][k];
    return {
      pregunta: `En una división entre ${d}, el resto por exceso es ${veces} del resto por defecto. ¿Cuál es el resto por defecto?`,
      datos: [[R_, ' + ', RE, ' = ', D_]],
      opciones: opciones(rr, [
        { id: 'cambia', valor: re, error: 'AT-EXCESO-CAMBIA', siFuera: 'Ese es el resto por exceso. Se pide el que sobra.' },
        { id: 'max', valor: d - 1, error: 'AT-RESTO-MAX', siFuera: `${d - 1} es el mayor resto posible, pero aquí los restos guardan una relación.` },
        { id: 'mitad', valor: d % 2 ? null : d / 2, error: 'AT-RESTO-MITAD', siFuera: 'La mitad sería si los dos restos fueran iguales.' },
        { id: 'k', valor: d % k ? null : d / k, error: 'AT-RESTO-MITAD', siFuera: `Las partes son ${k} + 1: el divisor se reparte en ${k + 1}.` },
      ]),
      solucion: { texto: `Los dos restos suman ${d}: el de defecto es 1 parte y el de exceso ${k}.`, ecuacion: [`${d} ÷ ${k + 1} = `, lleva(rr)] },
    };
  }
  // Dos repartos del mismo dividendo (San Marcos 2023-II, nivel examen).
  function casoDosRepartos(r) {
    const x = r.ent(4, 12), p = r.ent(3, 9), e = r.ent(2, 3), rr = r.ent(1, x - 1), fa = e * x - rr, D = p * x + rr;
    const sinDiv = rr + fa, resta = Math.abs(fa - rr);
    return {
      pregunta: `Si doña Juana da ${p} caramelos a cada sobrino, le sobran ${rr}; si les da ${p + e}, le faltan ${fa}. ¿Cuántos sobrinos son?`,
      datos: ['Los caramelos son los mismos en los dos repartos', [D_, ' × q + ', R_, ' = ', D_, ' × (q + 1) − ', RE]],
      opciones: opciones(x, [
        { id: 'sin', valor: e > 1 ? sinDiv : null, error: 'AT-REPARTO-SIN-DIVIDIR', siFuera: `Juntar lo que sobra y lo que falta está bien: ${sinDiv}. Pero cada sobrino recibe ${e} más, no 1.` },
        { id: 'total', valor: D, error: 'AT-REPARTO-TOTAL', siFuera: 'Esos son los caramelos. Se pide cuántos sobrinos son.' },
        { id: 'resta', valor: resta && resta !== x ? resta : null, error: 'AT-REPARTO-RESTA', siFuera: 'Lo que sobra y lo que falta se juntan: con eso se da lo que recibe de más cada uno.' },
        { id: 'sindiv1', valor: e === 1 ? fa : null, error: 'AT-EXCESO-IGUAL', siFuera: 'Lo que falta no basta: también se usan los que sobraban.' },
      ]),
      solucion: { texto: `Dar ${e} más a cada uno pide ${rr} + ${fa} = ${rr + fa} caramelos.`, ecuacion: [`${rr + fa} ÷ ${e} = ${x}`] },
    };
  }
  // Uno más a cada uno (San Marcos 2024-II, nivel examen): el total.
  function casoUnoMas(r) {
    const x = r.ent(5, 12), p = r.ent(3, 9), rr = r.ent(1, x - 1), fa = x - rr, D = p * x + rr;
    return {
      pregunta: `Doña Juana da ${p} caramelos a cada nieto y le sobran ${rr}. Para darles ${p + 1} a cada uno, le faltarían ${fa}. ¿Cuántos caramelos tiene?`,
      datos: ['Los caramelos son los mismos en los dos repartos', DR.div],
      opciones: opciones(D, [
        { id: 'nietos', valor: x, error: 'AT-REPARTO-CUENTA', siFuera: `${x} son los nietos. Se piden los caramelos.` },
        { id: 'nuevo', valor: (p + 1) * x, error: 'AT-REPARTO-NUEVO', siFuera: `${(p + 1) * x} los tendría si alcanzara para ${p + 1} a cada uno, pero le faltan ${fa}.` },
        { id: 'sinr', valor: p * x, error: 'AT-REPARTO-SIN-RESTO', siFuera: `Repartir ${p} a cada uno está bien. Pero falta sumar los ${rr} que sobran.` },
      ], x => String(x)),
      solucion: { texto: `Dar 1 más a cada uno pide ${rr} + ${fa} = ${x} caramelos: son ${x} nietos.`, ecuacion: [`D = ${p} × ${x} + ${rr} = `, `${D}`] },
    };
  }

  // Ejemplos resueltos de la idea 6. Cuentas rehechas aparte (cuentas-ideas.js): 38 = 6 × 6 + 2; 29 = 4 × 7 + 1,
  // faltan 3; 42 = 7 × 6; rₑ = 9 − 4 = 5; mayor resto 7; 12 × 7 + 5 = 89; 15 × 9 − 4 = 131; r = rₑ = 5 con d = 10;
  // 50 = 6 × 8 + 2, faltan 4; 75 = 8 × 9 + 3 = 8 × 10 − 5; dos repartos 9x + 7 = 11x − 5 → x = 6, D = 61; 4x + 5 = 5x −
  // 3 → x = 8, D = 37; r + 2r = 15 → r = 5, D = 95; 17 × 9 + 16 = 169; d = 6 + 7 = 13, q = 7, D = 97.
  const EJEMPLOS_RESTOS = [
    { nivel: 1, titulo: 'Sobran sueltos',
      enunciado: 'Doña Juana empaca 38 caramelos en bolsitas de 6. ¿Cuántas bolsitas llena y cuántos caramelos sobran?',
      datos: [DR.div],
      figura: fig({ n: 6, sueltos: 38, regla: 1, rotulos: { sueltos: '38 caramelos' } }),
      solucion: [{ texto: 'El múltiplo de 6 que queda justo debajo de 38 es 36: llena 6 bolsitas.', ecuacion: ['38 = ', bas(6), ' × 6 + ', lleva(2)] }],
      respuesta: ['Llena 6 bolsitas y sobran ', lleva(2)] },
    { nivel: 1, titulo: 'Faltan para otra',
      enunciado: 'Doña Juana empaca 29 caramelos en bolsitas de 4. ¿Cuántos le faltan para llenar otra bolsita?',
      datos: [DR.div, DR.exceso],
      figura: fig({ n: 4, sueltos: 29, regla: 1, rotulos: { sueltos: '29 caramelos' } }),
      solucion: [
        { texto: 'Llena 7 bolsitas (28) y sobra 1.', ecuacion: ['29 = ', bas(4), ' × 7 + ', lleva(1)] },
        { texto: 'Para una octava bolsita le faltan 4 − 1.', ecuacion: ['29 = ', bas(4), ' × 8 − ', res(3)] },
      ],
      respuesta: ['Le faltan ', res(3)] },
    { nivel: 1, titulo: 'Una división exacta',
      enunciado: '¿Sobra o falta algo al empacar 42 caramelos en bolsitas de 7?',
      datos: [DR.div],
      figura: fig({ n: 7, sueltos: 42, regla: 1, rotulos: { sueltos: '42 caramelos' } }),
      solucion: [{ texto: '42 es un múltiplo de 7: llena 6 bolsitas justas.', ecuacion: ['42 = ', bas(7), ' × 6 + ', lleva(0)] }],
      respuesta: ['No sobra nada: el resto es ', lleva(0)] },
    { nivel: 1, titulo: 'Los dos restos',
      enunciado: 'Al dividir un número entre 9, el resto por defecto es 4. ¿Cuál es el resto por exceso?',
      datos: [[R_, ' + ', RE, ' = ', D_, ', si la división no es exacta']],
      solucion: [{ texto: 'Lo que sobra y lo que falta llenan una bolsita de 9.', ecuacion: [RE, ' = ', bas(9), ' − ', lleva(4), ' = ', res(5)] }],
      respuesta: [RE, ' = ', res(5)] },
    { nivel: 1, titulo: 'El mayor resto',
      enunciado: 'Al empacar en bolsitas de 8, ¿cuál es la mayor cantidad de caramelos que puede sobrar?',
      datos: [DR.div],
      solucion: [{ texto: 'Con 8 sueltos se llenaría otra bolsita: lo que sobra es menos que 8.', ecuacion: [R_, ' ≤ ', bas(8), ' − 1 = ', lleva(7)] }],
      respuesta: ['Pueden sobrar hasta ', lleva(7)] },
    { nivel: 2, titulo: 'Armar el dividendo',
      enunciado: 'En una división, el divisor es 12, el cociente por defecto 7 y el resto por defecto 5. ¿Cuál es el dividendo?',
      datos: [DR.div],
      solucion: [{ texto: '7 bolsitas de 12 y 5 sueltos.', ecuacion: ['D = ', bas(12), ' × 7 + ', lleva(5), ' = 84 + 5 = 89'] }],
      respuesta: ['El dividendo es 89'] },
    { nivel: 2, titulo: 'Desde el exceso',
      enunciado: 'En una división, el divisor es 15, el cociente por exceso es 9 y el resto por exceso es 4. ¿Cuál es el dividendo?',
      datos: [DR.exceso],
      solucion: [
        { texto: '9 bolsitas de 15 serían 135, pero a la última le faltan 4.', ecuacion: ['D = ', bas(15), ' × 9 − ', res(4), ' = 131'] },
        { texto: 'Compruebo por defecto: 131 = 15 × 8 + 11, y 11 + 4 = 15.' },
      ],
      respuesta: ['El dividendo es 131'] },
    { nivel: 2, titulo: 'Restos iguales',
      enunciado: 'Al dividir entre 10, ¿cuánto deben valer los dos restos para que sean iguales?',
      datos: [[R_, ' + ', RE, ' = ', D_]],
      solucion: [
        { texto: 'Los dos suman 10 y son iguales: cada uno es la mitad.', ecuacion: [R_, ' = ', RE, ' = 10 ÷ 2 = ', res(5)] },
        { texto: 'Solo pasa con un divisor par: con 9, la mitad no es entera.' },
      ],
      respuesta: ['Los dos valen ', res(5)] },
    { nivel: 2, titulo: 'Uno más a cada uno',
      enunciado: 'Doña Juana reparte 50 caramelos entre sus 6 sobrinos, lo más que pueda a cada uno. ¿Cuántos le faltan para darles uno más a cada uno?',
      datos: [DR.div, DR.exceso],
      figura: fig({ n: 6, sueltos: 50, regla: [[['Son '], ['6', 'i', 700], [' sobrinos']]], rotulos: { sueltos: '50 caramelos' } }),
      solucion: [
        { texto: 'A cada uno le da 8 (48) y sobran 2.', ecuacion: ['50 = ', bas(6), ' × 8 + ', lleva(2)] },
        { texto: 'Dar 1 más a cada uno pide 6 caramelos; tiene 2.', ecuacion: [bas(6), ' − ', lleva(2), ' = ', res(4)] },
      ],
      respuesta: ['Le faltan ', res(4)] },
    { nivel: 2, titulo: 'Los dos cocientes',
      enunciado: '¿Cuáles son los cocientes y los restos, por defecto y por exceso, de 75 entre 8?',
      datos: [DR.div, DR.exceso],
      solucion: [
        { texto: 'Los múltiplos de 8 vecinos de 75 son 72 y 80.', ecuacion: ['75 = ', bas(8), ' × 9 + ', lleva(3), ' ; 75 = ', bas(8), ' × 10 − ', res(5)] },
        { texto: 'Compruebo: 3 + 5 = 8.' },
      ],
      respuesta: ['q = 9, ', R_, ' = ', lleva(3), '; q + 1 = 10, ', RE, ' = ', res(5)] },
    { nivel: 3, titulo: 'Dos repartos',
      enunciado: 'Si doña Juana da 9 caramelos a cada nieto, le sobran 7; si les da 11 a cada uno, le faltan 5. ¿Cuántos caramelos tiene?',
      alternativas: ['6', '12', '61', '66'],
      datos: ['Los caramelos son los mismos en los dos repartos', DR.div],
      solucion: [
        { texto: 'Pasar de 9 a 11 por nieto pide los 7 que sobran más los 5 que faltan: 12 caramelos, 2 por nieto.', ecuacion: ['12 ÷ 2 = 6 nietos'] },
        { texto: 'Con 6 nietos, cuento los caramelos.', ecuacion: ['9 × 6 + 7 = 61 = 11 × 6 − 5'] },
        { texto: ['Las trampas: ', letra('A'), ' son los nietos; ', letra('B'), ' no divide entre 2; ', letra('D'), ' es 11 × 6, sin los que faltan.'] },
      ],
      respuesta: [letra('C'), ': tiene 61 caramelos'] },
    { nivel: 3, titulo: 'Uno más y faltan',
      enunciado: 'Doña Juana da 4 caramelos a cada nieto y le sobran 5; para darles 5 a cada uno le faltarían 3. ¿Cuántos caramelos tiene?',
      alternativas: ['8', '32', '37', '40'],
      datos: ['Los caramelos son los mismos en los dos repartos', DR.div],
      solucion: [
        { texto: 'Dar 1 más a cada nieto pide los 5 que sobran y los 3 que faltan: 8 caramelos, uno por nieto. Son 8 nietos.' },
        { texto: 'Cuento los caramelos.', ecuacion: ['4 × 8 + 5 = 37 = 5 × 8 − 3'] },
        { texto: ['Las trampas: ', letra('A'), ' son los nietos; ', letra('B'), ' olvida los que sobran; ', letra('D'), ' es 5 × 8, sin los que faltan.'] },
      ],
      respuesta: [letra('C'), ': tiene 37 caramelos'] },
    { nivel: 3, titulo: 'El exceso es el doble',
      enunciado: 'En una división entre 15, el resto por exceso es el doble del resto por defecto, y el cociente por defecto es 6. ¿Cuál es el dividendo?',
      alternativas: ['95', '100', '85', '90'],
      datos: [DR.div, [R_, ' + ', RE, ' = ', D_]],
      solucion: [
        { texto: 'Los dos restos suman 15 y uno es el doble del otro: 1 parte más 2 partes.', ecuacion: [R_, ' = 15 ÷ 3 = ', lleva(5), ' ; ', RE, ' = ', res(10)] },
        { texto: 'Armo el dividendo con el resto por defecto.', ecuacion: ['D = ', bas(15), ' × 6 + ', lleva(5), ' = 95'] },
        { texto: ['Las trampas: ', letra('B'), ' suma el resto por exceso; ', letra('C'), ' lo resta de 90; ', letra('D'), ' olvida el resto.'] },
      ],
      respuesta: [letra('A'), ': el dividendo es 95'] },
    { nivel: 3, titulo: 'El mayor resto posible',
      enunciado: 'En una división entre 17, el cociente es 9 y el resto es el mayor posible. ¿Cuál es el dividendo?',
      alternativas: ['153', '169', '170', '161'],
      datos: [DR.div],
      solucion: [
        { texto: 'El resto es menor que el divisor: el mayor es 17 − 1 = 16.', ecuacion: [R_, ' = ', lleva(16)] },
        { texto: 'Armo el dividendo.', ecuacion: ['D = ', bas(17), ' × 9 + ', lleva(16), ' = 169'] },
        { texto: ['Las trampas: ', letra('A'), ' no pone resto; ', letra('C'), ' usa 17, que ya llenaría otra; ', letra('D'), ' usa la mitad.'] },
      ],
      respuesta: [letra('B'), ': el dividendo es 169'] },
    { nivel: 3, titulo: 'Restos que suman',
      enunciado: 'Al dividir D entre d, los dos restos suman 13 y el cociente por exceso es 8. Si el resto por defecto es 6, ¿cuánto vale D?',
      alternativas: ['97', '110', '104', '91'],
      datos: [DR.div, DR.exceso, [R_, ' + ', RE, ' = ', D_]],
      solucion: [
        { texto: 'Los dos restos suman el divisor: d = 13. El cociente por defecto es 8 − 1 = 7.' },
        { texto: 'Armo el dividendo.', ecuacion: ['D = ', bas(13), ' × 7 + ', lleva(6), ' = 97'] },
        { texto: ['Las trampas: ', letra('B'), ' usa el cociente por exceso con el resto por defecto; ', letra('C'), ' es 13 × 8; ', letra('D'), ' olvida el resto.'] },
      ],
      respuesta: [letra('A'), ': D = 97'] },
  ];

  const division = {
    id: 'defecto-exceso',
    titulo: 'Sobran o faltan para otra bolsita',
    pregunta: '¿Qué es el resto por exceso?',
    temas: ['División entera por defecto y por exceso'],
    pieza: PU,
    aprendizaje: 'En bolsitas iguales, por defecto sobran sueltos; por exceso se cuenta una bolsita más y faltan otros; los dos restos llenan una bolsita.',
    actividad: 'Cambiar el tamaño de la bolsita y ver cuánto sobra y cuánto falta.',
    lee: {
      tarjetas: [
        { titulo: 'Empacar es dividir', texto: 'Doña Juana empaca 26 caramelos en bolsitas de 5: llena 5 y le sobra 1. Repartir así es dividir: 26 es el dividendo y 5, el divisor.',
          pieza: PU, dibujo: { datos: { n: 5, bolsitas: 5, sueltos: 1, regla: 1, colorCifras: false, rotulos: { bolsitas: '5 bolsitas', sueltos: '1 suelto' } }, estado: {} } },
        { titulo: 'Sobran o faltan', texto: 'Lo que sobra es el resto por defecto. Si cuenta una bolsita más, la que no se llena, lo que le falta es el resto por exceso. Las bolsitas llenas forman un múltiplo de 5.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia el tamaño de la bolsita. Mira cuántos sueltos sobran y cuántos huecos quedan en la bolsita que no se llena.' },
      ],
    },
    ejemplos: EJEMPLOS_RESTOS,
    juega: {
      pieza: PU,
      consigna: 'Doña Juana empaca sus caramelos en bolsitas iguales. Elige cuántos tiene y cuántos lleva cada bolsita.',
      mision: {
        texto: 'Con 47 caramelos, elige la bolsita con la que faltan justo 3 para llenar otra.',
        logrado: v => v.a === 47 && v.d === 5,
        bien: 'Con bolsitas de 5 llena 9, le sobran 2 y la décima espera 3 más.',
      },
      voz: 'Mira los sueltos y los huecos de la última bolsita.',
      leyenda: [
        { s: bas('bolsita'), t: 'una bolsita llena' },
        { s: lleva('sueltos'), t: 'los que sobran: no llenan otra' },
        { s: res('huecos'), t: 'los que faltan para llenar otra' },
      ],
      controles: CTRL_D,
      dibujo: v => ({ datos: puestoD(v, escalaD()), estado: {} }),
      lectura: v => {
        const q = Math.floor(v.a / v.d), r = v.a % v.d;
        if (!r) return [`${v.a} = ${q} × `, bas(v.d), ': no sobra ni falta nada'];
        return [`${v.a} = ${q} × `, bas(v.d), ' + ', lleva(r), '; para otra bolsita faltan ', res(v.d - r)];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Doña Juana reparte caramelos entre sus 7 sobrinos: les da 5 a cada uno y le sobran 4. ¿Cuántos le faltarían para darles 6 a cada uno?',
      datos: ['Son 7 sobrinos', 'A cada uno le da 5 y le sobran 4'],
      voz: 'Piensa cuánto pide dar uno más a cada uno.',
      opciones: [
        { id: 'c', texto: '3', correcta: true },
        { id: 'igual', texto: '4', error: 'AT-EXCESO-IGUAL', siFuera: '4 son los que sobran. Faltan los que necesita para llegar a uno más por sobrino.' },
        { id: 'div', texto: '7', error: 'AT-EXCESO-DIVISOR', siFuera: '7 pide dar uno más a cada uno, pero ya tiene 4 sueltos para empezar.' },
        { id: 'suma', texto: '11', error: 'AT-EXCESO-SUMA', siFuera: 'Lo que sobra ayuda: se resta de lo que pide, no se suma.' },
      ],
      dibujo: fig({ n: 5, bolsitas: 7, sueltos: 4, colorCifras: false, rotulos: { bolsitas: '7 sobrinos, 5 a cada uno', sueltos: 'sobran 4' } }),
      revelar: fig({ n: 5, bolsitas: 7, incompleta: { de: 7, tiene: 4 }, colorCifras: false, rotulos: { bolsitas: '7 sobrinos, 5 a cada uno', incompleta: [['4 sueltos, '], ['3', 'f', 700], [' huecos']] } }),
      coincide: 'Coincide: uno más a cada sobrino pide 7, y tiene 4.',
      noCoincide: 'Revisemos: dar uno más a cada uno de los 7 pide 7 caramelos.',
    },
    mira: {
      pieza: PU,
      datos: { n: 5, bolsitas: 7, sueltos: 4, colorCifras: false, escala: ESC_D6, rotulos: { bolsitas: '7 sobrinos, 5 a cada uno', sueltos: '4 sueltos' }, pasos: [
        {},
        { sueltos: 0, incompleta: { de: 7, tiene: 4 }, rotulos: { bolsitas: '7 sobrinos, 5 a cada uno', incompleta: 'uno más para cada uno' } },
        { sueltos: 0, incompleta: { de: 7, tiene: 4 }, rotulos: { bolsitas: '7 sobrinos, 5 a cada uno', incompleta: [['4 sueltos, '], ['3', 'f', 700], [' huecos']] } },
        { sueltos: 0, incompleta: { de: 7, tiene: 4 }, rotulos: { bolsitas: '7 sobrinos, 5 a cada uno', incompleta: [['4', 'o', 700], [' + '], ['3', 'f', 700], [' = '], ['7', 'i', 700]] } },
        { sueltos: 0, incompleta: { de: 7, tiene: 4 }, rotulos: { bolsitas: '7 sobrinos, 5 a cada uno', incompleta: [['4', 'o', 700], [' + '], ['3', 'f', 700], [' = '], ['7', 'i', 700]] } },
      ] },
      voz: 'Lo que sobra y lo que falta, juntos.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Dio 5 a cada uno de sus 7 sobrinos, le sobraron 4: tiene 39.', ecuacion: [bas(7), ' × 5 + ', lleva(4), ' = 39'] },
        { estado: { paso: 1 }, texto: 'Darles 1 más a cada uno pide 7 caramelos: una bolsita de 7.', ecuacion: ['1 × ', bas(7), ' = 7'] },
        { estado: { paso: 2 }, texto: 'Tiene 4 sueltos: le faltan 7 − 4.', ecuacion: [bas(7), ' − ', lleva(4), ' = ', res(3)] },
        { estado: { paso: 3 }, texto: 'Lo que sobra y lo que falta llenan una bolsita.', ecuacion: [R_, ' + ', RE, ' = ', D_] },
        { estado: { paso: 4 }, texto: 'Por defecto, 39 = 7 × 5 + 4; por exceso, 39 = 7 × 6 − 3.', ecuacion: ['39 = ', bas(7), ' × 6 − ', res(3)] },
      ],
    },
    regla: {
      texto: 'Por defecto se llenan q bolsitas y sobran r; por exceso se cuenta una bolsita más y faltan rₑ. Los dos restos suman lo que lleva una bolsita.',
      ecuacion: ['D = ', D_, ' × q + ', R_, SEP, 'D = ', D_, ' × (q + 1) − ', RE, SEP, R_, ' + ', RE, ' = ', D_],
      condicion: 'Con 0 < r < d. El mayor resto es d − 1; si no sobra nada, la división es exacta.',
      voz: 'Sueltos y huecos llenan una bolsita.',
    },
    // Así se resuelve: el dividendo desde el cociente por defecto y el resto por exceso (23 × 15 + 14 = 359 es el caso de
    // la escena). «Ahora tú» pide el resto por exceso, el dividendo con otras trampas, restos relacionados y los repartos.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), d = r.ent(12, 30), q = r.ent(8, 25), re = r.ent(1, d - 1), rr = d - re, D = d * q + rr;
        return {
          enunciado: `Doña Juana empaca caramelos en bolsitas de ${d}: llena ${q} y, para llenar otra, le faltarían ${re}. ¿Cuántos caramelos tiene?`,
          datos: [DR.div, DR.exceso, [R_, ' + ', RE, ' = ', D_]],
          pasos: [
            { tipo: 'pide', texto: 'Piden el dividendo: todos los caramelos.' },
            { tipo: 'datos', texto: ['Divisor ', D_, ` = ${d}; cociente por defecto q = ${q}; resto por exceso `, RE, ` = ${re}.`] },
            { tipo: 'regla', texto: ['Los dos restos suman el divisor. Con el resto por defecto, D = ', D_, ' × q + ', R_, '.'] },
            { tipo: 'cuentas', texto: `Sueltos que sobran: ${d} − ${re}.`, ecuacion: [R_, ` = ${d} − ${re} = `, lleva(rr)] },
            { tipo: 'cuentas', texto: `Bolsitas llenas y sueltos: ${d} × ${q} + ${rr}.`, ecuacion: [`D = ${d} × ${q} + `, lleva(rr), ` = ${f(D, 0)}`] },
            { tipo: 'sentido', texto: `Compruebo por exceso: ${d} × ${q + 1} − ${re} = ${f(d * (q + 1) - re, 0)}. Cuadra.` },
          ],
          respuesta: [`Tiene ${f(D, 0)} caramelos`],
        };
      },
    },
    ahoraTu: {
      pieza: PU,
      voz: 'Sueltos y huecos llenan una bolsita.',
      generar(sem) {
        const r = azar(sem + 97), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoExcesoDesdeR, r);
        if (tipo === 1) return conCuatro(casoDDesdeExceso, r);
        if (tipo === 2) return conCuatro(casoRestosRelacion, r);
        if (tipo === 3) return conCuatro(casoDosRepartos, r);
        return conCuatro(casoUnoMas, r);
      },
    },
  };

  // ---------- Idea 7: ¿cabe el producto en la pantalla? (cantidad de cifras de un producto o cociente) ----------
  // Propuesta §1 a §7. Objeto: la calculadora de bolsillo de doña Juana, con una pantalla de 8 casillas (pieza
  // arit-calculadora, dibujo de prueba): a la izquierda el producto menor y a la derecha el mayor.
  // Cambia: cuántas cifras tienen A y B. · Permanece: las 8 casillas. · Progresa: el producto menor → el mayor → todo
  // producto queda entre los dos. · Se reserva: el cociente: es de la predicción (el juego solo multiplica). · Debe
  // verse: el menor y el mayor dicen cuántas casillas se llenan sin hacer la cuenta.
  // Errores (hipótesis de aula; la propuesta no encontró preguntas de San Marcos de esta idea): AT-COTA-RESTA resta las
  // cifras sin mirar el otro extremo · AT-COTA-MAX mira solo el caso mayor · AT-COTA-MIN solo el menor · AT-COTA-PRODUCTO
  // usa la regla del producto en un cociente · AT-COTA-MULT multiplica las cantidades de cifras · AT-COTA-UNA resta una
  // sola cifra con potencias · AT-COTA-EXPONENTE no cuenta los exponentes · AT-COTA-SUMA suma en vez de restar.
  const CALC = 'arit-calculadora';
  const cifrasTxt = x => (x === 1 ? '1 cifra' : `${x} cifras`);
  const calcJ = v => {
    const a0 = 10 ** (v.m - 1), b0 = 10 ** (v.n - 1), a1 = 10 ** v.m - 1, b1 = 10 ** v.n - 1;
    return { casillas: 8, calcs: [
      { cuenta: `${f(a0, 0)} × ${f(b0, 0)}`, pantalla: String(a0 * b0), rotulo: 'el menor' },
      { cuenta: `${f(a1, 0)} × ${f(b1, 0)}`, pantalla: String(a1 * b1), rotulo: 'el mayor' },
    ] };
  };
  const rangoProd = (p, q) => [p + q - 1, p + q];
  function casoCifrasProd(r) {
    const p = r.ent(2, 9), q = r.ent(2, 8);
    // Ni el caso de la misión (5 y 3) ni uno donde la trampa de multiplicar caiga en el rango.
    if (p * q === p + q || p * q === p + q - 1 || (p === 5 && q === 3) || (p === 3 && q === 5)) return null;
    return {
      pregunta: `A tiene ${p} cifras y B tiene ${q}. ¿Cuántas cifras puede tener A × B?`,
      datos: [DR.cifrasK],
      opciones: opciones(`${p + q - 1} o ${p + q} cifras`, [
        { id: 'max', valor: `siempre ${p + q}`, error: 'AT-COTA-MAX', siFuera: `${p + q} sale con el producto mayor. El menor tiene una cifra menos.` },
        { id: 'min', valor: `siempre ${p + q - 1}`, error: 'AT-COTA-MIN', siFuera: `${p + q - 1} sale con el producto menor. El mayor tiene una cifra más.` },
        { id: 'mult', valor: cifrasTxt(p * q), error: 'AT-COTA-MULT', siFuera: 'Las cifras no se multiplican: se miran el producto menor y el mayor.' },
      ]),
      solucion: { texto: `El menor tiene ${p + q - 1} cifras; el mayor no llega a un 1 con ${p + q} ceros.`, ecuacion: [res(`${p + q - 1} o ${p + q}`), ' cifras'] },
    };
  }
  function casoCifrasCoc(r) {
    const p = r.ent(5, 9), q = r.ent(2, p - 2);
    return {
      pregunta: `A tiene ${p} cifras y B tiene ${q}. ¿Cuántas cifras puede tener el cociente entero de A entre B?`,
      datos: [DR.cifrasK],
      opciones: opciones(`${p - q} o ${p - q + 1} cifras`, [
        { id: 'resta', valor: `siempre ${p - q}`, error: 'AT-COTA-RESTA', siFuera: `${p - q} sale con el cociente menor. El mayor tiene una cifra más.` },
        { id: 'max', valor: `siempre ${p - q + 1}`, error: 'AT-COTA-MAX', siFuera: `${p - q + 1} sale con el cociente mayor. El menor tiene una cifra menos.` },
        { id: 'prod', valor: `${p + q - 1} o ${p + q} cifras`, error: 'AT-COTA-PRODUCTO', siFuera: 'Esa es la regla del producto. Al dividir, las cifras bajan.' },
      ]),
      solucion: { texto: 'El menor cociente es el menor A entre el mayor B; el mayor, el mayor A entre el menor B.', ecuacion: [res(`${p - q} o ${p - q + 1}`), ' cifras'] },
    };
  }
  function casoCifrasPot(r) {
    const p = r.ent(2, 5), q = r.ent(2, 5), e1 = r.ent(2, 3), e2 = r.ent(2, 3);
    const lo = e1 * (p - 1) + e2 * (q - 1) + 1, hi = e1 * p + e2 * q;
    const A = { sup: ['A', String(e1)] }, B = { sup: ['B', String(e2)] };
    return {
      pregunta: ['A tiene ', String(p), ' cifras y B tiene ', String(q), '. ¿Cuántas cifras puede tener ', A, ' × ', B, '?'],
      datos: [DR.cifrasK, [{ sup: ['A', '2'] }, ' = A × A; ', { sup: ['A', '3'] }, ' = A × A × A']],
      opciones: opciones(`de ${lo} a ${hi} cifras`, [
        { id: 'una', valor: `${hi - 1} o ${hi} cifras`, error: 'AT-COTA-UNA', siFuera: `Al juntar ${e1 + e2} factores, el menor puede tener hasta ${e1 + e2 - 1} cifras menos.` },
        { id: 'max', valor: `siempre ${hi}`, error: 'AT-COTA-MAX', siFuera: `${hi} sale con los mayores. Con los menores salen menos.` },
        { id: 'exp', valor: `${p + q - 1} o ${p + q} cifras`, error: 'AT-COTA-EXPONENTE', siFuera: 'Eso sería A × B. Los exponentes repiten factores.' },
      ]),
      solucion: { texto: `Son ${e1 + e2} factores: el mayor da ${hi} cifras y el menor ${lo}.`, ecuacion: [res(`de ${lo} a ${hi}`), ' cifras'] },
    };
  }
  function casoCifrasFactor(r) {
    const p = r.ent(3, 7), q = r.ent(2, 6), c = p + q - r.ent(0, 1);
    if (c - p < 2) return null;
    return {
      pregunta: `A × B tiene ${c} cifras y A tiene ${p}. ¿Cuántas cifras puede tener B?`,
      datos: [DR.cifrasK, 'Un producto tiene las cifras de sus factores sumadas, o una menos'],
      opciones: opciones(`${c - p} o ${c - p + 1} cifras`, [
        { id: 'resta', valor: `siempre ${c - p}`, error: 'AT-COTA-RESTA', siFuera: `Con ${c - p} cifras puede ser; pero si el producto tuvo una menos, B tiene ${c - p + 1}.` },
        { id: 'max', valor: `siempre ${c - p + 1}`, error: 'AT-COTA-MAX', siFuera: `Con ${c - p + 1} cifras puede ser; pero si el producto tuvo justo la suma, B tiene ${c - p}.` },
        { id: 'suma', valor: `${c + p - 1} o ${c + p} cifras`, error: 'AT-COTA-SUMA', siFuera: 'Sumar las cifras es para el producto. Aquí se busca un factor: se restan.' },
      ]),
      solucion: { texto: `Si B tiene q cifras, el producto tiene ${p} + q o una menos.`, ecuacion: [`${p} + q = ${c}  o  ${p} + q − 1 = ${c}`] },
    };
  }

  // Ejemplos resueltos de la idea 7. Cuentas rehechas aparte (cuentas-ideas.js, con los casos extremos): 10 × 10 = 100
  // y 99 × 99 = 9 801; 999 × 9 = 8 991; 1 000 ÷ 9 = 111 y 9 999 ÷ 1 = 9 999; 4 o 5; 8 casillas con 4 + 4; A de 6 y B de
  // 3: 8 o 9; cociente de 8 entre 3: 5 o 6; A² de 3 cifras: 5 o 6; 25 × 4 = 100 frente a 10 × 10; A²·B³ con 3 y 2: de 8
  // a 12; A × B de 10 cifras con A de 6: B de 4 o 5; A³ de 4 cifras: de 10 a 12; cociente de 9 entre 4: 5 o 6;
  // producto de tres de 3 cifras: de 7 a 9.
  const calcU = (cuenta, pantalla, o = {}) => ({ pieza: CALC, datos: Object.assign({ casillas: 8, calcs: [Object.assign({ cuenta, pantalla })] }, o), estado: {} });
  const EJEMPLOS_CIFRAS = [
    { nivel: 1, titulo: 'Dos números de dos cifras',
      enunciado: '¿Cuántas cifras puede tener el producto de dos números de 2 cifras?',
      datos: [DR.cifrasK],
      figura: calcU('?? × ??', '?'),
      solucion: [{ texto: 'El menor es 10 × 10 = 100, con 3 cifras; el mayor, 99 × 99 = 9 801, con 4.', ecuacion: ['100 ≤ A × B ≤ 9 801'] }],
      respuesta: [res('3 o 4'), ' cifras'] },
    { nivel: 1, titulo: '¿Cabe en la pantalla?',
      enunciado: 'En la calculadora de 8 casillas, ¿cabe el resultado de 999 × 9?',
      datos: ['La pantalla tiene 8 casillas: una cifra en cada una'],
      figura: calcU('999 × 9', '?'),
      solucion: [{ texto: '999 × 9 es menos que 1 000 × 9 = 9 000: tiene 4 cifras como mucho.', ecuacion: ['999 × 9 = ', res('8 991')] }],
      respuesta: ['Sí: ocupa ', res(4), ' casillas'] },
    { nivel: 1, titulo: 'Las cotas de un número',
      enunciado: 'Un número A tiene 4 cifras. ¿Cuáles son sus cotas: el menor y el mayor valor que puede tener?',
      datos: [DR.cifrasK],
      solucion: [{ texto: 'Con 4 cifras, el menor es un 1 con tres ceros y el mayor, cuatro nueves.', ecuacion: ['1 000 ≤ A ≤ 9 999'] }],
      respuesta: ['De ', res('1 000'), ' a ', res('9 999')] },
    { nivel: 1, titulo: 'Un cociente de 4 entre 1',
      enunciado: 'A tiene 4 cifras y B, 1. ¿Cuántas cifras puede tener el cociente entero de A entre B?',
      datos: [DR.cifrasK],
      solucion: [{ texto: 'El menor: 1 000 ÷ 9 da 111, con 3 cifras. El mayor: 9 999 ÷ 1 = 9 999, con 4.' }],
      respuesta: [res('3 o 4'), ' cifras'] },
    { nivel: 1, titulo: 'Sumar las cifras',
      enunciado: 'A tiene 3 cifras y B tiene 2. ¿Cuántas cifras tiene A × B como mucho?',
      datos: [DR.cifrasK],
      solucion: [{ texto: 'El mayor es 999 × 99, que no llega a 1 000 × 100 = 100 000: tiene 5 cifras como mucho.', ecuacion: ['999 × 99 = 98 901'] }],
      respuesta: ['Como mucho ', res(5), ' cifras'] },
    { nivel: 2, titulo: 'Llenar justo la pantalla',
      enunciado: 'Doña Juana multiplica dos números de 4 cifras en su calculadora de 8 casillas. ¿Cabe siempre el resultado?',
      datos: [DR.cifrasK, 'La pantalla tiene 8 casillas'],
      figura: { pieza: CALC, datos: { casillas: 8, calcs: [{ cuenta: '1 000 × 1 000', pantalla: '?', rotulo: 'el menor' }, { cuenta: '9 999 × 9 999', pantalla: '?', rotulo: 'el mayor' }] }, estado: {} },
      solucion: [
        { texto: 'El menor: 1 000 × 1 000 = 1 000 000, con 7 cifras.' },
        { texto: 'El mayor: 9 999 × 9 999 = 99 980 001, con 8. Los dos caben.' },
      ],
      respuesta: ['Sí: ocupa ', res('7 u 8'), ' casillas'] },
    { nivel: 2, titulo: 'Seis por tres cifras',
      enunciado: 'A tiene 6 cifras y B tiene 3. ¿Cuántas cifras puede tener A × B?',
      datos: [DR.cifrasK],
      solucion: [
        { texto: 'El menor: 100 000 × 100 = 10 000 000, con 8 cifras.' },
        { texto: 'El mayor no llega a 1 000 000 × 1 000 = 1 000 000 000: tiene 9 cifras como mucho.' },
      ],
      respuesta: [res('8 o 9'), ' cifras'] },
    { nivel: 2, titulo: 'Un cociente de 8 entre 3',
      enunciado: 'A tiene 8 cifras y B tiene 3. ¿Cuántas cifras puede tener el cociente entero de A entre B?',
      datos: [DR.cifrasK],
      solucion: [
        { texto: 'El menor: 10 000 000 ÷ 999 da 10 010, con 5 cifras.' },
        { texto: 'El mayor: 99 999 999 ÷ 100 da 999 999, con 6.' },
      ],
      respuesta: [res('5 o 6'), ' cifras'] },
    { nivel: 2, titulo: 'El cuadrado de un número',
      enunciado: 'A tiene 3 cifras. ¿Cuántas cifras puede tener A²?',
      datos: [DR.cifrasK, [{ sup: ['A', '2'] }, ' = A × A']],
      solucion: [
        { texto: 'Es un producto de dos números de 3 cifras.', ecuacion: ['100 × 100 = 10 000 ; 999 × 999 = 998 001'] },
        { texto: 'El menor tiene 5 cifras y el mayor, 6.' },
      ],
      respuesta: [res('5 o 6'), ' cifras'] },
    { nivel: 2, titulo: 'Estimar no es adivinar',
      enunciado: '25 × 4 y 10 × 10 son productos de un número de 2 cifras por otro de 1 y por otro de 2. ¿Cuántas cifras tiene cada uno?',
      datos: [DR.cifrasK],
      solucion: [
        { texto: '25 × 4 = 100 tiene 3 cifras: 2 + 1 = 3, la suma justa.' },
        { texto: '10 × 10 = 100 también tiene 3: 2 + 2 − 1, una menos que la suma.' },
      ],
      respuesta: ['Los dos tienen ', res(3), ' cifras'] },
    { nivel: 3, titulo: 'Potencias de dos números',
      enunciado: ['A tiene 3 cifras y B tiene 2. ¿Cuántas cifras puede tener ', { sup: ['A', '2'] }, ' × ', { sup: ['B', '3'] }, '?'],
      alternativas: ['de 8 a 12', '11 o 12', 'siempre 12', '4 o 5'],
      datos: [DR.cifrasK, [{ sup: ['A', '2'] }, ' = A × A; ', { sup: ['B', '3'] }, ' = B × B × B']],
      solucion: [
        { texto: 'Son 5 factores. El menor: 100² × 10³ = 10 000 000, con 8 cifras.' },
        { texto: 'El mayor no llega a 1 000² × 100³ = 10¹²: tiene 12 cifras como mucho.' },
        { texto: ['Las trampas: ', letra('B'), ' resta una sola cifra; ', letra('C'), ' mira solo el mayor; ', letra('D'), ' olvida los exponentes.'] },
      ],
      respuesta: [letra('A'), ': de ', res(8), ' a ', res(12), ' cifras'] },
    { nivel: 3, titulo: 'El factor que falta',
      enunciado: 'A × B tiene 10 cifras y A tiene 6. ¿Cuántas cifras puede tener B?',
      alternativas: ['siempre 4', '4 o 5', 'siempre 5', '15 o 16'],
      datos: [DR.cifrasK, 'Un producto tiene las cifras de sus factores sumadas, o una menos'],
      solucion: [
        { texto: 'Si B tiene q cifras, A × B tiene 6 + q o 6 + q − 1.' },
        { texto: '6 + q = 10 da q = 4; 6 + q − 1 = 10 da q = 5. Las dos pueden pasar.' },
        { texto: ['Las trampas: ', letra('A'), ' y ', letra('C'), ' miran un solo caso; ', letra('D'), ' suma las cifras.'] },
      ],
      respuesta: [letra('B'), ': ', res('4 o 5'), ' cifras'] },
    { nivel: 3, titulo: 'Un cubo',
      enunciado: ['A tiene 4 cifras. ¿Cuántas cifras puede tener ', { sup: ['A', '3'] }, '?'],
      alternativas: ['de 10 a 12', '11 o 12', '7 u 8', 'siempre 12'],
      datos: [DR.cifrasK, [{ sup: ['A', '3'] }, ' = A × A × A']],
      solucion: [
        { texto: 'El menor: 1 000³ = 10⁹, un 1 con 9 ceros: 10 cifras.' },
        { texto: 'El mayor no llega a 10 000³ = 10¹²: tiene 12 cifras como mucho.' },
        { texto: ['Las trampas: ', letra('B'), ' resta una sola cifra; ', letra('C'), ' es A × A; ', letra('D'), ' mira solo el mayor.'] },
      ],
      respuesta: [letra('A'), ': de ', res(10), ' a ', res(12), ' cifras'] },
    { nivel: 3, titulo: 'Un cociente grande',
      enunciado: 'A tiene 9 cifras y B tiene 4. ¿Cuántas cifras puede tener el cociente entero de A entre B?',
      alternativas: ['siempre 5', '5 o 6', '12 o 13', 'siempre 6'],
      datos: [DR.cifrasK],
      solucion: [
        { texto: 'El menor: 100 000 000 ÷ 9 999 da 10 001, con 5 cifras.' },
        { texto: 'El mayor: 999 999 999 ÷ 1 000 da 999 999, con 6.' },
        { texto: ['Las trampas: ', letra('A'), ' resta las cifras; ', letra('C'), ' usa la regla del producto; ', letra('D'), ' mira solo el mayor.'] },
      ],
      respuesta: [letra('B'), ': ', res('5 o 6'), ' cifras'] },
    { nivel: 3, titulo: 'Tres factores',
      enunciado: 'A, B y C tienen 3 cifras cada uno. ¿Cuántas cifras puede tener A × B × C?',
      alternativas: ['siempre 9', '8 o 9', 'de 7 a 9', '27'],
      datos: [DR.cifrasK],
      solucion: [
        { texto: 'El menor: 100 × 100 × 100 = 1 000 000, con 7 cifras.' },
        { texto: 'El mayor no llega a 1 000³ = 10⁹: tiene 9 cifras como mucho.' },
        { texto: ['Las trampas: ', letra('A'), ' mira solo el mayor; ', letra('B'), ' resta una sola cifra; ', letra('D'), ' multiplica las cifras.'] },
      ],
      respuesta: [letra('C'), ': de ', res(7), ' a ', res(9), ' cifras'] },
  ];

  const cotas = {
    id: 'cifras-producto',
    titulo: '¿Cabe el producto en la pantalla?',
    pregunta: '¿Cuántas cifras puede tener un producto?',
    temas: ['Cantidad de cifras de un producto o cociente'],
    pieza: CALC,
    aprendizaje: 'Sin hacer la cuenta, el menor y el mayor caso acotan las cifras de un producto: las de los factores sumadas, o una menos.',
    actividad: 'Elegir cuántas cifras tienen dos números y ver si su producto cabe en la pantalla.',
    lee: {
      tarjetas: [
        { titulo: 'La calculadora del puesto', texto: 'Doña Juana saca sus cuentas con una calculadora de bolsillo. Su pantalla tiene 8 casillas: en cada una cabe una cifra.',
          pieza: CALC, dibujo: { datos: { casillas: 8, calcs: [{ cuenta: '24 × 7', pantalla: '168' }] }, estado: {} } },
        { titulo: 'Estimar sin calcular', texto: 'Para saber si un resultado cabe no hace falta la cuenta: basta estimar. Se buscan sus cotas: el menor y el mayor resultado que puede salir.' },
        { titulo: 'Qué mirar al jugar', texto: 'Elige cuántas cifras tienen A y B. A la izquierda verás el producto más chico; a la derecha, el más grande. Mira cuántas casillas llena cada uno.' },
      ],
    },
    ejemplos: EJEMPLOS_CIFRAS,
    juega: {
      pieza: CALC,
      consigna: 'La calculadora de doña Juana tiene una pantalla de 8 casillas. A la izquierda, el producto menor de A × B; a la derecha, el mayor.',
      mision: {
        texto: 'A tiene 5 cifras: ¿cuántas puede tener B, como mucho, para que A × B quepa siempre?',
        logrado: v => v.m === 5 && v.n === 3,
        bien: 'Con B de 3 cifras, hasta el mayor producto llena justo las 8 casillas.',
      },
      voz: 'Mira las dos pantallas a la vez.',
      leyenda: [
        { s: bas('casilla'), t: 'en cada una cabe una cifra' },
        { s: res('cifras'), t: 'el producto en la pantalla' },
        { s: 'E', t: 'no cabe: tiene más cifras que casillas' },
      ],
      controles: [
        { id: 'm', etiqueta: 'Cifras de A', min: 1, max: 5, paso: 1, inicio: 2, decimales: 0 },
        { id: 'n', etiqueta: 'Cifras de B', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: calcJ(v), estado: {} }),
      lectura: v => {
        const [lo, hi] = rangoProd(v.m, v.n);
        return ['El menor da ', res(cifrasTxt(lo)), ' y el mayor ', res(cifrasTxt(hi)), hi <= 8 ? ': cabe siempre' : ': no cabe en 8'];
      },
      minimo: 3,
    },
    predice: {
      pieza: CALC,
      pregunta: 'A tiene 7 cifras y B tiene 3. ¿Cuántas cifras puede tener el cociente entero de A entre B?',
      datos: ['A va de 1 000 000 a 9 999 999', 'B va de 100 a 999'],
      voz: 'Piensa en el cociente más chico y en el más grande.',
      opciones: [
        { id: 'c', texto: '4 o 5 cifras', correcta: true },
        { id: 'resta', texto: 'siempre 4', error: 'AT-COTA-RESTA', siFuera: '7 − 3 = 4 sale con el cociente menor. El mayor tiene una cifra más.' },
        { id: 'max', texto: 'siempre 5', error: 'AT-COTA-MAX', siFuera: '5 sale con el cociente mayor. El menor tiene una cifra menos.' },
        { id: 'prod', texto: '9 o 10 cifras', error: 'AT-COTA-PRODUCTO', siFuera: 'Esa es la regla del producto. Al dividir, las cifras bajan.' },
      ],
      dibujo: { datos: { casillas: 8, calcs: [{ cuenta: 'A ÷ B', pantalla: '?' }] }, estado: {} },
      revelar: { datos: { casillas: 8, calcs: [{ cuenta: '1 000 000 ÷ 999', pantalla: '1001', rotulo: 'el menor' }, { cuenta: '9 999 999 ÷ 100', pantalla: '99999', rotulo: 'el mayor' }] }, estado: {} },
      coincide: 'Coincide: el menor cociente es 1 001 y el mayor, 99 999.',
      noCoincide: 'Revisemos: el menor cociente sale del menor A entre el mayor B.',
    },
    mira: {
      pieza: CALC,
      datos: { casillas: 8, calcs: [{ cuenta: '10 000 × 100', pantalla: '?', rotulo: 'el menor' }, { cuenta: '99 999 × 999', pantalla: '?', rotulo: 'el mayor' }], pasos: [
        {},
        { calcs: [{ cuenta: '10 000 × 100', pantalla: '1000000', rotulo: 'el menor' }, { cuenta: '99 999 × 999', pantalla: '?', rotulo: 'el mayor' }] },
        { calcs: [{ cuenta: '10 000 × 100', pantalla: '1000000', rotulo: 'el menor' }, { cuenta: '99 999 × 999', pantalla: '99899001', rotulo: 'el mayor' }] },
        { calcs: [{ cuenta: '10 000 × 100', pantalla: '1000000', rotulo: 'el menor' }, { cuenta: '99 999 × 999', pantalla: '99899001', rotulo: 'el mayor' }] },
        { calcs: [{ cuenta: '1 000 000 ÷ 999', pantalla: '1001', rotulo: 'el menor' }, { cuenta: '9 999 999 ÷ 100', pantalla: '?', rotulo: 'el mayor' }] },
        { calcs: [{ cuenta: '1 000 000 ÷ 999', pantalla: '1001', rotulo: 'el menor' }, { cuenta: '9 999 999 ÷ 100', pantalla: '99999', rotulo: 'el mayor' }] },
      ] },
      voz: 'El caso menor y el mayor encierran a todos.',
      pasos: [
        { estado: { paso: 0 }, texto: 'A tiene 5 cifras y B, 3: se miran el menor y el mayor.', ecuacion: ['10 000 ≤ A ≤ 99 999 ; 100 ≤ B ≤ 999'] },
        { estado: { paso: 1 }, texto: 'El menor: 10 000 × 100 = 1 000 000, con 7 cifras.', ecuacion: ['10 000 × 100 = ', res('1 000 000')] },
        { estado: { paso: 2 }, texto: 'El mayor: 99 999 × 999 = 99 899 001, con 8 cifras.', ecuacion: ['99 999 × 999 = ', res('99 899 001')] },
        { estado: { paso: 3 }, texto: 'Todo producto queda entre los dos: tiene 5 + 3 cifras, o una menos.', ecuacion: ['5 + 3 = 8 ; 8 − 1 = 7'] },
        { estado: { paso: 4 }, texto: 'Con el cociente, igual: el menor es 1 000 000 ÷ 999 = 1 001.', ecuacion: ['1 000 000 ÷ 999 = ', res('1 001')] },
        { estado: { paso: 5 }, texto: 'El mayor es 9 999 999 ÷ 100 = 99 999: 4 o 5 cifras.', ecuacion: ['7 − 3 = 4 ; 4 + 1 = 5'] },
      ],
    },
    regla: {
      texto: 'Un producto tiene las cifras de sus factores sumadas, o una menos. Un cociente entero, la resta de las cifras, o una más. Deciden el caso menor y el mayor.',
      ecuacion: ['A × B: ', res('la suma de cifras'), ' o una menos', SEP, 'A ÷ B: ', res('la resta de cifras'), ' o una más'],
      condicion: 'Con potencias: A² es A × A; se aplica la regla a cada producto o se miran los extremos.',
      voz: 'Sin hacer la cuenta: el menor y el mayor.',
    },
    // Así se resuelve: si un producto cabe siempre en la calculadora (la tabla de extremos). «Ahora tú» pide cifras de un
    // producto, de un cociente, de potencias y de un factor desde el producto.
    resuelve: {
      pieza: CALC,
      generar(s) {
        const r = azar(s + 900), p = r.ent(2, 6), q = r.ent(2, 6), [lo, hi] = rangoProd(p, q);
        const veredicto = hi <= 8 ? 'Sí: cabe siempre' : lo <= 8 ? 'A veces: el mayor no cabe' : 'Nunca cabe';
        return {
          enunciado: `Doña Juana multiplica un número de ${p} cifras por uno de ${q} cifras en su calculadora de 8 casillas. ¿Cabe siempre el resultado?`,
          datos: [DR.cifrasK, 'La pantalla tiene 8 casillas'],
          dibujo: { datos: { casillas: 8, calcs: [{ cuenta: `${p} cifras × ${q} cifras`, pantalla: '?' }] }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden si el producto entra en 8 casillas, sea cual sea.' },
            { tipo: 'regla', texto: 'Sin hacer la cuenta, miro el producto menor y el mayor: todo producto queda entre los dos.' },
            { tipo: 'cuentas', texto: `El menor: un 1 con ${p - 1} ${p - 1 === 1 ? 'cero' : 'ceros'} por un 1 con ${q - 1}: un 1 con ${p + q - 2} ceros, ${cifrasTxt(lo)}.`, ecuacion: [{ sup: ['10', String(p - 1)] }, ' × ', { sup: ['10', String(q - 1)] }, ' = ', { sup: ['10', String(p + q - 2)] }] },
            { tipo: 'cuentas', texto: `El mayor no llega a un 1 con ${p} ceros por un 1 con ${q}: tiene ${cifrasTxt(hi)} como mucho.`, ecuacion: ['producto < ', { sup: ['10', String(p + q)] }] },
            { tipo: 'sentido', texto: `Entonces el producto tiene ${lo} o ${hi} cifras, frente a 8 casillas.`, ecuacion: [res(`${lo} o ${hi}`), ' cifras'] },
          ],
          respuesta: [veredicto],
        };
      },
    },
    ahoraTu: {
      voz: 'El caso menor y el mayor.',
      generar(sem) {
        const r = azar(sem + 101), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoCifrasProd, r);
        if (tipo === 1) return conCuatro(casoCifrasCoc, r);
        if (tipo === 2) return conCuatro(casoCifrasPot, r);
        return conCuatro(casoCifrasFactor, r);
      },
    },
  };

  // ---------- Laboratorio ----------
  // Restos de la mesa de la recta: por defecto y por exceso (0 si la división es exacta).
  const rLab = v => v.a % v.d, reLab = v => (rLab(v) ? v.d - rLab(v) : 0);
  // Lo que sube el producto de la tira de arriba a la de abajo, y la mayor subida con k ≤ 9 y b ≤ 9.
  const sube = v => (v.a + v.k) * v.b - v.a * v.b;
  const MAX_SUBE = sube({ a: 10, b: 9, k: 9 });
  // Recta de 0 a 112 (fija) con los dos múltiplos vecinos (turquesa: el envase); r naranja y rₑ violeta, como en la idea 6.
  function rectaLab(av, dv) {
    const qv = Math.floor(av / dv), rv = av - qv * dv;
    return {
      min: 0, max: 112, paso: dv, decimales: 0, variable: 'múltiplos de ' + dv, color: 'i', filas: 3,
      elementos: [
        { tipo: 'punto', x: qv * dv, color: 'i', fila: 0 },
        { tipo: 'punto', x: (qv + 1) * dv, color: 'i', fila: 0 },
        { tipo: 'punto', x: av, rotulo: `D = ${f(av)}`, fila: 1 },
        ...(rv ? [
          { tipo: 'distancia', a: qv * dv, b: av, color: 'o', rotulo: `r = ${rv}`, fila: 2 },
          { tipo: 'distancia', a: av, b: (qv + 1) * dv, color: 'f', rotulo: `rₑ = ${dv - rv}`, fila: 3 },
        ] : []),
      ],
    };
  }
  // Dos tiras a la misma escala (0 a 432 = 48 × 9): a × b arriba y (a + k) × b abajo, con lo que sube en violeta.
  function dosProductos(av, bv, k) {
    const base = Math.min(av, av + k), extra = Math.abs(k) * bv;
    const abajo = [{ valor: base * bv, texto: `${base} × ${bv}` }];
    if (k > 0) abajo.push({ valor: extra, color: 'f', texto: `+${k} × ${bv}` });
    const arriba = [{ valor: base * bv, texto: `${base} × ${bv}` }];
    if (k < 0) arriba.push({ valor: extra, color: 'f', hueco: true });
    return { max: 432, filas: 2, alt: `Tira de ${av} por ${bv} y tira de ${av + k} por ${bv}: difieren en ${Math.abs(k)} por ${bv}`, tiras: [
      { rotulo: `${av} × ${bv}`, fin: f(av * bv), tramos: arriba },
      { rotulo: `${av + k} × ${bv}`, fin: f((av + k) * bv), tramos: abajo },
    ] };
  }

  return {
    unidad: 'aritmetica.cuatro-operaciones',
    version: '0.4.0',
    // Las siete ideas rehechas contra el contrato (18 nov): calidad 2, y el validador común lo exige.
    calidad: 2,
    septimaIdea: 'La resta y las cifras ocultas son 4 de las 6 preguntas de San Marcos de esta unidad (2019-II a 2026-I).',
    // Un color fijo por magnitud (cabecera); lo comprueba cuatro-operaciones.test.js en las siete ideas.
    colores: COLORES,
    estado: 'completa',
    // El motor de la escena va antes que las piezas (regla 1: los juegos y las mesas cuentan con él).
    requiere: ['/plantillas/cuatro-operaciones/motor.js', '/nucleo/kit/piezas/arit-puesto.js', '/nucleo/kit/piezas/arit-calculadora.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/arit-tiras.js'],
    // «complemento» (el de conjuntos, lo que le falta a A para llenar U) no se marca aquí: aquí se dice «complemento
    // aritmético».
    glosarioSin: ['complemento'],
    // Glosario: las palabras que esta unidad estrena en el curso (docs/teoria.md §4d), de 2 a 4 por idea con su
    // aproximación (simple) y tres ejemplos. «llevada», «reverso», «factor», «producto» y «múltiplo» se estrenan aquí
    // (propuesta §11, pregunta 8): Razonamiento numérico, Razones y Conjuntos ya no los definen, y el lector los marca
    // allá como «Se explica en Las cuatro operaciones». «sumatoria» se mudó a Sucesiones y series. «acotar», «cociente»,
    // «resto», «potencia» y «cifra oculta» son de Numeración: aquí no se definen.
    glosario: [
      // «sumandos» va en plural a propósito: «sumando» suelto es el gerundio en razones y estadística.
      { termino: 'sumandos', def: 'Los números que se juntan en una suma.',
        simple: 'Cada pedido que se junta: el de la mañana y el de la tarde.',
        ver: ['llevada', 'sumatoria'],
        ejemplos: ['En 26 + 13 hay dos: 26 y 13.', 'En 3 + 4 + 5 = 12 son tres: 3, 4 y 5.', 'En 52₍₇₎ + 14₍₇₎ los dos están en base 7.'] },
      { termino: 'llevada', formas: ['llevada', 'llevadas'],
        def: 'Lo que pasa a la columna de la izquierda cuando una columna junta la base o más.',
        simple: 'La bolsita llena que sube a la columna de al lado.',
        ver: ['sumandos', 'base de numeración'],
        ejemplos: ['9 + 6 = 15: se anota 5 y la llevada es 1.', 'En base 4, 3 + 2 = 5 = 1 × 4 + 1: se lleva 1.', '9 + 8 + 7 = 24: la llevada es 2.'] },
      { termino: 'minuendo', def: 'En una resta, el número del que se quita: el que va arriba.',
        simple: 'Lo que doña Juana tiene antes de despachar.', ver: ['sustraendo', 'diferencia'],
        ejemplos: ['En 85 − 32 = 53, es 85.', 'En 700 − 1 = 699, es 700.', 'En 41₍₅₎ − 13₍₅₎, es 41₍₅₎.'] },
      { termino: 'sustraendo', def: 'En una resta, el número que se quita: el que va abajo.',
        simple: 'Lo que se lleva el cliente.', ver: ['minuendo', 'diferencia'],
        ejemplos: ['En 85 − 32 = 53, es 32.', 'En 900 − 125, es 125.', 'Si tienes 20 y regalas 6, es 6.'] },
      { termino: 'diferencia', formas: ['diferencia', 'diferencias'], def: 'El resultado de una resta: lo que queda después de quitar.',
        simple: 'Lo que le queda en el puesto después de despachar.', ver: ['minuendo', 'sustraendo'],
        ejemplos: ['85 − 32 = 53: es 53.', 'De 64 a 100 hay una de 36.', 'Sumada al sustraendo da el minuendo: 53 + 32 = 85.'] },
      { termino: 'préstamo', formas: ['préstamo', 'préstamos'], def: 'Abrir 1 de la columna de la izquierda en 10 (en n, en base n) cuando arriba no alcanza.',
        simple: 'Abrir una bolsita para tener más sueltos.', ver: ['llevada', 'minuendo'],
        ejemplos: ['62 − 27: 2 no alcanza para 7; abriendo una bolsita, 12 − 7 = 5.', 'En 40 − 13, el 4 presta y queda en 3.', 'En 100 − 1 prestan dos columnas: da 99.'] },
      { termino: 'complemento aritmético', simbolo: 'CA', formas: ['complemento aritmético', 'complementos aritméticos'],
        def: 'Lo que le falta a un número para llegar a un 1 seguido de tantos ceros como cifras tiene.',
        simple: 'El vuelto: lo que falta para completar 10, 100 o 1 000.', ver: ['última cifra significativa', 'potencia'],
        ejemplos: ['CA(37) = 100 − 37 = 63.', 'CA(306) = 1 000 − 306 = 694.', 'CA(5 800) = 10 000 − 5 800 = 4 200.'] },
      { termino: 'última cifra significativa', def: 'La última cifra que no es 0, leyendo el número de izquierda a derecha.',
        simple: 'La última cifra antes de los ceros del final.', ver: ['complemento aritmético'],
        ejemplos: ['En 6 120 es el 2.', 'En 506 es el 6.', 'En 9 000 es el 9.'] },
      { termino: 'reverso', formas: ['reverso', 'reversos'], def: 'Número que se escribe con las mismas cifras de otro, en orden contrario.',
        simple: 'El mismo número leído de derecha a izquierda.', ver: ['valor posicional'],
        ejemplos: ['El de 365 es 563.', 'El de 72 es 27.', 'Un número menos ese: 914 − 419 = 495.'] },
      { termino: 'consecutivo', formas: ['consecutivos', 'consecutivo', 'consecutivas'],
        def: 'Números enteros que van uno detrás del otro, de 1 en 1, sin saltarse ninguno.',
        simple: 'Que van seguidos, sin saltarse ninguno: 4, 5, 6.',
        ejemplos: ['7, 8 y 9 lo son; 7, 9 y 11 no.', 'Las cifras de 345 lo son.', 'Dos así suman un impar: 12 + 13 = 25.'] },
      { termino: 'factor', formas: ['factor', 'factores'], def: 'Cada uno de los números que se multiplican.',
        simple: 'Cada número que se multiplica: las bolsas o lo que lleva cada una.', ver: ['producto', 'propiedad distributiva'],
        ejemplos: ['En 6 × 15 = 90, son 6 y 15.', 'En 24 × 7, el 7 dice cuántas bolsas hay.', 'Si uno sube 2 y el otro es 9, el producto sube 18.'] },
      { termino: 'producto', formas: ['producto', 'productos'], def: 'Resultado de una multiplicación.',
        simple: 'El pedido completo: todo lo de las bolsas junto.', ver: ['factor'],
        ejemplos: ['6 × 15 = 90: es 90.', 'El de 4 por 25 es 100.', 'Si un factor es 0, da 0.'] },
      { termino: 'propiedad distributiva', def: 'Multiplicar una suma da lo mismo que multiplicar cada parte y sumar los resultados.',
        simple: 'Multiplicar por partes y después juntarlas.', ver: ['factor', 'producto'],
        ejemplos: ['24 × 7 = 20 × 7 + 4 × 7 = 168.', '(30 + 2) × 5 = 150 + 10 = 160.', '15 × 9 − 12 × 9 = 3 × 9 = 27.'] },
      { termino: 'dividendo', simbolo: 'D', def: 'El número que se reparte en una división: el que va antes del signo ÷.',
        simple: 'Todos los caramelos que se van a empacar.', ver: ['divisor', 'cociente entero'],
        ejemplos: ['En 53 ÷ 6, es 53.', 'Si empacas 38 caramelos, es 38.', 'D = d × q + r: 89 = 12 × 7 + 5.'] },
      { termino: 'divisor', simbolo: 'd', def: 'El número entre el que se divide. Si no sobra nada, se dice que divide al otro.',
        simple: 'Entre cuántos se reparte, o cuántos caramelos lleva cada bolsita.', ver: ['dividendo', 'múltiplo'],
        ejemplos: ['En 53 ÷ 6, es 6.', 'Bolsitas de 5: es 5.', '7 divide a 42, porque 42 = 7 × 6.'] },
      { termino: 'múltiplo', formas: ['múltiplo', 'múltiplos'], def: 'Resultado de multiplicar un número por un entero.',
        simple: 'Lo que dan varias bolsitas llenas: 5, 10, 15…', ver: ['divisor'],
        ejemplos: ['42 lo es de 6, porque 6 × 7 = 42.', 'Los de 5: 0, 5, 10, 15, 20…', '35 lo es de 5 y de 7.'] },
      { termino: 'resto por exceso', simbolo: 'rₑ', formas: ['resto por exceso', 'restos por exceso'],
        def: 'Lo que le falta al dividendo para llegar al múltiplo del divisor que queda justo encima.',
        simple: 'Los huecos que faltan para llenar una bolsita más.', ver: ['resto por defecto'],
        ejemplos: ['53 = 6 × 9 − 1: es 1.', '29 en bolsitas de 4: faltan 3.', 'Con divisor 9 y resto por defecto 4, es 5.'] },
      { termino: 'resto por defecto', simbolo: 'r', formas: ['resto por defecto', 'restos por defecto'],
        def: 'Lo que pasa el dividendo del múltiplo del divisor que queda justo debajo.', ver: ['resto por exceso', 'resto'],
        ejemplos: ['53 = 6 × 8 + 5: es 5.', '38 en bolsitas de 6: sobran 2.', 'Es menor que el divisor: con 8, como mucho 7.'] },
      { termino: 'división exacta', formas: ['división es exacta', 'división exacta', 'divisiones exactas'],
        def: 'La que no deja nada sobrante: el dividendo es un múltiplo del divisor.', ver: ['divisor'],
        ejemplos: ['48 ÷ 6 = 8 y no sobra nada.', '42 en bolsitas de 7: 6 justas.', 'Con resto 0 no hay resto por exceso.'] },
      { termino: 'cociente entero', simbolo: 'q', formas: ['cociente entero', 'cocientes enteros'],
        def: 'Cuántas veces cabe completo el divisor en el dividendo, sin contar lo que sobra.', ver: ['resto por defecto', 'divisor'],
        ejemplos: ['53 ÷ 6: cabe 8 veces, porque 6 × 8 = 48.', '9 999 ÷ 100 da 99.', 'El de 75 entre 8 es 9.'] },
      { termino: 'cota', formas: ['cota', 'cotas'], def: 'Valor que algo desconocido no puede pasar: uno por abajo y otro por arriba.',
        simple: 'El tope: lo más chico o lo más grande que puede salir.', ver: ['estimar'],
        ejemplos: ['Un número de 3 cifras está entre 100 y 999.', 'Dos números de 2 cifras dan como mucho 99 × 99 = 9 801.', 'Si 8 ≤ x ≤ 15, son 8 y 15.'] },
      { termino: 'estimar', formas: ['estimar', 'estima', 'estimo', 'estimación'], def: 'Calcular un valor aproximado sin hacer la cuenta exacta.',
        simple: 'Calcular más o menos, sin hacer toda la cuenta.', ver: ['cota'],
        ejemplos: ['49 × 21 es cerca de 50 × 20 = 1 000.', '99 × 999 pasa de 90 000: se ve sin calcular.', 'Para saber cuántas cifras tiene, basta eso.'] },
    ],
    // Laboratorio: juego libre, sin preguntas. «Sumar en cualquier base» (idea 1), «Restos con números grandes» (idea 6:
    // D hasta 100 y d hasta 12, con divisiones exactas) y «Dos productos» (idea 5: a × b y (a + k) × b en la misma
    // escala, con k negativo también).
    laboratorio: [
      mesaBases,
      {
        id: 'restos-grandes', titulo: 'Restos con números grandes', pieza: 'recta',
        consigna: 'D caramelos en bolsitas de d. Arrastra D por la recta: cuando cae en un múltiplo de d, la división es exacta.',
        controles: [
          { id: 'a', etiqueta: 'D, caramelos', min: 0, max: 100, paso: 1, inicio: 47, decimales: 0 },
          { id: 'd', etiqueta: 'd, por bolsita', color: 'c-i', min: 2, max: 12, paso: 1, inicio: 6, decimales: 0 },
        ],
        dibujo: v => ({ datos: rectaLab(v.a, v.d), estado: { corte: 1 } }),
        lectura: v => {
          const qv = Math.floor(v.a / v.d), rv = v.a % v.d;
          return rv ? [`${v.a} ÷ ${v.d}: `, R_, ' = ', lleva(rv), ', ', RE, ' = ', res(v.d - rv), `; suman ${v.d}`] : [`${v.a} ÷ ${v.d} es exacta: ${v.a} = ${v.d} × ${qv}`];
        },
        // Retos: rLab y reLab son los mismos restos que mide la recta (v.a % v.d y lo que falta).
        invitaciones: [
          { texto: 'Haz que la división sea exacta con D mayor que 90.',
            logrado: v => v.a > 90 && rLab(v) === 0,
            bien: 'D cae sobre un múltiplo: no sobra ni falta nada.' },
          { texto: 'Haz que los dos restos sean iguales.',
            logrado: v => rLab(v) > 0 && rLab(v) === reLab(v),
            bien: 'Solo pasa con divisor par: cada resto es la mitad de d.' },
          { texto: 'Con d = 12, consigue el resto por exceso más grande posible.',
            logrado: v => v.d === 12 && rLab(v) > 0 && reLab(v) === v.d - 1,
            bien: 'rₑ = 11 cuando r = 1: los dos restos siempre suman 12.' },
          { texto: 'Guarda dos casos con el mismo d y los restos intercambiados.',
            logrado: (v, guardados) => rLab(v) > 0 && guardados.some(g => g.d === v.d && rLab(g) > 0 && rLab(g) !== rLab(v) && rLab(g) === reLab(v)),
            bien: 'Lo que a uno le sobra, al otro le falta: posiciones en espejo.' },
        ],
        arrastres: [{ id: 'a', etiqueta: 'el dividendo D en la recta',
          donde: v => { const g = RECTA().geometria(rectaLab(v.a, v.d)); return { x: g.x(v.a), y: g.filaY(1) }; },
          mover: (pt, v) => ({ a: inversa(RECTA().geometria(rectaLab(v.a, v.d)).x, 0, 112)(pt.x) }) }],
      },
      {
        id: 'dos-productos', titulo: 'Dos productos', pieza: 'arit-tiras',
        consigna: 'Arriba a × b; abajo, el primer factor sube k: (a + k) × b, con la misma escala. Arrastra el final de cada tira.',
        controles: [
          { id: 'a', etiqueta: 'Primer factor, a', min: 10, max: 39, paso: 1, inicio: 24, decimales: 0 },
          { id: 'b', etiqueta: 'Segundo factor, b', min: 2, max: 9, paso: 1, inicio: 7, decimales: 0 },
          { id: 'k', etiqueta: 'Lo que sube el primero, k', min: -9, max: 9, paso: 1, inicio: 3, decimales: 0 },
        ],
        dibujo: v => ({ datos: dosProductos(v.a, v.b, v.k), estado: {} }),
        lectura: v => [`${v.a + v.k} × ${v.b} − ${v.a} × ${v.b} = ${v.k} × ${v.b} = `, res(f(sube(v)))],
        invitaciones: [
          { texto: 'Haz que el producto baje justo 24.',
            logrado: v => sube(v) === -24,
            bien: 'Bajar 24 es quitar grupos de b: 4 de 6, o 3 de 8.' },
          { texto: 'Haz que las dos tiras midan lo mismo.',
            logrado: v => sube(v) === 0,
            bien: 'Con k = 0 no se agrega ni se quita ningún grupo.' },
          { texto: 'Consigue la mayor subida que dejan los controles.',
            logrado: v => sube(v) === MAX_SUBE,
            bien: 'Nueve grupos de 9: 81, sin importar cuánto vale a.' },
          { texto: 'Guarda dos casos con distinto a y la misma subida.',
            logrado: (v, guardados) => sube(v) !== 0 && guardados.some(g => g.a !== v.a && sube(g) === sube(v)),
            bien: 'Cambió a y la subida no: solo cuentan k y b.' },
        ],
        arrastres: [
          { id: 'fin-a', etiqueta: 'final de la tira de arriba (a)',
            donde: v => { const g = TIRAS().geometria(dosProductos(v.a, v.b, v.k)); return { x: g.x(v.a * v.b), y: g.tiraY(0) }; },
            mover: (pt, v) => ({ a: TIRAS().geometria(dosProductos(v.a, v.b, v.k)).deX(pt.x) / v.b }) },
          { id: 'fin-k', etiqueta: 'final de la tira de abajo (k)', color: 'c-f',
            donde: v => { const g = TIRAS().geometria(dosProductos(v.a, v.b, v.k)); return { x: g.x((v.a + v.k) * v.b), y: g.tiraY(1) }; },
            mover: (pt, v) => ({ k: TIRAS().geometria(dosProductos(v.a, v.b, v.k)).deX(pt.x) / v.b - v.a }) },
        ],
      },
    ],
    historia: {
      texto: 'Los papiros matemáticos egipcios multiplican sin nuestra tabla: duplican y suman algunos duplicados. Para 13 × 7 bastaba sumar 8 × 7, 4 × 7 y 1 × 7. Dividir era buscar qué múltiplos formaban una cantidad. Enseña que una operación y su procedimiento no son lo mismo: lo que se conserva es la propiedad de repartir.',
      pregunta: '¿Cómo multiplicarías solo duplicando y sumando?',
      fuente: { titulo: 'O’Connor y Robertson, Egyptian Papyri — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Egyptian_papyri/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'juego-otras-bases': ['otras-bases'],
      'restos-grandes': ['defecto-exceso'],
      'dos-productos': ['multiplicar-partes'],
    },
    // Orden de la propuesta aprobada (docs/etapa4/propuesta-aritmetica.md §1).
    ideas: [otrasBases, prestamo, complemento, cifrasOcultas, multiplicacion, division, cotas],
  };
});
