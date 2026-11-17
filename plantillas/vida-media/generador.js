/*
 * Generador «La mitad cada cierto tiempo»: práctica de la idea 6 de «Materia y energía» (quimica.materia-y-energia;
 * contenido/teoria/quimica/materia-y-energia.js, idea «vida-media»). Formato "predicciones" (docs/arquitectura.md).
 * Funciona en el navegador (window.Generadores['vida-media']) y en Node (require). No usa ningún motor: en cada vida
 * media se desintegra la mitad de lo que queda, así que tras n = t ÷ vida media queda m = m₀ / 2ⁿ (las mismas cuentas
 * que MotorMateria.desintegracion, que usa la teoría; aquí van escritas aparte para que el generador cargue solo).
 * Desde el 17 nov (Gerson, mesa de revisión: la vida media vuelve a la unidad) esta es la práctica de vida media de
 * Materia y energía; conversiones-quimica y configuracion-ubicacion ya no la sacan en esta unidad.
 *
 * Tipos (nivel 1: un paso; 2: dos pasos; 3: de examen, como lo pregunta San Marcos):
 *   queda        (1) la masa inicial y cuántas vidas medias pasan: ¿cuánto queda?
 *   masa         (2) la masa inicial, el tiempo y la vida media: ¿cuántos gramos quedan?
 *   tiempo       (2) la fracción o el porcentaje que queda: ¿cuánto tiempo pasó? (un hueso con carbono-14 o una dosis)
 *   desintegrado (2) el tiempo y la vida media: ¿qué porcentaje o qué fracción se desintegró?
 *   vida         (2) dos masas y el tiempo entre ellas: ¿cuál es la vida media?
 *   unidades     (3) la vida media en horas o días y el tiempo en días o semanas: ¿qué fracción queda?
 *   deducir      (3) la vida media sale de dos masas y se usa para otro tiempo: ¿cuántos gramos quedan?
 * _datos: queda { tipo, nivel, fuente, m0, n }; masa { …, fuente, m0, t }; tiempo { …, sustancia, n, como: 'fraccion' |
 *   'porcentaje' | 'parte' }; desintegrado { …, sustancia, t, como: 'porcentaje' | 'fraccion' }; vida { …, fuente, m0, n,
 *   t }; unidades { …, sustancia, t, unidadT }; deducir { …, fuente, m0, t1, t2 }. Las vidas medias salen de FUENTES y
 *   SUSTANCIAS (exportadas). Respuestas: un número (g, años, días u horas, % o una fracción como número: 0,125 = 1/8).
 *
 * Vidas medias de libro, con «unos» (molde §4): carbono-14 unos 5730 años, cobalto-60 unos 5,3, cesio-137 unos 30,
 * estroncio-90 unos 29; yodo-131 unos 8 días, fósforo-32 unos 14 días, tecnecio-99m unas 6 horas. Masas creíbles
 * (contrato, punto 10): en gramos solo las fuentes grandes que existen (planta que irradia alimentos, equipo de
 * radioterapia, generador de faro); el carbono-14 de un hueso y lo de hospital van en fracción o porcentaje.
 * Colores (como la teoría de la idea, un color por magnitud): masa y lo que queda o se desintegró, naranja (o); el tiempo
 * que pasa, turquesa (i); la vida media, violeta (f); las vidas medias que caben, carmín (h). Sin figura.
 * Datos (docs/plan-calidad.md §3, punto 13): la definición de vida media y la fórmula general (m = m_0 / 2ⁿ,
 * n = t ÷ vida media, fracción 1/2ⁿ, lo desintegrado), la vida media de la sustancia con «unos» y la equivalencia de
 * tiempo cuando hace falta. Nunca n ya contado ni la fracción ya escrita como potencia.
 * Errores (hipótesis; docs/investigacion/cinetica-ideas-erroneas.md, «Vida media»; comparten id con conversiones-quimica
 * y con la teoría): AQ-vm-lineal (lo mismo en cada vida media), AQ-vm-divide-entre-2n, AQ-vm-divide-entre-n,
 * AQ-vm-desintegrada, AQ-vm-tiempo-como-una-vida, AQ-vm-una-vida-de-menos y de-mas, AQ-vm-multiplica-fraccion,
 * AQ-vm-divide-vida-media, AQ-vm-sin-convertir, AQ-vm-lee-tiempo-sin-mitad y AQ-vm-multiplica-tiempo.
 * Escala: un distractor va de 1/20 a 20 veces la correcta.
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
  const ID = 'vida-media';
  const FCI = 'docs/investigacion/cinetica-ideas-erroneas.md';
  const e = (valor, id, explicacion) => ({ valor, id, explicacion, respaldo: 'hipotesis', fuente: FCI });
  const v = P.v;
  const limpio = x => Number(x.toPrecision(12));
  // 5730 sin espacio; 11 460 con su espacio de miles.
  const f = (x, d = 2) => P.formatear(limpio(x), d).replace(/^(−?\d)\s(\d{3})(?=,|$)/, '$1$2');
  const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸'];
  // Una fracción de potencias de 2 (0,125 → 1/8; 0,9375 → 15/16).
  function fr(x) { for (let d = 1; d <= 4096; d *= 2) if (Math.abs(x * d - Math.round(x * d)) < 1e-9) return d === 1 ? String(Math.round(x)) : `${Math.round(x * d)}/${d}`; return f(x, 4); }
  const pc = x => `${f(x, 2)} %`;

  const FUENTES = [
    { id: 'cobalto', nombre: 'cobalto-60', vm: 5.3, donde: 'Una planta que irradia alimentos tiene', masas: [20, 40, 64, 80] },
    { id: 'cesio', nombre: 'cesio-137', vm: 30, donde: 'Un equipo antiguo de radioterapia guarda', masas: [4, 8, 12, 16] },
    { id: 'estroncio', nombre: 'estroncio-90', vm: 29, donde: 'El generador eléctrico de un faro antiguo tiene', masas: [40, 80, 120, 160] },
  ];
  const SUSTANCIAS = [
    { id: 'c14', nombre: 'carbono-14', vm: 5730, u: 'años' },
    { id: 'yodo', nombre: 'yodo-131', vm: 8, u: 'días', uso: 'se usa para tratar la tiroides' },
    { id: 'tecnecio', nombre: 'tecnecio-99m', vm: 6, u: 'horas', uso: 'se usa para tomar imágenes en hospitales' },
    { id: 'fosforo', nombre: 'fósforo-32', vm: 14, u: 'días', uso: 'se usa en algunos tratamientos médicos' },
  ];
  const UNOS = s => `${s.u === 'horas' ? 'unas' : 'unos'} ${f(s.vm)} ${s.u || 'años'}`;
  const DEF_VM = 'Vida media: tiempo en que se desintegra la mitad de lo que hay';
  const DEF_M = 'Tras n vidas medias queda m = m_0 / 2ⁿ, con m_0 lo que había al inicio';
  const DEF_N = 'n = t ÷ vida media: cuántas vidas medias caben en el tiempo t';
  const DEF_F = 'Fracción que queda tras n vidas medias: 1/2ⁿ';
  const DEF_D = 'Lo desintegrado es lo que falta: lo que había menos lo que queda';
  const vidaDe = s => `Vida media del ${s.nombre}: ${UNOS(s)}`;
  // Un color fijo por magnitud (docs/molde-unidad.md §5b): la tabla de la unidad, copia de `colores` de la teoría
  // (contenido/teoria/quimica/materia-y-energia.js). La práctica carga solo este archivo, así que la tabla va copiada;
  // plantillas/materia-energia/colores.test.js comprueba que coincida. Cada variable dice su magnitud (`mag`).
  const COLOR = { masa: 'o', volumen: 'i', longitud: 'i', densidad: 'f', calor: 'f', 'por gramo': 'i', temperatura: 'd', energía: 'f', luz: 'i',
    'energía de un balón': 'd', balones: 'h', tiempo: 'i', 'vida media': 'f', 'vidas medias': 'h', factor: 'i' };
  const va = (nombre, mag) => ({ nombre, mag, color: COLOR[mag] });
  const VARS = {
    m0: va('lo que había al inicio', 'masa'), m: va('lo que queda o se desintegró', 'masa'),
    t: va('tiempo que pasa', 'tiempo'), th: va('vida media', 'vida media'), n: va('vidas medias que caben', 'vidas medias'),
  };
  const usa = (...ks) => Object.fromEntries(ks.map(k => [k, VARS[k]]));

  function numericas(rng, correcta, errores, texto) {
    const ok = errores.filter(x => Number.isFinite(x.valor) && x.valor > 0 && Math.abs(x.valor - correcta) > 1e-12 && P.enEscala(x.valor, correcta, x.id));
    return P.armar({ correcta, errores: ok, rng, texto });
  }
  const G = x => `${f(x)} g`;

  // ---- queda: un paso ----
  function tQueda(rng) {
    const s = rng.elegir(FUENTES), m0 = rng.elegir(s.masas), n = rng.entero(1, 3), m = m0 / 2 ** n;
    const errores = [
      e(m0 / (2 * n), 'AQ-vm-divide-entre-2n', `Bien contar ${n} vidas medias. Pero cada una divide entre 2 lo que queda: entre 2${SUP[n]}, no entre 2 × ${n}. Así sale ${G(m0 / (2 * n))}.`),
      e(m0 - m, 'AQ-vm-desintegrada', `Bien hacer las mitades. Pero ${G(m0 - m)} es lo que se desintegró; se pide lo que queda.`),
      e(m0 / 2 ** (n + 1), 'AQ-vm-una-vida-de-mas', `Bien dividir entre 2 cada vez. Pero son ${n} vidas medias, no ${n + 1}. Así sale ${G(m0 / 2 ** (n + 1))}.`),
      e(m0 / 2 ** (n - 1), 'AQ-vm-una-vida-de-menos', `Bien dividir entre 2 cada vez. Pero son ${n} vidas medias, no ${n - 1}. Así sale ${G(m0 / 2 ** (n - 1))}.`),
      ...(n >= 3 ? [e(m0 / n, 'AQ-vm-divide-entre-n', `Bien contar ${n} vidas medias. Pero no se reparte en partes iguales: cada una se lleva la mitad de lo que queda. Así sale ${G(m0 / n)}.`)] : []),
    ];
    return {
      variables: usa('m0', 'n', 'm'), enunciado: [`${s.donde} `, v('m0', `${m0} g`), ` de ${s.nombre}.`],
      pregunta: ['¿Cuántos ', v('m', 'gramos quedan'), ' después de ', v('n', `${n} ${n === 1 ? 'vida media' : 'vidas medias'}`), '?'],
      datos: [DEF_VM, DEF_M], alternativas: numericas(rng, m, errores, G), respuesta: { valor: m, unidad: 'g' },
      solucion: [
        ['En cada vida media se desintegra la mitad de lo que queda.'],
        ['m = ', v('m0', String(m0)), ' / 2', v('n', SUP[n]), ' = ', `${m0} / ${2 ** n} = `, v('m', G(m)), '.'],
      ],
      _datos: { tipo: 'queda', nivel: 1, fuente: s.id, m0, n },
    };
  }

  // ---- masa: primero n, después las mitades ----
  function tMasa(rng) {
    const s = rng.elegir(FUENTES), m0 = rng.elegir(s.masas), n = rng.entero(2, 4), t = limpio(n * s.vm), m = m0 / 2 ** n;
    const errores = [
      e(m0 / (2 * n), 'AQ-vm-divide-entre-2n', `Bien contar ${n} vidas medias. Pero cada una divide entre 2 lo que queda: entre 2${SUP[n]}, no entre 2 × ${n}. Así sale ${G(m0 / (2 * n))}.`),
      e(m0 / 2, 'AQ-vm-tiempo-como-una-vida', `Bien dividir entre 2. Pero en ${f(t)} años caben ${n} vidas medias de ${f(s.vm)} años, no una. Así sale ${G(m0 / 2)}.`),
      e(m0 - m, 'AQ-vm-desintegrada', `Bien contar las vidas medias. Pero ${G(m0 - m)} es lo que se desintegró; se pide lo que queda.`),
      e(m0 / 2 ** (n + 1), 'AQ-vm-una-vida-de-mas', `Bien dividir entre 2 cada vida media. Pero en ${f(t)} años caben ${n}, no ${n + 1}. Así sale ${G(m0 / 2 ** (n + 1))}.`),
      e(m0 / 2 ** (n - 1), 'AQ-vm-una-vida-de-menos', `Bien dividir entre 2 cada vida media. Pero en ${f(t)} años caben ${n}, no ${n - 1}. Así sale ${G(m0 / 2 ** (n - 1))}.`),
      e(m0 / n, 'AQ-vm-divide-entre-n', `Bien contar ${n} vidas medias. Pero no se reparte en partes iguales: cada una se lleva la mitad de lo que queda. Así sale ${G(m0 / n)}.`),
    ];
    return {
      variables: usa('m0', 't', 'th', 'n', 'm'), enunciado: [`${s.donde} `, v('m0', `${m0} g`), ` de ${s.nombre}.`],
      pregunta: ['¿Cuántos ', v('m', 'gramos quedarán'), ' dentro de ', v('t', `${f(t)} años`), '?'],
      datos: [DEF_M, DEF_N, vidaDe(s)], alternativas: numericas(rng, m, errores, G), respuesta: { valor: m, unidad: 'g' },
      solucion: [
        ['n = ', v('t', f(t)), ' ÷ ', v('th', f(s.vm)), ' = ', v('n', String(n)), ' vidas medias.'],
        ['m = ', v('m0', String(m0)), ' / 2', v('n', SUP[n]), ` = ${m0} / ${2 ** n} = `, v('m', G(m)), '.'],
      ],
      _datos: { tipo: 'masa', nivel: 2, fuente: s.id, m0, t },
    };
  }

  // ---- tiempo: de la fracción (o el porcentaje) que queda al tiempo ----
  function tTiempo(rng) {
    const s = rng.elegir(SUSTANCIAS), c14 = s.id === 'c14', n = c14 ? rng.entero(2, 3) : rng.entero(2, 4), t = limpio(n * s.vm), q = 2 ** -n;
    const como = c14 ? rng.elegir(['porcentaje', 'parte']) : rng.elegir(['fraccion', 'porcentaje']);
    const PARTE = { 2: 'la cuarta parte', 3: 'la octava parte' };
    const queda = como === 'porcentaje' ? `el ${pc(100 * q)}` : como === 'parte' ? PARTE[n] : fr(q);
    const T = x => `${f(x)} ${s.u}`;
    const errores = [
      e(2 ** n * s.vm, 'AQ-vm-multiplica-fraccion', `Bien usar la vida media. Pero ${2 ** n} es 2${SUP[n]}: hacen falta ${n} vidas medias, no ${2 ** n}. Así salen ${T(2 ** n * s.vm)}.`),
      e((n - 1) * s.vm, 'AQ-vm-una-vida-de-menos', `Bien multiplicar por la vida media. Pero para llegar a 1/${2 ** n} hacen falta ${n} mitades. Así salen ${T((n - 1) * s.vm)}.`),
      e((n + 1) * s.vm, 'AQ-vm-una-vida-de-mas', `Bien multiplicar por la vida media. Pero contaste una mitad de más: 1/${2 ** n} son ${n}. Así salen ${T((n + 1) * s.vm)}.`),
      e(2 * (1 - q) * s.vm, 'AQ-vm-lineal', `Bien ver que se va perdiendo con el tiempo. Pero no al mismo ritmo: cada vida media se va la mitad de lo que queda. Así salen ${T(2 * (1 - q) * s.vm)}.`),
      e(s.vm / 2 ** n, 'AQ-vm-divide-vida-media', `Bien usar la fracción. Pero mientras menos queda, más tiempo pasó: se multiplica la vida media. Así salen ${T(s.vm / 2 ** n)}.`),
    ];
    const enunciado = c14 ? ['Un hueso hallado en una cueva de los Andes conserva ', v('m', queda), ' del carbono-14 que tenía al morir el animal.']
      : [`El ${s.nombre} ${s.uso}.`];
    const pregunta = c14 ? ['¿Hace cuánto ', v('t', 'tiempo'), ' murió?'] : ['¿Cuánto ', v('t', 'tiempo'), ' pasa hasta que de una dosis quede ', v('m', queda), '?'];
    return {
      variables: usa('t', 'th', 'n', 'm'), enunciado, pregunta, datos: [DEF_F, DEF_N, vidaDe(s)],
      alternativas: numericas(rng, t, errores, T), respuesta: { valor: t, unidad: s.u },
      solucion: [
        [v('m', queda), ' = ', `1/${2 ** n} = 1/2`, v('n', SUP[n]), ': ', v('n', String(n)), ' vidas medias.'],
        ['t = ', v('n', String(n)), ' × ', v('th', f(s.vm)), ' = ', v('t', T(t)), '.'],
      ],
      _datos: { tipo: 'tiempo', nivel: 2, sustancia: s.id, n, como },
    };
  }

  // ---- desintegrado: qué parte se fue ----
  function tDesintegrado(rng) {
    const s = rng.elegir(SUSTANCIAS.slice(1)), n = rng.entero(2, 4), t = n * s.vm, q = 2 ** -n, como = rng.elegir(['porcentaje', 'fraccion']);
    const pct = como === 'porcentaje', val = pct ? 100 * (1 - q) : 1 - q, k = pct ? 100 : 1, T = pct ? pc : fr;
    const errores = [
      e(k * q, 'AQ-vm-desintegrada', `Bien hacer las ${n} mitades. Pero ${T(k * q)} es lo que queda; se pide lo que se desintegró.`),
      e(k * 0.5, 'AQ-vm-tiempo-como-una-vida', `Bien: en una vida media se va la mitad. Pero en ${t} ${s.u} caben ${n}. Así sale ${T(k * 0.5)}.`),
      e(k * (1 - 2 ** -(n - 1)), 'AQ-vm-una-vida-de-menos', `Bien restar lo que queda. Pero en ${t} ${s.u} caben ${n} vidas medias, no ${n - 1}. Así sale ${T(k * (1 - 2 ** -(n - 1)))}.`),
      e(k * (1 - 2 ** -(n + 1)), 'AQ-vm-una-vida-de-mas', `Bien restar lo que queda. Pero en ${t} ${s.u} caben ${n} vidas medias, no ${n + 1}. Así sale ${T(k * (1 - 2 ** -(n + 1)))}.`),
      e(k * (1 - 1 / (2 * n)), 'AQ-vm-divide-entre-2n', `Bien restar lo que queda. Pero queda 1/2${SUP[n]}, no 1/(2 × ${n}). Así sale ${T(k * (1 - 1 / (2 * n)))}.`),
    ].filter(x => pct || fr(x.valor).includes('/'));
    return {
      variables: usa('t', 'th', 'n', 'm'), enunciado: [`El ${s.nombre} ${s.uso}.`],
      pregunta: [`¿Qué ${pct ? 'porcentaje' : 'fracción'} de una dosis `, v('m', 'se desintegra'), ' en ', v('t', `${t} ${s.u}`), '?'],
      datos: [DEF_N, DEF_F, DEF_D, vidaDe(s)], alternativas: numericas(rng, val, errores, T), respuesta: { valor: val, unidad: pct ? '%' : '' },
      solucion: [
        ['n = ', v('t', String(t)), ' ÷ ', v('th', f(s.vm)), ' = ', v('n', String(n)), `: queda 1/2${SUP[n]} = ${pct ? pc(100 * q) : fr(q)}.`],
        ['Se desintegra lo que falta: ', pct ? `100 % − ${pc(100 * q)} = ` : `1 − ${fr(q)} = `, v('m', T(val)), '.'],
      ],
      _datos: { tipo: 'desintegrado', nivel: 2, sustancia: s.id, t, como },
    };
  }

  // ---- vida: hallar la vida media ----
  function tVida(rng) {
    const s = rng.elegir(FUENTES), n = rng.entero(2, 3), m0 = rng.elegir(s.masas.filter(x => x % 2 ** n === 0)), t = limpio(n * s.vm), m = m0 / 2 ** n;
    const A = x => `${f(x)} años`;
    const errores = [
      e(t, 'AQ-vm-tiempo-como-una-vida', `Bien usar el tiempo. Pero en ${A(t)} no queda la mitad sino 1/${2 ** n}: pasaron ${n} vidas medias. Así sale ${A(t)}.`),
      e(t / 2 ** n, 'AQ-vm-divide-entre-2n', `Bien ver que queda 1/${2 ** n}. Pero eso son ${n} mitades: el tiempo se divide entre ${n}, no entre ${2 ** n}. Así sale ${A(t / 2 ** n)}.`),
      e(n * t, 'AQ-vm-multiplica-tiempo', `Bien contar ${n} mitades. Pero esas vidas medias caben en el tiempo dado: se divide, no se multiplica. Así sale ${A(n * t)}.`),
      e(t / (n + 1), 'AQ-vm-una-vida-de-mas', `Bien dividir el tiempo. Pero de ${m0} g a ${f(m)} g hay ${n} mitades, no ${n + 1}. Así sale ${A(t / (n + 1))}.`),
      e(t / (n - 1), 'AQ-vm-una-vida-de-menos', `Bien dividir el tiempo. Pero de ${m0} g a ${f(m)} g hay ${n} mitades, no ${n - 1}. Así sale ${A(t / (n - 1))}.`),
    ];
    return {
      variables: usa('m0', 'm', 't', 'n', 'th'), enunciado: [`Una fuente de ${s.nombre} pasa de `, v('m0', `${m0} g`), ' a ', v('m', G(m)), ' en ', v('t', A(t)), '.'],
      pregunta: ['¿Cuál es su ', v('th', 'vida media'), '?'], datos: [DEF_VM, DEF_N],
      alternativas: numericas(rng, s.vm, errores, A), respuesta: { valor: s.vm, unidad: 'años' },
      solucion: [
        [`${[...Array(n + 1).keys()].map(k => f(m0 / 2 ** k)).join(' → ')} g: `, v('n', String(n)), ' vidas medias.'],
        ['vida media = ', v('t', f(t)), ' ÷ ', v('n', String(n)), ' = ', v('th', A(s.vm)), '.'],
      ],
      _datos: { tipo: 'vida', nivel: 2, fuente: s.id, m0, n, t },
    };
  }

  // ---- unidades: horas y días, días y semanas ----
  const MEZCLAS = [
    { sustancia: 'tecnecio', t: 1, unidadT: 'día', factor: 24, eq: '1 día = 24 h', cuando: 'un día después' },
    { sustancia: 'fosforo', t: 6, unidadT: 'semanas', factor: 7, eq: '1 semana = 7 días', cuando: 'seis semanas después' },
    { sustancia: 'fosforo', t: 8, unidadT: 'semanas', factor: 7, eq: '1 semana = 7 días', cuando: 'ocho semanas después' },
    { sustancia: 'yodo', t: 4, unidadT: 'semanas', factor: 7, eq: '1 semana = 7 días', cuando: 'cuatro semanas después' },
  ];
  function tUnidades(rng) {
    const x = rng.elegir(MEZCLAS.filter(y => (y.t * y.factor) % SUSTANCIAS.find(s => s.id === y.sustancia).vm === 0));
    const s = SUSTANCIAS.find(y => y.id === x.sustancia), tc = x.t * x.factor, n = tc / s.vm, q = 2 ** -n;
    // El orden importa (P.armar toma los cuatro primeros que sirven): lo desintegrado con y sin una vida media de menos
    // va junto, para que la correcta no sea la que más se parece a todas (probarFugas, «central»).
    const errores = [
      e(1 - q, 'AQ-vm-desintegrada', `Bien pasar a la misma unidad. Pero ${fr(1 - q)} es lo que se desintegró; se pide lo que queda.`),
      e(2 * q, 'AQ-vm-una-vida-de-menos', `Bien pasar a ${s.u}. Pero en ${tc} ${s.u} caben ${n} vidas medias, no ${n - 1}. Así sale ${fr(2 * q)}.`),
      e(1 - 2 * q, 'AQ-vm-desintegrada', `Bien pasar a la misma unidad. Pero ${fr(1 - 2 * q)} es lo desintegrado y con una vida media de menos: caben ${n}.`),
      e(2 ** -x.t, 'AQ-vm-sin-convertir', `Bien dividir entre 2 por cada vida media. Pero ${f(x.t)} ${x.unidadT} no son ${f(x.t)} vidas medias: ${x.eq}. Así sale ${fr(2 ** -x.t)}.`),
      e(q / 2, 'AQ-vm-una-vida-de-mas', `Bien pasar a ${s.u}. Pero en ${tc} ${s.u} caben ${n} vidas medias, no ${n + 1}. Así sale ${fr(q / 2)}.`),
      e(1 / (2 * n), 'AQ-vm-divide-entre-2n', `Bien contar ${n} vidas medias. Pero queda 1/2${SUP[n]}, no 1/(2 × ${n}). Así sale ${fr(1 / (2 * n))}.`),
    ].filter(x => fr(x.valor).includes('/'));   // solo fracciones de potencias de 2: un decimal suelto se delataría por su forma
    return {
      variables: usa('t', 'th', 'n', 'm'), enunciado: [`A un paciente le aplican ${s.nombre}, que ${s.uso}.`],
      pregunta: ['¿Qué ', v('m', 'fracción de la dosis'), ' queda ', v('t', x.cuando), '?'],
      datos: [DEF_N, DEF_F, vidaDe(s), x.eq], alternativas: numericas(rng, q, errores, fr), respuesta: { valor: q, unidad: '' },
      solucion: [
        ['Todo en la misma unidad: ', v('t', `${f(x.t)} ${x.unidadT}`), ` = ${tc} ${s.u}.`],
        ['n = ', v('t', String(tc)), ' ÷ ', v('th', f(s.vm)), ' = ', v('n', String(n)), `; queda 1/2${SUP[n]} = `, v('m', fr(q)), '.'],
      ],
      _datos: { tipo: 'unidades', nivel: 3, sustancia: s.id, t: x.t, unidadT: x.unidadT },
    };
  }

  // ---- deducir: la vida media sale de los datos y se usa para otro tiempo ----
  function tDeducir(rng) {
    const s = rng.elegir(FUENTES), a = 2, b = rng.entero(4, 5), m0 = rng.elegir(s.masas.filter(x => x % 4 === 0)), t1 = limpio(a * s.vm), t2 = limpio(b * s.vm), m = m0 / 2 ** b;
    const errores = [
      e(m0 / 2 ** (t2 / t1), 'AQ-vm-lee-tiempo-sin-mitad', `Bien dividir entre 2 por tramo. Pero en ${f(t1)} años no se fue la mitad sino tres cuartos: pasaron 2 vidas medias. Así sale ${G(m0 / 2 ** (t2 / t1))}.`),
      e(m0 / 4 ** (t2 / t1), 'AQ-vm-lee-tiempo-sin-mitad', `Bien ver que en ${f(t1)} años queda la cuarta parte. Pero ${f(t2)} ÷ ${f(t1)} no es entero: cuenta vidas medias. Así sale ${G(m0 / 4 ** (t2 / t1))}.`),
      e(m0 - m, 'AQ-vm-desintegrada', `Bien hallar la vida media. Pero ${G(m0 - m)} es lo que se desintegró; se pide lo que queda.`),
      e(m0 / 2 ** (b - 1), 'AQ-vm-una-vida-de-menos', `Bien la vida media de ${f(s.vm)} años. Pero en ${f(t2)} años caben ${b}, no ${b - 1}. Así sale ${G(m0 / 2 ** (b - 1))}.`),
      e(m0 / 2 ** (b + 1), 'AQ-vm-una-vida-de-mas', `Bien la vida media de ${f(s.vm)} años. Pero en ${f(t2)} años caben ${b}, no ${b + 1}. Así sale ${G(m0 / 2 ** (b + 1))}.`),
      e(m0 / (2 * b), 'AQ-vm-divide-entre-2n', `Bien contar ${b} vidas medias. Pero se divide entre 2${SUP[b]}, no entre 2 × ${b}. Así sale ${G(m0 / (2 * b))}.`),
    ];
    return {
      variables: usa('m0', 'm', 't', 'th', 'n'),
      enunciado: [`Una fuente de ${s.nombre} pasa de `, v('m0', `${m0} g`), ' a ', v('m0', `${m0 / 4} g`), ' en ', v('t', `${f(t1)} años`), '.'],
      pregunta: ['¿Cuántos ', v('m', 'gramos quedarán'), ' a los ', v('t', `${f(t2)} años`), ' de empezar?'],
      datos: [DEF_VM, DEF_M, DEF_N], alternativas: numericas(rng, m, errores, G), respuesta: { valor: m, unidad: 'g' },
      solucion: [
        [`De ${m0} g a ${m0 / 4} g hay 2 mitades: vida media = `, v('t', f(t1)), ' ÷ 2 = ', v('th', `${f(s.vm)} años`), '.'],
        ['n = ', v('t', f(t2)), ' ÷ ', v('th', f(s.vm)), ' = ', v('n', String(b)), '.'],
        ['m = ', v('m0', String(m0)), ' / 2', v('n', SUP[b]), ` = ${m0} / ${2 ** b} = `, v('m', G(m)), '.'],
      ],
      _datos: { tipo: 'deducir', nivel: 3, fuente: s.id, m0, t1, t2 },
    };
  }

  const TIPOS = ['queda', 'queda', 'masa', 'masa', 'tiempo', 'tiempo', 'desintegrado', 'desintegrado', 'vida', 'unidades', 'unidades', 'deducir', 'deducir'];
  const NIVEL = { queda: 1, masa: 2, tiempo: 2, desintegrado: 2, vida: 2, unidades: 3, deducir: 3 };
  const CONSTRUIR = { queda: tQueda, masa: tMasa, tiempo: tTiempo, desintegrado: tDesintegrado, vida: tVida, unidades: tUnidades, deducir: tDeducir };
  const PAPEL = { 'papel-1': 'queda', 'papel-2': 'masa', 'papel-3': 'tiempo', 'papel-4': 'desintegrado', 'papel-5': 'vida',
    'papel-6': 'tiempo', 'papel-7': 'unidades', 'papel-8': 'deducir' };
  const escaparRe = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const fuga = (pr, c) => new RegExp(`(^|[^\\d,/])${escaparRe(c.split(' ')[0])}(?![\\d,/])`).test(pr.datos.join('\n'));

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

  return { id: ID, titulo: 'La mitad cada cierto tiempo', generar, NIVEL, FUENTES, SUSTANCIAS, MEZCLAS, fr, COLOR };
});
