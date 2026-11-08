/*
 * Generador G9: el giro con otro movimiento (tipo C5 del mapa,
 * docs/clasificacion/compendio-movimiento-circunferencial.md, sección 4(b)).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['circular-giro-combinado']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   discos      dos discos en un mismo eje; una bala paralela al eje los atraviesa y el segundo
 *               agujero queda un ángulo φ detrás del primero. Se pide la ω mínima (con π), dando la
 *               rapidez de la bala o el tiempo entre los discos en ms; o la rapidez de la bala,
 *               dando ω (en rpm o en rad/s) y sabiendo que los discos giran menos de una vuelta
 *   cascaron    una esfera hueca gira; la bala entra y sale por el mismo agujero, cruzando un
 *               diámetro: la ω mínima es media vuelta en el tiempo del cruce
 *   plataforma  un tubo fijo, encima del borde de una plataforma que gira, dispara una bolita
 *               verticalmente hacia arriba cuando pasa la marca A; la bolita vuelve a caer en el
 *               mismo lugar, y debe caer sobre la marca B (φ detrás de A) o sobre la misma A
 *
 * Convenciones: g = 10 m/s²; sin resistencia del aire; la bala va en línea recta con rapidez
 * constante. «Detrás» se mide en el sentido de giro: la marca que está φ detrás llega al lugar
 * después de girar φ. El tubo de «plataforma» no gira con la plataforma: la bolita no recibe la
 * velocidad del borde, por eso cae en el mismo punto del espacio.
 * Errores: CI-vuelta-entera, CI-diametro-por-radio y CI-ms-sin-convertir del mapa y los demás, hipótesis.
 * Los grados sin pasar a radianes no se usan: su número no lleva π y no tendría la forma de las demás.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const PI = Math.PI, RAD = PI / 180;
  const corto = (x, dec = 2) => Number.isFinite(x) && x > 0 && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && x < 1e5;
  const wTxt = x => P.pi(x, 'rad/s');
  const radTxt = g => P.pi(g * RAD, 'rad');

  function generar(semilla) {
    const rng = Azar.crear('circular-giro-combinado|' + semilla);
    const [tipo, sub] = rng.elegir([['discos', 'omega'], ['discos', 'omega'], ['discos', 'ms'], ['discos', 'v'], ['discos', 'v'],
      ['cascaron'], ['cascaron'], ['plataforma'], ['plataforma'], ['plataforma']]);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'discos') return discos(rng, semilla, sub);
    if (tipo === 'cascaron') return cascaron(rng, semilla);
    return plataforma(rng, semilla);
  }

  function cerrar(rng, semilla, o) {
    const errores = o.pi ? o.errores : o.errores.filter(e => corto(e.valor));
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.texto, formato: o.pi ? 'pi' : null });
    return {
      id: `circular-giro-combinado#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  const DESFASES = [30, 36, 45, 60, 72, 90, 120, 135, 150, 180];
  // Errores comunes a «discos» y «plataforma», en función del ángulo que se cree girado (en rad) y t.
  function erroresAngulo(phi, t, conMas = '') {
    const e = [];
    if (phi !== 360) e.push(h('CI-vuelta-entera', 2 * PI / t, `Supusiste que tenía que dar una vuelta entera. Basta con que gire ${phi}°${conMas}.`));
    e.push(h('CI-no-minima', (phi * RAD + 2 * PI) / t, `Le sumaste una vuelta: girar ${phi}° más una vuelta también sirve, pero no es la rapidez mínima.`));
    if (phi !== 180 && phi !== 360) e.push(h('CI-desfase-complementario', (360 - phi) * RAD / t, `Mediste el ángulo por el otro lado: ${360 - phi}° es lo que le falta a ${phi}° para la vuelta. Hacia el lado del giro, son ${phi}°.`));
    return e;
  }

  // ---- discos ----
  function discos(rng, semilla, sub) {
    const phi = rng.elegir(DESFASES);
    const variables = { L: { nombre: 'distancia entre los discos', color: 'o' }, vb: { nombre: 'rapidez de la bala', color: 'i' }, phi: { nombre: 'desfase', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const enCm = rng.moneda();
    const Lcm = rng.elegir([40, 50, 60, 75, 80, 100, 120, 150, 200]), L = Lcm / 100;
    const Ltxt = enCm && Lcm < 100 ? `${Lcm} cm` : `${f(L)} m`;
    const base = ['Dos discos delgados están fijos a un mismo eje, separados ', v('L', Ltxt), ', y giran juntos con rapidez angular constante. '];
    const desf = ['El agujero del segundo disco queda ', v('phi', `${phi}°`), ' detrás del agujero del primero, medidos en el sentido de giro.'];
    if (sub === 'v') {
      const rpm = rng.moneda();
      const N = rng.elegir([600, 900, 1200, 1500, 1800, 2400, 3000, 3600]), k = rng.elegir([20, 30, 40, 50, 60, 80, 100, 120]);
      const w = rpm ? N * PI / 30 : k * PI;
      const correcta = L * w / (phi * RAD);
      if (!corto(correcta) || correcta < 100 || correcta > 900) return null;
      const enunciado = [...base.slice(0, 2), ', y giran juntos a ', v('x', rpm ? `${N} rpm` : wTxt(w)), '. Una bala, que viaja paralela al eje con rapidez constante, atraviesa los dos discos. ', ...desf,
        ' Mientras la bala va de un disco al otro, los discos giran menos de una vuelta.'];
      const pregunta = ['¿Cuál es la ', v('vb', 'rapidez de la bala'), '?'];
      const errores = [
        h('CI-vuelta-entera', L * w / (2 * PI), `Supusiste que los discos dan una vuelta entera mientras pasa la bala. Giran solo ${phi}°.`),
        h('CI-no-minima', L * w / (phi * RAD + 2 * PI), `Sumaste una vuelta al desfase, pero el enunciado dice que los discos giran menos de una vuelta mientras pasa la bala.`),
        ...(phi !== 180 ? [h('CI-desfase-complementario', L * w / ((360 - phi) * RAD), `Mediste el desfase por el otro lado: ${360 - phi}°. Medido en el sentido de giro, el segundo agujero está ${phi}° detrás.`)] : []),
        ...(rpm ? [h('CI-rpm-sin-60', 60 * correcta, 'No dividiste entre 60 al pasar las rpm a rad/s: las rpm son vueltas por minuto.')] : []),
        ...(enCm && Lcm < 100 ? [h('CI-unidades-sin-convertir', 100 * correcta, 'Dejaste la distancia en centímetros: así la rapidez sale en cm/s, no en m/s.')] : []),
      ];
      const tq = phi * RAD / w, tLimpio = corto(tq * 1000, 3);
      const solucion = [
        ...(rpm ? [[v('x', `${N} rpm`), ` = ${N} · 2π/60 rad/s = ${wTxt(w)}.`]] : []),
        ['Mientras la bala va de un disco al otro, los discos giran el desfase (menos de una vuelta): ', v('phi', `${phi}° = ${radTxt(phi)}`), '.'],
        tLimpio
          ? ['Ese giro dura t = θ/ω = ', `${radTxt(phi)} ÷ ${wTxt(w)} = ${f(tq * 1000)} ms; la bala recorre `, v('L', 'L'), ' en ese tiempo: ', v('vb', 'v'), ` = ${f(L)} m ÷ ${f(tq)} s = `, v('vb', `${f(correcta)} m/s`), '.']
          : ['Ese giro dura t = θ/ω, y la bala recorre ', v('L', 'L'), ' en ese tiempo: ', v('vb', 'v'), ` = L·ω/θ = ${f(L)} · ${wTxt(w).replace(' rad/s', '')} ÷ ${radTxt(phi).replace(' rad', '')} = `, v('vb', `${f(correcta)} m/s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} m/s`, unidad: 'm/s', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'discos', sub, L, phi, rpm: rpm ? N : null, omegaPi: rpm ? null : k } });
    }
    let t, enunBala, pasoT;
    if (sub === 'ms') {
      const tms = rng.elegir([1, 2, 2.5, 4, 5, 6, 8, 10]);
      t = tms / 1000;
      enunBala = ['Una bala, que viaja paralela al eje, tarda ', v('vb', `${f(tms)} ms`), ' en ir del primer disco al segundo. '];
      pasoT = ['El tiempo en segundos: ', v('vb', `t = ${f(tms)} ms`), ` = ${f(tms)}/1000 s.`];
    } else {
      const vb = rng.elegir([100, 120, 150, 200, 240, 300, 360, 400, 450, 500, 600]);
      t = L / vb;
      enunBala = ['Una bala, que viaja paralela al eje a ', v('vb', `${vb} m/s`), ', atraviesa los dos discos. '];
      pasoT = ['Tiempo de la bala entre los discos: t = ', v('L', 'L'), '/', v('vb', 'v'), ` = ${f(L)}/${vb} s.`];
    }
    const correcta = phi * RAD / t;
    if (!P.pi(correcta) || correcta / PI > 200 || correcta / PI < 2) return null;
    // Con el tiempo en ms no se da la separación: no hace falta.
    const enunciado = [...(sub === 'ms' ? ['Dos discos delgados están fijos a un mismo eje y giran juntos con rapidez angular constante. '] : base), ...enunBala, ...desf];
    const pregunta = ['¿Cuál es la menor ', v('x', 'rapidez angular'), ' que pueden tener los discos?'];
    const errores = erroresAngulo(phi, t);
    if (sub === 'ms') errores.push(h('CI-ms-sin-convertir', correcta / 1000, 'Usaste los milisegundos como si fueran segundos: 1 ms es una milésima de segundo.'));
    if (sub !== 'ms' && enCm && Lcm < 100) errores.push(h('CI-unidades-sin-convertir', correcta / 100, 'Dejaste la distancia en centímetros con la rapidez en m/s: el tiempo te salió 100 veces mayor.'));
    const solucion = [
      pasoT,
      ['Mientras tanto, los discos deben girar el desfase, ', v('phi', `${phi}° = ${radTxt(phi)}`), ' (girar además vueltas enteras también sirve, pero da una ω mayor).'],
      [v('x', 'ω'), ` = θ/t = ${radTxt(phi)} ÷ ${P.formatear(t, 6)} s = `, v('x', wTxt(correcta)), '.'],
    ];
    if (!corto(t, 6)) solucion[2] = [v('x', 'ω'), ' = θ/t = ', v('x', wTxt(correcta)), '.'];
    return cerrar(rng, semilla, { pi: true, correcta, errores, texto: wTxt, unidad: 'rad/s', variables, enunciado, pregunta, solucion,
      datos: sub === 'ms' ? { tipo: 'discos', sub, phi, t } : { tipo: 'discos', sub, L, phi, t } });
  }

  // ---- cascaron ----
  function cascaron(rng, semilla) {
    const Rcm = rng.elegir([10, 15, 20, 25, 30, 40, 50, 60, 75, 100]), R = Rcm / 100;
    const diam = rng.moneda();
    const vb = rng.elegir([100, 120, 150, 200, 240, 300, 400]);
    const t = 2 * R / vb, correcta = PI / t;
    if (!P.pi(correcta) || correcta / PI > 200) return null;
    const variables = { R: { nombre: diam ? 'diámetro' : 'radio', color: 'o' }, vb: { nombre: 'rapidez de la bala', color: 'i' }, x: { nombre: 'rapidez angular', color: 'd' } };
    const med = diam ? (2 * Rcm >= 100 ? `${f(2 * R)} m de diámetro` : `${2 * Rcm} cm de diámetro`) : (Rcm >= 100 ? `${f(R)} m de radio` : `${Rcm} cm de radio`);
    const enunciado = ['Un cascarón esférico de ', v('R', med), ' gira con rapidez angular constante alrededor de un eje vertical que pasa por su centro. Una bala horizontal, a ',
      v('vb', `${vb} m/s`), ', entra por un punto del ecuador, cruza la esfera por un diámetro y sale por el mismo agujero por donde entró.'];
    const pregunta = ['¿Cuál es la menor ', v('x', 'rapidez angular'), ' del cascarón?'];
    const errores = [
      h('CI-vuelta-entera', 2 * correcta, 'Supusiste que el cascarón tenía que dar una vuelta entera. El agujero de entrada solo tiene que pasar al otro lado: media vuelta.'),
      diam
        ? h('CI-diametro-por-radio', correcta / 2, 'Tomaste el diámetro como si fuera el radio, y la bala te salió recorriendo el doble. La bala recorre un diámetro, que es el dato.')
        : h('CI-diametro-por-radio', 2 * correcta, 'Tomaste el radio como el camino de la bala. La bala cruza toda la esfera: recorre un diámetro, el doble del radio.'),
      h('CI-cuarto-de-vuelta', correcta / 2, 'Tomaste un cuarto de vuelta. El agujero de entrada tiene que llegar al punto opuesto, por donde sale la bala: media vuelta.'),
      h('CI-no-minima', 3 * correcta, 'Una vuelta y media también sirve, pero no es la rapidez mínima: basta media vuelta.'),
      h('CI-unidades-sin-convertir', correcta / 100, 'Dejaste la medida en centímetros con la rapidez en m/s: el tiempo te salió 100 veces mayor.'),
    ];
    if (Rcm >= 100 || (diam && 2 * Rcm >= 100)) errores.pop();
    const solucion = [
      ['La bala recorre un diámetro: ', v('R', `${f(2 * R)} m`), '. Tarda t = ', `${f(2 * R)}/${vb} s.`],
      ['Para que salga por el mismo agujero, el agujero tiene que pasar al lado opuesto: el cascarón gira media vuelta, π rad (o media vuelta más vueltas enteras).'],
      [v('x', 'ω'), ` = π/t = π · ${vb}/${f(2 * R)} = `, v('x', wTxt(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { pi: true, correcta, errores, texto: wTxt, unidad: 'rad/s', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'cascaron', R, diametro: diam, v: vb } });
  }

  // ---- plataforma ----
  // Altura máxima H (m) con tiempo de subida limpio: t = √(2H/g).
  const ALTURAS = [0.8, 1.25, 1.8, 3.2, 5, 7.2, 11.25, 20];
  function plataforma(rng, semilla) {
    const phi = rng.elegir([90, 180, 180, 270, 360, 360, 120, 60]);
    const misma = phi === 360;
    // Con la misma marca A, el dato es la altura máxima: así hay un error real más (olvidar la raíz).
    const conH = misma || rng.moneda();
    const H = conH ? rng.elegir(ALTURAS) : null;
    const v0 = conH ? null : rng.elegir([2, 2.5, 4, 5, 7.5, 10, 15, 20]);
    const tSube = conH ? Math.sqrt(2 * H / 10) : v0 / 10;
    const t = 2 * tSube, correcta = phi * RAD / t;
    if (!P.pi(correcta) || !corto(t)) return null;
    const variables = { v0: { nombre: conH ? 'altura máxima' : 'rapidez de lanzamiento', color: 'o' }, phi: { nombre: 'ángulo que debe girar', color: 'h' }, t: { nombre: 'tiempo de vuelo', color: 'i' }, x: { nombre: 'rapidez angular', color: 'd' } };
    const enunciado = ['Una plataforma horizontal gira con rapidez angular constante. Un tubo fijo, que no gira con la plataforma, está justo encima de su borde. Cuando la marca A del borde pasa debajo del tubo, este dispara una bolita verticalmente hacia arriba',
      ...(conH ? ['; la bolita llega a ', v('v0', `${f(H)} m`), ' de altura'] : [' a ', v('v0', `${f(v0)} m/s`)]),
      '. La bolita sube y vuelve a caer en el mismo lugar, sobre el borde de la plataforma. ',
      ...(misma ? ['Se quiere que caiga sobre la misma marca A.'] : ['Se quiere que caiga sobre la marca B, que está ', v('phi', `${phi}°`), ' detrás de A, medidos en el sentido de giro.']),
      ' Usa g = 10 m/s² y desprecia la resistencia del aire.'];
    const pregunta = misma ? ['¿Cuál es la menor ', v('x', 'rapidez angular'), ' de la plataforma, distinta de cero?'] : ['¿Cuál es la menor ', v('x', 'rapidez angular'), ' de la plataforma?'];
    const errores = [
      h('CI-solo-subida', 2 * correcta, `Usaste solo el tiempo de subida, ${f(tSube)} s. La bolita también tarda en bajar: el vuelo dura el doble.`),
      ...(misma ? [h('CI-media-vuelta', PI / t, 'Con media vuelta, debajo del tubo estaría el punto opuesto a A. Para que vuelva la misma marca A, la plataforma tiene que dar una vuelta entera.')] : []),
      ...(conH ? [h('CI-caida-sin-raiz', phi * RAD / (2 * (2 * H / 10)), `De H = g·t²/2 despejaste t = 2H/g, sin la raíz. El tiempo de subida es t = √(2H/g) = ${f(tSube)} s.`)] : []),
      ...erroresAngulo(phi, t),
    ];
    const solucion = [
      conH
        ? ['Tiempo de subida: de H = g·t²/2, t = √(2', v('v0', 'H'), `/g) = √(2 · ${f(H)}/10) = ${f(tSube)} s. Sube y baja: `, v('t', 't'), ` = 2 · ${f(tSube)} = ${f(t)} s.`]
        : ['Tiempo de vuelo (sube y baja): ', v('t', 't'), ' = 2', v('v0', 'v0'), `/g = 2 · ${f(v0)}/10 = ${f(t)} s.`],
      [misma ? 'En ese tiempo, la plataforma tiene que dar una vuelta entera para que A vuelva debajo del tubo (sin girar, A también estaría ahí, pero se pide una rapidez distinta de cero): ' : 'En ese tiempo, la plataforma tiene que girar lo que separa a B de A: ',
        v('phi', `${phi}° = ${radTxt(phi)}`), ' (más vueltas enteras también sirven, pero dan una ω mayor).'],
      [v('x', 'ω'), ` = θ/t = ${radTxt(phi)} ÷ ${f(t)} s = `, v('x', wTxt(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { pi: true, correcta, errores, texto: wTxt, unidad: 'rad/s', variables, enunciado, pregunta, solucion,
      datos: conH ? { tipo: 'plataforma', phi, H } : { tipo: 'plataforma', phi, v0 } });
  }

  return { id: 'circular-giro-combinado', titulo: 'Balas, cascarones y plataformas que giran', generar };
});
