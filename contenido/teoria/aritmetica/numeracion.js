/*
 * Teoría de «Sistemas de numeración» (aritmetica.numeracion), para 5.º de secundaria y preuniversitario. Fuente del
 * contenido: docs/teoria/matriz/aritmetica.json (unidad 11) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 *
 * Etapa 3 del plan de calidad (17 nov): la propuesta aprobada (docs/etapa3/propuesta-aritmetica.md, con las
 * recomendaciones de su sección 9) y docs/etapa3/decisiones.md, que manda. Fase 2: la idea 1, «Agrupar de n en n»,
 * aprobada por Gerson (segunda ronda de la mesa). Fase 3: las ideas 2 a 5 rehechas con el mismo molde (descomposición,
 * cambio de base, `base-desconocida`, nueva, y conteo de cifras), cada una con sus 15 ejemplos; la unidad declara
 * calidad: 2. Fuera (decisión de Gerson): parte fraccionaria en otras bases, operaciones en otras bases y capicúas. El
 * quipu de la idea 2 no entra: sin fuente verificada de «un nivel vacío es un 0» (ver el bloque de la idea 2).
 * Piezas: arit-puesto (ideas 1 a 4), arit-tabla (divisiones de la idea 3) y arit-talonario (idea 5), dibujos de prueba.
 * Hilo de la unidad: el puesto de caramelos de doña Juana en el mercado de Juliaca (pieza arit-puesto, dibujo de
 * prueba): n caramelos sueltos llenan una bolsita, n bolsitas una caja, n cajas un cajón; la etiqueta es el numeral.
 *
 * Letras: la base se llama n (en a̅b̅c̅₍ₙ₎, b es una cifra). El número que se divide se llama D en la regla y los datos
 * de la idea 3 («D = q × n + r», con «D: el número»), para que N no quede al lado de n (ronda 2 del lector, 18 nov); N queda solo como el
 * último boleto de la idea 5, con su leyenda. Los ids de los controles siguen siendo n (la cantidad) y b (la base).
 * Notación: 342₍₆₎, con la base de subíndice entre paréntesis (num en las ecuaciones, numT en el texto plano; num2 si
 * es la segunda base, al pasar entre dos bases), y a̅b̅c̅₍ₙ₎ con raya cuando lleva letras ({ raya } de nucleo/ecuacion.js). Sin base escrita, la base es 10. Se usa «×»
 * para multiplicar (el «·» separa relaciones en la regla).
 *
 * REGLA DE COLORES DE LA UNIDAD: un color fijo por magnitud (docs/molde-unidad.md §5b; decisiones, 17 nov), en la
 * tabla COLORES (def.colores), la misma en el juego, la figura, la fórmula, los datos, los ejemplos y «Ahora tú»:
 *   - violeta (c-f): la cantidad en base 10 (N): los caramelos de un pedido, el paquete cerrado, el último boleto. Es lo que más
 *     pide el examen. En una figura, solo si se da (el rótulo «38 caramelos»), nunca si se pide;
 *   - turquesa (c-i): la base n: el contorno de la bolsita, la caja y el cajón, el subíndice ₍ₙ₎ y el divisor;
 *   - naranja (c-o): las cifras: el numeral, cuántas bolsitas o sueltos hay, cada resto (es una cifra);
 *   - verde (c-d): solo la segunda base, al pasar entre dos bases que no son 10 (idea 3), siempre con su rótulo;
 *   - tinta: los cocientes, los caramelos dibujados y lo que se pide antes de responder («?»);
 *   - el carmín (de los ángulos) no se usa.
 *   La respuesta lleva el color de su magnitud. La letra de una alternativa va en negrita, con el color de lo que nombra.
 *   Cada ficha de color dice su magnitud (m); contenido/teoria/aritmetica/numeracion.test.js falla si una magnitud
 *   cambia de color, en las cinco ideas.
 * Errores: los AT-* son hipótesis de aula, sin medir (el informe de aritmética no trae cifras de numeración); algunos los
 * respalda la trampa 23 de docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md. Ver el bloque de cada idea.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: una base es una regla de juntar (n de un orden = 1 del siguiente); un numeral anota lo que queda.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, sin audio, con lápiz al lado.
 *   Resultado observable: escribe una cantidad en base n juntando por órdenes, reconoce cifras imposibles y halla la
 *     menor base; después (ideas 2 a 5) pasa entre bases, halla bases ocultas y cuenta cifras.
 *   Orden de atención: 1.º el pedido sobre el mostrador · 2.º la etiqueta · acción: los controles o el botón fijo.
 *   Estados: juego sin tocar · casos probados · misión lograda · predicción · coincide / no coincide · paso a paso ·
 *     caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué en base 5 no existe la cifra 5, y por qué 132₍₄₎ no es ciento treinta y dos?».
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/numeracion dice cuánto valen las piezas y si ya forman un numeral (mesa 3D, regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/numeracion/motor.js'))
    : fabrica(root.Kit, root.MotorNumeracion);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MN) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const subi = n => String(n).split('').map(c => SUB[+c]).join('');
  // Numeral en base b (cifras como texto) y su escritura «(132)₄».
  const enBase = (n, base) => { if (n === 0) return '0'; let s = ''; while (n > 0) { s = String(n % base) + s; n = Math.floor(n / base); } return s; };
  const valor = (cifras, base) => cifras.split('').reduce((v, c) => v * base + +c, 0);
  const sup = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const q = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    q.ent = (lo, hi) => lo + Math.floor(q() * (hi - lo + 1));
    q.de = xs => xs[Math.floor(q() * xs.length)];
    return q;
  }
  // Opciones distintas por su texto: la correcta primero; hasta 4.
  function opciones(correcta, distractores, fmt = x => String(x)) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      const txt = fmt(x.valor);
      if (vistos.has(txt) || x.valor === null || x.valor === undefined || (typeof x.valor === 'number' && !Number.isFinite(x.valor))) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba numeracion.test.js) ----------
  // Cada ficha de color dice su magnitud en m. La cantidad en base 10 violeta, la base turquesa, las cifras (y los
  // restos, que son cifras) naranja, la segunda base verde; el carmín no se usa (es de los ángulos).
  const COLORES = { cantidad: 'f', base: 'i', cifras: 'o', 'segunda base': 'd' };
  const ficha = m => t => ({ v: `c-${COLORES[m]}`, t: String(t), m });
  const cant = ficha('cantidad'), bas = ficha('base'), cif = ficha('cifras');
  // Un numeral, 342₍₆₎: las cifras naranja y la base de subíndice, entre paréntesis, turquesa. Con letras, lleva raya
  // (a̅b̅₍ₙ₎: son cifras, no un producto; nucleo/ecuacion.js, { raya }).
  const num = (cifras, base) => { const c = cif(cifras); return { sub: [/[a-z]/.test(String(cifras)) ? { raya: [c] } : c, bas(`(${base})`)] }; };
  // El mismo numeral en un texto plano (siFuera, voz, bien): 342₍₆₎.
  const numT = (cifras, base) => `${cifras}₍${subi(base)}₎`;
  // La letra de una alternativa, en negrita (Gerson, mesa de revisión, 17 nov), con el color de lo que nombra. El
  // U+2060 (invisible) evita que la letra sola salga en cursiva como una variable.
  const letra = (L, m = 'cifras') => ({ v: `c-${COLORES[m]}`, t: `${L}\u2060`, m });
  // Entre dos relaciones de una misma ecuación (en la regla, cada una en su línea).
  const SEP = '   ·   ';
  // La segunda base (idea 3: pasar entre dos bases que no son 10), en verde y siempre con su subíndice.
  const bas2 = ficha('segunda base');
  const num2 = (cifras, base) => { const c = cif(cifras); return { sub: [/[a-z]/.test(String(cifras)) ? { raya: [c] } : c, bas2(`(${base})`)] }; };
  // Un numeral con letras en base 10 (sin base escrita): a̅b̅. La raya dice que son cifras, no a × b.
  const numL = cifras => ({ raya: [cif(cifras)] });
  // Una potencia de la base: 5², n³ (la base turquesa; el exponente, en tinta o con sus partes).
  const pot = (base, exp) => ({ sup: [bas(base), exp] });
  // Datos que se repiten (punto 13: herramientas, no el paso hecho). La descomposición de 2, 3 y 4 cifras, la potencia
  // como multiplicación, la división con resto (q y r dichas en palabras) y el conteo de un bloque. La letra a es siempre una
  // cifra: los extremos de un bloque se llaman p (el primero) y u (el último), no a y z (auditoría, M6).
  const DD = {
    f2: n => [num('ab', n), ' = ', cif('a'), ' × ', bas(n), ' + ', cif('b')],
    f3: n => [num('abc', n), ' = ', cif('a'), ' × ', pot(n, '2'), ' + ', cif('b'), ' × ', bas(n), ' + ', cif('c')],
    f4: n => [num('abcd', n), ' = ', cif('a'), ' × ', pot(n, '3'), ' + ', cif('b'), ' × ', pot(n, '2'), ' + ', cif('c'), ' × ', bas(n), ' + ', cif('d')],
    fk: (k, n) => (k <= 2 ? DD.f2(n) : k === 3 ? DD.f3(n) : DD.f4(n)),
    pot: (n, k = 4) => [pot(n, '2'), ' = ', bas(n), ' × ', bas(n)].concat(k >= 4 ? [';  ', pot(n, '3'), ' = ', bas(n), ' × ', bas(n), ' × ', bas(n)] : []),
    f10: [numL('ab'), ' = ', cif('a'), ' × 10 + ', cif('b')],
    div: n => ['D = q × ', bas(n), ' + ', cif('r'), ', con 0 ≤ ', cif('r'), ' < ', bas(n), ' (D: el número; q: cociente; ', cif('r'), ': resto)'],
    // El orden de los restos (la regla de la idea 3), para los ejemplos que escriben el número en otra base (ronda 2 del
    // lector: «Solo ceros y unos» lo usaba sin decirlo). No es el paso hecho: no dice cuáles son los restos.
    restos: 'El primer resto es la cifra de la derecha (lo que quedó suelto); el último resto, la de la izquierda',
    hasta: 'Del primero, p, al último, u, hay u − p + 1 números',
  };
  // La menor escala con que caben varios dibujos del puesto: la misma en todos (el dibujo no salta de tamaño).
  const escalaDe = lista => Math.floor(Math.min(1.7, ...lista.map(dd => Kit.piezas['arit-puesto'].geometria(dd).sCabe)) * 100) / 100;

  // Gesto directo (docs/teoria.md §4b). En las fichas se tira del borde derecho de la primera fila: la fila se
  // alarga o se acorta y la base cambia. El bloque está centrado y la ficha no cambia de tamaño, así que el borde
  // está en centro + b · ficha / 2: de ahí sale b sin depender del estado (la manija no se dispara al soltar).
  // En la tira de páginas se arrastra el final del libro.
  const FICHAS = () => Kit.piezas['arit-fichas'], TIRAS = () => Kit.piezas['arit-tiras'];
  // (Con menos fichas que b, la manija marca dónde terminaría la fila llena.)
  const bordeFila = (datos, base) => { const g = FICHAS().geometria(datos), c = g.caja(0); return { x: c.x + c.ancho / 2 + base * g.paso / 2, y: c.y + g.paso / 2 }; };
  const baseEn = (datos, x) => { const g = FICHAS().geometria(datos), c = g.caja(0); return 2 * (x - (c.x + c.ancho / 2)) / g.paso; };

  // ---------- Idea 1 (rehecha, 17 nov): agrupar de n en n ----------
  // Propuesta aprobada por Gerson: docs/etapa3/propuesta-aritmetica.md y docs/etapa3/decisiones.md (mandan sobre la
  // propuesta). Objeto de la primera pantalla: el puesto de caramelos de doña Juana en el mercado de Juliaca (pieza
  // arit-puesto, dibujo de prueba). Colores: la tabla COLORES de arriba (un color fijo por magnitud).
  // Cambia: cuántos caramelos hay y de cuántos es la bolsita (n). · Permanece: la regla del puesto (nunca quedan n
  // sueltos sin juntar) y la escala del dibujo. · Progresa: sueltos → bolsitas; la etiqueta anota lo que queda.
  // · Se reserva: el tercer orden, la caja (la predicción: 44₍₅₎ + 1 = 100₍₅₎). · Debe verse: con n sueltos ya hay una
  // bolsita; por eso ninguna cifra llega a n.
  // Errores (hipótesis de aula, sin medir; trampa 23 de docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md:
  // «cifra igual o mayor que la base, primera cifra cero»): AT-CIFRA-B deja n sueltos (escribe la cifra n) ·
  // AT-LLEVA-UNA junta una vez y no sigue · AT-PIERDE pone 0 y pierde lo que juntó · AT-DECIMAL lee o suma como en base
  // 10 · AT-LARGO cree que la base depende de cuántas cifras hay · AT-CIFRA-MAYOR cree que n − 1 tampoco existe ·
  // AT-CERO cree que el 0 no va en medio · AT-SIN-BASE cree que un numeral sin base está mal escrito · AT-UNO-SOLO mira
  // las cifras de un solo numeral · AT-MENOR confunde cuántas bases hay con la menor base.
  // El juego llega solo a dos órdenes (con 24 caramelos y bolsitas de 5 o más, nunca hay caja): la caja es de la
  // predicción. Ningún ejemplo usa «le llega un caramelo» (es la predicción); «Ahora tú» sí, ya después de predecir.
  const PU = 'arit-puesto';
  const PUESTO = () => Kit.piezas[PU];
  const fig = datos => ({ pieza: PU, datos, estado: {} });
  const pl = (k, uno, varios) => `${k} ${k === 1 ? uno : varios}`;
  // La regla de las cifras y la escritura de la etiqueta, como datos (punto 13: herramientas, no el paso hecho).
  const DN = {
    cifras: ['En base ', bas('n'), ', las cifras van de 0 a ', bas('n'), ' − 1'],
    sinBase: 'Un numeral sin base escrita está en base 10',
    primera: 'Un numeral de varias cifras no empieza con 0: 05 se escribe 5',
    etiqueta: 'Etiqueta: primero las bolsitas, después los sueltos; abajo, entre paréntesis, la base: los caramelos de cada bolsita',
    bolsita: n => ['1 bolsita = ', bas(n), ' caramelos'],
    caja: n => ['1 caja = ', bas(n), ' bolsitas'],
    todo: n => ['1 bolsita = ', bas(n), ' caramelos; 1 caja = ', bas(n), ' bolsitas; 1 cajón = ', bas(n), ' cajas'],
  };
  // El juego: el pedido ya empacado (doña Juana nunca deja n sueltos). La escala es la misma en todos los casos del
  // juego (la que hace caber el más ancho), para que la bolsita no cambie de tamaño al mover un control.
  const puestoJ = (v, escala) => ({ n: v.b, bolsitas: Math.floor(v.n / v.b), sueltos: v.n % v.b, ceros: true, regla: 1, rotulos: true,
    etiqueta: { cifras: enBase(v.n, v.b) }, escala });
  let escJ = null;
  const escalaJ = () => {
    if (escJ) return escJ;
    let m = 1.7;
    for (let N = 5; N <= 24; N++) for (let B = 5; B <= 9; B++) m = Math.min(m, PUESTO().geometria(puestoJ({ n: N, b: B })).sCabe);
    return (escJ = Math.floor(m * 100) / 100);
  };
  // «Mira»: el pedido 44₍₅₎ recibe un caramelo; cada paso junta un orden (la misma escala en todos los pasos).
  const MIRA = { n: 5, regla: 2, rotulos: true, ceros: true, escala: 1.2, pasos: [
    { bolsitas: 4, sueltos: 4, llega: 1, etiqueta: { cifras: '44' } },
    { bolsitas: 4, sueltos: 5, juntar: 'sueltos', etiqueta: { cifras: '?' } },
    { bolsitas: 5, sueltos: 0, juntar: 'bolsitas', etiqueta: { cifras: '?' } },
    { cajas: 1, bolsitas: 0, sueltos: 0, etiqueta: { cifras: '100' } },
    { cajas: 1, bolsitas: 0, sueltos: 0, etiqueta: { cifras: '100' } },
  ] };
  const cajasDe = (n, cifras) => { const c = String(cifras).split('').map(Number).reverse(); return { sueltos: c[0] || 0, bolsitas: c[1] || 0, cajas: c[2] || 0, cajones: c[3] || 0 }; };
  // Cuatro opciones siempre en «Ahora tú»: si dos errores dan el mismo texto, se arma otro caso con el mismo azar.
  function conCuatro(caso, r) {
    for (let i = 0; i < 80; i++) { const c = caso(r); if (c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  // Texto plano de una opción con partes (para no repetir opciones).
  const planoP = x => (Array.isArray(x) ? x.map(planoP).join('') : x && typeof x === 'object'
    ? (x.t !== undefined ? String(x.t) : x.sub ? planoP(x.sub[0]) + planoP(x.sub[1]) : x.raya ? planoP(x.raya) : '') : String(x));
  // Opciones con numerales (partes de ecuación): distintas por su texto, la correcta primero; hasta 4.
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
  // Un numeral como opción: con base (342₍₆₎) o sin ella (base 10).
  const opNum = (cifras, base) => [base === 10 ? cif(cifras) : num(cifras, base)];

  // Ahora tú 1: ¿cuál está mal escrito? (la cifra n en base n; los demás, trampas que sí están bien).
  function casoMalEscrito(r) {
    const n = r.ent(3, 8), k = r.ent(3, 4);
    const malo = [r.ent(1, n - 1)].concat(Array.from({ length: k - 1 }, () => r.ent(0, n - 1)));
    malo[r.ent(1, k - 1)] = n;
    const m1 = r.ent(3, 9), mayor = [r.ent(1, m1 - 1), r.ent(0, m1 - 1), m1 - 1].join('');
    const m2 = r.ent(3, 9), conCero = [r.ent(1, m2 - 1), 0, r.ent(1, m2 - 1)].join('');
    const diez = [r.ent(6, 9), r.ent(5, 9), r.ent(7, 9)].join('');
    const mt = malo.join('');
    return {
      pregunta: '¿Cuál de estos numerales está mal escrito?',
      datos: [DN.cifras, DN.sinBase],
      opciones: opcionesNum(opNum(mt, n), [
        { id: 'mayor', texto: opNum(mayor, m1), error: 'AT-CIFRA-MAYOR', siFuera: `Revisar cada cifra está bien. Pero ${m1 - 1} sí existe en base ${m1}: es la cifra mayor.` },
        { id: 'cero', texto: opNum(conCero, m2), error: 'AT-CERO', siFuera: 'Bien que mires el 0. Pero sí va: dice que en ese orden no quedó nada.' },
        { id: 'diez', texto: opNum(diez, 10), error: 'AT-SIN-BASE', siFuera: 'Bien que busques la base. Sin base escrita está en base 10, y ahí todas sirven.' },
      ]),
      solucion: { texto: `En ${numT(mt, n)} aparece la cifra ${n}, y en base ${n} las cifras llegan solo hasta ${n - 1}.`,
        ecuacion: ['cifra ', cif(n), ', base ', bas(n), ': ', cif(n), ' no es menor que ', bas(n)] },
    };
  }
  // Ahora tú 2: la menor base en la que un numeral está bien escrito.
  function casoMenorBase(r) {
    const mayor = r.ent(3, 8), k = r.ent(3, 4);
    const c = [r.ent(1, mayor)].concat(Array.from({ length: k - 1 }, () => r.ent(0, mayor)));
    if (!c.includes(mayor)) c[r.ent(1, k - 1)] = mayor;
    const txt = c.join(''), min = mayor + 1;
    return {
      pregunta: ['¿Cuál es la menor base ', bas('n'), ' en la que el numeral ', num(txt, 'n'), ' está bien escrito?'],
      datos: [DN.cifras],
      opciones: opciones(min, [
        { id: 'igual', valor: mayor, error: 'AT-CIFRA-B', siFuera: `Mirar la cifra mayor está bien. Pero en base ${mayor} la cifra ${mayor} no existe.` },
        { id: 'diez', valor: 10, error: 'AT-DECIMAL', siFuera: 'En base 10 está bien escrito, es cierto. Pero hay bases más chicas que también sirven.' },
        { id: 'largo', valor: k, error: 'AT-LARGO', siFuera: `Contar las cifras está bien, pero la base no depende de cuántas son: depende de la mayor.` },
      ], x => `base ${x}`),
      solucion: { texto: `La cifra mayor es ${mayor}; la base tiene que ser mayor que ella.`, ecuacion: [cif(mayor), ' < ', bas('n'), '   →   ', bas('n'), ' = ', bas(min)] },
    };
  }
  // Ahora tú 3 (nivel examen): el numeral que sigue, con llevadas en cadena (le llega un caramelo).
  function casoSucesor(r, sem) {
    const n = r.ent(4, 7), k = r.ent(3, 4), t = r.ent(2, k - 1);
    const D = [r.ent(1, n - 1)];
    while (D.length < k - t) D.push(r.ent(0, n - 1));
    D[D.length - 1] = r.ent(D.length === 1 ? 1 : 0, n - 2);
    while (D.length < k) D.push(n - 1);
    const val = D.reduce((a, x) => a * n + x, 0), ans = enBase(val + 1, n);
    const dt = D.join(''), sin = D.slice(0, -1).join(''), antes = D.slice(0, -2).join('');
    const pregunta = sem % 2 === 0
      ? ['Un pedido de bolsitas de ', bas(n), ' se anota ', num(dt, n), '. Le agregan un caramelo. ¿Cómo queda la etiqueta?']
      : ['¿Cuál es el numeral que sigue a ', num(dt, n), '?'];
    return {
      pregunta,
      datos: [DN.todo(n), DN.cifras],
      dibujo: sem % 2 === 0 ? fig(Object.assign({ n, ceros: true, regla: k - 1, rotulos: true, llega: 1, etiqueta: { cifras: '?' } }, cajasDe(n, dt))) : undefined,
      opciones: opcionesNum(opNum(ans, n), [
        { id: 'cifra-n', texto: opNum(`${sin}${n}`, n), error: 'AT-CIFRA-B', siFuera: `Sumar 1 a la última cifra está bien. Pero ${n} sueltos ya forman una bolsita: la cifra ${n} no existe.` },
        { id: 'una', texto: opNum(`${antes}${n}0`, n), error: 'AT-LLEVA-UNA', siFuera: `Bien: los sueltos forman una bolsita. Pero entonces hay ${n} bolsitas, y también se juntan.` },
        { id: 'pierde', texto: opNum(`${sin}0`, n), error: 'AT-PIERDE', siFuera: 'El 0 de los sueltos está bien. Pero la bolsita nueva tiene que sumarse al orden siguiente.' },
      ]),
      solucion: { texto: `Cada orden que llega a ${n} se junta en 1 del siguiente, hasta que uno no llega.`, ecuacion: [num(dt, n), ' + 1 = ', num(ans, n)] },
    };
  }
  // Ahora tú 4 (nivel examen): llegan k caramelos a un pedido de tres cifras; hay que juntar dos veces.
  function casoLlegan(r) {
    for (;;) {
      const n = r.ent(4, 6), c = r.ent(1, n - 2), bb = r.ent(n - 2, n - 1), s = r.ent(1, n - 1), k = r.ent(n, 2 * n + 2);
      const q1 = Math.floor((s + k) / n), r0 = (s + k) % n, q2 = Math.floor((bb + q1) / n), r1 = (bb + q1) % n;
      if (q2 < 1 || c + q2 >= n) continue;
      const dt = `${c}${bb}${s}`, ans = `${c + q2}${r1}${r0}`;
      return {
        pregunta: ['Un pedido de bolsitas de ', bas(n), ' se anota ', num(dt, n), '. Le agregan ', cant(k), ' caramelos. ¿Cuál es la nueva etiqueta?'],
        datos: [DN.bolsita(n), DN.caja(n)],
        dibujo: fig({ n, cajas: c, bolsitas: bb, sueltos: s, llega: k, regla: 2, rotulos: true, etiqueta: { cifras: '?' } }),
        opciones: opcionesNum(opNum(ans, n), [
          { id: 'decimal', texto: opNum(String(+dt + k), n), error: 'AT-DECIMAL', siFuera: `Sumar los que llegan está bien. Pero eso suma como en base 10, y aquí se junta de a ${n}.` },
          { id: 'una', texto: opNum(`${c}${bb + q1}${r0}`, n), error: 'AT-LLEVA-UNA', siFuera: `Bien: los sueltos forman bolsitas. Pero las bolsitas pasan de ${n - 1} y también se juntan.` },
          { id: 'pierde', texto: opNum(`${c}${bb}${r0}`, n), error: 'AT-PIERDE', siFuera: 'Los sueltos que quedan están bien. Pero las bolsitas que se armaron hay que sumarlas.' },
        ]),
        solucion: { texto: 'Junta los sueltos en bolsitas; después, las bolsitas en cajas.',
          ecuacion: [`${s} + ${k} = ${q1} × `, bas(n), ' + ', cif(r0), SEP, `${bb} + ${q1} = ${q2} × `, bas(n), ' + ', cif(r1), SEP, `${c} + ${q2} = `, cif(c + q2)] },
      };
    }
  }
  // Ahora tú 5 (nivel examen): la menor base común a tres numerales, o cuántas bases menores que 10 sirven.
  function casoBases(r, sem) {
    if (sem % 10 === 4) {
      const m = r.ent(4, 8), m1 = r.ent(2, m - 2);
      const a = [r.ent(1, m1)].concat([r.ent(0, m1), r.ent(0, m1), m1]);
      const bq = [r.ent(1, m - 1), r.ent(0, m - 1), r.ent(0, m - 1)], cq = [r.ent(1, m - 1), r.ent(0, m - 1), m];
      const [A, B, C] = [a.join(''), bq.join(''), cq.join('')];
      return {
        pregunta: ['Los numerales ', num(A, 'n'), ', ', num(B, 'n'), ' y ', num(C, 'n'), ' están escritos en la misma base ', bas('n'), '. ¿Cuál es la menor base posible?'],
        datos: [DN.cifras],
        opciones: opciones(m + 1, [
          { id: 'igual', valor: m, error: 'AT-CIFRA-B', siFuera: `Buscar la cifra mayor está bien. Pero en base ${m} la cifra ${m} no existe.` },
          { id: 'uno', valor: m1 + 1, error: 'AT-UNO-SOLO', siFuera: `Para ${A} sirve, es cierto. Pero la misma base tiene que servir para los tres numerales.` },
          { id: 'diez', valor: 10, error: 'AT-DECIMAL', siFuera: 'En base 10 los tres están bien escritos. Pero hay bases más chicas que también sirven.' },
        ], x => `base ${x}`),
        solucion: { texto: `La cifra mayor de los tres es ${m}: la base tiene que pasarla.`, ecuacion: [cif(m), ' < ', bas('n'), '   →   ', bas('n'), ' = ', bas(m + 1)] },
      };
    }
    const m = r.ent(2, 6), k = r.ent(3, 4);
    const c = [r.ent(1, m)].concat(Array.from({ length: k - 1 }, () => r.ent(0, m)));
    if (!c.includes(m)) c[k - 1] = m;
    const txt = c.join(''), cuantas = 9 - m;
    return {
      pregunta: ['El numeral ', num(txt, 'n'), ' está escrito en una base ', bas('n'), ' menor que 10. ¿En cuántas bases puede estar?'],
      datos: [DN.cifras, 'La base es un número entero de 2 o más'],
      opciones: opciones(cuantas, [
        { id: 'igual', valor: cuantas + 1, error: 'AT-CIFRA-B', siFuera: `Contar las bases está bien. Pero la base ${m} no sirve: ahí la cifra ${m} no existe.` },
        { id: 'diez', valor: cuantas + 2, error: 'AT-DECIMAL', siFuera: `Bien que cuentes desde ${m + 1}. Pero la base 10 no es menor que 10, y la ${m} no sirve.` },
        { id: 'menor', valor: m + 1, error: 'AT-MENOR', siFuera: `${m + 1} es la menor base posible, es cierto. Pero piden cuántas bases sirven.` },
      ], x => (x === 1 ? '1 base' : `${x} bases`)),
      solucion: { texto: `La cifra mayor es ${m}: sirven las bases de ${m + 1} a 9.`, ecuacion: ['bases ', bas(`${m + 1} a 9`), ': 9 − ', String(m), ' = ', String(cuantas)] },
    };
  }

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h): 5 de nivel 1, 5 de nivel 2 y 5 de nivel 3. Cuentas
  // rehechas aparte, sin este archivo (scratchpad de la sesión, cuentas-idea1.js): 11 = 2 × 4 + 3; 35₍₆₎; 42₍₇₎ = 4 bolsitas
  // de 7 y 2; cifras de base 3; 26₍₅₎ → 31₍₅₎ (2 × 5 + 6 = 16 = 3 × 5 + 1); 38 = 212₍₄₎; 77₍₈₎ = 63; 2 bolsitas de 5 y 9
  // sueltos = 34₍₅₎ (19); 20 = 32₍₆₎ = 26₍₇₎; 1201₍₂₎ mal escrita; menor base común de 2031₍ₙ₎, 425₍ₙ₎ y 106₍ₙ₎ = 7;
  // 2 cajas, 5 bolsitas y 7 sueltos de 4 = 59 = 323₍₄₎ (trampas 257, 263 y 223); 543₍₆₎ y 102₍₆₎; 30 caramelos con caja:
  // bolsitas de 5 (25 ≤ 30 < 36), 110₍₅₎; 45 caramelos con bolsitas de 7 = 63₍₇₎ (6 × 6 = 36 ≤ 45 < 49 = 7 × 7). Recalculadas
  // aparte en la fase 8 (scratchpad, correcciones-numeracion/cuentas.js). Ninguna figura muestra la respuesta: lo que se
  // pide va con «?». Los niveles 3 tienen varias rondas o dos condiciones (auditoría, M10).
  const sueltosF = (n, k, extra) => fig(Object.assign({ n, sueltos: k, rotulos: { sueltos: [[`${k} caramelos`, 'f', 700]] } }, extra || {}));
  const EJEMPLOS_AGRUPAR = [
    { nivel: 1, titulo: 'Bolsitas de 4',
      enunciado: ['Doña Juana tiene ', cant(11), ' caramelos sueltos y los junta en bolsitas de ', bas(4), '. ¿Cuántas bolsitas llena y cuántos caramelos quedan sueltos?'],
      datos: [DN.bolsita(4)],
      figura: sueltosF(4, 11, { regla: 1 }),
      solucion: [
        { texto: ['Cada ', bas(4), ' caramelos llenan una bolsita. Dos bolsitas usan 8; para 3 bolsitas harían falta 12, y solo hay 11.'], ecuacion: [cant(11), ' = ', cif(2), ' × ', bas(4), ' + ', cif(3)] },
        { texto: ['Sobran 11 − 8 = ', cif(3), ' caramelos: son menos que ', bas(4), ', no alcanzan para otra bolsita.'] },
      ],
      respuesta: [cif(2), ' bolsitas y ', cif(3), ' sueltos'] },
    { nivel: 1, titulo: 'Anotar la etiqueta',
      enunciado: ['En un puesto de bolsitas de ', bas(6), ', un pedido tiene ', cif(3), ' bolsitas y ', cif(5), ' caramelos sueltos. ¿Cómo se anota su etiqueta?'],
      datos: [DN.etiqueta],
      figura: fig({ n: 6, bolsitas: 3, sueltos: 5, regla: 1, rotulos: true, etiqueta: { cifras: '?' } }),
      solucion: [
        { texto: ['5 sueltos son menos que ', bas(6), ': ya no se puede juntar nada. La cifra de la izquierda cuenta bolsitas; la de la derecha, sueltos.'] },
        { texto: 'La base va abajo y entre paréntesis: dice de cuántos caramelos es cada bolsita.', ecuacion: [cif(3), ' bolsitas y ', cif(5), ' sueltos   →   ', num('35', 6)] },
      ],
      respuesta: ['La etiqueta es ', num('35', 6)] },
    { nivel: 1, titulo: 'Leer la etiqueta',
      enunciado: ['La etiqueta de un paquete cerrado dice ', num('42', 7), '. ¿Cuántas bolsitas hay adentro, de cuántos caramelos cada una, y cuántos sueltos?'],
      datos: [DN.etiqueta],
      solucion: [
        { texto: ['La base, abajo y entre paréntesis, es ', bas(7), ': cada bolsita lleva 7 caramelos.'] },
        { texto: ['Primero se anotan las bolsitas: el ', cif(4), '. Después los sueltos: el ', cif(2), '. Está bien anotada: 2 sueltos son menos que 7.'] },
      ],
      respuesta: [cif(4), ' bolsitas de ', bas(7), ' y ', cif(2), ' sueltos'] },
    { nivel: 1, titulo: 'Las cifras del puesto',
      enunciado: ['En el puesto de al lado, las bolsitas son de ', bas(3), ' caramelos. ¿Qué cifras pueden aparecer en sus etiquetas?'],
      datos: [DN.bolsita(3), ['Lo que llega a ', bas(3), ' se junta en el orden siguiente']],
      figura: fig({ n: 3, sueltos: 3, juntar: 'sueltos', regla: 1 }),
      solucion: [
        { texto: ['En cada orden pueden quedar 0, 1 o 2. Si quedan ', bas(3), ', se juntan: el 3 nunca se anota.'] },
        { texto: 'Tampoco aparecen 4, 5 ni las demás: son más que 3, y también se juntarían.' },
      ],
      respuesta: ['Solo ', cif('0, 1 y 2')] },
    { nivel: 1, titulo: '¿Está bien anotada?',
      enunciado: ['Un ayudante dejó 2 bolsitas de ', bas(5), ' y 6 sueltos, y anotó ', num('26', 5), '. ¿Está bien escrita la etiqueta?'],
      datos: [DN.cifras],
      figura: fig({ n: 5, bolsitas: 2, sueltos: 6, regla: 1, rotulos: true, colorCifras: false, etiqueta: { cifras: '26' } }),
      solucion: [
        { texto: ['En base ', bas(5), ' las cifras llegan hasta 4. La cifra ', cif(6), ' no existe: 6 sueltos todavía se pueden juntar.'] },
        { texto: 'Con 5 de ellos se llena otra bolsita: quedan 3 bolsitas y 1 suelto.', ecuacion: [num('26', 5), ' está mal   →   ', num('31', 5)] },
      ],
      respuesta: ['No: el 6 no existe en base 5. Va ', num('31', 5)] },
    { nivel: 2, titulo: 'Hasta la caja',
      enunciado: ['Doña Juana empaca ', cant(38), ' caramelos en bolsitas de ', bas(4), ', y cada ', bas(4), ' bolsitas van en una caja. ¿Qué etiqueta lleva el pedido?'],
      datos: [DN.bolsita(4), DN.caja(4)],
      figura: sueltosF(4, 38, { regla: 2, etiqueta: { cifras: '?' } }),
      solucion: [
        { texto: 'Primero los caramelos: 38 llenan 9 bolsitas y sobran 2.', ecuacion: [cant(38), ' = 9 × ', bas(4), ' + ', cif(2)] },
        { texto: ['Pero 9 bolsitas son más que ', bas(4), ': se juntan en 2 cajas y sobra 1 bolsita.'], ecuacion: ['9 = ', cif(2), ' × ', bas(4), ' + ', cif(1)] },
        { texto: ['Quedan 2 cajas, 1 bolsita y 2 sueltos: los tres, menos que ', bas(4), '.'] },
      ],
      respuesta: ['La etiqueta es ', num('212', 4)] },
    { nivel: 2, titulo: 'La etiqueta más grande',
      enunciado: ['En un puesto de bolsitas de ', bas(8), ', ¿cuál es la etiqueta más grande de dos cifras, y cuántos caramelos son?'],
      datos: [DN.bolsita(8), DN.cifras],
      figura: fig({ n: 8, cerrado: true, regla: 1, etiqueta: { cifras: '??' } }),
      solucion: [
        { texto: ['La cifra más grande en base ', bas(8), ' es 7: con 8 ya se junta. Con dos cifras: 7 bolsitas y 7 sueltos.'], ecuacion: [num('77', 8)] },
        { texto: ['7 bolsitas de 8 son 56 caramelos; con los 7 sueltos, ', cant(63), '.'], ecuacion: ['7 × ', bas(8), ' + 7 = ', cant(63)] },
      ],
      respuesta: [num('77', 8), ', con ', cant(63), ' caramelos'] },
    { nivel: 2, titulo: 'Mal empacado',
      enunciado: ['Un ayudante dejó 2 bolsitas de ', bas(5), ' y 9 caramelos sueltos. ¿Cómo debe quedar el pedido, y qué etiqueta lleva?'],
      datos: [DN.bolsita(5), DN.cifras],
      figura: fig({ n: 5, bolsitas: 2, sueltos: 9, regla: 1, rotulos: true, colorCifras: false, etiqueta: { cifras: '?' } }),
      solucion: [
        { texto: ['9 sueltos son más que ', bas(5), ': con 5 de ellos se llena otra bolsita y quedan 4.'], ecuacion: ['9 = 1 × ', bas(5), ' + ', cif(4)] },
        { texto: 'Las bolsitas pasan de 2 a 3. Ya no se puede juntar nada.', ecuacion: [cif(3), ' bolsitas y ', cif(4), ' sueltos   →   ', num('34', 5)] },
      ],
      respuesta: [cif(3), ' bolsitas y ', cif(4), ' sueltos: ', num('34', 5)] },
    { nivel: 2, titulo: 'Dos puestos, un pedido',
      enunciado: ['Un cliente pide ', cant(20), ' caramelos. ¿Qué etiqueta lleva el pedido en el puesto de bolsitas de ', bas(6), ', y en el de bolsitas de ', bas(7), '?'],
      datos: [DN.etiqueta],
      figura: sueltosF(6, 20, { regla: [[['Puesto A: bolsitas de '], ['6', 'i', 700]], [['Puesto B: bolsitas de '], ['7', 'i', 700]]] }),
      solucion: [
        { texto: ['Con bolsitas de ', bas(6), ': 3 bolsitas usan 18 y sobran 2.'], ecuacion: [cant(20), ' = ', cif(3), ' × ', bas(6), ' + ', cif(2), '   →   ', num('32', 6)] },
        { texto: ['Con bolsitas de ', bas(7), ': 2 bolsitas usan 14 y sobran 6, menos que 7.'], ecuacion: [cant(20), ' = ', cif(2), ' × ', bas(7), ' + ', cif(6), '   →   ', num('26', 7)] },
        { texto: 'Los mismos 20 caramelos llevan otra etiqueta: con bolsitas más grandes salen menos bolsitas.' },
      ],
      respuesta: [num('32', 6), ' y ', num('26', 7)] },
    { nivel: 2, titulo: '¿Cuál está mal escrita?',
      enunciado: '¿Cuál de estas etiquetas está mal escrita?',
      alternativas: [[num('304', 5)], [num('2110', 3)], [num('657', 8)], [num('1201', 2)]],
      datos: [DN.cifras],
      solucion: [
        { texto: ['Comparo la cifra más grande de cada una con su base: en ', letra('A'), ', 4 < 5; en ', letra('B'), ', 2 < 3; en ', letra('C'), ', 7 < 8.'] },
        { texto: ['En ', letra('D'), ', la base es ', bas(2), ': solo existen el 0 y el 1. La cifra 2 no existe.'] },
      ],
      respuesta: [letra('D'), ', ', num('1201', 2)] },
    { nivel: 3, titulo: 'Una base para tres',
      enunciado: ['Los numerales ', num('2031', 'n'), ', ', num('425', 'n'), ' y ', num('106', 'n'), ' están escritos en la misma base ', bas('n'), '. ¿Cuál es la menor base posible?'],
      alternativas: ['5', '6', '7', '10'],
      datos: [DN.cifras],
      solucion: [
        { texto: 'La base tiene que ser mayor que todas las cifras de los tres numerales, no solo que las del primero.' },
        { texto: ['La cifra más grande es el 6, de ', num('106', 'n'), '. La base pasa al 6: la menor es 7.'], ecuacion: ['6 < ', bas('n'), '   →   ', bas('n'), ' = ', bas(7)] },
        { texto: ['Con 5 o 6 no alcanza: el 6 no existiría. Con 10 sirve, pero no es la menor.'] },
      ],
      respuesta: [letra('C', 'base'), ', base ', bas(7)] },
    { nivel: 3, titulo: 'Reempacar dos órdenes',
      enunciado: ['En el puesto de bolsitas de ', bas(4), ', un ayudante dejó 2 cajas, 5 bolsitas y 7 caramelos sueltos. Doña Juana lo empaca bien. ¿Qué etiqueta lleva el pedido?'],
      alternativas: [[num('263', 4)], [num('223', 4)], [num('323', 4)], [num('257', 4)]],
      datos: [DN.bolsita(4), DN.caja(4), DN.cifras],
      figura: fig({ n: 4, cajas: 2, bolsitas: 5, sueltos: 7, regla: 2, rotulos: true, colorCifras: false, etiqueta: { cifras: '?' } }),
      solucion: [
        { texto: ['Primero los sueltos: 7 son más que ', bas(4), '. Con 4 se llena otra bolsita y quedan 3.'], ecuacion: ['7 = 1 × ', bas(4), ' + ', cif(3)] },
        { texto: ['Ahora hay 5 + 1 = 6 bolsitas, más que ', bas(4), ': con 4 se llena otra caja y quedan 2 bolsitas.'], ecuacion: ['6 = 1 × ', bas(4), ' + ', cif(2)] },
        { texto: ['Quedan 2 + 1 = 3 cajas, 2 bolsitas y 3 sueltos: ninguno llega a ', bas(4), '.'], ecuacion: [cif(3), ' cajas, ', cif(2), ' bolsitas y ', cif(3), ' sueltos   →   ', num('323', 4)] },
        { texto: ['Las trampas: ', letra('D'), ' anota sin juntar; ', letra('A'), ' junta solo los sueltos y deja 6 bolsitas; ', letra('B'), ' llena la caja nueva y no la suma.'] },
      ],
      respuesta: [letra('C'), ': ', num('323', 4)] },
    { nivel: 3, titulo: 'Tres cifras distintas',
      enunciado: ['En base ', bas(6), ', ¿cuál es el mayor numeral de tres cifras distintas, y cuál el menor?'],
      datos: [DN.cifras, DN.primera],
      solucion: [
        { texto: ['En base ', bas(6), ' las cifras van de 0 a 5. El mayor usa las tres más grandes, de mayor a menor.'], ecuacion: [num('543', 6)] },
        { texto: 'El menor empieza con la cifra más chica que no es 0, el 1; después van el 0 y el 2.', ecuacion: [num('102', 6)] },
        { texto: 'No sirven 555, que repite cifras, ni 012, que empieza en 0 y en realidad tiene dos cifras.' },
      ],
      respuesta: ['Mayor, ', num('543', 6), '; menor, ', num('102', 6)] },
    { nivel: 3, titulo: 'Una caja para 30',
      enunciado: ['Doña Juana quiere que un pedido de ', cant(30), ' caramelos lleve al menos una caja. ¿Cuál es la bolsita más grande que sirve, y qué etiqueta sale?'],
      datos: [['1 caja = ', bas('n'), ' bolsitas = ', bas('n'), ' × ', bas('n'), ' caramelos'], DN.cifras],
      figura: fig({ sueltos: 30, rotulos: { sueltos: [['30 caramelos', 'f', 700]] }, regla: [[['1 bolsita = '], ['?', 'i', 700], [' caramelos']]], etiqueta: { cifras: '?', base: '?' } }),
      solucion: [
        { texto: ['Para llenar una caja hacen falta ', bas('n'), ' × ', bas('n'), ' caramelos, y tienen que alcanzar con 30.'] },
        { texto: ['Con bolsitas de ', bas(6), ' no: ', bas(6), ' × ', bas(6), ' = 36, más que 30. Con bolsitas de ', bas(5), ' sí: ', bas(5), ' × ', bas(5), ' = 25.'] },
        { texto: 'Dos rondas: 30 caramelos llenan 6 bolsitas y no sobra ninguno; 6 bolsitas llenan 1 caja y sobra 1 bolsita.', ecuacion: [cant(30), ' = 6 × ', bas(5), ' + ', cif(0), SEP, '6 = ', cif(1), ' × ', bas(5), ' + ', cif(1)] },
      ],
      respuesta: ['Bolsitas de ', bas(5), '; etiqueta ', num('110', 5)] },
    { nivel: 3, titulo: 'Bolsitas para 45',
      enunciado: ['Doña Juana quiere anotar ', cant(45), ' caramelos con solo dos cifras, sin llenar ninguna caja. ¿Cuál es la bolsita más chica que sirve, y qué etiqueta sale?'],
      datos: [['1 caja = ', bas('n'), ' bolsitas = ', bas('n'), ' × ', bas('n'), ' caramelos'], DN.cifras],
      figura: fig({ sueltos: 45, rotulos: { sueltos: [['45 caramelos', 'f', 700]] }, regla: [[['1 bolsita = '], ['?', 'i', 700], [' caramelos']]], etiqueta: { cifras: '?', base: '?' } }),
      solucion: [
        { texto: ['Con dos cifras hay a lo más ', bas('n'), ' − 1 bolsitas: para no llenar una caja, 45 tiene que ser menos que ', bas('n'), ' × ', bas('n'), '.'] },
        { texto: ['Con bolsitas de ', bas(6), ' no: ', bas(6), ' × ', bas(6), ' = 36, y 45 llenaría una caja. Con bolsitas de ', bas(7), ' sí: ', bas(7), ' × ', bas(7), ' = 49, más que 45.'] },
        { texto: '45 caramelos en bolsitas de 7 dan 6 bolsitas y sobran 3.', ecuacion: [cant(45), ' = ', cif(6), ' × ', bas(7), ' + ', cif(3), '   →   ', num('63', 7)] },
      ],
      respuesta: ['Bolsitas de ', bas(7), '; etiqueta ', num('63', 7)] },
  ];

  const agrupar = {
    id: 'agrupar',
    titulo: 'Agrupar de n en n',
    pregunta: '¿Por qué en base 5 no existe la cifra 5?',
    temas: ['Base de un sistema'],
    pieza: PU,
    aprendizaje: 'En base n, n de un orden forman 1 del siguiente: las cifras van de 0 a n − 1; la cifra n no existe.',
    actividad: 'Empacar caramelos en bolsitas de un mismo tamaño y leer la etiqueta.',
    // Lee: el puesto, la etiqueta (la notación 23₍₅₎ se presenta aquí, antes de usarla) y los órdenes. No dice qué pasa
    // cuando las bolsitas llegan a n (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'El puesto de doña Juana', texto: ['En el mercado de Juliaca, doña Juana vende caramelos. No los cuenta uno por uno: los junta en bolsitas iguales. Lo que lleva cada bolsita se llama ', bas('n'), '; aquí, ', bas('n'), ' = ', bas(5), '. Nunca deja ', bas(5), ' sueltos: con ', bas(5), ' llena otra bolsita.'],
          pieza: PU, dibujo: { datos: { n: 5, bolsitas: 2, sueltos: 3, regla: 1, rotulos: true, colorCifras: false }, estado: {} } },
        { titulo: 'La etiqueta', texto: ['Cada pedido lleva una etiqueta. 2 bolsitas y 3 sueltos se anota 23₍₅₎ y se lee «dos, tres en base cinco». El 2 y el 3 son cifras; todo lo escrito, un numeral. El 5 de abajo es la base de numeración.'],
          ecuacion: [cif(2), ' bolsitas y ', cif(3), ' sueltos   →   ', num('23', 5)],
          pieza: PU, dibujo: { datos: { n: 5, bolsitas: 2, sueltos: 3, regla: 1, rotulos: true, etiqueta: { cifras: '23' } }, estado: {} } },
        { titulo: 'Órdenes y base 10', texto: ['Sueltos, bolsitas y cajas son los órdenes del pedido: una caja guarda 5 bolsitas. Nosotros contamos de 10 en 10: diez monedas de S/ 1 son un billete de S/ 10. Un numeral sin base escrita está en base 10.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a cambiar cuántos caramelos hay y de cuántos es la bolsita, ', bas('n'), '. Mira cuántas bolsitas salen, cuántos caramelos sobran y qué cifras aparecen en la etiqueta.'] },
      ],
    },
    ejemplos: EJEMPLOS_AGRUPAR,
    juega: {
      pieza: PU,
      consigna: 'Doña Juana junta los caramelos en bolsitas iguales, de 5 a 9 caramelos, y anota cada pedido en su etiqueta.',
      mision: {
        texto: ['Con bolsitas de ', bas(6), ', arma un pedido que se anote ', num('40', 6), '.'],
        logrado: val => val.b === 6 && val.n === 24,
        bien: 'Listo: 4 bolsitas de 6 son 24, y el 0 dice que no sobró ninguno.',
      },
      voz: '¿Cuántas bolsitas salen y cuántos caramelos sobran?',
      leyenda: [
        { s: cant('13'), t: 'caramelos del pedido, contados uno por uno' },
        { s: bas('n'), t: 'caramelos por bolsita: la base' },
        { s: cif('2'), t: 'cifra: cuántas bolsitas o cuántos sueltos' },
        { s: num('23', 5), t: 'etiqueta: 2 bolsitas de 5 y 3 sueltos' },
        { s: '→', t: 'se anota en la etiqueta' },
      ],
      controles: [
        { id: 'n', etiqueta: 'Caramelos del pedido', color: 'c-f', min: 5, max: 24, paso: 1, inicio: 13, decimales: 0 },
        { id: 'b', etiqueta: 'Caramelos por bolsita, n', color: 'c-i', min: 5, max: 9, paso: 1, inicio: 5, decimales: 0 },
      ],
      dibujo: v => ({ datos: puestoJ(v, escalaJ()), estado: {} }),
      // La relación: los caramelos son bolsitas de n más sueltos, y eso se anota así.
      lectura: v => {
        const q = Math.floor(v.n / v.b), s = v.n % v.b;
        return [cant(v.n), ' caramelos = ', cif(q), q === 1 ? ' bolsita de ' : ' bolsitas de ', bas(v.b), ' + ', cif(s), s === 1 ? ' suelto   →   ' : ' sueltos   →   ', num(enBase(v.n, v.b), v.b)];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['Doña Juana tiene un pedido anotado ', num('44', 5), ': ', cif(4), ' bolsitas y ', cif(4), ' sueltos. En su puesto, ', bas(5), ' bolsitas llenan una caja. Le llega un caramelo más. ¿Cómo queda la etiqueta?'],
      datos: [DN.bolsita(5), DN.caja(5)],
      voz: 'Piensa qué hace doña Juana con el caramelo nuevo.',
      opciones: [
        { id: 'c', texto: [num('100', 5)], correcta: true },
        { id: 'cifra-b', texto: [num('45', 5)], error: 'AT-CIFRA-B', siFuera: 'Sumar el caramelo a los sueltos está bien. Pero 5 sueltos ya llenan una bolsita: la cifra 5 no existe.' },
        { id: 'una', texto: [num('50', 5)], error: 'AT-LLEVA-UNA', siFuera: 'Bien: los 5 sueltos llenan una bolsita. Pero ahora hay 5 bolsitas, y 5 bolsitas llenan una caja.' },
        { id: 'pierde', texto: [num('40', 5)], error: 'AT-PIERDE', siFuera: 'El 0 de los sueltos está bien: no queda ninguno. Pero la bolsita nueva tiene que contarse.' },
      ],
      dibujo: fig({ n: 5, bolsitas: 4, sueltos: 4, llega: 1, regla: 2, rotulos: true, escala: 1.2, etiqueta: { cifras: '?' } }),
      revelar: fig({ n: 5, cajas: 1, ceros: true, regla: 2, rotulos: true, escala: 1.2, etiqueta: { cifras: '100' } }),
      coincide: 'Coincide: los 5 sueltos llenan una bolsita, y las 5 bolsitas, una caja.',
      noCoincide: 'Revisemos: con 5 sueltos se llena una bolsita, y entonces hay 5 bolsitas.',
    },
    mira: {
      pieza: PU,
      datos: MIRA,
      voz: 'Junta lo que se pueda juntar, de los sueltos hacia arriba.',
      pasos: [
        { estado: { paso: 0 }, texto: ['El pedido ', num('44', 5), ' tiene 4 bolsitas y 4 sueltos. Llega un caramelo.'], ecuacion: ['4 sueltos + 1 = ', bas(5), ' sueltos'] },
        { estado: { paso: 1 }, texto: ['Cinco sueltos llenan una bolsita: se embolsan.'], ecuacion: [bas(5), ' sueltos = 1 bolsita'] },
        { estado: { paso: 2 }, texto: ['Ahora hay 5 bolsitas: con ellas se llena una caja.'], ecuacion: [bas(5), ' bolsitas = 1 caja'] },
        { estado: { paso: 3 }, texto: 'Ya no se puede juntar nada: 1 caja, 0 bolsitas y 0 sueltos.', ecuacion: [num('100', 5), ' = ', cif(1), ' caja + ', cif(0), ' bolsitas + ', cif(0), ' sueltos'] },
        { estado: { paso: 4 }, texto: ['Ninguna cifra llega a 5: en base ', bas(5), ' van de 0 a 4.'], ecuacion: ['cifras en base ', bas(5), ': ', cif('0, 1, 2, 3, 4')] },
      ],
    },
    regla: {
      texto: 'En base n, cada n de un orden se juntan en 1 del orden siguiente. Por eso ninguna cifra llega a n: van de 0 a n − 1.',
      ecuacion: [bas('n'), ' de un orden = 1 del siguiente', SEP, '0 ≤ ', cif('cifra'), ' ≤ ', bas('n'), ' − 1'],
      condicion: 'n es 2 o más. Con varias cifras, no se empieza con 0: 05 es 5. Sin base escrita, es 10.',
      voz: 'Junta hasta que ningún orden llegue a n.',
    },
    // Así se resuelve: empacar un montón en bolsitas y cajas (dos rondas) y escribir la etiqueta. «Ahora tú» pide otra
    // cosa: la cifra que no existe, la menor base, el numeral que sigue o lo que queda cuando llegan caramelos.
    resuelve: {
      pieza: PU,
      generar(s) {
        const r = azar(s + 900), n = r.ent(3, 5), N = r.ent(n * n, Math.min(n * n * n - 1, 80));
        const b1 = Math.floor(N / n), s0 = N % n, c2 = Math.floor(b1 / n), b1r = b1 % n, cifras = enBase(N, n);
        return {
          enunciado: ['Doña Juana tiene ', cant(N), ' caramelos sueltos. Los empaca en bolsitas de ', bas(n), ', y cada ', bas(n), ' bolsitas van en una caja. ¿Qué etiqueta lleva el pedido?'],
          datos: [DN.bolsita(n), DN.caja(n), 'Etiqueta: primero las cajas, después las bolsitas y al final los sueltos; abajo, la base'],
          dibujo: sueltosF(n, N, { regla: 2, etiqueta: { cifras: '?' } }),
          pasos: [
            { tipo: 'pide', texto: 'Piden la etiqueta: cuántas cajas, bolsitas y sueltos quedan cuando ya no se puede juntar nada.' },
            { tipo: 'regla', texto: ['Cada ', bas(n), ' de un orden se juntan en 1 del orden siguiente. Lo que queda de cada orden es menos que ', bas(n), '.'] },
            { tipo: 'cuentas', texto: `Ronda 1: ${N} caramelos llenan ${pl(b1, 'bolsita', 'bolsitas')} y sobran ${s0}. Ronda 2: ${pl(b1, 'bolsita', 'bolsitas')} llenan ${pl(c2, 'caja', 'cajas')} y sobran ${b1r}.`,
              ecuacion: [cant(N), ` = ${b1} × `, bas(n), ' + ', cif(s0), SEP, `${b1} = `, cif(c2), ' × ', bas(n), ' + ', cif(b1r)],
              dibujo: fig({ n, cajas: c2, bolsitas: b1r, sueltos: s0, ceros: true, regla: 2, rotulos: true, etiqueta: { cifras: cifras } }) },
            { tipo: 'sentido', texto: `De vuelta: ${pl(c2, 'caja', 'cajas')} son ${c2 * n} bolsitas, más ${b1r}, ${b1}; ${b1} bolsitas son ${b1 * n} caramelos, más ${s0}, ${N}. Cada cifra es menor que ${n}.` },
          ],
          respuesta: ['La etiqueta es ', num(cifras, n)],
        };
      },
    },
    ahoraTu: {
      pieza: PU,
      voz: 'Junta lo que se pueda; ninguna cifra llega a la base.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoMalEscrito, r);
        if (tipo === 1) return conCuatro(casoMenorBase, r);
        if (tipo === 2) return conCuatro(q => casoSucesor(q, Math.floor(sem / 5)), r);
        if (tipo === 3) return conCuatro(casoLlegan, r);
        return conCuatro(q => casoBases(q, sem), r);
      },
    },
  };

  // ---------- Idea 2 (rehecha, 17 nov): cada cifra vale según su lugar (descomposición polinómica) ----------
  // Objeto: la etiqueta 132 del puesto con bolsitas de distinto tamaño. El quipu de la propuesta no entra: la fuente
  // verificada (Locke 1912) da la base 10 por niveles, pero no «un nivel vacío es un 0» (Ascher y Ascher 1981, sin abrir;
  // docs/investigacion/historia-ganchos.md, fila del quipucamayoc). Decisión de Gerson: sin fuente, sale.
  // Cambia: la base, con la misma etiqueta 132. · Permanece: las tres cifras y sus lugares. · Progresa: lo que guarda una
  // caja (n × n) y el pedido entero. · Se reserva: el 0 en medio y el orden de los lugares (la predicción: 203₍₅₎ = 53).
  // · Debe verse: una caja guarda n × n caramelos; las mismas cifras valen más con una base mayor.
  // Errores (hipótesis de aula, sin medir): AT-DECIMAL lee el numeral en base 10 · AT-ORDEN da la potencia mayor a la
  // cifra de la derecha · AT-CERO-LUGAR se salta el 0 y corre los lugares · AT-SUMA suma las cifras sin su lugar ·
  // AT-BASE-MAYOR cree que vale más el de la base mayor · AT-PRIMERA compara solo la primera cifra · AT-PRODUCTO lee a̅b̅c̅
  // como a × b × c · AT-SIN-UNIDADES olvida que la cifra de la derecha vale 1 · AT-CIFRA-B toma n como la cifra mayor.
  const ped132 = n => ({ n, cajas: 1, bolsitas: 3, sueltos: 2, regla: 2, rotulos: true, etiqueta: { cifras: '132' } });
  let escD = null;
  const escalaD = () => escD || (escD = escalaDe([4, 5, 6, 7, 8, 9].map(ped132)));
  // «Mira» y Predice: el pedido 203₍₅₎ (2 cajas, ninguna bolsita, 3 sueltos), a una sola escala.
  const P203 = { n: 5, cajas: 2, bolsitas: 0, sueltos: 3, ceros: true, regla: 2, etiqueta: { cifras: '203' } };
  const R203 = { cajas: '2 cajas', bolsitas: '0 bolsitas', sueltos: '3 sueltos' };
  // Escala fija (la pieza se carga después de este archivo): la que hace caber el paso más ancho; numeracion.test.js
  // comprueba que sea la que da escalaDe y que ningún paso la necesite menor.
  const ESC203 = 1.2;
  const MIRA2 = Object.assign({}, P203, { escala: ESC203, pasos: [
    { rotulos: R203 },
    { rotulos: Object.assign({}, R203, { cajas: '2 × 25 = 50' }) },
    { rotulos: Object.assign({}, R203, { cajas: '2 × 25 = 50', bolsitas: '0 × 5 = 0' }) },
    { rotulos: { cajas: '2 × 25 = 50', bolsitas: '0 × 5 = 0', sueltos: '3 × 1 = 3' } },
    { rotulos: { cajas: '2 × 25 = 50', bolsitas: '0 × 5 = 0', sueltos: '3 × 1 = 3' }, regla: [[['1 caja = 25 caramelos']], [['Total: 50 + 0 + 3 = '], ['53', 'f', 700]]] },
    // Con letras (paso 6 y figura de «La regla»): el letrero dice n y cada lugar tiene algo dibujado, para que «b × n» no
    // quede bajo un lugar vacío (ronda 2 del lector, 18 nov).
    { cajas: 1, bolsitas: 1, sueltos: 1, rotulos: { cajas: [['a', 'o', 700], [' × n²']], bolsitas: [['b', 'o', 700], [' × n']], sueltos: [['c', 'o', 700], [' × 1']] },
      regla: [[['1 bolsita = '], ['n', 'i', 700], [' caramelos']], [['1 caja = '], ['n', 'i', 700], [' bolsitas']]], etiqueta: { cifras: 'abc', base: 'n' } },
  ] });
  // Opción: la descomposición escrita (para «Ahora tú», tipo 2).
  const descOp = (letras, pesos) => letras.flatMap((l, i) => [i ? ' + ' : '', cif(l)].concat(pesos[i] === '1' ? [] : [' × ', pesos[i]])).filter(x => x !== '');
  const lugares = (k, n) => Array.from({ length: k }, (_, i) => { const e = k - 1 - i; return e === 0 ? '1' : e === 1 ? bas(n) : pot(n, String(e)); });

  // Ahora tú 2 · tipo 0: el valor en base 10 de un pedido (3 o 4 cifras; a veces con un 0 en medio).
  function casoValor(r, sem) {
    const n = r.ent(3, 9), k = r.ent(3, 4);
    const c = [r.ent(1, n - 1)].concat(Array.from({ length: k - 1 }, () => r.ent(0, n - 1)));
    if (sem % 3 === 0) c[r.ent(1, k - 2)] = 0;
    const t = c.join(''), v = valor(t, n), rev = valor(t.split('').reverse().join(''), n);
    const sinCero = t.includes('0', 1) ? valor(t.replace(/0/g, ''), n) : null;
    const suma = c.reduce((a, x) => a + x, 0);
    const pregunta = sem % 2 === 0
      ? ['Un pedido del puesto de bolsitas de ', bas(n), ' se anota ', num(t, n), '. ¿Cuántos caramelos tiene?']
      : ['¿Cuánto vale ', num(t, n), ' en base 10?'];
    return {
      pregunta,
      datos: [DD.fk(k, n), DD.pot(n, k)],
      opciones: opciones(v, [
        { id: 'decimal', valor: +t, error: 'AT-DECIMAL', siFuera: `Leer ${t} sería cierto en base 10. Aquí cada lugar vale ${n} veces el de su derecha.` },
        { id: 'orden', valor: rev, error: 'AT-ORDEN', siFuera: 'Multiplicar cada cifra por una potencia está bien. Pero la mayor va con la cifra de la izquierda.' },
        sinCero !== null
          ? { id: 'cero', valor: sinCero, error: 'AT-CERO-LUGAR', siFuera: 'Bien que el 0 no sume. Pero ocupa su lugar: las cifras de su izquierda no se corren.' }
          : { id: 'suma', valor: suma * n, error: 'AT-SUMA', siFuera: 'Usar la base está bien. Pero cada cifra va con la potencia de su lugar, no todas con la misma.' },
      ]),
      solucion: { texto: 'Cada cifra por lo que vale su lugar, y se suma todo.',
        ecuacion: [num(t, n), ' = ', c.map((x, i) => `${x} × ${n ** (k - 1 - i)}`).join(' + '), ' = ', cant(v)] },
    };
  }
  // Ahora tú 2 · tipo 1: ¿cuál de cuatro pedidos de puestos distintos tiene más caramelos?
  function casoMayor(r) {
    for (;;) {
      const todas = [3, 4, 5, 6, 7, 8, 9];
      for (let i = todas.length - 1; i > 0; i--) { const j = r.ent(0, i); [todas[i], todas[j]] = [todas[j], todas[i]]; }
      const bases = todas.slice(0, 4);
      // De dos o tres cifras: leer en base 10 (AT-DECIMAL) y mirar solo la primera cifra (AT-PRIMERA) dan otro mayor.
      const ns = bases.map(n => [r.ent(1, n - 1)].concat(Array.from({ length: r.ent(1, 2) }, () => r.ent(0, n - 1))).join(''));
      const v = ns.map((t, i) => valor(t, bases[i])), dec = ns.map(t => +t), pri = ns.map(t => +t[0]);
      const arg = xs => { const m = Math.max(...xs); return xs.filter(x => x === m).length === 1 ? xs.indexOf(m) : -1; };
      const iv = arg(v), ib = arg(bases), id = arg(dec), ip = arg(pri);
      if ([iv, ib, id, ip].includes(-1) || new Set([iv, ib, id, ip]).size < 4) continue;
      const op = i => opNum(ns[i], bases[i]);
      return {
        pregunta: ['Cuatro puestos anotan sus pedidos: ', num(ns[0], bases[0]), ', ', num(ns[1], bases[1]), ', ', num(ns[2], bases[2]), ' y ', num(ns[3], bases[3]), '. ¿Cuál tiene más caramelos?'],
        datos: [DD.f3('n'), DD.f2('n')],
        opciones: opcionesNum(op(iv), [
          { id: 'base', texto: op(ib), error: 'AT-BASE-MAYOR', siFuera: `Su base es la mayor, es cierto. Pero sus cifras pesan menos: vale ${v[ib]}, y hay uno de ${v[iv]}.` },
          { id: 'decimal', texto: op(id), error: 'AT-DECIMAL', siFuera: `Leído en base 10 parece el mayor. Pero en base ${bases[id]} vale ${v[id]}.` },
          { id: 'primera', texto: op(ip), error: 'AT-PRIMERA', siFuera: `Su primera cifra es la mayor. Pero las cajas de su puesto son chicas: vale ${v[ip]}.` },
        ]),
        solucion: { texto: 'Se pasa cada uno a base 10 y se comparan los valores.',
          ecuacion: ns.flatMap((t, i) => [i ? ';  ' : '', num(t, bases[i]), ' = ', i === iv ? cant(v[i]) : String(v[i])]).filter(x => x !== '') },
      };
    }
  }
  // Ahora tú 2 · tipo 2: la descomposición de un numeral con letras (la raya: son cifras, no un producto).
  function casoLetras(r) {
    const n = r.ent(4, 9), k = r.ent(3, 4), L = ['a', 'b', 'c', 'd'].slice(0, k), t = L.join('');
    const pes = lugares(k, n), p10 = Array.from({ length: k }, (_, i) => (k - 1 - i === 0 ? '1' : k - 1 - i === 1 ? '10' : { sup: ['10', String(k - 1 - i)] }));
    return {
      pregunta: ['¿Cuál es la descomposición de ', num(t, n), '?'],
      datos: [DN.todo(n), 'La raya encima dice que las letras son cifras'],
      opciones: opcionesNum(descOp(L, pes), [
        { id: 'decimal', texto: descOp(L, p10), error: 'AT-DECIMAL', siFuera: `Así se descompone en base 10. Aquí cada lugar vale ${n} veces el de su derecha.` },
        { id: 'orden', texto: descOp(L.slice().reverse(), pes), error: 'AT-ORDEN', siFuera: 'Cada cifra con una potencia, bien. Pero la mayor va con la cifra de la izquierda.' },
        { id: 'producto', texto: L.flatMap((l, i) => [i ? ' × ' : '', cif(l)]).filter(x => x !== ''), error: 'AT-PRODUCTO', siFuera: 'Sin raya, abc sería un producto. La raya dice que son cifras de un numeral.' },
      ]),
      solucion: { texto: `La cifra de la izquierda va con la potencia mayor; la de la derecha vale 1.`, ecuacion: [num(t, n), ' = '].concat(descOp(L, pes)) },
    };
  }
  // Ahora tú 2 · tipo 3 (nivel examen): a̅b̅₍ₙ₎ + b̅a̅₍ₙ₎ si se conoce a + b.
  function casoCruzados(r) {
    const n = r.ent(4, 9), a = r.ent(1, n - 1), b = r.ent(1, n - 1), S = a + b;
    return {
      pregunta: ['Si ', cif('a'), ' + ', cif('b'), ' = ', cif(S), ', ¿cuánto vale ', num('ab', n), ' + ', num('ba', n), '?'],
      datos: [DD.f2(n), 'a y b son cifras distintas de 0'],
      opciones: opciones((n + 1) * S, [
        { id: 'decimal', valor: 11 * S, error: 'AT-DECIMAL', siFuera: `Así sale en base 10, con 10 + 1 = 11. Aquí la base es ${n}.` },
        { id: 'sin-unidades', valor: n * S, error: 'AT-SIN-UNIDADES', siFuera: `Bien que juntes a y b. Pero la cifra de la derecha también cuenta: vale 1.` },
        { id: 'suma', valor: 2 * S, error: 'AT-SUMA', siFuera: `Sumar las cifras está bien. Pero cada una vale según su lugar: la de la izquierda, ${n} veces.` },
      ]),
      solucion: { texto: `Las a suman ${n} + 1 veces a, y las b también.`,
        ecuacion: ['(', cif('a'), ` × ${n} + `, cif('b'), ') + (', cif('b'), ` × ${n} + `, cif('a'), `) = ${n + 1} × (`, cif('a'), ' + ', cif('b'), `) = ${n + 1} × ${S} = `, cant((n + 1) * S)] },
    };
  }
  // Ahora tú 2 · tipo 4 (nivel examen): el mayor numeral de k cifras en base n, en base 10.
  function casoMayorK(r) {
    const n = r.ent(3, 9), k = r.ent(2, 3), t = String(n - 1).repeat(k), v = n ** k - 1;
    return {
      pregunta: ['¿Cuánto vale en base 10 el mayor numeral de ', cif(k), ' cifras en base ', bas(n), '?'],
      datos: [DN.cifras, DD.fk(k, n)],
      opciones: opciones(v, [
        { id: 'decimal', valor: +t, error: 'AT-DECIMAL', siFuera: `${t} es el mayor numeral, bien. Pero falta pasarlo a base 10.` },
        { id: 'cifra-n', valor: Array.from({ length: k }, (_, i) => n * n ** i).reduce((x, y) => x + y, 0), error: 'AT-CIFRA-B', siFuera: `Bien que uses la cifra mayor. Pero en base ${n} la mayor es ${n - 1}, no ${n}.` },
        { id: 'suma', valor: k * (n - 1), error: 'AT-SUMA', siFuera: `${t} es el mayor numeral, bien. Pero sumar sus cifras no da su valor.` },
      ]),
      solucion: { texto: `La cifra mayor en base ${n} es ${n - 1}: el mayor numeral es ${numT(t, n)}.`,
        ecuacion: [num(t, n), ' = ', Array.from({ length: k }, (_, i) => `${n - 1} × ${n ** (k - 1 - i)}`).join(' + '), ' = ', cant(v)] },
    };
  }

  // Ejemplos resueltos de la idea 2. Cuentas rehechas aparte, sin este archivo (scratchpad de la sesión, cuentas-f3.js):
  // 34₍₅₎ = 19; caja de 6 = 36; 213₍₄₎ = 39; 112₍₃₎ = 14; 2113₍₄₎ = 151; 215₍₆₎ = 83 > 312₍₄₎ = 54 > 141₍₅₎ = 46;
  // 2a3₍₅₎ = 68 → a = 3; 555₍₆₎ = 215; 34₍₅₎ = 23₍₈₎ = 19; a̅b̅ + b̅a̅ = 154 → a + b = 14; 345₍₇₎ − 234₍₇₎ = 57;
  // 543₍₆₎ − 102₍₆₎ = 207 − 38 = 169; a0a₍₆₎ = 185 → a = 5 y 55₍₆₎ = 35; a̅b̅₍₇₎ = b̅a̅₍₅₎ → 23₍₇₎ = 32₍₅₎ = 17.
  // Ninguna figura muestra lo que se pide: el total en caramelos no se escribe, solo se dibujan las cajas y bolsitas.
  // Los niveles 1 y 2 no llevan un 0 entre otras cifras: el 0 en medio es lo que reserva la predicción, y la pestaña
  // Ejemplos se abre antes de Predice (auditoría, M2; lo comprueba numeracion.test.js). Recalculadas aparte en la fase 8.
  const EJEMPLOS_DESCOMPOSICION = [
    { nivel: 1, titulo: 'Dos cifras',
      enunciado: ['La etiqueta de un pedido dice ', num('34', 5), '. ¿Cuántos caramelos tiene?'],
      datos: [DN.bolsita(5), DD.f2('n')],
      figura: fig({ n: 5, bolsitas: 3, sueltos: 4, regla: 1, rotulos: true, etiqueta: { cifras: '34' } }),
      solucion: [
        { texto: ['El 3 cuenta bolsitas de ', bas(5), ' y el 4 cuenta sueltos, que valen 1 cada uno.'] },
        { texto: '3 bolsitas son 15 caramelos; con los 4 sueltos, 19.', ecuacion: [num('34', 5), ' = 3 × ', bas(5), ' + 4 = 15 + 4 = ', cant(19)] },
      ],
      respuesta: [cant(19), ' caramelos'] },
    { nivel: 1, titulo: 'Lo que guarda una caja',
      enunciado: ['En el puesto de bolsitas de ', bas(6), ', ¿cuántos caramelos guarda una caja?'],
      datos: [DN.bolsita(6), DN.caja(6)],
      figura: fig({ n: 6, cajas: 1, regla: 2, rotulos: true }),
      solucion: [
        { texto: ['Una caja tiene ', bas(6), ' bolsitas, y cada bolsita, ', bas(6), ' caramelos: 6 veces 6.'], ecuacion: ['1 caja = ', bas(6), ' × ', bas(6), ' = ', pot(6, '2'), ' = ', cant(36)] },
        { texto: 'Por eso, en base 6, el lugar de las cajas vale 36: es una potencia de la base.' },
      ],
      respuesta: [cant(36), ' caramelos'] },
    { nivel: 1, titulo: 'Tres cifras en base 4',
      enunciado: ['¿Cuánto vale ', num('213', 4), ' en base 10?'],
      datos: [DD.f3('n'), [pot('n', '2'), ' = ', bas('n'), ' × ', bas('n')]],
      solucion: [
        { texto: ['En base ', bas(4), ', los lugares valen 1, 4 y 4 × 4 = 16, de derecha a izquierda.'] },
        { texto: 'Cada cifra por lo que vale su lugar, y se suma todo.', ecuacion: [num('213', 4), ' = 2 × 16 + 1 × 4 + 3 = 32 + 4 + 3 = ', cant(39)] },
      ],
      respuesta: ['Vale ', cant(39)] },
    { nivel: 1, titulo: 'Una caja, una bolsita',
      enunciado: ['Un pedido del puesto de bolsitas de ', bas(3), ' se anota ', num('112', 3), '. ¿Cuántos caramelos son?'],
      datos: [DN.bolsita(3), DN.caja(3)],
      figura: fig({ n: 3, cajas: 1, bolsitas: 1, sueltos: 2, regla: 2, rotulos: true, etiqueta: { cifras: '112' } }),
      solucion: [
        { texto: ['Una caja de ', bas(3), ' bolsitas de ', bas(3), ' guarda 3 × 3 = 9 caramelos; una bolsita, 3; y quedan 2 sueltos.'] },
        { texto: 'Cada cifra por lo que vale su lugar, y se suma todo.', ecuacion: [num('112', 3), ' = 1 × 9 + 1 × 3 + 2 = ', cant(14)] },
      ],
      respuesta: [cant(14), ' caramelos'] },
    { nivel: 1, titulo: 'La raya encima',
      enunciado: ['¿Qué quiere decir ', num('ab', 6), ', y en qué se diferencia de a × b?'],
      datos: [DN.bolsita(6), 'La raya encima dice que las letras son cifras'],
      solucion: [
        { texto: ['La raya dice que a y b son cifras de un numeral en base ', bas(6), ': a cuenta bolsitas y b, sueltos.'], ecuacion: [num('ab', 6), ' = ', cif('a'), ' × ', bas(6), ' + ', cif('b')] },
        { texto: ['Sin raya, ab es un producto. Con a = 2 y b = 3, a × b = 6; en cambio, ', num('23', 6), ' = 2 × 6 + 3 = 15.'] },
      ],
      respuesta: [num('ab', 6), ' = ', cif('a'), ' × ', bas(6), ' + ', cif('b')] },
    { nivel: 2, titulo: 'Hasta el cajón',
      enunciado: ['En el puesto de bolsitas de ', bas(4), ', un pedido se anota ', num('2113', 4), '. ¿Cuántos caramelos tiene?'],
      datos: [DN.todo(4), DD.f4('n')],
      figura: fig({ n: 4, cajones: 2, cajas: 1, bolsitas: 1, sueltos: 3, regla: 3, rotulos: true, etiqueta: { cifras: '2113' } }),
      solucion: [
        { texto: ['Un cajón guarda ', bas(4), ' cajas de ', bas(4), ' bolsitas de ', bas(4), ' caramelos.'], ecuacion: ['1 cajón = ', pot(4, '3'), ' = 4 × 4 × 4 = 64 caramelos'] },
        { texto: 'Cada cifra por lo que vale su lugar: 64, 16, 4 y 1.', ecuacion: [num('2113', 4), ' = 2 × 64 + 1 × 16 + 1 × 4 + 3 = 128 + 16 + 4 + 3 = ', cant(151)] },
      ],
      respuesta: [cant(151), ' caramelos'] },
    { nivel: 2, titulo: 'Ordenar tres pedidos',
      enunciado: ['Ordena de mayor a menor los pedidos ', num('312', 4), ', ', num('215', 6), ' y ', num('141', 5), '.'],
      datos: [DD.f3('n'), [pot('n', '2'), ' = ', bas('n'), ' × ', bas('n')]],
      solucion: [
        { texto: 'Con bases distintas no se comparan las cifras: primero se pasa cada uno a base 10.' },
        { texto: 'Con los lugares de cada puesto:', ecuacion: [num('312', 4), ' = 48 + 4 + 2 = 54', SEP, num('215', 6), ' = 72 + 6 + 5 = 83', SEP, num('141', 5), ' = 25 + 20 + 1 = 46'] },
        { texto: ['El de base 6 empieza con una cifra menor que ', num('312', 4), ', y aun así es el mayor: sus cajas guardan 36.'] },
      ],
      respuesta: [num('215', 6), ' > ', num('312', 4), ' > ', num('141', 5)] },
    { nivel: 2, titulo: 'La cifra del medio',
      enunciado: ['Un pedido de bolsitas de ', bas(5), ' tiene ', cant(68), ' caramelos, y su etiqueta dice ', num('2a3', 5), '. ¿Cuánto vale la cifra ', cif('a'), '?'],
      datos: [DD.f3('n'), DN.cifras],
      solucion: [
        { texto: ['Se descompone la etiqueta con la letra en su lugar: 2 cajas de 25, ', cif('a'), ' bolsitas de 5 y 3 sueltos.'], ecuacion: [num('2a3', 5), ' = 2 × 25 + ', cif('a'), ' × 5 + 3 = 53 + 5 × ', cif('a')] },
        { texto: 'Eso son los 68 caramelos.', ecuacion: ['53 + 5 × ', cif('a'), ' = 68', SEP, '5 × ', cif('a'), ' = 15', SEP, cif('a'), ' = ', cif(3)] },
        { texto: ['Sirve: 3 es menor que ', bas(5), '.'] },
      ],
      respuesta: [cif('a'), ' = ', cif(3)] },
    { nivel: 2, titulo: 'El mayor de tres cifras',
      enunciado: ['¿Cuánto vale en base 10 el mayor numeral de tres cifras en base ', bas(6), '?'],
      datos: [DN.cifras, DD.f3('n')],
      solucion: [
        { texto: ['En base ', bas(6), ' la cifra mayor es 5: el mayor numeral de tres cifras es ', num('555', 6), '.'] },
        { texto: 'Se descompone con los lugares 36, 6 y 1.', ecuacion: [num('555', 6), ' = 5 × 36 + 5 × 6 + 5 = 180 + 30 + 5 = ', cant(215)] },
        { texto: ['Con un caramelo más se llenaría un cajón: ', num('1000', 6), ' = 216.'] },
      ],
      respuesta: [cant(215)] },
    { nivel: 2, titulo: 'Dos etiquetas iguales',
      enunciado: ['¿Tienen la misma cantidad de caramelos los pedidos ', num('34', 5), ' y ', num('23', 8), '?'],
      datos: [DD.f2('n')],
      solucion: [
        { texto: 'Se pasa cada etiqueta a base 10.', ecuacion: [num('34', 5), ' = 3 × 5 + 4 = 19', SEP, num('23', 8), ' = 2 × 8 + 3 = 19'] },
        { texto: 'Las cifras son distintas, pero la cantidad es la misma: con bolsitas más grandes hacen falta menos bolsitas.' },
      ],
      respuesta: ['Sí: los dos tienen ', cant(19), ' caramelos'] },
    { nivel: 3, titulo: 'Cifras cruzadas',
      enunciado: ['Si ', numL('ab'), ' + ', numL('ba'), ' = ', cant(154), ', ¿cuánto vale ', cif('a'), ' + ', cif('b'), '?'],
      alternativas: ['7', '11', '14', '15'],
      datos: [DD.f10, 'a y b son cifras distintas de 0'],
      solucion: [
        { texto: 'Se descompone cada numeral y se juntan las a con las a y las b con las b.', ecuacion: ['(10 × ', cif('a'), ' + ', cif('b'), ') + (10 × ', cif('b'), ' + ', cif('a'), ') = 11 × ', cif('a'), ' + 11 × ', cif('b'), ' = 11 × (', cif('a'), ' + ', cif('b'), ')'] },
        { texto: 'Eso vale 154.', ecuacion: ['11 × (', cif('a'), ' + ', cif('b'), ') = 154', SEP, cif('a'), ' + ', cif('b'), ' = ', cif(14)] },
        { texto: ['La trampa es leer ', numL('ab'), ' como a × b: la raya dice que son cifras, y pide descomponer.'] },
      ],
      respuesta: [letra('C'), ': ', cif('a'), ' + ', cif('b'), ' = ', cif(14)] },
    { nivel: 3, titulo: 'Cada cifra sube 1',
      enunciado: ['En base ', bas(7), ', cada cifra de ', num('234', 7), ' aumenta en 1 y queda ', num('345', 7), '. ¿Cuánto aumenta su valor?'],
      alternativas: ['111', '3', '57', '49'],
      datos: [DD.f3('n'), [pot(7, '2'), ' = 49']],
      solucion: [
        { texto: 'Se pasa cada uno a base 10 y se restan.', ecuacion: [num('345', 7), ' = 147 + 28 + 5 = 180', SEP, num('234', 7), ' = 98 + 21 + 4 = 123', SEP, '180 − 123 = ', cant(57)] },
        { texto: 'Sale lo mismo sumando 1 vez cada lugar: 49 + 7 + 1 = 57. Cada cifra que sube 1 agrega lo que vale su lugar.' },
        { texto: '111 es leer las diferencias de las cifras como en base 10; 3 es pensar que solo cambian tres caramelos; 49 cuenta solo el lugar de las cajas.' },
      ],
      respuesta: [letra('C', 'cantidad'), ': aumenta ', cant(57)] },
    { nivel: 3, titulo: 'Mayor menos menor',
      enunciado: ['En base ', bas(6), ', ¿cuánto se llevan el mayor y el menor numeral de tres cifras distintas?'],
      datos: [DN.cifras, DN.primera, DD.f3('n')],
      solucion: [
        { texto: ['Las cifras van de 0 a 5. El mayor de cifras distintas es ', num('543', 6), '; el menor, ', num('102', 6), ', porque no puede empezar en 0.'] },
        { texto: 'Se pasa cada uno a base 10.', ecuacion: [num('543', 6), ' = 180 + 24 + 3 = 207', SEP, num('102', 6), ' = 36 + 0 + 2 = 38'] },
        { texto: 'Se restan los dos valores.', ecuacion: ['207 − 38 = ', cant(169)] },
      ],
      respuesta: ['Se llevan ', cant(169)] },
    { nivel: 3, titulo: 'Una cifra repetida',
      enunciado: ['Si ', num('a0a', 6), ' = ', cant(185), ', ¿cuánto vale ', num('aa', 6), '?'],
      alternativas: ['5', '35', '55', '30'],
      datos: [DD.f3('n'), DD.pot(6, 3), DN.cifras],
      solucion: [
        { texto: ['En base ', bas(6), ', los lugares valen 6 × 6 = 36, 6 y 1. Se descompone con la letra en sus dos lugares.'], ecuacion: [num('a0a', 6), ' = ', cif('a'), ' × 36 + 0 × 6 + ', cif('a'), ' = 37 × ', cif('a')] },
        { texto: 'Eso vale 185: se divide entre 37.', ecuacion: ['37 × ', cif('a'), ' = ', cant(185), SEP, cif('a'), ' = 185 ÷ 37 = ', cif(5)] },
        { texto: ['Sirve: 5 es menor que ', bas(6), '. Entonces ', num('aa', 6), ' = ', num('55', 6), '.'], ecuacion: [num('55', 6), ' = 5 × 6 + 5 = ', cant(35)] },
        { texto: 'Responder 5 es dar la cifra y no lo que piden; 55 es leer el numeral en base 10; 30 es 5 × 6, sin la cifra de la derecha.' },
      ],
      respuesta: [letra('B', 'cantidad'), ': ', cant(35)] },
    { nivel: 3, titulo: 'Al revés en otra base',
      enunciado: ['Si ', num('ab', 7), ' = ', num('ba', 5), ', ¿cuánto vale ese número en base 10?'],
      datos: [DD.f2('n'), DN.cifras, DN.primera],
      solucion: [
        { texto: 'Se descomponen los dos y se igualan.', ecuacion: ['7 × ', cif('a'), ' + ', cif('b'), ' = 5 × ', cif('b'), ' + ', cif('a'), SEP, '6 × ', cif('a'), ' = 4 × ', cif('b'), SEP, '3 × ', cif('a'), ' = 2 × ', cif('b')] },
        { texto: ['Son cifras de base 5 distintas de 0. Con 3 × a = 2 × b solo queda a = 2 y b = 3; con a = 4, b sería 6.'] },
        { texto: 'Se comprueba con los dos numerales.', ecuacion: [num('23', 7), ' = 14 + 3 = ', cant(17), SEP, num('32', 5), ' = 15 + 2 = ', cant(17)] },
      ],
      respuesta: ['Vale ', cant(17)] },
  ];

  const descomposicion = {
    id: 'descomposicion',
    titulo: 'Cada cifra vale según su lugar',
    pregunta: '¿Por qué 132₍₄₎ no es ciento treinta y dos?',
    temas: ['Descomposición polinómica'],
    pieza: PU,
    aprendizaje: 'Un numeral vale la suma de cada cifra por la potencia de la base de su lugar; las mismas cifras valen distinto en otra base.',
    actividad: 'Cambiar el tamaño de la bolsita y ver cuántos caramelos tiene un mismo pedido.',
    // Lee: el lugar de cada cifra, la potencia como «una caja por dentro» y el numeral con letras (la raya). No dice qué
    // pasa con un 0 en medio ni cuánto vale un numeral (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'Cada lugar, un tamaño', texto: ['En el puesto de bolsitas de ', bas(5), ', la etiqueta ', num('132', 5), ' dice 1 caja, 3 bolsitas y 2 sueltos. Las tres cifras cuentan cosas de distinto tamaño: una caja no vale lo mismo que un suelto. Eso es el valor posicional.'],
          pieza: PU, dibujo: { datos: ped132(5), estado: {} } },
        { titulo: 'Una caja por dentro', texto: ['Una caja guarda ', bas(5), ' bolsitas de ', bas(5), ' caramelos: 5 × 5 = 25. Se escribe 5² («cinco al cuadrado») y es una potencia de la base. Un cajón guarda 5 cajas: 5 × 5 × 5 = 5³ = 125.'],
          ecuacion: ['1 caja = ', bas(5), ' × ', bas(5), ' = ', pot(5, '2'), ' = 25 caramelos'] },
        { titulo: 'Cifras con letras', texto: ['En el examen, un numeral con cifras desconocidas lleva una raya encima: ', num('ab', 5), ' es «a bolsitas y b sueltos». La raya dice que a y b son cifras; sin raya, ab sería a × b.'],
          ecuacion: [num('ab', 5), ':  ', cif('a'), ' bolsitas y ', cif('b'), ' sueltos'] },
        { titulo: 'Qué mirar al jugar', texto: ['La etiqueta ', num('132', 'n'), ' no cambia: vas a cambiar el tamaño de la bolsita, ', bas('n'), '. Mira cuántos caramelos guarda la caja y cuántos tiene todo el pedido.'] },
      ],
    },
    ejemplos: EJEMPLOS_DESCOMPOSICION,
    juega: {
      pieza: PU,
      consigna: 'La etiqueta dice 132₍ₙ₎: 1 caja, 3 bolsitas y 2 sueltos. La bolsita, n, va desde 4: con 3, no existiría la cifra 3.',
      mision: {
        texto: ['Con la bolsita más chica posible, haz que el pedido tenga más de ', cant(50), ' caramelos.'],
        logrado: val => val.b === 6,
        bien: 'Listo: con bolsitas de 6 la caja ya guarda 36, y el pedido llega a 56.',
      },
      voz: '¿Cuántos caramelos guarda la caja con esta bolsita?',
      leyenda: [
        { s: num('132', 'n'), t: 'etiqueta: 1 caja, 3 bolsitas, 2 sueltos' },
        { s: bas('n'), t: 'caramelos por bolsita: la base' },
        { s: cif('3'), t: 'cifra: cuántas hay de ese tamaño' },
        { s: cant('30'), t: 'caramelos de todo el pedido' },
      ],
      controles: [{ id: 'b', etiqueta: 'Caramelos por bolsita, n', color: 'c-i', min: 4, max: 9, paso: 1, inicio: 4, decimales: 0 }],
      dibujo: v => ({ datos: Object.assign(ped132(v.b), { escala: escalaD() }), estado: {} }),
      // La relación: la caja guarda n × n, las bolsitas n cada una y los sueltos 1; todo suma el pedido.
      lectura: v => [num('132', v.b), ' = 1 × ', bas(v.b), ' × ', bas(v.b), ' + 3 × ', bas(v.b), ' + 2 = ', cant(valor('132', v.b)), ' caramelos'],
      minimo: 3,
    },
    predice: {
      pregunta: ['En el puesto de bolsitas de ', bas(5), ', un pedido se anota ', num('203', 5), '. ¿Cuántos caramelos son?'],
      datos: [DN.bolsita(5), ['1 caja = ', bas(5), ' bolsitas = 25 caramelos']],
      voz: 'Piensa qué cuenta cada cifra, también el 0.',
      opciones: [
        { id: 'c', texto: '53 caramelos', correcta: true },
        { id: 'decimal', texto: '203 caramelos', error: 'AT-DECIMAL', siFuera: 'Leer 203 tiene sentido en base 10. Aquí cada bolsita es de 5, no de 10.' },
        { id: 'orden', texto: '77 caramelos', error: 'AT-ORDEN', siFuera: 'Bien que uses 25 y 5. Pero el 25 va con la cifra de la izquierda, el 2.' },
        { id: 'cero', texto: '13 caramelos', error: 'AT-CERO-LUGAR', siFuera: 'Bien que el 0 no sume nada. Pero ocupa su lugar: el 2 sigue contando cajas.' },
      ],
      dibujo: fig(Object.assign({}, P203, { rotulos: R203, escala: ESC203 })),
      revelar: fig(Object.assign({}, P203, { escala: ESC203, rotulos: { cajas: '2 × 25 = 50', bolsitas: '0 × 5 = 0', sueltos: '3 × 1 = 3' }, regla: [[['1 caja = 25 caramelos']], [['Total: 50 + 0 + 3 = '], ['53', 'f', 700]]] })),
      coincide: 'Coincide: 2 cajas de 25, ninguna bolsita y 3 sueltos: 50 + 0 + 3 = 53.',
      noCoincide: 'Revisemos: el 2 cuenta cajas de 25, y el 0 dice que no hay bolsitas.',
    },
    mira: {
      pieza: PU,
      datos: MIRA2,
      voz: 'Cada cifra por lo que vale su lugar.',
      pasos: [
        { estado: { paso: 0 }, texto: ['El pedido ', num('203', 5), ': 2 cajas, ninguna bolsita y 3 sueltos.'], ecuacion: [num('203', 5), ' = ', cif(2), ' cajas + ', cif(0), ' bolsitas + ', cif(3), ' sueltos'] },
        { estado: { paso: 1 }, texto: 'Cada caja guarda 5 × 5 = 25 caramelos.', ecuacion: [cif(2), ' × ', pot(5, '2'), ' = 2 × 25 = 50'] },
        { estado: { paso: 2 }, texto: 'El 0 no suma, pero guarda el lugar de las bolsitas.', ecuacion: [cif(0), ' × ', bas(5), ' = 0'] },
        { estado: { paso: 3 }, texto: 'Cada suelto vale 1.', ecuacion: [cif(3), ' × 1 = 3'] },
        { estado: { paso: 4 }, texto: 'Se suma lo que vale cada lugar: es la descomposición polinómica.', ecuacion: [num('203', 5), ' = 50 + 0 + 3 = ', cant(53)] },
        { estado: { paso: 5 }, texto: 'Con letras: cada cifra por la potencia de su lugar.', ecuacion: [num('abc', 'n'), ' = ', cif('a'), ' × ', pot('n', '2'), ' + ', cif('b'), ' × ', bas('n'), ' + ', cif('c')] },
      ],
    },
    regla: {
      texto: 'Un numeral vale la suma de cada cifra por lo que vale su lugar: 1, n, n², n³…, desde la derecha. Las mismas cifras valen más en una base mayor.',
      ecuacion: [num('abc', 'n'), ' = ', cif('a'), ' × ', pot('n', '2'), ' + ', cif('b'), ' × ', bas('n'), ' + ', cif('c'), SEP, pot('n', '2'), ' = ', bas('n'), ' × ', bas('n')],
      condicion: 'La raya: a, b y c son cifras, no un producto. La primera no es 0; un 0 ocupa su lugar.',
      voz: 'Cada cifra por lo que vale su lugar, y se suma todo.',
    },
    // Así se resuelve: la misma etiqueta en dos puestos (cuánto más tiene el de bolsitas grandes). «Ahora tú» pide otra
    // cosa: el valor de un pedido, el mayor de cuatro, la descomposición con letras, a̅b̅ + b̅a̅ y el mayor de k cifras.
    resuelve: {
      pieza: PU,
      generar(s) {
        const q = azar(s + 900), a = q.ent(3, 6), c = q.ent(a + 1, Math.min(9, a + 3));
        const t = [q.ent(1, a - 1), q.ent(0, a - 1), q.ent(0, a - 1)].join(''), va = valor(t, a), vc = valor(t, c);
        const desc = n => t.split('').map((x, i) => `${x} × ${n ** (2 - i)}`).join(' + ');
        return {
          enunciado: ['Dos puestos anotan un pedido con la misma etiqueta, ', num(t, 'n'), ': uno tiene bolsitas de ', bas(a), ' y el otro, de ', bas(c), '. ¿Cuántos caramelos más tiene el segundo pedido?'],
          datos: [DD.f3('n'), [pot('n', '2'), ' = ', bas('n'), ' × ', bas('n')]],
          dibujo: fig({ n: a, cajas: +t[0], bolsitas: +t[1], sueltos: +t[2], ceros: true, regla: 2, rotulos: true, etiqueta: { cifras: t } }),
          pasos: [
            { tipo: 'pide', texto: 'Piden la diferencia de caramelos entre los dos pedidos, que se anotan igual.' },
            { tipo: 'regla', texto: 'Cada cifra se multiplica por lo que vale su lugar en su propio puesto: 1, la base y la base por la base.' },
            { tipo: 'cuentas', texto: ['En el puesto de bolsitas de ', bas(a), ', la caja guarda ', String(a * a), '.'], ecuacion: [num(t, a), ' = ', desc(a), ' = ', cant(va)] },
            { tipo: 'cuentas', texto: ['En el de bolsitas de ', bas(c), ', la caja guarda ', String(c * c), '.'], ecuacion: [num(t, c), ' = ', desc(c), ' = ', cant(vc)],
              dibujo: fig({ n: c, cajas: +t[0], bolsitas: +t[1], sueltos: +t[2], ceros: true, regla: 2, rotulos: true, etiqueta: { cifras: t } }) },
            { tipo: 'sentido', texto: `Las mismas cifras valen más con la base mayor: ${vc} − ${va} = ${vc - va}. Cuadra: el segundo tiene más.` },
          ],
          respuesta: ['El segundo tiene ', cant(vc - va), ' caramelos más'],
        };
      },
    },
    ahoraTu: {
      pieza: PU,
      voz: 'Cada cifra por lo que vale su lugar en su base.',
      generar(sem) {
        const r = azar(sem + 47), tipo = sem % 5, m = Math.floor(sem / 5);
        if (tipo === 0) return conCuatro(q => casoValor(q, m), r);
        if (tipo === 1) return casoMayor(r);
        if (tipo === 2) return conCuatro(casoLetras, r);
        if (tipo === 3) return conCuatro(casoCruzados, r);
        return conCuatro(casoMayorK, r);
      },
    },
  };

  // ---------- Idea 3 (rehecha, 17 nov): de base 10 a otra base (divisiones sucesivas) ----------
  // Objeto: doña Juana empaca un montón de caramelos ronda por ronda (como San Marcos 2019-I: la menor cantidad de
  // envases). Cada ronda es una división: lo que se junta es el cociente; lo que sobra, un resto, que es una cifra.
  // Cambia: cuántos caramelos, la bolsita y la ronda. · Permanece: la regla del puesto. · Progresa: sueltos → bolsitas →
  // cajas → cajón. · Se reserva: el orden en que se escriben los restos cuando ya no hay caramelos, solo la tabla (la
  // predicción: 19 a base 3). · Debe verse: lo que sobra en la primera ronda queda suelto: es la cifra de la derecha.
  // Errores (hipótesis de aula; trampa 23 y San Marcos 2022: restos al revés): AT-ORDEN escribe los restos en el orden en
  // que salen · AT-COCIENTE escribe cocientes · AT-DECIMAL copia el número o suma sus cifras en base 10 · AT-CONTEO se
  // salta la última división · AT-COPIA copia las cifras de una base a otra · AT-UNO-POR-TAMAÑO usa un envase de cada
  // tamaño.
  const ORD = ['sueltos', 'bolsitas', 'cajas', 'cajones'];
  const SG = { sueltos: 'suelto', bolsitas: 'bolsita', cajas: 'caja', cajones: 'cajón' };
  const nom = (i, k) => (i === 0 ? (k === 1 ? 'caramelo' : 'caramelos') : k === 1 ? SG[ORD[i]] : ORD[i]);
  const nomR = (i, k) => (k === 1 ? SG[ORD[i]] : ORD[i]);
  // Las divisiones de N entre n: [{ x, q, r }], hasta que el cociente es 0.
  const divisiones = (N, n) => { const out = []; for (let x = N; x > 0; x = Math.floor(x / n)) out.push({ x, q: Math.floor(x / n), r: x % n }); return out; };
  // El pedido después de k rondas: arriba lo juntado (un cociente), abajo los restos (cifras).
  function ronda(N, n, k) {
    const ds = divisiones(N, n), fin = ds.length - 1, kk = Math.min(k, fin);
    const o = {};
    for (let i = 0; i < kk; i++) o[ORD[i]] = ds[i].r;
    o[ORD[kk]] = kk === 0 ? N : ds[kk - 1].q;
    return { o, kk, fin, ds, listo: kk >= fin };
  }
  function datosRonda(N, n, k) {
    const e = ronda(N, n, k), rot = {};
    for (let i = 0; i < e.kk; i++) rot[ORD[i]] = [[String(e.o[ORD[i]]), 'o', 700], [` ${nomR(i, e.o[ORD[i]])}`]];
    const top = e.o[ORD[e.kk]];
    rot[ORD[e.kk]] = e.kk === 0 ? [[`${N} caramelos`, 'f', 700]] : e.listo ? [[String(top), 'o', 700], [` ${nomR(e.kk, top)}`]] : [[`${top} ${nomR(e.kk, top)}`]];
    return Object.assign({ n, ceros: true, regla: 3, rotulos: rot, juntar: e.listo ? undefined : ORD[e.kk], etiqueta: { cifras: e.listo ? enBase(N, n) : '?' } }, e.o);
  }
  const escR = {};
  const escalaR = (N, n) => escR[`${N},${n}`] || (escR[`${N},${n}`] = escalaDe([0, 1, 2, 3].map(k => datosRonda(N, n, k))));
  // La tabla de divisiones (pieza arit-tabla): número, entre, cociente, resto y, si se pide, a qué orden va cada resto.
  function tablaDiv(N, n, o = {}) {
    const ds = divisiones(N, n);
    const filas = ds.map((x, i) => {
      const p = o.pasos ? i + 1 : 0;
      const cb = o.segunda ? 'd' : 'i';
      const fila = [{ t: String(x.x), color: i === 0 ? 'f' : null, paso: p }, { t: String(n), color: cb, paso: p }, { t: String(x.q), paso: p }, { t: String(x.r), color: 'o', paso: p }];
      if (o.lugar) fila.push({ t: ORD[i] || '…', paso: p });
      return fila;
    });
    // «va en» se llena con su fila (ronda 2 del lector: vacía en el paso 1 no decía nada). Con la segunda base (pasar
    // entre dos bases), el divisor y su columna van en verde, como en el texto: la segunda base tiene un solo color.
    const columnas = [{ t: 'número' }, { t: 'entre', color: o.segunda ? 'd' : 'i' }, { t: 'cociente' }, { t: 'resto', color: 'o' }].concat(o.lugar ? [{ t: 'va en' }] : []);
    return { columnas, filas, filasMax: ds.length, alt: `Divisiones de ${N} entre ${n}: ` + ds.map(x => `${x.x} = ${x.q} × ${n} + ${x.r}`).join('; ') };
  }
  const T19 = tablaDiv(19, 3), T19L = tablaDiv(19, 3, { lugar: true, pasos: true });
  // Las divisiones escritas, una relación por línea.
  const cuentasDiv = (N, n, colorN = true) => divisiones(N, n).flatMap((x, i) => [i ? SEP : '', i === 0 && colorN ? cant(x.x) : String(x.x), ` = ${x.q} × `, bas(n), ' + ', cif(x.r)]).filter(x => x !== '');
  const cuentasDiv2 = (N, n) => divisiones(N, n).flatMap((x, i) => [i ? SEP : '', i === 0 ? cant(x.x) : String(x.x), ` = ${x.q} × `, bas2(n), ' + ', cif(x.r)]).filter(x => x !== '');
  const sumaCif = t => t.split('').reduce((a, c) => a + +c, 0);
  const descT = (t, n) => t.split('').map((x, i) => `${x} × ${n ** (t.length - 1 - i)}`).join(' + ');

  // Ahora tú 3 · tipo 0: escribe N en base n.
  function casoABase(r) {
    const n = r.ent(3, 8), N = r.ent(n * n + 1, Math.min(n * n * n - 1, 300)), t = enBase(N, n);
    return {
      pregunta: ['Escribe ', cant(N), ' en base ', bas(n), '.'],
      datos: [DD.div(n), DN.cifras],
      opciones: opcionesNum(opNum(t, n), [
        { id: 'orden', texto: opNum(t.split('').reverse().join(''), n), error: 'AT-ORDEN', siFuera: 'Las cifras son los restos, bien. Pero el primer resto es la última cifra, la de la derecha.' },
        { id: 'sin-ultimo', texto: opNum(t.slice(1), n), error: 'AT-CONTEO', siFuera: 'Los restos están bien leídos. Pero falta la última división: se sigue hasta que el cociente es 0.' },
        { id: 'copia', texto: opNum(String(N), n), error: 'AT-DECIMAL', siFuera: 'El número no cambia, es cierto. Pero su escritura sí: en otra base lleva otras cifras.' },
      ]),
      solucion: { texto: 'Se divide entre la base hasta que el cociente es 0; los restos, del último al primero.',
        ecuacion: [cant(N), ' = ', num(t, n)], dibujo: { datos: tablaDiv(N, n), estado: { columna: 3 } } },
    };
  }
  // Ahora tú 3 · tipo 1: un pedido de un puesto se vuelve a empacar en otro (entre dos bases que no son 10).
  function casoReempaque(r) {
    const a = r.ent(3, 6), c = r.de([3, 4, 5, 6, 7, 8, 9].filter(x => x !== a)), N = r.ent(a * a, Math.min(a * a * a - 1, 150));
    const na = enBase(N, a), nc = enBase(N, c);
    return {
      pregunta: ['Un pedido del puesto de bolsitas de ', bas(a), ' se anota ', num(na, a), '. Se vuelve a empacar en bolsitas de ', bas2(c), '. ¿Qué etiqueta lleva ahora?'],
      datos: [DD.fk(na.length, 'n'), DD.div('n')],
      opciones: opcionesNum([num2(nc, c)], [
        { id: 'copia', texto: [num2(na, c)], error: 'AT-COPIA', siFuera: 'Cambiar el subíndice no alcanza: con otras bolsitas, el mismo pedido lleva otras cifras.' },
        { id: 'orden', texto: [num2(nc.split('').reverse().join(''), c)], error: 'AT-ORDEN', siFuera: 'Los restos son las cifras, bien. Pero el primero va a la derecha: es lo que quedó suelto.' },
        { id: 'diez', texto: [num2(String(N), c)], error: 'AT-DECIMAL', siFuera: `Bien: el pedido tiene ${N} caramelos. Pero falta empacarlos de ${c} en ${c}.` },
      ]),
      solucion: { texto: `Primero cuántos caramelos son: ${N}. Después, divisiones entre ${c}, la base nueva (en verde).`,
        ecuacion: [num(na, a), ' = ', cant(N), ' = ', num2(nc, c)] },
    };
  }
  // Ahora tú 3 · tipo 2 (nivel examen, San Marcos 2022): la suma de las cifras de N en base n.
  function casoSumaCifras(r) {
    const n = r.ent(3, 9), N = r.ent(Math.max(40, n * n), Math.min(n ** 4 - 1, 400)), t = enBase(N, n), ds = divisiones(N, n);
    return {
      pregunta: ['Al escribir ', cant(N), ' en base ', bas(n), ', ¿cuánto suman sus cifras?'],
      datos: [DD.div(n)],
      opciones: opciones(sumaCif(t), [
        { id: 'cocientes', valor: ds.reduce((x, d) => x + d.q, 0), error: 'AT-COCIENTE', siFuera: 'Dividir hasta llegar a 0 está bien. Pero las cifras son los restos, no los cocientes.' },
        { id: 'decimal', valor: sumaCif(String(N)), error: 'AT-DECIMAL', siFuera: `Esas son las cifras de ${N} en base 10. Primero hay que pasarlo a base ${n}.` },
        { id: 'sin-ultimo', valor: sumaCif(t.slice(1)), error: 'AT-CONTEO', siFuera: 'Los restos están bien. Pero falta la última división: el cociente tiene que llegar a 0.' },
      ]),
      solucion: { texto: `En base ${n}, ${N} se escribe ${numT(t, n)}; se suman sus cifras.`, ecuacion: [cant(N), ' = ', num(t, n), SEP, t.split('').join(' + '), ' = ', cif(sumaCif(t))] },
    };
  }
  // Ahora tú 3 · tipo 3 (nivel examen, San Marcos 2019-I): la menor cantidad de paquetes de 1, n, n², n³.
  function casoPaquetes(r) {
    const n = r.ent(3, 6), N = r.ent(Math.max(30, n * n), Math.min(n ** 4 - 1, 300)), t = enBase(N, n), ds = divisiones(N, n);
    const tam = [1, n, n * n, n ** 3].filter(x => x <= N);
    return {
      pregunta: ['Doña Juana guarda ', cant(N), ' caramelos en paquetes llenos de ', tam.join(', ').replace(/, (\d+)$/, ' y $1'), ' caramelos. ¿Cuántos paquetes usa, como mínimo?'],
      datos: [['', bas(n), ' paquetes de un tamaño llenan uno del tamaño siguiente'], DD.div(n)],
      opciones: opciones(sumaCif(t), [
        { id: 'cocientes', valor: ds.reduce((x, d) => x + d.q, 0), error: 'AT-COCIENTE', siFuera: 'Juntar de a ' + n + ' está bien. Pero lo que se cuenta al final es lo que sobra en cada ronda.' },
        { id: 'decimal', valor: sumaCif(String(N)), error: 'AT-DECIMAL', siFuera: `Así sería con paquetes de 1, 10 y 100. Aquí los tamaños crecen de ${n} en ${n}.` },
        { id: 'uno', valor: t.split('').filter(x => x !== '0').length, error: 'AT-UNO-POR-TAMAÑO', siFuera: 'Bien que uses paquetes grandes. Pero de un tamaño puede ir más de uno.' },
      ]),
      solucion: { texto: `Cada ${n} paquetes iguales forman uno mayor: es escribir ${N} en base ${n} y sumar sus cifras.`, ecuacion: [cant(N), ' = ', num(t, n), SEP, t.split('').join(' + '), ' = ', cif(sumaCif(t)), ' paquetes'] },
    };
  }

  // Ejemplos resueltos de la idea 3. Cuentas rehechas aparte (cuentas-f3.js): 23 = 4 × 5 + 3; 17 = 25₍₆₎; 50 = 302₍₄₎;
  // restos de 7: 0 a 6; 142₍₅₎ = 47; 100 = 10201₍₃₎; 243₍₅₎ = 73 = 133₍₇₎; 13 = 1101₍₂₎; 52₍₆₎ = 32 = 200₍₄₎;
  // 89 = 225₍₆₎; 250 = 1054₍₆₎ (suma 10); 150 = 2112₍₄₎ (6 paquetes); 1000₍₃₎ = 27 = 102₍₅₎; 333₍₄₎ = 63 = 120₍₇₎;
  // 124 = 444₍₅₎ (125 = 1000₍₅₎); 50 entre 4: tres divisiones (12, 3 y 0). Ninguna figura muestra la etiqueta que se pide:
  // va con «?». «Leer la tabla» salió (era la pregunta de Predice con otros números y sus datos traían los restos;
  // auditoría, M2 y M9). Las demás de cambio de base enseñan el orden de los restos: solo lo arregla que la app abra los
  // ejemplos de la idea después de su Predice (pendiente de app/, en el informe).
  const montonF = (n, N, extra) => fig(Object.assign({ n, sueltos: N, regla: 1, rotulos: { sueltos: [[`${N} caramelos`, 'f', 700]] } }, extra || {}));
  const EJEMPLOS_CAMBIO = [
    { nivel: 1, titulo: 'Una ronda de empaque',
      enunciado: ['Doña Juana tiene ', cant(23), ' caramelos sueltos y bolsitas de ', bas(5), '. En la primera ronda, ¿cuál es el cociente y cuál el resto?'],
      datos: [DD.div(5)],
      figura: montonF(5, 23),
      solucion: [
        { texto: ['4 bolsitas usan 20 caramelos; para 5 bolsitas harían falta 25.'], ecuacion: [cant(23), ' = 4 × ', bas(5), ' + ', cif(3)] },
        { texto: ['El cociente, 4, son las bolsitas llenas. El resto, 3, son los sueltos: menos que ', bas(5), '.'] },
      ],
      respuesta: ['Cociente 4 y resto ', cif(3)] },
    { nivel: 1, titulo: 'Dos divisiones',
      enunciado: ['Escribe ', cant(17), ' en base ', bas(6), '.'],
      datos: [DD.div(6), DD.restos],
      solucion: [
        { texto: 'Se divide entre 6 hasta que el cociente es 0.', ecuacion: cuentasDiv(17, 6) },
        { texto: 'El primer resto, 5, es la cifra de la derecha; el último, 2, la de la izquierda.' },
      ],
      respuesta: [cant(17), ' = ', num('25', 6)] },
    { nivel: 1, titulo: 'Hasta que dé 0',
      enunciado: ['Para pasar ', cant(50), ' a base ', bas(4), ', doña Juana divide entre 4, y cada cociente otra vez. ¿Cuántas divisiones hace hasta que el cociente es 0?'],
      datos: [DD.div(4), DD.restos],
      solucion: [
        { texto: 'Se divide 50 entre 4; después, el cociente 12 entre 4; después, el cociente 3.', ecuacion: cuentasDiv(50, 4) },
        { texto: 'En la tercera, el cociente ya es 0: no queda nada que juntar. Cada división deja un resto, una cifra.' },
        { texto: 'Los restos, del último al primero: 3, 0 y 2. De vuelta: 3 × 16 + 0 × 4 + 2 = 50.', ecuacion: [cant(50), ' = ', num('302', 4)] },
      ],
      respuesta: [cif(3), ' divisiones: ', cant(50), ' = ', num('302', 4)] },
    { nivel: 1, titulo: 'Los restos posibles',
      enunciado: ['Al dividir entre ', bas(7), ', ¿qué restos pueden salir? ¿Por qué son justo las cifras de la base 7?'],
      datos: [DD.div(7)],
      solucion: [
        { texto: ['El resto es lo que no alcanza para otro grupo de ', bas(7), ': puede ser de 0 a 6, nunca 7 o más.'] },
        { texto: 'Las cifras de la base 7 van de 0 a 6: cada resto es una cifra.' },
      ],
      respuesta: ['De ', cif(0), ' a ', cif(6)] },
    { nivel: 1, titulo: '¿Está bien pasado?',
      enunciado: ['Un alumno escribió ', cant(47), ' = ', num('142', 5), '. ¿Está bien?'],
      datos: [DD.f3('n')],
      solucion: [
        { texto: 'Se comprueba de vuelta, con la descomposición.', ecuacion: [num('142', 5), ' = 1 × 25 + 4 × 5 + 2 = 25 + 20 + 2 = ', cant(47)] },
        { texto: 'Da 47, y todas sus cifras son menores que 5: está bien.' },
      ],
      respuesta: ['Sí: ', num('142', 5), ' vale ', cant(47)] },
    { nivel: 2, titulo: 'Cinco divisiones',
      enunciado: ['Escribe ', cant(100), ' en base ', bas(3), '.'],
      datos: [DD.div(3), DD.restos],
      solucion: [
        { texto: 'Se divide entre 3 una y otra vez, hasta que el cociente es 0.', ecuacion: cuentasDiv(100, 3) },
        { texto: 'Los restos salen 1, 0, 2, 0 y 1. Del último al primero: 1, 0, 2, 0, 1.', ecuacion: [cant(100), ' = ', num('10201', 3)] },
        { texto: 'De vuelta: 81 + 0 + 18 + 0 + 1 = 100. Cuadra.' },
      ],
      respuesta: [num('10201', 3)] },
    { nivel: 2, titulo: 'De base 5 a base 7',
      enunciado: ['Escribe ', num('243', 5), ' en base ', bas2(7), '.'],
      datos: [DD.f3('n'), DD.div('n'), DD.restos],
      solucion: [
        { texto: 'Entre dos bases que no son 10, primero se pasa a base 10. La base nueva va en verde.', ecuacion: [num('243', 5), ' = 2 × 25 + 4 × 5 + 3 = ', cant(73)] },
        { texto: 'Después, divisiones entre 7.', ecuacion: cuentasDiv2(73, 7) },
        { texto: 'Los restos, del último al primero.', ecuacion: [num('243', 5), ' = ', cant(73), ' = ', num2('133', 7)] },
      ],
      respuesta: [num2('133', 7)] },
    { nivel: 2, titulo: 'Solo ceros y unos',
      enunciado: ['Escribe ', cant(13), ' en base ', bas(2), '.'],
      datos: [DD.div(2), DD.restos, ['En base ', bas(2), ', los lugares valen 1, 2, 2 × 2 = 4 y 2 × 2 × 2 = 8']],
      solucion: [
        { texto: 'Se divide entre 2 hasta que el cociente es 0. Cada resto es 0 o 1.', ecuacion: cuentasDiv(13, 2) },
        { texto: 'El primer resto, 1, es lo que quedó suelto: va a la derecha. El último, 1, es el orden más grande: va a la izquierda.' },
        { texto: 'Del último resto al primero: 1, 1, 0, 1.', ecuacion: [cant(13), ' = ', num('1101', 2)] },
        { texto: 'De vuelta, con los lugares 8, 4, 2 y 1.', ecuacion: [num('1101', 2), ' = 1 × 8 + 1 × 4 + 0 × 2 + 1 = ', cant(13)] },
      ],
      respuesta: [num('1101', 2)] },
    { nivel: 2, titulo: 'Empacar otra vez',
      enunciado: ['Un pedido del puesto de bolsitas de ', bas(6), ' se anota ', num('52', 6), '. Doña Juana lo empaca de nuevo en bolsitas de ', bas2(4), '. ¿Qué etiqueta lleva?'],
      datos: [DD.f2('n'), DD.div('n'), DD.restos],
      figura: fig({ n: 6, bolsitas: 5, sueltos: 2, regla: 1, rotulos: true, etiqueta: { cifras: '52' } }),
      solucion: [
        { texto: 'Primero, cuántos caramelos son. La base nueva, 4, va en verde.', ecuacion: [num('52', 6), ' = 5 × 6 + 2 = ', cant(32)] },
        { texto: 'Después, se empacan de a 4.', ecuacion: cuentasDiv2(32, 4) },
        { texto: 'Los restos, del último al primero: 2, 0, 0. Son 2 cajas de 16, justas.' },
      ],
      respuesta: ['La etiqueta es ', num2('200', 4)] },
    { nivel: 2, titulo: 'Primera y última cifra',
      enunciado: ['Al escribir ', cant(89), ' en base ', bas(6), ', ¿con qué cifra termina y con cuál empieza?'],
      datos: [DD.div(6)],
      solucion: [
        { texto: 'La primera división ya da la última cifra: lo que queda suelto.', ecuacion: [cant(89), ' = 14 × ', bas(6), ' + ', cif(5)] },
        { texto: 'Se sigue hasta que el cociente es 0; el último resto es la primera cifra.', ecuacion: ['14 = 2 × ', bas(6), ' + ', cif(2), SEP, '2 = 0 × ', bas(6), ' + ', cif(2)] },
        { texto: ['Entonces 89 = ', num('225', 6), '.'] },
      ],
      respuesta: ['Termina en ', cif(5), ' y empieza con ', cif(2)] },
    { nivel: 3, titulo: 'La suma de las cifras',
      enunciado: ['Al escribir ', cant(250), ' en base ', bas(6), ', ¿cuánto suman sus cifras?'],
      alternativas: ['7', '9', '10', '48'],
      datos: [DD.div(6), DD.restos],
      solucion: [
        { texto: 'Se divide entre 6 hasta que el cociente es 0.', ecuacion: cuentasDiv(250, 6) },
        { texto: 'Los restos, del último al primero: 250 = 1054₍₆₎. Sus cifras suman 1 + 0 + 5 + 4.', ecuacion: [num('1054', 6), ':  1 + 0 + 5 + 4 = ', cif(10)] },
        { texto: ['Las trampas: ', letra('A'), ' suma las cifras de 250; ', letra('B'), ' olvida la última división; ', letra('D'), ' suma los cocientes.'] },
      ],
      respuesta: [letra('C'), ': suman ', cif(10)] },
    { nivel: 3, titulo: 'Paquetes que crecen de a 4',
      enunciado: ['Doña Juana guarda ', cant(150), ' caramelos en paquetes llenos de 1, 4, 16 y 64 caramelos. ¿Cuál es la menor cantidad de paquetes que puede usar?'],
      datos: [['', bas(4), ' paquetes de un tamaño llenan uno del tamaño siguiente'], DD.div(4), DD.restos],
      figura: montonF(4, 150, { regla: [[['Paquetes de 1, '], ['4', 'i', 700], [', 16 y 64']]] }),
      solucion: [
        { texto: ['Para usar pocos, nunca deben quedar ', bas(4), ' paquetes iguales: se juntan en uno mayor. Es escribir 150 en base 4.'], ecuacion: cuentasDiv(150, 4) },
        { texto: '150 = 2112₍₄₎: 2 paquetes de 64, 1 de 16, 1 de 4 y 2 de 1.', ecuacion: ['2 × 64 + 1 × 16 + 1 × 4 + 2 × 1 = 150'] },
        { texto: 'Los paquetes son las cifras sumadas: 2 + 1 + 1 + 2.' },
      ],
      respuesta: [cif(6), ' paquetes'] },
    { nivel: 3, titulo: 'De base 3 a base 5',
      enunciado: ['¿Cómo se escribe en base ', bas2(5), ' el menor numeral de cuatro cifras de base ', bas(3), '?'],
      datos: [DN.primera, DD.f4('n'), DD.div('n'), DD.restos],
      solucion: [
        { texto: ['El menor de cuatro cifras empieza en 1 y sigue con ceros: ', num('1000', 3), ' = 3 × 3 × 3 = ', cant(27), '. La base nueva, 5, va en verde.'] },
        { texto: 'Ahora, 27 entre 5 hasta que el cociente es 0.', ecuacion: cuentasDiv2(27, 5) },
        { texto: 'Los restos, del último al primero.', ecuacion: [num('1000', 3), ' = ', cant(27), ' = ', num2('102', 5)] },
      ],
      respuesta: [num2('102', 5)] },
    { nivel: 3, titulo: 'De base 4 a base 7',
      enunciado: ['El mayor numeral de tres cifras de base ', bas(4), ', ¿cómo se escribe en base ', bas2(7), '?'],
      datos: [DN.cifras, DD.f3('n'), DD.div('n'), DD.restos],
      solucion: [
        { texto: ['En base 4 la cifra mayor es 3: el numeral es ', num('333', 4), '. La base nueva, 7, va en verde.'], ecuacion: [num('333', 4), ' = 3 × 16 + 3 × 4 + 3 = ', cant(63)] },
        { texto: 'Después, 63 entre 7.', ecuacion: cuentasDiv2(63, 7) },
        { texto: 'Del último resto al primero: 1, 2, 0. De vuelta: 49 + 14 + 0 = 63.' },
      ],
      respuesta: [num2('120', 7)] },
    { nivel: 3, titulo: 'Todas las cifras iguales',
      enunciado: ['Escribe ', cant(124), ' en base ', bas(5), '. ¿Por qué salen todas sus cifras iguales?'],
      datos: [DD.div(5), DD.restos, [pot(5, '3'), ' = 5 × 5 × 5']],
      solucion: [
        { texto: 'Se divide entre 5 hasta que el cociente es 0.', ecuacion: cuentasDiv(124, 5) },
        { texto: ['Los tres restos son 4: ', cant(124), ' = ', num('444', 5), '.'] },
        { texto: ['Con un caramelo más serían 125 = 5³: un cajón justo, ', num('1000', 5), '. Por eso 124 es el mayor de tres cifras.'] },
      ],
      respuesta: [num('444', 5), ': es 5³ − 1'] },
  ];

  const cambio = {
    id: 'cambio-base',
    titulo: 'De base 10 a otra base',
    pregunta: '¿Cómo se escribe un número en otra base?',
    temas: ['Cambio de base'],
    pieza: PU,
    aprendizaje: 'Para pasar un número a base n se divide entre n hasta que el cociente sea 0; el primer resto es la última cifra.',
    actividad: 'Empacar 75 caramelos ronda por ronda hasta no poder juntar más.',
    // Lee: el montón, la división con resto y la ronda como división. No dice en qué orden se escriben los restos sin
    // caramelos (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'Un montón por empacar', texto: ['A doña Juana le llegan ', cant(75), ' caramelos sueltos y tiene bolsitas de ', bas(4), '. Los empaca por rondas: primero llena bolsitas; después junta 4 bolsitas en una caja, y 4 cajas en un cajón.'],
          pieza: PU, dibujo: { datos: montonF(4, 75).datos, estado: {} } },
        { titulo: 'Dividir con resto', texto: ['Llenar bolsitas es dividir. 17 caramelos en bolsitas de ', bas(5), ' llenan 3 bolsitas y sobran 2: el 3 es el cociente y el 2, el resto. El resto siempre es menor que 5.'],
          ecuacion: [cant(17), ' = 3 × ', bas(5), ' + ', cif(2)] },
        { titulo: 'Una ronda, una división', texto: ['En cada ronda, lo que se juntó se vuelve a juntar de a ', bas(4), ': el cociente de una división se divide otra vez. Se para cuando ya no alcanza para juntar nada.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Avanza ronda por ronda. Mira cuánto queda sin juntar en cada ronda y en qué lugar de la etiqueta termina.'] },
      ],
    },
    ejemplos: EJEMPLOS_CAMBIO,
    juega: {
      pieza: PU,
      consigna: 'Doña Juana tiene caramelos sueltos y bolsitas de un tamaño. Empaca ronda por ronda: en cada ronda junta de a n lo que se pueda.',
      mision: {
        texto: ['Con ', cant(75), ' caramelos y bolsitas de ', bas(4), ', empaca hasta que ya no se pueda juntar nada.'],
        logrado: val => val.n === 75 && val.b === 4 && val.ronda === 3,
        bien: '1 cajón, 0 cajas, 2 bolsitas y 3 sueltos: la etiqueta es 1023 en base 4.',
      },
      voz: '¿Qué queda sin juntar en esta ronda?',
      leyenda: [
        { s: cant('75'), t: 'caramelos sueltos al empezar' },
        { s: bas('n'), t: 'de cuántos se junta cada vez: la base' },
        { s: 'cociente', t: 'lo que se juntó en la ronda' },
        { s: cif('resto'), t: 'lo que no alcanzó: una cifra' },
        { s: 'aro punteado', t: 'los que se juntan en la ronda siguiente' },
        { s: num('abc', 'n'), t: 'la etiqueta, cuando ya no se junta nada' },
      ],
      controles: [
        { id: 'n', etiqueta: 'Caramelos sueltos', color: 'c-f', min: 20, max: 80, paso: 1, inicio: 75, decimales: 0 },
        { id: 'b', etiqueta: 'Caramelos por bolsita, n', color: 'c-i', min: 3, max: 9, paso: 1, inicio: 4, decimales: 0 },
        { id: 'ronda', etiqueta: 'Ronda de empaque', min: 0, max: 3, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => ({ datos: Object.assign(datosRonda(v.n, v.b, v.ronda), { escala: escalaR(v.n, v.b) }), estado: {} }),
      // La relación de la ronda: lo de antes = lo juntado × n + lo que sobró. Al final, la etiqueta.
      lectura: v => {
        const e = ronda(v.n, v.b, v.ronda), k = e.kk;
        if (k === 0) return [cant(v.n), ' caramelos sueltos: todavía no se junta nada'];
        const d = e.ds[k - 1];
        const antes = k === 1 ? cant(d.x) : String(d.x);
        const out = [antes, ` ${nom(k - 1, d.x)} = ${d.q} ${nomR(k, d.q)} de `, bas(v.b), ' + ', cif(d.r), ` ${nomR(k - 1, d.r)}`];
        return e.listo ? out.concat(['   →   ', num(enBase(v.n, v.b), v.b)]) : out;
      },
      minimo: 3,
    },
    predice: {
      pieza: 'arit-tabla',
      pregunta: ['Ahora sin caramelos, solo con divisiones. Al pasar ', cant(19), ' a base ', bas(3), ', los restos salen 1, 0 y 2, en ese orden. ¿Cómo se escribe 19 en base 3?'],
      datos: [['Restos, en el orden en que salen: ', cif('1, 0 y 2')], 'Cocientes, en el orden en que salen: 6, 2 y 0'],
      voz: 'Piensa qué resto es lo que quedó suelto.',
      opciones: [
        { id: 'c', texto: [num('201', 3)], correcta: true },
        { id: 'orden', texto: [num('102', 3)], error: 'AT-ORDEN', siFuera: 'Bien que las cifras sean los restos. Pero el primer resto quedó suelto: va a la derecha.' },
        { id: 'cocientes', texto: [num('62', 3)], error: 'AT-COCIENTE', siFuera: 'Bien que busques las cifras en la tabla. Pero los cocientes se siguen juntando: las cifras son los restos.' },
        { id: 'decimal', texto: [num('19', 3)], error: 'AT-DECIMAL', siFuera: 'Bien que el número no cambie. Pero su escritura sí: en base 3 no existe el 9.' },
      ],
      dibujo: { datos: T19, estado: { columna: 3 } },
      revelar: { datos: T19L, estado: { paso: 4, columna: 4 } },
      coincide: 'Coincide: el primer resto es lo suelto y el último, las cajas: 2 × 9 + 0 × 3 + 1 = 19.',
      noCoincide: 'Revisemos: el primer resto es lo que sobró al llenar bolsitas. Va a la derecha.',
    },
    mira: {
      pieza: 'arit-tabla',
      datos: T19L,
      voz: 'Cada fila es una ronda de empaque.',
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: '19 entre 3: 6 bolsitas y sobra 1 suelto.', ecuacion: [cant(19), ' = 6 × ', bas(3), ' + ', cif(1)] },
        { estado: { paso: 2, fila: 1 }, texto: 'Las 6 bolsitas, de a 3: 2 cajas y sobran 0 bolsitas.', ecuacion: ['6 = 2 × ', bas(3), ' + ', cif(0)] },
        { estado: { paso: 3, fila: 2 }, texto: '2 cajas no llenan un cajón: el cociente ya es 0.', ecuacion: ['2 = 0 × ', bas(3), ' + ', cif(2)] },
        { estado: { paso: 4, columna: 4 }, texto: 'El primer resto va a los sueltos; el último, a las cajas.', ecuacion: [cif(2), ' cajas, ', cif(0), ' bolsitas, ', cif(1), ' suelto'] },
        { estado: { paso: 4, columna: 3 }, texto: 'Se escribe del último resto al primero: es el cambio de base.', ecuacion: [cant(19), ' = ', num('201', 3)] },
        { estado: { paso: 4 }, texto: 'De vuelta, la descomposición da 19 otra vez.', ecuacion: [num('201', 3), ' = 2 × 9 + 0 × 3 + 1 = ', cant(19)] },
      ],
    },
    regla: {
      texto: 'Para pasar un número D a base n, se divide entre n y cada cociente, hasta llegar a 0. El primer resto es la última cifra; el último, la primera.',
      ecuacion: ['D = ', { llave: ['q'], nota: 'cociente' }, ' × ', bas('n'), ' + ', { llave: [cif('r')], nota: 'resto: una cifra', color: 'c-o' }, SEP, '0 ≤ ', cif('r'), ' < ', bas('n'),
        SEP, num('21', 5), ' = 2 × ', bas(5), ' + 1 = ', cant(11), ' = 2 × ', bas2(4), ' + 3 = ', num2('23', 4)],
      condicion: 'El número no cambia, su escritura sí. Entre bases que no son 10, se pasa por base 10; la nueva, en verde.',
      voz: 'Divide hasta llegar a 0 y lee los restos desde el último.',
    },
    // Así se resuelve: un cambio de base entre dos bases que no son 10, pasando por base 10 (la segunda base en verde).
    // «Ahora tú» pide otra cosa: de base 10 a otra, el reempaque de un pedido, la suma de cifras y los paquetes.
    resuelve: {
      pieza: 'arit-tabla',
      generar(s) {
        const q = azar(s + 900), a = q.ent(3, 5), c = q.de([6, 7, 8, 9].filter(x => x !== a)), N = q.ent(a * a + 1, a * a * a - 1);
        const na = enBase(N, a), nc = enBase(N, c);
        return {
          enunciado: ['Pasa ', num(na, a), ' a base ', bas2(c), '.'],
          datos: [DD.f3('n'), DD.div('n')],
          pasos: [
            { tipo: 'pide', texto: ['Piden el mismo número escrito en base ', bas2(c), ' (en verde, la base nueva). Ninguna es 10.'] },
            { tipo: 'regla', texto: 'Entre dos bases que no son 10, primero paso a base 10 con la descomposición. Después divido entre la nueva base.' },
            { tipo: 'cuentas', texto: ['A base 10: cada cifra por lo que vale su lugar en base ', bas(a), '.'], ecuacion: [num(na, a), ' = ', descT(na, a), ' = ', cant(N)] },
            { tipo: 'cuentas', texto: ['Divido ', cant(N), ' entre ', bas2(c), ' hasta que el cociente es 0, y leo los restos desde el último.'], ecuacion: cuentasDiv2(N, c),
              dibujo: { datos: tablaDiv(N, c, { pasos: true, segunda: true }), estado: { paso: divisiones(N, c).length, columna: 3 } } },
            { tipo: 'sentido', texto: `De vuelta: ${descT(nc, c)} = ${N}. Las dos escrituras valen lo mismo.` },
          ],
          respuesta: [num(na, a), ' = ', num2(nc, c)],
        };
      },
    },
    ahoraTu: {
      pieza: 'arit-tabla',
      voz: 'Divide hasta llegar a 0 y lee los restos desde el último.',
      generar(sem) {
        const r = azar(sem + 53), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoABase, r);
        if (tipo === 1) return conCuatro(casoReempaque, r);
        if (tipo === 2) return conCuatro(casoSumaCifras, r);
        return conCuatro(casoPaquetes, r);
      },
    },
  };

  // ---------- Idea 4 (nueva, 17 nov): la base que no se ve (base desconocida y cifras ocultas) ----------
  // Objeto: un paquete cerrado de un puesto vecino; la etiqueta dice 23 y adentro hay 17 caramelos, pero nadie anotó de
  // cuántos es cada bolsita. Es lo que más pregunta San Marcos (5 de 9 preguntas de la unidad, propuesta §0).
  // Cambia: el tamaño de bolsita que se prueba. · Permanece: la etiqueta 23 y los 17 caramelos. · Progresa: cuánto daría
  // la etiqueta con cada base, hasta que cuadra. · Se reserva: usar la base hallada para leer otra etiqueta del mismo
  // puesto (la predicción: 31₍ₙ₎ = 25 → 13₍ₙ₎ = 11). · Debe verse: con una base mayor la etiqueta vale más; solo una base
  // da justo 17, y tiene que ser mayor que cada cifra.
  // Errores (hipótesis de aula, sin medir; trampas 23 y 24): AT-DECIMAL lee la etiqueta en base 10 · AT-PIDE-BASE da la
  // base y no lo que se pide · AT-INVIERTE cree que invertir las cifras invierte el valor · AT-MENOR da la menor base
  // posible y no la que cumple · AT-SIGNO suma en vez de restar al despejar · AT-SIN-SUELTOS olvida la cifra de la
  // derecha · AT-UNO-SOLO acota con un solo numeral · AT-CIFRA-B toma la cifra mayor como base.
  const BOLSA = [['En el paquete: '], ['17 caramelos', 'f', 700]];
  const pedJ4 = b => ({ n: b, bolsitas: 2, sueltos: 3, rotulos: true, regla: [BOLSA, [['1 bolsita = '], [String(b), 'i', 700], [' caramelos']]], etiqueta: { cifras: '23' } });
  let esc4 = null;
  const escala4 = () => esc4 || (esc4 = escalaDe([4, 5, 6, 7, 8, 9].map(pedJ4)));
  // Un paquete cerrado con su etiqueta de base desconocida, 23₍ₙ₎ como en el texto (auditoría, B7), y lo que tiene adentro
  // (o «?»).
  const bolsaF = (cifras, N, otra) => fig({ cerrado: true, etiqueta: { cifras, base: 'n' },
    regla: [[['En el paquete: '], [N === undefined ? '?' : `${N} caramelos`, N === undefined ? null : 'f', 700]], [['1 bolsita = '], ['?', null, 700], [' caramelos']]].concat(otra ? [otra] : []) });
  const P31 = [['Paquete 31: '], ['25 caramelos', 'f', 700]];
  const MIRA4 = { pasos: [
    { cerrado: true, etiqueta: { cifras: '31', base: 'n' }, regla: [P31, [['1 bolsita = '], ['?', null, 700], [' caramelos']]] },
    { cerrado: true, etiqueta: { cifras: '31', base: 'n' }, regla: [P31, [['3 × '], ['n', 'i', 700], [' + 1 = 25']]] },
    { cerrado: false, n: 8, bolsitas: 3, sueltos: 1, rotulos: true, etiqueta: { cifras: '31' }, regla: [P31, [['1 bolsita = '], ['8', 'i', 700], [' caramelos']]] },
    { cerrado: false, n: 8, bolsitas: 1, sueltos: 3, rotulos: true, etiqueta: { cifras: '13' }, regla: [[['1 bolsita = '], ['8', 'i', 700], [' caramelos']], [['Paquete 13: 8 + 3 = '], ['11', 'f', 700]]] },
    { cerrado: true, etiqueta: { cifras: '31', base: 'n' }, regla: [[['Sin saber cuántos hay:']], [['3 < '], ['n', 'i', 700], [', así que '], ['n ≥ 4', 'i', 700]]] },
  ] };
  MIRA4.escala = 1.23;   // fija, como ESC203: numeracion.test.js comprueba que es la que da escalaDe(MIRA4.pasos)
  const vale = (cifras, n) => cifras.split('').reduce((a, c) => a * n + +c, 0);

  // Ahora tú 4 · tipo 0: la base de una etiqueta de dos cifras que vale un número conocido.
  function casoBaseLineal(r, sem) {
    for (;;) {
      const n = r.ent(5, 9), d1 = r.de([2, 3]), m = r.ent(1, 3), d0 = m * d1;
      if (d0 > n - 2) continue;
      const t = `${d1}${d0}`, N = d1 * n + d0;
      const pregunta = sem % 2 === 0
        ? ['Un paquete de un puesto vecino dice ', num(t, 'n'), ' y tiene ', cant(N), ' caramelos. ¿De cuántos caramelos es cada bolsita?']
        : ['Si ', num(t, 'n'), ' = ', cant(N), ', ¿cuánto vale la base ', bas('n'), '?'];
      return {
        pregunta,
        datos: [DD.f2('n'), DN.cifras],
        opciones: opciones(n, [
          { id: 'menor', valor: d0 + 1, error: 'AT-MENOR', siFuera: `${d0 + 1} es la menor base en que se puede escribir, bien. Pero con ella no vale ${N}.` },
          { id: 'signo', valor: n + 2 * m, error: 'AT-SIGNO', siFuera: `Plantear ${d1} × n + ${d0} = ${N} está bien. Pero al despejar, el ${d0} pasa restando.` },
          { id: 'sin-sueltos', valor: n + m, error: 'AT-SIN-SUELTOS', siFuera: `Bien que el ${d1} vaya por n. Pero el ${d0} también cuenta: son sueltos.` },
        ], x => `n = ${x}`),
        solucion: { texto: `La descomposición da una ecuación en n; el ${d0} pasa restando.`,
          ecuacion: [num(t, 'n'), ` = ${d1} × `, bas('n'), ` + ${d0} = `, cant(N), SEP, `${d1} × `, bas('n'), ` = ${N - d0}`, SEP, bas('n'), ' = ', bas(n)] },
      };
    }
  }
  // Ahora tú 4 · tipo 1: con una etiqueta se halla la base; con la base, se lee otra del mismo puesto.
  function casoOtraEtiqueta(r) {
    const n = r.ent(5, 9), d1 = r.ent(2, n - 1), d0 = r.ent(1, d1 - 1), A = `${d1}${d0}`, B = `${d0}${d1}`;
    const N1 = d1 * n + d0, V2 = d0 * n + d1, inv = String(N1).split('').reverse().join('');
    return {
      pregunta: ['En un puesto, la etiqueta ', num(A, 'n'), ' tiene ', cant(N1), ' caramelos. ¿Cuántos tiene la etiqueta ', num(B, 'n'), ' del mismo puesto?'],
      datos: [DD.f2('n'), 'Las dos etiquetas son del mismo puesto: la misma base'],
      opciones: opciones(V2, [
        { id: 'decimal', valor: +B, error: 'AT-DECIMAL', siFuera: `Bien que sea la misma idea. Pero ${B} de este puesto no se lee en base 10.` },
        { id: 'base', valor: n, error: 'AT-PIDE-BASE', siFuera: `Hallar que la bolsita es de ${n} está muy bien. Falta usarla para la otra etiqueta.` },
        { id: 'invierte', valor: N1 >= 10 && inv !== String(N1) ? +inv : null, error: 'AT-INVIERTE', siFuera: `${B} es ${A} al revés, es cierto. Pero el valor no se invierte: hay que hallar la base.` },
      ]),
      solucion: { texto: `Con la primera etiqueta sale la base: ${n}. Con ella se lee la otra.`,
        ecuacion: [`${d1} × `, bas('n'), ` + ${d0} = ${N1}`, '   →   ', bas('n'), ' = ', bas(n), SEP, num(B, n), ` = ${d0} × ${n} + ${d1} = `, cant(V2)] },
    };
  }
  // Ahora tú 4 · tipo 2 (nivel examen, San Marcos 2022 y 2023-II): la misma cifra oculta en dos numerales de bases
  // distintas; cada base la acota y vale la más chica.
  function casoAcotarSuma(r) {
    const p = r.ent(5, 9), q = r.ent(3, p - 1), u = r.ent(0, p - 1), v = r.ent(1, q - 1);
    const S = a => (a * p + u) + (v * q + a);
    const a1 = `a${u}`, a2 = `${v}a`, amax = q - 1;
    return {
      pregunta: ['Los numerales ', num(a1, p), ' y ', num(a2, q), ' están bien escritos. ¿Cuál es el mayor valor que puede tener su suma, en base 10?'],
      datos: [DN.cifras, DN.primera, DD.f2('n')],
      opciones: opciones(S(amax), [
        { id: 'uno', valor: S(p - 1), error: 'AT-UNO-SOLO', siFuera: `En base ${p}, a llega a ${p - 1}, es cierto. Pero en base ${q} no puede pasar de ${q - 1}.` },
        { id: 'menor', valor: S(1), error: 'AT-MENOR', siFuera: 'Con a = 1 los dos están bien escritos. Pero piden el mayor valor posible.' },
        { id: 'decimal', valor: (10 * amax + u) + (10 * v + amax), error: 'AT-DECIMAL', siFuera: `a = ${amax} está bien. Pero cada numeral se pasa a base 10 con su propia base.` },
      ]),
      solucion: { texto: `a es menor que ${p} y que ${q}: a lo más, ${amax}. Se reemplaza y se suma.`,
        ecuacion: [num(`${amax}${u}`, p), ' + ', num(`${v}${amax}`, q), ` = ${amax * p + u} + ${v * q + amax} = `, cant(S(amax))] },
    };
  }
  // Ahora tú 4 · tipo 3 (nivel examen, San Marcos 2025-I): el mayor numeral de tres cifras de una base, si se sabe cuánto
  // suman sus cifras.
  function casoMayorSuma(r) {
    const n = r.ent(4, 9), S = 3 * (n - 1), V = n ** 3 - 1;
    return {
      pregunta: ['El mayor numeral de tres cifras de cierta base tiene cifras que suman ', cif(S), '. ¿Cuánto vale en base 10?'],
      datos: [DN.cifras, DD.f3('n')],
      opciones: opciones(V, [
        { id: 'decimal', valor: (n - 1) * 111, error: 'AT-DECIMAL', siFuera: `${String(n - 1).repeat(3)} es el numeral, bien. Pero falta pasarlo a base 10.` },
        { id: 'base', valor: n, error: 'AT-PIDE-BASE', siFuera: `Hallar la base, ${n}, está muy bien. Pero piden el valor del numeral.` },
        { id: 'cifra-b', valor: (n - 1) ** 3 - 1, error: 'AT-CIFRA-B', siFuera: `Bien que cada cifra sea ${n - 1}. Pero esa es la cifra mayor: la base es una más.` },
      ]),
      solucion: { texto: `Las tres cifras son la mayor, n − 1: 3 × (n − 1) = ${S}, así que n = ${n}.`,
        ecuacion: [num(String(n - 1).repeat(3), n), ` = ${n - 1} × ${n * n} + ${n - 1} × ${n} + ${n - 1} = `, cant(V)] },
    };
  }

  // Ejemplos resueltos de la idea 4. Cuentas rehechas aparte (cuentas-f3.js): 24₍ₙ₎ = 18 → n = 7;
  // 4a₍₆₎: a de 0 a 5; a2₍₅₎: a de 1 a 4; 32₍₆₎ = 20; 121₍ₙ₎ = 49 → n = 6;
  // 2a₍₄₎ y a1₍₃₎: a = 1 o 2; 21₍ₙ₎ = 13₍₆₎ = 9 → n = 4; 34₍ₙ₎ < 30 → n de 5 a 8; mayor de tres cifras con suma 18:
  // 666₍₇₎ = 342; a3₍₅₎ + 2a₍₄₎ a lo más 33₍₅₎ + 23₍₄₎ = 29; a3a₍₈₎ = 219 → a = 3; (a − 1)(2a)₍₇₎: a = 2 o 3;
  // 23₍ₙ₎ + 32₍ₙ₎ = 45 → n = 8 (D, 10, pasa el 5 sumando: 5n = 50). Fase 8: 15₍ₙ₎ = 12 → n = 7 y 102₍ₙ₎ = 27 → n = 5
  // reemplazan a 13₍ₙ₎ = 11 y a «Dos etiquetas, un puesto», que eran la predicción (31₍ₙ₎ = 25 → 13₍ₙ₎ = 11) con otros
  // números (auditoría, M2). Ninguna figura muestra la base que se pide: la etiqueta va con «(n)».
  const EJEMPLOS_BASE = [
    { nivel: 1, titulo: 'El paquete del vecino',
      enunciado: ['Un paquete cerrado dice ', num('24', 'n'), ' y tiene ', cant(18), ' caramelos. ¿De cuántos caramelos es cada bolsita?'],
      datos: [DD.f2('n')],
      figura: bolsaF('24', 18),
      solucion: [
        { texto: 'La etiqueta dice 2 bolsitas y 4 sueltos: eso tiene que dar 18.', ecuacion: ['2 × ', bas('n'), ' + 4 = ', cant(18)] },
        { texto: 'Se despeja: el 4 pasa restando.', ecuacion: ['2 × ', bas('n'), ' = 14', SEP, bas('n'), ' = ', bas(7)] },
      ],
      respuesta: ['Bolsitas de ', bas(7), ' caramelos'] },
    { nivel: 1, titulo: 'Una ecuación corta',
      enunciado: ['Si ', num('15', 'n'), ' = ', cant(12), ', ¿cuánto vale la base ', bas('n'), '?'],
      datos: [DD.f2('n')],
      figura: bolsaF('15', 12),
      solucion: [
        { texto: 'Una bolsita y 5 sueltos son 12 caramelos.', ecuacion: ['1 × ', bas('n'), ' + 5 = ', cant(12), SEP, bas('n'), ' = ', bas(7)] },
        { texto: ['Sirve: las cifras 1 y 5 son menores que ', bas(7), '.'] },
      ],
      respuesta: [bas('n'), ' = ', bas(7)] },
    { nivel: 1, titulo: 'La cifra borrosa',
      enunciado: ['En la etiqueta ', num('4a', 6), ', la cifra ', cif('a'), ' quedó borrosa. ¿Qué valores puede tener?'],
      datos: [DN.cifras],
      figura: fig({ n: 6, cerrado: true, regla: 1, etiqueta: { cifras: '4a' } }),
      solucion: [
        { texto: ['a es una cifra de base ', bas(6), ': va de 0 a 5.'] },
        { texto: ['Puede ser 0, porque no es la primera cifra: ', num('40', 6), ' son 4 bolsitas y ningún suelto.'] },
      ],
      respuesta: [cif('a'), ' puede ser ', cif('0, 1, 2, 3, 4 o 5')] },
    { nivel: 1, titulo: 'La primera, borrosa',
      enunciado: ['En la etiqueta ', num('a2', 5), ', la cifra ', cif('a'), ' quedó borrosa. ¿Qué valores puede tener?'],
      datos: [DN.cifras, DN.primera],
      figura: fig({ n: 5, cerrado: true, regla: 1, etiqueta: { cifras: 'a2' } }),
      solucion: [
        { texto: ['a es una cifra de base ', bas(5), ': de 0 a 4.'] },
        { texto: 'Pero es la primera cifra, y la primera no es 0: quedan 1, 2, 3 y 4.' },
      ],
      respuesta: [cif('a'), ' puede ser ', cif('1, 2, 3 o 4')] },
    { nivel: 1, titulo: '¿Sirve esta base?',
      enunciado: ['Un paquete dice ', num('32', 'n'), ' y tiene ', cant(20), ' caramelos. ¿Puede ser de bolsitas de ', bas(6), '?'],
      datos: [DD.f2('n'), DN.cifras],
      figura: bolsaF('32', 20),
      solucion: [
        { texto: 'Se prueba la base 6 en la etiqueta.', ecuacion: [num('32', 6), ' = 3 × ', bas(6), ' + 2 = ', cant(20)] },
        { texto: ['Da justo 20, y las cifras 3 y 2 son menores que ', bas(6), ': sí sirve.'] },
      ],
      respuesta: ['Sí: la base es ', bas(6)] },
    { nivel: 2, titulo: 'Tres cifras',
      enunciado: ['Si ', num('121', 'n'), ' = ', cant(49), ', ¿cuánto vale la base ', bas('n'), '?'],
      datos: [DD.f3('n'), DN.cifras],
      figura: bolsaF('121', 49),
      solucion: [
        { texto: ['La cifra mayor es 2: la base es por lo menos 3. Con una base mayor la etiqueta vale más; se prueba desde la menor.'] },
        { texto: 'Prueba por prueba:', ecuacion: [num('121', 3), ' = 16', SEP, num('121', 4), ' = 25', SEP, num('121', 5), ' = 36', SEP, num('121', 6), ' = 36 + 12 + 1 = ', cant(49)] },
      ],
      respuesta: [bas('n'), ' = ', bas(6)] },
    { nivel: 2, titulo: 'Una caja y dos sueltos',
      enunciado: ['Un paquete dice ', num('102', 'n'), ' y tiene ', cant(27), ' caramelos. ¿De cuántos caramelos es cada bolsita?'],
      datos: [DD.f3('n'), DN.cifras],
      figura: bolsaF('102', 27),
      solucion: [
        { texto: ['La etiqueta dice 1 caja, 0 bolsitas y 2 sueltos. Una caja guarda ', bas('n'), ' × ', bas('n'), ' caramelos.'], ecuacion: [num('102', 'n'), ' = 1 × ', pot('n', '2'), ' + 0 × ', bas('n'), ' + 2 = ', cant(27)] },
        { texto: 'Se despeja: el 2 pasa restando.', ecuacion: [pot('n', '2'), ' = 25', SEP, bas('n'), ' = ', bas(5)] },
        { texto: ['Sirve: las cifras 1, 0 y 2 son menores que ', bas(5), '.'] },
      ],
      respuesta: ['Bolsitas de ', bas(5), ' caramelos'] },
    { nivel: 2, titulo: 'Dos bases a la vez',
      enunciado: ['Si ', num('2a', 4), ' y ', num('a1', 3), ' están bien escritos, ¿qué valores puede tener ', cif('a'), '?'],
      datos: [DN.cifras, DN.primera],
      solucion: [
        { texto: ['En ', num('2a', 4), ', a es menor que 4. En ', num('a1', 3), ', a es menor que 3 y no es 0, porque va primera.'] },
        { texto: 'Las dos condiciones a la vez: a es 1 o 2. Una cifra que está en dos numerales es menor que las dos bases.' },
      ],
      respuesta: [cif('a'), ' = ', cif(1), ' o ', cif(2)] },
    { nivel: 2, titulo: 'Igual a otro numeral',
      enunciado: ['¿En qué base ', bas('n'), ' se cumple ', num('21', 'n'), ' = ', num('13', 6), '?'],
      datos: [DD.f2('n'), DN.cifras],
      solucion: [
        { texto: 'Primero el numeral conocido, en base 10.', ecuacion: [num('13', 6), ' = 1 × 6 + 3 = ', cant(9)] },
        { texto: 'Después, la ecuación en n.', ecuacion: ['2 × ', bas('n'), ' + 1 = ', cant(9), SEP, bas('n'), ' = ', bas(4)] },
        { texto: ['Sirve: las cifras 2 y 1 son menores que ', bas(4), '.'] },
      ],
      respuesta: [bas('n'), ' = ', bas(4)] },
    { nivel: 2, titulo: 'Menos de 30',
      enunciado: ['Un paquete dice ', num('34', 'n'), ' y tiene menos de ', cant(30), ' caramelos. ¿De cuántos caramelos pueden ser sus bolsitas?'],
      datos: [DD.f2('n'), DN.cifras],
      figura: fig({ cerrado: true, etiqueta: { cifras: '34', base: 'n' }, regla: [[['Hay menos de '], ['30 caramelos', 'f', 700]], [['1 bolsita = '], ['?', null, 700], [' caramelos']]] }),
      solucion: [
        { texto: ['Por las cifras: hay un 4, así que la base pasa al 4: ', bas('n'), ' ≥ 5.'] },
        { texto: 'Por la cantidad: 3 × n + 4 tiene que ser menor que 30.', ecuacion: ['3 × ', bas('n'), ' + 4 < 30', SEP, '3 × ', bas('n'), ' < 26', SEP, bas('n'), ' ≤ 8'] },
        { texto: 'Las dos cotas a la vez: de 5 a 8.' },
      ],
      respuesta: ['Bolsitas de ', bas(5), ', ', bas(6), ', ', bas(7), ' u ', bas(8)] },
    { nivel: 3, titulo: 'El mayor y su suma',
      enunciado: ['El mayor numeral de tres cifras de cierta base tiene cifras que suman 18. ¿Cuánto vale en base 10?'],
      alternativas: ['342', '215', '343', '666'],
      datos: [DN.cifras, DD.f3('n')],
      solucion: [
        { texto: 'El mayor de tres cifras repite la cifra mayor, n − 1. Tres veces suma 18.', ecuacion: ['3 × (', bas('n'), ' − 1) = 18', SEP, bas('n'), ' − 1 = 6', SEP, bas('n'), ' = ', bas(7)] },
        { texto: 'El numeral es 666₍₇₎.', ecuacion: [num('666', 7), ' = 6 × 49 + 6 × 7 + 6 = 294 + 42 + 6 = ', cant(342)] },
        { texto: ['Las trampas: ', letra('D', 'cantidad'), ' no lo pasa a base 10; ', letra('C', 'cantidad'), ' es 7³, un caramelo de más; ', letra('B', 'cantidad'), ' toma 6 como base.'] },
      ],
      respuesta: [letra('A', 'cantidad'), ': ', cant(342)] },
    { nivel: 3, titulo: 'Una cifra, dos bases',
      enunciado: ['Los numerales ', num('a3', 5), ' y ', num('2a', 4), ' están bien escritos. ¿Cuál es el mayor valor de su suma en base 10?'],
      alternativas: ['35', '17', '56', '29'],
      datos: [DN.cifras, DN.primera, DD.f2('n')],
      solucion: [
        { texto: ['a es menor que 5 y menor que 4, y no es 0: a lo más, a = 3. La base más chica acota.'] },
        { texto: 'Con a = 3, cada numeral con su base.', ecuacion: [num('33', 5), ' = 15 + 3 = 18', SEP, num('23', 4), ' = 8 + 3 = 11', SEP, '18 + 11 = ', cant(29)] },
        { texto: ['Las trampas: ', letra('A', 'cantidad'), ' usa a = 4, que no existe en base 4; ', letra('B', 'cantidad'), ', a = 1; ', letra('C', 'cantidad'), ' suma en base 10.'] },
      ],
      respuesta: [letra('D', 'cantidad'), ': ', cant(29)] },
    { nivel: 3, titulo: 'Juntar de 8 en 8',
      enunciado: ['Un pedido de bolsitas de ', bas(8), ' queda en ', cif('a'), ' cajas, 3 bolsitas y ', cif('a'), ' sueltos, y tiene ', cant(219), ' caramelos. ¿Cuánto vale ', cif('a'), '?'],
      alternativas: ['2', '4', '5', '3'],
      datos: [DN.todo(8), DD.f3('n')],
      figura: fig({ n: 8, cerrado: true, regla: [[['En el paquete: '], ['219 caramelos', 'f', 700]], [['1 bolsita = '], ['8', 'i', 700], [' caramelos']]], etiqueta: { cifras: 'a3a' } }),
      solucion: [
        { texto: 'La etiqueta lleva la letra en dos lugares: en las cajas y en los sueltos.', ecuacion: [num('a3a', 8), ' = ', cif('a'), ' × 64 + 3 × 8 + ', cif('a'), ' = 65 × ', cif('a'), ' + 24'] },
        { texto: 'Eso son los 219 caramelos.', ecuacion: ['65 × ', cif('a'), ' + 24 = ', cant(219), SEP, '65 × ', cif('a'), ' = 195', SEP, cif('a'), ' = 195 ÷ 65 = ', cif(3)] },
        { texto: ['Sirve: 3 es menor que ', bas(8), '. Las otras no dan 219: con 2 salen 154; con 4, 284; con 5, 349.'] },
      ],
      respuesta: [letra('D'), ': ', cif('a'), ' = ', cif(3)] },
    { nivel: 3, titulo: 'Cifras con un parámetro',
      enunciado: ['¿Para cuántos valores de ', cif('a'), ' está bien escrito el numeral ', num('(a − 1)(2a)', 7), '?'],
      alternativas: ['1', '3', '2', '4'],
      datos: [DN.cifras, DN.primera, 'Bajo la raya, cada paréntesis es una sola cifra: (2a) es la cifra 2 × a'],
      solucion: [
        { texto: 'La primera cifra, a − 1, no puede ser 0.', ecuacion: [cif('a'), ' − 1 ≥ 1   →   ', cif('a'), ' ≥ 2'] },
        { texto: ['La segunda, 2 × a, es una cifra de base ', bas(7), ': a lo más 6.'], ecuacion: ['2 × ', cif('a'), ' ≤ 6   →   ', cif('a'), ' ≤ 3'] },
        { texto: 'Quedan a = 2 (el numeral 14₍₇₎) y a = 3 (el 26₍₇₎).' },
        { texto: ['Las trampas: ', letra('B', 'cantidad'), ' acepta a = 1 (primera cifra 0); ', letra('D', 'cantidad'), ' mira solo la segunda y cuenta desde 0; ', letra('A', 'cantidad'), ' cree que 2 × a no llega a 6.'] },
      ],
      respuesta: [letra('C', 'cantidad'), ': dos valores'] },
    { nivel: 3, titulo: 'Una suma con base oculta',
      enunciado: ['¿En qué base se cumple ', num('23', 'n'), ' + ', num('32', 'n'), ' = ', cant(45), '?'],
      alternativas: ['9', '7', '8', '10'],
      datos: [DD.f2('n'), DN.cifras],
      solucion: [
        { texto: 'Se descompone cada numeral con la misma base.', ecuacion: ['(2 × ', bas('n'), ' + 3) + (3 × ', bas('n'), ' + 2) = 5 × ', bas('n'), ' + 5'] },
        { texto: 'Eso vale 45.', ecuacion: ['5 × ', bas('n'), ' + 5 = ', cant(45), SEP, '5 × ', bas('n'), ' = 40', SEP, bas('n'), ' = ', bas(8)] },
        { texto: ['Sirve: 2 y 3 son menores que 8. ', letra('D', 'base'), ' sale de pasar el 5 sumando: 5 × n = 50; con ', letra('B', 'base'), ', la suma daría 40, y con ', letra('A', 'base'), ', 50.'] },
      ],
      respuesta: [letra('C', 'base'), ': base ', bas(8)] },
  ];

  const baseOculta = {
    id: 'base-desconocida',
    titulo: 'La base que no se ve',
    pregunta: '¿Cómo se halla una base que no te dan?',
    temas: ['Base desconocida y cifras ocultas'],
    pieza: PU,
    aprendizaje: 'Si un numeral vale un número conocido, la descomposición da una ecuación en n; la base es mayor que cada cifra y acota las ocultas.',
    actividad: 'Probar tamaños de bolsita hasta que la etiqueta cuadre con el paquete.',
    // Lee: el paquete cerrado, probar una base y lo que dicen las cifras. No usa una base hallada para leer otra etiqueta
    // (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'Un paquete del vecino', texto: ['Al puesto llega un paquete cerrado de un puesto vecino, con bolsitas y sueltos adentro. La etiqueta dice ', num('23', 'n'), ' y adentro hay ', cant(17), ' caramelos. Nadie anotó de cuántos es cada bolsita: la base, ', bas('n'), ', no se ve.'],
          pieza: PU, dibujo: { datos: bolsaF('23', 17).datos, estado: {} } },
        { titulo: 'Probar una base', texto: ['Si las bolsitas fueran de ', bas(6), ', la etiqueta ', num('23', 'n'), ' serían 2 bolsitas de 6 y 3 sueltos: 15 caramelos, no 17. Con bolsitas de 6 no cuadra.'],
          ecuacion: [num('23', 6), ' = 2 × ', bas(6), ' + 3 = 15'] },
        { titulo: 'Lo que dicen las cifras', texto: ['La base no puede ser cualquiera: en la etiqueta aparece un 3, así que ', bas('n'), ' es mayor que 3. Cada cifra que se ve pone un piso a la base.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a cambiar el tamaño de la bolsita. Mira cuántos caramelos daría la etiqueta con ese tamaño, y cuántos faltan o sobran para 17.'] },
      ],
    },
    ejemplos: EJEMPLOS_BASE,
    juega: {
      pieza: PU,
      consigna: 'La etiqueta del paquete vecino dice 23₍ₙ₎ y trae 17 caramelos. Prueba bolsitas de n desde 4: con 3, no existiría la cifra 3.',
      mision: {
        texto: ['Encuentra el tamaño de bolsita con el que ', num('23', 'n'), ' vale ', cant(17), '.'],
        logrado: val => val.b === 7,
        bien: 'Listo: 2 bolsitas de 7 y 3 sueltos son 17. La base es 7.',
      },
      voz: '¿Faltan caramelos o sobran con esta bolsita?',
      leyenda: [
        { s: num('23', 'n'), t: 'la etiqueta, sin saber la base' },
        { s: bas('n'), t: 'caramelos por bolsita: la base que falta' },
        { s: cant('17'), t: 'caramelos que hay en el paquete' },
      ],
      controles: [{ id: 'b', etiqueta: 'Caramelos por bolsita, n', color: 'c-i', min: 4, max: 9, paso: 1, inicio: 4, decimales: 0 }],
      dibujo: v => ({ datos: Object.assign(pedJ4(v.b), { escala: escala4() }), estado: {} }),
      // La relación: lo que daría la etiqueta con esa base, contra los 17 del paquete.
      lectura: v => {
        const x = 2 * v.b + 3;
        return [num('23', v.b), ' = 2 × ', bas(v.b), ' + 3 = ', cant(x), x === 17 ? ': justo 17' : x < 17 ? `: faltan ${17 - x} para 17` : `: sobran ${x - 17}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['En otro puesto, un paquete con etiqueta ', num('31', 'n'), ' tiene ', cant(25), ' caramelos. Otro paquete del mismo puesto dice ', num('13', 'n'), '. ¿Cuántos caramelos tiene?'],
      datos: ['Los dos paquetes son del mismo puesto: sus bolsitas son del mismo tamaño'],
      voz: 'Piensa qué puedes saber primero con el paquete de 25.',
      opciones: [
        { id: 'c', texto: '11 caramelos', correcta: true },
        { id: 'decimal', texto: '13 caramelos', error: 'AT-DECIMAL', siFuera: 'Bien que leas la etiqueta. Pero 13 de este puesto no es trece: la bolsita no es de 10.' },
        { id: 'base', texto: '8 caramelos', error: 'AT-PIDE-BASE', siFuera: 'Hallar que la bolsita es de 8 está muy bien. Pero piden los caramelos del otro paquete.' },
        { id: 'invierte', texto: '52 caramelos', error: 'AT-INVIERTE', siFuera: 'Bien que 13 sea 31 al revés. Pero el valor no se invierte: 25 al revés no sirve.' },
      ],
      dibujo: fig({ cerrado: true, escala: MIRA4.escala, etiqueta: { cifras: '31', base: 'n' }, regla: [P31, [['Paquete 13: '], ['?', null, 700], [' caramelos']]] }),
      revelar: fig(Object.assign({ escala: MIRA4.escala }, MIRA4.pasos[3])),
      coincide: 'Coincide: 3 × 8 + 1 = 25, así que la bolsita es de 8, y 13₍₈₎ = 8 + 3 = 11.',
      noCoincide: 'Revisemos: con el paquete de 25 sale primero el tamaño de la bolsita.',
    },
    mira: {
      pieza: PU,
      datos: MIRA4,
      voz: 'Primero la base; después, todo lo demás.',
      pasos: [
        { estado: { paso: 0 }, texto: 'La etiqueta 31 son 3 bolsitas de n y 1 suelto.', ecuacion: [num('31', 'n'), ' = 3 × ', bas('n'), ' + 1'] },
        { estado: { paso: 1 }, texto: 'Eso tiene que dar los 25 caramelos del paquete.', ecuacion: ['3 × ', bas('n'), ' + 1 = ', cant(25), SEP, '3 × ', bas('n'), ' = 24', SEP, bas('n'), ' = ', bas(8)] },
        { estado: { paso: 2 }, texto: '¿Sirve? Las cifras 3 y 1 son menores que 8.', ecuacion: [cif(3), ' < ', bas(8), ',  ', cif(1), ' < ', bas(8)] },
        { estado: { paso: 3 }, texto: 'Con bolsitas de 8, el otro paquete ya se puede contar.', ecuacion: [num('13', 8), ' = 1 × ', bas(8), ' + 3 = ', cant(11)] },
        { estado: { paso: 4 }, texto: 'Sin saber cuántos hay, las cifras solo dan un piso.', ecuacion: [num('31', 'n'), ':  ', cif(3), ' < ', bas('n'), ', así que ', bas('n'), ' ≥ ', bas(4)] },
      ],
    },
    regla: {
      texto: 'Si un numeral de base desconocida vale un número conocido, su descomposición da una ecuación en n. Además, la base acota las cifras ocultas: cada una es menor que n.',
      ecuacion: [num('ab', 'n'), ' = ', cif('a'), ' × ', bas('n'), ' + ', cif('b'), ' = ', cant('número conocido'), SEP, '0 < ', cif('a'), ' < ', bas('n'), ',  0 ≤ ', cif('b'), ' < ', bas('n'),
        SEP, num('3a', 4), ' y ', num('a2', 6), ':  ', cif('a'), ' < ', bas(4), ' y ', cif('a'), ' < ', bas(6)],
      condicion: 'Con raya, a y b son cifras; a no es 0. Una letra de dos numerales es menor que sus dos bases.',
      voz: 'La ecuación da la base; las cifras dicen si sirve.',
    },
    // Así se resuelve: una etiqueta de tres cifras, probando bases desde la menor posible (con una base mayor vale más).
    // «Ahora tú» pide otra cosa: dos cifras con ecuación directa, otra etiqueta del mismo puesto, acotar y el mayor
    // numeral con suma de cifras.
    resuelve: {
      pieza: PU,
      generar(s) {
        const q = azar(s + 900);
        for (;;) {
          const n = q.ent(5, 9), c = [q.ent(1, 3), q.ent(0, n - 1), q.ent(0, n - 1)], m = Math.max(...c);
          if (n - m < 2 || n - m > 4) continue;
          const t = c.join(''), N = vale(t, n), prue = [];
          for (let b = m + 1; b <= n; b++) prue.push(b);
          return {
            enunciado: ['Un paquete cerrado dice ', num(t, 'n'), ' y tiene ', cant(N), ' caramelos. ¿De cuántos caramelos es cada bolsita?'],
            datos: [DD.f3('n'), DN.cifras],
            dibujo: bolsaF(t, N),
            pasos: [
              { tipo: 'pide', texto: ['Piden la base ', bas('n'), ': el tamaño de la bolsita.'] },
              { tipo: 'datos', texto: ['La cifra mayor de la etiqueta es ', cif(m), ': la base es por lo menos ', bas(m + 1), '. El paquete tiene ', cant(N), ' caramelos.'] },
              { tipo: 'regla', texto: ['La descomposición da una ecuación en n. Con una base mayor la etiqueta vale más: pruebo desde la menor posible hasta que dé ', cant(N), '.'],
                ecuacion: [num(t, 'n'), ` = ${c[0]} × `, pot('n', '2'), ` + ${c[1]} × `, bas('n'), ` + ${c[2]} = `, cant(N)] },
              { tipo: 'cuentas', texto: 'Pruebo una base tras otra.', ecuacion: prue.flatMap((b, i) => [i ? SEP : '', num(t, b), ' = ', b === n ? cant(vale(t, b)) : String(vale(t, b))]).filter(x => x !== ''),
                dibujo: fig({ n, cajas: c[0], bolsitas: c[1], sueltos: c[2], ceros: true, regla: [[['En el paquete: '], [`${N} caramelos`, 'f', 700]], [['1 bolsita = '], [String(n), 'i', 700], [' caramelos']]], rotulos: true, etiqueta: { cifras: t } }) },
              { tipo: 'sentido', texto: ['Con ', bas(n), ' da justo ', cant(N), ', y todas las cifras son menores que ', bas(n), '. Con una base más, ya pasaría.'] },
            ],
            respuesta: ['Bolsitas de ', bas(n), ' caramelos'],
          };
        }
      },
    },
    ahoraTu: {
      pieza: PU,
      voz: 'La descomposición da la ecuación; las cifras acotan la base.',
      generar(sem) {
        const r = azar(sem + 61), tipo = sem % 4, m = Math.floor(sem / 4);
        if (tipo === 0) return casoBaseLineal(r, m);
        if (tipo === 1) return conCuatro(casoOtraEtiqueta, r);
        if (tipo === 2) return conCuatro(casoAcotarSuma, r);
        return conCuatro(casoMayorSuma, r);
      },
    },
  };

  // ---------- Idea 5 (rehecha, 17 nov): contar cifras por bloques ----------
  // Objeto: el talonario de la rifa pro fondos de la promoción (pieza arit-talonario, dibujo de prueba): la imprenta cobra
  // por cifra impresa. Cambia: el último boleto. · Permanece: los bloques de 1, 2 y 3 cifras. · Progresa: bloque por
  // bloque, cuántos boletos por cuántas cifras. · Se reserva: los extremos de un bloque (del 10 al 99 son 90) y el boleto
  // que abre el bloque siguiente (la predicción: del 1 al 100 se imprimen 192). · Debe verse: no todos los boletos gastan
  // lo mismo; en la barra de cifras, el bloque de tres cifras se estira el triple.
  // Los números de k cifras se cuentan con «del primero, p, al último, u, hay u − p + 1» (dato), no con el principio de
  // multiplicación, que es de análisis combinatorio (punto 9). Las letras son p y u: a es siempre una cifra (M6).
  // El juego solo da hecha la cuenta del bloque de tres cifras, el que se mueve: los de una y dos cifras quedan en las
  // barras sin su cuenta, para que Predice (del 1 al 100) no llegue resuelta (auditoría, M7).
  // Errores (hipótesis de aula; trampa 24, «poste y valla»): AT-BLOQUE da a todos las mismas cifras o se salta un bloque
  // · AT-CONTEO cuenta u − p y no u − p + 1 · AT-ULTIMO se olvida del boleto que abre el bloque siguiente · AT-CERO
  // admite el 0 como primera cifra · AT-DECIMAL cuenta como en base 10 · AT-SIN-DOS se salta el bloque de dos cifras ·
  // AT-UNA-COTA acota la base por un solo lado · AT-EXPONENTE confunde tres cifras con n³ · AT-MENOR da la menor base.
  const TA = 'arit-talonario';
  const TAL = () => Kit.piezas[TA];
  const talF = datos => ({ pieza: TA, datos, estado: {} });
  const MAX_T = 1100;   // escala común del juego: las cifras del 1 al 400 (1092) caben a lo ancho
  const datosJ5 = v => ({ N: v.P, max: MAX_T, lineas: 'cuenta', soloUltimo: true });
  const bloquesT = (a, N) => { const out = []; for (let k = 1; 10 ** (k - 1) <= N; k++) { const lo = Math.max(a, 10 ** (k - 1)), hi = Math.min(N, 10 ** k - 1); if (hi >= lo) out.push({ k, a: lo, z: hi, cuantos: hi - lo + 1, cifras: (hi - lo + 1) * k }); } return out; };
  const cifrasT = (a, N) => bloquesT(a, N).reduce((s, b) => s + b.cifras, 0);
  // Las cuentas de los bloques escritas: «9 × 1 + 90 × 2 + 101 × 3 = 9 + 180 + 303 = 492».
  const cuentaBloques = (a, N) => { const bl = bloquesT(a, N); return [bl.map(b => `${f(b.cuantos, 0)} × ${b.k}`).join(' + '), ' = ', bl.map(b => f(b.cifras, 0)).join(' + '), ' = ', cif(f(cifrasT(a, N), 0))]; };
  const DT = { bloques: 'Del 1 al 9, una cifra; del 10 al 99, dos; del 100 al 999, tres', hasta: DD.hasta };
  const MIRA5 = { N: 100, max: 220, lineas: 'cuenta', total: false, pasos: [{ hasta: 1 }, { hasta: 2 }, { hasta: 3 }, { hasta: 3, total: true }, { hasta: 3, total: true }] };

  // Ahora tú 5 · tipo 0: cuántas cifras se imprimen del boleto 1 al N.
  function casoCifras(r) {
    const N = r.ent(110, 999), t = cifrasT(1, N);
    return {
      pregunta: ['Una rifa tiene boletos del 1 al ', cant(N), '. ¿Cuántas cifras imprime la imprenta?'],
      datos: [DT.hasta, DT.bloques],
      dibujo: talF({ N, total: '?' }),
      opciones: opciones(t, [
        { id: 'tres', valor: 3 * N, error: 'AT-BLOQUE', siFuera: `Tres cifras por boleto vale del 100 al ${N}. Los de antes gastan menos.` },
        { id: 'conteo', valor: t - 3, error: 'AT-CONTEO', siFuera: `Bien que separes los bloques. Pero del 100 al ${N} hay ${N - 99} boletos: cuentan el primero y el último.` },
        { id: 'sin-uno', valor: t - 9, error: 'AT-BLOQUE', siFuera: 'Los bloques de dos y tres cifras están bien. Falta el del 1 al 9.' },
      ], x => f(x, 0)),
      solucion: { texto: 'Bloque por bloque: cuántos boletos por cuántas cifras.', ecuacion: cuentaBloques(1, N) },
    };
  }
  // Ahora tú 5 · tipo 1: al revés: con tantas cifras, ¿hasta qué boleto se llegó?
  function casoHasta(r) {
    const N = r.ent(110, 600), C = cifrasT(1, N);
    return {
      pregunta: ['La imprenta imprimió ', cif(f(C, 0)), ' cifras en los boletos de una rifa, desde el 1. ¿Hasta qué boleto llegó?'],
      datos: [DT.hasta, DT.bloques],
      dibujo: talF({ pide: 'N', impresas: C }),
      opciones: opciones(N, [
        { id: 'conteo', valor: N + 1, error: 'AT-CONTEO', siFuera: `Los ${N - 99} boletos de tres cifras están bien. Pero empiezan en el 100: el último es el ${N}.` },
        { id: 'tres', valor: C / 3, error: 'AT-BLOQUE', siFuera: 'Dividir entre 3 sirve para los de tres cifras. Los de antes gastan menos.' },
        { id: 'sin-dos', valor: 9 + (C - 9) / 3, error: 'AT-SIN-DOS', siFuera: 'Bien que empieces por los de una cifra. Pero del 10 al 99 gastan dos, no tres.' },
      ], x => `el ${f(x, 0)}`),
      solucion: { texto: `Hasta el 99 se gastan 9 × 1 + 90 × 2 = 189 cifras; las otras ${C - 189} son de boletos de tres cifras.`,
        ecuacion: [`${f(C, 0)} − 189 = ${C - 189}`, SEP, `${C - 189} ÷ 3 = ${N - 99} boletos`, SEP, `99 + ${N - 99} = `, cant(N)] },
    };
  }
  // Ahora tú 5 · tipo 2: cuántos numerales de k cifras hay en base n (de 10…0₍ₙ₎ a la cifra mayor repetida).
  function casoCuantosK(r) {
    const n = r.ent(3, 9), k = r.ent(2, n <= 5 ? 4 : 3), a = n ** (k - 1), z = n ** k - 1;
    return {
      pregunta: ['¿Cuántos numerales de ', cif(k), ' cifras hay en base ', bas(n), '?'],
      datos: [DT.hasta, [pot(n, String(k - 1)), ` = ${f(a, 0)};  `, pot(n, String(k)), ` = ${f(z + 1, 0)}`], DN.primera],
      opciones: opciones(z - a + 1, [
        { id: 'cero', valor: z + 1, error: 'AT-CERO', siFuera: `Bien que llegues hasta ${f(z, 0)}. Pero los que empiezan en 0 tienen menos cifras.` },
        { id: 'conteo', valor: z - a, error: 'AT-CONTEO', siFuera: `Los extremos, ${f(a, 0)} y ${f(z, 0)}, están bien. Del primero al último hay u − p + 1.` },
        { id: 'decimal', valor: 9 * 10 ** (k - 1), error: 'AT-DECIMAL', siFuera: `Así se cuenta en base 10. Aquí las cifras van de 0 a ${n - 1}.` },
      ], x => f(x, 0)),
      solucion: { texto: `El menor es 1 seguido de ceros; el mayor repite la cifra ${n - 1}.`,
        ecuacion: [num('1' + '0'.repeat(k - 1), n), ` = ${f(a, 0)}`, SEP, num(String(n - 1).repeat(k), n), ` = ${f(z, 0)}`, SEP, `${f(z, 0)} − ${f(a, 0)} + 1 = `, cant(f(z - a + 1, 0))] },
    };
  }
  // Ahora tú 5 · tipo 3 (nivel examen, San Marcos 2026-II): en cuántas bases N se escribe con tres cifras.
  function casoBasesTres(r) {
    const N = r.ent(20, 400);
    const cuenta = ok => { let c = 0; for (let n = 2; n <= N; n++) if (ok(n)) c++; return c; };
    const C = cuenta(n => n * n <= N && N < n ** 3), bases = [];
    for (let n = 2; n * n <= N; n++) if (N < n ** 3) bases.push(n);
    const exp = cuenta(n => n ** 3 <= N && N < n ** 4);
    return {
      pregunta: ['¿En cuántas bases se escribe ', cant(N), ' con tres cifras?'],
      datos: [['Con ', cif(3), ' cifras en base ', bas('n'), ': de ', pot('n', '2'), ' a ', pot('n', '3'), ' − 1'], 'La base es un número entero de 2 o más'],
      opciones: opciones(C, [
        { id: 'una', valor: cuenta(n => n * n <= N), error: 'AT-UNA-COTA', siFuera: `Bien que n² no pase de ${N}. Pero ${N} también tiene que ser menor que n³.` },
        { id: 'exponente', valor: exp || null, error: 'AT-EXPONENTE', siFuera: 'Bien que uses potencias. Pero tres cifras van de n² a n³ − 1, no desde n³.' },
        { id: 'menor', valor: bases[0], error: 'AT-MENOR', siFuera: `${bases[0]} es la menor base que sirve, bien. Pero piden cuántas bases sirven.` },
      ], x => (x === 1 ? '1 base' : `${x} bases`)),
      solucion: { texto: `Sirven las bases con n² ≤ ${N} y ${N} < n³: de la ${bases[0]} a la ${bases[bases.length - 1]}.`,
        ecuacion: [pot(bases[0], '3'), ` = ${bases[0] ** 3} > ${N}`, SEP, pot(bases[bases.length - 1], '2'), ` = ${bases[bases.length - 1] ** 2} ≤ ${N}`, SEP, cif(C), C === 1 ? ' base' : ' bases'] },
    };
  }

  // Ejemplos resueltos de la idea 5. Cuentas rehechas aparte (cuentas-f3.js): del 1 al 250, 151 de tres cifras; del 35 al
  // 80, 46; del 100 al 150, 153 cifras; de tres cifras, 900; 100₍₅₎ = 25; del 1 al 50, 91; del 1 al 300, 792; 234
  // cifras → boleto 114; del 45 al 120, 173; dos cifras en base 5, 20; 100 con tres cifras en 6 bases (5 a 10); del 1
  // al 1200, 3693; 1500 cifras → boleto 536; en base 3 del 1 al 26, 68; tres cifras en base 7, 294. Las figuras dejan
  // el total con «?»: nunca muestran lo que se pide. Fase 8: «Boletos de dos cifras» (del 10 al 99 son 90, no 89) y
  // «Del 1 al 1000» (el boleto que abre un bloque nuevo) explicaban dos trampas de Predice: cambiaron (auditoría, M2).
  const EJEMPLOS_CONTEO = [
    { nivel: 1, titulo: 'Boletos de tres cifras',
      enunciado: ['Una rifa tiene boletos del 1 al ', cant(250), '. ¿Cuántos boletos tienen tres cifras?'],
      datos: [DT.hasta],
      figura: talF({ N: 250, cifras: false }),
      solucion: [
        { texto: 'Los de tres cifras van del 100 al 250: se cuentan el primero y el último.', ecuacion: ['250 − 100 + 1 = ', cant(151)] },
        { texto: 'No son 150: el 100 y el 250 también cuentan.' },
      ],
      respuesta: [cant(151), ' boletos'] },
    { nivel: 1, titulo: 'De un boleto a otro',
      enunciado: ['Una promoción vendió los boletos del ', cant(35), ' al ', cant(80), '. ¿Cuántos boletos vendió?'],
      datos: [DT.hasta],
      figura: talF({ desde: 35, N: 80, cifras: false }),
      solucion: [
        { texto: 'Del 35 al 80 hay 80 − 35 + 1: el + 1 cuenta el primero.', ecuacion: ['80 − 35 + 1 = ', cant(46)] },
      ],
      respuesta: [cant(46), ' boletos'] },
    { nivel: 1, titulo: 'Un bloque de tres cifras',
      enunciado: ['¿Cuántas cifras se imprimen en los boletos del ', cant(100), ' al ', cant(150), '?'],
      datos: [DT.hasta],
      figura: talF({ desde: 100, N: 150, total: '?' }),
      solucion: [
        { texto: 'Todos tienen tres cifras. Primero, cuántos boletos son.', ecuacion: ['150 − 100 + 1 = 51 boletos'] },
        { texto: 'Cada uno gasta 3 cifras.', ecuacion: ['51 × 3 = ', cif(153)] },
      ],
      respuesta: [cif(153), ' cifras'] },
    { nivel: 1, titulo: 'Los números de tres cifras',
      enunciado: '¿Cuántos números de tres cifras hay en base 10?',
      datos: [DT.hasta, DN.primera],
      solucion: [
        { texto: 'El menor es 100 y el mayor, 999: la primera cifra no es 0.', ecuacion: ['999 − 100 + 1 = ', cant(900)] },
      ],
      respuesta: [cant(900), ' números'] },
    { nivel: 1, titulo: 'El primero de tres cifras',
      enunciado: ['¿Cuál es el menor numeral de tres cifras en base ', bas(5), ', y cuánto vale en base 10?'],
      datos: [DN.primera, DD.f3('n')],
      solucion: [
        { texto: ['El menor empieza en 1 y sigue con ceros: ', num('100', 5), ', una caja justa.'] },
        { texto: 'Se pasa a base 10.', ecuacion: [num('100', 5), ' = 1 × 25 + 0 + 0 = ', cant(25)] },
      ],
      respuesta: [num('100', 5), ' = ', cant(25)] },
    { nivel: 2, titulo: 'Del 1 al 50',
      enunciado: ['¿Cuántas cifras se imprimen en los boletos del 1 al ', cant(50), '?'],
      datos: [DT.hasta, DT.bloques],
      figura: talF({ N: 50, total: '?' }),
      solucion: [
        { texto: 'Hay dos bloques: del 1 al 9, de una cifra, y del 10 al 50, de dos.', ecuacion: ['50 − 10 + 1 = 41 boletos de dos cifras'] },
        { texto: 'Cada bloque: cuántos boletos por cuántas cifras.', ecuacion: cuentaBloques(1, 50) },
      ],
      respuesta: [cif(91), ' cifras'] },
    { nivel: 2, titulo: 'Una rifa de 300',
      enunciado: ['¿Cuántas cifras imprime la imprenta en una rifa del 1 al ', cant(300), '?'],
      datos: [DT.hasta, DT.bloques],
      figura: talF({ N: 300, total: '?' }),
      solucion: [
        { texto: 'Tres bloques. El de tres cifras va del 100 al 300.', ecuacion: ['300 − 100 + 1 = 201 boletos'] },
        { texto: 'Bloque por bloque.', ecuacion: cuentaBloques(1, 300) },
        { texto: 'Si todos tuvieran tres cifras serían 900; da menos porque los primeros 99 gastan menos.' },
      ],
      respuesta: [cif(792), ' cifras'] },
    { nivel: 2, titulo: '¿Hasta qué boleto?',
      enunciado: ['La imprenta imprimió ', cif(234), ' cifras en los boletos de una rifa, desde el 1. ¿Hasta qué boleto llegó?'],
      datos: [DT.hasta, DT.bloques],
      figura: talF({ pide: 'N', impresas: 234 }),
      solucion: [
        { texto: 'Hasta el 99 se gastan 9 × 1 + 90 × 2 = 189 cifras: 9 boletos de una cifra y 90 de dos. Las que sobran son de boletos de tres cifras.', ecuacion: ['234 − 189 = 45', SEP, '45 ÷ 3 = 15 boletos'] },
        { texto: 'Esos 15 boletos empiezan en el 100, justo después del 99: el último es 99 + 15.', ecuacion: ['99 + 15 = ', cant(114)] },
        { texto: 'Van del 100 al 114: 114 − 100 + 1 = 15. Cuadra.' },
      ],
      respuesta: ['Hasta el boleto ', cant(114)] },
    { nivel: 2, titulo: 'Desde el boleto 45',
      enunciado: ['Una promoción imprime los boletos del ', cant(45), ' al ', cant(120), '. ¿Cuántas cifras gasta?'],
      datos: [DT.hasta, DT.bloques],
      figura: talF({ desde: 45, N: 120, total: '?' }),
      solucion: [
        { texto: 'Dos bloques: del 45 al 99, de dos cifras, y del 100 al 120, de tres.', ecuacion: ['99 − 45 + 1 = 55', SEP, '120 − 100 + 1 = 21'] },
        { texto: 'Cada bloque por sus cifras.', ecuacion: cuentaBloques(45, 120) },
      ],
      respuesta: [cif(173), ' cifras'] },
    { nivel: 2, titulo: 'Dos cifras en base 5',
      enunciado: ['¿Cuántos numerales de dos cifras hay en base ', bas(5), '?'],
      datos: [DT.hasta, DD.f2('n'), DN.primera],
      solucion: [
        { texto: ['El menor es ', num('10', 5), ' = 5 y el mayor, ', num('44', 5), ' = 4 × 5 + 4 = 24.'] },
        { texto: 'Se cuentan de 5 a 24.', ecuacion: ['24 − 5 + 1 = ', cant(20)] },
      ],
      respuesta: [cant(20), ' numerales'] },
    { nivel: 3, titulo: 'Tres cifras en varias bases',
      enunciado: ['¿En cuántas bases se escribe ', cant(100), ' con tres cifras?'],
      alternativas: ['4', '5', '6', '9'],
      datos: [['Con ', cif(3), ' cifras en base ', bas('n'), ': de ', pot('n', '2'), ' a ', pot('n', '3'), ' − 1'], 'La base es un número entero de 2 o más'],
      solucion: [
        { texto: 'Hacen falta las dos cotas: n² ≤ 100 y 100 < n³.' },
        { texto: 'n² ≤ 100 da n ≤ 10. 100 < n³ da n ≥ 5, porque 4³ = 64 y 5³ = 125.', ecuacion: ['bases ', bas('5, 6, 7, 8, 9 y 10')] },
        { texto: [letra('D', 'cantidad'), ' usa solo n² ≤ 100: cuenta de la 2 a la 10, y en base 4, 100 ya tiene cuatro cifras.'] },
      ],
      respuesta: [letra('C', 'cantidad'), ': seis bases'] },
    { nivel: 3, titulo: 'Del 1 al 1200',
      enunciado: ['¿Cuántas cifras se imprimen en los boletos del 1 al ', cant(f(1200, 0)), '?'],
      datos: [DT.hasta, 'Del 1 al 9, una cifra; del 10 al 99, dos; del 100 al 999, tres; del 1000 al 9999, cuatro'],
      figura: talF({ N: 1200, total: '?' }),
      solucion: [
        { texto: 'Son cuatro bloques. Los de tres cifras van del 100 al 999; los de cuatro, del 1000 al 1200.', ecuacion: ['999 − 100 + 1 = 900', SEP, '1200 − 1000 + 1 = 201'] },
        { texto: 'Bloque por bloque.', ecuacion: cuentaBloques(1, 1200) },
        { texto: 'Si todos tuvieran cuatro cifras serían 4800; da menos porque los primeros 999 gastan menos.' },
      ],
      respuesta: [cif(f(3693, 0)), ' cifras'] },
    { nivel: 3, titulo: 'Con 1500 cifras',
      enunciado: ['Para una rifa, la imprenta usó ', cif(f(1500, 0)), ' cifras, desde el boleto 1. ¿Cuál fue el último boleto?'],
      alternativas: ['500', '536', '537', '437'],
      datos: [DT.hasta, DT.bloques],
      figura: talF({ pide: 'N', impresas: 1500 }),
      solucion: [
        { texto: 'Hasta el 99 se gastan 9 × 1 + 90 × 2 = 189 cifras; las demás son de boletos de tres cifras.', ecuacion: ['1500 − 189 = 1311', SEP, '1311 ÷ 3 = 437 boletos'] },
        { texto: 'Esos 437 empiezan en el 100.', ecuacion: ['99 + 437 = ', cant(536)] },
        { texto: [letra('D', 'cantidad'), ' olvida sumar los 99 primeros; ', letra('C', 'cantidad'), ' empieza a contar en el 101; ', letra('A', 'cantidad'), ' divide todo entre 3.'] },
      ],
      respuesta: [letra('B', 'cantidad'), ': el boleto ', cant(536)] },
    { nivel: 3, titulo: 'Cifras en base 3',
      enunciado: ['Si se escriben en base ', bas(3), ' todos los números del 1 al ', cant(26), ', ¿cuántas cifras se usan?'],
      datos: [DT.hasta, DD.f2('n'), DD.f3('n'), DN.primera],
      solucion: [
        { texto: ['En base 3: una cifra, del 1 al 2; dos cifras, de ', num('10', 3), ' = 3 a ', num('22', 3), ' = 8; tres, de ', num('100', 3), ' = 9 a ', num('222', 3), ' = 26.'] },
        { texto: 'Cuántos hay en cada bloque.', ecuacion: ['2 − 1 + 1 = 2', SEP, '8 − 3 + 1 = 6', SEP, '26 − 9 + 1 = 18'] },
        { texto: 'Cada bloque por sus cifras.', ecuacion: ['2 × 1 + 6 × 2 + 18 × 3 = 2 + 12 + 54 = ', cif(68)] },
      ],
      respuesta: [cif(68), ' cifras'] },
    { nivel: 3, titulo: 'Tres cifras en base 7',
      enunciado: ['¿Cuántos numerales de tres cifras hay en base ', bas(7), '?'],
      alternativas: ['343', '294', '293', '900'],
      datos: [DT.hasta, DD.f3('n'), DN.primera],
      solucion: [
        { texto: ['El menor es ', num('100', 7), ' = 49; el mayor, ', num('666', 7), ' = 6 × 49 + 6 × 7 + 6 = 342.'] },
        { texto: 'Se cuentan de 49 a 342.', ecuacion: ['342 − 49 + 1 = ', cant(294)] },
        { texto: [letra('A', 'cantidad'), ' cuenta los que empiezan en 0; ', letra('C', 'cantidad'), ' olvida el + 1; ', letra('D', 'cantidad'), ' cuenta en base 10.'] },
      ],
      respuesta: [letra('B', 'cantidad'), ': ', cant(294), ' numerales'] },
  ];

  const conteo = {
    id: 'conteo-cifras',
    titulo: 'Contar cifras por bloques',
    pregunta: '¿Cuántas cifras gasta numerar del 1 al N?',
    temas: ['Conteo de números y cifras'],
    pieza: TA,
    aprendizaje: 'Los números de k cifras van de 1 seguido de ceros a la cifra mayor repetida; se cuentan las cifras bloque por bloque.',
    actividad: 'Correr el último boleto de una rifa y ver cuántas cifras gasta la imprenta.',
    // Lee: la rifa, de a hasta z y los bloques. No suma los bloques del 1 al 100 (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'La rifa de la promoción', texto: ['La promoción hace una rifa pro fondos, con boletos del 1 al ', cant(150), '. La imprenta cobra por cifra impresa: el boleto 7 gasta una y el 45, dos. Abajo, la barra de boletos: un tramo por cada cantidad de cifras (una, dos y tres).'],
          pieza: TA, dibujo: { datos: { N: 150, cifras: false }, estado: {} } },
        { titulo: 'Del primero al último', texto: ['Del boleto 20 al 30, ¿cuántos hay? No son 10 sino 11: se cuentan el primero, el 20, y el último, el 30. Del primero, p, al último, u, hay u − p + 1.'],
          ecuacion: ['30 − 20 + 1 = 11 boletos'] },
        { titulo: 'Bloques', texto: ['Los boletos con la misma cantidad de cifras forman un bloque: del 1 al 9, del 10 al 99, del 100 al 999. Cada bloque gasta distinto por boleto.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a correr el último boleto. Mira las dos barras, la de boletos y la de cifras impresas: ¿cuánto se estira cada bloque abajo?'] },
      ],
    },
    ejemplos: EJEMPLOS_CONTEO,
    juega: {
      pieza: TA,
      consigna: 'La promoción hace una rifa con boletos numerados desde el 1. La imprenta cobra por cada cifra que imprime.',
      mision: {
        texto: ['La imprenta cobró ', cif(492), ' cifras. ¿Hasta qué boleto alcanza? Corre el último boleto.'],
        logrado: val => cifrasT(1, val.P) === 492,
        bien: 'Hasta el boleto 200: los de tres cifras se llevan 303 de las 492.',
      },
      voz: 'Mira cuánto se estira cada tramo en la barra de cifras.',
      leyenda: [
        { s: cant('N'), t: 'el último boleto de la rifa' },
        { s: 'boletos', t: 'cada tramo: los boletos de un bloque' },
        { s: 'cifras impresas', t: 'cada tramo: las cifras que gasta ese bloque' },
        { s: ['100 a ', cant('N')], t: 'el bloque de tres cifras' },
      ],
      controles: [{ id: 'P', etiqueta: 'Último boleto, N', color: 'c-f', min: 120, max: 400, paso: 10, inicio: 150, decimales: 0 }],
      dibujo: v => ({ datos: datosJ5(v), estado: {} }),
      // La relación: el total de la rifa y lo que pone el bloque de tres cifras (los de antes no se dan hechos: Predice).
      lectura: v => { const u = bloquesT(1, v.P).pop(); return [cant(v.P), ' boletos: ', cif(f(cifrasT(1, v.P), 0)), ' cifras; del 100 al ', f(v.P, 0), ', ', `${u.cuantos} × 3 = `, cif(f(u.cifras, 0))]; },
      minimo: 3,
      arrastres: [{ id: 'fin', etiqueta: 'final de la barra de boletos (el último boleto)', color: 'c-f',
        donde: v => TAL().finBarra(datosJ5(v)),
        mover: (pt, v) => ({ P: TAL().deX(datosJ5(v), pt.x) }) }],
    },
    predice: {
      pregunta: 'La rifa del año pasado tuvo boletos del 1 al 100. ¿Cuántas cifras imprimió la imprenta?',
      datos: ['Boletos: del 1 al 100', 'Cada boleto lleva su número impreso una vez'],
      voz: 'Piensa en cada bloque, también en el último boleto.',
      opciones: [
        { id: 'c', texto: '192 cifras', correcta: true },
        { id: 'bloque', texto: '200 cifras', error: 'AT-BLOQUE', siFuera: 'Dos cifras por boleto vale del 10 al 99. Del 1 al 9 gastan una sola.' },
        { id: 'conteo', texto: '190 cifras', error: 'AT-CONTEO', siFuera: 'Bien que separes los de dos cifras. Pero del 10 al 99 son 90 boletos, no 89.' },
        { id: 'ultimo', texto: '189 cifras', error: 'AT-ULTIMO', siFuera: 'Hasta el 99 está muy bien: 189. Falta el boleto 100, con tres cifras.' },
      ],
      dibujo: talF({ N: 100, max: 220, cifras: false }),
      revelar: talF({ N: 100, max: 220, lineas: 'cuenta' }),
      coincide: 'Coincide: 9 de una cifra, 90 de dos y el 100 con tres: 9 + 180 + 3 = 192.',
      noCoincide: 'Revisemos bloque por bloque, sin olvidar el boleto 100.',
    },
    mira: {
      pieza: TA,
      datos: MIRA5,
      voz: 'Bloque por bloque: cuántos boletos por cuántas cifras.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Del 1 al 9: nueve boletos de una cifra.', ecuacion: ['9 × 1 = ', cif(9)] },
        { estado: { paso: 1 }, texto: 'Del 10 al 99: 99 − 10 + 1 = 90 boletos de dos cifras.', ecuacion: ['90 × 2 = ', cif(180)] },
        { estado: { paso: 2 }, texto: 'El boleto 100 abre el bloque de tres cifras.', ecuacion: ['1 × 3 = ', cif(3)] },
        { estado: { paso: 3 }, texto: 'Se suman los bloques.', ecuacion: ['9 + 180 + 3 = ', cif(192)] },
        { estado: { paso: 4 }, texto: 'En base n es igual: cambian los extremos de cada bloque.', ecuacion: ['de ', num('100', 'n'), ' = ', pot('n', '2'), ' a ', pot('n', '3'), ' − 1: tres cifras'] },
      ],
    },
    regla: {
      texto: 'Los números de k cifras van desde 1 seguido de k − 1 ceros hasta la cifra mayor repetida k veces. Cada bloque aporta cuántos números por sus cifras.',
      ecuacion: ['de p hasta u hay u − p + 1 números', SEP, 'cifras del bloque = (u − p + 1) × ', cif('k'), SEP, 'en base ', bas('n'), ', de ', pot('n', [cif('k'), ' − 1']), ' a ', pot('n', cif('k')), ' − 1',
        SEP, 'en base ', bas(5), ', tres cifras: de ', num('100', 5), ' = 25 a ', num('444', 5), ' = 124'],
      condicion: 'p: el primero; u: el último; k: cifras de cada uno. En los boletos, n = 10. El último bloque puede quedar incompleto.',
      voz: 'Separa los bloques y cuenta cada uno con el primero y el último.',
    },
    // Así se resuelve: boletos que no empiezan en el 1 (del a, de dos cifras, al z, de tres). «Ahora tú» pide otra cosa:
    // del 1 al N, al revés, cuántos de k cifras en base n y en cuántas bases N tiene tres cifras.
    resuelve: {
      pieza: TA,
      generar(s) {
        const q = azar(s + 900), a = q.ent(12, 90), z = q.ent(110, 450), bl = bloquesT(a, z), t = cifrasT(a, z);
        return {
          enunciado: ['Una promoción imprime los boletos del ', cant(a), ' al ', cant(z), '. ¿Cuántas cifras gasta la imprenta?'],
          datos: [DT.hasta, DT.bloques],
          dibujo: talF({ desde: a, N: z, total: '?' }),
          pasos: [
            { tipo: 'pide', texto: `Piden cuántas cifras se imprimen del boleto ${a} al ${z}, no desde el 1.` },
            { tipo: 'datos', texto: `El ${a} tiene dos cifras y el ${z}, tres. Hay dos bloques: del ${a} al 99 y del 100 al ${z}.` },
            { tipo: 'regla', texto: 'En cada bloque cuento los boletos, con el primero y el último (u − p + 1), y los multiplico por sus cifras.' },
            { tipo: 'cuentas', texto: bl.map(b => `del ${b.a} al ${b.z} hay ${b.cuantos}`).join('; ').replace(/^d/, 'D') + '.', ecuacion: cuentaBloques(a, z),
              dibujo: talF({ desde: a, N: z, lineas: 'cuenta' }) },
            { tipo: 'sentido', texto: `Son ${z - a + 1} boletos; con 2 cifras cada uno serían ${2 * (z - a + 1)} y con 3, ${3 * (z - a + 1)}. ${t} está entre los dos. Cuadra.` },
          ],
          respuesta: ['Gasta ', cif(f(t, 0)), ' cifras'],
        };
      },
    },
    ahoraTu: {
      pieza: TA,
      voz: 'Separa los bloques y cuenta cada uno con el primero y el último.',
      generar(sem) {
        const r = azar(sem + 71), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoCifras, r);
        if (tipo === 1) return conCuatro(casoHasta, r);
        if (tipo === 2) return conCuatro(casoCuantosK, r);
        return conCuatro(casoBasesTres, r);
      },
    },
  };

  // Laboratorio «Libros largos»: las páginas de 1 a P en bloques y las cifras que gastan, en dos tiras a la misma escala
  // (pieza arit-tiras). Colores de la unidad: las cifras en naranja; las páginas, en tinta.
  function bloques(P, base = 10) {
    const out = [];
    for (let k = 1; base ** (k - 1) <= P; k++) {
      const a = base ** (k - 1), z = Math.min(P, base ** k - 1), cuantos = z - a + 1;
      out.push({ k, a, z, cuantos, cifras: cuantos * k });
    }
    return out;
  }
  const totalCifras = P => bloques(P).reduce((a, x) => a + x.cifras, 0);
  const RELLENO = [0.08, 0.22, 0.4, 0.6];
  function tirasPaginas(P, max) {
    const bl = bloques(P), cabe = (valor, txt) => 300 * valor / max >= 9 * txt.length + 14;
    const t1 = bl.map(x => ({ valor: x.cuantos, relleno: RELLENO[x.k - 1] }));
    const t2 = bl.map(x => ({ valor: x.cifras, color: 'o', relleno: RELLENO[x.k - 1], texto: cabe(x.cifras, `${x.cuantos}·${x.k}`) ? `${x.cuantos} × ${x.k}` : '' }));
    return { max, filas: 2, alt: `Páginas de 1 a ${P} en bloques de 1, 2 y más cifras; abajo, las cifras que gasta cada bloque: ${totalCifras(P)}`, tiras: [
      { rotulo: 'páginas', fin: String(P), tramos: t1 },
      { rotulo: 'cifras', color: 'o', fin: String(totalCifras(P)), tramos: t2 },
    ] };
  }
  const finLibro = (P, max) => ({ id: 'fin', etiqueta: 'final de la tira de páginas',
    donde: v => { const g = TIRAS().geometria(tirasPaginas(v[P], max)); return { x: g.x(v[P]), y: g.tiraY(0) }; },
    mover: (pt, v) => ({ [P]: TIRAS().geometria(tirasPaginas(v[P], max)).deX(pt.x) }) });

  // Fichas del laboratorio: tamaño fijo de 16 (con 40 fichas en base 4 son 10 filas), para que el borde de la fila
  // quede en centro + b · 16 / 2 en todos los casos.
  const fichasLab = (n, base) => {
    const q = Math.floor(n / base), s = n % base;
    // Colores de la unidad (idea 1 rehecha): las filas llenas, grupos de n, en turquesa; las sueltas en tinta (antes, carmín).
    return { bloques: [{ n, columnas: base, color: 'i', marcoFilas: true, rotulo: `${n} = ${numT(enBase(n, base), base)}`, tramos: s ? [{ de: n - s, a: n - 1, color: 't' }] : [] }], altoMax: 160, ficha: 16, alt: `${n} fichas en filas de ${base}: ${q} grupos completos y ${s} sueltas` };
  };

  // Mesa 3D (ronda 4, docs/3d.md, 3D de contexto): los bloques de base n. Una barra son n cubitos, una placa son n
  // barras y un cubo son n placas: el tercer lugar ya no cabe en el plano.
  // Cambia: la base y cuántas piezas hay de cada clase · Permanece: cada pieza armada con n piezas de la anterior ·
  // Progresa: el valor en base 10 · Colores de la unidad (17 nov): las piezas en turquesa (cada una es n de la anterior);
  // una clase con n piezas o más (se puede canjear) pasa a tinta, sin naranja ni carmín; cuántas hay es una cifra ·
  // Debe verse: un numeral es lo que queda cuando ya no se puede canjear nada. Cuánto vale y si es numeral: MN.estado.
  const PIEZAS = [['u', 'unidades', 'unidad'], ['d', 'barras', 'barra'], ['c', 'placas', 'placa'], ['m', 'cubos', 'cubo']];
  const bloquesDe = v => MN.estado([v.u, v.d, v.c, v.m], v.b);
  function datosBloques(v) {
    const b = v.b, e = bloquesDe(v), bloques = [], grupos = [], rot = [];
    let x0 = 0;
    // De la clase más grande a la más chica, de izquierda a derecha; cada una en una pila.
    [3, 2, 1, 0].forEach(k => {
      const n = v[PIEZAS[k][0]];
      if (!n) return;
      const g = grupos.length, lleno = n >= b;
      grupos.push({ nombre: PIEZAS[k][1], color: lleno ? undefined : 'c-i', rotulo: String(n), rotuloEn: [x0 + (k ? b : 1) / 2, -1.2, 0],
        dice: `${n} ${n === 1 ? PIEZAS[k][2] : PIEZAS[k][1]} de ${b ** k} cada ${k === 2 || k === 0 ? 'una' : 'uno'}` + (lleno ? `: con ${b} se canjea` : '') });
      for (let j = 0; j < n; j++) {
        if (k === 3) for (let t = 0; t < b; t++) bloques.push({ x: x0 + j * (b + 0.6), y: 0, z: t, w: b, h: b, d: 1, g });
        else if (k === 2) for (let t = 0; t < b; t++) bloques.push({ x: x0, y: t, z: j, w: b, h: 1, d: 1, g });
        else if (k === 1) for (let t = 0; t < b; t++) bloques.push({ x: x0 + t, y: 0, z: j, g });
        else bloques.push({ x: x0 + (j % 4) * 1.2, y: Math.floor(j / 4) * 1.2, z: 0, g });
      }
      x0 += (k === 3 ? n * (b + 0.6) : k === 0 ? 4.8 : b) + 1.2;
    });
    if (!bloques.length) { bloques.push({ x: 0, y: 0, z: 0, w: 0.2, h: 0.2, d: 0.2, g: 0 }); grupos.push({ nombre: 'nada', dice: 'No hay piezas' }); }
    return { bloques, grupos, hueco: 0.12,
      alt: `Bloques de base ${b}: ${PIEZAS.map(([id, pl]) => `${v[id]} ${pl}`).reverse().join(', ')}; valen ${e.fichas}` + (e.normal ? `, el numeral ${numT(e.texto, b)}.` : '; todavía se puede canjear.') };
  }
  const mesaBloques = {
    id: 'bloques-base', titulo: 'Bloques de base n', pieza: 'ari-cubitos-3d',
    consigna: 'Una barra son n cubitos; una placa, n barras; un cubo, n placas. Gira las piezas y canjea las que lleguen a n.',
    // 9 · 3 · 9 · 9 · 9 = 19 683 casos: «Muéstrame» recorre toda la grilla (con más de 20 000 solo mira una muestra).
    controles: [
      { id: 'b', etiqueta: 'Base, n', color: 'c-i', min: 2, max: 10, paso: 1, inicio: 4, decimales: 0 },
      { id: 'm', etiqueta: 'cubos', color: 'c-o', min: 0, max: 2, paso: 1, inicio: 0, decimales: 0 },
      { id: 'c', etiqueta: 'placas', color: 'c-o', min: 0, max: 8, paso: 1, inicio: 1, decimales: 0 },
      { id: 'd', etiqueta: 'barras', color: 'c-o', min: 0, max: 8, paso: 1, inicio: 2, decimales: 0 },
      { id: 'u', etiqueta: 'unidades', color: 'c-o', min: 0, max: 8, paso: 1, inicio: 5, decimales: 0 },
    ],
    dibujo: v => ({ datos: datosBloques(v), estado: {} }),
    lectura: v => { const e = bloquesDe(v); return e.normal ? [num(e.texto, v.b), ' = ', cant(e.fichas)] : ['Valen ', cant(e.fichas), ': aún se puede canjear']; },
    invitaciones: [
      { texto: 'En base 4, arma 23 sin que ninguna clase llegue a 4 piezas.',
        logrado: v => v.b === 4 && bloquesDe(v).normal && bloquesDe(v).fichas === 23,
        testigo: [{ b: 4, m: 0, c: 1, d: 1, u: 3 }],
        bien: '23 = 113₍₄₎: una placa, una barra y tres unidades.',
        pista: 'Junta 4 unidades en una barra y 4 barras en una placa.' },
      { texto: 'Arma el mayor número de tres cifras en base 5.',
        logrado: v => v.b === 5 && v.m === 0 && bloquesDe(v).texto === '444',
        bien: '444₍₅₎ = 124: con una unidad más se completa el cubo, 5³ = 125.',
        pista: 'En base 5 ninguna cifra llega a 5: pon 4 de cada pieza.' },
      { texto: 'En base 2, arma 13 con un cubo.',
        logrado: v => v.b === 2 && v.m === 1 && bloquesDe(v).normal && bloquesDe(v).fichas === 13,
        testigo: [{ b: 2, m: 1, c: 1, d: 0, u: 1 }],
        bien: '13 = 8 + 4 + 1 = 1101₍₂₎: cada pieza va una vez o no va.',
        pista: 'El cubo vale 8. ¿Qué piezas de 4, 2 y 1 faltan para 13?' },
      { texto: 'En base 10, arma un numeral de tres cifras que copie la cantidad.',
        logrado: v => v.b === 10 && bloquesDe(v).normal && bloquesDe(v).fichas >= 100 && bloquesDe(v).texto === String(bloquesDe(v).fichas),
        bien: 'Solo en base 10 las cifras copian la cantidad: 100₍₄₎ es apenas 16.',
        pista: 'Sube n a 10 y pon al menos una placa.' },
      { texto: 'Guarda la misma cantidad dos veces: como numeral y sin canjear.',
        logrado: (v, g) => g.some(x => g.some(y => x.b === y.b && bloquesDe(x).fichas === bloquesDe(y).fichas && bloquesDe(x).normal && !bloquesDe(y).normal)),
        testigo: [{ b: 4, m: 0, c: 1, d: 3, u: 1 }, { b: 4, m: 0, c: 1, d: 2, u: 5 }],
        bien: 'Canjear no cambia cuánto hay: cambia cuántas piezas lo dicen.',
        pista: 'Guarda un numeral; luego abre una barra en n unidades y guarda otra vez.' },
    ],
  };

  return {
    unidad: 'aritmetica.numeracion',
    version: '0.4.0',
    // Las cinco ideas rehechas contra el contrato (17 nov): la unidad declara calidad 2 y el validador común lo exige.
    calidad: 2,
    // Un color fijo por magnitud (cabecera); lo comprueba numeracion.test.js.
    colores: COLORES,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-puesto.js', '/nucleo/kit/piezas/arit-talonario.js', '/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-tiras.js', '/plantillas/numeracion/motor.js', '/nucleo/kit/piezas/ari-cubitos-3d.js'],
    // «muestra» es aquí el verbo («la tabla muestra»), no el término de Estadística del curso (lector en frío).
    glosarioSin: ['muestra'],
    // Glosario: las palabras que esta unidad estrena en el curso (docs/teoria.md §4d).
    glosario: [
      { termino: 'sistema de numeración', def: 'Conjunto de símbolos y reglas para escribir y leer cualquier número.',
        formas: ['sistema de numeración', 'sistemas de numeración'], ver: ['base de numeración', 'cifra'],
        ejemplos: ['El que usamos junta de 10 en 10: es el de base 10.', 'En base 5 se escribe con las cifras 0, 1, 2, 3 y 4.', 'El de los números romanos no es posicional: X vale 10 en cualquier lugar.'] },
      // Los cuatro que estrena la idea 1 (rehecha, 17 nov), con su aproximación (simple) y tres ejemplos.
      { termino: 'base de numeración', simbolo: 'n', def: 'Cuántas unidades de un orden se juntan para formar una del orden siguiente.',
        simple: 'De cuántos es cada paquete: 5 caramelos por bolsita, 10 monedas por billete.',
        formas: ['base de numeración', 'bases de numeración'], ver: ['cifra', 'numeral'],
        ejemplos: ['En base 5, cinco sueltos llenan una bolsita: se anota 10₍₅₎.', 'Contamos en base 10: diez monedas de S/ 1 son un billete de S/ 10.', 'En base 2 solo hay dos cifras: el 0 y el 1.'] },
      { termino: 'cifra', def: 'Cada símbolo con que se escribe un número. En base n va de 0 a n − 1.',
        simple: 'Cada marca suelta de un número escrito: el 2 y el 3 de 23.',
        ver: ['numeral'], ejemplos: ['En 23₍₅₎ hay dos: el 2 y el 3.', 'En base 4 solo existen cuatro: 0, 1, 2 y 3.', 'En base 10 hay diez: del 0 al 9.'] },
      { termino: 'numeral', def: 'La escritura de un número con cifras y su base. Un mismo número se escribe distinto en cada base.',
        simple: 'Lo que se escribe en la etiqueta: sus cifras y, abajo, la base.',
        ver: ['cifra', 'base de numeración'],
        ejemplos: ['13 caramelos en bolsitas de 5 se anotan 23₍₅₎.', 'Veintidós se escribe 22 en base 10 y 42₍₅₎ en base 5.', '23₍₅₎ se lee «dos, tres en base cinco», no «veintitrés».'] },
      // «orden» es local: en otras unidades del curso la palabra dice otra cosa (el orden importa, en combinatoria).
      { termino: 'orden', local: true, def: 'Cada tamaño de grupo al escribir un número: unidades sueltas, grupos, grupos de grupos.',
        simple: 'Cada tamaño de paquete: sueltos, bolsitas, cajas.', formas: ['orden', 'órdenes'],
        ejemplos: ['En el puesto: los sueltos, las bolsitas y las cajas.', 'En base 10: unidades, decenas y centenas.', 'En 120₍₃₎ hay tres: 1 caja, 2 bolsitas y 0 sueltos.'] },
      // Los que estrena la idea 2.
      // «valor posicional» es local: razonamiento-numerico ya lo define en el curso (con el mismo sentido).
      { termino: 'valor posicional', local: true, def: 'Lo que vale una cifra según el lugar que ocupa en el numeral.',
        simple: 'Lo que vale cada marca por su sitio: 3 bolsitas no son 3 sueltos.',
        ver: ['cifra', 'descomposición polinómica'],
        ejemplos: ['En 555 hay tres cincos: valen 500, 50 y 5.', 'En 132₍₅₎ el 1 vale una caja: 25 caramelos.', 'En 23₍₅₎ el 2 vale dos bolsitas, 10 caramelos; el 3, solo 3.'] },
      { termino: 'potencia', def: 'Resultado de multiplicar un número por sí mismo varias veces; el exponente dice cuántas.',
        simple: 'Un número por sí mismo, varias veces: 5 × 5 × 5.', formas: ['potencia', 'potencias'],
        ejemplos: ['5² = 5 × 5 = 25: una caja de bolsitas de 5.', '4³ = 4 × 4 × 4 = 64: un cajón de bolsitas de 4.', '10² = 100: en base 10, una centena.'] },
      { termino: 'descomposición polinómica', def: 'Escribir un numeral como suma de cada cifra por lo que vale su lugar.',
        simple: 'Partir la etiqueta en lo que vale cada cifra, y sumarlo todo.',
        ver: ['potencia', 'numeral'],
        ejemplos: ['231₍₄₎ = 2 × 16 + 3 × 4 + 1 = 45.', '132₍₄₎ = 1 × 16 + 3 × 4 + 2 = 30.', 'Con letras: a̅b̅c̅₍ₙ₎ = a × n² + b × n + c.'] },
      // Los que estrena la idea 3.
      { termino: 'cociente', local: true, simbolo: 'q', def: 'Cuántas veces cabe el divisor completo en lo que se divide.',
        simple: 'Cuántos grupos completos salen al repartir: 17 en bolsitas de 5 da 3.', formas: ['cociente', 'cocientes'],
        ejemplos: ['23 entre 5: el cociente es 4.', '30 caramelos en bolsitas de 4 llenan 7: el cociente es 7.', 'Al cambiar de base, cada cociente se vuelve a dividir.'] },
      { termino: 'resto', simbolo: 'r', def: 'Lo que sobra al dividir sin pasarse: es menor que el divisor y puede ser 0.',
        simple: 'Lo que sobra sin completar un grupo: 17 en bolsitas de 5 deja 2.', formas: ['resto', 'restos'],
        ejemplos: ['23 entre 5: cociente 4 y sobra 3, porque 4 × 5 + 3 = 23.', 'Al dividir entre 7, sale de 0 a 6.', 'Al cambiar de base, cada uno es una cifra.'] },
      { termino: 'cambio de base', def: 'Escribir el mismo número en otra base: se divide entre la nueva base y se leen los restos.',
        simple: 'Volver a escribir la misma cantidad, juntando de otro tamaño.', formas: ['cambio de base', 'cambios de base'],
        ver: ['resto', 'base de numeración'],
        ejemplos: ['17 = 25₍₆₎: 2 bolsitas de 6 y 5 sueltos.', '38 = 212₍₄₎: 2 cajas, 1 bolsita y 2 sueltos.', '243₍₅₎ = 73 = 133₍₇₎: se pasa por base 10.'] },
      // Los que estrena la idea 4.
      { termino: 'base desconocida', def: 'La base de un numeral cuando no está escrita y hay que hallarla con otro dato.',
        simple: 'El tamaño de bolsita que nadie anotó en la etiqueta.', formas: ['base desconocida', 'bases desconocidas'],
        ver: ['base de numeración', 'acotar'],
        ejemplos: ['32₍ₙ₎ = 23: la base es 7.', '41₍ₙ₎ = 21: la base es 5.', '121₍ₙ₎ = 49: se prueba desde la menor base y sale 6.'] },
      { termino: 'cifra oculta', def: 'Cifra de un numeral que no se conoce y se escribe con una letra.',
        simple: 'Una marca borrosa en la etiqueta: se sabe dónde está, no cuánto vale.', formas: ['cifra oculta', 'cifras ocultas'],
        ver: ['cifra', 'acotar'],
        ejemplos: ['En 4a₍₆₎, a puede ir de 0 a 5.', 'En a2₍₅₎, a va de 1 a 4: la primera no es 0.', 'Si a3a₍₈₎ = 219, entonces a = 3.'] },
      { termino: 'acotar', local: true, def: 'Encerrar los valores posibles de algo entre un mínimo y un máximo.',
        simple: 'Decir entre qué valores puede estar algo: más de 3 y menos de 8.', formas: ['acotar', 'acota', 'acotan', 'acotando', 'acotada', 'acotadas'],
        ejemplos: ['En 52₍ₙ₎ aparece un 5: n es 6 o más.', 'Si 34₍ₙ₎ < 30, n va de 5 a 8.', 'a3₍₅₎ y 2a₍₄₎: a llega solo hasta 3.'] },
      // Los que estrena la idea 5.
      { termino: 'bloque', def: 'Grupo de números seguidos que se escriben con igual cantidad de cifras.',
        simple: 'Los boletos que se imprimen con igual número de marcas: del 10 al 99.', formas: ['bloque', 'bloques'],
        ejemplos: ['Del 1 al 9: el de una cifra.', 'Del 10 al 99: el de dos cifras.', 'Del 100 al 999: 900 boletos de tres cifras.'] },
      { termino: 'cantidad de cifras', def: 'Cuántas marcas se escriben para anotar un número.',
        simple: 'Cuántas marcas lleva un número impreso: el 7 una, el 45 dos.', formas: ['cantidad de cifras'],
        ver: ['cifra', 'bloque'],
        ejemplos: ['El boleto 7 lleva una; el 300, tres.', 'Del 1 al 60 se imprimen 111 en total.', '50 tiene dos en base 10 y tres en base 5 (200₍₅₎).'] },
    ],
    // Laboratorio: juego libre, sin preguntas. «Canje amplio» abre la base de 4 a 10 (incluye base 10, el caso que
    // el juego no deja) y hasta 40 fichas; «Libros largos» llega a 1500 páginas, con el bloque de cuatro cifras.
    laboratorio: [
      mesaBloques,
      {
        id: 'canje-amplio', titulo: 'Canje amplio', pieza: 'arit-fichas',
        consigna: 'Hasta 40 fichas y bases de 4 a 10. Tira del borde de la fila para cambiar la base.',
        controles: [
          { id: 'n', etiqueta: 'Fichas', min: 3, max: 40, paso: 1, inicio: 30, decimales: 0 },
          { id: 'b', etiqueta: 'n', color: 'c-i', min: 4, max: 10, paso: 1, inicio: 7, decimales: 0 },
        ],
        dibujo: v => ({ datos: fichasLab(v.n, v.b), estado: {} }),
        lectura: v => [cant(v.n), ' fichas en base ', bas(v.b), ': ', num(enBase(v.n, v.b), v.b)],
        // Retos: cada uno lee el numeral con enBase, la misma función que rotula las fichas.
        invitaciones: [
          { texto: 'Consigue un numeral que termine en 0: ninguna ficha suelta.',
            logrado: v => enBase(v.n, v.b).endsWith('0'),
            bien: 'Sin sueltas, la cifra de las unidades es 0. ¿Pasa en otra base?' },
          { texto: 'Con 40 fichas, busca la base más chica que las escriba con dos cifras.',
            logrado: v => v.n === 40 && enBase(v.n, v.b).length === 2 && enBase(v.n, v.b - 1).length > 2,
            bien: 'Base 7: 40 = 55₍₇₎. Con una base menos, ya hacen falta tres cifras.' },
          { texto: 'Arma un numeral de tres cifras iguales.',
            logrado: v => /^(\d)\1\1$/.test(enBase(v.n, v.b)),
            bien: 'Tres unos: un grupo de grupos, un grupo y una suelta.' },
          { texto: 'Haz que el numeral copie la cantidad de fichas, con dos cifras o más.',
            logrado: v => v.n >= 10 && enBase(v.n, v.b) === String(v.n),
            bien: 'Solo en base 10 el numeral copia la cantidad. Por eso 132₍₄₎ no es 132.' },
          { texto: 'Guarda dos casos con las mismas cifras en bases distintas.',
            logrado: (v, guardados) => guardados.some(g => g.b !== v.b && enBase(g.n, g.b) === enBase(v.n, v.b)),
            bien: 'Mismas cifras, distinta cantidad: el numeral solo no dice cuánto es.' },
        ],
        arrastres: [{ id: 'fila', etiqueta: 'largo de la fila (la base)', color: 'c-i',
          donde: v => bordeFila(fichasLab(v.n, v.b), v.b),
          mover: (pt, v) => ({ b: baseEn(fichasLab(v.n, v.b), pt.x) }) }],
      },
      {
        id: 'libros-largos', titulo: 'Libros largos', pieza: 'arit-tiras',
        consigna: 'Libros de hasta 1500 páginas. Arrastra el final de la tira de páginas y mira el bloque de cuatro cifras.',
        controles: [{ id: 'P', etiqueta: 'Última página', min: 5, max: 1500, paso: 5, inicio: 1200, decimales: 0 }],
        dibujo: v => ({ datos: tirasPaginas(v.P, 4900), estado: {} }),
        lectura: v => [`De 1 a ${v.P}: `, cif(totalCifras(v.P)), ' cifras'],
        // Retos: bloques() y totalCifras() son las mismas que arman las tiras.
        invitaciones: [
          { texto: 'Encuentra el libro que usa justo 1002 cifras.',
            logrado: v => totalCifras(v.P) === 1002,
            bien: 'Página 370: 9 + 180 + 813. ¿Cuántas páginas tienen tres cifras?' },
          { texto: 'Busca el libro más corto que ya tenga una página de cuatro cifras.',
            logrado: v => { const u = bloques(v.P).pop(); return u.k === 4 && u.cuantos === 1; },
            bien: 'La página 1000 es la primera de cuatro cifras: 10³.' },
          { texto: 'Haz que la tira de cifras tenga solo dos bloques.',
            logrado: v => bloques(v.P).length === 2,
            bien: 'Hasta la página 99 solo hay números de una y de dos cifras.' },
          { texto: 'Guarda dos libros que se lleven 5 páginas y 15 cifras.',
            logrado: (v, guardados) => guardados.some(g => Math.abs(g.P - v.P) === 5 && Math.abs(totalCifras(g.P) - totalCifras(v.P)) === 15),
            bien: 'Cinco páginas de tres cifras: 15 cifras más. Cada bloque cobra distinto.' },
        ],
        arrastres: [finLibro('P', 4900)],
      },
    ],
    historia: {
      texto: 'El sistema de numeración que usamos se fue armando entre la India, las sociedades de lengua árabe y Europa, durante siglos y con sistemas que convivían. Nadie la inventó de una vez. Su idea clave es que un símbolo vale según el lugar que ocupa. Escribir un número en otra base cambia cómo se ve, no cuánto es.',
      pregunta: '¿Qué cambia si contamos de cinco en cinco?',
      fuente: { titulo: 'O’Connor y Robertson, Arabic numerals — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Arabic_numerals/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'bloques-base': ['agrupar', 'descomposicion'],
      'canje-amplio': ['agrupar'],
      'libros-largos': ['conteo-cifras'],
    },
    ideas: [agrupar, descomposicion, cambio, baseOculta, conteo],
  };
});
