/*
 * Generador G6: ecuaciones horarias θ(t) y S(t) de segundo grado (tipo C13 del mapa,
 * docs/clasificacion/compendio-movimiento-circunferencial.md, sección 4(b)).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['circular-horaria']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   omega      θ(t) = θ0 + b·t + c·t²; la velocidad angular (con signo) en un instante: b + 2c·t
 *   alfa       la aceleración angular (con signo) de θ(t): 2c; o, con S(t) y el radio, α = 2c/R
 *   parada     θ(t) con la partícula que se detiene y vuelve: el instante en que ω = 0
 *   girado     lo girado entre dos instantes, sin que se detenga en medio: θ(t2) − θ(t1)
 *   recorrido  se detiene en medio del intervalo y vuelve: el ángulo total recorrido (suma de
 *              los dos tramos sin signo) o el desplazamiento angular (con signo)
 *   acp        S(t) en un radio dado: la aceleración centrípeta en un instante, v(t)²/R
 *
 * Convenciones: θ en rad, S en m, t en s. θ y S crecen en sentido antihorario: una velocidad
 * angular negativa es un giro horario. Las respuestas con signo usan negativos: true, y todas sus
 * alternativas se escriben con signo («−4 rad/s»).
 * Errores: G2 y K4 (parcial, docs/investigacion/cinematica-ideas-erroneas.md); CI-coeficiente-como-alfa,
 * CI-posicion-por-giro y CI-neto-por-recorrido, del mapa (hipótesis); los demás, hipótesis.
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
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: CIN });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  // Decimal corto, con signo permitido (las respuestas con signo admiten cero y negativos).
  const limpio = (x, dec = 2) => Number.isFinite(x) && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && Math.abs(x) < 1e5;
  const corto = x => limpio(x) && x > 0;

  // «de» + artículo: «del punto», «de la esfera».
  const de = o => o.replace(/^el /, 'del ').replace(/^la /, 'de la ');
  const PART = [['Una partícula', 'la partícula'], ['Una esfera pequeña', 'la esfera'], ['Un punto', 'el punto']];
  const sentido = ' (θ crece en sentido antihorario).';

  function generar(semilla) {
    const rng = Azar.crear('circular-horaria|' + semilla);
    const [tipo, sub] = rng.elegir([['omega'], ['omega'], ['alfa', 'theta'], ['alfa', 's'], ['parada'], ['parada'], ['girado'], ['girado'],
      ['recorrido', 'recorrido'], ['recorrido', 'recorrido'], ['recorrido', 'neto'], ['acp'], ['acp']]);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'omega') return omega(rng, semilla);
    if (tipo === 'alfa') return alfa(rng, semilla, sub);
    if (tipo === 'parada') return parada(rng, semilla);
    if (tipo === 'girado') return girado(rng, semilla);
    if (tipo === 'recorrido') return recorrido(rng, semilla, sub);
    return centripeta(rng, semilla);
  }

  function cerrar(rng, semilla, o) {
    const ok = o.negativos ? limpio : corto;
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => ok(e.valor)), rng, texto: o.texto, negativos: !!o.negativos });
    return {
      id: `circular-horaria#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  const VAR = { th0: { nombre: 'posición angular inicial', color: 'o' }, w0: { nombre: 'velocidad angular inicial', color: 'i' }, al: { nombre: 'aceleración angular', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  // La ecuación con cada término de su color: θ0, ω0·t y (α/2)·t².
  function ecuacion(a, b, c, letra = 'θ', x = 't') {
    const seg = [`${letra} = `];
    const terms = [];
    if (a) terms.push(['th0', a, '']);
    if (b) terms.push(['w0', b, x]);
    if (c) terms.push(['al', c, x + '²']);
    terms.forEach(([k, n, s], i) => {
      const m = Math.abs(n), num = s && m === 1 ? '' : f(m);
      const signo = i === 0 ? (n < 0 ? '−' : '') : (n < 0 ? ' − ' : ' + ');
      seg.push(signo, v(k, num + s));
    });
    return seg;
  }
  const th = (a, b, c) => t => a + b * t + c * t * t;
  const par = x => (x < 0 ? `(${f(x)})` : f(x));
  
  // ---- omega: la velocidad angular en un instante ----
  function omega(rng, semilla) {
    const a = rng.entero(0, 10), b = rng.entero(-12, 12), c = rng.elegir([-4, -3, -2, -1, 1, 2, 3, 4]);
    const t = rng.entero(1, 6);
    const correcta = b + 2 * c * t;
    if (correcta === 0 || b === 0) return null;
    const [Obj, obj] = rng.elegir(PART);
    const enunciado = [`${Obj} gira en una circunferencia. Su posición angular es `, ...ecuacion(a, b, c), ', con θ en rad y t en s', sentido];
    const pregunta = ['¿Cuál es su ', v('x', 'velocidad angular'), ` en t = ${t} s? (Positiva si gira en sentido antihorario.)`];
    const T = th(a, b, c);
    const errores = [
      h('CI-coeficiente-como-alfa', b + c * t, `Tomaste el coeficiente de t² (${f(c)}) como si fuera α. Comparando con θ = θ0 + ω0·t + ½·α·t², ese coeficiente es α/2: α = ${f(2 * c)} rad/s².`),
      pa('G2-altura-entre-tiempo', T(t) / t, `Dividiste la posición angular entre el tiempo, θ(${t})/${t}. Eso no es la velocidad angular del instante: ω cambia, y es la pendiente de la gráfica θ-t en ese punto.`),
      h('CI-sin-termino-lineal', 2 * c * t, 'Olvidaste la velocidad angular inicial, el coeficiente de t: ω = ω0 + α·t.'),
      h('CI-signo-cambiado', -correcta, 'Te salió el signo cambiado. El signo de ω dice el sentido de giro: revisa los signos de ω0 y de α.'),
    ];
    const solucion = [
      ['Comparando con θ = ', v('th0', 'θ0'), ' + ', v('w0', 'ω0'), '·t + ½·', v('al', 'α'), '·t²: ', v('w0', `ω0 = ${f(b)} rad/s`), ' y ½·α = ', f(c), ', así que ', v('al', `α = ${f(2 * c)} rad/s²`), '.'],
      [v('x', 'ω'), ` = ω0 + α·t = ${f(b)} + ${par(2 * c)} · ${t} = `, v('x', `${f(correcta)} rad/s`), correcta < 0 ? ': gira en sentido horario.' : ': gira en sentido antihorario.'],
    ];
    return cerrar(rng, semilla, { negativos: true, correcta, errores, texto: x => `${f(x)} rad/s`, unidad: 'rad/s', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'omega', coef: [a, b, c], t } });
  }

  // ---- alfa: de θ(t), o de S(t) con el radio ----
  function alfa(rng, semilla, sub) {
    const a = rng.entero(0, 10), b = rng.entero(-12, 12), c = rng.elegir([-4, -3, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 3, 4]);
    if (b === 0) return null;
    const [Obj] = rng.elegir(PART);
    if (sub === 'theta') {
      const correcta = 2 * c;
      const enunciado = [`${Obj} gira en una circunferencia. Su posición angular es `, ...ecuacion(a, b, c), ', con θ en rad y t en s', sentido];
      const pregunta = ['¿Cuál es su ', v('x', 'aceleración angular'), '? (Con signo: positiva en sentido antihorario.)'];
      const errores = [
        h('CI-coeficiente-como-alfa', c, `Tomaste el coeficiente de t² como α. En θ = θ0 + ω0·t + ½·α·t², ese coeficiente es α/2: hay que multiplicarlo por 2.`),
        h('CI-lineal-como-alfa', b, 'Tomaste el coeficiente de t como α. Ese es ω0, la velocidad angular inicial; α sale del término en t².'),
        h('CI-signo-cambiado', -2 * c, `Perdiste el signo. El coeficiente de t² es ${f(c)}: α tiene ese mismo signo.`),
        h('CI-coeficiente-como-alfa', c / 2, 'Dividiste el coeficiente de t² entre 2. Es al revés: el coeficiente es α/2, así que α es el doble.'),
      ];
      const solucion = [
        ['Comparando con θ = ', v('th0', 'θ0'), ' + ', v('w0', 'ω0'), '·t + ½·', v('al', 'α'), '·t², el coeficiente de t² es α/2.'],
        [v('x', 'α'), ` = 2 · ${par(c)} = `, v('x', `${f(correcta)} rad/s²`), '.'],
      ];
      return cerrar(rng, semilla, { negativos: true, correcta, errores, texto: x => `${f(x)} rad/s²`, unidad: 'rad/s²', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'alfa', sub, coef: [a, b, c] } });
    }
    const R = rng.elegir([0.5, 2, 4, 5]);
    const correcta = 2 * c / R;
    if (!limpio(correcta)) return null;
    const enunciado = [`${Obj} recorre una circunferencia de `, `${f(R)} m de radio. La posición medida sobre la circunferencia (el arco) es `, ...ecuacion(a, b, c, 'S'),
      ', con S en m y t en s (S crece en sentido antihorario).'];
    const pregunta = ['¿Cuál es su ', v('x', 'aceleración angular'), '? (Con signo: positiva en sentido antihorario.)'];
    const errores = [
      h('CI-at-como-alfa', 2 * c, `Esa es la aceleración tangencial, en m/s². La angular es aT dividida entre el radio: α = aT/R.`),
      h('CI-coeficiente-como-alfa', c / R, 'Tomaste el coeficiente de t² como aT. En S = S0 + v0·t + ½·aT·t², ese coeficiente es aT/2.'),
      h('CI-signo-cambiado', -correcta, `Perdiste el signo. El coeficiente de t² es ${f(c)}: aT y α tienen ese signo.`),
      h('CI-por-el-radio', 2 * c * R, 'Multiplicaste por el radio. Para pasar de aT a α se divide: α = aT/R.'),
      h('CI-lineal-como-alfa', b / R, 'Usaste el coeficiente de t, que es la rapidez inicial v0. La aceleración sale del término en t².'),
    ];
    const solucion = [
      ['Comparando con S = ', v('th0', 'S0'), ' + ', v('w0', 'v0'), '·t + ½·', v('al', 'aT'), '·t², el coeficiente de t² es aT/2: ', v('al', `aT = ${f(2 * c)} m/s²`), '.'],
      [v('x', 'α'), ` = aT/R = ${f(2 * c)}/${f(R)} = `, v('x', `${f(correcta)} rad/s²`), '.'],
    ];
    return cerrar(rng, semilla, { negativos: true, correcta, errores, texto: x => `${f(x)} rad/s²`, unidad: 'rad/s²', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'alfa', sub, coef: [a, b, c], r: R } });
  }

  // ---- parada: el instante en que ω = 0 (el vértice de la parábola) ----
  function parada(rng, semilla) {
    const k = rng.elegir([1, 1, 2, 0.5]), r1 = rng.entero(1, 6), r2 = rng.entero(2, 10);
    if (r2 <= r1 + 1) return null;
    // θ = k(t − r1)(t − r2) = k·r1·r2 − k(r1 + r2)·t + k·t²: gira en sentido horario, se detiene y vuelve.
    const a = k * r1 * r2, b = -k * (r1 + r2), c = k;
    if (!limpio(a) || !limpio(b)) return null;
    const correcta = (r1 + r2) / 2;
    const [Obj, obj] = rng.elegir(PART);
    const enunciado = [`${Obj} gira en una circunferencia. Su posición angular es `, ...ecuacion(a, b, c), ', con θ en rad y t en s', sentido];
    const pregunta = [`¿En qué instante se detiene ${obj} por un momento, antes de cambiar el sentido de giro?`];
    const errores = [
      pa('G2-cero-de-theta', r1, `En t = ${r1} s la posición angular vale cero, pero ahí ${obj} sigue girando. Se detiene cuando la pendiente de θ-t es cero: ω = 0, no θ = 0.`),
      pa('G2-cero-de-theta', r2, `En t = ${r2} s la posición angular vuelve a valer cero. Lo que se anula al detenerse es ω, la pendiente de θ-t, no θ.`),
      h('CI-coeficiente-como-alfa', r1 + r2, `Tomaste el coeficiente de t² como α. Como ese coeficiente es α/2, α = ${f(2 * c)} rad/s², y t = −ω0/α.`),
      h('CI-despeje-al-reves', 2 * k / Math.abs(b), 'Despejaste al revés: de ω0 + α·t = 0 sale t = −ω0/α, no −α/ω0.'),
    ];
    const solucion = [
      ['Comparando con θ = θ0 + ω0·t + ½·α·t²: ', v('w0', `ω0 = ${f(b)} rad/s`), ' y ', v('al', `α = 2 · ${f(c)} = ${f(2 * c)} rad/s²`), `. Empieza girando en sentido horario y α va al revés: frena.`],
      ['Se detiene cuando ω = ω0 + α·t = 0: ', v('x', 't'), ` = ${f(-b)}/${f(2 * c)} = `, v('x', `${f(correcta)} s`), '. Es el vértice de la parábola θ-t.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} s`, unidad: 's', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'parada', coef: [a, b, c] } });
  }

  // ---- girado: entre dos instantes, sin detenerse en medio ----
  function girado(rng, semilla) {
    const a = rng.entero(1, 10), b = rng.entero(1, 12), c = rng.elegir([-2, -1, -0.5, 0.5, 1, 2, 3]);
    const t1 = rng.entero(1, 4), t2 = t1 + rng.entero(1, 4);
    if (c < 0 && -b / (2 * c) <= t2) return null; // no debe detenerse antes de t2
    const T = th(a, b, c), correcta = T(t2) - T(t1), dt = t2 - t1;
    if (!corto(correcta)) return null;
    const [Obj, obj] = rng.elegir(PART);
    const enunciado = [`${Obj} gira en una circunferencia. Su posición angular es `, ...ecuacion(a, b, c), ', con θ en rad y t en s', sentido];
    const pregunta = [`¿Qué ángulo gira ${obj} entre t = ${t1} s y t = ${t2} s?`];
    const errores = [
      h('CI-posicion-por-giro', T(t2), `Ese es el valor de θ en t = ${t2} s, la posición. Lo girado es la diferencia de posiciones: θ(${t2}) − θ(${t1}).`),
      pa('K4-delta-t-contra-t', T(dt) - a, `Reemplazaste la duración del intervalo (${dt} s) en la ecuación, como si empezara en t = 0. El intervalo empieza en t = ${t1} s, cuando ya gira a otra rapidez.`),
      h('CI-rectangulo-con-omega', (b + 2 * c * t1) * dt, `Multiplicaste la velocidad angular en t = ${t1} s por el tiempo, como si no cambiara. Hay aceleración angular: lo girado es θ(${t2}) − θ(${t1}).`),
      h('CI-coeficiente-como-alfa', b * dt + c / 2 * (t2 * t2 - t1 * t1), `Tomaste el coeficiente de t² como α y lo volviste a dividir entre 2. En la ecuación dada, ese coeficiente ya es α/2.`),
    ];
    const solucion = [
      ['Lo girado es la diferencia de posiciones (en ese intervalo no se detiene).'],
      [`Reemplazando t en la ecuación: θ(${t2}) = ${f(T(t2))} rad y θ(${t1}) = ${f(T(t1))} rad.`],
      [v('x', 'Δθ'), ` = ${f(T(t2))} − ${f(T(t1))} = `, v('x', `${f(correcta)} rad`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} rad`, unidad: 'rad', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'girado', coef: [a, b, c], t1, t2 } });
  }

  // ---- recorrido o neto: se detiene en medio del intervalo ----
  function recorrido(rng, semilla, sub) {
    const a = rng.entero(0, 10), c = rng.elegir([-2, -1, 1, 2]);
    const tp = rng.elegir([1, 1.5, 2, 2.5, 3, 4, 5]);
    const b = -2 * c * tp;
    if (!Number.isInteger(b) || b === 0) return null;
    const t1 = rng.elegir([0, 0, 1, 2].filter(x => x < tp)), t2 = Math.ceil(tp) + rng.entero(1, 3);
    if (t1 === undefined || t2 - tp === tp - t1) return null; // con tramos iguales el neto es 0: se evita
    const T = th(a, b, c);
    const ida = Math.abs(T(tp) - T(t1)), vuelta = Math.abs(T(t2) - T(tp)), neto = T(t2) - T(t1);
    const correcta = sub === 'recorrido' ? ida + vuelta : neto;
    if (!limpio(correcta) || !limpio(neto)) return null;
    const [Obj, obj] = rng.elegir(PART);
    const enunciado = [`${Obj} gira en una circunferencia. Su posición angular es `, ...ecuacion(a, b, c), ', con θ en rad y t en s', sentido];
    const pregunta = sub === 'recorrido'
      ? [`Entre t = ${t1} s y t = ${t2} s, ¿qué `, v('x', 'ángulo total recorre'), ` ${obj}? (Se suma lo que gira hacia un lado y hacia el otro.)`]
      : [`¿Cuál es el `, v('x', 'desplazamiento angular'), ` ${de(obj)} entre t = ${t1} s y t = ${t2} s? (Con signo: positivo en sentido antihorario.)`];
    const errores = sub === 'recorrido' ? [
      h('CI-neto-por-recorrido', Math.abs(neto), `Restaste las posiciones de los extremos${neto < 0 ? ` y tomaste el valor absoluto: θ(${t2}) − θ(${t1}) = ${f(neto)} rad` : `: θ(${t2}) − θ(${t1}) = ${f(neto)} rad`}. Eso es el desplazamiento angular. En t = ${f(tp)} s ${obj} se detiene y vuelve, así que lo recorrido es la ida más la vuelta.`),
      h('CI-posicion-por-giro', Math.abs(T(t2)), `${T(t2) < 0 ? `Tomaste el valor absoluto de θ(${t2}) = ${f(T(t2))} rad` : `Ese es θ(${t2}) = ${f(T(t2))} rad`}, la posición en t = ${t2} s, no lo recorrido. Además, ${obj} cambia de sentido en t = ${f(tp)} s: hay que sumar la ida y la vuelta.`),
      h('CI-hasta-detenerse', ida, `Contaste solo hasta que se detiene, en t = ${f(tp)} s. Después vuelve, y lo que gira de vuelta también se recorre.`),
      h('CI-hasta-detenerse', vuelta, `Contaste solo desde que se detiene, en t = ${f(tp)} s. Antes ya había girado hacia el otro lado.`),
    ] : [
      h('CI-neto-por-recorrido', ida + vuelta, `Sumaste la ida y la vuelta: eso es lo recorrido. El desplazamiento angular es la diferencia de posiciones, θ(${t2}) − θ(${t1}), con signo.`),
      h('CI-posicion-por-giro', T(t2), `Ese es el valor de θ en t = ${t2} s, la posición. El desplazamiento es la diferencia de posiciones: θ(${t2}) − θ(${t1}).`),
      h('CI-signo-cambiado', -neto, `Restaste al revés: el desplazamiento es la posición final menos la inicial, θ(${t2}) − θ(${t1}).`),
      h('CI-hasta-detenerse', T(tp) - T(t1), `Contaste solo hasta que se detiene, en t = ${f(tp)} s. Después vuelve, y eso también cambia la posición.`),
    ];
    const solucion = [
      ['ω = ', v('w0', f(b)), 2 * c < 0 ? ' − ' : ' + ', v('al', f(Math.abs(2 * c))), `·t se anula en t = ${f(tp)} s: ahí ${obj} se detiene y cambia de sentido.`],
      [`Posiciones: θ(${t1}) = ${f(T(t1))} rad, θ(${f(tp)}) = ${f(T(tp))} rad y θ(${t2}) = ${f(T(t2))} rad.`],
      sub === 'recorrido'
        ? ['Lo recorrido es la ida más la vuelta: ', v('x', `${f(ida)} + ${f(vuelta)} = ${f(correcta)} rad`), '.']
        : ['Desplazamiento angular: ', v('x', `θ(${t2}) − θ(${t1}) = ${f(T(t2))} − ${f(T(t1))} = ${f(correcta)} rad`), correcta < 0 ? ' (queda en sentido horario respecto al inicio).' : '.'],
    ];
    return cerrar(rng, semilla, { negativos: sub === 'neto', correcta, errores, texto: x => `${f(x)} rad`, unidad: 'rad', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'recorrido', sub, coef: [a, b, c], t1, t2 } });
  }

  // ---- acp: de S(t) y el radio ----
  function centripeta(rng, semilla) {
    const ciclista = rng.moneda();
    const a = rng.entero(0, 6), b = ciclista ? rng.entero(2, 6) : rng.entero(1, 3), c = ciclista ? rng.elegir([0.5, 1, 1.5]) : rng.elegir([0.25, 0.5, 1]);
    const t = rng.entero(1, 4), R = ciclista ? rng.elegir([10, 16, 20, 25, 40, 50]) : rng.elegir([1, 2, 4, 5]);
    const vt = b + 2 * c * t, correcta = vt * vt / R;
    if (!corto(correcta) || correcta > 20 || vt > (ciclista ? 14 : 6)) return null;
    const S = th(a, b, c);
    const enunciado = [ciclista ? 'Un ciclista recorre una pista circular de ' : 'Un auto de juguete recorre una pista circular de ', `${f(R)} m de radio. Su posición medida sobre la pista (el arco) es `, ...ecuacion(a, b, c, 'S'), ', con S en m y t en s.'];
    const pregunta = ['¿Cuál es su ', v('x', 'aceleración centrípeta'), ` en t = ${t} s?`];
    const errores = [
      h('CI-coeficiente-como-alfa', (b + c * t) ** 2 / R, `Tomaste el coeficiente de t² como aT. Ese coeficiente es aT/2: aT = ${f(2 * c)} m/s², y v = v0 + aT·t.`),
      h('acp-sin-cuadrado', vt / R, 'Dividiste la rapidez entre el radio sin elevarla al cuadrado: acp = v²/R.'),
      h('acp-con-omega0', b * b / R, 'Usaste la rapidez inicial, el coeficiente de t. La rapidez cambia: hay que calcularla en ese instante.'),
      pa('G2-altura-entre-tiempo', (S(t) / t) ** 2 / R, `Tomaste S(${t})/${t} como la rapidez. Eso no es la rapidez del instante: la rapidez es la pendiente de S-t, v = v0 + aT·t.`),
      h('CI-at-ac-cambiadas', 2 * c, 'Esa es la aceleración tangencial. La centrípeta depende de la rapidez: acp = v²/R.'),
    ];
    const solucion = [
      ['Comparando con S = S0 + ', v('w0', 'v0'), '·t + ½·', v('al', 'aT'), '·t²: ', v('w0', `v0 = ${f(b)} m/s`), ' y ', v('al', `aT = 2 · ${f(c)} = ${f(2 * c)} m/s²`), '.'],
      [`Rapidez en t = ${t} s: v = ${f(b)} + ${f(2 * c)} · ${t} = ${f(vt)} m/s.`],
      [v('x', 'acp'), ` = v²/R = ${f(vt)}²/${f(R)} = `, v('x', `${f(correcta)} m/s²`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} m/s²`, unidad: 'm/s²', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'acp', coef: [a, b, c], t, r: R } });
  }

  return { id: 'circular-horaria', titulo: 'De la ecuación al giro', generar };
});
