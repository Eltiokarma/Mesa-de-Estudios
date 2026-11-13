/*
 * Generador «La combi y el río»: marcos de referencia y velocidad relativa.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['velocidad-relativa']) y en Node (require). No usa ningún motor.
 *
 * Tipos y subtipos:
 *   marco     combis      lo que ve el pasajero de una combi: rapidez de la otra respecto a la suya (en m/s,
 *                         con los datos en km/h)
 *             placas      dos placas tectónicas que se mueven respecto a una tercera: cuánto se desplaza
 *                         una respecto a la otra en N años (en m, con los datos en cm/año)
 *   idavuelta columna     mensajero que va de la cola a la cabeza de una columna en marcha y vuelve
 *                         (rapideces respecto a tierra): L/(u − V) + L/(u + V)
 *             tren        persona que camina en un vagón y vuelve (rapidez respecto al vagón): 2L/u
 *             nadador     nadador que va de la popa a la proa de un bote que avanza y vuelve, en un tiempo
 *                         dado: su rapidez respecto al agua
 *   cruce     encuentro   dos móviles que se acercan: D/(v1 + v2)
 *             alcance     uno que alcanza al otro: D/(v1 − v2)
 *             trenes      dos trenes que se cruzan por completo: (L1 + L2)/v relativa
 *   bote      recto       apunta río arriba para cruzar en línea recta: el tiempo, W/√(u² − c²)
 *             angulo      el mismo caso: hacia dónde apunta la proa (texto: «37° río arriba»)
 *             tmin        tiempo mínimo para cruzar: W/u (proa perpendicular)
 *             deriva      cuánto lo lleva la corriente con la proa perpendicular: c·W/u
 *             resultante  rapidez respecto a tierra con la proa perpendicular: √(u² + c²)
 *             linea       llegar a un punto dado de la otra orilla: hacia dónde apunta la proa (texto)
 *   botes     lanza       un bote en reposo lanza un saco con rapidez u respecto al bote: rapidez del bote
 *             objeto      la rapidez del saco respecto al agua
 *             recibe      otro bote en reposo recibe el saco: su rapidez final
 *             dos         el mismo bote lanza dos sacos, uno a cada lado y uno tras otro: su rapidez final
 *             tres        tres botes en fila: el del centro lanza un saco al de la izquierda y luego otro al de
 *                         la derecha; la rapidez final del bote de un extremo (paso a paso)
 *
 * Convenciones: rapideces del bote «respecto al agua»; la del saco «respecto al bote» se mide con el bote ya
 * en movimiento (después del lanzamiento). Ángulos de la proa medidos desde la perpendicular a la orilla,
 * con sen 16° = 7/25, sen 30° = 1/2, sen 37° = 3/5, sen 53° = 4/5 y sen 74° = 24/25. Coma decimal.
 * Errores: REL-V-* (trampa 12, docs/clasificacion/trampas-admision-unmsm/fisica.md; K1 del informe de
 * cinemática es lo más cercano, sin cifra para este caso), hipótesis nuestras; U1 (hipótesis,
 * docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md); CHO-* (hipótesis).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const TRA = 'docs/clasificacion/trampas-admision-unmsm/fisica.md';
  const TRV = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = TRA) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const limpio = (x, dec = 2) => Number.isFinite(x) && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && Math.abs(x) < 1e6;
  const corto = x => limpio(x) && x > 0;
  const con = u => x => `${f(x)} ${u}`;
  const Mayus = s => s[0].toUpperCase() + s.slice(1);

  const TIPOS = [['marco', 'combis'], ['marco', 'combis'], ['marco', 'placas'], ['idavuelta', 'columna'], ['idavuelta', 'tren'], ['idavuelta', 'nadador'],
    ['cruce', 'encuentro'], ['cruce', 'alcance'], ['cruce', 'trenes'], ['bote', 'recto'], ['bote', 'angulo'], ['bote', 'tmin'], ['bote', 'deriva'],
    ['bote', 'resultante'], ['bote', 'linea'], ['bote', 'linea'], ['botes', 'lanza'], ['botes', 'objeto'], ['botes', 'recibe'], ['botes', 'dos'], ['botes', 'tres'], ['botes', 'tres']];

  function generar(semilla) {
    const rng = Azar.crear('velocidad-relativa|' + semilla);
    const [tipo, sub] = rng.elegir(TIPOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      // Se evita que la correcta sea la única «redonda» (las demás con más decimales).
      if (pr && pr.alternativas.length >= 4 && (intento > 300 || !soloRedonda(pr))) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'marco') return marco(rng, semilla, sub);
    if (tipo === 'idavuelta') return idaVuelta(rng, semilla, sub);
    if (tipo === 'cruce') return cruce(rng, semilla, sub);
    if (tipo === 'bote') return bote(rng, semilla, sub);
    return botes(rng, semilla, sub);
  }
  // Decimales que se ven en un texto «12,5 s» (0 si es entero).
  const decimales = t => ((String(t).match(/^[−\d ]+(?:,(\d+))?/) || [])[1] || '').length;
  function soloRedonda(pr) {
    if (typeof pr.respuesta.valor !== 'number') return false;
    const dc = decimales(pr.alternativas.find(a => a.correcta).texto);
    return pr.alternativas.filter(a => !a.correcta).every(a => decimales(a.texto) > dc);
  }
  function cerrar(rng, semilla, o) {
    // Las incorrectas: tan limpias como la correcta (a lo más un decimal más si la correcta es entera) y
    // razonables (entre 1/20 y 20 veces la correcta); un error que da 0 o un número absurdo no entra.
    const ok = o.negativos ? limpio : corto, dc = decimales(f(o.correcta)), maxd = Math.max(dc, 1);
    const razonable = (x, id) => o.correcta === 0 || P.enEscala(x, o.correcta, id); // U1–U8 hasta 1000 veces
    const errores = o.errores.filter(e => e && ok(e.valor) && decimales(f(e.valor)) <= maxd && razonable(e.valor, e.id));
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.texto, negativos: !!o.negativos });
    const respuesta = { valor: o.correcta, unidad: o.unidad };
    const pr = {
      id: `velocidad-relativa#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datosTxt || '',
      alternativas, solucion: o.solucion, respuesta, _datos: o.datos,
    };
    return o.viva ? Object.assign(pr, o.viva(alternativas, respuesta)) : pr;
  }

  // ================= escena viva (docs/escena-viva.md) =================
  // La recta del kit (nucleo/kit/piezas/recta.js): en «marco», una recta de velocidades (la relativa es la flecha
  // de B hasta A); en «encuentro» y «alcance», la recta de posiciones con lo que recorre cada uno. Los demás tipos
  // (ida y vuelta, trenes, bote en el río y botes) siguen con su solución de siempre, ya recortada.
  const nb = x => (typeof x === 'string' ? x.replace(/ %/g, ' %').replace(/S\/ /g, 'S/ ') : x);
  function rango(vals) {
    const lo = Math.min(...vals), hi = Math.max(...vals);
    const paso = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500].find(p => (hi - lo) / p <= 10) || 1000;
    let min = Math.floor(lo / paso) * paso, max = Math.ceil(hi / paso) * paso;
    if (lo - min < paso / 2) min -= paso;
    if (max - hi < paso / 2) max += paso;
    if (lo >= 0 && min < 0) min = 0;
    return { min, max, paso };
  }
  const paso = (corte, texto, ecuacion, final) => ({ estado: final ? { corte, final: true } : { corte }, texto, ecuacion });
  // o: { variable, sufijo, elementos, pasos, alt, extra, fantasma(a) }. Un error con id repetido no lleva fantasma.
  function escena(alternativas, o) {
    const r = rango(o.extra);
    const datos = { min: r.min, max: r.max, paso: r.paso, variable: o.variable, color: null, sufijo: o.sufijo || '', decimales: 2, filas: o.filas || 2, elementos: o.elementos, marca: null, respuesta: null };
    const cuenta = {};
    for (const a of alternativas) if (a.error) cuenta[a.error.id] = (cuenta[a.error.id] || 0) + 1;
    const fantasmas = {};
    for (const a of alternativas) if (a.error) fantasmas[a.error.id] = (cuenta[a.error.id] === 1 && o.fantasma && o.fantasma(a)) || {};
    return { escena: { pieza: 'recta', datos, alt: o.alt }, fantasmas, pasos: o.pasos.map(q => ({ ...q, texto: q.texto.map(nb), ecuacion: (q.ecuacion || []).map(nb) })) };
  }
  // Recta de velocidades: B y A con signo; la flecha de B hasta A es la velocidad de A respecto a B.
  function lineaVel(vB, vA, u, pasos, alt) {
    return alts => escena(alts, {
      variable: `v (${u})`, extra: [vA, vB, 0], alt,
      elementos: [
        { tipo: 'punto', x: vB, color: 'i', rotulo: 'B', fila: 0, desde: 1 },
        { tipo: 'punto', x: vA, color: 'o', rotulo: 'A', fila: 0, desde: 1 },
        { tipo: 'salto', a: vB, b: vA, color: 'd', rotulo: `${f(Math.abs(vA - vB))} ${u}`, fila: 1, desde: 2 },
      ],
      pasos,
    });
  }

  // ================= marco =================
  const VAR_M = { a: { nombre: 'velocidad del móvil observado', color: 'o' }, b: { nombre: 'velocidad del observador', color: 'i' }, t: { nombre: 'tiempo', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  function marco(rng, semilla, sub) {
    if (sub === 'combis') {
      const vA = 9 * rng.entero(3, 12), vB = 9 * rng.entero(2, 10), mismo = rng.moneda();
      if (vA === vB) return null;
      const rel = mismo ? Math.abs(vA - vB) : vA + vB, correcta = rel / 3.6, otra = mismo ? vA + vB : Math.abs(vA - vB);
      const vBs = mismo ? vB : -vB;
      const enunciado = ['En carriles paralelos, la combi A va a ', v('a', `${vA} km/h`), ' y la combi B a ', v('b', `${vB} km/h`),
        mismo ? ', las dos hacia el norte.' : ', A al norte y B al sur.'];
      const pregunta = ['¿Con qué ', v('x', 'rapidez'), ', en m/s, ve moverse a A un pasajero de B?'];
      const errores = [
        h('REL-V-signo', otra / 3.6, mismo ? 'Sumaste las rapideces. Van en el mismo sentido: para B, A solo gana la diferencia.' : 'Restaste las rapideces. Van en sentidos opuestos: para B, A se acerca con la suma.'),
        h('REL-V-respecto-a-tierra', vA / 3.6, 'Esa es la rapidez de A respecto a la pista. El pasajero de B ve vA − vB.'),
        h('REL-V-la-propia', vB / 3.6, 'Esa es la rapidez de B, la del observador. Él ve vA − vB.'),
        h('U1-kmh', rel, `Eso está en km/h. En m/s se divide entre 3,6: ${f(correcta)} m/s.`, TRV),
      ];
      const solucion = [
        ['Norte positivo: ', v('a', `vA = ${vA}`), ' y ', v('b', `vB = ${f(vBs)}`), ' km/h.'],
        ['A respecto a B: ', v('a', 'vA'), ' − ', v('b', 'vB'), ` = ${f(vA - vBs)} km/h.`],
        ['En m/s: ', `${rel}/3,6 = `, v('x', `${f(correcta)} m/s`), '.'],
      ];
      const viva = lineaVel(vBs, vA, 'km/h', [
        paso(1, ['Norte positivo: ', v('a', `vA = ${vA}`), ' y ', v('b', `vB = ${f(vBs)}`), ' km/h.'], ['respecto a la pista']),
        paso(2, ['El pasajero de B ve la velocidad de A menos la suya.'], [`vA − vB = ${vA} − ${vBs < 0 ? `(${f(vBs)})` : vBs} = ${f(vA - vBs)} km/h`]),
        paso(2, ['En m/s se divide entre 3,6.'], [`${rel}/3,6 = `, v('x', `${f(correcta)} m/s`)], true),
      ], `Recta de velocidades: B en ${f(vBs)} km/h y A en ${vA} km/h; de B hasta A hay ${rel} km/h`);
      return cerrar(rng, semilla, { correcta, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_M, enunciado, pregunta, solucion, viva,
        datos: { tipo: 'marco', sub, vA, vB: vBs } });
    }
    // placas: velocidades respecto a la placa M (con signo: + al este)
    const vA = rng.entero(1, 12), vBm = rng.entero(1, 12), mismo = rng.moneda(), N = rng.elegir([500, 1000, 2000, 3000, 5000, 10000, 20000]);
    if (vA === vBm) return null;
    const vB = mismo ? vBm : -vBm, rel = Math.abs(vA - vB), correcta = rel * N / 100;
    const enunciado = ['Respecto a la placa M, A va al este a ', v('a', `${vA} cm/año`), ' y B al ',
      mismo ? 'este' : 'oeste', ' a ', v('b', `${vBm} cm/año`), ', en una misma línea.'];
    const pregunta = ['¿Cuántos metros se ', v('x', 'desplaza A respecto a B'), ' en ', v('t', `${f(N)} años`), '?'];
    const errores = [
      h('REL-V-signo', (mismo ? vA + vBm : Math.abs(vA - vBm)) * N / 100, mismo ? 'Sumaste las velocidades. Las dos van al este: respecto a B, A avanza la diferencia.' : 'Restaste las velocidades. Van en sentidos opuestos: respecto a B, A se aleja con la suma.'),
      h('REL-V-respecto-a-tierra', vA * N / 100, 'Ese es el desplazamiento de A respecto a M. Se pide respecto a B: vA − vB.'),
      h('REL-V-la-propia', vBm * N / 100, 'Ese es el desplazamiento de B respecto a M. Se pide el de A visto desde B.'),
    ];
    const solucion = [
      ['Este positivo, respecto a M: ', v('a', `vA = ${vA}`), ' y ', v('b', `vB = ${f(vB)}`), ' cm/año.'],
      [v('a', 'vA'), ' − ', v('b', 'vB'), ` = ${f(vA - vB)} cm/año.`],
      ['En ', v('t', `${f(N)} años`), `: ${f(rel * N)} cm = `, v('x', `${f(correcta)} m`), '.'],
    ];
    const viva = lineaVel(vB, vA, 'cm/año', [
      paso(1, ['Este positivo, respecto a M: ', v('a', `vA = ${vA}`), ' y ', v('b', `vB = ${f(vB)}`), '.'], ['cm/año']),
      paso(2, ['Visto desde B, A se mueve con vA − vB.'], [`${vA} − ${vB < 0 ? `(${f(vB)})` : vB} = ${f(vA - vB)} cm/año`]),
      paso(2, ['En ', v('t', `${f(N)} años`), ', a 100 cm por metro:'], [`${f(rel)}·${f(N)} = ${f(rel * N)} cm = `, v('x', `${f(correcta)} m`)], true),
    ], `Recta de velocidades: B en ${f(vB)} cm/año y A en ${vA} cm/año; de B hasta A hay ${rel} cm/año`);
    return cerrar(rng, semilla, { correcta, errores, texto: con('m'), unidad: 'm', variables: VAR_M, enunciado, pregunta, solucion, viva,
      datos: { tipo: 'marco', sub, vA, vB, N } });
  }

  // ================= idavuelta =================
  // Sin escena: ida y vuelta respecto a un marco que se mueve pide dos rectas (la pista y el vehículo).
  const VAR_IV = { u: { nombre: 'rapidez de quien va y vuelve', color: 'o' }, V: { nombre: 'rapidez del vehículo o la columna', color: 'i' }, L: { nombre: 'largo', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  function idaVuelta(rng, semilla, sub) {
    if (sub === 'columna') {
      const u = rng.entero(3, 12), V = rng.entero(1, u - 1), L = 10 * rng.entero(4, 40);
      const t1 = L / (u - V), t2 = L / (u + V), correcta = t1 + t2;
      if (!limpio(t1) || !limpio(t2)) return null;
      const enunciado = ['Una columna de ', v('L', `${L} m`), ' desfila a ', v('V', `${V} m/s`),
        '. Un ciclista va de la cola a la cabeza y vuelve, a ', v('u', `${u} m/s`), ' respecto a la pista.'];
      const pregunta = ['¿Cuánto ', v('x', 'tiempo'), ' tarda en ir y volver?'];
      const errores = [
        h('REL-V-ignora-marco', 2 * L / u, `Dividiste ${2 * L} m entre ${u} m/s, como si la columna estuviera quieta. Ida: u − V; vuelta: u + V.`),
        h('REL-V-signo', 2 * L / (u - V), 'Usaste u − V también a la vuelta. A la vuelta se cruzan: u + V.'),
        h('REL-V-signo', 2 * L / (u + V), 'Usaste u + V también a la ida. A la ida van igual: solo gana u − V.'),
        h('REL-V-solo-ida', t1, 'Ese es solo el tiempo de ida. Falta la vuelta.'),
      ];
      const solucion = [
        ['Respecto a la columna recorre ', v('L', `${L} m`), ' de ida y otros tantos de vuelta.'],
        ['Ida: ', v('L', `${L}`), '/(', v('u', `${u}`), ' − ', v('V', `${V}`), `) = ${f(t1)} s.`],
        [`Vuelta: ${L}/(${u} + ${V}) = ${f(t2)} s.`],
        [v('x', 't'), ` = ${f(t1)} + ${f(t2)} = `, v('x', `${f(correcta)} s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_IV, enunciado, pregunta, solucion,
        datos: { tipo: 'idavuelta', sub, u, V, L } });
    }
    if (sub === 'tren') {
      const u = rng.elegir([0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 3]), V = rng.entero(8, 30), L = rng.entero(12, 40);
      const correcta = 2 * L / u;
      if (!limpio(correcta)) return null;
      const enunciado = ['Un tren avanza a ', v('V', `${V} m/s`), '. Un pasajero camina a ', v('u', `${f(u)} m/s`),
        ' respecto al vagón, de la puerta de atrás a la de adelante, y vuelve. El vagón mide ', v('L', `${L} m`), '.'];
      const pregunta = ['¿Cuánto ', v('x', 'tiempo'), ' tarda en ir y volver?'];
      const errores = [
        h('REL-V-suma-vehiculo', L / (u + V) + L / (V - u), `Sumaste o restaste la rapidez del tren. Dentro del vagón va a ${f(u)} m/s en los dos sentidos.`),
        h('REL-V-suma-vehiculo', 2 * L / (u + V), 'Usaste su rapidez respecto a la vía. El largo del vagón se recorre respecto al vagón.'),
        h('REL-V-solo-ida', L / u, 'Ese es solo el tiempo de ida. Falta volver.'),
        h('REL-V-la-propia', 2 * L / V, `Dividiste entre la rapidez del tren. Dentro del vagón el pasajero va a ${f(u)} m/s.`),
      ];
      const solucion = [
        ['En el vagón, va a ', v('u', `${f(u)} m/s`), ' de ida y de vuelta.'],
        [v('x', 't'), ' = 2·', v('L', `${L}`), '/', v('u', f(u)), ' = ', v('x', `${f(correcta)} s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_IV, enunciado, pregunta, solucion,
        datos: { tipo: 'idavuelta', sub, u, V, L } });
    }
    // nadador: T = L/(u − V) + L/(u + V) dado; se pide u (respecto al agua). El bote avanza a V respecto al agua.
    const u = rng.elegir([1.2, 1.5, 1.6, 2, 2.4, 2.5, 3, 3.5, 4, 4.5, 5]), V = rng.elegir([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.5, 3]), L = rng.entero(6, 30);
    if (V >= u) return null;
    const T = L / (u - V) + L / (u + V);
    if (!limpio(T, 1)) return null;
    const enunciado = ['Un bote de ', v('L', `${L} m`), ' avanza a ', v('V', `${f(V)} m/s`), ' en agua quieta. Un nadador va de popa a proa y vuelve, a rapidez constante respecto al agua, en ',
      v('x', `${f(T)} s`), '.'];
    const pregunta = ['¿Cuál es la ', v('u', 'rapidez del nadador'), ' respecto al agua?'];
    const errores = [
      h('REL-V-ignora-marco', 2 * L / T, `Dividiste ${2 * L} m entre ${f(T)} s como si el bote estuviera quieto. Ida: u − V; vuelta: u + V.`),
      h('REL-V-signo', 2 * L / T + V, 'Sumaste la rapidez del bote al promedio. Plantea L/(u − V) + L/(u + V) = T.'),
      h('REL-V-solo-ida', L / T + V, 'Tomaste todo el tiempo como si fuera la ida. Es de ida y vuelta.'),
      h('REL-V-signo', Math.abs(2 * L / T - V), 'Restaste la rapidez del bote al promedio. Plantea L/(u − V) + L/(u + V) = T.'),
    ];
    const solucion = [
      ['Respecto al bote: ida con ', v('u', 'u'), ' − ', v('V', f(V)), ', vuelta con ', v('u', 'u'), ' + ', v('V', f(V)), '.'],
      [v('L', `${L}`), '/(u − ', v('V', f(V)), ') + ', v('L', `${L}`), '/(u + ', v('V', f(V)), ') = ', v('x', f(T)), '.'],
      ['Resolviendo: ', v('u', `u = ${f(u)} m/s`), ` (ida ${f(L / (u - V))} s, vuelta ${f(L / (u + V))} s).`],
    ];
    return cerrar(rng, semilla, { correcta: u, errores, texto: con('m/s'), unidad: 'm/s', variables: { ...VAR_IV, x: { nombre: 'tiempo total', color: 'd' }, u: { nombre: 'rapidez del nadador (lo que se pide)', color: 'o' } },
      enunciado, pregunta, solucion, datos: { tipo: 'idavuelta', sub, V, L, T } });
  }

  // ================= cruce =================
  const VAR_C = { a: { nombre: 'rapidez del primero', color: 'o' }, b: { nombre: 'rapidez del segundo', color: 'i' }, D: { nombre: 'distancia o largos', color: 'h' }, x: { nombre: 'tiempo', color: 'd' } };
  function cruce(rng, semilla, sub) {
    if (sub === 'encuentro' || sub === 'alcance') {
      const v1 = rng.entero(6, 30), v2 = rng.entero(2, 25), D = rng.elegir([60, 90, 120, 150, 180, 200, 240, 300, 360, 400]);
      if (sub === 'alcance' && v2 >= v1) return null;
      const rel = sub === 'encuentro' ? v1 + v2 : v1 - v2, correcta = D / rel;
      if (!limpio(correcta, 1) || v1 === v2) return null;
      const enc = sub === 'encuentro', uno = enc ? 'combi' : 'moto';
      const enunciado = enc
        ? ['Una combi y un camión, a ', v('D', `${D} m`), ' uno del otro en una recta, van a encontrarse: la combi a ', v('a', `${v1} m/s`), ' y el camión a ', v('b', `${v2} m/s`), '.']
        : ['Una moto persigue a un camión en una recta. Están a ', v('D', `${D} m`), '; la moto va a ', v('a', `${v1} m/s`), ' y el camión a ', v('b', `${v2} m/s`), ', en el mismo sentido.'];
      const pregunta = enc ? ['¿Dentro de cuánto ', v('x', 'tiempo'), ' se cruzan?'] : ['¿Dentro de cuánto ', v('x', 'tiempo'), ' la alcanza?'];
      const otra = enc ? Math.abs(v1 - v2) : v1 + v2;
      const errores = [
        h('REL-V-signo', D / otra, enc ? 'Restaste las rapideces. Van uno hacia el otro: la distancia baja con la suma.' : 'Sumaste las rapideces. Van en el mismo sentido: la moto solo descuenta la diferencia.'),
        h('REL-V-ignora-marco', D / v1, 'Usaste la rapidez de uno solo, como si el otro estuviera quieto.'),
        h('REL-V-ignora-marco', D / v2, 'Usaste solo la rapidez del camión. Cuenta la rapidez de uno respecto al otro.'),
        h('REL-V-promedio', D / ((v1 + v2) / 2), 'Usaste el promedio de las rapideces. La distancia cambia con la suma o la diferencia.'),
      ];
      const signo = enc ? ' + ' : ' − ';
      const solucion = [
        [`Desde el camión, la ${uno} se acerca a `, v('a', `${v1}`), signo, v('b', `${v2}`), ` = ${rel} m/s.`],
        [v('x', 't'), ' = ', v('D', `${D}`), `/${rel} = `, v('x', `${f(correcta)} s`), '.'],
      ];
      // Posiciones: el primero sale de 0 hacia +; el camión, de D (hacia − si se encuentran, hacia + si lo alcanzan).
      const x1 = v1 * correcta, xc = enc ? D - v2 * correcta : D + v2 * correcta;
      const lejos = Math.max(D, x1) * 2;
      const fantasma = a => {
        if (a.error.id !== 'REL-V-signo' && a.error.id !== 'REL-V-promedio') return null;
        const x = v1 * a.valor;
        return x <= lejos ? { marca: x, rotulo: `${uno} en ${f(a.valor)} s` } : null;
      };
      const viva = alts => escena(alts, {
        variable: 'x (m)', sufijo: ' m', filas: 3, fantasma,
        extra: [0, D, x1, ...alts.filter(a => a.error && (a.error.id === 'REL-V-signo' || a.error.id === 'REL-V-promedio')).map(a => v1 * a.valor).filter(x => x <= lejos)],
        alt: `Recta de posiciones: la ${uno} sale de 0 y el camión de ${D} m; se ${enc ? 'cruzan' : 'juntan'} en ${f(x1)} m a los ${f(correcta)} s`,
        elementos: [
          { tipo: 'punto', x: 0, color: 'o', rotulo: uno, fila: 0, desde: 0 },
          { tipo: 'punto', x: D, color: 'i', rotulo: 'camión', fila: 0, desde: 0 },
          { tipo: 'distancia', a: 0, b: D, color: 'h', rotulo: `${D} m`, fila: 3, desde: 1 },
          { tipo: 'salto', a: 0, b: x1, color: 'o', rotulo: `${f(x1)} m`, fila: 2, desde: 2 },
          { tipo: 'salto', a: D, b: xc, color: 'i', rotulo: `${f(v2 * correcta)} m`, fila: 1, desde: 2 },
          { tipo: 'punto', x: x1, color: 'd', fila: 0, desde: 2 }, // sin rótulo: chocaría con el del camión; el tiempo va en la ecuación
        ],
        pasos: [
          paso(1, [`Desde el camión, la ${uno} se acerca a `, v('a', `${v1}`), signo, v('b', `${v2}`), ` = ${rel} m/s.`], [`${D} m a ${rel} m/s`]),
          paso(2, [`La ${uno} avanza ${f(x1)} m; el camión, ${f(v2 * correcta)} m.`], [v('x', 't'), ` = ${D}/${rel} = `, v('x', `${f(correcta)} s`)], true),
        ],
      });
      return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_C, enunciado, pregunta, solucion, viva,
        datos: { tipo: 'cruce', sub, v1, v2: enc ? -v2 : v2, D } });
    }
    // trenes que se cruzan por completo
    const L1 = rng.elegir([80, 100, 120, 150, 180, 200]), L2 = rng.elegir([60, 80, 100, 120, 150]), v1 = rng.entero(10, 30), v2 = rng.entero(5, 25), opuestos = rng.moneda();
    if (!opuestos && v2 >= v1) return null;
    const rel = opuestos ? v1 + v2 : v1 - v2, correcta = (L1 + L2) / rel;
    if (!limpio(correcta, 1)) return null;
    const enunciado = ['Dos trenes van por vías paralelas', opuestos ? ', en sentidos opuestos' : ', en el mismo sentido', ': uno de ', v('D', `${L1} m`), ' a ', v('a', `${v1} m/s`),
      ' y otro de ', v('D', `${L2} m`), ' a ', v('b', `${v2} m/s`), '.'];
    const pregunta = opuestos ? ['¿Cuánto ', v('x', 'tiempo'), ' pasa de frente con frente a cola con cola?']
      : ['¿Cuánto ', v('x', 'tiempo'), ' tarda el más rápido en pasar por completo al otro?'];
    const errores = [
      h('REL-V-signo', (L1 + L2) / (opuestos ? Math.abs(v1 - v2) : v1 + v2), opuestos ? 'Restaste las rapideces. En sentidos opuestos uno pasa frente al otro con la suma.' : 'Sumaste las rapideces. En el mismo sentido el rápido gana solo la diferencia.'),
      h('REL-V-un-largo', L1 / rel, `Contaste un solo largo. Para cruzarse por completo se recorren ${L1} + ${L2} m.`),
      h('REL-V-un-largo', L2 / rel, `Contaste un solo largo. Respecto a un tren, el otro recorre ${L1 + L2} m.`),
      h('REL-V-ignora-marco', (L1 + L2) / v1, 'Usaste la rapidez de un solo tren, como si el otro estuviera parado.'),
    ];
    const solucion = [
      ['Desde un tren, el otro va a ', v('a', `${v1}`), opuestos ? ' + ' : ' − ', v('b', `${v2}`), ` = ${rel} m/s.`],
      ['Debe recorrer los dos largos: ', v('D', `${L1} + ${L2} = ${L1 + L2} m`), '.'],
      [v('x', 't'), ` = ${L1 + L2}/${rel} = `, v('x', `${f(correcta)} s`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_C, enunciado, pregunta, solucion,
      datos: { tipo: 'cruce', sub, v1, v2: opuestos ? -v2 : v2, L1, L2 } });
  }

  // ================= bote en el río =================
  // Sin escena: la suma de velocidades es del plano; le toca a la pieza de flechas.
  const VAR_B = { u: { nombre: 'velocidad del bote respecto al agua', color: 'o' }, c: { nombre: 'velocidad de la corriente', color: 'i' }, W: { nombre: 'ancho y distancias', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  // Ángulos notables: [grados, seno, coseno].
  const NOT = [[0, 0, 1], [16, 7 / 25, 24 / 25], [30, 1 / 2, Math.sqrt(3) / 2], [37, 3 / 5, 4 / 5], [53, 4 / 5, 3 / 5], [74, 24 / 25, 7 / 25]];
  const direccion = (g, sentido) => (g === 0 ? { clave: 'proa:0', texto: 'Perpendicular a la orilla (0°)' }
    : { clave: `proa:${g}:${sentido}`, texto: `${g}° río ${sentido} de la perpendicular` });
  const RIO = ['Un bote cruza el río Ramis', 'Un bote cruza el Rímac', 'Una lancha cruza el Ucayali', 'Un bote cruza el Madre de Dios'];
  const SENOS = 'Ángulo desde la perpendicular a la orilla. Usa sen 16° = 7/25, sen 30° = 1/2, sen 37° = 3/5, sen 53° = 4/5 y sen 74° = 24/25.';

  function bote(rng, semilla, sub) {
    const Rio = rng.elegir(RIO);
    if (sub === 'recto' || sub === 'angulo') {
      const [g, s, c0] = rng.elegir(NOT.filter(n => n[0] && (sub === 'angulo' || n[0] !== 30)));
      const u = rng.elegir(g === 30 ? [2, 3, 4, 5, 6, 7, 8, 9, 10, 12] : [1, 2, 2.5, 3, 4, 5, 6, 7.5, 8, 10, 12.5, 25].filter(x => limpio(x * s) && limpio(x * c0)));
      if (u === undefined) return null;
      const c = u * s, vy = u * c0, W = 10 * rng.entero(3, 40);
      if (!limpio(c) || c > 10 || u > 12) return null;
      const enunciado = [`${Rio} (`, v('W', `${W} m`), ' de ancho). Corriente: ', v('c', `${f(c)} m/s`), '; bote: ', v('u', `${f(u)} m/s`),
        ' respecto al agua. Quiere llegar justo enfrente, en línea recta.'];
      if (sub === 'recto') {
        const correcta = W / vy;
        if (!limpio(correcta, 1)) return null;
        const errores = [
          h('REL-V-apunta-destino', W / u, `Dividiste el ancho entre ${f(u)} m/s, como si la corriente no lo arrastrara. Para ir recto apunta río arriba.`),
          h('REL-V-suma-pitagoras', W / Math.hypot(u, c), 'Sumaste con Pitágoras, como si la proa fuera perpendicular. Para ir recto cruza con √(u² − c²).'),
          h('REL-V-signo', W / (u - c), 'Restaste como si fueran paralelas. La corriente es perpendicular al cruce: cruza √(u² − c²).'),
          h('REL-V-signo', W / (u + c), 'Sumaste como si fueran paralelas. La corriente no ayuda a cruzar.'),
          h('REL-V-usa-corriente', W / c, 'Dividiste entre la corriente. La corriente es paralela a la orilla: no hace cruzar.'),
        ];
        const solucion = [
          ['Río arriba debe anular la corriente: ', v('u', f(u)), '·sen θ = ', v('c', f(c)), `, θ = ${g}°.`],
          ['Cruza con ', v('u', `√(${f(u)}² − ${f(c)}²)`), ` = ${f(vy)} m/s.`],
          [v('x', 't'), ' = ', v('W', `${W}`), `/${f(vy)} = `, v('x', `${f(correcta)} s`), '.'],
        ];
        return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_B, enunciado, pregunta: ['¿Cuánto ', v('x', 'tiempo'), ' tarda en cruzar?'], solucion,
          datos: { tipo: 'bote', sub, u, c, W } });
      }
      const correcta = direccion(g, 'arriba');
      const errores = [
        { id: 'REL-V-apunta-destino', ...direccion(0), explicacion: 'Apuntaste directo al frente. La corriente lo arrastraría: hay que apuntar río arriba.' },
        { id: 'REL-V-sentido', ...direccion(g, 'abajo'), explicacion: 'El ángulo está bien, pero hacia el lado equivocado: río abajo lo aleja más.' },
        { id: 'REL-V-angulo-desde-orilla', ...direccion(90 - g, 'arriba'), explicacion: `Mediste el ángulo desde la orilla. Desde la perpendicular: sen θ = ${f(c)}/${f(u)}.` },
        { id: 'REL-V-angulo-desde-orilla', ...direccion(90 - g, 'abajo'), explicacion: 'Mediste desde la orilla y hacia río abajo. La proa va río arriba, con u·sen θ = c.' },
      ].map(e => ({ ...e, respaldo: 'hipotesis', fuente: TRA }));
      const solucion = [
        ['La corriente empuja río abajo: la proa apunta río arriba para anularla.'],
        [v('u', f(u)), '·sen θ = ', v('c', f(c)), ` → sen θ = ${f(c)}/${f(u)} → `, v('x', `θ = ${g}° río arriba`), '.'],
      ];
      return cerrarTexto(rng, semilla, { correcta, errores, variables: VAR_B, enunciado, pregunta: ['¿Hacia dónde apunta la ', v('x', 'proa'), '?'], solucion, datosTxt: SENOS,
        datos: { tipo: 'bote', sub, u, c, W } });
    }
    if (sub === 'tmin' || sub === 'deriva' || sub === 'resultante') {
      const [u, c, R] = rng.elegir([[4, 3, 5], [3, 4, 5], [8, 6, 10], [6, 8, 10], [12, 5, 13], [5, 12, 13], [2.4, 1, 2.6], [1.5, 2, 2.5], [2, 1.5, 2.5], [1.6, 1.2, 2], [1.2, 1.6, 2], [2.4, 1.8, 3], [1.8, 2.4, 3], [3.2, 2.4, 4], [4.8, 3.6, 6], [2.4, 0.7, 2.5], [0.8, 0.6, 1], [6, 2.5, 6.5], [9, 12, 15], [12, 9, 15]]);
      if (!limpio(Math.hypot(u, c), 2) || Math.abs(Math.hypot(u, c) - R) > 1e-9) return null;
      const W = 12 * rng.entero(2, 25);
      const t = W / u, deriva = c * t;
      if (!limpio(t, 1) || !limpio(deriva, 1)) return null;
      const enunciado = [`${Rio} (`, v('W', `${W} m`), ' de ancho). Corriente: ', v('c', `${f(c)} m/s`), '; bote: ', v('u', `${f(u)} m/s`), ' respecto al agua.',
        sub === 'tmin' ? ' Quiere cruzar lo antes posible.' : ' La proa va perpendicular a la orilla.'];
      if (sub === 'tmin') {
        const errores = [
          h('REL-V-suma-pitagoras', W / R, `Usaste la rapidez respecto a tierra, ${f(R)} m/s. Cruza solo la componente perpendicular: ${f(u)} m/s.`),
          u > c ? h('REL-V-recto-es-rapido', W / Math.sqrt(u * u - c * c), 'Ese es el tiempo para cruzar en línea recta. Ir recto no es lo más rápido.') : null,
          h('REL-V-signo', W / (u + c), 'Sumaste la corriente. Es paralela a la orilla: no acerca a la otra orilla.'),
          u > c ? h('REL-V-signo', W / (u - c), 'Restaste la corriente. Es paralela a la orilla: el cruce depende de la perpendicular.') : null,
          h('REL-V-usa-corriente', W / c, 'Dividiste entre la corriente. Es paralela a la orilla: no hace cruzar.'),
          h('REL-V-diagonal', W * R / (u * u), `Dividiste la diagonal entre ${f(u)} m/s. En la diagonal va a ${f(R)} m/s.`),
        ];
        const solucion = [
          ['Cruza solo la componente perpendicular, máxima con la proa perpendicular: ', v('u', `${f(u)} m/s`), '.'],
          [v('x', 't'), ' = ', v('W', `${W}`), '/', v('u', f(u)), ' = ', v('x', `${f(t)} s`), '.'],
        ];
        return cerrar(rng, semilla, { correcta: t, errores, texto: con('s'), unidad: 's', variables: VAR_B, enunciado, pregunta: ['¿Cuál es el ', v('x', 'tiempo mínimo'), ' para cruzar?'], solucion,
          datos: { tipo: 'bote', sub, u, c, W } });
      }
      if (sub === 'deriva') {
        const errores = [
          h('REL-V-invertido', u * W / c, 'Pusiste las rapideces al revés. Cruza en t = W/u y la corriente lo lleva c·t.'),
          h('REL-V-distancia-total', R * t, `Esa es la distancia en diagonal. Río abajo lo lleva solo la corriente: ${f(c)}·${f(t)}.`),
          h('REL-V-suma-pitagoras', c * W / R, `Calculaste el tiempo con ${f(R)} m/s. El cruce va con ${f(u)} m/s: t = ${f(t)} s.`),
          h('REL-V-ancho', W, 'Ese es el ancho del río. Río abajo lo lleva la corriente: c·W/u.'),
        ];
        const solucion = [
          ['Cruza en ', v('W', `${W}`), '/', v('u', f(u)), ` = ${f(t)} s.`],
          ['La corriente lo lleva ', v('c', f(c)), `·${f(t)} = `, v('x', `${f(deriva)} m`), '.'],
        ];
        return cerrar(rng, semilla, { correcta: deriva, errores, texto: con('m'), unidad: 'm', variables: VAR_B, enunciado,
          pregunta: ['¿A qué ', v('x', 'distancia río abajo'), ' del punto de enfrente llega?'], solucion, datos: { tipo: 'bote', sub, u, c, W } });
      }
      const errores = [
        h('REL-V-suma-escalar', u + c, 'Sumaste como si fueran en la misma dirección. Son perpendiculares: Pitágoras.'),
        h('REL-V-signo', Math.abs(u - c), 'Restaste las rapideces. Son perpendiculares: se suman con Pitágoras.'),
        h('REL-V-ignora-corriente', u, 'Esa es la rapidez respecto al agua. Falta sumarle, como vector, la corriente.'),
        h('REL-V-suma-pitagoras', Math.sqrt(Math.abs(u * u - c * c)), 'Restaste los cuadrados. Son catetos: se suman sus cuadrados.'),
      ];
      const solucion = [
        ['Respecto a tierra: ', v('u', f(u)), ' perpendicular y ', v('c', f(c)), ' paralela a la orilla.'],
        [v('x', 'v'), ` = √(${f(u)}² + ${f(c)}²) = `, v('x', `${f(R)} m/s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: R, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_B, enunciado,
        pregunta: ['¿Cuál es su ', v('x', 'rapidez respecto a tierra'), '?'], solucion, datos: { tipo: 'bote', sub, u, c, W } });
    }
    // linea: llegar a un punto que está d más abajo (o más arriba) en la otra orilla
    const [g, s, c0] = rng.elegir(NOT.filter(n => n[0] !== 30));
    if (g === 0 && rng.moneda()) return null; // la proa perpendicular saldría demasiado seguido
    const arriba = g === 0 ? true : rng.moneda();
    const u = rng.elegir([2, 2.5, 3, 4, 5, 6, 7.5, 8, 10, 12.5]), c = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8]);
    const ux = (arriba ? -1 : 1) * u * s, uy = u * c0; // x: río abajo
    const Rx = c + ux, Ry = uy;
    // con c > u habría dos proas que llevan al mismo embarcadero (una más lenta): se evita
    if (!limpio(ux) || !limpio(uy) || Ry <= 0 || c > u) return null;
    // dirección del embarcadero desde la perpendicular: [grados, tangente]; debe ser un ángulo notable
    const tg = Rx / Ry, phi = [[16, 7 / 24], [37, 3 / 4], [45, 1], [53, 4 / 3], [74, 24 / 7]].find(n => Math.abs(Math.abs(tg) - n[1]) < 1e-9);
    if (!phi) return null;
    const W = 12 * rng.entero(2, 20), d = W * Math.abs(tg);
    if (!Number.isInteger(d)) return null;
    const lado = Rx > 0 ? 'abajo' : 'arriba';
    const enunciado = [`${Rio} (`, v('W', `${W} m`), ' de ancho). Corriente: ', v('c', `${f(c)} m/s`), '; bote: ', v('u', `${f(u)} m/s`),
      ' respecto al agua. Quiere llegar al embarcadero ', v('W', `${d} m`), ` río ${lado} del punto de enfrente.`];
    const correcta = direccion(g, g === 0 ? '' : (arriba ? 'arriba' : 'abajo'));
    const errores = [
      { id: 'REL-V-apunta-destino', ...direccion(phi[0], lado), explicacion: 'Apuntaste la proa al embarcadero. Lo que debe ir hacia allá es bote + corriente.' },
      g ? { id: 'REL-V-ignora-corriente', ...direccion(0), explicacion: 'Apuntaste perpendicular. Así la corriente lo lleva a otro punto.' } : null,
      g ? { id: 'REL-V-sentido', ...direccion(g, arriba ? 'abajo' : 'arriba'), explicacion: 'El ángulo está bien, pero hacia el otro lado.' } : null,
      { id: 'REL-V-sentido', ...direccion(phi[0], lado === 'abajo' ? 'arriba' : 'abajo'), explicacion: 'Usaste el ángulo del embarcadero y hacia el otro lado. Bote + corriente debe ir al embarcadero.' },
      { id: 'REL-V-angulo-desde-orilla', ...direccion(90 - phi[0], lado), explicacion: 'Mediste desde la orilla y apuntaste al embarcadero. Se mide desde la perpendicular.' },
    ].filter(e => e && e.clave !== correcta.clave).map(e => ({ ...e, respaldo: 'hipotesis', fuente: TRA }));
    const ux2 = Math.abs(ux);
    const solucion = [
      ['Bote + corriente apunta al embarcadero: ', v('W', `${d} m`), ` río ${lado} cada `, v('W', `${W} m`), '.'],
      g === 0
        ? ['Proa perpendicular: cruza a ', v('u', `${f(u)} m/s`), ' y baja a ', v('c', `${f(c)} m/s`), '.']
        : [`Proa a ${g}°: `, v('u', `${f(uy)} m/s`), ' para cruzar y ', v('u', `${f(ux2)} m/s`), ` río ${arriba ? 'arriba' : 'abajo'}.`],
      g === 0 ? [`${f(c)}/${f(uy)} = ${d}/${W}: llega al embarcadero.`]
        : ['A lo largo: ', v('c', f(c)), ` ${ux >= 0 ? '+' : '−'} ${f(ux2)} = ${f(Rx)}; ${f(Math.abs(Rx))}/${f(uy)} = ${d}/${W}.`],
      ['La proa: ', v('x', correcta.texto), '.'],
    ];
    return cerrarTexto(rng, semilla, { correcta, errores, variables: VAR_B, enunciado,
      pregunta: ['¿Hacia dónde apunta la ', v('x', 'proa'), '?'], solucion, datosTxt: SENOS,
      datos: { tipo: 'bote', sub, u, c, W, d: Rx > 0 ? d : -d } });
  }
  function cerrarTexto(rng, semilla, o) {
    const alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores, rng });
    return {
      id: `velocidad-relativa#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datosTxt || '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta.clave, texto: o.correcta.texto, unidad: '' }, _datos: o.datos,
    };
  }

  // ================= botes: lanzar un saco =================
  // Sin escena (cantidad de movimiento con marcos que cambian). La convención va en «datos», aparte del enunciado.
  const VAR_BS = { M: { nombre: 'masas', color: 'o' }, u: { nombre: 'rapidez del saco respecto al bote', color: 'i' }, V: { nombre: 'velocidades respecto al agua', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  const CONV = 'Todo empieza en reposo. La rapidez del saco es respecto al bote que lo lanza, ya en movimiento. Sin roce con el agua.';
  function botes(rng, semilla, sub) {
    const M = 10 * rng.entero(5, 25), m = rng.elegir([2, 4, 5, 8, 10, 12, 15, 20, 25, 30, 40]), u = rng.entero(1, 12);
    const VA = m * u / (M + m), w = u - VA;
    const base = ['Un bote de ', v('M', `${M} kg`), ' lleva un saco de ', v('M', `${m} kg`), ' y lo lanza al este a ', v('u', `${f(u)} m/s`), '.'];
    const sol1 = ['Se conserva: ', v('M', `${M}`), '·V = ', v('M', `${m}`), '·(', v('u', f(u)), ' − V), con V hacia el oeste.'];
    const sol2 = ['V·(', `${M} + ${m}) = ${m}·${f(u)} → `, v('V', `V = ${f(VA)} m/s`), ' hacia el oeste.'];
    if (sub === 'lanza' || sub === 'objeto') {
      if (!limpio(VA) || !limpio(w)) return null;
      if (sub === 'lanza') {
        const errores = [
          h('REL-V-respecto-al-agua', m * u / M, `Tomaste ${f(u)} m/s respecto al agua. Es respecto al bote, que retrocede: el saco va a u − V.`),
          h('CHO-rapidez-del-saco', w, 'Esa es la rapidez del saco respecto al agua. Se pide la del bote.'),
          h('CHO-misma-rapidez', u, 'El bote no sale con la rapidez del saco: tiene más masa. Conserva la cantidad de movimiento.'),
          h('CHO-masa-doble', m * u / (M + 2 * m), `Sumaste la masa del saco dos veces. El bote (${M} kg) se lleva V y el saco, u − V.`),
        ];
        return cerrar(rng, semilla, { correcta: VA, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_BS, enunciado: base, datosTxt: CONV,
          pregunta: ['¿Con qué ', v('x', 'rapidez'), ' retrocede el bote respecto al agua?'], solucion: [sol1, [...sol2.slice(0, 2), v('x', `V = ${f(VA)} m/s`), ' hacia el oeste.']],
          datos: { tipo: 'botes', sub, M, m, u } });
      }
      const errores = [
        h('REL-V-respecto-al-agua', u, `Esa es respecto al bote. El bote retrocede a ${f(VA)} m/s: el saco va a ${f(u)} − ${f(VA)}.`),
        h('REL-V-signo', u + VA, 'Sumaste la rapidez del bote. Van en sentidos opuestos: respecto al agua, u − V.'),
        h('CHO-rapidez-del-bote', VA, 'Esa es la rapidez del bote. Se pide la del saco respecto al agua.'),
        h('REL-V-respecto-al-agua', u - m * u / M, 'Hallaste V como si el saco fuera a u respecto al agua. Usa u − V desde el inicio.'),
      ];
      return cerrar(rng, semilla, { correcta: w, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_BS, enunciado: base, datosTxt: CONV,
        pregunta: ['¿Con qué ', v('x', 'rapidez'), ' va el saco respecto al agua?'],
        solucion: [sol1, sol2, ['Saco: ', v('u', f(u)), ' − ', v('V', f(VA)), ' = ', v('x', `${f(w)} m/s`), ' hacia el este.']], datos: { tipo: 'botes', sub, M, m, u } });
    }
    if (sub === 'recibe') {
      const M2 = 10 * rng.entero(4, 25) - rng.elegir([0, 0, 2, 5]);
      const VB = m * w / (M2 + m);
      if (!limpio(VB) || !limpio(VA)) return null;
      const enunciado = [...base, ' Otro bote, de ', v('M', `${M2} kg`), ', lo atrapa.'];
      const errores = [
        h('REL-V-respecto-al-agua', m * u / (M2 + m), `Usaste ${f(u)} m/s respecto al agua. El saco llega a ${f(w)} m/s: el primer bote retrocede.`),
        h('CHO-sin-masa-saco', m * w / M2, 'Olvidaste el saco: después de atraparlo se mueven juntos, con M₂ + m.'),
        h('REL-V-signo', m * (u + VA) / (M2 + m), 'Sumaste la rapidez del primer bote. Respecto al agua, el saco va a u − V.'),
        h('CHO-rapidez-del-bote', VA, 'Esa es la rapidez del bote que lanza. El que recibe tiene otra masa.'),
      ];
      const solucion = [sol1, sol2, ['El saco va a ', `${f(w)} m/s`, '; al atraparlo: ', v('M', `${m}`), `·${f(w)} = (`, v('M', `${M2} + ${m}`), ')·V₂.'],
        [v('x', 'V₂'), ` = ${f(m * w)}/${M2 + m} = `, v('x', `${f(VB)} m/s`), ' al este.']];
      return cerrar(rng, semilla, { correcta: VB, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_BS, enunciado, datosTxt: CONV,
        pregunta: ['¿Con qué ', v('x', 'rapidez'), ' sigue ese bote?'], solucion, datos: { tipo: 'botes', sub, M, m, u, M2 } });
    }
    if (sub === 'tres') return tresBotes(rng, semilla, M, m, u);
    // dos: dos sacos iguales, el primero al oeste y luego el segundo al este, cada uno a u respecto al bote
    const V1 = m * u / (M + 2 * m), V2 = V1 - m * u / (M + m), correcta = Math.abs(V2);
    if (!limpio(V1) || !limpio(correcta) || correcta === 0) return null;
    const enunciado = ['Un bote de ', v('M', `${M} kg`), ' lleva dos sacos de ', v('M', `${m} kg`),
      '. Lanza uno al oeste y luego el otro al este, cada uno a ', v('u', `${f(u)} m/s`), '.'];
    const errores = [
      h('REL-V-respecto-al-agua', 0, 'Tomaste u respecto al agua: así los lanzamientos se anularían. Cada u es respecto al bote en ese momento.'),
      h('CHO-masa-sin-restar', Math.abs(((M + m) * V1 - m * u) / (M + 2 * m)), 'En el segundo lanzamiento dejaste el primer saco, que ya no está: queda M + m.'),
      h('CHO-solo-un-lanzamiento', V1, 'Esa es la rapidez tras el primer lanzamiento. Falta el segundo.'),
      h('CHO-solo-un-lanzamiento', m * u / (M + m), 'Ese es solo el cambio del segundo lanzamiento. Réstale la velocidad que traía.'),
      h('REL-V-signo', V1 + m * u / (M + m), 'Sumaste los dos efectos. Van en sentidos opuestos.'),
    ];
    const solucion = [
      ['Primer saco (oeste): ', v('M', `(${M} + ${m})`), '·V₁ = ', v('M', `${m}`), '·(', v('u', f(u)), ' − V₁).'],
      [`V₁ = ${m}·${f(u)}/${M + 2 * m} = ${f(V1)} m/s al este.`],
      ['Segundo (este): ', v('M', `(${M} + ${m})`), `·${f(V1)} = `, v('M', `${M}`), '·V₂ + ', v('M', `${m}`), '·(V₂ + ', v('u', f(u)), ').'],
      [`V₂ = ${f(V2)} m/s: va al ${V2 < 0 ? 'oeste' : 'este'} a `, v('x', `${f(correcta)} m/s`), '.'],
    ];
    return cerrar(rng, semilla, { negativos: true, correcta, errores: errores.filter(e => e.valor >= 0), texto: con('m/s'), unidad: 'm/s', variables: VAR_BS, enunciado, datosTxt: CONV,
      pregunta: ['¿Con qué ', v('x', 'rapidez'), ' queda el bote?'], solucion, datos: { tipo: 'botes', sub, M, m, u } });
  }

  // ---- tres botes en fila: A (oeste), B (centro, lanza) y C (este), todos en reposo ----
  function tresBotes(rng, semilla, MB, m, u) {
    const cual = rng.elegir(['A', 'C']);
    const V1 = m * u / (MB + 2 * m);           // B tras el primer lanzamiento (al este)
    const w1 = u - V1;                         // saco 1 respecto al agua, al oeste
    const V2 = V1 - m * u / (MB + m);          // B tras el segundo lanzamiento (negativo: al oeste)
    const w2 = V2 + u;                         // saco 2 respecto al agua, al este
    if (![V1, w1, V2, w2].every(x => limpio(x))) return null;
    // A y C: masas (de 40 a 250 kg) con las que la rapidez final sale limpia
    const masas = w => Array.from({ length: 22 }, (_, i) => 40 + 10 * i).filter(Mx => limpio(m * w / (Mx + m)));
    const opA = masas(w1), opC = masas(w2);
    if (!opA.length || !opC.length) return null;
    const MA = rng.elegir(opA), MC = rng.elegir(opC);
    if (MA === MC) return null;
    const VA = m * w1 / (MA + m), VC = m * w2 / (MC + m);
    const correcta = cual === 'A' ? VA : VC;
    const enunciado = ['En fila: A (', v('M', `${MA} kg`), '), B (', v('M', `${MB} kg`), ', con dos sacos de ', v('M', `${m} kg`), ') y C (', v('M', `${MC} kg`),
      '). B lanza un saco a A y otro a C, a ', v('u', `${f(u)} m/s`), ', y los atrapan.'];
    const pregunta = ['¿Con qué ', v('x', 'rapidez'), ` queda ${cual}?`];
    const errores = cual === 'A' ? [
      h('REL-V-respecto-al-agua', m * u / (MA + m), `Tomaste ${f(u)} m/s respecto al agua. B sale al este: el saco va a ${f(w1)} m/s.`),
      h('REL-V-signo', m * (u + V1) / (MA + m), 'Sumaste la rapidez de B. B va al este y el saco al oeste: u − V₁.'),
      h('CHO-sin-masa-saco', m * w1 / MA, `Olvidaste el saco: A y el saco siguen juntos, con ${MA} + ${m} kg.`),
      h('REL-V-otro-bote', VC, 'Esa es la rapidez de C. A recibe el primer saco.'),
      h('CHO-masa-doble', m * (u - m * u / (MB + m)) / (MA + m), `En el primer lanzamiento faltó el segundo saco, que sigue en B: ${MB} + ${m} kg.`),
    ] : [
      h('REL-V-respecto-al-agua', m * u / (MC + m), `Tomaste ${f(u)} m/s respecto al agua. B ya se mueve: el saco va a ${f(w2)} m/s.`),
      h('CHO-velocidad-vieja', m * (V1 + u) / (MC + m), `Usaste la velocidad de B antes del segundo lanzamiento. Después de lanzar, V₂ = ${f(V2)} m/s.`),
      h('CHO-sin-masa-saco', m * w2 / MC, `Olvidaste el saco: C y el saco siguen juntos, con ${MC} + ${m} kg.`),
      h('REL-V-otro-bote', VA, 'Esa es la rapidez de A. C recibe el segundo saco.'),
      h('REL-V-sin-marco', m * (u + m * u / (MB + 2 * m)) / (MC + m), 'Sumaste a u la velocidad de B como si siguiera al este. El segundo lanzamiento lo frena.'),
    ];
    const solucion = [
      ['Saco 1 al oeste: ', v('M', `(${MB} + ${m})`), '·V₁ = ', v('M', `${m}`), '·(', v('u', f(u)), ' − V₁).'],
      ['V₁ = ', v('V', `${f(V1)} m/s`), ` al este; el saco va a ${f(w1)} m/s.`],
      ['Saco 2 al este: ', v('M', `(${MB} + ${m})`), `·${f(V1)} = `, v('M', `${MB}`), '·V₂ + ', v('M', `${m}`), '·(V₂ + ', v('u', f(u)), ').'],
      [v('V', `V₂ = ${f(V2)} m/s`), `; el saco va a ${f(w2)} m/s al este.`],
      cual === 'A'
        ? ['A: ', v('M', `${m}`), `·${f(w1)} = (`, v('M', `${MA} + ${m}`), ')·V → ', v('x', `${f(VA)} m/s`), ' al oeste.']
        : ['C: ', v('M', `${m}`), `·${f(w2)} = (`, v('M', `${MC} + ${m}`), ')·V → ', v('x', `${f(VC)} m/s`), ' al este.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_BS, enunciado, pregunta, solucion, datosTxt: CONV,
      datos: { tipo: 'botes', sub: 'tres', MA, MB, MC, m, u, cual } });
  }

  return { id: 'velocidad-relativa', titulo: 'La combi y el río', generar };
});
