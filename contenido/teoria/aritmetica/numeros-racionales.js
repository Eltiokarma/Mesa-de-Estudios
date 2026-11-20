/*
 * Teoría de «Números racionales, fracciones y decimales» (aritmetica.numeros-racionales), para 5.º de secundaria y
 * preuniversitario. Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 16).
 *
 * Etapa 8 del plan de calidad (19 nov), EN PROCESO: la propuesta es docs/etapa8/propuesta-aritmetica.md (Gerson delegó
 * el criterio y la revisa después). Seis ideas, rehechas contra el contrato con sus 15 ejemplos: 1 `equivalentes`
 * (fracciones equivalentes e irreductible), 2 `orden-recta` (comparar fracciones; clases), 3 `del-resto` (nueva: sumar
 * partes del mismo total y tomar una parte de lo que queda; la pregunta que más repite San Marcos), 4 `exacto-periodico`
 * (decimal exacto o periódico; racionales e irracionales), 5 `generatriz` (la fracción de un periódico, alineando las
 * colas) y 6 `otras-bases` (exacto o periódico en otra base). Hilo de la rama: el queque de la promoción (pieza
 * arit-queque, ideas 1, 2, 3 y 6) y la calculadora de doña Juana (arit-calculadora, con el bloque de la coma; ideas 4 y
 * 5); los dos, dibujos de prueba. Práctica por idea: plantillas/racionales. Sin calidad: 2 todavía (falta el cierre:
 * lector en frío y auditor).
 *
 * Letras (propuesta §6; def.letras): a y b, el numerador y el denominador de una fracción a/b (aviso: en Numeración y Las
 * cuatro operaciones, a, b y c eran cifras; aquí no hay cifras ocultas); c y d, los de otra fracción; k, el número por el
 * que se multiplican los dos términos; x, el decimal periódico al que se le busca la fracción (idea 5); B, la base (idea
 * 6; en Numeración era n) y n, el denominador de 1/n en esa idea; N, una cantidad entera (kilos, panes). × para
 * multiplicar, nunca «·» (el «   ·   » solo separa dos relaciones en una regla). Los periódicos, con el bloque escrito dos
 * veces y «…» (0,272727…, 0,8333…), nunca con raya.
 *
 * REGLA DE COLORES DE LA UNIDAD: un color fijo por magnitud (docs/molde-unidad.md §5b; propuesta §7), en la tabla
 * COLORES (def.colores):
 *   - naranja (c-o), «parte»: el numerador, las porciones que se toman (lo vendido del queque);
 *   - turquesa (c-i), «partes»: el denominador, en cuántas partes iguales se corta el entero;
 *   - violeta (c-f), «pedido»: lo que se busca y su resultado (la fracción que queda, la equivalente que falta, las
 *     cifras que salen de la división, la generatriz);
 *   - carmín (c-h), «resto»: el resto de la división (ideas 4 a 6; esta unidad no tiene ángulos);
 *   - tinta: las cantidades (kilos, horas, cuántas fracciones), la base, k, x y «?». Una respuesta que es una cantidad va
 *     en tinta, como en MCD y MCM.
 *   - nada en verde (la teoría de antes ponía las cifras en verde, junto al carmín y al naranja).
 *   La letra de una alternativa va en negrita y en tinta ({ negrita }). Cada ficha de color dice su magnitud (m);
 *   contenido/teoria/aritmetica/numeros-racionales.test.js falla si una cambia de color.
 * Errores: AR12 (sumar numeradores y denominadores, documentado) y AR11 (parcial) del informe docs/investigacion/
 * aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis de aula (tabla «Números racionales (19 nov)» del
 * informe); ver el bloque de cada idea.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver una fracción como porciones de un queque y su decimal como la división que termina o se repite.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, sin audio, con lápiz al lado.
 *   Resultado observable: reconoce y arma equivalentes y la irreductible, compara y clasifica fracciones, suma partes
 *     de un mismo total y toma una parte de lo que queda, decide si un decimal termina (también en otra base), halla la
 *     generatriz y distingue un irracional.
 *   Orden de atención: 1.º el objeto (el queque, la calculadora) · 2.º la lectura · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · misión lograda · predicción · coincide / no coincide · paso a paso ·
 *     caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué 1/2 + 1/3 no es 2/5, y por qué 0,272727… sí es una fracción?».
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = fabrica(nodo ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = x => String(x).split('').map(c => SUPD[+c]).join('');
  const mcd = (x, y) => (y ? mcd(y, x % y) : Math.abs(x));
  const mcm = (x, y) => x / mcd(x, y) * y;
  const red = (x, y) => { const g = mcd(x, y); return [x / g, y / g]; };
  const factores = x => { const out = []; for (let k = 2; x > 1; k++) { let e = 0; while (x % k === 0) { x /= k; e++; } if (e) out.push([k, e]); } return out; };
  // «2³ × 5»: la descomposición canónica en texto, con los exponentes como superíndice.
  const canon = x => (x === 1 ? '1' : factores(x).map(([p, e]) => (e > 1 ? `${p}${sup(e)}` : String(p))).join(' × '));
  const yLista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : String(xs[0]));
  const plural = (k, uno, varios) => `${k} ${k === 1 ? uno : varios}`;
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
      if (!x || x.valor === null || x.valor === undefined || (typeof x.valor === 'number' && (!Number.isFinite(x.valor) || x.valor < 0))) continue;
      const txt = fmt(x.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  function conCuatro(caso, r) {
    for (let i = 0; i < 4000; i++) { const c = caso(r); if (c && c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba la prueba de la unidad) ----------
  const COLORES = { parte: 'o', partes: 'i', pedido: 'f', resto: 'h' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: typeof t === 'number' ? f(t, 0) : String(t), m: mg });
  const pa = ficha('parte'), ps = ficha('partes'), pe = ficha('pedido'), re = ficha('resto');
  // Una fracción con su numerador naranja y su denominador turquesa; la que se pide, entera en violeta.
  const fr = (a, b) => ({ frac: [pa(a), ps(b)] });
  const frP = (a, b) => ({ frac: [pe(a), pe(b)] });
  const txt = (a, b) => (b === 1 ? String(a) : `${a}/${b}`);
  // La letra de una alternativa, en negrita y en tinta: sin color, para que una trampa no parezca la respuesta.
  const letra = L => ({ negrita: [L] });
  // Entre dos relaciones de una misma ecuación (en la regla, cada una en su línea).
  const SEP = '   ·   ';

  // ---------- El queque de la promoción (pieza arit-queque, dibujo de prueba) ----------
  const QU = 'arit-queque';
  // Una bandeja: un queque (o varios, si la fracción pasa de 1) cortado en b porciones con a vendidas; con k, cada
  // porción en k pedazos. El rótulo dice la fracción con sus colores.
  const rotFr = (pre, a, b, post = '') => [[pre], [String(a), 'o', 700], ['/'], [String(b), 'i', 700], ...(post ? [[post]] : [])];
  const bandeja = (a, b, o = {}) => Object.assign({
    partes: b, filas: o.k || 1, queques: o.queques || Math.max(1, Math.ceil(a / b)),
    marcas: a > 0 ? [{ c0: 0, c1: a, color: 'o' }] : [],
    rotulo: o.rotulo === undefined ? rotFr('Vendido: ', a * (o.k || 1), b * (o.k || 1)) : o.rotulo,
  }, o.nota ? { nota: o.nota } : {});
  const queques = (bs, o = {}) => ({ pieza: QU, datos: Object.assign({ bandejas: bs }, o), estado: {} });
  // Una bandeja cortada en b porciones, con su rótulo a/b pero sin pintar lo vendido: para Predice y los ejemplos que
  // comparan dos fracciones, donde lo pintado a escala dejaría ver cuál es más (auditoría del cierre, 20 nov).
  const sinVender = (a, b, pre, o = {}) => bandeja(0, b, Object.assign({ rotulo: rotFr(pre, a, b), queques: Math.max(1, Math.ceil(a / b)) }, o));

  // ---------- Idea 1 (rehecha, 19 nov): fracciones equivalentes ----------
  // Propuesta: docs/etapa8/propuesta-aritmetica.md §1 a §7. Conserva el id `equivalentes` (y la mesa `dos-tiras`), con
  // otra Predice. Objeto: el queque de la promoción en su bandeja (pieza arit-queque, dibujo de prueba), cortado en
  // porciones; cada porción se vuelve a cortar en pedazos. Cambia: la fracción vendida y en cuántos pedazos se corta cada
  // porción. · Permanece: el queque y lo vendido. · Progresa: a/b → (a × k)/(b × k), con más cortes y la misma parte. · Se
  // reserva: multiplicar por 5 (la predicción, con 3/5; el juego llega a 4). · Debe verse: lo vendido no cambia de
  // tamaño aunque cambien los dos números.
  // Errores (hipótesis de aula): AT-SUMA-AMBOS suma lo mismo arriba y abajo · AT-SOLO-ABAJO multiplica solo el
  // denominador · AT-SOLO-ARRIBA multiplica solo el numerador · AT-FACTOR responde el número por el que se multiplica ·
  // AT-INVERTIR da la fracción al revés · AT-NO-MCD divide entre un divisor común que no es el MCD · AT-RESPONDE-OTRA
  // responde el otro término · AT-RESTA-TERMINO le quita un término a la suma · AT-SIN-K arma la fracción sin el factor
  // · AT-CONTEO-SIN-QUITAR cuenta desde 1 en un tramo (de Divisibilidad) · AT-SIN-MAS-UNO resta los extremos y no suma 1.
  const D1 = {
    eq: 'Multiplicar o dividir el numerador y el denominador por el mismo número no cambia la fracción',
    cruz: 'a/b = c/d cuando a × d = b × c (los productos en cruz son iguales)',
    irr: 'Una fracción es irreductible si su numerador y su denominador no tienen un divisor común mayor que 1',
    mcd: 'Dividiendo el numerador y el denominador entre su MCD queda la fracción irreductible',
    k: 'Las fracciones equivalentes a a/b, irreductible, son (a × k)/(b × k), con k = 1, 2, 3…',
    cifras3: 'Los números de tres cifras van del 100 al 999',
    cifras2: 'Los números de dos cifras van del 10 al 99',
    cuantos: 'Del primero, p, al último, u, hay u − p + 1 números',
  };
  const FR1 = ['1/2', '1/3', '2/3', '1/4', '3/4', '2/5', '4/5', '5/6'];   // sin 3/5: es la predicción (nota de la sesión, 19 nov)
  const deTxt = s => s.split('/').map(Number);
  // El queque del juego: la fracción vendida y cada porción cortada en k pedazos.
  const queque1 = (a, b, k) => queques([bandeja(a, b, { k })]);
  // Fracciones irreductibles propias (numerador de 1 a 8, denominador de 2 a 9) para «Ahora tú».
  const PROPIAS = []; for (let b = 2; b <= 9; b++) for (let a = 1; a < b; a++) if (mcd(a, b) === 1) PROPIAS.push([a, b]);
  // Lo que ya usan el juego (la misión, 2/3 × 3), la predicción (3/5 × 5) y los ejemplos: «Ahora tú» y «Así se
  // resuelve» no lo repiten (auditoría de MCD y MCM, M2).
  const USADOS1 = new Set(['2/3/3', '3/5/5', '2/3/4', '3/4/4', '5/6/5', '7/9/5', '4/9/7', '5/8/9', '4/7/14', '2/3/42', '3/4/3', '3/4/2', '1/2/6']);

  // Ahora tú · tipo 0: el término que falta (arriba o abajo).
  function casoFalta(r) {
    const [a, b] = r.de(PROPIAS), k = r.ent(2, 9);
    if (USADOS1.has(`${a}/${b}/${k}`)) return null;
    if (r() < 0.5) return {
      pregunta: `¿Qué número va en el recuadro? ${a}/${b} = □/${b * k}`,
      datos: [D1.eq, D1.cruz],
      opciones: opciones(a * k, [
        { id: 'suma', valor: a + b * k - b, error: 'AT-SUMA-AMBOS', siFuera: `Ver que el denominador creció está bien. Pero creció ${k} veces, no ${b * k - b} más: arriba también se multiplica.` },
        { id: 'abajo', valor: a, error: 'AT-SOLO-ABAJO', siFuera: `Dejar el ${a} cambia la parte: si abajo se multiplicó por ${k}, arriba también.` },
        { id: 'factor', valor: k, error: 'AT-FACTOR', siFuera: `Hallar que se multiplica por ${k} está bien. Pero arriba va ${a} × ${k}.` },
      ]),
      solucion: { texto: `De ${b} a ${b * k} se multiplicó por ${k}; arriba también.`, ecuacion: [fr(a, b), ' = ', { frac: [[pa(a), ` × ${k}`], [ps(b), ` × ${k}`]] }, ' = ', { frac: [pe(a * k), ps(b * k)] }] },
    };
    return {
      pregunta: `¿Qué número va en el recuadro? ${a}/${b} = ${a * k}/□`,
      datos: [D1.eq, D1.cruz],
      opciones: opciones(b * k, [
        { id: 'suma', valor: b + a * k - a, error: 'AT-SUMA-AMBOS', siFuera: `Ver que el numerador creció está bien. Pero creció ${k} veces, no ${a * k - a} más: abajo también se multiplica.` },
        { id: 'arriba', valor: b, error: 'AT-SOLO-ARRIBA', siFuera: `Dejar el ${b} cambia la parte: si arriba se multiplicó por ${k}, abajo también.` },
        { id: 'factor', valor: k, error: 'AT-FACTOR', siFuera: `Hallar que se multiplica por ${k} está bien. Pero abajo va ${b} × ${k}.` },
      ]),
      solucion: { texto: `De ${a} a ${a * k} se multiplicó por ${k}; abajo también.`, ecuacion: [fr(a, b), ' = ', { frac: [[pa(a), ` × ${k}`], [ps(b), ` × ${k}`]] }, ' = ', { frac: [pa(a * k), pe(b * k)] }] },
    };
  }
  // Ahora tú · tipo 1: cuál de cuatro fracciones es la misma parte.
  function casoCual(r) {
    const [a, b] = r.de(PROPIAS), k = r.ent(2, 6), m = r.ent(1, 5);
    if (USADOS1.has(`${a}/${b}/${k}`)) return null;
    const malos = [
      { id: 'suma', valor: txt(a + m, b + m), error: 'AT-SUMA-AMBOS', siFuera: `Cambiar los dos números está bien, pero sumando ${m} cambia la parte: hay que multiplicar.` },
      { id: 'abajo', valor: txt(a, b * k), error: 'AT-SOLO-ABAJO', siFuera: `Multiplicar por ${k} está bien, pero solo abajo: cada pedazo es ${k} veces más chico.` },
      { id: 'arriba', valor: txt(a * k, b), error: 'AT-SOLO-ARRIBA', siFuera: `Multiplicar por ${k} está bien, pero solo arriba: así hay ${k} veces más queque.` },
      { id: 'invertir', valor: txt(b * k, a * k), error: 'AT-INVERTIR', siFuera: `Multiplicar los dos por ${k} está bien, pero quedó al revés: el ${b * k} va abajo.` },
    ];
    for (let i = malos.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [malos[i], malos[j]] = [malos[j], malos[i]]; }
    return {
      pregunta: ['¿Cuál de estas fracciones es la misma parte que ', fr(a, b), '?'],
      datos: [D1.eq, D1.cruz],
      opciones: opciones(txt(a * k, b * k), malos),
      solucion: { texto: `En cruz dan lo mismo: es ${a}/${b} con arriba y abajo por ${k}.`, ecuacion: [`${a} × ${b * k} = ${a * b * k} = ${b} × ${a * k}`] },
    };
  }
  // Ahora tú · tipo 2: la fracción irreductible (dividir entre el MCD, no entre un divisor común más chico).
  function casoIrr(r) {
    const [a, b] = r.de(PROPIAS), g = r.de([4, 6, 8, 9, 10, 12, 14, 15, 18]), N = a * g, D = b * g;
    if (D > 160 || USADOS1.has(`${a}/${b}/${g}`)) return null;
    const s = factores(g)[0][0];
    return {
      pregunta: `¿Cuál es la fracción irreductible equivalente a ${N}/${D}?`,
      datos: [D1.irr, D1.mcd],
      opciones: opciones(txt(a, b), [
        { id: 'parcial', valor: txt(N / s, D / s), error: 'AT-NO-MCD', siFuera: `Dividir entre ${s} está bien, pero todavía se puede: ${N / s} y ${D / s} comparten divisores.` },
        { id: 'invertir', valor: txt(b, a), error: 'AT-INVERTIR', siFuera: `Simplificar entre ${g} está bien, pero quedó al revés: el ${a} va arriba.` },
        { id: 'arriba', valor: txt(a, D), error: 'AT-SOLO-ARRIBA', siFuera: `Dividir el ${N} entre ${g} está bien. Pero abajo también: si no, cambia la parte.` },
      ]),
      solucion: { texto: `MCD(${N}, ${D}) = ${g}: arriba y abajo entre ${g}.`, ecuacion: [{ frac: [pa(N), ps(D)] }, ' = ', { frac: [[pa(N), ` ÷ ${g}`], [ps(D), ` ÷ ${g}`]] }, ' = ', frP(a, b)] },
    };
  }
  // Ahora tú · tipo 3 (San Marcos 2024-II): la equivalente con una suma de términos dada; se pide el denominador.
  function casoSumaT(r) {
    const [a, b] = r.de(PROPIAS), k = r.ent(3, 12), S = (a + b) * k;
    if (S > 200 || USADOS1.has(`${a}/${b}/${k}`)) return null;
    return {
      pregunta: `Una fracción equivalente a ${a}/${b} tiene numerador y denominador que suman ${S}. ¿Cuál es su denominador?`,
      datos: [D1.k],
      opciones: opciones(b * k, [
        { id: 'numerador', valor: a * k, error: 'AT-RESPONDE-OTRA', siFuera: `Hallar ${a * k}/${b * k} está bien. Pero ${a * k} es el numerador; se pide el denominador.` },
        { id: 'factor', valor: k, error: 'AT-FACTOR', siFuera: `Hallar que se multiplica por ${k} está bien. Pero el denominador es ${b} × ${k}.` },
        { id: 'resta', valor: S - b, error: 'AT-RESTA-TERMINO', siFuera: `Quitarle ${b} a ${S} no reparte la suma: el numerador también creció.` },
      ]),
      solucion: { texto: `Arriba y abajo van por k: los dos suman (${a} + ${b}) × k.`, ecuacion: [`(${a} + ${b}) × k = ${S}`, SEP, `k = ${S} ÷ ${a + b} = ${k}`, SEP, `${b} × ${k} = `, pe(b * k)] },
    };
  }
  // Ahora tú · tipo 4 (nivel examen): la equivalente cuyo denominador le gana al numerador en una cantidad dada.
  function casoDifT(r) {
    const [a, b] = r.de(PROPIAS), k = r.ent(3, 12), Df = (b - a) * k;
    if (Df < 6 || b * k > 150 || USADOS1.has(`${a}/${b}/${k}`)) return null;
    return {
      pregunta: `Una fracción equivalente a ${a}/${b} tiene un denominador que excede a su numerador en ${Df}. ¿Cuál es la fracción?`,
      datos: [D1.k],
      opciones: opciones(txt(a * k, b * k), [
        { id: 'suma', valor: txt(a + Df, b + Df), error: 'AT-SUMA-AMBOS', siFuera: `Sumar ${Df} arriba y abajo mantiene la diferencia, pero cambia la parte: no es equivalente.` },
        { id: 'factor', valor: txt(a * Df, b * Df), error: 'AT-FACTOR', siFuera: `Multiplicar arriba y abajo está bien, pero por ${k}: con ${Df} la diferencia sale ${(b - a) * Df}.` },
        { id: 'sink', valor: txt(a, a + Df), error: 'AT-SIN-K', siFuera: `La diferencia es ${Df}, bien. Pero ${a}/${a + Df} no es la misma parte que ${a}/${b}.` },
      ]),
      solucion: { texto: `Abajo menos arriba es (${b} − ${a}) × k.`, ecuacion: [`(${b} − ${a}) × k = ${Df}`, SEP, `k = ${k}`, SEP, frP(a * k, b * k)] },
    };
  }
  // Ahora tú · tipo 5 (San Marcos 2022): cuántas equivalentes tienen el denominador de tres cifras.
  function casoTresC(r) {
    const [a, b] = r.de(PROPIAS.filter(([x, y]) => y >= 3));
    if ((a === 3 && b === 7) || (a === 2 && b === 5)) return null;
    const lo = Math.ceil(100 / b), hi = Math.floor(999 / b), C = hi - lo + 1;
    const loA = Math.ceil(100 / a), hiA = Math.floor(999 / a);
    return {
      pregunta: `¿Cuántas fracciones equivalentes a ${a}/${b} tienen denominador de tres cifras?`,
      datos: [D1.k, D1.cifras3, D1.cuantos],
      opciones: opciones(C, [
        { id: 'desde1', valor: hi, error: 'AT-CONTEO-SIN-QUITAR', siFuera: `Bien el último k, ${hi}. Pero con k menor que ${lo} el denominador tiene menos de tres cifras.` },
        { id: 'masuno', valor: C - 1, error: 'AT-SIN-MAS-UNO', siFuera: `Bien de k = ${lo} a k = ${hi}. Son ${hi} − ${lo} + 1: los dos extremos cuentan.` },
        { id: 'numerador', valor: hiA - loA + 1, error: 'AT-RESPONDE-OTRA', siFuera: `Contar está bien, pero así cuentas los de numerador de tres cifras.` },
      ]),
      solucion: { texto: `El denominador es ${b} × k: k va de ${lo} a ${hi}.`, ecuacion: [`${b} × ${lo} = ${b * lo}`, SEP, `${b} × ${hi} = ${b * hi}`, SEP, `${hi} − ${lo} + 1 = ${C}`] },
    };
  }

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h): 5 de nivel 1, 5 de nivel 2 y 5 de nivel 3, estos con
  // cinco alternativas (A a E). Cuentas rehechas aparte, sin este archivo (scratchpad de la sesión, e8-aritmetica/
  // cuentas.py, con Fraction de Python y fuerza bruta): 2/3 = 8/12; 4 × 9 = 36 = 6 × 6; 12/16 = 3/4 (MCD 4); 5/6 = 25/30;
  // 2 × 6 = 12 y 5 × 3 = 15; MCD(84, 126) = 42 y 84/126 = 2/3; 14/18 = 7/9 = 35/45; 10/14 = 5/7 (las otras, 3/4); 6/8 =
  // 9/12 = 3/4; 6/x = 9/15 → x = 10; 4/9 con suma 91: k = 7, 28/63; 5/8 con diferencia 27: k = 9, 45/72 (32/35, 135/216,
  // 5/32 y 40/64 no cuadran); 3/7 con denominador de tres cifras: k de 15 a 142, 128 (desde 1: 142; sin + 1: 127;
  // numerador de tres cifras: 300; con 100 ÷ 7 truncado: 129); 56/98 = 4/7 (MCD 14), 4 + 7 = 11 (sin simplificar 154;
  // entre 2, 28/49 y 77); 2/5 con numerador de dos cifras: k de 5 a 49, 45 (49, 44, 18 con denominador de dos cifras y 90).
  // Ningún ejemplo usa la predicción (3/5 por 5) ni la misión (2/3 por 3). Las figuras muestran el queque sin la respuesta.
  const EJEMPLOS_EQ = [
    { nivel: 1, titulo: 'El número que falta',
      enunciado: '¿Qué número va en el recuadro? 2/3 = □/12',
      datos: [D1.eq],
      figura: queques([bandeja(2, 3, { rotulo: rotFr('Vendido: ', 2, 3) })]),
      solucion: [{ texto: 'De 3 a 12 el denominador se multiplicó por 4: cada porción se cortó en 4 pedazos. Arriba también va por 4.', ecuacion: [fr(2, 3), ' = ', { frac: [[pa(2), ' × 4'], [ps(3), ' × 4']] }, ' = ', { frac: [pe(8), ps(12)] }] }],
      respuesta: ['En el recuadro va ', pe(8)] },
    { nivel: 1, titulo: '¿Son la misma parte?',
      enunciado: ['¿Son equivalentes ', fr(4, 6), ' y ', fr(6, 9), '?'],
      datos: [D1.cruz],
      solucion: [{ texto: 'Multiplico en cruz: los dos productos salen iguales.', ecuacion: ['4 × 9 = 36', SEP, '6 × 6 = 36'] }],
      respuesta: ['Sí, son equivalentes'] },
    { nivel: 1, titulo: 'Simplificar 12/16',
      enunciado: '¿Cuál es la fracción irreductible equivalente a 12/16?',
      datos: [D1.irr, D1.mcd],
      solucion: [{ texto: 'El MCD de 12 y 16 es 4. Divido arriba y abajo entre 4; 3 y 4 ya no comparten divisores.', ecuacion: [{ frac: [pa(12), ps(16)] }, ' = ', { frac: [[pa(12), ' ÷ 4'], [ps(16), ' ÷ 4']] }, ' = ', frP(3, 4)] }],
      respuesta: [frP(3, 4)] },
    { nivel: 1, titulo: 'Llegar a treintavos',
      enunciado: '¿Qué fracción con denominador 30 es equivalente a 5/6?',
      datos: [D1.eq],
      solucion: [{ texto: 'De 6 a 30 se multiplica por 5; el numerador también.', ecuacion: [fr(5, 6), ' = ', { frac: [[pa(5), ' × 5'], [ps(6), ' × 5']] }, ' = ', frP(25, 30)] }],
      respuesta: [frP(25, 30)] },
    { nivel: 1, titulo: 'Sumar 1 arriba y abajo',
      enunciado: ['Si a ', fr(2, 5), ' se le suma 1 arriba y abajo, queda ', fr(3, 6), '. ¿Es la misma parte?'],
      datos: [D1.cruz],
      solucion: [{ texto: 'En cruz no dan lo mismo: no son equivalentes. Sumar lo mismo arriba y abajo cambia la parte.', ecuacion: ['2 × 6 = 12', SEP, '5 × 3 = 15'] }],
      respuesta: ['No: ', fr(3, 6), ' es más'] },
    { nivel: 2, titulo: 'Simplificar con primos',
      enunciado: '¿Cuál es la fracción irreductible equivalente a 84/126?',
      datos: [D1.mcd, 'Con primos: el MCD lleva los primos comunes, cada uno con su menor exponente'],
      solucion: [
        { texto: 'Descompongo en primos y saco el MCD.', ecuacion: ['84 = 2² × 3 × 7', SEP, '126 = 2 × 3² × 7', SEP, 'MCD = 2 × 3 × 7 = 42'] },
        { texto: 'Divido arriba y abajo entre 42.', ecuacion: [{ frac: [pa(84), ps(126)] }, ' = ', { frac: [[pa(84), ' ÷ 42'], [ps(126), ' ÷ 42']] }, ' = ', frP(2, 3)] },
      ],
      respuesta: [frP(2, 3)] },
    { nivel: 2, titulo: 'Simplificar y después ampliar',
      enunciado: '¿Qué fracción con denominador 45 es equivalente a 14/18?',
      datos: [D1.mcd, D1.eq],
      solucion: [
        { texto: '18 no llega a 45 multiplicando por un entero; primero simplifico entre el MCD, 2.', ecuacion: [{ frac: [pa(14), ps(18)] }, ' = ', fr(7, 9)] },
        { texto: 'De 9 a 45 se multiplica por 5.', ecuacion: [fr(7, 9), ' = ', { frac: [[pa(7), ' × 5'], [ps(9), ' × 5']] }, ' = ', frP(35, 45)] },
      ],
      respuesta: [frP(35, 45)] },
    { nivel: 2, titulo: 'La que no es equivalente',
      enunciado: '¿Cuál de estas fracciones no es la misma parte que las otras: 6/8, 9/12, 15/20 y 10/14?',
      datos: [D1.mcd],
      solucion: [
        { texto: 'Simplifico cada una entre su MCD.', ecuacion: ['6/8 = 3/4', SEP, '9/12 = 3/4', SEP, '15/20 = 3/4'] },
        { texto: '10/14 entre 2 queda 5/7, que no es 3/4.', ecuacion: [{ frac: [pa(10), ps(14)] }, ' = ', fr(5, 7)] },
      ],
      respuesta: ['La de ', frP(10, 14)] },
    { nivel: 2, titulo: 'Dos queques iguales',
      enunciado: 'Rosa comió 6/8 de un queque y Luis, 9/12 de otro igual. ¿Comieron lo mismo? ¿Qué fracción irreductible comió cada uno?',
      datos: [D1.cruz, D1.mcd],
      figura: queques([sinVender(6, 8, 'Rosa: '), sinVender(9, 12, 'Luis: ')]),
      solucion: [
        { texto: 'En cruz: 6 × 12 = 72 y 8 × 9 = 72. Son la misma parte.' },
        { texto: '6/8 entre 2 y 9/12 entre 3 dan la misma irreductible.', ecuacion: [{ frac: [pa(6), ps(8)] }, ' = ', frP(3, 4), ' = ', { frac: [pa(9), ps(12)] }] },
      ],
      respuesta: ['Sí: cada uno comió ', frP(3, 4)] },
    { nivel: 2, titulo: 'Despejar en cruz',
      enunciado: '¿Qué valor de x hace que 6/x = 9/15?',
      datos: [D1.cruz],
      solucion: [
        { texto: 'En cruz: 6 × 15 = 9 × x, o sea, 90 = 9 × x.' },
        { texto: 'x = 90 ÷ 9.', ecuacion: ['90 ÷ 9 = 10'] },
      ],
      respuesta: ['x = ', pe(10)] },
    { nivel: 3, titulo: 'La suma de los términos',
      enunciado: 'Una fracción equivalente a 4/9 tiene numerador y denominador que suman 91. ¿Cuál es su denominador?',
      alternativas: ['63', '28', '82', '7', '9'],
      datos: [D1.k],
      solucion: [
        { texto: 'La fracción es (4 × k)/(9 × k); sus términos suman 13 × k.', ecuacion: ['13 × k = 91', SEP, 'k = 7', SEP, '9 × 7 = ', pe(63)] },
        { texto: ['Las trampas: ', letra('B'), ' es el numerador, 28; ', letra('C'), ' le quita 9 a 91; ', letra('D'), ' es k; ', letra('E'), ' es el denominador de 4/9.'] },
      ],
      respuesta: [letra('A'), ': ', pe(63)] },
    { nivel: 3, titulo: 'La diferencia de los términos',
      enunciado: 'Una fracción equivalente a 5/8 tiene un denominador que excede a su numerador en 27. ¿Cuál es la fracción?',
      alternativas: ['32/35', '45/72', '135/216', '5/32', '40/64'],
      datos: [D1.k],
      solucion: [
        { texto: 'Abajo menos arriba es (8 − 5) × k = 3 × k.', ecuacion: ['3 × k = 27', SEP, 'k = 9', SEP, { frac: [[pa(5), ' × 9'], [ps(8), ' × 9']] }, ' = ', frP(45, 72)] },
        { texto: ['Las trampas: ', letra('A'), ' suma 27 arriba y abajo; ', letra('C'), ' multiplica por 27; ', letra('D'), ' es 5/(5 + 27); ', letra('E'), ' multiplica por 8 y la diferencia es 24.'] },
      ],
      respuesta: [letra('B'), ': ', frP(45, 72)] },
    { nivel: 3, titulo: 'Denominador de tres cifras',
      enunciado: '¿Cuántas fracciones equivalentes a 3/7 tienen denominador de tres cifras?',
      alternativas: ['142', '127', '128', '300', '129'],
      datos: [D1.k, D1.cifras3, D1.cuantos],
      solucion: [
        { texto: 'El denominador es 7 × k. El menor de tres cifras es 7 × 15 = 105, y el mayor, 7 × 142 = 994.' },
        { texto: 'k va de 15 a 142.', ecuacion: ['142 − 15 + 1 = 128'] },
        { texto: ['Las trampas: ', letra('A'), ' cuenta desde k = 1; ', letra('B'), ' olvida el + 1; ', letra('D'), ' cuenta los de numerador de tres cifras; ', letra('E'), ' empieza en k = 14, que da 98.'] },
      ],
      respuesta: [letra('C'), ': 128'] },
    { nivel: 3, titulo: 'Irreductible y su suma',
      enunciado: 'La fracción irreductible a/b es equivalente a 56/98. ¿Cuánto vale a + b?',
      alternativas: ['154', '77', '4', '11', '7'],
      datos: [D1.irr, D1.mcd],
      solucion: [
        { texto: 'MCD(56, 98) = 14. Dividiendo entre 14 queda 4/7, que ya no se simplifica.', ecuacion: [{ frac: [pa(56), ps(98)] }, ' = ', frP(4, 7), SEP, '4 + 7 = 11'] },
        { texto: ['Las trampas: ', letra('A'), ' suma 56 + 98 sin simplificar; ', letra('B'), ' divide solo entre 2: 28/49; ', letra('C'), ' es a; ', letra('E'), ' es b.'] },
      ],
      respuesta: [letra('D'), ': 11'] },
    { nivel: 3, titulo: 'Numerador de dos cifras',
      enunciado: '¿Cuántas fracciones equivalentes a 2/5 tienen numerador de dos cifras?',
      alternativas: ['49', '44', '18', '90', '45'],
      datos: [D1.k, D1.cifras2, D1.cuantos],
      solucion: [
        { texto: 'El numerador es 2 × k: va de 2 × 5 = 10 a 2 × 49 = 98.' },
        { texto: 'k va de 5 a 49.', ecuacion: ['49 − 5 + 1 = 45'] },
        { texto: ['Las trampas: ', letra('A'), ' cuenta desde k = 1; ', letra('B'), ' olvida el + 1; ', letra('C'), ' cuenta los de denominador de dos cifras; ', letra('D'), ' cuenta todos los números de dos cifras.'] },
      ],
      respuesta: [letra('E'), ': 45'] },
  ];

  const equivalentes = {
    id: 'equivalentes',
    titulo: 'Fracciones equivalentes',
    pregunta: '¿Cuándo dos fracciones son la misma parte del queque?',
    temas: ['Racionales como clases de equivalencia'],
    pieza: QU,
    aprendizaje: 'Multiplicar o dividir arriba y abajo por el mismo número no cambia la parte: 3/4 = 6/8. La irreductible sale dividiendo entre el MCD.',
    actividad: 'Cortar cada porción del queque en pedazos más chicos y ver si cambia lo vendido.',
    // Lee: el queque, el numerador y el denominador con un caso que no es la predicción (3/4) y qué mirar. No dice qué
    // cambio conserva la parte (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'El queque de la promoción', texto: 'Para su fiesta, la promoción hornea queques en bandejas iguales. Uno se corta en 4 porciones iguales y se venden 3: se vendió 3/4 del queque.',
          pieza: QU, dibujo: { datos: { bandejas: [bandeja(3, 4)] }, estado: {} } },
        { titulo: 'Arriba y abajo', texto: ['El número de abajo es el ', ps('denominador'), ': en cuántas porciones iguales se cortó el queque. El de arriba es el ', pa('numerador'), ': cuántas porciones se toman.'],
          ecuacion: [{ frac: [pa('numerador'), ps('denominador')] }] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cortar cada porción en pedazos más chicos. Mira si cambia cuánto queque se vendió y qué pasa con los dos números.' },
      ],
    },
    ejemplos: EJEMPLOS_EQ,
    juega: {
      pieza: QU,
      consigna: 'La promoción vende porciones de su queque. Después corta cada porción en pedazos más chicos, para venderlos sueltos.',
      mision: {
        // Una sola manera en la grilla: 6/9 solo sale de 2/3 con cada porción en 3 (la prueba lo recorre).
        texto: 'Haz que lo vendido quede escrito como 6/9 del queque.',
        logrado: v => v.f === '2/3' && v.k === 3,
        bien: '2/3 con cada porción en 3 pedazos: 6 de 9, la misma parte.',
      },
      voz: 'Mira el tamaño de lo vendido, no solo los números.',
      leyenda: [
        { s: pa('vendido'), t: 'porciones vendidas: el numerador' },
        { s: ps('porciones'), t: 'en cuántas se cortó: el denominador' },
      ],
      controles: [
        { id: 'f', etiqueta: 'Se vendió', opciones: FR1.map(x => ({ valor: x, texto: x })) },
        { id: 'k', etiqueta: 'Cortar cada porción en', min: 1, max: 4, paso: 1, inicio: 1, unidad: '', decimales: 0 },
      ],
      dibujo: v => { const [a, b] = deTxt(v.f); return { datos: { bandejas: [bandeja(a, b, { k: v.k })] }, estado: {} }; },
      lectura: v => {
        const [a, b] = deTxt(v.f);
        if (v.k === 1) return [fr(a, b), `: ${a} de ${b} porciones vendidas`];
        return [fr(a, b), ' = ', fr(a * v.k, b * v.k), ': lo vendido no cambió'];
      },
      minimo: 3,
    },
    predice: {
      pieza: QU,
      pregunta: 'Un queque se cortó en 5 porciones y se vendieron 3: 3/5 del queque. ¿Cuál de estas fracciones es la misma parte del queque?',
      datos: ['Todas las porciones de un queque son iguales'],
      voz: 'Piensa qué pasa si cada porción se corta en pedazos.',
      opciones: [
        { id: 'c', texto: '15/25', correcta: true },
        { id: 'suma', texto: '5/7', error: 'AT-SUMA-AMBOS', siFuera: 'Cambiar los dos números está bien, pero sumando 2 sale 5/7, que es más queque.' },
        { id: 'abajo', texto: '3/25', error: 'AT-SOLO-ABAJO', siFuera: 'Multiplicar por 5 está bien, pero solo abajo: cada pedazo es 5 veces más chico.' },
        { id: 'arriba', texto: '15/5', error: 'AT-SOLO-ARRIBA', siFuera: 'Multiplicar por 5 está bien, pero solo arriba: 15/5 son 3 queques enteros.' },
      ],
      dibujo: { datos: { bandejas: [bandeja(3, 5, { rotulo: rotFr('Vendido: ', 3, 5) })] }, estado: {} },
      revelar: { datos: { bandejas: [bandeja(3, 5, { k: 5 })] }, estado: {} },
      coincide: 'Coincide: con cada porción en 5 pedazos, se vendieron 15 de 25. La misma parte.',
      noCoincide: 'Revisemos qué pasa al cortar cada porción en 5 pedazos.',
    },
    mira: {
      pieza: QU,
      datos: { filas: 2, bandejas: [bandeja(3, 5)], pasos: [
        { bandejas: [bandeja(3, 5)] },
        { bandejas: [bandeja(3, 5, { k: 5 })] },
        { bandejas: [bandeja(3, 5), bandeja(5, 7)] },
        { bandejas: [bandeja(3, 5, { k: 5 })] },
        { bandejas: [bandeja(3, 5, { k: 5 }), bandeja(3, 5)] },
      ] },
      voz: 'Mira qué pasa con lo vendido cuando cada porción se corta en pedazos.',
      pasos: [
        { estado: { paso: 0 }, texto: '3 de 5 porciones vendidas.', ecuacion: [fr(3, 5)] },
        { estado: { paso: 1 }, texto: 'Cada porción en 5 pedazos: 15 de 25. Lo vendido no cambió.', ecuacion: [fr(3, 5), ' = ', { frac: [[pa(3), ' × 5'], [ps(5), ' × 5']] }, ' = ', fr(15, 25)] },
        { estado: { paso: 2 }, texto: 'Sumando 2 arriba y abajo sale 5/7: se vende más.', ecuacion: ['3 × 7 = 21', SEP, '5 × 5 = 25'] },
        { estado: { paso: 3 }, texto: 'En cruz, las equivalentes dan lo mismo.', ecuacion: ['3 × 25 = 75 = 5 × 15'] },
        { estado: { paso: 4 }, texto: 'Al revés, entre su MCD vuelve a 3/5: el mismo número racional.', ecuacion: [{ frac: [[pa(15), ' ÷ 5'], [ps(25), ' ÷ 5']] }, ' = ', fr(3, 5)] },
      ],
    },
    regla: {
      texto: 'Multiplicar o dividir arriba y abajo por el mismo número no cambia la parte. Son equivalentes si en cruz dan lo mismo; dividiendo entre el MCD sale la irreductible.',
      ecuacion: [{ frac: [pa('a'), ps('b')] }, ' = ', { frac: [[pa('a'), ' × k'], [ps('b'), ' × k']] }, SEP, { llave: [fr(3, 5), ' = ', fr(15, 25)], nota: 'equivalentes' }, SEP, '3 × 25 = 75 = 5 × 15',
        SEP, { llave: [{ frac: [[pa(12), ' ÷ 4'], [ps(16), ' ÷ 4']] }, ' = ', fr(3, 4)], nota: 'MCD(12, 16) = 4: la irreductible' }],
      condicion: 'b y k no son 0. Sumar lo mismo arriba y abajo sí cambia la parte: 3/5 no es 5/7.',
      voz: 'Multiplica o divide arriba y abajo por el mismo número.',
      dibujo: { pieza: QU, datos: { bandejas: [bandeja(3, 5, { k: 5 })] }, estado: {} },
    },
    // Así se resuelve: la equivalente con un producto de términos dado. «Ahora tú» pide el término que falta, cuál es
    // equivalente, la irreductible, la suma y la diferencia de términos y cuántas tienen denominador de tres cifras.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const [a, b] = r.de(PROPIAS), k = r.ent(2, 9), P = a * b * k * k;
          if (P > 2000 || P < 40 || USADOS1.has(`${a}/${b}/${k}`)) continue;
          return {
            enunciado: `Una fracción equivalente a ${a}/${b} tiene numerador y denominador cuyo producto es ${P}. ¿Cuál es la fracción?`,
            datos: [D1.k],
            pasos: [
              { tipo: 'pide', texto: `Piden la fracción equivalente a ${a}/${b} cuyos dos términos, multiplicados, dan ${P}.` },
              { tipo: 'regla', texto: `Las equivalentes a ${a}/${b} son ${a} × k sobre ${b} × k. Su producto es ${a} × ${b} × k × k.` },
              { tipo: 'cuentas', texto: `Igualo el producto a ${P} y despejo k × k.`, ecuacion: [`${a * b} × k × k = ${P}`, SEP, `k × k = ${P} ÷ ${a * b} = ${k * k}`, SEP, `k = ${k}`] },
              { tipo: 'aplica', texto: `Multiplico arriba y abajo por ${k}.`, ecuacion: [{ frac: [[pa(a), ` × ${k}`], [ps(b), ` × ${k}`]] }, ' = ', frP(a * k, b * k)] },
              { tipo: 'sentido', texto: `Compruebo: ${a * k} × ${b * k} = ${P}, y en cruz ${a} × ${b * k} = ${b} × ${a * k}.` },
            ],
            respuesta: ['La fracción es ', frP(a * k, b * k)],
          };
        }
      },
    },
    ahoraTu: {
      voz: '¿Por cuánto se multiplicó arriba y abajo?',
      generar(sem) {
        const r = azar(sem + 17), tipo = sem % 6;
        return conCuatro([casoFalta, casoCual, casoIrr, casoSumaT, casoDifT, casoTresC][tipo], r);
      },
    },
  };


  // ---------- Idea 2 (rehecha, 19 nov): comparar fracciones; propias, impropias, aparentes y mixtas ----------
  // Propuesta §1 a §7. Conserva el id `orden-recta` (y la mesa `dos-puntos`), con otra Predice. Objeto: dos bandejas
  // iguales con su queque, una debajo de otra (arit-queque): lo que se ve más grande es más queque. Cambia: lo vendido
  // arriba y abajo. · Permanece: los dos queques del mismo tamaño. · Progresa: mismo denominador → distinto → más de un
  // queque (impropia). · Se reserva: 5/7 contra 7/9 (la predicción; el juego corta hasta en 8). · Debe verse: con
  // porciones de distinto tamaño no decide el numerador solo.
  // Errores (hipótesis de aula; AR11, «más largo es mayor», es su pariente en decimales): AT-NUMERADOR elige la de
  // numerador mayor · AT-PORCION elige la de porciones más grandes (denominador menor) · AT-DIFERENCIA las cree iguales
  // porque a las dos les falta lo mismo · AT-DISTINTOS cree que con denominadores distintos no se compara · AT-INVERTIR
  // da el orden al revés · AT-APARENTE confunde aparente con impropia · AT-INVIERTE-MIXTO cambia el entero con el resto ·
  // AT-POR-EXCESO usa el cociente por exceso · AT-DENOM-MIXTO divide el resto entre el numerador · AT-ENTRE-TODAS cuenta
  // también las que se simplifican · AT-ENTRE-EXTREMOS cuenta los extremos · AT-UN-PRIMO quita solo los múltiplos de un
  // primo · AT-TOTAL elige la bolsa que cuesta menos en total.
  const D2 = {
    igual: 'Con el mismo denominador, es mayor la de numerador mayor',
    cruz: 'a/b < c/d cuando a × d < b × c, con b y d positivos (en cruz)',
    comun: 'Varias fracciones se pueden escribir con un mismo denominador: el MCM de sus denominadores',
    clases: 'Propia: numerador menor que el denominador. Impropia: mayor. Aparente: el numerador es múltiplo del denominador, y vale un entero',
    mixto: 'Número mixto: a/b = q y r/b, con q el cociente y r el resto de a ÷ b',
    irr: D1.irr,
    precio: 'Precio por kilo: el precio ÷ los kilos',
  };
  // Dos bandejas, arriba a/b y abajo c/d (dos queques a lo ancho: el juego no cambia de escala al pasar de 1).
  const bandejas2 = (a, b, c, d, o = {}) => queques([bandeja(a, b, { rotulo: rotFr(o.r1 || 'Arriba: ', a, b), queques: o.q || Math.max(1, Math.ceil(a / b)) }),
    bandeja(c, d, { rotulo: rotFr(o.r2 || 'Abajo: ', c, d), queques: o.q || Math.max(1, Math.ceil(c / d)) })], { maxQueques: o.max || 2 });
  const signo2 = (a, b, c, d) => (a * d === b * c ? '=' : a * d < b * c ? '<' : '>');
  const fx = ([a, b]) => `${a}/${b}`;
  // Lo que usan el juego (la misión, 3/4 contra 6/7), la predicción (5/7 contra 7/9) y los ejemplos.
  const USADOS2 = new Set(['5/7-7/9', '3/4-6/7', '5/9-7/9', '3/5-3/8', '4/7-5/9', '5/6-7/8', '7/15-9/16', '5/2-7/3']);
  const par2 = (x, y) => [fx(x), fx(y)].sort().join('-');

  // Ahora tú · tipo 0: cuál de dos fracciones es mayor.
  function casoMayor(r) {
    const x = r.de(PROPIAS.filter(([, b]) => b >= 3)), y = r.de(PROPIAS.filter(([, b]) => b >= 3));
    const [a, b] = x, [c, d] = y;
    if (b === d || a === c || a * d === b * c || USADOS2.has(par2(x, y))) return null;
    const mayor = a * d > b * c ? x : y, menor = mayor === x ? y : x;
    // Que el error de mirar solo el numerador (o solo el tamaño de la porción) lleve a la otra.
    const trampa = menor[0] > mayor[0] ? 'num' : menor[1] < mayor[1] ? 'porcion' : null;
    if (!trampa) return null;
    return {
      pregunta: `¿Cuál es mayor: ${a}/${b} o ${c}/${d}?`,
      datos: [D2.igual, D2.cruz],
      opciones: opciones(fx(mayor), [
        trampa === 'num'
          ? { id: 'num', valor: fx(menor), error: 'AT-NUMERADOR', siFuera: `Tiene el numerador mayor, pero sus porciones son más chicas: en cruz pierde.` }
          : { id: 'porcion', valor: fx(menor), error: 'AT-PORCION', siFuera: `Sus porciones son más grandes, pero toma menos: en cruz pierde.` },
        { id: 'iguales', valor: 'Son iguales', error: 'AT-DIFERENCIA', siFuera: `En cruz no dan lo mismo: ${a} × ${d} = ${a * d} y ${b} × ${c} = ${b * c}.` },
        { id: 'nose', valor: 'No se pueden comparar', error: 'AT-DISTINTOS', siFuera: 'Con denominadores distintos sí se comparan: en cruz, o con el MCM abajo.' },
      ]),
      solucion: { texto: `En cruz: gana el lado del producto mayor.`, ecuacion: [`${a} × ${d} = ${a * d}`, SEP, `${b} × ${c} = ${b * c}`] },
    };
  }
  // Ahora tú · tipo 1: ordenar tres fracciones de menor a mayor.
  function casoOrdenar(r) {
    const xs = [r.de(PROPIAS), r.de(PROPIAS), r.de(PROPIAS)];
    const v = x => x[0] / x[1];
    if (new Set(xs.map(v)).size < 3 || new Set(xs.map(x => x[1])).size < 3) return null;
    const ord = xs.slice().sort((p, q) => v(p) - v(q));
    const porNum = xs.slice().sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const porDen = xs.slice().sort((p, q) => q[1] - p[1]);
    const t = l => l.map(fx).join(' < ');
    if (t(porNum) === t(ord) || t(porDen) === t(ord) || t(porNum) === t(porDen) || new Set(xs.map(x => x[0])).size < 3) return null;
    return {
      pregunta: `Ordena de menor a mayor: ${xs.map(fx).join(', ')}.`,
      datos: [D2.comun, D2.cruz],
      opciones: opciones(t(ord), [
        { id: 'num', valor: t(porNum), error: 'AT-NUMERADOR', siFuera: 'Ordenar por el numerador sirve solo con el mismo denominador; aquí las porciones son de distinto tamaño.' },
        { id: 'porcion', valor: t(porDen), error: 'AT-PORCION', siFuera: 'Mirar el tamaño de la porción está bien, pero también cuenta cuántas se toman.' },
        { id: 'reves', valor: t(ord.slice().reverse()), error: 'AT-INVERTIR', siFuera: 'Ese es el orden bien hecho, pero de mayor a menor.' },
      ]),
      solucion: { texto: `Con el MCM, ${xs.map(x => x[1]).reduce(mcm)}, abajo, gana el numerador mayor.`, ecuacion: ord.flatMap((x, i) => { const L = xs.map(z => z[1]).reduce(mcm); return [...(i ? [' < '] : []), fr(x[0] * L / x[1], L)]; }) },
    };
  }
  // Ahora tú · tipo 2: la clase de una fracción (cuál es propia, o cuál es aparente).
  function casoClase(r) {
    const b = r.ent(3, 9), q = r.ent(2, 4), p1 = r.ent(1, b - 1), rr = r.ent(1, b - 1);
    const aparente = [q * b, b], impropia = [q * b + rr, b], propia = [p1, b], otraImp = [b + r.ent(1, b - 1), b];
    if (mcd(...impropia) !== 1 || fx(otraImp) === fx(impropia)) return null;
    // La lista, barajada: antes la correcta caía siempre en el mismo lugar (auditoría, 20 nov).
    const lista = [propia, aparente, impropia, otraImp];
    for (let i = lista.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [lista[i], lista[j]] = [lista[j], lista[i]]; }
    if (r() < 0.5) return {
      pregunta: `¿Cuál de estas fracciones es aparente: ${lista.map(fx).join(', ')}?`,
      datos: [D2.clases],
      opciones: opciones(fx(aparente), [
        { id: 'impropia', valor: fx(impropia), error: 'AT-APARENTE', siFuera: `Es mayor que 1, pero no da un entero: ${impropia[0]} ÷ ${b} deja resto ${rr}.` },
        { id: 'propia', valor: fx(propia), error: 'AT-CLASE', siFuera: `${propia[0]}/${b} es menor que 1: es propia, no un entero.` },
        { id: 'otra', valor: fx(otraImp), error: 'AT-APARENTE', siFuera: `Pasa de 1, pero ${otraImp[0]} no es múltiplo de ${b}: es impropia.` },
      ]),
      solucion: { texto: `${q * b} es múltiplo de ${b}: la fracción es un entero.`, ecuacion: [`${q * b} ÷ ${b} = ${q}`] },
    };
    return {
      pregunta: `¿Cuál de estas fracciones es propia: ${lista.map(fx).join(', ')}?`,
      datos: [D2.clases],
      opciones: opciones(fx(propia), [
        { id: 'impropia', valor: fx(impropia), error: 'AT-CLASE', siFuera: `${impropia[0]} es mayor que ${b}: vale más que 1, es impropia.` },
        { id: 'aparente', valor: fx(aparente), error: 'AT-CLASE', siFuera: `${aparente[0]}/${b} = ${q}: es un entero, no menos que 1.` },
        { id: 'otra', valor: fx(otraImp), error: 'AT-CLASE', siFuera: `${otraImp[0]} es mayor que ${b}: pasa de 1.` },
      ]),
      solucion: { texto: `En ${p1}/${b} el numerador es menor que el denominador: vale menos que 1.`, ecuacion: [fr(p1, b), ' < 1'] },
    };
  }
  // Ahora tú · tipo 3: de impropia a número mixto.
  function casoMixto(r) {
    const b = r.ent(3, 9), q = r.ent(1, 5), rr = r.ent(1, b - 1), a = q * b + rr;
    if (mcd(a, b) !== 1 || rr === q || (a === 7 && b === 4) || (a === 11 && b === 4)) return null;
    const exc = [q + 1, b - rr];
    return {
      pregunta: `¿Cómo se escribe ${a}/${b} como número mixto?`,
      datos: [D2.mixto],
      opciones: opciones(`${q} y ${rr}/${b}`, [
        { id: 'invierte', valor: `${rr} y ${q}/${b}`, error: 'AT-INVIERTE-MIXTO', siFuera: `Bien dividir ${a} entre ${b}. Pero ${q} es el entero y ${rr} lo que sobra.` },
        { id: 'exceso', valor: `${exc[0]} y ${exc[1]}/${b}`, error: 'AT-POR-EXCESO', siFuera: `${exc[0]} × ${b} = ${exc[0] * b} se pasa de ${a}: el entero es ${q}.` },
        { id: 'denom', valor: `${q} y ${rr}/${a}`, error: 'AT-DENOM-MIXTO', siFuera: `Bien el entero y el resto. Pero el resto va sobre ${b}, el tamaño de la porción.` },
      ]),
      solucion: { texto: `${a} ÷ ${b} da ${q} y sobran ${rr}: ${q} queques y ${rr} porciones.`, ecuacion: [`${a} = ${q} × ${b} + ${rr}`] },
    };
  }
  // Ahora tú · tipo 4 (San Marcos 2026-I): cuántas irreductibles de denominador N hay entre dos fracciones.
  function casoEntreN(r) {
    const N = r.de([12, 18, 20, 24, 30, 36, 40]);
    const ds = [2, 3, 4, 5, 6, 8, 9, 10].filter(x => N % x === 0);
    const q = r.de(ds), s = r.de(ds), p = r.ent(1, q - 1), u = r.ent(1, s - 1);
    if (mcd(p, q) !== 1 || mcd(u, s) !== 1 || p * s >= u * q) return null;
    const lo = p * N / q, hi = u * N / s;
    if (hi - lo < 4) return null;
    let irr = 0, todas = 0, uno = 0; const p0 = factores(N)[0][0];
    for (let k = lo + 1; k < hi; k++) { todas++; if (mcd(k, N) === 1) irr++; if (k % p0 !== 0) uno++; }
    if (N === 24 && p === 1 && q === 3 && u === 3 && s === 4) return null;
    if (irr === 0 || uno === irr) return null;
    return {
      pregunta: `¿Cuántas fracciones irreductibles de denominador ${N} son mayores que ${p}/${q} y menores que ${u}/${s}?`,
      datos: [D2.comun, D2.irr],
      opciones: opciones(irr, [
        { id: 'todas', valor: todas, error: 'AT-ENTRE-TODAS', siFuera: `Bien de ${lo + 1}/${N} a ${hi - 1}/${N}. Pero varias se simplifican: no son irreductibles.` },
        { id: 'extremos', valor: todas + 2, error: 'AT-ENTRE-EXTREMOS', siFuera: `${lo}/${N} y ${hi}/${N} son los extremos: no están entre ellos, y además se simplifican.` },
        { id: 'uno', valor: uno, error: 'AT-UN-PRIMO', siFuera: `Bien quitar los múltiplos de ${p0}. Pero ${N} = ${canon(N)}: también se quitan los de los otros primos.` },
      ]),
      solucion: { texto: `Entre ${lo}/${N} y ${hi}/${N}: k de ${lo + 1} a ${hi - 1}, sin primos comunes con ${N}.`, ecuacion: [`${p}/${q} = ${lo}/${N}`, SEP, `${u}/${s} = ${hi}/${N}`] },
    };
  }
  // Ahora tú · tipo 5 (San Marcos 2027-I): cuál bolsa sale más barata por kilo.
  function casoPrecio(r) {
    const k1 = r.ent(2, 6), k2 = r.ent(2, 9), P1 = r.ent(5, 40), P2 = r.ent(5, 60);
    if (k1 === k2 || P1 * k2 === P2 * k1) return null;
    const barataA = P1 * k2 < P2 * k1;
    // La trampa: la que cuesta menos en total es la otra.
    // La trampa cuesta menos en total, de verdad (con el mismo precio, el siFuera mentía; auditoría, 20 nov).
    if (P1 === P2 || (P1 < P2) === barataA || Math.abs(P1 / k1 - P2 / k2) > 1.5) return null;
    const A = `La de ${k1} kg`, B = `La de ${k2} kg`;
    return {
      pregunta: `Una bolsa de arroz de ${k1} kg cuesta S/ ${P1} y otra de ${k2} kg cuesta S/ ${P2}. ¿Cuál sale más barata por kilo?`,
      datos: [D2.precio, D2.cruz],
      opciones: opciones(barataA ? A : B, [
        { id: 'total', valor: barataA ? B : A, error: 'AT-TOTAL', siFuera: 'Cuesta menos en total, es cierto. Pero lleva menos kilos: por kilo sale más cara.' },
        { id: 'igual', valor: 'Las dos igual', error: 'AT-DIFERENCIA', siFuera: `En cruz no dan lo mismo: ${P1} × ${k2} = ${P1 * k2} y ${P2} × ${k1} = ${P2 * k1}.` },
        { id: 'nose', valor: 'No se puede saber', error: 'AT-DISTINTOS', siFuera: `Sí se puede: se comparan ${P1}/${k1} y ${P2}/${k2}, en cruz.` },
      ]),
      solucion: { texto: `Precio por kilo: ${P1}/${k1} contra ${P2}/${k2}. En cruz, la menor es la más barata.`, ecuacion: [`${P1} × ${k2} = ${P1 * k2}`, SEP, `${P2} × ${k1} = ${P2 * k1}`] },
    };
  }

  // Ejemplos resueltos (idea 2). Cuentas rehechas aparte (cuentas.py, con Fraction): 7/9 > 5/9; 3/5 > 3/8; 9/4
  // impropia; 11/4 = 2 y 3/4; 3 y 2/5 = 17/5; 4 × 9 = 36 > 7 × 5 = 35; 5/6 = 20/24 < 21/24 = 7/8; 3/5 < 5/8 < 2/3 (72,
  // 75 y 80 de 120); 7/15 < 1/2 < 9/16; 5/2 > 7/3 (15/6 contra 14/6); irreductibles de denominador 24 entre 1/3 y 3/4:
  // 11, 13 y 17 (todas: 9; con extremos: 11; solo impares: 5; sin múltiplos de 3: 6); la mayor de 13/18, 11/15, 3/4, 5/7 y
  // 7/12 es 3/4 (en cruz con 3/4: 52 < 54, 44 < 45, 20 < 21, 28 < 36); por kilo, 11/3 > 29/8 > 18/5 (la de 5 kg); de
  // denominador 15 entre 2/5 y 4/5: 7 a 11, son 5; 2 y 3/5 = 13/5.
  const EJEMPLOS_ORD = [
    { nivel: 1, titulo: 'Mismo denominador',
      enunciado: '¿Cuál es mayor: 5/9 o 7/9?',
      datos: [D2.igual],
      figura: queques([sinVender(5, 9, 'Arriba: '), sinVender(7, 9, 'Abajo: ')]),
      solucion: [{ texto: 'Las dos tienen porciones del mismo tamaño, novenos. Gana la que toma más porciones.', ecuacion: [fr(5, 9), ' < ', fr(7, 9)] }],
      respuesta: [frP(7, 9)] },
    { nivel: 1, titulo: 'Mismo numerador',
      enunciado: '¿Cuál es mayor: 3/5 o 3/8?',
      datos: [D2.cruz],
      solucion: [{ texto: 'Las dos toman 3 porciones, pero los quintos son más grandes que los octavos. En cruz: 3 × 8 = 24 y 5 × 3 = 15.', ecuacion: [fr(3, 5), ' > ', fr(3, 8)] }],
      respuesta: [frP(3, 5)] },
    { nivel: 1, titulo: '¿De qué clase es?',
      enunciado: '¿La fracción 9/4 es propia, impropia o aparente?',
      datos: [D2.clases],
      solucion: [{ texto: '9 es mayor que 4, así que pasa de 1. Y 9 no es múltiplo de 4: no da un entero justo.', ecuacion: ['9 = 2 × 4 + 1'] }],
      respuesta: ['Es impropia'] },
    { nivel: 1, titulo: 'De impropia a mixto',
      enunciado: '¿Cómo se escribe 11/4 como número mixto?',
      datos: [D2.mixto],
      figura: queques([bandeja(11, 4, { queques: 3 })], { maxQueques: 3 }),
      solucion: [{ texto: '11 ÷ 4 da 2 y sobran 3: dos queques enteros y 3 porciones de cuatro.', ecuacion: ['11 = 2 × 4 + 3'] }],
      respuesta: [pe('2 y 3/4')] },
    { nivel: 1, titulo: 'De mixto a impropia',
      enunciado: '¿Qué fracción impropia es el número mixto 3 y 2/5?',
      datos: [D2.mixto],
      solucion: [{ texto: 'Cada entero tiene 5 quintos: 3 enteros son 15 quintos, más 2.', ecuacion: ['3 × 5 + 2 = 17'] }],
      respuesta: [frP(17, 5)] },
    { nivel: 2, titulo: 'En cruz',
      enunciado: '¿Cuál es mayor: 4/7 o 5/9?',
      datos: [D2.cruz],
      solucion: [
        { texto: 'Multiplico en cruz, cada numerador por el otro denominador.', ecuacion: ['4 × 9 = 36', SEP, '7 × 5 = 35'] },
        { texto: 'El lado de 4/7 da más: 4/7 es mayor, aunque su numerador sea menor.' },
      ],
      respuesta: [frP(4, 7)] },
    { nivel: 2, titulo: 'Con el MCM abajo',
      enunciado: '¿Cuál es mayor: 5/6 o 7/8? Usa el MCM de los denominadores.',
      datos: [D2.comun, D2.igual],
      solucion: [
        { texto: 'El MCM de 6 y 8 es 24. Paso las dos a veinticuatroavos.', ecuacion: [fr(5, 6), ' = ', fr(20, 24), SEP, fr(7, 8), ' = ', fr(21, 24)] },
        { texto: 'Con el mismo denominador gana el numerador mayor: 21 > 20.' },
      ],
      respuesta: [frP(7, 8)] },
    { nivel: 2, titulo: 'Ordenar tres',
      enunciado: 'Ordena de menor a mayor: 2/3, 3/5 y 5/8.',
      datos: [D2.comun, D2.igual],
      solucion: [
        { texto: 'El MCM de 3, 5 y 8 es 120.', ecuacion: [fr(2, 3), ' = ', fr(80, 120), SEP, fr(3, 5), ' = ', fr(72, 120), SEP, fr(5, 8), ' = ', fr(75, 120)] },
        { texto: 'Se ordenan por el numerador: 72 < 75 < 80.' },
      ],
      respuesta: [frP(3, 5), ' < ', frP(5, 8), ' < ', frP(2, 3)] },
    { nivel: 2, titulo: 'Comparar con la mitad',
      enunciado: '¿Cuál es mayor: 7/15 o 9/16?',
      datos: [D2.cruz],
      solucion: [
        { texto: 'La mitad de 15 es 7,5: 7/15 no llega a 1/2. La mitad de 16 es 8: 9/16 pasa de 1/2.' },
        { texto: 'En cruz lo confirma: 7 × 16 = 112 y 15 × 9 = 135.' },
      ],
      respuesta: [frP(9, 16)] },
    { nivel: 2, titulo: 'Más de un queque',
      enunciado: 'Ana vendió 5/2 de queques y Beto, 2 y 1/3 de queques iguales. ¿Quién vendió más?',
      datos: [D2.mixto, D2.comun],
      figura: queques([sinVender(5, 2, 'Ana: ', { queques: 3 }), sinVender(7, 3, 'Beto: ', { queques: 3 })], { maxQueques: 3 }),
      solucion: [
        { texto: '2 y 1/3 = 7/3. Con denominador 6: 5/2 = 15/6 y 7/3 = 14/6.', ecuacion: [fr(15, 6), ' > ', fr(14, 6)] },
        { texto: 'Ana vendió 1/6 de queque más.' },
      ],
      respuesta: ['Ana: ', frP(5, 2)] },
    { nivel: 3, titulo: 'Irreductibles entre dos',
      enunciado: '¿Cuántas fracciones irreductibles de denominador 24 son mayores que 1/3 y menores que 3/4?',
      alternativas: ['9', '3', '11', '5', '6'],
      datos: [D2.comun, D2.irr],
      solucion: [
        { texto: '1/3 = 8/24 y 3/4 = 18/24: el numerador va de 9 a 17. 24 = 2³ × 3: se quitan los pares y los múltiplos de 3.', ecuacion: ['11/24', SEP, '13/24', SEP, '17/24'] },
        { texto: ['Las trampas: ', letra('A'), ' cuenta las 9, también las que se simplifican; ', letra('C'), ' suma los extremos; ', letra('D'), ' solo quita los pares; ', letra('E'), ' solo quita los múltiplos de 3.'] },
      ],
      respuesta: [letra('B'), ': 3'] },
    { nivel: 3, titulo: 'La mayor de cinco',
      enunciado: '¿Cuál de estas fracciones es la mayor?',
      alternativas: ['13/18', '11/15', '3/4', '5/7', '7/12'],
      datos: [D2.cruz],
      solucion: [
        { texto: 'Comparo cada una con 3/4, en cruz: 13 × 4 = 52 < 18 × 3 = 54; 11 × 4 = 44 < 15 × 3 = 45.' },
        { texto: 'Y 5 × 4 = 20 < 7 × 3 = 21; 7 × 4 = 28 < 12 × 3 = 36. Todas pierden con 3/4.' },
        { texto: ['Las trampas: ', letra('A'), ' tiene el numerador mayor; ', letra('B'), ' y ', letra('D'), ' quedan muy cerca, pero pierden por poco; ', letra('E'), ' tiene las porciones más grandes después de 3/4.'] },
      ],
      respuesta: [letra('C'), ': ', frP(3, 4)] },
    { nivel: 3, titulo: 'La bolsa más barata',
      enunciado: 'Tres bolsas de arroz: 3 kg a S/ 11, 5 kg a S/ 18 y 8 kg a S/ 29. ¿Cuál sale más barata por kilo?',
      alternativas: ['La de 3 kg', 'La de 8 kg', 'Las tres igual', 'La de 5 kg', 'No se puede saber'],
      datos: [D2.precio, D2.cruz],
      solucion: [
        { texto: 'Por kilo: 11/3, 18/5 y 29/8. En cruz: 18 × 3 = 54 < 5 × 11 = 55, y 18 × 8 = 144 < 5 × 29 = 145.' },
        { texto: '18/5 es la menor de las tres: la de 5 kg sale más barata.' },
        { texto: ['Las trampas: ', letra('A'), ' cuesta menos en total; ', letra('B'), ' es la más grande; ', letra('C'), ' y ', letra('E'), ' no comparan: en cruz sí se puede.'] },
      ],
      respuesta: [letra('D'), ': la de 5 kg'] },
    { nivel: 3, titulo: 'Cuántas caben entre dos',
      enunciado: '¿Cuántas fracciones de denominador 15 son mayores que 2/5 y menores que 4/5?',
      alternativas: ['7', '3', '6', '4', '5'],
      datos: [D2.comun],
      solucion: [
        { texto: '2/5 = 6/15 y 4/5 = 12/15: el numerador va de 7 a 11, sin los extremos.', ecuacion: ['11 − 7 + 1 = 5'] },
        { texto: ['Las trampas: ', letra('A'), ' cuenta también 6/15 y 12/15; ', letra('B'), ' cuenta los numeradores entre 2 y 4; ', letra('C'), ' resta 12 − 6; ', letra('D'), ' resta 11 − 7 y olvida el + 1.'] },
      ],
      respuesta: [letra('E'), ': 5'] },
    { nivel: 3, titulo: 'Mixto contra impropia',
      enunciado: '¿Cuál es mayor: 2 y 3/5 o 13/5?',
      alternativas: ['Son iguales', '2 y 3/5', '13/5', 'No se pueden comparar', 'Ninguna: las dos son menores que 2'],
      datos: [D2.mixto],
      solucion: [
        { texto: '2 y 3/5 son 2 enteros de 5 quintos más 3 quintos: 2 × 5 + 3 = 13 quintos.', ecuacion: ['2 × 5 + 3 = 13'] },
        { texto: ['Las trampas: ', letra('B'), ' cree que el entero pesa más; ', letra('C'), ' cree que 13 gana; ', letra('D'), ' no pasa a quintos; ', letra('E'), ' no ve que 13/5 pasa de 2.'] },
      ],
      respuesta: [letra('A'), ': son iguales'] },
  ];

  const clases = {
    id: 'orden-recta',
    titulo: 'Comparar fracciones',
    pregunta: '¿Cuál de dos fracciones es la parte más grande?',
    temas: ['Clases de fracciones', 'Orden entre fracciones'],
    pieza: QU,
    aprendizaje: 'Con distinto denominador, se multiplica en cruz: a/b < c/d si a × d < b × c. Propia, menor que 1; impropia, mayor; aparente, un entero.',
    actividad: 'Vender en dos bandejas iguales y ver de cuál se vendió más queque.',
    // Lee: las dos bandejas (3/4 y 4/6, sin decir cuál es más) y la fracción que pasa de un queque. No dice cómo se
    // comparan dos fracciones (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Dos bandejas iguales', texto: 'En la feria, la promoción pone dos queques iguales, uno arriba y otro abajo. El de arriba se cortó en 4 porciones y se vendieron 3; el de abajo, en 6, y se vendieron 4.',
          pieza: QU, dibujo: bandejas2(3, 4, 4, 6, { max: 1 }) },
        { titulo: 'Más de un queque', texto: 'Si se venden 7 porciones de queques cortados en 4, se vendió más de un queque: 7/4. Una fracción mayor que 1 es impropia; menor que 1, propia; si da un entero justo, aparente.',
          pieza: QU, dibujo: queques([bandeja(7, 4, { queques: 2 })], { maxQueques: 2 }) },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar lo vendido en las dos bandejas. Mira de cuál se vendió más, también cuando las porciones son de distinto tamaño.' },
      ],
    },
    ejemplos: EJEMPLOS_ORD,
    juega: {
      pieza: QU,
      consigna: 'La promoción tiene dos bandejas con queques iguales. En cada una se cortó el queque en porciones y se vendieron algunas.',
      mision: {
        // Una sola manera en la grilla: con 3/4 arriba y 7 porciones abajo, la menor que pasa es 6/7 (5/7 no llega).
        texto: 'Arriba hay 3/4 vendido. Abajo, en séptimos, vende lo menos posible pero más que arriba.',
        logrado: v => v.a === 3 && v.b === 4 && v.d === 7 && v.c === 6,
        bien: '6/7 pasa a 3/4; con 5/7 no alcanza.',
      },
      voz: 'Compara el tamaño de lo vendido, no solo los números.',
      leyenda: [
        { s: pa('vendido'), t: 'porciones vendidas: el numerador' },
        { s: ps('porciones'), t: 'en cuántas se cortó: el denominador' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Vendidas arriba', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'Porciones arriba', color: 'c-i', min: 4, max: 8, paso: 1, inicio: 5, unidad: '', decimales: 0 },
        { id: 'c', etiqueta: 'Vendidas abajo', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'd', etiqueta: 'Porciones abajo', color: 'c-i', min: 4, max: 8, paso: 1, inicio: 6, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: bandejas2(v.a, v.b, v.c, v.d).datos, estado: {} }),
      lectura: v => {
        const sg = signo2(v.a, v.b, v.c, v.d);
        return [fr(v.a, v.b), ` ${sg} `, fr(v.c, v.d), sg === '=' ? ': lo mismo en las dos' : sg === '>' ? ': arriba se vendió más' : ': abajo se vendió más'];
      },
      minimo: 3,
    },
    predice: {
      pieza: QU,
      pregunta: 'Dos queques iguales: uno se cortó en 7 porciones y se vendieron 5; el otro, en 9, y se vendieron 7. ¿De cuál se vendió más queque?',
      datos: ['Los dos queques son del mismo tamaño'],
      voz: 'Piensa en el tamaño de cada porción.',
      opciones: [
        { id: 'c', texto: 'Del de 7/9', correcta: true },
        { id: 'porcion', texto: 'Del de 5/7', error: 'AT-PORCION', siFuera: 'Los séptimos son más grandes, es cierto. Pero se tomaron menos: 5 × 9 = 45 y 7 × 7 = 49.' },
        { id: 'iguales', texto: 'Se vendió lo mismo', error: 'AT-DIFERENCIA', siFuera: 'A los dos les faltan 2 porciones, pero las de novenos son más chicas: falta menos.' },
        { id: 'nose', texto: 'No se puede saber', error: 'AT-DISTINTOS', siFuera: 'Con porciones distintas sí se puede: se cortan las dos en 63 pedazos iguales.' },
      ],
      // Sin lo vendido pintado: a escala, 7/9 se veía más largo y regalaba la respuesta (lector A y auditoría, 20 nov).
      dibujo: { datos: { maxQueques: 1, bandejas: [sinVender(5, 7, 'Queque 1: '), sinVender(7, 9, 'Queque 2: ')] }, estado: {} },
      revelar: { datos: { maxQueques: 1, bandejas: [bandeja(5, 7, { k: 9, rotulo: rotFr('Queque 1: ', 45, 63) }), bandeja(7, 9, { k: 7, rotulo: rotFr('Queque 2: ', 49, 63) })] }, estado: {} },
      coincide: 'Coincide: en 63 pedazos iguales, el primero vendió 45 y el segundo 49.',
      noCoincide: 'Revisemos cortando los dos queques en pedazos del mismo tamaño.',
    },
    mira: {
      pieza: QU,
      datos: { maxQueques: 1, filas: 2, bandejas: [bandeja(5, 7), bandeja(7, 9)], pasos: [
        { bandejas: [bandeja(5, 7, { rotulo: rotFr('Queque 1: ', 5, 7) }), bandeja(7, 9, { rotulo: rotFr('Queque 2: ', 7, 9) })] },
        { bandejas: [bandeja(5, 7, { k: 9, rotulo: rotFr('Queque 1: ', 45, 63) }), bandeja(7, 9, { k: 7, rotulo: rotFr('Queque 2: ', 49, 63) })] },
        { bandejas: [bandeja(5, 7, { k: 9, rotulo: rotFr('Queque 1: ', 45, 63) }), bandeja(7, 9, { k: 7, rotulo: rotFr('Queque 2: ', 49, 63) })] },
        { bandejas: [bandeja(5, 7, { rotulo: rotFr('Queque 1: ', 5, 7) }), bandeja(7, 9, { rotulo: rotFr('Queque 2: ', 7, 9) })] },
      ] },
      voz: 'Mira cómo se cortan los dos queques en pedazos iguales.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Porciones de distinto tamaño: así no se cuentan juntas.', ecuacion: [fr(5, 7), '  y  ', fr(7, 9)] },
        { estado: { paso: 1 }, texto: 'Cada séptimo en 9 y cada noveno en 7: todos de 1/63.', ecuacion: [fr(5, 7), ' = ', fr(45, 63), SEP, fr(7, 9), ' = ', fr(49, 63)] },
        { estado: { paso: 2 }, texto: 'Con pedazos iguales gana el que tiene más: 49 > 45.', ecuacion: [fr(5, 7), ' < ', fr(7, 9)] },
        { estado: { paso: 3 }, texto: 'Sin cortar: en cruz salen los mismos números.', ecuacion: ['5 × 9 = 45', SEP, '7 × 7 = 49'] },
      ],
    },
    regla: {
      texto: 'Con igual denominador gana el numerador mayor; si no, en cruz: a/b < c/d si a × d < b × c. Propia: menor que 1; impropia: mayor; aparente: un entero.',
      ecuacion: [fr(5, 7), ' < ', fr(7, 9), SEP, { llave: ['5 × 9 < 7 × 7'], nota: '45 < 49' }, SEP, { llave: [fr(7, 4), ' = 1 + ', fr(3, 4)], nota: 'impropia' }, SEP, { llave: [fr(8, 4), ' = 2'], nota: 'aparente' }],
      condicion: 'b y d son positivos. Una impropia se escribe como número mixto: 7/4 es 1 y 3/4.',
      voz: 'En la recta, la mayor queda más a la derecha.',
      // La recta llega a 2: también se ve 7/4, la impropia de la ecuación (lector A, 20 nov).
      dibujo: { pieza: 'recta', datos: { min: 0, max: 2, paso: 0.5, cada: 2, decimales: 0, variable: '', filas: 2,
        elementos: [{ tipo: 'punto', x: 5 / 7, color: 'o', fila: 1, rotulo: '5/7' }, { tipo: 'punto', x: 7 / 9, color: 'f', fila: 2, rotulo: '7/9' }, { tipo: 'punto', x: 7 / 4, color: 'o', fila: 1, rotulo: '7/4' }] }, estado: {} },
    },
    // Así se resuelve: una fracción entre dos dadas (con un denominador común y, si hace falta, el doble). «Ahora tú»
    // pide cuál es mayor, ordenar tres, la clase, el número mixto, cuántas irreductibles hay entre dos y la bolsa más
    // barata por kilo.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const x = r.de(PROPIAS), y = r.de(PROPIAS);
          if (x[0] * y[1] >= x[1] * y[0] || USADOS2.has(par2(x, y))) continue;
          const L = mcm(x[1], y[1]), u = x[0] * L / x[1], w = y[0] * L / y[1];
          if (L > 40 || w - u > 2) continue;
          const K = w - u === 1 ? 2 : 1, num = u * K + 1;
          return {
            enunciado: `Halla una fracción que sea mayor que ${fx(x)} y menor que ${fx(y)}.`,
            datos: [D2.comun, D2.igual],
            pasos: [
              { tipo: 'pide', texto: `Piden una fracción entre ${fx(x)} y ${fx(y)}. Hay muchas; basta una.` },
              { tipo: 'regla', texto: 'Con el mismo denominador, las que están entre las dos tienen el numerador entre los dos numeradores.' },
              { tipo: 'cuentas', texto: `El MCM de ${x[1]} y ${y[1]} es ${L}.`, ecuacion: [fr(x[0], x[1]), ' = ', fr(u, L), SEP, fr(y[0], y[1]), ' = ', fr(w, L)] },
              K === 2
                ? { tipo: 'aplica', texto: `Entre ${u} y ${w} no cabe un entero: corto cada pedazo en 2.`, ecuacion: [fr(2 * u, 2 * L), ' < ', frP(num, 2 * L), ' < ', fr(2 * w, 2 * L)] }
                : { tipo: 'aplica', texto: `Entre ${u} y ${w} está ${u + 1}.`, ecuacion: [fr(u, L), ' < ', frP(num, L), ' < ', fr(w, L)] },
              { tipo: 'sentido', texto: `Compruebo en cruz con ${fx(x)}: ${x[0]} × ${L * K} = ${x[0] * L * K} es menos que ${x[1]} × ${num} = ${x[1] * num}.` },
            ],
            respuesta: ['Una de ellas es ', frP(num, L * K)],
          };
        }
      },
    },
    ahoraTu: {
      voz: '¿Las porciones son del mismo tamaño?',
      generar(sem) {
        const r = azar(sem + 23), tipo = sem % 6;
        return conCuatro([casoMayor, casoOrdenar, casoClase, casoMixto, casoEntreN, casoPrecio][tipo], r);
      },
    },
  };

  // ---------- Idea 3 (nueva, 19 nov): sumar partes del mismo total y tomar una parte de lo que queda ----------
  // Propuesta §1 a §7. Objeto: la venta del día de la promoción (arit-queque): en la mañana se vende una parte del
  // queque (porciones de arriba abajo) y en la tarde, una parte de lo que quedó (filas cortadas solo en lo que quedó).
  // Cambia: cuánto se vende en cada turno. · Permanece: el queque entero. · Progresa: lo de la mañana → lo de la tarde,
  // medido sobre lo que quedó → lo que queda del queque entero. · Se reserva: 1/2 en la mañana y 1/3 en la tarde (la
  // predicción; el juego no tiene 1/2 en la mañana). · Debe verse: la tarde se corta sobre lo que quedó, no sobre el
  // queque entero.
  // Errores: AR12 suma numeradores y denominadores (documentado: NAEP, 55 % en 12/13 + 7/8) · AT-RESTO-TOTAL toma la
  // segunda parte sobre el total · AT-RESTO-SOLO da lo que queda de lo que quedaba, sin multiplicar · AT-SUMA-ARRIBA suma
  // los numeradores y multiplica los denominadores · AT-PRODUCTO-FR multiplica en vez de sumar · AT-RESPONDE-OTRA
  // responde otra cantidad del problema · AT-DESHACE-UNA deshace solo una de las dos ventas · AT-SUMA-DESAGUE suma el
  // desagüe como si llenara · AT-OLVIDA-DESAGUE lo deja cerrado · AT-SUMA-TIEMPOS suma las horas · AT-INVIERTE-TIEMPO da lo
  // que se llena en una hora · AT-OLVIDA-GANANCIA no quita la ganancia · AT-SUMA-GANANCIA la suma en vez de quitarla.
  const D3 = {
    comun: 'Para sumar o restar fracciones, se escriben con un mismo denominador (el MCM) y se suman o se restan los numeradores',
    resto: 'Quitar c/d de lo que queda (vender, gastar o perder) es quitar c/d × lo que quedaba',
    queda: 'Si de un total se vende a/b, queda 1 − a/b del total',
    deUna: 'a/b de una cantidad N es N × a ÷ b',
    hora: 'Si un grifo llena el tanque en A horas, en una hora llena 1/A del tanque',
    desague: 'Un desagüe que vacía el tanque en C horas saca 1/C del tanque en cada hora',
  };
  // Sin 1/3 en la mañana (cierre, 20 nov): con 1/3 y después 1/2 de lo que quedó, el juego mostraba «queda 1/3», la
  // respuesta de la Predice (1/2 y después 1/3), en el otro orden.
  const MANANA = ['2/3', '1/4', '3/4', '2/5', '3/5'], TARDE = ['1/2', '1/4', '3/4', '1/5'];
  // La venta del día: mañana a/b (porciones), tarde c/d de lo que quedó (filas cortadas solo en lo que quedó).
  // o.tarde: false dibuja solo la mañana; o.queda: false no marca lo que queda.
  function venta(a, b, c, d, o = {}) {
    const marcas = [{ c0: 0, c1: a, color: 'o' }];
    if (o.tarde !== false) marcas.push({ c0: a, c1: b, f0: 0, f1: c, color: 'o', estilo: 'rayado' });
    if (o.queda !== false && o.tarde !== false) marcas.push({ c0: a, c1: b, f0: c, f1: d, color: 'f', estilo: 'borde' });
    const rot = [[o.r1 || 'Mañana: '], [String(a), 'o', 700], ['/'], [String(b), 'i', 700],
      ...(o.tarde !== false ? [['; tarde: '], [String(c), 'o', 700], ['/'], [String(d), 'i', 700], [' de lo que quedó']] : [])];
    return { partes: b, filas: o.tarde === false ? 1 : d, cortaFilas: [a, b], marcas, rotulo: rot, ...(o.nota ? { nota: o.nota } : {}) };
  }
  const queda3 = (a, b, c, d) => red((b - a) * (d - c), b * d);
  const fxr = ([n, m]) => txt(n, m);
  const horas = ([n, m]) => `${txt(n, m)} h`;
  const suma = (a, b, c, d) => red(a * d + b * c, b * d);
  // Pares que ya usan la predicción, la misión, «Lee» y los ejemplos (también los de una suma: 2/7 + 3/7, 1/4 + 1/6…).
  const USADOS3 = new Set(['1/2-1/3', '2/3-1/4', '1/4-1/3', '2/5-1/2', '1/3-1/4', '1/3-1/2', '2/5-1/3', '1/4-2/3', '2/7-3/7', '1/4-1/6', '5/6-1/4',
    '1/2-2/3', '1/3-1/6', '1/4-2/4', '1/4-1/2', '1/3-2/3']);
  const FR3 = PROPIAS.filter(([, b]) => b <= 6);

  // Ahora tú · tipo 0 (cierre, 20 nov: antes era una suma sola, que no practicaba la parte del resto; lector A): qué
  // queda del queque tras vender en la mañana y, en la tarde, una parte de lo que quedó. Los tres errores de la Predice,
  // con otros números: restar las dos del total, sumar arriba con arriba (AR12) y quedarse con lo de la tarde.
  function casoQueda(r) {
    const [a, b] = r.de(FR3), [c, d] = r.de(FR3);
    if (USADOS3.has(`${a}/${b}-${c}/${d}`)) return null;
    const Q = queda3(a, b, c, d), tot = b * d - a * d - c * b;
    return {
      pregunta: `En la mañana se vende ${a}/${b} de un queque y en la tarde, ${c}/${d} de lo que quedó. ¿Qué parte del queque queda al final?`,
      datos: [D3.queda, D3.resto],
      opciones: opciones(fxr(Q), [
        { id: 'total', valor: tot > 0 ? fxr(red(tot, b * d)) : null, error: 'AT-RESTO-TOTAL', siFuera: `Restar las dos ventas está bien. Pero los ${c}/${d} son de lo que quedó, no del queque.` },
        { id: 'ar12', valor: fxr(red(b + d - a - c, b + d)), error: 'AR12', siFuera: `Juntar las ventas está bien, pero ${a}/${b} + ${c}/${d} no es ${txt(a + c, b + d)}: arriba con arriba no se suma.` },
        { id: 'solo', valor: fxr(red(d - c, d)), error: 'AT-RESTO-SOLO', siFuera: `De lo que quedó queda ${d - c}/${d}, bien. Pero son ${d - c}/${d} de ${b - a}/${b}, no del queque.` },
      ]),
      solucion: { texto: `Queda ${b - a}/${b} y, después, ${d - c}/${d} de eso.`, ecuacion: [fr(d - c, d), ' × ', fr(b - a, b), ' = ', frP(...Q)] },
    };
  }
  // Ahora tú · tipo 1: lo vendido en total, con la tarde sobre lo que quedó.
  function casoTotal3(r) {
    const [a, b] = r.de(FR3), [c, d] = r.de(FR3);
    if (USADOS3.has(`${a}/${b}-${c}/${d}`)) return null;
    const tarde = red(c * (b - a), d * b), T = suma(a, b, ...tarde), Q = queda3(a, b, c, d);
    return {
      pregunta: `En la mañana se vende ${a}/${b} de un queque y en la tarde, ${c}/${d} de lo que quedó. ¿Qué parte del queque se vendió en total?`,
      datos: [D3.queda, D3.resto, D3.comun],
      opciones: opciones(fxr(T), [
        { id: 'total', valor: fxr(suma(a, b, c, d)), error: 'AT-RESTO-TOTAL', siFuera: `Sumar las dos ventas está bien. Pero los ${c}/${d} son de lo que quedó, no del queque entero.` },
        { id: 'ar12', valor: txt(a + c, b + d), error: 'AR12', siFuera: 'Juntar las dos ventas está bien, pero arriba con arriba y abajo con abajo no se suma.' },
        { id: 'queda', valor: fxr(Q), error: 'AT-RESPONDE-OTRA', siFuera: `Esa es la parte que queda. Se pide lo vendido: 1 menos eso.` },
      ]),
      solucion: { texto: `La tarde vende ${c}/${d} de ${b - a}/${b}: ${fxr(tarde)} del queque.`, ecuacion: [fr(a, b), ' + ', fr(...tarde), ' = ', frP(...T)] },
    };
  }
  // Ahora tú · tipo 2: los kilos que quedan después de dos ventas sobre lo que queda.
  function casoKilos(r) {
    const [a, b] = r.de(FR3), [c, d] = r.de(FR3), N = b * d * r.ent(1, 4);
    if (N < 24 || N > 150 || USADOS3.has(`${a}/${b}-${c}/${d}`)) return null;
    const q1 = N - N * a / b, Q = q1 - q1 * c / d, mal = N - N * a / b - N * c / d;
    return {
      pregunta: `Doña Juana tiene un saco de ${N} kg de arroz. Vende ${a}/${b} del saco y después ${c}/${d} de lo que le quedó. ¿Cuántos kilos le quedan?`,
      datos: [D3.deUna, D3.queda, D3.resto],
      opciones: opciones(Q, [
        { id: 'total', valor: mal, error: 'AT-RESTO-TOTAL', siFuera: `Restar las dos ventas está bien. Pero los ${c}/${d} son de los ${q1} kg que quedaron, no de ${N}.` },
        { id: 'tarde', valor: q1 * c / d, error: 'AT-RESPONDE-OTRA', siFuera: `Bien los ${q1} kg que quedaron. Pero ${q1 * c / d} kg son los que vende después; se pide lo que queda.` },
        { id: 'una', valor: q1, error: 'AT-DESHACE-UNA', siFuera: `Bien la primera venta. Falta la segunda: ${c}/${d} de ${q1} kg.` },
      ], x => `${f(x, 0)} kg`),
      solucion: { texto: `Quedan ${q1} kg y vende ${c}/${d} de ellos.`, ecuacion: [`${N} − ${N * a / b} = ${q1}`, SEP, `${q1} − ${q1 * c / d} = `, pe(`${Q} kg`)] },
    };
  }
  // Ahora tú · tipo 3 (San Marcos 2019-I): hacia atrás, desde lo que quedó.
  function casoAtras(r) {
    const [a, b] = r.de(FR3), [c, d] = r.de(FR3), N = b * d * r.ent(2, 6), Q = N * (b - a) * (d - c) / (b * d);
    if (N > 240 || USADOS3.has(`${a}/${b}-${c}/${d}`)) return null;
    const den = b * d - a * d - c * b, totalMal = den > 0 ? Q * b * d / den : null, soloTarde = Q * d / (d - c), soloMan = Q * b / (b - a);
    return {
      pregunta: `Un panadero vendió ${a}/${b} de sus panes y después ${c}/${d} de los que le quedaban. Le quedaron ${Q} panes. ¿Cuántos panes tenía?`,
      datos: [D3.queda, D3.resto],
      opciones: opciones(N, [
        { id: 'total', valor: Number.isInteger(totalMal) ? totalMal : null, error: 'AT-RESTO-TOTAL', siFuera: `Ir hacia atrás está bien. Pero ${c}/${d} es de lo que quedaba, no del total.` },
        { id: 'tarde', valor: Number.isInteger(soloTarde) ? soloTarde : null, error: 'AT-DESHACE-UNA', siFuera: `Bien: antes de la segunda venta tenía ${soloTarde}. Falta deshacer la primera.` },
        { id: 'man', valor: Number.isInteger(soloMan) ? soloMan : null, error: 'AT-DESHACE-UNA', siFuera: `Deshacer la primera venta está bien, pero falta la segunda: los ${Q} no son lo de después de la primera.` },
        { id: 'doble', valor: 2 * Q, error: 'AT-RESPONDE-OTRA', siFuera: `Duplicar lo que quedó no deshace las ventas: cada venta es una fracción distinta.` },
      ]),
      solucion: { texto: `Queda ${b - a}/${b} y después ${d - c}/${d} de eso: ${fxr(red((b - a) * (d - c), b * d))} del total.`, ecuacion: [`N × ${fxr(red((b - a) * (d - c), b * d))} = ${Q}`, SEP, 'N = ', pe(N)] },
    };
  }
  // Ahora tú · tipo 4 (nivel examen, caños): dos grifos que llenan y, a veces, un desagüe.
  function casoGrifos(r) {
    const A = r.ent(2, 12), B = r.ent(A + 1, 15), con = r() < 0.6, C = con ? r.ent(B + 1, 30) : 0;
    const inv = red(B * (C || 1) + A * (C || 1) - (con ? A * B : 0), A * B * (C || 1));
    if (inv[0] <= 0) return null;
    const T = [inv[1], inv[0]];
    if (T[1] !== 1 || T[0] > 30 || T[0] === A) return null;
    const sinD = red(A * B, A + B), conSuma = con ? red(A * B * C, B * C + A * C + A * B) : null;
    const pregunta = con ? `Un grifo llena un tanque en ${A} h y otro en ${B} h; un desagüe lo vacía en ${C} h. Con el tanque vacío y los tres abiertos, ¿en cuánto tiempo se llena?`
      : `Un grifo llena un tanque en ${A} h y otro en ${B} h. Abiertos los dos, ¿en cuánto tiempo se llena?`;
    return {
      pregunta,
      datos: con ? [D3.hora, D3.desague, D3.comun] : [D3.hora, D3.comun],
      opciones: opciones(horas(T), [
        con ? { id: 'desague', valor: horas(conSuma), error: 'AT-SUMA-DESAGUE', siFuera: `Sumar lo de cada hora está bien. Pero el desagüe saca: 1/${C} se resta.` }
          : { id: 'suma', valor: `${A + B} h`, error: 'AT-SUMA-TIEMPOS', siFuera: 'Dos grifos juntos tardan menos que cada uno, no más: se suma lo que llenan en una hora.' },
        con ? { id: 'cerrado', valor: horas(sinD), error: 'AT-OLVIDA-DESAGUE', siFuera: `Ese es el tiempo con el desagüe cerrado. Abierto, saca 1/${C} por hora.` }
          : { id: 'mitad', valor: horas(red(A + B, 2)), error: 'AT-SUMA-TIEMPOS', siFuera: 'Promediar los tiempos no sirve: juntos tardan menos que el más rápido.' },
        { id: 'inv', valor: `${txt(...red(T[1], T[0]))} h`, error: 'AT-INVIERTE-TIEMPO', siFuera: `Bien lo que se llena en una hora, 1/${T[0]}. Pero el tiempo es al revés: ${T[0]} h.` },
      ]),
      solucion: { texto: 'Reducción a la unidad: lo que se llena en una hora.', ecuacion: con ? [`1/${A} + 1/${B} − 1/${C} = 1/${T[0]}`] : [`1/${A} + 1/${B} = 1/${T[0]}`] },
    };
  }
  // Ahora tú · tipo 5 (San Marcos 2023-I): pérdidas sucesivas y una ganancia; con cuánto empezó.
  function casoPerdidas(r) {
    const [a, b] = r.de(FR3), [c, d] = r.de(FR3), N = b * d * r.ent(2, 10), G = 5 * r.ent(2, 12);
    const Q = N * (b - a) * (d - c) / (b * d), F = Q + G;
    if (N > 400 || USADOS3.has(`${a}/${b}-${c}/${d}`)) return null;
    const k = (b - a) * (d - c) / (b * d), den = b * d - a * d - c * b, malG = F / k, sumaG = (F + G) / k, tot = den > 0 ? (F - G) * b * d / den : null;
    return {
      pregunta: `Juan pierde ${a}/${b} de su dinero; después, ${c}/${d} de lo que le quedaba, y luego gana S/ ${G}. Termina con S/ ${F}. ¿Con cuánto empezó?`,
      datos: [D3.queda, D3.resto],
      opciones: opciones(N, [
        { id: 'ganancia', valor: Number.isInteger(malG) ? malG : null, error: 'AT-OLVIDA-GANANCIA', siFuera: `Deshacer las pérdidas está bien, pero primero se quitan los S/ ${G} que ganó.` },
        { id: 'sumaG', valor: Number.isInteger(sumaG) ? sumaG : null, error: 'AT-SUMA-GANANCIA', siFuera: `Bien deshacer la ganancia, pero hacia atrás se resta: antes de ganar tenía S/ ${Q}.` },
        { id: 'total', valor: Number.isInteger(tot) ? tot : null, error: 'AT-RESTO-TOTAL', siFuera: `Bien quitar la ganancia. Pero ${c}/${d} es de lo que le quedaba, no del total.` },
        { id: 'resta', valor: F - G, error: 'AT-DESHACE-UNA', siFuera: `S/ ${Q} es lo que tenía antes de ganar. Faltan deshacer las dos pérdidas.` },
      ], x => `S/ ${f(x, 0)}`),
      solucion: { texto: `Antes de ganar tenía S/ ${Q}, que es ${fxr(red((b - a) * (d - c), b * d))} de lo inicial.`, ecuacion: [`${F} − ${G} = ${Q}`, SEP, `N × ${fxr(red((b - a) * (d - c), b * d))} = ${Q}`, SEP, 'N = ', pe(`S/ ${N}`)] },
    };
  }

  // Ejemplos resueltos (idea 3). Cuentas rehechas aparte (cuentas.py, con Fraction): 2/7 + 3/7 = 5/7; 1/4 + 1/6 = 5/12;
  // 5/6 − 1/4 = 7/12; 3/5 de 40 = 24; 1/2 de 2/3 = 1/3; mañana 1/4 y tarde 1/3 del resto: queda 3/4 × 2/3 = 1/2; mañana
  // 2/5 y tarde 1/2 del resto: 2/5 + 3/10 = 7/10; 60 kg, 1/3 y 1/4 del resto: 30 kg; grifos de 3 h y 6 h: 1/3 + 1/6 =
  // 1/2, 2 h; 1/3 y 1/2 del resto, quedan S/ 20: S/ 60. Nivel 3: panes 2/5 y 1/3 del resto, quedan 48: 120 (con el total:
  // 48 ÷ 4/15 = 180; solo la primera: 80; solo la segunda: 72; el doble: 96); grifos 4 h y 6 h, desagüe 12 h: 3 h (desagüe
  // sumado: 2 h; cerrado: 12/5 h; horas sumadas: 22 h; al revés: 1/3 h); viaje 1/4 y 2/3 del resto, último tramo 2 h: 8 h
  // (con el total: 24 h; sin el 1/4: 6 h; sin el 2/3: 8/3 h; AR12, 3/7: 7/2 h); pierde 1/3 y 1/4 del resto, gana 30 y
  // termina con 90: 120 (sin quitar la ganancia: 180; sumándola: 240; con el total: 144; 90 − 30: 60); bidón con 1/3 + 4
  // y 1/2 + 1: 30 L (5 ÷ 5/6: 6; AR12, 2/5: 25/3; con el signo del litro cambiado: 18; solo los sueltos: 5).
  const EJEMPLOS_RESTO = [
    { nivel: 1, titulo: 'Mismo denominador',
      enunciado: '¿Cuánto es 2/7 + 3/7?',
      datos: [D3.comun],
      solucion: [{ texto: 'Las porciones ya son del mismo tamaño, séptimos: se suman las porciones.', ecuacion: [fr(2, 7), ' + ', fr(3, 7), ' = ', frP(5, 7)] }],
      respuesta: [frP(5, 7)] },
    { nivel: 1, titulo: 'Sumar con el MCM',
      enunciado: '¿Cuánto es 1/4 + 1/6?',
      datos: [D3.comun],
      solucion: [{ texto: 'El MCM de 4 y 6 es 12: paso las dos a doceavos y sumo los numeradores.', ecuacion: [fr(1, 4), ' + ', fr(1, 6), ' = ', fr(3, 12), ' + ', fr(2, 12), ' = ', frP(5, 12)] }],
      respuesta: [frP(5, 12)] },
    { nivel: 1, titulo: 'Restar',
      enunciado: '¿Cuánto es 5/6 − 1/4?',
      datos: [D3.comun],
      solucion: [{ texto: 'Con 12 abajo, se restan los numeradores.', ecuacion: [fr(5, 6), ' − ', fr(1, 4), ' = ', fr(10, 12), ' − ', fr(3, 12), ' = ', frP(7, 12)] }],
      respuesta: [frP(7, 12)] },
    { nivel: 1, titulo: 'Parte de una cantidad',
      enunciado: '¿Cuántos kilos son 3/5 de un saco de 40 kg?',
      datos: [D3.deUna],
      solucion: [{ texto: 'Un quinto de 40 kg son 8 kg; tres quintos, el triple.', ecuacion: ['40 × 3 ÷ 5 = 24'] }],
      respuesta: [pe('24 kg')] },
    { nivel: 1, titulo: 'La mitad de dos tercios',
      enunciado: '¿Qué parte del queque es la mitad de 2/3 del queque?',
      datos: [D3.resto],
      figura: queques([{ partes: 3, filas: 2, cortaFilas: [0, 2], marcas: [{ c0: 0, c1: 2, color: 'o' }], rotulo: rotFr('Hay ', 2, 3, ' del queque') }]),
      solucion: [{ texto: 'Los 2/3 se cortan en 2 a lo largo: cada mitad son 2 pedazos de 6, tanto como una porción de tres.', ecuacion: [fr(1, 2), ' × ', fr(2, 3), ' = ', fr(2, 6), ' = ', frP(1, 3)] }],
      respuesta: [frP(1, 3), ' del queque'] },
    { nivel: 2, titulo: 'La mañana y la tarde',
      enunciado: 'En la mañana se vende 1/4 del queque y en la tarde, 1/3 de lo que quedó. ¿Qué parte del queque queda?',
      datos: [D3.queda, D3.resto],
      figura: queques([venta(1, 4, 1, 3, { tarde: false })]),
      solucion: [
        { texto: 'Después de la mañana quedan 3/4. En la tarde se va 1/3 de eso: quedan 2/3 de los 3/4.' },
        { texto: 'Multiplico lo que queda en cada turno.', ecuacion: [fr(2, 3), ' × ', fr(3, 4), ' = ', fr(6, 12), ' = ', frP(1, 2)] },
      ],
      respuesta: ['Queda ', frP(1, 2), ' del queque'] },
    { nivel: 2, titulo: 'Lo vendido en el día',
      enunciado: 'En la mañana se vende 2/5 del queque y en la tarde, la mitad de lo que quedó. ¿Qué parte del queque se vendió?',
      datos: [D3.queda, D3.resto, D3.comun],
      solucion: [
        { texto: 'Quedaban 3/5; la mitad de eso es 3/10 del queque.', ecuacion: [fr(1, 2), ' × ', fr(3, 5), ' = ', fr(3, 10)] },
        { texto: 'Sumo las dos ventas con 10 abajo.', ecuacion: [fr(2, 5), ' + ', fr(3, 10), ' = ', fr(4, 10), ' + ', fr(3, 10), ' = ', frP(7, 10)] },
      ],
      respuesta: [frP(7, 10), ' del queque'] },
    { nivel: 2, titulo: 'Los kilos que quedan',
      enunciado: 'Un saco tiene 60 kg de arroz. Se vende 1/3 del saco y después 1/4 de lo que quedó. ¿Cuántos kilos quedan?',
      datos: [D3.deUna, D3.resto],
      solucion: [
        { texto: '1/3 de 60 kg son 20 kg: quedan 40 kg.', ecuacion: ['60 − 20 = 40'] },
        { texto: '1/4 de 40 kg son 10 kg: quedan 30 kg.', ecuacion: ['40 − 10 = 30'] },
      ],
      respuesta: [pe('30 kg')] },
    { nivel: 2, titulo: 'Dos grifos juntos',
      enunciado: 'Un grifo llena un tanque en 3 h y otro, en 6 h. Abiertos los dos, ¿en cuánto tiempo se llena?',
      datos: [D3.hora, D3.comun],
      solucion: [
        { texto: 'En una hora, el primero llena 1/3 y el segundo 1/6 del tanque.', ecuacion: [fr(1, 3), ' + ', fr(1, 6), ' = ', fr(2, 6), ' + ', fr(1, 6), ' = ', fr(1, 2)] },
        { texto: 'Juntos llenan la mitad en una hora: el tanque, en 2 horas.' },
      ],
      respuesta: [pe('2 h')] },
    { nivel: 2, titulo: 'Hacia atrás',
      enunciado: 'Rosa gasta 1/3 de su dinero y después la mitad de lo que le queda. Le quedan S/ 20. ¿Cuánto tenía?',
      datos: [D3.queda, D3.resto],
      solucion: [
        { texto: 'Le queda la mitad de 2/3, que es 1/3 de lo que tenía.', ecuacion: [fr(1, 2), ' × ', fr(2, 3), ' = ', fr(1, 3)] },
        { texto: 'Si 1/3 son S/ 20, todo es el triple.', ecuacion: ['20 × 3 = 60'] },
      ],
      respuesta: [pe('S/ 60')] },
    { nivel: 3, titulo: 'Los panes que quedaron',
      enunciado: 'Un panadero vendió 2/5 de sus panes y después 1/3 de los que le quedaban. Le quedaron 48 panes. ¿Cuántos panes tenía?',
      alternativas: ['180', '80', '120', '72', '96'],
      datos: [D3.queda, D3.resto],
      solucion: [
        { texto: 'Quedan 3/5 y después 2/3 de eso: 2/5 de los panes.', ecuacion: [fr(2, 3), ' × ', fr(3, 5), ' = ', fr(2, 5), SEP, '48 ÷ 2 × 5 = 120'] },
        { texto: ['Las trampas: ', letra('A'), ' toma el 1/3 del total, 48 ÷ (4/15); ', letra('B'), ' deshace solo la primera venta; ', letra('D'), ' solo la segunda; ', letra('E'), ' duplica los 48.'] },
      ],
      respuesta: [letra('C'), ': 120 panes'] },
    { nivel: 3, titulo: 'Grifos y desagüe',
      enunciado: 'Un grifo llena un tanque en 4 h, otro en 6 h, y un desagüe lo vacía en 12 h. Con el tanque vacío y los tres abiertos, ¿en cuánto tiempo se llena?',
      alternativas: ['2 h', '12/5 h', '22 h', '3 h', '1/3 h'],
      datos: [D3.hora, D3.desague, D3.comun],
      solucion: [
        { texto: 'Reducción a la unidad: en una hora entra 1/4 + 1/6 y sale 1/12. Con 12 abajo: 3/12 + 2/12 − 1/12.', ecuacion: [fr(1, 4), ' + ', fr(1, 6), ' − ', fr(1, 12), ' = ', fr(4, 12), ' = ', fr(1, 3)] },
        { texto: 'Se llena 1/3 del tanque por hora: 3 horas.' },
        { texto: ['Las trampas: ', letra('A'), ' suma el desagüe como si llenara; ', letra('B'), ' lo deja cerrado; ', letra('C'), ' suma las horas; ', letra('E'), ' da lo que se llena en una hora.'] },
      ],
      respuesta: [letra('D'), ': ', pe('3 h')] },
    { nivel: 3, titulo: 'El viaje en tres tramos',
      enunciado: 'Hasta la primera parada, un bus usa 1/4 del tiempo de su viaje; hasta la segunda, 2/3 del tiempo que faltaba. El último tramo dura 2 h. ¿Cuánto dura el viaje?',
      alternativas: ['24 h', '6 h', '8/3 h', '7/2 h', '8 h'],
      datos: [D3.queda, D3.resto],
      solucion: [
        { texto: 'Faltaban 3/4 del viaje; después de la segunda parada falta 1/3 de eso, 1/4 del viaje.', ecuacion: [fr(1, 3), ' × ', fr(3, 4), ' = ', fr(1, 4), SEP, '2 × 4 = 8'] },
        { texto: ['Las trampas: ', letra('A'), ' toma los 2/3 del total; ', letra('B'), ' olvida el primer tramo; ', letra('C'), ' olvida el segundo; ', letra('D'), ' suma 1/4 + 2/3 como 3/7.'] },
      ],
      respuesta: [letra('E'), ': ', pe('8 h')] },
    { nivel: 3, titulo: 'Pierde dos veces y gana',
      enunciado: 'Juan pierde 1/3 de su dinero; después, 1/4 de lo que le quedaba, y luego gana S/\u00a030. Termina con S/\u00a090. ¿Con cuánto empezó?',
      alternativas: ['S/ 120', 'S/ 180', 'S/ 240', 'S/ 144', 'S/ 60'],
      datos: [D3.queda, D3.resto],
      solucion: [
        { texto: 'Antes de ganar tenía 90 − 30 = 60. Eso es 3/4 de 2/3, la mitad de lo inicial.', ecuacion: [fr(3, 4), ' × ', fr(2, 3), ' = ', fr(1, 2), SEP, '60 × 2 = 120'] },
        { texto: ['Las trampas: ', letra('B'), ' no quita la ganancia; ', letra('C'), ' la suma; ', letra('D'), ' toma el 1/4 del total; ', letra('E'), ' solo quita la ganancia.'] },
      ],
      respuesta: [letra('A'), ': ', pe('S/ 120')] },
    { nivel: 3, titulo: 'Agua y aceite',
      enunciado: 'En un bidón hay agua y aceite. El agua es 1/3 del total más 4 L, y el aceite es 1/2 del total más 1 L. ¿Cuántos litros hay en el bidón?',
      alternativas: ['6 L', '30 L', '25/3 L', '18 L', '5 L'],
      datos: [D3.comun],
      solucion: [
        { texto: '1/3 + 1/2 = 5/6 del total, más 5 L, es todo el bidón: los 5 L son el 1/6 que falta.', ecuacion: [fr(1, 3), ' + ', fr(1, 2), ' = ', fr(5, 6), SEP, '5 × 6 = 30'] },
        { texto: ['Las trampas: ', letra('A'), ' divide 5 entre 5/6; ', letra('C'), ' suma 1/3 + 1/2 como 2/5; ', letra('D'), ' resta el litro del aceite; ', letra('E'), ' cuenta solo los litros sueltos.'] },
      ],
      respuesta: [letra('B'), ': ', pe('30 L')] },
  ];

  const delResto = {
    id: 'del-resto',
    titulo: 'Partes del total y del resto',
    pregunta: '¿Qué cambia si se vende una parte de lo que queda?',
    temas: ['Operaciones y fracción del resto'],
    pieza: QU,
    aprendizaje: 'Partes del mismo total se suman con denominador común. Una parte de lo que queda se multiplica: 1/3 de la mitad es 1/6.',
    actividad: 'Vender parte del queque en la mañana, y en la tarde parte de lo que quedó.',
    // Lee: los dos turnos (1/4 en la mañana, sin decir qué queda al final) y la suma de partes iguales con cuartos. No dice
    // qué parte del queque es lo de la tarde (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'La venta del día', texto: 'La promoción vende su queque en dos turnos. En la mañana vende 1/4 del queque. En la tarde no cuenta sobre el queque entero: vende una parte de lo que quedó.',
          pieza: QU, dibujo: queques([venta(1, 4, 1, 2, { tarde: false })]) },
        { titulo: 'Sumar porciones iguales', texto: 'Con porciones del mismo tamaño, se suman las porciones: 1/4 y 2/4 del queque son 3/4. Si las porciones son distintas, primero se cortan iguales.',
          ecuacion: [fr(1, 4), ' + ', fr(2, 4), ' = ', fr(3, 4)] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir cuánto se vende en cada turno. Mira qué parte del queque entero es lo de la tarde y cuánto queda al final.' },
      ],
    },
    ejemplos: EJEMPLOS_RESTO,
    juega: {
      pieza: QU,
      consigna: 'En la mañana la promoción vende una parte de su queque. En la tarde vende una parte de lo que quedó, no del queque entero.',
      mision: {
        // Una sola manera en la grilla: 2/3 y después 1/4 de lo que quedó (la prueba lo recorre).
        texto: 'Haz que al final quede justo 1/4 del queque.',
        logrado: v => v.m === '2/3' && v.t === '1/4',
        bien: '2/3 en la mañana y 1/4 del resto en la tarde: queda 1/4.',
      },
      voz: 'Lo de la tarde se corta sobre lo que quedó.',
      leyenda: [
        { s: pa('mañana'), t: 'lo vendido en la mañana' },
        { s: pa('tarde'), t: 'rayado: lo vendido en la tarde' },
        { s: pe('queda'), t: 'con borde: lo que queda' },
      ],
      controles: [
        { id: 'm', etiqueta: 'En la mañana se vende', opciones: MANANA.map(x => ({ valor: x, texto: x })) },
        { id: 't', etiqueta: 'En la tarde, de lo que quedó', opciones: TARDE.map(x => ({ valor: x, texto: x })) },
      ],
      dibujo: v => { const [a, b] = deTxt(v.m), [c, d] = deTxt(v.t); return { datos: { bandejas: [venta(a, b, c, d)] }, estado: {} }; },
      lectura: v => {
        const [a, b] = deTxt(v.m), [c, d] = deTxt(v.t), Q = queda3(a, b, c, d);
        return ['Queda ', `${d - c}/${d} de ${b - a}/${b}`, ': ', frP(...Q), ' del queque'];
      },
      minimo: 3,
    },
    predice: {
      pieza: QU,
      pregunta: 'En la mañana se vende 1/2 del queque y en la tarde, 1/3 de lo que quedó. ¿Qué parte del queque queda al final?',
      datos: ['El queque entero vale 1'],
      voz: 'Piensa de qué se saca el tercio de la tarde.',
      opciones: [
        { id: 'c', texto: '1/3 del queque', correcta: true },
        { id: 'total', texto: '1/6 del queque', error: 'AT-RESTO-TOTAL', siFuera: 'Restar lo vendido está bien, pero el 1/3 es de la mitad que quedó, no del queque.' },
        { id: 'ar12', texto: '3/5 del queque', error: 'AR12', siFuera: 'Sumar lo vendido está bien, pero 1/2 + 1/3 no es 2/5: arriba con arriba no se suma.' },
        { id: 'solo', texto: '2/3 del queque', error: 'AT-RESTO-SOLO', siFuera: 'De la mitad queda 2/3, bien. Pero es 2/3 de la mitad, no del queque entero.' },
      ],
      dibujo: { datos: { bandejas: [venta(1, 2, 1, 3, { tarde: false })] }, estado: {} },
      revelar: { datos: { bandejas: [venta(1, 2, 1, 3)] }, estado: {} },
      coincide: 'Coincide: la mitad que quedó se corta en 3; se vende 1 y quedan 2 de esos 6 pedazos, 1/3 del queque.',
      noCoincide: 'Revisemos cortando la mitad que quedó en 3 pedazos.',
    },
    mira: {
      pieza: QU,
      datos: { bandejas: [venta(1, 2, 1, 3, { tarde: false })], pasos: [
        { bandejas: [venta(1, 2, 1, 3, { tarde: false })] },
        { bandejas: [venta(1, 2, 1, 3, { queda: false })] },
        { bandejas: [venta(1, 2, 1, 3)] },
        { bandejas: [venta(1, 2, 1, 3)] },
        { bandejas: [venta(1, 2, 1, 3)] },
      ] },
      voz: 'Mira cómo se corta lo que quedó, no el queque entero.',
      pasos: [
        { estado: { paso: 0 }, texto: 'En la mañana se vende la mitad: queda la otra mitad.', ecuacion: ['1 − ', fr(1, 2), ' = ', frP(1, 2)] },
        { estado: { paso: 1 }, texto: 'Un tercio de la mitad, una fracción de una fracción: 1/6 del queque.', ecuacion: [fr(1, 3), ' × ', fr(1, 2), ' = ', fr(1, 6)] },
        { estado: { paso: 2 }, texto: 'Quedan 2/3 de la mitad: 2 de los 6 pedazos.', ecuacion: [fr(2, 3), ' × ', fr(1, 2), ' = ', fr(2, 6), ' = ', frP(1, 3)] },
        { estado: { paso: 3 }, texto: 'Lo vendido se suma con sextos, no arriba con arriba.', ecuacion: [fr(1, 2), ' + ', fr(1, 6), ' = ', fr(3, 6), ' + ', fr(1, 6), ' = ', fr(4, 6)] },
        { estado: { paso: 4 }, texto: 'Comprueba: lo vendido y lo que queda hacen el queque.', ecuacion: [fr(4, 6), ' + ', fr(2, 6), ' = 1'] },
      ],
    },
    regla: {
      texto: 'Una parte de lo que queda se multiplica por lo que quedaba: 1/3 de la mitad es 1/6. Partes del mismo total se suman con denominador común.',
      ecuacion: [{ llave: [fr(1, 3), ' × ', fr(1, 2), ' = ', fr(1, 6)], nota: 'la tarde: 1/3 de la mitad' }, SEP,
        { llave: [fr(1, 2), ' + ', fr(1, 6), ' = ', fr(3, 6), ' + ', fr(1, 6), ' = ', fr(4, 6)], nota: 'lo vendido en el día' }, SEP,
        { llave: [fr(2, 3), ' × ', fr(1, 2), ' = ', frP(1, 3)], nota: 'lo que queda: 2/3 de la mitad' }],
      condicion: 'las partes son del mismo entero. Arriba con arriba no se suma: 1/2 + 1/6 no es 2/8.',
      voz: 'La tarde se mide sobre lo que quedó.',
      dibujo: { pieza: QU, datos: { bandejas: [venta(1, 2, 1, 3)] }, estado: {} },
    },
    // Así se resuelve: qué parte de lo que quedaba se vendió en la tarde, si se sabe lo que queda al final. «Ahora tú» pide
    // qué queda del queque, lo vendido en total, los kilos que quedan, hacia atrás, grifos y pérdidas con una ganancia.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const [a, b] = r.de(FR3), [c, d] = r.de(FR3);
          if (USADOS3.has(`${a}/${b}-${c}/${d}`)) continue;
          const Q = queda3(a, b, c, d), q1 = red(b - a, b);
          return {
            enunciado: `En la mañana se vende ${a}/${b} de un queque. En la tarde se vende una parte de lo que quedó, y al final queda ${fxr(Q)} del queque. ¿Qué parte de lo que quedaba se vendió en la tarde?`,
            datos: [D3.queda, D3.resto],
            pasos: [
              { tipo: 'pide', texto: 'Piden la parte de lo que quedaba en la mañana, no del queque entero.' },
              { tipo: 'datos', texto: `Después de la mañana quedan ${fxr(q1)} del queque. Al final queda ${fxr(Q)}.` },
              { tipo: 'regla', texto: 'Lo que queda al final es (lo que no se vende en la tarde) × (lo que quedaba).' },
              { tipo: 'cuentas', texto: `Divido lo que queda entre lo que quedaba: es la parte que no se vendió en la tarde.`, ecuacion: [`${fxr(Q)} ÷ ${fxr(q1)} = ${fxr(red(d - c, d))}`, SEP, '1 − ', fr(d - c, d), ' = ', frP(c, d)] },
              { tipo: 'sentido', texto: `Compruebo: ${d - c}/${d} × ${fxr(q1)} = ${fxr(Q)}.` },
            ],
            respuesta: ['En la tarde se vendió ', frP(c, d), ' de lo que quedaba'],
          };
        }
      },
    },
    ahoraTu: {
      voz: '¿Esa parte es del total o de lo que quedó?',
      generar(sem) {
        const r = azar(sem + 29), tipo = sem % 6;
        return conCuatro([casoQueda, casoTotal3, casoKilos, casoAtras, casoGrifos, casoPerdidas][tipo], r);
      },
    },
  };

  // ---------- La división larga, en base 10 o en otra (ideas 4 a 6) ----------
  // División de x entre y en base B: parte entera, cifras, dónde empieza el bloque que se repite (−1 si termina) y los
  // restos, en el orden en que salen. Las cifras de 0 a 9 alcanzan: aquí la base llega a 10.
  function division(x, y, B = 10, tope = 14) {
    const ent = Math.floor(x / y);
    let r = x % y;
    const cifras = [], restos = [], visto = new Map();
    while (r !== 0 && !visto.has(r) && cifras.length < tope) {
      visto.set(r, cifras.length); restos.push(r);
      cifras.push(Math.floor(r * B / y)); r = (r * B) % y;
    }
    return { ent, cifras, restos, inicio: r === 0 ? -1 : visto.has(r) ? visto.get(r) : -2, ultimo: r };
  }
  // El bloque que se repite se escribe varias veces y «…» (decisión 8 de la propuesta): una o dos cifras, tres veces;
  // más, dos veces. «0,333…», «0,272727…», «0,8333…», «0,142857142857…».
  const repite = per => per.repeat(per.length <= 2 ? 3 : 2);
  function decimal(x, y, B = 10) {
    const v = division(x, y, B, 40), ent = String(v.ent);
    if (v.inicio === -1) return v.cifras.length ? `${ent},${v.cifras.join('')}` : ent;
    const ante = v.cifras.slice(0, v.inicio).join(''), per = v.cifras.slice(v.inicio).join('');
    return `${ent},${ante}${repite(per)}…`;
  }
  // Las partes del decimal: { ante, per } (sin la parte entera).
  const partes = (x, y, B = 10) => { const v = division(x, y, B, 40); return v.inicio === -1 ? { ante: v.cifras.join(''), per: '' } : { ante: v.cifras.slice(0, v.inicio).join(''), per: v.cifras.slice(v.inicio).join('') }; };
  // El cuaderno de la división (arit-tabla): cada fila es un paso; el resto en carmín y la cifra que sale en violeta. El
  // resto que vuelve va resaltado.
  // Si un resto vuelve, se escribe una fila más: la del resto que volvió, para que se vea repetido (los dos resaltados).
  // conBase: la columna de la cifra dice la base (idea 6 y la mesa de bases; lector B, 20 nov).
  const tablaDiv = (x, y, B = 10, filasMax = 8, conBase = false) => {
    const v = division(x, y, B, filasMax);
    const restos = v.restos.slice(), cifras = v.cifras.slice();
    if (v.inicio >= 0 && restos.length < filasMax) { restos.push(v.ultimo); cifras.push(Math.floor(v.ultimo * B / y)); }
    const filas = cifras.map((k, i) => [String(i + 1), { t: String(restos[i]), color: 'h', resalta: v.inicio >= 0 && restos[i] === v.ultimo },
      `${restos[i]} × ${B} = ${restos[i] * B}`, { t: String(k), color: 'f' }]);
    const columnas = [{ t: 'n.º' }, { t: 'resto', color: 'h' }, { t: `resto × ${B}` }, { t: conBase ? `cifra en base ${B}` : 'cifra', color: 'f' }];
    // Con la base, sin la columna n.º: así «cifra en base 10» cabe sin apretar las cuentas (arit-tabla reparte 312 de ancho).
    return conBase ? { columnas: columnas.slice(1), filas: filas.map(f => f.slice(1)), filasMax } : { columnas, filas, filasMax };
  };
  const cuaderno = (x, y, B = 10) => ({ pieza: TA, datos: tablaDiv(x, y, B, 8, true), estado: {} });
  const TA = 'arit-tabla', CA = 'arit-calculadora';
  const exp = (n, p) => { let e = 0; while (n % p === 0) { n /= p; e++; } return e; };
  const sin25 = n => { while (n % 2 === 0) n /= 2; while (n % 5 === 0) n /= 5; return n; };
  // El orden de 10 módulo q (q PESI con 10): cuántas cifras tiene el bloque de 1/q.
  const orden10 = q => { if (q === 1) return 0; let x = 10 % q, k = 1; while (x !== 1) { x = x * 10 % q; k++; } return k; };

  // ---------- Idea 4 (rehecha, 19 nov): decimal exacto o periódico; racionales e irracionales ----------
  // Propuesta §1 a §7. Conserva el id `exacto-periodico` (y la mesa `division-base`), con la misma pregunta y la misma
  // correcta (7/40); cambian dos distractores, que el juego ya mostraba. Objeto: la calculadora de doña Juana
  // (arit-calculadora, con el bloque de la coma) en «Lee», y el cuaderno de la división (arit-tabla) en el juego.
  // Cambia: la fracción. · Permanece: el divisor de cada fila. · Progresa: un resto que llega a 0 → uno que vuelve. · Se
  // reserva: 7/40, 5/24, 4/15 y 11/30 (la predicción; el juego llega a 12). · Debe verse: con divisor b hay a lo más
  // b − 1 restos distintos, así que o sale 0 o uno vuelve.
  // No dice «período» ni «periódico puro» o «mixto»: los estrena la idea 5 (aquí, «el bloque que se repite»).
  // Errores (AR11, «más largo es mayor», es de decimales; los demás, hipótesis de aula): AT-PAR cree que un denominador
  // par da exacto · AT-CINCO cree que basta un 5 · AT-DOSYCINCO cree que basta tener el 2 y el 5 ·
  // AT-SUMA-EXP suma los exponentes de 2 y de 5 · AT-MENOR-EXP toma el menor ·
  // AT-CIFRAS-DEN cuenta las cifras del denominador · AT-CREE-PURO cree que se repite desde la coma · AT-BLOQUE da las
  // cifras del bloque · AT-INFINITO cree que todo decimal infinito es irracional · AT-PI cree que 22/7 es π · AT-RAIZ
  // cree que toda raíz es irracional · AT-FACT-K cree que k! da k cifras
  // · AT-CORRIDO cuenta el lugar corrido en uno · AT-PRIMERA-CIFRA da la primera cifra del bloque.
  const D4 = {
    exacto: 'Una fracción irreductible da decimal exacto si su denominador solo tiene los primos 2 y 5',
    otro: 'Si el denominador, ya simplificado, tiene otro primo, un bloque de cifras se repite sin fin',
    cifras: 'Si el denominador solo tiene los primos 2 y 5, las cifras decimales son su mayor exponente',
    antes: 'Cifras no periódicas, entre la coma y el bloque: el mayor exponente de 2 o 5 del denominador',
    racional: 'Todo número racional da un decimal exacto o con un bloque que se repite',
    irracional: 'Un decimal infinito que no repite ningún bloque es irracional, como π o √2',
    fact: 'El factorial es el producto de los enteros desde 1: 5! = 1 × 2 × 3 × 4 × 5',
    lugar: 'En un bloque de L cifras, cada lugar repite al del resto de dividirlo entre L; con resto 0, el último',
  };
  // La lectura y la regla hablan de «el resto que vuelve»: el número del cuaderno que ya había salido.
  const USADOS4 = new Set(['7/40', '5/24', '4/15', '11/30', '3/8', '5/6', '7/20', '6/15', '13/80', '7/12', '2/7', '33/440', '21/56', '1/5', '3/7']);

  // Ahora tú · tipo 0: cuál de cuatro fracciones da decimal exacto (a veces hay que simplificar primero).
  function casoExacto(r) {
    const e = r.de([4, 8, 16, 20, 25, 40, 50, 80, 125]), a = r.ent(1, e - 1);
    if (mcd(a, e) !== 1) return null;
    const p = r.de([3, 7]), trampa = r() < 0.5;
    const buena = trampa ? [a * p, e * p] : [a, e];
    const par = [r.ent(1, 11), 2 ** r.ent(1, 3) * r.de([3, 7, 9])], cinco = [r.ent(1, 11), 5 * r.de([3, 7, 9])], dyc = [r.ent(1, 13), 10 * r.de([3, 7])];
    for (const x of [par, cinco, dyc]) if (mcd(x[0], x[1]) !== 1 || x[0] >= x[1]) return null;
    if (USADOS4.has(fx(buena)) || USADOS4.has(fx(par)) || USADOS4.has(fx(cinco)) || USADOS4.has(fx(dyc))) return null;
    return {
      pregunta: '¿Cuál de estas fracciones da un decimal exacto?',
      datos: [D4.exacto, D4.otro],
      opciones: opciones(fx(buena), [
        { id: 'par', valor: fx(par), error: 'AT-PAR', siFuera: `Un denominador par ayuda, pero no basta: ${par[1]} = ${canon(par[1])}.` },
        { id: 'cinco', valor: fx(cinco), error: 'AT-CINCO', siFuera: `Tener un 5 ayuda, pero ${cinco[1]} = ${canon(cinco[1])}: hay otro primo.` },
        { id: 'dyc', valor: fx(dyc), error: 'AT-DOSYCINCO', siFuera: `Tiene el 2 y el 5, pero también otro primo: ${dyc[1]} = ${canon(dyc[1])}.` },
      ]),
      solucion: { texto: trampa ? `Simplificada, ${fx(buena)} = ${a}/${e}, y ${e} = ${canon(e)}.` : `${e} = ${canon(e)}: solo primos 2 y 5.`, ecuacion: [fr(a, e), ` = ${decimal(a, e)}`] },
    };
  }
  // Ahora tú · tipo 1: cuántas cifras decimales tiene a/(2ᵐ × 5ⁿ).
  function casoCifras(r) {
    const m = r.ent(0, 5), n = r.ent(0, 4), D = 2 ** m * 5 ** n, a = r.ent(1, 9);
    if (m === n || m + n < 2 || mcd(a, D) !== 1 || D > 2000 || USADOS4.has(`${a}/${D}`)) return null;
    return {
      pregunta: `¿Cuántas cifras después de la coma tiene el decimal de ${a}/${D}?`,
      datos: [D4.exacto, D4.cifras],
      opciones: opciones(Math.max(m, n), [
        { id: 'suma', valor: m + n, error: 'AT-SUMA-EXP', siFuera: `Bien ${D} = ${canon(D)}. Pero cada 10 = 2 × 5 usa un 2 y un 5: va el mayor exponente.` },
        { id: 'menor', valor: Math.min(m, n), error: 'AT-MENOR-EXP', siFuera: `Bien mirar los exponentes de ${canon(D)}. Pero hacen falta tantas cifras como el mayor.` },
        { id: 'cifrasD', valor: String(D).length, error: 'AT-CIFRAS-DEN', siFuera: `${D} tiene ${String(D).length} cifras, pero eso no decide: deciden sus primos.` },
      ]),
      solucion: { texto: `${D} = ${canon(D)}: el mayor exponente es ${Math.max(m, n)}.`, ecuacion: [fr(a, D), ` = ${decimal(a, D)}`] },
    };
  }
  // Ahora tú · tipo 2: cuántas cifras hay entre la coma y el bloque que se repite.
  function casoAntes(r) {
    const m = r.ent(0, 4), n = r.ent(0, 2), q = r.de([3, 7, 9, 11]), D = 2 ** m * 5 ** n * q, a = r.ent(1, 20);
    if (m + n === 0 || mcd(a, D) !== 1 || a >= D || D > 1000 || USADOS4.has(`${a}/${D}`)) return null;
    const L = orden10(q);
    return {
      pregunta: `¿Cuántas cifras no periódicas tiene el decimal de ${a}/${D}?`,
      datos: [D4.otro, D4.antes],
      opciones: opciones(Math.max(m, n), [
        { id: 'suma', valor: m + n, error: 'AT-SUMA-EXP', siFuera: `Bien ${D} = ${canon(D)}. Pero cuenta el mayor exponente de 2 o de 5, no la suma.` },
        { id: 'puro', valor: 0, error: 'AT-CREE-PURO', siFuera: `El ${q} hace que se repita, es cierto. Pero el ${canon(2 ** m * 5 ** n)} deja cifras antes del bloque.` },
        { id: 'bloque', valor: L, error: 'AT-BLOQUE', siFuera: `${L} es cuántas cifras tiene el bloque que se repite; se piden las de antes.` },
      ]),
      solucion: { texto: `${D} = ${canon(D)}: el mayor exponente de 2 o de 5 es ${Math.max(m, n)}.`, ecuacion: [fr(a, D), ` = ${decimal(a, D)}`] },
    };
  }
  // Ahora tú · tipo 3: cuál de estos números es irracional.
  function casoIrracional(r) {
    const N = r.de([2, 3, 5, 6, 7, 10, 11]), C = r.de([16, 25, 36, 49, 64, 81]), d = r.ent(1, 8), dd = r.ent(1, 8);
    if (d === dd) return null;
    return {
      pregunta: '¿Cuál de estos números es irracional?',
      datos: [D4.racional, D4.irracional],
      opciones: opciones(`√${N}`, [
        { id: 'infinito', valor: `0,${d}${dd}${d}${dd}${d}${dd}…`, error: 'AT-INFINITO', siFuera: `Es infinito, pero repite el bloque ${d}${dd}: es racional.` },
        { id: 'raiz', valor: `√${C}`, error: 'AT-RAIZ', siFuera: `Tiene raíz, pero √${C} = ${Math.sqrt(C)}: es un entero.` },
        { id: 'pi', valor: '22/7', error: 'AT-PI', siFuera: '22/7 se parece a π, pero es una fracción: es racional.' },
      ]),
      solucion: { texto: `${N} no es un cuadrado: √${N} no repite ningún bloque.`, ecuacion: [`√${N} ≈ ${f(Math.sqrt(N), 4)}…`] },
    };
  }
  // Ahora tú · tipo 4 (San Marcos 2026-I): cifras no periódicas de a/k!.
  function casoFactorial(r) {
    const k = r.ent(5, 10), a = r.de([1, 11, 13, 17, 19, 23]);
    if (k === 6 && a === 1) return null;
    let F = 1; for (let i = 2; i <= k; i++) F *= i;
    const e2 = exp(F, 2), e5 = exp(F, 5);
    return {
      pregunta: `¿Cuántas cifras no periódicas tiene el decimal de ${a}/${k}!?`,
      datos: [D4.fact, D4.antes],
      opciones: opciones(e2, [
        { id: 'suma', valor: e2 + e5, error: 'AT-SUMA-EXP', siFuera: `Bien los exponentes, ${e2} del 2 y ${e5} del 5. Pero va el mayor, no la suma.` },
        { id: 'cinco', valor: e5, error: 'AT-MENOR-EXP', siFuera: `Bien el exponente del 5. Pero el del 2 es mayor: manda ${e2}.` },
        { id: 'k', valor: k, error: 'AT-FACT-K', siFuera: `${k}! no da ${k} cifras: hay que contar cuántas veces entra el 2 y el 5.` },
      ]),
      solucion: { texto: `${k}! = ${canon(F)}. El 2 tiene el mayor exponente.`, ecuacion: [`${k}! = ${F}`] },
    };
  }
  // Ahora tú · tipo 5 (San Marcos 2025-II): la cifra de un lugar lejano de un decimal que se repite desde la coma.
  function casoLugar(r) {
    const q = r.de([7, 13]), a = r.ent(1, q - 1), n = r.ent(40, 130);
    if (USADOS4.has(`${a}/${q}`)) return null;
    const per = partes(a, q).per, L = per.length, i = (n - 1) % L;
    const op = [per[i], per[(i + 1) % L], per[(i + L - 1) % L], per[0]];
    if (new Set(op).size < 4) return null;
    return {
      pregunta: `El decimal de ${a}/${q} es ${decimal(a, q)} ¿Qué cifra ocupa el lugar ${n} después de la coma?`,
      datos: [D4.lugar],
      opciones: opciones(per[i], [
        { id: 'mas', valor: op[1], error: 'AT-CORRIDO', siFuera: `Bien usar el resto de ${n} ÷ ${L}. Pero el lugar ${i + 1} del bloque es el ${per[i]}: te corriste uno.` },
        { id: 'menos', valor: op[2], error: 'AT-CORRIDO', siFuera: `Bien el bloque de ${L} cifras. Pero contaste un lugar menos: el ${i + 1}.° es ${per[i]}.` },
        { id: 'primera', valor: op[3], error: 'AT-PRIMERA-CIFRA', siFuera: `Esa es la primera cifra del bloque. El lugar ${n} es el ${i + 1}.° del bloque.` },
      ]),
      solucion: { texto: `El bloque ${per} tiene ${L} cifras.`, ecuacion: [`${n} = ${L} × ${Math.floor((n - 1) / L)} + ${i + 1}`] },
    };
  }

  // Ejemplos resueltos (idea 4). Cuentas rehechas aparte (cuentas.py, con divisiones largas de Python): 3/8 = 0,375;
  // 5/6 = 0,8333…; 7/20 = 0,35 (2 cifras); 0,454545… = 5/11; 6/15 = 2/5 = 0,4; 13/80 = 0,1625; 7/12 = 0,58333… (2
  // antes del bloque); 2/7: restos 2, 6, 4, 5, 1, 3 y vuelve el 2, 0,285714285714…; 33/440 = 3/40 = 0,075; √9 = 3. Nivel
  // 3: 6! = 720 = 2⁴ × 3² × 5, 4 cifras no periódicas (1/720 = 0,0013888…); 3/7 = 0,428571…, lugar 100: 100 = 6 × 16 +
  // 4, cifra 5 (vecinas 7 y 2, última del bloque 1, primera 4); 21/56 = 3/8 exacta (5/12, 7/30, 4/45, 13/66 no); 1/(2⁵ × 5²)
  // = 1/800 = 0,00125, 5 cifras; 1/600 = 0,001666…: 3 antes del bloque y bloque de 1.
  const EJEMPLOS_DEC = [
    { nivel: 1, titulo: '¿Termina 3/8?',
      enunciado: '¿El decimal de 3/8 es exacto o tiene un bloque que se repite?',
      datos: [D4.exacto],
      solucion: [{ texto: '8 = 2³ solo tiene el primo 2. La división termina.', ecuacion: [fr(3, 8), ' = ', pe('0,375')] }],
      respuesta: ['Exacto: ', pe('0,375')] },
    { nivel: 1, titulo: 'Un denominador con 3',
      enunciado: '¿El decimal de 5/6 es exacto?',
      datos: [D4.exacto, D4.otro],
      solucion: [{ texto: '6 = 2 × 3 tiene el primo 3: un bloque se repite. Al dividir, el resto 2 vuelve a salir.', ecuacion: [fr(5, 6), ' = ', pe('0,8333…')] }],
      respuesta: ['No: ', pe('0,8333…'), ', el 3 se repite'] },
    { nivel: 1, titulo: 'Cuántas cifras',
      enunciado: '¿Cuántas cifras después de la coma tiene el decimal de 7/20?',
      datos: [D4.cifras],
      solucion: [{ texto: '20 = 2² × 5: el mayor exponente es 2.', ecuacion: [fr(7, 20), ' = ', pe('0,35')] }],
      respuesta: ['2 cifras: ', pe('0,35')] },
    { nivel: 1, titulo: '¿Racional?',
      enunciado: '¿Es racional el número 0,454545…, en el que el 45 se repite sin fin?',
      datos: [D4.racional, D4.irracional],
      solucion: [{ texto: 'Repite un bloque, el 45: sale de una fracción. Es 5/11, porque 5 ÷ 11 = 0,454545…' }],
      respuesta: ['Sí, es racional'] },
    { nivel: 1, titulo: 'Simplificar primero',
      enunciado: '¿El decimal de 6/15 es exacto?',
      datos: [D4.exacto],
      solucion: [{ texto: '15 tiene un 3, pero 6/15 se simplifica entre 3: queda 2/5, y 5 sí es de los primos de 10.', ecuacion: [{ frac: [pa(6), ps(15)] }, ' = ', fr(2, 5), ' = ', pe('0,4')] }],
      respuesta: ['Sí: ', pe('0,4')] },
    { nivel: 2, titulo: 'Cifras de 13/80',
      enunciado: '¿Cuántas cifras después de la coma tiene el decimal de 13/80, y cuál es?',
      datos: [D4.exacto, D4.cifras],
      solucion: [
        { texto: '80 = 2⁴ × 5: el mayor exponente es 4.' },
        { texto: 'Para que abajo quede 10 000 = 2⁴ × 5⁴, se multiplica por 5³ = 125.', ecuacion: [fr(13, 80), ' = ', { frac: ['1625', '10 000'] }, ' = ', pe('0,1625')] },
      ],
      respuesta: ['4 cifras: ', pe('0,1625')] },
    { nivel: 2, titulo: 'Antes del bloque',
      enunciado: 'En el decimal de 7/12, ¿cuántas cifras hay entre la coma y el bloque que se repite?',
      datos: [D4.antes],
      solucion: [
        { texto: '12 = 2² × 3: el 3 hace que algo se repita y el 2², que haya 2 cifras antes.' },
        { texto: 'Al dividir, las dos primeras cifras no se repiten; después el resto 4 vuelve siempre.', ecuacion: [fr(7, 12), ' = ', pe('0,58333…')] },
      ],
      respuesta: ['2 cifras: el 5 y el 8'] },
    { nivel: 2, titulo: 'El resto que vuelve',
      enunciado: 'Al dividir 2 entre 7, ¿después de cuántas cifras vuelve a empezar el bloque?',
      datos: [D4.otro],
      solucion: [
        { texto: 'Cada resto por 10, entre 7: la cifra y el resto nuevo. Los restos salen 2, 6, 4, 5, 1, 3, y en el paso siguiente vuelve el 2.',
          ecuacion: ['20 = 2 × 7 + 6', SEP, '60 = 8 × 7 + 4', SEP, '40 = 5 × 7 + 5', SEP, '50 = 7 × 7 + 1', SEP, '10 = 1 × 7 + 3', SEP, '30 = 4 × 7 + 2'] },
        { texto: 'Con divisor 7, los restos solo pueden ser de 1 a 6; aquí salen los 6 antes de repetir.', ecuacion: [fr(2, 7), ' = ', pe('0,285714285714…')] },
      ],
      respuesta: ['Después de 6 cifras: el bloque es 285714'] },
    { nivel: 2, titulo: 'Exacta escondida',
      enunciado: '¿El decimal de 33/440 es exacto?',
      datos: [D4.exacto],
      solucion: [
        { texto: '440 = 2³ × 5 × 11, y 33 = 3 × 11: el 11 se va al simplificar.', ecuacion: [{ frac: [pa(33), ps(440)] }, ' = ', fr(3, 40)] },
        { texto: '40 = 2³ × 5: es exacto, con 3 cifras.', ecuacion: [fr(3, 40), ' = ', pe('0,075')] },
      ],
      respuesta: ['Sí: ', pe('0,075')] },
    { nivel: 2, titulo: 'Tres números',
      enunciado: '¿Cuáles de estos números son irracionales: √9, √10 y 1,010010001…, donde cada vez hay un 0 más?',
      datos: [D4.racional, D4.irracional],
      solucion: [
        { texto: '√9 = 3 es un entero: es racional.' },
        { texto: '10 no es un cuadrado: √10 no repite bloque. En 1,010010001… los ceros crecen: ningún bloque se repite.' },
      ],
      respuesta: ['√10 y 1,010010001…'] },
    { nivel: 3, titulo: 'Con un factorial',
      enunciado: '¿Cuántas cifras no periódicas tiene el decimal de 1/6!?',
      alternativas: ['5', '1', '6', '4', '2'],
      datos: [D4.fact, D4.antes],
      solucion: [
        { texto: '6! = 720 = 2⁴ × 3² × 5. El 3 hace que se repita; el mayor exponente de 2 o de 5 es 4.', ecuacion: [fr(1, 720), ' = ', pe('0,0013888…')] },
        { texto: ['Las trampas: ', letra('A'), ' suma los exponentes, 4 + 1; ', letra('B'), ' toma el del 5; ', letra('C'), ' cree que 6! da 6 cifras; ', letra('E'), ' toma el exponente del 3.'] },
      ],
      respuesta: [letra('D'), ': 4'] },
    { nivel: 3, titulo: 'El lugar 100',
      enunciado: 'El decimal de 3/7 es 0,428571428571… ¿Qué cifra ocupa el lugar 100 después de la coma?',
      alternativas: ['4', '7', '1', '8', '5'],
      datos: [D4.lugar],
      solucion: [
        { texto: 'El bloque 428571 tiene 6 cifras. 100 = 6 × 16 + 4: el lugar 100 es el 4.° del bloque.', ecuacion: ['100 = 6 × 16 + 4'] },
        { texto: ['Las trampas: ', letra('A'), ' es la primera cifra del bloque; ', letra('B'), ' cuenta un lugar de más; ', letra('C'), ' es la última del bloque; ', letra('D'), ' cuenta uno de menos.'] },
      ],
      respuesta: [letra('E'), ': 5'] },
    { nivel: 3, titulo: 'La única exacta',
      enunciado: '¿Cuál de estas fracciones da un decimal exacto?',
      alternativas: ['21/56', '5/12', '7/30', '4/45', '13/66'],
      datos: [D4.exacto, D4.otro],
      solucion: [
        { texto: '21/56 se simplifica entre 7: queda 3/8, y 8 = 2³.', ecuacion: [{ frac: [pa(21), ps(56)] }, ' = ', fr(3, 8), ' = ', pe('0,375')] },
        { texto: ['Las trampas: en ', letra('B'), ', ', letra('C'), ', ', letra('D'), ' y ', letra('E'), ' el denominador simplificado tiene un 3 (y en 66, también un 11), que no es primo de 10.'] },
      ],
      respuesta: [letra('A'), ': 21/56'] },
    { nivel: 3, titulo: 'Cifras de un exacto',
      enunciado: '¿Cuántas cifras después de la coma tiene el decimal de 1/(2⁵ × 5²)?',
      alternativas: ['7', '5', '2', '10', '3'],
      datos: [D4.cifras],
      solucion: [
        { texto: 'El mayor exponente es 5: hace falta 10⁵ = 2⁵ × 5⁵ abajo. Se multiplica arriba y abajo por 5³ = 125.', ecuacion: ['2⁵ × 5² = 800', SEP, fr(1, 800), ' = ', { frac: ['125', '100 000'] }, ' = ', pe('0,00125')] },
        { texto: ['Las trampas: ', letra('A'), ' suma los exponentes; ', letra('C'), ' toma el menor; ', letra('D'), ' los multiplica; ', letra('E'), ' cuenta las cifras de 800.'] },
      ],
      respuesta: [letra('B'), ': 5'] },
    { nivel: 3, titulo: 'Antes y dentro del bloque',
      enunciado: 'El decimal de 1/(2³ × 3 × 5²), ¿cuántas cifras no periódicas y cuántas periódicas tiene?',
      alternativas: ['2 y 1', '3 y 2', '3 y 1', '5 y 1', '1 y 3'],
      datos: [D4.antes, D4.otro],
      solucion: [
        { texto: 'El mayor exponente de 2 o de 5 es 3: tres cifras antes del bloque. El 3 da un bloque de una cifra.', ecuacion: ['2³ × 3 × 5² = 600', SEP, fr(1, 600), ' = ', pe(decimal(1, 600))] },
        { texto: ['Las trampas: ', letra('A'), ' toma el exponente del 5; ', letra('B'), ' cuenta el bloque como 66; ', letra('D'), ' suma los exponentes; ', letra('E'), ' los cambia de lugar.'] },
      ],
      respuesta: [letra('C'), ': 3 y 1'] },
  ];

  const decimales = {
    id: 'exacto-periodico',
    titulo: 'Decimal exacto o periódico',
    pregunta: '¿Cuándo termina el decimal de una fracción?',
    temas: ['Decimales exactos y periódicos', 'Racionales e irracionales'],
    pieza: TA,
    aprendizaje: 'Una fracción irreductible da decimal exacto si su denominador solo tiene los primos 2 y 5; si no, se repite un bloque.',
    actividad: 'Dividir en el cuaderno y ver si el resto llega a 0 o vuelve.',
    // Lee: la calculadora con 1 ÷ 4 y 1 ÷ 3, qué es exacto y qué se repite, y qué mirar. No dice qué denominadores dan
    // exacto (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'La calculadora de doña Juana', texto: 'Doña Juana divide en su calculadora. 1 ÷ 4 da 0,25 y se acaba. 1 ÷ 3 llena la pantalla de treses: esa división no termina nunca.',
          pieza: CA, dibujo: { datos: { casillas: 8, calcs: [{ cuenta: '1 ÷ 4', pantalla: '0,25', rotulo: 'se acaba' }, { cuenta: '1 ÷ 3', pantalla: '0,3333333', rotulo: 'no termina' }] }, estado: {} } },
        { titulo: 'Exacto o con un bloque', texto: 'Si la división termina, el decimal es exacto: 0,25. Si un bloque de cifras se repite sin fin, es periódico: 1/3 = 0,333… Se escribe el bloque varias veces y «…».' },
        { titulo: 'Qué mirar al jugar', texto: ['En el cuaderno de la división, cada fila trae el ', re('resto'), ' y la ', pe('cifra'), ' que sale; la primera fila empieza con el numerador. Sigue los restos: ¿llega a 0, o vuelve uno que ya salió?'] },
      ],
    },
    ejemplos: EJEMPLOS_DEC,
    juega: {
      pieza: TA,
      consigna: 'Doña Juana hace las divisiones a mano, en su cuaderno: cada resto, por 10, da la cifra que sigue.',
      mision: {
        // Una sola manera en la grilla: con numerador 1, de los impares de 3 a 11 solo el 5 termina.
        texto: 'Con numerador 1, busca un denominador impar que dé decimal exacto.',
        logrado: v => v.a === 1 && v.b === 5,
        bien: '1/5 = 0,2: el resto llega a 0 en el primer paso.',
      },
      voz: 'Sigue la columna de los restos.',
      leyenda: [
        { s: re('resto'), t: 'lo que sobra en cada paso' },
        { s: pe('cifra'), t: 'la cifra del decimal que sale' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Numerador', color: 'c-o', min: 1, max: 9, paso: 1, inicio: 1, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'Denominador', color: 'c-i', min: 2, max: 12, paso: 1, inicio: 6, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDiv(v.a, v.b), estado: {} }),
      lectura: v => {
        const d = division(v.a, v.b, 10, 40);
        return [fr(v.a, v.b), ' = ', pe(decimal(v.a, v.b)), d.inicio === -1 ? (v.a % v.b ? ': el resto llega a 0' : ': es un entero') : `: el resto ${d.ultimo} vuelve`];
      },
      minimo: 3,
    },
    predice: {
      pieza: TA,
      pregunta: '¿Cuál de estas fracciones da un decimal exacto?',
      datos: ['40 = 2³ × 5', '24 = 2³ × 3', '15 = 3 × 5', '30 = 2 × 3 × 5'],
      voz: 'Piensa en los primos de cada denominador.',
      opciones: [
        { id: 'c', texto: '7/40', correcta: true },
        { id: 'par', texto: '5/24', error: 'AT-PAR', siFuera: 'Que el denominador sea par ayuda, pero no basta: 24 = 2³ × 3, y el 3 hace que se repita.' },
        { id: 'cinco', texto: '4/15', error: 'AT-CINCO', siFuera: 'Tener un 5 ayuda, pero 15 = 3 × 5: el 3 hace que se repita.' },
        { id: 'dyc', texto: '11/30', error: 'AT-DOSYCINCO', siFuera: 'Tiene el 2 y el 5, pero también un 3: 30 = 2 × 3 × 5.' },
      ],
      dibujo: { datos: { columnas: [{ t: 'fracción' }, { t: 'denominador' }], filas: [['7/40', '2³ × 5'], ['5/24', '2³ × 3'], ['4/15', '3 × 5'], ['11/30', '2 × 3 × 5']], filasMax: 4 }, estado: {} },
      revelar: { datos: { columnas: [{ t: 'fracción' }, { t: 'denominador' }, { t: 'decimal', color: 'f' }], filasMax: 4,
        filas: [['7/40', '2³ × 5', { t: decimal(7, 40), color: 'f', resalta: true }], ['5/24', '2³ × 3', { t: decimal(5, 24), color: 'f' }], ['4/15', '3 × 5', { t: decimal(4, 15), color: 'f' }], ['11/30', '2 × 3 × 5', { t: decimal(11, 30), color: 'f' }]] }, estado: {} },
      coincide: 'Coincide: 40 = 2³ × 5 solo tiene los primos de 10, y 7/40 = 0,175.',
      noCoincide: 'Revisemos los primos de cada denominador.',
    },
    mira: {
      pieza: TA,
      datos: { columnas: [{ t: 'fracción' }, { t: 'denominador' }, { t: 'decimal', color: 'f' }], filasMax: 4,
        filas: [['7/40', '2³ × 5', { t: decimal(7, 40), color: 'f' }], ['5/24', '2³ × 3', { t: decimal(5, 24), color: 'f' }], ['4/15', '3 × 5', { t: decimal(4, 15), color: 'f' }], ['11/30', '2 × 3 × 5', { t: decimal(11, 30), color: 'f' }]] },
      voz: 'Mira los primos de cada denominador.',
      pasos: [
        { estado: { fila: 0 }, texto: '7/40 termina: 40 solo tiene doses y un cinco.', ecuacion: [fr(7, 40), ' = ', { frac: ['175', '1000'] }] },
        { estado: { fila: 1 }, texto: '5/24 tiene un 3 en el denominador: el 3 se repite.', ecuacion: [fr(5, 24), ' = ', pe(decimal(5, 24))] },
        { estado: { fila: 2 }, texto: '4/15 tiene un 5, pero también un 3.', ecuacion: [fr(4, 15), ' = ', pe(decimal(4, 15))] },
        { estado: { fila: 3 }, texto: '11/30 tiene el 2 y el 5, y además el 3.', ecuacion: [fr(11, 30), ' = ', pe(decimal(11, 30))] },
        { estado: {}, texto: 'Solo termina si abajo se puede llegar a 10, 100, 1000…', ecuacion: ['10 = 2 × 5', SEP, '1000 = 2³ × 5³'] },
      ],
    },
    regla: {
      texto: 'Simplificada la fracción, su decimal es exacto si el denominador solo tiene los primos 2 y 5; tiene tantas cifras como el mayor exponente. Si tiene otro primo, es periódico.',
      ecuacion: [fr(7, 40), ' = ', { frac: [pa(7), ps('2³ × 5')] }, ' = ', pe('0,175'), SEP, { llave: [fr(5, 24), ' = ', pe(decimal(5, 24))], nota: '24 = 2³ × 3; la tabla es su división' }],
      condicion: 'la fracción está simplificada: 21/56 = 3/8 es exacta. Un decimal infinito sin bloque que se repita, como π, es irracional.',
      voz: 'Solo los primos de 10 dejan terminar.',
      dibujo: { pieza: TA, datos: tablaDiv(5, 24), estado: {} },
    },
    // Así se resuelve: si una fracción que hay que simplificar da decimal exacto, y cuál es. «Ahora tú» pide cuál de cuatro
    // es exacta, cuántas cifras tiene un exacto, cuántas hay antes del bloque, cuál es irracional, el factorial y el lugar
    // lejano de un bloque.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const e = r.de([4, 5, 8, 20, 25, 40, 50]), a = r.ent(1, e - 1), p = r.de([3, 7, 9, 11]);
          if (mcd(a, e) !== 1 || mcd(a, p) !== 1 || e * p > 600 || USADOS4.has(`${a * p}/${e * p}`)) continue;
          const A = a * p, B = e * p, g = mcd(A, B);
          return {
            enunciado: `¿El decimal de ${A}/${B} es exacto o tiene un bloque que se repite? Escríbelo.`,
            datos: [D4.exacto, D4.otro],
            pasos: [
              { tipo: 'pide', texto: `Piden si la división de ${A} entre ${B} termina, y el decimal.` },
              { tipo: 'datos', texto: `${B} = ${canon(B)} tiene el primo ${factores(p)[0][0]}, pero el numerador también lo tiene.` },
              { tipo: 'regla', texto: 'Lo que decide son los primos del denominador de la fracción ya simplificada.' },
              { tipo: 'cuentas', texto: `Simplifico entre ${g}.`, ecuacion: [{ frac: [pa(A), ps(B)] }, ' = ', fr(a, e), ' = ', pe(decimal(a, e))] },
              { tipo: 'sentido', texto: `${e} = ${canon(e)}: solo primos 2 y 5. Por eso termina, aunque ${B} tuviera otro primo.` },
            ],
            respuesta: ['Es exacto: ', pe(decimal(a, e))],
          };
        }
      },
    },
    ahoraTu: {
      voz: 'Simplifica y mira los primos del denominador.',
      generar(sem) {
        const r = azar(sem + 41), tipo = sem % 6;
        return conCuatro([casoExacto, casoCifras, casoAntes, casoIrracional, casoFactorial, casoLugar][tipo], r);
      },
    },
  };

  // ---------- Idea 5 (rehecha, 19 nov): la fracción generatriz ----------
  // Propuesta §1 a §7. Conserva el id `generatriz`, con otra Predice. Objeto: la calculadora de doña Juana en «Lee» (4 ÷ 9
  // llena la pantalla) y la tabla de x, 10x, 100x… en el juego (arit-tabla). Cambia: el decimal y por cuánto se
  // multiplica. · Permanece: x. · Progresa: colas que no coinciden → colas iguales que se cancelan → un entero. · Se
  // reserva: 0,272727… (la predicción; el juego no tiene el 27). · Debe verse: con las colas alineadas, la resta deja un
  // número sin cola.
  // Errores (hipótesis de aula): AT-CORTAR toma el decimal cortado (27/100) · AT-MIXTO usa la regla de las cifras antes
  // del bloque (27/90) · AT-NUEVES pone un solo 9 por todo el bloque · AT-MIXTO-COMO-PURO trata un mixto como si se
  // repitiera desde la coma · AT-SIN-CERO olvida el 0 de la cifra de antes · AT-CEROS pone un cero de más o de menos ·
  // AT-NUEVES-EXACTO usa nueves en un decimal que termina · AR12 suma numeradores y denominadores · AT-BASE toma el
  // porcentaje sobre lo que queda · AT-RESPONDE-OTRA responde otra cantidad · AT-RESTA-PARTE resta la parte de lo que
  // queda · AT-INVIERTE toma lo que queda como la parte · AT-BLOQUE-MAL toma otro bloque.
  const D5 = {
    alinear: 'Por 10, 100 o 1000 (un cero por cifra del bloque), x y la copia tienen la misma cola',
    puro: 'Sin cifras antes del bloque: x = el bloque ÷ tantos 9 como cifras tiene el bloque',
    mixto: 'Con cifras antes del bloque: x = (todo hasta el bloque − lo de antes) ÷ (nueves del bloque y ceros de antes)',
    exacto: 'Un decimal exacto es una fracción con 10, 100, 1000… abajo, según sus cifras',
    simp: D1.mcd,
    entero: 'Con parte entera, «todo hasta el bloque» y «lo de antes» la llevan delante: en 2,1333…, 213 y 21',
    por: '1 % es 1/100',
    comun: D3.comun,
  };
  // La generatriz de 0,(ante)(per)(per)…: [numerador, denominador] sin simplificar.
  const genDe = (ante, per) => [Number(ante + per) - Number(ante || '0'), Number('9'.repeat(per.length) + '0'.repeat(ante.length))];
  const escr = (ante, per, ent = '0') => `${ent},${ante}${repite(per)}…`;
  // Los decimales del juego (ninguno es el de la predicción, 0,272727…).
  const X5 = [['0,333…', 1, 3], ['0,454545…', 5, 11], ['0,123123…', 41, 333], ['0,8333…', 5, 6], ['0,1666…', 1, 6]];
  const tablaGen = (p, q, m, o = {}) => {
    const d = red((m - 1) * p, q), entero = d[1] === 1;
    const filas = [[{ t: `${m}x` }, decimal(m * p, q)], [{ t: 'x' }, decimal(p, q)],
      [{ t: `${m}x − x` }, o.sinResta ? '' : { t: decimal((m - 1) * p, q), color: entero ? 'f' : null, resalta: entero }]];
    return { columnas: [{ t: '' }, { t: 'valor' }], filas: o.soloX ? [filas[1]] : filas, filasMax: 3, cabeza: true };
  };
  const USADOS5 = new Set(['27', '7', '36', '45', '1-6', '135', '2-45', '12-7', '3', '6', '333', '9']);

  // Ahora tú · tipo 0: la generatriz de un decimal que se repite desde la coma.
  function casoPuro(r) {
    const L = r.ent(1, 3), per = String(r.ent(L === 1 ? 1 : 10 ** (L - 1), 10 ** L - 2)).padStart(L, '0');
    if (/^(\d)\1+$/.test(per) && L > 1 || USADOS5.has(per)) return null;
    const [n, d] = genDe('', per), G = red(n, d);
    return {
      pregunta: `¿Qué fracción irreductible es ${escr('', per)}?`,
      datos: [D5.alinear, D5.puro, D5.simp],
      opciones: opciones(fxr(G), [
        { id: 'cortar', valor: fxr(red(Number(per), 10 ** L)), error: 'AT-CORTAR', siFuera: `Esa fracción da 0,${per}, que termina. Pero el bloque sigue sin fin.` },
        { id: 'mixto', valor: fxr(red(Number(per), Number('9'.repeat(Math.max(1, L - 1)) + '0'))), error: 'AT-MIXTO', siFuera: 'Esa regla, con un 0 abajo, es para cifras antes del bloque. Aquí el bloque empieza en la coma.' },
        L > 1 ? { id: 'nueves', valor: fxr(red(Number(per), 9)), error: 'AT-NUEVES', siFuera: `Bien poner nueves abajo. Pero va un 9 por cada cifra del bloque: ${'9'.repeat(L)}.` }
          : { id: 'diez', valor: fxr(red(Number(per), 99)), error: 'AT-NUEVES', siFuera: `El bloque tiene una sola cifra: va un solo 9, no 99.` },
      ]),
      solucion: { texto: `Por ${10 ** L}, la cola queda igual; al restar queda ${'9'.repeat(L)}x = ${Number(per)}.`, ecuacion: [{ frac: [pa(Number(per)), ps(d)] }, ' = ', frP(...G)] },
    };
  }
  // Ahora tú · tipo 1: la generatriz con una cifra antes del bloque.
  function casoMixtoG(r) {
    const ante = String(r.ent(1, 9)), L = r.ent(1, 2), per = String(r.ent(L === 1 ? 1 : 10, L === 1 ? 9 : 98));
    if (/^9+$/.test(per) || per[per.length - 1] === ante && L === 1 || (L === 2 && per[0] === per[1]) || per.endsWith(ante) || USADOS5.has(`${ante}-${per}`)) return null;
    const [n, d] = genDe(ante, per), G = red(n, d);
    return {
      pregunta: `¿Qué fracción irreductible es ${escr(ante, per)}?`,
      datos: [D5.alinear, D5.mixto, D5.simp],
      opciones: opciones(fxr(G), [
        { id: 'puro', valor: fxr(red(Number(ante + per), Number('9'.repeat(L + 1)))), error: 'AT-MIXTO-COMO-PURO', siFuera: `El ${ante} no se repite: no es parte del bloque. Se resta y lleva un 0 abajo.` },
        { id: 'cero', valor: fxr(red(n, Number('9'.repeat(L)))), error: 'AT-SIN-CERO', siFuera: `Bien restar ${Number(ante)}. Pero la cifra de antes pone un 0 abajo: ${d}.` },
        { id: 'cortar', valor: fxr(red(Number(ante + per), 10 ** (L + 1))), error: 'AT-CORTAR', siFuera: 'Esa fracción termina; el bloque sigue sin fin.' },
      ]),
      solucion: { texto: `Todo hasta el bloque, ${ante}${per}, menos lo de antes, ${ante}.`, ecuacion: [{ frac: [[pa(Number(ante + per)), ` − ${ante}`], ps(d)] }, ' = ', { frac: [pa(n), ps(d)] }, ' = ', frP(...G)] },
    };
  }
  // Ahora tú · tipo 2: un decimal exacto como fracción irreductible.
  function casoExactoF(r) {
    const k = r.ent(2, 3), n = r.ent(10 ** (k - 1), 10 ** k - 1);
    if (n % 10 === 0 || red(n, 10 ** k)[1] === 10 ** k) return null;
    const s = `0,${String(n).padStart(k, '0')}`;
    if (['0,375', '0,45', '0,125'].includes(s)) return null;
    return {
      pregunta: `¿Qué fracción irreductible es ${s}?`,
      datos: [D5.exacto, D5.simp],
      opciones: opciones(fxr(red(n, 10 ** k)), [
        { id: 'menos', valor: fxr(red(n, 10 ** (k - 1))), error: 'AT-CEROS', siFuera: `${s} tiene ${k} cifras después de la coma: van ${k} ceros abajo.` },
        { id: 'nueves', valor: fxr(red(n, 10 ** k - 1)), error: 'AT-NUEVES-EXACTO', siFuera: 'Los nueves son para un bloque que se repite; este decimal termina.' },
        { id: 'mas', valor: fxr(red(n, 10 ** (k + 1))), error: 'AT-CEROS', siFuera: `Un cero de más: ${s} tiene ${k} cifras, no ${k + 1}.` },
      ]),
      solucion: { texto: `${k} cifras: ${10 ** k} abajo, y se simplifica.`, ecuacion: [{ frac: [pa(n), ps(10 ** k)] }, ' = ', frP(...red(n, 10 ** k))] },
    };
  }
  // Ahora tú · tipo 3: la suma de dos decimales que se repiten.
  function casoSumaP(r) {
    const p1 = r.ent(1, 8), per2 = String(r.ent(10, 98));
    if (per2[0] === per2[1]) return null;
    const A = red(p1, 9), Bf = red(Number(per2), 99), S = suma(...A, ...Bf);
    return {
      pregunta: `¿Qué fracción irreductible es ${escr('', String(p1))} + ${escr('', per2)}?`,
      datos: [D5.puro, D5.comun],
      opciones: opciones(fxr(S), [
        { id: 'cortar', valor: fxr(red(10 * p1 + Number(per2), 100)), error: 'AT-CORTAR', siFuera: 'Sumar cortando las colas da un decimal que termina; las colas siguen sin fin.' },
        { id: 'ar12', valor: txt(A[0] + Bf[0], A[1] + Bf[1]), error: 'AR12', siFuera: `Bien las dos generatrices. Pero se suman con un denominador común, no arriba con arriba.` },
        { id: 'mixto', valor: fxr(suma(...A, ...red(Number(per2), 90))), error: 'AT-MIXTO', siFuera: `${per2} se repite desde la coma: va sobre 99, no sobre 90.` },
      ]),
      solucion: { texto: `Cada una a fracción y se suman con denominador común.`, ecuacion: [fr(...A), ' + ', fr(...Bf), ' = ', frP(...S)] },
    };
  }
  // Ahora tú · tipo 4 (San Marcos 2021): un porcentaje que se repite.
  const PCT = [['8,333…', 1, 12], ['16,666…', 1, 6], ['33,333…', 1, 3], ['58,333…', 7, 12], ['66,666…', 2, 3], ['83,333…', 5, 6], ['91,666…', 11, 12], ['6,666…', 1, 15], ['13,333…', 2, 15], ['26,666…', 4, 15], ['11,111…', 1, 9], ['22,222…', 2, 9], ['44,444…', 4, 9]];
  function casoPorciento(r) {
    const [pc, a, b] = r.de(PCT), S = b * r.ent(10, 60) * 10, gasto = S * a / b, Rq = S - gasto;
    if (pc === '16,666…' && Rq === 1500) return null;
    return {
      pregunta: `Ana gasta el ${pc} % de su sueldo en el alquiler y le quedan S/ ${Rq}. ¿Cuál es su sueldo?`,
      datos: [D5.por, D5.mixto, D5.simp],
      opciones: opciones(S, [
        { id: 'gasto', valor: gasto, error: 'AT-RESPONDE-OTRA', siFuera: `S/ ${gasto} es el alquiler: ${a}/${b} del sueldo. Se pide el sueldo entero.` },
        { id: 'base', valor: Number.isInteger(Rq * (b + a) / b) ? Rq * (b + a) / b : null, error: 'AT-BASE', siFuera: `Bien ${a}/${b}. Pero es del sueldo, no de lo que le quedó: lo que queda es ${b - a}/${b}.` },
        { id: 'resta', valor: Number.isInteger(Rq * (b - a) / b) ? Rq * (b - a) / b : null, error: 'AT-RESTA-PARTE', siFuera: `Al sueldo le quitas el alquiler, no a lo que queda: el sueldo es mayor que S/ ${Rq}.` },
        { id: 'invierte', valor: Number.isInteger(Rq * b / a) ? Rq * b / a : null, error: 'AT-INVIERTE', siFuera: `S/ ${Rq} es lo que queda, ${b - a}/${b} del sueldo, no ${a}/${b}.` },
      ], x => `S/ ${f(x, 0)}`),
      solucion: { texto: `${pc} % = ${a}/${b}: le queda ${b - a}/${b} del sueldo.`, ecuacion: [`S × ${b - a}/${b} = ${Rq}`, SEP, 'S = ', pe(`S/ ${S}`)] },
    };
  }
  // Ahora tú · tipo 5 (nivel examen): el producto de un decimal que se repite por uno exacto.
  function casoProducto(r) {
    const [p, q] = r.de([[5, 6], [1, 6], [1, 3], [2, 3], [1, 11], [5, 12], [7, 12]]), xs = decimal(p, q);
    const [ys, u, w] = r.de([['1,2', 6, 5], ['0,6', 3, 5], ['1,5', 3, 2], ['2,4', 12, 5], ['0,75', 3, 4], ['1,25', 5, 4]]);
    if (xs === '0,8333…' && ys === '1,2') return null;   // el ejemplo «Un producto»
    const P = red(p * u, q * w), pt = partes(p, q), cort = red(Number((pt.ante + pt.per.repeat(3)).slice(0, 2)) * u, 100 * w);   // cortado en dos cifras: 0,666… → 0,66 (auditoría, 20 nov)
    const [gn, gd] = pt.ante ? [Number(pt.ante + pt.per), Number('9'.repeat(pt.ante.length + pt.per.length))] : [Number(pt.per), Number('9'.repeat(pt.per.length)) * 10];
    return {
      pregunta: `¿Qué fracción irreductible es ${xs} × ${ys}?`,
      datos: [D5.puro, D5.mixto, D5.exacto],
      opciones: opciones(fxr(P), [
        { id: 'cortar', valor: fxr(cort), error: 'AT-CORTAR', siFuera: `Cortar ${xs} deja un decimal que termina; la cola sigue sin fin.` },
        { id: 'regla', valor: fxr(red(gn * u, gd * w)), error: pt.ante ? 'AT-MIXTO-COMO-PURO' : 'AT-MIXTO', siFuera: pt.ante ? 'Bien los nueves, pero la cifra de antes no se repite: se resta y lleva un 0.' : 'Ese 0 abajo es para cifras antes del bloque; aquí empieza en la coma.' },
        { id: 'solo', valor: fxr(red(p, q)), error: 'AT-RESPONDE-OTRA', siFuera: `Bien la generatriz de ${xs}, ${p}/${q}. Falta multiplicarla por ${ys}.` },
      ]),
      solucion: { texto: `${xs} = ${p}/${q} y ${ys} = ${u}/${w}.`, ecuacion: [fr(p, q), ' × ', fr(u, w), ' = ', frP(...P)] },
    };
  }

  // Ejemplos resueltos (idea 5). Cuentas rehechas aparte (cuentas.py, con Fraction y las generatrices por la resta de
  // colas): 0,777… = 7/9; 0,363636… = 4/11; 0,45 = 9/20; 0,1666… = 15/90 = 1/6; 0,999… = 1; 0,135135… = 5/37;
  // 0,2454545… = 243/990 = 27/110; 1,333… = 4/3; 0,333… + 0,666… = 1; 0,12777… = 115/900 = 23/180. Nivel 3: 16,666… % = 1/6,
  // quedan S/ 1500 → S/ 1800 (alquiler 300; sobre lo que queda 1750; 1500 − 250 = 1250; 1500 × 6 = 9000); 0,454545… +
  // 0,1666… = 5/11 + 1/6 = 41/66 (cortando 61/100; AR12 6/17; solo la primera 45/99; 16/99 en vez de 1/6: 61/99); 0,8333… ×
  // 1,2 = 1 (0,83 × 1,2 = 0,996; 83/90 × 6/5 = 83/75); 2,1363636… = (2136 − 21)/990 = 47/22 (cortado 267/125; como si se
  // repitiera desde la coma 2134/999; un cero de más 47/220; con el bloque 13 desde la coma 211/99); 0,375 = 3/8, 3 + 8 = 11.
  const EJEMPLOS_GEN = [
    { nivel: 1, titulo: 'Un bloque de una cifra',
      enunciado: '¿Qué fracción es 0,777…?',
      datos: [D5.puro],
      solucion: [{ texto: 'El bloque es 7, de una cifra: va sobre un 9. Por 10 la cola queda igual: 10x − x = 7.', ecuacion: ['9x = 7', SEP, 'x = ', frP(7, 9)] }],
      respuesta: [frP(7, 9)] },
    { nivel: 1, titulo: 'Un bloque de dos cifras',
      enunciado: '¿Qué fracción irreductible es 0,363636…?',
      datos: [D5.puro, D5.simp],
      solucion: [{ texto: 'El bloque 36 tiene dos cifras: va sobre 99, y se simplifica entre 9.', ecuacion: [{ frac: [pa(36), ps(99)] }, ' = ', frP(4, 11)] }],
      respuesta: [frP(4, 11)] },
    { nivel: 1, titulo: 'Un decimal exacto',
      enunciado: '¿Qué fracción irreductible es 0,45?',
      datos: [D5.exacto, D5.simp],
      solucion: [{ texto: 'Dos cifras después de la coma: 100 abajo. Se simplifica entre 5.', ecuacion: [{ frac: [pa(45), ps(100)] }, ' = ', frP(9, 20)] }],
      respuesta: [frP(9, 20)] },
    { nivel: 1, titulo: 'Una cifra antes del bloque',
      enunciado: '¿Qué fracción irreductible es 0,1666…?',
      datos: [D5.mixto, D5.simp],
      solucion: [{ texto: 'Todo hasta el bloque, 16, menos lo de antes, 1. Abajo, un 9 por el bloque y un 0 por la cifra de antes.', ecuacion: [{ frac: [[pa(16), ' − 1'], ps(90)] }, ' = ', { frac: [pa(15), ps(90)] }, ' = ', frP(1, 6)] }],
      respuesta: [frP(1, 6)] },
    { nivel: 1, titulo: '¿Cuánto es 0,999…?',
      enunciado: '¿Qué número es 0,999…, con el 9 que se repite sin fin?',
      datos: [D5.puro],
      solucion: [{ texto: 'El bloque es 9: va sobre un 9.', ecuacion: [{ frac: [pa(9), ps(9)] }, ' = 1'] }],
      respuesta: ['Es ', pe('1'), ': 0,999… y 1 son el mismo número'] },
    { nivel: 2, titulo: 'Un bloque de tres cifras',
      enunciado: '¿Qué fracción irreductible es 0,135135…?',
      datos: [D5.puro, D5.simp],
      solucion: [
        { texto: 'Por 1000 la cola queda igual: 1000x − x = 135.', ecuacion: ['999x = 135'] },
        { texto: 'Se simplifica entre 27.', ecuacion: [{ frac: [pa(135), ps(999)] }, ' = ', frP(5, 37)] },
      ],
      respuesta: [frP(5, 37)] },
    { nivel: 2, titulo: 'Mixto con bloque de dos',
      enunciado: '¿Qué fracción irreductible es 0,2454545…?',
      datos: [D5.mixto, D5.simp],
      solucion: [
        { texto: 'Antes del bloque está el 2; el bloque es 45. Arriba, 245 − 2; abajo, 99 y un 0.', ecuacion: [{ frac: [[pa(245), ' − 2'], ps(990)] }, ' = ', { frac: [pa(243), ps(990)] }] },
        { texto: 'Se simplifica entre 9.', ecuacion: [{ frac: [pa(243), ps(990)] }, ' = ', frP(27, 110)] },
      ],
      respuesta: [frP(27, 110)] },
    { nivel: 2, titulo: 'Con parte entera',
      enunciado: '¿Qué fracción es 1,333…?',
      datos: [D5.puro, D3.comun],
      solucion: [
        { texto: '1,333… es 1 más 0,333…, y 0,333… = 3/9 = 1/3.' },
        { texto: 'Sumo con tercios.', ecuacion: ['1 + ', fr(1, 3), ' = ', fr(3, 3), ' + ', fr(1, 3), ' = ', frP(4, 3)] },
      ],
      respuesta: [frP(4, 3)] },
    { nivel: 2, titulo: 'Dos colas que se completan',
      enunciado: '¿Cuánto es 0,333… + 0,666…?',
      datos: [D5.puro, D3.comun],
      solucion: [
        { texto: 'Cada una a fracción: 3/9 y 6/9.', ecuacion: [fr(3, 9), ' + ', fr(6, 9), ' = ', fr(9, 9)] },
        { texto: 'Da justo 1: igual que 0,999…' },
      ],
      respuesta: [pe('1')] },
    { nivel: 2, titulo: 'Dos cifras antes',
      enunciado: '¿Qué fracción irreductible es 0,12777…?',
      datos: [D5.mixto, D5.simp],
      solucion: [
        { texto: 'Antes del bloque: 12. Bloque: 7. Arriba, 127 − 12; abajo, un 9 y dos ceros.', ecuacion: [{ frac: [[pa(127), ' − 12'], ps(900)] }, ' = ', { frac: [pa(115), ps(900)] }] },
        { texto: 'Se simplifica entre 5.', ecuacion: [{ frac: [pa(115), ps(900)] }, ' = ', frP(23, 180)] },
      ],
      respuesta: [frP(23, 180)] },
    { nivel: 3, titulo: 'Un porcentaje que se repite',
      enunciado: 'Ana gasta el 16,666… % de su sueldo en el alquiler y le quedan S/\u00a01500. ¿Cuál es su sueldo?',
      alternativas: ['S/ 300', 'S/ 1750', 'S/ 1250', 'S/ 9000', 'S/ 1800'],
      datos: [D5.por, D5.mixto],
      solucion: [
        { texto: '0,1666… = (16 − 1)/90 = 1/6: gasta 1/6 y le quedan 5/6 del sueldo.', ecuacion: ['S/ 1500 ÷ 5 × 6 = S/ 1800'] },
        { texto: ['Las trampas: ', letra('A'), ' es el alquiler; ', letra('B'), ' toma 1/6 de lo que queda; ', letra('C'), ' resta 1/6 de 1500; ', letra('D'), ' toma 1500 como 1/6.'] },
      ],
      respuesta: [letra('E'), ': ', pe('S/ 1800')] },
    { nivel: 3, titulo: 'Sumar dos colas',
      enunciado: '¿Qué fracción irreductible es 0,454545… + 0,1666…?',
      alternativas: ['41/66', '61/100', '6/17', '45/99', '61/99'],
      datos: [D5.puro, D5.mixto, D3.comun],
      solucion: [
        { texto: '0,454545… = 45/99 = 5/11 y 0,1666… = 1/6. Con 66 abajo:', ecuacion: [fr(5, 11), ' + ', fr(1, 6), ' = ', fr(30, 66), ' + ', fr(11, 66), ' = ', frP(41, 66)] },
        { texto: ['Las trampas: ', letra('B'), ' corta las colas; ', letra('C'), ' suma 5/11 y 1/6 arriba con arriba; ', letra('D'), ' es solo la primera; ', letra('E'), ' toma 0,1666… como 16/99.'] },
      ],
      respuesta: [letra('A'), ': ', frP(41, 66)] },
    { nivel: 3, titulo: 'Un producto',
      enunciado: '¿Cuánto es 0,8333… × 1,2?',
      alternativas: ['0,996', '1', '83/75', '5/6', '6/5'],
      datos: [D5.mixto, D5.exacto],
      solucion: [
        { texto: '0,8333… = (83 − 8)/90 = 5/6 y 1,2 = 12/10 = 6/5.', ecuacion: [fr(5, 6), ' × ', fr(6, 5), ' = ', fr(30, 30), ' = 1'] },
        { texto: ['Las trampas: ', letra('A'), ' corta en 0,83; ', letra('C'), ' olvida restar el 8; ', letra('D'), ' y ', letra('E'), ' son los factores, sin multiplicar.'] },
      ],
      respuesta: [letra('B'), ': ', pe('1')] },
    { nivel: 3, titulo: 'Con entero y cifra antes',
      enunciado: '¿Qué fracción irreductible es 2,1363636…?',
      alternativas: ['267/125', '2134/999', '47/22', '47/220', '211/99'],
      datos: [D5.mixto, D5.simp],
      solucion: [
        { texto: 'El bloque 36 empieza después del 1. Por 10, la coma queda antes del bloque: 21,363636…; por 1000, después de un bloque: 2136,363636…', ecuacion: ['1000x − 10x = 2136 − 21 = 2115', SEP, '990x = 2115'] },
        { texto: 'Despejo x y simplifico entre 45, el MCD de 2115 y 990.', ecuacion: [{ frac: [pa('2115'), ps(990)] }, ' = ', frP(47, 22)] },
        { texto: ['Las trampas: ', letra('A'), ' corta en 2,136; ', letra('B'), ' cree que el bloque empieza en la coma; ', letra('D'), ' pone un 0 de más; ', letra('E'), ' toma el bloque 13.'] },
      ],
      respuesta: [letra('C'), ': ', frP(47, 22)] },
    { nivel: 3, titulo: 'Exacto y sus términos',
      enunciado: 'La fracción irreductible a/b es igual a 0,375. ¿Cuánto vale a + b?',
      alternativas: ['375', '1375', '8', '11', '3'],
      datos: [D5.exacto, D5.simp],
      solucion: [
        { texto: '0,375 = 375/1000, y entre 125 queda 3/8.', ecuacion: [{ frac: [pa(375), ps(1000)] }, ' = ', frP(3, 8), SEP, '3 + 8 = 11'] },
        { texto: ['Las trampas: ', letra('A'), ' es el numerador sin simplificar; ', letra('B'), ' suma 375 + 1000; ', letra('C'), ' es b; ', letra('E'), ' es a.'] },
      ],
      respuesta: [letra('D'), ': 11'] },
  ];

  const genIdea = {
    id: 'generatriz',
    titulo: 'La fracción generatriz',
    pregunta: '¿De qué fracción sale un decimal periódico?',
    temas: ['Fracción generatriz'],
    pieza: TA,
    aprendizaje: 'Se multiplica por 10, 100 o 1000 hasta alinear las colas y se resta: las colas se cancelan y queda la fracción.',
    actividad: 'Multiplicar un decimal por 10, 100 o 1000 y restarle el mismo decimal.',
    // Lee: la calculadora con 4 ÷ 9, puro y mixto con 0,4545… y 0,8333…, y qué mirar. No dice por cuánto se multiplica ni
    // qué fracción sale (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Del decimal a la fracción', texto: 'Doña Juana divide 4 ÷ 9 y la calculadora muestra 0,4444444. El 4 sigue sin fin, aunque la pantalla se acabe. Esta idea va al revés: del decimal a su fracción.',
          pieza: CA, dibujo: { datos: { casillas: 8, calcs: [{ cuenta: '4 ÷ 9', pantalla: '0,4444444', rotulo: 'sigue sin fin' }] }, estado: {} } },
        { titulo: 'Puro y mixto', texto: 'El bloque que se repite se llama período. En 0,454545… empieza justo después de la coma: es periódico puro. En 0,8333… hay un 8 antes: es periódico mixto.' },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego, x se multiplica por 10, 100 o 1000. Pon las dos filas una sobre otra y mira qué queda al restarlas: ¿se va la cola?' },
      ],
    },
    ejemplos: EJEMPLOS_GEN,
    juega: {
      pieza: TA,
      consigna: 'Para volver de un decimal a su fracción, se le resta una copia corrida: si las colas coinciden, se cancelan.',
      mision: {
        // Una sola manera en la grilla: para 0,123123…, solo 1000 alinea la cola (10 y 100 la dejan).
        texto: 'Para x = 0,123123…, busca el número que deja un entero al restar x.',
        logrado: v => v.x === '0,123123…' && v.m === 1000,
        bien: '1000x − x = 123: el bloque tiene 3 cifras y la coma salta 3 lugares.',
      },
      voz: 'Mira si las colas quedan una debajo de otra.',
      leyenda: [
        { s: 'x', t: 'el decimal que se repite' },
        { s: pe('entero'), t: 'lo que queda si las colas se cancelan' },
      ],
      controles: [
        { id: 'x', etiqueta: 'x', opciones: X5.map(([t]) => ({ valor: t, texto: t })) },
        { id: 'm', etiqueta: 'Multiplicar por', opciones: [10, 100, 1000].map(m => ({ valor: m, texto: String(m) })) },
      ],
      dibujo: v => { const [, p, q] = X5.find(z => z[0] === v.x); return { datos: tablaGen(p, q, v.m), estado: {} }; },
      lectura: v => {
        const [, p, q] = X5.find(z => z[0] === v.x), d = red((v.m - 1) * p, q), dd = division((v.m - 1) * p, q, 10, 40);
        // Con el despeje de x (lector B, 20 nov): de «9x = 3» a x = 3/9 = 1/3.
        if (d[1] === 1) return [`${v.m}x − x = `, pe(d[0]), `: sin cola; x = ${d[0]}/${v.m - 1}${d[0] !== p || v.m - 1 !== q ? ` = ${txt(p, q)}` : ''}`];
        return [`${v.m}x − x = ${decimal((v.m - 1) * p, q)}`, dd.inicio === -1 ? ': la cola se fue' : ': la cola no se va'];
      },
      minimo: 3,
    },
    predice: {
      pieza: TA,
      pregunta: 'x = 0,272727…, con el bloque 27 que se repite sin fin. ¿Qué fracción es x?',
      // Un valor que no empuja a una trampa (antes, «0,27 = 27/100» llevaba a la C; lector B, 20 nov).
      datos: ['Por 100, la coma se corre dos lugares: 100 × 0,35 = 35'],
      voz: 'Piensa qué pasa si corres la coma.',
      opciones: [
        { id: 'c', texto: '3/11', correcta: true },
        { id: 'cortar', texto: '27/100', error: 'AT-CORTAR', siFuera: '27/100 = 0,27 termina: sería cierto si el decimal se cortara. Pero sigue.' },
        { id: 'mixto', texto: '3/10', error: 'AT-MIXTO', siFuera: '3/10 = 27/90: los ceros abajo son para cifras antes del bloque, y aquí no hay.' },
        { id: 'nueves', texto: '3', error: 'AT-NUEVES', siFuera: 'Eso es 27/9: un 9 sirve para un bloque de una cifra; el 27 tiene dos.' },
      ],
      dibujo: { datos: tablaGen(3, 11, 100, { soloX: true }), estado: {} },
      revelar: { datos: tablaGen(3, 11, 100), estado: {} },
      coincide: 'Coincide: 100x − x = 27, así que x = 27/99 = 3/11.',
      noCoincide: 'Revisemos multiplicando por 100 y restando.',
    },
    mira: {
      pieza: TA,
      datos: tablaGen(3, 11, 100),
      voz: 'Corre la coma y resta.',
      pasos: [
        { estado: { fila: 1 }, texto: 'x = 0,272727…: el bloque 27 tiene 2 cifras.', ecuacion: ['x = 0,272727…'] },
        { estado: { fila: 0 }, texto: 'Por 100, la coma salta 2 lugares y la cola queda igual.', ecuacion: ['100x = 27,272727…'] },
        { estado: { fila: 2 }, texto: 'Al restar, las colas se cancelan: queda un entero.', ecuacion: ['100x − x = 99x = 27'] },
        { estado: { fila: 2 }, texto: 'Se despeja x y se simplifica entre 9.', ecuacion: ['x = ', { frac: [pa(27), ps(99)] }, ' = ', frP(3, 11)] },
        { estado: {}, texto: 'Con una cifra antes del bloque, se resta 10x.', ecuacion: ['0,8333… = ', { frac: [[pa(83), ' − 8'], ps(90)] }, ' = ', frP(5, 6)] },
      ],
    },
    regla: {
      texto: 'Se multiplica x hasta alinear las colas y se resta: quedan enteros. Va un 9 por cada cifra del bloque y un 0 por cada cifra antes del bloque.',
      ecuacion: ['0,272727… = ', { frac: [pa(27), ps(99)] }, ' = ', frP(3, 11), SEP, { llave: ['0,8333… = ', { frac: [[pa(83), ' − 8'], ps(90)] }], nota: 'un 0 por el 8' }, ' = ', frP(5, 6)],
      condicion: 'x tiene un bloque que se repite sin fin: su período. Así, 0,999… = 9/9 = 1.',
      voz: 'Alinea las colas y resta.',
    },
    // Así se resuelve: la generatriz de un decimal con parte entera y una cifra antes del bloque. «Ahora tú» pide la de un
    // decimal que se repite desde la coma, la de uno con una cifra antes, un exacto, la suma de dos, un porcentaje y un
    // producto: ninguno tiene parte entera.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const e = r.ent(1, 3), ante = String(r.ent(1, 9)), per = String(r.ent(10, 98));
          if (per[0] === per[1] || per.endsWith(ante) || `${e}${ante}${per}` === '2136') continue;
          const [n0, d] = genDe(ante, per), num = e * d + n0, G = red(num, d), todo = Number(`${e}${ante}${per}`), antes = Number(`${e}${ante}`);
          return {
            enunciado: `¿Qué fracción irreductible es ${escr(ante, per, String(e))}?`,
            datos: [D5.alinear, D5.mixto, D5.entero, D5.simp],
            pasos: [
              { tipo: 'pide', texto: `Piden la fracción de ${escr(ante, per, String(e))}, ya simplificada.` },
              { tipo: 'datos', texto: `Parte entera ${e}; antes del bloque, ${ante}; el bloque, ${per}, de dos cifras.` },
              { tipo: 'regla', texto: 'Corro la coma hasta antes del bloque y hasta después de un bloque, y resto: las colas se cancelan.' },
              { tipo: 'cuentas', texto: `1000x y 10x tienen la misma cola.`, ecuacion: [`1000x − 10x = ${todo} − ${antes} = ${todo - antes}`, SEP, `990x = ${todo - antes}`] },
              { tipo: 'cuentas', texto: `Despejo y simplifico entre ${mcd(num, d)}.`, ecuacion: [{ frac: [pa(todo - antes), ps(990)] }, ' = ', frP(...G)] },
              { tipo: 'sentido', texto: `Compruebo: ${fxr(G)} es un poco más que ${e}, como ${escr(ante, per, String(e))}.` },
            ],
            respuesta: ['Es ', frP(...G)],
          };
        }
      },
    },
    ahoraTu: {
      voz: '¿Cuántas cifras tiene el bloque, y hay cifras antes?',
      generar(sem) {
        const r = azar(sem + 47), tipo = sem % 6;
        return conCuatro([casoPuro, casoMixtoG, casoExactoF, casoSumaP, casoPorciento, casoProducto][tipo], r);
      },
    },
  };

  // ---------- Idea 6 (rehecha, 19 nov): fracciones en otras bases ----------
  // Propuesta §1 a §7. Conserva el id `otras-bases` (y la mesa `division-base`), con otra Predice: la de antes (1/3 en
  // base 6) la regalaba el queque en 6 porciones de «Lee». Objeto: el queque cortado en 6 y en 10 porciones (arit-queque)
  // en «Lee», y el cuaderno de la división en base B (arit-tabla) en el juego. Cambia: n y la base. · Permanece: el
  // numerador 1. · Progresa: base 10 → otra base → la misma fracción exacta en una y repetida en otra. · Se reserva: 1/5
  // en base 6 (la predicción; el juego no tiene el 5). · Debe verse: lo que decide son los primos de n y los de la base.
  // Errores (hipótesis de aula): AT-BASE10 lee o escribe como en base 10 · AT-SIN-RESTO toma la primera cifra y deja el
  // resto · AT-NO-BASE cree que una fracción no se escribe en otra base · AT-POSICION toma la segunda cifra sobre B y no
  // sobre B² · AT-POSICION-MAS divide entre una potencia de más · AT-BASE-GRANDE cree que basta una base mayor que el
  // denominador · AT-UN-PRIMO-B mira solo un primo del denominador · AT-BASE-ES-N toma el denominador como base · AT-CORTAR
  // corta el bloque · AT-NUEVES usa un solo B − 1 para dos cifras.
  const D6 = {
    exacta: 'Una fracción irreductible es exacta en base B si cada primo de su denominador divide a B',
    cifra: 'En base B, cada resto se multiplica por B: el cociente es la cifra y lo que sobra, el resto nuevo',
    lugares: 'En base B, la primera cifra después de la coma vale cifra/B, y la segunda, cifra/B²',
    cifras: 'En base B, las cifras van de 0 a B − 1',
    bloque: 'En base B, un bloque de dos cifras que se repite desde la coma vale (primera × B + segunda)/(B² − 1)',
    tramo: D1.cuantos,
  };
  const SUBD = '₀₁₂₃₄₅₆₇₈₉';
  const enB = (s, B) => `${s}₍${String(B).split('').map(c => SUBD[+c]).join('')}₎`;
  // Los n del juego: sin el 5, que es la predicción.
  const N6 = [2, 3, 4, 6, 7, 8, 9, 10, 12];
  const primosDe = n => factores(n).map(([p]) => p);
  const exactaEn = (n, B) => primosDe(n).every(p => B % p === 0);
  const USADOS6 = new Set(['1/5-6', '1/9-3', '1/4-6', '1/3-2', '1/3-6', '5/12-6', '1/3-3', '7/18', '1/10', '11/30', '3/8-4']);

  // Ahora tú · tipo 0: en cuál de cuatro bases es exacta una fracción.
  function casoBase(r) {
    const n = r.de([6, 10, 12, 14, 15, 18, 20, 21, 22]), a = r.ent(1, n - 1);
    if (mcd(a, n) !== 1 || USADOS6.has(`${a}/${n}`)) return null;
    const ps = primosDe(n), buenas = [], uno = [], grandes = [];
    for (let B = 2; B <= 30; B++) { if (exactaEn(n, B)) buenas.push(B); else if (ps.some(p => B % p === 0) && B !== 10) uno.push(B); else if (B > n && B !== 10) grandes.push(B); }
    if (!buenas.length || !uno.length || !grandes.length || exactaEn(n, 10)) return null;
    const sinN = buenas.filter(b => b !== n), B0 = r.de(sinN.length ? sinN : buenas), Bu = r.de(uno), Bg = r.de(grandes);
    return {
      pregunta: `¿En cuál de estas bases es exacta la fracción ${a}/${n}?`,
      datos: [D6.exacta, D6.cifra],
      opciones: opciones(`Base ${B0}`, [
        { id: 'uno', valor: `Base ${Bu}`, error: 'AT-UN-PRIMO-B', siFuera: `${Bu} tiene un primo de ${n} = ${canon(n)}, pero no todos.` },
        { id: 'grande', valor: `Base ${Bg}`, error: 'AT-BASE-GRANDE', siFuera: `Ser mayor que ${n} no basta: lo que cuenta son los primos, y ${Bg} no tiene ${ps.filter(p => Bg % p).join(' ni ')}.` },
        { id: 'diez', valor: 'Base 10', error: 'AT-BASE10', siFuera: `${n} = ${canon(n)} tiene un primo que no es 2 ni 5: en base 10 se repite.` },
      ]),
      solucion: { texto: `${n} = ${canon(n)}: la base tiene que tener ${yLista(ps)}.`, ecuacion: [`${B0} = ${canon(B0)}`] },
    };
  }
  // Ahora tú · tipo 1: un decimal de dos cifras en base B, como fracción.
  function casoAFr(r) {
    const B = r.de([3, 4, 5, 6, 7, 8, 9]), x = r.ent(1, B - 1), y = r.ent(1, B - 1);
    if (x === y) return null;
    const G = red(x * B + y, B * B);
    return {
      pregunta: `¿Qué fracción irreductible es ${enB(`0,${x}${y}`, B)}?`,
      datos: [D6.lugares, D1.mcd],
      opciones: opciones(fxr(G), [
        { id: 'b10', valor: fxr(red(10 * x + y, 100)), error: 'AT-BASE10', siFuera: 'Eso lee las cifras como si fueran de base 10.' },
        { id: 'pos', valor: fxr(red(x + y, B)), error: 'AT-POSICION', siFuera: `Bien la primera cifra sobre ${B}. Pero la segunda va sobre ${B}² = ${B * B}.` },
        { id: 'mas', valor: fxr(red(x * B + y, B * B * B)), error: 'AT-POSICION-MAS', siFuera: `Bien juntar las dos cifras. Pero son dos lugares: abajo va ${B}², no ${B}³.` },
      ]),
      solucion: { texto: `Cada cifra sobre su potencia de ${B}.`, ecuacion: [`${x}/${B} + ${y}/${B * B} = ${x * B + y}/${B * B}`, ' = ', frP(...G)] },
    };
  }
  // Ahora tú · tipo 2: la menor base en que una fracción es exacta.
  function casoMenor(r) {
    const n = r.de([12, 18, 20, 24, 28, 36, 40, 45, 50, 54, 63, 75]), a = r.ent(1, n - 1);
    if (mcd(a, n) !== 1) return null;
    const rad = primosDe(n).reduce((u, p) => u * p, 1), pm = Math.max(...primosDe(n));
    if (rad === n || rad === 10) return null;
    return {
      pregunta: `¿Cuál es la menor base en que ${a}/${n} es exacta?`,
      datos: [D6.exacta],
      opciones: opciones(rad, [
        { id: 'n', valor: n, error: 'AT-BASE-ES-N', siFuera: `En base ${n} es exacta, sí, pero hay una menor: basta que la base tenga los primos de ${n}.` },
        { id: 'primo', valor: pm, error: 'AT-UN-PRIMO-B', siFuera: `Bien el primo ${pm}. Pero ${n} = ${canon(n)} tiene otros primos.` },
        { id: 'diez', valor: 10, error: 'AT-BASE10', siFuera: `En base 10 solo terminan los de primos 2 y 5; ${n} = ${canon(n)}.` },
      ], x => `Base ${x}`),
      solucion: { texto: `${n} = ${canon(n)}: la base más chica con esos primos es su producto.`, ecuacion: [`${primosDe(n).join(' × ')} = ${rad}`] },
    };
  }
  // Ahora tú · tipo 3 (nivel examen): un bloque de dos cifras que se repite en base B, como fracción.
  function casoBloqueB(r) {
    const B = r.de([3, 4, 5, 6, 7, 8, 9]), x = r.ent(1, B - 1), y = r.ent(0, B - 1);
    if (x === y || (x === 2 && y === 5)) return null;   // 0,252525… es un ejemplo
    const G = red(x * B + y, B * B - 1);
    return {
      pregunta: `¿Qué fracción irreductible es ${enB(`0,${repite(`${x}${y}`)}…`, B)}, en la que ${x}${y} se repite sin fin?`,
      datos: [D6.bloque, D1.mcd],
      opciones: opciones(fxr(G), [
        { id: 'b10', valor: fxr(red(10 * x + y, 99)), error: 'AT-BASE10', siFuera: 'Esa es la cuenta de base 10: con 99 abajo. Aquí la base es otra.' },
        { id: 'cortar', valor: fxr(red(x * B + y, B * B)), error: 'AT-CORTAR', siFuera: `Bien pasar ${x}${y} a ${x * B + y}. Pero sobre ${B * B} termina; el bloque sigue sin fin.` },
        { id: 'uno', valor: fxr(red(x * B + y, B - 1)), error: 'AT-NUEVES', siFuera: `Un solo ${B - 1} sirve para un bloque de una cifra; este tiene dos: ${B}² − 1.` },
      ]),
      solucion: { texto: `${x}${y} en base ${B} vale ${x} × ${B} + ${y} = ${x * B + y}.`, ecuacion: [{ frac: [pa(x * B + y), ps(B * B - 1)] }, ' = ', frP(...G)] },
    };
  }
  // Ahora tú · tipo 4 (nivel examen): en cuántas bases de 2 a L es exacta una fracción.
  function casoCuantas(r) {
    const n = r.de([6, 10, 12, 14, 15, 18, 20, 21]), a = r.ent(1, n - 1), L = r.de([20, 24, 30, 36, 40]);
    if (mcd(a, n) !== 1 || USADOS6.has(`${a}/${n}`)) return null;
    const ps = primosDe(n), rad = ps.reduce((u, p) => u * p, 1);
    const cuenta = ok => { let c = 0; for (let B = 2; B <= L; B++) if (ok(B)) c++; return c; };
    const C = cuenta(B => B % rad === 0), p0 = ps[0], pm = ps[ps.length - 1];
    return {
      pregunta: `¿En cuántas bases, de la 2 a la ${L}, es exacta la fracción ${a}/${n}?`,
      datos: [D6.exacta, D6.tramo],
      opciones: opciones(C, [
        { id: 'p0', valor: cuenta(B => B % p0 === 0), error: 'AT-UN-PRIMO-B', siFuera: `Esas son las bases con el ${p0}. Además hace falta ${ps.filter(p => p !== p0).join(' y ')}.` },
        { id: 'pm', valor: cuenta(B => B % pm === 0), error: 'AT-UN-PRIMO-B', siFuera: `Esas son las bases con el ${pm}. Además hace falta ${ps.filter(p => p !== pm).join(' y ')}.` },
        { id: 'grande', valor: L - n + 1, error: 'AT-BASE-GRANDE', siFuera: `Ser mayor que ${n} no basta: cuentan los primos de ${n} = ${canon(n)}.` },
      ]),
      solucion: { texto: `La base tiene que ser múltiplo de ${rad}.`, ecuacion: [Array.from({ length: C }, (_, k) => (k + 1) * rad).join(', ')] },
    };
  }

  // Ejemplos resueltos (idea 6). Cuentas rehechas aparte (cuentas.py, divisiones en base B con enteros): 0,3₍₆₎ = 1/2;
  // 0,21₍₄₎ = 9/16; 1/4 en base 6 exacta (2 divide a 6); 1/5 en base 6 periódica; 1/3 en base 6 = 0,2₍₆₎; 1/4 = 0,13₍₆₎;
  // 1/3 = 0,010101…₍₂₎; 0,12₍₃₎ = 5/9; 5/12: base 6; 1/3 = 0,1₍₃₎ y 0,333… en base 10. Nivel 3: 0,333…₍₅₎ = 3/4 (base 10:
  // 1/3; cortado: 3/5; 3/10; olvida la cifra: 1/4); 7/18: base 12 (9, 10, 19 y 8 no); 1/10 exacta en las bases 10, 20 y
  // 30 de 2 a 30 (con el 2: 15; con el 5: 6; mayores que 9: 21; solo la 10: 1); 0,2525…₍₇₎ = 19/48 (base 10: 25/99;
  // cortado: 19/49; un solo 6: 19/6; sin pasar a base 7: 25/48); 11/30: base 30 (5, 10, 15 y 31 no).
  const EJEMPLOS_BASES = [
    { nivel: 1, titulo: 'Una cifra en base 6',
      enunciado: `¿Qué fracción es ${enB('0,3', 6)}?`,
      datos: [D6.lugares],
      solucion: [{ texto: 'La primera cifra después de la coma cuenta sextos: 3 sextos.', ecuacion: [fr(3, 6), ' = ', frP(1, 2)] }],
      respuesta: [frP(1, 2)] },
    { nivel: 1, titulo: 'Dos cifras en base 4',
      enunciado: `¿Qué fracción es ${enB('0,21', 4)}?`,
      datos: [D6.lugares],
      solucion: [{ texto: 'La primera cuenta cuartos y la segunda dieciseisavos.', ecuacion: [fr(2, 4), ' + ', fr(1, 16), ' = ', fr(8, 16), ' + ', fr(1, 16), ' = ', frP(9, 16)] }],
      respuesta: [frP(9, 16)] },
    { nivel: 1, titulo: '¿Exacta en base 6?',
      enunciado: '¿La fracción 1/4 es exacta en base 6?',
      datos: [D6.exacta],
      solucion: [{ texto: '4 = 2², y el 2 divide a 6 = 2 × 3. Termina.' }],
      respuesta: ['Sí, es exacta'] },
    { nivel: 1, titulo: '¿Y 1/7 en base 6?',
      enunciado: '¿La fracción 1/7 es exacta en base 6?',
      datos: [D6.exacta],
      solucion: [{ texto: '7 es primo y no divide a 6 = 2 × 3: algún resto vuelve.' }],
      respuesta: ['No: un bloque se repite'] },
    { nivel: 1, titulo: 'La primera cifra',
      enunciado: '¿Cómo se escribe 1/3 en base 6?',
      datos: [D6.cifra],
      solucion: [{ texto: '1 × 6 = 6 y 6 entre 3 cabe 2 veces, sin resto: una sola cifra, el 2.', ecuacion: ['1 × 6 = 6 = 2 × 3 + 0'] }],
      respuesta: [pe(enB('0,2', 6))] },
    { nivel: 2, titulo: '1/4 en base 6',
      enunciado: '¿Cómo se escribe 1/4 en base 6?',
      datos: [D6.cifra, D6.exacta],
      solucion: [
        { texto: '1 × 6 = 6 = 1 × 4 + 2: la primera cifra es 1 y sobra 2.' },
        { texto: '2 × 6 = 12 = 3 × 4 + 0: la segunda es 3 y no sobra nada.', ecuacion: [fr(1, 6), ' + ', fr(3, 36), ' = ', fr(9, 36), ' = ', fr(1, 4)] },
      ],
      respuesta: [pe(enB('0,13', 6))] },
    { nivel: 2, titulo: '1/3 en base 2',
      enunciado: '¿Cómo se escribe 1/3 en base 2?',
      datos: [D6.cifra, D6.exacta],
      solucion: [
        { texto: '1 × 2 = 2: cabe 0 veces y sobra 2. 2 × 2 = 4 = 1 × 3 + 1: cifra 1 y sobra 1.' },
        { texto: 'El resto 1 vuelve: el bloque 01 se repite.' },
      ],
      respuesta: [pe(enB('0,010101…', 2))] },
    { nivel: 2, titulo: 'De base 3 a fracción',
      enunciado: `¿Qué fracción es ${enB('0,12', 3)}?`,
      datos: [D6.lugares],
      solucion: [
        { texto: 'Tercios y novenos.', ecuacion: [fr(1, 3), ' + ', fr(2, 9), ' = ', fr(3, 9), ' + ', fr(2, 9), ' = ', frP(5, 9)] },
        { texto: 'Compruebo al revés: 5/9 = 3/9 + 2/9 = 1/3 + 2/9, una vez un tercio y dos veces un noveno: las cifras 1 y 2.' },
      ],
      respuesta: [frP(5, 9)] },
    { nivel: 2, titulo: 'La base más chica',
      enunciado: '¿Cuál es la menor base en que 5/12 es exacta?',
      datos: [D6.exacta],
      solucion: [
        { texto: '12 = 2² × 3: la base tiene que tener el 2 y el 3.' },
        { texto: 'La más chica con los dos es 2 × 3 = 6.' },
      ],
      respuesta: ['Base ', pe(6)] },
    { nivel: 2, titulo: 'Exacta en una, no en otra',
      enunciado: '¿Cómo es 1/3 en base 3 y en base 10?',
      datos: [D6.exacta, D6.cifra],
      solucion: [
        { texto: 'En base 3: 1 × 3 = 3 = 1 × 3, sin resto.', ecuacion: [fr(1, 3), ' = ', enB('0,1', 3)] },
        { texto: 'En base 10, 3 no divide a 10: el resto 1 vuelve siempre.', ecuacion: [fr(1, 3), ' = 0,333…'] },
      ],
      respuesta: ['Exacta en base 3 y repetida en base 10'] },
    { nivel: 3, titulo: 'Un bloque en base 5',
      enunciado: `¿Qué fracción es ${enB('0,333…', 5)}, con el 3 que se repite sin fin?`,
      alternativas: ['3/4', '1/3', '3/5', '3/10', '1/4'],
      datos: [D6.cifra],
      solucion: [
        { texto: 'Como en base 10 va un 9 = 10 − 1, en base 5 va un 4 = 5 − 1: x × 5 − x = 3.', ecuacion: ['4x = 3', SEP, 'x = ', frP(3, 4)] },
        { texto: ['Las trampas: ', letra('B'), ' hace la cuenta de base 10, 3/9; ', letra('C'), ' corta en una cifra; ', letra('D'), ' lee 0,3 de base 10; ', letra('E'), ' olvida la cifra 3.'] },
      ],
      respuesta: [letra('A'), ': ', frP(3, 4)] },
    { nivel: 3, titulo: '¿En qué base termina?',
      enunciado: '¿En cuál de estas bases es exacta la fracción 7/18?',
      alternativas: ['Base 9', 'Base 10', 'Base 12', 'Base 19', 'Base 8'],
      datos: [D6.exacta],
      solucion: [
        { texto: '18 = 2 × 3²: la base necesita el 2 y el 3. 12 = 2² × 3 los tiene.' },
        { texto: ['Las trampas: ', letra('A'), ' solo tiene el 3; ', letra('B'), ' no tiene el 3; ', letra('D'), ' es mayor que 18, pero es primo; ', letra('E'), ' solo tiene el 2.'] },
      ],
      respuesta: [letra('C'), ': base 12'] },
    { nivel: 3, titulo: 'Cuántas bases',
      enunciado: '¿En cuántas bases, de la 2 a la 30, es exacta la fracción 1/10?',
      alternativas: ['15', '6', '21', '1', '3'],
      datos: [D6.exacta],
      solucion: [
        { texto: '10 = 2 × 5: la base tiene que ser múltiplo de 10. De 2 a 30: 10, 20 y 30.' },
        { texto: ['Las trampas: ', letra('A'), ' cuenta las que tienen el 2; ', letra('B'), ' las que tienen el 5; ', letra('C'), ' las mayores que 9; ', letra('D'), ' solo la base 10.'] },
      ],
      respuesta: [letra('E'), ': 3'] },
    { nivel: 3, titulo: 'Bloque de dos en base 7',
      enunciado: `¿Qué fracción es ${enB('0,252525…', 7)}, con el 25 que se repite sin fin?`,
      alternativas: ['25/99', '19/48', '19/49', '19/6', '25/48'],
      datos: [D6.bloque],
      solucion: [
        { texto: '25 en base 7 vale 2 × 7 + 5 = 19. Abajo, 7² − 1 = 48.', ecuacion: [{ frac: [pa(19), ps(48)] }] },
        { texto: ['Las trampas: ', letra('A'), ' hace la cuenta de base 10; ', letra('C'), ' corta el bloque; ', letra('D'), ' usa un solo 6; ', letra('E'), ' no pasa 25 a base 7.'] },
      ],
      respuesta: [letra('B'), ': ', frP(19, 48)] },
    { nivel: 3, titulo: 'La menor base',
      enunciado: '¿Cuál es la menor base en que la fracción 11/30 es exacta?',
      alternativas: ['Base 5', 'Base 10', 'Base 15', 'Base 30', 'Base 31'],
      datos: [D6.exacta],
      solucion: [
        { texto: '30 = 2 × 3 × 5: la base necesita los tres primos. La menor es 2 × 3 × 5 = 30.' },
        { texto: ['Las trampas: ', letra('A'), ' solo mira el mayor primo; ', letra('B'), ' no tiene el 3; ', letra('C'), ' no tiene el 2; ', letra('E'), ' es mayor que 30, pero es primo.'] },
      ],
      respuesta: [letra('D'), ': base 30'] },
  ];

  const otras = {
    id: 'otras-bases',
    titulo: 'Fracciones en otras bases',
    pregunta: '¿Puede una fracción ser exacta en una base y periódica en otra?',
    temas: ['Números en otras bases'],
    pieza: TA,
    aprendizaje: 'En base B, una fracción irreductible es exacta si cada primo de su denominador divide a B; cada cifra sale del resto por B.',
    actividad: 'Dividir 1 entre n en otra base y ver si la división termina.',
    // Lee: el queque en 6 y en 10 porciones (con 1/3, que no es la predicción), qué cuenta cada cifra en base 6 y qué
    // mirar. No dice qué pasa con 1/5 en base 6 (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'El queque en 6 porciones', texto: 'Doña Juana corta un queque en 6 porciones iguales: un tercio son 2 porciones justas. Si lo corta en 10, un tercio no da porciones enteras: 3 y un pedazo.',
          pieza: QU, dibujo: queques([{ partes: 6, marcas: [{ c0: 0, c1: 2, color: 'o' }], rotulo: [['1/3 en 6 porciones']] }, { partes: 10, marcas: [{ c0: 0, c1: 10 / 3, color: 'o' }], rotulo: [['1/3 en 10 porciones']] }]) },
        { titulo: 'Cifras después de la coma', texto: ['En base 6, la expansión de un número usa cifras de 0 a 5. La primera cifra fraccionaria cuenta sextos, y la segunda, treintaiseisavos.'],
          ecuacion: [enB('0,23', 6), ' = ', fr(2, 6), ' + ', fr(3, 36), ' = ', fr(15, 36), ' = ', fr(5, 12)] },
        { titulo: 'Qué mirar al jugar', texto: 'En el cuaderno, cada resto se multiplica por la base. Deja n fijo, cambia la base y mira cuándo el resto llega a 0.' },
      ],
    },
    ejemplos: EJEMPLOS_BASES,
    juega: {
      pieza: TA,
      consigna: 'Doña Juana divide 1 entre n en su cuaderno, pero en otra base: cada resto se multiplica por la base.',
      mision: {
        // Una sola manera en la grilla: 1/9 es exacta en las bases 3, 6 y 9; la más chica es 3.
        texto: 'Haz que 1/9 sea exacta con la base más chica posible.',
        logrado: v => v.n === 9 && v.B === 3,
        bien: 'En base 3, 1/9 = 0,01: la tabla llega a 0 en dos cifras.',
      },
      voz: 'Compara los primos de n con los de la base.',
      leyenda: [
        { s: re('resto'), t: 'lo que sobra en cada paso' },
        { s: pe('cifra'), t: 'la cifra que sale en esa base' },
      ],
      controles: [
        { id: 'n', etiqueta: 'n', opciones: N6.map(x => ({ valor: x, texto: String(x) })) },
        { id: 'B', etiqueta: 'Base', min: 2, max: 10, paso: 1, inicio: 10, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDiv(1, v.n, v.B, 8, true), estado: {} }),
      lectura: v => {
        const d = division(1, v.n, v.B, 40);
        return [`1/${v.n} en base ${v.B} = `, pe(decimal(1, v.n, v.B)), d.inicio === -1 ? ': termina' : ': un resto vuelve'];
      },
      minimo: 4,
    },
    predice: {
      pieza: TA,
      pregunta: 'En base 10, 1/5 = 0,2 es exacto. ¿Cómo se escribe 1/5 en base 6?',
      datos: ['En base 6, las cifras van de 0 a 5', `${enB('0,1', 6)} vale 1/6`],
      voz: 'Piensa qué pasa con el resto en base 6.',
      opciones: [
        { id: 'c', texto: '0,111… periódico', correcta: true },
        { id: 'b10', texto: '0,2 exacto, como en base 10', error: 'AT-BASE10', siFuera: `${enB('0,2', 6)} vale 2/6 = 1/3, no 1/5: en base 6 cada resto se multiplica por 6.` },
        { id: 'sinresto', texto: '0,1 exacto', error: 'AT-SIN-RESTO', siFuera: '1 × 6 = 6 = 1 × 5 + 1: la cifra es 1, bien, pero sobra 1 y hay que seguir.' },
        { id: 'nobase', texto: 'No se puede escribir', error: 'AT-NO-BASE', siFuera: 'Sí se puede: en base 6 la división sigue igual, multiplicando cada resto por 6.' },
      ],
      dibujo: cuaderno(1, 5, 10),
      revelar: cuaderno(1, 5, 6),
      coincide: 'Coincide: 1 × 6 = 6 = 1 × 5 + 1. El resto 1 vuelve siempre: 0,111… en base 6.',
      noCoincide: 'Revisemos la división en base 6, resto por resto.',
    },
    mira: {
      pieza: TA,
      datos: tablaDiv(1, 5, 6, 8, true),
      voz: 'Cada resto por 6.',
      pasos: [
        { estado: { fila: 0 }, texto: 'En base 6, el resto 1 por 6 da 6: cifra 1, sobra 1.', ecuacion: ['1 × 6 = 6 = 1 × 5 + 1'] },
        { estado: { fila: 1 }, texto: 'La cifra es 1 y sobra 1: el mismo resto de antes.', ecuacion: [fr(1, 5), ' = ', enB('0,111…', 6)] },
        { estado: {}, texto: 'El 5 no divide a 6: ningún resto llega a 0.', ecuacion: ['6 = 2 × 3'] },
        { estado: {}, texto: 'En base 10 termina porque 5 divide a 10.', ecuacion: ['10 = 2 × 5'] },
      ],
    },
    regla: {
      texto: 'Una fracción irreductible es exacta en base B si cada primo de su denominador divide a B; si no, se repite un bloque. Cada resto por B da otra cifra.',
      ecuacion: [{ llave: [enB('0,23', 6), ' = ', fr(2, 6), ' + ', fr(3, 36), ' = ', fr(5, 12)], nota: 'cada cifra, sobre su potencia de 6' }, SEP, { llave: [fr(1, 5), ' = ', enB('0,111…', 6)], nota: '5 no divide a 6' }],
      condicion: 'la fracción está simplificada. En base 10 esos primos son 2 y 5; en base B, las cifras van hasta B − 1.',
      voz: 'Los primos de la base deciden.',
    },
    // Así se resuelve: escribir una fracción exacta en otra base (3/8 en base 4 y casos así). «Ahora tú» pide en cuál de
    // cuatro bases es exacta, un decimal de base B a fracción, la menor base, un bloque que se repite en base B y en
    // cuántas bases es exacta.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const [B, n] = r.de([[4, 8], [4, 16], [6, 4], [6, 9], [6, 8], [2, 8], [3, 9], [8, 16], [9, 27], [6, 12], [5, 25]]), a = r.ent(1, n - 1);
          if (mcd(a, n) !== 1 || USADOS6.has(`${a}/${n}-${B}`)) continue;
          const v = division(a, n, B, 10);
          return {
            enunciado: `Escribe la fracción ${a}/${n} en base ${B}.`,
            datos: [D6.exacta, D6.cifra],
            pasos: [
              { tipo: 'pide', texto: `Piden las cifras de ${a}/${n} después de la coma, contando de ${B} en ${B}.` },
              { tipo: 'regla', texto: `Cada resto se multiplica por ${B}: el cociente entre ${n} es la cifra y lo que sobra, el resto nuevo.` },
              { tipo: 'cuentas', texto: `Hago ${plural(v.cifras.length, 'paso', 'pasos')} hasta que el resto llega a 0.`, ecuacion: v.restos.flatMap((rr, i) => [...(i ? [SEP] : []), `${rr} × ${B} = ${rr * B} = ${v.cifras[i]} × ${n} + ${i + 1 < v.restos.length ? v.restos[i + 1] : 0}`]) },
              { tipo: 'sentido', texto: `Termina porque ${n} = ${canon(n)} y ${primosDe(n).length === 1 ? 'su primo divide' : 'sus primos dividen'} a ${B}.` },
            ],
            respuesta: [`${a}/${n} = `, pe(enB(decimal(a, n, B), B))],
          };
        }
      },
    },
    ahoraTu: {
      voz: '¿Los primos del denominador están en la base?',
      generar(sem) {
        const r = azar(sem + 59), tipo = sem % 5;
        return conCuatro([casoBase, casoAFr, casoMenor, casoBloqueB, casoCuantas][tipo], r);
      },
    },
  };

  // ---------- Laboratorio (sin misión ni predicción: se explora; las invitaciones invitan a un reto) ----------
  // Las tres mesas de antes conservan su id y los de sus controles (por la colección); cambian sus colores al mapa de la
  // unidad (sin verde: las cifras en violeta y el resto en carmín) y la notación (× y nunca «·»). Las ideas 1 y 2 muestran
  // una fracción por bandeja; aquí se ponen dos juntas en tiras y en la recta, con fracciones mayores que 1.
  const TIRAS = () => Kit.piezas['arit-tiras'], RECTA = () => Kit.piezas.recta;
  const inversa = (escala, lo, hi) => px => lo + (px - escala(lo)) * (hi - lo) / (escala(hi) - escala(lo));
  const diferencia = (x, y, z, w) => red(Math.abs(x * w - y * z), y * w);
  const unidadM = (x, y, M, rot, color = 'o') => ({
    rotulo: rot, color,
    tramos: [{ valor: x / y, partes: x, color }, ...(x < M * y ? [{ valor: M - x / y, partes: M * y - x, color: 'i', relleno: 0.04 }] : [])],
  });
  const rectaFr = (els, extra = {}) => Object.assign({ min: 0, max: 3, paso: 1, cada: 1, decimales: 2, variable: '', filas: 2, elementos: els }, extra);
  const signo = v => (v.a * v.d === v.b * v.c ? '=' : v.a * v.d < v.b * v.c ? '<' : '>');
  const dosTiras = v => {
    const M = Math.max(1, Math.ceil(v.a / v.b), Math.ceil(v.c / v.d));
    return { datos: { max: M, regla: { paso: 1, cada: 1 }, filas: 2, tiras: [unidadM(v.a, v.b, M, `${v.a}/${v.b}`), unidadM(v.c, v.d, M, `${v.c}/${v.d}`)] }, estado: {} };
  };
  const dosPuntos = v => ({ datos: rectaFr([
    { tipo: 'punto', x: v.a / v.b, color: 'o', fila: 1, rotulo: `${v.a}/${v.b}` },
    { tipo: 'punto', x: v.c / v.d, color: 'o', fila: 2, rotulo: `${v.c}/${v.d}` },
  ], { max: 4 }), estado: {} });
  // Para los retos: la menor separación no nula entre dos fracciones de la recta (denominadores de 2 a 8), y si la
  // división en base B termina. Los calcula el motor.
  const sep = v => diferencia(v.a, v.b, v.c, v.d);
  let MINSEP = [1, 1];
  for (let b1 = 2; b1 <= 8; b1++) for (let b2 = 2; b2 <= 8; b2++) for (let a1 = 1; a1 <= 16; a1++) for (let a2 = 1; a2 <= 16; a2++) {
    const [n, m] = diferencia(a1, b1, a2, b2);
    if (n > 0 && n * MINSEP[1] < m * MINSEP[0]) MINSEP = [n, m];
  }
  const exacta = v => division(v.a, v.b, v.B).inicio === -1;
  const mismo = (g, v, ks) => g.some(x => ks.every(k => x[k] === v[k]));
  const laboratorio = [
    {
      id: 'dos-tiras', titulo: 'Dos fracciones en tiras', pieza: 'arit-tiras',
      consigna: 'Elige dos fracciones, también mayores que 1. Arrastra el borde pintado de cada tira y compara los largos.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 9, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 9, paso: 1, inicio: 4, unidad: '', decimales: 0 },
        { id: 'c', etiqueta: 'c', color: 'c-o', min: 1, max: 9, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 2, max: 9, paso: 1, inicio: 3, unidad: '', decimales: 0 },
      ],
      dibujo: dosTiras,
      lectura: v => [fr(v.a, v.b), ` ${signo(v)} `, fr(v.c, v.d), `: en cruz ${v.a * v.d} y ${v.b * v.c}`],
      invitaciones: [
        { texto: 'Arma dos fracciones escritas distinto que den el mismo largo.',
          logrado: v => signo(v) === '=' && (v.a !== v.c || v.b !== v.d),
          bien: 'Otra partición, el mismo número racional. Comprueba los productos cruzados.' },
        { texto: 'Haz que la fracción de numerador mayor sea la tira más corta.',
          logrado: v => (v.a > v.c && signo(v) === '<') || (v.c > v.a && signo(v) === '>'),
          bien: 'El numerador solo no decide: importa en cuántas partes se cortó.' },
        { texto: 'Haz que una tira pase de una unidad y la otra no llegue.',
          logrado: v => (v.a > v.b && v.c < v.d) || (v.c > v.d && v.a < v.b),
          bien: 'La impropia pasa de 1: se puede escribir como número mixto.' },
      ],
      arrastres: [
        { id: 'borde-1', etiqueta: 'borde pintado de la primera tira', color: 'c-o',
          donde: v => { const g = TIRAS().geometria(dosTiras(v).datos); return { x: g.x(v.a / v.b), y: g.centroY(0) }; },
          mover: (pt, v) => ({ a: TIRAS().geometria(dosTiras(v).datos).deX(pt.x) * v.b }) },
        { id: 'borde-2', etiqueta: 'borde pintado de la segunda tira', color: 'c-o',
          donde: v => { const g = TIRAS().geometria(dosTiras(v).datos); return { x: g.x(v.c / v.d), y: g.centroY(1) }; },
          mover: (pt, v) => ({ c: TIRAS().geometria(dosTiras(v).datos).deX(pt.x) * v.d }) },
      ],
    },
    {
      id: 'dos-puntos', titulo: 'Dos fracciones en la recta', pieza: 'recta',
      consigna: 'Ubica dos fracciones en la recta de 0 a 4. Arrastra cada punto y mira cuánto las separa.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 16, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 8, paso: 1, inicio: 5, unidad: '', decimales: 0 },
        { id: 'c', etiqueta: 'c', color: 'c-o', min: 1, max: 16, paso: 1, inicio: 4, unidad: '', decimales: 0 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 2, max: 8, paso: 1, inicio: 7, unidad: '', decimales: 0 },
      ],
      dibujo: dosPuntos,
      lectura: v => [fr(v.a, v.b), ` ${signo(v)} `, fr(v.c, v.d), `: las separa ${txt(...diferencia(v.a, v.b, v.c, v.d))}`],
      invitaciones: [
        { texto: 'Busca dos fracciones distintas, lo más cercanas posible sin ser iguales.',
          logrado: v => { const [n, m] = sep(v); return n > 0 && n * MINSEP[1] === m * MINSEP[0]; },
          bien: 'Más cerca no se puede con estos denominadores. ¿Y si partes en más?' },
        { texto: 'Ubica dos fracciones separadas justo por media unidad.',
          logrado: v => { const [n, m] = sep(v); return n === 1 && m === 2; },
          bien: 'Media unidad entre ellas: compruébalo con un denominador común.' },
        { texto: 'Pon las dos fracciones, escritas distinto, sobre el mismo entero.',
          logrado: v => v.a % v.b === 0 && v.c % v.d === 0 && sep(v)[0] === 0 && v.b !== v.d,
          bien: 'Dos fracciones aparentes: el mismo entero escrito de dos maneras.' },
        { texto: 'Guarda dos casos con la misma separación y fracciones distintas.',
          logrado: (v, g) => mismo(g, v, ['a', 'b', 'c', 'd']) && g.some(x => {
            const [n1, m1] = sep(x), [n2, m2] = sep(v);
            return n1 * m2 === n2 * m1 && (x.a * v.b !== x.b * v.a || x.c * v.d !== x.d * v.c);
          }),
          bien: 'La misma distancia en la recta con números distintos: cuenta la resta, no los números.' },
      ],
      arrastres: [
        { id: 'punto-1', etiqueta: 'punto de la primera fracción', color: 'c-o',
          donde: v => { const g = RECTA().geometria(dosPuntos(v).datos); return { x: g.x(v.a / v.b), y: g.filaY(1) }; },
          mover: (pt, v) => ({ a: inversa(RECTA().geometria(dosPuntos(v).datos).x, 0, 4)(pt.x) * v.b }) },
        { id: 'punto-2', etiqueta: 'punto de la segunda fracción', color: 'c-o',
          donde: v => { const g = RECTA().geometria(dosPuntos(v).datos); return { x: g.x(v.c / v.d), y: g.filaY(2) }; },
          mover: (pt, v) => ({ c: inversa(RECTA().geometria(dosPuntos(v).datos).x, 0, 4)(pt.x) * v.d }) },
      ],
    },
    {
      // Sin arrastre: la tabla es la cuenta misma (resto por base); lo que se elige son números, no lugares.
      id: 'division-base', titulo: 'La división en cualquier base', pieza: 'arit-tabla',
      consigna: 'Elige la fracción y la base. Cada resto se multiplica por la base: mira si sale 0 o si un resto vuelve.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 30, paso: 1, inicio: 5, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 30, paso: 1, inicio: 12, unidad: '', decimales: 0 },
        { id: 'B', etiqueta: 'Base', min: 2, max: 16, paso: 1, inicio: 10, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDiv(v.a, v.b, v.B), estado: {} }),
      lectura: v => [fr(v.a, v.b), ` en base ${v.B} = ${decimal(v.a, v.b, v.B)}`],
      invitaciones: [
        { texto: 'Consigue un decimal exacto, que no sea entero, en una base distinta de 10.',
          logrado: v => v.B !== 10 && v.a % v.b !== 0 && exacta(v),
          bien: 'Termina porque cada primo del denominador simplificado divide a la base.' },
        { texto: 'Busca un periódico puro: que se repita desde la primera cifra.',
          logrado: v => division(v.a, v.b, v.B).inicio === 0,
          bien: 'Puro: el denominador simplificado no comparte primos con la base.' },
        { texto: 'Consigue un período de seis cifras o más.',
          // inicio −2: no se repitió en las 12 cifras de la tabla; aquí eso pasa solo con períodos de 8 o más.
          logrado: v => { const d = division(v.a, v.b, v.B); return d.inicio === -2 || (d.inicio >= 0 && d.cifras.length - d.inicio >= 6); },
          bien: 'Con divisor b caben a lo sumo b − 1 restos distintos antes de repetir.' },
        { texto: 'Guarda dos fracciones de igual denominador y base: una exacta y otra periódica.',
          logrado: (v, g) => mismo(g, v, ['a', 'b', 'B']) && g.some(x => x.b === v.b && x.B === v.B && exacta(x) !== exacta(v)),
          bien: 'Decide el denominador ya simplificado, no el que se escribe.' },
      ],
    },
  ];


  return {
    unidad: 'aritmetica.numeros-racionales',
    version: '0.3.2',   // 0.3.1: correcciones del cierre (20 nov; rutinas/auditoria/aritmetica.numeros-racionales.md); 0.3.2: calidad 2
    calidad: 2,
    estado: 'completa',
    colores: COLORES,
    letras: { a: 'el numerador de una fracción a/b', b: 'el denominador de la fracción a/b', c: 'el numerador de otra fracción, c/d',
      d: 'el denominador de la otra fracción', k: 'el número por el que se multiplican arriba y abajo', x: 'el decimal que se repite, al que se le busca la fracción',
      B: 'la base de numeración', n: 'el denominador de 1/n en otra base', N: 'una cantidad entera: kilos, panes, soles',
      L: 'cuántas cifras tiene el bloque que se repite' },
    requiere: ['/nucleo/kit/piezas/arit-queque.js', '/nucleo/kit/piezas/arit-calculadora.js', '/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-tiras.js', '/nucleo/kit/piezas/recta.js'],
    glosario: [
      // De 2 a 4 palabras por idea, con su aproximación y tres ejemplos. «fracción» es de Magnitudes proporcionales,
      // «fracción irreductible» y «PESI», de Números primos, y «productos cruzados», de Razones y proporciones: aquí no se
      // definen. «denominador» se mudó aquí desde Probabilidades (19 nov). Ningún ejemplo resuelve una predicción ni una
      // misión.
      // Idea 1.
      { termino: 'numerador', formas: ['numerador', 'numeradores'], def: 'Número de arriba de una fracción: cuántas partes iguales de la unidad se toman.',
        simple: 'Cuántas porciones se toman del queque.', ver: ['denominador'],
        ejemplos: ['En 3/4 es el 3: se toman 3 porciones.', 'En 7/10 es el 7.', 'En 5/2 es el 5: más porciones de las que tiene un queque.'] },
      { termino: 'denominador', formas: ['denominador', 'denominadores'], def: 'Número de abajo de una fracción: en cuántas partes iguales se partió la unidad.',
        simple: 'En cuántas porciones iguales se cortó el queque.', ver: ['numerador'],
        ejemplos: ['En 3/4 es el 4.', 'En 2/9 es el 9: cada porción es 1/9 del queque.', 'En la probabilidad 2/36, el 36 cuenta los casos posibles.'] },
      { termino: 'fracciones equivalentes', formas: ['fracciones equivalentes', 'fracción equivalente', 'equivalentes', 'equivalente'], def: 'Fracciones escritas distinto que son la misma parte: en cruz dan lo mismo.',
        simple: 'Dos maneras de escribir la misma porción de queque.', ver: ['número racional'],
        ejemplos: ['1/2 = 2/4 = 4/8.', '3/4 = 9/12, porque 3 × 12 = 4 × 9.', '2/5 y 3/6 no lo son: sumar 1 arriba y abajo cambió la parte.'] },
      { termino: 'número racional', formas: ['número racional', 'números racionales', 'racional', 'racionales'], def: 'Número que se puede escribir como fracción de dos enteros, con denominador distinto de 0.',
        simple: 'Un número que se escribe como fracción: lo que tienen en común las equivalentes.', ver: ['fracciones equivalentes', 'número irracional'],
        ejemplos: ['0,75 = 3/4 lo es.', '−2 = −2/1 lo es.', '√2 no lo es: no sale de dividir dos enteros.'] },
      // Idea 2.
      { termino: 'fracción propia', formas: ['fracción propia', 'fracciones propias', 'propia', 'propias'], def: 'Fracción con numerador menor que el denominador: vale menos que 1.',
        simple: 'Menos de un queque entero.', ver: ['fracción impropia'],
        ejemplos: ['3/8 lo es.', '1/2 = 0,5 lo es.', '9/10 lo es: le falta una porción para el entero.'] },
      { termino: 'fracción impropia', formas: ['fracción impropia', 'fracciones impropias', 'impropia', 'impropias'], def: 'Fracción con numerador mayor que el denominador: vale más que 1.',
        simple: 'Más de un queque: no cabe en una bandeja.', ver: ['número mixto', 'fracción propia'],
        ejemplos: ['5/3 es 1 y 2/3.', '9/2: cuatro queques y medio.', '11/10, apenas más que 1.'] },
      { termino: 'fracción aparente', formas: ['fracción aparente', 'fracciones aparentes', 'aparente', 'aparentes'], def: 'Fracción cuyo numerador es múltiplo del denominador: en realidad es un entero.',
        simple: 'Queques enteros escritos como fracción.', ver: ['fracción impropia'],
        ejemplos: ['8/4 = 2.', '6/2 = 3 queques.', '10/10 = 1.'] },
      { termino: 'número mixto', formas: ['número mixto', 'números mixtos'], def: 'Un entero más una fracción propia, escritos juntos: otra forma de escribir una impropia.',
        simple: 'Queques enteros y un pedazo, como 1 y 3/4.', ver: ['fracción impropia'],
        ejemplos: ['7/4 es 1 y 3/4.', '2 y 1/3 son 7/3.', '5/2 es 2 y 1/2.'] },
      // Idea 3.
      { termino: 'denominador común', formas: ['denominador común', 'denominadores comunes'], def: 'Un mismo denominador para varias fracciones; el menor es el MCM de sus denominadores.',
        simple: 'Cortar los dos queques en porciones del mismo tamaño para juntarlas.', ver: ['denominador'],
        ejemplos: ['Para 1/4 y 1/6, el 12: 3/12 y 2/12.', 'Para 2/3 y 1/5, el 15.', 'Para 1/2 y 3/8, el 8.'] },
      { termino: 'fracción de una fracción', formas: ['fracción de una fracción'], def: 'Una parte de una parte: se multiplica una fracción por la otra.',
        simple: 'La mitad de un tercio de queque.', ver: ['denominador común'],
        ejemplos: ['La mitad de 1/5 es 1/10.', '2/3 de 3/4 es 1/2.', '1/4 de 4/5 es 1/5.'] },
      { termino: 'reducción a la unidad', formas: ['reducción a la unidad'], def: 'Ver qué parte del trabajo se hace en una unidad de tiempo, y sumar esas partes.',
        simple: 'Cuánto del tanque se llena en una hora.', ver: ['denominador común'],
        ejemplos: ['Un grifo de 4 h llena 1/4 del tanque por hora.', 'Dos de 2 h llenan 1/2 + 1/2 = 1 en una hora.', 'Un desagüe de 10 h saca 1/10 por hora.'] },
      // Idea 4.
      { termino: 'decimal exacto', formas: ['decimal exacto', 'decimales exactos', 'exacto', 'exacta', 'exactos', 'exactas'], def: 'Decimal con una cantidad fija de cifras después de la coma: la división termina con resto 0.',
        simple: 'Una división que se acaba, como 0,25.', ver: ['decimal periódico'],
        ejemplos: ['1/4 = 0,25.', '3/20 = 0,15.', '7/8 = 0,875.'] },
      { termino: 'decimal periódico', formas: ['decimal periódico', 'decimales periódicos', 'periódico', 'periódicos', 'periódica'], def: 'Decimal infinito en el que un bloque de cifras se repite sin fin, siempre igual.',
        simple: 'Una división que no se acaba porque un resto vuelve.', ver: ['decimal exacto'],
        ejemplos: ['1/3 = 0,333…', '1/7 = 0,142857142857…', '1/6 = 0,1666…'] },
      { termino: 'número irracional', formas: ['número irracional', 'números irracionales', 'irracional', 'irracionales'], def: 'Número con decimales infinitos que nunca repiten un bloque: no es fracción de dos enteros.',
        simple: 'Un decimal que no se acaba ni se repite.', ver: ['número racional'],
        ejemplos: ['√2 = 1,41421…', 'π = 3,14159…', '0,101001000… con un 0 más cada vez.'] },
      { termino: 'cifra decimal', formas: ['cifra decimal', 'cifras decimales'], def: 'Cada cifra después de la coma: décimos, centésimos, milésimos…',
        simple: 'Las cifras que van después de la coma.', ver: ['decimal exacto'],
        ejemplos: ['0,375 tiene tres.', 'En 2,5 hay una.', '0,1 y 0,10 valen lo mismo: el cero de la derecha sobra.'] },
      // Idea 5.
      { termino: 'período', formas: ['período', 'períodos'], local: true, def: 'Bloque de cifras que se repite sin fin, siempre igual, en un decimal infinito.',
        simple: 'El pedazo que se repite, como 45 en 0,454545…', ver: ['decimal periódico'],
        ejemplos: ['En 0,333… es el 3.', 'En 0,1666… es el 6.', 'En 0,123123… es 123.'] },
      { termino: 'periódico puro', formas: ['periódico puro', 'periódicos puros'], def: 'Decimal que repite su bloque desde la primera cifra después de la coma.',
        simple: 'El bloque empieza justo después de la coma.', ver: ['periódico mixto', 'generatriz'],
        ejemplos: ['0,454545…', '0,333…', '0,142857142857…'] },
      { termino: 'periódico mixto', formas: ['periódico mixto', 'periódicos mixtos'], def: 'Decimal con cifras que no se repiten entre la coma y el bloque que sí se repite.',
        simple: 'Primero unas cifras sueltas y después el bloque.', ver: ['periódico puro', 'generatriz'],
        ejemplos: ['0,8333…: el 8 no se repite.', '0,1666…', '0,58333…: el 5 y el 8 no se repiten.'] },
      { termino: 'generatriz', formas: ['generatriz', 'generatrices', 'fracción generatriz'], def: 'La fracción de la que sale un decimal: al dividir sus dos términos se obtiene ese decimal.',
        simple: 'La fracción que, dividida, da ese decimal.', ver: ['periódico puro', 'periódico mixto'],
        ejemplos: ['La de 0,333… es 1/3.', 'La de 0,25 es 1/4.', 'La de 0,1666… es 1/6.'] },
      // Idea 6.
      { termino: 'expansión', formas: ['expansión', 'expansiones'], def: 'La forma de escribir un número con cifras en una base, también después de la coma.',
        simple: 'Cómo se escribe un número con las cifras de una base.', ver: ['cifra fraccionaria'],
        ejemplos: ['1/2 en base 10: 0,5.', '1/2 en base 4: 0,2.', '1/4 en base 2: 0,01.'] },
      { termino: 'cifra fraccionaria', formas: ['cifra fraccionaria', 'cifras fraccionarias'], def: 'Cifra después de la coma en cualquier base: la primera cuenta partes de B; la segunda, de B².',
        simple: 'Cada cifra de después de la coma, en cualquier base.', ver: ['expansión'],
        ejemplos: ['En base 6, la primera cuenta sextos.', 'En base 2, la segunda cuenta cuartos.', 'En base 10, la tercera cuenta milésimos.'] },
    ],
    laboratorio,
    historia: {
      texto: 'Las fracciones decimales permitieron calcular con partes de la unidad casi como con enteros. Simon Stevin defendió su uso práctico en 1585. No fue el único inventor de los decimales y su notación era distinta de la nuestra. Esta unidad separa el número de sus escrituras: una fracción, un decimal exacto o periódico y un punto de la recta pueden ser el mismo valor.',
      pregunta: '¿Es 0,999… lo mismo que 1?',
      fuente: { titulo: 'O’Connor y Robertson, Simon Stevin — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Stevin/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov). Las ideas sin mesa propia aportan su juego.
    laboratorioIdeas: {
      'dos-tiras': ['equivalentes'],
      'dos-puntos': ['orden-recta'],
      'division-base': ['exacto-periodico', 'otras-bases'],
    },
    ideas: [equivalentes, clases, delResto, decimales, genIdea, otras],
  };
});
