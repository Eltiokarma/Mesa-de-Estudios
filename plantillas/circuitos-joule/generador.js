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
 *     comparar   dos alambres del mismo metal (secciones en mm² o diámetros en mm): R del segundo
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
 * Cada distractor queda entre 1/60 y 60 veces la correcta, salvo las trampas de unidades (U2, U5, U6), que
 * llegan a 1000 veces (decisión de Gerson, 12 nov 2026; P.enEscala), y
 * todas las alternativas de un problema van en la misma notación.
 * Errores: U2, U5, U6, PR1, PR3, PR4 y PR6 de docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md
 * (hipótesis, con sufijo: U2-mA, U6-min, PR6-diametro…); JO-*, RES-*, CAB-*, PI-no-suma-fem y PI-voltaje-como-corriente,
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
  // Números de 1 para arriba, con dos decimales; menores que 1, con tres cifras significativas
  // (0,0158 y no 0,02). Muy chicos o muy grandes, en notación científica.
  const normal = x => P.formatear(x, x >= 1 ? 2 : Math.max(2, 2 - Math.floor(Math.log10(x))));
  const num = x => (x >= 0.001 && x < 1e7 ? normal(x) : cien(x));
  const conUnidad = u => x => `${num(x)} ${u}`;

  const FACTOR = { 2: 'el doble', 3: 'el triple', 4: 'el cuádruple', 0.5: 'la mitad' };

  function generar(semilla) {
    const rng = Azar.crear('circuitos-joule|' + semilla);
    // Si un subtipo no logra 4 alternativas limpias con estos datos, se sortea otro (red de seguridad).
    for (let ronda = 0; ronda < 10; ronda++) {
      const [tipo, sub] = rng.elegir([
        ['joule', 'energia'], ['joule', 'energia'], ['joule', 'corriente'], ['joule', 'corriente'], ['joule', 'escala'], ['joule', 'kwh'], ['joule', 'calorias'],
        ['agua', 'agua'], ['agua', 'agua'],
        ['resistividad', 'diametro'], ['resistividad', 'diametro'], ['resistividad', 'comparar'], ['resistividad', 'rho'], ['resistividad', 'rho'], ['resistividad', 'estirado'], ['resistividad', 'doblado'],
        ['cables', 'calentador'], ['cables', 'calentador'], ['cables', 'perdida'],
        ['carga', 'carga'], ['carga', 'tiempo'], ['carga', 'duracion'], ['carga', 'duracion']]);
      const fn = { joule, agua, resistividad, cables, carga }[tipo];
      for (let intento = 0; intento < 5000; intento++) {
        const pr = fn(rng, semilla, sub);
        if (pr && pr.alternativas.length >= 4) return pr;
      }
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cerrar(rng, semilla, o) {
    // Nada fuera de escala: entre todas las alternativas (correcta incluida), la mayor no llega a
    // 60 veces la menor. Se aceptan los errores en orden mientras el conjunto cumpla la regla.
    const errores = [];
    let lo = o.correcta, hi = o.correcta;
    for (const e of o.errores) {
      if (!Number.isFinite(e.valor) || e.valor <= 0) continue;
      // Las trampas de unidades (U2, U5, U6: minutos por segundos, mA por A) van aunque se salgan, hasta 1000 veces la correcta.
      if (P.esUnidades(e.id)) { if (P.enEscala(e.valor, o.correcta, e.id)) errores.push(e); continue; }
      const nlo = Math.min(lo, e.valor), nhi = Math.max(hi, e.valor);
      if (nhi / nlo >= 60 * (1 - 1e-12)) continue;
      errores.push(e); lo = nlo; hi = nhi;
    }
    // Una sola notación por problema: todas normales o todas en notación científica.
    const todas = [o.correcta, ...errores.map(e => e.valor)];
    const cientifica = o.cientifica || todas.some(x => x < 0.001 || x >= 1e7);
    const texto = o.texto || (x => `${cientifica ? cien(x) : normal(x)} ${o.unidad}`);
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto });
    return {
      id: `circuitos-joule#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  const VJ = { i: { nombre: 'corriente', color: 'i' }, r: { nombre: 'resistencia', color: 'h' }, t: { nombre: 'tiempo', color: 'o' }, x: { nombre: 'lo que se pide', color: 'd' } };
  const APARATO = [['Una terma', 'ella'], ['Un calentador', 'él'], ['Una plancha', 'ella'], ['Un hervidor', 'él'], ['Una estufa eléctrica', 'ella'], ['Una hornilla eléctrica', 'ella'], ['Un secador de pelo', 'él']];

  // ---------------- joule ----------------
  function joule(rng, semilla, sub) {
    if (sub === 'energia') {
      const ImA = rng.elegir([100, 150, 200, 250, 300, 400, 500, 600, 800, 1500]), R = rng.elegir([5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120]), tmin = rng.elegir([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30]);
      const I = ImA / 1000, ts = 60 * tmin, E = I * I * R * ts;
      const kilo = E >= 10000, k = kilo ? 1 / 1000 : 1, unidad = kilo ? 'kJ' : 'J', correcta = E * k;
      if (!limpio(correcta)) return null;
      const enunciado = ['Por una resistencia de ', v('r', `${f(R)} Ω`), ' pasa una corriente de ', v('i', `${f(ImA)} mA`), ' durante ', v('t', `${f(tmin)} min`), '.'];
      const pregunta = ['¿Cuánta ', v('x', 'energía'), ` disipa como calor? (Respuesta en ${unidad}.)`];
      const errores = [
        tr('PR1-cuadrado', I * R * ts * k, 'Multiplicaste I·R·t sin elevar la corriente al cuadrado. La energía disipada es E = I²·R·t.'),
        tr('U6-min', I * I * R * tmin * k, `Usaste el tiempo en minutos. Con I en A y R en Ω, el tiempo va en segundos: ${f(tmin)} min = ${f(ts)} s.`),
        tr('PR1-doble', 2 * I * R * ts * k, 'Pusiste 2·I en lugar de I². Elevar al cuadrado es multiplicar la corriente por sí misma.'),
        tr('PR3-medio', I * I * R * ts * k / 2, 'Pusiste un ½ que no va, como en ½·m·v². La energía que disipa una resistencia es E = I²·R·t, sin ½.'),
      ];
      if (kilo) errores.push(tr('U2-kilo', E, 'Calculaste la energía en joules y la escribiste como si fueran kilojoules. Para pasar a kJ se divide entre 1000.'));
      const solucion = [
        ['Pasa a unidades del SI: ', v('i', `I = ${f(ImA)} mA = ${f(I)} A`), ' y ', v('t', `t = ${f(tmin)} min = ${f(ts)} s`), '.'],
        [v('x', 'E'), ' = ', v('i', 'I'), '²·', v('r', 'R'), '·', v('t', 't'), ` = ${f(I)}² · ${f(R)} · ${f(ts)} = `, kilo ? `${f(E)} J = ` : '', v('x', `${f(correcta)} ${unidad}`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad, variables: VJ, enunciado, pregunta, solucion, datos: { tipo: 'joule', sub, ImA, R, tmin, unidad } });
    }
    if (sub === 'corriente') {
      const I = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8]), R = rng.elegir([2, 4, 5, 8, 10, 12, 15, 20, 25, 30, 40, 50]);
      const enMin = rng.moneda(), tdado = enMin ? rng.elegir([1, 2, 3, 4, 5, 6, 10]) : rng.elegir([10, 15, 20, 30, 40, 50, 60, 80, 100]);
      const ts = enMin ? 60 * tdado : tdado, E = I * I * R * ts;
      const kilo = E >= 1000, Edado = kilo ? E / 1000 : E;
      if (!limpio(Edado)) return null;
      const ut = enMin ? 'min' : 's';
      const [ap, pron] = rng.elegir(APARATO);
      const enunciado = [`${ap} de resistencia `, v('r', `${f(R)} Ω`), ' disipa ', v('x', `${f(Edado)} ${kilo ? 'kJ' : 'J'}`), ' de calor en ', v('t', `${f(tdado)} ${ut}`), '.'];
      const pregunta = ['¿Qué ', v('i', 'corriente'), ` pasa por ${pron}?`];
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
      const Q0 = rng.elegir([1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]), a = rng.elegir([2, 3, 4, 0.5]), b = rng.elegir([2, 3, 4, 0.5]);
      if (a === 0.5 && b === 0.5) return null;
      const correcta = Q0 * a * b;
      const [ap] = rng.elegir(APARATO);
      const enunciado = [`${ap} funciona con una `, v('i', 'corriente constante'), ` (su fuente la mantiene fija) y en cierto tiempo disipa ${f(Q0)} kJ. Se cambia su resistencia por otra que es `,
        v('r', `${FACTOR[a]} de la anterior`), ', con la misma corriente, y se le deja funcionando ', v('t', `${FACTOR[b]} de tiempo`), '.'];
      const pregunta = ['¿Cuánto ', v('x', 'calor'), ' disipa ahora?'];
      const errores = [
        h('JO-voltaje-fijo', Q0 * b / a, `Usaste E = V²·t/R, como si el voltaje fuera fijo: así el calor quedaría multiplicado por ${f(b)}/${f(a)}. Aquí lo fijo es la corriente: con E = I²·R·t, el calor se multiplica por ${f(a)} · ${f(b)}.`),
        tr('PR1-cuadrado', Q0 * a * a * b, 'Elevaste al cuadrado el factor de la resistencia. En E = I²·R·t lo que va al cuadrado es la corriente, que no cambia.'),
        h('JO-solo-tiempo', Q0 * b, 'Solo tomaste en cuenta el cambio de tiempo. La resistencia también cambió y, con la misma corriente, el calor es proporcional a R.'),
        h('JO-solo-resistencia', Q0 * a, 'Solo tomaste en cuenta el cambio de resistencia. El tiempo también cambió: el calor es proporcional a t.'),
        h('JO-no-cambia', Q0, 'Pensaste que el calor no cambia porque la corriente es la misma. Con la misma corriente, E = I²·R·t sigue dependiendo de R y de t, y los dos cambiaron.'),
      ];
      const solucion = [
        ['Con la misma ', v('i', 'corriente'), ', E = I²·', v('r', 'R'), '·', v('t', 't'), ' es proporcional a R y a t.'],
        [v('x', 'E'), ` = ${f(Q0)} · ${f(a)} · ${f(b)} = `, v('x', `${f(correcta)} kJ`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'kJ', variables: VJ, enunciado, pregunta, solucion, datos: { tipo: 'joule', sub, Q0, a, b } });
    }
    if (sub === 'kwh') {
      const Pw = rng.elegir([15, 20, 60, 100, 150, 500, 800, 1000, 1200, 1500, 2000, 2500]), hd = rng.elegir([0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10]), dias = rng.elegir([7, 10, 15, 20, 30, 31]);
      const correcta = Pw * hd * dias / 1000;
      if (!limpio(correcta)) return null;
      const ap = Pw <= 150 ? (Pw <= 20 ? 'Un foco ahorrador' : 'Un foco') : rng.elegir(APARATO)[0];
      const enunciado = [`${ap} de `, v('i', `${f(Pw)} W`), ' se usa ', v('t', `${f(hd)} h al día`), ` durante ${dias} días.`];
      const pregunta = ['¿Cuánta ', v('x', 'energía'), ' consume en ese tiempo, en kW·h?'];
      const errores = [
        h('JO-sin-horas', Pw * dias / 1000, `Multiplicaste por los días pero no por las ${f(hd)} h de cada día. El tiempo total es horas por día × días.`),
        h('JO-suma-tiempos', Pw * (hd + dias) / 1000, `Sumaste las horas y los días (${f(hd)} + ${dias}). El tiempo total es horas por día × días: ${f(hd * dias)} h.`),
        tr('U2-kilo', Pw * hd * dias / 100, 'Pasaste los watts a kilowatts dividiendo entre 100. Un kilowatt son 1000 W.'),
        h('JO-un-dia', Pw * hd / 1000, `Calculaste el consumo de un solo día. Son ${dias} días.`),
        tr('U6-min', Pw * hd * 60 * dias / 1000, 'Pasaste las horas a minutos. Para el kW·h el tiempo va en horas.'),
        tr('U2-kilo', Pw * hd * dias, 'Te quedó en W·h: falta dividir entre 1000 para pasar a kW·h.'),
      ];

      const solucion = [
        ['Potencia en kW: ', v('i', `${f(Pw / 1000)} kW`), '. Tiempo total: ', v('t', `${f(hd)} · ${dias} = ${f(hd * dias)} h`), '.'],
        [v('x', 'E'), ` = ${f(Pw / 1000)} · ${f(hd * dias)} = `, v('x', `${f(correcta)} kW·h`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'kW·h', variables: { ...VJ, i: { nombre: 'potencia', color: 'i' } }, enunciado, pregunta, solucion, datos: { tipo: 'joule', sub, P: Pw, hd, dias } });
    }
    // calorias
    const I = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), R = rng.elegir([4, 5, 8, 10, 12, 20, 25, 40, 50]);
    const enMin = rng.moneda(), tdado = enMin ? rng.elegir([1, 2, 3, 4, 5]) : rng.elegir([10, 15, 20, 25, 30, 50, 60, 100]);
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
    const R = rng.elegir([20, 22, 24.2, 32, 40, 44, 48.4, 55, 60.5, 80, 96.8, 110]), V = 220, Pw = V * V / R;
    const eta = rng.elegir([100, 96, 90, 88, 84, 80, 75, 70, 60]), m = rng.elegir([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5]);
    const T1 = rng.elegir([8, 10, 12, 14, 15, 16, 18, 20, 22, 25]), T2 = rng.elegir([40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]), dT = T2 - T1;
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
    const L = rng.elegir([5, 10, 12, 15, 20, 24, 30, 40, 50, 60, 80, 100, 120, 150, 200, 300]);
    const obj = rng.elegir(OBJR);
    if (sub === 'comparar') {
      // Dos alambres del mismo metal: R2 = R1·(L2/L1)·(A1/A2), con secciones en mm² o diámetros en mm.
      const R1 = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30]), L1 = rng.elegir([10, 20, 30, 40, 50, 60, 100]), kL = rng.elegir([0.5, 2, 3, 4, 1.5]);
      const conDiam = rng.moneda();
      const x1 = conDiam ? rng.elegir([0.5, 1, 2, 3]) : rng.elegir([0.5, 1, 1.5, 2, 2.5, 4, 6]);
      const kx = conDiam ? rng.elegir([2, 3, 0.5]) : rng.elegir([2, 3, 4, 0.5, 1.5]);
      const x2 = x1 * kx, L2 = L1 * kL, kA = conDiam ? kx * kx : kx;
      const correcta = R1 * kL / kA;
      if (!limpio(correcta) || !limpio(x2) || !limpio(L2) || correcta < 0.1 || kL === kA) return null;
      const u = conDiam ? 'mm de diámetro' : 'mm² de sección';
      const enunciado = ['Dos alambres son del mismo metal. El primero mide ', v('l', `${f(L1)} m`), ', tiene ', v('a', `${f(x1)} ${u}`), ' y una resistencia de ', v('p', `${f(R1)} Ω`),
        '. El segundo mide ', v('l', `${f(L2)} m`), ' y tiene ', v('a', `${f(x2)} ${u}`), '.'];
      const pregunta = ['¿Cuál es la ', v('x', 'resistencia'), ' del segundo?'];
      const errores = [
        tr('PR4-seccion', R1 * kL * kA, 'Pusiste la sección en el lado equivocado: la resistencia crece con el largo y baja con la sección. Un alambre más grueso tiene menos resistencia.'),
        h('RES-solo-largo', R1 * kL, 'Solo tomaste en cuenta el cambio de largo. La sección también cambió, y la resistencia es inversamente proporcional a ella: R = ρL/A.'),
        h('RES-solo-seccion', R1 / kA, 'Solo tomaste en cuenta el cambio de sección. El largo también cambió, y la resistencia es proporcional a él: R = ρL/A.'),
        conDiam
          ? tr('PR1-cuadrado', R1 * kL / kx, `Tomaste la razón de diámetros (${f(kx)}) como la razón de secciones. El área va con el diámetro al cuadrado: las secciones están en razón ${f(kx)}² = ${f(kA)}.`)
          : tr('PR6-diametro', R1 * kL / (kA * kA), 'Elevaste al cuadrado la razón de secciones, como si fueran diámetros. El dato ya es la sección (mm²): entra tal cual, sin elevar.'),
      ];
      const solucion = [
        ['Mismo metal, mismo ρ: R = ρL/A, así que R2/R1 = (L2/L1)·(A1/A2).'],
        [`L2/L1 = ${f(L2)}/${f(L1)} = ${f(kL)}. `, conDiam ? `Las secciones van con el diámetro al cuadrado: A2/A1 = (${f(x2)}/${f(x1)})² = ${f(kA)}.` : `A2/A1 = ${f(x2)}/${f(x1)} = ${f(kA)}.`],
        [v('x', 'R2'), ` = ${f(R1)} · ${f(kL)}/${f(kA)} = `, v('x', `${f(correcta)} Ω`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'Ω', variables: { ...VRHO, p: { nombre: 'resistencia del primero', color: 'o' } }, enunciado, pregunta, solucion,
        datos: { tipo: 'resistividad', sub, R1, L1, L2, x1, x2, diametro: conDiam } });
    }
    if (sub === 'diametro') {
      const d = rng.elegir([0.2, 0.4, 0.5, 0.8, 1, 1.2, 1.6, 2, 3, 4]), A = 3 * d * d / 4 * 1e-6, correcta = rho * L / A;
      if (!limpio(correcta) || correcta < 0.1 || correcta > 1e4) return null;
      const enunciado = [`${obj[0].toUpperCase() + obj.slice(1)} de `, v('l', `${f(L)} m`), ' de largo y ', v('a', `${f(d)} mm de diámetro`), ' es de un metal de resistividad ', v('p', `${cien(rho)} Ω·m`), '. Usa π = 3.'];
      const pregunta = ['¿Cuál es su ', v('x', 'resistencia'), '?'];
      const errores = [
        tr('PR6-diametro', correcta / 4, `Usaste el diámetro como si fuera el radio, y el área te salió 4 veces mayor. El radio es la mitad: ${f(d / 2)} mm.`),
        tr('PR6-mitad', correcta / 2, 'Escribiste A = π·d²/2. El radio es d/2 y, al elevarlo al cuadrado, queda d²/4: A = π·d²/4.'),
        h('RES-sin-pi', correcta * 3, 'Olvidaste el π en el área: A = π·r², no r².'),
      ];
      const solucion = [
        ['Radio: ', v('a', `r = ${f(d)}/2 = ${f(d / 2)} mm`), '. Área: ', v('a', `A = 3 · ${f(d / 2)}² = ${f(3 * d * d / 4)} mm² = ${f(3 * d * d / 4)} × 10⁻⁶ m²`), '.'],
        [v('x', 'R'), ' = ', v('p', 'ρ'), '·', v('l', 'L'), '/', v('a', 'A'), ` = ${cien(rho)} · ${f(L)}/(${f(3 * d * d / 4)} × 10⁻⁶) = `, v('x', `${f(correcta)} Ω`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'Ω', variables: VRHO, enunciado, pregunta, solucion, datos: { tipo: 'resistividad', sub, rho, L, d } });
    }
    // rho: con el radio en mm
    const r = rng.elegir([0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.5, 2]), A = 3 * r * r * 1e-6, R = rho * L / A;
    if (!limpio(R) || R < 0.1 || R > 1e4) return null;
    const enunciado = [`${obj[0].toUpperCase() + obj.slice(1)} de `, v('l', `${f(L)} m`), ' de largo y ', v('a', `${f(r)} mm de radio`), ' tiene una resistencia de ', v('p', `${f(R)} Ω`), '. Usa π = 3.'];
    const pregunta = ['¿Cuál es la ', v('x', 'resistividad'), ' del material?'];
    const errores = [
      tr('PR6-radio-como-diametro', rho / 4, 'Tomaste el radio como si fuera el diámetro y el área te salió 4 veces menor. El dato es el radio: A = π·r².'),
      tr('PR6-diametro', rho * 4, 'Sacaste el diámetro (2r) y lo pusiste en π·r², y el área te salió 4 veces mayor. En A = π·r² va el radio, que es el dato.'),
      h('RES-sin-pi', rho / 3, 'Olvidaste el π en el área: A = π·r², no r².'),
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
    const L = rng.elegir([10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 150]), Amm = rng.elegir([0.5, 0.75, 1, 1.5, 2, 2.5, 4]), man = rng.elegir([1.5, 1.6, 1.7, 1.8, 2, 2.4, 2.5, 2.8, 3]), rho = man * 1e-8;
    const Rcab = rho * 2 * L / (Amm * 1e-6);
    const Rc = rng.elegir([8, 10, 11, 12, 18, 20, 22, 24, 30, 40, 44, 48, 50, 60, 100, 110]), V = rng.elegir([110, 220, 220]);
    const I = V / (Rc + Rcab), Pc = I * I * Rc, Pp = I * I * Rcab;
    if (!limpio(Rcab) || !limpio(I) || !limpio(Pc) || !limpio(Pp)) return null;
    const [ap, apDef] = rng.elegir([['una terma', 'a la terma'], ['un calentador', 'al calentador'], ['una estufa', 'a la estufa'], ['una hornilla eléctrica', 'a la hornilla'], ['una plancha', 'a la plancha'], ['un secador de pelo', 'al secador']]);
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
      const n = rng.elegir([2, 3, 4, 6]), E = rng.elegir([1.5, 1.5, 3, 9]), R = rng.elegir([2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 45, 60]), Q = rng.elegir([1800, 2700, 3600, 5400, 7200, 9000, 10800, 14400, 18000]);
      const I = n * E / R, th = Q / I / 3600;
      if (!limpio(th) || !limpio(I)) return null;
      const enunciado = [`${n} pilas ideales de `, v('t', `${f(E)} V`), ' cada una, conectadas en serie, alimentan un juguete de resistencia ', v('r', `${f(R)} Ω`),
        '. Mientras duran, las pilas pueden hacer circular en total una carga de ', v('i', `${f(Q)} C`), '.'];
      const pregunta = ['¿Cuántas ', v('x', 'horas'), ' funciona el juguete?'];
      const errores = [
        h('PI-no-suma-fem', th * n, `No sumaste las fem. En serie, el voltaje total es ${n} · ${f(E)} = ${f(n * E)} V, y con más voltaje pasa más corriente.`),
        tr('U6-min', th * 60, 'Ese es el tiempo en minutos. Para horas, divide entre 60.'),
        tr('U6-s', th * 3600, 'Ese es el tiempo en segundos. Para horas, divide entre 3600.'),
        h('PI-carga-repartida', th / n, `Repartiste la carga entre las ${n} pilas. En serie, la misma carga pasa por todas: los ${f(Q)} C son los que recorren el circuito.`),
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
    const ImA = rng.elegir([20, 25, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 750, 800]), tmin = rng.elegir([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 45, 60, 90]);
    const I = ImA / 1000, Q = I * 60 * tmin;
    if (!limpio(Q)) return null;
    const [porDonde, aparato] = rng.elegir([['el cable de un cargador de celular', 'el cargador de un celular'], ['un foquito LED', 'un foquito LED'], ['el motorcito de un juguete', 'el motorcito de un juguete'], ['una radio a pilas', 'una radio a pilas'], ['un timbre', 'un timbre']]);
    if (sub === 'carga') {
      const enunciado = [`Por ${porDonde} pasa una corriente de `, v('i', `${f(ImA)} mA`), ' durante ', v('t', `${f(tmin)} min`), '.'];
      const pregunta = ['¿Cuánta ', v('x', 'carga'), ' pasa en ese tiempo?'];
      const errores = [
        tr('U2-mA', Q * 10, `Pasaste de mA a A dividiendo entre 100. Un amperio tiene 1000 mA: ${f(ImA)} mA = ${f(I)} A.`),
        tr('U6-min', I * tmin, `Usaste el tiempo en minutos. Va en segundos: ${f(tmin)} min = ${f(60 * tmin)} s.`),
        tr('U6-cien', I * 100 * tmin, `Pasaste los minutos a segundos multiplicando por 100. Un minuto tiene 60 s: ${f(tmin)} min = ${f(60 * tmin)} s.`),
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
    const enunciado = [`Por ${aparato} pasa una corriente constante de `, v('i', `${f(ImA)} mA`), ' y en total circulan ', v('q', `${f(Q)} C`), ' de carga.'];
    const pregunta = ['¿Cuántos ', v('x', 'minutos'), ' estuvo funcionando?'];
    const errores = [
      tr('U6-s', 60 * tmin, 'Ese es el tiempo en segundos. Para minutos, divide entre 60.'),
      tr('U2-mA', Q / ImA / 60, `Usaste la corriente en mA como si fueran amperios. ${f(ImA)} mA = ${f(I)} A.`),
      tr('PR4-carga', Q * I / 60, 'Multiplicaste la carga por la corriente. De Q = I·t, el tiempo es t = Q/I.'),
      tr('U2-mA', tmin / 10, `Pasaste de mA a A dividiendo entre 100. Un amperio tiene 1000 mA: ${f(ImA)} mA = ${f(I)} A.`),
      tr('U6-h', tmin / 60, 'Pasaste los segundos a horas (entre 3600). Para minutos se divide entre 60.'),
      tr('U6-cien', 0.6 * tmin, 'Pasaste los segundos a minutos dividiendo entre 100. Un minuto tiene 60 s: se divide entre 60.'),
    ];
    const solucion = [
      ['En el SI: ', v('i', `I = ${f(I)} A`), '. De Q = I·t: t = ', v('q', 'Q'), `/I = ${f(Q)}/${f(I)} = ${f(60 * tmin)} s.`],
      ['En minutos: ', v('x', `${f(60 * tmin)}/60 = ${f(tmin)} min`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: tmin, errores, unidad: 'min', variables: VQ, enunciado, pregunta, solucion, datos: { tipo: 'carga', sub, ImA, Q } });
  }

  return { id: 'circuitos-joule', titulo: 'El foco que calienta', generar };
});
