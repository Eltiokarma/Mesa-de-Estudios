/*
 * Teoría de «Áreas y líneas notables con trigonometría» (trigonometria.areas-y-lineas-notables), 5.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 17), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (trigonometría, pp. 82–100) y las «Precisiones de Geometría y Trigonometría» del expediente. Forma: angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: declara qué ángulo está entre qué lados antes de sustituir.
 * Colores (regla 4): el ángulo (A, θ) en naranja (c-o); los largos que se dan, lados a, b, c y diagonales d₁, d₂,
 * en turquesa (c-i); los largos que se calculan (altura h, semiperímetro p, radios r, R, rₐ, ceviana t, mediana,
 * bisectriz y los trozos m, n) en verde (c-d); el área S en rojo (c-h).
 * Errores (hipótesis de aula, docs/investigacion/trigonometria-ideas-erroneas.md no los mide): TR10 y TR25 existen;
 * nuevos: AREA-ANGULO, AREA-OBTUSO, AREA-SIN-MEDIO, AREA-COS, AREA-UNA-RAMA, HERON-IMPOSIBLE, HERON-PERIMETRO,
 * HERON-SIN-RAIZ, SEMI-CRUZA, SEMI-ENTERO, RADIO-CONFUNDE, RADIO-PERIMETRO, RADIO-ALTURA, EXRADIO-LADO,
 * BIS-MEDIANA, BIS-ANGULOS, BIS-CRUZA, STEW-LADOS, MED-SIN-CUARTO, CUAD-CRUCE, CUAD-FALTAN, CUAD-ROMBO.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: elegir la fórmula de área o de línea notable que usa exactamente los datos que se tienen.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: calcula el área con dos lados y el ángulo, con Herón o con un radio, y el largo de una ceviana.
 *   Orden de atención: 1.º el ángulo entre los dos lados · 2.º la construcción (altura, círculos, ceviana) ·
 *     acción: mover un ángulo, un lado o un punto · fondo: el triángulo o el cuadrilátero.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué 30° y 150° dan la misma área, y cuándo no se puede usar Herón?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const A = { v: 'c-o', t: 'A' }, th = { v: 'c-o', t: 'θ' };
  const a = { v: 'c-i', t: 'a' }, b = { v: 'c-i', t: 'b' }, c = { v: 'c-i', t: 'c' };
  const d1 = { sub: [{ v: 'c-i', t: 'd' }, '1'] }, d2 = { sub: [{ v: 'c-i', t: 'd' }, '2'] };
  const S = { v: 'c-h', t: 'S' }, p = { v: 'c-d', t: 'p' }, h = { v: 'c-d', t: 'h' }, r = { v: 'c-d', t: 'r' }, R = { v: 'c-d', t: 'R' };
  const ra = { sub: [{ v: 'c-d', t: 'r' }, 'a'] }, t = { v: 'c-d', t: 't' }, m = { v: 'c-d', t: 'm' }, n = { v: 'c-d', t: 'n' };
  const RAD = Math.PI / 180;
  const sen = g => Math.sin(g * RAD), cos = g => Math.cos(g * RAD);
  const medio = { frac: ['1', '2'] };
  // Azar con semilla para «Ahora tú» (el de la unidad de referencia).
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un texto se descartan.
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
  // ---------- Geometría compartida ----------
  const dir = (V, Q) => Math.atan2(Q[1] - V[1], Q[0] - V[0]) / RAD;
  function angulo(V, P1, P2, rr, color, rotulo, extra) {
    const de = dir(V, P1);
    let s = dir(V, P2) - de;
    while (s > 180) s -= 360;
    while (s <= -180) s += 360;
    return Object.assign({ cx: V[0], cy: V[1], de, a: de + s, r: rr, espiral: 0, flecha: false, color, rotulo }, extra);
  }
  // Rótulo de un segmento, a un lado de su punto medio, del lado contrario al punto Opp.
  function lado(P1, P2, Opp, texto, color, dist, extra) {
    const mx = (P1[0] + P2[0]) / 2, my = (P1[1] + P2[1]) / 2, L = Math.hypot(P2[0] - P1[0], P2[1] - P1[1]) || 1;
    let nx = -(P2[1] - P1[1]) / L, ny = (P2[0] - P1[0]) / L;
    if (nx * (Opp[0] - mx) + ny * (Opp[1] - my) > 0) { nx = -nx; ny = -ny; }
    return Object.assign({ x: mx + nx * dist, y: my + ny * dist - (ny < -0.5 ? 0.6 * dist : 0), texto, color, ancla: nx > 0.35 ? 'start' : nx < -0.35 ? 'end' : 'middle' }, extra);
  }
  // Nombre de un vértice, hacia afuera desde el punto G.
  function vertice(V, G, texto, dist, extra) {
    const dx = V[0] - G[0], dy = V[1] - G[1], L = Math.hypot(dx, dy) || 1;
    return Object.assign({ x: V[0] + dx / L * dist, y: V[1] + dy / L * dist - (dy < 0 ? 0.5 * dist : 0), texto }, extra);
  }
  // Ventana que contiene los puntos, con un margen proporcional.
  function caja(pts, k = 0.14) {
    const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), mg = k * Math.max(x1 - x0, y1 - y0);
    return { x: [x0 - mg, x1 + mg], y: [y0 - mg, y1 + mg] };
  }
  // Triángulo por sus lados: B en el origen, C sobre el eje x, A arriba (a = BC, b = CA, c = AB).
  function porLados(av, bv, cv) {
    const x = (cv * cv - bv * bv + av * av) / (2 * av);
    return { A: [x, Math.sqrt(Math.max(0, cv * cv - x * x))], B: [0, 0], C: [av, 0] };
  }
  const heron = (av, bv, cv) => { const pv = (av + bv + cv) / 2; return { pv, rad: pv * (pv - av) * (pv - bv) * (pv - cv) }; };
  const raizTxt = N => (Math.abs(Math.sqrt(N) - Math.round(Math.sqrt(N))) < 1e-9 ? f(Math.sqrt(N)) : `√${f(N)} ≈ ${f(Math.sqrt(N))}`);

  // ---------- Idea 1: el área cambia con el seno del ángulo ----------
  // Cambia: el ángulo A entre los lados fijos b = 5 y c = 6. · Permanece: los dos lados y la base sobre el eje.
  // Progresa: la altura h = c sen A, que sube hasta 90° y vuelve a bajar. · Se reserva: un par de ángulos
  // suplementarios (la predicción; el juego no muestra ninguno). · Debe verse: que la altura, no el ángulo, decide el área.
  function abanico(Ad, extra = {}, cv = 6, bv = 5) {
    const Ap = [0, 0], Cp = [bv, 0], Bp = [cv * cos(Ad), cv * sen(Ad)], H = [Bp[0], 0];
    const seg = [{ de: Ap, a: Cp, color: 'i' }, { de: Ap, a: Bp, color: 'i' }, { de: Bp, a: Cp, grosor: 'contorno' },
      { de: Bp, a: H, discontinua: true }];
    if (H[0] < 0) seg.push({ de: H, a: Ap, discontinua: true, grosor: 'cuadricula' });
    return Object.assign({
      ejes: false, ventana: { x: [-6.6, 6.2], y: [-1, 6.6] },
      segmentos: seg,
      arcos: [angulo(Ap, Cp, Bp, 0.9, 'o', `${f(Ad)}°`)],
      // Agudo: c afuera y h a la derecha de la altura; obtuso: c adentro y h a la izquierda (afuera).
      rotulos: [{ x: bv / 2, y: -0.75, texto: `b = ${f(bv)}`, color: 'i' }, lado(Ap, Bp, Ad > 90 ? [-20, 20] : Cp, `c = ${f(cv)}`, 'i', 0.8),
        { x: H[0] + (Ad > 90 ? -0.2 : 0.2), y: Bp[1] / 2, texto: `h = ${f(Bp[1])}`, color: 'd', ancla: Ad > 90 ? 'end' : 'start' }],
      alt: `Triángulo de lados ${f(bv)} y ${f(cv)} con ángulo de ${f(Ad)} grados entre ellos; altura ${f(Bp[1])}`,
    }, extra);
  }
  const lal = {
    id: 'area-dos-lados',
    titulo: 'El área sigue al seno',
    temas: ['Área de un triángulo con dos lados y el ángulo'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Los lados b = 5 y c = 6 no cambian. Abre o cierra el ángulo A entre ellos y mira la altura punteada y el área.',
      voz: 'Sigue a la altura mientras el ángulo crece.',
      controles: [{ id: 'A', etiqueta: 'A', color: 'c-o', min: 25, max: 165, paso: 20, inicio: 45, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: abanico(val.A), estado: {} }),
      lectura: val => [S, ' = ½ · 5 · 6 · sen ', A, ` ≈ ${f(15 * sen(val.A))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Con los mismos lados 5 y 6, compara un triángulo con A = 30° y otro con A = 150°. ¿Cuál tiene más área?',
      voz: 'Piensa en la altura de cada uno, no en el ángulo.',
      opciones: [
        { id: 'c', texto: 'Tienen la misma área', correcta: true },
        { id: 'mayor', texto: 'El de 150°: su ángulo es mayor', error: 'AREA-ANGULO', siFuera: 'Bien que el área crece con el ángulo hasta 90°. Después, la altura vuelve a bajar.' },
        { id: 'aplastado', texto: 'El de 30°: el de 150° está aplastado', error: 'AREA-OBTUSO', siFuera: 'Se ve aplastado, pero su altura es la misma: 6 · sen 150° = 3.' },
        { id: 'cinco', texto: 'El de 150°, con cinco veces más área', error: 'TR10', siFuera: 'Sería cierto si el área fuera proporcional al ángulo. Va con sen A, y sen 150° = sen 30°.' },
      ],
      dibujo: { datos: abanico(30, { rotulos: [{ x: 2.5, y: -0.75, texto: 'b = 5', color: 'i' }] }), estado: {} },
      revelar: { datos: (() => {
        const u = abanico(30), v = abanico(150);
        return Object.assign(u, { segmentos: u.segmentos.concat(v.segmentos.slice(1)), arcos: u.arcos.concat(v.arcos.map(x => Object.assign({}, x, { r: 1.4 }))),
          rotulos: [u.rotulos[0], { x: 0, y: 3.4, texto: 'h = 3 en los dos', color: 'd' }], alt: 'Dos triángulos de lados 5 y 6, con 30 y 150 grados: los dos tienen altura 3' });
      })(), estado: {} },
      coincide: 'Coincide: sen 30° = sen 150°, y las dos alturas miden 3.',
      noCoincide: 'Revisemos las dos alturas: miden lo mismo.',
    },
    mira: {
      datos: (() => {
        const u = abanico(150);
        u.segmentos.forEach((s, k) => { if (k >= 3) s.desde = 2; });
        u.rotulos[2].desde = 2;
        u.rotulos.push({ x: -1.6, y: 4.9, texto: 'S = 7,5', color: 'h', desde: 3 });
        return u;
      })(),
      voz: 'Un solo cambio: la altura se escribe con el seno.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Dos lados y el ángulo que forman.', ecuacion: [b, ' = 5;  ', c, ' = 6;  ', A, ' = 150°'] },
        { estado: { corte: 2 }, texto: 'La altura desde B cae fuera, sobre la prolongación de b.', ecuacion: [h, ' = ', c, ' sen ', A, ' = 6 · 0,5 = 3'] },
        { estado: { corte: 3 }, texto: 'El área es base por altura entre dos.', ecuacion: [S, ' = ', { frac: [[b, ' · ', h], '2'] }, ' = ', { frac: ['5 · 3', '2'] }, ' = 7,5'] },
        { estado: { corte: 3 }, texto: 'Con h = c sen A queda la fórmula.', ecuacion: [S, ' = ', medio, b, c, ' sen ', A] },
      ],
    },
    regla: {
      texto: 'El área de un triángulo es la mitad del producto de dos lados por el seno del ángulo que forman. Es máxima con 90°; A y 180° − A dan igual.',
      ecuacion: [S, ' = ', medio, ' ', b, ' ', c, ' sen ', A],
      condicion: 'A es el ángulo comprendido entre b y c, con 0° < A < 180°.',
      voz: 'El seno guarda la altura; por eso manda el ángulo comprendido.',
    },
    ahoraTu: {
      voz: 'Ubica el ángulo que está entre los dos lados.',
      generar(sem) {
        const rr = azar(sem), bv = rr.ent(4, 12), cv = rr.ent(4, 12), Ad = rr.uno([30, 45, 60, 120, 135, 150]), Sv = bv * cv * sen(Ad) / 2;
        if (sem % 3 === 2) {
          const ag = Ad % 90 === 45 ? 30 : Math.min(Ad, 180 - Ad), Sx = bv * cv * sen(ag) / 2;
          return {
            pregunta: ['Dos lados de un triángulo miden ', b, ` = ${f(bv)} y `, c, ` = ${f(cv)}, y su área es `, S, ` = ${f(Sx)}. ¿Cuánto puede medir el ángulo `, A, ' entre ellos?'],
            opciones: [
              { id: 'c', texto: `${f(ag)}° o ${f(180 - ag)}°`, correcta: true },
              { id: 'agudo', texto: `Solo ${f(ag)}°`, error: 'AREA-UNA-RAMA', siFuera: `${f(ag)}° sirve, y ${f(180 - ag)}° tiene el mismo seno: da la misma área.` },
              { id: 'obtuso', texto: `Solo ${f(180 - ag)}°`, error: 'AREA-UNA-RAMA', siFuera: `${f(180 - ag)}° sirve, y su suplemento ${f(ag)}° también.` },
              { id: 'cos', texto: `${f(90 - ag)}° o ${f(90 + ag)}°`, error: 'AREA-COS', siFuera: 'Esos ángulos tienen el coseno que buscas como seno. El área usa el seno.' },
            ],
            solucion: { texto: 'sen A se despeja; dos ángulos tienen ese seno.', ecuacion: ['sen ', A, ' = ', { frac: [`2 · ${f(Sx)}`, `${f(bv)} · ${f(cv)}`] }, ` = ${f(sen(ag), 3)}`] },
          };
        }
        return {
          pregunta: ['Dos lados de un triángulo miden ', b, ` = ${f(bv)} cm y `, c, ` = ${f(cv)} cm, y el ángulo entre ellos es `, A, ` = ${f(Ad)}°. ¿Cuánto mide el área?`],
          opciones: opciones(Sv, [
            { id: 'sin-medio', valor: 2 * Sv, error: 'AREA-SIN-MEDIO', siFuera: 'Ese es el área del paralelogramo de esos lados. El triángulo es la mitad.' },
            { id: 'cos', valor: Math.abs(bv * cv * cos(Ad) / 2), error: 'AREA-COS', siFuera: 'Eso usa el coseno. La altura sale con el seno: h = c sen A.' },
            { id: 'recto', valor: bv * cv / 2, error: 'TR25', siFuera: 'Sería cierto si el ángulo midiera 90°. Aquí falta multiplicar por sen A.' },
          ], v => `${f(v)} cm²`),
          solucion: { texto: `sen ${f(Ad)}° = ${f(sen(Ad), 3)}.`, ecuacion: [S, ` = `, medio, ` · ${f(bv)} · ${f(cv)} · sen ${f(Ad)}° ≈ ${f(Sv)} cm²`] },
        };
      },
    },
  };

  // ---------- Idea 2: Herón y los semiángulos ----------
  // Cambia: los tres lados a, b y c. · Permanece: la base a sobre el eje. · Progresa: el semiperímetro p y los
  // factores p − a, p − b, p − c. · Se reserva: tres lados que no cierran (la predicción; el juego siempre cierra).
  // Debe verse: que Herón solo vale si cada lado es menor que la suma de los otros dos.
  function triangulo(av, bv, cv, extra = {}) {
    const T = porLados(av, bv, cv), G = [(T.A[0] + T.B[0] + T.C[0]) / 3, (T.A[1] + T.B[1] + T.C[1]) / 3], k = 0.06 * Math.max(av, bv, cv);
    return Object.assign({
      ejes: false, ventana: caja([T.A, T.B, T.C], 0.18),
      segmentos: [{ de: T.B, a: T.C, color: 'i' }, { de: T.C, a: T.A, color: 'i' }, { de: T.A, a: T.B, color: 'i' }],
      rotulos: [lado(T.B, T.C, T.A, `a = ${f(av)}`, 'i', 1.6 * k), lado(T.C, T.A, T.B, `b = ${f(bv)}`, 'i', k), lado(T.A, T.B, T.C, `c = ${f(cv)}`, 'i', k),
        vertice(T.A, G, 'A', 1.3 * k), vertice(T.B, G, 'B', 1.3 * k), vertice(T.C, G, 'C', 1.3 * k)],
      alt: `Triángulo de lados ${f(av)}, ${f(bv)} y ${f(cv)}`,
    }, extra, { T, G, k });
  }
  const limpio = d => { const x = Object.assign({}, d); delete x.T; delete x.G; delete x.k; return x; };
  // Tres lados que no cierran: la base y dos brazos que giran sin encontrarse.
  const noCierra = (cv, x, y) => ({
    ejes: false, ventana: { x: [-3.6, cv + 4.6], y: [-1.4, 4.8] },
    segmentos: [{ de: [0, 0], a: [cv, 0], color: 'i' }, { de: [0, 0], a: [x * cos(70), x * sen(70)], color: 'i' }, { de: [cv, 0], a: [cv - y * cos(60), y * sen(60)], color: 'i' }],
    arcos: [{ cx: 0, cy: 0, de: 0, a: 180, r: x, espiral: 0, flecha: false, grosor: 'cuadricula', color: 'i' }, { cx: cv, cy: 0, de: 0, a: 180, r: y, espiral: 0, flecha: false, grosor: 'cuadricula', color: 'i' }],
    rotulos: [{ x: cv / 2, y: -0.9, texto: `${f(cv)}`, color: 'i' }, { x: -0.3, y: x * sen(70) / 2, texto: `${f(x)}`, color: 'i', ancla: 'end' }, { x: cv - 0.4 * y * cos(60) + 0.4, y: y * sen(60) / 2, texto: `${f(y)}`, color: 'i', ancla: 'start' }],
    alt: `Base de ${f(cv)} con brazos de ${f(x)} y ${f(y)}: sus arcos no se encuentran`,
  });
  const heronIdea = {
    id: 'heron-semiangulos',
    titulo: 'Herón: solo con los lados',
    temas: ['Fórmula de Herón y semiángulos'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige los tres lados. La lectura calcula el semiperímetro p y el área con la fórmula de Herón, sin ningún ángulo.',
      voz: 'Mira qué pasa con p − a cuando a crece.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-i', min: 5, max: 9, paso: 1, inicio: 7, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 5, max: 9, paso: 1, inicio: 6, decimales: 0 },
        { id: 'c', etiqueta: 'c', color: 'c-i', min: 5, max: 9, paso: 1, inicio: 5, decimales: 0 },
      ],
      dibujo: val => ({ datos: limpio(triangulo(val.a, val.b, val.c)), estado: {} }),
      lectura: val => { const k = heron(val.a, val.b, val.c); return [p, ` = ${f(k.pv)};  `, S, ` = √(${f(k.pv)} · ${f(k.pv - val.a)} · ${f(k.pv - val.b)} · ${f(k.pv - val.c)}) ≈ ${f(Math.sqrt(k.rad))}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora los lados miden 3, 4 y 8. Con Herón, p = 7,5. ¿Cuál es el área de ese triángulo?',
      voz: 'Antes de multiplicar, revisa cada factor p − lado.',
      opciones: [
        { id: 'c', texto: 'No hay triángulo: 3 + 4 no llega a 8', correcta: true },
        { id: 'abs', texto: `≈ ${f(Math.sqrt(Math.abs(heron(3, 4, 8).rad)))}, quitando el signo menos`, error: 'HERON-IMPOSIBLE', siFuera: 'Bien que revisaste el factor negativo. Ese signo avisa que los lados no cierran.' },
        { id: 'catetos', texto: '6, con 3 y 4 como catetos', error: 'TR25', siFuera: 'Sería cierto con hipotenusa 5. Con 8, los lados ni siquiera se juntan.' },
        { id: 'base', texto: '12, con base 8 y altura 3', error: 'TR25', siFuera: 'Sería cierto si 3 fuera la altura sobre 8. Aquí 3 y 4 no alcanzan a cerrarse.' },
      ],
      dibujo: { datos: { ejes: false, ventana: { x: [-3.6, 12.6], y: [-1.4, 4.8] }, segmentos: [{ de: [0, 0], a: [8, 0], color: 'i' }], rotulos: [{ x: 4, y: -0.9, texto: '8', color: 'i' }, { x: 4, y: 2.5, texto: 'lados 3 y 4: ¿cierran?' }], alt: 'Base de 8 y dos lados de 3 y 4 por colocar' }, estado: {} },
      revelar: { datos: noCierra(8, 3, 4), estado: {} },
      coincide: 'Coincide: p − 8 = −0,5. El factor negativo dice que no cierra.',
      noCoincide: 'Revisemos: los dos arcos no se encuentran.',
    },
    mira: (() => {
      const u = triangulo(14, 15, 13), T = u.T, k = u.k;
      const bis = [T.B[0] + (T.C[0] - T.B[0]) * 13 / 28, 0];
      const d = limpio(u);
      d.segmentos.push({ de: T.A, a: bis, discontinua: true, desde: 2 });
      d.arcos = [angulo(T.A, T.B, T.C, 3, 'o', 'A', { hasta: 1 }), angulo(T.A, T.B, bis, 3, 'o', 'A/2', { desde: 2 }), angulo(T.A, bis, T.C, 3, 'o', 'A/2', { desde: 2 })];
      d.rotulos.push({ x: 7, y: -2.7 * k, texto: 'p = 21', color: 'd', desde: 3 }, { x: 3.6, y: 3, texto: 'S = 84', color: 'h', desde: 5 });
      d.alt = 'Triángulo 13, 14, 15 con el ángulo A partido en dos mitades por su bisectriz';
      return {
        datos: d,
        voz: 'La mitad del ángulo es el puente entre lados y área.',
        pasos: [
          { estado: { corte: 1 }, texto: 'Empieza con el área por dos lados y el ángulo.', ecuacion: [S, ' = ', medio, b, c, ' sen ', A] },
          { estado: { corte: 2 }, texto: 'El seno de A se parte en sus dos mitades.', ecuacion: ['sen ', A, ' = 2 sen ', { frac: [A, '2'] }, ' cos ', { frac: [A, '2'] }] },
          { estado: { corte: 3 }, texto: 'Desde la ley de cosenos, el coseno de la mitad.', ecuacion: ['cos ', { frac: [A, '2'] }, ' = ', { raiz: [{ frac: [[p, '(', p, ' − ', a, ')'], [b, c]] }] }] },
          { estado: { corte: 4 }, texto: 'Y el seno de la mitad.', ecuacion: ['sen ', { frac: [A, '2'] }, ' = ', { raiz: [{ frac: [['(', p, ' − ', b, ')(', p, ' − ', c, ')'], [b, c]] }] }] },
          { estado: { corte: 5 }, texto: 'Al multiplicar, bc se cancela: queda Herón.', ecuacion: [S, ' = √(21 · 7 · 6 · 8) = 84'] },
        ],
      };
    })(),
    regla: {
      texto: 'Con los tres lados basta: el área sale del semiperímetro y de sus diferencias con cada lado. Los semiángulos se escriben con los mismos factores.',
      ecuacion: [S, ' = ', { raiz: [p, '(', p, ' − ', a, ')(', p, ' − ', b, ')(', p, ' − ', c, ')'] }, ';   cos ', { frac: [A, '2'] }, ' = ', { raiz: [{ frac: [[p, '(', p, ' − ', a, ')'], [b, c]] }] }],
      condicion: 'cada lado es menor que la suma de los otros dos; p es la mitad del perímetro.',
      voz: 'Un factor negativo no se arregla: avisa que no hay triángulo.',
    },
    ahoraTu: {
      voz: 'Calcula p y revisa que los tres factores sean positivos.',
      generar(sem) {
        const rr = azar(sem), tipo = sem % 3;
        let av, bv, cv;
        do { av = rr.ent(3, 15); bv = rr.ent(3, 15); cv = rr.ent(3, 15); } while (!(av < bv + cv && bv < av + cv && cv < av + bv) || av === bv && bv === cv);
        const k = heron(av, bv, cv), Sv = Math.sqrt(k.rad);
        const lados = [`a = ${f(av)}`, `b = ${f(bv)}`, `c = ${f(cv)}`].join(', ');
        if (tipo === 1) {
          const cA = Math.sqrt(k.pv * (k.pv - av) / (bv * cv));
          return {
            pregunta: [`Un triángulo tiene lados ${lados}. ¿Cuánto vale cos(A/2)?`],
            opciones: opciones(cA, [
              { id: 'sen', valor: Math.sqrt((k.pv - bv) * (k.pv - cv) / (bv * cv)), error: 'SEMI-CRUZA', siFuera: 'Ese es sen(A/2): usa p − b y p − c. El coseno usa p y p − a.' },
              { id: 'entero', valor: (bv * bv + cv * cv - av * av) / (2 * bv * cv), error: 'SEMI-ENTERO', siFuera: 'Ese es cos A, el ángulo entero. Se pide la mitad.' },
              { id: 'otro', valor: Math.sqrt(k.pv * (k.pv - bv) / (av * cv)), error: 'SEMI-CRUZA', siFuera: 'Esa es la fórmula para B. Para A van p − a y los lados b y c.' },
            ], v => f(v, 3)),
            solucion: { texto: `p = ${f(k.pv)}; se usan p, p − a y los lados que forman A.`, ecuacion: ['cos ', { frac: [A, '2'] }, ` = √(${f(k.pv)} · ${f(k.pv - av)} / ${f(bv * cv)}) ≈ ${f(cA, 3)}`] },
          };
        }
        if (tipo === 2) {
          const x = rr.ent(2, 5), y = rr.ent(2, 5), z = x + y + rr.ent(1, 3), q = heron(x, y, z);
          return {
            pregunta: [`Un terreno triangular tendría lados de ${f(x)} m, ${f(y)} m y ${f(z)} m. ¿Cuál es su área?`],
            opciones: [
              { id: 'c', texto: `No existe: ${f(x)} + ${f(y)} no llega a ${f(z)}`, correcta: true },
              { id: 'abs', texto: `≈ ${f(Math.sqrt(Math.abs(q.rad)))} m², quitando el signo`, error: 'HERON-IMPOSIBLE', siFuera: 'Bien que llegaste al factor negativo. Ese signo dice que el terreno no cierra.' },
              { id: 'catetos', texto: `${f(x * y / 2)} m², como triángulo rectángulo`, error: 'TR25', siFuera: `Sería cierto si ${f(x)} y ${f(y)} fueran catetos de un triángulo que cierra.` },
            ],
            solucion: { texto: 'p − (lado mayor) sale negativo: los lados no cierran.', ecuacion: [p, ` = ${f(q.pv)};  `, p, ` − ${f(z)} = ${f(q.pv - z)} < 0`] },
          };
        }
        return {
          pregunta: [`Un triángulo tiene lados ${lados}. ¿Cuánto mide su área?`],
          opciones: opciones(Sv, [
            { id: 'perimetro', valor: Math.sqrt(2 * k.pv * (2 * k.pv - av) * (2 * k.pv - bv) * (2 * k.pv - cv)), error: 'HERON-PERIMETRO', siFuera: 'Eso usa el perímetro entero. Herón pide la mitad: p.' },
            { id: 'sin-raiz', valor: k.rad, error: 'HERON-SIN-RAIZ', siFuera: 'Ese es el producto dentro de la raíz. Falta sacar la raíz cuadrada.' },
            { id: 'recto', valor: Math.min(av * bv, bv * cv, av * cv) / 2, error: 'TR25', siFuera: 'Sería cierto si dos lados fueran catetos. Revisa si a² + b² = c².' },
          ], v => f(v)),
          solucion: { texto: `p = ${f(k.pv)}; se multiplica p por sus tres diferencias.`, ecuacion: [S, ` = √(${f(k.pv)} · ${f(k.pv - av)} · ${f(k.pv - bv)} · ${f(k.pv - cv)}) ≈ ${f(Sv)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: tres radios, una misma área ----------
  // Cambia: el triángulo (tres opciones) y el radio que se mira: inscrito, circunscrito o exinscrito.
  // Permanece: el área S del triángulo elegido. · Progresa: cada radio se amarra al área con otra pareja de datos.
  // Se reserva: el circunradio del triángulo rectángulo (la predicción). · Debe verse: r y R son círculos distintos.
  const TRIS = { t1: [14, 15, 13], t2: [6, 5, 5], t3: [5, 6, 4] };
  function radios(lados, cual, extra = {}) {
    const [av, bv, cv] = lados, T = porLados(av, bv, cv), k = heron(av, bv, cv), Sv = Math.sqrt(k.rad), pv = k.pv;
    const P3 = [T.A, T.B, T.C], G = [(T.A[0] + T.B[0] + T.C[0]) / 3, (T.A[1] + T.B[1] + T.C[1]) / 3];
    const pts = P3.slice(), seg = [{ de: T.B, a: T.C, color: 'i' }, { de: T.C, a: T.A, color: 'i' }, { de: T.A, a: T.B, color: 'i' }];
    const circ = [], rot = [];
    let rv, centro, toque;
    if (cual === 'r') {
      rv = Sv / pv; centro = [(av * T.A[0] + bv * T.B[0] + cv * T.C[0]) / (2 * pv), rv]; toque = [pv - bv, 0];
    } else if (cual === 'ra') {
      rv = Sv / (pv - av); centro = [(-av * T.A[0] + bv * T.B[0] + cv * T.C[0]) / (2 * (pv - av)), -rv]; toque = [pv - cv, 0];
    } else {
      rv = av * bv * cv / (4 * Sv); centro = [av / 2, (T.A[0] * T.A[0] - av * T.A[0] + T.A[1] * T.A[1]) / (2 * T.A[1])]; toque = T.B;
    }
    circ.push({ cx: centro[0], cy: centro[1], r: rv, color: 'd' });
    pts.push([centro[0] - rv, centro[1] - rv], [centro[0] + rv, centro[1] + rv]);
    seg.push({ de: centro, a: toque, color: 'd' });
    const nom = cual === 'r' ? 'r' : cual === 'ra' ? 'rₐ' : 'R';
    const sz = Math.max(...pts.map(q => q[0])) - Math.min(...pts.map(q => q[0]));
    rot.push({ x: (centro[0] + toque[0]) / 2 + 0.03 * sz, y: (centro[1] + toque[1]) / 2, texto: `${nom} = ${f(rv)}`, color: 'd', ancla: 'start' });
    for (const [V, nm] of [[T.A, 'A'], [T.B, 'B'], [T.C, 'C']]) rot.push(vertice(V, G, nm, 0.045 * sz));
    return Object.assign({
      ejes: false, ventana: caja(pts, 0.08), circulos: circ, segmentos: seg, rotulos: rot,
      alt: `Triángulo de lados ${f(av)}, ${f(bv)} y ${f(cv)} con su ${cual === 'r' ? 'circunferencia inscrita' : cual === 'ra' ? 'circunferencia exinscrita al lado a' : 'circunferencia circunscrita'} de radio ${f(rv)}`,
    }, extra, { Sv, pv, rv });
  }
  const limpioR = d => { const x = Object.assign({}, d); delete x.Sv; delete x.pv; delete x.rv; return x; };
  const tresRadios = {
    id: 'area-y-radios',
    titulo: 'Tres radios, una misma área',
    temas: ['Área con inradio, circunradio y exradio'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige un triángulo y un radio: la circunferencia de adentro, la que pasa por los vértices o la que toca el lado a por fuera.',
      voz: 'Compara qué toca cada circunferencia: lados o vértices.',
      controles: [
        { id: 'tri', etiqueta: 'Triángulo', opciones: [{ valor: 't1', texto: '13-14-15' }, { valor: 't2', texto: '5-5-6' }, { valor: 't3', texto: '4-5-6' }] },
        { id: 'rad', etiqueta: 'Radio', opciones: [{ valor: 'r', texto: 'Inscrito r' }, { valor: 'R', texto: 'Circunscrito R' }, { valor: 'ra', texto: 'Exinscrito rₐ' }] },
      ],
      dibujo: val => ({ datos: limpioR(radios(TRIS[val.tri], val.rad)), estado: {} }),
      lectura: val => {
        const [av, bv, cv] = TRIS[val.tri], k = radios(TRIS[val.tri], val.rad);
        if (val.rad === 'r') return [S, ' = ', p, ' · ', r, ` = ${f(k.pv)} · ${f(k.rv)} ≈ ${f(k.Sv)}`];
        if (val.rad === 'ra') return [S, ' = ', ra, '(', p, ' − ', a, `) = ${f(k.rv)} · ${f(k.pv - av)} ≈ ${f(k.Sv)}`];
        return [S, ' = ', { frac: [`${f(av * bv * cv)}`, ['4 · ', f(k.rv)]] }, ` ≈ ${f(k.Sv)}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Un triángulo rectángulo tiene lados 6, 8 y 10, y su inradio mide 2. ¿Cuánto mide el radio R de la circunferencia que pasa por sus tres vértices?',
      voz: 'Piensa qué segmento del triángulo puede ser un diámetro.',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'inradio', texto: '2', error: 'RADIO-CONFUNDE', siFuera: 'Ese es r, la circunferencia de adentro. R pasa por los vértices y es mayor.' },
        { id: 'diametro', texto: '10', error: 'RADIO-CONFUNDE', siFuera: 'Bien que la hipotenusa es especial: es el diámetro. El radio es su mitad.' },
        { id: 'altura', texto: '4,8', error: 'RADIO-ALTURA', siFuera: 'Esa es la altura sobre la hipotenusa. R se mide del centro a un vértice.' },
      ],
      dibujo: { datos: limpioR(radios([10, 8, 6], 'r')), estado: {} },
      revelar: { datos: limpioR(radios([10, 8, 6], 'R')), estado: {} },
      coincide: 'Coincide: con 90°, la hipotenusa es diámetro; R = 10/2 = 5.',
      noCoincide: 'Revisemos: la circunferencia de R pasa por los tres vértices.',
    },
    mira: (() => {
      const u = radios([14, 15, 13], 'r'), T = porLados(14, 15, 13), I = [6, 4], toques = [[6, 0]];
      // Los otros dos toques del incírculo: proyecciones de I sobre CA y AB.
      const proy = (P1, P2) => { const dx = P2[0] - P1[0], dy = P2[1] - P1[1], s = ((I[0] - P1[0]) * dx + (I[1] - P1[1]) * dy) / (dx * dx + dy * dy); return [P1[0] + s * dx, P1[1] + s * dy]; };
      toques.push(proy(T.C, T.A), proy(T.A, T.B));
      const d = limpioR(u);
      d.segmentos = d.segmentos.slice(0, 3).concat(
        toques.map(q => ({ de: I, a: q, color: 'd', desde: 2 })),
        [T.A, T.B, T.C].map(V => ({ de: I, a: V, discontinua: true, desde: 3 })));
      d.rotulos = d.rotulos.filter(x => !/r =/.test(x.texto)).concat([{ x: 6.3, y: 1.6, texto: 'r = 4', color: 'd', ancla: 'start', desde: 2 },
        { x: 7, y: -1.2, texto: 'a = 14', color: 'i' }, { x: 11.6, y: 6.3, texto: 'b = 15', color: 'i', ancla: 'start' }, { x: 1.9, y: 6.3, texto: 'c = 13', color: 'i', ancla: 'end' }]);
      d.circulos[0].desde = 1;
      d.alt = 'Triángulo 13, 14, 15 partido en tres triángulos desde el centro de la circunferencia inscrita; cada uno tiene altura r = 4';
      return {
        datos: d,
        voz: 'Tres triángulos con la misma altura r.',
        pasos: [
          { estado: { corte: 1 }, texto: 'La circunferencia inscrita toca los tres lados.', ecuacion: [p, ' = ', { frac: ['13 + 14 + 15', '2'] }, ' = 21'] },
          { estado: { corte: 2 }, texto: 'Cada radio al punto de contacto es perpendicular al lado.', ecuacion: [r, ' = 4'] },
          { estado: { corte: 3 }, texto: 'Desde el centro salen tres triángulos de altura r.', ecuacion: [S, ' = ', medio, a, r, ' + ', medio, b, r, ' + ', medio, c, r] },
          { estado: { corte: 3 }, texto: 'Se junta r: queda el semiperímetro.', ecuacion: [S, ' = ', p, ' · ', r, ' = 21 · 4 = 84'] },
          { estado: { corte: 3 }, texto: 'Con c = 2R sen C, el área también usa R.', ecuacion: [S, ' = ', { frac: [[a, b, c], ['4', R]] }, ' = ', { frac: ['2730', '4 · 8,125'] }, ' = 84'] },
        ],
      };
    })(),
    regla: {
      texto: 'El área se escribe con cualquiera de los tres radios: el inscrito con el semiperímetro, el circunscrito con los tres lados y el exinscrito con p − a.',
      ecuacion: [S, ' = ', p, r, ' = ', { frac: [[a, b, c], ['4', R]] }, ' = ', ra, '(', p, ' − ', a, ')'],
      condicion: 'r toca los tres lados por dentro; R pasa por los tres vértices; rₐ toca el lado a por fuera.',
      voz: 'Antes de sustituir, nombra el círculo: adentro, por los vértices o afuera.',
    },
    ahoraTu: {
      voz: 'Decide primero qué radio te piden.',
      generar(sem) {
        const rr = azar(sem), lista = [[13, 14, 15], [5, 5, 6], [5, 5, 8], [6, 8, 10], [9, 10, 17], [10, 13, 13], [8, 15, 17], [13, 20, 21], [7, 15, 20]];
        const [av, bv, cv] = rr.uno(lista), k = heron(av, bv, cv), Sv = Math.round(Math.sqrt(k.rad)), tipo = sem % 3;
        const datos = [`Un triángulo de lados a = ${f(av)}, b = ${f(bv)} y c = ${f(cv)} tiene área `, S, ` = ${f(Sv)}. `];
        const rv = Sv / k.pv, Rv = av * bv * cv / (4 * Sv), rav = Sv / (k.pv - av);
        if (tipo === 0) return {
          pregunta: [...datos, '¿Cuánto mide su inradio ', r, '?'],
          opciones: opciones(rv, [
            { id: 'R', valor: Rv, error: 'RADIO-CONFUNDE', siFuera: 'Ese es R, el de la circunferencia que pasa por los vértices.' },
            { id: 'perimetro', valor: Sv / (2 * k.pv), error: 'RADIO-PERIMETRO', siFuera: 'Eso divide entre el perímetro entero. S = p r usa el semiperímetro.' },
            { id: 'doble', valor: 2 * Sv / k.pv, error: 'RADIO-ALTURA', siFuera: 'Eso trata a r como altura de un solo triángulo. Son tres triángulos: S = p r.' },
          ], v => f(v)),
          solucion: { texto: `p = ${f(k.pv)}; el área se reparte en p r.`, ecuacion: [r, ' = ', { frac: [S, p] }, ` = ${f(Sv)}/${f(k.pv)} = ${f(rv)}`] },
        };
        if (tipo === 1) return {
          pregunta: [...datos, '¿Cuánto mide su circunradio ', R, '?'],
          opciones: opciones(Rv, [
            { id: 'r', valor: rv, error: 'RADIO-CONFUNDE', siFuera: 'Ese es r, el de adentro. R pasa por los vértices.' },
            { id: 'sin4', valor: av * bv * cv / Sv, error: 'RADIO-PERIMETRO', siFuera: 'Falta el 4: S = abc/(4R).' },
            { id: 'diam', valor: av * bv * cv / (2 * Sv), error: 'RADIO-CONFUNDE', siFuera: 'Ese número es el diámetro 2R. El radio es su mitad.' },
          ], v => f(v)),
          solucion: { texto: 'Se despeja R de S = abc/(4R).', ecuacion: [R, ' = ', { frac: [[a, b, c], ['4', S]] }, ` = ${f(av * bv * cv)}/${f(4 * Sv)} = ${f(Rv)}`] },
        };
        return {
          pregunta: [...datos, '¿Cuánto mide el exradio ', ra, ' relativo al lado a?'],
          opciones: opciones(rav, [
            { id: 'lado', valor: Sv / (k.pv - bv), error: 'EXRADIO-LADO', siFuera: 'Ese es el exradio del lado b. Para el lado a va p − a.' },
            { id: 'r', valor: rv, error: 'RADIO-CONFUNDE', siFuera: 'Ese es el inradio, que divide entre p. El exradio divide entre p − a.' },
            { id: 'prod', valor: Sv * (k.pv - av), error: 'EXRADIO-LADO', siFuera: 'Eso multiplica. De S = rₐ(p − a) se divide entre p − a.' },
          ], v => f(v)),
          solucion: { texto: `p − a = ${f(k.pv - av)}.`, ecuacion: [ra, ' = ', { frac: [S, [p, ' − ', a]] }, ` = ${f(Sv)}/${f(k.pv - av)} = ${f(rav)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: cevianas, medianas y bisectrices ----------
  // Cambia: el punto D sobre la base a. · Permanece: el triángulo de lados a = 8, b = 7, c = 5.
  // Progresa: los trozos m = BD y n = DC y el largo t = AD. · Se reserva: dónde cae la bisectriz (la predicción:
  // el juego avanza de 1 en 1 y no la alcanza). · Debe verse: la bisectriz no es la mediana; parte a en razón c : b.
  const TC = porLados(8, 7, 5);
  function ceviana(mv, extra = {}) {
    const D = [mv, 0], tv = Math.hypot(TC.A[0] - mv, TC.A[1]);
    return Object.assign({
      ejes: false, ventana: { x: [-1.4, 9.4], y: [-1.9, 5.3] },
      segmentos: [{ de: TC.B, a: TC.C, color: 'i' }, { de: TC.C, a: TC.A, color: 'i' }, { de: TC.A, a: TC.B, color: 'i' }, { de: TC.A, a: D, color: 'd' }],
      puntos: [{ x: mv, y: 0, color: 'd', rotulo: 'D', lado: 's' }],
      rotulos: [{ x: TC.A[0], y: TC.A[1] + 0.35, texto: 'A' }, { x: -0.35, y: -0.3, texto: 'B', ancla: 'end' }, { x: 8.35, y: -0.3, texto: 'C', ancla: 'start' },
        lado(TC.A, TC.B, TC.C, 'c = 5', 'i', 0.4), lado(TC.C, TC.A, TC.B, 'b = 7', 'i', 0.4),
        { x: mv / 2, y: -1.5, texto: `m = ${f(mv)}`, color: 'd' }, { x: (mv + 8) / 2, y: -1.5, texto: `n = ${f(8 - mv)}`, color: 'd' }],
      alt: `Triángulo de lados 8, 7 y 5 con una ceviana AD que parte la base en ${f(mv)} y ${f(8 - mv)}; AD mide ${f(tv)}`,
    }, extra);
  }
  const bisM = 8 * 5 / 12;
  const cevianas = {
    id: 'cevianas',
    titulo: 'El largo de una ceviana',
    temas: ['Longitud de cevianas, bisectrices y medianas'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Mueve el punto D sobre la base a = 8. AD es una ceviana; la lectura da los trozos m y n y su largo t.',
      voz: 'Observa cómo cambia t cuando D se acerca al pie de la altura.',
      controles: [{ id: 'm', etiqueta: 'm = BD', color: 'c-d', min: 1, max: 7, paso: 1, inicio: 2, decimales: 0 }],
      dibujo: val => ({ datos: ceviana(val.m), estado: {} }),
      lectura: val => [m, ` = ${f(val.m)};  `, n, ` = ${f(8 - val.m)};  `, t, ` = AD ≈ ${f(Math.hypot(TC.A[0] - val.m, TC.A[1]))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'La bisectriz desde A parte el ángulo A en dos mitades iguales. ¿Dónde corta la base BC?',
      voz: 'Piensa en los dos lados que forman el ángulo A.',
      opciones: [
        { id: 'c', texto: 'En la razón de los lados: m : n = 5 : 7', correcta: true },
        { id: 'mitad', texto: 'Justo en la mitad: m = n = 4', error: 'BIS-MEDIANA', siFuera: 'Ese es el pie de la mediana. Coinciden solo si b = c.' },
        { id: 'angulos', texto: 'En la razón de los ángulos B : C', error: 'BIS-ANGULOS', siFuera: 'Bien que la razón depende del triángulo. Va con los lados c y b, no con ángulos.' },
        { id: 'cruza', texto: 'En la razón m : n = 7 : 5', error: 'BIS-CRUZA', siFuera: 'Bien la razón de los lados. Pero m queda junto a c = 5: trozo menor con lado menor.' },
      ],
      dibujo: { datos: ceviana(4, { segmentos: [{ de: TC.B, a: TC.C, color: 'i' }, { de: TC.C, a: TC.A, color: 'i' }, { de: TC.A, a: TC.B, color: 'i' }], puntos: [], rotulos: ceviana(4).rotulos.slice(0, 5) }), estado: {} },
      revelar: { datos: ceviana(bisM, {
        segmentos: ceviana(bisM).segmentos.concat([{ de: TC.A, a: [4, 0], discontinua: true }]),
        rotulos: ceviana(bisM).rotulos.slice(0, 5).concat([{ x: bisM / 2, y: -1.5, texto: `m ≈ ${f(bisM)}`, color: 'd' }, { x: (bisM + 8) / 2 + 0.4, y: -1.5, texto: `n ≈ ${f(8 - bisM)}`, color: 'd' }, { x: 4.25, y: 0.5, texto: 'mediana', ancla: 'start' }]),
      }), estado: {} },
      coincide: `Coincide: m = 8 · 5/12 ≈ ${f(bisM)}, junto al lado menor.`,
      noCoincide: 'Revisemos con la bisectriz y la mediana dibujadas.',
    },
    mira: (() => {
      const base = ceviana(bisM);
      const d = Object.assign(base, {
        segmentos: base.segmentos.slice(0, 3).concat([{ de: TC.A, a: [3, 0], color: 'd', desde: 1, hasta: 2 }, { de: TC.A, a: [4, 0], color: 'd', desde: 3, hasta: 3 }, { de: TC.A, a: [bisM, 0], color: 'd', desde: 4 }]),
        puntos: [],
        rotulos: base.rotulos.slice(0, 5).concat([{ x: 3, y: -1.2, texto: 'D: m = 3, n = 5', color: 'd', desde: 1, hasta: 2 }, { x: 4, y: -1.2, texto: 'mediana: m = n = 4', color: 'd', desde: 3, hasta: 3 }, { x: 4, y: -1.2, texto: `bisectriz: m ≈ ${f(bisM)}`, color: 'd', desde: 4 }]),
        alt: 'Triángulo de lados 8, 7 y 5: una ceviana cualquiera, la mediana y la bisectriz desde A',
      });
      const med2 = (2 * 49 + 2 * 25 - 64) / 4, mm = bisM, nn = 8 - bisM;
      return {
        datos: d,
        voz: 'Una sola fórmula; la mediana y la bisectriz son casos.',
        pasos: [
          { estado: { corte: 1 }, texto: 'Una ceviana AD parte la base en m y n.', ecuacion: [m, ' + ', n, ' = ', a, ' = 8'] },
          { estado: { corte: 2 }, texto: 'Stewart amarra t con los lados y los trozos.', ecuacion: [{ sup: [b, '2'] }, m, ' + ', { sup: [c, '2'] }, n, ' = ', a, '(', { sup: [t, '2'] }, ' + ', m, n, ')'] },
          { estado: { corte: 3 }, texto: 'En la mediana, m = n = a/2.', ecuacion: [{ sup: [t, '2'] }, ' = ', { frac: [['2', { sup: [b, '2'] }, ' + 2', { sup: [c, '2'] }, ' − ', { sup: [a, '2'] }], '4'] }, ` = ${f(med2)}`] },
          { estado: { corte: 4 }, texto: 'En la bisectriz, los trozos van como los lados.', ecuacion: [{ frac: [m, n] }, ' = ', { frac: [c, b] }, ` = ${'5/7'}`] },
          { estado: { corte: 4 }, texto: 'Stewart, con esos trozos, da la bisectriz.', ecuacion: [{ sup: [t, '2'] }, ' = ', b, c, ' − ', m, n, ` ≈ 35 − ${f(mm * nn)} ≈ ${f(35 - mm * nn)}`] },
        ],
      };
    })(),
    regla: {
      texto: 'Una ceviana AD parte el lado a en m y n; Stewart da su largo. La mediana parte a por la mitad y la bisectriz, en la razón c : b.',
      ecuacion: [{ sup: [b, '2'] }, m, ' + ', { sup: [c, '2'] }, n, ' = ', a, '(', { sup: [t, '2'] }, ' + ', m, n, ');   bisectriz: ', { frac: [m, n] }, ' = ', { frac: [c, b] }],
      condicion: 'm = BD queda junto al lado c y n = DC junto al lado b; m + n = a.',
      voz: 'Cada trozo mira al lado que tiene al costado.',
    },
    ahoraTu: {
      voz: 'Marca qué trozo queda junto a qué lado.',
      generar(sem) {
        const rr = azar(sem);
        let av, bv, cv;
        do { av = rr.ent(4, 14); bv = rr.ent(4, 14); cv = rr.ent(4, 14); } while (!(av < bv + cv && bv < av + cv && cv < av + bv) || bv === cv);
        const tipo = sem % 3, lados = ['En un triángulo, ', a, ` = ${f(av)}, `, b, ` = ${f(bv)} y `, c, ` = ${f(cv)}. `];
        if (tipo === 0) {
          const mv2 = (2 * bv * bv + 2 * cv * cv - av * av) / 4;
          return {
            pregunta: [...lados, '¿Cuánto mide la mediana relativa al lado a?'],
            opciones: opciones(Math.sqrt(mv2), [
              { id: 'cuarto', valor: Math.sqrt(2 * bv * bv + 2 * cv * cv - av * av), error: 'MED-SIN-CUARTO', siFuera: 'Ese es el doble de la mediana: falta dividir entre 4 dentro de la raíz.' },
              { id: 'lados', valor: Math.sqrt((2 * av * av + 2 * bv * bv - cv * cv) / 4), error: 'STEW-LADOS', siFuera: 'Esa es la mediana del lado c. Para a, el que se resta es a².' },
              { id: 'mitad', valor: (bv + cv) / 2, error: 'BIS-MEDIANA', siFuera: 'El promedio de b y c solo coincide si el triángulo se aplana.' },
            ], v => f(v)),
            solucion: { texto: 'Stewart con m = n = a/2.', ecuacion: [{ sup: [t, '2'] }, ` = (2 · ${bv * bv} + 2 · ${cv * cv} − ${av * av})/4 = ${f(mv2)}`] },
          };
        }
        const mv = av * cv / (bv + cv), nv = av * bv / (bv + cv);
        if (tipo === 1) return {
          pregunta: [...lados, 'La bisectriz desde A corta BC en D. ¿Cuánto mide ', m, ' = BD?'],
          opciones: opciones(mv, [
            { id: 'cruza', valor: nv, error: 'BIS-CRUZA', siFuera: 'Ese es DC. BD queda junto al lado c.' },
            { id: 'mitad', valor: av / 2, error: 'BIS-MEDIANA', siFuera: 'Ese es el pie de la mediana. La bisectriz reparte según los lados.' },
            { id: 'lados', valor: av * cv / bv, error: 'BIS-ANGULOS', siFuera: 'La razón es c : b entre m y n, no entre m y a.' },
          ], v => f(v)),
          solucion: { texto: 'a se reparte en la razón c : b.', ecuacion: [m, ' = ', { frac: [[a, c], [b, ' + ', c]] }, ` = ${f(av * cv)}/${f(bv + cv)} ≈ ${f(mv)}`] },
        };
        const w2 = bv * cv - mv * nv;
        return {
          pregunta: [...lados, '¿Cuánto mide la bisectriz trazada desde A hasta el lado a?'],
          opciones: opciones(Math.sqrt(w2), [
            { id: 'mediana', valor: Math.sqrt((2 * bv * bv + 2 * cv * cv - av * av) / 4), error: 'BIS-MEDIANA', siFuera: 'Esa es la mediana. Coinciden solo si b = c.' },
            { id: 'sin-raiz', valor: w2, error: 'MED-SIN-CUARTO', siFuera: 'Ese es t², el cuadrado de la bisectriz. Falta la raíz.' },
            { id: 'prod', valor: Math.sqrt(bv * cv), error: 'STEW-LADOS', siFuera: 'Falta restar m n: t² = bc − mn.' },
          ], v => f(v)),
          solucion: { texto: `m ≈ ${f(mv)} y n ≈ ${f(nv)}; después, t² = bc − mn.`, ecuacion: [{ sup: [t, '2'] }, ` = ${f(bv * cv)} − ${f(mv * nv)} ≈ ${f(w2)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: el área del cuadrilátero con sus diagonales ----------
  // Cambia: el ángulo θ entre las diagonales d₁ = 8 y d₂ = 6. · Permanece: los largos de las diagonales y su punto
  // de cruce. · Progresa: el área ½ d₁ d₂ sen θ. · Se reserva: mover el punto de cruce (la predicción).
  // Debe verse: que el área no depende de dónde se cruzan las diagonales.
  function cuadri(tg, fx = 0.4, fy = 0.5, extra = {}) {
    const P1 = [-8 * fx, 0], P3 = [8 * (1 - fx), 0], u = [cos(tg), sen(tg)], P2 = [6 * (1 - fy) * u[0], 6 * (1 - fy) * u[1]], P4 = [-6 * fy * u[0], -6 * fy * u[1]];
    return Object.assign({
      ejes: false, ventana: { x: [-4.2, 6.2], y: [-3.8, 3.8] },
      segmentos: [{ de: P1, a: P2, grosor: 'contorno' }, { de: P2, a: P3, grosor: 'contorno' }, { de: P3, a: P4, grosor: 'contorno' }, { de: P4, a: P1, grosor: 'contorno' },
        { de: P1, a: P3, color: 'i' }, { de: P4, a: P2, color: 'i' }],
      arcos: [{ de: 0, a: tg, r: 0.9, color: 'o', espiral: 0, flecha: false, rotulo: `${f(tg)}°` }],
      rotulos: [{ x: P3[0] - 0.5, y: 0.35, texto: 'd₁ = 8', color: 'i', ancla: 'end' }, lado([0, 0], P4, P1, 'd₂ = 6', 'i', 0.6)],
      alt: `Cuadrilátero con diagonales de 8 y 6 que se cruzan formando ${f(tg)} grados`,
    }, extra);
  }
  const cuadrilatero = {
    id: 'area-cuadrilatero',
    titulo: 'Un cuadrilátero, dos diagonales',
    temas: ['Área de un cuadrilátero'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Las diagonales miden 8 y 6. Cambia el ángulo θ con que se cruzan y mira cómo cambia el área del cuadrilátero.',
      voz: 'Compara el área con la del triángulo de dos lados y un ángulo.',
      controles: [{ id: 't', etiqueta: 'θ', color: 'c-o', min: 30, max: 150, paso: 20, inicio: 50, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: cuadri(val.t), estado: {} }),
      lectura: val => [S, ' = ½ · 8 · 6 · sen ', th, ` ≈ ${f(24 * sen(val.t))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Con el mismo θ = 70°, las diagonales se cruzan ahora muy cerca de un extremo. ¿Qué pasa con el área del cuadrilátero?',
      voz: 'Parte el cuadrilátero en triángulos alrededor del cruce.',
      opciones: [
        { id: 'c', texto: 'No cambia: sigue siendo ½ · 8 · 6 · sen 70°', correcta: true },
        { id: 'menor', texto: 'Disminuye: el cruce ya no está al medio', error: 'CUAD-CRUCE', siFuera: 'Bien que la forma cambia. Pero los trozos de cada diagonal siguen sumando 8 y 6.' },
        { id: 'faltan', texto: 'No se sabe sin los cuatro lados', error: 'CUAD-FALTAN', siFuera: 'Con los lados también se puede, partiéndolo en triángulos. Pero diagonales y θ ya bastan.' },
        { id: 'rombo', texto: 'Vale 24, como un rombo', error: 'CUAD-ROMBO', siFuera: 'Sería cierto si θ fuera 90°. Con 70° falta el seno.' },
      ],
      dibujo: { datos: cuadri(70, 0.12, 0.85, { ventana: { x: [-4.2, 7.8], y: [-5.4, 5.4] }, arcos: [{ de: 0, a: 70, r: 0.9, color: 'o', espiral: 0, flecha: false, rotulo: '70°' }] }), estado: {} },
      revelar: { datos: (() => {
        const u = cuadri(70, 0.12, 0.85, { ventana: { x: [-4.2, 7.8], y: [-5.4, 5.4] } }), v = cuadri(70, 0.4, 0.5);
        return Object.assign(u, { segmentos: u.segmentos.concat(v.segmentos.slice(0, 4).map(s => Object.assign({}, s, { discontinua: true, grosor: 'cuadricula' }))),
          rotulos: u.rotulos.concat([{ x: 3.4, y: 4.6, texto: `S ≈ ${f(24 * sen(70))} en los dos`, color: 'h' }]), alt: 'Dos cuadriláteros con las mismas diagonales y el mismo ángulo, cruzadas en distinto punto: la misma área' });
      })(), estado: {} },
      coincide: `Coincide: los dos miden ${f(24 * sen(70))}; el cruce no importa.`,
      noCoincide: 'Revisemos con los cuatro triángulos del cruce.',
    },
    mira: (() => {
      const u = cuadri(70, 0.4, 0.5);
      u.segmentos.forEach((s, k) => { if (k < 4) s.desde = 2; });
      u.arcos.push({ de: 70, a: 180, r: 0.6, color: 'o', espiral: 0, flecha: false, rotulo: '110°', desde: 3 });
      u.rotulos.push({ x: 3.6, y: -3.1, texto: `S ≈ ${f(24 * sen(70))}`, color: 'h', desde: 4 });
      return {
        datos: u,
        voz: 'Cuatro triángulos alrededor del cruce, todos con el mismo seno.',
        pasos: [
          { estado: { corte: 1 }, texto: 'Las diagonales se cruzan y forman el ángulo θ.', ecuacion: [d1, ' = 8;  ', d2, ' = 6;  ', th, ' = 70°'] },
          { estado: { corte: 2 }, texto: 'El cruce parte el cuadrilátero en cuatro triángulos.', ecuacion: [S, ' = ', { sub: [S, '1'] }, ' + ', { sub: [S, '2'] }, ' + ', { sub: [S, '3'] }, ' + ', { sub: [S, '4'] }] },
          { estado: { corte: 3 }, texto: 'Sus ángulos en el cruce son θ o 180° − θ: mismo seno.', ecuacion: ['sen 110° = sen 70°'] },
          { estado: { corte: 4 }, texto: 'Al sumar, los trozos de cada diagonal se juntan.', ecuacion: [S, ' = ', medio, d1, d2, ' sen ', th, ` ≈ ${f(24 * sen(70))}`] },
        ],
      };
    })(),
    regla: {
      texto: 'El área de un cuadrilátero convexo es la mitad del producto de sus diagonales por el seno del ángulo entre ellas, se crucen donde se crucen.',
      ecuacion: [S, ' = ', medio, ' ', d1, ' ', d2, ' sen ', th],
      condicion: 'cuadrilátero convexo; θ es cualquiera de los ángulos entre las diagonales. Una fórmula de inscrito exige probar que lo es.',
      voz: 'Otra vez dos largos y el seno del ángulo entre ellos.',
    },
    ahoraTu: {
      voz: 'Busca dos largos y el ángulo que forman.',
      generar(sem) {
        const rr = azar(sem), tg = rr.uno([30, 45, 60, 120, 135, 150]);
        if (sem % 2) {
          // Cuadrilátero ABCD partido por la diagonal AC en dos triángulos con dos lados y el ángulo.
          const x1 = rr.ent(3, 9), y1 = rr.ent(3, 9), x2 = rr.ent(3, 9), y2 = rr.ent(3, 9), g1 = rr.uno([30, 60, 90, 120, 150]), g2 = rr.uno([30, 60, 90, 120, 150]);
          const Sv = x1 * y1 * sen(g1) / 2 + x2 * y2 * sen(g2) / 2;
          return {
            pregunta: [`En el cuadrilátero ABCD, AB = ${f(x1)}, BC = ${f(y1)} y el ángulo B mide ${f(g1)}°; CD = ${f(x2)}, DA = ${f(y2)} y el ángulo D mide ${f(g2)}°. ¿Cuánto mide su área?`],
            opciones: opciones(Sv, [
              { id: 'sin-medio', valor: 2 * Sv, error: 'AREA-SIN-MEDIO', siFuera: 'Bien la partición en dos triángulos. A cada uno le falta el ½.' },
              { id: 'uno', valor: x1 * y1 * sen(g1) / 2, error: 'CUAD-FALTAN', siFuera: 'Ese es solo el triángulo ABC. Falta sumar el triángulo ACD.' },
              { id: 'cos', valor: Math.abs(x1 * y1 * cos(g1) + x2 * y2 * cos(g2)) / 2, error: 'AREA-COS', siFuera: 'Eso usa el coseno. Cada altura sale con el seno.' },
            ], v => f(v)),
            solucion: { texto: 'La diagonal AC parte el cuadrilátero en dos triángulos.', ecuacion: [S, ` = ½ · ${f(x1)} · ${f(y1)} · sen ${f(g1)}° + ½ · ${f(x2)} · ${f(y2)} · sen ${f(g2)}° ≈ ${f(Sv)}`] },
          };
        }
        const p1 = rr.ent(4, 14), q1 = rr.ent(4, 14), Sv = p1 * q1 * sen(tg) / 2;
        return {
          pregunta: ['Las diagonales de un cuadrilátero convexo miden ', d1, ` = ${f(p1)} y `, d2, ` = ${f(q1)}, y se cortan formando `, th, ` = ${f(tg)}°. ¿Cuánto mide su área?`],
          opciones: opciones(Sv, [
            { id: 'rombo', valor: p1 * q1 / 2, error: 'CUAD-ROMBO', siFuera: 'Sería cierto si las diagonales fueran perpendiculares. Falta sen θ.' },
            { id: 'sin-medio', valor: 2 * Sv, error: 'AREA-SIN-MEDIO', siFuera: 'Falta el ½: son cuatro triángulos con la mitad de cada producto.' },
            { id: 'cos', valor: Math.abs(p1 * q1 * cos(tg) / 2), error: 'AREA-COS', siFuera: 'Eso usa el coseno. Las alturas salen con el seno.' },
          ], v => f(v)),
          solucion: { texto: `sen ${f(tg)}° ≈ ${f(sen(tg), 3)}.`, ecuacion: [S, ` = ½ · ${f(p1)} · ${f(q1)} · sen ${f(tg)}° ≈ ${f(Sv)}`] },
        };
      },
    },
  };

  return {
    unidad: 'trigonometria.areas-y-lineas-notables',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js'],
    historia: {
      texto: 'En el año 628, Brahmagupta escribió una regla para el área de un cuadrilátero que hoy sabemos válida solo si sus vértices están en una circunferencia. Es la prima de la fórmula de Herón para triángulos. Al repetirse de libro en libro, esa condición a veces se perdió. Por eso aquí cada fórmula viene con su condición.',
      pregunta: '¿Bastan los cuatro lados para saber el área de un cuadrilátero?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Brahmagupta», MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Brahmagupta/' },
    },
    ideas: [lal, heronIdea, tresRadios, cevianas, cuadrilatero],
  };
});
