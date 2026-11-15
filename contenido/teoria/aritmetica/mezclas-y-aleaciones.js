/*
 * Teoría de «Mezclas y aleaciones» (aritmetica.mezclas-y-aleaciones). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 7) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR15 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: resolver toda mezcla conservando lo que se suma de verdad (soles, litros de alcohol, gramos de oro).
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de gama baja de 360 px, en el aula o en la combi, sin audio.
 *   Resultado observable: calcula precio medio, grado alcohólico y ley en quilates, y despeja proporciones con el aspa.
 *   Orden de atención: 1.º las cantidades de cada parte · 2.º el punto o la tira de la mezcla · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · predicción elegida · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué el precio de la mezcla no es el promedio de los dos precios?».
 * Colores (regla 4): cantidad q o volumen V naranja (c-o), precio p o grado g turquesa (c-i), el resultado de la mezcla
 * verde (c-d), y lo que no cuenta (agua, cobre) en tinta tenue.
 * Ronda 2 (14 nov 2026): gesto directo en las cuatro ideas (el precio de la mezcla, el precio buscado y el final de
 * cada recipiente o pieza). Llaves en las reglas y laboratorio con tres mesas.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d).replace(/ /g, '\u00a0');   // los miles no se parten
  const sol = n => `S/ ${f(n)}`;
  const q = { v: 'c-o', t: 'q' }, p = { v: 'c-i', t: 'p' }, pm = { sub: [{ v: 'c-d', t: 'p' }, 'm'] };
  const V = { v: 'c-o', t: 'V' }, g = { v: 'c-i', t: 'g' }, gm = { sub: [{ v: 'c-d', t: 'g' }, 'm'] };
  const mm = { v: 'c-o', t: 'm' }, K = { v: 'c-i', t: 'K' };
  const s = (b, i) => ({ sub: [b, i] });
  function azar(sem) {
    let a = (sem * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      const txt = fmt(x.valor);
      if (vistos.has(txt) || !Number.isFinite(x.valor) || x.valor < 0) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  const mcd = (a, b) => (b ? mcd(b, a % b) : a);
  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de la pieza; el lector ajusta al paso y al rango.
  const TIRAS = () => Kit.piezas['arit-tiras'], RECTA = () => Kit.piezas.recta;
  const inversa = (escala, lo, hi) => px => lo + (px - escala(lo)) * (hi - lo) / (escala(hi) - escala(lo));
  // En una tira de escala relativa (todo el ancho = el total), el final de la tira propia en la fracción u del ancho
  // da su cantidad a partir de la otra: propia = otra · u / (1 − u).
  const porFraccion = (u, otra) => otra * Math.min(0.98, Math.max(0, u)) / (1 - Math.min(0.98, Math.max(0, u)));

  // ---------- Idea 1: precio medio, pesado por la cantidad ----------
  // Cambia: los kilos de cada café. Permanece: los precios S/ 12 y S/ 20 sobre la recta.
  // Progresa: el punto verde se corre hacia el café que más pesa. Se reserva: el promedio simple como fantasma.
  // Debe verse: con más kilos baratos, el precio medio queda cerca de 12.
  const rectaPrecios = (p1, q1, p2, q2, o = {}) => {
    const med = (p1 * q1 + p2 * q2) / (q1 + q2);
    const el = [
      { tipo: 'punto', x: p1, color: 'i', rotulo: o.sinKg ? `?` : `${f(q1)} kg`, fila: 1 },
      { tipo: 'punto', x: p2, color: 'i', rotulo: o.sinKg ? `?` : `${f(q2)} kg`, fila: 1 },
    ];
    if (o.objetivo !== undefined) el.push({ tipo: 'punto', x: o.objetivo, color: 'd', rotulo: sol(o.objetivo), fila: 0 });
    else if (!o.sinMedio) el.push({ tipo: 'punto', x: med, color: 'd', rotulo: sol(med), fila: 0, desde: o.desde || 0 });
    if (o.distancias) {
      el.push({ tipo: 'distancia', a: p1, b: med, color: 'o', rotulo: f(med - p1), fila: 2, desde: o.distancias });
      el.push({ tipo: 'distancia', a: med, b: p2, color: 'o', rotulo: f(p2 - med), fila: 2, desde: o.distancias });
    }
    return { min: Math.floor(p1 - 2), max: Math.ceil(p2 + 2), paso: 1, cada: 2, decimales: 2, prefijo: 'S/ ', filas: 2, variable: 'precio por kg (S/)', color: 'i', elementos: el };
  };
  const precioMedio = {
    id: 'precio-medio',
    titulo: 'El precio medio pesa',
    temas: ['Precio medio'],
    pieza: 'recta',
    juega: {
      consigna: 'Se mezcla café de S/ 12 y de S/ 20 el kilo. Elige los kilos de cada uno y mira el precio de la mezcla.',
      voz: 'Pon muchos kilos de uno y pocos del otro.',
      controles: [
        { id: 'a', etiqueta: 'kg de 12', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 1, decimales: 0 },
        { id: 'b', etiqueta: 'kg de 20', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => ({ datos: rectaPrecios(12, v.a, 20, v.b), estado: {} }),
      // Arrastra el precio de la mezcla hacia un lado: salen los kilos de 12 que lo dejan ahí (con los kilos de 20 fijos).
      arrastres: [
        { id: 'medio', etiqueta: 'precio de la mezcla', color: 'c-o',
          donde: v => { const g = RECTA().geometria(rectaPrecios(12, v.a, 20, v.b)); return { x: g.x((12 * v.a + 20 * v.b) / (v.a + v.b)), y: g.filaY(0) }; },
          mover: (pt, v) => {
            const m = Math.min(19.9, Math.max(12.1, inversa(RECTA().geometria(rectaPrecios(12, v.a, 20, v.b)).x, 10, 22)(pt.x)));
            return { a: v.b * (20 - m) / (m - 12) };
          } },
      ],
      lectura: v => [`Mezcla: ${sol((12 * v.a + 20 * v.b) / (v.a + v.b))} el kilo`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Se mezclan 3 kg de café de S/ 12 el kilo con 1 kg de café de S/ 20 el kilo. ¿Cuánto debe costar un kilo de la mezcla para no ganar ni perder?',
      opciones: [
        { id: 'c', texto: 'S/ 14', correcta: true },
        { id: 'promedio', texto: 'S/ 16', error: 'AR15', siFuera: 'Sería cierto con la misma cantidad de cada café. Hay el triple del barato.' },
        { id: 'suma', texto: 'S/ 32', error: 'AT-SUMA', siFuera: 'Eso suma los precios; el precio medio queda entre 12 y 20.' },
        { id: 'total', texto: 'S/ 56', error: 'AT-TOTAL', siFuera: 'S/ 56 es lo que cuestan los 4 kg juntos, no un kilo.' },
      ],
      dibujo: { datos: rectaPrecios(12, 3, 20, 1, { sinMedio: true }), estado: {} },
      revelar: { datos: rectaPrecios(12, 3, 20, 1), estado: { fantasma: { marca: 16, rotulo: 'promedio simple' } } },
      coincide: 'Coincide: S/ 56 repartidos en 4 kg dan S/ 14.',
    },
    mira: {
      datos: rectaPrecios(12, 3, 20, 1, { desde: 3 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Lo que se conserva es el dinero: 3 · 12 + 1 · 20.', ecuacion: ['3 · 12 + 1 · 20 = S/ 56'] },
        { estado: { corte: 2 }, texto: 'Y los kilos: 3 + 1 = 4.', ecuacion: ['3 + 1 = 4 kg'] },
        { estado: { corte: 3 }, texto: 'Un kilo de mezcla vale el dinero entre los kilos.', ecuacion: [pm, ' = ', { frac: ['56', '4'] }, ' = S/ 14'] },
      ],
    },
    regla: {
      texto: 'El precio medio es el valor total entre la cantidad total. Queda entre los precios, más cerca del que tiene más cantidad.',
      ecuacion: [pm, ' = ', { llave: [{ frac: [[s(q, '1'), s(p, '1'), ' + ', s(q, '2'), s(p, '2')], [s(q, '1'), ' + ', s(q, '2')]] }], nota: 'dinero entre kilos' }],
      condicion: 'las cantidades están en la misma unidad y no hay pérdidas. El promedio simple solo vale si las cantidades son iguales.',
    },
    ahoraTu: {
      generar(sem) {
        const r = azar(sem), p1 = r.ent(5, 12), p2 = p1 + r.ent(3, 10), q1 = r.ent(1, 6), q2 = r.ent(1, 6);
        if (q1 === q2) return this.generar(sem + 701);
        const med = (p1 * q1 + p2 * q2) / (q1 + q2);
        return {
          pregunta: `Se mezclan ${q1} kg de arroz de S/ ${p1} el kilo con ${q2} kg de S/ ${p2} el kilo. ¿Cuánto vale un kilo de la mezcla?`,
          dibujo: { datos: rectaPrecios(p1, q1, p2, q2, { sinMedio: true }), estado: {} },
          opciones: opciones(med, [
            { id: 'promedio', valor: (p1 + p2) / 2, error: 'AR15', siFuera: 'Ese es el promedio simple; las cantidades son distintas.' },
            { id: 'total', valor: p1 * q1 + p2 * q2, error: 'AT-TOTAL', siFuera: 'Ese es el valor de toda la mezcla, no de un kilo.' },
            { id: 'cruzado', valor: (p1 * q2 + p2 * q1) / (q1 + q2), error: 'AT-CRUZA', siFuera: 'Eso cruza cantidades y precios.' },
          ], sol),
          solucion: { texto: 'Valor total entre kilos totales.', ecuacion: [{ frac: [`${q1} · ${p1} + ${q2} · ${p2}`, `${q1} + ${q2}`] }, ` = ${sol(med)}`], dibujo: { datos: rectaPrecios(p1, q1, p2, q2), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: la regla del aspa ----------
  // Cambia: el precio que se quiere lograr. Permanece: los dos precios, 12 y 20.
  // Progresa: las dos distancias al precio medio, cruzadas. Se reserva: el «al revés»: la distancia lejana va con el barato.
  // Debe verse: cuanto más cerca de 20 está el objetivo, más café de 20 se necesita.
  const aspa = {
    id: 'aspa',
    titulo: 'El aspa: distancias cruzadas',
    temas: ['Regla del aspa'],
    pieza: 'recta',
    juega: {
      consigna: 'Quieres una mezcla de café de 12 y de 20 soles con un precio dado. Mueve el precio y mira las dos distancias.',
      voz: 'Compara cada distancia con los kilos que salen.',
      controles: [{ id: 'm', etiqueta: 'Precio buscado (S/)', color: 'c-d', min: 13, max: 19, paso: 1, inicio: 14, decimales: 0 }],
      dibujo: v => { const q1 = 20 - v.m, q2 = v.m - 12, d = mcd(q1, q2); return { datos: rectaPrecios(12, q1 / d, 20, q2 / d, { distancias: 0 }), estado: {} }; },
      // Arrastra el precio buscado por la recta: las dos distancias cambian y los kilos salen cruzados.
      arrastres: [
        { id: 'buscado', etiqueta: 'precio buscado', color: 'c-d',
          donde: v => { const g = RECTA().geometria(rectaPrecios(12, 1, 20, 1)); return { x: g.x(v.m), y: g.filaY(0) }; },
          mover: pt => ({ m: inversa(RECTA().geometria(rectaPrecios(12, 1, 20, 1)).x, 10, 22)(pt.x) }) },
      ],
      lectura: v => { const q1 = 20 - v.m, q2 = v.m - 12, d = mcd(q1, q2); return [`kg de 12 : kg de 20 = ${f(q1 / d)} : ${f(q2 / d)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Se quiere café de S/ 18 el kilo mezclando café de S/ 12 y de S/ 20. ¿Cómo deben estar los kilos?',
      opciones: [
        { id: 'c', texto: '1 kg de 12 por cada 3 kg de 20', correcta: true },
        { id: 'invertido', texto: '3 kg de 12 por cada 1 kg de 20', error: 'AT-ASPA-INVERTIDA', siFuera: 'Así saldría S/ 14. Para acercarse a 20 se necesita más café de 20.' },
        { id: 'mitad', texto: 'Mitad y mitad', error: 'AR15', siFuera: 'Mitad y mitad da S/ 16, el promedio simple.' },
        { id: 'precios', texto: '12 kg de 12 por cada 20 kg de 20', error: 'AT-PRECIOS', siFuera: 'Los kilos no van como los precios; salen de las distancias a 18.' },
      ],
      dibujo: { datos: rectaPrecios(12, 1, 20, 3, { sinKg: true, objetivo: 18 }), estado: {} },
      revelar: { datos: rectaPrecios(12, 1, 20, 3, { distancias: 0 }), estado: {} },
      coincide: 'Coincide: 18 está a 6 de 12 y a 2 de 20; los kilos van cruzados: 2 : 6 = 1 : 3.',
    },
    mira: {
      datos: rectaPrecios(12, 1, 20, 3, { distancias: 1, desde: 0 }),
      pasos: [
        { estado: { corte: 1 }, texto: '18 está a 6 soles del barato y a 2 del caro.', ecuacion: ['18 − 12 = 6   ·   20 − 18 = 2'] },
        { estado: { corte: 1 }, texto: 'Cada kilo barato baja 6; cada kilo caro sube 2.', ecuacion: [s(q, '1'), ' · 6 = ', s(q, '2'), ' · 2'] },
        { estado: { corte: 1 }, texto: 'Para equilibrar, los kilos van cruzados con las distancias.', ecuacion: [s(q, '1'), ' : ', s(q, '2'), ' = 2 : 6 = 1 : 3'] },
      ],
    },
    regla: {
      texto: 'Regla del aspa: para lograr un precio medio con dos componentes, la cantidad de cada uno es proporcional a la distancia del otro precio al medio.',
      ecuacion: [{ frac: [s(q, '1'), s(q, '2')] }, ' = ', { llave: [{ frac: [[s(p, '2'), ' − ', pm], [pm, ' − ', s(p, '1')]] }], nota: 'distancias cruzadas' }],
      condicion: 'el precio buscado está entre los dos precios. Si no está entre ellos, la mezcla es imposible.',
    },
    ahoraTu: {
      generar(sem) {
        const r = azar(sem), p1 = r.ent(4, 10), p2 = p1 + r.de([4, 6, 8, 10]), m0 = p1 + r.ent(1, p2 - p1 - 1);
        const a = p2 - m0, b = m0 - p1;
        if (a === b) return this.generar(sem + 211);
        const d = mcd(a, b), total = (a + b) / d * r.de([2, 3, 4, 5]);
        const q1 = total * a / (a + b);
        return {
          pregunta: `Se quieren ${f(total)} kg de una mezcla de S/ ${m0} el kilo, con arroz de S/ ${p1} y de S/ ${p2}. ¿Cuántos kilos del de S/ ${p1} se usan?`,
          dibujo: { datos: rectaPrecios(p1, a / d, p2, b / d, { sinKg: true, objetivo: m0 }), estado: {} },
          opciones: opciones(q1, [
            { id: 'invertido', valor: total * b / (a + b), error: 'AT-ASPA-INVERTIDA', siFuera: 'Eso pone la distancia propia en vez de la del otro precio.' },
            { id: 'mitad', valor: total / 2, error: 'AR15', siFuera: 'Mitad y mitad daría el promedio simple.' },
            { id: 'distancia', valor: a, error: 'AT-CONSTANTE', siFuera: `Esa es la distancia ${p2} − ${m0}, no los kilos.` },
          ], x => `${f(x)} kg`),
          solucion: { texto: 'Distancias cruzadas: la del otro precio.', ecuacion: [`${f(total)} · `, { frac: [String(a), `${a} + ${b}`] }, ` = ${f(q1)} kg`], dibujo: { datos: rectaPrecios(p1, a / d, p2, b / d, { distancias: 0 }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: grado alcohólico, litros de alcohol entre litros totales ----------
  // Cambia: los litros de cada recipiente. Permanece: los grados 60° y 20° y la escala en litros.
  // Progresa: dos tiras → la tira de la mezcla con el alcohol junto. Se reserva: el agua (0°) que también cuenta como volumen.
  // Debe verse: el tramo de alcohol de la mezcla es la suma de los dos tramos.
  const vasos = (partes, o = {}) => {
    const VT = partes.reduce((a, x) => a + x.V, 0), alc = partes.reduce((a, x) => a + x.V * x.g / 100, 0);
    const tiras = partes.map((x, k) => ({
      rotulo: `${x.nombre || `${f(x.g)}°`}: ${f(x.V)} L`, color: 'o',
      tramos: [{ valor: x.V * x.g / 100, color: 'i', relleno: 0.4, texto: x.g ? f(x.V * x.g / 100) : undefined }, { valor: x.V * (1 - x.g / 100), color: 'o', relleno: 0.05 }],
    }));
    tiras.push({
      rotulo: o.sinFin ? `mezcla: ${f(VT)} L, ? grados` : `mezcla: ${f(VT)} L a ${f(100 * alc / VT)}°`, color: 'd', paso: o.paso,
      tramos: [{ valor: alc, color: 'i', relleno: 0.4, texto: `${f(alc)} L` }, { valor: VT - alc, color: 'd', relleno: 0.05 }],
    });
    return { max: VT, filas: partes.length + 1, tiras, alt: `Recipientes de ${partes.map(x => `${f(x.V)} L a ${f(x.g)}°`).join(' y ')}; la parte de color es alcohol puro` };
  };
  const alcohol = {
    id: 'alcohol',
    titulo: 'Grados: litros de alcohol puro',
    temas: ['Mezclas alcohólicas'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Se juntan dos recipientes: uno de alcohol a 60° y otro a 20°. La parte de color es alcohol puro. Elige los litros.',
      voz: 'Suma los tramos de color y compáralos con la tira entera.',
      controles: [
        { id: 'a', etiqueta: 'Litros a 60°', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 },
        { id: 'b', etiqueta: 'Litros a 20°', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => ({ datos: vasos([{ V: v.a, g: 60 }, { V: v.b, g: 20 }]), estado: {} }),
      // Arrastra el final de cada recipiente: la tira entera es el volumen de la mezcla.
      arrastres: [
        { id: 'litros-60', etiqueta: 'final del recipiente a 60 grados', color: 'c-o',
          donde: v => { const g = TIRAS().geometria(vasos([{ V: v.a, g: 60 }, { V: v.b, g: 20 }])); return { x: g.x(v.a), y: g.centroY(0) }; },
          mover: (pt, v) => ({ a: porFraccion(TIRAS().geometria(vasos([{ V: v.a, g: 60 }, { V: v.b, g: 20 }])).deX(pt.x) / (v.a + v.b), v.b) }) },
        { id: 'litros-20', etiqueta: 'final del recipiente a 20 grados', color: 'c-o',
          donde: v => { const g = TIRAS().geometria(vasos([{ V: v.a, g: 60 }, { V: v.b, g: 20 }])); return { x: g.x(v.b), y: g.centroY(1) }; },
          mover: (pt, v) => ({ b: porFraccion(TIRAS().geometria(vasos([{ V: v.a, g: 60 }, { V: v.b, g: 20 }])).deX(pt.x) / (v.a + v.b), v.a) }) },
      ],
      lectura: v => [gm, ` = ${f((0.6 * v.a + 0.2 * v.b) * 100 / (v.a + v.b))}°`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Se mezclan 6 litros de alcohol de 60° con 2 litros de agua. ¿De cuántos grados queda la mezcla? Supón que los volúmenes se suman.',
      opciones: [
        { id: 'c', texto: '45°', correcta: true },
        { id: 'promedio', texto: '30°', error: 'AR15', siFuera: 'Sería cierto con la misma cantidad de alcohol y de agua. Hay el triple de alcohol.' },
        { id: 'igual', texto: '60°', error: 'AT-AGUA-NO-CUENTA', siFuera: 'El agua no tiene alcohol, pero sí aumenta el volumen.' },
        { id: 'litros', texto: '3,6°', error: 'AT-LITROS-GRADOS', siFuera: '3,6 son los litros de alcohol puro, no los grados.' },
      ],
      dibujo: { datos: vasos([{ V: 6, g: 60 }, { V: 2, g: 0, nombre: 'agua' }], { sinFin: true }), estado: {} },
      revelar: { datos: vasos([{ V: 6, g: 60 }, { V: 2, g: 0, nombre: 'agua' }]), estado: {} },
      coincide: 'Coincide: 3,6 L de alcohol en 8 L de mezcla es el 45 %.',
    },
    mira: {
      datos: vasos([{ V: 6, g: 60 }, { V: 2, g: 0, nombre: 'agua' }], { paso: 2 }),
      pasos: [
        { estado: { paso: 1 }, texto: '60° quiere decir 60 % de alcohol puro: 3,6 L.', ecuacion: ['6 · 0,60 = 3,6 L'] },
        { estado: { paso: 2 }, texto: 'El agua no agrega alcohol, pero sí 2 litros más.', ecuacion: ['6 + 2 = 8 L'] },
        { estado: { paso: 2 }, texto: 'Grado de la mezcla: alcohol puro entre volumen total.', ecuacion: [gm, ' = ', { frac: ['3,6', '8'] }, ' · 100 = 45°'] },
      ],
    },
    regla: {
      texto: 'El grado alcohólico de una mezcla es el porcentaje de alcohol puro en el volumen total. Se suman los litros de alcohol y los litros totales.',
      ecuacion: [gm, ' = ', { llave: [{ frac: [[s(V, '1'), s(g, '1'), ' + ', s(V, '2'), s(g, '2')], [s(V, '1'), ' + ', s(V, '2')]] }], nota: 'alcohol entre volumen' }],
      condicion: 'se supone que los volúmenes se suman; en la realidad alcohol y agua se contraen un poco. El agua tiene 0°.',
    },
    ahoraTu: {
      generar(sem) {
        const r = azar(sem), g1 = r.de([40, 50, 60, 70, 80, 90]), g2 = r.de([0, 10, 20, 30]), V1 = r.ent(2, 8), V2 = r.ent(1, 6);
        if (V1 === V2) return this.generar(sem + 89);
        const res = (V1 * g1 + V2 * g2) / (V1 + V2);
        const nom2 = g2 === 0 ? 'agua' : `alcohol de ${g2}°`;
        return {
          pregunta: `Se mezclan ${V1} L de alcohol de ${g1}° con ${V2} L de ${nom2}. ¿De cuántos grados queda la mezcla, si los volúmenes se suman?`,
          dibujo: { datos: vasos([{ V: V1, g: g1 }, { V: V2, g: g2, nombre: g2 === 0 ? 'agua' : undefined }], { sinFin: true }), estado: {} },
          opciones: opciones(res, [
            { id: 'promedio', valor: (g1 + g2) / 2, error: 'AR15', siFuera: 'Ese es el promedio simple; los volúmenes son distintos.' },
            { id: 'litros', valor: (V1 * g1 + V2 * g2) / 100, error: 'AT-LITROS-GRADOS', siFuera: 'Esos son los litros de alcohol puro, no los grados.' },
            { id: 'sin-agua', valor: g1, error: 'AT-AGUA-NO-CUENTA', siFuera: 'El segundo líquido también suma volumen.' },
          ], x => `${f(x)}°`),
          solucion: { texto: 'Alcohol puro entre volumen total.', ecuacion: [{ frac: [`${V1} · ${g1} + ${V2} · ${g2}`, `${V1} + ${V2}`] }, ` = ${f(res)}°`], dibujo: { datos: vasos([{ V: V1, g: g1 }, { V: V2, g: g2, nombre: g2 === 0 ? 'agua' : undefined }]), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: ley del oro en quilates ----------
  // Cambia: los gramos de cada pieza. Permanece: 18 K y 12 K, y que 24 K es oro puro.
  // Progresa: el oro de cada pieza se junta en la aleación nueva. Se reserva: el quilate como fracción de 24, no como peso.
  // Debe verse: el tramo de oro de la aleación es la suma de los dos.
  const piezas = (partes, o = {}) => {
    const MT = partes.reduce((a, x) => a + x.m, 0), oro = partes.reduce((a, x) => a + x.m * x.K / 24, 0);
    const tiras = partes.map(x => ({ rotulo: `${f(x.K)} K: ${f(x.m)} g`, color: 'o', tramos: [{ valor: x.m * x.K / 24, color: 'i', relleno: 0.4, texto: `${f(x.m * x.K / 24)} g` }, { valor: x.m * (1 - x.K / 24), color: 'o', relleno: 0.05 }] }));
    tiras.push({ rotulo: o.sinFin ? `aleación: ${f(MT)} g, ? quilates` : `aleación: ${f(MT)} g de ${f(24 * oro / MT)} K`, color: 'd', paso: o.paso, tramos: [{ valor: oro, color: 'i', relleno: 0.4, texto: `${f(oro)} g de oro` }, { valor: MT - oro, color: 'd', relleno: 0.05 }] });
    return { max: MT, filas: partes.length + 1, tiras, alt: `Piezas de ${partes.map(x => `${f(x.m)} g de ${f(x.K)} K`).join(' y ')}; la parte de color es oro puro` };
  };
  const quilates = {
    id: 'quilates',
    titulo: 'Quilates: oro de cada 24 partes',
    temas: ['Aleaciones y ley del oro en quilates'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Se funden dos piezas: una de 18 quilates y otra de 12. La parte de color es oro puro. Elige los gramos.',
      voz: '24 quilates sería una tira toda de color.',
      controles: [
        { id: 'a', etiqueta: 'g de 18 K', color: 'c-o', min: 6, max: 30, paso: 6, inicio: 12, decimales: 0 },
        { id: 'b', etiqueta: 'g de 12 K', color: 'c-o', min: 6, max: 30, paso: 6, inicio: 6, decimales: 0 },
      ],
      dibujo: v => ({ datos: piezas([{ m: v.a, K: 18 }, { m: v.b, K: 12 }]), estado: {} }),
      // Arrastra el final de cada pieza: la tira entera es la masa de la aleación.
      arrastres: [
        { id: 'gramos-18', etiqueta: 'final de la pieza de 18 quilates', color: 'c-o',
          donde: v => { const g = TIRAS().geometria(piezas([{ m: v.a, K: 18 }, { m: v.b, K: 12 }])); return { x: g.x(v.a), y: g.centroY(0) }; },
          mover: (pt, v) => ({ a: porFraccion(TIRAS().geometria(piezas([{ m: v.a, K: 18 }, { m: v.b, K: 12 }])).deX(pt.x) / (v.a + v.b), v.b) }) },
        { id: 'gramos-12', etiqueta: 'final de la pieza de 12 quilates', color: 'c-o',
          donde: v => { const g = TIRAS().geometria(piezas([{ m: v.a, K: 18 }, { m: v.b, K: 12 }])); return { x: g.x(v.b), y: g.centroY(1) }; },
          mover: (pt, v) => ({ b: porFraccion(TIRAS().geometria(piezas([{ m: v.a, K: 18 }, { m: v.b, K: 12 }])).deX(pt.x) / (v.a + v.b), v.a) }) },
      ],
      lectura: v => [`Ley ${f((18 * v.a + 12 * v.b) / 24 / (v.a + v.b), 4)} → `, K, ` = ${f((18 * v.a + 12 * v.b) / (v.a + v.b))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Se funden 2 kg de una aleación de oro de 18 quilates con 1 kg de otra de 12 quilates. ¿De cuántos quilates queda la nueva aleación?',
      opciones: [
        { id: 'c', texto: '16 quilates', correcta: true },
        { id: 'promedio', texto: '15 quilates', error: 'AR15', siFuera: 'Sería cierto con la misma masa de cada pieza. Hay el doble de la de 18.' },
        { id: 'suma', texto: '30 quilates', error: 'AT-SUMA', siFuera: 'Nada pasa de 24 quilates, que es oro puro.' },
        { id: 'masa', texto: '2 quilates', error: 'AT-LITROS-GRADOS', siFuera: '2 son los kilos de oro puro, no los quilates.' },
      ],
      dibujo: { datos: piezas([{ m: 2000, K: 18 }, { m: 1000, K: 12 }], { sinFin: true }), estado: {} },
      revelar: { datos: piezas([{ m: 2000, K: 18 }, { m: 1000, K: 12 }]), estado: {} },
      coincide: 'Coincide: 2 kg de oro en 3 kg de aleación son 16 de cada 24 partes.',
    },
    mira: {
      datos: piezas([{ m: 2000, K: 18 }, { m: 1000, K: 12 }], { paso: 2 }),
      pasos: [
        { estado: { paso: 1 }, texto: '18 K es 18 partes de oro de cada 24: 1,5 kg de oro.', ecuacion: ['2 · ', { frac: ['18', '24'] }, ' = 1,5 kg'] },
        { estado: { paso: 1 }, texto: '12 K es la mitad de oro: 0,5 kg.', ecuacion: ['1 · ', { frac: ['12', '24'] }, ' = 0,5 kg'] },
        { estado: { paso: 2 }, texto: 'Juntas: 2 kg de oro en 3 kg de aleación.', ecuacion: [K, ' = 24 · ', { frac: ['2', '3'] }, ' = 16'] },
      ],
    },
    regla: {
      texto: 'La ley de una aleación es la fracción de oro puro en su masa. En quilates se mide sobre 24: 24 K es oro puro.',
      ecuacion: ['ley = ', { frac: [['masa de oro'], ['masa total']] }, '   ·   ', K, ' = ', { llave: ['24 · ley'], nota: 'partes de 24', color: 'c-i' }],
      condicion: 'aquí el quilate es una fracción de pureza (1/24), no el quilate de masa de las piedras preciosas.',
    },
    ahoraTu: {
      generar(sem) {
        const r = azar(sem), K1 = r.de([18, 20, 21, 22]), K2 = r.de([10, 12, 14, 16]), m1 = r.de([10, 20, 30, 40, 60]), m2 = r.de([10, 20, 30, 40]);
        if (m1 === m2 && sem % 2) return this.generar(sem + 37);
        const res = (K1 * m1 + K2 * m2) / (m1 + m2);
        if (sem % 3 === 2) {
          const oro = (K1 * m1) / 24;
          return {
            pregunta: `¿Cuántos gramos de oro puro tiene una cadena de ${m1} g de ${K1} quilates?`,
            opciones: opciones(oro, [
              { id: 'k', valor: m1 * K1 / 100, error: 'AT-CIEN', siFuera: 'Eso toma los quilates como porcentaje; son partes de 24.' },
              { id: 'resto', valor: m1 - oro, error: 'AT-RESTO', siFuera: 'Eso es lo que no es oro.' },
              { id: 'k-g', valor: K1, error: 'AT-LITROS-GRADOS', siFuera: 'Los quilates no son gramos.' },
            ], x => `${f(x)} g`),
            solucion: { texto: `${K1} partes de oro de cada 24.`, ecuacion: [`${m1} · `, { frac: [String(K1), '24'] }, ` = ${f(oro)} g`] },
          };
        }
        return {
          pregunta: `Se funden ${m1} g de oro de ${K1} quilates con ${m2} g de ${K2} quilates. ¿De cuántos quilates queda la aleación?`,
          dibujo: { datos: piezas([{ m: m1, K: K1 }, { m: m2, K: K2 }], { sinFin: true }), estado: {} },
          opciones: opciones(res, [
            { id: 'promedio', valor: (K1 + K2) / 2, error: 'AR15', siFuera: 'Ese es el promedio simple; las masas son distintas.' },
            { id: 'cruzado', valor: (K1 * m2 + K2 * m1) / (m1 + m2), error: 'AT-CRUZA', siFuera: 'Eso cruza masas y quilates.' },
            { id: 'oro', valor: (K1 * m1 + K2 * m2) / 24, error: 'AT-LITROS-GRADOS', siFuera: 'Esos son los gramos de oro puro, no los quilates.' },
          ], x => `${f(x)} K`),
          solucion: { texto: 'Oro total entre masa total, por 24.', ecuacion: [{ frac: [`${m1} · ${K1} + ${m2} · ${K2}`, `${m1} + ${m2}`] }, ` = ${f(res)} K`], dibujo: { datos: piezas([{ m: m1, K: K1 }, { m: m2, K: K2 }]), estado: {} } },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Más rico que los juegos: tres cafés con precios que se mueven; el aspa con precios libres, donde el precio buscado
  // puede quedar fuera (la mezcla imposible); y dos alcoholes de cualquier grado en una escala fija de litros.
  const PR = [1, 2, 3];
  const rectaTres = v => {
    const qT = PR.reduce((a, k) => a + v[`q${k}`], 0), med = PR.reduce((a, k) => a + v[`q${k}`] * v[`p${k}`], 0) / qT;
    return { datos: { min: 0, max: 32, paso: 1, cada: 5, decimales: 2, prefijo: 'S/ ', filas: 3, variable: 'precio por kg (S/)', color: 'i', elementos: [
      ...PR.map(k => ({ tipo: 'punto', x: v[`p${k}`], color: 'i', rotulo: `${v[`q${k}`]} kg`, fila: k })),
      { tipo: 'punto', x: med, color: 'd', rotulo: sol(med), fila: 0 },
    ] }, estado: {}, med, qT };
  };
  const aspaLibre = v => {
    const posible = v.m > v.p1 && v.m < v.p2;
    const a = v.p2 - v.m, b = v.m - v.p1;
    const el = [
      { tipo: 'punto', x: v.p1, color: 'i', rotulo: posible ? `${f(a)} partes` : sol(v.p1), fila: 1 },
      { tipo: 'punto', x: v.p2, color: 'i', rotulo: posible ? `${f(b)} partes` : sol(v.p2), fila: 1 },
      { tipo: 'punto', x: v.m, color: 'd', rotulo: sol(v.m), fila: 0 },
    ];
    if (posible) el.push({ tipo: 'distancia', a: v.p1, b: v.m, color: 'o', rotulo: f(b), fila: 2 }, { tipo: 'distancia', a: v.m, b: v.p2, color: 'o', rotulo: f(a), fila: 2 });
    return { datos: { min: 0, max: 32, paso: 1, cada: 5, decimales: 2, prefijo: 'S/ ', filas: 2, variable: 'precio por kg (S/)', color: 'i', elementos: el }, estado: {}, posible, a, b };
  };
  const gradoMezcla = v => (v.a * v.g1 + v.b * v.g2) / (v.a + v.b);
  const dosAlcoholes = v => ({ datos: Object.assign(vasos([{ V: v.a, g: v.g1 }, { V: v.b, g: v.g2 }]), { max: 20 }), estado: {} });
  const laboratorio = [
    {
      id: 'tres-cafes', titulo: 'Tres cafés en la recta', pieza: 'recta',
      consigna: 'Mezcla tres cafés. Arrastra el precio de cada uno por la recta y elige sus kilos. Mira dónde cae la mezcla.',
      controles: PR.flatMap(k => [
        { id: `p${k}`, etiqueta: `Precio ${k} (S/)`, color: 'c-i', min: 4, max: 30, paso: 1, inicio: [8, 14, 26][k - 1], decimales: 0 },
        { id: `q${k}`, etiqueta: `kg del ${k}`, color: 'c-o', min: 1, max: 10, paso: 1, inicio: [5, 2, 1][k - 1], decimales: 0 },
      ]),
      dibujo: rectaTres,
      invitaciones: [
        { texto: 'Haz que un kilo de la mezcla cueste justo S/ 15.',
          logrado: v => Math.abs(rectaTres(v).med - 15) < 1e-9,
          bien: 'Valor total entre kilos totales da 15. ¿Hay otra manera de lograrlo?' },
        { texto: 'Aleja el precio medio más de S/ 6 del promedio simple de los tres precios.',
          logrado: v => Math.abs(rectaTres(v).med - (v.p1 + v.p2 + v.p3) / 3) > 6,
          bien: 'Los kilos pesan: el punto verde se fue hacia el café con más kilos.' },
        { texto: 'Deja la mezcla a menos de S/ 1 del café más caro.',
          logrado: v => Math.max(v.p1, v.p2, v.p3) - rectaTres(v).med < 1,
          bien: 'Para acercarte tanto, los otros cafés pesan poco o cuestan casi igual.' },
        { texto: 'Con tres precios distintos, haz que la mezcla cueste justo lo del café del medio.',
          logrado: v => { const ps = [v.p1, v.p2, v.p3].sort((x, y) => x - y); return ps[0] < ps[1] && ps[1] < ps[2] && Math.abs(rectaTres(v).med - ps[1]) < 1e-9; },
          bien: 'El café del medio no empuja: los otros dos se equilibran a su alrededor.' },
      ],
      lectura: v => [`${v.q1}\u00a0kg a ${v.p1}, ${v.q2} a ${v.p2}, ${v.q3} a ${v.p3}: `, pm, ` = ${f(rectaTres(v).med)}`],
      arrastres: PR.map(k => ({
        id: `precio-${k}`, etiqueta: `precio del café ${k}`, color: 'c-i',
        donde: v => { const g = RECTA().geometria(rectaTres(v).datos); return { x: g.x(v[`p${k}`]), y: g.filaY(k) }; },
        mover: (pt, v) => ({ [`p${k}`]: inversa(RECTA().geometria(rectaTres(v).datos).x, 0, 32)(pt.x) }),
      })),
    },
    {
      id: 'aspa-libre', titulo: 'El aspa con precios libres', pieza: 'recta',
      consigna: 'Arrastra los dos precios y el precio buscado. Si el buscado sale de entre los dos, mira qué pasa.',
      controles: [
        { id: 'p1', etiqueta: 'Precio barato (S/)', color: 'c-i', min: 2, max: 15, paso: 1, inicio: 8, decimales: 0 },
        { id: 'p2', etiqueta: 'Precio caro (S/)', color: 'c-i', min: 16, max: 30, paso: 1, inicio: 20, decimales: 0 },
        { id: 'm', etiqueta: 'Precio buscado (S/)', color: 'c-d', min: 1, max: 31, paso: 1, inicio: 17, decimales: 0 },
      ],
      dibujo: aspaLibre,
      invitaciones: [
        { texto: 'Pon el precio buscado fuera de los dos precios.',
          logrado: v => v.m < v.p1 || v.m > v.p2,
          bien: 'Fuera del tramo no hay mezcla: ningún reparto baja ni sube tanto.' },
        { texto: 'Consigue que las dos partes del aspa queden iguales.',
          logrado: v => { const x = aspaLibre(v); return x.posible && x.a === x.b; },
          bien: 'Partes iguales: el buscado es justo el promedio simple de los dos precios.' },
        { texto: 'Haz que se necesite el doble de café barato que de caro.',
          logrado: v => { const x = aspaLibre(v); return x.posible && x.a === 2 * x.b; },
          bien: 'El buscado quedó a un tercio del tramo, del lado del barato.' },
        { texto: 'Haz que un café necesite al menos 10 veces los kilos del otro.',
          logrado: v => { const x = aspaLibre(v); return x.posible && Math.max(x.a, x.b) >= 10 * Math.min(x.a, x.b); },
          bien: 'Pegado a un precio, casi toda la mezcla es de ese café.' },
      ],
      lectura: v => { const x = aspaLibre(v); const d = x.posible ? mcd(x.a, x.b) : 1; return x.posible ? [`${sol(v.m)}: kg de ${v.p1} : kg de ${v.p2} = ${f(x.a / d)} : ${f(x.b / d)}`] : [`${sol(v.m)} no está entre ${v.p1} y ${v.p2}: imposible`]; },
      arrastres: [
        { id: 'barato', etiqueta: 'precio barato', color: 'c-i', fila: 1, k: 'p1' },
        { id: 'caro', etiqueta: 'precio caro', color: 'c-i', fila: 1, k: 'p2' },
        { id: 'buscado', etiqueta: 'precio buscado', color: 'c-d', fila: 0, k: 'm' },
      ].map(a => ({
        id: a.id, etiqueta: a.etiqueta, color: a.color,
        donde: v => { const g = RECTA().geometria(aspaLibre(v).datos); return { x: g.x(v[a.k]), y: g.filaY(a.fila) }; },
        mover: (pt, v) => ({ [a.k]: inversa(RECTA().geometria(aspaLibre(v).datos).x, 0, 32)(pt.x) }),
      })),
    },
    {
      id: 'dos-alcoholes', titulo: 'Dos alcoholes de cualquier grado', pieza: 'arit-tiras',
      consigna: 'Elige el grado y los litros de cada recipiente; la escala es fija, de 0 a 20 litros. Arrastra el final de cada uno.',
      controles: [
        { id: 'g1', etiqueta: 'Grado 1', color: 'c-i', min: 0, max: 100, paso: 10, inicio: 90, unidad: '°', decimales: 0 },
        { id: 'a', etiqueta: 'Litros 1', color: 'c-o', min: 1, max: 10, paso: 1, inicio: 4, decimales: 0 },
        { id: 'g2', etiqueta: 'Grado 2', color: 'c-i', min: 0, max: 100, paso: 10, inicio: 0, unidad: '°', decimales: 0 },
        { id: 'b', etiqueta: 'Litros 2', color: 'c-o', min: 1, max: 10, paso: 1, inicio: 5, decimales: 0 },
      ],
      dibujo: dosAlcoholes,
      lectura: v => [`${v.a} L a ${v.g1}° + ${v.b} L a ${v.g2}°: `, gm, ` = ${f(gradoMezcla(v))}°`],
      invitaciones: [
        { texto: 'Haz una mezcla de justo 45°.',
          logrado: v => Math.abs(gradoMezcla(v) - 45) < 1e-9,
          bien: 'Litros de alcohol puro entre litros totales: comprueba que da 0,45.' },
        { texto: 'Con agua en uno de los recipientes, consigue justo 75°.',
          logrado: v => (v.g1 === 0 || v.g2 === 0) && Math.abs(gradoMezcla(v) - 75) < 1e-9,
          bien: 'El agua solo baja el grado: el otro tuvo que pasar de 75°.' },
        { texto: 'Con agua en un recipiente, busca el grado final más alto posible.',
          logrado: v => (v.g1 === 0 && v.g2 === 100 && v.b === 10 && v.a === 1) || (v.g2 === 0 && v.g1 === 100 && v.a === 10 && v.b === 1),
          bien: 'Ni con un solo litro de agua llegas a 100°: el agua siempre diluye.' },
        { texto: 'Guarda dos casos con el mismo grado final y distinto volumen total.',
          logrado: (v, gs) => gs.some(g => Math.abs(gradoMezcla(g) - gradoMezcla(v)) < 1e-9 && g.a + g.b !== v.a + v.b),
          bien: 'El grado no dice cuánto hay: mide qué parte del total es alcohol.' },
      ],
      arrastres: [
        { id: 'litros-1', etiqueta: 'final del recipiente 1', color: 'c-o',
          donde: v => { const g = TIRAS().geometria(dosAlcoholes(v).datos); return { x: g.x(v.a), y: g.centroY(0) }; },
          mover: (pt, v) => ({ a: TIRAS().geometria(dosAlcoholes(v).datos).deX(pt.x) }) },
        { id: 'litros-2', etiqueta: 'final del recipiente 2', color: 'c-o',
          donde: v => { const g = TIRAS().geometria(dosAlcoholes(v).datos); return { x: g.x(v.b), y: g.centroY(1) }; },
          mover: (pt, v) => ({ b: TIRAS().geometria(dosAlcoholes(v).datos).deX(pt.x) }) },
      ],
    },
  ];

  return {
    unidad: 'aritmetica.mezclas-y-aleaciones',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/arit-tiras.js'],
    // Glosario por tema (docs/teoria.md, 4d). «Grado» y «ley» van con su apellido: en otras unidades del curso
    // significan otra cosa (grados del círculo, leyes lógicas). «Promedio simple» se estrena antes, en razones.
    glosario: [
      { termino: 'mezcla', def: 'Lo que resulta de juntar dos o más sustancias o productos sin que cambien: cada uno aporta lo suyo.',
        ejemplo: '3 kg de café de S/ 12 con 1 kg de S/ 20 dan 4 kg.', ver: ['componente', 'precio medio'] },
      { termino: 'componente', def: 'Cada sustancia o producto que entra en una mezcla, con su cantidad y su precio o pureza.',
        ejemplo: 'Café de S/ 12 con café de S/ 20: dos componentes.', ver: ['mezcla'] },
      { termino: 'precio medio', simbolo: 'pₘ', def: 'Lo que cuesta cada unidad de una mezcla: el valor total entre la cantidad total.',
        ejemplo: '3 kg a S/ 12 y 1 kg a S/ 20: 56 ÷ 4 = S/ 14 el kilo.', ver: ['regla del aspa'] },
      { termino: 'regla del aspa', formas: ['regla del aspa', 'aspa'],
        def: 'Atajo para dos componentes: la cantidad de cada uno va cruzada con la distancia del otro precio al buscado.',
        ejemplo: 'S/ 18 con cafés de 12 y 20: distancias 6 y 2; kilos 2 : 6 = 1 : 3.', ver: ['precio medio'] },
      { termino: 'alcohol puro', def: 'Alcohol sin agua, de 100°. En una mezcla es la parte que se cuenta para hallar los grados.',
        ejemplo: '6 L de alcohol a 60° tienen 6 · 0,60 = 3,6 L de alcohol puro.', ver: ['grado alcohólico'] },
      { termino: 'grado alcohólico', simbolo: 'g', medida: '°', formas: ['grado alcohólico', 'grados alcohólicos'],
        def: 'Porcentaje de alcohol puro en el volumen total de una mezcla; se escribe con el signo °.',
        ejemplo: '3,6 L de alcohol puro en 8 L: 3,6 ÷ 8 · 100 = 45°.', ver: ['alcohol puro'] },
      { termino: 'aleación', def: 'Mezcla de metales fundidos juntos, como oro con cobre en una joya.',
        ejemplo: '2 kg de oro de 18 K fundidos con 1 kg de 12 K: 3 kg.', ver: ['ley de una aleación', 'quilate'] },
      { termino: 'ley de una aleación', formas: ['ley de una aleación', 'ley de la aleación'],
        def: 'Fracción de la masa que es metal fino, como el oro puro: su masa entre la masa total.',
        ejemplo: '2 kg de oro puro en 3 kg: ley 2/3, que son 16 quilates.', ver: ['quilate'] },
      { termino: 'quilate', simbolo: 'K', def: 'Medida de la pureza del oro en partes de 24: cada una es 1/24 de la masa.',
        ejemplo: 'Una joya de 18 K tiene 18 ÷ 24 = 75 % de oro.', ver: ['ley de una aleación'] },
    ],
    laboratorio,
    historia: {
      texto: 'Los problemas de mezclas son mucho más antiguos que la química moderna. En el siglo XIII, Yang Hui comentó problemas de los Nueve capítulos donde un objeto junta materiales de pesos distintos, y había que recuperar las cantidades a partir de los totales. No usaban porcentajes ni nuestros símbolos, pero la estructura es la misma: cada parte aporta según cuánto hay de ella.',
      pregunta: '¿Cómo sabrías cuánto oro tiene una joya sin separarlo?',
      fuente: { titulo: 'O’Connor y Robertson, Yang Hui — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Yang_Hui/' },
    },
    ideas: [precioMedio, aspa, alcohol, quilates],
  };
});
