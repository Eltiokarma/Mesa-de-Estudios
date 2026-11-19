/*
 * Teoría de «Ángulo trigonométrico y sistemas de medida» (trigonometria.angulo-trigonometrico), para 5.º de secundaria
 * y preuniversitario. Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 1),
 * docs/teoria/fuentes/historia-ecuaciones.pdf (pp. 82–83) y las «Precisiones de Geometría y Trigonometría» del expediente.
 * Compañera: Mara (coneja), cercana y rigurosa: conserva el origen, el sentido y la unidad del ángulo.
 *
 * Etapa 5 del plan de calidad (19 nov): la unidad se rehace contra el contrato (docs/plan-calidad.md §3) con la propuesta
 * docs/etapa5/propuesta-trigonometria.md (Gerson delegó el criterio; sus decisiones están en la sección 9). Cinco ideas,
 * en este orden: `sentido-signo` (giro con signo), `tres-sistemas` (sexagesimal y centesimal), `minutos-decimales`
 * (minutos y segundos), `radian` y `formula-general` (S, C y R; nueva).
 * ESTADO (fase 3, 19 nov): las cinco ideas están REHECHAS contra el contrato: objeto en la primera pantalla (timón,
 * transportador de dos escalas, lupa sobre un grado, rueda de triciclo con su pita, calculadora de tres modos), misión,
 * leyenda, predicción con datos sin fórmula, «Mira», regla, «Así se resuelve» distinto de «Ahora tú», «Ahora tú» de tres
 * tipos con datos y nivel de examen, glosario con `simple` y 15 ejemplos por idea. El laboratorio tiene una mesa por
 * idea (dos-giros, idea 1; tres-escalas y arco-sale, idea 4) y la práctica es plantillas/trig-sistemas-angulares/
 * (cinta-radio pasa a «Más mesas del tema»). La unidad todavía NO declara calidad: 2: la sesión la marca después del
 * lector en frío y del auditor (el validador con calidad: 2 simulada no da faltas).
 *
 * REGLA DE COLORES DE LA UNIDAD (propuesta §6; molde §5b, «un color fijo por magnitud»). Todo es un ángulo: el color dice
 * en qué sistema está escrito.
 *   - carmín (h): el giro y su medida sexagesimal: el arco con su flecha, θ, α, β, x, S y todo número con °, ′ o ″. Es el
 *     carmín de los ángulos en todo el curso (37° es carmín en Razones).
 *   - turquesa (i): la medida centesimal (C y todo número con ᵍ, ᵐ o ˢ).
 *   - violeta (f): la medida en radianes (R, rad, los múltiplos de π).
 *   - naranja (o): los largos, que no son ángulos (el radio y el arco de la idea del radián). Verde (d): no se usa.
 *   - tinta: el objeto, el lado inicial y el lado final, las vueltas, k y lo que se pide antes de hallarlo («?»).
 *   La idea 1 es de un solo color: carmín y tinta. El sentido lo dicen la flecha y el signo, nunca un color. Lo comprueba
 *   angulo-trigonometrico.test.js (cada figura y cada texto de la idea 1, con «Ahora tú» y «Así se resuelve» en 400 semillas).
 * Letras (propuesta §5): θ, el giro; α y β, los ángulos de una figura con dos giros; x, un número sin «°»; S, C y R, los
 * números de grados sexagesimales, centesimales y de radianes (idea 5); ningún punto se llama C, S ni R.
 * Lo que no entra: s = θ · r (Longitud de arco), coterminales como tema y el lado inicial sobre el eje x (Posición normal).
 * Errores de la idea 1 (hipótesis de aula, sin medir; docs/investigacion/trigonometria-ideas-erroneas.md no los trae):
 * TRIG-SIN-SIGNO suma los tamaños sin mirar el sentido, TRIG-SIGNO-PIERDE da el tamaño sin signo, TRIG-NEGATIVO cree que
 * un ángulo no puede ser negativo y da el giro positivo que termina igual, TRIG-SENTIDO cambia el sentido, TRIG-OTRO-LADO
 * da el giro que llega por el otro lado, RESTA-SIEMPRE resta dos giros del mismo sentido, VUELTA-180 y VUELTA-100 toman
 * la vuelta por 180° o por 100°, TRIG-FLECHA suma dos ángulos de flechas contrarias sin cambiar un signo, ALG-PARENTESIS y
 * ALG-SIGNO-MEDIO quitan mal el paréntesis, y LLANO-VUELTA toma el llano por la vuelta. Los de las ideas 2 a 5 están en
 * el comentario de cada idea (CONV-*, SEX-*, MIN-*, RAD-*, SCR-*; TR1, TR2, TR3 y TR6 del informe de trigonometría).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: un giro con signo se escribe en tres sistemas sin perder su sentido ni su fracción de vuelta.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, con o sin conexión.
 *   Resultado observable: dice el signo y el tamaño de un giro, suma giros seguidos y despeja x en una figura con flechas
 *     contrarias; convierte entre grados, grados centesimales y radianes.
 *   Orden de atención: 1.º la cinta del timón · 2.º el arco con su flecha · acción: girar el timón · fondo: el lado inicial.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué 150° a la izquierda y 240° a la derecha no dan 390°, y qué quiere decir un ángulo negativo?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  // Una relación que no se parte en dos líneas: sus espacios pasan a espacios duros (como en Razones trigonométricas).
  const SEP = '   ·   ', FL = '   →   ';
  const junto = x => (typeof x === 'string' ? x.replace(/ /g, ' ') : Array.isArray(x) ? x.map(junto)
    : x && typeof x === 'object' && !('v' in x) ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, junto(v)])) : x);
  // Colores de la unidad (cabecera): el giro y su medida sexagesimal, carmín; la centesimal, turquesa; los radianes,
  // violeta; los largos, naranja.
  const th = { v: 'c-h', t: 'θ' }, al = { v: 'c-h', t: 'α' }, be = { v: 'c-h', t: 'β' }, ga = { v: 'c-h', t: 'γ' };
  const dH = t => ({ v: 'c-h', t }), dI = t => ({ v: 'c-i', t }), dF = t => ({ v: 'c-f', t });
  const r = { v: 'c-o', t: 'r' };
  const S = { v: 'c-h', t: 'S' }, Cc = { v: 'c-i', t: 'C' }, R = { v: 'c-f', t: 'R' };
  const neg = t => ({ negrita: [t] });
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  // Grados → radianes como fracción de π: 90 → «π/2», −135 → «−3π/4», 360 → «2π».
  const piTxt = deg => piFrac(Math.round(deg), 180);
  function piFrac(p, q) {           // (p/q)·π, simplificado
    if (p === 0) return '0';
    const m = gcd(p, q), num = p / m, den = q / m;
    const sg = num < 0 ? '−' : '', a = Math.abs(num);
    return `${sg}${a === 1 ? '' : a}π${den === 1 ? '' : '/' + den}`;
  }
  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría de la pieza.
  const TG = () => Kit.piezas['trig-giro'], TM = () => Kit.piezas['trig-medida'];
  // Azar con semilla para «Ahora tú» (el de la unidad de referencia).
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un texto se descartan.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (!d || (typeof d.valor === 'number' && !Number.isFinite(d.valor))) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Cuatro opciones siempre en la idea rehecha: si un caso sale con menos, se arma otro con el mismo azar.
  function conCuatro(caso, rr) {
    for (let i = 0; i < 80; i++) { const c = caso(rr); if (c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }

  // ---------- Idea 1 (rehecha, 19 nov): ángulo trigonométrico, giro con signo ----------
  // Propuesta: docs/etapa5/propuesta-trigonometria.md. Objeto de la primera pantalla: el timón de una combi, con una
  // cinta en el aro que marca la parte de arriba cuando las llantas van derechas (pieza trig-giro, dibujo de prueba).
  // Cambia: el giro θ del timón, de −540° a 540°. · Permanece: el lado inicial, arriba y punteado. · Progresa: el arco
  // con flecha, que se abre en espiral al pasar de una vuelta. · Se reserva: dos giros seguidos en sentidos contrarios
  // (la predicción). · Debe verse: la flecha (el sentido) y el signo del número cambian juntos.
  // Colores: carmín para el giro (arco, flecha y número) y tinta para todo lo demás (regla de la unidad, cabecera).
  const OB = 'trig-giro';
  const fig = datos => ({ pieza: OB, datos, estado: {} });
  // Los grados van sin el espacio de los miles («−1080°», como en el examen).
  const fg = x => f(x).replace(/\s/g, '');
  const gr = g => `${fg(g)}°`;                              // «−270°»
  const sentidoDe = g => (g > 0 ? 'antihorario' : 'horario');
  // «3/4 de vuelta», «1 vuelta y 1/4», «2 vueltas»: el tamaño del giro, contado en vueltas.
  function vueltasTxt(g) {
    const a = Math.round(Math.abs(g)), k = Math.floor(a / 360), resto = a - 360 * k;
    if (!resto) return `${f(k)} ${k === 1 ? 'vuelta' : 'vueltas'}`;
    const m = gcd(resto, 360), fr = `${resto / m}/${360 / m}`;
    return k ? `${f(k)} ${k === 1 ? 'vuelta' : 'vueltas'} y ${fr}` : `${fr} de vuelta`;
  }
  // El timón (o cualquier objeto de la pieza) con un solo giro desde el lado inicial.
  const giroDe = (objeto, g, texto, extra = {}) => Object.assign({ objeto, giros: g ? [{ mide: g, texto }] : [] }, extra);
  const timonJ = g => giroDe('timon', g, gr(g));

  // Datos de los ejercicios (contrato, punto 13): equivalencias, definiciones y propiedades, una por línea. Ningún paso
  // hecho ni consejo.
  const D = {
    vuelta: ['1 vuelta = ', dH('360°')],
    signo: 'Giro antihorario: positivo. Giro horario: negativo.',
    izq: 'Timón hacia la izquierda: sentido antihorario. Hacia la derecha: sentido horario.',
    seguidos: 'Giros seguidos: el total es la suma de todos, cada uno con su signo.',
    invierte: 'Si se invierte el sentido de un ángulo, cambia su signo.',
    llano: ['Ángulo llano, el de una línea recta: ', dH('180°')],
    recto: ['Ángulo recto, el de dos perpendiculares: ', dH('90°')],
    vueltaAng: ['Ángulo de una vuelta: ', dH('360°')],
    minutero: 'El minutero da 1 vuelta en 60 min.',
    horario: 'El horario da 1 vuelta en 12 h.',
    agujas: 'Las agujas del reloj giran en sentido horario.',
  };

  // Cosas que giran, para «Así se resuelve» y «Ahora tú»: cada una con su frase y hasta cuántas vueltas da de verdad.
  const COSAS = [
    { objeto: 'timon', max: 1.5, que: 'el timón', frase: (v, sg) => `El chofer de una combi gira el timón ${v} hacia la ${sg > 0 ? 'izquierda' : 'derecha'}.` },
    { objeto: 'llave', max: 3, que: 'la llave', frase: (v, sg) => (sg > 0 ? `Para abrir un caño, giras su llave ${v} en sentido antihorario.` : `Para cerrar un caño, giras su llave ${v} en sentido horario.`) },
    { objeto: 'tapa', max: 1.5, que: 'la tapa', frase: (v, sg) => (sg > 0 ? `Para abrir una botella, giras su tapa ${v} en sentido antihorario.` : `Para cerrar una botella, giras su tapa ${v} en sentido horario.`) },
  ];
  // Fracciones de vuelta con nombre: [numerador, denominador, cómo se dice].
  const VUELTAS = [[1, 4, 'un cuarto de vuelta'], [1, 3, 'un tercio de vuelta'], [1, 2, 'media vuelta'], [2, 3, 'dos tercios de vuelta'], [3, 4, 'tres cuartos de vuelta'],
    [1, 1, 'una vuelta'], [5, 4, 'una vuelta y cuarto'], [4, 3, 'una vuelta y un tercio'], [3, 2, 'una vuelta y media'], [7, 4, 'una vuelta y tres cuartos'],
    [2, 1, 'dos vueltas'], [9, 4, 'dos vueltas y cuarto'], [5, 2, 'dos vueltas y media'], [3, 1, 'tres vueltas']];
  const datosDe = cosa => [D.vuelta, cosa.objeto === 'timon' ? D.izq : null, D.signo].filter(Boolean);

  // Ejemplos resueltos de la idea 1 (pestaña «Ejemplos»; molde §3). Cuentas rehechas con un script aparte, que no usa
  // este archivo (scratchpad e5-trigonometria/cuentas-idea1.js, 19 nov): 360/2; 3·360/4; 135 con flecha horaria; 20/60·360;
  // 2·360; 200 − 320; 1260/360; 450/360; (55 − 10)/60·360; 2,5·360 − 1,75·360; (3x + 20) − (40 − 2x) = 180;
  // 2x − (x − 60) = 90; (4x + 40) + 4x + (4x + 20) = 360; 4/3·360 − 9/4·360; 40/60·360 + 40/60·30, y el valor de cada
  // alternativa equivocada. La figura muestra el planteamiento: lo que se pide va con «?» en tinta o no se dibuja.
  // Lo que se pide: el arco va en carmín, como todo giro (así el color no dice nada), y su rótulo es «?» en tinta.
  const PIDE = { texto: '?', colorTexto: 'tinta' };
  // Figura de examen: rayos desde O y arcos con la letra de cada ángulo (su expresión va en el enunciado).
  const rayos = (rs, giros, extra = {}) => fig(Object.assign({ objeto: 'rayos', rayos: rs.map(([id, ang]) => ({ id, ang })), giros }, extra));
  const ALT = {
    recta: ['24', '40', '76', '120', '200'],
    recto: ['90°', '10°', '−10°', '−30°', '30°'],
    vuelta: ['10', '75', '25', '35', '30'],
    curva: ['−330°', '330°', '1290°', '30°', '−342°'],
    agujas: ['260°', '−220°', '−240°', '−280°', '−260°'],
  };
  // La letra de una alternativa, en negrita (molde §3): la de `alt` en su lista, para que no se desfase si cambia de lugar.
  const letra = (alts, alt) => { const k = alts.indexOf(alt); if (k < 0) throw new Error(`«${alt}» no es alternativa`); return neg('ABCDE'[k]); };
  const EJEMPLOS_GIRO = [
    { nivel: 1, titulo: 'Media vuelta a la derecha', figura: fig({ objeto: 'timon', giros: [Object.assign({ mide: -180 }, PIDE)] }),
      enunciado: ['El chofer de una combi gira el timón media vuelta hacia la derecha. ¿Cuánto mide ese ángulo trigonométrico, ', th, '?'],
      datos: [D.vuelta, D.izq, D.signo],
      solucion: [
        { texto: 'Media vuelta es la mitad de 360°: 180°. Hacia la derecha es sentido horario, así que el ángulo es negativo.', ecuacion: [th, ' = ', dH('−180°')] },
      ],
      respuesta: [th, ' = ', dH('−180°')] },
    { nivel: 1, titulo: 'La tapa de la botella', figura: fig({ objeto: 'tapa', giros: [Object.assign({ mide: 270 }, PIDE)] }),
      enunciado: 'Para abrir una botella giras su tapa tres cuartos de vuelta en sentido antihorario. ¿Cuánto mide ese ángulo trigonométrico?',
      datos: [D.vuelta, D.signo],
      solucion: [
        { texto: 'Tres cuartos de vuelta son tres cuartos de 360°. El sentido antihorario es el positivo.', ecuacion: junto([{ frac: ['3', '4'] }, ' · 360° = ', dH('270°')]) },
      ],
      respuesta: [dH('270°')] },
    { nivel: 1, titulo: 'La flecha dice el signo', figura: rayos([['M', 0], ['N', 225]], [Object.assign({ de: 'M', a: 'N', sentido: -1, r: 46 }, PIDE)]),
      enunciado: 'En la figura, un rayo gira de OM a ON en el sentido de la flecha y barre 135°. ¿Cuánto mide ese ángulo trigonométrico?',
      datos: [D.signo],
      solucion: [
        { texto: 'La flecha va como las agujas del reloj: sentido horario. El tamaño es 135° y el signo, negativo.', ecuacion: [dH('−135°')] },
      ],
      respuesta: [dH('−135°')] },
    { nivel: 1, titulo: 'El minutero en 20 minutos', figura: fig({ objeto: 'reloj', horario: 9, giros: [Object.assign({ mide: -120 }, PIDE)] }),
      enunciado: 'El minutero de un reloj está en las 12 y avanza 20 minutos. ¿Cuánto mide el ángulo trigonométrico que gira?',
      datos: [D.minutero, D.vuelta, D.agujas, D.signo],
      solucion: [
        { texto: '20 minutos son la tercera parte de 60: el minutero da un tercio de vuelta, en sentido horario.', ecuacion: junto([{ frac: ['20', '60'] }, ' · 360° = 120°']) },
        { texto: 'Como gira en sentido horario, el ángulo es negativo.', ecuacion: [dH('−120°')] },
      ],
      respuesta: [dH('−120°')] },
    { nivel: 1, titulo: 'Dos vueltas para cerrar', figura: fig({ objeto: 'llave' }),
      enunciado: 'Para cerrar un caño giras su llave 2 vueltas en sentido horario. ¿Cuánto mide ese ángulo trigonométrico?',
      datos: [D.vuelta, D.signo],
      solucion: [
        { texto: 'Dos vueltas son 2 · 360° = 720°: un ángulo trigonométrico puede pasar de una vuelta. En sentido horario es negativo.', ecuacion: [dH('−720°')] },
      ],
      respuesta: [dH('−720°')] },
    { nivel: 2, titulo: 'Dos giros seguidos', figura: fig(giroDe('timon', 200, '200°')),
      enunciado: ['El chofer gira el timón ', dH('200°'), ' hacia la izquierda y, sin soltarlo, ', dH('320°'), ' hacia la derecha. ¿Cuánto mide el giro total?'],
      datos: [D.izq, D.signo, D.seguidos],
      solucion: [
        { texto: 'Cada giro con su signo: hacia la izquierda, antihorario, +200°; hacia la derecha, horario, −320°.' },
        { texto: 'Se suman con su signo.', ecuacion: junto([dH('200°'), ' + (', dH('−320°'), ') = ', dH('−120°')]) },
        { texto: 'La cinta queda a la derecha de donde empezó: el total es horario.' },
      ],
      respuesta: [dH('−120°')] },
    { nivel: 2, titulo: '¿Cuántas vueltas son −1260°?', figura: fig({ objeto: 'llave' }),
      enunciado: ['La llave de un caño giró ', th, ' = ', dH('−1260°'), '. ¿Cuántas vueltas dio y en qué sentido?'],
      datos: [D.vuelta, D.signo],
      solucion: [
        { texto: 'El signo menos dice el sentido: horario.' },
        { texto: 'El tamaño, 1260°, se reparte en vueltas de 360°.', ecuacion: junto(['1260° ÷ 360° = 3,5']) },
      ],
      respuesta: [dH('−1260°'), ': 3 vueltas y media, horario'] },
    { nivel: 2, titulo: 'Deshacer el giro', figura: fig(giroDe('timon', -450, '−450°')),
      enunciado: ['El chofer giró el timón ', th, ' = ', dH('−450°'), '. Para dejar la cinta arriba otra vez, regresa por el mismo camino. ¿Cuánto mide el giro de regreso y cuántas vueltas son?'],
      datos: [D.vuelta, D.invierte],
      solucion: [
        { texto: 'Regresar por el mismo camino es girar lo mismo en el sentido contrario: cambia el signo.', ecuacion: junto(['−(', dH('−450°'), ') = ', dH('450°')]) },
        { texto: 'En vueltas:', ecuacion: junto(['450° ÷ 360° = 1,25']) },
      ],
      respuesta: [dH('450°'), ': 1 vuelta y cuarto, antihorario'] },
    { nivel: 2, titulo: 'Cuarenta y cinco minutos', figura: fig({ objeto: 'reloj', horario: 3.17, inicial: 30, giros: [Object.assign({ mide: -270 }, PIDE)] }),
      enunciado: 'Un reloj pasa de las 3:10 a las 3:55. ¿Cuánto mide el ángulo trigonométrico que gira su minutero?',
      datos: [D.minutero, D.vuelta, D.agujas, D.signo],
      solucion: [
        { texto: 'Pasan 55 − 10 = 45 minutos: tres cuartos de los 60 de una vuelta.', ecuacion: junto([{ frac: ['45', '60'] }, ' · 360° = 270°']) },
        { texto: 'El minutero gira en sentido horario: el ángulo es negativo.', ecuacion: [dH('−270°')] },
      ],
      respuesta: [dH('−270°')] },
    { nivel: 2, titulo: 'Abrir y cerrar el caño', figura: fig({ objeto: 'llave' }),
      enunciado: 'Abres un caño girando su llave 2 vueltas y media en sentido antihorario, y después la cierras 1 vuelta y tres cuartos. ¿Cuánto mide el giro total desde que estaba cerrado?',
      datos: [D.vuelta, D.signo, D.seguidos],
      solucion: [
        { texto: 'Abrir, antihorario: positivo.', ecuacion: junto(['2,5 · 360° = ', dH('900°')]) },
        { texto: 'Cerrar va en el sentido contrario, horario: negativo.', ecuacion: junto(['1,75 · 360° = 630°', FL, dH('−630°')]) },
        { texto: 'Se suman con su signo.', ecuacion: junto([dH('900°'), ' + (', dH('−630°'), ') = ', dH('270°')]) },
      ],
      respuesta: [dH('270°'), ': quedó abierto tres cuartos de vuelta'] },
    // Nivel 3, tipo examen. Los puntos de las figuras se llaman M, N, P y Q (nunca A a E). Aun así, donde la figura tiene
    // puntos con letras el resuelto nombra cada alternativa por su valor, no por su letra (decisión de la etapa 3).
    { nivel: 3, titulo: 'Dos flechas y una recta', figura: rayos([['M', 0], ['N', 140], ['Q', 180]], [{ de: 'M', a: 'N', sentido: 1, r: 40, texto: 'α' }, { de: 'Q', a: 'N', sentido: -1, r: 62, texto: 'β' }]),
      enunciado: ['En la figura, OM y OQ forman una línea recta. ', al, ' = (3x + 20)° gira de OM a ON y ', be, ' = (40 − 2x)°, de OQ a ON. ¿Cuánto vale x?'],
      alternativas: ALT.recta,
      datos: [D.llano, D.signo, D.invierte],
      solucion: [
        { texto: [be, ' va en sentido horario: es negativo. Con la flecha invertida, de ON a OQ, mide −', be, '.'], ecuacion: junto(['−', be, ' = −(40 − 2x)° = (2x − 40)°']) },
        { texto: 'Ahora los dos van en el mismo sentido y juntos forman el llano:', ecuacion: [junto('(3x + 20) + (2x − 40) = 180'), FL, junto('5x = 200'), FL, junto(['x = ', dH('40')])] },
        { texto: 'Compruebo: 140° y −40°. 120 suma sin invertir la flecha; 24 y 200 cambian un solo signo del paréntesis; 76 toma el llano por 360°.' },
      ],
      respuesta: ['x = ', dH('40')] },
    { nivel: 3, titulo: 'Un ángulo recto partido', figura: rayos([['M', 0], ['N', 60], ['P', 90]], [{ de: 'M', a: 'N', sentido: 1, r: 44, texto: 'α' }, { de: 'P', a: 'N', sentido: -1, r: 66, texto: 'β' }], { rectos: [['M', 'P']] }),
      enunciado: ['En la figura, OM y OP son perpendiculares. ', al, ' = (2x)° gira de OM a ON y ', be, ' = (x − 60)°, de OP a ON. ¿Cuánto mide ', be, '?'],
      alternativas: ALT.recto,
      datos: [D.recto, D.signo, D.invierte],
      solucion: [
        { texto: [be, ' es horario. Con la flecha invertida mide −', be, ', y con ', al, ' forma el ángulo recto:'], ecuacion: [junto('2x − (x − 60) = 90'), FL, junto('x + 60 = 90'), FL, junto('x = 30')] },
        { texto: 'Se reemplaza x:', ecuacion: junto([be, ' = (30 − 60)° = ', dH('−30°')]) },
        { texto: '30° olvida el signo. −10° suma α + β = 90° y saca x = 50; 10°, además, pierde el signo. 90° quita mal el paréntesis: x = 150.' },
      ],
      respuesta: [be, ' = ', dH('−30°')] },
    { nivel: 3, titulo: 'Tres ángulos y una vuelta', figura: rayos([['M', 0], ['N', 140], ['P', 240]], [{ de: 'M', a: 'N', sentido: 1, r: 38, texto: 'α' }, { de: 'P', a: 'N', sentido: -1, r: 50, texto: 'β' }, { de: 'P', a: 'M', sentido: 1, r: 62, texto: 'γ' }]),
      enunciado: ['En la figura, ', al, ' = (4x + 40)° gira de OM a ON; ', be, ' = (−4x)°, de OP a ON, y ', ga, ' = (4x + 20)°, de OP a OM. ¿Cuánto vale x?'],
      alternativas: ALT.vuelta,
      datos: [D.vueltaAng, D.signo, D.invierte],
      solucion: [
        { texto: [al, ' y ', ga, ' son antihorarios; ', be, ' es horario. Con su flecha invertida, ', be, ' mide −', be, ' = (4x)°.'] },
        { texto: 'Los tres, en el mismo sentido, completan la vuelta:', ecuacion: [junto('(4x + 40) + 4x + (4x + 20) = 360'), FL, junto('12x = 300'), FL, junto(['x = ', dH('25')])] },
        { texto: 'Compruebo: 140°, 100° y 120° suman 360°. 75 suma β con su signo menos; 30 olvida el 40 y el 20; 10 usa 180°; 35 pasa el 60 sumando.' },
      ],
      respuesta: ['x = ', dH('25')] },
    { nivel: 3, titulo: 'El timón en una curva', figura: fig({ objeto: 'timon' }),
      enunciado: 'En una curva cerrada, el chofer gira el timón 1 vuelta y un tercio hacia la izquierda y, al salir, 2 vueltas y cuarto hacia la derecha. ¿Cuánto mide el giro total?',
      alternativas: ALT.curva,
      datos: [D.vuelta, D.izq, D.signo, D.seguidos],
      solucion: [
        { texto: 'Hacia la izquierda, antihorario:', ecuacion: junto([{ frac: ['4', '3'] }, ' · 360° = ', dH('480°')]) },
        { texto: 'Hacia la derecha, horario:', ecuacion: junto([{ frac: ['9', '4'] }, ' · 360° = 810°', FL, dH('−810°')]) },
        { texto: 'El total:', ecuacion: junto([dH('480°'), ' + (', dH('−810°'), ') = ', dH('−330°')]) },
        { texto: ['La ', letra(ALT.curva, '330°'), ' pierde el signo; la ', letra(ALT.curva, '1290°'), ' suma los tamaños; la ', letra(ALT.curva, '30°'), ' da otro giro que termina igual; la ', letra(ALT.curva, '−342°'), ' lee 1/3 como 0,3.'] },
      ],
      respuesta: [letra(ALT.curva, '−330°'), ', ', dH('−330°')] },
    { nivel: 3, titulo: 'El minutero y el horario', figura: fig({ objeto: 'reloj', horario: 2 }),
      enunciado: 'Entre las 2:00 y las 2:40, ¿cuánto suman los ángulos trigonométricos que giran el minutero y el horario?',
      alternativas: ALT.agujas,
      datos: [D.minutero, D.horario, D.vuelta, D.agujas, D.signo],
      solucion: [
        { texto: 'El minutero: 40 de los 60 minutos de su vuelta, en sentido horario.', ecuacion: junto([{ frac: ['40', '60'] }, ' · 360° = 240°', FL, dH('−240°')]) },
        { texto: 'El horario da una vuelta en 12 h: 30° por hora. En 40 minutos:', ecuacion: junto([{ frac: ['40', '60'] }, ' · 30° = 20°', FL, dH('−20°')]) },
        { texto: 'Los dos son negativos:', ecuacion: junto([dH('−240°'), ' + (', dH('−20°'), ') = ', dH('−260°')]) },
        { texto: ['La ', letra(ALT.agujas, '260°'), ' olvida el signo; la ', letra(ALT.agujas, '−220°'), ' resta, como si fuera el ángulo entre las agujas; la ', letra(ALT.agujas, '−240°'), ' deja quieto el horario; la ', letra(ALT.agujas, '−280°'), ' le da 40° al horario.'] },
      ],
      respuesta: [letra(ALT.agujas, '−260°'), ', ', dH('−260°')] },
  ];

  // «Ahora tú», tipo 0: dos giros seguidos de un mismo objeto; casi siempre en sentidos contrarios.
  const fmtG = v => gr(v);
  function casoSeguidos(rr) {
    const cosa = rr.uno([COSAS[0], COSAS[0], COSAS[1]]), tope = cosa.max * 360;
    let a, b, s1, s2;
    do {
      a = 30 * rr.ent(2, 12); b = 30 * rr.ent(2, 12); s1 = rr.uno([1, -1]); s2 = rr.ent(0, 3) ? -s1 : s1;
    } while (a === b || Math.abs(s1 * a + s2 * b) > tope || a > tope);
    const g1 = s1 * a, g2 = s2 * b, total = g1 + g2, contrarios = s1 !== s2;
    const lado = sg => (cosa.objeto === 'timon' ? `hacia la ${sg > 0 ? 'izquierda' : 'derecha'}` : `en sentido ${sentidoDe(sg)}`);
    const otra = Math.abs(total) % 360 ? total - Math.sign(total) * 360 * Math.ceil(Math.abs(total) / 360) : NaN;
    return {
      pregunta: [cosa.objeto === 'timon' ? 'El chofer gira el timón ' : 'Giras la llave de un caño ', dH(gr(a)), ` ${lado(s1)} y, sin soltar${cosa.objeto === 'timon' ? 'lo' : 'la'}, `, dH(gr(b)), ` ${lado(s2)}. ¿Cuánto mide el giro total?`],
      datos: [cosa.objeto === 'timon' ? D.izq : null, D.signo, D.seguidos].filter(Boolean),
      dibujo: { datos: giroDe(cosa.objeto, g1, gr(a)), estado: {} },
      opciones: opciones(total, [
        contrarios ? { id: 'tamanos', valor: a + b, error: 'TRIG-SIN-SIGNO', siFuera: 'Juntar los dos giros está bien; pero van en sentidos contrarios: uno deshace parte del otro.' }
          : { id: 'resta', valor: s1 * Math.abs(a - b), error: 'RESTA-SIEMPRE', siFuera: 'El sentido está bien; pero los dos giros van hacia el mismo lado: se suman.' },
        { id: 'alreves', valor: -total, error: total < 0 ? 'TRIG-SIGNO-PIERDE' : 'TRIG-SENTIDO', siFuera: total < 0 ? 'El tamaño está bien. Falta el signo: el total quedó en sentido horario.' : 'El tamaño está bien; pero el total quedó en sentido antihorario: es positivo.' },
        { id: 'otra', valor: otra, error: total < 0 ? 'TRIG-NEGATIVO' : 'TRIG-OTRO-LADO', siFuera: `Ese giro termina en el mismo lugar; pero ${cosa.que} no hizo ese recorrido.` },
        { id: 'solo', valor: g2, error: 'TRIG-ULTIMO', siFuera: 'Ese es solo el segundo giro; el total cuenta los dos.' },
      ], fmtG),
      solucion: { texto: 'Cada giro con su signo: antihorario, positivo; horario, negativo. Después se suman.',
        ecuacion: junto([dH(gr(g1)), g2 < 0 ? ' + (' : ' + ', dH(gr(g2)), g2 < 0 ? ') = ' : ' = ', dH(gr(total))]) },
    };
  }
  // «Ahora tú», tipo 1: de los grados con signo a las vueltas y el sentido (cuartos y medias: la división sale exacta).
  function casoVueltas(rr) {
    const cosa = rr.uno(COSAS), v = rr.uno(VUELTAS.filter(x => x[1] !== 3 && x[0] / x[1] <= cosa.max && x[0] / x[1] >= 0.75));
    const sg = rr.uno([1, -1]), mag = 360 * v[0] / v[1], g = sg * mag;
    const txt = (m, s0) => `${vueltasTxt(m)}, ${sentidoDe(s0)}`;
    return {
      pregunta: [`${cap(cosa.que)} de ${cosa.objeto === 'timon' ? 'una combi' : cosa.objeto === 'llave' ? 'un caño' : 'una botella'} giró `, th, ' = ', dH(gr(g)), '. ¿Cuántas vueltas dio y en qué sentido?'],
      datos: [D.vuelta, D.signo],
      dibujo: { datos: { objeto: cosa.objeto }, estado: {} },
      opciones: [
        { id: 'c', texto: txt(mag, sg), correcta: true },
        { id: 'sentido', texto: txt(mag, -sg), error: 'TRIG-SENTIDO', siFuera: `Las vueltas están bien contadas; pero el signo ${sg < 0 ? 'menos' : 'más'} es sentido ${sentidoDe(sg)}.` },
        { id: 'media', texto: txt(2 * mag, sg), error: 'VUELTA-180', siFuera: 'El sentido está bien; pero una vuelta mide 360°, no 180°: 180° es media vuelta.' },
        { id: 'cien', texto: `${f(mag / 100)} vueltas, ${sentidoDe(sg)}`, error: 'VUELTA-100', siFuera: 'El sentido está bien; pero una vuelta no tiene 100°: tiene 360°.' },
      ],
      solucion: { texto: `El signo dice el sentido: ${sentidoDe(sg)}. El tamaño se reparte en vueltas de 360°.`, ecuacion: junto([`${gr(mag)} ÷ 360° = ${f(mag / 360)}`]) },
    };
  }
  // «Ahora tú», tipo 2 (nivel de examen): dos ángulos de flechas contrarias que juntos forman un llano o un recto.
  // α = (px + q)°, antihorario, de OM a ON; β = (u − wx)°, horario, del otro rayo a ON. Como β es negativo, α − β = T.
  function casoFigura(rr) {
    const llano = rr.ent(0, 2) > 0, T = llano ? 180 : 90, Z = llano ? 'Q' : 'P';
    let phi, x, p, q, w, u;
    do {
      phi = llano ? 5 * rr.ent(20, 30) : 5 * rr.ent(6, 13); x = rr.ent(6, 40); p = rr.ent(2, 6); w = rr.ent(1, 4);
      q = phi - p * x; u = w * x - (T - phi);
    } while (q < 5 || q > 70 || u < 5 || u > 90 || p === w);
    const aT = `(${p}x + ${q})°`, bT = `(${u} − ${w === 1 ? '' : w}x)°`, fx = v => f(v, 2);
    return {
      pregunta: ['En la figura, ', al, ` = ${aT} gira de OM a ON y `, be, ` = ${bT}, de O${Z} a ON. OM y O${Z} ${llano ? 'forman una línea recta' : 'son perpendiculares'}. ¿Cuánto vale x?`],
      datos: [llano ? D.llano : D.recto, D.signo, D.invierte],
      dibujo: { datos: { objeto: 'rayos', rayos: [{ id: 'M', ang: 0 }, { id: 'N', ang: phi }, { id: Z, ang: T }], rectos: llano ? [] : [['M', 'P']],
        giros: [{ de: 'M', a: 'N', sentido: 1, r: 42, texto: 'α' }, { de: Z, a: 'N', sentido: -1, r: 64, texto: 'β' }] }, estado: {} },
      opciones: opciones(x, [
        { id: 'suma', valor: (T - q - u) / (p - w), error: 'TRIG-FLECHA', siFuera: 'Juntar los dos ángulos es la idea; pero β es horario: con la flecha invertida mide −β.' },
        { id: 'medio', valor: (T - q - u) / (p + w), error: 'ALG-SIGNO-MEDIO', siFuera: 'Restar β está bien; pero el menos cambia los dos signos del paréntesis, no solo uno.' },
        { id: 'parentesis', valor: (T - q + u) / (p - w), error: 'ALG-PARENTESIS', siFuera: 'Restar β está bien; pero el menos también cambia el signo del término con x.' },
        { id: 'vuelta', valor: (2 * T - q + u) / (p + w), error: 'LLANO-VUELTA', siFuera: `El planteo está bien; pero juntos forman ${llano ? 'un llano, de 180°' : 'un ángulo recto, de 90°'}, no ${llano ? '360°' : '180°'}.` },
      // Solo errores cuyo valor es positivo y exacto en cuartos (24; 37,5; 13,75): nada de 53,33…
      ].filter(o => o.valor > 0 && Math.abs(o.valor * 4 - Math.round(o.valor * 4)) < 1e-9), fx),
      solucion: { texto: [be, ' es horario: con la flecha invertida mide −', be, `. Juntos forman ${llano ? 'el llano' : 'el ángulo recto'}.`],
        ecuacion: [junto(`(${p}x + ${q}) − (${u} − ${w === 1 ? '' : w}x) = ${T}`), FL, junto(['x = ', dH(f(x))])] },
    };
  }

  const sentido = {
    id: 'sentido-signo',
    titulo: 'Ángulo trigonométrico: giro con signo',
    pregunta: '¿Qué dice el signo de un ángulo trigonométrico?',
    temas: ['Sentido de giro y signo'],
    pieza: OB,
    aprendizaje: 'Un ángulo trigonométrico es un giro: antihorario es positivo; horario, negativo. Puede pasar de una vuelta, y los giros seguidos se suman con su signo.',
    actividad: 'Girar el timón de una combi hacia los dos lados, también más de una vuelta.',
    // Lee: el objeto y el vocabulario (lado inicial, lado final, los dos sentidos y su signo). No dice qué pasa al juntar
    // dos giros: eso es la predicción.
    lee: {
      tarjetas: [
        { titulo: 'El timón de la combi', texto: 'El chofer de una combi gira el timón hacia un lado o hacia el otro, y a veces le da más de una vuelta. Una cinta en el aro marca la parte de arriba cuando las llantas van derechas.',
          pieza: OB, dibujo: { datos: { objeto: 'timon' }, estado: {} } },
        { titulo: 'Lado inicial y lado final', texto: 'En trigonometría, un ángulo es el giro de un rayo alrededor de un punto fijo, el vértice. Aquí el rayo va del centro del timón a la cinta. Donde empieza el giro es el lado inicial; donde termina, el lado final.',
          pieza: OB, dibujo: { datos: { objeto: 'timon', giros: [{ mide: 120 }], rotulos: { inicial: 'lado inicial', final: 'lado final' } }, estado: {} } },
        { titulo: 'Dos sentidos', texto: 'El rayo puede girar contra las agujas del reloj, en sentido antihorario, o como ellas, en sentido horario. En el timón, hacia la izquierda es antihorario y hacia la derecha, horario. La flecha del arco muestra el sentido.',
          pieza: OB, dibujo: { datos: { objeto: 'timon', giros: [{ mide: -120 }] }, estado: {} } },
        { titulo: 'El signo', texto: ['Para no escribir el sentido con palabras, se usa el signo: un giro antihorario es positivo y uno horario, negativo. ', th, ', la letra griega theta, es la medida del giro, con su signo. Al jugar, mira qué pasa cuando das más de una vuelta.'] },
      ],
    },
    ejemplos: EJEMPLOS_GIRO,
    juega: {
      pieza: OB,
      consigna: ['El chofer gira el timón de su combi. ', th, ' es el giro de la cinta desde su lugar de arriba, con su signo.'],
      mision: {
        texto: 'Gira el timón en sentido horario hasta que la cinta apunte a la izquierda.',
        logrado: val => Math.abs(val.g + 270) < 1e-9,
        bien: 'Listo: tres cuartos de vuelta en sentido horario. El signo menos dice el sentido.',
      },
      voz: '¿Qué le pasa al signo cuando giras hacia la derecha?',
      leyenda: [
        { s: th, t: 'el giro de la cinta, con su signo' },
        { s: '+', t: 'giro antihorario: hacia la izquierda' },
        { s: '−', t: 'giro horario: hacia la derecha' },
        { s: 'línea punteada', t: 'lado inicial: donde estaba la cinta' },
        { s: '°', t: 'grado: una vuelta tiene 360' },
      ],
      controles: [{ id: 'g', etiqueta: 'Giro del timón', color: 'c-h', min: -540, max: 540, paso: 30, inicio: 60, unidad: '°', decimales: 0 }],
      // Gesto directo: se arrastra la cinta; al dar la vuelta, el giro sigue sumando (no salta a la vuelta anterior).
      arrastres: [{ id: 'cinta', etiqueta: 'cinta del timón: se gira hacia los dos lados', color: 'c-h',
        donde: val => { const p = TG().geometria(timonJ(val.g)).marca; return { x: p[0], y: p[1] }; },
        mover: (pt, val) => ({ g: TG().anguloDe(timonJ(val.g), pt, { cerca: val.g }) }) }],
      dibujo: val => ({ datos: timonJ(val.g), estado: {} }),
      lectura: val => (val.g ? [th, ' = ', dH(gr(val.g)), `: ${vueltasTxt(val.g)}, ${sentidoDe(val.g)}`] : [th, ' = ', dH('0°'), ': la cinta sigue arriba']),
      minimo: 3,
    },
    predice: {
      pregunta: ['El chofer gira el timón ', dH('150°'), ' hacia la izquierda y, sin soltarlo, ', dH('240°'), ' hacia la derecha. ¿Cuánto mide el giro total de la cinta, desde su posición inicial?'],
      datos: [D.izq, D.signo],
      voz: 'Sigue la cinta: ¿dónde queda al final y por dónde llegó?',
      opciones: [
        { id: 'c', texto: '−90°', correcta: true },
        { id: 'tamanos', texto: '390°', error: 'TRIG-SIN-SIGNO', siFuera: 'Juntar los dos giros está bien; pero van en sentidos contrarios: el segundo deshace parte del primero.' },
        { id: 'sinsigno', texto: '90°', error: 'TRIG-SIGNO-PIERDE', siFuera: 'El tamaño está bien: 240 − 150 = 90. Falta el signo: la cinta quedó a la derecha.' },
        { id: 'positivo', texto: '270°', error: 'TRIG-NEGATIVO', siFuera: 'Un giro de 270° dejaría la cinta ahí mismo; pero ese no fue su recorrido.' },
      ],
      // La figura muestra solo el primer giro (lo que ese dato marca por sí solo); el segundo lo imagina el alumno.
      dibujo: { datos: giroDe('timon', 150, '150°'), estado: {} },
      revelar: { datos: { objeto: 'timon', giros: [{ mide: -90, texto: '−90°' }] }, estado: {} },
      coincide: 'Coincide: 150° a la izquierda y 240° a la derecha dejan la cinta 90° a la derecha de donde empezó.',
      noCoincide: 'Revisemos el recorrido paso a paso: primero a la izquierda, después a la derecha.',
    },
    mira: {
      pieza: OB,
      datos: { objeto: 'timon',
        giros: [{ mide: 150, texto: '+150°', r: 116, en: 'medio', desde: 1, hasta: 3 }, { mide: -240, texto: '−240°', en: -55, desde: 2, hasta: 3 }, { mide: -90, total: true, texto: '−90°', desde: 4 }],
        pos: [{ v: 0 }, { v: 150, paso: 1 }, { v: -90, paso: 2 }] },
      voz: 'Mira cada flecha: el sentido se lee en ella.',
      pasos: [
        { estado: { paso: 0 }, texto: 'La cinta parte de arriba: ese es el lado inicial.', ecuacion: [th, ' = ', dH('0°')] },
        { estado: { paso: 1 }, texto: 'Primero gira 150° hacia la izquierda: antihorario, positivo.', ecuacion: [dH('+150°')] },
        { estado: { paso: 2 }, texto: 'Después gira 240° hacia la derecha: horario, negativo.', ecuacion: [dH('−240°')] },
        { estado: { paso: 3 }, texto: 'Los giros seguidos se suman, cada uno con su signo.', ecuacion: junto([dH('150°'), ' + (', dH('−240°'), ') = ', dH('−90°')]) },
        { estado: { paso: 4 }, texto: 'El total: un cuarto de vuelta en sentido horario.', ecuacion: [th, ' = ', dH('−90°')] },
        { estado: { paso: 4 }, texto: '270° deja la cinta ahí mismo: son ángulos coterminales, pero es otro recorrido.', ecuacion: junto([dH('270°'), ' ≠ ', dH('−90°')]) },
      ],
    },
    regla: {
      texto: 'Un ángulo trigonométrico es un giro, del lado inicial al lado final: antihorario es positivo y horario, negativo. Los giros seguidos se suman con su signo.',
      ecuacion: [junto(['antihorario: ', th, ' > 0']), SEP, junto(['horario: ', th, ' < 0']), SEP, junto(['1 vuelta = ', dH('360°')])],
      condicion: 'el giro se mide desde su lado inicial; puede pasar de una vuelta. Si se invierte la flecha, cambia el signo.',
      voz: 'Primero el sentido; después, el tamaño.',
    },
    // Así se resuelve: de las vueltas y el sentido a los grados con signo. «Ahora tú» pide otras cosas: dos giros
    // seguidos, de los grados a las vueltas, y la x de una figura con flechas contrarias.
    resuelve: {
      pieza: OB,
      generar(sem) {
        const rr = azar(sem + 900), cosa = COSAS[sem % 3], sg = sem % 2 ? -1 : 1;
        const v = rr.uno(VUELTAS.filter(x => x[0] / x[1] <= cosa.max)), mag = 360 * v[0] / v[1], g = sg * mag;
        const sen = sentidoDe(sg), lado = cosa.objeto === 'timon' ? `hacia la ${sg > 0 ? 'izquierda' : 'derecha'}, que es sentido ${sen}` : `en sentido ${sen}`;
        return {
          enunciado: [`${cosa.frase(v[2], sg)} ¿Cuánto mide ese ángulo trigonométrico, `, th, '?'],
          datos: datosDe(cosa),
          dibujo: { datos: { objeto: cosa.objeto, giros: [Object.assign({ mide: g }, PIDE)] }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden ', th, ': cuántos grados mide el giro y con qué signo.'] },
            { tipo: 'datos', texto: `El giro es de ${v[2]}, ${lado}.` },
            { tipo: 'regla', texto: 'Una vuelta mide 360°. El sentido pone el signo: antihorario, positivo; horario, negativo.',
              ecuacion: [junto(['antihorario: ', th, ' > 0']), SEP, junto(['horario: ', th, ' < 0'])] },
            { tipo: 'cuentas', texto: v[0] === v[1] ? 'El tamaño: una vuelta mide 360°.' : v[1] === 1 ? `El tamaño: ${v[2]} son ${v[0]} veces 360°.` : `El tamaño: ${v[2]} son ${v[0]}/${v[1]} de 360°.`,
              ecuacion: junto([v[1] === 1 ? `${v[0]}` : { frac: [`${v[0]}`, `${v[1]}`] }, ` · 360° = ${gr(mag)}`]) },
            { tipo: 'aplica', texto: `El sentido es ${sen}: el ángulo es ${sg > 0 ? 'positivo' : 'negativo'}.`, ecuacion: [th, ' = ', dH(gr(g))],
              dibujo: { datos: giroDe(cosa.objeto, g, gr(g)), estado: {} } },
            { tipo: 'sentido', texto: `Tiene sentido: ${gr(mag)} ${mag > 360 ? 'pasa de 360°, más de una vuelta' : mag === 360 ? 'es justo una vuelta' : 'no llega a 360°, menos de una vuelta'}, y la flecha va en sentido ${sen}.` },
          ],
          respuesta: [th, ' = ', dH(gr(g))],
        };
      },
    },
    ahoraTu: {
      pieza: OB,
      voz: 'Primero el sentido de cada giro; después, las cuentas.',
      generar(sem) {
        const rr = azar(sem + 17);
        return conCuatro([casoSeguidos, casoVueltas, casoFigura][sem % 3], rr);
      },
    },
  };

  // ====================================================================================================================
  // Ideas 2 a 5 (rehechas en la fase 3, 19 nov). Propuesta: docs/etapa5/propuesta-trigonometria.md.
  // Colores (cabecera): sexagesimal en carmín (dH), centesimal en turquesa (dI), radianes en violeta (dF); los largos, naranja.
  // ====================================================================================================================
  const MD = 'trig-medida';
  const figM = datos => ({ pieza: MD, datos, estado: {} });
  const cen = x => `${fg(x)}ᵍ`;                              // «40ᵍ»
  const fraccion = g => { const m = gcd(Math.round(g), 360); return g === 0 ? '0' : g === 360 ? '1 vuelta' : `${Math.round(g) / m}/${360 / m} de vuelta`; };
  // El transportador de dos escalas con su aguja girada g grados; el rótulo (si va) dice el dato.
  const transp = (g, rot = {}) => ({ objeto: 'transportador', giros: g ? [Object.assign({ mide: g }, rot)] : [] });
  const enCen = t => ({ texto: t, colorTexto: 'i' }), enSex = t => ({ texto: t });
  // Datos de las ideas 2 a 5 (contrato, punto 13): equivalencias y definiciones. Las letras S, C, R y k están en `letras`.
  const DS = {
    vuelta: ['Una vuelta: ', dH('360°'), ' o ', dI('400ᵍ'), '.'],
    conv: ['Mismo giro: ', dH('9°'), ' = ', dI('10ᵍ'), '.'],
    recto: ['Ángulo recto: ', dH('90°'), ' o ', dI('100ᵍ'), '.'],
    llano: ['Ángulo llano: ', dH('180°'), ' o ', dI('200ᵍ'), '.'],
    comp: 'Complemento de un ángulo: lo que le falta para el ángulo recto.',
    supl: 'Suplemento de un ángulo: lo que le falta para el ángulo llano.',
    tri: ['Los tres ángulos de un triángulo suman ', dH('180°'), '.'],
    cuad: ['Los cuatro ángulos de un cuadrilátero suman ', dH('360°'), '.'],
    min: [dH('1° = 60′'), ' y ', dH('1′ = 60″'), '.'],
    minC: [dI('1ᵍ = 100ᵐ'), ' y ', dI('1ᵐ = 100ˢ'), '.'],
    pi: [dF('π rad'), ' = ', dH('180°'), ' = ', dI('200ᵍ'), '.'],
    piNum: 'π ≈ 3,1416',
    radDef: 'Medida en radianes de un ángulo central: cuántas veces cabe el radio en su arco.',
    scrDef: ['S, C y R: los números de grados sexagesimales, de grados centesimales y de radianes de un mismo ángulo.'],
    scr: ['Para un mismo ángulo: ', junto([S, ' = 9k']), ', ', junto([Cc, ' = 10k']), ' y ', junto([R, ' = πk/20']), '.'],
  };

  // ---------- Idea 2: grados sexagesimales y grados centesimales ----------
  // Objeto de la primera pantalla: un transportador de vuelta entera con dos escalas (pieza trig-giro, dibujo de prueba).
  // Cambia: la aguja, de 0° a 360°. · Permanece: las dos escalas, con su cero en el mismo lugar. · Progresa: los dos
  // números de la lectura, que crecen juntos. · Se reserva: el complemento de un ángulo dado en centesimales (la
  // predicción). · Debe verse: 90° y 100ᵍ caen en la misma raya; el número centesimal siempre es mayor.
  // Errores: CONV-MISMO trata los centesimales como sexagesimales (trampa de San Marcos 2026-I), CONV-SIMBOLO opera bien
  // y solo cambia el símbolo, CONV-INVERSA usa el factor al revés, CONV-MITAD toma 100ᵍ por media vuelta, CONV-RESTA-10
  // cree que la diferencia entre las escalas es fija, CONV-ANGULO convierte el dato y olvida lo que se pide, CONV-SUMA da
  // la suma y no lo que falta, CONV-SIN-VOLVER olvida pasar el resultado al sistema pedido (todos hipótesis).
  const EJ_ESC = { tri: ['37ᵍ', '45ᵍ', '50ᵍ', '57ᵍ', '40,5ᵍ'], supl: ['36°', '50°', '60°', '70°', '54°'], x: ['5', '4', '20', '45', '50'], suma: ['107°', '99°', '104°', '110°', '89,1°'], minutero: ['160ᵍ', '−144ᵍ', '144ᵍ', '−160ᵍ', '−129,6ᵍ'] };
  // Ejemplos resueltos de la idea 2. Cuentas rehechas con un script aparte (scratchpad e5-trigonometria/cuentas-ideas2a5.js):
  // 80·9/10; 54·10/9; 360/4 y 400/4; −150·9/10; 50·9/10; (180 − 126)·10/9; 36 + 70·9/10; 180 − (50 + 60)·9/10; −3·400/4;
  // 100 − 100·9/10; 180 − 80·9/10 − 63 = 45 y 45·10/9; (200 − 160)·9/10 = 36 y 90 − 36; 5x + 20 = 9x; 27 + 27 + 45;
  // 24/60·400, y el valor de cada alternativa equivocada.
  const EJEMPLOS_ESCALAS = [
    { nivel: 1, titulo: 'De centesimales a sexagesimales', figura: fig(transp(72, enCen('80ᵍ'))),
      enunciado: ['Un ángulo mide ', dI('80ᵍ'), '. ¿Cuánto mide en grados sexagesimales?'],
      datos: [DS.vuelta, DS.conv],
      solucion: [{ texto: 'Cada 10ᵍ son 9°: el número sexagesimal es 9/10 del centesimal.', ecuacion: junto([dI('80ᵍ'), ' · ', { frac: ['9°', '10ᵍ'] }, ' = ', dH('72°')]) }],
      respuesta: [dH('72°')] },
    { nivel: 1, titulo: 'De sexagesimales a centesimales', figura: fig(transp(54, enSex('54°'))),
      enunciado: ['Un ángulo mide ', dH('54°'), '. ¿Cuánto mide en grados centesimales?'],
      datos: [DS.vuelta, DS.conv],
      solucion: [{ texto: 'Cada 9° son 10ᵍ: el número centesimal es 10/9 del sexagesimal.', ecuacion: junto([dH('54°'), ' · ', { frac: ['10ᵍ', '9°'] }, ' = ', dI('60ᵍ')]) }],
      respuesta: [dI('60ᵍ')] },
    { nivel: 1, titulo: 'Un cuarto de vuelta', figura: fig(transp(90)),
      enunciado: 'La aguja del transportador da un cuarto de vuelta. ¿Cuánto mide ese giro en grados sexagesimales y en grados centesimales?',
      datos: [DS.vuelta],
      solucion: [{ texto: 'Un cuarto de vuelta es la cuarta parte de 360° y también la cuarta parte de 400ᵍ.', ecuacion: [junto(['360° ÷ 4 = ', dH('90°')]), SEP, junto(['400ᵍ ÷ 4 = ', dI('100ᵍ')])] }],
      respuesta: [dH('90°'), ' y ', dI('100ᵍ')] },
    { nivel: 1, titulo: 'El signo no cambia', figura: fig(transp(-135, enCen('−150ᵍ'))),
      enunciado: ['Un ángulo trigonométrico mide ', dI('−150ᵍ'), '. ¿Cuánto mide en grados sexagesimales?'],
      datos: [DS.vuelta, DS.conv],
      solucion: [{ texto: 'Se convierte igual: 9/10 del número. El signo dice el sentido del giro, y el giro es el mismo.', ecuacion: junto([dI('−150ᵍ'), ' · ', { frac: ['9°', '10ᵍ'] }, ' = ', dH('−135°')]) }],
      respuesta: [dH('−135°')] },
    { nivel: 1, titulo: '¿Cuál abre más?', figura: fig(transp(50, enSex('50°'))),
      enunciado: ['¿Qué ángulo abre más: uno de ', dH('50°'), ' o uno de ', dI('50ᵍ'), '?'],
      datos: [DS.vuelta, DS.conv],
      solucion: [{ texto: 'Se llevan los dos al mismo sistema. El grado centesimal es más chico: 50 de ellos abren menos que 50 sexagesimales.', ecuacion: junto([dI('50ᵍ'), ' · ', { frac: ['9°', '10ᵍ'] }, ' = ', dH('45°'), ' < ', dH('50°')]) }],
      respuesta: ['El de ', dH('50°')] },
    { nivel: 2, titulo: 'El suplemento, en centesimales', figura: fig(transp(126, enSex('126°'))),
      enunciado: ['Un ángulo mide ', dH('126°'), '. ¿Cuánto mide su suplemento, en grados centesimales?'],
      datos: [DS.supl, DS.llano, DS.conv],
      solucion: [
        { texto: 'El suplemento se saca en el sistema del dato:', ecuacion: junto(['180° − 126° = ', dH('54°')]) },
        { texto: 'Después se pasa a centesimales:', ecuacion: junto([dH('54°'), ' · ', { frac: ['10ᵍ', '9°'] }, ' = ', dI('60ᵍ')]) },
      ],
      respuesta: [dI('60ᵍ')] },
    { nivel: 2, titulo: 'Suma de dos escalas', figura: fig(transp(63, enCen('70ᵍ'))),
      enunciado: ['¿Cuánto mide, en grados sexagesimales, la suma de un ángulo de ', dH('36°'), ' y otro de ', dI('70ᵍ'), '?'],
      datos: [DS.conv],
      solucion: [
        { texto: 'No se suman números de escalas distintas. Primero, todo a sexagesimales:', ecuacion: junto([dI('70ᵍ'), ' · ', { frac: ['9°', '10ᵍ'] }, ' = ', dH('63°')]) },
        { texto: 'Ahora sí:', ecuacion: junto([dH('36°'), ' + ', dH('63°'), ' = ', dH('99°')]) },
      ],
      respuesta: [dH('99°')] },
    { nivel: 2, titulo: 'El tercer ángulo',
      enunciado: ['Dos ángulos de un triángulo miden ', dI('50ᵍ'), ' y ', dI('60ᵍ'), '. ¿Cuánto mide el tercero, en grados sexagesimales?'],
      datos: [DS.tri, DS.conv],
      solucion: [
        { texto: 'Los dos juntos miden 110ᵍ. En sexagesimales:', ecuacion: junto([dI('110ᵍ'), ' · ', { frac: ['9°', '10ᵍ'] }, ' = ', dH('99°')]) },
        { texto: 'El tercero completa los 180°:', ecuacion: junto(['180° − 99° = ', dH('81°')]) },
      ],
      respuesta: [dH('81°')] },
    { nivel: 2, titulo: 'Tres cuartos de vuelta, horario', figura: fig({ objeto: 'timon', giros: [Object.assign({ mide: -270 }, PIDE)] }),
      enunciado: 'El chofer gira el timón tres cuartos de vuelta hacia la derecha. ¿Cuánto mide ese ángulo trigonométrico en grados centesimales?',
      datos: [DS.vuelta, D.izq, D.signo],
      solucion: [
        { texto: 'Tres cuartos de la vuelta, que tiene 400ᵍ:', ecuacion: junto([{ frac: ['3', '4'] }, ' · 400ᵍ = 300ᵍ']) },
        { texto: 'Hacia la derecha es sentido horario: negativo.', ecuacion: [dI('−300ᵍ')] },
      ],
      respuesta: [dI('−300ᵍ')] },
    { nivel: 2, titulo: 'Dos giros, dos escalas', figura: fig(giroDe('timon', 100, '100°')),
      enunciado: ['El chofer gira el timón ', dH('100°'), ' hacia la izquierda y después ', dI('100ᵍ'), ' hacia la derecha. ¿Cuánto mide el giro total, en grados sexagesimales?'],
      datos: [DS.conv, D.izq, D.signo, D.seguidos],
      solucion: [
        { texto: 'El segundo giro, en sexagesimales y con su signo:', ecuacion: junto([dI('100ᵍ'), ' · ', { frac: ['9°', '10ᵍ'] }, ' = 90°', FL, dH('−90°')]) },
        { texto: 'Se suman con su signo:', ecuacion: junto([dH('100°'), ' + (', dH('−90°'), ') = ', dH('10°')]) },
      ],
      respuesta: [dH('10°'), ': no vuelve al inicio'] },
    { nivel: 3, titulo: 'Un triángulo en dos escalas',
      enunciado: ['Dos ángulos de un triángulo miden ', dI('80ᵍ'), ' y ', dH('63°'), '. ¿Cuánto mide el tercero, en grados centesimales?'],
      alternativas: EJ_ESC.tri,
      datos: [DS.tri, DS.conv],
      solucion: [
        { texto: 'Todo a sexagesimales, donde está la suma de los tres:', ecuacion: [junto([dI('80ᵍ'), ' = ', dH('72°')]), FL, junto(['180° − 72° − 63° = ', dH('45°')])] },
        { texto: 'Y el resultado, a centesimales:', ecuacion: junto([dH('45°'), ' · ', { frac: ['10ᵍ', '9°'] }, ' = ', dI('50ᵍ')]) },
        { texto: ['La ', letra(EJ_ESC.tri, '45ᵍ'), ' olvida ese último paso; la ', letra(EJ_ESC.tri, '37ᵍ'), ' resta 80 como si fueran sexagesimales; la ', letra(EJ_ESC.tri, '57ᵍ'), ' resta de 200 sin convertir el 63; la ', letra(EJ_ESC.tri, '40,5ᵍ'), ' convierte al revés.'] },
      ],
      respuesta: [letra(EJ_ESC.tri, '50ᵍ'), ', ', dI('50ᵍ')] },
    { nivel: 3, titulo: 'Suplemento y complemento',
      enunciado: ['El suplemento de un ángulo mide ', dI('160ᵍ'), '. ¿Cuánto mide el complemento de ese ángulo, en grados sexagesimales?'],
      alternativas: EJ_ESC.supl,
      datos: [DS.supl, DS.comp, DS.llano, DS.recto, DS.conv],
      solucion: [
        { texto: 'En centesimales, el llano mide 200ᵍ: el ángulo mide 200ᵍ − 160ᵍ = 40ᵍ.', ecuacion: junto([dI('40ᵍ'), ' · ', { frac: ['9°', '10ᵍ'] }, ' = ', dH('36°')]) },
        { texto: 'Su complemento:', ecuacion: junto(['90° − 36° = ', dH('54°')]) },
        { texto: ['La ', letra(EJ_ESC.supl, '36°'), ' da el ángulo; la ', letra(EJ_ESC.supl, '50°'), ' resta 90 − 40 sin convertir; la ', letra(EJ_ESC.supl, '60°'), ' deja el complemento en centesimales; la ', letra(EJ_ESC.supl, '70°'), ' toma 160ᵍ por 160°.'] },
      ],
      respuesta: [letra(EJ_ESC.supl, '54°'), ', ', dH('54°')] },
    { nivel: 3, titulo: 'El mismo ángulo con x',
      enunciado: ['Un ángulo mide ', dH('(5x + 20)°'), ' y también ', dI('(10x)ᵍ'), '. ¿Cuánto vale x?'],
      alternativas: EJ_ESC.x,
      datos: [DS.conv, 'x es un número, sin unidad.'],
      solucion: [
        { texto: 'Los dos nombran el mismo giro. Se pasa uno al sistema del otro:', ecuacion: junto([dI('(10x)ᵍ'), ' · ', { frac: ['9°', '10ᵍ'] }, ' = ', dH('(9x)°')]) },
        { texto: 'Ahora sí se igualan:', ecuacion: [junto('5x + 20 = 9x'), FL, junto('4x = 20'), FL, junto(['x = ', dH('5')])] },
        { texto: ['Compruebo: 45° = 50ᵍ. La ', letra(EJ_ESC.x, '4'), ' iguala los números sin convertir; la ', letra(EJ_ESC.x, '20'), ' no divide entre 4; la ', letra(EJ_ESC.x, '45'), ' y la ', letra(EJ_ESC.x, '50'), ' dan la medida del ángulo.'] },
      ],
      respuesta: [letra(EJ_ESC.x, '5'), ', x = ', dH('5')] },
    { nivel: 3, titulo: 'Una suma de examen',
      enunciado: ['¿Cuánto mide, en grados sexagesimales, la suma ', dH('27°'), ' + ', dI('30ᵍ'), ' + ', dI('50ᵍ'), '?'],
      alternativas: EJ_ESC.suma,
      datos: [DS.conv],
      solucion: [
        { texto: 'Cada sumando centesimal pasa a sexagesimales:', ecuacion: [junto([dI('30ᵍ'), ' = ', dH('27°')]), SEP, junto([dI('50ᵍ'), ' = ', dH('45°')])] },
        { texto: 'La suma:', ecuacion: junto(['27° + 27° + 45° = ', dH('99°')]) },
        { texto: ['La ', letra(EJ_ESC.suma, '107°'), ' suma los números sin convertir; la ', letra(EJ_ESC.suma, '104°'), ' convierte solo uno; la ', letra(EJ_ESC.suma, '110°'), ' pasa todo a centesimales y escribe «°»; la ', letra(EJ_ESC.suma, '89,1°'), ' convierte de más.'] },
      ],
      respuesta: [letra(EJ_ESC.suma, '99°'), ', ', dH('99°')] },
    { nivel: 3, titulo: 'El minutero en centesimales', figura: fig({ objeto: 'reloj', horario: 9, giros: [Object.assign({ mide: -144 }, PIDE)] }),
      enunciado: 'El minutero de un reloj avanza 24 minutos. ¿Cuánto mide el ángulo trigonométrico que gira, en grados centesimales?',
      alternativas: EJ_ESC.minutero,
      datos: [D.minutero, DS.vuelta, D.agujas, D.signo],
      solucion: [
        { texto: 'En 24 de los 60 minutos de su vuelta, que tiene 400ᵍ:', ecuacion: junto([{ frac: ['24', '60'] }, ' · 400ᵍ = 160ᵍ']) },
        { texto: 'Las agujas giran en sentido horario: el ángulo es negativo.', ecuacion: [dI('−160ᵍ')] },
        { texto: ['La ', letra(EJ_ESC.minutero, '160ᵍ'), ' olvida el signo; la ', letra(EJ_ESC.minutero, '−144ᵍ'), ' da los grados sexagesimales con otro símbolo; la ', letra(EJ_ESC.minutero, '144ᵍ'), ', eso y sin signo; la ', letra(EJ_ESC.minutero, '−129,6ᵍ'), ' convierte al revés.'] },
      ],
      respuesta: [letra(EJ_ESC.minutero, '−160ᵍ'), ', ', dI('−160ᵍ')] },
  ];

  // «Ahora tú» de la idea 2. Tipo 0: de centesimales a sexagesimales (al revés que «Así se resuelve»).
  const gradoTxt = v => `${fg(v)}°`, cenTxt = v => cen(v);
  // Los cuartos de vuelta no: el transportador los rotula en sus dos escalas (90° y 100ᵍ en la misma raya).
  const CUARTO = k => Math.abs(k) % 10 === 0;
  function casoConvierte(rr) {
    let k;
    do k = rr.ent(2, 38) * (rr.ent(0, 3) ? 1 : -1); while (CUARTO(k));
    const c0 = 10 * k, d0 = 9 * k;
    return {
      pregunta: ['Un ángulo trigonométrico mide ', dI(cen(c0)), '. ¿Cuánto mide en grados sexagesimales?'],
      datos: [DS.vuelta, DS.conv],
      // Sin figura: en el transportador la aguja se leería en la otra escala, y esa es la respuesta.
      opciones: opciones(d0, [
        { id: 'mismo', valor: c0, error: 'CONV-MISMO', siFuera: 'Sería cierto si las dos escalas fueran iguales; pero la vuelta tiene 400ᵍ y solo 360°.' },
        { id: 'mitad', valor: c0 * 1.8, error: 'CONV-MITAD', siFuera: 'Multiplicar está bien; pero eso toma 100ᵍ por media vuelta: media vuelta son 200ᵍ.' },
        { id: 'resta', valor: c0 - 10 * Math.sign(c0), error: 'CONV-RESTA-10', siFuera: 'Quitar 10 sirve solo en el ángulo recto, 100ᵍ = 90°; en los demás se multiplica por 9/10.' },
        { id: 'inversa', valor: c0 * 10 / 9, error: 'CONV-INVERSA', siFuera: 'Convertir con 9 y 10 está bien; pero el número sexagesimal es el menor: va por 9/10.' },
      ].filter(o => Math.abs(o.valor * 10 - Math.round(o.valor * 10)) < 1e-9), gradoTxt),
      solucion: { texto: 'Cada 10ᵍ son 9°. El signo no cambia.', ecuacion: junto([dI(cen(c0)), ' · ', { frac: ['9°', '10ᵍ'] }, ' = ', dH(gr(d0))]) },
    };
  }
  // Tipo 1: complemento o suplemento, con el dato en un sistema y la respuesta en el otro.
  function casoComplemento(rr) {
    const supl = rr.ent(0, 1) === 1, enC = rr.ent(0, 1) === 1;      // enC: el dato está en centesimales
    const Tc = supl ? 200 : 100, Ts = supl ? 180 : 90, que = supl ? 'suplemento' : 'complemento';
    let k;
    do k = rr.ent(1, supl ? 17 : 8); while (CUARTO(k));
    const xc = 10 * k, xs = 9 * k;                                      // el ángulo: xc centesimales = xs sexagesimales
    const bien = enC ? Ts - xs : Tc - xc, fmt = enC ? gradoTxt : cenTxt;
    return {
      pregunta: enC ? ['Un ángulo mide ', dI(cen(xc)), `. ¿Cuánto mide su ${que}, en grados sexagesimales?`] : ['Un ángulo mide ', dH(gr(xs)), `. ¿Cuánto mide su ${que}, en grados centesimales?`],
      datos: [supl ? DS.supl : DS.comp, supl ? DS.llano : DS.recto, DS.conv],
      opciones: opciones(bien, [
        { id: 'mismo', valor: enC ? Ts - xc : Tc - xs, error: 'CONV-MISMO', siFuera: `Restar del ángulo ${supl ? 'llano' : 'recto'} está bien; pero el ${supl ? 'llano' : 'recto'} y el dato están en escalas distintas.` },
        { id: 'simbolo', valor: enC ? Tc - xc : Ts - xs, error: 'CONV-SIMBOLO', siFuera: `La resta está bien hecha; falta pasar el resultado a grados ${enC ? 'sexagesimales' : 'centesimales'}.` },
        { id: 'angulo', valor: enC ? xs : xc, error: 'CONV-ANGULO', siFuera: `Convertir el ángulo está bien; pero se pide su ${que}: lo que le falta.` },
      ].filter(o => o.valor > 0), fmt),
      solucion: { texto: `Se convierte el ángulo y se resta del ${supl ? 'llano' : 'recto'}, todo en el sistema pedido.`,
        ecuacion: enC ? junto([`${fg(Ts)}° − `, dH(gr(xs)), ' = ', dH(gr(bien))]) : junto([`${fg(Tc)}ᵍ − `, dI(cen(xc)), ' = ', dI(cen(bien))]) },
    };
  }
  // Tipo 2 (nivel de examen): el tercer ángulo de un triángulo, con los otros dos en sistemas distintos.
  function casoDosEscalas(rr) {
    let kc, ks;
    do { kc = rr.ent(3, 9); ks = rr.ent(3, 11); } while (9 * kc + 9 * ks > 162 || kc === ks);
    const xc = 10 * kc, ys = 9 * ks, tercero = 180 - 9 * kc - ys, enC = rr.ent(0, 1) === 1;   // respuesta en centesimales o no
    const bien = enC ? tercero * 10 / 9 : tercero, fmt = enC ? cenTxt : gradoTxt;
    return {
      pregunta: ['Dos ángulos de un triángulo miden ', dI(cen(xc)), ' y ', dH(gr(ys)), `. ¿Cuánto mide el tercero, en grados ${enC ? 'centesimales' : 'sexagesimales'}?`],
      datos: [DS.tri, DS.conv],
      opciones: opciones(bien, [
        enC ? { id: 'sinvolver', valor: tercero, error: 'CONV-SIN-VOLVER', siFuera: 'La cuenta en sexagesimales está bien; falta pasar el resultado a centesimales.' }
          : { id: 'mismo', valor: 180 - xc - ys, error: 'CONV-MISMO', siFuera: 'Restar de 180° es la idea; pero el primer ángulo está en centesimales: antes se convierte.' },
        { id: 'doscientos', valor: 200 - xc - ys, error: 'CONV-MISMO', siFuera: 'Restar los dos ángulos es la idea; pero están en escalas distintas: primero, al mismo sistema.' },
        { id: 'suma', valor: enC ? xc + ys * 10 / 9 : 9 * kc + ys, error: 'CONV-SUMA', siFuera: 'La conversión está bien; pero eso es lo que suman los dos: falta restarlo del total.' },
        { id: 'inversa', valor: enC ? tercero * 0.9 : 180 - xc * 10 / 9 - ys, error: 'CONV-INVERSA', siFuera: 'El planteo está bien; pero la conversión va al revés: 10ᵍ son 9°.' },
      ].filter(o => o.valor > 0 && Math.abs(o.valor * 10 - Math.round(o.valor * 10)) < 1e-9), fmt),
      solucion: { texto: 'Todo a sexagesimales, se resta de 180° y se pasa al sistema pedido.',
        ecuacion: [junto([dI(cen(xc)), ' = ', dH(gr(9 * kc))]), FL, junto([`180° − ${fg(9 * kc)}° − ${fg(ys)}° = `, dH(gr(tercero))]), ...(enC ? [FL, junto([dI(cen(bien))])] : [])] },
    };
  }

  const escalas = {
    id: 'tres-sistemas',
    titulo: 'Grados sexagesimales y grados centesimales',
    pregunta: '¿Por qué 90° y 100ᵍ son el mismo ángulo?',
    temas: ['Sistemas sexagesimal, centesimal y radial', 'Conversión entre sistemas'],
    pieza: OB,
    aprendizaje: 'La misma vuelta se parte en 360° o en 400ᵍ: 9° y 10ᵍ son el mismo giro. Convertir conserva la fracción de vuelta.',
    actividad: 'Mover la aguja de un transportador que marca en dos escalas a la vez.',
    lee: {
      tarjetas: [
        { titulo: 'Dos maneras de partir la vuelta', texto: 'Una distancia se mide en metros o en pies; un giro también tiene más de una unidad. El grado del colegio se llama grado sexagesimal: la vuelta tiene 360. El grado centesimal parte la misma vuelta en 400.',
          pieza: OB, dibujo: { datos: transp(0), estado: {} } },
        { titulo: 'Un transportador de dos escalas', texto: 'Este transportador de vuelta entera tiene dos escalas. La de afuera cuenta grados sexagesimales (°). La de adentro cuenta grados centesimales (ᵍ). El cero de las dos está a la derecha, y la aguja marca el mismo giro en las dos.',
          pieza: OB, dibujo: { datos: transp(90), estado: {} } },
        { titulo: 'Cómo se escriben', texto: '40° se lee «cuarenta grados sexagesimales». 40ᵍ, con una g pequeña arriba, se lee «cuarenta grados centesimales». En la calculadora científica son los modos DEG y GRA. No abren lo mismo: sus rayitas son de distinto tamaño.' },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve la aguja y compara los dos números que marca. Mira cuál de los dos es siempre mayor, y qué marcan en el cuarto de vuelta y en la media vuelta.' },
      ],
    },
    ejemplos: EJEMPLOS_ESCALAS,
    juega: {
      pieza: OB,
      consigna: 'La aguja del transportador marca el mismo giro en sus dos escalas: afuera, grados sexagesimales; adentro, grados centesimales.',
      mision: {
        texto: 'Lleva la aguja hasta que la escala de adentro marque 150ᵍ.',
        logrado: val => Math.abs(val.g - 135) < 1e-9,
        bien: 'Listo: 150ᵍ adentro y 135° afuera. Es la misma abertura.',
      },
      voz: '¿Cuál de los dos números es siempre el mayor?',
      leyenda: [
        { s: '°', t: 'grado sexagesimal: la vuelta tiene 360' },
        { s: 'ᵍ', t: 'grado centesimal: la vuelta tiene 400' },
        { s: dH('carmín'), t: 'la escala y la medida sexagesimales' },
        { s: dI('turquesa'), t: 'la escala y la medida centesimales' },
      ],
      controles: [{ id: 'g', etiqueta: 'Giro de la aguja', color: 'c-h', min: 0, max: 360, paso: 9, inicio: 45, unidad: '°', decimales: 0 }],
      arrastres: [{ id: 'aguja', etiqueta: 'punta de la aguja del transportador', color: 'c-h',
        donde: val => { const p = TG().geometria(transp(val.g)).marca; return { x: p[0], y: p[1] }; },
        mover: (pt, val) => { const a = TG().anguloDe(transp(val.g), pt, { cerca: val.g }); return { g: a < -4 ? (val.g > 180 ? 360 : 0) : a > 364 ? 360 : Math.max(0, a) }; } }],
      dibujo: val => ({ datos: transp(val.g), estado: {} }),
      lectura: val => (val.g ? [dH(gr(val.g)), ' y ', dI(cen(val.g * 10 / 9)), `: ${fraccion(val.g)}`] : [dH('0°'), ' y ', dI('0ᵍ'), ': la aguja está en el cero']),
      minimo: 3,
    },
    predice: {
      pregunta: ['Un ángulo mide ', dI('55ᵍ'), '. ¿Cuánto mide su complemento, en grados sexagesimales?'],
      datos: [DS.comp, 'Una vuelta: 360° o 400ᵍ.'],
      voz: 'Mira en qué escala está cada número antes de restar.',
      opciones: [
        { id: 'c', texto: '40,5°', correcta: true },
        { id: 'mismo', texto: '35°', error: 'CONV-MISMO', siFuera: 'Restar del ángulo recto es la idea; pero 90 es sexagesimal y 55, centesimal: no se restan así.' },
        { id: 'simbolo', texto: '45°', error: 'CONV-SIMBOLO', siFuera: 'La resta en centesimales está bien: faltan 45ᵍ. Falta pasarlos a grados sexagesimales.' },
        { id: 'inversa', texto: '50°', error: 'CONV-INVERSA', siFuera: 'Convertir los 45ᵍ que faltan está bien; pero el número sexagesimal es menor, no mayor.' },
      ],
      dibujo: { datos: transp(49.5, enCen('55ᵍ')), estado: {} },
      revelar: { datos: { objeto: 'transportador', giros: [{ mide: 49.5, texto: '55ᵍ', colorTexto: 'i', en: 25 }, { mide: 40.5, de: 49.5, texto: '40,5°', r: 50, en: 70 }], pos: 90 }, estado: {} },
      coincide: 'Coincide: al ángulo le faltan 45ᵍ para el recto, y 45ᵍ son 40,5°.',
      noCoincide: 'Revisemos en el transportador: el ángulo recto está en 100ᵍ, no en 90ᵍ.',
    },
    mira: {
      pieza: OB,
      datos: { objeto: 'transportador', giros: [{ mide: 90, de: 0, desde: 0, hasta: 0 }, { mide: 49.5, de: 0, texto: '55ᵍ', colorTexto: 'i', en: 25, desde: 1 },
        { mide: 40.5, de: 49.5, texto: '45ᵍ', colorTexto: 'i', r: 50, en: 70, desde: 1, hasta: 1 }, { mide: 40.5, de: 49.5, texto: '40,5°', r: 50, en: 70, desde: 2 }], pos: 90 },
      voz: 'Primero, todo en la misma escala.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Un cuarto de vuelta es el ángulo recto: 90° o 100ᵍ.', ecuacion: junto([dH('90°'), ' = ', dI('100ᵍ')]) },
        { estado: { paso: 1 }, texto: 'En centesimales, al ángulo de 55ᵍ le faltan 45ᵍ para el recto.', ecuacion: junto(['100ᵍ − ', dI('55ᵍ'), ' = ', dI('45ᵍ')]) },
        { estado: { paso: 2 }, texto: 'Cada 10ᵍ son 9°: se multiplica por 9/10.', ecuacion: junto([dI('45ᵍ'), ' · ', { frac: ['9°', '10ᵍ'] }, ' = ', dH('40,5°')]) },
        { estado: { paso: 2 }, texto: 'Por el otro camino sale igual: primero se convierte el ángulo.', ecuacion: [junto([dI('55ᵍ'), ' = ', dH('49,5°')]), FL, junto(['90° − 49,5° = ', dH('40,5°')])] },
      ],
    },
    regla: {
      texto: 'Una vuelta mide 360° o 400ᵍ: 9° y 10ᵍ son el mismo giro. Para cambiar de sistema se multiplica por 9°/10ᵍ o por 10ᵍ/9°.',
      ecuacion: [junto([dH('9°'), ' = ', dI('10ᵍ')]), SEP, junto(['de ᵍ a °: × ', { frac: ['9', '10'] }]), SEP, junto(['de ° a ᵍ: × ', { frac: ['10', '9'] }])],
      condicion: 'los dos números miden el mismo giro: el signo no cambia. Antes de sumar o restar, todo va al mismo sistema.',
      voz: 'Dos escalas, un solo giro.',
    },
    // Así se resuelve: de sexagesimales a centesimales. «Ahora tú» va al revés, y además pide complementos y triángulos.
    resuelve: {
      pieza: OB,
      generar(sem) {
        const rr = azar(sem + 900);
        let k;
        do k = rr.ent(2, 38) * (sem % 4 === 3 ? -1 : 1); while (CUARTO(k));
        const d0 = 9 * k, c0 = 10 * k;
        return {
          enunciado: ['Un ángulo trigonométrico mide ', dH(gr(d0)), '. ¿Cuánto mide en grados centesimales?'],
          datos: [DS.vuelta, DS.conv],
          dibujo: { datos: transp(d0, enSex(gr(d0))), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden la medida del mismo giro, escrita en grados centesimales.' },
            { tipo: 'datos', texto: ['El ángulo mide ', dH(gr(d0)), `, en grados sexagesimales${d0 < 0 ? ': es un giro horario' : ''}.`] },
            { tipo: 'regla', texto: 'La vuelta tiene 360° o 400ᵍ: cada 9° son 10ᵍ. Para pasar a centesimales se multiplica por 10ᵍ/9°.', ecuacion: junto([dH('9°'), ' = ', dI('10ᵍ')]) },
            { tipo: 'cuentas', texto: 'Se multiplica por la fracción, que vale 1: los grados sexagesimales se van.', ecuacion: junto([dH(gr(d0)), ' · ', { frac: ['10ᵍ', '9°'] }, ' = ', dI(cen(c0))]), dibujo: { datos: transp(d0, enCen(cen(c0))), estado: {} } },
            { tipo: 'sentido', texto: `Tiene sentido: el grado centesimal es más chico, así que hacen falta más: ${fg(Math.abs(c0))} contra ${fg(Math.abs(d0))}. El signo no cambió.` },
          ],
          respuesta: [dI(cen(c0))],
        };
      },
    },
    ahoraTu: {
      pieza: OB,
      voz: 'Mira en qué escala está cada dato.',
      generar(sem) { return conCuatro([casoConvierte, casoComplemento, casoDosEscalas][sem % 3], azar(sem + 23)); },
    },
  };

  // ---------- Idea 3: minutos y segundos del grado ----------
  // Objeto de la primera pantalla: la lupa sobre el transportador (pieza trig-medida, dibujo de prueba): un grado
  // sexagesimal partido en sus 60 minutos y, debajo, un grado centesimal partido en sus 100.
  // Cambia: la aguja, por grados y minutos. · Permanece: las 60 partes del grado. · Progresa: la fracción de grado de la
  // lectura. · Se reserva: los minutos centesimales (la predicción). · Debe verse: 45′ son tres cuartos de grado, no 0,45.
  // Errores: SEX-DECIMAL lee los minutos como decimales (el error objetivo de la matriz), SEX-CIEN cuenta 100 minutos en
  // el grado sexagesimal, SEX-SUMA suma grados y minutos, SEX-SOLO-MIN olvida los grados enteros, CEN-SESENTA cuenta 60
  // en el grado centesimal, SEX-PRESTA-100 presta 100 minutos, SEX-NO-DESCUENTA no descuenta el grado prestado,
  // SEX-INVIERTE resta los minutos al revés, MIN-MISMO toma un minuto por otro (trampa de San Marcos 2022),
  // MIN-FACTOR-GRADO usa 10/9 para los minutos, MIN-SIN-SISTEMA cambia de 60 a 100 sin cambiar de sistema (hipótesis).
  const gm = (g, m) => `${fg(g)}° ${fg(m)}′`;
  const EJ_MIN = { reloj: ['20ᵐ', '1080ᵐ', '1200ᵐ', '1800ᵐ', '2000ᵐ'], seg: ['250ˢ', '81ˢ', '90ˢ', '135ˢ', '225ˢ'], coc: ['5', '7', '10', '8', '11'], tri: ['59° 20′', '60° 20′', '59° 40′', '59° 80′', '60° 40′'], gm: ['1ᵍ 21ᵐ', '1ᵍ 50ᵐ', '1ᵍ 35ᵐ', '1ᵍ 5ᵐ', '15ᵍ'] };
  const lupaEn = (g, m, rot) => ({ objeto: 'lupa', desde: g, min: m, rotulo: rot === undefined ? gm(g, m) : rot, colorRotulo: rot === '?' ? 'tinta' : undefined });
  // Ejemplos resueltos de la idea 3. Cuentas rehechas aparte (cuentas-ideas2a5.js): 15/60; 0,5·60; 60·60; 25/100; 75 − 60;
  // 45 + 30 − 60; 70 − 40; 30/60 + 36/3600; 89° 60′ − 37° 20′; 250/100, ·9/10 y 0,25·60; 3·6 = 18°, ·10/9 y ·100;
  // 81/3600·10/9·10 000; 200/40 + 240/80; 179° 60′ − 120° 20′; (1 + 21/60)·10/9, y cada alternativa equivocada.
  const EJEMPLOS_MINUTOS = [
    { nivel: 1, titulo: 'Un cuarto de grado', figura: figM(lupaEn(2, 15)),
      enunciado: ['Un ángulo mide ', dH('2° 15′'), '. ¿Cuánto mide en grados, con decimales?'],
      datos: [DS.min],
      solucion: [{ texto: 'Un grado tiene 60 minutos: 15 minutos son 15 de esas 60 partes.', ecuacion: junto(['2° + ', { frac: ['15', '60'] }, '° = 2° + 0,25° = ', dH('2,25°')]) }],
      respuesta: [dH('2,25°')] },
    { nivel: 1, titulo: 'De decimales a minutos', figura: figM(lupaEn(4, 30, '4,5°')),
      enunciado: ['Un ángulo mide ', dH('4,5°'), '. ¿Cuánto mide en grados y minutos?'],
      datos: [DS.min],
      solucion: [{ texto: 'Los 4 grados enteros se quedan. El medio grado que sobra se pasa a minutos.', ecuacion: junto(['0,5 · 60′ = 30′', FL, dH('4° 30′')]) }],
      respuesta: [dH('4° 30′')] },
    { nivel: 1, titulo: 'Los segundos de un grado', figura: figM({ objeto: 'lupa', desde: 0 }),
      enunciado: '¿Cuántos segundos sexagesimales tiene un grado sexagesimal?',
      datos: [DS.min],
      solucion: [{ texto: 'Un grado tiene 60 minutos y cada minuto, 60 segundos.', ecuacion: junto(['60 · 60″ = ', dH('3600″')]) }],
      respuesta: [dH('3600″')] },
    { nivel: 1, titulo: 'En centesimales es directo',
      enunciado: ['Un ángulo mide ', dI('3ᵍ 25ᵐ'), '. ¿Cuánto mide en grados centesimales, con decimales?'],
      datos: [DS.minC],
      solucion: [{ texto: 'El grado centesimal tiene 100 minutos: 25 minutos son 25 centésimas.', ecuacion: junto(['3ᵍ + ', { frac: ['25', '100'] }, 'ᵍ = ', dI('3,25ᵍ')]) }],
      respuesta: [dI('3,25ᵍ')] },
    { nivel: 1, titulo: 'Minutos de más', figura: figM(lupaEn(1, 15, '75′')),
      enunciado: ['Un ángulo mide ', dH('75′'), '. ¿Cómo se escribe en grados y minutos?'],
      datos: [DS.min],
      solucion: [{ texto: 'Cada 60 minutos hacen un grado. De 75 minutos sale un grado y sobran 15.', ecuacion: junto(['75′ = 60′ + 15′ = ', dH('1° 15′')]) }],
      respuesta: [dH('1° 15′')] },
    { nivel: 2, titulo: 'Sumar con llevada',
      enunciado: ['¿Cuánto mide la suma de un ángulo de ', dH('12° 45′'), ' y otro de ', dH('8° 30′'), '?'],
      datos: [DS.min],
      solucion: [
        { texto: 'Se suman grados con grados y minutos con minutos:', ecuacion: junto(['20° 75′']) },
        { texto: 'Como 75 minutos pasan de 60, sale un grado más:', ecuacion: junto(['20° + 1° + 15′ = ', dH('21° 15′')]) },
      ],
      respuesta: [dH('21° 15′')] },
    { nivel: 2, titulo: 'Restar prestando',
      enunciado: ['¿Cuánto mide la diferencia entre un ángulo de ', dH('20° 10′'), ' y otro de ', dH('5° 40′'), '?'],
      datos: [DS.min],
      solucion: [
        { texto: 'A 10 minutos no se le pueden quitar 40: se presta un grado, que son 60 minutos.', ecuacion: junto(['20° 10′ = 19° 70′']) },
        { texto: 'Ahora sí:', ecuacion: junto(['19° 70′ − 5° 40′ = ', dH('14° 30′')]) },
      ],
      respuesta: [dH('14° 30′')] },
    { nivel: 2, titulo: 'Con minutos y segundos', figura: figM(lupaEn(1, 30.6, '1° 30′ 36″')),
      enunciado: ['Un ángulo mide ', dH('1° 30′ 36″'), '. ¿Cuánto mide en grados, con decimales?'],
      datos: [DS.min],
      solucion: [
        { texto: 'Los minutos se dividen entre 60 y los segundos, entre 3600 (60 · 60):', ecuacion: [junto([{ frac: ['30', '60'] }, ' = 0,5']), SEP, junto([{ frac: ['36', '3600'] }, ' = 0,01'])] },
        { texto: 'Se juntan con el grado entero:', ecuacion: junto(['1 + 0,5 + 0,01 = ', dH('1,51°')]) },
      ],
      respuesta: [dH('1,51°')] },
    { nivel: 2, titulo: 'El complemento con minutos',
      enunciado: ['Un ángulo mide ', dH('37° 20′'), '. ¿Cuánto mide su complemento?'],
      datos: [DS.comp, ['Ángulo recto: ', dH('90°'), '.'], DS.min],
      solucion: [
        { texto: 'Al recto se le presta un grado para tener minutos:', ecuacion: junto(['90° = 89° 60′']) },
        { texto: 'Se resta parte por parte:', ecuacion: junto(['89° 60′ − 37° 20′ = ', dH('52° 40′')]) },
      ],
      respuesta: [dH('52° 40′')] },
    { nivel: 2, titulo: 'De minutos centesimales a sexagesimales',
      enunciado: ['Un ángulo mide ', dI('250ᵐ'), ', minutos centesimales. ¿Cuánto mide en grados y minutos sexagesimales?'],
      datos: [DS.minC, DS.conv, DS.min],
      solucion: [
        { texto: 'Primero a grados centesimales, y de ahí a sexagesimales:', ecuacion: [junto([dI('250ᵐ'), ' = ', dI('2,5ᵍ')]), FL, junto(['2,5 · ', { frac: ['9', '10'] }, ' = 2,25°'])] },
        { texto: 'La parte decimal, a minutos:', ecuacion: junto(['0,25 · 60′ = 15′', FL, dH('2° 15′')]) },
      ],
      respuesta: [dH('2° 15′')] },
    { nivel: 3, titulo: 'El minutero, en minutos centesimales', figura: fig({ objeto: 'reloj', horario: 9, giros: [Object.assign({ mide: -18 }, PIDE)] }),
      enunciado: 'El minutero de un reloj avanza durante 3 minutos. ¿Cuántos minutos centesimales mide el ángulo que barre? (Solo su tamaño, sin signo.)',
      alternativas: EJ_MIN.reloj,
      datos: [D.minutero, DS.vuelta, DS.minC],
      solucion: [
        { texto: 'En 3 de los 60 minutos de su vuelta, que tiene 400ᵍ:', ecuacion: junto([{ frac: ['3', '60'] }, ' · 400ᵍ = 20ᵍ']) },
        { texto: 'Cada grado centesimal tiene 100 minutos centesimales:', ecuacion: junto(['20 · 100ᵐ = ', dI('2000ᵐ')]) },
        { texto: ['La ', letra(EJ_MIN.reloj, '20ᵐ'), ' da los grados; la ', letra(EJ_MIN.reloj, '1080ᵐ'), ' da los minutos sexagesimales de 18°; la ', letra(EJ_MIN.reloj, '1200ᵐ'), ' cuenta 60 minutos en el grado centesimal; la ', letra(EJ_MIN.reloj, '1800ᵐ'), ' toma 18° por centesimales.'] },
      ],
      respuesta: [letra(EJ_MIN.reloj, '2000ᵐ'), ', ', dI('2000ᵐ')] },
    { nivel: 3, titulo: 'Segundos de un sistema al otro',
      enunciado: ['Un ángulo mide ', dH('81″'), ', segundos sexagesimales. ¿Cuántos segundos centesimales mide?'],
      alternativas: EJ_MIN.seg,
      datos: [DS.min, DS.minC, DS.conv],
      solucion: [
        { texto: 'A grados sexagesimales y, de ahí, a centesimales:', ecuacion: [junto([{ frac: ['81', '3600'] }, '° = 0,0225°']), FL, junto(['0,0225 · ', { frac: ['10', '9'] }, ' = 0,025ᵍ'])] },
        { texto: 'Un grado centesimal tiene 100 · 100 segundos:', ecuacion: junto(['0,025 · 10 000ˢ = ', dI('250ˢ')]) },
        { texto: ['La ', letra(EJ_MIN.seg, '81ˢ'), ' deja el número; la ', letra(EJ_MIN.seg, '90ˢ'), ' usa 10/9, el de los grados; la ', letra(EJ_MIN.seg, '135ˢ'), ' cambia 60 por 100 una vez; la ', letra(EJ_MIN.seg, '225ˢ'), ' no pasa a centesimales.'] },
      ],
      respuesta: [letra(EJ_MIN.seg, '250ˢ'), ', ', dI('250ˢ')] },
    { nivel: 3, titulo: 'Dos cocientes',
      enunciado: ['¿Cuánto vale ', { frac: [dH('3° 20′'), dH('40′')] }, ' + ', { frac: [dI('2ᵍ 40ᵐ'), dI('80ᵐ')] }, '?'],
      alternativas: EJ_MIN.coc,
      datos: [DS.min, DS.minC],
      solucion: [
        { texto: 'Arriba y abajo, todo en minutos del mismo sistema. En el primero, de 60 en 60:', ecuacion: junto([{ frac: ['3 · 60′ + 20′', '40′'] }, ' = ', { frac: ['200', '40'] }, ' = 5']) },
        { texto: 'En el segundo, de 100 en 100:', ecuacion: junto([{ frac: ['2 · 100ᵐ + 40ᵐ', '80ᵐ'] }, ' = ', { frac: ['240', '80'] }, ' = 3']) },
        { texto: ['Suman 8. La ', letra(EJ_MIN.coc, '5'), ' deja fuera el segundo; la ', letra(EJ_MIN.coc, '7'), ' cuenta 60 en el centesimal; la ', letra(EJ_MIN.coc, '11'), ', 100 en el sexagesimal; la ', letra(EJ_MIN.coc, '10'), ' hace las dos cosas.'] },
      ],
      respuesta: [letra(EJ_MIN.coc, '8'), ', ', dH('8')] },
    { nivel: 3, titulo: 'Un triángulo con minutos',
      enunciado: ['Dos ángulos de un triángulo miden ', dH('48° 35′'), ' y ', dH('71° 45′'), '. ¿Cuánto mide el tercero?'],
      alternativas: EJ_MIN.tri,
      datos: [DS.tri, DS.min],
      solucion: [
        { texto: 'La suma de los dos, con su llevada:', ecuacion: junto(['119° 80′ = 120° 20′']) },
        { texto: 'Se resta de 180°, prestando un grado:', ecuacion: junto(['179° 60′ − 120° 20′ = ', dH('59° 40′')]) },
        { texto: ['La ', letra(EJ_MIN.tri, '59° 80′'), ' presta 100 minutos; la ', letra(EJ_MIN.tri, '60° 40′'), ' no descuenta el grado prestado; la ', letra(EJ_MIN.tri, '60° 20′'), ' lee 119° 80′ como 119,80; la ', letra(EJ_MIN.tri, '59° 20′'), ' no resta los minutos.'] },
      ],
      respuesta: [letra(EJ_MIN.tri, '59° 40′'), ', ', dH('59° 40′')] },
    { nivel: 3, titulo: 'Minutos de un sistema al otro',
      enunciado: ['Un ángulo mide ', dH('1° 21′'), '. ¿Cuánto mide en grados y minutos centesimales?'],
      alternativas: EJ_MIN.gm,
      datos: [DS.min, DS.minC, DS.conv],
      solucion: [
        { texto: 'Primero, a grados con decimales; después, a centesimales:', ecuacion: [junto(['1° + ', { frac: ['21', '60'] }, '° = 1,35°']), FL, junto(['1,35 · ', { frac: ['10', '9'] }, ' = 1,5ᵍ'])] },
        { texto: 'El medio grado centesimal son 50 de sus 100 minutos:', ecuacion: [dI('1ᵍ 50ᵐ')] },
        { texto: ['La ', letra(EJ_MIN.gm, '1ᵍ 21ᵐ'), ' deja los mismos números; la ', letra(EJ_MIN.gm, '1ᵍ 35ᵐ'), ' no cambia de sistema; la ', letra(EJ_MIN.gm, '1ᵍ 5ᵐ'), ' lee 1,5 como 5 minutos; la ', letra(EJ_MIN.gm, '15ᵍ'), ' corre la coma.'] },
      ],
      respuesta: [letra(EJ_MIN.gm, '1ᵍ 50ᵐ'), ', ', dI('1ᵍ 50ᵐ')] },
  ];

  // «Ahora tú» de la idea 3. Tipo 0: grados, minutos y decimales (en los dos sistemas).
  function casoDecimal(rr) {
    const g = rr.ent(1, 40), m = 3 * rr.ent(1, 19), v = rr.ent(0, 2), dec = g + m / 60;
    if (v === 0) {
      return {
        pregunta: ['Un ángulo mide ', dH(gm(g, m)), '. ¿Cuánto mide en grados, con decimales?'],
        datos: [DS.min],
        dibujo: figM(lupaEn(g, m)),
        opciones: opciones(dec, [
          { id: 'decimal', valor: g + m / 100, error: 'SEX-DECIMAL', siFuera: 'Dejar los grados enteros está bien; pero los minutos no son centésimas: se dividen entre 60.' },
          { id: 'todo', valor: (60 * g + m) / 100, error: 'SEX-CIEN', siFuera: 'Pasar todo a minutos está bien; pero para volver a grados se divide entre 60, no entre 100.' },
          { id: 'suma', valor: g + m, error: 'SEX-SUMA', siFuera: 'Juntar las dos partes es la idea; pero los minutos son pedazos de grado: primero se dividen entre 60.' },
        ], x => `${f(x, 2)}°`),
        solucion: { texto: 'Los minutos se dividen entre 60 y se suman a los grados enteros.', ecuacion: junto([`${fg(g)}° + `, { frac: [`${m}`, '60'] }, '° = ', dH(`${f(dec, 2)}°`)]) },
      };
    }
    if (v === 1) {
      return {
        pregunta: ['Un ángulo mide ', dH(`${f(dec, 2)}°`), '. ¿Cuántos minutos sexagesimales son, en total?'],
        datos: [DS.min],
        dibujo: figM(lupaEn(g, m, `${f(dec, 2)}°`)),
        opciones: opciones(60 * g + m, [
          { id: 'cien', valor: Math.round(dec * 100), error: 'SEX-CIEN', siFuera: 'Multiplicar es la idea; pero un grado sexagesimal tiene 60 minutos, no 100.' },
          { id: 'decimal', valor: 60 * g + Math.round((dec - g) * 100), error: 'SEX-DECIMAL', siFuera: 'Los grados enteros están bien pasados; pero los decimales no son minutos: también se multiplican por 60.' },
          { id: 'solo', valor: m, error: 'SEX-SOLO-MIN', siFuera: 'Los minutos de la parte decimal están bien; faltan los de los grados enteros.' },
        ], x => `${fg(x)}′`),
        solucion: { texto: 'Todo el número se multiplica por 60.', ecuacion: junto([`${f(dec, 2)} · 60′ = `, dH(`${fg(60 * g + m)}′`)]) },
      };
    }
    const mc = 5 * rr.ent(1, 19), decC = g + mc / 100;
    return {
      pregunta: ['Un ángulo mide ', dI(`${fg(g)}ᵍ ${fg(mc)}ᵐ`), '. ¿Cuánto mide en grados centesimales, con decimales?'],
      datos: [DS.minC],
      opciones: opciones(decC, [
        { id: 'sesenta', valor: g + mc / 60, error: 'CEN-SESENTA', siFuera: 'Dividir los minutos es la idea; pero el grado centesimal tiene 100 minutos, no 60.' },
        { id: 'mil', valor: g + mc / 1000, error: 'SEX-CIEN', siFuera: 'Dejar los grados enteros está bien; pero los minutos son centésimas, no milésimas.' },
        { id: 'suma', valor: g + mc, error: 'SEX-SUMA', siFuera: 'Juntar las dos partes es la idea; pero los minutos son pedazos de grado.' },
      ], x => `${f(x, 3)}ᵍ`),
      solucion: { texto: 'En centesimales, los minutos son centésimas de grado.', ecuacion: junto([`${fg(g)}ᵍ + `, { frac: [`${mc}`, '100'] }, 'ᵍ = ', dI(`${f(decC, 2)}ᵍ`)]) },
    };
  }
  // Tipo 1: restar con préstamo (una diferencia o un complemento).
  function casoPrestamo(rr) {
    const comp = rr.ent(0, 1) === 1;
    let g1, m1, g2, m2;
    if (comp) { g1 = 90; m1 = 0; g2 = rr.ent(12, 78); m2 = 5 * rr.ent(1, 11); }
    else do { g1 = rr.ent(20, 80); g2 = rr.ent(5, g1 - 6); m1 = 5 * rr.ent(0, 6); m2 = 5 * rr.ent(4, 11); } while (m1 >= m2 || m1 + 100 - m2 === m1 + 60 - m2);
    const G = g1 - g2, bien = gm(G - 1, m1 + 60 - m2);
    const ops = [{ id: 'c', texto: bien, correcta: true },
      { id: 'cien', texto: gm(G - 1, m1 + 100 - m2), error: 'SEX-PRESTA-100', siFuera: 'Prestar un grado está bien; pero ese grado son 60 minutos, no 100.' },
      { id: 'nodescuenta', texto: gm(G, m1 + 60 - m2), error: 'SEX-NO-DESCUENTA', siFuera: 'Los minutos están bien; pero el grado que se prestó ya no se cuenta.' },
      comp ? { id: 'sologrados', texto: gm(G, m2), error: 'SEX-INVIERTE', siFuera: 'Los grados están bien restados; pero los minutos también se restan, prestando un grado.' }
        : { id: 'invierte', texto: gm(G, m2 - m1), error: 'SEX-INVIERTE', siFuera: 'Los grados están bien; pero los minutos se restaron al revés: hay que prestar un grado.' }];
    return {
      pregunta: comp ? ['Un ángulo mide ', dH(gm(g2, m2)), '. ¿Cuánto mide su complemento?'] : ['¿Cuánto mide la diferencia entre un ángulo de ', dH(gm(g1, m1)), ' y otro de ', dH(gm(g2, m2)), '?'],
      datos: comp ? [DS.comp, ['Ángulo recto: ', dH('90°'), '.'], DS.min] : [DS.min],
      opciones: new Set(ops.map(o => o.texto)).size === 4 ? ops : ops.slice(0, 3),
      solucion: { texto: 'Se presta un grado, que son 60 minutos, y se resta parte por parte.', ecuacion: junto([`${gm(g1 - 1, m1 + 60)} − ${gm(g2, m2)} = `, dH(bien)]) },
    };
  }
  // Tipo 2 (nivel de examen): minutos o segundos de un sistema al otro, y el giro del minutero en minutos centesimales.
  function casoEntreSistemas(rr) {
    // k desde 2: 27′ = 50ᵐ es la predicción de la idea. Y 54′ no: sus 100ᵐ son el 1ᵍ de los datos.
    const v = rr.ent(0, 3), k = v === 0 ? rr.ent(3, 6) : rr.ent(2, 6);
    if (v === 3) {
      const t = 3 * rr.ent(1, 6), bien = 2000 * t / 3;
      return {
        pregunta: `El minutero de un reloj avanza durante ${t} minutos. ¿Cuántos minutos centesimales mide el ángulo que barre? (Solo su tamaño, sin signo.)`,
        datos: [D.minutero, DS.vuelta, DS.minC],
        opciones: opciones(bien, [
          { id: 'sex', valor: 360 * t, error: 'MIN-MISMO', siFuera: 'El giro está bien calculado; pero esos son sus minutos sexagesimales: falta cambiar de sistema.' },
          { id: 'cien', valor: 600 * t, error: 'CONV-MISMO', siFuera: 'Multiplicar por 100 es de centesimales; pero los grados eran sexagesimales: antes se convierten.' },
          { id: 'grados', valor: 20 * t / 3, error: 'MIN-GRADOS', siFuera: 'Esos son los grados centesimales del giro. Cada uno tiene 100 minutos centesimales.' },
        ], x => `${fg(x)}ᵐ`),
        solucion: { texto: 'Parte de la vuelta, en grados centesimales, y cada grado en sus 100 minutos.', ecuacion: junto([{ frac: [`${t}`, '60'] }, ` · 400ᵍ = ${f(20 * t / 3, 0)}ᵍ = `, dI(`${fg(bien)}ᵐ`)]) },
      };
    }
    const T = [
      { de: 27 * k, a: 50 * k, u1: '′', u2: 'ᵐ', n1: 'minutos sexagesimales', n2: 'minutos centesimales', sex: true, errs: [27 * k, 30 * k, 45 * k] },
      { de: 50 * k, a: 27 * k, u1: 'ᵐ', u2: '′', n1: 'minutos centesimales', n2: 'minutos sexagesimales', sex: false, errs: [50 * k, 45 * k, 30 * k] },
      { de: 81 * k, a: 250 * k, u1: '″', u2: 'ˢ', n1: 'segundos sexagesimales', n2: 'segundos centesimales', sex: true, errs: [81 * k, 90 * k, 135 * k] },
    ][v];
    const col = T.sex ? dH : dI, col2 = T.sex ? dI : dH;
    return {
      pregunta: ['Un ángulo mide ', col(`${fg(T.de)}${T.u1}`), `, ${T.n1}. ¿Cuántos ${T.n2} mide?`],
      datos: [DS.min, DS.minC, DS.conv],
      opciones: opciones(T.a, [
        { id: 'mismo', valor: T.errs[0], error: 'MIN-MISMO', siFuera: 'Sería cierto si los dos sistemas partieran igual; pero sus minutos y segundos son de distinto tamaño.' },
        { id: 'factor', valor: T.errs[1], error: 'MIN-FACTOR-GRADO', siFuera: 'Usar 9 y 10 es de los grados; pero aquí además cambia en cuántas partes se divide cada grado.' },
        { id: 'sinsistema', valor: T.errs[2], error: 'MIN-SIN-SISTEMA', siFuera: 'Cambiar entre 60 y 100 partes está bien; falta además cambiar el grado: 9° son 10ᵍ.' },
      ], x => `${fg(x)}${T.u2}`),
      solucion: { texto: 'Se pasa a grados, se cambia de sistema con 9° = 10ᵍ y se vuelve a la parte pedida.', ecuacion: junto([col(`${fg(T.de)}${T.u1}`), ' = ', col2(`${fg(T.a)}${T.u2}`)]) },
    };
  }

  const minutos = {
    id: 'minutos-decimales',
    titulo: 'Minutos y segundos del grado',
    pregunta: '¿Por qué 2° 15′ no es 2,15°?',
    temas: ['Minutos y segundos'],
    pieza: MD,
    aprendizaje: 'El grado sexagesimal tiene 60 minutos y el centesimal, 100: por eso 2° 15′ es 2,25°, pero 2ᵍ 15ᵐ es 2,15ᵍ.',
    actividad: 'Mover una aguja dentro de un solo grado, visto con lupa.',
    lee: {
      tarjetas: [
        { titulo: 'La lupa sobre el transportador', texto: 'Entre dos rayitas de grado todavía hay sitio. Con una lupa se ve que cada grado sexagesimal se parte en 60 pedazos iguales: los minutos sexagesimales. Así escriben los mapas y el GPS una ubicación.',
          pieza: MD, dibujo: { datos: { objeto: 'lupa', desde: 2 }, estado: {} } },
        { titulo: 'Los símbolos', texto: '° marca los grados, ′ los minutos y ″ los segundos: 3° 10′ 20″ se lee «tres grados, diez minutos y veinte segundos». Cada minuto se parte otra vez en 60 segundos sexagesimales, como la hora del reloj.' },
        { titulo: 'En centesimales, de cien en cien', texto: 'El grado centesimal se parte en 100 minutos centesimales (ᵐ) y cada uno, en 100 segundos centesimales (ˢ): 2ᵍ 15ᵐ 40ˢ. Se llaman igual que los sexagesimales, pero no miden lo mismo.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a mover la aguja dentro de un grado. Cuenta las rayitas que hay entre dos grados y mira qué parte del grado lleva recorrida la aguja.' },
      ],
    },
    ejemplos: EJEMPLOS_MINUTOS,
    juega: {
      pieza: MD,
      consigna: 'La lupa muestra un solo grado del transportador, partido en minutos: hay una rayita cada 5 minutos.',
      mision: {
        texto: 'Arma con la aguja un ángulo que mida exactamente 2,75°.',
        logrado: val => val.g === 2 && val.m === 45,
        bien: 'Listo: 2° 45′. Los 45 minutos son tres cuartos de los 60 del grado.',
      },
      voz: 'Cuenta las rayitas que hay entre dos grados.',
      leyenda: [
        { s: '°', t: 'grado sexagesimal' },
        { s: '′', t: 'minuto sexagesimal: un pedazo de grado' },
        { s: dH('carmín'), t: 'la medida en grados y minutos sexagesimales' },
      ],
      controles: [
        { id: 'g', etiqueta: 'Grados', min: 0, max: 3, paso: 1, inicio: 1, unidad: '°', decimales: 0 },
        { id: 'm', etiqueta: 'Minutos', min: 0, max: 55, paso: 5, inicio: 30, unidad: '′', decimales: 0 },
      ],
      arrastres: [{ id: 'aguja', etiqueta: 'aguja: se corre por los minutos del grado', color: 'c-h',
        donde: val => { const p = TM().geometria(lupaEn(val.g, val.m)).aguja; return { x: p[0], y: p[1] }; },
        mover: pt => { const k = TM().constantes; return { m: Math.max(0, Math.min(55, Math.round((pt.x - k.LX0) / k.LARGO * 12) * 5)) }; } }],
      dibujo: val => ({ datos: lupaEn(val.g, val.m), estado: {} }),
      lectura: val => (val.m ? junto([dH(gm(val.g, val.m)), ` = ${fg(val.g)}° + `, { frac: [`${val.m}`, '60'] }, ' de grado']) : junto([dH(gm(val.g, 0)), `: ${fg(val.g)} ${val.g === 1 ? 'grado justo' : 'grados justos'}`])),
      minimo: 3,
    },
    predice: {
      pregunta: ['Un ángulo mide ', dH('27′'), ', minutos sexagesimales. ¿Cuántos minutos centesimales mide?'],
      datos: ['Un grado sexagesimal tiene 60 minutos sexagesimales.', 'Un grado centesimal tiene 100 minutos centesimales.', 'Mismo giro: 9° y 10ᵍ.'],
      voz: 'Los dos se llaman minutos. ¿Miden lo mismo?',
      opciones: [
        { id: 'c', texto: '50ᵐ', correcta: true },
        { id: 'mismo', texto: '27ᵐ', error: 'MIN-MISMO', siFuera: 'Sería cierto si los dos minutos midieran igual; pero salen de grados distintos, partidos distinto.' },
        { id: 'factor', texto: '30ᵐ', error: 'MIN-FACTOR-GRADO', siFuera: 'Usar 9 y 10 es de los grados; pero un grado tiene 60 minutos y el otro, 100.' },
        { id: 'sinsistema', texto: '45ᵐ', error: 'MIN-SIN-SISTEMA', siFuera: 'Es cierto que 27′ son 0,45°. Falta pasar esos grados a centesimales.' },
      ],
      dibujo: { datos: lupaEn(0, 27, '27′'), estado: {} },
      revelar: { datos: { objeto: 'lupa', desde: 0, min: 27, rotulo: '27′', cen: true, rotuloCen: '50ᵐ' }, estado: {} },
      coincide: 'Coincide: 27′ y 50ᵐ caen en la misma raya.',
      noCoincide: 'Revisemos con la lupa: debajo está el grado centesimal, partido en 100.',
    },
    mira: {
      pieza: MD,
      datos: { objeto: 'lupa', desde: 0, min: 27, rotulo: '27′', cen: [{ v: false }, { v: true, paso: 2 }], rotuloCen: [{ t: '' }, { t: '50ᵐ', paso: 3 }] },
      voz: 'De minutos a grados, y de un grado al otro.',
      pasos: [
        { estado: { paso: 0 }, texto: 'El grado sexagesimal tiene 60 minutos: 27 son 27 de esas 60 partes.', ecuacion: junto([{ frac: ['27', '60'] }, '° = ', dH('0,45°')]) },
        { estado: { paso: 1 }, texto: 'Se cambia de sistema con los grados: 9° son 10ᵍ.', ecuacion: junto(['0,45 · ', { frac: ['10', '9'] }, ' = ', dI('0,5ᵍ')]) },
        { estado: { paso: 2 }, texto: 'El grado centesimal es más corto y se parte en 100 minutos.', ecuacion: junto([dI('1ᵍ = 100ᵐ')]) },
        { estado: { paso: 3 }, texto: 'Medio grado centesimal son 50 de sus minutos.', ecuacion: junto(['0,5 · 100ᵐ = ', dI('50ᵐ')]) },
        { estado: { paso: 3 }, texto: 'Los dos números nombran el mismo pedacito de giro.', ecuacion: junto([dH('27′'), ' = ', dI('50ᵐ')]) },
      ],
    },
    regla: {
      texto: 'El grado sexagesimal tiene 60 minutos (′) y cada minuto, 60 segundos (″). El grado centesimal tiene 100 minutos (ᵐ) y cada minuto, 100 segundos (ˢ).',
      ecuacion: [junto([dH('1° = 60′')]), SEP, junto([dH('1′ = 60″')]), SEP, junto([dI('1ᵍ = 100ᵐ')]), SEP, junto([dI('1ᵐ = 100ˢ')])],
      condicion: 'los minutos de un sistema no miden lo que los del otro. Para cambiar de sistema se pasa por los grados.',
      voz: 'Sesenta partes en uno; cien en el otro.',
    },
    // Así se resuelve: un ángulo con minutos y segundos, a grados con decimales. «Ahora tú» pide otras cosas: decimales
    // y minutos sin segundos, restas con préstamo y cambios de sistema.
    resuelve: {
      pieza: MD,
      generar(sem) {
        const rr = azar(sem + 900), g = rr.ent(1, 40), m = 6 * rr.ent(1, 9), sg = 36 * rr.ent(1, 2) - (sem % 2 ? 18 : 0);
        const dec = g + m / 60 + sg / 3600, txt = `${fg(g)}° ${m}′ ${sg}″`;
        return {
          enunciado: ['Un ángulo mide ', dH(txt), '. ¿Cuánto mide en grados, con decimales?'],
          datos: [DS.min],
          dibujo: { datos: lupaEn(g, m + sg / 60, '?'), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el mismo ángulo escrito con un solo número: grados con decimales.' },
            { tipo: 'datos', texto: `Tiene ${fg(g)} grados enteros, ${m} minutos y ${sg} segundos sexagesimales.` },
            { tipo: 'regla', texto: 'Un grado tiene 60 minutos y un minuto, 60 segundos: un grado tiene 60 · 60 = 3600 segundos.', ecuacion: [junto([dH('1° = 60′')]), SEP, junto([dH('1° = 3600″')])] },
            { tipo: 'cuentas', texto: 'Los minutos se dividen entre 60 y los segundos, entre 3600.', ecuacion: [junto([{ frac: [`${m}`, '60'] }, ` = ${f(m / 60, 3)}`]), SEP, junto([{ frac: [`${sg}`, '3600'] }, ` = ${f(sg / 3600, 3)}`])] },
            { tipo: 'aplica', texto: 'Se juntan con los grados enteros.', ecuacion: junto([`${fg(g)} + ${f(m / 60, 3)} + ${f(sg / 3600, 3)} = `, dH(`${f(dec, 3)}°`)]), dibujo: { datos: lupaEn(g, m + sg / 60, `${f(dec, 3)}°`), estado: {} } },
            { tipo: 'sentido', texto: `Tiene sentido: queda entre ${fg(g)}° y ${fg(g + 1)}°, y ${m} minutos ${m < 30 ? 'no llegan a' : m === 30 ? 'son justo' : 'pasan de'} medio grado.` },
          ],
          respuesta: [dH(`${f(dec, 3)}°`)],
        };
      },
    },
    ahoraTu: {
      pieza: MD,
      voz: 'Primero decide en cuántas partes se divide ese grado.',
      generar(sem) { return conCuatro([casoDecimal, casoPrestamo, casoEntreSistemas][sem % 3], azar(sem + 41)); },
    },
  };

  // ---------- Idea 4: el radián, un radio de arco ----------
  // Objeto de la primera pantalla: la rueda de un triciclo de carga y una pita del largo de un rayo (pieza trig-medida).
  // Cambia: cuántas pitas se acuestan sobre la llanta y el tamaño de la rueda. · Permanece: cada pita mide un radio.
  // Progresa: el ángulo que abarcan las pitas desde el centro. · Se reserva: la vuelta completa (la predicción).
  // Debe verse: con otra rueda, el mismo número de pitas abarca el mismo ángulo.
  // Aquí el radián se presenta y se convierte; el largo de un arco (s = θ · r) se calcula en «Longitud de arco».
  // Errores (docs/investigacion/trigonometria-ideas-erroneas.md): TR1 «π es 180» o lee 3 rad como 3π (parcial), TR2 el
  // radián no es una razón entre arco y radio (documentado), TR3 toma los radianes por grados (documentado en cálculo),
  // TR6 el ángulo depende del tamaño (parcial). Hipótesis: RAD-ENTERO la vuelta mide radios enteros, RAD-MEDIA confunde
  // la vuelta con la media vuelta, RAD-200 usa 200 con π en sexagesimales (o 180 en centesimales), CONV-PI olvida π,
  // CONV-INVERSA invierte el factor, RAD-RESTA resta arco y radio, CONV-MISMO y CONV-SUMA como en la idea 2.
  const radTxt = t => `${t} rad`;
  const EJ_RAD = { tri: ['75°', '70°', '81°', '95°', '105°'], cuad: ['150°', '145°', '105°', '165°', '255°'], suma: ['34°', '70°', '73°', '74°', '77°'], sinpi: ['3°', '540°', '191°', '0,05°', '171,9°'], rad: ['5π/12 rad', '11π/20 rad', '81π rad', '9π/20 rad', '81π/200 rad'] };
  const ruedaCon = (cm, pitas, rot, extra = {}) => Object.assign({ objeto: 'rueda', radio: cm, pitas, cuenta: true, rotulo: rot, colorRotulo: rot === '?' ? 'tinta' : undefined }, extra);
  // Ejemplos resueltos de la idea 4. Cuentas rehechas aparte (cuentas-ideas2a5.js): 90/180; 180/3; 3 radios; 2/5·200;
  // 180/π; −225/180; 2·180/π; 40/16; 50·9/10 + 180/6; π − 3π/4 y 200/4; 180 − 60 − 45; 360 − 90 − 120 − 45;
  // 27 + 36 + 7; 3·180/π; 180 − 45 − 54 = 81 y 81/180, y cada alternativa equivocada.
  const EJEMPLOS_RADIAN = [
    { nivel: 1, titulo: 'Un cuarto de vuelta en radianes', figura: fig(transp(90, enSex('90°'))),
      enunciado: ['Un ángulo mide ', dH('90°'), '. ¿Cuánto mide en radianes?'],
      datos: [DS.pi],
      solucion: [{ texto: 'Media vuelta son 180° o π rad. Los 90° son la mitad de eso.', ecuacion: junto([dH('90°'), ' · ', { frac: ['π rad', '180°'] }, ' = ', dF('π/2 rad')]) }],
      respuesta: [dF('π/2 rad')] },
    { nivel: 1, titulo: 'De radianes a grados',
      enunciado: ['Un ángulo mide ', dF('π/3 rad'), '. ¿Cuánto mide en grados sexagesimales?'],
      datos: [DS.pi],
      solucion: [{ texto: 'π rad son 180°: la tercera parte de π rad es la tercera parte de 180°.', ecuacion: junto([{ frac: ['180°', '3'] }, ' = ', dH('60°')]) }],
      respuesta: [dH('60°')] },
    { nivel: 1, titulo: 'Tres pitas sobre la llanta', figura: figM(ruedaCon(30, 3, '?')),
      enunciado: 'Sobre la llanta de una rueda hay acostadas, una tras otra, 3 pitas del largo de su radio. ¿Qué ángulo abarcan desde el centro, en radianes?',
      datos: [DS.radDef],
      solucion: [{ texto: 'Cada pita mide un radio y abarca 1 radián. Tres pitas seguidas abarcan 3.', ecuacion: [dF('3 rad')] }],
      respuesta: [dF('3 rad')] },
    { nivel: 1, titulo: 'De radianes a centesimales',
      enunciado: ['Un ángulo mide ', dF('2π/5 rad'), '. ¿Cuánto mide en grados centesimales?'],
      datos: [DS.pi],
      solucion: [{ texto: 'π rad son 200ᵍ. El ángulo es 2/5 de π rad: 2/5 de 200ᵍ.', ecuacion: junto([{ frac: ['2', '5'] }, ' · 200ᵍ = ', dI('80ᵍ')]) }],
      respuesta: [dI('80ᵍ')] },
    { nivel: 1, titulo: '¿Un radián o 60°?', figura: figM(ruedaCon(30, 1, '1 rad')),
      enunciado: ['¿Qué ángulo abre más: uno de ', dF('1 rad'), ' o uno de ', dH('60°'), '?'],
      datos: [DS.pi, DS.piNum],
      solucion: [{ texto: 'Se pasa el radián a grados: π rad son 180°, así que 1 rad es 180° entre π.', ecuacion: junto([{ frac: ['180°', 'π'] }, ' ≈ 57,3° < ', dH('60°')]) }],
      respuesta: ['El de ', dH('60°'), ', por poco'] },
    { nivel: 2, titulo: 'Un giro horario, en radianes', figura: fig(transp(-225, enSex('−225°'))),
      enunciado: ['Un ángulo trigonométrico mide ', dH('−225°'), '. ¿Cuánto mide en radianes?'],
      datos: [DS.pi],
      solucion: [
        { texto: 'Se multiplica por π rad/180° y se simplifica: 225 y 180 tienen 45 en común.', ecuacion: junto([{ frac: ['225', '180'] }, ' = ', { frac: ['5', '4'] }]) },
        { texto: 'El signo no cambia: sigue siendo un giro horario.', ecuacion: [dF('−5π/4 rad')] },
      ],
      respuesta: [dF('−5π/4 rad')] },
    { nivel: 2, titulo: 'Radianes sin π', figura: figM(ruedaCon(30, 2, '2 rad')),
      enunciado: ['Un ángulo mide ', dF('2 rad'), ', así, sin π. ¿Cuánto mide en grados sexagesimales, con un decimal?'],
      datos: [DS.pi, DS.piNum],
      solucion: [
        { texto: 'π es un número, 3,1416: no hace falta que aparezca. Se multiplica por 180°/π rad.', ecuacion: junto(['2 · ', { frac: ['180°', 'π'] }, ' = ', { frac: ['360°', '3,1416'] }]) },
        { texto: 'Se divide:', ecuacion: junto(['≈ ', dH('114,6°')]) },
      ],
      respuesta: ['≈ ', dH('114,6°')] },
    // Sin figura: la rueda dibuja la pita partida en radios, y contarlos es la respuesta.
    { nivel: 2, titulo: 'La pita más larga',
      enunciado: 'Una rueda tiene 16 cm de radio. Sobre su llanta se acuesta una pita de 40 cm. ¿Qué ángulo abarca la pita desde el centro, en radianes?',
      datos: [DS.radDef],
      solucion: [
        { texto: 'Se cuenta cuántas veces cabe el radio en la pita:', ecuacion: junto(['40 cm ÷ 16 cm = 2,5']) },
        { texto: 'La pita mide 2 radios y medio: abarca 2,5 radianes. Los centímetros se van.', ecuacion: [dF('2,5 rad')] },
      ],
      respuesta: [dF('2,5 rad')] },
    { nivel: 2, titulo: 'Suma en dos sistemas',
      enunciado: ['¿Cuánto mide, en grados sexagesimales, la suma de un ángulo de ', dI('50ᵍ'), ' y otro de ', dF('π/6 rad'), '?'],
      datos: [DS.pi, DS.conv],
      solucion: [
        { texto: 'Cada uno, a sexagesimales:', ecuacion: [junto([dI('50ᵍ'), ' = ', dH('45°')]), SEP, junto([dF('π/6 rad'), ' = ', { frac: ['180°', '6'] }, ' = ', dH('30°')])] },
        { texto: 'La suma:', ecuacion: junto(['45° + 30° = ', dH('75°')]) },
      ],
      respuesta: [dH('75°')] },
    { nivel: 2, titulo: 'El suplemento, en centesimales',
      enunciado: ['Un ángulo mide ', dF('3π/4 rad'), '. ¿Cuánto mide su suplemento, en grados centesimales?'],
      datos: [DS.supl, DS.pi],
      solucion: [
        { texto: 'El llano mide π rad. El suplemento, en radianes:', ecuacion: junto(['π − ', { frac: ['3π', '4'] }, ' = ', { frac: ['π', '4'] }, ' rad']) },
        { texto: 'π rad son 200ᵍ:', ecuacion: junto([{ frac: ['200ᵍ', '4'] }, ' = ', dI('50ᵍ')]) },
      ],
      respuesta: [dI('50ᵍ')] },
    { nivel: 3, titulo: 'Un triángulo en tres sistemas',
      enunciado: ['Dos ángulos de un triángulo miden ', dF('π/3 rad'), ' y ', dI('50ᵍ'), '. ¿Cuánto mide el tercero, en grados sexagesimales?'],
      alternativas: EJ_RAD.tri,
      datos: [DS.tri, DS.pi, DS.conv],
      solucion: [
        { texto: 'Los dos, a sexagesimales:', ecuacion: [junto([dF('π/3 rad'), ' = ', dH('60°')]), SEP, junto([dI('50ᵍ'), ' = ', dH('45°')])] },
        { texto: 'El tercero completa los 180°:', ecuacion: junto(['180° − 60° − 45° = ', dH('75°')]) },
        { texto: ['La ', letra(EJ_RAD.tri, '70°'), ' toma 50ᵍ por 50°; la ', letra(EJ_RAD.tri, '81°'), ' toma los 60 de π/3 por centesimales; la ', letra(EJ_RAD.tri, '95°'), ' resta de 200; la ', letra(EJ_RAD.tri, '105°'), ' da la suma de los dos.'] },
      ],
      respuesta: [letra(EJ_RAD.tri, '75°'), ', ', dH('75°')] },
    { nivel: 3, titulo: 'Un cuadrilátero en radianes',
      enunciado: ['Tres ángulos de un cuadrilátero miden ', dF('π/2'), ', ', dF('2π/3'), ' y ', dF('π/4 rad'), '. ¿Cuánto mide el cuarto, en grados sexagesimales?'],
      alternativas: EJ_RAD.cuad,
      datos: [DS.cuad, DS.pi],
      solucion: [
        { texto: 'Con π rad = 180°, los tres miden:', ecuacion: junto(['90°, 120° y 45°', FL, 'suman 255°']) },
        { texto: 'El cuarto completa los 360°:', ecuacion: junto(['360° − 255° = ', dH('105°')]) },
        { texto: ['La ', letra(EJ_RAD.cuad, '255°'), ' da la suma de los tres; la ', letra(EJ_RAD.cuad, '145°'), ' resta de 400; la ', letra(EJ_RAD.cuad, '165°'), ' toma 2π/3 por 60°; la ', letra(EJ_RAD.cuad, '150°'), ' olvida el ángulo de π/4.'] },
      ],
      respuesta: [letra(EJ_RAD.cuad, '105°'), ', ', dH('105°')] },
    { nivel: 3, titulo: 'Una suma en tres sistemas',
      enunciado: ['¿Cuánto mide, en grados sexagesimales, la suma ', dI('30ᵍ'), ' + ', dF('π/5 rad'), ' + ', dH('7°'), '?'],
      alternativas: EJ_RAD.suma,
      datos: [DS.pi, DS.conv],
      solucion: [
        { texto: 'Cada sumando, a sexagesimales:', ecuacion: [junto([dI('30ᵍ'), ' = ', dH('27°')]), SEP, junto([dF('π/5 rad'), ' = ', { frac: ['180°', '5'] }, ' = ', dH('36°')])] },
        { texto: 'La suma:', ecuacion: junto(['27° + 36° + 7° = ', dH('70°')]) },
        { texto: ['La ', letra(EJ_RAD.suma, '34°'), ' deja fuera el sumando con π; la ', letra(EJ_RAD.suma, '73°'), ' toma 30ᵍ por 30°; la ', letra(EJ_RAD.suma, '74°'), ' pasa π rad a 200; la ', letra(EJ_RAD.suma, '77°'), ' hace las dos cosas.'] },
      ],
      respuesta: [letra(EJ_RAD.suma, '70°'), ', ', dH('70°')] },
    { nivel: 3, titulo: 'Tres radianes, sin π', figura: figM(ruedaCon(30, 3, '3 rad')),
      enunciado: ['Un ángulo mide ', dF('3 rad'), ', así, sin π. ¿Cuánto mide, aproximadamente, en grados sexagesimales?'],
      alternativas: EJ_RAD.sinpi,
      datos: [DS.pi, DS.piNum],
      solucion: [
        { texto: 'Aunque no se vea π, el ángulo está en radianes. Se multiplica por 180°/π rad:', ecuacion: junto(['3 · ', { frac: ['180°', '3,1416'] }, ' ≈ ', dH('171,9°')]) },
        { texto: 'Tiene sentido: 3 rad es casi π rad, casi media vuelta.' },
        { texto: ['La ', letra(EJ_RAD.sinpi, '3°'), ' toma los radianes por grados; la ', letra(EJ_RAD.sinpi, '540°'), ' lee 3 como 3π; la ', letra(EJ_RAD.sinpi, '191°'), ' usa 200, que da centesimales; la ', letra(EJ_RAD.sinpi, '0,05°'), ' multiplica por π/180.'] },
      ],
      respuesta: [letra(EJ_RAD.sinpi, '171,9°'), ', ≈ ', dH('171,9°')] },
    { nivel: 3, titulo: 'La respuesta, en radianes',
      enunciado: ['Dos ángulos de un triángulo miden ', dF('π/4 rad'), ' y ', dI('60ᵍ'), '. ¿Cuánto mide el tercero, en radianes?'],
      alternativas: EJ_RAD.rad,
      datos: [DS.tri, DS.pi, DS.conv],
      solucion: [
        { texto: 'En sexagesimales: 45° y 54°. El tercero:', ecuacion: junto(['180° − 45° − 54° = 81°']) },
        { texto: 'A radianes, simplificando entre 9:', ecuacion: junto(['81° · ', { frac: ['π rad', '180°'] }, ' = ', dF('9π/20 rad')]) },
        { texto: ['La ', letra(EJ_RAD.rad, '5π/12 rad'), ' toma 60ᵍ por 60°; la ', letra(EJ_RAD.rad, '11π/20 rad'), ' da la suma de los dos; la ', letra(EJ_RAD.rad, '81π rad'), ' no divide entre 180; la ', letra(EJ_RAD.rad, '81π/200 rad'), ' divide entre 200.'] },
      ],
      respuesta: [letra(EJ_RAD.rad, '9π/20 rad'), ', ', dF('9π/20 rad')] },
  ];

  // «Ahora tú» de la idea 4. Tipo 0: de grados (sexagesimales o centesimales) a radianes.
  const piGrados = [15, 18, 20, 30, 36, 40, 45, 54, 60, 72, 75, 90, 108, 120, 135, 144, 150, 210, 225, 240, 270, 300, 315];
  function casoARad(rr) {
    const sg = rr.ent(0, 4) ? 1 : -1;
    if (rr.ent(0, 1)) {
      const dd = sg * rr.uno(piGrados);
      return {
        pregunta: ['Un ángulo trigonométrico mide ', dH(gr(dd)), '. ¿Cuánto mide en radianes?'],
        datos: [DS.pi],
        dibujo: fig(transp(dd, enSex(gr(dd)))),
        opciones: opciones(piTxt(dd), [
          { id: 'sinpi', valor: f(dd / 180, 2), error: 'CONV-PI', siFuera: 'Dividir entre 180 está bien: esa es la fracción de media vuelta. Falta multiplicarla por π.' },
          { id: 'doscientos', valor: piFrac(dd, 200), error: 'RAD-200', siFuera: 'Poner π arriba está bien; pero 200 es la media vuelta de los centesimales: aquí va 180.' },
          { id: 'inversa', valor: piFrac(sg * 180, Math.abs(dd)), error: 'CONV-INVERSA', siFuera: 'Usar π y 180 está bien; pero la fracción quedó al revés: los grados van arriba.' },
        ], radTxt),
        solucion: { texto: 'Media vuelta son 180° y también π rad.', ecuacion: junto([dH(gr(dd)), ' · ', { frac: ['π rad', '180°'] }, ' = ', dF(radTxt(piTxt(dd)))]) },
      };
    }
    const cc = sg * rr.uno([20, 25, 40, 50, 80, 100, 120, 125, 150, 160, 250, 300, 350]);
    return {
      pregunta: ['Un ángulo trigonométrico mide ', dI(cen(cc)), '. ¿Cuánto mide en radianes?'],
      datos: [DS.pi],
      dibujo: fig(transp(cc * 0.9, enCen(cen(cc)))),
      opciones: opciones(piFrac(cc, 200), [
        { id: 'sinpi', valor: f(cc / 200, 3), error: 'CONV-PI', siFuera: 'Dividir entre 200 está bien: esa es la fracción de media vuelta. Falta multiplicarla por π.' },
        { id: 'cientoochenta', valor: piFrac(cc, 180), error: 'RAD-200', siFuera: 'Poner π arriba está bien; pero 180 es la media vuelta de los sexagesimales: aquí va 200.' },
        { id: 'inversa', valor: piFrac(sg * 200, Math.abs(cc)), error: 'CONV-INVERSA', siFuera: 'Usar π y 200 está bien; pero la fracción quedó al revés: los grados van arriba.' },
      ], radTxt),
      solucion: { texto: 'Media vuelta son 200ᵍ y también π rad.', ecuacion: junto([dI(cen(cc)), ' · ', { frac: ['π rad', '200ᵍ'] }, ' = ', dF(radTxt(piFrac(cc, 200)))]) },
    };
  }
  // Tipo 1: radianes sin π, o radios que caben en un arco (la definición, sin calcular el largo de ningún arco).
  function casoRadios(rr) {
    if (rr.ent(0, 1)) {
      const t = rr.uno([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), bien = t * 180 / Math.PI;
      return {
        pregunta: ['Un ángulo mide ', dF(radTxt(f(t))), ', así, sin π. ¿Cuánto mide, aproximadamente, en grados sexagesimales?'],
        datos: [DS.pi, DS.piNum],
        dibujo: figM(ruedaCon(30, t, radTxt(f(t)), { cuenta: false })),
        opciones: opciones(bien, [
          { id: 'conpi', valor: 180 * t, error: 'TR1', siFuera: `Usar 180° está bien; pero eso lee ${f(t)} como ${f(t)}π: aquí no hay π, hay que dividir entre π.` },
          { id: 'grados', valor: t, error: 'TR3', siFuera: 'Sería cierto si radianes y grados fueran la misma unidad; pero un radián mide unos 57°.' },
          { id: 'inversa', valor: t * Math.PI / 180, error: 'CONV-INVERSA', siFuera: 'Usar π y 180 está bien; pero para pasar a grados se multiplica por 180/π, no por π/180.' },
        ], v => `${f(v, v < 1 ? 3 : 1)}°`),
        solucion: { texto: 'π es el número 3,1416. Se multiplica por 180°/π rad.', ecuacion: junto([`${f(t)} · `, { frac: ['180°', '3,1416'] }, ' ≈ ', dH(`${f(bien, 1)}°`)]) },
      };
    }
    const cm = rr.uno([12, 16, 20, 24, 30, 40]), t = rr.uno([0.5, 1.5, 2, 2.5, 3]), L = cm * t;
    return {
      pregunta: `Una rueda tiene ${fg(cm)} cm de radio. Sobre su llanta se acuesta una pita de ${fg(L)} cm. ¿Qué ángulo abarca la pita desde el centro, en radianes?`,
      datos: [DS.radDef],
      opciones: opciones(t, [
        { id: 'inversa', valor: cm / L, error: 'TR2', siFuera: 'Dividir los dos largos es la idea; pero se cuenta cuántos radios caben en la pita, no al revés.' },
        { id: 'resta', valor: L - cm, error: 'RAD-RESTA', siFuera: 'Comparar la pita con el radio es la idea; pero se comparan dividiendo, no restando.' },
        { id: 'grados', valor: t * 180 / Math.PI, error: 'TR3', siFuera: 'Ese número es la medida en grados; en radianes es el número de radios que mide la pita.' },
        { id: 'conpi', valor: t * Math.PI, error: 'TR1', siFuera: 'La división está bien; pero no hay que multiplicar por π: el número de radios ya es la medida.' },
      ], v => radTxt(f(v, 2))),
      solucion: { texto: 'El ángulo en radianes es el número de radios que mide la pita.', ecuacion: junto([`${fg(L)} cm ÷ ${fg(cm)} cm = `, dF(radTxt(f(t)))]) },
    };
  }
  // Tipo 2 (nivel de examen, modelos de San Marcos 2023-I, 2026-I y 2026-II): un triángulo con ángulos en tres sistemas.
  function casoTresSistemas(rr) {
    let a, kc;
    do { a = rr.uno([18, 36, 45, 54, 72, 90]); kc = rr.ent(2, 9); } while (a + 9 * kc > 160 || a === 9 * kc);
    const xc = 10 * kc, tercero = 180 - a - 9 * kc, enRad = rr.ent(0, 2) === 0;
    if (enRad) {
      return {
        pregunta: ['Dos ángulos de un triángulo miden ', dF(radTxt(piTxt(a))), ' y ', dI(cen(xc)), '. ¿Cuánto mide el tercero, en radianes?'],
        datos: [DS.tri, DS.pi, DS.conv],
        opciones: opciones(piTxt(tercero), [
          { id: 'mismo', valor: piTxt(180 - a - xc), error: 'CONV-MISMO', siFuera: 'El planteo está bien; pero el ángulo centesimal se restó como si fuera sexagesimal.' },
          { id: 'suma', valor: piTxt(a + 9 * kc), error: 'CONV-SUMA', siFuera: 'Las conversiones están bien; pero esa es la suma de los dos: falta restarla de 180°.' },
          { id: 'doscientos', valor: piFrac(tercero, 200), error: 'RAD-200', siFuera: 'El ángulo en grados está bien; pero al pasar a radianes se divide entre 180, no entre 200.' },
          { id: 'sindividir', valor: `${fg(tercero)}π`, error: 'CONV-PI', siFuera: 'El ángulo en grados está bien; falta dividir entre 180 al pasar a radianes.' },
        ], radTxt),
        solucion: { texto: 'Todo a sexagesimales, se resta de 180° y se pasa a radianes.', ecuacion: [junto([`180° − ${fg(a)}° − ${fg(9 * kc)}° = ${fg(tercero)}°`]), FL, junto([dF(radTxt(piTxt(tercero)))])] },
      };
    }
    return {
      pregunta: ['Dos ángulos de un triángulo miden ', dF(radTxt(piTxt(a))), ' y ', dI(cen(xc)), '. ¿Cuánto mide el tercero, en grados sexagesimales?'],
      datos: [DS.tri, DS.pi, DS.conv],
      opciones: opciones(tercero, [
        { id: 'mismo', valor: 180 - a - xc, error: 'CONV-MISMO', siFuera: 'Restar de 180° es la idea; pero el ángulo centesimal se restó como si fuera sexagesimal.' },
        { id: 'doscientos', valor: 180 - a * 10 / 9 - 9 * kc, error: 'RAD-200', siFuera: 'El planteo está bien; pero π rad son 180°: con 200 sale la medida en centesimales.' },
        { id: 'suma', valor: a + 9 * kc, error: 'CONV-SUMA', siFuera: 'Las conversiones están bien; pero esa es la suma de los dos: falta restarla de 180°.' },
        { id: 'resta200', valor: 200 - a - 9 * kc, error: 'CONV-MISMO', siFuera: 'Las conversiones están bien; pero en sexagesimales los tres ángulos suman 180°, no 200.' },
      ].filter(o => o.valor > 0), gradoTxt),
      solucion: { texto: 'Todo a sexagesimales y se resta de 180°.', ecuacion: [junto([dF(radTxt(piTxt(a))), ' = ', dH(gr(a))]), SEP, junto([dI(cen(xc)), ' = ', dH(gr(9 * kc))]), FL, junto([dH(gr(tercero))])] },
    };
  }

  const radian = {
    id: 'radian',
    titulo: 'El radián: un radio de arco',
    pregunta: '¿Qué mide un ángulo de 1 radián?',
    temas: ['Radián', 'Conversión entre sistemas'],
    pieza: MD,
    aprendizaje: 'Un radián es el ángulo central cuyo arco mide lo que el radio; en la vuelta caben 2π radios: π rad = 180° = 200ᵍ.',
    actividad: 'Acostar pitas del largo del radio sobre la llanta de una rueda.',
    lee: {
      tarjetas: [
        { titulo: 'La rueda del triciclo', texto: 'La rueda de un triciclo de carga tiene rayos que van del centro a la llanta, que es una circunferencia. Cada rayo mide lo mismo: es el radio de la rueda. Aquí un rayo está pintado de naranja.',
          pieza: MD, dibujo: { datos: { objeto: 'rueda', radio: 30, pitas: 0 }, estado: {} } },
        { titulo: 'Medir con el radio', texto: 'Corta una pita del largo de un rayo y acuéstala sobre la llanta. Desde el centro, la pita abarca un ángulo. Ese ángulo es la unidad del tercer sistema: el radián, 1 rad.',
          pieza: MD, dibujo: { datos: ruedaCon(30, 1, '1 rad'), estado: {} } },
        { titulo: 'Contar radios', texto: 'Si pones dos pitas, una tras otra, el ángulo mide 2 rad. El ángulo en radianes dice cuántos radios mide su arco. No lleva centímetros: es una cuenta de radios.' },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a acostar pitas y a cambiar el tamaño de la rueda. Mira qué le pasa al ángulo ', th, ' cuando la rueda crece y sus pitas crecen con ella.'] },
      ],
    },
    ejemplos: EJEMPLOS_RADIAN,
    juega: {
      pieza: MD,
      consigna: ['Cada pita mide lo mismo que el radio ', r, ' de la rueda. ', th, ' es el ángulo que abarcan las pitas desde el centro.'],
      mision: {
        texto: 'Con la rueda más grande, acuesta pitas hasta abarcar 2 radianes.',
        logrado: val => val.n === 2 && val.r === 40,
        bien: 'Listo: dos pitas, dos radianes. La rueda creció y el ángulo no cambió.',
      },
      voz: 'Cambia el tamaño de la rueda: ¿cambia el ángulo?',
      leyenda: [
        { s: th, t: 'el ángulo que abarcan las pitas' },
        { s: r, t: 'el radio: del centro a la llanta' },
        { s: 'rad', t: 'radián: el ángulo de una pita' },
        { s: { v: 'c-o', t: 'naranja' }, t: 'los largos: el radio y cada pita' },
        { s: dF('violeta'), t: 'la medida en radianes' },
      ],
      controles: [
        { id: 'n', etiqueta: 'Pitas sobre la llanta', color: 'c-o', min: 0.5, max: 2.5, paso: 0.5, inicio: 1, decimales: 1 },
        { id: 'r', etiqueta: 'r, el radio de la rueda', color: 'c-o', min: 20, max: 40, paso: 10, inicio: 20, unidad: 'cm', decimales: 0 },
      ],
      arrastres: [{ id: 'pita', etiqueta: 'punta de la última pita: se corre por la llanta', color: 'c-o',
        donde: val => { const p = TM().geometria(ruedaCon(val.r, val.n, '')).punta; return { x: p[0], y: p[1] }; },
        mover: pt => { const c = TM().constantes.RC, a = Math.atan2(c[1] - pt.y, pt.x - c[0]); return { n: Math.max(0.5, Math.min(2.5, Math.round((a < -0.3 ? a + 2 * Math.PI : Math.max(a, 0)) * 2) / 2)) }; } }],
      dibujo: val => ({ datos: ruedaCon(val.r, val.n, radTxt(f(val.n))), estado: {} }),
      lectura: val => [`${f(val.n)} ${val.n === 1 ? 'pita' : 'pitas'} de arco: `, th, ' = ', dF(radTxt(f(val.n)))],
      minimo: 3,
    },
    predice: {
      pregunta: 'Si sigues acostando pitas del largo del radio sobre la llanta, ¿cuántas caben en la vuelta completa?',
      datos: ['Largo del borde de una rueda, la vuelta completa: 2 · π · radio.', DS.piNum],
      voz: 'Compara el largo de la vuelta con el largo de una pita.',
      opciones: [
        { id: 'c', texto: '2π: unas 6,28', correcta: true },
        { id: 'entero', texto: '6 exactas', error: 'RAD-ENTERO', siFuera: 'Caben 6 enteras, es cierto; pero sobra un pedazo de llanta: la vuelta no mide radios justos.' },
        { id: 'media', texto: 'π: unas 3,14', error: 'RAD-MEDIA', siFuera: 'π pitas cubren media vuelta, es cierto; la vuelta entera es el doble.' },
        { id: 'tamano', texto: 'Depende del tamaño de la rueda', error: 'TR6', siFuera: 'Una rueda más grande tiene más llanta, es cierto; pero su pita también es más larga.' },
      ],
      dibujo: { datos: ruedaCon(30, 1, '', { resto: true }), estado: {} },
      revelar: { datos: ruedaCon(30, 6.283, '2π rad'), estado: {} },
      coincide: 'Coincide: seis pitas enteras y un pedazo más. La vuelta mide 2π radios.',
      noCoincide: 'Revisemos: el borde mide 2 · π radios, y cada pita, un radio.',
    },
    mira: {
      pieza: MD,
      datos: { objeto: 'rueda', radio: 30, cuenta: true, pitas: [{ v: 1 }, { v: 3.1416, paso: 2 }, { v: 6.283, paso: 3 }], rotulo: [{ t: '1 rad' }, { t: 'π rad', paso: 2 }, { t: '2π rad', paso: 3 }] },
      voz: 'Cuenta las pitas a lo largo de la llanta.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Una pita del largo del radio abarca 1 radián.', ecuacion: junto(['arco = ', r, FL, th, ' = ', dF('1 rad')]) },
        { estado: { paso: 1 }, texto: 'El borde entero mide 2 · π radios: caben 2π pitas.', ecuacion: junto([{ frac: [['2 · π · ', r], r] }, ' = 2π ≈ 6,28']) },
        { estado: { paso: 2 }, texto: 'Media vuelta son π pitas: tres y un poco.', ecuacion: junto([dF('π rad'), ' = ', dH('180°'), ' = ', dI('200ᵍ')]) },
        { estado: { paso: 3 }, texto: 'La vuelta entera: seis pitas y un pedazo.', ecuacion: junto([dF('2π rad'), ' = ', dH('360°'), ' = ', dI('400ᵍ')]) },
        { estado: { paso: 3 }, texto: 'Por eso un radián mide un poco menos de 60°.', ecuacion: junto([dF('1 rad'), ' = ', { frac: ['180°', 'π'] }, ' ≈ ', dH('57,3°')]) },
      ],
    },
    regla: {
      texto: 'Un radián es el ángulo central cuyo arco mide lo mismo que el radio. La medida en radianes cuenta cuántos radios mide el arco: en la vuelta caben 2π.',
      ecuacion: [junto([dF('π rad'), ' = ', dH('180°'), ' = ', dI('200ᵍ')]), SEP, junto(['1 vuelta = ', dF('2π rad')])],
      condicion: 'no depende del tamaño del círculo. π es el número 3,1416; un ángulo sin unidad escrita está en radianes.',
      voz: 'El radián compara dos largos; por eso no lleva centímetros.',
    },
    // Así se resuelve: de radianes (con π) a grados sexagesimales. «Ahora tú» va al revés (de grados a radianes), y
    // además pide radianes sin π, radios que caben y triángulos en tres sistemas.
    resuelve: {
      pieza: OB,
      generar(sem) {
        // Sin cuartos de vuelta: el transportador de la figura rotula 90°, 180° y 270°.
        const rr = azar(sem + 900), dd = rr.uno(piGrados.filter(g => g % 90)) * (sem % 4 === 3 ? -1 : 1), m = gcd(Math.abs(dd), 180);
        return {
          enunciado: ['Un ángulo trigonométrico mide ', dF(radTxt(piTxt(dd))), '. ¿Cuánto mide en grados sexagesimales?'],
          datos: [DS.pi],
          dibujo: { datos: transp(dd, { texto: '?', colorTexto: 'tinta' }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden la medida del mismo giro, en grados sexagesimales.' },
            { tipo: 'datos', texto: ['El ángulo mide ', dF(radTxt(piTxt(dd))), `: ${Math.abs(dd) / m === 1 ? '' : `${Math.abs(dd) / m} veces `}la ${180 / m === 1 ? 'media vuelta entera' : `${['', '', 'mitad', 'tercera parte', 'cuarta parte', 'quinta parte', 'sexta parte', '', '', 'novena parte', 'décima parte', '', 'doceava parte'][180 / m] || `parte ${180 / m}`} de π rad`}${dd < 0 ? ', en sentido horario' : ''}.`] },
            { tipo: 'regla', texto: 'Media vuelta mide π rad o 180°: son la misma abertura. Para pasar a grados se cambia π rad por 180°.', ecuacion: junto([dF('π rad'), ' = ', dH('180°')]) },
            { tipo: 'cuentas', texto: 'Se multiplica por 180°/π rad: π se va.', ecuacion: junto([dF(piTxt(dd)), ' · ', { frac: ['180°', 'π'] }, ' = ', dH(gr(dd))]), dibujo: { datos: transp(dd, enSex(gr(dd))), estado: {} } },
            { tipo: 'sentido', texto: `Tiene sentido: ${Math.abs(dd) < 180 ? 'es menos de π rad, y sale menos de 180°' : Math.abs(dd) === 180 ? 'es justo media vuelta' : 'pasa de π rad, y sale más de 180°'}. El signo no cambió.` },
          ],
          respuesta: [dH(gr(dd))],
        };
      },
    },
    ahoraTu: {
      voz: 'Media vuelta: 180°, 200ᵍ o π rad.',
      generar(sem) { return conCuatro([casoARad, casoRadios, casoTresSistemas][sem % 3], azar(sem + 59)); },
    },
  };

  // ---------- Idea 5 (nueva): S, C y R, fórmula general ----------
  // Objeto de la primera pantalla: una calculadora científica con el mismo ángulo en sus tres modos (pieza trig-medida).
  // Cambia: el ángulo, de 9° en 9°. · Permanece: los tres modos a la vista. · Progresa: los cocientes S/9 y C/10 de la
  // lectura, que siempre coinciden. · Se reserva: una condición entre S y C (la predicción). · Debe verse: S, C y R son
  // tres números del mismo ángulo, y con una sola letra, k, se escriben los tres.
  // Letras del examen: S, C y R (aquí R no es un radio: se avisa en «Lee»). Colores: S carmín, C turquesa, R violeta.
  // Errores (hipótesis): SCR-SUMA toma el número de la condición por el ángulo, CONV-MISMO reparte como si S = C,
  // SCR-OTRA responde con otro de los tres números, SCR-K da k, SCR-CONVIERTE convierte la condición, SCR-BORRA tacha
  // las letras, SCR-CRUZA cambia 9 por 10, SCR-NUMERADOR olvida el denominador, SCR-SIN-20 olvida dividir entre 20 y
  // SCR-DIEZ divide entre 10.
  const EJ_SCR = { cond: ['4 rad', '4π rad', '36 rad', 'π/5 rad', '2π/5 rad'], expr: ['3', '28', '19', '−29', '2,8'], x: ['41 rad', '45 rad', '5π rad', 'π/20 rad', 'π/4 rad'], cuad: ['18°', '2°', '4°', '20°', '36°'], tres: ['3 rad', '27 rad', '3π/20 rad', 'π/3 rad', '3π rad'] };
  const calc = (s, c, rd) => ({ objeto: 'calculadora', modos: [{ nombre: 'DEG', valor: s, color: 'h' }, { nombre: 'GRA', valor: c, color: 'i' }, { nombre: 'RAD', valor: rd, color: 'f' }] });
  // Ejemplos resueltos de la idea 5. Cuentas rehechas aparte (cuentas-ideas2a5.js): 45/9·10; 80/10·9; 36/9 = 4 y 4π/20;
  // 63/9; (π/4)·20/π = 5 y 9·5; 10k − 9k = 6; 19k = 95; (10 + 9)/(10 − 9); 18k − 10k = 40; k = 2 y 2π/20; 3k + 2k = 20;
  // (18 + 10)/1; (x + 4)/9 = (x + 9)/10; 19k² = 76; 20k = 60, y cada alternativa equivocada.
  const EJEMPLOS_FORMULA = [
    { nivel: 1, titulo: 'De S a C', figura: figM(calc('45', '?', '')),
      enunciado: ['Un ángulo mide 45°: su número de grados sexagesimales es ', S, ' = 45. ¿Cuánto vale ', Cc, ', su número de grados centesimales?'],
      datos: [DS.scrDef, DS.scr],
      solucion: [{ texto: 'De S = 9k sale k = 45 ÷ 9 = 5. Entonces C = 10k.', ecuacion: junto([Cc, ' = 10 · 5 = ', dI('50')]) }],
      respuesta: [Cc, ' = ', dI('50')] },
    { nivel: 1, titulo: 'De C a S', figura: figM(calc('?', '80', '')),
      enunciado: ['El número de grados centesimales de un ángulo es ', Cc, ' = 80. ¿Cuánto vale ', S, '?'],
      datos: [DS.scrDef, DS.scr],
      solucion: [{ texto: 'De C = 10k sale k = 80 ÷ 10 = 8. Entonces S = 9k.', ecuacion: junto([S, ' = 9 · 8 = ', dH('72')]) }],
      respuesta: [S, ' = ', dH('72')] },
    { nivel: 1, titulo: 'De S a R', figura: figM(calc('36', '', '?')),
      enunciado: ['El número de grados sexagesimales de un ángulo es ', S, ' = 36. ¿Cuánto vale ', R, ', su número de radianes?'],
      datos: [DS.scrDef, DS.scr],
      solucion: [{ texto: 'De S = 9k sale k = 36 ÷ 9 = 4. Entonces R = πk/20, y se simplifica.', ecuacion: junto([R, ' = ', { frac: ['4π', '20'] }, ' = ', dF('π/5')]) }],
      respuesta: [R, ' = ', dF('π/5')] },
    { nivel: 1, titulo: '¿Cuánto vale k?', figura: figM(calc('63', '70', '')),
      enunciado: ['Un ángulo mide 63°, que son 70ᵍ. ¿Cuánto vale k para ese ángulo?'],
      datos: [DS.scrDef, DS.scr],
      solucion: [{ texto: 'k sale de cualquiera de los dos números, y da lo mismo:', ecuacion: [junto([{ frac: [dH('63'), '9'] }, ' = 7']), SEP, junto([{ frac: [dI('70'), '10'] }, ' = 7'])] }],
      respuesta: ['k = 7'] },
    { nivel: 1, titulo: 'De R a S', figura: figM(calc('?', '', 'π/4')),
      enunciado: ['El número de radianes de un ángulo es ', R, ' = π/4. ¿Cuánto vale ', S, '?'],
      datos: [DS.scrDef, DS.scr],
      solucion: [{ texto: 'De R = πk/20 = π/4 sale k = 20 ÷ 4 = 5. Entonces S = 9k.', ecuacion: junto([S, ' = 9 · 5 = ', dH('45')]) }],
      respuesta: [S, ' = ', dH('45')] },
    { nivel: 2, titulo: 'Una diferencia',
      enunciado: ['Los números ', S, ' y ', Cc, ' de un mismo ángulo cumplen ', junto([Cc, ' − ', S, ' = 6']), '. ¿Cuánto mide el ángulo, en grados sexagesimales?'],
      datos: [DS.scrDef, DS.scr],
      solucion: [
        { texto: 'Se escribe la condición con k:', ecuacion: [junto('10k − 9k = 6'), FL, junto('k = 6')] },
        { texto: 'El ángulo, en sexagesimales, mide S grados:', ecuacion: junto([S, ' = 9 · 6 = 54', FL, dH('54°')]) },
      ],
      respuesta: [dH('54°')] },
    { nivel: 2, titulo: 'Una suma',
      enunciado: ['Los números ', S, ' y ', Cc, ' de un mismo ángulo cumplen ', junto([S, ' + ', Cc, ' = 95']), '. ¿Cuánto mide el ángulo, en grados centesimales?'],
      datos: [DS.scrDef, DS.scr],
      solucion: [
        { texto: 'Con k:', ecuacion: [junto('9k + 10k = 95'), FL, junto('19k = 95'), FL, junto('k = 5')] },
        { texto: 'Se pide en centesimales: C grados.', ecuacion: junto([Cc, ' = 10 · 5 = 50', FL, dI('50ᵍ')]) },
      ],
      respuesta: [dI('50ᵍ')] },
    { nivel: 2, titulo: 'Un cociente que no cambia',
      enunciado: ['Si ', S, ' y ', Cc, ' son los números de un mismo ángulo, ¿cuánto vale ', { frac: [[Cc, ' + ', S], [Cc, ' − ', S]] }, '?'],
      datos: [DS.scrDef, DS.scr],
      solucion: [
        { texto: 'Se reemplazan S y C por 9k y 10k:', ecuacion: junto([{ frac: ['10k + 9k', '10k − 9k'] }, ' = ', { frac: ['19k', 'k'] }]) },
        { texto: 'La k se simplifica: el cociente vale lo mismo para cualquier ángulo.', ecuacion: [dH('19')] },
      ],
      respuesta: [dH('19')] },
    { nivel: 2, titulo: 'Dos veces S menos C',
      enunciado: ['Los números ', S, ' y ', Cc, ' de un mismo ángulo cumplen ', junto(['2', S, ' − ', Cc, ' = 40']), '. ¿Cuánto mide el ángulo, en grados sexagesimales?'],
      datos: [DS.scrDef, DS.scr],
      solucion: [
        { texto: 'Con k:', ecuacion: [junto('2 · 9k − 10k = 40'), FL, junto('8k = 40'), FL, junto('k = 5')] },
        { texto: 'Entonces:', ecuacion: junto([S, ' = 9 · 5 = 45', FL, dH('45°')]) },
      ],
      respuesta: [dH('45°')] },
    { nivel: 2, titulo: 'De una condición a los radianes',
      enunciado: ['Los números ', S, ' y ', Cc, ' de un mismo ángulo cumplen ', junto([Cc, ' = ', S, ' + 2']), '. ¿Cuánto mide el ángulo, en radianes?'],
      datos: [DS.scrDef, DS.scr],
      solucion: [
        { texto: 'Con k:', ecuacion: [junto('10k = 9k + 2'), FL, junto('k = 2')] },
        { texto: 'El número de radianes:', ecuacion: junto([R, ' = ', { frac: ['2π', '20'] }, ' = π/10', FL, dF('π/10 rad')]) },
      ],
      respuesta: [dF('π/10 rad')] },
    { nivel: 3, titulo: 'Una condición con fracciones',
      enunciado: ['Los números ', S, ' y ', Cc, ' de un ángulo cumplen ', junto([{ frac: [S, '3'] }, ' + ', { frac: [Cc, '5'] }, ' = 20']), '. ¿Cuánto mide el ángulo, en radianes?'],
      alternativas: EJ_SCR.cond,
      datos: [DS.scrDef, DS.scr],
      solucion: [
        { texto: 'Con S = 9k y C = 10k:', ecuacion: [junto([{ frac: ['9k', '3'] }, ' + ', { frac: ['10k', '5'] }, ' = 3k + 2k = 20']), FL, junto('k = 4')] },
        { texto: 'El número de radianes:', ecuacion: junto([R, ' = ', { frac: ['4π', '20'] }, ' = ', dF('π/5')]) },
        { texto: ['La ', letra(EJ_SCR.cond, '4 rad'), ' da k; la ', letra(EJ_SCR.cond, '36 rad'), ' da S; la ', letra(EJ_SCR.cond, '4π rad'), ' no divide entre 20; la ', letra(EJ_SCR.cond, '2π/5 rad'), ' divide entre 10.'] },
      ],
      respuesta: [letra(EJ_SCR.cond, 'π/5 rad'), ', ', dF('π/5 rad')] },
    { nivel: 3, titulo: 'Una expresión con S y C',
      enunciado: ['Si ', S, ' y ', Cc, ' son los números de un mismo ángulo, ¿cuánto vale ', { frac: [['2', S, ' + ', Cc], [Cc, ' − ', S]] }, '?'],
      alternativas: EJ_SCR.expr,
      datos: [DS.scrDef, DS.scr],
      solucion: [
        { texto: 'Se reemplaza:', ecuacion: junto([{ frac: ['2 · 9k + 10k', '10k − 9k'] }, ' = ', { frac: ['28k', 'k'] }, ' = ', dH('28')]) },
        { texto: ['La ', letra(EJ_SCR.expr, '3'), ' tacha las letras: (2 + 1)/1; la ', letra(EJ_SCR.expr, '19'), ' olvida el 2; la ', letra(EJ_SCR.expr, '−29'), ' cambia 9 por 10; la ', letra(EJ_SCR.expr, '2,8'), ' divide entre 10.'] },
      ],
      respuesta: [letra(EJ_SCR.expr, '28'), ', ', dH('28')] },
    { nivel: 3, titulo: 'S y C con una incógnita',
      enunciado: ['Los números de un mismo ángulo son ', junto([S, ' = x + 4']), ' y ', junto([Cc, ' = x + 9']), '. ¿Cuánto mide el ángulo, en radianes?'],
      alternativas: EJ_SCR.x,
      datos: [DS.scrDef, DS.scr, 'x es un número, sin unidad.'],
      solucion: [
        { texto: 'S entre 9 y C entre 10 dan lo mismo, k:', ecuacion: [junto([{ frac: ['x + 4', '9'] }, ' = ', { frac: ['x + 9', '10'] }]), FL, junto('10x + 40 = 9x + 81'), FL, junto('x = 41')] },
        { texto: 'Entonces S = 45 y k = 5:', ecuacion: junto([R, ' = ', { frac: ['5π', '20'] }, ' = ', dF('π/4')]) },
        { texto: ['La ', letra(EJ_SCR.x, '41 rad'), ' da x; la ', letra(EJ_SCR.x, '45 rad'), ' da S; la ', letra(EJ_SCR.x, '5π rad'), ' no divide entre 20; la ', letra(EJ_SCR.x, 'π/20 rad'), ' olvida k.'] },
      ],
      respuesta: [letra(EJ_SCR.x, 'π/4 rad'), ', ', dF('π/4 rad')] },
    { nivel: 3, titulo: 'Una condición con cuadrados',
      enunciado: ['Los números ', S, ' y ', Cc, ' de un ángulo positivo cumplen ', junto([{ sup: [Cc, '2'] }, ' − ', { sup: [S, '2'] }, ' = 76']), '. ¿Cuánto mide el ángulo, en grados sexagesimales?'],
      alternativas: EJ_SCR.cuad,
      datos: [DS.scrDef, DS.scr],
      solucion: [
        { texto: 'Con k:', ecuacion: [junto('100k² − 81k² = 76'), FL, junto('19k² = 76'), FL, junto('k² = 4'), FL, junto('k = 2')] },
        { texto: 'El ángulo mide S grados:', ecuacion: junto([S, ' = 9 · 2 = 18', FL, dH('18°')]) },
        { texto: ['La ', letra(EJ_SCR.cuad, '2°'), ' da k; la ', letra(EJ_SCR.cuad, '4°'), ' da k²; la ', letra(EJ_SCR.cuad, '20°'), ' da C; la ', letra(EJ_SCR.cuad, '36°'), ' usa k = 4, sin sacar la raíz.'] },
      ],
      respuesta: [letra(EJ_SCR.cuad, '18°'), ', ', dH('18°')] },
    { nivel: 3, titulo: 'Con los tres números',
      enunciado: ['Los números ', S, ', ', Cc, ' y ', R, ' de un ángulo cumplen ', junto([S, ' + ', Cc, ' + ', { frac: [['20', R], 'π'] }, ' = 60']), '. ¿Cuánto mide el ángulo, en radianes?'],
      alternativas: EJ_SCR.tres,
      datos: [DS.scrDef, DS.scr],
      solucion: [
        { texto: 'Con R = πk/20, el tercer término es k:', ecuacion: [junto('9k + 10k + k = 60'), FL, junto('20k = 60'), FL, junto('k = 3')] },
        { texto: 'El número de radianes:', ecuacion: junto([R, ' = ', dF('3π/20')]) },
        { texto: ['La ', letra(EJ_SCR.tres, '3 rad'), ' da k; la ', letra(EJ_SCR.tres, '27 rad'), ' da S; la ', letra(EJ_SCR.tres, 'π/3 rad'), ' toma el 60 por grados; la ', letra(EJ_SCR.tres, '3π rad'), ' no divide entre 20.'] },
      ],
      respuesta: [letra(EJ_SCR.tres, '3π/20 rad'), ', ', dF('3π/20 rad')] },
  ];

  // Condiciones lineales entre S y C: [texto de la condición, coeficiente de k]. La condición vale coef · k.
  const CONDS = [
    { ec: d => junto([Cc, ' − ', S, ` = ${fg(d)}`]), k: 1, pl: d => `10k − 9k = ${fg(d)}` },
    { ec: d => junto([S, ' + ', Cc, ` = ${fg(d)}`]), k: 19, pl: d => `9k + 10k = ${fg(d)}` },
    { ec: d => junto(['2', S, ' − ', Cc, ` = ${fg(d)}`]), k: 8, pl: d => `18k − 10k = ${fg(d)}` },
    { ec: d => junto(['3', Cc, ' − 2', S, ` = ${fg(d)}`]), k: 12, pl: d => `30k − 18k = ${fg(d)}` },
    { ec: d => junto([{ frac: [S, '3'] }, ' + ', { frac: [Cc, '5'] }, ` = ${fg(d)}`]), k: 5, pl: d => `3k + 2k = ${fg(d)}` },
    { ec: d => junto([{ frac: [Cc, '2'] }, ' − ', { frac: [S, '3'] }, ` = ${fg(d)}`]), k: 2, pl: d => `5k − 3k = ${fg(d)}` },
  ];
  // «Ahora tú» de la idea 5. Tipo 0: una condición entre S y C; se pide el ángulo en grados.
  function casoCondicion(rr) {
    let co, k;
    do { co = rr.uno(CONDS); k = rr.ent(2, 12); } while (co.k === 19 && k === 3);   // S + C = 57 es la predicción
    const dato = co.k * k, enC = rr.ent(0, 2) === 0, bien = enC ? 10 * k : 9 * k;
    return {
      pregunta: ['Los números ', S, ' y ', Cc, ' de un mismo ángulo cumplen ', co.ec(dato), `. ¿Cuánto mide el ángulo, en grados ${enC ? 'centesimales' : 'sexagesimales'}?`],
      datos: [DS.scrDef, DS.scr],
      opciones: opciones(bien, [
        { id: 'dato', valor: dato, error: 'SCR-SUMA', siFuera: 'Ese es el número de la condición, no la medida del ángulo: falta hallar k.' },
        { id: 'otra', valor: enC ? 9 * k : 10 * k, error: 'SCR-OTRA', siFuera: `La k está bien hallada; pero ese es ${enC ? 'S' : 'C'}, y se pide el ángulo en grados ${enC ? 'centesimales' : 'sexagesimales'}.` },
        { id: 'k', valor: k, error: 'SCR-K', siFuera: 'La k está bien hallada; falta multiplicarla para tener la medida del ángulo.' },
        { id: 'convierte', valor: enC ? dato * 10 / 9 : dato * 9 / 10, error: 'SCR-CONVIERTE', siFuera: 'Eso convierte el número de la condición; primero se plantea con k.' },
      ].filter(o => Math.abs(o.valor * 10 - Math.round(o.valor * 10)) < 1e-9), enC ? cenTxt : gradoTxt),
      solucion: { texto: 'Se escribe la condición con S = 9k y C = 10k, y se despeja k.',
        ecuacion: [junto(co.pl(dato)), FL, junto(`k = ${fg(k)}`), FL, junto(enC ? [Cc, ' = ', dI(fg(10 * k))] : [S, ' = ', dH(fg(9 * k))])] },
    };
  }
  // Tipo 1: una expresión con S y C donde la k se simplifica. (aS + bC)/(cS + dC) = (9a + 10b)/(9c + 10d).
  const EXPRS = [[1, 1, -1, 1], [2, 1, -1, 1], [2, 3, 2, -1], [4, 2, 2, -1], [6, 1, 2, -1], [5, -1, 3, -2], [1, 4, 3, -2], [3, 3, -3, 3]];
  const lin = (a, b) => { const t = (c0, L, pri) => (c0 === 0 ? [] : [`${c0 < 0 ? (pri ? '−' : ' − ') : pri ? '' : ' + '}${Math.abs(c0) === 1 ? '' : Math.abs(c0)}`, L]); const p = t(a, S, true); return p.concat(t(b, Cc, p.length === 0)); };
  function casoExpresion(rr) {
    const [a, b, c0, d0] = rr.uno(EXPRS), bien = (9 * a + 10 * b) / (9 * c0 + 10 * d0);
    return {
      pregunta: ['Si ', S, ' y ', Cc, ' son los números de grados sexagesimales y centesimales de un mismo ángulo, ¿cuánto vale ', { frac: [lin(a, b), lin(c0, d0)] }, '?'],
      datos: [DS.scrDef, DS.scr],
      opciones: opciones(bien, [
        { id: 'borra', valor: c0 + d0 ? (a + b) / (c0 + d0) : NaN, error: 'SCR-BORRA', siFuera: 'Buscar que algo se simplifique es la idea; pero S y C no se tachan: valen 9k y 10k.' },
        { id: 'cruza', valor: (10 * a + 9 * b) / (10 * c0 + 9 * d0), error: 'SCR-CRUZA', siFuera: 'Reemplazar con k está bien; pero es S = 9k y C = 10k, no al revés.' },
        { id: 'numerador', valor: 9 * a + 10 * b, error: 'SCR-NUMERADOR', siFuera: 'El numerador está bien reemplazado; falta dividirlo entre el denominador, que también lleva k.' },
        { id: 'denominador', valor: 9 * c0 + 10 * d0, error: 'SCR-NUMERADOR', siFuera: 'El denominador está bien reemplazado; pero ese no es el cociente: falta el numerador.' },
      ].filter(o => Math.abs(o.valor * 100 - Math.round(o.valor * 100)) < 1e-9), v => f(v, 2)),
      solucion: { texto: 'Se reemplazan S y C por 9k y 10k: la k se simplifica.', ecuacion: junto([{ frac: [`${fg(9 * a + 10 * b)}k`, `${9 * c0 + 10 * d0 === 1 ? '' : fg(9 * c0 + 10 * d0)}k`] }, ' = ', dH(f(bien, 2))]) },
    };
  }
  // Tipo 2 (nivel de examen, modelo de San Marcos 2024-II): de una condición entre S y C, al ángulo en radianes.
  function casoHallaR(rr) {
    let co, k;
    do { co = rr.uno(CONDS); k = rr.ent(1, 12); } while (co.k === 19 && k === 3);   // S + C = 57 es la predicción
    const dato = co.k * k;
    return {
      pregunta: ['Los números ', S, ' y ', Cc, ' de un mismo ángulo cumplen ', co.ec(dato), '. ¿Cuánto mide el ángulo, en radianes?'],
      datos: [DS.scrDef, DS.scr],
      opciones: opciones(piFrac(k, 20), [
        { id: 'sin20', valor: piFrac(k, 1), error: 'SCR-SIN-20', siFuera: 'La k está bien hallada; pero R = πk/20: falta dividir entre 20.' },
        { id: 's', valor: fg(9 * k), error: 'SCR-OTRA', siFuera: 'La k está bien hallada; pero ese número es S, los grados sexagesimales: se piden radianes.' },
        { id: 'diez', valor: piFrac(k, 10), error: 'SCR-DIEZ', siFuera: 'Poner πk arriba está bien; pero se divide entre 20, no entre 10.' },
        { id: 'k', valor: fg(k), error: 'SCR-K', siFuera: 'La k está bien hallada; falta usarla en R = πk/20.' },
      ], radTxt),
      solucion: { texto: 'Se despeja k de la condición y se usa en R = πk/20.', ecuacion: [junto(co.pl(dato)), FL, junto(`k = ${fg(k)}`), FL, junto([R, ' = ', dF(piFrac(k, 20))])] },
    };
  }

  const formula = {
    id: 'formula-general',
    titulo: 'S, C y R: fórmula general',
    pregunta: '¿Cómo se relacionan los tres números de un mismo ángulo?',
    temas: ['Relación entre S, C y R'],
    pieza: MD,
    aprendizaje: 'Los números S, C y R de un mismo ángulo cumplen S/180 = C/200 = R/π: S = 9k, C = 10k y R = πk/20.',
    actividad: 'Cambiar un ángulo en una calculadora que lo muestra en sus tres modos.',
    lee: {
      tarjetas: [
        { titulo: 'La calculadora de tres modos', texto: 'Una calculadora científica mide los ángulos en tres modos: DEG, grados sexagesimales; GRA, grados centesimales, y RAD, radianes. Si escribes un ángulo y cambias de modo, el número cambia; el ángulo, no.',
          pieza: MD, dibujo: { datos: calc('90', '100', 'π/2'), estado: {} } },
        { titulo: 'Tres números, un ángulo', texto: ['El examen pone letra a cada número del mismo ángulo: ', S, ', su número de grados sexagesimales; ', Cc, ', su número de grados centesimales, y ', R, ', su número de radianes. Ojo: aquí ', R, ' no es un radio.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a cambiar el ángulo. En cada caso, divide ', S, ' entre 9 y ', Cc, ' entre 10, y compara los dos resultados.'] },
      ],
    },
    ejemplos: EJEMPLOS_FORMULA,
    juega: {
      pieza: MD,
      consigna: ['La calculadora muestra el mismo ángulo en sus tres modos: ', S, ' en DEG, ', Cc, ' en GRA y ', R, ' en RAD.'],
      mision: {
        texto: 'Cambia el ángulo hasta que el modo GRA marque 70.',
        logrado: val => val.s === 63,
        bien: 'Listo: GRA marca 70 y DEG, 63. Entre 10 y entre 9, dan 7.',
      },
      voz: 'Divide S entre 9 y C entre 10. ¿Qué sale?',
      leyenda: [
        { s: S, t: 'número de grados sexagesimales: modo DEG' },
        { s: Cc, t: 'número de grados centesimales: modo GRA' },
        { s: R, t: 'número de radianes: modo RAD' },
      ],
      controles: [{ id: 's', etiqueta: 'S, el ángulo en modo DEG', color: 'c-h', min: 18, max: 162, paso: 9, inicio: 45, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: calc(fg(val.s), fg(val.s * 10 / 9), piTxt(val.s)), estado: {} }),
      lectura: val => junto([{ frac: [S, '9'] }, ' = ', { frac: [dH(fg(val.s)), '9'] }, ` = ${fg(val.s / 9)}`, SEP, { frac: [Cc, '10'] }, ' = ', { frac: [dI(fg(val.s * 10 / 9)), '10'] }, ` = ${fg(val.s / 9)}`]),
      minimo: 3,
    },
    predice: {
      pregunta: ['Los números ', S, ' y ', Cc, ' de un mismo ángulo suman 57. ¿Cuánto mide el ángulo, en grados sexagesimales?'],
      datos: ['S: el número de grados sexagesimales del ángulo. C: su número de grados centesimales.', '9° y 10ᵍ son el mismo giro.'],
      voz: 'Los dos números son del mismo ángulo, pero no valen lo mismo.',
      opciones: [
        { id: 'c', texto: '27°', correcta: true },
        { id: 'suma', texto: '57°', error: 'SCR-SUMA', siFuera: '57 es la suma de los dos números del ángulo, no su medida.' },
        { id: 'mitad', texto: '28,5°', error: 'CONV-MISMO', siFuera: 'Repartir la suma está bien pensado; pero S y C no son iguales: C es mayor.' },
        { id: 'otra', texto: '30°', error: 'SCR-OTRA', siFuera: '30 es C, el número de grados centesimales. Se pide en sexagesimales.' },
      ],
      dibujo: { datos: calc('?', '?', ''), estado: {} },
      revelar: { datos: calc('27', '30', '3π/20'), estado: {} },
      coincide: 'Coincide: 27 + 30 = 57, y 27° y 30ᵍ son el mismo ángulo.',
      noCoincide: 'Revisemos: los dos números tienen que ser del mismo ángulo, como 9 y 10.',
    },
    mira: {
      pieza: MD,
      datos: { objeto: 'calculadora', modos: [{ nombre: 'DEG', valor: [{ t: '?' }, { t: '27', paso: 2 }], color: 'h' }, { nombre: 'GRA', valor: [{ t: '?' }, { t: '30', paso: 2 }], color: 'i' }, { nombre: 'RAD', valor: [{ t: '' }, { t: '3π/20', paso: 3 }], color: 'f' }] },
      voz: 'Una sola letra, k, para los tres números.',
      pasos: [
        { estado: { paso: 0 }, texto: 'En el mismo ángulo, S/9 y C/10 dan el mismo número: k.', ecuacion: [junto([S, ' = 9k']), SEP, junto([Cc, ' = 10k'])] },
        { estado: { paso: 1 }, texto: 'La suma es 57: se reemplaza y sale k.', ecuacion: [junto('9k + 10k = 57'), FL, junto('k = 3')] },
        { estado: { paso: 2 }, texto: 'Con k = 3, el ángulo mide 27° o 30ᵍ.', ecuacion: [junto([S, ' = ', dH('27')]), SEP, junto([Cc, ' = ', dI('30')])] },
        { estado: { paso: 3 }, texto: 'El tercer número sale de la misma k.', ecuacion: junto([R, ' = ', { frac: ['πk', '20'] }, ' = ', dF('3π/20')]) },
      ],
    },
    regla: {
      texto: 'Los números S, C y R de un mismo ángulo guardan siempre la misma proporción. Por eso los tres se escriben con una sola letra, k.',
      ecuacion: [junto([{ frac: [S, '180'] }, ' = ', { frac: [Cc, '200'] }, ' = ', { frac: [R, 'π'] }]), SEP, junto([S, ' = 9k']), SEP, junto([Cc, ' = 10k']), SEP, junto([R, ' = ', { frac: ['πk', '20'] }])],
      condicion: 'S, C y R son los números de un mismo ángulo, con el mismo signo. La k es la misma.',
      voz: 'Tres números, una sola k.',
    },
    // Así se resuelve: de un número a los otros dos, con k. «Ahora tú» pide otra cosa: plantear una condición entre S
    // y C, simplificar una expresión o llegar a los radianes.
    resuelve: {
      pieza: MD,
      generar(sem) {
        const rr = azar(sem + 900), k = rr.ent(2, 15), desdeC = sem % 2 === 1;
        return {
          enunciado: desdeC ? ['Un ángulo mide ', dI(cen(10 * k)), '. Escribe sus tres números: ', S, ', ', Cc, ' y ', R, '.'] : ['Un ángulo mide ', dH(gr(9 * k)), '. Escribe sus tres números: ', S, ', ', Cc, ' y ', R, '.'],
          datos: [DS.scrDef, DS.scr],
          dibujo: { datos: desdeC ? calc('?', fg(10 * k), '?') : calc(fg(9 * k), '?', '?'), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden los tres números del ángulo: ', S, ' (sexagesimal), ', Cc, ' (centesimal) y ', R, ' (radianes).'] },
            { tipo: 'datos', texto: desdeC ? ['Se conoce uno: ', Cc, ` = ${fg(10 * k)}.`] : ['Se conoce uno: ', S, ` = ${fg(9 * k)}.`] },
            { tipo: 'regla', texto: 'Los tres números de un mismo ángulo se escriben con una sola k.', ecuacion: [junto([S, ' = 9k']), SEP, junto([Cc, ' = 10k']), SEP, junto([R, ' = ', { frac: ['πk', '20'] }])] },
            { tipo: 'cuentas', texto: 'Del número conocido sale k.', ecuacion: junto(desdeC ? [`k = ${fg(10 * k)} ÷ 10 = ${fg(k)}`] : [`k = ${fg(9 * k)} ÷ 9 = ${fg(k)}`]) },
            { tipo: 'aplica', texto: 'Con esa k se escriben los otros dos.', ecuacion: [junto(desdeC ? [S, ' = ', dH(fg(9 * k))] : [Cc, ' = ', dI(fg(10 * k))]), SEP, junto([R, ' = ', { frac: [`${fg(k)}π`, '20'] }, ' = ', dF(piFrac(k, 20))])],
              dibujo: { datos: calc(fg(9 * k), fg(10 * k), piFrac(k, 20)), estado: {} } },
            { tipo: 'sentido', texto: `Tiene sentido: el número centesimal, ${fg(10 * k)}, es mayor que el sexagesimal, ${fg(9 * k)}; y el de radianes es el más chico.` },
          ],
          respuesta: [S, ` = ${fg(9 * k)}, `, Cc, ` = ${fg(10 * k)}, `, R, ` = ${piFrac(k, 20)}`],
        };
      },
    },
    ahoraTu: {
      voz: 'Escribe S y C con k antes de usar la condición.',
      generar(sem) { return conCuatro([casoCondicion, casoExpresion, casoHallaR][sem % 3], azar(sem + 77)); },
    },
  };

  // ---------- Laboratorio (rehecho en la fase 3, 19 nov): una mesa por idea donde la mesa suma algo al juego ----------
  // Los `id` de las mesas y de sus controles se conservan (la colección guarda { mesa, valores }; docs/teoria.md §4b).
  // Mesa «dos-giros» (idea 1): dos giros seguidos del timón, lo que el juego de la idea no deja hacer.
  const dosGiros = (a, b) => ({ objeto: 'timon', giros: [a ? { mide: a, texto: gr(a), r: 98 } : null, b ? { mide: b, texto: gr(b), r: 124 } : null].filter(Boolean) });
  // Mesa «tres-escalas» (idea 4): el transportador de dos escalas; la lectura suma los radianes.
  // Mesa «arco-sale» (idea 4): la rueda con pitas de su radio; el ángulo en radianes es cuántos radios mide el arco.
  const radLab = g => `${piTxt(g)} rad`;
  const aCent = g => g * 10 / 9;                                // grados → grados centesimales
  const entero = x => Math.abs(x - Math.round(x)) < 1e-9;

  return {
    unidad: 'trigonometria.angulo-trigonometrico',
    version: '0.3.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-giro.js', '/nucleo/kit/piezas/trig-medida.js'],
    // Glosario del tema (docs/teoria.md §4d): las palabras que el curso estrena aquí. Las demás unidades las heredan.
    // Tabla de letras de la unidad (regla letras-datos del validador): cada letra, un solo significado. S, C y R están
    // en el glosario, con su símbolo.
    letras: { 'θ': 'el ángulo trigonométrico, con su signo', 'α': 'un ángulo de la figura', 'β': 'otro ángulo de la figura', 'γ': 'un tercer ángulo de la figura',
      x: 'la incógnita: un número, sin unidad', k: 'la constante de la fórmula general', n: 'número de vueltas', r: 'el radio' },
    // Glosario del tema (docs/teoria.md §4d): las palabras que el curso estrena aquí. Cada idea estrena de 2 a 4 con su
    // aproximación (`simple`) y tres ejemplos. Ninguna dice lo que la predicción de su idea pregunta.
    glosario: [
      { termino: 'ángulo trigonométrico', formas: ['ángulo trigonométrico', 'ángulos trigonométricos'],
        simple: 'Lo que gira algo desde donde estaba, con su sentido y sus vueltas.',
        def: 'Giro de un rayo desde su lado inicial hasta su lado final; tiene signo y puede pasar de una vuelta.',
        ejemplos: ['El timón gira una vuelta y cuarto hacia la izquierda: θ = 450°.', 'El minutero avanza media hora: θ = −180°.', 'Abres un caño con dos vueltas en sentido antihorario: θ = 720°.'],
        ver: ['lado inicial', 'sentido antihorario', 'vuelta'] },
      { termino: 'lado inicial', formas: ['lado inicial', 'lados iniciales'],
        simple: 'Donde está el rayo antes de girar: la línea de partida.',
        def: 'Posición de la que parte el rayo que gira. Desde ahí se mide el ángulo trigonométrico.',
        ejemplos: ['En el timón, la línea del centro a la cinta, cuando la cinta está arriba.', 'En el reloj, el minutero en las 12 al empezar la hora.', 'En una puerta, la puerta cerrada, pegada a su marco.'],
        ver: ['ángulo trigonométrico'] },
      // «lado final» ya lo define «Ángulos en posición normal» (un término por curso): aquí solo se usa.
      { termino: 'sentido antihorario', formas: ['sentido antihorario', 'antihorario', 'antihorarios'],
        simple: 'Girar al revés que las agujas del reloj: hacia la izquierda por arriba.',
        def: 'Giro contrario al de las agujas del reloj. Por convención, da ángulos positivos.',
        ejemplos: ['Girar el timón hacia la izquierda.', 'Abrir casi cualquier tapa rosca o la llave de un caño.', 'Los atletas dan la vuelta a la pista en sentido antihorario.'],
        ver: ['sentido horario'] },
      { termino: 'sentido horario', formas: ['sentido horario', 'horario', 'horarios'],
        simple: 'Girar como las agujas del reloj: hacia la derecha por arriba.',
        def: 'Giro como el de las agujas del reloj. Por convención, da ángulos negativos.',
        ejemplos: ['El minutero y el horario de un reloj.', 'Girar el timón hacia la derecha.', 'Cerrar la llave de un caño o apretar casi cualquier tornillo.'],
        ver: ['sentido antihorario'] },
      { termino: 'ángulos coterminales', formas: ['ángulos coterminales', 'coterminales', 'coterminal'],
        def: 'Giros distintos que terminan en el mismo lado: se diferencian en un número entero de vueltas.',
        ejemplos: ['390° y 30° difieren en 360°, una vuelta.', '−60° y 300° terminan en el mismo lado.', '45° y 765° difieren en dos vueltas.'], ver: ['vuelta'] },
      { termino: 'grado sexagesimal', simbolo: '°', formas: ['grado sexagesimal', 'grados sexagesimales', 'sexagesimal', 'sexagesimales'],
        simple: 'El grado de siempre: la vuelta partida en 360 pedazos iguales.',
        def: 'Unidad de giro que parte la vuelta en 360 partes iguales.',
        ejemplos: ['Un cuarto de vuelta mide 90°.', 'Los tres ángulos de un triángulo suman 180°.', 'El minutero gira 6° en cada minuto.'],
        ver: ['minuto sexagesimal', 'grado centesimal'] },
      { termino: 'grado centesimal', simbolo: 'ᵍ', formas: ['grado centesimal', 'grados centesimales', 'centesimal', 'centesimales'],
        simple: 'Otro grado, más chico: la vuelta partida en 400 pedazos iguales.',
        def: 'Unidad de giro que parte la vuelta en 400 partes iguales. Es más chica que el grado sexagesimal.',
        ejemplos: ['Un cuarto de vuelta mide 100ᵍ.', 'Media vuelta mide 200ᵍ.', '10ᵍ abren lo mismo que 9°.'],
        ver: ['grado sexagesimal', 'radián'] },
      { termino: 'minuto sexagesimal', simbolo: '′', formas: ['minuto sexagesimal', 'minutos sexagesimales'],
        simple: 'Un pedacito de grado: en un grado caben 60.',
        def: 'Sexagésima parte de un grado sexagesimal: 60 de ellos forman 1°.',
        ejemplos: ['2° 15′ es 2,25°: 15 de las 60 partes.', 'Medio grado son 30′.', '75′ hacen 1° 15′.'],
        ver: ['grado sexagesimal', 'segundo sexagesimal'] },
      { termino: 'segundo sexagesimal', simbolo: '″', formas: ['segundo sexagesimal', 'segundos sexagesimales'],
        simple: 'Un pedacito de minuto: en un minuto caben 60.',
        def: 'Sexagésima parte de un minuto sexagesimal: un grado tiene 3600.',
        ejemplos: ['Un grado tiene 60 · 60 = 3600″.', '36″ son una centésima de grado.', '1′ 30″ son 90″.'],
        ver: ['minuto sexagesimal'] },
      { termino: 'minuto centesimal', simbolo: 'ᵐ', formas: ['minuto centesimal', 'minutos centesimales'],
        simple: 'Un pedacito de grado centesimal: en un grado caben 100.',
        def: 'Centésima parte de un grado centesimal. Cada uno se parte en 100 segundos centesimales (ˢ).',
        ejemplos: ['2ᵍ 15ᵐ es 2,15ᵍ.', '25ᵐ son un cuarto de grado centesimal.', '300ᵐ hacen 3ᵍ.'],
        ver: ['grado centesimal'] },
      { termino: 'radián', simbolo: 'rad', formas: ['radián', 'radianes'],
        simple: 'El ángulo que abarca un arco tan largo como el radio.',
        // Lo usan otras unidades como herramienta (Física, «Movimiento circular»): la definición dice qué mide.
        def: 'Ángulo central cuyo arco mide lo mismo que el radio. Su medida cuenta cuántos radios caben en el arco.',
        ejemplos: ['Una pita del largo del radio, acostada sobre la llanta, abarca 1 rad.', 'Un radián mide unos 57,3°.', 'Un arco de tres radios abarca 3 rad, en una rueda chica o grande.'],
        ver: ['arco', 'radio'] },
      { termino: 'radio', simbolo: 'r', formas: ['radio', 'radios'],
        simple: 'Lo que hay del centro al borde de un círculo.',
        def: 'Segmento que va del centro a la circunferencia; también se llama así a su largo.',
        ejemplos: ['Cada rayo de una rueda de bicicleta es un radio.', 'En un reloj de pared, el minutero es casi un radio.', 'Si el diámetro mide 10 cm, el radio mide 5 cm.'],
        ver: ['circunferencia'] },
      { termino: 'fórmula general de conversión', formas: ['fórmula general'],
        simple: 'La relación que amarra los tres números de un mismo ángulo.',
        def: 'Relación entre los números S, C y R de un mismo ángulo: S/180 = C/200 = R/π.',
        ejemplos: ['Con S = 54 sale C = 60.', 'S = 9k, C = 10k y R = πk/20.', 'En media vuelta: 180/180 = 200/200 = π/π.'],
        ver: ['número de grados sexagesimales', 'número de grados centesimales', 'número de radianes'] },
      { termino: 'número de grados sexagesimales', simbolo: 'S', formas: ['número de grados sexagesimales'],
        simple: 'El número que va delante del «°» en la medida de un ángulo.',
        def: 'Cuántos grados sexagesimales mide un ángulo. En la fórmula general se llama S.',
        ejemplos: ['En 45°, S = 45.', 'En un ángulo recto, S = 90.', 'En π/5 rad, S = 36.'],
        ver: ['fórmula general de conversión'] },
      { termino: 'número de grados centesimales', simbolo: 'C', formas: ['número de grados centesimales'],
        simple: 'El número que va delante de la «ᵍ» en la medida de un ángulo.',
        def: 'Cuántos grados centesimales mide un ángulo. En la fórmula general se llama C.',
        ejemplos: ['En 50ᵍ, C = 50.', 'En un ángulo recto, C = 100.', 'En 45°, C = 50.'],
        ver: ['fórmula general de conversión'] },
      { termino: 'número de radianes', simbolo: 'R', formas: ['número de radianes'],
        simple: 'El número que va delante de «rad» en la medida de un ángulo.',
        def: 'Cuántos radianes mide un ángulo. En la fórmula general se llama R (no es un radio).',
        ejemplos: ['En π/4 rad, R = π/4.', 'En media vuelta, R = π.', 'En 2 rad, R = 2.'],
        ver: ['fórmula general de conversión'] },
      { termino: 'vuelta', def: 'Giro completo que regresa al lado inicial: 360°, 400ᵍ o 2π rad.',
        ejemplos: ['El minutero da una vuelta cada hora.', 'Media vuelta deja el rayo apuntando al lado contrario.', 'Una vuelta y media del timón son 540°.'], ver: ['ángulos coterminales'] },
      { termino: 'circunferencia', def: 'Línea cerrada cuyos puntos están todos a la misma distancia de un centro.',
        ejemplos: ['El borde de una moneda.', 'La llanta de una rueda, vista de frente.', 'El aro de un timón.'], ver: ['radio', 'arco'] },
      { termino: 'arco', def: 'Trozo de circunferencia entre dos puntos. En trigonometría también nombra al ángulo que lo abarca.',
        ejemplos: ['El pedazo de llanta que cubre una pita.', 'El borde curvo de una tajada de pizza.', 'Lo que recorre la punta del minutero en diez minutos.'], ver: ['circunferencia', 'radián'] },
    ],
    // Laboratorio (docs/teoria.md §4b): tres mesas sin preguntas. La primera compara dos giros a la vez (lo que la
    // idea 1 solo deja ver en la predicción); la segunda abre el rango a giros negativos de 5 en 5; la tercera
    // invierte el radián: se fija el ángulo y el radio, y el arco sale de ellos.
    // Laboratorio (docs/teoria.md §4b): tres mesas sin preguntas, cada una de una idea. La primera junta dos giros del
    // timón; la segunda escribe un giro en los tres sistemas; la tercera mide el ángulo de una rueda contando radios.
    laboratorio: [
      {
        id: 'dos-giros', titulo: 'Dos giros seguidos del timón', pieza: OB,
        consigna: 'Gira el timón dos veces seguidas, hacia cualquier lado. La lectura suma los dos giros con su signo.',
        controles: [
          { id: 'a', etiqueta: 'Primer giro', color: 'c-h', min: -300, max: 300, paso: 30, inicio: 120, unidad: '°', decimales: 0 },
          { id: 'b', etiqueta: 'Segundo giro', color: 'c-h', min: -300, max: 300, paso: 30, inicio: -210, unidad: '°', decimales: 0 },
        ],
        dibujo: val => ({ datos: dosGiros(val.a, val.b), estado: {} }),
        lectura: val => junto([th, ' = ', dH(gr(val.a)), val.b < 0 ? ' + (' : ' + ', dH(gr(val.b)), val.b < 0 ? ')' : '', ' = ', dH(gr(val.a + val.b)),
          val.a + val.b ? `: ${vueltasTxt(val.a + val.b)}, ${sentidoDe(val.a + val.b)}` : ': la cinta vuelve arriba']),
        // Retos comprobados (docs/teoria.md §4d): la suma con signo es la misma que escribe la lectura.
        invitaciones: [
          { texto: 'Deja la cinta otra vez arriba con dos giros que no sean cero.',
            logrado: val => val.a !== 0 && val.b !== 0 && val.a + val.b === 0,
            bien: 'El segundo giro deshace el primero: mismo tamaño, signo contrario.' },
          { texto: 'Consigue un total de 180° con el segundo giro en sentido horario.',
            logrado: val => val.b < 0 && val.a + val.b === 180,
            bien: 'El primero tiene que pasarse de 180°: el segundo le quita lo que sobra.' },
          { texto: 'Pasa de una vuelta en total, con dos giros menores que una vuelta.',
            logrado: val => Math.abs(val.a + val.b) > 360,
            bien: 'Solo se puede con dos giros del mismo sentido: juntos pasan de 360°.' },
          { texto: 'Guarda dos casos con el mismo total y giros distintos.',
            logrado: (val, guardados) => guardados.some(x => guardados.some(y => x.a !== y.a && x.a + x.b === y.a + y.b)),
            bien: 'El total no dice el camino: solo dónde quedó la cinta y en qué sentido.' },
        ],
        arrastres: [{ id: 'cinta', etiqueta: 'cinta del timón: cambia el segundo giro', color: 'c-h',
          donde: val => { const q = TG().geometria(dosGiros(val.a, val.b)).marca; return { x: q[0], y: q[1] }; },
          mover: (pt, val) => ({ b: TG().anguloDe(dosGiros(val.a, val.b), pt, { cerca: val.a + val.b }) - val.a }) }],
      },
      {
        id: 'tres-escalas', titulo: 'Un giro en tres sistemas', pieza: OB,
        consigna: 'Gira la aguja del transportador hacia cualquier lado. La lectura escribe el mismo giro en grados, grados centesimales y radianes.',
        controles: [{ id: 'g', etiqueta: 'Giro de la aguja', color: 'c-h', min: -360, max: 360, paso: 5, inicio: 135, unidad: '°', decimales: 0 }],
        dibujo: val => ({ datos: transp(val.g, val.g ? enSex(gr(val.g)) : {}), estado: {} }),
        lectura: val => junto([th, ' = ', dH(gr(val.g)), ' = ', dI(cen(f(aCent(val.g), 2))), ' = ', dF(radLab(val.g))]),
        invitaciones: [
          { texto: 'Haz que el giro mida exactamente −150ᵍ.',
            logrado: val => entero(aCent(val.g)) && Math.round(aCent(val.g)) === -150,
            bien: '−150ᵍ son −135°: el grado centesimal es más chico, por eso el número crece.' },
          { texto: 'Consigue un giro de π/2 radianes en sentido horario.',
            logrado: val => piTxt(val.g) === '−π/2',
            bien: 'Un cuarto de vuelta hacia la derecha: −90°, −100ᵍ y −π/2 rad a la vez.' },
          { texto: 'Busca el menor giro positivo que dé un número entero de grados centesimales.',
            // El menor de la grilla (de 5 en 5): ningún giro positivo anterior da un entero.
            logrado: val => val.g > 0 && entero(aCent(val.g))
              && Array.from({ length: val.g / 5 - 1 }, (_, k) => 5 * (k + 1)).every(x => !entero(aCent(x))),
            bien: '45° = 50ᵍ. Hace falta un múltiplo de 9 para que la cuenta salga entera.' },
          { texto: 'Encuentra un giro que se escriba con el mismo número en grados y en centesimales.',
            logrado: val => Math.abs(aCent(val.g) - val.g) < 1e-9,
            bien: 'Solo el cero: en cualquier otro giro, los centesimales dan un número mayor.' },
          { texto: 'Guarda dos giros que se diferencien en 100ᵍ exactos.',
            logrado: (val, guardados) => guardados.some(x => guardados.some(y => Math.abs(aCent(x.g) - aCent(y.g) - 100) < 1e-9)),
            bien: '100ᵍ de diferencia son 90°: un cuarto de vuelta, en cualquier parte del giro.' },
        ],
        arrastres: [{ id: 'borde', etiqueta: 'punta de la aguja del transportador', color: 'c-h',
          donde: val => { const q = TG().geometria(transp(val.g)).marca; return { x: q[0], y: q[1] }; },
          mover: (pt, val) => ({ g: TG().anguloDe(transp(val.g), pt, { cerca: val.g }) }) }],
      },
      {
        id: 'arco-sale', titulo: 'Contar radios sobre la llanta', pieza: MD,
        consigna: ['Elige cuántas pitas del largo del radio ', r, ' se acuestan sobre la llanta, y el tamaño de la rueda. ', th, ' es el ángulo que abarcan.'],
        controles: [
          { id: 't', etiqueta: 'Pitas sobre la llanta', color: 'c-o', min: 0.25, max: 6.25, paso: 0.25, inicio: 1, decimales: 2 },
          { id: 'r', etiqueta: 'r, el radio de la rueda', color: 'c-o', min: 20, max: 40, paso: 10, inicio: 30, unidad: 'cm', decimales: 0 },
        ],
        dibujo: val => ({ datos: ruedaCon(val.r, val.t, radTxt(f(val.t))), estado: {} }),
        lectura: val => junto([`arco = ${f(val.t)} ${val.t === 1 ? 'radio' : 'radios'}`, FL, th, ' = ', dF(radTxt(f(val.t))), ' ≈ ', dH(`${f(val.t * 180 / Math.PI, 1)}°`)]),
        invitaciones: [
          { texto: 'Con la rueda más chica, abarca 1,5 radianes.',
            logrado: val => val.r === 20 && val.t === 1.5,
            bien: 'Una pita y media. Con la rueda grande serían las mismas: el ángulo no cambia.' },
          { texto: 'Acércate a media vuelta tanto como puedas, sin pasarte.',
            logrado: val => val.t === 3,
            bien: 'Media vuelta mide π ≈ 3,14 radios: con 3 pitas falta un poquito.' },
          { texto: 'Lleva el arco casi a la vuelta completa, sin cerrarla.',
            logrado: val => val.t < 2 * Math.PI && 2 * Math.PI - val.t < 0.5,
            bien: 'Con 6 radios de arco falta un pedacito: la vuelta mide 2π ≈ 6,28 radios.' },
          { texto: 'Guarda dos casos con las mismas pitas y ruedas de distinto tamaño.',
            logrado: (val, guardados) => guardados.some(x => guardados.some(y => x.t === y.t && x.r !== y.r)),
            bien: 'Rueda más grande, pitas más largas: el ángulo en radianes es el mismo.' },
        ],
        arrastres: [{ id: 'fin-arco', etiqueta: 'punta de la última pita: se corre por la llanta', color: 'c-o',
          donde: val => { const q = TM().geometria(ruedaCon(val.r, val.t, '')).punta; return { x: q[0], y: q[1] }; },
          mover: (pt, val) => { const c = TM().constantes.RC, ang = Math.atan2(c[1] - pt.y, pt.x - c[0]);
            const vuelta = ang + (ang < 0 ? 2 * Math.PI : 0), cerca = vuelta + 2 * Math.PI * Math.round((val.t - vuelta) / (2 * Math.PI));
            return { t: Math.max(0.25, Math.min(6.25, Math.round(cerca * 4) / 4)) }; } }],
      },
    ],
    historia: {
      texto: 'Los astrónomos babilonios contaban en base sesenta, y la astronomía griega heredó la vuelta de 360 partes; de ahí vienen nuestros grados, minutos y segundos. Mucho después apareció otra idea: medir el giro comparando el arco con el radio. Grados y radianes nombran el mismo giro con escalas distintas.',
      pregunta: '¿Por qué una vuelta tendría 360 partes y no 100?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Babylonian numerals», MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Babylonian_numerals/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Fase 3 (19 nov):
    // las tres mesas se rehicieron para su idea; ninguna queda en «Más mesas del tema».
    laboratorioIdeas: {
      'dos-giros': ['sentido-signo'],
      'tres-escalas': ['radian'],
      'arco-sale': ['radian'],
    },
    ideas: [sentido, escalas, minutos, radian, formula],
  };
});
