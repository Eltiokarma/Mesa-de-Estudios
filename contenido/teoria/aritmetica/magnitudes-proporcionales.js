/*
 * Teoría de «Magnitudes proporcionales y reparto» (aritmetica.magnitudes-proporcionales). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 4) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR6–AR10 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: reconocer si dos magnitudes conservan el cociente (directa) o el producto (inversa) antes de operar.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja de 360 px, en el aula o en la combi, sin audio.
 *   Resultado observable: resuelve regla de tres simple y compuesta, repartos directos e inversos y regla de compañía.
 *   Orden de atención: 1.º la gráfica o las tiras · 2.º lo que se mantiene (cociente, producto, obra, total) · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · predicción elegida · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿cuándo la regla de tres se hace en cruz y cuándo al revés?».
 * Colores (regla 4): x naranja (c-o), y turquesa (c-i), la constante k verde (c-d); en el reparto, cada parte con su
 * color (c-o, c-i, c-h) y el total T en verde (c-d).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const sol = n => `S/ ${f(n)}`;
  const x = { v: 'c-o', t: 'x' }, y = { v: 'c-i', t: 'y' }, k = { v: 'c-d', t: 'k' }, T = { v: 'c-d', t: 'T' };
  const wi = { sub: ['w', 'i'] };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor < 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const COL = ['o', 'i', 'h'];

  // ---------- Idea 1: directa conserva el cociente; inversa, el producto ----------
  // Cambia: x, y el tipo de relación. Permanece: k = 24 (cociente 4 o producto 24) y los ejes.
  // Progresa: el punto recorre la recta por el origen o la curva; el rectángulo x · y no cambia de área.
  // Se reserva: los obreros, donde «más obreros» da «menos días». Debe verse: el área del rectángulo es siempre 24.
  const curvaInversa = (K, x0, x1) => Array.from({ length: 41 }, (_, i) => { const u = x0 + (x1 - x0) * i / 40; return [u, K / u]; });
  const planoJuego = (tipo, xv) => {
    const yv = tipo === 'directa' ? 4 * xv : 24 / xv;
    return {
      x: { min: 0, max: 6, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: 0, max: 24, paso: 4, nombre: 'y', decimales: 0, color: 'i' },
      curvas: [{ puntos: tipo === 'directa' ? [[0, 0], [6, 24]] : curvaInversa(24, 1, 6), color: 'i' }],
      areas: tipo === 'inversa' ? [{ puntos: [[0, yv], [xv, yv]], color: 'd', rotulo: `${f(xv)} · ${f(yv)} = 24` }] : [],
      puntos: [{ x: xv, y: yv, color: 'i', rotulo: `(${f(xv)}; ${f(yv)})`, guias: true }],
      compacto: true,
    };
  };
  const obreros = (corte = {}) => ({
    x: { min: 0, max: 24, paso: 4, nombre: 'obreros', decimales: 0, color: 'o' },
    y: { min: 0, max: 30, paso: 5, nombre: 'días', decimales: 0, color: 'i' },
    curvas: [{ puntos: curvaInversa(180, 6, 24), color: 'i', desde: corte.curva || 0 }],
    areas: [
      { puntos: [[0, 15], [12, 15]], color: 'd', desde: corte.a1 || 0 },
      { puntos: [[0, 9], [20, 9]], color: 'h', desde: corte.a2 === undefined ? 0 : corte.a2 },
    ],
    puntos: [{ x: 12, y: 15, color: 'd', rotulo: '15 días', guias: true, desde: corte.a1 || 0 }, { x: 20, y: 9, color: 'h', rotulo: '9 días', guias: true, desde: corte.a2 === undefined ? 0 : corte.a2 }],
    compacto: true,
  });
  const directaInversa = {
    id: 'directa-inversa',
    titulo: 'Cociente fijo o producto fijo',
    temas: ['Magnitudes directa e inversamente proporcionales', 'Gráficas de proporcionalidad'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige el tipo de relación y mueve x. En la directa mira el cociente; en la inversa, el rectángulo verde.',
      voz: 'Compara la forma de las dos gráficas.',
      controles: [
        { id: 'tipo', etiqueta: 'Relación', opciones: [{ valor: 'directa', texto: 'Directa' }, { valor: 'inversa', texto: 'Inversa' }] },
        { id: 'x', etiqueta: 'x', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: planoJuego(v.tipo, v.x), estado: {} }),
      lectura: v => (v.tipo === 'directa' ? [y, ' ÷ ', x, ` = ${f(4 * v.x)} ÷ ${f(v.x)} = 4`] : [x, ' · ', y, ` = ${f(v.x)} · ${f(24 / v.x)} = 24`]),
      minimo: 3,
    },
    predice: {
      pregunta: '12 obreros terminan una obra en 15 días. Si todos trabajan al mismo ritmo, ¿en cuántos días la terminan 20 obreros?',
      opciones: [
        { id: 'c', texto: '9 días', correcta: true },
        { id: 'directa', texto: '25 días', error: 'AR8', siFuera: 'Sería cierto si más obreros tardaran más. Con más obreros la obra se reparte.' },
        { id: 'resta', texto: '7 días', error: 'AR6', siFuera: 'Eso resta 8 días por 8 obreros más: trata la relación como una resta.' },
        { id: 'igual', texto: '15 días', error: 'AT-NO-CAMBIA', siFuera: 'Sería cierto si los obreros nuevos no trabajaran.' },
      ],
      dibujo: { datos: obreros({ a2: 9 }), estado: {} },
      revelar: { datos: obreros(), estado: {} },
      coincide: 'Coincide: la obra son 180 días-obrero, y 180 ÷ 20 = 9.',
    },
    mira: {
      datos: obreros({ curva: 3, a1: 1, a2: 2 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'La obra mide 12 obreros por 15 días: 180 días-obrero.', ecuacion: ['12 · 15 = 180'] },
        { estado: { corte: 2 }, texto: 'Con 20 obreros, la misma obra: el mismo rectángulo de área 180.', ecuacion: ['20 · d = 180 → d = 9'] },
        { estado: { corte: 3 }, texto: 'Todo par cumple x · y = 180: la gráfica es curva, no recta.', ecuacion: [x, ' · ', y, ' = 180'] },
      ],
    },
    regla: {
      texto: 'Son directamente proporcionales si su cociente es constante: la gráfica es una recta que pasa por el origen. Son inversamente proporcionales si su producto es constante.',
      ecuacion: ['directa: ', { frac: [y, x] }, ' = ', k, '   ·   inversa: ', x, ' · ', y, ' = ', k],
      condicion: 'crecer juntas no basta: y = 2x + 3 crece y no es proporcional. En la inversa, x no puede ser 0.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const casos = [
          { tipo: 'inversa', a: 'obreros', b: 'días', t: (p, q) => `${p} obreros hacen una obra en ${q} días. Al mismo ritmo, ¿en cuántos días la hacen ` },
          { tipo: 'inversa', a: 'km/h', b: 'horas', t: (p, q) => `Una combi va a ${p} km/h y tarda ${q} horas. Por la misma ruta, ¿cuántas horas tarda a ` },
          { tipo: 'directa', a: 'kg', b: 'soles', t: (p, q) => `${p} kg de papa cuestan ${q} soles. Al mismo precio, ¿cuántos soles cuestan ` },
          { tipo: 'directa', a: 'litros', b: 'km', t: (p, q) => `Con ${p} litros un auto recorre ${q} km. Al mismo rendimiento, ¿cuántos km recorre con ` },
        ];
        const c = casos[s % 4];
        const usa = [2, 3, 4, 5, 6, 8, 10, 12];
        const p1 = r.de(usa), p2 = r.de(usa.filter(v => v !== p1));
        const P = r.de([120, 240, 360]), u = r.ent(2, 9);         // inversa: x · y = P; directa: y = u · x
        const q1v = c.tipo === 'directa' ? u * p1 : P / p1;
        const res = c.tipo === 'directa' ? u * p2 : P / p2;
        const otro = c.tipo === 'directa' ? q1v * p1 / p2 : q1v * p2 / p1;
        return {
          pregunta: c.t(f(p1), f(q1v)) + `${f(p2)} ${c.a === 'obreros' ? 'obreros' : c.a}?`,
          opciones: opciones(res, [
            { id: 'cambia', valor: otro, error: c.tipo === 'inversa' ? 'AR8' : 'AT-INVERSA', siFuera: c.tipo === 'inversa' ? 'Eso la trata como directa; aquí se conserva el producto.' : 'Eso la trata como inversa; aquí se conserva el cociente.' },
            { id: 'resta', valor: q1v + (c.tipo === 'directa' ? 1 : -1) * (p2 - p1), error: 'AR6', siFuera: 'Eso suma la diferencia; la relación es multiplicativa.' },
            { id: 'igual', valor: q1v, error: 'AT-NO-CAMBIA', siFuera: 'Esa es la cantidad del primer caso.' },
          ], n => f(n)),
          solucion: {
            texto: c.tipo === 'directa' ? 'Directa: el cociente se mantiene.' : 'Inversa: el producto se mantiene.',
            ecuacion: c.tipo === 'directa' ? [`${f(q1v)} ÷ ${f(p1)} · ${f(p2)} = ${f(res)}`] : [`${f(p1)} · ${f(q1v)} ÷ ${f(p2)} = ${f(res)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 2: regla de tres compuesta: la obra no cambia ----------
  // Cambia: obreros y horas por día. Permanece: la obra de 120 horas-obrero.
  // Progresa: la tira de la obra se corta en días. Se reserva: el caso de 8 y 12 obreros con horas distintas.
  // Debe verse: más trabajo por día, menos días; la obra es el producto de las tres magnitudes.
  const dias = (obra, porDia, o = {}) => {
    const n = Math.floor(obra / porDia + 1e-9), resto = obra - n * porDia;
    const tramos = Array.from({ length: n }, (_, i) => ({ valor: porDia, color: i % 2 ? 'i' : 'o', relleno: 0.28, texto: o.numerar ? String(i + 1) : undefined, paso: o.paso }));
    if (resto > 1e-9) tramos.push({ valor: resto, color: 'h', relleno: 0.28, paso: o.paso });
    return tramos;
  };
  const obraDatos = (obra, porDia, o = {}) => ({
    max: obra, filas: 2,
    tiras: [
      { rotulo: o.rotObra || `obra: ${f(obra)} horas-obrero`, color: 'd', tramos: [{ valor: obra, color: 'd', relleno: 0.12 }] },
      { rotulo: o.rotDias || `un día = ${f(porDia)} horas-obrero`, color: 'i', paso: o.paso, sinContorno: true, tramos: dias(obra, porDia, { numerar: true, paso: o.paso }) },
    ],
  });
  const compuesta = {
    id: 'compuesta',
    titulo: 'La obra se reparte en días',
    temas: ['Regla de tres simple y compuesta'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Una obra necesita 120 horas-obrero. Elige cuántos obreros y cuántas horas al día. Mira en cuántos días se corta la obra.',
      voz: 'Cada pedazo es lo que se avanza en un día.',
      controles: [
        { id: 'o', etiqueta: 'Obreros', color: 'c-o', min: 2, max: 6, paso: 1, inicio: 3, decimales: 0 },
        { id: 'h', etiqueta: 'Horas al día', color: 'c-i', min: 2, max: 10, paso: 2, inicio: 4, decimales: 0 },
      ],
      dibujo: v => ({ datos: obraDatos(120, v.o * v.h), estado: {} }),
      lectura: v => [`${f(v.o)} · ${f(v.h)} = ${f(v.o * v.h)} por día → ${f(120 / (v.o * v.h))} días`],
      minimo: 3,
    },
    predice: {
      pregunta: '8 obreros trabajando 6 horas al día hacen una obra en 10 días. ¿En cuántos días harían la misma obra 12 obreros trabajando 5 horas al día?',
      opciones: [
        { id: 'c', texto: '8 días', correcta: true },
        { id: 'horas-directa', texto: '5,56 días', error: 'AR9', siFuera: 'Eso trata las horas por día como directas: menos horas al día darían menos días.' },
        { id: 'todo-directo', texto: '18 días', error: 'AR8', siFuera: 'Eso trata a los obreros como directos: más obreros tardarían más.' },
        { id: 'solo-obreros', texto: '6,67 días', error: 'AT-OLVIDA', siFuera: 'Eso usa solo a los obreros; las horas también cambiaron.' },
      ],
      dibujo: { datos: obraDatos(480, 60, { paso: 9, rotObra: 'obra: 8 · 6 · 10 horas-obrero', rotDias: 'un día = 12 · 5 horas-obrero' }), estado: {} },
      revelar: { datos: obraDatos(480, 60, { rotObra: 'obra: 8 · 6 · 10 = 480 horas-obrero', rotDias: 'un día = 12 · 5 = 60 horas-obrero' }), estado: {} },
      coincide: 'Coincide: 480 horas-obrero se cortan en 8 días de 60.',
    },
    mira: {
      datos: obraDatos(480, 60, { paso: 2, rotObra: 'obra: 8 · 6 · 10 = 480 horas-obrero', rotDias: 'un día = 12 · 5 = 60 horas-obrero' }),
      pasos: [
        { estado: { paso: 1 }, texto: 'La obra no cambia: obreros por horas por días.', ecuacion: ['8 · 6 · 10 = 480'] },
        { estado: { paso: 2 }, texto: 'Un día nuevo avanza 12 obreros por 5 horas.', ecuacion: ['12 · 5 = 60'] },
        { estado: { paso: 2 }, texto: 'Caben 8 días de 60 en la obra de 480.', ecuacion: ['d = ', { frac: ['480', '60'] }, ' = 8'] },
      ],
    },
    regla: {
      texto: 'Si la obra es la misma, obreros por horas diarias por días da siempre lo mismo. Cada magnitud que trabaja es inversa a los días.',
      ecuacion: [{ sub: ['o', '1'] }, { sub: ['h', '1'] }, { sub: ['d', '1'] }, ' = ', { sub: ['o', '2'] }, { sub: ['h', '2'] }, { sub: ['d', '2'] }],
      condicion: 'todos rinden igual y la obra no cambia. Si la obra se duplica, los días se duplican: obra y días son directas.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), o1 = r.de([4, 6, 8, 10, 12]), h1 = r.de([4, 6, 8]), d1 = r.de([6, 9, 10, 12, 15]);
        const o2 = r.de([3, 4, 5, 6, 8, 12, 15, 16, 20].filter(v => v !== o1)), h2 = r.de([4, 5, 6, 8, 10].filter(v => v !== h1));
        const res = o1 * h1 * d1 / (o2 * h2);
        return {
          pregunta: `${o1} obreros, a ${h1} horas diarias, hacen una obra en ${d1} días. ¿En cuántos días la harían ${o2} obreros a ${h2} horas diarias?`,
          dibujo: { datos: obraDatos(o1 * h1 * d1, o2 * h2, { paso: 9, rotObra: `obra: ${o1} · ${h1} · ${d1} horas-obrero`, rotDias: `un día = ${o2} · ${h2} horas-obrero` }), estado: {} },
          opciones: opciones(res, [
            { id: 'horas-directa', valor: d1 * o1 / o2 * h2 / h1, error: 'AR9', siFuera: 'Eso trata las horas diarias como directas a los días.' },
            { id: 'obreros-directa', valor: d1 * o2 / o1 * h1 / h2, error: 'AR8', siFuera: 'Eso trata a los obreros como directos a los días.' },
            { id: 'solo-obreros', valor: d1 * o1 / o2, error: 'AT-OLVIDA', siFuera: 'Eso usa solo a los obreros; las horas también cambiaron.' },
          ], n => `${f(n)} días`),
          solucion: {
            texto: 'La obra se divide entre lo que se avanza por día.',
            ecuacion: ['d = ', { frac: [`${o1} · ${h1} · ${d1}`, `${o2} · ${h2}`] }, ` = ${f(res)}`],
            dibujo: { datos: obraDatos(o1 * h1 * d1, o2 * h2, { rotObra: `obra: ${f(o1 * h1 * d1)} horas-obrero`, rotDias: `un día = ${f(o2 * h2)} horas-obrero` }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 3: repartir según pesos (directo o inverso) ----------
  // Cambia: los pesos y el modo. Permanece: el total de S/ 240 a la misma escala.
  // Progresa: pesos → partes iguales → montos. Se reserva: el inverso, donde el peso menor recibe más.
  // Debe verse: en el inverso, la parte del 2 es más larga que la del 3.
  const repartoDatos = (total, pesos, inverso, o = {}) => {
    const w = inverso ? pesos.map(p => 1 / p) : pesos;
    const sw = w.reduce((a, b) => a + b, 0);
    return {
      max: total, filas: 2,
      tiras: [
        { rotulo: `total ${sol(total)}`, color: 'd', tramos: [{ valor: total, color: 'd', relleno: 0.12 }] },
        { rotulo: inverso ? 'según 1/peso' : 'según el peso', color: 'o', sinContorno: true, paso: o.paso, tramos: w.map((wv, i) => ({ valor: total * wv / sw, color: COL[i], relleno: 0.3, texto: o.sinMontos ? `peso ${f(pesos[i])}` : f(total * wv / sw) })) },
      ],
    };
  };
  const reparto = {
    id: 'reparto',
    titulo: 'Repartir según pesos',
    temas: ['Reparto proporcional'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Reparte S/ 240 entre dos personas según sus pesos. Cambia los pesos y el modo: directo o inverso.',
      voz: 'En el inverso, mira quién recibe la parte más grande.',
      controles: [
        { id: 'modo', etiqueta: 'Reparto', opciones: [{ valor: 'directo', texto: 'Directo' }, { valor: 'inverso', texto: 'Inverso' }] },
        { id: 'p', etiqueta: 'Peso 1', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 1, decimales: 0 },
        { id: 'q', etiqueta: 'Peso 2', color: 'c-i', min: 1, max: 5, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: v => ({ datos: repartoDatos(240, [v.p, v.q], v.modo === 'inverso'), estado: {} }),
      lectura: v => { const w = v.modo === 'inverso' ? [1 / v.p, 1 / v.q] : [v.p, v.q], sw = w[0] + w[1]; return [`Recibe ${sol(240 * w[0] / sw)} y ${sol(240 * w[1] / sw)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Se reparten S/ 240 en forma inversamente proporcional a 2 y 3. ¿Cuánto recibe la parte que corresponde al 2?',
      opciones: [
        { id: 'c', texto: 'S/ 144', correcta: true },
        { id: 'directo', texto: 'S/ 96', error: 'AR10', siFuera: '96 sería cierto en un reparto directo. Al revés, al número menor le toca más.' },
        { id: 'igual', texto: 'S/ 120', error: 'AT-REPARTE-IGUAL', siFuera: 'Eso reparte en partes iguales, sin usar los pesos.' },
        { id: 'mitad', texto: 'S/ 80', error: 'AT-PARTES', siFuera: 'Eso divide 240 entre 3; los pesos inversos son 1/2 y 1/3.' },
      ],
      dibujo: { datos: repartoDatos(240, [2, 3], true, { paso: 9 }), estado: {} },
      revelar: { datos: repartoDatos(240, [2, 3], true), estado: {} },
      coincide: 'Coincide: con pesos 1/2 y 1/3, el 2 recibe más.',
    },
    mira: {
      datos: repartoDatos(240, [2, 3], true, { paso: 3 }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Inverso a 2 y 3: los pesos son 1/2 y 1/3.', ecuacion: [{ frac: ['1', '2'] }, ' : ', { frac: ['1', '3'] }] },
        { estado: { paso: 2 }, texto: 'Multiplicando por 6 quedan pesos enteros: 3 y 2.', ecuacion: ['6 · ', { frac: ['1', '2'] }, ' = 3   ·   6 · ', { frac: ['1', '3'] }, ' = 2'] },
        { estado: { paso: 3 }, texto: 'Son 5 partes de 48: 3 partes y 2 partes.', ecuacion: ['240 ÷ 5 = 48 → 144 y 96'] },
      ],
    },
    regla: {
      texto: 'Repartir un total en forma directa a unos pesos da a cada uno su peso entre la suma de pesos. El reparto inverso usa como pesos los inversos.',
      ecuacion: [{ sub: ['x', 'i'] }, ' = ', T, ' · ', { frac: [wi, ['Σ', 'w']] }, '   ·   inverso: ', wi, ' → ', { frac: ['1', wi] }],
      condicion: 'los pesos son positivos. Multiplicar todos los pesos por el mismo número no cambia el reparto.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), inverso = s % 2 === 1;
        const pesos = r.de([[2, 3], [3, 4], [2, 3, 6], [1, 2, 3], [3, 6], [2, 5], [4, 6, 12]]);
        const w = inverso ? pesos.map(p => 1 / p) : pesos, sw = w.reduce((a, b) => a + b, 0);
        const mcm = pesos.reduce((m, v) => { const g = (p, q) => (q ? g(q, p % q) : p); return m * v / g(m, v); }, 1);
        const enteros = inverso ? pesos.map(p => mcm / p) : pesos;            // pesos enteros equivalentes
        const T2 = r.de([10, 12, 20, 30, 50]) * enteros.reduce((a, b) => a + b, 0);
        const i = 0, parte = T2 * w[i] / sw;
        const wo = inverso ? pesos : pesos.map(p => 1 / p), swo = wo.reduce((a, b) => a + b, 0);
        return {
          pregunta: `Se reparten S/ ${f(T2)} en forma ${inverso ? 'inversamente' : 'directamente'} proporcional a ${pesos.join(', ').replace(/, ([^,]*)$/, ' y $1')}. ¿Cuánto le toca a la parte del ${pesos[i]}?`,
          dibujo: { datos: repartoDatos(T2, pesos, inverso, { sinMontos: true }), estado: { paso: 9 } },
          opciones: opciones(parte, [
            { id: 'otro-modo', valor: T2 * wo[i] / swo, error: inverso ? 'AR10' : 'AT-INVERSA', siFuera: inverso ? 'Eso reparte en forma directa; aquí al número menor le toca más.' : 'Eso reparte en forma inversa.' },
            { id: 'igual', valor: T2 / pesos.length, error: 'AT-REPARTE-IGUAL', siFuera: 'Eso reparte en partes iguales.' },
            { id: 'peso', valor: T2 / pesos[i], error: 'AT-PARTES', siFuera: `Eso divide el total entre ${pesos[i]}; falta la suma de pesos.` },
          ], sol),
          solucion: {
            texto: inverso ? `Los inversos, por ${mcm}, dan pesos enteros: ${enteros.join(', ')}.` : 'Su peso entre la suma de pesos.',
            ecuacion: [`${f(T2)} · `, { frac: [String(enteros[i]), enteros.join(' + ')] }, ` = ${sol(parte)}`],
            dibujo: { datos: repartoDatos(T2, pesos, inverso), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 4: regla de compañía: el peso es capital por tiempo ----------
  // Cambia: el capital y los meses del socio A. Permanece: el socio B (S/ 3000, 12 meses) y la ganancia.
  // Progresa: capital → capital × meses → parte. Se reserva: el caso donde más capital no es más ganancia.
  // Debe verse: la tira de cada socio mide capital × meses.
  const compDatos = (ca, ta, cb, tb, G, o = {}) => {
    const wa = ca * ta, wb = cb * tb, s = wa + wb;
    return {
      max: G, filas: 2,
      tiras: [
        { rotulo: `A: ${f(ca)} mil × ${f(ta)} meses = ${f(wa)}`, color: 'o', tramos: [{ valor: G * wa / s, color: 'o', relleno: 0.3, texto: o.sin ? undefined : sol(G * wa / s) }] },
        { rotulo: `B: ${f(cb)} mil × ${f(tb)} meses = ${f(wb)}`, color: 'i', tramos: [{ valor: G * wb / s, color: 'i', relleno: 0.3, texto: o.sin ? undefined : sol(G * wb / s) }] },
      ],
    };
  };
  const compania = {
    id: 'compania',
    titulo: 'Capital por tiempo',
    temas: ['Regla de compañía'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Dos socios reparten S/ 6000 de ganancia. B puso 3 mil soles durante 12 meses. Cambia el capital y los meses de A.',
      voz: 'Busca un caso donde A pone más y recibe menos.',
      controles: [
        { id: 'c', etiqueta: 'Capital de A', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 4, unidad: 'mil', decimales: 0 },
        { id: 't', etiqueta: 'Meses de A', color: 'c-o', min: 2, max: 12, paso: 2, inicio: 6, decimales: 0 },
      ],
      dibujo: v => ({ datos: compDatos(v.c, v.t, 3, 12, 6000), estado: {} }),
      lectura: v => [`A recibe ${sol(6000 * v.c * v.t / (v.c * v.t + 36))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'A puso S/ 4000 durante 6 meses y B puso S/ 3000 durante 12 meses. Ganaron S/ 5000. ¿Cuánto le toca a A?',
      opciones: [
        { id: 'c', texto: 'S/ 2000', correcta: true },
        { id: 'capital', texto: 'S/ 2857,14', error: 'AT-SOLO-CAPITAL', siFuera: 'Sería cierto si los dos estuvieran el mismo tiempo. B estuvo el doble.' },
        { id: 'igual', texto: 'S/ 2500', error: 'AT-REPARTE-IGUAL', siFuera: 'Eso reparte a medias, sin pesos.' },
        { id: 'tiempo', texto: 'S/ 1666,67', error: 'AT-SOLO-TIEMPO', siFuera: 'Eso usa solo los meses; también cuenta el capital.' },
      ],
      dibujo: { datos: compDatos(4, 6, 3, 12, 5000, { sin: true }), estado: {} },
      revelar: { datos: compDatos(4, 6, 3, 12, 5000), estado: {} },
      coincide: 'Coincide: los pesos son 24 y 36, como 2 y 3.',
    },
    mira: {
      datos: compDatos(4, 6, 3, 12, 5000),
      pasos: [
        { estado: {}, texto: 'El peso de cada socio es capital por meses.', ecuacion: ['A: 4 · 6 = 24   ·   B: 3 · 12 = 36'] },
        { estado: {}, texto: 'Los pesos 24 y 36 son como 2 y 3: cinco partes.', ecuacion: ['24 : 36 = 2 : 3'] },
        { estado: {}, texto: 'Cada parte vale S/ 1000: A recibe dos.', ecuacion: ['5000 ÷ 5 = 1000 → A = 2000'] },
      ],
    },
    regla: {
      texto: 'En la regla de compañía la ganancia se reparte en forma directa al producto de capital por tiempo de cada socio.',
      ecuacion: [{ sub: ['G', 'A'] }, ' = G · ', { frac: [{ sub: ['C', 'A'] }, ['Σ C · t']] }, ' · ', { sub: ['t', 'A'] }],
      condicion: 'vale si así lo acordaron y los tiempos se miden en la misma unidad. Si el tiempo es igual, basta el capital.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), ca = r.ent(2, 8), ta = r.de([3, 4, 6, 8, 12]), cb = r.ent(2, 8), tb = r.de([3, 4, 6, 8, 12]);
        if (ca * ta === cb * tb) return this.generar(s + 501);
        const wa = ca * ta, wb = cb * tb, G = (wa + wb) * r.de([50, 100, 150, 200]);
        const res = G * wa / (wa + wb);
        return {
          pregunta: `A puso S/ ${f(ca * 1000)} durante ${ta} meses y B, S/ ${f(cb * 1000)} durante ${tb} meses. Ganaron S/ ${f(G)}. ¿Cuánto le toca a A?`,
          opciones: opciones(res, [
            { id: 'capital', valor: G * ca / (ca + cb), error: 'AT-SOLO-CAPITAL', siFuera: 'Eso usa solo el capital; también cuenta el tiempo.' },
            { id: 'tiempo', valor: G * ta / (ta + tb), error: 'AT-SOLO-TIEMPO', siFuera: 'Eso usa solo los meses; también cuenta el capital.' },
            { id: 'igual', valor: G / 2, error: 'AT-REPARTE-IGUAL', siFuera: 'Eso reparte a medias.' },
          ], sol),
          solucion: {
            texto: 'Pesos: capital por meses.',
            ecuacion: [`${f(G)} · `, { frac: [String(wa), `${wa} + ${wb}`] }, ` = ${sol(res)}`],
            dibujo: { datos: compDatos(ca, ta, cb, tb, G), estado: {} },
          },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.magnitudes-proporcionales',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/arit-tiras.js'],
    historia: {
      texto: 'El Liber abaci de Fibonacci, de 1202, circuló por el Mediterráneo con métodos que su autor aprendió en el norte de África y en sus viajes. Mostró la utilidad del cálculo para problemas concretos de comercio, sin inventar la proporcionalidad. Repartir un total con criterios explícitos es una necesidad antigua; escribirla con pesos y una suma es la forma moderna.',
      pregunta: '¿Cómo repartirías una ganancia entre socios que pusieron distinto?',
      fuente: { titulo: 'O’Connor y Robertson, Fibonacci — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Fibonacci/' },
    },
    ideas: [directaInversa, compuesta, reparto, compania],
  };
});
