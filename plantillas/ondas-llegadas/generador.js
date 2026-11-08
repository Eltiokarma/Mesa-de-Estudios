/*
 * Generador «El temblor y el trueno»: ondas que llegan en tiempos distintos, la longitud de onda
 * al cambiar de medio, la lectura de y(x, t) = A·sen(kx − ωt) y la dirección en que oscilan las
 * partículas del medio. Unidad fisica.ondas-mecanicas.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['ondas-llegadas']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   llegadas   dos ondas salen juntas del mismo foco y viajan en MRU con rapideces distintas.
 *              sub sismo    ondas P y S: con la diferencia de tiempos, la distancia al foco (km)
 *              sub sismo-tp ondas P y S: cuánto tardó la onda P en llegar (s)
 *              sub trueno   relámpago y trueno (la luz llega casi al instante): distancia en km
 *              sub riel     martillazo en un riel, el sonido por el metal y por el aire: largo (m)
 *   medio      martillazo en un riel: con el largo y la diferencia de tiempos sale la rapidez en
 *              el metal; con la frecuencia fija (la pone el martillo) sale λ en el metal (m)
 *   funcion    y = A·sen(kx ∓ ωt) en unidades del SI.
 *              sub distancia  lo que avanza la onda en un tiempo (v = ω/k)
 *              sub lambda     la longitud de onda (λ = 2π/k)
 *              sub frecuencia la frecuencia (f = ω/2π)
 *              sub sentido    sentido de propagación y rapidez (texto, armarTexto)
 *   particulas tres proposiciones sobre cómo oscilan las partículas en ondas longitudinales y
 *              transversales; la respuesta es la secuencia de V y F (armarTexto)
 *
 * Convenciones: sonido en el aire a 340 m/s; la luz llega «casi al instante» (se dice en el
 * enunciado). En y(x, t), x en m, t en s, y en m. Las fases con π se escriben «4πx».
 * Errores: ON2 y ON5 (documentados o parciales, docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md);
 * PR4, PR7, U2 y U7 (hipótesis, docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md);
 * los LL- (llegadas), ON-k-como-rapidez, ON-cociente-invertido, ON-sentido-por-signo y los demás ON- nuevos
 * son hipótesis (trampas 5 y 15 de docs/clasificacion/trampas-admision-unmsm/fisica.md y la tabla
 * «Lo que no tiene respaldo» del informe: «leer k como λ y ω como f; equivocar el sentido por el signo»).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'ondas-llegadas';
  const ONDAS = 'docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md';
  const TRANS = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const TRAMPAS = 'docs/clasificacion/trampas-admision-unmsm/fisica.md';
  const h = (id, valor, explicacion, fuente = TRAMPAS) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const tr = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: TRANS });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: ONDAS });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const limpio = (x, dec = 2) => Number.isFinite(x) && x > 0 && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && x < 1e7;
  const VA = 340;

  const TIPOS = [['llegadas', 'sismo'], ['llegadas', 'sismo'], ['llegadas', 'sismo-tp'], ['llegadas', 'trueno'], ['llegadas', 'riel'], ['llegadas', 'riel'],
    ['medio', 'lambda'], ['medio', 'lambda'], ['medio', 'lambda'],
    ['funcion', 'distancia'], ['funcion', 'distancia'], ['funcion', 'lambda'], ['funcion', 'frecuencia'], ['funcion', 'sentido'], ['funcion', 'sentido'],
    ['particulas', 'vf'], ['particulas', 'vf'], ['particulas', 'vf']];

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const [tipo, sub] = rng.elegir(TIPOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'llegadas') return llegadas(rng, semilla, sub);
    if (tipo === 'medio') return medio(rng, semilla);
    if (tipo === 'funcion') return funcion(rng, semilla, sub);
    return particulas(rng, semilla);
  }

  function cerrar(rng, semilla, o) {
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && e.valor < 1e7), rng, texto: x => `${f(x)} ${o.unidad}` });
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }
  function cerrarTexto(rng, semilla, o) {
    const alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores, rng });
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta.clave, texto: o.correcta.texto, unidad: '' }, _datos: o.datos,
    };
  }

  // ---- llegadas: dos ondas desde un mismo foco ----
  // Sismo: pares (vP, vS) en km/s con 1/vS − 1/vP = 1/K (K entero): d = K·Δt.
  const SISMOS = [[8, 4, 8], [6, 4, 12], [7.5, 5, 15], [9, 6, 18], [6, 3, 6], [8, 6, 24], [7, 3.5, 7]];
  const LUGARES = ['Arequipa', 'Tacna', 'Ica', 'Moquegua', 'Cusco', 'Huancayo', 'Juliaca'];
  const METALES = [['acero', 15], ['hierro', 15], ['aluminio', 16], ['cobre', 10], ['bronce', 10]];

  function llegadas(rng, semilla, sub) {
    if (sub === 'sismo' || sub === 'sismo-tp') {
      const [vP, vS, K] = rng.elegir(SISMOS);
      const dt = rng.entero(4, 30), d = K * dt, lugar = rng.elegir(LUGARES);
      if (d > 600) return null;
      const variables = { vP: { nombre: 'rapidez de la onda P', color: 'o' }, vS: { nombre: 'rapidez de la onda S', color: 'i' }, dt: { nombre: 'diferencia de tiempos de llegada', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
      const enunciado = [`Un sismógrafo de ${lugar} registra un temblor. La onda P (longitudinal) viaja por la roca a `, v('vP', `${f(vP)} km/s`), ' y la onda S (transversal), a ',
        v('vS', `${f(vS)} km/s`), '. Las dos salen juntas del foco, y la onda S llega ', v('dt', `${f(dt)} s`), ' después que la P.'];
      const base = [
        ['Las dos recorren la misma distancia d en MRU: la P tarda d/', v('vP', 'vP'), ' y la S, d/', v('vS', 'vS'), '.'],
        ['La diferencia de tiempos es ', v('dt', 'Δt'), ' = d/', v('vS', 'vS'), ' − d/', v('vP', 'vP'), ` = d·(1/${f(vS)} − 1/${f(vP)}) = d/${f(K)} (d en km, t en s).`],
        ['d = ', v('dt', f(dt)), ` · ${f(K)} = ${f(d)} km.`],
      ];
      if (sub === 'sismo') {
        const pregunta = ['¿A qué ', v('x', 'distancia del foco'), ' está el sismógrafo?'];
        const errores = [
          h('LL-diferencia-rapideces', dt * (vP - vS), `Multiplicaste Δt por la diferencia de rapideces, como si una onda persiguiera a la otra. Aquí no se pregunta cuándo se alcanzan: las dos recorren la misma distancia y lo que se resta son los tiempos, d/vS − d/vP = Δt.`),
          h('LL-solo-lenta', dt * vS, `Usaste solo la rapidez de la onda S, como si la P llegara al instante. La P también tarda: Δt es la diferencia d/vS − d/vP, no el tiempo de la S.`),
          h('LL-solo-rapida', dt * vP, `Usaste solo la rapidez de la onda P, como si Δt fuera su tiempo de viaje. Δt es la diferencia entre los dos tiempos: d/vS − d/vP = Δt.`),
          h('LL-suma-rapideces', dt * (vP + vS), `Sumaste las rapideces, como si las ondas fueran en sentidos opuestos a encontrarse. Las dos van del foco al sismógrafo: se restan los tiempos d/vS − d/vP.`),
        ];
        const solucion = [...base, ['El sismógrafo está a ', v('x', `${f(d)} km`), ' del foco.']];
        return cerrar(rng, semilla, { correcta: d, unidad: 'km', errores, variables, enunciado, pregunta, solucion,
          datos: { tipo: 'llegadas', sub, v1: vP, v2: vS, dt } });
      }
      const tP = d / vP, tS = d / vS;
      if (!limpio(tP)) return null;
      const pregunta = ['¿Cuánto ', v('x', 'tardó la onda P'), ' en llegar al sismógrafo?'];
      const errores = [
        h('LL-dt-como-tiempo', dt, `Tomaste la diferencia de tiempos como el tiempo de viaje de la onda P. Δt es lo que la S llega después; primero halla la distancia con d/vS − d/vP = Δt y luego tP = d/vP.`),
        h('LL-tiempo-de-la-otra', tS, `Ese es el tiempo de la onda S, la más lenta (d/vS). La onda P es la más rápida: tP = d/vP.`),
        h('LL-diferencia-rapideces', dt * (vP - vS) / vP, `Hallaste la distancia como Δt·(vP − vS), como si una onda persiguiera a la otra. Lo que se resta son los tiempos: d/vS − d/vP = Δt da d = ${f(d)} km.`),
        h('LL-solo-lenta', dt * vS / vP, `Hallaste la distancia como Δt·vS, como si la onda P llegara al instante. La P también tarda: d/vS − d/vP = Δt da d = ${f(d)} km.`),
      ];
      const solucion = [...base, ['La onda P tarda ', v('x', 't'), ` = d/vP = ${f(d)}/${f(vP)} = `, v('x', `${f(tP)} s`), '.']];
      return cerrar(rng, semilla, { correcta: tP, unidad: 's', errores, variables, enunciado, pregunta, solucion,
        datos: { tipo: 'llegadas', sub, v1: vP, v2: vS, dt } });
    }
    if (sub === 'trueno') {
      const dt = rng.elegir([2, 3, 4, 5, 6, 7.5, 8, 9, 10, 12, 15]), d = VA * dt / 1000;
      const quien = rng.elegir(['Un pastor en la puna de Puno', 'Una señora que espera la combi en Juliaca', 'Un niño en su chacra de Ayaviri']);
      const variables = { vs: { nombre: 'rapidez del sonido', color: 'i' }, dt: { nombre: 'tiempo entre el relámpago y el trueno', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
      const enunciado = [`${quien} ve un relámpago y oye el trueno `, v('dt', `${f(dt)} s`), ' después. La luz llega casi al instante y el sonido viaja por el aire a ', v('vs', `${VA} m/s`), '.'];
      const pregunta = ['¿A qué ', v('x', 'distancia'), ' cayó el rayo? (En kilómetros.)'];
      const errores = [
        h('LL-eco-ida-vuelta', d / 2, `Dividiste entre 2, como si el sonido fuera y volviera (eso pasa con un eco). El trueno viaja una sola vez, del rayo a la persona: d = v·Δt.`),
        tr('U2-km', VA * dt, `Ese número está en metros, no en kilómetros: v·Δt = ${f(VA * dt)} m. Para pasar a km se divide entre 1000.`),
        h('LL-divide-rapidez', VA / dt / 1000, `Dividiste la rapidez entre el tiempo. En MRU la distancia es rapidez por tiempo: d = v·Δt.`),
        h('LL-doble', 2 * d, `Multiplicaste por 2. La luz llega casi al instante: todo el retraso es lo que tarda el sonido en hacer el camino una vez, d = v·Δt.`),
      ];
      const solucion = [
        ['La luz llega casi al instante, así que ', v('dt', 'Δt'), ' es lo que tarda el trueno: d = ', v('vs', 'v'), '·', v('dt', 'Δt'), '.'],
        ['d = ', v('vs', `${VA}`), ' · ', v('dt', f(dt)), ` = ${f(VA * dt)} m = `, v('x', `${f(d)} km`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: d, unidad: 'km', errores, variables, enunciado, pregunta, solucion,
        datos: { tipo: 'llegadas', sub, v1: null, v2: VA, dt } });
    }
    // riel: el sonido por el metal (n veces más rápido) y por el aire
    const [metal, n] = rng.elegir(METALES), tau = rng.elegir([0.02, 0.05, 0.1, 0.2, 0.25]);
    const vm = n * VA, d = VA * n * tau, dt = (n - 1) * tau;
    if (!limpio(dt) || !limpio(d)) return null;
    const variables = { vm: { nombre: 'rapidez del sonido en el metal', color: 'o' }, va: { nombre: 'rapidez del sonido en el aire', color: 'i' }, dt: { nombre: 'diferencia de tiempos de llegada', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = [`Un obrero golpea con un martillo un extremo de un riel de ${metal}. En el otro extremo, su compañera oye dos golpes separados por `, v('dt', `${f(dt)} s`),
      ': uno llega por el metal, a ', v('vm', `${f(vm)} m/s`), ', y el otro por el aire, a ', v('va', `${VA} m/s`), '.'];
    const pregunta = ['¿Cuál es la ', v('x', 'longitud del riel'), '?'];
    const errores = [
      h('LL-diferencia-rapideces', dt * (vm - VA), `Multiplicaste Δt por la diferencia de rapideces, como si un sonido persiguiera al otro. Los dos recorren el mismo largo L: se restan los tiempos, L/va − L/vm = Δt.`),
      h('LL-solo-lenta', dt * VA, `Usaste solo la rapidez en el aire, como si el sonido por el metal llegara al instante. También tarda: Δt = L/va − L/vm.`),
      h('LL-solo-rapida', dt * vm, `Usaste solo la rapidez en el metal, como si Δt fuera su tiempo de viaje. Δt es la diferencia entre los dos tiempos: L/va − L/vm.`),
      h('LL-suma-rapideces', dt * (vm + VA), `Sumaste las rapideces, como si los sonidos fueran a encontrarse. Los dos van del martillo al oído: se restan los tiempos.`),
    ];
    const solucion = [
      ['Los dos sonidos recorren el mismo largo L: por el aire tardan L/', v('va', 'va'), ' y por el metal, L/', v('vm', 'vm'), '. El del metal llega primero.'],
      [v('dt', 'Δt'), ' = L/', v('va', `${VA}`), ' − L/', v('vm', f(vm)), ` = L·(${n} − 1)/${f(vm)} = ${n - 1}·L/${f(vm)}.`],
      [v('x', 'L'), ' = ', v('dt', f(dt)), ` · ${f(vm)}/${n - 1} = `, v('x', `${f(d)} m`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: d, unidad: 'm', errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'llegadas', sub, v1: vm, v2: VA, dt } });
  }

  // ---- medio: λ en el metal con la frecuencia fija ----
  function medio(rng, semilla) {
    const [metal, n] = rng.elegir(METALES), tau = rng.elegir([0.02, 0.05, 0.1, 0.2, 0.25]);
    const fr = rng.elegir([170, 340, 425, 680, 850, 1360, 1700]);
    const vm = n * VA, d = VA * n * tau, dt = (n - 1) * tau, ta = d / VA, tm = d / vm;
    const lm = vm / fr, la = VA / fr;
    if (!limpio(dt) || !limpio(lm) || !limpio(la) || !limpio(d)) return null;
    const conLambda = rng.moneda();
    const variables = { L: { nombre: 'largo del riel', color: 'o' }, dt: { nombre: 'diferencia de tiempos de llegada', color: 'h' }, fr: { nombre: conLambda ? 'longitud de onda en el aire' : 'frecuencia del golpe', color: 'i' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = [`Se golpea un extremo de un riel de ${metal} de `, v('L', `${f(d)} m`), '. En el otro extremo se oye el golpe dos veces: primero por el metal y ', v('dt', `${f(dt)} s`),
      ' después por el aire, donde el sonido viaja a 340 m/s. ',
      ...(conLambda ? ['En el aire, ese sonido tiene una longitud de onda de ', v('fr', `${f(la)} m`), '.'] : ['El sonido tiene una frecuencia de ', v('fr', `${f(fr)} Hz`), '.'])];
    const pregunta = ['¿Cuál es la ', v('x', 'longitud de onda de ese sonido en el metal'), '?'];
    const vSum = d / (ta + dt), vDt = d / dt;
    const errores = [
      pa('ON2-lambda-fija', la, `Dejaste la misma longitud de onda que en el aire. Al pasar a otro medio cambia la rapidez y la frecuencia se queda (la pone el martillo): como v = λ·f, si v crece, λ crece en la misma proporción.`),
      h('LL-tiempo-sumado', vSum / fr, `Sumaste Δt al tiempo del aire, como si el sonido del metal llegara después. Llega primero: tmetal = taire − Δt.`),
      h('LL-dt-como-tiempo', vDt / fr, `Tomaste Δt como el tiempo que tarda el sonido por el metal. Δt es la diferencia: tmetal = taire − Δt.`),
      tr('PR4-lambda-invertida', la * VA / vm, `Pusiste la proporción al revés: dividiste λ entre la razón de rapideces. Con la misma frecuencia, λ es directamente proporcional a v: el medio más rápido tiene la λ más larga.`),
    ];
    const solucion = [
      ['Por el aire tarda ', v('L', f(d)), ` / 340 = ${f(ta)} s. El sonido por el metal llega `, v('dt', f(dt)), ` s antes: tmetal = ${f(ta)} − ${f(dt)} = ${f(tm)} s.`],
      ['Rapidez en el metal: v = ', v('L', f(d)), ` / ${f(tm)} = ${f(vm)} m/s.`],
      conLambda ? ['La frecuencia no cambia al cambiar de medio: f = 340/', v('fr', f(la)), ` = ${f(fr)} Hz.`]
        : ['La frecuencia no cambia al cambiar de medio: sigue en ', v('fr', `${f(fr)} Hz`), '.'],
      [v('x', 'λ'), ` = v/f = ${f(vm)}/${f(fr)} = `, v('x', `${f(lm)} m`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: lm, unidad: 'm', errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'medio', sub: 'lambda', L: d, dt, va: VA, f: fr, dato: conLambda ? 'lambda' : 'f' } });
  }

  // ---- funcion: y = A·sen(kx ∓ ωt) ----
  // «4πx», «0,5x», «πx»: el coeficiente con π o sin él.
  const coef = (n, conPi, letra) => (conPi ? (n === 1 ? '' : f(n)) + 'π' : f(n)) + letra;
  function funcion(rng, semilla, sub) {
    const conPi = sub === 'sentido' ? false : rng.moneda();
    const kk = rng.elegir(conPi ? [0.5, 1, 2, 4, 5, 10] : [0.5, 1, 2, 4, 5, 10, 20]);
    const vel = rng.elegir([2, 4, 5, 8, 10, 20, 25, 40, 50, 100]);
    const ww = kk * vel, A = rng.elegir([0.01, 0.02, 0.03, 0.05, 0.1, 0.2]);
    if (!limpio(ww) || ww > 2000) return null;
    const PI = conPi ? Math.PI : 1, k = kk * PI, w = ww * PI;
    const forma = sub === 'sentido' ? rng.elegir(['kx-wt', 'kx+wt', 'wt-kx', 'wt+kx']) : rng.elegir(['kx-wt', 'kx-wt', 'wt-kx']);
    const sentido = forma === 'kx+wt' || forma === 'wt+kx' ? -1 : 1;
    const K = v('k', coef(kk, conPi, 'x')), W = v('w', coef(ww, conPi, 't'));
    const fase = forma === 'kx-wt' ? [K, ' − ', W] : forma === 'kx+wt' ? [K, ' + ', W] : forma === 'wt-kx' ? [W, ' − ', K] : [W, ' + ', K];
    const variables = { k: { nombre: 'número de onda k', color: 'o' }, w: { nombre: 'frecuencia angular ω', color: 'i' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const quien = rng.elegir(['una onda en una cuerda', 'una onda en la soga de un columpio', 'una onda en un resorte largo y estirado']);
    const enunciado = [`La ecuación de ${quien} es y = ${f(A)}·sen(`, ...fase, '), con x e y en metros y t en segundos.'];
    const comp = ['Comparando con y = A·sen(kx − ωt): ', v('k', `k = ${coef(kk, conPi, '')} rad/m`), ' y ', v('w', `ω = ${coef(ww, conPi, '')} rad/s`), '.'];

    if (sub === 'distancia') {
      const t = rng.elegir([0.5, 1.5, 2, 3, 4, 5, 0.2, 0.1]), d = vel * t;
      if (!limpio(d) || d > 1000) return null;
      const pregunta = ['¿Qué ', v('x', 'distancia avanza la onda'), ` en ${f(t)} s?`];
      const errores = [
        h('ON-k-como-rapidez', k * t, `Tomaste k como si fuera la rapidez. k es el número de onda (rad/m): dice cuántos radianes de fase hay por metro. La rapidez es v = ω/k.`, ONDAS),
        h('ON-omega-como-rapidez', w * t, `Tomaste ω como si fuera la rapidez. ω (rad/s) dice qué tan rápido oscila cada punto; la onda avanza con v = ω/k.`, ONDAS),
        h('ON-cociente-invertido', k / w * t, `Invertiste el cociente: k/ω tiene unidades de s/m, no de m/s. La rapidez es v = ω/k.`, ONDAS),
        h('ON-lambda-como-rapidez', 2 * Math.PI / k * t, `Usaste la longitud de onda (λ = 2π/k) como si fuera la rapidez. La onda avanza una λ en cada periodo: v = λ/T = ω/k.`, ONDAS),
      ];
      const solucion = [comp, ['Rapidez: v = ω/k = ', v('w', coef(ww, conPi, '')), '/', v('k', coef(kk, conPi, '')), ` = ${f(vel)} m/s.`],
        ['En MRU: d = v·t = ', `${f(vel)} · ${f(t)} = `, v('x', `${f(d)} m`), '.']];
      return cerrar(rng, semilla, { correcta: d, unidad: 'm', errores, variables, enunciado, pregunta, solucion,
        datos: { tipo: 'funcion', sub, A, k, w, forma, t } });
    }
    if (sub === 'lambda') {
      const lam = 2 * Math.PI / k;
      if (!limpio(lam)) return null;
      const pregunta = ['¿Cuál es la ', v('x', 'longitud de onda'), '?'];
      const errores = [
        h('ON-k-como-lambda', k, `Tomaste k como si fuera la longitud de onda. k cuenta radianes por metro: una longitud de onda completa es una vuelta de fase, 2π rad, así que λ = 2π/k.`, ONDAS),
        h('ON-falta-2pi', 1 / k, `Hiciste 1/k y olvidaste el 2π. Una longitud de onda es una vuelta completa de fase, 2π rad: λ = 2π/k.`, ONDAS),
        h('ON-lambda-invertida', k / (2 * Math.PI), `Invertiste el cociente: k/2π es cuántas longitudes de onda caben en un metro, no cuánto mide una. λ = 2π/k.`, ONDAS),
        h('ON-omega-por-k', 2 * Math.PI / w, `Usaste ω en lugar de k: 2π/ω es el periodo (en segundos). La longitud de onda sale del número que multiplica a x: λ = 2π/k.`, ONDAS),
      ];
      const solucion = [comp, [v('x', 'λ'), ' = 2π/k = 2π/', v('k', coef(kk, conPi, '')), ' = ', v('x', `${f(lam)} m`), '.']];
      return cerrar(rng, semilla, { correcta: lam, unidad: 'm', errores, variables, enunciado, pregunta, solucion,
        datos: { tipo: 'funcion', sub, A, k, w, forma } });
    }
    if (sub === 'frecuencia') {
      const fr = w / (2 * Math.PI);
      if (!limpio(fr)) return null;
      const pregunta = ['¿Cuál es la ', v('x', 'frecuencia'), ' de la onda?'];
      const errores = [
        tr('U7-omega-como-f', w, `Tomaste ω como la frecuencia. ω está en rad/s; para pasar a hertz (vueltas por segundo) se divide entre 2π: f = ω/2π.`),
        tr('PR7-periodo', 2 * Math.PI / w, `Ese es el periodo, T = 2π/ω (en segundos). La frecuencia es su inversa: f = 1/T = ω/2π.`),
        h('ON-falta-el-2', w / Math.PI, `Dividiste solo entre π. Una vuelta completa son 2π rad: f = ω/(2π).`, ONDAS),
        h('ON-omega-como-rapidez', w / k, `Ese cociente, ω/k, es la rapidez de la onda en m/s, no su frecuencia. f = ω/2π.`, ONDAS),
      ];
      const solucion = [comp, [v('x', 'f'), ' = ω/2π = ', v('w', coef(ww, conPi, '')), '/2π = ', v('x', `${f(fr)} Hz`), '.']];
      return cerrar(rng, semilla, { correcta: fr, unidad: 'Hz', errores, variables, enunciado, pregunta, solucion,
        datos: { tipo: 'funcion', sub, A, k, w, forma } });
    }
    // sentido: hacia dónde va y con qué rapidez
    if (Math.abs(kk / ww - vel) < 1e-9 || kk === vel || kk === ww) return null;
    const op = (s, r) => ({ clave: `sent:${s > 0 ? '+' : '-'}|${Math.round(r * 1e6)}`, texto: `hacia ${s > 0 ? '+x' : '−x'}, a ${f(r)} m/s` });
    const correcta = op(sentido, vel);
    const errSigno = 'Leíste el sentido por el signo que va entre los dos términos. Lo que importa es si kx y ωt tienen signos opuestos (va hacia +x) o iguales (va hacia −x): para seguir una cresta, si t crece, x tiene que crecer cuando los signos son opuestos.';
    const errores = [
      { id: 'ON-sentido-por-signo', ...op(-sentido, vel), explicacion: errSigno, respaldo: 'hipotesis', fuente: ONDAS },
      { id: 'ON-cociente-invertido', ...op(sentido, kk / ww), explicacion: 'Invertiste el cociente: k/ω tiene unidades de s/m. La rapidez es v = ω/k.', respaldo: 'hipotesis', fuente: ONDAS },
      { id: 'ON-k-como-rapidez', ...op(sentido, kk), explicacion: 'Tomaste k como la rapidez. k es el número de onda, en rad/m; la rapidez es v = ω/k.', respaldo: 'hipotesis', fuente: ONDAS },
      { id: 'ON-omega-como-rapidez', ...op(sentido, ww), explicacion: 'Tomaste ω como la rapidez. ω dice qué tan rápido oscila cada punto; la onda avanza con v = ω/k.', respaldo: 'hipotesis', fuente: ONDAS },
    ];
    const pregunta = ['¿En qué ', v('x', 'sentido se propaga la onda y con qué rapidez'), '?'];
    const opuestos = sentido > 0;
    const solucion = [
      ['El número que multiplica a x es ', v('k', `k = ${f(kk)} rad/m`), ' y el que multiplica a t es ', v('w', `ω = ${f(ww)} rad/s`), '.'],
      [opuestos ? 'kx y ωt tienen signos opuestos: para seguir una cresta (fase fija), si t crece, x también crece. La onda va hacia +x.'
        : 'kx y ωt tienen el mismo signo: para seguir una cresta (fase fija), si t crece, x tiene que bajar. La onda va hacia −x.'],
      ['Rapidez: v = ω/k = ', v('w', f(ww)), '/', v('k', f(kk)), ` = ${f(vel)} m/s. La onda va `, v('x', correcta.texto), '.'],
    ];
    return cerrarTexto(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'funcion', sub, A, k, w, forma } });
  }

  // ---- particulas: proposiciones V/F ----
  // Cada proposición tiene un valor de verdad y la idea errónea que la haría juzgar al revés.
  const PROPS = [
    { id: 'L1', v: true, idea: 'perp', t: 'En una onda longitudinal, las partículas del medio oscilan en la misma dirección en que se propaga la onda.',
      por: 'Eso es lo que define a una onda longitudinal: compresiones y enrarecimientos a lo largo de la dirección de avance.' },
    { id: 'L2', v: false, idea: 'perp', t: 'En una onda longitudinal, las partículas del medio oscilan perpendicularmente a la dirección de propagación.',
      por: 'En una onda longitudinal las partículas van y vienen en la misma dirección en que avanza la onda; oscilan perpendiculares solo en las transversales.' },
    { id: 'L3', v: true, idea: 'perp', t: 'En el sonido que viaja por el aire, las moléculas van y vienen en la dirección en que avanza el sonido.',
      por: 'El sonido en el aire es longitudinal: las moléculas no suben y bajan, se acercan y se alejan a lo largo de la dirección de avance.' },
    { id: 'S1', v: false, idea: 'tipo', t: 'El sonido en el aire es una onda transversal.',
      por: 'El sonido en el aire es longitudinal: hace compresiones y enrarecimientos en la dirección en que avanza.' },
    { id: 'S2', v: true, idea: 'tipo', t: 'Las ondas P de un sismo son longitudinales y las ondas S, transversales.',
      por: 'La onda P empuja y jala la roca en la dirección de avance (longitudinal); la S la sacude de costado (transversal).' },
    { id: 'S3', v: false, idea: 'tipo', t: 'En una onda transversal, las partículas oscilan en la misma dirección en que se propaga la onda.',
      por: 'En una onda transversal las partículas oscilan perpendiculares a la propagación, como un punto de la cuerda que sube y baja mientras la onda avanza a lo largo.' },
    { id: 'V1', v: false, idea: 'viaja', t: 'Las partículas del medio avanzan junto con la onda desde el foco hasta el receptor.',
      por: 'Las partículas solo oscilan alrededor de su sitio: lo que viaja del foco al receptor es la perturbación y su energía, no el medio.' },
    { id: 'V2', v: true, idea: 'viaja', t: 'Una onda mecánica transporta energía de un lugar a otro sin transportar el medio.',
      por: 'Las partículas solo oscilan alrededor de su sitio: lo que viaja es la perturbación y su energía.' },
    { id: 'V3', v: true, idea: 'viaja', t: 'Cada partícula del medio oscila alrededor de su posición de equilibrio y vuelve a ella cuando la onda termina de pasar.',
      por: 'La partícula no se va con la onda: oscila en su sitio y, cuando la onda pasa, queda donde estaba.' },
    { id: 'R1', v: false, idea: 'rapidez', t: 'En una cuerda, cada punto sube y baja con una rapidez igual a la rapidez con que avanza la onda.',
      por: 'Son dos rapideces distintas: la del punto que sube y baja depende de la mano (y cambia en cada instante); la de la onda la fija la cuerda (tensión y densidad).' },
    { id: 'R2', v: true, idea: 'rapidez', t: 'En una cuerda, la rapidez con que sube y baja un punto es distinta de la rapidez con que avanza la onda a lo largo de la cuerda.',
      por: 'La del punto que sube y baja depende de la mano (y cambia en cada instante); la de la onda la fija la cuerda (tensión y densidad).' },
  ];
  const IDEAS = {
    perp: { id: 'ON5-sube-y-baja', respaldo: 'documentado', que: 'creer que en toda onda las partículas suben y bajan, perpendiculares a la propagación' },
    tipo: { id: 'ON-confunde-tipos', respaldo: 'hipotesis', que: 'intercambiar longitudinal y transversal' },
    viaja: { id: 'ON5-se-va', respaldo: 'documentado', que: 'creer que las partículas viajan con la onda' },
    rapidez: { id: 'ON-rapidez-particula', respaldo: 'hipotesis', que: 'confundir la rapidez de un punto de la cuerda con la rapidez de la onda' },
  };
  const ROMANOS = ['I', 'II', 'III'];
  const vf = arr => arr.map(b => (b ? 'V' : 'F')).join('');
  function particulas(rng, semilla) {
    const ideas = rng.barajar(Object.keys(IDEAS)).slice(0, 3);
    const elegidas = ideas.map(i => rng.elegir(PROPS.filter(p => p.idea === i)));
    const verdad = elegidas.map(p => p.v);
    const correcta = { clave: 'vf:' + vf(verdad), texto: vf(verdad) };
    const errores = elegidas.map((p, j) => {
      const otra = verdad.slice(); otra[j] = !otra[j];
      const I = IDEAS[p.idea];
      return { id: I.id, clave: 'vf:' + vf(otra), texto: vf(otra), respaldo: I.respaldo, fuente: ONDAS,
        explicacion: `Juzgaste mal la proposición ${ROMANOS[j]}: es ${p.v ? 'verdadera' : 'falsa'}. El error de fondo es ${I.que}. ${p.por}` };
    });
    const variables = { x: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = ['Sobre el movimiento de las partículas del medio cuando pasa una onda mecánica, indica si cada proposición es verdadera (V) o falsa (F).',
      ...elegidas.map((p, j) => ` ${ROMANOS[j]}. ${p.t}`)];
    const pregunta = ['¿Cuál es la ', v('x', 'secuencia correcta'), ' (I, II, III)?'];
    const solucion = [
      ...elegidas.map((p, j) => [`${ROMANOS[j]}: ${p.v ? 'verdadera' : 'falsa'}. ${p.por}`]),
      ['Secuencia: ', v('x', correcta.texto), '.'],
    ];
    return cerrarTexto(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'particulas', sub: 'vf', props: elegidas.map(p => p.id) } });
  }

  return { id: ID, titulo: 'El temblor y el trueno', generar };
});
