/*
 * Teoría de «Circunferencia trigonométrica» (trigonometria.circunferencia-trigonometrica), 4.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 8), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (trigonometría, pp. 82–100) y las «Precisiones de Geometría y Trigonometría» del expediente.
 * Forma: contenido/teoria/trigonometria/angulo-trigonometrico.js. Ruta: descubrir, con apoyo de recordar.
 * Compañera: Mara (coneja), cercana y rigurosa: cada línea es un número con signo, no un largo.
 * Colores (regla 4): el arco t o θ en naranja (c-o). Cada razón comparte color con su recíproca, porque las dos salen
 * de la misma coordenada: seno y cosecante en rojo (c-h, la ordenada), coseno y secante en turquesa (c-i, la
 * abscisa), tangente y cotangente en verde (c-d).
 * Errores: TR3 (lee el número real como grados), TR10 (la razón crece con el ángulo), TR11 (cruza x e y), TR12 (la
 * línea como largo sin signo; es el error objetivo de la matriz) de docs/investigacion/trigonometria-ideas-erroneas.md;
 * hipótesis nuevas: TRCT-CUADRANTE (cuenta un cuadrante por unidad de arco), TRCT-RANGO (sec o csc entre −1 y 1),
 * TRCT-COPIA (una línea varía como otra), TRCT-SENTIDO (lee la variación al revés), TRCT-MAXIMO (sube y baja dentro
 * de un solo cuadrante) y TRPN-TAN-CERO (de angulos-en-posicion-normal).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: cada número real es un arco desde A(1, 0) y sus seis razones son segmentos con signo de la misma figura.
 *   Persona y condiciones: postulante de 4.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: ubica un número real en la C.T., compara valores con signo y da rango y variación de una línea.
 *   Orden de atención: 1.º el punto P del arco · 2.º la línea en estudio, sola · acción: girar el arco · fondo: ejes y rectas tangentes.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué cos 170° es menor que cos 100° si su línea es más larga?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const t_ = { v: 'c-o', t: 't' }, th = { v: 'c-o', t: 'θ' };
  const rad = g => g * Math.PI / 180;
  const mod360 = x => ((x % 360) + 360) % 360;
  const ROM = ['', 'I', 'II', 'III', 'IV'];
  const cuadDeg = g => { const m = mod360(g); return m % 90 === 0 ? 0 : Math.ceil(m / 90); };
  const EXACTOS = [[0, '0'], [0.5, '1/2'], [Math.SQRT2 / 2, '√2/2'], [Math.sqrt(3) / 2, '√3/2'], [1, '1'], [Math.sqrt(3) / 3, '√3/3'], [Math.sqrt(3), '√3']];
  function exacto(v) {
    if (!Number.isFinite(v)) return 'no existe';
    const e = EXACTOS.find(([n]) => Math.abs(Math.abs(v) - n) < 1e-9);
    return (v < -1e-9 ? '−' : '') + (e ? e[1] : f(Math.abs(v)));
  }
  const tanD = g => (Math.abs(Math.cos(rad(g))) < 1e-9 ? NaN : Math.tan(rad(g)));
  const cotD = g => (Math.abs(Math.sin(rad(g))) < 1e-9 ? NaN : 1 / Math.tan(rad(g)));
  const secD = g => (Math.abs(Math.cos(rad(g))) < 1e-9 ? NaN : 1 / Math.cos(rad(g)));
  const cscD = g => (Math.abs(Math.sin(rad(g))) < 1e-9 ? NaN : 1 / Math.sin(rad(g)));
  const val = (v, d = 2) => (Number.isFinite(v) ? f(v, d) : 'no existe');
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
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Los elementos fijos de la C.T.: A, B, A′, B′ (desde = 0 o el corte que se pida).
  const extremos = (desde = 0) => [
    { x: 1, y: 0, rotulo: 'A', lado: 'se', desde }, { x: 0, y: 1, rotulo: 'B', lado: 'ne', desde },
    { x: -1, y: 0, rotulo: 'A′', lado: 'so', desde }, { x: 0, y: -1, rotulo: 'B′', lado: 'se', desde },
  ];

  // ---------- Idea 1: cada número real es un arco dirigido ----------
  // Cambia: el número real t, de −3 a 3. · Permanece: la C.T. de radio 1, el origen de arcos A y las marcas 1…6.
  // Progresa: el arco naranja que se enrolla desde A. · Se reserva: t = 4, fuera del control (la predicción).
  // Debe verse: que t mide largo de arco en radios, no grados, y que el signo da el sentido.
  const marcas = (desde = 0) => [1, 2, 3, 4, 5, 6].map(k => ({ x: 0.84 * Math.cos(k), y: 0.84 * Math.sin(k) - 0.06, texto: `${k}`, desde }));
  function arcoT(t, extra = {}) {
    const g = t * 180 / Math.PI;
    return Object.assign({
      circulos: [{ r: 1 }],
      arcos: t ? [{ de: 0, a: g, r: 1, espiral: 0, color: 'o' }] : [],
      puntos: extremos().concat([{ x: Math.cos(t), y: Math.sin(t), color: 'o', rotulo: `t = ${f(t)}`, lado: Math.cos(t) >= 0 ? (Math.sin(t) >= 0 ? 'ne' : 'se') : (Math.sin(t) >= 0 ? 'no' : 'so') }]),
      rotulos: marcas(),
      alt: `Arco dirigido de largo ${f(t)} desde A, ${t >= 0 ? 'antihorario' : 'horario'}; termina en P`,
    }, extra);
  }
  const cuadT = t => cuadDeg(t * 180 / Math.PI);
  const arcos = {
    id: 'arcos-reales',
    titulo: 'Cada número es un arco',
    temas: ['Elementos y arcos dirigidos', 'Ubicación de números reales'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige un número real t. Desde A se enrolla un arco de largo t sobre la circunferencia de radio 1: antihorario si t > 0.',
      voz: 'Conservemos A como origen de todos los arcos.',
      controles: [{ id: 't', etiqueta: 't', color: 'c-o', min: -3, max: 3, paso: 0.5, inicio: 1, decimales: 1 }],
      dibujo: val => ({ datos: arcoT(val.t), estado: {} }),
      lectura: val => {
        const q = cuadT(val.t);
        return [t_, ` = ${f(val.t)} · ${val.t >= 0 ? 'antihorario' : 'horario'} · ${q ? 'cuadrante ' + ROM[q] : 'en A'}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Si enrollas un arco de largo t = 4 desde A, en sentido antihorario, ¿en qué cuadrante termina?',
      voz: 'Compara 4 con los largos de un cuarto, media y tres cuartos de vuelta.',
      opciones: [
        { id: 'c', texto: 'En el III', correcta: true },
        { id: 'cuarto', texto: 'En el IV: 4 es el cuarto', error: 'TRCT-CUADRANTE', siFuera: 'Contar cuadrantes es buena idea. Pero cada uno mide π/2 ≈ 1,57, no 1.' },
        { id: 'grados', texto: 'En el I: 4 es un ángulo pequeño', error: 'TR3', siFuera: 'Eso sería cierto con 4°. Aquí 4 es un largo de arco: 4 radios.' },
        { id: 'ii', texto: 'En el II', error: 'TRCT-CUADRANTE', siFuera: 'El II termina en π ≈ 3,14. Como 4 es mayor, ya pasó al III.' },
      ],
      dibujo: { datos: { circulos: [{ r: 1 }], puntos: extremos(), rotulos: marcas(), alt: 'Circunferencia trigonométrica con A, B, A′, B′ y las marcas de 1 a 6' }, estado: {} },
      revelar: { datos: arcoT(4), estado: {} },
      coincide: 'Coincide: 4 está entre π ≈ 3,14 y 3π/2 ≈ 4,71.',
      noCoincide: 'Revisemos con las marcas: 4 queda pasando A′.',
    },
    mira: {
      datos: {
        circulos: [{ r: 1 }],
        arcos: [{ de: 0, a: 90, r: 1, espiral: 0, color: 'o', rotulo: 'π/2 ≈ 1,57', flecha: false, desde: 2, hasta: 2 }, { de: 0, a: 180, r: 1, espiral: 0, color: 'o', rotulo: 'π ≈ 3,14', flecha: false, desde: 3, hasta: 3 }, { de: 0, a: 4 * 180 / Math.PI, r: 1, espiral: 0, color: 'o', desde: 4 }],
        puntos: extremos(1).concat([{ x: Math.cos(4), y: Math.sin(4), color: 'o', rotulo: 't = 4', lado: 'so', desde: 4 }]),
        rotulos: marcas(1).concat([{ x: 0.5, y: -1.22, texto: '3π/2 ≈ 4,71', desde: 4 }]),
        alt: 'Arcos de un cuarto, media vuelta y largo 4 desde A: 4 termina en el tercer cuadrante',
      },
      voz: 'Mide cada cuarto de vuelta en radios.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Radio 1, centro O y origen de arcos A(1, 0).', ecuacion: ['A(1, 0);  B(0, 1);  A′(−1, 0);  B′(0, −1)'] },
        { estado: { corte: 2 }, texto: 'Un cuarto de vuelta mide π/2 radios.', ecuacion: [{ frac: ['π', '2'] }, ' ≈ 1,57'] },
        { estado: { corte: 3 }, texto: 'Media vuelta mide π: el arco llega a A′.', ecuacion: ['π ≈ 3,14'] },
        { estado: { corte: 4 }, texto: '4 está entre π y 3π/2: termina en el III.', ecuacion: ['3,14 < 4 < 4,71'] },
      ],
    },
    regla: {
      texto: 'Cada número real t es un arco de largo t medido desde A: antihorario si t > 0, horario si t < 0. Su extremo P tiene coordenadas (cos t, sen t).',
      ecuacion: ['P = (cos ', t_, ', sen ', t_, ')'],
      condicion: 'radio 1 y centro en el origen; t es un largo de arco, igual a su medida en radianes.',
      voz: 'Un número, un arco; el signo dice hacia dónde se enrolla.',
    },
    ahoraTu: {
      voz: 'Ubica t entre los múltiplos de π/2 ≈ 1,57.',
      generar(sem) {
        const rr = azar(sem);
        let t = rr.ent(-12, 20) / 2;
        while (!t || Math.abs(t / (Math.PI / 2) - Math.round(t / (Math.PI / 2))) < 0.12) t += 0.5;
        const q = cuadT(t), qg = cuadDeg(t);
        const k = Math.floor(t / (Math.PI / 2)), a = k * Math.PI / 2, b = (k + 1) * Math.PI / 2;
        const ops = [1, 2, 3, 4].filter(j => j !== q).map(j => ({
          id: `q${j}`, valor: j, error: j === qg ? 'TR3' : 'TRCT-CUADRANTE',
          siFuera: j === qg ? `Eso ubica ${f(t)}°. Aquí ${f(t)} es un largo de arco, en radios.` : `${f(t)} está entre ${f(a)} y ${f(b)}: ese tramo es el cuadrante ${ROM[q]}.`,
        }));
        return {
          pregunta: ['El número real ', t_, ` = ${f(t)} se ubica como arco desde A. ¿En qué cuadrante termina?`],
          opciones: opciones(q, ops, v => `Cuadrante ${ROM[v]}`),
          solucion: {
            texto: `${f(t)} está entre ${f(a)} y ${f(b)}, múltiplos de π/2.`,
            ecuacion: [`${f(a)} < `, t_, ` < ${f(b)}`],
            dibujo: { datos: arcoT(t, { arcos: [{ de: 0, a: t * 180 / Math.PI, r: Math.abs(t) > 2 * Math.PI ? 0.9 : 1, espiral: 6, color: 'o' }] }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: seno y coseno son coordenadas con signo ----------
  // Cambia: el arco θ, de 0° a 360° en pasos de 15°. · Permanece: la C.T. y sus dos ejes.
  // Progresa: la línea seno (vertical) y la línea coseno (horizontal) de P. · Se reserva: comparar cos 100° y cos 170°
  // (la predicción). · Debe verse: que la línea más larga puede ser el valor menor.
  function senCos(g, extra = {}) {
    const x = Math.cos(rad(g)), y = Math.sin(rad(g));
    return Object.assign({
      circulos: [{ r: 1 }],
      rayos: [{ ang: g, color: 'o', grosor: 'contorno', punta: false }],
      arcos: g ? [{ de: 0, a: g, r: 0.2, color: 'o', rotulo: `${f(g)}°` }] : [],
      segmentos: [{ de: [x, 0], a: [x, y], color: 'h', punta: Math.abs(y) > 0.05, rotulo: Math.abs(y) > 0.15 ? 'sen' : undefined }, { de: [0, y], a: [x, y], color: 'i', punta: Math.abs(x) > 0.05, rotulo: Math.abs(x) > 0.15 ? 'cos' : undefined }],
      puntos: [{ x, y, rotulo: 'P', lado: y >= 0 ? (x >= 0 ? 'ne' : 'no') : (x >= 0 ? 'se' : 'so') }],
      alt: `Arco de ${f(g)} grados: línea seno ${f(y)} y línea coseno ${f(x)}, con su signo`,
    }, extra);
  }
  const senoCoseno = {
    id: 'lineas-seno-coseno',
    titulo: 'Seno y coseno con signo',
    temas: ['Líneas seno y coseno'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Gira el arco θ. La flecha roja, del eje x hasta P, es la línea seno; la turquesa, del eje y hasta P, la coseno.',
      voz: 'Mira hacia dónde apunta cada flecha, no solo cuánto mide.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 0, max: 360, paso: 15, inicio: 60, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: senCos(val.g), estado: {} }),
      lectura: val => ['sen ', th, ` = ${f(Math.sin(rad(val.g)))}; cos `, th, ` = ${f(Math.cos(rad(val.g)))}`],
      minimo: 4,
    },
    predice: {
      pregunta: '¿Cuál es mayor: cos 100° o cos 170°?',
      voz: 'Piensa en los números, con su signo.',
      opciones: [
        { id: 'c', texto: 'cos 100°', correcta: true },
        { id: 'largo', texto: 'cos 170°: su línea es más larga', error: 'TR12', siFuera: 'Su línea sí es más larga. Pero apunta a la izquierda: −0,98 es menor que −0,17.' },
        { id: 'angulo', texto: 'cos 170°: el ángulo es mayor', error: 'TR10', siFuera: 'Sería cierto si el coseno creciera con el ángulo. En el II el coseno baja.' },
        { id: 'iguales', texto: 'Son iguales: los dos están en el II', error: 'TRCT-COPIA', siFuera: 'Comparten cuadrante, así que comparten signo. Pero sus abscisas son distintas.' },
      ],
      dibujo: { datos: { circulos: [{ r: 1 }], rayos: [{ ang: 100, color: 'o', grosor: 'contorno', punta: false }, { ang: 170, color: 'o', grosor: 'contorno', punta: false }], rotulos: [{ x: -0.3, y: 1.15, texto: '100°', color: 'o' }, { x: -1.15, y: 0.32, texto: '170°', color: 'o' }], alt: 'Radios de 100 y 170 grados en la circunferencia trigonométrica' }, estado: {} },
      revelar: { datos: { circulos: [{ r: 1 }], rayos: [{ ang: 100, color: 'o', grosor: 'contorno', punta: false }, { ang: 170, color: 'o', grosor: 'contorno', punta: false }], segmentos: [{ de: [0, 0.985], a: [-0.174, 0.985], color: 'i', punta: true }, { de: [0, 0.174], a: [-0.985, 0.174], color: 'i', punta: true }], rotulos: [{ x: 0.42, y: 0.95, texto: `cos 100° ≈ ${f(Math.cos(rad(100)))}`, color: 'i' }, { x: -0.5, y: -0.12, texto: `cos 170° ≈ ${f(Math.cos(rad(170)))}`, color: 'i' }], alt: 'Las líneas coseno de 100 y 170 grados apuntan a la izquierda: menos 0,17 y menos 0,98' }, estado: {} },
      coincide: 'Coincide: −0,17 está a la derecha de −0,98.',
      noCoincide: 'Revisemos: las dos flechas apuntan a la izquierda, al lado negativo.',
    },
    mira: {
      datos: {
        ventana: { x: [-1.3, 1.3], y: [-1.4, 1.3] },
        circulos: [{ r: 1 }],
        rayos: [{ ang: 100, color: 'o', grosor: 'contorno', punta: false, desde: 1 }, { ang: 170, color: 'o', grosor: 'contorno', punta: false, desde: 2 }],
        segmentos: [{ de: [0, 0.985], a: [-0.174, 0.985], color: 'i', punta: true, desde: 1 }, { de: [0, 0.174], a: [-0.985, 0.174], color: 'i', punta: true, desde: 2 }, { de: [-0.985, -1.2], a: [1, -1.2], grosor: 'contorno', desde: 3 }],
        puntos: [{ x: -0.174, y: -1.2, color: 'i', rotulo: '−0,17', lado: 'n', desde: 3 }, { x: -0.985, y: -1.2, color: 'i', rotulo: '−0,98', lado: 'n', desde: 3 }, { x: 1, y: -1.2, rotulo: '1', lado: 'n', desde: 3 }],
        alt: 'Las abscisas de 100 y 170 grados llevadas a una recta: menos 0,17 queda a la derecha de menos 0,98',
      },
      voz: 'Lleva cada abscisa a una recta numérica.',
      pasos: [
        { estado: { corte: 1 }, texto: 'cos 100°: una flecha corta hacia la izquierda.', ecuacion: [`cos 100° ≈ ${f(Math.cos(rad(100)))}`] },
        { estado: { corte: 2 }, texto: 'cos 170°: una flecha larga, también hacia la izquierda.', ecuacion: [`cos 170° ≈ ${f(Math.cos(rad(170)))}`] },
        { estado: { corte: 3 }, texto: 'En la recta, el mayor es el que queda más a la derecha.', ecuacion: [`${f(Math.cos(rad(170)))} < ${f(Math.cos(rad(100)))}`] },
      ],
    },
    regla: {
      texto: 'En la C.T., la línea seno es la ordenada de P y la línea coseno es su abscisa, con signo. Se comparan como números, no como largos.',
      ecuacion: ['−1 ≤ sen ', th, ' ≤ 1;  −1 ≤ cos ', th, ' ≤ 1'],
      condicion: 'circunferencia de radio 1 con centro en el origen. Hacia arriba o a la derecha, positivo.',
      voz: 'Un largo dice cuánto; la flecha dice el signo.',
    },
    ahoraTu: {
      voz: 'Ubica las dos flechas y compáralas con signo.',
      generar(sem) {
        const rr = azar(sem), fn = sem % 2 ? 'sen' : 'cos', F = fn === 'sen' ? Math.sin : Math.cos;
        let a = 10 * rr.ent(1, 35), b = 10 * rr.ent(1, 35);
        while (a === b || a % 90 === 0) a += 10;
        while (b === a || b % 90 === 0) b += 10;
        const va = F(rad(a)), vb = F(rad(b));
        const iguales = Math.abs(va - vb) < 1e-9, mayor = va > vb ? a : b, menor = mayor === a ? b : a;
        const vM = F(rad(mayor)), vm = F(rad(menor));
        const bien = iguales ? 'iguales' : `${fn} ${mayor}°`;
        const sif = op => {
          if (op === 'iguales') return { e: 'TRCT-COPIA', s: `Sería cierto con la misma ${fn === 'sen' ? 'ordenada' : 'abscisa'}. Aquí: ${f(va)} y ${f(vb)}.` };
          const v = op === `${fn} ${a}°` ? va : vb;
          if (iguales) return { e: 'TR12', s: `Las dos flechas miden lo mismo y apuntan igual: ${f(va)}.` };
          return Math.abs(v) > Math.abs(vM) ? { e: 'TR12', s: `Su línea sí es más larga. Pero con signo: ${f(vm)} < ${f(vM)}.` } : { e: 'TR10', s: `Sería cierto si ${fn} creciera con el ángulo. Con signo: ${f(vm)} < ${f(vM)}.` };
        };
        const ops = [`${fn} ${a}°`, `${fn} ${b}°`, 'iguales'].filter(o => o !== bien).map((o, i) => ({ id: `d${i}`, valor: o, error: sif(o).e, siFuera: sif(o).s }));
        return {
          pregunta: [`¿Cuál es mayor: ${fn} ${a}° o ${fn} ${b}°?`],
          opciones: opciones(bien, ops, v => (v === 'iguales' ? 'Son iguales' : v)),
          solucion: {
            texto: iguales ? 'Las dos líneas tienen el mismo largo y el mismo signo.' : 'Con signo, el mayor queda más arriba o más a la derecha.',
            ecuacion: [`${fn} ${a}° ≈ ${f(va)};  ${fn} ${b}° ≈ ${f(vb)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 3: tangente y cotangente sobre sus rectas ----------
  // Cambia: el arco θ, de 0° a 360° en pasos de 20° (salta 90° y 270°). · Permanece: la recta tangente x = 1 en A.
  // Progresa: el punto T donde la recta OP corta x = 1. · Se reserva: la línea cotangente sobre y = 1 en 120° (la
  // predicción; el juego no la dibuja). · Debe verse: que la tangente es una ordenada con signo sobre x = 1.
  const VT = { x: [-2.1, 2.1], y: [-2.1, 2.1] };
  function lineaTan(g, conCot, extra = {}) {
    const x = Math.cos(rad(g)), y = Math.sin(rad(g)), tn = tanD(g), ct = cotD(g);
    const enV = v => Number.isFinite(v) && Math.abs(v) <= 2;
    const seg = [], pts = [{ x, y, rotulo: 'P', lado: y >= 0 ? (x >= 0 ? 'no' : 'ne') : 'so' }];
    if (enV(tn)) {
      seg.push({ de: [0, 0], a: [1, tn], grosor: 'contorno', discontinua: true }, { de: [1, 0], a: [1, tn], color: 'd', punta: Math.abs(tn) > 0.05, rotulo: 'tan' });
      pts.push({ x: 1, y: tn, color: 'd', rotulo: 'T', lado: 'e' });
    }
    if (conCot && enV(ct)) {
      seg.push({ de: [0, 0], a: [ct, 1], grosor: 'contorno', discontinua: true }, { de: [0, 1], a: [ct, 1], color: 'd', punta: Math.abs(ct) > 0.05, rotulo: Math.abs(ct) > 0.8 ? 'cot' : undefined });
      pts.push({ x: ct, y: 1, color: 'd', rotulo: Math.abs(ct) > 0.8 ? 'C' : 'C: cot', lado: ct < 0 ? 'no' : 'ne' });
    }
    return Object.assign({
      ventana: VT,
      circulos: [{ r: 1 }],
      rectas: [{ x: 1, color: 'd' }].concat(conCot ? [{ y: 1, color: 'd' }] : []),
      rayos: [{ ang: g, color: 'o', grosor: 'contorno', punta: false }],
      arcos: g ? [{ de: 0, a: g, r: 0.3, color: 'o', rotulo: `${f(g)}°` }] : [],
      segmentos: seg, puntos: pts,
      alt: `Arco de ${f(g)} grados: tangente ${val(tn)}${conCot ? `, cotangente ${val(ct)}` : ''}`,
    }, extra);
  }
  const tangente = {
    id: 'lineas-tangente-cotangente',
    titulo: 'Tangente y cotangente: dos rectas',
    temas: ['Líneas tangente y cotangente'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Gira θ. El radio OP se prolonga hasta la recta x = 1. La flecha verde, de A hasta ese corte T, es la línea tangente.',
      voz: 'Sigue el corte T: sube, baja o desaparece.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 0, max: 360, paso: 20, inicio: 40, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: lineaTan(val.g, false), estado: {} }),
      lectura: v => ['tan ', th, ` = ${val(tanD(v.g))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora la recta OP se prolonga hasta la recta horizontal y = 1, que toca la circunferencia en B. Para θ = 120°, ¿dónde la corta?',
      voz: 'Prolonga el radio en las dos direcciones antes de decidir.',
      opciones: [
        { id: 'c', texto: 'A la izquierda de B', correcta: true },
        { id: 'derecha', texto: 'A la derecha de B', error: 'TR12', siFuera: 'El largo del tramo es correcto, unos 0,58. Pero OP se inclina hacia la izquierda.' },
        { id: 'nunca', texto: 'No la corta', error: 'TRPN-TAN-CERO', siFuera: 'No la cortaría si OP fuera horizontal, en 0° o 180°. En 120° sí la corta.' },
        { id: 'abajo', texto: 'Debajo de A′', error: 'TR11', siFuera: 'Ese corte sería con la recta x = −1. Aquí la recta es y = 1.' },
      ],
      dibujo: { datos: { ventana: VT, circulos: [{ r: 1 }], rectas: [{ y: 1, color: 'd' }], rayos: [{ ang: 120, color: 'o', grosor: 'contorno', punta: false }], arcos: [{ de: 0, a: 120, r: 0.3, color: 'o', rotulo: '120°' }], puntos: [{ x: 0, y: 1, rotulo: 'B', lado: 'ne' }], alt: 'Radio de 120 grados y la recta y igual a 1 que toca la circunferencia en B' }, estado: {} },
      revelar: { datos: lineaTan(120, true), estado: {} },
      coincide: `Coincide: el corte está en x = ${f(cotD(120))}: cot 120° es negativa.`,
      noCoincide: 'Revisemos: la recta OP sube hacia la izquierda.',
    },
    mira: {
      datos: {
        ventana: VT, circulos: [{ r: 1 }],
        rectas: [{ x: 1, color: 'd', desde: 1 }, { y: 1, color: 'd', desde: 3 }],
        rayos: [{ ang: 40, color: 'o', grosor: 'contorno', punta: false }],
        arcos: [{ de: 0, a: 40, r: 0.3, color: 'o', rotulo: '40°' }],
        segmentos: [
          { de: [0, 0], a: [1, tanD(40)], grosor: 'contorno', discontinua: true, desde: 2 }, { de: [1, 0], a: [1, tanD(40)], color: 'd', punta: true, rotulo: 'tan', desde: 2 },
          { de: [Math.cos(rad(40)), 0], a: [Math.cos(rad(40)), Math.sin(rad(40))], color: 'h', desde: 2, hasta: 2 },
          { de: [0, 0], a: [cotD(40), 1], grosor: 'contorno', discontinua: true, desde: 4 }, { de: [0, 1], a: [cotD(40), 1], color: 'd', punta: true, rotulo: 'cot', desde: 4 },
        ],
        puntos: [{ x: Math.cos(rad(40)), y: Math.sin(rad(40)), rotulo: 'P', lado: 'no' }, { x: 1, y: 0, rotulo: 'A', lado: 'se', desde: 1 }, { x: 1, y: tanD(40), color: 'd', rotulo: 'T', lado: 'e', desde: 2 }, { x: 0, y: 1, rotulo: 'B', lado: 'no', desde: 3 }, { x: cotD(40), y: 1, color: 'd', rotulo: 'C', lado: 'n', desde: 4 }],
        alt: 'Arco de 40 grados: la recta OP corta x = 1 en T, a altura tangente, y corta y = 1 en C, a abscisa cotangente',
      },
      voz: 'Dos rectas fijas, un mismo radio prolongado.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La recta x = 1 toca la circunferencia en A.', ecuacion: ['x = 1'] },
        { estado: { corte: 2 }, texto: 'OP prolongada corta esa recta en T: su altura es tan θ.', ecuacion: ['T = (1, tan ', th, ');  ', { frac: ['sen θ', 'cos θ'] }, ' = ', { frac: ['tan θ', '1'] }] },
        { estado: { corte: 3 }, texto: 'La recta y = 1 toca la circunferencia en B.', ecuacion: ['y = 1'] },
        { estado: { corte: 4 }, texto: 'OP corta esa recta en C: su abscisa es cot θ.', ecuacion: ['C = (cot ', th, ', 1)'] },
      ],
    },
    regla: {
      texto: 'La línea tangente es la ordenada del corte de OP con x = 1. La cotangente es la abscisa del corte de OP con y = 1. Las dos llevan signo.',
      ecuacion: ['T = (1, tan ', th, ');  C = (cot ', th, ', 1)'],
      condicion: 'tan no existe si OP es vertical (90°, 270°); cot no existe si OP es horizontal (0°, 180°).',
      voz: 'Cuando OP es paralela a la recta, no hay corte: no hay valor.',
    },
    ahoraTu: {
      voz: 'Prolonga OP y decide de qué lado cae el corte.',
      generar(sem) {
        const rr = azar(sem), g = rr.uno([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]), esTan = sem % 2 === 0;
        const v = esTan ? tanD(g) : cotD(g), e = exacto(v), op = e[0] === '−' ? e.slice(1) : '−' + e;
        const pt = s => (esTan ? `(1, ${s})` : `(${s}, 1)`);
        const otro = exacto(esTan ? cotD(g) : tanD(g));
        return {
          pregunta: [`Para θ = ${g}°, la recta OP corta a la recta ${esTan ? 'x = 1' : 'y = 1'}. ¿En qué punto?`],
          opciones: opciones(pt(e), [
            { id: 'signo', valor: pt(op), error: 'TR12', siFuera: `El largo ${op.replace('−', '')} es correcto. El signo sale del sentido de OP en ${g}°.` },
            { id: 'otra', valor: pt(otro), error: 'TR11', siFuera: `Ese valor es ${esTan ? 'cot' : 'tan'} ${g}°: el corte con la otra recta.` },
            { id: 'nunca', valor: 'No la corta', error: 'TRPN-TAN-CERO', siFuera: `No la cortaría si OP fuera paralela a la recta. En ${g}° no lo es.` },
          ], s => s),
          solucion: {
            texto: `${esTan ? 'tan' : 'cot'} ${g}° = ${e}, y es la ${esTan ? 'ordenada' : 'abscisa'} del corte.`,
            ecuacion: [`${esTan ? 'T' : 'C'} = ${pt(e)}`],
            dibujo: { datos: lineaTan(g, !esTan), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 4: secante y cosecante sobre los ejes ----------
  // Cambia: el arco θ, de 30° en 30°. · Permanece: la C.T. y sus ejes. · Progresa: la recta que toca la
  // circunferencia en P y sus cortes con los ejes. · Se reserva: si sec θ puede valer 0,5 (la predicción).
  // Debe verse: que los cortes quedan siempre fuera de la circunferencia: |sec θ| ≥ 1.
  const VS = { x: [-2.2, 2.2], y: [-2.2, 2.2] };
  function lineaSec(g, extra = {}) {
    const x = Math.cos(rad(g)), y = Math.sin(rad(g)), sc = secD(g), cs = cscD(g);
    const seg = [], pts = [{ x, y, rotulo: 'P', lado: y >= 0 ? (x >= 0 ? 'ne' : 'no') : (x >= 0 ? 'se' : 'so') }], rectas = [];
    if (Number.isFinite(sc) && Number.isFinite(cs)) seg.push({ de: [sc, 0], a: [0, cs], grosor: 'contorno' });
    else if (Number.isFinite(cs)) rectas.push({ y: cs, color: 'h' });
    else rectas.push({ x: sc, color: 'i' });
    if (Number.isFinite(sc)) { seg.push({ de: [0, 0], a: [sc, 0], color: 'i', punta: true }); pts.push({ x: sc, y: 0, color: 'i', rotulo: 'sec', lado: y >= 0 ? 's' : 'n' }); }
    if (Number.isFinite(cs)) { seg.push({ de: [0, 0], a: [0, cs], color: 'h', punta: true }); pts.push({ x: 0, y: cs, color: 'h', rotulo: 'csc', lado: x >= 0 ? 'o' : 'e' }); }
    return Object.assign({
      ventana: VS, circulos: [{ r: 1 }], rectas,
      rayos: [{ ang: g, color: 'o', grosor: 'contorno', punta: false }],
      arcos: g ? [{ de: 0, a: g, r: 0.25, color: 'o' }] : [],
      segmentos: seg, puntos: pts,
      alt: `Arco de ${f(g)} grados: la recta tangente en P corta los ejes en secante ${val(sc)} y cosecante ${val(cs)}`,
    }, extra);
  }
  const secante = {
    id: 'lineas-secante-cosecante',
    titulo: 'Secante y cosecante: los cortes',
    temas: ['Líneas secante y cosecante'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Gira θ. La recta gris toca la circunferencia en P. Su corte con el eje x es sec θ; con el eje y, csc θ.',
      voz: 'Fíjate si algún corte cae dentro de la circunferencia.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 30, max: 330, paso: 30, inicio: 60, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: lineaSec(val.g), estado: {} }),
      lectura: v => ['sec ', th, ` = ${val(secD(v.g))}; csc `, th, ` = ${val(cscD(v.g))}`],
      minimo: 4,
    },
    predice: {
      pregunta: '¿Existe algún ángulo θ con sec θ = 0,5?',
      voz: 'Piensa dónde caería el corte S en el eje x.',
      opciones: [
        { id: 'c', texto: 'No: S siempre queda fuera de la circunferencia', correcta: true },
        { id: 'sesenta', texto: 'Sí: θ = 60°', error: 'TRCT-RANGO', siFuera: 'cos 60° = 0,5, bien recordado. Su recíproca, sec 60°, vale 2.' },
        { id: 'chico', texto: 'Sí: un ángulo cercano a 90°', error: 'TR12', siFuera: 'Cerca de 90° el coseno se acerca a 0, y la secante crece sin tope.' },
      ],
      dibujo: { datos: { ventana: VS, circulos: [{ r: 1 }], puntos: [{ x: 0.5, y: 0, rotulo: '0,5', lado: 's', abierto: true }], alt: 'Circunferencia trigonométrica con el punto 0,5 marcado en el eje x, dentro de ella' }, estado: {} },
      revelar: { datos: lineaSec(60, { puntos: lineaSec(60).puntos.concat([{ x: 0.5, y: 0, rotulo: '0,5', lado: 's', abierto: true }]) }), estado: {} },
      coincide: 'Coincide: la recta que toca en P nunca cruza el interior.',
      noCoincide: 'Revisemos: para cos θ = 0,5, S queda en 2, fuera.',
    },
    mira: {
      datos: Object.assign(lineaSec(60), {
        segmentos: [
          { de: [0, 0], a: [0.5, 0.866], grosor: 'contorno', rotulo: '1', desde: 1 },
          { de: [2, 0], a: [0, 1.155], grosor: 'contorno', desde: 2 },
          { de: [0, 0], a: [2, 0], color: 'i', punta: true, desde: 3 },
          { de: [0, 0], a: [0, 1.155], color: 'h', punta: true, desde: 4 },
        ],
        puntos: [{ x: 0.5, y: 0.866, rotulo: 'P', lado: 'ne' }, { x: 2, y: 0, color: 'i', rotulo: 'S', lado: 's', desde: 3 }, { x: 0, y: 1.155, color: 'h', rotulo: 'K', lado: 'o', desde: 4 }],
        rotulos: [{ x: 0.9, y: -0.5, texto: 'OS = sec θ = 2', color: 'i', desde: 3 }],
      }),
      voz: 'El radio y la recta que toca forman un ángulo recto.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El radio OP mide 1.', ecuacion: ['OP = 1'] },
        { estado: { corte: 2 }, texto: 'La recta que toca en P es perpendicular al radio.', ecuacion: ['OP ⟂ PS'] },
        { estado: { corte: 3 }, texto: 'En el triángulo OPS, cos θ = 1/OS: OS es la secante.', ecuacion: ['OS = ', { frac: ['1', 'cos θ'] }, ' = sec ', th, ' = 2'] },
        { estado: { corte: 4 }, texto: 'Igual en el eje y: OK es la cosecante.', ecuacion: ['OK = ', { frac: ['1', 'sen θ'] }, ` = csc `, th, ` ≈ ${f(cscD(60))}`] },
      ],
    },
    regla: {
      texto: 'La recta que toca la circunferencia en P corta el eje x en sec θ y el eje y en csc θ. Esos cortes nunca caen dentro de la circunferencia.',
      ecuacion: ['sec ', th, ' = ', { frac: ['1', 'cos θ'] }, ';  csc ', th, ' = ', { frac: ['1', 'sen θ'] }, ';  |sec ', th, '| ≥ 1;  |csc ', th, '| ≥ 1'],
      condicion: 'sec no existe si cos θ = 0 (la recta es horizontal); csc no existe si sen θ = 0 (es vertical).',
      voz: 'Recíproca de un número entre −1 y 1: queda fuera de ese tramo.',
    },
    ahoraTu: {
      voz: 'Recuerda en qué tramo vive cada línea.',
      generar(sem) {
        const rr = azar(sem), fn = ['sec', 'csc', 'sen', 'cos'][sem % 4], grande = fn === 'sec' || fn === 'csc';
        const dentro = () => rr.uno([-0.9, -0.7, -0.4, -0.2, 0.3, 0.5, 0.6, 0.8]), fuera = () => rr.uno([-2.5, -1.8, -1.3, 1.2, 1.5, 2, 3]);
        const bien = grande ? fuera() : dentro();
        const malos = [];
        while (malos.length < 3) { const m = grande ? dentro() : fuera(); if (!malos.includes(m)) malos.push(m); }
        const rec = { sec: 'cos', csc: 'sen', sen: 'csc', cos: 'sec' }[fn];
        return {
          pregunta: [`¿Cuál de estos valores puede tomar ${fn} `, th, '?'],
          opciones: opciones(bien, malos.map((m, i) => ({
            id: `d${i}`, valor: m, error: grande ? 'TRCT-RANGO' : 'TR12',
            siFuera: grande ? `${f(m)} sería posible para ${rec} θ, que vive entre −1 y 1. ${fn} es su recíproca.` : `${f(m)} sería posible para ${rec} θ, su recíproca. ${fn} θ vive entre −1 y 1.`,
          })), v => f(v)),
          solucion: {
            texto: grande ? `|${fn} θ| ≥ 1: el corte cae fuera de la circunferencia.` : `${fn} θ es una coordenada de P: entre −1 y 1.`,
            ecuacion: grande ? [`|${fn} `, th, '| ≥ 1'] : [`−1 ≤ ${fn} `, th, ' ≤ 1'],
          },
        };
      },
    },
  };

  // ---------- Idea 5: la variación se lee siguiendo la flecha ----------
  // Cambia: el cuadrante y la línea (seno o coseno). · Permanece: la C.T. · Progresa: la línea al entrar y al salir del
  // cuadrante (punteada y llena). · Se reserva: la tangente en el II (la predicción; el control no la ofrece).
  // Debe verse: que una línea que se acorta puede estar creciendo si es negativa.
  const TABLA = {
    sen: [[0, 1], [1, 0], [0, -1], [-1, 0]], cos: [[1, 0], [0, -1], [-1, 0], [0, 1]],
    tan: [[0, Infinity], [-Infinity, 0], [0, Infinity], [-Infinity, 0]], cot: [[Infinity, 0], [0, -Infinity], [Infinity, 0], [0, -Infinity]],
  };
  const vtx = v => (v === Infinity ? '+∞' : v === -Infinity ? '−∞' : f(v));
  function tramo(fn, q, extra = {}) {
    const g0 = 90 * (q - 1) + 5, g1 = 90 * q - 5, F = fn === 'sen' ? Math.sin : Math.cos, col = fn === 'sen' ? 'h' : 'i';
    const ln = (g, disc, desde) => {
      const x = Math.cos(rad(g)), y = Math.sin(rad(g));
      return fn === 'sen' ? { de: [x, 0], a: [x, y], color: col, punta: true, discontinua: disc, desde } : { de: [0, y], a: [x, y], color: col, punta: true, discontinua: disc, desde };
    };
    return Object.assign({
      circulos: [{ r: 1 }],
      arcos: [{ de: g0, a: g1, r: 1, espiral: 0, color: 'o' }],
      segmentos: [ln(g0, true), ln(g1, false)],
      puntos: [{ x: Math.cos(rad(g0)), y: Math.sin(rad(g0)), abierto: true }, { x: Math.cos(rad(g1)), y: Math.sin(rad(g1)), color: 'o' }],
      alt: `En el cuadrante ${ROM[q]}, ${fn} va de ${f(F(rad(g0)))} a ${f(F(rad(g1)))}`,
    }, extra);
  }
  const variacion = {
    id: 'variacion-cuadrantes',
    titulo: 'Crecer es subir con signo',
    temas: ['Variación de las líneas por cuadrante'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige un cuadrante y una línea. La flecha punteada es al entrar al cuadrante; la llena, al salir. Compara los dos valores.',
      voz: 'Pregunta si el número sube o baja, no si la flecha se alarga.',
      controles: [
        { id: 'q', etiqueta: 'Cuadrante', opciones: [{ valor: 1, texto: 'I' }, { valor: 2, texto: 'II' }, { valor: 3, texto: 'III' }, { valor: 4, texto: 'IV' }] },
        { id: 'fn', etiqueta: 'Línea', opciones: [{ valor: 'sen', texto: 'seno' }, { valor: 'cos', texto: 'coseno' }] },
      ],
      dibujo: val => ({ datos: tramo(val.fn, val.q), estado: {} }),
      lectura: val => { const [a, b] = TABLA[val.fn][val.q - 1]; return [`${val.fn} ${b > a ? 'crece' : 'decrece'}: de ${vtx(a)} a ${vtx(b)}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'En el cuadrante II, de 90° a 180°, ¿cómo varía tan θ?',
      voz: 'Recuerda dónde está la recta x = 1 y hacia dónde va el corte.',
      opciones: [
        { id: 'c', texto: 'Crece, de −∞ a 0', correcta: true },
        { id: 'largo', texto: 'Decrece: su línea se acorta', error: 'TR12', siFuera: 'Su línea sí se acorta. Pero es negativa: de −5 a −1 el número sube.' },
        { id: 'copia', texto: 'Decrece, como el seno en el II', error: 'TRCT-COPIA', siFuera: 'El seno sí decrece en el II. La tangente se lee en otra recta.' },
        { id: 'sentido', texto: 'Decrece, de 0 a −∞', error: 'TRCT-SENTIDO', siFuera: 'Los extremos son correctos. Al avanzar de 90° a 180°, el orden es de −∞ a 0.' },
      ],
      dibujo: { datos: { ventana: { x: [-1.3, 1.5], y: [-3, 1.3] }, circulos: [{ r: 1 }], rectas: [{ x: 1, color: 'd' }], arcos: [{ de: 90, a: 180, r: 1, espiral: 0, color: 'o', rotulo: 'II' }], alt: 'Cuadrante II marcado y la recta tangente x = 1' }, estado: {} },
      revelar: { datos: {
        ventana: { x: [-1.3, 1.5], y: [-3, 1.3] }, circulos: [{ r: 1 }], rectas: [{ x: 1, color: 'd' }],
        arcos: [{ de: 90, a: 180, r: 1, espiral: 0, color: 'o' }],
        segmentos: [110, 135, 160].map(g => ({ de: [0, 0], a: [1, tanD(g)], grosor: 'contorno', discontinua: true })).concat([{ de: [1, tanD(110)], a: [1, tanD(160)], color: 'd', punta: true }]),
        puntos: [110, 135, 160].map(g => ({ x: 1, y: tanD(g), color: 'd', rotulo: `${g}°: ${f(tanD(g))}`, lado: 'e' })),
        alt: 'Tangentes de 110, 135 y 160 grados en la recta x = 1: menos 2,75, menos 1 y menos 0,36; suben hacia 0',
      }, estado: {} },
      coincide: 'Coincide: el corte T sube desde muy abajo hasta A.',
      noCoincide: 'Revisemos: los puntos T van subiendo hacia A.',
    },
    mira: {
      datos: {
        ventana: { x: [-1.3, 1.5], y: [-3, 1.3] }, circulos: [{ r: 1 }], rectas: [{ x: 1, color: 'd' }],
        rayos: [110, 135, 160].map((g, i) => ({ ang: g, color: 'o', grosor: 'contorno', punta: false, desde: i + 1 })),
        segmentos: [110, 135, 160].map((g, i) => ({ de: [0, 0], a: [1, tanD(g)], grosor: 'cuadricula', discontinua: true, desde: i + 1 })),
        puntos: [110, 135, 160].map((g, i) => ({ x: 1, y: tanD(g), color: 'd', rotulo: `${f(tanD(g))}`, lado: 'e', desde: i + 1 })),
        alt: 'Tangentes de 110, 135 y 160 grados: menos 2,75, menos 1 y menos 0,36, cada una más arriba',
      },
      voz: 'Sigue el punto T: ¿sube o baja?',
      pasos: [
        { estado: { corte: 1 }, texto: 'Poco después de 90°, OP corta x = 1 muy abajo.', ecuacion: [`tan 110° ≈ ${f(tanD(110))}`] },
        { estado: { corte: 2 }, texto: 'En 135°, el corte ya subió.', ecuacion: ['tan 135° = −1'] },
        { estado: { corte: 3 }, texto: 'Cerca de 180°, el corte llega casi a A.', ecuacion: [`tan 160° ≈ ${f(tanD(160))}`, ' → 0'] },
      ],
    },
    regla: {
      texto: 'Una línea crece si su extremo sube o va a la derecha, aunque se acorte. En el II, el seno decrece, el coseno decrece y la tangente crece.',
      ecuacion: ['II: sen 1 → 0;  cos 0 → −1;  tan −∞ → 0'],
      condicion: 'θ avanza en sentido antihorario. ∞ indica que la línea crece sin tope: no es un valor.',
      voz: 'Leamos el número con su signo, no el largo de la flecha.',
    },
    ahoraTu: {
      voz: 'Escribe el valor al entrar y al salir del cuadrante.',
      generar(sem) {
        const rr = azar(sem), fn = ['sen', 'cos', 'tan', 'cot'][sem % 4], q = rr.ent(1, 4);
        const [a, b] = TABLA[fn][q - 1], crece = b > a;
        const txt = (c, x, y) => `${c ? 'Crece' : 'Decrece'}, de ${vtx(x)} a ${vtx(y)}`;
        return {
          pregunta: [`En el cuadrante ${ROM[q]}, ¿cómo varía ${fn} `, th, '?'],
          opciones: opciones(txt(crece, a, b), [
            { id: 'sentido', valor: txt(!crece, b, a), error: 'TRCT-SENTIDO', siFuera: `Los extremos son correctos. θ avanza: se entra con ${vtx(a)} y se sale con ${vtx(b)}.` },
            { id: 'abs', valor: txt(Math.abs(b) > Math.abs(a), Math.abs(a), Math.abs(b)), error: 'TR12', siFuera: 'Ese sería el largo de la línea. El valor lleva signo.' },
            { id: 'max', valor: `Crece y luego decrece`, error: 'TRCT-MAXIMO', siFuera: `Eso pasa a lo largo de una vuelta. Dentro del ${ROM[q]}, ${fn} va en un solo sentido.` },
          ], v => v),
          solucion: {
            texto: `Al entrar vale ${vtx(a)} y al salir ${vtx(b)}.`,
            ecuacion: [`${fn}: ${vtx(a)} → ${vtx(b)}`],
          },
        };
      },
    },
  };

  return {
    unidad: 'trigonometria.circunferencia-trigonometrica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js'],
    historia: {
      texto: 'En el siglo XV, Regiomontanus escribió De triangulis, que ordenó lo que se sabía de triángulos planos y esféricos para la astronomía. Sus tablas relacionaban lados y ángulos con muchos cálculos. La circunferencia de radio 1 es una elección moderna: quita el factor de escala y deja leer cada razón como un segmento. El problema sigue siendo el mismo: ver las seis razones juntas sin perder sus signos.',
      pregunta: '¿Qué gana una tabla si el radio vale exactamente 1?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Regiomontanus», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Regiomontanus/' },
    },
    ideas: [arcos, senoCoseno, tangente, secante, variacion],
  };
});
