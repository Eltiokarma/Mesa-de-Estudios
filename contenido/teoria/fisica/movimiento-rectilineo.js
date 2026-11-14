/*
 * Teoría de «MRU, MRUV y caída libre» (fisica.movimiento-rectilineo). Molde de docs/teoria.md: es la unidad de
 * referencia; las demás copian su forma, no sus temas.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 2) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Colores (regla 4): x turquesa (c-i, el de la pista), v naranja (c-o), a verde (c-d), t rojo (c-h).
 * Estado: completa (14 nov 2026): cinco ideas que cubren los siete temas del catálogo.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: cinco relaciones del movimiento en una recta, cada una jugada antes de preguntarla.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: predice dónde está un móvil, lee pendiente y área en v–t, y halla un encuentro.
 *   Orden de atención: 1.º la figura que se mueve · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué la velocidad, la aceleración y la posición no son la misma cosa?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-i', t: 'x' }, v = { v: 'c-o', t: 'v' }, a = { v: 'c-d', t: 'a' }, t = { v: 'c-h', t: 't' };
  const x0 = { sub: [x, '0'] }, v0 = { sub: [v, '0'] };
  const dx = ['Δ', x], dv = ['Δ', v], dt = ['Δ', t];
  // Azar con semilla para «Ahora tú» (el mismo de nucleo/azar.js, en corto).
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    return r;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un valor se descartan.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops;
  }

  // ---------- Idea 1: marcas iguales, rapidez constante (MRU) ----------
  const LARGO = 40;
  const marcasMRU = (xi, vi, n = 5) => Array.from({ length: n + 1 }, (_, k) => xi + vi * k).filter(m => m <= LARGO);
  const pistaMRU = (xi, vi, conMarcas = true) => {
    const ms = conMarcas ? marcasMRU(xi, vi) : [];
    return { datos: { largo: LARGO, cada: 10, carriles: [{ x: ms.length ? ms[ms.length - 1] : xi, marcas: ms }] }, estado: {} };
  };
  const mru = {
    id: 'mru',
    titulo: 'Marcas iguales, rapidez constante',
    temas: ['MRU y velocidad relativa'],
    pieza: 'pista',
    juega: {
      consigna: 'Elige la rapidez y el punto de salida. El carrito deja una marca cada segundo durante 5 s.',
      voz: 'Mira cómo se separan las marcas cuando cambias la rapidez.',
      controles: [
        { id: 'v', etiqueta: 'v', color: 'c-o', min: 1, max: 7, paso: 1, inicio: 2, unidad: 'm/s', decimales: 0 },
        { id: 'x0', etiqueta: 'Sale de', min: 0, max: 5, paso: 1, inicio: 0, unidad: 'm', decimales: 0 },
      ],
      dibujo: val => pistaMRU(val.x0, val.v),
      lectura: val => [v, ` = ${f(val.v)} m/s · marcas cada ${f(val.v)} m`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Un carrito sale de ', x, ' = 2 m con ', v, ' = 4 m/s. ¿Dónde queda su marca de ', t, ' = 5 s?'],
      opciones: [
        { id: 'c', texto: '22 m', correcta: true },
        { id: 'sin-x0', texto: '20 m', error: 'MRU-X0', siFuera: '20 m sería cierto si saliera de x = 0. Aquí ya tenía 2 m.' },
        { id: 'suma', texto: '11 m', error: 'MRU-SUMA', siFuera: '11 m sería sumar 2 + 4 + 5. Cada segundo agrega 4 m, cinco veces.' },
        { id: 'seis', texto: '26 m', error: 'MRU-CONTEO', siFuera: '26 m serían seis segundos. La marca de t = 0 es la salida.' },
      ],
      dibujo: pistaMRU(2, 4, false),
      revelar: { datos: { largo: LARGO, cada: 10, carriles: [{ x: 22, marcas: marcasMRU(2, 4) }], encuentro: { x: 22, rotulo: 't = 5 s' } }, estado: {} },
      coincide: 'Coincide: 2 m de salida más 4 m por cada uno de los 5 segundos.',
    },
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 5, paso: 1, nombre: 't', unidad: 's', decimales: 0, color: 'h' },
        y: { min: 0, max: 25, paso: 5, nombre: 'x', unidad: 'm', decimales: 0, color: 'i' },
        curvas: [{ puntos: [[0, 2], [5, 22]], color: 'i', desde: 2 }],
        puntos: [
          { x: 0, y: 2, color: 'i', rotulo: '2 m', desde: 1 },
          ...[1, 2, 3, 4].map(k => ({ x: k, y: 2 + 4 * k, color: 'i', desde: 2 })),
          { x: 5, y: 22, color: 'i', rotulo: '22 m', guias: true, desde: 3 },
        ],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'En t = 0 el carrito está en x = 2 m.', ecuacion: [x0, ' = 2 m'] },
        { estado: { corte: 2 }, texto: 'Cada segundo suma los mismos 4 m: los puntos caen en una recta.', ecuacion: [v, ' = 4 m/s'] },
        { estado: { corte: 3 }, texto: 'A los 5 s: 2 m más 5 veces 4 m.', ecuacion: [x, ' = 2 + 4 · 5 = 22 m'] },
      ],
    },
    regla: {
      texto: 'Con velocidad constante, la posición cambia lo mismo cada segundo: la gráfica x–t es una recta y su pendiente es v.',
      ecuacion: [x, ' = ', x0, ' + ', v, ' · ', t],
      condicion: 'la velocidad no cambia en todo el tramo y t se cuenta desde que el carrito estaba en x₀.',
    },
    ahoraTu: {
      pieza: 'pista',
      generar(s) {
        const r = azar(s), xi = r.ent(0, 8), vi = r.ent(2, 6), ti = r.ent(3, 7);
        const xf = xi + vi * ti;
        const largo = Math.ceil((xf + 2) / 10) * 10;
        return {
          pregunta: ['Un carrito sale de ', x, ` = ${f(xi)} m con `, v, ` = ${f(vi)} m/s constante. ¿Dónde está en `, t, ` = ${f(ti)} s?`],
          dibujo: { datos: { largo, cada: 10, carriles: [{ x: xi, marcas: [] }] }, estado: {} },
          opciones: opciones(xf, [
            { id: 'sin-x0', valor: vi * ti, error: 'MRU-X0', siFuera: `${f(vi * ti)} m sería cierto si saliera de x = 0.` },
            { id: 'suma', valor: xi + vi + ti, error: 'MRU-SUMA', siFuera: 'Eso suma los datos. Cada segundo agrega v metros.' },
            { id: 'uno-mas', valor: xi + vi * (ti + 1), error: 'MRU-CONTEO', siFuera: `Eso cuenta ${f(ti + 1)} segundos en vez de ${f(ti)}.` },
            { id: 'resta', valor: vi * ti - xi, error: 'MRU-SIGNO', siFuera: 'Eso resta la salida. El carrito ya estaba adelante.' },
          ], n => `${f(n)} m`).slice(0, 4),
          solucion: { texto: `Sale de ${f(xi)} m y suma ${f(vi)} m cada segundo.`, ecuacion: [x, ` = ${f(xi)} + ${f(vi)} · ${f(ti)} = ${f(xf)} m`] },
        };
      },
    },
  };

  // ---------- Idea 2: desplazamiento no es distancia ----------
  const EJE_VT = (vmin, vmax, tmax) => ({
    x: { min: 0, max: tmax, paso: 1, nombre: 't', unidad: 's', decimales: 0, color: 'h' },
    y: { min: vmin, max: vmax, paso: 2, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' },
  });
  // Dos tramos: avanza a v1 durante t1 y retrocede a v2 durante t2.
  function idaVuelta(v1, t1, v2, t2, rotulos = true, corte = {}) {
    const A1 = v1 * t1, A2 = v2 * t2, T = t1 + t2;
    return Object.assign(EJE_VT(-6, 6, Math.max(6, T)), {
      curvas: [{ puntos: [[0, v1], [t1, v1], null, [t1, -v2], [T, -v2]], color: 'o' }],
      areas: [
        { puntos: [[0, v1], [t1, v1]], color: 'i', rotulo: rotulos ? `+${f(A1)} m` : undefined, desde: corte.a1 },
        { puntos: [[t1, -v2], [T, -v2]], color: 'i', rotulo: rotulos ? `−${f(A2)} m` : undefined, desde: corte.a2 },
      ],
    });
  }
  const distancia = {
    id: 'desplazamiento-distancia',
    titulo: 'Desplazamiento no es distancia',
    temas: ['Posición, desplazamiento y distancia', 'Velocidad y rapidez media'],
    pieza: 'ejes',
    juega: {
      consigna: 'El carrito avanza a 4 m/s durante 3 s y después retrocede. Elige cuánto y por cuánto tiempo.',
      voz: 'La parte bajo el eje es cuando va hacia atrás.',
      controles: [
        { id: 'v2', etiqueta: 'Retrocede a', min: 1, max: 6, paso: 1, inicio: 2, unidad: 'm/s', decimales: 0 },
        { id: 't2', etiqueta: 'Durante', min: 1, max: 3, paso: 1, inicio: 2, unidad: 's', decimales: 0 },
      ],
      dibujo: val => ({ datos: idaVuelta(4, 3, val.v2, val.t2), estado: {} }),
      lectura: val => [`Avanza 12 m · retrocede ${f(val.v2 * val.t2)} m`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un carrito avanza 12 m en 3 s y regresa los mismos 12 m en otros 3 s. ¿Cuál es su velocidad media en los 6 s?',
      opciones: [
        { id: 'c', texto: '0 m/s', correcta: true },
        { id: 'rapidez', texto: '4 m/s', error: 'DX-RAPIDEZ', siFuera: '4 m/s es la rapidez media: distancia entre tiempo. La velocidad media usa el desplazamiento.' },
        { id: 'tramo', texto: '2 m/s', error: 'DX-TRAMO', siFuera: '2 m/s sería cierto si avanzara 12 m en 6 s sin volver.' },
        { id: 'ida', texto: '8 m/s', error: 'DX-SUMA', siFuera: '8 m/s suma las rapideces de ida y vuelta; la media no se obtiene así.' },
      ],
      dibujo: { datos: idaVuelta(4, 3, 4, 3, false), estado: {} },
      revelar: { datos: idaVuelta(4, 3, 4, 3, true), estado: {} },
      coincide: 'Coincide: terminó donde empezó, así que su desplazamiento es 0.',
    },
    mira: {
      datos: idaVuelta(4, 3, 2, 3, true, { a1: 1, a2: 2 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Área sobre el eje: avanzó 4 · 3 = 12 m.', ecuacion: [{ sub: ['A', '+'] }, ' = 12 m'] },
        { estado: { corte: 2 }, texto: 'Área bajo el eje: retrocedió 2 · 3 = 6 m.', ecuacion: [{ sub: ['A', '−'] }, ' = 6 m'] },
        { estado: { corte: 2 }, texto: 'Desplazamiento: lo de arriba menos lo de abajo.', ecuacion: [dx, ' = 12 − 6 = 6 m'] },
        { estado: { corte: 2 }, texto: 'Distancia recorrida: todo el camino, sumado.', ecuacion: ['d = 12 + 6 = 18 m'] },
        { estado: { corte: 2 }, texto: 'En 6 s: velocidad media 1 m/s; rapidez media 3 m/s.', ecuacion: [{ frac: [dx, dt] }, ' = 1 m/s   ·   ', { frac: ['d', dt] }, ' = 3 m/s'] },
      ],
    },
    regla: {
      texto: 'En la gráfica v–t, el área sobre el eje suma y la de abajo resta: eso es el desplazamiento. La distancia suma ambas.',
      ecuacion: [dx, ' = ', { sub: ['A', '+'] }, ' − ', { sub: ['A', '−'] }, '   ·   d = ', { sub: ['A', '+'] }, ' + ', { sub: ['A', '−'] }],
      condicion: 'se separa el área en cada cambio de sentido. Velocidad media = Δx/Δt; rapidez media = d/Δt.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), v1 = r.ent(2, 5), t1 = r.ent(2, 3), v2 = r.ent(1, 5), t2 = r.ent(1, 3);
        const A1 = v1 * t1, A2 = v2 * t2, pide = s % 2 ? 'distancia' : 'desplazamiento';
        const bien = pide === 'distancia' ? A1 + A2 : A1 - A2;
        const otro = pide === 'distancia' ? A1 - A2 : A1 + A2;
        return {
          pregunta: `Con esta gráfica v–t, ¿cuál es ${pide === 'distancia' ? 'la distancia recorrida' : 'el desplazamiento'} en los ${f(t1 + t2)} s?`,
          dibujo: { datos: idaVuelta(v1, t1, v2, t2, false), estado: {} },
          opciones: opciones(bien, [
            { id: 'cambio', valor: otro, error: pide === 'distancia' ? 'DX-RESTA' : 'DX-SUMA', siFuera: pide === 'distancia' ? 'Eso es el desplazamiento: la distancia no resta lo que retrocede.' : 'Eso es la distancia: el desplazamiento resta lo que retrocede.' },
            { id: 'solo-ida', valor: A1, error: 'DX-IDA', siFuera: 'Eso es solo el primer tramo. Falta el área bajo el eje.' },
            { id: 'alturas', valor: v1 + v2, error: 'DX-ALTURA', siFuera: 'Eso suma alturas de la gráfica, no áreas.' },
            { id: 'negativo', valor: A2 - A1, error: 'DX-SIGNO', siFuera: 'Eso invierte el signo: lo de arriba es avanzar.' },
          ], n => `${f(n)} m`).slice(0, 4),
          solucion: {
            texto: pide === 'distancia' ? 'Las dos áreas suman.' : 'El área de arriba menos la de abajo.',
            ecuacion: pide === 'distancia' ? [`d = ${f(A1)} + ${f(A2)} = ${f(A1 + A2)} m`] : [dx, ` = ${f(A1)} − ${f(A2)} = ${f(A1 - A2)} m`],
            dibujo: { datos: idaVuelta(v1, t1, v2, t2, true), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 3: la pendiente de v–t es la aceleración (MRUV) ----------
  const rectaVT = (vi, ai, tmax, extra = {}) => Object.assign({
    x: { min: 0, max: tmax, paso: 1, nombre: 't', unidad: 's', decimales: 0, color: 'h' },
    y: { min: 0, max: 16, paso: 4, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' },
    curvas: [{ puntos: [[0, vi], [tmax, vi + ai * tmax]], color: 'o' }],
  }, extra);
  const mruv = {
    id: 'pendiente-aceleracion',
    titulo: 'La pendiente es la aceleración',
    temas: ['MRUV', 'Gráficas x-t, v-t y a-t', 'La recta y la parábola como gráficas'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige la velocidad inicial y cuánto cambia cada segundo. Mira cómo se inclina la recta.',
      voz: 'Prueba también un cambio negativo.',
      controles: [
        { id: 'v0', etiqueta: 'v₀', color: 'c-o', min: 0, max: 12, paso: 2, inicio: 4, unidad: 'm/s', decimales: 0 },
        { id: 'a', etiqueta: 'a', color: 'c-d', min: -2, max: 2, paso: 1, inicio: 1, unidad: 'm/s²', decimales: 0 },
      ],
      // La recta se corta donde v llegaría a 0: aquí el carrito frena hasta detenerse, no retrocede.
      dibujo: val => {
        const tf = val.a < 0 ? Math.min(4, val.v0 / -val.a) : 4;
        return { datos: Object.assign(rectaVT(val.v0, val.a, 4), { curvas: [{ puntos: [[0, val.v0], [tf, val.v0 + val.a * tf]], color: 'o' }] }), estado: {} };
      },
      lectura: val => [v, ` cambia ${val.a > 0 ? '+' : val.a < 0 ? '−' : ''}${f(Math.abs(val.a))} m/s cada segundo`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un carrito avanza hacia la derecha y frena: pasa de 8 m/s a 2 m/s en 3 s. ¿Hacia dónde apunta su aceleración?',
      opciones: [
        { id: 'c', texto: 'Hacia la izquierda: −2 m/s²', correcta: true },
        { id: 'derecha', texto: 'Hacia la derecha, porque avanza', error: 'K3', siFuera: 'Sería cierto si la rapidez aumentara. La aceleración sigue al cambio de v.' },
        { id: 'cero', texto: 'No tiene: sigue avanzando', error: 'K-A0', siFuera: 'Sería cierto si v no cambiara. Aquí baja 2 m/s cada segundo.' },
        { id: 'sin-v0', texto: 'Hacia la izquierda: −8/3 m/s²', error: 'K4', siFuera: 'Eso divide 8 entre 3. La aceleración usa el cambio: 2 − 8.' },
      ],
      dibujo: { datos: rectaVT(8, -2, 3, { puntos: [{ x: 0, y: 8, color: 'o', rotulo: '8 m/s' }, { x: 3, y: 2, color: 'o', rotulo: '2 m/s' }] }), estado: {} },
      revelar: { datos: rectaVT(8, -2, 3, { puntos: [{ x: 0, y: 8, color: 'o', rotulo: '8 m/s', guias: true }, { x: 3, y: 2, color: 'o', rotulo: '2 m/s', guias: true }] }), estado: {} },
      coincide: 'Coincide: la velocidad baja, así que la aceleración apunta al revés del movimiento.',
    },
    mira: {
      datos: rectaVT(8, -2, 3, {
        puntos: [{ x: 0, y: 8, color: 'o', rotulo: '8 m/s', guias: true, desde: 1 }, { x: 3, y: 2, color: 'o', rotulo: '2 m/s', guias: true, desde: 1 }],
        areas: [{ puntos: [[0, 8], [3, 2]], color: 'i', rotulo: '15 m', desde: 4 }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Empieza a 8 m/s; a los 3 s, va a 2 m/s.', ecuacion: [v0, ' = 8 m/s'] },
        { estado: { corte: 2 }, texto: 'La velocidad cambió 2 − 8 = −6 m/s.', ecuacion: [dv, ' = ', v, ' − ', v0, ' = −6 m/s'] },
        { estado: { corte: 3 }, texto: 'Ese cambio entre el tiempo es la pendiente: la aceleración.', ecuacion: [a, ' = ', { frac: [dv, dt] }, ' = ', { frac: ['−6', '3'] }, ' = −2 m/s²'] },
        { estado: { corte: 4 }, texto: 'El área bajo la recta es lo que avanzó.', ecuacion: [dx, ' = 8 · 3 + ½ (−2) · 3² = 15 m'] },
      ],
    },
    regla: {
      texto: 'Con aceleración constante, la gráfica v–t es una recta: su pendiente es la aceleración y su área, el desplazamiento.',
      ecuacion: [v, ' = ', v0, ' + ', a, ' · ', t, '   ·   ', x, ' = ', x0, ' + ', v0, t, ' + ½ ', a, { sup: [t, '2'] }],
      condicion: 'la aceleración no cambia en el tramo. Frenar mientras se avanza da a con signo contrario a v.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), ai = [-3, -2, -1, 1, 2, 3][r.ent(0, 5)], ti = r.ent(2, 4);
        const vi = ai < 0 ? r.ent(-ai * ti, 12) : r.ent(0, 8);
        const vf = vi + ai * ti;
        return {
          pregunta: ['Un carrito va a ', v0, ` = ${f(vi)} m/s y su aceleración es `, a, ` = ${f(ai)} m/s². ¿Qué velocidad tiene en `, t, ` = ${f(ti)} s?`],
          opciones: opciones(vf, [
            { id: 'sin-v0', valor: ai * ti, error: 'K4', siFuera: 'Eso olvida la velocidad que ya tenía al inicio.' },
            { id: 'signo', valor: vi - ai * ti, error: 'K-SIGNO', siFuera: 'Eso cambia el signo de la aceleración.' },
            { id: 'un-seg', valor: vi + ai, error: 'K-TIEMPO', siFuera: 'Eso es la velocidad después de un solo segundo.' },
            { id: 'cuadrado', valor: vi + ai * ti * ti, error: 'K-CUADRADO', siFuera: 'Eso eleva t al cuadrado; v cambia en proporción a t.' },
          ], n => `${f(n)} m/s`).slice(0, 4),
          solucion: { texto: `Cada segundo la velocidad cambia ${f(ai)} m/s, durante ${f(ti)} s.`, ecuacion: [v, ` = ${f(vi)} + (${f(ai)}) · ${f(ti)} = ${f(vf)} m/s`] },
        };
      },
    },
  };

  // ---------- Idea 4: caída libre, g también en la cima ----------
  // Cambia: la altura y la flecha de v de la pelota · Permanece: la flecha de g, igual en todo instante ·
  // Progresa: el tiempo, con marcas cada 0,5 s · Se reserva: la cima, donde v = 0 y g sigue ·
  // Debe verse: que la pendiente de v–t es −g en todos los puntos, también en v = 0.
  const G = 10; // convención didáctica declarada en la regla (g ≈ 9,8 m/s² en Juliaca y en el resto del Perú)
  const g = { v: 'c-d', t: 'g' }, y = { v: 'c-i', t: 'y' };
  const COL_TORRE = { y: 'i', v: 'o', a: 'd' };
  const alturaEn = (vi, ti) => Math.max(0, vi * ti - G * ti * ti / 2);
  const torreEn = (vi, ti, alto = 25) => {
    const tv = 2 * vi / G, tt = Math.min(ti, tv);
    const marcas = [];
    for (let k = 0; k * 0.5 <= tt + 1e-9; k++) marcas.push(alturaEn(vi, k * 0.5));
    return { datos: { alto, colores: COL_TORRE, pelotas: [{ y: alturaEn(vi, tt), v: tt >= tv ? 0 : vi - G * tt, marcas }] }, estado: {} };
  };
  const caida = {
    id: 'caida-libre',
    titulo: 'En la cima, g sigue',
    temas: ['Caída libre', 'Gráficas x-t, v-t y a-t'],
    pieza: 'torre',
    juega: {
      consigna: 'Lanza la pelota hacia arriba y avanza el reloj. Cada medio segundo deja una marca.',
      voz: 'Fíjate en las dos flechas: una cambia y la otra no.',
      controles: [
        { id: 'v0', etiqueta: 'v₀', color: 'c-o', min: 10, max: 20, paso: 5, inicio: 15, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 4, paso: 0.5, inicio: 0.5, unidad: 's', decimales: 1 },
      ],
      dibujo: val => torreEn(val.v0, val.t),
      lectura: val => {
        const tv = 2 * val.v0 / G, tt = Math.min(val.t, tv);
        return tt >= tv ? ['En el suelo · ', g, ' = 10 m/s² hacia abajo'] : [v, ` = ${f(val.v0 - G * tt, 1)} m/s · `, g, ' = 10 m/s² hacia abajo'];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['Una pelota sube con ', v0, ' = 20 m/s y llega a su punto más alto. Justo ahí, ¿cuánto vale su aceleración?'],
      opciones: [
        { id: 'c', texto: '10 m/s², hacia abajo', correcta: true },
        { id: 'cero', texto: '0: está detenida', error: 'C1', siFuera: 'v = 0 en la cima es cierto. Pero a mide cómo cambia v, y un instante después ya baja.' },
        { id: 'arriba', texto: '10 m/s², hacia arriba', error: 'K3', siFuera: 'Hacia arriba iba la velocidad al subir. La gravedad tira hacia abajo todo el tiempo.' },
        { id: 'masa', texto: 'Depende de la masa de la pelota', error: 'C2', siFuera: 'Con aire, la forma y la masa importan. Sin aire, todas caen con el mismo g.' },
      ],
      dibujo: torreEn(20, 1.5),
      revelar: torreEn(20, 2),
      coincide: 'Coincide: en la cima v = 0, pero la velocidad sigue cambiando 10 m/s cada segundo.',
    },
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 4, paso: 1, nombre: 't', unidad: 's', decimales: 0, color: 'h' },
        y: { min: -20, max: 20, paso: 10, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' },
        curvas: [{ puntos: [[0, 20], [4, -20]], color: 'o', desde: 1 }],
        areas: [{ puntos: [[0, 20], [2, 0]], color: 'i', rotulo: '+20 m', desde: 3 }, { puntos: [[2, 0], [4, -20]], color: 'i', rotulo: '−20 m', desde: 4 }],
        puntos: [{ x: 0, y: 20, color: 'o', desde: 1 }, { x: 2, y: 0, color: 'o', rotulo: 'cima', guias: true, desde: 2 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Sale a 20 m/s y pierde 10 m/s cada segundo.', ecuacion: [v, ' = 20 − 10 ', t] },
        { estado: { corte: 2 }, texto: 'A los 2 s, v = 0: es la cima. La recta no se quiebra.', ecuacion: [t, ' = ', { frac: [v0, g] }, ' = 2 s'] },
        { estado: { corte: 2 }, texto: 'La pendiente es la misma antes, en y después de la cima.', ecuacion: [a, ' = −', g, ' = −10 m/s²'] },
        { estado: { corte: 3 }, texto: 'El área hasta la cima es lo que subió.', ecuacion: [{ sub: [y, 'máx'] }, ' = ½ · 20 · 2 = 20 m'] },
        { estado: { corte: 4 }, texto: 'Bajando, el área es negativa: vuelve al punto de partida a los 4 s.', ecuacion: [dx, ' = 20 − 20 = 0'] },
      ],
    },
    regla: {
      texto: 'En caída libre la única aceleración es g, hacia abajo, al subir, en la cima y al bajar. Con el eje hacia arriba:',
      ecuacion: [v, ' = ', v0, ' − ', g, t, '   ·   ', y, ' = ', v0, t, ' − ½ ', g, { sup: [t, '2'] }],
      condicion: 'sin resistencia del aire y cerca del suelo. Aquí g = 10 m/s²; el valor medido es cercano a 9,8 m/s².',
    },
    ahoraTu: {
      pieza: 'torre',
      generar(s) {
        const r = azar(s), vi = [10, 15, 20, 25, 30][r.ent(0, 4)], pide = ['tiempo', 'altura', 'velocidad'][s % 3];
        const ts = vi / G, hm = vi * vi / (2 * G), alto = Math.ceil(hm / 10) * 10;
        const dib = { datos: { alto, colores: COL_TORRE, pelotas: [{ y: 0, v: vi, marcas: [] }] }, estado: {} };
        if (pide === 'tiempo') return {
          pregunta: ['Se lanza una pelota hacia arriba con ', v0, ` = ${f(vi)} m/s. Sin aire y con g = 10 m/s², ¿cuánto tarda en llegar a la cima?`],
          dibujo: dib,
          opciones: opciones(ts, [
            { id: 'ida-vuelta', valor: 2 * ts, error: 'C-VUELTA', siFuera: 'Ese es el tiempo de subir y volver a bajar.' },
            { id: 'altura', valor: hm / 10, error: 'C-ALTURA', siFuera: 'Eso divide la altura entre 10; el tiempo sale de v₀ entre g.' },
            { id: 'por', valor: vi * G, error: 'K4', siFuera: 'Eso multiplica v₀ por g. v baja g cada segundo: se divide.' },
          ], n => `${f(n, 1)} s`),
          solucion: { texto: `Pierde 10 m/s cada segundo hasta llegar a v = 0.`, ecuacion: [t, ` = ${f(vi)} / 10 = ${f(ts, 1)} s`], dibujo: { datos: Object.assign({}, dib.datos, { pelotas: [{ y: hm, v: 0, marcas: [] }] }), estado: {} } },
        };
        if (pide === 'altura') return {
          pregunta: ['Se lanza una pelota hacia arriba con ', v0, ` = ${f(vi)} m/s. Sin aire y con g = 10 m/s², ¿qué altura máxima alcanza?`],
          dibujo: dib,
          opciones: opciones(hm, [
            { id: 'sin-medio', valor: 2 * hm, error: 'C-MEDIO', siFuera: 'Eso olvida el ½: la rapidez media al subir es la mitad de v₀.' },
            { id: 'vt', valor: vi * ts / 4, error: 'C-AREA', siFuera: 'Esa área usa la mitad del tiempo de subida.' },
            { id: 'v-g', valor: vi / G, error: 'C-TIEMPO', siFuera: 'Ese número es el tiempo de subida, no la altura.' },
          ], n => `${f(n, 2)} m`),
          solucion: { texto: 'Es el área del triángulo de v–t hasta la cima.', ecuacion: [{ sub: [y, 'máx'] }, ` = ½ · ${f(vi)} · ${f(ts, 1)} = ${f(hm, 2)} m`], dibujo: { datos: Object.assign({}, dib.datos, { pelotas: [{ y: hm, v: 0, marcas: [] }] }), estado: {} } },
        };
        const tq = ts + [0.5, 1][r.ent(0, 1)], vq = vi - G * tq;
        return {
          pregunta: ['Se lanza una pelota hacia arriba con ', v0, ` = ${f(vi)} m/s. Con el eje hacia arriba y g = 10 m/s², ¿qué velocidad tiene en `, t, ` = ${f(tq, 1)} s?`],
          dibujo: dib,
          opciones: opciones(vq, [
            { id: 'sin-signo', valor: -vq, error: 'K-SIGNO', siFuera: 'Ese es el valor de la rapidez, pero ya pasó la cima: va hacia abajo.' },
            { id: 'cima', valor: 0, error: 'C1', siFuera: 'v = 0 solo en la cima, que fue antes.' },
            { id: 'suma', valor: vi + G * tq, error: 'K3', siFuera: 'Eso suma g, como si la gravedad empujara hacia arriba.' },
          ], n => `${f(n, 1)} m/s`),
          solucion: { texto: 'Pierde 10 m/s cada segundo, también después de la cima.', ecuacion: [v, ` = ${f(vi)} − 10 · ${f(tq, 1)} = ${f(vq, 1)} m/s`] },
        };
      },
    },
  };

  // ---------- Idea 5: encuentros y velocidad relativa ----------
  // Cambia: las rapideces de A y B · Permanece: la separación inicial (24 m) y el reloj común ·
  // Progresa: las marcas de cada segundo, que cierran la brecha · Se reserva: el cruce de las dos rectas x–t ·
  // Debe verse: en el encuentro coinciden las posiciones, no las velocidades.
  const SEP = 24, LARGO_E = 30;
  const vA = { v: 'c-o', t: 'v_A' };
  const tEnc = (va, vb, d = SEP) => (va - vb > 0 ? d / (va - vb) : Infinity);
  const pistaEnc = (va, vb, conEnc = true, d = SEP, largo = LARGO_E) => {
    const te = tEnc(va, vb, d), tm = Number.isFinite(te) ? Math.min(te, 6) : 6;
    const ks = Array.from({ length: Math.floor(tm + 1e-9) + 1 }, (_, k) => k);
    const ma = ks.map(k => va * k).filter(m => m >= 0 && m <= largo), mb = ks.map(k => d + vb * k).filter(m => m >= 0 && m <= largo);
    const xa = Math.min(largo, va * tm), xb = Math.max(0, Math.min(largo, d + vb * tm));
    return {
      datos: {
        largo, cada: 6,
        carriles: [{ x: xa, variante: 'a', marcas: ma, rotulo: 'A' }, { x: xb, variante: 'b', marcas: mb, rotulo: 'B' }],
        encuentro: conEnc && Number.isFinite(te) && va * te <= largo ? { x: va * te, rotulo: `${f(te, 2)} s` } : null,
      }, estado: {},
    };
  };
  const encuentro = {
    id: 'encuentro',
    titulo: 'Encontrarse es estar juntos',
    temas: ['MRU y velocidad relativa', 'Posición, desplazamiento y distancia'],
    pieza: 'pista',
    juega: {
      consigna: 'A sale de 0 y B sale de 24 m al mismo tiempo. Elige sus velocidades: negativa es hacia la izquierda.',
      voz: 'Mira cuánto se acorta la distancia entre ellos cada segundo.',
      controles: [
        { id: 'va', etiqueta: 'v de A', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 3, unidad: 'm/s', decimales: 0 },
        { id: 'vb', etiqueta: 'v de B', min: -4, max: 4, paso: 1, inicio: -1, unidad: 'm/s', decimales: 0 },
      ],
      dibujo: val => pistaEnc(val.va, val.vb),
      lectura: val => {
        const vr = val.va - val.vb;
        return vr > 0 ? [`Se acercan ${f(vr)} m cada segundo`] : ['No se acercan: B no es alcanzado'];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'A sale de x = 0 a 4 m/s hacia la derecha. B sale a la vez de x = 18 m a 2 m/s hacia la izquierda. ¿En qué instante se encuentran?',
      opciones: [
        { id: 'c', texto: '3 s', correcta: true },
        { id: 'resta', texto: '9 s', error: 'VR-RESTA', siFuera: 'Restar 4 − 2 sería cierto si fueran al mismo lado. Aquí van uno hacia el otro.' },
        { id: 'solo-a', texto: '4,5 s', error: 'VR-UNO', siFuera: 'Ese es el tiempo de A si B se quedara quieto en 18 m.' },
        { id: 'velocidad', texto: 'Cuando tengan la misma velocidad', error: 'K1', siFuera: 'Igual velocidad dice que no se acercan más. Encontrarse es tener la misma posición.' },
      ],
      dibujo: pistaEnc(4, -2, false, 18, 20),
      revelar: pistaEnc(4, -2, true, 18, 20),
      coincide: 'Coincide: se acercan 4 + 2 = 6 m cada segundo, y había 18 m entre ellos.',
    },
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 5, paso: 1, nombre: 't', unidad: 's', decimales: 0, color: 'h' },
        y: { min: 0, max: 20, paso: 6, nombre: 'x', unidad: 'm', decimales: 0, color: 'i' },
        curvas: [{ puntos: [[0, 0], [5, 20]], color: 'o', rotulo: 'A', desde: 1 }, { puntos: [[0, 18], [5, 8]], color: 'h', rotulo: 'B', desde: 1 }],
        puntos: [{ x: 0, y: 18, color: 'h', rotulo: '18 m', desde: 1 }, { x: 3, y: 12, color: 'i', rotulo: '(3 s; 12 m)', guias: true, desde: 3 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada recta es la posición de un carrito en el tiempo.', ecuacion: [{ sub: [x, 'A'] }, ' = 4', t, '   ·   ', { sub: [x, 'B'] }, ' = 18 − 2', t] },
        { estado: { corte: 2 }, texto: 'Cada segundo la brecha baja 4 + 2 = 6 m.', ecuacion: [{ sub: [v, 'A/B'] }, ' = 4 − (−2) = 6 m/s'] },
        { estado: { corte: 3 }, texto: 'Se encuentran donde las rectas se cruzan: misma x, mismo t.', ecuacion: [t, ' = ', { frac: ['18', '6'] }, ' = 3 s   ·   ', x, ' = 12 m'] },
        { estado: { corte: 3 }, texto: 'En el cruce las pendientes son distintas: sus velocidades no son iguales.', ecuacion: [{ sub: [v, 'A'] }, ' = 4 m/s ≠ ', { sub: [v, 'B'] }, ' = −2 m/s'] },
      ],
    },
    regla: {
      texto: 'Dos móviles se encuentran cuando están en la misma posición en el mismo instante. La brecha se cierra con la velocidad relativa.',
      ecuacion: [{ sub: [t, 'e'] }, ' = ', { frac: ['d', { sub: [v, 'A/B'] }] }, '   ·   ', { sub: [v, 'A/B'] }, ' = ', { sub: [v, 'A'] }, ' − ', { sub: [v, 'B'] }],
      condicion: 'los dos salen a la vez, en MRU y sobre el mismo eje. Si la brecha no se achica, no se encuentran.',
    },
    ahoraTu: {
      pieza: 'pista',
      generar(s) {
        const r = azar(s), opuesto = s % 2 === 0;
        const va = r.ent(3, 7), vb = (opuesto ? -1 : 1) * r.ent(1, Math.min(4, va - 1));
        const vr = va - vb, te = r.ent(2, 5), d = vr * te, xe = va * te;
        const largo = Math.ceil(Math.max(d, xe) / 10) * 10 + 10;
        const cuenta = opuesto ? `${f(va)} + ${f(-vb)}` : `${f(va)} − ${f(vb)}`;
        return {
          pregunta: `A sale de x = 0 a ${f(va)} m/s hacia la derecha. B sale a la vez de x = ${f(d)} m a ${f(Math.abs(vb))} m/s hacia ${opuesto ? 'la izquierda' : 'la derecha'}. ¿Cuándo se encuentran?`,
          dibujo: { datos: { largo, cada: 10, carriles: [{ x: 0, variante: 'a', marcas: [], rotulo: 'A' }, { x: d, variante: 'b', marcas: [], rotulo: 'B' }] }, estado: {} },
          opciones: opciones(te, [
            { id: 'cambio', valor: d / (va + vb), error: opuesto ? 'VR-RESTA' : 'VR-SUMA', siFuera: opuesto ? 'Restar rapideces sirve si van al mismo lado.' : 'Sumar rapideces sirve si van uno hacia el otro.' },
            { id: 'solo-a', valor: d / va, error: 'VR-UNO', siFuera: 'Ese sería el tiempo si B se quedara quieto.' },
            { id: 'pos', valor: xe, error: 'VR-POSICION', siFuera: 'Ese número es la posición del encuentro, en metros.' },
          ], n => `${f(n, 2)} s`),
          solucion: {
            texto: opuesto ? 'Van uno hacia el otro: la brecha se cierra con la suma.' : 'Van al mismo lado: la brecha se cierra con la diferencia.',
            ecuacion: [{ sub: [t, 'e'] }, ` = ${f(d)} / (${cuenta}) = ${f(te)} s`],
            dibujo: { datos: { largo, cada: 10, carriles: [{ x: xe, variante: 'a', marcas: [], rotulo: 'A' }, { x: xe, variante: 'b', marcas: [], rotulo: 'B' }], encuentro: { x: xe, rotulo: `${f(xe)} m` } }, estado: {} },
          },
        };
      },
    },
  };

  return {
    unidad: 'fisica.movimiento-rectilineo',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/pista.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/torre.js'],
    historia: {
      texto: 'Una caída es demasiado rápida para medirla con relojes de agua. En el siglo XVII, Galileo usó planos inclinados para frenar el movimiento y comparar distancias con tiempos iguales. Nuestras gráficas y ecuaciones son la forma moderna de escribir esas comparaciones.',
      pregunta: '¿Cómo medirías algo que pasa demasiado rápido?',
      fuente: { titulo: 'Museo Galileo — Science of Motion', url: 'https://catalogue.museogalileo.it/section/ScienceOfMotion.html' },
    },
    ideas: [mru, distancia, mruv, caida, encuentro],
  };
});
