/*
 * Teoría de «Razonamiento con figuras» (geometria.razonamiento-con-figuras). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 18). Euler y los puentes de Königsberg (qué información importa).
 * Compañera: Neri (nutria). Pieza: geo-figura (con caras opacas para los cubos).
 *
 * Ficha de tarea
 *   Promesa: contar con método (borde, reglas que se comprueban en todas las figuras, familias de triángulos, sumas de
 *     caminos, capas de cubos) en lugar de confiar en la vista.
 *   Persona y condiciones: postulante de 3.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: calcula perímetros con muescas, completa series y distribuciones justificando la regla,
 *     cuenta triángulos, rutas y cubitos (también los ocultos).
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿cómo sé que no me faltó contar nada?»: clasificar antes de contar.
 *
 * Colores: lo que se mueve o cuenta naranja (c-o), lo que acompaña turquesa (c-i), lo que cumple verde (c-d),
 * lo pedido o lo que falla rojo (c-h). Códigos: GE4, GE5, GE13 (docs/investigacion/geometria-ideas-erroneas.md);
 * GE-PER, GE-SER, GE-DIS, GE-CNT, GE-RUT y GE-CUB son hipótesis nuevas.
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
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor < 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, n);
  }
  const perim = pts => pts.reduce((s, p, i) => s + U.dist(p, pts[(i + 1) % pts.length]), 0);

  // ---------- Idea 1: perímetro ----------
  // Cambia: los escalones de la esquina · Permanece: el rectángulo que la encierra · Progresa: el área baja, el perímetro no ·
  // Se reserva: la muesca hacia adentro · Debe verse: los tramos se proyectan sobre los lados del rectángulo.
  const escalera = n => {
    const p = [[0, 0], [6, 0], [6, 2]];
    for (let i = 1; i <= n; i++) { p.push([6 - 3 * (i - 1) / n, 2 + 2 * i / n]); p.push([6 - 3 * i / n, 2 + 2 * i / n]); }
    if (!n) p.push([6, 4]);
    p.push([0, 4]);
    return p.filter((q, i, l) => i === 0 || U.dist(q, l[i - 1]) > 1e-9);
  };
  const figEsc = n => {
    const pts = escalera(n);
    return {
      alt: `Figura de borde escalonado dentro de un rectángulo de 6 por 4: perímetro ${f(perim(pts))}, área ${f(Math.abs(U.area(pts)))}`,
      vista: { x: [-1, 7.4], y: [-1, 5] }, cuadricula: { paso: 1 },
      puntos: [],
      regiones: [{ puntos: [[0, 0], [6, 0], [6, 4], [0, 4]], color: 'i', opacidad: 0.0001, discontinua: true },
        { puntos: pts, color: 'o', opacidad: 0.18, sinBorde: false }],
      rotulos: [{ x: 3, y: -0.6, texto: '6' }, { x: -0.5, y: 2, texto: '4' }],
    };
  };
  const MUESCA = [[0, 0], [6, 0], [6, 4], [4, 4], [4, 3], [2, 3], [2, 4], [0, 4]];
  const figMuesca = (o = {}) => {
    const k = o.pasos || {};
    return {
      alt: o.alt || 'Rectángulo de 6 por 4 con una muesca de 2 de ancho y 1 de fondo en el lado de arriba',
      vista: { x: [-1, 7.4], y: [-1, 5] }, cuadricula: { paso: 1 },
      puntos: [[0, 0], [6, 0], [6, 4], [4, 4], [4, 3], [2, 3], [2, 4], [0, 4]].map((p, i) => ({ id: 'm' + i, x: p[0], y: p[1], sinPunto: true })),
      regiones: [{ puntos: MUESCA, color: 'o', opacidad: 0.18, sinBorde: false }],
      segmentos: [
        ...(k.h !== undefined ? [{ de: 'm0', a: 'm1', color: 'i', grosor: 'variable', texto: '6', desde: k.h }, { de: 'm7', a: 'm6', color: 'i', grosor: 'variable', texto: '2', desde: k.h }, { de: 'm5', a: 'm4', color: 'i', grosor: 'variable', texto: '2', lado: -1, desde: k.h }, { de: 'm3', a: 'm2', color: 'i', grosor: 'variable', texto: '2', desde: k.h }] : []),
        ...(k.v !== undefined ? [{ de: 'm1', a: 'm2', color: 'd', grosor: 'variable', texto: '4', desde: k.v }, { de: 'm7', a: 'm0', color: 'd', grosor: 'variable', texto: '4', desde: k.v }] : []),
        ...(o.paredes ? [{ de: 'm6', a: 'm5', color: 'h', grosor: 'variable', texto: '1', lado: -1, desde: k.p || 0 }, { de: 'm4', a: 'm3', color: 'h', grosor: 'variable', texto: '1', lado: -1, desde: k.p || 0 }] : []),
      ],
      rotulos: o.paredes || k.h !== undefined ? [] : [{ x: 3, y: -0.6, texto: '6' }, { x: -0.5, y: 2, texto: '4' }, { x: 3, y: 3.5, texto: '2 × 1', color: 'h' }],
    };
  };
  const perimetro = {
    id: 'perimetro',
    titulo: 'El perímetro recorre el borde',
    temas: ['Perímetros de figuras'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Se recorta la esquina del rectángulo de 6 por 4 en escalones. Cambia el número de escalones y compara el perímetro y el área.',
      voz: 'Agrega escalones. Comprueba qué medida permanece y cuál cambia.',
      controles: [{ id: 'n', etiqueta: 'escalones', min: 0, max: 6, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: figEsc(v.n), estado: {} }),
      lectura: v => [`perímetro = ${f(perim(escalera(v.n)))} · área = ${f(Math.abs(U.area(escalera(v.n))))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora, en el mismo rectángulo, se corta una muesca hacia adentro: 2 de ancho y 1 de fondo. ¿Cuánto mide el perímetro?',
      voz: 'Recorre el borde con el dedo antes de elegir.',
      opciones: [
        { id: 'c', texto: '22', correcta: true },
        { id: 'igual', texto: '20, como con los escalones', error: 'GE-PER1', siFuera: 'Los escalones hacia afuera sí dejan 20. La muesca agrega dos paredes que no tenía el rectángulo.' },
        { id: 'menos', texto: '18, porque se quitó un pedazo', error: 'GE5', siFuera: 'Quitar un pedazo baja el área. El perímetro puede subir: el borde se alargó.' },
        { id: 'cuatro', texto: '24', error: 'GE-PER2', siFuera: 'Contarías 4 si las dos paredes midieran 2. Cada una mide el fondo: 1.' },
      ],
      dibujo: { datos: figMuesca(), estado: {} },
      revelar: { datos: figMuesca({ paredes: true, alt: 'La muesca agrega dos paredes de 1: perímetro 22' }), estado: {} },
      coincide: 'Coincide: 20 del rectángulo más dos paredes de 1.',
    },
    mira: {
      datos: figMuesca({ paredes: true, pasos: { h: 1, v: 2, p: 3 }, alt: 'Tramos horizontales: suman 6 arriba y 6 abajo; verticales: 4 y 4; la muesca agrega 1 y 1' }),
      voz: 'Agrupa los tramos: horizontales, verticales y paredes nuevas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Horizontales: abajo 6; arriba, 2 + 2 + 2 = 6.', ecuacion: ['6 + 6 = 12'] },
        { estado: { corte: 2 }, texto: 'Verticales de los costados: 4 y 4.', ecuacion: ['4 + 4 = 8'] },
        { estado: { corte: 3 }, texto: 'La muesca agrega dos paredes verticales de 1.', ecuacion: ['12 + 8 + 2 = 22'] },
      ],
    },
    regla: {
      texto: 'El perímetro suma solo el borde. Los escalones hacia afuera se proyectan sobre los lados del rectángulo que los encierra; cada muesca hacia adentro agrega sus dos paredes.',
      ecuacion: ['perímetro = 2(base + altura) + 2 · (fondo de cada muesca)'],
      condicion: 'los tramos son horizontales y verticales. Las líneas interiores no cuentan: no son borde.',
      voz: 'Perímetro y área se miden por separado. Uno no arrastra al otro.',
    },
    ahoraTu: {
      voz: 'Agrupa los tramos antes de sumar.',
      generar(s) {
        const r = azar(s), W = r.ent(5, 10), H = r.ent(3, 7), w = r.ent(1, W - 3), d = r.ent(1, H - 1), x0 = r.ent(1, W - w - 1);
        const pts = [[0, 0], [W, 0], [W, H], [x0 + w, H], [x0 + w, H - d], [x0, H - d], [x0, H], [0, H]];
        const P = perim(pts);
        return {
          pregunta: [`Un rectángulo de ${W} por ${H} tiene una muesca hacia adentro de ${w} de ancho y ${d} de fondo. ¿Cuánto mide su perímetro?`],
          dibujo: { datos: { alt: `Rectángulo de ${W} por ${H} con una muesca de ${w} por ${d}`, vista: { x: [-1, W + 1.4], y: [-1, H + 1] }, cuadricula: { paso: 1 }, puntos: [], regiones: [{ puntos: pts, color: 'o', opacidad: 0.18, sinBorde: false }], rotulos: [{ x: W / 2, y: -0.6, texto: `${W}` }, { x: -0.5, y: H / 2, texto: `${H}` }] }, estado: {} },
          opciones: opciones(P, [
            { id: 'rect', valor: 2 * (W + H), error: 'GE-PER1', siFuera: 'Ese es el perímetro sin muesca. Faltan sus dos paredes.' },
            { id: 'menos', valor: 2 * (W + H) - 2 * d, error: 'GE5', siFuera: 'Quitar área no quita borde: las paredes se suman.' },
            { id: 'ancho', valor: 2 * (W + H) + 2 * w, error: 'GE-PER2', siFuera: 'El ancho de la muesca ya está en el tramo de arriba; lo nuevo son las paredes de fondo.' },
          ], x => f(x, 0)),
          solucion: { texto: 'El rectángulo más las dos paredes de la muesca.', ecuacion: [`2(${W} + ${H}) + 2 · ${d} = ${P}`] },
        };
      },
    },
  };

  // ---------- Idea 2: series y analogías ----------
  // Cambia: la regla de giro y la de puntos · Permanece: la flecha · Progresa: los términos 1.º a 4.º ·
  // Se reserva: un término lejano · Debe verse: cada característica cambia con su propia regla.
  const DIR = ['arriba', 'la derecha', 'abajo', 'la izquierda'];
  const FLECHA = [[0, 1], [0.7, 0.2], [0.3, 0.2], [0.3, -0.9], [-0.3, -0.9], [-0.3, 0.2], [-0.7, 0.2]];
  const termino = (cx, giro, puntos, o = {}) => {
    const c = Math.cos(U.rad(-giro)), s = Math.sin(U.rad(-giro));
    const reg = o.vacio ? [] : [{ puntos: FLECHA.map(([x, y]) => [cx + x * c - y * s, 0.4 + x * s + y * c]), color: o.color || 'o', opacidad: 0.25, sinBorde: false, desde: o.desde }];
    const pts = o.vacio ? [] : Array.from({ length: puntos }, (_, k) => ({ id: `p${cx}-${k}`, x: cx - 0.17 * (puntos - 1) + 0.34 * k, y: -1.15, color: 'i', desde: o.desde }));
    return { reg, pts };
  };
  const serie = (giro, mas, base, terminos, o = {}) => {
    const regiones = [], puntos = [], rotulos = [];
    terminos.forEach((t, i) => {
      const cx = i * 2.7;
      regiones.push({ puntos: [[cx - 1.25, -1.6], [cx + 1.25, -1.6], [cx + 1.25, 1.65], [cx - 1.25, 1.65]], opacidad: 0.0001, discontinua: true });
      const vacio = o.oculto === t;
      const T = termino(cx, giro * (t - 1), base + mas * (t - 1), { vacio, desde: o.desde && o.desde[t] });
      regiones.push(...T.reg); puntos.push(...T.pts);
      rotulos.push({ x: cx, y: -2.1, texto: `${t}.º`, color: vacio ? 'h' : undefined });
      if (vacio) rotulos.push({ x: cx, y: 0.1, texto: '?', color: 'h' });
    });
    return { alt: o.alt || `Serie de flechas: cada término gira ${giro}° en sentido horario y suma ${mas} punto${mas > 1 ? 's' : ''}`, vista: { x: [-1.5, 2.7 * (terminos.length - 1) + 1.5], y: [-2.6, 1.9] }, puntos, regiones, rotulos };
  };
  const desc = (giro, n) => `apunta a${DIR[((giro / 90) % 4 + 4) % 4] === 'arriba' || DIR[((giro / 90) % 4 + 4) % 4] === 'abajo' ? ' ' : ' '}${DIR[((giro / 90) % 4 + 4) % 4]}, con ${n} puntos`.replace('a arriba', 'arriba').replace('a abajo', 'abajo');
  const series = {
    id: 'series-y-analogias',
    titulo: 'Una regla por cada cambio',
    temas: ['Series y analogías de figuras'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Elige cuánto gira la flecha en cada término y cuántos puntos se agregan. Mira cómo se arman los cuatro primeros términos.',
      voz: 'Cambia una regla a la vez. Observa qué parte responde.',
      controles: [
        { id: 'g', etiqueta: 'giro', opciones: [{ valor: 90, texto: '90°' }, { valor: 180, texto: '180°' }, { valor: 45, texto: '45°' }] },
        { id: 'm', etiqueta: 'puntos', min: 1, max: 2, paso: 1, inicio: 1, unidad: 'más', decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: serie(v.g, v.m, 1, [1, 2, 3, 4]), estado: {} }),
      lectura: v => [`gira ${v.g}° y suma ${v.m} punto${v.m > 1 ? 's' : ''} por término`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En esta serie la flecha gira 90° en sentido horario y gana un punto en cada término. ¿Cómo es el 5.º término?',
      voz: 'Sigue cada característica por separado.',
      opciones: [
        { id: 'c', texto: 'Apunta arriba, con 6 puntos', correcta: true },
        { id: 'izq', texto: 'Apunta a la izquierda, con 6 puntos', error: 'GE-SER1', siFuera: 'La izquierda sería el 4.º término. El 5.º completa la vuelta.' },
        { id: 'cinco', texto: 'Apunta arriba, con 5 puntos', error: 'GE-SER2', siFuera: 'La orientación está bien. Los puntos empiezan en 2: el 5.º tiene 2 + 4.' },
        { id: 'der', texto: 'Apunta a la derecha, con 7 puntos', error: 'GE-SER1', siFuera: 'Eso avanza un término de más en las dos reglas.' },
      ],
      dibujo: { datos: serie(90, 1, 2, [1, 2, 3, 5], { oculto: 5, alt: 'Términos 1.º a 3.º: la flecha apunta arriba, a la derecha y abajo, con 2, 3 y 4 puntos; el 5.º falta' }), estado: {} },
      revelar: { datos: serie(90, 1, 2, [1, 2, 3, 5], { alt: 'El 5.º término apunta arriba con 6 puntos' }), estado: {} },
      coincide: 'Coincide: 4 giros de 90° son una vuelta, y 2 + 4 = 6 puntos.',
    },
    mira: {
      datos: serie(90, 1, 2, [1, 2, 3, 4, 5], { desde: { 4: 1, 5: 3 }, alt: 'Serie completa hasta el 5.º término' }),
      voz: 'Primero el giro; después los puntos. Nunca los dos a la vez.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Giro: arriba, derecha, abajo, izquierda… cada 4 términos se repite.', ecuacion: ['giro del 5.º = 4 · 90° = 360°'] },
        { estado: { corte: 2 }, texto: 'Puntos: 2, 3, 4, 5… uno más cada vez.', ecuacion: ['puntos del 5.º = 2 + 4 = 6'] },
        { estado: { corte: 3 }, texto: 'Juntando las dos reglas: arriba con 6 puntos.', ecuacion: ['5.º: arriba, 6 puntos'] },
      ],
    },
    regla: {
      texto: 'En una serie o analogía, separa las características (orientación, cantidad, posición) y halla la regla de cada una. Comprueba cada regla con todos los términos dados.',
      condicion: 'pocos términos pueden admitir varias reglas: se elige la que funciona en todos y es la más simple.',
      voz: 'Una regla que falla en un término no sirve.',
    },
    ahoraTu: {
      voz: 'Calcula el giro y los puntos por separado.',
      generar(s) {
        const r = azar(s), giro = r.de([90, 180, 270]), mas = r.ent(1, 3), base = r.ent(1, 3), n = r.ent(5, 9);
        const g = (giro * (n - 1)) % 360, pts = base + mas * (n - 1);
        const d0 = { 90: '90° horario', 180: '180°', 270: '90° antihorario' }[giro];
        const malos = [[g, pts - mas], [(g + giro) % 360, pts], [(g + 360 - giro) % 360, pts + mas], [(g + 180) % 360, pts]];
        const ops = [{ id: 'c', texto: desc(g, pts), correcta: true }];
        const vistos = new Set([ops[0].texto]);
        malos.forEach(([a, b], i) => { const t = desc(a, b); if (!vistos.has(t) && ops.length < 4) { vistos.add(t); ops.push({ id: 'm' + i, texto: t, error: i === 0 ? 'GE-SER2' : 'GE-SER1', siFuera: i === 0 ? 'La orientación está bien; los puntos se cuentan desde el 1.º término.' : 'Ese giro corresponde a otro término. Multiplica el giro por los pasos.' }); } });
        return {
          pregunta: [`Una flecha empieza apuntando arriba con ${base} punto${base > 1 ? 's' : ''}. En cada término gira ${d0} y gana ${mas} punto${mas > 1 ? 's' : ''}. ¿Cómo es el término ${n}.º?`],
          dibujo: { datos: serie(giro, mas, base, [1, 2, 3]), estado: {} },
          opciones: ops,
          solucion: { texto: `Del 1.º al ${n}.º hay ${n - 1} pasos.`, ecuacion: [`giro ${n - 1} · ${giro}° = ${giro * (n - 1)}° · puntos ${base} + ${n - 1} · ${mas} = ${pts}`] },
        };
      },
    },
  };

  // ---------- Idea 3: distribución de números en figuras ----------
  // Cambia: la regla candidata · Permanece: las figuras dadas · Progresa: en cuántas figuras cumple ·
  // Se reserva: dos reglas que cumplen a la vez · Debe verse: una regla se acepta solo si cumple en todas.
  const REGLAS = {
    prod: { texto: 'a · b − c', f: (a, b, c) => a * b - c },
    suma1: { texto: 'a + b + c + 1', f: (a, b, c) => a + b + c + 1 },
    mult: { texto: '(a + b) · c', f: (a, b, c) => (a + b) * c },
    dif: { texto: 'a · c − b', f: (a, b, c) => a * c - b },
    dob: { texto: '2a + b − c', f: (a, b, c) => 2 * a + b - c },
  };
  const tri = (cx, cy, [a, b, c, centro], o = {}) => {
    const A = [cx - 1.1, cy - 0.8], B = [cx + 1.1, cy - 0.8], C = [cx, cy + 1.1];
    return {
      reg: [{ puntos: [A, B, C], color: o.color || 'i', opacidad: 0.12, sinBorde: false, desde: o.desde }],
      rot: [{ x: A[0] - 0.2, y: A[1] - 0.45, texto: `${a}`, desde: o.desde }, { x: B[0] + 0.2, y: B[1] - 0.45, texto: `${b}`, desde: o.desde }, { x: C[0], y: C[1] + 0.4, texto: `${c}`, desde: o.desde },
        { x: cx, y: cy - 0.15, texto: `${centro}`, color: 'o', desde: o.desde },
        ...(o.marca ? [{ x: cx, y: cy - 1.65, texto: o.marca, color: o.marca.startsWith('✓') ? 'd' : 'h', desde: o.marcaDesde !== undefined ? o.marcaDesde : o.desde }] : [])],
    };
  };
  const F1 = [3, 4, 2, 10], F2 = [5, 2, 1, 9], F4 = [4, 4, 3, 13], F3 = [6, 3, 2];
  const cumple = (R, F) => REGLAS[R].f(F[0], F[1], F[2]) === F[3];
  const figDist = (figs, o = {}) => {
    const reg = [], rot = [];
    figs.forEach(([F, ox, oy, op]) => { const t = tri(ox * 1.25, oy, F, op || {}); reg.push(...t.reg); rot.push(...t.rot); });
    return { alt: o.alt || 'Triángulos con un número en cada vértice y otro en el centro', vista: o.vista || { x: [-1.6, 5.4], y: [-2.1, 1.9] }, puntos: [], regiones: reg, rotulos: rot };
  };
  const distribucion = {
    id: 'distribucion',
    titulo: 'La regla debe cumplir en todas',
    temas: ['Distribución de figuras'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Cada triángulo lleva a, b y c en sus vértices (izquierda, derecha, arriba) y un número al centro. Prueba cada regla en ambos.',
      voz: 'Prueba cada regla en las dos figuras, no solo en una.',
      controles: [{ id: 'R', etiqueta: 'regla', opciones: [{ valor: 'mult', texto: '(a + b) · c' }, { valor: 'prod', texto: 'a · b − c' }, { valor: 'suma1', texto: 'a + b + c + 1' }] }],
      dibujo: v => ({ datos: figDist([[F1, 0, 0, { marca: cumple(v.R, F1) ? '✓ cumple' : `✗ da ${REGLAS[v.R].f(...F1.slice(0, 3))}` }], [F2, 3, 0, { marca: cumple(v.R, F2) ? '✓ cumple' : `✗ da ${REGLAS[v.R].f(...F2.slice(0, 3))}` }]], { alt: `La regla ${REGLAS[v.R].texto} cumple en ${[F1, F2].filter(F => cumple(v.R, F)).length} de las 2 figuras` }), estado: {} }),
      lectura: v => [`${REGLAS[v.R].texto}: cumple en ${[F1, F2].filter(F => cumple(v.R, F)).length} de 2 figuras`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Dos reglas cumplen en las dos figuras: a · b − c y a + b + c + 1. En un tercer triángulo, a = 6, b = 3 y c = 2. ¿Qué número va al centro?',
      voz: 'Antes de elegir, calcula con las dos reglas.',
      opciones: [
        { id: 'c', texto: 'No se puede decidir: dan 16 o 12', correcta: true },
        { id: 'r1', texto: '16', error: 'GE-DIS1', siFuera: '16 sale de a · b − c, que sí cumple; la otra regla también cumple y da 12.' },
        { id: 'r2', texto: '12', error: 'GE-DIS1', siFuera: '12 sale de a + b + c + 1, que sí cumple; la otra regla también cumple y da 16.' },
      ],
      dibujo: { datos: figDist([[F1, 0, 0], [F2, 3, 0], [[...F3, '?'], 6, 0]], { vista: { x: [-1.6, 9.1], y: [-2.1, 1.9] } }), estado: {} },
      revelar: { datos: figDist([[F1, 0, 0, { marca: '✓ las dos' }], [F2, 3, 0, { marca: '✓ las dos' }], [[...F3, '16 o 12'], 6, 0, { color: 'h' }]], { vista: { x: [-1.6, 9.1], y: [-2.1, 1.9] }, alt: 'Las dos reglas cumplen en las figuras dadas; en la tercera dan 16 y 12' }), estado: {} },
      coincide: 'Coincide: con dos figuras no basta. Hace falta otra que decida.',
    },
    mira: {
      datos: figDist([[F1, 0, 2.7], [F2, 3, 2.7], [F4, 0, -1.3, { desde: 2, marca: '✓ solo a · b − c', marcaDesde: 2 }], [[...F3, 16], 3, -1.3, { desde: 3, color: 'd' }]], { vista: { x: [-1.6, 5.4], y: [-3.4, 4.4] }, alt: 'Una tercera figura con 4, 4 y 3 tiene 13 al centro: solo cumple a · b − c, así que el triángulo de 6, 3 y 2 lleva 16' }),
      voz: 'Una figura más decide entre las dos reglas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Las dos reglas cumplen en las figuras de arriba.', ecuacion: ['3·4 − 2 = 10 · 3 + 4 + 2 + 1 = 10'] },
        { estado: { corte: 2 }, texto: 'Otra figura del examen: 4, 4 y 3 con 13 al centro.', ecuacion: ['4·4 − 3 = 13 ✓ · 4 + 4 + 3 + 1 = 12 ✗'] },
        { estado: { corte: 3 }, texto: 'Solo queda a · b − c: el centro es 16.', ecuacion: ['6 · 3 − 2 = 16'] },
      ],
    },
    regla: {
      texto: 'Una regla de distribución se acepta si cumple en todas las figuras dadas. Si dos reglas cumplen, hace falta otra figura que las distinga.',
      condicion: 'la regla usa las mismas posiciones (a, b, c) en todas las figuras. Se prueba antes de calcular el número que falta.',
      voz: 'Comprueba la regla en cada figura antes de usarla.',
    },
    ahoraTu: {
      voz: 'Busca la regla que cumple en las tres figuras completas.',
      generar(s) {
        const r = azar(s), ids = Object.keys(REGLAS);
        for (let intento = 0; intento < 50; intento++) {
          const R = ids[(s + intento) % ids.length];
          const figs = Array.from({ length: 4 }, () => { const a = r.ent(2, 7), b = r.ent(1, 6), c = r.ent(1, 4); return [a, b, c, REGLAS[R].f(a, b, c)]; });
          if (figs.some(F => F[3] < 0)) continue;
          const otras = ids.filter(x => x !== R && figs.slice(0, 3).every(F => cumple(x, F)));
          if (otras.length) continue;
          const dist = ids.filter(x => x !== R).map(x => ({ id: x, valor: REGLAS[x].f(...figs[3].slice(0, 3)), error: 'GE-DIS1', siFuera: `${REGLAS[x].texto} da ese número, pero no cumple en todas las figuras dadas.` }));
          return {
            pregunta: [`En cada triángulo, el centro sale de a (izquierda), b (derecha) y c (arriba) con la misma regla. ¿Qué número va en el centro del cuarto?`],
            dibujo: { datos: figDist(figs.map((F, i) => [i === 3 ? [...F.slice(0, 3), '?'] : F, (i % 2) * 3, i < 2 ? 2.7 : -1.3]), { vista: { x: [-1.6, 5.4], y: [-2.3, 4.4] } }), estado: {} },
            opciones: opciones(figs[3][3], dist, x => f(x, 0)),
            solucion: { texto: `La regla que cumple en las tres es ${REGLAS[R].texto}.`, ecuacion: [`${REGLAS[R].texto} → ${figs[3][3]}`] },
          };
        }
        return null;
      },
    },
  };

  // ---------- Idea 4: conteo de triángulos en un abanico ----------
  // Cambia: el número de espacios n · Permanece: el vértice común · Progresa: los triángulos por tamaño ·
  // Se reserva: una segunda transversal · Debe verse: cada triángulo es un par de rayos más una transversal.
  const abanico = (n, k, o = {}) => {
    const V = [0, 4.2], base = j => [-3 + 6 * j / n, 0];
    const corte = (j, y) => U.mezcla(V, base(j), (4.2 - y) / 4.2);
    const ys = k === 2 ? [0, 2] : [0];
    const pts = [{ id: 'V', x: V[0], y: V[1], rotulo: 'O', lado: 90 }];
    ys.forEach((y, t) => { for (let j = 0; j <= n; j++) { const p = corte(j, y); pts.push({ id: `b${t}-${j}`, x: p[0], y: p[1] }); } });
    const seg = [];
    for (let j = 0; j <= n; j++) seg.push({ de: 'V', a: `b0-${j}` });
    ys.forEach((y, t) => seg.push({ de: `b${t}-0`, a: `b${t}-${n}`, color: t ? 'i' : 'o', grosor: 'variable' }));
    const reg = (o.marcar || []).map(([t, i, j, desde, color]) => ({ puntos: ['V', `b${t}-${i}`, `b${t}-${j}`], color: color || 'h', opacidad: 0.22, desde }));
    return { alt: o.alt || `Abanico de ${n} espacios${k === 2 ? ' con dos transversales' : ''}: ${k * n * (n + 1) / 2} triángulos`, vista: { x: [-3.6, 3.6], y: [-0.6, 4.8] }, puntos: pts, segmentos: seg, regiones: reg };
  };
  const conteo = {
    id: 'conteo-de-triangulos',
    titulo: 'Contar por pares de rayos',
    temas: ['Conteo de figuras, rutas y cubos'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Desde O salen rayos que cortan la base en n espacios. Cambia n y mira cuántos triángulos de cada tamaño aparecen.',
      voz: 'Cuenta por tamaños: de 1 espacio, de 2, de 3…',
      controles: [{ id: 'n', etiqueta: 'n', min: 1, max: 6, paso: 1, inicio: 3, unidad: 'espacios', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: abanico(v.n, 1, { marcar: [[0, 0, 1, 0, 'o']] }), estado: {} }),
      lectura: v => [Array.from({ length: v.n }, (_, k) => v.n - k).join(' + ') + ` = ${v.n * (v.n + 1) / 2} triángulos`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora el abanico de 3 espacios tiene una segunda transversal que corta todos los rayos. ¿Cuántos triángulos hay en total?',
      voz: 'Piensa qué necesita cada triángulo: rayos y una base.',
      opciones: [
        { id: 'c', texto: '12', correcta: true },
        { id: 'seis', texto: '6', error: 'GE-CNT1', siFuera: '6 cuenta solo los que usan la base de abajo. La transversal da otros tantos.' },
        { id: 'chicos', texto: '3', error: 'GE-CNT2', siFuera: 'Esos son los triángulos chicos. También cuentan los que juntan espacios.' },
        { id: 'siete', texto: '7', error: 'GE-CNT2', siFuera: 'Eso agrega uno por la transversal; cada transversal forma 6 con los rayos.' },
      ],
      dibujo: { datos: abanico(3, 2), estado: {} },
      revelar: { datos: abanico(3, 2, { marcar: [[1, 0, 3, 0, 'i'], [0, 0, 2, 0, 'o']], alt: 'Cada transversal forma 6 triángulos con los rayos: 12 en total' }), estado: {} },
      coincide: 'Coincide: 6 triángulos con cada transversal, 6 + 6 = 12.',
    },
    mira: {
      datos: abanico(3, 2, { marcar: [[0, 0, 1, 1, 'o'], [0, 0, 2, 2, 'o'], [0, 0, 3, 3, 'o'], [1, 1, 3, 4, 'i']], alt: 'Triángulos de 1, 2 y 3 espacios con la base de abajo, y uno con la transversal' }),
      voz: 'Clasifica antes de contar: así nada se repite.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Con la base de abajo: 3 triángulos de un espacio.', ecuacion: ['3'] },
        { estado: { corte: 2 }, texto: 'De dos espacios juntos: 2.', ecuacion: ['3 + 2'] },
        { estado: { corte: 3 }, texto: 'De tres espacios: 1. Con esta base, 6.', ecuacion: ['3 + 2 + 1 = 6'] },
        { estado: { corte: 4 }, texto: 'La transversal repite la cuenta: otros 6.', ecuacion: ['2 · 6 = 12'] },
      ],
    },
    regla: {
      texto: 'Un abanico de n espacios forma n + (n − 1) + … + 1 triángulos con cada transversal: tantos como pares de rayos. Con k transversales, k veces eso.',
      ecuacion: ['triángulos = k · ', { frac: ['n(n + 1)', '2'] }],
      condicion: 'todos los rayos salen del mismo vértice y cada transversal los corta a todos.',
      voz: 'Clasificar por tamaño evita omitir y repetir.',
    },
    ahoraTu: {
      voz: 'Cuenta por tamaños con una transversal; después multiplica.',
      generar(s) {
        const r = azar(s), n = r.ent(2, 7), k = r.ent(1, 3), T = k * n * (n + 1) / 2;
        return {
          pregunta: [`Desde un vértice salen rayos que forman ${n} espacios, y ${k} transversal${k > 1 ? 'es' : ''} cortan todos los rayos. ¿Cuántos triángulos hay?`],
          dibujo: { datos: abanico(n, Math.min(k, 2), { alt: `Abanico de ${n} espacios` }), estado: {} },
          opciones: opciones(T, [
            { id: 'chicos', valor: k * n, error: 'GE-CNT2', siFuera: 'Esos son solo los triángulos de un espacio.' },
            { id: 'una', valor: n * (n + 1) / 2, error: 'GE-CNT1', siFuera: 'Esa es la cuenta de una sola transversal.' },
            { id: 'pares', valor: k * n * (n - 1) / 2, error: 'GE-CNT2', siFuera: `Revisa los rayos: con ${n} espacios hay ${n + 1} rayos.` },
          ], x => f(x, 0)),
          solucion: { texto: `Con cada transversal: ${n} + … + 1 = ${n * (n + 1) / 2}.`, ecuacion: [`${k} · ${n * (n + 1) / 2} = ${T}`] },
        };
      },
    },
  };

  // ---------- Idea 5: rutas en una cuadrícula ----------
  // Cambia: el tamaño de la cuadrícula · Permanece: solo se avanza a la derecha o arriba · Progresa: el número de cada esquina ·
  // Se reserva: una cuadra cerrada · Debe verse: cada esquina suma lo que llega de la izquierda y de abajo.
  const rutasDP = (m, n, cerrada) => {
    const N = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) for (let j = 0; j <= n; j++) {
      if (!i && !j) { N[i][j] = 1; continue; }
      const iz = i > 0 && !(cerrada && cerrada[0] === i - 1 && cerrada[1] === j && cerrada[2] === 'h') ? N[i - 1][j] : 0;
      const ab = j > 0 && !(cerrada && cerrada[0] === i && cerrada[1] === j - 1 && cerrada[2] === 'v') ? N[i][j - 1] : 0;
      N[i][j] = iz + ab;
    }
    return N;
  };
  const cuadricula = (m, n, o = {}) => {
    const N = rutasDP(m, n, o.cerrada);
    const pts = [], seg = [], rot = [];
    for (let i = 0; i <= m; i++) for (let j = 0; j <= n; j++) {
      pts.push({ id: `n${i}-${j}`, x: i, y: j, color: i === m && j === n ? 'h' : (!i && !j ? 'o' : undefined) });
      const ve = o.numeros === undefined ? true : (o.numeros === 'todos' || i + j <= o.numeros);
      if (o.numeros !== false && ve) rot.push({ x: i + 0.22, y: j + 0.3, texto: `${N[i][j]}`, color: i === m && j === n ? 'h' : 'i', ancla: 'start', desde: o.diag ? i + j : 0 });
    }
    for (let i = 0; i <= m; i++) for (let j = 0; j <= n; j++) {
      if (i < m) seg.push({ de: `n${i}-${j}`, a: `n${i + 1}-${j}`, ...(o.cerrada && o.cerrada[0] === i && o.cerrada[1] === j && o.cerrada[2] === 'h' ? { color: 'h', discontinua: true } : {}) });
      if (j < n) seg.push({ de: `n${i}-${j}`, a: `n${i}-${j + 1}`, ...(o.cerrada && o.cerrada[0] === i && o.cerrada[1] === j && o.cerrada[2] === 'v' ? { color: 'h', discontinua: true } : {}) });
    }
    if (o.cerrada) rot.push({ x: o.cerrada[0] + (o.cerrada[2] === 'h' ? 0.5 : 0), y: o.cerrada[1] + (o.cerrada[2] === 'v' ? 0.5 : 0) - 0.05, texto: '×', color: 'h' });
    rot.push({ x: -0.35, y: -0.45, texto: 'A', color: 'o' }, { x: m + 0.95, y: n - 0.15, texto: 'B', color: 'h' });
    return { alt: o.alt || `Cuadrícula de ${m} por ${n} cuadras: ${N[m][n]} rutas de A a B avanzando a la derecha o arriba${o.cerrada ? ', con una cuadra cerrada' : ''}`, vista: { x: [-0.8, Math.max(m, 4) + 1.3], y: [-0.8, Math.max(n, 3) + 0.9] }, puntos: pts, segmentos: seg, rotulos: rot };
  };
  const rutas = {
    id: 'rutas',
    titulo: 'Cada esquina suma dos caminos',
    temas: ['Conteo de figuras, rutas y cubos'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Vas de A a B solo hacia la derecha o hacia arriba. Cada esquina muestra cuántas rutas llegan a ella. Cambia el tamaño.',
      voz: 'Mira una esquina: compárala con sus vecinas de la izquierda y de abajo.',
      controles: [
        { id: 'm', etiqueta: 'cuadras a lo ancho', min: 1, max: 4, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'n', etiqueta: 'cuadras a lo alto', min: 1, max: 3, paso: 1, inicio: 2, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: cuadricula(v.m, v.n), estado: {} }),
      lectura: v => [`rutas de A a B: ${rutasDP(v.m, v.n)[v.m][v.n]}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'En la cuadrícula de 3 por 2 hay 10 rutas. Ahora se cierra la cuadra marcada con ×. ¿Cuántas rutas quedan?',
      voz: 'La esquina de después de la cuadra pierde una entrada.',
      opciones: [
        { id: 'c', texto: `${rutasDP(3, 2, [1, 1, 'h'])[3][2]}`, correcta: true },
        { id: 'menos1', texto: '9', error: 'GE-RUT1', siFuera: 'Restar una sería cierto si por esa cuadra pasara una sola ruta. Pasan varias.' },
        { id: 'igual', texto: '10', error: 'GE-RUT1', siFuera: 'Seguirían 10 si ninguna ruta usara esa cuadra.' },
        { id: 'mitad', texto: '5', error: 'GE-RUT2', siFuera: 'La mitad sería cierta si justo la mitad de las rutas pasara por ahí.' },
      ],
      dibujo: { datos: cuadricula(3, 2, { cerrada: [1, 1, 'h'], numeros: false, alt: 'Cuadrícula de 3 por 2 con la cuadra del centro cerrada' }), estado: {} },
      revelar: { datos: cuadricula(3, 2, { cerrada: [1, 1, 'h'] }), estado: {} },
      coincide: 'Coincide: la esquina siguiente solo recibe lo que viene de abajo.',
    },
    mira: {
      datos: cuadricula(3, 2, { cerrada: [1, 1, 'h'], diag: true, numeros: 'todos', alt: 'Los números de cada esquina se llenan desde A, en diagonales' }),
      voz: 'Llena las esquinas en orden, desde A.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Por el borde de abajo y el de la izquierda, una sola ruta.', ecuacion: ['1, 1, 1…'] },
        { estado: { corte: 2 }, texto: 'Cada esquina suma la de su izquierda y la de abajo.', ecuacion: ['1 + 1 = 2'] },
        { estado: { corte: 3 }, texto: 'Tras la cuadra cerrada, solo cuenta lo que viene de abajo.', ecuacion: ['sin la entrada de la izquierda'] },
        { estado: { corte: 5 }, texto: 'Sumando hasta B, quedan las rutas que no usan la cuadra.', ecuacion: [`B = ${rutasDP(3, 2, [1, 1, 'h'])[3][2]}`] },
      ],
    },
    regla: {
      texto: 'Cada esquina recibe la suma de las rutas que llegan desde su izquierda y desde abajo. Sin cuadras cerradas, de A a B hay C(m + n, m) rutas.',
      ecuacion: ['N(esquina) = N(izquierda) + N(abajo)'],
      condicion: 'solo se avanza a la derecha o hacia arriba. Una cuadra cerrada quita esa entrada a la esquina siguiente.',
      voz: 'Una esquina a la vez: así no se pierde ninguna ruta.',
    },
    ahoraTu: {
      voz: 'Llena las esquinas desde A; cuida la cuadra cerrada.',
      generar(s) {
        const r = azar(s), m = r.ent(2, 4), n = r.ent(2, 3), cerr = s % 3 === 0 ? null : [r.ent(0, m - 1), r.ent(0, n), 'h'];
        const N = rutasDP(m, n, cerr), sin = rutasDP(m, n)[m][n], T = N[m][n];
        return {
          pregunta: [`Vas de A a B solo a la derecha o hacia arriba${cerr ? ', sin usar la cuadra cerrada' : ''}. ¿Cuántas rutas distintas hay?`],
          dibujo: { datos: cuadricula(m, n, { cerrada: cerr, numeros: false }), estado: {} },
          opciones: opciones(T, [
            { id: 'sin', valor: cerr ? sin : sin * 2, error: cerr ? 'GE-RUT1' : 'GE-RUT2', siFuera: cerr ? 'Ese total ignora la cuadra cerrada.' : 'Eso duplica la cuenta; cada ruta se cuenta una vez.' },
            { id: 'menos1', valor: cerr ? sin - 1 : sin - 1, error: 'GE-RUT1', siFuera: 'Restar una ruta supone que por ahí pasa solo una.' },
            { id: 'mxn', valor: m * n, error: 'GE-RUT2', siFuera: 'm · n cuenta cuadraditos, no rutas.' },
            { id: 'suma', valor: m + n, error: 'GE-RUT2', siFuera: 'm + n es el largo de cada ruta, no cuántas hay.' },
          ], x => f(x, 0)),
          solucion: { texto: 'Suma en cada esquina lo que llega de la izquierda y de abajo.', ecuacion: [`B = ${T}`], dibujo: { datos: cuadricula(m, n, { cerrada: cerr, numeros: 'todos' }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 6: cubos que no se ven ----------
  // Cambia: los pisos de la pila · Permanece: el cubito unidad · Progresa: los cubitos que hay bajo los visibles ·
  // Se reserva: el cubo pintado (el de adentro) · Debe verse: contar por capas incluye los ocultos.
  const TRES = { giro: -35, alza: 28 };
  const caras = (cubos, o = {}) => {
    const hay = new Set(cubos.map(c => c.join(',')));
    const prof = ([i, j, k]) => { const g = U.rad(TRES.giro), a = U.rad(TRES.alza), x = i + 0.5, y = j + 0.5, z = k + 0.5; const z1 = -x * Math.sin(g) + z * Math.cos(g); return y * Math.sin(a) + z1 * Math.cos(a); };
    const orden = cubos.slice().sort((p, q) => prof(p) - prof(q));
    const reg = [];
    for (const c of orden) {
      const [i, j, k] = c, col = o.color ? o.color(c) : 'i', des = o.desde ? o.desde(c) : 0, has = o.hasta ? o.hasta(c) : undefined;
      if (!hay.has(`${i},${j + 1},${k}`)) reg.push({ puntos: [[i, j + 1, k], [i + 1, j + 1, k], [i + 1, j + 1, k + 1], [i, j + 1, k + 1]], color: col, opacidad: 0.32, fondo: true, sinBorde: false, desde: des, hasta: has });
      if (!hay.has(`${i},${j},${k + 1}`)) reg.push({ puntos: [[i, j, k + 1], [i + 1, j, k + 1], [i + 1, j + 1, k + 1], [i, j + 1, k + 1]], color: col, opacidad: 0.14, fondo: true, sinBorde: false, desde: des, hasta: has });
      if (!hay.has(`${i + 1},${j},${k}`)) reg.push({ puntos: [[i + 1, j, k], [i + 1, j + 1, k], [i + 1, j + 1, k + 1], [i + 1, j, k + 1]], color: col, opacidad: 0.22, fondo: true, sinBorde: false, desde: des, hasta: has });
    }
    return reg;
  };
  const piramide = n => { const c = []; for (let j = 0; j < n; j++) for (let i = 0; i < n - j; i++) for (let k = 0; k < n - j; k++) c.push([i, j, k]); return c; };
  const figPir = n => ({ alt: `Pila escalonada de ${n} pisos: ${piramide(n).length} cubitos en total, algunos ocultos bajo los de arriba`, tresD: TRES, vista: { x: [-1.4, 5.2], y: [-3.8, 4.6] }, puntos: [], regiones: caras(piramide(n)) });
  const cubo3 = (o = {}) => {
    const c = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) c.push([i, j, k]);
    if (!o.capas) return { alt: o.alt || 'Cubo de 3 por 3 por 3 pintado por fuera', tresD: TRES, vista: { x: [-0.8, 4.4], y: [-2.6, 3.8] }, puntos: [], regiones: caras(c, { color: () => 'o' }) };
    // Capas separadas: cada piso se dibuja más arriba para ver la del medio.
    const reg = [];
    for (const j of [0, 1, 2]) {
      const piso = c.filter(q => q[1] === j).map(([i, , k]) => [i, j * 2.2, k]);
      const color = ([i, , k]) => (j === 1 && i === 1 && k === 1 ? 'h' : 'o');
      if (j !== 1) { reg.push(...caras(piso, { color })); continue; }
      // Piso del medio: completo hasta el paso 1; desde el paso 2, sin la fila de adelante ni la de la derecha, para ver el central.
      reg.push(...caras(piso, { color, hasta: () => 1 }));
      reg.push(...caras(piso.filter(([i, , k]) => i < 2 && k < 2), { color, desde: () => 2 }));
    }
    return { alt: 'Cubo de 3 por 3 por 3 separado en tres pisos: en el del medio, el cubito central no toca el exterior', tresD: TRES, vista: { x: [-0.8, 4.6], y: [-2.6, 6.8] }, puntos: [], regiones: reg,
      rotulos: [{ x: 3.4, y: 2.7, z: 0, texto: '1 oculto', color: 'h', ancla: 'start', desde: 2 }] };
  };
  const cubos = {
    id: 'cubos-ocultos',
    titulo: 'Los cubitos que no se ven',
    temas: ['Conteo de figuras, rutas y cubos'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Una pila escalonada se arma por pisos: cada piso es un cuadrado con un cubito menos por lado que el de abajo. Cambia los pisos.',
      voz: 'Cuenta por pisos, también lo que queda debajo.',
      controles: [{ id: 'n', etiqueta: 'pisos', min: 1, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: figPir(v.n), estado: {} }),
      lectura: v => [Array.from({ length: v.n }, (_, k) => `${(v.n - k) ** 2}`).join(' + ') + ` = ${piramide(v.n).length} cubitos`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un cubo de 3 por 3 por 3 se pinta por fuera y se corta en 27 cubitos. ¿Cuántos cubitos quedan sin ninguna cara pintada?',
      voz: 'Piensa en los que no tocan el exterior.',
      opciones: [
        { id: 'c', texto: '1', correcta: true },
        { id: 'cero', texto: '0: todos se ven pintados', error: 'GE13', siFuera: 'Desde afuera solo se ven los de la superficie. Hay uno que nunca toca el exterior.' },
        { id: 'ocho', texto: '8', error: 'GE-CUB1', siFuera: '8 son las esquinas: tienen tres caras pintadas, no ninguna.' },
        { id: 'nueve', texto: '9', error: 'GE-CUB1', siFuera: '9 es un piso completo; en el piso del medio, 8 tocan el exterior.' },
      ],
      dibujo: { datos: cubo3(), estado: {} },
      revelar: { datos: cubo3({ capas: true }), estado: { corte: 2 } },
      coincide: 'Coincide: solo el cubito central del piso del medio queda sin pintar.',
    },
    mira: {
      datos: cubo3({ capas: true }),
      voz: 'Separa el cubo en pisos y revisa cada uno.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Los pisos de arriba y de abajo tocan el exterior: 18 pintados.', ecuacion: ['9 + 9 = 18'] },
        { estado: { corte: 2 }, texto: 'En el piso del medio, 8 tocan los costados; el centro no.', ecuacion: ['9 − 8 = 1'] },
        { estado: { corte: 2 }, texto: 'En general, sin pintar quedan los de un cubo interior de lado n − 2.', ecuacion: ['(n − 2)³ = 1³ = 1'] },
      ],
    },
    regla: {
      texto: 'Cuenta los cubitos por capas: los ocultos también están. En un cubo pintado de lado n hay cuatro clases: esquinas, aristas, centros de cara e interior.',
      ecuacion: ['3 caras: 8 · 2 caras: 12(n − 2) · 1 cara: 6', { sup: ['(n − 2)', '2'] }, ' · 0: ', { sup: ['(n − 2)', '3'] }],
      condicion: 'el sólido está completo por dentro (no hay huecos) y n ≥ 2.',
      voz: 'Lo que no se ve también se cuenta.',
    },
    ahoraTu: {
      voz: 'Ubica la clase de cubito: esquina, arista, cara o interior.',
      generar(s) {
        const r = azar(s), n = r.ent(3, 7), cl = s % 4;
        const nom = ['exactamente tres caras pintadas', 'exactamente dos caras pintadas', 'exactamente una cara pintada', 'ninguna cara pintada'][cl];
        const val = [8, 12 * (n - 2), 6 * (n - 2) ** 2, (n - 2) ** 3];
        return {
          pregunta: [`Un cubo de ${n} por ${n} por ${n} se pinta por fuera y se corta en ${n ** 3} cubitos. ¿Cuántos tienen ${nom}?`],
          opciones: opciones(val[cl], [
            { id: 'v0', valor: val[(cl + 1) % 4], error: 'GE-CUB1', siFuera: 'Ese número corresponde a otra clase de cubito.' },
            { id: 'v1', valor: val[(cl + 2) % 4], error: 'GE-CUB1', siFuera: 'Ese número corresponde a otra clase de cubito.' },
            { id: 'sup', valor: cl === 3 ? 0 : 6 * n * n, error: 'GE13', siFuera: cl === 3 ? 'Desde afuera no se ven, pero los cubitos interiores existen.' : '6n² cuenta caras visibles, no cubitos.' },
            { id: 'n', valor: cl === 1 ? 12 * n : cl === 2 ? 6 * n * n : n ** 3 - 6 * n * n, error: 'GE-CUB1', siFuera: 'Revisa: a cada arista o cara se le quitan las esquinas, n − 2.' },
          ], x => f(x, 0)),
          solucion: { texto: ['Esquinas: 8.', 'Aristas: 12 de n − 2.', 'Caras: 6 de (n − 2)².', 'Interior: cubo de lado n − 2.'][cl], ecuacion: [[`8`, `12 · ${n - 2} = ${val[1]}`, `6 · ${n - 2}² = ${val[2]}`, `${n - 2}³ = ${val[3]}`][cl]] },
        };
      },
    },
  };

  return {
    unidad: 'geometria.razonamiento-con-figuras',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'Los puentes de Königsberg planteaban cruzar cada puente una sola vez. Euler reformuló el problema atendiendo solo a las conexiones entre regiones y puentes, y dejó de lado las medidas. Ese cambio ayudó a abrir lo que hoy llamamos teoría de grafos. La lección: decidir qué información importa antes de contar.',
      pregunta: '¿Qué detalles de una figura puedes ignorar sin cambiar la respuesta?',
      fuente: { titulo: 'MacTutor: The Königsberg bridges', url: 'https://mathshistory.st-andrews.ac.uk/Extras/Konigsberg/' },
    },
    ideas: [perimetro, series, distribucion, conteo, rutas, cubos],
  };
});
