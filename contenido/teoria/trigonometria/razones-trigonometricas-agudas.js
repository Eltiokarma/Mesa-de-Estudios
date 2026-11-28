/*
 * Teoría de «Razones trigonométricas de ángulos agudos» (trigonometria.razones-trigonometricas-agudas), para 5.º de
 * secundaria y preuniversitario. Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 3),
 * docs/teoria/fuentes/historia-ecuaciones.pdf (pp. 84–85) y las «Precisiones de Geometría y Trigonometría» del
 * expediente (la 4: 37°/53° y 16°/74° son aproximaciones de los triángulos 3-4-5 y 7-24-25, no valores exactos).
 * Compañera: Mara (coneja), cercana y rigurosa: cada razón se lee desde un ángulo, y lo aproximado se dice.
 *
 * Etapa 2 del plan de calidad (17 nov): la unidad entera rehecha contra el contrato (docs/plan-calidad.md §3), con la
 * propuesta aprobada (docs/etapa2/propuesta-trigonometria.md) y las decisiones de Gerson (docs/etapa2/decisiones.md, que
 * mandan). Cinco ideas: los lados desde θ (nueva), una razón es un cociente (sen, cos y tan), medio cuadrado y medio
 * equilátero (30°, 45°, 60°), 37° y 53° (y 16°, 74°, con k) y complementarias y recíprocas (cot, sec y csc recién aquí).
 * Cada idea: objeto de la vida real en la primera pantalla (pieza trig-objeto, dibujos de prueba), misión, leyenda,
 * predicción con datos sin fórmula, «Mira», regla, «Así se resuelve» distinto de «Ahora tú», «Ahora tú» con datos y de
 * nivel examen, y 15 ejemplos resueltos con las cuentas rehechas aparte (scratchpad e2-trig y e2-trig-resto, cuentas-idea2 a 5).
 * REGLA DE COLORES DE LA UNIDAD (correcciones del 17 nov, tras los dos lectores en frío: la escalera era naranja en la
 * idea 1 y turquesa en la 2, el turquesa era sombra, rayo y otra vez sombra, CA salía naranja en cos y turquesa en tan, y
 * los ejemplos 04 y 13 tenían el mismo dibujo con los colores al revés). Antes el color seguía al lugar en la fracción
 * (numerador naranja, denominador turquesa); ahora sigue al LADO, nombrado desde el ángulo de la figura:
 *   - cateto opuesto, naranja (o); cateto adyacente, turquesa (i); hipotenusa, en tinta; ángulos, carmín (h), con arco y
 *     letra; el resultado (lo que se pide, ya calculado), violeta (f). Lo que se pide va con «?» en tinta, nunca violeta.
 *   - «Desde el ángulo de la figura»: desde θ si la figura lo tiene; si solo trae α o un ángulo con número (53°, 60°),
 *     desde ese; si marca los dos agudos con número, desde el de abajo (en la señal y la escuadra, siempre desde 30°: la
 *     misma señal y la misma escuadra no cambian de colores entre ejemplos; auditoría, 17 nov). Un lado no cambia de color
 *     dentro de una figura aunque se mire desde el otro agudo: cambia su NOMBRE, y el texto o el rótulo lo dice («CO de θ
 *     = 4 m» y, debajo, «CA de α»). Las siglas CO y CA llevan siempre su color (CO naranja, CA
 *     turquesa); un número o el nombre de un objeto (poste, pared) llevan el color de su línea en la figura.
 *   - Así, en las fórmulas cada lado tiene un solo color, esté arriba o abajo: sen θ = CO/H, cos θ = CA/H, tan θ = CO/CA,
 *     cot θ = CA/CO, sec θ = H/CA y csc θ = H/CO.
 *   - Excepción: en los ejercicios de la idea 1 («Así se resuelve», «Ahora tú» y las figuras de sus ejemplos), donde lo
 *     que se practica es nombrar los lados, la figura va en tinta: el color nombraría el lado por el alumno. Los lados
 *     de otras figuras de examen que no son del triángulo (AD y CD en el trapecio, AB en el cuadrado) van en tinta.
 *   - La misma regla vale en la práctica (plantillas/razones-trig-agudas) y en todo «Ahora tú». La comprueban
 *     razones-trigonometricas-agudas.test.js (cada figura de la teoría, con «Ahora tú» y «Así se resuelve» en 400
 *     semillas) y generador.test.js (400 semillas): calculan desde el ángulo de la figura (trig-objeto, papeles) cuál lado
 *     es CO, CA y H y fallan si un lado lleva otro color; así el color nunca señala un distractor.
 *   La leyenda de cada juego dice qué color es cada nombre; la tarjeta 3 de «Lee» de la idea 1 lo presenta. Aprobada por
 *   Gerson (molde §5b reescrito, 17 nov: «el lado lleva el color de su nombre desde el ángulo»).
 * Las fórmulas van con espacios que no parten línea dentro de cada relación (junto): «tan θ = CO/CA» no se corta.
 * Convención (decisiones, 17 nov): «≈» en la teoría (37° mide 36,87°); en `datos`, «sen 37° = 3/5 y cos 37° = 4/5
 * (convención del examen)», la misma forma que en la práctica (auditoría, 17 nov: había tres); la condición de la regla de
 * la idea 4 dice por qué cambia el signo. Respuestas racionalizadas, con
 * «1/√2 = √2/2» como dato. Despejar un lado (CA = H · cos θ) no entra: los lados se hallan con k. Pitágoras y semejanza
 * van como dato y en «Lee».
 * Errores: TR7 (el seno es una longitud), TR8 (la razón depende del tamaño), TR9 (elige mal la razón) y TR10 (la razón
 * es proporcional al ángulo) son de docs/investigacion/trigonometria-ideas-erroneas.md; los demás códigos de cada
 * idea son hipótesis de aula, sin medir (ver el bloque de cada idea).
 * El laboratorio conserva sus tres mesas y los ids de sus controles (co, ca, g, k), con los colores de §5b.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: una razón trigonométrica es un cociente de lados que depende solo del ángulo agudo, no del tamaño.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: calcula las seis razones, usa 30°, 45° y 60° exactos, 37° y 16° como aproximaciones declaradas,
 *     y resuelve con cofunciones y recíprocas.
 *   Orden de atención: 1.º el ángulo θ · 2.º el lado opuesto · 3.º la hipotenusa · acción: cambiar un cateto o el ángulo.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué un triángulo más grande no tiene mayor seno, y por qué 37° no es exacto?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  // Una relación que no se parte en dos líneas: los espacios de sus textos pasan a espacios duros (lector en frío, 17 nov:
  // «tan / θ = CO/CA», «4 m ÷ 5 / m», «(90° − / θ)»). Entre dos relaciones se deja un «;   » normal, donde sí puede partir.
  // Separador entre dos relaciones: en la regla, cada una va en su renglón; en el resto, una raya fina entre las dos.
  const SEP = '   ·   ';
  const junto = x => (typeof x === 'string' ? x.replace(/ /g, '\u00a0') : Array.isArray(x) ? x.map(junto)
    : x && typeof x === 'object' && !('v' in x) ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, k === 'indice' ? v : junto(v)])) : x);
  // θ siempre en carmín (molde §5b; antes iba en naranja en las ideas 2 a 5 y el laboratorio).
  const th = { v: 'c-h', t: 'θ' };
  const RAD = Math.PI / 180, GRA = 180 / Math.PI;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  // Cuatro opciones siempre en «Ahora tú» (auditoría, 17 nov): si un caso sale con menos (dos errores que coinciden por
  // los números), se arma otro con el mismo azar, como en la práctica.
  function conCuatro(caso, r) {
    for (let i = 0; i < 80; i++) { const c = caso(r); if (c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      if (typeof x.valor === 'number' && !Number.isFinite(x.valor)) continue;
      const txt = fmt(x.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }

  // Gesto directo (docs/teoria.md §4b). La pieza «triangulo» ajusta la escala a sus puntos; para que la manija siga
  // al dedo, los juegos agregan un «marco»: un punto que no se ve (paso 99) y fija la caja de la figura. La pieza no
  // trae inversa: se invierte aquí, con su X e Y, que son lineales.
  const TRI = () => Kit.piezas.triangulo;
  const enPx = (dd, x, y) => { const g = TRI().geometria(dd); return { x: g.X(x), y: g.Y(y) }; };
  const delPx = (dd, pt) => {
    const g = TRI().geometria(dd), x0 = g.X(0), y0 = g.Y(0);
    return { x: (pt.x - x0) / (g.X(1) - x0), y: (pt.y - y0) / (g.Y(1) - y0) };
  };
  const marco = (x, y) => [{ id: 'marco', x, y, paso: 99 }];
  // Ángulo en A (en grados, de 0 a 180) del punto bajo el dedo.
  const anguloEnA = (dd, pt) => { const q = delPx(dd, pt); return Math.atan2(q.y, q.x) * GRA; };

  // Triángulo rectángulo del laboratorio, con θ en A y el recto en C (molde §5b): el adyacente CA, horizontal, turquesa;
  // el opuesto CO, vertical, naranja; la hipotenusa, en tinta; θ, carmín.
  // o.co, o.ca, o.h: rótulos; o.ang: rótulo de θ; o.otro: rótulo del otro agudo (en B); o.marco: [x, y] del marco.
  const tri = (co, ca, o = {}) => ({
    puntos: [{ id: 'A', x: 0, y: 0, rotulo: o.nombres ? 'A' : '' }, { id: 'C', x: ca, y: 0, rotulo: o.nombres ? 'C' : '' }, { id: 'B', x: ca, y: co, rotulo: o.nombres || o.soloB ? 'B' : '' }]
      .concat(o.puntos || [], o.marco ? marco(o.marco[0], o.marco[1]) : []),
    lados: [
      { de: 'A', a: 'C', color: 'i', texto: o.ca === undefined ? f(ca) : o.ca, grosor: 'variable' },
      { de: 'C', a: 'B', color: 'o', texto: o.co === undefined ? f(co) : o.co, grosor: 'variable' },
      { de: 'A', a: 'B', texto: o.h === undefined ? f(Math.hypot(co, ca)) : o.h, grosor: 'contorno', lado: -1 },
    ].concat(o.lados || []),
    angulos: [{ en: 'A', de: 'C', a: 'B', texto: o.ang === undefined ? 'θ' : o.ang, color: 'h', paso: o.pasoAng }, { en: 'C', de: 'A', a: 'B' }]
      .concat(o.otro ? [{ en: 'B', de: 'C', a: 'A', texto: o.otro, paso: o.pasoOtro }] : []).concat(o.angulos || []),
  });

  // ---------- Idea 1 (nueva, 17 nov): los lados se nombran desde θ ----------
  // Propuesta aprobada por Gerson: docs/etapa2/propuesta-trigonometria.md y docs/etapa2/decisiones.md (mandan sobre la
  // propuesta). Objeto de la primera pantalla: una escalera de 5 m en la pared de una casa de adobe (pieza trig-objeto).
  // Cambia: el pie de la escalera (lo que la separa de la pared). · Permanece: los 5 m de la escalera y el rincón recto.
  // Progresa: el piso crece y la pared baja; la escalera sigue siendo el lado mayor. · Se reserva: el ángulo de arriba, α
  // (la predicción). · Debe verse: los catetos cambian de nombre según el ángulo desde el que se mira; la hipotenusa, no.
  // Colores de esta idea (regla de la unidad, arriba): desde θ, la pared (opuesto) naranja, el piso (adyacente) turquesa y
  // la escalera (hipotenusa) en tinta, en «Lee», juego, predicción y «Mira». Desde α los colores de las líneas no cambian:
  // cambian los nombres, y los rótulos lo dicen («CO de θ = 4 m» y «CA de α»). En los ejercicios (ejemplos, «Así se
  // resuelve» y «Ahora tú») la figura va en tinta, porque lo que se practica es nombrar; el texto del resuelto sí pinta
  // cada lado con el color de su nombre, y el resultado va en violeta.
  // Errores (hipótesis salvo TR7 y TR9, de docs/investigacion/trigonometria-ideas-erroneas.md): TR7 «el opuesto es el lado
  // vertical» (De Kee y otros; parcial), TR9 confunde opuesto con adyacente (Kendal y Stacey; parcial), LAD-HIPOTENUSA toma
  // la hipotenusa por cateto, LAD-SOLO-PISO cree que solo se mide desde el piso, LAD-TOCA-H toma la hipotenusa por adyacente
  // porque también toca al ángulo, LAD-HIP-CATETO toma un cateto por hipotenusa, LAD-NO-CAMBIA nombra desde θ cuando se
  // pregunta desde α, PIT-SUMA suma los cuadrados para hallar un cateto, LAD-SIN-RECTO toma como catetos los dos lados que
  // tocan el ángulo (17 nov, con «Ahora tú» por pares, como en la práctica).
  const OB = 'trig-objeto';
  const TO = () => Kit.piezas[OB];
  const thN = { v: 'c-h', t: 'θ' }, al = { v: 'c-h', t: 'α' };
  // Colores de la regla de la unidad: dO, el cateto opuesto (naranja); dI, el adyacente (turquesa); dF, el resultado
  // (violeta). La hipotenusa va en tinta: sin envoltorio.
  const dO = t => ({ v: 'c-o', t }), dI = t => ({ v: 'c-i', t }), dF = t => ({ v: 'c-f', t });
  const cuad = x => ({ sup: [x, '2'] });
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  // Datos de cada ejercicio (contrato, punto 13): definiciones y la fórmula de Pitágoras, una por línea. Pitágoras no
  // está en el `requiere` de la unidad: va siempre como dato (decisiones, 17 nov).
  const DL = {
    cat: 'Catetos: los dos lados que forman el ángulo recto, de 90°.',
    h: 'Hipotenusa: el lado que queda frente al ángulo recto. Es el lado más largo.',
    // Sin «es el más largo»: en el ejemplo que pregunta cuál es la hipotenusa, eso era la respuesta (lector en frío, 17 nov).
    hSolo: 'Hipotenusa: el lado que queda frente al ángulo recto.',
    co: 'Cateto opuesto a un ángulo agudo: el cateto que queda frente a ese ángulo, sin tocarlo.',
    ca: 'Cateto adyacente a un ángulo agudo: el cateto que forma ese ángulo junto con la hipotenusa.',
    pita: ['Pitágoras: ', junto([cuad('hipotenusa'), ' = ', cuad('cateto'), ' + ', cuad('cateto')])],
    seg: (p, q) => `Un lado se nombra con sus dos vértices: ${p}${q} es el lado que une ${p} con ${q}.`,
    recto: v => `Recto en ${v}: el ángulo de 90° está en el vértice ${v}.`,
  };
  // Un largo con su unidad: «1,5 m»; si no es exacto con dos decimales, con «≈».
  const largoTxt = (x, u = 'm') => `${Math.abs(x - Math.round(x * 100) / 100) < 1e-9 ? '' : '≈ '}${f(x, 2)} ${u}`;
  const fig = datos => ({ pieza: OB, datos, estado: {} });

  // El juego: la escalera de 5 m; el pie, a «pie» metros de la pared. La escala queda fija (marco) para que el pie siga
  // al dedo cuando se arrastra.
  const ESC = 5, altoEsc = pie => Math.sqrt(ESC * ESC - pie * pie);
  const escJ = v => ({ objeto: 'escalera', medidas: { piso: v.pie, pared: altoEsc(v.pie) }, marco: [4.5, 5],
    lados: { escalera: { texto: '5 m' }, pared: { color: 'o', texto: largoTxt(altoEsc(v.pie)) }, piso: { color: 'i', texto: largoTxt(v.pie) } },
    angulos: { pie: { texto: 'θ' } } });
  // Predicción y «Mira»: la escalera con el pie a 3 m (lados 3, 4 y 5), con los colores desde θ. o.pared y o.piso: el
  // color de la línea (con pasos en «Mira»); o.pared2, o.piso2: la segunda línea del rótulo (el nombre desde α), con el
  // color de ese nombre.
  const ESC345 = (o = {}) => ({ objeto: 'escalera', medidas: { piso: 3, pared: 4 }, marco: [4.5, 5],
    lados: { escalera: { texto: o.h || '5 m' }, pared: { color: o.paredC || 'o', texto: o.pared || '4 m', texto2: o.pared2, color2: 'i' }, piso: { color: o.pisoC || 'i', texto: o.piso || '3 m', texto2: o.piso2, color2: 'o' } },
    angulos: { pie: { texto: 'θ' }, arriba: o.alfa === false ? undefined : { texto: 'α', paso: o.pasoAlfa || 0 } } });

  // Objetos de «Así se resuelve» y «Ahora tú»: cada uno con sus lados (ra y rb, los catetos; h, la hipotenusa), sus dos
  // ángulos agudos (a, junto a ra; b, junto a rb), el cateto vertical (para el error TR7) y medidas posibles (ternas
  // pitagóricas a escala: 3-4-5, 7-24-25, 5-12-13, 12-35-37 y 8-15-17).
  const OBJS = [
    { objeto: 'escalera', u: 'm', ra: 'el piso', rb: 'la pared', h: 'la escalera', vertical: 'rb', a: 'entre la escalera y el piso', b: 'entre la escalera y la pared',
      intro: 'Una escalera está apoyada en una pared.', ternas: [[1.5, 2, 2.5], [1.8, 2.4, 3], [0.7, 2.4, 2.5], [1.2, 3.5, 3.7], [1, 2.4, 2.6], [1.6, 3, 3.4]] },
    { objeto: 'rampa', u: 'm', ra: 'la base', rb: 'la altura', h: 'la rampa', vertical: 'rb', a: 'entre la rampa y el piso', b: 'entre la rampa y el borde de la plataforma',
      intro: 'Una rampa sube del piso a una plataforma.', ternas: [[1.2, 0.5, 1.3], [2.4, 0.7, 2.5], [1.5, 0.8, 1.7]] },
    { objeto: 'poste', u: 'm', ra: 'el suelo', rb: 'el poste', h: 'el cable', vertical: 'rb', a: 'entre el cable y el suelo', b: 'entre el cable y el poste',
      intro: 'Un cable va de la punta de un poste a una estaca en el suelo.', ternas: [[6, 8, 10], [4.5, 6, 7.5], [5, 12, 13]] },
    { objeto: 'poste', sombra: true, u: 'm', ra: 'la sombra', rb: 'el poste', h: 'el rayo de sol', vertical: 'rb', a: 'entre el rayo de sol y el suelo', b: 'entre el rayo de sol y el poste',
      intro: 'Un poste da sombra en el suelo; un rayo de sol pasa por su punta.', ternas: [[8, 6, 10], [6, 4.5, 7.5], [12, 5, 13]] },
    { objeto: 'repisa', u: 'cm', ra: 'la pared', rb: 'el brazo', h: 'el tirante', vertical: 'ra', a: 'entre el tirante y la pared', b: 'entre el tirante y el brazo',
      intro: 'Una repisa tiene un brazo horizontal sostenido por un tirante.', ternas: [[40, 30, 50], [20, 15, 25], [24, 18, 30], [36, 15, 39]] },
  ];
  // Figura de un objeto: lados = { ra|rb|h: { texto, color } }, angulos = { a|b: { texto } }.
  const figO = (o, ra, rb, lados, angulos) => fig({ objeto: o.objeto, sombra: o.sombra, medidas: { ra, rb }, lados, angulos });
  // Desde el vértice a: el adyacente es ra y el opuesto rb; desde b, al revés. La hipotenusa es h desde los dos.
  const desde = v => (v === 'a' ? { ca: 'ra', co: 'rb' } : { ca: 'rb', co: 'ra' });

  // Ejemplos resueltos de «Los lados se nombran desde θ» (pestaña «Ejemplos»; molde §3). Cuentas revisadas con un script
  // aparte, que las rehace sin el código de la unidad (scratchpad e2-trig/scripts/cuentas-lados.js): 1,5² + 2² = 2,5²; 0,5² + 1,2² = 1,3²;
  // 6² + 8² = 10²; 1,8² + 2,4² = 3²; 6² + 8² = 10² (sombra); 0,7² + 2,4² = 2,5²; 30² + 40² = 50²; √(3,4² − 1,6²) = 3;
  // √(2,5² − 0,7²) = 2,4; √(7,5² − 4,5²) = 6; √(2,6² − 2,4²) = 1; 90² + 120² = 150²; 20² + 21² = 29²; √(25² − 20²) = 15
  // y 15 + 15 = 30; √(29² − 20²) = √441 = 21 (Recto en Q, 17 nov). La figura muestra el planteamiento, en tinta: las
  // medidas que se dan, nunca cuál es el lado pedido.
  const t3 = (ra, rb, h) => ({ ra: { texto: ra }, rb: { texto: rb }, h: { texto: h } });
  // √(h² − c²): la hipotenusa en tinta y el cateto que se conoce con el color de su nombre (cc: 'o' o 'i'; sin cc, tinta).
  const raizDif = (h, c, cc) => ({ raiz: [[cuad(h), ' − ', cuad(cc ? { v: `c-${cc}`, t: c } : c)]] });
  // «En el mundo» (Gerson, 28 nov; docs/teoria.md, 4k): un hecho real por idea, que su regla explica. No repiten la
  // apertura (la rampa de 100 %) ni los objetos de los ejemplos y las Predice (escalera, rampa, poste, sombra, señal,
  // loseta, estaca, techo). Las cuentas las hace el código; los datos medidos llevan su fuente.
  //   1. El televisor: las pulgadas son la diagonal, la hipotenusa (lados en tinta, como en los ejercicios de la idea 1).
  //   2. El eclipse total: el Sol y la Luna dan casi la misma tangente, radio entre distancia.
  //   3. La tuerca: el hexágono es seis equiláteros; la esquina queda más lejos que la cara (cos 30°).
  //   4. Kefrén: la mitad de la base y la altura van como 3k y 4k.
  //   5. La torre de Pisa: el desplazamiento es opuesto a 3,97° y adyacente a 86,03° (cofunción).
  const MUNDO = (() => {
    const r1 = n => Math.round(n * 10) / 10;
    const svg = (vb, cuerpo) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" font-family="inherit">${cuerpo}</svg>`;
    const arco = (cx, cy, r, a0, a1) => {
      const p = a => [r1(cx + r * Math.cos(a * RAD)), r1(cy - r * Math.sin(a * RAD))];
      const [x0, y0] = p(a0), [x1, y1] = p(a1);
      return `<path d="M${x0} ${y0}A${r} ${r} 0 0 ${a1 > a0 ? 0 : 1} ${x1} ${y1}" fill="none" style="stroke:var(--c-h)" stroke-width="3"/>`;
    };
    const rot = (x, y, s, d = 1) => `<path d="M${x - d * s} ${y}v${-s}h${d * s}" fill="none" stroke="currentColor" stroke-width="2"/>`;
    const txt = (x, y, t, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-size="${o.fs || 17}" font-weight="700" style="fill:${o.c ? `var(--c-${o.c})` : 'currentColor'};stroke:var(--card)" stroke-width="4" paint-order="stroke">${t}</text>`;

    // 1. Televisor de 55 pulgadas, 16:9.
    const PUL = 2.54, DIAG = 55 * PUL, R169 = Math.hypot(16, 9);
    const ANCHO = DIAG * 16 / R169, ALTO = DIAG * 9 / R169;
    const tv = (() => {
      const x0 = 40, y1 = 214, w = 288, h = 162, y0 = y1 - h, a = Math.atan2(9, 16) * GRA;
      return svg('0 0 420 280', `
        <rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="6" fill="none" stroke="currentColor" stroke-width="4"/>
        <line x1="${x0 + w / 2 - 30}" y1="${y1 + 30}" x2="${x0 + w / 2 + 30}" y2="${y1 + 30}" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
        <line x1="${x0 + w / 2}" y1="${y1}" x2="${x0 + w / 2}" y2="${y1 + 30}" stroke="currentColor" stroke-width="5"/>
        <line x1="${x0}" y1="${y1}" x2="${x0 + w}" y2="${y0}" stroke="currentColor" stroke-width="3" stroke-dasharray="9 6"/>
        ${arco(x0, y1, 48, 0, a)}${rot(x0 + w, y1, 16)}
        ${txt(x0 + 64, y1 - 10, 'θ', { c: 'h', fs: 20, a: 'start' })}
        ${txt(x0 + w / 2, y0 - 14, `diagonal: 55 pulgadas = ${f(DIAG, 1)} cm`, { fs: 15 })}
        ${txt(x0 + w / 2, y1 + 54, `ancho ≈ ${f(ANCHO, 1)} cm`)}
        ${txt(x0 + w + 8, y0 + h / 2 - 6, 'alto ≈', { a: 'start' })}${txt(x0 + w + 8, y0 + h / 2 + 16, `${f(ALTO, 1)} cm`, { a: 'start' })}`);
    })();
    const lados = {
      hecho: 'Un televisor de 55 pulgadas no mide 55 de ancho',
      parrafos: [
        ['Cuando compras un televisor, las pulgadas que anuncia la caja no son el ancho de la pantalla: son su diagonal, medida de esquina a esquina. Como cada pulgada mide 2,54 cm, un televisor de 55 pulgadas tiene esta diagonal:',
          { linea: ['55 × 2,54 cm = ', `${f(DIAG, 1)} cm`] }],
        ['El ancho y el alto de la pantalla se juntan en una esquina en ángulo recto, así que con la diagonal forman un triángulo rectángulo. La diagonal queda frente al ángulo recto: es la hipotenusa, el lado más largo. En una pantalla común, de forma 16:9, los otros dos lados miden mucho menos:',
          { linea: [`ancho ≈ ${f(ANCHO, 1)} cm`, SEP, `alto ≈ ${f(ALTO, 1)} cm`] }],
        'Por eso, para saber si el televisor entra en tu mueble, comparas el mueble con el ancho de la pantalla y su marco, no con los 140 cm de la diagonal.',
      ],
      figura: { svg: tv, alt: `Una pantalla de televisor con su diagonal punteada de 55 pulgadas, ${f(DIAG, 1)} cm. El ancho mide unos ${f(ANCHO, 1)} cm y el alto, unos ${f(ALTO, 1)} cm; el ángulo θ está en la esquina de abajo, entre la diagonal y el borde de abajo.` },
      pregunta: {
        texto: ['Mira la pantalla desde ', thN, ', el ángulo entre la diagonal y el borde de abajo. ¿Qué es el alto de la pantalla para ', thN, '?'],
        opciones: [
          { id: 'co', texto: ['El cateto opuesto a ', thN], correcta: true },
          { id: 'ca', texto: ['El cateto adyacente a ', thN], error: 'TR7',
            siFuera: ['Ver que el alto es un cateto está bien, porque forma el ángulo recto con el ancho. Pero el alto no toca a ', thN, ': lo toca el ancho, y el alto queda al otro lado.'] },
          { id: 'h', texto: 'La hipotenusa, porque es el lado que se levanta', error: 'LAD-HIPOTENUSA',
            siFuera: 'Pensar en el lado que sube tiene sentido, porque en muchos dibujos la hipotenusa va inclinada hacia arriba. Pero la hipotenusa se reconoce por quedar frente al ángulo recto, y aquí esa es la diagonal.' },
          { id: 'nada', texto: ['Ninguno, porque el alto no toca a ', thN], error: 'LAD-SOLO-PISO',
            siFuera: ['Es cierto que el alto no toca a ', thN, '. Justo por eso tiene nombre: el cateto que no toca el ángulo que miras, y queda frente a él, es el opuesto.'] },
        ],
        porque: ['Desde ', thN, ', el ancho toca el ángulo y es el cateto adyacente; el alto queda frente a ', thN, ', sin tocarlo, y es el cateto opuesto. La diagonal, frente al ángulo recto, es la hipotenusa.'],
      },
      fuente: 'Las pulgadas de un televisor son su diagonal (guías de compra de LG y Samsung Perú); 1 pulgada = 2,54 cm.',
    };

    // 2. Eclipse total: radio entre distancia, para la Luna y para el Sol (fichas de la NASA).
    const LUNA = { r: 1737, d: 384400 }, SOL = { r: 696000, d: 149.6e6 };
    const tL = LUNA.r / LUNA.d, tS = SOL.r / SOL.d, MON = 1;   // la moneda: 1 cm de radio
    const tanEc = (quien, r, d, t) => [junto(['tan ', thN, ` (${quien}) = `]), { frac: [[dO(r)], [dI(d)]] }, junto([' ≈ ', dF(f(t, 4))])];
    const razon = {
      hecho: 'La Luna tapa justo al Sol en un eclipse total',
      parrafos: [
        'El Sol es unas 400 veces más ancho que la Luna y, por casualidad, también está unas 400 veces más lejos de la Tierra. Por eso los dos se ven en el cielo casi del mismo tamaño, como discos de medio grado, y en un eclipse total la Luna tapa al Sol casi justo, sin que sobre ni falte.',
        ['Desde tu ojo, el radio de cada disco y su distancia forman un triángulo rectángulo con un ángulo ', thN, ' muy pequeño. Su tangente divide el radio entre la distancia, y da casi lo mismo para los dos:',
          { linea: tanEc('Luna', '1 737 km', '384 400 km', tL) },
          { linea: tanEc('Sol', '696 000 km', '149,6 millones de km', tS) },
          'Con casi la misma tangente, el ángulo también es casi el mismo, aunque el Sol sea muchísimo más grande.'],
      ],
      pregunta: {
        texto: `Una moneda de ${f(2 * MON)} cm de ancho tiene ${f(MON)} cm de radio. ¿A qué distancia de tu ojo tapa justo a la Luna llena?`,
        opciones: [
          { id: 'c', texto: `A unos ${f(MON / tL / 100, 1)} m`, correcta: true },
          { id: 'ancho', texto: `A unos ${f(2 * MON / tL / 100, 1)} m`, error: 'RAZ-ANCHO-RADIO',
            siFuera: `Dividir entre ${f(tL, 4)} está bien, porque es la tangente de la Luna. Pero esa tangente es el radio entre la distancia, y para la moneda también va su radio, ${f(MON)} cm, no su ancho entero.` },
          { id: 'lejos', texto: 'A 384 400 km, igual de lejos que la Luna', error: 'TR8',
            siFuera: 'Es cierto que a esa distancia la Luna se ve de ese tamaño. Pero la moneda no necesita estar igual de lejos: le basta con tener el mismo cociente entre su radio y su distancia.' },
          { id: 'nunca', texto: 'A ninguna, porque la moneda es mucho más chica', error: 'RAZ-TAMANO',
            siFuera: 'Es cierto que la moneda es muchísimo más chica que la Luna. Pero lo que ves en el cielo es el ángulo, y el ángulo depende del cociente entre el radio y la distancia, no del tamaño solo.' },
        ],
        porque: `Para tapar justo a la Luna, la moneda necesita su mismo ángulo y, por eso, la misma tangente. Su distancia sale de dividir ${f(MON)} cm entre ${f(tL, 4)}: unos ${f(Math.round(MON / tL), 0)} cm.`,
      },
      fuente: 'El Sol, unas 400 veces más ancho y más lejos que la Luna (NASA Space Place; CfA Harvard); radios y distancias de NASA.',
    };

    // 3. Tuerca hexagonal: seis equiláteros; del centro a una cara (adyacente a 30°) y a una esquina (hipotenusa).
    const C30 = Math.sqrt(3) / 2, M8 = 13, M6 = 10;
    const tuerca = (() => {
      const cx = 160, cy = 150, R = 135, ap = R * C30;
      const pts = [0, 60, 120, 180, 240, 300].map(a => `${r1(cx + R * Math.cos(a * RAD))},${r1(cy - R * Math.sin(a * RAD))}`).join(' ');
      const ex = cx + R * Math.cos(30 * RAD), ey = cy - R * Math.sin(30 * RAD);   // la esquina de arriba a la derecha
      return svg('0 0 380 340', `
        <polygon points="${pts.split(' ').map(p => { const [x, y] = p.split(','); const a = Math.atan2(cy - y, x - cx) + Math.PI / 6; return `${r1(cx + R * Math.cos(a))},${r1(cy - R * Math.sin(a))}`; }).join(' ')}" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="${cx}" cy="${cy}" r="26" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 5"/>
        <line x1="${cx}" y1="${cy}" x2="${r1(cx + ap)}" y2="${cy}" style="stroke:var(--c-i)" stroke-width="5" stroke-linecap="round"/>
        <line x1="${r1(cx + ap)}" y1="${cy}" x2="${r1(ex)}" y2="${r1(ey)}" style="stroke:var(--c-o)" stroke-width="5" stroke-linecap="round"/>
        <line x1="${cx}" y1="${cy}" x2="${r1(ex)}" y2="${r1(ey)}" stroke="currentColor" stroke-width="3"/>
        ${arco(cx, cy, 44, 0, 30)}${rot(r1(cx + ap), cy, 12)}
        ${txt(cx + 50, cy - 7, '30°', { c: 'h', fs: 15, a: 'start' })}
        ${txt(r1(cx + ap / 2), cy + 22, `${f(M8 / 2, 1)} mm`, { c: 'i', fs: 16 })}
        ${txt(r1(ex + 6), r1(ey - 10), 'esquina', { fs: 16, a: 'start' })}
        ${txt(cx + 20, 328, `llave de ${M8}: ${M8} mm de cara a cara`, { fs: 17 })}`);
    })();
    const notables = {
      hecho: 'Por qué la llave de 13 hace girar la tuerca',
      parrafos: [
        `En la llanta de una bicicleta o en el motor de una mototaxi, las tuercas son hexágonos, y el número de la llave es la distancia entre dos caras planas paralelas. Una tuerca M8, por ejemplo, se ajusta con la llave de ${M8} mm porque mide ${M8} mm de una cara a la otra.`,
        ['Un hexágono se parte en seis triángulos equiláteros que se juntan en el centro, y la mitad de uno de ellos es media señal. Su ángulo de 30° está en el centro, el cateto que lo toca llega a una cara y la hipotenusa llega a una esquina:',
          { linea: [junto(['cos 30° = ']), { frac: [[dI(`${f(M8 / 2, 1)} mm`)], ['hasta la esquina']] }] },
          { linea: [junto(['hasta la esquina = ']), { frac: [[dI(`${f(M8 / 2, 1)} mm`)], ['cos 30°']] }, junto([` ≈ ${f(M8 / 2 / C30, 1)} mm`])] }],
        `Por eso la tuerca mide unos ${f(M8 / C30, 0)} mm de esquina a esquina, más que la boca de la llave, y no puede girar dentro de ella: la llave la empuja por las esquinas. Si usas una llave más floja, las esquinas resbalan, se liman y la tuerca se barre.`,
      ],
      figura: { svg: tuerca, alt: `Una tuerca hexagonal vista de frente, con el centro unido a una cara por un segmento turquesa de ${f(M8 / 2, 1)} mm y a una esquina por la hipotenusa; el ángulo de 30° está en el centro y el ángulo recto, en la cara.` },
      pregunta: {
        texto: `Una tuerca M6 se ajusta con la llave de ${M6} mm. Si sus esquinas no están limadas, ¿cuánto mide de esquina a esquina?`,
        opciones: [
          { id: 'c', texto: `≈ ${f(M6 / C30, 1)} mm`, correcta: true },
          { id: 'mismo', texto: `${M6} mm, lo mismo que la llave`, error: 'NOT-MISMO',
            siFuera: `Es cierto que la llave mide ${M6} mm, porque abraza la tuerca entre dos caras. Pero de cara a cara van dos catetos, y de esquina a esquina van dos hipotenusas, que son más largas.` },
          { id: 'cuadrado', texto: `≈ ${f(M6 * Math.SQRT2, 1)} mm, como la diagonal de un cuadrado`, error: 'NOT-45',
            siFuera: 'Buscar una figura notable está bien. Pero la tuerca no es un cuadrado partido: es un hexágono, y su medio triángulo es media señal, de 30° y 60°, no media loseta de 45°.' },
          { id: 'por', texto: `≈ ${f(M6 * C30, 1)} mm`, error: 'NOT-MULTIPLICA',
            siFuera: 'Usar cos 30° está bien, porque del centro a una cara va el cateto que toca 30°. Pero la hipotenusa es más larga que ese cateto: sale de dividir entre cos 30°, no de multiplicar.' },
        ],
        porque: `Del centro a una cara hay ${f(M6 / 2)} mm, el cateto que toca 30°; la hipotenusa, hasta la esquina, es ese cateto entre cos 30°. Dos hipotenusas dan unos ${f(M6 / C30, 1)} mm.`,
      },
      fuente: `Llave de ${M8} mm para la tuerca M8 y de ${M6} mm para la M6, entre caras (norma ISO 4032); la medida entre esquinas se calcula aquí.`,
    };

    // 4. Kefrén: base de 215,25 m y altura original de 143,5 m; la mitad de la base y la altura van como 3 y 4.
    const BASE = 215.25, ALT = 143.5, MB = BASE / 2, K = ALT / 4, MAQ = 36;
    const piramide = (() => {
      const x0 = 18, y0 = 230, s = 1.5, xm = x0 + MB * s, xt = x0 + 2 * MB * s, yt = y0 - ALT * s;
      return svg('0 0 420 290', `
        <polygon points="${x0},${y0} ${r1(xt)},${y0} ${r1(xm)},${r1(yt)}" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
        <line x1="${r1(xm)}" y1="${y0}" x2="${r1(xm)}" y2="${r1(yt)}" style="stroke:var(--c-o)" stroke-width="5" stroke-linecap="round"/>
        <line x1="${r1(xm)}" y1="${y0}" x2="${r1(xt)}" y2="${y0}" style="stroke:var(--c-i)" stroke-width="5" stroke-linecap="round"/>
        <line x1="${x0 - 14}" y1="${y0}" x2="${r1(xt + 14)}" y2="${y0}" style="stroke:var(--muted)" stroke-width="2"/>
        ${arco(xt, y0, 34, 180, 180 - Math.atan2(4, 3) * GRA)}${rot(r1(xm), y0, 14, -1)}
        ${txt(r1(xt - 46), y0 - 12, '≈ 53°', { c: 'h', fs: 16, a: 'end' })}
        ${txt(r1(xm - 8), r1(y0 - ALT * s / 2), 'altura', { c: 'o', fs: 16, a: 'end' })}${txt(r1(xm - 8), r1(y0 - ALT * s / 2 + 20), `${f(ALT, 1)} m`, { c: 'o', fs: 16, a: 'end' })}
        ${txt(r1((xm + xt) / 2), y0 + 24, `mitad de la base: ${f(MB, 1)} m`, { c: 'i', fs: 15 })}
        ${txt(r1((xm + xt) / 2 + 30), r1((yt + y0) / 2 - 10), `cara: ${f(5 * K, 1)} m`, { fs: 15, a: 'start' })}`);
    })();
    const aproximados = {
      hecho: 'La pirámide de Kefrén esconde un triángulo 3-4-5',
      parrafos: [
        `La pirámide de Kefrén, en Guiza, Egipto, tiene una base cuadrada de unos ${f(BASE)} m de lado y una altura original de unos ${f(ALT, 1)} m. Si la cortas por el centro, la altura, la mitad de la base y la línea que baja por el medio de una cara forman un triángulo rectángulo.`,
        [`La mitad de la base, unos ${f(MB, 1)} m, y la altura van como 3 y 4, así que cada parte vale unos ${f(K, 1)} m:`,
          { linea: [junto([dI('3k'), ` ≈ ${f(MB, 1)} m`]), SEP, junto([dO('4k'), ` ≈ ${f(ALT, 1)} m`]), SEP, junto([`5k ≈ ${f(5 * K, 1)} m`])] },
          'Por eso cada cara se levanta unos 53° sobre el suelo, más empinada que la de Keops, su vecina, y quien suba por el medio de una cara recorre unos 179 m, cinco partes.'],
      ],
      figura: { svg: piramide, alt: `La pirámide de Kefrén cortada por el centro: la altura de ${f(ALT, 1)} m en naranja, la mitad de la base de ${f(MB, 1)} m en turquesa y la cara de ${f(5 * K, 1)} m, que forma unos 53° con el suelo.` },
      pregunta: {
        texto: `Armas una maqueta de Kefrén de ${MAQ} cm de altura, con la misma forma. ¿Cuánto debe medir la mitad de su base?`,
        opciones: [
          { id: 'c', texto: `${f(MAQ / 4 * 3)} cm`, correcta: true },
          { id: 'cambia', texto: `${f(MAQ / 3 * 4)} cm`, error: 'APROX-ORDEN',
            siFuera: `Usar 3 y 4 está bien. Pero la altura es la de 4 partes, la que queda frente al ángulo de 53°: si ${MAQ} cm fueran 3 partes, la maqueta saldría más chata que Kefrén.` },
          { id: 'cara', texto: `${f(MAQ / 4 * 5)} cm`, error: 'APROX-HIPOTENUSA',
            siFuera: `Hallar cuánto vale k está bien: ${f(MAQ / 4)} cm. Pero 5k es la línea de la cara, la hipotenusa; la mitad de la base es el cateto de 3 partes.` },
          { id: 'resta', texto: `${f(MAQ - 3)} cm`, error: 'APROX-ADITIVO',
            siFuera: 'Ver que la mitad de la base es menor que la altura está bien. Pero los lados no se diferencian en una cantidad fija: van como 3 y 4, multiplicados por la misma k.' },
        ],
        porque: `La altura son 4 partes: con ${MAQ} cm, cada parte vale ${f(MAQ / 4)} cm, y la mitad de la base, 3 partes, mide ${f(MAQ / 4 * 3)} cm. Así la maqueta guarda los mismos ángulos de Kefrén.`,
      },
      fuente: 'Kefrén: base de 215,25 m, altura original de 143,5 m y cara de 53°10′ (Wikipedia; Pleiades; NOVA, PBS).',
    };

    // 5. Torre de Pisa: 3,97° con la vertical y unos 56 m de largo; el ángulo con el suelo es el complemento.
    const TORRE = 56, INC = 3.97, SUELO = 90 - INC, DESP = TORRE * Math.sin(INC * RAD);
    const pisa = (() => {
      const EXA = 6, bx = 130, by = 250, L = 210, a = (90 - INC * EXA) * RAD;   // la inclinación del dibujo, exagerada seis veces
      const tx = bx + L * Math.cos(a), ty = by - L * Math.sin(a), w = 30;
      const nx = Math.sin(a) * w / 2, ny = Math.cos(a) * w / 2;
      return svg('0 0 360 290', `
        <line x1="40" y1="${by}" x2="320" y2="${by}" style="stroke:var(--muted)" stroke-width="2"/>
        <polygon points="${r1(bx - nx)},${r1(by - ny)} ${r1(bx + nx)},${r1(by + ny)} ${r1(tx + nx)},${r1(ty + ny)} ${r1(tx - nx)},${r1(ty - ny)}" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="2 6"/>
        <line x1="${bx}" y1="${by}" x2="${r1(tx)}" y2="${r1(ty)}" stroke="currentColor" stroke-width="4"/>
        <line x1="${r1(tx)}" y1="${r1(ty)}" x2="${r1(tx)}" y2="${by}" style="stroke:var(--c-o)" stroke-width="4" stroke-dasharray="8 5"/>
        <line x1="${bx}" y1="${by}" x2="${r1(tx)}" y2="${by}" style="stroke:var(--c-i)" stroke-width="6" stroke-linecap="round"/>
        ${arco(bx, by, 24, 0, 90 - INC * EXA)}${arco(tx, ty, 40, -90, -90 - INC * EXA)}${rot(r1(tx), by, 12)}
        ${txt(bx + 26, by - 7, `${f(SUELO)}°`, { c: 'h', fs: 12, a: 'start' })}
        ${txt(r1(tx + 8), r1(ty + 40), `${f(INC)}°`, { c: 'h', fs: 15, a: 'start' })}
        ${txt(r1(bx - 6), r1((by + ty) / 2), `${TORRE} m`, { fs: 16, a: 'end' })}
        ${txt(r1((bx + tx) / 2), by + 26, `desplazamiento ≈ ${f(DESP, 1)} m`, { c: 'i', fs: 15 })}`);
    })();
    const complementarias = {
      hecho: 'La torre de Pisa se inclina casi 4 grados',
      parrafos: [
        `La torre de Pisa, en Italia, mide unos ${TORRE} m de largo y se inclinó porque el suelo blando se hundió más de un lado. Entre 1993 y 2001, los ingenieros sacaron tierra de debajo del lado más alto, la enderezaron un poco y la dejaron con ${f(INC)}° de inclinación respecto de la vertical.`,
        [`Desde los ${f(INC)}° de arriba, el desplazamiento queda enfrente; desde los ${f(SUELO)}° que la torre forma con el suelo, lo toca. Los dos ángulos suman 90°, así que la misma división tiene dos nombres:`,
          { linea: [junto([`sen ${f(INC)}° = cos ${f(SUELO)}° = `]), { frac: [[dI('desplazamiento')], [`${TORRE} m`]] }] },
          { linea: [junto([dI('desplazamiento'), ` = ${TORRE} m × sen ${f(INC)}° ≈ ${f(DESP, 1)} m`])] },
          `Por eso la punta queda unos ${f(DESP, 1)} m afuera de su base, una distancia que los ingenieros vigilan para que no vuelva a crecer.`],
      ],
      figura: { svg: pisa, alt: `La torre de Pisa dibujada como un segmento inclinado de ${TORRE} m; forma ${f(SUELO)}° con el suelo y ${f(INC)}° con la vertical, y su punta se sale unos ${f(DESP, 1)} m, marcados en turquesa sobre el suelo. La inclinación del dibujo está exagerada.` },
      pregunta: {
        texto: `Un topógrafo mide ${f(SUELO)}° entre la torre y el suelo. ¿Qué razón de ${f(SUELO)}° divide el desplazamiento entre el largo de la torre?`,
        opciones: [
          { id: 'c', texto: `cos ${f(SUELO)}°`, correcta: true },
          { id: 'sen', texto: `sen ${f(SUELO)}°`, error: 'COMP-MISMO-ANG',
            siFuera: `Recordar que con ${f(INC)}° es un seno está bien, porque desde arriba el desplazamiento queda enfrente. Pero desde ${f(SUELO)}°, en la base, el desplazamiento toca el ángulo: es el adyacente, y adyacente entre hipotenusa es coseno.` },
          { id: 'tan', texto: `tan ${f(SUELO)}°`, error: 'TR9',
            siFuera: 'Ver que entra el desplazamiento está bien. Pero la tangente divide los dos catetos, y aquí el desplazamiento se divide entre el largo de la torre, que es la hipotenusa.' },
          { id: 'sec', texto: `sec ${f(SUELO)}°`, error: 'NOT-RECIPROCA',
            siFuera: 'La secante sí usa el adyacente y la hipotenusa, pero al revés: divide el largo de la torre entre el desplazamiento. Aquí el desplazamiento va arriba.' },
        ],
        porque: `Desde ${f(SUELO)}°, el desplazamiento es el cateto adyacente y la torre, la hipotenusa: adyacente entre hipotenusa es el coseno. Es el mismo cociente que sen ${f(INC)}°, porque los dos ángulos suman 90°.`,
      },
      fuente: 'Torre de Pisa: unos 56 m, 3,97° de inclinación y unos 3,9 m fuera de la vertical tras la obra de 1993 a 2001 (Wikipedia; ICE).',
    };
    return { lados, razon, notables, aproximados, complementarias };
  })();

  const EJEMPLOS_LADOS = [
    { nivel: 1, titulo: 'La escalera de la casa', figura: fig({ objeto: 'escalera', medidas: { ra: 1.5, rb: 2 }, lados: t3('1,5 m', '2 m', '2,5 m'), angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una escalera de 2,5 m se apoya en una pared: su pie queda a 1,5 m y llega a 2 m de alto. ', thN, ' es su ángulo con el piso. ¿Cuál es el cateto adyacente a ', thN, '?'],
      datos: [DL.cat, DL.ca],
      solucion: [
        { texto: 'El ángulo recto está en el rincón, entre la pared y el piso: esos dos son los catetos. La escalera es la hipotenusa.' },
        { texto: [thN, ' está en el pie, entre la escalera y el piso. El cateto que forma ', thN, ' junto con la escalera es el piso: ', dF('1,5 m'), '.'] },
      ],
      respuesta: ['El piso: ', dF('1,5 m')] },
    { nivel: 1, titulo: 'La rampa de la vereda', figura: fig({ objeto: 'rampa', medidas: { ra: 1.2, rb: 0.5 }, lados: t3('1,2 m', '0,5 m', '1,3 m'), angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Para subir una carretilla a la vereda hay una rampa de 1,3 m: sube 0,5 m y su base mide 1,2 m. ', thN, ' es el ángulo entre la rampa y el piso. ¿Cuál es el cateto opuesto a ', thN, '?'],
      datos: [DL.cat, DL.co],
      solucion: [
        { texto: 'El borde de la vereda y el piso forman el ángulo recto: la altura, 0,5 m, y la base, 1,2 m, son los catetos.' },
        { texto: [thN, ' está abajo, donde empieza la rampa. Frente a ', thN, ', sin tocarlo, queda la altura: ', dF('0,5 m'), '.'] },
      ],
      respuesta: ['La altura: ', dF('0,5 m')] },
    { nivel: 1, titulo: 'El cable del poste', figura: fig({ objeto: 'poste', medidas: { ra: 6, rb: 8 }, lados: t3('6 m', '8 m', '10 m') }),
      enunciado: 'Un poste de 8 m se sostiene con un cable de 10 m, que va de su punta a una estaca clavada a 6 m de su base. ¿Cuál de los tres lados es la hipotenusa?',
      datos: [DL.hSolo],
      solucion: [
        { texto: 'El poste y el suelo forman el ángulo recto, en la base del poste.' },
        { texto: ['Frente a ese ángulo queda el cable: es la hipotenusa. También es el lado más largo, ', dF('10 m'), '.'] },
      ],
      respuesta: ['El cable: ', dF('10 m')] },
    { nivel: 1, titulo: 'Desde arriba de la escalera', figura: fig({ objeto: 'escalera', medidas: { ra: 1.8, rb: 2.4 }, lados: t3('1,8 m', '2,4 m', '3 m'), angulos: { b: { texto: 'α' } } }),
      enunciado: ['Una escalera de 3 m se apoya en una pared a 2,4 m de altura; su pie queda a 1,8 m. ', al, ' es el ángulo entre la escalera y la pared. ¿Cuál es el cateto adyacente a ', al, '?'],
      datos: [DL.cat, DL.ca],
      solucion: [
        { texto: 'Los catetos son la pared y el piso, que forman el ángulo recto.' },
        { texto: [al, ' está arriba, entre la escalera y la pared. El cateto que forma ', al, ' junto con la escalera es la pared: ', dF('2,4 m'), '.'] },
      ],
      respuesta: ['La pared: ', dF('2,4 m')] },
    { nivel: 1, titulo: 'La sombra del poste', figura: fig({ objeto: 'poste', sombra: true, medidas: { ra: 8, rb: 6 }, lados: t3('8 m', '6 m', '10 m'), angulos: { b: { texto: 'α' } } }),
      enunciado: ['Un poste de 6 m da una sombra de 8 m; el rayo de sol que roza su punta mide 10 m. ', al, ' es el ángulo entre el rayo y el poste. ¿Cuál es el cateto opuesto a ', al, '?'],
      datos: [DL.cat, DL.co],
      solucion: [
        { texto: 'El poste y la sombra forman el ángulo recto, en la base del poste.' },
        { texto: [al, ' está arriba, en la punta del poste. Frente a ', al, ', sin tocarlo, queda la sombra: ', dF('8 m'), '.'] },
      ],
      respuesta: ['La sombra: ', dF('8 m')] },
    { nivel: 2, titulo: 'Los dos opuestos', figura: fig({ objeto: 'escalera', medidas: { ra: 0.7, rb: 2.4 }, lados: t3('0,7 m', '2,4 m', '2,5 m'), angulos: { a: { texto: 'θ' }, b: { texto: 'α' } } }),
      enunciado: ['Una escalera de 2,5 m llega a 2,4 m de alto en una pared; su pie está a 0,7 m. ', thN, ' es su ángulo con el piso; ', al, ', con la pared. ¿Cuánto miden los opuestos a ', thN, ' y a ', al, '?'],
      datos: [DL.cat, DL.co],
      solucion: [
        { texto: [thN, ' está en el pie. Frente a ', thN, ' queda la pared: ', dF('2,4 m'), '.'] },
        { texto: [al, ' está arriba. Frente a ', al, ' queda el piso: ', dF('0,7 m'), '. Cada ángulo agudo tiene enfrente un cateto distinto.'] },
      ],
      respuesta: ['Opuesto a ', thN, ': ', dF('2,4 m'), '; opuesto a ', al, ': ', dF('0,7 m')] },
    { nivel: 2, titulo: 'La repisa y su tirante', figura: fig({ objeto: 'repisa', medidas: { ra: 40, rb: 30 }, lados: t3('40 cm', '30 cm', '50 cm'), angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una repisa tiene un brazo de 30 cm y un tirante de 50 cm, que baja hasta la pared 40 cm más abajo. ', thN, ' es el ángulo entre el tirante y la pared. ¿Cuál es el cateto opuesto a ', thN, '?'],
      datos: [DL.cat, DL.co],
      solucion: [
        { texto: 'El ángulo recto está arriba, donde el brazo toca la pared: los catetos son el brazo y la pared. El tirante es la hipotenusa.' },
        { texto: [thN, ' está abajo. Frente a ', thN, ' queda el brazo, que es horizontal y está arriba: ', dF('30 cm'), '. El opuesto no siempre es el lado vertical.'] },
      ],
      respuesta: ['El brazo: ', dF('30 cm')] },
    { nivel: 2, titulo: '¿Hasta dónde sube la escalera?', figura: fig({ objeto: 'escalera', medidas: { ra: 1.6, rb: 3 }, lados: { ra: { texto: '1,6 m' }, h: { texto: '3,4 m' } }, angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una escalera de 3,4 m se apoya en una pared con su pie a 1,6 m de ella. ', thN, ' es su ángulo con el piso. ¿Cuánto mide el cateto opuesto a ', thN, '?'],
      datos: [DL.co, DL.pita],
      solucion: [
        { texto: ['Frente a ', thN, ' queda la pared: el cateto opuesto es el tramo de pared del piso a la punta de la escalera. El piso, ', dI('1,6 m'), ', es el adyacente.'] },
        { texto: 'Con Pitágoras, el cateto que falta es la raíz de la hipotenusa al cuadrado menos el otro cateto al cuadrado.',
          ecuacion: [raizDif('3,4', '1,6', 'i'), ' = ', { raiz: ['11,56 − 2,56'] }, ' = √9 = ', dF('3 m')] },
      ],
      respuesta: ['La escalera llega a ', dF('3 m'), ' de alto en la pared'] },
    { nivel: 2, titulo: 'El cable visto desde arriba', figura: fig({ objeto: 'poste', medidas: { ra: 6, rb: 8 }, lados: t3('6 m', '8 m', '10 m'), angulos: { b: { texto: 'α' } } }),
      enunciado: ['Un cable de 10 m va de la punta de un poste de 8 m a una estaca, a 6 m del poste. ', al, ' está entre el cable y el poste. ¿Cuánto miden los catetos opuesto y adyacente a ', al, '?'],
      datos: [DL.co, DL.ca],
      solucion: [
        { texto: [al, ' está en la punta del poste: lo forman el cable y el poste. El poste es el cateto adyacente: ', dF('8 m'), '.'] },
        { texto: ['Frente a ', al, ', sin tocarlo, queda el suelo, de la base a la estaca: es el cateto opuesto, ', dF('6 m'), '.'] },
      ],
      respuesta: ['Opuesto a ', al, ': ', dF('6 m'), '; adyacente a ', al, ': ', dF('8 m')] },
    { nivel: 2, titulo: 'La base de la rampa', figura: fig({ objeto: 'rampa', medidas: { ra: 2.4, rb: 0.7 }, lados: { rb: { texto: '0,7 m' }, h: { texto: '2,5 m' } }, angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una rampa de 2,5 m sube 0,7 m, desde el piso hasta la puerta de un almacén. ', thN, ' es su ángulo con el piso. ¿Cuánto mide el cateto adyacente a ', thN, '?'],
      datos: [DL.ca, DL.pita],
      solucion: [
        { texto: [thN, ' está abajo: lo forman la rampa, que es la hipotenusa, y la base en el piso. El cateto adyacente es la base.'] },
        { texto: 'Con Pitágoras, la base es la raíz de la rampa al cuadrado menos la altura al cuadrado.',
          ecuacion: [raizDif('2,5', '0,7', 'o'), ' = ', { raiz: ['6,25 − 0,49'] }, ' = √5,76 = ', dF('2,4 m')] },
      ],
      respuesta: ['La base: ', dF('2,4 m')] },
    { nivel: 3, titulo: 'La sombra vista desde arriba', figura: fig({ objeto: 'poste', sombra: true, medidas: { ra: 6, rb: 4.5 }, lados: { rb: { texto: '4,5 m' }, h: { texto: '7,5 m' } }, angulos: { b: { texto: 'α' } } }),
      enunciado: ['Un poste de 4,5 m da sombra. El rayo de sol que roza su punta mide 7,5 m hasta el final de la sombra. ', al, ' está entre el rayo y el poste. ¿Cuánto mide el cateto opuesto a ', al, '?'],
      datos: [DL.co, DL.pita],
      solucion: [
        { texto: [al, ' está arriba: lo forman el rayo y el poste. Frente a ', al, ' queda la sombra. El poste es vertical, pero toca a ', al, ': no es su opuesto.'] },
        { texto: 'La sombra es un cateto y el rayo, la hipotenusa. Con Pitágoras:',
          ecuacion: [raizDif('7,5', '4,5', 'i'), ' = ', { raiz: ['56,25 − 20,25'] }, ' = √36 = ', dF('6 m')] },
      ],
      respuesta: ['La sombra: ', dF('6 m')] },
    { nivel: 3, titulo: 'Una medida con dos nombres', figura: fig({ objeto: 'escalera', medidas: { ra: 1, rb: 2.4 }, lados: { h: { texto: '2,6 m' } }, angulos: { a: { texto: 'θ' }, b: { texto: 'α' } } }),
      enunciado: ['Una escalera de 2,6 m se apoya en una pared. ', thN, ' es su ángulo con el piso; ', al, ', con la pared. El opuesto a ', thN, ' mide 2,4 m. ¿Cuánto miden el adyacente a ', al, ' y el opuesto a ', al, '?'],
      datos: [DL.co, DL.ca, DL.pita],
      solucion: [
        { texto: ['Frente a ', thN, ', que está en el pie, queda la pared: mide ', dO('2,4 m'), '. La pared forma ', al, ' junto con la escalera: es el adyacente a ', al, ', ', dF('2,4 m'), '.'] },
        { texto: ['El opuesto a ', al, ' es el piso. Sale de Pitágoras, con la escalera como hipotenusa:'],
          ecuacion: [raizDif('2,6', '2,4', 'o'), ' = ', { raiz: ['6,76 − 5,76'] }, ' = √1 = ', dF('1 m')] },
      ],
      respuesta: ['Adyacente a ', al, ': ', dF('2,4 m'), '; opuesto a ', al, ': ', dF('1 m')] },
    { nivel: 3, titulo: 'La chacra triangular', figura: fig({ objeto: 'chacra', medidas: { ra: 90, rb: 120 }, lados: t3('90 m', '120 m', '150 m'), angulos: { b: { texto: 'θ' } } }),
      enunciado: ['Una chacra tiene forma de triángulo rectángulo, con lados de 90 m, 120 m y 150 m. ', thN, ' es el ángulo de la esquina que queda frente al lado de 90 m. ¿Cuánto mide el cateto adyacente a ', thN, '?'],
      datos: [DL.h, DL.ca],
      solucion: [
        { texto: 'La hipotenusa es el lado más largo: 150 m. Los catetos son los otros dos, 90 m y 120 m.' },
        { texto: ['La esquina de ', thN, ' queda frente al lado de 90 m, así que la tocan los lados de 120 m y 150 m.'] },
        { texto: ['De esos dos, 150 m es la hipotenusa. El cateto adyacente es el otro: ', dF('120 m'), '. Tocar a ', thN, ' no basta: también tiene que ser cateto.'] },
      ],
      respuesta: [dF('120 m')] },
    // Nivel de examen de verdad (lector en frío, 17 nov: sin cuentas, «como examen es poco»): falta un lado.
    { nivel: 3, titulo: 'Recto en Q', figura: fig({ objeto: 'triangulo', medidas: { ra: 20, rb: 21 }, giro: 25, vertices: { r: 'Q', a: 'P', b: 'R' }, lados: { ra: { texto: '20' }, h: { texto: '29' } }, angulos: { b: {} } }),
      enunciado: 'En el triángulo PQR, recto en Q, PQ = 20 y PR = 29. ¿Cuánto miden el cateto opuesto y el cateto adyacente al ángulo R?',
      datos: [DL.seg('P', 'Q'), DL.recto('Q'), DL.co, DL.ca, DL.pita],
      solucion: [
        { texto: 'El ángulo recto está en Q: los catetos son los dos lados que pasan por Q, PQ y QR. PR es la hipotenusa.' },
        { texto: ['Frente a R, sin tocarlo, queda PQ: ', dF('20'), '. El ángulo R lo forman QR y PR: el adyacente es QR, que no se conoce.'] },
        { texto: 'QR sale de Pitágoras, con PR como hipotenusa:', ecuacion: [raizDif('29', '20', 'o'), ' = ', { raiz: ['841 − 400'] }, ' = √441 = ', dF('21')] },
      ],
      respuesta: ['Opuesto a R: ', dF('PQ = 20'), '; adyacente a R: ', dF('QR = 21')] },
    { nivel: 3, titulo: 'La suma en la repisa', figura: fig({ objeto: 'repisa', medidas: { ra: 20, rb: 15 }, lados: { ra: { texto: '20 cm' }, h: { texto: '25 cm' } }, angulos: { a: { texto: 'θ' }, b: { texto: 'α' } } }),
      enunciado: ['El tirante de una repisa mide 25 cm y llega a la pared 20 cm bajo el brazo. ', thN, ' y ', al, ' son los ángulos marcados. ¿Cuánto suman el opuesto a ', thN, ' y el adyacente a ', al, '?'],
      datos: [DL.co, DL.ca, DL.pita],
      solucion: [
        { texto: ['Frente a ', thN, ' queda el brazo. ', al, ' lo forman el tirante y el brazo: su adyacente también es el brazo. Se suma dos veces el mismo lado.'] },
        { texto: 'El brazo es un cateto; el tirante, la hipotenusa. Con Pitágoras:', ecuacion: [raizDif('25', '20', 'i'), ' = ', { raiz: ['625 − 400'] }, ' = √225 = 15 cm'] },
        { texto: 'La suma:', ecuacion: ['15 cm + 15 cm = ', dF('30 cm')] },
      ],
      respuesta: [dF('30 cm')] },
  ];

  // «Ahora tú», tipo 1: el triángulo de examen, con vértices nombrados (sin A, B, C ni H: «CA» se leería como un lado).
  const LETRAS = [['P', 'Q', 'R'], ['M', 'N', 'T'], ['D', 'E', 'F'], ['K', 'L', 'S']];
  const segN = (x, y) => [x, y].sort().join('');
  // Se pide el par (opuesto y adyacente): con un solo lado había tres respuestas posibles y salían tres opciones
  // (auditoría, 17 nov). Con el par salen cinco; quedan la correcta y tres de los cuatro errores, al azar.
  const tresDe = (r, xs) => { const ys = xs.slice(); ys.splice(r.ent(0, ys.length - 1), 1); return ys; };
  function casoVertices(r) {
    const ls = r.uno(LETRAS), orden = r.uno([[0, 1, 2], [1, 0, 2], [2, 0, 1], [1, 2, 0]]);
    const V = { r: ls[orden[0]], a: ls[orden[1]], b: ls[orden[2]] };
    const [ra, rb] = r.uno([[3, 4], [5, 12], [8, 15], [4, 3], [12, 5]]);
    const giro = r.uno([20, 75, 140, 200, 250, 315]);
    const en = r.uno(['a', 'b']);
    const seg = { ra: segN(V.r, V.a), rb: segN(V.r, V.b), h: segN(V.a, V.b) };
    const ds = desde(en), co = seg[ds.co], ca = seg[ds.ca], h = seg.h, X = V[en];
    const par = (p, q) => `CO = ${p}; CA = ${q}`;
    const ops = [{ id: 'c', texto: par(co, ca), correcta: true }].concat(tresDe(r, [
      { id: 'cambia', texto: par(ca, co), error: 'TR9', siFuera: `${co} y ${ca} son los catetos, bien; pero ${ca} pasa por ${X}: lo toca. El opuesto queda enfrente.` },
      { id: 'toca', texto: par(co, h), error: 'LAD-TOCA-H', siFuera: `El opuesto está bien. ${h} también pasa por ${X}, pero no por ${V.r}: es la hipotenusa.` },
      { id: 'hip', texto: par(h, ca), error: 'LAD-HIPOTENUSA', siFuera: `El adyacente está bien. Pero ${h} pasa por ${X}: no queda enfrente. Es la hipotenusa.` },
      { id: 'sinrecto', texto: par(ca, h), error: 'LAD-SIN-RECTO', siFuera: `${ca} y ${h} tocan a ${X}, es cierto; pero los catetos pasan por el recto, ${V.r}.` },
    ]));
    return {
      pregunta: `En el triángulo ${ls.join('')}, recto en ${V.r}, ¿cuáles son el cateto opuesto y el adyacente al ángulo ${X}?`,
      datos: [DL.seg(...[V.r, V.a].sort()), DL.recto(V.r), DL.co, DL.ca],
      dibujo: { datos: { objeto: 'triangulo', medidas: { ra, rb }, giro, vertices: V, angulos: { [en]: {} } }, estado: {} },
      opciones: ops,
      solucion: { texto: `Los catetos pasan por ${V.r}. ${ca} pasa por ${X}: es el adyacente. ${co}, no: es el opuesto.` },
    };
  }
  // «Ahora tú», tipo 0: los largos del opuesto y del adyacente de un objeto (los tres largos a la vista, en tinta).
  function casoNombrar(r) {
    const o = r.uno(OBJS), [ra, rb, hh] = r.uno(o.ternas), val = { ra, rb, h: hh }, en = r.uno(['a', 'b']);
    const ds = desde(en), L = x => largoTxt(x, o.u);
    const par = (p, q) => `Opuesto: ${L(val[p])}; adyacente: ${L(val[q])}`;
    const vertical = o.vertical === ds.ca;
    const ops = [{ id: 'c', texto: par(ds.co, ds.ca), correcta: true }].concat(tresDe(r, [
      vertical
        ? { id: 'cambia', texto: par(ds.ca, ds.co), error: 'TR7', siFuera: `Elegiste los catetos, bien; ${o[ds.ca]} es vertical, pero toca a θ: es el adyacente.` }
        : { id: 'cambia', texto: par(ds.ca, ds.co), error: 'TR9', siFuera: `Elegiste los catetos, bien; pero ${o[ds.ca]} toca a θ: es el adyacente.` },
      { id: 'toca', texto: par(ds.co, 'h'), error: 'LAD-TOCA-H', siFuera: `El opuesto está bien. ${cap(o.h)} también toca a θ; pero es la hipotenusa.` },
      { id: 'hip', texto: par('h', ds.ca), error: 'LAD-HIPOTENUSA', siFuera: `El adyacente está bien. Pero ${o.h} toca a θ: es la hipotenusa.` },
      { id: 'sinrecto', texto: par(ds.ca, 'h'), error: 'LAD-SIN-RECTO', siFuera: `${cap(o[ds.ca])} y ${o.h} tocan a θ, es cierto; pero los catetos forman el recto.` },
    ]));
    return {
      pregunta: [`${o.intro} `, thN, ` es el ángulo ${o[en]}. ¿Cuánto miden el cateto opuesto y el adyacente a `, thN, '?'],
      datos: [DL.cat, DL.h, DL.co, DL.ca],
      dibujo: figO(o, ra, rb, t3(L(ra), L(rb), L(hh)), { [en]: { texto: 'θ' } }),
      opciones: ops,
      solucion: { texto: `Opuesto, frente a θ: ${o[ds.co]}, ${L(val[ds.co])}. Adyacente, el cateto que lo toca: ${o[ds.ca]}, ${L(val[ds.ca])}.` },
    };
  }
  // «Ahora tú», tipo 2 (nivel de examen): se dan la hipotenusa y un cateto; se pregunta desde θ o desde α, o una suma de
  // dos nombres que pueden ser el mismo lado. El cateto que falta sale de Pitágoras.
  function casoExamen(r) {
    const o = r.uno(OBJS), [ra, rb, hh] = r.uno(o.ternas), val = { ra, rb, h: hh };
    const thEn = r.uno(['a', 'b']), alEn = thEn === 'a' ? 'b' : 'a';
    const dado = r.uno(['ra', 'rb']), falta = dado === 'ra' ? 'rb' : 'ra';
    const nombres = { 'co-t': desde(thEn).co, 'ca-t': desde(thEn).ca, 'co-a': desde(alEn).co, 'ca-a': desde(alEn).ca };
    const txt = { 'co-t': ['el cateto opuesto a ', thN], 'ca-t': ['el cateto adyacente a ', thN], 'co-a': ['el cateto opuesto a ', al], 'ca-a': ['el cateto adyacente a ', al] };
    const L = x => largoTxt(x, o.u);
    const pitS = Math.sqrt(hh * hh + val[dado] * val[dado]);
    const forma = r.uno(['uno', 'uno', 'suma']);
    let pide, correcta, ops, sol;
    if (forma === 'uno') {
      const q = r.uno(['co-a', 'ca-a', 'co-a', 'co-t']), k = nombres[q], otro = k === 'ra' ? 'rb' : 'ra', deAlfa = q.endsWith('-a');
      pide = ['¿Cuánto mide ', ...txt[q], '?'];
      correcta = val[k];
      ops = opciones(correcta, [
        { id: 'otro', valor: val[otro], error: deAlfa ? 'LAD-NO-CAMBIA' : 'TR9', siFuera: deAlfa ? 'Nombrar desde θ está bien; pero se pregunta desde α, y desde α los catetos se intercambian.' : 'Elegiste un cateto, bien; pero es el otro: el opuesto queda enfrente y el adyacente toca al ángulo.' },
        { id: 'hip', valor: hh, error: 'LAD-HIPOTENUSA', siFuera: 'La hipotenusa también está en el triángulo, pero no es cateto: queda frente al ángulo recto.' },
        { id: 'suma', valor: pitS, error: 'PIT-SUMA', siFuera: 'Pitágoras es la herramienta; pero la hipotenusa es la mayor: el cateto sale restando los cuadrados.' },
      ], L);
      sol = k === dado
        ? { texto: [`Ese cateto es ${o[k]}, el que ya mide ${L(val[k])}: no hace falta Pitágoras.`] }
        : { texto: [`Ese cateto es ${o[k]}, el que falta. Con Pitágoras:`], ecuacion: [raizDif(f(hh), f(val[dado])), ' = ', dF(L(val[k]))] };
    } else {
      const par = r.uno([['co-t', 'ca-a'], ['co-t', 'co-a'], ['ca-t', 'co-a'], ['ca-t', 'ca-a']]), k1 = nombres[par[0]], k2 = nombres[par[1]];
      pide = ['¿Cuánto suman ', ...txt[par[0]], ' y ', ...txt[par[1]], '?'];
      correcta = val[k1] + val[k2];
      const malo = k1 === k2 ? ra + rb : 2 * val[k1];
      ops = opciones(correcta, [
        { id: 'cambia', valor: malo, error: 'LAD-NO-CAMBIA', siFuera: k1 === k2 ? 'Cada nombre está bien buscado; pero desde α los catetos se intercambian: los dos nombres son el mismo lado.' : 'Cada nombre está bien buscado; pero desde α los catetos se intercambian: son dos lados distintos.' },
        { id: 'hip', valor: val[k1] + hh, error: 'LAD-HIPOTENUSA', siFuera: 'Sumar es lo que se pide; pero la hipotenusa no es cateto: queda frente al ángulo recto.' },
        { id: 'suma', valor: k1 === k2 ? 2 * pitS : pitS + val[dado], error: 'PIT-SUMA', siFuera: 'Pitágoras es la herramienta; pero la hipotenusa es la mayor: el cateto sale restando los cuadrados.' },
      ], L);
      sol = k1 === k2
        ? { texto: [`Los dos nombres son ${o[k1]}: se suma dos veces.`], ecuacion: [`${L(val[k1])} + ${L(val[k1])} = `, dF(L(correcta))] }
        : { texto: [`Son los dos catetos, ${o.ra} y ${o.rb}; el que falta sale de Pitágoras.`], ecuacion: [`${L(ra)} + ${L(rb)} = `, dF(L(correcta))] };
    }
    return {
      pregunta: [`En la figura, ${o.h} mide ${L(hh)} y ${o[dado]}, ${L(val[dado])}. `, ...pide],
      datos: [DL.co, DL.ca, DL.pita],
      dibujo: figO(o, ra, rb, { [dado]: { texto: L(val[dado]) }, h: { texto: L(hh) } }, { [thEn]: { texto: 'θ' }, [alEn]: { texto: 'α' } }),
      opciones: ops,
      solucion: sol,
    };
  }

  const ladosDesdeAngulo = {
    id: 'lados-desde-angulo',
    titulo: 'Los lados se nombran desde θ',
    pregunta: '¿Qué cateto es el opuesto si miras desde el otro ángulo agudo?',
    temas: ['Definición en el triángulo rectángulo'],
    pieza: OB,
    aprendizaje: 'La hipotenusa queda frente al ángulo recto; el opuesto, frente al ángulo que miras, y el adyacente lo toca. Desde el otro agudo, se intercambian.',
    actividad: 'Correr el pie de una escalera de 5 m apoyada en una pared.',
    // Lee: el objeto y el vocabulario (catetos, hipotenusa, opuesto y adyacente desde θ), sin decir qué pasa desde α.
    lee: {
      tarjetas: [
        // Sin colores: todavía no hay nombres que pintar (lector en frío, 17 nov: «los colores no se explican»). θ se
        // presenta aquí, porque ya está en el título.
        { titulo: 'Una escalera en la pared', texto: ['Una escalera apoyada en una pared forma un triángulo con la pared y el piso. Pared y piso se juntan en un ángulo recto, de 90°, marcado con un cuadradito. ', thN, ', la letra griega theta, es el ángulo entre la escalera y el piso.'],
          pieza: OB, dibujo: { datos: { objeto: 'escalera', medidas: { piso: 3, pared: 4 }, marco: [4.5, 5], angulos: { pie: { texto: 'θ' } } }, estado: {} } },
        { titulo: 'Catetos e hipotenusa', texto: 'Los dos lados que forman el ángulo recto se llaman catetos: aquí, la pared y el piso. El lado de enfrente del ángulo recto es la hipotenusa, H: aquí, la escalera. Pitágoras los une.',
          ecuacion: ['Pitágoras: ', cuad('H'), ' = ', cuad('cateto'), ' + ', cuad('cateto')] },
        { titulo: 'Opuesto y adyacente', texto: ['Los catetos se nombran desde un ángulo agudo, el que miras: aquí, ', thN, '. El que toca a ', thN, ' es el adyacente, ', dI('CA'), ', en turquesa. El que queda frente a ', thN, ', sin tocarlo, es el opuesto, ', dO('CO'), ', en naranja.'],
          pieza: OB, dibujo: { datos: { objeto: 'escalera', medidas: { piso: 3, pared: 4 }, marco: [4.5, 5], lados: { escalera: { texto: 'H' }, pared: { color: 'o', texto: 'CO' }, piso: { color: 'i', texto: 'CA' } }, angulos: { pie: { texto: 'θ' } } }, estado: {} } },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a correr el pie de una escalera de 5 m. Mira qué lado toca a ', thN, ', cuál queda enfrente y cuál es siempre el más largo.'] },
      ],
    },
    ejemplos: EJEMPLOS_LADOS,
    juega: {
      pieza: OB,
      consigna: ['Una escalera de 5 m está apoyada en la pared de una casa. ', thN, ' es el ángulo entre la escalera y el piso.'],
      mision: {
        texto: 'Corre el pie de la escalera hasta que el cateto adyacente a θ mida 3 m.',
        logrado: val => Math.abs(val.pie - 3) < 1e-9,
        bien: 'Listo: el piso toca a θ y mide 3 m. La escalera es la hipotenusa.',
      },
      voz: '¿Qué lado toca a θ y cuál queda enfrente?',
      leyenda: [
        { s: thN, t: 'ángulo entre la escalera y el piso' },
        { s: dO('naranja'), t: 'el cateto opuesto a θ: queda enfrente' },
        { s: dI('turquesa'), t: 'el cateto adyacente a θ: lo toca' },
        { s: '∟', t: 'ángulo recto, de 90°' },
        { s: '≈', t: 'aproximado, redondeado' },
      ],
      controles: [
        { id: 'pie', etiqueta: 'Piso: del pie a la pared', color: 'c-i', min: 1, max: 4.5, paso: 0.5, inicio: 1.5, unidad: 'm', decimales: 1 },
      ],
      // Gesto directo: el pie se arrastra por el piso; la escala está fija (marco), así que sigue al dedo.
      arrastres: [{ id: 'pie', etiqueta: 'pie de la escalera: se corre por el piso', color: 'c-i',
        donde: v => { const g = TO().geometria(escJ(v)); return { x: g.a[0], y: g.a[1] }; },
        mover: (pt, v) => { const g = TO().geometria(escJ(v)); return { pie: (g.r[0] - pt.x) / g.s }; } }],
      dibujo: v => ({ datos: escJ(v), estado: {} }),
      // La relación, sin «y > piso» (lector en frío, 17 nov: se leía raro).
      lectura: v => ['Escalera 5 m, la más larga: pared ', dO(largoTxt(altoEsc(v.pie))), ', piso ', dI(largoTxt(v.pie))],
      minimo: 3,
    },
    predice: {
      pregunta: ['Ahora miras desde ', al, ', el ángulo de arriba, entre la escalera y la pared. ¿Cuál es el cateto opuesto a ', al, '?'],
      datos: ['Escalera: 5 m', 'Pared, del piso hasta donde se apoya la escalera: 4 m', 'Piso, del pie de la escalera hasta la pared: 3 m'],
      voz: 'Ubica α. ¿Qué cateto lo toca y cuál queda enfrente?',
      opciones: [
        { id: 'c', texto: 'El piso, de 3 m', correcta: true },
        { id: 'vertical', texto: 'La pared, de 4 m', error: 'TR7', siFuera: 'La pared queda frente a θ, es cierto. Pero α está arriba, y la pared lo toca.' },
        { id: 'escalera', texto: 'La escalera, de 5 m', error: 'LAD-HIPOTENUSA', siFuera: 'Buscar un lado lejos de α está bien; pero la escalera forma α: lo toca. Es la hipotenusa.' },
        { id: 'piso', texto: 'Ninguno: α no está en el piso', error: 'LAD-SOLO-PISO', siFuera: 'Es cierto que α no toca el piso. Justo por eso el piso es el cateto que tiene enfrente.' },
      ],
      // Los colores son los del juego (desde θ): no delatan nada desde α. Al revelar, cada cateto suma su nombre desde α.
      dibujo: { datos: ESC345(), estado: {} },
      revelar: { datos: ESC345({ pared: 'CO de θ = 4 m', pared2: 'CA de α', piso: 'CA de θ = 3 m', piso2: 'CO de α' }), estado: {} },
      coincide: 'Coincide: el piso queda frente a α. Desde arriba, los catetos cambian de nombre.',
      noCoincide: 'Revisemos: α lo forman la escalera y la pared. Frente a α queda el piso.',
    },
    mira: {
      pieza: OB,
      // Cada cateto toma su color cuando se nombra; desde α, el rótulo suma el otro nombre (la regla muestra el final:
      // «CO de θ = 4 m» y «CA de α» en la pared, el mismo lado con dos nombres; lector en frío, 17 nov).
      datos: ESC345({ h: [{ t: '5 m' }, { t: 'H = 5 m', paso: 1 }], piso: [{ t: '3 m' }, { t: 'CA = 3 m', paso: 2 }, { t: 'CA de θ = 3 m', paso: 4 }], pared: [{ t: '4 m' }, { t: 'CO = 4 m', paso: 3 }, { t: 'CO de θ = 4 m', paso: 4 }],
        pisoC: [{ c: 'i', paso: 2 }], paredC: [{ c: 'o', paso: 3 }], piso2: [{ t: 'CO de α', paso: 4 }], pared2: [{ t: 'CA de α', paso: 4 }], pasoAlfa: 4 }),
      voz: 'Primero el ángulo recto; después, el ángulo desde el que miras.',
      pasos: [
        { estado: { paso: 0 }, texto: 'El ángulo recto está en el rincón, entre la pared y el piso.' },
        { estado: { paso: 1 }, texto: 'Frente al ángulo recto queda la escalera: es la hipotenusa, el lado más largo.', ecuacion: ['H = 5 m'] },
        { estado: { paso: 2 }, texto: ['Desde ', thN, ', el piso toca a ', thN, ': es el cateto adyacente.'], ecuacion: [dI('CA'), ' = ', dI('3 m')] },
        { estado: { paso: 3 }, texto: ['La pared queda frente a ', thN, ', sin tocarlo: es el cateto opuesto.'], ecuacion: [dO('CO'), ' = ', dO('4 m')] },
        { estado: { paso: 4 }, texto: ['Ahora desde ', al, ', arriba: la pared toca a ', al, ' y el piso queda enfrente.'], ecuacion: [junto([dI('CA'), ' de ', al, ' = pared = ', dO('4 m')]), SEP, junto([dO('CO'), ' de ', al, ' = piso = ', dI('3 m')])] },
        { estado: { paso: 4 }, texto: 'Cada cateto tiene dos nombres, uno por agudo. La hipotenusa sigue siendo la escalera.', ecuacion: [junto([dO('CO'), ' de ', thN, ' = ', dI('CA'), ' de ', al, ' = ', dO('4 m')])] },
      ],
    },
    mundo: MUNDO.lados,
    regla: {
      texto: 'La hipotenusa es el lado frente al ángulo recto, el más largo. Desde un ángulo agudo, el cateto que lo toca es el adyacente; el de enfrente, el opuesto.',
      ecuacion: [junto(['Desde ', thN, ': ', dI('CA'), ' toca a ', thN]), SEP, junto([dO('CO'), ' queda frente a ', thN]), SEP, junto(['H queda frente a 90°'])],
      condicion: 'el triángulo es rectángulo. Desde el otro agudo, α, opuesto y adyacente se intercambian: el lado cambia de nombre. La hipotenusa, no.',
      voz: 'Ubica primero el ángulo recto; después, el ángulo que miras.',
    },
    // Así se resuelve: nombrar los tres lados de un objeto desde un ángulo (desde α en las semillas pares). «Ahora tú»
    // pide otra cosa: un largo por su nombre, en un objeto, en un triángulo de examen o con Pitágoras.
    resuelve: {
      pieza: OB,
      generar(s) {
        const r = azar(s + 900), o = r.uno(OBJS), [ra, rb, hh] = r.uno(o.ternas), val = { ra, rb, h: hh };
        const en = s % 2 === 0 ? 'b' : 'a', ang = en === 'b' ? al : thN, ds = desde(en), L = x => largoTxt(x, o.u);
        const cuadra = `${f(ra)}² + ${f(rb)}² = ${f(ra * ra, 4)} + ${f(rb * rb, 4)} = ${f(hh * hh, 4)} = ${f(hh)}²`;
        return {
          enunciado: [`${o.intro} `, ang, ` es el ángulo ${o[en]}. Nombra los tres lados desde `, ang, ': cateto opuesto, cateto adyacente e hipotenusa.'],
          datos: [DL.h, DL.co, DL.ca],
          dibujo: figO(o, ra, rb, t3(L(ra), L(rb), L(hh)), { [en]: { texto: en === 'b' ? 'α' : 'θ' } }),
          pasos: [
            { tipo: 'pide', texto: ['Piden el nombre de cada lado, mirando desde ', ang, `, el ángulo ${o[en]}.`] },
            { tipo: 'datos', texto: `Los lados miden ${L(ra)}, ${L(rb)} y ${L(hh)}. El ángulo recto lo forman ${o.ra} y ${o.rb}.` },
            { tipo: 'regla', texto: ['La hipotenusa queda frente al ángulo recto. Desde ', ang, ', el cateto que lo toca es el adyacente; el de enfrente, el opuesto.'] },
            { tipo: 'aplica', texto: [`${cap(o.h)} queda frente al ángulo recto: es la hipotenusa. ${cap(o[ds.ca])} forma `, ang, ` junto con la hipotenusa: es el adyacente. ${cap(o[ds.co])} queda enfrente: es el opuesto.`] },
            { tipo: 'sentido', texto: `La hipotenusa, ${L(hh)}, es el lado más largo. Y cuadra con Pitágoras: ${cuadra}.` },
          ],
          respuesta: ['Opuesto a ', ang, `: ${L(val[ds.co])}; adyacente: ${L(val[ds.ca])}; hipotenusa: ${L(hh)}`],
        };
      },
    },
    ahoraTu: {
      pieza: OB,
      voz: 'Ubica el ángulo recto y el ángulo que te piden.',
      generar(sem) {
        const r = azar(sem + 31);
        return conCuatro([casoNombrar, casoVertices, casoExamen][sem % 3], r);
      },
    },
  };

  // ---------- Idea 2 (rehecha, 17 nov): una razón es un cociente ----------
  // Propuesta aprobada (docs/etapa2/propuesta-trigonometria.md §1–§6 y decisiones.md). Objeto de la primera pantalla: un
  // poste de 6 m y tu primo de 1,5 m con sus sombras a la misma hora (pieza trig-objeto, objeto «sombras»).
  // Cambia: la sombra del poste (el sol sube o baja). · Permanece: las dos alturas y que los rayos son paralelos.
  // Progresa: altura ÷ sombra en la lectura. · Se reserva: altura ÷ rayo (el seno) del poste y del primo (la predicción).
  // Debe verse: con el mismo θ, el triángulo grande y el chico dan el mismo cociente.
  // Colores (regla de la unidad, igual en «Lee», juego, predicción, «Mira», regla y ejercicios): la altura (CO), naranja;
  // la sombra (CA), turquesa; el rayo (H), en tinta; el cociente, violeta; θ, carmín. Antes el rayo pasaba a turquesa en
  // la predicción y la sombra a tinta (lector en frío, 17 nov: el turquesa era sombra, rayo y otra vez sombra).
  // Errores (TR7, TR8 y TR9 de docs/investigacion/trigonometria-ideas-erroneas.md; el resto, hipótesis): TR8 la razón
  // depende del tamaño, RAZ-CHICO el triángulo chico tiene mayor cociente, TR9 elige otra razón (aquí: altura ÷ sombra),
  // TR7 da un largo y no un cociente, REC-INVERSA pone el cociente al revés, PIT-LINEAL toma H = CO + CA o CA = H − CO,
  // TAN-H toma el denominador de la tangente por la hipotenusa, MEDIO-ENTERO usa el lado entero y no su mitad, ANG-OTRO
  // nombra los lados desde el otro ángulo agudo.
  // Colores por nombre del lado (regla de la unidad): op, el cateto opuesto; ad, el adyacente; res, el resultado. La
  // hipotenusa va sin envoltorio, en tinta.
  const op = t => dO(t), ad = t => dI(t), res = t => dF(t);
  const sen = ['sen ', thN], cos = ['cos ', thN], tan = ['tan ', thN];
  // Fracción simplificada de dos largos (también con decimales: 1,5/2,5 = 3/5), como texto «3/5» o parte de ecuación.
  const simpl = (p, q) => { const P = Math.round(p * 1000), Q = Math.round(q * 1000), m = gcd(P, Q); return [P / m, Q / m]; };
  const frTxt = (p, q) => { const [a, b] = simpl(p, q); return b === 1 ? `${a}` : `${a}/${b}`; };
  const frEc = (p, q, c) => { const [a, b] = simpl(p, q); const x = b === 1 ? `${a}` : { frac: [`${a}`, `${b}`] }; return c ? { v: c, t: b === 1 ? `${a}` : `${a}/${b}` } : x; };
  // El valor decimal de un cociente: «0,75» si es exacto con tres decimales; si no, «≈ 0,857».
  const decTxt = x => `${Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-6 ? '' : '≈ '}${f(x, 3)}`;
  const DR = {
    razones: [junto(['sen ', thN, ' = ', { frac: [op('CO'), 'H'] }]), SEP, junto(['cos ', thN, ' = ', { frac: [ad('CA'), 'H'] }]), SEP, junto(['tan ', thN, ' = ', { frac: [op('CO'), ad('CA')] }])],
    // Sin θ: también vale cuando la figura trae α (lector en frío, 17 nov: «los datos hablan de θ y en el dibujo hay α»).
    letras: [op('CO'), ': cateto opuesto al ángulo; ', ad('CA'), ': cateto adyacente; H: hipotenusa.'],
    medio: 'Punto medio de un lado: lo parte en dos mitades iguales.',
  };

  // El juego: el poste de 6 m y tu primo de 1,5 m; la sombra del poste va de 4 a 10 m (marco fijo: el dedo sigue a la
  // punta de la sombra). La sombra del primo se ve con «?» hasta que la misión se cumple.
  const PRIMO = 1.5, POSTE = 6;
  const somb = (sombra, lados, o = {}) => ({ objeto: 'sombras', marco: [10, 6], medidas: { sombra, poste: o.poste || POSTE }, primo: o.primo || PRIMO,
    lados, angulos: { suelo: { texto: 'θ' }, suelo2: {} }, nota: o.nota });
  const sombJ = v => somb(v.sombra, { poste: { color: 'o', texto: '6 m' }, sombra: { color: 'i', texto: `${f(v.sombra)} m` },
    primo: { color: 'o', texto: '1,5 m' }, sombra2: { color: 'i', texto: v.sombra === 8 ? '2 m' : '?' } });
  // Predicción: los mismos colores del juego, y el largo de los dos rayos a la vista y en los datos (lector en frío, 17 nov:
  // sin él había que usar Pitágoras, que la idea no nombra al predecir).
  const sombP = o => somb(8, { poste: { color: 'o', texto: '6 m' }, sombra: { color: 'i', texto: '8 m' }, rayo: { texto: '10 m' },
    primo: { color: 'o', texto: '1,5 m' }, sombra2: { color: 'i', texto: '2 m' }, rayo2: { texto: '2,5 m' } }, { nota: o ? '6 ÷ 10 = 1,5 ÷ 2,5 = 0,6' : undefined });

  // Ejemplos resueltos de «Una razón es un cociente» (molde §3). Cuentas rehechas con un script aparte, sin el código de
  // la unidad (scratchpad e2-trig-resto/cuentas-idea2.js): 2,4/2,5 = 24/25; 0,4/5 = 0,08 (8 %); 6/10 = 3/5; 4,5/6 = 3/4;
  // 5/13; √(1,2² + 0,5²) = 1,3 y 0,5/1,3 = 5/13; √(3,4² − 1,6²) = 3 y 3/1,6 = 15/8; 0,6/0,8 = 1,5/x → x = 2;
  // 1,6/2 = h/7,5 → h = 6; 6/10 + 8/10 = 7/5; tan = 8/15 → H = 17, (8 + 15)/17 = 23/17; sen = 5/13 → CA = 12, tan = 5/12;
  // rectángulo 12 × 5 → diagonal 13, cos = 12/13; cuadrado de 4 con M → tan = 2/4 = 1/2; sen = 0,28 = 7/25 → CA = 24,
  // tan = 7/24. La figura muestra el planteamiento: lo que se pide va con «?» o en tinta.
  const tres = (ra, rb, h) => ({ ra, rb, h });
  const L2 = (texto, color) => (color ? { texto, color } : { texto });
  const EJEMPLOS_RAZON = [
    { nivel: 1, titulo: 'El seno en la escalera',
      figura: fig({ objeto: 'escalera', medidas: { ra: 0.7, rb: 2.4 }, lados: tres(L2('0,7 m', 'i'), L2('2,4 m', 'o'), L2('2,5 m')), angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una escalera de 2,5 m llega a 2,4 m de altura en una pared; su pie está a 0,7 m. ', thN, ' es su ángulo con el piso. ¿Cuánto vale sen ', thN, '?'],
      datos: [DR.razones, DR.letras],
      solucion: [
        { texto: ['Desde ', thN, ', en el pie, el opuesto es la pared, ', op('2,4 m'), ', y la hipotenusa es la escalera, ', '2,5 m', '.'] },
        { texto: 'El seno divide esos dos lados; los metros se cancelan.', ecuacion: [...sen, ' = ', { frac: [op('2,4'), '2,5'] }, ' = ', { frac: ['24', '25'] }, ' = ', res('0,96')] },
      ],
      respuesta: [...sen, ' = ', res('24/25 = 0,96')] },
    // La pendiente es la tangente por 100 (apertura, 28 nov; la apertura usa 12 %, 100 %, 50 % y 200 %): 0,4/5 = 0,08 y
    // 0,08 · 100 = 8 %, rehecho aparte. Reemplaza «La tangente de la rampa» (0,7/2,4 = 7/24). La figura sube 1,25 m en vez
    // de 0,4 m (a escala salía plana y los rótulos se pisaban): por eso el enunciado dice que no está a escala.
    { nivel: 1, titulo: 'La pendiente de la rampa',
      figura: fig({ objeto: 'rampa', medidas: { ra: 5, rb: 1.25 }, lados: { ra: L2('5 m', 'i'), rb: L2('0,4 m', 'o') }, angulos: { a: { texto: 'θ' } } }),
      enunciado: ['La rampa de la entrada de una posta sube 0,4 m y su base mide 5 m. ', thN, ' es su ángulo con el piso. ¿Cuánto vale tan ', thN, ' y qué pendiente tiene la rampa? El dibujo no está a escala.'],
      datos: [DR.razones, DR.letras, 'La pendiente en porcentaje dice cuántos centímetros sube la rampa por cada 100 cm que avanza.'],
      solucion: [
        { texto: ['Desde ', thN, ', el opuesto es lo que sube, ', op('0,4 m'), '; el adyacente es lo que avanza, la base, ', ad('5 m'), '.'] },
        { texto: 'La tangente divide el opuesto entre el adyacente: dice cuánto sube la rampa por cada metro que avanza.', ecuacion: [...tan, ' = ', { frac: [op('0,4'), ad('5')] }, ' = ', res('0,08')] },
        { texto: 'Subir 0,08 m por cada metro es subir 8 cm por cada 100 cm. Por eso la pendiente en porcentaje es la tangente por 100.', ecuacion: ['pendiente = ', res('0,08'), ' · 100 = ', res('8 %')] },
      ],
      respuesta: [...tan, ' = ', res('0,08'), '; pendiente de ', res('8 %')] },
    { nivel: 1, titulo: 'El coseno del cable',
      // Mismo dibujo y mismos colores que «La secante del cable» (idea 5): el suelo, adyacente, turquesa; el poste, opuesto,
      // naranja; el cable, en tinta (lector en frío, 17 nov: antes iban al revés en las dos tarjetas).
      figura: fig({ objeto: 'poste', medidas: { ra: 6, rb: 8 }, lados: tres(L2('6 m', 'i'), L2('8 m', 'o'), L2('10 m')), angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Un cable de 10 m va de la punta de un poste de 8 m a una estaca, a 6 m de la base. ', thN, ' es el ángulo entre el cable y el suelo. ¿Cuánto vale cos ', thN, '?'],
      datos: [DR.razones, DR.letras],
      solucion: [
        { texto: ['Desde ', thN, ', el adyacente es el suelo, ', ad('6 m'), ', y la hipotenusa es el cable, ', '10 m', '.'] },
        { texto: 'El coseno divide el adyacente entre la hipotenusa.', ecuacion: [...cos, ' = ', { frac: [ad('6'), '10'] }, ' = ', { frac: ['3', '5'] }, ' = ', res('0,6')] },
      ],
      respuesta: [...cos, ' = ', res('3/5 = 0,6')] },
    { nivel: 1, titulo: 'La sombra y el sol',
      figura: fig({ objeto: 'poste', sombra: true, medidas: { ra: 6, rb: 4.5 }, lados: tres(L2('6 m', 'i'), L2('4,5 m', 'o'), L2('?')), angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Un poste de 4,5 m da una sombra de 6 m. ', thN, ' es el ángulo del rayo de sol con el suelo. ¿Cuánto vale tan ', thN, '?'],
      datos: [DR.razones, DR.letras],
      solucion: [
        { texto: ['Desde ', thN, ', el opuesto es el poste, ', op('4,5 m'), ', y el adyacente es la sombra, ', ad('6 m'), '. El rayo no hace falta.'] },
        { texto: 'Divido y simplifico.', ecuacion: [...tan, ' = ', { frac: [op('4,5'), ad('6')] }, ' = ', { frac: ['3', '4'] }, ' = ', res('0,75')] },
      ],
      respuesta: [...tan, ' = ', res('3/4 = 0,75')] },
    { nivel: 1, titulo: 'Desde arriba del poste',
      figura: fig({ objeto: 'poste', medidas: { ra: 5, rb: 12 }, lados: tres(L2('5 m', 'o'), L2('12 m', 'i'), L2('13 m')), angulos: { b: { texto: 'α' } } }),
      enunciado: ['Un cable de 13 m baja de la punta de un poste de 12 m a una estaca, a 5 m de la base. ', al, ' es el ángulo entre el cable y el poste. ¿Cuánto vale sen ', al, '?'],
      datos: [junto(['sen ', al, ' = ', { frac: [op('opuesto a α'), 'H'] }]), DR.letras],
      solucion: [
        { texto: [al, ' está arriba. Frente a ', al, ' queda el suelo, ', op('5 m'), '; la hipotenusa es el cable, ', '13 m', '.'] },
        { texto: 'El seno divide el opuesto entre la hipotenusa.', ecuacion: ['sen ', al, ' = ', { frac: [op('5'), '13'] }, ' = ', res('5/13')] },
      ],
      respuesta: ['sen ', al, ' = ', res('5/13')] },
    { nivel: 2, titulo: 'Falta la rampa',
      figura: fig({ objeto: 'rampa', medidas: { ra: 1.2, rb: 0.5 }, lados: tres(L2('1,2 m', 'i'), L2('0,5 m', 'o'), L2('?')), angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una rampa sube 0,5 m y su base mide 1,2 m. ', thN, ' es su ángulo con el piso. ¿Cuánto vale sen ', thN, '?'],
      datos: [DR.razones, DR.letras, DL.pita],
      solucion: [
        { texto: 'El seno necesita la hipotenusa, la rampa. Sale de Pitágoras:', ecuacion: [{ raiz: [[cuad(ad('1,2')), ' + ', cuad(op('0,5'))]] }, ' = ', { raiz: ['1,44 + 0,25'] }, ' = √1,69 = 1,3 m'] },
        { texto: ['Desde ', thN, ', el opuesto es la altura, ', op('0,5 m'), '.'], ecuacion: [...sen, ' = ', { frac: [op('0,5'), '1,3'] }, ' = ', res('5/13')] },
      ],
      respuesta: [...sen, ' = ', res('5/13')] },
    { nivel: 2, titulo: 'Falta la pared',
      figura: fig({ objeto: 'escalera', medidas: { ra: 1.6, rb: 3 }, lados: { ra: L2('1,6 m', 'i'), rb: L2('?'), h: L2('3,4 m') }, angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una escalera de 3,4 m tiene su pie a 1,6 m de la pared. ', thN, ' es su ángulo con el piso. ¿Cuánto vale tan ', thN, '?'],
      datos: [DR.razones, DR.letras, DL.pita],
      solucion: [
        { texto: ['La tangente necesita el opuesto a ', thN, ', la pared. Sale de Pitágoras:'], ecuacion: [raizDif('3,4', '1,6', 'i'), ' = ', { raiz: ['11,56 − 2,56'] }, ' = √9 = ', op('3 m')] },
        { texto: 'Opuesto entre adyacente:', ecuacion: [...tan, ' = ', { frac: [op('3'), ad('1,6')] }, ' = ', { frac: ['30', '16'] }, ' = ', res('15/8')] },
      ],
      respuesta: [...tan, ' = ', res('15/8 = 1,875')] },
    { nivel: 2, titulo: 'Dos rampas, una inclinación',
      figura: fig({ objeto: 'rampa', medidas: { ra: 2, rb: 1.5 }, lados: { ra: L2('?'), rb: L2('1,5 m', 'o') }, angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una rampa chica sube 0,6 m en 0,8 m de base. Otra, con la misma inclinación ', thN, ', sube 1,5 m. ¿Cuánto mide su base?'],
      datos: [DR.razones, 'Triángulos con el mismo θ: tienen las mismas razones.'],
      solucion: [
        { texto: ['Las dos tienen el mismo ', thN, ', así que la misma tangente. La chica da:'], ecuacion: [...tan, ' = ', { frac: [op('0,6'), ad('0,8')] }, ' = 0,75'] },
        { texto: 'En la grande, 1,5 m dividido entre su base también da 0,75. La base es:', ecuacion: [{ frac: [op('1,5'), res('base')] }, ' = 0,75   →   base = 1,5 ÷ 0,75 = ', res('2 m')] },
      ],
      respuesta: ['La base mide ', res('2 m')] },
    { nivel: 2, titulo: 'La sombra de tu primo',
      figura: fig({ objeto: 'sombras', medidas: { sombra: 7.5, poste: 6 }, primo: 1.6, lados: { poste: L2('?'), sombra: L2('7,5 m', 'i'), primo: L2('1,6 m', 'o'), sombra2: L2('2 m', 'i') }, angulos: { suelo: { texto: 'θ' }, suelo2: {} } }),
      enunciado: ['A la misma hora, tu primo de 1,6 m da 2 m de sombra y un poste da 7,5 m. ¿Cuánto mide el poste?'],
      datos: [DR.razones, 'A la misma hora, el sol forma el mismo ángulo θ con el suelo.'],
      solucion: [
        { texto: ['Mismo ', thN, ', misma tangente. Tu primo da:'], ecuacion: [...tan, ' = ', { frac: [op('1,6'), ad('2')] }, ' = 0,8'] },
        { texto: 'El poste entre su sombra también da 0,8.', ecuacion: [{ frac: [res('poste'), ad('7,5')] }, ' = 0,8   →   poste = 0,8 · 7,5 = ', res('6 m')] },
      ],
      respuesta: ['El poste mide ', res('6 m')] },
    { nivel: 2, titulo: 'Seno más coseno',
      figura: fig({ objeto: 'poste', sombra: true, medidas: { ra: 8, rb: 6 }, lados: tres(L2('8 m', 'i'), L2('6 m', 'o'), L2('?')), angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Un poste de 6 m da una sombra de 8 m. ', thN, ' es el ángulo del rayo de sol con el suelo. ¿Cuánto vale sen ', thN, ' + cos ', thN, '?'],
      datos: [DR.razones, DR.letras, DL.pita],
      solucion: [
        { texto: 'Los dos piden la hipotenusa, el rayo:', ecuacion: [{ raiz: [[cuad(op('6')), ' + ', cuad(ad('8'))]] }, ' = √100 = 10 m'] },
        { texto: ['Desde ', thN, ': opuesto 6, adyacente 8, hipotenusa 10.'], ecuacion: [...sen, ' + ', ...cos, ' = ', { frac: [op('6'), '10'] }, ' + ', { frac: [ad('8'), '10'] }, ' = ', { frac: ['14', '10'] }, ' = ', res('7/5')] },
      ],
      respuesta: [...sen, ' + ', ...cos, ' = ', res('7/5 = 1,4')] },
    { nivel: 3, titulo: 'Dada la tangente',
      enunciado: ['En un triángulo rectángulo, tan ', thN, ' = 8/15. ¿Cuánto vale sen ', thN, ' + cos ', thN, '?'],
      datos: [DR.razones, DL.pita],
      solucion: [
        { texto: ['Las razones no dependen del tamaño: tomo un triángulo con opuesto ', op('8'), ' y adyacente ', ad('15'), '.'], ecuacion: ['H = ', { raiz: [[cuad(op('8')), ' + ', cuad(ad('15'))]] }, ' = √289 = 17'] },
        { texto: 'Con los tres lados:', ecuacion: [...sen, ' + ', ...cos, ' = ', { frac: [op('8'), '17'] }, ' + ', { frac: [ad('15'), '17'] }, ' = ', res('23/17')] },
        { texto: 'Error típico: tomar 15 como hipotenusa. En la tangente, 15 es el adyacente.' },
      ],
      respuesta: [...sen, ' + ', ...cos, ' = ', res('23/17')] },
    { nivel: 3, titulo: 'Dado el seno',
      enunciado: ['En un triángulo rectángulo, sen ', thN, ' = 5/13. ¿Cuánto vale tan ', thN, '?'],
      datos: [DR.razones, DL.pita],
      solucion: [
        { texto: ['Tomo opuesto ', op('5'), ' e hipotenusa ', '13', '. El adyacente sale de Pitágoras, no restando 13 − 5:'], ecuacion: ['CA = ', raizDif('13', '5', 'o'), ' = √144 = 12'] },
        { texto: 'Opuesto entre adyacente:', ecuacion: [...tan, ' = ', { frac: [op('5'), ad('12')] }] },
      ],
      respuesta: [...tan, ' = ', res('5/12')] },
    { nivel: 3, titulo: 'El rectángulo escondido',
      figura: fig({ objeto: 'figura', forma: 'diagonal', medidas: { ra: 12, rb: 5 }, lados: { AB: L2('12 cm', 'i'), BC: L2('5 cm', 'o') }, angulos: { A: { texto: 'θ' } } }),
      enunciado: ['Un rectángulo ABCD mide 12 cm por 5 cm. ', thN, ' es el ángulo entre la diagonal AC y el lado AB. ¿Cuánto vale cos ', thN, '?'],
      datos: [DR.razones, DL.pita],
      solucion: [
        { texto: ['El triángulo ABC es rectángulo en B. Desde ', thN, ', en A: adyacente AB = ', ad('12'), ', opuesto BC = ', op('5'), '.'] },
        { texto: 'La hipotenusa es la diagonal:', ecuacion: ['AC = ', { raiz: [[cuad('12'), ' + ', cuad('5')]] }, ' = √169 = ', '13 cm'] },
        { texto: 'Adyacente entre hipotenusa:', ecuacion: [...cos, ' = ', { frac: [ad('12'), '13'] }] },
      ],
      respuesta: [...cos, ' = ', res('12/13')] },
    { nivel: 3, titulo: 'El punto medio',
      // DM, el opuesto, en su color y sin medida: su largo es lo que hay que ver (lector en frío, 17 nov).
      figura: fig({ objeto: 'figura', forma: 'medio', medidas: { ra: 4, rb: 2 }, lados: { DA: L2('4 cm', 'i'), DM: { color: 'o' }, AB: L2('4 cm') }, angulos: { A: { texto: 'θ' } } }),
      enunciado: ['ABCD es un cuadrado de 4 cm de lado y M es el punto medio de DC. ', thN, ' es el ángulo DAM. ¿Cuánto vale tan ', thN, '?'],
      datos: [DR.razones, DR.medio],
      solucion: [
        { texto: ['El triángulo ADM es rectángulo en D. Desde ', thN, ', en A, el adyacente es AD = ', ad('4 cm'), '.'] },
        { texto: ['El opuesto es DM, la mitad de DC: ', op('2 cm'), '. No es el lado entero.'], ecuacion: [...tan, ' = ', { frac: [op('2'), ad('4')] }, ' = ', res('1/2')] },
      ],
      respuesta: [...tan, ' = ', res('1/2')] },
    // Reemplaza a «Un seno con decimales», que repetía la cuenta de «Dado el seno» (auditoría, 17 nov): el triángulo
    // escondido en una semicircunferencia, como en el examen. Cuentas aparte: √(13² − 5²) = √144 = 12; tan θ = 12/5 = 2,4.
    { nivel: 3, titulo: 'El triángulo en la semicircunferencia',
      figura: fig({ objeto: 'figura', forma: 'semicirculo', medidas: { ra: 5, rb: 12 }, lados: { AC: L2('5 cm', 'i'), AB: L2('13 cm'), BC: { color: 'o' } }, angulos: { A: { texto: 'θ' } } }),
      enunciado: ['AB es el diámetro de una semicircunferencia y mide 13 cm. C es un punto del arco, con AC = 5 cm. ', thN, ' es el ángulo CAB. ¿Cuánto vale tan ', thN, '?'],
      datos: ['Un ángulo con su vértice en la semicircunferencia y sus lados en los extremos del diámetro mide 90°.', DR.razones, DL.pita],
      solucion: [
        { texto: 'El ángulo en C abarca el diámetro: mide 90°. El triángulo ACB es rectángulo en C, y su hipotenusa es el diámetro AB, 13 cm.' },
        { texto: ['Desde ', thN, ', en A, el adyacente es AC = ', ad('5 cm'), '. El opuesto es BC, que sale de Pitágoras:'], ecuacion: ['BC = ', raizDif('13', '5', 'i'), ' = √144 = ', op('12 cm')] },
        { texto: 'Opuesto entre adyacente:', ecuacion: [...tan, ' = ', { frac: [op('12'), ad('5')] }, ' = ', res('12/5')] },
        { texto: 'Error típico: tomar AB como cateto. AB queda frente al ángulo recto: es la hipotenusa.' },
      ],
      respuesta: [...tan, ' = ', res('12/5 = 2,4')] },
  ];

  // «Ahora tú», tipo 0: una razón con los lados de un objeto; el tercer lado puede faltar (Pitágoras).
  const TERNAS2 = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
  function casoRazonObj(r) {
    const o = r.uno(OBJS), [ra, rb, hh] = r.uno(o.ternas), val = { ra, rb, h: hh }, en = r.uno(['a', 'b']), ds = desde(en);
    const ang = en === 'a' ? thN : al, letra = en === 'a' ? 'θ' : 'α', L = x => largoTxt(x, o.u);
    const razon = r.uno(['sen', 'cos', 'tan']), [kn, kd] = { sen: [ds.co, 'h'], cos: [ds.ca, 'h'], tan: [ds.co, ds.ca] }[razon];
    const falta = r.uno(['ra', 'rb', 'h', null]);
    const lad = {};
    // Colores por el nombre del lado desde el ángulo de la figura (no por su lugar en la fracción).
    for (const k of ['ra', 'rb', 'h']) lad[k] = k === falta ? { texto: '?' } : { texto: L(val[k]), color: k === ds.co ? 'o' : k === ds.ca ? 'i' : undefined };
    const otraR = { sen: [ds.ca, 'h'], cos: [ds.co, 'h'], tan: [ds.ca, ds.co] }[razon];
    const ops = opciones(frTxt(val[kn], val[kd]), [
      { id: 'otra', valor: frTxt(val[otraR[0]], val[otraR[1]]), error: 'TR9', siFuera: `Dividir dos lados está bien; pero ese cociente usa el otro cateto. Revisa cuál toca a ${letra}.` },
      { id: 'inversa', valor: frTxt(val[kd], val[kn]), error: 'REC-INVERSA', siFuera: 'Los dos lados son los correctos; pero están al revés: arriba va el que nombra la razón primero.' },
      { id: 'largo', valor: L(val[kn]), error: 'TR7', siFuera: `${cap(L(val[kn]))} es el lado de arriba, bien; la razón lo divide entre otro lado.` },
      // En la tangente, «otra» es la inversa: un cuarto error para que salgan cuatro opciones (auditoría, 17 nov).
      { id: 'tanH', valor: frTxt(val[kn], hh), error: 'TAN-H', siFuera: 'El opuesto arriba está bien; la tangente lo divide entre el adyacente, no entre la hipotenusa.' },
    ], x => x);
    const pideFalta = falta === kn || falta === kd;
    const pit = falta === 'h' ? ['H = ', { raiz: [[cuad(f(ra)), ' + ', cuad(f(rb))]] }, ` = ${f(hh)}`] : falta ? [`${o[falta]} = `, raizDif(f(hh), f(val[falta === 'ra' ? 'rb' : 'ra'])), ` = ${f(val[falta])}`] : null;
    return {
      pregunta: [`${o.intro} `, ang, ` es el ángulo ${o[en]}. ¿Cuánto vale ${razon} `, ang, '?'],
      datos: [en === 'a' ? DR.razones : junto([`${razon} `, al, ' = ', { frac: [{ sen: op('opuesto a α'), cos: ad('adyacente a α'), tan: op('opuesto a α') }[razon], { sen: 'H', cos: 'H', tan: ad('adyacente a α') }[razon]] }]), DR.letras, DL.pita],
      dibujo: figO(o, ra, rb, lad, { [en]: { texto: letra } }),
      opciones: ops,
      solucion: pideFalta
        ? { texto: `Falta ${o[falta]}: sale de Pitágoras. Después, ${o[kn]} entre ${o[kd]}.`, ecuacion: [...pit, `;   ${razon} `, ang, ' = ', frEc(val[kn], val[kd])] }
        : { texto: `Desde ${letra}: ${o[kn]} entre ${o[kd]}. El lado que falta no se usa.`, ecuacion: [`${razon} `, ang, ' = ', { frac: [f(val[kn]), f(val[kd])] }, ' = ', frEc(val[kn], val[kd])] },
    };
  }
  // «Ahora tú», tipo 1 (nivel de examen): dada una razón, halla otra (o una suma). Como la razón no depende del tamaño,
  // se toma un triángulo con esos lados; el que falta sale de Pitágoras.
  function casoOtraRazon(r) {
    const [p, q, h] = r.uno(TERNAS2), [co, ca] = r.ent(0, 1) ? [p, q] : [q, p];
    const [dada, pide] = r.uno([['tan', 'suma'], ['sen', 'tan'], ['cos', 'sen'], ['tan', 'sen'], ['sen', 'cos']]);
    const R = { sen: [co, h], cos: [ca, h], tan: [co, ca] };
    let bien, pideTxt, ds, sol;
    if (pide === 'suma') {
      bien = frTxt(co + ca, h); pideTxt = ['sen ', thN, ' + cos ', thN];
      ds = [
        { id: 'lineal', valor: '1', error: 'PIT-LINEAL', siFuera: `Tomar un triángulo de catetos ${co} y ${ca} está bien; pero la hipotenusa sale de Pitágoras, no de sumarlos.` },
        { id: 'fraccion', valor: frTxt(co + ca, 2 * h), error: 'FRAC-SUMA', siFuera: `Los dos cocientes están bien, sobre ${h}; al sumar fracciones de igual denominador, el denominador se queda.` },
        { id: 'solo', valor: frTxt(co, h), error: 'SUMA-INCOMPLETA', siFuera: 'Ese es el seno, bien calculado; falta sumarle el coseno.' },
      ];
      sol = { texto: `Tomo opuesto ${co} y adyacente ${ca}: por Pitágoras, la hipotenusa mide ${h}.`, ecuacion: [{ frac: [`${co}`, `${h}`] }, ' + ', { frac: [`${ca}`, `${h}`] }, ' = ', frEc(co + ca, h)] };
    } else {
      bien = frTxt(...R[pide]); pideTxt = [`${pide} `, thN];
      // El error lineal: el lado que falta se halla sumando o restando, sin cuadrados.
      const lin = { 'sen-tan': [co, h - co], 'cos-sen': [h - ca, h], 'tan-sen': [co, co + ca], 'sen-cos': [h - co, h] }[`${dada}-${pide}`];
      const otra = { sen: [ca, h], cos: [co, h], tan: [co, h] }[pide];
      ds = [
        { id: 'otra', valor: frTxt(...otra), error: 'TR9', siFuera: `Hallar los tres lados está bien; pero ${pide} θ divide otros dos lados. Nómbralos desde θ.` },
        { id: 'lineal', valor: frTxt(...lin), error: 'PIT-LINEAL', siFuera: 'Buscar el lado que falta está bien; pero sale de Pitágoras, con cuadrados, no sumando ni restando.' },
        { id: 'inversa', valor: frTxt(R[pide][1], R[pide][0]), error: 'REC-INVERSA', siFuera: 'Los lados son los correctos; pero el cociente está al revés.' },
      ];
      sol = { texto: `Tomo un triángulo con esos lados; el que falta sale de Pitágoras: ${co}, ${ca} y ${h}.`, ecuacion: [`${pide} `, thN, ' = ', frEc(...R[pide])] };
    }
    return {
      pregunta: ['En un triángulo rectángulo, ', `${dada} `, thN, ` = ${frTxt(...R[dada])}. ¿Cuánto vale `, ...pideTxt, '?'],
      datos: [DR.razones, DL.pita],
      opciones: opciones(bien, ds, x => x),
      solucion: sol,
    };
  }
  // «Ahora tú», tipo 2 (nivel de examen): el triángulo escondido en un rectángulo con su diagonal o en un cuadrado con el
  // punto medio de un lado.
  function casoFigura(r) {
    if (r.ent(0, 2) < 2) {
      const [p, q, h] = r.uno([[4, 3, 5], [12, 5, 13], [8, 6, 10], [15, 8, 17], [24, 7, 25]]), k = r.uno([1, 2]);
      const AB = p * k, BC = q * k, AC = h * k, en = r.uno(['A', 'C']), razon = r.uno(['sen', 'cos', 'tan']);
      // Desde A: opuesto BC, adyacente AB. Desde C: opuesto AB, adyacente BC.
      const [op, ad] = en === 'A' ? [BC, AB] : [AB, BC];
      const val = { sen: [op, AC], cos: [ad, AC], tan: [op, ad] }[razon];
      const nombre = en === 'A' ? 'el ángulo entre la diagonal AC y el lado AB' : 'el ángulo entre la diagonal AC y el lado BC';
      return {
        pregunta: [`Un rectángulo ABCD tiene AB = ${AB} cm y BC = ${BC} cm. `, thN, ` es ${nombre}. ¿Cuánto vale ${razon} `, thN, '?'],
        datos: [DR.razones, DL.pita],
        dibujo: fig({ objeto: 'figura', forma: 'diagonal', medidas: { ra: AB, rb: BC }, lados: { AB: { texto: `${AB} cm`, color: en === 'A' ? 'i' : 'o' }, BC: { texto: `${BC} cm`, color: en === 'A' ? 'o' : 'i' } }, angulos: { [en]: { texto: 'θ' } } }),
        opciones: opciones(frTxt(...val), [
          { id: 'otro', valor: frTxt(...{ sen: [ad, AC], cos: [op, AC], tan: [ad, op] }[razon]), error: 'ANG-OTRO', siFuera: `Ver el triángulo ABC está bien; pero desde ${en} los catetos se nombran al revés.` },
          { id: 'inversa', valor: frTxt(val[1], val[0]), error: 'REC-INVERSA', siFuera: 'Los lados son los correctos; pero el cociente está al revés.' },
          razon === 'tan'
            ? { id: 'diag', valor: frTxt(op, AC), error: 'TR9', siFuera: 'Poner el opuesto arriba está bien; la tangente lo divide entre el adyacente, no entre la diagonal.' }
            : { id: 'sinpit', valor: frTxt(val[0], AB + BC), error: 'PIT-LINEAL', siFuera: 'La diagonal es la hipotenusa, bien; pero sale de Pitágoras, no de sumar los lados.' },
          // Un cuarto error (en la tangente, ANG-OTRO es la inversa; auditoría, 17 nov: salían tres opciones).
          { id: 'largo', valor: `${val[0]} cm`, error: 'TR7', siFuera: 'Ese es el lado de arriba del cociente, bien ubicado; la razón lo divide entre otro lado.' },
        ], x => x),
        solucion: { texto: `ABC es rectángulo en B; AC = ${AC} cm por Pitágoras. Desde ${en}: opuesto ${op}, adyacente ${ad}.`, ecuacion: [`${razon} `, thN, ' = ', frEc(...val)] },
      };
    }
    const Lc = r.uno([2, 4, 6, 8, 10]), en = r.uno(['A', 'M']), razon = 'tan';
    const [op, ad] = en === 'A' ? [Lc / 2, Lc] : [Lc, Lc / 2];
    return {
      pregunta: [`ABCD es un cuadrado de ${Lc} cm de lado y M es el punto medio de DC. `, thN, ` es el ángulo ${en === 'A' ? 'DAM' : 'AMD'}. ¿Cuánto vale tan `, thN, '?'],
      datos: [DR.razones, DR.medio],
      dibujo: fig({ objeto: 'figura', forma: 'medio', medidas: { ra: Lc, rb: Lc / 2 }, lados: { DA: { texto: `${Lc} cm`, color: en === 'A' ? 'i' : 'o' }, AB: { texto: `${Lc} cm` } }, angulos: { [en]: { texto: 'θ' } } }),
      // Cuatro opciones siempre (auditoría, 17 nov: ANG-OTRO repetía la correcta o a MEDIO-ENTERO y salían tres). AM, la
      // hipotenusa, mide Lc·√5/2: opuesto entre AM da √5/5 desde A y 2√5/5 desde M.
      opciones: opciones(frTxt(op, ad), [
        { id: 'entero', valor: '1', error: 'MEDIO-ENTERO', siFuera: 'Usar el triángulo ADM está bien; pero DM es la mitad de DC, no el lado entero.' },
        { id: 'inversa', valor: frTxt(ad, op), error: 'REC-INVERSA', siFuera: 'Los catetos son los correctos; pero desde θ el opuesto va arriba.' },
        { id: 'diag', valor: en === 'A' ? '√5/5' : '2√5/5', error: 'TAN-H', siFuera: 'Poner el opuesto arriba está bien; la tangente lo divide entre el otro cateto, no entre AM.' },
        { id: 'largo', valor: `${f(op)} cm`, error: 'TR7', siFuera: 'Ese es el cateto opuesto, bien ubicado; la tangente lo divide entre el adyacente.' },
      ], x => x),
      solucion: { texto: `ADM es rectángulo en D: AD = ${Lc} cm y DM = ${f(Lc / 2)} cm, la mitad de DC.`, ecuacion: [`${razon} `, thN, ' = ', { frac: [f(op), f(ad)] }, ' = ', frEc(op, ad)] },
    };
  }

  const definicion = {
    id: 'razon-cociente',
    titulo: 'Una razón es un cociente',
    pregunta: '¿Cambia el cociente de dos lados si el triángulo crece y θ no cambia?',
    temas: ['Definición en el triángulo rectángulo'],
    pieza: OB,
    aprendizaje: 'Seno, coseno y tangente dividen dos lados vistos desde θ; no tienen unidades y, con el mismo θ, no dependen del tamaño.',
    actividad: 'Correr la sombra de un poste y compararla con la de tu primo.',
    // Lee: parte de lo que ya sabe la idea 1 (los nombres de los lados) y da el vocabulario (sen, cos, tan) y lo que se
    // usa de geometría (Pitágoras y la misma forma), sin decir que la razón no depende del tamaño (eso es la predicción).
    lee: {
      tarjetas: [
        // Los colores de la idea 1 (la pared, opuesto, naranja; el piso, adyacente, turquesa; la escalera en tinta): la
        // escalera ya no cambia de color de una idea a otra (lector en frío, 17 nov).
        { titulo: 'De lados a cocientes', texto: ['Ya sabes nombrar los lados desde ', thN, '. Ahora vas a dividir uno entre otro. En la escalera de 5 m, la pared dividida entre la escalera da ', junto('4 m ÷ 5 m = 0,8'), ': los metros se cancelan.'],
          pieza: OB, dibujo: { datos: { objeto: 'escalera', medidas: { piso: 3, pared: 4 }, marco: [4.5, 5], lados: { escalera: { texto: '5 m' }, pared: { color: 'o', texto: '4 m' }, piso: { color: 'i', texto: '3 m' } }, angulos: { pie: { texto: 'θ' } } }, estado: {} } },
        { titulo: 'Tres cocientes con nombre', texto: ['Mirados desde ', thN, ', tres cocientes tienen nombre: seno, coseno y tangente, las razones trigonométricas. Se escriben sen, cos y tan; algunas calculadoras dicen «sin». Cada lado conserva su color, arriba o abajo.'],
          ecuacion: DR.razones },
        { titulo: 'Lo que ya sabes', texto: 'Pitágoras da el lado que falta. Y dos triángulos son semejantes si tienen los mismos ángulos: tienen la misma forma, y uno es una ampliación del otro.',
          ecuacion: junto(['Pitágoras: ', cuad('H'), ' = ', cuad(op('CO')), ' + ', cuad(ad('CA'))]) },
        { titulo: 'Qué mirar al jugar', texto: 'A la misma hora, el sol le pega igual a un poste y a tu primo. Corre la sombra del poste, que es como cambiar la hora, y piensa en la de tu primo.' },
      ],
    },
    ejemplos: EJEMPLOS_RAZON,
    juega: {
      pieza: OB,
      consigna: ['Un poste de 6 m y tu primo, de 1,5 m, dan sombra a la misma hora. ', thN, ' dice qué tan alto está el sol.'],
      // La misión dice lo que se arrastra: la punta de la sombra (lector en frío, 17 nov: «mueve el sol» y se movía la sombra).
      mision: {
        texto: 'Corre la sombra del poste hasta que la de tu primo mida 2 m.',
        logrado: val => val.sombra === 8,
        // Sin «Mismo θ, mismo cociente»: era la respuesta de la predicción (auditoría, 17 nov).
        bien: 'Listo: 6 ÷ 8 = 1,5 ÷ 2 = 0,75.',
      },
      voz: '¿Cuánto da altura ÷ sombra para tu primo con 2 m?',
      leyenda: [
        { s: thN, t: 'qué tan alto está el sol' },
        { s: op('naranja'), t: 'las alturas: opuestas a θ' },
        { s: ad('turquesa'), t: 'las sombras: adyacentes a θ' },
        { s: 'tan', t: 'tangente: opuesto entre adyacente' },
        { s: '?', t: 'la sombra de tu primo: no se conoce' },
        { s: '÷', t: 'dividido entre' },
        { s: '≈', t: 'aproximado, redondeado' },
      ],
      controles: [{ id: 'sombra', etiqueta: 'Sombra del poste', color: 'c-i', min: 4, max: 10, paso: 1, inicio: 5, unidad: 'm', decimales: 0 }],
      // Gesto directo: la punta de la sombra del poste se arrastra por el suelo (escala fija: sigue al dedo).
      arrastres: [{ id: 'sombra', etiqueta: 'punta de la sombra del poste: se corre por el suelo', color: 'c-i',
        donde: v => { const g = TO().geometria(sombJ(v)); return { x: g.a[0], y: g.a[1] }; },
        mover: (pt, v) => { const g = TO().geometria(sombJ(v)); return { sombra: (pt.x - g.r[0]) / g.s }; } }],
      dibujo: v => ({ datos: sombJ(v), estado: {} }),
      lectura: v => [...tan, ' = ', op('6 m'), ' ÷ ', ad(`${f(v.sombra)} m`), ' = ', res(decTxt(6 / v.sombra))],
      minimo: 3,
    },
    predice: {
      pregunta: ['A esa hora, divide la altura del poste entre su rayo de sol, de la punta a la sombra. Haz lo mismo con tu primo. ¿Cuál cociente es mayor?'],
      datos: ['Poste: 6 m de alto, 8 m de sombra y 10 m de rayo', 'Tu primo: 1,5 m de alto, 2 m de sombra y 2,5 m de rayo'],
      voz: 'Piensa qué le pasa al rayo cuando todo crece.',
      opciones: [
        { id: 'c', texto: 'Son iguales', correcta: true },
        { id: 'grande', texto: 'El del poste, porque es más grande', error: 'TR8', siFuera: 'El poste es más grande, es cierto; pero su rayo también, cuatro veces: el cociente no cambia.' },
        { id: 'chico', texto: 'El de tu primo, porque su rayo es más corto', error: 'RAZ-CHICO', siFuera: 'Su rayo es más corto, es cierto; pero su altura también, en la misma proporción.' },
        { id: 'tan', texto: 'Los dos valen 0,75, como altura ÷ sombra', error: 'TR9', siFuera: 'Ver que coinciden está bien; pero el rayo no es la sombra: altura ÷ rayo da otro número.' },
      ],
      dibujo: { datos: sombP(false), estado: {} },
      revelar: { datos: sombP(true), estado: {} },
      coincide: 'Coincide: 6 ÷ 10 y 1,5 ÷ 2,5 dan 0,6. Mismo θ, mismo cociente.',
      noCoincide: 'Revisemos: los rayos miden 10 m y 2,5 m; los dos cocientes dan 0,6.',
    },
    mira: {
      pieza: OB,
      datos: somb(8, { poste: { color: 'o', texto: '6 m' }, sombra: { color: 'i', texto: '8 m' }, rayo: { texto: [{ t: '10 m', paso: 2 }] },
        primo: { color: 'o', texto: '1,5 m' }, sombra2: { color: 'i', texto: '2 m' }, rayo2: { texto: [{ t: '2,5 m', paso: 2 }] } },
      { nota: [{ t: 'tan θ = 6 ÷ 8 = 1,5 ÷ 2 = 0,75', paso: 1 }, { t: 'rayos: 10 m y 2,5 m', paso: 2 }, { t: 'sen θ = 6 ÷ 10 = 1,5 ÷ 2,5 = 0,6', paso: 3 },
        { t: 'cos θ = 8 ÷ 10 = 2 ÷ 2,5 = 0,8', paso: 4 }, { t: 'lados × 4, mismos cocientes', paso: 5 }] }),
      voz: 'Compara cocientes, no lados sueltos.',
      pasos: [
        { estado: { paso: 0 }, texto: ['A la misma hora, el sol forma el mismo ángulo ', thN, ' con el suelo.'] },
        { estado: { paso: 1 }, texto: ['Altura entre sombra: el opuesto a ', thN, ' entre el adyacente.'], ecuacion: [...tan, ' = ', { frac: [op('6'), ad('8')] }, ' = ', { frac: [op('1,5'), ad('2')] }, ' = ', res('0,75')] },
        { estado: { paso: 2 }, texto: 'Cada rayo es una hipotenusa: sale de Pitágoras.', ecuacion: [{ raiz: [[cuad('6'), ' + ', cuad('8')]] }, ' = 10;   ', { raiz: [[cuad('1,5'), ' + ', cuad('2')]] }, ' = 2,5'] },
        { estado: { paso: 3 }, texto: 'Opuesto entre hipotenusa es el seno: igual en los dos.', ecuacion: [...sen, ' = ', { frac: [op('6'), '10'] }, ' = ', { frac: [op('1,5'), '2,5'] }, ' = ', res('0,6')] },
        { estado: { paso: 4 }, texto: 'Adyacente entre hipotenusa es el coseno: también igual.', ecuacion: [...cos, ' = ', { frac: [ad('8'), '10'] }, ' = ', { frac: [ad('2'), '2,5'] }, ' = ', res('0,8')] },
        { estado: { paso: 5 }, texto: 'Lados del poste: 4 veces los de tu primo. El cociente no cambia.', ecuacion: [{ frac: ['4 · 1,5', '4 · 2,5'] }, ' = ', { frac: ['1,5', '2,5'] }] },
      ],
    },
    mundo: MUNDO.razon,
    regla: {
      texto: 'Desde un ángulo agudo θ, el seno divide el opuesto entre la hipotenusa; el coseno, el adyacente entre la hipotenusa; la tangente, el opuesto entre el adyacente.',
      ecuacion: [junto([...sen, ' = ', { frac: [op('CO'), 'H'] }]), '   ·   ', junto([...cos, ' = ', { frac: [ad('CA'), 'H'] }]), '   ·   ', junto([...tan, ' = ', { frac: [op('CO'), ad('CA')] }])],
      condicion: 'θ es agudo. Son cocientes sin unidades: con el mismo θ, un triángulo grande y uno chico dan las mismas razones.',
      voz: 'Primero nombra los lados desde θ; después divide.',
    },
    // Así se resuelve: las tres razones de un objeto con dos lados dados (el tercero, por Pitágoras). «Ahora tú» pide otra
    // cosa: una sola razón, una razón a partir de otra o el triángulo escondido en una figura.
    resuelve: {
      pieza: OB,
      generar(s) {
        const r = azar(s + 900), o = r.uno(OBJS), [ra, rb, hh] = r.uno(o.ternas), val = { ra, rb, h: hh };
        const en = s % 2 === 0 ? 'a' : 'b', ang = en === 'a' ? thN : al, letra = en === 'a' ? 'θ' : 'α', ds = desde(en), L = x => largoTxt(x, o.u);
        const falta = ['h', ds.co, ds.ca][s % 3], dados = ['ra', 'rb', 'h'].filter(k => k !== falta);
        // Color por el nombre del lado desde el ángulo de la figura: opuesto naranja, adyacente turquesa, hipotenusa en tinta.
        const colorDe = { [ds.co]: 'o', [ds.ca]: 'i' };
        const lad = {};
        for (const k of ['ra', 'rb', 'h']) lad[k] = k === falta ? { texto: '?' } : { texto: L(val[k]), color: colorDe[k] };
        const otro = dados.find(k => k !== 'h') || (falta === 'ra' ? 'rb' : 'ra');
        const pit = falta === 'h'
          ? [`${cap(o.h)} = `, { raiz: [[cuad(f(ra)), ' + ', cuad(f(rb))]] }, ` = ${L(hh)}`]
          : [`${cap(o[falta])} = `, raizDif(f(hh), f(val[otro])), ` = ${L(val[falta])}`];
        const tres3 = [junto(['sen ', ang, ' = ', frEc(val[ds.co], hh)]), SEP, junto(['cos ', ang, ' = ', frEc(val[ds.ca], hh)]), SEP, junto(['tan ', ang, ' = ', frEc(val[ds.co], val[ds.ca])])];
        return {
          enunciado: [`${o.intro} `, ang, ` es el ángulo ${o[en]}. Halla sen `, ang, ', cos ', ang, ' y tan ', ang, '.'],
          datos: [en === 'a' ? DR.razones : [junto(['Desde α: sen α = ', { frac: [op('opuesto a α'), 'H'] }]), SEP, junto(['cos α = ', { frac: [ad('adyacente a α'), 'H'] }]), SEP, junto(['tan α = ', { frac: [op('opuesto a α'), ad('adyacente a α')] }])], DR.letras, DL.pita],
          dibujo: figO(o, ra, rb, lad, { [en]: { texto: letra } }),
          pasos: [
            { tipo: 'pide', texto: ['Piden tres cocientes de lados, mirados desde ', ang, `, el ángulo ${o[en]}.`] },
            { tipo: 'datos', texto: [`Se conocen ${o[dados[0]]}, ${L(val[dados[0]])}, y ${o[dados[1]]}, ${L(val[dados[1]])}. Falta ${o[falta]}.`] },
            { tipo: 'regla', texto: ['Desde ', ang, `: ${o[ds.co]} es el opuesto, ${o[ds.ca]} el adyacente y ${o.h} la hipotenusa. El lado que falta sale de Pitágoras.`] },
            { tipo: 'cuentas', texto: 'Primero Pitágoras; después, los tres cocientes simplificados.', ecuacion: pit },
            { tipo: 'cuentas', texto: ['Los tres cocientes, desde ', ang, ':'], ecuacion: tres3 },
            { tipo: 'sentido', texto: `Seno y coseno dan menos que 1: un cateto siempre es más corto que la hipotenusa, ${L(hh)}.` },
          ],
          respuesta: ['sen ', ang, ` = ${frTxt(val[ds.co], hh)}; cos `, ang, ` = ${frTxt(val[ds.ca], hh)}; tan `, ang, ` = ${frTxt(val[ds.co], val[ds.ca])}`],
        };
      },
    },
    ahoraTu: {
      pieza: OB,
      voz: 'Nombra los lados desde el ángulo; después divide.',
      generar(sem) {
        const r = azar(sem + 41);
        return conCuatro([casoRazonObj, casoOtraRazon, casoFigura][sem % 3], r);
      },
    },
  };

  // ---------- Idea 3 (rehecha, 17 nov): medio cuadrado, medio equilátero ----------
  // Objeto de la primera pantalla: una loseta cuadrada cortada por la diagonal y una señal «Ceda el paso» (triángulo
  // equilátero) cortada por su altura (pieza trig-objeto); en «Lee» y «Mira», las dos escuadras del colegio.
  // Cambia: la figura y su lado (de 20 a 80 cm). · Permanece: la forma de cada mitad y sus ángulos.
  // Progresa: los lados, uno entero y otro con raíz. · Se reserva: sen 60° a partir de la media señal (la predicción).
  // Debe verse: 30°, 45° y 60° tienen lados exactos (1, √3, 2 y 1, 1, √2) y por eso razones exactas.
  // Colores (regla de la unidad): desde el ángulo de abajo (30° en la señal y en la escuadra; el 45° de abajo en la
  // loseta), el opuesto naranja, el adyacente turquesa y la hipotenusa en tinta; los ángulos, carmín. Desde 60° los
  // colores de las líneas no cambian. En la predicción, la altura (lo que se pide) va con «?», en tinta. En los ejemplos
  // con un solo ángulo nombrado (60°, el 45° de abajo), los colores se nombran desde ese ángulo.
  // Errores (TR7 y TR10 del informe de trigonometría; el resto, hipótesis): TR10 el seno crece como el ángulo (sen 60° =
  // 2 sen 30°), TR7 da el lado y no el cociente, NOT-MISMO toma el cateto del otro ángulo, NOT-CAMBIA cambia 30° por 60°,
  // REC-INVERSA invierte el cociente, NOT-ADIVINA cree que hace falta el transportador, TAN-H divide la tangente entre la
  // hipotenusa (17 nov: cuarta opción de tan 30°, 45° y 60°).

  // Números exactos de la forma a + b√2 + c√3 + d√6, con a, b, c, d racionales: { 1: [p, q], 2: [p, q], … }. Las
  // razones notables, sus sumas y productos se calculan aquí (regla 1), sin decimales.
  const Qn = (p, q = 1) => { const g = gcd(p, q) || 1, sg = q < 0 ? -1 : 1; return [sg * p / g, sg * q / g]; };
  const qSum = (x, y) => Qn(x[0] * y[1] + y[0] * x[1], x[1] * y[1]), qMul = (x, y) => Qn(x[0] * y[0], x[1] * y[1]);
  // √a · √b = c · √d (a, b de 1, 2, 3, 6).
  const RADMUL = { '1,1': [1, 1], '1,2': [1, 2], '1,3': [1, 3], '1,6': [1, 6], '2,2': [2, 1], '2,3': [1, 6], '2,6': [2, 3], '3,3': [3, 1], '3,6': [3, 2], '6,6': [6, 1] };
  const Ex = {
    de: (p, q = 1, k = 1) => ({ [k]: Qn(p, q) }),
    suma: (...xs) => { const r = {}; for (const x of xs) for (const [k, v] of Object.entries(x)) r[k] = r[k] ? qSum(r[k], v) : v; return Ex.limpio(r); },
    por: (...xs) => xs.reduce((a, b) => {
      const r = {};
      for (const [k1, v1] of Object.entries(a)) for (const [k2, v2] of Object.entries(b)) {
        const [c, d] = RADMUL[[+k1, +k2].sort((x, y) => x - y).join(',')], v = qMul(qMul(v1, v2), [c, 1]);
        r[d] = r[d] ? qSum(r[d], v) : v;
      }
      return Ex.limpio(r);
    }, { 1: [1, 1] }),
    // Inverso de un número de un solo término, c·√k: 1/(c√k) = √k/(c·k). Así se racionaliza.
    inv: x => { const [k, [p, q]] = Object.entries(x)[0]; return { [k]: Qn(q, p * +k) }; },
    limpio: r => { for (const k of Object.keys(r)) if (r[k][0] === 0) delete r[k]; return Object.keys(r).length ? r : { 1: [0, 1] }; },
    num: x => Object.entries(x).reduce((t, [k, [p, q]]) => t + p / q * Math.sqrt(+k), 0),
    // Texto: «√3/2», «2√3/3», «(1 + √3)/2», «3/2», «1».
    txt: x => {
      const ts = Object.entries(x).sort((a, b) => a[0] - b[0]);
      const D = ts.reduce((d, [, [, q]]) => d * q / gcd(d, q), 1);
      const ns = ts.map(([k, [p, q]]) => [+k, p * D / q]);
      const parte = ([k, nn], i) => { const a = Math.abs(nn), sg = nn < 0 ? '−' : ''; const t = k === 1 ? `${a}` : `${a === 1 ? '' : a}√${k}`; return i === 0 ? `${sg}${t}` : ` ${nn < 0 ? '−' : '+'} ${t}`; };
      const cuerpo = ns.map(parte).join('');
      if (D === 1) return cuerpo;
      return ns.length > 1 ? `(${cuerpo})/${D}` : `${cuerpo}/${D}`;
    },
  };
  // Las razones de 30°, 45° y 60°, exactas y racionalizadas.
  const NOT = {
    sen: { 30: Ex.de(1, 2), 45: Ex.de(1, 2, 2), 60: Ex.de(1, 2, 3) },
    cos: { 30: Ex.de(1, 2, 3), 45: Ex.de(1, 2, 2), 60: Ex.de(1, 2) },
    tan: { 30: Ex.de(1, 3, 3), 45: Ex.de(1), 60: Ex.de(1, 1, 3) },
  };
  // Tablas con un error: con el cateto del otro ángulo (sen ↔ cos), con el largo del lado y no el cociente (lados 1, √3,
  // 2 y 1, 1, √2), y con el cociente al revés.
  const NOT_MAL = {
    cambia: { sen: NOT.cos, cos: NOT.sen, tan: { 30: NOT.tan[60], 45: NOT.tan[45], 60: NOT.tan[30] } },
    // La tangente con el largo del cateto de enfrente (1, 1 o √3), como el seno: antes era la tangente misma y no daba
    // opción nueva.
    largo: { sen: { 30: Ex.de(1), 45: Ex.de(1), 60: Ex.de(1, 1, 3) }, cos: { 30: Ex.de(1, 1, 3), 45: Ex.de(1), 60: Ex.de(1) }, tan: { 30: Ex.de(1), 45: Ex.de(1), 60: Ex.de(1, 1, 3) } },
    inversa: { sen: { 30: Ex.de(2), 45: Ex.de(1, 1, 2), 60: Ex.de(2, 3, 3) }, cos: { 30: Ex.de(2, 3, 3), 45: Ex.de(1, 1, 2), 60: Ex.de(2) }, tan: { 30: Ex.de(1, 1, 3), 45: Ex.de(1), 60: Ex.de(1, 3, 3) } },
  };
  // Una expresión: lista de términos [coef, [razón, ángulo, potencia?], …]. ev(expr, tabla) la calcula; ecu(expr) la escribe.
  const potEx = (x, n = 1) => (n === 2 ? Ex.por(x, x) : x);
  const ev = (expr, T = NOT) => Ex.suma(...expr.map(([c, ...fs]) => Ex.por(Ex.de(c), ...fs.map(([rz, g, n]) => potEx(T[rz][g], n)))));
  const fac = ([rz, g, n], arg) => [n === 2 ? { sup: [rz, '2'] } : rz, ' ', arg ? { v: 'c-h', t: arg } : `${g}°`];
  const ecu = (expr, args = {}) => expr.flatMap(([c, ...fs], i) => [i === 0 ? (c < 0 ? '−' : '') : c < 0 ? ' − ' : ' + ', Math.abs(c) === 1 ? '' : `${Math.abs(c)} `,
    ...fs.flatMap((x, j) => [j ? ' · ' : '', ...fac(x, args[`${x[0]}${x[1]}`])])]);
  // La media señal y la media loseta, dichas con su tamaño de referencia (lector en frío, 17 nov: «media señal» sin dibujo
  // y el salto de 60, 30 y 30√3 a 2, 1 y √3 no se entendían): más grandes, los cocientes son los mismos.
  const DN = {
    t30: 'Media señal: el equilátero de lado 2 partido por su altura. Hipotenusa 2; frente a 30°, 1; frente a 60°, √3.',
    t45: 'Media loseta: el cuadrado de lado 1 partido por su diagonal. Catetos 1 y 1; hipotenusa √2.',
    tam: 'Con otro tamaño, los lados se multiplican por un mismo número y los cocientes no cambian.',
    racio: [junto(['Racionalizar: ', { frac: ['1', '√2'] }, ' = ', { frac: ['√2', '2'] }]), SEP, junto([{ frac: ['1', '√3'] }, ' = ', { frac: ['√3', '3'] }])],
  };
  // Las escuadras de referencia, con sus lados (1, √3, 2 y 1, 1, √2) y los colores desde el ángulo de abajo (o sin color).
  const escuadrasRef = (color = true) => ({ objeto: 'escuadras',
    lados: { corto: { texto: '1', color: color ? 'o' : undefined }, hip: { texto: '2' }, largo: { texto: '√3', color: color ? 'i' : undefined },
      c1: { texto: '1', color: color ? 'i' : undefined }, c2: { texto: '1', color: color ? 'o' : undefined }, d: { texto: '√2' } },
    angulos: { a30: { texto: '30°' }, a60: { texto: '60°' }, e1: { texto: '45°' }, e2: { texto: '45°' } } });
  const escuadraSola = (o = {}) => ({ objeto: 'escuadras', sola: true, medidas: { corto: o.corto || 1 },
    lados: { corto: L2(o.c || '1', o.cc === undefined ? 'o' : o.cc), hip: L2(o.h || '2'), largo: L2(o.l || '√3', o.lc === undefined ? 'i' : o.lc) },
    angulos: { a30: { texto: '30°' }, a60: { texto: '60°' } } });

  // El juego: la loseta (cu) o la señal (eq), de 20 a 80 cm de lado. La pieza las dibuja siempre del mismo tamaño en
  // pantalla: al cambiar el lado, cambian las medidas y no la forma.
  const notJ = v => (v.fig === 'eq'
    ? { objeto: 'senal', medidas: { lado: v.L }, lados: { media: { color: 'o', texto: `${f(v.L / 2)} cm` }, lado: { texto: `${v.L} cm` }, altura: { color: 'i', texto: `${f(v.L / 2)}√3 cm` } }, angulos: { esquina: { texto: '60°' }, punta: { texto: '30°' } } }
    : { objeto: 'loseta', medidas: { lado: v.L }, lados: { costado: { color: 'o', texto: `${v.L} cm` }, diagonal: { texto: `${v.L}√2 cm` }, base: { color: 'i', texto: `${v.L} cm` } }, angulos: { izquierda: { texto: '45°' }, arriba: { texto: '45°' } } });
  const senalP = rev => ({ objeto: 'senal', medidas: { lado: 40 }, lados: { media: { color: 'o', texto: '20 cm' }, lado: { texto: '40 cm' }, altura: rev ? { color: 'i', texto: '20√3 cm' } : { texto: '?' } },
    angulos: { esquina: { texto: '60°' }, punta: { texto: '30°' } }, nota: rev ? 'sen 60° = 20√3/40 = √3/2 ≈ 0,87' : undefined });
  // Las dos escuadras de «Mira», con sus rótulos paso a paso.
  const ESCUADRAS = {
    objeto: 'escuadras',
    lados: { corto: { color: 'o', texto: '1' }, hip: { texto: '2' }, largo: { color: [{ c: 'i', paso: 1 }], texto: [{ t: '?' }, { t: '√3', paso: 1 }] },
      c1: { color: 'i', paso: 4, texto: [{ t: '1', paso: 4 }] }, c2: { color: 'o', paso: 4, texto: [{ t: '1', paso: 4 }] }, d: { texto: [{ t: '√2', paso: 4 }] } },
    angulos: { a30: { texto: '30°' }, a60: { texto: '60°' }, e1: { texto: '45°', paso: 4 }, e2: { texto: '45°', paso: 4 } },
  };

  // Ejemplos resueltos de «Medio cuadrado, medio equilátero». Cuentas rehechas con un script aparte, sin el código de la
  // unidad (scratchpad e2-trig-resto/cuentas-idea3.js), con raíces exactas y con decimales: 20/40 = 1/2;
  // 30/(30√2) = √2/2; 30√3/30 = √3; 40/40 = 1; 10/20 = 1/2; 1/2 + 1/2 = 1; √3 · √3/3 = 1; 1/√3 = √3/3; 2/4 = 1/2 → 60°;
  // (√3/2)² + 1/2 = 5/4; 4 · 3/4 − 2 + √2 · √2/2 = 2. Los tres de nivel 3 nuevos (17 nov, auditoría) llevan sus cuentas
  // en su comentario. «La escalera de 60°» (17 nov, reemplaza a «¿El doble de ángulo?», que era más fácil que
  // el nivel 2): cos 60° = 1/2 = 1,5/x → x = 3; √(3² − 1,5²) = √6,75 = 1,5√3 ≈ 2,598 ≈ 2,6.
  const sen_ = g => ['sen ', `${g}°`], cos_ = g => ['cos ', `${g}°`], tan_ = g => ['tan ', `${g}°`];
  const EJEMPLOS_NOTABLES = [
    { nivel: 1, titulo: 'El seno en la señal',
      figura: fig({ objeto: 'senal', medidas: { lado: 40 }, lados: { media: L2('20 cm', 'o'), lado: L2('40 cm'), altura: L2('20√3 cm', 'i') }, angulos: { esquina: { texto: '60°' }, punta: { texto: '30°' } } }),
      enunciado: 'Una señal «Ceda el paso» de 40 cm de lado se parte por su altura. ¿Cuánto vale sen 30° en una de las mitades?',
      datos: [DR.razones, 'Señal «Ceda el paso»: triángulo equilátero, de tres lados iguales.'],
      solucion: [
        { texto: ['Frente a 30° queda la media base, ', op('20 cm'), '; la hipotenusa es el lado de la señal, ', '40 cm', '.'] },
        { texto: 'Opuesto entre hipotenusa:', ecuacion: [...sen_(30), ' = ', { frac: [op('20'), '40'] }, ' = ', res('1/2')] },
      ],
      respuesta: [...sen_(30), ' = ', res('1/2')] },
    { nivel: 1, titulo: 'El coseno en la loseta',
      figura: fig({ objeto: 'loseta', medidas: { lado: 30 }, lados: { base: L2('30 cm', 'i'), diagonal: L2('30√2 cm'), costado: L2('30 cm', 'o') }, angulos: { izquierda: { texto: '45°' } } }),
      enunciado: 'Una loseta cuadrada de 30 cm se corta por su diagonal, que mide 30√2 cm. ¿Cuánto vale cos 45°?',
      datos: [DR.razones, DN.racio],
      solucion: [
        { texto: ['Desde el 45° de abajo, el adyacente es la base, ', ad('30 cm'), '; la hipotenusa es la diagonal, ', '30√2 cm', '.'] },
        { texto: 'Simplifico el 30 y racionalizo:', ecuacion: [...cos_(45), ' = ', { frac: [ad('30'), '30√2'] }, ' = ', { frac: ['1', '√2'] }, ' = ', res('√2/2')] },
      ],
      respuesta: [...cos_(45), ' = ', res('√2/2')] },
    { nivel: 1, titulo: 'La tangente de 60°',
      // La señal con los colores de siempre, desde 30° (auditoría, 17 nov: aquí iban al revés que en el juego). Desde 60°
      // cambian los nombres, no los colores: la altura, turquesa, es su opuesto.
      figura: fig({ objeto: 'senal', medidas: { lado: 60 }, lados: { media: L2('30 cm', 'o'), lado: L2('60 cm'), altura: L2('30√3 cm', 'i') }, angulos: { esquina: { texto: '60°' }, punta: { texto: '30°' } } }),
      enunciado: 'Una señal «Ceda el paso» de 60 cm de lado se parte por su altura, que mide 30√3 cm. ¿Cuánto vale tan 60°?',
      datos: [DR.razones, 'Señal «Ceda el paso»: triángulo equilátero; sus tres ángulos miden 60°.'],
      solucion: [
        { texto: ['El 60° está arriba, en la esquina. Desde 60°, la altura, ', ad('30√3 cm'), ', queda enfrente: es el opuesto. La media base, ', op('30 cm'), ', lo toca.'] },
        { texto: 'Opuesto entre adyacente; el 30 se simplifica:', ecuacion: [...tan_(60), ' = ', { frac: [ad('30√3'), op('30')] }, ' = ', res('√3')] },
      ],
      respuesta: [...tan_(60), ' = ', res('√3 ≈ 1,73')] },
    { nivel: 1, titulo: 'La tangente de 45°',
      figura: fig({ objeto: 'loseta', medidas: { lado: 40 }, lados: { costado: L2('40 cm', 'o'), base: L2('40 cm', 'i'), diagonal: L2('40√2 cm') }, angulos: { izquierda: { texto: '45°' } } }),
      enunciado: 'Una loseta cuadrada de 40 cm se corta por su diagonal. ¿Cuánto vale tan 45°?',
      datos: [DR.razones],
      solucion: [
        { texto: ['Desde el 45° de abajo, el opuesto es el costado, ', op('40 cm'), ', y el adyacente la base, ', ad('40 cm'), '.'] },
        { texto: 'Los dos catetos de un cuadrado miden igual:', ecuacion: [...tan_(45), ' = ', { frac: [op('40'), ad('40')] }, ' = ', res('1')] },
      ],
      respuesta: [...tan_(45), ' = ', res('1')] },
    { nivel: 1, titulo: 'La escuadra de 20 cm',
      // La escuadra con los colores de siempre, desde 30° (auditoría, 17 nov: aquí iban al revés). Desde 60°, el cateto
      // corto, naranja, es el que lo toca: su adyacente.
      figura: fig(escuadraSola({ corto: 10, c: '10 cm', h: '20 cm', l: '10√3 cm' })),
      enunciado: 'La escuadra de 30° y 60° del profesor tiene 20 cm de hipotenusa y 10 cm en su cateto corto. ¿Cuánto vale cos 60°?',
      datos: [DR.razones],
      solucion: [
        { texto: ['El 60° está arriba, a la derecha. Desde 60°, el cateto corto, ', op('10 cm'), ', lo toca: es el adyacente. La hipotenusa mide ', '20 cm', '.'] },
        { texto: 'Adyacente entre hipotenusa:', ecuacion: [...cos_(60), ' = ', { frac: [op('10'), '20'] }, ' = ', res('1/2')] },
      ],
      respuesta: [...cos_(60), ' = ', res('1/2')] },
    { nivel: 2, titulo: 'Una suma de notables',
      enunciado: '¿Cuánto vale sen 30° + cos 60°?',
      datos: [DR.razones, DN.t30],
      solucion: [
        { texto: ['En la media señal, frente a 30° hay 1 sobre la hipotenusa 2. Y el 60° toca ese mismo cateto de 1.'], ecuacion: [...sen_(30), ' = ', { frac: [op('1'), '2'] }, SEP, ...cos_(60), ' = ', { frac: [op('1'), '2'] }] },
        { texto: 'Sumo:', ecuacion: [{ frac: ['1', '2'] }, ' + ', { frac: ['1', '2'] }, ' = ', res('1')] },
      ],
      respuesta: [...sen_(30), ' + ', ...cos_(60), ' = ', res('1')] },
    { nivel: 2, titulo: 'Dos tangentes',
      enunciado: '¿Cuánto vale tan 60° · tan 30°?',
      datos: [DR.razones, DN.t30, DN.racio],
      solucion: [
        { texto: 'En la media señal: desde 60°, opuesto √3 y adyacente 1; desde 30°, al revés.', ecuacion: [...tan_(60), ' = ', { frac: ['√3', '1'] }, ' = √3;   ', ...tan_(30), ' = ', { frac: ['1', '√3'] }] },
        { texto: 'Al multiplicar, la raíz se va:', ecuacion: ['√3 · ', { frac: ['1', '√3'] }, ' = ', res('1')] },
      ],
      respuesta: [...tan_(60), ' · ', ...tan_(30), ' = ', res('1')] },
    { nivel: 2, titulo: 'Racionaliza tan 30°',
      figura: fig(escuadraSola()),
      enunciado: '¿Cuál es el valor exacto de tan 30°, con la raíz arriba?',
      datos: [DR.razones, DN.t30],
      solucion: [
        { texto: 'En la media señal, frente a 30° queda el 1. El √3, que queda frente a 60°, es el que toca a 30°: su adyacente.', ecuacion: [...tan_(30), ' = ', { frac: [op('1'), ad('√3')] }] },
        { texto: 'Multiplico arriba y abajo por √3; abajo, √3 · √3 = 3:', ecuacion: [{ frac: ['1 · √3', '√3 · √3'] }, ' = ', res('√3/3')] },
      ],
      respuesta: [...tan_(30), ' = ', res('√3/3')] },
    { nivel: 2, titulo: '¿Qué ángulo es?',
      figura: fig({ objeto: 'escalera', medidas: { ra: 2, rb: 2 * Math.sqrt(3) }, lados: { ra: L2('2 m', 'i'), h: L2('4 m') }, angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una escalera de 4 m tiene su pie a 2 m de la pared. ¿Cuánto mide su ángulo ', thN, ' con el piso?'],
      datos: [DR.razones, DN.t30, DN.t45, DN.tam],
      solucion: [
        { texto: ['Desde ', thN, ', el piso es el adyacente y la escalera la hipotenusa:'], ecuacion: [...cos, ' = ', { frac: [ad('2'), '4'] }, ' = ', { frac: ['1', '2'] }] },
        { texto: 'En la media señal, el cateto de 1 sobre la hipotenusa 2 toca al ángulo de 60°. Aquí todo mide el doble: 2 y 4.', ecuacion: [thN, ' = ', res('60°')] },
      ],
      respuesta: [thN, ' = ', res('60°')] },
    { nivel: 2, titulo: 'Un seno al cuadrado',
      enunciado: ['¿Cuánto vale ', { sup: ['sen', '2'] }, ' 60° + cos 60°?'],
      datos: [DR.razones, DN.t30, [{ sup: ['sen', '2'] }, ' 60° = (sen 60°)²']],
      solucion: [
        { texto: 'Desde 60°: opuesto √3, adyacente 1, hipotenusa 2.', ecuacion: [...sen_(60), ' = ', { frac: ['√3', '2'] }, SEP, ...cos_(60), ' = ', { frac: ['1', '2'] }] },
        { texto: 'Elevo el seno: la raíz se va al cuadrado.', ecuacion: [{ sup: [{ par: [{ frac: ['√3', '2'] }] }, '2'] }, ' + ', { frac: ['1', '2'] }, ' = ', { frac: ['3', '4'] }, ' + ', { frac: ['2', '4'] }, ' = ', res('5/4')] },
      ],
      respuesta: [res('5/4')] },
    // Los dos de nivel 3 que eran reemplazar y sumar («Con 2θ y 3θ» y «Una fracción de notables», más fáciles que el
    // nivel 2; auditoría, 17 nov) pasan a un notable escondido en una figura y a una expresión con una x que se despeja.
    // Cuentas aparte: 80 = 2 · 40, altura √3 · 40 = 40√3 ≈ 69,28; área 80 · 40√3 ÷ 2 = 1600√3 ≈ 2771 (≈ 2768 con 1,73);
    // x · √3/2 = √3 · √3/2 + 1/2 = 2 → x = 4/√3 = 4√3/3 ≈ 2,309.
    { nivel: 3, titulo: 'La lámina de la señal',
      figura: fig({ objeto: 'senal', medidas: { lado: 80 }, lados: { media: { color: 'o' }, lado: L2('80 cm'), altura: L2('?') }, angulos: { esquina: { texto: '60°' }, punta: { texto: '30°' } } }),
      enunciado: 'Una señal «Ceda el paso» tiene 80 cm de lado. ¿Cuánto mide su altura y cuánta lámina lleva, es decir, cuánto mide su área?',
      datos: ['Señal «Ceda el paso»: triángulo equilátero, de tres lados iguales.', DN.t30, DN.tam, 'Área de un triángulo: base · altura ÷ 2.', '√3 ≈ 1,73'],
      solucion: [
        { texto: ['La altura parte la señal en dos medias señales. En cada una, la hipotenusa es el lado, 80 cm, y frente a 30° queda la media base, ', op('40 cm'), '.'] },
        { texto: 'Es la media señal de lado 2 con todo multiplicado por 40. Frente a 60°, el √3 pasa a 40√3:', ecuacion: ['altura = √3 · 40 = 40√3 ≈ ', res('69 cm')] },
        { texto: 'El área, con la base entera:', ecuacion: ['80 · 40√3 ÷ 2 = 1600√3 ≈ ', res('2770 cm²')] },
      ],
      respuesta: ['Altura: ', res('40√3 ≈ 69 cm'), '; área: ', res('1600√3 ≈ 2770 cm²')] },
    { nivel: 3, titulo: 'Halla x con notables',
      enunciado: 'Si x · cos 30° = tan 60° · sen 60° + sen 30°, ¿cuánto vale x?',
      datos: [DR.razones, DN.t30, DN.racio],
      solucion: [
        { texto: 'Cada razón, con la media señal:', ecuacion: [...cos_(30), ' = ', { frac: ['√3', '2'] }, SEP, ...tan_(60), ' = √3', SEP, ...sen_(60), ' = ', { frac: ['√3', '2'] }, SEP, ...sen_(30), ' = ', { frac: ['1', '2'] }] },
        { texto: 'Reemplazo a la derecha: √3 · √3 = 3.', ecuacion: ['√3 · ', { frac: ['√3', '2'] }, ' + ', { frac: ['1', '2'] }, ' = ', { frac: ['3', '2'] }, ' + ', { frac: ['1', '2'] }, ' = 2'] },
        { texto: 'Despejo x y racionalizo:', ecuacion: ['x = 2 ÷ ', { frac: ['√3', '2'] }, ' = ', { frac: ['4', '√3'] }, ' = ', res('4√3/3')] },
        { texto: 'Error típico: dejar 4/√3, con la raíz abajo.' },
      ],
      respuesta: ['x = ', res('4√3/3 ≈ 2,31')] },
    // Reemplaza a «La rampa del colegio»: una rampa de 30° no es creíble (auditoría, 17 nov). Cuentas aparte: 6/12 = 1/2 →
    // 30°; √(12² − 6²) = √108 = 6√3 ≈ 10,39 (10,38 con 1,73).
    { nivel: 3, titulo: 'El cable del poste de luz',
      figura: fig({ objeto: 'poste', medidas: { ra: 6 * Math.sqrt(3), rb: 6 }, lados: { rb: L2('6 m', 'o'), h: L2('12 m'), ra: L2('?') }, angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Un cable de 12 m va de la punta de un poste de 6 m a una estaca en el suelo. ¿Cuánto mide su ángulo ', thN, ' con el suelo y a qué distancia del poste está la estaca?'],
      datos: [DR.razones, DN.t30, DN.tam, DL.pita, '√3 ≈ 1,73'],
      solucion: [
        { texto: ['Desde ', thN, ', el poste queda enfrente:'], ecuacion: [...sen, ' = ', { frac: [op('6'), '12'] }, ' = ', { frac: ['1', '2'] }] },
        { texto: 'En la media señal, frente a 30° hay 1 sobre la hipotenusa 2: el mismo cociente.', ecuacion: [thN, ' = ', res('30°')] },
        { texto: 'La distancia sale de Pitágoras:', ecuacion: [raizDif('12', '6', 'o'), ' = √108 = 6√3 ≈ ', res('10,4 m')] },
      ],
      respuesta: [thN, ' = ', res('30°'), '; la estaca, a unos ', res('10,4 m')] },
    // Reemplaza a «¿El doble de ángulo?» (lector en frío, 17 nov: el nivel 3 era más fácil que el 2). Tres pasos: el
    // ángulo da la razón, la razón da la escalera y Pitágoras da la altura.
    { nivel: 3, titulo: 'La escalera de 60°',
      figura: fig({ objeto: 'escalera', medidas: { ra: 1.5, rb: 1.5 * Math.sqrt(3) }, lados: { ra: L2('1,5 m', 'i'), rb: L2('?'), h: L2('?') }, angulos: { a: { texto: '60°' } } }),
      enunciado: 'Una escalera forma 60° con el piso y su pie queda a 1,5 m de la pared. ¿Cuánto mide la escalera y a qué altura llega?',
      datos: [DR.razones, DN.t30, DN.tam, DL.pita, '√3 ≈ 1,73'],
      solucion: [
        { texto: 'Desde 60°, en el pie, el piso lo toca: es el adyacente. En la media señal, adyacente entre hipotenusa da 1/2:', ecuacion: [...cos_(60), ' = ', { frac: ['1', '2'] }, ' = ', { frac: [ad('1,5'), 'escalera'] }] },
        { texto: 'La escalera mide el doble que el piso:', ecuacion: ['escalera = 2 · 1,5 = ', res('3 m')] },
        { texto: 'La altura sale de Pitágoras:', ecuacion: [raizDif('3', '1,5', 'i'), ' = √6,75 = 1,5√3 ≈ ', res('2,6 m')] },
      ],
      respuesta: ['Escalera: ', res('3 m'), '; llega a unos ', res('2,6 m')] },
    { nivel: 3, titulo: 'Una expresión de examen',
      enunciado: ['¿Cuánto vale 4 ', { sup: ['sen', '2'] }, ' 60° − 2 tan 45° + √2 · sen 45°?'],
      datos: [DR.razones, DN.t30, DN.t45, DN.racio],
      solucion: [
        { texto: 'Cada razón, con su figura:', ecuacion: [...sen_(60), ' = ', { frac: ['√3', '2'] }, SEP, ...tan_(45), ' = 1', SEP, ...sen_(45), ' = ', { frac: ['√2', '2'] }] },
        { texto: 'Reemplazo:', ecuacion: ['4 · ', { frac: ['3', '4'] }, ' − 2 · 1 + √2 · ', { frac: ['√2', '2'] }, ' = 3 − 2 + 1 = ', res('2')] },
      ],
      respuesta: [res('2')] },
  ];

  // «Ahora tú», tipo 0: el valor exacto de una razón notable (sen, cos o tan de 30°, 45° o 60°).
  function casoValorNotable(r) {
    const g = r.uno([30, 45, 60]), rz = r.uno(['sen', 'cos', 'tan']), bien = NOT[rz][g];
    // Desde 45°, los dos notables que no son (antes solo 30°: tan 45° y tan 30° salían con tres opciones; auditoría, 17 nov).
    const otros = g === 45 ? [30, 60] : [90 - g];
    return {
      pregunta: `¿Cuál es el valor exacto de ${rz} ${g}°?`,
      datos: [DR.razones, DN.t30, DN.t45, DN.racio],
      opciones: opciones(Ex.txt(bien), [
        { id: 'cambia', valor: Ex.txt(NOT_MAL.cambia[rz][g]), error: 'NOT-MISMO', siFuera: `Usar la figura está bien; pero ese cateto es el del otro ángulo. Nómbralo desde ${g}°.` },
        { id: 'largo', valor: Ex.txt(NOT_MAL.largo[rz][g]), error: 'TR7', siFuera: 'Ese es el largo de un lado, bien ubicado; la razón lo divide entre otro lado.' },
        { id: 'inversa', valor: Ex.txt(NOT_MAL.inversa[rz][g]), error: 'REC-INVERSA', siFuera: 'Los dos lados son los correctos; pero el cociente está al revés.' },
        ...otros.map(o => ({ id: `otro${o}`, valor: Ex.txt(NOT[rz][o]), error: 'NOT-CAMBIA', siFuera: `Ese es ${rz} ${o}°: revisa qué ángulo queda frente a cada lado.` })),
      ].concat(rz === 'tan' ? [{ id: 'hip', valor: Ex.txt(NOT.sen[g]), error: 'TAN-H', siFuera: 'Poner arriba el cateto de enfrente está bien; la tangente lo divide entre el otro cateto, no la hipotenusa.' },
        { id: 'cos', valor: Ex.txt(NOT.cos[g]), error: 'TR9', siFuera: 'Usar la figura está bien; pero ese cociente es el coseno: la tangente divide los dos catetos.' }] : []), x => x),
      solucion: { texto: g === 45 ? 'En la media loseta: catetos 1 y 1, hipotenusa √2.' : `En la media señal: frente a 30°, 1; frente a 60°, √3; hipotenusa 2.`, ecuacion: [`${rz} ${g}° = `, res(Ex.txt(bien))] },
      // Las dos escuadras con sus lados, sin colores (lector en frío, 17 nov: era la única «Ahora tú» sin dibujo).
      dibujo: { datos: escuadrasRef(false), estado: {} },
    };
  }
  // «Ahora tú», tipo 1: reconocer el ángulo notable por sus lados, en un objeto. Se dan la hipotenusa y un cateto; el
  // otro va con «?». Desde θ (en a), el adyacente es ra y el opuesto rb.
  // Objetos con ángulos creíbles (auditoría, 17 nov: salían rampas de 30° y 60°, que son paredes): sin la rampa, y la
  // escalera solo con 45° o 60° con el piso; el cable y el sol, con los tres.
  const HIP_REC = { escalera: [2, 4], poste: [4, 6, 8] }, ANG_REC = { escalera: [45, 60], poste: [30, 45, 60] };
  function casoReconoce(r) {
    const o = r.uno(OBJS.filter(x => HIP_REC[x.objeto])), g = r.uno(ANG_REC[o.objeto]), H = r.uno(HIP_REC[o.objeto]), m = H / 2;
    const raiz = k => `${m === 1 ? '' : f(m)}√${k}`;
    const lado = { 30: { ra: [m * Math.sqrt(3), raiz(3)], rb: [m, f(m)] }, 45: { ra: [m * Math.SQRT2, raiz(2)], rb: [m * Math.SQRT2, raiz(2)] }, 60: { ra: [m, f(m)], rb: [m * Math.sqrt(3), raiz(3)] } }[g];
    const dado = r.uno(['ra', 'rb']), otro = dado === 'ra' ? 'rb' : 'ra';
    // Colores por el nombre del lado desde θ (auditoría, 17 nov: la hipotenusa iba en turquesa y el dato siempre en
    // naranja, y con 60° y el adyacente dado el color llevaba a 30°): la hipotenusa en tinta, el adyacente ra turquesa y
    // el opuesto rb naranja.
    const lad = { h: { texto: `${f(H)} ${o.u}` }, [dado]: { texto: `${lado[dado][1]} ${o.u}`, color: desde('a').co === dado ? 'o' : 'i' }, [otro]: { texto: '?' } };
    const fig_ = g === 45 ? 'la media loseta' : 'la media señal';
    return {
      pregunta: [`${o.intro} Con las medidas de la figura, ¿cuánto mide `, thN, `, el ángulo ${o.a}?`],
      datos: [DR.razones, DN.t30, DN.t45],
      dibujo: figO(o, lado.ra[0], lado.rb[0], lad, { a: { texto: 'θ' } }),
      opciones: opciones(`${g}°`, [
        { id: 'otro', valor: `${g === 45 ? 30 : 90 - g}°`, error: 'NOT-CAMBIA', siFuera: 'Buscar un ángulo notable está bien; revisa qué lado queda frente a θ y cuál lo toca.' },
        { id: 'cuad', valor: `${g === 45 ? 60 : 45}°`, error: 'NOT-MISMO', siFuera: 'Pensar en un notable está bien; revisa si los lados son de media loseta o de media señal.' },
        { id: 'medir', valor: 'Sin transportador no se sabe', error: 'NOT-ADIVINA', siFuera: 'Medir ayudaría; pero el cociente de dos lados ya fija el ángulo.' },
      ], x => x),
      solucion: { texto: `${lado[dado][1]} ${o.u} y ${f(H)} ${o.u}: es el cociente de ${fig_}, desde ${g}°.`, ecuacion: [thN, ' = ', res(`${g}°`)] },
    };
  }
  // Expresiones con notables. Las de «Ahora tú» (tipo 2, nivel de examen) mezclan tres razones o un múltiplo de θ.
  const EXPR_EXAMEN = [
    { e: [[1, ['sen', 30]], [1, ['cos', 60]], [1, ['tan', 45]]] },
    { e: [[2, ['sen', 30], ['tan', 60]], [1, ['tan', 30]]] },
    { e: [[4, ['sen', 60, 2]], [-1, ['tan', 45]], [2, ['cos', 60]]] },
    // Antes 2 sen² 45° + tan 60° · tan 30°: por simetría, NOT-MISMO daba la correcta y salían tres opciones (17 nov).
    { e: [[2, ['sen', 45, 2]], [1, ['tan', 60], ['cos', 30]]] },
    { e: [[1, ['cos', 30], ['tan', 30]], [1, ['sen', 30]]] },
    { e: [[1, ['sen', 60], ['cos', 30]], [-1, ['sen', 30], ['cos', 60]]] },
    { e: [[1, ['sen', 30]], [1, ['tan', 45]]], th: 15, args: { sen30: '2θ', tan45: '3θ' } },
    { e: [[2, ['cos', 60]], [1, ['tan', 60, 2]]], th: 30, args: { cos60: '2θ', tan60: '2θ' } },
    { e: [[1, ['sen', 30], ['tan', 60]], [1, ['cos', 30]]], th: 10, args: { sen30: '3θ', tan60: '6θ', cos30: '3θ' } },
  ];
  function casoExpresion(r) {
    const x = r.uno(EXPR_EXAMEN), bien = ev(x.e);
    const malos = [['cambia', 'NOT-MISMO', 'Las razones están bien ubicadas en su figura; pero usaste el cateto del otro ángulo agudo.'],
      ['largo', 'TR7', 'Reemplazar cada razón es el camino; pero pusiste el largo de un lado y no su cociente.'],
      ['inversa', 'REC-INVERSA', 'Reemplazar cada razón es el camino; pero cada cociente está al revés.']];
    const pre = x.th ? ['Si ', thN, ` = ${x.th}°, ¿cuánto vale `] : ['¿Cuánto vale '];
    return {
      pregunta: [...pre, ...ecu(x.e, x.args || {}), '?'],
      datos: [DR.razones, DN.t30, DN.t45, DN.racio],
      opciones: opciones(Ex.txt(bien), malos.map(([k, err, sf]) => ({ id: k, valor: Ex.txt(ev(x.e, NOT_MAL[k])), error: err, siFuera: sf })), x => x),
      solucion: { texto: x.th ? 'Primero calculo cada ángulo; después reemplazo cada razón con su figura y opero.' : 'Reemplazo cada razón con su valor exacto y opero.', ecuacion: [...ecu(x.e), ' = ', res(Ex.txt(bien))] },
    };
  }
  // «Así se resuelve»: una expresión con dos notables, paso a paso (otra pregunta que la de «Ahora tú»).
  const EXPR_RES = [
    [[1, ['sen', 60], ['tan', 30]], [1, ['cos', 60]]],
    [[2, ['cos', 45], ['sen', 45]], [1, ['tan', 60]]],
    [[1, ['tan', 60]], [-1, ['tan', 30]]],
    [[1, ['sen', 30], ['cos', 30]], [1, ['sen', 60], ['cos', 60]]],
    [[3, ['tan', 30], ['tan', 30]], [1, ['sen', 30]]],
    [[2, ['sen', 30]], [1, ['cos', 45], ['cos', 45]]],
  ];

  const notables = {
    id: 'notables',
    titulo: 'Medio cuadrado, medio equilátero',
    pregunta: '¿De dónde salen los valores exactos de 30°, 45° y 60°?',
    temas: ['Ángulos notables'],
    pieza: OB,
    aprendizaje: 'Media loseta: lados 1, 1 y √2 (45°). Media señal: 1, √3 y 2 (30° y 60°). Esos lados dan razones exactas.',
    actividad: 'Cortar una loseta y una señal por la mitad y medir sus lados.',
    // Lee: qué es un ángulo notable, de qué figuras salen y cómo se racionaliza, sin dar ningún valor de 60° (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Ángulos que se repiten', texto: 'En los exámenes vuelven siempre 30°, 45° y 60°: son los ángulos notables. Sus razones se escriben exactas, con raíces, sin calculadora. Las dos escuadras del colegio los traen: la de 45° y la de 30° y 60°.',
          pieza: OB, dibujo: { datos: { objeto: 'escuadras', angulos: { a30: { texto: '30°' }, a60: { texto: '60°' }, e1: { texto: '45°' }, e2: { texto: '45°' } } }, estado: {} } },
        // Con dibujo: el título habla del medio equilátero (lector en frío, 17 nov). La loseta está en el juego.
        { titulo: 'Dos figuras partidas', texto: 'Un cuadrado cortado por su diagonal da dos triángulos iguales con 45° y 45°. Un triángulo equilátero, de lados iguales y ángulos de 60°, cortado por su altura, da dos con 30° y 60°.',
          pieza: OB, dibujo: { datos: { objeto: 'senal', medidas: { lado: 2 }, angulos: { esquina: { texto: '60°' }, punta: { texto: '30°' } } }, estado: {} } },
        { titulo: 'La raíz va arriba', texto: 'Las respuestas se escriben sin raíz abajo. Para eso se racionaliza: se multiplica arriba y abajo por la misma raíz. √2 ≈ 1,41 y √3 ≈ 1,73.',
          ecuacion: [{ frac: ['1', '√2'] }, ' = ', { frac: ['1 · √2', '√2 · √2'] }, ' = ', { frac: ['√2', '2'] }] },
        { titulo: 'Qué mirar al jugar', texto: 'Empiezas con la señal; después puedes cortar la loseta. Cambia el lado y mira qué lado sale entero y cuál lleva raíz.' },
      ],
    },
    ejemplos: EJEMPLOS_NOTABLES,
    juega: {
      pieza: OB,
      consigna: 'Una señal «Ceda el paso» y una loseta cuadrada se cortan por la mitad. Cada mitad es un triángulo rectángulo.',
      mision: {
        texto: 'Arma la escuadra de 30° y 60° con 30 cm frente a 30°.',
        logrado: val => val.fig === 'eq' && val.L === 60,
        bien: 'Listo: frente a 30° hay 30 cm, la mitad de los 60 cm de la hipotenusa.',
      },
      voz: '¿Qué lado sale entero y cuál con raíz?',
      leyenda: [
        { s: '30°, 45°, 60°', t: 'los ángulos de cada mitad' },
        { s: op('naranja'), t: 'cateto opuesto al ángulo de abajo' },
        { s: ad('turquesa'), t: 'cateto adyacente al ángulo de abajo' },
        { s: '√2, √3', t: 'raíces cuadradas: unos 1,41 y 1,73' },
        { s: '- - -', t: 'la altura que corta la señal' },
        { s: '≈', t: 'aproximado, redondeado' },
      ],
      // Empieza en la señal: la misión es de 30° y 60° (lector en frío, 17 nov: empezaba en la loseta de 45°).
      controles: [
        { id: 'fig', etiqueta: 'Figura', opciones: [{ valor: 'eq', texto: 'Señal' }, { valor: 'cu', texto: 'Loseta' }], inicio: 'eq' },
        { id: 'L', etiqueta: 'Lado', min: 20, max: 80, paso: 20, inicio: 40, unidad: 'cm', decimales: 0 },
      ],
      dibujo: v => ({ datos: notJ(v), estado: {} }),
      lectura: v => (v.fig === 'eq'
        ? ['Frente a 30°: ', op(`${f(v.L / 2)} cm`), ', la mitad de ', `${v.L} cm`]
        : ['Diagonal = ', `${v.L}√2 cm`, ` ≈ ${f(v.L * Math.SQRT2, 1)} cm; catetos iguales: `, op(`${v.L}`), ' y ', ad(`${v.L}`)]),
      minimo: 3,
    },
    predice: {
      pregunta: ['En la media señal de 40 cm, ', junto('sen 30° = 20/40 = 1/2'), '. Ahora mira desde 60°, arriba. ¿Cuánto vale sen 60°?'],
      datos: ['Lado de la señal: 40 cm; media base: 20 cm', '√3 ≈ 1,73'],
      voz: 'Busca el lado que queda frente a 60°.',
      opciones: [
        { id: 'c', texto: '√3/2 ≈ 0,87', correcta: true },
        { id: 'doble', texto: '1, el doble de 1/2', error: 'TR10', siFuera: 'Duplicar tendría sentido si el seno creciera como el ángulo; no crece así.' },
        // Sin «20√3, la altura»: regalaba lo que había que pensar (lector en frío, 17 nov). Este error es real: dividir
        // entre la media base da tan 60°.
        { id: 'tan', texto: '√3 ≈ 1,73', error: 'TR9', siFuera: 'Mirar la altura, frente a 60°, está bien; pero dividirla entre la media base da la tangente.' },
        { id: 'mismo', texto: '1/2, igual que sen 30°', error: 'NOT-MISMO', siFuera: 'Es el mismo triángulo, cierto; pero frente a 60° está la altura, no la media base.' },
      ],
      dibujo: { datos: senalP(false), estado: {} },
      revelar: { datos: senalP(true), estado: {} },
      coincide: 'Coincide: frente a 60° está la altura, 20√3 cm; entre 40 cm da √3/2.',
      noCoincide: 'Revisemos: frente a 60° está la altura, 20√3 cm, sobre la hipotenusa de 40 cm.',
    },
    mira: {
      pieza: OB,
      datos: ESCUADRAS,
      voz: 'Primero los tres lados; después, los cocientes.',
      pasos: [
        { estado: { paso: 0 }, texto: 'La escuadra de 30° y 60° es media señal: hipotenusa 2, cateto corto 1.' },
        { estado: { paso: 1 }, texto: 'El otro cateto sale de Pitágoras.', ecuacion: [{ raiz: [[cuad('2'), ' − ', cuad('1')]] }, ' = √3'] },
        { estado: { paso: 2 }, texto: 'Desde 30°: enfrente queda el 1 y lo toca el √3.', ecuacion: [...sen_(30), ' = ', { frac: [op('1'), '2'] }, SEP, ...cos_(30), ' = ', { frac: [ad('√3'), '2'] }, SEP, ...tan_(30), ' = ', { frac: [op('1'), ad('√3')] }, ' = ', { frac: ['√3', '3'] }] },
        { estado: { paso: 3 }, texto: 'Desde 60°, los catetos se intercambian.', ecuacion: [...sen_(60), ' = ', { frac: [ad('√3'), '2'] }, SEP, ...cos_(60), ' = ', { frac: [op('1'), '2'] }, SEP, ...tan_(60), ' = √3'] },
        { estado: { paso: 4 }, texto: 'La escuadra de 45° es media loseta: catetos 1 y 1.', ecuacion: ['H = ', { raiz: [[cuad('1'), ' + ', cuad('1')]] }, ' = √2'] },
        { estado: { paso: 5 }, texto: 'Desde 45°, los dos catetos miden igual.', ecuacion: [...sen_(45), ' = ', ...cos_(45), ' = ', { frac: [op('1'), '√2'] }, ' = ', { frac: ['√2', '2'] }, SEP, ...tan_(45), ' = 1'] },
      ],
    },
    mundo: MUNDO.notables,
    regla: {
      texto: 'Los ángulos notables tienen razones exactas: 30° y 60° salen de media señal, con lados 1, √3 y 2; 45° sale de media loseta, con 1, 1 y √2.',
      // Las nueve razones (lector en frío, 17 nov: solo estaban los senos y «coseno y tangente salen de esos lados» no se
      // entendía).
      // Como tabla: una línea por ángulo, con las fracciones escritas en línea (una fracción apilada deja partir el renglón
      // justo antes del «;»; así solo parte después).
      ecuacion: [junto('30°: sen = 1/2;'), ' ', junto('cos = √3/2;'), ' ', junto('tan = √3/3'), SEP,
        junto('45°: sen = cos = √2/2;'), ' ', junto('tan = 1'), SEP,
        junto('60°: sen = √3/2;'), ' ', junto('cos = 1/2;'), ' ', junto('tan = √3')],
      condicion: 'el ángulo es 30°, 45° o 60°. Cada razón se lee desde su ángulo, en su escuadra; raíz abajo, se racionaliza.',
      voz: 'Dos figuras bastan para los tres ángulos.',
    },
    resuelve: {
      pieza: OB,
      generar(s) {
        const x = EXPR_RES[s % EXPR_RES.length], bien = ev(x);
        const usadas = [...new Set(x.flatMap(([, ...fs]) => fs.map(([rz, g]) => `${rz}${g}`)))];
        const valores = usadas.flatMap((k, i) => { const rz = k.slice(0, 3), g = +k.slice(3); return [i ? ';   ' : '', `${rz} ${g}° = `, Ex.txt(NOT[rz][g])]; });
        const de45 = usadas.some(k => k.endsWith('45')), de3060 = usadas.some(k => !k.endsWith('45'));
        return {
          enunciado: ['Halla el valor exacto de ', ...ecu(x), '.'],
          datos: [DR.razones, DN.t30, DN.t45, DN.racio],
          dibujo: { datos: escuadrasRef(true), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden un número exacto: sin redondear y con la raíz arriba.' },
            { tipo: 'datos', texto: `Aparecen ${usadas.length} razones de ángulos notables${de45 && de3060 ? ', de las dos escuadras' : de45 ? ', de la escuadra de 45°' : ', de la escuadra de 30° y 60°'}.` },
            { tipo: 'regla', texto: 'Cada razón sale de su escuadra, con los lados nombrados desde su ángulo. Si queda raíz abajo, se racionaliza.' },
            { tipo: 'cuentas', texto: 'El valor de cada razón:', ecuacion: valores },
            { tipo: 'cuentas', texto: 'Reemplazo y opero: primero los productos, después las sumas.', ecuacion: [...ecu(x), ' = ', res(Ex.txt(bien))] },
            { tipo: 'sentido', texto: `Con calculadora, la expresión da ${f(Ex.num(bien), 3)} y ${Ex.txt(bien)} ≈ ${f(Ex.num(bien), 3)}. Cuadra.` },
          ],
          respuesta: [res(Ex.txt(bien))],
        };
      },
    },
    ahoraTu: {
      pieza: OB,
      voz: 'Piensa en la escuadra que trae ese ángulo.',
      generar(sem) {
        const r = azar(sem + 53);
        return conCuatro([casoValorNotable, casoReconoce, casoExpresion][sem % 3], r);
      },
    },
  };

  // ---------- Idea 4 (rehecha, 17 nov): 37° y 53°, el 3-4-5 ----------
  // Objeto de la primera pantalla: el albañil que marca una esquina recta con estacas y una cuerda de 3, 4 y 5 m (pieza
  // trig-objeto, objeto «cuerda»), con un transportador que mide de 1° en 1°.
  // Cambia: la estaca (de 1 a 6 m). · Permanece: la base de 4 m y la esquina recta.
  // Progresa: la cuerda (Pitágoras) y la lectura del transportador. · Se reserva: si 37° es exacto (la predicción).
  // Debe verse: el 3-4-5 da un ángulo de 36,87° que el examen llama 37°; los lados van como 3k, 4k y 5k.
  // Colores (regla de la unidad): desde θ, en el transportador, la estaca (opuesto) naranja, la base (adyacente) turquesa
  // y la cuerda (hipotenusa) en tinta; θ, carmín. Antes la cuerda era violeta y el violeta había sido el piso en la idea 1
  // (lector en frío, 17 nov). En los ejemplos con un ángulo con número, desde ese ángulo. Convención (decisiones, 17 nov):
  // «≈» en la teoría; en `datos`, «sen 37° = 3/5 (convención del examen)»; la condición de la regla explica por qué.
  // Errores (hipótesis salvo TR8 y TR9): APROX-EXACTO toma la convención por exacta, APROX-ENTERO cree que el ángulo es
  // entero, TR8 cree que el ángulo cambia con el tamaño, ANG-OTRO usa las partes del otro ángulo (3 ↔ 4), TR9 da otro
  // lado, K-SIN-DIVIDIR toma el dato como k sin dividirlo entre sus partes, REC-INVERSA invierte el cociente.
  const EX37 = Math.atan(3 / 4) * GRA, EX16 = Math.atan(7 / 24) * GRA;
  const BASE4 = 4, cuerdaDe = co => Math.hypot(co, BASE4);
  const cuerdaJ = v => ({ objeto: 'cuerda', marco: [4, 6], medidas: { base: BASE4, estaca: v.co },
    lados: { base: { color: 'i', texto: '4 m' }, estaca: { color: 'o', texto: `${f(v.co)} m` }, cuerda: { texto: largoTxt(cuerdaDe(v.co)) } },
    angulos: { transportador: { texto: `${Math.round(Math.atan2(v.co, BASE4) * GRA)}°` } } });
  const cuerdaP = rev => ({ objeto: 'cuerda', marco: [4, 6], medidas: { base: BASE4, estaca: 3 },
    lados: { base: { color: 'i', texto: '4 m' }, estaca: { color: 'o', texto: '3 m' }, cuerda: { texto: '5 m' } },
    angulos: { transportador: { texto: rev ? `${f(EX37)}°` : '37°' } }, nota: rev ? `tan θ = 3/4 = 0,75  →  θ ≈ ${f(EX37)}°` : undefined });
  // Convención del examen y k, como datos (decisiones, 17 nov).
  const DA = {
    // La forma de las decisiones y de la práctica, «(convención del examen)», con el paréntesis entero sin partirse (lector
    // en frío, 17 nov: el «(» quedaba solo al final de la línea).
    c37: [junto('sen 37° = 3/5'), ' y ', junto('cos 37° = 4/5'), ' ', junto('(convención del examen)')],
    c16: [junto('sen 16° = 7/25'), ' y ', junto('cos 16° = 24/25'), ' ', junto('(convención del examen)')],
    par37: '37° + 53° = 90°: son los dos agudos del mismo triángulo.',
    par16: '16° + 74° = 90°: son los dos agudos del mismo triángulo.',
    // Dicho como herramienta, no como el paso hecho (lector en frío, 17 nov: «la línea de k no se entiende sola»).
    k: 'k: lo que mide una parte. Si una razón vale a/b, sus dos lados miden a·k y b·k.',
    // Las dos convenciones en una línea, para el ejemplo que usa las dos (antes «convención del examen» salía dos veces).
    c37y16: [junto('sen 37° = 3/5,'), ' ', junto('cos 37° = 4/5,'), ' ', junto('sen 16° = 7/25'), ' y ', junto('cos 16° = 24/25'), ' ', junto('(convención del examen)')],
    // El rectángulo que arma la altura del trapecio (el mismo dato de la práctica; auditoría, 17 nov: «AH mide lo mismo
    // que DC» se usaba sin estar en los datos).
    trap: 'AHCD es un rectángulo: CH mide igual que AD, y AH igual que DC.',
  };
  // Las ternas: partes frente a cada ángulo (op), junto a él (ad) y la hipotenusa (h).
  const TERNA = {
    37: { op: 3, ad: 4, h: 5, datos: [DA.c37] }, 53: { op: 4, ad: 3, h: 5, datos: [DA.c37, DA.par37] },
    16: { op: 7, ad: 24, h: 25, datos: [DA.c16] }, 74: { op: 24, ad: 7, h: 25, datos: [DA.c16, DA.par16] },
  };

  // Ejemplos resueltos de «37° y 53°: el 3-4-5». Cuentas rehechas con un script aparte, sin el código de la unidad
  // (scratchpad e2-trig-resto/cuentas-idea4.js): tan 37° = 3/4; cos 53° = 3/5; sen 74° = 2,4/2,5 = 24/25;
  // arctan(7/24) ≈ 16,26°; 15 = 5k → k = 3; 2,5 = 5k → 4k = 2; 0,7 = 7k → 25k = 2,5; 6 = 3k → 5k = 10; 8 = 4k → 3k = 6;
  // 12 = 4k → 12k = 36; 24 = 4k → 3k + 4k + 5k = 72; 12 = 3k → AB = 10 + 16 = 26; 8 = 4k → 12 + 10 + 6 + 8 = 36 y 36 · 5 = 180;
  // 2,4 − 2 = 0,4 (k₁ = 0,1 y k₂ = 0,5); 12 = 3k → 16 y 12 = 4k → 9, 16 − 9 = 7.
  const EJEMPLOS_APROX = [
    { nivel: 1, titulo: 'La tangente de 37°',
      figura: fig({ objeto: 'cuerda', medidas: { base: 4, estaca: 3 }, lados: { base: L2('4 m', 'i'), estaca: L2('3 m', 'o'), cuerda: L2('5 m') }, angulos: { transportador: { texto: '37°' } } }),
      enunciado: 'El albañil marcó su esquina con 3 m, 4 m y una cuerda de 5 m. El ángulo de la punta de la base se llama 37°. ¿Cuánto vale tan 37°?',
      datos: [DR.razones, DA.c37],
      solucion: [
        { texto: ['Desde 37°, enfrente queda la estaca, ', op('3 m'), ', y lo toca la base, ', ad('4 m'), '.'] },
        // Con la convención dicha (auditoría, 17 nov: «tan 37° = 0,75» sin decirla, en la idea que enseña que 37° no es exacto).
        { texto: 'Opuesto entre adyacente, con la convención del examen:', ecuacion: ['tan 37° = ', { frac: [op('3'), ad('4')] }, ' = ', res('0,75')] },
      ],
      respuesta: ['tan 37° = ', res('3/4'), ' (convención del examen)'] },
    { nivel: 1, titulo: 'El coseno de 53°',
      // Desde 53°, en la estaca: la estaca lo toca (adyacente, turquesa) y la base queda enfrente (naranja).
      figura: fig({ objeto: 'cuerda', medidas: { base: 4, estaca: 3 }, lados: { base: L2('4 m', 'o'), estaca: L2('3 m', 'i'), cuerda: L2('5 m') }, angulos: { arriba: { texto: '53°' } } }),
      enunciado: 'En la misma esquina de 3, 4 y 5 m, el ángulo de arriba, en la estaca, se llama 53°. ¿Cuánto vale cos 53°?',
      datos: [DR.razones, DA.c37, DA.par37],
      solucion: [
        { texto: ['El 53° está en la estaca. Lo toca el lado de ', ad('3 m'), '; la hipotenusa es la cuerda, ', '5 m', '.'] },
        { texto: 'Adyacente entre hipotenusa:', ecuacion: ['cos 53° = ', { frac: [ad('3'), '5'] }, ' = ', res('0,6')] },
      ],
      respuesta: ['cos 53° = ', res('3/5')] },
    { nivel: 1, titulo: 'La escalera de 74°',
      // Sin la convención de 16° en los datos: el resuelto no la usa (lector en frío, 17 nov).
      figura: fig({ objeto: 'escalera', medidas: { ra: 0.7, rb: 2.4 }, lados: tres(L2('0,7 m', 'i'), L2('2,4 m', 'o'), L2('2,5 m')), angulos: { a: { texto: '74°' } } }),
      enunciado: 'Una escalera de 2,5 m llega a 2,4 m de alto y forma 74° con el piso. ¿Cuánto vale sen 74°?',
      datos: [DR.razones],
      solucion: [
        { texto: ['Desde 74°, en el pie, enfrente queda la pared, ', op('2,4 m'), '; la hipotenusa es la escalera, ', '2,5 m', '.'] },
        { texto: 'Opuesto entre hipotenusa:', ecuacion: ['sen 74° = ', { frac: [op('2,4'), '2,5'] }, ' = ', res('24/25')] },
      ],
      respuesta: ['sen 74° = ', res('24/25 = 0,96')] },
    { nivel: 1, titulo: '¿Cuánto mide de verdad?',
      enunciado: 'En el triángulo de lados 7, 24 y 25, el ángulo frente al 7 se llama 16°. ¿Cuánto mide de verdad, con dos decimales?',
      // Una tabla de calculadora para elegir, no la respuesta escrita (auditoría, 17 nov: el dato decía «mide 16,26°»).
      // Cuentas aparte: 7/24 = 0,29167; tan 16° = 0,28675; tan 16,26° = 0,29164; tan 16,5° = 0,29621.
      datos: [DR.razones, 'Con calculadora: tan 16° ≈ 0,2867; tan 16,26° ≈ 0,2917; tan 16,5° ≈ 0,2962.'],
      solucion: [
        { texto: 'Su tangente es opuesto entre adyacente:', ecuacion: ['tan θ = ', { frac: [op('7'), ad('24')] }, ' ≈ 0,2917'] },
        { texto: ['En la tabla, esa tangente es la de 16,26°: θ mide unos 16,26°. El examen lo redondea a 16°: es una convención.'] },
      ],
      respuesta: ['Unos ', res('16,26°')] },
    { nivel: 1, titulo: '¿Cuánto vale k?',
      enunciado: 'Un triángulo rectángulo de 37° y 53° tiene una hipotenusa de 15 m. Sus lados van como 3k, 4k y 5k. ¿Cuánto vale k?',
      // Herramienta, no el paso hecho (auditoría, 17 nov: «La hipotenusa es el lado mayor: 5k» era el único paso).
      datos: [DA.k, DL.h],
      solucion: [
        { texto: 'La hipotenusa tiene 5 partes:', ecuacion: ['5k = ', '15 m', '   →   k = 15 ÷ 5 = ', res('3 m')] },
      ],
      respuesta: ['k = ', res('3 m')] },
    { nivel: 2, titulo: 'La escalera de 53°',
      figura: fig({ objeto: 'escalera', medidas: { ra: 1.5, rb: 2 }, lados: { rb: L2('?'), h: L2('2,5 m') }, angulos: { a: { texto: '53°' } } }),
      enunciado: 'Una escalera de 2,5 m forma 53° con el piso. ¿A qué altura de la pared llega?',
      datos: [DA.c37, DA.par37, DA.k],
      solucion: [
        { texto: 'sen 37° = 3/5 y cos 37° = 4/5: frente a 37° van 3 partes, junto a él 4 y en la hipotenusa 5. La escalera es 5k:', ecuacion: ['5k = ', '2,5', '   →   k = 0,5'] },
        { texto: 'Frente a 53°, el otro agudo, van las otras 4 partes: la pared.', ecuacion: ['4k = 4 · 0,5 = ', res('2 m')] },
      ],
      respuesta: ['Llega a ', res('2 m')] },
    { nivel: 2, titulo: 'La rampa de 16°',
      figura: fig({ objeto: 'rampa', medidas: { ra: 2.4, rb: 0.7 }, lados: { rb: L2('0,7 m', 'o'), h: L2('?') }, angulos: { a: { texto: '16°' } } }),
      enunciado: 'Una rampa forma 16° con el piso y sube 0,7 m. ¿Cuánto mide la rampa?',
      datos: [DA.c16, DA.k],
      solucion: [
        { texto: 'sen 16° = 7/25: frente a 16° van 7 partes y en la hipotenusa, 25. Frente a 16° va lo que sube:', ecuacion: ['7k = ', op('0,7'), '   →   k = 0,1'] },
        { texto: 'La rampa es la hipotenusa: 25 partes.', ecuacion: ['25k = 25 · 0,1 = ', res('2,5 m')] },
      ],
      respuesta: ['La rampa mide ', res('2,5 m')] },
    { nivel: 2, titulo: 'El cable de 37°',
      figura: fig({ objeto: 'poste', medidas: { ra: 8, rb: 6 }, lados: { rb: L2('6 m', 'o'), h: L2('?') }, angulos: { a: { texto: '37°' } } }),
      enunciado: 'Un cable va de la punta de un poste de 6 m a una estaca y forma 37° con el suelo. ¿Cuánto mide el cable?',
      datos: [DA.c37, DA.k],
      solucion: [
        { texto: 'sen 37° = 3/5: frente a 37° van 3 partes y en la hipotenusa, 5. Frente a 37° queda el poste:', ecuacion: ['3k = ', op('6'), '   →   k = 2'] },
        { texto: 'El cable es la hipotenusa: 5 partes.', ecuacion: ['5k = 5 · 2 = ', res('10 m')] },
      ],
      respuesta: ['El cable mide ', res('10 m')] },
    { nivel: 2, titulo: 'La sombra de 53°',
      figura: fig({ objeto: 'poste', sombra: true, medidas: { ra: 6, rb: 8 }, lados: { rb: L2('8 m', 'o'), ra: L2('?') }, angulos: { a: { texto: '53°' } } }),
      enunciado: 'El sol forma 53° con el suelo y un poste de 8 m da sombra. ¿Cuánto mide la sombra?',
      datos: [DA.c37, DA.par37, DA.k],
      solucion: [
        { texto: 'En el 3-4-5, frente a 37° van 3 partes; frente a 53°, el otro agudo, 4. Frente a 53° queda el poste:', ecuacion: ['4k = ', op('8'), '   →   k = 2'] },
        { texto: 'La sombra toca al 53°: 3 partes.', ecuacion: ['3k = 3 · 2 = ', res('6 m')] },
      ],
      respuesta: ['La sombra mide ', res('6 m')] },
    { nivel: 2, titulo: 'El perímetro con k',
      enunciado: 'Un triángulo rectángulo tiene un ángulo de 37°, y el cateto que lo toca mide 12 cm. ¿Cuánto mide su perímetro?',
      datos: [DA.c37, DA.k, 'Perímetro: la suma de los tres lados.'],
      solucion: [
        { texto: 'cos 37° = 4/5: el cateto que toca a 37° tiene 4 partes y la hipotenusa, 5.', ecuacion: ['4k = ', ad('12'), '   →   k = 3'] },
        { texto: 'Los tres lados juntos son 3k + 4k + 5k = 12k:', ecuacion: ['12 · 3 = ', res('36 cm')] },
      ],
      respuesta: ['Perímetro: ', res('36 cm')] },
    { nivel: 3, titulo: 'La cartulina cortada',
      figura: fig({ objeto: 'figura', forma: 'diagonal', medidas: { ra: 24, rb: 18 }, lados: { AB: L2('24 cm', 'i') }, angulos: { A: { texto: '37°' } } }),
      enunciado: 'Una cartulina rectangular de 24 cm de largo se corta por su diagonal, que forma 37° con el largo. ¿Cuánto mide el perímetro de cada triángulo?',
      datos: [DA.c37, DA.k, 'Perímetro: la suma de los tres lados.'],
      solucion: [
        { texto: 'En el triángulo ABC, el largo AB toca a 37°: 4 partes.', ecuacion: ['4k = ', ad('24'), '   →   k = 6'] },
        { texto: 'El ancho, frente a 37°, es 3k; la diagonal, 5k:', ecuacion: ['3k = 18;   5k = 30'] },
        { texto: 'Los dos triángulos son iguales:', ecuacion: ['24 + 18 + 30 = ', res('72 cm')] },
      ],
      respuesta: ['Cada triángulo: ', res('72 cm')] },
    { nivel: 3, titulo: 'El terreno en trapecio',
      // AD y CD no son lados del triángulo HBC: en tinta. CH, el opuesto a 37°, en naranja (auditoría, 17 nov: AD iba en
      // naranja y el CO de verdad, CH, en tinta).
      figura: fig({ objeto: 'figura', forma: 'trapecio', menor: 10, medidas: { ra: 16, rb: 12 }, lados: { CD: L2('10 m'), DA: L2('12 m'), CH: { color: 'o' } }, angulos: { B: { texto: '37°' } } }),
      enunciado: 'Un terreno es un trapecio ABCD con AD = 12 m, perpendicular a las bases, y CD = 10 m. El lado BC forma 37° con AB. ¿Cuánto mide AB?',
      datos: [DA.c37, DA.k, DA.trap],
      solucion: [
        { texto: 'La altura CH arma el triángulo HBC, recto en H. Frente a 37° queda CH = 12 m: 3 partes.', ecuacion: ['3k = ', op('12'), '   →   k = 4'] },
        { texto: 'HB toca a 37°: 4 partes. Y AH mide lo mismo que DC.', ecuacion: ['HB = 4k = 16;   AB = AH + HB = 10 + 16 = ', res('26 m')] },
      ],
      respuesta: ['AB = ', res('26 m')] },
    { nivel: 3, titulo: 'Cercar el trapecio',
      figura: fig({ objeto: 'figura', forma: 'trapecio', menor: 6, medidas: { ra: 6, rb: 8 }, lados: { CD: L2('6 m'), DA: L2('8 m'), CH: { color: 'o' } }, angulos: { B: { texto: '53°' } } }),
      enunciado: 'Un corral es un trapecio ABCD con AD = 8 m, perpendicular a las bases, y CD = 6 m. BC forma 53° con AB. Cercarlo cuesta S/ 5 por metro. ¿Cuánto cuesta?',
      datos: [DA.c37, DA.par37, DA.k, DA.trap, 'Perímetro: la suma de los lados.'],
      solucion: [
        { texto: 'En el triángulo HBC, frente a 53° queda la altura CH = 8 m: 4 partes.', ecuacion: ['4k = ', op('8'), '   →   k = 2;   HB = 3k = 6;   BC = 5k = 10'] },
        { texto: 'AH mide lo mismo que DC: AB = 6 + 6 = 12 m. El perímetro y el costo:', ecuacion: ['12 + 10 + 6 + 8 = 36 m;   36 · 5 = ', res('S/ 180')] },
      ],
      respuesta: ['Cuesta ', res('S/ 180')] },
    // Las dos posiciones en el dibujo y un k para cada triángulo (lector en frío, 17 nov: la segunda posición no se veía,
    // k pasaba de 0,1 a 0,5 sin aviso y el 24 de «24k» no se explicaba).
    { nivel: 3, titulo: 'La escalera que resbala',
      figura: fig({ objeto: 'escalera', medidas: { ra: 1.5, rb: 2 }, otra: { ra: 0.7, rb: 2.4 }, lados: { h: L2('2,5 m') }, angulos: { a: { texto: '53°' }, pie2: { texto: '74°' } } }),
      enunciado: 'Una escalera de 2,5 m forma 74° con el piso. Resbala hasta formar 53°. En el dibujo, la posición de antes va punteada. ¿Cuántos metros bajó su punta en la pared?',
      datos: [DA.c37y16, DA.par16, DA.par37, DA.k],
      solucion: [
        { texto: ['Antes, 74°: es el otro agudo del 7\u201124\u201125. Frente a 16° van 7 partes (', junto('sen 16° = 7/25'), '); frente a 74°, las otras 24. La escalera tiene 25:'], ecuacion: [junto([{ sub: ['25k', '1'] }, ' = 2,5']), '   →   ', junto([{ sub: ['k', '1'] }, ' = 0,1']), SEP, junto(['pared = ', { sub: ['24k', '1'] }, ' = 2,4 m'])] },
        { texto: 'Después, con 53°, es otro triángulo: el 3-4-5, con su propio k. Frente a 53° van 4 partes:', ecuacion: [junto([{ sub: ['5k', '2'] }, ' = 2,5']), '   →   ', junto([{ sub: ['k', '2'] }, ' = 0,5']), SEP, junto(['pared = ', { sub: ['4k', '2'] }, ' = 2 m'])] },
        { texto: 'Bajó la diferencia:', ecuacion: ['2,4 − 2 = ', res('0,4 m')] },
      ],
      respuesta: ['Bajó ', res('0,4 m')] },
    { nivel: 3, titulo: 'La sombra que se acorta',
      figura: fig({ objeto: 'poste', sombra: true, medidas: { ra: 16, rb: 12 }, lados: { rb: L2('12 m', 'o'), ra: L2('?') }, angulos: { a: { texto: '37°' } } }),
      enunciado: 'Un poste de 12 m da sombra cuando el sol forma 37° con el suelo. Más tarde, el sol forma 53°. ¿Cuántos metros se acortó la sombra?',
      datos: [DA.c37, DA.par37, DA.k],
      solucion: [
        { texto: 'Con 37°, el poste queda enfrente: 3 partes; la sombra lo toca: 4.', ecuacion: ['3k = ', op('12'), '   →   k = 4;   sombra = 4k = 16 m'] },
        { texto: 'Con 53°, el poste tiene 4 partes y la sombra 3.', ecuacion: ['4k = 12   →   k = 3;   sombra = 3k = 9 m'] },
        { texto: 'Se acortó:', ecuacion: ['16 − 9 = ', res('7 m')] },
      ],
      respuesta: ['Se acortó ', res('7 m')] },
  ];

  // «Ahora tú», tipo 0: un lado de un objeto, con 37°, 53°, 16° o 74° y la convención (k).
  const OBJ_APROX = [
    { o: OBJS[0], g: 53, ks: [0.5, 0.6] }, { o: OBJS[0], g: 74, ks: [0.1, 0.12] }, { o: OBJS[1], g: 16, ks: [0.1, 0.2] },
    { o: OBJS[2], g: 37, ks: [2, 1.5] }, { o: OBJS[2], g: 53, ks: [2, 1.5] }, { o: OBJS[3], g: 37, ks: [2, 3] }, { o: OBJS[3], g: 53, ks: [1.5, 2] },
  ];
  // El papel de cada lado de un objeto con θ en a: ra toca a θ, rb queda enfrente, h es la hipotenusa.
  const PAPEL = { ra: 'ad', rb: 'op', h: 'h' };
  // Su color (regla de la unidad): el adyacente turquesa, el opuesto naranja, la hipotenusa en tinta.
  const COLOR_PAPEL = { ra: 'i', rb: 'o', h: undefined };
  function casoLadoK(r) {
    const { o, g, ks } = r.uno(OBJ_APROX), k = r.uno(ks), T = TERNA[g], u = o.u;
    const largo = x => `${f(x)} ${u}`, val = { ra: T.ad * k, rb: T.op * k, h: T.h * k };
    const [dado, pide] = r.uno([['h', 'rb'], ['rb', 'h'], ['rb', 'ra'], ['ra', 'rb'], ['h', 'ra']]);
    const tercero = ['ra', 'rb', 'h'].find(x => x !== dado && x !== pide);
    const otroG = { op: 'ad', ad: 'op', h: 'h' };
    const kMal = val[dado] / T[otroG[PAPEL[dado]]];
    return {
      pregunta: [`${o.intro} El ángulo ${o.a} mide ${g}°. Si ${o[dado]} mide ${largo(val[dado])}, ¿cuánto mide ${o[pide]}?`],
      datos: [...T.datos, DA.k],
      dibujo: figO(o, val.ra, val.rb, { [dado]: { texto: largo(val[dado]), color: COLOR_PAPEL[dado] }, [pide]: { texto: '?' } }, { a: { texto: `${g}°` } }),
      opciones: opciones(largo(val[pide]), [
        { id: 'otro', valor: largo(kMal * T[otroG[PAPEL[pide]]]), error: 'ANG-OTRO', siFuera: `Usar k está bien; pero esas partes son las del otro ángulo agudo. Frente a ${g}° van ${T.op}.` },
        { id: 'tercero', valor: largo(val[tercero]), error: 'TR9', siFuera: `Ese es ${o[tercero]}, bien calculado; se pedía ${o[pide]}.` },
        { id: 'sink', valor: largo(val[dado] * T[PAPEL[pide]]), error: 'K-SIN-DIVIDIR', siFuera: 'Multiplicar por las partes es el último paso; antes, k sale de dividir el dato entre sus partes.' },
        // Con la hipotenusa dada, ANG-OTRO coincide con el tercer lado: un cuarto error (17 nov). Las partes al revés.
        { id: 'inversa', valor: largo(val[dado] * T[PAPEL[dado]] / T[PAPEL[pide]]), error: 'REC-INVERSA', siFuera: `Comparar partes está bien; pero al revés: ${o[pide]} tiene ${T[PAPEL[pide]]} partes y ${o[dado]}, ${T[PAPEL[dado]]}.` },
      ], x => x),
      solucion: { texto: `${cap(o[dado])} tiene ${T[PAPEL[dado]]} partes: k = ${f(val[dado])} ÷ ${T[PAPEL[dado]]} = ${f(k)}. ${cap(o[pide])} tiene ${T[PAPEL[pide]]}.`, ecuacion: [`${T[PAPEL[pide]]} · ${f(k)} = `, res(largo(val[pide]))] },
    };
  }
  // «Ahora tú», tipo 1: una razón de 53° o de 74° con la convención (que solo da 37° y 16°), o la tangente de 37° o 16°.
  // Nunca sen o cos de 37° o 16°: están escritos en los datos (auditoría, 17 nov: pasaba en 32 de 133 casos). La misma
  // lista que la práctica (razonConvencion del generador).
  function casoRazonConv(r) {
    const [g, rz] = r.uno([[53, 'sen'], [53, 'cos'], [53, 'tan'], [74, 'sen'], [74, 'cos'], [74, 'tan'], [37, 'tan'], [16, 'tan']]), T = TERNA[g];
    const val = { sen: [T.op, T.h], cos: [T.ad, T.h], tan: [T.op, T.ad] }[rz], otro = { sen: [T.ad, T.h], cos: [T.op, T.h], tan: [T.ad, T.op] }[rz];
    const par = g === 53 || g === 37 ? 37 : 16;
    return {
      pregunta: `Con la convención del examen, ¿cuánto vale ${rz} ${g}°?`,
      datos: [DR.razones, ...TERNA[g].datos],
      opciones: opciones(frTxt(...val), [
        { id: 'otro', valor: frTxt(...otro), error: 'ANG-OTRO', siFuera: `Usar el triángulo de ${par}° está bien; pero ese valor se lee desde su otro ángulo agudo.` },
        { id: 'inversa', valor: frTxt(val[1], val[0]), error: 'REC-INVERSA', siFuera: 'Los dos lados son los correctos; pero el cociente está al revés.' },
        { id: 'tan', valor: frTxt(...(rz === 'tan' ? [T.op, T.h] : [T.op, T.ad])), error: 'TR9', siFuera: `Ubicar el triángulo está bien; ${rz} divide otros dos lados.` },
        // En la tangente, ANG-OTRO es la inversa: un cuarto error, el coseno (17 nov).
        { id: 'cos', valor: frTxt(...(rz === 'tan' ? [T.ad, T.h] : [T.ad, T.op])), error: 'TR9', siFuera: `Ubicar el triángulo está bien; pero ese cociente es otra razón: ${rz} = ${{ sen: 'CO/H', cos: 'CA/H', tan: 'CO/CA' }[rz]}.` },
      ], x => x),
      solucion: { texto: `En el triángulo de ${T.op === 3 || T.op === 4 ? '3, 4 y 5' : '7, 24 y 25'}, frente a ${g}° van ${T.op} partes y junto a él ${T.ad}.`, ecuacion: [`${rz} ${g}° = `, res(frTxt(...val))] },
    };
  }
  // «Ahora tú», tipo 2 (nivel de examen): el triángulo escondido en un trapecio o en una cartulina cortada.
  function casoFiguraAprox(r) {
    if (r.ent(0, 1)) {
      const g = r.uno([37, 53]), T = TERNA[g], k = r.uno([2, 3, 4]), men = r.uno([5, 6, 8, 10]);
      const CH = T.op * k, HB = T.ad * k, BC = T.h * k, AB = men + HB, per = AB + BC + men + CH;
      const pide = r.uno(['AB', 'BC', 'per']);
      const bien = { AB, BC, per }[pide], txt = { AB: 'la base AB', BC: 'el lado BC', per: 'el perímetro del trapecio' }[pide];
      const HBmal = T.op * CH / T.ad, mal = { AB: men + HBmal, BC: CH / T.ad * T.h, per: men + HBmal + CH / T.ad * T.h + men + CH }[pide];
      return {
        pregunta: `El trapecio ABCD tiene AD = ${CH} m, perpendicular a las bases, y CD = ${men} m. BC forma ${g}° con AB. ¿Cuánto mide ${txt}?`,
        datos: [...T.datos, DA.k, DA.trap],
        // AD y CD en tinta; CH, el opuesto al ángulo de B, en naranja (auditoría, 17 nov).
        dibujo: fig({ objeto: 'figura', forma: 'trapecio', menor: men, medidas: { ra: HB, rb: CH }, lados: { CD: { texto: `${men} m` }, DA: { texto: `${CH} m` }, CH: { color: 'o' } }, angulos: { B: { texto: `${g}°` } } }),
        opciones: opciones(`${f(bien)} m`, [
          { id: 'otro', valor: `${f(mal)} m`, error: 'ANG-OTRO', siFuera: `Ver el triángulo HBC está bien; pero frente a ${g}° van ${T.op} partes, no ${T.ad}.` },
          { id: 'hb', valor: `${f(pide === 'AB' ? HB : pide === 'BC' ? HB : AB + BC + men)} m`, error: pide === 'per' ? 'SUMA-INCOMPLETA' : 'TR9', siFuera: pide === 'per' ? 'Los lados están bien hallados; falta sumar AD, la altura.' : pide === 'AB' ? 'HB está bien hallado; AB también incluye AH, que mide lo mismo que DC.' : 'Ese es HB, bien hallado; BC es la hipotenusa del triángulo HBC.' },
          { id: 'sink', valor: `${f({ AB: men + CH * T.ad, BC: CH * T.h, per: men + CH * T.ad + CH * T.h + men + CH }[pide])} m`, error: 'K-SIN-DIVIDIR', siFuera: 'Multiplicar por las partes es el último paso; antes, k = altura ÷ sus partes.' },
        ], x => x),
        solucion: { texto: `En HBC, CH = ${CH} m son ${T.op} partes: k = ${k}. HB = ${HB} m, BC = ${BC} m y AB = ${men} + ${HB}.`, ecuacion: [{ AB: 'AB', BC: 'BC', per: 'Perímetro' }[pide], ' = ', res(`${f(bien)} m`)] },
      };
    }
    const k = r.uno([3, 4, 5, 6]), AB = 4 * k, BC = 3 * k, AC = 5 * k;
    return {
      pregunta: `Una cartulina rectangular ABCD de ${AB} cm de largo (AB) se corta por su diagonal AC, que forma 37° con AB. ¿Cuánto mide el perímetro de cada triángulo?`,
      datos: [DA.c37, DA.k, 'Perímetro: la suma de los lados.'],
      dibujo: fig({ objeto: 'figura', forma: 'diagonal', medidas: { ra: AB, rb: BC }, lados: { AB: { texto: `${AB} cm`, color: 'i' } }, angulos: { A: { texto: '37°' } } }),
      opciones: opciones(`${12 * k} cm`, [
        { id: 'otro', valor: `${f(AB / 3 * 12)} cm`, error: 'ANG-OTRO', siFuera: 'Usar el 3-4-5 está bien; pero AB toca a 37°: tiene 4 partes, no 3.' },
        { id: 'rect', valor: `${2 * (AB + BC)} cm`, error: 'TR9', siFuera: 'Ese es el perímetro de la cartulina entera; cada triángulo tiene la diagonal como lado.' },
        { id: 'sink', valor: `${12 * AB} cm`, error: 'K-SIN-DIVIDIR', siFuera: `Sumar 3k + 4k + 5k está bien; pero k = ${AB} ÷ 4, no el largo entero.` },
      ], x => x),
      solucion: { texto: `AB toca a 37°: 4 partes, k = ${k}. BC = 3k = ${BC} cm y AC = 5k = ${AC} cm.`, ecuacion: [`${AB} + ${BC} + ${AC} = `, res(`${12 * k} cm`)] },
    };
  }

  const aproximados = {
    id: 'aproximados',
    titulo: 'Los ángulos de 37° y 53°',
    pregunta: '¿Mide exactamente 37° el ángulo del triángulo 3-4-5?',
    temas: ['Ángulos aproximados (37°, 53°, 16°, 74°)'],
    pieza: OB,
    aprendizaje: 'Los lados del 3-4-5 van como 3k, 4k y 5k; sus ángulos, 36,87° y 53,13°, el examen los llama 37° y 53°.',
    actividad: 'Correr la estaca de un albañil hasta cerrar una esquina recta con su cuerda.',
    // Lee: lados enteros, k y los nombres del examen, sin decir si 37° es exacto (eso es la predicción).
    lee: {
      tarjetas: [
        // Con dibujo (lector en frío, 17 nov: «sin dibujo no veo la cuerda así») y la cuenta sin partirse.
        { titulo: 'Lados enteros', texto: ['Algunos triángulos rectángulos tienen los tres lados enteros, como 3, 4 y 5: ', junto('3² + 4² = 9 + 16 = 25 = 5²'), '. Con estacas y una cuerda así, un albañil de Juliaca marca una esquina recta.'],
          pieza: OB, dibujo: { datos: { objeto: 'cuerda', marco: [4, 6], medidas: { base: 4, estaca: 3 }, lados: { base: { texto: '4 m' }, estaca: { texto: '3 m' }, cuerda: { texto: '5 m' } } }, estado: {} } },
        { titulo: 'Cada parte vale k', texto: 'Si el triángulo crece sin cambiar de forma, sus lados siguen la misma cuenta: 6, 8 y 10, o 9, 12 y 15. Los lados van como 3k, 4k y 5k: k dice cuánto vale cada parte.',
          ecuacion: ['k = 2:   3k = 6;   4k = 8;   5k = 10'] },
        // El 7-24-25 también con dibujo: en la regla, 16° y 74° no tenían figura (lector en frío, 17 nov).
        { titulo: 'Nombres del examen', texto: 'Otra terna de lados enteros es 7, 24 y 25. En los exámenes, a los ángulos del 3-4-5 se les llama 37° y 53°; a los del 7-24-25, 16° y 74°: son ángulos aproximados.',
          pieza: OB, dibujo: { datos: { objeto: 'cuerda', medidas: { base: 24, estaca: 7 }, lados: { base: { texto: '24' }, estaca: { texto: '7' }, cuerda: { texto: '25' } }, angulos: { transportador: { texto: '16°' }, arriba: { texto: '74°' } } }, estado: {} } },
        { titulo: 'Qué mirar al jugar', texto: 'La base mide 4 m. Corre la estaca de arriba y mira el largo de la cuerda y lo que marca el transportador, de grado en grado.' },
      ],
    },
    ejemplos: EJEMPLOS_APROX,
    juega: {
      pieza: OB,
      consigna: ['Un albañil marca la esquina de una casa con estacas y cuerdas. La base mide 4 m. ', thN, ' es el ángulo que mide el transportador.'],
      mision: {
        texto: 'Corre la estaca de arriba hasta que la cuerda diagonal mida justo 5 m.',
        logrado: val => Math.abs(val.co - 3) < 1e-9,
        bien: 'Listo: 3² + 4² = 5². Con 3, 4 y 5 m, el transportador marca 37°.',
      },
      voz: '¿Con qué estaca la cuerda sale entera?',
      leyenda: [
        { s: thN, t: 'el ángulo que mide el transportador' },
        { s: '⊗', t: 'una estaca clavada en el suelo' },
        { s: op('naranja'), t: 'la cuerda de la estaca: opuesta a θ' },
        { s: ad('turquesa'), t: 'la base: adyacente a θ' },
        { s: '∟', t: 'esquina recta, de 90°' },
        { s: '≈', t: 'aproximado, redondeado' },
      ],
      controles: [{ id: 'co', etiqueta: 'Estaca de arriba: distancia a la esquina', color: 'c-o', min: 1, max: 6, paso: 0.5, inicio: 2, unidad: 'm', decimales: 1 }],
      // Gesto directo: la estaca se arrastra a lo largo de su cuerda (escala fija: sigue al dedo).
      arrastres: [{ id: 'estaca', etiqueta: 'estaca de arriba: se corre a lo largo de su cuerda', color: 'c-o',
        donde: v => { const g = TO().geometria(cuerdaJ(v)); return { x: g.b[0], y: g.b[1] }; },
        mover: (pt, v) => { const g = TO().geometria(cuerdaJ(v)); return { co: (g.r[1] - pt.y) / g.s }; } }],
      dibujo: v => ({ datos: cuerdaJ(v), estado: {} }),
      // La relación (Pitágoras) en texto plano: con raíces y potencias como partes, el lector las diría en palabras.
      lectura: v => [op(`${f(v.co)}²`), ' + ', ad('4²'), ` = ${f(v.co * v.co + 16)}: cuerda ${Number.isInteger(cuerdaDe(v.co)) ? `de ${f(cuerdaDe(v.co))} m` : largoTxt(cuerdaDe(v.co))}; marca ${Math.round(Math.atan2(v.co, BASE4) * GRA)}°`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Con la estaca a 3 m, la cuerda mide 5 m y el transportador marca 37°. ¿El ángulo mide exactamente 37°?',
      datos: ['Lados: 3 m, 4 m y 5 m', 'El transportador marca de 1° en 1°.'],
      // Sin pista (lector en frío, 17 nov: «una cifra redondeada puede esconder decimales» daba la respuesta).
      voz: 'Elige con lo que viste en el juego; después lo medimos fino.',
      opciones: [
        { id: 'c', texto: `No: mide unos ${f(EX37)}°`, correcta: true },
        { id: 'exacto', texto: 'Sí, exactamente 37°', error: 'APROX-EXACTO', siFuera: 'El transportador marca 37°, es cierto; pero solo marca grados enteros y redondea.' },
        { id: 'entero', texto: 'No: exactamente 36°', error: 'APROX-ENTERO', siFuera: 'Dudar del 37° está bien; tampoco es un número entero de grados.' },
        { id: 'grande', texto: 'Depende de la cuerda: con 6, 8 y 10 m, sí', error: 'TR8', siFuera: 'Pensar en otra cuerda tiene lógica; pero con la misma forma, el ángulo es el mismo.' },
      ],
      dibujo: { datos: cuerdaP(false), estado: {} },
      revelar: { datos: cuerdaP(true), estado: {} },
      coincide: `Coincide: tan θ = 3/4 da ${f(EX37)}°; el examen lo llama 37°.`,
      noCoincide: `Revisemos: el ángulo de tangente 3/4 mide ${f(EX37)}°, no 37°.`,
    },
    mira: {
      pieza: OB,
      datos: { objeto: 'cuerda', marco: [4, 6], medidas: { base: 4, estaca: 3 },
        lados: { base: { color: 'i', texto: [{ t: '4 m' }, { t: '4k', paso: 3 }] }, estaca: { color: 'o', texto: [{ t: '3 m' }, { t: '3k', paso: 3 }] }, cuerda: { texto: [{ t: '5 m' }, { t: '5k', paso: 3 }] } },
        // El otro agudo (53,13°) también se ve desde el paso 2: en la regla no estaba marcado (lector en frío, 17 nov).
        angulos: { transportador: { texto: [{ t: '37°' }, { t: `${f(EX37)}°`, paso: 2 }] }, arriba: { texto: `${f(90 - EX37)}°`, paso: 2 } },
        // Sin la cuenta del paso 1 arriba: ya va en el texto del paso (salía dos veces). k se dice en palabras al aparecer.
        nota: [{ t: '' }, { t: 'tan θ = 3/4 = 0,75', paso: 1 }, { t: `θ ≈ ${f(EX37)}°; el otro, ${f(90 - EX37)}°`, paso: 2 },
          { t: 'k: lo que mide una parte (aquí, 1 m)', paso: 3 }, { t: `7-24-25: ${f(EX16)}° y ${f(90 - EX16)}°`, paso: 4 }, { t: '37°, 53°, 16°, 74°: redondeos', paso: 5 }] },
      voz: 'Primero lo exacto; después, el redondeo que usa el examen.',
      pasos: [
        { estado: { paso: 0 }, texto: 'La esquina de 3, 4 y 5 m es recta.', ecuacion: [cuad('3'), ' + ', cuad('4'), ' = 9 + 16 = 25 = ', cuad('5')] },
        { estado: { paso: 1 }, texto: ['Desde ', thN, ', enfrente queda 3 y lo toca 4.'], ecuacion: [...tan, ' = ', { frac: [op('3'), ad('4')] }, ' = 0,75'] },
        { estado: { paso: 2 }, texto: ['El ángulo de tangente 0,75 mide 36,87°, no 37°.'], ecuacion: [thN, ` ≈ ${f(EX37)}°;   el otro agudo ≈ ${f(90 - EX37)}°`] },
        { estado: { paso: 3 }, texto: 'Con 6, 8 y 10 m, cada parte vale 2: misma forma.', ecuacion: ['3k, 4k, 5k   con   k = 2'] },
        { estado: { paso: 4 }, texto: 'El 7-24-25 da otros dos ángulos con decimales.', ecuacion: [...tan, ' = ', { frac: ['7', '24'] }, `   →   `, thN, ` ≈ ${f(EX16)}°`] },
        { estado: { paso: 5 }, texto: 'El examen los redondea a 37°, 53°, 16° y 74°: es una convención.', ecuacion: ['sen 37° ≈ ', { frac: ['3', '5'] }, ';   sen 16° ≈ ', { frac: ['7', '25'] }] },
      ],
    },
    mundo: MUNDO.aproximados,
    regla: {
      texto: 'Lados 3k, 4k y 5k (k: una parte): ángulos de 36,87° y 53,13°, que se llaman 37° y 53°. Lados 7k, 24k y 25k: 16° y 74°.',
      ecuacion: [junto(['sen 37° ≈ ', { frac: ['3', '5'] }]), SEP, junto(['cos 37° ≈ ', { frac: ['4', '5'] }]), '   ·   ', junto(['sen 16° ≈ ', { frac: ['7', '25'] }]), SEP, junto(['cos 16° ≈ ', { frac: ['24', '25'] }])],
      // Por qué los ejercicios escriben «=» y la regla «≈» (lector en frío, 17 nov: «¿es igual o aproximado?»).
      condicion: 'los lados van como 3k, 4k y 5k o 7k, 24k y 25k. Por convención, sen 37° = 3/5: 37° mide 36,87°.',
      voz: 'Cuando redondees, dilo: así nadie lo confunde con lo exacto.',
    },
    // Así se resuelve: los tres lados (y el perímetro) de un objeto con 37°, 53°, 16° o 74°. «Ahora tú» pide un solo
    // lado, una razón con la convención o una figura de examen.
    resuelve: {
      pieza: OB,
      generar(s) {
        const r = azar(s + 900), { o, g, ks } = OBJ_APROX[s % OBJ_APROX.length], k = r.uno(ks), T = TERNA[g], u = o.u;
        const largo = x => `${f(x)} ${u}`, val = { ra: T.ad * k, rb: T.op * k, h: T.h * k };
        const dado = ['h', 'rb', 'ra'][s % 3], per = val.ra + val.rb + val.h;
        return {
          enunciado: [`${o.intro} El ángulo ${o.a} mide ${g}°. Si ${o[dado]} mide ${largo(val[dado])}, ¿cuánto suman sus tres lados?`],
          datos: [...T.datos, DA.k],
          dibujo: figO(o, val.ra, val.rb, { [dado]: { texto: largo(val[dado]), color: COLOR_PAPEL[dado] }, ...Object.fromEntries(['ra', 'rb', 'h'].filter(x => x !== dado).map(x => [x, { texto: '?' }])) }, { a: { texto: `${g}°` } }),
          pasos: [
            { tipo: 'pide', texto: 'Piden los tres lados del triángulo y su suma.' },
            { tipo: 'datos', texto: [`Un ángulo de ${g}° y ${o[dado]}, que mide ${largo(val[dado])}.`] },
            { tipo: 'regla', texto: `Con la convención, frente a ${g}° van ${T.op} partes, junto a él ${T.ad} y en la hipotenusa ${T.h}. k = dato ÷ sus partes.` },
            { tipo: 'cuentas', texto: `${cap(o[dado])} tiene ${T[PAPEL[dado]]} partes:`, ecuacion: [`k = ${f(val[dado])} ÷ ${T[PAPEL[dado]]} = ${f(k)}`] },
            { tipo: 'cuentas', texto: 'Cada lado son sus partes por k:', ecuacion: [`${o.rb}: ${T.op} · ${f(k)} = ${largo(val.rb)};   ${o.ra}: ${T.ad} · ${f(k)} = ${largo(val.ra)};   ${o.h}: ${T.h} · ${f(k)} = ${largo(val.h)}`] },
            { tipo: 'sentido', texto: `Suman ${largo(per)}. La hipotenusa, ${largo(val.h)}, es el lado mayor. El ángulo es un redondeo; los lados, no.` },
          ],
          respuesta: [`Lados: ${largo(val.rb)}, ${largo(val.ra)} y ${largo(val.h)}. Suman `, res(largo(per))],
        };
      },
    },
    ahoraTu: {
      pieza: OB,
      voz: 'Ubica el ángulo y cuenta las partes de cada lado.',
      generar(sem) {
        const r = azar(sem + 67);
        return conCuatro([casoLadoK, casoRazonConv, casoFiguraAprox][sem % 3], r);
      },
    },
  };

  // ---------- Idea 5 (rehecha, 17 nov): complementarias y recíprocas ----------
  // Objeto de la primera pantalla: un techo de calamina a dos aguas, partido por el poste del centro (pieza trig-objeto,
  // objeto «techo»). θ en el alero, entre la viga y la calamina; α arriba, entre la calamina y el poste.
  // Cambia: la inclinación θ (de 20° a 45°). · Permanece: la viga de 3 m y el poste vertical.
  // Progresa: θ + α = 90° en la lectura. · Se reserva: cos α a partir de sen θ (la predicción).
  // Debe verse: el poste es opuesto a θ y adyacente a α; por eso sen θ = cos α. cot, sec y csc dan vuelta a tan, cos y
  // sen (aquí se presentan; decisiones, 17 nov).
  // Colores (regla de la unidad): desde θ, en el alero, el poste (opuesto a θ, adyacente a α) naranja, la viga (adyacente
  // a θ) turquesa y la calamina (hipotenusa) en tinta; θ y α, carmín, con su arco y su letra. El poste no cambia de color
  // al mirarlo desde α: es el mismo lado con otro nombre, y por eso el mismo cociente.
  // Errores (hipótesis): COMP-MISMO-ANG usa el mismo ángulo, COMP-RESTA cree que seno y coseno suman 1, NOT-RECIPROCA da
  // la recíproca, COMP-IGUALA iguala los ángulos de una cofunción, COMP-180 cree que suman 180°, REC-COMPLEMENTO suma 90°
  // en una recíproca, REC-NO-INVIERTE toma sec por cos (no da vuelta el cociente), NOT-MISMO toma el cateto del otro ángulo;
  // y los de la práctica (17 nov, para cuatro opciones): COMP-SIN-FIJOS y REC-SIN-FIJOS olvidan los grados fijos, COMP-DATO
  // da el dato y PIT-LINEAL halla el lado que falta sin cuadrados.
  const techo = (g, lados, angulos, nota) => ({ objeto: 'techo', marco: [3, 3], medidas: { viga: 3, poste: 3 * Math.tan(g * RAD) }, lados, angulos, nota });
  const LTECHO = { viga: { color: 'i', texto: 'viga' }, poste: { color: 'o', texto: 'poste' }, calamina: { texto: 'calamina' } };
  const techoJ = v => techo(v.g, LTECHO, { alero: { texto: 'θ' }, cumbre: { texto: 'α' } });
  // Las seis razones de los notables, exactas (las tres recíprocas dan vuelta a sen, cos y tan).
  const NOT6 = Object.assign({}, NOT, {
    csc: { 30: Ex.inv(NOT.sen[30]), 45: Ex.inv(NOT.sen[45]), 60: Ex.inv(NOT.sen[60]) },
    sec: { 30: Ex.inv(NOT.cos[30]), 45: Ex.inv(NOT.cos[45]), 60: Ex.inv(NOT.cos[60]) },
    cot: { 30: Ex.inv(NOT.tan[30]), 45: Ex.inv(NOT.tan[45]), 60: Ex.inv(NOT.tan[60]) },
  });
  // Con el error de no dar vuelta el cociente (sec como cos) y con el de la cofunción (el cateto del otro ángulo).
  const NOT6_MAL = {
    noInvierte: Object.assign({}, NOT, { csc: NOT.sen, sec: NOT.cos, cot: NOT.tan }),
    cambia: { sen: NOT.cos, cos: NOT.sen, tan: NOT_MAL.cambia.tan, csc: NOT6.sec, sec: NOT6.csc, cot: { 30: NOT6.cot[60], 45: NOT6.cot[45], 60: NOT6.cot[30] } },
    // Cruza las recíprocas: sec como la vuelta del seno y csc como la del coseno (por el parecido de los nombres).
    cruza: Object.assign({}, NOT6, { sec: NOT6.csc, csc: NOT6.sec }),
  };
  const DC = {
    rec: [junto(['cot ', thN, ' = ', { frac: [ad('CA'), op('CO')] }]), SEP, junto(['sec ', thN, ' = ', { frac: ['H', ad('CA')] }]), SEP, junto(['csc ', thN, ' = ', { frac: ['H', op('CO')] }])],
    // «Vale para cualquier agudo»: así se lee también con 90° − θ en lugar de θ (lector en frío, 17 nov: el ejemplo 15 la
    // usaba al revés de como estaba escrita).
    cof: ['Cofunciones, para cualquier agudo θ: ', junto(['sen ', thN, ' = cos(90° − ', thN, ')']), '; ', junto(['tan ', thN, ' = cot(90° − ', thN, ')']), '; ', junto(['sec ', thN, ' = csc(90° − ', thN, ')'])],
    uno: ['Recíprocas: ', junto(['sen ', thN, ' · csc ', thN, ' = 1']), '; ', junto(['cos ', thN, ' · sec ', thN, ' = 1']), '; ', junto(['tan ', thN, ' · cot ', thN, ' = 1'])],
    agudos: 'Los ángulos de las razones son agudos: entre 0° y 90°.',
  };

  // Ejemplos resueltos de «Complementarias y recíprocas». Cuentas rehechas con un script aparte, sin el código de la
  // unidad (scratchpad e2-trig-resto/cuentas-idea5.js): 90 − 28 = 62; 2,4/0,7 = 24/7; 10/6 = 5/3; 2,5/2,4 = 25/24;
  // sen 40° = cos 50° ≈ 0,64; sec 60° = 2; csc 45° = √2; x + 2x = 90 → 30; x + 10 = 50 → 40; 1 + 1 = 2;
  // 1/2 + 1 + 1/2 · 2 = 5/2; 3x + 30 = 90 → 20; 3x = x + 40 → 20; √(25 − 9) = 4 y 5/3 + 3/4 = 29/12; 3x + 30 = 90 → x = 20,
  // tan 45° = 1.
  const EJEMPLOS_COMP = [
    { nivel: 1, titulo: 'El ángulo de arriba',
      figura: fig(techo(28, LTECHO, { alero: { texto: '28°' }, cumbre: { texto: 'α' } })),
      enunciado: ['Un techo a dos aguas forma 28° con la viga, en el alero. ¿Cuánto mide ', al, ', arriba, entre la calamina y el poste?'],
      datos: ['Los tres ángulos de un triángulo suman 180°.', 'El poste y la viga forman 90°.'],
      solucion: [
        { texto: 'Los dos agudos se reparten lo que deja el ángulo recto: suman 90°.', ecuacion: [al, ' = 90° − ', { v: 'c-h', t: '28°' }, ' = ', res('62°')] },
      ],
      respuesta: [al, ' = ', res('62°')] },
    { nivel: 1, titulo: 'La cotangente de la rampa',
      figura: fig({ objeto: 'rampa', medidas: { ra: 2.4, rb: 0.7 }, lados: tres(L2('2,4 m', 'i'), L2('0,7 m', 'o'), L2('2,5 m')), angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una rampa sube 0,7 m en 2,4 m de base. ', thN, ' es su ángulo con el piso. ¿Cuánto vale cot ', thN, '?'],
      datos: [DR.razones, DC.rec],
      solucion: [
        { texto: ['La cotangente da vuelta a la tangente: adyacente, ', ad('2,4 m'), ', entre opuesto, ', op('0,7 m'), '.'] },
        { texto: 'Divido:', ecuacion: ['cot ', thN, ' = ', { frac: [ad('2,4'), op('0,7')] }, ' = ', res('24/7')] },
      ],
      respuesta: ['cot ', thN, ' = ', res('24/7')] },
    { nivel: 1, titulo: 'La secante del cable',
      // Mismo dibujo y mismos colores que «El coseno del cable» (idea 2).
      figura: fig({ objeto: 'poste', medidas: { ra: 6, rb: 8 }, lados: tres(L2('6 m', 'i'), L2('8 m', 'o'), L2('10 m')), angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Un cable de 10 m va de la punta de un poste de 8 m a una estaca, a 6 m de la base. ', thN, ' es su ángulo con el suelo. ¿Cuánto vale sec ', thN, '?'],
      datos: [DR.razones, DC.rec],
      solucion: [
        { texto: ['La secante da vuelta al coseno: hipotenusa, ', '10 m', ', entre adyacente, ', ad('6 m'), '.'] },
        { texto: 'Divido y simplifico:', ecuacion: ['sec ', thN, ' = ', { frac: ['10', ad('6')] }, ' = ', res('5/3')] },
      ],
      respuesta: ['sec ', thN, ' = ', res('5/3')] },
    { nivel: 1, titulo: 'La cosecante de la escalera',
      figura: fig({ objeto: 'escalera', medidas: { ra: 0.7, rb: 2.4 }, lados: tres(L2('0,7 m', 'i'), L2('2,4 m', 'o'), L2('2,5 m')), angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una escalera de 2,5 m llega a 2,4 m de alto. ', thN, ' es su ángulo con el piso. ¿Cuánto vale csc ', thN, '?'],
      datos: [DR.razones, DC.rec],
      solucion: [
        { texto: ['La cosecante da vuelta al seno: hipotenusa, ', '2,5 m', ', entre opuesto, la pared, ', op('2,4 m'), '.'] },
        { texto: 'Divido:', ecuacion: ['csc ', thN, ' = ', { frac: ['2,5', op('2,4')] }, ' = ', res('25/24')] },
      ],
      respuesta: ['csc ', thN, ' = ', res('25/24')] },
    { nivel: 1, titulo: 'El coseno del otro ángulo',
      figura: fig(techo(40, LTECHO, { alero: { texto: '40°' }, cumbre: { texto: '50°' } })),
      enunciado: 'En un techo, la calamina forma 40° con la viga y 50° con el poste. Si sen 40° ≈ 0,64, ¿cuánto vale cos 50°?',
      datos: [DR.razones, '40° + 50° = 90°'],
      solucion: [
        { texto: ['Desde 40°, el poste es el opuesto. Desde 50°, ese mismo poste es el adyacente.'] },
        { texto: 'Los dos dividen el poste entre la calamina:', ecuacion: ['cos 50° = ', { frac: [op('poste'), 'calamina'] }, ' = sen 40° ≈ ', res('0,64')] },
      ],
      respuesta: ['cos 50° ≈ ', res('0,64')] },
    { nivel: 2, titulo: 'La secante de 60°',
      enunciado: '¿Cuál es el valor exacto de sec 60°?',
      datos: [DC.rec, DN.t30],
      solucion: [
        { texto: 'En la media señal, desde 60°: la hipotenusa es 2 y el cateto que lo toca, 1.', ecuacion: ['cos 60° = ', { frac: [ad('1'), '2'] }] },
        { texto: 'La secante da vuelta al coseno:', ecuacion: ['sec 60° = ', { frac: ['2', ad('1')] }, ' = ', res('2')] },
      ],
      respuesta: ['sec 60° = ', res('2')] },
    { nivel: 2, titulo: 'La cosecante de 45°',
      enunciado: '¿Cuál es el valor exacto de csc 45°?',
      datos: [DC.rec, DN.t45],
      solucion: [
        { texto: 'En la media loseta, desde 45°: hipotenusa √2, opuesto 1.' },
        { texto: 'La cosecante es hipotenusa entre opuesto:', ecuacion: ['csc 45° = ', { frac: ['√2', '1'] }, ' = ', res('√2')] },
      ],
      respuesta: ['csc 45° = ', res('√2 ≈ 1,41')] },
    { nivel: 2, titulo: 'Seno igual a coseno',
      enunciado: 'Si sen x = cos 2x, con ángulos agudos, ¿cuánto vale x?',
      datos: [DC.cof, DC.agudos],
      solucion: [
        { texto: ['Por cofunción, sen ', thN, ' = cos(90° − ', thN, '): un seno y un coseno iguales tienen ángulos que suman 90°. Aquí ', thN, ' es x:'], ecuacion: ['x + 2x = 90°   →   3x = 90°'] },
        { texto: 'Despejo y compruebo: 30° y 60° son agudos.', ecuacion: [res('x = 30°')] },
      ],
      respuesta: [res('x = 30°')] },
    { nivel: 2, titulo: 'Tangente por cotangente',
      enunciado: 'Si tan(x + 10°) · cot 50° = 1, con ángulos agudos, ¿cuánto vale x?',
      datos: [DC.uno, DC.agudos],
      solucion: [
        { texto: 'Tangente por cotangente da 1 cuando son del mismo ángulo: son recíprocas.', ecuacion: ['x + 10° = 50°'] },
        { texto: 'Despejo:', ecuacion: [res('x = 40°')] },
        { texto: 'Error típico: sumar 90°. Eso vale para las cofunciones, no para las recíprocas.' },
      ],
      respuesta: [res('x = 40°')] },
    { nivel: 2, titulo: 'Dos productos que dan 1',
      enunciado: '¿Cuánto vale sen 20° · csc 20° + tan 35° · cot 35°, sin calculadora?',
      datos: [DC.uno],
      solucion: [
        { texto: 'Cada producto junta una razón con su recíproca, del mismo ángulo: da 1.', ecuacion: ['sen 20° · csc 20° = 1;   tan 35° · cot 35° = 1'] },
        { texto: 'Sumo:', ecuacion: ['1 + 1 = ', res('2')] },
      ],
      respuesta: [res('2')] },
    { nivel: 3, titulo: 'Notables y recíprocas',
      enunciado: '¿Cuánto vale sen 30° + tan 45° + cos 60° · sec 60°?',
      datos: [DR.razones, DC.rec, DN.t30, DN.t45],
      solucion: [
        { texto: 'Con las escuadras:', ecuacion: ['sen 30° = ', { frac: ['1', '2'] }, ';   tan 45° = 1;   cos 60° = ', { frac: ['1', '2'] }, ';   sec 60° = 2'] },
        { texto: 'Primero el producto, después las sumas:', ecuacion: [{ frac: ['1', '2'] }, ' + 1 + ', { frac: ['1', '2'] }, ' · 2 = ', { frac: ['1', '2'] }, ' + 1 + 1 = ', res('5/2')] },
      ],
      respuesta: [res('5/2')] },
    { nivel: 3, titulo: 'Una cofunción con dos x',
      enunciado: 'Si sen(2x + 10°) = cos(x + 20°), con ángulos agudos, ¿cuánto vale x?',
      datos: [DC.cof, DC.agudos],
      solucion: [
        { texto: 'Seno igual a coseno: los ángulos suman 90°.', ecuacion: ['2x + 10° + x + 20° = 90°   →   3x = 60°   →   ', res('x = 20°')] },
        { texto: 'Comprobación: 50° y 40° suman 90° y los dos son agudos.' },
        { texto: 'Error típico: igualar 2x + 10° = x + 20°. Eso vale si las dos razones fueran iguales.' },
      ],
      respuesta: [res('x = 20°')] },
    { nivel: 3, titulo: 'Recíprocas con dos x',
      enunciado: 'Si tan 3x · cot(x + 40°) = 1, con ángulos agudos, ¿cuánto vale x?',
      datos: [DC.uno, DC.agudos],
      solucion: [
        { texto: 'Tangente y cotangente que se multiplican y dan 1: son del mismo ángulo.', ecuacion: ['3x = x + 40°   →   2x = 40°   →   ', res('x = 20°')] },
        { texto: 'Comprobación: 3 · 20° = 60° y 20° + 40° = 60°.' },
      ],
      respuesta: [res('x = 20°')] },
    { nivel: 3, titulo: 'Secante del complemento',
      enunciado: ['En un triángulo rectángulo, sen ', thN, ' = 3/5. ¿Cuánto vale ', junto(['sec(90° − ', thN, ') + cot(90° − ', thN, ')']), '?'],
      datos: [DR.razones, DC.rec, DC.cof, DL.pita],
      solucion: [
        { texto: ['Las cofunciones valen para cualquier agudo: escribo 90° − ', thN, ' en lugar de ', thN, '. Su complemento es ', thN, ':'], ecuacion: [junto(['sec(90° − ', thN, ') = csc ', thN]), SEP, junto(['cot(90° − ', thN, ') = tan ', thN])] },
        { texto: ['Con opuesto ', op('3'), ' e hipotenusa 5, Pitágoras da el adyacente:'], ecuacion: ['CA = ', raizDif('5', '3', 'o'), ' = √16 = ', ad('4')] },
        { texto: 'Las dos razones:', ecuacion: [junto(['csc ', thN, ' = ', { frac: ['5', op('3')] }]), SEP, junto(['tan ', thN, ' = ', { frac: [op('3'), ad('4')] }])] },
        { texto: 'Sumo con denominador común:', ecuacion: [{ frac: ['5', '3'] }, ' + ', { frac: ['3', '4'] }, ' = ', { frac: ['20 + 9', '12'] }, ' = ', res('29/12')] },
      ],
      respuesta: [res('29/12')] },
    { nivel: 3, titulo: 'Una condición de examen',
      enunciado: 'Si sen 2x = cos(x + 30°), con ángulos agudos, ¿cuánto vale tan(x + 25°)?',
      // Con la definición de la tangente: tan 45° sale de la media loseta (auditoría, 17 nov).
      datos: [DC.cof, DC.agudos, DR.razones, DN.t45],
      solucion: [
        { texto: 'Seno igual a coseno: los ángulos suman 90°.', ecuacion: ['2x + x + 30° = 90°   →   x = 20°'] },
        { texto: 'Reemplazo en lo que piden:', ecuacion: ['tan(20° + 25°) = tan 45° = ', res('1')] },
      ],
      respuesta: [res('1')] },
  ];

  // «Ahora tú», tipo 0: una expresión con notables y recíprocas.
  // Cada una con tres opciones incorrectas distintas (17 nov: tres de las de antes daban solo dos, por simetría).
  const EXPR_REC = [
    [[1, ['sen', 30]], [1, ['tan', 45]], [1, ['cos', 60], ['sec', 60]]],
    [[1, ['csc', 30], ['cos', 60]], [1, ['sec', 60]]],
    [[2, ['sen', 45], ['csc', 45]], [1, ['sec', 60], ['cos', 30]]],
    [[1, ['tan', 60], ['cot', 30]], [-1, ['csc', 30]]],
    [[3, ['cot', 30, 2]], [-1, ['sec', 60]]],
    [[1, ['cos', 30], ['sec', 30]], [1, ['cot', 60], ['tan', 30]]],
  ];
  const evR = (e, T = NOT6) => ev(e, T);
  function casoExprRec(r) {
    const e = r.uno(EXPR_REC), bien = evR(e);
    return {
      pregunta: ['¿Cuánto vale ', ...ecu(e), '?'],
      datos: [DC.rec, DN.t30, DN.t45, DN.racio],
      opciones: opciones(Ex.txt(bien), [
        { id: 'noinv', valor: Ex.txt(evR(e, NOT6_MAL.noInvierte)), error: 'REC-NO-INVIERTE', siFuera: 'Reemplazar cada razón es el camino; pero sec, csc y cot dan vuelta el cociente de cos, sen y tan.' },
        { id: 'cambia', valor: Ex.txt(evR(e, NOT6_MAL.cambia)), error: 'NOT-MISMO', siFuera: 'Usar las escuadras está bien; pero tomaste el cateto del otro ángulo agudo.' },
        // Tercera opción incorrecta (lector en frío, 17 nov: había solo tres opciones).
        { id: 'cruza', valor: Ex.txt(evR(e, NOT6_MAL.cruza)), error: 'REC-CRUZA', siFuera: 'Dar vuelta el cociente está bien; pero sec da vuelta al coseno y csc al seno, no al revés.' },
      ], x => x),
      solucion: { texto: 'Cada razón con su escuadra; sec, csc y cot dan vuelta a cos, sen y tan.', ecuacion: [...ecu(e), ' = ', res(Ex.txt(bien))] },
    };
  }
  const arg = (m, b) => `${m === 1 ? '' : m}x${b ? ` + ${b}°` : ''}`;
  // Cuatro opciones siempre (auditoría, 17 nov: salían tres en 56 de cada 100 casos, y dos en 4 de 400): como en la
  // práctica, los tres errores tienen que dar números enteros positivos, distintos entre sí y de la respuesta.
  const entero = v => Number.isFinite(v) && v > 0 && Math.abs(v - Math.round(v)) < 1e-9;
  const cuatro = (x, vs) => vs.every(entero) && new Set([x, ...vs]).size === 4;
  // «Ahora tú», tipo 1: sen(ax + b) = cos(cx + d), con ángulos agudos.
  function casoCofEcu(r) {
    for (;;) {
      const a = r.ent(1, 3), c = r.uno([1, 2, 3].filter(x => x !== a)), x = r.ent(2, 9) * 2, resto = 90 - (a + c) * x;
      if (resto < 0) continue;
      const b = r.ent(0, resto), d = resto - b;
      if (a * x + b >= 90 || c * x + d >= 90 || a * x + b <= 0 || c * x + d <= 0) continue;
      if (!cuatro(x, [(d - b) / (a - c), (180 - b - d) / (a + c), 90 / (a + c)])) continue;
      return {
        pregunta: `Si sen(${arg(a, b)}) = cos(${arg(c, d)}), con ángulos agudos, ¿cuánto vale x?`,
        datos: [DC.cof, DC.agudos],
        opciones: opciones(x, [
          { id: 'iguala', valor: (d - b) / (a - c), error: 'COMP-IGUALA', siFuera: 'Relacionar los ángulos está bien; igualarlos vale si las razones fueran iguales. Seno con coseno: suman 90°.' },
          { id: '180', valor: (180 - b - d) / (a + c), error: 'COMP-180', siFuera: 'Sumar los ángulos va bien; pero dos agudos complementarios suman 90°, no 180°.' },
          { id: 'sin-b', valor: 90 / (a + c), error: 'COMP-SIN-FIJOS', siFuera: 'Sumar a 90° va bien; faltan los grados fijos de cada ángulo.' },
        ], v => `${f(v)}°`),
        solucion: { texto: 'Seno y coseno son cofunciones: los dos ángulos suman 90°.', ecuacion: [`${arg(a, b)} + ${arg(c, d)} = 90°   →   `, res(`x = ${x}°`)] },
      };
    }
  }
  // «Ahora tú», tipo 2: tan(ax + b) · cot(cx + d) = 1, con ángulos agudos.
  function casoRecEcu(r) {
    for (;;) {
      const a = r.ent(1, 3), c = r.uno([1, 2, 3].filter(x => x !== a)), x = r.ent(2, 9) * 2, b = r.ent(0, 30), d = b + (a - c) * x;
      if (d < 0 || a * x + b >= 90 || c * x + d >= 90) continue;
      if (!cuatro(x, [(90 - b - d) / (a + c), (180 - b - d) / (a + c), d / (a - c)])) continue;
      return {
        pregunta: `Si tan(${arg(a, b)}) · cot(${arg(c, d)}) = 1, con ángulos agudos, ¿cuánto vale x?`,
        datos: [DC.uno, DC.cof, DC.agudos],
        opciones: opciones(x, [
          { id: 'comp', valor: (90 - b - d) / (a + c), error: 'REC-COMPLEMENTO', siFuera: 'Sumar 90° vale para las cofunciones; tangente por cotangente igual a 1 pide el mismo ángulo.' },
          { id: '180', valor: (180 - b - d) / (a + c), error: 'COMP-180', siFuera: 'Relacionar los ángulos va bien; aquí son recíprocas: los ángulos son iguales.' },
          { id: 'sin-b', valor: d / (a - c), error: 'REC-SIN-FIJOS', siFuera: 'Igualar los ángulos va bien; falta restar los grados fijos del primero.' },
        ], v => `${f(v)}°`),
        solucion: { texto: 'Tangente por cotangente da 1 si son del mismo ángulo: los ángulos son iguales.', ecuacion: [`${arg(a, b)} = ${arg(c, d)}   →   `, res(`x = ${x}°`)] },
      };
    }
  }
  // «Ahora tú», tipo 3 (nivel de examen): dada una razón de θ, una razón del complemento (cofunción y recíproca juntas).
  // Cuatro opciones siempre (auditoría, 17 nov: «no invierte» repetía a otra y salían tres): los errores de la práctica,
  // con el lado que falta restado sin cuadrados (PIT-LINEAL). Nunca tan dado y cot pedido: cot(90° − θ) = tan θ es el dato.
  function casoComplemento(r) {
    for (;;) {
      const [p, q, h] = r.uno([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), [co, ca] = r.ent(0, 1) ? [p, q] : [q, p];
      const dada = r.uno(['sen', 'cos', 'tan']), pide = r.uno(['sec', 'cot', 'csc', 'tan']);
      if (dada === 'tan' && pide === 'cot') continue;
      const R = { sen: [co, h], cos: [ca, h], tan: [co, ca], cot: [ca, co], sec: [h, ca], csc: [h, co] };
      // sec(90° − θ) = csc θ; csc(90° − θ) = sec θ; cot(90° − θ) = tan θ; tan(90° − θ) = cot θ.
      const COF = { sec: 'csc', csc: 'sec', cot: 'tan', tan: 'cot' }, bien = R[COF[pide]];
      const mal = { co, ca, h };
      if (dada === 'sen') mal.ca = h - co; else if (dada === 'cos') mal.co = h - ca; else mal.h = co + ca;
      const Rm = { cot: [mal.ca, mal.co], tan: [mal.co, mal.ca], sec: [mal.h, mal.ca], csc: [mal.h, mal.co] };
      const ops = opciones(frTxt(...bien), [
        { id: 'mismo', valor: frTxt(...R[pide]), error: 'COMP-MISMO-ANG', siFuera: `Ese es ${pide} θ, bien calculado; pero se pide del otro ángulo, 90° − θ.` },
        { id: 'lineal', valor: frTxt(...Rm[COF[pide]]), error: 'PIT-LINEAL', siFuera: 'La cofunción está bien; pero el lado que falta sale de Pitágoras, con cuadrados.' },
        { id: 'dato', valor: frTxt(...R[dada]), error: 'COMP-DATO', siFuera: `${dada} θ es el dato, bien leído; la razón pedida es otra.` },
        { id: 'inversa', valor: frTxt(bien[1], bien[0]), error: 'REC-INVERSA', siFuera: 'La cofunción está bien; pero el cociente quedó al revés.' },
      ], x => x);
      if (ops.length < 4) continue;
      const lado = { sen: 'CA', cos: 'CO', tan: 'H' }[dada];
      return {
        pregunta: ['En un triángulo rectángulo, ', `${dada} `, thN, ` = ${frTxt(...R[dada])}. ¿Cuánto vale ${pide}(90° − `, thN, ')?'],
        datos: [DR.razones, DC.rec, DC.cof, DL.pita],
        opciones: ops,
        solucion: { texto: `Por cofunción, ${pide}(90° − θ) = ${COF[pide]} θ. ${lado} sale de Pitágoras: lados ${co}, ${ca} y ${h}.`, ecuacion: [`${pide}(90° − `, thN, ') = ', res(frTxt(...bien))] },
      };
    }
  }
  // «Así se resuelve»: una expresión sin calculadora, con cofunciones y recíprocas de ángulos no notables.
  function casoSimplifica(s) {
    const r = azar(s + 900), a = r.ent(11, 39), c = r.uno([12, 15, 18, 22, 25, 28, 33, 35].filter(x => x !== a)), k = r.ent(2, 3);
    const forma = s % 3;
    const t1 = forma === 0 ? [`sen ${a}° · sec ${90 - a}°`, `sec ${90 - a}° = csc ${a}°`, `sen ${a}° · csc ${a}° = 1`]
      : forma === 1 ? [`cos ${a}° · csc ${90 - a}°`, `csc ${90 - a}° = sec ${a}°`, `cos ${a}° · sec ${a}° = 1`]
        : [`tan ${a}° · tan ${90 - a}°`, `tan ${90 - a}° = cot ${a}°`, `tan ${a}° · cot ${a}° = 1`];
    const t2 = [`${k} sen ${c}° ÷ cos ${90 - c}°`, `cos ${90 - c}° = sen ${c}°`, `${k} · 1 = ${k}`];
    const v1 = 1, v2 = k, total = v1 + v2;
    const calc = (forma === 0 ? Math.sin(a * RAD) / Math.cos((90 - a) * RAD) : forma === 1 ? Math.cos(a * RAD) / Math.sin((90 - a) * RAD) : Math.tan(a * RAD) * Math.tan((90 - a) * RAD))
      + k * Math.sin(c * RAD) / Math.cos((90 - c) * RAD);
    return {
      // La división como fracción y sin partirse (lector en frío, 17 nov: «¿2 sen 28° ÷ cos 62° es 2·(sen 28°/cos 62°)?»).
      enunciado: ['Sin calculadora, ¿cuánto vale ', junto(t1[0]), ' + ', { frac: [junto(`${k} sen ${c}°`), junto(`cos ${90 - c}°`)] }, '?'],
      datos: [DC.cof, DC.uno],
      pasos: [
        { tipo: 'pide', texto: 'Piden un número exacto sin calculadora: los ángulos no son notables.' },
        { tipo: 'datos', texto: `${a}° y ${90 - a}° suman 90°; ${c}° y ${90 - c}° también.` },
        { tipo: 'regla', texto: 'Una razón de 90° − θ es la cofunción de θ. Una razón por su recíproca, del mismo ángulo, da 1.' },
        { tipo: 'cuentas', texto: 'Paso cada ángulo grande a su complemento:', ecuacion: [junto(t1[1]), SEP, junto(t2[1])] },
        { tipo: 'cuentas', texto: 'Ahora cada término junta una razón con su recíproca, o una razón consigo misma:', ecuacion: [junto(t1[2]), SEP, junto(t2[2]), '   →   ', junto(`${v1} + ${v2} = `), res(`${total}`)] },
        { tipo: 'sentido', texto: `Con calculadora, la expresión da ${f(calc, 4)}. Cuadra.` },
      ],
      respuesta: [res(`${total}`)],
    };
  }

  const complementarias = {
    id: 'complementarias',
    titulo: 'Complementarias y recíprocas',
    pregunta: '¿Por qué el seno de un ángulo es el coseno del otro?',
    temas: ['Razones recíprocas y complementarias'],
    pieza: OB,
    aprendizaje: 'Opuesto de un agudo = adyacente del otro: sen θ = cos(90° − θ). Cot, sec y csc invierten tan, cos y sen.',
    actividad: 'Inclinar el techo de una casa y mirar sus dos ángulos.',
    // Lee: complementarios y las tres razones recíprocas, sin decir que sen θ = cos(90° − θ) (eso es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Dos ángulos agudos', texto: 'Un triángulo rectángulo tiene un ángulo de 90° y dos agudos. Los tres suman 180°, así que los dos agudos suman 90°: son ángulos complementarios.',
          pieza: OB, dibujo: { datos: techo(30, LTECHO, { alero: { texto: 'θ' }, cumbre: { texto: 'α' } }), estado: {} } },
        { titulo: 'Tres razones más', texto: ['Si das vuelta la tangente, el coseno y el seno, salen otras tres: cotangente, secante y cosecante. Se escriben cot, sec y csc. Son razones recíprocas: cada lado conserva su color.'],
          ecuacion: DC.rec },
        { titulo: 'Una por su vuelta da 1', texto: 'Una razón por su recíproca, del mismo ángulo, da 1: lo que está arriba en una, está abajo en la otra.',
          ecuacion: junto(['tan ', thN, ' · cot ', thN, ' = ', { frac: [op('CO'), ad('CA')] }, ' · ', { frac: [ad('CA'), op('CO')] }, ' = 1']) },
        { titulo: 'Qué mirar al jugar', texto: 'Inclina el techo y mira los dos ángulos. Fíjate en el poste: ¿qué es para θ y qué es para α?' },
      ],
    },
    ejemplos: EJEMPLOS_COMP,
    juega: {
      pieza: OB,
      consigna: ['Un techo de calamina a dos aguas se apoya en un poste al centro. ', thN, ' está en el alero; ', al, ', arriba, junto al poste.'],
      mision: {
        texto: 'Inclina el techo hasta que el ángulo de arriba, α, mida 70°.',
        logrado: val => val.g === 20,
        bien: 'Listo: θ = 20° y α = 70°. Los dos agudos se reparten 90°.',
      },
      voz: '¿Cuánto le falta a θ para 90°?',
      leyenda: [
        { s: thN, t: 'ángulo del alero: viga con calamina' },
        // Sin «adyacente a α»: es el paso clave de la predicción; lo dice «Mira» (auditoría, 17 nov).
        { s: op('poste'), t: 'naranja: el cateto opuesto a θ' },
        { s: ad('viga'), t: 'turquesa: adyacente a θ' },
        { s: al, t: 'ángulo de arriba: calamina con poste' },
        { s: '∟', t: 'ángulo recto, de 90°' },
      ],
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-h', min: 20, max: 45, paso: 5, inicio: 40, unidad: '°', decimales: 0 }],
      // Gesto directo: la cumbre sube o baja por el poste (escala fija: sigue al dedo).
      arrastres: [{ id: 'cumbre', etiqueta: 'cumbre del techo: sube o baja por el poste', color: 'c-h',
        donde: v => { const g = TO().geometria(techoJ(v)); return { x: g.b[0], y: g.b[1] }; },
        mover: (pt, v) => { const g = TO().geometria(techoJ(v)); return { g: Math.atan2(g.r[1] - pt.y, g.a[0] - g.r[0]) * GRA }; } }],
      dibujo: v => ({ datos: techoJ(v), estado: {} }),
      lectura: v => [thN, ' + ', al, ` = ${v.g}° + ${90 - v.g}° = 90°`],
      minimo: 3,
    },
    predice: {
      pregunta: ['La calamina forma 25° con la viga. ¿Cuánto vale el coseno del ángulo de arriba, ', al, '?'],
      datos: [`sen 25° ≈ ${f(Math.sin(25 * RAD))}`, `cos 25° ≈ ${f(Math.cos(25 * RAD))}`],
      voz: 'Mira qué es el poste para cada ángulo.',
      opciones: [
        { id: 'c', texto: f(Math.sin(25 * RAD)), correcta: true },
        { id: 'mismo', texto: f(Math.cos(25 * RAD)), error: 'COMP-MISMO-ANG', siFuera: 'cos 25° vale eso, es cierto; pero α no mide 25°: es el otro agudo.' },
        { id: 'resta', texto: f(1 - Math.sin(25 * RAD)), error: 'COMP-RESTA', siFuera: 'Relacionar los dos ángulos está bien; pero seno y coseno no suman 1.' },
        { id: 'reci', texto: f(1 / Math.sin(25 * RAD)), error: 'NOT-RECIPROCA', siFuera: 'Esa es csc 25°, bien calculada; pero se pedía el coseno de α.' },
      ],
      dibujo: { datos: techo(25, LTECHO, { alero: { texto: '25°' }, cumbre: { texto: 'α' } }), estado: {} },
      revelar: { datos: techo(25, LTECHO, { alero: { texto: '25°' }, cumbre: { texto: '65°' } }, `cos 65° = sen 25° ≈ ${f(Math.sin(25 * RAD))}: el mismo poste`), estado: {} },
      coincide: 'Coincide: el poste es opuesto a 25° y adyacente a 65°. Mismo cociente.',
      noCoincide: 'Revisemos el poste: es opuesto a 25° y adyacente a 65°.',
    },
    mira: {
      pieza: OB,
      // Desde el paso 3, la figura pasa de los números a las letras de la regla: θ en el alero y 90° − θ arriba (lector en
      // frío, 17 nov: la figura de la regla tenía 25° y 65°, y las fórmulas, θ y 90° − θ, sin nada que las uniera).
      datos: techo(25, LTECHO, { alero: { texto: [{ t: '25°' }, { t: 'θ', paso: 3 }] }, cumbre: { texto: [{ t: '65°' }, { t: '90° − θ', paso: 3 }] } },
        [{ t: '25° + 65° = 90°' }, { t: 'desde 25°, el poste es el opuesto', paso: 1 }, { t: 'desde 65°, el poste es el adyacente', paso: 2 },
          { t: 'θ = 25°: sen θ = cos(90° − θ)', paso: 3 }, { t: 'θ = 25°: tan θ = cot(90° − θ)', paso: 4 }, { t: `θ = 25°: csc θ = 1 ÷ sen θ ≈ ${f(1 / Math.sin(25 * RAD))}`, paso: 5 }]),
      voz: 'Un mismo lado, visto desde los dos agudos.',
      pasos: [
        { estado: { paso: 0 }, texto: 'En el alero, 25°; arriba, 65°: los dos agudos suman 90°.' },
        { estado: { paso: 1 }, texto: 'Desde 25°, el poste queda enfrente: es el opuesto.', ecuacion: ['sen 25° = ', { frac: [op('poste'), 'calamina'] }] },
        { estado: { paso: 2 }, texto: 'Desde 65°, el mismo poste lo toca: es el adyacente.', ecuacion: ['cos 65° = ', { frac: [op('poste'), 'calamina'] }] },
        { estado: { paso: 3 }, texto: ['Mismo cociente: seno y coseno son cofunciones. Con letras, ', thN, ' y 90° − ', thN, ':'], ecuacion: junto(['sen ', thN, ' = cos(90° − ', thN, ')']) },
        { estado: { paso: 4 }, texto: 'Con la viga pasa igual: la tangente de uno es la cotangente del otro.', ecuacion: ['tan 25° = ', { frac: [op('poste'), ad('viga')] }, ' = cot 65°'] },
        { estado: { paso: 5 }, texto: 'Dar vuelta el cociente da la recíproca: su producto es 1.', ecuacion: [junto(['csc 25° = ', { frac: ['calamina', op('poste')] }, ` = 1 ÷ sen 25° ≈ ${f(1 / Math.sin(25 * RAD))}`]), SEP, junto('sen 25° · csc 25° = 1')] },
      ],
    },
    mundo: MUNDO.complementarias,
    regla: {
      // cot, sec y csc se definen en la regla misma (lector en frío, 17 nov: la regla los usaba sin definirlos).
      texto: 'cot, sec y csc dan vuelta a tan, cos y sen. Los agudos θ y 90° − θ comparten lados: el opuesto de uno es el adyacente del otro.',
      ecuacion: [...DC.rec, SEP, junto(['sen ', thN, ' = cos(90° − ', thN, ')']), '; ', junto(['tan ', thN, ' = cot(90° − ', thN, ')']), '; ', junto(['sec ', thN, ' = csc(90° − ', thN, ')']), SEP,
        junto(['sen ', thN, ' · csc ', thN, ' = 1']), '; ', junto(['cos ', thN, ' · sec ', thN, ' = 1']), '; ', junto(['tan ', thN, ' · cot ', thN, ' = 1'])],
      condicion: 'θ es agudo. Cofunciones: dos ángulos que suman 90°, razones distintas. Recíprocas: el mismo ángulo en las dos; su producto da 1.',
      voz: 'Cofunción: suman 90°. Recíproca: el mismo ángulo.',
    },
    resuelve: { pieza: OB, generar: casoSimplifica },
    ahoraTu: {
      voz: 'Mira si son cofunciones o recíprocas.',
      generar(sem) {
        const r = azar(sem + 79);
        return conCuatro([casoExprRec, casoCofEcu, casoRecEcu, casoComplemento][sem % 4], r);
      },
    },
  };

  // ---------- Laboratorio ----------
  // Sin rótulos de vértices: con el marco, el de B caía sobre el vértice; la consigna dice «la punta de arriba»
  // (auditoría, 17 nov: decía «el vértice B», que no estaba rotulado).
  const tresL = v => tri(v.co, v.ca, { marco: [8, 6] });
  // Razones del triángulo de catetos co y ca (las de la lectura y los retos de «tres-razones»).
  const hipL = v => Math.hypot(v.co, v.ca), senL = v => v.co / hipL(v), cosL = v => v.ca / hipL(v);
  // Seno de θ en grados y opuesto del triángulo grande de «semejantes» (hipotenusa 2k), como en semL.
  const senG = g => Math.sin(g * RAD), cosG = g => Math.cos(g * RAD), opGrande = v => 2 * v.k * senG(v.g);
  const casi = (a, b) => Math.abs(a - b) < 1e-9;
  // Dos triángulos con el mismo θ en A: el chico de hipotenusa 2 (puntos c, b) y el grande de hipotenusa 2k (C, B).
  function semL(v) {
    const c = Math.cos(v.g * RAD), sn = Math.sin(v.g * RAD), K = 2 * v.k;
    return {
      puntos: [{ id: 'A', x: 0, y: 0 }, { id: 'c', x: 2 * c, y: 0 }, { id: 'b', x: 2 * c, y: 2 * sn }, { id: 'C', x: K * c, y: 0 }, { id: 'B', x: K * c, y: K * sn }].concat(marco(6, 6 * Math.sin(60 * RAD))),
      lados: [
        { de: 'A', a: 'C', color: 'i', texto: '', grosor: 'contorno' }, { de: 'C', a: 'B', color: 'o', texto: f(opGrande(v)), grosor: 'variable' },
        // Las hipotenusas en tinta, como en toda la unidad (regla de colores; antes iban en turquesa).
        { de: 'A', a: 'B', texto: f(K), grosor: 'variable', lado: -1 },
        { de: 'c', a: 'b', color: 'o', texto: f(2 * sn), grosor: 'variable', lado: -1 }, { de: 'A', a: 'b', texto: '', grosor: 'contorno' },
      ],
      angulos: [{ en: 'A', de: 'C', a: 'B', texto: 'θ', color: 'h' }, { en: 'C', de: 'A', a: 'B' }],
    };
  }
  // Triángulo de hipotenusa 1 con θ en A y el otro agudo en B (mesa «complemento-libre»).
  const complemento = (g, o = {}) => tri(Math.sin(g * RAD), Math.cos(g * RAD), Object.assign({ ang: `${g}°`, otro: `${90 - g}°`, co: f(Math.sin(g * RAD)), ca: f(Math.cos(g * RAD)), h: '1' }, o));
  const compL = v => complemento(v.g, { marco: [1, 1], co: f(Math.sin(v.g * RAD), 3), ca: f(Math.cos(v.g * RAD), 3), soloB: true });

  return {
    unidad: 'trigonometria.razones-trigonometricas-agudas',
    version: '0.2.0',
    estado: 'completa',
    // Etapa 2 (17 nov): la unidad pasó por el contrato; el validador exige misión, leyenda, datos, glosario con `simple`…
    calidad: 2,
    requiere: ['/nucleo/kit/piezas/triangulo.js', '/nucleo/kit/piezas/trig-objeto.js'],
    historia: {
      texto: 'Aryabhata, en la India del año 499, calculó tablas de la semicuerda para la astronomía: el antepasado de nuestro seno. Los griegos usaban la cuerda entera. Esas tablas todavía no eran gráficas en ejes; funcionaban porque figuras semejantes conservan los cocientes de sus lados, y por eso un valor se podía tabular.',
      pregunta: '¿Por qué se podría tabular un seno, pero no el largo de un lado?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Aryabhata I», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Aryabhata_I/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'tres-razones': ['razon-cociente'],
      'semejantes': ['razon-cociente'],
      'complemento-libre': ['complementarias'],
    },
    ideas: [ladosDesdeAngulo, definicion, notables, aproximados, complementarias],
    // «cofunción» es un término propio de esta unidad (arriba); la entrada «co-razón» del curso, que también se escribe
    // «cofunción», no se marca aquí.
    glosarioSin: ['co-razón'],
    // Glosario (docs/teoria.md §4d): las palabras que esta unidad estrena en el curso. «Cotangente», «secante» y
    // «cosecante» se definen aquí, en la idea 5 (decisiones, 17 nov), como términos locales del triángulo rectángulo.
    glosario: [
      { termino: 'razón trigonométrica', def: 'Cociente entre dos lados de un triángulo rectángulo, nombrados desde uno de sus ángulos agudos. Solo depende del ángulo.',
        simple: 'Lo que da dividir dos lados de un triángulo con esquina recta.',
        formas: ['razón trigonométrica', 'razones trigonométricas'], ver: ['seno', 'coseno', 'tangente'],
        ejemplos: ['Catetos 3 y 4, hipotenusa 5: sen θ = 3/5 = 0,6.', 'Un poste de 6 m con 8 m de sombra: tan θ = 6/8 = 0,75.', 'Una escalera de 2,5 m que llega a 2,4 m de alto: sen θ = 24/25.'] },
      { termino: 'triángulo rectángulo', def: 'Figura de tres lados con un ángulo de 90°, llamado ángulo recto.',
        formas: ['triángulo rectángulo', 'triángulos rectángulos'], ver: ['cateto', 'hipotenusa'],
        ejemplos: ['Lados 3, 4 y 5: como 3² + 4² = 5², tiene un ángulo de 90°.', 'Una escalera apoyada, con la pared y el piso.', 'Media loseta cuadrada, cortada por su diagonal.'] },
      // Idea 1 (17 nov): sus cuatro palabras, con `simple` y tres ejemplos (contrato, puntos 11 y 12). Ningún `simple` dice
      // que el opuesto sea «el vertical» (TR7, distractor de la predicción).
      { termino: 'cateto', def: 'Cada uno de los dos lados que forman el ángulo de 90° de un triángulo rectángulo.',
        simple: 'Cada lado que forma la esquina recta del triángulo.',
        formas: ['cateto', 'catetos'], ver: ['cateto opuesto', 'cateto adyacente', 'hipotenusa'],
        ejemplos: ['En una escalera apoyada, la pared y el piso.', 'En el triángulo de lados 3, 4 y 5, los lados de 3 y 4.', 'En un poste con su cable, el poste y el suelo hasta la estaca.'] },
      { termino: 'cateto opuesto', simbolo: 'CO', def: 'De los dos lados que forman el ángulo de 90°, el que queda frente a θ, sin tocarlo.',
        simple: 'El lado de la esquina recta que queda frente al ángulo que miras.',
        formas: ['cateto opuesto', 'catetos opuestos'], ver: ['cateto adyacente'],
        ejemplos: ['Con θ en el pie de una escalera apoyada, la pared.', 'Con α arriba, entre la escalera y la pared, el piso.', 'En una repisa, frente al ángulo de abajo queda el brazo, que es horizontal.'] },
      { termino: 'cateto adyacente', simbolo: 'CA', def: 'De los dos lados que forman el ángulo de 90°, el que toca a θ.',
        simple: 'El lado de la esquina recta que toca al ángulo que miras.',
        formas: ['cateto adyacente', 'catetos adyacentes'], ver: ['cateto opuesto'],
        ejemplos: ['Con θ en el pie de una escalera apoyada, el piso.', 'Con α arriba, entre la escalera y la pared, la pared.', 'Con θ entre un cable y el suelo, el suelo hasta el poste.'] },
      { termino: 'hipotenusa', simbolo: 'H', def: 'El lado más largo de un triángulo rectángulo: el que queda frente al ángulo de 90°.',
        simple: 'El lado largo, el que queda frente a la esquina recta.',
        formas: ['hipotenusa', 'hipotenusas'], ver: ['teorema de Pitágoras'],
        ejemplos: ['La escalera apoyada en la pared.', 'El cable que va de la punta del poste hasta la estaca.', 'Catetos 6 y 8: mide √(36 + 64) = 10.'] },
      { termino: 'ángulo agudo', def: 'Ángulo que mide más de 0° y menos de 90°.',
        formas: ['ángulo agudo', 'ángulos agudos', 'agudo', 'agudos'], ver: ['ángulos complementarios'],
        ejemplos: ['25° y 65° lo son; 90° y 120°, no.', 'El ángulo entre una escalera apoyada y el piso.', 'Los dos ángulos de una escuadra que no son el recto.'] },
      // Idea 2 (17 nov): seno, coseno y tangente, con `simple` y tres ejemplos. Ningún `simple` dice que cambien con el
      // tamaño (TR8, distractor de la predicción) ni confunde el rayo con la sombra (TR9).
      { termino: 'seno', simbolo: 'sen', def: 'Razón que divide el cateto opuesto a θ entre la hipotenusa.',
        simple: 'El lado de enfrente del ángulo dividido entre el lado más largo.', ver: ['coseno', 'razón trigonométrica'],
        ejemplos: ['Escalera de 5 m que llega a 4 m de alto: sen θ = 4/5, con θ en el pie.', 'En el triángulo 3-4-5, desde el ángulo frente al 3: sen θ = 3/5 = 0,6.', 'Un poste de 6 m y su rayo de sol de 10 m: sen θ = 0,6.'] },
      { termino: 'coseno', simbolo: 'cos', def: 'Razón que divide el cateto adyacente a θ entre la hipotenusa.',
        simple: 'El lado que toca al ángulo dividido entre el lado más largo.', ver: ['seno', 'cofunción'],
        ejemplos: ['Un cable de 10 m con la estaca a 6 m del poste: cos θ = 6/10 = 0,6.', 'En el triángulo 3-4-5, desde el ángulo frente al 3: cos θ = 4/5.', 'Una sombra de 8 m y su rayo de sol de 10 m: cos θ = 0,8.'] },
      { termino: 'tangente', simbolo: 'tan', def: 'Razón que divide el cateto opuesto a θ entre el cateto adyacente.',
        simple: 'El lado de enfrente del ángulo dividido entre el lado que lo toca.', ver: ['seno', 'coseno'],
        ejemplos: ['Un poste de 6 m con 8 m de sombra: tan θ = 6/8 = 0,75.', 'Una rampa que sube 0,7 m en 2,4 m de base: tan θ = 7/24.', 'Catetos iguales: tan θ = 1.'] },
      // Idea 5 (17 nov): cot, sec y csc se definen aquí (decisiones, 17 nov), en el triángulo y como `local`: en «Ángulos en
      // posición normal» se definen con x, y y r, y allá vale esa. Ningún `simple` dice que el coseno de un ángulo sea el
      // coseno del otro (COMP-MISMO-ANG) ni que seno y coseno sumen 1 (COMP-RESTA). «Razones recíprocas» va sin `simple`
      // (la idea estrena cinco palabras y el Resumen muestra hasta cuatro); sus tres razones sí lo traen.
      // Sin `simple` desde el 17 nov: «cofunción» entra al Resumen de la idea 5 (que muestra hasta cuatro) y los ángulos
      // complementarios ya vienen de geometría; «Lee» los presenta en su tarjeta 1.
      { termino: 'ángulos complementarios', def: 'Dos ángulos que suman 90°, como los dos agudos de un triángulo rectángulo.',
        formas: ['ángulos complementarios', 'complementarios'], ver: ['cofunción'],
        ejemplos: ['25° y 65°, porque 25° + 65° = 90°.', 'En un techo, el ángulo del alero y el de arriba, junto al poste.', '37° y 53° del triángulo 3-4-5.'] },
      // «Cofunción», propia de esta unidad (auditoría, 17 nov: la palabra central de la idea 5 abría «co-razón», de
      // «Reducción al primer cuadrante», sin `simple` y con 270°). Local: en esta unidad gana a la del curso, y
      // glosarioSin deja de marcar «co-razón» aquí. Su `simple` no dice que el coseno de un ángulo sea el coseno del
      // otro (COMP-MISMO-ANG) ni que seno y coseno sumen 1 (COMP-RESTA).
      { termino: 'cofunción', local: true, def: 'Pareja de razones de dos agudos complementarios: el seno de uno es el coseno del otro.',
        simple: 'La razón pareja del otro agudo: seno de uno, coseno del otro.',
        formas: ['cofunción', 'cofunciones'], ver: ['ángulos complementarios', 'razones recíprocas'],
        ejemplos: ['sen 25° = cos 65°, porque 25° + 65° = 90°.', 'tan 30° = cot 60° = √3/3.', 'En un techo, el poste es opuesto a θ y adyacente a α: sen θ = cos α.'] },
      { termino: 'razones recíprocas', def: 'Dos razones del mismo ángulo con el cociente al revés: multiplicadas dan 1.',
        formas: ['razones recíprocas', 'razón recíproca', 'recíproca', 'recíprocas'], ver: ['razón trigonométrica', 'cotangente', 'secante', 'cosecante'],
        ejemplos: ['sen θ = 3/5 y csc θ = 5/3: (3/5) · (5/3) = 1.', 'cos 60° = 1/2 y sec 60° = 2.', 'tan 45° = cot 45° = 1.'] },
      { termino: 'cotangente', simbolo: 'cot', local: true, def: 'Razón que divide el cateto adyacente a θ entre el opuesto: da vuelta a la tangente.',
        simple: 'La tangente dada vuelta: el lado que toca entre el de enfrente.',
        formas: ['cotangente', 'cotangentes'], ver: ['tangente', 'razones recíprocas'],
        ejemplos: ['Una rampa que sube 0,7 m en 2,4 m de base: cot θ = 24/7.', 'cot 45° = 1.', 'tan θ = 3/4 y cot θ = 4/3.'] },
      { termino: 'secante', simbolo: 'sec', local: true, def: 'Razón que divide la hipotenusa entre el cateto adyacente a θ: da vuelta al coseno.',
        simple: 'El coseno dado vuelta: el lado más largo entre el que toca.',
        formas: ['secante', 'secantes'], ver: ['coseno', 'razones recíprocas'],
        ejemplos: ['Un cable de 10 m con la estaca a 6 m del poste: sec θ = 5/3.', 'sec 60° = 2.', 'cos θ = 4/5 y sec θ = 5/4.'] },
      { termino: 'cosecante', simbolo: 'csc', local: true, def: 'Razón que divide la hipotenusa entre el cateto opuesto a θ: da vuelta al seno.',
        simple: 'El seno dado vuelta: el lado más largo entre el de enfrente.',
        formas: ['cosecante', 'cosecantes'], ver: ['seno', 'razones recíprocas'],
        ejemplos: ['Una escalera de 2,5 m que llega a 2,4 m: csc θ = 25/24.', 'csc 30° = 2.', 'sen θ = 3/5 y csc θ = 5/3.'] },
      { termino: 'triángulos semejantes', def: 'Triángulos de igual forma y distinto tamaño: mismos ángulos y lados proporcionales.',
        formas: ['triángulos semejantes', 'semejantes'], ver: ['razón trigonométrica'],
        ejemplos: ['Lados 3-4-5 y 6-8-10: cada lado del segundo es el doble.', 'Tu primo y un poste con sus sombras, a la misma hora.', 'Una escuadra del colegio y su copia grande en la pizarra.'] },
      // Idea 3 (17 nov): ningún `simple` dice que el seno crezca como el ángulo (TR10, distractor de la predicción).
      { termino: 'ángulo notable', def: 'Ángulo cuyas razones se conocen exactas, sin calculadora, como 30°, 45° y 60°.',
        simple: 'Un ángulo que se repite en los exámenes y tiene valores exactos.',
        formas: ['ángulo notable', 'ángulos notables'], ver: ['razón trigonométrica', 'triángulo equilátero'],
        ejemplos: ['sen 30° = 1/2, de la media señal.', 'tan 45° = 1, de la media loseta.', 'Las dos escuadras del colegio traen 30°, 45° y 60°.'] },
      { termino: 'triángulo equilátero', def: 'Triángulo de tres lados iguales; sus tres ángulos miden 60°.',
        simple: 'El triángulo con los tres lados del mismo largo.',
        formas: ['triángulo equilátero', 'triángulos equiláteros'], ver: ['ángulo notable'],
        ejemplos: ['Una señal «Ceda el paso».', 'Tres palitos de fósforo iguales unidos por sus puntas.', 'Lados de 40 cm, 40 cm y 40 cm: su altura mide 20√3 cm.'] },
      { termino: 'racionalizar', def: 'Quitar una raíz del denominador multiplicando arriba y abajo por esa raíz.',
        simple: 'Pasar la raíz de abajo hacia arriba sin cambiar el valor.',
        formas: ['racionalizar', 'racionaliza', 'racionalizada', 'racionalización'], ver: ['ángulo notable'],
        ejemplos: ['1/√2 = √2/2.', '1/√3 = √3/3.', '2/√3 = 2√3/3.'] },
      // Idea 4 (17 nov): ningún `simple` dice que 37° sea exacto (APROX-EXACTO) ni que el ángulo cambie con el tamaño (TR8).
      { termino: 'terna pitagórica', def: 'Tres números enteros que cumplen Pitágoras: pueden ser los lados de un triángulo rectángulo.',
        simple: 'Tres números enteros que sirven de lados para una esquina recta.',
        formas: ['terna pitagórica', 'ternas pitagóricas', 'terna'], ver: ['teorema de Pitágoras'],
        ejemplos: ['3, 4 y 5: 9 + 16 = 25.', '7, 24 y 25: 49 + 576 = 625.', '6, 8 y 10: el 3-4-5 con cada parte k = 2.'] },
      { termino: 'ángulo aproximado', def: 'Ángulo de un triángulo de lados enteros cuyo valor se redondea a grados enteros, como 37° (36,87°).',
        simple: 'Un ángulo que se nombra redondeado, aunque tenga decimales.',
        formas: ['ángulo aproximado', 'ángulos aproximados'], ver: ['convención', 'terna pitagórica'],
        ejemplos: ['37° del 3-4-5, que mide unos 36,87°.', '53° del 3-4-5, que mide unos 53,13°.', '16° del 7-24-25, que mide unos 16,26°.'] },
      { termino: 'convención', def: 'Acuerdo para usar un valor de una forma fija, aunque no sea exacto.',
        simple: 'Un acuerdo: todos usan el mismo valor redondeado.',
        formas: ['convención', 'convenciones'], ver: ['ángulo aproximado'],
        ejemplos: ['sen 37° = 3/5 en el examen, aunque 37° no es exacto.', 'cos 16° = 24/25 en el examen.', 'Usar π ≈ 3,14 en un problema.'] },
      { termino: 'teorema de Pitágoras', def: 'En un triángulo rectángulo, la hipotenusa al cuadrado es igual a la suma de los catetos al cuadrado.',
        formas: ['teorema de Pitágoras', 'Pitágoras'], ver: ['hipotenusa', 'cateto'],
        ejemplos: ['Catetos 3 y 4: H = √(9 + 16) = 5.', 'Escalera de 2,5 m con el pie a 0,7 m: llega a √(6,25 − 0,49) = 2,4 m.', 'Cuerda de albañil: 3² + 4² = 5².'] },
    ],
    // Laboratorio (docs/teoria.md §4b). «tres-razones»: catetos libres de medio en medio, con sen, cos, tan y el ángulo
    // a la vez (la idea 1 solo da el seno). «semejantes»: un triángulo dentro de otro k veces mayor, con el mismo θ; el
    // caso de la predicción, ahora con cualquier ángulo y escala. «complemento-libre»: θ de grado en grado hasta los
    // bordes (1° y 89°), con la cofunción y la recíproca juntas.
    laboratorio: [
      {
        id: 'tres-razones', titulo: 'Tres razones de un vistazo', pieza: 'triangulo',
        consigna: 'Arrastra la punta de arriba del triángulo a cualquier sitio. La lectura da seno, coseno y tangente de θ, y cuánto mide θ.',
        controles: [
          { id: 'co', etiqueta: 'CO', color: 'c-o', min: 0.5, max: 6, paso: 0.5, inicio: 3, unidad: '', decimales: 1 },
          { id: 'ca', etiqueta: 'CA', color: 'c-i', min: 0.5, max: 8, paso: 0.5, inicio: 4, unidad: '', decimales: 1 },
        ],
        dibujo: v => ({ datos: tresL(v), estado: {} }),
        lectura: v => {
          return ['sen ', th, ` ≈ ${f(senL(v), 3)};  cos `, th, ` ≈ ${f(cosL(v), 3)};  tan `, th, ` ≈ ${f(v.co / v.ca, 3)};  `, th, ` ≈ ${f(Math.atan2(v.co, v.ca) * GRA)}°`];
        },
        // Retos: senL y cosL son los cocientes de los lados que dibuja tresL.
        invitaciones: [
          { texto: 'Haz que la tangente de θ valga justo 1.',
            logrado: v => casi(v.co / v.ca, 1),
            // Sin el notable, que llega en la idea 3 (auditoría, 17 nov): la mesa es de la idea 2.
            bien: 'Catetos iguales: el mismo θ, sea cual sea el tamaño. Mira cuánto marca la lectura.' },
          { texto: 'Haz que el seno de θ pase de 0,9.',
            logrado: v => senL(v) > 0.9,
            bien: 'θ casi se para: el opuesto se acerca a la hipotenusa, sin alcanzarla.' },
          { texto: 'Arma otro triángulo con los tres lados enteros, distinto del inicial.',
            logrado: v => Number.isInteger(v.co) && Number.isInteger(v.ca) && casi(hipL(v), Math.round(hipL(v))) && !(v.co === 3 && v.ca === 4),
            bien: 'Lados enteros, cocientes limpios. ¿Alguna razón cambió frente al inicial?' },
          { texto: 'Guarda dos triángulos de distinto tamaño con el mismo seno.',
            logrado: (v, gs) => gs.some(a => gs.some(b => a.co !== b.co && casi(senL(a), senL(b)))),
            bien: 'Distinto tamaño, mismo ángulo, mismo seno: la razón no mira el tamaño.' },
        ],
        // La punta de arriba (el vértice B): de lado cambia CA; hacia arriba, CO.
        arrastres: [{ id: 'vertice-b', etiqueta: 'punta de arriba: CA de lado, CO hacia arriba', color: 'c-o',
          donde: v => enPx(tresL(v), v.ca, v.co),
          mover: (pt, v) => { const q = delPx(tresL(v), pt); return { ca: q.x, co: q.y }; } }],
      },
      {
        id: 'semejantes', titulo: 'Uno dentro de otro', pieza: 'triangulo',
        consigna: 'El triángulo chico tiene hipotenusa 2; el grande, k veces más: son triángulos semejantes. Arrastra la punta del grande: cambias θ y k.',
        controles: [
          { id: 'g', etiqueta: 'θ', color: 'c-h', min: 15, max: 60, paso: 1, inicio: 30, unidad: '°', decimales: 0 },
          { id: 'k', etiqueta: 'k', min: 1.5, max: 3, paso: 0.5, inicio: 2, unidad: '', decimales: 1 },
        ],
        dibujo: v => ({ datos: semL(v), estado: {} }),
        lectura: v => {
          const sn = senG(v.g);
          return ['sen ', th, ` ≈ ${f(2 * sn)}/2 ≈ ${f(opGrande(v))}/${f(2 * v.k)} ≈ ${f(sn, 3)};  k = ${f(v.k)}`];
        },
        // Retos: opGrande es el cateto opuesto (naranja) del grande que dibuja semL; senG, el seno de los dos.
        invitaciones: [
          { texto: 'Haz que el cateto opuesto del grande mida justo 3.',
            logrado: v => casi(opGrande(v), 3),
            bien: 'Opuesto 3 sobre hipotenusa 6: el seno vale 0,5. La lectura dice con qué θ.' },
          { texto: 'Haz que el seno de θ pase de 0,8.',
            logrado: v => senG(v.g) > 0.8,
            bien: 'Pasa desde unos 54°. Mover k no lo acerca ni lo aleja.' },
          { texto: 'Consigue el cateto opuesto más largo que permite la mesa.',
            logrado: v => casi(opGrande(v), opGrande({ g: 60, k: 3 })),
            bien: 'Mayor θ y mayor k alargan el opuesto; el seno solo sigue a θ.' },
          { texto: 'Guarda dos casos con el mismo θ y distinto k. Compara sus senos.',
            logrado: (v, gs) => gs.some(a => gs.some(b => a.g === b.g && a.k !== b.k)),
            bien: 'Los lados cambiaron con k; el seno, no. Depende solo de θ.' },
        ],
        // La punta B del grande: su dirección es θ y su distancia a A, la hipotenusa 2k.
        arrastres: [{ id: 'punta', etiqueta: 'punta del triángulo grande: θ y k', color: 'c-h',
          donde: v => enPx(semL(v), 2 * v.k * Math.cos(v.g * RAD), 2 * v.k * Math.sin(v.g * RAD)),
          mover: (pt, v) => { const q = delPx(semL(v), pt); return { g: Math.atan2(q.y, q.x) * GRA, k: Math.hypot(q.x, q.y) / 2 }; } }],
      },
      {
        id: 'complemento-libre', titulo: 'Cofunción y recíproca, juntas', pieza: 'triangulo',
        consigna: 'La hipotenusa mide 1. Lleva el vértice B hasta casi acostar o casi parar el triángulo, y compara las razones.',
        controles: [{ id: 'g', etiqueta: 'θ', color: 'c-h', min: 1, max: 89, paso: 1, inicio: 25, unidad: '°', decimales: 0 }],
        dibujo: v => ({ datos: compL(v), estado: {} }),
        lectura: v => [`sen ${v.g}° = cos ${90 - v.g}° ≈ ${f(senG(v.g), 3)};  csc ${v.g}° ≈ ${f(1 / senG(v.g), 3)}`],
        // Retos: senG y cosG son los catetos que dibuja compL (hipotenusa 1).
        invitaciones: [
          { texto: 'Haz que el seno y el coseno de θ sean iguales.',
            logrado: v => casi(senG(v.g), cosG(v.g)),
            bien: 'En 45° el ángulo es su propio complemento: los catetos coinciden.' },
          { texto: 'Busca un θ cuyo seno sea el coseno de 70°.',
            logrado: v => casi(senG(v.g), cosG(70)),
            bien: '20° y 70° suman 90°: el mismo cateto, visto desde los dos agudos.' },
          { texto: 'Haz que csc θ pase de 10.',
            logrado: v => 1 / senG(v.g) > 10,
            bien: 'Seno cerca de 0, recíproca enorme: csc crece sin tope.' },
          { texto: 'Haz que el cateto opuesto mida justo la mitad de la hipotenusa.',
            logrado: v => casi(senG(v.g), 0.5),
            bien: '30°: medio equilátero. ¿Qué ángulo da un coseno de 1/2?' },
        ],
        // El vértice B recorre el arco de radio 1.
        arrastres: [{ id: 'vertice-b', etiqueta: 'vértice B: cambia θ', color: 'c-h',
          donde: v => enPx(compL(v), Math.cos(v.g * RAD), Math.sin(v.g * RAD)),
          mover: (pt, v) => ({ g: anguloEnA(compL(v), pt) }) }],
      },
    ],
  };
});
