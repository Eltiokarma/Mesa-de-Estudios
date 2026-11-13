/*
 * Lección MRU y MRUV, versión A (docs/pogil-v2-rive.md, sección 7.5): la lógica de los cinco tiempos, sin DOM.
 * La física la hace el motor de siempre (motor.js); aquí se decide qué corrida sale de cada gesto, qué marcas
 * deja y cómo se lee cada predicción. Funciona en el navegador (window.LeccionMRUV) y en Node (pruebas).
 *
 * Gesto «soltar» (skill de diseño, fisica-y-gestos): la rapidez del empujón se mide sobre los últimos 100 ms
 * antes de soltar; si el dedo estuvo quieto ese tiempo, es 0. El empujón del dedo es ruidoso, así que la rapidez
 * se ajusta al valor limpio más cercano (2, 4 o 6 m/s) y la página se lo dice al alumno. Sin arrastrar: tres
 * botones, «suave», «medio» y «fuerte», que dan las mismas tres rapideces.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const M = nodo ? require('./motor.js') : root.MotorMRUV;
  const api = fabrica(M);
  if (nodo) module.exports = api;
  else root.LeccionMRUV = api;
})(typeof self !== 'undefined' ? self : this, function (M) {
  'use strict';

  const LARGO = 30;          // metros de pista: a 6 m/s, 5 s de corrida (una corrida no pasa de unos 5 s)
  const TMAX = 5;            // segundos de corrida como máximo
  const RAPIDECES = [2, 4, 6];
  const BOTONES = { suave: 2, medio: 4, fuerte: 6 };
  const VENTANA = 100;       // ms: la rapidez de salida se mide en los últimos 100 ms
  const MINIMO = 0.5;        // m/s: un empujón más lento que esto no suelta el carrito

  /*
   * Rapidez de salida en px/s a partir de las muestras del dedo [{ t (ms), x (px) }, …] y el instante de soltar.
   * Diferencia entre la primera y la última muestra de la ventana; con menos de dos muestras en ella, 0.
   */
  function rapidezDedo(muestras, tSoltar) {
    const fin = tSoltar === undefined ? (muestras.length ? muestras[muestras.length - 1].t : 0) : tSoltar;
    const v = muestras.filter(m => m.t >= fin - VENTANA && m.t <= fin);
    if (v.length < 2) return 0;
    const a = v[0], b = v[v.length - 1];
    return b.t > a.t ? (b.x - a.x) / ((b.t - a.t) / 1000) : 0;
  }

  // Rapidez del dedo en m/s → la rapidez limpia de la corrida (2, 4 o 6 m/s), o null si no alcanza para soltar.
  // Solo hacia adelante: un empujón hacia atrás no suelta el carrito.
  function ajustarRapidez(vMetros) {
    if (!(vMetros >= MINIMO)) return null;
    return RAPIDECES.reduce((a, b) => (Math.abs(b - vMetros) < Math.abs(a - vMetros) ? b : a));
  }

  // Marcas de cada segundo (posiciones en m) de un móvil del motor, de t = 0 hasta dur.
  function marcas(movil, dur) {
    const r = [];
    for (let k = 0; k <= dur + 1e-9; k++) r.push(redondo(movil.x(k)));
    return r;
  }
  const redondo = x => Math.round(x * 1e6) / 1e6;

  // Parte 1: una corrida de MRU desde x = 0. Dura hasta llegar al final de la pista o hasta TMAX.
  function corridaMRU(v) {
    const o = { x0: 0, v0: v, a: 0 };
    const m = M.movil(o);
    const dur = Math.min(TMAX, LARGO / v);
    return { tipo: 'mru', v, motor: o, dur, marcas: marcas(m, dur), x: t => m.x(Math.min(t, dur)), vel: () => v };
  }

  /*
   * Parte 1b: los tres casos de dos carritos (A sale de x = 0; B, de otro punto). Los números son propios.
   * cruce: van uno contra el otro; alcance: A alcanza a B, que va más lento; nunca: B va más rápido que A.
   */
  const CASOS = {
    cruce:   { A: { x0: 0, v0: 4 }, B: { x0: 30, v0: -2 } },
    alcance: { A: { x0: 0, v0: 6 }, B: { x0: 10, v0: 2 } },
    nunca:   { A: { x0: 0, v0: 2 }, B: { x0: 10, v0: 4 } },
  };
  function dosCarritos(caso) {
    const c = CASOS[caso];
    if (!c) throw new Error(`caso desconocido: ${caso}`);
    const A = M.movil(c.A), B = M.movil(c.B);
    // La corrida dura hasta que uno sale de la pista o TMAX.
    const sale = o => (o.v0 > 0 ? (LARGO - o.x0) / o.v0 : o.v0 < 0 ? o.x0 / -o.v0 : Infinity);
    const dur = Math.min(TMAX, sale(c.A), sale(c.B));
    const t = M.cruces(c.A, c.B, dur).filter(x => x > 1e-9)[0];
    const encuentro = t === undefined ? null : { t: redondo(t), x: redondo(A.x(t)), vA: A.v(t), vB: B.v(t) };
    return { caso, dur, A: c.A, B: c.B, marcasA: marcas(A, dur), marcasB: marcas(B, dur),
      xA: tt => A.x(Math.min(tt, dur)), xB: tt => B.x(Math.min(tt, dur)), encuentro,
      rapidezAcercamiento: Math.abs(c.A.v0 - c.B.v0) };
  }

  // ¿Qué tan cerca quedó la bandera del encuentro? Una predicción no es una trampa: solo se mide la distancia.
  function leerBandera(xBandera, enc) {
    if (!enc) return { hay: false, dif: null };
    const dif = redondo(xBandera - enc.x);
    return { hay: true, dif, cerca: Math.abs(dif) <= 1.5 };
  }

  /*
   * Parte 2: el pedal. La página anota cuándo empieza y termina cada pulsación ({ t (s), a }) y la lección arma los
   * tramos del motor. Acelerador: +2 m/s². Freno: −3 m/s². Sin pedal: a = 0 (sigue con la velocidad que lleva).
   * Con frena: true, al llegar a v = 0 el carrito se queda quieto (no da marcha atrás).
   */
  const PEDAL = { acelera: 2, frena: -3, suelto: 0 };
  function tramosDe(eventos) {
    // eventos: [{ t, pedal: 'acelera' | 'frena' | 'suelto' }, …], en orden; el primero en t = 0.
    const tr = [];
    for (let k = 0; k < eventos.length; k++) {
      const e = eventos[k], sig = eventos[k + 1];
      const a = PEDAL[e.pedal];
      if (a === undefined) throw new Error(`pedal desconocido: ${e.pedal}`);
      const dur = sig ? sig.t - e.t : Infinity;
      if (dur <= 1e-9) continue;
      const ult = tr[tr.length - 1];
      if (ult && ult.a === a) ult.dur += dur;      // dos tramos seguidos con el mismo pedal son uno
      else tr.push({ dur, a });
    }
    if (!tr.length) return [{ a: 0 }];
    // El motor quiere el último tramo sin `dur` (sigue para siempre).
    return tr.map(t => (t.dur === Infinity ? { a: t.a } : t));
  }
  function corridaPedal(eventos) {
    const o = { x0: 0, v0: 0, tramos: tramosDe(eventos), frena: true };
    return { motor: o, movil: M.movil(o) };
  }

  /*
   * Predicciones (regla 3: bloquean). Las opciones incorrectas salen de ideas erróneas documentadas en
   * docs/investigacion/cinematica-ideas-erroneas.md. El texto es neutro: ninguna consigna empuja al error.
   */
  const PREDICCIONES = {
    // Parte 1, antes del segundo empujón.
    separacion: {
      pregunta: 'Con un empujón más fuerte, las marcas de cada segundo quedarán…',
      opciones: [
        { id: 'mas-separadas', texto: 'más separadas', correcta: true },
        { id: 'mas-juntas', texto: 'más juntas', error: 'rapidez-junta', explica: 'Juntas sería cierto si en cada segundo avanzara menos.' },
        { id: 'igual', texto: 'igual que antes', error: 'marca-tiempo', explica: 'Igual sería cierto si el empujón no cambiara la rapidez.' },
      ],
    },
    // Parte 1b, caso alcance: en el instante del encuentro.
    k1: {
      pregunta: 'Cuando A pasa a B, ¿cómo son sus rapideces?',
      opciones: [
        { id: 'a-mas', texto: 'A va más rápido', correcta: true },
        { id: 'iguales', texto: 'Son iguales', error: 'K1', explica: 'Estar en el mismo lugar no dice nada de la rapidez: A lo está pasando.' },
        { id: 'b-mas', texto: 'B va más rápido', error: 'K1-inversa', explica: 'Si B fuera más rápido, A no lo alcanzaría.' },
      ],
    },
    // Parte 2, antes de frenar.
    k3: {
      pregunta: 'Mientras frena, sin llegar a pararse, la aceleración apunta…',
      opciones: [
        { id: 'atras', texto: 'hacia atrás', correcta: true },
        { id: 'adelante', texto: 'hacia adelante', error: 'K3', explica: 'Adelante sería cierto si la rapidez aumentara. Al frenar, disminuye.' },
        { id: 'ninguna', texto: 'no hay aceleración', error: 'a-cero', explica: 'Sin aceleración, la rapidez no cambiaría. Al frenar, cambia.' },
      ],
    },
  };
  function responder(id, opcion) {
    const p = PREDICCIONES[id];
    if (!p) throw new Error(`predicción desconocida: ${id}`);
    const o = p.opciones.find(x => x.id === opcion);
    if (!o) throw new Error(`opción desconocida: ${opcion}`);
    return { correcta: !!o.correcta, error: o.error || null, explica: o.explica || null };
  }

  return { LARGO, TMAX, RAPIDECES, BOTONES, VENTANA, PEDAL, CASOS, PREDICCIONES,
    rapidezDedo, ajustarRapidez, marcas, corridaMRU, dosCarritos, leerBandera, tramosDe, corridaPedal, responder };
});
