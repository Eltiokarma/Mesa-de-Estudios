/*
 * Teoría de «Relaciones métricas» (geometria.relaciones-metricas). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 8); Elementos I.47, II.12–13 (proyección), III.35–36 (potencia).
 * «Viette» se usa como en las academias: el cociente de las diagonales del cuadrilátero inscrito, siempre con su
 * enunciado (precisión del expediente).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: elegir la relación métrica por la configuración (ángulo recto, proyección, ceviana, tres lados, cuerdas,
 *     cuadrilátero inscrito) y comprobar sus condiciones antes de calcular.
 *   Persona y condiciones: postulante de 4.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: calcula alturas y proyecciones, lados con Euclides, medianas, bisectrices y cevianas con
 *     Stewart, áreas con Herón, segmentos con la potencia de un punto y diagonales con Ptolomeo.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿qué fórmula uso?»: la que corresponde a lo que la figura garantiza.
 *
 * Colores: primer segmento naranja (c-o), segundo turquesa (c-i), referencia verde (c-d), lo pedido rojo (c-h).
 * Códigos: GE11, GE18 (docs/investigacion/geometria-ideas-erroneas.md); GE-EUC, GE-MED, GE-HER, GE-POT, GE-PTO hipótesis.
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
  const f = (n, d = 2) => Kit.formatear(n, d);
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
  const frac = (a, b) => ({ frac: [a, b] });
  const sup2 = x => ({ sup: [x, '2'] });
  // Triángulo con B = (0, 0), C = (a, 0) y lados c = AB, b = AC.
  const porLados = (a, b, c) => { const x = (c * c - b * b + a * a) / (2 * a); return [x, Math.sqrt(Math.max(0, c * c - x * x))]; };

  // ---------- Idea 1: el triángulo rectángulo ----------
  // Cambia: C en la semicircunferencia · Permanece: la hipotenusa 10 · Progresa: h² frente a p · q ·
  // Se reserva: la altura con p = 4 y q = 9 · Debe verse: dos triángulos semejantes dan h² = p · q.
  const rect = (A, Bp, C, o = {}) => {
    const H = [C[0], 0], k = o.pasos || {};
    const p = H[0] - A[0], q = Bp[0] - H[0], h = C[1];
    return {
      alt: o.alt || `Triángulo rectángulo en C con hipotenusa ${f(Bp[0] - A[0])}: la altura mide ${f(h)} y parte la hipotenusa en ${f(p)} y ${f(q)}`,
      vista: o.vista || { x: [-0.8, 10.8], y: [-1, 5.6] },
      puntos: [pt('A', A, { rotulo: 'A', lado: -135 }), pt('B', Bp, { rotulo: 'B', lado: -45 }), pt('C', C, { rotulo: 'C', lado: 90 }), pt('H', H, { rotulo: 'H', lado: -90 })],
      regiones: o.tri ? [{ puntos: ['A', 'H', 'C'], color: 'o', opacidad: 0.18, desde: k.t1 || 0 }, { puntos: ['C', 'H', 'B'], color: 'i', opacidad: 0.18, desde: k.t2 || 0 }] : [],
      segmentos: [{ de: 'A', a: 'C', texto: o.lados ? o.lados[0] : undefined }, { de: 'C', a: 'B', texto: o.lados ? o.lados[1] : undefined },
        { de: 'A', a: 'H', color: 'o', grosor: 'variable', texto: o.sinPQ ? undefined : `p = ${f(p)}` }, { de: 'H', a: 'B', color: 'i', grosor: 'variable', texto: o.sinPQ ? undefined : `q = ${f(q)}` },
        { de: 'C', a: 'H', color: 'h', grosor: 'variable', texto: o.sinH ? 'h' : `h = ${f(h)}` }],
      angulos: [{ en: 'C', de: 'A', a: 'B' }, { en: 'H', de: 'B', a: 'C', color: 'h' }],
    };
  };
  const rectIdea = {
    id: 'triangulo-rectangulo',
    titulo: 'La altura y sus proyecciones',
    temas: ['Teorema de Pitágoras y relaciones en el triángulo rectángulo'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'C se mueve por la semicircunferencia de diámetro AB = 10: el ángulo C es recto. La altura CH parte la hipotenusa en p y q.',
      voz: 'Mueve C. Compara h con p y con q.',
      controles: [{ id: 'fi', etiqueta: 'C en el arco', min: 45, max: 135, paso: 15, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => { const C = [5 + 5 * Math.cos(U.rad(v.fi)), 5 * Math.sin(U.rad(v.fi))]; return { datos: rect([0, 0], [10, 0], C), estado: {} }; },
      lectura: v => { const C = [5 + 5 * Math.cos(U.rad(v.fi)), 5 * Math.sin(U.rad(v.fi))]; return [sup2({ v: 'c-h', t: 'h' }), ` = ${f(C[1] ** 2)} · `, { v: 'c-o', t: 'p' }, ' · ', { v: 'c-i', t: 'q' }, ` = ${f(C[0] * (10 - C[0]))}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Otro triángulo rectángulo: la altura sobre la hipotenusa la parte en p = 4 y q = 9. ¿Cuánto mide la altura h?',
      voz: 'Piensa en la relación que viste, no en el promedio.',
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'promedio', texto: '6,5', error: 'GE18', siFuera: '6,5 es el promedio de 4 y 9. La altura es la media geométrica: √(4 · 9).' },
        { id: 'suma', texto: '13', error: 'GE18', siFuera: '13 es la hipotenusa completa, p + q.' },
        { id: 'sin-raiz', texto: '36', error: 'GE18', siFuera: '36 es h², el producto p · q. Falta la raíz.' },
      ],
      dibujo: { datos: rect([0, 0], [13, 0], [4, 6], { sinH: true, vista: { x: [-0.8, 13.8], y: [-1, 7] } }), estado: {} },
      revelar: { datos: rect([0, 0], [13, 0], [4, 6], { vista: { x: [-0.8, 13.8], y: [-1, 7] } }), estado: {} },
      coincide: 'Coincide: h² = 4 · 9 = 36, así que h = 6.',
    },
    mira: {
      datos: rect([0, 0], [13, 0], [4, 6], { tri: true, lados: ['√52', '√117'], vista: { x: [-0.8, 13.8], y: [-1, 7] }, pasos: { t1: 1, t2: 1 }, alt: 'Los triángulos AHC y CHB son semejantes: de ahí h² = pq, y los catetos cumplen AC² = 13 · 4 y BC² = 13 · 9' }),
      voz: 'Dos triángulos semejantes dentro del grande.',
      pasos: [
        { estado: { corte: 1 }, texto: 'AHC y CHB tienen los mismos ángulos: son semejantes.', ecuacion: [frac({ v: 'c-o', t: 'p' }, { v: 'c-h', t: 'h' }), ' = ', frac({ v: 'c-h', t: 'h' }, { v: 'c-i', t: 'q' })] },
        { estado: { corte: 1 }, texto: 'De la proporción sale la altura.', ecuacion: [sup2({ v: 'c-h', t: 'h' }), ' = ', { v: 'c-o', t: 'p' }, ' · ', { v: 'c-i', t: 'q' }, ' = 36 → h = 6'] },
        { estado: { corte: 1 }, texto: 'Cada cateto al cuadrado: hipotenusa por su proyección.', ecuacion: ['AC² = 13 · 4 = 52 · BC² = 13 · 9 = 117'] },
        { estado: { corte: 1 }, texto: 'Sumando, aparece Pitágoras.', ecuacion: ['52 + 117 = 169 = 13²'] },
      ],
    },
    regla: {
      texto: 'En el triángulo rectángulo, la altura sobre la hipotenusa cumple h² = p · q, cada cateto al cuadrado es hipotenusa por su proyección, y a² + b² = c².',
      ecuacion: [sup2({ v: 'c-h', t: 'h' }), ' = ', { v: 'c-o', t: 'p' }, { v: 'c-i', t: 'q' }, '   ·   ', sup2('a'), ' = c · ', { v: 'c-i', t: 'q' }, '   ·   ', sup2('a'), ' + ', sup2('b'), ' = ', sup2('c')],
      condicion: 'el ángulo C es recto y c es la hipotenusa, opuesta a él; cada cateto se empareja con su propia proyección.',
      voz: 'Antes de usarlas, comprueba el ángulo recto.',
    },
    ahoraTu: {
      voz: 'Ubica p, q y h en la figura antes de operar.',
      generar(s) {
        const r = azar(s), k = r.ent(1, 3), [p, q] = r.de([[1, 4], [4, 9], [1, 9], [9, 16], [4, 25], [1, 16]]).map(x => x * k * k), h = Math.sqrt(p * q), t = s % 2;
        if (t === 0) return {
          pregunta: [`En un triángulo rectángulo, la altura sobre la hipotenusa la parte en `, { v: 'c-o', t: 'p' }, ` = ${p} y `, { v: 'c-i', t: 'q' }, ` = ${q}. ¿Cuánto mide la altura?`],
          opciones: opciones(h, [
            { id: 'prom', valor: (p + q) / 2, error: 'GE18', siFuera: 'Ese es el promedio; la altura es la media geométrica.' },
            { id: 'cuad', valor: p * q, error: 'GE18', siFuera: 'Ese es h²: falta la raíz.' },
            { id: 'cateto', valor: Math.sqrt(p * (p + q)), error: 'GE18', siFuera: 'Ese es un cateto: hipotenusa por su proyección.' },
          ], n => f(n)),
          solucion: { texto: 'La altura es media geométrica de las proyecciones.', ecuacion: [`h = √(${p} · ${q}) = ${f(h)}`] },
        };
        return {
          pregunta: [`En un triángulo rectángulo, la hipotenusa mide ${p + q} y la proyección de un cateto sobre ella, ${p}. ¿Cuánto mide ese cateto?`],
          opciones: opciones(Math.sqrt(p * (p + q)), [
            { id: 'otro', valor: Math.sqrt(q * (p + q)), error: 'GE18', siFuera: 'Esa usa la otra proyección: cada cateto va con la suya.' },
            { id: 'altura', valor: h, error: 'GE18', siFuera: 'Esa es la altura, √(p · q).' },
            { id: 'pit', valor: Math.sqrt((p + q) ** 2 - p * p), error: 'GE11', siFuera: 'Pitágoras con la proyección como cateto: la proyección no es un lado del triángulo.' },
          ], n => f(n)),
          solucion: { texto: 'Cateto al cuadrado: hipotenusa por su proyección.', ecuacion: [`√(${p + q} · ${p}) = ${f(Math.sqrt(p * (p + q)))}`] },
        };
      },
    },
  };

  // ---------- Idea 2: Euclides (proyección) ----------
  // Cambia: el ángulo B · Permanece: a = 8 y c = 5 · Progresa: b² frente a a² + c² ·
  // Se reserva: el ángulo obtuso (la proyección cae fuera) · Debe verse: el término 2am corrige a Pitágoras con signo.
  const euc = (B, o = {}) => {
    const A = U.polar([0, 0], 5, B), Cc = [8, 0], P = [A[0], 0], m = A[0], b = U.dist(A, Cc), k = o.pasos || {};
    return {
      alt: o.alt || `Lados a = 8 y c = 5 con ángulo B de ${B}°: la proyección de AB sobre BC mide ${f(Math.abs(m))} y b mide ${f(b)}`,
      vista: { x: [-3.4, 8.8], y: [-1.2, 5.6] },
      puntos: [pt('B', [0, 0], { rotulo: 'B', lado: m < 0 ? -40 : -140 }), pt('C', Cc, { rotulo: 'C', lado: -60 }), pt('A', A, { rotulo: 'A', lado: 90 }), pt('P', P, { rotulo: 'P', lado: m < 0 ? -140 : -40 })],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 }],
      segmentos: [{ de: 'B', a: 'C', color: 'd', grosor: 'variable', texto: 'a = 8', lado: -1 }, { de: 'B', a: 'A', color: 'o', grosor: 'variable', texto: 'c = 5' }, { de: 'A', a: 'C', color: 'h', grosor: 'variable', texto: o.sinB ? 'b' : `b ≈ ${f(b)}` },
        { de: 'A', a: 'P', discontinua: true, grosor: 'fino' }, { de: 'B', a: 'P', color: 'i', grosor: 'variable', texto: `m = ${f(Math.abs(m))}`, lado: 1, desde: k.m || 0 }],
      angulos: [{ en: 'B', de: 'C', a: 'A', color: 'o', texto: `${B}°`, radio: 20 }, { en: 'P', de: 'C', a: 'A' }],
    };
  };
  const euclides = {
    id: 'euclides',
    titulo: 'Pitágoras corregido: la proyección',
    temas: ['Teorema de Euclides o de la proyección'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Los lados a = 8 y c = 5 están fijos. Abre el ángulo B y compara b² con a² + c² = 89.',
      voz: 'Abre B poco a poco. Fíjate cuándo b² supera a 89.',
      controles: [{ id: 'B', etiqueta: '∠B', min: 30, max: 150, paso: 15, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: euc(v.B), estado: {} }),
      lectura: v => { const b2 = 89 - 80 * Math.cos(U.rad(v.B)); return [sup2({ v: 'c-h', t: 'b' }), ` = ${f(b2)} ${b2 < 89 - 1e-9 ? '<' : b2 > 89 + 1e-9 ? '>' : '='} 89`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Con ∠B = 120°, la proyección de AB sobre la recta BC mide m = 2,5 y cae fuera del lado. ¿Cuánto vale b²?',
      voz: 'La proyección cayó fuera. Decide qué signo toma.',
      opciones: [
        { id: 'c', texto: '129', correcta: true },
        { id: 'menos', texto: '49', error: 'GE-EUC1', siFuera: 'Restar 2am vale con ángulo agudo. Con B obtuso, la proyección cae fuera y se suma.' },
        { id: 'pit', texto: '89', error: 'GE11', siFuera: '89 sería cierto con B recto. Aquí B mide 120°.' },
        { id: 'sin2', texto: '109', error: 'GE-EUC2', siFuera: 'El signo está bien; el término lleva el 2: 2 · 8 · 2,5 = 40.' },
      ],
      dibujo: { datos: euc(120, { sinB: true }), estado: {} },
      revelar: { datos: euc(120), estado: {} },
      coincide: 'Coincide: b² = 64 + 25 + 2 · 8 · 2,5 = 129.',
    },
    mira: {
      datos: euc(120, { pasos: { m: 1 } }),
      voz: 'Arma dos triángulos rectángulos con la altura AP.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La altura AP cae fuera de BC: PB = m = 2,5.', ecuacion: ['AP² = c² − m² = 25 − 6,25'] },
        { estado: { corte: 1 }, texto: 'En el triángulo APC, PC = a + m.', ecuacion: [sup2({ v: 'c-h', t: 'b' }), ' = AP² + (a + m)²'] },
        { estado: { corte: 1 }, texto: 'Desarrollando, los m² se cancelan.', ecuacion: [sup2({ v: 'c-h', t: 'b' }), ' = a² + c² + 2am = 129'] },
      ],
    },
    regla: {
      texto: 'Si el ángulo B es agudo, el lado opuesto cumple b² = a² + c² − 2am; si es obtuso, b² = a² + c² + 2am, donde m es la proyección de c sobre a.',
      ecuacion: [sup2({ v: 'c-h', t: 'b' }), ' = ', sup2('a'), ' + ', sup2('c'), ' ∓ 2a', { v: 'c-i', t: 'm' }],
      condicion: 'm se mide sobre la recta de a; el ángulo B decide el signo. Si B es recto, m = 0: Pitágoras.',
      voz: 'El ángulo B decide el signo. Míralo primero.',
    },
    ahoraTu: {
      voz: 'Decide si B es agudo u obtuso por dónde cae la proyección.',
      generar(s) {
        const r = azar(s), a = r.ent(6, 14), c = r.ent(4, 10), m = r.ent(1, Math.min(c - 1, 5)), obt = s % 2 === 1;
        const b2 = a * a + c * c + (obt ? 2 : -2) * a * m;
        return {
          pregunta: [`En el triángulo ABC, a = ${a}, c = ${c} y el ángulo B es ${obt ? 'obtuso' : 'agudo'}. La proyección de c sobre la recta de a mide `, { v: 'c-i', t: 'm' }, ` = ${m}. ¿Cuánto vale b²?`],
          opciones: opciones(b2, [
            { id: 'signo', valor: a * a + c * c + (obt ? -2 : 2) * a * m, error: 'GE-EUC1', siFuera: obt ? 'Restar 2am vale con B agudo; aquí es obtuso.' : 'Sumar 2am vale con B obtuso; aquí es agudo.' },
            { id: 'pit', valor: a * a + c * c, error: 'GE11', siFuera: 'a² + c² sería cierto con B recto.' },
            { id: 'sin2', valor: a * a + c * c + (obt ? 1 : -1) * a * m, error: 'GE-EUC2', siFuera: 'El término de corrección lleva un 2: 2am.' },
          ], n => f(n, 0)),
          solucion: { texto: `B ${obt ? 'obtuso: se suma' : 'agudo: se resta'} 2am.`, ecuacion: [`${a}² + ${c}² ${obt ? '+' : '−'} 2 · ${a} · ${m} = ${b2}`] },
        };
      },
    },
  };

  // ---------- Idea 3: Stewart, mediana y bisectriz ----------
  // Cambia: el pie D de la ceviana · Permanece: a = 8, b = 7, c = 5 · Progresa: el largo d = AD ·
  // Se reserva: D en el punto medio (mediana) · Debe verse: Stewart pesa cada lado con el tramo opuesto.
  const A3 = porLados(8, 7, 5);
  const stew = (m, o = {}) => {
    const D = [m, 0], d = U.dist(A3, D), k = o.pasos || {};
    return {
      alt: o.alt || `Triángulo de lados a = 8, b = 7 y c = 5; la ceviana AD llega a ${f(m)} de B y mide ${f(d)}`,
      vista: { x: [-0.8, 8.8], y: [-1.2, 5.2] },
      puntos: [pt('B', [0, 0], { rotulo: 'B', lado: -120 }), pt('C', [8, 0], { rotulo: 'C', lado: -60 }), pt('A', A3, { rotulo: 'A', lado: 90 }), pt('D', D, { rotulo: 'D', color: 'h', lado: -90 })],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 }],
      segmentos: [{ de: 'A', a: 'B', texto: 'c = 5' }, { de: 'A', a: 'C', texto: 'b = 7' }, { de: 'A', a: 'D', color: 'h', grosor: 'variable', texto: o.sinD ? 'd' : `d ≈ ${f(d)}`, lado: -1 },
        { de: 'B', a: 'D', color: 'o', grosor: 'variable', texto: `m = ${f(m)}`, lado: -1, marcas: o.marcas ? 1 : 0 }, { de: 'D', a: 'C', color: 'i', grosor: 'variable', texto: `n = ${f(8 - m)}`, lado: -1, marcas: o.marcas ? 1 : 0 }],
    };
  };
  const stewart = {
    id: 'stewart',
    titulo: 'Una ceviana: Stewart',
    temas: ['Teoremas de Stewart y de la mediana', 'Longitud de la bisectriz'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La ceviana AD une A con un punto D de BC, que queda partido en m y n. Corre D y mira su largo d.',
      voz: 'Corre D por el lado. Observa el largo de AD.',
      controles: [{ id: 'm', etiqueta: 'm', min: 1, max: 7, paso: 0.5, inicio: 2, unidad: '', decimales: 1, color: 'c-o' }],
      dibujo: v => ({ datos: stew(v.m), estado: {} }),
      lectura: v => [{ v: 'c-h', t: 'd' }, ` ≈ ${f(U.dist(A3, [v.m, 0]))} · b²m + c²n = ${f(49 * v.m + 25 * (8 - v.m))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora D es el punto medio de BC: AD es la mediana. Con a = 8, b = 7 y c = 5, ¿cuánto mide la mediana?',
      voz: 'Antes de promediar, piensa en lo que pesa cada lado.',
      opciones: [
        { id: 'c', texto: '√21 ≈ 4,58', correcta: true },
        { id: 'prom', texto: '6', error: 'GE-MED1', siFuera: '6 es el promedio de b y c. La mediana también depende de a.' },
        { id: 'mitad', texto: '4', error: 'GE-MED1', siFuera: '4 es la mitad de a. Eso vale para la mediana a la hipotenusa de un triángulo rectángulo.' },
        { id: 'sin-a', texto: '√37 ≈ 6,08', error: 'GE-MED2', siFuera: '(b² + c²)/2 = 37 olvida restar a²/4.' },
      ],
      dibujo: { datos: stew(4, { sinD: true, marcas: true }), estado: {} },
      revelar: { datos: stew(4, { marcas: true }), estado: {} },
      coincide: 'Coincide: 4d² = 2 · 49 + 2 · 25 − 64 = 84, d² = 21.',
    },
    mira: {
      datos: stew(4, { marcas: true }),
      voz: 'Stewart con m = n: la fórmula de la mediana sale sola.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Stewart: cada lado al cuadrado se pesa con el tramo opuesto.', ecuacion: ['b²m + c²n = a(d² + mn)'] },
        { estado: { corte: 0 }, texto: 'Con m = n = 4 (mediana):', ecuacion: ['49 · 4 + 25 · 4 = 8(d² + 16)'] },
        { estado: { corte: 0 }, texto: 'Despeja d².', ecuacion: [sup2({ v: 'c-h', t: 'd' }), ' = ', frac('2b² + 2c² − a²', '4'), ' = 21'] },
      ],
    },
    regla: {
      texto: 'Stewart: b²m + c²n = a(d² + mn), con m junto a c y n junto a b. Mediana: 4d² = 2b² + 2c² − a². Bisectriz de A: d² = bc − mn.',
      ecuacion: [sup2('b'), { v: 'c-o', t: 'm' }, ' + ', sup2('c'), { v: 'c-i', t: 'n' }, ' = a(', sup2({ v: 'c-h', t: 'd' }), ' + ', { v: 'c-o', t: 'm' }, { v: 'c-i', t: 'n' }, ')'],
      condicion: 'D está en BC, con m = BD y n = DC. En la bisectriz, m y n cumplen m/n = c/b.',
      voz: 'Ubica bien m y n: cada uno va con el lado de enfrente.',
    },
    ahoraTu: {
      voz: 'Decide si es mediana, bisectriz o ceviana cualquiera.',
      generar(s) {
        const r = azar(s), t = s % 3;
        if (t === 0) {
          let a, b, c; do { a = 2 * r.ent(2, 7); b = r.ent(4, 12); c = r.ent(4, 12); } while (!(a < b + c && b < a + c && c < a + b));
          const d = Math.sqrt((2 * b * b + 2 * c * c - a * a) / 4);
          return {
            pregunta: [`Un triángulo tiene lados a = ${a}, b = ${b} y c = ${c}. ¿Cuánto mide la mediana relativa al lado a?`],
            opciones: opciones(d, [
              { id: 'prom', valor: (b + c) / 2, error: 'GE-MED1', siFuera: 'El promedio de b y c olvida el lado a.' },
              { id: 'sin-a', valor: Math.sqrt((b * b + c * c) / 2), error: 'GE-MED2', siFuera: 'Falta restar a²/4.' },
              { id: 'mitad', valor: a / 2, error: 'GE-MED1', siFuera: 'a/2 vale solo para la mediana a la hipotenusa.' },
            ], n => f(n)),
            solucion: { texto: '4d² = 2b² + 2c² − a².', ecuacion: [`d² = (2 · ${b}² + 2 · ${c}² − ${a}²)/4 = ${f(d * d)}`] },
          };
        }
        if (t === 1) {
          const [b, c, a] = r.de([[6, 3, 6], [12, 6, 12], [8, 4, 9], [10, 5, 9], [9, 6, 10], [12, 8, 15]]);
          const m = a * c / (b + c), n = a * b / (b + c), d = Math.sqrt(b * c - m * n);
          return {
            pregunta: [`En el triángulo ABC, b = ${b}, c = ${c} y a = ${a}. ¿Cuánto mide la bisectriz interior trazada desde A?`],
            opciones: opciones(d, [
              { id: 'bc', valor: Math.sqrt(b * c), error: 'GE-MED2', siFuera: '√(bc) olvida restar mn, el producto de los tramos.' },
              { id: 'med', valor: Math.sqrt((2 * b * b + 2 * c * c - a * a) / 4), error: 'GE8', siFuera: 'Esa es la mediana; la bisectriz llega a otro punto.' },
              { id: 'prom', valor: (b + c) / 2, error: 'GE-MED1', siFuera: 'El promedio de los lados no da la bisectriz.' },
            ], n2 => f(n2)),
            solucion: { texto: `Tramos: m = ${f(m)} y n = ${f(n)} (razón c : b).`, ecuacion: [`d² = ${b} · ${c} − ${f(m)} · ${f(n)} = ${f(d * d)}`] },
          };
        }
        let a, b, c; do { a = r.ent(6, 12); b = r.ent(4, 10); c = r.ent(4, 10); } while (!(a < b + c && b < a + c && c < a + b));
        const m = r.ent(1, a - 1), n = a - m, d2 = (b * b * m + c * c * n) / a - m * n;
        if (d2 <= 0) return this.generar(s + 3);
        return {
          pregunta: [`En el triángulo ABC, a = ${a}, b = ${b} y c = ${c}. D está en BC con BD = ${m} y DC = ${n}. ¿Cuánto vale AD²?`],
          opciones: opciones(d2, [
            { id: 'cruzado', valor: (b * b * n + c * c * m) / a - m * n, error: 'GE-MED3', siFuera: 'Ese cruza los tramos: b² va con m = BD, que está frente a b.' },
            { id: 'sin-mn', valor: (b * b * m + c * c * n) / a, error: 'GE-MED2', siFuera: 'Falta restar mn.' },
            { id: 'prom', valor: (b * b + c * c) / 2, error: 'GE-MED1', siFuera: 'Eso promedia los cuadrados sin usar dónde está D.' },
          ], n2 => f(n2)),
          solucion: { texto: 'Stewart: b² con BD, c² con DC.', ecuacion: [`AD² = (${b}² · ${m} + ${c}² · ${n})/${a} − ${m} · ${n} = ${f(d2)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: Herón ----------
  // Cambia: los lados b y c · Permanece: a = 14 · Progresa: el área por el semiperímetro ·
  // Se reserva: el 13-14-15 · Debe verse: con los tres lados basta, sin buscar la altura.
  const heronFig = (b, c, o = {}) => {
    const A = porLados(14, b, c), s = (14 + b + c) / 2, S = Math.sqrt(Math.max(0, s * (s - 14) * (s - b) * (s - c)));
    return {
      alt: o.alt || `Triángulo de lados 14, ${b} y ${c}: semiperímetro ${f(s)} y área ${f(S)}`,
      vista: { x: [-2, 16], y: [-1.4, 13] },
      puntos: [pt('B', [0, 0], { rotulo: 'B', lado: -120 }), pt('C', [14, 0], { rotulo: 'C', lado: -60 }), pt('A', A, { rotulo: 'A', lado: 90 }), pt('H', [A[0], 0], { sinPunto: true })],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'o', opacidad: 0.16 }],
      segmentos: [{ de: 'B', a: 'C', texto: '14', color: 'd' }, { de: 'C', a: 'A', texto: `${b}`, color: 'i' }, { de: 'A', a: 'B', texto: `${c}`, color: 'o' },
        ...(o.altura ? [{ de: 'A', a: 'H', color: 'h', discontinua: true, texto: `h = ${f(A[1])}`, lado: -1 }] : [])],
      angulos: o.altura ? [{ en: 'H', de: 'C', a: 'A', color: 'h' }] : [],
    };
  };
  const heron = {
    id: 'heron',
    titulo: 'Área con los tres lados',
    temas: ['Teorema de Herón'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La base mide 14. Cambia los otros dos lados y mira el semiperímetro s y el área que da la fórmula de Herón.',
      voz: 'Cambia un lado. Mira cómo responde el área.',
      controles: [
        { id: 'b', etiqueta: 'AC', min: 9, max: 15, paso: 1, inicio: 12, unidad: '', decimales: 0, color: 'c-i' },
        { id: 'c', etiqueta: 'AB', min: 9, max: 15, paso: 1, inicio: 10, unidad: '', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: heronFig(v.b, v.c), estado: {} }),
      lectura: v => { const s = (14 + v.b + v.c) / 2; return [`s = ${f(s)} · área = ${f(Math.sqrt(s * (s - 14) * (s - v.b) * (s - v.c)))}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Un triángulo tiene lados 13, 14 y 15. ¿Cuál es su área?',
      voz: 'Tienes solo los lados. Elige la herramienta.',
      opciones: [
        { id: 'c', texto: '84', correcta: true },
        { id: 'lados', texto: '91', error: 'GE-HER1', siFuera: '13 · 14 / 2 = 91 usaría un lado como altura; eso solo vale con ángulo recto.' },
        { id: 'perimetro', texto: '42', error: 'GE4', siFuera: '42 es el perímetro: mide el borde, no la región.' },
        { id: 'sin-raiz', texto: '7056', error: 'GE-HER2', siFuera: '7056 es el área al cuadrado: falta la raíz.' },
      ],
      dibujo: { datos: heronFig(15, 13), estado: {} },
      revelar: { datos: heronFig(15, 13, { altura: true }), estado: {} },
      coincide: 'Coincide: con la altura 12 sobre la base 14, también da 84.',
    },
    mira: {
      datos: heronFig(15, 13, { altura: true }),
      voz: 'Herón primero; la altura después, para comprobar.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Semiperímetro: la mitad del borde.', ecuacion: ['s = (13 + 14 + 15)/2 = 21'] },
        { estado: { corte: 0 }, texto: 'Resta cada lado de s.', ecuacion: ['s − a = 7 · s − b = 6 · s − c = 8'] },
        { estado: { corte: 0 }, texto: 'Multiplica y saca la raíz.', ecuacion: ['S = ', { raiz: ['21 · 7 · 6 · 8'] }, ' = ', { raiz: ['7056'] }, ' = 84'] },
        { estado: { corte: 0 }, texto: 'Comprueba con base y altura: 14 · 12 / 2.', ecuacion: ['S = 84'] },
      ],
    },
    regla: {
      texto: 'Con los tres lados a, b y c, y el semiperímetro s, el área del triángulo es la raíz de s(s − a)(s − b)(s − c).',
      ecuacion: ['S = ', { raiz: ['s(s − a)(s − b)(s − c)'] }, '   ·   s = ', frac('a + b + c', '2')],
      condicion: 'los tres lados forman un triángulo: cada uno es menor que la suma de los otros dos.',
      voz: 'Cuando no tienes la altura, Herón te la ahorra.',
    },
    ahoraTu: {
      voz: 'Calcula s primero; después las tres restas.',
      generar(s) {
        const r = azar(s), [a, b, c, S] = r.de([[5, 5, 6, 12], [5, 5, 8, 12], [13, 14, 15, 84], [9, 10, 17, 36], [7, 15, 20, 42], [10, 13, 13, 60], [5, 12, 13, 30], [8, 15, 17, 60], [9, 12, 15, 54], [6, 25, 29, 60], [13, 20, 21, 126]]), k = r.ent(1, 2);
        return {
          pregunta: [`Un triángulo tiene lados ${a * k}, ${b * k} y ${c * k}. ¿Cuál es su área?`],
          opciones: opciones(S * k * k, [
            { id: 'lados', valor: a * b * k * k / 2, error: 'GE-HER1', siFuera: 'Usar un lado como altura solo vale con ángulo recto entre ellos.' },
            { id: 'per', valor: (a + b + c) * k, error: 'GE4', siFuera: 'Ese es el perímetro.' },
            { id: 'sinraiz', valor: (S * k * k) ** 2, error: 'GE-HER2', siFuera: 'Ese es el área al cuadrado: falta la raíz.' },
            { id: 'k', valor: S * k, error: 'GE1', siFuera: 'Con los lados por k, el área va por k².' },
          ], n => f(n)),
          solucion: { texto: `s = ${f((a + b + c) * k / 2)}.`, ecuacion: [`S = √(s(s − a)(s − b)(s − c)) = ${S * k * k}`] },
        };
      },
    },
  };

  // ---------- Idea 5: cuerdas, secantes y tangente (potencia de un punto) ----------
  // Cambia: la inclinación de la cuerda por P · Permanece: P y la circunferencia · Progresa: PA · PB constante ·
  // Se reserva: P fuera con una tangente · Debe verse: PT² = PA · PB por triángulos semejantes.
  const R5 = 3;
  const cuerda = (P, t) => {
    const u = [Math.cos(U.rad(t)), Math.sin(U.rad(t))], pu = P[0] * u[0] + P[1] * u[1], disc = Math.sqrt(pu * pu - (P[0] ** 2 + P[1] ** 2 - R5 * R5));
    return [U.mezcla(P, [P[0] + u[0], P[1] + u[1]], -pu - disc), U.mezcla(P, [P[0] + u[0], P[1] + u[1]], -pu + disc)];
  };
  const dentroFig = t => {
    const P = [1.2, 0.4], [A, Bq] = cuerda(P, t), [C2, D2] = cuerda(P, 100);
    return {
      alt: `P dentro de la circunferencia: para cualquier cuerda por P, PA · PB vale ${f(R5 * R5 - P[0] ** 2 - P[1] ** 2)}`,
      vista: { x: [-3.6, 3.6], y: [-3.4, 3.4] },
      puntos: [pt('O', [0, 0], { sinPunto: true }), pt('P', P, { rotulo: 'P', color: 'h', lado: -60 }), pt('A', A, { rotulo: 'A' }), pt('B', Bq, { rotulo: 'B' }), pt('C', C2, { rotulo: 'C' }), pt('D', D2, { rotulo: 'D' })],
      circulos: [{ centro: 'O', r: R5 }],
      segmentos: [{ de: 'P', a: 'A', color: 'o', grosor: 'variable', texto: f(U.dist(P, A)) }, { de: 'P', a: 'B', color: 'i', grosor: 'variable', texto: f(U.dist(P, Bq)) },
        { de: 'C', a: 'D', grosor: 'fino', discontinua: true }],
    };
  };
  const PO = Math.sqrt(45), P5 = [-PO, 0], al = U.grados(Math.asin(Math.sqrt(9 - 6.25) / PO));
  const fuera = (o = {}) => {
    const u = U.polar([0, 0], 1, al), A = [P5[0] + 4 * u[0], P5[1] + 4 * u[1]], Bq = [P5[0] + 9 * u[0], P5[1] + 9 * u[1]], T = U.polar([0, 0], R5, 180 - U.grados(Math.acos(R5 / PO))), k = o.pasos || {};
    return {
      alt: o.alt || 'Desde P, fuera de la circunferencia, una secante con PA = 4 y PB = 9 y una tangente PT',
      vista: { x: [-7.4, 3.6], y: [-3.4, 3.6] },
      puntos: [pt('O', [0, 0], { sinPunto: true }), pt('P', P5, { rotulo: 'P', color: 'h', lado: 180 }), pt('A', A, { rotulo: 'A', lado: -80 }), pt('B', Bq, { rotulo: 'B', lado: 0 }), pt('T', T, { rotulo: 'T', lado: 100 })],
      circulos: [{ centro: 'O', r: R5 }],
      regiones: o.tri ? [{ puntos: ['P', 'T', 'A'], color: 'o', opacidad: 0.2, desde: k.t1 || 0 }, { puntos: ['P', 'B', 'T'], color: 'i', opacidad: 0.12, desde: k.t2 || 0 }] : [],
      segmentos: [{ de: 'P', a: 'A', color: 'o', grosor: 'variable', texto: '4', lado: -1 }, { de: 'A', a: 'B', color: 'i', grosor: 'variable', texto: '5', lado: -1 },
        { de: 'P', a: 'T', color: 'h', grosor: 'variable', texto: o.sinT ? 'PT' : 'PT = 6' }, ...(o.tri ? [{ de: 'T', a: 'A', grosor: 'fino', desde: k.t1 || 0 }, { de: 'T', a: 'B', grosor: 'fino', desde: k.t2 || 0 }] : [])],
      angulos: o.tri ? [{ en: 'B', de: 'P', a: 'T', color: 'd', rayita: 1, radio: 26, desde: k.ang || 0 }, { en: 'T', de: 'P', a: 'A', color: 'd', rayita: 1, radio: 26, desde: k.ang || 0 }] : [],
    };
  };
  const potencia = {
    id: 'potencia',
    titulo: 'Cuerdas, secantes y tangente',
    temas: ['Cuerdas, secantes y tangente'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Por el punto P pasa una cuerda AB. Gírala y compara los dos tramos PA y PB con su producto.',
      voz: 'Gira la cuerda. Uno crece, el otro baja: mira el producto.',
      controles: [{ id: 't', etiqueta: 'giro', min: 0, max: 150, paso: 15, inicio: 30, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: dentroFig(v.t), estado: {} }),
      lectura: v => { const [A, Bq] = cuerda([1.2, 0.4], v.t); return [{ v: 'c-o', t: 'PA' }, ' · ', { v: 'c-i', t: 'PB' }, ` = ${f(U.dist([1.2, 0.4], A))} · ${f(U.dist([1.2, 0.4], Bq))} = ${f(U.dist([1.2, 0.4], A) * U.dist([1.2, 0.4], Bq))}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora P está fuera: una secante corta en A y B, con PA = 4 y PB = 9, y otra recta es tangente en T. ¿Cuánto mide PT?',
      voz: 'La tangente es una secante con sus dos puntos juntos.',
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'prom', texto: '6,5', error: 'GE-POT1', siFuera: '6,5 es el promedio de 4 y 9. La tangente es la media geométrica.' },
        { id: 'cuerda', texto: '5', error: 'GE-POT2', siFuera: '5 es la cuerda AB, el tramo interior.' },
        { id: 'interior', texto: '√20', error: 'GE-POT2', siFuera: 'Eso usa PA · AB; la potencia multiplica PA por la secante completa PB.' },
      ],
      dibujo: { datos: fuera({ sinT: true }), estado: {} },
      revelar: { datos: fuera(), estado: {} },
      coincide: 'Coincide: PT² = PA · PB = 36.',
    },
    mira: {
      datos: fuera({ tri: true, pasos: { ang: 1, t1: 2, t2: 2 }, alt: 'Los triángulos PTA y PBT son semejantes: comparten P y tienen un ángulo igual (semiinscrito e inscrito)' }),
      voz: 'Dos triángulos con el ángulo P común.',
      pasos: [
        { estado: { corte: 1 }, texto: '∠PTA (semiinscrito) y ∠PBT (inscrito) abarcan el arco AT.', ecuacion: ['∠PTA = ∠PBT'] },
        { estado: { corte: 2 }, texto: 'Con ∠P común, PTA y PBT son semejantes.', ecuacion: [frac('PT', 'PA'), ' = ', frac('PB', 'PT')] },
        { estado: { corte: 2 }, texto: 'Multiplica en cruz.', ecuacion: ['PT² = PA · PB = 4 · 9 = 36'] },
      ],
    },
    regla: {
      texto: 'Por un punto P, el producto de los dos tramos de cualquier cuerda o secante es constante. Con una tangente, ese producto es su cuadrado.',
      ecuacion: [{ v: 'c-o', t: 'PA' }, ' · ', { v: 'c-i', t: 'PB' }, ' = PC · PD   ·   ', sup2({ v: 'c-h', t: 'PT' }), ' = PA · PB'],
      condicion: 'los tramos se miden desde P hasta cada punto de corte; fuera, PB es la secante completa, no la cuerda.',
      voz: 'Mide siempre desde P. Ahí está la trampa.',
    },
    ahoraTu: {
      voz: 'Mide desde P: tramo cercano por tramo lejano.',
      generar(s) {
        const r = azar(s), t = s % 3;
        if (t === 0) {
          const a = r.ent(2, 9), b = r.ent(2, 9), c = r.ent(1, 9), d = a * b / c;
          return {
            pregunta: [`Dos cuerdas se cortan en P. Una queda partida en PA = ${a} y PB = ${b}; la otra, en PC = ${c} y PD. ¿Cuánto mide PD?`],
            opciones: opciones(d, [
              { id: 'suma', valor: a + b - c, error: 'GE-POT3', siFuera: 'Igualar las cuerdas completas no vale; se igualan los productos.' },
              { id: 'razon', valor: a * c / b, error: 'GE-POT3', siFuera: 'Esa proporción empareja mal los tramos.' },
              { id: 'prom', valor: (a + b) / 2, error: 'GE-POT1', siFuera: 'El promedio no aparece en la potencia.' },
            ], n => f(n)),
            solucion: { texto: 'Producto de los tramos de cada cuerda.', ecuacion: [`${a} · ${b} = ${c} · PD → PD = ${f(d)}`] },
          };
        }
        const pa = r.ent(2, 8), ab = r.ent(2, 10), pb = pa + ab;
        if (t === 1) return {
          pregunta: [`Desde P, fuera de la circunferencia, una secante corta en A y B con PA = ${pa} y AB = ${ab}. ¿Cuánto mide la tangente PT?`],
          opciones: opciones(Math.sqrt(pa * pb), [
            { id: 'cuerda', valor: Math.sqrt(pa * ab), error: 'GE-POT2', siFuera: 'Usa la secante completa PB, no la cuerda AB.' },
            { id: 'prom', valor: (pa + pb) / 2, error: 'GE-POT1', siFuera: 'La tangente es media geométrica, no aritmética.' },
            { id: 'sinraiz', valor: pa * pb, error: 'GE-POT1', siFuera: 'Ese es PT²: falta la raíz.' },
          ], n => f(n)),
          solucion: { texto: `PB = ${pa} + ${ab} = ${pb}.`, ecuacion: [`PT = √(${pa} · ${pb}) = ${f(Math.sqrt(pa * pb))}`] },
        };
        const pc = r.ent(2, 8), pd = pa * pb / pc;
        return {
          pregunta: [`Desde P salen dos secantes: una con PA = ${pa} y AB = ${ab}; la otra con PC = ${pc}. ¿Cuánto mide PD, la secante completa?`],
          opciones: opciones(pd, [
            { id: 'cuerda', valor: pa * ab / pc, error: 'GE-POT2', siFuera: 'Usa PB completa, no la cuerda AB.' },
            { id: 'resta', valor: pd - pc, error: 'GE-POT2', siFuera: 'Ese es CD, la cuerda; se pide PD completa.' },
            { id: 'suma', valor: pb - pc + pa, error: 'GE-POT3', siFuera: 'La potencia iguala productos, no sumas.' },
          ], n => f(n)),
          solucion: { texto: 'Exterior por secante completa, en las dos.', ecuacion: [`${pa} · ${pb} = ${pc} · PD → PD = ${f(pd)}`] },
        };
      },
    },
  };

  // ---------- Idea 6: Ptolomeo y Viette ----------
  // Cambia: D sobre la circunferencia · Permanece: A, B y C · Progresa: AC · BD frente a AB · CD + AD · BC ·
  // Se reserva: D fuera de la circunferencia · Debe verse: la igualdad es la marca del cuadrilátero inscrito.
  const R6 = 3, en = g => U.polar([0, 0], R6, g);
  const cuad = (D, o = {}) => {
    const A = en(210), Bq = en(120), C = en(30), L = (p, q) => U.dist(p, q);
    const izq = L(A, C) * L(Bq, D), der = L(A, Bq) * L(C, D) + L(A, D) * L(Bq, C);
    return {
      d: {
        alt: o.alt || `Cuadrilátero ABCD: AC · BD = ${f(izq)} y AB · CD + AD · BC = ${f(der)}`,
        vista: { x: [-3.8, 3.8], y: [-3.8, 3.6] },
        puntos: [pt('O', [0, 0], { sinPunto: true }), pt('A', A, { rotulo: 'A', lado: 210 }), pt('B', Bq, { rotulo: 'B', lado: 120 }), pt('C', C, { rotulo: 'C', lado: 30 }), pt('D', D, { rotulo: 'D', color: 'o', lado: -60 })],
        circulos: [{ centro: 'O', r: R6, grosor: 'fino' }],
        regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'i', opacidad: 0.08 }],
        segmentos: [{ de: 'A', a: 'B', color: 'o' }, { de: 'B', a: 'C', color: 'i' }, { de: 'C', a: 'D', color: 'o' }, { de: 'D', a: 'A', color: 'i' }, { de: 'A', a: 'C', color: 'h', grosor: 'variable' }, { de: 'B', a: 'D', color: 'h', grosor: 'variable' }],
      },
      izq, der,
    };
  };
  const rectP = (o = {}) => {
    const P = [30, 150, 210, 330].map(en), k = o.pasos || {};
    return {
      alt: 'Rectángulo inscrito de lados 3√3 y 3 con diagonales de 6: Ptolomeo da 6 · 6 = 3√3 · 3√3 + 3 · 3, es decir, Pitágoras',
      vista: { x: [-3.8, 3.8], y: [-3.6, 3.6] },
      puntos: [pt('O', [0, 0], { sinPunto: true }), ...P.map((p, i) => pt('ABCD'[i], p, { rotulo: 'ABCD'[i] }))],
      circulos: [{ centro: 'O', r: R6, grosor: 'fino' }],
      segmentos: [{ de: 'A', a: 'B', color: 'o', texto: '3√3' }, { de: 'B', a: 'C', color: 'i', texto: '3' }, { de: 'C', a: 'D', color: 'o', texto: '3√3' }, { de: 'D', a: 'A', color: 'i', texto: '3' },
        { de: 'A', a: 'C', color: 'h', grosor: 'variable', desde: k.d || 0 }, { de: 'B', a: 'D', color: 'h', grosor: 'variable', desde: k.d || 0 }],
      angulos: [{ en: 'A', de: 'B', a: 'D' }],
    };
  };
  const ptolomeo = {
    id: 'ptolomeo',
    titulo: 'Diagonales del cuadrilátero inscrito',
    temas: ['Teoremas de Ptolomeo y Viette'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'A, B, C y D están en la circunferencia. Corre D por su arco y compara AC · BD con AB · CD + AD · BC.',
      voz: 'Corre D. Comprueba las dos cuentas cada vez.',
      controles: [{ id: 'g', etiqueta: 'D en el arco', min: 240, max: 360, paso: 20, inicio: 300, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: cuad(en(v.g)).d, estado: {} }),
      lectura: v => { const q = cuad(en(v.g)); return [{ v: 'c-h', t: 'AC · BD' }, ` = ${f(q.izq)} · suma = ${f(q.der)}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora D se mete dentro de la circunferencia. ¿Cómo queda AC · BD frente a AB · CD + AD · BC?',
      voz: 'D dejó el círculo. Revisa si la igualdad sobrevive.',
      opciones: [
        { id: 'c', texto: 'Menor que la suma', correcta: true },
        { id: 'igual', texto: 'Igual, como antes', error: 'GE-PTO1', siFuera: 'Igual sería cierto con D en la circunferencia. Fuera de ella, la igualdad se pierde.' },
        { id: 'mayor', texto: 'Mayor que la suma', error: 'GE-PTO1', siFuera: 'El producto de diagonales nunca supera la suma: la igualdad es el caso extremo.' },
      ],
      dibujo: { datos: cuad([0.6, -1.4]).d, estado: {} },
      revelar: { datos: Object.assign(cuad([0.6, -1.4]).d, { rotulos: [{ x: 0, y: -3.55, texto: `${f(cuad([0.6, -1.4]).izq)} < ${f(cuad([0.6, -1.4]).der)}`, color: 'h' }] }), estado: {} },
      coincide: 'Coincide: solo el cuadrilátero inscrito alcanza la igualdad.',
    },
    mira: {
      datos: rectP({ pasos: { d: 1 } }),
      voz: 'Pon a prueba a Ptolomeo en un rectángulo.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Un rectángulo siempre es inscriptible: lados 3√3 y 3.', ecuacion: ['AB = CD = 3√3 · BC = DA = 3'] },
        { estado: { corte: 1 }, texto: 'Sus diagonales son diámetros: miden 6.', ecuacion: ['AC = BD = 6'] },
        { estado: { corte: 1 }, texto: 'Ptolomeo aquí es Pitágoras.', ecuacion: ['6 · 6 = 3√3 · 3√3 + 3 · 3 → 36 = 27 + 9'] },
      ],
    },
    regla: {
      texto: 'En un cuadrilátero inscrito, el producto de las diagonales es la suma de los productos de lados opuestos (Ptolomeo). Viette da su cociente.',
      ecuacion: ['AC · BD = AB · CD + AD · BC   ·   ', frac('AC', 'BD'), ' = ', frac('AB · AD + CB · CD', 'BA · BC + DA · DC')],
      condicion: 'los cuatro vértices están en una circunferencia, en el orden A, B, C, D. Fuera de ella, AC · BD queda menor.',
      voz: 'Primero comprueba que es inscrito. Después multiplica.',
    },
    ahoraTu: {
      voz: 'Escribe los pares de lados opuestos antes de operar.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const ab = r.ent(2, 9), bc = r.ent(2, 9), cd = r.ent(2, 9), da = r.ent(2, 9), ac = r.ent(Math.max(Math.abs(ab - bc), Math.abs(cd - da)) + 1, Math.min(ab + bc, cd + da) - 1);
          if (!(ac > 0)) return this.generar(s + 2);
          const bd = (ab * cd + da * bc) / ac;
          return {
            pregunta: [`ABCD está inscrito en una circunferencia: AB = ${ab}, BC = ${bc}, CD = ${cd}, DA = ${da} y la diagonal AC = ${ac}. ¿Cuánto mide BD?`],
            opciones: opciones(bd, [
              { id: 'consec', valor: (ab * bc + cd * da) / ac, error: 'GE-PTO2', siFuera: 'Ptolomeo multiplica lados opuestos (AB con CD), no consecutivos.' },
              { id: 'igual', valor: ac, error: 'GE-PTO2', siFuera: 'Las diagonales son iguales solo en casos especiales, como el rectángulo.' },
              { id: 'suma', valor: ab * cd + da * bc, error: 'GE-PTO2', siFuera: 'Esa es la suma de productos; falta dividir entre AC.' },
            ], n => f(n)),
            solucion: { texto: 'Ptolomeo: diagonales contra lados opuestos.', ecuacion: [`${ac} · BD = ${ab} · ${cd} + ${da} · ${bc} → BD = ${f(bd)}`] },
          };
        }
        const ab = r.ent(2, 9), bc = r.ent(2, 9), cd = r.ent(2, 9), da = r.ent(2, 9);
        const q = (ab * da + bc * cd) / (ab * bc + da * cd);
        return {
          pregunta: [`ABCD está inscrito en una circunferencia, con AB = ${ab}, BC = ${bc}, CD = ${cd} y DA = ${da}. ¿Cuánto vale AC/BD?`],
          opciones: opciones(q, [
            { id: 'inv', valor: 1 / q, error: 'GE-PTO2', siFuera: 'Esa es BD/AC: arriba van los lados que tocan a A y a C.' },
            { id: 'uno', valor: 1, error: 'GE-PTO2', siFuera: 'Valdría 1 solo si las diagonales fueran iguales.' },
            { id: 'opuestos', valor: (ab * cd) / (da * bc), error: 'GE-PTO2', siFuera: 'Viette usa productos de lados que comparten vértice con cada diagonal.' },
          ], n => f(n)),
          solucion: { texto: 'Viette: arriba, los lados que salen de A y de C.', ecuacion: [`AC/BD = (${ab} · ${da} + ${bc} · ${cd}) / (${ab} · ${bc} + ${da} · ${cd}) = ${f(q)}`] },
        };
      },
    },
  };

  return {
    unidad: 'geometria.relaciones-metricas',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'La tablilla babilónica YBC 7289, en Yale, dibuja un cuadrado con sus diagonales y anota una aproximación muy precisa de la raíz de dos. Muestra una práctica de cálculo anterior a los textos griegos, pero no una demostración general. Resolver un caso, tener una regla y justificarla para todos los triángulos rectángulos son tres cosas distintas.',
      pregunta: '¿Qué agrega una demostración a un cálculo que ya funciona?',
      fuente: { titulo: 'Euclides, Elementos I.47 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/propI47.html' },
    },
    ideas: [rectIdea, euclides, stewart, heron, potencia, ptolomeo],
  };
});
