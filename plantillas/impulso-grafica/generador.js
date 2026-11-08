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
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && e.valor < 1e7), rng, texto: x => `${f(x)} ${o.unidad}` });
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

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
    const enunciado = [quien, v('m', `${f(m)} kg`), ...(sub === 'inicial' ? [' se mueve a ', v('v0', `${f(v0)} m/s`), ` en el sentido +x ${lugar}.`] : [` está en reposo ${lugar}.`]),
      ' Desde t = 0 recibe una fuerza horizontal, en el sentido +x, que cambia con el tiempo. ', describir(pts, forma, 's')];
    const pregunta = ['¿Con qué ', v('x', 'rapidez'), ' queda cuando la fuerza deja de actuar?'];
    const Fm = fmax(pts), T = duracion(pts);
    const errores = [
      h('IG-fmax-por-tiempo', v0 + Fm * T / m, `Multiplicaste la fuerza máxima por el tiempo total, como si la fuerza valiera ${f(Fm)} N todo el rato. El impulso es el área bajo la gráfica F-t, y la fuerza no se mantiene en su máximo.`),
      pa('G4-lee-eje', v0 + Fm / m, `Usaste el valor más alto del eje vertical (${f(Fm)} N) como si fuera el impulso. Lo que cambia la cantidad de movimiento es el área bajo la gráfica F-t, en N·s.`, CIN),
      tr('PR3-sin-medio', v0 + areaSinMedio(pts) / m, `Contaste cada tramo inclinado como un rectángulo con su fuerza mayor: te faltó el ½ del triángulo. Un tramo que sube de F1 a F2 aporta (F1 + F2)/2 · Δt.`),
      h('IG-solo-meseta', v0 + meseta(pts) / m, `Contaste solo los tramos de fuerza constante y dejaste fuera las rampas. Mientras la fuerza sube o baja también empuja: su área (un triángulo) también es impulso.`),
      h('IG-promedio-vertices', v0 + promedioVertices(pts) / m, `Promediaste las fuerzas de los vértices y multiplicaste por el tiempo total. Ese promedio no es la fuerza media: los tramos duran distinto. Suma el área tramo por tramo.`),
      ...(sub === 'inicial' ? [h('IG-sin-v0', J / m, `Esa es solo la rapidez que gana, J/m. El cuerpo ya se movía a ${f(v0)} m/s en el mismo sentido: vf = v0 + J/m.`)] : []),
    ];
    const solucion = [
      ['El impulso es el área bajo la gráfica F-t: ', v('J', 'J'), ` = ${pasosArea(pts, 's')} = `, v('J', `${f(J)} N·s`), '.'],
      ['Teorema del impulso: ', v('J', 'J'), ' = ', v('m', 'm'), '·(vf − ', v('v0', 'v0'), ').'],
      [v('x', 'vf'), ' = ', v('v0', f(v0)), ' + ', v('J', f(J)), '/', v('m', f(m)), ' = ', v('x', `${f(vf)} m/s`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: vf, unidad: 'm/s', errores, variables: VAR, enunciado, pregunta, solucion,
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
    if (contra && dv <= 2 * v0) return null; // sale más rápido de lo que llegó: trabajo positivo
    const vf = contra ? dv - v0 : v0 + dv;    // rapidez final (en el sentido de la patada)
    const W = m * (vf * vf - v0 * v0) / 2;
    if (!limpio(W)) return null;
    const Fm = fmax(pts), T = duracion(pts);
    const enunciado = [`Una pelota de `, v('m', `${f(m)} kg`), contra ? ' viene rodando hacia un futbolista a ' : ' rueda alejándose de un futbolista a ', v('v0', `${f(v0)} m/s`),
      contra ? '. Él la patea y la devuelve en sentido contrario, por el mismo camino. ' : '. Él corre detrás, la alcanza y la patea en el mismo sentido en que rodaba. ',
      describir(pts, forma, 'ms').replace('fuerza-tiempo', 'fuerza-tiempo de la patada'), ' Desprecia el roce con el piso durante la patada.'];
    const pregunta = ['¿Cuánto ', v('x', 'trabajo'), ' hizo el pie sobre la pelota?'];
    const kin = (a, b) => m * (a * a - b * b) / 2;
    const errores = [
      h('IG-v0-nula', m * dv * dv / 2, `Calculaste como si la pelota partiera del reposo: ½·m·(J/m)². Ya rodaba a ${f(v0)} m/s; el trabajo es el cambio de energía cinética, ½·m·(vf² − v0²).`),
      h('IG-sin-ec-inicial', m * vf * vf / 2, `Calculaste la energía cinética final pero no le restaste la inicial. El trabajo es el cambio: W = ½·m·vf² − ½·m·v0².`),
      tr('PR3-sin-medio', 2 * W, `Te faltó el ½ de la energía cinética: Ec = ½·m·v².`),
      h('IG-fmax-por-tiempo', kin(contra ? Fm * T / m - v0 : v0 + Fm * T / m, v0), `Tomaste el impulso como la fuerza máxima por el tiempo total (${f(Fm)} N · ${f(T * 1000)} ms). El impulso es el área bajo la gráfica, que aquí es menor.`),
      ...(contra ? [pa('M2-sin-signo', kin(dv + v0, v0), `Sumaste la rapidez inicial como si la pelota fuera en el mismo sentido de la patada. Venía en contra: con el eje en el sentido de la patada, v0 = −${f(v0)} m/s y vf = −${f(v0)} + J/m = ${f(vf)} m/s.`, MOM),
        h('IG-resta-cuadrado', m * (vf - v0) ** 2 / 2, `Elevaste al cuadrado la diferencia de rapideces, ½·m·(vf − v0)². La energía cinética va con el cuadrado de cada rapidez: W = ½·m·vf² − ½·m·v0², que no es lo mismo.`)] : []),
    ];
    const solucion = [
      ['Impulso = área bajo F-t (con t en segundos): ', v('J', 'J'), ` = ${pasosArea(pts, 'ms')} = ${f(J * 1000)} N·ms = `, v('J', `${f(J)} N·s`), '.'],
      contra
        ? ['Con el eje en el sentido de la patada, la pelota llega con −', v('v0', f(v0)), ' m/s: vf = −', v('v0', f(v0)), ' + ', v('J', f(J)), '/', v('m', f(m)), ` = ${f(vf)} m/s.`]
        : ['vf = ', v('v0', f(v0)), ' + ', v('J', f(J)), '/', v('m', f(m)), ` = ${f(vf)} m/s.`],
      ['El trabajo de la fuerza es el cambio de energía cinética: ', v('x', 'W'), ' = ½·', v('m', f(m)), `·(${f(vf)}² − `, v('v0', f(v0)), '²) = ', v('x', `${f(W)} J`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: W, unidad: 'J', errores, variables: VAR, enunciado, pregunta, solucion,
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
    const piso = [`. El coeficiente de restitución entre ${corto} y el piso es `, v('e', `e = ${f(e)}`), '.'];
    const enunciado = sub === 'solo-e'
      ? [`${pelota} se suelta desde `, v('H', `${f(H)} m`), ' de altura y bota en el piso. Desprecia el efecto del aire', ...piso]
      : sub === 'bajada'
        ? [`${pelota} se suelta desde `, v('H', `${f(H)} m`), ' de altura. Durante la caída, el aire le quita el ', v('p', `${p} %`), ' de su energía mecánica; en la subida, el efecto del aire es despreciable', ...piso]
        : [`${pelota} se suelta desde `, v('H', `${f(H)} m`), ' de altura. Durante la caída, el aire le quita el ', v('p', `${p} %`), ' de su energía mecánica, y durante la subida, el ',
          v('p', `${q} %`), ' de la energía con que sale del piso', ...piso];
    const pregunta = ['¿Hasta qué ', v('x', 'altura'), ' sube después del primer bote?'];
    const errores = [
      h('CH-e-en-la-altura', e * H * kp * kq, `Aplicaste e a la altura. El coeficiente de restitución compara rapideces (v' = e·v), y la altura va con el cuadrado de la rapidez: la altura se multiplica por e² = ${f(e * e)}.`),
      h('CH-e-como-perdida', (1 - e) * H * kp * kq, `Tomaste e como la fracción de la altura que se pierde. e es la razón entre la rapidez de salida y la de llegada: la altura se multiplica por e².`),
      ...(sub === 'solo-e' ? [
        h('CH-e2-como-perdida', (1 - e * e) * H, `Tomaste e² como lo que se pierde. Es al revés: e² es la fracción de energía cinética que conserva la pelota al botar, así que h' = e²·H.`),
        h('CH-raiz-de-e', Math.sqrt(e) * H, `Sacaste la raíz de e. La altura es proporcional a v², y v' = e·v: h' = e²·H.`),
      ] : [
        h('CH-sin-aire', e * e * H, `Olvidaste lo que quita el aire. Con solo la restitución subiría a e²·H; el aire le quita además energía${sub === 'ambas' ? ' en la bajada y en la subida' : ' en la bajada'}.`),
        h('CH-aire-en-la-rapidez', e * e * H * kp * kp * kq * kq, `Aplicaste el porcentaje del aire a la rapidez. El enunciado habla de energía: si se pierde el ${p} % de la energía, queda el ${100 - p} % de la energía (no de la rapidez).`),
        ...(sub === 'ambas' ? [h('CH-aire-una-vez', e * e * H * kp, `Contaste solo lo que quita el aire en la bajada. En la subida también le quita el ${q} % de la energía con que sale del piso.`)]
          : [h('CH-resta-porcentaje-altura', e * e * H - p / 100, `Restaste el porcentaje como si fueran metros. El aire quita una fracción de la energía: se multiplica por ${f(kp)}.`)]),
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
