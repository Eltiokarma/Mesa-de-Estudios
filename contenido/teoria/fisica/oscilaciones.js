/*
 * Teoría de «Movimiento armónico simple» (fisica.oscilaciones). Molde de docs/teoria.md; forma copiada de
 * contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 9), precisiones de física del expediente y
 * docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md (códigos O1–O4).
 * Colores (regla 4): x posición turquesa (c-i), v velocidad naranja (c-o), a aceleración verde (c-d),
 * t y T tiempo y período rojo (c-h). m, k, ω, L, g, K, U y E van en tinta.
 * Estado: completa (14 nov 2026): cinco ideas que cubren los cinco temas del catálogo.
 * Códigos nuevos (hipótesis, sin fuente empírica): OS-EXTREMO, OS-AFUERA, OS-CONSTANTE, OS-SIGNO, OS-LINEAL,
 * OS-MEDIO, OS-CENTRO-QUIETO, OS-OMEGA, OS-SIN-RAIZ, OS-INV, OS-VERTICAL, OS-MITAD, OS-CENTRO, OS-TODO.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver que en el MAS la aceleración apunta al centro y crece con la distancia, y qué decide el período.
 *   Persona y condiciones: postulante de 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: halla a, vmáx, el período de un resorte o un péndulo y dónde K = U.
 *   Orden de atención: 1.º el bloque o la gráfica · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué en el extremo, donde se detiene, la aceleración es la mayor?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-i', t: 'x' }, v = { v: 'c-o', t: 'v' }, a = { v: 'c-d', t: 'a' }, t = { v: 'c-h', t: 't' }, T = { v: 'c-h', t: 'T' };
  const PI = Math.PI;
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
  const muestras = (fn, x0, x1, n = 61) => Array.from({ length: n }, (_, i) => { const u = x0 + (x1 - x0) * i / (n - 1); return [u, fn(u)]; });

  // ---------- Idea 1: la aceleración apunta al centro ----------
  // Cambia: dónde está el bloque · Permanece: el resorte (k = 50 N/m), la masa (0,5 kg) y la amplitud 0,2 m ·
  // Progresa: la flecha de a, que crece al alejarse del centro · Se reserva: el extremo, donde v = 0 ·
  // Debe verse: a apunta siempre al equilibrio y es proporcional a x; en el extremo es máxima aunque v sea 0.
  const K1 = 50, M1 = 0.5, A1 = 0.2, W1 = Math.sqrt(K1 / M1);
  const bloque = (xx, o = {}) => ({
    A: A1, unidad: 'm', x: xx, v: o.sinV ? null : -W1 * Math.sqrt(Math.max(0, A1 * A1 - xx * xx)), a: o.sinA ? null : -W1 * W1 * xx,
    escalaV: 40, escalaA: 4, colores: { x: 'i', v: 'o', a: 'd' },
    textoA: o.sinA ? undefined : `a = ${f(-W1 * W1 * xx, 0)} m/s²`, marcas: o.marcas,
  });
  const centro = {
    id: 'aceleracion-al-centro',
    titulo: 'La aceleración apunta al centro',
    temas: ['Movimiento periódico y oscilatorio'],
    pieza: 'fis-resorte',
    juega: {
      consigna: 'El bloque oscila entre −0,2 m y +0,2 m, y ahora va hacia la izquierda. Detenlo en distintas posiciones y mira sus flechas.',
      voz: 'Fíjate hacia dónde apunta la flecha verde en cada lado.',
      controles: [{ id: 'x', etiqueta: 'x', color: 'c-i', min: -0.15, max: 0.15, paso: 0.05, inicio: 0.1, unidad: 'm', decimales: 2 }],
      dibujo: val => ({ datos: bloque(val.x), estado: {} }),
      lectura: val => [a, ` = ${f(-W1 * W1 * val.x, 0)} m/s² · rapidez ${f(W1 * Math.sqrt(A1 * A1 - val.x * val.x), 2)} m/s`],
      minimo: 3,
    },
    predice: {
      pregunta: 'El bloque llega al extremo derecho, x = +0,2 m, y se detiene un instante antes de volver. Justo ahí, su aceleración es…',
      opciones: [
        { id: 'c', texto: 'la mayor, hacia el centro', correcta: true },
        { id: 'cero', texto: 'cero, porque está detenido', error: 'OS-EXTREMO', siFuera: 'v = 0 es cierto. Pero el resorte está más estirado que nunca y tira con más fuerza.' },
        { id: 'afuera', texto: 'la mayor, hacia afuera', error: 'OS-AFUERA', siFuera: 'Hacia afuera iba la velocidad antes de llegar. El resorte tira hacia la pared.' },
        { id: 'igual', texto: 'la misma que en el centro', error: 'OS-CONSTANTE', siFuera: 'Igual sería cierto con fuerza constante. El resorte tira más cuanto más se estira.' },
      ],
      dibujo: { datos: bloque(0.1), estado: {} },
      revelar: { datos: Object.assign(bloque(0.2), { v: 0, textoV: 'v = 0' }), estado: {} },
      coincide: 'Coincide: en el extremo el resorte tira más fuerte: a = −100 · 0,2 = −20 m/s².',
    },
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: -0.2, max: 0.2, paso: 0.1, nombre: 'x', unidad: 'm', decimales: 1, color: 'i' },
        y: { min: -20, max: 20, paso: 10, nombre: 'a', unidad: 'm/s²', decimales: 0, color: 'd' },
        curvas: [{ puntos: [[-0.2, 20], [0.2, -20]], color: 'd', desde: 2 }],
        puntos: [{ x: 0.1, y: -10, color: 'd', rotulo: '−10', desde: 1 }, { x: 0.2, y: -20, color: 'd', rotulo: '−20', desde: 3 }, { x: 0, y: 0, color: 'd', rotulo: 'centro: 0', desde: 3 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'En x = 0,1 m el resorte tira con F = −k x = −5 N.', ecuacion: [a, ' = ', { frac: ['−5', '0,5'] }, ' = −10 m/s²'] },
        { estado: { corte: 2 }, texto: 'a es proporcional a x y de signo contrario: una recta.', ecuacion: [a, ' = −', { frac: ['k', 'm'] }, ' ', x, ' = −100 ', x] },
        { estado: { corte: 3 }, texto: 'En el centro a = 0; en los extremos, la mayor.', ecuacion: [{ sub: [a, 'máx'] }, ' = 100 · 0,2 = 20 m/s²'] },
        { estado: { corte: 3 }, texto: 'Una fuerza que siempre vuelve al centro produce un vaivén: un MAS.', ecuacion: ['ω = √(k/m) = 10 rad/s'] },
      ],
    },
    regla: {
      texto: 'En un movimiento armónico simple la aceleración apunta siempre al equilibrio y es proporcional a la distancia a él.',
      ecuacion: [a, ' = −', { sup: ['ω', '2'] }, ' ', x, '   ·   ', { sup: ['ω', '2'] }, ' = ', { frac: ['k', 'm'] }],
      condicion: 'x se mide desde el equilibrio; resorte ideal y sin rozamiento.',
    },
    ahoraTu: {
      pieza: 'fis-resorte',
      generar(s) {
        const r = azar(s), k = r.de([20, 40, 50, 80, 100]), m = r.de([0.2, 0.5, 1, 2]), xx = r.de([-0.15, -0.1, -0.05, 0.05, 0.1, 0.2]);
        const ac = -k * xx / m;
        return {
          pregunta: ['Un bloque de ', f(m), ` kg oscila unido a un resorte de k = ${f(k)} N/m. ¿Qué aceleración tiene cuando está en `, x, ` = ${f(xx)} m?`],
          dibujo: { datos: { A: 0.2, unidad: 'm', x: xx, colores: { x: 'i', v: 'o', a: 'd' } }, estado: {} },
          opciones: opciones(ac, [
            { id: 'signo', valor: -ac, error: 'OS-SIGNO', siFuera: 'El valor está bien; el signo no: a apunta hacia el centro.' },
            { id: 'sin-m', valor: -k * xx, error: 'OS-OMEGA', siFuera: 'Esa es la fuerza del resorte; falta dividir entre la masa.' },
            { id: 'por-m', valor: -k * xx * m, error: 'OS-OMEGA', siFuera: 'Eso multiplica por la masa; a = F / m.' },
          ], n => `${f(n, 1)} m/s²`),
          solucion: { texto: 'Fuerza del resorte entre la masa, hacia el centro.', ecuacion: [a, ` = −${f(k)} · (${f(xx)}) / ${f(m)} = ${f(ac, 1)} m/s²`], dibujo: { datos: { A: 0.2, unidad: 'm', x: xx, a: ac, escalaA: Math.min(4, 80 / Math.abs(ac)), textoA: `${f(ac, 1)} m/s²`, colores: { x: 'i', v: 'o', a: 'd' } }, estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: ecuaciones y gráficas del MAS ----------
  // Cambia: la amplitud y el período · Permanece: la forma coseno, que empieza en el extremo ·
  // Progresa: el tiempo sobre la gráfica · Se reserva: el instante T/4 ·
  // Debe verse: donde x–t es más empinada (en x = 0) la rapidez es máxima; en las crestas, cero.
  const ejeXt = (A, P, extra = {}) => Object.assign({
    x: { min: 0, max: 4, paso: 0.5, cada: 2, nombre: 't', unidad: 's', decimales: 1, color: 'h' },
    y: { min: -0.3, max: 0.3, paso: 0.1, nombre: 'x', unidad: 'm', decimales: 1, color: 'i' },
    curvas: [{ puntos: muestras(tt => A * Math.cos(2 * PI * tt / P), 0, 4, 81), color: 'i' }],
  }, extra);
  const graficas = {
    id: 'graficas-mas',
    titulo: 'La posición sigue un coseno',
    temas: ['Ecuaciones y gráficas del MAS'],
    pieza: 'ejes',
    juega: {
      consigna: 'El bloque se suelta desde el extremo en t = 0. Cambia la amplitud y el período, y mira la gráfica de la posición.',
      voz: 'Busca dónde la curva es más empinada.',
      controles: [
        { id: 'A', etiqueta: 'A', color: 'c-i', min: 0.1, max: 0.3, paso: 0.05, inicio: 0.2, unidad: 'm', decimales: 2 },
        { id: 'P', etiqueta: 'T', color: 'c-h', min: 1, max: 4, paso: 0.5, inicio: 2, unidad: 's', decimales: 1 },
      ],
      dibujo: val => ({ datos: ejeXt(val.A, val.P, { puntos: [{ x: val.P, y: val.A, color: 'h', rotulo: `T = ${f(val.P, 1)} s`, guias: true }] }), estado: {} }),
      lectura: val => [{ sub: [v, 'máx'] }, ` = Aω = ${f(val.A * 2 * PI / val.P)} m/s`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Con ', x, ' = A cos(ω', t, '), el bloque sale del extremo +A. Un cuarto de período después, en ', t, ' = T/4, ¿dónde está y cómo se mueve?'],
      opciones: [
        { id: 'c', texto: 'En x = 0, con la mayor rapidez', correcta: true },
        { id: 'lineal', texto: 'En x = A/2, a media rapidez', error: 'OS-LINEAL', siFuera: 'A/2 sería cierto si avanzara a velocidad constante. Empieza lento y acelera.' },
        { id: 'medio', texto: 'En −A, detenido', error: 'OS-MEDIO', siFuera: 'Eso pasa en T/2, a mitad del período, no en un cuarto.' },
        { id: 'quieto', texto: 'En x = 0, detenido', error: 'OS-CENTRO-QUIETO', siFuera: 'En el centro la fuerza es cero, cierto. Pero ahí llega con toda su rapidez.' },
      ],
      dibujo: { datos: ejeXt(0.2, 2), estado: {} },
      revelar: { datos: ejeXt(0.2, 2, { puntos: [{ x: 0.5, y: 0, color: 'i', rotulo: 'T/4: x = 0', guias: true }, { x: 0, y: 0.2, color: 'i', rotulo: '+A' }] }), estado: {} },
      coincide: 'Coincide: en T/4 la curva cruza el eje y es más empinada: ahí la rapidez es máxima.',
    },
    mira: {
      datos: ejeXt(0.2, 2, { puntos: [{ x: 0, y: 0.2, color: 'i', rotulo: '+A: v = 0', desde: 1 }, { x: 0.5, y: 0, color: 'i', rotulo: 'x = 0: v máx', desde: 2 }, { x: 1, y: -0.2, color: 'i', rotulo: '−A', desde: 3 }, { x: 2, y: 0.2, color: 'h', rotulo: 'T = 2 s', guias: true, desde: 4 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'En t = 0 está en +A: la curva es plana, v = 0.', ecuacion: [x, ' = A cos(ω', t, ')'] },
        { estado: { corte: 2 }, texto: 'En T/4 cruza el centro con la pendiente más grande.', ecuacion: [{ sub: [v, 'máx'] }, ' = A ω'] },
        { estado: { corte: 3 }, texto: 'En T/2 llega a −A y se detiene otra vez.', ecuacion: [x, ' = −A'] },
        { estado: { corte: 4 }, texto: 'En T vuelve al inicio: el movimiento se repite.', ecuacion: ['ω = ', { frac: ['2π', T] }, ' = π rad/s'] },
      ],
    },
    regla: {
      texto: 'En el MAS la posición es un coseno del tiempo. La rapidez es máxima en el centro y la aceleración, en los extremos.',
      ecuacion: [x, ' = A cos(ω', t, ' + φ)   ·   ', { sub: [v, 'máx'] }, ' = Aω   ·   ', { sub: [a, 'máx'] }, ' = A', { sup: ['ω', '2'] }, '   ·   ω = ', { frac: ['2π', T] }],
      condicion: 'φ fija dónde empieza; con φ = 0 sale del extremo +A en t = 0.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), A = r.de([0.1, 0.2, 0.25, 0.3]), P = r.de([1, 2, 4]), w = 2 * PI / P, pide = s % 2 ? 'v' : 'a';
        const val = pide === 'v' ? A * w : A * w * w;
        return {
          pregunta: pide === 'v'
            ? ['Un bloque oscila con amplitud ', f(A), ' m y período ', T, ` = ${f(P)} s. ¿Cuál es su rapidez máxima?`]
            : ['Un bloque oscila con amplitud ', f(A), ' m y período ', T, ` = ${f(P)} s. ¿Cuál es el valor máximo de su aceleración?`],
          dibujo: { datos: ejeXt(A, P), estado: {} },
          opciones: opciones(val, pide === 'v' ? [
            { id: 'sin-2pi', valor: A / P, error: 'OS-OMEGA', siFuera: 'Eso usa 1/T en vez de ω = 2π/T.' },
            { id: 'acel', valor: A * w * w, error: 'OS-OMEGA', siFuera: 'Esa es la aceleración máxima, Aω².' },
            { id: 'por-t', valor: A * P, error: 'OS-INV', siFuera: 'Eso multiplica por T; con más período, va más lento.' },
          ] : [
            { id: 'vel', valor: A * w, error: 'OS-OMEGA', siFuera: 'Esa es la rapidez máxima, Aω.' },
            { id: 'sin-2pi', valor: A / (P * P), error: 'OS-OMEGA', siFuera: 'Eso usa 1/T en vez de ω = 2π/T.' },
            { id: 'sin-cuad', valor: A * w * 2, error: 'OS-SIN-RAIZ', siFuera: 'ω va al cuadrado, no multiplicado por 2.' },
          ], n => `${f(n)} ${pide === 'v' ? 'm/s' : 'm/s²'}`),
          solucion: { texto: pide === 'v' ? 'Primero ω = 2π/T; la rapidez máxima es Aω.' : 'Primero ω = 2π/T; la aceleración máxima es Aω².', ecuacion: ['ω = ', f(w), ' rad/s   ·   ', pide === 'v' ? `${f(A)} · ${f(w)} = ${f(val)} m/s` : `${f(A)} · ${f(w)}² = ${f(val)} m/s²`] },
        };
      },
    },
  };

  // ---------- Idea 3: el período del resorte ----------
  // Cambia: la masa y el resorte · Permanece: la forma de la curva T–m ·
  // Progresa: el punto sobre la curva · Se reserva: soltar desde el doble de lejos, y colgarlo vertical ·
  // Debe verse: el período depende de m y k, no de la amplitud.
  const periodoR = (m, k) => 2 * PI * Math.sqrt(m / k);
  const ejeTm = (k, extra = {}) => Object.assign({
    x: { min: 0, max: 2, paso: 0.5, nombre: 'm', unidad: 'kg', decimales: 1 },
    y: { min: 0, max: 2, paso: 0.5, nombre: 'T', unidad: 's', decimales: 1, color: 'h' },
    curvas: [{ puntos: muestras(m => periodoR(m, k), 0, 2, 41), color: 'h', rotulo: `k = ${f(k)} N/m`, en: [0.15, 1.75] }],
  }, extra);
  const resorteT = {
    id: 'periodo-resorte',
    titulo: 'El período no depende de A',
    temas: ['Masa-resorte horizontal y vertical'],
    pieza: 'ejes',
    juega: {
      consigna: 'Cuelga distintas masas de un resorte, o cambia el resorte. Lee cuánto tarda una oscilación completa.',
      voz: 'Mira cuánto crece T cuando la masa se cuadruplica.',
      controles: [
        { id: 'm', etiqueta: 'm', min: 0.25, max: 2, paso: 0.25, inicio: 0.5, unidad: 'kg', decimales: 2 },
        { id: 'k', etiqueta: 'Resorte', opciones: [{ valor: 20, texto: 'k = 20 N/m' }, { valor: 80, texto: 'k = 80 N/m' }], inicio: 20 },
      ],
      dibujo: val => ({ datos: ejeTm(val.k, { puntos: [{ x: val.m, y: periodoR(val.m, val.k), color: 'h', rotulo: `${f(periodoR(val.m, val.k))} s`, guias: true }] }), estado: {} }),
      lectura: val => [T, ` = 2π √(${f(val.m)}/${f(val.k)}) = ${f(periodoR(val.m, val.k))} s`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un bloque unido a un resorte oscila con período de 1 s si se suelta desde 5 cm. Si se suelta desde 10 cm, ¿cuánto dura cada oscilación?',
      opciones: [
        { id: 'c', texto: '1 s, igual', correcta: true },
        { id: 'doble', texto: '2 s: recorre el doble', error: 'O1', siFuera: 'Recorre el doble, cierto. Pero también va más rápido: tarda lo mismo.' },
        { id: 'raiz', texto: 'Unos 1,4 s', error: 'O2', siFuera: 'La raíz aparece con la masa, no con la amplitud.' },
        { id: 'mitad', texto: '0,5 s: el resorte tira más', error: 'O2', siFuera: 'Tira más fuerte, cierto, pero también tiene más camino: se compensa justo.' },
      ],
      dibujo: { datos: ejeXt(0.05, 1, { y: { min: -0.1, max: 0.1, paso: 0.05, nombre: 'x', unidad: 'm', decimales: 2, color: 'i' }, x: { min: 0, max: 2, paso: 0.5, nombre: 't', unidad: 's', decimales: 1, color: 'h' }, curvas: [{ puntos: muestras(tt => 0.05 * Math.cos(2 * PI * tt), 0, 2, 81), color: 'i', rotulo: '5 cm', en: [0.05, 0.05] }] }), estado: {} },
      revelar: { datos: ejeXt(0.05, 1, { y: { min: -0.1, max: 0.1, paso: 0.05, nombre: 'x', unidad: 'm', decimales: 2, color: 'i' }, x: { min: 0, max: 2, paso: 0.5, nombre: 't', unidad: 's', decimales: 1, color: 'h' },
        curvas: [{ puntos: muestras(tt => 0.05 * Math.cos(2 * PI * tt), 0, 2, 81), color: 'i', rotulo: '5 cm', en: [0.05, 0.05] }, { puntos: muestras(tt => 0.1 * Math.cos(2 * PI * tt), 0, 2, 81), color: 'i', discontinua: true, rotulo: '10 cm', en: [1.5, -0.1] }],
        puntos: [{ x: 1, y: 0.1, color: 'h', rotulo: 'T = 1 s', guias: true }] }), estado: {} },
      coincide: 'Coincide: las dos curvas vuelven a su cresta al mismo tiempo; solo cambia su altura.',
    },
    mira: {
      datos: ejeTm(20, { puntos: [{ x: 0.5, y: periodoR(0.5, 20), color: 'h', rotulo: `${f(periodoR(0.5, 20))} s`, guias: true, desde: 1 }, { x: 2, y: periodoR(2, 20), color: 'h', rotulo: `${f(periodoR(2, 20))} s`, guias: true, desde: 2 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Con 0,5 kg y k = 20 N/m: ω = √(k/m) = √40.', ecuacion: [T, ' = 2π √(0,5/20) ≈ 0,99 s'] },
        { estado: { corte: 2 }, texto: 'Con 4 veces la masa, el período solo se duplica.', ecuacion: [T, ' = 2π √(2/20) ≈ 1,99 s'] },
        { estado: { corte: 2 }, texto: 'La amplitud no aparece en la fórmula.', ecuacion: [T, ' = 2π ', { raiz: [{ frac: ['m', 'k'] }] }] },
        { estado: { corte: 2 }, texto: 'Colgado vertical, el equilibrio baja mg/k; el período es el mismo.', ecuacion: ['Δy = ', { frac: ['m g', 'k'] }] },
      ],
    },
    regla: {
      texto: 'El período de un bloque unido a un resorte depende de la masa y de la rigidez del resorte, no de la amplitud ni de si está horizontal o colgado.',
      ecuacion: [T, ' = 2π ', { raiz: [{ frac: ['m', 'k'] }] }, '   ·   colgado: el equilibrio baja ', { frac: ['m g', 'k'] }],
      condicion: 'resorte ideal, sin masa propia y sin rozamiento. Colgado, x se mide desde el nuevo equilibrio.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), m = r.de([0.1, 0.4, 0.9, 1.6, 2.5]), k = r.de([10, 40, 90, 160]);
        if (s % 2 === 0) {
          const P = periodoR(m, k);
          return {
            pregunta: ['Un bloque de ', f(m), ` kg oscila unido a un resorte de k = ${f(k)} N/m. ¿Cuál es su período? (usa π ≈ 3,14)`],
            opciones: opciones(P, [
              { id: 'inv', valor: 2 * PI * Math.sqrt(k / m), error: 'OS-INV', siFuera: 'Ese cociente está al revés: más masa, más lento.' },
              { id: 'sin-raiz', valor: 2 * PI * m / k, error: 'OS-SIN-RAIZ', siFuera: 'Eso olvida la raíz cuadrada.' },
              { id: 'sin-2pi', valor: Math.sqrt(m / k), error: 'OS-OMEGA', siFuera: 'Eso es 1/ω; falta multiplicar por 2π.' },
            ], n => `${f(n)} s`),
            solucion: { texto: 'Raíz de masa entre constante, por 2π.', ecuacion: [T, ` = 2π √(${f(m)}/${f(k)}) = ${f(P)} s`] },
          };
        }
        const dy = m * 10 / k;
        return {
          pregunta: ['Se cuelga un bloque de ', f(m), ` kg de un resorte vertical de k = ${f(k)} N/m. ¿Cuánto baja hasta su nuevo equilibrio? (g = 10 m/s²)`],
          opciones: opciones(dy * 100, [
            { id: 'sin-g', valor: m / k * 100, error: 'OS-VERTICAL', siFuera: 'Eso olvida que lo que estira el resorte es el peso, mg.' },
            { id: 'inv', valor: k / (m * 10) * 100, error: 'OS-INV', siFuera: 'Ese cociente está al revés.' },
            { id: 'doble', valor: 2 * dy * 100, error: 'OS-VERTICAL', siFuera: 'Ese es el punto más bajo si se suelta de golpe; el equilibrio está a la mitad.' },
          ], n => `${f(n, 1)} cm`),
          solucion: { texto: 'En el equilibrio el resorte sostiene el peso: k Δy = m g.', ecuacion: [`Δy = ${f(m)} · 10 / ${f(k)} = ${f(dy, 3)} m`] },
        };
      },
    },
  };

  // ---------- Idea 4: el péndulo simple ----------
  // Cambia: el largo del hilo y el lugar (la Tierra o la Luna) · Permanece: ángulos pequeños ·
  // Progresa: el punto sobre la curva T–L · Se reserva: una bolita de doble masa ·
  // Debe verse: el período del péndulo depende del largo y de g, no de la masa.
  const periodoP = (L, g) => 2 * PI * Math.sqrt(L / g);
  const ejeTL = (g, extra = {}) => Object.assign({
    x: { min: 0, max: 2, paso: 0.5, nombre: 'L', unidad: 'm', decimales: 1 },
    y: { min: 0, max: 8, paso: 2, nombre: 'T', unidad: 's', decimales: 0, color: 'h' },
    curvas: [{ puntos: muestras(L => periodoP(L, g), 0, 2, 41), color: 'h', rotulo: g === 10 ? 'Tierra' : 'Luna', en: [0.3, periodoP(0.3, g) + 0.4] }],
  }, extra);
  const pendulo = {
    id: 'pendulo',
    titulo: 'El péndulo no mira la masa',
    temas: ['Péndulo simple'],
    pieza: 'ejes',
    juega: {
      consigna: 'Cambia el largo del hilo de un péndulo y llévalo a la Luna. Lee cuánto tarda una ida y vuelta.',
      voz: 'Compara un hilo de 0,5 m con uno de 2 m.',
      controles: [
        { id: 'L', etiqueta: 'L', min: 0.25, max: 2, paso: 0.25, inicio: 1, unidad: 'm', decimales: 2 },
        { id: 'g', etiqueta: 'Lugar', opciones: [{ valor: 10, texto: 'Tierra' }, { valor: 1.6, texto: 'Luna' }], inicio: 10 },
      ],
      dibujo: val => ({ datos: ejeTL(val.g, { puntos: [{ x: val.L, y: periodoP(val.L, val.g), color: 'h', rotulo: `${f(periodoP(val.L, val.g))} s`, guias: true }] }), estado: {} }),
      lectura: val => [T, ` = 2π √(${f(val.L)}/${f(val.g)}) = ${f(periodoP(val.L, val.g))} s`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un péndulo de 1 m con una bolita de 50 g tarda 2 s en ir y volver. Se cambia la bolita por una de 100 g, con el mismo hilo. ¿Cuánto tarda ahora?',
      opciones: [
        { id: 'c', texto: '2 s, igual', correcta: true },
        { id: 'mas', texto: 'Más de 2 s: pesa más', error: 'O3', siFuera: 'Pesa más, cierto, pero también cuesta más moverla: las dos cosas se compensan.' },
        { id: 'menos', texto: 'Menos de 2 s: cae más rápido', error: 'D5', siFuera: 'Sin aire, una bolita pesada no cae más rápido que una liviana.' },
      ],
      dibujo: { datos: ejeTL(10, { curvas: [] }), estado: {} },
      revelar: { datos: ejeTL(10, { puntos: [{ x: 1, y: periodoP(1, 10), color: 'h', rotulo: '50 g y 100 g: 1,99 s', guias: true }] }), estado: {} },
      coincide: 'Coincide: la masa no está en la fórmula; el período sale del largo y de g.',
    },
    mira: {
      datos: ejeTL(10, { puntos: [{ x: 0.25, y: periodoP(0.25, 10), color: 'h', rotulo: `${f(periodoP(0.25, 10))} s`, guias: true, desde: 1 }, { x: 1, y: periodoP(1, 10), color: 'h', rotulo: `${f(periodoP(1, 10))} s`, guias: true, desde: 2 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Con 25 cm de hilo, el péndulo tarda casi 1 s.', ecuacion: [T, ' = 2π √(0,25/10) ≈ 0,99 s'] },
        { estado: { corte: 2 }, texto: 'Con 4 veces el largo, tarda el doble.', ecuacion: [T, ' = 2π √(1/10) ≈ 1,99 s'] },
        { estado: { corte: 2 }, texto: 'En la Luna, con g seis veces menor, tardaría unas 2,5 veces más.', ecuacion: [T, ' = 2π ', { raiz: [{ frac: ['L', 'g'] }] }] },
      ],
    },
    regla: {
      texto: 'Para oscilaciones pequeñas, el período de un péndulo depende solo del largo del hilo y de la gravedad del lugar.',
      ecuacion: [T, ' = 2π ', { raiz: [{ frac: ['L', 'g'] }] }],
      condicion: 'ángulos pequeños (menos de unos 10°), hilo sin masa e inextensible; L va del punto de giro al centro de la bolita.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), L = r.de([0.4, 0.9, 1.6, 2.5, 3.6]), g = 10;
        if (s % 2 === 0) {
          const P = periodoP(L, g);
          return {
            pregunta: ['¿Cuál es el período de un péndulo de ', f(L), ' m de largo? (g = 10 m/s², π ≈ 3,14)'],
            opciones: opciones(P, [
              { id: 'inv', valor: 2 * PI * Math.sqrt(g / L), error: 'OS-INV', siFuera: 'Ese cociente está al revés: hilo más largo, más lento.' },
              { id: 'sin-raiz', valor: 2 * PI * L / g, error: 'OS-SIN-RAIZ', siFuera: 'Eso olvida la raíz cuadrada.' },
              { id: 'sin-2pi', valor: Math.sqrt(L / g), error: 'OS-OMEGA', siFuera: 'Falta multiplicar por 2π.' },
            ], n => `${f(n)} s`),
            solucion: { texto: 'Raíz de largo entre g, por 2π.', ecuacion: [T, ` = 2π √(${f(L)}/10) = ${f(P)} s`] },
          };
        }
        const q = r.de([4, 9, 16]);
        return {
          pregunta: ['Un péndulo tiene período ', T, `. Si su hilo se hace ${f(q)} veces más largo, ¿cuál es su nuevo período?`],
          opciones: opciones(Math.sqrt(q), [
            { id: 'lineal', valor: q, error: 'OS-SIN-RAIZ', siFuera: 'El período crece con la raíz del largo, no en proporción.' },
            { id: 'inv', valor: 1 / Math.sqrt(q), error: 'OS-INV', siFuera: 'Con más largo, el péndulo es más lento, no más rápido.' },
            { id: 'igual', valor: 1, error: 'O4', siFuera: 'El largo sí cambia el período.' },
          ], n => `${f(n, 2)} T`),
          solucion: { texto: 'T va con la raíz del largo.', ecuacion: [`T' = √${f(q)} · T = ${f(Math.sqrt(q))} T`] },
        };
      },
    },
  };

  // ---------- Idea 5: la energía en el MAS ----------
  // Cambia: la posición del bloque · Permanece: la energía total (1 J) ·
  // Progresa: el reparto entre U, que crece con x², y K, lo que falta · Se reserva: el punto donde K = U ·
  // Debe verse: la suma no cambia; U es una parábola, y K = U no ocurre a mitad de camino.
  const K5 = 50, A5 = 0.2, E5 = 0.5 * K5 * A5 * A5;
  const ejeE = (extra = {}) => Object.assign({
    x: { min: -0.2, max: 0.2, paso: 0.1, nombre: 'x', unidad: 'm', decimales: 1, color: 'i' },
    y: { min: 0, max: 1.2, paso: 0.4, nombre: 'E', unidad: 'J', decimales: 1 },
    curvas: [
      { puntos: muestras(xx => 0.5 * K5 * xx * xx, -0.2, 0.2, 41), rotulo: 'U', en: [0.17, 0.72] },
      { puntos: muestras(xx => E5 - 0.5 * K5 * xx * xx, -0.2, 0.2, 41), discontinua: true, rotulo: 'K', en: [-0.1, 0.82] },
      { puntos: [[-0.2, E5], [0.2, E5]], rotulo: 'E = 1 J', en: [-0.19, 1.1] },
    ],
  }, extra);
  const energia = {
    id: 'energia-mas',
    titulo: 'La energía se reparte, no cambia',
    temas: ['Energía en el MAS'],
    pieza: 'ejes',
    juega: {
      consigna: 'Un resorte de k = 50 N/m oscila con amplitud 0,2 m: su energía es 1 J. Mueve el bloque y mira el reparto.',
      voz: 'Lee las dos energías y súmalas en cada posición.',
      controles: [{ id: 'x', etiqueta: 'x', color: 'c-i', min: -0.2, max: 0.2, paso: 0.05, inicio: 0.1, unidad: 'm', decimales: 2 }],
      dibujo: val => { const U = 0.5 * K5 * val.x * val.x; return { datos: ejeE({ puntos: [{ x: val.x, y: U, rotulo: `U = ${f(U, 2)}`, guias: true }, { x: val.x, y: E5 - U, rotulo: `K = ${f(E5 - U, 2)}` }] }), estado: {} }; },
      lectura: val => { const U = 0.5 * K5 * val.x * val.x; return [`U = ${f(U, 2)} J · K = ${f(E5 - U, 2)} J · suma 1 J`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['El mismo bloque oscila entre −0,2 m y +0,2 m. ¿En qué posición su energía cinética es igual a su energía potencial?'],
      opciones: [
        { id: 'c', texto: 'x = ±0,14 m', correcta: true },
        { id: 'mitad', texto: 'x = ±0,1 m, a mitad de camino', error: 'OS-MITAD', siFuera: 'La mitad del camino sería cierta si U creciera en proporción a x. Crece con x².' },
        { id: 'centro', texto: 'x = 0, en el centro', error: 'OS-CENTRO', siFuera: 'En el centro toda la energía es cinética: U = 0.' },
        { id: 'extremo', texto: 'x = ±0,2 m, en los extremos', error: 'OS-TODO', siFuera: 'En los extremos toda es potencial: K = 0.' },
      ],
      dibujo: { datos: (d => Object.assign(d, { curvas: [d.curvas[0], d.curvas[2]] }))(ejeE()), estado: {} },
      revelar: { datos: ejeE({ puntos: [{ x: 0.1414, y: 0.5, rotulo: 'K = U = 0,5 J', guias: true }, { x: -0.1414, y: 0.5 }] }), estado: {} },
      coincide: 'Coincide: U = 0,5 J pide x² = 0,02 m², o sea x = 0,2/√2 ≈ 0,14 m.',
    },
    mira: {
      datos: ejeE({ puntos: [{ x: 0.2, y: 1, rotulo: 'U', desde: 1 }, { x: 0, y: 1, rotulo: 'todo K', desde: 2 }, { x: 0.1414, y: 0.5, rotulo: 'mitad y mitad', guias: true, desde: 3 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'En el extremo el bloque está quieto: toda la energía es del resorte.', ecuacion: ['E = ½ k ', { sup: ['A', '2'] }, ' = ½ · 50 · 0,2² = 1 J'] },
        { estado: { corte: 2 }, texto: 'En el centro el resorte no está estirado: toda es cinética.', ecuacion: ['½ m ', { sup: [{ sub: [v, 'máx'] }, '2'] }, ' = 1 J'] },
        { estado: { corte: 3 }, texto: 'U crece con x²: la mitad de la energía está a 0,14 m.', ecuacion: ['½ · 50 · ', { sup: [x, '2'] }, ' = 0,5   →   ', x, ' = ', { frac: ['A', '√2'] }] },
      ],
    },
    regla: {
      texto: 'En el MAS la energía total no cambia: se reparte entre la del resorte, que crece con x², y la cinética del bloque.',
      ecuacion: ['½ k ', { sup: ['A', '2'] }, ' = ½ k ', { sup: [x, '2'] }, ' + ½ m ', { sup: [v, '2'] }],
      condicion: 'sin rozamiento ni ayuda externa; x desde el equilibrio. Con roce, la amplitud se apaga.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), k = r.de([20, 50, 80, 200]), m = r.de([0.2, 0.5, 2]), A = r.de([0.1, 0.2, 0.3]), xx = A * r.de([0.5, 0.6, 0.8]);
        const vv = Math.sqrt(k / m * (A * A - xx * xx));
        return {
          pregunta: ['Un bloque de ', f(m), ` kg oscila con un resorte de k = ${f(k)} N/m y amplitud ${f(A)} m. ¿Qué rapidez tiene en `, x, ` = ${f(xx, 2)} m?`],
          opciones: opciones(vv, [
            { id: 'lineal', valor: Math.sqrt(k / m) * (A - xx), error: 'OS-MITAD', siFuera: 'Eso resta A − x antes de elevar; la energía va con los cuadrados.' },
            { id: 'max', valor: Math.sqrt(k / m) * A, error: 'OS-TODO', siFuera: 'Esa es la rapidez en el centro, la máxima.' },
            { id: 'sin-raiz', valor: k / m * (A * A - xx * xx), error: 'OS-SIN-RAIZ', siFuera: 'Eso es v²; falta la raíz.' },
          ], n => `${f(n)} m/s`),
          solucion: { texto: 'La energía del extremo se reparte: lo que no es U, es K.', ecuacion: [v, ` = √(${f(k)}/${f(m)} · (${f(A)}² − ${f(xx, 2)}²)) = ${f(vv)} m/s`] },
        };
      },
    },
  };

  return {
    unidad: 'fisica.oscilaciones',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-resorte.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Huygens construyó relojes de péndulo en la década de 1650 y publicó su estudio matemático en 1673. Para medir bien había que reconocer un límite: un péndulo que se abre mucho no repite exactamente el período de uno que se abre poco. Un vaivén regular se volvió una forma de medir el tiempo.',
      pregunta: '¿Por qué un reloj de péndulo puede contar segundos?',
      fuente: { titulo: 'APS News — Huygens patents the first pendulum clock', url: 'https://www.aps.org/apsnews/2017/06/huygens-patents-first-pendulum-clock' },
    },
    ideas: [centro, graficas, resorteT, pendulo, energia],
  };
});
