/*
 * Generador «El foco que calienta»: efecto Joule, resistividad y carga eléctrica, con las
 * conversiones de unidades que más se equivocan en la admisión. Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['circuitos-joule']) y en
 * Node (require). No usa ningún motor.
 *
 * Tipos y subtipos:
 *   joule
 *     energia    E = I²·R·t con la corriente en mA y el tiempo en minutos; respuesta en J o kJ
 *     corriente  la corriente conocidos la energía (J o kJ), R y t (s o min)
 *     escala     a corriente fija, R y t cambian por factores: el calor nuevo
 *     kwh        aparato de potencia P usado h horas al día durante N días: energía en kW·h
 *     calorias   E = I²·R·t pasado a calorías (1 J = 0,24 cal)
 *   agua         hervidor de resistencia R a 220 V con eficiencia η: minutos para calentar agua
 *                (c = 1 cal/(g·°C), 1 cal = 4,2 J)
 *   resistividad (π = 3, como en muchas academias, para que las cuentas salgan a mano)
 *     diametro   R = ρL/A con el diámetro en mm
 *     mm2        R = ρL/A con la sección en mm²
 *     rho        ρ = R·A/L con el radio en mm; respuesta en notación científica
 *     estirado   alambre estirado n veces más largo (mismo volumen): R nueva
 *     doblado    alambre doblado en k tramos iguales unidos lado a lado: R nueva
 *   cables       calentador alimentado por un cable de dos hilos (ida y vuelta) de resistividad ρ
 *     calentador la potencia que llega al calentador
 *     perdida    la potencia que se pierde en el cable
 *   carga
 *     carga      Q = I·t con I en mA y t en min: en C
 *     tiempo     t = Q/I con I en mA: en min
 *     duracion   n pilas ideales en serie alimentan un aparato de resistencia R y pueden mover
 *                una carga Q: cuántas horas duran
 *
 * Errores: U2, U3, U5, U6, PR1, PR4 y PR6 de docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md
 * (hipótesis, con sufijo: U2-mA, U6-min, PR6-diametro…); JO-*, RES-*, CAB-* y PI-no-suma-fem,
 * hipótesis nuestras (docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md, sección
 * «Lo que no tiene respaldo»: energía contra potencia, minutos en vez de segundos).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const EM = 'docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md';
  const TR = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const tr = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: TR });
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: EM });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const limpio = (x, dec = 2) => Number.isFinite(x) && x > 0 && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7 * Math.max(1, x);

  // Notación científica: «1,8 × 10⁻⁸».
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function cien(x) {
    let e = Math.floor(Math.log10(x)), m = Math.round(x / 10 ** e * 100) / 100;
    if (m >= 10) { m /= 10; e++; }
    return `${f(m)} × 10${String(e).split('').map(c => SUP[c]).join('')}`;
  }
  // Valores normales con coma; muy chicos o muy grandes, en notación científica.
  const num = x => (x >= 0.01 && x < 1e7 ? f(x) : cien(x));
  const conUnidad = u => x => `${num(x)} ${u}`;

  const FACTOR = { 2: 'el doble', 3: 'el triple', 4: 'el cuádruple', 0.5: 'la mitad' };

  function generar(semilla) {
    const rng = Azar.crear('circuitos-joule|' + semilla);
    const [tipo, sub] = rng.elegir([
      ['joule', 'energia'], ['joule', 'energia'], ['joule', 'corriente'], ['joule', 'corriente'], ['joule', 'escala'], ['joule', 'kwh'], ['joule', 'calorias'],
      ['agua', 'agua'], ['agua', 'agua'],
      ['resistividad', 'diametro'], ['resistividad', 'diametro'], ['resistividad', 'mm2'], ['resistividad', 'rho'], ['resistividad', 'rho'], ['resistividad', 'estirado'], ['resistividad', 'doblado'],
      ['cables', 'calentador'], ['cables', 'calentador'], ['cables', 'perdida'],
      ['carga', 'carga'], ['carga', 'tiempo'], ['carga', 'duracion'], ['carga', 'duracion']]);
    const fn = { joule, agua, resistividad, cables, carga }[tipo];
    for (let intento = 0; intento < 5000; intento++) {
      const pr = fn(rng, semilla, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cerrar(rng, semilla, o) {
    const texto = o.texto || conUnidad(o.unidad);
    const errores = o.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && e.valor < 1e12);
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto });
    return {
      id: `circuitos-joule#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  const VJ = { i: { nombre: 'corriente', color: 'i' }, r: { nombre: 'resistencia', color: 'h' }, t: { nombre: 'tiempo', color: 'o' }, x: { nombre: 'lo que se pide', color: 'd' } };
  const APARATO = ['Una terma', 'Un calentador', 'Una plancha', 'Un hervidor', 'Una estufa eléctrica'];

  // ---------------- joule ----------------
  function joule(rng, semilla, sub) {
    if (sub === 'energia') {
      const ImA = rng.elegir([100, 200, 250, 300, 400, 500, 800]), R = rng.elegir([10, 20, 25, 40, 50, 100]), tmin = rng.elegir([1, 2, 3, 5, 10, 15, 20, 30]);
      const I = ImA / 1000, ts = 60 * tmin, E = I * I * R * ts;
      const kilo = E >= 10000, k = kilo ? 1 / 1000 : 1, unidad = kilo ? 'kJ' : 'J', correcta = E * k;
      if (!limpio(correcta)) return null;
      const enunciado = ['Por una resistencia de ', v('r', `${f(R)} Ω`), ' pasa una corriente de ', v('i', `${f(ImA)} mA`), ' durante ', v('t', `${f(tmin)} min`), '.'];
      const pregunta = ['¿Cuánta ', v('x', 'energía'), ` disipa como calor? (Respuesta en ${unidad}.)`];
      const errores = [
        tr('PR1-cuadrado', I * R * ts * k, 'Multiplicaste I·R·t sin elevar la corriente al cuadrado. La energía disipada es E = I²·R·t.'),
        tr('U6-min', I * I * R * tmin * k, `Usaste el tiempo en minutos. Con I en A y R en Ω, el tiempo va en segundos: ${f(tmin)} min = ${f(ts)} s.`),
        tr('U2-mA', ImA * ImA * R * ts * k, `Usaste la corriente en mA como si fueran amperios. ${f(ImA)} mA = ${f(I)} A.`),
        tr('PR1-doble', 2 * I * R * ts * k, 'Pusiste 2·I en lugar de I². Elevar al cuadrado es multiplicar la corriente por sí misma.'),
      ];
      if (kilo) errores.push(tr('U2-kilo', E, 'Calculaste la energía en joules y la escribiste como si fueran kilojoules. Para pasar a kJ se divide entre 1000.'));
      const solucion = [
        ['Pasa a unidades del SI: ', v('i', `I = ${f(ImA)} mA = ${f(I)} A`), ' y ', v('t', `t = ${f(tmin)} min = ${f(ts)} s`), '.'],
        [v('x', 'E'), ' = ', v('i', 'I'), '²·', v('r', 'R'), '·', v('t', 't'), ` = ${f(I)}² · ${f(R)} · ${f(ts)} = `, kilo ? `${f(E)} J = ` : '', v('x', `${f(correcta)} ${unidad}`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad, variables: VJ, enunciado, pregunta, solucion, datos: { tipo: 'joule', sub, ImA, R, tmin, unidad } });
    }
    if (sub === 'corriente') {
      const I = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), R = rng.elegir([2, 4, 5, 10, 20, 50]);
      const enMin = rng.moneda(), tdado = enMin ? rng.elegir([1, 2, 5, 10]) : rng.elegir([10, 20, 30, 50, 100]);
      const ts = enMin ? 60 * tdado : tdado, E = I * I * R * ts;
      const kilo = E >= 1000, Edado = kilo ? E / 1000 : E;
      if (!limpio(Edado)) return null;
      const ut = enMin ? 'min' : 's';
      const ap = rng.elegir(APARATO);
      const enunciado = [`${ap} de resistencia `, v('r', `${f(R)} Ω`), ' disipa ', v('x', `${f(Edado)} ${kilo ? 'kJ' : 'J'}`), ' de calor en ', v('t', `${f(tdado)} ${ut}`), '.'];
      const pregunta = ['¿Qué ', v('i', 'corriente'), ' pasa por él?'];
      const errores = [
        tr('PR1-raiz', E / (R * ts), 'Despejaste E/(R·t) y no sacaste la raíz. En E = I²·R·t la corriente está al cuadrado: I = √(E/(R·t)).'),
        h('JO-sin-tiempo', Math.sqrt(E / R), 'Olvidaste dividir entre el tiempo. E es energía (J), no potencia: I²·R = E/t.'),
      ];
      if (enMin) errores.push(tr('U6-min', Math.sqrt(E / (R * tdado)), `Usaste el tiempo en minutos. Va en segundos: ${f(tdado)} min = ${f(ts)} s.`));
      if (kilo) errores.push(tr('U2-kilo', Math.sqrt(Edado / (R * ts)), `Usaste la energía en kJ como si fueran joules. ${f(Edado)} kJ = ${f(E)} J.`));
      errores.push(tr('PR1-raiz', Math.sqrt(E / R) / ts, 'Sacaste la raíz antes de dividir entre el tiempo, y el tiempo quedó fuera de la raíz. Despeja primero I² = E/(R·t) y recién saca la raíz.'));
      const solucion = [
        [`Energía en J: ${f(E)} J. Tiempo en s: `, v('t', `${f(ts)} s`), '.'],
        ['De E = I²·R·t: ', v('i', 'I'), ' = √(E/(R·t)) = ', `√(${f(E)}/(${f(R)} · ${f(ts)})) = √${f(I * I)} = `, v('i', `${f(I)} A`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: I, errores, unidad: 'A', variables: { ...VJ, x: { nombre: 'energía', color: 'd' } }, enunciado, pregunta, solucion,
        datos: { tipo: 'joule', sub, E: Edado, kilo, R, t: tdado, ut } });
    }
    if (sub === 'escala') {
      const Q0 = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12]), a = rng.elegir([2, 3, 0.5]), b = rng.elegir([2, 3, 4]);
      const correcta = Q0 * a * b;
      const ap = rng.elegir(APARATO);
      const enunciado = [`${ap} funciona con una `, v('i', 'corriente constante'), ` (su fuente la mantiene fija) y en cierto tiempo disipa ${f(Q0)} kJ. Se cambia su resistencia por otra que es `,
        v('r', `${FACTOR[a]} de la anterior`), ', con la misma corriente, y se le deja funcionando ', v('t', `${FACTOR[b]} de tiempo`), '.'];
      const pregunta = ['¿Cuánto ', v('x', 'calor'), ' disipa ahora?'];
      const errores = [
        h('JO-voltaje-fijo', Q0 * b / a, 'Usaste E = V²·t/R, como si el voltaje fuera fijo. Aquí lo fijo es la corriente: con E = I²·R·t, el calor crece con R.'),
        tr('PR1-cuadrado', Q0 * a * a * b, 'Elevaste al cuadrado el factor de la resistencia. En E = I²·R·t lo que va al cuadrado es la corriente, que no cambia.'),
        h('JO-solo-tiempo', Q0 * b, 'Solo tomaste en cuenta el cambio de tiempo. La resistencia también cambió y, con la misma corriente, el calor es proporcional a R.'),
        h('JO-solo-resistencia', Q0 * a, 'Solo tomaste en cuenta el cambio de resistencia. El tiempo también cambió: el calor es proporcional a t.'),
        h('JO-voltaje-fijo', Q0, 'Pensaste que el calor no cambia. Eso pasaría con el voltaje fijo y los dos factores iguales; aquí lo fijo es la corriente.'),
      ];
      const solucion = [
        ['Con la misma ', v('i', 'corriente'), ', E = I²·', v('r', 'R'), '·', v('t', 't'), ' es proporcional a R y a t.'],
        [v('x', 'E'), ` = ${f(Q0)} · ${f(a)} · ${f(b)} = `, v('x', `${f(correcta)} kJ`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'kJ', variables: VJ, enunciado, pregunta, solucion, datos: { tipo: 'joule', sub, Q0, a, b } });
    }
    if (sub === 'kwh') {
      const Pw = rng.elegir([60, 100, 500, 800, 1000, 1200, 1500, 2000]), hd = rng.elegir([0.5, 1, 2, 3, 4, 5, 6, 8]), dias = rng.elegir([10, 15, 20, 30]);
      const correcta = Pw * hd * dias / 1000;
      if (!limpio(correcta)) return null;
      const ap = Pw <= 100 ? 'Un foco' : rng.elegir(APARATO);
      const enunciado = [`${ap} de `, v('i', `${f(Pw)} W`), ' se usa ', v('t', `${f(hd)} h al día`), ` durante ${dias} días.`];
      const pregunta = ['¿Cuánta ', v('x', 'energía'), ' consume en ese tiempo, en kW·h?'];
      const errores = [
        tr('U2-kilo', Pw * hd * dias, 'Te quedó en W·h: falta dividir entre 1000 para pasar a kW·h.'),
        tr('U6-s', Pw * hd * 3600 * dias / 1000, 'Pasaste las horas a segundos. El kW·h ya trae la hora: la potencia en kW por el tiempo en horas.'),
        h('JO-un-dia', Pw * hd / 1000, `Calculaste el consumo de un solo día. Son ${dias} días.`),
        tr('U6-min', Pw * hd * 60 * dias / 1000, 'Pasaste las horas a minutos. Para el kW·h el tiempo va en horas.'),
      ];
      const solucion = [
        ['Potencia en kW: ', v('i', `${f(Pw / 1000)} kW`), '. Tiempo total: ', v('t', `${f(hd)} · ${dias} = ${f(hd * dias)} h`), '.'],
        [v('x', 'E'), ` = ${f(Pw / 1000)} · ${f(hd * dias)} = `, v('x', `${f(correcta)} kW·h`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'kW·h', variables: { ...VJ, i: { nombre: 'potencia', color: 'i' } }, enunciado, pregunta, solucion, datos: { tipo: 'joule', sub, P: Pw, hd, dias } });
    }
    // calorias
    const I = rng.elegir([1, 2, 3, 4, 5]), R = rng.elegir([5, 10, 20, 25, 50]);
    const enMin = rng.moneda(), tdado = enMin ? rng.elegir([1, 2, 5]) : rng.elegir([10, 20, 25, 50, 100]);
    const ts = enMin ? 60 * tdado : tdado, E = I * I * R * ts, correcta = 0.24 * E;
    if (!limpio(correcta)) return null;
    const ut = enMin ? 'min' : 's';
    const enunciado = ['Una resistencia de ', v('r', `${f(R)} Ω`), ' sumergida en agua lleva una corriente de ', v('i', `${f(I)} A`), ' durante ', v('t', `${f(tdado)} ${ut}`), '. Usa 1 J = 0,24 cal.'];
    const pregunta = ['¿Cuántas ', v('x', 'calorías'), ' entrega al agua?'];
    const errores = [
      tr('U5-sin-convertir', E, 'Esos son joules, no calorías. Falta multiplicar por 0,24.'),
      tr('U5-al-reves', E / 0.24, 'Dividiste entre 0,24. Como 1 J = 0,24 cal, para pasar de joules a calorías se multiplica por 0,24.'),
      tr('PR1-cuadrado', 0.24 * I * R * ts, 'No elevaste la corriente al cuadrado: E = I²·R·t.'),
    ];
    if (enMin) errores.push(tr('U6-min', 0.24 * I * I * R * tdado, `Usaste el tiempo en minutos. Va en segundos: ${f(tdado)} min = ${f(ts)} s.`));
    else errores.push(tr('PR1-doble', 0.24 * 2 * I * R * ts, 'Pusiste 2·I en lugar de I². Elevar al cuadrado es multiplicar la corriente por sí misma.'));
    const solucion = [
      [enMin ? `Tiempo en s: ${f(ts)} s. ` : '', 'E = ', v('i', 'I'), '²·', v('r', 'R'), '·', v('t', 't'), ` = ${f(I)}² · ${f(R)} · ${f(ts)} = ${f(E)} J.`],
      ['En calorías: ', v('x', `${f(E)} · 0,24 = ${f(correcta)} cal`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'cal', variables: VJ, enunciado, pregunta, solucion, datos: { tipo: 'joule', sub, I, R, t: tdado, ut } });
  }

  // ---------------- agua ----------------
  function agua(rng, semilla) {
    const R = rng.elegir([22, 24.2, 44, 48.4, 55]), V = 220, Pw = V * V / R;
    const eta = rng.elegir([100, 90, 84, 80, 75, 70]), m = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3]);
    const T1 = rng.elegir([10, 12, 15, 18, 20]), T2 = rng.elegir([50, 60, 70, 80, 90]), dT = T2 - T1;
    const Q = m * 1000 * dT * 4.2, ts = Q / (eta / 100 * Pw), correcta = ts / 60;
    if (!limpio(correcta) || !limpio(Pw)) return null;
    const enunciado = ['Un hervidor eléctrico de resistencia ', v('r', `${f(R)} Ω`), ' se conecta a ', v('i', `${V} V`), ` y aprovecha el ${eta} % de su energía para calentar `,
      v('t', `${f(m)} L de agua de ${T1} °C a ${T2} °C`), '. Calor específico del agua: 1 cal/(g·°C); 1 cal = 4,2 J; 1 L de agua tiene 1 kg.'];
    const pregunta = ['¿Cuántos ', v('x', 'minutos'), ' tarda?'];
    const errores = [
      tr('U5-sin-convertir', correcta / 4.2, 'Dejaste el calor en calorías y lo dividiste entre una potencia en watts (J/s). Primero pasa las calorías a joules: × 4,2.'),
      h('JO-eficiencia-al-reves', correcta * (eta / 100) ** 2, `Multiplicaste la potencia por 100/${eta} en vez de por ${eta}/100. Solo llega al agua el ${eta} % de la potencia: la útil es menor, así que tarda más.`),
      h('JO-sin-eficiencia', correcta * eta / 100, `Usaste toda la potencia del hervidor. Solo el ${eta} % llega al agua.`),
      h('JO-temperatura-final', correcta * T2 / dT, `Usaste la temperatura final (${T2} °C) en vez del cambio de temperatura (${dT} °C).`),
      tr('U6-s', ts, 'Ese es el tiempo en segundos. Para minutos, divide entre 60.'),
    ];
    const solucion = [
      ['Potencia: P = ', v('i', 'V'), '²/', v('r', 'R'), ` = ${V}²/${f(R)} = ${f(Pw)} W. Útil: ${eta} % de eso = ${f(eta / 100 * Pw)} W.`],
      ['Calor para el agua: ', v('t', `${f(m * 1000)} g · 1 · ${dT} °C`), ` = ${f(m * 1000 * dT)} cal = ${f(Q)} J.`],
      [v('x', 't'), ` = ${f(Q)}/${f(eta / 100 * Pw)} = ${f(ts)} s = `, v('x', `${f(correcta)} min`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'min', variables: { i: { nombre: 'voltaje', color: 'i' }, r: { nombre: 'resistencia', color: 'h' }, t: { nombre: 'agua', color: 'o' }, x: { nombre: 'tiempo', color: 'd' } },
      enunciado, pregunta, solucion, datos: { tipo: 'agua', sub: 'agua', R, V, eta, m, T1, T2 } });
  }

  // ---------------- resistividad ----------------
  const VRHO = { p: { nombre: 'resistividad', color: 'o' }, l: { nombre: 'longitud', color: 'i' }, a: { nombre: 'sección', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  const OBJR = ['un alambre', 'una barra cilíndrica', 'un cable'];
  function resistividad(rng, semilla, sub) {
    if (sub === 'estirado' || sub === 'doblado') {
      const R0 = rng.elegir([2, 3, 4, 5, 6, 8, 9, 12, 16, 18, 20, 36]), n = rng.elegir([2, 3]);
      const est = sub === 'estirado', correcta = est ? n * n * R0 : R0 / (n * n);
      if (!limpio(correcta)) return null;
      const enunciado = est
        ? ['Un alambre tiene una resistencia de ', v('p', `${f(R0)} Ω`), '. Se estira de modo que su ', v('l', `longitud se hace ${n === 2 ? 'el doble' : 'el triple'}`), ' (su volumen no cambia, así que se adelgaza).']
        : ['Un alambre tiene una resistencia de ', v('p', `${f(R0)} Ω`), '. Se dobla en ', v('l', `${n} tramos iguales`), ' que se unen lado a lado, como un solo alambre más corto y más grueso.'];
      const pregunta = ['¿Cuál es su nueva ', v('x', 'resistencia'), '?'];
      const errores = est ? [
        tr('PR1-cuadrado', n * R0, `Solo contaste que el largo crece ${n} veces. Como el volumen no cambia, la sección también se hace ${n} veces menor: R crece ${n}·${n} = ${n * n} veces.`),
        tr('PR4-seccion', R0 / n, 'Invertiste la proporción: la resistencia crece con la longitud y baja con la sección. Al estirarlo, las dos cosas la hacen subir.'),
        h('RES-no-cambia', R0, 'Es el mismo metal y la misma cantidad, pero la resistencia no depende solo del material: depende de su largo y de su sección, R = ρL/A.'),
        tr('PR1-cubo', n * n * n * R0, `Elevaste al cubo. El largo multiplica R por ${n} y la sección menor la multiplica por otro ${n}: ${n * n} veces.`),
      ] : [
        tr('PR1-cuadrado', R0 / n, `Solo contaste que el largo es ${n} veces menor. La sección también es ${n} veces mayor: R baja ${n}·${n} = ${n * n} veces.`),
        tr('PR4-seccion', n * R0, 'Invertiste la proporción: un alambre más corto y más grueso tiene menos resistencia, no más.'),
        h('RES-no-cambia', R0, 'Es el mismo metal, pero R = ρL/A depende del largo y de la sección, y los dos cambiaron.'),
        tr('PR1-cubo', R0 / (n * n * n), `Dividiste entre ${n}³. El largo divide R entre ${n} y la sección mayor la divide entre otro ${n}: ${n * n} veces.`),
      ];
      const solucion = est ? [
        ['Con el mismo volumen, L·A no cambia: si ', v('l', `L se multiplica por ${n}`), `, A se divide entre ${n}.`],
        [v('x', 'R'), ' = ρL/A queda multiplicada por ', `${n} · ${n} = ${n * n}: ${f(R0)} · ${n * n} = `, v('x', `${f(correcta)} Ω`), '.'],
      ] : [
        ['Cada tramo mide ', v('l', `L/${n}`), ` y, al juntarlos lado a lado, la sección se hace ${n}·A.`],
        [v('x', 'R'), ' = ρL/A queda dividida entre ', `${n} · ${n} = ${n * n}: ${f(R0)}/${n * n} = `, v('x', `${f(correcta)} Ω`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'Ω', variables: { ...VRHO, p: { nombre: 'resistencia inicial', color: 'o' } }, enunciado, pregunta, solucion, datos: { tipo: 'resistividad', sub, R0, n } });
    }
    const man = rng.elegir([1.5, 1.6, 1.8, 2, 2.4, 3, 4.5, 6]), ex = rng.elegir([-8, -8, -7]), rho = man * 10 ** ex;
    const L = rng.elegir([10, 20, 30, 50, 100, 150, 200, 300]);
    const obj = rng.elegir(OBJR);
    if (sub === 'mm2') {
      const Amm = rng.elegir([0.5, 1, 1.5, 2, 2.5, 4, 6]), A = Amm * 1e-6, correcta = rho * L / A;
      if (!limpio(correcta) || correcta < 0.1 || correcta > 1e4) return null;
      const enunciado = [`${obj[0].toUpperCase() + obj.slice(1)} de `, v('l', `${f(L)} m`), ' de largo y ', v('a', `${f(Amm)} mm²`), ' de sección es de un metal de resistividad ', v('p', `${cien(rho)} Ω·m`), '.'];
      const pregunta = ['¿Cuál es su ', v('x', 'resistencia'), '?'];
      const errores = [
        tr('U3-mm2', rho * L / (Amm * 1e-3), 'Pasaste los mm² a m² dividiendo entre 1000. Un milímetro es 10⁻³ m, así que un mm² es (10⁻³)² = 10⁻⁶ m².'),
        tr('U3-mm2', rho * L / (Amm * 1e-4), 'Pasaste los mm² a m² dividiendo entre 10 000. Un mm² es (10⁻³ m)² = 10⁻⁶ m².'),
        tr('U3-sin-convertir', rho * L / Amm, 'Usaste la sección en mm² sin pasarla a m². Con ρ en Ω·m y L en m, la sección va en m²: un mm² es 10⁻⁶ m².'),
      ];
      const solucion = [
        ['Sección en m²: ', v('a', `A = ${f(Amm)} mm² = ${f(Amm)} × 10⁻⁶ m²`), '.'],
        [v('x', 'R'), ' = ', v('p', 'ρ'), '·', v('l', 'L'), '/', v('a', 'A'), ` = ${cien(rho)} · ${f(L)}/(${f(Amm)} × 10⁻⁶) = `, v('x', `${f(correcta)} Ω`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'Ω', variables: VRHO, enunciado, pregunta, solucion, datos: { tipo: 'resistividad', sub, rho, L, Amm } });
    }
    if (sub === 'diametro') {
      const d = rng.elegir([0.2, 0.4, 0.5, 1, 2, 3]), A = 3 * d * d / 4 * 1e-6, correcta = rho * L / A;
      if (!limpio(correcta) || correcta < 0.1 || correcta > 1e4) return null;
      const enunciado = [`${obj[0].toUpperCase() + obj.slice(1)} de `, v('l', `${f(L)} m`), ' de largo y ', v('a', `${f(d)} mm de diámetro`), ' es de un metal de resistividad ', v('p', `${cien(rho)} Ω·m`), '. Usa π = 3.'];
      const pregunta = ['¿Cuál es su ', v('x', 'resistencia'), '?'];
      const errores = [
        tr('PR6-diametro', correcta / 4, `Usaste el diámetro como si fuera el radio, y el área te salió 4 veces mayor. El radio es la mitad: ${f(d / 2)} mm.`),
        h('RES-circunferencia', rho * L / (3 * d * 1e-3), 'Usaste π·d, que es el contorno de la sección, no su área. El área de un círculo es π·r², con r = d/2.'),
        tr('U3-mm2', correcta / 1000, 'Pasaste los mm² a m² dividiendo entre 1000. Un mm² es (10⁻³ m)² = 10⁻⁶ m².'),
        tr('U3-sin-convertir', correcta * 1e-6, 'Usaste el área en mm² sin pasarla a m². Con ρ en Ω·m y L en m, la sección va en m²: un mm² es 10⁻⁶ m².'),
      ];
      const solucion = [
        ['Radio: ', v('a', `r = ${f(d)}/2 = ${f(d / 2)} mm`), '. Área: ', v('a', `A = 3 · ${f(d / 2)}² = ${f(3 * d * d / 4)} mm² = ${f(3 * d * d / 4)} × 10⁻⁶ m²`), '.'],
        [v('x', 'R'), ' = ', v('p', 'ρ'), '·', v('l', 'L'), '/', v('a', 'A'), ` = ${cien(rho)} · ${f(L)}/(${f(3 * d * d / 4)} × 10⁻⁶) = `, v('x', `${f(correcta)} Ω`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'Ω', variables: VRHO, enunciado, pregunta, solucion, datos: { tipo: 'resistividad', sub, rho, L, d } });
    }
    // rho: con el radio en mm
    const r = rng.elegir([0.1, 0.2, 0.5, 1, 2]), A = 3 * r * r * 1e-6, R = rho * L / A;
    if (!limpio(R) || R < 0.1 || R > 1e4) return null;
    const enunciado = [`${obj[0].toUpperCase() + obj.slice(1)} de `, v('l', `${f(L)} m`), ' de largo y ', v('a', `${f(r)} mm de radio`), ' tiene una resistencia de ', v('p', `${f(R)} Ω`), '. Usa π = 3.'];
    const pregunta = ['¿Cuál es la ', v('x', 'resistividad'), ' del material?'];
    const errores = [
      tr('PR6-radio-como-diametro', rho / 4, 'Tomaste el radio como si fuera el diámetro y el área te salió 4 veces menor. El dato es el radio: A = π·r².'),
      h('RES-circunferencia', R * (6 * r * 1e-3) / L, 'Usaste 2π·r, que es el contorno de la sección, no su área. El área de un círculo es π·r².'),
      tr('U3-mm2', rho * 1000, 'Pasaste los mm² a m² dividiendo entre 1000. Un mm² es (10⁻³ m)² = 10⁻⁶ m².'),
      tr('PR4-seccion', R * L / A, 'Despejaste al revés: de R = ρL/A sale ρ = R·A/L, no R·L/A.'),
    ];
    const solucion = [
      ['Área: ', v('a', `A = 3 · ${f(r)}² = ${f(3 * r * r)} mm² = ${f(3 * r * r)} × 10⁻⁶ m²`), '.'],
      ['De R = ρL/A: ', v('x', 'ρ'), ' = ', v('p', 'R'), '·', v('a', 'A'), '/', v('l', 'L'), ` = ${f(R)} · ${f(3 * r * r)} × 10⁻⁶/${f(L)} = `, v('x', `${cien(rho)} Ω·m`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: rho, errores, unidad: 'Ω·m', texto: x => `${cien(x)} Ω·m`, variables: { ...VRHO, p: { nombre: 'resistencia', color: 'o' } },
      enunciado, pregunta, solucion, datos: { tipo: 'resistividad', sub, R, L, r } });
  }

  // ---------------- cables ----------------
  const VCAB = { r: { nombre: 'resistencia del aparato', color: 'h' }, i: { nombre: 'voltaje y corriente', color: 'i' }, t: { nombre: 'el cable', color: 'o' }, x: { nombre: 'lo que se pide', color: 'd' } };
  function cables(rng, semilla, sub) {
    const L = rng.elegir([10, 20, 25, 40, 50, 100]), Amm = rng.elegir([0.5, 1, 1.5, 2, 2.5]), man = rng.elegir([1.5, 1.6, 1.8, 2, 2.5, 3]), rho = man * 1e-8;
    const Rcab = rho * 2 * L / (Amm * 1e-6);
    const Rc = rng.elegir([10, 11, 20, 22, 40, 44, 48, 50, 100, 110]), V = rng.elegir([110, 220]);
    const I = V / (Rc + Rcab), Pc = I * I * Rc, Pp = I * I * Rcab;
    if (!limpio(Rcab) || !limpio(I) || !limpio(Pc) || !limpio(Pp)) return null;
    const [ap, apDef] = rng.elegir([['una terma', 'a la terma'], ['un calentador', 'al calentador'], ['una estufa', 'a la estufa'], ['una bomba de agua', 'a la bomba de agua']]);
    const enunciado = [`En una chacra, ${ap} de resistencia `, v('r', `${f(Rc)} Ω`), ' se conecta a un tomacorriente de ', v('i', `${V} V`), ' mediante una extensión de ', v('t', `${f(L)} m`),
      ' de largo. La extensión tiene dos hilos (ida y vuelta), cada uno de ', v('t', `${f(Amm)} mm²`), ' de sección y resistividad ', v('t', `${cien(rho)} Ω·m`), '.'];
    const corriente = (Rcable) => V / (Rc + Rcable);
    const solucion = [
      ['Los dos hilos suman ', v('t', `2 · ${f(L)} = ${f(2 * L)} m`), `. R del cable = ${cien(rho)} · ${f(2 * L)}/(${f(Amm)} × 10⁻⁶) = ${f(Rcab)} Ω.`],
      ['Todo está en serie: ', v('i', 'I'), ` = ${V}/(${f(Rc)} + ${f(Rcab)}) = ${f(I)} A.`],
    ];
    if (sub === 'calentador') {
      const pregunta = ['¿Qué ', v('x', 'potencia'), ` le llega ${apDef}?`];
      const errores = [
        h('CAB-un-tramo', corriente(Rcab / 2) ** 2 * Rc, 'Contaste un solo hilo del cable. La corriente va por un hilo y vuelve por el otro: el largo que recorre es el doble.'),
        h('CAB-sin-cable', V * V / Rc, 'Ignoraste la resistencia del cable, como si todo el voltaje llegara al aparato. El cable largo y delgado se queda con una parte.'),
        h('CAB-potencia-total', V * V / (Rc + Rcab), 'Esa es la potencia que entrega el tomacorriente a todo el circuito, aparato y cable juntos. Al aparato le llega I²·R del aparato.'),
      ];
      solucion.push(['Al aparato: ', v('x', 'P'), ' = ', v('i', 'I'), '²·', v('r', 'R'), ` = ${f(I)}² · ${f(Rc)} = `, v('x', `${f(Pc)} W`), ` (sin el cable serían ${f(V * V / Rc)} W).`]);
      return cerrar(rng, semilla, { correcta: Pc, errores, unidad: 'W', variables: VCAB, enunciado, pregunta, solucion, datos: { tipo: 'cables', sub, L, Amm, rho, Rc, V } });
    }
    const pregunta = ['¿Qué ', v('x', 'potencia'), ' se pierde en la extensión?'];
    const errores = [
      h('CAB-todo-el-voltaje', V * V / Rcab, 'Pusiste todo el voltaje del tomacorriente sobre el cable. El cable está en serie con el aparato: le toca solo una parte del voltaje.'),
      h('CAB-un-tramo', corriente(Rcab / 2) ** 2 * Rcab / 2, 'Contaste un solo hilo del cable. La corriente va por un hilo y vuelve por el otro: el largo que recorre es el doble.'),
      h('CAB-potencia-equivocada', Pc, 'Esa es la potencia del aparato. Lo que se pierde es lo que calienta el cable: I²·R del cable.'),
      h('CAB-sin-cable', (V / Rc) ** 2 * Rcab, 'Calculaste la corriente sin el cable y luego la usaste en el cable. El cable también frena la corriente: I = V/(R del aparato + R del cable).'),
    ];
    solucion.push(['En el cable: ', v('x', 'P'), ' = ', v('i', 'I'), `² · ${f(Rcab)} = ${f(I)}² · ${f(Rcab)} = `, v('x', `${f(Pp)} W`), '.']);
    return cerrar(rng, semilla, { correcta: Pp, errores, unidad: 'W', variables: VCAB, enunciado, pregunta, solucion, datos: { tipo: 'cables', sub, L, Amm, rho, Rc, V } });
  }

  // ---------------- carga ----------------
  function carga(rng, semilla, sub) {
    if (sub === 'duracion') {
      const n = rng.elegir([2, 3, 4]), E = rng.elegir([1.5, 3]), R = rng.elegir([3, 6, 9, 12, 15, 30, 45, 60]), Q = rng.elegir([1800, 3600, 5400, 7200, 10800]);
      const I = n * E / R, th = Q / I / 3600;
      if (!limpio(th) || !limpio(I)) return null;
      const enunciado = [`${n} pilas ideales de `, v('t', `${f(E)} V`), ' cada una, conectadas en serie, alimentan un juguete de resistencia ', v('r', `${f(R)} Ω`),
        '. Mientras duran, las pilas pueden hacer circular en total una carga de ', v('i', `${f(Q)} C`), '.'];
      const pregunta = ['¿Cuántas ', v('x', 'horas'), ' funciona el juguete?'];
      const errores = [
        h('PI-no-suma-fem', th * n, `No sumaste las fem. En serie, el voltaje total es ${n} · ${f(E)} = ${f(n * E)} V, y con más voltaje pasa más corriente.`),
        tr('U6-min', th * 60, 'Ese es el tiempo en minutos. Para horas, divide entre 60.'),
        tr('U6-s', th * 3600, 'Ese es el tiempo en segundos. Para horas, divide entre 3600.'),
        h('PI-voltaje-como-corriente', Q / (n * E) / 3600, 'Dividiste la carga entre el voltaje, como si fuera la corriente. Primero halla la corriente con Ohm: I = V/R.'),
      ];
      const solucion = [
        ['En serie: ', v('t', `V = ${n} · ${f(E)} = ${f(n * E)} V`), '. Corriente: I = V/', v('r', 'R'), ` = ${f(n * E)}/${f(R)} = ${f(I)} A.`],
        ['Q = I·t: t = ', v('i', 'Q'), `/I = ${f(Q)}/${f(I)} = ${f(Q / I)} s = `, v('x', `${f(th)} h`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: th, errores, unidad: 'h', variables: { t: { nombre: 'voltaje de cada pila', color: 'o' }, r: { nombre: 'resistencia', color: 'h' }, i: { nombre: 'carga', color: 'i' }, x: { nombre: 'tiempo', color: 'd' } },
        enunciado, pregunta, solucion, datos: { tipo: 'carga', sub, n, E, R, Q } });
    }
    const VQ = { i: { nombre: 'corriente', color: 'i' }, t: { nombre: 'tiempo', color: 'o' }, q: { nombre: 'carga', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const ImA = rng.elegir([20, 50, 100, 150, 200, 250, 300, 400, 500, 800]), tmin = rng.elegir([1, 2, 5, 10, 15, 20, 30, 45, 60]);
    const I = ImA / 1000, Q = I * 60 * tmin;
    if (!limpio(Q)) return null;
    const cosa = rng.elegir(['un celular que se carga', 'un foquito LED', 'un motorcito', 'una radio']);
    if (sub === 'carga') {
      const enunciado = [`Por los cables de ${cosa} pasa una corriente de `, v('i', `${f(ImA)} mA`), ' durante ', v('t', `${f(tmin)} min`), '.'];
      const pregunta = ['¿Cuánta ', v('x', 'carga'), ' pasa por los cables?'];
      const errores = [
        tr('U2-mA', ImA * 60 * tmin, `Usaste la corriente en mA como si fueran amperios. ${f(ImA)} mA = ${f(I)} A.`),
        tr('U6-min', I * tmin, `Usaste el tiempo en minutos. Va en segundos: ${f(tmin)} min = ${f(60 * tmin)} s.`),
        tr('U2-mA', ImA * tmin, 'No convertiste ni la corriente a amperios ni el tiempo a segundos. Q = I·t con I en A y t en s.'),
        tr('PR4-carga', I / (60 * tmin), 'Dividiste la corriente entre el tiempo. La corriente es carga por segundo, así que la carga es corriente por tiempo: Q = I·t.'),
      ];
      const solucion = [
        ['En el SI: ', v('i', `I = ${f(I)} A`), ' y ', v('t', `t = ${f(60 * tmin)} s`), '.'],
        [v('x', 'Q'), ' = ', v('i', 'I'), '·', v('t', 't'), ` = ${f(I)} · ${f(60 * tmin)} = `, v('x', `${f(Q)} C`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: Q, errores, unidad: 'C', variables: VQ, enunciado, pregunta, solucion, datos: { tipo: 'carga', sub, ImA, tmin } });
    }
    // tiempo
    const enunciado = [`Por ${cosa} pasa una corriente de `, v('i', `${f(ImA)} mA`), ' y por sus cables circulan ', v('q', `${f(Q)} C`), ' de carga.'];
    const pregunta = ['¿Cuántos ', v('x', 'minutos'), ' estuvo funcionando?'];
    const errores = [
      tr('U6-s', 60 * tmin, 'Ese es el tiempo en segundos. Para minutos, divide entre 60.'),
      tr('U2-mA', Q / ImA / 60, `Usaste la corriente en mA como si fueran amperios. ${f(ImA)} mA = ${f(I)} A.`),
      tr('PR4-carga', Q * I / 60, 'Multiplicaste la carga por la corriente. De Q = I·t, el tiempo es t = Q/I.'),
      tr('U2-mA', Q / ImA, 'Usaste la corriente en mA y dejaste el tiempo en segundos. Con I en A, t = Q/I sale en segundos; luego divide entre 60.'),
    ];
    const solucion = [
      ['En el SI: ', v('i', `I = ${f(I)} A`), '. De Q = I·t: t = ', v('q', 'Q'), `/I = ${f(Q)}/${f(I)} = ${f(60 * tmin)} s.`],
      ['En minutos: ', v('x', `${f(60 * tmin)}/60 = ${f(tmin)} min`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: tmin, errores, unidad: 'min', variables: VQ, enunciado, pregunta, solucion, datos: { tipo: 'carga', sub, ImA, Q } });
  }

  return { id: 'circuitos-joule', titulo: 'El foco que calienta', generar };
});
