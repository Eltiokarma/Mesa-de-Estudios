/*
 * Generador G3: MCUV con tres datos, «el análogo lineal» (tipo C8 del mapa,
 * docs/clasificacion/compendio-movimiento-circunferencial.md, sección 4(b)).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['circular-mcuv']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   angulo    ω al comienzo y al final de un intervalo (que puede no empezar en t = 0); se pide el
 *             ángulo girado (rad) o las vueltas. A veces se da el radio, que no hace falta.
 *   frenado   ω0 y la desaceleración; se pide lo girado en un tiempo mayor que el que tarda en
 *             detenerse (la rueda no retrocede: queda quieta).
 *   tiempo    ω0, ωf y lo girado (rad o vueltas); se pide el tiempo. Incluye «frena hasta detenerse».
 *   alfa      ω en dos instantes (intervalo desplazado) o ω0, ωf y θ; se pide el módulo de α.
 *   tramos    parte del reposo, acelera, sigue constante y frena hasta detenerse; se pide lo girado.
 *
 * Modos de unidades (cada problema usa uno):
 *   rad   ω en rad/s, θ en rad, α en rad/s² (números enteros o decimales cortos)
 *   rpm   ω en rpm, θ en vueltas, t en s
 *   pi    ω en múltiplos de π rad/s (α en múltiplos de π rad/s²), θ en vueltas
 * Las respuestas son números sin π (rad, vueltas, s o rad/s²), así que todas las alternativas son números.
 * Errores: K4 y G4 (parcial, docs/investigacion/cinematica-ideas-erroneas.md); los rectángulos y
 * seguir la ecuación tras detenerse, hipótesis de ese mismo informe; los CI-* del mapa, hipótesis.
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
  const corto = (x, dec = 2) => Number.isFinite(x) && x > 0 && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && x < 1e5;
  const OBJ = [['Un disco', 'el disco'], ['Una rueda', 'la rueda'], ['Un ventilador', 'el ventilador'], ['Una polea', 'la polea'], ['Un esmeril', 'el esmeril']];
  const vueltasTxt = x => `${f(x)} ${Math.abs(x - 1) < 1e-9 ? 'vuelta' : 'vueltas'}`;
  const vps = x => `${f(x)} ${Math.abs(x - 1) < 1e-9 ? 'vuelta' : 'vueltas'}/s`;

  // Cómo se escribe una rapidez angular dada en el modo del problema.
  const W = (modo, x) => (modo === 'rad' ? `${f(x)} rad/s` : modo === 'rpm' ? `${f(x)} rpm` : `${P.pi(x * Math.PI)} rad/s`);
  // Lo girado, en las unidades en que se pregunta: rad en el modo rad, vueltas en los otros.
  const TH = (modo, x) => (modo === 'rad' ? `${f(x)} rad` : vueltasTxt(x));
  // Una rapidez angular del modo, pasada a «unidades de ángulo por segundo» del modo
  // (rad/s en rad; vueltas/s en rpm y en pi).
  const porSeg = (modo, x) => (modo === 'rad' ? x : modo === 'rpm' ? x / 60 : x / 2);

  function generar(semilla) {
    const rng = Azar.crear('circular-mcuv|' + semilla);
    const tipo = rng.elegir(['angulo', 'angulo', 'frenado', 'tiempo', 'tiempo', 'alfa', 'alfa', 'tramos']);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function rapidezModo(rng, modo, min = 0) {
    if (modo === 'rad') return rng.entero(min, 30);
    if (modo === 'rpm') return 60 * rng.entero(min, 20);
    return rng.entero(min, 12);
  }

  function construir(rng, semilla, tipo) {
    const [Obj, obj] = rng.elegir(OBJ);
    if (tipo === 'angulo') return angulo(rng, semilla, Obj, obj);
    if (tipo === 'frenado') return frenado(rng, semilla, Obj, obj);
    if (tipo === 'tiempo') return tiempo(rng, semilla, Obj, obj);
    if (tipo === 'alfa') return alfa(rng, semilla, Obj, obj);
    return tramos(rng, semilla, Obj, obj);
  }

  function cerrar(rng, semilla, o) {
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => corto(e.valor)), rng, texto: o.texto });
    return {
      id: `circular-mcuv#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  // ---- angulo: ω1 en t1 y ω2 en t2; lo girado entre los dos instantes ----
  function angulo(rng, semilla, Obj, obj) {
    const modo = rng.elegir(['rad', 'rad', 'rpm', 'pi']);
    const w1 = rapidezModo(rng, modo), w2 = rapidezModo(rng, modo, 1);
    if (w1 === w2) return null;
    const t1 = rng.elegir([0, 0, 0, 1, 2, 3, 4, 5]), dt = rng.entero(2, 12), t2 = t1 + dt;
    const R = modo === 'rad' && rng.moneda() && obj !== 'el ventilador' && obj !== 'el esmeril' ? rng.elegir([0.5, 2, 3, 4]) : null;
    const p1 = porSeg(modo, w1), p2 = porSeg(modo, w2);
    const correcta = (p1 + p2) / 2 * dt;
    if (!corto(correcta, 1)) return null;
    const acelera = w2 > w1;
    const variables = { w0: { nombre: 'rapidez angular inicial', color: 'o' }, wf: { nombre: 'rapidez angular final', color: 'i' }, t: { nombre: 'tiempo', color: 'h' }, th: { nombre: 'ángulo girado', color: 'd' } };
    const conR = R ? `, de ${f(R)} m de radio,` : '';
    let enunciado;
    if (t1 === 0) {
      enunciado = w1 === 0
        ? [`${Obj}${conR} parte del reposo y acelera de manera uniforme. `, v('t', `${dt} s`), ' después gira a ', v('wf', W(modo, w2)), '.']
        : [`${Obj}${conR} gira a `, v('w0', W(modo, w1)), ` y ${acelera ? 'acelera' : 'frena'} de manera uniforme. `, v('t', `${dt} s`), ' después gira a ', v('wf', W(modo, w2)), '.'];
    } else {
      enunciado = [`${Obj}${conR} gira con aceleración angular constante. En el instante t = ${t1} s su rapidez angular es `, v('w0', W(modo, w1)), `, y en t = ${t2} s es `, v('wf', W(modo, w2)), '.'];
    }
    const cuanto = modo === 'rad' ? '¿Qué ángulo gira' : '¿Cuántas vueltas da';
    const pregunta = [t1 === 0 ? `${cuanto} ${obj} en esos ` : `${cuanto} ${obj} entre t = ${t1} s y t = ${t2} s?`, ...(t1 === 0 ? [v('t', `${dt} s`), '?'] : [])];
    const errores = [];
    if (modo === 'rpm') errores.push(h('CI-rpm-sin-60', (w1 + w2) / 2 * dt, 'Usaste las rpm como si fueran vueltas por segundo. Una rpm es una vuelta por minuto: hay que dividir entre 60.'));
    if (modo === 'pi') errores.push(h('vueltas-sin-2pi', (w1 + w2) / 2 * dt, 'Calculaste bien el ángulo en múltiplos de π, pero tomaste π rad como una vuelta. Una vuelta son 2π rad: hay que dividir entre 2π.'));
    if (t1 > 0) errores.push(pa('K4-delta-t-contra-t', (p1 + p2) / 2 * t2, `Usaste el instante final, t = ${t2} s, como si fuera el tiempo transcurrido. El intervalo dura ${t2} − ${t1} = ${dt} s.`));
    if (w1 > 0) errores.push(h('rectangulo-con-omega0', p1 * dt, 'Multiplicaste la rapidez inicial por el tiempo, como si no acelerara. Con α constante, lo girado es la rapidez media por el tiempo: el área del trapecio bajo la gráfica ω-t.', CIN));
    errores.push(h('rectangulo-con-omegaf', p2 * dt, 'Multiplicaste la rapidez final por el tiempo, como si hubiera girado así desde el comienzo. Lo girado es la rapidez media por el tiempo.', CIN));
    if (R) errores.push(h('CI-dato-que-sobra', correcta * R, `El radio no hacía falta: al multiplicar por ${f(R)} m obtuviste el arco que recorre un punto del borde, no el ángulo.`));
    errores.push(pa('G4-pendiente-en-vez-de-area', Math.abs(p2 - p1) / dt, 'Dividiste el cambio de rapidez entre el tiempo: eso es la aceleración angular, la pendiente de la gráfica ω-t. Lo girado es el área bajo la gráfica.'));
    errores.push(h('CI-resta-en-vez-de-suma', Math.abs(p2 - p1) / 2 * dt, 'Restaste las rapideces en vez de sumarlas. La rapidez media es (ω0 + ωf)/2.'));
    const u = modo === 'rad' ? 'rad' : 'vueltas';
    const solucion = [];
    if (modo === 'rpm') solucion.push([`Se pasa a vueltas por segundo: `, v('w0', W(modo, w1)), ` = ${vps(p1)} y `, v('wf', W(modo, w2)), ` = ${vps(p2)}.`]);
    if (modo === 'pi') solucion.push(['Como una vuelta son 2π rad, ', v('w0', W(modo, w1)), ` = ${vps(p1)} y `, v('wf', W(modo, w2)), ` = ${vps(p2)}.`]);
    if (t1 > 0) solucion.push([`El intervalo dura `, v('t', `Δt = ${t2} − ${t1} = ${dt} s`), '.']);
    if (R) solucion.push(['El radio no hace falta: se pide un ángulo, no un arco.']);
    solucion.push(['Con α constante, ω cambia en línea recta y lo girado es la rapidez media por el tiempo (el área del trapecio bajo ω-t): ',
      v('th', 'θ'), ` = (${f(p1)} + ${f(p2)})/2 · ${dt} = `, v('th', TH(modo, correcta)), '.']);
    return cerrar(rng, semilla, { correcta, errores, texto: x => TH(modo, x), unidad: u, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'angulo', modo, w1, w2, t1, t2, R } });
  }

  // ---- frenado: se detiene antes de que acabe el tiempo dado ----
  function frenado(rng, semilla, Obj, obj) {
    const modo = rng.elegir(['rad', 'pi']);
    const al = modo === 'rad' ? rng.entero(1, 6) : rng.elegir([1, 2]);   // en rad/s² o en π rad/s²
    const ts = rng.entero(3, 10), w0 = al * ts, t = ts + rng.entero(2, 8);
    const pS = porSeg(modo, w0), aS = porSeg(modo, al);
    const correcta = pS * ts / 2;
    if (!corto(correcta, 1)) return null;
    const sinFrenar = pS * t - aS * t * t / 2;
    const variables = { w0: { nombre: 'rapidez angular inicial', color: 'o' }, al: { nombre: 'desaceleración angular', color: 'i' }, t: { nombre: 'tiempo', color: 'h' }, th: { nombre: 'ángulo girado', color: 'd' } };
    const enunciado = [`${Obj} gira a `, v('w0', W(modo, w0)), '. Se aplica un freno y su rapidez angular disminuye de manera uniforme a razón de ',
      v('al', modo === 'rad' ? `${al} rad/s²` : `${P.pi(al * Math.PI)} rad/s²`), '. Cuando se detiene, ya no vuelve a girar.'];
    const pregunta = [`${modo === 'rad' ? '¿Qué ángulo gira' : '¿Cuántas vueltas da'} ${obj} en los primeros `, v('t', `${t} s`), ' desde que empieza a frenar?'];
    const errores = [
      h('mcuv-sin-frenar', sinFrenar, `Usaste θ = ω0·t − ½·α·t² con t = ${t} s, pero ${obj} se detiene antes, a los ${ts} s; después ya no gira. La ecuación no sabe que el freno no lo hace retroceder.`, CIN),
      h('rectangulo-con-omega0', pS * t, 'Multiplicaste la rapidez inicial por el tiempo, como si no frenara.', CIN),
      h('CI-area-hasta-t', pS * t / 2, `Tomaste la rapidez media del frenado durante los ${t} s, pero el frenado dura solo ${ts} s.`),
      h('rectangulo-con-omega0', pS * ts, `Calculaste bien cuándo se detiene (${ts} s), pero multiplicaste la rapidez inicial por ese tiempo, como si no frenara.`, CIN),
    ];
    if (modo === 'pi') errores.unshift(h('vueltas-sin-2pi', 2 * correcta, 'Tomaste π rad como una vuelta. Una vuelta son 2π rad.'));
    const solucion = [
      ['Primero, cuándo se detiene: ', v('w0', 'ω0'), '/', v('al', 'α'), ` = ${modo === 'rad' ? `${w0}/${al}` : `${P.pi(w0 * Math.PI)}/${P.pi(al * Math.PI)}`} = ${ts} s. Es menos que `, v('t', `${t} s`), ': después ya no gira.'],
      ...(modo === 'pi' ? [['En vueltas por segundo, ', v('w0', W(modo, w0)), ` = ${vps(pS)}.`]] : []),
      [`Lo girado es el área del triángulo bajo ω-t hasta los ${ts} s: `, v('th', 'θ'), ` = ${f(pS)} · ${ts}/2 = `, v('th', TH(modo, correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => TH(modo, x), unidad: modo === 'rad' ? 'rad' : 'vueltas', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'frenado', modo, w0, alfa: al, t } });
  }

  // ---- tiempo: ω0, ωf y lo girado ----
  function tiempo(rng, semilla, Obj, obj) {
    const modo = rng.elegir(['rad', 'rpm', 'rpm', 'pi']);
    const w0 = rapidezModo(rng, modo, 1);
    const w2 = rng.moneda() ? 0 : rapidezModo(rng, modo, 1);
    if (w0 === w2) return null;
    const t = rng.entero(2, 20);
    const p1 = porSeg(modo, w0), p2 = porSeg(modo, w2);
    const th = (p1 + p2) / 2 * t;
    if (!corto(th, 1) || th > 2000) return null;
    const variables = { w0: { nombre: 'rapidez angular inicial', color: 'o' }, wf: { nombre: 'rapidez angular final', color: 'i' }, th: { nombre: 'ángulo girado', color: 'h' }, t: { nombre: 'tiempo', color: 'd' } };
    const enunciado = w2 === 0
      ? [`${Obj} gira a `, v('w0', W(modo, w0)), ' y frena de manera uniforme hasta detenerse. Mientras frena, ', modo === 'rad' ? 'gira ' : 'da ', v('th', TH(modo, th)), '.']
      : [`${Obj} gira a `, v('w0', W(modo, w0)), ` y ${w2 > w0 ? 'acelera' : 'frena'} de manera uniforme hasta girar a `, v('wf', W(modo, w2)), '. Mientras tanto, ', modo === 'rad' ? 'gira ' : 'da ', v('th', TH(modo, th)), '.'];
    const pregunta = [`¿Cuánto ${w2 === 0 ? 'tarda en detenerse' : 'dura ese cambio'}?`];
    const errores = [];
    if (modo === 'rpm') errores.push(h('CI-rpm-sin-60', th / ((w0 + w2) / 2), 'Usaste las rpm como si fueran vueltas por segundo. Una rpm es una vuelta por minuto: hay que dividir entre 60.'));
    if (modo === 'pi') errores.push(h('vueltas-sin-2pi', t / 2, `Pasaste las vueltas a radianes con π en vez de 2π: ${f(th)} vueltas son ${f(2 * th)}π rad.`));
    errores.push(h('rectangulo-con-omega0', th / p1, 'Dividiste lo girado entre la rapidez inicial, como si no cambiara. Con α constante, se divide entre la rapidez media.', CIN));
    if (w2 > 0) errores.push(h('rectangulo-con-omegaf', th / p2, 'Dividiste lo girado entre la rapidez final, como si hubiera girado así todo el tiempo. Se divide entre la rapidez media.', CIN));
    errores.push(h('CI-sin-el-2', th / (p1 + p2), 'Dividiste entre ω0 + ωf: olvidaste el 2 de la rapidez media, (ω0 + ωf)/2.'));
    if (w2 > 0) errores.push(h('CI-resta-en-vez-de-suma', 2 * th / Math.abs(p2 - p1), 'Restaste las rapideces en vez de sumarlas. La rapidez media es (ω0 + ωf)/2.'));
    errores.push(h('CI-despeje-al-reves', th / (2 * (p1 + p2)), 'Despejaste mal el 2: de θ = (ω0 + ωf)/2 · t sale t = 2θ/(ω0 + ωf); el 2 pasa multiplicando a θ, no dividiendo.'));
    const solucion = [];
    if (modo === 'rpm') solucion.push(['En vueltas por segundo: ', v('w0', W(modo, w0)), ` = ${vps(p1)}`, ...(w2 ? [' y ', v('wf', W(modo, w2)), ` = ${vps(p2)}`] : []), '.']);
    if (modo === 'pi') solucion.push(['Una vuelta son 2π rad: ', v('w0', W(modo, w0)), ` = ${vps(p1)}`, ...(w2 ? [' y ', v('wf', W(modo, w2)), ` = ${vps(p2)}`] : []), '.']);
    solucion.push(['Con α constante, lo girado es la rapidez media por el tiempo: ', v('th', 'θ'), ' = (', v('w0', 'ω0'), ' + ', v('wf', 'ωf'), ')/2 · t.']);
    solucion.push([v('t', 't'), ` = 2θ/(ω0 + ωf) = 2 · ${f(th)}/(${f(p1)} + ${f(p2)}) = `, v('t', `${f(t)} s`), '.']);
    return cerrar(rng, semilla, { correcta: t, errores, texto: x => `${f(x)} s`, unidad: 's', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'tiempo', modo, w1: w0, w2, theta: th } });
  }

  // ---- alfa: |α| desde dos instantes o desde ω0, ωf y θ (modo rad) ----
  function alfa(rng, semilla, Obj, obj) {
    const sub = rng.elegir(['intervalo', 'intervalo', 'theta']);
    const R = rng.moneda() && obj !== 'el ventilador' && obj !== 'el esmeril' ? rng.elegir([0.5, 2, 3, 4]) : null;
    const conR = R ? `, de ${f(R)} m de radio,` : '';
    const variables = { w0: { nombre: 'rapidez angular inicial', color: 'o' }, wf: { nombre: 'rapidez angular final', color: 'i' }, t: { nombre: sub === 'theta' ? 'ángulo girado' : 'tiempo', color: 'h' }, al: { nombre: 'aceleración angular', color: 'd' } };
    const texto = x => `${f(x)} rad/s²`;
    if (sub === 'intervalo') {
      const w1 = rng.entero(0, 30), w2 = rng.entero(0, 40);
      if (w1 === w2) return null;
      const t1 = rng.elegir([0, 1, 2, 2, 3, 4, 5, 6]), dt = rng.entero(2, 10), t2 = t1 + dt;
      const correcta = Math.abs(w2 - w1) / dt;
      if (!corto(correcta, 2)) return null;
      const enunciado = t1 === 0
        ? [`${Obj}${conR} gira a `, v('w0', `${w1} rad/s`), ` y ${w2 > w1 ? 'acelera' : 'frena'} de manera uniforme; `, v('t', `${dt} s`), ' después gira a ', v('wf', `${w2} rad/s`), '.']
        : [`${Obj}${conR} gira con aceleración angular constante. En el instante t = ${t1} s su rapidez angular es `, v('w0', `${w1} rad/s`), `, y en t = ${t2} s es `, v('wf', `${w2} rad/s`), '.'];
      if (t1 === 0 && w1 === 0) enunciado.splice(0, 3, `${Obj}${conR} parte del reposo y acelera de manera uniforme; `);
      const pregunta = ['¿Cuál es el módulo de su ', v('al', 'aceleración angular'), '?'];
      const errores = [
        pa('K4-v-entre-t', w2 / t2, `Dividiste la rapidez final entre el instante final (${w2}/${t2}). La aceleración es el cambio de rapidez entre el tiempo transcurrido: Δω/Δt.`),
      ];
      if (t1 > 0) errores.push(pa('K4-delta-t-contra-t', Math.abs(w2 - w1) / t2, `Restaste bien las rapideces, pero dividiste entre el instante final, t = ${t2} s. El intervalo dura ${t2} − ${t1} = ${dt} s.`));
      if (w1 > 0) errores.push(pa('K4-sin-restar-inicial', w2 / dt, `Dividiste la rapidez final entre el tiempo sin restar la rapidez del comienzo. La aceleración es (ωf − ω0)/Δt.`));
      if (R) errores.push(h('CI-dato-que-sobra', correcta * R, `El radio no hacía falta: al multiplicar por ${f(R)} m obtuviste la aceleración tangencial de un punto del borde, en m/s², no la angular.`));
      errores.push(h('CI-suma-en-vez-de-resta', (w1 + w2) / dt, 'Sumaste las rapideces en vez de restarlas. La aceleración mide cuánto cambia ω: (ωf − ω0)/Δt.'));
      const solucion = [
        ...(t1 > 0 ? [['El intervalo dura ', v('t', `Δt = ${t2} − ${t1} = ${dt} s`), '.']] : []),
        ...(R ? [['El radio no hace falta: se pide la aceleración angular.']] : []),
        ['|', v('al', 'α'), '| = |', v('wf', 'ωf'), ' − ', v('w0', 'ω0'), `|/Δt = |${w2} − ${w1}|/${dt} = `, v('al', texto(correcta)), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto, unidad: 'rad/s²', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'alfa', sub, w1, w2, t1, t2, R } });
    }
    const w1 = rng.entero(0, 20), w2 = rng.entero(0, 30);
    if (w1 === w2) return null;
    const th = rng.entero(10, 120);
    const correcta = Math.abs(w2 * w2 - w1 * w1) / (2 * th);
    if (!corto(correcta, 2)) return null;
    const enunciado = w1 === 0
      ? [`${Obj}${conR} parte del reposo y acelera de manera uniforme hasta girar a `, v('wf', `${w2} rad/s`), '. Mientras acelera, gira ', v('t', `${th} rad`), '.']
      : [`${Obj}${conR} gira a `, v('w0', `${w1} rad/s`), ` y ${w2 > w1 ? 'acelera' : 'frena'} de manera uniforme hasta `, w2 === 0 ? 'detenerse' : ['girar a ', v('wf', `${w2} rad/s`)], '. Mientras tanto, gira ', v('t', `${th} rad`), '.'].flat();
    const pregunta = ['¿Cuál es el módulo de su ', v('al', 'aceleración angular'), '?'];
    const errores = [
      h('CI-sin-el-2', 2 * correcta, 'Olvidaste el 2 de ωf² = ω0² + 2αθ: α = (ωf² − ω0²)/(2θ).'),
      h('CI-cuadrado-de-la-diferencia', (w2 - w1) ** 2 / (2 * th), 'Elevaste al cuadrado la diferencia de rapideces. La fórmula pide la diferencia de los cuadrados: ωf² − ω0².'),
      h('CI-sin-cuadrado', Math.abs(w2 - w1) / (2 * th), 'Usaste las rapideces sin elevarlas al cuadrado: la ecuación es ωf² = ω0² + 2αθ.'),
    ];
    if (w1 > 0 && w2 > 0) errores.push(pa('K4-sin-restar-inicial', Math.max(w1, w2) ** 2 / (2 * th), 'Usaste solo la rapidez mayor, como si la otra fuera cero. Hay que restar el cuadrado de la otra: |ωf² − ω0²|/(2θ).'));
    if (R) errores.push(h('CI-dato-que-sobra', correcta * R, `El radio no hacía falta: al multiplicar por ${f(R)} m obtuviste la aceleración tangencial del borde, no la angular.`));
    const solucion = [
      ...(R ? [['El radio no hace falta: se pide la aceleración angular.']] : []),
      ['No se conoce el tiempo, así que se usa la ecuación sin t: ', v('wf', 'ωf'), '² = ', v('w0', 'ω0'), '² ± 2', v('al', 'α'), v('t', 'θ'), '.'],
      ['|', v('al', 'α'), `| = |ωf² − ω0²|/(2θ) = |${w2 * w2} − ${w1 * w1}|/(2 · ${th}) = `, v('al', texto(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto, unidad: 'rad/s²', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'alfa', sub, w1, w2, theta: th, R } });
  }

  // ---- tramos: acelera desde el reposo, sigue constante y frena hasta detenerse ----
  function tramos(rng, semilla, Obj, obj) {
    const modo = rng.elegir(['rad', 'rad', 'pi']);
    const a1 = modo === 'rad' ? rng.entero(1, 6) : rng.elegir([1, 2, 3, 4]);
    const t1 = rng.entero(2, 8), t2 = rng.entero(3, 15), t3 = rng.entero(2, 10);
    if (t1 === t3) return null;
    const wm = a1 * t1, pm = porSeg(modo, wm);
    const correcta = pm * (t1 + 2 * t2 + t3) / 2, T = t1 + t2 + t3;
    if (!corto(correcta, 1)) return null;
    const variables = { al: { nombre: 'aceleración angular del arranque', color: 'o' }, wm: { nombre: 'rapidez angular máxima', color: 'i' }, t: { nombre: 'tiempos de cada tramo', color: 'h' }, th: { nombre: 'ángulo girado', color: 'd' } };
    const enunciado = [`${Obj} parte del reposo y acelera de manera uniforme con `, v('al', modo === 'rad' ? `${a1} rad/s²` : `${P.pi(a1 * Math.PI)} rad/s²`), ' durante ', v('t', `${t1} s`),
      '; luego gira con rapidez constante durante ', v('t', `${t2} s`), ' y, al final, frena de manera uniforme hasta detenerse en ', v('t', `${t3} s`), '.'];
    const pregunta = [modo === 'rad' ? `¿Qué ángulo gira ${obj} en total?` : `¿Cuántas vueltas da ${obj} en total?`];
    const errores = [];
    if (modo === 'pi') errores.push(h('vueltas-sin-2pi', 2 * correcta, 'Tomaste π rad como una vuelta. Una vuelta son 2π rad.'));
    errores.push(
      h('rectangulo-con-omegaf', pm * T, 'Multiplicaste la rapidez máxima por el tiempo total, como si hubiera girado así desde el comienzo. En el arranque y en el frenado la rapidez media es la mitad de la máxima.', CIN),
      h('CI-tramo-olvidado', pm * (t1 + t3) / 2, 'Te olvidaste del tramo con rapidez constante, que es el que más gira.'),
      h('CI-tramos-como-triangulo', pm * T / 2, 'Tomaste todo el movimiento como un solo triángulo. En el tramo del medio la rapidez no cambia: ahí la figura bajo ω-t es un rectángulo.'),
      h('CI-tramo-olvidado', pm * (t1 / 2 + t2), 'Te olvidaste del frenado: también gira mientras frena, hasta detenerse.'),
    );
    const solucion = [
      ['Rapidez máxima, al final del arranque: ', v('wm', 'ωmáx'), ' = ', v('al', 'α'), ' · t1 = ', modo === 'rad' ? `${a1} · ${t1} = ${wm} rad/s` : `${P.pi(a1 * Math.PI)} · ${t1} = ${P.pi(wm * Math.PI)} rad/s = ${vps(pm)}`, '.'],
      ['Lo girado es el área bajo ω-t: un trapecio con dos triángulos (arranque y frenado) y un rectángulo (el tramo constante).'],
      [v('th', 'θ'), ` = ${f(pm)} · ${t1}/2 + ${f(pm)} · ${t2} + ${f(pm)} · ${t3}/2 = `, v('th', TH(modo, correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => TH(modo, x), unidad: modo === 'rad' ? 'rad' : 'vueltas', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'tramos', modo, alfa: a1, t1, t2, t3 } });
  }

  return { id: 'circular-mcuv', titulo: 'El giro que acelera: tres datos y lo que falta', generar };
});
