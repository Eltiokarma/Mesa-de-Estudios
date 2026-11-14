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
  // x0: donde el alumno soltó el carrito (lo arrastra unos metros antes de soltarlo).
  function corridaMRU(v, x0 = 0) {
    const o = { x0, v0: v, a: 0 };
    const m = M.movil(o);
    const dur = Math.min(TMAX, (LARGO - x0) / v);
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
    // La misma, si el primer empujón ya fue el más fuerte (6 m/s): se compara con uno más suave.
    separacionSuave: {
      pregunta: 'Con un empujón más suave, las marcas de cada segundo quedarán…',
      opciones: [
        { id: 'mas-juntas', texto: 'más juntas', correcta: true },
        { id: 'mas-separadas', texto: 'más separadas', error: 'rapidez-junta', explica: 'Separadas sería cierto si en cada segundo avanzara más.' },
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
  // Sesiones 2 y 3.
  Object.assign(PREDICCIONES, {
    // Parte 3, antes de pintar.
    area: {
      pregunta: 'Lo que hay debajo de tu gráfica v-t, ¿qué mide?',
      opciones: [
        { id: 'avance', texto: 'Cuánto avanzó', correcta: true },
        { id: 'aceleracion', texto: 'Cuánto aceleró', error: 'G4', explica: 'La aceleración se lee en la inclinación de la gráfica, no en lo que hay debajo.' },
        { id: 'rapidez', texto: 'Qué tan rápido iba', error: 'G2', explica: 'La rapidez se lee en la altura de la gráfica en cada instante.' },
      ],
    },
    // Parte 4, antes de lanzar.
    c1: {
      pregunta: 'En el punto más alto, la aceleración de la pelota…',
      opciones: [
        { id: 'g-abajo', texto: 'es g, hacia abajo', correcta: true },
        { id: 'cero', texto: 'es cero', error: 'C1', explica: 'Ahí la velocidad es cero, no la aceleración. Si fuera cero, se quedaría flotando.' },
        { id: 'arriba', texto: 'apunta hacia arriba', error: 'K3', explica: 'Arriba sería cierto si la rapidez de subida aumentara. Disminuye.' },
      ],
    },
    // Parte 4, antes de soltar las dos pelotas.
    c2: {
      pregunta: 'Sueltas a la vez una pelota de 1 kg y otra de 5 kg. ¿Cuál llega primero al suelo?',
      opciones: [
        { id: 'juntas', texto: 'Llegan juntas', correcta: true },
        { id: 'pesada', texto: 'La de 5 kg', error: 'C2', explica: 'Sería cierto con mucho aire. Sin aire, las dos caen con la misma aceleración.' },
        { id: 'liviana', texto: 'La de 1 kg', error: 'C2-inversa', explica: 'Sin aire, la masa no cambia la aceleración de caída.' },
      ],
    },
    // Parte 5, el paso por elegir del ejemplo resuelto.
    paso: {
      pregunta: 'Del tramo en que va a rapidez constante, ¿qué calculas?',
      opciones: [
        { id: 'rectangulo', texto: 'El área del rectángulo', correcta: true },
        { id: 'pendiente', texto: 'La pendiente del tramo', error: 'G4', explica: 'La pendiente ahí es cero: diría que no avanzó, y sí avanzó.' },
        { id: 'triangulo', texto: 'La mitad de base por altura', error: 'sin-mitad-inversa', explica: 'La mitad es para los tramos inclinados. Este es un rectángulo.' },
      ],
    },
  });

  function responder(id, opcion) {
    const p = PREDICCIONES[id];
    if (!p) throw new Error(`predicción desconocida: ${id}`);
    const o = p.opciones.find(x => x.id === opcion);
    if (!o) throw new Error(`opción desconocida: ${opcion}`);
    return { correcta: !!o.correcta, error: o.error || null, explica: o.explica || null };
  }

  // ======================= Sesión 2: pintar el área (parte 3) =======================
  // Si el alumno no trae su corrida del pedal (otro día, otro celular), se usa esta: acelera 3 s, sigue 1 s y frena.
  const CORRIDA_DEFECTO = [{ t: 0, pedal: 'acelera' }, { t: 3, pedal: 'suelto' }, { t: 4, pedal: 'frena' }];
  const CUADRITO = { t: 1, v: 2 };          // cada cuadrito de la gráfica v-t: 1 s × 2 m/s = 2 m
  /*
   * Tramos de la corrida, hasta que se detiene (o hasta tFin): por cada tramo, su inicio, su fin, las velocidades
   * y lo que avanzó (el área bajo v-t, que el motor da como desplazamiento). La suma es lo que marca la regla.
   */
  function areas(eventos, tFin) {
    const { movil } = corridaPedal(eventos);
    const fin = movil.tParada !== null ? movil.tParada : tFin;
    if (!(fin > 0)) throw new Error('la corrida no avanzó');
    const r = [];
    for (const s of movil.segmentos) {
      const t0 = s.t0, t1 = Math.min(s.t0 + s.dur, fin);
      if (t1 - t0 <= 1e-9) continue;
      r.push({ t0: redondo(t0), t1: redondo(t1), v0: redondo(movil.v(t0)), v1: redondo(movil.v(t1)), a: s.a,
        area: redondo(movil.desplazamiento(t0, t1)), forma: s.a === 0 ? 'rectangulo' : Math.abs(movil.v(t0)) < 1e-9 || Math.abs(movil.v(t1)) < 1e-9 ? 'triangulo' : 'trapecio' });
      if (t1 >= fin - 1e-9) break;
    }
    return { tramos: r, total: redondo(movil.x(fin) - movil.x(0)), fin: redondo(fin), movil };
  }
  // Área pintada hasta el instante t (lo que avanzó hasta ahí) y cuántos cuadritos son.
  function pintado(eventos, t) {
    const { movil } = corridaPedal(eventos);
    const a = redondo(movil.x(Math.max(0, t)) - movil.x(0));
    return { area: a, cuadritos: redondo(a / (CUADRITO.t * CUADRITO.v)) };
  }

  // ======================= Sesión 3: la pista parada (parte 4) =======================
  const ALTO = 20;                           // metros de la torre: con 20 m/s hacia arriba sube justo 20 m
  const LANZAMIENTOS = [10, 15, 20];         // m/s hacia arriba (el empujón se ajusta a uno de estos)
  // Marcas cada medio segundo (en caída libre, un segundo es poco: hay pocas marcas).
  function lanzar(v0) {
    const L = M.lanzamientoVertical({ y0: 0, v0 });
    const m = M.movil(L.movil);
    const dur = L.tSuelo;
    const marcas = [];
    for (let k = 0; k * 0.5 <= dur + 1e-9; k++) marcas.push(redondo(m.x(k * 0.5)));
    return { v0, dur: redondo(dur), tCima: redondo(L.tSubida), cima: redondo(L.H), marcas, y: t => Math.max(0, m.x(Math.min(t, dur))), v: t => m.v(Math.min(t, dur)), a: () => -M.G };
  }
  // Dos pelotas soltadas desde la misma altura: el motor no recibe la masa, porque sin aire la aceleración es g para las dos.
  function soltarDos(alto = ALTO) {
    const L = M.lanzamientoVertical({ y0: alto, v0: 0 });
    const m = M.movil(L.movil);
    return { tSuelo: redondo(L.tSuelo), y: t => Math.max(0, m.x(Math.min(t, L.tSuelo))) };
  }

  // ======================= Sesión 3: transferir (parte 5) =======================
  // Problemas propios con la forma de los de admisión: parte del reposo, acelera, sigue y frena hasta parar.
  const PROBLEMAS = [
    { id: 'auto', texto: 'Un auto parte del reposo y su velocidad cambia como muestra la gráfica. ¿Cuánto avanzó hasta detenerse?', tramos: [{ dur: 4, a: 3 }, { dur: 6, a: 0 }, { dur: 3, a: -4 }] },
    { id: 'bus', texto: 'Un bus parte del reposo y su velocidad cambia como muestra la gráfica. ¿Cuánto avanzó hasta detenerse?', tramos: [{ dur: 5, a: 2 }, { dur: 4, a: 0 }, { dur: 2, a: -5 }] },
    { id: 'moto', texto: 'Una moto parte del reposo y su velocidad cambia como muestra la gráfica. ¿Cuánto avanzó hasta detenerse?', tramos: [{ dur: 3, a: 4 }, { dur: 5, a: 0 }, { dur: 4, a: -3 }] },
  ];
  /*
   * El problema resuelto por el motor y sus alternativas. Cada distractor es un error con nombre:
   *   G4 (pendiente cuando se pide área), sin-mitad (los triángulos como rectángulos; da lo mismo que vmax × tiempo total)
 *   y solo-constante (solo el tramo de rapidez constante).
   */
  function problema(id) {
    const p = PROBLEMAS.find(x => x.id === id);
    if (!p) throw new Error(`problema desconocido: ${id}`);
    const m = M.movil({ x0: 0, v0: 0, tramos: p.tramos.map(t => ({ ...t })) });
    const fin = p.tramos.reduce((a, t) => a + t.dur, 0);
    const vmax = Math.max(...p.tramos.map((_, k) => m.v(p.tramos.slice(0, k + 1).reduce((a, t) => a + t.dur, 0))));
    let t0 = 0; const partes = [];
    for (const tr of p.tramos) { partes.push({ t0, t1: t0 + tr.dur, area: redondo(m.desplazamiento(t0, t0 + tr.dur)), a: tr.a }); t0 += tr.dur; }
    const total = redondo(m.x(fin));
    const sinMitad = redondo(partes.reduce((a, q) => a + (q.a === 0 ? q.area : 2 * q.area), 0));
    const pendientes = redondo(p.tramos.reduce((a, t) => a + Math.abs(t.a), 0));
    const opciones = [
      { id: 'area', valor: total, correcta: true },
      { id: 'sin-mitad', valor: sinMitad, error: 'sin-mitad', explica: 'Eso sería cierto si los tramos inclinados fueran rectángulos. Son triángulos: la mitad.' },
      { id: 'solo-constante', valor: redondo(partes.filter(q => q.a === 0).reduce((a, q) => a + q.area, 0)), error: 'solo-constante', explica: 'Eso sería cierto si al arrancar y al frenar no avanzara. También avanza.' },
      { id: 'pendiente', valor: pendientes, error: 'G4', explica: 'Sumaste pendientes, que son aceleraciones. Lo que avanzó es el área bajo la gráfica.' },
    ];
    if (new Set(opciones.map(o => o.valor)).size !== opciones.length) throw new Error(`${id}: dos alternativas valen lo mismo`);
    return { ...p, movil: m, fin, vmax: redondo(vmax), partes, total, opciones };
  }

  return { LARGO, TMAX, RAPIDECES, BOTONES, VENTANA, PEDAL, CASOS, PREDICCIONES,
    CORRIDA_DEFECTO, CUADRITO, areas, pintado, ALTO, LANZAMIENTOS, lanzar, soltarDos, PROBLEMAS, problema,
    rapidezDedo, ajustarRapidez, marcas, corridaMRU, dosCarritos, leerBandera, tramosDe, corridaPedal, responder };
});
