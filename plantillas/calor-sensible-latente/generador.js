/*
 * Generador «Calor que no sube la temperatura»: práctica de la idea 4 de «Materia y energía»
 * (quimica.materia-y-energia; contenido/teoria/quimica/materia-y-energia.js, idea «calor-sensible-latente»). Formato
 * "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['calor-sensible-latente']) y en
 * Node (require). No usa ningún motor de escena: Q = m · cₑ · ΔT y Q = m · L, tramo por tramo, como la teoría.
 *
 * Convenciones (docs/etapa2/decisiones.md, «Materia y energía»): el calor en calorías, con «1 cal ≈ 4,18 J» en los
 * datos; el calor específico se escribe cₑ (la c es la rapidez de la luz, idea 5); las escalas, solo como variaciones
 * (ΔK = Δ°C, Δ°F = 1,8 · Δ°C); el agua de Juliaca hierve a «unos 87 °C». Valores de libro, con «unos» si no son del
 * agua: cₑ del agua 1 cal/(g·°C) y del hielo 0,5; aceite unos 0,5, aluminio unos 0,22, hierro unos 0,11; fusión del
 * hielo 80 cal/g; vaporización del agua 540 cal/g (el valor de academia, a 100 °C, también para Juliaca).
 *
 * Tipos (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   sensible   (1) Q = m · cₑ · ΔT de una sustancia
 *   latente    (1) sub calor: Q = m · L para fundir o para hervir; (2) sub masa: cuánta agua hierve con un calor dado
 *   variacion  (1) una variación de temperatura en kelvin o en °F
 *   tramos     (2) hielo a 0 °C hasta agua a t °C: fundir y después calentar
 *   juliaca    (2) 1 L de agua hasta que empieza a hervir en Juliaca; (3) sub lima: cuánto más calor en Lima
 *   joules     (2) el calor de una terma, en kJ
 *   bajo-cero  (3) hielo bajo cero hasta agua: tres tramos
 *   final      (3) hielo a 0 °C recibe un calor: ¿a qué temperatura queda el agua?
 * _datos: { tipo, sub?, nivel, … } con los números del enunciado (masas en g, salvo kg en joules; temperaturas en °C).
 * Respuesta: un número (cal, g, K, °F, kJ o °C).
 *
 * Colores: un color fijo por magnitud, el de la teoría (docs/molde-unidad.md §5b; tabla COLOR, que compara
 * plantillas/materia-energia/colores.test.js; auditoría M1: cₑ y ΔT salían con los colores cambiados): la masa,
 * naranja (o); el calor Q, violeta (f), lo den o lo pidan; cₑ y L, turquesa (i); la temperatura y ΔT, verde (d). La
 * palabra dice cuál es la pedida. Sin figura.
 * Datos (docs/plan-calidad.md §3, punto 13): las fórmulas de calor sensible y latente, ΔT, los cₑ y L que hacen falta, las
 * equivalencias (1 L de agua = 1000 g, 1 kg = 1000 g, 1 cal ≈ 4,18 J, 1 kJ = 1000 J) y las variaciones de escala.
 * Nunca el calor de un tramo ya calculado. generar() vuelve a sortear si la respuesta quedara escrita en los datos.
 * Errores: MA6 (agregar calor siempre sube la temperatura, o se olvida el latente) y MA7 (el agua siempre hierve a
 *   100 °C), de docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md, respaldo parcial; los de la
 *   teoría QM-T-FINAL, QM-SIN-CE, QM-CERO, QM-OTRO-L, QM-SOLO-LATENTE, QM-SIN-LATENTE, QM-LECTURA-PUNTO y
 *   QM-ESCALA-SIN-FACTOR, y los nuevos QM-T-INICIAL, QM-DT-SUMA, QM-SUMA-LATENTES, QM-SENSIBLE-EN-LATENTE,
 *   QM-CE-HIELO, QM-UN-TRAMO, QM-SUMA-CIUDADES, QM-UN-LITRO, QM-T-SIGNO, QM-L-SIN-M, QM-CAL-COMO-J y QM-CAL-J-INVERSO, hipótesis; trampa QU1
 *   (docs/investigacion/unidades-ideas-erroneas.md).
 * Escala: un distractor va de 1/20 a 20 veces la correcta (QU, hasta 1000); el «0 °C» de MA6 en el tipo final y
 * el «0 cal» de QM-CERO en el latente, aparte.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'calor-sensible-latente';
  const FMA = 'docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md';
  const FUN = 'docs/investigacion/unidades-ideas-erroneas.md';
  const err = (id, explicacion) => (/^MA\d/.test(id) ? { id, explicacion, respaldo: 'parcial', fuente: FMA }
    : { id, explicacion, respaldo: 'hipotesis', fuente: P.esUnidades(id) ? FUN : null });
  const e = (valor, id, explicacion) => ({ valor, ...err(id, explicacion) });
  const v = P.v;
  const limpio = x => Number(x.toPrecision(12));
  const f = (x, d = 2) => P.formatear(limpio(x), d).replace(/^(−?\d) (\d{3})(?=,|$)/, '$1$2');
  const par = x => (x < 0 ? `(${f(x)})` : f(x));
  const LF = 80, LV = 540, CE_AGUA = 1, CE_HIELO = 0.5, TEB = 87;

  // ---- Datos (las mismas líneas de la teoría) ----
  const DEF_SENS = 'Calor sensible: Q = m · cₑ · ΔT';
  const DEF_LAT = 'Calor latente: Q = m · L';
  const DEF_DT = 'ΔT: temperatura final menos temperatura inicial';
  const D_AGUA = 'Agua líquida: cₑ = 1 cal/(g·°C)', D_HIELO = 'Hielo: cₑ = 0,5 cal/(g·°C)';
  const D_FUS = 'Hielo: se funde a 0 °C con L = 80 cal/g', D_VAP = 'Agua: al hervir, L = 540 cal/g';
  const D_DK = 'En una variación: ΔK = Δ°C', D_DF = 'En una variación: Δ°F = 1,8 · Δ°C';
  // Un color fijo por magnitud (docs/molde-unidad.md §5b): la tabla de la unidad, copia de `colores` de la teoría
  // (contenido/teoria/quimica/materia-y-energia.js). La práctica carga solo este archivo, así que la tabla va copiada;
  // plantillas/materia-energia/colores.test.js comprueba que coincida. Cada variable dice su magnitud (`mag`).
  const COLOR = { masa: 'o', volumen: 'i', longitud: 'i', densidad: 'f', calor: 'f', 'por gramo': 'i', temperatura: 'd', energía: 'f', luz: 'i',
    'energía de un balón': 'd', balones: 'h', tiempo: 'i', 'vida media': 'f', 'vidas medias': 'h', factor: 'i' };
  const va = (nombre, mag) => ({ nombre, mag, color: COLOR[mag] });
  const VARS = (pide, mag, extra = {}) => Object.assign({ m: va('masa', 'masa'), x: va(pide, mag) }, extra);
  const DT = { dT: va('cuánto sube la temperatura', 'temperatura') }, CE = { ce: va('calor específico', 'por gramo') };
  const QD = { Q: va('calor que recibe', 'calor') };

  function numericas(rng, correcta, errores, texto, o = {}) {
    const ok = errores.filter(x => Number.isFinite(x.valor) && x.valor !== correcta
      && (o.cero && x.valor === 0 ? true : x.valor > 0 && P.enEscala(x.valor, correcta, x.id)));
    return P.armar({ correcta, errores: ok, rng, texto, negativos: !!o.cero });
  }
  const cal = x => `${f(x)} cal`;

  // ---- sensible ----
  const SUST = [
    { id: 'agua', nombre: 'agua', dato: D_AGUA, ce: 1 }, { id: 'aceite', nombre: 'aceite', dato: 'Aceite: cₑ = unos 0,5 cal/(g·°C)', ce: 0.5 },
    { id: 'aluminio', nombre: 'aluminio', dato: 'Aluminio: cₑ = unos 0,22 cal/(g·°C)', ce: 0.22 }, { id: 'hierro', nombre: 'hierro', dato: 'Hierro: cₑ = unos 0,11 cal/(g·°C)', ce: 0.11 },
  ];
  function tSensible(rng) {
    const x = rng.elegir(SUST), m = rng.elegir([50, 100, 200, 250, 500]), t0 = rng.elegir([10, 15, 20]), t1 = t0 + rng.elegir([20, 30, 40, 50]);
    const d = t1 - t0, q = limpio(m * x.ce * d);
    const errores = [
      e(m * x.ce * t1, 'QM-T-FINAL', `Bien m · cₑ. Pero ΔT es lo que sube, final menos inicial (${d} °C), no ${t1}: así salen ${cal(m * x.ce * t1)}.`),
      e(m * x.ce * t0, 'QM-T-INICIAL', `Bien m · cₑ. Pero ΔT es lo que sube, ${d} °C, no la temperatura de partida: así salen ${cal(m * x.ce * t0)}.`),
      e(m * x.ce * (t0 + t1), 'QM-DT-SUMA', `Bien m · cₑ. Pero ΔT es una resta, ${t1} − ${t0}, no una suma: así salen ${cal(m * x.ce * (t0 + t1))}.`),
      e(m * d, 'QM-SIN-CE', `Bien m · ΔT. Pero falta el calor específico del ${x.nombre}: así salen ${cal(m * d)}.`),
    ];
    return {
      variables: VARS('calor (lo que se pide)', 'calor', { ...DT, ...CE }),
      enunciado: [`Se calientan `, v('m', `${m} g`), ` de ${x.nombre} de ${t0} °C a ${t1} °C, sin que cambie de estado.`],
      pregunta: ['¿Cuánto ', v('x', 'calor'), ' necesitan?'], datos: [DEF_SENS, x.dato, DEF_DT],
      alternativas: numericas(rng, q, errores, cal), respuesta: { valor: q, unidad: 'cal' },
      solucion: [
        ['No cambia de estado, así que es calor sensible. La temperatura sube ', v('dT', `ΔT = ${t1} − ${t0} = ${d} °C`), '.'],
        ['Con Q = m · cₑ · ΔT: Q = ', v('m', `${m}`), ' · ', v('ce', f(x.ce)), ' · ', v('dT', `${d}`), ' = ', v('x', cal(q)), '.'],
      ],
      _datos: { tipo: 'sensible', nivel: 1, sustancia: x.id, ce: x.ce, m, t0, t1 },
    };
  }

  // ---- latente ----
  function tLatente(rng) {
    const sub = rng.elegir(['calor', 'calor', 'masa']);
    if (sub === 'calor') {
      const funde = rng.moneda(), m = rng.elegir([20, 50, 100, 150, 200, 250]), L = funde ? LF : LV, otro = funde ? LV : LF, q = m * L;
      const errores = [
        e(m * otro, 'QM-OTRO-L', `Bien Q = m · L. Pero ${otro} cal/g es el L de ${funde ? 'hervir' : 'fundir'}: así salen ${cal(m * otro)}.`),
        e(m * (LF + LV), 'QM-SUMA-LATENTES', `Bien Q = m · L. Pero solo hay un cambio de estado: no se suman los dos L. Así salen ${cal(m * (LF + LV))}.`),
        e(0, 'QM-CERO', 'Bien: la temperatura no cambia. Pero el calor sí entra: se usa en cambiar el estado, así que no es 0 cal.'),
      ];
      if (!funde) errores.push(e(m * CE_AGUA * 100, 'QM-SENSIBLE-EN-LATENTE', `Bien usar la masa. Pero el agua ya hierve: no sube 100 °C, cambia de estado. Así salen ${cal(m * 100)}.`));
      return {
        variables: VARS('calor (lo que se pide)', 'calor', { L: va('calor latente', 'por gramo') }),
        enunciado: funde ? ['Hay ', v('m', `${m} g`), ' de hielo a 0 °C.'] : ['Una olla hierve. Hay ', v('m', `${m} g`), ' de esa agua.'],
        pregunta: ['¿Cuánto ', v('x', 'calor'), funde ? ' necesitan para fundirse por completo?' : ' necesitan para volverse vapor por completo?'],
        datos: [DEF_LAT, D_FUS, D_VAP],
        alternativas: numericas(rng, q, errores, cal, { cero: true }), respuesta: { valor: q, unidad: 'cal' },
        solucion: [
          [funde ? 'Ya está a 0 °C: todo el calor va a fundirlo, sin subir la temperatura.' : 'Ya hierve: todo el calor va a cambiar el estado, sin subir la temperatura.'],
          ['Q = ', v('m', `${m}`), ' · ', v('L', `${L}`), ' = ', v('x', cal(q)), '.'],
        ],
        _datos: { tipo: 'latente', sub, nivel: 1, funde, m },
      };
    }
    const m = rng.elegir([20, 25, 40, 50, 75]), q = m * LV;
    const errores = [
      e(q / LF, 'QM-OTRO-L', `Bien despejar m = Q / L. Pero hervir pide 540 cal/g; 80 es fundir. Así salen ${f(q / LF)} g.`),
      e(q / (LF + LV), 'QM-SUMA-LATENTES', `Bien despejar m = Q / L. Pero solo hay un cambio de estado: no se suman los dos L. Así salen ${f(q / (LF + LV))} g.`),
      e(q / 100, 'QM-SENSIBLE-EN-LATENTE', `Bien despejar la masa. Pero el agua ya hierve: no sube 100 °C, cambia de estado. Así salen ${f(q / 100)} g.`),
    ];
    return {
      variables: VARS('masa que hierve (lo que se pide)', 'masa', QD),
      enunciado: ['Una olla que ya hierve recibe ', v('Q', cal(q)), ' más.'], pregunta: ['¿Cuántos ', v('x', 'gramos de agua'), ' se vuelven vapor?'],
      datos: [DEF_LAT, D_VAP],
      alternativas: numericas(rng, m, errores, x => `${f(x)} g`), respuesta: { valor: m, unidad: 'g' },
      solucion: [
        ['Mientras hierve, todo el calor cambia el estado, así que de Q = m · L se despeja m = Q / L.'],
        ['m = ', v('Q', `${f(q)}`), ` ÷ ${LV} = `, v('x', `${f(m)} g`), '.'],
      ],
      _datos: { tipo: 'latente', sub, nivel: 2, q },
    };
  }

  // ---- variacion ----
  function tVariacion(rng) {
    const t0 = rng.elegir([-10, 5, 12, 15, 20]), t1 = rng.elegir([60, 70, 75, 90]), d = t1 - t0, aF = rng.moneda();
    const correcta = aF ? limpio(1.8 * d) : d, u = aF ? '°F' : 'K';
    const errores = aF ? [
      e(1.8 * d + 32, 'QM-LECTURA-PUNTO', `Bien multiplicar por 1,8. Pero el +32 es para leer un punto, no para una variación: ${f(1.8 * d + 32)} °F.`),
      e(d, 'QM-ESCALA-SIN-FACTOR', `Bien la variación en °C, ${d}. Pero cada grado Celsius son 1,8 °F: falta multiplicar.`),
      e(d / 1.8, 'QM-ESCALA-SIN-FACTOR', `Bien el factor 1,8. Pero va multiplicando: el °F es más chico. Así salen ${f(d / 1.8)} °F.`),
      e(1.8 * t1, 'QM-T-FINAL', `Bien multiplicar por 1,8. Pero se multiplica la variación, ${d} °C, no la temperatura final: ${f(1.8 * t1)}.`),
    ] : [
      e(d + 273, 'QM-LECTURA-PUNTO', `Bien la variación en °C, ${d}. Pero sumar 273 sirve para leer un punto; en una variación, ΔK = Δ°C: ${d + 273}.`),
      e(1.8 * d, 'QM-ESCALA-SIN-FACTOR', `Bien la variación en °C, ${d}. Pero el 1,8 es de los °F; un kelvin mide lo mismo que un °C: ${f(1.8 * d)}.`),
      e(t1 + 273, 'QM-LECTURA-PUNTO', `Bien pasar a kelvin. Pero ${t1 + 273} K es la temperatura final, no cuánto varió.`),
      e(t1 + Math.abs(t0), 'QM-DT-SUMA', `Bien restar las dos lecturas. Pero ${t1} − ${par(t0)} = ${d}, no ${t1 + Math.abs(t0)}.`),
    ];
    return {
      variables: { x: va('variación (lo que se pide)', 'temperatura') },
      enunciado: [`En una curva de calentamiento, un líquido pasa de ${f(t0)} °C a ${t1} °C.`],
      pregunta: ['¿Cuánto ', v('x', 'varió su temperatura'), aF ? ', en °F?' : ', en kelvin?'], datos: [D_DK, D_DF],
      alternativas: numericas(rng, correcta, errores, x => `${f(x)} ${u}`), respuesta: { valor: correcta, unidad: u },
      solucion: [
        [`Primero se calcula la variación en °C, la final menos la inicial: ${t1} − ${par(t0)} = ${d} °C.`],
        [aF ? ['Δ°F = 1,8 · Δ°C = 1,8 · ', `${d} = `, v('x', `${f(correcta)} °F`), '. No se suma 32, porque eso sirve para leer un punto.']
          : ['ΔK = Δ°C = ', v('x', `${d} K`), '. No se suma 273, porque eso sirve para leer un punto.']].flat(),
      ],
      _datos: { tipo: 'variacion', nivel: 1, t0, t1, a: u },
    };
  }

  // ---- tramos: hielo a 0 °C hasta agua a t ----
  function tTramos(rng) {
    const m = rng.elegir([50, 100, 200]), t = rng.elegir([10, 20, 25, 30, 40]), q1 = m * LF, q2 = m * t, q = q1 + q2;
    const errores = [
      e(q1, 'QM-SOLO-LATENTE', `Bien fundir: ${cal(q1)}. Pero falta calentar el agua desde 0 °C hasta ${t} °C.`),
      e(q2, 'MA6', `Bien calentar el agua: ${cal(q2)}. Pero antes hay que fundir el hielo, sin que suba la temperatura.`),
      e(m * LV + q2, 'QM-OTRO-L', `Bien sumar dos tramos. Pero fundir pide 80 cal/g; 540 es hervir. Así salen ${cal(m * LV + q2)}.`),
      e(q1 + m * CE_HIELO * t, 'QM-CE-HIELO', `Bien los dos tramos. Pero lo que se calienta ya es agua líquida, de cₑ = 1, no hielo. Así salen ${cal(q1 + m * CE_HIELO * t)}.`),
    ];
    return {
      variables: VARS('calor (lo que se pide)', 'calor', { ...DT, ...CE }),
      enunciado: ['Hay ', v('m', `${m} g`), ` de hielo a 0 °C, que se quieren llevar hasta agua líquida a ${t} °C.`],
      pregunta: ['¿Cuánto ', v('x', 'calor'), ' hace falta?'], datos: [DEF_LAT, DEF_SENS, D_FUS, D_AGUA],
      alternativas: numericas(rng, q, errores, cal), respuesta: { valor: q, unidad: 'cal' },
      solucion: [
        ['Primero el hielo se funde a 0 °C: Q = ', v('m', `${m}`), ' · 80 = ', cal(q1), '.'],
        ['Después se calienta el agua que quedó: Q = ', v('m', `${m}`), ' · ', v('ce', '1'), ' · ', v('dT', `${t}`), ' = ', cal(q2), '.'],
        ['El calor total es la suma de los dos tramos: ', `${f(q1)} + ${f(q2)} = `, v('x', cal(q)), '.'],
      ],
      _datos: { tipo: 'tramos', nivel: 2, m, t },
    };
  }

  // ---- juliaca ----
  function tJuliaca(rng) {
    const sub = rng.elegir(['juliaca', 'juliaca', 'lima']), L = rng.elegir([1, 2, 3]), g = L * 1000, t0 = rng.elegir([10, 12, 15, 17, 20]);
    if (sub === 'juliaca') {
      const q = g * (TEB - t0);
      const errores = [
        e(g * (100 - t0), 'MA7', `Bien Q = m · cₑ · ΔT. Pero en Juliaca el agua hierve a unos 87 °C, no a 100 °C: así salen ${cal(g * (100 - t0))}.`),
        e(g * TEB, 'QM-T-FINAL', `Bien la masa, ${f(g)} g. Pero ΔT es lo que sube, 87 − ${t0}, no 87: así salen ${cal(g * TEB)}.`),
        e(g * t0, 'QM-T-INICIAL', `Bien la masa, ${f(g)} g. Pero ΔT es lo que sube, 87 − ${t0}, no la temperatura de partida: así salen ${cal(g * t0)}.`),
        e(g * (TEB - t0) + g * LV, 'MA6', `Bien calentar hasta 87 °C. Pero la pregunta es hasta que empieza a hervir: no hace falta volverla vapor. Así salen ${cal(g * (TEB - t0) + g * LV)}.`),
      ];
      return {
        variables: VARS('calor (lo que se pide)', 'calor', { ...DT, ...CE }),
        enunciado: ['En Juliaca se pone a calentar ', v('m', `${L} L`), ` de agua a ${t0} °C.`],
        pregunta: ['¿Cuánto ', v('x', 'calor'), ' necesita para empezar a hervir?'],
        datos: [DEF_SENS, D_AGUA, '1 L de agua = 1000 g', 'En Juliaca el agua hierve a unos 87 °C'],
        alternativas: numericas(rng, q, errores, cal), respuesta: { valor: q, unidad: 'cal' },
        solucion: [
          ['La masa en gramos es ', v('m', `${L} L`), ` = ${f(g)} g, y la temperatura sube `, v('dT', `87 − ${t0} = ${TEB - t0} °C`), '.'],
          ['Q = ', `${f(g)} · `, v('ce', '1'), ' · ', v('dT', `${TEB - t0}`), ' = ', v('x', cal(q)), '.'],
        ],
        _datos: { tipo: 'juliaca', sub, nivel: 2, litros: L, t0 },
      };
    }
    if (L === 1) return null; // en Lima, 2 L o 3 L: así cabe el error de tomar un solo litro
    const q = g * (100 - TEB);
    const errores = [
      e(1000 * (100 - TEB), 'QM-UN-LITRO', `Bien la diferencia de 13 °C. Pero son ${L} L, ${f(g)} g de agua, no 1000 g: así salen ${cal(1000 * (100 - TEB))}.`),
      e(g * (100 - t0), 'QM-UN-TRAMO', `Bien el calor de Lima, ${cal(g * (100 - t0))}. Pero piden cuánto más que en Juliaca: falta restar.`),
      e(g * (TEB - t0), 'QM-UN-TRAMO', `Bien el calor de Juliaca, ${cal(g * (TEB - t0))}. Pero piden cuánto más hace falta en Lima.`),
      e(g * (100 - t0) + g * (TEB - t0), 'QM-SUMA-CIUDADES', `Bien el calor de cada ciudad. Pero se pide la diferencia, no la suma: así salen ${cal(g * (100 - t0) + g * (TEB - t0))}.`),
      e(g * (100 - TEB) * 2, 'QM-DT-SUMA', 'Bien la masa. Pero la diferencia entre 100 °C y 87 °C es una sola, 13 °C: no se cuenta dos veces.'),
    ];
    return {
      variables: VARS('calor de más (lo que se pide)', 'calor', { ...DT, ...CE }),
      enunciado: ['En Juliaca y en Lima se pone a calentar ', v('m', `${L} L`), ` de agua a ${t0} °C.`],
      pregunta: ['¿Cuánto ', v('x', 'calor de más'), ' hace falta en Lima para que empiece a hervir?'],
      datos: [DEF_SENS, D_AGUA, '1 L de agua = 1000 g', 'Hierve a unos 87 °C en Juliaca y a unos 100 °C en Lima'],
      alternativas: numericas(rng, q, errores, cal), respuesta: { valor: q, unidad: 'cal' },
      solucion: [
        ['En Lima el agua sube ', `100 − ${t0} = ${100 - t0} °C, y en Juliaca, 87 − ${t0} = ${TEB - t0} °C. La diferencia es de `, v('dT', `${100 - TEB} °C`), '.'],
        ['Q = ', `${f(g)} · `, v('ce', '1'), ' · ', v('dT', `${100 - TEB}`), ' = ', v('x', cal(q)), '.'],
        ['Comprobación: en la altura el agua hierve antes, pero a menos temperatura, y por eso pide menos calor.'],
      ],
      _datos: { tipo: 'juliaca', sub, nivel: 3, litros: L, t0 },
    };
  }

  // ---- joules: una terma ----
  function tJoules(rng) {
    const kg = rng.elegir([2, 5, 10, 20]), t0 = rng.elegir([10, 15, 20]), t1 = rng.elegir([40, 50, 60]), g = kg * 1000, d = t1 - t0;
    const c = g * d, kJ = limpio(c * 4.18 / 1000);
    const errores = [
      e(c / 1000, 'QM-CAL-COMO-J', `Bien el calor en calorías, ${f(c)} cal. Pero falta pasar a joules: cada caloría son unos 4,18 J. Así salen ${f(c / 1000)} kJ.`),
      e(c / 4.18 / 1000, 'QM-CAL-J-INVERSO', `Bien el calor en calorías. Pero 1 cal son unos 4,18 J: se multiplica, no se divide. Así salen ${f(c / 4.18 / 1000)} kJ.`),
      e(kg * d * 4.18 / 1000, 'QU1-kg-sin-g', `Bien ΔT y el paso a kJ. Pero la masa va en gramos: ${kg} kg = ${f(g)} g. Así salen ${f(kg * d * 4.18 / 1000)} kJ.`),
      e(g * t1 * 4.18 / 1000, 'QM-T-FINAL', `Bien la masa y el paso a kJ. Pero ΔT es lo que sube, ${d} °C, no ${t1}: así salen ${f(g * t1 * 4.18 / 1000)} kJ.`),
    ];
    return {
      variables: VARS('calor en kJ (lo que se pide)', 'calor', { ...DT, ...CE }),
      enunciado: ['Una terma calienta ', v('m', `${kg} kg`), ` de agua de ${t0} °C a ${t1} °C.`],
      pregunta: ['¿Cuánto ', v('x', 'calor'), ' recibe el agua, en kJ?'],
      datos: [DEF_SENS, D_AGUA, '1 kg = 1000 g', '1 cal ≈ 4,18 J', '1 kJ = 1000 J'],
      alternativas: numericas(rng, kJ, errores, x => `${f(x)} kJ`), respuesta: { valor: kJ, unidad: 'kJ' },
      solucion: [
        ['La masa en gramos es ', v('m', `${f(g)} g`), ', y la temperatura sube ', v('dT', `${d} °C`), '.'],
        ['Q = ', v('m', f(g)), ' · ', v('ce', '1'), ' · ', v('dT', `${d}`), ` = ${f(c)} cal.`],
        [`Cada caloría son unos 4,18 J, y 1000 J son 1 kJ: ${f(c)} · 4,18 = ${f(c * 4.18)} J = `, v('x', `${f(kJ)} kJ`), '.'],
      ],
      _datos: { tipo: 'joules', nivel: 2, kg, t0, t1 },
    };
  }

  // ---- bajo-cero: tres tramos ----
  function tBajoCero(rng) {
    const m = rng.elegir([50, 100, 200]), T0 = rng.elegir([10, 20]), t = rng.elegir([10, 20, 30, 40]);
    const q1 = m * CE_HIELO * T0, q2 = m * LF, q3 = m * t, q = q1 + q2 + q3;
    const errores = [
      e(m * T0 + q2 + q3, 'QM-CE-HIELO', `Bien los tres tramos. Pero el hielo tiene cₑ = 0,5, no 1: el primer tramo da ${cal(q1)}. Así salen ${cal(m * T0 + q2 + q3)}.`),
      e(q1 + q3, 'MA6', `Bien calentar el hielo y el agua. Pero a 0 °C el hielo se funde y pide ${cal(q2)}, sin subir la temperatura.`),
      e(m * (t + T0), 'QM-UN-TRAMO', `Bien usar la masa y ΔT = ${t + T0} °C. Pero hay tres tramos: el hielo, la fusión y el agua. Así salen ${cal(m * (t + T0))}.`),
      e(q2 + q3 - q1, 'QM-T-SIGNO', `Bien los tres tramos. Pero el hielo sube de −${T0} °C a 0 °C: ΔT = +${T0}, y ese calor se suma. Así salen ${cal(q2 + q3 - q1)}.`),
    ];
    return {
      variables: VARS('calor (lo que se pide)', 'calor', { ...DT, ...CE }),
      enunciado: ['Hay ', v('m', `${m} g`), ` de hielo a −${T0} °C, que se quieren llevar hasta agua líquida a ${t} °C.`],
      pregunta: ['¿Cuánto ', v('x', 'calor'), ' hace falta?'], datos: [DEF_LAT, DEF_SENS, D_HIELO, D_FUS, D_AGUA],
      alternativas: numericas(rng, q, errores, cal), respuesta: { valor: q, unidad: 'cal' },
      solucion: [
        ['Primero el hielo sube de −', `${T0} °C a 0 °C, sin fundirse: Q = `, v('m', `${m}`), ' · ', v('ce', '0,5'), ' · ', v('dT', `${T0}`), ` = ${f(q1)} cal.`],
        ['Después se funde a 0 °C: Q = ', v('m', `${m}`), ` · 80 = ${f(q2)} cal. Al final, el agua sube hasta ${t} °C: Q = `, v('m', `${m}`), ' · ', v('ce', '1'), ' · ', v('dT', `${t}`), ` = ${f(q3)} cal.`],
        ['El calor total es la suma de los tres tramos: ', `${f(q1)} + ${f(q2)} + ${f(q3)} = `, v('x', cal(q)), '.'],
      ],
      _datos: { tipo: 'bajo-cero', nivel: 3, m, T0, t },
    };
  }

  // ---- final: ¿a qué temperatura queda? ----
  function tFinal(rng) {
    const m = rng.elegir([50, 100, 200]), t = rng.elegir([10, 20, 25, 30, 40, 50]), q = m * LF + m * t;
    const errores = [
      e(q / m, 'QM-SIN-LATENTE', `Bien usar Q = m · cₑ · ΔT. Pero primero el hielo se funde y gasta 80 cal por gramo. Así salen ${f(q / m)} °C.`),
      e(2 * t, 'QM-CE-HIELO', `Bien restar el calor de fundir. Pero lo que se calienta ya es agua, de cₑ = 1, no hielo de 0,5: así salen ${f(2 * t)} °C.`),
      e((q - LF) / m, 'QM-L-SIN-M', `Bien restar el calor de fundir. Pero son 80 cal por cada gramo: ${m} · 80. Así salen ${f((q - LF) / m)} °C.`),
      e(0, 'MA6', 'Bien: mientras se funde, el agua está a 0 °C. Pero el calor alcanza para fundir todo el hielo y sobra.'),
    ];
    return {
      variables: VARS('temperatura final (lo que se pide)', 'temperatura', QD),
      enunciado: ['A ', v('m', `${m} g`), ' de hielo a 0 °C se les dan ', v('Q', cal(q)), '.'],
      pregunta: ['¿A qué ', v('x', 'temperatura'), ' queda el agua?'], datos: [DEF_LAT, DEF_SENS, D_FUS, D_AGUA],
      alternativas: numericas(rng, t, errores, x => `${f(x)} °C`, { cero: true }), respuesta: { valor: t, unidad: '°C' },
      solucion: [
        ['Fundir todo pide ', v('m', `${m}`), ` · 80 = ${f(m * LF)} cal. El calor alcanza, y sobran ${f(q)} − ${f(m * LF)} = ${f(m * t)} cal.`],
        ['Lo que sobra calienta el agua desde 0 °C: ΔT = ', `${f(m * t)} ÷ (`, v('m', `${m}`), ' · 1) = ', v('x', `${t} °C`), '.'],
      ],
      _datos: { tipo: 'final', nivel: 3, m, q },
    };
  }

  const TIPOS = ['sensible', 'sensible', 'latente', 'latente', 'variacion', 'tramos', 'tramos', 'juliaca', 'juliaca', 'joules', 'bajo-cero', 'bajo-cero', 'final', 'final'];
  const NIVEL = { sensible: 1, latente: 1, variacion: 1, tramos: 2, juliaca: 2, joules: 2, 'bajo-cero': 3, final: 3 };
  const CONSTRUIR = { sensible: tSensible, latente: tLatente, variacion: tVariacion, tramos: tTramos, juliaca: tJuliaca, joules: tJoules, 'bajo-cero': tBajoCero, final: tFinal };
  const PAPEL = { 'papel-1': 'sensible', 'papel-2': 'latente', 'papel-3': 'variacion', 'papel-4': 'tramos', 'papel-5': 'juliaca',
    'papel-6': 'joules', 'papel-7': 'bajo-cero', 'papel-8': 'final' };
  // ¿El número de la respuesta está escrito en los datos? (entonces se vuelve a sortear)
  const escaparRe = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const fuga = (pr, c) => new RegExp(`(^|[^\\d,])${escaparRe(c.split(' ')[0])}(?![\\d,])`).test(pr.datos.join('\n'));

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = PAPEL[String(semilla)] || rng.elegir(TIPOS);
    for (let intento = 0; intento < 300; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      if (pr && pr.alternativas.length >= 4 && !fuga(pr, pr.alternativas.find(a => a.correcta).texto)) {
        return { id: `${ID}#${semilla}`, variables: pr.variables, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos,
          alternativas: pr.alternativas, solucion: pr.solucion, respuesta: pr.respuesta, _datos: pr._datos };
      }
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  return { id: ID, titulo: 'Calor que no sube la temperatura', generar, NIVEL, COLOR };
});
