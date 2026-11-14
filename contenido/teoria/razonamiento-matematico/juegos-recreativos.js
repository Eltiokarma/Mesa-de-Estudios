/*
 * Teoría de «Elementos recreativos» (razonamiento-matematico.juegos-recreativos).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 8) y el desarrollo de RM8 del expediente
 * (dominó como pares sin orden, cerillas con movimientos declarados); historia: Dudeney (MacTutor).
 * Precisión: «opuestas suman 7» vale solo en el dado convencional; una cara no fija la orientación entera.
 * Colores (regla 4): los dobles naranja (c-o), la cara de arriba turquesa (c-i), la de abajo rojo (c-h),
 * los cuadrados que se cuentan verde (c-d).
 * Compañero: Faro (zorro). Códigos: RME10, RME11, RME12 (existentes); RMT-REC-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: contar fichas, puntos, caras y cerillas con una regla, no a ojo.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: cuenta las fichas y los puntos de un dominó, las caras ocultas de dados y los cuadrados de una cuadrícula.
 *   Orden de atención: 1.º las fichas, el dado o la cuadrícula · 2.º la lectura · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿la ficha 2–5 y la 5–2 son dos fichas?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const nn = { v: 'c-o', t: 'n' }, N = { v: 'c-d', t: 'N' }, t = { v: 'c-i', t: 't' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    return r;
  }
  function opcionesNum(correcta, distractores, fmt = x => f(x)) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) { if (vistos.has(x.valor) || !Number.isFinite(x.valor) || x.valor < 0 || ops.length >= 4) continue; vistos.add(x.valor); ops.push({ id: x.id, texto: fmt(x.valor), error: x.error, siFuera: x.siFuera }); }
    return ops;
  }

  // ---------- Idea 1: el dominó doble n ----------
  // Cambia: hasta qué número llega el juego · Permanece: una ficha por cada par sin orden · Progresa: las fichas y los
  // dobles · Se reserva: la suma de todos los puntos · Debe verse: 2–5 y 5–2 son la misma ficha.
  const fichasDe = n => { const xs = []; for (let a = 0; a <= n; a++) for (let b = a; b <= n; b++) xs.push([a, b]); return xs; };
  const total = n => (n + 1) * (n + 2) / 2;
  function domino(n, extra = {}) {
    const xs = fichasDe(n), filas = [];
    for (let i = 0; i < xs.length; i += 6) filas.push({ fichas: xs.slice(i, i + 6).map(v => ({ forma: 'domino', valor: v, color: v[0] === v[1] ? 'o' : undefined, resalto: v[0] === v[1] ? 'o' : undefined })) });
    while (filas.length < 5) filas.push({ fichas: [] });
    return { filas: filas.slice(0, 5), tam: 22, pie: extra.pie || `${xs.length} fichas, ${n + 1} dobles` };
  }
  const dom = {
    id: 'domino',
    titulo: 'Un par sin orden por ficha',
    temas: ['Dominó'],
    pieza: 'rm-fichas',
    juega: {
      consigna: 'Un dominó «doble n» tiene una ficha por cada pareja de números de 0 a n, con los dobles. Cambia n y cuenta.',
      voz: 'La ficha 2–5 es la misma que la 5–2.',
      controles: [{ id: 'n', etiqueta: 'Doble', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: domino(val.n), estado: {} }),
      lectura: val => [`Fichas = (`, nn, ` + 1)(`, nn, ` + 2) / 2 = ${total(val.n)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En el dominó doble seis, ¿cuántos puntos hay en total, sumando todas las fichas?',
      opciones: [
        { id: 'unavez', texto: '147', error: 'RMT-REC-1', siFuera: '147 cuenta cada doble como un solo número; el 6–6 tiene 12 puntos.' },
        { id: 'c', texto: '168', correcta: true },
        { id: 'veintiuno', texto: '21', error: 'RMT-REC-2', siFuera: '21 es 0 + 1 + … + 6: cada número aparece en varias fichas.' },
        { id: 'doble', texto: '336', error: 'RME12', siFuera: '336 cuenta 2–5 y 5–2 como dos fichas distintas.' },
      ],
      dibujo: { datos: domino(6, { pie: '28 fichas, 7 dobles' }), estado: {} },
      revelar: { datos: domino(6, { pie: 'Cada número sale 8 veces: 168' }), estado: {} },
      coincide: 'Coincide: cada número aparece 8 veces (6 fichas más las dos mitades de su doble).',
    },
    mira: {
      datos: domino(3, { pie: 'Doble tres: 10 fichas' }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Fichas con números distintos: elegir 2 de los 4 números.', ecuacion: ['4 · 3 / 2 = 6'] },
        { estado: { corte: 0 }, texto: 'Más un doble por cada número.', ecuacion: ['6 + 4 = 10 fichas'] },
        { estado: { corte: 0 }, texto: 'Cada número aparece en 3 fichas y dos veces en su doble: 5 veces.', ecuacion: ['puntos = 5 · (0 + 1 + 2 + 3) = 30'] },
      ],
    },
    regla: {
      texto: 'Un dominó doble n tiene una ficha por cada par sin orden de números de 0 a n, dobles incluidos. Cada número aparece n + 2 veces al sumar puntos.',
      ecuacion: ['fichas = ', { frac: [['(', nn, ' + 1)(', nn, ' + 2)'], '2'] }, ' · puntos = ', { frac: [[nn, '(', nn, ' + 1)(', nn, ' + 2)'], '2'] }],
      condicion: 'el juego está completo y tiene una sola copia de cada ficha.',
    },
    ahoraTu: {
      voz: 'Separa las fichas con números distintos de los dobles.',
      generar(s) {
        const r = azar(s), n = r.ent(3, 9), pide = s % 2 ? 'puntos' : 'fichas';
        const T = total(n), Pt = n * (n + 1) * (n + 2) / 2;
        return {
          pregunta: pide === 'fichas' ? `¿Cuántas fichas tiene un dominó doble ${n} completo?` : `¿Cuántos puntos suman todas las fichas de un dominó doble ${n}?`,
          opciones: pide === 'fichas' ? opcionesNum(T, [
            { id: 'orden', valor: (n + 1) * (n + 1), error: 'RME12', siFuera: 'Cuenta 2–5 y 5–2 como fichas distintas.' },
            { id: 'sindob', valor: n * (n + 1) / 2, error: 'RMT-REC-3', siFuera: 'Faltan los dobles.' },
            { id: 'mas', valor: T + n + 1, error: 'RMT-REC-4', siFuera: 'Los dobles ya estaban contados.' },
          ]) : opcionesNum(Pt, [
            { id: 'unavez', valor: (n + 1) * n * (n + 1) / 2, error: 'RMT-REC-1', siFuera: 'Cada doble aporta su número dos veces.' },
            { id: 'suma', valor: n * (n + 1) / 2, error: 'RMT-REC-2', siFuera: 'Cada número aparece en varias fichas.' },
            { id: 'doble', valor: 2 * Pt, error: 'RME12', siFuera: 'Cuenta 2–5 y 5–2 como dos fichas.' },
          ]),
          solucion: pide === 'fichas'
            ? { texto: `${n * (n + 1) / 2} fichas con números distintos y ${n + 1} dobles.`, ecuacion: [`(${n} + 1)(${n} + 2) / 2 = ${T}`] }
            : { texto: `Cada número aparece ${n + 2} veces.`, ecuacion: [`${n + 2} · (0 + 1 + … + ${n}) = ${Pt}`] },
        };
      },
    },
  };

  // ---------- Idea 2: dados ----------
  // Cambia: la cara de arriba · Permanece: el dado convencional (opuestas suman 7) · Progresa: lo que queda fijado ·
  // Se reserva: la cara del frente, que no se deduce · Debe verse: una cara fija su opuesta, no las de alrededor.
  function dado(arriba, extra = {}) {
    const lados = [1, 2, 3, 4, 5, 6].filter(x => x !== arriba && x !== 7 - arriba);
    return {
      filas: [
        { rotulo: 'Arriba', fichas: [{ forma: 'dado', valor: arriba, color: 'i', resalto: 'i' }] },
        { rotulo: 'Abajo (opuesta)', fichas: [{ forma: 'dado', valor: 7 - arriba, color: 'h', resalto: 'h' }] },
        { rotulo: extra.lados || 'Alrededor, en algún orden', fichas: lados.map(v => ({ forma: 'dado', valor: v })) },
      ],
      tam: 30,
      pie: extra.pie,
    };
  }
  function pila(k, arriba) {
    return {
      filas: Array.from({ length: k }, (_, i) => ({ rotulo: i === 0 ? `Dado 1 (arriba: ${arriba})` : `Dado ${i + 1}`, fichas: i === 0 ? [{ forma: 'dado', valor: arriba, color: 'i', resalto: 'i' }] : [{ forma: 'dado', valor: 0, hueca: true }] })),
      tam: 26,
      pie: `${k} dados apilados sobre la mesa`,
    };
  }
  const dados = {
    id: 'dados',
    titulo: 'Una cara fija solo su opuesta',
    temas: ['Dados'],
    pieza: 'rm-fichas',
    juega: {
      consigna: 'En un dado común, las caras opuestas suman 7. Elige la cara de arriba y mira qué queda fijado.',
      voz: 'Mira cuántas caras quedan sin un lugar fijo.',
      controles: [{ id: 'a', etiqueta: 'Arriba', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0, color: 'c-i' }],
      dibujo: val => ({ datos: dado(val.a), estado: {} }),
      lectura: val => [t, ` = ${val.a} · abajo = 7 − ${val.a} = ${7 - val.a}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un dado común tiene el 2 arriba. ¿Qué número está en la cara del frente?',
      opciones: [
        { id: 'cinco', texto: 'El 5', error: 'RME10', siFuera: 'El 5 es la opuesta del 2: está abajo, no al frente.' },
        { id: 'tres', texto: 'El 3', error: 'RMT-REC-5', siFuera: 'El 3 puede estar al frente, pero también el 1, el 4 o el 6.' },
        { id: 'c', texto: 'No se sabe: 1, 3, 4 o 6', correcta: true },
      ],
      dibujo: { datos: dado(2, { lados: 'Alrededor: ?' }), estado: {} },
      revelar: { datos: dado(2, { pie: 'Cualquiera de las cuatro puede ir al frente' }), estado: {} },
      coincide: 'Coincide: con una sola cara, el dado aún puede girar sobre sí mismo.',
    },
    mira: {
      datos: pila(3, 5),
      pasos: [
        { estado: { corte: 0 }, texto: 'Tres dados apilados con el 5 arriba. ¿Cuánto suman las caras tapadas?', ecuacion: ['ocultas: abajo y contactos'] },
        { estado: { corte: 0 }, texto: 'Cada dado tiene arriba y abajo opuestas: suman 7.', ecuacion: ['3 · 7 = 21'] },
        { estado: { corte: 0 }, texto: 'De esos 21, solo el 5 de arriba se ve.', ecuacion: ['21 − 5 = 16'] },
      ],
    },
    regla: {
      texto: 'En un dado común, cada cara y su opuesta suman 7. Una sola cara fija su opuesta; las otras cuatro pueden girar alrededor.',
      ecuacion: ['arriba + abajo = 7 ;  k dados apilados: ocultas = 7k − ', t],
      condicion: 'el dado está numerado de la forma común; un cubo con otros números no cumple la regla.',
    },
    ahoraTu: {
      pieza: 'rm-fichas',
      voz: 'Junta cada cara con su opuesta.',
      generar(s) {
        const r = azar(s), k = r.ent(2, 5), a = r.ent(1, 6);
        const bien = 7 * k - a;
        return {
          pregunta: `Se apilan ${k} dados comunes sobre una mesa. Arriba se ve un ${a}. ¿Cuánto suman las caras tapadas (las que tocan otro dado o la mesa)?`,
          dibujo: { datos: pila(Math.min(k, 5), a), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'todo', valor: 7 * k, error: 'RME11', siFuera: 'Ahí está también el número de arriba, que sí se ve.' },
            { id: 'una', valor: 7 * (k - 1), error: 'RMT-REC-6', siFuera: 'Falta la cara del dado de arriba que toca al de abajo.' },
            { id: 'opu', valor: 7 - a, error: 'RME10', siFuera: 'Esa es solo la cara de abajo del primer dado.' },
            { id: 'veintiuno', valor: 21 * k - a, error: 'RMT-REC-7', siFuera: 'Eso suma las seis caras de cada dado.' },
          ]),
          solucion: { texto: `Cada dado aporta arriba y abajo: 7. Se resta el ${a}, que se ve.`, ecuacion: [`7 · ${k} − ${a} = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 3: cerillas en una cuadrícula ----------
  // Cambia: el tamaño de la cuadrícula · Permanece: cerillas iguales · Progresa: cerillas y cuadrados de todos los tamaños ·
  // Se reserva: quitar una cerilla del borde · Debe verse: hay cuadrados grandes además de los chicos.
  function malla(n, quita = null, extra = {}) {
    const L = Math.min(1.6, 5.4 / n), x0 = 5 - n * L / 2, y0 = 0.4;
    const lineas = [];
    for (let i = 0; i <= n; i++) for (let j = 0; j < n; j++) {
      const h = { de: [x0 + j * L, y0 + i * L], a: [x0 + (j + 1) * L, y0 + i * L], color: 'h', grosor: 'variable', id: `h${i}${j}` };
      const v = { de: [x0 + i * L, y0 + j * L], a: [x0 + i * L, y0 + (j + 1) * L], color: 'h', grosor: 'variable', id: `v${i}${j}` };
      lineas.push(h, v);
    }
    const vis = lineas.filter(l => l.id !== quita).map(({ id, ...l }) => l);
    const quitada = lineas.find(l => l.id === quita);
    return {
      ancho: 10, alto: 6.2,
      lineas: vis.concat(quitada ? [{ de: quitada.de, a: quitada.a, discontinua: true, grosor: 'contorno' }] : []),
      poligonos: extra.marcar || [],
      pie: extra.pie,
    };
  }
  const cerillas = n => 2 * n * (n + 1);
  const cuadrados = n => n * (n + 1) * (2 * n + 1) / 6;
  const fichas = {
    id: 'cerillas',
    titulo: 'Cerillas y cuadrados de todo tamaño',
    temas: ['Fichas y cerillas'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Una cuadrícula de n × n hecha con cerillas. Cambia n y cuenta las cerillas y los cuadrados de todos los tamaños.',
      voz: 'No olvides los cuadrados grandes que encierran a varios chicos.',
      controles: [{ id: 'n', etiqueta: 'n', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-d' }],
      dibujo: val => ({ datos: malla(val.n), estado: {} }),
      lectura: val => [`${cerillas(val.n)} cerillas · `, N, ` = ${cuadrados(val.n)} cuadrados`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En la cuadrícula de 2 × 2 (12 cerillas) se quita una cerilla del borde de arriba. ¿Cuántos cuadrados quedan?',
      opciones: [
        { id: 'cuatro', texto: '4', error: 'RMT-REC-8', siFuera: 'Quedan 3 chicos; además, el cuadrado grande también se rompe.' },
        { id: 'c', texto: '3', correcta: true },
        { id: 'cuatro2', texto: '5', error: 'RMT-REC-9', siFuera: '5 eran antes de quitar: 4 chicos y el grande.' },
        { id: 'dos', texto: '2', error: 'RMT-REC-10', siFuera: 'Una cerilla de borde solo pertenece a un cuadrado chico.' },
      ],
      dibujo: { datos: malla(2), estado: {} },
      revelar: { datos: malla(2, 'h00', { pie: 'Se rompen dos: quedan 3' }), estado: {} },
      coincide: 'Coincide: esa cerilla era parte de un cuadrado chico y del grande.',
    },
    mira: {
      datos: malla(3, null, { marcar: [
        { puntos: [[2.6, 0.4], [4.2, 0.4], [4.2, 2], [2.6, 2]], color: 'd', relleno: 0.3, desde: 1 },
        { puntos: [[2.6, 0.4], [5.8, 0.4], [5.8, 3.6], [2.6, 3.6]], color: 'd', relleno: 0.15, desde: 2 },
        { puntos: [[2.6, 0.4], [7.4, 0.4], [7.4, 5.2], [2.6, 5.2]], color: 'd', relleno: 0.08, desde: 3 },
      ] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Cuadrados de 1 × 1: 9.', ecuacion: ['3² = 9'] },
        { estado: { corte: 2 }, texto: 'De 2 × 2: caben 4.', ecuacion: ['2² = 4'] },
        { estado: { corte: 3 }, texto: 'De 3 × 3: 1. En total, 14 cuadrados.', ecuacion: [N, ' = 9 + 4 + 1 = 14'] },
        { estado: { corte: 3 }, texto: 'Cerillas: 4 filas de 3 y 4 columnas de 3.', ecuacion: ['2 · 3 · 4 = 24'] },
      ],
    },
    regla: {
      texto: 'Una cuadrícula de n × n usa 2n(n + 1) cerillas y tiene cuadrados de todos los tamaños: n² chicos, (n − 1)² de 2 × 2, y así hasta uno grande.',
      ecuacion: [N, ' = 1² + 2² + … + ', { sup: [nn, '2'] }, ' = ', { frac: [[nn, '(', nn, ' + 1)(2', nn, ' + 1)'], '6'] }],
      condicion: 'la cuadrícula está completa; si se quita una cerilla, se rompen todos los cuadrados que la usan.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Cuenta por tamaños, del más chico al más grande.',
      generar(s) {
        const r = azar(s), n = r.ent(2, 6), pide = s % 2 ? 'cerillas' : 'cuadrados';
        const bien = pide === 'cerillas' ? cerillas(n) : cuadrados(n);
        return {
          pregunta: pide === 'cerillas' ? `¿Cuántas cerillas hacen falta para una cuadrícula de ${n} × ${n}?` : `¿Cuántos cuadrados, de todos los tamaños, hay en una cuadrícula de ${n} × ${n}?`,
          dibujo: { datos: malla(Math.min(n, 4)), estado: {} },
          opciones: pide === 'cerillas' ? opcionesNum(bien, [
            { id: 'cuatro', valor: 4 * n * n, error: 'RMP1', siFuera: 'Cuenta dos veces las cerillas compartidas.' },
            { id: 'filas', valor: n * (n + 1), error: 'RMT-REC-11', siFuera: 'Esas son solo las horizontales.' },
            { id: 'mas', valor: 2 * (n + 1) * (n + 1), error: 'RMT-REC-12', siFuera: 'Cada fila tiene n cerillas, no n + 1.' },
          ]) : opcionesNum(bien, [
            { id: 'chicos', valor: n * n, error: 'RMT-REC-8', siFuera: 'Esos son solo los chicos; faltan los grandes.' },
            { id: 'mas1', valor: n * n + 1, error: 'RMT-REC-13', siFuera: 'Faltan los de tamaños intermedios.' },
            { id: 'suma', valor: n * (n + 1) / 2, error: 'RMT-REC-14', siFuera: 'Eso suma lados; cada tamaño aporta un cuadrado de cuadrados.' },
          ]),
          solucion: pide === 'cerillas'
            ? { texto: `${n + 1} filas de ${n} y ${n + 1} columnas de ${n}.`, ecuacion: [`2 · ${n} · ${n + 1} = ${bien}`] }
            : { texto: 'Se suman los cuadrados de cada tamaño.', ecuacion: [`${Array.from({ length: n }, (_, k) => `${n - k}²`).join(' + ')} = ${bien}`] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-matematico.juegos-recreativos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-fichas.js', '/nucleo/kit/piezas/rm-plano.js'],
    historia: {
      texto: 'Henry Dudeney publicó colecciones de acertijos como The Canterbury Puzzles (1907) y Amusements in Mathematics (1917). No inventó todos los juegos de cerillas o dominó, pero mostró algo útil: antes de calcular, hay que precisar las reglas. Qué se mueve, qué se cuenta y qué vale como solución.',
      pregunta: '¿Qué reglas cambian un mismo acertijo?',
      fuente: { titulo: 'Henry Ernest Dudeney · MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Dudeney/' },
    },
    ideas: [dom, dados, fichas],
  };
});
