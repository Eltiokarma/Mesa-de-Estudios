/*
 * Teoría de «Trazos de figuras y perímetros» (razonamiento-matematico.trazos-y-perimetros).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 2); historia: Euler y los puentes de Königsberg.
 * Colores (regla 4): vértice impar rojo (c-h), vértice par verde (c-d), lo que se repite naranja (c-o),
 * el borde que se mide turquesa (c-i).
 * Compañero: Faro (zorro). Códigos: RME32, RME43 (existentes); RMT-TRA-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: decidir antes de dibujar si una figura sale de un trazo, y medir bordes sin medir cada pedazo.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: cuenta vértices impares, revisa que la figura esté unida y calcula perímetros deslizando lados.
 *   Orden de atención: 1.º los números de cada vértice · 2.º la lectura «impares: n» · acción: Ya probé / Comprobar.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿por qué esta figura sí sale y esa no, si se parecen?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const I = { v: 'c-h', t: 'impares' }, P = { v: 'c-i', t: 'P' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    r.barajar = xs => { const y = xs.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const t = fmt(d.valor);
      if (vistos.has(t) || !Number.isFinite(d.valor) || ops.length >= 4) continue;
      vistos.add(t); ops.push({ id: d.id, texto: t, error: d.error, siFuera: d.siFuera });
    }
    return ops;
  }

  // ---------- Grafos: grados, conexión y veredicto ----------
  function analizar(nodos, aristas) {
    const g = Object.fromEntries(nodos.map(n => [n.id, 0]));
    for (const [a, b] of aristas) { g[a]++; g[b]++; }
    const usados = nodos.filter(n => g[n.id] > 0).map(n => n.id);
    const ady = Object.fromEntries(usados.map(id => [id, []]));
    for (const [a, b] of aristas) { ady[a].push(b); ady[b].push(a); }
    const vistos = new Set([usados[0]]), pila = [usados[0]];
    while (pila.length) for (const v of ady[pila.pop()]) if (!vistos.has(v)) { vistos.add(v); pila.push(v); }
    const conexo = vistos.size === usados.length;
    const impares = usados.filter(id => g[id] % 2).length;
    const veredicto = !conexo ? 'no' : impares === 0 ? 'cerrado' : impares === 2 ? 'abierto' : 'no';
    return { g, conexo, impares, veredicto };
  }
  function dibujoGrafo(nodos, aristas, conGrados, extra = {}) {
    const { g } = analizar(nodos, aristas);
    return {
      ancho: 10, alto: 6,
      nodos: nodos.filter(n => g[n.id] > 0).map(n => Object.assign({ id: n.id, x: n.x, y: n.y, r: 13 }, conGrados ? { t: String(g[n.id]), color: g[n.id] % 2 ? 'h' : 'd' } : {})),
      aristas: aristas.map(([a, b]) => ({ de: a, a: b, grosor: 'variable' })),
      pie: extra.pie,
    };
  }
  const VERED = { cerrado: 'Sí, y vuelve al inicio', abierto: 'Sí, de un impar al otro', no: 'No sale de un trazo' };

  // ---------- Idea 1: figuras de un solo trazo ----------
  // Cambia: la figura · Permanece: el número de líneas que toca cada punto escrito en él · Progresa: los impares que
  // aparecen · Se reserva: los dos triángulos separados (cero impares y aun así no sale) · Debe verse: la cuenta de impares.
  const Q = [{ id: 'a', x: 3, y: 0.8 }, { id: 'b', x: 7, y: 0.8 }, { id: 'c', x: 7, y: 5 }, { id: 'd', x: 3, y: 5 }];
  const LADOS = [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'a']];
  const FIG = {
    cuadrado: { n: Q, a: LADOS },
    diagonal: { n: Q, a: LADOS.concat([['a', 'c']]) },
    sobre: { n: Q, a: LADOS.concat([['a', 'c'], ['b', 'd']]) },
    separados: {
      n: [{ id: 'p', x: 0.8, y: 5 }, { id: 'q', x: 4.2, y: 5 }, { id: 'r', x: 2.5, y: 1 }, { id: 's', x: 5.8, y: 5 }, { id: 't', x: 9.2, y: 5 }, { id: 'u', x: 7.5, y: 1 }],
      a: [['p', 'q'], ['q', 'r'], ['r', 'p'], ['s', 't'], ['t', 'u'], ['u', 's']],
    },
  };
  const CASA = { n: [{ id: 'a', x: 3, y: 2.4 }, { id: 'b', x: 7, y: 2.4 }, { id: 'c', x: 7, y: 5.6 }, { id: 'd', x: 3, y: 5.6 }, { id: 'e', x: 5, y: 0.4 }], a: LADOS.concat([['a', 'c'], ['b', 'd'], ['a', 'e'], ['e', 'b']]) };
  const unTrazo = {
    id: 'un-solo-trazo',
    titulo: 'Contar los vértices impares',
    temas: ['Figuras de un solo trazo'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Cada punto muestra cuántas líneas llegan a él. Cambia la figura y mira cuántos puntos tienen un número impar.',
      voz: 'Fíjate también en la figura que viene en dos partes.',
      controles: [{ id: 'fig', etiqueta: 'Figura', opciones: [{ valor: 'cuadrado', texto: 'Cuadrado' }, { valor: 'diagonal', texto: 'Una diagonal' }, { valor: 'sobre', texto: 'Dos diagonales' }, { valor: 'separados', texto: 'Dos triángulos' }] }],
      dibujo: val => ({ datos: dibujoGrafo(FIG[val.fig].n, FIG[val.fig].a, true), estado: {} }),
      lectura: val => { const A = analizar(FIG[val.fig].n, FIG[val.fig].a); return [I, ` = ${A.impares}`, A.conexo ? '' : ' · en dos partes', ` · ${VERED[A.veredicto]}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'La casita: un cuadrado con sus dos diagonales y un techo. El cruce del centro no es un punto. ¿Sale de un solo trazo sin repetir líneas?',
      opciones: [
        { id: 'techo', texto: 'Sí, empezando en la punta del techo', error: 'RMT-TRA-1', siFuera: 'Se puede, pero no desde ahí: la punta tiene dos líneas, un número par.' },
        { id: 'c', texto: 'Sí, empezando en una esquina de abajo', correcta: true },
        { id: 'cruces', texto: 'No: las diagonales se cruzan', error: 'RMT-TRA-2', siFuera: 'Cruzar no cuenta: el cruce no es un punto de la figura.' },
        { id: 'no', texto: 'No: tiene más de dos esquinas', error: 'RMT-TRA-3', siFuera: 'Lo que cuenta son los puntos impares, no las esquinas.' },
      ],
      dibujo: { datos: dibujoGrafo(CASA.n, CASA.a, false), estado: {} },
      revelar: { datos: dibujoGrafo(CASA.n, CASA.a, true, { pie: 'Dos impares: las esquinas de abajo' }), estado: {} },
      coincide: 'Coincide: solo las dos esquinas de abajo son impares; se empieza en una y se termina en la otra.',
    },
    mira: {
      datos: Object.assign(dibujoGrafo(CASA.n, CASA.a, true), {
        nodos: dibujoGrafo(CASA.n, CASA.a, true).nodos.map(n => Object.assign(n, { desde: n.color === 'h' ? 2 : 1 })),
        pie: undefined,
        textos: [{ x: 5, y: 6.35, t: 'el cruce del centro no es punto', desde: 3 }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada paso por un punto usa dos líneas: una entra y otra sale.', ecuacion: ['entra + sale = par'] },
        { estado: { corte: 2 }, texto: 'Un punto impar solo puede ser el inicio o el final.', ecuacion: [I, ' = 2'] },
        { estado: { corte: 3 }, texto: 'Cruzarse no es pasar por un punto.' },
        { estado: { corte: 3 }, texto: 'Dos impares y figura unida: sale, de un impar al otro.' },
      ],
    },
    regla: {
      texto: 'Una figura unida sale de un trazo si tiene 0 puntos impares (y vuelve al inicio) o 2 (va de uno al otro). Con 4 o más, no sale.',
      ecuacion: [I, ' ∈ {0, 2}'],
      condicion: 'la figura está en una sola pieza y solo cuentan los puntos donde se unen líneas, no los cruces.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Escribe en cada punto cuántas líneas llegan.',
      generar(s) {
        const r = azar(s);
        const N = [{ id: '0', x: 1.2, y: 1 }, { id: '1', x: 5, y: 0.6 }, { id: '2', x: 8.8, y: 1 }, { id: '3', x: 1.2, y: 5 }, { id: '4', x: 5, y: 5.4 }, { id: '5', x: 8.8, y: 5 }];
        const POSIBLES = [['0', '1'], ['1', '2'], ['3', '4'], ['4', '5'], ['0', '3'], ['2', '5'], ['1', '4'], ['0', '4'], ['1', '3'], ['1', '5'], ['2', '4']];
        const ar = r.barajar(POSIBLES).slice(0, r.ent(5, 10));
        const A = analizar(N, ar);
        const correcta = VERED[A.veredicto];
        return {
          pregunta: `Esta figura tiene ${ar.length} líneas. ¿Se puede dibujar de un solo trazo, sin levantar el lápiz ni repetir líneas?`,
          dibujo: { datos: dibujoGrafo(N, ar, false), estado: {} },
          opciones: [
            { id: 'cerrado', texto: VERED.cerrado, correcta: correcta === VERED.cerrado, error: 'RMT-TRA-4', siFuera: 'Volver al inicio pide cero puntos impares. Cuenta las líneas de cada punto.' },
            { id: 'abierto', texto: VERED.abierto, correcta: correcta === VERED.abierto, error: 'RMT-TRA-4', siFuera: 'Esto pide exactamente dos puntos impares en una figura unida.' },
            { id: 'no', texto: VERED.no, correcta: correcta === VERED.no, error: 'RMT-TRA-5', siFuera: 'Con 0 o 2 impares en una figura unida, sí sale.' },
          ].map(o => (o.correcta ? { id: o.id, texto: o.texto, correcta: true } : o)),
          solucion: { texto: `${A.impares} puntos impares${A.conexo ? '' : ' y figura en partes'}: ${correcta.toLowerCase()}.`, dibujo: { datos: dibujoGrafo(N, ar, true), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: recorrido mínimo repitiendo lo menos posible ----------
  // Cambia: qué camino se repite · Permanece: la ventana con su cruz y sus medidas · Progresa: los impares que se
  // vuelven pares · Se reserva: el recorrido que debe volver al inicio · Debe verse: repetir une impares de a dos.
  const VW = 6, VH = 4;
  const ventanaN = (w, h) => {
    const k = 7 / Math.max(w, h * 1.4), x0 = 5.8 - w * k / 2, y0 = 3.1 - h * k / 2;
    const X = u => x0 + u * k, Y = v => y0 + v * k;
    return [
      { id: 'a', x: X(0), y: Y(0) }, { id: 't', x: X(w / 2), y: Y(0) }, { id: 'b', x: X(w), y: Y(0) },
      { id: 'l', x: X(0), y: Y(h / 2) }, { id: 'c', x: X(w / 2), y: Y(h / 2) }, { id: 'r', x: X(w), y: Y(h / 2) },
      { id: 'd', x: X(0), y: Y(h) }, { id: 'u', x: X(w / 2), y: Y(h) }, { id: 'e', x: X(w), y: Y(h) },
    ];
  };
  const VENT_A = [['a', 't'], ['t', 'b'], ['b', 'r'], ['r', 'e'], ['e', 'u'], ['u', 'd'], ['d', 'l'], ['l', 'a'], ['t', 'c'], ['c', 'u'], ['l', 'c'], ['c', 'r']];
  const REPITE = { nada: [], tcu: [['t', 'c'], ['c', 'u']], lcr: [['l', 'c'], ['c', 'r']], tc: [['t', 'c']] };
  const largoRep = (w, h) => ({ nada: 0, tcu: h, lcr: w, tc: h / 2 });
  function ventana(rep, w = VW, h = VH, extra = {}) {
    const N = ventanaN(w, h), ar = VENT_A.concat(REPITE[rep] || []);
    const { g } = analizar(N, ar);
    return {
      ancho: 10, alto: 6,
      nodos: N.filter(n => n.id !== 'a' && n.id !== 'b' && n.id !== 'd' && n.id !== 'e' || true).map(n => ({ id: n.id, x: n.x, y: n.y, r: 11, t: g[n.id] % 2 ? 'I' : '', color: g[n.id] % 2 ? 'h' : undefined })),
      aristas: VENT_A.map(([a, b]) => ({ de: a, a: b })).concat((REPITE[rep] || []).map(([a, b]) => ({ de: a, a: b, color: 'o', grosor: 'variable', curva: 9 }))).concat(extra.aristas || []),
      textos: [{ x: N[1].x, y: N[1].y - 0.62, t: `${f(w)} cm` }, { x: N[3].x - 0.5, y: N[3].y, t: `${f(h)} cm`, ancla: 'end' }],
      pie: extra.pie,
    };
  }
  const minimo = {
    id: 'recorrido-minimo',
    titulo: 'Repetir lo menos posible',
    temas: ['Longitud mínima de un recorrido'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Ventana de 6 × 4 cm con cruz: 30 cm de líneas y cuatro puntos impares (I). Elige qué tramo repetir y cuenta los impares.',
      voz: 'Repetir un tramo cambia la paridad de sus dos extremos.',
      controles: [{ id: 'rep', etiqueta: 'Repite', opciones: [{ valor: 'nada', texto: 'Nada' }, { valor: 'tc', texto: 'Medio palo' }, { valor: 'tcu', texto: 'Palo vertical' }, { valor: 'lcr', texto: 'Palo horizontal' }] }],
      dibujo: val => ({ datos: ventana(val.rep), estado: {} }),
      lectura: val => {
        const A = analizar(ventanaN(VW, VH), VENT_A.concat(REPITE[val.rep]));
        return [I, ` = ${A.impares}`, A.impares <= 2 ? ` · recorrido de ${f(30 + largoRep(VW, VH)[val.rep])} cm` : ' · todavía no sale'];
      },
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora el lápiz debe volver al punto donde empezó. ¿Cuánto mide, como mínimo, el recorrido?',
      opciones: [
        { id: 'abierto', texto: '34 cm', error: 'RMT-TRA-6', siFuera: '34 cm alcanza si se termina en otro punto. Para volver, no puede quedar ningún impar.' },
        { id: 'total', texto: '30 cm', error: 'RME32', siFuera: '30 cm sería sin repetir: con cuatro impares no se puede.' },
        { id: 'c', texto: '40 cm', correcta: true },
        { id: 'doble', texto: '60 cm', error: 'RMT-TRA-7', siFuera: 'Eso repite todo. Basta repetir los dos palos de la cruz.' },
      ],
      dibujo: { datos: ventana('nada'), estado: {} },
      revelar: { datos: ventana('nada', VW, VH, { aristas: [['t', 'c'], ['c', 'u'], ['l', 'c'], ['c', 'r']].map(([a, b]) => ({ de: a, a: b, color: 'o', grosor: 'variable', curva: 9 })), pie: '30 + 4 + 6 = 40 cm' }), estado: {} },
      coincide: 'Coincide: hay que emparejar los cuatro impares, y eso cuesta los dos palos: 4 + 6 cm.',
    },
    mira: {
      datos: ventana('nada', VW, VH, { aristas: [
        { de: 't', a: 'c', color: 'o', grosor: 'variable', curva: 9, desde: 2 }, { de: 'c', a: 'u', color: 'o', grosor: 'variable', curva: 9, desde: 2 },
        { de: 'l', a: 'c', color: 'o', grosor: 'variable', curva: 9, desde: 3 }, { de: 'c', a: 'r', color: 'o', grosor: 'variable', curva: 9, desde: 3 },
      ] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Los cuatro puntos del medio de cada lado son impares.', ecuacion: [I, ' = 4'] },
        { estado: { corte: 2 }, texto: 'Repetir el palo vertical empareja dos impares: quedan dos.', ecuacion: ['30 + 4 = 34 cm (termina en otro punto)'] },
        { estado: { corte: 3 }, texto: 'Para volver al inicio, se empareja también el otro par.', ecuacion: ['30 + 4 + 6 = 40 cm'] },
      ],
    },
    regla: {
      texto: 'Con más de dos impares, se repiten los caminos más cortos que unen impares de dos en dos. Para terminar en otro punto, pueden quedar dos sin unir.',
      ecuacion: ['mínimo = total + lo repetido'],
      condicion: 'se repiten caminos que existen en la figura y se elige la forma más corta de emparejar los impares.',
    },
    ahoraTu: {
      voz: 'Marca los impares y busca los caminos más cortos que los unen.',
      generar(s) {
        const r = azar(s), w = 2 * r.ent(2, 6), h = 2 * r.ent(2, 5);
        const vuelve = s % 2 === 0, total = 3 * (w + h);
        const bien = total + (vuelve ? w + h : Math.min(w, h));
        return {
          pregunta: `Una ventana de ${f(w)} × ${f(h)} cm con una cruz al centro. ¿Cuánto mide el menor recorrido que pasa por todas las líneas${vuelve ? ' y vuelve al inicio' : ''}?`,
          dibujo: { datos: ventana('nada', w, h), estado: {} },
          opciones: opciones(bien, [
            { id: 'total', valor: total, error: 'RME32', siFuera: 'Eso es sin repetir: con cuatro impares no sale.' },
            { id: 'otro', valor: vuelve ? total + Math.min(w, h) : total + w + h, error: 'RMT-TRA-6', siFuera: vuelve ? 'Eso termina en otro punto; para volver no puede quedar impar.' : 'Eso vuelve al inicio; aquí puede terminar en otro punto.' },
            { id: 'largo', valor: total + Math.max(w, h), error: 'RMT-TRA-8', siFuera: 'Se repitió el palo largo; el corto basta.' },
            { id: 'borde', valor: 2 * (w + h), error: 'RMT-TRA-9', siFuera: 'Ese es solo el marco; falta la cruz.' },
          ], n => `${f(n)} cm`),
          solucion: { texto: vuelve ? 'Se repiten los dos palos de la cruz.' : 'Se repite el palo más corto de la cruz.', ecuacion: [`${f(total)} + ${vuelve ? `${f(w)} + ${f(h)}` : f(Math.min(w, h))} = ${f(bien)} cm`] },
        };
      },
    },
  };

  // ---------- Idea 3: perímetro de una escalera y del entrante ----------
  // Cambia: cuántos escalones · Permanece: el ancho y el alto de la figura · Progresa: los lados que se deslizan al
  // borde · Se reserva: el entrante, que sí agrega · Debe verse: los escalones suman lo mismo que dos lados.
  const escalera = (W, H, n, entrante = 0, extra = {}) => {
    const k = Math.min(7.4 / W, 4.8 / H), x0 = 5.6 - W * k / 2, y0 = 0.6;
    const X = u => x0 + u * k, Y = v => y0 + v * k;
    const pts = [[X(0), Y(H)], [X(0), Y(0)]];
    if (entrante) { const a = W * 0.2; pts.push([X(a), Y(0)], [X(a), Y(entrante)], [X(a + W * 0.15), Y(entrante)], [X(a + W * 0.15), Y(0)]); }
    // Escalones que bajan desde (W·0.4, 0) hasta (W, H).
    const x1 = W * 0.4;
    for (let i = 0; i < n; i++) { pts.push([X(x1 + (W - x1) * i / n), Y(H * i / n)], [X(x1 + (W - x1) * (i + 1) / n), Y(H * i / n)]); }
    pts.push([X(W), Y(H)]);
    return {
      ancho: 10, alto: 6.2,
      poligonos: [
        { puntos: [[X(0), Y(0)], [X(W), Y(0)], [X(W), Y(H)], [X(0), Y(H)]], discontinua: true, relleno: 0, grosor: 'cuadricula', desde: extra.marco || 0 },
        { puntos: pts, color: 'i', grosor: 'variable', relleno: 0.12 },
      ],
      textos: [{ x: 5, y: Y(H) + 0.45, t: `${f(W)} cm` }, { x: X(0) - 0.2, y: Y(H / 2), t: `${f(H)} cm`, ancla: 'end' }]
        .concat(entrante ? [{ x: X(W * 0.275), y: Y(entrante) + 0.5, t: `${f(entrante)} cm`, color: 'o' }] : []),
      pie: extra.pie,
    };
  };
  const perimetro = {
    id: 'deslizar-lados',
    titulo: 'Deslizar lados hasta el borde',
    temas: ['Perímetros de figuras poligonales'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Una figura de 10 cm de ancho y 6 cm de alto con escalones. Cambia cuántos escalones tiene y mira su perímetro.',
      voz: 'Cada escalón tiene un trozo horizontal y uno vertical.',
      controles: [{ id: 'n', etiqueta: 'Escalones', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 }],
      dibujo: val => ({ datos: escalera(10, 6, val.n), estado: {} }),
      lectura: val => [P, ` = 2 · (10 + 6) = ${f(32)} cm con ${val.n} escalones`],
      minimo: 3,
    },
    predice: {
      pregunta: 'A la misma figura se le corta arriba un entrante de 2 cm de profundidad. ¿Cuánto mide ahora su perímetro?',
      opciones: [
        { id: 'igual', texto: '32 cm', error: 'RMT-TRA-10', siFuera: 'Los escalones se deslizan al borde, pero las paredes del entrante no: quedan adentro.' },
        { id: 'menos', texto: '28 cm', error: 'RMT-TRA-11', siFuera: 'Quitar área no quita borde: el entrante agrega dos paredes.' },
        { id: 'c', texto: '36 cm', correcta: true },
        { id: 'uno', texto: '34 cm', error: 'RMT-TRA-12', siFuera: 'El entrante tiene dos paredes de 2 cm, no una.' },
      ],
      dibujo: { datos: escalera(10, 6, 3, 2), estado: {} },
      revelar: { datos: escalera(10, 6, 3, 2, { pie: '32 + 2 + 2 = 36 cm' }), estado: {} },
      coincide: 'Coincide: el contorno exterior da 32 cm y las dos paredes del entrante suman 4 cm.',
    },
    mira: {
      datos: Object.assign(escalera(10, 6, 3, 2, { marco: 1 }), {}),
      pasos: [
        { estado: { corte: 0 }, texto: 'Los trozos horizontales de los escalones suman lo que el lado de abajo.' },
        { estado: { corte: 1 }, texto: 'Los verticales suman lo que el lado izquierdo: el contorno es el del rectángulo.', ecuacion: [P, ' = 2 · (10 + 6) = 32 cm'] },
        { estado: { corte: 1 }, texto: 'Las dos paredes del entrante no tienen pareja en el borde: se suman.', ecuacion: [P, ' = 32 + 2 · 2 = 36 cm'] },
      ],
    },
    regla: {
      texto: 'Si los lados se pueden deslizar hasta el borde del rectángulo que la encierra, el perímetro es el del rectángulo. Cada entrante agrega dos veces su profundidad.',
      ecuacion: [P, ' = 2 · (ancho + alto) + 2 · entrantes'],
      condicion: 'todos los lados son horizontales o verticales y los escalones van siempre en el mismo sentido.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Desliza cada lado hasta el borde y busca lo que no tiene pareja.',
      generar(s) {
        const r = azar(s), W = r.ent(6, 14), H = r.ent(4, 9), n = r.ent(2, 5), e = s % 3 ? r.ent(1, Math.max(1, H - 3)) : 0;
        const bien = 2 * (W + H) + 2 * e;
        return {
          pregunta: `La figura mide ${f(W)} cm de ancho y ${f(H)} cm de alto${e ? `, con un entrante de ${f(e)} cm de profundidad` : ''}. ¿Cuál es su perímetro?`,
          dibujo: { datos: escalera(W, H, n, e), estado: {} },
          opciones: opciones(bien, [
            { id: 'sin-e', valor: 2 * (W + H), error: 'RMT-TRA-10', siFuera: 'Ese es el borde exterior; faltan las paredes del entrante.' },
            { id: 'una-e', valor: 2 * (W + H) + e, error: 'RMT-TRA-12', siFuera: 'El entrante tiene dos paredes.' },
            { id: 'mitad', valor: W + H, error: 'RMT-TRA-13', siFuera: 'Eso es la mitad del contorno.' },
            { id: 'area', valor: W * H, error: 'RMT-TRA-14', siFuera: 'Eso es el área del rectángulo, no su borde.' },
          ], v => `${f(v)} cm`),
          solucion: { texto: e ? 'El contorno del rectángulo más las dos paredes del entrante.' : 'Los escalones se deslizan al borde del rectángulo.', ecuacion: [P, ` = 2 · (${f(W)} + ${f(H)})${e ? ` + 2 · ${f(e)}` : ''} = ${f(bien)} cm`] },
        };
      },
    },
  };

  // ---------- Idea 4: perímetros con semicircunferencias ----------
  // Cambia: cuántos semicírculos chicos · Permanece: el diámetro grande · Progresa: los arcos chicos que se suman ·
  // Se reserva: la figura cerrada con arcos arriba y abajo · Debe verse: la suma de arcos chicos no cambia.
  const D0 = 12;
  const arco = (cx, cy, rad, arriba, n = 24) => Array.from({ length: n + 1 }, (_, k) => {
    const t = Math.PI * k / n;
    return [cx - rad * Math.cos(t), cy + (arriba ? -1 : 1) * rad * Math.sin(t)];
  });
  function semis(n, D = D0, conGrande = false, extra = {}) {
    const k = 8 / D, x0 = 1, y0 = 3.2, R = D * k / 2;
    const pol = [];
    if (conGrande) pol.push({ puntos: arco(x0 + R, y0, R, true), abierto: true, color: 'o', grosor: 'variable', desde: extra.grande || 0 });
    for (let i = 0; i < n; i++) { const r0 = R / n; pol.push({ puntos: arco(x0 + r0 * (2 * i + 1), y0, r0, false), abierto: true, color: 'i', grosor: 'variable', desde: extra.chicos || 0 }); }
    return {
      ancho: 10, alto: 6.2,
      poligonos: pol,
      lineas: conGrande ? [] : [{ de: [x0, y0], a: [x0 + 2 * R, y0], grosor: 'cuadricula', rotulo: `${f(D)} cm`, en: [5, y0 - 0.35] }],
      pie: extra.pie,
    };
  }
  const circular = {
    id: 'arcos-que-suman',
    titulo: 'Los arcos chicos suman igual',
    temas: ['Perímetros de figuras circulares'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Sobre un segmento de 12 cm se apoyan semicírculos iguales. Cambia cuántos son y mira la suma de sus arcos.',
      voz: 'Más semicírculos son más chicos. ¿Qué pasa con la suma?',
      controles: [{ id: 'n', etiqueta: 'Semicírculos', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: semis(val.n), estado: {} }),
      lectura: val => [`${val.n} × π · ${f(D0 / val.n)} / 2 = ${f(D0 / 2)}π cm`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Arriba del mismo segmento va un semicírculo de 12 cm de diámetro, y abajo, tres semicírculos de 4 cm. ¿Cuál es el perímetro de la figura?',
      opciones: [
        { id: 'c', texto: '12π cm', correcta: true },
        { id: 'solo', texto: '6π cm', error: 'RME43', siFuera: '6π es solo el arco de arriba; los de abajo también son borde.' },
        { id: 'diam', texto: '12π + 12 cm', error: 'RMT-TRA-15', siFuera: 'El segmento de 12 cm queda adentro: no es borde.' },
        { id: 'tres', texto: '6π + 2π cm', error: 'RMT-TRA-16', siFuera: '2π es un solo arco chico; son tres.' },
      ],
      dibujo: { datos: semis(3, D0, true), estado: {} },
      revelar: { datos: semis(3, D0, true, { pie: '6π + 3 · 2π = 12π cm' }), estado: {} },
      coincide: 'Coincide: arriba 6π y abajo también 6π, sin importar cuántos arcos sean.',
    },
    mira: {
      datos: semis(3, D0, true, { grande: 1, chicos: 2 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Media circunferencia de 12 cm de diámetro.', ecuacion: [{ frac: ['π · 12', '2'] }, ' = 6π cm'] },
        { estado: { corte: 2 }, texto: 'Tres medias de 4 cm: el diámetro se reparte, la suma no cambia.', ecuacion: ['3 · ', { frac: ['π · 4', '2'] }, ' = 6π cm'] },
        { estado: { corte: 2 }, texto: 'El borde son los dos tramos curvos.', ecuacion: [P, ' = 6π + 6π = 12π cm'] },
      ],
    },
    regla: {
      texto: 'Una semicircunferencia mide π por el diámetro entre dos. Si varios semicírculos se reparten un mismo diámetro, sus arcos suman lo mismo que el semicírculo grande.',
      ecuacion: [{ frac: ['π · D', '2'] }, ' = ', { frac: ['π · d₁', '2'] }, ' + … + ', { frac: ['π · dₙ', '2'] }],
      condicion: 'los diámetros chicos están sobre el diámetro grande y lo cubren sin sobrar ni faltar.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Separa lo curvo de lo recto y suma solo el borde.',
      generar(s) {
        const r = azar(s), n = r.ent(2, 5), D = 2 * n * r.ent(1, 3);
        const bien = D;   // en múltiplos de π
        return {
          pregunta: `Arriba de un segmento de ${f(D)} cm va un semicírculo con ese diámetro; abajo, ${n} semicírculos iguales. ¿Cuál es el perímetro de la figura?`,
          dibujo: { datos: semis(n, D, true), estado: {} },
          opciones: opciones(bien, [
            { id: 'solo', valor: D / 2, error: 'RME43', siFuera: 'Ese es solo un tramo curvo; el de abajo también es borde.' },
            { id: 'n', valor: D / 2 + D / (2 * n), error: 'RMT-TRA-16', siFuera: 'Contaste un solo arco chico.' },
            { id: 'doble', valor: 2 * D, error: 'RMT-TRA-17', siFuera: 'Usaste el diámetro como radio.' },
            { id: 'cuarto', valor: D / 4 + D / 2, error: 'RMT-TRA-18', siFuera: 'Los arcos chicos suman lo mismo que el grande.' },
          ], v => `${f(v)}π cm`),
          solucion: { texto: 'Arriba y abajo hay el mismo largo curvo.', ecuacion: [`${f(D / 2)}π + ${f(D / 2)}π = ${f(D)}π cm`] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-matematico.trazos-y-perimetros',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-plano.js'],
    historia: {
      texto: 'En la década de 1730, Euler estudió si se podían cruzar los siete puentes de Königsberg una sola vez cada uno. Cambió las orillas por puntos y los puentes por líneas, y dejó de lado las distancias: importaba cómo se conectaban. Medir un borde es otra pregunta.',
      pregunta: '¿Qué importa más: el largo o las conexiones?',
      fuente: { titulo: 'Euler, Solutio problematis ad geometriam situs pertinentis · texto original y traducción', url: 'https://www.cantab.net/users/michael.behrend/repubs/maze_maths/pages/euler_en.html' },
    },
    ideas: [unTrazo, minimo, perimetro, circular],
  };
});
