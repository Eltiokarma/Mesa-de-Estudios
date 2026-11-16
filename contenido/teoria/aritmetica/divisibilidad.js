/*
 * Teoría de «Divisibilidad» (aritmetica.divisibilidad). Molde: docs/teoria.md; modelo de forma: porcentajes.js.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 13) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: los AT-* son hipótesis nuevas (la matriz marca «aplicar un criterio en otra base» y «dividir una congruencia»).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver la divisibilidad como filas que se llenan sin sobrar, y los restos como lo único que hay que seguir.
 *   Persona y condiciones: postulante de 3.º, celular de 360 px, sin calculadora.
 *   Resultado observable: halla restos de sumas, productos y potencias, explica un criterio y decide si ax + by = c tiene enteros.
 *   Orden de atención: 1.º la figura (fichas o tabla) · 2.º el sobrante en rojo · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué la suma de cifras dice el resto entre 9, y por qué 2⁵⁰ no hay que calcularlo?».
 * Colores (regla 4): el número n naranja (c-o), el divisor o módulo m turquesa (c-i), el resto r rojo (c-h), el resultado verde (c-d).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const n_ = { v: 'c-o', t: 'n' }, m = { v: 'c-i', t: 'm' }, r = { v: 'c-h', t: 'r' }, a = { v: 'c-o', t: 'a' };
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
    return Object.assign({ bloques: [{ n: nv, columnas: mv, color: 'o', marcoFilas: true, rotulo: rv ? `${nv} = ${mv}·${Math.floor(nv / mv)} + ${rv}` : `${nv} = ${mv}·${nv / mv}`, tramos: rv ? [{ de: nv - rv, a: nv - 1, color: 'h' }] : [] }], altoMax: 160, ficha: 24, alt: `${nv} fichas en filas de ${mv}: ${Math.floor(nv / mv)} filas llenas${rv ? ` y sobran ${rv}` : ', no sobra ninguna'}` }, extra);
  };

  // ---------- Idea 1: filas de m sin sobrante (múltiplos y divisores) ----------
  // Cambia: n y el largo de fila m. Permanece: el tamaño de la ficha.
  // Progresa: filas llenas → sobrante. Se reserva: un número que parece primo y se acomoda justo.
  // Debe verse: m divide a n cuando no sobra ninguna ficha.
  const arrastresFilas = (nMin, nMax, mMin, mMax, extra) => [
    { id: 'ultima', etiqueta: 'última ficha (cuántas hay)', color: 'c-o',
      donde: v => ultima(filas(v.n, v.m, extra), 0, v.n),
      mover: (pt, v) => ({ n: masCerca(rango(nMin, nMax), c => ultima(filas(c, v.m, extra), 0, c), pt) }) },
    { id: 'fila', etiqueta: 'borde de la primera fila (su largo)', color: 'c-i',
      donde: v => bordeFila(filas(v.n, v.m, extra), 0),
      mover: (pt, v) => ({ m: masCerca(rango(mMin, Math.min(mMax, v.n)), c => ({ x: bordeFila(filas(v.n, c, extra), 0).x, y: pt.y }), pt) }) },
  ];
  const multiplos = {
    id: 'filas-de-m',
    titulo: 'Filas de m sin sobrante',
    temas: ['Múltiplos y divisores'],
    pieza: 'arit-fichas',
    lee: {
      tarjetas: [
        { titulo: 'Repartir sin que sobre', texto: 'En la feria de Juliaca, una vendedora acomoda 24 panes en bolsas de 6 y no le queda ninguno suelto. Con bolsas de 5, le quedarían 4 panes sueltos. De eso trata esta idea: de lo que sobra.' },
        { titulo: 'Divisor y múltiplo', texto: ['Si las fichas se reparten en filas de ', m, ' sin sobrante, decimos que ', m, ' divide a ', n_, '. También se dice que ', m, ' es divisor de ', n_, ' y que ', n_, ' es múltiplo de ', m, '.'],
          ecuacion: [m, ' | ', n_, '   se lee   «', m, ' divide a ', n_, '»'] },
        { titulo: 'Qué mirar', texto: 'Al jugar, cambia el largo de la fila y mira las fichas rojas: son las que no completan una fila. Busca un número de fichas que se llene con varios largos distintos.' },
      ],
    },
    juega: {
      consigna: 'Elige cuántas fichas hay y el largo de cada fila. Las rojas son las que sobran.',
      voz: 'Busca un largo de fila que no deje rojas.',
      controles: [
        { id: 'n', etiqueta: 'n', color: 'c-o', min: 12, max: 40, paso: 1, inicio: 24, decimales: 0 },
        { id: 'm', etiqueta: 'm', color: 'c-i', min: 2, max: 9, paso: 1, inicio: 5, decimales: 0 },
      ],
      dibujo: v => ({ datos: filas(v.n, v.m, ARRIBA), estado: {} }),
      lectura: v => (v.n % v.m ? [m, ` no divide a ${v.n}: sobran `, { v: 'c-h', t: String(v.n % v.m) }] : [m, ` = ${v.m} divide a ${v.n}: no sobra nada`]),
      minimo: 3,
      // La última ficha (cuántas hay) y el borde de la primera fila (su largo).
      arrastres: arrastresFilas(12, 40, 2, 9, ARRIBA),
    },
    predice: {
      pregunta: ['Se acomodan ', { v: 'c-o', t: '91' }, ' fichas en filas de ', { v: 'c-i', t: '7' }, '. ¿Cuántas sobran?'],
      opciones: [
        { id: 'c', texto: 'Ninguna', correcta: true },
        { id: 'uno', texto: 'Sobra 1', error: 'AT-PRIMO', siFuera: '91 parece primo, pero 7 · 13 = 91. Probar es más seguro que parecer.' },
        { id: 'tres', texto: 'Sobran 3', error: 'AT-PRIMO', siFuera: 'Sobrarían 3 con 94 fichas. 7 · 13 = 91 exacto.' },
        { id: 'seis', texto: 'Sobran 6', error: 'AT-PRIMO', siFuera: 'Sobrarían 6 con 97 fichas.' },
      ],
      dibujo: { datos: filas(91, 7, { bloques: [{ n: 91, columnas: 7, color: 'o', rotulo: '91 en filas de 7' }] }), estado: {} },
      revelar: { datos: filas(91, 7), estado: {} },
      coincide: 'Coincide: 13 filas llenas de 7.',
    },
    mira: {
      datos: { bloques: [
        { n: 70, columnas: 7, color: 'o', marcoFilas: true, rotulo: '70 = 7·10' },
        { n: 21, columnas: 7, color: 'd', marcoFilas: true, rotulo: '21 = 7·3', paso: 1 },
      ], altoMax: 160, ficha: 24, alt: '70 fichas en 10 filas de 7 y 21 fichas en 3 filas de 7' },
      pasos: [
        { estado: { paso: 0 }, texto: '70 fichas llenan 10 filas de 7.', ecuacion: ['70 = 7 · 10'] },
        { estado: { paso: 1 }, texto: 'Las 21 que faltan para 91 llenan 3 filas más.', ecuacion: ['21 = 7 · 3'] },
        { estado: { paso: 1 }, texto: 'En total, 13 filas y ninguna suelta: 7 divide a 91.', ecuacion: ['91 = 7 · 13'] },
      ],
    },
    regla: {
      texto: 'm divide a n cuando n se reparte en filas de m sin sobrante: n es m por un entero. Así, n es múltiplo de m.',
      ecuacion: [{ llave: [m, ' | ', n_], nota: 'm divide n', color: 'c-i' }, '  ⇔  ', n_, ' = ', m, ' · k', '   ·   ', 'k entero'],
      condicion: 'm ≠ 0. Que un número «parezca primo» no prueba nada: se prueba dividiendo.',
    },
    // Así se resuelve (fase 2): el mismo tipo de problema de «Ahora tú», con otras semillas, resuelto paso a paso.
    resuelve: {
      generar(s) {
        const g = azar(s + 900), mv = g.ent(3, 13), k = g.ent(8, 30), rv = s % 3 === 0 ? 0 : g.ent(1, mv - 1), nv = mv * k + rv;
        const N = { v: 'c-o', t: String(nv) }, M = { v: 'c-i', t: String(mv) }, R = { v: 'c-h', t: String(rv) };
        return {
          enunciado: ['Se acomodan ', N, ' fichas en filas de ', M, '. ¿Cuántas fichas sobran?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden cuántas fichas quedan sueltas, sin completar una fila de ', M, '.'] },
            { tipo: 'datos', texto: ['Hay ', N, ' fichas en total y cada fila lleva ', M, '.'] },
            { tipo: 'regla', texto: ['Lo que sobra es el resto de dividir entre el largo de la fila. Siempre es menor que ese largo. Si sale 0, ', m, ' divide a ', n_, '.'],
              ecuacion: [n_, ' = ', m, ' · k + ', r, '   ·   ', '0 ≤ ', r, ' < ', m] },
            { tipo: 'cuentas', texto: ['Busco cuántas filas llenas caben: el mayor múltiplo de ', M, ` que no pasa de ${nv} es ${mv} · ${k} = ${mv * k}.`],
              ecuacion: [N, ' = ', M, ` · ${k} + `, R] },
            { tipo: 'sentido', texto: rv === 0
              ? [`Compruebo: ${mv} · ${k} = ${mv * k}, justo el total. No sobra nada: `, M, ' divide a ', N, '.']
              : [`Compruebo: ${mv} · ${k} + ${rv} = ${mv * k + rv}, el total. Y `, R, ' es menor que ', M, ': no alcanza para otra fila.'] },
          ],
          respuesta: rv === 0 ? 'No sobra ninguna ficha' : rv === 1 ? 'Sobra 1 ficha' : `Sobran ${rv} fichas`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), mv = g.ent(3, 13), k = g.ent(8, 30), rv = s % 3 === 0 ? 0 : g.ent(1, mv - 1), nv = mv * k + rv;
        return {
          pregunta: ['Se acomodan ', { v: 'c-o', t: String(nv) }, ' fichas en filas de ', { v: 'c-i', t: String(mv) }, '. ¿Cuántas sobran?'],
          opciones: opciones(rv, [
            { id: 'faltan', valor: rv ? mv - rv : 1, error: 'AT-EXCESO', siFuera: rv ? 'Eso es lo que falta para otra fila, no lo que sobra.' : 'Prueba la división: la última fila se llena.' },
            { id: 'filas', valor: k, error: 'AT-COCIENTE', siFuera: 'Ese es el número de filas llenas, no lo que sobra.' },
            { id: 'uno-mas', valor: (rv + 1) % mv, error: 'AT-CONTEO', siFuera: 'Cuenta de nuevo: multiplica filas por largo y resta.' },
          ], x => (x === 0 ? 'Ninguna' : `${x}`)),
          solucion: { texto: `${k} filas llenas de ${mv}.`, ecuacion: [`${nv} = ${mv} · ${k} + `, { v: 'c-h', t: String(rv) }] },
        };
      },
    },
  };

  // ---------- Idea 2: los restos se suman y se multiplican (teoremas de la divisibilidad) ----------
  // Cambia: a, b y el divisor. Permanece: el formato de filas de m.
  // Progresa: sobrante de a, sobrante de b, sobrante de la suma. Se reserva: los sobrantes juntos llenan otra fila.
  // Debe verse: el resto de a + b sale de juntar solo los sobrantes.
  const juntar = (av, bv, mv) => ({ bloques: [
    { n: av, columnas: mv, color: 'o', marcoFilas: true, rotulo: `a: ${av % mv}`, tramos: av % mv ? [{ de: av - (av % mv), a: av - 1, color: 'h' }] : [] },
    { n: bv, columnas: mv, color: 'i', marcoFilas: true, rotulo: `b: ${bv % mv}`, tramos: bv % mv ? [{ de: bv - (bv % mv), a: bv - 1, color: 'h' }] : [] },
    // Los sobrantes juntos, en filas de m; los huecos punteados completan la fila (el bloque mide m de ancho siempre).
    { n: (av % mv) + (bv % mv), columnas: mv, color: 'h', marcoFilas: true, rotulo: `juntos: ${(av % mv) + (bv % mv)}`, paso: 1, huecos: ((av % mv) + (bv % mv)) % mv ? mv - (((av % mv) + (bv % mv)) % mv) : 0, huecosPaso: 1 },
  ], altoMax: 130, ficha: 22, arriba: true, alt: `a = ${av} y b = ${bv} en filas de ${mv}; sus sobrantes juntos son ${(av % mv) + (bv % mv)}` });
  // Manijas en la última ficha de a y de b (los bloques cuelgan de arriba).
  const arrastresJuntar = (lo, hi, mDe) => [
    { id: 'a', etiqueta: 'última ficha de a', color: 'c-o',
      donde: v => ultima(juntar(v.a, v.b, mDe(v)), 0, v.a),
      mover: (pt, v) => ({ a: masCerca(rango(lo, hi), c => ultima(juntar(c, v.b, mDe(v)), 0, c), pt) }) },
    { id: 'b', etiqueta: 'última ficha de b', color: 'c-i',
      donde: v => ultima(juntar(v.a, v.b, mDe(v)), 1, v.b),
      mover: (pt, v) => ({ b: masCerca(rango(lo, hi), c => ultima(juntar(v.a, c, mDe(v)), 1, c), pt) }) },
  ];
  const teoremas = {
    id: 'restos-suman',
    titulo: 'Los restos se suman y multiplican',
    temas: ['Teoremas de la divisibilidad'],
    pieza: 'arit-fichas',
    lee: {
      tarjetas: [
        { titulo: 'Lo que queda suelto', texto: 'En el mercado de Puno, los huevos se venden por docenas. Con 30 huevos se arman 2 docenas y quedan 6 sueltos. Ese 6 es el resto de dividir 30 entre 12.',
          ecuacion: ['30 = 12 · 2 + ', { v: 'c-h', t: '6' }] },
        { titulo: 'Congruentes', texto: 'Dos números que dejan el mismo resto al dividirlos entre m son congruentes. El 17 y el 2 dejan resto 2 entre 5. Se lee «17 es congruente con 2, módulo 5».',
          ecuacion: ['17 ≡ 2  (mód 5)'] },
        { titulo: 'Qué mirar', texto: 'Al jugar, sigue solo las fichas rojas de a y de b. El bloque de la derecha las junta en filas de 5. Compara lo que le sobra a ese bloque con el resto de a + b.' },
      ],
    },
    juega: {
      consigna: 'Dos montones, a y b, en filas de 5. A la derecha se juntan solo sus sobrantes.',
      voz: 'Compara el sobrante de a + b con los dos sobrantes juntos.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 6, max: 24, paso: 1, inicio: 13, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 6, max: 24, paso: 1, inicio: 9, decimales: 0 },
      ],
      dibujo: v => ({ datos: juntar(v.a, v.b, 5), estado: { paso: 1 } }),
      lectura: v => [`a + b = ${v.a + v.b} deja resto `, { v: 'c-h', t: String((v.a + v.b) % 5) }, ` · ${v.a % 5} + ${v.b % 5} → `, { v: 'c-h', t: String(((v.a % 5) + (v.b % 5)) % 5) }],
      minimo: 3,
      arrastres: arrastresJuntar(6, 24, () => 5),
    },
    predice: {
      pregunta: ['a deja resto 4 al dividirlo entre ', { v: 'c-i', t: '7' }, ', y b deja resto 5. ¿Qué resto deja a · b entre 7?'],
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'veinte', texto: '20', error: 'AT-RESTO-MAYOR', siFuera: '20 es 4 · 5, pero un resto entre 7 es menor que 7. Falta reducirlo.' },
        { id: 'suma', texto: '2', error: 'AT-SUMA', siFuera: '2 es el resto de a + b. Aquí se pide el producto.' },
        { id: 'nose', texto: 'Depende de a y b', error: 'AT-DEPENDE', siFuera: 'Sería cierto si solo se supiera a + b. El producto de los restos ya decide.' },
      ],
      dibujo: { datos: juntar(11, 12, 7), estado: { paso: 0 } },
      revelar: { datos: { bloques: [{ n: 20, columnas: 7, color: 'h', marcoFilas: true, rotulo: '4 · 5 = 20 = 7·2 + 6', tramos: [{ de: 14, a: 19, color: 'd' }] }], altoMax: 130, ficha: 22, alt: '20 fichas en filas de 7: dos filas llenas y sobran 6' }, estado: {} },
      coincide: 'Coincide: 4 · 5 = 20 y 20 = 7 · 2 + 6.',
    },
    mira: {
      datos: juntar(11, 12, 7),
      pasos: [
        { estado: { paso: 0 }, texto: 'a = 11 deja 4 sueltas; b = 12 deja 5 sueltas.', ecuacion: ['11 = 7·1 + 4 · 12 = 7·1 + 5'] },
        { estado: { paso: 1 }, texto: 'En a + b, las filas llenas siguen llenas. Solo importan las sueltas.', ecuacion: ['4 + 5 = 9 = 7 + ', { v: 'c-h', t: '2' }] },
        { estado: { paso: 1 }, texto: 'En el producto pasa igual: se multiplican los restos y se reduce.', ecuacion: ['4 · 5 = 20 = 7·2 + ', { v: 'c-h', t: '6' }] },
      ],
    },
    regla: {
      texto: 'Si m divide a dos números, divide a cualquier suma de sus múltiplos. Por eso, para el resto de una suma o producto, basta operar los restos.',
      ecuacion: [a, ' ≡ ', { llave: [r], nota: 'resto de a', color: 'c-h' }, ',  b ≡ s  (mód ', m, ')', '   ·   ', 'a + b ≡ ', r, ' + s', '   ·   ', 'ab ≡ ', r, 's'],
      condicion: 'al final se reduce otra vez entre m. No se puede dividir una congruencia entre cualquier número.',
    },
    resuelve: {
      generar(s) {
        const g = azar(s + 900), mv = g.ent(5, 13), ra = g.ent(2, mv - 1), rb = g.ent(2, mv - 1), prod = s % 2 === 0;
        const op = prod ? ra * rb : ra + rb, v = op % mv, signo = prod ? ' · ' : ' + ', que = prod ? 'a · b' : 'a + b';
        const M = { v: 'c-i', t: String(mv) }, RA = { v: 'c-h', t: String(ra) }, RB = { v: 'c-h', t: String(rb) }, V = { v: 'c-h', t: String(v) };
        // Dato de vuelta: dos números concretos con esos restos.
        const aa = mv + ra, bb = 2 * mv + rb, val = prod ? aa * bb : aa + bb;
        return {
          enunciado: ['Un número a deja resto ', RA, ' y otro, b, deja resto ', RB, ' al dividirlos entre ', M, `. ¿Qué resto deja ${que} entre `, M, '?'],
          pasos: [
            { tipo: 'pide', texto: [`Piden el resto de ${que} entre `, M, '. No conozco a ni b, solo sus restos.'] },
            { tipo: 'datos', texto: ['Sé lo que sobra de cada uno al hacer filas de ', M, '.'], ecuacion: [a, ' ≡ ', RA, ',   b ≡ ', RB, '   (mód ', M, ')'] },
            { tipo: 'regla', texto: `Las filas llenas no cambian el resto. Por eso opero solo los restos, ${prod ? 'multiplicándolos' : 'sumándolos'}, y lo que salga lo vuelvo a dividir entre ${mv}.` },
            { tipo: 'cuentas', texto: [`Opero los restos: ${ra}${signo}${rb} = ${op}. ${op >= mv ? `Como ${op} pasa de ${mv}, lo reduzco.` : `Como ${op} es menor que ${mv}, ya es el resto.`}`],
              ecuacion: [RA, signo, RB, ` = ${op} = `, M, ` · ${Math.floor(op / mv)} + `, V] },
            { tipo: 'sentido', texto: [`Pruebo con a = ${aa} y b = ${bb}, que dejan esos restos: ${aa}${signo}${bb} = ${val}, y ${val} entre ${mv} deja `, { v: 'c-h', t: String(val % mv) }, '. Cuadra.'] },
          ],
          respuesta: [`${que} deja resto `, V],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), mv = g.ent(5, 13), ra = g.ent(2, mv - 1), rb = g.ent(2, mv - 1), prod = s % 2 === 0;
        const v = prod ? (ra * rb) % mv : (ra + rb) % mv;
        return {
          pregunta: ['a deja resto ', { v: 'c-h', t: String(ra) }, ' y b deja resto ', { v: 'c-h', t: String(rb) }, ' al dividirlos entre ', { v: 'c-i', t: String(mv) }, `. ¿Qué resto deja ${prod ? 'a · b' : 'a + b'}?`],
          opciones: opciones(v, [
            { id: 'sin-reducir', valor: prod ? ra * rb : ra + rb, error: 'AT-RESTO-MAYOR', siFuera: `Un resto entre ${mv} es menor que ${mv}: falta reducir.` },
            { id: 'otra', valor: prod ? (ra + rb) % mv : (ra * rb) % mv, error: 'AT-SUMA', siFuera: prod ? 'Ese es el resto de la suma.' : 'Ese es el resto del producto.' },
            { id: 'faltante', valor: mv - v, error: 'AT-EXCESO', siFuera: 'Eso es lo que falta para la siguiente fila.' },
          ]),
          solucion: { texto: 'Se operan los restos y se reduce.', ecuacion: [prod ? `${ra} · ${rb} = ${ra * rb}` : `${ra} + ${rb} = ${ra + rb}`, ` → resto `, { v: 'c-h', t: String(v) }] },
        };
      },
    },
  };

  // ---------- Idea 3: los restos de las potencias se repiten (restos potenciales) ----------
  // Cambia: la base y el módulo. Permanece: la tabla de k = 1 a 8.
  // Progresa: cada potencia es la anterior por a, reducida. Se reserva: el primer resto que se repite.
  // Debe verse: el ciclo; el exponente se reduce con el largo del ciclo.
  const ciclo = (b, k) => { const xs = []; let x = b % k; const visto = new Map(); while (!visto.has(x)) { visto.set(x, xs.length); xs.push(x); x = (x * b) % k; } return { xs, ini: visto.get(x) }; };
  const tablaPot = (b, k, n = 8, pasos) => {
    const c = ciclo(b, k), L = c.xs.length - c.ini;
    const filasT = [];
    for (let e = 1; e <= n; e++) {
      const rv = powmod(b, e, k), enCiclo = e - 1 >= c.ini && (e - 1 - c.ini) < L;
      filasT.push([{ t: `${b}${sup(e)}`, paso: pasos ? e : 0 }, { t: String(rv), color: 'h', resalta: enCiclo, paso: pasos ? e : 0 }]);
    }
    return { columnas: [{ t: 'potencia', color: 'o' }, { t: `resto entre ${k}`, color: 'h' }], filas: filasT, filasMax: n, cabeza: true };
  };
  const lecturaPot = (b, k, e) => { const c = ciclo(b, k); return [`${b}${sup(e)} deja `, { v: 'c-h', t: String(powmod(b, e, k)) }, ` · ciclo de ${c.xs.length - c.ini}${c.xs.length - c.ini <= 6 ? ': ' + c.xs.slice(c.ini).join(', ') : ''}`]; };   // un ciclo largo no cabe en la lectura: la tabla lo muestra
  const arrastrePot = n => ({ id: 'fila', etiqueta: 'fila de la tabla (el exponente)',
    donde: v => manijaFila(tablaPot(v.b, v.k, n), v.e - 1),
    mover: (pt, v) => ({ e: filaEn(tablaPot(v.b, v.k, n), pt.y, n - 1) + 1 }) });
  const potencias = {
    id: 'restos-potenciales',
    titulo: 'Los restos de potencias se repiten',
    temas: ['Restos potenciales'],
    pieza: 'arit-tabla',
    lee: {
      tarjetas: [
        { titulo: 'Lo que se repite', texto: 'Hoy es lunes. ¿Qué día será dentro de 100 días? Nadie cuenta día por día: la semana se repite cada 7 días. Con los restos de las potencias pasa algo parecido.' },
        { titulo: 'Base y exponente', texto: 'En 3⁴ = 81, el 3 es la base y el 4 es el exponente: el 3 se multiplica cuatro veces. Los restos de 3, 3², 3³… entre un mismo divisor se llaman restos potenciales.',
          ecuacion: [{ sup: [{ v: 'c-o', t: '3' }, '4'] }, ' = 3 · 3 · 3 · 3 = 81'] },
        { titulo: 'Qué mirar', texto: 'Al jugar, baja por la tabla y mira la columna roja. Busca el primer resto que vuelve a salir y cuenta cuántas filas hay entre una vez y la otra.' },
      ],
    },
    juega: {
      consigna: 'Elige la base y el divisor. La tabla da el resto de cada potencia; los resaltados forman el ciclo.',
      voz: 'Busca dónde empieza a repetirse la columna roja.',
      controles: [
        { id: 'b', etiqueta: 'base', color: 'c-o', min: 2, max: 9, paso: 1, inicio: 3, decimales: 0 },
        { id: 'k', etiqueta: 'divisor', color: 'c-i', min: 4, max: 9, paso: 1, inicio: 5, decimales: 0 },
        { id: 'e', etiqueta: 'exponente', min: 1, max: 8, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaPot(v.b, v.k), estado: { fila: v.e - 1 } }),
      lectura: v => lecturaPot(v.b, v.k, v.e),
      minimo: 3,
      // Se baja por las potencias arrastrando la fila: el resto de cada una sale del de la anterior.
      arrastres: [arrastrePot(8)],
    },
    predice: {
      pregunta: ['¿Qué resto deja ', { sup: [{ v: 'c-o', t: '2' }, '50'] }, ' al dividirlo entre ', { v: 'c-i', t: '7' }, '?'],
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'posicion', texto: '2', error: 'AT-CICLO', siFuera: '50 entre 3 deja 2: eso dice el lugar en el ciclo. En ese lugar está el 4.' },
        { id: 'uno', texto: '1', error: 'AT-CICLO', siFuera: 'Termina en 1 cuando el exponente es múltiplo de 3. 50 no lo es.' },
      ],
      dibujo: { datos: tablaPot(2, 7, 6, true), estado: { paso: 3 } },
      revelar: { datos: tablaPot(2, 7, 6, true), estado: { paso: 6 } },
      coincide: 'Coincide: 50 = 3 · 16 + 2, y el segundo del ciclo es 4.',
    },
    mira: {
      datos: tablaPot(2, 7, 6, true),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: '2 entre 7 deja 2.', ecuacion: ['2 ≡ 2'] },
        { estado: { paso: 3, fila: 2 }, texto: 'Cada resto es el anterior por 2, reducido: 2, 4, 8 → 1.', ecuacion: [{ sup: ['2', '3'] }, ' = 8 ≡ 1  (mód 7)'] },
        { estado: { paso: 6, fila: [3, 4, 5] }, texto: 'Después de 1 todo se repite: el ciclo mide 3.', ecuacion: ['2, 4, 1, 2, 4, 1, …'] },
        { estado: { paso: 6, fila: 1 }, texto: '50 entre 3 deja 2: toca el segundo del ciclo.', ecuacion: [{ sup: ['2', '50'] }, ' ≡ ', { sup: ['2', '2'] }, ' ≡ ', { v: 'c-h', t: '4' }] },
      ],
    },
    regla: {
      texto: 'Los restos potenciales de a, a², a³, … entre m se repiten en un ciclo. Para aⁿ, se busca el lugar del ciclo con el resto de n entre su largo.',
      ecuacion: [{ sup: [a, 'n'] }, ' ≡ ', { llave: [{ sup: [a, 'n mód L'] }], nota: 'lugar del ciclo', color: 'c-o' }, '  (mód ', m, ')'],
      condicion: 'si n mód L es 0, toca el último del ciclo. El ciclo se comprueba en la tabla, no se supone.',
    },
    resuelve: {
      generar(s) {
        const g = azar(s + 900), b = g.ent(2, 9), k = g.de([5, 7, 9, 11, 13].filter(x => mcd(x, b) === 1));
        const c = ciclo(b, k), L = c.xs.length - c.ini, e = g.ent(20, 99), v = powmod(b, e, k);
        const p = e % L, lugar = p === 0 ? L : p, filasT = Math.min(8, L + 1);
        const B = { v: 'c-o', t: String(b) }, K = { v: 'c-i', t: String(k) }, V = { v: 'c-h', t: String(v) };
        const tabla = fila => ({ datos: tablaPot(b, k, filasT), estado: fila === undefined ? {} : { fila } });
        return {
          enunciado: ['¿Qué resto deja ', { sup: [B, String(e)] }, ' al dividirlo entre ', K, '?'],
          dibujo: tabla(),
          pasos: [
            { tipo: 'pide', texto: ['Piden el resto de ', { sup: [B, String(e)] }, ' entre ', K, '. Es un número enorme: no lo voy a calcular entero.'] },
            { tipo: 'datos', texto: ['La base es ', B, `, el exponente es ${e} y el divisor es `, K, '.'] },
            { tipo: 'regla', texto: 'Cada resto sale del anterior por la base, así que se repiten en ciclo. Cambio el exponente por lo que sobra al dividirlo entre el largo del ciclo.' },
            { tipo: 'cuentas', texto: [`Los restos son ${c.xs.slice(c.ini).join(', ')} y vuelven a empezar: el ciclo mide ${L}. ${p === 0 ? `${e} es múltiplo de ${L}: toca el último.` : `${e} entre ${L} deja ${p}.`}`],
              ecuacion: [`${e} = ${L} · ${Math.floor(e / L)} + ${p}   →   `, { sup: [B, String(e)] }, ' ≡ ', { sup: [B, String(lugar)] }, ' ≡ ', V],
              dibujo: lugar <= filasT ? tabla(lugar - 1) : tabla() },
            { tipo: 'sentido', texto: lugar === L
              ? ['Compruebo: ', { sup: [B, String(L)] }, ` deja ${powmod(b, L, k)}, y cada vuelta del ciclo multiplica por algo que deja 1: el resto no cambia.`]
              : ['Compruebo: ', { sup: [B, String(L)] }, ` deja ${powmod(b, L, k)}, así que cada vuelta del ciclo no cambia el resto. Queda `, { sup: [B, String(lugar)] }, `, que deja ${powmod(b, lugar, k)}.`] },
          ],
          respuesta: [{ sup: [B, String(e)] }, ' deja resto ', V, ' entre ', K],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), b = g.ent(2, 9), k = g.de([5, 7, 9, 11, 13].filter(x => mcd(x, b) === 1));
        const c = ciclo(b, k), L = c.xs.length - c.ini, e = g.ent(20, 99), v = powmod(b, e, k);
        return {
          pregunta: ['¿Qué resto deja ', { sup: [{ v: 'c-o', t: String(b) }, String(e)] }, ' al dividirlo entre ', { v: 'c-i', t: String(k) }, '?'],
          dibujo: { datos: tablaPot(b, k, Math.min(8, L + 1)), estado: {} },
          opciones: opciones(v, [
            { id: 'posicion', valor: e % L, error: 'AT-CICLO', siFuera: 'Eso es el lugar en el ciclo, no el resto.' },
            { id: 'exp', valor: e % k, error: 'AT-CICLO', siFuera: 'Eso reduce el exponente entre el divisor; se reduce entre el largo del ciclo.' },
            { id: 'uno', valor: 1, error: 'AT-CICLO', siFuera: 'Termina en 1 solo si el exponente es múltiplo del largo del ciclo.' },
            { id: 'base', valor: b % k, error: 'AT-CICLO', siFuera: 'Ese es el resto de la primera potencia.' },
          ]),
          solucion: { texto: `El ciclo mide ${L}; ${e} entre ${L} deja ${e % L}.`, ecuacion: [{ sup: [String(b), String(e)] }, ' ≡ ', { v: 'c-h', t: String(v) }, `  (mód ${k})`] },
        };
      },
    },
  };

  // ---------- Idea 4: los criterios salen de lo que deja 10 (criterios de divisibilidad) ----------
  // Cambia: el número y el divisor. Permanece: la tabla cifra · lugar · resto del lugar · aporte.
  // Progresa: cifra por cifra, cada lugar aporta su cifra por el resto de su potencia de 10. Se reserva: entre 9, cada lugar deja 1.
  // Debe verse: el criterio es una consecuencia, no una receta.
  const restoLugar = (e, d) => { const x = powmod(10, e, d); return d === 11 && x === 10 ? -1 : x; };
  const tablaCriterio = (N, d, pasos) => {
    const cs = String(N).split(''), k = cs.length;
    const fs = cs.map((c, i) => {
      const e = k - 1 - i, rl = restoLugar(e, d);
      return [{ t: c, color: 'o', paso: pasos ? i + 1 : 0 }, { t: e ? `10${sup(e)}` : '1', paso: pasos ? i + 1 : 0 }, { t: String(rl).replace('-', '−'), color: 'i', paso: pasos ? i + 1 : 0 }, { t: String(+c * rl).replace('-', '−'), paso: pasos ? i + 1 : 0 }];
    });
    const tot = cs.reduce((acc, c, i) => acc + +c * restoLugar(k - 1 - i, d), 0);
    fs.push(['', '', { t: 'suma', paso: pasos ? k + 1 : 0 }, { t: `${String(tot).replace('-', '−')} → ${mod(tot, d)}`, color: 'h', resalta: true, paso: pasos ? k + 1 : 0 }]);
    return { columnas: [{ t: 'cifra', color: 'o' }, { t: 'lugar' }, { t: `resto ÷ ${d}`, color: 'i' }, { t: 'aporta' }], filas: fs, filasMax: 5 };
  };
  const criterios = {
    id: 'criterios',
    titulo: 'Los criterios salen de 10',
    temas: ['Criterios de divisibilidad'],
    pieza: 'arit-tabla',
    lee: {
      tarjetas: [
        { titulo: 'Cifras en su lugar', texto: 'Un número como 5 877 está hecho de cifras puestas en lugares: 5 millares, 8 centenas, 7 decenas y 7 unidades. Cada lugar vale una potencia de 10.',
          ecuacion: [{ v: 'c-o', t: '5 877' }, ' = 5 · 1 000 + 8 · 100 + 7 · 10 + 7'] },
        { titulo: 'Un atajo con nombre', texto: 'Un criterio de divisibilidad es un atajo: mirando solo las cifras, sabes qué resto deja el número sin hacer la división larga. Cada divisor tiene el suyo.' },
        { titulo: 'Qué mirar', texto: 'Al jugar, mira la columna turquesa: dice qué resto deja cada lugar, 1, 10 o 100, al dividirlo entre el divisor elegido. Cambia el divisor y compara cómo cambia esa columna.' },
      ],
    },
    juega: {
      consigna: 'Elige un número y un divisor. Cada lugar deja un resto al dividirlo entre ese divisor; la tabla suma los aportes.',
      voz: 'Mira la columna turquesa con 9 y con 11.',
      controles: [
        { id: 'N', etiqueta: 'N', color: 'c-o', min: 100, max: 999, paso: 1, inicio: 482, decimales: 0 },
        { id: 'd', etiqueta: 'divisor', opciones: [{ valor: 9, texto: '9' }, { valor: 3, texto: '3' }, { valor: 11, texto: '11' }, { valor: 4, texto: '4' }] },
      ],
      dibujo: v => ({ datos: tablaCriterio(v.N, v.d), estado: {} }),
      lectura: v => [`${v.N} entre ${v.d} deja resto `, { v: 'c-h', t: String(v.N % v.d) }],
      minimo: 3,
    },
    predice: {
      pregunta: ['Las cifras de un número suman ', { v: 'c-o', t: '27' }, '. ¿Qué se puede asegurar?'],
      opciones: [
        { id: 'c', texto: 'Es divisible entre 9', correcta: true },
        { id: 'veintisiete', texto: 'Es divisible entre 27', error: 'AT-CRITERIO', siFuera: 'Sería cierto si 10 dejara resto 1 entre 27. Deja 10: 5 877 no es múltiplo de 27.' },
        { id: 'once', texto: 'Es divisible entre 11', error: 'AT-CRITERIO', siFuera: 'Para 11 se alternan signos; la suma simple no basta.' },
        { id: 'nada', texto: 'No se puede saber nada', error: 'AT-CRITERIO', siFuera: 'Sí se sabe: entre 9, el número y la suma de cifras dejan el mismo resto.' },
      ],
      dibujo: { datos: tablaCriterio(5877, 9, true), estado: { paso: 0 } },
      revelar: { datos: tablaCriterio(5877, 9, true), estado: { paso: 5 } },
      coincide: 'Coincide: 27 deja resto 0 entre 9, y el número también.',
    },
    mira: {
      datos: tablaCriterio(5877, 9, true),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: '1 000 = 999 + 1: entre 9 deja resto 1. El 5 aporta 5.', ecuacion: ['5 · 1 000 ≡ 5 · 1'] },
        { estado: { paso: 4, fila: [1, 2, 3] }, texto: 'Lo mismo con 100, 10 y 1: cada lugar deja 1.', ecuacion: ['10 ≡ 1  (mód 9)'] },
        { estado: { paso: 5, fila: 4 }, texto: 'El número deja el mismo resto que la suma de sus cifras.', ecuacion: ['5 877 ≡ 5 + 8 + 7 + 7 = 27 ≡ ', { v: 'c-h', t: '0' }] },
      ],
    },
    regla: {
      texto: 'Cada criterio sale del resto de 10: entre 9 y 3 deja 1 (suma de cifras); entre 11, −1 (signos alternados); para 2, 4 y 5 bastan las últimas cifras.',
      ecuacion: [{ llave: ['10 ≡ 1'], nota: 'cada lugar' }, ' (mód 9)', '   ·   ', { v: 'c-o', t: 'N' }, ' ≡ suma de cifras'],
      condicion: 'vale para numerales en base 10. En base b, la suma de cifras sirve para b − 1.',
    },
    resuelve: {
      generar(s) {
        const g = azar(s + 900), d = g.de([3, 9, 11, 4]), N = g.ent(1000, 9999), v = N % d;
        const cs = String(N).split('').map(Number), suma = cs.reduce((x, y) => x + y, 0);
        const desdeDer = cs.slice().reverse(), alt = desdeDer.reduce((acc, c, i) => acc + (i % 2 ? -c : c), 0), dos = N % 100;
        const Nn = { v: 'c-o', t: f(N) }, D = { v: 'c-i', t: String(d) }, V = { v: 'c-h', t: String(v) };
        // Lleva un valor x a su resto entre d, con la cuenta a la vista (también si x es negativo).
        const reduce = x => (x < 0 ? [` ${f(x)} + ${-Math.floor(x / d) * d} = `, V] : x < d ? [' → resto ', V] : [` = ${d} · ${Math.floor(x / d)} + `, V]);
        const regla = {
          3: 'Entre 3, el 10 deja resto 1, y también 100 y 1 000. Cada cifra aporta lo que vale: el número deja el resto de la suma de sus cifras.',
          9: 'Entre 9, el 10 deja resto 1, y también 100 y 1 000. Cada cifra aporta lo que vale: el número deja el resto de la suma de sus cifras.',
          11: 'Entre 11, el 10 deja resto −1, porque 10 = 11 − 1. Por eso, desde la derecha, las cifras se suman y se restan alternando.',
          4: 'El 100 es múltiplo de 4, y también 1 000. Los millares y las centenas no dejan nada: solo cuentan las dos últimas cifras.',
        }[d];
        const cuentas = d === 11
          ? { texto: 'Desde las unidades: sumo la cifra de las unidades, resto la de las decenas, sumo la de las centenas y resto la de los millares.',
            ecuacion: [desdeDer.map((c, i) => (i ? (i % 2 ? ` − ${c}` : ` + ${c}`) : String(c))).join(''), ` = ${f(alt)}`, ...reduce(alt)] }
          : d === 4
            ? { texto: `Miro solo las dos últimas cifras: ${String(dos).padStart(2, '0')}. Lo de adelante es un múltiplo de 100 y no deja resto.`, ecuacion: [String(dos), ...reduce(dos)] }
            : { texto: 'Sumo las cifras y reduzco la suma entre el divisor.', ecuacion: [cs.join(' + '), ` = ${suma}`, ...reduce(suma)] };
        cuentas.dibujo = { datos: tablaCriterio(N, d), estado: {} };
        return {
          enunciado: ['Sin hacer la división larga, ¿qué resto deja ', Nn, ' al dividirlo entre ', D, '?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden el resto de ', Nn, ' entre ', D, ', usando solo sus cifras.'] },
            { tipo: 'datos', texto: [`Las cifras son ${cs.join(', ')}, de los millares a las unidades. El divisor es `, D, '.'] },
            { tipo: 'regla', texto: regla },
            Object.assign({ tipo: 'cuentas' }, cuentas),
            { tipo: 'sentido', texto: ['Compruebo con la división completa: da el mismo resto, que es menor que ', D, '.'],
              ecuacion: [Nn, ` = ${d} · ${f(Math.floor(N / d))} + `, V] },
          ],
          respuesta: [Nn, ' deja resto ', V, ' entre ', D],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), d = g.de([3, 9, 11, 4]), N = g.ent(1000, 9999), v = N % d;
        const cs = String(N).split('').map(Number), suma = cs.reduce((x, y) => x + y, 0);
        const alt = cs.reverse().reduce((acc, c, i) => acc + (i % 2 ? -c : c), 0);
        return {
          pregunta: ['¿Qué resto deja ', { v: 'c-o', t: f(N) }, ' al dividirlo entre ', { v: 'c-i', t: String(d) }, '?'],
          opciones: opciones(v, [
            { id: 'suma', valor: d === 11 || d === 4 ? mod(suma, d) : (N % 10) % d, error: 'AT-CRITERIO', siFuera: d === 11 ? 'Entre 11 las cifras se alternan con signo.' : d === 4 ? 'Entre 4 cuentan las dos últimas cifras.' : 'La última cifra sirve para 2 y 5, no para 3 o 9.' },
            { id: 'sin-reducir', valor: d === 11 ? alt : d === 4 ? N % 100 : suma, error: 'AT-RESTO-MAYOR', siFuera: 'Falta reducir: un resto es menor que el divisor.' },
            { id: 'ultima', valor: (N % 100) % d === v ? (v + 1) % d : (N % 100) % d, error: 'AT-CRITERIO', siFuera: 'Revisa qué deja cada lugar entre ese divisor.' },
          ]),
          solucion: { texto: d === 11 ? 'Cifras alternadas desde la derecha.' : d === 4 ? 'Solo cuentan las dos últimas cifras.' : 'La suma de las cifras.', ecuacion: [`${f(N)} ≡ `, { v: 'c-h', t: String(v) }, `  (mód ${d})`], dibujo: { datos: tablaCriterio(N, d), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 5: ¿hay soluciones enteras? (ecuaciones diofánticas lineales) ----------
  // Cambia: a, b y c de ax + by = c. Permanece: la tabla de x = 0, 1, 2, … con su y.
  // Progresa: fila por fila, y entero o no. Se reserva: el mcd que decide de antemano.
  // Debe verse: si mcd(a, b) no divide a c, ninguna fila sale entera.
  const tablaDio = (av, bv, cv) => {
    const fs = [];
    for (let x = 0; x <= 7 && av * x <= cv; x++) {
      const y = (cv - av * x) / bv, ent = Number.isInteger(y);
      fs.push([{ t: String(x), color: 'o' }, { t: ent ? String(y) : f(y, 2), color: ent ? 'd' : undefined, resalta: ent, tenue: !ent }]);
    }
    return { columnas: [{ t: 'x', color: 'o' }, { t: 'y', color: 'd' }], filas: fs, filasMax: 8, cabeza: true, alt: `Valores de y para ax + by = c con x de 0 a ${fs.length - 1}` };
  };
  const diofanticas = {
    id: 'diofanticas',
    titulo: 'Soluciones enteras: manda el mcd',
    temas: ['Ecuaciones diofánticas lineales'],
    pieza: 'arit-tabla',
    lee: {
      tarjetas: [
        { titulo: 'Solo cantidades enteras', texto: 'En la feria de Juliaca, un juego cuesta 4 soles y otro, 6. ¿Se puede gastar justo 22 soles? Nadie compra medio juego: solo valen cantidades enteras.',
          ecuacion: ['4', { v: 'c-o', t: 'x' }, ' + 6', { v: 'c-i', t: 'y' }, ' = 22'] },
        { titulo: 'Un nombre antiguo', texto: 'Una ecuación como 4x + 6y = 22, donde x e y tienen que ser enteros, se llama ecuación diofántica. El nombre viene de Diofanto de Alejandría, que estudió problemas así hace más de 1 700 años.' },
        { titulo: 'Qué mirar', texto: 'Al jugar, la tabla prueba x = 0, 1, 2… y calcula y. Cambia c de uno en uno y mira cuándo aparece una fila resaltada y cuándo no aparece ninguna.' },
      ],
    },
    juega: {
      consigna: 'Elige a, b y c en ax + by = c. La tabla prueba x = 0, 1, 2… y resalta cuando y sale entero.',
      voz: 'Compara el mcd de a y b con c.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 2, max: 9, paso: 1, inicio: 4, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 9, paso: 1, inicio: 6, decimales: 0 },
        { id: 'c', etiqueta: 'c', min: 10, max: 40, paso: 1, inicio: 22, decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDio(v.a, v.b, v.c), estado: {} }),
      lectura: v => [`mcd(${v.a}, ${v.b}) = ${mcd(v.a, v.b)} ${v.c % mcd(v.a, v.b) ? 'no divide' : 'divide'} a ${v.c}`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿La ecuación 6x + 9y = 20 tiene alguna solución con x e y enteros?',
      opciones: [
        { id: 'c', texto: 'No tiene ninguna', correcta: true },
        { id: 'busca', texto: 'Sí, probando se encuentra', error: 'AT-DIOF', siFuera: 'Probar sirve para hallar una; para descartar todas hace falta el mcd.' },
        { id: 'negativos', texto: 'Solo con negativos', error: 'AT-DIOF', siFuera: '6x + 9y es múltiplo de 3 también con negativos; 20 no lo es.' },
        { id: 'infinitas', texto: 'Infinitas', error: 'AT-DIOF', siFuera: 'Sería cierto si 3 dividiera a 20.' },
      ],
      dibujo: { datos: tablaDio(6, 9, 20), estado: { paso: 0 } },
      revelar: { datos: tablaDio(6, 9, 20), estado: { columna: 1 } },
      coincide: 'Coincide: 6x + 9y siempre es múltiplo de 3, y 20 no.',
    },
    mira: {
      datos: tablaDio(6, 9, 21),
      pasos: [
        { estado: { fila: 0 }, texto: '6 y 9 son múltiplos de 3: 6x + 9y también lo es.', ecuacion: ['6x + 9y = 3(2x + 3y)'] },
        { estado: { fila: [] }, texto: '20 no es múltiplo de 3: 6x + 9y = 20 no tiene enteros.', ecuacion: ['mcd(6, 9) = 3 ∤ 20'] },
        { estado: { fila: [2] }, texto: 'Con c = 21 sí: aparece x = 2, y = 1.', ecuacion: ['6 · 2 + 9 · 1 = 21'] },
      ],
    },
    regla: {
      texto: 'La ecuación diofántica ax + by = c tiene soluciones enteras exactamente cuando el mcd de a y b divide a c. Si hay una, hay infinitas.',
      // En tres líneas: a 360 px «hay enteros con ax + by = c» se partía antes de la c.
      ecuacion: [{ llave: ['mcd(', a, ', b) | c'], nota: 'la condición' }, ' ⇔', '   ·   ', a, 'x + by = c', '   ·   ', 'tiene x, y enteros'],
      condicion: 'para x, y naturales o acotados se revisan los límites: el mcd asegura enteros, no positivos.',
    },
    resuelve: {
      generar(s) {
        const g = azar(s + 900), av = g.ent(2, 9), bv = g.ent(av + 1, 12), cv = g.ent(20, 80), dm = mcd(av, bv);
        const A = { v: 'c-o', t: String(av) }, B = { v: 'c-i', t: String(bv) };
        const ec = [A, 'x + ', B, `y = ${cv}`];
        if (s % 2 === 0) {
          const hay = cv % dm === 0;
          // Una solución entera (y puede salir negativa): x de 0 a b − 1 basta, porque x se repite cada b.
          let x0 = null; for (let x = 0; x < bv && x0 === null; x++) if ((cv - av * x) % bv === 0) x0 = x;
          const y0 = x0 === null ? null : (cv - av * x0) / bv, py = y0 < 0 ? `(${f(y0)})` : String(y0);
          return {
            enunciado: ['¿Tiene soluciones enteras la ecuación ', ...ec, '?'],
            pasos: [
              { tipo: 'pide', texto: 'Piden decidir si hay enteros x e y que la cumplan. No hace falta hallarlos todos.' },
              { tipo: 'datos', texto: ['Los coeficientes son ', A, ' y ', B, `, y el término de la derecha es ${cv}.`] },
              { tipo: 'regla', texto: 'Todo divisor común de los coeficientes divide al lado izquierdo, sean cuales sean x e y. Hay enteros solo si su mcd divide al número de la derecha.' },
              { tipo: 'cuentas', texto: `Hallo el mcd y divido ${cv} entre él. ${hay ? 'No sobra nada: lo divide.' : 'Sobra algo: no lo divide.'}`,
                ecuacion: [`mcd(${av}, ${bv}) = ${dm}`, '   ·   ', `${cv} = ${dm} · ${Math.floor(cv / dm)} + ${cv % dm}`] },
              hay
                ? { tipo: 'sentido', texto: `Lo compruebo con una solución: x = ${x0}, y = ${y0}.`, ecuacion: [A, ` · ${x0} + `, B, ` · ${py} = ${av * x0 + bv * y0}`] }
                : { tipo: 'sentido', texto: `El lado izquierdo siempre es múltiplo de ${dm}, con enteros positivos o negativos. ${cv} no lo es: ninguna pareja sirve.`,
                  ecuacion: [A, 'x + ', B, `y = ${dm}(${av / dm === 1 ? '' : av / dm}x + ${bv / dm}y)`] },
            ],
            respuesta: hay ? 'Sí tiene soluciones enteras' : 'No tiene soluciones enteras',
          };
        }
        const sols = []; for (let x = 0; av * x <= cv; x++) if ((cv - av * x) % bv === 0) sols.push([x, (cv - av * x) / bv]);
        const cnt = sols.length, xmax = Math.floor(cv / av);
        const lista = (cnt > 4 ? [...sols.slice(0, 3), null, sols[cnt - 1]] : sols).map(p => (p ? `(${p[0]}, ${p[1]})` : '…')).join('  ');
        return {
          enunciado: [`Entradas de ${av} y de ${bv} soles suman ${cv} soles. ¿Cuántas formas hay de comprar, contando también cero de un tipo?`],
          pasos: [
            { tipo: 'pide', texto: 'Piden cuántas parejas de cantidades enteras, desde cero, gastan justo el total.' },
            { tipo: 'datos', texto: [`Si compro x entradas de ${av} soles e y de ${bv} soles, se cumple `, ...ec, '.'] },
            { tipo: 'regla', texto: `Solo valen enteros desde cero. Pruebo cada x, de 0 hasta que ${av}x pase de ${cv}; sirve si lo que queda es múltiplo de ${bv}.` },
            cnt
              ? { tipo: 'cuentas', texto: `Pruebo x de 0 a ${xmax}. ${cnt === 1 ? 'Solo una pareja (x, y) sirve' : `Sirven ${cnt} parejas (x, y)`}.`, ecuacion: [lista] }
              : { tipo: 'cuentas', texto: `Pruebo x de 0 a ${xmax}. Con ninguna x lo que queda es múltiplo de ${bv}.` },
            cnt
              ? { tipo: 'sentido', texto: `Compruebo la primera pareja: ${av} · ${sols[0][0]} + ${bv} · ${sols[0][1]} = ${av * sols[0][0] + bv * sols[0][1]} soles, justo el total.` }
              : { tipo: 'sentido', texto: `Revisé ${xmax + 1} valores de x, del 0 al ${xmax}, y en todos sobra algo al dividir entre ${bv}.` },
          ],
          respuesta: cnt === 0 ? 'Ninguna forma' : cnt === 1 ? '1 forma' : `${cnt} formas`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), av = g.ent(2, 9), bv = g.ent(av + 1, 12), cv = g.ent(20, 80);
        if (s % 2 === 0) {
          const hay = cv % mcd(av, bv) === 0;
          return {
            pregunta: `¿Tiene soluciones enteras ${av}x + ${bv}y = ${cv}?`,
            opciones: opciones(hay ? 'Sí' : 'No', [
              { id: 'contrario', valor: hay ? 'No' : 'Sí', error: 'AT-DIOF', siFuera: `Revisa si mcd(${av}, ${bv}) = ${mcd(av, bv)} divide a ${cv}.` },
              { id: 'solo-c', valor: 'Solo si c es par', error: 'AT-DIOF', siFuera: 'Lo que decide es el mcd de a y b, no si c es par.' },
            ]),
            solucion: { texto: `mcd(${av}, ${bv}) = ${mcd(av, bv)}; ${hay ? 'divide' : 'no divide'} a ${cv}.`, ecuacion: [`mcd = ${mcd(av, bv)} ${hay ? '|' : '∤'} ${cv}`] },
          };
        }
        let cnt = 0; for (let x = 0; av * x <= cv; x++) if ((cv - av * x) % bv === 0) cnt++;
        return {
          pregunta: [`Entradas de ${av} y de ${bv} soles suman ${cv} soles. ¿Cuántas formas hay de comprar, contando también cero de un tipo?`],
          opciones: opciones(cnt, [
            { id: 'mas', valor: cnt + 1, error: 'AT-CONTEO', siFuera: 'Prueba cada x y mira si sobra un múltiplo exacto del otro precio.' },
            { id: 'menos', valor: Math.max(0, cnt - 1), error: 'AT-CONTEO', siFuera: 'Revisa también el caso de cero entradas de un tipo.' },
            { id: 'infinitas', valor: 'Infinitas', error: 'AT-DIOF', siFuera: 'En enteros habría infinitas; sin negativos, son pocas.' },
          ]),
          solucion: { texto: 'Se prueba x = 0, 1, 2… y se queda y entero.', ecuacion: [`${cnt} formas`] },
        };
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
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/arit-tabla.js'],
    // Glosario: las palabras que esta unidad estrena en el curso (docs/teoria.md §4d). «número primo» se estrena
    // en lógica proposicional y conjuntos («x es primo»): aquí no se repite.
    glosario: [
      { termino: 'divisible', def: 'Que se puede repartir entre otro número sin que sobre nada.',
        formas: ['divisible', 'divisibles'], ejemplo: '91 lo es entre 7: 91 = 7 · 13.', ver: ['divisor', 'división exacta'] },
      { termino: 'congruencia', simbolo: '≡', def: 'Relación entre dos números que dejan el mismo resto al dividirlos entre m. Se escribe con ≡.',
        formas: ['congruencia', 'congruencias', 'congruente', 'congruentes'], ejemplo: '17 ≡ 2 (mód 5): los dos dejan resto 2.', ver: ['resto', 'módulo'] },
      { termino: 'módulo', simbolo: 'mód', def: 'El divisor fijo con el que se comparan restos. En 17 ≡ 2 (mód 5) es el 5.',
        formas: ['módulo'], ejemplo: '17 y 2, con módulo 5, dejan el mismo resto: 2.', ver: ['congruencia'] },
      { termino: 'restos potenciales', def: 'Los restos de a, a², a³… al dividir entre un mismo número; sirven para hallar el de aⁿ.',
        formas: ['restos potenciales', 'resto potencial'], ejemplo: 'Entre 7, los de 2, 2², 2³ son 2, 4 y 1.', ver: ['ciclo', 'potencia'] },
      { termino: 'ciclo', simbolo: 'L', def: 'Tramo de restos que se repite siempre igual. Su largo permite reducir exponentes grandes.',
        ejemplo: '2, 4, 1, 2, 4, 1…: mide 3, y 2⁵⁰ deja lo mismo que 2².', ver: ['restos potenciales'] },
      { termino: 'exponente', def: 'Número pequeño, arriba a la derecha, que dice cuántas veces se multiplica la base.',
        ejemplo: 'En 2⁵ = 32 es 5: 2 · 2 · 2 · 2 · 2.', ver: ['potencia'] },
      { termino: 'criterio de divisibilidad', def: 'Regla para saber el resto, o si sobra algo, mirando solo las cifras, sin hacer la división.',
        formas: ['criterio de divisibilidad', 'criterios de divisibilidad'], ejemplo: '5 877 entre 9: sus cifras suman 27, que deja resto 0.', ver: ['cifra'] },
      { termino: 'máximo común divisor', simbolo: 'MCD', def: 'El mayor número que divide exacto a la vez a dos o más números.',
        formas: ['máximo común divisor', 'MCD'], ejemplo: 'MCD(6, 9) = 3.', ver: ['divisor'] },
      { termino: 'ecuación diofántica', def: 'Ecuación como ax + by = c en la que solo valen soluciones enteras.',
        formas: ['ecuación diofántica', 'ecuaciones diofánticas', 'diofántica'], ejemplo: '6x + 9y = 21 tiene x = 2, y = 1; 6x + 9y = 20 no tiene.', ver: ['máximo común divisor'] },
      { termino: 'coeficiente', def: 'Número que multiplica a una letra en una ecuación.',
        formas: ['coeficiente', 'coeficientes'], ejemplo: 'En 4x + 6y = 22, son 4 y 6.', ver: ['ecuación diofántica'] },
    ],
    // Laboratorio: juego libre, sin preguntas. «Filas grandes» abre n hasta 48 y filas hasta 12; «Juntar sobrantes»
    // deja elegir el divisor (el juego lo fija en 5); «Ciclos largos» llega a la potencia 9 y a la base 12, con divisores que
    // comparten factores con la base (ciclos que no empiezan en la primera potencia).
    laboratorio: [
      {
        id: 'filas-grandes', titulo: 'Filas grandes', pieza: 'arit-fichas',
        consigna: 'Hasta 48 fichas en filas de 3 a 12. Arrastra la última ficha o el borde de la fila.',
        controles: [
          { id: 'n', etiqueta: 'n', color: 'c-o', min: 13, max: 48, paso: 1, inicio: 36, decimales: 0 },
          { id: 'm', etiqueta: 'm', color: 'c-i', min: 3, max: 12, paso: 1, inicio: 7, decimales: 0 },
        ],
        dibujo: v => ({ datos: filas(v.n, v.m, LAB), estado: {} }),
        lectura: v => (sobra(v) ? [`${v.n} en filas de ${v.m}: sobran `, { v: 'c-h', t: String(sobra(v)) }] : [`${v.n} en filas de ${v.m}: no sobra nada`]),
        invitaciones: [
          { texto: 'Busca el mayor n que llene filas de 7 sin sobrar.',
            logrado: v => v.m === 7 && sobra(v) === 0 && v.n + v.m > 48,
            bien: '42 = 7 · 6: el siguiente múltiplo de 7, 49, ya no cabe.' },
          { texto: 'Con filas de 12, haz que sobre lo más posible.',
            logrado: v => v.m === 12 && sobra(v) === v.m - 1,
            bien: 'Sobran 11: con una ficha más se llena otra fila.' },
          { texto: 'Haz exactamente 4 filas llenas, sin nada suelto.',
            logrado: v => sobra(v) === 0 && v.n / v.m === 4,
            bien: 'n = 4 · m: n es múltiplo de m, y m divide a n.' },
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
        consigna: 'Elige el divisor m. Arrastra la última ficha de a o de b y mira los sobrantes juntos.',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-o', min: 3, max: 30, paso: 1, inicio: 17, decimales: 0 },
          { id: 'b', etiqueta: 'b', color: 'c-i', min: 3, max: 30, paso: 1, inicio: 11, decimales: 0 },
          { id: 'm', etiqueta: 'm', min: 3, max: 8, paso: 1, inicio: 6, decimales: 0 },
        ],
        dibujo: v => ({ datos: juntar(v.a, v.b, v.m), estado: { paso: 1 } }),
        lectura: v => [`m = ${v.m}: ${v.a % v.m} + ${v.b % v.m} → `, { v: 'c-h', t: String((v.a + v.b) % v.m) }, ` = resto de ${v.a + v.b}`],
        invitaciones: [
          { texto: 'Haz que los sobrantes juntos llenen justo una fila.',
            logrado: v => juntos(v) === v.m,
            bien: 'Los sobrantes completaron una fila: a + b es múltiplo de m.' },
          { texto: 'Con m = 8, junta la mayor cantidad posible de sobrantes.',
            logrado: v => v.m === 8 && juntos(v) === 2 * (v.m - 1),
            bien: '7 + 7 = 14: una fila llena y sobran 6. Ese es el resto.' },
          { texto: 'Haz que a + b deje el mismo resto que a, con b mayor que m.',
            logrado: v => v.b > v.m && (v.a + v.b) % v.m === v.a % v.m,
            bien: 'b no cambió el resto: b es múltiplo de m.' },
          { texto: 'Guarda dos casos con el mismo m, otro a y los mismos sobrantes.',
            logrado: (v, guardados) => guardados.some(g => g.m === v.m && g.a !== v.a && g.a % g.m === v.a % v.m && g.b % g.m === v.b % v.m),
            bien: 'Otros números, los mismos sobrantes: el resto de a + b no cambió.' },
        ],
        arrastres: arrastresJuntar(3, 30, v => v.m),
      },
      {
        id: 'ciclos-largos', titulo: 'Ciclos largos', pieza: 'arit-tabla',
        consigna: 'Base de 2 a 12 y divisor de 2 a 10. Prueba un divisor que comparta factores con la base.',
        controles: [
          { id: 'b', etiqueta: 'base', color: 'c-o', min: 2, max: 12, paso: 1, inicio: 2, decimales: 0 },
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
    ideas: [multiplos, teoremas, potencias, criterios, diofanticas],
  };
});
