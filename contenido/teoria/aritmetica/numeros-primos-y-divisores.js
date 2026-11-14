/*
 * Teoría de «Números primos y divisores» (aritmetica.numeros-primos-y-divisores). Molde: docs/teoria.md;
 * modelo de forma: porcentajes.js. Fuente: docs/teoria/matriz/aritmetica.json (unidad 14) y
 * docs/teoria/fuentes/historia-ecuaciones.pdf. Errores: los AT-* son hipótesis nuevas (la matriz marca «contar el 1
 * como primo» y «usar Euler cuando base y módulo comparten un factor»).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver los divisores como rectángulos y como elecciones de exponentes, y los primos como lo que la criba no tacha.
 *   Persona y condiciones: postulante de 3.º, celular de 360 px, sin calculadora.
 *   Resultado observable: clasifica primos, factoriza, cuenta y suma divisores, calcula φ(n) y usa Fermat y Wilson con su condición.
 *   Orden de atención: 1.º la figura (rectángulos o tabla) · 2.º lo que se tacha o se elige · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué el 1 no es primo, por qué (a + 1)(b + 1), y cuándo vale Fermat?».
 * Colores (regla 4): n naranja (c-o), los primos p turquesa (c-i), los exponentes a, b rojo (c-h), el resultado verde (c-d).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const n_ = { v: 'c-o', t: 'n' }, p = { v: 'c-i', t: 'p' }, q = { v: 'c-i', t: 'q' }, ea = { v: 'c-h', t: 'a' }, eb = { v: 'c-h', t: 'b' };
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = x => String(x).split('').map(c => SUP[+c]).join('');
  const mcd = (x, y) => (y ? mcd(y, x % y) : Math.abs(x));
  const esPrimo = x => { if (x < 2) return false; for (let k = 2; k * k <= x; k++) if (x % k === 0) return false; return true; };
  const divisores = x => { const out = []; for (let k = 1; k <= x; k++) if (x % k === 0) out.push(k); return out; };
  const factores = x => { const out = []; for (let k = 2; x > 1; k++) { let e = 0; while (x % k === 0) { x /= k; e++; } if (e) out.push([k, e]); } return out; };
  const escribir = fs => fs.map(([b, e]) => (e > 1 ? `${b}${sup(e)}` : String(b))).join(' · ');
  const phi = x => { let c = 0; for (let k = 1; k <= x; k++) if (mcd(k, x) === 1) c++; return c; };
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

  // ---------- Idea 1: primo, un solo rectángulo (primos y compuestos) ----------
  // Cambia: n. Permanece: el tamaño de cada ficha.
  // Progresa: todos los rectángulos de n fichas, de 1 fila hacia el cuadrado. Se reserva: el 1, que no arma dos.
  // Debe verse: un primo solo se acomoda en una fila.
  const rectangulos = nv => {
    const bs = [];
    for (let a = 1; a * a <= nv; a++) if (nv % a === 0) bs.push({ n: nv, columnas: nv / a, color: a === 1 ? 'i' : 'o', rotulo: `${a}×${nv / a}` });
    return { bloques: bs.slice(-3), altoMax: 120, ficha: 22, alt: `${nv} fichas: ${bs.length} rectángulos distintos (${bs.map(b => b.rotulo).join(', ')})` };
  };
  const primos = {
    id: 'rectangulos',
    titulo: 'Primo: una sola fila',
    temas: ['Primos y compuestos'],
    pieza: 'arit-fichas',
    juega: {
      consigna: 'Elige cuántas fichas hay. Se dibujan los rectángulos que se pueden armar con todas, sin que sobre ninguna.',
      voz: 'Busca números que solo se acomoden en una fila.',
      controles: [{ id: 'n', etiqueta: 'n', color: 'c-o', min: 2, max: 30, paso: 1, inicio: 12, decimales: 0 }],
      dibujo: v => ({ datos: rectangulos(v.n), estado: {} }),
      lectura: v => { const d = divisores(v.n).length; return [`${v.n} tiene ${d} divisores: `, { v: 'c-d', t: d === 2 ? 'primo' : 'compuesto' }]; },
      minimo: 3,
    },
    predice: {
      pregunta: '¿El número 1 es primo?',
      opciones: [
        { id: 'c', texto: 'No: ni primo ni compuesto', correcta: true },
        { id: 'si', texto: 'Sí: solo se divide entre 1 y sí mismo', error: 'AT-UNO', siFuera: 'Para el 1, «1 y sí mismo» son el mismo divisor: tiene uno solo, no dos.' },
        { id: 'compuesto', texto: 'No: es compuesto', error: 'AT-UNO', siFuera: 'Un compuesto tiene más de dos divisores. El 1 tiene uno.' },
      ],
      dibujo: { datos: rectangulos(7), estado: {} },
      revelar: { datos: rectangulos(1), estado: {} },
      coincide: 'Coincide: el 1 tiene un solo divisor; un primo necesita exactamente dos.',
    },
    mira: {
      datos: { bloques: [
        { n: 1, columnas: 1, color: 'h', rotulo: '1: un divisor' },
        { n: 7, columnas: 7, color: 'i', rotulo: '7: dos', paso: 1 },
        { n: 6, columnas: 3, color: 'o', rotulo: '6: cuatro', paso: 2 },
      ], altoMax: 60, ficha: 24, alt: 'Una ficha; siete fichas en una fila; seis fichas en dos filas de tres' },
      pasos: [
        { estado: { paso: 0 }, texto: 'El 1 tiene un solo divisor: no es primo ni compuesto.', ecuacion: ['divisores de 1: {1}'] },
        { estado: { paso: 1 }, texto: 'El 7 solo arma 1 × 7: tiene dos divisores, es primo.', ecuacion: ['divisores de 7: {1, 7}'] },
        { estado: { paso: 2 }, texto: 'El 6 también arma 2 × 3: tiene más de dos, es compuesto.', ecuacion: ['divisores de 6: {1, 2, 3, 6}'] },
      ],
    },
    regla: {
      texto: 'Un primo es un entero mayor que 1 con exactamente dos divisores positivos: 1 y él mismo. Si tiene más, es compuesto.',
      ecuacion: [p, ' primo  ⇔  ', p, ' > 1 y sus divisores son {1, ', p, '}'],
      condicion: 'el 1 no es primo ni compuesto. Para descartar un primo, basta probar divisores hasta su raíz cuadrada.',
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), primosL = [53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113];
        const engañosos = [51, 57, 87, 91, 93, 111, 119, 117, 133, 143].filter(x => !esPrimo(x));
        const c = g.de(primosL), ds = [];
        while (ds.length < 3) { const x = g.de(engañosos); if (!ds.includes(x)) ds.push(x); }
        return {
          pregunta: '¿Cuál de estos números es primo?',
          opciones: opciones(c, ds.map((x, i) => {
            const fx = factores(x)[0][0];
            return { id: `d${i}`, valor: x, error: 'AT-PRIMO', siFuera: `${x} parece primo, pero ${x} = ${fx} · ${x / fx}.` };
          })),
          solucion: { texto: `${c} no es divisible entre ningún primo hasta su raíz.`, ecuacion: [`√${c} < ${Math.floor(Math.sqrt(c)) + 1}`] },
        };
      },
    },
  };

  // ---------- Idea 2: la criba tacha múltiplos (criba de Eratóstenes) ----------
  // Cambia: hasta qué primo se tacha. Permanece: la grilla de 1 a 60.
  // Progresa: múltiplos de 2, de 3, de 5, de 7. Se reserva: que el siguiente primo empieza a tachar en su cuadrado.
  // Debe verse: lo que queda sin tachar son primos.
  const grilla = (N, hasta) => {
    const filas = [];
    for (let i = 0; i < N / 10; i++) filas.push(Array.from({ length: 10 }, (_, j) => {
      const x = 10 * i + j + 1;
      const menor = x > 1 ? factores(x)[0][0] : 0;
      const tachado = x === 1 || (menor <= hasta && menor !== x);
      const primoVisto = esPrimo(x) && x <= hasta;
      return { t: String(x), tenue: tachado, resalta: primoVisto, color: primoVisto ? 'i' : undefined };
    }));
    return { columnas: Array.from({ length: 10 }, () => ''), filas, filasMax: N / 10, alt: `Números del 1 al ${N}; tachados los múltiplos de los primos hasta ${hasta}` };
  };
  const tablaCriba = N => {
    const ps = [2, 3, 5, 7, 11, 13].filter(x => x * x <= N * 1.25 + 30), filasT = [];
    let tach = new Set([1]);
    ps.forEach((pp, i) => {
      if (pp * pp > N) { filasT.push([{ t: String(pp), color: 'i', paso: i + 1 }, { t: `${pp * pp} > ${N}`, paso: i + 1 }, { t: 'se detiene', color: 'd', paso: i + 1 }]); return; }
      let nuevos = 0; for (let x = pp * pp; x <= N; x += pp) if (!tach.has(x)) { tach.add(x); nuevos++; }
      filasT.push([{ t: String(pp), color: 'i', paso: i + 1 }, { t: String(pp * pp), paso: i + 1 }, { t: `${nuevos} nuevos`, paso: i + 1 }]);
    });
    filasT.push([{ t: 'quedan', paso: ps.length + 1 }, '', { t: `${N - tach.size} primos`, color: 'd', resalta: true, paso: ps.length + 1 }]);
    return { datos: { columnas: [{ t: 'primo', color: 'i' }, { t: 'tacha desde' }, { t: 'tachados' }], filas: filasT, filasMax: 6 }, pasos: ps.length + 1 };
  };
  const criba100 = tablaCriba(100);
  const criba = {
    id: 'criba',
    titulo: 'La criba tacha múltiplos',
    temas: ['Criba de Eratóstenes'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige hasta qué primo se tachan múltiplos. Los tachados se apagan; los primos ya usados se resaltan.',
      voz: 'Mira qué tacha cada primo nuevo.',
      controles: [{ id: 'p', etiqueta: 'tachar hasta', opciones: [{ valor: 2, texto: '2' }, { valor: 3, texto: '3' }, { valor: 5, texto: '5' }, { valor: 7, texto: '7' }] }],
      dibujo: v => ({ datos: grilla(60, v.p), estado: {} }),
      lectura: v => { let c = 0; for (let x = 2; x <= 60; x++) if (factores(x)[0][0] > v.p || esPrimo(x)) c++; return [`Sin tachar: ${c} números de 60`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Para hallar todos los primos hasta 100 con la criba, ¿hasta qué primo basta tachar múltiplos?',
      opciones: [
        { id: 'c', texto: 'Hasta 7', correcta: true },
        { id: 'mitad', texto: 'Hasta 47', error: 'AT-CRIBA', siFuera: 'Sería cierto si cada primo empezara a tachar en su doble. Empieza en su cuadrado.' },
        { id: 'todos', texto: 'Hasta 97', error: 'AT-CRIBA', siFuera: '97 no tacha nada nuevo: su primer múltiplo sin tachar sería 97², fuera de la lista.' },
        { id: 'once', texto: 'Hasta 11', error: 'AT-CRIBA', siFuera: '11 empezaría en 121, que ya pasa de 100.' },
      ],
      dibujo: { datos: criba100.datos, estado: { paso: 0 } },
      revelar: { datos: criba100.datos, estado: { paso: criba100.pasos } },
      coincide: 'Coincide: 7² = 49 está en la lista; 11² = 121 ya no.',
    },
    mira: {
      datos: criba100.datos,
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'El 2 tacha sus múltiplos desde 4.', ecuacion: ['4, 6, 8, …, 100'] },
        { estado: { paso: 2, fila: 1 }, texto: 'El 3 empieza en 9: 6 ya estaba tachado por el 2.', ecuacion: [{ sup: ['3', '2'] }, ' = 9'] },
        { estado: { paso: 4, fila: [2, 3] }, texto: 'El 5 empieza en 25 y el 7, en 49.', ecuacion: [{ sup: ['7', '2'] }, ' = 49 ≤ 100'] },
        { estado: { paso: criba100.pasos, fila: [4, 5] }, texto: 'El 11 empezaría en 121: ya no hay nada que tachar.', ecuacion: [{ sup: ['11', '2'] }, ' = 121 > 100'] },
      ],
    },
    regla: {
      texto: 'La criba tacha los múltiplos de cada primo empezando en su cuadrado. Basta usar los primos hasta la raíz cuadrada del límite.',
      ecuacion: [p, ' tacha desde ', { sup: [p, '2'] }, '   ·   se usan los ', p, ' ≤ √N'],
      condicion: 'los menores que p² ya fueron tachados por un primo más chico. Lo que queda sin tachar, menos el 1, son primos.',
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), N = g.ent(40, 400), ps = [2, 3, 5, 7, 11, 13, 17, 19].filter(x => x * x <= N), c = ps[ps.length - 1];
        const sig = [2, 3, 5, 7, 11, 13, 17, 19, 23][ps.length];
        return {
          pregunta: `Para hallar todos los primos hasta ${N} con la criba, ¿hasta qué primo basta tachar múltiplos?`,
          opciones: opciones(c, [
            { id: 'siguiente', valor: sig, error: 'AT-CRIBA', siFuera: `${sig}² = ${sig * sig} ya pasa de ${N}.` },
            { id: 'mitad', valor: Math.floor(N / 2), error: 'AT-CRIBA', siFuera: 'Cada primo empieza a tachar en su cuadrado, no en su doble.' },
            { id: 'raiz', valor: Math.round(Math.sqrt(N)) + 1, error: 'AT-CRIBA', siFuera: 'Se usan primos, y solo hasta la raíz.' },
          ], x => `Hasta ${x}`),
          solucion: { texto: `El mayor primo cuyo cuadrado no pasa de ${N}.`, ecuacion: [`${c}² = ${c * c} ≤ ${N} < ${sig * sig} = ${sig}²`] },
        };
      },
    },
  };

  // ---------- Idea 3: una sola factorización; PESI es no compartir primos ----------
  // Cambia: n. Permanece: la tabla de divisiones entre primos.
  // Progresa: se divide entre el menor primo posible hasta llegar a 1. Se reserva: dos números sin primos en común.
  // Debe verse: PESI habla de la pareja, no de que cada uno sea primo.
  const tablaFact = (nv, pasos) => {
    const fs = []; let x = nv, i = 0;
    for (let k = 2; x > 1; k++) while (x % k === 0) { i++; fs.push([{ t: String(x), color: 'o', paso: pasos ? i : 0 }, { t: String(k), color: 'i', paso: pasos ? i : 0 }, { t: String(x / k), paso: pasos ? i : 0 }]); x /= k; }
    return { columnas: [{ t: 'número', color: 'o' }, { t: '÷ primo', color: 'i' }, { t: 'queda' }], filas: fs, filasMax: 7, alt: `Divisiones sucesivas de ${nv} entre primos: ${nv} = ${escribir(factores(nv))}` };
  };
  const tablaPesi = (av, bv) => ({ columnas: [{ t: 'número' }, { t: 'primos' }], filas: [
    [{ t: String(av), color: 'o' }, { t: escribir(factores(av)), color: 'i' }],
    [{ t: String(bv), color: 'o' }, { t: escribir(factores(bv)), color: 'i' }],
    [{ t: 'mcd' }, { t: String(mcd(av, bv)), color: 'd', resalta: true, paso: 1 }],
  ], filasMax: 3, cabeza: true });
  const fact = {
    id: 'factorizacion',
    titulo: 'Una sola factorización',
    temas: ['Teorema fundamental de la aritmética', 'Números PESI'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige n. La tabla lo divide siempre entre el menor primo posible hasta llegar a 1.',
      voz: 'La columna turquesa es la factorización.',
      controles: [{ id: 'n', etiqueta: 'n', color: 'c-o', min: 12, max: 96, paso: 6, inicio: 36, decimales: 0 }],
      dibujo: v => ({ datos: tablaFact(v.n), estado: {} }),
      lectura: v => [{ v: 'c-o', t: String(v.n) }, ' = ', { v: 'c-i', t: escribir(factores(v.n)) }],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Son ', { v: 'c-o', t: '8' }, ' y ', { v: 'c-o', t: '15' }, ' primos entre sí (PESI)?'],
      opciones: [
        { id: 'c', texto: 'Sí: no comparten ningún primo', correcta: true },
        { id: 'no-primos', texto: 'No: ninguno de los dos es primo', error: 'AT-PESI', siFuera: 'PESI no pide que sean primos: pide que no compartan factores primos.' },
        { id: 'par', texto: 'No: 8 es par', error: 'AT-PESI', siFuera: 'Ser par importa solo si el otro también lo es. 15 es impar.' },
      ],
      dibujo: { datos: tablaPesi(8, 15), estado: { paso: 0 } },
      revelar: { datos: tablaPesi(8, 15), estado: { paso: 1 } },
      coincide: 'Coincide: 8 = 2³ y 15 = 3 · 5; su mcd es 1.',
    },
    mira: {
      datos: tablaFact(60, true),
      pasos: [
        { estado: { paso: 2, fila: [0, 1] }, texto: '60 se divide entre 2 dos veces.', ecuacion: ['60 = 2 · 2 · 15'] },
        { estado: { paso: 4, fila: [2, 3] }, texto: 'Después, 15 entre 3 y 5 entre 5: llega a 1.', ecuacion: ['15 = 3 · 5'] },
        { estado: { paso: 4 }, texto: 'Se empiece por donde se empiece, salen los mismos primos.', ecuacion: ['60 = ', { v: 'c-i', t: '2² · 3 · 5' }] },
      ],
    },
    regla: {
      texto: 'Todo entero mayor que 1 es un producto de primos, de una sola manera salvo el orden. Dos números son PESI si no comparten ningún primo.',
      ecuacion: [n_, ' = ', { sup: [p, ea] }, ' · ', { sup: [q, eb] }, ' · …   ·   PESI ⇔ mcd = 1'],
      condicion: 'PESI es una propiedad de la pareja: dos compuestos pueden serlo, y dos números iguales mayores que 1 nunca lo son.',
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s);
        if (s % 2 === 0) {
          const nv = g.de([2, 4, 8, 3, 9, 6, 12]) * g.de([5, 7, 25, 35, 11]);
          const fs = factores(nv);
          return {
            pregunta: ['¿Cuál es la factorización en primos de ', { v: 'c-o', t: String(nv) }, '?'],
            dibujo: { datos: tablaFact(nv), estado: {} },
            opciones: opciones(escribir(fs), [
              { id: 'compuesto', valor: fs.length > 1 ? `${fs[0][0] ** fs[0][1]} · ${nv / fs[0][0] ** fs[0][1]}` : null, error: 'AT-TFA', siFuera: 'Uno de esos factores todavía no es primo.' },
              { id: 'exp', valor: escribir(fs.map(([b, e]) => [b, e + 1])), error: 'AT-TFA', siFuera: 'Multiplica: ese producto pasa de n.' },
              { id: 'sin-exp', valor: fs.map(([b]) => b).join(' · '), error: 'AT-TFA', siFuera: 'Faltan exponentes: los primos se repiten.' },
            ]),
            solucion: { texto: 'Dividir entre primos hasta llegar a 1.', ecuacion: [`${nv} = ${escribir(fs)}`] },
          };
        }
        const pares = [[8, 15], [9, 16], [14, 25], [12, 35], [21, 22], [10, 21], [6, 15], [12, 18], [14, 21], [22, 33], [26, 39], [27, 49]];
        const [av, bv] = pares[g.ent(0, pares.length - 1)], si = mcd(av, bv) === 1;
        return {
          pregunta: ['¿Son ', { v: 'c-o', t: String(av) }, ' y ', { v: 'c-o', t: String(bv) }, ' PESI?'],
          opciones: opciones(si ? 'Sí' : 'No', [
            { id: 'contrario', valor: si ? 'No' : 'Sí', error: 'AT-PESI', siFuera: si ? 'Ninguno es primo, pero no comparten primos.' : `Comparten el factor ${mcd(av, bv)}.` },
            { id: 'depende', valor: 'Solo si alguno es primo', error: 'AT-PESI', siFuera: 'PESI no pide que alguno sea primo.' },
          ]),
          solucion: { texto: si ? 'No comparten primos: mcd = 1.' : `Comparten primos: mcd = ${mcd(av, bv)}.`, ecuacion: [`${av} = ${escribir(factores(av))} · ${bv} = ${escribir(factores(bv))}`], dibujo: { datos: tablaPesi(av, bv), estado: { paso: 1 } } },
        };
      },
    },
  };

  // ---------- Idea 4: elegir exponentes cuenta los divisores (cantidad, suma y producto) ----------
  // Cambia: los exponentes a y b de n = 2ᵃ · 3ᵇ. Permanece: la tabla con 2ⁱ en columnas y 3ʲ en filas.
  // Progresa: cada celda es un divisor distinto. Se reserva: el «+ 1» que trae el exponente 0.
  // Debe verse: hay (a + 1) columnas y (b + 1) filas.
  const tablaDiv = (a, b, con = true) => ({
    columnas: [{ t: '' }, ...Array.from({ length: a + 1 }, (_, i) => ({ t: `2${sup(i)}`, color: 'h' }))],
    filas: Array.from({ length: b + 1 }, (_, j) => [{ t: `3${sup(j)}`, color: 'h' }, ...Array.from({ length: a + 1 }, (_, i) => ({ t: String(2 ** i * 3 ** j), color: 'd', paso: con ? 0 : 1 }))]),
    filasMax: 4, cabeza: true, alt: `Divisores de 2 a la ${a} por 3 a la ${b}: una tabla de ${a + 1} columnas por ${b + 1} filas`,
  });
  const cantidad = {
    id: 'divisores',
    titulo: 'Elegir exponentes cuenta divisores',
    temas: ['Cantidad, suma y producto de divisores'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'n = 2ᵃ · 3ᵇ. Elige a y b. Cada celda junta una potencia de 2 con una de 3: es un divisor.',
      voz: 'Cuenta columnas y filas; no olvides el exponente 0.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-h', min: 0, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-h', min: 0, max: 3, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDiv(v.a, v.b), estado: {} }),
      lectura: v => [`n = ${2 ** v.a * 3 ** v.b} tiene ${v.a + 1} · ${v.b + 1} = `, { v: 'c-d', t: String((v.a + 1) * (v.b + 1)) }, ' divisores'],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuántos divisores positivos tiene 72 = 2³ · 3²?'],
      opciones: [
        { id: 'c', texto: '12', correcta: true },
        { id: 'producto', texto: '6', error: 'AT-EXP', siFuera: '3 · 2 olvida el exponente 0: el 2 puede ir 0, 1, 2 o 3 veces.' },
        { id: 'suma', texto: '5', error: 'AT-EXP', siFuera: '3 + 2 suma exponentes; las elecciones se multiplican.' },
        { id: 'mas', texto: '7', error: 'AT-EXP', siFuera: 'Cuenta otra vez: 4 elecciones para el 2 y 3 para el 3.' },
      ],
      dibujo: { datos: tablaDiv(3, 2, false), estado: { paso: 0 } },
      revelar: { datos: tablaDiv(3, 2, false), estado: { paso: 1 } },
      coincide: 'Coincide: 4 columnas por 3 filas.',
    },
    mira: {
      datos: tablaDiv(3, 2, false),
      pasos: [
        { estado: { paso: 0, columna: 1 }, texto: 'El 2 puede aparecer 0, 1, 2 o 3 veces: 4 columnas.', ecuacion: [ea, ' + 1 = 4'] },
        { estado: { paso: 1, fila: [0, 1, 2] }, texto: 'El 3, 0, 1 o 2 veces: 3 filas. Cada celda, un divisor.', ecuacion: ['d(72) = 4 · 3 = 12'] },
        { estado: { paso: 1 }, texto: 'La suma: cada fila suma lo mismo por su potencia de 3.', ecuacion: ['(1 + 2 + 4 + 8)(1 + 3 + 9) = 15 · 13 = 195'] },
        { estado: { paso: 1 }, texto: 'El producto: cada divisor se empareja con 72 entre él.', ecuacion: [{ sup: ['72', '12/2'] }, ' = ', { sup: ['72', '6'] }] },
      ],
    },
    regla: {
      texto: 'Si n = pᵃ · qᵇ, cada divisor elige un exponente de 0 a a y otro de 0 a b. La suma multiplica las sumas de potencias.',
      ecuacion: ['d(', n_, ') = (', ea, ' + 1)(', eb, ' + 1)   ·   σ(', n_, ') = (1 + … + ', { sup: [p, ea] }, ')(1 + … + ', { sup: [q, eb] }, ')'],
      condicion: 'p y q son primos distintos. El producto de todos los divisores es n elevado a d(n)/2.',
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), a = g.ent(1, 4), b = g.ent(1, 3), c = g.ent(0, 1), nv = 2 ** a * 3 ** b * 5 ** c;
        const d = (a + 1) * (b + 1) * (c + 1);
        const fsT = escribir(factores(nv));
        if (s % 2 === 0) return {
          pregunta: ['¿Cuántos divisores positivos tiene ', { v: 'c-o', t: String(nv) }, ` = ${fsT}?`],
          opciones: opciones(d, [
            { id: 'producto', valor: a * b * (c || 1), error: 'AT-EXP', siFuera: 'Falta el exponente 0 de cada primo: se suma 1 a cada exponente.' },
            { id: 'suma', valor: a + b + c + 1, error: 'AT-EXP', siFuera: 'Las elecciones se multiplican, no se suman.' },
            { id: 'primos', valor: factores(nv).length, error: 'AT-EXP', siFuera: 'Esos son los divisores primos, no todos.' },
          ]),
          solucion: { texto: 'Cada exponente más uno, multiplicados.', ecuacion: [`(${a} + 1)(${b} + 1)${c ? '(1 + 1)' : ''} = ${d}`] },
        };
        const sg = (pp, e) => (pp ** (e + 1) - 1) / (pp - 1), sigma = sg(2, a) * sg(3, b) * (c ? 6 : 1);
        return {
          pregunta: ['¿Cuánto suman los divisores positivos de ', { v: 'c-o', t: String(nv) }, ` = ${fsT}?`],
          opciones: opciones(sigma, [
            { id: 'sin-n', valor: sigma - nv, error: 'AT-SIGMA', siFuera: 'Eso deja fuera al propio n, que también es divisor.' },
            { id: 'sin-1', valor: sigma - 1, error: 'AT-SIGMA', siFuera: 'Eso deja fuera al 1.' },
            { id: 'cantidad', valor: d, error: 'AT-SIGMA', siFuera: 'Esa es la cantidad de divisores, no su suma.' },
          ], x => f(x)),
          solucion: { texto: 'Se multiplican las sumas de potencias de cada primo.', ecuacion: [`${sg(2, a)} · ${sg(3, b)}${c ? ' · 6' : ''} = ${f(sigma)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: φ(n) cuenta los que no comparten nada con n (función de Euler) ----------
  // Cambia: n. Permanece: la grilla de 1 a n.
  // Progresa: se apagan los múltiplos de cada primo de n. Se reserva: que φ no cuenta primos.
  // Debe verse: φ(n) = n por la fracción que sobrevive a cada primo.
  const grillaPhi = nv => {
    const filas = [];
    for (let i = 0; i < Math.ceil(nv / 6); i++) filas.push(Array.from({ length: 6 }, (_, j) => {
      const x = 6 * i + j + 1;
      if (x > nv) return '';
      const co = mcd(x, nv) === 1;
      return { t: String(x), resalta: co, color: co ? 'd' : undefined, tenue: !co };
    }));
    return { columnas: Array.from({ length: 6 }, () => ''), filas, filasMax: 5, alt: `Números del 1 al ${nv}; resaltados los ${phi(nv)} que no comparten factores con ${nv}` };
  };
  const euler = {
    id: 'euler',
    titulo: 'φ(n) cuenta los coprimos',
    temas: ['Función de Euler'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige n. Se resaltan los números de 1 a n que no comparten ningún primo con n.',
      voz: 'Compara un n primo con un n compuesto.',
      controles: [{ id: 'n', etiqueta: 'n', color: 'c-o', min: 13, max: 30, paso: 1, inicio: 15, decimales: 0 }],
      dibujo: v => ({ datos: grillaPhi(v.n), estado: {} }),
      lectura: v => ['φ(', { v: 'c-o', t: String(v.n) }, ') = ', { v: 'c-d', t: String(phi(v.n)) }],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuánto vale φ(', { v: 'c-o', t: '12' }, '), la cantidad de números de 1 a 12 que no comparten ningún factor primo con 12?'],
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'primos', texto: '5', error: 'AT-EULER', siFuera: '5 son los primos menores que 12. φ cuenta coprimos: el 1 sí cuenta; 2 y 3 no.' },
        { id: 'menos1', texto: '11', error: 'AT-EULER', siFuera: '11 sería φ de un primo. 12 comparte factores con muchos.' },
        { id: 'mitad', texto: '6', error: 'AT-EULER', siFuera: '6 quita solo los pares; también hay que quitar los múltiplos de 3.' },
      ],
      dibujo: { datos: { columnas: Array.from({ length: 6 }, () => ''), filas: [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12]], filasMax: 5 }, estado: {} },
      revelar: { datos: grillaPhi(12), estado: {} },
      coincide: 'Coincide: quedan 1, 5, 7 y 11.',
    },
    mira: {
      datos: grillaPhi(12),
      pasos: [
        { estado: { fila: [] }, texto: '12 = 2² · 3: se quitan los que comparten el 2 o el 3.', ecuacion: ['12 = 2² · 3'] },
        { estado: {}, texto: 'Sin los pares queda la mitad: 6 números.', ecuacion: ['12 · (1 − ½) = 6'] },
        { estado: {}, texto: 'De esos, un tercio es múltiplo de 3: quedan 4.', ecuacion: ['6 · (1 − ⅓) = ', { v: 'c-d', t: '4' }] },
      ],
    },
    regla: {
      texto: 'φ(n) cuenta los enteros de 1 a n que no comparten ningún primo con n. Cada primo de n deja la fracción 1 − 1/p.',
      ecuacion: ['φ(', n_, ') = ', n_, ' · (1 − ', { frac: ['1', { sub: [p, '1'] }] }, ') · (1 − ', { frac: ['1', { sub: [p, '2'] }] }, ') · …'],
      condicion: 'se usan los primos distintos de n, cada uno una vez. Si n es primo, φ(n) = n − 1.',
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), nv = g.de([10, 14, 15, 18, 20, 21, 24, 28, 30, 36, 40, 45, 50, 60, 72]), v = phi(nv);
        let pr = 0; for (let k = 2; k < nv; k++) if (esPrimo(k)) pr++;
        const ps = factores(nv).map(x => x[0]);
        return {
          pregunta: ['¿Cuánto vale φ(', { v: 'c-o', t: String(nv) }, ')?'],
          opciones: opciones(v, [
            { id: 'primos', valor: pr, error: 'AT-EULER', siFuera: 'Eso cuenta los primos menores que n, no los coprimos.' },
            { id: 'menos1', valor: nv - 1, error: 'AT-EULER', siFuera: `Eso sería si ${nv} fuera primo.` },
            { id: 'un-primo', valor: nv * (1 - 1 / ps[0]), error: 'AT-EULER', siFuera: 'Falta quitar los múltiplos de los otros primos.' },
          ]),
          solucion: { texto: `${nv} = ${escribir(factores(nv))}.`, ecuacion: [`${nv} · ${ps.map(x => `(1 − 1/${x})`).join(' · ')} = ${v}`], dibujo: nv <= 30 ? { datos: grillaPhi(nv), estado: {} } : undefined },
        };
      },
    },
  };
  euler.ahoraTu.pieza = 'arit-tabla';

  // ---------- Idea 6: Fermat y Wilson (potencias y factoriales módulo un primo) ----------
  // Cambia: el primo p. Permanece: la tabla a = 1 … p − 1.
  // Progresa: la columna de aᵖ⁻¹ (todo 1) y el producto acumulado hasta (p − 1)!. Se reserva: el último producto, p − 1.
  // Debe verse: la condición: p primo y a no múltiplo de p.
  const tablaFW = pp => ({
    columnas: [{ t: 'a', color: 'o' }, { t: `aᵖ⁻¹ ÷ ${pp}` }, { t: `1·…·a ÷ ${pp}` }],
    filas: Array.from({ length: pp - 1 }, (_, i) => {
      const a = i + 1; let fac = 1; for (let k = 1; k <= a; k++) fac = (fac * k) % pp;
      return [{ t: String(a), color: 'o' }, { t: String(powmod(a, pp - 1, pp)), color: 'd' }, { t: String(fac), color: a === pp - 1 ? 'h' : undefined, resalta: a === pp - 1 }];
    }),
    filasMax: 10, cabeza: true, alt: `Para p = ${pp}: a elevado a p − 1 deja resto 1 para todo a; el producto 1 · 2 · … · (p − 1) deja ${pp - 1}`,
  });
  const fermat = {
    id: 'fermat-wilson',
    titulo: 'Fermat y Wilson con un primo',
    temas: ['Teoremas de Fermat y Wilson'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige un primo p. La tabla da el resto de aᵖ⁻¹ y del producto 1 · 2 · … · a entre p.',
      voz: 'Mira la columna del medio y la última fila.',
      controles: [{ id: 'p', etiqueta: 'p', opciones: [{ valor: 5, texto: '5' }, { valor: 7, texto: '7' }, { valor: 11, texto: '11' }] }],
      dibujo: v => ({ datos: tablaFW(v.p), estado: {} }),
      lectura: v => [`(${v.p} − 1)! deja resto `, { v: 'c-h', t: String(v.p - 1) }, ` = −1`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Qué resto deja ', { sup: [{ v: 'c-o', t: '3' }, '100'] }, ' al dividirlo entre ', { v: 'c-i', t: '101' }, ', que es primo?'],
      opciones: [
        { id: 'c', texto: '1', correcta: true },
        { id: 'tres', texto: '3', error: 'AT-FERMAT', siFuera: '3 sería el resto de 3¹. Con exponente p − 1 = 100 el resto es 1.' },
        { id: 'cero', texto: '0', error: 'AT-FERMAT', siFuera: 'Sería cierto si 101 dividiera a 3. No comparten factores.' },
        { id: 'cien', texto: '100', error: 'AT-FERMAT', siFuera: '100 ≡ −1 es lo que deja (p − 1)!, por Wilson; no la potencia.' },
      ],
      dibujo: { datos: tablaFW(7), estado: { columna: 1 } },
      revelar: { datos: tablaFW(7), estado: { columna: 1 } },
      coincide: 'Coincide: 101 es primo y no divide a 3, así que 3¹⁰⁰ ≡ 1.',
    },
    mira: {
      datos: tablaFW(7),
      pasos: [
        { estado: { columna: 1 }, texto: 'Con p = 7, toda a de 1 a 6 cumple a⁶ ≡ 1.', ecuacion: [{ sup: ['a', '6'] }, ' ≡ 1  (mód 7)'] },
        { estado: { fila: 5 }, texto: 'El producto 1 · 2 · … · 6 deja 6, que es −1.', ecuacion: ['6! = 720 ≡ ', { v: 'c-h', t: '−1' }, '  (mód 7)'] },
        { estado: { fila: [] }, texto: 'Si n no es primo, falla: 4⁵ deja 4 entre 6.', ecuacion: [{ sup: ['4', '5'] }, ' = 1 024 ≡ 4  (mód 6)'] },
      ],
    },
    regla: {
      texto: 'Si p es primo y no divide a a, aᵖ⁻¹ deja resto 1 (Fermat). Además, (p − 1)! deja p − 1 (Wilson).',
      ecuacion: [{ sup: [ea, [p, ' − 1']] }, ' ≡ 1   ·   (', p, ' − 1)! ≡ −1   (mód ', p, ')'],
      condicion: 'Wilson vale solo si p es primo. Euler generaliza Fermat: a elevado a φ(n) ≡ 1 si mcd(a, n) = 1.',
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), pp = g.de([7, 11, 13, 17, 19, 23]), tipo = s % 3;
        if (tipo === 2) return {
          pregunta: ['¿Qué resto deja ', `(${pp - 2})!`, ' al dividirlo entre ', { v: 'c-i', t: String(pp) }, '?'],
          opciones: opciones(1, [
            { id: 'menos1', valor: pp - 1, error: 'AT-FERMAT', siFuera: `${pp - 1} es lo que deja (${pp - 1})!. Aquí falta el factor ${pp - 1}.` },
            { id: 'cero', valor: 0, error: 'AT-FERMAT', siFuera: `${pp} es primo y no aparece en el producto.` },
            { id: 'dos', valor: pp - 2, error: 'AT-FERMAT', siFuera: 'Ese es el último factor, no el resto del producto.' },
          ]),
          solucion: { texto: `(${pp - 1})! = (${pp - 1}) · (${pp - 2})! ≡ −1 y ${pp - 1} ≡ −1.`, ecuacion: [`(${pp - 2})! ≡ 1  (mód ${pp})`] },
        };
        const a = g.ent(2, pp - 1), e = g.ent(30, 200), v = powmod(a, e, pp), red = e % (pp - 1);
        return {
          pregunta: ['¿Qué resto deja ', { sup: [{ v: 'c-o', t: String(a) }, String(e)] }, ' entre ', { v: 'c-i', t: String(pp) }, '?'],
          opciones: opciones(v, [
            { id: 'uno', valor: 1, error: 'AT-FERMAT', siFuera: `Da 1 solo si el exponente es múltiplo de ${pp - 1}.` },
            { id: 'exp-p', valor: powmod(a, e % pp, pp), error: 'AT-FERMAT', siFuera: `El exponente se reduce entre ${pp - 1}, no entre ${pp}.` },
            { id: 'pos', valor: red, error: 'AT-CICLO', siFuera: 'Eso es el exponente reducido, no el resto.' },
          ]),
          solucion: { texto: `Por Fermat, el exponente se reduce entre ${pp - 1}.`, ecuacion: [{ sup: [String(a), String(e)] }, ' ≡ ', { sup: [String(a), String(red)] }, ` ≡ ${v}  (mód ${pp})`] },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.numeros-primos-y-divisores',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/arit-tabla.js'],
    historia: {
      texto: 'En los Elementos, Euclides prueba que ninguna lista finita contiene todos los primos. Toma los primos de la lista, los multiplica y suma 1. Ese número no es múltiplo de ninguno de ellos, así que tiene un divisor primo que faltaba. La prueba no dice que el resultado sea primo: dice que la lista estaba incompleta.',
      pregunta: '¿Se acabarán alguna vez los primos?',
      fuente: { titulo: 'Euclides, Elementos IX.20; edición y comentario de David E. Joyce — Clark University', url: 'https://mathcs.clarku.edu/~djoyce/elements/bookIX/propIX20.html' },
    },
    ideas: [primos, criba, fact, cantidad, euler, fermat],
  };
});
