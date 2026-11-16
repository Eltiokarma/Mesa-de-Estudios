/*
 * Teoría de «Vectores» (fisica.vectores), unidad nueva del 16 nov: sale de «Magnitudes y vectores», que Gerson eligió
 * partir en dos. Molde de docs/teoria.md. Ideas, mesas y glosario movidos tal cual desde magnitudes-y-vectores.js; el
 * vector unitario y las componentes van antes de sumar. Pendiente (docs/plan-calidad.md, etapa 1): la idea «escalar o
 * vector» y pasar cada idea por el contrato «se entiende sin profesor».
 * Colores (regla 4), los mismos en control, figura, texto y ecuación:
 *   A naranja (c-o), B turquesa (c-i), la resultante R y el unitario û verde (c-d), el ángulo θ rojo (c-h).
 * Códigos de error nuevos (hipótesis, sin dato empírico propio; matriz: «sumar módulos ignorando el ángulo»,
 * «aplicar el producto escalar donde se pide el vectorial»):
 *   V-SUMA suma módulos · V-RESTA resta módulos · V-PITAGORAS usa Pitágoras sin ángulo recto · V-COS signo del coseno
 *   U-SUMA divide entre la suma de componentes · U-CAMBIO cruza componentes · U-UNOS toma î + ĵ como unitario
 *   PE-MODULOS producto sin ángulo · PE-VECTOR confunde escalar con vectorial · PE-ORDEN orden del producto cruz
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // nucleo/fisica3d.js arma la mesa 3D «Flechas en el espacio» con el motor de plantillas/vectores (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/fisica3d.js')) : fabrica(root.Kit, root.Fisica3D);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, F3) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const A = { v: 'c-o', t: 'A' }, B = { v: 'c-i', t: 'B' }, R = { v: 'c-d', t: 'R' }, th = { v: 'c-h', t: 'θ' };
  const k = { v: 'c-h', t: 'k' }, u = { v: 'c-d', t: 'û' };
  const vA = { vec: A }, vB = { vec: B };
  const rad = g => g * Math.PI / 180;
  const cosG = g => (g % 180 === 90 ? 0 : Math.cos(rad(g)));
  const senG = g => (g % 180 === 0 ? 0 : Math.sin(rad(g)));
  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de la figura (flechas.geometria) y su
  // inversa (Xi, Yi) da las unidades del problema; el lector ajusta cada valor al paso y al rango de su control.
  const FL = () => Kit.piezas.flechas;
  // Ángulo de un punto visto desde un origen, entre 0° y 180° (lo que queda bajo el eje se pega al eje más cercano).
  const anguloDe = (o, q) => {
    const dx = q[0] - o[0], dy = q[1] - o[1];
    if (dy < 0) return dx >= 0 ? 0 : 180;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  };
  // Una guía con paso 99 no se dibuja, pero cuenta para la escala: así la figura no se encoge mientras se arrastra.
  const marco = (de, a) => ({ de, a, paso: 99 });
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  // La correcta primero; los distractores que repiten un texto o no son finitos se descartan.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (typeof d.valor === 'number' && !Number.isFinite(d.valor)) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Idea 3: la resultante depende del ángulo ----------
  // Cambia: el ángulo θ entre A y B · Permanece: los módulos (A = 6, B = 4) y el círculo donde puede caer la punta de B ·
  // Progresa: el largo de R, de A − B a A + B · Se reserva: el ángulo recto, donde vale Pitágoras ·
  // Debe verse: R va de la cola de A a la punta de B puesta a continuación.
  const colaPunta = (a, b, g, o = {}) => {
    const tip = [a + b * cosG(g), b * senG(g)], r = Math.hypot(...tip);
    // Media vuelta: dónde puede caer la punta de B con θ entre 0° y 180° (fija la escala mientras se juega).
    const circ = Array.from({ length: 19 }, (_, i) => [a + b * Math.cos(i * Math.PI / 18), b * Math.sin(i * Math.PI / 18)]);
    return {
      datos: {
        unidad: 'u',
        contorno: o.circulo === false ? undefined : circ,
        flechas: [
          { de: [0, 0], a: [a, 0], color: 'o', rotulo: 'A', valor: o.valores === false ? undefined : `${f(a, 0)}` },
          { de: [a, 0], a: tip, color: 'i', rotulo: 'B', valor: o.valores === false ? undefined : `${f(b, 0)}`, paso: o.pasoB || 0 },
        ],
        angulos: g > 0 && g < 180 ? [{ en: [a, 0], de: 0, a: g, texto: `${f(g, 0)}°`, color: 'h', paso: o.pasoB || 0 }] : [],
        guias: [{ de: [a, 0], a: [a + b + 0.5, 0], color: 'h', paso: o.pasoB || 0 }, ...(o.marco ? [marco(...o.marco)] : [])],
        resultante: { de: [0, 0], a: tip, color: 'd', rotulo: 'R', valor: o.sinR ? undefined : `${f(r, 2)}`, paso: o.pasoR === undefined ? 0 : o.pasoR },
      },
      estado: { paso: o.paso === undefined ? 9 : o.paso },
      r,
    };
  };
  // El juego fija la escala con el B más largo (6): así la punta de B sigue al dedo sin que la figura se encoja.
  const MARCO_R = [[0, 0], [12.5, 6]];
  const juegoR = val => colaPunta(6, val.b, val.g, { valores: false, marco: MARCO_R });
  const resultante = {
    id: 'resultante',
    titulo: 'La resultante depende del ángulo',
    pregunta: '¿Por qué 3 + 4 no siempre da 7 cuando sumas flechas?',
    temas: ['Suma de vectores por el método gráfico'],
    pieza: 'flechas',
    juega: {
      consigna: 'B gira sola sobre la punta de A. Mira cómo R se estira hasta A + B y se encoge hasta A − B.',
      voz: 'Mira entre qué valores se mueve R.',
      controles: [
        { id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 30, inicio: 60, unidad: '°', decimales: 0, auto: { velocidad: 30, modo: 'rebota' } },
        { id: 'b', etiqueta: 'B', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: val => { const c = juegoR(val); return { datos: c.datos, estado: c.estado }; },
      lectura: val => [th, ` = ${f(val.g, 0)}° → `, R, ` = ${f(colaPunta(6, val.b, val.g).r, 2)}  (A + B = ${f(6 + val.b, 0)})`],
      minimo: 4,
      // Arrastra la punta de B: su giro es θ y su distancia a la punta de A es el largo de B.
      arrastres: [
        { id: 'punta-b', etiqueta: 'punta de B', color: 'c-i',
          donde: val => { const g = FL().geometria(juegoR(val).datos), tip = [6 + val.b * cosG(val.g), val.b * senG(val.g)]; return { x: g.X(tip[0]), y: g.Y(tip[1]) }; },
          mover: (pt, val) => {
            const g = FL().geometria(juegoR(val).datos), q = [g.Xi(pt.x), g.Yi(pt.y)];
            return { g: anguloDe([6, 0], q), b: Math.hypot(q[0] - 6, Math.max(0, q[1])) };
          } },
      ],
    },
    predice: {
      pregunta: ['Dos fuerzas de ', A, ' = 3 N y ', B, ' = 4 N forman un ángulo ', th, ' = 90°. ¿Cuánto mide la resultante?'],
      opciones: [
        { id: 'c', texto: '5 N', correcta: true },
        { id: 'suma', texto: '7 N', error: 'V-SUMA', siFuera: '3 + 4 = 7 sería cierto si apuntaran al mismo lado (θ = 0°).' },
        { id: 'resta', texto: '1 N', error: 'V-RESTA', siFuera: '4 − 3 = 1 sería cierto si apuntaran en sentidos opuestos (θ = 180°).' },
        { id: 'raiz', texto: '√7 N', error: 'V-PITAGORAS', siFuera: 'Pitágoras es la idea; pero se suman los cuadrados: 9 + 16.' },
      ],
      dibujo: (() => { const c = colaPunta(3, 4, 90, { circulo: false, sinR: true, pasoR: 9, paso: 0 }); return { datos: c.datos, estado: c.estado }; })(),
      revelar: (() => { const c = colaPunta(3, 4, 90, { circulo: false }); return { datos: c.datos, estado: c.estado }; })(),
      coincide: 'Coincide: A, B y R forman un triángulo rectángulo de lados 3, 4 y 5.',
    },
    mira: {
      datos: colaPunta(6, 4, 60, { circulo: false, pasoB: 1, pasoR: 2 }).datos,
      pasos: [
        { estado: { paso: 0 }, texto: 'A es una magnitud vectorial: se dibuja con su largo, 6 unidades.', ecuacion: [A, ' = 6'] },
        { estado: { paso: 1 }, texto: 'B empieza en la punta de A, sin cambiar largo ni dirección.', ecuacion: [B, ' = 4,   ', th, ' = 60°'] },
        { estado: { paso: 2 }, texto: 'R une la cola de A con la punta de B.', ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }, ' + 2', A, B, ' cos ', th] },
        { estado: { paso: 2, final: true }, texto: 'Con cos 60° = 0,5: R² = 36 + 16 + 24.', ecuacion: [R, ` = √76 ≈ ${f(Math.sqrt(76), 2)}`] },
      ],
    },
    regla: {
      texto: 'Los vectores se suman poniéndolos uno a continuación del otro. El módulo de R depende del ángulo, y queda entre A − B y A + B.',
      ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }, ' + ', { llave: ['2', A, B, ' cos ', th], nota: 'lo que pone θ', color: 'c-h' }],
      condicion: 'θ es el ángulo entre A y B puestos con el mismo origen; con θ = 90° queda Pitágoras.',
    },
    ahoraTu: {
      pieza: 'flechas',
      generar(s) {
        const r = azar(s);
        const [a, b, g] = r.de([[3, 4, 90], [6, 8, 90], [5, 5, 60], [5, 3, 120], [6, 6, 120], [4, 4, 0], [7, 3, 180], [8, 6, 60], [5, 12, 90]]);
        const c = colaPunta(a, b, g, { circulo: false, sinR: true, paso: 1, pasoR: 9 });
        const ops = opciones(c.r, [
          { id: 'suma', valor: a + b, error: 'V-SUMA', siFuera: 'Sumar módulos vale solo si apuntan al mismo lado.' },
          { id: 'resta', valor: Math.abs(a - b), error: 'V-RESTA', siFuera: 'Restar módulos vale solo si apuntan en sentidos opuestos.' },
          { id: 'pita', valor: Math.hypot(a, b), error: 'V-PITAGORAS', siFuera: 'Pitágoras vale solo con 90°; aquí falta el término del coseno.' },
          { id: 'cos', valor: Math.sqrt(Math.max(0, a * a + b * b - 2 * a * b * cosG(g))), error: 'V-COS', siFuera: 'Ese signo del coseno es el del lado de un triángulo, no el de la suma.' },
        ], x => `${f(x, 2)} u`);
        return {
          pregunta: ['Dos vectores de ', A, ` = ${f(a, 0)} u y `, B, ` = ${f(b, 0)} u forman `, th, ` = ${f(g, 0)}°. ¿Cuánto mide la resultante?`],
          dibujo: { datos: c.datos, estado: { paso: 1 } },
          opciones: ops,
          solucion: {
            texto: `cos ${f(g, 0)}° = ${f(cosG(g), 1)}; se reemplaza en la ley de la suma.`,
            ecuacion: [R, ` = √(${f(a * a, 0)} + ${f(b * b, 0)} + 2 · ${f(a, 0)} · ${f(b, 0)} · cos ${f(g, 0)}°) = √(${f(a * a, 0)} + ${f(b * b, 0)} + 2 · ${f(a, 0)} · ${f(b, 0)} · ${f(cosG(g), 1)}) = ${f(c.r, 2)} u`],
            dibujo: { datos: colaPunta(a, b, g, { circulo: false }).datos, estado: { paso: 9, final: true } },
          },
        };
      },
    },
  };

  // ---------- Idea 4: componentes y vector unitario ----------
  // Cambia: las componentes Aₓ y Aᵧ · Permanece: los ejes de −4 a 4 ·
  // Progresa: el largo de A (Pitágoras) · Se reserva: A = 0, que no tiene unitario ·
  // Debe verse: û apunta igual que A y mide 1; se obtiene dividiendo cada componente entre |A|.
  // Ejes de −4 a 4 dibujados como guías: fijan la escala mientras se juega y no tapan al unitario.
  const EJES = [{ de: [-4, 0], a: [4, 0] }, { de: [0, -4], a: [0, 4] }];
  const compA = (ax, ay, o = {}) => {
    const m = Math.hypot(ax, ay);
    const fl = [{ de: [0, 0], a: [ax, ay], color: 'o', rotulo: 'A', paso: 0 }];
    if (m > 0 && o.unitario) fl.push({ de: [0, 0], a: [ax / m, ay / m], color: 'd', rotulo: 'û', paso: o.pasoU || 0 });
    return { datos: { unidad: 'u', flechas: fl,
      guias: [...EJES, ...(m > 0 ? [{ de: [ax, 0], a: [ax, ay], color: 'o', paso: o.pasoG || 0 }, { de: [0, ay], a: [ax, ay], color: 'o', paso: o.pasoG || 0 }] : [])],
      segmentos: m > 0 && o.textos ? [{ de: [0, 0], a: [ax, 0], color: 'o', texto: `Aₓ = ${f(ax, 0)}`, paso: o.pasoG || 0 }, { de: [0, 0], a: [0, ay], color: 'o', texto: `Aᵧ = ${f(ay, 0)}`, paso: o.pasoG || 0 }].filter(sg => Math.hypot(sg.a[0], sg.a[1]) > 0) : [],
    }, estado: { paso: o.paso === undefined ? 9 : o.paso } };
  };
  const componentes = {
    id: 'componentes',
    titulo: 'Componentes y vector unitario',
    pregunta: '¿Cómo se parte una flecha en dos, y qué flecha mide 1?',
    temas: ['Componentes y vector unitario'],
    pieza: 'flechas',
    juega: {
      consigna: 'Aₓ va y viene sola. Mira la flecha verde, el unitario: gira con A, pero siempre mide 1.',
      voz: 'Prueba también A = 0. ¿Hacia dónde apuntaría su unitario?',
      controles: [
        { id: 'ax', etiqueta: 'Ax', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 3, decimales: 0, auto: { velocidad: 1.5, modo: 'rebota' } },
        { id: 'ay', etiqueta: 'Ay', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => compA(val.ax, val.ay, { unitario: true, valor: true }),
      lectura: val => {
        const m = Math.hypot(val.ax, val.ay);
        return m > 1e-9 ? ['|', A, `| = ${f(m, 2)} · `, u, ` = (${f(val.ax / m, 2)}; ${f(val.ay / m, 2)})`] : [A, ' = 0: no apunta a ningún lado; no tiene ', u];
      },
      minimo: 3,
      // Arrastra la punta de A: su sombra en x es Aₓ y su sombra en y es Aᵧ (los ejes de −4 a 4 fijan la escala).
      arrastres: [
        { id: 'punta-a', etiqueta: 'punta de A', color: 'c-o',
          donde: val => { const g = FL().geometria(compA(val.ax, val.ay, { unitario: true }).datos); return { x: g.X(val.ax), y: g.Y(val.ay) }; },
          mover: (pt, val) => { const g = FL().geometria(compA(val.ax, val.ay, { unitario: true }).datos); return { ax: g.Xi(pt.x), ay: g.Yi(pt.y) }; } },
      ],
    },
    predice: {
      pregunta: ['El vector ', vA, ' = 6î + 8ĵ. ¿Cuál es su vector unitario ', u, '?'],
      opciones: [
        { id: 'c', texto: '0,6î + 0,8ĵ', correcta: true },
        { id: 'suma', texto: '(6î + 8ĵ)/14', error: 'U-SUMA', siFuera: 'Dividir está bien; pero entre el largo de A, que es 10, no entre 6 + 8.' },
        { id: 'unos', texto: 'î + ĵ', error: 'U-UNOS', siFuera: 'î + ĵ mide √2, no 1, y apunta a 45°: otra dirección.' },
        { id: 'cruce', texto: '0,8î + 0,6ĵ', error: 'U-CAMBIO', siFuera: 'Mide 1, pero apunta a otro lado: cada número va con su eje.' },
      ],
      dibujo: compA(6 / 2, 8 / 2, { paso: 0 }),
      revelar: compA(6 / 2, 8 / 2, { unitario: true }),
      coincide: 'Coincide: |A| = 10, y cada componente se divide entre 10.',
    },
    mira: {
      datos: compA(3, 4, { unitario: true, pasoG: 1, pasoU: 3, textos: true }).datos,
      pasos: [
        { estado: { paso: 0 }, texto: 'A va del origen al punto (3; 4).', ecuacion: [vA, ' = 3î + 4ĵ'] },
        { estado: { paso: 1 }, texto: 'Sus componentes son lo que avanza en cada eje.', ecuacion: [{ sub: [A, 'x'] }, ' = 3,   ', { sub: [A, 'y'] }, ' = 4'] },
        { estado: { paso: 2 }, texto: 'Su módulo sale de Pitágoras con las componentes.', ecuacion: ['|', A, '| = ', { raiz: [[{ sup: ['3', '2'] }, ' + ', { sup: ['4', '2'] }]] }, ' = 5'] },
        { estado: { paso: 3 }, texto: 'El unitario divide cada componente entre 5: mide 1.', ecuacion: [u, ' = ', { frac: [vA, ['|', A, '|']] }, ' = 0,6î + 0,8ĵ'] },
      ],
    },
    regla: {
      texto: 'Un vector se escribe con sus componentes sobre î y ĵ. Su módulo sale de Pitágoras, y el unitario es el vector dividido entre su módulo.',
      ecuacion: [vA, ' = ', { sub: [A, 'x'] }, 'î + ', { sub: [A, 'y'] }, 'ĵ', '   ·   ', '|', A, '| = ', { llave: [{ raiz: [[{ sup: [{ sub: [A, 'x'] }, '2'] }, ' + ', { sup: [{ sub: [A, 'y'] }, '2'] }]] }], nota: 'el módulo', color: 'c-o' }, '   ·   ', u, ' = ', { llave: [{ frac: [vA, ['|', A, '|']] }], nota: 'mide 1', color: 'c-d' }],
      condicion: 'los ejes x e y son perpendiculares; el vector nulo no tiene unitario.',
    },
    ahoraTu: {
      pieza: 'flechas',
      generar(s) {
        const r = azar(s);
        const [p, q, m] = r.de([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [4, 3, 5], [12, 5, 13], [8, 6, 10]]);
        const sx = r.de([1, -1]), sy = r.de([1, -1]), ax = sx * p, ay = sy * q;
        const esc = Math.max(p, q) / 4;
        const dib = compA(ax / esc, ay / esc, { paso: 0 });
        if (s % 2 === 0) return {
          pregunta: ['¿Cuánto mide el vector ', vA, ` = ${f(ax, 0)}î ${ay < 0 ? '−' : '+'} ${f(Math.abs(ay), 0)}ĵ?`],
          dibujo: dib,
          opciones: opciones(m, [
            { id: 'suma', valor: Math.abs(ax) + Math.abs(ay), error: 'V-SUMA', siFuera: 'Sumar componentes es caminar por los ejes; la flecha va en diagonal.' },
            { id: 'signo', valor: Math.abs(ax + ay), error: 'V-RESTA', siFuera: 'Los signos dan la dirección; el módulo usa los cuadrados.' },
            { id: 'cuadrado', valor: m * m, error: 'V-RAIZ', siFuera: 'Eso es el módulo al cuadrado: falta la raíz.' },
          ], x => `${f(x, 2)} u`),
          solucion: { texto: 'Pitágoras con las dos componentes.', ecuacion: ['|', A, `| = √(${f(p * p, 0)} + ${f(q * q, 0)}) = ${f(m, 0)} u`] },
        };
        const uy = ay / m;
        return {
          pregunta: ['El vector ', vA, ` = ${f(ax, 0)}î ${ay < 0 ? '−' : '+'} ${f(Math.abs(ay), 0)}ĵ. ¿Cuánto vale la componente y de su unitario `, u, '?'],
          dibujo: dib,
          opciones: opciones(uy, [
            { id: 'suma', valor: ay / (Math.abs(ax) + Math.abs(ay)), error: 'U-SUMA', siFuera: 'Se divide, sí, pero entre el módulo, no entre la suma de componentes.' },
            { id: 'cruce', valor: ax / m, error: 'U-CAMBIO', siFuera: 'Esa es la componente x del unitario.' },
            { id: 'sin', valor: ay, error: 'U-UNOS', siFuera: 'Esa es la componente de A; el unitario mide 1.' },
            { id: 'signo', valor: -uy, error: 'U-SIGNO', siFuera: 'El unitario apunta igual que A: conserva el signo.' },
          ], x => f(x, 4)),
          solucion: { texto: `|A| = ${f(m, 0)}; se divide la componente y entre ${f(m, 0)}.`, ecuacion: [{ sub: [u, 'y'] }, ` = ${f(ay, 0)} / ${f(m, 0)} = ${f(uy, 4)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: producto escalar y producto vectorial ----------
  // Cambia: el ángulo θ entre A (4) y B (3) · Permanece: los módulos y el círculo donde puede caer la punta de B ·
  // Progresa: la sombra de B sobre A (escalar) y el área del paralelogramo (vectorial) ·
  // Se reserva: 90°, donde el escalar es 0 y el vectorial es máximo · Debe verse: uno es un número con signo; el otro, un área con dirección.
  const prod = (a, b, g, o = {}) => {
    const tip = [b * cosG(g), b * senG(g)], circ = Array.from({ length: 19 }, (_, i) => [b * Math.cos(i * Math.PI / 18), b * Math.sin(i * Math.PI / 18)]);
    const yS = -0.7; // la sombra se dibuja un poco debajo de A, para que su rótulo no tape el de A
    const sombra = b * cosG(g);
    return { datos: {
      unidad: 'u',
      contorno: o.circulo === false ? undefined : circ,
      flechas: [{ de: [0, 0], a: [a, 0], color: 'o', rotulo: 'A' }, { de: [0, 0], a: tip, color: 'i', rotulo: 'B' }],
      angulos: g > 0 && g < 180 ? [{ en: [0, 0], de: 0, a: g, texto: `${f(g, 0)}°`, color: 'h' }] : [],
      guias: [{ de: tip, a: [sombra, yS], color: 'i', paso: o.pasoS || 0 },
        { de: [a, 0], a: [a + tip[0], tip[1]], color: 'd', paso: o.pasoP || 0 }, { de: tip, a: [a + tip[0], tip[1]], color: 'd', paso: o.pasoP || 0 },
        ...(o.marco ? [marco(...o.marco)] : [])],
      segmentos: Math.abs(sombra) > 1e-9 ? [{ de: [0, yS], a: [sombra, yS], color: 'i', texto: `B cos θ = ${f(sombra, 2)}`, paso: o.pasoS || 0 }] : [],
    }, estado: { paso: o.paso === undefined ? 9 : o.paso } };
  };
  // El juego fija la escala con todo lo que puede ocupar la figura en la media vuelta (sombra y paralelogramo).
  const MARCO_P = [[-3, -0.7], [7, 3]];
  const productos = {
    id: 'productos',
    titulo: 'Producto escalar y vectorial',
    pregunta: '¿De qué dos maneras se multiplican dos flechas?',
    temas: ['Producto escalar y vectorial'],
    pieza: 'flechas',
    juega: {
      consigna: 'A = 4 y B = 3. B gira sola. Mira la sombra de B sobre A (escalar) y el área del paralelogramo (vectorial).',
      voz: 'Busca dónde la sombra desaparece y dónde el área es mayor.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 30, inicio: 60, unidad: '°', decimales: 0, auto: { velocidad: 30, modo: 'rebota' } }],
      dibujo: val => prod(4, 3, val.g, { marco: MARCO_P }),
      lectura: val => [vA, '·', vB, ` = ${f(12 * cosG(val.g), 2)} · |`, vA, '×', vB, `| = ${f(12 * senG(val.g), 2)}`],
      minimo: 3,
      // Arrastra la punta de B por su media vuelta: su giro es θ (el largo de B queda en 3).
      arrastres: [
        { id: 'giro-b', etiqueta: 'punta de B', color: 'c-h',
          donde: val => { const g = FL().geometria(prod(4, 3, val.g, { marco: MARCO_P }).datos); return { x: g.X(3 * cosG(val.g)), y: g.Y(3 * senG(val.g)) }; },
          mover: (pt, val) => { const g = FL().geometria(prod(4, 3, val.g, { marco: MARCO_P }).datos); return { g: anguloDe([0, 0], [g.Xi(pt.x), g.Yi(pt.y)]) }; } },
      ],
    },
    predice: {
      pregunta: ['Dos vectores de ', A, ' = 4 y ', B, ' = 5 forman ', th, ' = 90°. ¿Cuánto vale el producto escalar ', vA, ' · ', vB, '?'],
      opciones: [
        { id: 'c', texto: '0', correcta: true },
        { id: 'modulos', texto: '20', error: 'PE-MODULOS', siFuera: '20 sería cierto si apuntaran al mismo lado; a 90° B no tiene sombra sobre A.' },
        { id: 'vector', texto: '20 k̂', error: 'PE-VECTOR', siFuera: '20 k̂ es el producto vectorial a 90°. El escalar es un número, sin dirección.' },
        { id: 'suma', texto: '9', error: 'V-SUMA', siFuera: 'El producto multiplica módulos y coseno; no los suma.' },
      ],
      dibujo: prod(4, 5, 90, { circulo: false, paso: 0, pasoS: 9, pasoP: 9 }),
      revelar: prod(4, 5, 90, { circulo: false, pasoP: 9 }),
      coincide: 'Coincide: a 90°, la sombra de B sobre A mide 0.',
    },
    mira: {
      datos: prod(4, 3, 60, { circulo: false, pasoS: 1, pasoP: 3 }).datos,
      pasos: [
        { estado: { paso: 0 }, texto: 'A mide 4, B mide 3 y forman 60°.', ecuacion: [A, ' = 4,  ', B, ' = 3,  ', th, ' = 60°'] },
        { estado: { paso: 1 }, texto: 'La sombra de B sobre A mide 3 · cos 60° = 1,5.', ecuacion: ['B cos θ = 3 · cos 60° = 3 · 0,5 = 1,5'] },
        { estado: { paso: 2 }, texto: 'El producto escalar da una magnitud escalar: un número, sin dirección.', ecuacion: [vA, ' · ', vB, ' = ', A, B, ' cos ', th, ' = 4 · 3 · cos 60° = 4 · 1,5 = 6'] },
        { estado: { paso: 3 }, texto: 'El vectorial mide el área del paralelogramo.', ecuacion: ['|', vA, ' × ', vB, '| = ', A, B, ` sen `, th, ` = ${f(12 * senG(60), 2)}`] },
        { estado: { paso: 3 }, texto: 'Apunta perpendicular al plano de A y B, por la mano derecha.', ecuacion: [vA, ' × ', vB, ` = ${f(12 * senG(60), 2)} k̂`] },
      ],
    },
    regla: {
      texto: 'El producto escalar es un número: A por la sombra de B. El vectorial es un vector perpendicular a ambos, de módulo igual al área del paralelogramo.',
      ecuacion: [vA, ' · ', vB, ' = ', A, { llave: [B, ' cos ', th], nota: 'sombra de B', color: 'c-i' }, '   ·   ', '|', vA, ' × ', vB, '| = ', { llave: [A, B, ' sen ', th], nota: 'área', color: 'c-d' }],
      condicion: 'θ es el ángulo entre A y B con el mismo origen. B × A = −(A × B): el orden importa.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let a1 = r.ent(-4, 5), a2 = r.ent(-3, 5), b1 = r.ent(-3, 5), b2 = r.ent(-4, 5);
        if (a1 === 0) a1 = 2; if (b2 === 0) b2 = 3;
        const sg = n => (n < 0 ? `− ${f(-n, 0)}` : `+ ${f(n, 0)}`);
        const txt = (x, y) => `${f(x, 0)}î ${sg(y)}ĵ`;
        const pre = ['Si ', vA, ` = ${txt(a1, a2)} y `, vB, ` = ${txt(b1, b2)}, `];
        if (s % 2 === 0) {
          const pe = a1 * b1 + a2 * b2;
          return {
            pregunta: [...pre, '¿cuánto vale ', vA, ' · ', vB, '?'],
            opciones: opciones(pe, [
              { id: 'cruz', valor: a1 * b2 - a2 * b1, error: 'PE-VECTOR', siFuera: 'Ese cruce de componentes es el producto vectorial.' },
              { id: 'resta', valor: a1 * b1 - a2 * b2, error: 'PE-SIGNO', siFuera: 'En el escalar los dos productos se suman.' },
              { id: 'suma', valor: (a1 + a2) * (b1 + b2), error: 'PE-MODULOS', siFuera: 'Eso mezcla x con y; cada eje se multiplica con su eje.' },
            ], x => f(x, 0)),
            solucion: { texto: 'Cada componente con la de su mismo eje, y se suman.', ecuacion: [vA, ' · ', vB, ` = (${f(a1, 0)})(${f(b1, 0)}) + (${f(a2, 0)})(${f(b2, 0)}) = ${f(pe, 0)}`] },
          };
        }
        const pv = a1 * b2 - a2 * b1;
        return {
          pregunta: [...pre, '¿cuánto vale ', vA, ' × ', vB, '?'],
          opciones: opciones(pv, [
            { id: 'orden', valor: -pv, error: 'PE-ORDEN', siFuera: 'Ese es B × A: el orden cambia el signo.' },
            { id: 'escalar', valor: a1 * b1 + a2 * b2, error: 'PE-VECTOR', siFuera: 'Ese es el producto escalar: un número, sin k̂.' },
            { id: 'sin-resta', valor: a1 * b2 + a2 * b1, error: 'PE-SIGNO', siFuera: 'Los productos cruzados se restan, no se suman.' },
          ], x => `${f(x, 0)} k̂`),
          solucion: { texto: 'Se cruzan las componentes y se restan; apunta según k̂.', ecuacion: [vA, ' × ', vB, ` = [(${f(a1, 0)})(${f(b2, 0)}) − (${f(a2, 0)})(${f(b1, 0)})] k̂ = ${f(pv, 0)} k̂`] },
        };
      },
    },
  };

  // Mesas del laboratorio: la escala se fija con los largos máximos, para que las puntas sigan al dedo.
  const sumaLibre = val => colaPunta(val.a, val.b, val.g, { marco: [[-4, 0], [12.5, 6]] });
  const prodLibre = val => prod(val.a, val.b, val.g, { marco: [[-5, -0.7], [10, 5]] });
  // Lo que miden la sombra (escalar) y el paralelogramo (área del vectorial) en la mesa libre; lo usan la lectura y los retos.
  const escalarLibre = val => val.a * val.b * cosG(val.g);
  const areaLibre = val => Math.abs(val.a * val.b * senG(val.g));
  const rLibre = val => sumaLibre(val).r;
  const modA = val => Math.hypot(val.ax, val.ay);
  // Flechas en el espacio (laboratorio 3D, 15 nov: exploración libre, sin predicciones). Módulo, A · B y A × B salen del
  // motor de plantillas/vectores a través de nucleo/fisica3d.js: la figura, la lectura y los retos usan el mismo número.
  const esp = val => F3.vectores(val);
  const casi = (a, b) => Math.abs(a - b) < 1e-9;
  const mesaEspacio = {
    id: 'flechas-espacio', titulo: 'Flechas en el espacio', pieza: 'fis-espacio-3d',
    consigna: 'Az sube y baja sola: mira cómo cambia el largo de A. Gira el espacio con el dedo; después mira A × B.',
    controles: [
      { id: 'ver', etiqueta: 'Mirar', opciones: [{ valor: 'comp', texto: 'Componentes' }, { valor: 'cruz', texto: 'A × B' }] },
      { id: 'ax', etiqueta: 'Ax', color: 'c-o', min: -2, max: 2, paso: 1, inicio: 2, decimales: 0 },
      { id: 'ay', etiqueta: 'Ay', color: 'c-o', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0 },
      // Az barre de −2 a 2 y vuelve; los cuadros casi nunca caen justo en 0, así la flecha de Az no desaparece y la
      // escena 3D se mueve sin rearmarse (fis-espacio-3d, forma y mover). Los retos piden valores que el alumno fija.
      { id: 'az', etiqueta: 'Az', color: 'c-o', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0, auto: { velocidad: 1, modo: 'rebota' } },
      { id: 'b', etiqueta: 'B', color: 'c-i', opciones: ['x', 'y', 'z', 'xy'].map(k => ({ valor: k, texto: F3.BNOMBRE[k] })) },
    ],
    dibujo: val => ({ datos: esp(val).datos, estado: {} }),
    lectura: val => {
      const e = esp(val);
      return val.ver === 'cruz' ? [A, ' · ', B, ` = ${f(e.punto)} · |`, A, ' × ', B, `| = ${f(e.modCruz)}`] : ['|', A, `| = √(${[val.ax, val.ay, val.az].map(x => f(x * x)).join(' + ')}) = ${f(e.modA)}`];
    },
    invitaciones: [
      { texto: 'Arma una A que mida justo 3 sin ponerla sobre un eje.',
        logrado: val => casi(esp(val).modA, 3) && [val.ax, val.ay, val.az].filter(x => x !== 0).length >= 2,
        bien: 'Tres sombras, un solo largo: √(4 + 4 + 1) = 3. Pitágoras dos veces.',
        pista: 'Prueba componentes 2, 2 y 1, con el signo que quieras.' },
      { texto: 'Mirando A × B, logra un producto cero sin que A sea cero.',
        logrado: val => val.ver === 'cruz' && esp(val).modA > 0 && casi(esp(val).modCruz, 0),
        bien: 'A quedó paralela a B: no hay paralelogramo, no hay área.',
        pista: 'Pon A en la misma dirección que B. Mira si queda área entre las dos.' },
      { texto: 'Logra que A × B apunte hacia arriba, con z positivo.',
        logrado: val => val.ver === 'cruz' && esp(val).cruz[2] > 1e-9,
        bien: 'Cambia el orden de los giros y la flecha cambia de lado. Míralo de costado.',
        pista: 'Con B = î, prueba Ay negativa. Gira el espacio y mira hacia dónde sale.' },
      { texto: 'Haz A · B = 0 con una A de largo 2 o más.',
        logrado: val => val.ver === 'cruz' && esp(val).modA >= 2 - 1e-9 && casi(esp(val).punto, 0),
        bien: 'Perpendiculares: la sombra de A sobre B no mide nada, pero el área es máxima.',
        pista: 'Elige B = k̂ y deja Az en 0.' },
      { texto: 'Guarda dos A del mismo largo que apunten a lugares distintos.',
        logrado: (val, guardados) => guardados.some(a => guardados.some(b => esp(a).modA > 0 && casi(esp(a).modA, esp(b).modA)
          && (a.ax !== b.ax || a.ay !== b.ay || a.az !== b.az))),
        bien: 'El largo no dice hacia dónde: para eso están las tres componentes.' },
    ],
  };

  return {
    unidad: 'fisica.vectores',
    // Unidad nueva del 16 nov: sale de «Magnitudes y vectores» (Gerson eligió partirla). Ideas, mesas y glosario se movieron
    // tal cual; las ideas nuevas (escalar o vector) y el contrato «se entiende sin profesor» vienen después, una por una.
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/flechas.js', '/plantillas/vectores/motor.js', '/nucleo/fisica3d.js', '/nucleo/kit/piezas/fis-espacio-3d.js'],
    glosario: [
      { termino: 'magnitud escalar', formas: ['magnitud escalar', 'magnitudes escalares'],
        def: 'La que queda dicha del todo con un número y su unidad, sin dirección.',
        ejemplos: ['Una masa de 3 kg o un tiempo de 10 s.', 'La temperatura de un vaso de agua: 20 °C.', 'El volumen de una botella: 0,5 L. No apunta a ningún lado.'], ver: ['vector'] },
      { termino: 'vector', formas: ['vector', 'vectores', 'magnitud vectorial', 'magnitudes vectoriales'],
        def: 'Flecha con tamaño, dirección y sentido; representa magnitudes como el desplazamiento o la fuerza.',
        ejemplos: ['Una fuerza de 4 N hacia arriba.', 'El desplazamiento de una combi: 3 km hacia el norte.', 'La velocidad del viento: 5 m/s hacia el este.'], ver: ['módulo', 'magnitud escalar', 'componente'] },
      { termino: 'módulo', simbolo: '|A|', def: 'El tamaño de un vector: el largo de su flecha. Nunca es negativo.',
        ejemplos: ['A = 3î + 4ĵ mide |A| = 5.', 'Una fuerza de 10 N hacia abajo tiene módulo 10 N.', 'Caminar 3 m al este y 4 m al norte: el desplazamiento mide 5 m.'], ver: ['vector'] },
      { termino: 'resultante', simbolo: 'R', def: 'Vector que reemplaza a varios: va de la cola del primero a la punta del último.',
        ejemplos: ['A = 3 y B = 4 a 90°: R = 5.', 'Dos personas jalan una caja con 30 N cada una, hacia el mismo lado: R = 60 N.', 'Con 30 N y 20 N en sentidos opuestos: R = 10 N.'], ver: ['vector'] },
      { termino: 'componente', def: 'Lo que un vector avanza a lo largo de un eje, con su signo.',
        ejemplos: ['A = 3î + 4ĵ: Aₓ = 3 y Aᵧ = 4.', 'Una flecha de 10 a 37° del eje x tiene Aₓ = 8 y Aᵧ = 6.', 'Una flecha que apunta al oeste tiene componente x negativa.'], ver: ['vector unitario', 'módulo'] },
      { termino: 'vector unitario', simbolo: 'û', formas: ['vector unitario', 'vectores unitarios', 'unitario', 'unitarios'],
        def: 'Flecha de largo 1 que apunta igual que otra; sale de dividirla entre su módulo.',
        ejemplos: ['A = 6î + 8ĵ: û = 0,6î + 0,8ĵ.', 'î es el unitario del eje x: mide 1 y apunta a la derecha.', 'Una fuerza de 5 N hacia arriba es 5 veces el unitario ĵ.'], ver: ['componente'] },
      { termino: 'producto escalar', simbolo: 'A · B', def: 'Número que sale de multiplicar un largo por la sombra del otro: A B cos θ.',
        ejemplos: ['A = 4 y B = 3 a 60°: A · B = 6.', 'Dos flechas perpendiculares: A · B = 0.', 'Empujar un carrito 5 m con 10 N en esa misma dirección da 50 J de trabajo.'], ver: ['producto vectorial'] },
      { termino: 'producto vectorial', simbolo: 'A × B',
        def: 'Vector perpendicular a los dos, cuyo largo es el área de su paralelogramo: A B sen θ.',
        ejemplos: ['A = 4 y B = 5 a 90°: |A × B| = 20.', 'Dos flechas paralelas: |A × B| = 0, no encierran área.', 'Girar una llave de 0,2 m con 10 N perpendicular: torque de 2 N·m.'], ver: ['producto escalar'] },
    ],
    laboratorio: [
      mesaEspacio,
      {
        id: 'suma-libre', titulo: 'Dos flechas sin amarras', pieza: 'flechas',
        consigna: 'Arrastra la punta de A o la de B, o usa los botones. Busca dos casos con el mismo R y otro ángulo.',
        controles: [
          { id: 'a', etiqueta: 'A', color: 'c-o', min: 2, max: 6, paso: 1, inicio: 5, decimales: 0 },
          { id: 'b', etiqueta: 'B', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 },
          { id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 15, inicio: 90, unidad: '°', decimales: 0 },
        ],
        dibujo: val => { const c = sumaLibre(val); return { datos: c.datos, estado: c.estado }; },
        lectura: val => [A, ` = ${f(val.a, 0)} · `, B, ` = ${f(val.b, 0)} · `, th, ` = ${f(val.g, 0)}° → `, R, ` = ${f(rLibre(val), 2)}`],
        // Retos: cada uno lo comprueba la misma resultante que se dibuja (colaPunta).
        invitaciones: [
          { texto: 'Haz que R mida lo mismo que A + B.',
            logrado: val => Math.abs(rLibre(val) - (val.a + val.b)) < 1e-9,
            bien: 'Solo a 0° los módulos se suman: las dos flechas apuntan igual.' },
          { texto: 'Consigue que R mida justo 5, sin que A ni B midan 5.',
            logrado: val => Math.abs(rLibre(val) - 5) < 1e-9 && val.a !== 5 && val.b !== 5,
            bien: 'Un triángulo 3, 4, 5 escondido en la suma. ¿Qué ángulo lo arma?' },
          { texto: 'Haz que R sea más corta que A y también que B.',
            logrado: val => rLibre(val) < Math.min(val.a, val.b) - 1e-9,
            bien: 'Sumar flechas puede dar menos que cada una. ¿Desde qué ángulo pasa?' },
          { texto: 'Guarda dos casos con el mismo R y distinto ángulo.',
            logrado: (val, guardados) => guardados.some(x => x.g !== val.g && Math.abs(rLibre(x) - rLibre(val)) < 1e-9)
              && guardados.some(x => x.a === val.a && x.b === val.b && x.g === val.g),
            bien: 'Mismo R por dos caminos: los largos compensan lo que cambia el ángulo.' },
        ],
        arrastres: [
          { id: 'punta-a', etiqueta: 'punta de A', color: 'c-o',
            donde: val => { const g = FL().geometria(sumaLibre(val).datos); return { x: g.X(val.a), y: g.Y(0) }; },
            mover: (pt, val) => ({ a: FL().geometria(sumaLibre(val).datos).Xi(pt.x) }) },
          { id: 'punta-b', etiqueta: 'punta de B', color: 'c-i',
            donde: val => { const g = FL().geometria(sumaLibre(val).datos); return { x: g.X(val.a + val.b * cosG(val.g)), y: g.Y(val.b * senG(val.g)) }; },
            mover: (pt, val) => {
              const g = FL().geometria(sumaLibre(val).datos), q = [g.Xi(pt.x), g.Yi(pt.y)];
              return { g: anguloDe([val.a, 0], q), b: Math.hypot(q[0] - val.a, Math.max(0, q[1])) };
            } },
        ],
      },
      Object.assign({ id: 'componentes', titulo: 'Componentes y unitario', pieza: 'flechas',
        // Retos: el módulo es el mismo Math.hypot que dibuja compA; el unitario, cada componente entre el módulo.
        invitaciones: [
          { texto: 'Consigue que A mida justo 5.',
            logrado: val => Math.abs(modA(val) - 5) < 1e-9,
            bien: 'Componentes 3 y 4, módulo 5: Pitágoras con las sombras de A.' },
          { texto: 'Haz que el unitario apunte hacia abajo y a la izquierda.',
            logrado: val => modA(val) > 0 && val.ax / modA(val) < 0 && val.ay / modA(val) < 0,
            bien: 'El unitario copia los signos de A: misma dirección, largo 1.' },
          { texto: 'Guarda dos A de distinto largo con el mismo unitario.',
            logrado: (val, guardados) => modA(val) > 0 && guardados.some(x => modA(x) > 0 && Math.abs(modA(x) - modA(val)) > 1e-9
              && Math.abs(x.ax / modA(x) - val.ax / modA(val)) < 1e-9 && Math.abs(x.ay / modA(x) - val.ay / modA(val)) < 1e-9)
              && guardados.some(x => x.ax === val.ax && x.ay === val.ay),
            bien: 'Distinto largo, mismo unitario: û solo guarda hacia dónde apunta A.' },
        ] }, componentes.juega),
      {
        id: 'productos-libre', titulo: 'Sombra y área a la vez', pieza: 'flechas',
        consigna: 'Cambia los dos largos y el ángulo. Compara la sombra de B sobre A con el área del paralelogramo.',
        controles: [
          { id: 'a', etiqueta: 'A', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 4, decimales: 0 },
          { id: 'b', etiqueta: 'B', color: 'c-i', min: 1, max: 5, paso: 1, inicio: 3, decimales: 0 },
          { id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 15, inicio: 45, unidad: '°', decimales: 0 },
        ],
        dibujo: val => prodLibre(val),
        lectura: val => [`${f(val.a, 0)} y ${f(val.b, 0)} a ${f(val.g, 0)}°: escalar ${f(escalarLibre(val), 2)} · área ${f(areaLibre(val), 2)}`],
        // Retos: la sombra y el área son las de la figura (A B cos θ y A B sen θ).
        invitaciones: [
          { texto: 'Haz que el producto escalar valga 0.',
            logrado: val => Math.abs(escalarLibre(val)) < 1e-9,
            bien: 'A 90° la sombra desaparece y el área es la mayor. ¿Coincidencia?' },
          { texto: 'Busca el menor ángulo que da un producto escalar negativo.',
            logrado: val => escalarLibre(val) < -1e-9 && escalarLibre(Object.assign({}, val, { g: val.g - 15 })) >= -1e-9,
            bien: 'Pasado 90°, la sombra cae detrás de A: el escalar tiene signo.' },
          { texto: 'Haz que el área sea 0 sin que el escalar sea 0.',
            logrado: val => areaLibre(val) < 1e-9 && Math.abs(escalarLibre(val)) > 1e-9,
            bien: 'Flechas alineadas: no encierran área, pero la sombra es entera.' },
          { texto: 'Guarda dos casos con la misma área y distinto producto escalar.',
            logrado: (val, guardados) => guardados.some(x => Math.abs(areaLibre(x) - areaLibre(val)) < 1e-9 && Math.abs(escalarLibre(x) - escalarLibre(val)) > 1e-9)
              && guardados.some(x => x.a === val.a && x.b === val.b && x.g === val.g),
            bien: 'Misma área, otra sombra: cada producto mira el ángulo a su manera.' },
        ],
        arrastres: [
          { id: 'punta-a', etiqueta: 'punta de A', color: 'c-o',
            donde: val => { const g = FL().geometria(prodLibre(val).datos); return { x: g.X(val.a), y: g.Y(0) }; },
            mover: (pt, val) => ({ a: FL().geometria(prodLibre(val).datos).Xi(pt.x) }) },
          { id: 'punta-b', etiqueta: 'punta de B', color: 'c-i',
            donde: val => { const g = FL().geometria(prodLibre(val).datos); return { x: g.X(val.b * cosG(val.g)), y: g.Y(val.b * senG(val.g)) }; },
            mover: (pt, val) => {
              const g = FL().geometria(prodLibre(val).datos), q = [g.Xi(pt.x), g.Yi(pt.y)];
              return { g: anguloDe([0, 0], q), b: Math.hypot(q[0], Math.max(0, q[1])) };
            } },
        ],
      },
    ],
    laboratorioIdeas: {
      'flechas-espacio': ['componentes', 'productos'],
      'suma-libre': ['resultante'],
      'componentes': ['componentes'],
      'productos-libre': ['productos'],
    },
    // El vector unitario y las componentes van antes de sumar (Gerson, 16 nov).
    ideas: [componentes, resultante, productos],
  };
});
