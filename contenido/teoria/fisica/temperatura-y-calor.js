/*
 * Teoría de «Temperatura y calor» (fisica.temperatura-y-calor). Molde de docs/teoria.md; forma copiada de
 * contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 12), precisiones de física del expediente y
 * docs/investigacion/fluidos-calor-termodinamica-ideas-erroneas.md (códigos Q1–Q12).
 * Colores (regla 4): T temperatura rojo (c-h), Q calor naranja (c-o), L y ΔL largo turquesa (c-i), t tiempo verde (c-d).
 * Masa, c, C, α, k y P van en tinta.
 * Unidades de academia: calorías, c del agua = 1 cal/(g·°C), hielo 0,5 cal/(g·°C), fusión 80 cal/g, vaporización 540 cal/g.
 * Estado: completa (14 nov 2026): seis ideas que cubren los siete temas del catálogo.
 * Códigos nuevos (hipótesis, sin fuente empírica): ES-32, ES-INV, ES-273, CAL-PROMEDIO, CAL-PESOS, CAL-DIF,
 * CE-MASA, CE-INV, CE-SIN-C, FA-SUBE, FA-SIN-L, DI-CUAD, DI-SIN-L0, DI-MM, TR-CONV, TR-COND, TR-NO-LLEGA, TR-INV.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: separar temperatura (un estado) de calor (energía que pasa) y medir cuánto cambia cada cosa.
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: convierte escalas, halla una temperatura de mezcla, un calor con meseta y una dilatación.
 *   Orden de atención: 1.º la gráfica · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué dar calor no siempre sube la temperatura?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const T = { v: 'c-h', t: 'T' }, Q = { v: 'c-o', t: 'Q' }, L = { v: 'c-i', t: 'L' }, t = { v: 'c-d', t: 't' };
  const dT = ['Δ', T], dL = ['Δ', L];
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
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Idea 1: las escalas son reglas distintas ----------
  // Cambia: la temperatura en °C · Permanece: la recta que une dos puntos fijos (hielo y agua hirviendo) ·
  // Progresa: el punto que recorre la recta · Se reserva: un cambio de temperatura en vez de un valor ·
  // Debe verse: un grado Celsius vale 1,8 grados Fahrenheit; el 32 solo corre el cero.
  const aF = c => 1.8 * c + 32;
  const ejeCF = (extra = {}) => Object.assign({
    x: { min: -40, max: 100, paso: 20, nombre: 'T', unidad: '°C', decimales: 0, color: 'h' },
    y: { min: -40, max: 220, paso: 40, nombre: 'T', unidad: '°F', decimales: 0, color: 'h' },
    curvas: [{ puntos: [[-40, -40], [100, 212]], color: 'h' }],
  }, extra);
  const escalas = {
    id: 'escalas',
    titulo: 'Dos reglas para lo mismo',
    temas: ['Escalas termométricas'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige una temperatura en grados Celsius y lee cuánto marca un termómetro Fahrenheit y la escala Kelvin.',
      voz: 'Mira cuánto sube la recta por cada grado Celsius.',
      controles: [{ id: 'c', etiqueta: 'T', color: 'c-h', min: -40, max: 100, paso: 10, inicio: 20, unidad: '°C', decimales: 0 }],
      dibujo: val => ({ datos: ejeCF({ puntos: [{ x: val.c, y: aF(val.c), color: 'h', rotulo: `${f(aF(val.c), 0)} °F`, guias: true }] }), estado: {} }),
      lectura: val => [T, ` = ${f(val.c)} °C = ${f(aF(val.c))} °F = ${f(val.c + 273)} K`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Durante la mañana, la temperatura del aire sube 10 °C. ¿Cuántos grados Fahrenheit subió?',
      opciones: [
        { id: 'c', texto: '18 °F', correcta: true },
        { id: 'treinta', texto: '50 °F', error: 'ES-32', siFuera: '50 °F es la lectura de 10 °C. Un cambio no lleva el 32: ese solo corre el cero.' },
        { id: 'igual', texto: '10 °F', error: 'ES-INV', siFuera: 'Igual sería cierto en Kelvin. El grado Fahrenheit es más chico.' },
        { id: 'kelvin', texto: '283 °F', error: 'ES-273', siFuera: 'Sumar 273 lleva a Kelvin, y solo para lecturas, no para cambios.' },
      ],
      dibujo: { datos: ejeCF(), estado: {} },
      revelar: { datos: ejeCF({ puntos: [{ x: 20, y: 68, color: 'h', rotulo: '68 °F', guias: true }, { x: 30, y: 86, color: 'h', rotulo: '86 °F', guias: true }] }), estado: {} },
      coincide: 'Coincide: de 20 °C a 30 °C la lectura pasa de 68 °F a 86 °F: subió 18.',
    },
    mira: {
      datos: ejeCF({ puntos: [{ x: 0, y: 32, color: 'h', rotulo: '0 °C = 32 °F', desde: 1 }, { x: 100, y: 212, color: 'h', rotulo: '100 °C = 212 °F', desde: 2 }, { x: -40, y: -40, color: 'h', rotulo: '−40 en las dos', desde: 4 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'El hielo que se funde marca 0 °C y 32 °F.', ecuacion: ['0 °C ↔ 32 °F'] },
        { estado: { corte: 2 }, texto: 'El agua que hierve a nivel del mar marca 100 °C y 212 °F.', ecuacion: ['100 °C ↔ 212 °F'] },
        { estado: { corte: 3 }, texto: 'Entre los dos puntos hay 100 grados Celsius y 180 Fahrenheit.', ecuacion: [{ frac: ['180', '100'] }, ' = 1,8 °F por cada °C'] },
        { estado: { corte: 4 }, texto: 'La recta empieza en 32: esa es la lectura del cero Celsius.', ecuacion: [{ sub: [T, 'F'] }, ' = 1,8 ', { sub: [T, 'C'] }, ' + 32'] },
      ],
    },
    regla: {
      texto: 'Las escalas son reglas con distinto cero y distinto tamaño de grado. Para lecturas se usa la fórmula completa; para cambios, solo el tamaño del grado.',
      ecuacion: [{ sub: [T, 'F'] }, ' = 1,8 ', { sub: [T, 'C'] }, ' + 32   ·   ', { sub: [T, 'K'] }, ' = ', { sub: [T, 'C'] }, ' + 273   ·   Δ', { sub: [T, 'F'] }, ' = 1,8 Δ', { sub: [T, 'C'] }],
      condicion: 'Kelvin empieza en el cero absoluto y su grado es igual al Celsius: un cambio en K es igual que en °C.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const c = r.de([-20, -10, 15, 25, 37, 45, 60, 80]);
          return {
            pregunta: `Un termómetro marca ${f(c)} °C. ¿Cuánto marcaría uno en grados Fahrenheit?`,
            opciones: opciones(aF(c), [
              { id: 'sin32', valor: 1.8 * c, error: 'ES-32', siFuera: 'Eso olvida que el cero Celsius ya es 32 °F.' },
              { id: 'inv', valor: (c - 32) / 1.8, error: 'ES-INV', siFuera: 'Esa fórmula pasa de Fahrenheit a Celsius, al revés.' },
              { id: 'k', valor: c + 273, error: 'ES-273', siFuera: 'Eso lo lleva a Kelvin, no a Fahrenheit.' },
            ], n => `${f(n, 1)} °F`),
            solucion: { texto: 'Cada °C vale 1,8 °F, y el cero Celsius es 32 °F.', ecuacion: [{ sub: [T, 'F'] }, ` = 1,8 · ${f(c)} + 32 = ${f(aF(c), 1)} °F`] },
          };
        }
        if (tipo === 1) {
          const dc = r.de([5, 15, 20, 25, 40]);
          return {
            pregunta: `Un horno se calienta ${f(dc)} °C. ¿Cuántos grados Fahrenheit subió su temperatura?`,
            opciones: opciones(1.8 * dc, [
              { id: 'f32', valor: 1.8 * dc + 32, error: 'ES-32', siFuera: 'Esa sería la lectura de un termómetro en ' + f(dc) + ' °C; en un cambio el 32 no entra.' },
              { id: 'igual', valor: dc, error: 'ES-INV', siFuera: 'El mismo número valdría en Kelvin; el grado Fahrenheit es más chico.' },
              { id: 'div', valor: dc / 1.8, error: 'ES-INV', siFuera: 'Eso divide entre 1,8; cada °C son 1,8 °F, más grados, no menos.' },
            ], n => `${f(n, 1)} °F`),
            solucion: { texto: 'En un cambio solo cuenta el tamaño del grado.', ecuacion: ['Δ', { sub: [T, 'F'] }, ` = 1,8 · ${f(dc)} = ${f(1.8 * dc, 1)} °F   ·   Δ`, { sub: [T, 'K'] }, ` = ${f(dc)} K`] },
          };
        }
        const k = r.de([233, 253, 263, 300, 310, 350, 373]);
        return {
          pregunta: `Un gas está a ${f(k)} K. ¿Cuál es su temperatura en grados Celsius?`,
          opciones: opciones(k - 273, [
            { id: 'suma', valor: k + 273, error: 'ES-273', siFuera: 'Eso suma 273; para pasar de K a °C se resta.' },
            { id: 'igual', valor: k, error: 'ES-INV', siFuera: 'Los grados son del mismo tamaño, pero los ceros están 273 grados aparte.' },
            { id: 'f', valor: (k - 273) * 1.8 + 32, error: 'ES-32', siFuera: 'Eso lo lleva a Fahrenheit.' },
          ], n => `${f(n)} °C`),
          solucion: { texto: 'El cero Celsius está 273 grados por encima del cero absoluto.', ecuacion: [{ sub: [T, 'C'] }, ` = ${f(k)} − 273 = ${f(k - 273)} °C`] },
        };
      },
    },
  };

  // ---------- Idea 2: equilibrio térmico y mezcla ----------
  // Cambia: la masa de agua caliente · Permanece: 100 g de agua fría a 20 °C y el agua caliente a 80 °C ·
  // Progresa: las dos curvas, que se acercan hasta tocarse · Se reserva: masas distintas en la predicción ·
  // Debe verse: el calor que pierde el caliente lo gana el frío; al final, una sola temperatura.
  const curvaHacia = (T0, Tf, tau, tmax = 10, n = 21) => Array.from({ length: n }, (_, i) => { const tt = tmax * i / (n - 1); return [tt, Tf + (T0 - Tf) * Math.exp(-tt / tau)]; });
  const ejeTt = (m1, T1, m2, T2, extra = {}) => {
    const Tf = (m1 * T1 + m2 * T2) / (m1 + m2);
    return Object.assign({
      x: { min: 0, max: 10, paso: 2, nombre: 't', unidad: 'min', decimales: 0, color: 'd' },
      y: { min: 0, max: 100, paso: 20, nombre: 'T', unidad: '°C', decimales: 0, color: 'h' },
      curvas: [{ puntos: curvaHacia(T1, Tf, 2 * m1 / (m1 + m2)), color: 'h', rotulo: `${f(m1)} g`, en: [0.4, T1] }, { puntos: curvaHacia(T2, Tf, 2 * m2 / (m1 + m2)), color: 'h', rotulo: `${f(m2)} g`, en: [0.4, T2 - 4], discontinua: true }],
      puntos: [{ x: 10, y: Tf, color: 'h', rotulo: `${f(Tf, 1)} °C`, guias: true }],
    }, extra);
  };
  // Antes de mezclar: solo los dos puntos de partida (la curva delataría la respuesta).
  const inicioTt = (m1, T1, m2, T2) => Object.assign(ejeTt(m1, T1, m2, T2), { curvas: [], puntos: [{ x: 0, y: T1, color: 'h', rotulo: `${f(m1)} g a ${f(T1)} °C` }, { x: 0, y: T2, color: 'h', rotulo: `${f(m2)} g a ${f(T2)} °C` }] });
  const mezcla = {
    id: 'equilibrio-mezcla',
    titulo: 'Lo que uno pierde, otro gana',
    temas: ['Temperatura, equilibrio térmico y ley cero', 'Calorimetría'],
    pieza: 'ejes',
    juega: {
      consigna: 'Se juntan agua caliente a 80 °C y 100 g de agua fría a 20 °C en un vaso aislado. Elige cuánta agua caliente.',
      voz: 'Mira dónde se juntan las dos curvas.',
      controles: [{ id: 'm', etiqueta: 'agua caliente', min: 50, max: 300, paso: 50, inicio: 100, unidad: 'g', decimales: 0 }],
      dibujo: val => ({ datos: ejeTt(val.m, 80, 100, 20), estado: {} }),
      lectura: val => ['Final: ', { sub: [T, 'f'] }, ` = ${f((val.m * 80 + 2000) / (val.m + 100), 1)} °C · `, Q, ` = ${f(100 * ((val.m * 80 + 2000) / (val.m + 100) - 20), 0)} cal`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En un vaso aislado se juntan 100 g de agua a 80 °C y 300 g de agua a 20 °C. ¿A qué temperatura quedan las dos?',
      opciones: [
        { id: 'c', texto: '35 °C', correcta: true },
        { id: 'prom', texto: '50 °C', error: 'CAL-PROMEDIO', siFuera: '50 °C es el promedio: valdría con masas iguales. Aquí hay el triple de agua fría.' },
        { id: 'pesos', texto: '65 °C', error: 'CAL-PESOS', siFuera: 'Eso le da más peso al agua caliente; la que abunda es la fría.' },
        { id: 'dif', texto: '60 °C', error: 'CAL-DIF', siFuera: '60 es la diferencia de temperaturas, no una temperatura final.' },
      ],
      dibujo: { datos: inicioTt(100, 80, 300, 20), estado: {} },
      revelar: { datos: ejeTt(100, 80, 300, 20), estado: {} },
      coincide: 'Coincide: el agua caliente baja 45 °C y la fría, el triple de masa, sube solo 15 °C.',
    },
    mira: {
      datos: ejeTt(100, 80, 300, 20),
      pasos: [
        { estado: {}, texto: 'El calor pasa de la caliente a la fría hasta igualar temperaturas.', ecuacion: [{ sub: [Q, 'cede'] }, ' = ', { sub: [Q, 'gana'] }] },
        { estado: {}, texto: 'Cada parte cambia según su masa: Q = m c ΔT.', ecuacion: ['100 · 1 · (80 − ', { sub: [T, 'f'] }, ') = 300 · 1 · (', { sub: [T, 'f'] }, ' − 20)'] },
        { estado: {}, texto: 'Se despeja: 8000 + 6000 = 400 T.', ecuacion: [{ sub: [T, 'f'] }, ' = ', { frac: ['100 · 80 + 300 · 20', '400'] }, ' = 35 °C'] },
        { estado: {}, texto: 'Ley cero: en equilibrio con un tercero, en equilibrio entre sí.', ecuacion: ['por eso un termómetro mide la temperatura de otro cuerpo'] },
      ],
    },
    regla: {
      texto: 'Dos cuerpos en contacto intercambian calor hasta tener la misma temperatura: el equilibrio térmico. En un recipiente aislado, el calor que uno cede lo gana el otro.',
      ecuacion: [{ sub: ['m', '1'] }, { sub: ['c', '1'] }, '(', { sub: [T, '1'] }, ' − ', { sub: [T, 'f'] }, ') = ', { sub: ['m', '2'] }, { sub: ['c', '2'] }, '(', { sub: [T, 'f'] }, ' − ', { sub: [T, '2'] }, ')'],
      condicion: 'sin pérdidas al ambiente, sin cambio de fase, y contando el recipiente si absorbe calor.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), m1 = r.de([100, 200, 300]), m2 = r.de([100, 200, 400]), T1 = r.de([60, 70, 80, 90]), T2 = r.de([10, 15, 20]);
        const Tf = (m1 * T1 + m2 * T2) / (m1 + m2);
        return {
          pregunta: `En un vaso aislado se juntan ${f(m1)} g de agua a ${f(T1)} °C y ${f(m2)} g de agua a ${f(T2)} °C. ¿Cuál es la temperatura final?`,
          dibujo: { datos: inicioTt(m1, T1, m2, T2), estado: {} },
          opciones: opciones(Tf, [
            { id: 'prom', valor: (T1 + T2) / 2, error: 'CAL-PROMEDIO', siFuera: 'El promedio simple vale solo con masas iguales.' },
            { id: 'pesos', valor: (m2 * T1 + m1 * T2) / (m1 + m2), error: 'CAL-PESOS', siFuera: 'Eso cruza las masas: cada temperatura pesa con su propia masa.' },
            { id: 'dif', valor: T1 - T2, error: 'CAL-DIF', siFuera: 'Esa es la diferencia inicial de temperaturas.' },
          ], n => `${f(n, 1)} °C`),
          solucion: { texto: 'Promedio de temperaturas pesado por las masas (el mismo c).', ecuacion: [{ sub: [T, 'f'] }, ` = (${f(m1)} · ${f(T1)} + ${f(m2)} · ${f(T2)}) / ${f(m1 + m2)} = ${f(Tf, 1)} °C`], dibujo: { datos: ejeTt(m1, T1, m2, T2), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: calor específico y capacidad calorífica ----------
  // Cambia: el calor dado y el material · Permanece: 100 g de cada uno, desde 20 °C ·
  // Progresa: el punto que sube por la recta T–Q · Se reserva: el doble de masa ·
  // Debe verse: con el mismo calor, lo de menor c se calienta más; la pendiente es 1/(mc).
  const MAT = { 1: 'agua', 0.2: 'arena', 0.11: 'hierro' };
  const ejeTQ = (lineas, extra = {}) => Object.assign({
    x: { min: 0, max: 2, paso: 0.5, nombre: 'Q', unidad: 'kcal', decimales: 1, color: 'o' },
    y: { min: 0, max: 100, paso: 20, nombre: 'T', unidad: '°C', decimales: 0, color: 'h' },
    curvas: lineas.map(([m, c, rot, disc]) => { const qmax = Math.min(2, (100 - 20) * m * c / 1000); return { puntos: [[0, 20], [qmax, 20 + qmax * 1000 / (m * c)]], color: 'h', rotulo: rot, discontinua: disc }; }),
  }, extra);
  const especifico = {
    id: 'calor-especifico',
    titulo: 'Mismo calor, distinto ΔT',
    temas: ['Calor específico y capacidad calorífica'],
    pieza: 'ejes',
    juega: {
      consigna: 'Calienta 100 g de un material que empieza a 20 °C. Elige el material y cuánto calor le das.',
      voz: 'Compara qué tan empinada es la recta de cada material.',
      controles: [
        { id: 'q', etiqueta: 'Q', color: 'c-o', min: 0.1, max: 0.8, paso: 0.1, inicio: 0.4, unidad: 'kcal', decimales: 1 },
        { id: 'c', etiqueta: 'Material', opciones: [{ valor: 1, texto: 'agua' }, { valor: 0.2, texto: 'arena' }, { valor: 0.11, texto: 'hierro' }], inicio: 1 },
      ],
      dibujo: val => {
        const Tq = 20 + val.q * 1000 / (100 * val.c);
        return { datos: ejeTQ([[100, val.c, MAT[val.c]]], { puntos: Tq <= 100 ? [{ x: val.q, y: Tq, color: 'h', rotulo: `${f(Tq, 0)} °C`, guias: true }] : [] }), estado: {} };
      },
      lectura: val => { const dT2 = val.q * 1000 / (100 * val.c); return [dT, ` = ${f(dT2, 1)} °C`, dT2 > 80 ? ' (pasa de 100 °C)' : '']; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Para subir 10 °C, 100 g de agua necesitan 1000 cal. ¿Cuánto calor necesitan 200 g de agua para subir los mismos 10 °C?',
      opciones: [
        { id: 'c', texto: '2000 cal', correcta: true },
        { id: 'igual', texto: '1000 cal: es la misma agua', error: 'CE-MASA', siFuera: 'El material sí es el mismo, y c también. Pero hay el doble de agua que calentar.' },
        { id: 'mitad', texto: '500 cal', error: 'CE-INV', siFuera: 'Con la mitad de calor, el doble de agua subiría solo 2,5 °C.' },
        { id: 'cuatro', texto: '4000 cal', error: 'CE-INV', siFuera: 'El calor crece en proporción a la masa, no a su cuadrado.' },
      ],
      dibujo: { datos: ejeTQ([[100, 1, '100 g']]), estado: {} },
      revelar: { datos: ejeTQ([[100, 1, '100 g'], [200, 1, '200 g', true]], { puntos: [{ x: 1, y: 30, color: 'h', rotulo: '100 g: 30 °C', guias: true }, { x: 2, y: 30, color: 'h', rotulo: '200 g', guias: true }] }), estado: {} },
      coincide: 'Coincide: la recta de 200 g es la mitad de empinada; para llegar a 30 °C necesita el doble de calor.',
    },
    mira: {
      datos: ejeTQ([[100, 1, 'agua'], [100, 0.2, 'arena']], { puntos: [{ x: 0.5, y: 25, color: 'h', rotulo: '25 °C', desde: 1 }, { x: 0.5, y: 45, color: 'h', rotulo: '45 °C', desde: 2 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: '500 cal suben 100 g de agua 5 °C.', ecuacion: [dT, ' = ', { frac: [Q, 'm c'] }, ' = ', { frac: ['500', '100 · 1'] }, ' = 5 °C'] },
        { estado: { corte: 2 }, texto: 'La arena tiene c cinco veces menor: sube 25 °C.', ecuacion: [dT, ' = ', { frac: ['500', '100 · 0,2'] }, ' = 25 °C'] },
        { estado: { corte: 2 }, texto: 'c dice cuánto calor pide cada gramo por grado.', ecuacion: ['c = ', { frac: [Q, ['m', dT]] }] },
        { estado: { corte: 2 }, texto: 'La capacidad calorífica es lo que pide el cuerpo entero: C = m c.', ecuacion: ['C = m c = ', { frac: [Q, dT] }] },
      ],
    },
    regla: {
      texto: 'El calor necesario para cambiar la temperatura crece con la masa, con el calor específico c del material y con el cambio de temperatura.',
      ecuacion: [Q, ' = m c ', dT, '   ·   C = m c'],
      condicion: 'no hay cambio de fase en el tramo y c se toma constante. Agua: 1 cal/(g·°C).',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), c = r.de([1, 0.5, 0.2, 0.11, 0.09]), m = r.de([50, 100, 200, 250, 500]), d = r.de([10, 20, 25, 40]);
        const q = m * c * d, nom = { 1: 'agua', 0.5: 'hielo', 0.2: 'arena', 0.11: 'hierro', 0.09: 'cobre' }[c];
        return {
          pregunta: `¿Cuánto calor hay que darle a ${f(m)} g de ${nom} (c = ${f(c)} cal/(g·°C)) para que su temperatura suba ${f(d)} °C?`,
          opciones: opciones(q, [
            { id: 'sin-c', valor: m * d, error: 'CE-SIN-C', siFuera: 'Eso sería cierto para agua; aquí hay que multiplicar por su c.' },
            { id: 'sin-m', valor: c * d, error: 'CE-MASA', siFuera: 'Eso es el calor para un solo gramo.' },
            { id: 'div', valor: m * d / c, error: 'CE-INV', siFuera: 'Eso divide entre c; un material de c chico pide menos calor.' },
          ], n => `${f(n, 1)} cal`),
          solucion: { texto: 'Masa por calor específico por cambio de temperatura.', ecuacion: [Q, ` = ${f(m)} · ${f(c)} · ${f(d)} = ${f(q, 1)} cal`] },
        };
      },
    },
  };

  // ---------- Idea 4: cambios de fase y calor latente ----------
  // Cambia: el calor dado a 100 g de hielo a −20 °C · Permanece: la curva de calentamiento completa ·
  // Progresa: el punto que la recorre · Se reserva: la olla que hierve con más fuego ·
  // Debe verse: en las mesetas el calor entra y la temperatura no sube: cambia la fase.
  const M4 = 100;
  const tramos = [[0, -20], [1, 0], [9, 0], [19, 100], [24, 100]];   // kcal y °C para 100 g de hielo desde −20 °C
  const estadoFase = q => {
    if (q <= 1) return { T: -20 + 20 * q, que: 'hielo' };
    if (q <= 9) return { T: 0, que: `hielo y agua (${f((q - 1) * 1000 / 80, 0)} g fundidos)` };
    if (q <= 19) return { T: (q - 9) * 10, que: 'agua' };
    return { T: 100, que: `agua hirviendo (${f((q - 19) * 1000 / 540, 1)} g de vapor)` };
  };
  const ejeFase = (extra = {}) => Object.assign({
    x: { min: 0, max: 24, paso: 4, nombre: 'Q', unidad: 'kcal', decimales: 0, color: 'o' },
    y: { min: -20, max: 120, paso: 20, nombre: 'T', unidad: '°C', decimales: 0, color: 'h' },
    curvas: [{ puntos: tramos, color: 'h' }],
  }, extra);
  const fase = {
    id: 'cambio-de-fase',
    titulo: 'En la meseta, T no sube',
    temas: ['Cambios de fase y calor latente'],
    pieza: 'ejes',
    juega: {
      consigna: 'Le das calor a 100 g de hielo que empieza a −20 °C, a nivel del mar. Avanza el calor y mira la temperatura.',
      voz: 'Hay tramos donde el calor entra y la temperatura no cambia.',
      controles: [{ id: 'q', etiqueta: 'Q', color: 'c-o', min: 0, max: 24, paso: 1, inicio: 0, unidad: 'kcal', decimales: 0 }],
      dibujo: val => { const e = estadoFase(val.q); return { datos: ejeFase({ puntos: [{ x: val.q, y: e.T, color: 'h', rotulo: `${f(e.T, 0)} °C`, guias: true }] }), estado: {} }; },
      lectura: val => { const e = estadoFase(val.q); return [T, ` = ${f(e.T, 0)} °C · ${e.que}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Una olla con agua ya hierve a 100 °C. Se sube el fuego al doble. Mientras siga habiendo agua, ¿qué pasa con su temperatura?',
      opciones: [
        { id: 'c', texto: 'Sigue en 100 °C; se evapora más rápido', correcta: true },
        { id: 'sube', texto: 'Sube, porque recibe más calor', error: 'Q7', siFuera: 'Más calor sí sube la temperatura del agua líquida. Al hervir, ese calor separa moléculas.' },
        { id: 'doble', texto: 'Sube hasta unos 200 °C', error: 'FA-SUBE', siFuera: 'El doble de fuego da el doble de calor por minuto, no el doble de temperatura.' },
        { id: 'baja', texto: 'Baja un poco por la evaporación', error: 'Q9', siFuera: 'Evaporar sí se lleva energía, pero el fuego la repone: la meseta se mantiene.' },
      ],
      dibujo: { datos: ejeFase(), estado: {} },
      revelar: { datos: ejeFase({ areas: [], puntos: [{ x: 19, y: 100, color: 'h', rotulo: 'empieza a hervir', guias: true }, { x: 24, y: 100, color: 'h' }] }), estado: {} },
      coincide: 'Coincide: en la meseta de 100 °C cada caloría convierte agua en vapor; más fuego solo la acaba antes.',
    },
    mira: {
      datos: ejeFase({ puntos: [{ x: 1, y: 0, color: 'h', rotulo: '1 kcal', desde: 1 }, { x: 9, y: 0, color: 'h', rotulo: '9 kcal', desde: 2 }, { x: 19, y: 100, color: 'h', rotulo: '19 kcal', desde: 3 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'El hielo sube de −20 a 0 °C.', ecuacion: [Q, ' = 100 · 0,5 · 20 = 1000 cal'] },
        { estado: { corte: 2 }, texto: 'A 0 °C se funde: 80 cal por gramo, sin subir T.', ecuacion: [Q, ' = m ', { sub: ['L', 'f'] }, ' = 100 · 80 = 8000 cal'] },
        { estado: { corte: 3 }, texto: 'El agua líquida sube de 0 a 100 °C.', ecuacion: [Q, ' = 100 · 1 · 100 = 10 000 cal'] },
        { estado: { corte: 3 }, texto: 'A 100 °C hierve: 540 cal por gramo, otra meseta.', ecuacion: [Q, ' = m ', { sub: ['L', 'v'] }, ' = 100 · 540 = 54 000 cal'] },
      ],
    },
    regla: {
      texto: 'Durante un cambio de fase, el calor que entra cambia el estado y no la temperatura. Cada gramo pide un calor latente L.',
      ecuacion: [Q, ' = m L   ·   agua: ', { sub: ['L', 'f'] }, ' = 80 cal/g, ', { sub: ['L', 'v'] }, ' = 540 cal/g'],
      condicion: 'la presión no cambia. A nivel del mar el agua hierve a 100 °C; en Juliaca, cerca de 87 °C.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), m = r.de([20, 50, 100, 200]), Ti = r.de([-10, -20, -30]), Tf = r.de([0, 20, 40]);
        const q1 = m * 0.5 * -Ti, q2 = m * 80, q3 = m * Tf, q = q1 + q2 + q3;
        return {
          pregunta: `¿Cuánto calor hay que darle a ${f(m)} g de hielo a ${f(Ti)} °C para obtener agua a ${f(Tf)} °C? (c del hielo 0,5; fusión 80 cal/g)`,
          opciones: opciones(q, [
            { id: 'sin-l', valor: q1 + q3, error: 'FA-SIN-L', siFuera: 'Eso olvida fundir el hielo: la meseta de 0 °C también pide calor.' },
            { id: 'solo-l', valor: q2, error: 'Q7', siFuera: 'Eso es solo la fusión; antes hay que llegar a 0 °C y después calentar el agua.' },
            { id: 'un-c', valor: m * 1 * (Tf - Ti) + q2, error: 'CE-SIN-C', siFuera: 'Eso usa c del agua también para el hielo.' },
          ], n => `${f(n)} cal`),
          solucion: { texto: 'Tres tramos: calentar el hielo, fundirlo y calentar el agua.', ecuacion: [`${f(q1)} + ${f(q2)} + ${f(q3)} = ${f(q)} cal`] },
        };
      },
    },
  };

  // ---------- Idea 5: dilatación ----------
  // Cambia: el largo inicial, el material y cuánto se calienta · Permanece: el origen de la gráfica (sin calentar, no se estira) ·
  // Progresa: la recta ΔL–ΔT · Se reserva: el agujero de una placa · Debe verse: todo largo crece en proporción a sí mismo.
  const ALFA = { 12: 'acero', 24: 'aluminio' };
  const ejeDil = (L0, a, extra = {}) => Object.assign({
    x: { min: 0, max: 100, paso: 20, nombre: 'ΔT', unidad: '°C', decimales: 0, color: 'h' },
    y: { min: 0, max: 10, paso: 2, nombre: 'ΔL', unidad: 'mm', decimales: 0, color: 'i' },
    curvas: [{ puntos: [[0, 0], [100, a * L0 * 100 / 1000]], color: 'i', rotulo: `${ALFA[a] || ''} de ${f(L0)} m` }],
  }, extra);
  const dilatacion = {
    id: 'dilatacion',
    titulo: 'Al calentarse, todo largo crece',
    temas: ['Dilatación'],
    pieza: 'ejes',
    juega: {
      consigna: 'Calienta una varilla. Elige su material, su largo y cuánto sube su temperatura.',
      voz: 'Compara cuánto se estira una varilla larga y una corta.',
      controles: [
        { id: 'L0', etiqueta: 'L₀', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'm', decimales: 0 },
        { id: 'dt', etiqueta: 'ΔT', color: 'c-h', min: 20, max: 100, paso: 20, inicio: 60, unidad: '°C', decimales: 0 },
        { id: 'a', etiqueta: 'Material', opciones: [{ valor: 12, texto: 'acero' }, { valor: 24, texto: 'aluminio' }], inicio: 12 },
      ],
      dibujo: val => { const dl = val.a * val.L0 * val.dt / 1000; return { datos: ejeDil(val.L0, val.a, { puntos: [{ x: val.dt, y: dl, color: 'i', rotulo: `${f(dl, 2)} mm`, guias: true }] }), estado: {} }; },
      lectura: val => [dL, ` = ${f(val.a * val.L0 * val.dt / 1000, 2)} mm`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una placa de acero tiene un agujero redondo en el centro. Se calienta toda la placa. ¿Qué pasa con el diámetro del agujero?',
      opciones: [
        { id: 'c', texto: 'Crece, igual que si fuera de acero', correcta: true },
        { id: 'chico', texto: 'Se achica: el acero se expande hacia adentro', error: 'Q11', siFuera: 'El acero sí se expande. Pero cada largo de la placa crece, también el borde del agujero.' },
        { id: 'igual', texto: 'No cambia: el agujero no es material', error: 'Q11', siFuera: 'El agujero no se calienta, cierto. Pero su borde es acero, y ese borde se alarga.' },
      ],
      dibujo: { datos: ejeDil(1, 12, { curvas: [{ puntos: [[0, 0], [100, 1.2]], color: 'i', rotulo: 'lado de 1 m' }] }), estado: {} },
      revelar: { datos: ejeDil(1, 12, { y: { min: 0, max: 2, paso: 0.5, nombre: 'ΔL', unidad: 'mm', decimales: 1, color: 'i' }, curvas: [{ puntos: [[0, 0], [100, 1.2]], color: 'i', rotulo: 'lado de 1 m' }, { puntos: [[0, 0], [100, 0.24]], color: 'i', rotulo: 'agujero de 20 cm', discontinua: true }] }), estado: {} },
      coincide: 'Coincide: el agujero crece como crecería un disco de acero de su tamaño, con el mismo α.',
    },
    mira: {
      datos: ejeDil(2, 12, { puntos: [{ x: 60, y: 1.44, color: 'i', rotulo: '1,44 mm', guias: true, desde: 3 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada metro de acero crece 0,012 mm por cada grado.', ecuacion: ['α = 12 · ', { sup: ['10', '−6'] }, ' 1/°C'] },
        { estado: { corte: 2 }, texto: 'Una varilla de 2 m tiene el doble de metros que crecen.', ecuacion: [{ sub: [L, '0'] }, ' = 2 m'] },
        { estado: { corte: 3 }, texto: 'Con 60 °C más: 2 · 60 · 0,012 mm.', ecuacion: [dL, ' = α ', { sub: [L, '0'] }, ' ', dT, ' = 1,44 mm'] },
      ],
    },
    regla: {
      texto: 'Al calentarse, cada largo de un sólido crece en proporción a sí mismo y al cambio de temperatura: también los huecos y los bordes.',
      ecuacion: [dL, ' = α ', { sub: [L, '0'] }, ' ', dT, '   ·   área: β = 2α   ·   volumen: γ = 3α'],
      condicion: 'cambios de temperatura moderados, sin cambio de fase; α depende del material.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), a = r.de([12, 17, 24]), L0 = r.de([0.5, 1, 2, 5, 10]), d = r.de([20, 40, 50, 80]);
        const dl = a * L0 * d / 1000, nom = { 12: 'acero', 17: 'cobre', 24: 'aluminio' }[a];
        return {
          pregunta: `Una varilla de ${nom} (α = ${f(a)} · 10⁻⁶ 1/°C) mide ${f(L0)} m. Si su temperatura sube ${f(d)} °C, ¿cuánto se alarga?`,
          opciones: opciones(dl, [
            { id: 'sin-l', valor: a * d / 1000, error: 'DI-SIN-L0', siFuera: 'Eso es lo que crece un solo metro.' },
            { id: 'cm', valor: dl / 10, error: 'DI-MM', siFuera: 'Hay un error de unidades: revisa el paso de metros a milímetros.' },
            { id: 'cuad', valor: a * L0 * d * d / 1000, error: 'DI-CUAD', siFuera: 'El cambio de temperatura entra una vez, no al cuadrado.' },
          ], n => `${f(n, 3)} mm`),
          solucion: { texto: 'α por largo inicial por cambio de temperatura.', ecuacion: [dL, ` = ${f(a)} · 10⁻⁶ · ${f(L0)} · ${f(d)} m = ${f(dl, 3)} mm`] },
        };
      },
    },
  };

  // ---------- Idea 6: conducción, convección y radiación ----------
  // Cambia: el espesor de la pared y la diferencia de temperatura · Permanece: el ladrillo y el área de la pared ·
  // Progresa: el punto en la curva P–L · Se reserva: el calor del Sol, que cruza el vacío ·
  // Debe verse: por conducción pasa más calor con más ΔT y con menos espesor; sin materia, solo radiación.
  const KL = 0.6, AP = 10;
  const ejePL = (dt, extra = {}) => Object.assign({
    x: { min: 0, max: 40, paso: 10, nombre: 'espesor', unidad: 'cm', decimales: 0, color: 'i' },
    y: { min: 0, max: 1200, paso: 300, nombre: 'P', unidad: 'W', decimales: 0 },
    curvas: [{ puntos: Array.from({ length: 31 }, (_, i) => { const e = 10 + i; return [e, KL * AP * dt / (e / 100)]; }), color: 'h', rotulo: `ΔT = ${f(dt)} °C` }],
  }, extra);
  const SITUACIONES = [
    ['El mango metálico de una cuchara en el té se calienta.', 'conducción'],
    ['El aire caliente de una estufa sube y calienta el cuarto.', 'convección'],
    ['La piel se calienta frente a una fogata, a dos metros.', 'radiación'],
    ['El agua del fondo de una olla sube y la de arriba baja.', 'convección'],
    ['La luz del Sol calienta la Tierra a través del espacio.', 'radiación'],
    ['La mano se enfría al tocar una baranda de fierro en la mañana.', 'conducción'],
    ['La brisa del mar de día: el aire sobre la arena sube.', 'convección'],
  ];
  const transferencia = {
    id: 'transferencia',
    titulo: 'Tres caminos del calor',
    temas: ['Conducción, convección y radiación'],
    pieza: 'ejes',
    juega: {
      consigna: 'Una pared de ladrillo de 10 m² separa un cuarto tibio del frío de afuera. Cambia su espesor y la diferencia de temperatura.',
      voz: 'Mira cuánta energía por segundo cruza la pared.',
      controles: [
        { id: 'e', etiqueta: 'espesor', color: 'c-i', min: 10, max: 40, paso: 5, inicio: 20, unidad: 'cm', decimales: 0 },
        { id: 'dt', etiqueta: 'ΔT', color: 'c-h', min: 5, max: 20, paso: 5, inicio: 10, unidad: '°C', decimales: 0 },
      ],
      dibujo: val => { const P = KL * AP * val.dt / (val.e / 100); return { datos: ejePL(val.dt, { puntos: [{ x: val.e, y: P, color: 'h', rotulo: `${f(P, 0)} W`, guias: true }] }), estado: {} }; },
      lectura: val => [`Cruzan ${f(KL * AP * val.dt / (val.e / 100), 0)} J cada segundo por conducción`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Entre el Sol y la Tierra casi no hay materia: es vacío. ¿Cómo llega el calor del Sol hasta nosotros?',
      opciones: [
        { id: 'c', texto: 'Por radiación: no necesita materia', correcta: true },
        { id: 'cond', texto: 'Por conducción, de partícula en partícula', error: 'TR-COND', siFuera: 'La conducción sí pasa de partícula en partícula, por eso necesita materia.' },
        { id: 'conv', texto: 'Por convección, con corrientes de aire', error: 'TR-CONV', siFuera: 'La convección mueve un fluido, y en el vacío no hay fluido que mover.' },
        { id: 'no', texto: 'No llega calor; solo luz', error: 'TR-NO-LLEGA', siFuera: 'La luz es justamente radiación, y transporta energía que calienta.' },
      ],
      dibujo: { datos: ejePL(10), estado: {} },
      revelar: { datos: ejePL(10, { curvas: [{ puntos: [[10, 0], [40, 0]], color: 'h', rotulo: 'en el vacío: conducción 0 W', en: [12, 0] }] }), estado: {} },
      coincide: 'Coincide: sin materia no hay conducción ni convección; la radiación cruza el vacío.',
    },
    mira: {
      datos: (d => Object.assign(d, { curvas: [Object.assign({}, d.curvas[0], { rotulo: 'ΔT = 10 °C', en: [12, 500] })] }))(ejePL(10, { puntos: [{ x: 20, y: 300, color: 'h', rotulo: '300 W', guias: true, desde: 2 }, { x: 40, y: 150, color: 'h', rotulo: '150 W', guias: true, desde: 3 }] })),
      pasos: [
        { estado: { corte: 1 }, texto: 'Conducción: el calor pasa de partícula en partícula por el ladrillo.', ecuacion: ['P = ', { frac: ['k A Δ' + 'T', 'espesor'] }] },
        { estado: { corte: 2 }, texto: 'Con 20 cm y 10 °C de diferencia: 300 W.', ecuacion: ['P = ', { frac: ['0,6 · 10 · 10', '0,20'] }, ' = 300 W'] },
        { estado: { corte: 3 }, texto: 'Con el doble de espesor, pasa la mitad.', ecuacion: ['P = 150 W'] },
        { estado: { corte: 3 }, texto: 'Convección: el fluido caliente se mueve. Radiación: luz, sin materia.', ecuacion: ['tres mecanismos distintos'] },
      ],
    },
    regla: {
      texto: 'El calor viaja por conducción (contacto, sin que la materia se desplace), por convección (un fluido que se mueve) y por radiación (ondas, incluso en el vacío).',
      ecuacion: ['conducción: P = ', { frac: ['k A Δ' + 'T', 'espesor'] }],
      condicion: 'la fórmula vale para una pared de espesor uniforme en estado estable; k depende del material.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 1) {
          const [txt, mec] = SITUACIONES[s % SITUACIONES.length];
          return {
            pregunta: `${txt} ¿Por qué mecanismo pasa el calor, principalmente?`,
            opciones: [
              { id: 'c', texto: mec, correcta: true },
              ...['conducción', 'convección', 'radiación'].filter(m => m !== mec).map(m => ({ id: m, texto: m, error: m === 'radiación' ? 'TR-NO-LLEGA' : m === 'convección' ? 'TR-CONV' : 'TR-COND',
                siFuera: m === 'conducción' ? 'Conducción sería si el calor pasara por contacto, sin que nada se mueva.' : m === 'convección' ? 'Convección sería si un fluido caliente se desplazara.' : 'Radiación sería si llegara por luz, sin contacto ni fluido.' })),
            ],
            solucion: { texto: mec === 'conducción' ? 'Pasa por contacto, de partícula en partícula.' : mec === 'convección' ? 'Un fluido caliente se mueve y lleva la energía.' : 'Llega como radiación, sin necesitar materia.', ecuacion: [mec] },
          };
        }
        const k = r.de([0.6, 0.8, 1]), A = r.de([2, 5, 10]), d = r.de([5, 10, 20]), e = r.de([10, 20, 25]);
        const P = k * A * d / (e / 100);
        return {
          pregunta: `Una pared de ${f(A)} m² y ${f(e)} cm de espesor (k = ${f(k)} W/(m·°C)) tiene ${f(d)} °C de diferencia entre sus caras. ¿Cuánto calor cruza cada segundo?`,
          opciones: opciones(P, [
            { id: 'cm', valor: k * A * d / e, error: 'U1', siFuera: 'Eso usa el espesor en cm; en la fórmula va en metros.' },
            { id: 'por', valor: k * A * d * (e / 100), error: 'TR-INV', siFuera: 'Eso multiplica por el espesor; una pared más gruesa deja pasar menos.' },
            { id: 'sin-a', valor: k * d / (e / 100), error: 'TR-INV', siFuera: 'Eso es por cada m²; falta multiplicar por el área.' },
          ], n => `${f(n, 1)} W`),
          solucion: { texto: 'Conducción: k A ΔT entre el espesor en metros.', ecuacion: [`P = ${f(k)} · ${f(A)} · ${f(d)} / ${f(e / 100, 2)} = ${f(P, 1)} W`] },
        };
      },
    },
  };

  return {
    unidad: 'fisica.temperatura-y-calor',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Los termoscopios de inicios del siglo XVII mostraban que algo se calentaba, pero sin una escala común; algunos respondían también a la presión del aire. En el siglo XVIII, Fahrenheit y Celsius fijaron puntos que cualquiera podía reproducir, como el hielo que se funde. Medir temperatura se volvió comparable entre laboratorios.',
      pregunta: '¿Cómo acordarían dos personas lejanas qué es «20 grados»?',
      fuente: { titulo: 'NIST — Kelvin: History', url: 'https://www.nist.gov/si-redefinition/kelvin/kelvin-history' },
    },
    ideas: [escalas, mezcla, especifico, fase, dilatacion, transferencia],
  };
});
