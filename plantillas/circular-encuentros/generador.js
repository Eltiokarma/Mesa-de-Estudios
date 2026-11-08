/*
 * Generador G8: encuentros en una misma circunferencia (tipos C4 y C10 del mapa,
 * docs/clasificacion/compendio-movimiento-circunferencial.md, sección 4(b)).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['circular-encuentros']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   encuentro   dos móviles con rapidez angular constante, en el mismo sentido o en sentidos
 *               contrarios, separados al comienzo (o juntos); tiempo del n-ésimo encuentro
 *   vueltas     el mismo movimiento; cuántas vueltas da A hasta el n-ésimo encuentro
 *   separacion  primer instante en que la separación angular entre los dos es un ángulo dado
 *               (parten juntos, o se acercan en sentidos contrarios)
 *   salida      parten juntos de un punto P; primer instante en que vuelven a estar los dos en P
 *               (o las vueltas de A hasta ese instante): el mínimo común múltiplo de los periodos
 *   mcuv        (C10) uno o los dos con aceleración angular constante desde el reposo: el que
 *               arranca alcanza al que va constante, o uno le saca una vuelta al otro
 *
 * Convenciones:
 *   - Cada problema da las rapideces de una sola forma: múltiplos de π rad/s, periodos en s o rpm.
 *   - «Encontrarse» es estar en el mismo punto de la circunferencia (en el mismo sentido, es el alcance).
 *   - La separación inicial se mide desde A, en el sentido en que gira A, en grados.
 *   - Internamente todo va en vueltas y segundos (una vuelta = 2π rad = 360°).
 * Errores: RM4 (hipótesis, docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md) y los
 * CI-* del mapa (hipótesis).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const RM = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const corto = (x, dec = 2) => Number.isFinite(x) && x > 0 && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && x < 1e5;
  const ORD = ['', 'primera', 'segunda', 'tercera', 'cuarta', 'quinta'];
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  // Un número racional como decimal corto o como fracción p/q («5/12»).
  function fr(x) {
    if (corto(x, 2) || x === 0) return f(x);
    for (let q = 2; q <= 3600; q++) { const p = x * q; if (Math.abs(p - Math.round(p)) < 1e-9) return `${Math.round(p)}/${q}`; }
    return f(x);
  }

  // Múltiplos de π (coeficiente a de ω = aπ rad/s): una vuelta por segundo es a = 2.
  const COEF = [[1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [1, 1], [4, 3], [3, 2], [2, 1], [5, 2], [3, 1]];
  const PERIODOS = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60];
  const RPM = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30];
  const GRADOS = [30, 45, 60, 90, 120, 135, 150, 180];
  // Los coeficientes de π se guardan como fracción [p, q]; el texto lo escribe el núcleo (P.pi).
  const piDe = ([p, q], u = 'rad/s') => P.pi(p / q * Math.PI, u, q);

  function generar(semilla) {
    const rng = Azar.crear('circular-encuentros|' + semilla);
    const tipo = rng.elegir(['encuentro', 'encuentro', 'vueltas', 'separacion', 'salida', 'salida', 'mcuv']);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // Una rapidez en el modo del problema: devuelve el dato (para _datos), su texto y vueltas por segundo.
  function rapidez(rng, modo) {
    if (modo === 'pi') { const c = rng.elegir(COEF); return { dato: c, texto: `gira con rapidez angular constante de ${piDe(c)}`, corto: piDe(c), n: c[0] / c[1] / 2 }; }
    if (modo === 'periodo') { const T = rng.elegir(PERIODOS); return { dato: T, texto: `da una vuelta cada ${T} s`, corto: `T = ${T} s`, n: 1 / T }; }
    const N = rng.elegir(RPM); return { dato: N, texto: `gira a ${N} rpm`, corto: `${N} rpm`, n: N / 60 };
  }
  const pasoVps = (modo, r) => (modo === 'periodo' ? `${r.corto}, o sea 1/${r.dato} de vuelta por segundo` : `${r.corto} = ${fr(r.n)} de vuelta por segundo`);

  const variables = { A: { nombre: 'móvil A', color: 'o' }, B: { nombre: 'móvil B', color: 'i' }, s: { nombre: 'separación', color: 'h' }, t: { nombre: 'lo que se pide', color: 'd' } };

  function cerrar(rng, semilla, o) {
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => corto(e.valor)), rng, texto: o.texto });
    return {
      id: `circular-encuentros#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }
  const segundos = x => `${f(x)} s`;
  const vueltasTxt = x => `${f(x)} ${Math.abs(x - 1) < 1e-9 ? 'vuelta' : 'vueltas'}`;

  function construir(rng, semilla, tipo) {
    if (tipo === 'salida') return salida(rng, semilla);
    if (tipo === 'mcuv') return mcuv(rng, semilla);
    if (tipo === 'separacion') return separacion(rng, semilla);
    return encuentro(rng, semilla, tipo);
  }

  function sentidoTexto(mismo) {
    return mismo ? ' Los dos giran en sentido antihorario.' : ' A gira en sentido antihorario y B, en sentido horario.';
  }

  // ---- encuentro y vueltas ----
  function encuentro(rng, semilla, tipo) {
    const modo = rng.elegir(['pi', 'periodo', 'rpm']);
    const a = rapidez(rng, modo), b = rapidez(rng, modo);
    if (Math.abs(a.n - b.n) < 1e-12) return null;
    const mismo = rng.moneda();
    const deg = rng.elegir([0, ...GRADOS]), g = deg / 360;
    const n = rng.elegir([1, 1, 2, 3]);
    const rel = mismo ? Math.abs(a.n - b.n) : a.n + b.n;
    // Lo que tiene que ganar uno sobre el otro (en vueltas) para el primer encuentro.
    const brecha = deg === 0 ? 1 : (mismo && b.n > a.n ? 1 - g : g);
    const t = (brecha + n - 1) / rel;
    if (!corto(t) || t > 900) return null;
    const enunciado = ['Dos móviles, ', v('A', 'A'), ' y ', v('B', 'B'), ', recorren una misma circunferencia. ', v('A', 'A'), ` ${a.texto} y `, v('B', 'B'), ` ${b.texto}.`, sentidoTexto(mismo),
      ...(deg === 0 ? [' Parten juntos del mismo punto.'] : [' Al comienzo, B está ', v('s', `${deg}°`), ' delante de A, medidos en el sentido en que gira A.'])];
    const veces = n === 1 ? 'por primera vez' : `por ${ORD[n]} vez`;
    const errores = [];
    const conRel = r => (brecha + n - 1) / r;
    errores.push(mismo
      ? h('RM4-suma-en-alcance', conRel(a.n + b.n), 'Sumaste las rapideces, pero van en el mismo sentido: uno alcanza al otro, y lo que cuenta es lo que el rápido le gana al lento, la resta de las rapideces.', RM)
      : h('RM4-resta-en-encuentro', conRel(Math.abs(a.n - b.n)), 'Restaste las rapideces, pero van en sentidos contrarios: se acercan los dos a la vez, y las rapideces se suman.', RM));
    if (deg > 0) {
      errores.push(h('CI-brecha-otro-lado', (1 - brecha + n - 1) / rel, mismo
        ? `Usaste la separación por el otro lado de la circunferencia. ${b.n > a.n ? 'B es más rápido: es B el que alcanza a A por detrás, y le falta ' + (360 - deg) + '°.' : 'A es más rápido y está detrás de B: le falta ' + deg + '° para alcanzarlo.'}`
        : `Usaste el arco por el otro lado. A va en sentido antihorario y B viene hacia A en sentido horario: se acercan por los ${deg}° que los separan.`));
      errores.push(h('CI-sin-separacion', n / rel, 'Hiciste la cuenta como si partieran juntos. Al comienzo ya están separados, y para el primer encuentro no hace falta una vuelta entera de diferencia.'));
    }
    if (n > 1) {
      errores.push(h('CI-enesimo-por-n', n * brecha / rel, `Multiplicaste por ${n} el tiempo del primer encuentro. Después del primero, cada encuentro nuevo pide una vuelta entera de diferencia, no la separación inicial.`));
      errores.push(h('CI-enesimo-de-mas', (brecha + n) / rel, `Contaste una vuelta de más: entre el primer encuentro y el ${ORD[n].replace(/a$/, 'o')} hay ${n - 1} ${n - 1 === 1 ? 'vuelta' : 'vueltas'} de diferencia, no ${n}.`));
    }
    errores.push(h('vuelta-del-rapido', 1 / Math.max(a.n, b.n), 'Ese es el tiempo que tarda el más rápido en dar una vuelta. El encuentro depende de los dos movimientos a la vez.'));
    errores.push(h('CI-uno-quieto', (brecha + n - 1) / Math.max(a.n, b.n), 'Hiciste la cuenta como si solo se moviera el más rápido y el otro estuviera quieto.'));
    const solucion = [
      ['En vueltas por segundo: ', v('A', pasoVps(modo, a)), ' y ', v('B', pasoVps(modo, b)), '.'],
      [mismo ? 'Van en el mismo sentido: el más rápido gana, cada segundo, la diferencia de rapideces: ' : 'Van en sentidos contrarios: se acercan, cada segundo, la suma de las rapideces: ',
        `${fr(Math.max(a.n, b.n))} ${mismo ? '−' : '+'} ${fr(Math.min(a.n, b.n))} = ${fr(rel)} de vuelta por segundo.`],
      [deg === 0 ? 'Parten juntos: para el primer encuentro hace falta una vuelta entera de diferencia'
        : mismo ? `Para el primer encuentro, ${a.n > b.n ? 'A tiene que ganar los ' + deg + '° que lo separan de B' : 'B, que es más rápido, tiene que ganar los ' + (360 - deg) + '° que le faltan para alcanzar a A por detrás'}`
        : `Para el primer encuentro, entre los dos tienen que cubrir los ${deg}° que los separan`,
        ` (${fr(brecha)} de vuelta)${n > 1 ? `; luego, una vuelta entera más por cada encuentro: ${fr(brecha)} + ${n - 1} = ${fr(brecha + n - 1)} vueltas` : ''}.`],
      ['Tiempo: ', v('t', 't'), ` = ${fr(brecha + n - 1)} ÷ ${fr(rel)} = `, v('t', segundos(t)), '.'],
    ];
    if (tipo === 'encuentro') {
      return cerrar(rng, semilla, { correcta: t, errores, texto: segundos, unidad: 's', enunciado, pregunta: [`¿Al cabo de cuánto tiempo se encuentran ${veces}?`], solucion,
        datos: { tipo, modo, A: a.dato, B: b.dato, mismo, grados: deg, n } });
    }
    // vueltas de A hasta ese encuentro
    const vA = a.n * t;
    if (!corto(vA)) return null;
    const errV = [
      h('CI-vueltas-del-otro', b.n * t, 'Esas son las vueltas de B. A gira a otra rapidez: sus vueltas son su rapidez por el tiempo del encuentro.'),
      h('CI-una-vuelta-por-encuentro', n, 'Contaste una vuelta por encuentro. Las vueltas de A dependen de su rapidez y del tiempo que tardan en encontrarse.'),
      ...errores.filter(e => e.id !== 'vuelta-del-rapido' && e.id !== 'CI-uno-quieto').map(e => ({ ...e, valor: a.n * e.valor, explicacion: e.explicacion + ' Con ese tiempo, las vueltas de A salen mal.' })),
      h('CI-vueltas-diferencia', brecha + n - 1, 'Esa es la ventaja que uno le saca al otro (o lo que cubren entre los dos), no las vueltas que da A.'),
    ];
    solucion.push(['Vueltas de A: su rapidez por el tiempo, ', v('A', fr(a.n)), ` · ${f(t)} = `, v('t', vueltasTxt(vA)), '.']);
    return cerrar(rng, semilla, { correcta: vA, errores: errV, texto: vueltasTxt, unidad: 'vueltas', enunciado, pregunta: [`¿Cuántas vueltas da A hasta que se encuentran ${veces}?`], solucion,
      datos: { tipo, modo, A: a.dato, B: b.dato, mismo, grados: deg, n } });
  }

  // ---- separacion ----
  function separacion(rng, semilla) {
    const modo = rng.elegir(['pi', 'periodo', 'rpm']);
    const a = rapidez(rng, modo), b = rapidez(rng, modo);
    if (Math.abs(a.n - b.n) < 1e-12) return null;
    const juntos = rng.moneda();
    const mismo = juntos ? rng.moneda() : false;
    const phi = rng.elegir([30, 45, 60, 90, 120]);
    const deg = juntos ? 0 : rng.elegir(GRADOS.filter(x => x > phi && x <= 180));
    if (!juntos && !deg) return null;
    const rel = mismo ? Math.abs(a.n - b.n) : a.n + b.n;
    const p = phi / 360, g = deg / 360;
    const t = juntos ? p / rel : (g - p) / rel;
    if (!corto(t) || t > 900) return null;
    const enunciado = ['Dos móviles, ', v('A', 'A'), ' y ', v('B', 'B'), ', recorren una misma circunferencia. ', v('A', 'A'), ` ${a.texto} y `, v('B', 'B'), ` ${b.texto}.`, sentidoTexto(mismo),
      ...(juntos ? [' Parten juntos del mismo punto.'] : [' Al comienzo, B está ', v('s', `${deg}°`), ' delante de A, medidos en el sentido en que gira A, así que se acercan.'])];
    const pregunta = ['¿Al cabo de cuánto tiempo la separación angular entre los dos es ', v('s', `${phi}°`), ' por primera vez?'];
    const errores = [
      h('CI-separacion-despues', juntos ? (1 - p) / rel : (g + p) / rel, juntos
        ? `Ese es el segundo instante con ${phi}° de separación: cuando ya se separaron ${360 - phi}° y se acercan por el otro lado. El primero llega antes.`
        : `Ese es el instante en que vuelven a estar a ${phi}°, pero después de cruzarse. Antes de cruzarse, la separación pasa por ${phi}° primero.`),
      mismo
        ? h('RM4-suma-en-alcance', (juntos ? p : g - p) / (a.n + b.n), 'Sumaste las rapideces, pero van en el mismo sentido: la separación crece con la diferencia de rapideces.', RM)
        : h('RM4-resta-en-encuentro', (juntos ? p : g - p) / Math.abs(a.n - b.n), 'Restaste las rapideces, pero van en sentidos contrarios: la separación cambia con la suma de las rapideces.', RM),
      h('CI-uno-quieto', (juntos ? p : g - p) / Math.max(a.n, b.n), 'Hiciste la cuenta como si solo se moviera el más rápido y el otro estuviera quieto.'),
    ];
    if (!juntos) errores.push(h('CI-tiempo-del-encuentro', g / rel, `Ese es el instante en que se encuentran. La separación de ${phi}° llega antes, cuando todavía les faltan ${phi}° para cruzarse.`));
    errores.push(h('vuelta-del-rapido', 1 / Math.max(a.n, b.n), 'Ese es el tiempo que tarda el más rápido en dar una vuelta.'));
    const solucion = [
      ['En vueltas por segundo: ', v('A', pasoVps(modo, a)), ' y ', v('B', pasoVps(modo, b)), '.'],
      [mismo ? `Van en el mismo sentido: la separación crece con la diferencia de rapideces, ${fr(rel)} de vuelta por segundo.` : `Van en sentidos contrarios: la separación cambia con la suma de las rapideces, ${fr(rel)} de vuelta por segundo.`],
      [juntos ? `Parten juntos: la separación llega a ${phi}° (${fr(p)} de vuelta) cuando ` : `Al comienzo están a ${deg}° y se acercan; la separación es ${phi}° cuando han cubierto entre los dos ${deg}° − ${phi}° = ${deg - phi}° (${fr(g - p)} de vuelta), o sea cuando `,
        v('t', 't'), ` = ${fr(juntos ? p : g - p)} ÷ ${fr(rel)} = `, v('t', segundos(t)), '.'],
    ];
    return cerrar(rng, semilla, { correcta: t, errores, texto: segundos, unidad: 's', enunciado, pregunta, solucion,
      datos: { tipo: 'separacion', modo, A: a.dato, B: b.dato, mismo, grados: deg, phi } });
  }

  // ---- salida: vuelven a coincidir en el punto de partida ----
  function salida(rng, semilla) {
    const modo = rng.elegir(['periodo', 'periodo', 'rpm', 'pi']);
    let TA, TB, datoA, datoB, txtA, txtB;
    if (modo === 'periodo') { TA = rng.elegir(PERIODOS.slice(0, 14)); TB = rng.elegir(PERIODOS.slice(0, 14)); datoA = TA; datoB = TB; txtA = `da una vuelta cada ${TA} s`; txtB = `da una vuelta cada ${TB} s`; }
    else if (modo === 'rpm') { const NA = rng.elegir([2, 3, 4, 5, 6, 10, 12, 15, 20, 30]), NB = rng.elegir([2, 3, 4, 5, 6, 10, 12, 15, 20, 30]); TA = 60 / NA; TB = 60 / NB; datoA = NA; datoB = NB; txtA = `gira a ${NA} rpm`; txtB = `gira a ${NB} rpm`; }
    else { TA = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12]); TB = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12]); const cA = [2 / gcd(2, TA), TA / gcd(2, TA)], cB = [2 / gcd(2, TB), TB / gcd(2, TB)]; datoA = cA; datoB = cB; txtA = `gira con rapidez angular constante de ${piDe(cA)}`; txtB = `gira con rapidez angular constante de ${piDe(cB)}`; }
    if (TA === TB || !Number.isInteger(TA) || !Number.isInteger(TB)) return null;
    const L = TA * TB / gcd(TA, TB);
    if (L === Math.max(TA, TB) || L > 600) return null;
    const mismo = rng.moneda();
    const pideVueltas = rng.elegir([false, false, true]);
    const enunciado = ['Dos móviles, ', v('A', 'A'), ' y ', v('B', 'B'), ', parten juntos de un punto P de una misma circunferencia. ', v('A', 'A'), ` ${txtA} y `, v('B', 'B'), ` ${txtB}.`, sentidoTexto(mismo)];
    const pregunta = pideVueltas ? ['¿Cuántas vueltas habrá dado A cuando los dos vuelvan a estar juntos en P por primera vez?'] : ['¿Al cabo de cuánto tiempo vuelven a estar juntos en P por primera vez?'];
    const tPrimer = mismo ? TA * TB / Math.abs(TA - TB) : TA * TB / (TA + TB);
    const errT = [
      h('CI-primer-encuentro-vs-salida', tPrimer, `Ese es el tiempo del primer encuentro, que puede ser en cualquier punto de la circunferencia. Para estar juntos en P, cada uno tiene que haber dado un número entero de vueltas.`),
      h('CI-producto-periodos', TA * TB, `Multiplicaste los periodos. Los dos están en P a la vez en un múltiplo común de ${TA} s y de ${TB} s, y el primero es el mínimo común múltiplo, que puede ser menor que el producto.`),
      h('CI-periodo-del-lento', Math.max(TA, TB), 'Ese es el periodo del más lento: en ese instante él está en P, pero el otro no.'),
      h('CI-suma-periodos', TA + TB, 'Sumaste los periodos. Los dos están en P a la vez en un múltiplo común de los dos periodos.'),
    ];
    const pasoT = modo === 'periodo' ? ['Cada uno pasa por P al final de cada vuelta: A cada ', v('A', `${TA} s`), ' y B cada ', v('B', `${TB} s`), '.']
      : ['Periodos (lo que tarda cada uno en dar una vuelta): ', v('A', `TA = ${modo === 'rpm' ? `60/${datoA}` : `2π/(${piDe(datoA, '')})`} = ${TA} s`), ' y ', v('B', `TB = ${modo === 'rpm' ? `60/${datoB}` : `2π/(${piDe(datoB, '')})`} = ${TB} s`), '.'];
    const solucion = [pasoT,
      ['Están juntos en P cuando el tiempo es múltiplo de los dos periodos. El sentido de giro no importa. El primero es el mínimo común múltiplo: ', v('t', `mcm(${TA}; ${TB}) = ${L} s`), '.']];
    if (!pideVueltas) {
      return cerrar(rng, semilla, { correcta: L, errores: errT, texto: segundos, unidad: 's', enunciado, pregunta, solucion,
        datos: { tipo: 'salida', modo, A: datoA, B: datoB, mismo, pide: 'tiempo' } });
    }
    const vA = L / TA;
    solucion.push(['En ese tiempo, A da ', `${L}/${TA} = `, v('t', vueltasTxt(vA)), '.']);
    const errV = [
      h('CI-vueltas-del-otro', L / TB, 'Esas son las vueltas de B. A tiene otro periodo.'),
      ...errT.map(e => ({ ...e, valor: e.valor / TA, explicacion: e.explicacion + ' Con ese tiempo, las vueltas de A salen mal.' })),
    ];
    return cerrar(rng, semilla, { correcta: vA, errores: errV, texto: vueltasTxt, unidad: 'vueltas', enunciado, pregunta, solucion,
      datos: { tipo: 'salida', modo, A: datoA, B: datoB, mismo, pide: 'vueltas' } });
  }

  // ---- mcuv (C10): con aceleración angular desde el reposo ----
  // Coeficientes de α = cπ rad/s² con 4/c cuadrado perfecto: una vuelta (2π) de ventaja en t = √(4/c) s.
  const ALFAS = [[4, 1], [1, 1], [4, 9], [1, 4], [4, 25], [1, 9], [1, 16]];
  const val = ([p, q]) => p / q;
  function fraccion(x) {
    for (let q = 1; q <= 144; q++) { const p = x * q; if (Math.abs(p - Math.round(p)) < 1e-9) return [Math.round(p), q]; }
    return null;
  }
  function mcuv(rng, semilla) {
    const sub = rng.elegir(['alcance', 'alcance', 'ventaja', 'ventaja', 'contrario', 'contrario', 'contrario']);
    const enunciado = ['Dos móviles, ', v('A', 'A'), ' y ', v('B', 'B'), ', recorren una misma circunferencia. '];
    let correcta, errores, solucion, pregunta, datos;
    if (sub === 'alcance') {
      // A va con ω constante; B parte del reposo desde el mismo punto, justo cuando A pasa, con α.
      const w = rng.elegir(COEF), al = rng.elegir(ALFAS.concat([[1, 2], [2, 1], [3, 1], [1, 3]]));
      const W = val(w) * Math.PI, A = val(al) * Math.PI;
      correcta = 2 * W / A;
      // A no debe sacarle una vuelta entera a B antes de que B lo alcance: la ventaja máxima es W²/(2A) < 2π.
      if (W * W / (2 * A) >= 2 * Math.PI - 1e-9 || !corto(correcta) || correcta > 60) return null;
      enunciado.push(v('A', 'A'), ` gira con rapidez angular constante de ${piDe(w)}. Justo cuando A pasa por un punto P, `, v('B', 'B'), ` parte del reposo desde P, en el mismo sentido, con aceleración angular constante de ${piDe(al, 'rad/s²')}.`);
      pregunta = ['¿Al cabo de cuánto tiempo B alcanza a A?'];
      errores = [
        h('CI-misma-rapidez-encuentro', W / A, 'En ese instante B llega a la rapidez de A, pero todavía está detrás: hasta ahí A se le adelantó. B lo alcanza recién cuando los dos han girado el mismo ángulo.'),
        h('vuelta-del-rapido', 2 * Math.PI / W, 'Ese es el tiempo que A tarda en dar una vuelta. B lo alcanza cuando los dos han girado el mismo ángulo, no cuando A vuelve a P.'),
        h('CI-mitad-de-mas', 4 * W / A, 'Pusiste el ½ al otro lado: de ω·t = ½·α·t² sale t = 2ω/α.'),
        h('CI-vuelta-del-acelerado', Math.sqrt(4 * Math.PI / A), 'Ese es el tiempo que tarda B en dar una vuelta entera. B alcanza a A antes, cuando los dos han girado el mismo ángulo.'),
      ];
      solucion = [
        ['Desde P, A gira ', v('A', 'θA = ω·t'), ' y B gira ', v('B', 'θB = ½·α·t²'), '. B alcanza a A cuando han girado lo mismo.'],
        ['ω·t = ½·α·t² da ', v('t', 't = 2ω/α'), ` = 2 · (${piDe(w, '')}) ÷ (${piDe(al, '')}) = `, v('t', segundos(correcta)), '.'],
        [`Antes de eso, A nunca le saca una vuelta entera a B: la mayor ventaja de A es ω²/(2α) = ${fr(W * W / (2 * A) / (2 * Math.PI))} de vuelta.`],
      ];
      datos = { tipo: 'mcuv', sub, w, alfaB: al };
    } else {
      // Se elige el tiempo y la otra aceleración; la de A sale de la suma o la diferencia pedida.
      const mismo = sub === 'ventaja';
      const tt = rng.entero(1, 6), rel = 4 / (tt * tt);
      const aB = rng.elegir([[1, 1], [1, 2], [1, 3], [1, 4], [1, 8], [1, 9], [2, 9], [1, 16], [3, 16], [1, 36], [5, 36], [3, 4], [2, 1]]);
      const cB = val(aB), cA = mismo ? rel + cB : rel - cB;
      if (!(cA > 0) || Math.abs(cA - cB) < 1e-12) return null;
      const aA = fraccion(cA);
      if (!aA) return null;
      correcta = tt;
      enunciado.push('Los dos parten del reposo desde el mismo punto y al mismo tiempo, ', mismo ? 'en el mismo sentido' : 'en sentidos contrarios', ', con aceleraciones angulares constantes: ',
        v('A', `A, ${piDe(aA, 'rad/s²')}`), ' y ', v('B', `B, ${piDe(aB, 'rad/s²')}`), '.');
      pregunta = [mismo ? '¿Al cabo de cuánto tiempo A le saca una vuelta de ventaja a B?' : '¿Al cabo de cuánto tiempo se encuentran por primera vez?'];
      errores = [
        mismo
          ? h('RM4-suma-en-alcance', Math.sqrt(4 / (cA + cB)), 'Sumaste las aceleraciones, pero van en el mismo sentido: la ventaja crece con la diferencia, αA − αB.', RM)
          : h('RM4-resta-en-encuentro', cA !== cB ? Math.sqrt(4 / Math.abs(cA - cB)) : NaN, 'Restaste las aceleraciones, pero van en sentidos contrarios: entre los dos cubren la vuelta, y las aceleraciones se suman.', RM),
        h('vuelta-del-rapido', Math.sqrt(4 / Math.max(cA, cB)), `Ese es el tiempo que tarda ${cA > cB ? 'A' : 'B'} en dar una vuelta entera solo. ${mismo ? 'Hace falta que le saque una vuelta al otro, que también avanza.' : 'Los dos se mueven a la vez, en sentidos contrarios.'}`),
        h('CI-sin-raiz', 4 / rel, 'Te olvidaste de sacar la raíz cuadrada: el tiempo aparece al cuadrado en θ = ½·α·t².'),
        h('CI-alfa-como-rapidez', 2 / rel, 'Usaste θ = α·t, como si la aceleración angular fuera una rapidez. Desde el reposo, θ = ½·α·t².'),
        ...(mismo ? [h('CI-vuelta-del-lento', Math.sqrt(4 / Math.min(cA, cB)), 'Ese es el tiempo que tarda B en dar una vuelta entera. A le saca una vuelta de ventaja cuando la diferencia de lo girado llega a 2π rad.')] : []),
      ];
      solucion = [
        [mismo ? 'Van en el mismo sentido: la ventaja de A es ' : 'Van en sentidos contrarios: lo que cubren entre los dos es ', v('t', `½·(${mismo ? 'αA − αB' : 'αA + αB'})·t²`), `, con ${mismo ? 'αA − αB' : 'αA + αB'} = ${piDe(fraccion(rel), 'rad/s²')}.`],
        [mismo ? 'Una vuelta de ventaja son 2π rad: ' : 'Se encuentran cuando cubren una vuelta, 2π rad: ', `½ · ${piDe(fraccion(rel), '')} · t² = 2π, así que t² = ${f(4 / rel)} y `, v('t', `t = ${segundos(correcta)}`), '.'],
      ];
      datos = { tipo: 'mcuv', sub, alfaA: aA, alfaB: aB };
    }
    return cerrar(rng, semilla, { correcta, errores, texto: segundos, unidad: 's', enunciado, pregunta, solucion, datos });
  }

  return { id: 'circular-encuentros', titulo: 'Dos móviles en la misma circunferencia', generar };
});
