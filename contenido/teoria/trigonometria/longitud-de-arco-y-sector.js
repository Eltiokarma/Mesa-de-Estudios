/*
 * Teoría de «Longitud de arco y sector circular» (trigonometria.longitud-de-arco-y-sector), para 5.º de secundaria y
 * preuniversitario. Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 2) y la propuesta
 * docs/etapa6/propuesta-trigonometria.md (Etapa 6, 19 nov; Gerson delegó el criterio: sus decisiones están en la
 * sección 9). Compañera: Mara (coneja), cercana y rigurosa: el ángulo va en radianes antes de multiplicarlo por un largo.
 *
 * Cinco ideas, con sus id de siempre: `arco` (longitud de arco), `sector` (área del sector circular), `trapecio-circular`,
 * `vueltas-rueda` (número de vueltas de una rueda) y `faja-y-eje` (ruedas unidas). Objeto de cada primera pantalla
 * (pieza trig-arco, dibujos de prueba): el columpio, el abanico de papel, el limpiaparabrisas, la rueda de la bicicleta
 * que deja su huella y la transmisión de la bicicleta (plato, cadena y piñón).
 *
 * REGLA DE COLORES DE LA UNIDAD (propuesta §6; molde §5b, «un color fijo por magnitud»):
 *   - carmín (h): el ángulo θ, en cualquier sistema (60° y π/3 rad son el mismo ángulo), y su arco chico junto al vértice;
 *   - naranja (o): los radios r, r₁, r₂ (la cadena, las varillas, el brazo, el plato y el piñón); en la unidad anterior el
 *     radio ya era naranja;
 *   - turquesa (i): los arcos s, s₁, s₂ y lo que avanza el centro de una rueda, d (es el arco que rueda su borde);
 *   - violeta (f): lo que se busca casi siempre al final: el área A (ideas 2 y 3) y el número de vueltas n (ideas 4 y 5);
 *     nunca van juntos en un mismo problema;
 *   - tinta: el ancho h del trapecio, π, el objeto y lo que se pide antes de hallarlo («?»). Verde: no se usa.
 *   En la rama, el ángulo es carmín en las tres unidades (Ángulo trigonométrico, esta y Razones). «Ángulo trigonométrico»
 *   pinta además los radianes en violeta porque su tema es el sistema de medida; aquí un mismo ángulo («60°» y «π/3 rad»)
 *   va en un solo color y la palabra «rad» dice el sistema (propuesta §6 y decisiones 4 y 19).
 *   Lo comprueba longitud-de-arco-y-sector.test.js en cada texto y cada figura (con «Ahora tú» y «Así se resuelve» en 400
 *   semillas).
 * Letras (propuesta §5, campo `letras`): θ el ángulo central (en las fórmulas, en radianes); r un radio, r₁ y r₂ el de
 * adentro y el de afuera de un trapecio circular o los de las ruedas 1 y 2; s la longitud de arco, s₁ y s₂ los arcos de
 * adentro y de afuera; A el área; h el ancho del trapecio; n el número de vueltas; d lo que avanza el centro de la rueda.
 * R y L no se usan: en «Ángulo trigonométrico» R es el número de radianes y el radio es siempre r minúscula.
 * Lo que no entra: las razones trigonométricas (la unidad siguiente), la cicloide y la velocidad angular (Física).
 * Física («Movimiento circular») usa las mismas letras y la misma regla (s = θ · r con θ en radianes; al rodar sin
 * resbalar, la rueda avanza el arco que recorre su borde): esta unidad no la contradice.
 * Errores: TR2 (documentado) y TR4 (sale de TR2 y TR3) son de docs/investigacion/trigonometria-ideas-erroneas.md; los
 * demás son hipótesis de aula, en el comentario de cada idea.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: con θ en radianes, el radio entra una vez en el arco y dos en el área; una rueda gira lo que avanza su
 *     centro, y dos ruedas unidas por una cadena recorren el mismo arco.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, con o sin conexión.
 *   Resultado observable: calcula arcos, áreas de sector y de trapecio circular, vueltas de una rueda y giros de ruedas
 *     unidas por faja, engranaje o eje.
 *   Orden de atención: 1.º el objeto · 2.º el arco turquesa · acción: mover el ángulo o el radio · fondo: lo quieto, punteado.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué 60° con un radio de 2 m no dan un arco de 120 m, y por qué una moneda que rodea a otra
 *     da dos vueltas?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const fg = (x, d = 2) => f(x, d).replace(/\s/g, '');
  // Una relación que no se parte en dos líneas: sus espacios pasan a espacios duros (como en «Ángulo trigonométrico»).
  const SEP = '   ·   ', FL = '   →   ';
  const junto = x => (typeof x === 'string' ? x.replace(/ /g, '\u00a0') : Array.isArray(x) ? x.map(junto)
    : x && typeof x === 'object' && !('v' in x) ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, junto(v)])) : x);
  // En una lectura, un número no se separa de su unidad al partir el renglón (el resto sí se parte).
  const jN = x => (typeof x === 'string' ? x.replace(/([\dπ]) (?=(cm²|m²|cm|m|rad|vueltas|vuelta)(?![a-zñ]))/g, '$1\u00a0') : Array.isArray(x) ? x.map(jN) : x);
  // Colores de la unidad (cabecera): ángulo carmín, radios naranja, arcos turquesa, área y vueltas violeta.
  const dH = t => ({ v: 'c-h', t }), dO = t => ({ v: 'c-o', t }), dI = t => ({ v: 'c-i', t }), dF = t => ({ v: 'c-f', t });
  const th = dH('θ'), r = dO('r'), s = dI('s'), A = dF('A'), nv = dF('n'), dd = dI('d');
  const sub = (x, i) => ({ sub: [x, i] });
  const r1 = sub(r, '1'), r2 = sub(r, '2'), s1 = sub(s, '1'), s2 = sub(s, '2'), th1 = sub(th, '1'), th2 = sub(th, '2');
  const n1 = sub(nv, '1'), n2 = sub(nv, '2'), n3 = sub(nv, '3'), r3 = sub(r, '3');
  const cuad = x => ({ sup: [x, '2'] });
  const neg = t => ({ negrita: [t] });
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  // (p/q)·π, simplificado: «π/2», «−3π/4», «2π», «0»; con texto detrás («cm»), «2π cm».
  function piFrac(p, q) {
    if (p === 0) return '0';
    const m = gcd(p, q), num = p / m, den = q / m, sg = num * den < 0 ? '−' : '', a = Math.abs(num), b = Math.abs(den);
    return `${sg}${a === 1 ? '' : a}π${b === 1 ? '' : '/' + b}`;
  }
  const piTxt = g => piFrac(Math.round(g), 180);                // grados → radianes, como fracción de π
  const PI = Math.PI, RAD = PI / 180;
  // Azar con semilla para «Ahora tú» y «Así se resuelve» (el de la unidad anterior).
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un texto (o no son números) se descartan.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      if (!x || x.valor === null || x.valor === undefined || (typeof x.valor === 'number' && !(Number.isFinite(x.valor) && x.valor > 0))) continue;
      const txt = fmt(x.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Cuatro opciones siempre: si un caso sale con menos, se arma otro con el mismo azar.
  function conCuatro(caso, rr) {
    for (let i = 0; i < 80; i++) { const c = caso(rr); if (c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  // Un número con π: p·π/q escrito como fracción, con su unidad («10π cm», «8π/3 cm²»). El valor, para comparar.
  const conPi = (p, q, u) => `${piFrac(p, q)} ${u}`;
  // La letra de una alternativa, en negrita (molde §3): la de `alt` en su lista.
  // Una figura que deja medir lo que se pide (un ángulo dibujado con su medida, un largo con otro largo de la misma figura)
  // va con este aviso (auditoría del cierre, 19 nov; etapa-delegada.md, «Lo que encontraron los auditores», 5).
  const NO_ESC = ' El dibujo no está a escala.';
  // Un ángulo que se pide, dibujado con otra abertura: lejos de la que se pide (cierre, 19 nov).
  const otraAbertura = g => (Math.abs(g - 100) >= 25 ? 100 : 55);
  const letra = (alts, alt) => { const k = alts.indexOf(alt); if (k < 0) throw new Error(`«${alt}» no es alternativa`); return neg('ABCDE'[k]); };

  // Figuras: los objetos de la pieza trig-arco.
  const OB = 'trig-arco';
  const fig = datos => ({ pieza: OB, datos, estado: {} });
  const sec = (g, rot, extra = {}) => fig(Object.assign({ objeto: 'figura', g, rot }, extra));

  // ====================================================================================================================
  // Idea 1: longitud de arco
  // ====================================================================================================================
  // Objeto de la primera pantalla: un columpio del parque, visto de lado (la cadena es el radio).
  // Cambia: el ángulo θ que gira la cadena (en radianes) y el largo r de la cadena. · Permanece: el travesaño y la cadena
  // quieta, punteada (el lado inicial). · Progresa: el arco turquesa del asiento. · Se reserva: un ángulo dado en grados
  // (la predicción: el juego solo da radianes). · Debe verse: el arco mide θ cadenas.
  // Errores: TR4 multiplica con el ángulo en grados; TR2 cree que el arco de 60° mide un radio («60° es un radián»);
  // ARCO-DIAM usa el diámetro; ARCO-DIVIDE divide en vez de multiplicar; ARCO-INV invierte s/r; TR3 deja el número de
  // radianes como si fueran grados; RAD-200 pasa con 200 (centesimales) al ir a grados o con 180 desde centesimales;
  // RAD-SIN-PI olvida π; VUELTA-PI toma la vuelta por π rad (todas hipótesis, salvo TR2 y TR4).
  const columpio = (rv, t, rot) => ({ objeto: 'columpio', r: rv, t, rot });
  // Datos de los ejercicios (contrato, punto 13): equivalencias, definiciones y la fórmula, una por línea.
  const D1 = {
    arco: ['Longitud de arco: ', s, ' = ', th, ' · ', r, ', con ', th, ' en radianes.'],
    pi: [dH('π rad'), ' = ', dH('180°'), '.'],
    piC: [dH('π rad'), ' = ', dH('180°'), ' = ', dH('200ᵍ'), '.'],
    piNum: 'π ≈ 3,14.',
    vuelta: ['1 vuelta = ', dH('2π rad'), '.'],
    minutero: 'El minutero da 1 vuelta en 60 min.',
    cm: '1 m = 100 cm.',
  };
  // Ejemplos resueltos de la idea 1 (pestaña «Ejemplos»; molde §3). Cuentas rehechas con un script aparte que no usa este
  // archivo (scratchpad e6-trigonometria/cuentas.js): 1·2; 3·5; π/3·9; 12/4; 4π/(π/2); 40°→2π/9 y ·18; 20°→π/9 y ·45;
  // 5π/12 y ·180/π; 90/180; π/2 por 4 y por 10 (los arcos de igual ángulo); el minutero 20/60·2π·15; 50ᵍ→π/4 y ·16;
  // 2 rad·180/π; 6π/(π/3) + 6π/(π/4); 0,5π/(π/4), y el valor de cada alternativa equivocada.
  // La figura muestra el planteamiento: lo que se pide va con «?» en tinta o no se dibuja.
  const ALT1 = {
    minutero: ['300 cm', '10π cm', '5π cm', '20π cm', '30π cm'],
    cent: ['40π/9 cm', '8π cm', '4π cm', '800 cm', '2π cm'],
    dos: ['2°', '360°', '120°', '57,3°', '114,6°'],
    radios: ['18 cm', '42 cm', '24 cm', '0,73 cm', '84 cm'],
    cadena: ['2 m', '4 m', '1,23 m', '0,03 m', '0,5 m'],
  };
  const EJEMPLOS_ARCO = [
    { nivel: 1, titulo: 'Un radián de cadena', figura: fig(columpio(2, 1, { r: 'r = 2 m', t: 'θ = 1 rad', s: 's = ?' })),
      enunciado: ['La cadena de un columpio mide 2 m y gira ', dH('1 rad'), ' desde donde colgaba quieta. ¿Cuánto mide el arco que recorre el asiento?'],
      datos: [D1.arco],
      solucion: [{ texto: '1 rad es un arco del largo del radio: el asiento recorre una cadena.', ecuacion: junto([s, ' = ', dH('1'), ' · ', dO('2 m'), ' = ', dI('2 m')]) }],
      respuesta: [s, ' = ', dI('2 m')] },
    { nivel: 1, titulo: 'Tres radianes', figura: sec(171.9, { r: 'r = 5 cm', t: 'θ = 3 rad', s: 's = ?' }),
      enunciado: ['En una circunferencia de 5 cm de radio, un ángulo central mide ', dH('3 rad'), '. ¿Cuánto mide su arco?'],
      datos: [D1.arco],
      solucion: [{ texto: 'El arco mide 3 radios de 5 cm.', ecuacion: junto([s, ' = ', dH('3'), ' · ', dO('5 cm'), ' = ', dI('15 cm')]) }],
      respuesta: [s, ' = ', dI('15 cm')] },
    { nivel: 1, titulo: 'Con π en el ángulo', figura: sec(60, { r: 'r = 9 cm', t: 'θ = π/3 rad', s: 's = ?' }),
      enunciado: ['En una circunferencia de 9 cm de radio, un ángulo central mide ', dH('π/3 rad'), '. ¿Cuánto mide su arco?'],
      datos: [D1.arco],
      solucion: [{ texto: 'El ángulo ya está en radianes: se multiplica por el radio. π queda escrito.', ecuacion: junto([s, ' = ', dH('π/3'), ' · ', dO('9 cm'), ' = ', dI('3π cm')]) }],
      respuesta: [s, ' = ', dI('3π cm')] },
    { nivel: 1, titulo: 'El ángulo, desde el arco', figura: sec(140, { r: 'r = 4 cm', t: 'θ = ?', s: 's = 12 cm' }),
      enunciado: 'Un arco de 12 cm está en una circunferencia de 4 cm de radio. ¿Cuánto mide su ángulo central, en radianes?' + NO_ESC,
      datos: [D1.arco],
      solucion: [{ texto: 'Se cuenta cuántos radios caben en el arco: se divide.', ecuacion: junto([th, ' = ', { frac: [s, r] }, ' = ', { frac: [dI('12 cm'), dO('4 cm')] }, ' = ', dH('3 rad')]) }],
      respuesta: [th, ' = ', dH('3 rad')] },
    { nivel: 1, titulo: 'El radio, desde el arco', figura: sec(90, { r: 'r = ?', t: 'θ = π/2 rad', s: 's = 4π cm' }),
      enunciado: ['Un arco de 4π cm abarca un ángulo central de ', dH('π/2 rad'), '. ¿Cuánto mide el radio?'],
      datos: [D1.arco],
      solucion: [{ texto: 'Si el arco mide θ radios, el radio es el arco entre θ.', ecuacion: junto([r, ' = ', { frac: [s, th] }, ' = ', { frac: [dI('4π'), dH('π/2')] }, ' = ', dO('8 cm')]) }],
      respuesta: [r, ' = ', dO('8 cm')] },
    { nivel: 2, titulo: 'Grados primero', figura: sec(40, { r: 'r = 18 cm', t: '40°', s: 's = ?' }),
      enunciado: ['En una circunferencia de 18 cm de radio, un ángulo central mide ', dH('40°'), '. ¿Cuánto mide su arco?'],
      datos: [D1.arco, D1.pi],
      solucion: [
        { texto: 'El ángulo viene en grados: primero se pasa a radianes.', ecuacion: junto([dH('40°'), ' = ', { frac: ['40', '180'] }, ' · π rad = ', dH('2π/9 rad')]) },
        { texto: 'Después, por el radio:', ecuacion: junto([s, ' = ', dH('2π/9'), ' · ', dO('18 cm'), ' = ', dI('4π cm')]) },
      ],
      respuesta: [s, ' = ', dI('4π cm')] },
    { nivel: 2, titulo: 'El péndulo del reloj', figura: sec(20, { r: 'r = 45 cm', t: '20°', s: 's = ?' }),
      enunciado: ['El péndulo de un reloj de pared mide 45 cm y se aleja ', dH('20°'), ' de la vertical. ¿Cuánto mide el arco que recorre su punta?'],
      datos: [D1.arco, D1.pi, D1.piNum],
      solucion: [
        { texto: 'A radianes:', ecuacion: junto([dH('20°'), ' = ', { frac: ['20', '180'] }, ' · π rad = ', dH('π/9 rad')]) },
        { texto: 'Por el largo del péndulo, que es el radio:', ecuacion: junto([s, ' = ', dH('π/9'), ' · ', dO('45 cm'), ' = ', dI('5π cm'), ' ≈ ', dI('15,7 cm')]) },
      ],
      respuesta: [s, ' = ', dI('5π cm'), ' ≈ ', dI('15,7 cm')] },
    { nivel: 2, titulo: 'El ángulo, en grados', figura: sec(110, { r: 'r = 12 cm', t: 'θ = ?', s: 's = 5π cm' }),
      enunciado: 'Un arco de 5π cm está en una circunferencia de 12 cm de radio. ¿Cuánto mide su ángulo central, en grados?' + NO_ESC,
      datos: [D1.arco, D1.pi],
      solucion: [
        { texto: 'Primero en radianes: los radios que caben en el arco.', ecuacion: junto([th, ' = ', { frac: [dI('5π'), dO('12')] }, ' = ', dH('5π/12 rad')]) },
        { texto: 'Después, a grados: π rad son 180°, así que π se cambia por 180°.', ecuacion: junto([dH('5π/12 rad'), ' = ', { frac: ['5', '12'] }, ' · 180° = ', dH('75°')]) },
      ],
      respuesta: [th, ' = ', dH('75°')] },
    { nivel: 2, titulo: 'Metros y centímetros', figura: fig(columpio(1.8, 0.9, { r: 'r = 1,8 m', t: 'θ = ?', s: 's = 90 cm' })),
      enunciado: 'La cadena de un columpio mide 1,8 m, y el asiento recorre un arco de 90 cm. ¿Qué ángulo giró la cadena, en radianes?' + NO_ESC,
      datos: [D1.arco, D1.cm],
      solucion: [
        { texto: 'El arco y el radio van en la misma unidad: 90 cm son 0,9 m.' },
        { texto: 'Se divide:', ecuacion: junto([th, ' = ', { frac: [dI('0,9 m'), dO('1,8 m')] }, ' = ', dH('0,5 rad')]) },
      ],
      respuesta: [th, ' = ', dH('0,5 rad')] },
    { nivel: 2, titulo: 'Dos arcos del mismo ángulo', figura: sec(90, { r: 'r₂ = 10 cm', r1: 'r₁ = 4 cm', s: 's₂ = ?', s1: 's₁ = 2π cm', t: 'θ' }, { r1: 0.4 }),
      enunciado: ['Dos circunferencias tienen el mismo centro y radios ', r1, ' = 4 cm y ', r2, ' = 10 cm. Un ángulo central abarca en la chica un arco ', s1, ' = 2π cm. ¿Cuánto mide el arco ', s2, ' que abarca en la grande?'],
      datos: [D1.arco],
      solucion: [
        { texto: 'El ángulo, con la chica:', ecuacion: junto([th, ' = ', { frac: [dI('2π'), dO('4')] }, ' = ', dH('π/2 rad')]) },
        { texto: 'El mismo ángulo, con el radio grande:', ecuacion: junto([s2, ' = ', dH('π/2'), ' · ', dO('10 cm'), ' = ', dI('5π cm')]) },
      ],
      respuesta: [s2, ' = ', dI('5π cm')] },
    // Nivel 3, tipo examen, con cinco alternativas. Las figuras no tienen puntos con letras: el resuelto nombra cada
    // alternativa por su letra. Letras de las correctas: B, C, E, B, A.
    { nivel: 3, titulo: 'La punta del minutero',
      enunciado: 'El minutero de un reloj de pared mide 15 cm. ¿Cuánto recorre su punta entre las 3:10 y las 3:30?',
      alternativas: ALT1.minutero,
      datos: [D1.arco, D1.minutero, D1.vuelta],
      solucion: [
        { texto: 'Pasan 20 minutos: un tercio de la vuelta.', ecuacion: junto([th, ' = ', { frac: ['20', '60'] }, ' · 2π rad = ', dH('2π/3 rad')]) },
        { texto: 'El minutero es el radio:', ecuacion: junto([s, ' = ', dH('2π/3'), ' · ', dO('15 cm'), ' = ', dI('10π cm')]) },
        { texto: ['La ', letra(ALT1.minutero, '300 cm'), ' multiplica 20 minutos por 15; la ', letra(ALT1.minutero, '5π cm'), ' toma la vuelta por π rad; la ', letra(ALT1.minutero, '20π cm'), ' usa el diámetro; la ', letra(ALT1.minutero, '30π cm'), ' da la vuelta entera.'] },
      ],
      respuesta: [letra(ALT1.minutero, '10π cm'), ', ', dI('10π cm')] },
    { nivel: 3, titulo: 'Un ángulo en centesimales', figura: sec(45, { r: 'r = 16 cm', t: '50ᵍ', s: 's = ?' }),
      enunciado: ['En una circunferencia de 16 cm de radio, un ángulo central mide ', dH('50ᵍ'), '. ¿Cuánto mide su arco?'],
      alternativas: ALT1.cent,
      datos: [D1.arco, D1.piC],
      solucion: [
        { texto: 'Media vuelta son 200ᵍ y también π rad:', ecuacion: junto([dH('50ᵍ'), ' = ', { frac: ['50', '200'] }, ' · π rad = ', dH('π/4 rad')]) },
        { texto: 'Por el radio:', ecuacion: junto([s, ' = ', dH('π/4'), ' · ', dO('16 cm'), ' = ', dI('4π cm')]) },
        { texto: ['La ', letra(ALT1.cent, '40π/9 cm'), ' divide entre 180, como si fueran grados sexagesimales; la ', letra(ALT1.cent, '800 cm'), ' multiplica 50 por 16; la ', letra(ALT1.cent, '8π cm'), ' usa el diámetro; la ', letra(ALT1.cent, '2π cm'), ' usa la mitad del radio.'] },
      ],
      respuesta: [letra(ALT1.cent, '4π cm'), ', ', dI('4π cm')] },
    { nivel: 3, titulo: 'Un arco de dos radios',
      enunciado: 'En una circunferencia, un arco mide lo mismo que dos radios. ¿Cuánto mide su ángulo central, aproximadamente?',
      alternativas: ALT1.dos,
      datos: [D1.arco, D1.pi, D1.piNum],
      solucion: [
        { texto: 'El arco mide dos radios: el ángulo mide 2 rad, con cualquier radio.', ecuacion: junto([th, ' = ', { frac: [['2', r], r] }, ' = ', dH('2 rad')]) },
        { texto: 'A grados:', ecuacion: junto(['2 · ', { frac: ['180°', '3,14'] }, ' ≈ ', dH('114,6°')]) },
        { texto: ['La ', letra(ALT1.dos, '2°'), ' toma los radianes por grados; la ', letra(ALT1.dos, '360°'), ' lee 2 rad como 2π rad; la ', letra(ALT1.dos, '120°'), ' toma un radián por 60°; la ', letra(ALT1.dos, '57,3°'), ' es un solo radián.'] },
      ],
      respuesta: [letra(ALT1.dos, '114,6°'), ', ≈ ', dH('114,6°')] },
    { nivel: 3, titulo: 'Un arco, dos ángulos',
      enunciado: ['En dos circunferencias, un arco de 6π cm abarca ', dH('60°'), ' en la primera y ', dH('45°'), ' en la segunda. ¿Cuánto suman sus dos radios?'],
      alternativas: ALT1.radios,
      datos: [D1.arco, D1.pi],
      solucion: [
        { texto: 'Los ángulos, en radianes: 60° = π/3 rad y 45° = π/4 rad. Cada radio es el arco entre su ángulo:', ecuacion: [junto([{ frac: [dI('6π'), dH('π/3')] }, ' = ', dO('18 cm')]), SEP, junto([{ frac: [dI('6π'), dH('π/4')] }, ' = ', dO('24 cm')])] },
        { texto: 'La suma:', ecuacion: junto([dO('18 cm'), ' + ', dO('24 cm'), ' = ', dO('42 cm')]) },
        { texto: ['La ', letra(ALT1.radios, '18 cm'), ' y la ', letra(ALT1.radios, '24 cm'), ' son un solo radio; la ', letra(ALT1.radios, '0,73 cm'), ' divide 6π entre 60 y entre 45, en grados, y suma; la ', letra(ALT1.radios, '84 cm'), ' suma los diámetros.'] },
      ],
      respuesta: [letra(ALT1.radios, '42 cm'), ', ', dO('42 cm')] },
    // Sin figura: el columpio solo dibuja el arco desde donde cuelga quieto, y aquí el asiento va de un extremo al otro
    // (medio vaivén dibujado lleva a la alternativa de 4 m; cierre, 19 nov).
    { nivel: 3, titulo: 'De un extremo al otro',
      enunciado: ['Un columpio se mueve de un extremo al otro: su cadena se aleja ', dH('22,5°'), ' a cada lado de donde cuelga quieta, y el asiento recorre 0,5π m. ¿Cuánto mide la cadena?'],
      alternativas: ALT1.cadena,
      datos: [D1.arco, D1.pi],
      solucion: [
        { texto: 'De un extremo al otro, la cadena gira 22,5° hacia un lado y 22,5° hacia el otro:', ecuacion: junto(['22,5° + 22,5° = ', dH('45°'), ' = ', dH('π/4 rad')]) },
        { texto: 'El radio es el arco entre el ángulo:', ecuacion: junto([r, ' = ', { frac: [dI('0,5π'), dH('π/4')] }, ' = ', dO('2 m')]) },
        { texto: ['La ', letra(ALT1.cadena, '4 m'), ' usa solo 22,5°; la ', letra(ALT1.cadena, '1,23 m'), ' multiplica el arco por el ángulo; la ', letra(ALT1.cadena, '0,03 m'), ' divide entre 45, en grados; la ', letra(ALT1.cadena, '0,5 m'), ' divide el ángulo entre el arco.'] },
      ],
      respuesta: [letra(ALT1.cadena, '2 m'), ', ', dO('2 m')] },
  ];

  // «Ahora tú», tipo 0: el radio, con el arco y el ángulo en grados.
  const GRADOS = [20, 30, 36, 40, 45, 60, 72, 90, 120, 135, 150];
  const COSAS1 = [
    { que: 'circunferencia', frase: (sT, g) => ['En una circunferencia, un arco de ', dI(`${sT} cm`), ' abarca un ángulo central de ', dH(`${g}°`), '. ¿Cuánto mide el radio?'] },
    { que: 'rueda', frase: (sT, g) => ['Un pedazo de llanta de ', dI(`${sT} cm`), ' abarca ', dH(`${g}°`), ' desde el centro de la rueda. ¿Cuánto mide el radio de la rueda?'] },
  ];
  function casoRadio(rr) {
    const g = rr.uno(GRADOS), rv = rr.uno([6, 9, 10, 12, 15, 18, 20, 24, 30, 36]), sT = piFrac(g * rv, 180), cosa = rr.uno(COSAS1);
    const sV = g * RAD * rv;
    return {
      pregunta: cosa.frase(sT, g),
      datos: [D1.arco, D1.pi],
      dibujo: sec(g, { r: 'r = ?', t: `${g}°`, s: `s = ${sT} cm` }),
      opciones: opciones(rv, [
        { id: 'grados', valor: Math.round(sV / g * 1000) / 1000, error: 'TR4', siFuera: `Dividir el arco entre el ángulo está bien, con θ en radianes: ${g}° son ${piTxt(g)} rad.` },
        { id: 'diam', valor: 2 * rv, error: 'ARCO-DIAM', siFuera: `Pasar ${g}° a ${piTxt(g)} rad está bien; pero eso es el diámetro: dos radios.` },
        { id: 'por', valor: Math.round(sV * g * RAD * 100) / 100, error: 'ARCO-POR', siFuera: `Pasar a ${piTxt(g)} rad está bien; pero el radio es el arco entre el ángulo, no por él.` },
        { id: 'sinpi', valor: `${f(rv)}π`, error: 'RAD-SIN-PI', siFuera: `Dividir entre ${g}/180 está bien; falta π: ${g}° son ${piTxt(g)} rad.` },
      ], v => `${typeof v === 'string' ? v : f(v, 3)} cm`),
      solucion: { texto: `${g}° son ${piTxt(g)} rad. El radio es el arco entre el ángulo.`, ecuacion: junto([r, ' = ', { frac: [dI(sT), dH(piTxt(g))] }, ' = ', dO(`${rv} cm`)]) },
    };
  }
  // «Ahora tú», tipo 1: el ángulo en grados, con el arco y el radio.
  function casoAngulo(rr) {
    const g = rr.uno(GRADOS), rv = rr.uno([4, 6, 8, 9, 10, 12, 15, 18, 20]), sT = piFrac(g * rv, 180), th0 = g * RAD;
    const fmtG = v => `${f(v, 2)}°`;
    return {
      pregunta: ['En una circunferencia de ', dO(`${rv} cm`), ' de radio, un arco mide ', dI(`${sT} cm`), '. ¿Cuánto mide su ángulo central, en grados?' + NO_ESC],
      datos: [D1.arco, D1.pi],
      dibujo: sec(otraAbertura(g), { r: `r = ${rv} cm`, t: 'θ = ?', s: `s = ${sT} cm` }),
      opciones: opciones(g, [
        { id: 'tr3', valor: Math.round(th0 * 100) / 100, error: 'TR3', siFuera: `Dividir el arco entre el radio está bien: da ${piTxt(g)} rad. Falta pasar los radianes a grados.` },
        { id: 'inv', valor: Math.round(1 / th0 * 180 / PI * 100) / 100, error: 'ARCO-INV', siFuera: 'Pasar a grados está bien; pero el ángulo es el arco entre el radio, no al revés.' },
        { id: 'doscientos', valor: Math.round(g * 10 / 9 * 100) / 100, error: 'RAD-200', siFuera: `Dividir s entre r está bien; pero π rad son 180°, no 200: así salen centesimales.` },
        { id: 'diam', valor: g / 2, error: 'ARCO-DIAM', siFuera: 'Pasar a grados está bien; pero se divide entre el radio, no entre el diámetro.' },
      ], fmtG),
      solucion: { texto: `El ángulo en radianes es s ÷ r: ${piTxt(g)} rad. Después, π rad son 180°.`, ecuacion: junto([th, ' = ', { frac: [dI(sT), dO(`${rv}`)] }, ` = ${piTxt(g)} rad = `, dH(`${g}°`)]) },
    };
  }
  // «Ahora tú», tipo 2 (nivel de examen): el minutero de un reloj (minutos → vueltas → radianes) o un ángulo en grados
  // centesimales (la conversión de la unidad anterior, antes de multiplicar).
  function casoExamen1(rr) {
    if (rr.ent(0, 1)) {
      let L, m;
      do { L = rr.uno([6, 9, 12, 15, 18, 24]); m = rr.uno([5, 10, 15, 20, 25, 40, 45, 50]); } while (L === 15 && m === 20);   // el ejemplo del minutero
      return {
        pregunta: ['El minutero de un reloj mide ', dO(`${L} cm`), `. ¿Cuánto recorre su punta en ${m} minutos?`],
        datos: [D1.arco, D1.minutero, D1.vuelta],
        opciones: opciones(conPi(m * L, 30, 'cm'), [
          { id: 'grados', valor: `${fg(6 * m * L)} cm`, error: 'TR4', siFuera: `Un minuto son 6°, es cierto; pero s = θ · r pide θ en radianes: ${m} min son ${piFrac(m, 30)} rad.` },
          { id: 'vueltaPi', valor: conPi(m * L, 60, 'cm'), error: 'VUELTA-PI', siFuera: `La fracción ${m}/60 de la vuelta está bien; pero la vuelta mide 2π rad, no π.` },
          { id: 'diam', valor: conPi(m * L, 15, 'cm'), error: 'ARCO-DIAM', siFuera: 'El ángulo en radianes está bien; pero el minutero es el radio, no el diámetro.' },
          { id: 'minutos', valor: `${fg(m * L)} cm`, error: 'ARCO-MINUTOS', siFuera: `Multiplicar por el radio está bien; pero ${m} minutos no son ${m} radianes: son ${piFrac(m, 30)} rad.` },
        ], v => v),
        solucion: { texto: `${m} de los 60 minutos de una vuelta: ${piFrac(m, 30)} rad. Por el radio:`, ecuacion: junto([s, ' = ', dH(piFrac(m, 30)), ' · ', dO(`${L} cm`), ' = ', dI(conPi(m * L, 30, 'cm'))]) },
      };
    }
    let C, rv;
    do { C = rr.uno([10, 20, 25, 40, 50, 75, 80, 100, 120, 150]); rv = rr.uno([4, 6, 8, 10, 12, 16, 20]); } while (C === 50 && rv === 16);   // el ejemplo
    return {
      pregunta: ['En una circunferencia de ', dO(`${rv} cm`), ' de radio, un ángulo central mide ', dH(`${C}ᵍ`), '. ¿Cuánto mide su arco?'],
      datos: [D1.arco, D1.piC],
      dibujo: sec(C * 0.9, { r: `r = ${rv} cm`, t: `${C}ᵍ`, s: 's = ?' }),
      opciones: opciones(conPi(C * rv, 200, 'cm'), [
        { id: 'sexa', valor: conPi(C * rv, 180, 'cm'), error: 'CONV-MISMO', siFuera: `Pasar a radianes está bien; pero ${C}ᵍ son centesimales: media vuelta es 200ᵍ, no 180.` },
        { id: 'grados', valor: `${fg(C * rv)} cm`, error: 'TR4', siFuera: `Ángulo por radio está bien, con θ en radianes: ${C}ᵍ son ${piFrac(C, 200)} rad.` },
        { id: 'diam', valor: conPi(C * rv, 100, 'cm'), error: 'ARCO-DIAM', siFuera: `${C}ᵍ = ${piFrac(C, 200)} rad está bien; pero se multiplica por el radio, no por el diámetro.` },
        { id: 'sinpi', valor: `${f(C * rv / 200, 2)} cm`, error: 'RAD-SIN-PI', siFuera: `La fracción ${C}/200 está bien; falta π: ${C}ᵍ son ${piFrac(C, 200)} rad.` },
      ], v => v),
      solucion: { texto: `Media vuelta: 200ᵍ y π rad. Así, ${C}ᵍ son ${piFrac(C, 200)} rad.`, ecuacion: junto([s, ' = ', dH(piFrac(C, 200)), ' · ', dO(`${rv} cm`), ' = ', dI(conPi(C * rv, 200, 'cm'))]) },
    };
  }

  const arco = {
    id: 'arco',
    titulo: 'Longitud de arco',
    pregunta: '¿Cuánto mide un arco si conoces su ángulo central y su radio?',
    temas: ['Longitud de arco'],
    pieza: OB,
    aprendizaje: 'El arco mide θ radios: s = θ · r, con θ en radianes; si el ángulo viene en grados, primero se pasa a radianes.',
    actividad: 'Mover la cadena de un columpio y medir el arco que recorre el asiento.',
    // Lee: el objeto y el vocabulario (arco, longitud de arco, ángulo central) y lo que se trae del radián. No dice qué
    // pasa con un ángulo en grados: eso es la predicción.
    lee: {
      tarjetas: [
        { titulo: 'El columpio del parque', texto: 'La cadena de un columpio cuelga de un travesaño. Cuando el asiento se mueve, la cadena gira desde donde colgaba quieta y el asiento recorre un pedazo de circunferencia: un arco.',
          pieza: OB, dibujo: { datos: columpio(2, 0.75, {}), estado: {} } },
        { titulo: 'Longitud de arco', texto: ['Lo que mide el arco a lo largo, como si lo estiraras, es su longitud de arco, ', s, '. El ángulo central ', th, ' tiene su vértice en el centro de la circunferencia: aquí, en el travesaño. La cadena es el radio ', r, '.'] },
        { titulo: 'Lo que ya sabes del radián', texto: 'En el tema anterior acostaste pitas del largo del radio sobre una rueda: cada pita abarcaba 1 radián desde el centro. Aquí el radio es la cadena.' },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a cambiar el ángulo ', th, ', en radianes, y el largo de la cadena. Mira cuántas cadenas mide el arco y cuántos metros.'] },
      ],
    },
    ejemplos: EJEMPLOS_ARCO,
    juega: {
      pieza: OB,
      consigna: ['La cadena del columpio es el radio ', r, ' y el asiento recorre el arco ', s, '. ', th, ' es cuánto gira la cadena desde donde cuelga quieta.'],
      mision: {
        texto: 'Con la cadena de 2 m, haz que el asiento recorra un arco de 1,5 m.',
        logrado: val => Math.abs(val.r - 2) < 1e-9 && Math.abs(val.t * val.r - 1.5) < 1e-9,
        bien: 'Listo: 0,75 rad son 0,75 cadenas de 2 m. El arco mide 1,5 m.',
      },
      voz: '¿Cuántas cadenas mide el arco?',
      leyenda: [
        { s: th, t: 'el ángulo que gira la cadena, en radianes' },
        { s: r, t: 'el radio: el largo de la cadena' },
        { s: s, t: 'longitud de arco: lo que recorre el asiento' },
        { s: 'rad', t: 'radián: un arco del largo del radio' },
        { s: 'línea punteada', t: 'la cadena quieta: el lado inicial' },
        { s: 'curva punteada', t: 'el camino que puede seguir el asiento' },
      ],
      controles: [
        { id: 't', etiqueta: 'θ, cuánto gira la cadena', color: 'c-h', min: 0.25, max: 1.25, paso: 0.25, inicio: 0.5, unidad: 'rad', decimales: 2 },
        { id: 'r', etiqueta: 'r, el largo de la cadena', color: 'c-o', min: 1.5, max: 2.5, paso: 0.5, inicio: 1.5, unidad: 'm', decimales: 1 },
      ],
      dibujo: val => ({ datos: columpio(val.r, val.t, { r: `r = ${f(val.r)} m`, t: `θ = ${f(val.t)} rad`, s: `s = ${f(val.t * val.r, 3)} m` }), estado: {} }),
      // «s = 0,5 cadenas»: el arco medido con la cadena (el lector en frío A no entendió «0,5 cadenas» suelto).
      lectura: val => jN([th, ` = ${f(val.t)} rad: `, s, ` = ${f(val.t)} ${val.t === 1 ? 'cadena' : 'cadenas'} = ${f(val.t)} · ${f(val.r)} m = ${f(val.t * val.r, 3)} m`]),
      minimo: 3,
    },
    predice: {
      pregunta: 'La cadena de otro columpio mide 2 m. Si la cadena se aleja 60° de donde cuelga quieta, ¿cuánto mide el arco que recorre el asiento?',
      datos: [D1.pi, D1.piNum],
      voz: 'Antes de multiplicar, mira en qué unidad viene el ángulo.',
      opciones: [
        { id: 'c', texto: '2π/3 m ≈ 2,09 m', correcta: true },
        { id: 'grados', texto: '120 m', error: 'TR4', siFuera: 'Ángulo por cadena es la idea, con el ángulo en radianes: 60° son π/3 rad.' },
        { id: 'radio', texto: '2 m', error: 'TR2', siFuera: 'Un arco de una cadena sería 1 rad; pero 1 rad mide unos 57°, y aquí son 60°.' },
        { id: 'diam', texto: '4π/3 m ≈ 4,19 m', error: 'ARCO-DIAM', siFuera: 'Pasar 60° a π/3 rad está bien; pero el arco se mide con una cadena, no con dos.' },
      ],
      dibujo: { datos: columpio(2, PI / 3, { r: 'r = 2 m', t: '60°', s: 's = ?' }), estado: {} },
      revelar: { datos: columpio(2, PI / 3, { r: 'r = 2 m', t: '60° = π/3 rad', s: 's = 2π/3 m' }), estado: {} },
      coincide: 'Coincide: 60° son π/3 rad, un poco más de un radián. El arco mide un poco más que la cadena.',
      noCoincide: 'Revisemos: primero el ángulo en radianes; después, por la cadena.',
    },
    mira: {
      pieza: OB,
      datos: columpio(2, PI / 3, { r: 'r = 2 m', t: [{ t: '60°' }, { t: 'π/3 rad', paso: 1 }], s: [{ t: 's = ?' }, { t: 's = 2π/3 m', paso: 2 }] }),
      voz: 'La cadena es la regla con que medimos el arco.',
      pasos: [
        { estado: { paso: 0 }, texto: 'El ángulo viene en grados: 60°.', ecuacion: [th, ' = ', dH('60°')] },
        { estado: { paso: 1 }, texto: 'Primero se pasa a radianes: π rad son 180°.', ecuacion: junto([dH('60°'), ' = ', { frac: ['60', '180'] }, ' · π rad = ', dH('π/3 rad')]) },
        { estado: { paso: 2 }, texto: 'π/3 rad son π/3 cadenas de arco: se multiplica por la cadena.', ecuacion: junto([s, ' = ', dH('π/3'), ' · ', dO('2 m'), ' = ', dI('2π/3 m'), ' ≈ ', dI('2,09 m')]) },
        { estado: { paso: 2 }, texto: 'Con 60 en vez de π/3 saldrían 120 m: más que una vuelta.', ecuacion: junto(['vuelta: 2π · ', dO('2 m'), ' ≈ 12,57 m < 120 m']) },
      ],
    },
    regla: {
      texto: 'Un arco mide tantos radios como radianes tiene su ángulo central: la longitud de arco es el ángulo, en radianes, por el radio. Así salen también θ y r.',
      ecuacion: [junto([s, ' = ', { llave: [th], nota: 'en radianes', color: 'c-h' }, ' · ', r]), SEP, junto([th, ' = ', { frac: [s, r] }]), SEP, junto([r, ' = ', { frac: [s, th] }])],
      condicion: 'θ en radianes: si viene en grados, primero se pasa con π rad = 180°. s y r, en la misma unidad.',
      voz: 'Radianes por radio: un largo, en la unidad del radio.',
      dibujo: { pieza: OB, datos: { objeto: 'figura', g: 70, rot: { r: 'r', t: 'θ', s: 's = θ · r' } }, estado: {} },
    },
    // Así se resuelve: el arco con el ángulo en grados (el columpio). «Ahora tú» pide otras cosas: el radio, el ángulo en
    // grados, y el minutero o los centesimales.
    resuelve: {
      pieza: OB,
      generar(sem) {
        const rr = azar(sem + 900), g = rr.uno([30, 36, 40, 45, 50, 54, 60, 72]), rv = rr.uno([1.5, 2, 2.5]), sT = piFrac(g * rv * 2, 360), sV = g * RAD * rv;
        const rT = `${f(rv)} m`;
        return {
          enunciado: [`La cadena de un columpio mide ${rT} y se aleja `, dH(`${g}°`), ' de donde cuelga quieta. ¿Cuánto mide el arco que recorre el asiento?'],
          datos: [D1.arco, D1.pi, D1.piNum],
          dibujo: { datos: columpio(rv, g * RAD, { r: `r = ${rT}`, t: `${g}°`, s: 's = ?' }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden la longitud de arco ', s, ': lo que recorre el asiento.'] },
            { tipo: 'datos', texto: ['La cadena es el radio, ', r, ` = ${rT}. El ángulo, `, th, ` = ${g}°, viene en grados.`] },
            { tipo: 'regla', texto: 'El arco mide tantos radios como radianes tiene el ángulo. El ángulo tiene que estar en radianes.', ecuacion: junto([s, ' = ', th, ' · ', r]) },
            { tipo: 'cuentas', texto: `Primero, ${g}° a radianes: π rad son 180°.`, ecuacion: junto([dH(`${g}°`), ' = ', { frac: [`${g}`, '180'] }, ` · π rad = `, dH(`${piTxt(g)} rad`)]) },
            { tipo: 'cuentas', texto: 'Después, por el radio.', ecuacion: junto([s, ' = ', dH(piTxt(g)), ' · ', dO(rT), ' = ', dI(`${sT} m`), ' ≈ ', dI(`${f(sV)} m`)]),
              dibujo: { datos: columpio(rv, g * RAD, { r: `r = ${rT}`, t: `${piTxt(g)} rad`, s: `s = ${sT} m` }), estado: {} } },
            { tipo: 'sentido', texto: `Tiene sentido: ${g}° es ${g < 57 ? 'menos' : 'un poco más'} que un radián (unos 57,3°), y el arco mide ${g < 57 ? 'menos' : 'un poco más'} que la cadena.` },
          ],
          respuesta: [s, ' = ', dI(`${sT} m`), ' ≈ ', dI(`${f(sV)} m`)],
        };
      },
    },
    ahoraTu: {
      pieza: OB,
      voz: 'Primero el ángulo en radianes; después, el radio.',
      generar(sem) { return conCuatro([casoRadio, casoAngulo, casoExamen1][sem % 3], azar(sem + 17)); },
    },
  };

  // ====================================================================================================================
  // Idea 2: área del sector circular
  // ====================================================================================================================
  // Objeto de la primera pantalla: un abanico de papel plegado (las varillas de los bordes son radios; el papel, el área).
  // Cambia: cuánto se abre el abanico, θ, de 30° a 180°. · Permanece: las varillas de 20 cm. · Progresa: el área violeta y
  // el arco turquesa. · Se reserva: el abanico de varillas del doble de largo (la predicción). · Debe verse: el sector es
  // la misma fracción del círculo que su ángulo de la vuelta.
  // Errores (hipótesis): SEC-LINEAL el área crece como el radio; SEC-ARCO-CUADRADO el arco crece como el área; SEC-ANGULO
  // solo mira el ángulo; SEC-MITAD olvida la mitad; SEC-ARCO da el arco por el área; SEC-SIN-RAIZ no saca la raíz de r²;
  // SEC-SOLO-ARCO y SEC-SOLO-RADIOS cuentan solo una parte del perímetro; SEC-UN-RADIO cuenta un solo radio; TR4 y TR3
  // como en la idea 1.
  const abanico = (g, rot, extra = {}) => Object.assign({ objeto: 'abanico', r: 20, g, rot }, extra);
  const D2 = {
    area: ['Área del sector: ', A, ' = ', { frac: [[th, ' · ', cuad(r)], '2'] }, ' = ', { frac: [[s, ' · ', r], '2'] }, ', con ', th, ' en radianes.'],
    arco: D1.arco,
    pi: D1.pi,
    piNum: D1.piNum,
    circulo: ['Área del círculo: π · ', cuad(r), '.'],
    perimetro: ['Perímetro del sector: dos radios y el arco, 2', r, ' + ', s, '.'],
  };
  const fraccionVuelta = g => { const m = gcd(g, 360); return `${g / m}/${360 / m}`; };
  // Ejemplos de la idea 2. Cuentas rehechas aparte (cuentas.js): 10·6/2; 2·16/2; π/3·36/2; 100π/4; 2·5 + 7; 30°→π/6 y
  // ·144/2; 144°→4π/5 y ·625/2; r² = 2·25/2; 2·27/36; 2·32π/8; el terreno de 75 m² y 1,5 rad (r = 10, perímetro 35);
  // 2r + θr = 3r; (θ/2)(2r)²/2 = 2A; 36°→π/5, π/5·400/2 = 40π y ·50 con π ≈ 3,14; 5·3², y cada alternativa equivocada.
  const ALT2 = {
    cerco: ['15 m', '20 m', '35 m', '25 m', '175 m'],
    triple: ['1 rad', '3 rad', '2 rad', '60°', 'π/3 rad'],
    cambia: ['Queda igual', 'Se reduce a la mitad', 'Se cuadruplica', 'Se multiplica por 8', 'Se duplica'],
    terreno: ['S/ 314', 'S/ 6280', 'S/ 12 560', 'S/ 628', 'S/ 360 000'],
    tajadas: ['15 cm²', '135 cm²', '25 cm²', '45 cm²'],
  };
  const EJEMPLOS_SECTOR = [
    { nivel: 1, titulo: 'Medio arco por radio', figura: sec(115, { r: 'r = 6 cm', s: 's = 10 cm', t: 'θ', A: 'A = ?' }, { area: true }),
      enunciado: 'El arco de un sector circular mide 10 cm y su radio, 6 cm. ¿Cuánto mide su área?',
      datos: [D2.area],
      solucion: [{ texto: 'Con el arco a la mano, el área es medio arco por radio.', ecuacion: junto([A, ' = ', { frac: [[dI('10'), ' · ', dO('6')], '2'] }, ' = ', dF('30 cm²')]) }],
      respuesta: [A, ' = ', dF('30 cm²')] },
    { nivel: 1, titulo: 'Con el ángulo en radianes', figura: sec(114.6, { r: 'r = 4 cm', t: 'θ = 2 rad', A: 'A = ?' }, { area: true }),
      enunciado: ['Un sector circular tiene 4 cm de radio y un ángulo central de ', dH('2 rad'), '. ¿Cuánto mide su área?'],
      datos: [D2.area],
      solucion: [{ texto: 'El ángulo ya está en radianes; el radio va al cuadrado.', ecuacion: junto([A, ' = ', { frac: [[dH('2'), ' · ', cuad(dO('4'))], '2'] }, ' = ', dF('16 cm²')]) }],
      respuesta: [A, ' = ', dF('16 cm²')] },
    { nivel: 1, titulo: 'Con π en el ángulo', figura: sec(60, { r: 'r = 6 cm', t: 'θ = π/3 rad', A: 'A = ?' }, { area: true }),
      enunciado: ['Un sector circular tiene 6 cm de radio y un ángulo central de ', dH('π/3 rad'), '. ¿Cuánto mide su área?'],
      datos: [D2.area],
      solucion: [{ texto: 'Se reemplaza; π queda escrito.', ecuacion: junto([A, ' = ', { frac: [[dH('π/3'), ' · ', cuad(dO('6'))], '2'] }, ' = ', dF('6π cm²')]) }],
      respuesta: [A, ' = ', dF('6π cm²')] },
    { nivel: 1, titulo: 'Un cuarto de círculo', figura: sec(90, { r: 'r = 10 cm', t: '90°', A: 'A = ?' }, { area: true }),
      enunciado: ['Un sector circular de 10 cm de radio tiene un ángulo central de ', dH('90°'), '. ¿Cuánto mide su área?'],
      datos: [D2.circulo],
      solucion: [{ texto: '90° es la cuarta parte de la vuelta: el sector es la cuarta parte del círculo.', ecuacion: junto([A, ' = ', { frac: ['1', '4'] }, ' · π · ', cuad(dO('10')), ' = ', dF('25π cm²')]) }],
      respuesta: [A, ' = ', dF('25π cm²')] },
    { nivel: 1, titulo: 'El borde de la tajada', figura: sec(80, { r: 'r = 5 cm', s: 's = 7 cm', t: 'θ' }),
      enunciado: 'Una tajada de torta tiene forma de sector circular: sus lados rectos miden 5 cm y su borde curvo, 7 cm. ¿Cuánto mide su perímetro?',
      datos: [D2.perimetro],
      solucion: [{ texto: 'El perímetro da la vuelta por todo el borde: los dos radios y el arco.', ecuacion: junto(['2 · ', dO('5'), ' + ', dI('7'), ' = 17 cm']) }],
      respuesta: ['17 cm'] },
    { nivel: 2, titulo: 'Grados primero', figura: sec(30, { r: 'r = 12 cm', t: '30°', A: 'A = ?' }, { area: true }),
      enunciado: ['Un sector circular tiene 12 cm de radio y un ángulo central de ', dH('30°'), '. ¿Cuánto mide su área?'],
      datos: [D2.area, D2.pi],
      solucion: [
        { texto: 'Primero el ángulo, en radianes:', ecuacion: junto([dH('30°'), ' = ', { frac: ['30', '180'] }, ' · π rad = ', dH('π/6 rad')]) },
        { texto: 'Después, el área:', ecuacion: junto([A, ' = ', { frac: [[dH('π/6'), ' · ', cuad(dO('12'))], '2'] }, ' = ', dF('12π cm²')]) },
      ],
      respuesta: [A, ' = ', dF('12π cm²')] },
    { nivel: 2, titulo: 'El papel del abanico', figura: fig(abanico(144, { r: 'r = 25 cm', t: '144°', A: 'A = ?' }, { r: 25 })),
      enunciado: ['Un abanico de papel tiene varillas de 25 cm y se abre ', dH('144°'), '. ¿Cuánto papel cubre?'],
      datos: [D2.area, D2.pi],
      solucion: [
        { texto: 'El papel es un sector. El ángulo, en radianes:', ecuacion: junto([dH('144°'), ' = ', { frac: ['144', '180'] }, ' · π rad = ', dH('4π/5 rad')]) },
        { texto: 'El área:', ecuacion: junto([A, ' = ', { frac: [[dH('4π/5'), ' · ', cuad(dO('25'))], '2'] }, ' = ', dF('250π cm²')]) },
      ],
      respuesta: [A, ' = ', dF('250π cm²')] },
    { nivel: 2, titulo: 'El radio, desde el área', figura: sec(114.6, { r: 'r = ?', t: 'θ = 2 rad', A: 'A = 25 cm²' }, { area: true }),
      enunciado: ['Un sector circular de ', dH('2 rad'), ' tiene un área de 25 cm². ¿Cuánto mide su radio?'],
      datos: [D2.area],
      solucion: [
        { texto: 'Se reemplaza lo que se conoce:', ecuacion: junto([dF('25'), ' = ', { frac: [[dH('2'), ' · ', cuad(r)], '2'] }, FL, cuad(r), ' = 25']) },
        { texto: 'El radio es el número que, al cuadrado, da 25:', ecuacion: junto([r, ' = ', dO('5 cm')]) },
      ],
      respuesta: [r, ' = ', dO('5 cm')] },
    { nivel: 2, titulo: 'El ángulo, desde el área', figura: sec(120, { r: 'r = 6 cm', t: 'θ = ?', A: 'A = 27 cm²' }, { area: true }),
      enunciado: 'Un sector circular de 6 cm de radio tiene un área de 27 cm². ¿Cuánto mide su ángulo central, en radianes?' + NO_ESC,
      datos: [D2.area],
      solucion: [
        { texto: 'Se reemplaza:', ecuacion: junto([dF('27'), ' = ', { frac: [[th, ' · ', cuad(dO('6'))], '2'] }, FL, '54 = ', th, ' · 36']) },
        { texto: 'Se divide:', ecuacion: junto([th, ' = ', { frac: ['54', '36'] }, ' = ', dH('1,5 rad')]) },
      ],
      respuesta: [th, ' = ', dH('1,5 rad')] },
    { nivel: 2, titulo: 'Del área al arco', figura: sec(180, { r: 'r = 8 cm', s: 's = ?', A: 'A = 32π cm²', t: 'θ' }, { area: true }),
      enunciado: 'Un sector circular de 8 cm de radio tiene un área de 32π cm². ¿Cuánto mide su arco?',
      datos: [D2.area],
      solucion: [
        { texto: 'Con el área y el radio, sirve la forma con el arco:', ecuacion: junto([dF('32π'), ' = ', { frac: [[s, ' · ', dO('8')], '2'] }, FL, '64π = ', s, ' · 8']) },
        { texto: 'Se divide:', ecuacion: junto([s, ' = ', { frac: ['64π', '8'] }, ' = ', dI('8π cm')]) },
      ],
      respuesta: [s, ' = ', dI('8π cm')] },
    // Nivel 3, tipo examen. Sin puntos con letras en las figuras: el resuelto nombra las alternativas por su letra.
    // Letras de las correctas: C, A, E, B, D.
    { nivel: 3, titulo: 'El cerco del terreno',
      enunciado: ['Un terreno tiene forma de sector circular, con 75 m² de área y un ángulo central de ', dH('1,5 rad'), '. ¿Cuántos metros de cerco hacen falta para rodear todo su borde?'],
      alternativas: ALT2.cerco,
      datos: [D2.area, D2.perimetro, D1.arco],
      solucion: [
        { texto: 'Primero el radio:', ecuacion: [junto([dF('75'), ' = ', { frac: [[dH('1,5'), ' · ', cuad(r)], '2'] }]), FL, junto([cuad(r), ' = 100']), FL, junto([r, ' = ', dO('10 m')])] },
        { texto: 'El arco y el borde entero:', ecuacion: [junto([s, ' = ', dH('1,5'), ' · ', dO('10'), ' = ', dI('15 m')]), SEP, junto(['2 · ', dO('10'), ' + ', dI('15'), ' = 35 m'])] },
        { texto: ['La ', letra(ALT2.cerco, '15 m'), ' es solo el arco; la ', letra(ALT2.cerco, '20 m'), ', solo los dos radios; la ', letra(ALT2.cerco, '25 m'), ' cuenta un solo radio; la ', letra(ALT2.cerco, '175 m'), ' usa r = 50, sin el 2 ni la raíz.'] },
      ],
      respuesta: [letra(ALT2.cerco, '35 m'), ', 35 m'] },
    { nivel: 3, titulo: 'Tres veces el radio',
      enunciado: 'El perímetro de un sector circular es el triple de su radio. ¿Cuánto mide su ángulo central?',
      alternativas: ALT2.triple,
      datos: [D2.perimetro, D1.arco],
      solucion: [
        { texto: 'El perímetro son dos radios y el arco:', ecuacion: [junto(['2', r, ' + ', s, ' = 3', r]), FL, junto([s, ' = ', r])] },
        { texto: 'Un arco del largo del radio abarca un radián:', ecuacion: junto([th, ' = ', { frac: [s, r] }, ' = ', dH('1 rad')]) },
        { texto: ['La ', letra(ALT2.triple, '3 rad'), ' olvida los dos radios; la ', letra(ALT2.triple, '2 rad'), ' cuenta uno solo; la ', letra(ALT2.triple, '60°'), ' y la ', letra(ALT2.triple, 'π/3 rad'), ' toman 1 rad por 60°.'] },
      ],
      respuesta: [letra(ALT2.triple, '1 rad'), ', ', dH('1 rad')] },
    { nivel: 3, titulo: 'Doble radio, mitad de ángulo',
      enunciado: 'El radio de un sector circular se duplica y su ángulo central se reduce a la mitad. ¿Qué le pasa a su área?',
      alternativas: ALT2.cambia,
      datos: [D2.area],
      solucion: [
        { texto: 'El nuevo radio es 2r y el nuevo ángulo, θ/2:', ecuacion: junto([{ frac: [[{ frac: [th, '2'] }, ' · ', { sup: [{ par: ['2', r] }, '2'] }], '2'] }, ' = ', { frac: [[th, ' · 4', cuad(r)], '4'] }, ' = 2 · ', { frac: [[th, ' · ', cuad(r)], '2'] }]) },
        { texto: 'El radio al cuadrado multiplica por 4 y el ángulo divide entre 2: el área se duplica.' },
        { texto: ['La ', letra(ALT2.cambia, 'Queda igual'), ' cree que el radio cuenta una sola vez; la ', letra(ALT2.cambia, 'Se reduce a la mitad'), ' mira solo el ángulo; la ', letra(ALT2.cambia, 'Se cuadruplica'), ', solo el radio; la ', letra(ALT2.cambia, 'Se multiplica por 8'), ' multiplica 4 por 2.'] },
      ],
      respuesta: [letra(ALT2.cambia, 'Se duplica'), ', ', dF('se duplica')] },
    { nivel: 3, titulo: 'El precio del terreno',
      enunciado: ['Un terreno tiene forma de sector circular de 20 m de radio y ', dH('36°'), ' de ángulo central. Si cada metro cuadrado cuesta S/ 50, ¿cuánto cuesta el terreno?'],
      alternativas: ALT2.terreno,
      datos: [D2.area, D2.pi, D2.piNum],
      solucion: [
        { texto: 'El ángulo, en radianes, y el área:', ecuacion: [junto([dH('36°'), ' = ', dH('π/5 rad')]), SEP, junto([A, ' = ', { frac: [[dH('π/5'), ' · ', cuad(dO('20'))], '2'] }, ' = ', dF('40π m²')])] },
        { texto: 'Con π ≈ 3,14, el precio:', ecuacion: junto([dF('40π'), ' · 50 ≈ 125,6 · 50 = 6280']) },
        { texto: ['La ', letra(ALT2.terreno, 'S/ 12 560'), ' olvida la mitad; la ', letra(ALT2.terreno, 'S/ 628'), ' usa el arco, 4π m; la ', letra(ALT2.terreno, 'S/ 314'), ' pone el radio sin elevar; la ', letra(ALT2.terreno, 'S/ 360 000'), ' usa 36 en vez de π/5.'] },
      ],
      respuesta: [letra(ALT2.terreno, 'S/ 6280'), ', S/ 6280'] },
    { nivel: 3, titulo: 'Dos tajadas del mismo ángulo',
      enunciado: 'Dos sectores circulares tienen el mismo ángulo central, y el radio del segundo es el triple del radio del primero. Si el primero mide 5 cm², ¿cuánto mide el segundo?',
      alternativas: ALT2.tajadas,
      datos: [D2.area],
      solucion: [
        { texto: 'Con el mismo ángulo, el área depende del radio al cuadrado: el triple de radio da 3² = 9 veces el área.', ecuacion: junto([{ frac: [[th, ' · ', { sup: [{ par: ['3', r] }, '2'] }], '2'] }, ' = 9 · ', { frac: [[th, ' · ', cuad(r)], '2'] }]) },
        { texto: 'El segundo:', ecuacion: junto(['9 · ', dF('5'), ' = ', dF('45 cm²')]) },
        { texto: ['La ', letra(ALT2.tajadas, '15 cm²'), ' crece como el radio; la ', letra(ALT2.tajadas, '135 cm²'), ' usa 3³; la ', letra(ALT2.tajadas, '25 cm²'), ' eleva el área, y no la razón, al cuadrado.'] },
      ],
      respuesta: [letra(ALT2.tajadas, '45 cm²'), ', ', dF('45 cm²')] },
  ];

  // «Ahora tú» de la idea 2. Tipo 0: el área con el arco y el radio.
  function casoAreaArco(rr) {
    let sv, rv;
    do { sv = rr.uno([6, 8, 9, 10, 12, 15, 16, 18, 20, 24]); rv = rr.uno([4, 5, 6, 8, 10, 12]); } while (sv >= 6 * rv || (sv * rv) % 2 || (sv === 10 && rv === 6));   // 10 y 6: el ejemplo 1
    const cosa = rr.uno(['Una tajada de torta tiene', 'Un pedazo de pizza tiene', 'Un sector circular tiene']);
    return {
      pregunta: [`${cosa} un borde curvo de `, dI(`${sv} cm`), ' y lados rectos de ', dO(`${rv} cm`), ', como un sector circular. ¿Cuánto mide su área?'],
      datos: [D2.area],
      dibujo: sec(sv / rv / RAD, { r: `r = ${rv} cm`, s: `s = ${sv} cm`, t: 'θ', A: 'A = ?' }, { area: true }),
      opciones: opciones(sv * rv / 2, [
        { id: 'mitad', valor: sv * rv, error: 'SEC-MITAD', siFuera: 'Arco por radio va bien; falta la mitad: el sector es como un triángulo de base el arco.' },
        { id: 'cuadrado', valor: sv * rv * rv / 2, error: 'SEC-ARCO-CUADRADO', siFuera: 'El radio entra dos veces si usas θ; el arco ya trae uno: s · r / 2.' },
        { id: 'medio', valor: sv / 2, error: 'SEC-ARCO', siFuera: 'La mitad va bien; pero falta multiplicar por la altura de la tajada, el radio.' },
        { id: 'suma', valor: (sv + rv) / 2, error: 'SEC-SUMA', siFuera: 'La mitad va bien; pero el arco y el radio se multiplican, no se suman.' },
      ], v => `${f(v)} cm²`),
      solucion: { texto: 'Con el arco y el radio, el área es medio arco por radio.', ecuacion: junto([A, ' = ', { frac: [[dI(`${sv}`), ' · ', dO(`${rv}`)], '2'] }, ' = ', dF(`${f(sv * rv / 2)} cm²`)]) },
    };
  }
  // Tipo 1: el radio desde el área y el ángulo, o el ángulo (en grados) desde el área y el radio.
  function casoDesdeArea(rr) {
    const g = rr.uno([30, 36, 45, 60, 72, 90, 120, 135, 150]), rv = rr.uno([2, 3, 4, 6, 8, 10, 12]), aT = piFrac(g * rv * rv, 360);
    if (rr.ent(0, 1)) {
      return {
        pregunta: ['Un sector circular de ', dH(`${g}°`), ' tiene un área de ', dF(`${aT} cm²`), '. ¿Cuánto mide su radio?'],
        datos: [D2.area, D2.pi],
        dibujo: sec(g, { r: 'r = ?', t: `${g}°`, A: `A = ${aT} cm²` }, { area: true }),
        opciones: opciones(rv, [
          { id: 'raiz', valor: rv * rv, error: 'SEC-SIN-RAIZ', siFuera: `Despejar está bien: r² = ${rv * rv}. Falta la raíz cuadrada para llegar a r.` },
          { id: 'mitad', valor: Math.round(Math.sqrt(rv * rv / 2) * 100) / 100, error: 'SEC-MITAD', siFuera: `Despejar r² es la idea; pero falta el 2: r² = 2 · A ÷ θ = ${rv * rv}, no A ÷ θ.` },
          { id: 'grados', valor: Math.round(Math.sqrt(2 * g * RAD * rv * rv / 2 / g) * 100) / 100, error: 'TR4', siFuera: `Despejar r² está bien, con θ en radianes: ${g}° son ${piTxt(g)} rad, no ${g}.` },
          { id: 'diam', valor: 2 * rv, error: 'ARCO-DIAM', siFuera: `r² = ${rv * rv} está bien; su raíz es el radio, no el diámetro.` },
        ], v => `${f(v)} cm`),
        solucion: { texto: `${g}° son ${piTxt(g)} rad. Se despeja r² y se saca la raíz.`, ecuacion: junto([cuad(r), ' = ', { frac: [['2 · ', dF(aT)], dH(piTxt(g))] }, ` = ${rv * rv}`, FL, r, ' = ', dO(`${rv} cm`)]) },
      };
    }
    const fmt = v => `${f(v)}°`;
    return {
      pregunta: ['Un sector circular de ', dO(`${rv} cm`), ' de radio tiene un área de ', dF(`${aT} cm²`), '. ¿Cuánto mide su ángulo central, en grados?' + NO_ESC],
      datos: [D2.area, D2.pi],
      dibujo: sec(otraAbertura(g), { r: `r = ${rv} cm`, t: 'θ = ?', A: `A = ${aT} cm²` }, { area: true }),
      opciones: opciones(g, [
        { id: 'mitad', valor: g / 2, error: 'SEC-MITAD', siFuera: 'Despejar θ es la idea; pero el 2 de la fórmula pasa multiplicando al área.' },
        { id: 'radio', valor: g * rv, error: 'SEC-LINEAL', siFuera: `Pasar a grados está bien; pero se divide entre r² = ${rv * rv}, no entre ${rv}.` },
        { id: 'tr3', valor: Math.round(g * RAD * 100) / 100, error: 'TR3', siFuera: `Despejar está bien: θ = ${piTxt(g)} rad. Falta pasar los radianes a grados.` },
        { id: 'doscientos', valor: Math.round(g * 10 / 9 * 100) / 100, error: 'RAD-200', siFuera: 'Despejar θ está bien; pero π rad son 180°, no 200: así salen centesimales.' },
      ], fmt),
      solucion: { texto: 'Se despeja θ, en radianes, y se pasa a grados.', ecuacion: junto([th, ' = ', { frac: [['2 · ', dF(aT)], cuad(dO(`${rv}`))] }, ` = ${piTxt(g)} rad = `, dH(`${g}°`)]) },
    };
  }
  // Tipo 2 (examen): el cerco de un sector con su área y su ángulo (San Marcos 2025-II), o el perímetro que es «tantas
  // veces el radio».
  function casoPerimetro(rr) {
    if (rr.ent(0, 1)) {
      let rv, t;
      do { rv = rr.uno([4, 6, 8, 10, 12, 20]); t = rr.uno([0.5, 1, 1.5, 2, 2.5, 3]); } while (!Number.isInteger(t * rv * rv / 2) || !Number.isInteger(t * rv) || (rv === 10 && t === 1.5));   // el ejemplo del cerco
      const av = t * rv * rv / 2, sv = t * rv, P = 2 * rv + sv, fmt = v => `${f(v)} m`;
      return {
        pregunta: ['Un terreno con forma de sector circular tiene ', dF(`${f(av)} m²`), ' de área y un ángulo central de ', dH(`${f(t)} rad`), '. ¿Cuántos metros de cerco rodean todo su borde?'],
        datos: [D2.area, D2.perimetro, D1.arco],
        opciones: opciones(P, [
          { id: 'arco', valor: sv, error: 'SEC-SOLO-ARCO', siFuera: 'El arco está bien calculado; pero el cerco también va por los dos lados rectos, los radios.' },
          { id: 'radios', valor: 2 * rv, error: 'SEC-SOLO-RADIOS', siFuera: 'Los dos radios están bien; falta el arco del borde curvo.' },
          { id: 'uno', valor: rv + sv, error: 'SEC-UN-RADIO', siFuera: 'El arco y un radio están bien; pero el sector tiene dos lados rectos.' },
          { id: 'sinraiz', valor: 2 * av / t * 2 + 2 * av, error: 'SEC-SIN-RAIZ', siFuera: `Despejar r² está bien: r² = ${rv * rv}. Pero el radio es su raíz, ${rv}.` },
        ], fmt),
        solucion: { texto: `Del área, r² = ${rv * rv} y r = ${rv} m. El arco es θ · r; el cerco, dos radios y el arco.`, ecuacion: junto([s, ' = ', dH(f(t)), ' · ', dO(`${rv}`), ' = ', dI(`${f(sv)} m`), FL, '2 · ', dO(`${rv}`), ' + ', dI(f(sv)), ` = ${f(P)} m`]) },
      };
    }
    const k = rr.uno([2.5, 3.5, 4, 4.5, 5]), t = k - 2;                   // sin el triple: es el ejemplo «Tres veces el radio»
    const vec = ['', '', 'el doble', 'el triple', 'el cuádruple', 'el quíntuple'];
    const veces = Number.isInteger(k) ? vec[k] : `${f(k)} veces`;
    return {
      pregunta: `El perímetro de un sector circular es ${veces} de su radio. ¿Cuánto mide su ángulo central, en radianes?`,
      datos: [D2.perimetro, D1.arco],
      opciones: opciones(t, [
        { id: 'radios', valor: k, error: 'SEC-SOLO-ARCO', siFuera: 'Relacionar el borde con el radio es la idea; pero el perímetro también trae los dos radios.' },
        { id: 'uno', valor: k - 1, error: 'SEC-UN-RADIO', siFuera: 'Restar los radios es la idea; pero el sector tiene dos lados rectos, no uno.' },
        { id: 'grados', valor: Math.round(t * 60 * 100) / 100, error: 'TR2', siFuera: `θ = ${f(t)} rad está bien; pero 1 rad no son 60°. Aquí piden radianes.` },
        { id: 'mitad', valor: (k - 2) / 2, error: 'SEC-MITAD', siFuera: 'Quitar los dos radios está bien; lo que queda es el arco entero, no la mitad.' },
      ], v => (Math.abs(v - Math.round(t * 60 * 100) / 100) < 1e-9 && v !== t ? `${f(v)}°` : `${f(v)} rad`)),
      solucion: { texto: 'El perímetro son dos radios y el arco. Quitando los dos radios queda el arco, en radios.', ecuacion: junto([`2`, r, ' + ', s, ` = ${f(k)}`, r, FL, s, ` = ${f(t)}`, r, FL, th, ' = ', dH(`${f(t)} rad`)]) },
    };
  }

  const sectorIdea = {
    id: 'sector',
    titulo: 'Área del sector circular',
    pregunta: '¿Qué le pasa al área de un sector si su radio se duplica?',
    temas: ['Área del sector y del trapecio circular'],
    pieza: OB,
    aprendizaje: 'El área del sector es θ · r²/2, con θ en radianes: con doble radio, el arco se duplica y el área se cuadruplica.',
    actividad: 'Abrir un abanico de papel y ver cuánto papel cubre.',
    lee: {
      tarjetas: [
        { titulo: 'El abanico de papel', texto: 'Un abanico de papel plegado se abre desde el remache donde se juntan sus varillas. Abierto, el papel tiene forma de sector circular: lo limitan dos varillas, que son radios, y un borde curvo, que es un arco.',
          pieza: OB, dibujo: { datos: abanico(90, {}), estado: {} } },
        { titulo: 'Largo y región', texto: 'El arco es un largo y se mide en centímetros. El área es una región y se mide en centímetros cuadrados, cm²: cuántos cuadraditos de 1 cm de lado caben en el papel.' },
        { titulo: 'El borde entero', texto: 'El perímetro de una figura es el largo de todo su borde, dando la vuelta. El del sector son sus dos radios y su arco.' },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a abrir y cerrar el abanico; sus varillas miden siempre 20 cm. Compara qué parte de la vuelta abre el ángulo ', th, ' con qué parte del círculo cubre el papel.'] },
      ],
    },
    ejemplos: EJEMPLOS_SECTOR,
    juega: {
      pieza: OB,
      consigna: ['Las varillas del abanico miden ', r, ' = 20 cm. ', th, ' es cuánto se abre; ', s, ', su borde de arriba, y ', A, ', el área del papel.'],
      mision: {
        texto: 'Abre el abanico hasta que su papel cubra 50π cm².',
        logrado: val => val.g === 45,
        bien: 'Listo: 45° es 1/8 de vuelta, y el papel cubre 1/8 del círculo.',
      },
      voz: '¿Qué parte de la vuelta abre el abanico?',
      leyenda: [
        { s: th, t: 'cuánto se abre el abanico' },
        { s: r, t: 'el radio: el largo de una varilla' },
        { s: s, t: 'el arco: el borde de arriba' },
        { s: A, t: 'el área: lo que cubre el papel' },
        { s: 'cm²', t: 'un cuadradito de 1 cm de lado' },
      ],
      controles: [{ id: 'g', etiqueta: 'θ, cuánto se abre', color: 'c-h', min: 30, max: 180, paso: 15, inicio: 90, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: abanico(val.g, { r: 'r = 20 cm', t: `θ = ${val.g}°`, s: `s = ${piFrac(val.g, 9)} cm`, A: `A = ${piFrac(10 * val.g, 9)} cm²` }), estado: {} }),
      lectura: val => jN([`${fraccionVuelta(val.g)} de vuelta: `, A, ` = ${piFrac(10 * val.g, 9)} cm², ${fraccionVuelta(val.g)} del círculo`]),
      minimo: 3,
    },
    predice: {
      pregunta: 'Otro abanico tiene varillas del doble de largo, 40 cm, y se abre el mismo ángulo. ¿Qué les pasa a su arco y al área de su papel?',
      datos: ['El ángulo es el mismo en los dos abanicos.', 'Varillas: 20 cm en el primero y 40 cm en el segundo.'],
      voz: 'El área es una región: crece a lo largo y a lo ancho.',
      opciones: [
        { id: 'c', texto: 'El arco se duplica y el área se cuadruplica', correcta: true },
        { id: 'lineal', texto: 'Los dos se duplican', error: 'SEC-LINEAL', siFuera: 'El arco sí se duplica. Pero el área crece a lo largo y a lo ancho: cuatro veces.' },
        { id: 'cuadrado', texto: 'Los dos se cuadruplican', error: 'SEC-ARCO-CUADRADO', siFuera: 'El área sí se cuadruplica. El arco es un largo: crece como el radio, el doble.' },
        { id: 'angulo', texto: 'Ninguno cambia: el ángulo es el mismo', error: 'SEC-ANGULO', siFuera: 'El ángulo no cambia, es cierto; pero el arco y el área dependen también del radio.' },
      ],
      dibujo: { datos: abanico(90, { r: 'r = 20 cm', t: 'θ' }, { otro: { r: 40, rot: { r: '40 cm' } } }), estado: {} },
      revelar: { datos: abanico(90, { r: 'r = 20 cm', s: '10π cm', A: '100π cm²', t: 'θ' }, { otro: { r: 40, rot: { r: '40 cm', s: '20π cm', A: '400π cm²' } } }), estado: {} },
      coincide: 'Coincide: con 90°, el arco pasa de 10π a 20π cm y el área, de 100π a 400π cm².',
      noCoincide: 'Revisemos con 90°: el arco pasa de 10π a 20π cm y el área, de 100π a 400π cm².',
    },
    mira: {
      pieza: OB,
      datos: abanico(90, { r: 'r = 20 cm', t: [{ t: '90°' }, { t: 'π/2 rad', paso: 2 }, { t: 'θ', paso: 4 }], s: [{ t: '' }, { t: 's = 10π cm', paso: 2 }, { t: '10π cm', paso: 4 }], A: [{ t: 'A = ?' }, { t: 'A = 100π cm²', paso: 1 }, { t: '100π cm²', paso: 4 }] },
        { otro: [{ v: null }, { v: { r: 40, rot: { r: '40 cm', s: '20π cm', A: '400π cm²' } }, paso: 4 }] }),
      voz: 'Una tajada fina es casi un triángulo.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Abierto 90°, el abanico cubre la cuarta parte de la vuelta.', ecuacion: [th, ' = ', dH('90°')] },
        { estado: { paso: 1 }, texto: 'Su papel es la cuarta parte del círculo de 20 cm.', ecuacion: junto([A, ' = ', { frac: ['1', '4'] }, ' · π · ', cuad(dO('20')), ' = ', dF('100π cm²')]) },
        { estado: { paso: 2 }, texto: 'Cada pliegue es casi un triángulo de altura r; sus bases suman el arco.', ecuacion: junto(['tajada ≈ ', { frac: [['base · ', r], '2'] }, SEP, s, ' = ', th, ' · ', r]) },
        { estado: { paso: 3 }, texto: 'Así el sector mide medio arco por radio: el radio entra dos veces.', ecuacion: junto([A, ' = ', { frac: [[s, ' · ', r], '2'] }, ' = ', { frac: [[th, ' · ', cuad(r)], '2'] }]) },
        { estado: { paso: 4 }, texto: 'Con el doble de radio, el arco se duplica y el área se cuadruplica.', ecuacion: junto([{ sup: [{ par: ['2', r] }, '2'] }, ' = 4', cuad(r)]) },
      ],
    },
    regla: {
      texto: 'El área del sector es medio arco por radio; con el ángulo en radianes, el radio entra dos veces. Su perímetro son los dos radios y el arco.',
      // Sin llave bajo θ (lector en frío A: separaba θ de su r²); «en radianes» lo dice la condición.
      ecuacion: [junto([A, ' = ', { frac: [[th, ' · ', cuad(r)], '2'] }]), SEP, junto([A, ' = ', { frac: [[s, ' · ', r], '2'] }]), SEP, junto(['perímetro = 2', r, ' + ', s])],
      condicion: 'θ en radianes; si r va en cm, A va en cm². Con doble radio, el área se multiplica por 4.',
      voz: 'El arco lleva un radio; el área, dos.',
      // Figura propia (cierre, 19 nov): la del último paso de Mira, con los dos abanicos, quedaba encimada en la regla.
      dibujo: { pieza: OB, datos: { objeto: 'figura', g: 70, area: true, rot: { r: 'r', t: 'θ', s: 's', A: 'A = s · r/2' } }, estado: {} },
    },
    // Así se resuelve: el área de un terreno con el ángulo en grados. «Ahora tú» pide el área con el arco, el radio o el
    // ángulo desde el área, y el perímetro.
    resuelve: {
      pieza: OB,
      generar(sem) {
        const rr = azar(sem + 900), g = rr.uno([30, 40, 45, 60, 72, 80, 90, 120, 150]), rv = rr.uno([6, 9, 12, 15, 18, 20, 24, 30]), aT = piFrac(g * rv * rv, 360);
        return {
          enunciado: ['Un terreno tiene forma de sector circular, con ', dO(`${rv} m`), ' de radio y ', dH(`${g}°`), ' de ángulo central. ¿Cuánto mide su área?'],
          datos: [D2.area, D2.pi],
          dibujo: { datos: { objeto: 'figura', g, area: true, rot: { r: `r = ${rv} m`, t: `${g}°`, A: 'A = ?' } }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden el área ', A, ' del terreno: una región, en m².'] },
            { tipo: 'datos', texto: ['El radio mide ', r, ` = ${rv} m y el ángulo, `, th, ` = ${g}°, viene en grados.`] },
            { tipo: 'regla', texto: 'El área del sector es el ángulo, en radianes, por el radio al cuadrado, entre 2.', ecuacion: junto([A, ' = ', { frac: [[th, ' · ', cuad(r)], '2'] }]) },
            { tipo: 'cuentas', texto: `Primero, ${g}° a radianes:`, ecuacion: junto([dH(`${g}°`), ' = ', { frac: [`${g}`, '180'] }, ' · π rad = ', dH(`${piTxt(g)} rad`)]) },
            { tipo: 'cuentas', texto: 'Después, el área:', ecuacion: junto([A, ' = ', { frac: [[dH(piTxt(g)), ' · ', cuad(dO(`${rv}`))], '2'] }, ' = ', dF(`${aT} m²`)]),
              dibujo: { datos: { objeto: 'figura', g, area: true, rot: { r: `r = ${rv} m`, t: `${piTxt(g)} rad`, A: `A = ${aT} m²` } }, estado: {} } },
            { tipo: 'sentido', texto: `Tiene sentido: el círculo entero mide ${piFrac(rv * rv, 1)} m², y ${g}° es ${fraccionVuelta(g)} de la vuelta; ${fraccionVuelta(g)} de ${piFrac(rv * rv, 1)} da ${aT}.` },
          ],
          respuesta: [A, ' = ', dF(`${aT} m²`)],
        };
      },
    },
    ahoraTu: {
      pieza: OB,
      voz: 'El arco lleva un radio; el área, dos.',
      generar(sem) { return conCuatro([casoAreaArco, casoDesdeArea, casoPerimetro][sem % 3], azar(sem + 23)); },
    },
  };

  // ====================================================================================================================
  // Idea 3: trapecio circular
  // ====================================================================================================================
  // Objeto de la primera pantalla: el limpiaparabrisas de un carro (San Marcos 2020-I): el brazo gira desde abajo y el
  // jebe, que va solo al final del brazo, limpia una banda curva.
  // Cambia: el largo del brazo, r₂, y el del jebe, h (el ángulo queda en 120°). · Permanece: el eje y el barrido. ·
  // Progresa: los dos arcos turquesa. · Se reserva: el área que limpia (la predicción: el juego no da ningún área). ·
  // Debe verse: los dos arcos tienen el mismo ángulo, pero el de afuera es más largo.
  // Errores (hipótesis): TRAP-RESTA usa un sector con el radio del jebe (la trampa de San Marcos 2020-I); TRAP-GRANDE da el
  // sector grande entero; TRAP-MITAD olvida la mitad; TRAP-SUMA suma los arcos donde se restan; TRAP-SIN-CUADRADO resta los
  // radios sin elevarlos (la trampa de San Marcos 2026-II); TRAP-UN-ANCHO cuenta un solo tramo de ancho en el perímetro;
  // TR4 como en la idea 1.
  const limpia = (r2v, hv, rot, extra = {}) => Object.assign({ objeto: 'limpia', r2: r2v, h: hv, g: 120, rot, k: 2.5 }, extra);
  const hT = 'h';
  const D3 = {
    resta: ['Área del trapecio circular: ', A, ' = ', { frac: [[th, ' · (', cuad(r2), ' − ', cuad(r1), ')'], '2'] }, ', con ', th, ' en radianes.'],
    semi: ['También: ', A, ' = ', { frac: [[s1, ' + ', s2], '2'] }, ' · h, con h = ', r2, ' − ', r1, ' (el ancho).'],
    arcos: ['Arcos: ', s1, ' = ', th, ' · ', r1, ' y ', s2, ' = ', th, ' · ', r2, '.'],
    sector: D2.area,
    pi: D1.pi,
    perim: 'Perímetro del trapecio circular: sus dos arcos y sus dos tramos de ancho.',
  };
  // Ejemplos de la idea 3. Cuentas rehechas aparte (cuentas.js): 2·(25 − 9)/2; (6 + 10)/2·4; π/2·(36 − 4)/2; π/3·9;
  // π·(16 − 4)/2; 60°→π/3 y ·(36 − 9)/2; 45°→π/4 y ·(64 − 16)/2; (6π − 4π)/4; 90°→π/2 y ·(50² − 20²)/2; (r₂² − 16)/2 = 10;
  // (3² − 1)/1; 120°→2π/3 y ·(60² − 20²)/2; r₂² − 16 = 16; 2·3 + 2·7 + 2·4; (5π − 2π)/6, y cada alternativa equivocada.
  const ALT3 = {
    razon: ['2', '9', '3', '8', '10'],
    limpia: ['1600π/3 cm²', '3200π/3 cm²', '1200π cm²', '6400π/3 cm²', '400π/3 cm²'],
    iguales: ['4√2 cm', '8 cm', '32 cm', '4 cm', '16 cm'],
    perim: ['20 cm', '24 cm', '30 cm', '14 cm', '28 cm'],
    angulo: ['150°', '210°', '90°', '45°', '180°'],
  };
  const banda = (g, f1, rot) => sec(g, rot, { r1: f1, area: true });
  const EJEMPLOS_TRAPECIO = [
    { nivel: 1, titulo: 'Sector grande menos chico', figura: banda(114.6, 0.6, { r: 'r₂ = 5 cm', r1: 'r₁ = 3 cm', t: 'θ = 2 rad', A: 'A = ?' }),
      enunciado: ['Un trapecio circular tiene un ángulo central de ', dH('2 rad'), ' y va desde ', r1, ' = 3 cm hasta ', r2, ' = 5 cm del centro. ¿Cuánto mide su área?'],
      datos: [D3.resta],
      solucion: [{ texto: 'Se restan los cuadrados de los radios y se multiplica por medio ángulo.', ecuacion: junto([A, ' = ', { frac: [[dH('2'), ' · (', cuad(dO('5')), ' − ', cuad(dO('3')), ')'], '2'] }, ' = ', dF('16 cm²')]) }],
      respuesta: [A, ' = ', dF('16 cm²')] },
    { nivel: 1, titulo: 'Con los dos arcos', figura: banda(57.3, 0.6, { s: 's₂ = 10 cm', s1: 's₁ = 6 cm', h: 'h = 4 cm', t: 'θ', A: 'A = ?' }),
      enunciado: ['Los arcos de un trapecio circular miden ', s1, ' = 6 cm y ', s2, ' = 10 cm, y su ancho es h = 4 cm. ¿Cuánto mide su área?'],
      datos: [D3.semi],
      solucion: [{ texto: 'Como un trapecio: la semisuma de los arcos por el ancho.', ecuacion: junto([A, ' = ', { frac: [[dI('6'), ' + ', dI('10')], '2'] }, ' · 4 = ', dF('32 cm²')]) }],
      respuesta: [A, ' = ', dF('32 cm²')] },
    { nivel: 1, titulo: 'Con π en el ángulo', figura: banda(90, 1 / 3, { r: 'r₂ = 6 cm', r1: 'r₁ = 2 cm', t: 'π/2 rad', A: 'A = ?' }),
      enunciado: ['Un trapecio circular de ', dH('π/2 rad'), ' va desde ', r1, ' = 2 cm hasta ', r2, ' = 6 cm. ¿Cuánto mide su área?'],
      datos: [D3.resta],
      solucion: [{ texto: 'Se reemplaza; π queda escrito.', ecuacion: junto([A, ' = ', { frac: [[dH('π/2'), ' · (', cuad(dO('6')), ' − ', cuad(dO('2')), ')'], '2'] }, ' = ', dF('8π cm²')]) }],
      respuesta: [A, ' = ', dF('8π cm²')] },
    { nivel: 1, titulo: 'El arco de afuera', figura: banda(60, 2 / 3, { r1: 'r₁ = 6 cm', h: 'h = 3 cm', s: 's₂ = ?', t: 'π/3 rad' }),
      enunciado: ['Un trapecio circular de ', dH('π/3 rad'), ' tiene un radio de adentro ', r1, ' = 6 cm y un ancho h = 3 cm. ¿Cuánto mide su arco de afuera, ', s2, '?'],
      datos: [D3.arcos, 'Ancho: h = r₂ − r₁.'],
      solucion: [{ texto: 'El radio de afuera es 6 + 3 = 9 cm. Su arco:', ecuacion: junto([s2, ' = ', dH('π/3'), ' · ', dO('9 cm'), ' = ', dI('3π cm')]) }],
      respuesta: [s2, ' = ', dI('3π cm')] },
    { nivel: 1, titulo: 'Media corona', figura: banda(180, 0.5, { r: 'r₂ = 4 cm', r1: 'r₁ = 2 cm', t: 'π rad', A: 'A = ?' }),
      enunciado: ['Media corona circular es un trapecio circular de ', dH('π rad'), '. ¿Cuánto mide el área de una que va de ', r1, ' = 2 cm a ', r2, ' = 4 cm?'],
      datos: [D3.resta],
      solucion: [{ texto: 'El ángulo es π rad, media vuelta:', ecuacion: junto([A, ' = ', { frac: [[dH('π'), ' · (', cuad(dO('4')), ' − ', cuad(dO('2')), ')'], '2'] }, ' = ', dF('6π cm²')]) }],
      respuesta: [A, ' = ', dF('6π cm²')] },
    { nivel: 2, titulo: 'Grados primero', figura: banda(60, 0.5, { r: 'r₂ = 6 cm', r1: 'r₁ = 3 cm', t: '60°', A: 'A = ?' }),
      enunciado: ['Un trapecio circular de ', dH('60°'), ' va desde ', r1, ' = 3 cm hasta ', r2, ' = 6 cm. ¿Cuánto mide su área?'],
      datos: [D3.resta, D3.pi],
      solucion: [
        { texto: 'El ángulo, en radianes:', ecuacion: junto([dH('60°'), ' = ', dH('π/3 rad')]) },
        { texto: 'El área:', ecuacion: junto([A, ' = ', { frac: [[dH('π/3'), ' · (', cuad(dO('6')), ' − ', cuad(dO('3')), ')'], '2'] }, ' = ', { frac: [['π/3 · 27'], '2'] }, ' = ', dF('9π/2 cm²')]) },
      ],
      respuesta: [A, ' = ', dF('9π/2 cm²')] },
    { nivel: 2, titulo: 'El jardín de la plaza', figura: banda(45, 0.5, { r: 'r₂ = 8 m', r1: 'r₁ = 4 m', t: '45°', A: 'A = ?' }),
      enunciado: ['Un jardín de una plaza circular va desde 4 m hasta 8 m del centro y abarca un ángulo de ', dH('45°'), '. ¿Cuánto mide su área?'],
      datos: [D3.resta, D3.pi],
      solucion: [
        { texto: 'Es un trapecio circular de r₁ = 4 m y r₂ = 8 m. El ángulo, en radianes:', ecuacion: junto([dH('45°'), ' = ', dH('π/4 rad')]) },
        { texto: 'El área:', ecuacion: junto([A, ' = ', { frac: [[dH('π/4'), ' · (', cuad(dO('8')), ' − ', cuad(dO('4')), ')'], '2'] }, ' = ', dF('6π m²')]) },
      ],
      respuesta: [A, ' = ', dF('6π m²')] },
    { nivel: 2, titulo: 'El ángulo, desde los arcos', figura: banda(65, 2 / 3, { s: 's₂ = 6π cm', s1: 's₁ = 4π cm', h: 'h = 4 cm', t: 'θ = ?' }),
      enunciado: ['Los arcos de un trapecio circular miden ', s1, ' = 4π cm y ', s2, ' = 6π cm, y su ancho es h = 4 cm. ¿Cuánto mide su ángulo central?' + NO_ESC],
      datos: [D3.arcos, 'Ancho: h = r₂ − r₁.'],
      solucion: [
        { texto: 'Se restan los arcos: con el mismo ángulo, la diferencia es el ángulo por el ancho.', ecuacion: junto([s2, ' − ', s1, ' = ', th, ' · (', r2, ' − ', r1, ') = ', th, ' · h']) },
        { texto: 'Se reemplaza:', ecuacion: junto([th, ' = ', { frac: ['6π − 4π', '4'] }, ' = ', dH('π/2 rad')]) },
      ],
      respuesta: [th, ' = ', dH('π/2 rad')] },
    { nivel: 2, titulo: 'El brazo y el jebe', figura: fig(limpia(50, 30, { r2: 'r₂ = 50 cm', h: 'h = 30 cm', t: '90°', A: 'A = ?' }, { g: 90 })),
      enunciado: ['El brazo de un limpiaparabrisas mide 50 cm, y su jebe, de 30 cm, va al final del brazo. Si barre ', dH('90°'), ', ¿qué área limpia?'],
      datos: [D3.resta, D3.pi],
      solucion: [
        { texto: 'El jebe empieza a 50 − 30 = 20 cm del eje. Con 90° = π/2 rad:', ecuacion: junto([A, ' = ', { frac: [[dH('π/2'), ' · (', cuad(dO('50')), ' − ', cuad(dO('20')), ')'], '2'] }, ' = ', { frac: ['π/2 · 2100', '2'] }]) },
        { texto: 'Se simplifica:', ecuacion: junto([A, ' = ', dF('525π cm²')]) },
      ],
      respuesta: [A, ' = ', dF('525π cm²')] },
    { nivel: 2, titulo: 'El ancho, desde el área', figura: banda(57.3, 0.5, { r1: 'r₁ = 4 cm', h: 'h = ?', t: 'θ = 1 rad', A: 'A = 10 cm²' }),
      enunciado: ['Un trapecio circular de ', dH('1 rad'), ' tiene 10 cm² de área y su radio de adentro mide ', r1, ' = 4 cm. ¿Cuánto mide su ancho h?' + NO_ESC],
      datos: [D3.resta, 'Ancho: h = r₂ − r₁.'],
      solucion: [
        { texto: 'Se reemplaza:', ecuacion: junto([dF('10'), ' = ', { frac: [[dH('1'), ' · (', cuad(r2), ' − 16)'], '2'] }, FL, cuad(r2), ' = 36', FL, r2, ' = ', dO('6 cm')]) },
        { texto: 'El ancho:', ecuacion: junto(['h = ', dO('6'), ' − ', dO('4'), ' = 2 cm']) },
      ],
      respuesta: ['h = 2 cm'] },
    // Nivel 3, tipo examen. Letras de las correctas: D, B, A, E, C.
    { nivel: 3, titulo: 'Dos áreas en razón', figura: banda(70, 1 / 3, { r: 'r₂', r1: 'r₁', t: 'θ', A: 'trapecio' }),
      enunciado: ['Un sector de radio ', r1, ' y el trapecio circular que lo rodea hasta ', r2, ' tienen el mismo ángulo central. Si ', r2, ' es el triple de ', r1, ', ¿cuántas veces el área del sector cabe en la del trapecio?'],
      alternativas: ALT3.razon,
      datos: [D2.area, D3.resta],
      solucion: [
        { texto: 'Con r₁ = k y r₂ = 3k, el trapecio y el sector:', ecuacion: [junto([{ frac: [[th, ' · (9', cuad('k'), ' − ', cuad('k'), ')'], '2'] }, ' = 8 · ', { frac: [[th, ' · ', cuad('k')], '2'] }])] },
        { texto: 'El trapecio mide 8 sectores chicos.' },
        { texto: ['La ', letra(ALT3.razon, '2'), ' resta los radios sin elevarlos; la ', letra(ALT3.razon, '9'), ' compara con el sector grande; la ', letra(ALT3.razon, '3'), ' es la razón de los radios; la ', letra(ALT3.razon, '10'), ' suma en vez de restar.'] },
      ],
      respuesta: [letra(ALT3.razon, '8'), ', 8 veces'] },
    { nivel: 3, titulo: 'El limpiaparabrisas del examen', figura: fig(limpia(60, 40, { r2: 'r₂ = 60 cm', h: 'h = 40 cm', t: '120°', A: 'A = ?' })),
      enunciado: ['El brazo de un limpiaparabrisas mide 60 cm, y su jebe, de 40 cm, va al final del brazo. Si barre ', dH('120°'), ', ¿qué área limpia el jebe?'],
      alternativas: ALT3.limpia,
      datos: [D3.resta, D3.pi],
      solucion: [
        { texto: 'El jebe empieza a 60 − 40 = 20 cm del eje; 120° = 2π/3 rad:', ecuacion: junto([A, ' = ', { frac: [[dH('2π/3'), ' · (', cuad(dO('60')), ' − ', cuad(dO('20')), ')'], '2'] }, ' = ', dF('3200π/3 cm²')]) },
        { texto: ['La ', letra(ALT3.limpia, '1600π/3 cm²'), ' usa un sector del largo del jebe; la ', letra(ALT3.limpia, '1200π cm²'), ' es todo el brazo; la ', letra(ALT3.limpia, '6400π/3 cm²'), ' olvida la mitad; la ', letra(ALT3.limpia, '400π/3 cm²'), ' es lo que no limpia.'] },
      ],
      respuesta: [letra(ALT3.limpia, '3200π/3 cm²'), ', ', dF('3200π/3 cm²')] },
    { nivel: 3, titulo: 'Sector y banda iguales', figura: banda(80, 0.6, { r1: 'r₁ = 4 cm', r: 'r₂ = ?', t: 'θ' }),
      enunciado: ['Un sector de radio ', r1, ' = 4 cm y el trapecio circular que lo rodea hasta ', r2, ', con el mismo ángulo, tienen la misma área. ¿Cuánto mide ', r2, '?' + NO_ESC],
      alternativas: ALT3.iguales,
      datos: [D2.area, D3.resta, '√32 = 4√2'],
      solucion: [
        { texto: 'Las dos áreas tienen el mismo θ/2: se igualan los paréntesis.', ecuacion: [junto([cuad(r2), ' − 16 = 16']), FL, junto([cuad(r2), ' = 32']), FL, junto([r2, ' = ', dO('4√2 cm')])] },
        { texto: ['La ', letra(ALT3.iguales, '8 cm'), ' dobla el radio, como si el área creciera como el radio; la ', letra(ALT3.iguales, '32 cm'), ' olvida la raíz; la ', letra(ALT3.iguales, '4 cm'), ' es el radio de adentro; la ', letra(ALT3.iguales, '16 cm'), ' es su cuadrado.'] },
      ],
      respuesta: [letra(ALT3.iguales, '4√2 cm'), ', ', dO('4√2 cm')] },
    { nivel: 3, titulo: 'El borde de la banda', figura: banda(114.6, 3 / 7, { r: 'r₂ = 7 cm', r1: 'r₁ = 3 cm', t: '2 rad' }),
      enunciado: ['Un trapecio circular de ', dH('2 rad'), ' va desde ', r1, ' = 3 cm hasta ', r2, ' = 7 cm. ¿Cuánto mide su perímetro?'],
      alternativas: ALT3.perim,
      datos: [D3.arcos, D3.perim],
      solucion: [
        { texto: 'Los arcos y el ancho:', ecuacion: [junto([s1, ' = ', dH('2'), ' · ', dO('3'), ' = ', dI('6 cm')]), SEP, junto([s2, ' = ', dH('2'), ' · ', dO('7'), ' = ', dI('14 cm')]), SEP, junto(['h = 7 − 3 = 4 cm'])] },
        { texto: 'Todo el borde:', ecuacion: junto([dI('6'), ' + ', dI('14'), ' + 2 · 4 = 28 cm']) },
        { texto: ['La ', letra(ALT3.perim, '20 cm'), ' cuenta solo los arcos; la ', letra(ALT3.perim, '24 cm'), ', un solo ancho; la ', letra(ALT3.perim, '30 cm'), ' suma los radios en vez de los anchos; la ', letra(ALT3.perim, '14 cm'), ' es el arco de afuera.'] },
      ],
      respuesta: [letra(ALT3.perim, '28 cm'), ', 28 cm'] },
    { nivel: 3, titulo: 'El ángulo, en grados',
      enunciado: ['En un trapecio circular, el arco de adentro mide ', s1, ' = 2π cm, el de afuera ', s2, ' = 5π cm, y el ancho es h = 6 cm. ¿Cuánto mide su ángulo central, en grados?'],
      alternativas: ALT3.angulo,
      datos: [D3.arcos, 'Ancho: h = r₂ − r₁.', D3.pi],
      solucion: [
        { texto: 'La diferencia de los arcos es el ángulo por el ancho:', ecuacion: junto([th, ' = ', { frac: ['5π − 2π', '6'] }, ' = ', dH('π/2 rad'), ' = ', dH('90°')]) },
        { texto: ['La ', letra(ALT3.angulo, '210°'), ' suma los arcos; la ', letra(ALT3.angulo, '150°'), ' usa solo el arco de afuera; la ', letra(ALT3.angulo, '45°'), ' divide entre el doble del ancho; la ', letra(ALT3.angulo, '180°'), ', entre la mitad.'] },
      ],
      respuesta: [letra(ALT3.angulo, '90°'), ', ', dH('90°')] },
  ];

  // «Ahora tú» de la idea 3. Tipo 0: el área con los dos arcos y el ancho.
  function casoBandaArcos(rr) {
    let t, a, hv;
    do { t = rr.uno([0.5, 1, 1.5, 2]); a = rr.uno([4, 6, 8, 10]); hv = rr.uno([2, 3, 4, 5, 6]); } while (!Number.isInteger(t * a) || !Number.isInteger(t * (a + hv)) || (t === 1 && a === 6 && hv === 4));   // 6, 10 y 4: el ejemplo 2
    const sv1 = t * a, sv2 = t * (a + hv), av = (sv1 + sv2) / 2 * hv;
    return {
      pregunta: ['Los arcos de un trapecio circular miden ', s1, ` = ${sv1} cm y `, s2, ` = ${sv2} cm, y su ancho es h = ${hv} cm. ¿Cuánto mide su área?`],
      datos: [D3.semi],
      dibujo: banda(t / RAD, a / (a + hv), { s: `s₂ = ${sv2} cm`, s1: `s₁ = ${sv1} cm`, h: `h = ${hv} cm`, t: 'θ', A: 'A = ?' }),
      opciones: opciones(av, [
        { id: 'mitad', valor: (sv1 + sv2) * hv, error: 'TRAP-MITAD', siFuera: 'Sumar los arcos y multiplicar por el ancho va bien; falta dividir entre 2.' },
        { id: 'grande', valor: sv2 * hv, error: 'TRAP-GRANDE', siFuera: 'Multiplicar por el ancho va bien; pero con un solo arco sería un rectángulo.' },
        { id: 'resta', valor: (sv2 - sv1) / 2 * hv, error: 'TRAP-SUMA', siFuera: 'La mitad y el ancho van bien; pero los arcos se suman, como bases de un trapecio.' },
        { id: 'chico', valor: sv1 * hv, error: 'TRAP-GRANDE', siFuera: 'Multiplicar por el ancho va bien; pero va la semisuma de los arcos, no el chico.' },
      ], v => `${f(v)} cm²`),
      solucion: { texto: 'Como un trapecio: la semisuma de los arcos por el ancho.', ecuacion: junto([A, ' = ', { frac: [[dI(`${sv1}`), ' + ', dI(`${sv2}`)], '2'] }, ` · ${hv} = `, dF(`${f(av)} cm²`)]) },
    };
  }
  // Tipo 1: el ángulo central desde los dos arcos y el ancho.
  function casoBandaAngulo(rr) {
    let t, a, hv;
    do { t = rr.uno([0.5, 1, 1.5, 2, 2.5]); a = rr.uno([2, 4, 6, 8, 10]); hv = rr.uno([2, 3, 4, 5, 6]); } while (!Number.isInteger(t * a) || !Number.isInteger(t * (a + hv)));
    const sv1 = t * a, sv2 = t * (a + hv);
    return {
      pregunta: ['Los arcos de un trapecio circular miden ', s1, ` = ${sv1} cm y `, s2, ` = ${sv2} cm, y su ancho es h = ${hv} cm. ¿Cuánto mide su ángulo central, en radianes?` + NO_ESC],
      datos: [D3.arcos, 'Ancho: h = r₂ − r₁.'],
      dibujo: banda(otraAbertura(t / RAD), a / (a + hv), { s: `s₂ = ${sv2} cm`, s1: `s₁ = ${sv1} cm`, h: `h = ${hv} cm`, t: 'θ = ?' }),
      opciones: opciones(t, [
        { id: 'suma', valor: (sv1 + sv2) / hv, error: 'TRAP-SUMA', siFuera: 'Dividir entre el ancho va bien; pero se restan los arcos: la diferencia es θ · h.' },
        { id: 'grande', valor: sv2 / hv, error: 'TRAP-GRANDE', siFuera: 'Dividir un arco entre un largo es la idea; pero s₂ se divide entre r₂, no entre h.' },
        { id: 'mitad', valor: (sv2 - sv1) / (2 * hv), error: 'TRAP-MITAD', siFuera: 'Restar los arcos va bien; pero se divide entre el ancho, sin la mitad.' },
        { id: 'por', valor: (sv2 - sv1) * hv, error: 'ARCO-POR', siFuera: 'Restar los arcos va bien; pero la diferencia es θ por h: se divide entre h.' },
      ], v => `${f(v)} rad`),
      solucion: { texto: 'Con el mismo ángulo, la diferencia de los arcos es el ángulo por el ancho.', ecuacion: junto([th, ' = ', { frac: [[dI(`${sv2}`), ' − ', dI(`${sv1}`)], `${hv}`] }, ' = ', dH(`${f(t)} rad`)]) },
    };
  }
  // Tipo 2 (examen): la razón entre el trapecio y el sector chico (San Marcos 2026-II), o el área que limpia un
  // limpiaparabrisas con su brazo y su jebe (San Marcos 2020-I).
  function casoBandaExamen(rr) {
    if (rr.ent(0, 1)) {
      const k = rr.uno([2, 4, 5]), nom = ['', '', 'el doble', 'el triple', 'el cuádruple', 'el quíntuple'][k];   // sin el triple: es el ejemplo «Dos áreas en razón»
      return {
        pregunta: ['Un sector de radio ', r1, ' y el trapecio circular que lo rodea hasta ', r2, ` tienen el mismo ángulo central. Si `, r2, ` es ${nom} de `, r1, ', ¿cuántas veces el área del sector cabe en la del trapecio?'],
        datos: [D2.area, D3.resta],
        dibujo: banda(70, 1 / k, { r: 'r₂', r1: 'r₁', t: 'θ' }),
        opciones: opciones(k * k - 1, [
          { id: 'sincuad', valor: k - 1, error: 'TRAP-SIN-CUADRADO', siFuera: `Restar el sector chico va bien; pero se restan cuadrados: ${k * k} − 1, no ${k} − 1.` },
          { id: 'grande', valor: k * k, error: 'TRAP-GRANDE', siFuera: `Elevar al cuadrado va bien; pero ${k * k} es el sector grande: falta quitar el chico.` },
          { id: 'razon', valor: k, error: 'SEC-LINEAL', siFuera: 'La razón de los radios es la idea; pero las áreas van con el radio al cuadrado.' },
          { id: 'suma', valor: k * k + 1, error: 'TRAP-SUMA', siFuera: `Elevar al cuadrado va bien; pero el trapecio es el grande menos el chico: ${k * k} − 1.` },
        ], v => `${f(v)}`),
        solucion: { texto: `Con r₁ = k y r₂ = ${k}k, el trapecio mide θ(${k * k}k² − k²)/2: ${k * k - 1} veces el sector chico.`, ecuacion: junto([{ frac: [[th, ` · (${k * k}`, cuad('k'), ' − ', cuad('k'), ')'], '2'] }, ` = ${k * k - 1} · `, { frac: [[th, ' · ', cuad('k')], '2'] }]) },
      };
    }
    let r2v, hv, g;
    do { r2v = rr.uno([45, 50, 60]); hv = rr.uno([20, 25, 30, 35]); g = rr.uno([90, 100, 120, 135, 150]); } while (r2v === 50 && hv === 30 && g === 90);   // el ejemplo «El brazo y el jebe»
    const r1v = r2v - hv;
    const aT = piFrac(g * (r2v * r2v - r1v * r1v), 360);
    return {
      pregunta: ['El brazo de un limpiaparabrisas mide ', dO(`${r2v} cm`), `, y su jebe, de ${hv} cm, va al final del brazo. Si barre `, dH(`${g}°`), ', ¿qué área limpia el jebe?'],
      datos: [D3.resta, D3.pi],
      dibujo: fig(limpia(r2v, hv, { r2: `r₂ = ${r2v} cm`, h: `h = ${hv} cm`, t: `${g}°`, A: 'A = ?' }, { g })),
      opciones: opciones(`${aT} cm²`, [
        { id: 'jebe', valor: `${piFrac(g * hv * hv, 360)} cm²`, error: 'TRAP-RESTA', siFuera: `El jebe sí mide ${hv} cm; pero no empieza en el eje, sino a ${r1v} cm de él.` },
        { id: 'brazo', valor: `${piFrac(g * r2v * r2v, 360)} cm²`, error: 'TRAP-GRANDE', siFuera: 'Ese es el sector de todo el brazo; falta quitar la parte donde no hay jebe.' },
        { id: 'mitad', valor: `${piFrac(g * (r2v * r2v - r1v * r1v), 180)} cm²`, error: 'TRAP-MITAD', siFuera: 'Restar los cuadrados de los radios va bien; falta dividir entre 2.' },
        { id: 'sincuad', valor: `${piFrac(g * (r2v - r1v) * (r2v + r1v) / (r2v + r1v) * hv, 360)} cm²`, error: 'TRAP-SIN-CUADRADO', siFuera: `Restar está bien; pero se restan los cuadrados de los radios, ${r2v}² − ${r1v}².` },
      ], v => v),
      solucion: { texto: `El jebe va de ${r1v} cm a ${r2v} cm del eje, y ${g}° son ${piTxt(g)} rad.`, ecuacion: junto([A, ' = ', { frac: [[dH(piTxt(g)), ' · (', cuad(dO(`${r2v}`)), ' − ', cuad(dO(`${r1v}`)), ')'], '2'] }, ' = ', dF(`${aT} cm²`)]) },
    };
  }

  const trapecio = {
    id: 'trapecio-circular',
    titulo: 'Trapecio circular',
    pregunta: '¿Cómo se calcula el área de una banda curva, como la que limpia un limpiaparabrisas?',
    temas: ['Área del sector y del trapecio circular'],
    pieza: OB,
    aprendizaje: 'Un trapecio circular es un sector grande menos uno chico: A = θ(r₂² − r₁²)/2, o la semisuma de sus arcos por su ancho.',
    actividad: 'Cambiar el brazo y el jebe de un limpiaparabrisas y comparar sus dos arcos.',
    lee: {
      tarjetas: [
        { titulo: 'El limpiaparabrisas', texto: 'El brazo del limpiaparabrisas de un carro gira desde un eje, abajo del vidrio. Su jebe no llega hasta el eje: va solo al final del brazo, y limpia una banda curva. Esa figura se llama trapecio circular.',
          pieza: OB, dibujo: { datos: limpia(60, 30, {}), estado: {} } },
        { titulo: 'Sus partes', texto: ['El brazo, del eje a la punta, es el radio de afuera, ', r2, '. Del eje a donde empieza el jebe va el radio de adentro, ', r1, '. El jebe mide el ancho, h. Los dos arcos son ', s1, ' (adentro) y ', s2, ' (afuera).'] },
        { titulo: 'Las letras', texto: 'En muchos libros el radio de afuera se llama R y los arcos, L y l. Aquí R no se usa, porque en el tema anterior es el número de radianes: el radio es siempre r.' },
        { titulo: 'Qué mirar al jugar', texto: ['El brazo siempre barre 120°. Cambia el brazo y el jebe, y compara los dos arcos: tienen el mismo ángulo ', th, ', pero no el mismo radio.'] },
      ],
    },
    ejemplos: EJEMPLOS_TRAPECIO,
    juega: {
      pieza: OB,
      consigna: ['El brazo del limpiaparabrisas barre ', th, ' = 120°. Su jebe va al final del brazo y limpia la banda entre los arcos ', s1, ' y ', s2, '.'],
      mision: {
        texto: 'Con el brazo de 60 cm, haz que el arco de adentro mida 20π cm.',
        logrado: val => val.r2 === 60 && val.h === 30,
        bien: 'Listo: el jebe empieza a 30 cm del eje: 2π/3 · 30 = 20π cm.',
      },
      voz: '¿Por qué el arco de afuera es más largo?',
      leyenda: [
        { s: th, t: 'lo que barre el brazo' },
        { s: r2, t: 'radio de afuera: el brazo' },
        { s: r1, t: 'radio de adentro: del eje al jebe' },
        { s: 'h', t: 'el ancho: el largo del jebe' },
        { s: [s1, ' y ', s2], t: 'los arcos de adentro y de afuera' },
      ],
      controles: [
        { id: 'r2', etiqueta: 'r₂, el largo del brazo', color: 'c-o', min: 40, max: 60, paso: 10, inicio: 40, unidad: 'cm', decimales: 0 },
        { id: 'h', etiqueta: 'h, el largo del jebe', min: 15, max: 35, paso: 5, inicio: 20, unidad: 'cm', decimales: 0 },
      ],
      dibujo: val => ({ datos: limpia(val.r2, val.h, { r1: `r₁ = ${val.r2 - val.h} cm`, r2: `r₂ = ${val.r2} cm`, h: `h = ${val.h} cm`, t: '120°', s1: `s₁ = ${piFrac(2 * (val.r2 - val.h), 3)} cm`, s2: `s₂ = ${piFrac(2 * val.r2, 3)} cm` }), estado: {} }),
      lectura: val => jN([s1, ` = ${piFrac(2 * (val.r2 - val.h), 3)} cm adentro, `, s2, ` = ${piFrac(2 * val.r2, 3)} cm afuera`]),
      minimo: 3,
    },
    predice: {
      pregunta: 'Otro limpiaparabrisas tiene un brazo de 40 cm, y su jebe va desde los 20 cm hasta la punta. Si barre 120°, ¿qué área limpia?',
      datos: [[dH('120°'), ' = ', dH('2π/3 rad'), '.']],
      voz: 'El jebe no llega hasta el eje.',
      opciones: [
        { id: 'c', texto: '400π cm²', correcta: true },
        { id: 'jebe', texto: '400π/3 cm²', error: 'TRAP-RESTA', siFuera: 'Usar los 20 cm del jebe es razonable; pero así sale un sector con punta en el eje.' },
        { id: 'brazo', texto: '1600π/3 cm²', error: 'TRAP-GRANDE', siFuera: 'Ese es el sector de todo el brazo; falta quitar el pedazo sin jebe.' },
        { id: 'mitad', texto: '800π cm²', error: 'TRAP-MITAD', siFuera: 'Restar los dos sectores es la idea; falta la mitad de la fórmula del sector.' },
      ],
      dibujo: { datos: limpia(40, 20, { r1: 'r₁ = 20 cm', r2: 'r₂ = 40 cm', t: '120°', A: 'A = ?' }, { k: 3.6 }), estado: {} },
      revelar: { datos: limpia(40, 20, { r1: 'r₁ = 20 cm', r2: 'r₂ = 40 cm', t: '120°', A: 'A = 400π cm²' }, { k: 3.6 }), estado: {} },
      coincide: 'Coincide: el sector del brazo, 1600π/3, menos el que no limpia, 400π/3: quedan 400π cm².',
      noCoincide: 'Revisemos: al sector de todo el brazo se le quita el pedazo donde no hay jebe.',
    },
    mira: {
      pieza: OB,
      datos: limpia(40, 20, { r1: 'r₁ = 20 cm', r2: 'r₂ = 40 cm', t: '120°', A: [{ t: 'A = ?' }, { t: 'A = 400π cm²', paso: 3 }],
        s1: [{ t: '' }, { t: 's₁ = 40π/3 cm', paso: 4 }], s2: [{ t: '' }, { t: 's₂ = 80π/3 cm', paso: 4 }], h: [{ t: '' }, { t: 'h = 20 cm', paso: 4 }] }, { k: 3.6 }),
      voz: 'El jebe limpia lo que el brazo barre, menos el centro.',
      pasos: [
        { estado: { paso: 0 }, texto: 'El ángulo, en radianes:', ecuacion: junto([dH('120°'), ' = ', dH('2π/3 rad')]) },
        { estado: { paso: 1 }, texto: 'Todo el brazo barre un sector de radio 40 cm.', ecuacion: junto([{ frac: [[dH('2π/3'), ' · ', cuad(dO('40'))], '2'] }, ' = ', { frac: ['1600π', '3'] }]) },
        { estado: { paso: 2 }, texto: 'Los primeros 20 cm no tienen jebe: ese sector chico no se limpia.', ecuacion: junto([{ frac: [[dH('2π/3'), ' · ', cuad(dO('20'))], '2'] }, ' = ', { frac: ['400π', '3'] }]) },
        { estado: { paso: 3 }, texto: 'Lo limpio es la resta: se restan los cuadrados de los radios.', ecuacion: junto([A, ' = ', { frac: [[th, ' · (', cuad(r2), ' − ', cuad(r1), ')'], '2'] }, ' = ', dF('400π cm²')]) },
        { estado: { paso: 4 }, texto: 'También es como un trapecio: la semisuma de los arcos por el ancho.', ecuacion: junto([{ frac: [[dI('40π/3'), ' + ', dI('80π/3')], '2'] }, ' · 20 = ', dF('400π')]) },
      ],
    },
    regla: {
      texto: 'Un trapecio circular es un sector grande menos uno chico, del mismo ángulo: se restan los cuadrados de los radios. También es la semisuma de sus arcos por su ancho.',
      ecuacion: [junto([A, ' = ', { frac: [[th, ' · (', cuad(r2), ' − ', cuad(r1), ')'], '2'] }]), SEP, junto([A, ' = ', { frac: [[s1, ' + ', s2], '2'] }, ' · h']), SEP, junto([s2, ' − ', s1, ' = ', th, ' · h'])],
      condicion: 'θ en radianes; r₁ y r₂ se miden desde el centro, y el ancho es h = r₂ − r₁.',
      voz: 'Se restan los cuadrados, no los radios.',
      // Figura propia (cierre, 19 nov): la del último paso de Mira apilaba tres rótulos sobre el arco de afuera.
      dibujo: { pieza: OB, datos: { objeto: 'figura', g: 80, r1: 0.5, area: true, rot: { r: 'r₂', r1: 'r₁', h: 'h', s: 's₂', s1: 's₁', t: 'θ' } }, estado: {} },
    },
    // Así se resuelve: el área de un jardín con el ángulo en grados y los dos radios. «Ahora tú» pide el área con los
    // arcos, el ángulo desde los arcos, y la razón de áreas o el limpiaparabrisas de examen.
    resuelve: {
      pieza: OB,
      generar(sem) {
        const rr = azar(sem + 900), g = rr.uno([30, 45, 60, 72, 90, 120]);
        let a, b;
        do { a = rr.ent(2, 8); b = rr.ent(a + 2, 12); } while (b - a > 6);
        const aT = piFrac(g * (b * b - a * a), 360), f1 = a / b;
        return {
          enunciado: ['Un jardín de una plaza circular va desde ', dO(`${a} m`), ' hasta ', dO(`${b} m`), ' del centro, y abarca ', dH(`${g}°`), '. ¿Cuánto mide su área?'],
          datos: [D3.resta, D3.pi],
          dibujo: banda(g, f1, { r: `r₂ = ${b} m`, r1: `r₁ = ${a} m`, t: `${g}°`, A: 'A = ?' }),
          pasos: [
            { tipo: 'pide', texto: ['Piden el área ', A, ' del jardín: un trapecio circular, en m².'] },
            { tipo: 'datos', texto: ['El radio de adentro es ', r1, ` = ${a} m; el de afuera, `, r2, ` = ${b} m. El ángulo, ${g}°, viene en grados.`] },
            { tipo: 'regla', texto: 'Es un sector grande menos uno chico: se restan los cuadrados de los radios.', ecuacion: junto([A, ' = ', { frac: [[th, ' · (', cuad(r2), ' − ', cuad(r1), ')'], '2'] }]) },
            { tipo: 'cuentas', texto: `El ángulo, en radianes: ${g}° son ${piTxt(g)} rad. Los cuadrados: ${b * b} − ${a * a} = ${b * b - a * a}.`, ecuacion: junto([dH(`${g}°`), ' = ', dH(`${piTxt(g)} rad`)]) },
            { tipo: 'cuentas', texto: 'El área:', ecuacion: junto([A, ' = ', { frac: [[dH(piTxt(g)), ` · ${b * b - a * a}`], '2'] }, ' = ', dF(`${aT} m²`)]),
              dibujo: banda(g, f1, { r: `r₂ = ${b} m`, r1: `r₁ = ${a} m`, t: `${piTxt(g)} rad`, A: `A = ${aT} m²` }) },
            { tipo: 'sentido', texto: `Tiene sentido: el sector grande mide ${piFrac(g * b * b, 360)} m², y el jardín es un poco menos.` },
          ],
          respuesta: [A, ' = ', dF(`${aT} m²`)],
        };
      },
    },
    ahoraTu: {
      pieza: OB,
      // Sin «se restan los cuadrados»: dos de los tres tipos se hacen con los arcos (lector en frío A).
      voz: 'Mira qué te dan: los radios o los arcos.',
      generar(sem) { return conCuatro([casoBandaArcos, casoBandaAngulo, casoBandaExamen][sem % 3], azar(sem + 31)); },
    },
  };

  // ====================================================================================================================
  // Idea 4: número de vueltas de una rueda
  // ====================================================================================================================
  // Objeto de la primera pantalla: la rueda de una bicicleta con la llanta mojada en pintura: al rodar deja su huella.
  // Cambia: el radio r de la rueda y las vueltas n que da. · Permanece: el piso y la rueda al empezar (punteada). ·
  // Progresa: la huella turquesa, que mide lo que avanza el centro. · Se reserva: rodar alrededor de otra rueda (la
  // predicción: el juego solo rueda en una recta). · Debe verse: cada vuelta deja en el piso el largo del borde, 2πr.
  // Errores (hipótesis): VUEL-CONTACTO cuenta solo el borde de la rueda fija que toca; VUEL-TRASLADA cree que no gira;
  // VUEL-DIAMETRO divide entre media vuelta (o usa el diámetro donde va el radio); VUEL-SIN-PI olvida π; VUEL-RADIO toma la
  // vuelta por un radio; VUEL-DENTRO y VUEL-FUERA cambian la suma por la resta de los radios; VUEL-RESTA-RADIOS usa la
  // diferencia de los radios; VUEL-UNA-RUEDA usa una sola rueda; VUEL-VUELTAS-RAD toma las vueltas por radianes.
  const KR = 63;                                                 // px por metro: la misma escala en todo el juego
  const ruedaD = (rv, nvv, rot, extra = {}) => Object.assign({ objeto: 'rueda', r: rv, n: nvv, rot, k: KR }, extra);
  const vueltasT = x => `${f(x)} ${Math.abs(x - 1) < 1e-9 ? 'vuelta' : 'vueltas'}`;
  const D4 = {
    vueltas: ['Al rodar sin deslizar: ', nv, ' = ', { frac: [dd, ['2π · ', r]] }, ' (', dd, ': lo que avanza el centro).'],
    borde: ['Largo del borde de una rueda: 2π · ', r, '.'],
    giro: ['Ángulo que gira la rueda: ', th, ' = 2π · ', nv, ' rad; y ', dd, ' = ', th, ' · ', r, '.'],
    rodea: 'Alrededor de una rueda fija, el centro recorre una circunferencia: de radio suma de los radios por fuera, resta por dentro.',
    vuelta: D1.vuelta,
    cm: D1.cm,
    km: '1 km = 1000 m.',
    piNum: D1.piNum,
  };
  // Ejemplos de la idea 4. Cuentas rehechas aparte (cuentas.js): 2π·0,3; 10π/(2π·0,25); 4π/(0,8π); 2π·3; 4,8π/(16π);
  // 70π/(0,7π); 900/360·0,4π; (6 + 2)/2; (6 − 2)/2; 40·0,5; d/(0,8π) − d/(1,2π) = 10; (3r + r)/r; (1 − 0,25)/0,25;
  // 1000·0,7π con π ≈ 3,14; 3π/0,3, y cada alternativa equivocada.
  const ALT4 = {
    tractor: ['12π m', '4π m', '24π m', '8π m', '48π m'],
    triple: ['3', '2', '8', '4'],
    aro: ['3', '4', '5', '6'],
    km: ['1,1 km', '0,7 km', '4,4 km', '2,2 km', '0,35 km'],
    gira: ['10 rad', '10π rad', '5π rad', '5 rad'],
  };
  // Una rueda de radio rv junto a una fija de radio Rv (por fuera o por dentro), al empezar: la fija, la que rueda con su
  // radio y el camino de su centro, punteado, sin decir su radio (eso se calcula). Dibujo en trig-plano, a escala 1 : 2.
  function aroFig(lado, Rv, rv) {
    const k = 0.5, Rk = Rv * k, rk = rv * k, rc = lado === 'fuera' ? Rk + rk : Rk - rk, L = lado === 'fuera' ? rc + rk + 1.8 : Rk + 0.9;
    const fuera = lado === 'fuera';
    return {
      ventana: { x: [-L, L], y: [-L, L] }, ejes: false,
      circulos: [{ r: Rk }, { r: rc, color: 'i', discontinua: true }, { cx: rc, cy: 0, r: rk }],
      rayos: [{ cx: rc, cy: 0, ang: 90, largo: rk, color: 'o', punta: false }],
      puntos: [{ x: rc, y: 0 }],
      // La fija se rotula adentro (por fuera) o encima del aro (por dentro); el camino, junto a su circunferencia punteada.
      rotulos: [{ x: 0, y: fuera ? 0 : Rk + 0.42, texto: fuera ? `fija: ${Rv} cm` : `aro: ${Rv} cm` }, fuera ? { x: rc + rk + 0.15, y: -0.1, texto: `${rv} cm`, color: 'o', ancla: 'start' } : { x: rc, y: -rk - 0.45, texto: `${rv} cm`, color: 'o' },
        { x: 0, y: fuera ? -rc - 0.8 : -Rk - 0.45, texto: 'camino del centro (punteado)', color: 'i' }],
      alt: `Una rueda de ${rv} cm que rueda por ${lado} de ${lado === 'fuera' ? 'otra fija' : 'un aro fijo'} de ${Rv} cm; punteado, el camino de su centro.`,
    };
  }
  const EJEMPLOS_VUELTAS = [
    { nivel: 1, titulo: 'Una vuelta, un borde', figura: fig(ruedaD(0.3, 1, { r: 'r = 0,3 m', d: 'd = ?' })),
      enunciado: ['La rueda de una bicicleta tiene 0,3 m de radio y rueda sin deslizar. ¿Cuánto avanza la bici cuando la rueda da ', dF('una vuelta'), '?' + NO_ESC],
      datos: [D4.borde],
      solucion: [{ texto: 'En una vuelta, la huella mide el borde entero de la llanta.', ecuacion: junto([dd, ' = 2π · ', dO('0,3 m'), ' = ', dI('0,6π m'), ' ≈ ', dI('1,88 m')]) }],
      respuesta: [dd, ' = ', dI('0,6π m'), ' ≈ ', dI('1,88 m')] },
    { nivel: 1, titulo: '¿Cuántas vueltas?',
      enunciado: 'Una rueda de 0,25 m de radio avanza 10π m sin deslizar. ¿Cuántas vueltas da?',
      datos: [D4.vueltas],
      solucion: [{ texto: 'Cada vuelta avanza 2π · 0,25 = 0,5π m. Cuántas caben en 10π m:', ecuacion: junto([nv, ' = ', { frac: [dI('10π'), ['2π · ', dO('0,25')]] }, ' = ', dF('20')]) }],
      respuesta: [nv, ' = ', dF('20 vueltas')] },
    { nivel: 1, titulo: 'La huella pintada',
      enunciado: 'La llanta mojada de una rueda de 0,4 m de radio deja en el piso una huella de 4π m. ¿Cuántas vueltas dio la rueda?',
      datos: [D4.vueltas],
      solucion: [{ texto: 'La huella mide lo que avanzó el centro:', ecuacion: junto([nv, ' = ', { frac: [dI('4π'), ['2π · ', dO('0,4')]] }, ' = ', dF('5')]) }],
      respuesta: [nv, ' = ', dF('5 vueltas')] },
    { nivel: 1, titulo: 'El ángulo que gira',
      enunciado: ['Una rueda da ', dF('3 vueltas'), ' completas. ¿Qué ángulo gira, en radianes?'],
      datos: [D4.vuelta],
      solucion: [{ texto: 'Cada vuelta son 2π rad:', ecuacion: junto([th, ' = 3 · ', dH('2π rad'), ' = ', dH('6π rad')]) }],
      respuesta: [th, ' = ', dH('6π rad')] },
    { nivel: 1, titulo: 'El radio, desde la huella',
      enunciado: ['Una rueda da ', dF('8 vueltas'), ' y su huella mide 4,8π m. ¿Cuánto mide su radio?'],
      datos: [D4.vueltas],
      solucion: [{ texto: 'Cada vuelta avanzó 4,8π ÷ 8 = 0,6π m, que es 2π · r:', ecuacion: junto([r, ' = ', { frac: [dI('0,6π'), '2π'] }, ' = ', dO('0,3 m')]) }],
      respuesta: [r, ' = ', dO('0,3 m')] },
    { nivel: 2, titulo: 'Metros y centímetros',
      enunciado: 'Una rueda de 35 cm de radio avanza 70π m sin deslizar. ¿Cuántas vueltas da?',
      datos: [D4.vueltas, D4.cm],
      solucion: [
        { texto: 'El radio y el camino en la misma unidad: 35 cm = 0,35 m. Una vuelta avanza 2π · 0,35 = 0,7π m.' },
        { texto: 'Las vueltas:', ecuacion: junto([nv, ' = ', { frac: [dI('70π'), dI('0,7π')] }, ' = ', dF('100')]) },
      ],
      respuesta: [nv, ' = ', dF('100 vueltas')] },
    { nivel: 2, titulo: 'De los grados al avance',
      enunciado: ['La marca de una rueda de 0,2 m de radio gira ', dH('900°'), ' mientras la rueda rueda sin deslizar. ¿Cuánto avanzó?'],
      datos: [D4.vueltas, ['1 vuelta = ', dH('360°'), '.']],
      solucion: [
        { texto: '900° en vueltas:', ecuacion: junto(['900° ÷ 360° = ', dF('2,5')]) },
        { texto: 'Cada vuelta avanza 2π · 0,2 = 0,4π m:', ecuacion: junto([dd, ' = ', dF('2,5'), ' · 0,4π = ', dI('π m'), ' ≈ ', dI('3,14 m')]) },
      ],
      respuesta: [dd, ' = ', dI('π m'), ' ≈ ', dI('3,14 m')] },
    { nivel: 2, titulo: 'Por fuera de otra', figura: { pieza: 'trig-plano', datos: aroFig('fuera', 6, 2), estado: {} },
      enunciado: 'Una rueda de 2 cm de radio rueda sin deslizar por fuera de otra fija, de 6 cm, hasta volver a su lugar. ¿Cuántas vueltas da?',
      datos: [D4.vueltas, D4.rodea],
      solucion: [
        { texto: 'Su centro recorre una circunferencia de radio 6 + 2 = 8 cm:', ecuacion: junto([dd, ' = 2π · 8 = ', dI('16π cm')]) },
        { texto: 'Las vueltas:', ecuacion: junto([nv, ' = ', { frac: [dI('16π'), ['2π · ', dO('2')]] }, ' = ', dF('4')]) },
      ],
      respuesta: [nv, ' = ', dF('4 vueltas')] },
    { nivel: 2, titulo: 'Por dentro de un aro', figura: { pieza: 'trig-plano', datos: aroFig('dentro', 6, 2), estado: {} },
      enunciado: 'Una rueda de 2 cm de radio rueda sin deslizar por dentro de un aro fijo de 6 cm, hasta volver a su lugar. ¿Cuántas vueltas da?',
      datos: [D4.vueltas, D4.rodea],
      solucion: [
        { texto: 'Por dentro, su centro recorre una circunferencia de radio 6 − 2 = 4 cm:', ecuacion: junto([dd, ' = 2π · 4 = ', dI('8π cm')]) },
        { texto: 'Las vueltas:', ecuacion: junto([nv, ' = ', { frac: [dI('8π'), ['2π · ', dO('2')]] }, ' = ', dF('2')]) },
      ],
      respuesta: [nv, ' = ', dF('2 vueltas')] },
    { nivel: 2, titulo: 'Con el ángulo en radianes',
      enunciado: ['Una rueda de 0,5 m de radio gira ', dH('40 rad'), ' rodando sin deslizar. ¿Cuánto avanza su centro?'],
      datos: [D4.giro],
      solucion: [
        { texto: 'Lo que avanza el centro es el arco que rueda el borde: el ángulo por el radio.' },
        { texto: 'Se multiplica:', ecuacion: junto([dd, ' = ', dH('40'), ' · ', dO('0,5 m'), ' = ', dI('20 m')]) },
      ],
      respuesta: [dd, ' = ', dI('20 m')] },
    // Nivel 3, tipo examen. Letras de las correctas: C, D, A, D, B.
    { nivel: 3, titulo: 'Dos ruedas, distintas vueltas',
      enunciado: ['Las ruedas de adelante de un tractor tienen 0,4 m de radio y las de atrás, 0,6 m. En un tramo, cada rueda de adelante da ', dF('10 vueltas'), ' más que cada una de atrás. ¿Cuánto avanzó el tractor?'],
      alternativas: ALT4.tractor,
      datos: [D4.vueltas],
      solucion: [
        { texto: 'Las dos avanzan lo mismo, d. La diferencia de vueltas es 10:', ecuacion: junto([{ frac: [dd, '0,8π'] }, ' − ', { frac: [dd, '1,2π'] }, ' = 10']) },
        { texto: 'Con denominador común 2,4π:', ecuacion: junto([{ frac: [['3', dd, ' − 2', dd], '2,4π'] }, ' = 10', FL, dd, ' = ', dI('24π m')]) },
        { texto: ['La ', letra(ALT4.tractor, '12π m'), ' toma la vuelta por π · r; la ', letra(ALT4.tractor, '4π m'), ' resta los radios; la ', letra(ALT4.tractor, '8π m'), ' cree que la de adelante da solo 10 vueltas; la ', letra(ALT4.tractor, '48π m'), ' usa diámetros.'] },
      ],
      respuesta: [letra(ALT4.tractor, '24π m'), ', ', dI('24π m')] },
    { nivel: 3, titulo: 'Alrededor de una moneda triple',
      enunciado: 'Una moneda de radio r rueda sin deslizar por fuera de otra fija, de radio 3r, hasta volver a su lugar. ¿Cuántas vueltas da sobre sí misma?',
      alternativas: ALT4.triple,
      datos: [D4.vueltas, D4.rodea],
      solucion: [
        { texto: 'Su centro recorre una circunferencia de radio 3r + r = 4r:', ecuacion: junto([nv, ' = ', { frac: [['2π · 4', r], ['2π', r]] }, ' = ', dF('4')]) },
        { texto: ['La ', letra(ALT4.triple, '3'), ' cuenta solo el borde de la moneda fija; la ', letra(ALT4.triple, '2'), ' resta los radios, como por dentro; la ', letra(ALT4.triple, '8'), ' divide entre media vuelta, π · r.'] },
      ],
      respuesta: [letra(ALT4.triple, '4'), ', ', dF('4 vueltas')] },
    { nivel: 3, titulo: 'Por dentro de un aro grande',
      enunciado: 'Una rueda de 0,25 m de radio rueda sin deslizar por dentro de un aro fijo de 1 m de radio, hasta dar la vuelta completa al aro. ¿Cuántas vueltas da sobre sí misma?',
      alternativas: ALT4.aro,
      datos: [D4.vueltas, D4.rodea],
      solucion: [
        { texto: 'Por dentro, su centro recorre una circunferencia de radio 1 − 0,25 = 0,75 m:', ecuacion: junto([nv, ' = ', { frac: ['2π · 0,75', ['2π · ', dO('0,25')]] }, ' = ', dF('3')]) },
        { texto: ['La ', letra(ALT4.aro, '4'), ' cuenta solo el borde del aro; la ', letra(ALT4.aro, '5'), ' suma los radios, como por fuera; la ', letra(ALT4.aro, '6'), ' divide entre media vuelta.'] },
      ],
      respuesta: [letra(ALT4.aro, '3'), ', ', dF('3 vueltas')] },
    { nivel: 3, titulo: 'Mil vueltas, en kilómetros',
      enunciado: ['Una rueda de 0,35 m de radio da ', dF('1000 vueltas'), ' sin deslizar. ¿Cuántos kilómetros avanza, aproximadamente?'],
      alternativas: ALT4.km,
      datos: [D4.vueltas, D4.km, D4.piNum],
      solucion: [
        { texto: 'Lo que avanza:', ecuacion: junto([dd, ' = 1000 · 2π · ', dO('0,35'), ' = 700π m ≈ 2198 m']) },
        { texto: 'En kilómetros: 2198 m ≈ 2,2 km.' },
        { texto: ['La ', letra(ALT4.km, '1,1 km'), ' toma la vuelta por π · r; la ', letra(ALT4.km, '0,7 km'), ' olvida π; la ', letra(ALT4.km, '4,4 km'), ' usa el diámetro donde va el radio; la ', letra(ALT4.km, '0,35 km'), ' avanza un radio por vuelta.'] },
      ],
      respuesta: [letra(ALT4.km, '2,2 km'), ', ≈ ', dI('2,2 km')] },
    { nivel: 3, titulo: 'Lo que gira la rueda',
      enunciado: 'Una bicicleta con ruedas de 0,3 m de radio avanza 3π m sin deslizar. ¿Qué ángulo gira cada rueda, en radianes?',
      alternativas: ALT4.gira,
      datos: [D4.giro],
      solucion: [
        { texto: 'Lo que avanza es el arco que rueda el borde: d = θ · r.', ecuacion: junto([th, ' = ', { frac: [dI('3π'), dO('0,3')] }, ' = ', dH('10π rad')]) },
        { texto: ['La ', letra(ALT4.gira, '10 rad'), ' olvida π; la ', letra(ALT4.gira, '5π rad'), ' toma la vuelta por π rad; la ', letra(ALT4.gira, '5 rad'), ' da las vueltas, 5, como si fueran radianes.'] },
      ],
      respuesta: [letra(ALT4.gira, '10π rad'), ', ', dH('10π rad')] },
  ];

  // «Ahora tú» de la idea 4. Tipo 0: cuánto avanza una rueda con sus vueltas, o su radio con lo que avanza.
  function casoAvance(rr) {
    let rv, n0;
    do { rv = rr.uno([0.2, 0.25, 0.3, 0.35, 0.4, 0.5]); n0 = rr.uno([3, 4, 5, 6, 8, 10, 12, 15, 20]); } while (rv === 0.3 && n0 === 8);   // el ejemplo 5
    const dT = `${f(2 * rv * n0)}π m`;
    if (rr.ent(0, 1)) {
      return {
        pregunta: ['Una rueda de ', dO(`${f(rv)} m`), ' de radio da ', dF(`${n0} vueltas`), ' rodando sin deslizar. ¿Cuánto avanza su centro?'],
        datos: [D4.vueltas],
        opciones: opciones(dT, [
          { id: 'medio', valor: `${f(rv * n0)}π m`, error: 'VUEL-DIAMETRO', siFuera: `Vueltas por borde es la idea; pero el borde mide 2π · ${f(rv)}, no π · ${f(rv)}.` },
          { id: 'sinpi', valor: `${f(2 * rv * n0)} m`, error: 'VUEL-SIN-PI', siFuera: 'Vueltas por borde es la idea; pero el borde mide 2π · r: falta π.' },
          { id: 'radio', valor: `${f(rv * n0)} m`, error: 'VUEL-RADIO', siFuera: 'Multiplicar por las vueltas va bien; pero cada vuelta avanza el borde entero, no un radio.' },
          { id: 'diam', valor: `${f(4 * rv * n0)}π m`, error: 'VUEL-DIAMETRO', siFuera: 'Vueltas por borde es la idea; pero en 2π · r va el radio, no el diámetro.' },
        ], v => v),
        solucion: { texto: `Cada vuelta avanza el borde, 2π · ${f(rv)} = ${f(2 * rv)}π m.`, ecuacion: junto([dd, ` = ${n0} · 2π · `, dO(f(rv)), ' = ', dI(dT)]) },
      };
    }
    return {
      pregunta: ['Una rueda da ', dF(`${n0} vueltas`), ' sin deslizar, y su centro avanza ', dI(dT), '. ¿Cuánto mide su radio?'],
      datos: [D4.vueltas],
      opciones: opciones(rv, [
        { id: 'diam', valor: 2 * rv, error: 'VUEL-DIAMETRO', siFuera: `Dividir entre ${n0} vueltas va bien; pero ${f(2 * rv)}π es 2π · r: falta dividir entre 2.` },
        { id: 'medio', valor: rv / 2, error: 'VUEL-DIAMETRO', siFuera: 'Dividir entre las vueltas va bien; pero cada vuelta es 2π · r, no 4π · r.' },
        { id: 'sinvueltas', valor: rv * n0, error: 'VUEL-UNA-RUEDA', siFuera: `Dividir entre 2π está bien; falta repartir entre las ${n0} vueltas.` },
        { id: 'pi', valor: Math.round(rv * PI * 1000) / 1000, error: 'VUEL-SIN-PI', siFuera: 'Repartir entre las vueltas va bien; pero π se cancela: también se divide entre π.' },
      ], v => `${f(v, 3)} m`),
      solucion: { texto: `Cada vuelta avanzó ${dT.replace(' m', '')} ÷ ${n0} = ${f(2 * rv)}π m, que es 2π · r.`, ecuacion: junto([r, ' = ', { frac: [dI(`${f(2 * rv)}π`), '2π'] }, ' = ', dO(`${f(rv)} m`)]) },
    };
  }
  // Tipo 1: una rueda que rueda alrededor de otra fija, por fuera o por dentro.
  function casoRodea(rr) {
    let a, k;
    do { a = rr.uno([1, 2, 3, 4]); k = rr.uno([2, 3, 4, 5]); } while (a === 2 && k === 3);   // 2 y 6 cm: los ejemplos «Por fuera» y «Por dentro»
    const b = k * a, fuera = rr.ent(0, 1) === 1, nb = fuera ? k + 1 : k - 1;
    return {
      pregunta: `Una rueda de ${a} cm de radio rueda sin deslizar por ${fuera ? 'fuera de otra rueda fija' : 'dentro de un aro fijo'} de ${b} cm, hasta volver a su lugar. ¿Cuántas vueltas da sobre sí misma?`,
      datos: [D4.vueltas, D4.rodea],
      opciones: opciones(nb, [
        { id: 'contacto', valor: k, error: 'VUEL-CONTACTO', siFuera: `Contar el borde que toca serviría en una recta; aquí cuenta el camino del centro, de radio ${fuera ? b + a : b - a} cm.` },
        { id: 'otro', valor: fuera ? k - 1 : k + 1, error: fuera ? 'VUEL-DENTRO' : 'VUEL-FUERA', siFuera: `Usar el camino del centro va bien; pero por ${fuera ? 'fuera los radios se suman' : 'dentro los radios se restan'}.` },
        { id: 'mediavuelta', valor: 2 * nb, error: 'VUEL-DIAMETRO', siFuera: 'El camino del centro está bien; pero se divide entre el borde, 2π · r, no entre π · r.' },
        { id: 'traslada', valor: 1, error: 'VUEL-TRASLADA', siFuera: 'Dar la vuelta alrededor es cierto; pero mientras rueda, también gira sobre sí misma.' },
      ], v => vueltasT(v)),
      solucion: { texto: `El centro recorre una circunferencia de radio ${b} ${fuera ? '+' : '−'} ${a} = ${fuera ? b + a : b - a} cm.`, ecuacion: junto([nv, ' = ', { frac: [`2π · ${fuera ? b + a : b - a}`, ['2π · ', dO(`${a}`)]] }, ' = ', dF(`${nb}`)]) },
    };
  }
  // Tipo 2 (examen): dos ruedas de radios distintos que avanzan lo mismo y dan distintas vueltas.
  function casoTractor(rr) {
    let a, b, D;
    do { [a, b] = rr.uno([[0.3, 0.6], [0.4, 0.6], [0.4, 0.8], [0.5, 1], [0.2, 0.3]]); D = rr.uno([5, 10, 15, 20]); } while (a === 0.4 && b === 0.6 && D === 10);   // el ejemplo del tractor
    const q = a * b / (b - a);
    const dT = `${f(2 * q * D)}π m`;
    return {
      // Un tractor (cierre, 19 nov): un carro no tiene las ruedas de atrás de 1 m de radio.
      pregunta: ['Las ruedas de adelante de un tractor tienen ', dO(`${f(a)} m`), ' de radio y las de atrás, ', dO(`${f(b)} m`), '. En un tramo, cada rueda de adelante da ', dF(`${D} vueltas`), ' más que cada una de atrás. ¿Cuánto avanzó el tractor?'],
      datos: [D4.vueltas],
      opciones: opciones(dT, [
        { id: 'resta', valor: `${f(2 * D * (b - a))}π m`, error: 'VUEL-RESTA-RADIOS', siFuera: `Usar las ${D} vueltas de diferencia va bien; pero no se restan los radios: se restan las vueltas.` },
        { id: 'una', valor: `${f(2 * D * a)}π m`, error: 'VUEL-UNA-RUEDA', siFuera: `La rueda de adelante no da solo ${D} vueltas: da ${D} más que la de atrás.` },
        { id: 'medio', valor: `${f(q * D)}π m`, error: 'VUEL-DIAMETRO', siFuera: 'El planteo con la diferencia de vueltas va bien; pero cada vuelta es 2π · r, no π · r.' },
        { id: 'diam', valor: `${f(4 * q * D)}π m`, error: 'VUEL-DIAMETRO', siFuera: 'El planteo va bien; pero en 2π · r va el radio de cada rueda, no su diámetro.' },
      ], v => v),
      solucion: { texto: `Las dos avanzan lo mismo, d; las de adelante dan ${D} vueltas más.`, ecuacion: junto([{ frac: [dd, `${f(2 * a)}π`] }, ' − ', { frac: [dd, `${f(2 * b)}π`] }, ` = ${D}`, FL, dd, ' = ', dI(dT)]) },
    };
  }

  const vueltasIdea = {
    id: 'vueltas-rueda',
    titulo: 'Número de vueltas de una rueda',
    pregunta: '¿Cuántas vueltas da una rueda que rueda sin deslizar?',
    temas: ['Número de vueltas de una rueda'],
    pieza: OB,
    aprendizaje: 'Sin deslizar, una rueda da n = d/(2πr) vueltas, con d el camino de su centro; alrededor de otra rueda, ese camino es otra circunferencia.',
    actividad: 'Hacer rodar la rueda de una bicicleta con la llanta pintada y medir su huella.',
    lee: {
      tarjetas: [
        { titulo: 'La llanta pintada', texto: 'Una bicicleta pasa por un charco de pintura y sigue rodando. Su llanta deja una huella en el piso: una raya que empieza donde la llanta tocó el charco.',
          pieza: OB, dibujo: { datos: ruedaD(0.35, 1.25, {}), estado: {} } },
        { titulo: 'Rodar sin deslizar', texto: 'Si la rueda no patina, el punto de la llanta que toca el piso no resbala. Así, lo que avanza la bici y lo que gira su rueda van amarrados.' },
        { titulo: 'Contar vueltas', texto: 'Una marca en la llanta cuenta las vueltas: en cada vuelta completa vuelve a tocar el piso. El número de vueltas no tiene que ser entero: puede ser 1,5.' },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a cambiar el radio ', r, ' de la rueda y las vueltas ', nv, '. Compara la huella, ', dd, ', con el largo del borde de la llanta.'] },
      ],
    },
    ejemplos: EJEMPLOS_VUELTAS,
    juega: {
      pieza: OB,
      consigna: ['La llanta pintada deja su huella al rodar sin deslizar. ', dd, ' es lo que avanza la bici; ', nv, ', las vueltas de su rueda.'],
      mision: {
        texto: 'Con una sola vuelta de la rueda, haz que la bici avance justo 0,8π m.',
        logrado: val => Math.abs(val.n * 2 * val.r - 0.8) < 1e-9,
        bien: 'Listo: una vuelta de la rueda de 0,4 m avanza 2π · 0,4 = 0,8π m.',
      },
      voz: '¿Cuánto avanza la bici en una vuelta?',
      leyenda: [
        { s: r, t: 'el radio de la rueda' },
        { s: nv, t: 'número de vueltas: cuántas veces gira la marca' },
        { s: dd, t: 'lo que avanza: el largo de la huella' },
        { s: 'línea punteada', t: 'la rueda al empezar' },
      ],
      controles: [
        { id: 'r', etiqueta: 'r, el radio de la rueda', color: 'c-o', min: 0.3, max: 0.4, paso: 0.05, inicio: 0.3, unidad: 'm', decimales: 2 },
        { id: 'n', etiqueta: 'n, vueltas que da la rueda', color: 'c-f', min: 0.25, max: 1.5, paso: 0.25, inicio: 0.5, decimales: 2 },
      ],
      // El número que acompaña a π va exacto (0,175π, no 0,18π: auditoría del cierre, 19 nov).
      dibujo: val => ({ datos: ruedaD(val.r, val.n, { r: `r = ${f(val.r)} m`, d: `d = ${f(val.n * 2 * val.r, 3)}π m` }), estado: {} }),
      lectura: val => jN([`${vueltasT(val.n)}, de ${f(2 * val.r)}π m cada una: `, dd, ` = ${f(val.n * 2 * val.r, 3)}π m`]),
      minimo: 3,
    },
    predice: {
      pregunta: 'Una moneda rueda sin deslizar alrededor de otra igual, que está fija, hasta volver a su lugar. ¿Cuántas vueltas da sobre sí misma?',
      datos: ['Las dos monedas tienen el mismo radio.', 'Rueda sin deslizar: su borde no resbala sobre el de la fija.'],
      voz: 'Sigue la marca de la moneda que rueda.',
      opciones: [
        { id: 'c', texto: '2 vueltas', correcta: true },
        { id: 'contacto', texto: '1 vuelta', error: 'VUEL-CONTACTO', siFuera: 'Contar el borde que toca vale en una recta. Aquí el centro recorre una circunferencia más grande.' },
        { id: 'traslada', texto: '0: solo se traslada', error: 'VUEL-TRASLADA', siFuera: 'Sí da la vuelta alrededor; pero sin deslizar también gira: su marca cambia de dirección.' },
        { id: 'diametro', texto: '4 vueltas', error: 'VUEL-DIAMETRO', siFuera: 'Usar el camino del centro va bien; pero se divide entre el borde entero, 2π · r.' },
      ],
      dibujo: { datos: { objeto: 'monedas', pos: [0], rot: { fija: 'fija' } }, estado: {} },
      revelar: { datos: { objeto: 'monedas', pos: [0, 90, 180, 270], camino: true, rot: { fija: 'fija', camino: 'camino del centro' } }, estado: {} },
      coincide: 'Coincide: su centro recorre una circunferencia de radio 2r, el doble de su borde.',
      noCoincide: 'Revisemos con la marca: a mitad de camino ya dio una vuelta entera.',
    },
    mira: {
      pieza: OB,
      datos: { objeto: 'monedas', pos: [{ v: [0] }, { v: [0, 90, 180], paso: 2 }, { v: [0, 90, 180, 270], paso: 3 }], camino: [{ v: false }, { v: true, paso: 1 }],
        rot: { fija: 'fija', camino: [{ t: '' }, { t: 'camino del centro: radio 2r', paso: 1 }] } },
      voz: 'Lo que cuenta es el camino del centro.',
      pasos: [
        { estado: { paso: 0 }, texto: 'En una recta, una vuelta avanza el borde entero.', ecuacion: junto([nv, ' = ', { frac: [dd, ['2π', r]] }]) },
        { estado: { paso: 1 }, texto: 'Alrededor de la fija, el centro recorre una circunferencia de radio 2r.', ecuacion: junto([dd, ' = 2π · 2', r]) },
        { estado: { paso: 2 }, texto: 'A mitad de camino, la marca ya giró una vuelta entera.', ecuacion: junto(['a mitad: ', nv, ' = 1']) },
        { estado: { paso: 3 }, texto: 'Al volver, el camino del centro entre el borde: dos vueltas.', ecuacion: junto([nv, ' = ', { frac: [['2π · 2', r], ['2π', r]] }, ' = ', dF('2')]) },
        { estado: { paso: 3 }, texto: 'Por dentro de un aro, el radio del camino sería la resta.', ecuacion: junto(['por fuera: suma de radios', SEP, 'por dentro: resta']) },
      ],
    },
    regla: {
      texto: 'Sin deslizar, la rueda da una vuelta cada vez que su centro avanza su borde, 2πr. Si gira un ángulo θ, en radianes, su centro avanza θ · r.',
      ecuacion: [junto([nv, ' = ', { frac: [dd, ['2π', r]] }]), SEP, junto([dd, ' = ', th, ' · ', r]), SEP, junto([th, ' = 2π', nv])],
      condicion: 'no desliza. Por fuera de una rueda fija, el camino del centro tiene radio suma de los radios; por dentro, resta.',
      voz: 'Sigue al centro, no al borde que toca.',
    },
    // Así se resuelve: las vueltas en una recta. «Ahora tú» pide lo que avanza o el radio, la rueda alrededor de otra y
    // dos ruedas de radios distintos.
    resuelve: {
      pieza: OB,
      generar(sem) {
        const rr = azar(sem + 900), rv = rr.uno([0.2, 0.25, 0.3, 0.4, 0.5]), n0 = rr.uno([5, 8, 10, 12, 15, 20, 25]), dT = `${f(2 * rv * n0)}π m`;
        const cosa = rr.uno(['la rueda de un triciclo', 'la rueda de una carretilla', 'la llanta de una bicicleta']);
        return {
          enunciado: [`${cap(cosa)} tiene `, dO(`${f(rv)} m`), ' de radio y avanza ', dI(dT), ' sin deslizar. ¿Cuántas vueltas da?'],
          datos: [D4.vueltas],
          dibujo: { datos: ruedaD(rv, 1, { r: `r = ${f(rv)} m`, d: '2π · r en 1 vuelta' }, { k: undefined }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden el número de vueltas ', nv, '.'] },
            { tipo: 'datos', texto: ['El radio es ', r, ` = ${f(rv)} m y lo que avanza el centro, `, dd, ` = ${dT}.`] },
            { tipo: 'regla', texto: 'Sin deslizar, cada vuelta avanza el largo del borde, 2πr. Las vueltas: cuántos bordes caben en el camino.', ecuacion: junto([nv, ' = ', { frac: [dd, ['2π', r]] }]) },
            { tipo: 'cuentas', texto: `Una vuelta avanza 2π · ${f(rv)} = ${f(2 * rv)}π m.`, ecuacion: junto([nv, ' = ', { frac: [dI(`${f(2 * rv * n0)}π`), `${f(2 * rv)}π`] }, ' = ', dF(`${n0}`)]) },
            { tipo: 'sentido', texto: `Comprueba: ${n0} vueltas de ${f(2 * rv)}π m dan ${dT}, lo que avanzó. Las π se cancelan.` },
          ],
          respuesta: [nv, ' = ', dF(`${n0} vueltas`)],
        };
      },
    },
    ahoraTu: {
      pieza: OB,
      voz: 'Sigue al centro, no al borde que toca.',
      generar(sem) { return conCuatro([casoAvance, casoRodea, casoTractor][sem % 3], azar(sem + 41)); },
    },
  };

  // ====================================================================================================================
  // Idea 5: ruedas unidas por faja, cadena, engranaje o eje
  // ====================================================================================================================
  // Objeto de la primera pantalla: la transmisión de una bicicleta: el plato de los pedales (rueda 1), la cadena y el piñón
  // (rueda 2). En la predicción aparece la rueda de atrás (rueda 3), en el mismo eje que el piñón.
  // Cambia: las vueltas de los pedales, n₁, y el piñón, r₂. · Permanece: el plato de 10 cm. · Progresa: el rayo naranja
  // de cada rueda, que gira. · Se reserva: el eje común (la predicción: el juego solo tiene cadena). · Debe verse: la
  // cadena corre el mismo largo en las dos ruedas, y la chica gira más.
  // Errores (hipótesis): POL-FAJA-EJE reparte por radios en un eje común; POL-PROPORCIONAL multiplica por la razón de radios
  // en un eje común; POL-PEDAL copia las vueltas de los pedales; POL-IGUAL da las mismas vueltas con faja o engranaje;
  // POL-INVERSA usa la razón de radios al revés; POL-SENTIDO se equivoca de sentido; POL-SIN-FAJA salta una unión;
  // POL-SOGA-RUEDA enrolla la soga en la rueda equivocada; VUEL-DIAMETRO como en la idea 4.
  const bici = (n1v, r2v, rot, extra = {}) => Object.assign({ objeto: 'bici', r1: 10, r2: r2v, n1: n1v, rot }, extra);
  const D5 = {
    faja: ['Faja, cadena o engranaje: ', th1, ' · ', r1, ' = ', th2, ' · ', r2, ', y también ', n1, ' · ', r1, ' = ', n2, ' · ', r2, '.'],
    eje: ['Eje común: las ruedas giran el mismo ángulo, ', th1, ' = ', th2, '.'],
    sentido: 'Con cadena o faja, las dos ruedas giran en el mismo sentido; con engranajes, en sentidos contrarios.',
    arco: D1.arco,
    borde: D4.borde,
    vuelta: ['1 vuelta = ', dH('360°'), ' = ', dH('2π rad'), '.'],
    dientes: 'En engranajes, pasan los mismos dientes: vueltas por dientes es igual en los dos.',
  };
  // Ejemplos de la idea 5. Cuentas rehechas aparte (cuentas.js): 1·10/4; 20·6/15; 90° en el eje común; 60·12/4;
  // 5·2π·8 y 80π/(2π·20); 240·9/6; 1·10/5 y el eje; 6π/4 y ·12; 3·2π·5; 4·30/12; 120·6/4 con dos cambios de sentido;
  // 2·30/60 y 1·2π·10; 1·10/4 y 2,5·2π·0,3; 50π/10 y ·25, y cada alternativa equivocada.
  const ALT5 = {
    dientes: ['1,6 vueltas', '4 vueltas', '120 vueltas', '10 vueltas'],
    fila: ['180°, horario', '180°, antihorario', '240°, horario', '80°, horario', '120°, horario'],
    balde: ['40π cm', '120π cm', '20π cm', '10π cm', '80π cm'],
    avanza: ['0,6π m', '0,24π m', '3π m', '0,75π m', '1,5π m'],
    tambor: ['50π cm', '20π cm', '5π cm', '250π cm', '125π cm'],
  };
  const EJEMPLOS_FAJA = [
    { nivel: 1, titulo: 'La cadena: el mismo arco', figura: fig(bici(0, 4, { r1: 'r₁ = 10 cm', r2: 'r₂ = 4 cm', n1: 'n₁ = 1', n2: 'n₂ = ?' })),
      enunciado: ['Una bicicleta tiene un plato de ', r1, ' = 10 cm y un piñón de ', r2, ' = 4 cm, unidos por la cadena. Si los pedales dan ', dF('1 vuelta'), ', ¿cuántas da el piñón?'],
      datos: [D5.faja],
      solucion: [{ texto: 'La cadena corre lo mismo en las dos ruedas:', ecuacion: junto(['1 · ', dO('10'), ' = ', n2, ' · ', dO('4'), FL, n2, ' = ', dF('2,5')]) }],
      respuesta: [n2, ' = ', dF('2,5 vueltas')] },
    { nivel: 1, titulo: 'Dos poleas con faja',
      enunciado: ['Una faja une una polea de ', r1, ' = 6 cm con otra de ', r2, ' = 15 cm. Si la chica da ', dF('20 vueltas'), ', ¿cuántas da la grande?'],
      datos: [D5.faja],
      solucion: [{ texto: 'Los bordes recorren lo mismo:', ecuacion: junto(['20 · ', dO('6'), ' = ', n2, ' · ', dO('15'), FL, n2, ' = ', dF('8')]) }],
      respuesta: [n2, ' = ', dF('8 vueltas')] },
    { nivel: 1, titulo: 'En un mismo eje',
      enunciado: ['Dos ruedas de 5 cm y 20 cm de radio están soldadas en un eje común. Si la chica gira ', dH('90°'), ', ¿qué parte de una vuelta da la grande?'],
      datos: [D5.eje, D5.vuelta],
      solucion: [{ texto: 'En un eje común giran juntas: la grande también gira 90°, aunque su borde recorra más.', ecuacion: junto([{ frac: ['90°', '360°'] }, ' = ', dF('1/4')]) }],
      respuesta: [n2, ' = ', dF('1/4 de vuelta')] },
    { nivel: 1, titulo: 'Engranajes al revés', figura: fig({ objeto: 'engranajes', r1: 3, r2: 2, g1: 0, rot: {} }),
      enunciado: 'Dos engranajes se tocan. Si el primero gira en sentido horario, ¿en qué sentido gira el segundo?',
      datos: [D5.sentido],
      solucion: [{ texto: 'Los dientes del primero empujan a los del segundo hacia el lado contrario: gira en sentido antihorario.' }],
      respuesta: ['Antihorario'] },
    { nivel: 1, titulo: 'El ángulo del piñón',
      enunciado: ['Un plato de ', r1, ' = 12 cm gira ', dH('60°'), ' y, con la cadena, mueve un piñón de ', r2, ' = 4 cm. ¿Cuánto gira el piñón?'],
      datos: [D5.faja],
      solucion: [{ texto: 'El arco del borde es el mismo:', ecuacion: junto([dH('60°'), ' · ', dO('12'), ' = ', th2, ' · ', dO('4'), FL, th2, ' = ', dH('180°')]) }],
      respuesta: [th2, ' = ', dH('180°')] },
    { nivel: 2, titulo: 'Cuánto corre la faja',
      enunciado: ['Una polea de ', r1, ' = 8 cm da ', dF('5 vueltas'), ' y mueve, con una faja, a otra de ', r2, ' = 20 cm. ¿Cuánto corre la faja y cuántas vueltas da la segunda?'],
      datos: [D4.borde, D5.faja],
      solucion: [
        { texto: 'La faja corre lo que recorre el borde de la primera:', ecuacion: junto([s, ' = 5 · 2π · ', dO('8'), ' = ', dI('80π cm')]) },
        { texto: 'Ese mismo largo, en el borde de la segunda:', ecuacion: junto([n2, ' = ', { frac: [dI('80π'), ['2π · ', dO('20')]] }, ' = ', dF('2')]) },
      ],
      respuesta: [s, ' = ', dI('80π cm'), '; ', n2, ' = ', dF('2 vueltas')] },
    { nivel: 2, titulo: 'De grados a vueltas',
      enunciado: ['Una rueda de ', r1, ' = 9 cm gira ', dH('240°'), ' y, con una faja, mueve otra de ', r2, ' = 6 cm. ¿Cuántas vueltas da la segunda?'],
      datos: [D5.faja, D5.vuelta],
      solucion: [
        { texto: 'El ángulo de la segunda:', ecuacion: junto([dH('240°'), ' · ', dO('9'), ' = ', th2, ' · ', dO('6'), FL, th2, ' = ', dH('360°')]) },
        { texto: '360° es una vuelta.' },
      ],
      respuesta: [n2, ' = ', dF('1 vuelta')] },
    { nivel: 2, titulo: 'Faja y después eje',
      enunciado: ['La rueda 1 (', r1, ' = 10 cm) mueve con una faja a la rueda 2 (', r2, ' = 5 cm); la rueda 3 va en el eje de la 2. Si la 1 da ', dF('una vuelta'), ', ¿cuántas da la 3?'],
      datos: [D5.faja, D5.eje],
      solucion: [
        { texto: 'Entre 1 y 2 hay faja:', ecuacion: junto(['1 · ', dO('10'), ' = ', n2, ' · ', dO('5'), FL, n2, ' = 2']) },
        { texto: 'La 3 comparte eje con la 2: da las mismas vueltas.', ecuacion: junto([n3, ' = ', dF('2')]) },
      ],
      respuesta: [n3, ' = ', dF('2 vueltas')] },
    { nivel: 2, titulo: 'El arco del borde grande',
      enunciado: 'Dos ruedas de 4 cm y 12 cm de radio están en un eje común. Un punto del borde de la chica recorre 6π cm. ¿Cuánto recorre un punto del borde de la grande?',
      datos: [D5.eje, D1.arco],
      solucion: [
        { texto: 'El ángulo de la chica:', ecuacion: junto([th, ' = ', { frac: [dI('6π'), dO('4')] }, ' = ', dH('3π/2 rad')]) },
        { texto: 'La grande gira lo mismo:', ecuacion: junto([s, ' = ', dH('3π/2'), ' · ', dO('12'), ' = ', dI('18π cm')]) },
      ],
      respuesta: [s, ' = ', dI('18π cm')] },
    { nivel: 2, titulo: 'La soga que se enrolla',
      enunciado: ['El tambor de un pozo, de 5 cm de radio, enrolla la soga de un balde. Si da ', dF('3 vueltas'), ', ¿cuánto sube el balde?'],
      datos: [D4.borde],
      solucion: [
        { texto: 'En cada vuelta se enrolla el borde del tambor:', ecuacion: junto([s, ' = 3 · 2π · ', dO('5'), ' = ', dI('30π cm'), ' ≈ ', dI('94,2 cm')]) },
      ],
      respuesta: [s, ' = ', dI('30π cm'), ' ≈ ', dI('94,2 cm')] },
    // Nivel 3, tipo examen. Letras de las correctas: D, A, C, E, E.
    { nivel: 3, titulo: 'Dientes que pasan',
      enunciado: ['Un engranaje de 30 dientes da ', dF('4 vueltas'), ' y mueve a otro de 12 dientes. ¿Cuántas vueltas da el segundo?'],
      alternativas: ALT5.dientes,
      datos: [D5.dientes],
      solucion: [
        { texto: 'Pasan los mismos dientes por el punto donde se tocan:', ecuacion: junto(['4 · 30 = ', n2, ' · 12', FL, n2, ' = ', dF('10')]) },
        { texto: ['La ', letra(ALT5.dientes, '1,6 vueltas'), ' usa la razón al revés; la ', letra(ALT5.dientes, '4 vueltas'), ' copia las del primero; la ', letra(ALT5.dientes, '120 vueltas'), ' olvida dividir entre 12.'] },
      ],
      respuesta: [letra(ALT5.dientes, '10 vueltas'), ', ', dF('10 vueltas')] },
    { nivel: 3, titulo: 'Tres engranajes en fila',
      enunciado: ['Tres engranajes en fila tienen radios ', r1, ' = 6 cm, ', r2, ' = 3 cm y ', r3, ' = 4 cm. Si el primero gira ', dH('120°'), ' en sentido horario, ¿cuánto gira el tercero, y en qué sentido?'],
      alternativas: ALT5.fila,
      datos: [D5.faja, D5.sentido],
      solucion: [
        { texto: 'Todos los bordes recorren el mismo arco, así que el del medio no cambia la cuenta:', ecuacion: junto([dH('120°'), ' · ', dO('6'), ' = ', sub(th, '3'), ' · ', dO('4'), FL, sub(th, '3'), ' = ', dH('180°')]) },
        { texto: 'El sentido se invierte dos veces: horario, antihorario y otra vez horario.' },
        { texto: ['La ', letra(ALT5.fila, '180°, antihorario'), ' invierte una sola vez; la ', letra(ALT5.fila, '240°, horario'), ' da el giro del segundo, que va antihorario; la ', letra(ALT5.fila, '80°, horario'), ' usa la razón al revés; la ', letra(ALT5.fila, '120°, horario'), ' copia el ángulo.'] },
      ],
      respuesta: [letra(ALT5.fila, '180°, horario'), ', ', dH('180°'), ', horario'] },
    { nivel: 3, titulo: 'El balde del pozo',
      enunciado: ['Una manivela gira una rueda de 30 cm que, con una faja, mueve otra de 60 cm; en su eje, un tambor de 10 cm enrolla la soga de un balde. Con ', dF('2 vueltas'), ' de la manivela, ¿cuánto sube?'],
      alternativas: ALT5.balde,
      datos: [D5.faja, D5.eje, D4.borde],
      solucion: [
        { texto: 'La faja, entre las ruedas de 30 y 60 cm:', ecuacion: junto(['2 · ', dO('30'), ' = ', n2, ' · ', dO('60'), FL, n2, ' = 1']) },
        { texto: 'El tambor da 1 vuelta, como su rueda, y enrolla su borde:', ecuacion: junto([s, ' = 1 · 2π · ', dO('10'), ' = ', dI('20π cm')]) },
        { texto: ['La ', letra(ALT5.balde, '40π cm'), ' salta la faja; la ', letra(ALT5.balde, '120π cm'), ' enrolla en la rueda de 60 cm; la ', letra(ALT5.balde, '10π cm'), ' toma la vuelta por π · r; la ', letra(ALT5.balde, '80π cm'), ' usa la razón al revés.'] },
      ],
      respuesta: [letra(ALT5.balde, '20π cm'), ', ', dI('20π cm')] },
    { nivel: 3, titulo: 'Cuánto avanza la bici', figura: fig(bici(0, 4, { r1: 'r₁ = 10 cm', r2: 'r₂ = 4 cm', r3: 'r₃ = 30 cm' }, { rueda: 'punteada', r3: 30 })),
      enunciado: ['El plato de una bicicleta mide ', r1, ' = 10 cm, su piñón ', r2, ' = 4 cm, y su rueda de atrás, en el eje del piñón, ', r3, ' = 30 cm. Si los pedales dan ', dF('una vuelta'), ', ¿cuánto avanza la bici?'],
      alternativas: ALT5.avanza,
      datos: [D5.faja, D5.eje, D4.vueltas, D1.cm],
      solucion: [
        { texto: 'El piñón, con la cadena, y la rueda, en el mismo eje:', ecuacion: junto(['1 · ', dO('10'), ' = ', n2, ' · ', dO('4'), FL, n2, ' = ', n3, ' = 2,5']) },
        { texto: 'Lo que avanza la rueda, de 30 cm = 0,3 m de radio:', ecuacion: junto([dd, ' = 2,5 · 2π · ', dO('0,3'), ' = ', dI('1,5π m')]) },
        { texto: ['La ', letra(ALT5.avanza, '0,6π m'), ' copia la vuelta de los pedales; la ', letra(ALT5.avanza, '0,24π m'), ' usa la razón al revés; la ', letra(ALT5.avanza, '3π m'), ' usa el diámetro; la ', letra(ALT5.avanza, '0,75π m'), ' toma la vuelta por π · r.'] },
      ],
      respuesta: [letra(ALT5.avanza, '1,5π m'), ', ', dI('1,5π m')] },
    { nivel: 3, titulo: 'Dos poleas soldadas',
      enunciado: 'Dos poleas de 10 cm y 25 cm de radio están soldadas en un eje común, y cada una enrolla una cuerda. Si la chica enrolla 50π cm de cuerda, ¿cuánto enrolla la grande?',
      alternativas: ALT5.tambor,
      datos: [D5.eje, D1.arco],
      solucion: [
        { texto: 'El ángulo, con la chica, y el mismo en la grande:', ecuacion: [junto([th, ' = ', { frac: [dI('50π'), dO('10')] }, ' = ', dH('5π rad')]), SEP, junto([s, ' = ', dH('5π'), ' · ', dO('25'), ' = ', dI('125π cm')])] },
        { texto: ['La ', letra(ALT5.tambor, '50π cm'), ' iguala los arcos, como con faja; la ', letra(ALT5.tambor, '20π cm'), ' además usa la razón al revés; la ', letra(ALT5.tambor, '5π cm'), ' da el ángulo; la ', letra(ALT5.tambor, '250π cm'), ' usa el diámetro de la grande.'] },
      ],
      respuesta: [letra(ALT5.tambor, '125π cm'), ', ', dI('125π cm')] },
  ];

  // «Ahora tú» de la idea 5. Tipo 0: dos engranajes que se tocan: el ángulo del segundo y su sentido.
  function casoEngranajes(rr) {
    let a, b, g;
    do { a = rr.uno([2, 3, 4, 5, 6, 8, 10]); b = rr.uno([2, 3, 4, 5, 6, 8, 10]); g = rr.uno([30, 45, 60, 90, 120, 180, 240]); } while (a === b || !Number.isInteger(g * a / b) || g * a / b > 720);
    const sg = rr.uno(['horario', 'antihorario']), otro = sg === 'horario' ? 'antihorario' : 'horario', g2 = g * a / b;
    const t = (x, sn) => `${f(x)}°, ${sn}`;
    return {
      pregunta: ['Dos engranajes se tocan: el primero tiene ', r1, ` = ${a} cm y el segundo, `, r2, ` = ${b} cm. Si el primero gira `, dH(`${g}°`), ` en sentido ${sg}, ¿cuánto gira el segundo?`],
      datos: [D5.faja, D5.sentido],
      opciones: [
        { id: 'c', texto: t(g2, otro), correcta: true },
        { id: 'sentido', texto: t(g2, sg), error: 'POL-SENTIDO', siFuera: `${f(g2)}° está bien; pero los engranajes que se tocan giran en sentidos contrarios.` },
        { id: 'inversa', texto: t(g * b / a, otro), error: 'POL-INVERSA', siFuera: `El sentido está bien; pero el ${a < b ? 'segundo es más grande y gira menos' : 'segundo es más chico y gira más'}.` },
        { id: 'igual', texto: t(g, otro), error: 'POL-IGUAL', siFuera: 'El sentido está bien; pero el mismo ángulo sería en un eje común. Aquí se igualan los arcos.' },
      ],
      solucion: { texto: 'Los bordes recorren el mismo arco, y el sentido se invierte.', ecuacion: junto([dH(`${g}°`), ' · ', dO(`${a}`), ' = ', th2, ' · ', dO(`${b}`), FL, th2, ' = ', dH(`${f(g2)}°`)]) },
    };
  }
  // Tipo 1: tres ruedas: la 1 mueve a la 2 con una faja; la 3 va en el eje de la 2.
  function casoTresRuedas(rr) {
    let a, b, c, m;
    do { a = rr.uno([6, 8, 10, 12, 15, 20]); b = rr.uno([3, 4, 5, 6, 8, 10]); c = rr.uno([12, 15, 18, 20, 24, 30]); m = rr.uno([1, 2, 3, 4, 5]); } while (a === b || !Number.isInteger(2 * m * a / b) || b === c);
    const nb = m * a / b;
    return {
      pregunta: ['La rueda 1 (', r1, ` = ${a} cm) mueve con una faja a la rueda 2 (`, r2, ` = ${b} cm); la rueda 3 (`, r3, ` = ${c} cm) va en el eje de la 2. Si la 1 da ${vueltasT(m)}, ¿cuántas da la 3?`],
      datos: [D5.faja, D5.eje],
      opciones: opciones(nb, [
        { id: 'igual', valor: m, error: 'POL-IGUAL', siFuera: 'Las mismas vueltas valen entre 2 y 3, que comparten eje; entre 1 y 2 hay faja.' },
        { id: 'faja3', valor: m * a / c, error: 'POL-FAJA-EJE', siFuera: 'Repartir por radios vale entre 1 y 2. La 3 comparte eje con la 2: sus mismas vueltas.' },
        { id: 'inversa', valor: m * b / a, error: 'POL-INVERSA', siFuera: `Usar la razón de radios entre 1 y 2 está bien; pero ${b < a ? 'la 2 es más chica y gira más' : 'la 2 es más grande y gira menos'}.` },
        { id: 'proporcional', valor: nb * c / b, error: 'POL-PROPORCIONAL', siFuera: 'Las vueltas de la 2 están bien; pero en un eje común no se reparten por radios.' },
      ], v => vueltasT(v)),
      solucion: { texto: 'Entre 1 y 2, el mismo arco; la 3 gira con la 2.', ecuacion: junto([`${m} · `, dO(`${a}`), ' = ', n2, ' · ', dO(`${b}`), FL, n2, ' = ', n3, ' = ', dF(`${f(nb)}`)]) },
    };
  }
  // Tipo 2 (examen): una manivela mueve con una faja a una rueda cuyo eje tiene un tambor que enrolla la soga de un balde.
  function casoBalde(rr) {
    let a, b, c, m;
    do { a = rr.uno([10, 15, 20, 30]); b = rr.uno([20, 30, 40, 60]); c = rr.uno([4, 5, 6, 8, 10]); m = rr.uno([1, 2, 3, 4, 6]); } while (a === b || !Number.isInteger(2 * m * a / b) || c >= b || (a === 30 && b === 60 && c === 10 && m === 2));   // el ejemplo del balde
    const nb = m * a / b, sv = 2 * nb * c;
    return {
      pregunta: `Una manivela gira una rueda de ${a} cm que, con una faja, mueve otra de ${b} cm; en su eje, un tambor de ${c} cm enrolla la soga de un balde. Con ${vueltasT(m)} de la manivela, ¿cuánto sube?`,
      datos: [D5.faja, D5.eje, D4.borde],
      opciones: opciones(`${f(sv)}π cm`, [
        { id: 'sinfaja', valor: `${f(2 * m * c)}π cm`, error: 'POL-SIN-FAJA', siFuera: 'Enrollar el borde del tambor está bien; pero entre la manivela y el tambor hay una faja.' },
        { id: 'rueda', valor: `${f(2 * nb * b)}π cm`, error: 'POL-SOGA-RUEDA', siFuera: `Las vueltas de la segunda rueda están bien; pero la soga se enrolla en el tambor de ${c} cm.` },
        { id: 'medio', valor: `${f(nb * c)}π cm`, error: 'VUEL-DIAMETRO', siFuera: 'Las vueltas del tambor están bien; pero en cada una enrolla 2π · r, no π · r.' },
        { id: 'inversa', valor: `${f(2 * m * b / a * c)}π cm`, error: 'POL-INVERSA', siFuera: `Usar la faja es la idea; pero la rueda de ${b} cm es ${b > a ? 'más grande y gira menos' : 'más chica y gira más'}.` },
      ], v => v),
      solucion: { texto: `Con la faja, la segunda rueda y su tambor dan ${f(nb)} ${nb === 1 ? 'vuelta' : 'vueltas'}. La soga sube su borde por vuelta.`, ecuacion: junto([s, ` = ${f(nb)} · 2π · `, dO(`${c}`), ' = ', dI(`${f(sv)}π cm`)]) },
    };
  }

  const fajaIdea = {
    id: 'faja-y-eje',
    titulo: 'Ruedas unidas: faja y eje',
    pregunta: '¿Cuánto gira una rueda que otra mueve con una cadena o un eje?',
    temas: ['Ruedas, poleas y engranajes'],
    pieza: OB,
    aprendizaje: 'Con faja, cadena o engranaje, los bordes recorren el mismo arco: θ₁ · r₁ = θ₂ · r₂. En un eje común, las ruedas giran el mismo ángulo.',
    actividad: 'Pedalear una bicicleta y cambiar el piñón para ver cuánto gira.',
    lee: {
      tarjetas: [
        { titulo: 'La transmisión de la bici', texto: 'Los pedales de una bicicleta mueven el plato, una rueda con dientes. La cadena lo une con el piñón, otra rueda más chica que va en la rueda de atrás.',
          pieza: OB, dibujo: { datos: bici(0, 5, {}), estado: {} } },
        { titulo: 'Tres maneras de unir ruedas', texto: 'Dos ruedas se unen con una faja o una cadena que abraza a las dos, con engranajes que se tocan diente con diente, o fijas en un eje común, una pegada a la otra.',
          pieza: OB, dibujo: { datos: { objeto: 'engranajes', r1: 3, r2: 2, g1: 60, rot: {} }, estado: {} } },
        { titulo: 'Las letras', texto: ['La rueda 1 es la que mueve: su radio es ', r1, ', gira ', th1, ' y da ', n1, ' vueltas. La rueda 2 es la que se mueve: ', r2, ', ', th2, ' y ', n2, '.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a pedalear y a cambiar el piñón. Mira cuánto corre la cadena, ', s, ', y cuántas vueltas da cada rueda.'] },
      ],
    },
    ejemplos: EJEMPLOS_FAJA,
    juega: {
      pieza: OB,
      consigna: ['La cadena une el plato de los pedales, de radio ', r1, ' = 10 cm, con el piñón de la rueda de atrás, de radio ', r2, '.'],
      mision: {
        texto: 'Elige el piñón con que una vuelta de los pedales dé 2 vueltas del piñón.',
        logrado: val => val.n1 === 1 && val.r2 === 5,
        bien: 'Listo: la cadena corre 20π cm, y el piñón de 5 cm da dos vueltas.',
      },
      voz: '¿Qué rueda gira más: la grande o la chica?',
      leyenda: [
        { s: r1, t: 'el radio del plato' },
        { s: r2, t: 'el radio del piñón' },
        { s: n1, t: 'las vueltas de los pedales y el plato' },
        { s: n2, t: 'las vueltas del piñón' },
        { s: s, t: 'lo que corre la cadena' },
      ],
      controles: [
        { id: 'n1', etiqueta: 'n₁, vueltas de los pedales', color: 'c-f', min: 0.5, max: 2, paso: 0.5, inicio: 0.5, decimales: 1 },
        { id: 'r2', etiqueta: 'Piñón', opciones: [{ valor: 4, texto: '4 cm' }, { valor: 5, texto: '5 cm' }, { valor: 8, texto: '8 cm' }, { valor: 10, texto: '10 cm' }], inicio: 4 },
      ],
      // n₂ con tres decimales: 0,625 y 1,875 son exactos (antes «= 0,63»).
      dibujo: val => ({ datos: bici(val.n1, val.r2, { r1: 'r₁ = 10 cm', r2: `r₂ = ${val.r2} cm`, n1: `n₁ = ${f(val.n1)}`, n2: `n₂ = ${f(val.n1 * 10 / val.r2, 3)}` }), estado: {} }),
      lectura: val => jN(['la cadena corre ', s, ` = ${f(20 * val.n1)}π cm: `, n2, ` = ${f(val.n1 * 10 / val.r2, 3)}`]),
      minimo: 3,
    },
    predice: {
      pregunta: 'El piñón de 5 cm dio 2 vueltas. La rueda de atrás, de 30 cm de radio, va en el mismo eje que el piñón. ¿Cuántas vueltas da la rueda?',
      datos: ['Piñón: 5 cm de radio. Rueda de atrás: 30 cm de radio.'],
      // Sin «van fijos a la misma barra»: casi decía que giran juntos (lector en frío B).
      voz: 'Mira qué une al piñón con la rueda de atrás.',
      opciones: [
        { id: 'c', texto: '2 vueltas', correcta: true },
        { id: 'faja', texto: '1/3 de vuelta', error: 'POL-FAJA-EJE', siFuera: 'Repartir según los radios vale con una cadena; en un mismo eje, giran juntas.' },
        { id: 'proporcional', texto: '12 vueltas', error: 'POL-PROPORCIONAL', siFuera: 'El borde grande recorre más, es cierto; pero el ángulo y las vueltas son los mismos.' },
        { id: 'pedal', texto: '1 vuelta', error: 'POL-PEDAL', siFuera: 'Una vuelta dan los pedales; la rueda va con el piñón, no con los pedales.' },
      ],
      dibujo: { datos: bici(1, 5, { r2: 'r₂ = 5 cm', r3: 'r₃ = 30 cm', n2: 'n₂ = 2', n3: 'n₃ = ?' }, { rueda: 'punteada', r3: 30 }), estado: {} },
      revelar: { datos: bici(1, 5, { r2: 'r₂ = 5 cm', r3: 'r₃ = 30 cm', n2: 'n₂ = 2', n3: 'n₃ = 2' }, { rueda: true, r3: 30 }), estado: {} },
      coincide: 'Coincide: en un eje común las ruedas giran juntas, el mismo ángulo y las mismas vueltas.',
      noCoincide: 'Revisemos: la rueda y el piñón están fijos a la misma barra; giran juntos.',
    },
    mira: {
      pieza: OB,
      datos: bici(1, 5, { r1: 'r₁ = 10 cm', r2: 'r₂ = 5 cm', r3: 'r₃ = 30 cm', n1: 'n₁ = 1', n2: [{ t: '' }, { t: 'n₂ = 2', paso: 1 }], n3: [{ t: '' }, { t: 'n₃ = 2', paso: 2 }] }, { rueda: [{ v: 'punteada' }, { v: true, paso: 2 }], r3: 30 }),
      voz: 'Cadena: mismo arco. Eje: mismo ángulo.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Una vuelta de los pedales: la cadena corre el borde del plato.', ecuacion: junto([s, ' = 1 · 2π · ', dO('10'), ' = ', dI('20π cm')]) },
        { estado: { paso: 1 }, texto: 'Ese mismo largo pasa por el piñón, que es más chico.', ecuacion: junto([n2, ' = ', { frac: [dI('20π'), ['2π · ', dO('5')]] }, ' = ', dF('2')]) },
        { estado: { paso: 2 }, texto: 'La rueda de atrás va fija al eje del piñón: gira con él.', ecuacion: junto([n3, ' = ', n2, ' = ', dF('2')]) },
        { estado: { paso: 2 }, texto: 'Mismo ángulo, distinto borde: el de la rueda recorre más.', ecuacion: junto(['borde de la rueda: 2 · 2π · ', dO('30'), ' = ', dI('120π cm')]) },
        { estado: { paso: 2 }, texto: 'Con engranajes que se tocan pasa lo de la cadena, pero giran al revés.', ecuacion: junto([th1, ' · ', r1, ' = ', th2, ' · ', r2]) },
      ],
    },
    regla: {
      texto: 'Con faja, cadena o engranaje, los bordes recorren el mismo arco: la rueda chica gira más. En un eje común, giran el mismo ángulo. El engranaje invierte el sentido.',
      ecuacion: [junto([th1, ' · ', r1, ' = ', th2, ' · ', r2]), SEP, junto([n1, ' · ', r1, ' = ', n2, ' · ', r2]), SEP, junto(['eje común: ', th1, ' = ', th2])],
      condicion: 'los bordes no resbalan. Cadena o faja: el mismo sentido; engranajes que se tocan: sentidos contrarios.',
      voz: 'Cadena: mismo arco. Eje: mismo ángulo.',
    },
    // Así se resuelve: dos poleas con una faja. «Ahora tú» pide engranajes con su sentido, tres ruedas (faja y eje) y el
    // balde del pozo.
    resuelve: {
      pieza: OB,
      generar(sem) {
        let a, b, m;
        const rr = azar(sem + 900);
        do { a = rr.uno([6, 8, 10, 12, 15]); b = rr.uno([20, 24, 30, 40]); m = rr.uno([10, 20, 30, 40, 50, 60]); } while (!Number.isInteger(2 * m * a / b));
        const nb = m * a / b;
        return {
          enunciado: ['La polea de un motor, de ', r1, ` = ${a} cm, da ${m} vueltas y mueve con una faja a otra polea de `, r2, ` = ${b} cm. ¿Cuántas vueltas da la segunda?`],
          datos: [D5.faja],
          pasos: [
            { tipo: 'pide', texto: ['Piden las vueltas ', n2, ' de la segunda polea.'] },
            { tipo: 'datos', texto: ['La primera tiene ', r1, ` = ${a} cm y da `, n1, ` = ${m} vueltas; la segunda, `, r2, ` = ${b} cm.`] },
            { tipo: 'regla', texto: 'La faja no resbala: los dos bordes recorren el mismo largo. Vueltas por radio es igual en las dos.', ecuacion: junto([n1, ' · ', r1, ' = ', n2, ' · ', r2]) },
            { tipo: 'cuentas', texto: 'Se reemplaza y se despeja:', ecuacion: junto([`${m} · `, dO(`${a}`), ' = ', n2, ' · ', dO(`${b}`), FL, n2, ' = ', { frac: [`${m * a}`, `${b}`] }, ' = ', dF(f(nb))]) },
            { tipo: 'sentido', texto: `Tiene sentido: la segunda es más grande, así que da menos vueltas: ${f(nb)} < ${m}.` },
          ],
          respuesta: [n2, ' = ', dF(`${f(nb)} vueltas`)],
        };
      },
    },
    ahoraTu: {
      pieza: OB,
      voz: 'Cadena, faja o engranaje: mismo arco. Eje: mismo ángulo.',
      generar(sem) { return conCuatro([casoEngranajes, casoTresRuedas, casoBalde][sem % 3], azar(sem + 53)); },
    },
  };


  // ====================================================================================================================
  // Laboratorio: una mesa por idea, sin preguntas. Los `id` de las tres mesas viejas y de sus controles se conservan (la
  // colección guarda { mesa, valores }; docs/teoria.md §4b); sus rangos cambian.
  // ====================================================================================================================
  const casi = (a, b) => Math.abs(a - b) < 1e-9;
  const areaAb = v => v.g * RAD * v.r * v.r / 2;
  // Una rueda de radio r rueda por fuera (o por dentro) de una fija de radio R; su centro recorre p grados alrededor. Sin
  // deslizar, la marca gira p·(R + r)/r por fuera y −p·(R − r)/r por dentro. Dibujo en trig-plano (centro de la fija en
  // el origen): la fija en tinta, el camino del centro en turquesa, la marca de la que rueda en naranja.
  const caminoR = v => (v.lado === 'fuera' ? v.R + v.r : v.R - v.r);
  const vueltasRodea = v => v.p / 360 * caminoR(v) / v.r;
  function rodeaFig(v) {
    const rc = caminoR(v), cx = rc * Math.cos(v.p * RAD), cy = rc * Math.sin(v.p * RAD), marca = (v.lado === 'fuera' ? 1 : -1) * v.p * rc / v.r;
    return {
      ventana: { x: [-5.3, 5.3], y: [-5.3, 5.3] }, ejes: false,
      circulos: [{ r: v.R }, { r: rc, color: 'i', discontinua: true }, { cx: rc, cy: 0, r: v.r, discontinua: true }, { cx, cy, r: v.r }],
      arcos: v.p ? [{ de: 0, a: v.p, r: rc, espiral: 0, color: 'i' }] : [],
      rayos: [{ cx, cy, ang: marca, largo: v.r, color: 'o', punta: false }],
      puntos: [{ x: cx + v.r * Math.cos(marca * RAD), y: cy + v.r * Math.sin(marca * RAD), color: 'o' }],
      rotulos: [{ x: 0, y: 0, texto: 'fija' }],
      alt: `Rueda de ${f(v.r)} cm que rueda por ${v.lado} de una fija de ${f(v.R)} cm: su centro avanza ${f(v.p)} grados y ella da ${f(vueltasRodea(v))} vueltas`,
    };
  }
  const giroB = v => v.ga * v.ra / v.rb;
  const fajaFig = v => (v.u === 'engranaje'
    ? { objeto: 'engranajes', r1: v.ra, r2: v.rb, g1: -v.ga, rot: { r1: `r₁ = ${v.ra} cm`, r2: `r₂ = ${v.rb} cm`, t1: `${v.ga}°`, t2: `${f(giroB(v))}°` } }
    : { objeto: 'bici', r1: v.ra, r2: v.rb, n1: v.ga / 360, rot: { r1: `r₁ = ${v.ra} cm`, r2: `r₂ = ${v.rb} cm` } });
  const LAB = [
    {
      id: 'arco-columpio', titulo: 'El columpio, libre', pieza: OB,
      consigna: 'Mueve la cadena y cambia su largo. La lectura da el arco del asiento.',
      controles: [
        { id: 't', etiqueta: 'θ', color: 'c-h', min: 0.1, max: 1.3, paso: 0.1, inicio: 0.6, unidad: 'rad', decimales: 1 },
        { id: 'r', etiqueta: 'r', color: 'c-o', min: 1, max: 2.5, paso: 0.25, inicio: 2, unidad: 'm', decimales: 2 },
      ],
      dibujo: val => ({ datos: columpio(val.r, val.t, { r: `r = ${f(val.r)} m`, t: `θ = ${f(val.t)} rad`, s: `s = ${f(val.t * val.r, 3)} m` }), estado: {} }),
      lectura: val => jN([s, ` = ${f(val.t)} · ${f(val.r)} m = ${f(val.t * val.r, 3)} m`]),
      invitaciones: [
        { texto: 'Haz que el arco mida justo lo mismo que la cadena.', logrado: val => casi(val.t, 1), bien: 'Un arco de una cadena: 1 rad, con cualquier cadena.' },
        { texto: 'Logra un arco de 2 m con una cadena que no mida 2 m.', logrado: val => casi(val.t * val.r, 2) && !casi(val.r, 2), bien: 'Con 2,5 m de cadena bastan 0,8 rad: 0,8 · 2,5 = 2.' },
        { texto: 'Guarda dos casos con el mismo arco y cadenas distintas.', logrado: (val, gs) => (gs || []).some(a => casi(a.t * a.r, val.t * val.r) && !casi(a.r, val.r)) },
      ],
    },
    {
      id: 'sector-completo', titulo: 'El abanico, libre', pieza: OB,
      consigna: 'Abre el abanico y cambia el largo de sus varillas. La lectura da su arco y el área del papel.',
      controles: [
        { id: 'g', etiqueta: 'θ', color: 'c-h', min: 15, max: 180, paso: 15, inicio: 60, unidad: '°', decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-o', min: 10, max: 40, paso: 5, inicio: 20, unidad: 'cm', decimales: 0 },
      ],
      dibujo: val => ({ datos: abanico(val.g, { r: `r = ${val.r} cm`, t: `${val.g}°`, s: `s = ${piFrac(val.g * val.r, 180)} cm`, A: `A = ${piFrac(val.g * val.r * val.r, 360)} cm²` }, { r: val.r }), estado: {} }),
      lectura: val => jN([s, ` = ${piFrac(val.g * val.r, 180)} cm; `, A, ` = ${piFrac(val.g * val.r * val.r, 360)} cm²`]),
      invitaciones: [
        { texto: 'Abre media vuelta un abanico de 20 cm.', logrado: val => val.g === 180 && val.r === 20, bien: 'Medio círculo de 20 cm: 200π cm².' },
        { texto: 'Logra un papel de 200π cm² de dos maneras distintas.', logrado: (val, gs) => casi(areaAb(val), 200 * PI) && (gs || []).some(a => casi(areaAb(a), 200 * PI) && (a.g !== val.g || a.r !== val.r)), testigo: [{ g: 180, r: 20 }, { g: 45, r: 40 }], bien: 'Media vuelta con 20 cm, o 1/8 de vuelta con 40 cm.' },
        { texto: 'Guarda dos abanicos del mismo ángulo: uno con cuatro veces el papel del otro.', logrado: (val, gs) => (gs || []).some(a => a.g === val.g && (casi(areaAb(a), 4 * areaAb(val)) || casi(areaAb(val), 4 * areaAb(a)))), bien: 'Cuatro veces el papel: el doble de varilla.' },
      ],
    },
    {
      id: 'limpia-libre', titulo: 'El limpiaparabrisas, libre', pieza: OB,
      consigna: 'Cambia el brazo, el jebe y lo que barre. La lectura da el área que limpia.',
      controles: [
        { id: 'r2', etiqueta: 'r₂', color: 'c-o', min: 40, max: 60, paso: 5, inicio: 50, unidad: 'cm', decimales: 0 },
        { id: 'h', etiqueta: 'h', min: 10, max: 40, paso: 5, inicio: 20, unidad: 'cm', decimales: 0 },
        { id: 'g', etiqueta: 'θ', color: 'c-h', min: 60, max: 150, paso: 15, inicio: 90, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: limpia(val.r2, val.h, { r2: `r₂ = ${val.r2} cm`, h: `h = ${val.h} cm`, t: `${val.g}°`, A: `A = ${piFrac(val.g * (val.r2 ** 2 - (val.r2 - val.h) ** 2), 360)} cm²` }, { g: val.g }), estado: {} }),
      lectura: val => jN([A, ` = ${piFrac(val.g * (val.r2 ** 2 - (val.r2 - val.h) ** 2), 360)} cm²`]),
      invitaciones: [
        { texto: 'Haz que el jebe llegue hasta la mitad del brazo.', logrado: val => val.h * 2 === val.r2 },
        { texto: 'Guarda dos casos con el mismo jebe que limpien áreas distintas.', logrado: (val, gs) => (gs || []).some(a => a.h === val.h && a.g === val.g && a.r2 !== val.r2), bien: 'El mismo jebe más lejos del eje limpia más.' },
        { texto: 'Logra limpiar 375π cm².', logrado: val => casi(val.g * (val.r2 ** 2 - (val.r2 - val.h) ** 2) / 360, 375) },
      ],
    },
    {
      id: 'rodea', titulo: 'Rodar alrededor de otra', pieza: 'trig-plano',
      consigna: 'Una rueda rueda sin deslizar por fuera o por dentro de otra fija. Lleva su centro alrededor y cuenta las vueltas de la marca.',
      controles: [
        { id: 'lado', etiqueta: 'Por', opciones: [{ valor: 'fuera', texto: 'Fuera' }, { valor: 'dentro', texto: 'Dentro' }], inicio: 'fuera' },
        { id: 'R', etiqueta: 'Radio de la fija', min: 1.5, max: 4, paso: 0.5, inicio: 2, unidad: 'cm', decimales: 1 },
        { id: 'r', etiqueta: 'r', color: 'c-o', min: 0.5, max: 1, paso: 0.25, inicio: 1, unidad: 'cm', decimales: 2 },
        { id: 'p', etiqueta: 'Camino del centro', color: 'c-i', min: 0, max: 720, paso: 15, inicio: 180, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: rodeaFig(val), estado: {} }),
      lectura: val => jN([nv, ` = ${f(vueltasRodea(val))}: el centro va a ${f(caminoR(val))} cm del de la fija`]),
      invitaciones: [
        { texto: 'Da una vuelta por fuera y logra justo 3 vueltas de la marca.', logrado: val => val.lado === 'fuera' && val.p === 360 && casi(vueltasRodea(val), 3), bien: 'La fija mide dos radios, pero salen 3 vueltas: el centro va más lejos.' },
        { texto: 'Por dentro, rodea el aro una vez y logra una sola vuelta de la marca.', logrado: val => val.lado === 'dentro' && val.p === 360 && casi(vueltasRodea(val), 1), bien: 'Por dentro se resta: con la fija de dos radios sale una vuelta.' },
        { texto: 'Haz que la marca apunte como al inicio sin que el centro haya vuelto.', logrado: val => val.p > 0 && val.p % 360 !== 0 && vueltasRodea(val) >= 1 && casi(vueltasRodea(val), Math.round(vueltasRodea(val))) },
      ],
    },
    {
      id: 'faja-libre', titulo: 'Cadena o engranaje, libre', pieza: OB,
      consigna: 'Gira la rueda 1 y cambia los radios. La lectura da el giro de la rueda 2 y su sentido.',
      controles: [
        { id: 'u', etiqueta: 'Unión', opciones: [{ valor: 'faja', texto: 'Cadena' }, { valor: 'engranaje', texto: 'Engranaje' }], inicio: 'faja' },
        { id: 'ga', etiqueta: 'θ₁', color: 'c-h', min: 30, max: 360, paso: 30, inicio: 180, unidad: '°', decimales: 0 },
        { id: 'ra', etiqueta: 'r₁', color: 'c-o', min: 4, max: 12, paso: 2, inicio: 6, unidad: 'cm', decimales: 0 },
        { id: 'rb', etiqueta: 'r₂', color: 'c-o', min: 4, max: 12, paso: 2, inicio: 8, unidad: 'cm', decimales: 0 },
      ],
      dibujo: val => ({ datos: fajaFig(val), estado: {} }),
      lectura: val => jN([th2, ` = ${f(giroB(val))}°, ${val.u === 'engranaje' ? 'en sentido contrario' : 'en el mismo sentido'}`]),
      invitaciones: [
        { texto: 'Haz que la rueda 2 dé justo una vuelta.', logrado: val => casi(giroB(val), 360) },
        { texto: 'Logra que la rueda 2 gire el triple que la 1.', logrado: val => val.ra === 3 * val.rb, bien: 'Un radio tres veces más chico: tres veces más giro.' },
        { texto: 'Con engranajes, haz que la rueda 2 gire 180°.', logrado: val => val.u === 'engranaje' && casi(giroB(val), 180) },
      ],
    },
  ];

  // En los ejemplos, un número no se separa de su unidad al partir el renglón («4π / m» y «0,3 / m» en dos renglones: lector
  // en frío B, tarjetas 10 y 15).
  const jNd = x => (typeof x === 'string' ? jN(x) : Array.isArray(x) ? x.map(jNd) : x && typeof x === 'object' && typeof x.t === 'string' ? Object.assign({}, x, { t: jN(x.t) }) : x);
  for (const I of [arco, sectorIdea, trapecio, vueltasIdea, fajaIdea]) for (const e of I.ejemplos) {
    e.enunciado = jNd(e.enunciado);
    for (const p of e.solucion) if (p.texto) p.texto = jNd(p.texto);
  }

  return {
    unidad: 'trigonometria.longitud-de-arco-y-sector',
    version: '0.2.1',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-arco.js', '/nucleo/kit/piezas/trig-plano.js'],
    historia: {
      texto: 'Arquímedes comparó el círculo con un triángulo: la altura es el radio y la base, la circunferencia estirada. Por eso un sector mide medio arco por radio. La fórmula con radianes es moderna, no la escribió él; pero conserva su idea: el radio entra una vez en el arco y dos veces en el área.',
      pregunta: '¿Por qué el radio aparecería una vez en el arco y dos en el área?',
      fuente: { titulo: 'Arquímedes, Medida del círculo, proposición 1; traducción y discusión del seminario de Harvard (2009)', url: 'https://people.math.harvard.edu/archive/archimedes09/pdf/Measurement.of.the.Circle.pdf' },
    },
    // Tabla de letras de la unidad (regla letras-datos del validador; propuesta §5).
    letras: { 'θ': 'el ángulo central (en las fórmulas, en radianes)', r: 'un radio', s: 'la longitud de arco', A: 'el área',
      h: 'el ancho del trapecio circular', n: 'número de vueltas', d: 'lo que avanza el centro de la rueda' },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov): una por idea, ninguna en «Más mesas del tema».
    laboratorioIdeas: { 'arco-columpio': ['arco'], 'sector-completo': ['sector'], 'limpia-libre': ['trapecio-circular'], rodea: ['vueltas-rueda'], 'faja-libre': ['faja-y-eje'] },
    ideas: [arco, sectorIdea, trapecio, vueltasIdea, fajaIdea],
    glosario: [
      { termino: 'longitud de arco', simbolo: 's', medida: 'cm', formas: ['longitud de arco', 'longitudes de arco'],
        simple: 'Lo que mide un pedazo de borde curvo, si lo estiras.',
        def: 'Lo que mide un arco a lo largo, estirado como un hilo: el ángulo central, en radianes, por el radio.',
        ejemplos: ['En una rueda de 10 cm de radio, un ángulo de 2 rad abarca un arco de 20 cm.', 'El borde curvo de una tajada de pizza.', 'Lo que recorre la punta del minutero en un cuarto de hora.'],
        ver: ['ángulo central', 'radián'] },
      { termino: 'ángulo central', formas: ['ángulo central', 'ángulos centrales'],
        simple: 'Un ángulo con la punta en el centro de un círculo.',
        def: 'Ángulo con el vértice en el centro de una circunferencia; sus dos lados son radios.',
        ejemplos: ['El ángulo que abre la cadena de un columpio desde el travesaño.', 'El ángulo de una tajada de torta, en el centro de la torta.', 'El que forman dos rayos de una rueda.'],
        ver: ['vértice', 'longitud de arco'] },
      { termino: 'sector circular', formas: ['sector circular', 'sectores circulares', 'sector', 'sectores'],
        simple: 'Una tajada de círculo, cortada desde el centro.',
        def: 'Parte del círculo encerrada por dos radios y el arco que los une.',
        ejemplos: ['El papel de un abanico abierto.', 'Una tajada de pizza cortada desde el centro.', 'El pasto que riega un aspersor que gira de un lado a otro.'],
        ver: ['ángulo central', 'longitud de arco'] },
      // «perímetro» ya lo define «Áreas y líneas notables» (un término por curso): aquí solo se usa.
      { termino: 'centímetro cuadrado', simbolo: 'cm²', formas: ['centímetro cuadrado', 'centímetros cuadrados'],
        simple: 'Un cuadradito de 1 cm de lado: con él se mide un área.',
        def: 'Unidad de área: lo que cubre un cuadrado de 1 cm de lado. También hay metros cuadrados, m².',
        ejemplos: ['Un rectángulo de 3 cm por 2 cm cubre 6 cm².', 'Una hoja de cuaderno cubre unos 600 cm².', 'Un cuadrado de 1 m de lado cubre 10 000 cm².'],
        ver: ['sector circular'] },
      { termino: 'trapecio circular', formas: ['trapecio circular', 'trapecios circulares'],
        simple: 'Una banda curva entre dos arcos, como la que limpia un limpiaparabrisas.',
        def: 'Banda entre dos arcos del mismo ángulo central y dos tramos de radio.',
        ejemplos: ['La banda que limpia el jebe de un limpiaparabrisas.', 'Una tajada de pizza sin su punta.', 'Media corona: la de un ángulo de media vuelta.'],
        ver: ['sector circular', 'semisuma'] },
      { termino: 'semisuma', formas: ['semisuma', 'semisumas'],
        simple: 'El promedio de dos números: se suman y se divide entre 2.',
        def: 'La mitad de lo que dan dos números sumados: (a + b)/2. Es su promedio.',
        ejemplos: ['La semisuma de 6 y 10 es 8.', 'La semisuma de 2π y 4π es 3π.', 'La semisuma de 15 y 16 es 15,5.'],
        ver: ['trapecio circular'] },
      { termino: 'número de vueltas', simbolo: 'n', formas: ['número de vueltas'],
        simple: 'Cuántas veces gira algo completo sobre sí mismo.',
        def: 'Cuántas veces algo gira completo sobre sí mismo; cada giro de 360° cuenta uno. Puede no ser entero.',
        ejemplos: ['Una rueda que gira 1080° da 3 vueltas.', 'El minutero da 24 vueltas en un día.', 'Una rueda que gira 540° da 1,5 vueltas.'],
        ver: ['rodar sin deslizar'] },
      { termino: 'rodar sin deslizar', formas: ['rodar sin deslizar', 'rueda sin deslizar', 'ruedan sin deslizar', 'rodando sin deslizar'],
        simple: 'Rodar sin patinar: el borde que toca el piso no resbala.',
        def: 'Girar sin resbalar: el borde que se apoya en el piso mide lo que avanza el centro.',
        ejemplos: ['Una bicicleta que avanza por la pista, sin frenar en seco.', 'Una pelota que rueda por el pasto.', 'Una llanta que no patina en el barro.'],
        ver: ['número de vueltas'] },
      { termino: 'faja', formas: ['faja', 'fajas'],
        simple: 'Una correa cerrada que abraza dos ruedas, como la cadena de la bici.',
        def: 'Correa cerrada que abraza dos ruedas: los bordes de las dos avanzan el mismo largo.',
        ejemplos: ['La correa del motor de un carro.', 'La cadena de una bicicleta hace lo mismo que una faja.', 'La faja de una máquina de coser antigua.'],
        ver: ['engranaje', 'eje común'] },
      { termino: 'engranaje', formas: ['engranaje', 'engranajes'],
        simple: 'Una rueda con dientes que empuja a otra al tocarla.',
        def: 'Rueda con dientes que mueve a otra al encajar; las dos giran en sentidos contrarios.',
        ejemplos: ['Las ruedas dentadas de un reloj de cuerda.', 'Los engranajes de una batidora de mano.', 'El plato de la bici es un engranaje, aunque mueve con cadena.'],
        ver: ['faja'] },
      // Sin `simple` y sin decir cuánto gira cada rueda: la predicción de la idea 5 pregunta justo eso.
      { termino: 'eje común', formas: ['eje común', 'mismo eje'],
        def: 'Barra que atraviesa el centro de dos ruedas fijas a ella.',
        ejemplos: ['El piñón y la rueda de atrás de una bicicleta.', 'Las dos ruedas de un carrito, unidas por su barra.', 'Una polea con un tambor pegado, en un pozo.'],
        ver: ['faja'] },
      { termino: 'altura', def: 'Lo que se separa un punto de una base, medido en perpendicular. En una gráfica es la y, con signo.',
        ejemplos: ['En un triángulo, la altura va del vértice al lado de enfrente, derecha.', 'Una tajada fina de un sector es casi un triángulo de altura igual al radio.', 'La altura de una puerta.'] },
      { termino: 'vértice', def: 'Punto donde se juntan los dos lados de un ángulo, o dos lados de una figura.',
        ejemplos: ['El travesaño del columpio es el vértice del ángulo de la cadena.', 'La esquina de una mesa.', 'El centro de una tajada de torta.'] },
    ],
    laboratorio: LAB,
  };
});
