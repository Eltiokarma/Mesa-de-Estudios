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
 *
 * Convenciones: rapideces del bote «respecto al agua»; la del saco «respecto al bote» se mide con el bote ya
 * en movimiento (después del lanzamiento). Ángulos de la proa medidos desde la perpendicular a la orilla,
 * con sen 16° = 7/25, sen 30° = 1/2, sen 37° = 3/5, sen 53° = 4/5 y sen 74° = 24/25. Coma decimal.
 * Errores: REL-V-* (trampa 12, docs/clasificacion/trampas-admision-unmsm/fisica.md; K1 del informe de
 * cinemática es lo más cercano, sin cifra para este caso), hipótesis nuestras; U1 y U2 (hipótesis,
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
    ['bote', 'resultante'], ['bote', 'linea'], ['bote', 'linea'], ['botes', 'lanza'], ['botes', 'objeto'], ['botes', 'recibe'], ['botes', 'dos']];

  function generar(semilla) {
    const rng = Azar.crear('velocidad-relativa|' + semilla);
    const [tipo, sub] = rng.elegir(TIPOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
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
  function cerrar(rng, semilla, o) {
    // aprox: la correcta es limpia, pero un error puede dar un decimal largo (√7, 36/14): se muestra redondeado.
    const ok = o.aprox ? (x => Number.isFinite(x) && x > 0.005) : o.negativos ? limpio : corto;
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => e && ok(e.valor)), rng, texto: o.texto, negativos: !!o.negativos });
    return {
      id: `velocidad-relativa#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  // ================= marco =================
  const VAR_M = { a: { nombre: 'velocidad del móvil observado', color: 'o' }, b: { nombre: 'velocidad del observador', color: 'i' }, t: { nombre: 'tiempo', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  function marco(rng, semilla, sub) {
    if (sub === 'combis') {
      const vA = rng.elegir([36, 54, 72, 90, 108]), vB = rng.elegir([18, 36, 54, 72, 90]), mismo = rng.moneda();
      if (vA === vB) return null;
      const rel = mismo ? Math.abs(vA - vB) : vA + vB, correcta = rel / 3.6, otra = mismo ? vA + vB : Math.abs(vA - vB);
      const enunciado = ['Por la avenida Circunvalación de Juliaca, en carriles rectos y paralelos, la combi A va a ', v('a', `${vA} km/h`), ' y la combi B a ', v('b', `${vB} km/h`),
        mismo ? ', las dos hacia el norte (respecto a la pista).' : ', A hacia el norte y B hacia el sur (respecto a la pista).'];
      const pregunta = ['¿Con qué ', v('x', 'rapidez'), ' ve moverse a la combi A un pasajero sentado en la combi B?'];
      const errores = [
        h('REL-V-signo', otra / 3.6, mismo ? 'Sumaste las rapideces. Van en el mismo sentido: para el pasajero de B, A solo se adelanta (o se atrasa) con la diferencia.' : 'Restaste las rapideces. Van en sentidos opuestos: para el pasajero de B, A se acerca con la suma de las dos.'),
        h('REL-V-respecto-a-tierra', vA / 3.6, 'Esa es la rapidez de A respecto a la pista. El pasajero de B se mueve con su combi: ve la velocidad de A menos la de B.'),
        h('REL-V-la-propia', vB / 3.6, 'Esa es la rapidez de la combi B, la del observador. Lo que él ve es la velocidad de A menos la suya.'),
        h('U1-kmh', rel, `Ese número está en km/h. Para pasar a m/s se divide entre 3,6: ${rel} km/h = ${f(correcta)} m/s.`, TRV),
      ];
      const solucion = [
        ['Con el sentido norte positivo: ', v('a', `vA = ${vA}`), ' y ', v('b', `vB = ${mismo ? '' : '−'}${vB}`), ' km/h.'],
        ['Velocidad de A respecto a B: ', v('a', 'vA'), ' − ', v('b', 'vB'), ` = ${mismo ? `${vA} − ${vB}` : `${vA} + ${vB}`} = ${f(mismo ? vA - vB : vA + vB)} km/h.`],
        ['En m/s: ', `${rel}/3,6 = `, v('x', `${f(correcta)} m/s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_M, enunciado, pregunta, solucion,
        datos: { tipo: 'marco', sub, vA, vB: mismo ? vB : -vB } });
    }
    // placas: velocidades respecto a la placa M (con signo: + al este)
    const vA = rng.entero(1, 9), vBm = rng.entero(1, 9), mismo = rng.moneda(), N = rng.elegir([1000, 2000, 5000, 10000]);
    if (vA === vBm) return null;
    const vB = mismo ? vBm : -vBm, rel = Math.abs(vA - vB), correcta = rel * N / 100;
    const enunciado = ['Tomando como referencia la placa tectónica M, la placa A se mueve hacia el este a ', v('a', `${vA} cm/año`), ' y la placa B se mueve hacia el ',
      mismo ? 'este' : 'oeste', ' a ', v('b', `${vBm} cm/año`), '. Las tres velocidades están sobre la misma línea este-oeste.'];
    const pregunta = ['¿Cuántos metros se ', v('x', 'desplaza la placa A respecto a la placa B'), ' en ', v('t', `${f(N)} años`), '?'];
    const errores = [
      h('REL-V-signo', (mismo ? vA + vBm : Math.abs(vA - vBm)) * N / 100, mismo ? 'Sumaste las dos velocidades. Las dos van hacia el este: respecto a B, A solo avanza la diferencia.' : 'Restaste las dos velocidades. Van en sentidos opuestos: respecto a B, A se aleja con la suma.'),
      h('REL-V-respecto-a-tierra', vA * N / 100, 'Ese es el desplazamiento de A respecto a M. Piden respecto a B, que también se mueve: hay que usar vA − vB.'),
      h('REL-V-la-propia', vBm * N / 100, 'Ese es el desplazamiento de B respecto a M. Piden el de A visto desde B: vA − vB.'),
      h('U2-centimetros', rel * N, `Ese número está en centímetros. En metros: ${f(rel * N)} cm = ${f(correcta)} m.`, TRV),
    ];
    const solucion = [
      ['Con el este positivo y respecto a M: ', v('a', `vA = ${vA}`), ' y ', v('b', `vB = ${vB < 0 ? '−' : ''}${vBm}`), ' cm/año.'],
      ['Velocidad de A respecto a B: ', v('a', 'vA'), ' − ', v('b', 'vB'), ` = ${vA} − ${vB < 0 ? `(${f(vB)})` : f(vB)} = ${f(vA - vB)} cm/año${vA - vB < 0 ? ' (A se queda atrás de B)' : ''}.`],
      ['En ', v('t', `${f(N)} años`), `: ${f(rel)}·${f(N)} = ${f(rel * N)} cm = `, v('x', `${f(correcta)} m`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: con('m'), unidad: 'm', variables: VAR_M, enunciado, pregunta, solucion,
      datos: { tipo: 'marco', sub, vA, vB, N } });
  }

  // ================= idavuelta =================
  const VAR_IV = { u: { nombre: 'rapidez de quien va y vuelve', color: 'o' }, V: { nombre: 'rapidez del vehículo o la columna', color: 'i' }, L: { nombre: 'largo', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  function idaVuelta(rng, semilla, sub) {
    if (sub === 'columna') {
      const u = rng.entero(3, 10), V = rng.entero(1, u - 1), L = rng.elegir([60, 80, 100, 120, 150, 180, 200, 240, 300]);
      const t1 = L / (u - V), t2 = L / (u + V), correcta = t1 + t2;
      if (!limpio(t1) || !limpio(t2)) return null;
      const enunciado = ['Una columna de escolares de ', v('L', `${L} m`), ' de largo desfila por una avenida recta a ', v('V', `${V} m/s`),
        '. Un mensajero en bicicleta sale de la cola, llega a la cabeza y vuelve a la cola, siempre a ', v('u', `${u} m/s`), ' respecto a la pista.'];
      const pregunta = ['¿Cuánto ', v('x', 'tiempo'), ' tarda en ir y volver?'];
      const errores = [
        h('REL-V-ignora-marco', 2 * L / u, `Dividiste ${2 * L} m entre su rapidez, como si la columna estuviera quieta. Respecto a la columna, a la ida la alcanza con ${u} − ${V} m/s y a la vuelta se cruza con ${u} + ${V} m/s.`),
        h('REL-V-signo', 2 * L / (u - V), 'Usaste u − V en la ida y en la vuelta. A la vuelta van en sentidos opuestos: se acercan con u + V.'),
        h('REL-V-signo', 2 * L / (u + V), 'Usaste u + V en la ida y en la vuelta. A la ida van en el mismo sentido: el mensajero solo gana u − V.'),
        h('REL-V-solo-ida', t1, 'Ese es solo el tiempo de ida, de la cola a la cabeza. Falta la vuelta, en la que se cruza con la columna.'),
      ];
      const solucion = [
        ['Respecto a la columna, el mensajero recorre ', v('L', `${L} m`), ' a la ida y otros tantos a la vuelta.'],
        ['Ida (mismo sentido): ', v('L', `${L}`), '/(', v('u', `${u}`), ' − ', v('V', `${V}`), `) = ${f(t1)} s. Vuelta (sentidos opuestos): ${L}/(${u} + ${V}) = ${f(t2)} s.`],
        [v('x', 't'), ` = ${f(t1)} + ${f(t2)} = `, v('x', `${f(correcta)} s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_IV, enunciado, pregunta, solucion,
        datos: { tipo: 'idavuelta', sub, u, V, L } });
    }
    if (sub === 'tren') {
      const u = rng.elegir([1, 1.5, 2, 2.5]), V = rng.elegir([10, 15, 20, 25]), L = rng.elegir([15, 20, 24, 30, 40]);
      const correcta = 2 * L / u;
      if (!limpio(correcta)) return null;
      const enunciado = ['El tren de Puno a Cusco avanza en línea recta a ', v('V', `${V} m/s`), '. Un pasajero camina a ', v('u', `${f(u)} m/s`),
        ' respecto al vagón, desde la puerta de atrás hasta la de adelante, y vuelve. El vagón mide ', v('L', `${L} m`), '.'];
      const pregunta = ['¿Cuánto ', v('x', 'tiempo'), ' tarda en ir y volver?'];
      const errores = [
        h('REL-V-suma-vehiculo', L / (u + V) + L / (V - u), `Sumaste o restaste la rapidez del tren, pero los ${L} m del vagón se recorren respecto al vagón, y ahí el pasajero va a ${f(u)} m/s en los dos sentidos.`),
        h('REL-V-suma-vehiculo', 2 * L / (u + V), 'Usaste su rapidez respecto a la vía. El largo del vagón se mide en el vagón: respecto a él, el pasajero va a su propia rapidez.'),
        h('REL-V-solo-ida', L / u, 'Ese es solo el tiempo de ida. Falta volver: otros tantos segundos.'),
        h('REL-V-la-propia', 2 * L / V, `Dividiste entre la rapidez del tren. El pasajero camina dentro del vagón a ${f(u)} m/s: esa es la que recorre el largo del vagón.`),
      ];
      const solucion = [
        ['Mira todo desde el vagón: ahí el pasajero camina a ', v('u', `${f(u)} m/s`), ' a la ida y a la vuelta, y el tren no cuenta.'],
        [v('x', 't'), ' = 2·', v('L', `${L}`), '/', v('u', f(u)), ' = ', v('x', `${f(correcta)} s`), `. (Respecto a la vía va a ${f(V + u)} m/s y luego a ${f(V - u)} m/s, pero eso no cambia el tiempo.)`],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_IV, enunciado, pregunta, solucion,
        datos: { tipo: 'idavuelta', sub, u, V, L } });
    }
    // nadador: T = L/(u − V) + L/(u + V) dado; se pide u (respecto al agua). El bote avanza a V respecto al agua.
    const u = rng.elegir([1.5, 2, 2.5, 3, 4, 5]), V = rng.elegir([0.5, 1, 1.5, 2, 3]), L = rng.elegir([6, 8, 10, 12, 15, 16, 20, 24]);
    if (V >= u) return null;
    const T = L / (u - V) + L / (u + V);
    if (!limpio(T, 1)) return null;
    const enunciado = ['Un bote de ', v('L', `${L} m`), ' de largo avanza a ', v('V', `${f(V)} m/s`), ' respecto al agua quieta de una laguna. Un nadador va de la popa a la proa y vuelve a la popa nadando siempre con la misma rapidez respecto al agua. Tarda ',
      v('x', `${f(T)} s`), ' en total.'];
    const pregunta = ['¿Cuál es la ', v('u', 'rapidez del nadador'), ' respecto al agua?'];
    const errores = [
      h('REL-V-ignora-marco', 2 * L / T, `Dividiste ${2 * L} m entre ${f(T)} s como si el bote estuviera quieto. Respecto al bote, a la ida el nadador avanza a u − ${f(V)} y a la vuelta a u + ${f(V)}.`),
      h('REL-V-signo', 2 * L / T + V, 'Sumaste la rapidez del bote al promedio. El tiempo de ida y el de vuelta son distintos: hay que plantear L/(u − V) + L/(u + V) = T.'),
      h('REL-V-solo-ida', L / T + V, 'Tomaste todo el tiempo como si fuera la ida, persiguiendo a la proa. El tiempo dado es de ida y vuelta.'),
      h('REL-V-signo', Math.abs(2 * L / T - V), 'Restaste la rapidez del bote al promedio. Plantea los dos tramos por separado: L/(u − V) + L/(u + V) = T.'),
    ];
    const solucion = [
      ['Respecto al bote: a la ida el nadador persigue a la proa con ', v('u', 'u'), ' − ', v('V', f(V)), ' y a la vuelta se cruza con la popa con ', v('u', 'u'), ' + ', v('V', f(V)), '.'],
      [v('L', `${L}`), '/(u − ', v('V', f(V)), ') + ', v('L', `${L}`), '/(u + ', v('V', f(V)), ') = ', v('x', f(T)), '.'],
      ['Probando o resolviendo la ecuación de segundo grado: ', v('u', `u = ${f(u)} m/s`), ` (ida ${f(L / (u - V))} s y vuelta ${f(L / (u + V))} s).`],
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
      const enunciado = sub === 'encuentro'
        ? ['Una combi y un camión están a ', v('D', `${D} m`), ' uno del otro en una carretera recta y van a encontrarse: la combi a ', v('a', `${v1} m/s`), ' y el camión a ', v('b', `${v2} m/s`), ', los dos con rapidez constante.']
        : ['Una moto persigue a un camión por una carretera recta. Ahora están separados ', v('D', `${D} m`), '; la moto va a ', v('a', `${v1} m/s`), ' y el camión a ', v('b', `${v2} m/s`), ', en el mismo sentido y con rapidez constante.'];
      const pregunta = sub === 'encuentro' ? ['¿Dentro de cuánto ', v('x', 'tiempo'), ' se cruzan?'] : ['¿Dentro de cuánto ', v('x', 'tiempo'), ' la moto alcanza al camión?'];
      const otra = sub === 'encuentro' ? Math.abs(v1 - v2) : v1 + v2;
      const errores = [
        h('REL-V-signo', D / otra, sub === 'encuentro' ? 'Restaste las rapideces. Se acercan en sentidos opuestos: la distancia se acorta con la suma.' : 'Sumaste las rapideces. Van en el mismo sentido: la moto solo descuenta la diferencia cada segundo.'),
        h('REL-V-ignora-marco', D / v1, `Dividiste entre la rapidez de un solo móvil, como si el otro estuviera quieto. El otro también se mueve: usa la rapidez de uno respecto al otro.`),
        h('REL-V-ignora-marco', D / v2, 'Usaste solo la rapidez del camión. Lo que cuenta es con qué rapidez cambia la distancia entre los dos.'),
        h('REL-V-promedio', D / ((v1 + v2) / 2), 'Usaste el promedio de las rapideces. La distancia entre los dos cambia con la rapidez relativa: suma o diferencia, no promedio.'),
      ];
      const solucion = [
        [sub === 'encuentro' ? 'Visto desde el camión, la combi se le acerca a ' : 'Visto desde el camión, la moto se le acerca a ', v('a', `${v1}`), sub === 'encuentro' ? ' + ' : ' − ', v('b', `${v2}`), ` = ${rel} m/s.`],
        [v('x', 't'), ' = ', v('D', `${D}`), `/${rel} = `, v('x', `${f(correcta)} s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_C, enunciado, pregunta, solucion,
        datos: { tipo: 'cruce', sub, v1, v2: sub === 'encuentro' ? -v2 : v2, D } });
    }
    // trenes que se cruzan por completo
    const L1 = rng.elegir([80, 100, 120, 150, 180, 200]), L2 = rng.elegir([60, 80, 100, 120, 150]), v1 = rng.entero(10, 30), v2 = rng.entero(5, 25), opuestos = rng.moneda();
    if (!opuestos && v2 >= v1) return null;
    const rel = opuestos ? v1 + v2 : v1 - v2, correcta = (L1 + L2) / rel;
    if (!limpio(correcta, 1)) return null;
    const enunciado = ['Dos trenes van por vías rectas y paralelas', opuestos ? ', en sentidos opuestos' : ', en el mismo sentido', ': uno de ', v('D', `${L1} m`), ' a ', v('a', `${v1} m/s`),
      ' y otro de ', v('D', `${L2} m`), ' a ', v('b', `${v2} m/s`), '.'];
    const pregunta = opuestos ? ['¿Cuánto ', v('x', 'tiempo'), ' pasa desde que sus frentes se encuentran hasta que sus colas se separan?']
      : ['¿Cuánto ', v('x', 'tiempo'), ' tarda el más rápido en pasar por completo al otro (desde que su frente alcanza la cola del otro hasta que su cola deja atrás el frente del otro)?'];
    const errores = [
      h('REL-V-signo', (L1 + L2) / (opuestos ? Math.abs(v1 - v2) : v1 + v2), opuestos ? 'Restaste las rapideces. Van en sentidos opuestos: uno pasa frente al otro con la suma.' : 'Sumaste las rapideces. Van en el mismo sentido: el rápido gana solo la diferencia.'),
      h('REL-V-un-largo', L1 / rel, `Contaste solo el largo de un tren. Para cruzarse por completo, uno tiene que recorrer, respecto al otro, ${L1} + ${L2} m.`),
      h('REL-V-un-largo', L2 / rel, `Contaste solo el largo del otro tren. Respecto a un tren, el otro recorre la suma de los dos largos: ${L1 + L2} m.`),
      h('REL-V-ignora-marco', (L1 + L2) / v1, 'Usaste la rapidez de un solo tren, como si el otro estuviera parado.'),
    ];
    const solucion = [
      ['Desde un tren, el otro se mueve a ', v('a', `${v1}`), opuestos ? ' + ' : ' − ', v('b', `${v2}`), ` = ${rel} m/s y tiene que recorrer los dos largos: `, v('D', `${L1} + ${L2} = ${L1 + L2} m`), '.'],
      [v('x', 't'), ` = ${L1 + L2}/${rel} = `, v('x', `${f(correcta)} s`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_C, enunciado, pregunta, solucion,
      datos: { tipo: 'cruce', sub, v1, v2: opuestos ? -v2 : v2, L1, L2 } });
  }

  // ================= bote en el río =================
  const VAR_B = { u: { nombre: 'velocidad del bote respecto al agua', color: 'o' }, c: { nombre: 'velocidad de la corriente', color: 'i' }, W: { nombre: 'ancho y distancias', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  // Ángulos notables: [grados, seno, coseno].
  const NOT = [[0, 0, 1], [16, 7 / 25, 24 / 25], [30, 1 / 2, Math.sqrt(3) / 2], [37, 3 / 5, 4 / 5], [53, 4 / 5, 3 / 5], [74, 24 / 25, 7 / 25]];
  const ang = grados => NOT.find(n => n[0] === grados);
  const direccion = (g, sentido) => (g === 0 ? { clave: 'proa:0', texto: 'Perpendicular a la orilla (0°)' }
    : { clave: `proa:${g}:${sentido}`, texto: `${g}° río ${sentido} de la perpendicular` });
  const RIO = ['Un bote cruza el río Ramis', 'Un bote cruza el río Rímac', 'Un bote a motor cruza el río Ucayali', 'Un bote cruza el río Madre de Dios'];

  function bote(rng, semilla, sub) {
    const Rio = rng.elegir(RIO);
    if (sub === 'recto' || sub === 'angulo') {
      const [g, s, c0] = rng.elegir(NOT.filter(n => n[0] && (sub === 'angulo' || n[0] !== 30)));
      const u = rng.elegir(g === 30 ? [2, 4, 6, 8, 10] : [2.5, 5, 10, 25, 50].filter(x => limpio(x * s) && limpio(x * c0)));
      if (u === undefined) return null;
      const c = u * s, vy = u * c0, W = rng.elegir([40, 60, 80, 100, 120, 150, 200, 240, 300]);
      if (!limpio(c) || c > 10 || u > 12) return null;
      const enunciado = [`${Rio}, de `, v('W', `${W} m`), ' de ancho. La corriente es de ', v('c', `${f(c)} m/s`), ' y el bote avanza a ', v('u', `${f(u)} m/s`),
        ' respecto al agua. El botero quiere llegar al punto que está justo enfrente, siguiendo una línea recta perpendicular a la orilla.'];
      if (sub === 'recto') {
        const correcta = W / vy;
        if (!limpio(correcta, 1)) return null;
        const errores = [
          h('REL-V-apunta-destino', W / u, `Dividiste el ancho entre ${f(u)} m/s, como si apuntara directo y la corriente no lo arrastrara. Para ir recto apunta río arriba, y solo una parte de su velocidad lo hace cruzar.`),
          h('REL-V-suma-pitagoras', W / Math.hypot(u, c), 'Sumaste la corriente y el bote con Pitágoras, como si la proa fuera perpendicular. Para ir recto, la velocidad del bote es la hipotenusa: el cruce va con √(u² − c²).'),
          h('REL-V-signo', W / (u - c), 'Restaste las rapideces como si fueran paralelas. La corriente es perpendicular a la línea de cruce: la componente que cruza es √(u² − c²).'),
          h('REL-V-signo', W / (u + c), 'Sumaste las rapideces como si fueran paralelas. La corriente no ayuda a cruzar: es perpendicular al cruce.'),
        ];
        const solucion = [
          ['Para no ser arrastrado, la componente río arriba del bote debe anular la corriente: ', v('u', f(u)), '·sen θ = ', v('c', f(c)), `, θ = ${g}°.`],
          ['Lo que queda para cruzar: ', v('u', `√(${f(u)}² − ${f(c)}²)`), ` = ${f(vy)} m/s. `, v('x', 't'), ' = ', v('W', `${W}`), `/${f(vy)} = `, v('x', `${f(correcta)} s`), '.'],
        ];
        return cerrar(rng, semilla, { aprox: true, correcta, errores, texto: con('s'), unidad: 's', variables: VAR_B, enunciado, pregunta: ['¿Cuánto ', v('x', 'tiempo'), ' tarda en cruzar?'], solucion,
          datos: { tipo: 'bote', sub, u, c, W } });
      }
      const correcta = direccion(g, 'arriba');
      const errores = [
        { id: 'REL-V-apunta-destino', ...direccion(0), explicacion: 'Apuntaste la proa directo al punto de enfrente. La corriente lo arrastraría río abajo: hay que apuntar río arriba para compensarla.' },
        { id: 'REL-V-sentido', ...direccion(g, 'abajo'), explicacion: 'El ángulo está bien, pero hacia el lado equivocado. Si apunta río abajo, la corriente y el bote empujan hacia el mismo lado y lo alejan más del punto.' },
        { id: 'REL-V-angulo-desde-orilla', ...direccion(90 - g, 'arriba'), explicacion: `Ese ángulo sale de sen θ = c/u medido desde la orilla. Desde la perpendicular, la componente río arriba es u·sen θ: sen θ = ${f(c)}/${f(u)}.` },
        { id: 'REL-V-angulo-desde-orilla', ...direccion(90 - g, 'abajo'), explicacion: 'Mediste el ángulo desde la orilla y además hacia río abajo. Para ir recto, la proa apunta río arriba y u·sen θ = c, con θ desde la perpendicular.' },
      ].map(e => ({ ...e, respaldo: 'hipotesis', fuente: TRA }));
      const solucion = [
        ['La corriente empuja río abajo: la proa debe apuntar río arriba para que una parte de su velocidad la anule.'],
        [v('u', f(u)), '·sen θ = ', v('c', f(c)), ` → sen θ = ${f(c)}/${f(u)} → `, v('x', `θ = ${g}° río arriba de la perpendicular`), '.'],
      ];
      return cerrarTexto(rng, semilla, { correcta, errores, variables: VAR_B, enunciado, pregunta: ['¿Hacia dónde debe apuntar la ', v('x', 'proa'), '? (Ángulo medido desde la perpendicular a la orilla; usa sen 16° = 7/25, sen 30° = 1/2, sen 37° = 3/5, sen 53° = 4/5 y sen 74° = 24/25.)'], solucion,
        datos: { tipo: 'bote', sub, u, c, W } });
    }
    if (sub === 'tmin' || sub === 'deriva' || sub === 'resultante') {
      const [u, c, R] = rng.elegir([[4, 3, 5], [3, 4, 5], [8, 6, 10], [6, 8, 10], [12, 5, 13], [5, 12, 13], [2.4, 1, 2.6], [1.5, 2, 2.5], [2, 1.5, 2.5]]);
      if (!limpio(Math.hypot(u, c), 2) || Math.abs(Math.hypot(u, c) - R) > 1e-9) return null;
      const W = rng.elegir([24, 36, 48, 60, 72, 96, 120, 144, 240]);
      const t = W / u, deriva = c * t;
      if (!limpio(t, 1) || !limpio(deriva, 1)) return null;
      const enunciado = [`${Rio}, de `, v('W', `${W} m`), ' de ancho. La corriente es de ', v('c', `${f(c)} m/s`), ' y el bote avanza a ', v('u', `${f(u)} m/s`), ' respecto al agua.',
        sub === 'tmin' ? ' El botero quiere llegar a la otra orilla lo antes posible, sin importar dónde desembarque.' : ' El botero mantiene la proa perpendicular a la orilla.'];
      if (sub === 'tmin') {
        const errores = [
          h('REL-V-suma-pitagoras', W / R, `Dividiste el ancho entre la rapidez respecto a tierra (${f(R)} m/s). Esa velocidad va en diagonal; lo que cruza es solo la componente perpendicular, que es la del bote, ${f(u)} m/s.`),
          u > c ? h('REL-V-recto-es-rapido', W / Math.sqrt(u * u - c * c), 'Ese es el tiempo para cruzar en línea recta, apuntando río arriba. Ir recto no es lo más rápido: así se gasta parte de la velocidad en pelear con la corriente.') : null,
          h('REL-V-signo', W / (u + c), 'Sumaste la corriente como si ayudara a cruzar. La corriente es paralela a la orilla: no acerca ni aleja de la otra orilla.'),
          u > c ? h('REL-V-signo', W / (u - c), 'Restaste la corriente como si frenara el cruce. Es paralela a la orilla: el tiempo de cruce depende solo de la componente perpendicular.') : null,
        ];
        const solucion = [
          ['Lo que lo acerca a la otra orilla es solo la componente perpendicular de su velocidad. Es máxima con la proa perpendicular: ', v('u', `${f(u)} m/s`), '.'],
          [v('x', 't'), ' = ', v('W', `${W}`), '/', v('u', f(u)), ' = ', v('x', `${f(t)} s`), '. La corriente lo desvía, pero no lo retrasa.'],
        ];
        return cerrar(rng, semilla, { aprox: true, correcta: t, errores, texto: con('s'), unidad: 's', variables: VAR_B, enunciado, pregunta: ['¿Cuál es el ', v('x', 'tiempo mínimo'), ' para cruzar?'], solucion,
          datos: { tipo: 'bote', sub, u, c, W } });
      }
      if (sub === 'deriva') {
        const errores = [
          h('REL-V-invertido', u * W / c, 'Pusiste las rapideces al revés. Cruza con la del bote (t = W/u) y en ese tiempo la corriente lo lleva c·t.'),
          h('REL-V-distancia-total', R * t, `Esa es la distancia total que recorre respecto a tierra (en diagonal). Lo que lo desplaza río abajo es solo la corriente: ${f(c)}·${f(t)}.`),
          h('REL-V-suma-pitagoras', c * W / R, `Calculaste el tiempo con la rapidez respecto a tierra (${f(R)} m/s). El cruce va con la componente perpendicular, ${f(u)} m/s: t = ${f(t)} s.`),
          h('REL-V-ancho', W, 'Ese es el ancho del río. Río abajo lo lleva la corriente durante el cruce: c·W/u.'),
        ];
        const solucion = [
          ['Tiempo de cruce: ', v('W', `${W}`), '/', v('u', f(u)), ` = ${f(t)} s.`],
          ['En ese tiempo la corriente lo lleva río abajo: ', v('c', f(c)), `·${f(t)} = `, v('x', `${f(deriva)} m`), '.'],
        ];
        return cerrar(rng, semilla, { aprox: true, correcta: deriva, errores, texto: con('m'), unidad: 'm', variables: VAR_B, enunciado,
          pregunta: ['¿A qué ', v('x', 'distancia río abajo'), ' del punto de enfrente llega a la otra orilla?'], solucion, datos: { tipo: 'bote', sub, u, c, W } });
      }
      const errores = [
        h('REL-V-suma-escalar', u + c, 'Sumaste las rapideces como si fueran en la misma dirección. Son perpendiculares: se suman con Pitágoras.'),
        h('REL-V-signo', Math.abs(u - c), 'Restaste las rapideces. La corriente no va contra el bote: es perpendicular. Se suman con Pitágoras.'),
        h('REL-V-ignora-corriente', u, 'Esa es la rapidez del bote respecto al agua. Respecto a tierra, se le suma (como vector) la corriente.'),
        h('REL-V-suma-pitagoras', Math.sqrt(Math.abs(u * u - c * c)), 'Restaste los cuadrados. Con la proa perpendicular, las dos velocidades son los catetos: se suman sus cuadrados.'),
      ];
      const solucion = [
        ['Respecto a tierra, el bote lleva su velocidad perpendicular a la orilla (', v('u', f(u)), ') y la de la corriente, paralela (', v('c', f(c)), ').'],
        [v('x', 'v'), ` = √(${f(u)}² + ${f(c)}²) = `, v('x', `${f(R)} m/s`), '.'],
      ];
      return cerrar(rng, semilla, { aprox: true, correcta: R, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_B, enunciado,
        pregunta: ['¿Cuál es la ', v('x', 'rapidez del bote respecto a tierra'), '?'], solucion, datos: { tipo: 'bote', sub, u, c, W } });
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
    // la dirección del destino (desde la perpendicular) debe ser un ángulo notable
    // dirección del embarcadero desde la perpendicular: [grados, tangente]
    const tg = Rx / Ry, phi = [[16, 7 / 24], [37, 3 / 4], [45, 1], [53, 4 / 3], [74, 24 / 7]].find(n => Math.abs(Math.abs(tg) - n[1]) < 1e-9);
    if (!phi) return null;
    const W = rng.elegir([24, 48, 60, 72, 84, 96, 120, 140, 144, 168, 240]), d = W * Math.abs(tg);
    if (!Number.isInteger(d)) return null;
    const lado = Rx > 0 ? 'abajo' : 'arriba';
    const enunciado = [`${Rio}, de `, v('W', `${W} m`), ' de ancho. La corriente es de ', v('c', `${f(c)} m/s`), ' y el bote avanza a ', v('u', `${f(u)} m/s`),
      ' respecto al agua. El botero quiere llegar, en línea recta, al embarcadero de la otra orilla que está ', v('W', `${d} m`), ` río ${lado} del punto de enfrente.`];
    const correcta = direccion(g, g === 0 ? '' : (arriba ? 'arriba' : 'abajo'));
    const errores = [
      { id: 'REL-V-apunta-destino', ...direccion(phi[0], lado), explicacion: `Apuntaste la proa directo al embarcadero. La corriente también empuja: la velocidad respecto a tierra (bote + corriente) es la que debe ir hacia el embarcadero, no la proa.` },
      g ? { id: 'REL-V-ignora-corriente', ...direccion(0), explicacion: 'Apuntaste perpendicular a la orilla. Así la corriente lo lleva a otro punto: hay que componer la velocidad del bote con la de la corriente.' } : null,
      g ? { id: 'REL-V-sentido', ...direccion(g, arriba ? 'abajo' : 'arriba'), explicacion: 'El ángulo está bien, pero hacia el otro lado. Revisa hacia dónde tiene que compensar a la corriente.' } : null,
      { id: 'REL-V-sentido', ...direccion(phi[0], lado === 'abajo' ? 'arriba' : 'abajo'), explicacion: 'Usaste el ángulo del embarcadero y además hacia el otro lado. Plantea la suma de vectores: bote + corriente debe apuntar al embarcadero.' },
      { id: 'REL-V-angulo-desde-orilla', ...direccion(90 - phi[0], lado), explicacion: 'Mediste el ángulo hacia el embarcadero desde la orilla, y además apuntaste la proa ahí. Se mide desde la perpendicular, y la proa no va al embarcadero: va la velocidad respecto a tierra.' },
    ].filter(e => e && e.clave !== correcta.clave).map(e => ({ ...e, respaldo: 'hipotesis', fuente: TRA }));
    const ux2 = Math.abs(ux);
    const solucion = [
      ['La velocidad respecto a tierra es la del bote más la corriente, y debe apuntar al embarcadero: por cada ', v('W', `${W} m`), ' que cruza, avanza ', v('W', `${d} m`), ` río ${lado}.`],
      g === 0
        ? ['Con la proa perpendicular, cruza con ', v('u', `${f(u)} m/s`), ' y la corriente lo lleva río abajo a ', v('c', `${f(c)} m/s`), '.']
        : [`Con la proa a ${g}° río ${arriba ? 'arriba' : 'abajo'}: componente que cruza `, v('u', `${f(u)}·${f(c0)} = ${f(uy)} m/s`),
          ' y componente a lo largo del río ', v('u', `${f(u)}·${f(s)} = ${f(ux2)} m/s`), ` río ${arriba ? 'arriba' : 'abajo'}.`],
      [g === 0 ? '' : ['A lo largo del río queda ', v('c', f(c)), ` ${ux >= 0 ? '+' : '−'} ${f(ux2)} = ${f(Rx)} m/s${Rx < 0 ? ' (río arriba)' : ''}. `],
        `Y ${f(Math.abs(Rx))}/${f(uy)} = ${d}/${W}: llega justo al embarcadero. `, v('x', correcta.texto), '.'].flat().filter(x => x !== ''),
    ];
    return cerrarTexto(rng, semilla, { correcta, errores, variables: VAR_B, enunciado,
      pregunta: ['¿Hacia dónde debe apuntar la ', v('x', 'proa'), '? (Ángulo medido desde la perpendicular a la orilla; usa sen 16° = 7/25, sen 30° = 1/2, sen 37° = 3/5, sen 53° = 4/5 y sen 74° = 24/25.)'], solucion,
      datos: { tipo: 'bote', sub, u, c, W, d: Rx > 0 ? d : -d } });
  }
  function cerrarTexto(rng, semilla, o) {
    const alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores, rng });
    return {
      id: `velocidad-relativa#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta.clave, texto: o.correcta.texto, unidad: '' }, _datos: o.datos,
    };
  }

  // ================= botes: lanzar un saco =================
  const VAR_BS = { M: { nombre: 'masas', color: 'o' }, u: { nombre: 'rapidez del saco respecto al bote', color: 'i' }, V: { nombre: 'velocidades respecto al agua', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  function botes(rng, semilla, sub) {
    const M = rng.elegir([70, 90, 110, 140, 190, 240]), m = rng.elegir([5, 10, 20, 30]), u = rng.elegir([2, 3, 4, 5, 6, 8, 10]);
    const VA = m * u / (M + m), w = u - VA;
    const base = ['En una laguna de agua quieta, un bote está en reposo. El bote con su tripulante tiene ', v('M', `${M} kg`), ' y lleva un saco de ', v('M', `${m} kg`),
      '. El tripulante lanza el saco horizontalmente hacia el este con una rapidez de ', v('u', `${f(u)} m/s`), ' respecto al bote (medida con el bote ya en movimiento). No hay roce con el agua.'];
    const sol1 = ['Cantidad de movimiento antes: 0. Si el bote sale hacia el oeste con V, el saco va a u − V respecto al agua: ',
      v('M', `${M}`), '·V = ', v('M', `${m}`), '·(', v('u', f(u)), ' − V).'];
    const sol2 = ['V·(', `${M} + ${m}) = ${m}·${f(u)} → `, v('V', `V = ${f(VA)} m/s`), ' hacia el oeste.'];
    if (sub === 'lanza' || sub === 'objeto') {
      if (!limpio(VA) || !limpio(w)) return null;
      if (sub === 'lanza') {
        const errores = [
          h('REL-V-respecto-al-agua', m * u / M, `Tomaste ${f(u)} m/s como la rapidez del saco respecto al agua. Es respecto al bote, que retrocede: respecto al agua, el saco va a u − V.`),
          h('CHO-rapidez-del-saco', w, 'Esa es la rapidez del saco respecto al agua. Piden la del bote.'),
          h('CHO-misma-rapidez', u, 'El bote no sale con la rapidez del saco: tiene mucha más masa. Plantea la conservación de la cantidad de movimiento.'),
          h('CHO-masa-doble', m * u / (M + 2 * m), `Sumaste la masa del saco dos veces. El bote (${M} kg) se lleva V y el saco (${m} kg) se lleva u − V.`),
        ];
        return cerrar(rng, semilla, { correcta: VA, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_BS, enunciado: base,
          pregunta: ['¿Con qué ', v('x', 'rapidez'), ' se mueve el bote respecto al agua justo después del lanzamiento?'], solucion: [sol1, [...sol2.slice(0, 2), v('x', `V = ${f(VA)} m/s`), ' hacia el oeste.']],
          datos: { tipo: 'botes', sub, M, m, u } });
      }
      const errores = [
        h('REL-V-respecto-al-agua', u, `Esa es la rapidez respecto al bote. El bote retrocede a ${f(VA)} m/s; respecto al agua el saco va a ${f(u)} − ${f(VA)}.`),
        h('REL-V-signo', u + VA, 'Sumaste la rapidez del bote. El bote va hacia el oeste y el saco hacia el este: respecto al agua, el saco va a u − V.'),
        h('CHO-rapidez-del-bote', VA, 'Esa es la rapidez del bote. Piden la del saco respecto al agua.'),
        h('REL-V-respecto-al-agua', u - m * u / M, 'Calculaste V como si el saco fuera a u respecto al agua, y luego le restaste esa V. Plantea la conservación con u − V desde el principio.'),
      ];
      return cerrar(rng, semilla, { correcta: w, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_BS, enunciado: base,
        pregunta: ['¿Con qué ', v('x', 'rapidez'), ' se mueve el saco respecto al agua?'],
        solucion: [sol1, sol2, ['Saco respecto al agua: ', v('u', f(u)), ' − ', v('V', f(VA)), ' = ', v('x', `${f(w)} m/s`), ' hacia el este.']], datos: { tipo: 'botes', sub, M, m, u } });
    }
    if (sub === 'recibe') {
      const M2 = rng.elegir([60, 80, 90, 120, 150, 190]);
      const VB = m * w / (M2 + m);
      if (!limpio(VB) || !limpio(VA)) return null;
      const enunciado = [...base, ' Un segundo bote, de ', v('M', `${M2} kg`), ' con su tripulante, está en reposo al este y atrapa el saco.'];
      const errores = [
        h('REL-V-respecto-al-agua', m * u / (M2 + m), `Usaste ${f(u)} m/s como rapidez del saco respecto al agua. Es respecto al primer bote, que retrocede: respecto al agua el saco llega a ${f(w)} m/s.`),
        h('CHO-sin-masa-saco', m * w / M2, 'Olvidaste que el saco se queda en el segundo bote: después de atraparlo se mueven juntos, con masa M₂ + m.'),
        h('REL-V-signo', m * (u + VA) / (M2 + m), 'Sumaste la rapidez del primer bote a la del saco. El primer bote va hacia el oeste: respecto al agua, el saco va a u − V.'),
        h('CHO-rapidez-del-bote', VA, 'Esa es la rapidez del bote que lanza. El que recibe tiene otra masa y recibe el saco con otra rapidez.'),
      ];
      const solucion = [sol1, sol2, ['El saco va a ', v('u', f(u)), ' − ', v('V', f(VA)), ` = ${f(w)} m/s respecto al agua. El segundo bote lo atrapa: `, v('M', `${m}`), `·${f(w)} = (`, v('M', `${M2} + ${m}`), ')·V₂.'],
        [v('x', 'V₂'), ` = ${f(m * w)}/${M2 + m} = `, v('x', `${f(VB)} m/s`), ' hacia el este.']];
      return cerrar(rng, semilla, { correcta: VB, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_BS, enunciado,
        pregunta: ['¿Con qué ', v('x', 'rapidez'), ' se mueve el segundo bote después de atrapar el saco?'], solucion, datos: { tipo: 'botes', sub, M, m, u, M2 } });
    }
    // dos: dos sacos iguales, el primero al oeste y luego el segundo al este, cada uno a u respecto al bote
    const V1 = m * u / (M + 2 * m), V2 = V1 - m * u / (M + m), correcta = Math.abs(V2);
    if (!limpio(V1) || !limpio(correcta) || correcta === 0) return null;
    const enunciado = ['En una laguna de agua quieta, un bote está en reposo. El bote con su tripulante tiene ', v('M', `${M} kg`), ' y lleva dos sacos de ', v('M', `${m} kg`),
      ' cada uno. El tripulante lanza un saco hacia el oeste y, después, el otro hacia el este, los dos horizontalmente y a ', v('u', `${f(u)} m/s`), ' respecto al bote (medida con el bote ya en movimiento). No hay roce con el agua.'];
    const errores = [
      h('REL-V-respecto-al-agua', 0, `Tomaste los ${f(u)} m/s como rapidez respecto al agua: así los dos lanzamientos se anularían y el bote quedaría quieto. Cada rapidez es respecto al bote, que ya se mueve distinto en cada lanzamiento.`),
      h('CHO-solo-un-lanzamiento', V1, 'Esa es la rapidez después del primer lanzamiento. Falta el segundo, que lo frena y lo hace retroceder.'),
      h('CHO-solo-un-lanzamiento', m * u / (M + m), 'Ese es el cambio de velocidad del segundo lanzamiento solo. Hay que restarle la velocidad que ya traía del primero.'),
      h('REL-V-signo', V1 + m * u / (M + m), 'Sumaste los efectos de los dos lanzamientos. Van en sentidos opuestos: uno empuja el bote al este y el otro al oeste.'),
    ];
    const solucion = [
      ['Primer saco (al oeste): 0 = ', v('M', `(${M} + ${m})`), '·V₁ − ', v('M', `${m}`), '·(', v('u', f(u)), ` − V₁) → V₁ = ${m}·${f(u)}/${M + 2 * m} = ${f(V1)} m/s al este.`],
      ['Segundo saco (al este): ', v('M', `(${M} + ${m})`), `·${f(V1)} = `, v('M', `${M}`), '·V₂ + ', v('M', `${m}`), '·(V₂ + ', v('u', f(u)), `) → V₂ = ${f(V1)} − ${m}·${f(u)}/${M + m} = ${f(V2)} m/s.`],
      ['El bote termina moviéndose hacia el ', V2 < 0 ? 'oeste' : 'este', ' a ', v('x', `${f(correcta)} m/s`), '.'],
    ];
    return cerrar(rng, semilla, { negativos: true, correcta, errores: errores.filter(e => e.valor >= 0), texto: con('m/s'), unidad: 'm/s', variables: VAR_BS, enunciado,
      pregunta: ['¿Con qué ', v('x', 'rapidez'), ' queda moviéndose el bote?'], solucion, datos: { tipo: 'botes', sub, M, m, u } });
  }

  return { id: 'velocidad-relativa', titulo: 'La combi y el río', generar };
});
