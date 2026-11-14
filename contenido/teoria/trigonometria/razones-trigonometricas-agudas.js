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

  // ---------- Idea 1: la razón no depende del tamaño ----------
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
      texto: 'En un triángulo rectángulo, cada razón divide dos lados vistos desde el ángulo agudo θ. Depende solo de θ, no del tamaño.',
      ecuacion: ['sen ', th, ' = ', { frac: [{ llave: [CO], nota: 'opuesto a θ', color: 'c-h' }, H] }, '   ·   ', 'cos ', th, ' = ', { frac: [{ llave: [CA], nota: 'junto a θ', color: 'c-i' }, H] }],
      condicion: 'θ agudo de un triángulo rectángulo. tan θ = CO/CA; cot, sec y csc invierten tan, cos y sen.',
      voz: 'Una razón es un número sin unidades: compara dos largos.',
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

  // ---------- Idea 2: notables exactos ----------
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
      texto: 'Las razones de 30°, 45° y 60° son exactas: salen del medio cuadrado, con lados 1, 1 y √2, y del medio equilátero, con 1, √3 y 2.',
      ecuacion: ['sen 30° = ', { frac: ['1', '2'] }, '   ·   ', 'sen 45° = ', { frac: ['√2', '2'] }, '   ·   ', 'sen 60° = ', { frac: ['√3', '2'] }],
      condicion: 'se usan los valores exactos, sin redondear. El coseno lee el otro cateto; la tangente, opuesto entre adyacente.',
      voz: 'Dos figuras bastan para recordar los tres ángulos.',
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

  // ---------- Idea 3: 37° y 16° son aproximaciones ----------
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

  // ---------- Idea 4: complementarias y recíprocas ----------
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

  // ---------- Laboratorio ----------
  const tresL = v => tri(v.co, v.ca, { marco: [8, 6] });
  // Dos triángulos con el mismo θ en A: el chico de hipotenusa 2 (puntos c, b) y el grande de hipotenusa 2k (C, B).
  function semL(v) {
    const c = Math.cos(v.g * RAD), sn = Math.sin(v.g * RAD), K = 2 * v.k;
    return {
      puntos: [{ id: 'A', x: 0, y: 0 }, { id: 'c', x: 2 * c, y: 0 }, { id: 'b', x: 2 * c, y: 2 * sn }, { id: 'C', x: K * c, y: 0 }, { id: 'B', x: K * c, y: K * sn }].concat(marco(6, 6 * Math.sin(60 * RAD))),
      lados: [
        { de: 'A', a: 'C', color: 'i', texto: '', grosor: 'contorno' }, { de: 'C', a: 'B', color: 'h', texto: f(K * sn), grosor: 'variable' },
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
    requiere: ['/nucleo/kit/piezas/triangulo.js'],
    historia: {
      texto: 'Aryabhata, en la India del año 499, calculó tablas de la semicuerda para la astronomía: el antepasado de nuestro seno. Los griegos usaban la cuerda entera. Esas tablas todavía no eran gráficas en ejes; funcionaban porque figuras semejantes conservan los cocientes de sus lados, y por eso un valor se podía tabular.',
      pregunta: '¿Por qué se podría tabular un seno, pero no el largo de un lado?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Aryabhata I», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Aryabhata_I/' },
    },
    ideas: [definicion, notables, aproximados, complementarias],
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
          const hv = Math.hypot(v.co, v.ca);
          return ['sen ', th, ` = ${f(v.co / hv, 3)} · cos `, th, ` = ${f(v.ca / hv, 3)} · tan `, th, ` = ${f(v.co / v.ca, 3)} · `, th, ` ≈ ${f(Math.atan2(v.co, v.ca) * GRA)}°`];
        },
        // El vértice B: de lado cambia CA; hacia arriba, CO.
        arrastres: [{ id: 'vertice-b', etiqueta: 'vértice B: CA de lado, CO hacia arriba', color: 'c-h',
          donde: v => enPx(tresL(v), v.ca, v.co),
          mover: (pt, v) => { const q = delPx(tresL(v), pt); return { ca: q.x, co: q.y }; } }],
      },
      {
        id: 'semejantes', titulo: 'Uno dentro de otro', pieza: 'triangulo',
        consigna: 'El triángulo chico tiene hipotenusa 2; el grande, k veces más. Arrastra la punta del grande: cambias θ y k.',
        controles: [
          { id: 'g', etiqueta: 'θ', color: 'c-o', min: 15, max: 60, paso: 1, inicio: 30, unidad: '°', decimales: 0 },
          { id: 'k', etiqueta: 'k', min: 1.5, max: 3, paso: 0.5, inicio: 2, unidad: '', decimales: 1 },
        ],
        dibujo: v => ({ datos: semL(v), estado: {} }),
        lectura: v => {
          const sn = Math.sin(v.g * RAD);
          return ['sen ', th, ` = ${f(2 * sn)}/2 = ${f(2 * v.k * sn)}/${f(2 * v.k)} = ${f(sn, 3)} · k = ${f(v.k)}`];
        },
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
        lectura: v => [`sen ${v.g}° = cos ${90 - v.g}° = ${f(Math.sin(v.g * RAD), 3)} · csc ${v.g}° = ${f(1 / Math.sin(v.g * RAD), 3)}`],
        // El vértice B recorre el arco de radio 1.
        arrastres: [{ id: 'vertice-b', etiqueta: 'vértice B: cambia θ', color: 'c-o',
          donde: v => enPx(compL(v), Math.cos(v.g * RAD), Math.sin(v.g * RAD)),
          mover: (pt, v) => ({ g: anguloEnA(compL(v), pt) }) }],
      },
    ],
  };
});
