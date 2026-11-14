/*
 * Teoría de «Poliedros» (geometria.poliedros). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 14); Euclides, Elementos XIII; Euler (1750) y Lhuilier (1813).
 * Compañera: Neri (nutria). Pieza: geo-figura en 3D; los sólidos se arman con su casco convexo (caras calculadas).
 *
 * Ficha de tarea
 *   Promesa: contar vértices, aristas y caras sin olvidar lo oculto ni contar dos veces, y saber cuándo vale
 *     C + V = A + 2.
 *   Persona y condiciones: postulante de 5.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: cuenta V, A y C de prismas y pirámides; usa Euler en poliedros convexos; explica por qué
 *     solo hay cinco poliedros regulares y cuenta sus aristas con p · C = 2A.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿cuento las aristas que no se ven?» y «¿por qué no hay un poliedro de hexágonos?».
 *
 * Notación del examen peruano: C caras, V vértices, A aristas; Euler como C + V = A + 2 (igual a V − A + C = 2).
 * Colores: vértices naranja (c-o), aristas turquesa (c-i), caras verde (c-d), lo que no cierra rojo (c-h).
 * Códigos: GE-POLI1 a GE-POLI4, hipótesis nuevas (rutinas/teoria-geometria.md).
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
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt = String, n = 4) {
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
  const pt = (id, p, o = {}) => Object.assign({ id, x: p[0], y: p[1], z: p[2] }, o);
  const frac = (a, b) => ({ frac: [a, b] });
  const cV = { v: 'c-o', t: 'V' }, cA = { v: 'c-i', t: 'A' }, cC = { v: 'c-d', t: 'C' };

  // ---------- Casco convexo: caras calculadas y orientadas hacia fuera ----------
  const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const pto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const uni = v => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; };
  function casco(P) {
    const caras = [], vistas = new Set(), n = P.length;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
      const c = cruz(res(P[j], P[i]), res(P[k], P[i]));
      if (Math.hypot(...c) < 1e-9) continue;
      let nr = uni(c), d = pto(nr, P[i]);
      const lados = P.map(p => pto(nr, p) - d);
      if (lados.every(x => x >= -1e-7)) { nr = nr.map(x => -x); d = -d; } else if (!lados.every(x => x <= 1e-7)) continue;
      const cop = P.map((p, m) => m).filter(m => Math.abs(pto(nr, P[m]) - d) < 1e-7), clave = cop.join(',');
      if (vistas.has(clave)) continue;
      vistas.add(clave);
      const cen = cop.reduce((s, m) => [s[0] + P[m][0] / cop.length, s[1] + P[m][1] / cop.length, s[2] + P[m][2] / cop.length], [0, 0, 0]);
      const u = uni(res(P[cop[0]], cen)), w = cruz(nr, u);
      caras.push(cop.sort((a, b) => Math.atan2(pto(res(P[a], cen), w), pto(res(P[a], cen), u)) - Math.atan2(pto(res(P[b], cen), w), pto(res(P[b], cen), u))));
    }
    const aristas = new Set();
    for (const c of caras) c.forEach((a, m) => { const b = c[(m + 1) % c.length]; aristas.add(a < b ? `${a}-${b}` : `${b}-${a}`); });
    return { caras, V: n, A: aristas.size, C: caras.length };
  }
  const TD = { giro: -28, alza: 22 };
  const regular = (n, R, y, g0 = 90) => Array.from({ length: n }, (_, k) => { const t = U.rad(g0 + 360 * k / n); return [R * Math.cos(t), y, R * Math.sin(t)]; });
  const SOLIDOS = {
    prisma: n => [...regular(n, 1.5, -1.1), ...regular(n, 1.5, 1.1)],
    piramide: n => [...regular(n, 1.6, -1.1), [0, 1.5, 0]],
    bipiramide: n => [...regular(n, 1.6, 0), [0, 1.7, 0], [0, -1.7, 0]],
    tetraedro: () => [...regular(3, 1.6, -0.8, 60), [0, -0.8 + 1.6 * Math.sqrt(2), 0]],
    cubo: () => [-1, 1].flatMap(x => [-1, 1].flatMap(y => [-1, 1].map(z => [x * 1.1, y * 1.1, z * 1.1]))),
    octaedro: () => [[1.7, 0, 0], [-1.7, 0, 0], [0, 1.7, 0], [0, -1.7, 0], [0, 0, 1.7], [0, 0, -1.7]],
    dodecaedro: () => { const p = (1 + Math.sqrt(5)) / 2, q = 1 / p, e = 0.95; return [...[-1, 1].flatMap(x => [-1, 1].flatMap(y => [-1, 1].map(z => [x, y, z]))), ...[-1, 1].flatMap(a => [-1, 1].flatMap(b => [[0, a * q, b * p], [a * q, b * p, 0], [a * p, 0, b * q]]))].map(v => v.map(x => x * e)); },
    icosaedro: () => { const p = (1 + Math.sqrt(5)) / 2, e = 0.95; return [-1, 1].flatMap(a => [-1, 1].flatMap(b => [[0, a, b * p], [a, b * p, 0], [b * p, 0, a]])).map(v => v.map(x => x * e)); },
  };
  const solidoFig = (P, alt, o = {}) => {
    const h = casco(P);
    return {
      alt, tresD: o.tresD || TD, vista: { x: [-2.4, 2.4], y: [-2.3, 2.3] },
      puntos: P.map((p, i) => pt('P' + i, p, { color: 'o', sinPunto: !o.vertices })),
      solidos: [{ caras: h.caras.map(c => c.map(i => 'P' + i)), color: 'd' }],
    };
  };
  const nombreBase = n => ({ 3: 'triangular', 4: 'cuadrangular', 5: 'pentagonal', 6: 'hexagonal', 7: 'heptagonal', 8: 'octogonal', 9: 'nonagonal', 10: 'decagonal', 12: 'dodecagonal' })[n] || `de base de ${n} lados`;

  // ---------- Idea 1: elementos y clasificación ----------
  // Cambia: el tipo de sólido y los lados de la base · Permanece: la manera de contar ·
  // Progresa: V, A y C crecen con n · Se reserva: el prisma hexagonal · Debe verse: lo oculto también cuenta.
  const cuenta = (tipo, n) => (tipo === 'prisma' ? { V: 2 * n, A: 3 * n, C: n + 2 } : { V: n + 1, A: 2 * n, C: n + 1 });
  const elemIdea = {
    id: 'elementos',
    titulo: 'Contar también lo oculto',
    temas: ['Elementos y clasificación'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Elige prisma o pirámide y cambia los lados de la base. Las aristas discontinuas están detrás: también cuentan.',
      voz: 'Cuenta vértices, aristas y caras. No olvides las de atrás.',
      controles: [
        { id: 'tipo', etiqueta: 'sólido', opciones: [{ valor: 'prisma', texto: 'prisma' }, { valor: 'piramide', texto: 'pirámide' }] },
        { id: 'n', etiqueta: 'lados de la base', min: 3, max: 8, paso: 1, inicio: 5, unidad: '', decimales: 0, color: 'c-d' },
      ],
      dibujo: v => ({ datos: solidoFig(SOLIDOS[v.tipo](v.n), `${v.tipo === 'prisma' ? 'Prisma' : 'Pirámide'} ${nombreBase(v.n)}`, { vertices: true }), estado: {} }),
      lectura: v => { const c = cuenta(v.tipo, v.n); return [`V = ${c.V} · A = ${c.A} · C = ${c.C}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: '¿Cuántas aristas tiene un prisma hexagonal?',
      voz: 'Separa las aristas de las bases de las laterales.',
      opciones: [
        { id: 'c', texto: '18', correcta: true },
        { id: 'bases', texto: '12', error: 'GE-POLI1', siFuera: '12 son las de las dos bases; faltan las 6 laterales.' },
        { id: 'vistas', texto: '15', error: 'GE-POLI1', siFuera: '15 son las que se ven; las de atrás también son aristas.' },
        { id: 'caras', texto: '8', error: 'GE-POLI1', siFuera: '8 son las caras, no las aristas.' },
      ],
      dibujo: { datos: solidoFig(SOLIDOS.prisma(6), 'Prisma hexagonal'), estado: {} },
      revelar: { datos: solidoFig(SOLIDOS.prisma(6), 'Prisma hexagonal con sus 12 vértices marcados', { vertices: true }), estado: {} },
      coincide: 'Coincide: 6 + 6 en las bases y 6 laterales.',
    },
    mira: {
      datos: solidoFig(SOLIDOS.prisma(6), 'Prisma hexagonal con sus 12 vértices marcados', { vertices: true }),
      voz: 'Cuenta por grupos: bases, laterales y vértices.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Cada base es un hexágono: 6 aristas arriba y 6 abajo.', ecuacion: ['6 + 6 = 12'] },
        { estado: { corte: 0 }, texto: 'Cada vértice de abajo sube por una arista lateral.', ecuacion: ['12 + 6 = 18 aristas'] },
        { estado: { corte: 0 }, texto: 'Vértices: 6 abajo y 6 arriba. Caras: 6 laterales y 2 bases.', ecuacion: ['V = 12 · C = 8'] },
      ],
    },
    regla: {
      texto: 'Un poliedro está limitado por caras planas; sus lados son aristas y sus esquinas, vértices. Con base de n lados:',
      ecuacion: ['prisma: ', cV, ' = 2n, ', cA, ' = 3n, ', cC, ' = n + 2   ·   pirámide: ', cV, ' = n + 1, ', cA, ' = 2n, ', cC, ' = n + 1'],
      condicion: 'se cuentan todas las caras, aristas y vértices, también los que el dibujo deja atrás.',
      voz: 'Cuenta por grupos y suma; no cuentes lo mismo dos veces.',
    },
    ahoraTu: {
      voz: 'Cuenta por grupos: bases y laterales.',
      generar(s) {
        const r = azar(s), tipo = s % 2 === 0 ? 'prisma' : 'piramide', n = r.ent(3, 12), pide = ['V', 'A', 'C'][r.ent(0, 2)];
        const c = cuenta(tipo, n), nom = { V: 'Cuántos vértices', A: 'Cuántas aristas', C: 'Cuántas caras' };
        const distr = pide === 'A'
          ? [{ id: 'bases', valor: tipo === 'prisma' ? 2 * n : n, error: 'GE-POLI1', siFuera: 'Esas son solo las aristas de las bases; faltan las laterales.' }, { id: 'v', valor: c.V, error: 'GE-POLI1', siFuera: 'Esos son los vértices.' }, { id: 'c2', valor: c.C, error: 'GE-POLI1', siFuera: 'Esas son las caras.' }]
          : pide === 'V'
            ? [{ id: 'base', valor: n, error: 'GE-POLI1', siFuera: tipo === 'prisma' ? 'Esa es una base; hay dos.' : 'Falta el vértice de la punta.' }, { id: 'a', valor: c.A, error: 'GE-POLI1', siFuera: 'Esas son las aristas.' }, { id: 'c2', valor: c.C + 1, error: 'GE-POLI1', siFuera: 'Cuenta otra vez por grupos.' }]
            : [{ id: 'lat', valor: n, error: 'GE-POLI1', siFuera: 'Esas son solo las laterales; faltan las bases.' }, { id: 'a', valor: c.A, error: 'GE-POLI1', siFuera: 'Esas son las aristas.' }, { id: 'mas', valor: tipo === 'prisma' ? n + 1 : n + 2, error: 'GE-POLI1', siFuera: tipo === 'prisma' ? 'El prisma tiene dos bases.' : 'La pirámide tiene una sola base.' }];
        return {
          pregunta: [`¿${nom[pide]} tiene ${tipo === 'prisma' ? 'un prisma' : 'una pirámide'} ${nombreBase(n)}?`],
          opciones: opciones(c[pide], distr),
          solucion: { texto: tipo === 'prisma' ? 'Dos bases iguales unidas por caras laterales.' : 'Una base y caras laterales que suben a la punta.', ecuacion: [`n = ${n}: V = ${c.V}, A = ${c.A}, C = ${c.C}`] },
        };
      },
    },
  };

  // ---------- Idea 2: teorema de Euler ----------
  // Cambia: el sólido · Permanece: la cuenta C + V − A · Progresa: el número 2 que se repite ·
  // Se reserva: el dodecaedro sin contar · Debe verse: vale para convexos; un túnel la rompe.
  const LISTA = { tetraedro: 'tetraedro', cubo: 'cubo', octaedro: 'octaedro', prisma5: 'prisma pentagonal', piramide6: 'pirámide hexagonal', bipiramide5: 'bipirámide pentagonal' };
  const puntosDe = id => (id === 'prisma5' ? SOLIDOS.prisma(5) : id === 'piramide6' ? SOLIDOS.piramide(6) : id === 'bipiramide5' ? SOLIDOS.bipiramide(5) : SOLIDOS[id]());
  const eulerIdea = {
    id: 'euler',
    titulo: 'Caras más vértices',
    temas: ['Teorema de Euler'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Elige un sólido. La cuenta de caras, vértices y aristas sale del modelo, no del dibujo. Mira qué número se repite.',
      voz: 'Prueba varios. ¿Cuánto da C + V − A cada vez?',
      controles: [{ id: 'so', etiqueta: 'sólido', opciones: Object.entries(LISTA).map(([valor, texto]) => ({ valor, texto })) }],
      dibujo: v => ({ datos: solidoFig(puntosDe(v.so), `${LISTA[v.so]} con sus vértices marcados`, { vertices: true }), estado: {} }),
      lectura: v => { const h = casco(puntosDe(v.so)); return [`C = ${h.C} · V = ${h.V} · A = ${h.A}`, `C + V − A = ${h.C + h.V - h.A}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Un poliedro convexo tiene 12 caras y 30 aristas. ¿Cuántos vértices tiene?',
      voz: 'Usa el número que se repetía en todos los sólidos.',
      opciones: [
        { id: 'c', texto: '20', correcta: true },
        { id: 'sin2', texto: '18', error: 'GE-POLI2', siFuera: '18 = 30 − 12 olvida el 2: C + V = A + 2.' },
        { id: 'signo', texto: '16', error: 'GE-POLI2', siFuera: '16 resta el 2; va sumando del lado de las aristas.' },
        { id: 'suma', texto: '42', error: 'GE-POLI2', siFuera: '42 suma caras y aristas; los vértices son menos.' },
      ],
      dibujo: { datos: solidoFig(SOLIDOS.dodecaedro(), 'Dodecaedro: 12 caras pentagonales'), estado: {} },
      revelar: { datos: solidoFig(SOLIDOS.dodecaedro(), 'Dodecaedro con sus 20 vértices marcados', { vertices: true }), estado: {} },
      coincide: 'Coincide: 12 + 20 = 30 + 2. Es el dodecaedro.',
    },
    mira: {
      datos: solidoFig(SOLIDOS.dodecaedro(), 'Dodecaedro con sus 20 vértices marcados', { vertices: true }),
      voz: 'Despeja con cuidado: el 2 va con las aristas.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Euler en poliedros convexos:', ecuacion: [cC, ' + ', cV, ' = ', cA, ' + 2'] },
        { estado: { corte: 0 }, texto: 'Reemplaza lo que sabes.', ecuacion: ['12 + V = 30 + 2'] },
        { estado: { corte: 0 }, texto: 'Despeja.', ecuacion: ['V = 32 − 12 = 20'] },
        { estado: { corte: 0 }, texto: 'Comprobación con caras pentagonales: cada arista es lado de dos caras.', ecuacion: ['5 · 12 = 2 · 30'] },
      ],
    },
    regla: {
      texto: 'En todo poliedro convexo, el número de caras más el de vértices es igual al de aristas más dos.',
      ecuacion: [cC, ' + ', cV, ' = ', cA, ' + 2'],
      condicion: 'el poliedro es convexo. Un marco con un túnel tiene C + V = A: allí no vale.',
      voz: 'Antes de usar Euler, revisa que el sólido no tenga túneles.',
    },
    ahoraTu: {
      voz: 'Escribe C + V = A + 2 y despeja lo que falta.',
      generar(s) {
        const r = azar(s), n = r.ent(3, 10), fam = r.de([
          [2 * n, 3 * n, n + 2], [n + 1, 2 * n, n + 1], [n + 2, 3 * n, 2 * n], [2 * n, 4 * n, 2 * n + 2], [20, 30, 12], [12, 30, 20], [6, 12, 8], [8, 12, 6],
        ]);
        const [V, A, C] = fam, falta = ['V', 'C', 'A'][s % 3];
        if (falta === 'V') return {
          pregunta: [`Un poliedro convexo tiene ${C} caras y ${A} aristas. ¿Cuántos vértices tiene?`],
          opciones: opciones(V, [
            { id: 'sin2', valor: A - C, error: 'GE-POLI2', siFuera: 'Falta el 2: C + V = A + 2.' },
            { id: 'signo', valor: A - C - 2, error: 'GE-POLI2', siFuera: 'El 2 suma del lado de las aristas.' },
            { id: 'suma', valor: A + C - 2, error: 'GE-POLI2', siFuera: 'Las caras se restan al despejar V.' },
          ]),
          solucion: { texto: 'Despeja V.', ecuacion: [`V = ${A} + 2 − ${C} = ${V}`] },
        };
        if (falta === 'C') return {
          pregunta: [`Un poliedro convexo tiene ${V} vértices y ${A} aristas. ¿Cuántas caras tiene?`],
          opciones: opciones(C, [
            { id: 'sin2', valor: A - V, error: 'GE-POLI2', siFuera: 'Falta el 2: C + V = A + 2.' },
            { id: 'signo', valor: A - V - 2, error: 'GE-POLI2', siFuera: 'El 2 suma del lado de las aristas.' },
            { id: 'suma', valor: A + V - 2, error: 'GE-POLI2', siFuera: 'Los vértices se restan al despejar C.' },
          ]),
          solucion: { texto: 'Despeja C.', ecuacion: [`C = ${A} + 2 − ${V} = ${C}`] },
        };
        return {
          pregunta: [`Un poliedro convexo tiene ${C} caras y ${V} vértices. ¿Cuántas aristas tiene?`],
          opciones: opciones(A, [
            { id: 'sin2', valor: C + V, error: 'GE-POLI2', siFuera: 'Falta restar 2: A = C + V − 2.' },
            { id: 'mas2', valor: C + V + 2, error: 'GE-POLI2', siFuera: 'El 2 está del lado de las aristas: se resta al despejar.' },
            { id: 'resta', valor: Math.abs(C - V) + 2, error: 'GE-POLI2', siFuera: 'Caras y vértices se suman.' },
          ]),
          solucion: { texto: 'Despeja A.', ecuacion: [`A = ${C} + ${V} − 2 = ${A}`] },
        };
      },
    },
  };

  // ---------- Idea 3: poliedros regulares ----------
  // Cambia: el polígono y cuántos se juntan en un vértice · Permanece: el vértice O · Progresa: la suma de ángulos ·
  // Se reserva: tres hexágonos · Debe verse: con 360° o más no hay punta; solo quedan cinco casos.
  const INT = n => 180 - 360 / n;
  const NOMP = { 3: 'triángulos', 4: 'cuadrados', 5: 'pentágonos', 6: 'hexágonos' };
  const PLAT = { '3,3': 'tetraedro', '4,3': 'hexaedro (cubo)', '3,4': 'octaedro', '5,3': 'dodecaedro', '3,5': 'icosaedro' };
  const vertFig = (n, q) => {
    const L = { 3: 2.7, 4: 2.4, 5: 2, 6: 1.75 }[n], cols = ['o', 'i', 'd'], ins = INT(n), regs = [];
    for (let k = 0; k < q; k++) {
      let p = [0, 0], dir = -90 + k * ins;
      const v = [p];
      for (let m = 0; m < n - 1; m++) { p = U.polar(p, L, dir); v.push(p); dir += 360 / n; }
      regs.push({ puntos: v, color: cols[k % 3], opacidad: 0.22, sinBorde: false });
    }
    const suma = q * ins;
    return {
      alt: `${q} ${NOMP[n]} alrededor de un vértice: los ángulos suman ${suma}°; ${suma < 360 ? 'queda un hueco y se puede plegar en punta' : suma === 360 ? 'cubren el plano sin hueco: no forman punta' : 'se montan: no caben'}`,
      vista: { x: [-3.7, 3.7], y: [-3.7, 3.7] },
      puntos: [pt('O', [0, 0, 0], { rotulo: 'O', lado: 135 }), pt('E0', U.polar([0, 0], L, -90), { sinPunto: true }), pt('E1', U.polar([0, 0], L, -90 + suma), { sinPunto: true })],
      regiones: regs,
      segmentos: [{ de: 'O', a: 'E0', color: 'h', grosor: 'variable' }, { de: 'O', a: 'E1', color: 'h', grosor: 'variable' }],
    };
  };
  const regIdea = {
    id: 'regulares',
    titulo: 'Solo cinco regulares',
    temas: ['Poliedros regulares'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Junta polígonos regulares iguales alrededor del vértice O. Si los ángulos suman menos de 360°, los bordes rojos se pliegan en una punta.',
      voz: 'Prueba cada polígono. ¿Cuántos caben alrededor de O?',
      controles: [
        { id: 'n', etiqueta: 'polígono', opciones: [{ valor: 3, texto: 'triángulo' }, { valor: 4, texto: 'cuadrado' }, { valor: 5, texto: 'pentágono' }, { valor: 6, texto: 'hexágono' }] },
        { id: 'q', etiqueta: 'por vértice', min: 3, max: 6, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: vertFig(+v.n, v.q), estado: {} }),
      lectura: v => { const s = v.q * INT(+v.n), p = PLAT[`${v.n},${v.q}`]; return [`${v.q} · ${INT(+v.n)}° = ${s}° ${s < 360 ? '< 360°' : '≥ 360°'}`, p ? `se pliega: ${p}` : 'no forma poliedro'] ; },
      minimo: 5,
    },
    predice: {
      pregunta: '¿Puede existir un poliedro regular con tres hexágonos regulares en cada vértice?',
      voz: 'Suma los ángulos que se juntan en el vértice.',
      opciones: [
        { id: 'c', texto: 'No: suman 360° y quedan planos', correcta: true },
        { id: 'cubo', texto: 'Sí: el hexaedro', error: 'GE-POLI4', siFuera: 'El hexaedro es el cubo: tiene seis caras cuadradas, no hexágonos.' },
        { id: 'cuatro', texto: 'Sí, con cuatro hexágonos por vértice', error: 'GE-POLI3', siFuera: 'Cuatro suman 480°: se montan.' },
      ],
      dibujo: { datos: vertFig(6, 3), estado: {} },
      revelar: { datos: vertFig(6, 3), estado: {} },
      coincide: 'Coincide: 3 · 120° = 360°. Embaldosan el piso, no hacen punta.',
    },
    mira: {
      datos: vertFig(5, 3),
      voz: 'La punta necesita que sobre algo de ángulo.',
      pasos: [
        { estado: { corte: 0 }, texto: 'En cada vértice se juntan 3 caras o más, sumando menos de 360°.', ecuacion: ['q · ángulo < 360°'] },
        { estado: { corte: 0 }, texto: 'Triángulos (60°): caben 3, 4 o 5.', ecuacion: ['tetraedro, octaedro, icosaedro'] },
        { estado: { corte: 0 }, texto: 'Cuadrados (90°): solo 3. Pentágonos (108°): solo 3.', ecuacion: ['cubo, dodecaedro'] },
        { estado: { corte: 0 }, texto: 'Hexágonos (120°): tres ya suman 360°. No hay más.', ecuacion: ['5 poliedros regulares'] },
      ],
    },
    regla: {
      texto: 'Un poliedro regular tiene caras polígonos regulares iguales y el mismo número de caras en cada vértice. Solo existen cinco.',
      ecuacion: ['q · ángulo de la cara < 360°   ·   p · ', cC, ' = 2', cA, ' = q · ', cV],
      condicion: 'cada cara tiene p lados, a cada vértice llegan q caras y cada arista es lado de dos caras.',
      voz: 'Cada arista la comparten dos caras: por eso se divide entre 2.',
    },
    ahoraTu: {
      voz: 'Cuenta lados de todas las caras y divide entre 2.',
      generar(s) {
        const r = azar(s), [nom, p, q, C] = r.de([['tetraedro', 3, 3, 4], ['hexaedro', 4, 3, 6], ['octaedro', 3, 4, 8], ['dodecaedro', 5, 3, 12], ['icosaedro', 3, 5, 20]]);
        const A = p * C / 2, V = 2 * A / q, caraN = { 3: 'triangulares', 4: 'cuadradas', 5: 'pentagonales' }[p];
        if (s % 2 === 0) return {
          pregunta: [`El ${nom} regular tiene ${C} caras ${caraN}. ¿Cuántas aristas tiene?`],
          opciones: opciones(A, [
            { id: 'sin2', valor: p * C, error: 'GE-POLI3', siFuera: 'Cada arista es lado de dos caras: divide entre 2.' },
            { id: 'v', valor: V, error: 'GE-POLI1', siFuera: 'Esos son los vértices.' },
            { id: 'c2', valor: C, error: 'GE-POLI1', siFuera: 'Esas son las caras.' },
          ]),
          solucion: { texto: 'Lados de todas las caras, entre 2.', ecuacion: [`A = ${p} · ${C} / 2 = ${A}`] },
        };
        return {
          pregunta: [`El ${nom} regular tiene ${A} aristas y en cada vértice concurren ${q} aristas. ¿Cuántos vértices tiene?`],
          opciones: opciones(V, [
            { id: 'sin2', valor: A / q, error: 'GE-POLI3', siFuera: 'Cada arista tiene dos extremos: q · V = 2A.' },
            { id: 'doble', valor: 2 * A, error: 'GE-POLI3', siFuera: 'Falta dividir entre las aristas de cada vértice.' },
            { id: 'c2', valor: C, error: 'GE-POLI1', siFuera: 'Esas son las caras.' },
          ]),
          solucion: { texto: 'Cada arista tiene dos extremos.', ecuacion: [`V = 2 · ${A} / ${q} = ${V}`] },
        };
      },
    },
  };

  return {
    unidad: 'geometria.poliedros',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'En una carta de 1750, Leonhard Euler anotó una relación entre las caras, los vértices y las aristas de los sólidos que estudiaba. En 1813, Simon Lhuilier examinó sólidos con agujeros y mostró que allí la cuenta falla. La relación necesitaba condiciones: no bastaba comprobarla en unos cuantos ejemplos.',
      pregunta: '¿Una regla que se cumple en muchos ejemplos vale para todos?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «A history of Topology», MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Topology_in_mathematics/' },
    },
    ideas: [elemIdea, eulerIdea, regIdea],
  };
});
