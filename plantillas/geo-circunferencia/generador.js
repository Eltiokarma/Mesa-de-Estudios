/*
 * Generador «Circunferencia y ángulos en ella»: la práctica de las seis ideas de geometria.circunferencia
 * (contenido/teoria/geometria/circunferencia.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['geo-circunferencia']) y en Node (require). Propuesta: docs/etapa7/propuesta-geometria.md §7a.
 *
 * Tipos por idea (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   tangentes              cuerda (2): la cuerda desde el radio y la distancia · tangente (1): el largo de la tangente ·
 *                          iso (1): el isósceles de dos radios · flecha (3): el radio desde la superficie y la altura del agua
 *   poncelet-pitot         pitot (1): el cuarto lado · triangulo (2): un tramo en un triángulo con su circunferencia
 *                          inscrita · poncelet (2): el radio inscrito · trapecio (3): el radio de un trapecio isósceles circunscrito
 *   posiciones             posicion (1): la posición por d · tocan (1): d para que se toquen · radio (2): el radio que
 *                          falta · monedas (3): tres ruedas tangentes de dos en dos
 *   inscrito               inscrito (1) · semi (1): tangente y cuerda · menor (2): P en el arco menor · diametro (2)
 *   interior-exterior      interior (1) · exterior (2): dos secantes · tangentes (2): dos tangentes · cercano (3): el
 *                          arco cercano desde el ángulo
 *   cuadrilatero-inscrito  opuesto (1) · opuesto-x (2) · exterior-cic (2): el ángulo de afuera · inscriptible (2)
 * Todos se resuelven con el texto (sin figura): la práctica y el papel no llevan dibujo.
 *
 * Datos (punto 13; molde §4): una línea por dato, las mismas de la teoría, nunca el paso hecho. Notación de la unidad:
 * m∠A; x sin «°»; «arco AB» en palabras; r₁ ≥ r₂. Colores: lo pedido y su resultado en violeta, solo en la solución.
 * Errores (hipótesis de aula, salvo GE11, GE12, GE15 y GE16 del informe; docs/investigacion/geometria-ideas-erroneas.md,
 * «Circunferencia (19 nov)»). Ninguna explicación nombra una alternativa por su letra; cada una empieza por lo que el
 * alumno hizo bien. Cuentas comprobadas con un script aparte (casos.json, «verificacion») y en generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'geo-circunferencia';
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const gr = x => `${f(x)}°`;
  const cm = x => `${f(x)} cm`;
  const RESP = new Set(['GE11', 'GE12', 'GE15', 'GE16']);
  const er = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: RESP.has(id) ? 'parcial' : 'hipotesis', fuente: null });
  const TERNOS = [[5, 3, 4], [10, 6, 8], [13, 5, 12], [15, 9, 12], [17, 8, 15], [20, 12, 16], [25, 7, 24], [25, 15, 20], [26, 10, 24], [29, 20, 21], [30, 18, 24], [34, 16, 30], [39, 15, 36], [41, 9, 40], [50, 14, 48], [50, 30, 40]];

  const D = {
    perp: 'El radio perpendicular a una cuerda la parte en dos mitades iguales.',
    pit: 'Pitágoras: en un triángulo rectángulo, la suma de los cuadrados de los catetos es el cuadrado de la hipotenusa.',
    tan: 'La tangente es perpendicular al radio que llega al punto de contacto.',
    dist: 'La distancia del centro a la cuerda se mide por la perpendicular desde el centro.',
    radios: 'Todos los radios de una circunferencia miden igual.',
    iso: 'En un triángulo isósceles, los dos ángulos de la base miden igual.',
    tri: 'En todo triángulo, los tres ángulos interiores suman 180°.',
    iguales: 'Desde un punto de afuera, las dos tangentes a una circunferencia miden igual.',
    pitot: 'Pitot: si los cuatro lados de ABCD tocan una circunferencia, AB + CD = BC + DA.',
    poncelet: 'Poncelet: en un triángulo rectángulo de catetos a y b e hipotenusa c, a + b = c + 2r.',
    inscrita: 'La circunferencia inscrita toca cada lado del polígono en un solo punto.',
    altura: 'La altura del trapecio es un diámetro de la circunferencia.',
    lados: 'En un trapecio isósceles, los dos lados no paralelos miden igual.',
    pos: 'Con radios r₁ ≥ r₂ y d entre los centros: d > r₁ + r₂, exteriores; d = r₁ + r₂, tangentes exteriores.',
    pos2: 'r₁ − r₂ < d < r₁ + r₂, secantes; d = r₁ − r₂, tangentes interiores; d < r₁ − r₂, interiores.',
    insc: 'Un ángulo inscrito (vértice en la circunferencia, lados cuerdas) mide la mitad del arco que abarca.',
    semi: 'Un ángulo semiinscrito (entre una tangente y una cuerda) mide la mitad del arco que abarca.',
    vuelta: 'La circunferencia entera mide 360°; media circunferencia, 180°.',
    int: 'Con el vértice dentro del círculo, el ángulo mide la semisuma de los dos arcos que abarcan él y su opuesto.',
    ext: 'Con el vértice fuera del círculo, el ángulo mide la semidiferencia: arco lejano menos cercano, sobre 2.',
    cic: 'En un cuadrilátero inscrito, los ángulos opuestos suman 180°.',
    inscr: 'Inscriptible: si dos ángulos opuestos de un cuadrilátero suman 180°, sus vértices caben en una circunferencia; si no, no caben.',
    recta: 'Dos ángulos vecinos en una recta suman 180°.',
  };
  const terno = rng => { const [h, a, b] = rng.elegir(TERNOS); return rng.entero(0, 1) ? [h, a, b] : [h, b, a]; };

  // =============================== Idea 1: radio, cuerda y tangente ===============================
  function cuerda(rng) {
    const [h, d, m] = terno(rng);
    return { enunciado: [`Una circunferencia tiene ${h} cm de radio, y la cuerda AB está a ${d} cm del centro.`], pregunta: ['¿Cuánto mide AB?'], datos: [D.perp, D.pit, D.dist], correcta: 2 * m, fmt: cm,
      errores: [er('GE-CIR4', m, `Pitágoras está bien: da ${m} cm, la mitad de la cuerda. Falta duplicar.`), er('GE11', 2 * Math.hypot(h, d), 'Duplicar está bien; pero el radio es la hipotenusa: se restan los cuadrados.'),
        er('GE-CIR5', 2 * (h - d), `Duplicar está bien; pero ${h} − ${d} no es la mitad: forman un triángulo rectángulo.`), er('GE-CIR6', 2 * h, `${2 * h} cm es el diámetro; esta cuerda no pasa por el centro.`)],
      solucion: [[`Media cuerda: ${h}² − ${d}² = ${m * m}, así que mide ${m} cm.`], ['AB = 2 · ', `${m} cm = `, v('x', cm(2 * m)), '.']],
      _datos: { tipo: 'cuerda', idea: 'tangentes', nivel: 2, r: h, d } };
  }
  function tangente(rng) {
    const [h, rad, t] = terno(rng);
    return { enunciado: [`El punto P está a ${h} cm del centro de una circunferencia de ${rad} cm de radio.`], pregunta: ['¿Cuánto mide la tangente PT, de P al punto de contacto?'], datos: [D.tan, D.pit], correcta: t, fmt: cm,
      errores: [er('GE-CIR5', h - rad, 'Usar PO y el radio está bien; pero no se restan: forman un triángulo rectángulo.'), er('GE11', Math.hypot(h, rad), 'Pitágoras está bien; pero PO es la hipotenusa: se restan los cuadrados.'),
        er('GE-TAN1', h, `${h} cm llega al centro; la tangente llega al punto de contacto.`), er('GE-CIR5', h + rad, 'Usar PO y el radio está bien; pero no se suman.')],
      solucion: [['El radio OT es perpendicular a PT: PO es la hipotenusa.'], [`PT² = ${h}² − ${rad}² = ${t * t}; PT = `, v('x', cm(t)), '.']],
      _datos: { tipo: 'tangente', idea: 'tangentes', nivel: 1, PO: h, r: rad } };
  }
  function iso(rng) {
    const g = rng.elegir([30, 40, 50, 70, 80, 100, 110, 130, 140, 150]), x = (180 - g) / 2;
    return { enunciado: [`En una circunferencia de centro O, los radios OA y OB forman un ángulo m∠AOB = ${g}°.`], pregunta: ['¿Cuánto mide m∠OAB?'], datos: [D.radios, D.iso, D.tri], correcta: x, fmt: gr,
      errores: [er('GE-CIR10', 180 - g, `Restar de 180° está bien: da ${180 - g}°, lo de A y B juntos. Falta repartirlo.`), er('GE-CIR11', g / 2, `La mitad de ${g}° no es ningún ángulo del triángulo.`),
        er('GE-CIR12', g, 'El isósceles tiene iguales los ángulos de A y B; el de O es el otro.')],
      solucion: [['OA = OB: los ángulos en A y en B miden igual.'], [`m∠OAB = (180° − ${g}°) ÷ 2 = `, v('x', gr(x)), '.']],
      _datos: { tipo: 'iso', idea: 'tangentes', nivel: 1, g } };
  }
  function flecha(rng) {
    const [h, d, m] = terno(rng), fl = h - d;
    return { enunciado: [`En una tubería, la superficie del agua mide ${2 * m} cm de ancho y el agua llega a ${fl} cm de alto, menos de la mitad.`], pregunta: ['¿Cuánto mide el radio de la tubería?'],
      datos: [D.perp, D.pit, `Si el radio es r, la superficie queda a r − ${fl} del centro.`], correcta: h, fmt: cm,
      errores: [er('GE-CIR7', m, `${m} cm es media superficie: un cateto, no el radio.`), er('GE-CIR8', d, `${d} cm es r − ${fl}: lo que hay del centro al agua.`),
        er('GE-CIR9', 2 * h, `La ecuación está bien: da r = ${h} cm. ${2 * h} cm es el diámetro.`), er('GE-CIR5', m + fl, 'Usar la mitad y la altura está bien; pero no se suman.')],
      solucion: [[`r² = ${m}² + (r − ${fl})², así que ${2 * fl}r = ${m * m + fl * fl}.`], ['r = ', v('x', cm(h)), '.']],
      _datos: { tipo: 'flecha', idea: 'tangentes', nivel: 3, m, fl } };
  }

  // =============================== Idea 2: tangentes iguales, Pitot y Poncelet ===============================
  function pitot(rng) {
    const [a, b, c, dd] = Array.from({ length: 4 }, () => rng.entero(3, 18)), AB = a + b, BC = b + c, CD = c + dd, DA = dd + a;
    return { enunciado: [`Los cuatro lados del cuadrilátero ABCD tocan una circunferencia. AB = ${AB} cm, BC = ${BC} cm y CD = ${CD} cm.`], pregunta: ['¿Cuánto mide DA?'], datos: [D.pitot], correcta: DA, fmt: cm,
      errores: [er('GE-PIT2', BC, 'Mirar el lado de enfrente está bien; pero se igualan las sumas, no los lados.'), er('GE-PIT3', AB + BC - CD, 'Sumar de a dos está bien; pero se suman los opuestos.'),
        er('GE-PIT4', AB + BC + CD, `${AB + BC + CD} cm es la suma de los tres: el cuarto lado es otra cosa.`), er('GE-PIT5', (AB + CD) / 2, 'Pitot está bien; pero AB + CD es lo que suman BC y DA, no el doble de DA.')],
      solucion: [[`AB + CD = BC + DA: ${AB} + ${CD} = ${BC} + DA.`], ['DA = ', v('x', cm(DA)), '.']],
      _datos: { tipo: 'pitot', idea: 'poncelet-pitot', nivel: 1, AB, BC, CD } };
  }
  function triangulo(rng) {
    for (;;) {
      const x = rng.entero(2, 13), y = rng.entero(2, 13), z = rng.entero(2, 13), AB = x + z, BC = x + y, CA = y + z;
      if (x === y || x === z) continue;
      return { enunciado: [`La circunferencia inscrita en el triángulo ABC toca BC en D. AB = ${AB} cm, BC = ${BC} cm y CA = ${CA} cm.`], pregunta: ['¿Cuánto mide BD?'], datos: [D.iguales, D.inscrita], correcta: x, fmt: cm,
        errores: [er('GE-PIT6', BC / 2, 'Partir BC está bien; pero D no cae en su mitad.'), er('GE-PIT7', y, `Plantear con tramos está bien; ${y} cm es DC, el tramo desde C.`),
          er('GE-PIT7', z, `Plantear con tramos está bien; ${z} cm es el tramo desde A.`), er('GE-PIT8', AB + BC - CA, `AB + BC − CA está bien: da ${AB + BC - CA} cm, dos tramos desde B. Falta la mitad.`)],
        solucion: [[`Con BD = x: (${AB} − x) + (${BC} − x) = ${CA}.`], ['x = ', v('x', cm(x)), '.']],
        _datos: { tipo: 'triangulo', idea: 'poncelet-pitot', nivel: 2, AB, BC, CA } };
    }
  }
  function poncelet(rng) {
    const [h, a, b] = terno(rng), r = (a + b - h) / 2;
    return { enunciado: [`Un triángulo rectángulo tiene catetos de ${a} cm y ${b} cm, e hipotenusa de ${h} cm.`], pregunta: ['¿Cuánto mide el radio de su circunferencia inscrita?'], datos: [D.poncelet], correcta: r, fmt: cm,
      // (Auditoría, 19 nov: GE-PON5, «área ÷ perímetro», se explicaba con una fórmula que la unidad no da. En su lugar,
      // GE-PON6: parte 2r dos veces; da el mismo valor, la mitad de r, y se explica con Poncelet.)
      errores: [er('GE-PON6', r / 2, `Poncelet está bien: ${a} + ${b} − ${h} = ${2 * r} es 2r. ${f(r / 2)} cm lo parte dos veces; el radio es la mitad de 2r, una sola vez.`), er('GE-PON2', 2 * r, `${a} + ${b} − ${h} = ${2 * r} es 2r, el diámetro. Falta la mitad.`), er('GE-PON1', h / 2, 'La mitad de la hipotenusa es el radio de la circunscrita, no el de la inscrita.'),
        er('GE-PON3', a * b / h, 'Esa es la altura sobre la hipotenusa: otra medida.'), er('GE-PON4', (a + b + h) / 2, 'Usar los tres lados está bien; pero la hipotenusa se resta.')],
      solucion: [[`${a} + ${b} = ${h} + 2r, así que 2r = ${2 * r}.`], ['r = ', v('x', cm(r)), '.']],
      _datos: { tipo: 'poncelet', idea: 'poncelet-pitot', nivel: 2, a, b, c: h } };
  }
  const TRAPECIOS = [[18, 8], [32, 2], [50, 8], [16, 4], [36, 4], [24, 6], [27, 3], [45, 5], [20, 5], [28, 7], [32, 8], [48, 3], [40, 10], [36, 16]];
  function trapecio(rng) {
    const [B, b] = rng.elegir(TRAPECIOS), lado = (B + b) / 2, alt = Math.sqrt(B * b), r = alt / 2;
    return { enunciado: [`Un trapecio isósceles tiene bases de ${B} cm y ${b} cm, y sus cuatro lados tocan una circunferencia.`], pregunta: ['¿Cuánto mide el radio de esa circunferencia?'],
      datos: [D.pitot, D.lados, D.pit, D.altura], correcta: r, fmt: cm,
      errores: [er('GE-PIT12', alt, `La altura está bien: ${f(alt)} cm. Es el diámetro; el radio es la mitad.`), er('GE-PIT11', lado, `Cada lado mide ${f(lado)} cm; falta la altura con Pitágoras.`),
        er('GE-PIT13', b / 2, `${f(b / 2)} cm es media base menor; el diámetro es la altura, no esa base.`), er('GE-PIT12', (B - b) / 2, `${f((B - b) / 2)} cm es un cateto del triángulo, no el radio.`)],
      solucion: [[`Cada lado: (${B} + ${b}) ÷ 2 = ${f(lado)} cm. Altura²: ${f(lado)}² − ${f((B - b) / 2)}² = ${f(B * b)}, así que la altura mide ${f(alt)} cm.`], ['r es la mitad de la altura: r = ', v('x', cm(r)), '.']],
      _datos: { tipo: 'trapecio', idea: 'poncelet-pitot', nivel: 3, B, b } };
  }

  // =============================== Idea 3: posición de dos circunferencias ===============================
  const NOMBRES = ['Exteriores', 'Tangentes exteriores', 'Secantes', 'Tangentes interiores', 'Interiores'];
  const nombre = (d, r1, r2) => (d > r1 + r2 ? 'Exteriores' : d === r1 + r2 ? 'Tangentes exteriores' : d > r1 - r2 ? 'Secantes' : d === r1 - r2 ? 'Tangentes interiores' : 'Interiores');
  function posicion(rng) {
    const r1 = rng.entero(6, 15), r2 = rng.entero(2, r1 - 2), k = rng.entero(0, 4);
    const d = [r1 + r2 + rng.entero(1, 6), r1 + r2, rng.entero(r1 - r2 + 1, r1 + r2 - 1), r1 - r2, rng.entero(1, r1 - r2 - 1)][k], bien = nombre(d, r1, r2);
    const pide = { 'Exteriores': `d > ${r1 + r2}`, 'Tangentes exteriores': `d = ${r1 + r2}`, 'Secantes': `${r1 - r2} < d < ${r1 + r2}`, 'Tangentes interiores': `d = ${r1 - r2}`, 'Interiores': `d < ${r1 - r2}` };
    return { texto: true, enunciado: [`Dos circunferencias tienen radios de ${r1} cm y ${r2} cm, y sus centros están a ${d} cm.`], pregunta: ['¿Cuál es su posición?'], datos: [D.pos, D.pos2],
      correcta: { clave: bien, texto: bien },
      errores: NOMBRES.filter(x => x !== bien).map(x => ({ id: 'GE-POS4', clave: x, texto: x, explicacion: `Comparar d está bien; «${x.toLowerCase()}» pediría ${pide[x]}.`, respaldo: 'hipotesis' })),
      solucion: [[`r₁ + r₂ = ${r1 + r2} y r₁ − r₂ = ${r1 - r2}; d = ${d}.`], ['Son ', v('x', bien.toLowerCase()), '.']],
      _datos: { tipo: 'posicion', idea: 'posiciones', nivel: 1, r1, r2, d } };
  }
  function tocan(rng) {
    const r1 = rng.entero(6, 20), r2 = rng.entero(2, r1 - 1), fuera = rng.entero(0, 1) === 1, d = fuera ? r1 + r2 : r1 - r2;
    return { enunciado: [`Dos circunferencias de ${r1} cm y ${r2} cm de radio son tangentes ${fuera ? 'exteriores' : 'interiores'}.`], pregunta: ['¿A qué distancia están sus centros?'], datos: [D.pos, D.pos2], correcta: d, fmt: cm,
      errores: [er('GE-POS5', fuera ? r1 - r2 : r1 + r2, fuera ? 'Usar los dos radios está bien; por fuera se suman.' : 'Usar los dos radios está bien; por dentro se restan.'),
        er('GE-POS6', 2 * d, 'La cuenta de los radios está bien; d no se duplica.'), er('GE-POS7', r1, `${r1} cm es el radio grande; d usa los dos.`)],
      solucion: [[fuera ? 'Por fuera, d es la suma de los radios:' : 'Por dentro, d es la resta de los radios:'], [`d = ${r1} ${fuera ? '+' : '−'} ${r2} = `, v('x', cm(d)), '.']],
      _datos: { tipo: 'tocan', idea: 'posiciones', nivel: 1, r1, r2, fuera } };
  }
  function radio(rng) {
    const r1 = rng.entero(8, 25), r2 = rng.entero(2, r1 - 2), fuera = rng.entero(0, 1) === 1, d = fuera ? r1 + r2 : r1 - r2;
    return { enunciado: [`Dos circunferencias son tangentes ${fuera ? 'exteriores' : 'interiores'} y sus centros están a ${d} cm. La ${fuera ? 'primera' : 'grande'} tiene ${r1} cm de radio.`], pregunta: ['¿Cuánto mide el radio de la otra?'],
      datos: [D.pos, D.pos2], correcta: r2, fmt: cm,
      errores: [er('GE-POS5', d + r1, 'Usar d y el radio está bien; pero al despejar se resta.'), er('GE-POS9', d / 2, 'Partir d en dos sería si los radios fueran iguales.'),
        er('GE-POS7', r1, `${r1} cm es el radio conocido.`), er('GE-POS7', d, `${d} cm es d, de centro a centro.`)],
      solucion: [[fuera ? `${r1} + r = ${d}` : `${r1} − r = ${d}`], ['r = ', v('x', cm(r2)), '.']],
      _datos: { tipo: 'radio', idea: 'posiciones', nivel: 2, r1, d, fuera } };
  }
  function monedas(rng) {
    const x = rng.entero(2, 9), y = rng.entero(x + 1, 11), z = rng.entero(y + 1, 14), a = x + y, b = x + z, c = y + z, chica = rng.entero(0, 1) === 1, sol = chica ? x : z;
    // (Lector en frío, 19 nov: monedas de 28 cm de diámetro no existen: son ruedas.)
    return { enunciado: [`Tres ruedas son tangentes exteriores de dos en dos. Las distancias entre sus centros son ${a} cm, ${b} cm y ${c} cm.`], pregunta: [`¿Cuánto mide el radio de la rueda más ${chica ? 'chica' : 'grande'}?`],
      datos: [D.pos], correcta: sol, fmt: cm,
      errores: [er('GE-POS10', y, `El sistema está bien: ${y} cm es la del medio.`), er('GE-POS9', (chica ? a : c) / 2, 'Partir una distancia en dos sería si las ruedas fueran iguales.'),
        er('GE-POS10', chica ? z : x, 'El sistema está bien; ese es el radio de la otra punta.'), er('GE-POS11', (a + b + c) / 2, 'Sumar las tres está bien: da los tres radios juntos.')],
      solucion: [[`Los tres radios suman (${a} + ${b} + ${c}) ÷ 2 = ${(a + b + c) / 2} cm.`], [`${(a + b + c) / 2} − ${chica ? c : a} = `, v('x', cm(sol)), '.']],
      _datos: { tipo: 'monedas', idea: 'posiciones', nivel: 3, a, b, c, chica } };
  }

  // =============================== Idea 4: ángulo central e inscrito ===============================
  function inscrito(rng) {
    let arco; do arco = 2 * rng.entero(16, 150); while (arco === 180); const x = arco / 2;
    return { enunciado: [`Desde un punto P de una circunferencia se ven los puntos A y B; el arco AB que abarca el ángulo APB mide ${arco}°.`], pregunta: ['¿Cuánto mide m∠APB?'], datos: [D.insc], correcta: x, fmt: gr,
      errores: [er('GE15', arco, 'Igual al arco mide el central, con vértice en el centro.'), er('GE15', 2 * arco, 'El inscrito es la mitad del arco, no el doble.'), er('GE-INS2', 180 - x, `La mitad, ${gr(x)}, está bien; no se resta de 180°.`)],
      solucion: [['Inscrito: la mitad de su arco.'], [`${arco}° ÷ 2 = `, v('x', gr(x)), '.']],
      _datos: { tipo: 'inscrito', idea: 'inscrito', nivel: 1, arco } };
  }
  function semi(rng) {
    let arco; do arco = 2 * rng.entero(20, 150); while (arco === 180); const x = arco / 2;
    return { enunciado: [`La tangente en A y la cuerda AB forman un ángulo que abarca un arco de ${arco}°.`], pregunta: ['¿Cuánto mide ese ángulo?'], datos: [D.semi, D.tan], correcta: x, fmt: gr,
      errores: [er('GE15', arco, 'Ese es el arco; con vértice en el borde, la mitad.'), er('GE-INS1', 90, 'La tangente forma 90° con el radio, no con la cuerda.'), er('GE-INS3', 180 - x, 'Ese es el ángulo del otro lado de la cuerda.')],
      solucion: [['Semiinscrito: la mitad de su arco.'], [`${arco}° ÷ 2 = `, v('x', gr(x)), '.']],
      _datos: { tipo: 'semi', idea: 'inscrito', nivel: 1, arco } };
  }
  function menor(rng) {
    const m = 2 * rng.entero(15, 80), x = (360 - m) / 2;
    return { enunciado: [`A y B parten una circunferencia en dos arcos; el menor mide ${m}°. P está en el arco menor.`], pregunta: ['¿Cuánto mide m∠APB?'], datos: [D.insc, D.vuelta], correcta: x, fmt: gr,
      errores: [er('GE-INS4', m / 2, 'La mitad está bien; pero P abarca el otro arco.'), er('GE15', 360 - m, 'Ese es el arco que abarca; el ángulo es su mitad.'), er('GE15', m, 'Ese es el arco menor entero.')],
      solucion: [[`P abarca el arco mayor: 360° − ${m}° = ${360 - m}°.`], [`${360 - m}° ÷ 2 = `, v('x', gr(x)), '.']],
      _datos: { tipo: 'menor', idea: 'inscrito', nivel: 2, m } };
  }
  function diametro(rng) {
    const a = rng.entero(15, 75);
    return { enunciado: [`El triángulo ABC tiene sus vértices en una circunferencia, y AB es un diámetro. m∠CAB = ${a}°.`], pregunta: ['¿Cuánto mide m∠CBA?'], datos: [D.insc, D.tri, D.vuelta], correcta: 90 - a, fmt: gr,
      errores: [er('GE-INS5', 180 - a, 'Restar de 180° está bien; pero en C hay 90°.'), er('GE-INS6', a, 'A y B no miden igual: suman 90°.'), er('GE-INS7', 90, '90° mide el ángulo en C.'), er('GE-INS8', (180 - a) / 2, 'Repartir sería si fuera isósceles.')],
      solucion: [['C ve el diámetro: m∠ACB = 90°.'], [`m∠CBA = 180° − 90° − ${a}° = `, v('x', gr(90 - a)), '.']],
      _datos: { tipo: 'diametro', idea: 'inscrito', nivel: 2, a } };
  }

  // =============================== Idea 5: ángulos interior y exterior ===============================
  function interior(rng) {
    const a = 2 * rng.entero(30, 75), b = 2 * rng.entero(10, 40), x = (a + b) / 2;
    return { enunciado: [`Dos cuerdas AC y BD se cortan en Q, dentro de una circunferencia. El arco AB mide ${a}° y el arco CD, ${b}°.`], pregunta: ['¿Cuánto mide m∠AQB?'], datos: [D.int, D.ext], correcta: x, fmt: gr,
      errores: [er('GE16', (a - b) / 2, 'Usar los dos arcos y la mitad está bien; dentro se suman.'), er('GE16', a + b, 'Sumar está bien; falta dividir entre 2.'),
        er('GE15', a / 2, 'La mitad de un solo arco sería un inscrito.'), er('GE-ANG1', 180 - x, 'La semisuma está bien; ese es su vecino.')],
      solucion: [['Vértice dentro: semisuma.'], [`(${a}° + ${b}°) ÷ 2 = `, v('x', gr(x)), '.']],
      _datos: { tipo: 'interior', idea: 'interior-exterior', nivel: 1, a, b } };
  }
  function exterior(rng) {
    const L = 2 * rng.entero(50, 85), c = 2 * rng.entero(8, 35), x = (L - c) / 2;
    return { enunciado: [`Desde Q, fuera de una circunferencia, salen dos secantes. Entre ellas quedan un arco lejano de ${L}° y uno cercano de ${c}°.`], pregunta: ['¿Cuánto mide el ángulo en Q?'], datos: [D.int, D.ext], correcta: x, fmt: gr,
      errores: [er('GE-ANG7', c / 2, `La mitad del cercano, ${gr(c / 2)}, sería un inscrito en ese arco; Q está fuera.`), er('GE16', (L + c) / 2, 'Usar los dos arcos está bien; fuera se restan.'), er('GE16', L - c, 'Restar está bien; falta dividir entre 2.'), er('GE15', L / 2, 'La mitad del lejano sería un inscrito.')],
      solucion: [['Vértice fuera: semidiferencia.'], [`(${L}° − ${c}°) ÷ 2 = `, v('x', gr(x)), '.']],
      _datos: { tipo: 'exterior', idea: 'interior-exterior', nivel: 2, L, c } };
  }
  function tangentes(rng) {
    const c = 2 * rng.entero(20, 80), L = 360 - c, x = (L - c) / 2;
    return { enunciado: [`Desde Q se trazan dos tangentes a una circunferencia. El arco cercano entre los puntos de contacto mide ${c}°.`], pregunta: ['¿Cuánto mide el ángulo en Q?'], datos: [D.ext, D.vuelta], correcta: x, fmt: gr,
      errores: [er('GE15', c / 2, 'La mitad del arco sería un inscrito.'), er('GE16', L - c, 'Restar los arcos está bien; falta dividir entre 2.'), er('GE15', L / 2, 'Falta restar la mitad del cercano.'), er('GE-ANG2', c, 'El ángulo y el arco cercano suman 180°; no miden igual.')],
      solucion: [[`El lejano mide 360° − ${c}° = ${L}°.`], [`(${L}° − ${c}°) ÷ 2 = `, v('x', gr(x)), '.']],
      _datos: { tipo: 'tangentes', idea: 'interior-exterior', nivel: 2, c } };
  }
  function cercano(rng) {
    const L = 2 * rng.entero(60, 85), x = rng.entero(20, 50), c = L - 2 * x;
    return { enunciado: [`Desde Q, fuera de una circunferencia, salen dos secantes que forman un ángulo de ${x}°. El arco lejano mide ${L}°.`], pregunta: ['¿Cuánto mide el arco cercano?'], datos: [D.ext], correcta: c, fmt: gr,
      errores: [er('GE-ANG3', L - x, 'Restar del lejano está bien; pero el doble del ángulo.'), er('GE-ANG6', L + 2 * x, 'Afuera, el cercano es el lejano menos el doble del ángulo.'), er('GE16', (L - x) / 2, 'El ángulo ya es la mitad: se multiplica por 2.')],
      solucion: [[`La resta de los arcos es el doble del ángulo: ${2 * x}°.`], [`${L}° − ${2 * x}° = `, v('x', gr(c)), '.']],
      _datos: { tipo: 'cercano', idea: 'interior-exterior', nivel: 3, L, x } };
  }

  // =============================== Idea 6: cuadrilátero inscrito ===============================
  function opuesto(rng) {
    const [dado, pide, otro] = rng.elegir([['B', 'D', 'A'], ['A', 'C', 'B'], ['D', 'B', 'C'], ['C', 'A', 'D']]), a = rng.entero(50, 130), b = rng.entero(50, 130);
    return { enunciado: [`El cuadrilátero ABCD está inscrito en una circunferencia. m∠${dado} = ${a}° y m∠${otro} = ${b}°.`], pregunta: [`¿Cuánto mide m∠${pide}?`], datos: [D.cic], correcta: 180 - a, fmt: gr,
      errores: [er('GE-CIC1', 180 - b, `Restar de 180° está bien; pero el opuesto de ${pide} es ${dado}.`), er('GE-CIC4', a, 'Iguales serían en un paralelogramo.'), er('GE-CIC5', 360 - a - b, 'Eso suman los otros dos juntos.')],
      solucion: [[`${dado} y ${pide} son opuestos: suman 180°.`], [`m∠${pide} = 180° − ${a}° = `, v('x', gr(180 - a)), '.']],
      _datos: { tipo: 'opuesto', idea: 'cuadrilatero-inscrito', nivel: 1, a } };
  }
  function opuestoX(rng) {
    for (;;) {
      const p = rng.entero(2, 4), q = rng.entero(1, 3), x = rng.entero(10, 30), k = 5 * rng.entero(1, 6), A = p * x + k, C = 180 - A, m = C - q * x;
      if (m <= 0 || C < 30 || A < 30 || p === q) continue;
      const ex = (c, t) => `${c === 1 ? '' : c}x + ${t}°`, xi = (m - k) / (p - q);
      return { enunciado: [`El cuadrilátero ABCD está inscrito en una circunferencia. m∠A = ${ex(p, k)} y m∠C = ${ex(q, m)}, con x en grados.`], pregunta: ['¿Cuánto mide m∠A?'], datos: [D.cic], correcta: A, fmt: gr,
        errores: [er('GE-CIC6', x, `x = ${x}; falta reemplazarlo.`), er('GE-CIC1', C, 'Ese es m∠C.'), er('GE-CIC4', p * xi + k, 'Igualar los opuestos sería en un paralelogramo.')],
        solucion: [[`${ex(p, k)} + ${ex(q, m)} = 180°, así que x = ${x}.`], [`m∠A = ${p} · ${x}° + ${k}° = `, v('x', gr(A)), '.']],
        _datos: { tipo: 'opuesto-x', idea: 'cuadrilatero-inscrito', nivel: 2, p, k, q, m } };
    }
  }
  function exteriorCic(rng) {
    const a = rng.entero(55, 125);
    return { enunciado: [`El cuadrilátero ABCD está inscrito en una circunferencia y m∠A = ${a}°. Se prolonga BC más allá de C.`], pregunta: ['¿Qué ángulo forma esa prolongación con CD?'], datos: [D.cic, D.recta], correcta: a, fmt: gr,
      errores: [er('GE-CIC10', 180 - a, 'Ese es m∠C; el de afuera es su vecino.'), er('GE15', a / 2, 'La mitad sería un inscrito.'), er('GE-CIC5', 360 - a, 'Restar de 360° da otra cosa.')],
      solucion: [[`m∠C = 180° − ${a}° = ${180 - a}°.`], [`180° − ${180 - a}° = `, v('x', gr(a)), '.']],
      _datos: { tipo: 'exterior-cic', idea: 'cuadrilatero-inscrito', nivel: 2, a } };
  }
  function inscriptible(rng) {
    const si = rng.entero(0, 1) === 1; let a; do a = 5 * rng.entero(14, 26); while (si && a === 90); const c = si ? 180 - a : 180 - a + 5 * rng.elegir([-3, -2, -1, 1, 2, 3]);
    const ok = si ? 'Sí: A y C suman 180°' : `No: A y C suman ${a + c}°`;
    const otros = si ? [['No: A y C no son iguales', 'GE-CIC4', 'No hace falta que sean iguales: basta que sumen 180°.'], ['No: A y C deben medir 90°', 'GE-CIC8', 'Eso pasa en el rectángulo; basta que los opuestos sumen 180°.']]
      : [['Sí: todo cuadrilátero se puede', 'GE-CIC7', 'Todo triángulo se puede; un cuadrilátero, solo si sus opuestos suman 180°.'], ['Sí, si se agranda la circunferencia', 'GE-CIC7', 'El tamaño no cambia los ángulos.']];
    otros.push(['Faltan los ángulos B y D', 'GE-CIC9', 'Un par de opuestos alcanza.']);
    return { texto: true, enunciado: [`En el cuadrilátero convexo ABCD, m∠A = ${a}° y m∠C = ${c}°.`], pregunta: ['¿Se puede inscribir en una circunferencia?'], datos: [D.inscr],
      correcta: { clave: si ? 'si' : 'no', texto: ok },
      errores: otros.map(([t, id, e], k) => ({ id, clave: `o${k}`, texto: t, explicacion: e, respaldo: 'hipotesis' })),
      solucion: [[`${a}° + ${c}° = ${a + c}°.`], [si ? 'Suman 180°: ' : 'No suman 180°: ', v('x', si ? 'sí se puede' : 'no se puede'), '.']],
      _datos: { tipo: 'inscriptible', idea: 'cuadrilatero-inscrito', nivel: 2, a, c } };
  }

  const TIPOS = { cuerda, tangente, iso, flecha, pitot, triangulo, poncelet, trapecio, posicion, tocan, radio, monedas, inscrito, semi, menor, diametro,
    interior, exterior, tangentes, cercano, opuesto, 'opuesto-x': opuestoX, 'exterior-cic': exteriorCic, inscriptible };
  const IDEAS = {
    tangentes: ['cuerda', 'tangente', 'iso', 'flecha'],
    'poncelet-pitot': ['pitot', 'triangulo', 'poncelet', 'trapecio'],
    posiciones: ['posicion', 'tocan', 'radio', 'monedas'],
    inscrito: ['inscrito', 'semi', 'menor', 'diametro'],
    'interior-exterior': ['interior', 'exterior', 'tangentes', 'cercano'],
    'cuadrilatero-inscrito': ['opuesto', 'opuesto-x', 'exterior-cic', 'inscriptible'],
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): las seis ideas.
  const PAPEL = { 'papel-1': 'cuerda', 'papel-2': 'pitot', 'papel-3': 'tocan', 'papel-4': 'semi', 'papel-5': 'exterior', 'papel-6': 'opuesto-x', 'papel-7': 'trapecio', 'papel-8': 'tangentes' };
  // Prueba del curso (reserva ci-01 y ci-02: catalogo/pruebas/geometria.json).
  const PRUEBA = { 'ci-01': 'pitot', 'ci-02': 'tangentes' };

  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const fijo = PAPEL[String(semilla)] || PRUEBA[String(semilla)] || opciones.tipo;
    const idea = opciones.idea && IDEAS[opciones.idea] ? opciones.idea : rng.elegir(Object.keys(IDEAS));
    const tipo = fijo || rng.elegir(IDEAS[idea]);
    for (let intento = 0; intento < 200; intento++) {
      const pr = TIPOS[tipo](rng);
      let alternativas;
      if (pr.texto) alternativas = P.armarTexto({ correcta: pr.correcta, errores: rng.barajar(pr.errores), rng });
      else {
        const errores = pr.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && P.enEscala(e.valor, pr.correcta, e.id));
        alternativas = P.armar({ correcta: pr.correcta, errores, rng, texto: pr.fmt });
      }
      if (alternativas.length < 4) continue;
      const valor = pr.texto ? pr.correcta.clave : pr.correcta;
      return { id: `${ID}#${semilla}`, variables: { x: { nombre: 'lo que se pide', color: 'f' } },
        enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas, solucion: pr.solucion,
        respuesta: { valor, unidad: '' }, _datos: Object.assign({ valor }, pr._datos) };
    }
    throw new Error(`${ID}: no se pudo generar un problema con 4 alternativas distintas (${tipo})`);
  }

  // TIPOS_POR_IDEA: lo que lee el catálogo para «Practicar por idea» (herramientas/construir-catalogo.js).
  return { id: ID, titulo: 'Circunferencia y ángulos en ella', generar, TIPOS: Object.keys(TIPOS), IDEAS, TIPOS_POR_IDEA: IDEAS };
});
