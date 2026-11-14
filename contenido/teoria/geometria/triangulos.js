/*
 * Teoría de «Triángulos y líneas notables» (geometria.triangulos). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 2); Elementos I.20 (desigualdad) y I.32 (suma de ángulos).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: justificar la suma de 180°, el ángulo exterior y la desigualdad triangular, y reconocer cada línea notable
 *     por su condición (perpendicular, punto medio, ángulos iguales), no por su aspecto.
 *   Persona y condiciones: postulante de 3.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: calcula ángulos interiores y exteriores, el rango del tercer lado, ubica la altura del
 *     obtusángulo y usa ∠BIC = 90° + A/2.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿por qué siempre 180°?» y «¿cuál línea es cuál?».
 *
 * Colores: A naranja (c-o), B turquesa (c-i), C verde (c-d), lo que se pide rojo (c-h). En líneas notables:
 * altura rojo, mediana turquesa, bisectriz naranja, mediatriz verde (las mismas en toda la idea).
 * Códigos: GE7 y GE8 (docs/investigacion/geometria-ideas-erroneas.md); GE-TRI, GE-DT y GE-BIS son hipótesis nuevas.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/kit/piezas/geo-figura.js'))
    : fabrica(root.Kit, root.Kit.piezas['geo-figura']);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, G) {
  'use strict';
  const U = G.util;
  const f = (n, d = 1) => Kit.formatear(n, d);
  const gr = n => `${f(n)}°`;
  const cA = { v: 'c-o', t: 'A' }, cB = { v: 'c-i', t: 'B' }, cC = { v: 'c-d', t: 'C' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt, n = 4) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor <= 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, n);
  }
  // Triángulo con base BC horizontal y ángulos dados en B y C (en grados); devuelve los tres vértices.
  const porAngulos = (b, c, base = 6) => {
    const A = U.corte([0, 0], U.polar([0, 0], 1, b), [base, 0], U.polar([base, 0], 1, 180 - c));
    return { A, B: [0, 0], C: [base, 0] };
  };
  const nombreAng = (a, b, c) => { const m = Math.max(a, b, c); return Math.abs(m - 90) < 0.5 ? 'rectángulo' : m > 90 ? 'obtusángulo' : 'acutángulo'; };
  const nombreLad = (x, y, z) => { const e = (p, q) => Math.abs(p - q) < 0.05; return e(x, y) && e(y, z) ? 'equilátero' : e(x, y) || e(y, z) || e(x, z) ? 'isósceles' : 'escaleno'; };

  // ---------- Idea 1: la suma es 180° y el exterior suma los dos lejanos ----------
  // Cambia: la posición de A · Permanece: la base BC · Progresa: los tres ángulos y la clase ·
  // Se reserva: la paralela por A (en «Mira») · Debe verse: los tres ángulos caben en una recta.
  const triA = (ax, ay, o = {}) => {
    const A = [ax, ay], B = [0, 0], C = [6, 0];
    const a = U.angulo(A, B, C), b = U.angulo(B, A, C), c = U.angulo(C, A, B);
    const k = o.paso || 0, par = o.paralela;
    return {
      alt: `Triángulo de ángulos A = ${f(a, 0)}°, B = ${f(b, 0)}° y C = ${f(c, 0)}°${o.exterior ? `; el exterior en C mide ${f(a + b, 0)}°` : ''}`,
      vista: { x: [-2, 9], y: [-0.8, 6.4] },
      puntos: [{ id: 'A', x: ax, y: ay, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: 6, y: 0, rotulo: 'C', lado: -90 },
        { id: 'Cx', x: 8.6, y: 0, sinPunto: true }, { id: 'Pi', x: ax - 3, y: ay, sinPunto: true }, { id: 'Pd', x: ax + 3, y: ay, sinPunto: true }],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' },
        ...(o.exterior ? [{ de: 'C', a: 'Cx', discontinua: true }] : []),
        ...(par ? [{ de: 'Pi', a: 'Pd', recta: true, discontinua: true, grosor: 'fino', paralela: 1, desde: k ? 1 : 0 }, { de: 'B', a: 'Cx', recta: true, grosor: 'fino', paralela: 1, desde: k ? 1 : 0 }] : [])],
      angulos: [
        { en: 'A', de: 'B', a: 'C', color: 'o', texto: o.sinA ? undefined : gr(Math.round(a)) },
        { en: 'B', de: 'C', a: 'A', color: 'i', texto: o.sinB ? undefined : gr(Math.round(b)) },
        ...(o.sinC ? [] : [{ en: 'C', de: 'A', a: 'B', color: 'd', texto: gr(Math.round(c)) }]),
        ...(par ? [{ en: 'A', de: 'Pi', a: 'B', color: 'i', radio: 34, texto: gr(Math.round(b)), desde: k ? 2 : 0 }, { en: 'A', de: 'C', a: 'Pd', color: 'd', radio: 34, texto: gr(Math.round(c)), desde: k ? 3 : 0 }] : []),
        ...(o.exterior ? [{ en: 'C', de: 'Cx', a: 'A', color: 'h', radio: 20, texto: o.extTexto, desde: o.extDesde || 0 }] : []),
      ],
    };
  };
  // Triángulo de la predicción: A = 50°, B = 70° (exterior en C = 120°).
  const PA = porAngulos(70, 60).A;
  const suma = {
    id: 'suma-de-angulos',
    titulo: 'Tres ángulos caben en una recta',
    temas: ['Suma de ángulos internos y ángulo externo', 'Clasificación'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Mueve el vértice A con la base BC fija. Mira los tres ángulos, su suma y cómo se llama el triángulo.',
      voz: 'Estira el triángulo. Busca qué permanece igual.',
      controles: [
        { id: 'ax', etiqueta: 'A a lo ancho', min: -1, max: 7, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'ay', etiqueta: 'A a lo alto', min: 1, max: 5, paso: 1, inicio: 4, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: triA(v.ax, v.ay), estado: {} }),
      lectura: v => {
        const A = [v.ax, v.ay], a = U.angulo(A, [0, 0], [6, 0]), b = U.angulo([0, 0], A, [6, 0]), c = 180 - a - b;
        return [cA, ' + ', cB, ' + ', cC, ` = 180° · ${nombreAng(a, b, c)} ${nombreLad(U.dist(A, [0, 0]), U.dist(A, [6, 0]), 6)}`];
      },
      minimo: 4,
    },
    predice: {
      pregunta: ['En el triángulo, ', cA, ' = 50° y ', cB, ' = 70°. Prolongamos el lado BC más allá de C. ¿Cuánto mide el ángulo exterior en C?'],
      voz: 'Piensa en el ángulo de afuera antes de verlo.',
      opciones: [
        { id: 'c', texto: '120°', correcta: true },
        { id: 'interior', texto: '60°', error: 'GE-TRI1', siFuera: '60° es el ángulo interior en C. El exterior es su vecino en la recta.' },
        { id: 'llano', texto: '180°', error: 'GE-TRI2', siFuera: '180° mide toda la recta prolongada. El exterior es solo la parte de afuera.' },
        { id: 'suma3', texto: '110°', error: 'GE-TRI3', siFuera: '110° vendría de restar 70° de 180°: sería el exterior en B, no en C.' },
      ],
      dibujo: { datos: triA(PA[0], PA[1], { exterior: true, sinC: true }), estado: {} },
      revelar: { datos: triA(PA[0], PA[1], { exterior: true, extTexto: '120°' }), estado: {} },
      coincide: ['Coincide: el exterior en C mide ', cA, ' + ', cB, ' = 120°.'],
    },
    mira: {
      datos: Object.assign(triA(PA[0], PA[1], { paralela: true, paso: true, exterior: true, extTexto: '120°', extDesde: 4 }), { alt: 'Por A pasa una paralela a BC: los ángulos B y C se copian arriba y los tres llenan una recta' }),
      voz: 'Una paralela por A ordena los tres ángulos en una recta.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Por A trazamos una paralela a BC.', ecuacion: ['paralela por A'] },
        { estado: { corte: 2 }, texto: 'A la izquierda aparece un alterno interno de B.', ecuacion: [cB, ' = 70°'] },
        { estado: { corte: 3 }, texto: 'A la derecha, un alterno interno de C.', ecuacion: [cC, ' = 60°'] },
        { estado: { corte: 3 }, texto: 'Los tres ángulos en A llenan la recta.', ecuacion: [cA, ' + ', cB, ' + ', cC, ' = 180°'] },
        { estado: { corte: 4 }, texto: 'El exterior en C completa 180° con C: vale A + B.', ecuacion: ['exterior en C = 180° − ', cC, ' = ', cA, ' + ', cB, ' = 120°'] },
      ],
    },
    regla: {
      texto: 'En todo triángulo los tres ángulos interiores suman 180°. Un ángulo exterior es igual a la suma de los dos interiores que no están a su lado.',
      ecuacion: [cA, ' + ', cB, ' + ', cC, ' = 180°   ·   exterior en C = ', cA, ' + ', cB],
      condicion: 'el triángulo está en un plano. Por ángulos es acutángulo, rectángulo u obtusángulo; por lados, escaleno, isósceles o equilátero.',
      voz: 'La paralela es la condición que garantiza los 180°.',
    },
    ahoraTu: {
      voz: 'Ubica cuál es interior y cuál exterior antes de operar.',
      generar(s) {
        const r = azar(s), a = 5 * r.ent(6, 16), b = 5 * r.ent(6, 16), c = 180 - a - b, pideExt = s % 2 === 0;
        const t = porAngulos(b, c);
        const fig = sol => ({ datos: triA(t.A[0], t.A[1], { exterior: true, sinC: true, extTexto: sol ? `${a + b}°` : (pideExt ? '?' : `${a + b}°`), sinB: !pideExt && !sol }), estado: {} });
        const datos = pideExt ? [`A = ${a}° y B = ${b}°`, 'el ángulo exterior en C'] : [`A = ${a}° y el exterior en C mide ${a + b}°`, 'el ángulo B'];
        const bien = pideExt ? a + b : b;
        return {
          pregunta: [`En el triángulo ABC, ${datos[0]}. ¿Cuánto mide ${datos[1]}?`],
          dibujo: fig(false),
          opciones: opciones(bien, pideExt ? [
            { id: 'interior', valor: c, error: 'GE-TRI1', siFuera: `${c}° es el ángulo interior en C; el exterior es su vecino.` },
            { id: 'otro-ext', valor: 180 - b, error: 'GE-TRI3', siFuera: `${180 - b}° es el exterior en B, no en C.` },
            { id: 'resta', valor: Math.abs(a - b), error: 'GE-TRI2', siFuera: 'Restar A y B no da un ángulo de la figura; el exterior los suma.' },
          ] : [
            { id: 'suma', valor: a + (a + b), error: 'GE-TRI2', siFuera: 'Sumar todo serviría si B fuera el exterior; B es una de sus partes.' },
            { id: 'int-c', valor: c, error: 'GE-TRI1', siFuera: `${c}° es el interior en C. B sale del exterior menos A.` },
            { id: 'supl', valor: 180 - (a + b), error: 'GE-TRI3', siFuera: 'Eso es el interior en C. Para B, resta A del exterior.' },
          ], gr),
          solucion: { texto: 'El exterior en C suma los interiores A y B.', ecuacion: pideExt ? [`exterior = ${a}° + ${b}° = ${a + b}°`] : [cB, ` = ${a + b}° − ${a}° = ${b}°`], dibujo: fig(true) },
        };
      },
    },
  };

  // ---------- Idea 2: desigualdad triangular ----------
  // Cambia: el ángulo entre los lados de 5 y 8 · Permanece: esos dos lados · Progresa: el largo del tercer lado ·
  // Se reserva: los dos extremos aplastados (3 y 13) · Debe verse: en los extremos no hay triángulo, solo un segmento.
  const bisagra = (g, o = {}) => {
    const B = [0, 0], C = [8, 0], A = U.polar(B, 5, g);
    const x = U.dist(A, C);
    return {
      alt: o.alt || `Lados de 5 y 8 con ángulo de ${g}° entre ellos: el tercer lado mide ${f(x)}`,
      vista: { x: [-5.6, 8.6], y: [-0.8, 5.4] },
      puntos: [{ id: 'B', x: 0, y: 0, rotulo: 'B', lado: -90 }, { id: 'C', x: 8, y: 0, rotulo: 'C', lado: -90 }, { id: 'A', x: A[0], y: A[1], rotulo: 'A', color: 'o', lado: 90 },
        ...(o.extremos ? [{ id: 'A0', x: 5, y: 0, color: 'h', rotulo: 'x = 3', lado: -90, desde: o.extremos[0] }, { id: 'A1', x: -5, y: 0, color: 'h', rotulo: 'x = 13', lado: -90, desde: o.extremos[1] }] : [])],
      segmentos: [{ de: 'B', a: 'C', texto: '8', grosor: 'variable', color: 'i' }, { de: 'B', a: 'A', texto: '5', grosor: 'variable', color: 'o' },
        { de: 'A', a: 'C', color: 'h', texto: o.sinX ? 'x' : `x ≈ ${f(x)}` },
        ...(o.extremos ? [{ de: 'A1', a: 'C', color: 'h', discontinua: true, desde: o.extremos[1] }] : [])],
    };
  };
  const desigualdad = {
    id: 'desigualdad',
    titulo: 'El tercer lado tiene límites',
    temas: ['Desigualdad triangular'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Dos lados de 5 y 8 giran en B como bisagra. Abre y cierra el ángulo y mira cómo cambia el tercer lado x.',
      voz: 'Abre y cierra la bisagra. Fíjate en el x más corto y el más largo.',
      controles: [{ id: 'g', etiqueta: 'Ángulo en B', min: 15, max: 165, paso: 15, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: bisagra(v.g), estado: {} }),
      lectura: v => [{ v: 'c-h', t: 'x' }, ` ≈ ${f(U.dist(U.polar([0, 0], 5, v.g), [8, 0]))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Si la bisagra pudiera cerrarse del todo o abrirse del todo, ¿entre qué valores puede estar x para que haya triángulo?',
      voz: 'Imagina los dos extremos. ¿Queda un triángulo ahí?',
      opciones: [
        { id: 'c', texto: 'Entre 3 y 13, sin llegar a ninguno', correcta: true },
        { id: 'cerrado', texto: 'De 3 a 13, incluidos', error: 'GE-DT3', siFuera: 'En 3 y en 13 los lados sí existen, pero quedan sobre una recta: es un segmento, no un triángulo.' },
        { id: 'solo-sup', texto: 'Cualquier valor menor que 13', error: 'GE-DT2', siFuera: 'El límite de 13 está bien. Si x es muy chico, 5 y x no alcanzan a cubrir 8.' },
        { id: 'suma', texto: 'Solo 13', error: 'GE-DT1', siFuera: 'Sumar 5 + 8 da el límite de arriba. x puede tomar todo un rango.' },
      ],
      dibujo: { datos: bisagra(60, { sinX: true }), estado: {} },
      revelar: { datos: bisagra(60, { extremos: [0, 0], sinX: true, alt: 'Cerrada, x mide 3; abierta del todo, 13: en ambos casos los lados quedan en una recta' }), estado: {} },
      coincide: 'Coincide: 8 − 5 < x < 8 + 5. En los extremos el triángulo se aplasta.',
    },
    mira: {
      datos: bisagra(60, { extremos: [1, 2], sinX: true, alt: 'La bisagra cerrada da x = 3 y abierta da x = 13; entre ambos hay triángulo' }),
      voz: 'Mira los dos extremos: ahí el triángulo desaparece.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cerrada del todo, A cae sobre BC: x = 8 − 5.', ecuacion: [{ v: 'c-h', t: 'x' }, ' = 3: segmento, sin triángulo'] },
        { estado: { corte: 2 }, texto: 'Abierta del todo, A queda al otro lado: x = 8 + 5.', ecuacion: [{ v: 'c-h', t: 'x' }, ' = 13: otro segmento'] },
        { estado: { corte: 2 }, texto: 'Cualquier abertura intermedia da triángulo.', ecuacion: ['8 − 5 < ', { v: 'c-h', t: 'x' }, ' < 8 + 5'] },
      ],
    },
    regla: {
      texto: 'Cada lado de un triángulo es menor que la suma de los otros dos y mayor que su diferencia.',
      ecuacion: [{ abs: ['a − b'] }, ' < ', { v: 'c-h', t: 'x' }, ' < a + b'],
      condicion: 'las desigualdades son estrictas: con igualdad, los tres puntos quedan alineados y no hay triángulo.',
      voz: 'Los extremos no cuentan: ahí la figura es un segmento.',
    },
    ahoraTu: {
      voz: 'Primero los dos límites; después cuenta los enteros entre ellos.',
      generar(s) {
        const r = azar(s), p = r.ent(3, 12), q = r.ent(3, 12);
        const lo = Math.abs(p - q), hi = p + q, n = hi - lo - 1;
        return {
          pregunta: [`Dos lados de un triángulo miden ${p} y ${q}. ¿Cuántos valores enteros puede tomar el tercer lado `, { v: 'c-h', t: 'x' }, '?'],
          opciones: opciones(n, [
            { id: 'cerrado', valor: n + 2, error: 'GE-DT3', siFuera: `Contar ${lo} y ${hi} sería cierto si los extremos dieran triángulo; ahí los puntos quedan alineados.` },
            { id: 'solo-sup', valor: hi - 1, error: 'GE-DT2', siFuera: 'El límite de arriba está bien; también hay uno de abajo: la diferencia.' },
            { id: 'uno', valor: n + 1, error: 'GE-DT3', siFuera: 'Eso incluye uno de los extremos; ninguno de los dos da triángulo.' },
          ], n => `${f(n, 0)}`),
          solucion: { texto: `x va de más de ${lo} a menos de ${hi}.`, ecuacion: [`${lo} < `, { v: 'c-h', t: 'x' }, ` < ${hi} → ${n} enteros`] },
        };
      },
    },
  };

  // ---------- Idea 3: altura, mediana, bisectriz y mediatriz ----------
  // Cambia: la posición de A sobre BC · Permanece: la base BC · Progresa: dónde caen los pies de las tres cevianas ·
  // Se reserva: el obtusángulo (altura fuera) · Debe verse: cada línea se define por su condición, no por su aspecto.
  const notables = (ax, ay, o = {}) => {
    const A = [ax, ay], B = [0, 0], C = [6, 0];
    const H = [ax, 0], M = [3, 0];
    const c = U.dist(A, B), b = U.dist(A, C), D = [6 * c / (b + c), 0];
    const ve = o.ver || { h: 1, m: 1, b: 1 };
    const pasos = o.pasos || {};
    const P = [];
    if (ax < 0) P.push({ id: 'Bx', x: ax - 0.6, y: 0, sinPunto: true });
    return {
      alt: o.alt || `Desde A salen la altura (pie en x = ${f(ax)}), la mediana (al punto medio) y la bisectriz${ax < 0 ? '; la altura cae fuera, en la prolongación de CB' : ''}`,
      vista: { x: [-3, 7], y: [-1, 4.6] },
      puntos: [{ id: 'A', x: ax, y: ay, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: ax < 0 ? -60 : -120 }, { id: 'C', x: 6, y: 0, rotulo: 'C', lado: -60 },
        { id: 'H', x: H[0], y: 0, rotulo: ve.h ? 'H' : undefined, sinPunto: !ve.h, color: 'h', lado: -90, desde: pasos.h || 0 },
        { id: 'M', x: 3, y: 0, rotulo: ve.m ? 'M' : undefined, sinPunto: !ve.m, color: 'i', lado: -90, desde: pasos.m || 0 },
        { id: 'D', x: D[0], y: 0, rotulo: ve.b ? 'D' : undefined, sinPunto: !ve.b, color: 'o', lado: -90, desde: pasos.b || 0 },
        { id: 'Mz', x: 3, y: 4.2, sinPunto: true }, ...P],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C', marcas: 0 }, { de: 'C', a: 'A' },
        ...(ax < 0 && ve.h ? [{ de: 'B', a: 'H', discontinua: true, grosor: 'fino', desde: pasos.h || 0 }] : []),
        ...(ve.h ? [{ de: 'A', a: 'H', color: 'h', grosor: 'variable', desde: pasos.h || 0 }] : []),
        ...(ve.m ? [{ de: 'A', a: 'M', color: 'i', grosor: 'variable', desde: pasos.m || 0 }, { de: 'B', a: 'M', marcas: 1, color: 'i', desde: pasos.m || 0 }, { de: 'M', a: 'C', marcas: 1, color: 'i', desde: pasos.m || 0 }] : []),
        ...(ve.b ? [{ de: 'A', a: 'D', color: 'o', grosor: 'variable', desde: pasos.b || 0 }] : []),
        ...(ve.z ? [{ de: 'M', a: 'Mz', color: 'd', discontinua: true, desde: pasos.z || 0 }] : [])],
      angulos: [
        ...(ve.h ? [{ en: 'H', de: ax < 0 ? 'C' : 'C', a: 'A', color: 'h', desde: pasos.h || 0 }] : []),
        ...(ve.b ? [{ en: 'A', de: 'B', a: 'D', color: 'o', rayita: 1, radio: 30, desde: pasos.b || 0 }, { en: 'A', de: 'D', a: 'C', color: 'o', rayita: 1, radio: 30, desde: pasos.b || 0 }] : []),
        ...(ve.z ? [{ en: 'M', de: 'C', a: 'Mz', color: 'd', desde: pasos.z || 0 }] : []),
      ],
    };
  };
  const lineas = {
    id: 'lineas-notables',
    titulo: 'Cada línea, por su condición',
    temas: ['Líneas notables'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Desde A salen tres líneas: altura (roja), mediana (turquesa) y bisectriz (naranja). Mueve A y mira dónde cae cada pie.',
      voz: 'Mueve A. Busca cuándo las tres líneas coinciden.',
      controles: [{ id: 'ax', etiqueta: 'A a lo ancho', min: 1, max: 5, paso: 0.5, inicio: 1.5, unidad: '', decimales: 1 }],
      dibujo: v => ({ datos: notables(v.ax, 3.6), estado: {} }),
      lectura: v => [`Pies: H en ${f(v.ax)} · M en 3 · D en ${f(6 * U.dist([v.ax, 3.6], [0, 0]) / (U.dist([v.ax, 3.6], [0, 0]) + U.dist([v.ax, 3.6], [6, 0])))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora A se corre a la izquierda de B: el ángulo B queda obtuso. ¿Dónde cae el pie de la altura trazada desde A?',
      voz: 'Recuerda qué exige una altura. Luego decide.',
      opciones: [
        { id: 'c', texto: 'Fuera del triángulo, en la prolongación de CB', correcta: true },
        { id: 'medio', texto: 'En el punto medio de BC', error: 'GE8', siFuera: 'El punto medio es el pie de la mediana. La altura busca el ángulo recto.' },
        { id: 'dentro', texto: 'Dentro de BC, aunque quede inclinada', error: 'GE7', siFuera: 'Dentro caería si B y C fueran agudos. La altura debe formar 90° con la recta BC.' },
        { id: 'en-b', texto: 'Justo en B: AB es la altura', error: 'GE7', siFuera: 'AB sería la altura si B midiera 90°. Aquí B es obtuso.' },
      ],
      dibujo: { datos: notables(-1.5, 3, { ver: {} }), estado: {} },
      revelar: { datos: notables(-1.5, 3, { ver: { h: 1 } }), estado: {} },
      coincide: 'Coincide: la altura llega perpendicular a la recta BC, fuera del lado.',
    },
    mira: {
      datos: notables(1.5, 3.6, { ver: { h: 1, m: 1, b: 1, z: 1 }, pasos: { h: 1, m: 2, b: 3, z: 4 }, alt: 'Altura, mediana y bisectriz desde A, y la mediatriz de BC: cuatro líneas distintas' }),
      voz: 'Una línea por paso. Cada una tiene su marca.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Altura: forma 90° con la recta BC.', ecuacion: ['AH ⟂ BC'] },
        { estado: { corte: 2 }, texto: 'Mediana: llega al punto medio de BC.', ecuacion: ['BM = MC'] },
        { estado: { corte: 3 }, texto: 'Bisectriz: parte el ángulo A en dos iguales.', ecuacion: ['∠BAD = ∠DAC'] },
        { estado: { corte: 4 }, texto: 'Mediatriz: perpendicular a BC en su punto medio; no pasa por A.', ecuacion: ['mediatriz ⟂ BC en M'] },
      ],
    },
    regla: {
      texto: 'Altura: perpendicular a la recta del lado opuesto. Mediana: llega a su punto medio. Bisectriz: parte el ángulo en dos iguales. Mediatriz: perpendicular en el punto medio.',
      condicion: 'cada altura llega a la recta de su lado: en el obtusángulo, dos caen fuera del triángulo.',
      voz: 'Nombra cada línea por su marca, no por cómo luce.',
    },
    ahoraTu: {
      voz: 'Busca la marca: ángulo recto, rayitas o arcos iguales.',
      generar(s) {
        const r = azar(s), ax = r.de([-1.5, -1, 0.5, 1, 1.5, 2, 4, 4.5, 5, 6.5]), ay = r.de([2.5, 3, 3.5, 4]);
        const tipos = ['h', 'm', 'b', 'z'], t = tipos[s % 4];
        const nom = { h: 'altura', m: 'mediana', b: 'bisectriz', z: 'mediatriz' };
        const marca = { h: 'un ángulo recto con la recta del lado opuesto', m: 'rayitas iguales a cada lado del pie', b: 'dos arcos iguales en el vértice', z: 'un ángulo recto en el punto medio, sin pasar por el vértice' };
        const d = notables(ax, ay, { ver: { [t]: 1 } });
        d.alt = `Triángulo con una línea marcada: ${t === 'h' ? 'forma 90° con la recta del lado opuesto' : t === 'm' ? 'llega al punto medio del lado opuesto' : t === 'b' ? 'parte el ángulo del vértice en dos iguales' : 'es perpendicular a un lado en su punto medio'}`;
        if (t === 'h' && ax < 0) d.puntos.find(p => p.id === 'B').lado = -60;
        const nombres = r.de(['ABC', 'PQR', 'RST', 'XYZ', 'JKL', 'UVW']);
        d.puntos.forEach(p => { const k = 'ABC'.indexOf(p.id); if (k >= 0 && p.id.length === 1) p.rotulo = nombres[k]; });
        return {
          pregunta: `En el triángulo ${nombres}, mira las marcas de la línea de color que sale de ${nombres[0]}. ¿Qué línea notable es?`,
          dibujo: { datos: d, estado: {} },
          opciones: [{ id: 'c', texto: nom[t], correcta: true }].concat(tipos.filter(k => k !== t).map(k => ({ id: k, texto: nom[k], error: t === 'h' || k === 'h' ? 'GE7' : 'GE8', siFuera: `Sería ${nom[k]} si tuviera ${marca[k]}.` }))),
          solucion: { texto: `Su marca es ${t === 'h' ? 'el ángulo recto en el pie' : t === 'm' ? 'el punto medio del lado opuesto' : t === 'b' ? 'la de dos ángulos iguales en el vértice' : 'el ángulo recto en el punto medio'}.`, ecuacion: [nom[t]] },
        };
      },
    },
  };

  // ---------- Idea 4: ángulos formados por bisectrices ----------
  // Cambia: los ángulos B y C · Permanece: la base BC · Progresa: ∠BIC y ∠BEC frente a A ·
  // Se reserva: la bisectriz exterior en C · Debe verse: ∠BIC = 90° + A/2 y ∠BEC = A/2.
  const bis = (b, c, o = {}) => {
    const { A, B, C } = porAngulos(b, c, 6);
    const la = U.dist(B, C), lb = U.dist(A, C), lc = U.dist(A, B), s = la + lb + lc;
    const I = [(la * A[0] + lb * B[0] + lc * C[0]) / s, (la * A[1] + lb * B[1] + lc * C[1]) / s];
    const ext = U.polar(C, 1, (180 - c) / 2); // bisectriz exterior en C: entre CA y la prolongación de BC
    const E = U.corte(B, I, C, ext);
    const a = 180 - b - c, k = o.pasos || {};
    const conE = o.E && E && E[0] < 14;
    return {
      alt: o.alt || `Triángulo con A = ${a}°: las bisectrices interiores de B y C se cortan en I formando ${90 + a / 2}°${conE ? `; con la exterior en C forman ${a / 2}° en E` : ''}`,
      vista: o.E ? { x: [-0.6, 12], y: [-0.8, 6.8] } : { x: [-1.6, 7.6], y: [-0.6, 8.6] },
      puntos: [{ id: 'A', x: A[0], y: A[1], rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: 6, y: 0, rotulo: 'C', lado: -60 },
        { id: 'I', x: I[0], y: I[1], rotulo: 'I', color: 'h', lado: -90 }, { id: 'Cx', x: o.E ? 11.5 : 6.5, y: 0, sinPunto: true },
        ...(conE ? [{ id: 'E', x: E[0], y: E[1], rotulo: 'E', color: 'h', lado: 60, desde: k.E || 0 }] : [])],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' },
        { de: 'B', a: 'I', color: 'i', grosor: 'fino', desde: k.I || 0 }, ...(conE ? [{ de: 'I', a: 'E', color: 'i', grosor: 'fino', desde: k.E || 0 }] : []), { de: 'C', a: 'I', color: 'd', grosor: 'fino', desde: k.I || 0 },
        ...(o.E ? [{ de: 'C', a: 'Cx', discontinua: true, grosor: 'fino' }] : []),
        ...(conE ? [{ de: 'C', a: 'E', color: 'd', discontinua: true, desde: k.E || 0 }] : [])],
      angulos: [
        { en: 'A', de: 'B', a: 'C', color: 'o', texto: `${a}°` },
        { en: 'B', de: 'C', a: 'I', color: 'i', rayita: 1, radio: 28, desde: k.I || 0 }, { en: 'B', de: 'I', a: 'A', color: 'i', rayita: 1, radio: 28, desde: k.I || 0 },
        { en: 'C', de: 'I', a: 'B', color: 'd', rayita: 2, radio: 24, desde: k.I || 0 }, { en: 'C', de: 'A', a: 'I', color: 'd', rayita: 2, radio: 24, desde: k.I || 0 },
        { en: 'I', de: 'B', a: 'C', color: 'h', texto: o.sinBIC ? undefined : `${90 + a / 2}°`, radio: 20, desde: k.BIC || 0 },
        ...(conE ? [{ en: 'E', de: 'B', a: 'C', color: 'h', texto: o.sinE ? undefined : `${a / 2}°`, radio: 30, desde: k.E2 || k.E || 0 }, { en: 'C', de: 'I', a: 'E', color: 'h', desde: k.E || 0 }] : []),
      ],
    };
  };
  const bisectrices = {
    id: 'angulo-de-bisectrices',
    titulo: 'El ángulo entre dos bisectrices',
    temas: ['Ángulos formados por bisectrices'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Las bisectrices de B y C se cortan en I. Cambia los ángulos B y C y compara el ángulo BIC con el ángulo A.',
      voz: 'Cambia B y C. Busca una relación entre BIC y A.',
      controles: [
        { id: 'b', etiqueta: 'B', min: 40, max: 70, paso: 10, inicio: 60, unidad: '°', decimales: 0, color: 'c-i' },
        { id: 'c', etiqueta: 'C', min: 40, max: 70, paso: 10, inicio: 50, unidad: '°', decimales: 0, color: 'c-d' },
      ],
      dibujo: v => ({ datos: bis(v.b, v.c), estado: {} }),
      lectura: v => [cA, ` = ${180 - v.b - v.c}° · ∠BIC = ${90 + (180 - v.b - v.c) / 2}°`],
      minimo: 4,
    },
    predice: {
      pregunta: ['Con ', cA, ' = 60°, cambiamos la bisectriz de C por la exterior: corta a la bisectriz de B en E. ¿Cuánto mide el ángulo BEC?'],
      voz: 'La bisectriz cambió. Decide si la relación cambia también.',
      opciones: [
        { id: 'c', texto: '30°', correcta: true },
        { id: 'interior', texto: '120°', error: 'GE-BIS4', siFuera: '120° es ∠BIC, con las dos bisectrices interiores. En E una de ellas es exterior.' },
        { id: 'resta', texto: '60°', error: 'GE-BIS5', siFuera: '60° sería cierto si E viera el ángulo A completo. Recibe solo su mitad.' },
        { id: 'compl', texto: '90°', error: 'GE-BIS5', siFuera: 'Las bisectrices de C sí forman 90° entre sí; el ángulo en E es otro.' },
      ],
      dibujo: { datos: bis(70, 50, { E: true, sinE: true, sinBIC: true, alt: 'Triángulo con A = 60°: bisectriz interior de B y exterior de C se cortan en E' }), estado: {} },
      revelar: { datos: bis(70, 50, { E: true }), estado: {} },
      coincide: ['Coincide: ∠BEC = ', cA, '/2 = 30°.'],
    },
    mira: {
      datos: bis(70, 50, { E: true, pasos: { I: 1, BIC: 2, E: 3, E2: 4 } }),
      voz: 'Primero el interior; luego el exterior se apoya en él.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Las bisectrices toman la mitad de B y la mitad de C.', ecuacion: [{ frac: [cB, '2'] }, ' + ', { frac: [cC, '2'] }, ' = ', { frac: [['180° − ', cA], '2'] }] },
        { estado: { corte: 2 }, texto: 'En el triángulo BIC, lo que falta para 180° es ∠BIC.', ecuacion: ['∠BIC = 180° − ', { frac: [[cB, ' + ', cC], '2'] }, ' = 90° + ', { frac: [cA, '2'] }] },
        { estado: { corte: 3 }, texto: 'Las dos bisectrices de C forman 90°.', ecuacion: ['∠ICE = 90°'] },
        { estado: { corte: 4 }, texto: 'En el triángulo ICE, el exterior en I es ∠BIC.', ecuacion: ['∠BEC = ∠BIC − 90° = ', { frac: [cA, '2'] }, ' = 30°'] },
      ],
    },
    regla: {
      texto: 'Las bisectrices interiores de B y C forman 90° + A/2. Si una es interior y la otra exterior, forman A/2.',
      ecuacion: ['∠BIC = 90° + ', { frac: [cA, '2'] }, '   ·   ∠BEC = ', { frac: [cA, '2'] }],
      condicion: 'I está en las bisectrices interiores de B y C; E, en la interior de B y la exterior de C.',
      voz: 'Antes de aplicar, revisa qué bisectrices se cortan.',
    },
    ahoraTu: {
      voz: 'Mira qué bisectrices se cortan antes de elegir la fórmula.',
      generar(s) {
        const r = azar(s), a = 10 * r.ent(3, 10), conE = s % 2 === 1;
        const b = 10 * r.ent(3, Math.min(10, (170 - a) / 10 - 3)), c = 180 - a - b;
        const d = bis(b, c, { E: conE, sinBIC: true, sinE: true });
        if (conE) d.angulos = d.angulos.filter(an => !(an.en === 'I'));
        const bien = conE ? a / 2 : 90 + a / 2;
        return {
          pregunta: conE ? ['En el triángulo ABC, ', cA, ` = ${a}°. La bisectriz interior de B y la exterior de C se cortan en E. ¿Cuánto mide ∠BEC?`]
            : ['En el triángulo ABC, ', cA, ` = ${a}°. Las bisectrices interiores de B y C se cortan en I. ¿Cuánto mide ∠BIC?`],
          dibujo: { datos: d, estado: {} },
          opciones: opciones(bien, [
            { id: 'cambio', valor: conE ? 90 + a / 2 : a / 2, error: 'GE-BIS4', siFuera: conE ? 'Esa fórmula vale con dos bisectrices interiores; aquí una es exterior.' : 'A/2 vale con una bisectriz exterior; aquí las dos son interiores.' },
            { id: 'menos', valor: 90 - a / 2, error: 'GE-BIS5', siFuera: '90° − A/2 aparece con dos bisectrices exteriores, no en este corte.' },
            { id: 'sin-mitad', valor: conE ? a : 90 + a, error: 'GE-BIS5', siFuera: 'Falta la mitad: cada bisectriz toma solo la mitad de su ángulo.' },
          ], gr),
          solucion: { texto: conE ? 'Interior con exterior: la mitad de A.' : 'Dos interiores: 90° más la mitad de A.', ecuacion: conE ? ['∠BEC = ', { frac: [`${a}°`, '2'] }, ` = ${a / 2}°`] : ['∠BIC = 90° + ', { frac: [`${a}°`, '2'] }, ` = ${90 + a / 2}°`] },
        };
      },
    },
  };

  return {
    unidad: 'geometria.triangulos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'En la proposición I.32 de los Elementos, la suma de los ángulos de un triángulo no se obtiene midiendo muchos dibujos: se traza una paralela y se comparan ángulos. El mismo argumento da el ángulo exterior. Una figura auxiliar se vuelve parte de la demostración.',
      pregunta: '¿Qué línea convierte una regularidad en una prueba?',
      fuente: { titulo: 'Euclides, Elementos I.32 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/propI32.html' },
    },
    ideas: [suma, desigualdad, lineas, bisectrices],
  };
});
