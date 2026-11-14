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
  const filas = (nv, mv, extra = {}) => {
    const rv = nv % mv;
    return Object.assign({ bloques: [{ n: nv, columnas: mv, color: 'o', marcoFilas: true, rotulo: rv ? `${nv} = ${mv}·${Math.floor(nv / mv)} + ${rv}` : `${nv} = ${mv}·${nv / mv}`, tramos: rv ? [{ de: nv - rv, a: nv - 1, color: 'h' }] : [] }], altoMax: 160, ficha: 24, alt: `${nv} fichas en filas de ${mv}: ${Math.floor(nv / mv)} filas llenas${rv ? ` y sobran ${rv}` : ', no sobra ninguna'}` }, extra);
  };

  // ---------- Idea 1: filas de m sin sobrante (múltiplos y divisores) ----------
  // Cambia: n y el largo de fila m. Permanece: el tamaño de la ficha.
  // Progresa: filas llenas → sobrante. Se reserva: un número que parece primo y se acomoda justo.
  // Debe verse: m divide a n cuando no sobra ninguna ficha.
  const multiplos = {
    id: 'filas-de-m',
    titulo: 'Filas de m sin sobrante',
    temas: ['Múltiplos y divisores'],
    pieza: 'arit-fichas',
    juega: {
      consigna: 'Elige cuántas fichas hay y el largo de cada fila. Las rojas son las que sobran.',
      voz: 'Busca un largo de fila que no deje rojas.',
      controles: [
        { id: 'n', etiqueta: 'n', color: 'c-o', min: 12, max: 40, paso: 1, inicio: 24, decimales: 0 },
        { id: 'm', etiqueta: 'm', color: 'c-i', min: 2, max: 9, paso: 1, inicio: 5, decimales: 0 },
      ],
      dibujo: v => ({ datos: filas(v.n, v.m), estado: {} }),
      lectura: v => (v.n % v.m ? [m, ` no divide a ${v.n}: sobran `, { v: 'c-h', t: String(v.n % v.m) }] : [m, ` = ${v.m} divide a ${v.n}: no sobra nada`]),
      minimo: 3,
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
      ecuacion: [m, ' | ', n_, '  ⇔  ', n_, ' = ', m, ' · k,  k entero'],
      condicion: 'm ≠ 0. Que un número «parezca primo» no prueba nada: se prueba dividiendo.',
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
  ], altoMax: 130, ficha: 22, alt: `a = ${av} y b = ${bv} en filas de ${mv}; sus sobrantes juntos son ${(av % mv) + (bv % mv)}` });
  const teoremas = {
    id: 'restos-suman',
    titulo: 'Los restos se suman y multiplican',
    temas: ['Teoremas de la divisibilidad'],
    pieza: 'arit-fichas',
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
      ecuacion: [a, ' ≡ ', r, ',  b ≡ s  (mód ', m, ')  ⇒  a + b ≡ ', r, ' + s,  ab ≡ ', r, 's'],
      condicion: 'al final se reduce otra vez entre m. No se puede dividir una congruencia entre cualquier número.',
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
  const potencias = {
    id: 'restos-potenciales',
    titulo: 'Los restos de potencias se repiten',
    temas: ['Restos potenciales'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige la base y el divisor. La tabla da el resto de cada potencia; los resaltados forman el ciclo.',
      voz: 'Busca dónde empieza a repetirse la columna roja.',
      controles: [
        { id: 'b', etiqueta: 'base', color: 'c-o', min: 2, max: 9, paso: 1, inicio: 3, decimales: 0 },
        { id: 'k', etiqueta: 'divisor', color: 'c-i', min: 4, max: 9, paso: 1, inicio: 5, decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaPot(v.b, v.k), estado: {} }),
      lectura: v => { const c = ciclo(v.b, v.k); return [`Ciclo de ${c.xs.length - c.ini}: `, { v: 'c-h', t: c.xs.slice(c.ini).join(', ') }]; },
      minimo: 3,
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
      texto: 'Los restos de a, a², a³, … entre m se repiten en un ciclo. Para aⁿ, se busca el lugar del ciclo con el resto de n entre su largo.',
      ecuacion: [{ sup: [a, 'n'] }, ' ≡ ', { sup: [a, 'n mód L'] }, '  (mód ', m, ')'],
      condicion: 'si n mód L es 0, toca el último del ciclo. El ciclo se comprueba en la tabla, no se supone.',
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
      ecuacion: ['10 ≡ 1 (mód 9)  ⇒  ', { v: 'c-o', t: 'N' }, ' ≡ suma de cifras'],
      condicion: 'vale para numerales en base 10. En base b, la suma de cifras sirve para b − 1.',
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
      texto: 'ax + by = c tiene soluciones enteras exactamente cuando el mcd de a y b divide a c. Si hay una, hay infinitas.',
      ecuacion: ['mcd(', a, ', b) | c   ⇔   hay enteros con ', a, 'x + by = c'],
      condicion: 'para x, y naturales o acotados se revisan los límites: el mcd asegura enteros, no positivos.',
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

  return {
    unidad: 'aritmetica.divisibilidad',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/arit-tabla.js'],
    historia: {
      texto: 'Las preguntas sobre restos son muy antiguas, pero en 1801 Gauss las ordenó en sus Disquisitiones Arithmeticae con el lenguaje de las congruencias. Ese lenguaje permite trabajar con lo que sobra de una división sin calcular el número completo. Los criterios que vemos aquí salen de él: de lo que deja cada potencia de 10.',
      pregunta: '¿Se puede saber lo que sobra sin dividir todo?',
      fuente: { titulo: 'O’Connor y Robertson, Carl Friedrich Gauss — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Gauss/' },
    },
    ideas: [multiplos, teoremas, potencias, criterios, diofanticas],
  };
});
