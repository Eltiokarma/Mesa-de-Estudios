/*
 * Generador G4: lo girado en el n-ésimo segundo (tipo C8 del mapa,
 * docs/clasificacion/compendio-movimiento-circunferencial.md, sección 4(b)).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['circular-enesimo-segundo']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   desde-k    parte del reposo con α constante; se da lo girado en el segundo k y se pide lo girado
 *              en el segundo m (los ángulos de segundos seguidos van como los impares 1, 3, 5…)
 *   alfa       parte del reposo; se da lo girado en el segundo k y se pide α
 *   impares    parte del reposo; cuántas veces lo del primer segundo gira en el segundo m
 *   con-omega0 ω0 y α dados; se pide lo girado en el segundo m: θ = ω0 + α(m − ½) (por segundo)
 *
 * Convenciones: el «segundo m» va de t = m − 1 a t = m. Ángulos en rad (con α en rad/s²) o en
 * vueltas (con α en vueltas/s², como en los frenados de academia); todas las respuestas son números.
 * Errores: CI-enesimo-segundo-* (hipótesis del mapa y de docs/investigacion/cinematica-ideas-erroneas.md,
 * «Lo que no tiene respaldo»); rectángulos, hipótesis del mismo informe.
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
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: CIN });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const corto = (x, dec = 2) => Number.isFinite(x) && x > 0 && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && x < 1e5;
  const ORD = ['', 'primer', 'segundo', 'tercer', 'cuarto', 'quinto', 'sexto', 'séptimo', 'octavo', 'noveno', 'décimo', 'undécimo', 'duodécimo'];
  const OBJ = [['Un disco', 'el disco'], ['Una rueda', 'la rueda'], ['Un ventilador', 'el ventilador'], ['Una polea', 'la polea'], ['Un esmeril', 'el esmeril']];
  const variables = { k: { nombre: 'lo girado en el segundo dato', color: 'o' }, al: { nombre: 'aceleración angular', color: 'i' }, w0: { nombre: 'rapidez angular inicial', color: 'h' }, m: { nombre: 'lo que se pide', color: 'd' } };

  function generar(semilla) {
    const rng = Azar.crear('circular-enesimo-segundo|' + semilla);
    const tipo = rng.elegir(['desde-k', 'desde-k', 'desde-k', 'alfa', 'impares', 'con-omega0', 'con-omega0']);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo) {
    const [Obj, obj] = rng.elegir(OBJ);
    const enVueltas = rng.moneda();
    const ang = x => (enVueltas ? `${f(x)} ${Math.abs(x - 1) < 1e-9 ? 'vuelta' : 'vueltas'}` : `${f(x)} rad`);
    const uAl = enVueltas ? 'vueltas/s²' : 'rad/s²';
    const conU = (x, u) => `${f(x)} ${Math.abs(x - 1) < 1e-9 ? u.replace('vueltas', 'vuelta') : u}`;
    const cuanto = enVueltas ? '¿Cuántas vueltas da' : '¿Qué ángulo gira';
    const gira = enVueltas ? 'da' : 'gira';
    let enunciado, pregunta, correcta, errores, solucion, texto = ang, unidad = enVueltas ? 'vueltas' : 'rad', datos;

    if (tipo === 'desde-k' || tipo === 'alfa' || tipo === 'impares') {
      const k = rng.entero(1, 6), m = rng.entero(2, 10);
      if (tipo !== 'impares' && m === k) return null;
      const al = rng.elegir([1, 2, 3, 4, 5, 6, 8, 10, 0.5, 1.5, 2.5]);    // α en rad/s² o vueltas/s²
      const thk = al * (2 * k - 1) / 2, thm = al * (2 * m - 1) / 2;
      if (!corto(thk, 1)) return null;
      enunciado = [`${Obj} parte del reposo y gira con aceleración angular constante. En el ${ORD[k]} segundo de su movimiento ${gira} `, v('k', ang(thk)), '.'];
      if (tipo === 'impares') {
        enunciado = [`${Obj} parte del reposo y gira con aceleración angular constante.`];
        if (m < 2) return null;
        pregunta = [`Lo que ${gira} en el `, v('m', `${ORD[m]} segundo`), `, ¿cuántas veces es lo que ${gira} en el primer segundo?`];
        correcta = 2 * m - 1;
        texto = x => `${f(x)} veces`; unidad = 'veces';
        errores = [
          h('CI-enesimo-segundo-razon-n', m, `Pensaste que en el segundo ${m} gira ${m} veces lo del primero. Desde el reposo, lo de cada segundo crece como los impares: 1, 3, 5, 7…`),
          h('CI-enesimo-segundo-total', m * m, `${m * m} veces es lo que gira en los primeros ${m} segundos juntos (θ crece con t²), no en el segundo ${m} solo.`),
          h('CI-enesimo-segundo-impar-corrido', 2 * m + 1, `Ese impar corresponde al segundo ${m + 1}. El segundo m va de t = m − 1 a t = m, y su impar es 2m − 1 = ${2 * m - 1}.`),
          h('CI-enesimo-segundo-cuadrados', (m - 1) * (m - 1), `${(m - 1) * (m - 1)} veces es lo que gira hasta el comienzo del segundo ${m}, en los primeros ${m - 1} segundos.`),
        ];
        solucion = [
          ['Desde el reposo, θ(t) = ½·α·t²: lo girado hasta t = 1, 2, 3… va como 1, 4, 9…'],
          [`Lo del segundo m es θ(m) − θ(m − 1) = ½·α·(m² − (m − 1)²) = ½·α·(2m − 1): los impares 1, 3, 5…`],
          [`En el ${ORD[m]} segundo: 2 · ${m} − 1 = `, v('m', texto(correcta)), ' lo del primero.'],
        ];
        datos = { tipo, m };
      } else if (tipo === 'desde-k') {
        pregunta = [`${cuanto} en el `, v('m', `${ORD[m]} segundo`), '?'];
        correcta = thm;
        errores = [
          h('CI-enesimo-segundo-razon-n', thk * m / k, `Usaste la razón ${m}/${k}, como si lo girado en cada segundo creciera como el número del segundo. Crece como los impares: 1, 3, 5…, así que la razón es (2·${m} − 1)/(2·${k} − 1).`),
          h('CI-enesimo-segundo-cuadrados', thk * m * m / (k * k), `Usaste la razón ${m}²/${k}². Esa razón vale para lo girado desde el comienzo hasta t = ${m} s y t = ${k} s, no para un segundo solo.`),
          h('CI-enesimo-segundo-total', thk * m * m / (2 * k - 1), `Ese es el ángulo de los primeros ${m} segundos juntos. Se pedía solo lo del ${ORD[m]} segundo.`),
          h('CI-enesimo-segundo-dato-como-total', thk * (2 * m - 1) / (k * k), `Tomaste el dato como lo girado en los primeros ${k} segundos. Es solo lo del ${ORD[k]} segundo, de t = ${k - 1} s a t = ${k} s.`),
        ];
        solucion = [
          ['Desde el reposo, lo girado en el segundo n es ½·α·(2n − 1): crece como los impares 1, 3, 5…'],
          [`Segundo ${k}: `, v('k', ang(thk)), ` = ½·α·${2 * k - 1}, así que `, v('al', `α = ${conU(al, uAl)}`), '.'],
          [`Segundo ${m}: ½ · ${f(al)} · ${2 * m - 1} = `, v('m', ang(correcta)), ` (o sea, ${f(thk)} · ${2 * m - 1}/${2 * k - 1}).`],
        ];
        datos = { tipo, k, m, thetaK: thk, vueltas: enVueltas };
      } else {
        pregunta = ['¿Cuál es su ', v('al', 'aceleración angular'), '?'];
        correcta = al;
        texto = x => conU(x, uAl); unidad = uAl;
        errores = [
          h('CI-enesimo-segundo-dato-como-total', 2 * thk / (k * k), `Tomaste el dato como lo girado en los primeros ${k} segundos (θ = ½·α·t²). Es solo lo del ${ORD[k]} segundo.`),
          h('CI-enesimo-segundo-razon-n', thk / k, `Dividiste lo girado entre ${k}, como si fuera ω = θ/t. Lo girado en el segundo ${k} es ½·α·(2·${k} − 1).`),
          h('CI-enesimo-segundo-impar-corrido', 2 * thk / (2 * k + 1), `Usaste el impar del segundo ${k + 1} (2·${k} + 1). El segundo ${k} va de t = ${k - 1} s a t = ${k} s: su impar es 2·${k} − 1 = ${2 * k - 1}.`),
          h('CI-sin-mitad', thk / (2 * k - 1), 'Olvidaste el ½: lo girado en el segundo n es ½·α·(2n − 1).'),
          h('CI-enesimo-segundo-como-primero', 2 * thk, `Usaste θ = ½·α, que es lo girado en el primer segundo. En el segundo ${k} gira ${2 * k - 1} veces eso.`),
        ];
        solucion = [
          ['Desde el reposo, lo girado en el segundo n es θ(n) − θ(n − 1) = ½·α·(2n − 1).'],
          [`Segundo ${k}: `, v('k', ang(thk)), ` = ½·α·${2 * k - 1}, así que `, v('al', 'α'), ` = 2 · ${f(thk)}/${2 * k - 1} = `, v('al', texto(correcta)), '.'],
        ];
        datos = { tipo, k, thetaK: thk, vueltas: enVueltas };
      }
    } else {
      // con-omega0: ω0 y α dados, lo del segundo m
      const w0 = rng.entero(1, 20), al = rng.elegir([1, 2, 3, 4, 5, 6, 8, 10]), m = rng.entero(2, 10);
      const frena = rng.elegir([false, false, true]);
      const a = frena ? -al : al;
      if (frena && w0 + a * m < 0) return null;         // sigue girando durante todo el segundo m
      const correcta0 = w0 + a * (m - 0.5);
      if (!corto(correcta0, 1)) return null;
      correcta = correcta0;
      const uW = enVueltas ? 'vueltas/s' : 'rad/s';
      enunciado = [`${Obj} gira a `, v('w0', conU(w0, uW)), ` y, desde ese instante, ${frena ? 'frena' : 'acelera'} de manera uniforme a razón de `, v('al', conU(al, uAl)), '.'];
      pregunta = [`${cuanto} en el `, v('m', `${ORD[m]} segundo`), ' contado desde ese instante?'];
      const th = t => w0 * t + a * t * t / 2;
      errores = [
        h('CI-enesimo-segundo-total', th(m), `Ese es el ángulo de los primeros ${m} segundos juntos. Se pedía solo lo del ${ORD[m]} segundo, de t = ${m - 1} s a t = ${m} s.`),
        h('rectangulo-con-omegaf', w0 + a * m, `Multiplicaste por 1 s la rapidez al final del segundo ${m}. Durante ese segundo la rapidez cambia: hay que usar la del medio del segundo, ω0 + α(${m} − ½).`),
        h('rectangulo-con-omega0', w0 + a * (m - 1), `Multiplicaste por 1 s la rapidez al comienzo del segundo ${m}. Durante ese segundo la rapidez cambia: hay que usar la del medio del segundo.`),
        h('CI-enesimo-segundo-sin-omega0', Math.abs(a) * (2 * m - 1) / 2, `Usaste la regla de los impares, que solo vale si parte del reposo. Aquí ya gira a ${w0} ${uW} al comienzo.`),
        h('CI-enesimo-segundo-impar-corrido', w0 + a * (m + 0.5), `Ese es lo girado en el segundo ${m + 1}. El segundo ${m} va de t = ${m - 1} s a t = ${m} s.`),
      ];
      solucion = [
        [`El segundo ${m} va de t = ${m - 1} s a t = ${m} s. Lo girado es θ(${m}) − θ(${m - 1}), con θ(t) = ω0·t ${frena ? '−' : '+'} ½·α·t².`],
        [`θ(${m}) − θ(${m - 1}) = ${f(th(m))} − ${f(th(m - 1))} = `, v('m', ang(correcta)), '.'],
        [`Atajo: es la rapidez a la mitad de ese segundo por 1 s, `, v('w0', 'ω0'), ` ${frena ? '−' : '+'} `, v('al', 'α'), `·(${m} − ½).`],
      ];
      datos = { tipo, w0, alfa: a, m, vueltas: enVueltas };
    }
    const alternativas = P.armar({ correcta, errores: errores.filter(e => corto(e.valor)), rng, texto });
    return {
      id: `circular-enesimo-segundo#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad }, _datos: datos,
    };
  }

  return { id: 'circular-enesimo-segundo', titulo: 'Segundo a segundo: lo que gira cada segundo', generar };
});
