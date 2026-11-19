/*
 * Generador «Ángulo trigonométrico y sistemas de medida»: la práctica de las cinco ideas de
 * trigonometria.angulo-trigonometrico (contenido/teoria/trigonometria/angulo-trigonometrico.js). Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['trig-sistemas-angulares']) y en Node (require).
 * No usa ningún motor: las cuentas son productos y cocientes de enteros chicos (el giro, 9° = 10ᵍ, π rad = 180°, k).
 *
 * Propuesta: docs/etapa5/propuesta-trigonometria.md §7 (Gerson delegó el criterio; decisión 13: plantilla nueva y la
 * escena cinta-radio a «Más mesas del tema»). Objetos, como en la teoría: el timón de una combi, la llave de un caño, el
 * reloj del aula y la rueda de un triciclo con su pita. Valores de problema, sin fuente.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los
 * de esa idea; generar(semilla, { tipo }) uno solo; sin nada, las cinco ideas con el mismo peso.
 *   sentido-signo      signo (1) de las vueltas y el sentido a los grados con signo · seguidos (2) dos giros seguidos
 *                      del timón o de la llave · giro-x (3) dos giros de flechas contrarias con x y su total
 *   tres-sistemas      convierte (1) de centesimales a sexagesimales o al revés · complemento (2) complemento o
 *                      suplemento con el dato en un sistema y la respuesta en el otro · triangulo (3) el tercer ángulo
 *                      con los otros dos en sistemas distintos, o una suma de examen (San Marcos 2026-I)
 *   minutos-decimales  decimal (1) grados y minutos a grados con decimales · llevada (2) sumar con llevada o restar
 *                      prestando · entre-sistemas (3) minutos o segundos de un sistema al otro, y el minutero en minutos
 *                      centesimales (San Marcos 2022)
 *   radian             a-radianes (1) de grados o de centesimales a radianes · sin-pi (2) radianes sin π a grados, o
 *                      cuántos radios caben en una pita · tres-sistemas-fig (3) triángulo o cuadrilátero con ángulos
 *                      en tres sistemas (San Marcos 2023-I y 2026-II)
 *   formula-general    con-k (1) de S a C o a R con k · condicion (2) una condición entre S y C, el ángulo en grados ·
 *                      halla-r (3) la condición y el ángulo en radianes (San Marcos 2024-II), o una expresión con S y C
 * Lo que la teoría dejó fuera no entra: s = θ · r (Longitud de arco), coterminales y posición normal.
 *
 * Notación y colores (regla de la unidad, cabecera de la teoría; docs/molde-unidad.md §5b): el color dice en qué sistema
 * está escrito un ángulo. La medida sexagesimal (y todo giro, S, x) en carmín (variable sex, h), la centesimal (C) en
 * turquesa (cen, i) y la de radianes (R, π rad) en violeta (rad, f). k, las vueltas, el objeto y lo que se pide, en
 * tinta. Los grados van sin espacio de miles («−1080°»). Ni naranja ni verde.
 * Datos (docs/plan-calidad.md §3, punto 13): equivalencias, definiciones y la fórmula de cada tipo; nunca el paso hecho
 * ni la respuesta. Errores: los códigos de la teoría. TR1 (parcial), TR2 (documentado), TR3 (documentado en cálculo) y
 * TR6 (parcial) de docs/investigacion/trigonometria-ideas-erroneas.md; los demás son hipótesis de aula. Cada explicación
 * empieza por lo que el alumno hizo bien y muestra lo que da su error.
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
  const ID = 'trig-sistemas-angulares';
  const TRF = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d);
  const fg = (x, d = 2) => f(x, d).replace(/\s/g, '');           // sin espacio de miles
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const gr = x => `${fg(x)}°`, cen = x => `${fg(x)}ᵍ`;
  const gm = (g, m) => `${fg(g)}° ${fg(m)}′`;
  // (p/q)·π, simplificado: «π/2», «−3π/4», «2π», «0».
  function piFrac(p, q) {
    if (p === 0) return '0';
    const m = gcd(p, q), num = p / m, den = q / m, sg = num * den < 0 ? '−' : '', a = Math.abs(num), b = Math.abs(den);
    return `${sg}${a === 1 ? '' : a}π${b === 1 ? '' : '/' + b}`;
  }
  const radT = t => `${t} rad`;
  const SEX = x => v('sex', x), CEN = x => v('cen', x), RAD = x => v('rad', x);
  const VARS = {
    sex: { nombre: 'la medida en grados sexagesimales', color: 'h' },
    cen: { nombre: 'la medida en grados centesimales', color: 'i' },
    rad: { nombre: 'la medida en radianes', color: 'f' },
  };
  const NOMBRES_GIRO = { sex: 'el giro, en grados' };

  // ---- Errores: el respaldo sale del código ----
  const RESP = { TR1: 'parcial', TR2: 'documentado', TR3: 'documentado', TR6: 'parcial' };
  const resp = id => (RESP[id] ? { respaldo: RESP[id], fuente: TRF } : { respaldo: 'hipotesis', fuente: null });
  // en(id, valor, fmt, explicación(texto)): error numérico (armar).
  const en = (id, valor, fmt, explicar) => Object.assign({ id, valor, explicacion: explicar(fmt(valor)) }, resp(id));
  // et(id, texto, explicación(texto), num): error de texto (armarTexto); la clave es el texto.
  const et = (id, texto, explicar, num) => Object.assign({ id, clave: texto, texto, explicacion: explicar(texto), num }, resp(id));

  // ---- Datos (una línea cada uno; herramientas, no el paso hecho) ----
  const D = {
    vuelta: '1 vuelta = 360°',
    signo: 'Giro antihorario: positivo. Giro horario: negativo.',
    izq: 'Timón hacia la izquierda: sentido antihorario. Hacia la derecha: sentido horario.',
    seguidos: 'Giros seguidos: el total es la suma de todos, cada uno con su signo.',
    vueltaSC: 'Una vuelta: 360° o 400ᵍ.',
    conv: 'Mismo giro: 9° = 10ᵍ.',
    recto: 'Ángulo recto: 90° o 100ᵍ.',
    llano: 'Ángulo llano: 180° o 200ᵍ.',
    comp: 'Complemento de un ángulo: lo que le falta para el ángulo recto.',
    supl: 'Suplemento de un ángulo: lo que le falta para el ángulo llano.',
    tri: 'Los tres ángulos de un triángulo suman 180°.',
    cuad: 'Los cuatro ángulos de un cuadrilátero suman 360°.',
    min: '1° = 60′ y 1′ = 60″ (minutos y segundos sexagesimales).',
    minC: '1ᵍ = 100ᵐ y 1ᵐ = 100ˢ (minutos y segundos centesimales).',
    minutero: 'El minutero da 1 vuelta en 60 min.',
    pi: 'π rad = 180° = 200ᵍ.',
    piNum: 'π ≈ 3,1416.',
    radDef: 'Medida en radianes de un ángulo central: cuántas veces cabe el radio en su arco.',
    scrDef: 'S, C y R: números de grados sexagesimales, de grados centesimales y de radianes de un mismo ángulo.',
    scr: 'Para un mismo ángulo: S = 9k, C = 10k y R = πk/20.',
    x: 'x es un número, sin unidad.',
  };

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    'sentido-signo': ['signo', 'seguidos', 'giro-x'],
    'tres-sistemas': ['convierte', 'complemento', 'triangulo'],
    'minutos-decimales': ['decimal', 'llevada', 'entre-sistemas'],
    radian: ['a-radianes', 'sin-pi', 'tres-sistemas-fig'],
    'formula-general': ['con-k', 'condicion', 'halla-r'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { signo: 1, seguidos: 2, 'giro-x': 3, convierte: 1, complemento: 2, triangulo: 3, decimal: 1, llevada: 2,
    'entre-sistemas': 3, 'a-radianes': 1, 'sin-pi': 2, 'tres-sistemas-fig': 3, 'con-k': 1, condicion: 2, 'halla-r': 3 };

  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): de menos a más, las cinco ideas.
  const PAPEL = { 'papel-1': ['signo'], 'papel-2': ['convierte'], 'papel-3': ['decimal'], 'papel-4': ['a-radianes'],
    'papel-5': ['condicion'], 'papel-6': ['entre-sistemas'], 'papel-7': ['tres-sistemas-fig'], 'papel-8': ['halla-r'] };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && !o.tipo && PAPEL[String(semilla)];
    let tipo;
    if (o.tipo && CONSTRUIR[o.tipo]) tipo = o.tipo;
    else if (forzado) tipo = forzado[0];
    else tipo = rng.elegir(TIPOS_POR_IDEA[TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS)]);
    for (let intento = 0; intento < 500; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      const p = pr && cerrar(rng, semilla, tipo, pr);
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  // Arma las alternativas (cinco si hay cuatro errores distintos) y el problema. Variables: solo las que se usan.
  function cerrar(rng, semilla, tipo, o) {
    let alternativas, respuesta;
    if (o.correcta && typeof o.correcta === 'object') {
      const c = o.correcta;
      const errores = o.errores.filter(x => x && (c.num === undefined || x.num === undefined || P.enEscala(x.num, c.num, x.id)));
      alternativas = P.armarTexto({ correcta: c, errores, rng });
      respuesta = { valor: c.clave, texto: c.texto, unidad: '' };
    } else {
      const errores = o.errores.filter(x => x && Number.isFinite(x.valor) && Math.abs(x.valor - o.correcta) > 1e-9 && P.enEscala(x.valor, o.correcta, x.id));
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.fmt, negativos: !!o.negativos });
      respuesta = { valor: o.correcta, unidad: '' };
    }
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const nombres = IDEA_DE[tipo] === 'sentido-signo' ? NOMBRES_GIRO : {};
    const variables = Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k], nombres[k] ? { nombre: nombres[k] } : {})]));
    return {
      id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas, solucion: o.solucion, respuesta,
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }

  // ======================= Idea 1: giro con signo =======================
  const COSAS = [
    { id: 'timon', max: 1.5, frase: (v0, sg) => `El chofer de una combi gira el timón ${v0} hacia la ${sg > 0 ? 'izquierda' : 'derecha'}.` },
    { id: 'llave', max: 3, frase: (v0, sg) => (sg > 0 ? `Para abrir un caño giras su llave ${v0} en sentido antihorario.` : `Para cerrar un caño giras su llave ${v0} en sentido horario.`) },
    { id: 'tapa', max: 1.5, frase: (v0, sg) => (sg > 0 ? `Para abrir una botella giras su tapa ${v0} en sentido antihorario.` : `Para cerrar una botella giras su tapa ${v0} en sentido horario.`) },
  ];
  const VUELTAS = [[1, 4, 'un cuarto de vuelta'], [1, 2, 'media vuelta'], [3, 4, 'tres cuartos de vuelta'], [1, 1, 'una vuelta'],
    [5, 4, 'una vuelta y cuarto'], [3, 2, 'una vuelta y media'], [7, 4, 'una vuelta y tres cuartos'], [2, 1, 'dos vueltas'],
    [9, 4, 'dos vueltas y cuarto'], [5, 2, 'dos vueltas y media'], [11, 4, 'dos vueltas y tres cuartos'], [3, 1, 'tres vueltas']];
  const fGiro = x => gr(x);

  function signo(rng) {
    // Sin la vuelta justa: «1 vuelta = 360°» está en los datos.
    const cosa = rng.elegir(COSAS), vv = rng.elegir(VUELTAS.filter(x => x[0] / x[1] <= cosa.max && x[0] !== x[1])), sg = rng.elegir([1, -1]);
    const mag = 360 * vv[0] / vv[1], g = sg * mag;
    // El giro que termina igual por el otro lado (si no es una vuelta justa).
    const otro = mag % 360 ? g - sg * 360 * Math.ceil(mag / 360) : NaN;
    return {
      enunciado: [cosa.frase(vv[2], sg)],
      pregunta: ['¿Cuánto mide ese ángulo trigonométrico?'],
      datos: [D.vuelta, cosa.id === 'timon' ? D.izq : null, D.signo].filter(Boolean),
      correcta: g, fmt: fGiro, negativos: true,
      errores: [
        en(sg < 0 ? 'TRIG-SIGNO-PIERDE' : 'TRIG-SENTIDO', -g, fGiro, x => `Bien el tamaño: ${gr(mag)}. Pero el sentido ${sg > 0 ? 'antihorario' : 'horario'} lleva signo ${sg > 0 ? 'más' : 'menos'}; ${x} va al revés.`),
        en('VUELTA-REDONDEA', sg * 360 * Math.ceil(vv[0] / vv[1]), fGiro, x => `Bien el signo. Pero ${vv[2]} no son vueltas completas: redondear da ${x}.`),
        en('VUELTA-180', g / 2, fGiro, x => `Bien el signo. Pero una vuelta mide 360°, no 180°; con media vuelta por vuelta sale ${x}.`),
        en('FRAC-INVIERTE', sg * 360 * vv[1] / vv[0], fGiro, x => `Bien el signo y que uses 360°. Pero la fracción va al revés: ${vv[1]}/${vv[0]} de vuelta da ${x}.`),
        en('VUELTA-100', sg * 100 * vv[0] / vv[1], fGiro, x => `Bien el signo. Pero una vuelta tiene 360°, no 100; así sale ${x}.`),
        en(sg < 0 ? 'TRIG-NEGATIVO' : 'TRIG-OTRO-LADO', otro, fGiro, x => `Bien: ${x} termina en el mismo lugar. Pero el giro fue otro: ${vv[2]}, en su sentido.`),
        en('TRIG-SOLO-RESTO', sg * (mag % 360 || 360), fGiro, x => `Bien el signo y dónde termina. Pero el giro cuenta todas sus vueltas; ${x} deja vueltas fuera.`),
      ],
      solucion: [
        [`El tamaño: ${vv[2]} son ${vv[1] === 1 ? `${vv[0]}` : `${vv[0]}/${vv[1]}`} · 360° = ${gr(mag)}.`],
        [`El sentido es ${sg > 0 ? 'antihorario: positivo' : 'horario: negativo'}. El ángulo mide `, SEX(gr(g)), '.'],
      ],
      _datos: { sub: cosa.id, n: vv[0], d: vv[1], sg },
    };
  }

  function seguidos(rng) {
    const timon = rng.entero(0, 2) > 0, tope = timon ? 540 : 1080;
    const a = 30 * rng.entero(2, timon ? 12 : 24), b = 30 * rng.entero(2, timon ? 12 : 24), s1 = rng.elegir([1, -1]), s2 = rng.entero(0, 3) ? -s1 : s1;
    if (a === b || a > tope || b > tope || Math.abs(s1 * a + s2 * b) > tope || Math.abs(s1 * a + s2 * b) === 360) return null;
    if (timon && a === 150 && b === 240 && s1 > 0 && s2 < 0) return null;   // la predicción de la idea 1
    const g1 = s1 * a, g2 = s2 * b, tot = g1 + g2, contrarios = s1 !== s2;
    const lado = sg => (timon ? `hacia la ${sg > 0 ? 'izquierda' : 'derecha'}` : `en sentido ${sg > 0 ? 'antihorario' : 'horario'}`);
    return {
      enunciado: [timon ? 'El chofer gira el timón ' : 'Giras la llave de un caño ', SEX(gr(a)), ` ${lado(s1)} y, sin soltar${timon ? 'lo' : 'la'}, `, SEX(gr(b)), ` ${lado(s2)}.`],
      pregunta: ['¿Cuánto mide el giro total?'],
      datos: [timon ? D.izq : null, D.signo, D.seguidos].filter(Boolean),
      correcta: tot, fmt: fGiro, negativos: true,
      errores: [
        contrarios ? en('TRIG-SIN-SIGNO', s1 * (a + b), fGiro, x => `Bien que juntes los dos giros. Pero van en sentidos contrarios: sumar sus tamaños da ${x}.`)
          : en('RESTA-SIEMPRE', s1 * Math.abs(a - b), fGiro, x => `Bien el sentido. Pero los dos giros van hacia el mismo lado y se suman; restarlos da ${x}.`),
        en(tot < 0 ? 'TRIG-SIGNO-PIERDE' : 'TRIG-SENTIDO', -tot, fGiro, x => `Bien el tamaño del total. Pero quedó en sentido ${tot < 0 ? 'horario' : 'antihorario'}; ${x} tiene el signo al revés.`),
        en('TRIG-ULTIMO', g2, fGiro, x => `Bien el signo del segundo giro. Pero el total cuenta los dos; ${x} es solo el segundo.`),
        en('TRIG-PRIMERO', g1, fGiro, x => `Bien el signo del primer giro. Pero el total cuenta los dos; ${x} es solo el primero.`),
        en(tot < 0 ? 'TRIG-NEGATIVO' : 'TRIG-OTRO-LADO', Math.abs(tot) % 360 ? tot - Math.sign(tot) * 360 * Math.ceil(Math.abs(tot) / 360) : NaN, fGiro,
          x => `Bien: ${x} termina en el mismo lugar. Pero no fue ese el recorrido de los dos giros.`),
      ],
      solucion: [
        ['Cada giro con su signo: ', SEX(gr(g1)), ' y ', SEX(gr(g2)), '.'],
        g2 < 0 ? ['Se suman: ', SEX(gr(g1)), ' + (', SEX(gr(g2)), ') = ', SEX(gr(tot)), '.'] : ['Se suman: ', SEX(gr(g1)), ' + ', SEX(gr(g2)), ' = ', SEX(gr(tot)), '.'],
      ],
      _datos: { sub: timon ? 'timon' : 'llave', g1, g2 },
    };
  }

  // Dos giros seguidos del timón, con x: (p₁x + q₁)° a la izquierda y (p₂x + q₂)° a la derecha; el total es T.
  function giroX(rng) {
    const x = rng.entero(5, 40), p1 = rng.entero(2, 6), p2 = rng.entero(1, 5), q1 = 5 * rng.entero(1, 8), q2 = 5 * rng.entero(1, 8);
    if (p1 <= p2) return null;
    const A = p1 * x + q1, B = p2 * x + q2, T = A - B;
    if (A > 540 || B > 540 || T === 0 || Math.abs(T) > 400) return null;
    const ex = (p, q) => `(${p === 1 ? '' : p}x + ${q})°`, med = q => Math.abs(q * 2 - Math.round(q * 2)) < 1e-9;
    const fx = y => fg(y);
    const errs = [
      en('TRIG-SIN-SIGNO', (T - q1 - q2) / (p1 + p2), fx, y => `Bien que juntes los dos giros en una ecuación. Pero el segundo es horario, negativo; sumarlo da x = ${y}.`),
      en('ALG-PARENTESIS', (T - q1 - q2) / (p1 - p2), fx, y => `Bien que restes el giro horario. Pero el menos cambia también su ${q2}: queda −${q2}; así sale x = ${y}.`),
      en('TRIG-SENTIDO', (-T - q1 + q2) / (p1 - p2), fx, y => `Bien el planteo con los signos. Pero el total es ${gr(T)}, con su signo; cambiarlo da x = ${y}.`),
      en('TRIG-PIDE-X', A, fx, y => `Bien la ecuación. Pero se pide x, no la medida del primer giro, que es ${y}°.`),
      en('ALG-SIGNO-MEDIO', (T - q1 + q2) / (p1 + p2), fx, y => `Bien que restes el giro horario. Pero −(${p2 === 1 ? '' : p2}x + ${q2}) también cambia el signo de ${p2 === 1 ? '' : p2}x; así sale x = ${y}.`),
    ].filter(e => e.valor > 0 && med(e.valor));
    return {
      enunciado: ['El chofer gira el timón ', SEX(ex(p1, q1)), ' hacia la izquierda y, sin soltarlo, ', SEX(ex(p2, q2)), ' hacia la derecha. El giro total mide ', SEX(gr(T)), '.'],
      pregunta: ['¿Cuánto vale x?'],
      datos: [D.izq, D.signo, D.seguidos, D.x],
      correcta: x, fmt: fx,
      errores: errs,
      solucion: [
        ['El giro a la derecha es horario: entra con signo menos.'],
        [`(${p1 === 1 ? '' : p1}x + ${q1}) − (${p2 === 1 ? '' : p2}x + ${q2}) = ${fg(T)}, o sea ${p1 - p2 === 1 ? '' : fg(p1 - p2)}x ${q1 - q2 < 0 ? '−' : '+'} ${Math.abs(q1 - q2)} = ${fg(T)}: `, SEX(`x = ${x}`), '.'],
      ],
      _datos: { p1, q1, p2, q2, T },
    };
  }

  // ======================= Idea 2: sexagesimal y centesimal =======================
  function convierte(rng) {
    const k = rng.entero(2, 38) * (rng.entero(0, 4) ? 1 : -1), s = 9 * k, c = 10 * k, aSex = rng.entero(0, 1) === 1;
    const fmt = aSex ? gr : cen, dato = aSex ? CEN(cen(c)) : SEX(gr(s)), bien = aSex ? s : c;
    const errores = aSex ? [
      en('CONV-MISMO', c, fmt, x => `Bien que conserves el signo. Pero la vuelta tiene 400ᵍ y solo 360°: ${x} deja el número igual.`),
      en('CONV-RESTA-40', c - 40 * Math.sign(c), fmt, x => `Bien que el número sexagesimal sea menor. Pero 40 es la diferencia entre vueltas enteras; restarlo da ${x}.`),
      en('CONV-INVERSA', c * 10 / 9, fmt, x => `Bien que uses 9 y 10. Pero el número sexagesimal es el menor: por 10/9 sale ${x}.`),
      en('CONV-RESTA-10', c - 10 * Math.sign(c), fmt, x => `Bien en el ángulo recto, 100ᵍ = 90°. En los demás no se quita 10: ${x} no es.`),
      en('CONV-MITAD', c * 1.8, fmt, x => `Bien que multipliques. Pero eso toma 100ᵍ por media vuelta; así sale ${x}.`),
    ] : [
      en('CONV-MISMO', s, fmt, x => `Bien que conserves el signo. Pero la vuelta tiene 360° y 400ᵍ: ${x} deja el número igual.`),
      en('CONV-RESTA-40', s + 40 * Math.sign(s), fmt, x => `Bien que el número centesimal sea mayor. Pero 40 es la diferencia entre vueltas enteras; sumarlo da ${x}.`),
      en('CONV-INVERSA', s * 9 / 10, fmt, x => `Bien que uses 9 y 10. Pero el número centesimal es el mayor: por 9/10 sale ${x}.`),
      en('CONV-RESTA-10', s + 10 * Math.sign(s), fmt, x => `Bien en el ángulo recto, 90° = 100ᵍ. En los demás no se suma 10: ${x} no es.`),
      en('CONV-MITAD', s / 1.8, fmt, x => `Bien que dividas. Pero eso toma 100ᵍ por media vuelta; así sale ${x}.`),
    ];
    return {
      enunciado: ['Un ángulo trigonométrico mide ', dato, '.'],
      pregunta: [`¿Cuánto mide en grados ${aSex ? 'sexagesimales' : 'centesimales'}?`],
      datos: [D.vueltaSC, D.conv],
      correcta: bien, fmt, negativos: true,
      errores: errores.filter(e => Math.abs(e.valor * 10 - Math.round(e.valor * 10)) < 1e-9),
      solucion: [
        [aSex ? 'Cada 10ᵍ son 9°: se multiplica por 9/10. El signo no cambia.' : 'Cada 9° son 10ᵍ: se multiplica por 10/9. El signo no cambia.'],
        [dato, aSex ? ' · 9/10 = ' : ' · 10/9 = ', aSex ? SEX(gr(s)) : CEN(cen(c)), '.'],
      ],
      _datos: { de: aSex ? 'cen' : 'sex', s, c },
    };
  }

  function complemento(rng) {
    const supl = rng.entero(0, 1) === 1, enC = rng.entero(0, 1) === 1;       // enC: el dato está en centesimales
    const Tc = supl ? 200 : 100, Ts = supl ? 180 : 90, que = supl ? 'suplemento' : 'complemento';
    const k = rng.entero(1, supl ? 17 : 8), xc = 10 * k, xs = 9 * k;
    const bien = enC ? Ts - xs : Tc - xc, fmt = enC ? gr : cen;
    const dato = enC ? CEN(cen(xc)) : SEX(gr(xs));
    return {
      enunciado: ['Un ángulo mide ', dato, '.'],
      pregunta: [`¿Cuánto mide su ${que}, en grados ${enC ? 'sexagesimales' : 'centesimales'}?`],
      datos: [supl ? D.supl : D.comp, supl ? D.llano : D.recto, D.conv],
      correcta: bien, fmt,
      errores: [
        en('CONV-MISMO', enC ? Ts - xc : Tc - xs, fmt, x => `Bien que restes del ángulo ${supl ? 'llano' : 'recto'}. Pero el dato está en otra escala; sin convertirlo sale ${x}.`),
        en('CONV-SIMBOLO', enC ? Tc - xc : Ts - xs, fmt, x => `Bien la resta en el sistema del dato. Pero falta pasar el resultado al sistema pedido; ${x} no cambió.`),
        en('CONV-ANGULO', enC ? xs : xc, fmt, x => `Bien la conversión del ángulo: ${x}. Pero se pide su ${que}, lo que le falta.`),
        en('COMP-180', enC ? (supl ? 90 : 180) - xs : (supl ? 100 : 200) - xc, fmt, x => `Bien la conversión. Pero el ${que} completa el ángulo ${supl ? 'llano' : 'recto'}; con el otro sale ${x}.`),
      ],
      solucion: [
        enC ? ['El ángulo, en sexagesimales: ', dato, ' · 9/10 = ', SEX(gr(xs)), '.'] : ['El ángulo, en centesimales: ', dato, ' · 10/9 = ', CEN(cen(xc)), '.'],
        enC ? [`El ${que}: ${gr(Ts)} − ${gr(xs)} = `, SEX(gr(bien)), '.'] : [`El ${que}: ${cen(Tc)} − ${cen(xc)} = `, CEN(cen(bien)), '.'],
      ],
      _datos: { sub: supl ? 'suplemento' : 'complemento', de: enC ? 'cen' : 'sex', xs, xc },
    };
  }

  function triangulo(rng) {
    if (rng.entero(0, 2) === 0) {
      // Suma de examen: a° + bᵍ + cᵍ, en sexagesimales.
      const a = rng.entero(5, 60), b = 10 * rng.entero(2, 9), c = 10 * rng.entero(2, 9);
      if (b === c) return null;
      const bien = a + 0.9 * (b + c);
      return {
        enunciado: ['Se suman tres ángulos: ', SEX(gr(a)), ' + ', CEN(cen(b)), ' + ', CEN(cen(c)), '.'],
        pregunta: ['¿Cuánto mide la suma, en grados sexagesimales?'],
        datos: [D.conv],
        correcta: bien, fmt: gr,
        errores: [
          en('CONV-TODO', 0.9 * (a + b + c), gr, x => `Bien la conversión de los centesimales. Pero ${gr(a)} ya era sexagesimal; convertirlo también da ${x}.`),
          en('CONV-MISMO', a + b + c, gr, x => `Bien que sumes los tres. Pero dos están en centesimales: sin convertirlos sale ${x}.`),
          en('CONV-OLVIDA', 0.9 * (b + c), gr, x => `Bien la conversión de los centesimales. Pero falta sumar ${gr(a)}; sin él sale ${x}.`),
          en('CONV-UNO', a + 0.9 * b + c, gr, x => `Bien la conversión de ${cen(b)}. Pero ${cen(c)} también es centesimal; sin convertirlo sale ${x}.`),
          en('CONV-INVERSA', a + (b + c) * 10 / 9, gr, x => `Bien que conviertas los centesimales. Pero 10ᵍ son 9°: por 10/9 sale ${x}.`),
          en('CONV-SIMBOLO', a * 10 / 9 + b + c, gr, x => `Bien la suma en centesimales. Pero se pide en sexagesimales; ${x} se quedó en la otra escala.`),
        ].filter(e => Math.abs(e.valor * 10 - Math.round(e.valor * 10)) < 1e-9),
        solucion: [
          ['Los centesimales, a sexagesimales: ', CEN(cen(b)), ' = ', SEX(gr(0.9 * b)), ' y ', CEN(cen(c)), ' = ', SEX(gr(0.9 * c)), '.'],
          [`La suma: ${gr(a)} + ${gr(0.9 * b)} + ${gr(0.9 * c)} = `, SEX(gr(bien)), '.'],
        ],
        _datos: { sub: 'suma', a, b, c },
      };
    }
    const kc = rng.entero(3, 9), ks = rng.entero(3, 11);
    if (9 * kc + 9 * ks > 162 || kc === ks) return null;
    const xc = 10 * kc, ys = 9 * ks, ter = 180 - 9 * kc - ys, enC = rng.entero(0, 1) === 1;
    const bien = enC ? ter * 10 / 9 : ter, fmt = enC ? cen : gr;
    return {
      enunciado: ['Dos ángulos de un triángulo miden ', CEN(cen(xc)), ' y ', SEX(gr(ys)), '.'],
      pregunta: [`¿Cuánto mide el tercero, en grados ${enC ? 'centesimales' : 'sexagesimales'}?`],
      datos: [D.tri, D.conv],
      correcta: bien, fmt,
      errores: [
        enC ? en('CONV-SIN-VOLVER', ter, fmt, x => `Bien la cuenta en sexagesimales: ${gr(ter)}. Falta pasarla a centesimales; ${x} no lo hace.`)
          : en('CONV-MISMO', 180 - xc - ys, fmt, x => `Bien que restes de 180°. Pero ${cen(xc)} es centesimal: sin convertirlo sale ${x}.`),
        en('CONV-MISMO-200', 200 - xc - ys, fmt, x => `Bien que restes los dos ángulos. Pero están en escalas distintas: sin convertir sale ${x}.`),
        en('CONV-SUMA', enC ? (9 * kc + ys) * 10 / 9 : 9 * kc + ys, fmt, x => `Bien la conversión. Pero ${x} es lo que suman los dos: falta restarlo del total.`),
        en('CONV-INVERSA', enC ? ter * 0.9 : 180 - xc * 10 / 9 - ys, fmt, x => `Bien el planteo. Pero la conversión va al revés: 10ᵍ son 9°; así sale ${x}.`),
      ].filter(e => e.valor > 0 && Math.abs(e.valor * 10 - Math.round(e.valor * 10)) < 1e-9),
      solucion: [
        ['Todo a sexagesimales: ', CEN(cen(xc)), ' = ', SEX(gr(9 * kc)), '.'],
        enC ? [`El tercero: 180° − ${gr(9 * kc)} − ${gr(ys)} = ${gr(ter)}, que son `, CEN(cen(bien)), '.'] : [`El tercero: 180° − ${gr(9 * kc)} − ${gr(ys)} = `, SEX(gr(bien)), '.'],
      ],
      _datos: { sub: 'triangulo', xc, ys, en: enC ? 'cen' : 'sex' },
    };
  }

  // ======================= Idea 3: minutos y segundos =======================
  function decimal(rng) {
    const g = rng.entero(1, 40), m = 3 * rng.entero(1, 19), dec = g + m / 60, fmt = x => `${fg(x)}°`;
    return {
      enunciado: ['Un ángulo mide ', SEX(gm(g, m)), '.'],
      pregunta: ['¿Cuánto mide en grados, con decimales?'],
      datos: [D.min],
      correcta: dec, fmt,
      errores: [
        en('SEX-DECIMAL', g + m / 100, fmt, x => `Bien los ${g} grados enteros. Pero los minutos no son centésimas: se dividen entre 60, no entre 100.`),
        en('SEX-CIEN', (60 * g + m) / 100, fmt, x => `Bien que pases todo a minutos. Pero para volver a grados se divide entre 60; entre 100 sale ${x}.`),
        en('SEX-SUMA', g + m, fmt, x => `Bien que juntes las dos partes. Pero los minutos son pedazos de grado; sumarlos enteros da ${x}.`),
        en('SEX-SOLO-MIN', m / 60, fmt, x => `Bien los minutos: ${m}/60 = ${x}. Faltan los ${g} grados enteros.`),
      ].filter(e => Math.abs(e.valor * 100 - Math.round(e.valor * 100)) < 1e-9),
      solucion: [
        [`Un grado tiene 60 minutos: ${m}′ = ${m}/60 de grado = ${fg(m / 60)}°.`],
        [`Se suman los grados enteros: ${g} + ${fg(m / 60)} = `, SEX(fmt(dec)), '.'],
      ],
      _datos: { g, m },
    };
  }

  function llevada(rng) {
    if (rng.entero(0, 1)) {
      // Suma con llevada.
      const g1 = rng.entero(5, 60), g2 = rng.entero(5, 60), m1 = 5 * rng.entero(5, 11), m2 = 5 * rng.entero(5, 11);
      if (m1 + m2 < 65 || m1 + m2 >= 100) return null;
      const G = g1 + g2, M = m1 + m2, bien = gm(G + 1, M - 60), tot = 60 * G + M;
      const dec = Math.round((g1 + m1 / 100 + g2 + m2 / 100) * 100) / 100, gD = Math.floor(dec), mD = Math.round((dec - gD) * 60);
      const errs = [
        et('SEX-SIN-LLEVADA', gm(G, M), x => `Bien grados con grados y minutos con minutos. Pero ${M}′ pasan de 60: sale un grado más.`),
        et('SEX-LLEVA-SIN-RESTAR', gm(G + 1, M), x => `Bien que sumes un grado. Pero esos 60 minutos se quitan de los ${M}′; ${x} los cuenta dos veces.`),
        et('SEX-RESTA-SIN-LLEVAR', gm(G, M - 60), x => `Bien que quites 60 minutos. Pero esos 60′ son un grado más; ${x} lo pierde.`),
        mD !== M - 60 || gD !== G + 1 ? et('SEX-DECIMAL', gm(gD, mD), x => `Bien la suma de las partes. Pero ${gm(g1, m1)} no es ${fg(g1 + m1 / 100)}°: los minutos no son decimales.`) : null,
        et('SEX-LLEVA-100', gm(G + 1, M - 40), x => `Bien que lleves un grado. Pero un grado son 60′, no 40′ que falten para 100; así sale ${x}.`),
      ];
      return {
        enunciado: ['Se suman dos ángulos: ', SEX(gm(g1, m1)), ' y ', SEX(gm(g2, m2)), '.'],
        pregunta: ['¿Cuánto mide la suma, en grados y minutos?'],
        datos: [D.min],
        correcta: { clave: bien, texto: bien, num: tot },
        errores: errs.filter(Boolean),
        solucion: [
          [`Grados con grados y minutos con minutos: ${gm(G, M)}.`],
          [`${M}′ = 60′ + ${M - 60}′ = 1° ${M - 60}′: la suma es `, SEX(bien), '.'],
        ],
        _datos: { sub: 'suma', g1, m1, g2, m2 },
      };
    }
    // Resta prestando (una diferencia o un complemento).
    const comp = rng.entero(0, 1) === 1;
    let g1, m1, g2, m2;
    if (comp) { g1 = 90; m1 = 0; g2 = rng.entero(12, 78); m2 = 5 * rng.entero(1, 11); } else { g1 = rng.entero(20, 80); g2 = rng.entero(5, g1 - 6); m1 = 5 * rng.entero(0, 6); m2 = 5 * rng.entero(4, 11); }
    if (m1 >= m2) return null;
    const G = g1 - g2, bien = gm(G - 1, m1 + 60 - m2), tot = 60 * (G - 1) + m1 + 60 - m2;
    return {
      enunciado: comp ? ['Un ángulo mide ', SEX(gm(g2, m2)), '.'] : ['Se restan dos ángulos: ', SEX(gm(g1, m1)), ' menos ', SEX(gm(g2, m2)), '.'],
      pregunta: [comp ? '¿Cuánto mide su complemento, en grados y minutos?' : '¿Cuánto mide la diferencia, en grados y minutos?'],
      datos: comp ? [D.comp, 'Ángulo recto: 90°.', D.min] : [D.min],
      correcta: { clave: bien, texto: bien, num: tot },
      errores: [
        et('SEX-PRESTA-100', gm(G - 1, m1 + 100 - m2), x => `Bien que prestes un grado. Pero ese grado son 60 minutos, no 100; así sale ${x}.`),
        et('SEX-NO-DESCUENTA', gm(G, m1 + 60 - m2), x => `Bien los minutos: ${m1 + 60 - m2}′. Pero el grado prestado ya no se cuenta en los grados.`),
        et('SEX-INVIERTE', gm(G, m2 - m1), x => `Bien los grados. Pero los minutos se restaron al revés, ${m2} − ${m1}: hay que prestar un grado.`),
        et('SEX-SOLO-GRADOS', gm(G, m1 + m2), x => `Bien la resta de los grados. Pero los minutos también se restan; sumarlos da ${x}.`),
      ],
      solucion: [
        [`A ${m1}′ no se le pueden quitar ${m2}′: se presta un grado, que son 60′. ${gm(g1, m1)} = ${gm(g1 - 1, m1 + 60)}.`],
        [`${gm(g1 - 1, m1 + 60)} − ${gm(g2, m2)} = `, SEX(bien), '.'],
      ],
      _datos: { sub: comp ? 'complemento' : 'resta', g1, m1, g2, m2 },
    };
  }

  function entreSistemas(rng) {
    const sub = rng.elegir(['min-a-cen', 'cen-a-min', 'minutero']), k = rng.entero(1, 6);
    if (sub === 'minutero') {
      const t = 3 * rng.entero(1, 9), bien = 2000 * t / 3, fmt = x => `${fg(x)}ᵐ`;
      return {
        enunciado: [`El minutero de un reloj avanza durante ${t} minutos.`],
        pregunta: ['¿Cuántos minutos centesimales mide el ángulo que barre? (Solo su tamaño, sin signo.)'],
        datos: [D.minutero, D.vueltaSC, D.minC],
        correcta: bien, fmt,
        errores: [
          en('MIN-MISMO', 360 * t, fmt, x => `Bien el giro: ${gr(6 * t)}. Pero ${x} son sus minutos sexagesimales: falta cambiar de sistema.`),
          en('CONV-MISMO', 600 * t, fmt, x => `Bien que multipliques por 100. Pero ${gr(6 * t)} es sexagesimal: antes se pasa a centesimales.`),
          en('MIN-GRADOS', 20 * t / 3, fmt, x => `Bien el giro en centesimales: ${cen(20 * t / 3)}. Cada grado tiene 100 minutos; falta multiplicar.`),
          en('CEN-SESENTA', 400 * t, fmt, x => `Bien el giro en centesimales. Pero un grado centesimal tiene 100 minutos, no 60; así sale ${x}.`),
          en('CEN-MIL', 20000 * t / 3, fmt, x => `Bien el giro en centesimales: ${cen(20 * t / 3)}. Pero cada grado tiene 100 minutos, no 1000.`),
        ],
        solucion: [
          [`En ${t} de los 60 minutos de su vuelta, que tiene 400ᵍ: ${t}/60 · 400ᵍ = ${cen(20 * t / 3)}.`],
          [`Cada grado centesimal tiene 100ᵐ: ${fg(20 * t / 3)} · 100 = `, CEN(fmt(bien)), '.'],
        ],
        _datos: { sub, t },
      };
    }
    if (sub === 'min-a-cen' && k === 2) return null;            // 100ᵐ = 1ᵍ está en los datos
    if (k === 1) return null;                                   // 27′ = 50ᵐ es la predicción de la idea 3: no se da resuelta
    const T = {
      'min-a-cen': { de: 27 * k, a: 50 * k, u1: '′', u2: 'ᵐ', n1: 'minutos sexagesimales', n2: 'minutos centesimales', sex: true,
        mal: [27 * k, 30 * k, 45 * k, 40.5 * k, 75 * k] },
      'cen-a-min': { de: 50 * k, a: 27 * k, u1: 'ᵐ', u2: '′', n1: 'minutos centesimales', n2: 'minutos sexagesimales', sex: false,
        mal: [50 * k, 45 * k, 30 * k, 100 * k / 3, 18 * k] },
      seg: { de: 81 * k, a: 250 * k, u1: '″', u2: 'ˢ', n1: 'segundos sexagesimales', n2: 'segundos centesimales', sex: true,
        mal: [81 * k, 90 * k, 225 * k, 135 * k] },
    }[sub];
    const fmt = x => `${fg(x)}${T.u2}`, dato = T.sex ? SEX(`${fg(T.de)}${T.u1}`) : CEN(`${fg(T.de)}${T.u1}`);
    const partes = sub === 'seg' ? 3600 : 60, partesC = sub === 'seg' ? 10000 : 100;
    return {
      enunciado: ['Un ángulo mide ', dato, `, ${T.n1}.`],
      pregunta: [`¿Cuántos ${T.n2} mide?`],
      datos: [D.min, D.minC, D.conv],
      correcta: T.a, fmt,
      errores: [
        en('MIN-MISMO', T.mal[0], fmt, x => `Bien que conserves el ángulo. Pero los ${sub === 'seg' ? 'segundos' : 'minutos'} de los dos sistemas no miden lo mismo: ${x} no es.`),
        en('MIN-FACTOR-GRADO', T.mal[1], fmt, x => `Bien que uses 9 y 10, el cambio de los grados. Pero además cambia en cuántas partes se divide cada grado.`),
        en('MIN-SIN-SISTEMA', T.mal[2], fmt, x => `Bien que cambies entre ${partes} y ${partesC} partes. Falta además cambiar el grado: 9° son 10ᵍ.`),
        en('MIN-DOS-VECES', T.mal[4], fmt, x => `Bien que cambies entre 60 y 100 partes. Pero se cambia una sola vez; dos veces da ${x}.`),
        sub === 'seg' ? en('MIN-UNA-VEZ', T.mal[3], fmt, x => `Bien que cambies 60 por 100. Pero en los segundos se cambia dos veces: 3600 partes por 10 000.`)
          : en('CONV-INVERSA', T.mal[3], fmt, x => `Bien que pases por los grados. Pero la conversión va al revés: ${T.sex ? '9° son 10ᵍ' : '10ᵍ son 9°'}; así sale ${x}.`),
      ].filter(e => Math.abs(e.valor * 100 - Math.round(e.valor * 100)) < 1e-9 && Math.abs(e.valor * 10 - Math.round(e.valor * 10)) < 1e-9),
      solucion: T.sex
        ? [[`A grados: ${fg(T.de)}/${partes} = ${fg(T.de / partes, 4)}°. A centesimales: · 10/9 = ${fg(T.de / partes * 10 / 9, 4)}ᵍ.`],
          [`A ${T.n2}: · ${f(partesC, 0)} = `, CEN(fmt(T.a)), '.']]
        : [[`A grados: ${fg(T.de)}/100 = ${fg(T.de / 100, 4)}ᵍ. A sexagesimales: · 9/10 = ${fg(T.de / 100 * 0.9, 4)}°.`],
          ['A minutos sexagesimales: · 60 = ', SEX(fmt(T.a)), '.']],
      _datos: { sub, de: T.de },
    };
  }

  // ======================= Idea 4: el radián =======================
  const PIG = [15, 18, 20, 30, 36, 40, 45, 54, 60, 72, 75, 90, 108, 120, 135, 144, 150, 210, 225, 240, 270, 300, 315];
  function aRadianes(rng) {
    const sg = rng.entero(0, 4) ? 1 : -1;
    if (rng.entero(0, 1)) {
      const dd = sg * rng.elegir(PIG), bien = radT(piFrac(dd, 180));
      return {
        enunciado: ['Un ángulo trigonométrico mide ', SEX(gr(dd)), '.'],
        pregunta: ['¿Cuánto mide en radianes?'],
        datos: [D.pi],
        correcta: { clave: bien, texto: bien, num: dd },
        errores: [
          et('CONV-PI', radT(fg(dd / 180)), x => `Bien la fracción de media vuelta: ${fg(dd / 180)}. Falta multiplicarla por π.`, dd / Math.PI),
          et('RAD-200', radT(piFrac(dd, 200)), x => `Bien que pongas π arriba. Pero 200 es la media vuelta centesimal; aquí va 180.`, dd * 0.9),
          et('CONV-INVERSA', radT(piFrac(sg * 180, Math.abs(dd))), x => `Bien que uses π y 180. Pero la fracción quedó al revés: los grados van arriba.`, 180 * 180 / dd),
          et('RAD-VUELTA', radT(piFrac(dd, 360)), x => `Bien que pongas π arriba. Pero π rad es media vuelta, 180°, no la vuelta entera.`, dd / 2),
          et('TR3', radT(fg(dd)), x => `Bien el número de grados. Pero un grado no es un radián: 1 rad mide unos 57°.`, dd * 180 / Math.PI),
        ],
        solucion: [
          ['Media vuelta son 180° y también π rad: se multiplica por π rad/180°.'],
          [`${gr(dd)} · π/180° = `, RAD(bien), '.'],
        ],
        _datos: { sub: 'sex', g: dd },
      };
    }
    const cc = sg * rng.elegir([20, 25, 40, 50, 80, 100, 120, 125, 150, 160, 250, 300, 350]), bien = radT(piFrac(cc, 200));
    return {
      enunciado: ['Un ángulo trigonométrico mide ', CEN(cen(cc)), '.'],
      pregunta: ['¿Cuánto mide en radianes?'],
      datos: [D.pi],
      correcta: { clave: bien, texto: bien, num: cc },
      errores: [
        et('CONV-PI', radT(fg(cc / 200, 3)), x => `Bien la fracción de media vuelta: ${fg(cc / 200, 3)}. Falta multiplicarla por π.`, cc / Math.PI * 200 / 180),
        et('RAD-200', radT(piFrac(cc, 180)), x => `Bien que pongas π arriba. Pero 180 es la media vuelta sexagesimal; aquí va 200.`, cc * 10 / 9),
        et('CONV-INVERSA', radT(piFrac(sg * 200, Math.abs(cc))), x => `Bien que uses π y 200. Pero la fracción quedó al revés: los grados van arriba.`, 200 * 200 / cc),
        et('RAD-VUELTA', radT(piFrac(cc, 400)), x => `Bien que pongas π arriba. Pero π rad es media vuelta, 200ᵍ, no la vuelta entera.`, cc / 2),
        et('TR3', radT(fg(cc)), x => `Bien el número de grados. Pero un grado centesimal no es un radián; falta convertir.`, cc * 200 / Math.PI),
      ],
      solucion: [
        ['Media vuelta son 200ᵍ y también π rad: se multiplica por π rad/200ᵍ.'],
        [`${cen(cc)} · π/200ᵍ = `, RAD(bien), '.'],
      ],
      _datos: { sub: 'cen', c: cc },
    };
  }

  function sinPi(rng) {
    if (rng.entero(0, 1)) {
      const t = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), bien = t * 180 / Math.PI, fmt = x => `${fg(x, 1)}°`;
      return {
        enunciado: ['Un ángulo mide ', RAD(radT(fg(t))), ', así, sin π.'],
        pregunta: ['¿Cuánto mide, aproximadamente, en grados sexagesimales?'],
        datos: [D.pi, D.piNum],
        correcta: Math.round(bien * 10) / 10, fmt,
        errores: [
          en('TR1', 180 * t, fmt, x => `Bien que uses 180°. Pero eso lee ${fg(t)} como ${fg(t)}π: aquí no hay π, se divide entre π.`),
          en('TR3', t, fmt, x => `Bien el número. Pero radianes y grados no son la misma unidad: un radián mide unos 57°.`),
          en('RAD-MEDIA', Math.round(t * 90 / Math.PI * 10) / 10, fmt, x => `Bien que dividas entre π. Pero π rad son 180°; tomar 2π rad por 180° da ${x}.`),
          en('RAD-200', Math.round(t * 200 / Math.PI * 10) / 10, fmt, x => `Bien que dividas entre π. Pero con 200 salen centesimales; para grados va 180.`),
          en('RAD-MULTIPLICA', Math.round(t * 180 * Math.PI * 10) / 10, fmt, x => `Bien que uses 180 y π. Pero π divide: 180°/π es un radián; multiplicar da ${x}.`),
        ],
        solucion: [
          ['π es el número 3,1416: se multiplica por 180°/π rad.'],
          [`${fg(t)} · 180°/3,1416 ≈ `, SEX(fmt(Math.round(bien * 10) / 10)), '.'],
        ],
        _datos: { sub: 'sinpi', t },
      };
    }
    const cm = rng.elegir([12, 16, 20, 24, 30, 40]), t = rng.elegir([0.5, 1.5, 2, 2.5, 3]), L = cm * t, fmt = x => radT(fg(x));
    return {
      enunciado: [`Una rueda de triciclo tiene ${fg(cm)} cm de radio. Sobre su llanta se acuesta una pita de ${fg(L)} cm.`],
      pregunta: ['¿Qué ángulo abarca la pita desde el centro, en radianes?'],
      datos: [D.radDef],
      correcta: t, fmt,
      errores: [
        en('TR2', cm / L, fmt, x => `Bien que dividas los dos largos. Pero se cuenta cuántos radios caben en la pita, no al revés.`),
        en('RAD-RESTA', L - cm, fmt, x => `Bien que compares la pita con el radio. Pero se comparan dividiendo; restar da ${x}.`),
        en('TR3', Math.round(t * 180 / Math.PI), fmt, x => `Bien la idea de ángulo. Pero ese número son grados; en radianes es el número de radios de la pita.`),
        en('TR1', Math.round(t * Math.PI * 100) / 100, fmt, x => `Bien la división. Pero no se multiplica por π: el número de radios ya es la medida.`),
      ],
      solucion: [
        ['El ángulo en radianes cuenta cuántas veces cabe el radio en la pita.'],
        [`${fg(L)} cm ÷ ${fg(cm)} cm = `, RAD(fmt(t)), ': los centímetros se van.'],
      ],
      _datos: { sub: 'radios', cm, L },
    };
  }

  function tresSistemasFig(rng) {
    if (rng.entero(0, 1)) {
      // Triángulo: a en radianes con π, el otro en centesimales; el tercero en grados o en radianes.
      const a = rng.elegir([18, 36, 45, 54, 60, 72, 90]), kc = rng.entero(2, 9);
      if (a + 9 * kc > 160 || a === 9 * kc) return null;
      const xc = 10 * kc, ter = 180 - a - 9 * kc, enRad = rng.entero(0, 2) === 0;
      const base = {
        enunciado: ['Dos ángulos de un triángulo miden ', RAD(radT(piFrac(a, 180))), ' y ', CEN(cen(xc)), '.'],
        datos: [D.tri, D.pi, D.conv],
      };
      if (enRad) {
        const bien = radT(piFrac(ter, 180));
        return Object.assign(base, {
          pregunta: ['¿Cuánto mide el tercero, en radianes?'],
          correcta: { clave: bien, texto: bien, num: ter },
          errores: [
            et('CONV-MISMO', radT(piFrac(180 - a - xc, 180)), x => `Bien el planteo. Pero ${cen(xc)} se restó como si fueran grados sexagesimales.`, 180 - a - xc),
            et('CONV-SUMA', radT(piFrac(a + 9 * kc, 180)), x => `Bien las conversiones. Pero esa es la suma de los dos: falta restarla de 180°.`, a + 9 * kc),
            et('RAD-200', radT(piFrac(ter, 200)), x => `Bien el ángulo en grados: ${gr(ter)}. Pero a radianes se divide entre 180, no entre 200.`, ter * 0.9),
            et('CONV-PI', radT(`${fg(ter)}π`), x => `Bien el ángulo en grados: ${gr(ter)}. Falta dividir entre 180 al pasar a radianes.`, ter * 180),
          ],
          solucion: [
            ['A sexagesimales: ', RAD(radT(piFrac(a, 180))), ' = ', SEX(gr(a)), ' y ', CEN(cen(xc)), ' = ', SEX(gr(9 * kc)), '.'],
            [`El tercero: 180° − ${gr(a)} − ${gr(9 * kc)} = ${gr(ter)}, que son `, RAD(bien), '.'],
          ],
          _datos: { sub: 'triangulo', a, xc, en: 'rad' },
        });
      }
      return Object.assign(base, {
        pregunta: ['¿Cuánto mide el tercero, en grados sexagesimales?'],
        correcta: ter, fmt: gr,
        errores: [
          en('CONV-MISMO', 180 - a - xc, gr, x => `Bien que restes de 180°. Pero ${cen(xc)} se restó como si fueran grados sexagesimales.`),
          en('RAD-200', 180 - a * 10 / 9 - 9 * kc, gr, x => `Bien el planteo. Pero π rad son 180°: con 200 el primer ángulo sale en centesimales.`),
          en('CONV-SUMA', a + 9 * kc, gr, x => `Bien las conversiones. Pero esa es la suma de los dos: falta restarla de 180°.`),
          en('CONV-MISMO-200', 200 - a - 9 * kc, gr, x => `Bien las conversiones. Pero en sexagesimales los tres ángulos suman 180°, no 200.`),
        ].filter(e => e.valor > 0 && Math.abs(e.valor * 10 - Math.round(e.valor * 10)) < 1e-9),
        solucion: [
          ['A sexagesimales: ', RAD(radT(piFrac(a, 180))), ' = ', SEX(gr(a)), ' y ', CEN(cen(xc)), ' = ', SEX(gr(9 * kc)), '.'],
          [`El tercero: 180° − ${gr(a)} − ${gr(9 * kc)} = `, SEX(gr(ter)), '.'],
        ],
        _datos: { sub: 'triangulo', a, xc, en: 'sex' },
      });
    }
    // Cuadrilátero con tres ángulos en radianes (San Marcos 2026-II).
    const cs = rng.barajar([30, 45, 60, 90, 120, 135, 150]).slice(0, 3);
    const suma = cs[0] + cs[1] + cs[2], cuarto = 360 - suma;
    if (cuarto <= 20 || cuarto >= 180) return null;
    const txt = cs.map(c => piFrac(c, 180));
    return {
      enunciado: ['Tres ángulos de un cuadrilátero miden ', RAD(txt[0]), ', ', RAD(txt[1]), ' y ', RAD(radT(txt[2])), '.'],
      pregunta: ['¿Cuánto mide el cuarto, en grados sexagesimales?'],
      datos: [D.cuad, D.pi],
      correcta: cuarto, fmt: gr,
      errores: [
        en('CONV-SUMA', suma, gr, x => `Bien las conversiones. Pero ${x} es lo que suman los tres: falta restarlo de 360°.`),
        en('CONV-MISMO-400', 400 - suma, gr, x => `Bien la suma de los tres. Pero en sexagesimales el cuadrilátero suma 360°, no 400.`),
        en('CUAD-TRIANGULO', 180 - suma, gr, x => `Bien la suma de los tres. Pero un cuadrilátero suma 360°, no 180°.`),
        en('RAD-200', 360 - suma * 10 / 9, gr, x => `Bien el planteo. Pero π rad son 180°: con 200 los ángulos salen en centesimales.`),
        en('CONV-UNO', 360 - cs[0] - cs[1], gr, x => `Bien dos de las conversiones. Pero falta restar también el tercer ángulo, ${gr(cs[2])}.`),
      ].filter(e => e.valor > 0 && Math.abs(e.valor * 10 - Math.round(e.valor * 10)) < 1e-9),
      solucion: [
        [`Con π rad = 180°, los tres miden ${gr(cs[0])}, ${gr(cs[1])} y ${gr(cs[2])}: suman ${gr(suma)}.`],
        [`El cuarto completa los 360°: 360° − ${gr(suma)} = `, SEX(gr(cuarto)), '.'],
      ],
      _datos: { sub: 'cuadrilatero', cs },
    };
  }

  // ======================= Idea 5: S, C y R =======================
  function conK(rng) {
    const sub = rng.elegir(['s-a-c', 'c-a-s', 's-a-r', 'r-a-s']), k = rng.entero(2, 18);
    if (sub === 's-a-r') {
      const bien = piFrac(k, 20);
      return {
        enunciado: ['El número de grados sexagesimales de un ángulo es S = ', SEX(fg(9 * k)), '.'],
        pregunta: ['¿Cuánto vale R, su número de radianes?'],
        datos: [D.scrDef, D.scr],
        correcta: { clave: bien, texto: bien, num: k },
        errores: [
          et('SCR-SIN-20', piFrac(k, 1), x => `Bien la k: ${k}. Pero R = πk/20: falta dividir entre 20.`, k * 20),
          et('SCR-DIEZ', piFrac(k, 10), x => `Bien que pongas πk arriba. Pero se divide entre 20, no entre 10.`, k * 2),
          et('SCR-K', fg(k), x => `Bien la k: S ÷ 9 = ${k}. Falta usarla en R = πk/20.`, k * 20 / Math.PI),
          et('CONV-PI', piFrac(9 * k, 1), x => `Bien que uses π. Pero S no se multiplica por π: primero se halla k.`, 9 * k * 20),
        ],
        solucion: [[`De S = 9k: k = ${fg(9 * k)} ÷ 9 = ${k}.`], ['R = πk/20 = ', RAD(bien), '.']],
        _datos: { sub, k },
      };
    }
    if (sub === 'r-a-s') {
      const bien = 9 * k;
      return {
        enunciado: ['El número de radianes de un ángulo es R = ', RAD(piFrac(k, 20)), '.'],
        pregunta: ['¿Cuánto vale S, su número de grados sexagesimales?'],
        datos: [D.scrDef, D.scr],
        correcta: bien, fmt: x => fg(x),
        errores: [
          en('SCR-OTRA', 10 * k, x => fg(x), x => `Bien la k: ${k}. Pero ${x} es C; S = 9k.`),
          en('SCR-K', k, x => fg(x), x => `Bien la k: ${k}. Falta multiplicarla por 9 para tener S.`),
          en('SCR-SIN-20', 9 * k / 20, x => fg(x), x => `Bien que uses S = 9k. Pero de R = πk/20 sale k = ${k}, no k/20.`),
          en('SCR-CRUZA', 20 * k / 9, x => fg(x), x => `Bien que despejes de R. Pero S = 9k; dividir entre 9 da ${x}.`),
        ].filter(e => Math.abs(e.valor * 10 - Math.round(e.valor * 10)) < 1e-9),
        solucion: [[`De R = πk/20 = ${piFrac(k, 20)}: k = ${k}.`], [`S = 9k = 9 · ${k} = `, SEX(fg(bien)), '.']],
        _datos: { sub, k },
      };
    }
    const deS = sub === 's-a-c', dato = deS ? 9 * k : 10 * k, bien = deS ? 10 * k : 9 * k, fmt = x => fg(x);
    return {
      enunciado: deS ? ['El número de grados sexagesimales de un ángulo es S = ', SEX(fg(dato)), '.'] : ['El número de grados centesimales de un ángulo es C = ', CEN(fg(dato)), '.'],
      pregunta: [deS ? '¿Cuánto vale C, su número de grados centesimales?' : '¿Cuánto vale S, su número de grados sexagesimales?'],
      datos: [D.scrDef, D.scr],
      correcta: bien, fmt,
      errores: [
        en('CONV-MISMO', dato, fmt, x => `Bien que busques el otro número del mismo ángulo. Pero S y C no son iguales: ${x} no cambia.`),
        en('SCR-K', k, fmt, x => `Bien la k: ${k}. Falta multiplicarla por ${deS ? 10 : 9}.`),
        en('SCR-CRUZA', deS ? dato * 9 / 10 : dato * 10 / 9, fmt, x => `Bien que uses 9 y 10. Pero ${deS ? 'C es el mayor: va por 10/9' : 'S es el menor: va por 9/10'}; así sale ${x}.`),
        en('CONV-RESTA-10', deS ? dato + 10 : dato - 10, fmt, x => `Bien en el ángulo recto. En los demás, C y S no se diferencian en 10: ${x} no es.`),
      ].filter(e => e.valor > 0 && Math.abs(e.valor * 10 - Math.round(e.valor * 10)) < 1e-9),
      solucion: [[deS ? `De S = 9k: k = ${fg(dato)} ÷ 9 = ${k}.` : `De C = 10k: k = ${fg(dato)} ÷ 10 = ${k}.`],
        deS ? [`C = 10k = 10 · ${k} = `, CEN(fg(bien)), '.'] : [`S = 9k = 9 · ${k} = `, SEX(fg(bien)), '.']],
      _datos: { sub, k },
    };
  }

  // Condiciones lineales entre S y C: el texto y el coeficiente de k (la condición vale coef · k).
  const CONDS = [
    { tx: d => `C − S = ${d}`, k: 1, pl: d => `10k − 9k = ${d}` },
    { tx: d => `S + C = ${d}`, k: 19, pl: d => `9k + 10k = ${d}` },
    { tx: d => `2S − C = ${d}`, k: 8, pl: d => `18k − 10k = ${d}` },
    { tx: d => `3C − 2S = ${d}`, k: 12, pl: d => `30k − 18k = ${d}` },
    { tx: d => `S/3 + C/5 = ${d}`, k: 5, pl: d => `3k + 2k = ${d}` },
    { tx: d => `C/2 − S/3 = ${d}`, k: 2, pl: d => `5k − 3k = ${d}` },
  ];
  function condicion(rng) {
    const co = rng.elegir(CONDS), k = rng.entero(2, 12), dato = co.k * k, enC = rng.entero(0, 2) === 0, bien = enC ? 10 * k : 9 * k;
    if (co.k === 19 && k === 3) return null;                    // S + C = 57 es la predicción de la idea 5
    const fmt = enC ? cen : gr;
    return {
      enunciado: [`Los números S y C de un mismo ángulo cumplen ${co.tx(dato)}.`],
      pregunta: [`¿Cuánto mide el ángulo, en grados ${enC ? 'centesimales' : 'sexagesimales'}?`],
      datos: [D.scrDef, D.scr],
      correcta: bien, fmt,
      errores: [
        en('SCR-SUMA', dato, fmt, x => `Bien que uses la condición. Pero ${fg(dato)} es su número, no la medida: falta hallar k.`),
        en('SCR-OTRA', enC ? 9 * k : 10 * k, fmt, x => `Bien la k: ${k}. Pero ${x} da ${enC ? 'S' : 'C'}; se pide el ángulo en el otro sistema.`),
        en('SCR-K', k, fmt, x => `Bien la k: ${k}. Falta multiplicarla por ${enC ? 10 : 9} para tener la medida.`),
        en('SCR-CONVIERTE', enC ? dato * 10 / 9 : dato * 9 / 10, fmt, x => `Bien que uses 9 y 10. Pero se convierte la medida, no el número de la condición.`),
      ].filter(e => Math.abs(e.valor * 10 - Math.round(e.valor * 10)) < 1e-9),
      solucion: [[`Con S = 9k y C = 10k: ${co.pl(dato)}, y k = ${k}.`],
        enC ? [`El ángulo: C = 10 · ${k} = ${fg(bien)}, o sea `, CEN(cen(bien)), '.'] : [`El ángulo: S = 9 · ${k} = ${fg(bien)}, o sea `, SEX(gr(bien)), '.']],
      _datos: { cond: CONDS.indexOf(co), k, en: enC ? 'cen' : 'sex' },
    };
  }

  // Expresiones (aS + bC)/(cS + dC): la k se simplifica.
  const EXPRS = [[1, 1, -1, 1], [2, 1, -1, 1], [2, 3, 2, -1], [4, 2, 2, -1], [6, 1, 2, -1], [5, -1, 3, -2], [1, 4, 3, -2], [3, 3, -3, 3]];
  const lin = (a, b) => { const t = (c0, L, pri) => (c0 === 0 ? '' : `${c0 < 0 ? (pri ? '−' : ' − ') : pri ? '' : ' + '}${Math.abs(c0) === 1 ? '' : Math.abs(c0)}${L}`); const p = t(a, 'S', true); return p + t(b, 'C', p === ''); };
  function hallaR(rng) {
    if (rng.entero(0, 2) === 0) {
      const [a, b, c0, d0] = rng.elegir(EXPRS), bien = (9 * a + 10 * b) / (9 * c0 + 10 * d0), fmt = x => fg(x);
      return {
        enunciado: ['S y C son los números de grados sexagesimales y centesimales de un mismo ángulo.'],
        pregunta: [`¿Cuánto vale (${lin(a, b)})/(${lin(c0, d0)})?`],
        datos: [D.scrDef, D.scr],
        correcta: bien, fmt, negativos: true,
        errores: [
          en('SCR-BORRA', c0 + d0 ? (a + b) / (c0 + d0) : NaN, fmt, x => `Bien que busques que algo se simplifique. Pero S y C no se tachan: valen 9k y 10k.`),
          en('SCR-CRUZA', (10 * a + 9 * b) / (10 * c0 + 9 * d0), fmt, x => `Bien que reemplaces con k. Pero S = 9k y C = 10k, no al revés.`),
          en('SCR-NUMERADOR', 9 * a + 10 * b, fmt, x => `Bien el numerador: ${fg(9 * a + 10 * b)}k. Falta dividirlo entre el denominador, que también lleva k.`),
          en('SCR-DENOMINADOR', 1 / (9 * c0 + 10 * d0), fmt, x => `Bien el denominador. Pero el numerador también da k; ${x} lo olvida.`),
          en('SCR-INVIERTE', (9 * c0 + 10 * d0) / (9 * a + 10 * b), fmt, x => `Bien los dos reemplazos. Pero el cociente quedó al revés: ${x}.`),
        ].filter(e => Math.abs(e.valor * 100 - Math.round(e.valor * 100)) < 1e-9),
        solucion: [['Se reemplazan S = 9k y C = 10k.'], [`(${fg(9 * a + 10 * b)}k)/(${fg(9 * c0 + 10 * d0)}k): la k se simplifica y queda `, SEX(fmt(bien)), '.']],
        _datos: { sub: 'expresion', e: [a, b, c0, d0] },
      };
    }
    const co = rng.elegir(CONDS), k = rng.entero(1, 12), dato = co.k * k, bien = radT(piFrac(k, 20));
    if (co.k === 19 && k === 3) return null;                    // S + C = 57 es la predicción de la idea 5
    return {
      enunciado: [`Los números S y C de un mismo ángulo cumplen ${co.tx(dato)}.`],
      pregunta: ['¿Cuánto mide el ángulo, en radianes?'],
      datos: [D.scrDef, D.scr],
      correcta: { clave: bien, texto: bien, num: k },
      errores: [
        et('SCR-SIN-20', radT(piFrac(k, 1)), x => `Bien la k: ${k}. Pero R = πk/20: falta dividir entre 20.`, k * 20),
        et('SCR-OTRA', radT(fg(9 * k)), x => `Bien la k: ${k}. Pero ${fg(9 * k)} es S, los grados sexagesimales: se piden radianes.`, 9 * k * 20 / Math.PI),
        et('SCR-DIEZ', radT(piFrac(k, 10)), x => `Bien que pongas πk arriba. Pero se divide entre 20, no entre 10.`, k * 2),
        et('SCR-K', radT(fg(k)), x => `Bien la k: ${k}. Falta usarla en R = πk/20.`, k * 20 / Math.PI),
      ],
      solucion: [[`Con S = 9k y C = 10k: ${co.pl(dato)}, y k = ${k}.`], ['R = πk/20 = ', RAD(bien), '.']],
      _datos: { sub: 'radianes', cond: CONDS.indexOf(co), k },
    };
  }

  const CONSTRUIR = {
    signo, seguidos, 'giro-x': giroX, convierte, complemento, triangulo, decimal, llevada, 'entre-sistemas': entreSistemas,
    'a-radianes': aRadianes, 'sin-pi': sinPi, 'tres-sistemas-fig': tresSistemasFig, 'con-k': conK, condicion, 'halla-r': hallaR,
  };

  return { id: ID, titulo: 'Ángulo trigonométrico y sistemas de medida', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
