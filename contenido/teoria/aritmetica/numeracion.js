/*
 * Teoría de «Numeración» (aritmetica.numeracion). Molde: docs/teoria.md; modelo de forma: porcentajes.js.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 11) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: los AT-* son hipótesis nuevas (la matriz marca «admitir la cifra b» y «leer el numeral como decimal»).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver que una base es una regla de canje (b sueltas = 1 del orden siguiente) y que el valor no cambia al cambiar de base.
 *   Persona y condiciones: postulante de 3.º, celular de 360 px, sin audio, con lápiz al lado.
 *   Resultado observable: pasa un numeral de base b a base 10 y al revés, detecta cifras imposibles y cuenta cifras por bloques.
 *   Orden de atención: 1.º las fichas o la tabla · 2.º la fila que se acaba de llenar · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué en base 5 no existe la cifra 5, y por qué (132)₄ no es ciento treinta y dos?».
 * Colores (regla 4): la base b naranja (c-o), las cifras turquesa (c-i), los restos rojo (c-h), el valor en base 10 verde (c-d).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
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

  // ---------- Idea 1: agrupar de b en b (base de un sistema) ----------
  // Cambia: cuántas fichas y de a cuántas se agrupan. Permanece: el tamaño de cada ficha (la cantidad no se estira).
  // Progresa: sueltas → fila llena → canje por una ficha del orden siguiente. Se reserva: la ficha número b, que nunca queda suelta.
  // Debe verse: con b sueltas ya hay un grupo; por eso la cifra b no existe en base b.
  const fichasBase = (n, base) => {
    const q = Math.floor(n / base), s = n % base;
    return { bloques: [{ n, columnas: base, color: 'i', marcoFilas: true, rotulo: `${n} = ${nb(enBase(n, base), base)}`, tramos: s ? [{ de: n - s, a: n - 1, color: 'h' }] : [] }], altoMax: 150, ficha: 30, alt: `${n} fichas en filas de ${base}: ${q} grupos completos y ${s} sueltas` };
  };
  const agrupar = {
    id: 'agrupar',
    titulo: 'Agrupar de b en b',
    temas: ['Base de un sistema'],
    pieza: 'arit-fichas',
    juega: {
      consigna: 'Elige cuántas fichas hay y la base. Cada fila llena es un grupo; las rojas quedan sueltas.',
      voz: 'Cuenta los grupos y las sueltas antes de leer el numeral.',
      controles: [
        { id: 'n', etiqueta: 'Fichas', min: 5, max: 24, paso: 1, inicio: 13, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-o', min: 5, max: 9, paso: 1, inicio: 5, decimales: 0 },
      ],
      dibujo: v => ({ datos: fichasBase(v.n, v.b), estado: {} }),
      lectura: v => [`${Math.floor(v.n / v.b)} grupos de ${v.b} y ${v.n % v.b} sueltas → ${nb(enBase(v.n, v.b), v.b)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['En base ', { v: 'c-o', t: '4' }, ', ¿cuál de estas cifras nunca aparece en un numeral?'],
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'cero', texto: '0', error: 'AT-CERO', siFuera: 'El 0 sí aparece: dice que en ese lugar no quedó nada, como en (10)₄.' },
        { id: 'tres', texto: '3', error: 'AT-CIFRA-B', siFuera: 'El 3 sí cabe: 3 sueltas todavía no completan un grupo de 4.' },
        { id: 'uno', texto: '1', error: 'AT-CIFRA-B', siFuera: 'El 1 sí aparece: un grupo completo se escribe con 1.' },
      ],
      dibujo: { datos: fichasBase(3, 4), estado: {} },
      revelar: { datos: fichasBase(4, 4), estado: {} },
      coincide: 'Coincide: con 4 sueltas ya hay un grupo, y se escribe (10)₄.',
    },
    mira: {
      datos: { bloques: [
        { n: 3, columnas: 4, color: 'h', rotulo: '(3)₄' },
        { n: 4, columnas: 4, color: 'i', marcoFilas: true, rotulo: '1 grupo', paso: 1 },
        { n: 1, columnas: 1, color: 'd', rotulo: '(10)₄', paso: 2 },
      ], altoMax: 36, ficha: 32, alt: 'Tres sueltas; cuatro fichas que forman un grupo; una ficha del orden siguiente' },
      pasos: [
        { estado: { paso: 0 }, texto: 'Tres fichas sueltas en base 4: se escribe 3.', ecuacion: ['3 < ', b, ' = 4'] },
        { estado: { paso: 1 }, texto: 'Con la cuarta ficha se completa un grupo.', ecuacion: ['4 sueltas = 1 grupo'] },
        { estado: { paso: 2 }, texto: 'El grupo se canjea por una ficha del orden siguiente.', ecuacion: ['4 = (10)₄'] },
      ],
    },
    regla: {
      texto: 'En base b, cada b unidades de un orden se canjean por una del orden siguiente. Por eso cada cifra va de 0 a b − 1.',
      ecuacion: ['0 ≤ ', d, ' ≤ ', b, ' − 1'],
      condicion: 'b es un entero de 2 o más. En un numeral de varias cifras, la primera no es 0.',
    },
    ahoraTu: {
      generar(s) {
        const q = azar(s);
        if (s % 2 === 0) {
          // La menor base posible para un numeral: la cifra mayor más uno.
          const base = q.ent(4, 9), c = [q.ent(1, base - 1), q.ent(0, base - 1), q.ent(0, base - 1)];
          c[q.ent(0, 2) || 1] = base - 1;
          const txt = c.join(''), mayor = Math.max(...c), min = mayor + 1;
          return {
            pregunta: ['¿Cuál es la menor base en la que el numeral ', { v: 'c-i', t: txt }, ' está bien escrito?'],
            opciones: opciones(min, [
              { id: 'igual', valor: mayor, error: 'AT-CIFRA-B', siFuera: `En base ${mayor} la cifra ${mayor} no existe: ${mayor} sueltas ya son un grupo.` },
              { id: 'diez', valor: 10, error: 'AT-DECIMAL', siFuera: 'Base 10 sirve, pero no es la menor posible.' },
              { id: 'cifras', valor: c.length, error: 'AT-LARGO', siFuera: 'La base no depende de cuántas cifras tiene el numeral.' },
            ], x => `base ${x}`),
            solucion: { texto: `La cifra mayor es ${mayor}; la base tiene que ser mayor que ella.`, ecuacion: [b, ` > ${mayor} → `, b, ` = ${min}`] },
          };
        }
        const base = q.ent(3, 8), n = q.ent(base + 1, base * base - 1);
        const qq = Math.floor(n / base), ss = n % base;
        return {
          pregunta: [`Hay ${n} fichas. Se agrupan de `, { v: 'c-o', t: String(base) }, ' en ', { v: 'c-o', t: String(base) }, '. ¿Cómo se escribe la cantidad en esa base?'],
          dibujo: { datos: fichasBase(n, base), estado: {} },
          opciones: opciones(nb(enBase(n, base), base), [
            { id: 'decimal', valor: nb(String(n), base), error: 'AT-DECIMAL', siFuera: 'Eso copia el número en base 10; en otra base las cifras cambian.' },
            { id: 'al-reves', valor: nb(`${ss}${qq}`, base), error: 'AT-ORDEN', siFuera: 'Los grupos van a la izquierda y las sueltas a la derecha.' },
            { id: 'uno-mas', valor: nb(`${qq + 1}${ss}`, base), error: 'AT-CONTEO', siFuera: `Cuenta otra vez las filas llenas: son ${qq}.` },
          ]),
          solucion: { texto: `${qq} grupos de ${base} y ${ss} sueltas.`, ecuacion: [`${n} = ${qq} · ${base} + ${ss} = ${nb(enBase(n, base), base)}`] },
        };
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
      texto: 'Cada cifra se multiplica por la potencia de la base de su lugar, contando desde 0 a la derecha, y se suma todo.',
      ecuacion: [{ sub: [['(', { sub: [d, 'k'] }, '…', { sub: [d, '1'] }, { sub: [d, '0'] }, ')'], b] }, ' = ', { sub: [d, 'k'] }, ' ', { sup: [b, 'k'] }, ' + … + ', { sub: [d, '1'] }, ' ', b, ' + ', { sub: [d, '0'] }],
      condicion: 'cada cifra cumple 0 ≤ d < b. El lugar de la derecha es b⁰ = 1.',
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
      texto: 'Para pasar de base 10 a base b se divide entre b hasta que el cociente es 0. Los restos, del último al primero, son las cifras.',
      ecuacion: [N, ' = ', b, ' · q + ', r, ',   0 ≤ ', r, ' < ', b],
      condicion: 'el número no cambia, solo su escritura. Entre dos bases que no son 10, se pasa primero por base 10.',
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
  const conteo = {
    id: 'conteo-cifras',
    titulo: 'Contar cifras por bloques',
    temas: ['Conteo de números y cifras'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Un libro se numera desde la página 1. Elige la última página y mira cuántas cifras gasta cada bloque.',
      voz: 'Compara el bloque de dos cifras con el de tres.',
      controles: [{ id: 'P', etiqueta: 'Última página', min: 120, max: 400, paso: 20, inicio: 200, decimales: 0 }],
      dibujo: v => ({ datos: tablaBloques(v.P), estado: {} }),
      lectura: v => [`De 1 a ${v.P} se usan `, { v: 'c-d', t: String(totalCifras(v.P)) }, ' cifras'],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuántas cifras se usan para numerar las páginas de un libro de 1 a 100?',
      opciones: [
        { id: 'c', texto: '192', correcta: true },
        { id: 'todas-dos', texto: '200', error: 'AT-BLOQUE', siFuera: 'Sería cierto si todas tuvieran dos cifras. De 1 a 9 tienen una.' },
        { id: 'sin-cien', texto: '189', error: 'AT-CONTEO', siFuera: '189 llega hasta la página 99; falta la página 100, con 3 cifras.' },
        { id: 'tres', texto: '300', error: 'AT-BLOQUE', siFuera: 'Solo la página 100 tiene tres cifras.' },
      ],
      dibujo: { datos: tablaBloques(100, 0), estado: {} },
      revelar: { datos: tablaBloques(100), estado: {} },
      coincide: 'Coincide: 9 + 180 + 3 = 192.',
    },
    mira: {
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
      ecuacion: ['números de k cifras = (', b, ' − 1) · ', { sup: [b, 'k − 1'] }, '   ·   de a hasta z hay z − a + 1'],
      condicion: 'la primera cifra no es 0. Un bloque cortado se cuenta desde su primer número hasta la última página.',
    },
    ahoraTu: {
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

  return {
    unidad: 'aritmetica.numeracion',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/arit-tabla.js'],
    historia: {
      texto: 'La numeración que usamos se fue armando entre la India, las sociedades de lengua árabe y Europa, durante siglos y con sistemas que convivían. Nadie la inventó de una vez. Su idea clave es que un símbolo vale según el lugar que ocupa. Escribir un número en otra base cambia cómo se ve, no cuánto es.',
      pregunta: '¿Qué cambia si contamos de cinco en cinco?',
      fuente: { titulo: 'O’Connor y Robertson, Arabic numerals — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Arabic_numerals/' },
    },
    ideas: [agrupar, descomposicion, cambio, conteo],
  };
});
