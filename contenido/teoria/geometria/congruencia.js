/*
 * Teoría de «Congruencia de triángulos» (geometria.congruencia). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 3); Elementos I.4 (LAL por superposición) y I.8 (LLL).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: saber qué datos fijan un triángulo (LAL, ALA, LLL) y cuáles no (LLA, AAA), y usar la congruencia
 *     para probar mediatriz, bisectriz, base media y mediana a la hipotenusa.
 *   Persona y condiciones: postulante de 3.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: elige el criterio correcto, calcula con base media, mediana a la hipotenusa y notables.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿con dos lados y un ángulo ya está?» y «¿por qué la base media es la mitad?».
 *
 * Colores: el dato que se mueve naranja (c-o), el que lo acompaña turquesa (c-i), la referencia verde (c-d),
 * lo que se pide rojo (c-h). Códigos: GE-CON (hipótesis nuevas); GE9 para el notable mal leído por la posición.
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

  // ---------- Idea 1: qué datos fijan un triángulo ----------
  // Cambia: el ángulo entre los lados 7 y 5 · Permanece: los dos lados · Progresa: el tercer lado, uno por cada ángulo ·
  // Se reserva: el compás que corta dos veces (LLA) · Debe verse: con el ángulo no comprendido hay dos triángulos.
  const armado = (t, o = {}) => {
    const C = U.polar([0, 0], 5, t);
    return {
      alt: `Lados AB = 7 y AC = 5 con ángulo A de ${t}°: el tercer lado BC mide ${f(U.dist(C, [7, 0]))}; un solo triángulo`,
      vista: { x: [-3.6, 8], y: [-0.8, 5.4] },
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -120 }, { id: 'B', x: 7, y: 0, rotulo: 'B', lado: -60 }, { id: 'C', x: C[0], y: C[1], rotulo: 'C', lado: t + 10 }],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 }],
      segmentos: [{ de: 'A', a: 'B', texto: '7', color: 'd', grosor: 'variable' }, { de: 'A', a: 'C', texto: '5', color: 'i', grosor: 'variable' },
        { de: 'B', a: 'C', color: 'h', texto: o.sinBC ? undefined : `${f(U.dist(C, [7, 0]))}` }],
      angulos: [{ en: 'A', de: 'B', a: 'C', color: 'o', texto: `${t}°` }],
    };
  };
  const t1 = 7 * Math.cos(U.rad(40)) - Math.sqrt(49 * Math.cos(U.rad(40)) ** 2 - 24), t2 = 7 * Math.cos(U.rad(40)) + Math.sqrt(49 * Math.cos(U.rad(40)) ** 2 - 24);
  const C1 = U.polar([0, 0], t1, 40), C2 = U.polar([0, 0], t2, 40);
  const lla = (paso, o = {}) => ({
    alt: o.alt || 'AB = 7, ángulo A = 40° y BC = 5: el compás con centro B corta el lado de A en dos puntos, C₁ y C₂',
    vista: { x: [-0.8, 12.2], y: [-0.8, 6] },
    puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -120 }, { id: 'B', x: 7, y: 0, rotulo: 'B', lado: -60 }, { id: 'R', x: 7.6 * Math.cos(U.rad(40)) + 1.3, y: 7.6 * Math.sin(U.rad(40)) + 1.1, sinPunto: true },
      { id: 'C1', x: C1[0], y: C1[1], rotulo: 'C₁', color: 'h', lado: 130, desde: paso.c || 0 }, { id: 'C2', x: C2[0], y: C2[1], rotulo: 'C₂', color: 'h', lado: 100, desde: paso.c || 0 }],
    circulos: o.compas === false ? [] : [{ centro: 'B', r: 5, color: 'i', discontinua: true, desde: paso.compas || 0 }],
    segmentos: [{ de: 'A', a: 'B', texto: '7', color: 'd', grosor: 'variable' }, { de: 'A', a: 'R', grosor: 'fino' },
      { de: 'B', a: 'C1', color: 'i', texto: '5', desde: paso.c || 0 }, { de: 'B', a: 'C2', color: 'i', texto: '5', desde: paso.c || 0 }],
    angulos: [{ en: 'A', de: 'B', a: 'R', color: 'o', texto: '40°' }],
  });
  const tipos = {
    LAL: { nombre: 'LAL', datos: (d) => [`AB = PQ = ${d.a}`, `∠A = ∠P = ${d.g}°`, `AC = PR = ${d.b}`] },
    ALA: { nombre: 'ALA', datos: (d) => [`∠A = ∠P = ${d.g}°`, `AB = PQ = ${d.a}`, `∠B = ∠Q = ${d.h}°`] },
    LLL: { nombre: 'LLL', datos: (d) => [`AB = PQ = ${d.a}`, `BC = QR = ${d.c}`, `AC = PR = ${d.b}`] },
    LLA: { nombre: 'No basta', datos: (d) => [`AB = PQ = ${d.a}`, `BC = QR = ${d.c}`, `∠A = ∠P = ${d.g}°`] },
    AAA: { nombre: 'No basta', datos: (d) => [`∠A = ∠P = ${d.g}°`, `∠B = ∠Q = ${d.h}°`, `∠C = ∠R = ${180 - d.g - d.h}°`] },
  };
  const criterios = {
    id: 'criterios',
    titulo: 'Qué datos fijan un triángulo',
    temas: ['Criterios LAL, ALA y LLL'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Los lados AB = 7 y AC = 5 están fijos. Cambia el ángulo A, que queda entre ellos, y mira el tercer lado.',
      voz: 'Para cada ángulo, cuenta cuántos triángulos puedes armar.',
      controles: [{ id: 't', etiqueta: '∠A', min: 20, max: 150, paso: 10, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: armado(v.t), estado: {} }),
      lectura: v => [{ v: 'c-h', t: 'BC' }, ` = ${f(U.dist(U.polar([0, 0], 5, v.t), [7, 0]))} · un solo triángulo`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora el ángulo no queda entre los lados: AB = 7, ∠A = 40° y BC = 5, opuesto a A. ¿Cuántos triángulos distintos cumplen esos datos?',
      voz: 'El ángulo cambió de lugar. Piensa antes de usar el compás.',
      opciones: [
        { id: 'c', texto: 'Dos', correcta: true },
        { id: 'uno', texto: 'Uno: dos lados y un ángulo lo fijan', error: 'GE-CON1', siFuera: 'Uno solo sería cierto con el ángulo entre los dos lados (LAL). Aquí el ángulo es opuesto.' },
        { id: 'cero', texto: 'Ninguno', error: 'GE-CON2', siFuera: 'No habría ninguno si BC fuera más corto que la distancia de B al otro lado. Con 5 alcanza.' },
      ],
      dibujo: { datos: lla({}, { compas: false, alt: 'AB = 7 y un lado que sale de A con 40°; falta ubicar C a 5 de B' }), estado: {} },
      revelar: { datos: lla({}), estado: {} },
      coincide: 'Coincide: el compás de radio 5 corta dos veces. LLA no fija el triángulo.',
    },
    mira: {
      datos: lla({ compas: 1, c: 2 }),
      voz: 'Usa el compás como lo haría con lápiz y papel.',
      pasos: [
        { estado: { corte: 1 }, texto: 'C está a 5 de B: en la circunferencia de centro B.', ecuacion: ['BC = 5'] },
        { estado: { corte: 2 }, texto: 'La circunferencia corta al lado de A en dos puntos.', ecuacion: [`A${'C'}₁ ≈ ${f(t1)} · A${'C'}₂ ≈ ${f(t2)}`] },
        { estado: { corte: 2 }, texto: 'Dos triángulos distintos con los mismos datos: LLA no es criterio.', ecuacion: ['△ABC₁ ≠ △ABC₂'] },
      ],
    },
    regla: {
      texto: 'Dos triángulos son congruentes si coinciden en LAL (ángulo entre los dos lados), ALA (lado entre los dos ángulos) o LLL. Con LLA o AAA no basta.',
      condicion: 'los elementos iguales se corresponden en el mismo orden. AAA solo asegura la misma forma, no el tamaño.',
      voz: 'Antes de nombrar el criterio, ubica dónde está el ángulo.',
    },
    ahoraTu: {
      voz: 'Ordena los datos: ¿el ángulo está entre los lados o no?',
      generar(s) {
        const r = azar(s), k = ['LAL', 'ALA', 'LLL', 'LLA', 'AAA'][s % 5];
        const d = { a: r.ent(4, 9), b: r.ent(4, 9), c: r.ent(4, 9), g: 5 * r.ent(8, 16), h: 5 * r.ent(6, 12) };
        const bien = tipos[k].nombre;
        const todos = ['LAL', 'ALA', 'LLL', 'No basta'];
        const motivo = { LAL: 'el ángulo quedara entre los dos lados', ALA: 'el lado quedara entre los dos ángulos', LLL: 'se dieran los tres lados', 'No basta': 'faltara un dato bien ubicado' };
        return {
          pregunta: [`En △ABC y △PQR se sabe: ${tipos[k].datos(d).join('; ')}. ¿Qué criterio asegura que son congruentes?`],
          opciones: [{ id: 'c', texto: bien, correcta: true }].concat(todos.filter(x => x !== bien).map(x => ({ id: x === 'No basta' ? 'no-basta' : x.toLowerCase(), texto: x, error: k === 'LLA' || k === 'AAA' ? 'GE-CON1' : 'GE-CON3', siFuera: `${x} sería cierto si ${motivo[x]}.` }))),
          solucion: { texto: { LAL: 'El ángulo A está entre AB y AC: LAL.', ALA: 'El lado AB está entre los ángulos A y B: ALA.', LLL: 'Los tres lados coinciden: LLL.', LLA: 'El ángulo A no está entre AB y BC: puede haber dos triángulos.', AAA: 'Iguales ángulos dan la misma forma, no el mismo tamaño.' }[k], ecuacion: [bien] },
        };
      },
    },
  };

  // ---------- Idea 2: mediatriz y bisectriz como lugares de puntos ----------
  // Cambia: la posición de P · Permanece: el segmento AB · Progresa: la diferencia PA − PB ·
  // Se reserva: la bisectriz de un ángulo · Debe verse: «equidistar» se mide con perpendiculares.
  const PA = { v: 'c-o', t: 'PA' }, PB = { v: 'c-i', t: 'PB' };
  const mediatriz = (dx, y) => {
    const P = [dx, y];
    return {
      alt: `P a ${f(U.dist(P, [-3, 0]))} de A y a ${f(U.dist(P, [3, 0]))} de B${dx === 0 ? ': está en la mediatriz y equidista' : ''}`,
      vista: { x: [-4.4, 4.4], y: [-3.6, 4.4] },
      puntos: [{ id: 'A', x: -3, y: 0, rotulo: 'A', lado: 180 }, { id: 'B', x: 3, y: 0, rotulo: 'B', lado: 0 }, { id: 'M', x: 0, y: 0, rotulo: 'M', lado: -45 },
        { id: 'P', x: dx, y, rotulo: 'P', color: 'h', lado: 90 }, { id: 'Z1', x: 0, y: -3.5, sinPunto: true }, { id: 'Z2', x: 0, y: 4.2, sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'M', marcas: 1 }, { de: 'M', a: 'B', marcas: 1 }, { de: 'Z1', a: 'Z2', color: 'd', discontinua: true },
        { de: 'P', a: 'A', color: 'o', grosor: 'variable', texto: f(U.dist(P, [-3, 0])) }, { de: 'P', a: 'B', color: 'i', grosor: 'variable', texto: f(U.dist(P, [3, 0])) }],
      angulos: [{ en: 'M', de: 'B', a: 'Z2', color: 'd' }],
    };
  };
  const bisec = (o = {}) => {
    const O = [0, 0], P = U.polar(O, 5, 30), H1 = U.pie(P, O, [1, 0]), H2 = U.pie(P, O, U.polar(O, 1, 60));
    const k = o.pasos || {};
    return {
      alt: 'P está en la bisectriz del ángulo O de 60°, a 5 de O: sus distancias perpendiculares a los dos lados miden 2,5',
      vista: { x: [-0.8, 6.4], y: [-0.8, 5.6] },
      puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: 200 }, { id: 'X', x: 6.2, y: 0, sinPunto: true }, { id: 'Y', x: 3.1, y: 5.37, sinPunto: true },
        { id: 'P', x: P[0], y: P[1], rotulo: 'P', color: 'h', lado: 15 }, { id: 'H1', x: H1[0], y: H1[1], rotulo: 'H', lado: -90 }, { id: 'H2', x: H2[0], y: H2[1], rotulo: 'K', lado: 150 }],
      segmentos: [{ de: 'O', a: 'X' }, { de: 'O', a: 'Y' }, { de: 'O', a: 'P', color: 'd', discontinua: true, texto: k.op ? '5' : undefined, desde: k.op || 0 },
        { de: 'P', a: 'H1', color: 'o', grosor: 'variable', texto: o.d1 }, { de: 'P', a: 'H2', color: 'i', grosor: 'variable', texto: o.d2, desde: k.d2 || 0 }],
      angulos: [{ en: 'O', de: 'X', a: 'P', color: 'd', rayita: 1, radio: 40 }, { en: 'O', de: 'P', a: 'Y', color: 'd', rayita: 1, radio: 40 },
        { en: 'H1', de: 'O', a: 'P', color: 'o' }, { en: 'H2', de: 'P', a: 'O', color: 'i', desde: k.d2 || 0 }],
    };
  };
  const lugares = {
    id: 'mediatriz-bisectriz',
    titulo: 'Puntos que equidistan',
    temas: ['Teorema de la mediatriz y de la bisectriz'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Mueve el punto P. Compara sus distancias a A y a B, sobre la línea verde y fuera de ella.',
      voz: 'Sube y corre P. Comprueba cuándo PA y PB coinciden.',
      controles: [
        { id: 'dx', etiqueta: 'P a los lados', min: -2, max: 2, paso: 0.5, inicio: 0, unidad: '', decimales: 1 },
        { id: 'y', etiqueta: 'P a lo alto', min: -3, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: mediatriz(v.dx, v.y), estado: {} }),
      lectura: v => [PA, ` = ${f(U.dist([v.dx, v.y], [-3, 0]))} · `, PB, ` = ${f(U.dist([v.dx, v.y], [3, 0]))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora P está en la bisectriz de un ángulo de 60°, a 5 de su vértice O. Su distancia a un lado mide 2,5. ¿Cuánto mide su distancia al otro lado?',
      voz: 'Piensa en cómo se mide la distancia a una recta.',
      opciones: [
        { id: 'c', texto: '2,5', correcta: true },
        { id: 'op', texto: '5', error: 'GE-CON6', siFuera: '5 es la distancia a O, el vértice. La distancia a un lado se mide en perpendicular.' },
        { id: 'depende', texto: 'Depende de dónde mida', error: 'GE-CON6', siFuera: 'A lo largo del lado sí cambia; la distancia es la perpendicular, y esa es única.' },
        { id: 'resta', texto: '2,5 por √3', error: 'GE-CON7', siFuera: 'Eso sería el tramo OH sobre el lado, no la perpendicular desde P.' },
      ],
      dibujo: { datos: bisec({ d1: '2,5' }), estado: {} },
      revelar: { datos: bisec({ d1: '2,5', d2: '2,5' }), estado: {} },
      coincide: 'Coincide: los dos triángulos OHP y OKP son congruentes.',
    },
    mira: {
      datos: bisec({ d1: 'PH', d2: 'PK', pasos: { op: 1, d2: 2 } }),
      voz: 'Compara los dos triángulos rectángulos pieza por pieza.',
      pasos: [
        { estado: { corte: 1 }, texto: 'OHP y OKP comparten la hipotenusa OP.', ecuacion: ['OP común'] },
        { estado: { corte: 2 }, texto: 'Tienen un ángulo recto y la mitad del ángulo O.', ecuacion: ['∠H = ∠K = 90° · ∠HOP = ∠KOP'] },
        { estado: { corte: 2 }, texto: 'Por ALA son congruentes: los lados opuestos al ángulo igual coinciden.', ecuacion: [{ v: 'c-o', t: 'PH' }, ' = ', { v: 'c-i', t: 'PK' }] },
      ],
    },
    regla: {
      texto: 'Un punto de la mediatriz de AB equidista de A y de B. Un punto de la bisectriz de un ángulo equidista de sus dos lados.',
      ecuacion: [PA, ' = ', PB, '   ·   ', { v: 'c-o', t: 'PH' }, ' = ', { v: 'c-i', t: 'PK' }],
      condicion: 'la distancia a un lado se mide en perpendicular. Y al revés: quien equidista está en la mediatriz o en la bisectriz.',
      voz: 'Equidistar se mide con perpendiculares, no a ojo.',
    },
    ahoraTu: {
      voz: 'Iguala las dos distancias y despeja.',
      generar(s) {
        const r = azar(s), x = r.ent(2, 9), a1 = r.ent(2, 6);
        let a2 = r.ent(2, 7); if (a2 === a1) a2 += 1;
        const v = r.ent(8, 20) + Math.max(a1, a2) * x;
        const b1 = v - a1 * x, b2 = v - a2 * x;
        const med = s % 2 === 0;
        const ex = (a, b) => `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`;
        return {
          pregunta: med ? [`P está en la mediatriz de AB, con PA = ${ex(a1, b1)} y PB = ${ex(a2, b2)}. ¿Cuánto mide PA?`]
            : [`P está en la bisectriz del ángulo O. Sus distancias a los lados miden ${ex(a1, b1)} y ${ex(a2, b2)}. ¿Cuánto mide cada una?`],
          opciones: opciones(v, [
            { id: 'x', valor: x, error: 'GE-CON8', siFuera: `${x} es el valor de x. Falta reemplazarlo en la distancia.` },
            { id: 'suma', valor: 2 * v, error: 'GE-CON8', siFuera: 'Eso suma las dos distancias; cada una mide la mitad.' },
            { id: 'otro', valor: v + Math.abs(a1 - a2), error: 'GE-CON8', siFuera: 'Revisa el despeje: con x correcto las dos expresiones dan lo mismo.' },
          ], n => f(n, 2)),
          solucion: { texto: med ? 'En la mediatriz, PA = PB.' : 'En la bisectriz, las dos distancias son iguales.', ecuacion: [`${ex(a1, b1)} = ${ex(a2, b2)} → x = ${x} → ${v}`] },
        };
      },
    },
  };

  // ---------- Idea 3: la base media ----------
  // Cambia: el vértice A · Permanece: la base BC = 8 · Progresa: MN, siempre 4 y paralela ·
  // Se reserva: la paralela por M (recíproco) · Debe verse: MN = BC/2 por congruencia, no por medida.
  const base = (ax, ay, o = {}) => {
    const A = [ax, ay], B = [0, 0], C = [8, 0], M = U.medio(A, B), N = U.medio(A, C), D = [2 * N[0] - M[0], 2 * N[1] - M[1]];
    const k = o.pasos || {};
    return {
      alt: o.alt || `M y N son puntos medios de AB y AC: MN mide 4, la mitad de BC = 8, y es paralela a BC`,
      vista: { x: [-1.6, 12.4], y: [-0.8, 5.4] },
      puntos: [{ id: 'A', x: ax, y: ay, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: 8, y: 0, rotulo: 'C', lado: -60 },
        { id: 'M', x: M[0], y: M[1], rotulo: 'M', lado: 160 }, { id: 'N', x: N[0], y: N[1], rotulo: o.recip ? '?' : 'N', lado: 20 },
        ...(k.D !== undefined ? [{ id: 'D', x: D[0], y: D[1], rotulo: 'D', color: 'h', lado: 20, desde: k.D }] : [])],
      segmentos: [{ de: 'A', a: 'M', marcas: 1 }, { de: 'M', a: 'B', marcas: 1 }, { de: 'A', a: 'N', marcas: o.recip ? 0 : 2 }, { de: 'N', a: 'C', marcas: o.recip ? 0 : 2 },
        { de: 'B', a: 'C', color: 'd', grosor: 'variable', texto: o.bc || '8', paralela: o.paralela || o.recip ? 1 : 0 },
        { de: 'M', a: 'N', color: 'o', grosor: 'variable', texto: o.sinMN ? undefined : '4', paralela: o.paralela || o.recip ? 1 : 0 },
        ...(k.D !== undefined ? [{ de: 'N', a: 'D', color: 'o', discontinua: true, desde: k.D }, { de: 'C', a: 'D', color: 'h', grosor: 'variable', desde: k.CD }] : [])],
    };
  };
  const baseMedia = {
    id: 'base-media',
    titulo: 'La base media mide la mitad',
    temas: ['Teorema de la base media'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'M y N son los puntos medios de AB y AC. Mueve el vértice A y compara MN con la base BC.',
      voz: 'Mueve A. Busca lo que no cambia en MN.',
      controles: [
        { id: 'ax', etiqueta: 'A a lo ancho', min: -1, max: 11, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'ay', etiqueta: 'A a lo alto', min: 2, max: 5, paso: 1, inicio: 4, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: base(v.ax, v.ay, { paralela: true }), estado: {} }),
      lectura: v => [{ v: 'c-o', t: 'MN' }, ' = 4 · ', { v: 'c-d', t: 'BC' }, ' = 8 · paralelas'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora al revés: desde el punto medio M de AB trazamos una paralela a BC. ¿Dónde corta al lado AC?',
      voz: 'Ya viste la ida. Piensa si el camino de vuelta también vale.',
      opciones: [
        { id: 'c', texto: 'En el punto medio de AC', correcta: true },
        { id: 'depende', texto: 'Depende de la forma del triángulo', error: 'GE-CON9', siFuera: 'La forma sí cambia los largos; la paralela por el punto medio siempre parte AC por la mitad.' },
        { id: 'tercio', texto: 'A un tercio de A', error: 'GE-CON9', siFuera: 'Un tercio saldría si M estuviera a un tercio de AB. Está en la mitad.' },
      ],
      dibujo: { datos: base(3, 4, { sinMN: true, recip: true, alt: 'M es punto medio de AB; desde M sale una paralela a BC que corta a AC' }), estado: {} },
      revelar: { datos: base(3, 4, { paralela: true }), estado: {} },
      coincide: 'Coincide: la paralela por un punto medio llega al otro punto medio.',
    },
    mira: {
      datos: base(3, 4, { pasos: { D: 1, CD: 2 }, alt: 'Se prolonga MN hasta D con ND = MN; el triángulo NCD copia al ANM y MBCD resulta paralelogramo' }),
      voz: 'Una copia del triángulo pequeño hace la prueba.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Prolongamos MN hasta D, con ND = MN.', ecuacion: ['ND = MN'] },
        { estado: { corte: 2 }, texto: 'ANM y CND: dos lados iguales y el ángulo opuesto por el vértice. LAL.', ecuacion: ['△ANM ≅ △CND'] },
        { estado: { corte: 2 }, texto: 'Así CD = AM = MB y CD es paralela a AB.', ecuacion: ['MBCD es paralelogramo'] },
        { estado: { corte: 2 }, texto: 'En el paralelogramo, MD = BC; y MN es la mitad de MD.', ecuacion: [{ v: 'c-o', t: 'MN' }, ' = ', { frac: [{ v: 'c-d', t: 'BC' }, '2'] }, ' = 4'] },
      ],
    },
    regla: {
      texto: 'El segmento que une los puntos medios de dos lados es paralelo al tercero y mide su mitad. La paralela por un punto medio llega al otro punto medio.',
      ecuacion: [{ v: 'c-o', t: 'MN' }, ' = ', { frac: [{ v: 'c-d', t: 'BC' }, '2'] }, '   ·   MN ∥ BC'],
      condicion: 'M y N son puntos medios de dos lados del mismo triángulo; MN se compara con el tercer lado.',
      voz: 'La prueba usa congruencia. El dibujo solo la sugiere.',
    },
    ahoraTu: {
      voz: 'Ubica los puntos medios y el lado que les corresponde.',
      generar(s) {
        const r = azar(s), tipo = s % 2;
        if (tipo === 0) {
          const bc = 2 * r.ent(3, 14);
          return {
            pregunta: ['En el triángulo ABC, M y N son puntos medios de AB y AC, y ', { v: 'c-d', t: 'BC' }, ` = ${bc}. ¿Cuánto mide `, { v: 'c-o', t: 'MN' }, '?'],
            dibujo: { datos: base(r.ent(1, 7), r.ent(3, 5), { sinMN: true, bc: `${bc}`, alt: `M y N son puntos medios de AB y AC; BC mide ${bc}` }), estado: {} },
            opciones: opciones(bc / 2, [
              { id: 'igual', valor: bc, error: 'GE-CON10', siFuera: 'Ser paralela a BC no la hace igual: MN mide la mitad.' },
              { id: 'doble', valor: 2 * bc, error: 'GE-CON10', siFuera: 'Es al revés: BC es el doble de MN.' },
              { id: 'tercio', valor: bc / 3, error: 'GE-CON10', siFuera: 'Un tercio no viene de los puntos medios; la razón es 1 a 2.' },
            ], n => f(n, 1)),
            solucion: { texto: 'La base media mide la mitad del tercer lado.', ecuacion: [{ v: 'c-o', t: 'MN' }, ` = ${bc} ÷ 2 = ${bc / 2}`] },
          };
        }
        const a = r.ent(5, 14), b = r.ent(5, 14), c = r.ent(Math.abs(a - b) + 1, a + b - 1);
        const p = a + b + c;
        return {
          pregunta: [`Un triángulo tiene lados ${a}, ${b} y ${c}. Unimos los puntos medios de sus tres lados. ¿Cuál es el perímetro del triángulo que se forma?`],
          opciones: opciones(p / 2, [
            { id: 'igual', valor: p, error: 'GE-CON10', siFuera: 'Cada lado nuevo mide la mitad de uno original: el perímetro también.' },
            { id: 'cuarto', valor: p / 4, error: 'GE-CON11', siFuera: 'Un cuarto es lo que pasa con el área, no con el perímetro.' },
            { id: 'tercio', valor: p / 3, error: 'GE-CON10', siFuera: 'Un tercio no viene de los puntos medios; cada lado es la mitad.' },
          ], n => f(n, 1)),
          solucion: { texto: 'Cada lado del triángulo medio es una base media.', ecuacion: [`${a}/2 + ${b}/2 + ${c}/2 = ${f(p / 2)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: la mediana a la hipotenusa ----------
  // Cambia: la posición de C en la semicircunferencia · Permanece: la hipotenusa AB = 10 · Progresa: el ángulo C, siempre 90° ·
  // Se reserva: C dentro del círculo · Debe verse: MC = MA = MB = 5 porque el rectángulo tiene diagonales iguales.
  const semi = (fi, o = {}) => {
    const C = o.C || U.polar([0, 0], 5, fi), D = [-C[0], -C[1]];
    const k = o.pasos || {};
    const cm = U.dist(C, [0, 0]);
    return {
      alt: o.alt || `Triángulo rectángulo en C con hipotenusa 10: la mediana CM mide ${f(cm)}${o.C ? '' : ', la mitad de AB'}`,
      vista: { x: [-5.8, 5.8], y: [k.D !== undefined ? -5.6 : -1.6, 5.8] },
      puntos: [{ id: 'A', x: -5, y: 0, rotulo: 'A', lado: 180 }, { id: 'B', x: 5, y: 0, rotulo: 'B', lado: 0 }, { id: 'M', x: 0, y: 0, rotulo: 'M', lado: -90 },
        { id: 'C', x: C[0], y: C[1], rotulo: 'C', color: 'o', lado: 90 }, ...(k.D !== undefined ? [{ id: 'D', x: D[0], y: D[1], rotulo: 'D', lado: -90, desde: k.D }] : [])],
      arcos: o.circulo === false ? [] : [{ centro: [0, 0], r: 5, de: 0, a: 180, color: 'd', discontinua: true, desde: k.circ || 0 }],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 }],
      rotulos: o.sinAB ? [] : [{ x: 0, y: -1.2, texto: 'AB = 10' }],
      segmentos: [{ de: 'A', a: 'M', marcas: 1 }, { de: 'M', a: 'B', marcas: 1 }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' },
        { de: 'C', a: 'M', color: 'h', grosor: 'variable', texto: o.sinCM ? undefined : f(cm) },
        ...(k.D !== undefined ? [{ de: 'A', a: 'D', discontinua: true, desde: k.D }, { de: 'B', a: 'D', discontinua: true, desde: k.D }, { de: 'M', a: 'D', color: 'h', discontinua: true, desde: k.D }] : [])],
      angulos: [{ en: 'C', de: 'A', a: 'B', color: 'o', texto: o.C ? `${f(U.angulo(C, [-5, 0], [5, 0]), 0)}°` : undefined }],
    };
  };
  const medianaHip = {
    id: 'mediana-hipotenusa',
    titulo: 'La mediana a la hipotenusa',
    temas: ['Mediana relativa a la hipotenusa'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'C se mueve por la semicircunferencia de diámetro AB = 10. Mira el ángulo en C y la mediana CM.',
      voz: 'Corre C por el arco. Comprueba qué medidas permanecen.',
      controles: [{ id: 'fi', etiqueta: 'C en el arco', min: 20, max: 160, paso: 20, inicio: 60, unidad: '°', decimales: 0 }],
      dibujo: v => ({ datos: semi(v.fi), estado: {} }),
      lectura: v => [{ v: 'c-o', t: '∠C' }, ` = 90° · `, { v: 'c-h', t: 'CM' }, ' = 5'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora C se mete dentro del círculo: el ángulo en C deja de ser recto y queda obtuso. ¿Cómo queda la mediana CM?',
      voz: 'C salió del arco. Decide qué condición se perdió.',
      opciones: [
        { id: 'c', texto: 'Más corta que 5', correcta: true },
        { id: 'igual', texto: 'Sigue midiendo 5', error: 'GE-CON12', siFuera: 'Seguiría en 5 si el ángulo en C siguiera recto. Dentro del círculo, C se acerca a M.' },
        { id: 'larga', texto: 'Más larga que 5', error: 'GE-CON12', siFuera: 'Sería más larga si C saliera del círculo: ahí el ángulo queda agudo.' },
      ],
      dibujo: { datos: semi(0, { C: [1.5, 2.5], sinCM: true, alt: 'C dentro del semicírculo de diámetro AB = 10: el ángulo en C es obtuso' }), estado: {} },
      revelar: { datos: semi(0, { C: [1.5, 2.5], alt: 'C dentro del semicírculo: el ángulo en C es obtuso y la mediana CM mide 2,9' }), estado: {} },
      coincide: 'Coincide: dentro del círculo, CM queda menor que la mitad de AB.',
    },
    mira: {
      datos: semi(60, { pasos: { D: 1, circ: 3 } }),
      voz: 'Completa el rectángulo: la prueba sale de sus diagonales.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Completamos el rectángulo ACBD con el ángulo recto en C.', ecuacion: ['ACBD rectángulo'] },
        { estado: { corte: 2 }, texto: 'Sus diagonales son iguales y se cortan en su punto medio M.', ecuacion: ['CD = AB · M punto medio de ambas'] },
        { estado: { corte: 3 }, texto: 'Por eso MC = MA = MB: C está en la circunferencia de diámetro AB.', ecuacion: [{ v: 'c-h', t: 'CM' }, ' = ', { frac: ['AB', '2'] }, ' = 5'] },
      ],
    },
    regla: {
      texto: 'En un triángulo rectángulo, la mediana relativa a la hipotenusa mide la mitad de la hipotenusa.',
      ecuacion: [{ v: 'c-h', t: 'CM' }, ' = ', { frac: ['AB', '2'] }, ' = MA = MB'],
      condicion: 'el ángulo en C es recto. Y al revés: si CM es la mitad de AB, el ángulo en C es recto.',
      voz: 'Sin ángulo recto, la igualdad se pierde. Verifícalo siempre.',
    },
    ahoraTu: {
      voz: 'MC = MB forma un triángulo isósceles. Úsalo.',
      generar(s) {
        const r = azar(s), a = 5 * r.ent(4, 14), pide = s % 2;
        const fi = 2 * a; // con M en el origen, ∠A = a cuando C = polar(5, 180 − 2a)… se dibuja C con ∠CAB = a
        const C = U.polar([0, 0], 5, 180 - fi);
        const d = semi(0, { C, sinCM: true, circulo: false, sinAB: true, alt: `Triángulo rectángulo en C con ∠A = ${a}° y la mediana CM` });
        d.angulos = [{ en: 'C', de: 'A', a: 'B', color: 'o' }, { en: 'A', de: 'B', a: 'C', color: 'i', texto: `${a}°` }];
        const bien = pide ? 90 - a : a;
        return {
          pregunta: [`En el triángulo ABC, recto en C, M es el punto medio de la hipotenusa AB y ∠A = ${a}°. ¿Cuánto mide ${pide ? '∠MCB' : '∠MCA'}?`],
          dibujo: { datos: d, estado: {} },
          opciones: opciones(bien, [
            { id: 'otro', valor: pide ? a : 90 - a, error: 'GE-CON13', siFuera: pide ? 'Ese es ∠MCA, el que copia a A. ∠MCB copia a B.' : 'Ese es ∠MCB, el que copia a B. ∠MCA copia a A.' },
            { id: 'doble', valor: 2 * (pide ? 90 - a : a), error: 'GE-CON13', siFuera: 'El doble sería el ángulo en M, no en C.' },
            { id: 'recto', valor: 90, error: 'GE-CON12', siFuera: '90° es todo el ángulo C; la mediana lo parte en dos.' },
          ], gr),
          solucion: { texto: pide ? 'MC = MB: el triángulo MCB es isósceles y copia ∠B.' : 'MC = MA: el triángulo MCA es isósceles y copia ∠A.', ecuacion: pide ? [`∠MCB = ∠B = 90° − ${a}° = ${90 - a}°`] : [`∠MCA = ∠A = ${a}°`] },
        };
      },
    },
  };

  // ---------- Idea 5: triángulos rectángulos notables ----------
  // Cambia: el tipo y la escala k · Permanece: el ángulo recto · Progresa: los tres lados como múltiplos de k ·
  // Se reserva: el 45° visto como medio cuadrado · Debe verse: los lados salen de un cuadrado o de un equilátero partido.
  const rd = (k, m) => (m === 1 ? f(k, 2) : `${k === 1 ? '' : f(k, 2)}√${m}`);
  const notable = (tipo, k, o = {}) => {
    const datos = {
      '30-60': { ang: [30, 60], cat: [k * Math.sqrt(3), k], txt: [rd(k, 3), rd(k, 1), rd(2 * k, 1)] },
      '45-45': { ang: [45, 45], cat: [k, k], txt: [rd(k, 1), rd(k, 1), rd(k, 2)] },
      '37-53': { ang: [37, 53], cat: [4 * k, 3 * k], txt: [rd(4 * k, 1), rd(3 * k, 1), rd(5 * k, 1)] },
    }[tipo];
    const [cx, cy] = datos.cat, k2 = o.pasos || {};
    if (o.txt) datos.txt = o.txt;
    const ext = tipo === '45-45' ? [{ id: 'Q', x: cx, y: cy, sinPunto: true }] : tipo === '30-60' ? [{ id: 'Q', x: 0, y: -cy, rotulo: "C'", lado: -90, desde: k2.copia || 0 }] : [];
    return {
      alt: o.alt || `Triángulo rectángulo ${tipo.replace('-', '°-')}°: catetos ${datos.txt[0]} y ${datos.txt[1]}, hipotenusa ${datos.txt[2]}`,
      vista: tipo === '30-60' && o.copia ? { x: [-1.2, cx + 1.4], y: [-cy - 0.8, cy + 0.9] } : { x: [-1.2, Math.max(cx, cy) + 1.4], y: [-0.8, Math.max(cx, cy) + 0.9] },
      puntos: [{ id: 'A', x: cx, y: 0, rotulo: 'A', lado: -45 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -135 }, { id: 'C', x: 0, y: cy, rotulo: 'C', lado: 135 }, ...(o.copia ? ext : [])],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 },
        ...(o.copia && tipo === '45-45' ? [{ puntos: ['A', 'Q', 'C'], color: 'd', opacidad: 0.08, discontinua: true, desde: k2.copia || 0 }] : []),
        ...(o.copia && tipo === '30-60' ? [{ puntos: ['A', 'B', 'Q'], color: 'd', opacidad: 0.08, discontinua: true, desde: k2.copia || 0 }] : [])],
      segmentos: [{ de: 'B', a: 'A', color: 'o', texto: o.sin === 0 ? undefined : datos.txt[0] }, { de: 'B', a: 'C', color: 'i', texto: o.sin === 1 ? undefined : datos.txt[1] },
        { de: 'C', a: 'A', color: 'h', grosor: 'variable', texto: o.sin === 2 ? undefined : datos.txt[2] },
        ...(o.copia && tipo === '45-45' ? [{ de: 'C', a: 'Q', discontinua: true, desde: k2.copia || 0 }, { de: 'Q', a: 'A', discontinua: true, desde: k2.copia || 0 }] : []),
        ...(o.copia && tipo === '30-60' ? [{ de: 'A', a: 'Q', discontinua: true, desde: k2.copia || 0 }, { de: 'B', a: 'Q', discontinua: true, desde: k2.copia || 0 }] : [])],
      angulos: [{ en: 'B', de: 'A', a: 'C' }, { en: 'A', de: 'C', a: 'B', color: 'd', texto: `${datos.ang[0]}°` }, { en: 'C', de: 'B', a: 'A', color: 'd', texto: `${datos.ang[1]}°`, radio: 22 }],
    };
  };
  const notables = {
    id: 'notables',
    titulo: 'Los rectángulos notables',
    temas: ['Triángulos rectángulos notables'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Elige un triángulo rectángulo notable y cambia su tamaño k. Mira qué múltiplo de k es cada lado.',
      voz: 'Cambia k. La razón entre los lados permanece.',
      controles: [
        { id: 'tipo', etiqueta: 'Ángulos', opciones: [{ valor: '30-60', texto: '30° y 60°' }, { valor: '37-53', texto: '37° y 53°' }] },
        { id: 'k', etiqueta: 'k', min: 1, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: notable(v.tipo, v.k), estado: {} }),
      lectura: v => (v.tipo === '30-60' ? ['lados: k, k√3 y 2k con k = ', `${v.k}`] : ['lados: 3k, 4k y 5k con k = ', `${v.k}`]),
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora un triángulo de 45° y 45° con hipotenusa 10. ¿Cuánto mide cada cateto?',
      voz: 'Es un tipo nuevo. Piensa qué figura lo contiene.',
      opciones: [
        { id: 'c', texto: '5√2', correcta: true },
        { id: 'mitad', texto: '5', error: 'GE-CON14', siFuera: 'La mitad de la hipotenusa es el cateto opuesto a 30°. Con 45° no es la mitad.' },
        { id: 'raiz3', texto: '5√3', error: 'GE-CON14', siFuera: '5√3 corresponde al triángulo de 30° y 60° con hipotenusa 10.' },
        { id: 'diez', texto: '10√2', error: 'GE-CON15', siFuera: '10√2 sería la hipotenusa si los catetos midieran 10. Aquí es al revés.' },
      ],
      dibujo: { datos: notable('45-45', 5 * Math.SQRT2, { txt: ['', '', '10'], alt: 'Triángulo de 45° y 45° con hipotenusa 10 y catetos por hallar' }), estado: {} },
      revelar: { datos: notable('45-45', 5 * Math.SQRT2, { txt: ['5√2', '5√2', '10'], alt: 'Triángulo de 45° y 45°: catetos 5√2 y hipotenusa 10' }), estado: {} },
      coincide: 'Coincide: hipotenusa = cateto · √2, así que cada cateto mide 10 ÷ √2 = 5√2.',
    },
    mira: {
      datos: notable('45-45', 4, { copia: true, txt: ['k', 'k', 'k√2'], pasos: { copia: 1 }, alt: 'El triángulo de 45° es medio cuadrado de lado k: su hipotenusa es la diagonal k√2' }),
      voz: 'Copia el triángulo: aparece un cuadrado.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Dos copias del triángulo de 45° forman un cuadrado de lado k.', ecuacion: ['cuadrado de lado k'] },
        { estado: { corte: 1 }, texto: 'La hipotenusa es la diagonal: por Pitágoras, k√2.', ecuacion: [{ v: 'c-h', t: 'h' }, ' = ', { raiz: ['k² + k²'] }, ' = k√2'] },
        { estado: { corte: 1 }, texto: 'Con hipotenusa 10: k = 10 ÷ √2 = 5√2.', ecuacion: ['k = ', { frac: ['10', '√2'] }, ' = 5√2'] },
      ],
    },
    regla: {
      texto: '30° y 60°: lados k, k√3 y 2k (medio equilátero). 45° y 45°: k, k y k√2 (medio cuadrado). 37° y 53°: 3k, 4k y 5k.',
      condicion: 'el triángulo es rectángulo. El de 37° y 53° es aproximado: tan 37° no es exactamente 3/4.',
      voz: 'Reconoce el notable por sus ángulos, no por su posición.',
    },
    ahoraTu: {
      voz: 'Identifica el notable y el lado que te dan.',
      generar(s) {
        const r = azar(s), tipo = ['30-60', '45-45', '37-53'][s % 3], k = r.ent(2, 6), cual = r.ent(0, 2);
        const L = {
          '30-60': [[k, 3], [k, 1], [2 * k, 1]],
          '45-45': [[k, 1], [k, 1], [k, 2]],
          '37-53': [[4 * k, 1], [3 * k, 1], [5 * k, 1]],
        }[tipo];
        const dado = (cual + 1) % 3, pide = cual;
        const nombreLado = ['el cateto AB', 'el cateto BC', 'la hipotenusa AC'];
        const d = notable(tipo, k, { sin: pide });
        d.segmentos.forEach((sg, i) => { if (i !== dado && i !== pide && i < 3) sg.texto = undefined; });
        if (tipo === '45-45') { /* los catetos iguales: si se pide uno, el otro también se oculta */ }
        const txt = ([a, m]) => rd(a, m);
        const malos = [];
        for (const [a, m] of [[k, 1], [k, 2], [k, 3], [2 * k, 1], [3 * k, 1], [4 * k, 1], [5 * k, 1]]) if (txt([a, m]) !== txt(L[pide])) malos.push(txt([a, m]));
        const elegidos = [...new Set(malos)].slice(0, 6).filter((_, i) => i % 2 === s % 2 || i < 1).slice(0, 3);
        return {
          pregunta: [`En el triángulo rectángulo de la figura, ${nombreLado[dado]} mide ${txt(L[dado])}. ¿Cuánto mide ${nombreLado[pide]}?`],
          dibujo: { datos: d, estado: {} },
          opciones: [{ id: 'c', texto: txt(L[pide]), correcta: true }].concat(elegidos.map((t, i) => ({ id: `d${i}`, texto: t, error: 'GE-CON14', siFuera: `${t} corresponde a otro lado o a otro notable. Ubica el lado frente a cada ángulo.` }))),
          solucion: { texto: `Es el notable de ${tipo.replace('-', '° y ')}°: escribe los tres lados con k = ${k}.`, ecuacion: [`${txt(L[0])}, ${txt(L[1])} y ${txt(L[2])}`] },
        };
      },
    },
  };

  return {
    unidad: 'geometria.congruencia',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'La proposición I.4 de los Elementos justifica el criterio lado, ángulo, lado superponiendo un triángulo sobre otro. Los comentarios modernos señalan que el texto no había declarado axiomas para ese movimiento. La pregunta sigue viva: qué datos garantizan una única forma y por qué el movimiento conserva lo necesario.',
      pregunta: '¿Qué datos bastan para que no haya dos triángulos distintos?',
      fuente: { titulo: 'Euclides, Elementos I.4 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/propI4.html' },
    },
    ideas: [criterios, lugares, baseMedia, medianaHip, notables],
  };
});
