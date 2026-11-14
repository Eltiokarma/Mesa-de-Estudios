/*
 * Teoría de «Cuatro operaciones» (aritmetica.cuatro-operaciones). Molde: docs/teoria.md; modelo de forma: porcentajes.js.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 12) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR7 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver por qué funcionan los atajos de las cuatro operaciones (sumatorias, complemento, llevadas, restos, cotas).
 *   Persona y condiciones: postulante de 3.º, celular de 360 px, sin audio, sin calculadora.
 *   Resultado observable: suma series de consecutivos, halla complementos y restos por exceso, opera en otra base y acota cifras.
 *   Orden de atención: 1.º la figura (fichas, recta o tabla) · 2.º lo que el paso agrega · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué n(n + 1)/2, por qué el resto por exceso no es el mismo, por qué 9 y 10 en el complemento?».
 * Colores (regla 4): el primer dato (n, N, a) naranja (c-o), el divisor o la base turquesa (c-i), el resto rojo (c-h),
 * el resultado verde (c-d).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const n_ = { v: 'c-o', t: 'n' }, N = { v: 'c-o', t: 'N' }, a = { v: 'c-o', t: 'a' }, dd = { v: 'c-i', t: 'd' };
  const q = { v: 'c-d', t: 'q' }, r = { v: 'c-h', t: 'r' }, re = { sub: [{ v: 'c-h', t: 'r' }, 'e'] }, bb = { v: 'c-i', t: 'b' };
  const SUB = '₀₁₂₃₄₅₆₇₈₉', subi = x => String(x).split('').map(c => SUB[+c]).join('');
  const enBase = (x, base) => { if (x === 0) return '0'; let s = ''; while (x > 0) { s = String(x % base) + s; x = Math.floor(x / base); } return s; };
  const valor = (c, base) => c.split('').reduce((v, x) => v * base + +x, 0);
  const nb = (c, base) => `(${c})${subi(base)}`;
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

  // ---------- Idea 1: dos escaleras forman un rectángulo (adición y sumatorias) ----------
  // Cambia: n, el largo de la escalera. Permanece: el tamaño de cada ficha.
  // Progresa: escalera → su copia girada → rectángulo n × (n + 1) → la mitad. Se reserva: dividir entre 2.
  // Debe verse: dos escaleras iguales llenan exactamente el rectángulo.
  const escaleras = (k, con = 2) => {
    const filas = Array.from({ length: k }, (_, i) => i + 1);
    const tramos = []; for (let i = 0; i < k; i++) tramos.push({ de: i * (k + 1) + i + 1, a: i * (k + 1) + k, color: 'h', paso: con >= 2 ? 0 : 99 });
    return { bloques: [
      { filas, color: 'i', rotulo: `1 + … + ${k}` },
      { n: k * (k + 1), columnas: k + 1, color: 'i', tramos, rotulo: `${k} × ${k + 1}`, paso: con >= 1 ? 0 : 99 },
    ], altoMax: 150, ficha: 26, alt: `Escalera de 1 a ${k} fichas; al lado, dos escaleras iguales forman un rectángulo de ${k} por ${k + 1}` };
  };
  const sumatorias = {
    id: 'sumatorias',
    titulo: 'Dos escaleras, un rectángulo',
    temas: ['Adición y sumatorias'],
    pieza: 'arit-fichas',
    juega: {
      consigna: 'Elige n. A la izquierda, la escalera 1 + 2 + … + n. A la derecha, dos escaleras iguales juntas.',
      voz: 'Cuenta las filas y las columnas del rectángulo.',
      controles: [{ id: 'n', etiqueta: 'n', color: 'c-o', min: 3, max: 9, paso: 1, inicio: 4, decimales: 0 }],
      dibujo: v => ({ datos: escaleras(v.n), estado: {} }),
      lectura: v => [`1 + … + ${v.n} = `, { v: 'c-d', t: String(v.n * (v.n + 1) / 2) }, ` · rectángulo ${v.n} × ${v.n + 1}`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuánto es 1 + 2 + 3 + … + 20?',
      opciones: [
        { id: 'c', texto: '210', correcta: true },
        { id: 'sin-mitad', texto: '420', error: 'AT-MITAD', siFuera: '420 son las dos escaleras juntas. La suma es una sola escalera.' },
        { id: 'cuadrado', texto: '200', error: 'AT-CUADRADO', siFuera: 'Sería cierto si el rectángulo fuera de 20 × 20. Es de 20 × 21.' },
        { id: 'menos', texto: '190', error: 'AT-CONTEO', siFuera: '190 llega hasta 19. Falta sumar el 20.' },
      ],
      dibujo: { datos: escaleras(5, 0), estado: {} },
      revelar: { datos: escaleras(5), estado: {} },
      coincide: 'Coincide: 20 × 21 entre 2 es 210.',
    },
    mira: {
      datos: { bloques: [
        { filas: [1, 2, 3, 4, 5], color: 'i', rotulo: '1 + … + 5' },
        { n: 30, columnas: 6, color: 'i', paso: 1, rotulo: '5 × 6', tramos: [0, 1, 2, 3, 4].map(i => ({ de: i * 6 + i + 1, a: i * 6 + 5, color: 'h', paso: 2 })) },
      ], altoMax: 150, ficha: 26, alt: 'Escalera de 1 a 5; rectángulo de 5 por 6 hecho con dos escaleras' },
      pasos: [
        { estado: { paso: 0 }, texto: 'La escalera 1 + 2 + 3 + 4 + 5 tiene 15 fichas.', ecuacion: ['1 + 2 + 3 + 4 + 5'] },
        { estado: { paso: 1 }, texto: 'Pongo otra igual, girada, encima de ella.', ecuacion: ['dos escaleras'] },
        { estado: { paso: 2 }, texto: 'Juntas llenan un rectángulo de 5 filas y 6 columnas.', ecuacion: ['5 · 6 = 30'] },
        { estado: { paso: 2 }, texto: 'Una escalera es la mitad del rectángulo.', ecuacion: [{ frac: ['5 · 6', '2'] }, ' = ', { v: 'c-d', t: '15' }] },
      ],
    },
    regla: {
      texto: 'La suma de 1 a n es la mitad de un rectángulo de n por n + 1. Para consecutivos de a hasta z: primero más último, por cuántos, entre 2.',
      ecuacion: ['1 + 2 + … + ', n_, ' = ', { frac: [[n_, '(', n_, ' + 1)'], '2'] }, '   ·   a + … + z = ', { frac: ['(a + z)(z − a + 1)', '2'] }],
      condicion: 'los sumandos son consecutivos (suben de 1 en 1). Con pares 2 + 4 + … + 2n, la suma es n(n + 1).',
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const k = g.ent(12, 60), v = k * (k + 1) / 2;
          return {
            pregunta: `¿Cuánto es 1 + 2 + 3 + … + ${k}?`,
            opciones: opciones(v, [
              { id: 'sin-mitad', valor: k * (k + 1), error: 'AT-MITAD', siFuera: 'Eso son dos escaleras. La suma es una sola.' },
              { id: 'cuadrado', valor: k * k / 2, error: 'AT-CUADRADO', siFuera: `El rectángulo es de ${k} × ${k + 1}, no de ${k} × ${k}.` },
              { id: 'menos', valor: (k - 1) * k / 2, error: 'AT-CONTEO', siFuera: `Eso llega hasta ${k - 1}.` },
            ], x => f(x)),
            solucion: { texto: 'La mitad del rectángulo de n por n + 1.', ecuacion: [{ frac: [`${k} · ${k + 1}`, '2'] }, ` = ${f(v)}`] },
          };
        }
        if (tipo === 1) {
          const lo = g.ent(10, 40), hi = lo + g.ent(9, 40), c = hi - lo + 1, v = (lo + hi) * c / 2;
          return {
            pregunta: `¿Cuánto es ${lo} + ${lo + 1} + ${lo + 2} + … + ${hi}?`,
            opciones: opciones(v, [
              { id: 'cuantos', valor: (lo + hi) * (hi - lo) / 2, error: 'AT-CONTEO', siFuera: `De ${lo} a ${hi} hay ${c} números, no ${hi - lo}.` },
              { id: 'desde-1', valor: hi * (hi + 1) / 2, error: 'AT-DESDE-1', siFuera: `Eso suma desde 1. Aquí se empieza en ${lo}.` },
              { id: 'sin-mitad', valor: (lo + hi) * c, error: 'AT-MITAD', siFuera: 'Falta dividir entre 2.' },
            ], x => f(x)),
            solucion: { texto: `Primero más último, por los ${c} sumandos, entre 2.`, ecuacion: [{ frac: [`(${lo} + ${hi}) · ${c}`, '2'] }, ` = ${f(v)}`] },
          };
        }
        const k = g.ent(10, 40), v = k * (k + 1);
        return {
          pregunta: `¿Cuánto es 2 + 4 + 6 + … + ${2 * k}?`,
          opciones: opciones(v, [
            { id: 'mitad', valor: k * (k + 1) / 2, error: 'AT-MITAD', siFuera: 'Esa es la suma de 1 a n; cada par es el doble.' },
            { id: 'hasta-2k', valor: 2 * k * (2 * k + 1) / 2, error: 'AT-CONTEO', siFuera: `Eso suma todos los números hasta ${2 * k}, también los impares.` },
            { id: 'cuadrado', valor: k * k, error: 'AT-CUADRADO', siFuera: 'Esa es la suma de los impares.' },
          ], x => f(x)),
          solucion: { texto: `Es el doble de 1 + … + ${k}.`, ecuacion: [`2 · `, { frac: [`${k} · ${k + 1}`, '2'] }, ` = ${f(v)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: lo que le falta para la potencia (sustracción y complemento aritmético) ----------
  // Cambia: N. Permanece: la recta de 0 a 10ᵏ, con k = cantidad de cifras de N.
  // Progresa: N → lo que falta hasta 10ᵏ → el atajo cifra por cifra. Se reserva: «de 10 la última no nula».
  // Debe verse: el complemento es una distancia en la recta.
  const rectaCA = (Nv, final = true) => {
    const k = cifras(Nv), P = 10 ** k;
    return {
      min: 0, max: P, paso: P / 10, decimales: 0, variable: 'N', color: 'o', filas: 1,
      elementos: [
        { tipo: 'punto', x: Nv, color: 'o', rotulo: f(Nv), fila: 0 },
        { tipo: 'punto', x: P, color: 'i', rotulo: f(P), fila: 0 },
        { tipo: 'distancia', a: Nv, b: P, color: 'd', rotulo: `CA = ${f(P - Nv)}`, fila: 1, desde: final ? 0 : 1 },
      ],
    };
  };
  const ca = x => 10 ** cifras(x) - x;
  const complemento = {
    id: 'complemento',
    titulo: 'Lo que falta para la potencia',
    temas: ['Sustracción y complemento aritmético'],
    pieza: 'recta',
    juega: {
      consigna: 'Elige N. Su complemento aritmético es lo que le falta para llegar a 10, 100 o 1 000, según sus cifras.',
      voz: 'Mira dónde termina la recta cuando N gana una cifra.',
      controles: [{ id: 'N', etiqueta: 'N', color: 'c-o', min: 10, max: 990, paso: 20, inicio: 70, decimales: 0 }],
      dibujo: v => ({ datos: rectaCA(v.N), estado: {} }),
      lectura: v => ['CA(', N, `) = ${f(10 ** cifras(v.N))} − ${f(v.N)} = `, { v: 'c-d', t: f(ca(v.N)) }],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuál es el complemento aritmético de ', { v: 'c-o', t: '3 400' }, '?'],
      opciones: [
        { id: 'c', texto: '6 600', correcta: true },
        { id: 'nueves', texto: '6 599', error: 'AT-CA9', siFuera: 'Eso resta de 9 todas las cifras. Ese número le falta a 9 999, no a 10 000.' },
        { id: 'k', texto: '96 600', error: 'AT-CA-K', siFuera: 'Sería cierto si 3 400 tuviera cinco cifras. Tiene cuatro: la potencia es 10 000.' },
        { id: 'cada10', texto: '7 600', error: 'AT-CA10', siFuera: 'Eso resta de 10 todas las cifras no nulas. Solo la última no nula se resta de 10.' },
      ],
      dibujo: { datos: rectaCA(3400, false), estado: { corte: 0 } },
      revelar: { datos: rectaCA(3400, false), estado: { corte: 1 } },
      coincide: 'Coincide: 3 400 + 6 600 = 10 000.',
    },
    mira: {
      datos: rectaCA(3400, false),
      pasos: [
        { estado: { corte: 0 }, texto: '3 400 tiene cuatro cifras: su potencia es 10 000.', ecuacion: ['k = 4 → ', { sup: ['10', '4'] }, ' = 10 000'] },
        { estado: { corte: 1 }, texto: 'El complemento es lo que falta para llegar.', ecuacion: ['CA(3 400) = 10 000 − 3 400 = ', { v: 'c-d', t: '6 600' }] },
        { estado: { corte: 1 }, texto: 'Atajo: 9 menos cada cifra, 10 menos la última no nula.', ecuacion: ['9 − 3 = 6 · 10 − 4 = 6 · 00'] },
      ],
    },
    regla: {
      texto: 'El complemento aritmético de N es lo que le falta para la potencia de 10 con tantos ceros como cifras tiene N.',
      ecuacion: ['CA(', N, ') = ', { sup: ['10', 'k'] }, ' − ', N, '   ·   ', N, ' tiene k cifras'],
      condicion: 'k son las cifras de N. En base b la potencia es bᵏ: se resta de b − 1 y de b.',
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), k = g.ent(3, 5);
        let Nv = g.ent(10 ** (k - 1), 10 ** k - 1);
        if (s % 2) Nv = Math.floor(Nv / 100) * 100 || 10 ** (k - 1) * 2;
        const v = ca(Nv), dig = String(Nv).split('');
        const nueves = +dig.map(x => 9 - +x).join('');
        return {
          pregunta: ['¿Cuál es el complemento aritmético de ', { v: 'c-o', t: f(Nv) }, '?'],
          opciones: opciones(v, [
            { id: 'nueves', valor: nueves, error: 'AT-CA9', siFuera: `Eso le falta a ${f(10 ** k - 1)}, no a ${f(10 ** k)}.` },
            { id: 'k', valor: 10 ** (k + 1) - Nv, error: 'AT-CA-K', siFuera: `${f(Nv)} tiene ${k} cifras: la potencia es ${f(10 ** k)}.` },
            { id: 'diez-todas', valor: +dig.map(x => (x === '0' ? '0' : String(10 - +x)).slice(-1)).join(''), error: 'AT-CA10', siFuera: 'Solo la última cifra no nula se resta de 10.' },
          ], x => f(x)),
          solucion: { texto: 'Lo que falta para la potencia de 10.', ecuacion: [`${f(10 ** k)} − ${f(Nv)} = ${f(v)}`], dibujo: { datos: rectaCA(Nv), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: división por defecto y por exceso ----------
  // Cambia: el dividendo y el divisor. Permanece: la recta de múltiplos del divisor.
  // Progresa: el múltiplo de abajo (defecto) → el de arriba (exceso). Se reserva: r + rₑ = d.
  // Debe verse: a está entre dos múltiplos consecutivos; cada resto es una distancia distinta.
  const rectaDiv = (av, dv, final = true) => {
    const qv = Math.floor(av / dv), rv = av - qv * dv;
    const lo = dv * Math.max(0, qv - 1), hi = dv * (qv + 2);
    return {
      min: lo, max: hi, paso: dv, decimales: 0, variable: 'múltiplos de ' + dv, color: 'i', filas: 3,
      elementos: [
        { tipo: 'punto', x: qv * dv, color: 'i', fila: 0 },
        { tipo: 'punto', x: (qv + 1) * dv, color: 'i', fila: 0 },
        { tipo: 'punto', x: av, color: 'o', rotulo: `a = ${f(av)}`, fila: 1 },
        { tipo: 'distancia', a: qv * dv, b: av, color: 'h', rotulo: rv ? `r = ${rv}` : '', fila: 2, desde: final ? 0 : 1 },
        { tipo: 'distancia', a: av, b: (qv + 1) * dv, color: 'd', rotulo: `rₑ = ${dv - rv}`, fila: 3, desde: final ? 0 : 1 },
      ],
    };
  };
  const division = {
    id: 'defecto-exceso',
    titulo: 'Resto por defecto y por exceso',
    temas: ['División entera por defecto y por exceso'],
    pieza: 'recta',
    juega: {
      consigna: 'Elige el dividendo a y el divisor d. La recta marca los múltiplos de d que rodean a a.',
      voz: 'Mide la distancia de a a cada múltiplo vecino.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 20, max: 60, paso: 1, inicio: 26, decimales: 0 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 3, max: 9, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: v => ({ datos: rectaDiv(v.a, v.d), estado: { corte: 1 } }),
      lectura: v => { const qv = Math.floor(v.a / v.d), rv = v.a % v.d; return [`${v.a} = ${v.d}·${qv} + ${rv} = ${v.d}·${qv + 1} − ${rv ? v.d - rv : 0}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Al dividir ', { v: 'c-o', t: '47' }, ' entre ', { v: 'c-i', t: '6' }, ' por defecto, el cociente es 7 y el resto 5. ¿Cuál es el resto por exceso?'],
      opciones: [
        { id: 'c', texto: '1', correcta: true },
        { id: 'mismo', texto: '5', error: 'AT-EXCESO', siFuera: '5 es lo que pasa de 42. Por exceso se mide lo que falta para 48.' },
        { id: 'divisor', texto: '6', error: 'AT-EXCESO', siFuera: '6 es el divisor: la distancia entre dos múltiplos, no la de 47 a 48.' },
        { id: 'suma', texto: '11', error: 'AT-EXCESO', siFuera: '11 suma resto y divisor; el resto por exceso es menor que el divisor.' },
      ],
      dibujo: { datos: rectaDiv(47, 6, false), estado: { corte: 0 } },
      revelar: { datos: rectaDiv(47, 6, false), estado: { corte: 1 } },
      coincide: 'Coincide: a 47 le falta 1 para 48 = 6 · 8.',
    },
    mira: {
      datos: rectaDiv(47, 6, false),
      pasos: [
        { estado: { corte: 0 }, texto: '47 queda entre los múltiplos 42 y 48.', ecuacion: ['6 · 7 = 42 ≤ 47 < 48 = 6 · 8'] },
        { estado: { corte: 1 }, texto: 'Por defecto: lo que pasa de 42. Por exceso: lo que falta para 48.', ecuacion: ['47 = 6 · 7 + ', { v: 'c-h', t: '5' }, ' = 6 · 8 − 1'] },
        { estado: { corte: 1 }, texto: 'Los dos restos juntos cubren un salto de 6.', ecuacion: [{ v: 'c-h', t: '5' }, ' + 1 = 6'] },
      ],
    },
    regla: {
      texto: 'Por defecto, a = dq + r. Por exceso, el cociente sube uno y se resta lo que falta. Los dos restos suman el divisor.',
      ecuacion: [a, ' = ', dd, q, ' + ', r, ' = ', dd, '(', q, ' + 1) − ', re, '   ·   ', r, ' + ', re, ' = ', dd],
      condicion: 'd > 0 y 0 < r < d. Si la división es exacta, el resto es 0 y hay un solo cociente.',
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), dv = g.ent(4, 15), qv = g.ent(5, 30), rv = g.ent(1, dv - 1), av = dv * qv + rv;
        if (s % 2 === 0) return {
          pregunta: ['Divide ', { v: 'c-o', t: String(av) }, ' entre ', { v: 'c-i', t: String(dv) }, ' por exceso. ¿Cuánto vale el resto por exceso?'],
          opciones: opciones(dv - rv, [
            { id: 'defecto', valor: rv, error: 'AT-EXCESO', siFuera: 'Ese es el resto por defecto: lo que pasa del múltiplo de abajo.' },
            { id: 'divisor', valor: dv, error: 'AT-EXCESO', siFuera: 'Ese es el divisor, no lo que falta.' },
            { id: 'suma', valor: dv + rv, error: 'AT-EXCESO', siFuera: 'El resto por exceso siempre es menor que el divisor.' },
          ]),
          solucion: { texto: `Le falta eso para ${dv * (qv + 1)} = ${dv} · ${qv + 1}.`, ecuacion: [`${av} = ${dv} · ${qv + 1} − ${dv - rv}`], dibujo: { datos: rectaDiv(av, dv), estado: { corte: 1 } } },
        };
        return {
          pregunta: ['En una división, el divisor es ', { v: 'c-i', t: String(dv) }, `, el cociente por defecto es ${qv} y el resto por exceso es ${dv - rv}. ¿Cuál es el dividendo?`],
          opciones: opciones(av, [
            { id: 'suma', valor: dv * qv + (dv - rv), error: 'AT-EXCESO', siFuera: 'Eso suma el resto por exceso al múltiplo de abajo; se resta del de arriba.' },
            { id: 'exceso-q', valor: dv * qv - (dv - rv), error: 'AT-EXCESO', siFuera: `El cociente por exceso es ${qv + 1}, no ${qv}.` },
            { id: 'arriba', valor: dv * (qv + 1), error: 'AT-EXCESO', siFuera: 'Ese es el múltiplo de arriba; falta restar el resto por exceso.' },
          ]),
          solucion: { texto: 'Por exceso el cociente sube uno y se resta.', ecuacion: [`${dv} · ${qv + 1} − ${dv - rv} = ${av}`] },
        };
      },
    },
  };

  // ---------- Idea 4: llevar en base b (operaciones en otras bases) ----------
  // Cambia: la base, con los mismos sumandos (34)_b + (23)_b. Permanece: la columna de unidades y la de grupos.
  // Progresa: columna por columna, suma → escribe → lleva. Se reserva: la llevada que aparece cuando la suma llega a b.
  // Debe verse: se lleva 1 cuando la columna llega a b, no a 10.
  const sumaBase = (x, y, base, pasos) => {
    const xs = x.split('').reverse(), ys = y.split('').reverse(), n = Math.max(xs.length, ys.length);
    const filas = []; let lleva = 0, res = '';
    const LUG = ['unidades', `grupos de ${base}`, `grupos de ${base * base}`];
    for (let i = 0; i < n; i++) {
      const sm = (+xs[i] || 0) + (+ys[i] || 0) + lleva, esc = sm % base, ll = Math.floor(sm / base);
      filas.push([{ t: LUG[i], paso: pasos ? i + 1 : 0 }, { t: `${xs[i] || 0} + ${ys[i] || 0}${lleva ? ' + 1' : ''} = ${sm}`, paso: pasos ? i + 1 : 0 }, { t: String(esc), color: 'd', paso: pasos ? i + 1 : 0 }, { t: ll ? '1' : '—', color: 'h', paso: pasos ? i + 1 : 0 }]);
      res = esc + res; lleva = ll;
    }
    if (lleva) res = '1' + res;
    filas.push([{ t: 'resultado', paso: pasos ? n + 1 : 0 }, '', { t: nb(res, base), color: 'd', resalta: true, paso: pasos ? n + 1 : 0 }, '']);
    return { datos: { columnas: [{ t: 'lugar' }, { t: 'suma' }, { t: 'escribe', color: 'd' }, { t: 'lleva', color: 'h' }], filas, filasMax: 4 }, res };
  };
  const otrasBases = {
    id: 'otras-bases',
    titulo: 'Llevar cuando se llega a b',
    temas: ['Operaciones en otras bases'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Se suman (34) y (23) en la base que elijas. La tabla suma columna por columna.',
      voz: 'Fíjate cuándo aparece un 1 en la columna «lleva».',
      controles: [{ id: 'b', etiqueta: 'b', color: 'c-i', min: 6, max: 9, paso: 1, inicio: 6, decimales: 0 }],
      dibujo: v => ({ datos: sumaBase('34', '23', v.b).datos, estado: {} }),
      lectura: v => [{ sub: ['(34)', String(v.b)] }, ' + ', { sub: ['(23)', String(v.b)] }, ' = ', { v: 'c-d', t: nb(sumaBase('34', '23', v.b).res, v.b) }],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuánto es ', { sub: ['(34)', { v: 'c-i', t: '5' }] }, ' + ', { sub: ['(23)', { v: 'c-i', t: '5' }] }, '?'],
      opciones: [
        { id: 'c', texto: '(112)₅', correcta: true },
        { id: 'decimal', texto: '(57)₅', error: 'AT-DECIMAL', siFuera: 'Así se suma en base 10. En base 5 la cifra 7 no existe.' },
        { id: 'diez', texto: '(102)₅', error: 'AT-LLEVA', siFuera: 'Eso olvida el 1 que se lleva de las unidades a la otra columna.' },
        { id: 'sin-lleva', texto: '(12)₅', error: 'AT-LLEVA', siFuera: 'Falta escribir lo que se lleva de la última columna.' },
      ],
      dibujo: { datos: { columnas: [{ t: 'lugar' }, { t: 'suma' }, { t: 'escribe', color: 'd' }, { t: 'lleva', color: 'h' }], filas: [], filasMax: 4 }, estado: {} },
      revelar: { datos: sumaBase('34', '23', 5).datos, estado: {} },
      coincide: 'Coincide: 19 + 13 = 32, y 32 = (112)₅.',
    },
    mira: {
      datos: sumaBase('34', '23', 5, true).datos,
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'Unidades: 4 + 3 = 7. Es un grupo de 5 y sobran 2.', ecuacion: ['7 = 1 · 5 + ', { v: 'c-d', t: '2' }] },
        { estado: { paso: 2, fila: 1 }, texto: 'Siguiente columna: 3 + 2 más el 1 que se lleva.', ecuacion: ['6 = 1 · 5 + ', { v: 'c-d', t: '1' }] },
        { estado: { paso: 3, fila: 2 }, texto: 'El último 1 que se lleva abre una columna nueva.', ecuacion: [{ sub: ['(34)', '5'] }, ' + ', { sub: ['(23)', '5'] }, ' = ', { v: 'c-d', t: '(112)₅' }] },
      ],
    },
    regla: {
      texto: 'En base b se opera columna por columna como en base 10, pero cada b unidades de una columna se llevan como 1 a la siguiente.',
      ecuacion: ['suma de la columna = ', bb, ' · lleva + escribe'],
      condicion: 'todas las cifras son menores que b. Al restar, cada préstamo trae b unidades, no 10.',
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), base = g.ent(3, 8);
        const x = enBase(g.ent(base * base, base * base * base - 1), base), y = enBase(g.ent(base, base * base - 1), base);
        const sm = valor(x, base) + valor(y, base), res = enBase(sm, base);
        if (s % 3 === 2 && valor(x, base) > valor(y, base)) {
          const df = valor(x, base) - valor(y, base);
          return {
            pregunta: ['¿Cuánto es ', { sub: [`(${x})`, { v: 'c-i', t: String(base) }] }, ' − ', { sub: [`(${y})`, { v: 'c-i', t: String(base) }] }, '?'],
            opciones: opciones(nb(enBase(df, base), base), [
              { id: 'decimal', valor: nb(String(Math.abs(+x - +y)), base), error: 'AT-DECIMAL', siFuera: 'Eso resta como en base 10: el préstamo trae b, no 10.' },
              { id: 'valor', valor: nb(String(df), base), error: 'AT-DECIMAL', siFuera: `${df} es la diferencia en base 10; falta escribirla en base ${base}.` },
              { id: 'suma', valor: nb(res, base), error: 'AT-SENTIDO', siFuera: 'Esa es la suma, no la resta.' },
            ]),
            solucion: { texto: 'Se comprueba pasando por base 10.', ecuacion: [`${valor(x, base)} − ${valor(y, base)} = ${df} = `, { sub: [`(${enBase(df, base)})`, String(base)] }] },
          };
        }
        const decimal = +x + +y;
        return {
          pregunta: ['¿Cuánto es ', { sub: [`(${x})`, { v: 'c-i', t: String(base) }] }, ' + ', { sub: [`(${y})`, { v: 'c-i', t: String(base) }] }, '?'],
          opciones: opciones(nb(res, base), [
            { id: 'decimal', valor: nb(String(decimal), base), error: 'AT-DECIMAL', siFuera: 'Eso suma como en base 10; se lleva al llegar a b.' },
            { id: 'valor', valor: nb(String(sm), base), error: 'AT-DECIMAL', siFuera: `${sm} es la suma en base 10; falta escribirla en base ${base}.` },
            { id: 'sin-lleva', valor: nb(res.length > 1 ? res.slice(1) : '0', base), error: 'AT-LLEVA', siFuera: 'Falta la cifra que se lleva al final.' },
          ]),
          solucion: { texto: 'Columna por columna, llevando al llegar a la base.', ecuacion: [`${valor(x, base)} + ${valor(y, base)} = ${sm} = `, { sub: [`(${res})`, String(base)] }], dibujo: { datos: sumaBase(x, y, base).datos, estado: {} } },
        };
      },
    },
  };
  otrasBases.ahoraTu.pieza = 'arit-tabla';

  // ---------- Idea 5: multiplicar es sumar por partes (multiplicación) ----------
  // Cambia: los dos factores. Permanece: la escala de las tiras (una unidad, el mismo largo).
  // Progresa: a · b como decenas por b más unidades por b. Se reserva: el pedazo que se agrega al subir un factor.
  // Debe verse: si un factor sube k, el producto sube k veces el otro factor.
  const tirasProd = (av, bv, extra = 0, max) => {
    const dec = Math.floor(av / 10) * 10, uni = av - dec;
    const tramos = [{ valor: dec * bv, color: 'o', texto: `${dec}·${bv}` }];
    if (uni) tramos.push({ valor: uni * bv, color: 'i', texto: `${uni}·${bv}` });
    if (extra) tramos.push({ valor: extra * bv, color: 'h', texto: `+${extra}·${bv}`, paso: 1 });
    return { max: max || 360, tiras: [{ rotulo: `${av}${extra ? ' + ' + extra : ''} × ${bv}`, color: 'o', fin: f((av + extra) * bv), tramos }], filas: 1, alt: `Tira de ${av} por ${bv} partida en ${dec} por ${bv} y ${uni} por ${bv}${extra ? `, más ${extra} por ${bv}` : ''}` };
  };
  const multiplicacion = {
    id: 'multiplicar-partes',
    titulo: 'Multiplicar es sumar por partes',
    temas: ['Multiplicación'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Elige los dos factores. La tira del producto se parte en decenas por b y unidades por b.',
      voz: 'Suma los dos pedazos y compara con el total.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 11, max: 39, paso: 1, inicio: 24, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 3, max: 9, paso: 1, inicio: 7, decimales: 0 },
      ],
      dibujo: v => ({ datos: tirasProd(v.a, v.b), estado: {} }),
      lectura: v => { const dc = Math.floor(v.a / 10) * 10; return [`${v.a} · ${v.b} = ${dc * v.b} + ${(v.a - dc) * v.b} = `, { v: 'c-d', t: String(v.a * v.b) }]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['En ', { v: 'c-o', t: '24' }, ' × ', { v: 'c-i', t: '7' }, ', el primer factor aumenta en 3. ¿En cuánto aumenta el producto?'],
      opciones: [
        { id: 'c', texto: 'en 21', correcta: true },
        { id: 'tres', texto: 'en 3', error: 'AT-SUMA', siFuera: 'Sería cierto en una suma. En un producto, cada unidad más vale 7.' },
        { id: 'diez', texto: 'en 10', error: 'AT-SUMA', siFuera: 'Eso suma 3 y 7. Se agregan 3 grupos de 7.' },
        { id: 'triple', texto: 'en 336', error: 'AR7', siFuera: 'Eso triplica todo el producto; solo se agregan 3 grupos de 7.' },
      ],
      dibujo: { datos: tirasProd(24, 7, 3, 200), estado: { paso: 0 } },
      revelar: { datos: tirasProd(24, 7, 3, 200), estado: { paso: 1 } },
      coincide: 'Coincide: 27 × 7 = 24 × 7 + 3 × 7.',
    },
    mira: {
      datos: tirasProd(24, 7, 3, 200),
      pasos: [
        { estado: { paso: 0 }, texto: '24 × 7 es 20 grupos de 7 más 4 grupos de 7.', ecuacion: ['24 · 7 = 140 + 28 = 168'] },
        { estado: { paso: 1 }, texto: 'Con 3 más, se agregan 3 grupos de 7.', ecuacion: ['27 · 7 = 168 + 3 · 7'] },
        { estado: { paso: 1 }, texto: 'El producto sube 21.', ecuacion: ['189 − 168 = ', { v: 'c-d', t: '21' }] },
      ],
    },
    regla: {
      texto: 'Multiplicar reparte sobre la suma. Si un factor aumenta k, el producto aumenta k veces el otro factor.',
      ecuacion: ['(m + n) · ', bb, ' = m · ', bb, ' + n · ', bb, '   ·   (a + k) · ', bb, ' = a · ', bb, ' + k · ', bb],
      condicion: 'el otro factor no cambia. Si los dos cambian, se suman los dos aportes y el de k por el otro cambio.',
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), av = g.ent(12, 60), bv = g.ent(4, 15), k = g.ent(2, 9);
        if (s % 2 === 0) return {
          pregunta: [`En ${av} × `, { v: 'c-i', t: String(bv) }, `, el primer factor ${s % 4 ? 'disminuye' : 'aumenta'} en ${k}. ¿En cuánto cambia el producto?`],
          opciones: opciones(k * bv, [
            { id: 'k', valor: k, error: 'AT-SUMA', siFuera: `Eso sería en una suma; cada unidad vale ${bv}.` },
            { id: 'suma', valor: k + bv, error: 'AT-SUMA', siFuera: `Se agregan o quitan ${k} grupos de ${bv}, no ${k} + ${bv}.` },
            { id: 'veces', valor: k * av * bv, error: 'AR7', siFuera: 'No se multiplica todo el producto; solo cambian unos grupos.' },
          ], x => `en ${f(x)}`),
          solucion: { texto: `${k} grupos de ${bv}.`, ecuacion: [`${k} · ${bv} = ${k * bv}`] },
        };
        const dec = Math.floor(av / 10) * 10;
        return {
          pregunta: `¿Cuánto es ${av} × ${bv}? Hazlo por partes.`,
          dibujo: { datos: tirasProd(av, bv, 0, av * bv), estado: {} },
          opciones: opciones(av * bv, [
            { id: 'sin-unidades', valor: dec * bv, error: 'AT-PARTES', siFuera: 'Falta el pedazo de las unidades.' },
            { id: 'unidades', valor: dec * bv + (av - dec), error: 'AT-PARTES', siFuera: `Las unidades también se multiplican por ${bv}.` },
            { id: 'suma', valor: av + bv, error: 'AT-SUMA', siFuera: 'Eso suma los factores.' },
          ], x => f(x)),
          solucion: { texto: 'Decenas por b más unidades por b.', ecuacion: [`${dec}·${bv} + ${av - dec}·${bv} = ${f(av * bv)}`] },
        };
      },
    },
  };

  // ---------- Idea 6: cuántas cifras tendrá (cantidad de cifras de un producto o cociente) ----------
  // Cambia: cuántas cifras tienen A y B. Permanece: la tabla con el menor y el mayor posible.
  // Progresa: extremos de A, de B y de A·B. Se reserva: las cifras del producto, entre dos valores.
  // Debe verse: con extremos se acota; no hay una sola respuesta.
  const tablaCotas = (m, n, con = 9) => {
    const loA = 10 ** (m - 1), hiA = 10 ** m - 1, loB = 10 ** (n - 1), hiB = 10 ** n - 1;
    const lo = loA * loB, hi = hiA * hiB;
    return { columnas: [{ t: '' }, { t: 'menor' }, { t: 'mayor' }, { t: 'cifras' }], filas: [
      [{ t: 'A', color: 'o' }, f(loA), f(hiA), { t: String(m), color: 'o' }],
      [{ t: 'B', color: 'i' }, f(loB), f(hiB), { t: String(n), color: 'i' }],
      [{ t: 'A·B', color: 'd', paso: con >= 1 ? 0 : 1 }, { t: f(lo), paso: con >= 1 ? 0 : 1 }, { t: f(hi), paso: con >= 1 ? 0 : 1 }, { t: `${cifras(lo)} o ${cifras(hi)}`, color: 'd', resalta: true, paso: con >= 1 ? 0 : 2 }],
    ], filasMax: 3, cabeza: true };
  };
  const cotas = {
    id: 'cifras-producto',
    titulo: 'Cuántas cifras tendrá',
    temas: ['Cantidad de cifras de un producto o cociente'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige cuántas cifras tienen A y B. La tabla multiplica los menores y los mayores posibles.',
      voz: 'Compara las cifras del menor y del mayor producto.',
      controles: [
        { id: 'm', etiqueta: 'cifras de A', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'n', etiqueta: 'cifras de B', color: 'c-i', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaCotas(v.m, v.n), estado: {} }),
      lectura: v => [`A·B tiene ${v.m + v.n - 1} o ${v.m + v.n} cifras`],
      minimo: 3,
    },
    predice: {
      pregunta: ['A tiene ', { v: 'c-o', t: '5' }, ' cifras y B tiene ', { v: 'c-i', t: '3' }, '. ¿Cuántas cifras puede tener A × B?'],
      opciones: [
        { id: 'c', texto: '7 u 8', correcta: true },
        { id: 'suma', texto: 'siempre 8', error: 'AT-COTA', siFuera: '8 es el máximo; con 10 000 × 100 salen solo 7.' },
        { id: 'prod', texto: '15', error: 'AT-COTA', siFuera: 'Las cifras se suman, no se multiplican: 15 sería absurdo con números chicos.' },
        { id: 'menos', texto: 'siempre 7', error: 'AT-COTA', siFuera: '7 es el mínimo; con 99 999 × 999 salen 8.' },
      ],
      dibujo: { datos: tablaCotas(5, 3, 0), estado: { paso: 0 } },
      revelar: { datos: tablaCotas(5, 3, 0), estado: { paso: 2 } },
      coincide: 'Coincide: de 10 000 × 100 a 99 999 × 999.',
    },
    mira: {
      datos: tablaCotas(5, 3, 0),
      pasos: [
        { estado: { paso: 0, fila: [0, 1] }, texto: 'Cada número está entre el menor y el mayor de su cantidad de cifras.', ecuacion: [{ sup: ['10', '4'] }, ' ≤ A < ', { sup: ['10', '5'] }] },
        { estado: { paso: 1, fila: 2 }, texto: 'El producto queda entre el producto de los menores y el de los mayores.', ecuacion: [{ sup: ['10', '6'] }, ' ≤ A·B < ', { sup: ['10', '8'] }] },
        { estado: { paso: 2, fila: 2 }, texto: 'Por eso tiene 5 + 3 − 1 o 5 + 3 cifras.', ecuacion: ['7 ≤ cifras ≤ 8'] },
      ],
    },
    regla: {
      texto: 'Si A tiene m cifras y B tiene n, A · B tiene m + n − 1 o m + n. El cociente entero A ÷ B tiene m − n o m − n + 1.',
      ecuacion: ['m + n − 1 ≤ cifras(A·B) ≤ m + n'],
      condicion: 'A y B son enteros positivos y, en el cociente, A ≥ B. Para decidir entre los dos, se miran las primeras cifras.',
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), m = s % 2 === 0 ? g.ent(3, 5) : g.ent(4, 9), n = g.ent(2, m - 1);   // con tabla, A de 5 cifras como máximo (que quepa a 360 px)
        if (s % 2 === 0) return {
          pregunta: ['A tiene ', { v: 'c-o', t: String(m) }, ' cifras y B tiene ', { v: 'c-i', t: String(n) }, '. ¿Cuántas cifras puede tener A × B?'],
          opciones: opciones(`${m + n - 1} o ${m + n}`, [
            { id: 'suma', valor: `siempre ${m + n}`, error: 'AT-COTA', siFuera: `${m + n} es el máximo; el mínimo es ${m + n - 1}.` },
            { id: 'prod', valor: `${m * n}`, error: 'AT-COTA', siFuera: 'Las cifras no se multiplican.' },
            { id: 'menos', valor: `${m + n - 2} o ${m + n - 1}`, error: 'AT-COTA', siFuera: `Prueba con los mayores: llegan a ${m + n} cifras.` },
          ]),
          solucion: { texto: 'Entre el producto de los menores y el de los mayores.', ecuacion: [`${m + n - 1} ≤ cifras ≤ ${m + n}`], dibujo: { datos: tablaCotas(m, n), estado: {} } },
        };
        return {
          pregunta: ['A tiene ', { v: 'c-o', t: String(m) }, ' cifras y B tiene ', { v: 'c-i', t: String(n) }, '. ¿Cuántas cifras puede tener el cociente entero de A entre B?'],
          opciones: opciones(`${m - n} o ${m - n + 1}`, [
            { id: 'resta', valor: `siempre ${m - n}`, error: 'AT-COTA', siFuera: `Con ${f(10 ** m - 1)} ÷ ${f(10 ** (n - 1))} salen ${m - n + 1} cifras.` },
            { id: 'div', valor: `${f(m / n, 1)}`, error: 'AT-COTA', siFuera: 'Las cifras no se dividen.' },
            { id: 'suma', valor: `${m + n - 1} o ${m + n}`, error: 'AT-SENTIDO', siFuera: 'Eso es para el producto, no para el cociente.' },
          ]),
          solucion: { texto: 'Se acota con el menor y el mayor posible.', ecuacion: [`${m - n} ≤ cifras ≤ ${m - n + 1}`] },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.cuatro-operaciones',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-tiras.js'],
    historia: {
      texto: 'Los papiros matemáticos egipcios multiplican sin nuestra tabla: duplican y suman algunos duplicados. Para 13 × 7 bastaba sumar 8 × 7, 4 × 7 y 1 × 7. Dividir era buscar qué múltiplos formaban una cantidad. Muestra que una operación y su procedimiento no son lo mismo: lo que se conserva es la propiedad de repartir.',
      pregunta: '¿Cómo multiplicarías solo duplicando y sumando?',
      fuente: { titulo: 'O’Connor y Robertson, Egyptian Papyri — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Egyptian_papyri/' },
    },
    ideas: [sumatorias, complemento, division, otrasBases, multiplicacion, cotas],
  };
});
