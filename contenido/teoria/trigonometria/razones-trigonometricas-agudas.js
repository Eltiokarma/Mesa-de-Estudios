/*
 * Teoría de «Razones trigonométricas de ángulos agudos» (trigonometria.razones-trigonometricas-agudas), 3.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 3), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (pp. 84–85) y las «Precisiones de Geometría y Trigonometría» del expediente (la 4: 37°/53° y 16°/74° son
 * aproximaciones de los triángulos 3-4-5 y 7-24-25, no valores exactos). Forma: angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: cada razón se lee desde un ángulo, y lo aproximado se dice.
 * Colores (regla 4): el ángulo θ en naranja (c-o), el cateto opuesto CO en rojo (c-h), el cateto adyacente CA en
 * turquesa (c-i) y la hipotenusa H en verde (c-d). Opuesto y adyacente se nombran siempre desde θ.
 * Errores: TR7 (el seno es una longitud), TR8 (la razón depende del tamaño), TR9 (elige mal la razón) y TR10 (la
 * razón es proporcional al ángulo) son de docs/investigacion/trigonometria-ideas-erroneas.md. Hipótesis de
 * distractor (sin medir): RAZ-FALTA-ANGULO, REC-INVERSA, NOT-MISMO, NOT-RECIPROCA, NOT-CAMBIA, APROX-EXACTO,
 * APROX-ENTERO, APROX-MEDIR, COMP-MISMO-ANG, COMP-CALC, COMP-IGUALA, COMP-180, REC-COMPLEMENTO.
 * Ronda 2 (14 nov, noche): manijas en las cuatro ideas (vértice B en tres, esquina de la base de la figura en los
 * notables), con un «marco» invisible que fija la escala de la pieza triangulo; llaves en las reglas, separadores
 * entre relaciones y laboratorio de tres mesas (tres razones, semejantes uno dentro de otro, cofunción de 1° a 89°).
 * Las cuatro ideas usan la misma figura en «Juega» y en «Mira» (hallazgo 9 de docs/auditoria-teoria.md).
 *
 * Etapa 2 del plan de calidad (17 nov, fase 2): idea nueva al inicio, «Los lados se nombran desde θ»
 * (lados-desde-angulo), escrita completa contra el contrato (docs/etapa2/propuesta-trigonometria.md y decisiones.md):
 * escalera en la pared de una casa de adobe (pieza trig-objeto), misión, predicción con datos, «Mira», regla, «Así se
 * resuelve», «Ahora tú» de nivel examen con datos y 15 ejemplos. Sus colores van por papel (molde §5b; ver su bloque).
 * Las otras cuatro ideas siguen como estaban (se rehacen después del visto bueno de Gerson): sus colores (θ naranja,
 * CO rojo, H verde, abajo) todavía no siguen §5b, y la unidad aún no declara calidad: 2.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: una razón trigonométrica es un cociente de lados que depende solo del ángulo agudo, no del tamaño.
 *   Persona y condiciones: postulante de 3.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
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
  const th = { v: 'c-o', t: 'θ' }, CO = { v: 'c-h', t: 'CO' }, CA = { v: 'c-i', t: 'CA' }, H = { v: 'c-d', t: 'H' };
  const RAD = Math.PI / 180, GRA = 180 / Math.PI;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (p, q) => { const m = gcd(p, q); return q / m === 1 ? `${p / m}` : `${p / m}/${q / m}`; };
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
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

  // Triángulo rectángulo con θ en A, el recto en C: CA horizontal (turquesa), CO vertical (rojo), H (verde).
  // o.co, o.ca, o.h: rótulos; o.ang: rótulo de θ; o.otro: rótulo del otro agudo (en B); o.marco: [x, y] del marco.
  const tri = (co, ca, o = {}) => ({
    puntos: [{ id: 'A', x: 0, y: 0, rotulo: o.nombres ? 'A' : '' }, { id: 'C', x: ca, y: 0, rotulo: o.nombres ? 'C' : '' }, { id: 'B', x: ca, y: co, rotulo: o.nombres ? 'B' : '' }]
      .concat(o.puntos || [], o.marco ? marco(o.marco[0], o.marco[1]) : []),
    lados: [
      { de: 'A', a: 'C', color: 'i', texto: o.ca === undefined ? f(ca) : o.ca, grosor: 'variable' },
      { de: 'C', a: 'B', color: 'h', texto: o.co === undefined ? f(co) : o.co, grosor: 'variable' },
      { de: 'A', a: 'B', color: 'd', texto: o.h === undefined ? f(Math.hypot(co, ca)) : o.h, grosor: 'variable', lado: -1 },
    ].concat(o.lados || []),
    angulos: [{ en: 'A', de: 'C', a: 'B', texto: o.ang === undefined ? 'θ' : o.ang, color: 'o', paso: o.pasoAng }, { en: 'C', de: 'A', a: 'B' }]
      .concat(o.otro ? [{ en: 'B', de: 'C', a: 'A', texto: o.otro, paso: o.pasoOtro }] : []).concat(o.angulos || []),
  });

  // ---------- Idea 1 (nueva, 17 nov): los lados se nombran desde θ ----------
  // Propuesta aprobada por Gerson: docs/etapa2/propuesta-trigonometria.md y docs/etapa2/decisiones.md (mandan sobre la
  // propuesta). Objeto de la primera pantalla: una escalera de 5 m en la pared de una casa de adobe (pieza trig-objeto).
  // Cambia: el pie de la escalera (lo que la separa de la pared). · Permanece: los 5 m de la escalera y el rincón recto.
  // Progresa: el piso crece y la pared baja; la escalera sigue siendo el lado mayor. · Se reserva: el ángulo de arriba, α
  // (la predicción). · Debe verse: los catetos cambian de nombre según el ángulo desde el que se mira; la hipotenusa, no.
  // Colores de esta idea (molde §5b; fijos en juego, predicción y «Mira»): la escalera, naranja (el primer dato, 5 m); la
  // pared, turquesa; el piso, violeta (lo que pide la misión y lo que pide la predicción); θ y α, carmín, con arco y letra.
  // CO, CA y H van en tinta en la regla: el color sigue al objeto, no al nombre (si el opuesto tuviera un color fijo, el
  // color nombraría el lado por el alumno). En los ejemplos y en «Ahora tú», los lados que solo se nombran van en tinta;
  // en los de Pitágoras, la hipotenusa dada en naranja, el cateto dado en turquesa y lo que se pide, en violeta.
  // Errores (hipótesis salvo TR7 y TR9, de docs/investigacion/trigonometria-ideas-erroneas.md): TR7 «el opuesto es el lado
  // vertical» (De Kee y otros; parcial), TR9 confunde opuesto con adyacente (Kendal y Stacey; parcial), LAD-HIPOTENUSA toma
  // la hipotenusa por cateto, LAD-SOLO-PISO cree que solo se mide desde el piso, LAD-TOCA-H toma la hipotenusa por adyacente
  // porque también toca al ángulo, LAD-HIP-CATETO toma un cateto por hipotenusa, LAD-NO-CAMBIA nombra desde θ cuando se
  // pregunta desde α, PIT-SUMA suma los cuadrados para hallar un cateto.
  const OB = 'trig-objeto';
  const TO = () => Kit.piezas[OB];
  const thN = { v: 'c-h', t: 'θ' }, al = { v: 'c-h', t: 'α' };
  const dO = t => ({ v: 'c-o', t }), dI = t => ({ v: 'c-i', t }), dF = t => ({ v: 'c-f', t });
  const cuad = x => ({ sup: [x, '2'] });
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  // Datos de cada ejercicio (contrato, punto 13): definiciones y la fórmula de Pitágoras, una por línea. Pitágoras no
  // está en el `requiere` de la unidad: va siempre como dato (decisiones, 17 nov).
  const DL = {
    cat: 'Catetos: los dos lados que forman el ángulo recto, de 90°.',
    h: 'Hipotenusa: el lado que queda frente al ángulo recto. Es el lado más largo.',
    co: 'Cateto opuesto a un ángulo agudo: el cateto que queda frente a ese ángulo, sin tocarlo.',
    ca: 'Cateto adyacente a un ángulo agudo: el cateto que forma ese ángulo junto con la hipotenusa.',
    pita: ['Pitágoras: ', cuad('hipotenusa'), ' = ', cuad('cateto'), ' + ', cuad('cateto')],
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
    lados: { escalera: { color: 'o', texto: '5 m' }, pared: { color: 'i', texto: largoTxt(altoEsc(v.pie)) }, piso: { color: 'f', texto: largoTxt(v.pie) } },
    angulos: { pie: { texto: 'θ' } } });
  // Predicción y «Mira»: la escalera con el pie a 3 m (lados 3, 4 y 5).
  const ESC345 = (o = {}) => ({ objeto: 'escalera', medidas: { piso: 3, pared: 4 }, marco: [4.5, 5],
    lados: { escalera: { color: 'o', texto: o.h || '5 m' }, pared: { color: 'i', texto: o.pared || '4 m', texto2: o.pared2 }, piso: { color: o.pisoColor === undefined ? 'f' : o.pisoColor, texto: o.piso || '3 m', texto2: o.piso2 } },
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
  // y 15 + 15 = 30. La figura muestra el planteamiento: las medidas que se dan, nunca cuál es el lado pedido.
  const t3 = (ra, rb, h) => ({ ra: { texto: ra }, rb: { texto: rb }, h: { texto: h } });
  const raizDif = (h, c) => ({ raiz: [[cuad(dO(h)), ' − ', cuad(dI(c))]] });
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
      datos: [DL.h],
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
    { nivel: 2, titulo: '¿Hasta dónde sube la escalera?', figura: fig({ objeto: 'escalera', medidas: { ra: 1.6, rb: 3 }, lados: { ra: { texto: '1,6 m', color: 'i' }, h: { texto: '3,4 m', color: 'o' } }, angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una escalera de 3,4 m se apoya en una pared con su pie a 1,6 m de ella. ', thN, ' es su ángulo con el piso. ¿Cuánto mide el cateto opuesto a ', thN, '?'],
      datos: [DL.co, DL.pita],
      solucion: [
        { texto: ['Frente a ', thN, ' queda la pared: el cateto opuesto es la altura a la que llega la escalera. La escalera es la hipotenusa.'] },
        { texto: 'Con Pitágoras, el cateto que falta es la raíz de la hipotenusa al cuadrado menos el otro cateto al cuadrado.',
          ecuacion: [raizDif('3,4', '1,6'), ' = ', { raiz: ['11,56 − 2,56'] }, ' = √9 = ', dF('3 m')] },
      ],
      respuesta: ['La pared: ', dF('3 m')] },
    { nivel: 2, titulo: 'El cable visto desde arriba', figura: fig({ objeto: 'poste', medidas: { ra: 6, rb: 8 }, lados: t3('6 m', '8 m', '10 m'), angulos: { b: { texto: 'α' } } }),
      enunciado: ['Un cable de 10 m va de la punta de un poste de 8 m a una estaca, a 6 m del poste. ', al, ' está entre el cable y el poste. ¿Cuánto miden los catetos opuesto y adyacente a ', al, '?'],
      datos: [DL.co, DL.ca],
      solucion: [
        { texto: [al, ' está en la punta del poste: lo forman el cable y el poste. El poste es el cateto adyacente: ', dF('8 m'), '.'] },
        { texto: ['Frente a ', al, ', sin tocarlo, queda el suelo, de la base a la estaca: es el cateto opuesto, ', dF('6 m'), '.'] },
      ],
      respuesta: ['Opuesto a ', al, ': ', dF('6 m'), '; adyacente a ', al, ': ', dF('8 m')] },
    { nivel: 2, titulo: 'La base de la rampa', figura: fig({ objeto: 'rampa', medidas: { ra: 2.4, rb: 0.7 }, lados: { rb: { texto: '0,7 m', color: 'i' }, h: { texto: '2,5 m', color: 'o' } }, angulos: { a: { texto: 'θ' } } }),
      enunciado: ['Una rampa de 2,5 m sube 0,7 m, desde el piso hasta la puerta de un almacén. ', thN, ' es su ángulo con el piso. ¿Cuánto mide el cateto adyacente a ', thN, '?'],
      datos: [DL.ca, DL.pita],
      solucion: [
        { texto: [thN, ' está abajo: lo forman la rampa, que es la hipotenusa, y la base en el piso. El cateto adyacente es la base.'] },
        { texto: 'Con Pitágoras, la base es la raíz de la rampa al cuadrado menos la altura al cuadrado.',
          ecuacion: [raizDif('2,5', '0,7'), ' = ', { raiz: ['6,25 − 0,49'] }, ' = √5,76 = ', dF('2,4 m')] },
      ],
      respuesta: ['La base: ', dF('2,4 m')] },
    { nivel: 3, titulo: 'La sombra vista desde arriba', figura: fig({ objeto: 'poste', sombra: true, medidas: { ra: 6, rb: 4.5 }, lados: { rb: { texto: '4,5 m', color: 'i' }, h: { texto: '7,5 m', color: 'o' } }, angulos: { b: { texto: 'α' } } }),
      enunciado: ['Un poste de 4,5 m da sombra. El rayo de sol que roza su punta mide 7,5 m hasta el final de la sombra. ', al, ' está entre el rayo y el poste. ¿Cuánto mide el cateto opuesto a ', al, '?'],
      datos: [DL.co, DL.pita],
      solucion: [
        { texto: [al, ' está arriba: lo forman el rayo y el poste. Frente a ', al, ' queda la sombra. El poste es vertical, pero toca a ', al, ': no es su opuesto.'] },
        { texto: 'La sombra es un cateto y el rayo, la hipotenusa. Con Pitágoras:',
          ecuacion: [raizDif('7,5', '4,5'), ' = ', { raiz: ['56,25 − 20,25'] }, ' = √36 = ', dF('6 m')] },
      ],
      respuesta: ['La sombra: ', dF('6 m')] },
    { nivel: 3, titulo: 'Una medida con dos nombres', figura: fig({ objeto: 'escalera', medidas: { ra: 1, rb: 2.4 }, lados: { h: { texto: '2,6 m', color: 'o' } }, angulos: { a: { texto: 'θ' }, b: { texto: 'α' } } }),
      enunciado: ['Una escalera de 2,6 m se apoya en una pared. ', thN, ' es su ángulo con el piso; ', al, ', con la pared. El opuesto a ', thN, ' mide 2,4 m. ¿Cuánto miden el adyacente a ', al, ' y el opuesto a ', al, '?'],
      datos: [DL.co, DL.ca, DL.pita],
      solucion: [
        { texto: ['Frente a ', thN, ', que está en el pie, queda la pared: mide ', dI('2,4 m'), '. La pared forma ', al, ' junto con la escalera: es el adyacente a ', al, ', ', dF('2,4 m'), '.'] },
        { texto: ['El opuesto a ', al, ' es el piso. Sale de Pitágoras, con la escalera como hipotenusa:'],
          ecuacion: [raizDif('2,6', '2,4'), ' = ', { raiz: ['6,76 − 5,76'] }, ' = √1 = ', dF('1 m')] },
      ],
      respuesta: ['Adyacente a ', al, ': ', dF('2,4 m'), '; opuesto a ', al, ': ', dF('1 m')] },
    { nivel: 3, titulo: 'La chacra triangular', figura: fig({ objeto: 'chacra', medidas: { ra: 90, rb: 120 }, lados: t3('90 m', '120 m', '150 m') }),
      enunciado: ['Una chacra tiene forma de triángulo rectángulo, con lados de 90 m, 120 m y 150 m. ', thN, ' es el ángulo de la esquina que queda frente al lado de 90 m. ¿Cuánto mide el cateto adyacente a ', thN, '?'],
      datos: [DL.h, DL.ca],
      solucion: [
        { texto: 'La hipotenusa es el lado más largo: 150 m. Los catetos son los otros dos, 90 m y 120 m.' },
        { texto: ['La esquina de ', thN, ' queda frente al lado de 90 m, así que la tocan los lados de 120 m y 150 m.'] },
        { texto: ['De esos dos, 150 m es la hipotenusa. El cateto adyacente es el otro: ', dF('120 m'), '. Tocar a ', thN, ' no basta: también tiene que ser cateto.'] },
      ],
      respuesta: [dF('120 m')] },
    { nivel: 3, titulo: 'Recto en Q', figura: fig({ objeto: 'triangulo', medidas: { ra: 20, rb: 21 }, giro: 25, vertices: { r: 'Q', a: 'P', b: 'R' }, lados: t3('20', '21', '29'), angulos: { b: {} } }),
      enunciado: 'En el triángulo PQR, recto en Q, PQ = 20, QR = 21 y PR = 29. ¿Cuánto miden el cateto opuesto y el cateto adyacente al ángulo R?',
      datos: [DL.seg('P', 'Q'), DL.recto('Q'), DL.co, DL.ca],
      solucion: [
        { texto: 'El ángulo recto está en Q: los catetos son los dos lados que pasan por Q, PQ y QR. PR es la hipotenusa.' },
        { texto: ['El ángulo R lo forman QR y PR. El cateto adyacente es QR: ', dF('21'), '. Frente a R, sin tocarlo, queda PQ: ', dF('20'), '.'] },
      ],
      respuesta: ['Opuesto a R: ', dF('PQ = 20'), '; adyacente a R: ', dF('QR = 21')] },
    { nivel: 3, titulo: 'La suma en la repisa', figura: fig({ objeto: 'repisa', medidas: { ra: 20, rb: 15 }, lados: { ra: { texto: '20 cm', color: 'i' }, h: { texto: '25 cm', color: 'o' } }, angulos: { a: { texto: 'θ' }, b: { texto: 'α' } } }),
      enunciado: ['El tirante de una repisa mide 25 cm y llega a la pared 20 cm bajo el brazo. ', thN, ' y ', al, ' son los ángulos marcados. ¿Cuánto suman el opuesto a ', thN, ' y el adyacente a ', al, '?'],
      datos: [DL.co, DL.ca, DL.pita],
      solucion: [
        { texto: ['Frente a ', thN, ' queda el brazo. ', al, ' lo forman el tirante y el brazo: su adyacente también es el brazo. Se suma dos veces el mismo lado.'] },
        { texto: 'El brazo es un cateto; el tirante, la hipotenusa. Con Pitágoras:', ecuacion: [raizDif('25', '20'), ' = ', { raiz: ['625 − 400'] }, ' = √225 = 15 cm'] },
        { texto: 'La suma:', ecuacion: ['15 cm + 15 cm = ', dF('30 cm')] },
      ],
      respuesta: [dF('30 cm')] },
  ];

  // «Ahora tú», tipo 1: el triángulo de examen, con vértices nombrados (sin A, B, C ni H: «CA» se leería como un lado).
  const LETRAS = [['P', 'Q', 'R'], ['M', 'N', 'T'], ['D', 'E', 'F'], ['K', 'L', 'S']];
  const segN = (x, y) => [x, y].sort().join('');
  function casoVertices(r) {
    const ls = r.uno(LETRAS), orden = r.uno([[0, 1, 2], [1, 0, 2], [2, 0, 1], [1, 2, 0]]);
    const V = { r: ls[orden[0]], a: ls[orden[1]], b: ls[orden[2]] };
    const [ra, rb] = r.uno([[3, 4], [5, 12], [8, 15], [4, 3], [12, 5]]);
    const giro = r.uno([20, 75, 140, 200, 250, 315]);
    const en = r.uno(['a', 'b']), pide = r.uno(['co', 'ca', 'ca', 'co']);
    const seg = { ra: segN(V.r, V.a), rb: segN(V.r, V.b), h: segN(V.a, V.b) };
    const ds = desde(en), bien = ds[pide], otro = ds[pide === 'co' ? 'ca' : 'co'], X = V[en];
    const nombre = pide === 'co' ? 'opuesto' : 'adyacente';
    const ops = [
      { id: 'c', texto: seg[bien], correcta: true },
      { id: 'cambia', texto: seg[otro], error: 'TR9', siFuera: pide === 'co' ? `${seg[otro]} es cateto, bien; pero pasa por ${X}: lo toca. El opuesto no pasa por ${X}.` : `${seg[otro]} es cateto, bien; pero no pasa por ${X}: queda enfrente. El adyacente pasa por ${X}.` },
      { id: 'hip', texto: seg.h, error: pide === 'ca' ? 'LAD-TOCA-H' : 'LAD-HIPOTENUSA', siFuera: pide === 'ca' ? `${seg.h} también pasa por ${X}, es cierto; pero no pasa por ${V.r}: es la hipotenusa.` : `${seg.h} no pasa por el recto, es cierto: por eso es la hipotenusa, no un cateto.` },
    ];
    return {
      pregunta: `En el triángulo ${ls.join('')}, recto en ${V.r}, ¿cuál es el cateto ${nombre} al ángulo ${X}?`,
      datos: [DL.seg(...[V.r, V.a].sort()), DL.recto(V.r), DL.co, DL.ca],
      dibujo: { datos: { objeto: 'triangulo', medidas: { ra, rb }, giro, vertices: V, angulos: { [en]: {} } }, estado: {} },
      opciones: ops,
      solucion: { texto: pide === 'ca' ? `Por ${X} pasan ${seg[bien]} y ${seg.h}. ${seg.h} no pasa por ${V.r}: es la hipotenusa. El adyacente es ${seg[bien]}.` : `Los catetos pasan por ${V.r}. De ellos, ${seg[bien]} no pasa por ${X}: queda enfrente.` },
    };
  }
  // «Ahora tú», tipo 0: nombrar un lado de un objeto (los tres largos a la vista, en tinta).
  function casoNombrar(r) {
    const o = r.uno(OBJS), [ra, rb, hh] = r.uno(o.ternas), val = { ra, rb, h: hh }, en = r.uno(['a', 'b']);
    const pide = r.uno(['co', 'ca', 'co', 'ca', 'h']), ds = desde(en), bien = pide === 'h' ? 'h' : ds[pide];
    const op = k => `${cap(o[k])}, ${largoTxt(val[k], o.u)}`;
    const err = k => {
      if (pide === 'h') return { error: 'LAD-HIP-CATETO', siFuera: `${cap(o[k])} es un lado del triángulo, pero forma el ángulo recto: es un cateto.` };
      if (k === 'h') return pide === 'ca' ? { error: 'LAD-TOCA-H', siFuera: `${cap(o.h)} también toca a θ, es cierto; pero es la hipotenusa, no un cateto.` }
        : { error: 'LAD-HIPOTENUSA', siFuera: `Buscaste un lado lejos del rincón; pero ${o.h} toca a θ: es la hipotenusa.` };
      if (pide === 'co' && k === o.vertical) return { error: 'TR7', siFuera: `Elegiste un cateto, bien; ${o[k]} es vertical, pero toca a θ: es el adyacente.` };
      return { error: 'TR9', siFuera: pide === 'co' ? `Elegiste un cateto, bien; pero ${o[k]} toca a θ: es el adyacente. El opuesto queda enfrente.` : `Elegiste un cateto, bien; pero ${o[k]} queda frente a θ: es el opuesto.` };
    };
    const ops = [{ id: 'c', texto: op(bien), correcta: true }];
    for (const k of ['ra', 'rb', 'h']) if (k !== bien) ops.push(Object.assign({ id: k, texto: op(k) }, err(k)));
    const pideTxt = pide === 'h' ? ['la hipotenusa'] : [`el cateto ${pide === 'co' ? 'opuesto' : 'adyacente'} a `, thN];
    const sol = pide === 'h' ? `El ángulo recto lo forman ${o.ra} y ${o.rb}. Frente a él queda ${o.h}: ${largoTxt(hh, o.u)}.`
      : pide === 'co' ? `Frente a θ, sin tocarlo, queda ${o[bien]}: ${largoTxt(val[bien], o.u)}. Es un cateto.`
        : `A θ lo tocan ${o.h}, que es la hipotenusa, y ${o[bien]}: ${largoTxt(val[bien], o.u)}.`;
    return {
      pregunta: [`${o.intro} `, thN, ` es el ángulo ${o[en]}. ¿Cuánto mide `, ...pideTxt, '?'],
      datos: [DL.cat, DL.h, DL.co, DL.ca],
      dibujo: figO(o, ra, rb, t3(largoTxt(ra, o.u), largoTxt(rb, o.u), largoTxt(hh, o.u)), { [en]: { texto: 'θ' } }),
      opciones: ops,
      solucion: { texto: sol },
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
      dibujo: figO(o, ra, rb, { [dado]: { texto: L(val[dado]), color: 'i' }, h: { texto: L(hh), color: 'o' } }, { [thEn]: { texto: 'θ' }, [alEn]: { texto: 'α' } }),
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
        { titulo: 'Una escalera en la pared', texto: 'Una escalera apoyada en la pared de una casa forma un triángulo con la pared y el piso. La pared y el piso se juntan en un ángulo recto, de 90°: se marca con un cuadradito.',
          pieza: OB, dibujo: { datos: { objeto: 'escalera', medidas: { piso: 3, pared: 4 }, marco: [4.5, 5], lados: { escalera: { color: 'o' }, pared: { color: 'i' }, piso: { color: 'f' } } }, estado: {} } },
        { titulo: 'Catetos e hipotenusa', texto: 'Los dos lados que forman el ángulo recto se llaman catetos: aquí, la pared y el piso. El lado de enfrente del ángulo recto es la hipotenusa, H: aquí, la escalera. Pitágoras los une.',
          ecuacion: ['Pitágoras: ', cuad('H'), ' = ', cuad('cateto'), ' + ', cuad('cateto')] },
        { titulo: 'Opuesto y adyacente', texto: ['Los catetos se nombran desde un ángulo agudo: el que miras. Aquí es ', thN, ', abajo. El cateto que toca a ', thN, ' es el adyacente, CA. El que queda frente a ', thN, ', sin tocarlo, es el opuesto, CO.'],
          pieza: OB, dibujo: { datos: { objeto: 'escalera', medidas: { piso: 3, pared: 4 }, marco: [4.5, 5], lados: { escalera: { color: 'o' }, pared: { color: 'i' }, piso: { color: 'f' } }, angulos: { pie: { texto: 'θ' } } }, estado: {} } },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a correr el pie de una escalera de 5 m. Mira qué lado toca a ', thN, ', cuál queda enfrente y cuál es siempre el más largo.'] },
      ],
    },
    ejemplos: EJEMPLOS_LADOS,
    juega: {
      pieza: OB,
      consigna: ['Una escalera de 5 m está apoyada en la pared de una casa de adobe. ', thN, ' es el ángulo entre la escalera y el piso.'],
      mision: {
        texto: 'Corre el pie hasta que el cateto adyacente a θ mida 3 m.',
        logrado: val => Math.abs(val.pie - 3) < 1e-9,
        bien: 'Listo: el piso toca a θ y mide 3 m. La escalera es la hipotenusa.',
      },
      voz: '¿Qué lado toca a θ y cuál queda enfrente?',
      leyenda: [
        { s: thN, t: 'ángulo entre la escalera y el piso' },
        { s: '∟', t: 'ángulo recto, de 90°' },
        { s: '>', t: 'más largo que' },
        { s: '≈', t: 'aproximado, redondeado' },
      ],
      controles: [
        { id: 'pie', etiqueta: 'Pie a la pared', color: 'c-f', min: 1, max: 4.5, paso: 0.5, inicio: 1.5, unidad: 'm', decimales: 1 },
      ],
      // Gesto directo: el pie se arrastra por el piso; la escala está fija (marco), así que sigue al dedo.
      arrastres: [{ id: 'pie', etiqueta: 'pie de la escalera: se corre por el piso', color: 'c-f',
        donde: v => { const g = TO().geometria(escJ(v)); return { x: g.a[0], y: g.a[1] }; },
        mover: (pt, v) => { const g = TO().geometria(escJ(v)); return { pie: (g.r[0] - pt.x) / g.s }; } }],
      dibujo: v => ({ datos: escJ(v), estado: {} }),
      lectura: v => ['Escalera ', dO('5 m'), ' > pared ', dI(largoTxt(altoEsc(v.pie))), ' y > piso ', dF(largoTxt(v.pie))],
      minimo: 3,
    },
    predice: {
      pregunta: ['Ahora miras desde ', al, ', el ángulo de arriba, entre la escalera y la pared. ¿Cuál es el cateto opuesto a ', al, '?'],
      datos: ['Escalera: 5 m', 'Pared, del piso hasta donde se apoya la escalera: 4 m', 'Piso, del pie de la escalera hasta la pared: 3 m'],
      voz: 'Ubica α y mira qué lados lo forman.',
      opciones: [
        { id: 'c', texto: 'El piso, de 3 m', correcta: true },
        { id: 'vertical', texto: 'La pared, de 4 m', error: 'TR7', siFuera: 'La pared queda frente a θ, es cierto. Pero α está arriba, y la pared lo toca.' },
        { id: 'escalera', texto: 'La escalera, de 5 m', error: 'LAD-HIPOTENUSA', siFuera: 'Buscar un lado lejos de α está bien; pero la escalera forma α: lo toca. Es la hipotenusa.' },
        { id: 'piso', texto: 'Ninguno: α no está en el piso', error: 'LAD-SOLO-PISO', siFuera: 'Es cierto que α no toca el piso. Justo por eso el piso es el cateto que tiene enfrente.' },
      ],
      // El piso va en tinta al predecir: en violeta (lo que se pide) delataría la respuesta.
      dibujo: { datos: ESC345({ pisoColor: null }), estado: {} },
      revelar: { datos: ESC345({ piso2: 'opuesto a α', pared2: 'adyacente a α' }), estado: {} },
      coincide: 'Coincide: el piso queda frente a α. Desde arriba, los catetos cambian de nombre.',
      noCoincide: 'Revisemos: α lo forman la escalera y la pared. Frente a α queda el piso.',
    },
    mira: {
      pieza: OB,
      datos: ESC345({ h: [{ t: '5 m' }, { t: 'H = 5 m', paso: 1 }], piso: [{ t: '3 m' }, { t: 'CA = 3 m', paso: 2 }], pared: [{ t: '4 m' }, { t: 'CO = 4 m', paso: 3 }],
        piso2: [{ t: 'opuesto a α', paso: 4 }], pared2: [{ t: 'adyacente a α', paso: 4 }], pasoAlfa: 4 }),
      voz: 'Primero el ángulo recto; después, el ángulo desde el que miras.',
      pasos: [
        { estado: { paso: 0 }, texto: 'El ángulo recto está en el rincón, entre la pared y el piso.' },
        { estado: { paso: 1 }, texto: 'Frente al ángulo recto queda la escalera: es la hipotenusa, el lado más largo.', ecuacion: ['H = ', dO('5 m')] },
        { estado: { paso: 2 }, texto: ['Desde ', thN, ', el piso toca a ', thN, ': es el cateto adyacente.'], ecuacion: ['CA = ', dF('3 m')] },
        { estado: { paso: 3 }, texto: ['La pared queda frente a ', thN, ', sin tocarlo: es el cateto opuesto.'], ecuacion: ['CO = ', dI('4 m')] },
        { estado: { paso: 4 }, texto: ['Ahora desde ', al, ', arriba: la pared toca a ', al, ' y el piso queda enfrente.'], ecuacion: ['adyacente a ', al, ' = ', dI('4 m'), ';   opuesto a ', al, ' = ', dF('3 m')] },
        { estado: { paso: 4 }, texto: 'Los catetos se intercambian; la hipotenusa sigue siendo la escalera.', ecuacion: ['CO = adyacente a ', al, ' = ', dI('4 m')] },
      ],
    },
    regla: {
      texto: 'La hipotenusa es el lado frente al ángulo recto, el más largo. Desde un ángulo agudo, el cateto que lo toca es el adyacente; el de enfrente, el opuesto.',
      ecuacion: ['Desde ', thN, ':   CA toca a ', thN, ';   CO queda frente a ', thN, ';   H queda frente a 90°'],
      condicion: 'Vale en un triángulo rectángulo. Desde el otro ángulo agudo, α, opuesto y adyacente se intercambian; la hipotenusa no cambia.',
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
        return [casoNombrar, casoVertices, casoExamen][sem % 3](r);
      },
    },
  };

  // ---------- Idea 2: la razón no depende del tamaño ----------
  // Cambia: los dos catetos (opuesto y adyacente a θ). · Permanece: el ángulo recto y los nombres de los lados.
  // Progresa: el cociente CO/H en la lectura. · Se reserva: dos triángulos semejantes de tamaños distintos (la predicción).
  // Debe verse: que el triángulo grande contiene al chico y los dos cocientes coinciden.
  const SEMEJANTES = {
    puntos: [{ id: 'a', x: 0, y: 0, paso: 1 }, { id: 'c', x: 4, y: 0, paso: 1 }, { id: 'b', x: 4, y: 3, paso: 1 }, { id: 'A', x: 6, y: 0 }, { id: 'C', x: 14, y: 0 }, { id: 'B', x: 14, y: 6 }],
    lados: [
      { de: 'A', a: 'C', color: 'i', texto: '8', grosor: 'variable' }, { de: 'C', a: 'B', color: 'h', texto: '6', grosor: 'variable' }, { de: 'A', a: 'B', color: 'd', texto: '10', grosor: 'variable', lado: -1 },
      { de: 'a', a: 'c', color: 'i', texto: '4', grosor: 'variable', paso: 1 }, { de: 'c', a: 'b', color: 'h', texto: '3', grosor: 'variable', paso: 1, lado: -1 }, { de: 'a', a: 'b', color: 'd', texto: '5', grosor: 'variable', paso: 1 },
    ],
    angulos: [{ en: 'A', de: 'C', a: 'B', texto: 'θ', color: 'o' }, { en: 'C', de: 'A', a: 'B' }, { en: 'a', de: 'c', a: 'b', texto: 'θ', color: 'o', paso: 1 }, { en: 'c', de: 'a', a: 'b', paso: 1 }],
  };
  const triJ = v => tri(v.co, v.ca, { marco: [5, 5] });
  const definicion = {
    id: 'razon-cociente',
    titulo: 'Una razón es un cociente',
    temas: ['Definición en el triángulo rectángulo'],
    pieza: 'triangulo',
    // Lee (fase 2): vocabulario de los lados vistos desde θ, sin adelantar que la razón no depende del tamaño (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Tres lados con nombre', texto: 'Un triángulo rectángulo tiene un ángulo de 90°. Los dos lados que forman ese ángulo se llaman catetos. El tercero, el más largo y frente al 90°, es la hipotenusa.' },
        { titulo: 'Desde dónde miras', texto: ['Los catetos cambian de nombre según el ángulo agudo desde el que miras. El que toca a ', th, ' es el adyacente, ', CA, '. El que queda frente a ', th, ', sin tocarlo, es el opuesto, ', CO, '.'] },
        { titulo: 'Qué mirar', texto: 'En el juego cambias los dos catetos. Mira la hipotenusa que sale y el cociente de la lectura: el opuesto dividido entre la hipotenusa.',
          ecuacion: ['sen ', th, ' = ', { frac: [CO, H] }] },
      ],
    },
    juega: {
      consigna: 'Elige el cateto opuesto a θ y el adyacente. La lectura divide el opuesto entre la hipotenusa: ese cociente es sen θ.',
      voz: 'Nombra los lados siempre desde el ángulo θ.',
      controles: [
        { id: 'co', etiqueta: 'CO', color: 'c-h', min: 1, max: 5, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'ca', etiqueta: 'CA', color: 'c-i', min: 1, max: 5, paso: 1, inicio: 4, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: triJ(v), estado: {} }),
      lectura: v => [H, ` = ${f(Math.hypot(v.co, v.ca))} · sen `, th, ` = ${f(v.co)}/${f(Math.hypot(v.co, v.ca))} = ${f(v.co / Math.hypot(v.co, v.ca), 3)}`],
      minimo: 3,
      // Se arrastra el vértice B: de lado cambia el adyacente CA; hacia arriba, el opuesto CO.
      arrastres: [{ id: 'vertice-b', etiqueta: 'vértice B: CA de lado, CO hacia arriba', color: 'c-h',
        donde: v => enPx(triJ(v), v.ca, v.co),
        mover: (pt, v) => { const q = delPx(triJ(v), pt); return { ca: q.x, co: q.y }; } }],
    },
    predice: {
      pregunta: 'Un triángulo rectángulo tiene catetos 3 y 4; otro, catetos 6 y 8. En los dos, θ se opone al cateto menor. ¿Cuál tiene mayor sen θ?',
      voz: 'Piensa en qué compara el seno.',
      opciones: [
        { id: 'c', texto: 'Los dos tienen el mismo sen θ', correcta: true },
        { id: 'grande', texto: 'El de catetos 6 y 8, que es más grande', error: 'TR8', siFuera: 'Sus lados son mayores, es cierto; pero el seno compara dos lados, y los dos se duplicaron.' },
        { id: 'chico', texto: 'El de catetos 3 y 4', error: 'TR8', siFuera: 'Comparar los triángulos está bien; los dos cocientes dan 3/5: ninguno gana.' },
        { id: 'falta', texto: 'No se puede saber sin medir θ', error: 'RAZ-FALTA-ANGULO', siFuera: 'Medir θ ayudaría; pero bastan dos lados: sen θ = CO/H en cada uno.' },
      ],
      dibujo: { datos: tri(6, 8, { co: '6', ca: '8', h: '10' }), estado: {} },
      revelar: { datos: SEMEJANTES, estado: { paso: 1 } },
      coincide: 'Coincide: mismo ángulo θ, lados al doble, mismo cociente.',
      noCoincide: 'Revisemos: los dos triángulos tienen el mismo θ y cocientes 3/5.',
    },
    mira: {
      pieza: 'triangulo',
      datos: SEMEJANTES,
      voz: 'Compara los dos cocientes, no los lados sueltos.',
      pasos: [
        { estado: { paso: 0 }, texto: 'En el grande, el opuesto a θ es 6 y la hipotenusa 10.', ecuacion: ['sen ', th, ' = ', { frac: [CO, H] }, ' = ', { frac: ['6', '10'] }, ' = ', { frac: ['3', '5'] }] },
        { estado: { paso: 1 }, texto: 'El chico tiene el mismo ángulo θ y lados de la mitad.', ecuacion: ['sen ', th, ' = ', { frac: ['3', '5'] }] },
        { estado: { paso: 1 }, texto: 'Los dos lados se duplicaron: el cociente no cambia.', ecuacion: [{ frac: ['2 · 3', '2 · 5'] }, ' = ', { frac: ['3', '5'] }, ' = 0,6'] },
      ],
    },
    regla: {
      texto: 'En un triángulo rectángulo, cada razón trigonométrica divide dos lados vistos desde el ángulo agudo θ. Depende solo de θ, no del tamaño.',
      ecuacion: ['sen ', th, ' = ', { frac: [{ llave: [CO], nota: 'opuesto a θ', color: 'c-h' }, H] }, '   ·   ', 'cos ', th, ' = ', { frac: [{ llave: [CA], nota: 'junto a θ', color: 'c-i' }, H] }],
      condicion: 'θ agudo de un triángulo rectángulo. tan θ = CO/CA; cot, sec y csc invierten tan, cos y sen.',
      voz: 'Una razón es un número sin unidades: compara dos largos.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (una razón con los lados de un triángulo pitagórico), otras semillas.
    resuelve: {
      pieza: 'triangulo',
      generar(s) {
        const rr = azar(s + 900), [p, q, hh] = rr.uno([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), k = rr.ent(1, 3);
        const [co, ca] = rr.ent(0, 1) ? [p * k, q * k] : [q * k, p * k], hv = hh * k;
        const razon = ['sen', 'cos', 'tan'][s % 3];
        const [num, den] = { sen: [co, hv], cos: [ca, hv], tan: [co, ca] }[razon];
        const lados = { sen: [CO, H], cos: [CA, H], tan: [CO, CA] }[razon];
        const dice = { sen: 'El seno divide el cateto que queda frente a θ entre la hipotenusa, el lado más largo.',
          cos: 'El coseno divide el cateto que toca a θ entre la hipotenusa, el lado más largo.',
          tan: 'La tangente divide el cateto que queda frente a θ entre el cateto que lo toca.' }[razon];
        const valor = num / den;
        return {
          enunciado: ['En el triángulo de la figura, ¿cuánto vale ', `${razon} `, th, '?'],
          dibujo: { datos: tri(co, ca, { co: `${co}`, ca: `${ca}`, h: `${hv}` }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden ', `${razon} `, th, ': un cociente entre dos lados del triángulo.'] },
            { tipo: 'datos', texto: ['Desde ', th, `, el opuesto mide ${co}, el adyacente ${ca} y la hipotenusa ${hv}.`],
              ecuacion: [CO, ` = ${co}`, '   ·   ', CA, ` = ${ca}`, '   ·   ', H, ` = ${hv}`] },
            { tipo: 'regla', texto: [dice], ecuacion: [`${razon} `, th, ' = ', { frac: lados }] },
            { tipo: 'cuentas', texto: ['Reemplazo los dos lados y simplifico la fracción.'],
              ecuacion: [`${razon} `, th, ' = ', { frac: [`${num}`, `${den}`] }, ` = ${fr(num, den)}`] },
            { tipo: 'sentido', texto: [`Pitágoras cuadra: ${co}² + ${ca}² = ${co * co + ca * ca} = ${hv}². `,
              razon === 'tan' ? `La tangente puede pasar de 1; aquí da ${f(valor, 3)}.` : `Sale ${f(valor, 3)}, menos que 1: un cateto es más corto que la hipotenusa.`] },
          ],
          respuesta: [`${razon} `, th, ` = ${fr(num, den)}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'triangulo',
      voz: 'Ubica θ y nombra los lados desde él.',
      generar(sem) {
        const rr = azar(sem), [p, q, hh] = rr.uno([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), k = rr.ent(1, 3);
        const [co, ca] = rr.ent(0, 1) ? [p * k, q * k] : [q * k, p * k], hv = hh * k;
        const razon = ['sen', 'cos', 'tan'][sem % 3];
        const [num, den, otraNum, otraDen] = { sen: [co, hv, ca, hv], cos: [ca, hv, co, hv], tan: [co, ca, ca, co] }[razon];
        const otra = { sen: 'cos', cos: 'sen', tan: 'cot' }[razon];
        return {
          pregunta: ['En el triángulo de la figura, ¿cuánto vale ', `${razon} `, th, '?'],
          dibujo: { datos: tri(co, ca, { co: `${co}`, ca: `${ca}`, h: `${hv}` }), estado: {} },
          opciones: opciones(fr(num, den), [
            { id: 'largo', valor: `${num}`, error: 'TR7', siFuera: `${num} es el largo de un lado. La razón divide ese lado entre otro.` },
            { id: 'cambia', valor: fr(otraNum, otraDen), error: 'TR9', siFuera: `Ese cociente es ${otra} θ: usa el otro cateto.` },
            { id: 'reciproca', valor: fr(den, num), error: 'REC-INVERSA', siFuera: 'Los lados son los correctos, pero invertidos: eso es la recíproca.' },
          ], x => x),
          solucion: { texto: `Desde θ: ${razon === 'cos' ? 'el adyacente' : 'el opuesto'} es ${num} y ${razon === 'tan' ? 'el adyacente' : 'la hipotenusa'} ${den}.`, ecuacion: [`${razon} `, th, ' = ', { frac: [`${num}`, `${den}`] }, ` = ${fr(num, den)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: notables exactos ----------
  // Cambia: la figura (medio cuadrado o medio triángulo equilátero) y su lado. · Permanece: el ángulo recto y la mitad
  // punteada que se cortó. · Progresa: los lados con raíz que salen de Pitágoras. · Se reserva: una razón de 60° a
  // partir de la de 30° (la predicción). · Debe verse: que 30°, 45° y 60° tienen lados exactos y razones exactas.
  const medioCuadrado = (Lv, o = {}) => ({
    puntos: [{ id: 'A', x: 0, y: 0 }, { id: 'C', x: Lv, y: 0 }, { id: 'B', x: Lv, y: Lv }, { id: 'D', x: 0, y: Lv }],
    lados: [
      { de: 'A', a: 'C', color: 'i', texto: o.ca || `${Lv}`, grosor: 'variable' }, { de: 'C', a: 'B', color: 'h', texto: o.co || `${Lv}`, grosor: 'variable' },
      { de: 'A', a: 'B', color: 'd', texto: o.h || `${Lv}√2`, grosor: 'variable', lado: -1 },
      { de: 'A', a: 'D', visual: true }, { de: 'D', a: 'B', visual: true },
    ],
    angulos: [{ en: 'A', de: 'C', a: 'B', texto: '45°', color: 'o' }, { en: 'C', de: 'A', a: 'B' }, { en: 'B', de: 'C', a: 'A', texto: '45°' }],
  });
  const medioEquilatero = (Lv, o = {}) => {
    const al = Lv * Math.sqrt(3) / 2;
    return {
      puntos: [{ id: 'A', x: 0, y: 0 }, { id: 'M', x: Lv / 2, y: 0 }, { id: 'T', x: Lv / 2, y: al }, { id: 'Q', x: Lv, y: 0 }],
      lados: [
        { de: 'A', a: 'M', color: 'i', texto: o.am || `${f(Lv / 2)}`, grosor: 'variable' }, { de: 'M', a: 'T', color: 'h', texto: o.mt || `${f(Lv / 2)}√3`, grosor: 'variable', lado: 1 },
        { de: 'A', a: 'T', color: 'd', texto: o.at || `${Lv}`, grosor: 'variable' },
        { de: 'M', a: 'Q', visual: true }, { de: 'Q', a: 'T', visual: true },
      ],
      angulos: [{ en: 'A', de: 'M', a: 'T', texto: '60°', color: 'o' }, { en: 'M', de: 'A', a: 'T' }, { en: 'T', de: 'M', a: 'A', texto: '30°', paso: o.paso30 }],
    };
  };
  const VAL = {
    sen: { 30: '1/2', 45: '√2/2', 60: '√3/2' }, cos: { 30: '√3/2', 45: '√2/2', 60: '1/2' },
    tan: { 30: '√3/3', 45: '1', 60: '√3' }, cot: { 30: '√3', 45: '1', 60: '√3/3' },
    sec: { 30: '2√3/3', 45: '√2', 60: '2' }, csc: { 30: '2', 45: '√2', 60: '2√3/3' },
  };
  const COF = { sen: 'cos', cos: 'sen', tan: 'cot', cot: 'tan', sec: 'csc', csc: 'sec' };
  const RECI = { sen: 'csc', cos: 'sec', tan: 'cot', cot: 'tan', sec: 'cos', csc: 'sen' };
  const notJ = v => {
    const dd = v.fig === 'cu' ? medioCuadrado(v.L) : medioEquilatero(v.L);
    // El marco pasa apenas de 8 para que el rótulo de la altura quede siempre del lado de la mitad punteada.
    dd.puntos.push(...marco(8.2, v.fig === 'cu' ? 8 : 8 * Math.sqrt(3) / 2));
    if (v.fig !== 'cu') dd.lados[1].lado = -1;
    return dd;
  };
  const notables = {
    id: 'notables',
    titulo: 'Medio cuadrado, medio equilátero',
    temas: ['Ángulos notables'],
    pieza: 'triangulo',
    // Lee (fase 2): qué son los ángulos notables y de qué figuras salen, sin dar ningún valor de 60° (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Ángulos que se repiten', texto: 'En los exámenes de admisión vuelven siempre los mismos ángulos: 30°, 45° y 60°. Se llaman ángulos notables porque sus razones se escriben exactas, con raíces, sin calculadora.' },
        { titulo: 'Dos figuras partidas', texto: 'Un cuadrado cortado por su diagonal deja dos triángulos rectángulos iguales. Un triángulo equilátero cortado por su altura, también. De esas mitades salen los tres ángulos notables.' },
        { titulo: 'Qué mirar', texto: 'En el juego eliges la figura y su lado. Fíjate qué lados salen enteros y cuáles llevan raíz cuando el lado cambia.' },
      ],
    },
    juega: {
      consigna: 'Elige la figura y su lado. Cortada por la mitad, da un triángulo rectángulo con 45°, o con 30° y 60°. Mira sus lados.',
      voz: 'Mira qué lados salen con raíz y cuáles no.',
      controles: [
        { id: 'fig', etiqueta: 'Figura', opciones: [{ valor: 'eq', texto: 'Equilátero' }, { valor: 'cu', texto: 'Cuadrado' }], inicio: 'eq' },
        { id: 'L', etiqueta: 'Lado', min: 2, max: 8, paso: 2, inicio: 4, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: notJ(v), estado: {} }),
      lectura: v => (v.fig === 'cu' ? [CO, ` = ${v.L} · `, CA, ` = ${v.L} · `, H, ` = ${v.L}√2`] : [`frente a 30°: ${f(v.L / 2)} · frente a 60°: ${f(v.L / 2)}√3 · `, H, ` = ${v.L}`]),
      minimo: 3,
      // Se arrastra la esquina de la base de la figura entera (Q en el equilátero, C en el cuadrado): cambia el lado.
      // La figura (cuadrado o equilátero) es una opción discreta y queda con sus botones.
      arrastres: [{ id: 'esquina', etiqueta: 'esquina de la base: cambia el lado', color: 'c-i',
        donde: v => enPx(notJ(v), v.L, 0),
        mover: (pt, v) => ({ L: delPx(notJ(v), pt).x }) }],
    },
    predice: {
      pregunta: 'Sabemos que sen 30° = 1/2. ¿Cuánto vale sen 60°?',
      voz: 'Busca el lado que está frente a 60°.',
      opciones: [
        { id: 'c', texto: `√3/2 ≈ ${f(Math.sin(60 * RAD))}`, correcta: true },
        { id: 'doble', texto: '1', error: 'TR10', siFuera: 'Duplicar sería cierto si el seno fuera proporcional al ángulo. No lo es.' },
        { id: 'mismo', texto: '1/2', error: 'NOT-MISMO', siFuera: 'Comparten triángulo, es cierto; pero frente a 60° está el cateto largo, no el corto.' },
        { id: 'reciproca', texto: '2', error: 'NOT-RECIPROCA', siFuera: '2 es csc 30°, la recíproca de sen 30°. Se pedía el seno de otro ángulo.' },
      ],
      dibujo: { datos: medioEquilatero(2, { am: '1', mt: '¿?', at: '2' }), estado: {} },
      revelar: { datos: medioEquilatero(2, { am: '1', mt: '√3', at: '2' }), estado: { fantasma: { texto: 'sen 60° = √3/2' } } },
      coincide: 'Coincide: frente a 60° está el cateto √3, sobre la hipotenusa 2.',
      noCoincide: 'Revisemos el lado que está frente a 60°: mide √3.',
    },
    mira: {
      pieza: 'triangulo',
      datos: (() => {
        const e = medioEquilatero(2, { am: '1', mt: '√3', at: '2', paso30: 1 });
        const c = medioCuadrado(1.4, { ca: '1', co: '1', h: '√2' });
        const mover = id => `q${id}`;
        e.lados[1].lado = -1;
        c.puntos.forEach(q => { e.puntos.push({ id: mover(q.id), x: q.x + 2.6, y: q.y, paso: 3 }); });
        c.lados.forEach(q => e.lados.push(Object.assign({}, q, { de: mover(q.de), a: mover(q.a), paso: 3 })));
        c.angulos.forEach(q => e.angulos.push(Object.assign({}, q, { en: mover(q.en), de: mover(q.de), a: mover(q.a), paso: 3 })));
        return e;
      })(),
      voz: 'Primero los tres lados; después, los cocientes.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Un equilátero de lado 2 cortado por su altura: la base queda en 1.', ecuacion: ['hipotenusa 2', '   ·   ', 'cateto corto 1'] },
        { estado: { paso: 1 }, texto: 'La altura sale de Pitágoras.', ecuacion: [{ raiz: ['2² − 1²'] }, ' = √3'] },
        { estado: { paso: 1 }, texto: 'Frente a 30° está el 1; frente a 60°, el √3.', ecuacion: ['sen 30° = ', { frac: ['1', '2'] }, '   ·   ', 'sen 60° = ', { frac: ['√3', '2'] }] },
        { estado: { paso: 3 }, texto: 'En el medio cuadrado, los catetos son iguales y la hipotenusa es √2.', ecuacion: ['sen 45° = ', { frac: ['1', '√2'] }, ' = ', { frac: ['√2', '2'] }] },
      ],
    },
    regla: {
      texto: 'Los ángulos notables 30°, 45° y 60° tienen razones exactas: salen del medio cuadrado, con lados 1, 1 y √2, y del medio equilátero, con 1, √3 y 2.',
      ecuacion: ['sen 30° = ', { frac: ['1', '2'] }, '   ·   ', 'sen 45° = ', { frac: ['√2', '2'] }, '   ·   ', 'sen 60° = ', { frac: ['√3', '2'] }],
      condicion: 'se usan los valores exactos, sin redondear. El coseno lee el otro cateto; la tangente, opuesto entre adyacente.',
      voz: 'Dos figuras bastan para recordar los tres ángulos.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (valor exacto de una razón notable), con la tabla VAL.
    resuelve: {
      pieza: 'triangulo',
      generar(s) {
        const rr = azar(s + 900), g = [30, 45, 60][s % 3], razon = rr.uno(['sen', 'cos', 'tan', 'cot', 'sec', 'csc']);
        // Lados del triángulo de g° (medio cuadrado de cateto 1 o medio equilátero de lado 2): texto y valor.
        const L = { 30: { op: ['1', 1], ad: ['√3', Math.sqrt(3)], h: ['2', 2] }, 45: { op: ['1', 1], ad: ['1', 1], h: ['√2', Math.SQRT2] },
          60: { op: ['√3', Math.sqrt(3)], ad: ['1', 1], h: ['2', 2] } }[g];
        const usa = { sen: ['op', 'h'], cos: ['ad', 'h'], tan: ['op', 'ad'], cot: ['ad', 'op'], sec: ['h', 'ad'], csc: ['h', 'op'] }[razon];
        const sim = { op: CO, ad: CA, h: H };
        const dice = { op: 'el cateto de enfrente', ad: 'el cateto que toca al ángulo', h: 'la hipotenusa' };
        const calc = { sen: Math.sin, cos: Math.cos, tan: Math.tan, cot: x => 1 / Math.tan(x), sec: x => 1 / Math.cos(x), csc: x => 1 / Math.sin(x) }[razon](g * RAD);
        const fig = g === 45 ? medioCuadrado(1, { ca: '1', co: '1', h: '√2' }) : medioEquilatero(2, { am: '1', mt: '√3', at: '2' });
        const raiz = L[usa[1]][0].includes('√');
        return {
          enunciado: [`¿Cuál es el valor exacto de ${razon} ${g}°?`],
          dibujo: { datos: fig, estado: {} },
          pasos: [
            { tipo: 'pide', texto: [`Piden ${razon} ${g}° exacto, sin redondear.`] },
            { tipo: 'datos', texto: [g === 45 ? '45° vive en el medio cuadrado: catetos 1 y 1, hipotenusa √2.' : `${g}° vive en el medio equilátero de lado 2: lados 1, √3 y 2.`] },
            { tipo: 'regla', texto: [`${razon} divide ${dice[usa[0]]} entre ${dice[usa[1]]}, vistos desde ${g}°.`], ecuacion: [`${razon} ${g}° = `, { frac: [sim[usa[0]], sim[usa[1]]] }] },
            { tipo: 'cuentas', texto: [`Desde ${g}°, enfrente queda ${L.op[0]} y junto a él, ${L.ad[0]}.${raiz ? ' Si queda raíz abajo, se racionaliza.' : ''}`],
              ecuacion: [`${razon} ${g}° = `, { frac: [L[usa[0]][0], L[usa[1]][0]] }, ` = ${VAL[razon][g]}`] },
            { tipo: 'sentido', texto: [`Con calculadora, ${razon} ${g}° ≈ ${f(calc, 3)}, y ${L[usa[0]][0]} ÷ ${L[usa[1]][0]} ≈ ${f(L[usa[0]][1] / L[usa[1]][1], 3)}. Cuadra.`] },
          ],
          respuesta: [`${razon} ${g}° = ${VAL[razon][g]}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'triangulo',
      voz: 'Dibuja el medio cuadrado o el medio equilátero antes de responder.',
      generar(sem) {
        const rr = azar(sem), g = [30, 45, 60][sem % 3], razon = rr.uno(['sen', 'cos', 'tan', 'cot', 'sec', 'csc']);
        const otro = g === 45 ? 30 : 90 - g;
        return {
          pregunta: [`¿Cuál es el valor exacto de ${razon} ${g}°?`],
          opciones: opciones(VAL[razon][g], [
            { id: 'cof', valor: VAL[COF[razon]][g], error: 'TR9', siFuera: `Ese valor es ${COF[razon]} ${g}°: lee el otro cateto.` },
            { id: 'reci', valor: VAL[RECI[razon]][g], error: 'NOT-RECIPROCA', siFuera: `Ese valor es ${RECI[razon]} ${g}°, la recíproca: el cociente invertido.` },
            { id: 'otro', valor: VAL[razon][otro], error: 'NOT-CAMBIA', siFuera: `Ese es ${razon} ${otro}°. Revisa qué ángulo mira al lado que usaste.` },
          ], x => x),
          solucion: {
            texto: g === 45 ? 'En el medio cuadrado: catetos 1 y 1, hipotenusa √2.' : 'En el medio equilátero: lados 1, √3 y 2.',
            ecuacion: [`${razon} ${g}° = ${VAL[razon][g]}`],
            dibujo: { datos: g === 45 ? medioCuadrado(1, { ca: '1', co: '1', h: '√2' }) : medioEquilatero(2, { am: '1', mt: '√3', at: '2' }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 4: 37° y 16° son aproximaciones ----------
  // Cambia: el ángulo θ con el adyacente fijo en 4. · Permanece: el adyacente y el ángulo recto.
  // Progresa: el cateto opuesto 4 · tan θ. · Se reserva: el ángulo exacto del triángulo 3-4-5 (la predicción).
  // Debe verse: que 37° y 16° son ángulos redondeados de triángulos con lados enteros.
  const EX37 = Math.atan(3 / 4) * GRA, EX16 = Math.atan(7 / 24) * GRA;
  const DOS = tri(3, 4, { co: '3', ca: '4', h: '5', ang: 'θ', otro: `${f(90 - EX37)}°`, pasoOtro: 2 });
  DOS.angulos[0].final = `${f(EX37)}°`;
  const aproxJ = v => tri(4 * Math.tan(v.g * RAD), 4, { ang: `${v.g}°`, co: f(4 * Math.tan(v.g * RAD), 1), ca: '4', h: f(4 / Math.cos(v.g * RAD), 1), marco: [4, 4 * Math.tan(60 * RAD)] });
  const aproximados = {
    id: 'aproximados',
    titulo: '37° es un redondeo',
    temas: ['Ángulos aproximados (37°, 53°, 16°, 74°)'],
    pieza: 'triangulo',
    // Lee (fase 2): triángulos de lados enteros y sus nombres de academia, sin decir si 37° es exacto (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Lados enteros', texto: 'Algunos triángulos rectángulos tienen los tres lados enteros, como 3, 4 y 5, porque 3² + 4² = 5². Con una cuerda de 3, 4 y 5 metros, un albañil de Juliaca marca una esquina recta.' },
        { titulo: 'Nombres de academia', texto: 'Otro triángulo de lados enteros es el de 7, 24 y 25. A los ángulos agudos del 3-4-5 se les llama 37° y 53°; a los del 7-24-25, 16° y 74°.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el cateto adyacente queda fijo en 4. Mueve θ de grado en grado y lee cuánto mide el opuesto, con su decimal.' },
      ],
    },
    juega: {
      consigna: 'El cateto adyacente mide 4. Elige θ y mira cuánto mide el opuesto. Busca el ángulo que da un opuesto de 3.',
      voz: 'Anota con qué ángulo el opuesto se acerca a 3.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 30, max: 60, paso: 1, inicio: 32, unidad: '°', decimales: 0 }],
      dibujo: v => ({ datos: aproxJ(v), estado: {} }),
      lectura: v => [CO, ` = 4 · tan ${v.g}° ≈ ${f(4 * Math.tan(v.g * RAD), 1)}`],
      minimo: 3,
      // Se arrastra el vértice B por el cateto vertical: sube o baja el opuesto y con él cambia θ.
      arrastres: [{ id: 'vertice-b', etiqueta: 'vértice B: cambia θ', color: 'c-o',
        donde: v => enPx(aproxJ(v), 4, 4 * Math.tan(v.g * RAD)),
        mover: (pt, v) => ({ g: Math.atan2(delPx(aproxJ(v), pt).y, 4) * GRA }) }],
    },
    predice: {
      pregunta: 'En el triángulo de catetos 3 y 4, el ángulo opuesto al 3 suele llamarse 37°. ¿Mide exactamente 37°?',
      voz: 'Una cifra redondeada puede esconder una diferencia.',
      opciones: [
        { id: 'c', texto: `No: mide unos ${f(EX37)}°`, correcta: true },
        { id: 'exacto', texto: 'Sí: exactamente 37°', error: 'APROX-EXACTO', siFuera: `Con una cifra decimal, 4 · tan 37° da 3,0. Con más cifras da ${f(4 * Math.tan(37 * RAD))}: no es exacto.` },
        { id: 'entero', texto: 'No: mide exactamente 36°', error: 'APROX-ENTERO', siFuera: `Dudar de 37° está bien; tampoco es entero: tan θ = 3/4 da ${f(EX37)}°.` },
        { id: 'medir', texto: 'No se sabe sin transportador', error: 'APROX-MEDIR', siFuera: `Medir ayuda, pero no hace falta: tan θ = 3/4 fija el ángulo, ${f(EX37)}°.` },
      ],
      dibujo: { datos: tri(3, 4, { co: '3', ca: '4', h: '5', ang: '37°?' }), estado: {} },
      revelar: { datos: tri(3, 4, { co: '3', ca: '4', h: '5', ang: `${f(EX37)}°` }), estado: { fantasma: { texto: `con 37°, el opuesto mide ${f(4 * Math.tan(37 * RAD))}` } } },
      coincide: `Coincide: el ángulo exacto es ${f(EX37)}°; 37° es su redondeo.`,
      noCoincide: `Revisemos: con tan θ = 3/4, el ángulo mide ${f(EX37)}°.`,
    },
    mira: {
      pieza: 'triangulo',
      datos: DOS,
      voz: 'Exacto primero; la convención, después y dicha en voz alta.',
      pasos: [
        { estado: { paso: 1 }, texto: 'En el triángulo 3-4-5, la tangente de θ es 3/4.', ecuacion: ['tan ', th, ' = ', { frac: ['3', '4'] }, ' = 0,75'] },
        { estado: { paso: 2, final: true }, texto: 'El ángulo exacto mide 36,87°; el otro agudo, 53,13°.', ecuacion: [th, ` = arctan 0,75 ≈ ${f(EX37)}°`] },
        { estado: { paso: 2, final: true, fantasma: { texto: `7-24-25: ${f(EX16)}° y ${f(90 - EX16)}°` } }, texto: 'En el triángulo 7-24-25, el menor mide 16,26°; el otro, 73,74°.', ecuacion: ['tan ', th, ' = ', { frac: ['7', '24'] }, `  ⇒  `, th, ` ≈ ${f(EX16)}°`] },
        { estado: { paso: 2, final: true, fantasma: { texto: '37°, 53°, 16° y 74°: redondeos' } }, texto: 'El examen los redondea a 37°, 53°, 16° y 74°: es una convención.', ecuacion: ['sen 37° ≈ ', { frac: ['3', '5'] }, '   ·   ', 'sen 16° ≈ ', { frac: ['7', '25'] }] },
      ],
    },
    regla: {
      texto: 'Los ángulos de 37° y 53° son los del triángulo 3-4-5 redondeados; 16° y 74°, los del 7-24-25. Son aproximaciones de convención.',
      ecuacion: ['sen ', { llave: ['37°'], nota: 'redondeado', color: 'c-o' }, ' ≈ ', { frac: ['3', '5'] }, '   ·   ', 'sen 53° ≈ ', { frac: ['4', '5'] }, '   ·   ', 'sen 16° ≈ ', { frac: ['7', '25'] }],
      condicion: `el problema o el examen indican esa convención. El valor exacto es arctan(3/4) ≈ ${f(EX37)}°.`,
      voz: 'Cuando aproximes, dilo: así nadie confunde el redondeo con lo exacto.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (un lado con la convención 3-4-5 o 7-24-25), otras semillas.
    resuelve: {
      pieza: 'triangulo',
      generar(s) {
        const rr = azar(s + 900), t = rr.uno([{ l: [3, 4, 5], a: [37, 53] }, { l: [7, 24, 25], a: [16, 74] }]), k = rr.ent(1, 4);
        const idx = s % 2, g = t.a[idx];
        const [op, ad] = idx === 0 ? [t.l[0], t.l[1]] : [t.l[1], t.l[0]], hv = t.l[2];
        const partes = { op, ad, hip: hv }, lados = { op: op * k, ad: ad * k, hip: hv * k };
        const nom = { op: `el cateto opuesto a ${g}°`, ad: `el cateto adyacente a ${g}°`, hip: 'la hipotenusa' };
        const sim = { op: CO, ad: CA, hip: H };
        const [dado, pide] = [['hip', 'op'], ['hip', 'ad'], ['ad', 'op'], ['op', 'hip']][Math.floor(s / 2) % 4];
        const rot = (rol, todo) => (todo || rol === dado ? `${lados[rol]}` : rol === pide ? '?' : '');
        const fig = todo => ({ datos: tri(op * k, ad * k, { co: rot('op', todo), ca: rot('ad', todo), h: rot('hip', todo), ang: `${g}°` }), estado: {} });
        return {
          enunciado: [`Un triángulo rectángulo tiene un ángulo de ${g}° y ${nom[dado]} mide ${lados[dado]}. Con la convención del triángulo ${t.l.join('-')}, ¿cuánto mide ${nom[pide]}?`],
          dibujo: fig(false),
          pasos: [
            { tipo: 'pide', texto: [`Piden ${nom[pide]}.`] },
            { tipo: 'datos', texto: [`Un ángulo de ${g}° y ${nom[dado]}, que mide ${lados[dado]}.`], ecuacion: [sim[dado], ` = ${lados[dado]}`] },
            { tipo: 'regla', texto: [`Con la convención, los lados van como ${t.l.join(', ')}: frente a ${g}° van ${op} partes, junto a él ${ad} y en la hipotenusa ${hv}.`],
              ecuacion: [CO, ` = ${op}k`, '   ·   ', CA, ` = ${ad}k`, '   ·   ', H, ` = ${hv}k`] },
            { tipo: 'cuentas', texto: [`Cada parte vale el lado dado entre sus ${partes[dado]} partes. Después multiplico por las partes del lado buscado.`],
              ecuacion: [`k = ${lados[dado]} ÷ ${partes[dado]} = ${k}   →   `, sim[pide], ` = ${partes[pide]} · ${k} = ${lados[pide]}`], dibujo: fig(true) },
            { tipo: 'sentido', texto: [`Pitágoras cuadra: ${lados.op}² + ${lados.ad}² = ${lados.op * lados.op + lados.ad * lados.ad} = ${lados.hip}². El ángulo es un redondeo; los lados, no.`] },
          ],
          respuesta: [sim[pide], ` = ${lados[pide]}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'triangulo',
      voz: 'Ubica el ángulo y elige el triángulo de lados enteros que le corresponde.',
      generar(sem) {
        const rr = azar(sem), t = rr.uno([{ l: [3, 4, 5], a: [37, 53] }, { l: [7, 24, 25], a: [16, 74] }]), k = rr.ent(1, 4);
        const idx = sem % 2, g = t.a[idx];
        const [op, ad] = idx === 0 ? [t.l[0], t.l[1]] : [t.l[1], t.l[0]], hv = t.l[2];
        const lados = { op: op * k, ad: ad * k, hip: hv * k };
        const nom = { op: `el cateto opuesto a ${g}°`, ad: `el cateto adyacente a ${g}°`, hip: 'la hipotenusa' };
        const pares = [['hip', 'op'], ['hip', 'ad'], ['ad', 'op'], ['op', 'hip']];
        const [dado, pide] = pares[Math.floor(sem / 2) % 4];
        const tercero = ['op', 'ad', 'hip'].find(x => x !== dado && x !== pide);
        const bien = lados[pide];
        return {
          pregunta: [`Un triángulo rectángulo tiene un ángulo de ${g}° y ${nom[dado]} mide ${lados[dado]}. Con la convención del triángulo ${t.l.join('-')}, ¿cuánto mide ${nom[pide]}?`],
          opciones: opciones(bien, [
            { id: 'tercero', valor: lados[tercero], error: 'TR9', siFuera: `Ese es ${nom[tercero]}: el triángulo es el correcto, pero el lado no.` },
            { id: 'inversa', valor: lados[dado] * lados[dado] / bien, error: 'REC-INVERSA', siFuera: 'Los lados son los correctos, pero la razón está invertida.' },
            { id: 'otro', valor: lados[dado] / { op: ad, ad: op, hip: hv }[dado] * { op: ad, ad: op, hip: hv }[pide], error: 'TR9', siFuera: `Ese lado corresponde al otro agudo, ${90 - g}°. Nombra los lados desde ${g}°.` },
          ], x => f(x)),
          solucion: {
            texto: `Lados proporcionales a ${t.l.join(', ')}: aquí cada parte vale ${k}.`,
            ecuacion: [`${pide === 'hip' ? hv : pide === 'op' ? op : ad} · ${k} = ${f(bien)}`],
            dibujo: { datos: tri(op * k, ad * k, { co: `${op * k}`, ca: `${ad * k}`, h: `${hv * k}`, ang: `${g}°` }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 5: complementarias y recíprocas ----------
  // Cambia: el ángulo θ (y con él, el otro agudo 90° − θ). · Permanece: la hipotenusa 1 y el recto.
  // Progresa: los dos ángulos que se reparten 90°. · Se reserva: cos 65° a partir de sen 25° (la predicción).
  // Debe verse: el mismo cateto rojo es opuesto para θ y adyacente para 90° − θ.
  const complemento = (g, o = {}) => tri(Math.sin(g * RAD), Math.cos(g * RAD), Object.assign({ ang: `${g}°`, otro: `${90 - g}°`, co: f(Math.sin(g * RAD)), ca: f(Math.cos(g * RAD)), h: '1' }, o));
  const compJ = v => complemento(v.g, { marco: [1, 1] });
  const complementarias = {
    id: 'complementarias',
    titulo: 'Complementarias y recíprocas',
    temas: ['Razones recíprocas y complementarias'],
    pieza: 'triangulo',
    // Lee (fase 2): los dos agudos y las seis razones, sin decir que el opuesto de uno es el adyacente del otro (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Dos ángulos agudos', texto: 'Un triángulo rectángulo tiene, además del ángulo de 90°, dos ángulos agudos. Los tres suman 180°, así que esos dos se reparten 90°: son ángulos complementarios.' },
        { titulo: 'Seis cocientes', texto: 'Con tres lados se arman seis cocientes. Además de sen, cos y tan están cot, sec y csc. Cada uno da vuelta a uno de los primeros: son razones recíprocas.',
          ecuacion: ['csc ', th, ' = ', { frac: [H, CO] }] },
        { titulo: 'Qué mirar', texto: 'En el juego, la hipotenusa mide 1. Al mover θ, mira cuánto mide el otro ángulo agudo y qué cateto queda frente a cada uno.' },
      ],
    },
    juega: {
      consigna: 'La hipotenusa mide 1. Elige θ y mira el otro ángulo agudo y los dos catetos.',
      voz: 'Fíjate en qué lado queda frente a cada ángulo.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 20, max: 70, paso: 10, inicio: 30, unidad: '°', decimales: 0 }],
      dibujo: v => ({ datos: compJ(v), estado: {} }),
      lectura: v => [th, ` = ${v.g}° · otro = ${90 - v.g}° · `, CO, ` = ${f(Math.sin(v.g * RAD))}`],
      minimo: 3,
      // Se arrastra el vértice B: con la hipotenusa fija en 1, recorre un arco y reparte los 90° entre los dos agudos.
      arrastres: [{ id: 'vertice-b', etiqueta: 'vértice B: cambia θ', color: 'c-o',
        donde: v => enPx(compJ(v), Math.cos(v.g * RAD), Math.sin(v.g * RAD)),
        mover: (pt, v) => ({ g: anguloEnA(compJ(v), pt) }) }],
    },
    predice: {
      pregunta: `Se sabe que sen 25° ≈ ${f(Math.sin(25 * RAD))}. ¿Cuánto vale cos 65°?`,
      voz: 'Suma los dos ángulos antes de calcular.',
      opciones: [
        { id: 'c', texto: f(Math.cos(65 * RAD)), correcta: true },
        { id: 'mismo', texto: f(Math.cos(25 * RAD)), error: 'COMP-MISMO-ANG', siFuera: 'Ese es cos 25°. Pero 65° es el otro agudo: su adyacente es el opuesto de 25°.' },
        { id: 'reci', texto: f(1 / Math.sin(25 * RAD)), error: 'NOT-RECIPROCA', siFuera: 'Ese es csc 25°, la recíproca. cos 65° y sen 25° comparten el mismo cociente.' },
        { id: 'calc', texto: 'Sin calculadora no se puede', error: 'COMP-CALC', siFuera: 'La calculadora ayuda, pero no hace falta: 25° y 65° suman 90°.' },
      ],
      dibujo: { datos: complemento(25, { co: '¿?', ca: '', h: '1' }), estado: {} },
      revelar: { datos: complemento(25), estado: { fantasma: { texto: `sen 25° = cos 65° ≈ ${f(Math.sin(25 * RAD))}` } } },
      coincide: 'Coincide: el cateto rojo es opuesto a 25° y adyacente a 65°.',
      noCoincide: 'Revisemos el cateto rojo: es opuesto a 25° y adyacente a 65°.',
    },
    mira: {
      pieza: 'triangulo',
      datos: complemento(25, { pasoOtro: 2 }),
      voz: 'Un mismo lado, visto desde los dos ángulos agudos.',
      pasos: [
        { estado: { paso: 1 }, texto: 'Desde 25°, el cateto rojo es el opuesto.', ecuacion: ['sen 25° = ', { frac: [CO, H] }] },
        { estado: { paso: 2 }, texto: 'Desde 65°, ese mismo cateto es el adyacente.', ecuacion: ['cos 65° = ', { frac: [CO, H] }] },
        { estado: { paso: 2 }, texto: 'Mismo cociente: las cofunciones de ángulos complementarios son iguales.', ecuacion: ['sen ', th, ' = cos(90° − ', th, ')'] },
        { estado: { paso: 2 }, texto: 'Invertir el cociente da la recíproca: su producto es 1.', ecuacion: ['csc 25° = ', { frac: [H, CO] }, ` ≈ ${f(1 / Math.sin(25 * RAD))}`, '   ·   ', 'sen · csc = 1'] },
      ],
    },
    regla: {
      texto: 'Los agudos suman 90°: el opuesto de uno es el adyacente del otro, y sen θ = cos(90° − θ). Una recíproca invierte el cociente del mismo ángulo.',
      ecuacion: ['sen ', th, ' = cos', { llave: ['(90° − ', th, ')'], nota: 'el otro agudo', color: 'c-o' }, '   ·   ', 'sen ', th, ' · ', { llave: ['csc ', th], nota: 'la recíproca', color: 'c-o' }, ' = 1'],
      condicion: 'θ agudo. Cofunciones: ángulos que suman 90°. Recíprocas: el mismo ángulo en las dos razones.',
      voz: 'Cofunción, dos ángulos que suman 90°; recíproca, un mismo ángulo.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (hallar x con cofunciones o recíprocas), con casoRes.
    resuelve: {
      pieza: 'triangulo',
      generar(s) {
        for (let k = 0; ; k++) { const c = casoRes(s, k); if (c) return c; }
      },
    },
    ahoraTu: {
      voz: 'Mira si las dos razones son cofunciones o recíprocas.',
      generar(sem) {
        for (let k = 0; ; k++) { const c = casoComp(sem, k); if (c) return c; }
      },
    },
  };
  function casoComp(sem, intento) {
        const rr = azar(sem + 7919 * intento);
        const a = rr.ent(1, 3), c = rr.uno([1, 2, 3].filter(x => x !== a)), x = rr.ent(2, 9) * 2;
        const arg = (m, b) => `${m === 1 ? '' : m}x${b ? ` + ${b}°` : ''}`;
        if (sem % 2 === 0) {
          const resto = 90 - (a + c) * x;
          if (resto < 0) return null;
          const b = rr.ent(0, resto), dd = resto - b;
          return {
            pregunta: [`Si sen(${arg(a, b)}) = cos(${arg(c, dd)}), con ángulos agudos, ¿cuánto vale x?`],
            opciones: opciones(x, [
              { id: 'iguala', valor: (dd - b) / (a - c), error: 'COMP-IGUALA', siFuera: 'Igualar los ángulos vale para recíprocas o la misma razón. Seno y coseno piden sumar 90°.' },
              { id: '180', valor: (180 - b - dd) / (a + c), error: 'COMP-180', siFuera: 'Sumar los ángulos va bien; los complementarios suman 90°, no 180°.' },
              { id: 'sin-b', valor: 90 / (a + c), error: 'COMP-180', siFuera: 'Sumar a 90° va bien; faltan los grados fijos de cada ángulo.' },
            ].filter(o => o.valor > 0), v => `${f(v)}°`),
            solucion: { texto: 'Seno y coseno son cofunciones: los ángulos suman 90°.', ecuacion: [`${arg(a, b)} + ${arg(c, dd)} = 90°  ⇒  x = ${x}°`] },
          };
        }
        const b = rr.ent(0, 30), dd = b + (a - c) * x;
        if (dd < 0 || a * x + b >= 90 || c * x + dd >= 90) return null;
        return {
          pregunta: [`Si tan(${arg(a, b)}) · cot(${arg(c, dd)}) = 1, con ángulos agudos, ¿cuánto vale x?`],
          opciones: opciones(x, [
            { id: 'comp', valor: (90 - b - dd) / (a + c), error: 'REC-COMPLEMENTO', siFuera: 'Sumar 90° vale para cofunciones. Tangente por cotangente igual a 1 pide el mismo ángulo.' },
            { id: '180', valor: (180 - b - dd) / (a + c), error: 'COMP-180', siFuera: 'Relacionar los dos ángulos va bien; aquí son recíprocas: los ángulos son iguales.' },
            { id: 'sin-b', valor: dd / (a - c), error: 'COMP-IGUALA', siFuera: 'Igualar los ángulos va bien; faltan los grados fijos del primero.' },
          ].filter(o => o.valor > 0), v => `${f(v)}°`),
          solucion: { texto: 'Tangente y cotangente del mismo ángulo dan 1: los ángulos son iguales.', ecuacion: [`${arg(a, b)} = ${arg(c, dd)}  ⇒  x = ${x}°`] },
        };
  }

  // «Así se resuelve» de la idea 4: las mismas cuentas de casoComp, con la semilla corrida en 900.
  function casoRes(sem, intento) {
    const rr = azar(sem + 900 + 7919 * intento);
    const a = rr.ent(1, 3), c = rr.uno([1, 2, 3].filter(x => x !== a)), x = rr.ent(2, 9) * 2;
    const arg = (m, b) => `${m === 1 ? '' : m}x${b ? ` + ${b}°` : ''}`;
    const coef = m => `${m === 1 ? '' : m}x`;
    const fig = (g, o) => ({ datos: complemento(g, Object.assign({ co: '', ca: '', h: '' }, o)), estado: {} });
    if (sem % 2 === 0) {
      const resto = 90 - (a + c) * x;
      if (resto < 0) return null;
      const b = rr.ent(0, resto), dd = resto - b, g1 = a * x + b, g2 = c * x + dd;
      return {
        enunciado: [`Si sen(${arg(a, b)}) = cos(${arg(c, dd)}), con ángulos agudos, ¿cuánto vale x?`],
        dibujo: fig(45, { ang: arg(a, b), otro: arg(c, dd) }),
        pasos: [
          { tipo: 'pide', texto: ['Piden x, el número que hace cierta la igualdad.'] },
          { tipo: 'datos', texto: [`El seno de ${arg(a, b)} vale lo mismo que el coseno de ${arg(c, dd)}. Los dos ángulos son agudos.`] },
          { tipo: 'regla', texto: ['Un seno igual a un coseno: el cateto opuesto de un ángulo es el adyacente del otro. Son los dos agudos de un triángulo y suman 90°.'],
            ecuacion: ['sen ', th, ' = cos(90° − ', th, ')'] },
          { tipo: 'cuentas', texto: ['Sumo los dos ángulos, los igualo a 90° y despejo x.'],
            ecuacion: [`${arg(a, b)} + ${arg(c, dd)} = 90°  ⇒  ${coef(a + c)} = ${(a + c) * x}°  ⇒  x = ${x}°`], dibujo: fig(g1, { ang: `${g1}°`, otro: `${g2}°` }) },
          { tipo: 'sentido', texto: [`Con x = ${x}°, los ángulos miden ${g1}° y ${g2}°: suman ${g1 + g2}° y los dos son agudos.`] },
        ],
        respuesta: [`x = ${x}°`],
      };
    }
    const b = rr.ent(0, 30), dd = b + (a - c) * x;
    if (dd < 0 || a * x + b >= 90 || c * x + dd >= 90) return null;
    const g1 = a * x + b, dif = Math.abs(a - c);
    return {
      enunciado: [`Si tan(${arg(a, b)}) · cot(${arg(c, dd)}) = 1, con ángulos agudos, ¿cuánto vale x?`],
      dibujo: fig(45, { ang: arg(a, b), otro: '', co: 'CO', ca: 'CA' }),
      pasos: [
        { tipo: 'pide', texto: ['Piden x, el número que hace cierta la igualdad.'] },
        { tipo: 'datos', texto: [`La tangente de ${arg(a, b)} por la cotangente de ${arg(c, dd)} da 1. Los dos ángulos son agudos.`] },
        { tipo: 'regla', texto: ['Tangente y cotangente del mismo ángulo son razones recíprocas: CO/CA por CA/CO da 1. Por eso los dos ángulos son iguales.'],
          ecuacion: ['tan ', th, ' · cot ', th, ' = 1'] },
        { tipo: 'cuentas', texto: ['Igualo los dos ángulos y despejo x.'],
          ecuacion: [`${arg(a, b)} = ${arg(c, dd)}  ⇒  ${coef(dif)} = ${dif * x}°  ⇒  x = ${x}°`], dibujo: fig(g1, { ang: `${g1}°`, otro: '', co: 'CO', ca: 'CA' }) },
        { tipo: 'sentido', texto: [`Con x = ${x}°, los dos ángulos miden ${g1}° y ${c * x + dd}°: el mismo, y agudo.`] },
      ],
      respuesta: [`x = ${x}°`],
    };
  }

  // ---------- Laboratorio ----------
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
        { de: 'A', a: 'C', color: 'i', texto: '', grosor: 'contorno' }, { de: 'C', a: 'B', color: 'h', texto: f(opGrande(v)), grosor: 'variable' },
        { de: 'A', a: 'B', color: 'd', texto: f(K), grosor: 'variable', lado: -1 },
        { de: 'c', a: 'b', color: 'h', texto: f(2 * sn), grosor: 'variable', lado: -1 }, { de: 'A', a: 'b', color: 'd', texto: '', grosor: 'contorno' },
      ],
      angulos: [{ en: 'A', de: 'C', a: 'B', texto: 'θ', color: 'o' }, { en: 'C', de: 'A', a: 'B' }],
    };
  }
  const compL = v => complemento(v.g, { marco: [1, 1], co: f(Math.sin(v.g * RAD), 3), ca: f(Math.cos(v.g * RAD), 3) });

  return {
    unidad: 'trigonometria.razones-trigonometricas-agudas',
    version: '0.1.0',
    estado: 'completa',
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
    // Glosario (docs/teoria.md §4d): las palabras que esta unidad estrena en el curso. «Cotangente», «secante» y
    // «cosecante» se definen en «Ángulos en posición normal» (mapa del curso); aquí solo salen como cot, sec y csc.
    glosario: [
      { termino: 'razón trigonométrica', def: 'Cociente entre dos lados de un triángulo rectángulo, nombrados desde uno de sus ángulos agudos. Solo depende del ángulo.',
        formas: ['razón trigonométrica', 'razones trigonométricas'], ejemplo: 'Catetos 3 y 4, hipotenusa 5: sen θ = 3/5 = 0,6.', ver: ['seno', 'coseno', 'tangente'] },
      { termino: 'triángulo rectángulo', def: 'Figura de tres lados con un ángulo de 90°, llamado ángulo recto.',
        formas: ['triángulo rectángulo', 'triángulos rectángulos'], ejemplo: 'Lados 3, 4 y 5: como 3² + 4² = 5², tiene un ángulo de 90°.', ver: ['cateto', 'hipotenusa'] },
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
        formas: ['ángulo agudo', 'ángulos agudos', 'agudo', 'agudos'], ejemplo: '25° y 65° lo son; 90° y 120°, no.', ver: ['ángulos complementarios'] },
      { termino: 'seno', simbolo: 'sen', def: 'Razón que divide el cateto opuesto a θ entre la hipotenusa.',
        ejemplo: 'En el 3-4-5, desde el ángulo frente al 3: sen θ = 3/5 = 0,6.', ver: ['coseno', 'razón trigonométrica'] },
      { termino: 'coseno', simbolo: 'cos', def: 'Razón que divide el cateto adyacente a θ entre la hipotenusa.',
        ejemplo: 'En el 3-4-5, desde el ángulo frente al 3: cos θ = 4/5 = 0,8.', ver: ['seno', 'co-razón'] },
      { termino: 'tangente', simbolo: 'tan', def: 'Razón que divide el cateto opuesto a θ entre el cateto adyacente.',
        ejemplo: 'En el 3-4-5, desde el ángulo frente al 3: tan θ = 3/4 = 0,75.', ver: ['seno', 'coseno'] },
      { termino: 'ángulos complementarios', def: 'Dos ángulos que suman 90°, como los dos agudos de un triángulo rectángulo.',
        formas: ['ángulos complementarios', 'complementarios'], ejemplo: '25° y 65°, porque 25° + 65° = 90°.', ver: ['co-razón'] },
      { termino: 'razones recíprocas', def: 'Dos razones del mismo ángulo con el cociente al revés: multiplicadas dan 1.',
        formas: ['razones recíprocas', 'razón recíproca', 'recíproca', 'recíprocas'], ejemplo: 'sen θ = 3/5 y csc θ = 5/3: (3/5) · (5/3) = 1.', ver: ['razón trigonométrica'] },
      { termino: 'triángulos semejantes', def: 'Triángulos de igual forma y distinto tamaño: mismos ángulos y lados proporcionales.',
        formas: ['triángulos semejantes', 'semejantes'], ejemplo: 'Lados 3-4-5 y 6-8-10: cada lado del segundo es el doble.', ver: ['razón trigonométrica'] },
      { termino: 'ángulo notable', def: 'Ángulo cuyas razones se conocen exactas, sin calculadora, como 30°, 45° y 60°.',
        formas: ['ángulo notable', 'ángulos notables'], ejemplo: 'sen 30° = 1/2 y tan 45° = 1, sin redondear.', ver: ['razón trigonométrica'] },
      { termino: 'teorema de Pitágoras', def: 'En un triángulo rectángulo, la hipotenusa al cuadrado es igual a la suma de los catetos al cuadrado.',
        formas: ['teorema de Pitágoras', 'Pitágoras'], ejemplo: 'Catetos 3 y 4: H = √(9 + 16) = 5.', ver: ['hipotenusa', 'cateto'] },
    ],
    // Laboratorio (docs/teoria.md §4b). «tres-razones»: catetos libres de medio en medio, con sen, cos, tan y el ángulo
    // a la vez (la idea 1 solo da el seno). «semejantes»: un triángulo dentro de otro k veces mayor, con el mismo θ; el
    // caso de la predicción, ahora con cualquier ángulo y escala. «complemento-libre»: θ de grado en grado hasta los
    // bordes (1° y 89°), con la cofunción y la recíproca juntas.
    laboratorio: [
      {
        id: 'tres-razones', titulo: 'Tres razones de un vistazo', pieza: 'triangulo',
        consigna: 'Arrastra el vértice B a cualquier sitio. La lectura da seno, coseno y tangente de θ, y cuánto mide θ.',
        controles: [
          { id: 'co', etiqueta: 'CO', color: 'c-h', min: 0.5, max: 6, paso: 0.5, inicio: 3, unidad: '', decimales: 1 },
          { id: 'ca', etiqueta: 'CA', color: 'c-i', min: 0.5, max: 8, paso: 0.5, inicio: 4, unidad: '', decimales: 1 },
        ],
        dibujo: v => ({ datos: tresL(v), estado: {} }),
        lectura: v => {
          return ['sen ', th, ` = ${f(senL(v), 3)} · cos `, th, ` = ${f(cosL(v), 3)} · tan `, th, ` = ${f(v.co / v.ca, 3)} · `, th, ` ≈ ${f(Math.atan2(v.co, v.ca) * GRA)}°`];
        },
        // Retos: senL y cosL son los cocientes de los lados que dibuja tresL.
        invitaciones: [
          { texto: 'Haz que la tangente de θ valga justo 1.',
            logrado: v => casi(v.co / v.ca, 1),
            bien: 'Catetos iguales: θ = 45°, sea cual sea el tamaño.' },
          { texto: 'Haz que el seno de θ pase de 0,9.',
            logrado: v => senL(v) > 0.9,
            bien: 'θ casi se para: el opuesto se acerca a la hipotenusa, sin alcanzarla.' },
          { texto: 'Arma otro triángulo de lados enteros, distinto del 3-4-5 inicial.',
            logrado: v => Number.isInteger(v.co) && Number.isInteger(v.ca) && casi(hipL(v), Math.round(hipL(v))) && !(v.co === 3 && v.ca === 4),
            bien: 'Lados enteros, cocientes limpios. ¿Alguna razón cambió frente al 3-4-5?' },
          { texto: 'Guarda dos triángulos de distinto tamaño con el mismo seno.',
            logrado: (v, gs) => gs.some(a => gs.some(b => a.co !== b.co && casi(senL(a), senL(b)))),
            bien: 'Distinto tamaño, mismo ángulo, mismo seno: la razón no mira el tamaño.' },
        ],
        // El vértice B: de lado cambia CA; hacia arriba, CO.
        arrastres: [{ id: 'vertice-b', etiqueta: 'vértice B: CA de lado, CO hacia arriba', color: 'c-h',
          donde: v => enPx(tresL(v), v.ca, v.co),
          mover: (pt, v) => { const q = delPx(tresL(v), pt); return { ca: q.x, co: q.y }; } }],
      },
      {
        id: 'semejantes', titulo: 'Uno dentro de otro', pieza: 'triangulo',
        consigna: 'El triángulo chico tiene hipotenusa 2; el grande, k veces más: son triángulos semejantes. Arrastra la punta del grande: cambias θ y k.',
        controles: [
          { id: 'g', etiqueta: 'θ', color: 'c-o', min: 15, max: 60, paso: 1, inicio: 30, unidad: '°', decimales: 0 },
          { id: 'k', etiqueta: 'k', min: 1.5, max: 3, paso: 0.5, inicio: 2, unidad: '', decimales: 1 },
        ],
        dibujo: v => ({ datos: semL(v), estado: {} }),
        lectura: v => {
          const sn = senG(v.g);
          return ['sen ', th, ` = ${f(2 * sn)}/2 = ${f(opGrande(v))}/${f(2 * v.k)} = ${f(sn, 3)} · k = ${f(v.k)}`];
        },
        // Retos: opGrande es el cateto rojo del grande que dibuja semL; senG, el seno de los dos.
        invitaciones: [
          { texto: 'Haz que el cateto rojo del grande mida justo 3.',
            logrado: v => casi(opGrande(v), 3),
            bien: 'Con 30°, el opuesto es media hipotenusa: 6 · 1/2 = 3.' },
          { texto: 'Haz que el seno de θ pase de 0,8.',
            logrado: v => senG(v.g) > 0.8,
            bien: 'Pasa desde unos 54°. Mover k no lo acerca ni lo aleja.' },
          { texto: 'Consigue el cateto rojo más largo que permite la mesa.',
            logrado: v => casi(opGrande(v), opGrande({ g: 60, k: 3 })),
            bien: 'Mayor θ y mayor k alargan el opuesto; el seno solo sigue a θ.' },
          { texto: 'Guarda dos casos con el mismo θ y distinto k. Compara sus senos.',
            logrado: (v, gs) => gs.some(a => gs.some(b => a.g === b.g && a.k !== b.k)),
            bien: 'Los lados cambiaron con k; el seno, no. Depende solo de θ.' },
        ],
        // La punta B del grande: su dirección es θ y su distancia a A, la hipotenusa 2k.
        arrastres: [{ id: 'punta', etiqueta: 'punta del triángulo grande: θ y k', color: 'c-o',
          donde: v => enPx(semL(v), 2 * v.k * Math.cos(v.g * RAD), 2 * v.k * Math.sin(v.g * RAD)),
          mover: (pt, v) => { const q = delPx(semL(v), pt); return { g: Math.atan2(q.y, q.x) * GRA, k: Math.hypot(q.x, q.y) / 2 }; } }],
      },
      {
        id: 'complemento-libre', titulo: 'Cofunción y recíproca, juntas', pieza: 'triangulo',
        consigna: 'La hipotenusa mide 1. Lleva el vértice B hasta casi acostarlo o casi pararlo, y compara las cuatro razones.',
        controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 1, max: 89, paso: 1, inicio: 25, unidad: '°', decimales: 0 }],
        dibujo: v => ({ datos: compL(v), estado: {} }),
        lectura: v => [`sen ${v.g}° = cos ${90 - v.g}° = ${f(senG(v.g), 3)} · csc ${v.g}° = ${f(1 / senG(v.g), 3)}`],
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
          { texto: 'Haz que el cateto rojo mida justo la mitad de la hipotenusa.',
            logrado: v => casi(senG(v.g), 0.5),
            bien: '30°: medio equilátero. ¿Qué ángulo da un coseno de 1/2?' },
        ],
        // El vértice B recorre el arco de radio 1.
        arrastres: [{ id: 'vertice-b', etiqueta: 'vértice B: cambia θ', color: 'c-o',
          donde: v => enPx(compL(v), Math.cos(v.g * RAD), Math.sin(v.g * RAD)),
          mover: (pt, v) => ({ g: anguloEnA(compL(v), pt) }) }],
      },
    ],
  };
});
