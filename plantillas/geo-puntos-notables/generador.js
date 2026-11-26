/*
 * Generador «Puntos notables del triángulo»: la práctica de las seis ideas de geometria.puntos-notables
 * (contenido/teoria/geometria/puntos-notables.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['geo-puntos-notables']) y en Node (require). Propuesta: docs/etapa9/propuesta-geometria.md §7a.
 *
 * Tipos por idea (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   baricentro    ag (1): AG desde la mediana · am (2): la mediana desde GM · area (2): un triángulo de G · hip (3): BG en
 *                 un triángulo rectángulo desde su hipotenusa
 *   circuncentro  rrect (1): R de un rectángulo · boc (1): el central BOC · obc (2): el ángulo OBC · treinta (3): R con
 *                 m∠A = 30° y BC
 *   incentro      tan (1): la tangente s − a · inradio (2): r = S/s en un rectángulo · lado (2): un lado desde las
 *                 tangentes · banderin (3): r de un isósceles
 *   ortocentro    bhc (1): el ángulo BHC · hbc (2): el ángulo HBC · ap (2): la altura por Pitágoras · bic (3): del
 *                 ortocentro al incentro
 *   excentro      at (1): la tangente AT = s · bt (2): BT = s − c · bec (2): el ángulo BEC · becx (3): BEC con una
 *                 ecuación
 *   euler         gh (1): GH desde OG · og (2): OG desde OH · nueve (2): el radio de nueve puntos · rect (3): GH en un
 *                 rectángulo desde sus catetos
 * Todos se resuelven con el texto (sin figura): la práctica y el papel no llevan dibujo.
 *
 * Datos (punto 13; molde §4): una línea por dato, las mismas de la teoría, nunca el paso hecho. Colores: lo pedido y su
 * resultado en violeta, solo en la solución. Errores: hipótesis de aula (GE-PN, GE-CC, GE-IN, GE-OR, GE-EX, GE-EU;
 * docs/investigacion/geometria-ideas-erroneas.md, «Puntos notables (26 nov)»). Ninguna explicación nombra una
 * alternativa por su letra; cada una empieza por lo que el alumno hizo bien o dice qué es el valor que dio. Cuentas
 * comprobadas con un script aparte (casos.json, «verificacion») y en generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'geo-puntos-notables';
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const cm = x => `${f(x)} cm`, cm2 = x => `${f(x)} cm²`, gr = x => `${f(x)}°`;
  const er = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const existe = (a, b, c) => a < b + c && b < a + c && c < a + b;
  const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25]];

  const D = {
    bar: 'El baricentro G parte cada mediana en 2 : 1 desde el vértice: AG = 2 · GM.',
    seis: 'Las tres medianas parten el triángulo en seis triángulos de igual área.',
    hip: 'En un triángulo rectángulo, la mediana que va a la hipotenusa mide la mitad de ella.',
    pit: 'Pitágoras: en un triángulo rectángulo, cateto² + cateto² = hipotenusa².',
    circ: 'El circuncentro O es el corte de las mediatrices: OA = OB = OC = R, el circunradio.',
    orect: 'En un triángulo rectángulo, el circuncentro es el punto medio de la hipotenusa.',
    cent: 'Un ángulo central mide el doble del inscrito que abarca el mismo arco.',
    suma: 'Los tres ángulos de un triángulo suman 180°.',
    isos: 'En un triángulo isósceles, los dos ángulos de la base miden igual.',
    semi: 'Semiperímetro: s = (a + b + c) ÷ 2, la mitad del perímetro.',
    tans: 'Desde A, las dos tangentes a la inscrita miden s − a, con a = BC y s el semiperímetro.',
    tan: 'Las dos tangentes trazadas desde un mismo punto a una circunferencia miden igual.',
    srs: 'Área del triángulo: S = r · s, con r el radio de la inscrita y s el semiperímetro.',
    area: 'Área de un triángulo: base por altura, entre 2.',
    iso: 'En un triángulo isósceles, la altura que va a la base cae en su punto medio.',
    orto: 'El ortocentro H es el corte de las alturas: cada altura es perpendicular a la recta del lado opuesto.',
    bhc: 'En un triángulo acutángulo, m∠BHC = 180° − m∠A.',
    alth: 'La recta que une un vértice con el ortocentro es la altura de ese vértice.',
    bic: 'Las bisectrices de B y C se cortan en el incentro I con m∠BIC = 90° + m∠A ÷ 2.',
    ats: 'La exinscrita relativa a BC toca la prolongación de AB en T, y AT = s, el semiperímetro.',
    bec: 'Las bisectrices exteriores de B y C se cortan en E con m∠BEC = 90° − m∠A ÷ 2.',
    eul: 'Recta de Euler: O, G y H están en una recta, con G entre O y H y GH = 2 · OG.',
    nueve: 'La circunferencia de nueve puntos tiene radio R ÷ 2, con R el radio de la circunscrita.',
    cuad: 'Los cuatro ángulos de un cuadrilátero suman 360°.',
    opv: 'Dos ángulos opuestos por el vértice miden igual.',
    exc: 'El excentro E relativo a BC es el corte de la bisectriz interior de A con las exteriores de B y C.',
    extb: 'Un ángulo interior y su exterior suman 180°; la bisectriz exterior parte el exterior en dos iguales.',
  };

  // ---------- Idea 1: baricentro ----------
  function ag(rng) {
    const k = rng.entero(2, 15), AM = 3 * k;
    return { enunciado: [`En el triángulo ABC, la mediana AM mide ${AM} cm y G es el baricentro.`], pregunta: ['¿Cuánto mide AG?'],
      datos: [D.bar], correcta: 2 * k, fmt: cm,
      errores: [er('GE-PN2', AM / 2, 'Es cierto que G está sobre AM, pero no en su mitad: G parte la mediana en 2 : 1 desde A.'),
        er('GE-PN3', k, `Partir AM en tres está bien, pero ${k} cm es GM, el tramo corto; AG toma dos partes.`),
        er('GE-PN4', 3 * AM / 4, 'Partir la mediana está bien, pero G la parte en 2 : 1, no en 3 : 1.'),
        er('GE-PN5', AM, `${AM} cm es la mediana entera, y AG es solo una parte de ella.`)],
      solucion: [[`AM tiene tres partes iguales de ${AM} ÷ 3 = ${k} cm, y AG toma dos de ellas.`], ['AG = ', v('x', cm(2 * k)), '.']], _datos: { tipo: 'ag', idea: 'baricentro', nivel: 1, AM } };
  }
  function am(rng) {
    const k = rng.entero(2, 14);
    return { enunciado: [`En el triángulo ABC, G es el baricentro y está sobre la mediana AM. GM = ${k} cm.`], pregunta: ['¿Cuánto mide AM?'],
      datos: [D.bar], correcta: 3 * k, fmt: cm,
      errores: [er('GE-PN5', 2 * k, `AG = ${2 * k} cm está bien; falta sumarle GM para la mediana entera.`),
        er('GE-PN3', 1.5 * k, 'Sumar los tramos está bien, pero AG es el doble de GM, no su mitad.'),
        er('GE-PN4', 4 * k, 'Sumar los tramos está bien, pero AG = 2 · GM, no 3 · GM.'),
        er('GE-PN2', k, `${k} cm es GM, el tramo corto; la mediana también incluye AG.`)],
      solucion: [[`AG es el doble de GM: AG = 2 · ${k} = ${2 * k} cm.`], [`La mediana es la suma de los dos tramos: AM = ${2 * k} + ${k} = `, v('x', cm(3 * k)), '.']], _datos: { tipo: 'am', idea: 'baricentro', nivel: 2, GM: k } };
  }
  function area(rng) {
    const S = 6 * rng.entero(3, 20), cual = rng.elegir(['BGC', 'BGM']);
    const ok = cual === 'BGC' ? S / 3 : S / 6;
    return { enunciado: [`El triángulo ABC tiene ${S} cm² de área, G es su baricentro y M es el punto medio de BC.`], pregunta: [`¿Cuál es el área del triángulo ${cual}?`],
      datos: [D.seis], correcta: ok, fmt: cm2,
      errores: [er('GE-PN6', cual === 'BGC' ? S / 6 : S / 3, cual === 'BGC' ? 'Usar los seis pedazos está bien, pero BGC tiene dos de ellos.' : 'Usar los seis pedazos está bien, pero BGM es uno solo.'),
        er('GE-PN6', S / 2, 'Una sola mediana parte el área por la mitad, pero aquí hay tres medianas.'),
        er('GE-PN6', S / 4, 'Repartir el área está bien, pero las medianas dejan seis pedazos, no cuatro.'),
        er('GE-PN6', 2 * S / 3, 'Dos tercios del área son cuatro de los seis pedazos; cuenta cuántos tiene este triángulo.')],
      solucion: [[`Las medianas dejan seis pedazos de ${S} ÷ 6 = ${f(S / 6)} cm², y ${cual} ${cual === 'BGC' ? 'tiene dos de ellos' : 'es uno de ellos'}.`], ['Área = ', v('x', cm2(ok)), '.']], _datos: { tipo: 'area', idea: 'baricentro', nivel: 2, S, cual } };
  }
  function hip(rng) {
    const [p, q, h] = rng.elegir(TRIPLES), k = rng.elegir([1, 2, 3]);
    const a = p * k, b = q * k, c = h * k;
    if ((c / 3) * 100 % 1) return hip(rng);
    return { enunciado: [`Un triángulo ABC es rectángulo en B, con catetos AB = ${a} cm y BC = ${b} cm. G es el baricentro.`], pregunta: ['¿Cuánto mide BG?'],
      datos: [D.pit, D.hip, D.bar], correcta: c / 3, fmt: cm,
      errores: [er('GE-PN5', c / 2, `La mediana BN = ${f(c / 2)} cm está bien, pero BG es solo dos tercios de ella.`),
        er('GE-PN7', 2 * c / 3, 'Tomar dos tercios está bien, pero de la mediana BN, no de la hipotenusa.'),
        er('GE-PN3', c / 6, `Partir BN en tres está bien, pero ${f(c / 6)} cm es GN, el tramo corto.`),
        er('GE-PN8', c, `${c} cm es la hipotenusa AC, no la distancia de B a G.`)],
      solucion: [[`AC² = ${a * a} + ${b * b} = ${c * c}, así que AC = ${c} cm, y la mediana a la hipotenusa mide BN = ${f(c / 2)} cm.`], ['BG = 2 · (', f(c / 2), ' ÷ 3) = ', v('x', cm(c / 3)), '.']], _datos: { tipo: 'hip', idea: 'baricentro', nivel: 3, a, b } };
  }
  // ---------- Idea 2: circuncentro ----------
  function rrect(rng) {
    const [p, q, h] = rng.elegir(TRIPLES), k = rng.elegir([1, 2, 3]), a = p * k, b = q * k, c = h * k;
    return { enunciado: [`Un triángulo rectángulo tiene catetos de ${a} cm y ${b} cm.`], pregunta: ['¿Cuánto mide su circunradio?'],
      datos: [D.pit, D.orect], correcta: c / 2, fmt: cm,
      errores: [er('GE-CC1', c, `La hipotenusa, ${c} cm, está bien, pero es el diámetro: R es su mitad.`),
        er('GE-CC2', (a + b) / 2, 'Partir por la mitad está bien, pero R es la mitad de la hipotenusa, no de la suma de los catetos.'),
        er('GE-CC3', c / 3, 'Usar la hipotenusa está bien, pero O no la parte en tercios: está en su punto medio.'),
        er('GE-CC2', b / 2, 'Tomar una mitad está bien, pero R es la mitad de la hipotenusa, no la de un cateto.')],
      solucion: [[`Con Pitágoras, la hipotenusa cumple ${a * a} + ${b * b} = ${c * c}, así que mide ${c} cm.`], ['R = ', c, ' ÷ 2 = ', v('x', cm(c / 2)), '.']], _datos: { tipo: 'rrect', idea: 'circuncentro', nivel: 1, a, b } };
  }
  function boc(rng) {
    const A = rng.entero(20, 85);
    return { enunciado: [`En el triángulo acutángulo ABC, m∠A = ${A}° y O es el circuncentro.`], pregunta: ['¿Cuánto mide el ángulo BOC?'],
      datos: [D.circ, D.cent], correcta: 2 * A, fmt: gr,
      errores: [er('GE-CC4', A, 'Ubicar el ángulo está bien, pero el central mide el doble del inscrito, no lo mismo.'),
        er('GE-CC5', 180 - A, '180° − A es el ángulo entre dos alturas; aquí los lados de BOC son radios.'),
        er('GE-CC5', 90 + A / 2, '90° + A/2 es el ángulo entre dos bisectrices; aquí los lados de BOC son radios.'),
        er('GE-CC6', 90 - A, `${90 - A}° es el ángulo OBC, pero piden el ángulo central BOC.`)],
      solucion: [['∠BOC es central sobre el arco BC y ∠A es inscrito sobre el mismo arco, así que BOC mide el doble.'], [`m∠BOC = 2 · ${A}° = `, v('x', gr(2 * A)), '.']], _datos: { tipo: 'boc', idea: 'circuncentro', nivel: 1, A } };
  }
  function obc(rng) {
    const A = rng.entero(20, 80);
    return { enunciado: [`En el triángulo acutángulo ABC, m∠A = ${A}° y O es el circuncentro.`], pregunta: ['¿Cuánto mide el ángulo OBC?'],
      datos: [D.cent, D.circ, D.isos, D.suma], correcta: 90 - A, fmt: gr,
      errores: [er('GE-CC6', 2 * A, `${2 * A}° es m∠BOC, el ángulo central; falta repartir lo que queda entre los dos ángulos iguales de BOC.`),
        er('GE-CC4', (180 - A) / 2, 'Usar el isósceles BOC está bien, pero el central mide 2A, no A.'),
        er('GE-CC6', A, 'Buscar el ángulo en B está bien, pero OBC no mide lo mismo que el ángulo A.'),
        er('GE-CC5', 90 - A / 2, '90° − A/2 es el ángulo entre dos bisectrices exteriores; aquí OB y OC son radios iguales.')],
      solucion: [[`m∠BOC = 2 · ${A}° = ${2 * A}°, y como OB = OC, el triángulo BOC es isósceles.`], [`m∠OBC = (180° − ${2 * A}°) ÷ 2 = `, v('x', gr(90 - A)), '.']], _datos: { tipo: 'obc', idea: 'circuncentro', nivel: 2, A } };
  }
  function treinta(rng) {
    const BC = 2 * rng.entero(3, 15);
    return { enunciado: [`En el triángulo acutángulo ABC, m∠A = 30° y BC = ${BC} cm.`], pregunta: ['¿Cuánto mide su circunradio?'],
      datos: [D.cent, D.circ, D.isos, D.suma], correcta: BC, fmt: cm,
      errores: [er('GE-CC7', BC / 2, 'La mitad de BC valdría con A recto; aquí A mide 30°.'),
        er('GE-CC1', 2 * BC, `${2 * BC} cm es el diámetro, el doble de R.`),
        er('GE-CC3', 2 * BC / 3, 'Los dos tercios vienen del baricentro; aquí O equidista de B y de C.'),
        er('GE-CC7', 3 * BC / 2, 'Usar BC está bien, pero el triángulo BOC es equilátero, así que R mide lo mismo que BC.')],
      solucion: [['m∠BOC = 2 · 30° = 60° y OB = OC, así que el triángulo BOC es equilátero.'], ['R mide lo mismo que BC: R = ', v('x', cm(BC)), '.']], _datos: { tipo: 'treinta', idea: 'circuncentro', nivel: 3, BC } };
  }
  // ---------- Idea 3: incentro ----------
  function lados(rng) {
    for (;;) {
      const a = rng.entero(5, 16), b = rng.entero(5, 16), c = rng.entero(5, 16);
      if ((a + b + c) % 2 || !existe(a, b, c) || new Set([a, b, c]).size < 3) continue;
      return { a, b, c, s: (a + b + c) / 2 };
    }
  }
  function tan(rng) {
    const { a, b, c, s } = lados(rng);
    return { enunciado: [`En el triángulo ABC, AB = ${c} cm, AC = ${b} cm y BC = ${a} cm. La inscrita toca AB en F.`], pregunta: ['¿Cuánto mide AF?'],
      datos: [D.semi, D.tans], correcta: s - a, fmt: cm,
      errores: [er('GE-IN1', c / 2, 'Buscar el punto de contacto está bien, pero F no es el punto medio de AB.'),
        er('GE-IN2', s - b, `Usar s está bien, y s = ${s}, pero a s se le resta el lado que está frente a A, que es BC.`),
        er('GE-IN3', s, `${s} cm es el semiperímetro, pero falta restarle BC.`),
        er('GE-IN1', a / 2, 'Mirar el lado de enfrente está bien, pero se le resta a s, no se parte por la mitad.')],
      solucion: [[`El semiperímetro es s = ${a + b + c} ÷ 2 = ${s}.`], [`La tangente desde A es s menos BC: AF = ${s} − ${a} = `, v('x', cm(s - a)), '.']], _datos: { tipo: 'tan', idea: 'incentro', nivel: 1, a, b, c } };
  }
  function inradio(rng) {
    const [p, q, h] = rng.elegir(TRIPLES), k = rng.elegir([1, 2]), a = p * k, b = q * k, c = h * k, S = a * b / 2, s = (a + b + c) / 2;
    return { enunciado: [`Un triángulo rectángulo tiene catetos de ${a} cm y ${b} cm, e hipotenusa de ${c} cm.`], pregunta: ['¿Cuánto mide el radio de su inscrita?'],
      datos: [D.area, D.semi, D.srs], correcta: S / s, fmt: cm,
      errores: [er('GE-IN4', S / (2 * s), 'Usar S = r · s está bien, pero s es la mitad del perímetro, no el perímetro.'),
        er('GE-IN5', c / 2, `${f(c / 2)} cm es el circunradio, pero piden el radio de la inscrita.`),
        er('GE-IN6', 2 * S / s, 'Dividir entre s está bien, pero el área es base por altura entre 2.'),
        er('GE-IN3', s, `${f(s)} cm es el semiperímetro, no el radio.`)],
      solucion: [[`El área es S = ${a} · ${b} ÷ 2 = ${S}, y s = ${s}.`], [`Como S = r · s, r = ${S} ÷ ${s} = `, v('x', cm(S / s)), '.']], _datos: { tipo: 'inradio', idea: 'incentro', nivel: 2, a, b, c } };
  }
  function lado(rng) {
    const bd = rng.entero(2, 9), dc = rng.entero(2, 9), af = rng.entero(2, 9);
    return { enunciado: [`La inscrita del triángulo ABC toca BC en D, AB en F y AC en K. BD = ${bd} cm, DC = ${dc} cm y AB = ${bd + af} cm.`], pregunta: ['¿Cuánto mide AC?'],
      datos: [D.tan], correcta: af + dc, fmt: cm,
      errores: [er('GE-IN7', bd + dc, `${bd + dc} cm es BC, pero AC se arma con AK y KC.`),
        er('GE-IN7', bd + af + dc, 'Usar CK = CD está bien, pero a AB hay que restarle BF antes de sumar.'),
        er('GE-IN7', af, `AK = ${af} cm está bien, pero falta sumarle KC.`),
        er('GE-IN7', bd + af, `${bd + af} cm es AB, y AC no tiene por qué medir lo mismo.`)],
      solucion: [[`BF = BD = ${bd}, así que AF = AK = ${af}; además, CK = CD = ${dc}.`], [`AC = ${af} + ${dc} = `, v('x', cm(af + dc)), '.']], _datos: { tipo: 'lado', idea: 'incentro', nivel: 2, bd, dc, af } };
  }
  function banderin(rng) {
    const [p, q, h] = rng.elegir([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), k = rng.elegir([1, 2]);
    const m = p * k, alt = q * k, L = h * k, S = m * alt, s = L + m;
    if ((S / s) * 100 % 1) return banderin(rng);
    return { enunciado: [`Un banderín isósceles tiene AB = AC = ${L} cm y BC = ${2 * m} cm.`], pregunta: ['¿Cuánto mide el radio de su circunferencia inscrita?'],
      datos: [D.iso, D.pit, D.area, D.semi, D.srs], correcta: S / s, fmt: cm,
      errores: [er('GE-IN8', alt, `${alt} cm es la altura, y el radio de la inscrita es menor.`),
        er('GE-IN8', m, `${m} cm es la mitad de BC, no el radio.`),
        er('GE-IN4', S / (2 * s), 'Usar S = r · s está bien, pero s es la mitad del perímetro, no el perímetro.'),
        er('GE-IN6', S / (2 * m), 'Dividir el área está bien, pero se divide entre s, no entre BC.')],
      solucion: [[`La altura cae en el punto medio de BC: ${L * L} − ${m * m} = ${alt * alt}, así que mide ${alt}; S = ${S} y s = ${s}.`], [`Como S = r · s, r = ${S} ÷ ${s} = `, v('x', cm(S / s)), '.']], _datos: { tipo: 'banderin', idea: 'incentro', nivel: 3, L, m } };
  }
  // ---------- Idea 4: ortocentro ----------
  function bhc(rng) {
    const A = rng.entero(25, 85);
    return { enunciado: [`En el triángulo acutángulo ABC, m∠A = ${A}° y H es el ortocentro.`], pregunta: ['¿Cuánto mide el ángulo BHC?'],
      // (Cierre del 26 nov, como la teoría: herramientas generales, no la relación m∠BHC = 180° − m∠A ya armada.)
      datos: [D.orto, D.cuad, D.opv], correcta: 180 - A, fmt: gr,
      errores: [er('GE-OR1', A, 'Ubicar el ángulo en H está bien, pero no mide lo mismo que A: los dos suman 180°.'),
        er('GE-OR2', 2 * A, 'El doble de A vale para el circuncentro; aquí H es el ortocentro, el cruce de las alturas.'),
        er('GE-OR2', 90 + A / 2, '90° + A/2 vale para el incentro; aquí H es el ortocentro, el cruce de las alturas.'),
        er('GE-OR3', 90 - A, '90° − A es el ángulo entre una altura y un lado; piden el cruce de dos alturas.')],
      solucion: [['Las alturas desde B y C forman con A un cuadrilátero con dos ángulos rectos, y su ángulo en H es opuesto por el vértice a BHC.'], [`m∠BHC = 360° − 90° − 90° − ${A}° = `, v('x', gr(180 - A)), '.']], _datos: { tipo: 'bhc', idea: 'ortocentro', nivel: 1, A } };
  }
  function hbc(rng) {
    const C = rng.entero(25, 80);
    return { enunciado: [`En el triángulo acutángulo ABC, m∠C = ${C}° y H es el ortocentro.`], pregunta: ['¿Cuánto mide el ángulo HBC?'],
      datos: [D.orto, D.suma], correcta: 90 - C, fmt: gr,
      errores: [er('GE-OR3', C, 'Mirar el ángulo C está bien, pero HBC es su complemento, lo que le falta para 90°.'),
        er('GE-OR3', 180 - C, 'Restar está bien, pero se resta de 90°, porque la altura forma un ángulo recto.'),
        er('GE-OR4', C / 2, 'BH no es la bisectriz de B: es la altura, así que no parte B por la mitad.'),
        er('GE-OR3', 90 + C, 'La altura forma 90° con AC; el ángulo pedido es menor que 90°.')],
      solucion: [['BH va sobre la altura desde B, perpendicular a AC, así que HBC y C suman 90°.'], [`m∠HBC = 90° − ${C}° = `, v('x', gr(90 - C)), '.']], _datos: { tipo: 'hbc', idea: 'ortocentro', nivel: 2, C } };
  }
  function ap(rng) {
    const [p, q, h] = rng.elegir(TRIPLES), k = rng.elegir([1, 2, 3]), bp = p * k, a = q * k, ab = h * k, pc = rng.entero(2, 12) + bp;
    return { enunciado: [`En el triángulo ABC, H es el ortocentro y la recta AH corta BC en P. AB = ${ab} cm, BP = ${bp} cm y PC = ${pc} cm.`], pregunta: ['¿Cuánto mide AP?'],
      datos: [D.alth, D.pit], correcta: a, fmt: cm,
      errores: [er('GE-OR8', Math.round(Math.sqrt(ab * ab + bp * bp) * 100) / 100, 'Usar Pitágoras está bien, pero AB es la hipotenusa, así que los cuadrados se restan, no se suman.'),
        er('GE-OR8', ab - bp, 'Restar está bien, pero se restan los cuadrados, no las medidas.'),
        er('GE-OR9', (bp + pc) / 2, 'AP es la altura desde A, no la mitad de BC.'),
        er('GE-OR8', ab, `${ab} cm es AB, la hipotenusa del triángulo APB.`)],
      solucion: [[`AP está sobre la altura desde A, así que APB es rectángulo en P.`], [`AP² = ${ab * ab} − ${bp * bp} = ${a * a}, así que AP = `, v('x', cm(a)), '.']], _datos: { tipo: 'ap', idea: 'ortocentro', nivel: 2, ab, bp } };
  }
  function bic(rng) {
    const A = 2 * rng.entero(14, 42), X = 180 - A;
    return { enunciado: [`En el triángulo acutángulo ABC, H es el ortocentro e I el incentro, y m∠BHC = ${X}°.`], pregunta: ['¿Cuánto mide el ángulo BIC?'],
      datos: [D.bhc, D.bic], correcta: 90 + A / 2, fmt: gr,
      errores: [er('GE-OR10', X, `Ubicar los dos ángulos está bien, pero ${X}° es BHC, con vértice en H; piden BIC.`),
        er('GE-OR10', A, `${A}° es el ángulo A; falta usarlo en la regla del incentro.`),
        er('GE-OR10', 90 + A, 'Sumar 90° está bien, pero se suma la mitad de A, no A entero.'),
        er('GE-OR10', 90 - A / 2, '90° − A/2 vale para el excentro; aquí I es el incentro.')],
      solucion: [[`Con el ortocentro sale el ángulo A: m∠A = 180° − ${X}° = ${A}°.`], [`m∠BIC = 90° + ${A}° ÷ 2 = `, v('x', gr(90 + A / 2)), '.']], _datos: { tipo: 'bic', idea: 'ortocentro', nivel: 3, X } };
  }
  // ---------- Idea 5: excentro ----------
  function at(rng) {
    const { a, b, c, s } = lados(rng);
    return { enunciado: [`En el triángulo ABC, AB = ${c} cm, AC = ${b} cm y BC = ${a} cm. La exinscrita relativa a BC toca la prolongación de AB en T.`], pregunta: ['¿Cuánto mide AT?'],
      datos: [D.semi, D.ats], correcta: s, fmt: cm,
      errores: [er('GE-EX1', s - a, 's − a es la tangente desde A a la inscrita; hasta la exinscrita, la tangente desde A mide s entera.'),
        er('GE-EX2', 2 * s, 'Sumar los lados está bien, pero AT es la mitad de esa suma.'),
        er('GE-EX3', s - c, `${s - c} cm es BT, que empieza en B; AT empieza en A.`),
        er('GE-EX3', c, `${c} cm es AB, pero T está más allá de B.`)],
      solucion: [['AT mide el semiperímetro, la mitad de la suma de los lados.'], [`AT = ${a + b + c} ÷ 2 = `, v('x', cm(s)), '.']], _datos: { tipo: 'at', idea: 'excentro', nivel: 1, a, b, c } };
  }
  function bt(rng) {
    const { a, b, c, s } = lados(rng);
    return { enunciado: [`En el triángulo ABC, AB = ${c} cm, AC = ${b} cm y BC = ${a} cm. La exinscrita relativa a BC toca la prolongación de AB en T.`], pregunta: ['¿Cuánto mide BT?'],
      datos: [D.semi, D.ats], correcta: s - c, fmt: cm,
      errores: [er('GE-EX3', s, `AT = ${s} cm está bien, pero falta restarle AB.`),
        er('GE-EX3', s - b, 'Restar del semiperímetro está bien, pero para BT se resta AB, el lado que está sobre AT.'),
        er('GE-EX1', s - a, 's − BC es la tangente desde A a la inscrita, no a la exinscrita.'),
        er('GE-EX3', a, `${a} cm es BC, el lado que toca la exinscrita.`)],
      solucion: [[`AT = s = ${s}, y como B está entre A y T, BT = AT − AB.`], [`BT = ${s} − ${c} = `, v('x', cm(s - c)), '.']], _datos: { tipo: 'bt', idea: 'excentro', nivel: 2, a, b, c } };
  }
  function bec(rng) {
    const A = 2 * rng.entero(12, 60);
    return { enunciado: [`En el triángulo ABC, m∠A = ${A}° y E es el excentro relativo a BC.`], pregunta: ['¿Cuánto mide el ángulo BEC?'],
      datos: [D.exc, D.suma, D.extb], correcta: 90 - A / 2, fmt: gr,
      errores: [er('GE-EX4', 90 + A / 2, '90° + A/2 vale para el incentro, con bisectrices interiores.'),
        er('GE-EX5', A / 2, 'A/2 sale cuando se cruzan una bisectriz interior y una exterior; aquí las dos son exteriores.'),
        er('GE-EX6', 90 - A, 'Restar de 90° está bien, pero se resta la mitad de A, no A entero.'),
        er('GE-EX4', 180 - A, '180° − A vale para el ortocentro; aquí E es el excentro.')],
      solucion: [[`Los exteriores de B y C suman 360° − (180° − ${A}°) = ${180 + A}°; en el triángulo BEC, sus mitades suman ${f(90 + A / 2)}°.`], [`m∠BEC = 180° − ${f(90 + A / 2)}° = `, v('x', gr(90 - A / 2)), '.']], _datos: { tipo: 'bec', idea: 'excentro', nivel: 2, A } };
  }
  function becx(rng) {
    // m∠BEC = m∠A + d: 90 − A/2 = A + d, así que A = (90 − d) · 2/3; d múltiplo de 3 con A par.
    for (;;) {
      const d = 3 * rng.entero(1, 20), A = (90 - d) * 2 / 3;
      if (!Number.isInteger(A) || A % 2 || A < 10) continue;
      return { enunciado: [`En el triángulo ABC, E es el excentro relativo a BC, y el ángulo BEC mide ${d}° más que el ángulo A.`], pregunta: ['¿Cuánto mide el ángulo BEC?'],
        datos: [D.bec], correcta: A + d, fmt: gr,
        errores: [er('GE-EX7', A, `${A}° es el ángulo A; falta sumarle ${d}° para llegar a BEC.`),
          er('GE-EX4', 90 + A / 2, '90° + A/2 vale para el incentro; aquí E es el excentro.'),
          er('GE-EX6', 90 - d, `Restar ${d}° de 90° no sigue la regla, que resta la mitad de A.`),
          er('GE-EX5', A / 2, `${A / 2}° es la mitad de A, no el ángulo BEC.`)],
        solucion: [[`Si m∠A = x, entonces 90° − x ÷ 2 = x + ${d}°, así que x = ${A}°.`], [`m∠BEC = ${A}° + ${d}° = `, v('x', gr(A + d)), '.']], _datos: { tipo: 'becx', idea: 'excentro', nivel: 3, d } };
    }
  }
  // ---------- Idea 6: Euler ----------
  function gh(rng) {
    const d = rng.entero(2, 15);
    return { enunciado: [`En la recta de Euler de un triángulo, OG = ${d} cm.`], pregunta: ['¿Cuánto mide GH?'],
      datos: [D.eul], correcta: 2 * d, fmt: cm,
      errores: [er('GE-EU1', d, 'Ubicar G entre O y H está bien, pero G no está en la mitad: GH es el doble de OG.'),
        er('GE-EU2', d / 2, 'Usar la razón 1 : 2 está bien, pero la usaste al revés: GH es el tramo largo.'),
        er('GE-EU3', 3 * d, `${3 * d} cm es OH entero, pero piden solo GH.`),
        er('GE-EU4', 4 * d, 'Duplicar está bien, pero una sola vez: GH = 2 · OG.')],
      solucion: [['GH es el tramo largo, el doble de OG.'], [`GH = 2 · ${d} = `, v('x', cm(2 * d)), '.']], _datos: { tipo: 'gh', idea: 'euler', nivel: 1, d } };
  }
  function og(rng) {
    const k = rng.entero(2, 12), OH = 3 * k;
    return { enunciado: [`En la recta de Euler de un triángulo, OH = ${OH} cm.`], pregunta: ['¿Cuánto mide OG?'],
      datos: [D.eul], correcta: k, fmt: cm,
      errores: [er('GE-EU1', OH / 2, 'G no es el punto medio de OH: lo parte en 1 : 2.'),
        er('GE-EU2', 2 * k, `Partir en tres está bien, pero ${2 * k} cm es GH, el tramo largo.`),
        er('GE-EU4', OH / 4, 'Partir OH está bien, pero en tres partes, no en cuatro.'),
        er('GE-EU3', OH, `${OH} cm es OH entero, y OG es solo una parte.`)],
      solucion: [['OH tiene tres partes iguales: una es OG.'], [`OG = ${OH} ÷ 3 = `, v('x', cm(k)), '.']], _datos: { tipo: 'og', idea: 'euler', nivel: 2, OH } };
  }
  function nueve(rng) {
    const R = 2 * rng.entero(3, 18), dia = rng.entero(0, 1) === 1;
    return { enunciado: [`El circunradio de un triángulo mide ${R} cm.`], pregunta: [dia ? '¿Cuánto mide el diámetro de su circunferencia de nueve puntos?' : '¿Cuánto mide el radio de su circunferencia de nueve puntos?'],
      datos: [D.nueve], correcta: dia ? R : R / 2, fmt: cm,
      errores: dia ? [er('GE-EU5', 2 * R, `${2 * R} cm es el diámetro de la circunscrita; el de nueve puntos es la mitad.`),
        er('GE-EU5', R / 2, `${R / 2} cm es el radio de nueve puntos, pero piden su diámetro.`),
        er('GE-EU6', 2 * R / 3, 'Los dos tercios vienen del baricentro; aquí el radio es la mitad de R.'),
        er('GE-EU6', R / 3, 'Tomar un tercio viene del baricentro; aquí el radio es la mitad de R.')]
        : [er('GE-EU5', R, `${R} cm es R, el radio de la circunscrita; el de nueve puntos es más chico.`),
          er('GE-EU6', R / 3, 'Tomar un tercio viene del baricentro; aquí el radio es la mitad de R.'),
          er('GE-EU5', 2 * R, 'Es al revés: el radio de nueve puntos es la mitad de R, no el doble.'),
          er('GE-EU6', 2 * R / 3, 'Los dos tercios vienen del baricentro; aquí el radio es la mitad de R.')],
      solucion: [[`El radio de nueve puntos es ${R} ÷ 2 = ${R / 2} cm.`], [dia ? 'Su diámetro es el doble del radio: ' : 'El radio mide ', v('x', cm(dia ? R : R / 2)), '.']], _datos: { tipo: 'nueve', idea: 'euler', nivel: 2, R, dia } };
  }
  function rect(rng) {
    const [p, q, h] = rng.elegir(TRIPLES), k = rng.elegir([1, 2, 3]), a = p * k, b = q * k, c = h * k;
    if ((c / 3) * 100 % 1) return rect(rng);
    return { enunciado: [`Un triángulo es rectángulo en B, con catetos de ${a} cm y ${b} cm. G es el baricentro y H el ortocentro.`], pregunta: ['¿Cuánto mide GH?'],
      datos: [D.pit, D.orect, D.orto, D.eul], correcta: c / 3, fmt: cm,
      errores: [er('GE-EU3', c / 2, `${f(c / 2)} cm es OH, del circuncentro al vértice B, y GH es solo una parte.`),
        er('GE-EU2', c / 6, `${f(c / 6)} cm es OG, el tramo corto, y GH es el doble.`),
        er('GE-EU8', c, `${c} cm es la hipotenusa, no un tramo de la recta de Euler.`),
        er('GE-EU8', 2 * c / 3, 'Tomar dos tercios está bien, pero de OH, no de la hipotenusa.')],
      solucion: [[`La hipotenusa mide ${c} cm; O es su punto medio y H es B, así que OH = ${f(c / 2)} cm.`], ['GH = 2 · (', f(c / 2), ' ÷ 3) = ', v('x', cm(c / 3)), '.']], _datos: { tipo: 'rect', idea: 'euler', nivel: 3, a, b } };
  }

  const TIPOS = { ag, am, area, hip, rrect, boc, obc, treinta, tan, inradio, lado, banderin, bhc, hbc, ap, bic, at, bt, bec, becx, gh, og, nueve, rect };
  const IDEAS = {
    baricentro: ['ag', 'am', 'area', 'hip'],
    circuncentro: ['rrect', 'boc', 'obc', 'treinta'],
    incentro: ['tan', 'inradio', 'lado', 'banderin'],
    ortocentro: ['bhc', 'hbc', 'ap', 'bic'],
    excentro: ['at', 'bt', 'bec', 'becx'],
    euler: ['gh', 'og', 'nueve', 'rect'],
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): las seis ideas.
  const PAPEL = { 'papel-1': 'ag', 'papel-2': 'rrect', 'papel-3': 'tan', 'papel-4': 'hbc', 'papel-5': 'bt', 'papel-6': 'og', 'papel-7': 'treinta', 'papel-8': 'becx' };
  // Prueba del curso (reserva pn-01 y pn-02: catalogo/pruebas/geometria.json).
  const PRUEBA = { 'pn-01': 'ag', 'pn-02': 'tan' };

  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const fijo = PAPEL[String(semilla)] || PRUEBA[String(semilla)] || opciones.tipo;
    const idea = opciones.idea && IDEAS[opciones.idea] ? opciones.idea : rng.elegir(Object.keys(IDEAS));
    const tipo = fijo || rng.elegir(IDEAS[idea]);
    for (let intento = 0; intento < 200; intento++) {
      const pr = TIPOS[tipo](rng);
      const errores = pr.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && P.enEscala(e.valor, pr.correcta, e.id));
      const alternativas = P.armar({ correcta: pr.correcta, errores, rng, texto: pr.fmt });
      if (alternativas.length < 4) continue;
      return { id: `${ID}#${semilla}`, variables: { x: { nombre: 'lo que se pide', color: 'f' } },
        enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas, solucion: pr.solucion,
        respuesta: { valor: pr.correcta, unidad: '' }, _datos: Object.assign({ valor: pr.correcta }, pr._datos) };
    }
    throw new Error(`${ID}: no se pudo generar un problema con 4 alternativas distintas (${tipo})`);
  }

  // TIPOS_POR_IDEA: lo que lee el catálogo para «Practicar por idea» (herramientas/construir-catalogo.js).
  return { id: ID, titulo: 'Puntos notables del triángulo', generar, TIPOS: Object.keys(TIPOS), IDEAS, TIPOS_POR_IDEA: IDEAS };
});
