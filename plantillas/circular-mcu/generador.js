/*
 * Generador G1: MCU y conversiones, y puntos de un mismo cuerpo (tipos C1 y C2 del mapa,
 * docs/clasificacion/compendio-movimiento-circunferencial.md, sección 4(b)).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['circular-mcu']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   omega     rpm, o n vueltas en un tiempo (s o min); se pide ω en rad/s (con π indicado)
 *   v         un punto del borde (radio o diámetro en cm) con rpm o periodo; se pide v en m/s (con π)
 *   acp       rapidez y radio (o diámetro), o ω en rad/s y radio; se pide la aceleración centrípeta
 *   vueltas   ω en múltiplos de π rad/s durante unos minutos, o rpm durante unos segundos; se piden
 *             las vueltas
 *   rigido    (C2) dos puntos del mismo disco: la rapidez de uno sabiendo la del otro; la razón de
 *             rapideces con un punto dado por su distancia al borde; o ω con dos rapideces y la
 *             separación entre los puntos
 *   latitud   (C2) un punto de la Tierra (o de un globo terráqueo que gira) a 37°, 53° o 60° de
 *             latitud: r = R·cos λ; se pide su rapidez (con π)
 *
 * Convenciones: las respuestas con π van con π indicado en todas las alternativas («3π rad/s»);
 * las demás son números. Las rpm son vueltas por minuto. Una vuelta son 2π rad.
 * Errores: los CI-* del mapa y los de la escena (hipótesis).
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
  const corto = (x, dec = 2) => Number.isFinite(x) && x > 0 && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 && x < 1e5;
  const PI = Math.PI;
  const piTxt = (x, u) => P.pi(x, u);
  const vueltasTxt = x => `${f(x)} ${Math.abs(x - 1) < 1e-9 ? 'vuelta' : 'vueltas'}`;
  const OBJ = [['Un disco', 'el disco'], ['Una rueda', 'la rueda'], ['Una polea', 'la polea'], ['Un ventilador', 'el ventilador'], ['Un esmeril', 'el esmeril']];
  const RPM = [30, 45, 60, 90, 120, 150, 180, 240, 300, 360, 450, 600, 720, 900, 1200];

  function generar(semilla) {
    const rng = Azar.crear('circular-mcu|' + semilla);
    const tipo = rng.elegir(['omega', 'omega', 'v', 'v', 'acp', 'acp', 'vueltas', 'rigido', 'rigido', 'latitud']);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo) {
    if (tipo === 'omega') return omega(rng, semilla);
    if (tipo === 'v') return rapidez(rng, semilla);
    if (tipo === 'acp') return centripeta(rng, semilla);
    if (tipo === 'vueltas') return vueltas(rng, semilla);
    if (tipo === 'rigido') return rigido(rng, semilla);
    return latitud(rng, semilla);
  }

  function cerrar(rng, semilla, o) {
    const errores = o.pi ? o.errores : o.errores.filter(e => corto(e.valor));
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.texto, formato: o.pi ? 'pi' : null });
    return {
      id: `circular-mcu#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  // ---- omega: de rpm o de vueltas en un tiempo a rad/s ----
  function omega(rng, semilla) {
    const [Obj, obj] = rng.elegir(OBJ);
    const modo = rng.elegir(['rpm', 'rpm', 'vueltas']);
    const variables = { f: { nombre: 'rapidez de giro dada', color: 'o' }, t: { nombre: 'tiempo', color: 'i' }, w: { nombre: 'rapidez angular', color: 'd' } };
    const texto = x => piTxt(x, 'rad/s');
    const pregunta = ['¿Cuál es la ', v('w', 'rapidez angular'), ` ${obj.replace(/^el /, 'del ').replace(/^la /, 'de la ')}, en rad/s?`];
    if (modo === 'rpm') {
      const N = rng.elegir(RPM);
      const correcta = N * PI / 30;
      const enunciado = [`${Obj} gira con rapidez constante a `, v('f', `${N} rpm`), '.'];
      const errores = [
        h('CI-rpm-sin-2pi', N * PI / 60, 'Multiplicaste por π en vez de 2π: una vuelta son 2π rad, no π rad.'),
        h('CI-rpm-sin-60', 2 * PI * N, 'Pasaste las vueltas a radianes, pero no dividiste entre 60: las rpm son vueltas por minuto, y un minuto tiene 60 s.'),
        h('CI-periodo-por-frecuencia', 120 * PI / N, `Dividiste 2π entre ${f(N / 60)}, como si fuera el periodo. Pero ${f(N / 60)} son las vueltas por segundo, la frecuencia: con la frecuencia se multiplica, ω = 2π·f.`),
        h('CI-rpm-sin-2-ni-60', PI * N, 'Multiplicaste las rpm por π: faltó el 2 de 2π y faltó dividir entre 60.'),
      ];
      const solucion = [
        [v('f', `${N} rpm`), ` son ${N} vueltas en 60 s: ${f(N / 60)} ${N === 60 ? 'vuelta' : 'vueltas'} por segundo.`],
        ['Cada vuelta son 2π rad: ', v('w', 'ω'), ` = 2π · ${f(N / 60)} = `, v('w', texto(correcta)), '.'],
      ];
      return cerrar(rng, semilla, { pi: true, correcta, errores, texto, unidad: 'rad/s', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'omega', modo, rpm: N } });
    }
    const enMin = rng.moneda();
    const t = enMin ? rng.elegir([1, 2, 3, 4, 5]) : rng.elegir([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30]);
    const n = rng.entero(2, enMin ? 120 : 60);
    const ts = enMin ? 60 * t : t;
    const correcta = 2 * PI * n / ts;
    if (!P.pi(correcta) || n / ts > 25) return null;
    const tTxt = enMin ? `${t} ${t === 1 ? 'minuto' : 'minutos'}` : `${t} s`;
    const enunciado = [`${Obj} gira con rapidez constante y da `, v('f', `${n} vueltas`), ' en ', v('t', tTxt), '.'];
    const errores = [
      h('CI-periodo-por-frecuencia', 2 * PI * ts / n, `Dividiste al revés: ${ts} s entre ${n} vueltas es lo que dura una vuelta (el periodo). ω = 2π·(vueltas/tiempo).`),
      h('vueltas-sin-2pi', PI * n / ts, 'Tomaste π rad como una vuelta. Una vuelta son 2π rad.'),
    ];
    if (enMin) errores.push(h('CI-unidades-sin-convertir', 2 * PI * n / t, 'Usaste los minutos como si fueran segundos. Antes de dividir, hay que pasar el tiempo a segundos.'));
    errores.push(h('CI-multiplica-por-tiempo', 2 * PI * n * ts, 'Multiplicaste por el tiempo. La rapidez angular es lo girado entre el tiempo que tarda: ω = 2π·n/t.'));
    const solucion = [
      ...(enMin ? [['El tiempo en segundos: ', v('t', `${tTxt} = ${ts} s`), '.']] : []),
      ['Cada vuelta son 2π rad: ', v('w', 'ω'), ` = 2π · ${n}/${ts} = `, v('w', texto(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { pi: true, correcta, errores, texto, unidad: 'rad/s', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'omega', modo, n, t, minutos: enMin } });
  }

  // ---- v: rapidez de un punto del borde ----
  function rapidez(rng, semilla) {
    const [Obj, obj] = rng.elegir(OBJ.slice(0, 4));
    const modo = rng.elegir(['rpm', 'rpm', 'periodo']);
    const diam = rng.moneda();
    const r = rng.elegir([5, 10, 12, 15, 20, 25, 30, 40, 50]);
    let w, dato, enunGiro, pasoW;
    if (modo === 'rpm') {
      dato = rng.elegir(RPM); w = dato * PI / 30;
      enunGiro = [' gira a ', v('f', `${dato} rpm`), '.'];
      pasoW = [v('f', `${dato} rpm`), ` = ${dato} · 2π/60 rad/s = ${piTxt(w, 'rad/s')}.`];
    } else {
      dato = rng.elegir([0.1, 0.2, 0.25, 0.5, 1, 2, 4, 5]); w = 2 * PI / dato;
      enunGiro = [' da una vuelta cada ', v('f', `${f(dato)} s`), '.'];
      pasoW = ['Una vuelta (2π rad) en ', v('f', `${f(dato)} s`), `: ω = 2π/${f(dato)} = ${piTxt(w, 'rad/s')}.`];
    }
    const correcta = w * r / 100;
    if (!P.pi(correcta) || correcta > 8 * PI) return null;
    const variables = { r: { nombre: diam ? 'diámetro' : 'radio', color: 'o' }, f: { nombre: 'rapidez de giro', color: 'i' }, vv: { nombre: 'rapidez del borde', color: 'd' } };
    const texto = x => piTxt(x, 'm/s');
    const enunciado = [`${Obj} de `, v('r', diam ? `${2 * r} cm de diámetro` : `${r} cm de radio`), ...enunGiro];
    const pregunta = ['¿Con qué ', v('vv', 'rapidez'), ' se mueve un punto de su borde?'];
    const errores = [];
    if (diam) errores.push(h('CI-diametro-por-radio', 2 * correcta, 'Usaste el diámetro donde va el radio: v = ω·r, y el radio es la mitad del diámetro.'));
    if (modo === 'rpm') {
      errores.push(h('CI-rpm-sin-2pi', correcta / 2, 'Multiplicaste las rpm por π en vez de 2π: una vuelta son 2π rad.'));
      errores.push(h('CI-rpm-sin-60', 60 * correcta, 'No dividiste entre 60: las rpm son vueltas por minuto, y la rapidez se pide por segundo.'));
    } else {
      errores.push(h('vueltas-sin-2pi', correcta / 2, 'Tomaste π rad como una vuelta. Una vuelta son 2π rad: ω = 2π/T.'));
      errores.push(h('CI-periodo-por-frecuencia', 2 * PI * dato * r / 100, 'Multiplicaste 2π por el periodo. El periodo divide: ω = 2π/T.'));
    }
    errores.push(h('CI-unidades-sin-convertir', 100 * correcta, 'Dejaste el radio en centímetros: así la rapidez sale en cm/s, no en m/s.'));
    errores.push(h('CI-v-entre-radio', w / (r / 100), 'Dividiste ω entre el radio. La rapidez del borde es ω por el radio: v = ω·r.'));
    const solucion = [
      pasoW,
      ...(diam ? [['El radio es la mitad del diámetro: ', v('r', `r = ${r} cm = ${f(r / 100)} m`), '.']] : [['El radio en metros: ', v('r', `${r} cm = ${f(r / 100)} m`), '.']]),
      [v('vv', 'v'), ` = ω·r = ${piTxt(w, 'rad/s')} · ${f(r / 100)} m = `, v('vv', texto(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { pi: true, correcta, errores, texto, unidad: 'm/s', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'v', modo, dato, r, diametro: diam } });
  }

  // ---- acp ----
  function centripeta(rng, semilla) {
    const sub = rng.elegir(['v', 'v', 'omega']);
    const texto = x => `${f(x)} m/s²`;
    const variables = { r: { nombre: 'radio', color: 'o' }, vv: { nombre: sub === 'v' ? 'rapidez' : 'rapidez angular', color: 'i' }, a: { nombre: 'aceleración centrípeta', color: 'd' } };
    const pregunta = ['¿Cuál es el módulo de su ', v('a', 'aceleración centrípeta'), '?'];
    if (sub === 'v') {
      const esc = rng.elegir([
        { txt: (vv, rr) => ['Un auto toma una curva circular de ', rr, ' con rapidez constante de ', vv, '.'], v: [8, 10, 12, 15, 16, 18, 20], r: [20, 25, 40, 50, 60, 80, 100], diam: false },
        { txt: (vv, rr) => ['Una piedra atada a una cuerda gira en un círculo horizontal de ', rr, ' con rapidez constante de ', vv, '.'], v: [2, 3, 4, 5, 6], r: [0.5, 0.8, 1, 1.2, 1.5, 2], diam: false },
        { txt: (vv, rr) => ['Un niño va en un carrusel de ', rr, '. Está sentado en el borde y se mueve con rapidez constante de ', vv, '.'], v: [1, 1.5, 2, 2.5, 3, 4], r: [2, 2.5, 3, 4, 5], diam: true },
      ]);
      const vv = rng.elegir(esc.v), r = rng.elegir(esc.r);
      const correcta = vv * vv / r;
      if (!corto(correcta) || correcta > 30) return null;
      const diam = esc.diam && rng.moneda();
      const rr = v('r', diam ? `${f(2 * r)} m de diámetro` : `${f(r)} m de radio`);
      const enunciado = esc.txt(v('vv', `${f(vv)} m/s`), rr);
      const errores = [
        h('acp-sin-cuadrado', vv / r, 'Dividiste la rapidez entre el radio sin elevarla al cuadrado: acp = v²/r.'),
        h('acp-por-radio', vv * vv * r, 'Multiplicaste por el radio. El radio divide: acp = v²/r.'),
        h('CI-acp-con-2', 2 * vv * vv / r, 'Pusiste un 2 que no va, como en v² = 2·a·d del MRUV. La aceleración centrípeta es v²/r.'),
      ];
      if (diam) errores.unshift(h('CI-diametro-por-radio', vv * vv / (2 * r), 'Usaste el diámetro donde va el radio: el radio es la mitad del diámetro.'));
      else errores.push(h('CI-radio-por-diametro', vv * vv / (2 * r), 'Dividiste entre 2r, como si el dato fuera el diámetro. El dato es el radio: acp = v²/r.'));
      const solucion = [
        ...(diam ? [['El radio es la mitad del diámetro: ', v('r', `r = ${f(r)} m`), '.']] : []),
        [v('a', 'acp'), ' = ', v('vv', 'v'), '²/', v('r', 'r'), ` = ${f(vv)}²/${f(r)} = ${f(vv * vv)}/${f(r)} = `, v('a', texto(correcta)), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto, unidad: 'm/s²', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'acp', sub, v: vv, r, diametro: diam } });
    }
    const w = rng.elegir([2, 3, 4, 5, 6, 8, 10]), rcm = rng.elegir([10, 20, 25, 30, 40, 50]);
    const r = rcm / 100, correcta = w * w * r;
    if (!corto(correcta) || correcta > 60) return null;
    const [Obj] = rng.elegir(OBJ.slice(0, 3));
    const enunciado = [`${Obj} gira con rapidez angular constante de `, v('vv', `${w} rad/s`), '. Una marca está pintada a ', v('r', `${rcm} cm`), ' del eje.'];
    const pregunta2 = ['¿Cuál es el módulo de la ', v('a', 'aceleración centrípeta'), ' de la marca?'];
    const errores = [
      h('acp-sin-cuadrado', w * r, 'Multiplicaste ω por el radio sin elevar ω al cuadrado: eso es la rapidez de la marca, en m/s. acp = ω²·r.'),
      h('CI-cuadrado-al-radio', w * r * r, 'Elevaste al cuadrado el radio en vez de ω: acp = ω²·r.'),
      h('acp-por-radio', w * w / r, 'Dividiste entre el radio. Con ω, el radio multiplica: acp = ω²·r (es v²/r con v = ω·r).'),
      h('CI-unidades-sin-convertir', w * w * rcm, 'Dejaste el radio en centímetros: así la aceleración sale en cm/s², no en m/s².'),
    ];
    const solucion = [
      ['El radio en metros: ', v('r', `${rcm} cm = ${f(r)} m`), '.'],
      [v('a', 'acp'), ' = ', v('vv', 'ω'), '²·', v('r', 'r'), ` = ${w}² · ${f(r)} = `, v('a', texto(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto, unidad: 'm/s²', variables, enunciado, pregunta: pregunta2, solucion,
      datos: { tipo: 'acp', sub, omega: w, rcm } });
  }

  // ---- vueltas ----
  function vueltas(rng, semilla) {
    const [Obj, obj] = rng.elegir(OBJ);
    const modo = rng.elegir(['pi-min', 'rpm-s']);
    const variables = { w: { nombre: 'rapidez de giro', color: 'o' }, t: { nombre: 'tiempo', color: 'i' }, n: { nombre: 'vueltas', color: 'd' } };
    const pregunta = [`¿Cuántas `, v('n', 'vueltas'), ` da ${obj} en ese tiempo?`];
    if (modo === 'pi-min') {
      const k = rng.elegir([0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10]), tm = rng.elegir([1, 2, 3, 5]);
      const correcta = k / 2 * 60 * tm;
      const wTxt = P.pi(k * PI, 'rad/s');
      const tTxt = `${tm} ${tm === 1 ? 'minuto' : 'minutos'}`;
      const enunciado = [`${Obj} gira con rapidez angular constante de `, v('w', wTxt), ' durante ', v('t', tTxt), '.'];
      const errores = [
        h('CI-unidades-sin-convertir', k / 2 * tm, 'Usaste los minutos como si fueran segundos. ω está en rad por segundo: el tiempo va en segundos.'),
        h('vueltas-sin-2pi', k * 60 * tm, 'Tomaste π rad como una vuelta. Una vuelta son 2π rad: hay que dividir el ángulo entre 2π.'),
        h('CI-unidades-sin-convertir', k / 2 * 3600 * tm, 'Multiplicaste por 60 dos veces: los minutos se pasan a segundos una sola vez.'),
      ];
      const solucion = [
        ['El tiempo en segundos: ', v('t', `${tTxt} = ${60 * tm} s`), '.'],
        ['Ángulo girado: θ = ω·t = ', v('w', wTxt), ` · ${60 * tm} s = ${P.pi(k * PI * 60 * tm, 'rad')}.`],
        ['Cada vuelta son 2π rad: ', v('n', 'vueltas'), ` = ${P.pi(k * PI * 60 * tm)}/(2π) = `, v('n', vueltasTxt(correcta)), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: vueltasTxt, unidad: 'vueltas', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'vueltas', modo, k, minutos: tm } });
    }
    const N = rng.elegir(RPM), t = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30]);
    const correcta = N * t / 60;
    if (!corto(correcta)) return null;
    const enunciado = [`${Obj} gira a `, v('w', `${N} rpm`), ' durante ', v('t', `${t} s`), '.'];
    const errores = [
      h('CI-rpm-sin-60', N * t, 'Multiplicaste las rpm por los segundos. Las rpm son vueltas por minuto: hay que dividir entre 60 para tener vueltas por segundo.'),
      h('vueltas-sin-2pi', N * t / 30, 'Pasaste a rad/s y luego dividiste entre π. Una vuelta son 2π rad: hay que dividir entre 2π.'),
      h('CI-rpm-sin-2pi', N * t / 120, 'Pasaste a rad/s multiplicando por π en vez de 2π, y luego dividiste entre 2π. Lo más simple: vueltas por segundo por los segundos.'),
      h('CI-unidades-sin-convertir', N * t / 3600, 'Dividiste entre 60 dos veces: las rpm ya están por minuto, y basta dividir una vez para tenerlas por segundo.'),
    ];
    const solucion = [
      [v('w', `${N} rpm`), ` son ${N} vueltas en 60 s: ${f(N / 60)} ${N === 60 ? 'vuelta' : 'vueltas'} por segundo.`],
      ['En ', v('t', `${t} s`), ': ', v('n', 'vueltas'), ` = ${f(N / 60)} · ${t} = `, v('n', vueltasTxt(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: vueltasTxt, unidad: 'vueltas', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'vueltas', modo, rpm: N, t } });
  }

  // ---- rigido: dos puntos del mismo disco ----
  function rigido(rng, semilla) {
    const sub = rng.elegir(['rapidez', 'razon', 'diferencia']);
    const variables = { A: { nombre: 'punto A', color: 'o' }, B: { nombre: 'punto B', color: 'i' }, d: { nombre: 'distancias', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'rapidez') {
      const rA = rng.elegir([5, 10, 15, 20, 25, 30, 40]), rB = rng.elegir([5, 10, 15, 20, 25, 30, 40, 50, 60]);
      const vA = rng.elegir([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.4, 3]);
      if (rA === rB) return null;
      const correcta = vA * rB / rA;
      if (!corto(correcta) || correcta > 20) return null;
      const texto = x => `${f(x)} m/s`;
      const enunciado = ['Un disco gira con rapidez angular constante. Una marca ', v('A', 'A'), ', a ', v('d', `${rA} cm`), ' del eje, se mueve a ', v('A', `${f(vA)} m/s`),
        '. Otra marca ', v('B', 'B'), ' está a ', v('d', `${rB} cm`), ' del eje.'];
      const pregunta = ['¿Con qué ', v('x', 'rapidez'), ' se mueve ', v('B', 'B'), '?'];
      const errores = [
        h('v-igual-en-eje', vA, 'Tomaste la misma rapidez para las dos marcas. En un mismo disco, todas giran con la misma ω; la rapidez v = ω·r crece con la distancia al eje.'),
        h('CI-razon-inversa', vA * rA / rB, rB > rA ? 'Usaste la razón de distancias al revés: B está más lejos del eje que A, así que va más rápido, no más lento.' : 'Usaste la razón de distancias al revés: B está más cerca del eje que A, así que va más lento, no más rápido.'),
        h('radio-al-cuadrado', vA * (rB / rA) ** 2, 'Elevaste al cuadrado la razón de distancias. La rapidez es proporcional a la distancia al eje, sin cuadrado.'),
        h('CI-suma-de-distancias', vA * (rA + rB) / rA, `Multiplicaste por (${rA} + ${rB})/${rA}, como si la marca B estuviera a ${rB} cm de A y no del eje.`),
      ];
      const w = vA / (rA / 100);
      const solucion = [
        ['Las dos marcas giran juntas: tienen la misma ω. ω = ', v('A', 'vA'), '/', v('d', 'rA'), ` = ${f(vA)}/${f(rA / 100)} = ${f(w)} rad/s.`],
        [v('x', 'vB'), ` = ω·rB = ${f(w)} · ${f(rB / 100)} = `, v('x', texto(correcta)), ` (o, directo: ${f(vA)} · ${rB}/${rA}).`],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto, unidad: 'm/s', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'rigido', sub, rA, rB, vA } });
    }
    if (sub === 'razon') {
      const R = rng.elegir([20, 24, 30, 36, 40, 45, 50, 60]), dB = rng.elegir([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 25, 30]);
      if (dB >= R) return null;
      const rB = R - dB, correcta = R / rB;
      if (!corto(correcta) || correcta === 2) return null;
      const texto = f;
      const enunciado = ['Un disco de ', v('d', `${R} cm`), ' de radio gira con rapidez angular constante. La marca ', v('A', 'A'), ' está en el borde y la marca ', v('B', 'B'),
        ' está a ', v('d', `${dB} cm`), ' del borde, sobre el mismo radio.'];
      const pregunta = ['¿Cuántas veces la ', v('x', 'rapidez de A'), ' es la rapidez de ', v('B', 'B'), '?'];
      const errores = [
        h('v-igual-en-eje', 1, 'Las dos marcas giran con la misma ω, pero no van igual de rápido: v = ω·r, y B está más cerca del eje.'),
        h('CI-distancia-al-borde', R / dB, `Usaste ${dB} cm como si fuera la distancia de B al eje. Esa es su distancia al borde: B está a ${R} − ${dB} = ${rB} cm del eje.`),
        h('radio-al-cuadrado', correcta * correcta, 'Elevaste al cuadrado la razón de distancias. La rapidez es proporcional a la distancia al eje, sin cuadrado.'),
        h('CI-razon-inversa', rB / R, 'Diste la razón al revés: esa es vB/vA. A está en el borde, más lejos del eje, y va más rápido.'),
      ];
      const solucion = [
        ['Distancia de ', v('B', 'B'), ' al eje: ', v('d', `${R} − ${dB} = ${rB} cm`), '.'],
        ['Misma ω para las dos: ', v('x', 'vA/vB'), ` = rA/rB = ${R}/${rB} = `, v('x', texto(correcta)), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto, unidad: '', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'rigido', sub, R, dB } });
    }
    // diferencia: ω con dos rapideces y la separación
    const d = rng.elegir([10, 15, 20, 25, 30, 40, 50]), w = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12]);
    const rA = rng.elegir([5, 10, 15, 20, 25, 30]);
    const vA = w * rA / 100, vB = w * (rA + d) / 100;
    if (!corto(vA) || !corto(vB)) return null;
    const texto = x => `${f(x)} rad/s`;
    const enunciado = ['Dos marcas, ', v('A', 'A'), ' y ', v('B', 'B'), ', están sobre un mismo radio de un disco que gira con rapidez angular constante, separadas ', v('d', `${d} cm`),
      '. ', v('A', 'A'), ' se mueve a ', v('A', `${f(vA)} m/s`), ' y ', v('B', 'B'), ', que está más lejos del eje, a ', v('B', `${f(vB)} m/s`), '.'];
    const pregunta = ['¿Cuál es la ', v('x', 'rapidez angular'), ' del disco?'];
    const errores = [
      h('CI-sin-restar', vB / (d / 100), `Dividiste la rapidez de B entre la separación, como si B estuviera a ${d} cm del eje. B está más lejos que eso: los ${d} cm explican solo la diferencia, vB − vA = ω·d.`),
      h('CI-suma-en-vez-de-resta', (vA + vB) / (d / 100), 'Sumaste las rapideces. La separación entre las marcas explica cuánto más rápido va B: vB − vA = ω·d.'),
      h('CI-unidades-sin-convertir', (vB - vA) / d, 'Dejaste la separación en centímetros. Con v en m/s, la distancia va en metros.'),
      h('CI-sin-restar', vA / (d / 100), `Dividiste la rapidez de A entre la separación, como si A estuviera a ${d} cm del eje. Los ${d} cm separan a A de B, no a A del eje: explican la diferencia, vB − vA = ω·d.`),
    ];
    const solucion = [
      ['Misma ω: ', v('B', 'vB'), ' − ', v('A', 'vA'), ' = ω·(rB − rA) = ω·', v('d', 'd'), '.'],
      [v('x', 'ω'), ` = (${f(vB)} − ${f(vA)})/${f(d / 100)} = ${f(vB - vA)}/${f(d / 100)} = `, v('x', texto(w)), '.'],
    ];
    return cerrar(rng, semilla, { correcta: w, errores, texto, unidad: 'rad/s', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'rigido', sub, d, vA, vB } });
  }

  // ---- latitud ----
  const COS = { 37: 0.8, 53: 0.6, 60: 0.5 };
  const SEN = { 37: 0.6, 53: 0.8, 60: null };
  function latitud(rng, semilla) {
    const lam = rng.elegir([37, 53, 60]);
    const tierra = rng.moneda();
    let R, T, u;
    if (tierra) { R = 6400; T = 24; u = 'km/h'; }
    else { R = rng.elegir([20, 25, 30, 40, 50]); T = rng.elegir([2, 4, 5, 8, 10]); u = 'cm/s'; }
    const ecuador = 2 * PI * R / T;
    const correcta = ecuador * COS[lam];
    if (!P.pi(correcta) || !P.pi(ecuador)) return null;
    const texto = x => piTxt(x, u);
    const variables = { R: { nombre: 'radio de la esfera', color: 'o' }, l: { nombre: 'latitud', color: 'i' }, r: { nombre: 'radio del círculo del punto', color: 'h' }, vv: { nombre: 'rapidez del punto', color: 'd' } };
    const enunciado = tierra
      ? ['Toma la Tierra como una esfera de ', v('R', '6 400 km'), ' de radio que da una vuelta cada 24 h. Una ciudad está a ', v('l', `${lam}°`), ' de latitud.']
      : ['Un globo terráqueo de ', v('R', `${R} cm`), ` de radio gira alrededor de su eje y da una vuelta cada ${T} s. Sobre él hay una marca a `, v('l', `${lam}°`), ' de latitud.'];
    const pregunta = tierra ? ['¿Con qué ', v('vv', 'rapidez'), ' se mueve la ciudad por el giro de la Tierra?'] : ['¿Con qué ', v('vv', 'rapidez'), ' se mueve la marca?'];
    const errores = [
      h('CI-latitud-sin-coseno', ecuador, 'Usaste el radio de la esfera. El punto gira en un círculo más chico, paralelo al ecuador, de radio R·cos λ.'),
      h('CI-latitud-entre-coseno', ecuador / COS[lam], 'Dividiste entre cos λ. El círculo del punto es más chico que el ecuador: su radio es R·cos λ.'),
      h('CI-omega-con-coseno', ecuador * COS[lam] ** 2, 'Multiplicaste por cos λ dos veces, como si también ω fuera menor. Todos los puntos de la esfera giran con la misma ω; solo cambia el radio.'),
    ];
    if (SEN[lam]) errores.splice(1, 0, { id: 'TR9-sen-cos-cambiados', valor: ecuador * SEN[lam], respaldo: 'parcial', fuente: 'docs/investigacion/trigonometria-ideas-erroneas.md',
      explicacion: 'Usaste el seno de la latitud. La latitud se mide desde el ecuador: el radio del círculo del punto es R·cos λ.' });
    const r = R * COS[lam];
    const solucion = [
      ['El punto gira en un círculo paralelo al ecuador, de radio ', v('r', 'r'), ' = ', v('R', 'R'), '·cos ', v('l', `${lam}°`), ` = ${f(R)} · ${f(COS[lam])} = ${f(r)} ${tierra ? 'km' : 'cm'}.`],
      ['Da una vuelta (2πr) cada ', `${T} ${tierra ? 'h' : 's'}: `, v('vv', 'v'), ` = 2π · ${f(r)}/${T} = `, v('vv', texto(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { pi: true, correcta, errores, texto, unidad: u, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'latitud', tierra, R, T, lambda: lam } });
  }

  return { id: 'circular-mcu', titulo: 'Rpm, radianes y puntos que giran juntos', generar };
});
