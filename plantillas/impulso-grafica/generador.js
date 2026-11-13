/*
 * Generador «La patada en la gráfica»: impulso como área bajo una gráfica F-t, rapidez final,
 * trabajo con el teorema trabajo-energía y rebote con coeficiente de restitución y pérdida de
 * energía por el aire. Unidad fisica.impulso-y-choques.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['impulso-grafica']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   rapidez   una fuerza variable, dada por los vértices de su gráfica F-t (triángulo, trapecio o
 *             escalón), empuja un cuerpo en línea recta, en el sentido de su movimiento.
 *             sub reposo   parte del reposo: la rapidez final, J/m
 *             sub inicial  ya se movía a v0 en el mismo sentido: v0 + J/m
 *   trabajo   una patada (gráfica F-t en milisegundos) sobre una pelota que ya rodaba:
 *             sub mismo    rodaba en el sentido de la patada
 *             sub contra   venía hacia el pie y sale rebotada en sentido contrario
 *             El trabajo de la fuerza es ½m(vf² − v0²), con vf = v0 + J/m (con signo).
 *   rebote    una pelota se suelta desde una altura H; el aire le quita un porcentaje de su
 *             energía en la bajada (y, en un subtipo, otro en la subida); el piso la devuelve con
 *             rapidez e·v. Se pide la altura que alcanza tras el primer bote.
 *             sub solo-e   sin aire (solo la restitución)
 *             sub bajada   el aire actúa en la bajada
 *             sub ambas    el aire actúa en la bajada y en la subida
 *
 * Convenciones: g = 10 m/s². En la gráfica F-t, F en N y t en s o en ms (se dice en cada caso);
 * entre vértices la gráfica es recta, y un escalón es un salto vertical. La fuerza es en el
 * sentido del eje +x. Las pérdidas por el aire son porcentajes de la energía mecánica que el
 * cuerpo tenía al empezar ese tramo.
 * Errores: G4 (parcial, docs/investigacion/cinematica-ideas-erroneas.md: «pendiente cuando se pide área,
 * o se lee el eje vertical»); M2 (parcial, docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md);
 * PR3 y U2 (hipótesis, docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md); IG- y CH- nuevos, hipótesis
 * (trampas 26 y 32 de docs/clasificacion/trampas-admision-unmsm/fisica.md y las filas del lote).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'impulso-grafica';
  const CIN = 'docs/investigacion/cinematica-ideas-erroneas.md';
  const MOM = 'docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md';
  const TRANS = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const TRAMPAS = 'docs/clasificacion/trampas-admision-unmsm/fisica.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: TRAMPAS });
  const tr = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: TRANS });
  const pa = (id, valor, explicacion, fuente) => ({ id, valor, explicacion, respaldo: 'parcial', fuente });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const limpio = (x, dec = 2) => Number.isFinite(x) && x > 0 && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && x < 1e6;
  const G = 10;
  const decimales = t => { const m = t.match(/,(\d+)/); return m ? m[1].length : 0; };
  const masLimpia = alt => { const c = alt.find(a => a.correcta); return decimales(c.texto) < Math.min(...alt.filter(a => !a.correcta).map(a => decimales(a.texto))); };

  const TIPOS = [['rapidez', 'reposo'], ['rapidez', 'reposo'], ['rapidez', 'inicial'], ['rapidez', 'inicial'],
    ['trabajo', 'mismo'], ['trabajo', 'mismo'], ['trabajo', 'contra'], ['trabajo', 'contra'],
    ['rebote', 'solo-e'], ['rebote', 'bajada'], ['rebote', 'bajada'], ['rebote', 'ambas'], ['rebote', 'ambas']];

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const [tipo, sub] = rng.elegir(TIPOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = tipo === 'rapidez' ? rapidez(rng, semilla, sub) : tipo === 'trabajo' ? trabajo(rng, semilla, sub) : rebote(rng, semilla, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cerrar(rng, semilla, o) {
    // Fuera los distractores de más de 20 veces la correcta (o menos de 1/20): no engañan a nadie.
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && P.enEscala(e.valor, o.correcta, e.id)), rng, texto: x => `${f(x)} ${o.unidad}` });
    if (masLimpia(alternativas)) return null; // la correcta no debe ser la única redonda
    const pr = {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
    return o.viva ? Object.assign(pr, o.viva(alternativas, pr.respuesta)) : pr;
  }

  // ================= escena viva (docs/escena-viva.md): la gráfica F-t del kit =================
  // Tipos «rapidez» y «trabajo» (nucleo/kit/piezas/ejes.js): la gráfica carga los vértices (con guías hasta los ejes),
  // el impulso aparece como área en el primer paso y la respuesta se arrastra en una regla debajo. El rebote no tiene
  // gráfica F-t: sigue con su solución de siempre.
  const BONITOS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100];
  const pasoBonito = tope => BONITOS.reduce((q, b) => (b <= tope + 1e-12 ? b : q), BONITOS[0]);
  function escala(hi) {
    const tick = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000].find(q => (hi * 1.08) / q <= 8) || 2000;
    return { max: Math.ceil((hi * 1.08) / tick) * tick, tick };
  }
  function pasoArrastre(alts, max) {
    const vals = alts.map(a => a.valor);
    let hueco = Infinity;
    for (let i = 0; i < vals.length; i++) for (let j = i + 1; j < vals.length; j++) hueco = Math.min(hueco, Math.abs(vals[i] - vals[j]));
    return pasoBonito(Math.min(max / 150, hueco / 2));
  }
  const ROT = { 'IG-fmax-por-tiempo': 'fuerza máx. × t', 'G4-lee-eje': 'fuerza máxima', 'PR3-sin-medio': 'sin el ½', 'IG-solo-meseta': 'solo lo plano',
    'IG-promedio-vertices': 'promedio', 'IG-sin-v0': 'sin v0', 'IG-v0-nula': 'desde el reposo', 'IG-sin-ec-inicial': 'solo Ec final',
    'M2-sin-signo': 'sin el signo', 'IG-resta-cuadrado': '(vf − v0)²' };
  const pasoV = (corte, texto, ecuacion, final) => ({ estado: final ? { corte, final: true } : { corte }, texto, ecuacion });
  // o: { pts (en s), ut ('s' | 'ms'), J, regla: { nombre, unidad }, sufijo, pasos, alt }
  function vivaFT(alts, resp, o) {
    const sc = o.ut === 'ms' ? 1000 : 1, P2 = o.pts.map(([t, F]) => [Math.round(t * sc * 1e6) / 1e6, F]);
    const T = P2[P2.length - 1][0], Fm = fmax(o.pts);
    const er = escala(Math.max(...alts.map(a => a.valor)));
    const paso = pasoArrastre(alts, er.max);
    // Vértices con guías (sin repetir el origen ni el final en el eje).
    const puntos = P2.filter(([, F]) => F > 0).map(([t, F]) => ({ x: t, y: F, color: 'o', guias: true, desde: 0 }));
    const datos = {
      x: { min: 0, max: T, paso: 1, nombre: 't', unidad: o.ut, decimales: 2 },
      y: { min: 0, max: Fm * 1.1, paso: Fm / 4, nombre: 'F', unidad: 'N', decimales: 2 },
      curvas: [{ puntos: P2, color: 'o', desde: 0 }],
      areas: [{ puntos: P2, color: 'o', rotulo: `J = ${f(o.J)} N·s`, desde: 1 }],
      puntos,
      marca: { eje: 'regla', min: 0, max: er.max, inicio: 0, paso: er.tick, nombre: o.regla.nombre, unidad: o.regla.unidad, color: 'd' },
      respuesta: resp.valor, sufijo: o.sufijo, decimales: 2,
    };
    const fantasmas = {};
    const veces = id => alts.filter(a => a.error && a.error.id === id).length;
    for (const a of alts) if (a.error) fantasmas[a.error.id] = veces(a.error.id) > 1 ? {} : { marca: a.valor, rotulo: ROT[a.error.id] || 'tu opción' };
    return { escena: { pieza: 'ejes', datos, alt: o.alt }, fantasmas, pasos: o.pasos,
      respuesta: { ...resp, tipo: 'arrastrar', control: 'marca', paso, tolerancia: paso } };
  }
  const altFT = (pts, ut) => `Gráfica F-t: ${vertices(pts, ut).replace(/ y \(/, '; (')}, unidos por rectas`;

  // ---- La gráfica F-t: vértices [t, F] ----
  // Área exacta por trapecios entre vértices consecutivos (un salto vertical aporta 0).
  const area = pts => pts.slice(1).reduce((s, q, i) => s + (q[0] - pts[i][0]) * (q[1] + pts[i][1]) / 2, 0);
  const fmax = pts => Math.max(...pts.map(p => p[1]));
  const duracion = pts => pts[pts.length - 1][0] - pts[0][0];
  // Área sin el ½ de los tramos inclinados: cada tramo como un rectángulo con su fuerza mayor.
  const areaSinMedio = pts => pts.slice(1).reduce((s, q, i) => s + (q[0] - pts[i][0]) * Math.max(q[1], pts[i][1]), 0);
  // Solo la parte plana (tramos de fuerza constante distinta de cero).
  const meseta = pts => pts.slice(1).reduce((s, q, i) => s + (q[1] === pts[i][1] ? (q[0] - pts[i][0]) * q[1] : 0), 0);
  // Promedio de las fuerzas de los vértices por la duración.
  const promedioVertices = pts => pts.reduce((s, p) => s + p[1], 0) / pts.length * duracion(pts);

  // forma, escala de fuerzas y de tiempos → vértices
  const r6 = x => Math.round(x * 1e6) / 1e6;
  function grafica(rng, forma, Fs, ts) { return crudo(rng, forma, Fs, ts).map(([t, F]) => [r6(t), F]); }
  function crudo(rng, forma, Fs, ts) {
    if (forma === 'triangulo') { const a = rng.entero(1, 4), b = a + rng.entero(1, 4); return [[0, 0], [a * ts, Fs], [b * ts, 0]]; }
    if (forma === 'trapecio') { const a = rng.entero(1, 3), b = a + rng.entero(1, 4), c = b + rng.entero(1, 3); return [[0, 0], [a * ts, Fs], [b * ts, Fs], [c * ts, 0]]; }
    if (forma === 'rampa') { const a = rng.entero(1, 3), b = a + rng.entero(1, 4); return [[0, 0], [a * ts, Fs], [b * ts, Fs], [b * ts, 0]]; }
    // escalón: F1 un rato y luego F2 (menor), con salto vertical
    const a = rng.entero(1, 4), b = a + rng.entero(1, 4), F2 = Fs * rng.elegir([0.25, 0.5, 0.75]);
    return [[0, Fs], [a * ts, Fs], [a * ts, F2], [b * ts, F2]];
  }
  const NOMBRES = { triangulo: 'un triángulo', trapecio: 'un trapecio', rampa: 'una rampa que sube y luego se mantiene', escalon: 'un escalón' };
  // Texto de los vértices: «(0 s; 0 N), (2 s; 40 N) y (5 s; 0 N)».
  function vertices(pts, ut) {
    const sc = ut === 'ms' ? 1000 : 1;
    const t = pts.map(p => `(${f(p[0] * sc)} ${ut}; ${f(p[1])} N)`);
    return t.slice(0, -1).join(', ') + ' y ' + t[t.length - 1];
  }
  function describir(pts, forma, ut) {
    const base = `La gráfica fuerza-tiempo es ${NOMBRES[forma]}: una línea que une, en orden, los puntos ${vertices(pts, ut)}`;
    if (forma === 'escalon') return base + ' (en el instante del salto la fuerza baja de golpe).';
    if (forma === 'rampa') return base + ' (al final la fuerza cae de golpe a cero).';
    return base + '.';
  }
  const pasosArea = (pts, ut) => {
    const sc = ut === 'ms' ? 1000 : 1, partes = [];
    pts.slice(1).forEach((q, i) => {
      const p = pts[i], dt = q[0] - p[0];
      if (dt === 0) return;
      if (p[1] === q[1]) partes.push(`${f(q[1])} · ${f(dt * sc)}`);
      else partes.push(`(${f(p[1])} + ${f(q[1])})/2 · ${f(dt * sc)}`);
    });
    return partes.join(' + ');
  };

  const VAR = { J: { nombre: 'impulso (área bajo F-t)', color: 'o' }, m: { nombre: 'masa', color: 'i' }, v0: { nombre: 'rapidez inicial', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };

  // ---- rapidez: desde el reposo o con rapidez inicial ----
  function rapidez(rng, semilla, sub) {
    const forma = rng.elegir(['triangulo', 'trapecio', 'rampa', 'escalon']);
    const Fs = rng.elegir([10, 20, 30, 40, 50, 60, 80, 100, 120]), m = rng.elegir([1, 2, 4, 5, 8, 10, 20]);
    const pts = grafica(rng, forma, Fs, 1);
    const J = area(pts), v0 = sub === 'inicial' ? rng.elegir([1, 2, 3, 4, 5, 6, 8]) : 0, vf = v0 + J / m;
    if (!limpio(J / m) || J / m > 60 || J / m < 0.5) return null;
    const [quien, lugar] = rng.elegir([['Un bloque de ', 'sobre una pista de hielo sin roce'], ['Un carrito de ', 'sobre un riel horizontal sin roce'], ['Una caja de ', 'sobre un piso horizontal muy liso']]);
    // La gráfica carga la fuerza en cada instante: el enunciado no la narra.
    const enunciado = [quien, v('m', `${f(m)} kg`), ...(sub === 'inicial' ? [' se mueve a ', v('v0', `${f(v0)} m/s`), ` hacia +x ${lugar}.`] : [` está en reposo ${lugar}.`]),
      ' Desde t = 0 actúa, hacia +x, la fuerza horizontal de la gráfica.'];
    const pregunta = ['¿Con qué ', v('x', 'rapidez'), ' queda al final del empuje?'];
    const Fm = fmax(pts), T = duracion(pts);
    const errores = [
      h('IG-fmax-por-tiempo', v0 + Fm * T / m, `Fuerza por tiempo vale si es constante; aquí no vale ${f(Fm)} N todo el rato: cuenta el área.`),
      pa('G4-lee-eje', v0 + Fm / m, `${f(Fm)} N es la fuerza mayor, bien leída; el impulso no es una altura, es el área.`, CIN),
      tr('PR3-sin-medio', v0 + areaSinMedio(pts) / m, 'Sumar tramo por tramo está bien; un tramo inclinado aporta (F1 + F2)/2 · Δt, no su fuerza mayor.'),
      ...(meseta(pts) > 0 && meseta(pts) < J - 1e-9 ? [h('IG-solo-meseta', v0 + meseta(pts) / m, 'Los tramos planos están bien contados; las rampas también empujan, y su área también es impulso.')] : []),
      h('IG-promedio-vertices', v0 + promedioVertices(pts) / m, 'Buscar una fuerza media está bien; pero los tramos duran distinto: el promedio de los vértices no la da.'),
      ...(sub === 'inicial' ? [h('IG-sin-v0', J / m, `${f(J / m)} m/s es lo que gana, bien calculado; ya iba a ${f(v0)} m/s hacia +x: se suman.`)] : []),
    ];
    const solucion = [
      ['El impulso es el área bajo la gráfica F-t: ', v('J', 'J'), ` = ${pasosArea(pts, 's')} = `, v('J', `${f(J)} N·s`), '.'],
      ['Teorema del impulso: ', v('J', 'J'), ' = ', v('m', 'm'), '·(vf − ', v('v0', 'v0'), ').'],
      [v('x', 'vf'), ' = ', v('v0', f(v0)), ' + ', v('J', f(J)), '/', v('m', f(m)), ' = ', v('x', `${f(vf)} m/s`), '.'],
    ];
    const viva = (alts, resp) => vivaFT(alts, resp, {
      pts, ut: 's', J, regla: { nombre: 'vf', unidad: 'm/s' }, sufijo: ' m/s', alt: altFT(pts, 's'),
      pasos: [
        pasoV(1, ['El impulso es el área bajo la gráfica F-t.'], [v('J', 'J'), ` = ${pasosArea(pts, 's')} = `, v('J', `${f(J)} N·s`)]),
        pasoV(2, ['El impulso cambia la cantidad de movimiento: J = m·(vf − v0).'],
          [v('x', 'vf'), ' = ', v('v0', f(v0)), ' + ', v('J', f(J)), '/', v('m', f(m)), ' = ', v('x', `${f(vf)} m/s`)], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: vf, unidad: 'm/s', errores, variables: VAR, enunciado, pregunta, solucion, viva,
      datos: { tipo: 'rapidez', sub, puntos: pts, unidadT: 's', m, v0 } });
  }

  // ---- trabajo: patada con la pelota que ya rodaba ----
  function trabajo(rng, semilla, sub) {
    const forma = rng.elegir(['triangulo', 'trapecio', 'triangulo']);
    const Fs = rng.elegir([200, 300, 400, 500, 600, 800, 1000, 1200]), m = rng.elegir([0.4, 0.45, 0.5, 0.6]);
    const pts = grafica(rng, forma, Fs, 0.001);
    const J = area(pts), dv = J / m, v0 = rng.elegir([2, 3, 4, 5, 6, 8]);
    if (!limpio(J) || !limpio(dv) || dv > 40 || dv < 4) return null;
    const contra = sub === 'contra';
    if (contra && dv < 2 * v0 + 2 - 1e-9) return null; // sale al menos 2 m/s más rápido de lo que llegó: trabajo positivo
    const vf = contra ? dv - v0 : v0 + dv;    // rapidez final (en el sentido de la patada)
    const W = m * (vf * vf - v0 * v0) / 2;
    if (!limpio(W)) return null;
    const Fm = fmax(pts), T = duracion(pts);
    const enunciado = [`Una pelota de `, v('m', `${f(m)} kg`), contra ? ' viene rodando hacia un futbolista a ' : ' rueda alejándose de un futbolista a ', v('v0', `${f(v0)} m/s`),
      contra ? '. Él la patea de vuelta, en sentido contrario. ' : '. Él la alcanza y la patea hacia el mismo lado. ',
      'La gráfica muestra la fuerza del pie. Desprecia el roce con el piso.'];
    const pregunta = ['¿Cuánto ', v('x', 'trabajo'), ' hizo el pie?'];
    const kin = (a, b) => m * (a * a - b * b) / 2;
    const errores = [
      h('IG-v0-nula', m * dv * dv / 2, `Ese trabajo valdría si partiera del reposo; ya rodaba a ${f(v0)} m/s, y esa energía se resta.`),
      h('IG-sin-ec-inicial', m * vf * vf / 2, 'La energía cinética final está bien; el trabajo es su cambio: falta restar la inicial.'),
      tr('PR3-sin-medio', 2 * W, 'Restar energías es el camino; a la energía cinética le falta el ½: Ec = ½·m·v².'),
      h('IG-fmax-por-tiempo', kin(contra ? Fm * T / m - v0 : v0 + Fm * T / m, v0), `Fuerza por tiempo vale si es constante; aquí no vale ${f(Fm)} N todo el rato: cuenta el área.`),
      ...(contra ? [pa('M2-sin-signo', kin(dv + v0, v0), `Sumar v0 valdría si rodara hacia donde va la patada; venía en contra: v0 = −${f(v0)} m/s.`, MOM),
        h('IG-resta-cuadrado', m * (vf - v0) ** 2 / 2, 'Usar ½·m·v² está bien; se resta Ec final menos Ec inicial, no se eleva la resta al cuadrado.')] : []),
    ];
    const solucion = [
      ['Impulso = área bajo F-t (con t en segundos): ', v('J', 'J'), ` = ${pasosArea(pts, 'ms')} = ${f(J * 1000)} N·ms = `, v('J', `${f(J)} N·s`), '.'],
      contra
        ? ['Con el eje en el sentido de la patada, la pelota llega con −', v('v0', f(v0)), ' m/s: vf = −', v('v0', f(v0)), ' + ', v('J', f(J)), '/', v('m', f(m)), ` = ${f(vf)} m/s.`]
        : ['vf = ', v('v0', f(v0)), ' + ', v('J', f(J)), '/', v('m', f(m)), ` = ${f(vf)} m/s.`],
      ['El trabajo de la fuerza es el cambio de energía cinética: ', v('x', 'W'), ' = ½·', v('m', f(m)), `·(${f(vf)}² − `, v('v0', f(v0)), '²) = ', v('x', `${f(W)} J`), '.'],
    ];
    const viva = (alts, resp) => vivaFT(alts, resp, {
      pts, ut: 'ms', J, regla: { nombre: 'W', unidad: 'J' }, sufijo: ' J', alt: altFT(pts, 'ms'),
      pasos: [
        pasoV(1, ['El impulso es el área bajo la gráfica; 1 ms es 0,001 s.'], [v('J', 'J'), ` = ${f(J * 1000)} N·ms = `, v('J', `${f(J)} N·s`)]),
        contra
          ? pasoV(1, ['Con el eje hacia la patada, la pelota llega con velocidad negativa.'], ['vf = −', v('v0', f(v0)), ' + ', v('J', f(J)), '/', v('m', f(m)), ` = ${f(vf)} m/s`])
          : pasoV(1, ['El impulso le suma rapidez en el sentido en que rodaba.'], ['vf = ', v('v0', f(v0)), ' + ', v('J', f(J)), '/', v('m', f(m)), ` = ${f(vf)} m/s`]),
        pasoV(1, ['El trabajo es el cambio de energía cinética.'], [v('x', 'W'), ' = ½·', v('m', f(m)), `·(${f(vf)}² − `, v('v0', f(v0)), '²) = ', v('x', `${f(W)} J`)], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: W, unidad: 'J', errores, variables: VAR, enunciado, pregunta, solucion, viva,
      datos: { tipo: 'trabajo', sub, puntos: pts, unidadT: 'ms', m, v0 } });
  }

  // ---- rebote: restitución y aire ----
  function rebote(rng, semilla, sub) {
    const H = rng.elegir([1.25, 2, 2.5, 3.2, 4, 5, 8, 10, 12.5, 20]), e = rng.elegir([0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
    const p = sub === 'solo-e' ? 0 : rng.elegir([10, 19, 20, 25, 36, 50]), q = sub === 'ambas' ? rng.elegir([10, 20, 25, 50]) : 0;
    const kp = 1 - p / 100, kq = 1 - q / 100, hp = e * e * H * kp * kq;
    if (!limpio(hp)) return null;
    const [pelota, corto] = rng.elegir([['Una pelota de básquet', 'la pelota'], ['Una pelota de trapo', 'la pelota'], ['Una pelota de vóley', 'la pelota'], ['Una canica de vidrio', 'la canica']]);
    const variables = { H: { nombre: 'altura inicial', color: 'o' }, e: { nombre: 'coeficiente de restitución', color: 'i' }, p: { nombre: 'pérdida por el aire', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    // Sin gráfica F-t: sin escena; el texto, en frases completas dentro del presupuesto (docs/escena-viva.md).
    const piso = ['. El coeficiente de restitución es ', v('e', `e = ${f(e)}`), '.'];
    const enunciado = sub === 'solo-e'
      ? [`${pelota} se suelta desde `, v('H', `${f(H)} m`), ' y bota en el piso. Desprecia el aire', ...piso]
      : sub === 'bajada'
        ? [`${pelota} se suelta desde `, v('H', `${f(H)} m`), '. Al caer, el aire le quita el ', v('p', `${p} %`), ' de su energía; al subir, nada', ...piso]
        : [`${pelota} se suelta desde `, v('H', `${f(H)} m`), '. Al caer, el aire le quita el ', v('p', `${p} %`), ' de su energía; al subir, el ',
          v('p', `${q} %`), ' de la que tiene al salir del piso', ...piso];
    const pregunta = ['¿Qué ', v('x', 'altura'), ' alcanza tras el primer bote?'];
    const errores = [
      h('CH-e-en-la-altura', e * H * kp * kq, `e compara rapideces, bien; la altura va con el cuadrado de la rapidez: se multiplica por e² = ${f(e * e)}.`),
      h('CH-e-como-perdida', (1 - e) * H * kp * kq, 'Usar e está bien; no es lo que se pierde, sino salida entre llegada: la altura va con e².'),
      ...(sub === 'solo-e' ? [
        h('CH-e2-como-perdida', (1 - e * e) * H, "Usar e² está bien; pero e² es lo que la pelota conserva, no lo que pierde: h' = e²·H."),
        h('CH-raiz-de-e', Math.sqrt(e) * H, "Relacionar e con la altura está bien; la altura va con v², así que h' = e²·H."),
      ] : [
        h('CH-sin-aire', e * e * H, `e²·H está bien para el bote; falta lo que quita el aire${sub === 'ambas' ? ' al bajar y al subir' : ' al bajar'}.`),
        h('CH-aire-en-la-rapidez', e * e * H * kp * kp * kq * kq, `El porcentaje está bien, pero se aplica a la energía: queda el ${100 - p} % de la energía, no de la rapidez.`),
        ...(sub === 'ambas' ? [h('CH-aire-una-vez', e * e * H * kp, `La bajada está bien contada; al subir, el aire también le quita el ${q} %.`)]
          : [h('CH-resta-porcentaje-altura', e * e * H - p / 100, `Descontar lo que quita el aire es la idea; es un porcentaje, no metros: se multiplica por ${f(kp)}.`)]),
      ]),
    ];
    const solucion = [
      sub === 'solo-e' ? ['Sin aire, llega al piso con v² = 2·g·', v('H', 'H'), '.']
        : ['Llega al piso con el ', v('p', `${100 - p} %`), ' de la energía: v² = 2·g·', v('H', 'H'), `·${f(kp)} = ${f(2 * G * H * kp)} m²/s².`],
      ['El piso la devuelve con v\' = ', v('e', 'e'), '·v: la energía cinética se multiplica por ', v('e', `e² = ${f(e * e)}`), '.'],
      sub === 'ambas' ? ['En la subida, el aire le deja el ', v('p', `${100 - q} %`), ` de esa energía: m·g·h' = ½·m·v'²·${f(kq)}.`] : ['En la subida, toda esa energía cinética se vuelve potencial: m·g·h\' = ½·m·v\'².'],
      [v('x', "h'"), ' = ', v('e', f(e * e)), ' · ', v('H', f(H)), sub === 'solo-e' ? '' : ` · ${f(kp)}`, sub === 'ambas' ? ` · ${f(kq)}` : '', ' = ', v('x', `${f(hp)} m`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: hp, unidad: 'm', errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'rebote', sub, H, e, p, q } });
  }

  return { id: ID, titulo: 'La patada en la gráfica', generar };
});
