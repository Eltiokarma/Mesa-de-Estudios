/*
 * Teoría de «Triángulos y líneas notables» (geometria.triangulos). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 2); Elementos I.20 (desigualdad) y I.32 (suma de ángulos).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: justificar la suma de 180°, el ángulo exterior y la desigualdad triangular, y reconocer cada línea notable
 *     por su condición (perpendicular, punto medio, ángulos iguales), no por su aspecto.
 *   Persona y condiciones: postulante de 3.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: calcula ángulos interiores y exteriores, el rango del tercer lado, ubica la altura del
 *     obtusángulo y usa ∠BIC = 90° + A/2.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿por qué siempre 180°?» y «¿cuál línea es cuál?».
 *
 * Colores: A naranja (c-o), B turquesa (c-i), C verde (c-d), lo que se pide rojo (c-h). En líneas notables:
 * altura rojo, mediana turquesa, bisectriz naranja, mediatriz verde (las mismas en toda la idea).
 * Códigos: GE7 y GE8 (docs/investigacion/geometria-ideas-erroneas.md); GE-TRI, GE-DT y GE-BIS son hipótesis nuevas.
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
  const cA = { v: 'c-o', t: 'A' }, cB = { v: 'c-i', t: 'B' }, cC = { v: 'c-d', t: 'C' };
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
  // Triángulo con base BC horizontal y ángulos dados en B y C (en grados); devuelve los tres vértices.
  const porAngulos = (b, c, base = 6) => {
    const A = U.corte([0, 0], U.polar([0, 0], 1, b), [base, 0], U.polar([base, 0], 1, 180 - c));
    return { A, B: [0, 0], C: [base, 0] };
  };
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura; aPlano la vuelve coordenadas del
  // problema y el lector ajusta cada valor al paso y al rango de su control.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, pt) => G.aPlano(datos, pt);
  const nombreAng = (a, b, c) => { const m = Math.max(a, b, c); return Math.abs(m - 90) < 0.5 ? 'rectángulo' : m > 90 ? 'obtusángulo' : 'acutángulo'; };
  const nombreLad = (x, y, z) => { const e = (p, q) => Math.abs(p - q) < 0.05; return e(x, y) && e(y, z) ? 'equilátero' : e(x, y) || e(y, z) || e(x, z) ? 'isósceles' : 'escaleno'; };

  // ---------- Idea 1: la suma es 180° y el exterior suma los dos lejanos ----------
  // Cambia: la posición de A · Permanece: la base BC · Progresa: los tres ángulos y la clase ·
  // Se reserva: la paralela por A (en «Mira») · Debe verse: los tres ángulos caben en una recta.
  const triA = (ax, ay, o = {}) => {
    const A = [ax, ay], B = [0, 0], C = [6, 0];
    const a = U.angulo(A, B, C), b = U.angulo(B, A, C), c = U.angulo(C, A, B);
    const k = o.paso || 0, par = o.paralela;
    return {
      alt: `Triángulo de ángulos A = ${f(a, 0)}°, B = ${f(b, 0)}° y C = ${f(c, 0)}°${o.exterior ? `; el exterior en C mide ${f(a + b, 0)}°` : ''}`,
      vista: { x: [-2, 9], y: [-0.8, 6.4] },
      puntos: [{ id: 'A', x: ax, y: ay, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: 6, y: 0, rotulo: 'C', lado: -90 },
        { id: 'Cx', x: 8.6, y: 0, sinPunto: true }, { id: 'Pi', x: ax - 3, y: ay, sinPunto: true }, { id: 'Pd', x: ax + 3, y: ay, sinPunto: true }],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' },
        ...(o.exterior ? [{ de: 'C', a: 'Cx', discontinua: true }] : []),
        ...(par ? [{ de: 'Pi', a: 'Pd', recta: true, discontinua: true, grosor: 'fino', paralela: 1, desde: k ? 1 : 0 }, { de: 'B', a: 'Cx', recta: true, grosor: 'fino', paralela: 1, desde: k ? 1 : 0 }] : [])],
      angulos: [
        { en: 'A', de: 'B', a: 'C', color: 'o', texto: o.sinA ? undefined : gr(Math.round(a)) },
        { en: 'B', de: 'C', a: 'A', color: 'i', texto: o.sinB ? undefined : gr(Math.round(b)) },
        ...(o.sinC ? [] : [{ en: 'C', de: 'A', a: 'B', color: 'd', texto: gr(Math.round(c)) }]),
        ...(par ? [{ en: 'A', de: 'Pi', a: 'B', color: 'i', radio: 34, texto: gr(Math.round(b)), desde: k ? 2 : 0 }, { en: 'A', de: 'C', a: 'Pd', color: 'd', radio: 34, texto: gr(Math.round(c)), desde: k ? 3 : 0 }] : []),
        ...(o.exterior ? [{ en: 'C', de: 'Cx', a: 'A', color: 'h', radio: 20, texto: o.extTexto, desde: o.extDesde || 0 }] : []),
      ],
    };
  };
  // Triángulo de la predicción: A = 50°, B = 70° (exterior en C = 120°).
  const PA = porAngulos(70, 60).A;
  const suma = {
    id: 'suma-de-angulos',
    titulo: 'Tres ángulos caben en una recta',
    temas: ['Suma de ángulos internos y ángulo externo', 'Clasificación'],
    pieza: 'geo-figura',
    // Lee (fase 2): contexto y vocabulario. No dice cuánto mide el exterior: eso lo decide el alumno en Predice.
    lee: {
      tarjetas: [
        { titulo: 'Triángulos en el techo', texto: 'Las vigas que sostienen un techo de calamina en Juliaca suelen formar triángulos. Si sus tres lados no cambian, el triángulo no se deforma. Por eso los carpinteros lo usan tanto.' },
        { titulo: 'Adentro y afuera', texto: 'Cada vértice tiene un ángulo interior, entre sus dos lados. Si prolongas un lado más allá del vértice, aparece un ángulo exterior, por fuera de la figura.' },
        { titulo: 'Dos maneras de nombrarlo', texto: 'Por sus ángulos, un triángulo es acutángulo, rectángulo u obtusángulo. Por sus lados, es escaleno, isósceles o equilátero. La lectura del juego te dice cuál tienes.' },
        { titulo: 'Qué mirar', texto: 'Mueve A muy lejos y muy cerca de la base. Anota los tres ángulos de dos triángulos bien distintos y compara lo que suman.' },
      ],
    },
    juega: {
      consigna: 'Mueve el vértice A con la base BC fija. Mira los tres ángulos, su suma y cómo se llama el triángulo.',
      voz: 'Estira el triángulo. Busca qué permanece igual.',
      controles: [
        { id: 'ax', etiqueta: 'A a lo ancho', min: -1, max: 7, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'ay', etiqueta: 'A a lo alto', min: 1, max: 5, paso: 1, inicio: 4, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: triA(v.ax, v.ay), estado: {} }),
      // Se agarra el vértice A: la base BC no se mueve.
      arrastres: [{ id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o',
        donde: v => enPantalla(triA(v.ax, v.ay), [v.ax, v.ay]),
        mover: (pt, v) => { const q = alPlano(triA(v.ax, v.ay), pt); return { ax: q[0], ay: q[1] }; } }],
      lectura: v => {
        const A = [v.ax, v.ay], a = U.angulo(A, [0, 0], [6, 0]), b = U.angulo([0, 0], A, [6, 0]), c = 180 - a - b;
        return [cA, ' + ', cB, ' + ', cC, ` = 180° · ${nombreAng(a, b, c)} ${nombreLad(U.dist(A, [0, 0]), U.dist(A, [6, 0]), 6)}`];
      },
      minimo: 4,
    },
    predice: {
      pregunta: ['En el triángulo, ', cA, ' = 50° y ', cB, ' = 70°. Prolongamos el lado BC más allá de C. ¿Cuánto mide el ángulo exterior en C?'],
      voz: 'Piensa en el ángulo de afuera antes de verlo.',
      opciones: [
        { id: 'c', texto: '120°', correcta: true },
        { id: 'interior', texto: '60°', error: 'GE-TRI1', siFuera: '60° es el ángulo interior en C. El exterior es su vecino en la recta.' },
        { id: 'llano', texto: '180°', error: 'GE-TRI2', siFuera: '180° mide toda la recta prolongada. El exterior es solo la parte de afuera.' },
        { id: 'suma3', texto: '110°', error: 'GE-TRI3', siFuera: '110° vendría de restar 70° de 180°: sería el exterior en B, no en C.' },
      ],
      dibujo: { datos: triA(PA[0], PA[1], { exterior: true, sinC: true }), estado: {} },
      revelar: { datos: triA(PA[0], PA[1], { exterior: true, extTexto: '120°' }), estado: {} },
      coincide: ['Coincide: el exterior en C mide ', cA, ' + ', cB, ' = 120°.'],
    },
    mira: {
      datos: Object.assign(triA(PA[0], PA[1], { paralela: true, paso: true, exterior: true, extTexto: '120°', extDesde: 4 }), { alt: 'Por A pasa una paralela a BC: los ángulos B y C se copian arriba y los tres llenan una recta' }),
      voz: 'Una paralela por A ordena los tres ángulos en una recta.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Por A trazamos una paralela a BC.', ecuacion: ['paralela por A'] },
        { estado: { corte: 2 }, texto: 'A la izquierda aparece un alterno interno de B.', ecuacion: [cB, ' = 70°'] },
        { estado: { corte: 3 }, texto: 'A la derecha, un alterno interno de C.', ecuacion: [cC, ' = 60°'] },
        { estado: { corte: 3 }, texto: 'Los tres ángulos en A llenan la recta.', ecuacion: [cA, ' + ', cB, ' + ', cC, ' = 180°'] },
        { estado: { corte: 4 }, texto: 'El exterior en C completa 180° con C: vale A + B.', ecuacion: ['exterior en C = 180° − ', cC, ' = ', cA, ' + ', cB, ' = 120°'] },
      ],
    },
    regla: {
      texto: 'En todo triángulo los tres ángulos interiores suman 180°. Un ángulo exterior es igual a la suma de los dos interiores que no están a su lado.',
      ecuacion: [cA, ' + ', cB, ' + ', cC, ' = 180°   ·   exterior en C = ', { llave: [cA, ' + ', cB], nota: 'los dos lejanos', color: 'c-h' }],
      condicion: 'el triángulo está en un plano. Por ángulos es acutángulo, rectángulo u obtusángulo; por lados, escaleno, isósceles o equilátero.',
      voz: 'La paralela es la condición que garantiza los 180°.',
    },
    // Así se resuelve (fase 2): el mismo problema de «Ahora tú» (mismas cuentas y figura), con otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), a = 5 * r.ent(6, 16), b = 5 * r.ent(6, 16), c = 180 - a - b, pideExt = s % 2 === 0;
        const t = porAngulos(b, c), ext = a + b;
        const fig = sol => ({ datos: triA(t.A[0], t.A[1], { exterior: true, sinC: true, extTexto: sol ? `${ext}°` : (pideExt ? '?' : `${ext}°`), sinB: !pideExt && !sol }), estado: {} });
        return {
          enunciado: pideExt ? ['En el triángulo ABC, ', cA, ` = ${a}° y `, cB, ` = ${b}°. ¿Cuánto mide el ángulo exterior en C?`]
            : ['En el triángulo ABC, ', cA, ` = ${a}° y el exterior en C mide ${ext}°. ¿Cuánto mide el ángulo `, cB, '?'],
          dibujo: fig(false),
          pasos: [
            { tipo: 'pide', texto: pideExt ? 'Piden el ángulo exterior en C: el de afuera, entre el lado CA y la prolongación de BC.' : ['Piden el ángulo interior ', cB, '.'] },
            { tipo: 'datos', texto: pideExt ? ['Tengo dos interiores: ', cA, ` = ${a}° y `, cB, ` = ${b}°.`] : ['Tengo ', cA, ` = ${a}° y el exterior en C, que mide ${ext}°.`] },
            { tipo: 'regla', texto: 'El exterior en C vale lo mismo que los dos interiores que no lo tocan, A y B, sumados.',
              ecuacion: ['exterior en C = ', cA, ' + ', cB] },
            pideExt ? { tipo: 'cuentas', texto: 'Sumo los dos interiores lejanos.', ecuacion: [`exterior en C = ${a}° + ${b}° = ${ext}°`], dibujo: fig(true) }
              : { tipo: 'cuentas', texto: ['Al exterior le quito ', cA, ' y queda ', cB, '.'], ecuacion: [cB, ` = ${ext}° − ${a}° = ${b}°`], dibujo: fig(true) },
            { tipo: 'sentido', texto: `Compruebo con los 180°: el interior en C es 180° − ${ext}° = ${c}°, y ${a}° + ${b}° + ${c}° = 180°. Cuadra.` },
          ],
          respuesta: pideExt ? `El exterior en C mide ${ext}°.` : ['El ángulo ', cB, ` mide ${b}°.`],
        };
      },
    },
    ahoraTu: {
      voz: 'Ubica cuál es interior y cuál exterior antes de operar.',
      generar(s) {
        const r = azar(s), a = 5 * r.ent(6, 16), b = 5 * r.ent(6, 16), c = 180 - a - b, pideExt = s % 2 === 0;
        const t = porAngulos(b, c);
        const fig = sol => ({ datos: triA(t.A[0], t.A[1], { exterior: true, sinC: true, extTexto: sol ? `${a + b}°` : (pideExt ? '?' : `${a + b}°`), sinB: !pideExt && !sol }), estado: {} });
        const datos = pideExt ? [`A = ${a}° y B = ${b}°`, 'el ángulo exterior en C'] : [`A = ${a}° y el exterior en C mide ${a + b}°`, 'el ángulo B'];
        const bien = pideExt ? a + b : b;
        return {
          pregunta: [`En el triángulo ABC, ${datos[0]}. ¿Cuánto mide ${datos[1]}?`],
          dibujo: fig(false),
          opciones: opciones(bien, pideExt ? [
            { id: 'interior', valor: c, error: 'GE-TRI1', siFuera: `${c}° es el ángulo interior en C; el exterior es su vecino.` },
            { id: 'otro-ext', valor: 180 - b, error: 'GE-TRI3', siFuera: `${180 - b}° es el exterior en B, no en C.` },
            { id: 'resta', valor: Math.abs(a - b), error: 'GE-TRI2', siFuera: 'Restar A y B no da un ángulo de la figura; el exterior los suma.' },
          ] : [
            { id: 'suma', valor: a + (a + b), error: 'GE-TRI2', siFuera: 'Sumar todo serviría si B fuera el exterior; B es una de sus partes.' },
            { id: 'int-c', valor: c, error: 'GE-TRI1', siFuera: `${c}° es el interior en C. B sale del exterior menos A.` },
            { id: 'supl', valor: 180 - (a + b), error: 'GE-TRI3', siFuera: 'Eso es el interior en C. Para B, resta A del exterior.' },
          ], gr),
          solucion: { texto: 'El exterior en C suma los interiores A y B.', ecuacion: pideExt ? [`exterior = ${a}° + ${b}° = ${a + b}°`] : [cB, ` = ${a + b}° − ${a}° = ${b}°`], dibujo: fig(true) },
        };
      },
    },
  };

  // ---------- Idea 2: desigualdad triangular ----------
  // Cambia: el ángulo entre los lados de 5 y 8 · Permanece: esos dos lados · Progresa: el largo del tercer lado ·
  // Se reserva: los dos extremos aplastados (3 y 13) · Debe verse: en los extremos no hay triángulo, solo un segmento.
  const bisagra = (g, o = {}) => {
    const B = [0, 0], C = [8, 0], A = U.polar(B, 5, g);
    const x = U.dist(A, C);
    return {
      alt: o.alt || `Lados de 5 y 8 con ángulo de ${g}° entre ellos: el tercer lado mide ${f(x)}`,
      vista: { x: [-5.6, 8.6], y: [-0.8, 5.4] },
      puntos: [{ id: 'B', x: 0, y: 0, rotulo: 'B', lado: -90 }, { id: 'C', x: 8, y: 0, rotulo: 'C', lado: -90 }, { id: 'A', x: A[0], y: A[1], rotulo: 'A', color: 'o', lado: 90 },
        ...(o.extremos ? [{ id: 'A0', x: 5, y: 0, color: 'h', rotulo: 'x = 3', lado: -90, desde: o.extremos[0] }, { id: 'A1', x: -5, y: 0, color: 'h', rotulo: 'x = 13', lado: -90, desde: o.extremos[1] }] : [])],
      segmentos: [{ de: 'B', a: 'C', texto: '8', grosor: 'variable', color: 'i' }, { de: 'B', a: 'A', texto: '5', grosor: 'variable', color: 'o' },
        { de: 'A', a: 'C', color: 'h', texto: o.sinX ? 'x' : `x ≈ ${f(x)}` },
        ...(o.extremos ? [{ de: 'A1', a: 'C', color: 'h', discontinua: true, desde: o.extremos[1] }] : [])],
    };
  };
  // La bisagra de «Así se resuelve»: lados m ≤ M que se dan, ángulo de 70° en B; con extremos, los dos casos aplastados.
  const bisagraPQ = (m, M, o = {}) => {
    const A = U.polar([0, 0], m, 70), lo = M - m, hi = M + m;
    return {
      alt: o.extremos ? `Lados de ${m} y ${M}: cerrada, x mide ${lo}; abierta del todo, ${hi}. En los dos casos queda un segmento`
        : `Dos lados de ${m} y ${M} unidos en B; el tercer lado x está entre las puntas`,
      vista: { x: [-m - 1, M + 1], y: [-1, m + 1] },
      puntos: [{ id: 'B', x: 0, y: 0, rotulo: 'B', lado: -90 }, { id: 'C', x: M, y: 0, rotulo: 'C', lado: -90 }, { id: 'A', x: A[0], y: A[1], rotulo: 'A', color: 'o', lado: 90 },
        ...(o.extremos && lo > 0 ? [{ id: 'A0', x: m, y: 0, color: 'h', rotulo: `x = ${lo}`, lado: 90 }] : []),
        ...(o.extremos ? [{ id: 'A1', x: -m, y: 0, color: 'h', rotulo: `x = ${hi}`, lado: -90 }] : [])],
      segmentos: [{ de: 'B', a: 'C', texto: String(M), grosor: 'variable', color: 'i' }, { de: 'B', a: 'A', texto: String(m), grosor: 'variable', color: 'o' },
        { de: 'A', a: 'C', color: 'h', texto: 'x' },
        ...(o.extremos ? [{ de: 'A1', a: 'C', color: 'h', discontinua: true }] : [])],
    };
  };
  const desigualdad = {
    id: 'desigualdad',
    titulo: 'El tercer lado tiene límites',
    temas: ['Desigualdad triangular'],
    pieza: 'geo-figura',
    // Lee (fase 2): contexto y qué mirar. No da los límites ni dice qué pasa en ellos: eso es la predicción.
    lee: {
      tarjetas: [
        { titulo: 'Tres palitos', texto: 'Corta tres palitos de distinto largo y trata de armar un triángulo con ellos, punta con punta. Con algunos tríos la figura se cierra y con otros no. El juego te deja ver por qué.' },
        { titulo: 'La bisagra', texto: 'En el juego, los lados de 5 y 8 se unen en B, como las dos hojas de una bisagra. Al abrir el ángulo en B, cambia la distancia entre las puntas: ese es el tercer lado, x.' },
        { titulo: 'Qué mirar', texto: 'Abre y cierra la bisagra hasta los topes. Anota el x más corto y el más largo que ves, y fíjate en la forma de la figura cerca de esos topes.' },
      ],
    },
    juega: {
      consigna: 'Dos lados de 5 y 8 giran en B como bisagra. Abre y cierra el ángulo y mira cómo cambia el tercer lado x.',
      voz: 'Abre y cierra la bisagra. Fíjate en el x más corto y el más largo.',
      controles: [{ id: 'g', etiqueta: 'Ángulo en B', min: 15, max: 165, paso: 15, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: bisagra(v.g), estado: {} }),
      // Se agarra la punta A del lado de 5: gira alrededor de B, como la bisagra.
      arrastres: [{ id: 'punta-a', etiqueta: 'punta A de la bisagra', color: 'c-o',
        donde: v => enPantalla(bisagra(v.g), U.polar([0, 0], 5, v.g)),
        mover: (pt, v) => { const q = alPlano(bisagra(v.g), pt); return { g: U.grados(Math.atan2(q[1], q[0])) }; } }],
      lectura: v => [{ v: 'c-h', t: 'x' }, ` ≈ ${f(U.dist(U.polar([0, 0], 5, v.g), [8, 0]))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Si la bisagra pudiera cerrarse del todo o abrirse del todo, ¿entre qué valores puede estar x para que haya triángulo?',
      voz: 'Imagina los dos extremos. ¿Queda un triángulo ahí?',
      opciones: [
        { id: 'c', texto: 'Entre 3 y 13, sin llegar a ninguno', correcta: true },
        { id: 'cerrado', texto: 'De 3 a 13, incluidos', error: 'GE-DT3', siFuera: 'En 3 y en 13 los lados sí existen, pero quedan sobre una recta: es un segmento, no un triángulo.' },
        { id: 'solo-sup', texto: 'Cualquier valor menor que 13', error: 'GE-DT2', siFuera: 'El límite de 13 está bien. Si x es muy chico, 5 y x no alcanzan a cubrir 8.' },
        { id: 'suma', texto: 'Solo 13', error: 'GE-DT1', siFuera: 'Sumar 5 + 8 da el límite de arriba. x puede tomar todo un rango.' },
      ],
      dibujo: { datos: bisagra(60, { sinX: true }), estado: {} },
      revelar: { datos: bisagra(60, { extremos: [0, 0], sinX: true, alt: 'Cerrada, x mide 3; abierta del todo, 13: en ambos casos los lados quedan en una recta' }), estado: {} },
      coincide: 'Coincide: 8 − 5 < x < 8 + 5. En los extremos el triángulo se aplasta.',
    },
    mira: {
      datos: bisagra(60, { extremos: [1, 2], sinX: true, alt: 'La bisagra cerrada da x = 3 y abierta da x = 13; entre ambos hay triángulo' }),
      voz: 'Mira los dos extremos: ahí el triángulo desaparece.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cerrada del todo, A cae sobre BC: x = 8 − 5.', ecuacion: [{ v: 'c-h', t: 'x' }, ' = 3: segmento, sin triángulo'] },
        { estado: { corte: 2 }, texto: 'Abierta del todo, A queda al otro lado: x = 8 + 5.', ecuacion: [{ v: 'c-h', t: 'x' }, ' = 13: otro segmento'] },
        { estado: { corte: 2 }, texto: 'Cualquier abertura intermedia da triángulo.', ecuacion: ['8 − 5 < ', { v: 'c-h', t: 'x' }, ' < 8 + 5'] },
      ],
    },
    regla: {
      texto: 'Cada lado de un triángulo es menor que la suma de los otros dos y mayor que su diferencia.',
      ecuacion: [{ llave: [{ abs: ['a − b'] }], nota: 'la diferencia', color: 'c-i' }, ' < ', { v: 'c-h', t: 'x' }, ' < ', { llave: ['a + b'], nota: 'la suma', color: 'c-o' }],
      condicion: 'las desigualdades son estrictas: con igualdad, los tres puntos quedan alineados y no hay triángulo.',
      voz: 'Los extremos no cuentan: ahí la figura es un segmento.',
    },
    // Así se resuelve (fase 2): el conteo de enteros de «Ahora tú», con otras semillas y la bisagra de esos lados.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), p = r.ent(3, 12), q = r.ent(3, 12);
        const lo = Math.abs(p - q), hi = p + q, n = hi - lo - 1, m = Math.min(p, q), M = Math.max(p, q);
        const x = { v: 'c-h', t: 'x' };
        return {
          enunciado: [`Dos lados de un triángulo miden ${p} y ${q}. ¿Cuántos valores enteros puede tomar el tercer lado `, x, '?'],
          dibujo: { datos: bisagraPQ(m, M), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden cuántos números enteros puede valer el tercer lado ', x, '.'] },
            { tipo: 'datos', texto: `Los otros dos lados miden ${p} y ${q}. El ángulo entre ellos no lo dan: puede ser cualquiera.` },
            { tipo: 'regla', texto: ['El tercer lado es más largo que la resta de los otros dos y más corto que su suma. Los bordes no valen.'],
              ecuacion: [{ abs: ['a − b'] }, ' < ', x, ' < a + b'] },
            { tipo: 'cuentas', texto: 'Calculo los dos bordes y cuento los enteros que quedan entre ellos, sin los bordes.',
              ecuacion: [`${lo} < `, x, ` < ${hi}   →   de ${lo + 1} a ${hi - 1}: ${n} enteros`], dibujo: { datos: bisagraPQ(m, M, { extremos: true }), estado: {} } },
            { tipo: 'sentido', texto: `Si x valiera ${hi}, el triángulo se aplastaría en un segmento: ${p} + ${q} = ${hi}. Por eso ${hi} no entra${lo > 0 ? `, ni ${lo}` : ''}.` },
          ],
          respuesta: [x, ` puede tomar ${n} valores enteros.`],
        };
      },
    },
    ahoraTu: {
      voz: 'Primero los dos límites; después cuenta los enteros entre ellos.',
      generar(s) {
        const r = azar(s), p = r.ent(3, 12), q = r.ent(3, 12);
        const lo = Math.abs(p - q), hi = p + q, n = hi - lo - 1;
        return {
          pregunta: [`Dos lados de un triángulo miden ${p} y ${q}. ¿Cuántos valores enteros puede tomar el tercer lado `, { v: 'c-h', t: 'x' }, '?'],
          opciones: opciones(n, [
            { id: 'cerrado', valor: n + 2, error: 'GE-DT3', siFuera: `Contar ${lo} y ${hi} sería cierto si los extremos dieran triángulo; ahí los puntos quedan alineados.` },
            { id: 'solo-sup', valor: hi - 1, error: 'GE-DT2', siFuera: 'El límite de arriba está bien; también hay uno de abajo: la diferencia.' },
            { id: 'uno', valor: n + 1, error: 'GE-DT3', siFuera: 'Eso incluye uno de los extremos; ninguno de los dos da triángulo.' },
          ], n => `${f(n, 0)}`),
          solucion: { texto: `x va de más de ${lo} a menos de ${hi}.`, ecuacion: [`${lo} < `, { v: 'c-h', t: 'x' }, ` < ${hi} → ${n} enteros`] },
        };
      },
    },
  };

  // ---------- Idea 3: altura, mediana, bisectriz y mediatriz ----------
  // Cambia: la posición de A sobre BC · Permanece: la base BC · Progresa: dónde caen los pies de las tres cevianas ·
  // Se reserva: el obtusángulo (altura fuera) · Debe verse: cada línea se define por su condición, no por su aspecto.
  const notables = (ax, ay, o = {}) => {
    const A = [ax, ay], B = [0, 0], C = [6, 0];
    const H = [ax, 0], M = [3, 0];
    const c = U.dist(A, B), b = U.dist(A, C), D = [6 * c / (b + c), 0];
    const ve = o.ver || { h: 1, m: 1, b: 1 };
    const pasos = o.pasos || {};
    const P = [];
    if (ax < 0) P.push({ id: 'Bx', x: ax - 0.6, y: 0, sinPunto: true });
    return {
      alt: o.alt || `Desde A salen la altura (pie en x = ${f(ax)}), la mediana (al punto medio) y la bisectriz${ax < 0 ? '; la altura cae fuera, en la prolongación de CB' : ''}`,
      vista: { x: [-3, 7], y: [-1, 4.6] },
      puntos: [{ id: 'A', x: ax, y: ay, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: ax < 0 ? -60 : -120 }, { id: 'C', x: 6, y: 0, rotulo: 'C', lado: -60 },
        { id: 'H', x: H[0], y: 0, rotulo: ve.h ? 'H' : undefined, sinPunto: !ve.h, color: 'h', lado: -90, desde: pasos.h || 0 },
        { id: 'M', x: 3, y: 0, rotulo: ve.m ? 'M' : undefined, sinPunto: !ve.m, color: 'i', lado: -90, desde: pasos.m || 0 },
        { id: 'D', x: D[0], y: 0, rotulo: ve.b ? 'D' : undefined, sinPunto: !ve.b, color: 'o', lado: -90, desde: pasos.b || 0 },
        { id: 'Mz', x: 3, y: 4.2, sinPunto: true }, ...P],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C', marcas: 0 }, { de: 'C', a: 'A' },
        ...(ax < 0 && ve.h ? [{ de: 'B', a: 'H', discontinua: true, grosor: 'fino', desde: pasos.h || 0 }] : []),
        ...(ve.h ? [{ de: 'A', a: 'H', color: 'h', grosor: 'variable', desde: pasos.h || 0 }] : []),
        ...(ve.m ? [{ de: 'A', a: 'M', color: 'i', grosor: 'variable', desde: pasos.m || 0 }, { de: 'B', a: 'M', marcas: 1, color: 'i', desde: pasos.m || 0 }, { de: 'M', a: 'C', marcas: 1, color: 'i', desde: pasos.m || 0 }] : []),
        ...(ve.b ? [{ de: 'A', a: 'D', color: 'o', grosor: 'variable', desde: pasos.b || 0 }] : []),
        ...(ve.z ? [{ de: 'M', a: 'Mz', color: 'd', discontinua: true, desde: pasos.z || 0 }] : [])],
      angulos: [
        ...(ve.h ? [{ en: 'H', de: ax < 0 ? 'C' : 'C', a: 'A', color: 'h', desde: pasos.h || 0 }] : []),
        ...(ve.b ? [{ en: 'A', de: 'B', a: 'D', color: 'o', rayita: 1, radio: 30, desde: pasos.b || 0 }, { en: 'A', de: 'D', a: 'C', color: 'o', rayita: 1, radio: 30, desde: pasos.b || 0 }] : []),
        ...(ve.z ? [{ en: 'M', de: 'C', a: 'Mz', color: 'd', desde: pasos.z || 0 }] : []),
      ],
    };
  };
  const lineas = {
    id: 'lineas-notables',
    titulo: 'Cada línea, por su condición',
    temas: ['Líneas notables'],
    pieza: 'geo-figura',
    // Lee (fase 2): vocabulario y marcas. No dice dónde cae la altura en un obtusángulo: eso es la predicción.
    lee: {
      tarjetas: [
        { titulo: 'Cuatro líneas con nombre', texto: 'En un triángulo se trazan cuatro líneas especiales: la altura, la mediana, la bisectriz y la mediatriz. Se llaman líneas notables, y cada una cumple una condición distinta.' },
        { titulo: 'Las marcas', texto: 'En los dibujos de examen, dos rayitas iguales dicen «estos dos tramos miden lo mismo». Dos arcos iguales en un vértice dicen «estos ángulos son iguales». Un cuadradito marca un ángulo recto.' },
        { titulo: 'Qué mirar', texto: 'Mueve A de un lado a otro y sigue los tres pies sobre BC: el rojo de la altura, el turquesa de la mediana y el naranja de la bisectriz. Busca cuándo se juntan.' },
      ],
    },
    juega: {
      consigna: 'Desde A salen tres líneas: altura (roja), mediana (turquesa) y bisectriz (naranja). Mueve A y mira dónde cae cada pie.',
      voz: 'Mueve A. Busca cuándo las tres líneas coinciden.',
      controles: [{ id: 'ax', etiqueta: 'A a lo ancho', min: 1, max: 5, paso: 0.5, inicio: 1.5, unidad: '', decimales: 1 }],
      dibujo: v => ({ datos: notables(v.ax, 3.6), estado: {} }),
      // Se agarra A, que corre en una paralela a BC: la altura del triángulo no cambia.
      arrastres: [{ id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o',
        donde: v => enPantalla(notables(v.ax, 3.6), [v.ax, 3.6]),
        mover: (pt, v) => ({ ax: alPlano(notables(v.ax, 3.6), pt)[0] }) }],
      lectura: v => [`Pies: H en ${f(v.ax)}   ·   M en 3   ·   D en ${f(6 * U.dist([v.ax, 3.6], [0, 0]) / (U.dist([v.ax, 3.6], [0, 0]) + U.dist([v.ax, 3.6], [6, 0])))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora A se corre a la izquierda de B: el ángulo B queda obtuso. ¿Dónde cae el pie de la altura trazada desde A?',
      voz: 'Recuerda qué exige una altura. Luego decide.',
      opciones: [
        { id: 'c', texto: 'Fuera del triángulo, en la prolongación de CB', correcta: true },
        { id: 'medio', texto: 'En el punto medio de BC', error: 'GE8', siFuera: 'El punto medio es el pie de la mediana. La altura busca el ángulo recto.' },
        { id: 'dentro', texto: 'Dentro de BC, aunque quede inclinada', error: 'GE7', siFuera: 'Dentro caería si B y C fueran agudos. La altura debe formar 90° con la recta BC.' },
        { id: 'en-b', texto: 'Justo en B: AB es la altura', error: 'GE7', siFuera: 'AB sería la altura si B midiera 90°. Aquí B es obtuso.' },
      ],
      dibujo: { datos: notables(-1.5, 3, { ver: {} }), estado: {} },
      revelar: { datos: notables(-1.5, 3, { ver: { h: 1 } }), estado: {} },
      coincide: 'Coincide: la altura llega perpendicular a la recta BC, fuera del lado.',
    },
    mira: {
      datos: notables(1.5, 3.6, { ver: { h: 1, m: 1, b: 1, z: 1 }, pasos: { h: 1, m: 2, b: 3, z: 4 }, alt: 'Altura, mediana y bisectriz desde A, y la mediatriz de BC: cuatro líneas distintas' }),
      voz: 'Una línea por paso. Cada una tiene su marca.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Altura: forma 90° con la recta BC.', ecuacion: ['AH ⟂ BC'] },
        { estado: { corte: 2 }, texto: 'Mediana: llega al punto medio de BC.', ecuacion: ['BM = MC'] },
        { estado: { corte: 3 }, texto: 'Bisectriz: parte el ángulo A en dos iguales.', ecuacion: ['∠BAD = ∠DAC'] },
        { estado: { corte: 4 }, texto: 'Mediatriz: perpendicular a BC en su punto medio; no pasa por A.', ecuacion: ['mediatriz ⟂ BC en M'] },
      ],
    },
    regla: {
      texto: 'Altura: perpendicular a la recta del lado opuesto. Mediana: llega a su punto medio. Bisectriz: parte el ángulo en dos iguales. Mediatriz: perpendicular en el punto medio.',
      condicion: 'cada altura llega a la recta de su lado: en el obtusángulo, dos caen fuera del triángulo.',
      voz: 'Nombra cada línea por su marca, no por cómo luce.',
    },
    // Así se resuelve (fase 2): reconocer la línea por su marca, como en «Ahora tú», con la misma figura y otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), ax = r.de([-1.5, -1, 0.5, 1, 1.5, 2, 4, 4.5, 5, 6.5]), ay = r.de([2.5, 3, 3.5, 4]);
        const tipos = ['h', 'm', 'b', 'z'], t = tipos[s % 4];
        const nom = { h: 'altura', m: 'mediana', b: 'bisectriz', z: 'mediatriz' };
        const d = notables(ax, ay, { ver: { [t]: 1 } });
        d.alt = `Triángulo con una línea marcada: ${t === 'h' ? 'forma 90° con la recta del lado opuesto' : t === 'm' ? 'llega al punto medio del lado opuesto' : t === 'b' ? 'parte el ángulo del vértice en dos iguales' : 'es perpendicular a un lado en su punto medio'}`;
        if (t === 'h' && ax < 0) d.puntos.find(p => p.id === 'B').lado = -60;
        const nombres = r.de(['ABC', 'PQR', 'RST', 'XYZ', 'JKL', 'UVW']);
        d.puntos.forEach(p => { const k = 'ABC'.indexOf(p.id); if (k >= 0 && p.id.length === 1) p.rotulo = nombres[k]; });
        const [V, P, Q] = nombres, lado = P + Q;
        const fuera = t === 'h' && (ax < 0 || ax > 6);
        const marca = { h: `un cuadradito de ángulo recto donde llega a la recta ${lado}`, m: 'una rayita igual a cada lado de su pie', b: `dos arcos iguales en el vértice ${V}`, z: `un cuadradito de ángulo recto en el punto medio de ${lado}` };
        const descarte = {
          h: `No llega al punto medio ni parte el ángulo en dos. Es la altura${fuera ? ', aunque su pie caiga fuera del lado' : ''}.`,
          m: 'No forma un ángulo recto ni parte el ángulo del vértice: solo llega al punto medio. Es la mediana.',
          b: 'Su pie no está en el punto medio ni forma 90°: solo reparte el ángulo. Es la bisectriz.',
          z: `Forma 90° como una altura, pero no sale de ${V}: nace en el punto medio de ${lado}. Es la mediatriz.`,
        }[t];
        return {
          enunciado: `En el triángulo ${nombres}, mira las marcas de la línea de color. ¿Qué línea notable es?`,
          dibujo: { datos: d, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el nombre de la línea de color: altura, mediana, bisectriz o mediatriz.' },
            { tipo: 'datos', texto: `En la figura, la línea tiene ${marca[t]}.` },
            { tipo: 'regla', texto: 'Cada línea notable se reconoce por su condición, no por su aspecto. Por eso busco su marca: ángulo recto, rayitas iguales o arcos iguales.' },
            { tipo: 'aplica', texto: `Esa marca dice que la línea ${t === 'h' ? `forma 90° con la recta ${lado}` : t === 'm' ? `llega al punto medio de ${lado}` : t === 'b' ? `parte el ángulo ${V} en dos iguales` : `es perpendicular a ${lado} en su punto medio`}.`,
              ecuacion: [t === 'h' ? `altura ⟂ ${lado}` : t === 'm' ? `pie en el punto medio de ${lado}` : t === 'b' ? `dos ángulos iguales en ${V}` : `mediatriz ⟂ ${lado} en su punto medio`] },
            { tipo: 'sentido', texto: descarte },
          ],
          respuesta: `Es la ${nom[t]}.`,
        };
      },
    },
    ahoraTu: {
      voz: 'Busca la marca: ángulo recto, rayitas o arcos iguales.',
      generar(s) {
        const r = azar(s), ax = r.de([-1.5, -1, 0.5, 1, 1.5, 2, 4, 4.5, 5, 6.5]), ay = r.de([2.5, 3, 3.5, 4]);
        const tipos = ['h', 'm', 'b', 'z'], t = tipos[s % 4];
        const nom = { h: 'altura', m: 'mediana', b: 'bisectriz', z: 'mediatriz' };
        const marca = { h: 'un ángulo recto con la recta del lado opuesto', m: 'rayitas iguales a cada lado del pie', b: 'dos arcos iguales en el vértice', z: 'un ángulo recto en el punto medio, sin pasar por el vértice' };
        const d = notables(ax, ay, { ver: { [t]: 1 } });
        d.alt = `Triángulo con una línea marcada: ${t === 'h' ? 'forma 90° con la recta del lado opuesto' : t === 'm' ? 'llega al punto medio del lado opuesto' : t === 'b' ? 'parte el ángulo del vértice en dos iguales' : 'es perpendicular a un lado en su punto medio'}`;
        if (t === 'h' && ax < 0) d.puntos.find(p => p.id === 'B').lado = -60;
        const nombres = r.de(['ABC', 'PQR', 'RST', 'XYZ', 'JKL', 'UVW']);
        d.puntos.forEach(p => { const k = 'ABC'.indexOf(p.id); if (k >= 0 && p.id.length === 1) p.rotulo = nombres[k]; });
        return {
          pregunta: `En el triángulo ${nombres}, mira las marcas de la línea de color que sale de ${nombres[0]}. ¿Qué línea notable es?`,
          dibujo: { datos: d, estado: {} },
          opciones: [{ id: 'c', texto: nom[t], correcta: true }].concat(tipos.filter(k => k !== t).map(k => ({ id: k, texto: nom[k], error: t === 'h' || k === 'h' ? 'GE7' : 'GE8', siFuera: `Sería ${nom[k]} si tuviera ${marca[k]}.` }))),
          solucion: { texto: `Su marca es ${t === 'h' ? 'el ángulo recto en el pie' : t === 'm' ? 'el punto medio del lado opuesto' : t === 'b' ? 'la de dos ángulos iguales en el vértice' : 'el ángulo recto en el punto medio'}.`, ecuacion: [nom[t]] },
        };
      },
    },
  };

  // ---------- Idea 4: ángulos formados por bisectrices ----------
  // Cambia: los ángulos B y C · Permanece: la base BC · Progresa: ∠BIC y ∠BEC frente a A ·
  // Se reserva: la bisectriz exterior en C · Debe verse: ∠BIC = 90° + A/2 y ∠BEC = A/2.
  const bis = (b, c, o = {}) => {
    const { A, B, C } = porAngulos(b, c, 6);
    const la = U.dist(B, C), lb = U.dist(A, C), lc = U.dist(A, B), s = la + lb + lc;
    const I = [(la * A[0] + lb * B[0] + lc * C[0]) / s, (la * A[1] + lb * B[1] + lc * C[1]) / s];
    const ext = U.polar(C, 1, (180 - c) / 2); // bisectriz exterior en C: entre CA y la prolongación de BC
    const E = U.corte(B, I, C, ext);
    const a = 180 - b - c, k = o.pasos || {};
    const conE = o.E && E && E[0] < 14;
    return {
      alt: o.alt || `Triángulo con A = ${a}°: las bisectrices interiores de B y C se cortan en I formando ${90 + a / 2}°${conE ? `; con la exterior en C forman ${a / 2}° en E` : ''}`,
      vista: o.E ? { x: [-0.6, 12], y: [-0.8, 6.8] } : { x: [-1.6, 7.6], y: [-0.6, 8.6] },
      puntos: [{ id: 'A', x: A[0], y: A[1], rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: 6, y: 0, rotulo: 'C', lado: -60 },
        { id: 'I', x: I[0], y: I[1], rotulo: 'I', color: 'h', lado: -90 }, { id: 'Cx', x: o.E ? 11.5 : 6.5, y: 0, sinPunto: true },
        ...(conE ? [{ id: 'E', x: E[0], y: E[1], rotulo: 'E', color: 'h', lado: 60, desde: k.E || 0 }] : [])],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' },
        { de: 'B', a: 'I', color: 'i', grosor: 'fino', desde: k.I || 0 }, ...(conE ? [{ de: 'I', a: 'E', color: 'i', grosor: 'fino', desde: k.E || 0 }] : []), { de: 'C', a: 'I', color: 'd', grosor: 'fino', desde: k.I || 0 },
        ...(o.E ? [{ de: 'C', a: 'Cx', discontinua: true, grosor: 'fino' }] : []),
        ...(conE ? [{ de: 'C', a: 'E', color: 'd', discontinua: true, desde: k.E || 0 }] : [])],
      angulos: [
        { en: 'A', de: 'B', a: 'C', color: 'o', texto: `${a}°` },
        { en: 'B', de: 'C', a: 'I', color: 'i', rayita: 1, radio: 28, desde: k.I || 0 }, { en: 'B', de: 'I', a: 'A', color: 'i', rayita: 1, radio: 28, desde: k.I || 0 },
        { en: 'C', de: 'I', a: 'B', color: 'd', rayita: 2, radio: 24, desde: k.I || 0 }, { en: 'C', de: 'A', a: 'I', color: 'd', rayita: 2, radio: 24, desde: k.I || 0 },
        { en: 'I', de: 'B', a: 'C', color: 'h', texto: o.sinBIC ? undefined : `${90 + a / 2}°`, radio: 20, desde: k.BIC || 0 },
        ...(conE ? [{ en: 'E', de: 'B', a: 'C', color: 'h', texto: o.sinE ? undefined : `${a / 2}°`, radio: 30, desde: k.E2 || k.E || 0 }, { en: 'C', de: 'I', a: 'E', color: 'h', desde: k.E || 0 }] : []),
      ],
    };
  };
  // El ángulo BIC medido en la figura, con el punto I que calcula bis() (no con la fórmula).
  const anguloBIC = v => { const P = bis(v.b, v.c).puntos, I = P.find(p => p.id === 'I'); return U.angulo([I.x, I.y], [0, 0], [6, 0]); };
  let BIC_MAX = 0;   // el mayor de la grilla del juego (B y C de 40° a 70°, de 10° en 10°)
  for (let b = 40; b <= 70; b += 10) for (let c = 40; c <= 70; c += 10) BIC_MAX = Math.max(BIC_MAX, anguloBIC({ b, c }));
  const bisectrices = {
    id: 'angulo-de-bisectrices',
    titulo: 'El ángulo entre dos bisectrices',
    temas: ['Ángulos formados por bisectrices'],
    pieza: 'geo-figura',
    // Lee (fase 2): qué es una bisectriz y cuál es la exterior. No dice cuánto mide ∠BEC: eso es la predicción.
    lee: {
      tarjetas: [
        { titulo: 'Partir a la mitad', texto: 'Una bisectriz parte un ángulo en dos iguales. Si recortas un triángulo de papel y lo doblas juntando dos lados, el doblez marca la bisectriz del ángulo entre ellos.' },
        { titulo: 'Dos bisectrices que se cruzan', texto: 'Si trazas la bisectriz de B y la de C, se cortan dentro del triángulo en un punto llamado I, el incentro. Entre ellas se forma el ángulo BIC.' },
        { titulo: 'Adentro y afuera', texto: 'Cada vértice tiene dos bisectrices: la interior, que parte el ángulo de adentro, y la exterior, que parte el ángulo exterior, entre un lado y la prolongación del otro.' },
        { titulo: 'Qué mirar', texto: 'Cambia B y C, y fíjate en tres números a la vez: el ángulo A, el ángulo BIC y cómo se mueve uno cuando cambia el otro.' },
      ],
    },
    juega: {
      consigna: 'Las bisectrices de B y C se cortan en I. Cambia los ángulos B y C y compara el ángulo BIC con el ángulo A.',
      voz: 'Cambia B y C. Busca una relación entre BIC y A.',
      controles: [
        { id: 'b', etiqueta: 'B', min: 40, max: 70, paso: 10, inicio: 60, unidad: '°', decimales: 0, color: 'c-i' },
        { id: 'c', etiqueta: 'C', min: 40, max: 70, paso: 10, inicio: 50, unidad: '°', decimales: 0, color: 'c-d' },
      ],
      dibujo: v => ({ datos: bis(v.b, v.c), estado: {} }),
      // Se agarra A: su posición decide los ángulos B y C (de 10° en 10°).
      arrastres: [{ id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o',
        donde: v => enPantalla(bis(v.b, v.c), porAngulos(v.b, v.c, 6).A),
        mover: (pt, v) => { const q = alPlano(bis(v.b, v.c), pt); return { b: U.angulo([0, 0], [6, 0], q), c: U.angulo([6, 0], [0, 0], q) }; } }],
      lectura: v => [cA, ` = ${180 - v.b - v.c}° · ∠BIC = ${90 + (180 - v.b - v.c) / 2}°`],
      minimo: 4,
    },
    predice: {
      pregunta: ['Con ', cA, ' = 60°, cambiamos la bisectriz de C por la exterior: corta a la bisectriz de B en E. ¿Cuánto mide el ángulo BEC?'],
      voz: 'La bisectriz cambió. Decide si la relación cambia también.',
      opciones: [
        { id: 'c', texto: '30°', correcta: true },
        { id: 'interior', texto: '120°', error: 'GE-BIS4', siFuera: '120° es ∠BIC, con las dos bisectrices interiores. En E una de ellas es exterior.' },
        { id: 'resta', texto: '60°', error: 'GE-BIS5', siFuera: '60° sería cierto si E viera el ángulo A completo. Recibe solo su mitad.' },
        { id: 'compl', texto: '90°', error: 'GE-BIS5', siFuera: 'Las bisectrices de C sí forman 90° entre sí; el ángulo en E es otro.' },
      ],
      dibujo: { datos: bis(70, 50, { E: true, sinE: true, sinBIC: true, alt: 'Triángulo con A = 60°: bisectriz interior de B y exterior de C se cortan en E' }), estado: {} },
      revelar: { datos: bis(70, 50, { E: true }), estado: {} },
      coincide: ['Coincide: ∠BEC = ', cA, '/2 = 30°.'],
    },
    mira: {
      datos: bis(70, 50, { E: true, pasos: { I: 1, BIC: 2, E: 3, E2: 4 } }),
      voz: 'Primero el interior; luego el exterior se apoya en él.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Las bisectrices toman la mitad de B y la mitad de C.', ecuacion: [{ frac: [cB, '2'] }, ' + ', { frac: [cC, '2'] }, ' = ', { frac: [['180° − ', cA], '2'] }] },
        { estado: { corte: 2 }, texto: 'En el triángulo BIC, lo que falta para 180° es ∠BIC.', ecuacion: ['∠BIC = 180° − ', { frac: [[cB, ' + ', cC], '2'] }, ' = 90° + ', { frac: [cA, '2'] }] },
        { estado: { corte: 3 }, texto: 'Las dos bisectrices de C forman 90°.', ecuacion: ['∠ICE = 90°'] },
        { estado: { corte: 4 }, texto: 'En el triángulo ICE, el exterior en I es ∠BIC.', ecuacion: ['∠BEC = ∠BIC − 90° = ', { frac: [cA, '2'] }, ' = 30°'] },
      ],
    },
    regla: {
      texto: 'Las bisectrices interiores de B y C forman 90° + A/2. Si una es interior y la otra exterior, forman A/2.',
      ecuacion: ['∠BIC = 90° + ', { llave: [{ frac: [cA, '2'] }], nota: 'mitad de A', color: 'c-o' }, '   ·   ∠BEC = ', { frac: [cA, '2'] }],
      condicion: 'I está en las bisectrices interiores de B y C; E, en la interior de B y la exterior de C.',
      voz: 'Antes de aplicar, revisa qué bisectrices se cortan.',
    },
    // Así se resuelve (fase 2): el mismo corte de bisectrices de «Ahora tú», con la misma figura y otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), a = 10 * r.ent(3, 10), conE = s % 2 === 1;
        const b = 10 * r.ent(3, Math.min(10, (170 - a) / 10 - 3)), c = 180 - a - b;
        const d = bis(b, c, { E: conE, sinBIC: true, sinE: true });
        if (conE) d.angulos = d.angulos.filter(an => !(an.en === 'I'));
        const bien = conE ? a / 2 : 90 + a / 2, ang = conE ? '∠BEC' : '∠BIC';
        return {
          enunciado: conE ? ['En el triángulo ABC, ', cA, ` = ${a}°. La bisectriz interior de B y la exterior de C se cortan en E. ¿Cuánto mide ∠BEC?`]
            : ['En el triángulo ABC, ', cA, ` = ${a}°. Las bisectrices interiores de B y C se cortan en I. ¿Cuánto mide ∠BIC?`],
          dibujo: { datos: d, estado: {} },
          pasos: [
            { tipo: 'pide', texto: conE ? 'Piden ∠BEC. E está en la bisectriz interior de B y en la exterior de C.' : 'Piden ∠BIC. I está en las dos bisectrices interiores, la de B y la de C.' },
            { tipo: 'datos', texto: ['Solo conozco ', cA, ` = ${a}°. Los ángulos B y C no los dan.`] },
            { tipo: 'regla', texto: conE ? 'Cuando se cruzan una bisectriz interior y una exterior, el ángulo entre ellas es la mitad de A.' : 'Cuando se cruzan las dos bisectrices interiores, el ángulo entre ellas es 90° más la mitad de A.',
              ecuacion: conE ? ['∠BEC = ', { frac: [cA, '2'] }] : ['∠BIC = 90° + ', { frac: [cA, '2'] }] },
            { tipo: 'cuentas', texto: conE ? ['Saco la mitad de ', cA, '.'] : ['Saco la mitad de ', cA, ' y le sumo 90°.'],
              ecuacion: conE ? ['∠BEC = ', { frac: [`${a}°`, '2'] }, ` = ${bien}°`] : ['∠BIC = 90° + ', { frac: [`${a}°`, '2'] }, ` = 90° + ${a / 2}° = ${bien}°`] },
            { tipo: 'sentido', texto: conE ? `Pruebo con un caso: B = ${b}° y C = ${c}°. En el triángulo BEC, B da ${b / 2}° y C da ${c}° + ${(180 - c) / 2}°: queda 180° − ${b / 2}° − ${c + (180 - c) / 2}° = ${bien}°.`
              : `Pruebo con un caso: B = ${b}° y C = ${c}°. En el triángulo BIC quedan ${b / 2}° y ${c / 2}°: 180° − ${b / 2}° − ${c / 2}° = ${bien}°.` },
          ],
          respuesta: `${ang} = ${bien}°`,
        };
      },
    },
    ahoraTu: {
      voz: 'Mira qué bisectrices se cortan antes de elegir la fórmula.',
      generar(s) {
        const r = azar(s), a = 10 * r.ent(3, 10), conE = s % 2 === 1;
        const b = 10 * r.ent(3, Math.min(10, (170 - a) / 10 - 3)), c = 180 - a - b;
        const d = bis(b, c, { E: conE, sinBIC: true, sinE: true });
        if (conE) d.angulos = d.angulos.filter(an => !(an.en === 'I'));
        const bien = conE ? a / 2 : 90 + a / 2;
        return {
          pregunta: conE ? ['En el triángulo ABC, ', cA, ` = ${a}°. La bisectriz interior de B y la exterior de C se cortan en E. ¿Cuánto mide ∠BEC?`]
            : ['En el triángulo ABC, ', cA, ` = ${a}°. Las bisectrices interiores de B y C se cortan en I. ¿Cuánto mide ∠BIC?`],
          dibujo: { datos: d, estado: {} },
          opciones: opciones(bien, [
            { id: 'cambio', valor: conE ? 90 + a / 2 : a / 2, error: 'GE-BIS4', siFuera: conE ? 'Esa fórmula vale con dos bisectrices interiores; aquí una es exterior.' : 'A/2 vale con una bisectriz exterior; aquí las dos son interiores.' },
            { id: 'menos', valor: 90 - a / 2, error: 'GE-BIS5', siFuera: '90° − A/2 aparece con dos bisectrices exteriores, no en este corte.' },
            { id: 'sin-mitad', valor: conE ? a : 90 + a, error: 'GE-BIS5', siFuera: 'Falta la mitad: cada bisectriz toma solo la mitad de su ángulo.' },
          ], gr),
          solucion: { texto: conE ? 'Interior con exterior: la mitad de A.' : 'Dos interiores: 90° más la mitad de A.', ecuacion: conE ? ['∠BEC = ', { frac: [`${a}°`, '2'] }, ` = ${a / 2}°`] : ['∠BIC = 90° + ', { frac: [`${a}°`, '2'] }, ` = ${90 + a / 2}°`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 1 y la 3: se mueven A y C (la base cambia), y se elige qué línea notable sale de A.
  // Deja probar lo que las ideas no: el obtuso en C, el rectángulo exacto y el isósceles donde las líneas coinciden.
  const LIN = { h: 'altura', m: 'mediana', b: 'bisectriz', z: 'mediatriz' };
  const libre = (ax, ay, cx, linea) => {
    const A = [ax, ay], B = [0, 0], C = [cx, 0];
    const a = U.angulo(A, B, C), b = U.angulo(B, A, C), c = 180 - a - b;
    const lb = U.dist(A, C), lc = U.dist(A, B);
    const H = [ax, 0], M = [cx / 2, 0], D = [cx * lc / (lb + lc), 0];
    const todas = linea === 'todas', ve = k => todas || linea === k;
    const fuera = ax < 0 || ax > cx;
    return {
      alt: `Triángulo de ángulos A = ${f(a, 0)}°, B = ${f(b, 0)}° y C = ${f(c, 0)}°${ve('h') && fuera ? '; la altura desde A cae fuera del lado BC' : ''}`,
      vista: { x: [-2.6, 8.6], y: [-1, 6.4] },
      puntos: [{ id: 'A', x: ax, y: ay, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: cx, y: 0, rotulo: 'C', lado: -60 },
        { id: 'H', x: H[0], y: 0, sinPunto: !ve('h'), color: 'h' }, { id: 'M', x: M[0], y: 0, sinPunto: !(ve('m') || ve('z')), color: 'i' },
        { id: 'D', x: D[0], y: 0, sinPunto: !ve('b'), color: 'o' }, { id: 'Mz', x: M[0], y: 6, sinPunto: true }],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' },
        ...(ve('h') && fuera ? [{ de: ax < 0 ? 'B' : 'C', a: 'H', discontinua: true, grosor: 'fino' }] : []),
        ...(ve('h') ? [{ de: 'A', a: 'H', color: 'h', grosor: 'variable' }] : []),
        ...(ve('m') ? [{ de: 'A', a: 'M', color: 'i', grosor: 'variable' }, { de: 'B', a: 'M', marcas: 1, color: 'i' }, { de: 'M', a: 'C', marcas: 1, color: 'i' }] : []),
        ...(ve('b') ? [{ de: 'A', a: 'D', color: 'o', grosor: 'variable' }] : []),
        ...(ve('z') ? [{ de: 'M', a: 'Mz', color: 'd', discontinua: true }] : [])],
      angulos: [
        ...(linea === 'ninguna' ? [{ en: 'A', de: 'B', a: 'C', color: 'o', texto: gr(Math.round(a)) }, { en: 'B', de: 'C', a: 'A', color: 'i', texto: gr(Math.round(b)) }, { en: 'C', de: 'A', a: 'B', color: 'd', texto: gr(Math.round(c)) }] : []),
        ...(ve('h') && Math.abs(ay) > 0 ? [{ en: 'H', de: ax > cx ? 'B' : 'C', a: 'A', color: 'h' }] : []),
        ...(ve('b') ? [{ en: 'A', de: 'B', a: 'D', color: 'o', rayita: 1, radio: 30 }, { en: 'A', de: 'D', a: 'C', color: 'o', rayita: 1, radio: 30 }] : []),
        ...(ve('z') ? [{ en: 'M', de: 'C', a: 'Mz', color: 'd' }] : []),
      ],
    };
  };
  // Los tres ángulos del triángulo libre, como los calcula la figura (A, B y C).
  const angLibre = v => { const A = [v.ax, v.ay], C = [v.cx, 0], a = U.angulo(A, [0, 0], C), b = U.angulo([0, 0], A, C); return { a, b, c: 180 - a - b }; };
  let A_MAX = 0;   // el mayor ángulo A de la grilla de la mesa
  for (let i = 0; i <= 20; i++) for (let j = 0; j <= 11; j++) for (let k = 0; k <= 12; k++) A_MAX = Math.max(A_MAX, angLibre({ ax: -2 + i / 2, ay: 0.5 + j / 2, cx: 2 + k / 2 }).a);
  // Los pies de altura, mediana y bisectriz que dibuja libre(): coinciden cuando los tres caen en el mismo punto.
  const pies = v => { const P = libre(v.ax, v.ay, v.cx, 'todas').puntos, x = id => P.find(p => p.id === id).x; return [x('H'), x('M'), x('D')]; };
  const mesaLibre = {
    id: 'triangulo-libre', titulo: 'Triángulo libre', pieza: 'geo-figura',
    consigna: 'Arrastra A y C. Elige qué línea sale de A. Busca un obtuso en C, un rectángulo y un isósceles.',
    controles: [
      { id: 'ax', etiqueta: 'A a lo ancho', min: -2, max: 8, paso: 0.5, inicio: 2, unidad: '', decimales: 1 },
      { id: 'ay', etiqueta: 'A a lo alto', min: 0.5, max: 6, paso: 0.5, inicio: 4, unidad: '', decimales: 1 },
      { id: 'cx', etiqueta: 'C a lo ancho', min: 2, max: 8, paso: 0.5, inicio: 6, unidad: '', decimales: 1 },
      { id: 'linea', etiqueta: 'Desde A', opciones: [{ valor: 'ninguna', texto: 'ángulos' }, { valor: 'h', texto: 'altura' }, { valor: 'm', texto: 'mediana' }, { valor: 'b', texto: 'bisectriz' }, { valor: 'todas', texto: 'todas' }] },
    ],
    dibujo: v => ({ datos: libre(v.ax, v.ay, v.cx, v.linea), estado: {} }),
    arrastres: [
      { id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o',
        donde: v => enPantalla(libre(v.ax, v.ay, v.cx, v.linea), [v.ax, v.ay]),
        mover: (pt, v) => { const q = alPlano(libre(v.ax, v.ay, v.cx, v.linea), pt); return { ax: q[0], ay: q[1] }; } },
      { id: 'vertice-c', etiqueta: 'vértice C', color: 'c-d',
        donde: v => enPantalla(libre(v.ax, v.ay, v.cx, v.linea), [v.cx, 0]),
        mover: (pt, v) => ({ cx: alPlano(libre(v.ax, v.ay, v.cx, v.linea), pt)[0] }) },
    ],
    lectura: v => {
      const A = [v.ax, v.ay], C = [v.cx, 0], a = U.angulo(A, [0, 0], C), b = U.angulo([0, 0], A, C), c = 180 - a - b;
      return [cA, ` ${gr(Math.round(a))}   ·   `, cB, ` ${gr(Math.round(b))}   ·   `, cC, ` ${gr(Math.round(c))}   ·   ${nombreAng(a, b, c)}`];
    },
    invitaciones: [
      { texto: 'Haz obtuso el ángulo C y mira, con «altura», dónde cae su pie.',
        logrado: v => angLibre(v).c > 90 + 1e-9 && v.linea === 'h',
        bien: 'Con C obtuso, la altura desde A cae fuera, en la prolongación.' },
      { texto: 'Consigue un triángulo rectángulo exacto, con el ángulo recto en B.',
        logrado: v => Math.abs(angLibre(v).b - 90) < 1e-9,
        bien: 'Recto en B: la altura desde A es el mismo lado AB.' },
      { texto: 'Elige «todas» y busca un triángulo donde las líneas notables coinciden.',
        logrado: v => { const [h, m, d] = pies(v); return v.linea === 'todas' && Math.abs(h - m) < 1e-9 && Math.abs(m - d) < 1e-9; },
        bien: 'Coinciden con AB = AC. ¿Lo garantiza el isósceles o solo este dibujo?' },
      { texto: 'Busca el ángulo A más grande que permite la mesa.',
        logrado: v => Math.abs(angLibre(v).a - A_MAX) < 1e-9,
        bien: 'Casi llano: A pegado a la base, y B y C casi nada.' },
      { texto: 'Guarda un acutángulo y un obtusángulo. Compara la suma de sus ángulos.',
        logrado: (v, gs) => { const n = c => { const x = angLibre(c); return nombreAng(x.a, x.b, x.c); };
          return gs.some(c => n(c) === 'acutángulo') && gs.some(c => n(c) === 'obtusángulo') && gs.some(c => c.ax === v.ax && c.ay === v.ay && c.cx === v.cx); },
        bien: 'Formas distintas, la misma suma: los 180° no dependen del dibujo.' },
    ],
  };
  // Mesa 2: la bisagra con los dos lados libres. La idea 2 fija 5 y 8; aquí se cambian, y el rango se lee en vivo.
  const bisagraLibre = (g, c, a) => {
    const B = [0, 0], C = [a, 0], A = U.polar(B, c, g), x = U.dist(A, C);
    return {
      alt: `Lados de ${f(c)} y ${f(a)} con ${f(g, 0)}° entre ellos: el tercer lado mide ${f(x)}, entre ${f(Math.abs(a - c))} y ${f(a + c)}`,
      vista: { x: [-6.6, 8.6], y: [-0.8, 6.6] },
      puntos: [{ id: 'B', x: 0, y: 0, rotulo: 'B', lado: -90 }, { id: 'C', x: a, y: 0, rotulo: 'C', lado: -90 }, { id: 'A', x: A[0], y: A[1], rotulo: 'A', color: 'o', lado: 90 },
        { id: 'P0', x: c, y: 0, sinPunto: true }, { id: 'P1', x: -c, y: 0, sinPunto: true }],
      arcos: [{ centro: [0, 0], r: c, de: 0, a: 180, color: 'o', grosor: 'fino' }],
      segmentos: [{ de: 'B', a: 'C', texto: f(a), grosor: 'variable', color: 'i' }, { de: 'B', a: 'A', texto: f(c), grosor: 'variable', color: 'o' },
        { de: 'A', a: 'C', color: 'h', texto: `x ≈ ${f(x)}` }],
    };
  };
  // El tercer lado x que dibuja bisagraLibre.
  const tercero = v => U.dist(U.polar([0, 0], v.c, v.g), [v.a, 0]);
  let X_MAX = 0;   // el mayor x de la grilla con triángulo de verdad (ángulo en B entre 0° y 180°, sin los extremos)
  for (let g = 5; g < 180; g += 5) for (let i = 0; i <= 10; i++) for (let j = 0; j <= 14; j++) X_MAX = Math.max(X_MAX, tercero({ g, c: 1 + i / 2, a: 1 + j / 2 }));
  const mesaBisagra = {
    id: 'bisagra-libre', titulo: 'Bisagra con lados libres', pieza: 'geo-figura',
    consigna: 'Arrastra A por su arco y C por la base. Cambia los dos lados y mira cuándo x roza sus límites.',
    controles: [
      { id: 'g', etiqueta: 'Ángulo en B', min: 0, max: 180, paso: 5, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' },
      { id: 'c', etiqueta: 'Lado AB', min: 1, max: 6, paso: 0.5, inicio: 5, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'a', etiqueta: 'Lado BC', min: 1, max: 8, paso: 0.5, inicio: 8, unidad: '', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: bisagraLibre(v.g, v.c, v.a), estado: {} }),
    arrastres: [
      { id: 'punta-a', etiqueta: 'punta A', color: 'c-o',
        donde: v => enPantalla(bisagraLibre(v.g, v.c, v.a), U.polar([0, 0], v.c, v.g)),
        mover: (pt, v) => { const q = alPlano(bisagraLibre(v.g, v.c, v.a), pt), g = U.grados(Math.atan2(q[1], q[0])); return { g: g < -90 ? 180 : g < 0 ? 0 : g, c: Math.hypot(q[0], q[1]) }; } },
      { id: 'vertice-c', etiqueta: 'vértice C', color: 'c-i',
        donde: v => enPantalla(bisagraLibre(v.g, v.c, v.a), [v.a, 0]),
        mover: (pt, v) => ({ a: alPlano(bisagraLibre(v.g, v.c, v.a), pt)[0] }) },
    ],
    lectura: v => {
      const x = U.dist(U.polar([0, 0], v.c, v.g), [v.a, 0]), lo = Math.abs(v.a - v.c), hi = v.a + v.c;
      const plano = v.g === 0 || v.g === 180;
      return [`${f(lo)} < `, { v: 'c-h', t: 'x' }, ` < ${f(hi)}   ·   `, { v: 'c-h', t: 'x' }, ` ≈ ${f(x)}${plano ? ': segmento, sin triángulo' : ''}`];
    },
    invitaciones: [
      { texto: 'Haz que x toque un extremo de la desigualdad triangular: el triángulo se aplasta.',
        logrado: v => { const x = tercero(v); return Math.abs(x - Math.abs(v.a - v.c)) < 1e-9 || Math.abs(x - (v.a + v.c)) < 1e-9; },
        bien: 'En el extremo, x es la suma o la diferencia: puntos alineados, sin triángulo.' },
      { texto: 'Busca el x más largo que todavía forme triángulo.',
        logrado: v => v.g > 0 && v.g < 180 && Math.abs(tercero(v) - X_MAX) < 1e-9,
        bien: 'Se acerca a la suma de los lados, pero nunca la alcanza.' },
      { texto: 'Con AB y BC distintos, arma un isósceles: que x iguale a uno de ellos.',
        logrado: v => v.g > 0 && v.g < 180 && v.c !== v.a && nombreLad(v.c, v.a, tercero(v)) === 'isósceles',
        bien: 'Dos lados iguales. ¿Qué pasa con los ángulos frente a ellos?' },
      { texto: 'Guarda dos casos con los mismos lados y distinto ángulo en B. Compara x.',
        logrado: (v, gs) => gs.some(c => c.c === v.c && c.a === v.a && c.g !== v.g) && gs.some(c => c.c === v.c && c.a === v.a && c.g === v.g),
        bien: 'Mismos lados: a más abertura en B, más largo el tercer lado.' },
    ],
  };

  return {
    unidad: 'geometria.triangulos',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'En la proposición I.32 de los Elementos, la suma de los ángulos de un triángulo no se obtiene midiendo muchos dibujos: se traza una paralela y se comparan ángulos. El mismo argumento da el ángulo exterior. Una figura auxiliar se vuelve parte de la demostración.',
      pregunta: '¿Qué línea convierte una regularidad en una prueba?',
      fuente: { titulo: 'Euclides, Elementos I.32 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/propI32.html' },
    },
    // Laboratorio: el triángulo libre (A y C) y la bisagra con lados libres son más ricos que sus ideas; la tercera mesa
    // es el juego de las bisectrices con su gesto.
    // Glosario: las palabras que la unidad estrena (docs/teoria.md, 4d). Triángulo y altura ya salen en «Segmentos y
    // ángulos», pero se definen aquí, donde son el tema.
    glosario: [
      { termino: 'triángulo', simbolo: '△', def: 'Figura cerrada de tres lados rectos que se juntan de dos en dos en tres vértices.',
        ver: ['ángulo interior', 'desigualdad triangular'] },
      { termino: 'ángulo interior', formas: ['ángulo interior', 'ángulos interiores', 'interiores', 'interior'],
        def: 'El que queda dentro de la figura, entre dos lados vecinos. En el triángulo, los tres suman 180°.',
        ejemplo: `Con 50° y 70°, el tercero mide ${180 - 50 - 70}°.`, ver: ['ángulo exterior'] },
      { termino: 'ángulo exterior', formas: ['ángulo exterior', 'ángulos exteriores'],
        def: 'El que forma un lado con la prolongación del lado vecino, por fuera de la figura.',
        ejemplo: `Con interiores de 50° y 70°, el exterior del tercer vértice mide ${50 + 70}°.`, ver: ['ángulo interior'] },
      { termino: 'desigualdad triangular', def: 'Cada lado es menor que la suma de los otros dos y mayor que su diferencia.',
        ejemplo: `Con lados 5 y 8, el tercero está entre ${8 - 5} y ${8 + 5}, sin llegar a ellos.` },
      { termino: 'acutángulo', def: 'Triángulo con sus tres ángulos agudos, de menos de 90°.' },
      { termino: 'rectángulo', def: 'Con ángulos rectos: un triángulo con uno de 90°, o un cuadrilátero con los cuatro de 90°.', ver: ['cuadrilátero'] },
      { termino: 'obtusángulo', def: 'Triángulo con un ángulo obtuso, de más de 90°. Solo puede tener uno.' },
      { termino: 'escaleno', def: 'Triángulo con sus tres lados de medidas distintas.' },
      { termino: 'isósceles', def: 'Triángulo con dos lados iguales. Los ángulos frente a esos lados también son iguales.' },
      { termino: 'equilátero', def: 'Triángulo con sus tres lados iguales. Cada uno de sus ángulos mide 60°.' },
      { termino: 'perpendicular', simbolo: '⟂', def: 'Que corta a otra línea formando ángulos de 90°.' },
      { termino: 'altura', def: 'Segmento perpendicular que baja de un vértice o punto hasta la recta de enfrente. Mide la distancia a ella.',
        ver: ['pie', 'línea notable'] },
      { termino: 'punto medio', formas: ['punto medio', 'puntos medios'], def: 'El que parte un segmento en dos partes de igual medida.' },
      { termino: 'mediana', def: 'Segmento que une un vértice del triángulo con el punto medio del lado opuesto.', ver: ['punto medio'] },
      { termino: 'mediatriz', def: 'Recta perpendicular a un segmento que pasa por su punto medio.', ver: ['perpendicular', 'punto medio'] },
      { termino: 'línea notable', formas: ['líneas notables', 'línea notable'],
        def: 'Cada línea especial del triángulo: altura, mediana, bisectriz o mediatriz. Se reconoce por su condición.',
        ver: ['altura', 'mediana', 'bisectriz', 'mediatriz', 'baricentro', 'incentro'] },
      { termino: 'pie', formas: ['pie', 'pies'], def: 'Punto donde una línea trazada desde un vértice llega al lado de enfrente o a su prolongación.' },
      { termino: 'prolongación', def: 'Lo que sigue de un segmento más allá de sus extremos, sobre la misma recta.' },
      { termino: 'lado opuesto', formas: ['lado opuesto', 'lados opuestos'], def: 'En un triángulo, el lado que no toca al vértice del que se habla.' },
      { termino: 'demostración', def: 'Razonamiento que prueba que algo vale en todos los casos, no solo en el dibujo.' },
      { termino: 'proposición', def: 'En los Elementos de Euclides, cada afirmación numerada que se enuncia y después se prueba.' },
    ],
    laboratorio: [mesaLibre, mesaBisagra, Object.assign({ id: 'bisectrices', titulo: 'Ángulo entre bisectrices', pieza: 'geo-figura',
      invitaciones: [
        { texto: 'Haz que el ángulo BIC mida justo 120°.',
          logrado: v => Math.abs(anguloBIC(v) - 120) < 1e-6,
          bien: 'BIC = 120° pide A = 60°. Hay varias parejas de B y C.' },
        { texto: 'Busca el ángulo BIC más grande de la mesa.',
          logrado: v => Math.abs(anguloBIC(v) - BIC_MAX) < 1e-6,
          bien: 'El mayor BIC sale con el mayor A: crecen juntos.' },
        { texto: 'Haz que B y C sean iguales y mira dónde queda I.',
          logrado: v => v.b === v.c,
          bien: 'Con B = C, I cae en la bisectriz de A, que también es altura.' },
        { texto: 'Guarda dos casos con el mismo ángulo A y distintos B y C.',
          logrado: (v, gs) => gs.some(c => c.b !== v.b && 180 - c.b - c.c === 180 - v.b - v.c) && gs.some(c => c.b === v.b && c.c === v.c),
          bien: 'Mismo A, mismo BIC: solo cuenta A, no cómo se reparten B y C.' },
      ] }, bisectrices.juega)],
    ideas: [suma, desigualdad, lineas, bisectrices],
  };
});
