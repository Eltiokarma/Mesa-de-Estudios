/*
 * Generador «La manguera y el caño»: fluidos en movimiento y las cuentas de fluidos que la admisión de San Marcos
 * pregunta con trampa de unidades (docs/clasificacion/trampas-admision-unmsm/fisica.md, familias 1, 2, 6 y 8).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['fluidos-hidrodinamica']) y en Node (require). No usa ningún motor.
 *
 * Tipos y subtipos:
 *   caudal       rapidez   caudal (L/s o L/min) y diámetro del tubo → rapidez del agua, Q = A·v
 *                ducto     un ducto renueva el aire de un aula de V m³ en t min → rapidez del aire
 *                llenado   manguera de diámetro D con el agua a v → minutos para llenar un cilindro de V L
 *   continuidad  diametros  tramo angosto (D1, v1) → rapidez en el tramo ancho D2: v2 = v1·(D1/D2)²
 *                radios     manguera ancha (r1, v1) con boquilla r2 → rapidez en la boquilla
 *   bernoulli    presion    tubo horizontal con estrechamiento (razón de áreas o de diámetros) → presión en lo angosto
 *                caudal     tubo de riego con caudal conocido y áreas en cm² → presión en lo angosto
 *                velocidad  presiones en las dos secciones y razón de áreas → rapidez en lo angosto
 *                sube       tubo que sube Δh y se angosta (o no) → presión arriba
 *   torricelli   rapidez   tanque con un orificio lateral → rapidez de salida, v = √(2g·h), h bajo la superficie
 *                alcance   el chorro cae al piso: distancia horizontal x = v·t, t = √(2y/g)
 *                llegada   rapidez con que el chorro llega al piso (componentes vx y vy)
 *                angulo    ángulo bajo la horizontal con que el chorro llega al piso (notables 30°, 37°, 53°, 60°)
 *   densidad     peso-especifico  masa (g) y volumen (cm³) de un líquido → peso específico γ = ρ·g en N/m³
 *                densidad         peso (N) y volumen (L) de un cuerpo → densidad en kg/m³
 *   barometro    columna     presión atmosférica de una ciudad → altura de la columna de mercurio
 *                comparar    modelo simple (aire de densidad constante, declarado) → columna en una ciudad de altura
 *                absoluta    manómetro en una ciudad de altura → presión absoluta (con la atmosférica de ahí)
 *                manometrica presión absoluta en una ciudad de altura → lo que marca el manómetro
 *
 * Convenciones: g = 10 m/s², agua 1000 kg/m³, mercurio 13 600 kg/m³, π = 3 cuando hay diámetros o radios (se dice en
 * el enunciado), fluido ideal (sin roce) y tubo lleno. Presiones en kPa; las del tipo bernoulli son absolutas.
 * Errores: los U y PR de docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md (hipótesis); F8 del informe
 * de fluidos (docs/investigacion/fluidos-calor-termodinamica-ideas-erroneas.md), parcial porque ahí se midió en un
 * líquido quieto y aquí se aplica al aire; los FH- son de este módulo, salen de la columna TRAMPA del CSV de admisión
 * (más rapidez, más presión; profundidad total en Torricelli; presión del nivel del mar en una ciudad de altura;
 * densidad por peso específico) y son hipótesis.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const TR = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const FL = 'docs/investigacion/fluidos-calor-termodinamica-ideas-erroneas.md';
  const TRAMPAS = 'docs/clasificacion/trampas-admision-unmsm/fisica.md';
  const h = (id, valor, explicacion, fuente = TR) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: FL });
  const f = x => P.formatear(x, 2);
  const f3 = x => P.formatear(x, 3);
  const v = P.v;
  const limpio = (x, dec = 2) => Number.isFinite(x) && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-6 && Math.abs(x) < 1e7;
  const PI = 3, G = 10, AGUA = 1000, HG = 13600;
  const area = Dcm => PI * (Dcm / 100) ** 2 / 4;          // m², con π = 3
  const raiz = x => P.radical(x);
  const conPi = ' (Usa π = 3.)';

  const TIPOS = [
    ['caudal', 'rapidez'], ['caudal', 'rapidez'], ['caudal', 'ducto'], ['caudal', 'llenado'],
    ['continuidad', 'diametros'], ['continuidad', 'diametros'], ['continuidad', 'radios'],
    ['bernoulli', 'presion'], ['bernoulli', 'presion'], ['bernoulli', 'caudal'], ['bernoulli', 'velocidad'], ['bernoulli', 'sube'],
    ['torricelli', 'rapidez'], ['torricelli', 'alcance'], ['torricelli', 'llegada'], ['torricelli', 'angulo'],
    ['densidad', 'peso-especifico'], ['densidad', 'peso-especifico'], ['densidad', 'densidad'],
    ['barometro', 'columna'], ['barometro', 'comparar'], ['barometro', 'absoluta'], ['barometro', 'manometrica'],
  ];

  function generar(semilla) {
    const rng = Azar.crear('fluidos-hidrodinamica|' + semilla);
    const [tipo, sub] = rng.elegir(TIPOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = FAB[tipo](rng, semilla, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // o: { correcta, errores, texto, unidad, variables, enunciado, pregunta, solucion, datos, dec }
  function cerrar(rng, semilla, o) {
    const dec = o.dec === undefined ? 3 : o.dec;
    const errores = o.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && (o.cualquiera || limpio(e.valor, dec)));
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.texto });
    return {
      id: `fluidos-hidrodinamica#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: redondear(o.datos),
    };
  }
  const con = u => x => `${f3(x)} ${u}`;
  // Los datos se guardan sin el ruido de coma flotante (60.000000000000014 → 60): son los números del enunciado.
  const redondear = d => Object.fromEntries(Object.entries(d).map(([k, x]) => [k, typeof x === 'number' ? Math.round(x * 1e9) / 1e9 : x]));

  // ================= caudal =================
  function caudal(rng, semilla, sub) {
    const VAR = { Q: { nombre: 'caudal', color: 'o' }, D: { nombre: 'diámetro', color: 'i' }, t: { nombre: 'tiempo', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'rapidez') {
      const D = rng.elegir([1, 2, 4, 5, 10]), vel = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8]);
      const A = area(D), Q = A * vel, enMin = rng.moneda();
      const Qm = enMin ? Q * 60000 : Q * 1000, uQ = enMin ? 'L/min' : 'L/s';
      if (!limpio(Qm, 2) || Qm < 0.1 || Qm > 2000) return null;
      const [Obj, verbo] = rng.elegir([['una manguera', 'sale'], ['el caño de la cocina', 'sale'], ['una tubería de riego', 'corre']]);
      const enunciado = [`Por ${Obj} de `, v('D', `${f(D)} cm de diámetro`), ` ${verbo} agua con un caudal de `, v('Q', `${f(Qm)} ${uQ}`), '.' + conPi];
      const pregunta = ['¿Con qué ', v('x', 'rapidez'), ` ${verbo} el agua?`];
      const errores = [
        h('PR6-diametro-radio', vel / 4, `Usaste el diámetro como si fuera el radio: el área te salió 4 veces mayor y la rapidez 4 veces menor. El radio es la mitad: r = ${f(D / 2)} cm.`),
        h('U3-litros', vel * 10, 'Pasaste los litros a m³ dividiendo entre 100. En 1 m³ caben 1000 L: hay que dividir entre 1000.'),
        h('U3-cm2', vel / 100, 'Pasaste el área de cm² a m² dividiendo entre 100. Un metro cuadrado tiene 100 · 100 = 10 000 cm²: hay que dividir entre 10 000.'),
      ];
      if (enMin) errores.splice(1, 0, h('U6-minutos', vel * 60, 'Dejaste el caudal por minuto. La rapidez va en metros por segundo: primero divide el caudal entre 60.'));
      const solucion = [
        ['Caudal en m³/s: ', v('Q', `Q = ${f(Qm)} ${uQ}`), enMin ? ` = ${f(Qm / 60)} L/s` : '', ` = ${P.formatear(Q, 6)} m³/s (1 m³ = 1000 L).`],
        ['Área: r = ', v('D', `${f(D / 2)} cm`), ` = ${P.formatear(D / 200, 4)} m, así que A = π·r² = 3 · ${P.formatear(D / 200, 4)}² = ${P.formatear(A, 7)} m².`],
        [v('x', 'v'), ' = ', v('Q', 'Q'), `/A = ${P.formatear(Q, 6)} / ${P.formatear(A, 7)} = `, v('x', `${f(vel)} m/s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: vel, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'caudal', sub, D_cm: D, Q: Qm, uQ, pi: PI } });
    }
    if (sub === 'ducto') {
      const D = rng.elegir([20, 30, 40]), vel = rng.elegir([1, 1.5, 2, 2.5, 3, 4, 5]), t = rng.elegir([5, 8, 10, 12, 15, 20]);
      const A = area(D), Vol = vel * A * t * 60;
      if (!limpio(Vol, 0) || Vol < 20 || Vol > 400) return null;
      const deLugar = rng.elegir(['de un aula', 'de la sala de cómputo', 'del comedor del colegio']);
      const enunciado = ['Un ducto de ventilación de ', v('D', `${f(D)} cm de diámetro`), ` renueva todo el aire ${deLugar}, de ${f(Vol)} m³, en `, v('t', `${t} minutos`), '.' + conPi];
      const pregunta = ['¿Con qué ', v('x', 'rapidez'), ' pasa el aire por el ducto?'];
      const errores = [
        h('PR6-diametro-radio', vel / 4, `Usaste el diámetro como radio: el área salió 4 veces mayor. El radio es ${f(D / 2)} cm.`),
        h('U6-minutos', vel * 60, 'Dejaste el tiempo en minutos. Para tener m/s, el tiempo va en segundos: multiplícalo por 60.'),
        h('U3-cm2', vel / 100, 'Pasaste el área de cm² a m² dividiendo entre 100; hay que dividir entre 10 000.'),
        h('PR6-diametro-radio-minutos', vel * 15, 'Hubo dos errores: el diámetro como radio (área 4 veces mayor) y el tiempo en minutos (60 veces menor).'),
      ];
      const solucion = [
        ['Caudal: el volumen entre el tiempo, ', v('Q', `Q = ${f(Vol)} m³ / (${t} · 60 s) = ${P.formatear(Vol / (t * 60), 4)} m³/s`), '.'],
        ['Área del ducto: r = ', v('D', `${f(D / 2)} cm`), ` = ${f(D / 200)} m, A = 3 · ${f(D / 200)}² = ${P.formatear(A, 4)} m².`],
        [v('x', 'v'), ` = Q/A = ${P.formatear(Vol / (t * 60), 4)} / ${P.formatear(A, 4)} = `, v('x', `${f(vel)} m/s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: vel, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'caudal', sub, D_cm: D, V_m3: Vol, t_min: t, pi: PI } });
    }
    // llenado
    const D = rng.elegir([1, 2, 4]), vel = rng.elegir([1, 2, 3, 4, 5]), t = rng.elegir([5, 10, 15, 20, 30, 40, 60]);
    const A = area(D), VL = A * vel * t * 60 * 1000;
    if (!limpio(VL, 0) || VL < 40 || VL > 3000) return null;
    const enunciado = ['Con una manguera de ', v('D', `${f(D)} cm de diámetro`), `, por la que el agua sale a ${f(vel)} m/s, se llena un cilindro de ${f(VL)} L en la chacra.` + conPi];
    const pregunta = ['¿Cuántos ', v('x', 'minutos'), ' tarda en llenarse?'];
    const errores = [
      h('PR6-diametro-radio', t / 4, `Usaste el diámetro como radio: el área salió 4 veces mayor y el tiempo 4 veces menor. El radio es ${f(D / 2)} cm.`),
      h('U6-segundos', t * 60, 'Ese número es el tiempo en segundos. La pregunta pide minutos: divide entre 60.'),
      h('U3-litros', t * 10, 'Pasaste los litros a m³ dividiendo entre 100. 1 m³ = 1000 L.'),
      h('U3-cm2', t / 100, 'Pasaste el área de cm² a m² dividiendo entre 100; hay que dividir entre 10 000.'),
    ];
    const Q = A * vel;
    const solucion = [
      ['Área: r = ', v('D', `${f(D / 2)} cm`), ` = ${P.formatear(D / 200, 3)} m, A = 3 · ${P.formatear(D / 200, 3)}² = ${P.formatear(A, 7)} m².`],
      ['Caudal: ', v('Q', `Q = A · v = ${P.formatear(A, 7)} · ${f(vel)} = ${P.formatear(Q, 6)} m³/s`), ` = ${P.formatear(Q * 1000, 4)} L/s.`],
      [v('t', 't'), ` = V/Q = ${f(VL)} L / ${P.formatear(Q * 1000, 4)} L/s = ${f(t * 60)} s = `, v('x', `${f(t)} min`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: t, errores, texto: con('min'), unidad: 'min', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'caudal', sub, D_cm: D, v: vel, V_L: VL, pi: PI } });
  }

  // ================= continuidad =================
  function continuidad(rng, semilla, sub) {
    const VAR = { D: { nombre: sub === 'radios' ? 'radio' : 'diámetro', color: 'i' }, v1: { nombre: 'rapidez conocida', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'diametros') {
      const [D1, D2] = rng.elegir([[2, 4], [3, 6], [2, 6], [4, 6], [4, 10], [5, 10], [6, 9], [2, 5], [3, 9]]);
      const v1 = rng.elegir([2, 3, 4, 4.5, 5, 6, 8, 9, 10, 12, 16, 18, 20, 25]);
      const k = D1 / D2, v2 = v1 * k * k;
      if (!limpio(v2, 2) || v2 < 0.2) return null;
      const enunciado = ['En una tubería de agua, un tramo angosto de ', v('D', `${f(D1)} cm de diámetro`), ' se une a un tramo ancho de ', v('D', `${f(D2)} cm de diámetro`),
        '. En el tramo angosto el agua va a ', v('v1', `${f(v1)} m/s`), '. La tubería está llena.'];
      const pregunta = ['¿Con qué ', v('x', 'rapidez'), ' va el agua en el tramo ancho?'];
      const errores = [
        h('PR1-area-lineal', v1 * k, `Hiciste la rapidez proporcional al diámetro. Lo que se conserva es A·v, y el área va con el cuadrado: (${f(D1)}/${f(D2)})².`),
        h('PR4-invertida', v1 / (k * k), 'Invertiste la razón: en el tramo ancho el agua va más lenta, no más rápida. A más área, menos rapidez.'),
        h('PR4-invertida-lineal', v1 / k, 'Invertiste la razón y además no elevaste al cuadrado. En el tramo ancho el agua va más lenta, con el cuadrado de la razón de diámetros.'),
        h('FH-misma-rapidez', v1, 'La rapidez cambia al cambiar el tubo: el mismo caudal pasa por un área mayor, así que va más lenta.', TRAMPAS),
      ];
      const solucion = [
        ['Continuidad: el caudal es el mismo, A₁·', v('v1', 'v₁'), ' = A₂·', v('x', 'v₂'), ', y el área va con el diámetro al cuadrado (A = π·D²/4).'],
        [v('x', 'v₂'), ' = ', v('v1', f(v1)), ' · (', v('D', f(D1)), '/', v('D', f(D2)), `)² = ${f(v1)} · ${P.textoFraccion(P.frac(D1 * D1, D2 * D2))} = `, v('x', `${f(v2)} m/s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: v2, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'continuidad', sub, D1_cm: D1, D2_cm: D2, v1 } });
    }
    // radios: manguera ancha con boquilla angosta
    const [r1, r2] = rng.elegir([[1, 0.5], [2, 1], [1.5, 0.5], [3, 1], [2, 0.5], [1.2, 0.4], [3, 2], [2.5, 1]]);
    const v1 = rng.elegir([0.25, 0.5, 0.8, 1, 1.2, 1.5, 2]);
    const k = r1 / r2, v2 = v1 * k * k;
    if (!limpio(v2, 2) || v2 > 40) return null;
    const enunciado = ['Una manguera de ', v('D', `${f(r1)} cm de radio`), ' lleva agua a ', v('v1', `${f(v1)} m/s`), '. En la punta se le pone una boquilla de ', v('D', `${f(r2)} cm de radio`), '.'];
    const pregunta = ['¿Con qué ', v('x', 'rapidez'), ' sale el agua por la boquilla?'];
    const errores = [
      h('PR1-area-lineal', v1 * k, `Hiciste la rapidez proporcional al radio. El área va con el radio al cuadrado: la razón es (${f(r1)}/${f(r2)})², no ${f(r1)}/${f(r2)}.`),
      h('PR4-invertida', v1 / (k * k), 'Invertiste la razón: por la boquilla, que es más angosta, el agua sale más rápido, no más lento.'),
      h('PR4-invertida-lineal', v1 / k, 'Invertiste la razón y no elevaste al cuadrado. Por lo angosto el agua va más rápido, con el cuadrado de la razón de radios.'),
      h('FH-misma-rapidez', v1, 'El mismo caudal pasa por un área menor: el agua tiene que ir más rápido.', TRAMPAS),
    ];
    const solucion = [
      ['Continuidad: π·r₁²·', v('v1', 'v₁'), ' = π·r₂²·', v('x', 'v₂'), ' (π se cancela).'],
      [v('x', 'v₂'), ' = ', v('v1', f(v1)), ' · (', v('D', f(r1)), '/', v('D', f(r2)), `)² = ${f(v1)} · ${f(k * k)} = `, v('x', `${f(v2)} m/s`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: v2, errores, texto: con('m/s'), unidad: 'm/s', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'continuidad', sub, r1_cm: r1, r2_cm: r2, v1 } });
  }

  // ================= bernoulli =================
  const kPa = x => `${f(x)} kPa`;
  function bernoulli(rng, semilla, sub) {
    const VAR = { P1: { nombre: 'presión conocida', color: 'o' }, vel: { nombre: 'rapidez', color: 'h' }, A: { nombre: sub === 'sube' ? 'altura que sube el tubo' : 'área o diámetro', color: 'i' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const masRapido = (P1, dP) => h('FH-mas-rapido-mas-presion', P1 + dP, 'Pusiste que donde el agua va más rápido hay más presión. Es al revés: para acelerar, el agua tiene que ser empujada desde donde hay más presión hacia donde hay menos.', TRAMPAS);
    if (sub === 'presion' || sub === 'caudal') {
      let v1, v2, n, A1, A2, Q, enunciadoTubo, porDiam = false;
      const P1 = rng.elegir([120, 140, 150, 160, 180, 200, 250, 300]);
      if (sub === 'presion') {
        porDiam = rng.moneda();
        v1 = rng.elegir([1, 2, 3]);
        n = porDiam ? 4 : rng.elegir([2, 3]);
        v2 = n * v1;
        enunciadoTubo = porDiam
          ? ['Por una tubería horizontal corre agua a ', v('vel', `${f(v1)} m/s`), ' con una presión de ', v('P1', kPa(P1)), '. Más adelante, el ', v('A', 'diámetro se reduce a la mitad'), '.']
          : ['Por una tubería horizontal corre agua a ', v('vel', `${f(v1)} m/s`), ' con una presión de ', v('P1', kPa(P1)), '. Más adelante, el tubo se angosta y su ', v('A', `área queda ${n === 2 ? 'a la mitad' : 'en la tercera parte'}`), '.'];
      } else {
        A1 = rng.elegir([20, 25, 40, 50, 80]); n = rng.elegir([2, 4]); A2 = A1 / n;
        v1 = rng.elegir([1, 1.5, 2, 3]); v2 = n * v1; Q = A1 * 1e-4 * v1 * 1000;
        if (!limpio(Q, 2)) return null;
        enunciadoTubo = [`Un tubo horizontal de riego lleva un caudal de ${f(Q)} L/s. Tiene una sección de `, v('A', `${f(A1)} cm²`), ', donde la presión es ', v('P1', kPa(P1)),
          ', y un estrechamiento de ', v('A', `${f(A2)} cm²`), '.'];
      }
      const dP = AGUA * (v2 * v2 - v1 * v1) / 2 / 1000, P2 = P1 - dP;
      if (!(P2 > 20) || !limpio(P2, 2)) return null;
      const enunciado = [...enunciadoTubo, ' Toma el agua como un fluido ideal (1000 kg/m³).'];
      const pregunta = ['¿Cuál es la ', v('x', 'presión'), ' del agua en la parte angosta?'];
      const errores = [masRapido(P1, dP)];
      if (porDiam) errores.push(h('PR1-diametro-lineal', P1 - AGUA * (4 * v1 * v1 - v1 * v1) / 2000, 'Hiciste la rapidez proporcional al diámetro (el doble). El área va con el diámetro al cuadrado: con la mitad del diámetro, el área es la cuarta parte y la rapidez se cuadruplica.'));
      errores.push(
        h('PR3-sin-medio', P1 - 2 * dP, 'Olvidaste el ½ de la energía cinética por volumen: el término de Bernoulli es ½·ρ·v².', TR),
        h('FH-diferencia-al-cuadrado', P1 - AGUA * (v2 - v1) ** 2 / 2000, 'Elevaste al cuadrado la diferencia de rapideces. Bernoulli resta los cuadrados: ½·ρ·(v₂² − v₁²), que no es ½·ρ·(v₂ − v₁)².'),
        h('FH-presion-igual', P1, 'La presión no es la misma en todo el tubo cuando el agua se mueve: donde va más rápido, la presión es menor.', TRAMPAS),
        h('FH-solo-v2', P1 - AGUA * v2 * v2 / 2000, 'Usaste solo la rapidez en lo angosto, como si en la parte ancha el agua estuviera quieta. En la parte ancha también tiene energía cinética.'),
      );
      const solucion = [
        sub === 'caudal'
          ? ['Rapideces: ', v('vel', `v₁ = Q/A₁ = ${P.formatear(Q / 1000, 4)} / ${P.formatear(A1 * 1e-4, 4)} = ${f(v1)} m/s`), ' y ', v('vel', `v₂ = Q/A₂ = ${f(v2)} m/s`), ' (1 m² = 10 000 cm²).']
          : ['Continuidad: el área de la parte angosta es ', porDiam ? 'la cuarta parte (el área va con el diámetro al cuadrado)' : (n === 2 ? 'la mitad' : 'la tercera parte'), ', así que ', v('vel', `v₂ = ${n} · ${f(v1)} = ${f(v2)} m/s`), '.'],
        ['Bernoulli en un tubo horizontal: ', v('P1', 'P₁'), ' + ½·ρ·v₁² = ', v('x', 'P₂'), ' + ½·ρ·v₂².'],
        [v('x', 'P₂'), ' = ', v('P1', f(P1)), ` − ½ · 1000 · (${f(v2)}² − ${f(v1)}²)/1000 = ${f(P1)} − ${f(dP)} = `, v('x', kPa(P2)), '. Donde va más rápido, hay menos presión.'],
      ];
      return cerrar(rng, semilla, { correcta: P2, errores, texto: kPa, unidad: 'kPa', dec: 2, cualquiera: true, variables: VAR, enunciado, pregunta, solucion,
        datos: sub === 'caudal' ? { tipo: 'bernoulli', sub, P1, Q_Ls: Q, A1_cm2: A1, A2_cm2: A2 }
          : { tipo: 'bernoulli', sub, P1, v1, razonAreas: n, porDiametro: porDiam } });
    }
    if (sub === 'velocidad') {
      const [n, v2] = rng.elegir([[2, 2], [2, 4], [2, 6], [2, 8], [3, 3], [3, 6], [4, 4], [4, 8]]);
      const v1 = v2 / n, dP = AGUA * (v2 * v2 - v1 * v1) / 2 / 1000;
      const P1 = rng.elegir([120, 150, 180, 200]), P2 = P1 - dP;
      if (!limpio(P2, 2)) return null;
      const enunciado = ['Por un tubo horizontal corre agua. En la sección ancha la presión es ', v('P1', kPa(P1)), ' y en la sección angosta, ', v('P1', kPa(P2)),
        '. El ', v('A', `área de la sección ancha es ${n === 2 ? 'el doble' : n === 3 ? 'el triple' : 'el cuádruple'}`), ' que la de la angosta. Toma el agua como un fluido ideal (1000 kg/m³).'];
      const pregunta = ['¿Con qué ', v('x', 'rapidez'), ' pasa el agua por la sección angosta?'];
      const txt = x => `${raiz(x)} m/s`;
      const errores = [
        h('FH-sin-v1', Math.sqrt(2 * dP * 1000 / AGUA), 'Tomaste el agua como quieta en la sección ancha. Allí también se mueve, a v₂/' + n + ' por continuidad, y su energía cinética entra en Bernoulli.'),
        h('FH-da-la-ancha', v1, `Esa es la rapidez en la sección ancha. La angosta tiene ${n} veces menos área: el agua va ${n} veces más rápido.`),
        h('PR3-sin-medio', v2 / Math.SQRT2, 'Olvidaste el ½ de ½·ρ·v².'),
        h('PR2-sin-raiz', v2 * v2, 'Te quedaste con v² y no sacaste la raíz.'),
      ];
      const solucion = [
        ['Continuidad: ', v('vel', 'v₁'), ' = ', v('x', 'v₂'), `/${n}, porque el área ancha es ${n} veces la angosta.`],
        ['Bernoulli horizontal: ', v('P1', 'P₁ − P₂'), ` = ½·ρ·(v₂² − v₁²) = ½ · 1000 · v₂² · (1 − 1/${n * n}).`],
        [`${f(dP * 1000)} Pa = ${{ 2: '375', 3: '4000/9', 4: '468,75' }[n]} · v₂², así que v₂² = ${f(v2 * v2)} y `, v('x', `v₂ = ${f(v2)} m/s`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: v2, errores, texto: txt, unidad: 'm/s', cualquiera: true, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'bernoulli', sub, P1, P2, razonAreas: n } });
    }
    // sube: tubo que sube Δh (con o sin estrechamiento)
    const P1 = rng.elegir([200, 250, 300]), v1 = rng.elegir([1, 2]), n = rng.elegir([1, 2]), dh = rng.elegir([2, 3, 4, 5, 6]);
    const v2 = n * v1, dK = AGUA * (v2 * v2 - v1 * v1) / 2000, dG = AGUA * G * dh / 1000, P2 = P1 - dK - dG;
    const enunciado = ['El agua entra a una casa por un tubo en el primer piso con una presión de ', v('P1', kPa(P1)), ' y a ', v('vel', `${f(v1)} m/s`), '. El tubo sube ',
      v('A', `${dh} m`), n === 1 ? ' hasta la ducha de arriba, con el mismo diámetro.' : ' hasta la ducha de arriba, donde su área es la mitad.', ' Toma el agua como un fluido ideal (1000 kg/m³).'];
    const pregunta = ['¿Cuál es la ', v('x', 'presión'), ' del agua arriba, antes de salir?'];
    const errores = [
      h('FH-sin-altura', P1 - dK, `Olvidaste que el agua sube ${dh} m: subir le cuesta ρ·g·Δh = ${f(dG)} kPa de presión.`),
      pa('F8-presion-crece-al-subir', P1 - dK + dG, 'Sumaste ρ·g·Δh. La presión del agua baja al subir, igual que crece al bajar: arriba hay menos agua empujando encima.'),
      h('FH-altura-sin-g', P1 - dK - AGUA * dh / 1000, 'Olvidaste la g en ρ·g·Δh.'),
    ];
    if (n === 2) {
      errores.push(masRapido(P1 - dG, dK), h('FH-sin-continuidad', P1 - dG, 'Olvidaste que arriba el tubo es más angosto: el agua va más rápido y eso también baja la presión.'));
    }
    const solucion = [
      n === 1 ? ['Mismo diámetro: por continuidad, la rapidez arriba es la misma, ', v('vel', `${f(v2)} m/s`), '.']
        : ['Continuidad: el área es la mitad, así que ', v('vel', `v₂ = 2 · ${f(v1)} = ${f(v2)} m/s`), '.'],
      ['Bernoulli: ', v('P1', 'P₁'), ' + ½·ρ·v₁² + ρ·g·0 = ', v('x', 'P₂'), ' + ½·ρ·v₂² + ρ·g·', v('A', 'Δh'), '.'],
      [v('x', 'P₂'), ' = ', v('P1', f(P1)), n === 1 ? ' − 1000 · 10 · ' : ` − ${f(dK)} − 1000 · 10 · `, v('A', String(dh)), '/1000 = ', v('x', kPa(P2)), '.'],
    ];
    return cerrar(rng, semilla, { correcta: P2, errores, texto: kPa, unidad: 'kPa', dec: 2, cualquiera: true, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'bernoulli', sub, P1, v1, razonAreas: n, dh } });
  }

  // ================= torricelli =================
  const HS = [0.2, 0.45, 0.8, 1.25, 1.8, 2.45, 3.2];   // 20·h es un cuadrado: v = √(2gh) entero
  function torricelli(rng, semilla, sub) {
    const VAR = { H: { nombre: 'altura del agua sobre el piso', color: 'o' }, y: { nombre: 'altura del orificio sobre el piso', color: 'i' }, vel: { nombre: 'rapidez de salida', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const ms = x => `${raiz(x)} m/s`;
    const marco = (H, y) => ['Un tanque abierto está sobre el piso, con el agua hasta ', v('H', `${f(H)} m`), ' de altura. A ', v('y', `${f(y)} m`),
      ' del piso tiene un orificio pequeño en la pared, por donde sale un chorro horizontal. Desprecia el roce y toma g = 10 m/s²; el nivel del agua baja muy despacio.'];
    if (sub === 'rapidez') {
      const hh = rng.elegir(HS), y = rng.elegir([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 1]), H = hh + y;
      if (!limpio(H, 2)) return null;
      const vel = Math.sqrt(2 * G * hh);
      const enunciado = marco(H, y);
      const pregunta = ['¿Con qué ', v('x', 'rapidez'), ' sale el agua por el orificio?'];
      const errores = [
        h('FH-profundidad-total', Math.sqrt(2 * G * H), `Usaste toda la altura del agua (${f(H)} m). En Torricelli va la profundidad del orificio bajo la superficie: ${f(H)} − ${f(y)} = ${f(hh)} m.`, TRAMPAS),
        h('FH-altura-del-orificio', Math.sqrt(2 * G * y), 'Usaste la altura del orificio sobre el piso. Lo que acelera el agua es la columna que tiene encima: la distancia del orificio a la superficie.'),
        h('FH-sin-el-2', Math.sqrt(G * hh), 'Olvidaste el 2: v = √(2·g·h), como en la caída libre desde una altura h.'),
        h('PR2-sin-raiz', 2 * G * hh, 'Te quedaste con 2·g·h, que es v². Falta la raíz.'),
      ];
      const solucion = [
        ['Profundidad del orificio bajo la superficie: h = ', v('H', f(H)), ' − ', v('y', f(y)), ` = ${f(hh)} m.`],
        ['Torricelli: el agua sale como si cayera libre desde la superficie. ', v('x', 'v'), ` = √(2 · 10 · ${f(hh)}) = √${f(20 * hh)} = `, v('x', ms(vel)), '.'],
      ];
      return cerrar(rng, semilla, { correcta: vel, errores, texto: ms, unidad: 'm/s', cualquiera: true, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'torricelli', sub, H, y } });
    }
    if (sub === 'alcance') {
      // h en HS (v entera) e y con √(2y/g) limpio: la salida y el tiempo de caída salen exactos.
      const hh = rng.elegir(HS), y = rng.elegir([0.2, 0.45, 0.8, 1.25]);
      const H = hh + y, x = 2 * Math.sqrt(hh * y);
      // Si el alcance coincide con H o con y (h = y, o h = y/4), el dato del enunciado sería la respuesta: se evita.
      if (!limpio(x, 2) || !limpio(H, 2) || x < 0.3 || Math.abs(x - H) < 1e-9 || Math.abs(x - y) < 1e-9) return null;
      const vel = Math.sqrt(2 * G * hh), tc = Math.sqrt(2 * y / G);
      const enunciado = marco(H, y);
      const pregunta = ['¿A qué ', v('x', 'distancia horizontal'), ' de la pared cae el chorro al piso?'];
      const errores = [
        h('FH-profundidad-total', 2 * Math.sqrt(H * y), `Para la rapidez de salida usaste toda la altura del agua (${f(H)} m). Va la profundidad del orificio: ${f(hh)} m.`, TRAMPAS),
        h('FH-cae-desde-la-superficie', 2 * Math.sqrt(hh * H), `Para el tiempo de caída usaste la altura del agua. El chorro cae desde el orificio, ${f(y)} m sobre el piso.`),
        h('FH-tiempo-sin-el-2', Math.sqrt(2 * hh * y), 'En el tiempo de caída olvidaste el 2: t = √(2·y/g).'),
        h('PR2-tiempo-sin-raiz', vel * 2 * y / G, 'El tiempo de caída es √(2·y/g); lo usaste sin la raíz.'),
      ];
      const solucion = [
        ['Salida (Torricelli), con h = ', v('H', f(H)), ' − ', v('y', f(y)), ` = ${f(hh)} m: `, v('vel', `v = √(2 · 10 · ${f(hh)}) = ${raiz(vel)} m/s`), ', horizontal.'],
        ['Caída desde el orificio: ', v('y', f(y)), ` = ½ · 10 · t², así que t = √(2 · ${f(y)}/10) = ${raiz(tc)} s.`],
        [v('x', 'x'), ' = ', v('vel', 'v'), ` · t = ${raiz(vel)} · ${raiz(tc)} = `, v('x', `${f(x)} m`), '. (Es lo mismo que x = 2·√(h·y).)'],
      ];
      return cerrar(rng, semilla, { correcta: x, errores, texto: x => `${raiz(x)} m`, unidad: 'm', cualquiera: true, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'torricelli', sub, H, y } });
    }
    if (sub === 'llegada') {
      const H = rng.elegir([0.8, 1.25, 1.8, 2.45, 3.2]), y = rng.elegir([0.2, 0.3, 0.45, 0.5, 0.6, 0.8, 1]), hh = H - y;
      if (hh < 0.2 - 1e-9 || !limpio(hh, 2)) return null;
      const vx = Math.sqrt(2 * G * hh), vy = Math.sqrt(2 * G * y), vel = Math.hypot(vx, vy);
      const enunciado = marco(H, y);
      const pregunta = ['¿Con qué ', v('x', 'rapidez'), ' llega el chorro al piso?'];
      const errores = [
        h('FH-profundidad-total', Math.sqrt(2 * G * (H + y)), `Para la salida usaste toda la altura del agua (${f(H)} m) en vez de la profundidad del orificio (${f(hh)} m).`, TRAMPAS),
        h('FH-solo-salida', vx, 'Esa es la rapidez de salida, horizontal. Al caer, el chorro gana además una velocidad vertical.'),
        h('FH-suma-escalar', vx + vy, 'Sumaste las dos componentes como números. Son perpendiculares: se suman con Pitágoras.'),
        h('FH-solo-caida', vy, 'Esa es solo la componente vertical que gana al caer. Falta la horizontal con que sale.'),
      ];
      const solucion = [
        ['Salida: h = ', v('H', f(H)), ' − ', v('y', f(y)), ` = ${f(hh)} m, `, v('vel', `vx = √(2 · 10 · ${f(hh)}) = ${raiz(vx)} m/s`), ' (no cambia al caer).'],
        ['Caída de ', v('y', `${f(y)} m`), `: vy = √(2 · 10 · ${f(y)}) = ${raiz(vy)} m/s.`],
        [v('x', 'v'), ` = √(vx² + vy²) = √(${f(vx * vx)} + ${f(vy * vy)}) = `, v('x', ms(vel)), `. Es lo mismo que caer libre los ${f(H)} m desde la superficie.`],
      ];
      return cerrar(rng, semilla, { correcta: vel, errores, texto: ms, unidad: 'm/s', cualquiera: true, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'torricelli', sub, H, y } });
    }
    // angulo: tan θ = vy/vx = √(y/h)
    const [ratio, nombre] = rng.elegir([[3, '60'], [1 / 3, '30'], [16 / 9, '53'], [9 / 16, '37']]);
    const hh = rng.elegir([0.2, 0.3, 0.45, 0.6, 0.8, 0.9, 1.2, 1.6]), y = Math.round(ratio * hh * 100) / 100;
    if (Math.abs(y - ratio * hh) > 1e-9) return null;
    if (!limpio(y, 2) || y > 2 || y < 0.15) return null;
    const H = Math.round((hh + y) * 100) / 100;
    const ang = Math.atan(Math.sqrt(y / hh)) * 180 / Math.PI;
    const grados = x => `${P.formatear(x, 0)}°`;
    const enunciado = [...marco(H, y), ' Usa los triángulos notables (30°, 37°, 53° y 60°).'];
    const pregunta = ['¿Qué ', v('x', 'ángulo'), ' forma con la horizontal la velocidad del chorro al llegar al piso?'];
    const deg = t => Math.atan(t) * 180 / Math.PI;
    const errores = [
      h('FH-angulo-con-la-vertical', 90 - ang, 'Ese es el ángulo con la vertical. Con la horizontal, tan θ = vy/vx.'),
      h('PR2-sin-raiz', deg(y / hh), 'Tomaste tan θ = y/h. Las rapideces van con la raíz de las alturas: tan θ = √(2gy)/√(2gh) = √(y/h).'),
      h('FH-profundidad-total', deg(Math.sqrt(y / H)), `Para la salida usaste toda la altura del agua (${f(H)} m) en vez de la profundidad del orificio (${f(hh)} m).`, TRAMPAS),
      h('FH-cae-desde-la-superficie', deg(Math.sqrt(H / hh)), `Para la velocidad vertical usaste una caída desde la superficie. El chorro cae desde el orificio: ${f(y)} m.`),
    ];
    const t = Math.sqrt(y / hh);
    const solucion = [
      ['Salida: h = ', v('H', f(H)), ' − ', v('y', f(y)), ` = ${f(hh)} m, `, v('vel', `vx = √(2 · 10 · ${f(hh)}) = ${raiz(Math.sqrt(20 * hh))} m/s`), '.'],
      ['Al llegar al piso, después de caer ', v('y', `${f(y)} m`), `: vy = √(2 · 10 · ${f(y)}) = ${raiz(Math.sqrt(20 * y))} m/s.`],
      [`tan θ = vy/vx = ${t > 1 ? (nombre === '60' ? '√3' : '4/3') : (nombre === '30' ? '√3/3' : '3/4')}, así que `, v('x', `θ = ${nombre}°`), ' bajo la horizontal.'],
    ];
    return cerrar(rng, semilla, { correcta: ang, errores, texto: grados, unidad: '°', cualquiera: true, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'torricelli', sub, H, y } });
  }

  // ================= densidad =================
  function densidad(rng, semilla, sub) {
    const VAR = { m: { nombre: sub === 'densidad' ? 'peso' : 'masa', color: 'o' }, V: { nombre: 'volumen', color: 'i' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'peso-especifico') {
      const rho = rng.elegir([700, 800, 900, 1030, 1200, 1260, 1400, 13600]), Vc = rng.elegir([50, 100, 200, 250, 500]);
      const m = rho * Vc / 1000, gam = rho * G;
      if (!limpio(m, 1)) return null;
      const [Obj, que] = rng.elegir([['Una probeta', 'una muestra líquida'], ['Un frasco del laboratorio', 'un líquido'], ['Un vaso medidor', 'un líquido']]);
      const enunciado = [`${Obj} contiene `, v('V', `${f(Vc)} cm³`), ` de ${que} cuya masa es `, v('m', `${f(m)} g`), '. Toma g = 10 m/s².'];
      const pregunta = ['¿Cuál es el ', v('x', 'peso específico'), ' del líquido?'];
      const nm3 = x => `${f3(x)} N/m³`;
      const errores = [
        h('FH-densidad-como-peso-especifico', rho, `Ese número es la densidad, ${f(rho)} kg/m³: masa entre volumen. El peso específico es peso entre volumen: γ = ρ·g, en N/m³.`, TRAMPAS),
        h('U4-gramos', gam * 1000, 'Usaste la masa en gramos como si fueran kilogramos. 1 g = 0,001 kg.'),
        h('U3-cm3', gam / 10000, 'Pasaste los cm³ a m³ dividiendo entre 100. Un metro cúbico tiene 100 · 100 · 100 = 1 000 000 cm³.'),
        h('FH-divide-entre-g', rho / G, 'Dividiste la densidad entre g. El peso es m·g: el peso específico es ρ·g, no ρ/g.'),
      ];
      const solucion = [
        ['Densidad: ρ = ', v('m', 'm'), '/', v('V', 'V'), ' = ', v('m', `${P.formatear(m / 1000, 4)} kg`), ' / ', v('V', `${P.formatear(Vc * 1e-6, 6)} m³`), ` = ${f(rho)} kg/m³.`],
        [v('x', 'γ'), ' = peso / volumen = ρ · g = ', `${f(rho)} · 10 = `, v('x', nm3(gam)), '. Densidad en kg/m³, peso específico en N/m³.'],
      ];
      return cerrar(rng, semilla, { correcta: gam, errores, texto: nm3, unidad: 'N/m³', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'densidad', sub, m_g: m, V_cm3: Vc } });
    }
    const rho = rng.elegir([600, 800, 900, 1200, 2500, 2700, 7800]), VL = rng.elegir([0.5, 1, 2, 4, 5]);
    const W = rho * G * VL / 1000;
    if (!limpio(W, 2)) return null;
    const cosa = rho > 1000 ? rng.elegir(['Una pieza de metal', 'Una piedra', 'Un ladrillo pequeño']) : rng.elegir(['Un trozo de madera', 'Un bloque de plástico', 'Un taco de corcho prensado']);
    const enunciado = [`${cosa} pesa `, v('m', `${f(W)} N`), ' y ocupa ', v('V', `${f(VL)} L`), '. Toma g = 10 m/s².'];
    const pregunta = ['¿Cuál es su ', v('x', 'densidad'), '?'];
    const kg = x => `${f3(x)} kg/m³`;
    const errores = [
      h('FH-peso-especifico-como-densidad', rho * G, `Dividiste el peso entre el volumen: eso es el peso específico, ${f(rho * G)} N/m³. La densidad es masa entre volumen: primero pasa el peso a masa, m = W/g.`, TRAMPAS),
      h('U3-litros', rho / 10, 'Pasaste los litros a m³ dividiendo entre 100. 1 m³ = 1000 L.'),
      h('FH-multiplica-g', rho * G * G, 'Multiplicaste por g en vez de dividir. La masa es el peso entre g.'),
    ];
    const solucion = [
      ['Masa: m = ', v('m', 'W'), `/g = ${f(W)}/10 = ${f(W / G)} kg. Volumen: `, v('V', `${f(VL)} L = ${P.formatear(VL / 1000, 4)} m³`), '.'],
      [v('x', 'ρ'), ` = m/V = ${f(W / G)} / ${P.formatear(VL / 1000, 4)} = `, v('x', kg(rho)), '.'],
    ];
    return cerrar(rng, semilla, { correcta: rho, errores, texto: kg, unidad: 'kg/m³', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'densidad', sub, W_N: W, V_L: VL } });
  }

  // ================= barometro =================
  // Columnas redondeadas a cm, cerca de lo que marca un barómetro en cada ciudad (solo para dar números de examen).
  const CIUDADES = [['Lima', 0.75], ['Arequipa', 0.57], ['Huancayo', 0.51], ['Cusco', 0.5], ['Juliaca', 0.48], ['Puno', 0.48], ['Cerro de Pasco', 0.45]];
  function barometro(rng, semilla, sub) {
    const VAR = { P: { nombre: 'presión atmosférica', color: 'o' }, hc: { nombre: 'columna de mercurio', color: 'i' }, z: { nombre: 'altura sobre el mar', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const cm = x => `${f(x)} cm`;
    if (sub === 'columna') {
      const [ciudad, hm] = rng.elegir(CIUDADES), Pa = HG * G * hm;
      const enunciado = [`Un día en ${ciudad}, la presión atmosférica es de `, v('P', `${P.formatear(Pa, 0)} Pa`), '. Se arma un barómetro de mercurio (13 600 kg/m³). Toma g = 10 m/s².'];
      const pregunta = ['¿Qué ', v('x', 'altura'), ' tiene la columna de mercurio?'];
      const errores = [
        h('FH-nivel-del-mar', 76, 'Esos 76 cm son la columna al nivel del mar. Aquí la presión atmosférica es otra: la columna se calcula con la presión que se da.', TRAMPAS),
        h('FH-sin-g', Pa / HG * 100, 'Dividiste la presión entre la densidad sin la g: P = ρ·g·h.'),
        h('FH-densidad-del-agua', Pa / (AGUA * G) * 100, 'Usaste la densidad del agua. El barómetro es de mercurio, 13,6 veces más denso: su columna es 13,6 veces más baja.'),
        h('FH-metros-como-cm', hm, `La cuenta da ${f(hm)} en metros; en centímetros son ${f(hm * 100)}.`),
      ];
      const solucion = [
        ['El aire sostiene la columna: ', v('P', 'P'), ' = ρ·g·', v('hc', 'h'), ' (arriba de la columna casi no hay presión).'],
        [v('x', 'h'), ` = ${P.formatear(Pa, 0)} / (13 600 · 10) = ${f(hm)} m = `, v('x', cm(hm * 100)), '.'],
      ];
      return cerrar(rng, semilla, { correcta: hm * 100, errores, texto: cm, unidad: 'cm', dec: 2, cualquiera: true, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'barometro', sub, P_Pa: Pa } });
    }
    if (sub === 'comparar') {
      const [ciudad, z] = rng.elegir([['Arequipa', 2400], ['Huancayo', 3200], ['Cusco', 3400], ['Juliaca', 3800], ['Puno', 3800], ['La Oroya', 3800], ['Cerro de Pasco', 4000]]);
      const rhoA = 0.85, dh = rhoA * z / HG * 100, hc = 76 - dh;   // cm
      const enunciado = ['A nivel del mar, en el Callao, un barómetro de mercurio (13 600 kg/m³) marca ', v('hc', '76 cm'), `. Se lo lleva a ${ciudad}, `, v('z', `${f(z)} m`),
        ' más arriba. Usa un modelo simple: el aire tiene una densidad constante de 0,85 kg/m³ entre las dos ciudades (en realidad se enrarece al subir). Toma g = 10 m/s².'];
      const pregunta = [`¿Qué `, v('x', 'altura'), ` marcará la columna de mercurio en ${ciudad}?`];
      const errores = [
        h('FH-nivel-del-mar', 76, 'La columna no se queda igual: arriba hay menos aire encima, así que el aire empuja menos y sostiene menos mercurio.', TRAMPAS),
        pa('F8-presion-crece-al-subir', 76 + dh, 'Sumaste la diferencia. Al subir, la presión del aire baja: queda menos aire encima.'),
        h('FH-da-la-bajada', dh, `${f(dh)} cm es cuánto baja la columna, no cuánto mide.`),
        h('FH-mezcla-m-y-cm', 76 - dh / 100, `Restaste la bajada en metros (${f(dh / 100)} m) a la columna en centímetros.`),
      ];
      const solucion = [
        ['Al subir ', v('z', `${f(z)} m`), `, se deja abajo una capa de aire que empujaba con ρ·g·h = 0,85 · 10 · ${f(z)} = ${f(rhoA * G * z)} Pa.`],
        [`Esa presión equivale a una columna de mercurio de ${f(rhoA * G * z)} / (13 600 · 10) = ${P.formatear(dh / 100, 4)} m = ${f(dh)} cm.`],
        [v('x', 'h'), ' = ', v('hc', '76'), ` − ${f(dh)} = `, v('x', cm(hc)), '.'],
      ];
      return cerrar(rng, semilla, { correcta: hc, errores, texto: cm, unidad: 'cm', dec: 2, cualquiera: true, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'barometro', sub, h0_cm: 76, z_m: z, rhoAire: rhoA } });
    }
    // absoluta o manométrica en una ciudad de altura
    const [ciudad, hm] = rng.elegir(CIUDADES.filter(c => c[1] < 0.6));
    const Patm = HG * G * hm / 1000;
    const Pm = rng.elegir([30, 50, 80, 120, 150, 200, 250]);
    const deCosa = rng.elegir(['de la llanta de una mototaxi', 'del tanque de una compresora', 'de una olla a presión']);
    if (deCosa.includes('olla') && Pm > 100) return null;
    if (sub === 'absoluta') {
      const enunciado = [`En ${ciudad}, un barómetro de mercurio (13 600 kg/m³) marca `, v('hc', cm(hm * 100)), `. Ahí mismo, el manómetro ${deCosa} marca `, v('P', kPa(Pm)), ' (presión manométrica). Toma g = 10 m/s².'];
      const pregunta = ['¿Cuál es la ', v('x', 'presión absoluta'), ` dentro ${deCosa}?`];
      const errores = [
        h('FH-manometrica-como-absoluta', Pm, 'Esa es la presión manométrica: lo que hay de más sobre la atmosférica. La absoluta le suma la presión del aire.', TRAMPAS),
        h('FH-nivel-del-mar', Pm + 100, `Sumaste 100 kPa, la presión del nivel del mar. En ${ciudad} el aire empuja menos: lo dice el barómetro.`, TRAMPAS),
        h('FH-resta-la-atmosfera', Pm - Patm, 'Restaste la atmosférica. La manométrica ya está sobre la atmosférica: para la absoluta se suma.'),
        h('FH-sin-g', Pm + HG * hm / 1000, 'Al pasar la columna a presión olvidaste la g: P = ρ·g·h.'),
      ];
      const solucion = [
        ['Atmosférica en ', ciudad, ': ', v('hc', `ρ·g·h = 13 600 · 10 · ${f(hm)}`), ` = ${P.formatear(Patm * 1000, 0)} Pa = ${f(Patm)} kPa.`],
        [v('x', 'P absoluta'), ' = ', v('P', 'manométrica'), ` + atmosférica = ${f(Pm)} + ${f(Patm)} = `, v('x', kPa(Pm + Patm)), '.'],
      ];
      return cerrar(rng, semilla, { correcta: Pm + Patm, errores, texto: kPa, unidad: 'kPa', dec: 2, cualquiera: true, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'barometro', sub, h_cm: hm * 100, Pman_kPa: Pm } });
    }
    const Pabs = Pm + Patm;
    const enunciado = [`En ${ciudad}, un barómetro de mercurio (13 600 kg/m³) marca `, v('hc', cm(hm * 100)), `. La presión absoluta del aire dentro ${deCosa} es de `, v('P', kPa(Pabs)), '. Toma g = 10 m/s².'];
    const pregunta = ['¿Qué ', v('x', 'presión manométrica'), ' marca su manómetro?'];
    const errores = [
      h('FH-nivel-del-mar', Pabs - 100, `Restaste 100 kPa, la presión del nivel del mar. En ${ciudad} la atmosférica es menor: lo dice el barómetro.`, TRAMPAS),
      h('FH-manometrica-como-absoluta', Pabs, 'Esa es la absoluta. El manómetro marca lo que hay de más sobre la presión del aire de afuera.', TRAMPAS),
      h('FH-suma-la-atmosfera', Pabs + Patm, 'Sumaste la atmosférica. Para pasar de absoluta a manométrica se resta.'),
      h('FH-sin-g', Pabs - HG * hm / 1000, 'Al pasar la columna a presión olvidaste la g: P = ρ·g·h.'),
    ];
    const solucion = [
      ['Atmosférica en ', ciudad, ': ', v('hc', `ρ·g·h = 13 600 · 10 · ${f(hm)}`), ` = ${f(Patm)} kPa.`],
      [v('x', 'manométrica'), ' = ', v('P', 'absoluta'), ` − atmosférica = ${f(Pabs)} − ${f(Patm)} = `, v('x', kPa(Pm)), '.'],
    ];
    return cerrar(rng, semilla, { correcta: Pm, errores, texto: kPa, unidad: 'kPa', dec: 2, cualquiera: true, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'barometro', sub, h_cm: hm * 100, Pabs_kPa: Pabs } });
  }

  const FAB = { caudal, continuidad, bernoulli, torricelli, densidad, barometro };
  return { id: 'fluidos-hidrodinamica', titulo: 'La manguera y el caño', generar, TIPOS };
});
