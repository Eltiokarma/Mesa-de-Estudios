/*
 * Generador «Cambiar de unidad»: práctica de la idea 1 de «Magnitudes y unidades» (fisica.magnitudes-y-vectores;
 * contenido/teoria/fisica/magnitudes-y-vectores.js, idea «unidades»). Longitud, masa, tiempo y rapidez, con los
 * prefijos k, c, m y μ y la notación científica. Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['conversion-unidades']) y en Node (require). No usa ningún motor: las cuentas son
 * potencias de 10 exactas (por10) y los factores 60, 3600 y 1000.
 *
 * Tipos (nivel 1: un factor; nivel 2: dos factores o una unidad compuesta; nivel 3: tipo examen, dos pasos o comparar
 * dos cantidades en unidades distintas):
 *   longitud   (1) km, m, cm, mm y μm, en los dos sentidos
 *   masa       (1) t, kg, g y mg
 *   tiempo     (1–2) min ↔ s, h → s (dos factores) y «1 h 45 min» en horas
 *   rapidez    (2) km/h ↔ m/s, sin dar el 3,6: se dan 1 km = 1000 m y 1 h = 3600 s
 *   notacion   (2) un largo o una masa a la unidad del SI, escrita en notación científica
 *   dos-cambios (3) sub media: distancia y tiempo → rapidez en otra unidad; sub compuesta: m/min ↔ km/h
 *   comparar   (3) sub veces: cuántas veces más rápido; sub cuantas: cuántas vueltas, bolsas o capítulos;
 *              sub diferencia: cuánto más rápido, en m/s
 *
 * Colores: un color fijo por magnitud, el mismo de la teoría (docs/molde-unidad.md §5b; cabecera de
 * contenido/teoria/fisica/magnitudes-y-vectores.js): lo que te dan, naranja (o), también las dos cantidades que se
 * comparan; el factor que vale 1, turquesa (i), siempre; lo que se pide y su resultado, violeta (f).
 * Datos (docs/plan-calidad.md §3, punto 13): las equivalencias de una en una (1 km = 1000 m, 1 h = 3600 s), nunca el
 * 3,6 ni el factor ya armado; en notación científica, qué es y la regla de las potencias de 10; la fórmula v = d / t
 * cuando se calcula una rapidez. Valores de todos los días con «unos» y sin fuente (Gerson, 17 nov).
 * Errores (todos hipótesis: no hay estudio que mida cuántos postulantes los eligen):
 *   códigos de docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md, con sufijo:
 *     U1-al-reves (el 3,6 al revés: × en vez de ÷), U1-sin-convertir (km/h tomados como m/s), U2-sin-prefijo,
 *     U4-gramos (la masa se queda en gramos), U6-minutos (usa minutos donde van segundos)
 *   de docs/investigacion/unidades-ideas-erroneas.md: AU4-hora-decimal (1 h 45 min = 1,45 h)
 *   propios (los mismos de la teoría de la unidad donde coinciden): CONV-INVERSO (multiplica en vez de dividir, o al
 *     revés), CONV-PREFIJO (100 en vez de 1000: el factor de otro prefijo), CONV-COMA (corre la coma un lugar de
 *     más o de menos), CONV-UNA-UNIDAD (cambia solo una de las dos unidades de una rapidez), CONV-BASE-100 (una hora
 *     de 100 minutos o un minuto de 100 segundos), CONV-UN-FACTOR (de dos factores, usa uno), CONV-FACTOR-HORA (usa
 *     3600 donde va 60), CONV-EXP-SIGNO (el exponente con el signo cambiado), CONV-SOLO-HORAS (se olvida de los
 *     minutos o de las horas), CONV-RESTA-SIN-CONVERTIR (resta y después convierte la resta), CONV-COCIENTE-AL-REVES
 *     (divide la cantidad menor entre la mayor), CONV-RAPIDEZ-AL-REVES (t / d), CONV-SIN-CAMBIAR (divide sin cambiar
 *     ninguna unidad), CONV-UNIDAD-PEDIDA (deja el resultado en otra unidad que la pedida), CONV-SUMA-FACTORES
 *     (suma 60 + 60 en vez de multiplicar), CONV-DOS-VECES (aplica el cambio dos veces), CONV-SUMA (suma donde va
 *     una resta).
 * Escala: «multiplicar en vez de dividir» da un millón de veces la correcta (× 1000 contra ÷ 1000). Es el error que se
 * practica y no se recorta (Gerson decide si se aplica el tope de 1000 de nucleo/probar-generador.js).
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
  const ID = 'conversion-unidades';
  const TRANS = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const UNIS = 'docs/investigacion/unidades-ideas-erroneas.md';
  const v = P.v;
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });

  // ---- Números ----
  // x · 10^k sin el ruido binario (0,1 × 3 = 0,30000000000000004).
  const por10 = (x, k) => Number((x * 10 ** k).toPrecision(12));
  const limpio = x => Number(x.toPrecision(12));
  // Coma decimal; 4 cifras sin espacio (3400, pero 12 000), como en la teoría de la unidad.
  const f = (n, d = 2) => P.formatear(n, d).replace(/^(−?\d) (\d{3})(?=,|$)/, '$1$2');
  // Hasta 4 cifras significativas, sin ceros de más: 14,67; 0,0624; 25 200.
  function num(x) {
    if (x === 0) return '0';
    const d = Math.max(0, Math.min(12, 3 - Math.floor(Math.log10(Math.abs(x)) + 1e-9)));
    return f(x, d);
  }
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const sup = n => [...String(n)].map(c => SUP[c]).join('');
  const menos = n => (n < 0 ? `−${-n}` : String(n)); // signo menos tipográfico
  const par = n => (n < 0 ? `(−${-n})` : String(n));
  // Notación científica: «7 × 10⁻⁵», «1,5 × 10¹¹».
  function cient(x) {
    let e = Math.floor(Math.log10(x) + 1e-9), m = limpio(x / 10 ** e);
    m = Math.round(m * 1000) / 1000;
    if (m >= 10) { m /= 10; e += 1; }
    return `${f(m, 3)} × 10${sup(e)}`;
  }

  // ---- Unidades: exponente de 10 respecto de la unidad base (m o g) ----
  const EXP = { km: 3, m: 0, dm: -1, cm: -2, mm: -3, 'μm': -6, t: 6, kg: 3, g: 0, mg: -3 };
  const NOMBRE = { km: 'kilómetros', m: 'metros', cm: 'centímetros', mm: 'milímetros', 'μm': 'micrómetros', t: 'toneladas', kg: 'kilogramos', g: 'gramos', mg: 'miligramos' };
  // La equivalencia que se da en los datos, una por par de unidades vecinas.
  const EQUIV = {
    'km|m': '1 km = 1000 m', 'm|cm': '1 m = 100 cm', 'cm|mm': '1 cm = 10 mm', 'mm|μm': '1 mm = 1000 μm (μm: micrómetro, una millonésima de metro)',
    'm|μm': '1 m = 1 000 000 μm (μ, micro: una millonésima)', 'm|mm': '1 m = 1000 mm',
    't|kg': '1 t = 1000 kg (t: tonelada)', 'kg|g': '1 kg = 1000 g', 'g|mg': '1 g = 1000 mg (m, mili: una milésima)',
  };
  const equiv = (a, b) => EQUIV[`${a}|${b}`] || EQUIV[`${b}|${a}`];
  const corta = eq => eq.replace(/ \(.*\)$/, ''); // sin la aclaración entre paréntesis
  // «el kilómetro», «la tonelada»: con su artículo, para las frases de la solución.
  const UNO = { km: 'El kilómetro', m: 'El metro', cm: 'El centímetro', mm: 'El milímetro', 'μm': 'El micrómetro',
    t: 'La tonelada', kg: 'El kilogramo', g: 'El gramo', mg: 'El miligramo' };
  const cifra = k => f(10 ** Math.abs(k), 0); // 1000, 100, 10

  // Situaciones de un paso. pre/pos: el texto alrededor del dato; xs: valores creíbles (contrato, punto 10).
  const LONGITUD = [
    { de: 'm', a: 'km', xs: [1500, 3000, 4200], pre: 'Una carrera escolar de Puno tiene ', pos: ' de recorrido.' },
    { de: 'm', a: 'km', xs: [3800], pre: 'La ciudad de Puno está a unos ', pos: ' sobre el nivel del mar.' },
    { de: 'km', a: 'm', xs: [45], pre: 'De Puno a Juliaca hay unos ', pos: ' por carretera.' },
    { de: 'km', a: 'm', xs: [2.5, 12.5, 42], pre: 'Un ciclista recorre ', pos: ' en una mañana de entrenamiento.' },
    { de: 'cm', a: 'm', xs: [152, 165, 178], pre: 'Una estudiante mide ', pos: ' de estatura.' },
    { de: 'm', a: 'cm', xs: [2.1, 2.4], pre: 'La puerta del aula mide ', pos: ' de alto.' },
    { de: 'mm', a: 'cm', xs: [25.5], pre: 'Una moneda de un sol mide unos ', pos: ' de ancho.' },
    { de: 'cm', a: 'mm', xs: [17.5, 19], pre: 'Un lápiz nuevo mide ', pos: ' de largo.' },
    { de: 'μm', a: 'mm', xs: [70, 80], pre: 'Un cabello mide unos ', pos: ' de grosor.' },
    { de: 'mm', a: 'μm', xs: [0.1], pre: 'Una hoja de papel tiene unos ', pos: ' de grosor.' },
  ];
  const MASA = [
    { de: 'g', a: 'kg', xs: [850, 900, 1200], pre: 'Un queso de Ayaviri tiene una masa de unos ', pos: '.' },
    { de: 'kg', a: 'g', xs: [0.5, 2.5, 5], pre: 'Una bolsa de quinua tiene ', pos: ' de masa.' },
    { de: 'mg', a: 'g', xs: [250, 500, 750], pre: 'Una pastilla de paracetamol trae ', pos: ' de medicina.' },
    { de: 'g', a: 'mg', xs: [4, 5], pre: 'Una cucharadita de azúcar tiene unos ', pos: '.' },
    { de: 't', a: 'kg', xs: [8.5, 12, 15], pre: 'Un camión lleva ', pos: ' de papa a la feria de Juliaca.' },
    { de: 'kg', a: 't', xs: [450, 600], pre: 'Un toro de Ayaviri tiene una masa de unos ', pos: '.' },
  ];

  const TIPOS = ['longitud', 'longitud', 'masa', 'masa', 'tiempo', 'tiempo', 'rapidez', 'rapidez', 'notacion', 'notacion',
    'dos-cambios', 'dos-cambios', 'comparar', 'comparar', 'comparar'];
  const NIVEL = { longitud: 1, masa: 1, tiempo: 1, rapidez: 2, notacion: 2, 'dos-cambios': 3, comparar: 3 };

  // Papel (regla 6; herramientas/papel-generador.js usa las semillas «papel-1» a «papel-8» y rotula 3 básicos, 3
  // intermedios y 2 avanzados): recorre los tipos en orden de nivel, en vez de dejarlo al azar.
  const PAPEL = { 'papel-1': ['longitud'], 'papel-2': ['masa'], 'papel-3': ['tiempo', 's-min'], 'papel-4': ['rapidez'],
    'papel-5': ['notacion'], 'papel-6': ['tiempo', 'h-min'], 'papel-7': ['dos-cambios', 'media'], 'papel-8': ['comparar', 'cuantas'] };

  // Un tramo amarrado a una variable que el problema no tiene (el factor, en los problemas con dos datos) va sin color:
  // la app lo pintaría con el color por defecto, el naranja del dato.
  const sinVariableSuelta = (lineas, vars) => lineas.map(l => l.map(x => (x && typeof x === 'object' && !vars[x.v] ? x.t : x)));

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const [tipo, sub] = PAPEL[String(semilla)] || [rng.elegir(TIPOS)];
    for (let intento = 0; intento < 200; intento++) {
      const pr = CONSTRUIR[tipo](rng, sub);
      if (pr) {
        const alternativas = P.armar({ correcta: pr.correcta, errores: pr.errores, rng, texto: pr.texto });
        if (alternativas.length >= 4) {
          return {
            id: `${ID}#${semilla}`, variables: pr.variables, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos,
            alternativas, solucion: sinVariableSuelta(pr.solucion, pr.variables), respuesta: { valor: pr.correcta, unidad: pr.unidad }, _datos: pr._datos,
          };
        }
      }
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // Variables de un problema de un dato: el dato, el factor y lo que se pide.
  const VARS = (que, pide) => ({ d: { nombre: que, color: 'o' }, k: { nombre: 'factor que vale 1', color: 'i' }, x: { nombre: pide, color: 'f' } });
  const conU = u => x => `${num(x)} ${u}`;

  // ---- longitud y masa: un prefijo ----
  function prefijo(rng, lista, tipo) {
    const s = rng.elegir(lista), x = rng.elegir(s.xs);
    const k = EXP[s.de] - EXP[s.a];               // el número se multiplica por 10^k
    const correcta = por10(x, k), F = cifra(k), sube = k > 0;
    const op = sube ? '×' : '÷', opMal = sube ? '÷' : '×';
    const masGrande = sube ? `${UNO[s.a]} es más chico que ${UNO[s.de].toLowerCase()}: el número tiene que subir.`
      : `${UNO[s.a]} es más grande que ${UNO[s.de].toLowerCase()}: el número tiene que bajar.`;
    const n = Math.abs(k), dir = Math.sign(k), eqc = corta(equiv(s.de, s.a));
    const hacer = sube ? `multiplicar por ${F}` : `dividir entre ${F}`;
    const lug = m => `${m} ${m === 1 ? 'lugar' : 'lugares'}`;
    const errores = [
      h('CONV-INVERSO', por10(x, -k), `Usaste el factor ${F}, pero al revés: ${num(x)} ${opMal} ${F} = ${num(por10(x, -k))}. ${masGrande}`),
    ];
    // Un cero menos: el factor de otro prefijo (100 en vez de 1000). Con k = ±1 eso es no convertir.
    if (n > 1) errores.push(h('CONV-PREFIJO', por10(x, k - dir), `${sube ? 'Multiplicar' : 'Dividir'} estaba bien, pero ${cifra(n - 1)} es el factor de otro prefijo: ${num(x)} ${op} ${cifra(n - 1)} = ${num(por10(x, k - dir))}. La equivalencia es ${eqc}.`));
    else errores.push(h('U2-sin-prefijo', x, `Dejaste el número sin cambiar, pero ${num(x)} ${s.de} no son ${num(x)} ${s.a}: la equivalencia es ${eqc}.`, TRANS));
    // Un cero de más: con 1000 en vez de 100 (otro prefijo) o la coma corrida un lugar de más.
    errores.push(h(n === 2 ? 'CONV-PREFIJO' : 'CONV-COMA', por10(x, k + dir), n === 2
      ? `${sube ? 'Multiplicar' : 'Dividir'} estaba bien, pero usaste 1000, que es el factor de los milímetros: ${num(x)} ${op} 1000 = ${num(por10(x, k + dir))}. La equivalencia es ${eqc}.`
      : `La idea de ${hacer} es correcta, pero corriste la coma ${lug(n + 1)} y salió ${num(por10(x, k + dir))}; con ${F}, la coma se corre ${lug(n)}.`));
    // La coma corrida de menos, para que la correcta no quede en un extremo.
    if (n > 2) errores.push(h('CONV-COMA', por10(x, k - 2 * dir), `La idea de ${hacer} es correcta, pero corriste la coma solo ${lug(n - 2)} y salió ${num(por10(x, k - 2 * dir))}; con ${F}, la coma se corre ${lug(n)}.`));
    const eq = equiv(s.de, s.a);
    const factor = sube ? `(${F} ${s.a} / 1 ${s.de})` : `(1 ${s.a} / ${F} ${s.de})`;
    return {
      variables: VARS(`la cantidad en ${s.de}`, `la cantidad en ${s.a}`),
      enunciado: [s.pre, v('d', `${num(x)} ${s.de}`), s.pos],
      pregunta: ['¿Cuánto es en ', v('x', `${NOMBRE[s.a]} (${s.a})`), '?'],
      datos: [eq],
      correcta, errores, texto: conU(s.a), unidad: s.a,
      solucion: [
        [masGrande],
        ['Se multiplica por un factor que vale 1, con ', s.a, ' arriba y ', s.de, ' abajo, para que ', s.de, ' se tache: ', v('k', factor), '.'],
        [v('d', `${num(x)} ${s.de}`), ' × ', v('k', factor), ` = ${num(x)} ${op} ${F} = `, v('x', `${num(correcta)} ${s.a}`), '.'],
      ],
      _datos: { tipo, nivel: 1, x, de: s.de, a: s.a },
    };
  }

  // ---- tiempo ----
  function tiempo(rng, forzado) {
    const sub = forzado || rng.elegir(['min-s', 'min-s', 's-min', 's-min', 'h-s', 'h-min']);
    const VT = (que, pide) => VARS(que, pide);
    if (sub === 'min-s') {
      const x = rng.elegir([15, 20, 25, 45]);
      const correcta = x * 60;
      return {
        variables: VT('el tiempo en minutos', 'el tiempo en segundos'),
        enunciado: [rng.elegir(['El recreo del colegio dura ', 'Una clase de laboratorio dura ', 'El viaje en combi al mercado dura ']), v('d', `${x} min`), '.'],
        pregunta: ['¿Cuántos ', v('x', 'segundos (s)'), ' son?'],
        datos: ['1 min = 60 s'], correcta, texto: conU('s'), unidad: 's',
        errores: [
          h('CONV-BASE-100', x * 100, `Multiplicar estaba bien, pero un minuto tiene 60 segundos, no 100: ${x} × 100 = ${num(x * 100)}.`),
          h('CONV-INVERSO', x / 60, `Usaste el 60, pero al revés: ${x} ÷ 60 = ${num(x / 60)} son horas, y como el segundo es más chico que el minuto, el número tiene que subir.`),
          h('CONV-FACTOR-HORA', x * 3600, `Multiplicar estaba bien, pero 3600 es el factor de las horas: ${x} × 3600 = ${num(x * 3600)}, y un minuto tiene solo 60 s.`),
        ],
        solucion: [
          ['Un minuto tiene 60 segundos; como el segundo es más chico, el número sube.'],
          [v('d', `${x} min`), ' × ', v('k', '(60 s / 1 min)'), ` = ${x} × 60 = `, v('x', `${num(correcta)} s`), '.'],
        ],
        _datos: { tipo: 'tiempo', sub, nivel: 1, x, de: 'min', a: 's' },
      };
    }
    if (sub === 's-min') {
      const x = rng.elegir([90, 150, 210, 270]);
      const correcta = x / 60, mm = Math.floor(x / 60), ss = x % 60;
      return {
        variables: VT('el tiempo en segundos', 'el tiempo en minutos'),
        enunciado: [rng.elegir(['Un microondas calienta la leche en ', 'Un atleta tarda ', 'La canción del recreo dura ']), v('d', `${x} s`), '.'],
        pregunta: ['¿Cuántos ', v('x', 'minutos (min)'), ' son?'],
        datos: ['1 min = 60 s'], correcta, texto: conU('min'), unidad: 'min',
        errores: [
          h('CONV-BASE-100', x / 100, `Dividir estaba bien, pero un minuto tiene 60 segundos, no 100: ${x} ÷ 100 = ${num(x / 100)}.`),
          h('AU4-hora-decimal', mm + ss / 100, `Separaste bien ${mm} min y ${ss} s, pero ${ss} s no son ${f(ss / 100, 2)} min: son ${ss} de los 60 s de un minuto.`, UNIS),
          h('CONV-INVERSO', x * 60, `Usaste el 60, pero al revés: ${x} × 60 = ${num(x * 60)}, y como el minuto es más grande que el segundo, el número tiene que bajar.`),
          h('CONV-FACTOR-HORA', x / 3600, `Dividir estaba bien, pero 3600 es el factor de las horas: ${x} ÷ 3600 = ${num(x / 3600)}, y un minuto tiene solo 60 s.`),
        ],
        solucion: [
          ['Un minuto tiene 60 segundos; como el minuto es más grande, el número baja.'],
          [v('d', `${x} s`), ' × ', v('k', '(1 min / 60 s)'), ` = ${x} ÷ 60 = `, v('x', `${num(correcta)} min`), '.'],
          [`Comprobación: ${mm} min son ${mm * 60} s, y faltan ${ss} s, que son ${f(ss / 60, 2)} de minuto.`],
        ],
        _datos: { tipo: 'tiempo', sub, nivel: 1, x, de: 's', a: 'min' },
      };
    }
    if (sub === 'h-s') {
      const x = rng.elegir([6, 7, 8]);
      const correcta = x * 3600;
      return {
        variables: VT('el tiempo en horas', 'el tiempo en segundos'),
        enunciado: ['El bus de Puno a Cusco tarda unas ', v('d', `${x} h`), '.'],
        pregunta: ['¿Cuántos ', v('x', 'segundos (s)'), ' son?'],
        datos: ['1 h = 60 min', '1 min = 60 s'], correcta, texto: conU('s'), unidad: 's',
        errores: [
          h('CONV-UN-FACTOR', x * 60, `El primer paso está bien, ${x} h = ${x * 60} min, pero faltó pasar los minutos a segundos multiplicando otra vez por 60.`),
          h('CONV-BASE-100', x * 10000, `Multiplicar dos veces estaba bien, pero por 100 y no por 60: ${x} × 100 × 100 = ${num(x * 10000)}. Una hora tiene 60 min y un minuto, 60 s.`),
          h('CONV-INVERSO', x / 3600, `Usaste los dos factores, pero al revés: ${x} ÷ 60 ÷ 60 = ${num(x / 3600)}, y como el segundo es más chico que la hora, el número tiene que subir.`),
          h('CONV-SUMA-FACTORES', x * 120, `Usar dos veces el 60 estaba bien, pero los factores se multiplican, no se suman: ${x} × (60 + 60) = ${num(x * 120)}.`),
        ],
        solucion: [
          ['Se usan dos factores que valen 1: uno de horas a minutos y otro de minutos a segundos.'],
          [v('d', `${x} h`), ' × ', v('k', '(60 min / 1 h)'), ' × ', v('k', '(60 s / 1 min)'), ` = ${x} × 60 × 60 = `, v('x', `${num(correcta)} s`), '.'],
        ],
        _datos: { tipo: 'tiempo', sub, nivel: 2, x, de: 'h', a: 's' },
      };
    }
    // h-min: «1 h 45 min» en horas.
    const [hh, mi] = rng.elegir([[1, 15], [1, 45], [2, 30], [2, 45], [5, 30]]);
    const correcta = hh + mi / 60;
    return {
      variables: VT('el tiempo en horas y minutos', 'el tiempo en horas'),
      enunciado: [rng.elegir(['Un partido de fútbol con el descanso dura ', 'El viaje en bus de Puno a Arequipa dura unas ', 'La feria del domingo dura ']), v('d', `${hh} h ${mi} min`), '.'],
      pregunta: ['¿Cuántas ', v('x', 'horas (h)'), ' son, escritas con decimales?'],
      datos: ['1 h = 60 min'], correcta, texto: conU('h'), unidad: 'h',
      errores: [
        h('AU4-hora-decimal', hh + mi / 100, `Las ${hh} h están bien, pero ${mi} min no son ${f(mi / 100, 2)} h: son ${mi} de los 60 min de una hora.`, UNIS),
        h('CONV-BASE-100', (hh * 60 + mi) / 100, `Pasaste bien todo a minutos, ${hh * 60 + mi} min, pero una hora tiene 60 min, no 100: ${hh * 60 + mi} ÷ 100 = ${num((hh * 60 + mi) / 100)}.`),
        h('CONV-UNIDAD-PEDIDA', hh * 60 + mi, `Pasaste bien todo a minutos, ${hh * 60 + mi} min, pero se piden horas: falta dividir entre 60.`),
        h('CONV-INVERSO', hh + 60 / mi, `Sumar las ${hh} h estaba bien, pero la fracción va al revés: ${mi} min son ${mi}/60 de hora, no 60/${mi} = ${num(60 / mi)}.`),
      ],
      solucion: [
        [`${mi} min son ${mi} de los 60 min de una hora: `, v('k', `${mi}/60`), ` = ${f(mi / 60, 2)} h.`],
        ['Después se suman las horas enteras: ', `${hh} h + ${f(mi / 60, 2)} h = `, v('x', `${num(correcta)} h`), '.'],
      ],
      _datos: { tipo: 'tiempo', sub, nivel: 2, h: hh, min: mi, a: 'h' },
    };
  }

  // ---- rapidez: km/h ↔ m/s con 1000 y 3600 ----
  const KMH = [[18, 'Una bicicleta va a '], [36, 'Una combi va por la ciudad a '], [54, 'Una combi va por la avenida a '],
    [90, 'Un bus interprovincial va por la carretera a '], [108, 'Un auto va por la Panamericana a ']];
  const MS = [[5, 'Una ciclista avanza a '], [10, 'Un velocista corre a '], [13, 'Una vicuña corre a unos '], [25, 'Un auto avanza a '], [15, 'El viento del altiplano sopla a ']];
  const DATOS_RAPIDEZ = ['1 km = 1000 m', '1 h = 3600 s'];
  function rapidez(rng) {
    const aMs = rng.moneda();
    if (aMs) {
      const [x, pre] = rng.elegir(KMH), correcta = x / 3.6;
      return {
        variables: VARS('la rapidez en km/h', 'la rapidez en m/s'),
        enunciado: [pre, v('d', `${x} km/h`), '.'],
        pregunta: ['¿Cuál es su rapidez en ', v('x', 'metros por segundo (m/s)'), '?'],
        datos: DATOS_RAPIDEZ, correcta, texto: conU('m/s'), unidad: 'm/s',
        errores: [
          h('U1-al-reves', x * 3.6, `Usaste los factores 1000 y 3600, pero al revés: ${x} × 3,6 = ${num(x * 3.6)}. De km/h a m/s, el número tiene que bajar.`, TRANS),
          h('CONV-UNA-UNIDAD', x * 1000, `Pasaste bien ${x} km a ${num(x * 1000)} m, pero esos son los metros de una hora: falta pasar la hora a segundos.`),
          h('CONV-UNA-UNIDAD', x / 3600, `Dividir entre los 3600 s de una hora estaba bien, pero ${num(x / 3600)} son kilómetros por segundo: falta pasar los km a metros.`),
          h('U6-minutos', x * 1000 / 60, `Pasaste bien los km a metros, pero dividiste entre 60, y ${num(x * 1000 / 60)} son metros por minuto; una hora tiene 3600 s.`, TRANS),
        ],
        solucion: [
          [`${x} km/h son ${x} km en cada hora, y se cambian las dos unidades, cada una con su factor.`],
          [v('d', `${x} km/h`), ' × ', v('k', '(1000 m / 1 km)'), ' × ', v('k', '(1 h / 3600 s)'), ` = ${num(x * 1000)} m / 3600 s.`],
          [`${num(x * 1000)} ÷ 3600 = `, v('x', `${num(correcta)} m/s`), ' (multiplicar por 1000 y dividir entre 3600 es lo mismo que dividir entre 3,6).'],
        ],
        _datos: { tipo: 'rapidez', nivel: 2, x, de: 'km/h', a: 'm/s' },
      };
    }
    const [x, pre] = rng.elegir(MS), correcta = limpio(x * 3.6);
    return {
      variables: VARS('la rapidez en m/s', 'la rapidez en km/h'),
      enunciado: [pre, v('d', `${x} m/s`), '.'],
      pregunta: ['¿Cuál es su rapidez en ', v('x', 'kilómetros por hora (km/h)'), '?'],
      datos: DATOS_RAPIDEZ, correcta, texto: conU('km/h'), unidad: 'km/h',
      errores: [
        h('U1-al-reves', x / 3.6, `Usaste los factores 1000 y 3600, pero al revés: ${x} ÷ 3,6 = ${num(x / 3.6)}. De m/s a km/h, el número tiene que subir.`, TRANS),
        h('CONV-UNA-UNIDAD', x * 3600, `Multiplicar por los 3600 s de una hora estaba bien, pero ${num(x * 3600)} son metros por hora: falta pasar los metros a km.`),
        h('CONV-UNA-UNIDAD', x / 1000, `Pasaste bien ${x} m a ${num(x / 1000)} km, pero esos son km por segundo: falta pasar el segundo a horas.`),
        h('U6-minutos', limpio(x * 60 / 1000), `Pasaste bien los metros a km, pero multiplicaste por 60, y ${num(x * 60 / 1000)} son km por minuto; una hora tiene 3600 s.`, TRANS),
      ],
      solucion: [
        [`${x} m/s son ${x} m en cada segundo; una hora tiene 3600 s y un km, 1000 m.`],
        [v('d', `${x} m/s`), ' × ', v('k', '(1 km / 1000 m)'), ' × ', v('k', '(3600 s / 1 h)'), ` = ${num(x * 3600)} km / 1000 h.`],
        [`${num(x * 3600)} ÷ 1000 = `, v('x', `${num(correcta)} km/h`), ' (multiplicar por 3600 y dividir entre 1000 es lo mismo que multiplicar por 3,6).'],
      ],
      _datos: { tipo: 'rapidez', nivel: 2, x, de: 'm/s', a: 'km/h' },
    };
  }

  // ---- notación científica ----
  const NOTACION = [
    { x: 70, de: 'μm', a: 'm', pre: 'Un cabello mide unos ', pos: ' de grosor.' },
    { x: 7, de: 'μm', a: 'm', pre: 'Un glóbulo rojo mide unos ', pos: ' de ancho.' },
    { x: 2, de: 'μm', a: 'm', pre: 'Una bacteria mide unos ', pos: ' de largo.' },
    { x: 0.1, de: 'mm', a: 'm', pre: 'Una hoja de papel tiene unos ', pos: ' de grosor.' },
    { x: 150000000, de: 'km', a: 'm', pre: 'La Tierra está a unos ', pos: ' del Sol.' },
    { x: 300000, de: 'km', a: 'm', pre: 'La luz avanza unos ', pos: ' en cada segundo.' },
    { x: 6400, de: 'km', a: 'm', pre: 'El radio de la Tierra mide unos ', pos: '.' },
    { x: 50, de: 'mg', a: 'kg', pre: 'Una gota de lluvia grande tiene una masa de unos ', pos: '.' },
    { x: 20, de: 'mg', a: 'kg', pre: 'Un grano de arroz tiene una masa de unos ', pos: '.' },
  ];
  const NOTA = 'Notación científica: a × 10ⁿ, con a de 1 a menos de 10';
  const POT = 'Potencias de 10: 10ᵃ × 10ᵇ = 10ᵃ⁺ᵇ y 10ᵃ ÷ 10ᵇ = 10ᵃ⁻ᵇ';
  function notacion(rng) {
    const s = rng.elegir(NOTACION);
    const k = EXP[s.de] - EXP[s.a], correcta = por10(s.x, k);
    const E = Math.floor(Math.log10(correcta) + 1e-9), m = limpio(correcta / 10 ** E);
    const e0 = Math.floor(Math.log10(s.x) + 1e-9);
    const con = e => por10(m, e);
    const sinCero = e => (e === 0 ? NaN : con(e)); // «2 × 10⁰» confunde más de lo que enseña
    const dosPasos = s.de === 'mg';
    const errores = [];
    if (dosPasos) errores.push(h('U4-gramos', con(E + 3), `Pasaste bien de mg a g, dividiendo entre 1000, pero se piden kilogramos: falta dividir otra vez entre 1000.`, TRANS));
    errores.push(h('CONV-INVERSO', sinCero(e0 - k), `Usaste el factor, pero al revés: ${k > 0 ? 'dividiste' : 'multiplicaste'} y salió ${cient(con(e0 - k))}. Como el ${s.a === 'm' ? 'metro' : 'kilogramo'} es más ${k > 0 ? 'chico' : 'grande'}, el número tiene que ${k > 0 ? 'subir' : 'bajar'}.`));
    if (E !== 0) errores.push(h('CONV-EXP-SIGNO', con(-E), `El ${f(m, 3)} y el tamaño del exponente están bien, pero el signo está cambiado: un número ${E < 0 ? 'menor que 1 lleva exponente negativo' : 'mayor que 10 lleva exponente positivo'}.`));
    errores.push(h('CONV-COMA', sinCero(E - 1), `El ${f(m, 3)} de adelante está bien, pero el exponente quedó en ${menos(E - 1)} y no en ${menos(E)}: cuenta otra vez cuántos lugares se corre la coma.`));
    if (!dosPasos) errores.push(h('U2-sin-prefijo', sinCero(e0), `La notación científica está bien, pero no cambiaste de unidad: ${cient(con(e0))} es la medida en ${s.de}, no en ${s.a}.`, TRANS));
    errores.push(h('CONV-COMA', sinCero(E + 1), `El ${f(m, 3)} de adelante está bien, pero el exponente quedó en ${menos(E + 1)} y no en ${menos(E)}: cuenta otra vez cuántos lugares se corre la coma.`));
    const datos = s.de === 'μm' ? [equiv('m', 'μm'), NOTA, POT] : s.de === 'mm' ? [equiv('m', 'mm'), NOTA, POT]
      : s.de === 'km' ? [equiv('km', 'm'), NOTA, POT] : [equiv('kg', 'g'), equiv('g', 'mg'), NOTA, POT];
    const fx = s.x >= 1e4 ? f(s.x, 0) : num(s.x);
    const factor = s.de === 'mg' ? ['(1 g / 1000 mg) × (1 kg / 1000 g)', '10⁻⁶']
      : s.de === 'km' ? ['(1000 m / 1 km)', '10³'] : s.de === 'mm' ? ['(1 m / 1000 mm)', '10⁻³'] : ['(1 m / 1 000 000 μm)', '10⁻⁶'];
    return {
      variables: VARS(`la medida en ${s.de}`, `la medida en ${s.a}`),
      enunciado: [s.pre, v('d', `${fx} ${s.de}`), s.pos],
      pregunta: ['¿Cuánto es en ', v('x', `${s.a === 'm' ? 'metros (m)' : 'kilogramos (kg)'}`), ', en notación científica?'],
      datos, correcta, texto: x => `${cient(x)} ${s.a}`, unidad: s.a,
      errores,
      solucion: [
        e0 === 0 ? ['El dato ya tiene una sola cifra antes de la coma: ', v('d', `${fx} ${s.de}`), '.']
          : ['Primero se escribe el dato en notación científica: ', v('d', `${fx} ${s.de} = ${cient(s.x)} ${s.de}`), '.'],
        ['El factor que vale 1 es ', v('k', factor[0]), `, y usarlo es multiplicar por ${factor[1]}.`],
        e0 === 0 ? null : [`Al multiplicar ${cient(s.x)} × ${factor[1]}, los exponentes se suman: ${menos(e0)} + ${par(k)} = ${menos(E)}.`],
        ['El resultado es ', v('x', `${cient(correcta)} ${s.a}`), '.'],
      ].filter(Boolean),
      _datos: { tipo: 'notacion', nivel: 2, x: s.x, de: s.de, a: s.a },
    };
  }

  // ---- dos cambios (tipo examen) ----
  const U_T = { s: 1, min: 60, h: 3600 }, U_L = { m: 1, km: 1000 };
  function dosCambios(rng, forzado) {
    const sub = forzado || rng.elegir(['media', 'media', 'compuesta']);
    if (sub === 'media') {
      const c = rng.elegir([
        { d: 45, ud: 'km', t: 50, ut: 'min', a: 'm/s', pre: 'Un bus va de Puno a Juliaca, unos ', mid: ', en ' },
        { d: 45, ud: 'km', t: 40, ut: 'min', a: 'm/s', pre: 'Un auto va de Puno a Juliaca, unos ', mid: ', en ' },
        { d: 12, ud: 'km', t: 40, ut: 'min', a: 'm/s', pre: 'Una ciclista recorre ', mid: ' en ' },
        { d: 400, ud: 'm', t: 50, ut: 's', a: 'km/h', pre: 'Una atleta corre los ', mid: ' de una vuelta a la pista en ' },
        { d: 400, ud: 'm', t: 80, ut: 's', a: 'km/h', pre: 'Un atleta corre los ', mid: ' de una vuelta a la pista en ' },
        { d: 100, ud: 'm', t: 12.5, ut: 's', a: 'km/h', pre: 'Un estudiante corre ', mid: ' en ' },
      ]);
      const ms = c.d * U_L[c.ud] / (c.t * U_T[c.ut]);
      const correcta = limpio(c.a === 'm/s' ? ms : ms * 3.6);
      let errores;
      if (c.a === 'm/s') {
        errores = [
          h('CONV-SIN-CAMBIAR', c.d / c.t, `La fórmula v = d / t está bien, pero ${c.d} ÷ ${c.t} = ${num(c.d / c.t)} son km por minuto: faltan los dos cambios de unidad.`),
          h('CONV-UNA-UNIDAD', c.d * 1000 / c.t, `Pasaste bien los km a metros, ${num(c.d * 1000)} m, pero ${num(c.d * 1000 / c.t)} son metros por minuto: falta pasar los minutos a segundos.`),
          h('CONV-BASE-100', c.d * 1000 / (c.t * 100), `Hacer los dos cambios de unidad estaba bien, pero un minuto tiene 60 s, no 100: ${num(c.d * 1000)} ÷ ${num(c.t * 100)} = ${num(c.d * 1000 / (c.t * 100))}.`),
          h('CONV-RAPIDEZ-AL-REVES', c.t * 60 / (c.d * 1000), `Pasaste bien a metros y segundos, pero la rapidez es distancia entre tiempo, no tiempo entre distancia, que da ${num(c.t * 60 / (c.d * 1000))}.`),
        ];
      } else {
        errores = [
          h('CONV-UNIDAD-PEDIDA', ms, `Calculaste bien v = d / t = ${num(ms)}, pero eso está en m/s y se piden km/h: falta el cambio de unidad.`),
          h('U1-al-reves', ms / 3.6, `Calculaste bien v = ${num(ms)} m/s, pero el cambio va al revés: ${num(ms)} ÷ 3,6 = ${num(ms / 3.6)}. De m/s a km/h, el número sube.`, TRANS),
          h('CONV-UNA-UNIDAD', ms * 3600, `Multiplicar por los 3600 s de una hora estaba bien, pero ${num(ms * 3600)} son metros por hora: falta pasar los metros a km.`),
          h('U6-minutos', limpio(ms * 60), `Calculaste bien v = ${num(ms)} m/s, pero al multiplicar por 60 salen ${num(ms * 60)} metros por minuto, y se piden km/h.`, TRANS),
        ];
      }
      const fd = `${num(c.d)} ${c.ud}`, ft = `${num(c.t)} ${c.ut}`;
      const solucion = c.a === 'm/s' ? [
        ['Primero se pasa todo a metros y segundos: ', v('d', fd), ` = ${num(c.d * 1000)} m y `, v('d', ft), ` = ${num(c.t)} × 60 = ${num(c.t * 60)} s.`],
        ['La rapidez es distancia entre tiempo: v = d / t.'],
        [`v = ${num(c.d * 1000)} m ÷ ${num(c.t * 60)} s = `, v('x', `${num(correcta)} m/s`), '.'],
      ] : [
        ['La rapidez es distancia entre tiempo: ', `v = `, v('d', fd), ' ÷ ', v('d', ft), ` = ${num(ms)} m/s.`],
        ['Luego se pasa a km/h con sus dos factores: ', `${num(ms)} m/s × `, v('k', '(1 km / 1000 m)'), ' × ', v('k', '(3600 s / 1 h)'), '.'],
        [`${num(ms)} × 3600 ÷ 1000 = `, v('x', `${num(correcta)} km/h`), '.'],
      ];
      return {
        variables: { d: { nombre: 'la distancia y el tiempo que te dan', color: 'o' }, k: { nombre: 'factor que vale 1', color: 'i' }, x: { nombre: 'la rapidez pedida', color: 'f' } },
        enunciado: [c.pre, v('d', fd), c.mid, v('d', ft), '.'],
        pregunta: ['¿Cuál es su rapidez media en ', v('x', c.a === 'm/s' ? 'metros por segundo (m/s)' : 'kilómetros por hora (km/h)'), '?'],
        datos: ['Rapidez media: v = d / t (distancia entre tiempo)', c.ud === 'km' ? '1 km = 1000 m' : '1 km = 1000 m', c.ut === 'min' ? '1 min = 60 s' : '1 h = 3600 s'],
        correcta, errores, texto: conU(c.a), unidad: c.a,
        solucion,
        _datos: { tipo: 'dos-cambios', sub, nivel: 3, d: c.d, ud: c.ud, t: c.t, ut: c.ut, a: c.a },
      };
    }
    // compuesta: m/min → km/h o km/h → m/min
    const c = rng.elegir([
      { x: 80, de: 'm/min', a: 'km/h', pre: 'Una persona camina ', pos: ' por la orilla del lago.' },
      { x: 60, de: 'm/min', a: 'km/h', pre: 'Una llama camina a ', pos: ' por el cerro.' },
      { x: 250, de: 'm/min', a: 'km/h', pre: 'Un ciclista avanza ', pos: ' en la ciclovía.' },
      { x: 54, de: 'km/h', a: 'm/min', pre: 'Una combi va a ', pos: '.' },
      { x: 90, de: 'km/h', a: 'm/min', pre: 'Un bus va a ', pos: ' en la carretera.' },
    ]);
    let correcta, errores, solucion;
    if (c.de === 'm/min') {
      correcta = limpio(c.x * 60 / 1000);
      errores = [
        h('CONV-UNA-UNIDAD', c.x * 60, `Multiplicar por los 60 min de una hora estaba bien, pero ${num(c.x * 60)} son metros por hora: falta pasar los metros a km.`),
        h('CONV-UNA-UNIDAD', c.x / 1000, `Pasaste bien ${c.x} m a ${num(c.x / 1000)} km, pero esos son km por minuto: falta pasar el minuto a horas.`),
        h('U1-al-reves', limpio(c.x * 3.6), `Pensar en el 3,6 tiene sentido, pero ese factor es para m/s, no para m/min: ${c.x} × 3,6 = ${num(c.x * 3.6)}.`, TRANS),
        h('CONV-INVERSO', c.x * 1000 / 60, `Usaste los dos factores, pero los dos al revés: ${c.x} × 1000 ÷ 60 = ${num(c.x * 1000 / 60)}.`),
      ];
      solucion = [
        [`${c.x} m/min son ${c.x} m en cada minuto; una hora tiene 60 min y un km, 1000 m.`],
        [v('d', `${c.x} m/min`), ' × ', v('k', '(1 km / 1000 m)'), ' × ', v('k', '(60 min / 1 h)'), ` = ${num(c.x * 60)} km / 1000 h.`],
        [`${num(c.x * 60)} ÷ 1000 = `, v('x', `${num(correcta)} km/h`), '.'],
      ];
    } else {
      correcta = limpio(c.x * 1000 / 60);
      errores = [
        h('CONV-UNA-UNIDAD', c.x * 1000, `Pasaste bien ${c.x} km a ${num(c.x * 1000)} m, pero esos son metros por hora: falta pasar la hora a minutos.`),
        h('CONV-UNA-UNIDAD', c.x / 60, `Dividir entre los 60 min de una hora estaba bien, pero ${num(c.x / 60)} son km por minuto: falta pasar los km a metros.`),
        h('U6-minutos', c.x / 3.6, `Pasaste bien los km a metros, pero al dividir entre 3600 salen ${num(c.x / 3.6)} metros por segundo, y se piden metros por minuto.`, TRANS),
        h('CONV-INVERSO', limpio(c.x * 60 / 1000), `Usaste los dos factores, pero los dos al revés: ${c.x} × 60 ÷ 1000 = ${num(c.x * 60 / 1000)}.`),
      ];
      solucion = [
        [`${c.x} km/h son ${c.x} km en cada hora; un km tiene 1000 m y una hora, 60 min.`],
        [v('d', `${c.x} km/h`), ' × ', v('k', '(1000 m / 1 km)'), ' × ', v('k', '(1 h / 60 min)'), ` = ${num(c.x * 1000)} m / 60 min.`],
        [`${num(c.x * 1000)} ÷ 60 = `, v('x', `${num(correcta)} m/min`), '.'],
      ];
    }
    return {
      variables: VARS(`la rapidez en ${c.de}`, `la rapidez en ${c.a}`),
      enunciado: [c.pre, v('d', `${c.x} ${c.de}`), c.pos],
      pregunta: ['¿Cuál es su rapidez en ', v('x', c.a === 'km/h' ? 'kilómetros por hora (km/h)' : 'metros por minuto (m/min)'), '?'],
      datos: ['1 km = 1000 m', '1 h = 60 min'],
      correcta, errores, texto: conU(c.a), unidad: c.a, solucion,
      _datos: { tipo: 'dos-cambios', sub, nivel: 3, x: c.x, de: c.de, a: c.a },
    };
  }

  // ---- comparar (tipo examen) ----
  const el = t => t.toLowerCase().replace(/^un /, 'el ').replace(/^una /, 'la ');
  function comparar(rng, forzado) {
    const sub = forzado || rng.elegir(['veces', 'cuantas', 'cuantas', 'diferencia']);
    // Las dos cantidades son datos: naranja las dos (un color fijo por magnitud, molde §5b); el turquesa es del factor.
    const VC = (a, b, x) => ({ a: { nombre: a, color: 'o' }, b: { nombre: b, color: 'o' }, k: { nombre: 'factor que vale 1', color: 'i' }, x: { nombre: x, color: 'f' } });
    if (sub === 'veces') {
      const [A, B] = rng.elegir([[[90, 'Un bus'], [5, 'una bicicleta']], [[108, 'Un auto'], [10, 'un velocista']], [[54, 'Una combi'], [5, 'una ciclista']],
        [[72, 'Un tren'], [4, 'un caballo al trote']], [[36, 'Una moto en la ciudad'], [2, 'una persona que camina rápido']]]);
      const enMs = A[0] / 3.6, correcta = limpio(enMs / B[0]);
      return {
        variables: VC('la rapidez en km/h', 'la rapidez en m/s', 'cuántas veces'),
        enunciado: [`${A[1]} va a `, v('a', `${A[0]} km/h`), ` y ${B[1]}, a `, v('b', `${B[0]} m/s`), '.'],
        pregunta: ['¿', v('x', 'Cuántas veces'), ` más rápido va ${el(A[1])}?`],
        datos: DATOS_RAPIDEZ, correcta, texto: x => num(x), unidad: '',
        errores: [
          h('U1-sin-convertir', limpio(A[0] / B[0]), `Dividir una rapidez entre la otra estaba bien, pero antes hay que pasarlas a la misma unidad: ${A[0]} ÷ ${B[0]} = ${num(A[0] / B[0])}.`, TRANS),
          h('U1-al-reves', limpio(A[0] * 3.6 / B[0]), `Igualar las unidades estaba bien, pero el cambio va al revés: ${A[0]} × 3,6 = ${num(A[0] * 3.6)} no son m/s, y así sale ${num(A[0] * 3.6 / B[0])}.`, TRANS),
          h('CONV-COCIENTE-AL-REVES', limpio(B[0] / enMs), `Pasaste bien a m/s, ${num(enMs)} m/s, pero dividiste la rapidez menor entre la mayor, y ${num(B[0] / enMs)} es una fracción.`),
          h('CONV-UNA-UNIDAD', limpio(A[0] * 1000 / B[0]), `Pasaste bien los km a metros, pero faltó pasar la hora a segundos: ${num(A[0] * 1000)} ÷ ${B[0]} = ${num(A[0] * 1000 / B[0])}.`),
        ],
        solucion: [
          ['Para comparar, las dos rapideces deben estar en la misma unidad, así que se pasa ', v('a', `${A[0]} km/h`), ' a m/s, con 1000 m / 1 km y 1 h / 3600 s:'],
          [`${A[0]} × 1000 ÷ 3600 = ${num(enMs)} m/s.`],
          [`${num(enMs)} m/s ÷ `, v('b', `${B[0]} m/s`), ' = ', v('x', num(correcta)), ': las unidades se tachan y queda un número.'],
        ],
        _datos: { tipo: 'comparar', sub, nivel: 3, a: A[0], ua: 'km/h', b: B[0], ub: 'm/s' },
      };
    }
    if (sub === 'diferencia') {
      const [A, B] = rng.elegir([[[54, 'Una combi'], [5, 'una ciclista']], [[90, 'Un bus'], [10, 'un velocista']], [[36, 'Una moto'], [4, 'un caballo']], [[72, 'Un tren'], [15, 'una vicuña']]]);
      const enMs = A[0] / 3.6, correcta = limpio(enMs - B[0]);
      return {
        variables: VC('la rapidez en km/h', 'la rapidez en m/s', 'la diferencia en m/s'),
        enunciado: [`${A[1]} va a `, v('a', `${A[0]} km/h`), ` y ${B[1]}, a `, v('b', `${B[0]} m/s`), '.'],
        pregunta: [`¿Cuánto más rápido va ${el(A[1])}, en `, v('x', 'metros por segundo (m/s)'), '?'],
        datos: DATOS_RAPIDEZ, correcta, texto: conU('m/s'), unidad: 'm/s',
        errores: [
          h('U1-sin-convertir', A[0] - B[0], `Restar estaba bien, pero ${A[0]} está en km/h y ${B[0]} en m/s, así que ${A[0]} − ${B[0]} = ${A[0] - B[0]} mezcla unidades.`, TRANS),
          h('CONV-RESTA-SIN-CONVERTIR', limpio((A[0] - B[0]) / 3.6), `El cambio con 3,6 estaba bien, pero lo aplicaste a la resta: (${A[0]} − ${B[0]}) ÷ 3,6 = ${num((A[0] - B[0]) / 3.6)}, y solo ${A[0]} está en km/h.`),
          h('U1-al-reves', limpio(A[0] * 3.6 - B[0]), `Pasar a m/s antes de restar estaba bien, pero el cambio va al revés: ${A[0]} × 3,6 = ${num(A[0] * 3.6)} no son m/s.`, TRANS),
          h('CONV-DOS-VECES', limpio((enMs - B[0]) / 3.6), `La resta en m/s estaba bien, ${num(enMs - B[0])} m/s, pero después la dividiste otra vez entre 3,6 y salió ${num((enMs - B[0]) / 3.6)}.`),
          h('CONV-SUMA', limpio(enMs + B[0]), `Pasaste bien a m/s, ${num(enMs)} m/s, pero se pide cuánto más rápido va: es una resta, no una suma.`),
        ],
        solucion: [
          ['Antes de restar, las dos rapideces se pasan a m/s: ', v('a', `${A[0]} km/h`), ` × 1000 ÷ 3600 = ${num(enMs)} m/s.`],
          [`${num(enMs)} m/s − `, v('b', `${B[0]} m/s`), ' = ', v('x', `${num(correcta)} m/s`), '.'],
        ],
        _datos: { tipo: 'comparar', sub, nivel: 3, a: A[0], ua: 'km/h', b: B[0], ub: 'm/s' },
      };
    }
    // cuantas: una cantidad grande entre una chica, en unidades distintas.
    const c = rng.elegir([
      { a: 10, ua: 'km', b: 400, ub: 'm', t: ['Una carrera de ', ' se corre en una pista de ', ' por vuelta.'], p: '¿Cuántas vueltas son?', eq: ['1 km = 1000 m'] },
      { a: 5, ua: 'km', b: 250, ub: 'm', t: ['Un desfile recorre ', ' por cuadras de ', '.'], p: '¿Cuántas cuadras son?', eq: ['1 km = 1000 m'] },
      { a: 50, ua: 'kg', b: 2500, ub: 'g', t: ['Un saco de ', ' de papa se reparte en bolsas de ', '.'], p: '¿Cuántas bolsas se llenan?', eq: ['1 kg = 1000 g'] },
      { a: 12, ua: 'kg', b: 750, ub: 'g', t: ['Una caja de ', ' de chuño se reparte en paquetes de ', '.'], p: '¿Cuántos paquetes salen?', eq: ['1 kg = 1000 g'] },
      { a: 2.5, ua: 'g', b: 500, ub: 'mg', t: ['Un frasco trae ', ' de vitamina C en pastillas de ', '.'], p: '¿Cuántas pastillas trae?', eq: ['1 g = 1000 mg'] },
      { a: [2, 30], ua: 'h', b: 25, ub: 'min', t: ['Una tarde libre de ', ' alcanza para ver capítulos de ', ' cada uno.'], p: '¿Cuántos capítulos se ven?', eq: ['1 h = 60 min'] },
      { a: [1, 30], ua: 'h', b: 18, ub: 'min', t: ['Un taller de ', ' se divide en turnos de ', ' cada uno.'], p: '¿Cuántos turnos son?', eq: ['1 h = 60 min'] },
    ]);
    let correcta, errores, ta, solucion;
    const tb = `${num(c.b)} ${c.ub}`;
    if (c.ua === 'h') {
      const [hh, mi] = c.a, total = hh * 60 + mi;
      ta = `${hh} h ${mi} min`;
      correcta = total / c.b;
      errores = [
        h('CONV-BASE-100', (hh * 100 + mi) / c.b, `Pasar a minutos estaba bien, pero una hora tiene 60 min, no 100: ${hh * 100 + mi} ÷ ${c.b} = ${num((hh * 100 + mi) / c.b)}.`),
        h('AU4-hora-decimal', limpio((hh + mi / 100) * 60 / c.b), `Multiplicar por 60 estaba bien, pero ${ta} no son ${f(hh + mi / 100, 2)} h: son ${f(hh + mi / 60, 2)} h.`, UNIS),
        h('CONV-SOLO-HORAS', mi / c.b, `Dividir minutos entre minutos estaba bien, pero ${hh === 1 ? 'faltó la hora: son 60 min más' : `faltaron las ${hh} h: son ${hh * 60} min más`}.`),
        h('U6-minutos', limpio((hh + mi / 60) / c.b), `Pasaste bien el tiempo a ${f(hh + mi / 60, 2)} h, pero dividir horas entre minutos mezcla unidades y da ${num((hh + mi / 60) / c.b)}.`, TRANS),
      ];
      solucion = [
        ['Primero se pasa todo a minutos: ', v('a', ta), ` = ${hh} × 60 + ${mi} = ${total} min.`],
        [`${total} min ÷ `, v('b', tb), ' = ', v('x', num(correcta)), '.'],
      ];
    } else {
      const k = EXP[c.ua] - EXP[c.ub]; // la grande pasa a la unidad chica: × 10^k
      const grande = por10(c.a, k);
      ta = `${num(c.a)} ${c.ua}`;
      correcta = limpio(grande / c.b);
      errores = [
        h(c.ua === 'kg' ? 'U4-gramos' : 'U2-sin-prefijo', limpio(c.a / c.b), `Dividir estaba bien, pero ${num(c.a)} está en ${c.ua} y ${num(c.b)} en ${c.ub}, así que ${num(c.a)} ÷ ${c.b} = ${num(c.a / c.b)} mezcla unidades.`, TRANS),
        h('CONV-PREFIJO', limpio(por10(c.a, 2) / c.b), `Pasar a ${c.ub} estaba bien, pero multiplicaste por 100: ${num(por10(c.a, 2))} ÷ ${c.b} = ${num(por10(c.a, 2) / c.b)}. La equivalencia es ${c.eq[0]}.`),
        h('CONV-COCIENTE-AL-REVES', limpio(c.b / grande), `Pasaste bien a ${c.ub}, ${num(grande)} ${c.ub}, pero dividiste la cantidad menor entre la mayor.`),
        h('CONV-COMA', limpio(por10(c.a, 4) / c.b), `Pasar a ${c.ub} estaba bien, pero pusiste un cero de más: ${num(por10(c.a, 4))} ÷ ${c.b} = ${num(por10(c.a, 4) / c.b)}.`),
      ];
      solucion = [
        ['Primero, las dos cantidades se pasan a la misma unidad: ', v('a', ta), ` = ${num(c.a)} × 1000 = ${num(grande)} ${c.ub}.`],
        [`${num(grande)} ${c.ub} ÷ `, v('b', tb), ' = ', v('x', num(correcta)), ': las unidades se tachan.'],
      ];
    }
    return {
      variables: VC('la cantidad mayor', 'la cantidad de cada parte', 'cuántas partes'),
      enunciado: [c.t[0], v('a', ta), c.t[1], v('b', tb), c.t[2]],
      pregunta: [v('x', c.p)], datos: c.eq, correcta, errores, texto: x => num(x), unidad: '',
      solucion,
      _datos: { tipo: 'comparar', sub, nivel: 3, a: c.a, ua: c.ua, b: c.b, ub: c.ub },
    };
  }

  const CONSTRUIR = {
    longitud: rng => prefijo(rng, LONGITUD, 'longitud'), masa: rng => prefijo(rng, MASA, 'masa'),
    tiempo, rapidez, notacion, 'dos-cambios': dosCambios, comparar,
  };

  return { id: ID, titulo: 'Cambiar de unidad', generar, NIVEL };
});
