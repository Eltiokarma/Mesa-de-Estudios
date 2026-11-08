/*
 * Generador «El viaje en tramos»: rapidez media, gráfica v-t con tiempo mínimo, lectura de las
 * ecuaciones x(t) y del par x(t), y(t), y el radio de giro según la latitud.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['cinematica-medias']) y en Node (require). No usa ningún motor.
 *
 * Tipos y subtipos:
 *   media     distancia  mitad del recorrido a v1 y mitad a v2: media armónica 2·v1·v2/(v1 + v2)
 *             tiempo     mitad del tiempo a v1 y mitad a v2: media aritmética (v1 + v2)/2
 *             duraciones dos tramos de distinta duración, a veces con una parada en medio:
 *                        distancia total entre tiempo total (la parada cuenta)
 *             mixta      mitad del recorrido a v1; de la otra mitad, la mitad del tiempo a v2 y la
 *                        otra mitad del tiempo a v3
 *   idavuelta rapidez    tabla de posiciones de una ida, una parada y una vuelta: distancia/tiempo
 *             velocidad  la misma tabla: módulo del desplazamiento/tiempo (puede ser 0)
 *   vt        vmax       acelera y frena con el mismo módulo, sin tramo constante: d y t dados → vmax = 2d/t
 *             tmin       acelera con a y frena con b, sin tope: el tiempo mínimo
 *             tope       igual, con rapidez tope: tramo constante en medio
 *   ecuacion  velocidad, aceleracion, desplazamiento, parada, origen: lectura de x = x0 + b·t + c·t²
 *   xy        distancia (al origen), rapidez, altura (máxima), alcance: x = x0 + vx·t, y = y0 + vy·t − 5t²
 *   latitud   rapidez    rapidez lineal por la rotación de la Tierra: v = 2π·R·cos λ / 24 h (π = 3)
 *             radio      radio de giro r = R·cos λ
 *
 * Convenciones: g = 10 m/s²; en la Tierra R = 6400 km, un día = 24 h y π = 3 (como en la academia);
 * cos 16° = 24/25, cos 37° = 4/5, cos 53° = 3/5, cos 60° = 1/2. Coma decimal. Las respuestas con signo
 * (velocidad, aceleración, desplazamiento de la ecuación) usan negativos y se escriben con signo.
 * Errores: G2, G4 y K4 (parcial, docs/investigacion/cinematica-ideas-erroneas.md); PR3, PR6 y U6
 * (hipótesis, docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md); MED-* (trampa 10,
 * docs/clasificacion/trampas-admision-unmsm/fisica.md), VT-*, XY-*, LAT-* y MRUV-*, hipótesis nuestras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const CIN = 'docs/investigacion/cinematica-ideas-erroneas.md';
  const TRA = 'docs/clasificacion/trampas-admision-unmsm/fisica.md';
  const TRV = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = TRA) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: CIN });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const limpio = (x, dec = 2) => Number.isFinite(x) && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && Math.abs(x) < 1e6;
  const corto = x => limpio(x) && x > 0;
  const par = x => (x < 0 ? `(${f(x)})` : f(x));

  const TIPOS = [['media', 'distancia'], ['media', 'distancia'], ['media', 'tiempo'], ['media', 'duraciones'], ['media', 'duraciones'], ['media', 'mixta'],
    ['idavuelta', 'rapidez'], ['idavuelta', 'velocidad'], ['vt', 'vmax'], ['vt', 'tmin'], ['vt', 'tope'],
    ['ecuacion', 'velocidad'], ['ecuacion', 'aceleracion'], ['ecuacion', 'desplazamiento'], ['ecuacion', 'parada'], ['ecuacion', 'origen'],
    ['xy', 'distancia'], ['xy', 'rapidez'], ['xy', 'altura'], ['xy', 'alcance'], ['latitud', 'rapidez'], ['latitud', 'radio']];

  function generar(semilla) {
    const rng = Azar.crear('cinematica-medias|' + semilla);
    const [tipo, sub] = rng.elegir(TIPOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'media') return media(rng, semilla, sub);
    if (tipo === 'idavuelta') return idaVuelta(rng, semilla, sub);
    if (tipo === 'vt') return graficaVT(rng, semilla, sub);
    if (tipo === 'ecuacion') return ecuacionX(rng, semilla, sub);
    if (tipo === 'xy') return planoXY(rng, semilla, sub);
    return latitud(rng, semilla, sub);
  }

  function cerrar(rng, semilla, o) {
    const ok = o.negativos ? limpio : corto;
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => ok(e.valor)), rng, texto: o.texto, negativos: !!o.negativos });
    return {
      id: `cinematica-medias#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }
  const con = u => x => `${f(x)} ${u}`;

  // ================= media: rapidez media de un viaje en tramos =================
  const VAR_MEDIA = { v1: { nombre: 'rapidez del primer tramo', color: 'o' }, v2: { nombre: 'rapidez del segundo tramo', color: 'i' },
    t: { nombre: 'tiempos de cada tramo', color: 'h' }, x: { nombre: 'rapidez media', color: 'd' } };
  const VIAJES = [['Una combi va de Juliaca a Puno', 'la combi'], ['Un ciclista va de su casa a la chacra', 'el ciclista'],
    ['Un bus interprovincial va de Arequipa a Camaná', 'el bus'], ['Una mototaxi va del mercado al paradero', 'la mototaxi']];

  function media(rng, semilla, sub) {
    const [Quien, quien] = rng.elegir(VIAJES);
    const RAP = [12, 15, 18, 20, 24, 30, 36, 40, 45, 48, 50, 60, 72, 80, 90];
    if (sub === 'distancia') {
      const v1 = rng.elegir(RAP), v2 = rng.elegir(RAP);
      if (v1 === v2) return null;
      const correcta = 2 * v1 * v2 / (v1 + v2);
      if (!Number.isInteger(correcta)) return null;
      const D = rng.elegir([2, 4, 6]) * v1 * v2 / (v1 + v2) * rng.elegir([1, 2]);
      if (!Number.isInteger(D) || D > 400) return null;
      const t1 = D / 2 / v1, t2 = D / 2 / v2;
      const enunciado = [`${Quien}, que están a ${f(D)} km. La primera mitad del camino la hace a `, v('v1', `${f(v1)} km/h`),
        ' y la segunda mitad a ', v('v2', `${f(v2)} km/h`), '.'];
      const pregunta = ['¿Cuál es su ', v('x', 'rapidez media'), ' en todo el viaje?'];
      const errores = [
        h('MED-promedio-rapideces', (v1 + v2) / 2, `Promediaste las dos rapideces. Eso solo vale si cada rapidez dura el mismo tiempo. Aquí las dos mitades son de distancia: ${quien} pasa más tiempo en el tramo lento, y ese tramo pesa más. La rapidez media es distancia total entre tiempo total.`),
        h('MED-mitad-entre-total', v1 * v2 / (v1 + v2), `Dividiste solo la mitad del camino (${f(D / 2)} km) entre el tiempo total. La rapidez media usa toda la distancia: ${f(D)} km entre ${f(t1 + t2)} h.`),
        h('MED-un-tramo', Math.min(v1, v2), `Tomaste la rapidez del tramo más lento porque ahí pasa más tiempo. Ese tramo pesa más, pero no es el único: la media es ${f(D)} km entre el tiempo de los dos tramos.`),
        h('MED-un-tramo', Math.max(v1, v2), 'Tomaste la rapidez de un solo tramo. La media junta los dos: distancia total entre tiempo total.'),
      ];
      const solucion = [
        ['Tiempo de cada mitad: ', v('t', `t₁ = ${f(D / 2)}/${f(v1)} = ${f(t1)} h`), ' y ', v('t', `t₂ = ${f(D / 2)}/${f(v2)} = ${f(t2)} h`), '.'],
        [v('x', 'Rapidez media'), ` = distancia total / tiempo total = ${f(D)}/${f(t1 + t2)} = `, v('x', `${f(correcta)} km/h`), '.'],
        ['Atajo para mitades de recorrido: 2·', v('v1', 'v₁'), '·', v('v2', 'v₂'), '/(', v('v1', 'v₁'), ' + ', v('v2', 'v₂'), `) = 2·${f(v1)}·${f(v2)}/${f(v1 + v2)}. Sale menos que el promedio, ${f((v1 + v2) / 2)}, porque el tramo lento dura más.`],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('km/h'), unidad: 'km/h', variables: VAR_MEDIA, enunciado, pregunta, solucion,
        datos: { tipo: 'media', sub, v1, v2, D } });
    }
    if (sub === 'tiempo') {
      const v1 = rng.elegir(RAP), v2 = rng.elegir(RAP), T = rng.elegir([1, 2, 3, 4]);
      if (v1 === v2) return null;
      const correcta = (v1 + v2) / 2;
      if (!limpio(correcta, 1)) return null;
      const enunciado = [`${Quien}. Viaja ${f(T)} h en total: la primera mitad del tiempo va a `, v('v1', `${f(v1)} km/h`), ' y la otra mitad del tiempo a ', v('v2', `${f(v2)} km/h`), '.'];
      const pregunta = ['¿Cuál es su ', v('x', 'rapidez media'), ' en todo el viaje?'];
      const d1 = v1 * T / 2, d2 = v2 * T / 2;
      const errores = [
        h('MED-armonica-por-aritmetica', 2 * v1 * v2 / (v1 + v2), 'Usaste el atajo 2·v₁·v₂/(v₁ + v₂), que es para mitades de recorrido. Aquí las mitades son de tiempo: cada rapidez dura lo mismo, y la media es el promedio simple.'),
        h('MED-entre-medio-tiempo', v1 + v2, `Dividiste la distancia total (${f(d1 + d2)} km) entre la mitad del tiempo. El tiempo total es ${f(T)} h.`),
        h('MED-un-tramo', Math.max(v1, v2), `Tomaste la rapidez del tramo en que avanza más. La media junta los dos tramos: ${f(d1 + d2)} km en ${f(T)} h.`),
        h('MED-un-tramo', Math.min(v1, v2), 'Tomaste la rapidez de un solo tramo. La media es distancia total entre tiempo total.'),
      ];
      const solucion = [
        ['Cada mitad dura ', v('t', `${f(T / 2)} h`), `: avanza ${f(v1)}·${f(T / 2)} = ${f(d1)} km y ${f(v2)}·${f(T / 2)} = ${f(d2)} km.`],
        [v('x', 'Rapidez media'), ` = ${f(d1 + d2)}/${f(T)} = `, v('x', `${f(correcta)} km/h`), '. Con tiempos iguales, la media es el promedio de las rapideces.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('km/h'), unidad: 'km/h', variables: VAR_MEDIA, enunciado, pregunta, solucion,
        datos: { tipo: 'media', sub, v1, v2, T } });
    }
    if (sub === 'duraciones') {
      const MIN = [10, 15, 20, 30, 40, 45, 60, 90];
      const v1 = rng.elegir(RAP), v2 = rng.elegir(RAP), t1 = rng.elegir(MIN), t2 = rng.elegir(MIN), tp = rng.elegir([0, 0, 5, 10, 15, 20, 30]);
      if (v1 === v2 || t1 === t2) return null;
      const d1 = v1 * t1 / 60, d2 = v2 * t2 / 60, T = (t1 + tp + t2) / 60;
      if (!limpio(d1) || !limpio(d2)) return null;
      const correcta = (d1 + d2) / T;
      if (!limpio(correcta, 1)) return null;
      const enunciado = [`${Quien}. Primero va `, v('t', `${t1} min`), ' a ', v('v1', `${f(v1)} km/h`),
        tp ? [', se detiene ', v('t', `${tp} min`), ' en un paradero'] : '', ' y luego va ', v('t', `${t2} min`), ' a ', v('v2', `${f(v2)} km/h`), ' hasta llegar.'].flat();
      const pregunta = ['¿Cuál es su ', v('x', 'rapidez media'), ' en todo el viaje?'];
      const errores = [
        h('MED-promedio-rapideces', (v1 + v2) / 2, `Promediaste las rapideces. Los tramos duran distinto (${t1} y ${t2} min): pesa más el que dura más. La media es distancia total entre tiempo total.`),
        h('MED-pesos-cruzados', (v1 * t2 + v2 * t1) / (t1 + tp + t2), `Multiplicaste cada rapidez por el tiempo del otro tramo. La distancia de cada tramo es su propia rapidez por su propio tiempo: ${f(v1)}·${t1}/60 = ${f(d1)} km.`),
      ];
      if (tp) {
        errores.push(h('MED-sin-parada', (d1 + d2) / ((t1 + t2) / 60), `No contaste los ${tp} min de la parada. La rapidez media usa todo el tiempo del viaje, también el que pasa quieto.`));
        errores.push(h('MED-promedio-con-parada', (v1 + v2) / 3, 'Promediaste tres rapideces (la de la parada como 0). Los tramos duran distinto; la media es distancia total entre tiempo total.'));
      } else {
        errores.push(h('MED-un-tramo', d1 + d2 > 0 && t1 > t2 ? v1 : v2, 'Tomaste la rapidez del tramo que dura más. Ese tramo pesa más, pero el otro también cuenta.'));
        errores.push(h('U6-minutos', (d1 + d2) / (t1 + t2), `Dividiste los ${f(d1 + d2)} km entre los minutos, sin pasarlos a horas: ${t1 + t2} min = ${f(T)} h.`, TRV));
      }
      const solucion = [
        ['Distancia de cada tramo: ', v('v1', f(v1)), '·', v('t', `${t1}/60`), ` = ${f(d1)} km y `, v('v2', f(v2)), '·', v('t', `${t2}/60`), ` = ${f(d2)} km.`],
        [`Tiempo total: ${t1}${tp ? ` + ${tp}` : ''} + ${t2} = ${t1 + tp + t2} min = ${f(T)} h${tp ? ' (la parada cuenta)' : ''}.`],
        [v('x', 'Rapidez media'), ` = ${f(d1 + d2)}/${f(T)} = `, v('x', `${f(correcta)} km/h`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('km/h'), unidad: 'km/h', variables: VAR_MEDIA, enunciado, pregunta, solucion,
        datos: { tipo: 'media', sub, v1, v2, t1, t2, tp } });
    }
    // mixta
    const v1 = rng.elegir(RAP), v2 = rng.elegir(RAP), v3 = rng.elegir(RAP);
    if (v2 === v3 || v1 === v2 || v1 === v3) return null;
    const u = (v2 + v3) / 2, correcta = 2 * v1 * u / (v1 + u);
    if (!Number.isInteger(u) || !Number.isInteger(correcta)) return null;
    const u2 = 2 * v2 * v3 / (v2 + v3);
    const VAR = { ...VAR_MEDIA, v3: { nombre: 'rapideces de la segunda mitad', color: 'h' } };
    const enunciado = [`${Quien}. La primera mitad del camino la hace a `, v('v1', `${f(v1)} km/h`), '. En la otra mitad, la mitad del tiempo va a ',
      v('v2', `${f(v2)} km/h`), ' y el tiempo que queda va a ', v('v3', `${f(v3)} km/h`), '.'];
    const pregunta = ['¿Cuál es su ', v('x', 'rapidez media'), ' en todo el viaje?'];
    const errores = [
      h('MED-promedio-rapideces', (v1 + v2 + v3) / 3, 'Promediaste las tres rapideces. No duran lo mismo: hay que ir por partes, distancia total entre tiempo total.'),
      h('MED-promedio-rapideces', (v1 + u) / 2, `La segunda mitad sí da ${f(u)} km/h (ahí los tiempos son iguales), pero luego promediaste ${f(v1)} y ${f(u)}. Esas dos son mitades de recorrido: va la fórmula 2·v₁·u/(v₁ + u).`),
      h('MED-armonica-por-aritmetica', 2 * v1 * u2 / (v1 + u2), `En la segunda mitad usaste 2·v₂·v₃/(v₂ + v₃), que es para mitades de recorrido. Ahí las mitades son de tiempo: su media es el promedio simple, ${f(u)} km/h.`),
      h('MED-armonica-por-aritmetica', 3 / (1 / v1 + 1 / v2 + 1 / v3), 'Usaste la media armónica de las tres, como si cada una cubriera un tercio del camino. No es así: ve por partes.'),
    ];
    const solucion = [
      ['En la segunda mitad, los dos ratos duran lo mismo: su rapidez media es el promedio, ', v('v3', `u = (${f(v2)} + ${f(v3)})/2 = ${f(u)} km/h`), '.'],
      ['Queda un viaje de dos mitades de recorrido, a ', v('v1', f(v1)), ' y a ', v('v3', f(u)), ' km/h: ', v('x', 'v'), ` = 2·${f(v1)}·${f(u)}/(${f(v1)} + ${f(u)}) = `, v('x', `${f(correcta)} km/h`), '.'],
      [`Comprobación con 1 km por mitad: t = 1/${f(v1)} + 1/${f(u)} h y v = 2/t = ${f(correcta)} km/h.`],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: con('km/h'), unidad: 'km/h', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'media', sub, v1, v2, v3 } });
  }

  // ================= idavuelta: tabla de posiciones =================
  const VAR_IV = { x: { nombre: 'posiciones', color: 'o' }, t: { nombre: 'instantes', color: 'h' }, r: { nombre: 'lo que se pide', color: 'd' } };
  function idaVuelta(rng, semilla, sub) {
    const x0 = rng.elegir([0, 0, 20, 40, 50, 100]), d1 = rng.elegir([60, 80, 100, 120, 150, 180, 200, 240]);
    const d2 = sub === 'velocidad' && rng.moneda() ? d1 : rng.elegir([20, 40, 60, 80, 100, 120, 150].filter(x => x <= d1 + x0));
    const ta = rng.elegir([10, 15, 20, 25, 30]), tpar = rng.elegir([0, 5, 10, 15, 20]), tv = rng.elegir([10, 15, 20, 25, 30, 40]);
    const tb = ta + tpar, tc = tb + tv;
    if (d2 === undefined) return null;
    const x1 = x0 + d1, x2 = x1 - d2, dist = d1 + d2, desp = Math.abs(x2 - x0);
    const correcta = sub === 'rapidez' ? dist / tc : desp / tc;
    if (!limpio(correcta)) return null;
    if (sub === 'rapidez' && x2 === x0 && rng.moneda()) return null;
    const [Quien, quien] = rng.elegir([['Una combi', 'la combi'], ['Un carrito de helados', 'el carrito'], ['Una bicicleta', 'la bicicleta']]);
    const tabla = tpar ? [`t (s): `, v('t', `0; ${ta}; ${tb}; ${tc}`), '  |  x (m): ', v('x', `${x0}; ${x1}; ${x1}; ${x2}`)]
      : [`t (s): `, v('t', `0; ${ta}; ${tc}`), '  |  x (m): ', v('x', `${x0}; ${x1}; ${x2}`)];
    const enunciado = [`${Quien} se mueve por una avenida recta. Sus posiciones, medidas desde un grifo, se anotaron en esta tabla (en cada tramo va con rapidez constante): `, ...tabla, '.'];
    const pregunta = sub === 'rapidez' ? ['¿Cuál es su ', v('r', 'rapidez media'), ` entre t = 0 y t = ${tc} s?`]
      : ['¿Cuál es el módulo de su ', v('r', 'velocidad media'), ` entre t = 0 y t = ${tc} s?`];
    const r1 = d1 / ta, r2 = d2 / tv, mov = ta + tv;
    let errores;
    if (sub === 'rapidez') {
      errores = [
        h('MED-desplazamiento-por-distancia', desp / tc, `Usaste el desplazamiento (${desp} m): eso da la velocidad media. La rapidez media usa la distancia recorrida, la ida más la vuelta: ${d1} + ${d2} = ${dist} m.`),
        tpar ? h('MED-sin-parada', dist / mov, `No contaste los ${tpar} s en que ${quien} estuvo quieto. La rapidez media divide entre todo el tiempo.`) : null,
        h('MED-promedio-rapideces', (r1 + r2) / 2, `Promediaste la rapidez de la ida (${f(r1)} m/s) y la de la vuelta (${f(r2)} m/s). Duran distinto: la media es distancia total entre tiempo total.`),
        x0 ? pa('G2-altura-entre-tiempo', x2 / tc, `Dividiste la posición final (${x2} m) entre el tiempo. La posición se mide desde el grifo; la rapidez media necesita la distancia recorrida.`) : null,
        h('MED-solo-ida', r1, `Esa es la rapidez de la ida sola. Falta la parada y la vuelta: ${dist} m en ${tc} s.`),
      ];
    } else {
      errores = [
        h('MED-distancia-por-desplazamiento', dist / tc, `Usaste la distancia recorrida (${dist} m): eso da la rapidez media. La velocidad media usa el desplazamiento, posición final menos inicial: ${x2} − ${x0} = ${x2 - x0} m.`),
        x0 ? pa('G2-altura-entre-tiempo', x2 / tc, `Dividiste la posición final (${x2} m) entre el tiempo. El desplazamiento es la posición final menos la inicial (${x0} m).`) : null,
        tpar && desp ? h('MED-sin-parada', desp / mov, `No contaste los ${tpar} s de la parada. La velocidad media divide entre todo el tiempo.`) : null,
        h('MED-solo-ida', r1, `Esa es la rapidez de la ida sola. Hay que tomar todo el intervalo: desplazamiento entre ${tc} s.`),
        h('MED-promedio-rapideces', Math.abs(r1 - r2) / 2, 'Promediaste las velocidades de la ida y de la vuelta con su signo. Los tramos duran distinto, y la parada también cuenta: desplazamiento total entre tiempo total.'),
      ];
    }
    const solucion = [
      [`Ida: de ${x0} m a ${x1} m (${d1} m).${tpar ? ` Parada: de ${ta} s a ${tb} s.` : ''} Vuelta: de ${x1} m a ${x2} m (${d2} m).`],
      sub === 'rapidez'
        ? ['Distancia recorrida: ', v('x', `${d1} + ${d2} = ${dist} m`), '. ', v('r', 'Rapidez media'), ` = ${dist}/${tc} = `, v('r', `${f(correcta)} m/s`), '.']
        : ['Desplazamiento: ', v('x', `${x2} − ${x0} = ${x2 - x0} m`), '. ', v('r', 'Velocidad media'), ` = ${Math.abs(x2 - x0)}/${tc} = `, v('r', `${f(correcta)} m/s`), x2 === x0 ? ': volvió al punto de partida, aunque recorrió mucho.' : '.'],
    ];
    return cerrar(rng, semilla, { negativos: sub === 'velocidad', correcta, errores: errores.filter(e => e && e.valor >= 0), texto: con('m/s'), unidad: 'm/s', variables: VAR_IV, enunciado, pregunta, solucion,
      datos: { tipo: 'idavuelta', sub, t: [0, ta, tb, tc], x: [x0, x1, x1, x2] } });
  }

  // ================= vt: tiempo mínimo con tramos acelerado y frenado =================
  const VAR_VT = { d: { nombre: 'distancia', color: 'o' }, a: { nombre: 'aceleraciones', color: 'i' }, t: { nombre: 'tiempo o rapidez tope', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  const ACEL = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];
  function graficaVT(rng, semilla, sub) {
    const [Quien, quien] = rng.elegir([['Un tren', 'el tren'], ['Un metro de Lima', 'el metro'], ['Un auto de carreras', 'el auto']]);
    if (sub === 'vmax') {
      const vm = rng.entero(5, 30), t = rng.elegir([20, 24, 30, 36, 40, 50, 60, 80, 100]);
      const d = vm * t / 2;
      if (!Number.isInteger(d)) return null;
      const enunciado = [`${Quien} parte del reposo entre dos estaciones que están a `, v('d', `${d} m`), '. Acelera de manera uniforme y, apenas alcanza su rapidez máxima, frena de manera uniforme con una aceleración del mismo módulo hasta detenerse. Tarda ', v('t', `${t} s`), ' en total.'];
      const pregunta = ['¿Cuál es su ', v('x', 'rapidez máxima'), '?'];
      const errores = [
        pa('G4-area-como-rectangulo', d / t, `Dividiste ${d} m entre ${t} s: esa es la rapidez media. ${quien[0].toUpperCase() + quien.slice(1)} no va siempre a la máxima: la gráfica v-t es un triángulo y su área es la mitad de base por altura.`),
        h('VT-tramo-constante', 1.5 * d / t, 'Agregaste un tramo a rapidez constante (un tercio del tiempo). El enunciado dice que frena apenas llega a la máxima: no hay tramo plano, la gráfica es un triángulo.'),
        h('VT-medio-triangulo', 4 * d / t, `Tomaste solo el triángulo del tramo acelerado (${f(t / 2)} s) como si cubriera los ${d} m. El triángulo completo, de base ${t} s, es el que da el recorrido.`),
        h('VT-despeje', d / t / 2, 'Dividiste entre 2 en vez de multiplicar. De d = ½·t·vmax sale vmax = 2·d/t.'),
      ];
      const solucion = [
        ['La gráfica v-t es un triángulo: sube hasta ', v('x', 'vmax'), ' en la mitad del tiempo y baja a cero.'],
        ['El recorrido es el área: ', v('d', `${d}`), ' = ½ · ', v('t', `${t}`), ' · ', v('x', 'vmax'), ' → ', v('x', `vmax = 2·${d}/${t} = ${f(vm)} m/s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: vm, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_VT, enunciado, pregunta, solucion,
        datos: { tipo: 'vt', sub, d, t } });
    }
    const a = rng.elegir(ACEL), b = rng.elegir(ACEL);
    if (sub === 'tmin') {
      const vm = rng.elegir([6, 8, 10, 12, 15, 18, 20, 24, 30]);
      const ta = vm / a, tb = vm / b, d = vm * (ta + tb) / 2, correcta = ta + tb;
      if (!Number.isInteger(d) || !limpio(correcta, 1) || d > 2000) return null;
      const enunciado = [`${Quien} debe ir de una estación a otra, a `, v('d', `${d} m`), ', partiendo del reposo y llegando en reposo. Puede acelerar como máximo a ',
        v('a', `${f(a)} m/s²`), ' y frenar como máximo a ', v('a', `${f(b)} m/s²`), '. No tiene límite de rapidez.'];
      const pregunta = ['¿Cuál es el ', v('x', 'tiempo mínimo'), ' del viaje?'];
      const errores = [
        h('VT-sin-frenar', Math.sqrt(2 * d / a), `Supusiste que acelera todo el camino: d = ½·a·t². Así llegaría a toda velocidad. Tiene que frenar para llegar en reposo, y eso alarga el viaje.`),
        a !== b ? h('VT-mitad-camino', Math.sqrt(d / a) + Math.sqrt(d / b), `Supusiste que cambia de acelerar a frenar en la mitad del camino. Eso solo pasa si a y frenado son iguales; aquí frena con otra aceleración, y el punto de cambio se corre.`) : null,
        h('VT-todo-a-vmax', d / vm, `Dividiste ${d} m entre la rapidez máxima (${f(vm)} m/s), como si fuera siempre a esa rapidez. Va acelerando y frenando: su rapidez media es la mitad de la máxima.`),
        h('VT-un-tramo', ta, `Ese es solo el tiempo en que acelera. Falta el tiempo de frenado: ${f(vm)}/${f(b)} = ${f(tb)} s.`),
      ].filter(Boolean);
      const solucion = [
        ['El tiempo mínimo se logra acelerando al máximo y frenando al máximo, sin tramo plano: la gráfica v-t es un triángulo.'],
        ['Si la cima es vmax: tiempos vmax/', v('a', f(a)), ' y vmax/', v('a', f(b)), '; área = ', v('d', `${d}`), ` = ½·vmax²·(1/${f(a)} + 1/${f(b)}) → vmax = ${f(vm)} m/s.`],
        [v('x', 't'), ` = ${f(ta)} + ${f(tb)} = `, v('x', `${f(correcta)} s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_VT, enunciado, pregunta, solucion,
        datos: { tipo: 'vt', sub, d, a, b } });
    }
    // tope
    const vt = rng.elegir([6, 8, 10, 12, 15, 20]);
    const ta = vt / a, tb = vt / b, dab = vt * (ta + tb) / 2;
    const d = Math.round(dab + vt * rng.entero(2, 20) * rng.elegir([1, 2, 5]));
    const tc = (d - dab) / vt, correcta = ta + tc + tb;
    if (!limpio(dab) || !limpio(correcta, 1) || d > 3000) return null;
    const enunciado = [`${Quien} debe ir de una estación a otra, a `, v('d', `${d} m`), ', partiendo del reposo y llegando en reposo. Puede acelerar como máximo a ',
      v('a', `${f(a)} m/s²`), ', frenar como máximo a ', v('a', `${f(b)} m/s²`), ' y no debe pasar de ', v('t', `${f(vt)} m/s`), '.'];
    const pregunta = ['¿Cuál es el ', v('x', 'tiempo mínimo'), ' del viaje?'];
    const errores = [
      h('VT-sin-arranque', d / vt, `Dividiste ${d} m entre ${f(vt)} m/s, como si fuera a la rapidez tope desde el inicio. Tiene que acelerar y frenar, y en esos tramos va más lento.`),
      h('VT-suma-tiempos', d / vt + ta + tb, `Sumaste los tiempos de acelerar y frenar a ${d}/${f(vt)}, pero contaste ${f(dab)} m dos veces: los que avanza mientras acelera y frena no se recorren a la rapidez tope.`),
      h('VT-ignora-tope', Math.sqrt(2 * d * (a + b) / (a * b)), `Ese es el tiempo sin límite de rapidez (gráfica en triángulo): para lograrlo pasaría de ${f(vt)} m/s. Con tope, la gráfica es un trapecio.`),
      h('VT-un-tramo', d / vt + ta / 2, `Contaste el arranque pero no el frenado: así llegaría a la estación a ${f(vt)} m/s. Frenar toma ${f(tb)} s más, en los que avanza solo la mitad de lo que avanzaría a rapidez tope.`),
    ];
    const solucion = [
      ['La gráfica v-t es un trapecio: acelera hasta ', v('t', `${f(vt)} m/s`), ', sigue constante y frena.'],
      [`Acelerando: ${f(vt)}/${f(a)} = ${f(ta)} s; frenando: ${f(vt)}/${f(b)} = ${f(tb)} s. En esos tramos avanza ½·${f(vt)}·(${f(ta)} + ${f(tb)}) = ${f(dab)} m.`],
      [`Tramo constante: (${d} − ${f(dab)})/${f(vt)} = ${f(tc)} s. `, v('x', 't'), ` = ${f(ta)} + ${f(tc)} + ${f(tb)} = `, v('x', `${f(correcta)} s`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_VT, enunciado, pregunta, solucion,
      datos: { tipo: 'vt', sub, d, a, b, vt } });
  }

  // ================= ecuacion: lectura de x = x0 + b·t + c·t² =================
  const VAR_EC = { x0: { nombre: 'posición inicial', color: 'o' }, v0: { nombre: 'velocidad inicial', color: 'i' }, a: { nombre: 'aceleración', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  function ecuacion(a, b, c) {
    const seg = ['x = '];
    const terms = [];
    if (a) terms.push(['x0', a, '']);
    if (b) terms.push(['v0', b, 't']);
    if (c) terms.push(['a', c, 't²']);
    terms.forEach(([k, n, s], i) => {
      const m = Math.abs(n), num = s && m === 1 ? '' : f(m);
      seg.push(i === 0 ? (n < 0 ? '−' : '') : (n < 0 ? ' − ' : ' + '), v(k, num + s));
    });
    return seg;
  }
  const X = (a, b, c) => t => a + b * t + c * t * t;
  function ecuacionX(rng, semilla, sub) {
    const [Obj, obj] = rng.elegir([['Un auto', 'el auto'], ['Una moto', 'la moto'], ['Un carrito', 'el carrito']]);
    const base = [`${Obj} se mueve por una pista recta. Su posición es `];
    const cola = [', con x en m y t en s (x positiva hacia el este).'];
    const ok = (a, b, c) => [...base, ...ecuacion(a, b, c), ...cola];
    if (sub === 'velocidad' || sub === 'aceleracion') {
      const a = rng.entero(-20, 20), b = rng.entero(-12, 12), c = rng.elegir([-3, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 3, 4]);
      if (b === 0) return null;
      const t = rng.entero(1, 6), T = X(a, b, c);
      if (sub === 'velocidad') {
        const correcta = b + 2 * c * t;
        if (correcta === 0) return null;
        const errores = [
          h('PR3-coeficiente-como-a', b + c * t, `Tomaste el coeficiente de t² (${f(c)}) como la aceleración. En x = x0 + v0·t + ½·a·t² ese coeficiente es a/2: a = ${f(2 * c)} m/s².`, TRV),
          pa('G2-altura-entre-tiempo', T(t) / t, `Dividiste la posición x(${t}) entre ${t} s. Eso no es la velocidad del instante: la velocidad cambia, y es la pendiente de la gráfica x-t en ese punto.`),
          h('MRUV-sin-v0', 2 * c * t, 'Olvidaste la velocidad inicial, el coeficiente de t: v = v0 + a·t.'),
          h('MRUV-signo', -correcta, 'Te salió el signo cambiado. El signo de v dice hacia dónde va: revisa los signos de v0 y de a.'),
          h('MRUV-posicion-por-velocidad', T(t), `Ese es x(${t}), la posición. La velocidad sale de v = v0 + a·t.`),
        ];
        const solucion = [
          ['Comparando con x = ', v('x0', 'x0'), ' + ', v('v0', 'v0'), '·t + ½·', v('a', 'a'), '·t²: ', v('v0', `v0 = ${f(b)} m/s`), ' y ½·a = ', f(c), ', así que ', v('a', `a = ${f(2 * c)} m/s²`), '.'],
          [v('x', 'v'), ` = v0 + a·t = ${f(b)} + ${par(2 * c)}·${t} = `, v('x', `${f(correcta)} m/s`), correcta < 0 ? ' (va hacia el oeste).' : ' (va hacia el este).'],
        ];
        return cerrar(rng, semilla, { negativos: true, correcta, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_EC, enunciado: ok(a, b, c),
          pregunta: ['¿Cuál es su ', v('x', 'velocidad'), ` en t = ${t} s? (Positiva hacia el este.)`], solucion, datos: { tipo: 'ecuacion', sub, coef: [a, b, c], t } });
      }
      const correcta = 2 * c;
      const errores = [
        h('PR3-coeficiente-como-a', c, 'Tomaste el coeficiente de t² como la aceleración. En x = x0 + v0·t + ½·a·t², ese coeficiente es a/2: hay que multiplicarlo por 2.', TRV),
        h('MRUV-lineal-como-a', b, 'Tomaste el coeficiente de t como la aceleración. Ese es v0, la velocidad inicial; la aceleración sale del término en t².'),
        h('MRUV-signo', -correcta, `Perdiste el signo. El coeficiente de t² es ${f(c)}: la aceleración tiene ese mismo signo.`),
        h('PR3-coeficiente-como-a', c / 2, 'Dividiste el coeficiente de t² entre 2. Es al revés: el coeficiente ya es a/2, así que a es el doble.', TRV),
      ];
      const solucion = [
        ['Comparando con x = ', v('x0', 'x0'), ' + ', v('v0', 'v0'), '·t + ½·', v('a', 'a'), '·t², el coeficiente de t² es a/2.'],
        [v('x', 'a'), ` = 2·${par(c)} = `, v('x', `${f(correcta)} m/s²`), '.'],
      ];
      return cerrar(rng, semilla, { negativos: true, correcta, errores, texto: con('m/s²'), unidad: 'm/s²', variables: VAR_EC, enunciado: ok(a, b, c),
        pregunta: ['¿Cuál es su ', v('x', 'aceleración'), '? (Con signo: positiva hacia el este.)'], solucion, datos: { tipo: 'ecuacion', sub, coef: [a, b, c] } });
    }
    if (sub === 'desplazamiento') {
      const a = rng.entero(-20, 30), b = rng.entero(1, 12), c = rng.elegir([-1, -0.5, 0.5, 1, 1.5, 2, 3]);
      const t1 = rng.entero(1, 4), t2 = t1 + rng.entero(1, 4);
      if (a === 0 || (c < 0 && -b / (2 * c) <= t2)) return null; // no se detiene en el intervalo
      const T = X(a, b, c), correcta = T(t2) - T(t1), dt = t2 - t1;
      if (!corto(correcta)) return null;
      const errores = [
        h('MRUV-posicion-por-desplazamiento', T(t2), `Ese es x(${t2}), la posición final. El desplazamiento es posición final menos inicial: x(${t2}) − x(${t1}).`, TRA),
        h('MRUV-desde-cero', T(t2) - a, `Restaste x0 = ${f(a)} m, la posición en t = 0. El intervalo empieza en t = ${t1} s: hay que restar x(${t1}).`),
        pa('K4-delta-t-contra-t', T(dt) - a, `Reemplazaste la duración (${dt} s) en la ecuación, como si empezara en t = 0. En t = ${t1} s ya va a otra velocidad.`),
        h('PR3-coeficiente-como-a', b * dt + c / 2 * (t2 * t2 - t1 * t1), 'Tomaste el coeficiente de t² como a y lo volviste a dividir entre 2. En la ecuación dada ese coeficiente ya es a/2.', TRV),
      ];
      const solucion = [
        [`Reemplazando: x(${t2}) = ${f(T(t2))} m y x(${t1}) = ${f(T(t1))} m (en ese intervalo no se detiene ni vuelve).`],
        [v('x', 'Δx'), ` = ${f(T(t2))} − ${par(T(t1))} = `, v('x', `${f(correcta)} m`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('m'), unidad: 'm', variables: VAR_EC, enunciado: ok(a, b, c),
        pregunta: [`¿Cuál es su `, v('x', 'desplazamiento'), ` entre t = ${t1} s y t = ${t2} s?`], solucion, datos: { tipo: 'ecuacion', sub, coef: [a, b, c], t1, t2 } });
    }
    if (sub === 'parada') {
      const k = rng.elegir([0.5, 1, 1.5, 2]), tp = rng.elegir([1, 1.5, 2, 2.5, 3, 4, 5, 6]), a = rng.entero(-10, 20);
      const c = -k, b = 2 * k * tp; // v = b + 2c·t se anula en tp
      if (!limpio(b)) return null;
      const correcta = tp;
      const T = X(a, b, c);
      const disc = b * b - 4 * c * a, raiz = (-b - Math.sqrt(Math.max(0, disc))) / (2 * c);
      const errores = [
        h('PR3-coeficiente-como-a', b / k, `Tomaste el coeficiente de t² como la aceleración. Ese coeficiente es a/2: a = ${f(2 * c)} m/s², y t = −v0/a = ${f(b)}/${f(2 * k)}.`, TRV),
        h('MRUV-despeje-al-reves', 2 * k / b, 'Despejaste al revés: de v0 + a·t = 0 sale t = −v0/a.'),
        disc >= 0 ? pa('G2-cero-de-x', raiz, `En ese instante x = 0: ${obj} pasa por el origen, pero no se detiene. Se detiene cuando la pendiente de x-t es cero: v = 0.`) : null,
      ].filter(Boolean);
      const solucion = [
        ['Comparando con x = x0 + v0·t + ½·a·t²: ', v('v0', `v0 = ${f(b)} m/s`), ' y ', v('a', `a = 2·(${f(c)}) = ${f(2 * c)} m/s²`), ': va hacia el este y frena.'],
        ['Se detiene cuando v = v0 + a·t = 0: ', v('x', 't'), ` = ${f(b)}/${f(2 * k)} = `, v('x', `${f(correcta)} s`), `. Ahí está en x = ${f(T(tp))} m, el punto más al este.`],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_EC, enunciado: ok(a, b, c),
        pregunta: [`¿En qué instante se detiene ${obj} por un momento?`], solucion, datos: { tipo: 'ecuacion', sub, coef: [a, b, c] } });
    }
    // origen: x = c(t − r)(t + s), con r > 0 y s > 0 (una sola raíz positiva)
    const c = rng.elegir([0.5, 1, 2, 2.5]), r = rng.entero(2, 10), s = rng.entero(1, 8);
    if (r === s) return null;
    const a = -c * r * s, b = c * (s - r);
    if (!limpio(a) || !limpio(b) || b === 0) return null;
    const correcta = r;
    const errores = [
      h('MRUV-sin-t2', -a / b, `Despejaste x0 + v0·t = 0, sin el término en t². ${obj[0].toUpperCase() + obj.slice(1)} acelera: hay que resolver la ecuación de segundo grado completa.`),
      h('MRUV-raiz-negativa', s, `${s} s sale de la raíz negativa, t = −${s} s, tomada sin signo. Un instante negativo es antes de empezar: no sirve.`),
      h('MRUV-vertice-por-raiz', Math.abs(b / (2 * c)), 'Ese es el instante en que la velocidad se anula (el vértice de la parábola). Pasar por el origen es x = 0, no v = 0.'),
      h('MRUV-sin-lineal', Math.sqrt(r * s), `Resolviste sin el término en t, como si fuera x0 + (coeficiente)·t² = 0. Los tres términos cuentan: hay que resolver la ecuación completa.`),
    ];
    const solucion = [
      ['Pasa por el origen cuando x = 0: ', ...ecuacion(a, b, c).slice(1), ' = 0.'],
      [`Factorizando: ${f(c)}·(t − ${r})·(t + ${s}) = 0 → t = ${r} s o t = −${s} s.`],
      ['El instante negativo no sirve: ', v('x', `t = ${correcta} s`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: con('s'), unidad: 's', variables: VAR_EC, enunciado: ok(a, b, c),
      pregunta: [`¿En qué instante pasa ${obj} por el origen (x = 0)?`], solucion, datos: { tipo: 'ecuacion', sub, coef: [a, b, c] } });
  }

  // ================= xy: x(t) = x0 + vx·t, y(t) = y0 + vy·t − 5t² =================
  const VAR_XY = { vx: { nombre: 'movimiento horizontal', color: 'o' }, vy: { nombre: 'movimiento vertical', color: 'i' }, g: { nombre: 'gravedad', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  const TRIPLES = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [9, 12, 15], [12, 9, 15], [12, 16, 20], [16, 12, 20], [7, 24, 25], [24, 7, 25], [20, 15, 25], [15, 20, 25], [24, 18, 30], [18, 24, 30]];
  function lin(k0, k1, letra, kv, kg, cuad) {
    const seg = [`${letra} = `];
    let primero = true;
    const add = (n, s, k) => {
      if (!n) return;
      const m = Math.abs(n), num = s && m === 1 ? '' : f(m);
      seg.push(primero ? (n < 0 ? '−' : '') : (n < 0 ? ' − ' : ' + '), v(k, num + s)); primero = false;
    };
    add(k0, '', kv); add(k1, 't', kv); if (cuad) add(-5, 't²', kg);
    if (primero) seg.push('0');
    return seg;
  }
  function planoXY(rng, semilla, sub) {
    const enun = (x0, vx, y0, vy) => ['Una piedra se lanza en un plano vertical. Sus coordenadas son ', ...lin(x0, vx, 'x', 'vx', 'g', false), ' y ', ...lin(y0, vy, 'y', 'vy', 'g', true),
      ', con x e y en m y t en s (y hacia arriba; el término en t² viene de g = 10 m/s²).'];
    if (sub === 'distancia') {
      const [Xt, Yt, Rt] = rng.elegir(TRIPLES), t = rng.entero(1, 3), vx = rng.entero(2, 12), vy = rng.entero(5, 25);
      const x0 = Xt - vx * t, y0 = Yt - vy * t + 5 * t * t;
      if (y0 < 0) return null;
      const correcta = Rt;
      const errores = [
        h('XY-suma-coordenadas', Xt + Yt, `Sumaste las coordenadas: ${Xt} + ${Yt}. La distancia al origen es la hipotenusa del triángulo de catetos x e y: √(x² + y²).`, TRA),
        h('XY-desde-partida', Math.hypot(Xt - x0, Yt - y0), `Esa es la distancia al punto de partida (${f(x0)}; ${f(y0)}), no al origen.`),
        h('XY-posicion-inicial', Math.hypot(x0, y0), 'Esa es la distancia al origen en t = 0. Hay que reemplazar el instante pedido en las dos ecuaciones.'),
        h('XY-sin-gravedad', Math.hypot(Xt, Yt + 5 * t * t), `Olvidaste el término −5t² de y. Con él, y(${t}) = ${Yt} m.`),
      ];
      const solucion = [
        [`En t = ${t} s: `, v('vx', `x = ${f(Xt)} m`), ' y ', v('vy', `y = ${f(Yt)} m`), '.'],
        ['Distancia al origen: ', v('x', `√(${Xt}² + ${Yt}²) = ${Rt} m`), ' (Pitágoras; las coordenadas no se suman).'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('m'), unidad: 'm', variables: VAR_XY, enunciado: enun(x0, vx, y0, vy),
        pregunta: [`¿A qué `, v('x', 'distancia del origen'), ` está la piedra en t = ${t} s?`], solucion, datos: { tipo: 'xy', sub, x0, vx, y0, vy, t } });
    }
    if (sub === 'rapidez') {
      const [vx, vyt, R] = rng.elegir(TRIPLES), t = rng.entero(1, 4), sube = rng.moneda();
      const vyNow = sube ? vyt : -vyt, vy = vyNow + 10 * t;
      if (vy <= 0) return null;
      const x0 = rng.entero(0, 10), y0 = rng.elegir([0, 0, 5, 10, 20]);
      const errores = [
        h('XY-suma-coordenadas', vx + vyt, `Sumaste las componentes: ${vx} + ${vyt}. La rapidez es la hipotenusa: √(vx² + vy²).`, TRA),
        h('XY-velocidad-inicial', Math.hypot(vx, vy), `Esa es la rapidez del inicio. vy cambia: en t = ${t} s vale ${f(vy)} − 10·${t} = ${f(vyNow)} m/s.`),
        h('PR3-coeficiente-como-g', Math.hypot(vx, vy - 5 * t), 'Tomaste el coeficiente de t² (5) como g. Ese coeficiente es g/2: vy = vy0 − 10·t.', TRV),
        h('XY-solo-vertical', vyt, 'Esa es solo la componente vertical. La horizontal sigue igual todo el tiempo y también cuenta.'),
      ];
      const solucion = [
        ['Componentes: ', v('vx', `vx = ${f(vx)} m/s`), ' (constante) y ', v('vy', `vy = ${f(vy)} − `), v('g', '10'), v('vy', `·${t} = ${f(vyNow)} m/s`), sube ? ' (sube).' : ' (ya baja).'],
        [v('x', 'v'), ` = √(${vx}² + ${vyt}²) = `, v('x', `${R} m/s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: R, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR_XY, enunciado: enun(x0, vx, y0, vy),
        pregunta: [`¿Cuál es su `, v('x', 'rapidez'), ` en t = ${t} s?`], solucion, datos: { tipo: 'xy', sub, x0, vx, y0, vy, t } });
    }
    if (sub === 'altura') {
      const vy = rng.elegir([10, 20, 30, 40, 50]), vx = rng.entero(3, 20), x0 = rng.entero(0, 10), y0 = rng.elegir([5, 15, 20, 35]);
      const H = vy * vy / 20, correcta = y0 + H;
      const errores = [
        h('PR3-coeficiente-como-g', y0 + vy * vy / 10, 'Tomaste el coeficiente de t² (5) como g. Ese coeficiente es g/2: g = 10 m/s², y lo que sube es vy²/(2g).', TRV),
        y0 ? h('XY-sin-y0', H, `Eso es lo que sube desde el punto de lanzamiento. Pero arranca en y = ${y0} m: hay que sumarlo.`) : null,
        h('XY-altura-con-vx', y0 + (vx * vx + vy * vy) / 20, 'Usaste la rapidez total al cuadrado. En la cima solo se acaba la vertical: la horizontal sigue.'),
        h('XY-tiempo-de-vuelo', y0 + vy * (vy / 5) - 5 * (vy / 5) ** 2, 'Reemplazaste el tiempo de vuelo (2·vy/g). En ese instante ya volvió a la altura de partida; la cima está en la mitad.'),
      ].filter(Boolean);
      const solucion = [
        ['En la cima la velocidad vertical es cero: ', v('vy', `vy = ${vy} − `), v('g', '10'), v('vy', '·t = 0'), ` → t = ${vy / 10} s.`],
        [`y(${vy / 10}) = ${y0 ? `${y0} + ` : ''}${vy}·${vy / 10} − 5·${vy / 10}² = `, v('x', `${f(correcta)} m`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: con('m'), unidad: 'm', variables: VAR_XY, enunciado: enun(x0, vx, y0, vy),
        pregunta: ['¿Cuál es la ', v('x', 'coordenada y más alta'), ' que alcanza la piedra?'], solucion, datos: { tipo: 'xy', sub, x0, vx, y0, vy } });
    }
    // alcance: hasta volver a la altura de partida
    const vy = rng.elegir([5, 10, 15, 20, 25, 30]), vx = rng.entero(3, 20), x0 = rng.elegir([0, 4, 6, 10, 12]), y0 = rng.elegir([0, 10, 20]);
    const T = vy / 5, correcta = vx * T;
    const errores = [
      h('XY-solo-subida', vx * T / 2, `Usaste solo el tiempo de subida (${f(T / 2)} s). Para volver a la altura de partida sube y baja: ${f(T)} s.`),
      h('PR3-coeficiente-como-g', vx * vy / 2.5, `Tomaste el coeficiente de t² (5) como g. El tiempo de vuelo sale de y = y0: ${vy}·t − 5t² = 0 → t = ${f(T)} s.`, TRV),
      x0 ? h('XY-coordenada-por-alcance', x0 + correcta, `Esa es la coordenada x al volver a la altura de partida. El alcance se mide desde el punto de lanzamiento, x = ${x0} m.`) : null,
      h('XY-suma-coordenadas', (vx + vy) * T, 'Multiplicaste el tiempo por vx + vy. El avance horizontal depende solo de vx, que no cambia.'),
    ].filter(Boolean);
    const solucion = [
      ['Vuelve a la altura de partida cuando ', v('vy', `${vy}·t`), ' − ', v('g', '5t²'), ` = 0 → t = ${f(T)} s.`],
      ['Avance horizontal: ', v('vx', `${vx}`), `·${f(T)} = `, v('x', `${f(correcta)} m`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: con('m'), unidad: 'm', variables: VAR_XY, enunciado: enun(x0, vx, y0, vy),
      pregunta: ['¿Qué ', v('x', 'distancia horizontal'), ' avanza la piedra hasta volver a la altura desde la que se lanzó?'], solucion, datos: { tipo: 'xy', sub, x0, vx, y0, vy } });
  }

  // ================= latitud: el paralelo de cada ciudad =================
  const VAR_LAT = { R: { nombre: 'radio de la Tierra', color: 'o' }, lam: { nombre: 'latitud', color: 'i' }, r: { nombre: 'radio de giro', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  const LUGARES = [
    { nombre: 'Juliaca', texto: 'Juliaca, a unos 16° de latitud sur (toma cos 16° = 24/25 y sen 16° = 7/25)', lat: 16, cos: 24 / 25, sen: 7 / 25 },
    { nombre: 'Lima', texto: 'Lima, a unos 12° de latitud sur (toma cos 12° = 0,98 y sen 12° = 0,2)', lat: 12, cos: 0.98, sen: 0.2 },
    { nombre: 'un punto del ecuador', texto: 'un punto del ecuador (latitud 0°)', lat: 0, cos: 1, sen: 0 },
    { nombre: 'una ciudad a 37° de latitud norte', texto: 'una ciudad a 37° de latitud norte (toma cos 37° = 4/5 y sen 37° = 3/5)', lat: 37, cos: 0.8, sen: 0.6 },
    { nombre: 'una ciudad a 53° de latitud sur', texto: 'una ciudad a 53° de latitud sur (toma cos 53° = 3/5 y sen 53° = 4/5)', lat: 53, cos: 0.6, sen: 0.8 },
    { nombre: 'una ciudad a 60° de latitud norte', texto: 'una ciudad a 60° de latitud norte (toma cos 60° = 1/2)', lat: 60, cos: 0.5, sen: Math.sqrt(3) / 2 },
  ];
  function latitud(rng, semilla, sub) {
    const L = rng.elegir(sub === 'radio' ? LUGARES.filter(x => x.lat) : LUGARES), R = 6400;
    const r = R * L.cos;
    const enunciado = ['La Tierra gira sobre su eje una vez cada 24 h. Toma su radio como ', v('R', `R = ${f(R)} km`), ' y π = 3. Piensa en ', v('lam', L.texto), '.'];
    if (sub === 'radio') {
      const errores = [
        h('LAT-sin-coseno', R, `Usaste el radio de la Tierra. Ese lugar no gira alrededor del centro de la Tierra sino alrededor del eje: su circunferencia es el paralelo, de radio R·cos λ.`, TRA),
        h('LAT-seno', R * L.sen, 'Usaste el seno de la latitud. R·sen λ es la altura del lugar sobre el plano del ecuador; la distancia al eje es R·cos λ.'),
        h('LAT-entre-coseno', R / L.cos, 'Dividiste entre el coseno. El paralelo es más chico que el ecuador: r = R·cos λ.'),
        h('PR6-diametro', 2 * R * L.cos, 'Ese es el diámetro del paralelo. El radio de giro es la mitad.', TRV),
      ];
      const solucion = [
        ['El lugar gira alrededor del eje de la Tierra, no del centro: describe un paralelo.'],
        ['Su distancia al eje es ', v('r', 'r'), ' = ', v('R', 'R'), '·cos ', v('lam', 'λ'), ` = ${f(R)}·${f(L.cos)} = `, v('x', `${f(r)} km`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: r, errores, texto: con('km'), unidad: 'km', variables: VAR_LAT, enunciado,
        pregunta: ['¿Cuál es el ', v('x', 'radio de la circunferencia'), ' que describe ese lugar por la rotación de la Tierra?'], solucion, datos: { tipo: 'latitud', sub, lat: L.lat } });
    }
    const correcta = 2 * 3 * r / 24;
    const errores = [
      h('LAT-sin-coseno', 2 * 3 * R / 24, `Usaste el radio de la Tierra (${f(R)} km). El lugar gira alrededor del eje en su paralelo, de radio R·cos λ = ${f(r)} km.`, TRA),
      h('LAT-seno', 2 * 3 * R * L.sen / 24, 'Usaste R·sen λ. La distancia al eje, que es el radio de giro, es R·cos λ.'),
      h('LAT-sin-2', 3 * r / 24, 'Olvidaste el 2 de la circunferencia: una vuelta recorre 2π·r.'),
      h('PR7-medio-dia', 2 * 3 * r / 12, 'Usaste 12 h como periodo. La Tierra da una vuelta en 24 h (el día entero, no solo el día con sol).', TRV),
      h('U6-por-dia', 2 * 3 * r, `Diste los km de una vuelta (por día) como si fueran km/h. Falta dividir entre las 24 h.`, TRV),
    ];
    const solucion = [
      ['El lugar gira en su paralelo, de radio ', v('r', 'r'), ' = ', v('R', 'R'), '·cos ', v('lam', 'λ'), ` = ${f(R)}·${f(L.cos)} = ${f(r)} km.`],
      ['En 24 h da una vuelta: ', v('x', 'v'), ` = 2π·r/T = 2·3·${f(r)}/24 = `, v('x', `${f(correcta)} km/h`), '.'],
      ['Todos los lugares giran con la misma velocidad angular; la rapidez lineal es mayor en el ecuador porque ahí el radio de giro es el mayor.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: con('km/h'), unidad: 'km/h', variables: VAR_LAT, enunciado,
      pregunta: ['¿Con qué ', v('x', 'rapidez lineal'), ` se mueve ${L.nombre} por la rotación de la Tierra?`], solucion, datos: { tipo: 'latitud', sub, lat: L.lat } });
  }

  return { id: 'cinematica-medias', titulo: 'El viaje en tramos', generar };
});
