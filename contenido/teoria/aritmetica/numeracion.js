/*
 * Teoría de «Sistemas de numeración» (aritmetica.numeracion), para 5.º de secundaria y preuniversitario. Fuente del
 * contenido: docs/teoria/matriz/aritmetica.json (unidad 11) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 *
 * Etapa 3 del plan de calidad (17 nov), fase 2 del método: la propuesta aprobada (docs/etapa3/propuesta-aritmetica.md,
 * con las recomendaciones de su sección 9) y docs/etapa3/decisiones.md, que manda. Por ahora está rehecha SOLO la idea
 * 1, «Agrupar de n en n», para el visto bueno de Gerson; las ideas 2 a 4 (descomposición, cambio de base y conteo)
 * siguen como estaban, con su notación (132)₄ y sus colores viejos, hasta que les toque. Por eso la unidad no declara
 * todavía calidad: 2; numeracion.test.js corre la idea 1 sola con calidad 2 (misión, leyenda, datos, glosario). La
 * idea `base-desconocida` y el tema nuevo del catálogo («Base desconocida y cifras ocultas») entran con ella.
 * Hilo de la unidad: el puesto de caramelos de doña Juana en el mercado de Juliaca (pieza arit-puesto, dibujo de
 * prueba): n caramelos sueltos llenan una bolsita, n bolsitas una caja, n cajas un cajón; la etiqueta es el numeral.
 *
 * Letras: la base se llama n (en a̅b̅c̅₍ₙ₎, b es una cifra); N, la cantidad en base 10 (caramelos), siempre con su
 * color y su leyenda. Los ids de los controles siguen siendo n (la cantidad) y b (la base): solo cambian sus rótulos.
 * Notación: 342₍₆₎, con la base de subíndice entre paréntesis (num en las ecuaciones, numT en el texto plano), y
 * a̅b̅c̅₍ₙ₎ con raya cuando lleva letras ({ raya } de nucleo/ecuacion.js). Sin base escrita, la base es 10. Se usa «×»
 * para multiplicar (el «·» separa relaciones en la regla).
 *
 * REGLA DE COLORES DE LA UNIDAD: un color fijo por magnitud (docs/molde-unidad.md §5b; decisiones, 17 nov), en la
 * tabla COLORES (def.colores), la misma en el juego, la figura, la fórmula, los datos, los ejemplos y «Ahora tú»:
 *   - violeta (c-f): la cantidad en base 10 (N): los caramelos de un pedido, la bolsa, el último boleto. Es lo que más
 *     pide el examen. En una figura, solo si se da (el rótulo «38 caramelos»), nunca si se pide;
 *   - turquesa (c-i): la base n: el contorno de la bolsita, la caja y el cajón, el subíndice ₍ₙ₎ y el divisor;
 *   - naranja (c-o): las cifras: el numeral, cuántas bolsitas o sueltos hay, cada resto (es una cifra);
 *   - verde (c-d): solo la segunda base, al pasar entre dos bases que no son 10 (idea 3), siempre con su rótulo;
 *   - tinta: los cocientes, los caramelos dibujados y lo que se pide antes de responder («?»);
 *   - el carmín (de los ángulos) no se usa.
 *   La respuesta lleva el color de su magnitud. La letra de una alternativa va en negrita, con el color de lo que nombra.
 *   Cada ficha de color dice su magnitud (m); contenido/teoria/aritmetica/numeracion.test.js falla si una magnitud
 *   cambia de color (hoy en la idea 1; cada idea que se rehaga se suma a IDEAS_REHECHAS).
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
  const b = { v: 'c-o', t: 'b' }, d = { v: 'c-i', t: 'd' }, N = { v: 'c-d', t: 'N' }, r = { v: 'c-h', t: 'r' };
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const subi = n => String(n).split('').map(c => SUB[+c]).join('');
  // Numeral en base b (cifras como texto) y su escritura «(132)₄».
  const enBase = (n, base) => { if (n === 0) return '0'; let s = ''; while (n > 0) { s = String(n % base) + s; n = Math.floor(n / base); } return s; };
  const nb = (cifras, base) => `(${cifras})${subi(base)}`;
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
    primera: 'La primera cifra de un numeral de varias cifras no es 0',
    etiqueta: 'Etiqueta: primero las bolsitas, después los sueltos; abajo y entre paréntesis, la base',
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
      pregunta: ['¿Cuál es la menor base en la que el numeral ', cif(txt), ' está bien escrito?'],
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
        pregunta: ['Los numerales ', cif(A), ', ', cif(B), ' y ', cif(C), ' están escritos en la misma base. ¿Cuál es la menor base posible?'],
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
      pregunta: ['El numeral ', cif(txt), ' está escrito en una base menor que 10. ¿En cuántas bases puede estar?'],
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
  // sueltos = 34₍₅₎ (19); 20 = 32₍₆₎ = 26₍₇₎; 1201₍₂₎ mal escrita; menor base común de 2031, 425 y 106 = 7; 3021 en
  // bases 4 a 9 (6); 543₍₆₎ y 102₍₆₎; dos bien escritos de cinco; 45 caramelos con bolsitas de 7 = 63₍₇₎ (6 × 6 = 36 ≤ 45 <
  // 49 = 7 × 7). Ninguna figura muestra la respuesta: lo que se pide va con «?».
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
      enunciado: ['La etiqueta de una bolsa cerrada dice ', num('42', 7), '. ¿Cuántas bolsitas hay adentro, de cuántos caramelos cada una, y cuántos sueltos?'],
      datos: ['En la etiqueta, la cifra de la izquierda cuenta bolsitas y la de la derecha, sueltos', 'La base, abajo, dice de cuántos caramelos es cada bolsita'],
      figura: fig({ n: 7, cerrado: true, etiqueta: { cifras: '42' } }),
      solucion: [
        { texto: ['La base es ', bas(7), ': cada bolsita lleva ', bas(7), ' caramelos.'] },
        { texto: ['La cifra ', cif(4), ' cuenta bolsitas y la cifra ', cif(2), ' cuenta sueltos. Está bien anotada: 2 es menos que 7.'] },
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
      enunciado: ['¿Cuál de estas etiquetas está mal escrita? A) ', num('304', 5), '   B) ', num('2110', 3), '   C) ', num('657', 8), '   D) ', num('1201', 2)],
      datos: [DN.cifras],
      solucion: [
        { texto: ['Comparo la cifra más grande de cada una con su base: en ', letra('A'), ', 4 < 5; en ', letra('B'), ', 2 < 3; en ', letra('C'), ', 7 < 8.'] },
        { texto: ['En ', letra('D'), ', la base es ', bas(2), ': solo existen el 0 y el 1. La cifra 2 no existe.'] },
      ],
      respuesta: [letra('D'), ', ', num('1201', 2)] },
    { nivel: 3, titulo: 'Una base para tres',
      enunciado: ['Los numerales ', cif('2031'), ', ', cif('425'), ' y ', cif('106'), ' están escritos en la misma base. ¿Cuál es la menor base posible? A) 5   B) 6   C) 7   D) 10'],
      datos: [DN.cifras],
      solucion: [
        { texto: 'La base tiene que ser mayor que todas las cifras de los tres numerales, no solo que las del primero.' },
        { texto: ['La cifra más grande es el 6, de ', cif('106'), '. La base pasa al 6: la menor es 7.'], ecuacion: ['6 < ', bas('n'), '   →   ', bas('n'), ' = ', bas(7)] },
        { texto: ['Con 5 o 6 no alcanza: el 6 no existiría. Con 10 sirve, pero no es la menor.'] },
      ],
      respuesta: [letra('C', 'base'), ', base ', bas(7)] },
    { nivel: 3, titulo: '¿En qué bases?',
      enunciado: ['El numeral ', cif('3021'), ' está escrito en una base menor que 10. ¿En qué bases puede estar, y cuántas son?'],
      datos: [DN.cifras, 'La base es un número entero de 2 o más'],
      solucion: [
        { texto: ['La cifra más grande de ', cif('3021'), ' es el 3: la base tiene que ser mayor que 3.'] },
        { texto: ['Sirven ', bas('4, 5, 6, 7, 8 y 9'), '. La base 3 no: ahí el 3 no existe. La 10 tampoco: no es menor que 10.'] },
      ],
      respuesta: ['Las bases ', bas('4, 5, 6, 7, 8 y 9'), ': son seis'] },
    { nivel: 3, titulo: 'Tres cifras distintas',
      enunciado: ['En base ', bas(6), ', ¿cuál es el mayor numeral de tres cifras distintas, y cuál el menor?'],
      datos: [DN.cifras, DN.primera],
      solucion: [
        { texto: ['En base ', bas(6), ' las cifras van de 0 a 5. El mayor usa las tres más grandes, de mayor a menor.'], ecuacion: [num('543', 6)] },
        { texto: 'El menor empieza con la cifra más chica que no es 0, el 1; después van el 0 y el 2.', ecuacion: [num('102', 6)] },
        { texto: 'No sirven 555, que repite cifras, ni 012, que empieza en 0 y en realidad tiene dos cifras.' },
      ],
      respuesta: ['Mayor, ', num('543', 6), '; menor, ', num('102', 6)] },
    { nivel: 3, titulo: '¿Cuántas están bien?',
      enunciado: ['¿Cuántos de estos numerales están bien escritos? ', num('1203', 4), ', ', num('3401', 4), ', ', num('2230', 3), ', ', num('1111', 2), ' y ', num('0312', 5)],
      datos: [DN.cifras, DN.primera],
      solucion: [
        { texto: [num('1203', 4), ' sí: todas sus cifras son menores que 4. ', num('3401', 4), ' no: tiene un 4. ', num('2230', 3), ' no: tiene un 3.'] },
        { texto: [num('1111', 2), ' sí: en base 2 valen el 0 y el 1. ', num('0312', 5), ' no: empieza en 0.'] },
      ],
      respuesta: ['Solo dos: ', num('1203', 4), ' y ', num('1111', 2)] },
    { nivel: 3, titulo: 'Bolsitas para 45',
      enunciado: ['Doña Juana quiere anotar ', cant(45), ' caramelos con solo dos cifras, sin llenar ninguna caja. ¿Cuál es la bolsita más chica que sirve, y qué etiqueta sale?'],
      datos: [['1 caja = ', bas('n'), ' bolsitas = ', bas('n'), ' × ', bas('n'), ' caramelos'], DN.cifras],
      figura: fig({ sueltos: 45, rotulos: { sueltos: [['45 caramelos', 'f', 700]] }, regla: [[['1 bolsita = '], ['?', 'i', 700], [' caramelos']]], etiqueta: { cifras: '?', base: '?' } }),
      solucion: [
        { texto: ['Con dos cifras hay a lo más ', bas('n'), ' − 1 bolsitas: para no llenar una caja, 45 tiene que ser menos que ', bas('n'), ' × ', bas('n'), '.'] },
        { texto: ['Con bolsitas de 6 no: 6 × 6 = 36, y 45 llenaría una caja. Con bolsitas de ', bas(7), ' sí: 7 × 7 = 49, más que 45.'] },
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
        { titulo: 'El puesto de doña Juana', texto: ['En el mercado de Juliaca, doña Juana vende caramelos. No los cuenta uno por uno: los junta en bolsitas iguales, aquí de ', bas(5), '. Nunca deja ', bas(5), ' sueltos: con ', bas(5), ' llena otra bolsita.'],
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
      consigna: 'Doña Juana junta los caramelos en bolsitas iguales y anota cada pedido en su etiqueta.',
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
      pregunta: ['Doña Juana tiene un pedido anotado ', num('44', 5), ': ', cif(4), ' bolsitas y ', cif(4), ' sueltos. Le llega un caramelo más. ¿Cómo queda la etiqueta?'],
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
      condicion: 'n es un entero de 2 o más; la primera cifra de un numeral no es 0. Sin base escrita, es 10.',
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

  // ---------- Idea 2: cada cifra vale según su lugar (descomposición polinómica) ----------
  // Cambia: la base, con el mismo numeral 132. Permanece: las tres cifras y sus lugares.
  // Progresa: fila por fila, cifra × su potencia de b. Se reserva: el total, que cambia aunque el numeral no.
  // Debe verse: el mismo numeral vale distinto en cada base.
  const tablaPolinomio = (cifras, base, con = 99) => {
    const k = cifras.length, filas = cifras.split('').map((c, i) => {
      const e = k - 1 - i, p = base ** e;
      return [{ t: c, color: 'i', paso: i + 1 > con ? 99 : 0 }, { t: e === 0 ? '1' : `${base}${sup(e)} = ${p}`, paso: i + 1 > con ? 99 : 0 }, { t: String(+c * p), paso: i + 1 > con ? 99 : 0 }];
    });
    filas.push(['', 'total', { t: String(valor(cifras, base)), color: 'd', resalta: true, paso: k + 1 > con ? 99 : 0 }]);
    return { columnas: [{ t: 'cifra', color: 'i' }, { t: 'lugar' }, { t: 'vale' }], filas, filasMax: 5 };
  };
  const tablaPasos = (cifras, base) => {
    const k = cifras.length, filas = cifras.split('').map((c, i) => {
      const e = k - 1 - i, p = base ** e;
      return [{ t: c, color: 'i' }, { t: e === 0 ? '1' : `${base}${sup(e)} = ${p}`, paso: i + 1 }, { t: String(+c * p), paso: i + 1 }];
    });
    filas.push(['', { t: 'total', paso: k + 1 }, { t: String(valor(cifras, base)), color: 'd', resalta: true, paso: k + 1 }]);
    return { columnas: [{ t: 'cifra', color: 'i' }, { t: 'lugar' }, { t: 'vale' }], filas, filasMax: 5 };
  };
  const descomposicion = {
    id: 'descomposicion',
    titulo: 'Cada cifra vale según su lugar',
    temas: ['Descomposición polinómica'],
    pieza: 'arit-tabla',
    // Lee (fase 2): valor posicional en base 10 y cómo se escribe la base, sin calcular (132)₄ (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'El lugar manda', texto: 'En 555 hay tres cincos, pero no valen igual: el de la izquierda vale quinientos, el del centro cincuenta y el de la derecha, cinco. A eso se le llama valor posicional.' },
        { titulo: 'Dónde va la base', texto: 'La base se escribe chiquita, abajo y a la derecha. (213)₅ se lee «dos, uno, tres en base cinco», no «doscientos trece». Si no lleva ese número chico, la base es 10.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el numeral 132 no cambia; solo cambia la base. Mira la columna del lugar y el total cada vez que subes o bajas la base.' },
      ],
    },
    juega: {
      consigna: 'El numeral 132 se queda quieto. Cambia la base y mira cuánto vale cada cifra y el total.',
      voz: 'Las cifras no cambian; mira la columna del lugar.',
      controles: [{ id: 'b', etiqueta: 'b', color: 'c-o', min: 5, max: 9, paso: 1, inicio: 5, decimales: 0 }],
      dibujo: v => ({ datos: tablaPolinomio('132', v.b), estado: {} }),
      lectura: v => [{ sub: ['(132)', String(v.b)] }, ' = ', { v: 'c-d', t: String(valor('132', v.b)) }],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuánto vale ', { sub: ['(132)', { v: 'c-o', t: '4' }] }, ' en base 10?'],
      opciones: [
        { id: 'c', texto: '30', correcta: true },
        { id: 'decimal', texto: '132', error: 'AT-DECIMAL', siFuera: '132 sería cierto en base 10. Aquí el 1 vale 4², no 10².' },
        { id: 'al-reves', texto: '45', error: 'AT-ORDEN', siFuera: 'Eso da la potencia mayor a la última cifra. La de la izquierda lleva la mayor.' },
        { id: 'suma', texto: '24', error: 'AT-SUMA', siFuera: 'Eso multiplica la suma de cifras por 4. Cada cifra lleva su propia potencia.' },
      ],
      dibujo: { datos: tablaPolinomio('132', 4, 0), estado: {} },
      revelar: { datos: tablaPolinomio('132', 4), estado: {} },
      coincide: 'Coincide: 16 + 12 + 2 = 30.',
    },
    mira: {
      datos: tablaPasos('132', 4),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'La primera cifra está en el lugar de 4².', ecuacion: ['1 · 4² = 16'] },
        { estado: { paso: 2, fila: 1 }, texto: 'La segunda, en el lugar de 4.', ecuacion: ['3 · 4 = 12'] },
        { estado: { paso: 3, fila: 2 }, texto: 'La última, en el lugar de las unidades.', ecuacion: ['2 · 1 = 2'] },
        { estado: { paso: 4, fila: 3 }, texto: 'El valor es la suma de los tres aportes.', ecuacion: [{ sub: ['(132)', '4'] }, ' = 16 + 12 + 2 = ', { v: 'c-d', t: '30' }] },
      ],
    },
    regla: {
      texto: 'Descomposición polinómica: cada cifra se multiplica por la potencia de la base de su lugar, contando desde 0 a la derecha, y se suma todo.',
      // A 360 px no cabe en una línea: el separador la parte en el «=» (sin él se partía entre «+» y d₀).
      ecuacion: [{ sub: [['(', { sub: [d, 'k'] }, '…', { sub: [d, '1'] }, { sub: [d, '0'] }, ')'], b] }, ' =', '   ·   ', { sub: [d, 'k'] }, ' ', { sup: [b, 'k'] }, ' + … + ', { sub: [d, '1'] }, ' ', b, ' + ', { sub: [d, '0'] }],
      condicion: 'cada cifra cumple 0 ≤ d < b. El lugar de la derecha es b⁰ = 1.',
    },
    // Así se resuelve (fase 2): el mismo numeral a base 10 de «Ahora tú», con otras semillas.
    resuelve: {
      generar(s) {
        const q = azar(s + 900), base = q.ent(2, 9), k = base === 2 ? q.ent(4, 5) : q.ent(3, 4);
        let c = String(q.ent(1, base - 1));
        for (let i = 1; i < k; i++) c += String(q.ent(0, base - 1));
        const v = valor(c, base), B = { v: 'c-o', t: String(base) }, num = { sub: [{ v: 'c-i', t: `(${c})` }, B] };
        const terminos = c.split('').map((x, i) => `${x}·${base}${sup(k - 1 - i)}`).join(' + ');
        const aportes = c.split('').map((x, i) => f(+x * base ** (k - 1 - i))).join(' + ');
        const desde = base ** (k - 1), hasta = base ** k;
        return {
          enunciado: ['¿Cuánto vale ', num, ' en base 10?'],
          dibujo: { datos: tablaPolinomio(c, base, 0), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden el valor en base 10 de ', num, ', un numeral escrito en base ', B, '.'] },
            { tipo: 'datos', texto: `Tiene ${k} cifras: ${c.split('').join(', ')}. La de la derecha está en el lugar de las unidades.` },
            { tipo: 'regla', texto: 'Cada cifra se multiplica por lo que vale su lugar: 1, la base, la base al cuadrado… contando desde la derecha. Después se suma todo.' },
            { tipo: 'cuentas', texto: 'Multiplico cada cifra por la potencia de su lugar y sumo los aportes.',
              ecuacion: [`${terminos} = ${aportes} = `, { v: 'c-d', t: f(v) }],
              dibujo: { datos: tablaPolinomio(c, base), estado: {} } },
            { tipo: 'sentido', texto: `Un numeral de ${k} cifras en base ${base} vale por lo menos ${f(desde)} y menos de ${f(hasta)}. El ${f(v)} está en ese rango.` },
          ],
          respuesta: [num, ' = ', { v: 'c-d', t: f(v) }],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const q = azar(s), base = q.ent(2, 9), k = base === 2 ? q.ent(4, 5) : q.ent(3, 4);
        let c = String(q.ent(1, base - 1));
        for (let i = 1; i < k; i++) c += String(q.ent(0, base - 1));
        const v = valor(c, base), rev = valor(c.split('').reverse().join(''), base);
        const suma = c.split('').reduce((a, x) => a + +x, 0);
        return {
          pregunta: ['¿Cuánto vale ', { sub: [`(${c})`, { v: 'c-o', t: String(base) }] }, ' en base 10?'],
          dibujo: { datos: tablaPolinomio(c, base, 0), estado: {} },
          opciones: opciones(v, [
            { id: 'decimal', valor: +c, error: 'AT-DECIMAL', siFuera: `Eso lee las cifras en base 10; aquí la base es ${base}.` },
            { id: 'al-reves', valor: rev, error: 'AT-ORDEN', siFuera: 'La potencia mayor va con la cifra de la izquierda.' },
            { id: 'suma', valor: suma * base, error: 'AT-SUMA', siFuera: 'Cada cifra lleva su propia potencia; no se multiplica la suma.' },
          ], x => f(x)),
          solucion: { texto: 'Cada cifra por la potencia de su lugar.', ecuacion: [c.split('').map((x, i) => `${x}·${base}${sup(k - 1 - i)}`).join(' + '), ` = ${f(v)}`], dibujo: { datos: tablaPolinomio(c, base), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: dividir entre b y leer los restos al revés (cambio de base) ----------
  // Cambia: el número y la base de llegada. Permanece: el formato de la tabla (dividendo, cociente, resto).
  // Progresa: una división por fila hasta cociente 0. Se reserva: el orden de lectura, de abajo hacia arriba.
  // Debe verse: el último resto es la primera cifra.
  const tablaDivisiones = (n, base, conPasos) => {
    const filas = [];
    let x = n, i = 0;
    while (x > 0) {
      const c = Math.floor(x / base), rr = x % base;
      i++;
      filas.push([{ t: `${x} ÷ ${base}`, paso: conPasos ? i : 0 }, { t: String(c), paso: conPasos ? i : 0 }, { t: String(rr), color: 'h', resalta: !!conPasos, paso: conPasos ? i : 0 }]);
      x = c;
    }
    return { columnas: [{ t: 'divide' }, { t: 'cociente' }, { t: 'resto', color: 'h' }], filas, filasMax: 6 };
  };
  const cambio = {
    id: 'cambio-base',
    titulo: 'Restos leídos de abajo arriba',
    temas: ['Cambio de base'],
    pieza: 'arit-tabla',
    // Lee (fase 2): misma cantidad con otra escritura y la división con resto, sin decir en qué orden se leen los
    // restos (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'La misma plata', texto: 'Treinta soles pueden ser tres billetes de diez o seis monedas de cinco. La plata es la misma; cambia cómo la juntas. En un cambio de base pasa igual: el número no cambia, su escritura sí.' },
        { titulo: 'Dividir con resto', texto: 'Si repartes 17 chuños en bolsas de 5, llenas 3 bolsas y te sobran 2. El 3 es el cociente y el 2 es el resto, que siempre es menor que 5.',
          ecuacion: ['17 = 5 · 3 + ', { v: 'c-h', t: '2' }] },
        { titulo: 'Qué mirar', texto: 'En la tabla, cada fila divide entre la base lo que salió de cociente en la fila anterior. Fíjate en la columna roja y en cuándo se detiene la tabla.' },
      ],
    },
    juega: {
      consigna: 'Elige un número y una base. La tabla lo divide entre la base hasta que el cociente es 0.',
      voz: 'Mira la columna roja: ahí están las cifras.',
      controles: [
        { id: 'n', etiqueta: 'N', color: 'c-d', min: 10, max: 60, paso: 1, inicio: 25, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-o', min: 4, max: 9, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDivisiones(v.n, v.b, false), estado: {} }),
      lectura: v => [{ v: 'c-d', t: String(v.n) }, ' = ', { sub: [`(${enBase(v.n, v.b)})`, String(v.b)] }],
      minimo: 3,
    },
    predice: {
      pregunta: ['Al pasar ', { v: 'c-d', t: '19' }, ' a base ', { v: 'c-o', t: '3' }, ', los restos salen 1, 0 y 2, en ese orden. ¿Cómo se escribe 19 en base 3?'],
      opciones: [
        { id: 'c', texto: '(201)₃', correcta: true },
        { id: 'orden', texto: '(102)₃', error: 'AT-ORDEN', siFuera: 'Ese es el orden en que salen. Se leen del último resto al primero.' },
        { id: 'igual', texto: '(19)₃', error: 'AT-CIFRA-B', siFuera: 'La cifra 9 no existe en base 3: las cifras van de 0 a 2.' },
        { id: 'cocientes', texto: '(62)₃', error: 'AT-COCIENTE', siFuera: 'Esos son cocientes. Las cifras son los restos.' },
      ],
      dibujo: { datos: tablaDivisiones(19, 3, false), estado: { paso: 0, columna: 2 } },
      revelar: { datos: tablaDivisiones(19, 3, false), estado: { fila: 2 } },
      coincide: 'Coincide: 2·9 + 0·3 + 1 = 19.',
    },
    mira: {
      datos: tablaDivisiones(19, 3, true),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: '19 entre 3: cociente 6, sobra 1. Es la cifra de las unidades.', ecuacion: ['19 = 3 · 6 + ', { v: 'c-h', t: '1' }] },
        { estado: { paso: 2, fila: 1 }, texto: 'Los 6 grupos se vuelven a agrupar de 3 en 3.', ecuacion: ['6 = 3 · 2 + ', { v: 'c-h', t: '0' }] },
        { estado: { paso: 3, fila: 2 }, texto: 'Quedan 2 grupos de 9; el cociente ya es 0.', ecuacion: ['2 = 3 · 0 + ', { v: 'c-h', t: '2' }] },
        { estado: { paso: 3, columna: 2 }, texto: 'Se leen los restos desde el último.', ecuacion: ['19 = ', { sub: ['(201)', '3'] }, ' = 2·9 + 0·3 + 1'] },
      ],
    },
    regla: {
      texto: 'Cambio de base: para pasar de base 10 a base b se divide entre b hasta que el cociente es 0. Los restos, del último al primero, son las cifras.',
      ecuacion: [N, ' = ', b, ' · q + ', { llave: [r], nota: 'una cifra', color: 'c-h' }, '   ·   ', '0 ≤ ', r, ' < ', b],
      condicion: 'el número no cambia, solo su escritura. Entre dos bases que no son 10, se pasa primero por base 10.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» (de base 10 a base b, y entre dos bases), con otras semillas.
    resuelve: {
      generar(s) {
        const q = azar(s + 900);
        // Las divisiones sucesivas de n entre la base: el resto de cada una y la descomposición de vuelta.
        const divisiones = (n, base) => { const out = []; for (let x = n; x > 0; x = Math.floor(x / base)) out.push({ x, c: Math.floor(x / base), r: x % base }); return out; };
        const vuelta = (cifras, base) => cifras.split('').map((x, i) => `${x}·${base}${sup(cifras.length - 1 - i)}`).join(' + ');
        if (s % 3 === 2) {
          const a = q.de([3, 4, 5]), c = q.de([2, 6, 7].filter(x => x !== a)), n = q.ent(a * a, a * a * a - 1);
          const na = enBase(n, a), nc = enBase(n, c), C = { v: 'c-o', t: String(c) };
          const restos = divisiones(n, c).map(x => x.r);
          return {
            enunciado: ['Escribe ', { sub: [`(${na})`, String(a)] }, ' en base ', C, '.'],
            pasos: [
              { tipo: 'pide', texto: ['Piden escribir ', { sub: [`(${na})`, String(a)] }, ' en base ', C, '.'] },
              { tipo: 'datos', texto: `El numeral está en base ${a} y hay que llevarlo a base ${c}. Ninguna de las dos bases es 10.` },
              { tipo: 'regla', texto: 'Entre dos bases que no son 10, primero paso a base 10 con la descomposición. Después divido entre la nueva base.' },
              { tipo: 'cuentas', texto: `Primero a base 10. Luego divido ${n} entre ${c} hasta que el cociente sea 0: los restos salen ${restos.join(', ')}.`,
                ecuacion: [`${vuelta(na, a)} = `, { v: 'c-d', t: String(n) }, '   →   ', { sub: [`(${nc})`, C] }] },
              { tipo: 'sentido', texto: `Leo los restos desde el último y compruebo de vuelta: da ${valor(nc, c)} otra vez. Las dos escrituras valen lo mismo.`,
                ecuacion: [`${vuelta(nc, c)} = `, { v: 'c-d', t: String(valor(nc, c)) }] },
            ],
            respuesta: [{ sub: [`(${na})`, String(a)] }, ' = ', { sub: [`(${nc})`, C] }],
          };
        }
        const base = q.ent(2, 8), n = q.ent(base * base + 1, Math.min(200, base * base * base - 1));
        const cifras = enBase(n, base), B = { v: 'c-o', t: String(base) }, divs = divisiones(n, base);
        const cuentas = [];
        divs.forEach((x, i) => { if (i) cuentas.push('   ·   '); cuentas.push(`${x.x} = ${base} · ${x.c} + `, { v: 'c-h', t: String(x.r) }); });
        return {
          enunciado: ['Escribe ', { v: 'c-d', t: String(n) }, ' en base ', B, '.'],
          dibujo: { datos: tablaDivisiones(n, base, true), estado: { paso: 0 } },
          pasos: [
            { tipo: 'pide', texto: ['Piden escribir ', { v: 'c-d', t: String(n) }, ' en base ', B, '.'] },
            { tipo: 'datos', texto: `El número está en base 10. En base ${base} las cifras van de 0 a ${base - 1}.` },
            { tipo: 'regla', texto: 'Divido entre la base una y otra vez, hasta que el cociente sea 0. Los restos son las cifras, leídas desde el último.' },
            { tipo: 'cuentas', texto: `Cada fila divide entre ${base} el cociente de la fila anterior. Leo los restos rojos de abajo arriba.`,
              ecuacion: cuentas, dibujo: { datos: tablaDivisiones(n, base, true), estado: { paso: divs.length } } },
            { tipo: 'sentido', texto: `De vuelta, con la descomposición: da ${valor(cifras, base)}. Cuadra.`,
              ecuacion: [`${vuelta(cifras, base)} = `, { v: 'c-d', t: String(valor(cifras, base)) }] },
          ],
          respuesta: [{ v: 'c-d', t: String(n) }, ' = ', { sub: [`(${cifras})`, B] }],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const q = azar(s);
        if (s % 3 === 2) {
          // De base a a base c, pasando por base 10.
          const a = q.de([3, 4, 5]), c = q.de([2, 6, 7].filter(x => x !== a)), n = q.ent(a * a, a * a * a - 1);
          const na = enBase(n, a), nc = enBase(n, c);
          return {
            pregunta: ['Escribe ', { sub: [`(${na})`, String(a)] }, ' en base ', { v: 'c-o', t: String(c) }, '.'],
            opciones: opciones(nb(nc, c), [
              { id: 'copia', valor: nb(na, c), error: 'AT-DECIMAL', siFuera: 'Copiar las cifras cambia el número. Primero pásalo a base 10.' },
              { id: 'orden', valor: nb(nc.split('').reverse().join(''), c), error: 'AT-ORDEN', siFuera: 'Los restos se leen del último al primero.' },
              { id: 'diez', valor: nb(String(n), c), error: 'AT-DECIMAL', siFuera: `${n} es el valor en base 10; falta dividirlo entre ${c}.` },
            ]),
            solucion: { texto: `Primero a base 10: ${n}. Después, divisiones entre ${c}.`, ecuacion: [{ sub: [`(${na})`, String(a)] }, ` = ${n} = `, { sub: [`(${nc})`, String(c)] }] },
          };
        }
        const base = q.ent(2, 8), n = q.ent(base * base + 1, Math.min(200, base * base * base - 1));
        const cifras = enBase(n, base);
        const cocs = []; for (let x = Math.floor(n / base); x > 0; x = Math.floor(x / base)) cocs.push(x);
        return {
          pregunta: ['Escribe ', { v: 'c-d', t: String(n) }, ' en base ', { v: 'c-o', t: String(base) }, '.'],
          opciones: opciones(nb(cifras, base), [
            { id: 'orden', valor: nb(cifras.split('').reverse().join(''), base), error: 'AT-ORDEN', siFuera: 'Ese es el orden en que salen los restos; se leen al revés.' },
            { id: 'cocientes', valor: nb(cocs.reverse().join(''), base), error: 'AT-COCIENTE', siFuera: 'Esos son los cocientes. Las cifras son los restos.' },
            { id: 'sin-ultimo', valor: nb(cifras.slice(1), base), error: 'AT-CONTEO', siFuera: 'Falta la última división: se sigue hasta que el cociente es 0.' },
          ]),
          solucion: { texto: 'Restos del último al primero.', ecuacion: [`${n} = `, { sub: [`(${cifras})`, String(base)] }], dibujo: { datos: tablaDivisiones(n, base, false), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: contar por bloques de igual largo (conteo de números y cifras) ----------
  // Cambia: hasta qué página se numera. Permanece: los bloques de 1, 2 y 3 cifras.
  // Progresa: bloque por bloque, cantidad de números × cifras de cada uno. Se reserva: el bloque incompleto del final.
  // Debe verse: no todos los números tienen la misma cantidad de cifras.
  function bloques(P, base = 10) {
    const out = [];
    for (let k = 1; base ** (k - 1) <= P; k++) {
      const a = base ** (k - 1), z = Math.min(P, base ** k - 1), cuantos = z - a + 1;
      out.push({ k, a, z, cuantos, cifras: cuantos * k });
    }
    return out;
  }
  const tablaBloques = (P, con = 99) => {
    const bl = bloques(P);
    const filas = bl.map((x, i) => [{ t: `${x.a} a ${x.z}`, paso: i + 1 > con ? 99 : 0 }, { t: String(x.cuantos), paso: i + 1 > con ? 99 : 0 }, { t: String(x.k), paso: i + 1 > con ? 99 : 0 }, { t: String(x.cifras), color: 'i', paso: i + 1 > con ? 99 : 0 }]);
    filas.push([{ t: 'total' }, '', '', { t: String(bl.reduce((a, x) => a + x.cifras, 0)), color: 'd', resalta: true, paso: bl.length + 1 > con ? 99 : 0 }]);
    return { columnas: [{ t: 'páginas' }, { t: 'cuántas' }, { t: 'cifras c/u' }, { t: 'cifras', color: 'i' }], filas, filasMax: 5 };
  };
  const tablaBloquesPasos = P => {
    const bl = bloques(P);
    const filas = bl.map((x, i) => [{ t: `${x.a} a ${x.z}`, paso: i + 1 }, { t: String(x.cuantos), paso: i + 1 }, { t: String(x.k), paso: i + 1 }, { t: String(x.cifras), color: 'i', paso: i + 1 }]);
    filas.push([{ t: 'total', paso: bl.length + 1 }, '', '', { t: String(bl.reduce((a, x) => a + x.cifras, 0)), color: 'd', resalta: true, paso: bl.length + 1 }]);
    return { columnas: [{ t: 'páginas' }, { t: 'cuántas' }, { t: 'cifras c/u' }, { t: 'cifras', color: 'i' }], filas, filasMax: 5 };
  };
  const totalCifras = P => bloques(P).reduce((a, x) => a + x.cifras, 0);
  // Dos tiras a la misma escala: las páginas y las cifras que gastan, bloque por bloque (el relleno marca el bloque:
  // más oscuro, más cifras por página). Cada página de k cifras estira la tira de abajo k veces.
  const RELLENO = [0.08, 0.22, 0.4, 0.6];
  function tirasPaginas(P, max, conCifras = true) {
    const bl = bloques(P), cabe = (valor, txt) => 300 * valor / max >= 9 * txt.length + 14;
    const t1 = bl.map(x => ({ valor: x.cuantos, relleno: RELLENO[x.k - 1] }));   // sin rótulos: el final del libro lleva su número
    const t2 = bl.map(x => ({ valor: x.cifras, color: 'i', relleno: RELLENO[x.k - 1], texto: cabe(x.cifras, `${x.cuantos}·${x.k}`) ? `${x.cuantos}·${x.k}` : '' }));
    return { max, filas: 2, alt: `Páginas de 1 a ${P} en bloques de 1, 2 y más cifras; abajo, las cifras que gasta cada bloque: ${totalCifras(P)}`, tiras: [
      { rotulo: 'páginas', fin: String(P), tramos: t1 },
      { rotulo: 'cifras', color: 'i', fin: String(totalCifras(P)), paso: conCifras ? 0 : 99, tramos: t2 },
    ] };
  }
  const MAX_P = 1100;   // escala común del juego: las cifras de 1 a 400 (1092) caben a lo ancho
  const finLibro = (P, max) => ({ id: 'fin', etiqueta: 'final de la tira de páginas',
    donde: v => { const g = TIRAS().geometria(tirasPaginas(v[P], max)); return { x: g.x(v[P]), y: g.tiraY(0) }; },   // en el borde de arriba: no tapa el número del final
    mover: (pt, v) => ({ [P]: TIRAS().geometria(tirasPaginas(v[P], max)).deX(pt.x) }) });
  const conteo = {
    id: 'conteo-cifras',
    titulo: 'Contar cifras por bloques',
    temas: ['Conteo de números y cifras'],
    // Hallazgo 9: dos representaciones a propósito. El juego usa las dos tiras (se ve que el bloque de tres cifras se
    // estira el triple); «Mira» y «Ahora tú» usan la tabla, que es como se cuenta en papel, con los mismos bloques.
    pieza: 'arit-tiras',
    // Lee (fase 2): cuántas cifras tiene una página y cómo contar de a hasta z, sin sumar los bloques de 1 a 100
    // (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'Cifras de una página', texto: 'Al numerar un cuaderno de la feria se escribe cada número de página. La página 7 gasta una cifra; la 45, dos cifras, y la 300, tres cifras.' },
        { titulo: 'Contar de a hasta z', texto: 'Del 20 al 30, ¿cuántos números hay? No son 10 sino 11, porque se cuentan los dos de las puntas.',
          ecuacion: ['de a hasta z: z − a + 1   ·   30 − 20 + 1 = 11'] },
        { titulo: 'Qué mirar', texto: 'En el juego, la tira de arriba son las páginas y la de abajo, las cifras que gastan. Arrastra el final y compara cuánto se estira cada bloque abajo.' },
      ],
    },
    juega: {
      consigna: 'Las páginas de un libro se numeran desde la 1. Arrastra el final de la tira de páginas y mira cuántas cifras gasta cada bloque.',
      voz: 'Compara el bloque de dos cifras con el de tres.',
      controles: [{ id: 'P', etiqueta: 'Última página', min: 120, max: 400, paso: 20, inicio: 200, decimales: 0 }],
      dibujo: v => ({ datos: tirasPaginas(v.P, MAX_P), estado: {} }),
      lectura: v => [`De 1 a ${v.P} se usan `, { v: 'c-d', t: String(totalCifras(v.P)) }, ' cifras'],
      minimo: 3,
      arrastres: [finLibro('P', MAX_P)],
    },
    predice: {
      pregunta: '¿Cuántas cifras se usan para numerar las páginas de un libro de 1 a 100?',
      opciones: [
        { id: 'c', texto: '192', correcta: true },
        { id: 'todas-dos', texto: '200', error: 'AT-BLOQUE', siFuera: 'Sería cierto si todas tuvieran dos cifras. De 1 a 9 tienen una.' },
        { id: 'sin-cien', texto: '189', error: 'AT-CONTEO', siFuera: '189 llega hasta la página 99; falta la página 100, con 3 cifras.' },
        { id: 'tres', texto: '300', error: 'AT-BLOQUE', siFuera: 'Solo la página 100 tiene tres cifras.' },
      ],
      dibujo: { datos: tirasPaginas(100, 220, false), estado: {} },
      revelar: { datos: tirasPaginas(100, 220), estado: {} },
      coincide: 'Coincide: 9 + 180 + 3 = 192.',
    },
    mira: {
      pieza: 'arit-tabla',
      datos: tablaBloquesPasos(100),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'De 1 a 9: nueve páginas de una cifra.', ecuacion: ['9 · 1 = 9'] },
        { estado: { paso: 2, fila: 1 }, texto: 'De 10 a 99: 90 páginas de dos cifras.', ecuacion: ['(99 − 10 + 1) · 2 = 180'] },
        { estado: { paso: 3, fila: 2 }, texto: 'La página 100 sola tiene tres cifras.', ecuacion: ['1 · 3 = 3'] },
        { estado: { paso: 4, fila: 3 }, texto: 'Se suman los bloques.', ecuacion: ['9 + 180 + 3 = ', { v: 'c-d', t: '192' }] },
      ],
    },
    regla: {
      texto: 'Los números de k cifras en base b van de bᵏ⁻¹ a bᵏ − 1. Se cuenta cada bloque por separado: cantidad por cifras.',
      ecuacion: [{ llave: ['(', b, ' − 1) · ', { sup: [b, 'k−1'] }], nota: 'los de k cifras', color: 'c-o' }, '   ·   ', 'de a hasta z: z − a + 1'],
      condicion: 'la primera cifra no es 0. Un bloque cortado se cuenta desde su primer número hasta la última página.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» (cifras de un libro y numerales de k cifras), con otras
    // semillas y la misma tabla de bloques.
    resuelve: {
      pieza: 'arit-tabla',
      generar(s) {
        const q = azar(s + 900);
        if (s % 2 === 1) {
          const base = q.ent(2, 9), k = q.ent(2, 4), n = (base - 1) * base ** (k - 1), B = { v: 'c-o', t: String(base) };
          const menor = '1' + '0'.repeat(k - 1), mayor = String(base - 1).repeat(k), a = valor(menor, base), z = valor(mayor, base);
          return {
            enunciado: ['¿Cuántos números de ', `${k} cifras hay en base `, B, '?'],
            pasos: [
              { tipo: 'pide', texto: ['Piden cuántos numerales distintos de ', `${k} cifras se pueden escribir en base `, B, '.'] },
              { tipo: 'datos', texto: `En base ${base} las cifras van de 0 a ${base - 1}: hay ${base} cifras para elegir en cada lugar.` },
              { tipo: 'regla', texto: 'La primera cifra no puede ser 0; las demás sí. Multiplico cuántas opciones tiene cada lugar.' },
              { tipo: 'cuentas', texto: `La primera cifra tiene ${base - 1} ${base === 2 ? "opción" : "opciones"}, y ${k === 2 ? "la otra" : `cada una de las otras ${k - 1}`} tiene ${base}.`,
                ecuacion: ['(', B, ` − 1) · ${base}${sup(k - 1)} = ${base - 1} · ${f(base ** (k - 1))} = `, { v: 'c-d', t: f(n) }] },
              { tipo: 'sentido', texto: `De vuelta, contando de a hasta z: van de (${menor})${subi(base)} = ${f(a)} hasta (${mayor})${subi(base)} = ${f(z)}.`,
                ecuacion: [`${f(z)} − ${f(a)} + 1 = `, { v: 'c-d', t: f(z - a + 1) }] },
            ],
            respuesta: ['Hay ', { v: 'c-d', t: f(n) }, ` números de ${k} cifras.`],
          };
        }
        const P = q.ent(110, 600), bl = bloques(P), t = totalCifras(P);
        return {
          enunciado: `¿Cuántas cifras se usan para numerar las páginas de un libro de 1 a ${P}?`,
          dibujo: { datos: tablaBloques(P, 0), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden cuántas cifras se escriben en total al numerar de la página 1 a la ${P}.` },
            { tipo: 'datos', texto: `La última página, ${P}, tiene tres cifras. Entonces hay páginas de una, de dos y de tres cifras.` },
            { tipo: 'regla', texto: 'Separo las páginas en bloques según cuántas cifras tienen. En cada bloque multiplico cuántas páginas hay por las cifras de cada una.' },
            { tipo: 'cuentas', texto: bl.map(x => `de ${x.a} a ${x.z} hay ${x.cuantos}`).join('; ').replace(/^d/, 'D') + '.',
              ecuacion: [bl.map(x => `${x.cuantos}·${x.k}`).join(' + '), ' = ', bl.map(x => f(x.cifras)).join(' + '), ' = ', { v: 'c-d', t: f(t) }],
              dibujo: { datos: tablaBloques(P), estado: {} } },
            { tipo: 'sentido', texto: `Si todas tuvieran tres cifras serían 3 · ${P} = ${f(3 * P)}. Da menos porque las 99 primeras gastan menos. Cuadra.` },
          ],
          respuesta: ['Se usan ', { v: 'c-d', t: f(t) }, ' cifras.'],
        };
      },
    },
    ahoraTu: {
      pieza: 'arit-tabla',
      generar(s) {
        const q = azar(s);
        if (s % 2 === 1) {
          const base = q.ent(2, 9), k = q.ent(2, 4), n = (base - 1) * base ** (k - 1);
          return {
            pregunta: ['¿Cuántos números de ', `${k} cifras hay en base `, { v: 'c-o', t: String(base) }, '?'],
            opciones: opciones(n, [
              { id: 'todos', valor: base ** k, error: 'AT-CERO', siFuera: 'Eso admite el 0 como primera cifra.' },
              { id: 'sin-mas1', valor: n - 1, error: 'AT-CONTEO', siFuera: 'De a hasta z hay z − a + 1 números, no z − a.' },
              { id: 'diez', valor: 9 * 10 ** (k - 1), error: 'AT-DECIMAL', siFuera: 'Esa es la cuenta en base 10.' },
            ], x => f(x)),
            solucion: { texto: `La primera cifra tiene ${base - 1} opciones; las otras, ${base} cada una.`, ecuacion: [`(${base} − 1) · ${base}${sup(k - 1)} = ${f(n)}`] },
          };
        }
        const P = q.ent(110, 600), t = totalCifras(P);
        return {
          pregunta: `¿Cuántas cifras se usan para numerar las páginas de un libro de 1 a ${P}?`,
          dibujo: { datos: tablaBloques(P, 0), estado: {} },
          opciones: opciones(t, [
            { id: 'tres', valor: 3 * P, error: 'AT-BLOQUE', siFuera: 'No todas las páginas tienen tres cifras.' },
            { id: 'sin-mas1', valor: t - 3, error: 'AT-CONTEO', siFuera: `Del 100 al ${P} hay ${P - 99} páginas, no ${P - 100}.` },
            { id: 'sin-unidades', valor: t - 9, error: 'AT-BLOQUE', siFuera: 'Falta el bloque de 1 a 9.' },
          ], x => f(x)),
          solucion: { texto: 'Bloques de 1, 2 y 3 cifras.', ecuacion: [`9 + 180 + ${P - 99} · 3 = ${f(t)}`], dibujo: { datos: tablaBloques(P), estado: {} } },
        };
      },
    },
  };

  // Fichas del laboratorio: tamaño fijo de 16 (con 40 fichas en base 4 son 10 filas), para que el borde de la fila
  // quede en centro + b · 16 / 2 en todos los casos.
  const fichasLab = (n, base) => {
    const q = Math.floor(n / base), s = n % base;
    // Colores de la unidad (idea 1 rehecha): las filas llenas, grupos de n, en turquesa; las sueltas en tinta (antes, carmín).
    return { bloques: [{ n, columnas: base, color: 'i', marcoFilas: true, rotulo: `${n} = ${numT(enBase(n, base), base)}`, tramos: s ? [{ de: n - s, a: n - 1, color: 't' }] : [] }], altoMax: 160, ficha: 16, alt: `${n} fichas en filas de ${base}: ${q} grupos completos y ${s} sueltas` };
  };

  // Mesa 3D (ronda 4, docs/3d.md, 3D de contexto): los bloques de base b. Una barra son b cubitos, una placa son b
  // barras y un cubo son b placas: el tercer lugar ya no cabe en el plano.
  // Cambia: la base y cuántas piezas hay de cada clase · Permanece: cada pieza armada con b piezas de la anterior ·
  // Progresa: el valor en base 10 · Se reserva: el naranja, para una clase con b piezas o más (se puede canjear) ·
  // Debe verse: un numeral es lo que queda cuando ya no se puede canjear nada. Cuánto vale y si es numeral: MN.estado.
  const sub = subi;
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
      grupos.push({ nombre: PIEZAS[k][1], color: lleno ? 'c-o' : 'c-i', rotulo: String(n), rotuloEn: [x0 + (k ? b : 1) / 2, -1.2, 0],
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
      alt: `Bloques de base ${b}: ${PIEZAS.map(([id, pl]) => `${v[id]} ${pl}`).reverse().join(', ')}; valen ${e.fichas}` + (e.normal ? `, el numeral (${e.texto})${sub(b)}.` : '; todavía se puede canjear.') };
  }
  const mesaBloques = {
    id: 'bloques-base', titulo: 'Bloques de base b', pieza: 'ari-cubitos-3d',
    consigna: 'Una barra son b cubitos; una placa, b barras; un cubo, b placas. Gira las piezas y canjea las que lleguen a b.',
    // 9 · 3 · 9 · 9 · 9 = 19 683 casos: «Muéstrame» recorre toda la grilla (con más de 20 000 solo mira una muestra).
    controles: [
      { id: 'b', etiqueta: 'b', color: 'c-o', min: 2, max: 10, paso: 1, inicio: 4, decimales: 0 },
      { id: 'm', etiqueta: 'cubos', color: 'c-i', min: 0, max: 2, paso: 1, inicio: 0, decimales: 0 },
      { id: 'c', etiqueta: 'placas', color: 'c-i', min: 0, max: 8, paso: 1, inicio: 1, decimales: 0 },
      { id: 'd', etiqueta: 'barras', color: 'c-i', min: 0, max: 8, paso: 1, inicio: 2, decimales: 0 },
      { id: 'u', etiqueta: 'unidades', color: 'c-i', min: 0, max: 8, paso: 1, inicio: 5, decimales: 0 },
    ],
    dibujo: v => ({ datos: datosBloques(v), estado: {} }),
    lectura: v => { const e = bloquesDe(v); return e.normal ? [`(${e.texto})${sub(v.b)} = `, { v: 'c-d', t: String(e.fichas) }] : [`Valen `, { v: 'c-d', t: String(e.fichas) }, ': aún se puede canjear']; },
    invitaciones: [
      { texto: 'En base 4, arma 23 sin que ninguna clase llegue a 4 piezas.',
        logrado: v => v.b === 4 && bloquesDe(v).normal && bloquesDe(v).fichas === 23,
        testigo: [{ b: 4, m: 0, c: 1, d: 1, u: 3 }],
        bien: '23 = (113)₄: una placa, una barra y tres unidades.',
        pista: 'Junta 4 unidades en una barra y 4 barras en una placa.' },
      { texto: 'Arma el mayor número de tres cifras en base 5.',
        logrado: v => v.b === 5 && v.m === 0 && bloquesDe(v).texto === '444',
        bien: '(444)₅ = 124: con una unidad más se completa el cubo, 5³ = 125.',
        pista: 'En base 5 ninguna cifra llega a 5: pon 4 de cada pieza.' },
      { texto: 'En base 2, arma 13 con un cubo.',
        logrado: v => v.b === 2 && v.m === 1 && bloquesDe(v).normal && bloquesDe(v).fichas === 13,
        testigo: [{ b: 2, m: 1, c: 1, d: 0, u: 1 }],
        bien: '13 = 8 + 4 + 1 = (1101)₂: cada pieza va una vez o no va.',
        pista: 'El cubo vale 8. ¿Qué piezas de 4, 2 y 1 faltan para 13?' },
      { texto: 'En base 10, arma un numeral de tres cifras que copie la cantidad.',
        logrado: v => v.b === 10 && bloquesDe(v).normal && bloquesDe(v).fichas >= 100 && bloquesDe(v).texto === String(bloquesDe(v).fichas),
        bien: 'Solo en base 10 las cifras copian la cantidad: (100)₄ es apenas 16.',
        pista: 'Sube b a 10 y pon al menos una placa.' },
      { texto: 'Guarda la misma cantidad dos veces: como numeral y sin canjear.',
        logrado: (v, g) => g.some(x => g.some(y => x.b === y.b && bloquesDe(x).fichas === bloquesDe(y).fichas && bloquesDe(x).normal && !bloquesDe(y).normal)),
        testigo: [{ b: 4, m: 0, c: 1, d: 3, u: 1 }, { b: 4, m: 0, c: 1, d: 2, u: 5 }],
        bien: 'Canjear no cambia cuánto hay: cambia cuántas piezas lo dicen.',
        pista: 'Guarda un numeral; luego abre una barra en b unidades y guarda otra vez.' },
    ],
  };

  return {
    unidad: 'aritmetica.numeracion',
    version: '0.3.0',
    // Un color fijo por magnitud (cabecera); lo comprueba numeracion.test.js.
    colores: COLORES,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-puesto.js', '/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-tiras.js', '/plantillas/numeracion/motor.js', '/nucleo/kit/piezas/ari-cubitos-3d.js'],
    // Glosario: las palabras que esta unidad estrena en el curso (docs/teoria.md §4d).
    glosario: [
      { termino: 'sistema de numeración', def: 'Conjunto de símbolos y reglas para escribir y leer cualquier número.',
        formas: ['sistema de numeración', 'sistemas de numeración'], ver: ['base de numeración', 'cifra'] },
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
        ejemplos: ['13 caramelos en bolsitas de 5 se anotan 23₍₅₎.', 'Veinticuatro se escribe 24 en base 10 y 40₍₆₎ en base 6.', '23₍₅₎ se lee «dos, tres en base cinco», no «veintitrés».'] },
      // «orden» es local: en otras unidades del curso la palabra dice otra cosa (el orden importa, en combinatoria).
      { termino: 'orden', local: true, def: 'Cada tamaño de grupo al escribir un número: unidades sueltas, grupos, grupos de grupos.',
        simple: 'Cada tamaño de paquete: sueltos, bolsitas, cajas.', formas: ['orden', 'órdenes'],
        ejemplos: ['En el puesto: los sueltos, las bolsitas y las cajas.', 'En base 10: unidades, decenas y centenas.', 'En 100₍₅₎ hay tres: 1 caja, 0 bolsitas y 0 sueltos.'] },
      { termino: 'potencia', def: 'Resultado de multiplicar un número por sí mismo varias veces; el exponente dice cuántas.',
        ejemplo: '4² = 4 · 4 = 16 y 2³ = 2 · 2 · 2 = 8.' },
      { termino: 'descomposición polinómica', def: 'Escribir un numeral como suma de cada cifra por la potencia de la base de su lugar.',
        ejemplo: '(132)₄ = 1 · 16 + 3 · 4 + 2 = 30.', ver: ['potencia', 'numeral'] },
      { termino: 'resto', simbolo: 'r', def: 'Lo que sobra al dividir sin pasarse: es menor que el divisor y puede ser 0.',
        ejemplo: '19 entre 3: cociente 6 y sobra 1, porque 3 · 6 + 1 = 19.' },
      { termino: 'cambio de base', def: 'Escribir el mismo número en otra base: se divide entre la nueva base y se leen los restos.',
        ejemplo: '19 = (201)₃, porque los restos salen 1, 0 y 2.', ver: ['resto', 'base de numeración'] },
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
        lectura: v => [`De 1 a ${v.P}: `, { v: 'c-d', t: String(totalCifras(v.P)) }, ' cifras'],
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
    ideas: [agrupar, descomposicion, cambio, conteo],
  };
});
