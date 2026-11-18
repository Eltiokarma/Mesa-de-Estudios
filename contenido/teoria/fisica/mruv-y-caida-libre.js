/*
 * Teoría de «MRUV y caída libre» (fisica.mruv-y-caida-libre), unidad nueva del 18 nov: sale de «MRU, MRUV y caída
 * libre», que Gerson aprobó partir en dos (docs/etapa4/decisiones.md; docs/etapa4/propuesta-fisica.md §1 y §9, pregunta 1).
 * La unidad vieja conserva su id como «Movimiento rectilíneo uniforme» (contenido/teoria/fisica/movimiento-rectilineo.js).
 * Avance.migrar (nucleo/avance.js) pasa a esta unidad lo hecho en `pendiente-aceleracion` y `caida-libre`, las mesas
 * `pista-libre`, `ida-vuelta` y `recta-vt`, la visita, «Ya la estudié» y las palabras «aceleración», «caída libre» y
 * «gravedad».
 *
 * ESTE ARCHIVO ES EL CONTENIDO VIEJO, MOVIDO TAL CUAL (ideas, mesas, glosario e historia), a la espera de rehacerse con el
 * método (docs/metodo/unidad/): ideas B1 `aceleracion`, B2 `ecuaciones-mruv`, B3 `pendiente-aceleracion` (la gráfica
 * velocidad–tiempo), B4 `graficas-xt-at`, B5 `caida-reposo` y B6 `caida-libre` (lanzamiento vertical). Colores aprobados
 * (iguales a los de Movimiento rectilíneo uniforme): velocidad naranja, tiempo turquesa, posición y desplazamiento
 * violeta, aceleración y g carmín, distancia recorrida en tinta. Hasta entonces quedan los colores viejos (de abajo).
 * La mesa `ida-vuelta` es el juego viejo de `desplazamiento-distancia` (área bajo v–t), que viene a la gráfica v–t (B3);
 * esa idea se queda en la otra unidad y se rehará con la pista atlética.
 *
 * Molde: docs/teoria.md. Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 2) y
 * docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Colores (regla 4, viejos): x turquesa (c-i, el de la pista), v naranja (c-o), a verde (c-d), t rojo (c-h).
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

  // Gesto directo (docs/teoria.md §4): la manija vive en las coordenadas de la figura; mover la convierte en valores
  // con la inversa lineal de la escala de la pieza, y el lector los ajusta al paso y al rango de su control.
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));
  const EJES = () => Kit.piezas.ejes, TORRE = () => Kit.piezas.torre;

  // ---------- La mesa «Ida y vuelta en v–t» (juego viejo de `desplazamiento-distancia`, tal cual) ----------
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
  // Animación: el reloj recorre la ida y la vuelta a velocidad real. El punto naranja va sobre la gráfica y las dos
  // áreas se llenan hasta t; Δx y d del momento salen de esas mismas áreas (regla 1). Al terminar se queda quieto.
  const IDA_V = 4, IDA_T = 3;
  const tramo = (v2, t2, tt) => {
    const T = IDA_T + t2, tm = Math.max(0, Math.min(tt, T));
    const a1 = IDA_V * Math.min(tm, IDA_T), a2 = v2 * Math.max(0, tm - IDA_T);
    return { tm, a1, a2, vt: tm < IDA_T ? IDA_V : -v2 };
  };
  const idaVueltaT = (v2, t2, tt) => {
    const d = idaVuelta(IDA_V, IDA_T, v2, t2, false), q = tramo(v2, t2, tt);
    const ar = [];
    if (q.tm > 0) ar.push({ puntos: [[0, IDA_V], [Math.min(q.tm, IDA_T), IDA_V]], color: 'i', rotulo: q.tm >= 0.8 ? `+${f(q.a1, 1)} m` : undefined });
    if (q.tm > IDA_T) ar.push({ puntos: [[IDA_T, -v2], [q.tm, -v2]], color: 'i', rotulo: q.tm - IDA_T >= 0.8 ? `−${f(q.a2, 1)} m` : undefined });
    return Object.assign(d, { areas: ar, puntos: [{ x: q.tm, y: q.vt, color: 'o', guias: true }] });
  };
  const juegoIdaVuelta = {
    consigna: 'El carrito avanza a 4 m/s durante 3 s y después retrocede. Mira cómo se llenan las dos áreas mientras corre el reloj.',
    voz: 'La parte bajo el eje es cuando va hacia atrás.',
    controles: [
      { id: 'v2', etiqueta: 'Retrocede a', min: 1, max: 6, paso: 1, inicio: 2, unidad: 'm/s', decimales: 0 },
      { id: 't2', etiqueta: 'Durante', min: 1, max: 3, paso: 1, inicio: 2, unidad: 's', decimales: 0 },
      { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 7, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
    ],
    dibujo: val => ({ datos: idaVueltaT(val.v2, val.t2, val.t), estado: {} }),
    lectura: val => { const q = tramo(val.v2, val.t2, val.t); return [t, ` = ${f(q.tm, 1)} s · `, dx, ` = ${f(q.a1 - q.a2, 1)} m · d = ${f(q.a1 + q.a2, 1)} m`]; },
    minimo: 3,
    // Arrastra el tramo de abajo hacia arriba o abajo (qué tan rápido retrocede) y su borde derecho (cuánto tiempo).
    arrastres: [
      { id: 'retroceso', etiqueta: 'rapidez de retroceso', color: 'c-o',
        donde: val => { const g = EJES().geometria(idaVuelta(4, 3, val.v2, val.t2)); return { x: g.X(3 + val.t2 / 2), y: g.Y(-val.v2) }; },
        mover: (pt, val) => { const g = EJES().geometria(idaVuelta(4, 3, val.v2, val.t2)); return { v2: -inversa(g.Y, -6, 6)(pt.y) }; } },
      { id: 'duracion', etiqueta: 'fin del retroceso', color: 'c-h',
        donde: val => { const g = EJES().geometria(idaVuelta(4, 3, val.v2, val.t2)); return { x: g.X(3 + val.t2), y: g.Y(-val.v2) }; },
        mover: (pt, val) => { const g = EJES().geometria(idaVuelta(4, 3, val.v2, val.t2)); return { t2: inversa(g.X, 0, 6)(pt.x) - 3 }; } },
    ],
  };

  // ---------- Idea 3: la pendiente de v–t es la aceleración (MRUV) ----------
  const rectaVT = (vi, ai, tmax, extra = {}) => Object.assign({
    x: { min: 0, max: tmax, paso: 1, nombre: 't', unidad: 's', decimales: 0, color: 'h' },
    y: { min: 0, max: 16, paso: 4, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' },
    curvas: [{ puntos: [[0, vi], [tmax, vi + ai * tmax]], color: 'o' }],
  }, extra);
  // Animación: el reloj corre de 0 a 4 s a velocidad real. La recta se pinta hasta t, el punto naranja la recorre y el
  // área (lo que avanzó) se llena debajo. Si frena hasta v = 0, se queda ahí: no retrocede. El eje llega a 20 m/s para
  // que v₀ = 12 con a = 2 no se salga de la figura.
  const T_VT = 4;
  const ejeVT = (vi, ai, extra = {}) => rectaVT(vi, ai, T_VT, Object.assign({ y: { min: 0, max: 20, paso: 4, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' } }, extra));
  const altoVT = val => (val.a < 0 ? Math.min(T_VT, val.v0 / -val.a) : T_VT);
  const momentoVT = val => {
    const tm = Math.max(0, Math.min(val.t, altoVT(val)));
    return { tm, vt: val.v0 + val.a * tm, dx: val.v0 * tm + val.a * tm * tm / 2, quieto: val.a < 0 && val.t >= altoVT(val) };
  };
  const rectaVTt = val => {
    const tf = altoVT(val), q = momentoVT(val), fin = [tf, val.v0 + val.a * tf];
    return ejeVT(val.v0, val.a, {
      curvas: [{ puntos: [[0, val.v0], fin], color: 'o', discontinua: true }, { puntos: [[0, val.v0], [q.tm, q.vt]], color: 'o' }],
      areas: q.tm > 0 ? [{ puntos: [[0, val.v0], [q.tm, q.vt]], color: 'i', rotulo: q.tm >= 1 && q.dx >= 4 ? `${f(q.dx, 1)} m` : undefined }] : [],
      puntos: [{ x: q.tm, y: q.vt, color: 'o', guias: true }],
    });
  };
  const mruv = {
    id: 'pendiente-aceleracion',
    titulo: 'La pendiente es la aceleración',
    temas: ['MRUV', 'Gráficas x-t, v-t y a-t', 'La recta y la parábola como gráficas'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige la velocidad inicial y cuánto cambia cada segundo. Mira el punto: sube o baja lo mismo en cada segundo.',
      voz: 'Prueba también un cambio negativo.',
      controles: [
        { id: 'v0', etiqueta: 'v₀', color: 'c-o', min: 0, max: 12, paso: 2, inicio: 4, unidad: 'm/s', decimales: 0 },
        { id: 'a', etiqueta: 'a', color: 'c-d', min: -2, max: 2, paso: 1, inicio: 1, unidad: 'm/s²', decimales: 0 },
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: T_VT + 0.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      // La recta se corta donde v llegaría a 0: aquí el carrito frena hasta detenerse, no retrocede.
      dibujo: val => ({ datos: rectaVTt(val), estado: {} }),
      lectura: val => {
        const q = momentoVT(val);
        return q.quieto ? [t, ` = ${f(q.tm, 1)} s · `, v, ' = 0: se detuvo'] : [t, ` = ${f(q.tm, 1)} s · `, v, ` = ${f(q.vt, 1)} m/s · `, a, ` = ${f(val.a)} m/s²`];
      },
      minimo: 3,
      // Arrastra el punto de partida (v₀) o el punto de t = 1 s, que inclina la recta (a).
      arrastres: [
        { id: 'inicio', etiqueta: 'velocidad inicial', color: 'c-o',
          donde: val => { const g = EJES().geometria(ejeVT(val.v0, val.a)); return { x: g.X(0), y: g.Y(val.v0) }; },
          mover: (pt, val) => { const g = EJES().geometria(ejeVT(val.v0, val.a)); return { v0: g.Yi(pt.y) }; } },
        { id: 'pendiente', etiqueta: 'inclinación de la recta', color: 'c-d',
          donde: val => { const g = EJES().geometria(ejeVT(val.v0, val.a)); return { x: g.X(1), y: g.Y(val.v0 + val.a) }; },
          mover: (pt, val) => { const g = EJES().geometria(ejeVT(val.v0, val.a)); return { a: g.Yi(pt.y) - val.v0 }; } },
      ],
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
      ecuacion: [v, ' = ', { llave: [v0], nota: 'al empezar', color: 'c-o' }, ' + ', { llave: [a, ' · ', t], nota: 'lo que cambió', color: 'c-d' }, '   ·   ', x, ' = ', x0, ' + ', v0, t, ' + ½ ', a, { sup: [t, '2'] }],
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
      consigna: 'La pelota sube y baja sola, a velocidad real, y deja una marca cada medio segundo. Mira las dos flechas, también en la cima.',
      voz: 'Fíjate en las dos flechas: una cambia y la otra no.',
      controles: [
        { id: 'v0', etiqueta: 'v₀', color: 'c-o', min: 10, max: 20, paso: 5, inicio: 15, unidad: 'm/s', decimales: 0 },
        // Animación: el reloj corre solo a velocidad real; cada cuadro sale de y = v₀t − ½gt² (torreEn).
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 4, paso: 0.5, inicio: 0.5, unidad: 's', decimales: 1, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: val => torreEn(val.v0, val.t),
      lectura: val => {
        const tv = 2 * val.v0 / G, tt = Math.min(val.t, tv);
        return tt >= tv ? ['En el suelo · ', g, ' = 10 m/s² hacia abajo'] : [v, ` = ${f(val.v0 - G * tt, 1)} m/s · `, g, ' = 10 m/s² hacia abajo'];
      },
      minimo: 3,
      // Arrastra la pelota: el reloj salta al instante del medio segundo cuya altura queda más cerca del dedo. La
      // misma altura sale dos veces (al subir y al bajar): gana el instante más cercano al de ahora y, si empatan,
      // el siguiente. Así arrastrar hacia arriba lleva a la cima y, desde ahí, hacia abajo, a la caída.
      arrastres: [
        { id: 'pelota', etiqueta: 'pelota', color: 'c-h',
          donde: val => ({ x: TORRE().constantes.COLUMNAS[0], y: TORRE().escala(torreEn(val.v0, val.t).datos, alturaEn(val.v0, Math.min(val.t, 2 * val.v0 / G))) - 8 }),
          mover: (pt, val) => {
            const d = torreEn(val.v0, val.t).datos, py = pt.y + 8, tv = 2 * val.v0 / G;
            let mejor = val.t, dm = Infinity;
            for (let k = 0; k <= 8; k++) {
              const tk = k * 0.5, dy = Math.abs(TORRE().escala(d, alturaEn(val.v0, Math.min(tk, tv))) - py);
              const peor = dy > dm + 1e-6 || (Math.abs(dy - dm) <= 1e-6 && (Math.abs(tk - val.t) > Math.abs(mejor - val.t) + 1e-9 || (Math.abs(Math.abs(tk - val.t) - Math.abs(mejor - val.t)) <= 1e-9 && tk < mejor)));
              if (!peor) { mejor = tk; dm = dy; }
            }
            return { t: mejor };
          } },
      ],
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
    // Hallazgo 9: el juego muestra la torre y «Mira» pasa a v–t a propósito: la flecha de v que se vio achicarse es la
    // altura de la recta, y la flecha de g, que no cambia, es su pendiente, la misma también en la cima.
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
      ecuacion: [v, ' = ', v0, ' − ', { llave: [g, t], nota: 'lo que pierde', color: 'c-d' }, '   ·   ', y, ' = ', v0, t, ' − ½ ', g, { sup: [t, '2'] }],
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

  // Motor de la pista con acelerador (lo mismo que dibuja): frena hasta detenerse, sin retroceder.
  const marcasPista = val => { const alto = val.a < 0 ? val.v0 / -val.a : Infinity; return [0, 1, 2, 3, 4, 5].map(k => { const tk = Math.min(k, alto); return val.v0 * tk + val.a * tk * tk / 2; }); };
  const ultima = val => marcasPista(val)[5];
  const frenado = val => (val.a < 0 ? val.v0 * val.v0 / (-2 * val.a) : Infinity);
  // Animación de la mesa: el carrito avanza a velocidad real con x = v₀t + ½at² (el mismo motor de las marcas) y deja la
  // marca del segundo k cuando t llega a k. Si frena hasta v = 0, se queda ahí. A los 5 s espera medio segundo y repite.
  const T_PISTA = 5;
  const momentoPista = val => {
    const alto = val.a < 0 ? val.v0 / -val.a : Infinity, tm = Math.max(0, Math.min(val.t, T_PISTA, alto));
    return { x: val.v0 * tm + val.a * tm * tm / 2, v: val.v0 + val.a * tm, quieto: val.t >= alto };
  };

  return {
    unidad: 'fisica.mruv-y-caida-libre',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/pista.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/torre.js'],
    // Glosario del tema (docs/teoria.md, 4d): las palabras de esta unidad que vinieron de la unidad vieja. «posición»,
    // «velocidad», «rapidez» y las demás se definen en Movimiento rectilíneo uniforme y el lector las marca solas.
    glosario: [
      { termino: 'aceleración', simbolo: 'a', medida: 'm/s²', def: 'Cuánto cambia la velocidad en cada segundo.',
        ejemplo: 'De 0 a 10 m/s en 5 s: a = 2 m/s².', ver: ['velocidad', 'pendiente'] },
      { termino: 'caída libre', def: 'Movimiento de algo que solo cae por la atracción de la Tierra, sin que el aire lo frene.',
        ver: ['gravedad'] },
      { termino: 'gravedad', simbolo: 'g', medida: 'm/s²', def: 'Aceleración hacia abajo que da la Tierra: cerca del suelo, unos 9,8 m/s². En los problemas se usa 10.',
        ver: ['caída libre'] },
    ],
    // Laboratorio: juego libre, sin preguntas. La pista con acelerador junta MRU y MRUV; las otras dos son juegos de la
    // gráfica v–t con su gesto directo.
    laboratorio: [
      {
        id: 'pista-libre', titulo: 'Pista con acelerador', pieza: 'pista',
        consigna: 'El carrito corre solo y marca cada segundo. Elige la salida y la aceleración, y mira cómo se abren o se juntan las marcas.',
        controles: [
          { id: 'v0', etiqueta: 'v₀', color: 'c-o', min: 0, max: 6, paso: 1, inicio: 2, unidad: 'm/s', decimales: 0 },
          { id: 'a', etiqueta: 'a', color: 'c-d', min: -2, max: 2, paso: 1, inicio: 1, unidad: 'm/s²', decimales: 0 },
          { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: T_PISTA + 0.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
        ],
        dibujo: val => {
          // Frena hasta detenerse, sin retroceder: después de parar, las marcas se quedan en el mismo sitio.
          const q = momentoPista(val), ms = marcasPista(val).filter((_, k) => k <= Math.min(val.t, T_PISTA) + 1e-9);
          return { datos: { largo: 60, cada: 10, carriles: [{ x: q.x, marcas: ms, flecha: val.a && !q.quieto ? { a: val.a } : undefined }] }, estado: {} };
        },
        lectura: val => { const q = momentoPista(val); return [t, ` = ${f(Math.min(val.t, T_PISTA), 1)} s · `, v, ` = ${f(q.v, 1)} m/s · `, x, ` = ${f(q.x, 1)} m`]; },
        // Invitaciones: cada una trae logrado(valores, guardados), que comprueba el motor de la mesa (no el texto).
        invitaciones: [
          { texto: 'Haz que el carrito se detenga justo antes de la marca de 10 m.',
            logrado: val => val.a < 0 && val.v0 > 0 && frenado(val) >= 8 && frenado(val) < 10,
            bien: 'Frenó antes de los 10 m. ¿Qué pasa si sales un poco más rápido?' },
          { texto: 'Busca la salida más lenta que igual llegue a 30 m en 5 s.',
            // La más lenta de la grilla: v₀ = 1 con a = 2 llega a 35 m (con v₀ = 0 no pasa de 25 m).
            logrado: val => ultima(val) >= 30 && val.v0 === 1,
            bien: 'Con v₀ = 1 m/s ya alcanza: la aceleración hizo el resto.' },
          { texto: 'Consigue marcas que se junten como un acordeón.',
            logrado: val => val.a < 0 && val.v0 > 0,
            bien: 'Las marcas se juntan porque cada segundo avanza menos.' },
          { texto: 'Pausa el carrito justo sobre la marca de 20 m de la regla.',
            logrado: val => Math.abs(momentoPista(val).x - 20) <= 0.3,
            bien: 'Ahí está: x = 20 m en ese instante. ¿Cuánto marcaba el reloj?',
            pista: 'Pausa cuando pase por 20 m; afina t con − y +.' },
          { texto: 'Guarda dos casos con la misma última marca y distinta aceleración.',
            logrado: (val, guardados) => guardados.some(g => g.a !== val.a && Math.abs(ultima(g) - ultima(val)) < 1e-9)
              && guardados.some(g => g.a === val.a && g.v0 === val.v0),
            bien: 'El mismo lugar a los 5 s, por dos caminos distintos.' },
        ],
      },
      Object.assign({ id: 'ida-vuelta', titulo: 'Ida y vuelta en v–t', pieza: 'ejes' }, juegoIdaVuelta),
      Object.assign({ id: 'recta-vt', titulo: 'La recta v–t', pieza: 'ejes' }, mruv.juega),
    ],
    historia: {
      texto: 'Una caída es demasiado rápida para medirla con relojes de agua. En el siglo XVII, Galileo usó planos inclinados para frenar el movimiento y comparar distancias con tiempos iguales. Nuestras gráficas y ecuaciones son la forma moderna de escribir esas comparaciones.',
      pregunta: '¿Cómo medirías algo que pasa demasiado rápido?',
      fuente: { titulo: 'Museo Galileo — Science of Motion', url: 'https://catalogue.museogalileo.it/section/ScienceOfMotion.html' },
    },
    laboratorioIdeas: {
      'pista-libre': ['pendiente-aceleracion'],
      'ida-vuelta': ['pendiente-aceleracion'],
      'recta-vt': ['pendiente-aceleracion'],
    },
    ideas: [mruv, caida],
  };
});
