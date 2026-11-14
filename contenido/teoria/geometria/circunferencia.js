/*
 * Teoría de «Circunferencia y ángulos en ella» (geometria.circunferencia). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 5); Elementos III.18 (tangente ⟂ radio), III.20 (central e inscrito),
 * III.22 (cuadrilátero inscrito). «Poncelet» se usa como lo usan las academias: a + b = c + 2r en el triángulo rectángulo,
 * siempre con su enunciado (precisión del expediente).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: medir cada ángulo de la circunferencia por el arco que abarca y usar las tangencias (radio ⟂ tangente,
 *     tangentes iguales) para Poncelet y Pitot.
 *   Persona y condiciones: postulante de 3.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: calcula ángulos central, inscrito, semiinscrito, interior y exterior; clasifica dos
 *     circunferencias por d; usa Poncelet, Pitot y los opuestos suplementarios del cuadrilátero inscrito.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿mitad, semisuma o semidiferencia?»: depende de dónde está el vértice.
 *
 * Colores: el arco grande o el que se mueve naranja (c-o), el otro arco turquesa (c-i), radios y referencias verde (c-d),
 * el ángulo pedido rojo (c-h). Códigos: GE12, GE15, GE16 (docs/investigacion/geometria-ideas-erroneas.md); GE-TAN,
 * GE-POS, GE-PON y GE-CIC son hipótesis nuevas.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/kit/piezas/geo-figura.js'))
    : fabrica(root.Kit, root.Kit.piezas['geo-figura']);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, G) {
  'use strict';
  const U = G.util;
  const f = (n, d = 1) => Kit.formatear(n, d);
  const gr = n => `${f(n)}°`;
  const R = 3, O = [0, 0], en = g => U.polar(O, R, g);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt, n = 4) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor <= 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, n);
  }
  const pt = (id, p, o = {}) => Object.assign({ id, x: p[0], y: p[1] }, o);

  // ---------- Idea 1: tangentes ----------
  // Cambia: la distancia de P al centro · Permanece: la circunferencia · Progresa: el largo de las dos tangentes ·
  // Se reserva: el radio al punto de contacto (90°) · Debe verse: radio ⟂ tangente y dos tangentes iguales.
  const tang = (d, o = {}) => {
    const r = 2, P = [d, 0], g = U.grados(Math.acos(r / d)), T1 = U.polar(O, r, g), T2 = U.polar(O, r, -g), L = Math.sqrt(d * d - r * r);
    const k = o.pasos || {};
    return {
      alt: o.alt || `Desde P, a ${f(d)} del centro, salen dos tangentes de ${f(L)}; cada una es perpendicular a su radio`,
      vista: { x: [-2.6, 8.6], y: [-3, 3] },
      puntos: [pt('O', O, { rotulo: 'O', lado: 180 }), pt('P', P, { rotulo: 'P', color: 'o', lado: 0 }), pt('T', T1, { rotulo: 'T', lado: 100 }), pt('S', T2, { rotulo: 'S', lado: -100 })],
      circulos: [{ centro: 'O', r }],
      segmentos: [{ de: 'P', a: 'T', color: 'o', grosor: 'variable', texto: o.sinL ? undefined : f(L) }, { de: 'P', a: 'S', color: 'i', grosor: 'variable', texto: o.sinL ? undefined : f(L) },
        ...(o.radios ? [{ de: 'O', a: 'T', color: 'd', texto: 'r', desde: k.r || 0 }, { de: 'O', a: 'S', color: 'd', texto: 'r', desde: k.r || 0 }, { de: 'O', a: 'P', discontinua: true, grosor: 'fino', desde: k.op || 0 }] : [])],
      angulos: o.radios ? [{ en: 'T', de: 'O', a: 'P', color: 'h', desde: k.r || 0 }, { en: 'S', de: 'P', a: 'O', color: 'h', desde: k.r || 0 }] : [],
    };
  };
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 12, 15], [6, 8, 10]];
  const tangentes = {
    id: 'tangentes',
    titulo: 'El radio y la tangente',
    temas: ['Elementos y teoremas de tangencia'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Desde el punto P salen dos rectas que solo tocan la circunferencia: las tangentes PT y PS. Aleja o acerca P y compara sus largos.',
      voz: 'Mueve P. Compara las dos tangentes cada vez.',
      controles: [{ id: 'd', etiqueta: 'PO', min: 2.5, max: 8, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-o' }],
      dibujo: v => ({ datos: tang(v.d), estado: {} }),
      lectura: v => [{ v: 'c-o', t: 'PT' }, ` = ${f(Math.sqrt(v.d * v.d - 4))} · `, { v: 'c-i', t: 'PS' }, ` = ${f(Math.sqrt(v.d * v.d - 4))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Trazamos el radio OT hasta el punto de contacto T. ¿Qué ángulo forma el radio OT con la tangente PT?',
      voz: 'Piensa en el punto de la tangente más cercano al centro.',
      opciones: [
        { id: 'c', texto: '90°, siempre', correcta: true },
        { id: 'depende', texto: 'Depende de la distancia PO', error: 'GE-TAN1', siFuera: 'El largo de la tangente sí depende de PO; el ángulo con el radio no cambia.' },
        { id: 'cuarenta', texto: '45°', error: 'GE-TAN1', siFuera: '45° sería un caso particular de otro ángulo; el del radio con la tangente es recto.' },
      ],
      dibujo: { datos: tang(4), estado: {} },
      revelar: { datos: tang(4, { radios: true }), estado: {} },
      coincide: 'Coincide: el radio llega perpendicular a la tangente.',
    },
    mira: {
      datos: tang(5, { radios: true, pasos: { r: 1, op: 2 }, alt: 'OTP y OSP son triángulos rectángulos con la hipotenusa OP común y un cateto r: son congruentes' }),
      voz: 'Dos triángulos rectángulos que comparten hipotenusa.',
      pasos: [
        { estado: { corte: 1 }, texto: 'T es el punto de la tangente más cercano a O: OT ⟂ PT.', ecuacion: ['OT ⟂ PT · OS ⟂ PS'] },
        { estado: { corte: 2 }, texto: 'OTP y OSP: hipotenusa OP común y un cateto r igual.', ecuacion: ['△OTP ≅ △OSP'] },
        { estado: { corte: 2 }, texto: 'Por eso las dos tangentes miden lo mismo.', ecuacion: [{ v: 'c-o', t: 'PT' }, ' = ', { v: 'c-i', t: 'PS' }, ' = ', { raiz: ['PO² − r²'] }] },
      ],
    },
    regla: {
      texto: 'La tangente es perpendicular al radio en el punto de contacto. Desde un punto exterior, las dos tangentes miden lo mismo.',
      ecuacion: [{ v: 'c-o', t: 'PT' }, ' = ', { v: 'c-i', t: 'PS' }, ' = ', { raiz: ['PO² − r²'] }],
      condicion: 'P está fuera de la circunferencia y T, S son los puntos de contacto.',
      voz: 'Ante una tangente, traza el radio al contacto.',
    },
    ahoraTu: {
      voz: 'Arma el triángulo rectángulo: radio, tangente y PO.',
      generar(s) {
        const r = azar(s), [a, b, c] = r.de(TRIPLES), k = r.ent(1, 2), radio = a * k, L = b * k, d = c * k;
        const pideL = s % 2 === 0;
        return {
          pregunta: pideL ? [`Una circunferencia tiene radio ${radio} y el punto P está a ${d} de su centro. ¿Cuánto mide cada tangente trazada desde P?`]
            : [`Desde P, a ${d} del centro, la tangente mide ${L}. ¿Cuánto mide el radio?`],
          dibujo: { datos: Object.assign(tang(4, { sinL: true }), { alt: `Circunferencia de radio ${pideL ? radio : 'r'} y punto P a ${d} del centro, con sus dos tangentes` }), estado: {} },
          opciones: opciones(pideL ? L : radio, [
            { id: 'resta', valor: d - (pideL ? radio : L), error: 'GE-TAN2', siFuera: 'Restar los largos sería cierto si estuvieran en una recta; forman un triángulo rectángulo.' },
            { id: 'suma', valor: Math.sqrt(d * d + (pideL ? radio : L) ** 2), error: 'GE-TAN2', siFuera: 'Eso suma los cuadrados: tomaría PO como cateto. PO es la hipotenusa.' },
            { id: 'igual', valor: d, error: 'GE-TAN1', siFuera: 'PO va al centro; la tangente llega al punto de contacto.' },
          ], x => f(x, 2)),
          solucion: { texto: 'El radio y la tangente forman 90°: PO es la hipotenusa.', ecuacion: pideL ? [`PT = √(${d}² − ${radio}²) = ${L}`] : [`r = √(${d}² − ${L}²) = ${radio}`] },
        };
      },
    },
  };

  // ---------- Idea 2: posiciones relativas de dos circunferencias ----------
  // Cambia: la distancia d entre centros · Permanece: los radios 4 y 2 · Progresa: el tipo de posición ·
  // Se reserva: el rango de las secantes con otros radios · Debe verse: todo se decide comparando d con r₁ + r₂ y r₁ − r₂.
  const posicion = (d, r1, r2) => (d === 0 ? 'concéntricas' : d < r1 - r2 ? 'interiores' : d === r1 - r2 ? 'tangentes interiores' : d < r1 + r2 ? 'secantes' : d === r1 + r2 ? 'tangentes exteriores' : 'exteriores');
  const dos = (d, r1 = 4, r2 = 2, o = {}) => ({
    alt: o.alt || `Circunferencias de radios ${r1} y ${r2} con centros a ${f(d)}: ${posicion(d, r1, r2)}`,
    vista: { x: [-5, 12], y: [-4.6, 4.6] },
    puntos: [pt('O1', [0, 0], { rotulo: 'O₁', lado: -100 }), pt('O2', [d, 0], { rotulo: 'O₂', color: 'o', lado: -80 })],
    circulos: [{ centro: 'O1', r: r1, color: 'i' }, { centro: 'O2', r: r2, color: 'o' }],
    segmentos: d > 0 && !o.sinD ? [{ de: 'O1', a: 'O2', color: 'h', grosor: 'variable', texto: `d = ${f(d)}`, lado: 1 }] : [],
  });
  const posiciones = {
    id: 'posiciones',
    titulo: 'Dos circunferencias: compara d',
    temas: ['Posiciones relativas de dos circunferencias'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Los radios miden 4 y 2. Cambia la distancia d entre los centros y mira cómo se relacionan las dos circunferencias.',
      voz: 'Mueve d. Fíjate en el momento exacto en que se tocan.',
      controles: [{ id: 'd', etiqueta: 'd', min: 0, max: 8, paso: 1, inicio: 7, unidad: '', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: dos(v.d), estado: {} }),
      lectura: v => [{ v: 'c-h', t: 'd' }, ` = ${v.d} · r₁ + r₂ = 6 · r₁ − r₂ = 2 · ${posicion(v.d, 4, 2)}`],
      minimo: 5,
    },
    predice: {
      pregunta: 'Ahora los radios miden 5 y 3, y las circunferencias se cortan en dos puntos. ¿Entre qué valores puede estar d?',
      voz: 'Busca los dos momentos en que apenas se tocan.',
      opciones: [
        { id: 'c', texto: 'Más de 2 y menos de 8', correcta: true },
        { id: 'solo-suma', texto: 'Cualquier d menor que 8', error: 'GE-POS1', siFuera: 'El límite de 8 está bien; con d muy chico la pequeña queda dentro sin cortar.' },
        { id: 'radios', texto: 'Entre 3 y 5', error: 'GE-POS2', siFuera: 'Los radios no son los límites: se comparan su suma y su diferencia con d.' },
        { id: 'cerrado', texto: 'De 2 a 8, incluidos', error: 'GE-POS1', siFuera: 'En 2 y en 8 se tocan en un solo punto: son tangentes, no secantes.' },
      ],
      dibujo: { datos: dos(5, 5, 3, { alt: 'Circunferencias de radios 5 y 3 que se cortan en dos puntos' }), estado: {} },
      revelar: { datos: Object.assign(dos(8, 5, 3), { circulos: [{ centro: 'O1', r: 5, color: 'i' }, { centro: [2, 0], r: 3, color: 'o', discontinua: true }, { centro: [8, 0], r: 3, color: 'o', discontinua: true }], segmentos: [], alt: 'Con d = 2 son tangentes interiores y con d = 8, tangentes exteriores; entre ambos valores se cortan' }), estado: {} },
      coincide: 'Coincide: 5 − 3 < d < 5 + 3.',
    },
    mira: {
      datos: Object.assign(dos(5, 5, 3), {
        circulos: [{ centro: 'O1', r: 5, color: 'i' }, { centro: [2, 0], r: 3, color: 'o', discontinua: true, desde: 1 }, { centro: [8, 0], r: 3, color: 'o', discontinua: true, desde: 2 }, { centro: [5, 0], r: 3, color: 'o', desde: 3 }],
        segmentos: [], alt: 'Las dos tangencias marcan los límites d = 2 y d = 8; entre ellas, dos puntos de corte',
        rotulos: [{ x: 2, y: -3.6, texto: 'd = 2', color: 'h', desde: 1 }, { x: 8, y: -3.6, texto: 'd = 8', color: 'h', desde: 2 }],
      }),
      voz: 'Los dos momentos de tangencia son los bordes.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se tocan por dentro cuando d es la diferencia de radios.', ecuacion: [{ v: 'c-h', t: 'd' }, ' = 5 − 3 = 2'] },
        { estado: { corte: 2 }, texto: 'Se tocan por fuera cuando d es la suma de radios.', ecuacion: [{ v: 'c-h', t: 'd' }, ' = 5 + 3 = 8'] },
        { estado: { corte: 3 }, texto: 'Entre esos dos valores, se cortan en dos puntos.', ecuacion: ['2 < ', { v: 'c-h', t: 'd' }, ' < 8'] },
      ],
    },
    regla: {
      texto: 'Compara d con r₁ + r₂ y con r₁ − r₂: mayor que la suma, exteriores; igual, tangentes exteriores; entre ambas, secantes; igual a la diferencia, tangentes interiores; menor, interiores.',
      ecuacion: ['r₁ − r₂ < ', { v: 'c-h', t: 'd' }, ' < r₁ + r₂  ⇔  secantes'],
      condicion: 'r₁ ≥ r₂ y d es la distancia entre los centros. Con d = 0 son concéntricas.',
      voz: 'Dos números deciden todo: la suma y la diferencia.',
    },
    ahoraTu: {
      voz: 'Calcula la suma y la diferencia de radios primero.',
      generar(s) {
        const r = azar(s), r1 = r.ent(4, 12), r2 = r.ent(1, r1 - 1);
        const cand = [r1 + r2 + r.ent(1, 5), r1 + r2, r1 - r2 + 1 + (r2 > 1 ? r.ent(0, 2 * r2 - 2) : 0), r1 - r2, r1 - r2 > 1 ? r.ent(1, r1 - r2 - 1) : r1 + r2 + 2];
        const d = cand[s % 5];
        const bien = posicion(d, r1, r2);
        const todas = ['exteriores', 'tangentes exteriores', 'secantes', 'tangentes interiores', 'interiores'];
        const cond = { exteriores: `d fuera mayor que ${r1 + r2}`, 'tangentes exteriores': `d fuera igual a ${r1 + r2}`, secantes: `d estuviera entre ${r1 - r2} y ${r1 + r2}`, 'tangentes interiores': `d fuera igual a ${r1 - r2}`, interiores: `d fuera menor que ${r1 - r2}` };
        const k = todas.indexOf(bien);
        const otras = todas.filter((x, i) => x !== bien && Math.abs(i - k) <= 2).slice(0, 3);
        return {
          pregunta: [`Dos circunferencias tienen radios ${r1} y ${r2}, y sus centros están a una distancia `, { v: 'c-h', t: 'd' }, ` = ${d}. ¿Cuál es su posición?`],
          opciones: [{ id: 'c', texto: bien, correcta: true }].concat(otras.map(x => ({ id: x.replace(' ', '-'), texto: x, error: 'GE-POS1', siFuera: `Serían ${x} si ${cond[x]}.` }))),
          solucion: { texto: `Suma de radios ${r1 + r2}; diferencia ${r1 - r2}.`, ecuacion: [{ v: 'c-h', t: 'd' }, ` = ${d}: ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 3: central, inscrito y semiinscrito ----------
  // Cambia: la posición de P en el arco mayor · Permanece: la cuerda AB y su arco de 100° · Progresa: nada: ∠APB queda en 50° ·
  // Se reserva: el semiinscrito (P llega a A) · Debe verse: todo ángulo con vértice en la circunferencia vale la mitad de su arco.
  const ARCO = 100, A3 = en(270 - ARCO / 2), B3 = en(270 + ARCO / 2);
  const inscr = (fi, o = {}) => {
    const P = en(fi), k = o.pasos || {}, D = en(fi + 180);
    const T1 = U.polar(A3, 2.6, 270 - ARCO / 2 + 90), T2 = U.polar(A3, -1.6, 270 - ARCO / 2 + 90);
    return {
      alt: o.alt || `Cuerda AB con arco de ${ARCO}°: el ángulo central mide ${ARCO}° y el inscrito APB, ${ARCO / 2}°`,
      vista: { x: [-4.4, 4.4], y: [-4, 4] },
      puntos: [pt('O', O, { rotulo: 'O', lado: 30 }), pt('A', A3, { rotulo: 'A', lado: 220 }), pt('B', B3, { rotulo: 'B', lado: -40 }), pt('P', P, { rotulo: 'P', color: 'o', lado: fi }),
        pt('D', D, { rotulo: 'D', lado: fi + 180, desde: k.d === undefined ? 99 : k.d }), pt('T1', T1, { sinPunto: true }), pt('T2', T2, { sinPunto: true })],
      circulos: [{ centro: 'O', r: R }],
      arcos: [{ centro: O, r: R, de: 270 - ARCO / 2, a: 270 + ARCO / 2, color: 'o', grosor: 'variable', texto: `${ARCO}°` }],
      segmentos: [{ de: 'P', a: 'A', color: 'i' }, { de: 'P', a: 'B', color: 'i' },
        ...(o.central ? [{ de: 'O', a: 'A', color: 'd', desde: k.c || 0 }, { de: 'O', a: 'B', color: 'd', desde: k.c || 0 }] : []),
        ...(k.d !== undefined ? [{ de: 'P', a: 'D', discontinua: true, grosor: 'fino', desde: k.d }] : []),
        ...(o.tangente ? [{ de: 'T2', a: 'T1', color: 'h', grosor: 'variable', desde: k.t || 0 }] : [])],
      angulos: [{ en: 'P', de: 'A', a: 'B', color: 'i', texto: o.sinP ? undefined : `${ARCO / 2}°`, radio: 24 },
        ...(o.central ? [{ en: 'O', de: 'A', a: 'B', color: 'd', texto: `${ARCO}°`, radio: 20, desde: k.c || 0 }] : []),
        ...(o.tangente ? [{ en: 'A', de: 'T1', a: 'B', color: 'h', texto: o.sinT ? undefined : `${ARCO / 2}°`, radio: 30, desde: k.t || 0 }] : [])],
    };
  };
  const inscrito = {
    id: 'inscrito',
    titulo: 'Inscrito: la mitad del arco',
    temas: ['Ángulos central, inscrito, semiinscrito, interior y exterior'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La cuerda AB abarca un arco de 100°. Corre el punto P por el resto de la circunferencia y mira el ángulo APB.',
      voz: 'Corre P lejos y cerca de A. Comprueba si el ángulo cambia.',
      controles: [{ id: 'fi', etiqueta: 'P en el arco', min: -20, max: 200, paso: 20, inicio: 80, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: inscr(v.fi), estado: {} }),
      lectura: v => [{ v: 'c-i', t: '∠APB' }, ` = ${ARCO / 2}° · arco AB = ${ARCO}°`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora P llega hasta A y la recta PA se vuelve la tangente en A. ¿Qué ángulo forma esa tangente con la cuerda AB?',
      voz: 'P se fue al borde. Decide si la regla lo acompaña.',
      opciones: [
        { id: 'c', texto: '50°, la mitad del arco', correcta: true },
        { id: 'central', texto: '100°, igual al arco', error: 'GE15', siFuera: 'Igual al arco mide el ángulo central, con vértice en O. Este tiene el vértice en la circunferencia.' },
        { id: 'recto', texto: '90°, por ser tangente', error: 'GE-TAN1', siFuera: 'La tangente forma 90° con el radio, no con la cuerda.' },
        { id: 'cero', texto: '0°: el ángulo desaparece', error: 'GE12', siFuera: 'Uno de los lados sí desaparece, pero lo reemplaza la tangente: el ángulo sigue abarcando AB.' },
      ],
      dibujo: { datos: inscr(80, { tangente: true, sinT: true, alt: 'Tangente en A y cuerda AB, con un arco de 100°' }), estado: {} },
      revelar: { datos: inscr(80, { tangente: true }), estado: {} },
      coincide: 'Coincide: el semiinscrito también mide la mitad del arco.',
    },
    mira: {
      datos: inscr(80, { central: true, tangente: true, pasos: { c: 1, d: 2, t: 3 }, alt: 'Central de 100°, inscrito de 50° y semiinscrito de 50° sobre el mismo arco AB' }),
      voz: 'El centro O explica por qué es la mitad.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El ángulo central AOB mide lo mismo que su arco.', ecuacion: ['∠AOB = 100°'] },
        { estado: { corte: 2 }, texto: 'El diámetro PD parte el inscrito en dos triángulos isósceles OPA y OPB.', ecuacion: ['OP = OA = OB'] },
        { estado: { corte: 2 }, texto: 'En cada isósceles, el exterior en O es el doble del ángulo en P.', ecuacion: ['∠APB = ', { frac: ['∠AOB', '2'] }, ' = 50°'] },
        { estado: { corte: 3 }, texto: 'Si P llega a A, el lado se vuelve tangente: sigue siendo la mitad.', ecuacion: ['semiinscrito = ', { frac: ['arco', '2'] }, ' = 50°'] },
      ],
    },
    regla: {
      texto: 'El ángulo central mide lo mismo que su arco. El inscrito y el semiinscrito (tangente con cuerda) miden la mitad del arco que abarcan.',
      ecuacion: ['central = arco   ·   inscrito = semiinscrito = ', { frac: ['arco', '2'] }],
      condicion: 'el vértice del inscrito está en la circunferencia, fuera del arco que abarca; todos los inscritos en el mismo arco son iguales.',
      voz: 'Ubica el vértice antes de decidir si va el arco o su mitad.',
    },
    ahoraTu: {
      voz: 'Mira dónde está el vértice: en el centro o en la circunferencia.',
      generar(s) {
        const r = azar(s), arco = 10 * r.ent(4, 16), tipo = s % 3;
        const nom = ['central', 'inscrito', 'semiinscrito'][tipo];
        const bien = tipo === 0 ? arco : arco / 2;
        return {
          pregunta: [`Un arco AB mide ${arco}°. ¿Cuánto mide el ángulo ${nom} que lo abarca${tipo === 2 ? ', formado por la tangente en A y la cuerda AB' : ''}?`],
          opciones: opciones(bien, [
            { id: 'otro', valor: tipo === 0 ? arco / 2 : arco, error: 'GE15', siFuera: tipo === 0 ? 'La mitad es para vértices en la circunferencia; el central mide su arco completo.' : 'El arco completo lo mide el central; con vértice en la circunferencia va la mitad.' },
            { id: 'doble', valor: 2 * arco, error: 'GE15', siFuera: 'El doble iría al revés: es el arco el que duplica al inscrito.' },
            { id: 'supl', valor: 180 - bien, error: 'GE-CIC1', siFuera: 'Restar de 180° sería para un ángulo opuesto de cuadrilátero inscrito.' },
          ], gr),
          solucion: { texto: tipo === 0 ? 'Vértice en el centro: mide el arco.' : 'Vértice en la circunferencia: mide la mitad del arco.', ecuacion: [tipo === 0 ? `${arco}°` : `${arco}° ÷ 2 = ${gr(arco / 2)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: ángulo interior y exterior ----------
  // Cambia: los dos arcos · Permanece: el centro y el radio · Progresa: la semisuma dentro ·
  // Se reserva: el vértice afuera (semidiferencia) · Debe verse: dentro se suman los arcos; fuera se restan.
  const cruce = (a, b, fuera, o = {}) => {
    const A = en(90 + a / 2), B = en(90 - a / 2), C = en(270 - b / 2), D = en(270 + b / 2);
    const Q = fuera ? U.corte(A, C, B, D) : U.corte(A, D, B, C);
    const k = o.pasos || {};
    const ang = fuera ? (a - b) / 2 : (a + b) / 2;
    return {
      alt: o.alt || `Arcos de ${a}° y ${b}°: el ángulo en Q, ${fuera ? 'exterior' : 'interior'}, mide ${f(ang)}°`,
      vista: { x: [-4.4, 4.4], y: [Math.min(-4, Q[1] - 1), 4.2] },
      puntos: [pt('O', O, { sinPunto: true }), pt('A', A, { rotulo: 'A', lado: 90 + a / 2 }), pt('B', B, { rotulo: 'B', lado: 90 - a / 2 }), pt('C', C, { rotulo: 'C', lado: 200 }), pt('D', D, { rotulo: 'D', lado: -20 }),
        pt('Q', Q, { rotulo: 'Q', color: 'h', lado: fuera ? -90 : 90 })],
      circulos: [{ centro: 'O', r: R }],
      arcos: [{ centro: O, r: R, de: 90 - a / 2, a: 90 + a / 2, color: 'o', grosor: 'variable', texto: `${a}°` }, { centro: O, r: R, de: 270 - b / 2, a: 270 + b / 2, color: 'i', grosor: 'variable', texto: fuera && o.sinB ? undefined : `${b}°` }],
      segmentos: fuera ? [{ de: 'A', a: 'Q' }, { de: 'B', a: 'Q' }, ...(k.ad !== undefined ? [{ de: 'A', a: 'D', color: 'd', discontinua: true, desde: k.ad }] : [])]
        : [{ de: 'A', a: 'D' }, { de: 'B', a: 'C' }],
      angulos: [{ en: 'Q', de: fuera ? 'A' : 'A', a: 'B', color: 'h', texto: o.sinQ ? undefined : `${f(ang)}°`, radio: fuera ? 34 : 22, desde: k.q || 0 },
        ...(k.ad !== undefined ? [{ en: 'D', de: 'A', a: 'B', color: 'o', texto: `${a / 2}°`, radio: 30, desde: k.ad }, { en: 'A', de: 'C', a: 'D', color: 'i', texto: `${b / 2}°`, radio: 34, desde: k.ca }] : [])],
    };
  };
  const intExt = {
    id: 'interior-exterior',
    titulo: 'Dentro se suma, fuera se resta',
    temas: ['Ángulos central, inscrito, semiinscrito, interior y exterior'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Dos cuerdas se cruzan en Q, dentro del círculo. Cambia los arcos que abarcan el ángulo en Q y su opuesto, y mira el ángulo.',
      voz: 'Cambia los arcos. Busca cómo se combinan en Q.',
      controles: [
        { id: 'a', etiqueta: 'arco de arriba', min: 60, max: 160, paso: 10, inicio: 110, unidad: '°', decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'arco de abajo', min: 20, max: 100, paso: 10, inicio: 30, unidad: '°', decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: cruce(v.a, v.b, false), estado: {} }),
      lectura: v => [{ v: 'c-h', t: '∠Q' }, ` = ${f((v.a + v.b) / 2)}° · `, { frac: [[{ v: 'c-o', t: `${v.a}` }, ' + ', { v: 'c-i', t: `${v.b}` }], '2'] }],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora Q queda fuera del círculo: dos secantes salen de Q y abarcan arcos de 110° y 30°. ¿Cuánto mide el ángulo en Q?',
      voz: 'El vértice salió. Decide si la cuenta sigue igual.',
      opciones: [
        { id: 'c', texto: '40°', correcta: true },
        { id: 'suma', texto: '70°', error: 'GE16', siFuera: '70° es la semisuma: vale con el vértice dentro. Fuera, el arco cercano resta.' },
        { id: 'sin-mitad', texto: '80°', error: 'GE16', siFuera: 'Restar los arcos va bien; falta dividir entre 2.' },
        { id: 'grande', texto: '55°', error: 'GE15', siFuera: '55° es la mitad del arco grande: sería un inscrito. Q está fuera.' },
      ],
      dibujo: { datos: cruce(110, 30, true, { sinQ: true }), estado: {} },
      revelar: { datos: cruce(110, 30, true), estado: {} },
      coincide: 'Coincide: (110° − 30°)/2 = 40°.',
    },
    mira: {
      datos: cruce(110, 30, true, { pasos: { ad: 1, ca: 2, q: 3 }, alt: 'La cuerda AD forma el triángulo QAD: su ángulo exterior en D es 55° y el ángulo en A es 15°' }),
      voz: 'Una cuerda auxiliar convierte el problema en un triángulo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Trazamos la cuerda AD. ∠ADB es inscrito: mitad de 110°.', ecuacion: ['∠ADB = 55°'] },
        { estado: { corte: 2 }, texto: '∠DAC también es inscrito: mitad de 30°.', ecuacion: ['∠DAC = 15°'] },
        { estado: { corte: 3 }, texto: 'En el triángulo QAD, el exterior en D suma Q y A.', ecuacion: ['55° = ', { v: 'c-h', t: '∠Q' }, ' + 15° → ', { v: 'c-h', t: '∠Q' }, ' = 40°'] },
      ],
    },
    regla: {
      texto: 'Con el vértice dentro, el ángulo mide la semisuma de los arcos que abarcan él y su opuesto. Con el vértice fuera, la semidiferencia: arco lejano menos arco cercano.',
      ecuacion: ['dentro: ', { frac: [[{ v: 'c-o', t: 'a' }, ' + ', { v: 'c-i', t: 'b' }], '2'] }, '   ·   fuera: ', { frac: [[{ v: 'c-o', t: 'a' }, ' − ', { v: 'c-i', t: 'b' }], '2'] }],
      condicion: 'fuera valen secantes o tangentes desde Q; a es el arco lejano y b el cercano, ambos entre los lados del ángulo.',
      voz: 'Dentro se suma; fuera se resta. Siempre entre 2.',
    },
    ahoraTu: {
      voz: 'Ubica Q: ¿dentro o fuera del círculo?',
      generar(s) {
        const r = azar(s), fuera = s % 2 === 1, a = 10 * r.ent(fuera ? 10 : 8, 16), b = 10 * r.ent(2, Math.min(7, a / 10 - (fuera ? 6 : 2)));
        const bien = fuera ? (a - b) / 2 : (a + b) / 2;
        return {
          pregunta: [`Dos ${fuera ? 'secantes salen de Q, fuera del círculo,' : 'cuerdas se cortan en Q, dentro del círculo,'} y abarcan arcos de ${a}° y ${b}°. ¿Cuánto mide el ángulo en Q?`],
          dibujo: { datos: cruce(a, b, fuera, { sinQ: true }), estado: {} },
          opciones: opciones(bien, [
            { id: 'cambio', valor: fuera ? (a + b) / 2 : (a - b) / 2, error: 'GE16', siFuera: fuera ? 'La semisuma es para el vértice dentro. Fuera, el arco cercano resta.' : 'La semidiferencia es para el vértice fuera. Dentro, los arcos se suman.' },
            { id: 'sin-mitad', valor: fuera ? a - b : a + b, error: 'GE16', siFuera: 'La combinación de arcos va bien; falta dividir entre 2.' },
            { id: 'inscrito', valor: a / 2, error: 'GE15', siFuera: 'La mitad de un solo arco sería un inscrito; aquí Q no está en la circunferencia.' },
          ], gr),
          solucion: { texto: fuera ? 'Fuera: semidiferencia de los arcos.' : 'Dentro: semisuma de los arcos.', ecuacion: [fuera ? `(${a}° − ${b}°) ÷ 2 = ${gr(bien)}` : `(${a}° + ${b}°) ÷ 2 = ${gr(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: Pitot y Poncelet ----------
  // Cambia: dos puntos de tangencia · Permanece: la circunferencia inscrita · Progresa: las sumas de lados opuestos ·
  // Se reserva: el triángulo rectángulo (Poncelet) · Debe verse: todo sale de tangentes iguales desde cada vértice.
  const r5 = 2;
  const vertice = (t1, t2) => U.polar(O, r5 / Math.cos(U.rad((t2 - t1) / 2)), (t1 + t2) / 2);
  const pitotFig = (ts, o = {}) => {
    const V = ts.map((t, i) => vertice(t, ts[(i + 1) % 4]));
    const Tg = ts.map(t => U.polar(O, r5, t));
    const L = V.map((p, i) => U.dist(p, V[(i + 1) % 4]));
    const k = o.pasos || {};
    const nombres = ['A', 'B', 'C', 'D'];
    return {
      alt: o.alt || `Cuadrilátero con circunferencia inscrita: AB + CD = ${f(L[0] + L[2])} y BC + DA = ${f(L[1] + L[3])}`,
      vista: { x: [-4.4, 4.4], y: [-3.8, 3.8] },
      puntos: V.map((p, i) => pt(nombres[i], p, { rotulo: nombres[i], lado: U.grados(Math.atan2(p[1], p[0])) })).concat(Tg.map((p, i) => pt('T' + i, p, { color: o.tangentes ? 'h' : undefined, sinPunto: !o.tangentes, desde: k.t || 0 }))).concat([pt('O', O, { sinPunto: true })]),
      circulos: [{ centro: 'O', r: r5, color: 'd' }],
      segmentos: V.map((p, i) => ({ de: nombres[i], a: nombres[(i + 1) % 4], color: i % 2 ? 'i' : 'o', grosor: 'variable', texto: o.sinLados ? undefined : f(L[i]) })),
    };
  };
  const TS = t => [-90, t, 90, 180 + t / 3];
  const poncelet = (o = {}) => {
    const C = [0, 0], A = [6, 0], B = [0, 8], r = 2, I = [r, r];
    const k = o.pasos || {};
    return {
      alt: o.alt || 'Triángulo rectángulo de catetos 6 y 8 e hipotenusa 10 con su circunferencia inscrita de radio 2',
      vista: { x: [-1.2, 7.6], y: [-1, 8.8] },
      puntos: [pt('C', C, { rotulo: 'C', lado: -135 }), pt('A', A, { rotulo: 'A', lado: -45 }), pt('B', B, { rotulo: 'B', lado: 135 }), pt('I', I, { sinPunto: true }),
        pt('T1', [r, 0], { color: 'h', desde: k.t || 0 }), pt('T2', [0, r], { color: 'h', desde: k.t || 0 })],
      regiones: [{ puntos: ['C', 'T1', 'I', 'T2'], color: 'h', opacidad: 0.14, desde: k.cuad || 0 }],
      circulos: [{ centro: 'I', r, color: 'd' }],
      segmentos: [{ de: 'C', a: 'A', color: 'o', grosor: 'variable', texto: '6' }, { de: 'C', a: 'B', color: 'i', grosor: 'variable', texto: '8' }, { de: 'A', a: 'B', color: 'h', grosor: 'variable', texto: '10' },
        ...(o.radios ? [{ de: 'I', a: 'T1', color: 'd', desde: k.cuad || 0 }, { de: 'I', a: 'T2', color: 'd', texto: o.sinR ? 'r' : 'r = 2', desde: k.cuad || 0 }] : [])],
      angulos: [{ en: 'C', de: 'A', a: 'B' }],
    };
  };
  const pitot = {
    id: 'poncelet-pitot',
    titulo: 'Tangentes iguales: Pitot y Poncelet',
    temas: ['Teoremas de Poncelet y Pitot'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'El cuadrilátero ABCD tiene sus cuatro lados tangentes a la circunferencia. Cambia su forma y compara AB + CD con BC + DA.',
      voz: 'Deforma el cuadrilátero. Comprueba qué sumas permanecen iguales.',
      controles: [{ id: 't', etiqueta: 'forma', min: -30, max: 30, paso: 10, inicio: 10, unidad: '', decimales: 0 }],
      dibujo: v => ({ datos: pitotFig(TS(v.t)), estado: {} }),
      lectura: v => {
        const ts = TS(v.t), V = ts.map((t, i) => vertice(t, ts[(i + 1) % 4])), L = V.map((p, i) => U.dist(p, V[(i + 1) % 4]));
        return [{ v: 'c-o', t: 'AB + CD' }, ` = ${f(L[0] + L[2])} · `, { v: 'c-i', t: 'BC + DA' }, ` = ${f(L[1] + L[3])}`];
      },
      minimo: 4,
    },
    predice: {
      pregunta: 'Un triángulo rectángulo tiene catetos 6 y 8 e hipotenusa 10. ¿Cuánto mide el radio de su circunferencia inscrita?',
      voz: 'Usa lo mismo: tangentes iguales desde cada vértice.',
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'circ', texto: '5', error: 'GE-PON1', siFuera: '5 es la mitad de la hipotenusa: el radio de la circunscrita, no de la inscrita.' },
        { id: 'altura', texto: '4,8', error: 'GE-PON1', siFuera: '4,8 es la altura sobre la hipotenusa; el radio inscrito es otra medida.' },
        { id: 'resta', texto: '4', error: 'GE-PON2', siFuera: '6 + 8 − 10 = 4 es el diámetro: 2r. Falta la mitad.' },
      ],
      dibujo: { datos: poncelet({ radios: true, sinR: true }), estado: {} },
      revelar: { datos: poncelet({ radios: true }), estado: {} },
      coincide: 'Coincide: 6 + 8 = 10 + 2r, así que r = 2.',
    },
    mira: {
      datos: poncelet({ radios: true, pasos: { t: 1, cuad: 2 }, alt: 'Desde C, las dos tangentes miden r: forman un cuadrado con el centro; el resto de cada cateto se completa en la hipotenusa' }),
      voz: 'Sigue las tangentes desde cada vértice.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Desde cada vértice salen dos tangentes iguales.', ecuacion: ['tangentes iguales desde A, B y C'] },
        { estado: { corte: 2 }, texto: 'En C, las dos tangentes y los radios forman un cuadrado de lado r.', ecuacion: ['desde C: r y r'] },
        { estado: { corte: 2 }, texto: 'Catetos: tangentes de A y B más 2r. Hipotenusa: solo esas tangentes.', ecuacion: ['6 + 8 = 10 + 2r → r = 2'] },
      ],
    },
    regla: {
      texto: 'Pitot: si un cuadrilátero tiene circunferencia inscrita, sus lados opuestos suman lo mismo. Poncelet: en un triángulo rectángulo, los catetos suman la hipotenusa más el diámetro inscrito.',
      ecuacion: [{ v: 'c-o', t: 'AB + CD' }, ' = ', { v: 'c-i', t: 'BC + DA' }, '   ·   a + b = c + 2r'],
      condicion: 'Pitot pide un cuadrilátero convexo con circunferencia inscrita; Poncelet, un triángulo rectángulo con c la hipotenusa.',
      voz: 'Los dos teoremas son tangentes iguales, nada más.',
    },
    ahoraTu: {
      voz: 'Escribe cada lado como suma de dos tangentes.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const [a, b, c] = r.de(TRIPLES), k = r.ent(1, 3), A = a * k, B = b * k, C = c * k, rr = (A + B - C) / 2;
          return {
            pregunta: [`Un triángulo rectángulo tiene catetos ${A} y ${B} e hipotenusa ${C}. ¿Cuánto mide el radio de su circunferencia inscrita?`],
            opciones: opciones(rr, [
              { id: 'diam', valor: A + B - C, error: 'GE-PON2', siFuera: `${A + B - C} es 2r, el diámetro. Falta la mitad.` },
              { id: 'circ', valor: C / 2, error: 'GE-PON1', siFuera: 'La mitad de la hipotenusa es el radio de la circunscrita.' },
              { id: 'suma', valor: (A + B + C) / 2, error: 'GE-PON2', siFuera: 'Eso es el semiperímetro, no el radio.' },
            ], x => f(x, 1)),
            solucion: { texto: 'Poncelet: los catetos suman la hipotenusa más 2r.', ecuacion: [`${A} + ${B} = ${C} + 2r → r = ${f(rr)}`] },
          };
        }
        const t = [r.ent(1, 6), r.ent(1, 6), r.ent(1, 6), r.ent(1, 6)];
        const L = [t[0] + t[1], t[1] + t[2], t[2] + t[3], t[3] + t[0]];
        return {
          pregunta: [`Un cuadrilátero tiene una circunferencia inscrita. Sus lados consecutivos miden AB = ${L[0]}, BC = ${L[1]}, CD = ${L[2]} y DA. ¿Cuánto mide DA?`],
          opciones: opciones(L[3], [
            { id: 'opuesto', valor: L[1], error: 'GE-PON3', siFuera: 'Igualar DA con BC sería cierto en un paralelogramo; Pitot compara sumas de opuestos.' },
            { id: 'consec', valor: L[0] + L[1] - L[2], error: 'GE-PON3', siFuera: 'Eso empareja lados consecutivos; Pitot empareja AB con CD.' },
            { id: 'suma', valor: L[0] + L[2], error: 'GE-PON3', siFuera: 'Eso es AB + CD completo; DA es lo que le falta a BC para llegar ahí.' },
          ], x => f(x, 1)),
          solucion: { texto: 'Pitot: AB + CD = BC + DA.', ecuacion: [`${L[0]} + ${L[2]} = ${L[1]} + DA → DA = ${L[3]}`] },
        };
      },
    },
  };

  // ---------- Idea 6: cuadrilátero inscrito ----------
  // Cambia: la posición de D en su arco · Permanece: A, B y C en la circunferencia · Progresa: ∠B + ∠D = 180° ·
  // Se reserva: D dentro del círculo · Debe verse: los dos ángulos opuestos abarcan arcos que suman 360°.
  const P6 = { A: en(210), B: en(110), C: en(350) };
  const cicl = (fi, o = {}) => {
    const D = o.D || en(fi), { A, B, C } = P6, k = o.pasos || {};
    const b = U.angulo(B, A, C), d = U.angulo(D, A, C);
    return {
      alt: o.alt || `Cuadrilátero ABCD con ∠B = ${f(b, 0)}° y ∠D = ${f(d, 0)}°: suman ${f(b + d, 0)}°`,
      vista: { x: [-4.2, 4.2], y: [-4.2, 4.2] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 210 }), pt('B', B, { rotulo: 'B', lado: 110 }), pt('C', C, { rotulo: 'C', lado: -10 }), pt('D', D, { rotulo: 'D', color: 'o', lado: o.D ? -60 : fi }), pt('O', O, { sinPunto: true })],
      circulos: [{ centro: 'O', r: R }],
      arcos: o.arcos ? [{ centro: O, r: R, de: 210, a: 350, color: 'o', grosor: 'variable', desde: k.b || 0 }, { centro: O, r: R, de: 350, a: 570, color: 'i', grosor: 'variable', desde: k.d || 0 }] : [],
      regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'd', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'D' }, { de: 'D', a: 'A' }, ...(o.diag ? [{ de: 'A', a: 'C', discontinua: true, grosor: 'fino' }] : [])],
      angulos: [{ en: 'B', de: 'C', a: 'A', color: 'o', texto: o.sinB ? undefined : `${f(b, 0)}°`, desde: k.b || 0 }, { en: 'D', de: 'A', a: 'C', color: 'i', texto: o.sinD ? undefined : `${f(d, 0)}°`, desde: k.d || 0 }],
    };
  };
  const ciclico = {
    id: 'cuadrilatero-inscrito',
    titulo: 'Opuestos que suman 180°',
    temas: ['Cuadrilátero inscrito e inscriptible'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'A, B, C y D están en la circunferencia. Corre D por su arco y compara los ángulos opuestos B y D.',
      voz: 'Corre D. Suma los dos ángulos opuestos cada vez.',
      controles: [{ id: 'fi', etiqueta: 'D en el arco', min: 230, max: 330, paso: 20, inicio: 270, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: cicl(v.fi), estado: {} }),
      lectura: v => [{ v: 'c-o', t: '∠B' }, ' + ', { v: 'c-i', t: '∠D' }, ` = ${f(U.angulo(P6.B, P6.A, P6.C) + U.angulo(en(v.fi), P6.A, P6.C), 0)}°`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora D se mete dentro del círculo, sin tocar la circunferencia. ¿Cuánto suman los ángulos B y D?',
      voz: 'D dejó la circunferencia. Revisa qué condición se perdió.',
      opciones: [
        { id: 'c', texto: 'Más de 180°', correcta: true },
        { id: 'igual', texto: '180°, como antes', error: 'GE-CIC2', siFuera: 'Sumarían 180° si D siguiera en la circunferencia. Dentro, el ángulo D se abre.' },
        { id: 'menos', texto: 'Menos de 180°', error: 'GE-CIC2', siFuera: 'Sería menos si D saliera del círculo: ahí el ángulo D se cierra.' },
      ],
      dibujo: { datos: cicl(0, { D: [0.3, -1.4], sinD: true, alt: 'Cuadrilátero ABCD con D dentro del círculo' }), estado: {} },
      revelar: { datos: cicl(0, { D: [0.3, -1.4] }), estado: {} },
      coincide: 'Coincide: con D dentro, ∠D crece y la suma pasa de 180°.',
    },
    mira: {
      datos: cicl(280, { arcos: true, pasos: { b: 1, d: 2 }, alt: '∠B abarca el arco ADC y ∠D el arco ABC: los dos arcos juntos son toda la circunferencia' }),
      voz: 'Cada ángulo opuesto abarca un arco. Junta los dos arcos.',
      pasos: [
        { estado: { corte: 1 }, texto: '∠B es inscrito: mide la mitad del arco ADC.', ecuacion: [{ v: 'c-o', t: '∠B' }, ' = ', { frac: ['arco ADC', '2'] }] },
        { estado: { corte: 2 }, texto: '∠D es inscrito: mide la mitad del arco ABC.', ecuacion: [{ v: 'c-i', t: '∠D' }, ' = ', { frac: ['arco ABC', '2'] }] },
        { estado: { corte: 2 }, texto: 'Los dos arcos forman la circunferencia entera.', ecuacion: [{ v: 'c-o', t: '∠B' }, ' + ', { v: 'c-i', t: '∠D' }, ' = ', { frac: ['360°', '2'] }, ' = 180°'] },
      ],
    },
    regla: {
      texto: 'En un cuadrilátero inscrito, los ángulos opuestos son suplementarios. Al revés: si dos ángulos opuestos suman 180°, el cuadrilátero es inscriptible.',
      ecuacion: [{ v: 'c-o', t: '∠B' }, ' + ', { v: 'c-i', t: '∠D' }, ' = 180°'],
      condicion: 'los cuatro vértices están en una circunferencia (cuadrilátero convexo); vale también para ∠A + ∠C.',
      voz: 'Antes de sumar 180°, comprueba que los cuatro estén en la circunferencia.',
    },
    ahoraTu: {
      voz: 'Ubica los opuestos y decide si suman 180°.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const a = 5 * r.ent(12, 26), b = 5 * r.ent(12, 26);
          const fig = cicl(280, { sinB: true, sinD: true, alt: 'Cuadrilátero ABCD inscrito en una circunferencia' });
          return {
            pregunta: [`El cuadrilátero ABCD está inscrito en una circunferencia. Si ∠A = ${a}° y ∠B = ${b}°, ¿cuánto mide ∠D?`],
            dibujo: { datos: fig, estado: {} },
            opciones: opciones(180 - b, [
              { id: 'opA', valor: 180 - a, error: 'GE-CIC1', siFuera: `${180 - a}° es ∠C, el opuesto de A. D es el opuesto de B.` },
              { id: 'igual', valor: b, error: 'GE-CIC1', siFuera: 'Igual a B sería en un paralelogramo; inscrito, los opuestos suman 180°.' },
              { id: 'suma', valor: 360 - a - b, error: 'GE-CIC1', siFuera: 'Eso reparte lo que falta entre C y D juntos.' },
            ], gr),
            solucion: { texto: 'D es opuesto a B: suman 180°.', ecuacion: [`∠D = 180° − ${b}° = ${180 - b}°`] },
          };
        }
        const a = 5 * r.ent(12, 26), si = r.ent(0, 1), c = si ? 180 - a : 180 - a + 5 * r.de([-3, -2, 2, 3]);
        return {
          pregunta: [`En el cuadrilátero convexo ABCD, ∠A = ${a}° y ∠C = ${c}°. ¿Se puede inscribir en una circunferencia?`],
          opciones: [{ id: 'c', texto: si ? 'Sí: A y C suman 180°' : `No: A y C suman ${a + c}°`, correcta: true },
            { id: 'otro', texto: si ? `No: suman ${a + c}°, falta 180°` : 'Sí: todo cuadrilátero se puede', error: 'GE-CIC2', siFuera: si ? `Revisa la suma: ${a}° + ${c}° = ${a + c}°.` : 'Todo triángulo se puede inscribir; un cuadrilátero, solo si sus opuestos suman 180°.' },
            { id: 'iguales', texto: 'Solo si A y C son iguales', error: 'GE-CIC1', siFuera: 'Iguales servirían en un paralelogramo; para inscribir, los opuestos deben sumar 180°.' }],
          solucion: { texto: 'Inscriptible si y solo si los opuestos suman 180°.', ecuacion: [`${a}° + ${c}° = ${a + c}°`] },
        };
      },
    },
  };

  return {
    unidad: 'geometria.circunferencia',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'El libro III de los Elementos reúne cuerdas, tangentes y ángulos de la circunferencia. Su proposición 20 compara dos observadores del mismo arco: uno en el centro y otro sobre la circunferencia. La prueba usa radios iguales y distingue casos según dónde queda el centro. La condición decisiva sigue siendo la misma: los dos ángulos se apoyan en el mismo arco.',
      pregunta: '¿Qué cambia si el vértice sale de la circunferencia?',
      fuente: { titulo: 'Euclides, Elementos III.20 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookIII/propIII20.html' },
    },
    ideas: [tangentes, posiciones, inscrito, intExt, pitot, ciclico],
  };
});
