/*
 * Teoría de «MCD y MCM» (aritmetica.mcd-y-mcm). Molde: docs/teoria.md; forma de contenido/teoria/aritmetica/porcentajes.js.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 15) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR13 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: distinguir «cortar en trozos iguales lo más grandes posible» (MCD) de «volver a coincidir» (MCM).
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: elige MCD o MCM según lo que se maximiza o minimiza, los halla por factores o por
 *     Euclides, usa mcd · mcm = a · b solo con dos números y escribe la fracción continua de un cociente.
 *   Orden de atención: 1.º las dos cintas o las dos filas de múltiplos · 2.º el trozo que mide a las dos o el
 *     primer punto común · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿cuándo es MCD y cuándo es MCM, si los dos dicen “común”?».
 * Colores (regla 4): a naranja (c-o), b turquesa (c-i), el MCD verde (c-d), el MCM rojo (c-h).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const A = { v: 'c-o', t: 'a' }, Bv = { v: 'c-i', t: 'b' };
  const MCD = { v: 'c-d', t: 'mcd' }, MCM = { v: 'c-h', t: 'mcm' };
  const mcdab = [MCD, '(', A, ', ', Bv, ')'], mcmab = [MCM, '(', A, ', ', Bv, ')'];
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || (typeof d.valor === 'number' && !Number.isFinite(d.valor))) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  const mcm = (a, b) => a / mcd(a, b) * b;
  // Factores primos: [[p, e], …].
  function factores(n) {
    const out = [];
    for (let p = 2; p * p <= n; p++) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) out.push([p, e]); }
    if (n > 1) out.push([n, 1]);
    return out;
  }
  const potencia = fs => fs.map(([p, e]) => (e > 1 ? { sup: [String(p), String(e)] } : String(p))).reduce((acc, x, i) => (i ? acc.concat([' · ', x]) : [x]), []);
  // Pasos de Euclides: [{ a, b, q, r }] hasta resto 0.
  function euclides(a, b) {
    const out = [];
    while (b) { out.push({ a, b, q: Math.floor(a / b), r: a % b }); [a, b] = [b, a % b]; }
    return out;
  }

  // ---------- Idea 1: el MCD es el trozo más largo que mide a las dos ----------
  // Cambia: el largo del trozo t. Permanece: las dos cintas a la misma escala (40 cm de ancho).
  // Progresa: trozos que dejan sobrante → trozos que miden exacto a las dos → el mayor de ellos.
  // Se reserva: el trozo de 12 en la cinta de 24 y 36, que llega en el último paso. Debe verse: nada sobra.
  const MAXC = 40;
  const cinta = (n, t, color, rot) => {
    const q = Math.floor(n / t), r = n - q * t;
    const tramos = [{ valor: q * t, partes: q, color, texto: q > 1 && t >= 4 ? `${q} × ${t}` : '' }];
    if (r > 0) tramos.push({ valor: r, hueco: true, texto: `sobra ${r}` });
    return { rotulo: rot, color, fin: `${n} cm`, tramos, sinContorno: true };
  };
  const tirasCorte = (a, b, t, extra = {}) => Object.assign({ max: MAXC, tiras: [cinta(a, t, 'o', `a = ${a}`), cinta(b, t, 'i', `b = ${b}`)], filas: 2 }, extra);
  const PARES = { '18-30': [18, 30], '24-36': [24, 36], '16-40': [16, 40] };
  const trozo = {
    id: 'mcd-cintas',
    titulo: 'El trozo común más largo',
    temas: ['Máximo común divisor', 'Problemas de aplicación'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Elige dos cintas y el largo del trozo. Busca un trozo que corte las dos sin que sobre nada.',
      voz: 'Comprueba cada trozo en las dos cintas, no solo en una.',
      controles: [
        { id: 'par', etiqueta: 'Cintas', opciones: [{ valor: '18-30', texto: '18 y 30' }, { valor: '16-40', texto: '16 y 40' }] },
        { id: 't', etiqueta: 'Trozo', color: 'c-d', min: 1, max: 12, paso: 1, inicio: 4, unidad: 'cm', decimales: 0 },
      ],
      dibujo: v => { const [a, b] = PARES[v.par]; return { datos: tirasCorte(a, b, v.t), estado: {} }; },
      lectura: v => { const [a, b] = PARES[v.par]; return [`Trozo de ${v.t} cm: sobran ${a % v.t} y ${b % v.t} cm`]; },
      minimo: 4,
    },
    predice: {
      pregunta: ['Dos cintas miden ', { v: 'c-o', t: '24 cm' }, ' y ', { v: 'c-i', t: '36 cm' }, '. Se cortan en trozos iguales, lo más largos posible, sin que sobre. ¿Cuánto mide cada trozo?'],
      opciones: [
        { id: 'c', texto: '12 cm', correcta: true },
        { id: 'mcm', texto: '72 cm', error: 'AR13', siFuera: '72 es el primer largo que se arma con las dos medidas. Aquí se corta, no se junta.' },
        { id: 'menor', texto: '6 cm', error: 'AT-NOMAX', siFuera: '6 cm mide a las dos sin sobrante, pero 12 cm también, y es más largo.' },
        { id: 'resta', texto: '24 cm', error: 'AT-MENOR', siFuera: '24 cm mide a la primera, pero en la de 36 sobran 12 cm.' },
      ],
      dibujo: { datos: { max: MAXC, tiras: [{ rotulo: 'a = 24', color: 'o', fin: '24 cm', tramos: [{ valor: 24 }] }, { rotulo: 'b = 36', color: 'i', fin: '36 cm', tramos: [{ valor: 36 }] }], filas: 2 }, estado: {} },
      revelar: { datos: tirasCorte(24, 36, 12), estado: {} },
      coincide: 'Coincide: 12 cm entra 2 veces en 24 y 3 veces en 36.',
    },
    mira: {
      datos: {
        max: MAXC, filas: 4,
        tiras: [
          Object.assign(cinta(24, 6, 'o', 'trozos de 6'), { paso: 1 }), Object.assign(cinta(36, 6, 'i', 'trozos de 6'), { paso: 1 }),
          Object.assign(cinta(24, 12, 'o', 'trozos de 12'), { paso: 2 }), Object.assign(cinta(36, 12, 'i', 'trozos de 12'), { paso: 2 }),
        ],
      },
      pasos: [
        { estado: { paso: 1 }, texto: 'Un trozo de 6 cm mide las dos cintas: es un divisor común.', ecuacion: ['24 = 4 · 6;   36 = 6 · 6'] },
        { estado: { paso: 2 }, texto: 'Un trozo de 12 cm también, y es más largo.', ecuacion: ['24 = 2 · 12;   36 = 3 · 12'] },
        { estado: { paso: 2 }, texto: 'Con factores primos: se toman los comunes con su menor exponente.', ecuacion: ['24 = ', { sup: ['2', '3'] }, ' · 3;   36 = ', { sup: ['2', '2'] }, ' · ', { sup: ['3', '2'] }, '   →   ', MCD, ' = ', { sup: ['2', '2'] }, ' · 3 = 12'] },
      ],
    },
    regla: {
      texto: 'El MCD es el mayor número que divide a los dos. Responde a «cortar en partes iguales lo más grandes posible».',
      ecuacion: [mcdab, ' = producto de los primos comunes con su menor exponente'],
      condicion: 'a y b son enteros positivos. Si no tienen primos comunes, el MCD es 1.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), g = r.de([2, 3, 4, 5, 6, 8, 9, 10, 12, 15]);
        let m = r.ent(2, 7), n = r.ent(2, 9);
        while (mcd(m, n) !== 1 || m === n) n = n % 9 + 2;
        const a = g * m, b = g * n, c = mcm(a, b), sub = factores(g)[0][0];
        if (s % 2 === 0) return {
          pregunta: ['Dos terrenos de ', { v: 'c-o', t: `${a} m` }, ' y ', { v: 'c-i', t: `${b} m` }, ' de frente se dividen en lotes iguales, lo más anchos posible, sin que sobre. ¿Cuánto mide cada lote de frente?'],
          dibujo: { datos: { max: Math.max(a, b) * 1.15, tiras: [{ rotulo: 'a', color: 'o', fin: `${a} m`, tramos: [{ valor: a }] }, { rotulo: 'b', color: 'i', fin: `${b} m`, tramos: [{ valor: b }] }], filas: 2 }, estado: {} },
          opciones: opciones(g, [
            { id: 'mcm', valor: c, error: 'AR13', siFuera: `${c} es el MCM: sirve para juntar, no para dividir.` },
            { id: 'menor', valor: g / sub, error: 'AT-NOMAX', siFuera: `${g / sub} divide a los dos, pero hay uno más grande.` },
            { id: 'resta', valor: Math.abs(a - b), error: 'AT-RESTA', siFuera: 'La diferencia de los frentes no siempre divide a los dos.' },
          ], n2 => `${f(n2)} m`),
          solucion: {
            texto: 'El mayor divisor común de los dos frentes.', ecuacion: [MCD, `(${a}, ${b}) = ${g}`],
            dibujo: { datos: { max: Math.max(a, b) * 1.15, tiras: [{ rotulo: 'a', color: 'o', fin: `${a} m`, tramos: [{ valor: a, partes: m, color: 'o' }] }, { rotulo: 'b', color: 'i', fin: `${b} m`, tramos: [{ valor: b, partes: n, color: 'i' }] }], filas: 2 }, estado: {} },
          },
        };
        return {
          pregunta: ['Dos cintas de ', { v: 'c-o', t: `${a} cm` }, ' y ', { v: 'c-i', t: `${b} cm` }, ' se cortan en trozos iguales, lo más largos posible, sin que sobre. ¿Cuántos trozos salen en total?'],
          opciones: opciones(m + n, [
            { id: 'largo', valor: g, error: 'AT-PREGUNTA', siFuera: `${g} cm es el largo de cada trozo; se preguntó cuántos son.` },
            { id: 'menor', valor: a / (g / sub) + b / (g / sub), error: 'AT-NOMAX', siFuera: 'Eso usa un trozo más corto que el mayor posible.' },
            { id: 'mcm', valor: c / g, error: 'AR13', siFuera: 'Eso divide el MCM entre el MCD; se suman los trozos de cada cinta.' },
          ], n2 => `${f(n2)} trozos`),
          solucion: { texto: `Trozos de ${g} cm: ${m} en una cinta y ${n} en la otra.`, ecuacion: [`${a} ÷ ${g} + ${b} ÷ ${g} = ${m} + ${n} = ${m + n}`] },
        };
      },
    },
  };

  // ---------- Idea 2: el MCM es la primera vez que coinciden ----------
  // Cambia: los periodos a y b. Permanece: la recta de minutos de 0 a 90.
  // Progresa: múltiplos de a → múltiplos de b → el primer punto común. Se reserva: el rótulo «coinciden».
  // Debe verse: el primer punto que está en las dos filas.
  const rectaBuses = (a, b, max, conMcm = true, extra = {}) => Object.assign({
    min: 0, max, paso: 5, cada: 2, decimales: 0, variable: 'minutos', filas: 3,
    elementos: [
      { tipo: 'enteros', a: a, b: max, cada: a, color: 'o', fila: 2, rotulo: `cada ${a}` },
      { tipo: 'enteros', a: b, b: max, cada: b, color: 'i', fila: 1, rotulo: `cada ${b}` },
      ...(conMcm ? [{ tipo: 'punto', x: mcm(a, b), color: 'h', fila: 3, rotulo: `juntos: ${mcm(a, b)}`, desde: extra.desdeMcm || 0 }] : []),
    ],
  }, extra.datos || {});
  const buses = {
    id: 'mcm-coinciden',
    titulo: 'La primera vez que coinciden',
    temas: ['Mínimo común múltiplo', 'Problemas de aplicación'],
    pieza: 'recta',
    juega: {
      consigna: 'Dos combis salen juntas del paradero, una cada a minutos y otra cada b. Mira cuándo vuelven a salir juntas.',
      voz: 'Busca el primer punto que está en las dos filas.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 2, max: 9, paso: 1, inicio: 6, unidad: 'min', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 9, paso: 1, inicio: 8, unidad: 'min', decimales: 0 },
      ],
      dibujo: v => ({ datos: rectaBuses(v.a, v.b, 90), estado: {} }),
      lectura: v => [`Salen juntas cada ${mcm(v.a, v.b)} minutos`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Dos alarmas suenan juntas a las 8:00. Una suena cada ', { v: 'c-o', t: '12 min' }, ' y la otra cada ', { v: 'c-i', t: '18 min' }, '. ¿Cuántos minutos después vuelven a sonar juntas?'],
      opciones: [
        { id: 'c', texto: '36 minutos', correcta: true },
        { id: 'mcd', texto: '6 minutos', error: 'AR13', siFuera: '6 divide a 12 y a 18, pero a los 6 minutos ninguna alarma suena.' },
        { id: 'producto', texto: '216 minutos', error: 'AR13', siFuera: 'A los 216 también coinciden, pero ya lo hicieron antes, a los 36.' },
        { id: 'suma', texto: '30 minutos', error: 'AT-SUMA-PERIODOS', siFuera: '30 no es múltiplo de 12: a esa hora solo podría sonar si fuera.' },
      ],
      dibujo: { datos: rectaBuses(12, 18, 80, false), estado: {} },
      revelar: { datos: rectaBuses(12, 18, 80), estado: {} },
      coincide: 'Coincide: 36 es el primer número que está en las dos filas.',
    },
    mira: {
      datos: rectaBuses(12, 18, 80, true, { desdeMcm: 2 }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Arriba, los múltiplos de 18; abajo, los de 12.', ecuacion: ['12, 24, 36, 48, …;   18, 36, 54, …'] },
        { estado: { corte: 2 }, texto: 'El primer múltiplo común es 36: ahí suenan juntas.', ecuacion: [MCM, '(12, 18) = 36'] },
        { estado: { corte: 2 }, texto: 'Con factores primos: todos los primos, con su mayor exponente.', ecuacion: ['12 = ', { sup: ['2', '2'] }, ' · 3;   18 = 2 · ', { sup: ['3', '2'] }, '   →   ', { sup: ['2', '2'] }, ' · ', { sup: ['3', '2'] }, ' = 36'] },
      ],
    },
    regla: {
      texto: 'El MCM es el menor múltiplo positivo de los dos. Responde a «¿cuándo vuelven a coincidir?» o «la menor cantidad que se arma con ambas medidas».',
      ecuacion: [mcmab, ' = producto de todos los primos con su mayor exponente'],
      condicion: 'a y b son enteros positivos y los dos sucesos parten juntos del instante 0.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), g = r.de([2, 3, 4, 5, 6]);
        let m = r.ent(2, 5), n = r.ent(2, 7);
        while (mcd(m, n) !== 1 || m === n) n = n % 7 + 2;
        const a = g * m, b = g * n, c = mcm(a, b);
        const ctx = r.de([['Dos combis salen juntas; una cada ', ' min y otra cada ', ' min. ¿En cuántos minutos vuelven a salir juntas?', 'minutos'],
          ['Se apilan cajas de ', ' cm y, al lado, cajas de ', ' cm. ¿A qué altura mínima coinciden las dos pilas?', 'cm']]);
        return {
          pregunta: [ctx[0], { v: 'c-o', t: String(a) }, ctx[1], { v: 'c-i', t: String(b) }, ctx[2]],
          dibujo: { datos: rectaBuses(a, b, Math.max(c, a * b > 90 ? 90 : a * b) * 1.1 + 2, false), estado: {} },
          opciones: opciones(c, [
            { id: 'mcd', valor: g, error: 'AR13', siFuera: `${g} es el MCD: divide a los dos, pero no es múltiplo de ellos.` },
            { id: 'producto', valor: a * b, error: 'AR13', siFuera: `En ${a * b} también coinciden, pero ya lo hicieron antes.` },
            { id: 'suma', valor: a + b, error: 'AT-SUMA-PERIODOS', siFuera: 'La suma no tiene por qué ser múltiplo de los dos.' },
          ], n2 => `${f(n2)} ${ctx[3]}`),
          solucion: { texto: 'El primer múltiplo común de los dos.', ecuacion: [MCM, `(${a}, ${b}) = ${c}`], dibujo: { datos: rectaBuses(a, b, Math.max(c, a * b > 90 ? 90 : a * b) * 1.1 + 2), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: Euclides cambia el par sin cambiar el MCD ----------
  // Cambia: a y b. Permanece: la escala de las tiras. Progresa: (a, b) → (b, r) → … hasta resto 0.
  // Se reserva: la última tira, que se mide exacto. Debe verse: el resto de cada paso es la medida del siguiente.
  const tirasEuclides = (a, b, hasta) => {
    const ps = euclides(a, b).slice(0, 4);
    const tiras = ps.map((p, k) => ({
      rotulo: `${p.a} = ${p.q} · ${p.b}${p.r ? ` + ${p.r}` : ''}`, color: k % 2 ? 'i' : 'o', paso: k,
      tramos: [{ valor: p.q * p.b, partes: p.q, color: k % 2 ? 'i' : 'o' }, ...(p.r ? [{ valor: p.r, color: 'h', texto: String(p.r) }] : [])],
      sinContorno: true,
    }));
    return { max: a, tiras: hasta === undefined ? tiras : tiras.slice(0, hasta), filas: 4 };
  };
  const euclidesIdea = {
    id: 'euclides',
    titulo: 'Euclides: medir con el resto',
    temas: ['Algoritmo de Euclides'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Elige a y b. Cada fila mide la tira anterior con la medida que sobró. Mira cuándo ya no sobra nada.',
      voz: 'El resto rojo pasa a ser la medida de la fila siguiente.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 30, max: 90, paso: 6, inicio: 84, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 10, max: 28, paso: 2, inicio: 24, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tirasEuclides(v.a, v.b), estado: { paso: 4 } }),
      lectura: v => [MCD, `(${v.a}, ${v.b}) = ${mcd(v.a, v.b)}, en ${euclides(v.a, v.b).length} divisiones`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Al dividir ', { v: 'c-o', t: '91' }, ' entre ', { v: 'c-i', t: '35' }, ' el cociente es 2 y sobran 21. Sin factorizar, ¿qué par tiene el mismo MCD que (91, 35)?'],
      opciones: [
        { id: 'c', texto: '(35, 21)', correcta: true },
        { id: 'cociente', texto: '(35, 2)', error: 'AT-COCIENTE', siFuera: 'El cociente cuenta cuántas veces cupo; lo que sigue midiendo es el resto.' },
        { id: 'resta', texto: '(91, 21)', error: 'AT-EUCLIDES', siFuera: 'Ese par también lo comparte, pero no avanza: el algoritmo deja el menor y el resto.' },
        { id: 'suma', texto: '(126, 35)', error: 'AT-EUCLIDES', siFuera: 'Sumar no achica el problema; Euclides reemplaza por el resto, que es menor.' },
      ],
      dibujo: { datos: tirasEuclides(91, 35, 1), estado: { paso: 0 } },
      revelar: { datos: tirasEuclides(91, 35), estado: { paso: 4 } },
      coincide: 'Coincide: todo divisor de 91 y 35 divide también a 91 − 2 · 35 = 21.',
    },
    mira: {
      datos: tirasEuclides(91, 35),
      pasos: [
        { estado: { paso: 0 }, texto: '35 cabe 2 veces en 91 y sobran 21.', ecuacion: ['91 = 2 · 35 + 21'] },
        { estado: { paso: 1 }, texto: 'Ahora se mide 35 con 21: cabe 1 vez y sobran 14.', ecuacion: ['35 = 1 · 21 + 14'] },
        { estado: { paso: 2 }, texto: '21 con 14: cabe 1 vez y sobran 7.', ecuacion: ['21 = 1 · 14 + 7'] },
        { estado: { paso: 3 }, texto: '7 mide a 14 exacto: el último divisor es el MCD.', ecuacion: ['14 = 2 · 7   →   ', MCD, '(91, 35) = 7'] },
      ],
    },
    regla: {
      texto: 'Si a = q · b + r, los divisores comunes de a y b son los mismos que los de b y r. Se repite hasta que el resto sea 0.',
      ecuacion: [mcdab, ' = ', MCD, '(', Bv, ', r)   con   ', A, ' = q · ', Bv, ' + r'],
      condicion: 'a y b enteros positivos y 0 ≤ r < b. El MCD es el último divisor, el que da resto 0.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), g = r.de([3, 4, 6, 7, 8, 9, 11, 12]);
        let m = r.ent(5, 13), n = r.ent(2, m - 1);
        while (mcd(m, n) !== 1) n = n > 2 ? n - 1 : m - 1;
        const a = g * m, b = g * n, ps = euclides(a, b);
        if (s % 2 === 0) return {
          pregunta: ['Usa divisiones sucesivas para hallar el MCD de ', { v: 'c-o', t: String(a) }, ' y ', { v: 'c-i', t: String(b) }, '.'],
          opciones: opciones(g, [
            { id: 'resto', valor: ps[0].r, error: 'AT-EUCLIDES', siFuera: 'Ese es el primer resto; hay que seguir hasta que el resto sea 0.' },
            { id: 'cociente', valor: ps[0].q, error: 'AT-COCIENTE', siFuera: 'El cociente no es una medida común; lo es el último divisor.' },
            { id: 'mcm', valor: mcm(a, b), error: 'AR13', siFuera: 'Ese es el MCM, el menor múltiplo común.' },
          ], String),
          solucion: { texto: 'El último divisor, el que deja resto 0.', ecuacion: [ps.map(p => `${p.a} = ${p.q} · ${p.b} + ${p.r}`).join(';   ')], dibujo: { datos: tirasEuclides(a, b), estado: { paso: 4 } } },
        };
        return {
          pregunta: ['Al dividir ', { v: 'c-o', t: String(a) }, ' entre ', { v: 'c-i', t: String(b) }, ` el cociente es ${ps[0].q} y el resto ${ps[0].r}. ¿Qué par tiene el mismo MCD y es menor?`],
          opciones: opciones(`(${b}, ${ps[0].r})`, [
            { id: 'cociente', valor: `(${b}, ${ps[0].q})`, error: 'AT-COCIENTE', siFuera: 'El cociente cuenta veces; el que sigue midiendo es el resto.' },
            { id: 'a-r', valor: `(${a}, ${ps[0].r})`, error: 'AT-EUCLIDES', siFuera: 'Se conserva el divisor b, no el dividendo a.' },
            { id: 'q-r', valor: `(${ps[0].q}, ${ps[0].r})`, error: 'AT-COCIENTE', siFuera: 'El par nuevo es divisor y resto, no cociente y resto.' },
          ], String),
          solucion: { texto: 'El divisor pasa a dividendo y el resto, a divisor.', ecuacion: [MCD, `(${a}, ${b}) = `, MCD, `(${b}, ${ps[0].r})`] },
        };
      },
    },
  };

  // ---------- Idea 4: mcd · mcm = a · b, solo con dos números ----------
  // Cambia: a y b (números con primos 2, 3 y 5). Permanece: la tabla de exponentes.
  // Progresa: exponentes de a y b → menor y mayor de cada fila → productos. Se reserva: el tercer número que rompe la regla.
  // Debe verse: en cada fila, menor + mayor = los dos exponentes.
  const PRIMOS = [2, 3, 5];
  const exp = (n, p) => { let e = 0; while (n % p === 0) { n /= p; e++; } return e; };
  const tablaDos = (a, b, pasoMin = 0) => ({
    columnas: [{ t: 'primo' }, { t: String(a), color: 'o' }, { t: String(b), color: 'i' }, { t: 'menor', color: 'd' }, { t: 'mayor', color: 'h' }],
    filas: [...PRIMOS.map(p => [p, exp(a, p), exp(b, p), { t: String(Math.min(exp(a, p), exp(b, p))), color: 'd', paso: pasoMin }, { t: String(Math.max(exp(a, p), exp(b, p))), color: 'h', paso: pasoMin }]),
      ['valor', { t: String(a), color: 'o' }, { t: String(b), color: 'i' }, { t: String(mcd(a, b)), color: 'd', resalta: true, paso: pasoMin + 1 }, { t: String(mcm(a, b)), color: 'h', resalta: true, paso: pasoMin + 1 }]],
    filasMax: 4, cabeza: true,
  });
  const tablaTres = {
    columnas: [{ t: 'primo' }, { t: '4' }, { t: '6' }, { t: '10' }, { t: 'menor', color: 'd' }, { t: 'mayor', color: 'h' }],
    filas: [[2, 2, 1, 1, { t: '1', color: 'd' }, { t: '2', color: 'h', paso: 0 }], [3, 0, 1, 0, { t: '0', color: 'd' }, { t: '1', color: 'h' }], [5, 0, 0, 1, { t: '0', color: 'd' }, { t: '1', color: 'h' }],
      ['valor', '4', '6', '10', { t: '2', color: 'd', resalta: true, paso: 1 }, { t: '60', color: 'h', resalta: true, paso: 1 }]],
    filasMax: 4, cabeza: true,
  };
  const relacion = {
    id: 'mcd-por-mcm',
    titulo: 'MCD por MCM, con dos números',
    temas: ['Relación entre MCD y MCM'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige a y b. La tabla muestra sus exponentes; el MCD toma el menor de cada fila y el MCM, el mayor.',
      voz: 'Compara, en cada fila, el menor más el mayor con los dos exponentes.',
      controles: [
        { id: 'a', etiqueta: 'a', opciones: [12, 18, 20, 30, 45].map(x => ({ valor: x, texto: String(x) })) },
        { id: 'b', etiqueta: 'b', opciones: [8, 15, 24, 40, 50].map(x => ({ valor: x, texto: String(x) })) },
      ],
      dibujo: v => ({ datos: tablaDos(v.a, v.b), estado: { paso: 2 } }),
      lectura: v => [MCD, ' · ', MCM, ` = ${mcd(v.a, v.b)} · ${mcm(v.a, v.b)} = ${mcd(v.a, v.b) * mcm(v.a, v.b)} = ${v.a} · ${v.b}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Para 4, 6 y 10, el MCD es 2 y el MCM es 60. ¿El producto MCD · MCM es igual a 4 · 6 · 10?',
      opciones: [
        { id: 'c', texto: 'No: 2 · 60 = 120 y 4 · 6 · 10 = 240', correcta: true },
        { id: 'si', texto: 'Sí, siempre es igual al producto', error: 'AT-TRES', siFuera: 'Es cierto con dos números. Con tres, un exponente del medio no entra ni al menor ni al mayor.' },
        { id: 'mitad', texto: 'Sí, si se divide entre 2', error: 'AT-TRES', siFuera: 'Aquí falta un 2, pero en otros tríos falta otro factor: no hay arreglo fijo.' },
      ],
      dibujo: { datos: tablaTres, estado: { paso: 0 } },
      revelar: { datos: tablaTres, estado: { paso: 1, fila: 0 } },
      coincide: 'Coincide: en la fila del 2 hay tres exponentes (2, 1, 1) y solo entran el menor y el mayor.',
    },
    mira: {
      datos: tablaDos(12, 18, 1),
      pasos: [
        { estado: { paso: 0 }, texto: '12 = 2² · 3 y 18 = 2 · 3²: sus exponentes en la tabla.', ecuacion: ['12 = ', { sup: ['2', '2'] }, ' · 3;   18 = 2 · ', { sup: ['3', '2'] }] },
        { estado: { paso: 1, columna: 3 }, texto: 'En cada fila, el MCD toma el menor y el MCM, el mayor.', ecuacion: [MCD, ' = 2 · 3 = 6;   ', MCM, ' = ', { sup: ['2', '2'] }, ' · ', { sup: ['3', '2'] }, ' = 36'] },
        { estado: { paso: 2 }, texto: 'Menor más mayor son los dos exponentes: no se pierde ninguno.', ecuacion: ['6 · 36 = 216 = 12 · 18'] },
      ],
    },
    regla: {
      texto: 'Para dos números, el MCD y el MCM se reparten los exponentes de cada primo sin perder ninguno. Por eso su producto es a · b.',
      ecuacion: [mcdab, ' · ', mcmab, ' = ', A, ' · ', Bv],
      condicion: 'vale solo con dos enteros positivos. Con tres o más, el producto de todos no es MCD · MCM.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), g = r.de([2, 3, 4, 5, 6, 7, 8, 9, 12]);
        let m = r.ent(2, 7), n = r.ent(2, 9);
        while (mcd(m, n) !== 1 || m === n) n = n % 9 + 2;
        const a = g * m, b = g * n, c = mcm(a, b);
        if (s % 2 === 0) return {
          pregunta: ['Dos números positivos tienen producto ', `${a * b}`, ' y su MCD es ', { v: 'c-d', t: String(g) }, '. ¿Cuál es su MCM?'],
          opciones: opciones(c, [
            { id: 'producto', valor: a * b * g, error: 'AT-RELACION', siFuera: 'Eso multiplica por el MCD; el MCM sale de dividir el producto entre él.' },
            { id: 'cuadrado', valor: a * b / (g * g), error: 'AT-RELACION', siFuera: 'Eso divide dos veces entre el MCD.' },
            { id: 'prod', valor: a * b, error: 'AT-RELACION', siFuera: 'El producto es MCD · MCM, no el MCM solo.' },
          ], String),
          solucion: { texto: 'El producto es MCD por MCM.', ecuacion: [MCM, ` = ${a * b} ÷ ${g} = ${c}`] },
        };
        return {
          pregunta: ['El MCD de ', { v: 'c-o', t: String(a) }, ' y otro número es ', { v: 'c-d', t: String(g) }, ' y su MCM es ', { v: 'c-h', t: String(c) }, '. ¿Cuál es el otro número?'],
          opciones: opciones(b, [
            { id: 'cociente', valor: c / g, error: 'AT-RELACION', siFuera: 'Eso es MCM entre MCD; falta multiplicar por el MCD y dividir entre a.' },
            { id: 'sin-mcd', valor: c / a, error: 'AT-RELACION', siFuera: 'Eso olvida el MCD: a · b = MCD · MCM.' },
            { id: 'prod', valor: g * c, error: 'AT-RELACION', siFuera: 'Ese es MCD · MCM, que es a · b; falta dividir entre a.' },
          ], String),
          solucion: { texto: 'Se despeja de a · b = MCD · MCM.', ecuacion: [Bv, ` = ${g} · ${c} ÷ ${a} = ${b}`] },
        };
      },
    },
  };

  // ---------- Idea 5: la fracción continua sale de los cocientes de Euclides ----------
  // Cambia: la fracción a/b. Permanece: la tabla de divisiones. Progresa: cociente por cociente, y los
  // convergentes que se acercan. Se reserva: el último convergente, el único igual a a/b. Debe verse: cortar antes da otro número.
  function convergentes(qs) {
    const out = [];
    let [h1, h0, k1, k0] = [1, 0, 0, 1];
    for (const q of qs) { const h = q * h1 + h0, k = q * k1 + k0; out.push([h, k]); [h0, h1, k0, k1] = [h1, h, k1, k]; }
    return out;
  }
  const fr = ([h, k]) => (k === 1 ? String(h) : `${h}/${k}`);
  const tablaFC = (a, b, pasoConv = 0) => {
    const ps = euclides(a, b), cv = convergentes(ps.map(p => p.q));
    return {
      columnas: [{ t: 'división' }, { t: 'cociente', color: 'd' }, { t: 'resto', color: 'h' }, { t: 'corte' }],
      filas: ps.map((p, k) => [`${p.a} ÷ ${p.b}`, { t: String(p.q), color: 'd', resalta: true }, { t: String(p.r), color: 'h' }, { t: fr(cv[k]), paso: pasoConv + k }]),
      filasMax: 5,
    };
  };
  const fcIdea = {
    id: 'fraccion-continua',
    titulo: 'Los cocientes arman una fracción',
    temas: ['Fracciones continuas'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige la fracción. Las divisiones de Euclides dan los cocientes, que se leen en orden como fracción continua.',
      voz: 'Mira la columna del corte: se acerca, pero solo la última es igual.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 20, max: 60, paso: 1, inicio: 30, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 7, max: 19, paso: 1, inicio: 18, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaFC(v.a, v.b), estado: { paso: 6 } }),
      lectura: v => { const qs = euclides(v.a, v.b).map(p => p.q); return [`${v.a}/${v.b} = [${qs[0]}${qs.length > 1 ? '; ' + qs.slice(1).join(', ') : ''}]`]; },
      minimo: 3,
    },
    predice: {
      pregunta: '30/18 = 1 + 1/(1 + 1/2), que se escribe [1; 1, 2]. Si se corta en [1; 1], es decir 1 + 1/1, ¿qué número da?',
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'igual', texto: '5/3, el mismo valor', error: 'AT-CONVERGENTE', siFuera: 'Sería cierto si cortar no cambiara nada; un corte es una aproximación.' },
        { id: 'medio', texto: '3/2', error: 'AT-CONVERGENTE', siFuera: '3/2 es 1 + 1/2: salta el segundo cociente.' },
        { id: 'uno', texto: '1', error: 'AT-CONVERGENTE', siFuera: '1 es el corte en [1]; [1; 1] suma 1/1.' },
      ],
      dibujo: { datos: tablaFC(30, 18, 9), estado: { paso: 0 } },
      revelar: { datos: tablaFC(30, 18), estado: { paso: 6, fila: 1 } },
      coincide: 'Coincide: 1 + 1/1 = 2; recién el último corte da 5/3.',
    },
    mira: {
      datos: tablaFC(30, 18, 1),
      pasos: [
        { estado: { paso: 0 }, texto: 'Euclides con 30 y 18 da los cocientes 1, 1 y 2.', ecuacion: ['30 = 1 · 18 + 12;   18 = 1 · 12 + 6;   12 = 2 · 6'] },
        { estado: { paso: 1 }, texto: 'Primer corte: solo la parte entera.', ecuacion: ['[1] = 1'] },
        { estado: { paso: 2 }, texto: 'Segundo corte: 1 + 1/1.', ecuacion: ['[1; 1] = 1 + ', { frac: ['1', '1'] }, ' = 2'] },
        { estado: { paso: 3 }, texto: 'Con todos los cocientes sale el valor exacto.', ecuacion: ['[1; 1, 2] = 1 + ', { frac: ['1', ['1 + ', { frac: ['1', '2'] }]] }, ' = ', { frac: ['5', '3'] }, ' = ', { frac: ['30', '18'] }] },
      ],
    },
    regla: {
      texto: 'Los cocientes de Euclides son los términos de la fracción continua de a/b. Cada corte da un convergente; solo el último es igual a a/b.',
      ecuacion: [{ frac: [A, Bv] }, ' = ', { sub: ['q', '0'] }, ' + ', { frac: ['1', [{ sub: ['q', '1'] }, ' + ', { frac: ['1', [{ sub: ['q', '2'] }, ' + …']] }]] }],
      condicion: 'a/b es un racional positivo: la fracción continua es finita. Los cortes intermedios son aproximaciones.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let a, b, ps;
        do { b = r.ent(5, 19); a = r.ent(b + 1, 3 * b + 9); ps = euclides(a, b); } while (mcd(a, b) !== 1 || ps.length < 2 || ps.length > 4);
        const qs = ps.map(p => p.q), cv = convergentes(qs);
        const lista = xs => `[${xs[0]}${xs.length > 1 ? '; ' + xs.slice(1).join(', ') : ''}]`;
        if (s % 2 === 0) return {
          pregunta: ['¿Cuál es la fracción continua de ', { frac: [{ v: 'c-o', t: String(a) }, { v: 'c-i', t: String(b) }] }, '?'],
          opciones: opciones(lista(qs), [
            { id: 'restos', valor: lista([qs[0], ...ps.slice(0, -1).map(p => p.r)]), error: 'AT-COCIENTE', siFuera: 'Eso pone los restos; los términos son los cocientes.' },
            { id: 'invertido', valor: lista(qs.slice().reverse()), error: 'AT-CONVERGENTE', siFuera: 'Los cocientes van en el orden en que salen.' },
            { id: 'corto', valor: lista(qs.slice(0, -1)), error: 'AT-CONVERGENTE', siFuera: 'Falta el último cociente, el de resto 0.' },
          ], String),
          solucion: { texto: 'Los cocientes de las divisiones sucesivas, en orden.', ecuacion: [ps.map(p => `${p.a} = ${p.q} · ${p.b} + ${p.r}`).join(';   ')], dibujo: { datos: tablaFC(a, b), estado: { paso: 6 } } },
        };
        const corte = cv[cv.length - 2];
        return {
          pregunta: [{ frac: [String(a), String(b)] }, ` = ${lista(qs)}. ¿Qué fracción da si se quita el último término?`],
          opciones: opciones(fr(corte), [
            { id: 'igual', valor: `${a}/${b}`, error: 'AT-CONVERGENTE', siFuera: 'Sin el último término el valor cambia: es una aproximación.' },
            { id: 'entero', valor: String(qs[0]), error: 'AT-CONVERGENTE', siFuera: 'Ese es el primer corte, solo la parte entera.' },
            { id: 'otro', valor: fr([corte[0] + 1, corte[1]]), error: 'AT-CONVERGENTE', siFuera: 'Revisa la cuenta de abajo hacia arriba, término por término.' },
          ], String),
          solucion: { texto: 'Se calcula de abajo hacia arriba sin el último término.', ecuacion: [`${lista(qs.slice(0, -1))} = ${fr(corte)}`], dibujo: { datos: tablaFC(a, b), estado: { paso: 6, fila: qs.length - 2 } } },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.mcd-y-mcm',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tiras.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/arit-tabla.js'],
    historia: {
      texto: 'En el libro VII de los Elementos, el máximo común divisor aparece como la mayor medida común de dos números. Euclides lo busca quitando de una cantidad lo que cabe de la otra, con segmentos y restas. La división con resto de hoy comprime esas restas repetidas. El mínimo común múltiplo responde a la pregunta contraria: la primera cantidad que se arma entera con ambas medidas.',
      pregunta: '¿Qué medida cabe exacta en dos cintas distintas?',
      fuente: { titulo: 'Euclides, Elementos VII.2; edición y comentario de David E. Joyce — Clark University', url: 'https://mathcs.clarku.edu/~djoyce/elements/bookVII/propVII2.html' },
    },
    ideas: [trozo, buses, euclidesIdea, relacion, fcIdea],
  };
});
