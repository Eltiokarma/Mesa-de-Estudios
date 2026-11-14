/*
 * Teoría de «Transformaciones y series trigonométricas» (trigonometria.transformaciones-trigonometricas), 5.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 12), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (trigonometría, pp. 82–100) y las «Precisiones de Geometría y Trigonometría» del expediente (precisión 6: la
 * resultante de dos flechas unitarias puede apuntar al revés de la semisuma). Escena previa: plantillas/transformaciones-trig/.
 * Forma: contenido/teoria/trigonometria/angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: sumar razones es sumar flechas; el signo del coseno decide hacia dónde.
 * Colores (regla 4): el primer ángulo A (o α, o el paso x) en naranja (c-o), el segundo B (o β) en turquesa (c-i), lo
 * que resulta de juntarlos (la resultante R, la semisuma, α + β, el último ángulo de una cadena) en rojo (c-h) y el
 * factor de la semidiferencia (2 cos de la semidiferencia, α − β) en verde (c-d).
 * Errores (hipótesis de distractor: docs/investigacion/trigonometria-ideas-erroneas.md no los mide; códigos nuevos
 * de esta unidad): FLECHA-SEMISUMA (la resultante siempre apunta a la semisuma), FLECHA-ANULA, FLECHA-DIFERENCIA,
 * SP-DISTRIB (sen A + sen B = sen(A + B)), SP-CRUCE, SP-SIGNO, PS-COPIA, PS-SIGNO, PS-CRUCE, PS-PRODUCTO,
 * SUM-MULT, SUM-SIGNO, SUM-SIN-DIV, SUM-MITAD, PROD-SUMA, PROD-EXACTO, PROD-SIGNO, PROD-POTENCIA.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: una suma de senos o cosenos es la sombra de una suma de flechas; por eso se vuelve producto.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: pasa de suma a producto y al revés, suma una progresión de senos y reduce una productoria.
 *   Orden de atención: 1.º las flechas A y B · 2.º la resultante roja · acción: mover A y B · fondo: la circunferencia.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué sen A + sen B se vuelve un producto, y cuándo la resultante apunta al revés?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const A_ = { v: 'c-o', t: 'A' }, B_ = { v: 'c-i', t: 'B' }, R_ = { v: 'c-h', t: 'R' };
  const al = { v: 'c-o', t: 'α' }, be = { v: 'c-i', t: 'β' }, x_ = { v: 'c-o', t: 'x' };
  const semis = { frac: [['A + B'], '2'] }, semid = { frac: [['A − B'], '2'] };
  const rad = g => g * Math.PI / 180, deg = r => r * 180 / Math.PI;
  const sen = g => Math.sin(rad(g)), cos = g => Math.cos(rad(g));
  const mod360 = g => ((g % 360) + 360) % 360;
  // Azar con semilla para «Ahora tú» (el de la unidad de referencia).
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un texto se descartan.
  function opciones(correcta, distractores, fmt = v => v) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (d.valor === null || d.valor === undefined) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const semi = { de: -17, a: 197, r: 1, espiral: 0, flecha: false, color: null, grosor: 'contorno' };

  // ---------- Idea 1: dos flechas, un rombo (suma a producto) ----------
  // Cambia: las direcciones A y B de dos flechas de largo 1. · Permanece: el origen, el largo 1 y la circunferencia.
  // Progresa: el rombo y su diagonal roja R, que se acorta al abrir el ángulo entre A y B. · Se reserva: un par que
  // se separa más de 180° (la predicción): R apunta al revés de la semisuma. · Debe verse: |R| = 2 cos de la semidiferencia.
  const resultante = (a, b) => [cos(a) + cos(b), sen(a) + sen(b)];
  function rombo(a, b, ventana, extra = {}) {
    const R = resultante(a, b), s = (a + b) / 2;
    return Object.assign({
      ventana,
      arcos: [ventana.y[0] < -1 ? { de: 0, a: 360, r: 1, espiral: 0, flecha: false, color: null, grosor: 'contorno' } : semi],
      rayos: [{ ang: s, largo: 2.05, grosor: 'contorno', discontinua: true, punta: false }],
      segmentos: [
        { de: [0, 0], a: [cos(a), sen(a)], color: 'o', punta: true },
        { de: [0, 0], a: [cos(b), sen(b)], color: 'i', punta: true },
        { de: [cos(a), sen(a)], a: R, color: 'i', discontinua: true, grosor: 'contorno' },
        { de: [cos(b), sen(b)], a: R, color: 'o', discontinua: true, grosor: 'contorno' },
        ...(Math.hypot(R[0], R[1]) > 0.05 ? [{ de: [0, 0], a: R, color: 'h', punta: true }] : []),
      ],
      puntos: [{ x: cos(a), y: sen(a), color: 'o', rotulo: 'A', lado: 'o' }, { x: cos(b), y: sen(b), color: 'i', rotulo: 'B', lado: 'e' }],
      alt: `Flechas de largo 1 a ${f(a)}° y ${f(b)}°; su suma mide ${f(Math.hypot(R[0], R[1]))} sobre la recta de la semisuma, ${f(s)}°`,
    }, extra);
  }
  const VJ = { x: [-1.3, 2.1], y: [-0.3, 2.1] }, VP = { x: [-1.3, 1.7], y: [-1.3, 1.3] };
  const MA = 20, MB = 80, MR = resultante(MA, MB), MS = 50;
  const sumaProducto = {
    id: 'flechas-rombo',
    titulo: 'Dos flechas, un rombo',
    temas: ['Suma a producto'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Gira las flechas A y B, de largo 1. La roja R es su suma: la diagonal del rombo. La discontinua marca la semisuma.',
      voz: 'Abre y cierra el ángulo entre A y B; mira el largo de R.',
      controles: [
        { id: 'a', etiqueta: 'A', color: 'c-o', min: 0, max: 90, paso: 30, inicio: 30, unidad: '°', decimales: 0 },
        { id: 'b', etiqueta: 'B', color: 'c-i', min: 60, max: 180, paso: 30, inicio: 90, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: rombo(val.a, val.b, VJ), estado: {} }),
      lectura: val => { const R = resultante(val.a, val.b); return ['|', R_, `| = ${f(Math.hypot(R[0], R[1]))} = 2 cos ${f(Math.abs(val.a - val.b) / 2)}°`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Ahora ', A_, ' = 20° y ', B_, ' = 280°. Su semisuma es 150°. ¿Hacia dónde apunta la flecha suma ', R_, '?'],
      voz: 'Mira cuánto se separan A y B antes de decidir.',
      opciones: [
        { id: 'c', texto: 'Hacia 330°, al revés de la semisuma', correcta: true },
        { id: 'semi', texto: 'Hacia 150°, la semisuma', error: 'FLECHA-SEMISUMA', siFuera: 'R va sobre la recta de la semisuma. Pero aquí cos 130° < 0: apunta al revés.' },
        { id: 'anula', texto: 'No apunta: se anulan', error: 'FLECHA-ANULA', siFuera: 'Se anularían si A y B fueran opuestas, a 180°. Aquí se separan 260°.' },
        { id: 'dif', texto: 'Hacia 130°, la semidiferencia', error: 'FLECHA-DIFERENCIA', siFuera: 'La semidiferencia decide el largo de R, no su dirección.' },
      ],
      dibujo: { datos: rombo(20, 280, VP, { segmentos: rombo(20, 280, VP).segmentos.slice(0, 2), rayos: [] }), estado: {} },
      revelar: { datos: rombo(20, 280, VP, { rotulos: [{ x: -1.05, y: 0.75, texto: '150°' }, { x: 1.45, y: -0.55, texto: 'R a 330°', color: 'h' }] }), estado: {} },
      coincide: 'Coincide: 2 cos 130° es negativo, y R apunta al revés de 150°.',
      noCoincide: 'Revisemos el rombo: la diagonal roja está dibujada.',
    },
    mira: {
      datos: {
        ventana: VJ,
        arcos: [semi, { de: MA, a: MS, r: 0.32, color: 'd', espiral: 0, flecha: false, desde: 3 }],
        rayos: [{ ang: MS, largo: 2.05, grosor: 'contorno', discontinua: true, punta: false, desde: 3 }],
        segmentos: [
          { de: [0, 0], a: [cos(MA), sen(MA)], color: 'o', punta: true },
          { de: [0, 0], a: [cos(MB), sen(MB)], color: 'i', punta: true },
          { de: [cos(MA), sen(MA)], a: MR, color: 'i', discontinua: true, grosor: 'contorno', desde: 2 },
          { de: [cos(MB), sen(MB)], a: MR, color: 'o', discontinua: true, grosor: 'contorno', desde: 2 },
          { de: [0, 0], a: MR, color: 'h', punta: true, desde: 2 },
          { de: [0, 0], a: [MR[0] / 2, MR[1] / 2], color: 'd', desde: 4 },
          { de: [MR[0], 0], a: MR, color: 'h', grosor: 'contorno', desde: 5 },
        ],
        puntos: [{ x: cos(MA), y: sen(MA), color: 'o', rotulo: 'A', lado: 'o' }, { x: cos(MB), y: sen(MB), color: 'i', rotulo: 'B', lado: 'e' }],
        rotulos: [{ x: 1.55, y: 0.95, texto: 'R', color: 'h', desde: 2 }, { x: 0.05, y: 0.62, texto: 'cos 30°', color: 'd', ancla: 'end', desde: 4 },
          { x: MR[0] + 0.08, y: MR[1] / 2, texto: 'sen A + sen B', color: 'h', ancla: 'start', desde: 5 }],
        alt: 'Flechas a 20 y 80 grados forman un rombo; la diagonal apunta a 50 grados y mide 2 por coseno de 30',
      },
      voz: 'El rombo hace todo el trabajo: dirección y largo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Dos flechas de largo 1, a 20° y a 80°.', ecuacion: [A_, ' = 20°;   ', B_, ' = 80°'] },
        { estado: { corte: 2 }, texto: 'Su suma es la diagonal del rombo que forman.', ecuacion: [R_, ' = (cos ', A_, ' + cos ', B_, ';  sen ', A_, ' + sen ', B_, ')'] },
        { estado: { corte: 3 }, texto: 'La diagonal parte el ángulo en dos: va a 50°.', ecuacion: ['dirección = ', semis, ' = 50°'] },
        { estado: { corte: 4 }, texto: 'Media diagonal es la sombra de A: cos 30°.', ecuacion: ['|', R_, '| = 2 cos ', semid, ' = 2 cos 30°'] },
        { estado: { corte: 5 }, texto: 'La altura de R es la suma de senos.', ecuacion: ['sen ', A_, ' + sen ', B_, ' = 2 sen 50° · cos 30°'] },
      ],
    },
    regla: {
      texto: 'Una suma de senos o de cosenos es la sombra de dos flechas sumadas: largo 2 cos de la semidiferencia, en la dirección de la semisuma.',
      ecuacion: ['sen ', A_, ' + sen ', B_, ' = 2 sen ', semis, ' cos ', semid, ';   cos ', A_, ' + cos ', B_, ' = 2 cos ', semis, ' cos ', semid],
      condicion: 'cos(semidiferencia) conserva su signo: si es negativo, R apunta al revés. Restas: sen A − sen B = 2 cos(semisuma) sen(semidiferencia).',
      voz: 'Semisuma para la dirección; semidiferencia para el largo y el signo.',
    },
    ahoraTu: {
      voz: 'Calcula semisuma y semidiferencia antes de escribir.',
      generar(sem) {
        const rr = azar(sem);
        // Sin 90° ni 0° entre los ángulos: con cos 90° = 0 dos alternativas valdrían lo mismo.
        let s = 0, d = 0;
        do { s = 10 * rr.ent(3, 8); d = 10 * rr.ent(1, 3); } while (s + d === 90 || s === d || s === 90);
        const a = s + d, b = s - d, tipo = sem % 4;
        const T = [
          { op: `sen ${a}° + sen ${b}°`, bien: `2 sen ${s}° cos ${d}°`, cruce: `2 cos ${s}° sen ${d}°`, signo: `2 sen ${s}° sen ${d}°` },
          { op: `cos ${a}° + cos ${b}°`, bien: `2 cos ${s}° cos ${d}°`, cruce: `2 sen ${s}° cos ${d}°`, signo: `2 sen ${s}° sen ${d}°` },
          { op: `sen ${a}° − sen ${b}°`, bien: `2 cos ${s}° sen ${d}°`, cruce: `2 sen ${s}° cos ${d}°`, signo: `2 cos ${s}° cos ${d}°` },
          { op: `cos ${a}° − cos ${b}°`, bien: `−2 sen ${s}° sen ${d}°`, cruce: `2 cos ${s}° sen ${d}°`, signo: `2 sen ${s}° sen ${d}°` },
        ][tipo];
        const fn = T.op.slice(0, 3);
        return {
          pregunta: [`¿Qué producto es igual a ${T.op}?`],
          opciones: opciones(T.bien, [
            { id: 'distrib', valor: `${fn} ${tipo < 2 ? a + b : a - b}°`, error: 'SP-DISTRIB', siFuera: `Juntar los ángulos sería cierto si ${fn} se repartiera. Las flechas se suman, no los ángulos.` },
            { id: 'cruce', valor: T.cruce, error: 'SP-CRUCE', siFuera: 'Semisuma y semidiferencia están bien; las funciones van en otro orden.' },
            { id: 'signo', valor: T.signo, error: 'SP-SIGNO', siFuera: tipo === 3 ? 'Los factores están bien; la resta de cosenos lleva un menos delante.' : 'Los ángulos están bien; revisa qué función acompaña a cada uno.' },
          ]),
          solucion: { texto: `Semisuma ${s}° y semidiferencia ${d}°.`, ecuacion: [`${T.op} = ${T.bien}`] },
        };
      },
    },
  };

  // ---------- Idea 2: un producto es una suma de dos ondas (producto a suma) ----------
  // Cambia: las frecuencias m y n de dos cosenos. · Permanece: los ejes de 0° a 360°. · Progresa: la onda roja del
  // producto, con un ritmo rápido dentro de uno lento. · Se reserva: su escritura como suma (la predicción).
  // · Debe verse: que 2 cos α cos β es cos(α + β) + cos(α − β): una onda rápida más una lenta.
  const pts = fn => Array.from({ length: 145 }, (_, i) => [i * 2.5, fn(i * 2.5)]);
  const ejesP = (curvas, ymax = 2.2) => ({ x: { min: 0, max: 360, paso: 90, nombre: 'x', unidad: '°', decimales: 0 }, y: { min: -ymax, max: ymax, paso: 1, decimales: 0 }, curvas });
  const productoSuma = {
    id: 'producto-suma',
    titulo: 'Un producto, dos ondas',
    temas: ['Producto a suma'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige m. La onda roja es 2 cos(mx) · cos x. Busca dentro de ella un ritmo rápido y uno lento.',
      voz: 'Cuenta cuántas crestas tiene la roja en una vuelta.',
      controles: [
        { id: 'm', etiqueta: 'm', color: 'c-o', min: 4, max: 7, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: val => ({ datos: ejesP([
        { puntos: pts(x => 2 * cos(x)), color: 'i', discontinua: true },
        { puntos: pts(x => -2 * cos(x)), color: 'i', discontinua: true },
        { puntos: pts(x => 2 * cos(val.m * x) * cos(x)), color: 'h', rotulo: `2 cos ${val.m}x · cos x`, en: [200, 1.9] },
      ]), estado: {} }),
      lectura: val => [`ritmo rápido: cos ${val.m}x; ritmo lento: cos x`],
      minimo: 3,
    },
    predice: {
      pregunta: ['2 cos 3x · cos x es una suma de dos cosenos. ¿Cuál?'],
      voz: 'Piensa en un ritmo más rápido y en uno más lento.',
      opciones: [
        { id: 'c', texto: 'cos 4x + cos 2x', correcta: true },
        { id: 'copia', texto: 'cos 3x + cos x', error: 'PS-COPIA', siFuera: 'Sumar los mismos cosenos sería cierto si se sumaran ondas, no si se multiplican.' },
        { id: 'signo', texto: 'cos 4x − cos 2x', error: 'PS-SIGNO', siFuera: 'Los ángulos 4x y 2x están bien. En x = 0 el producto vale 2: los dos se suman.' },
        { id: 'prod', texto: '2 cos 3x²', error: 'PS-PRODUCTO', siFuera: 'Multiplicar los ángulos no corresponde: los ángulos se suman y se restan.' },
      ],
      dibujo: { datos: ejesP([{ puntos: pts(x => 2 * cos(3 * x) * cos(x)), color: 'h', rotulo: '2 cos 3x · cos x', en: [200, 1.9] }]), estado: {} },
      revelar: { datos: ejesP([{ puntos: pts(x => cos(4 * x)), color: 'h', discontinua: true, rotulo: 'cos 4x', en: [45, 1] }, { puntos: pts(x => cos(2 * x)), color: 'd', discontinua: true, rotulo: 'cos 2x', en: [180, 1] }, { puntos: pts(x => 2 * cos(3 * x) * cos(x)), color: 'h' }]), estado: {} },
      coincide: 'Coincide: la roja es la suma de cos 4x y cos 2x, punto por punto.',
    },
    mira: {
      datos: ejesP([
        { puntos: pts(x => 2 * cos(3 * x) * cos(x)), color: 'h', rotulo: '2 cos 3x · cos x', en: [200, 1.9] },
        { puntos: pts(x => cos(4 * x)), color: 'h', discontinua: true, desde: 2, rotulo: 'cos 4x', en: [45, 1] },
        { puntos: pts(x => cos(2 * x)), color: 'd', discontinua: true, desde: 3, rotulo: 'cos 2x', en: [100, -1.05] },
      ]),
      voz: 'Dos fórmulas de suma, sumadas: los senos se cancelan.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El producto de dos cosenos tiene dos ritmos.', ecuacion: ['2 cos ', al, ' cos ', be, ',  con ', al, ' = 3x y ', be, ' = x'] },
        { estado: { corte: 2 }, texto: 'El coseno de la suma es el ritmo rápido.', ecuacion: ['cos(', al, ' + ', be, ') = cos ', al, ' cos ', be, ' − sen ', al, ' sen ', be] },
        { estado: { corte: 3 }, texto: 'El coseno de la diferencia es el lento.', ecuacion: ['cos(', al, ' − ', be, ') = cos ', al, ' cos ', be, ' + sen ', al, ' sen ', be] },
        { estado: { corte: 3 }, texto: 'Al sumarlos, los senos se cancelan.', ecuacion: ['2 cos 3x cos x = cos 4x + cos 2x'] },
      ],
    },
    regla: {
      texto: 'Un producto de dos razones se escribe como suma de dos razones: una del ángulo suma y otra del ángulo diferencia.',
      ecuacion: ['2 cos ', al, ' cos ', be, ' = cos(', al, ' + ', be, ') + cos(', al, ' − ', be, ');   2 sen ', al, ' cos ', be, ' = sen(', al, ' + ', be, ') + sen(', al, ' − ', be, ')'],
      condicion: 'α y β en la misma unidad. Con dos senos: 2 sen α sen β = cos(α − β) − cos(α + β).',
      voz: 'Multiplicar ondas es sumar sus ángulos y restarlos.',
    },
    ahoraTu: {
      voz: 'Primero el ángulo suma y el ángulo diferencia.',
      generar(sem) {
        const rr = azar(sem);
        const a = 10 * rr.ent(4, 8), b = 10 * rr.ent(1, 3), s = a + b, d = a - b;
        const tipo = sem % 3, F = [['cos', 'cos'], ['sen', 'cos'], ['sen', 'sen']][tipo];
        const T = [
          { op: `2 cos ${a}° cos ${b}°`, bien: `cos ${s}° + cos ${d}°`, signo: `cos ${s}° − cos ${d}°`, cruce: `sen ${s}° + sen ${d}°` },
          { op: `2 sen ${a}° cos ${b}°`, bien: `sen ${s}° + sen ${d}°`, signo: `sen ${s}° − sen ${d}°`, cruce: `cos ${s}° + cos ${d}°` },
          { op: `2 sen ${a}° sen ${b}°`, bien: `cos ${d}° − cos ${s}°`, signo: `cos ${s}° − cos ${d}°`, cruce: `sen ${d}° − sen ${s}°` },
        ][tipo];
        return {
          pregunta: [`¿Qué suma es igual a ${T.op}?`],
          opciones: opciones(T.bien, [
            { id: 'copia', valor: `${F[0]} ${a}° + ${F[1]} ${b}°`, error: 'PS-COPIA', siFuera: 'Sumar los mismos factores sería cierto si se sumaran, no si se multiplican.' },
            { id: 'signo', valor: T.signo, error: 'PS-SIGNO', siFuera: tipo === 2 ? 'Los ángulos están bien; con dos senos va la diferencia menos la suma.' : 'Los ángulos están bien; aquí los dos términos se suman.' },
            { id: 'cruce', valor: T.cruce, error: 'PS-CRUCE', siFuera: tipo === 1 ? 'Los ángulos están bien; seno por coseno da senos.' : 'Los ángulos están bien; con dos factores iguales salen cosenos.' },
          ]),
          solucion: { texto: `Ángulo suma ${s}° y ángulo diferencia ${d}°.`, ecuacion: [`${T.op} = ${T.bien}`] },
        };
      },
    },
  };

  // ---------- Idea 3: una cadena de flechas (sumatorias) ----------
  // Cambia: el paso x y la cantidad n de flechas, cada una girada x más que la anterior. · Permanece: el largo 1.
  // Progresa: la cadena que se dobla como un polígono regular. · Se reserva: la cadena que se cierra (la predicción).
  // · Debe verse: que la suma de senos es la altura de la cuerda roja, y que una cadena cerrada suma 0.
  function cadena(x, n, extra = {}) {
    const segs = [];
    let P = [0, 0];
    for (let k = 1; k <= n; k++) {
      const Q2 = [P[0] + cos(k * x), P[1] + sen(k * x)];
      segs.push({ de: P, a: Q2, color: k === 1 ? 'o' : null, grosor: k === 1 ? undefined : 'contorno', punta: true });
      P = Q2;
    }
    const ys = [0], xs = [0];
    let q = [0, 0];
    for (let k = 1; k <= n; k++) { q = [q[0] + cos(k * x), q[1] + sen(k * x)]; xs.push(q[0]); ys.push(q[1]); }
    const pad = 0.35, x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
    const L = Math.hypot(P[0], P[1]);
    return Object.assign({
      ventana: { x: [Math.min(x0, -0.6), Math.max(x1, 0.6)], y: [Math.min(y0, -0.4), Math.max(y1, 0.6)] },   // se fija desde fuera en el juego
      segmentos: [...segs, ...(L > 0.05 ? [{ de: [0, 0], a: P, color: 'h', punta: true }, { de: [P[0], 0], a: P, color: 'h', grosor: 'contorno', discontinua: true }] : [])],
      arcos: [{ de: 0, a: x, r: 0.3, color: 'o', espiral: 0, flecha: false, rotulo: 'x' }],
      alt: `${n} flechas de largo 1, cada una girada ${f(x)}° más; la suma de sus alturas es ${f(P[1])}`,
    }, extra);
  }
  // Ventana fija del juego: la que contiene todas las cadenas posibles (x de 20° a 40°, n de 2 a 6).
  const VC = (() => {
    const v = { x: [-0.6, 0.6], y: [-0.4, 0.6] };
    for (const x of [20, 30, 40]) for (let n = 2; n <= 6; n++) {
      const w = cadena(x, n).ventana;
      v.x = [Math.min(v.x[0], w.x[0]), Math.max(v.x[1], w.x[1])]; v.y = [Math.min(v.y[0], w.y[0]), Math.max(v.y[1], w.y[1])];
    }
    return v;
  })();
  const sumaSen = (x, n) => Array.from({ length: n }, (_, k) => sen((k + 1) * x)).reduce((s, v) => s + v, 0);
  // Centro de la circunferencia que pasa por los vértices de la cadena (x = 40°, n = 5).
  const MX = 40, MN = 5;
  const MV = (() => { const v = [[0, 0]]; for (let k = 1; k <= MN; k++) v.push([v[k - 1][0] + cos(k * MX), v[k - 1][1] + sen(k * MX)]); return v; })();
  const rho = 1 / (2 * sen(MX / 2));
  // Circuncentro de los tres primeros vértices (los demás están a la misma distancia: polígono regular).
  const MC = (() => {
    const [[ax, ay], [bx, by], [cx, cy]] = MV, d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
    const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
    const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
    return [ux, uy];
  })();
  const sumatoria = {
    id: 'cadena-flechas',
    titulo: 'Una cadena de flechas',
    temas: ['Sumatorias de senos y cosenos'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Pon n flechas de largo 1, cada una girada x más que la anterior. La roja une el inicio con el final.',
      voz: 'La altura de la roja es la suma de todos los senos.',
      controles: [
        { id: 'x', etiqueta: 'x', color: 'c-o', min: 20, max: 40, paso: 10, inicio: 30, unidad: '°', decimales: 0 },
        { id: 'n', etiqueta: 'n', min: 2, max: 6, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: val => ({ datos: cadena(val.x, val.n, { ventana: VC }), estado: {} }),
      lectura: val => [`sen x + … + sen ${val.n}x = ${f(sumaSen(val.x, val.n))}; la roja mide ${f(sen(val.n * val.x / 2) / sen(val.x / 2))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Con ', x_, ' = 60° y seis flechas, ¿cuánto vale sen 60° + sen 120° + … + sen 360°?'],
      voz: 'Imagina adónde llega la sexta flecha.',
      opciones: [
        { id: 'c', texto: '0', correcta: true },
        { id: 'mult', texto: 'Cerca de 5,2: seis veces sen 60°', error: 'SUM-MULT', siFuera: 'Seis veces sen 60° sería cierto si las seis flechas apuntaran igual. Cada una gira 60°.' },
        { id: 'signo', texto: 'Cerca de 1,73: las tres primeras', error: 'SUM-SIGNO', siFuera: 'Las tres primeras suman 1,73. Pero sen 240° y sen 300° son negativos y las cancelan.' },
        { id: 'uno', texto: '1', error: 'SUM-MULT', siFuera: 'Una flecha mide 1, pero la suma depende de dónde termina la cadena.' },
      ],
      dibujo: { datos: cadena(60, 1, { segmentos: cadena(60, 1).segmentos.slice(0, 1), ventana: cadena(60, 6).ventana }), estado: {} },
      revelar: { datos: cadena(60, 6), estado: {} },
      coincide: 'Coincide: las seis flechas cierran un hexágono y vuelven al origen.',
      noCoincide: 'Revisemos la cadena: las seis flechas vuelven al punto de partida.',
    },
    mira: {
      datos: Object.assign(cadena(MX, MN), {
        ventana: { x: [MC[0] - rho - 0.1, 1.3], y: [-0.4, 3.2] },
        circulos: [{ cx: MC[0], cy: MC[1], r: rho, discontinua: true, desde: 2 }],
        segmentos: [...cadena(MX, MN).segmentos.slice(0, MN).map(s => Object.assign({}, s)),
          Object.assign({}, cadena(MX, MN).segmentos[MN], { desde: 3 }), Object.assign({}, cadena(MX, MN).segmentos[MN + 1], { desde: 5 })],
        rayos: [{ ang: (MN + 1) * MX / 2, largo: 1.2, grosor: 'contorno', discontinua: true, punta: false, desde: 4, rotulo: `${(MN + 1) * MX / 2}°` }],
        puntos: [{ x: MC[0], y: MC[1], desde: 2 }],
      }),
      voz: 'Cada flecha gira lo mismo: la cadena es parte de un polígono regular.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cinco flechas, cada una girada 40° más.', ecuacion: ['ángulos: 40°, 80°, 120°, 160°, 200°'] },
        { estado: { corte: 2 }, texto: 'Sus extremos están en una circunferencia: es un polígono regular.', ecuacion: ['radio = ', { frac: ['1', '2 sen 20°'] }] },
        { estado: { corte: 3 }, texto: 'La roja es una cuerda que abarca 5 · 40° = 200°.', ecuacion: ['|R| = ', { frac: ['sen 100°', 'sen 20°'] }] },
        { estado: { corte: 4 }, texto: 'Apunta al ángulo medio entre el primero y el último.', ecuacion: [{ frac: ['40° + 200°', '2'] }, ' = 120°'] },
        { estado: { corte: 5 }, texto: 'Su altura es la suma de los cinco senos.', ecuacion: ['Σ sen = ', { frac: ['sen 100°', 'sen 20°'] }, ` · sen 120° ≈ ${f(sumaSen(MX, MN))}`] },
      ],
    },
    regla: {
      texto: 'n senos cuyos ángulos avanzan r suman la cuerda del polígono por el seno del ángulo medio entre el primero P y el último U.',
      ecuacion: ['sen P + … + sen U = ', { frac: [['sen ', { frac: ['n r', '2'] }], ['sen ', { frac: ['r', '2'] }]] }, ' · sen ', { frac: ['P + U', '2'] }],
      condicion: 'sen(r/2) ≠ 0, es decir, r no es múltiplo de 360°. Con cosenos, el último factor es cos((P + U)/2).',
      voz: 'Cuerda por seno del medio; y nunca dividas entre cero.',
    },
    ahoraTu: {
      voz: 'Cuenta primero cuántos términos hay.',
      generar(sem) {
        const rr = azar(sem);
        const r = 2 * rr.ent(2, 10), n = rr.ent(4, 9), P = 2 * rr.ent(1, 20), U = P + (n - 1) * r;
        const esSen = sem % 2 === 0, fn = esSen ? 'sen' : 'cos';
        const nr2 = n * r / 2, r2 = r / 2, m = (P + U) / 2;
        const fmt = (a, b, c) => `sen ${a}° · ${fn} ${c}° / sen ${b}°`;
        return {
          pregunta: [`¿Cuánto vale ${fn} ${P}° + ${fn} ${P + r}° + … + ${fn} ${U}°, con ${n} términos?`],
          opciones: opciones(fmt(nr2, r2, m), [
            { id: 'mitad', valor: fmt(n * r, r, m), error: 'SUM-MITAD', siFuera: 'La forma es buena, pero en la cuerda van las mitades: nr/2 y r/2.' },
            { id: 'sindiv', valor: `sen ${nr2}° · ${fn} ${m}°`, error: 'SUM-SIN-DIV', siFuera: 'El numerador está bien; la cuerda se divide entre sen(r/2).' },
            { id: 'mult', valor: `${n} ${fn} ${m}°`, error: 'SUM-MULT', siFuera: `${n} veces el término medio sería cierto si todas las flechas apuntaran igual.` },
          ]),
          solucion: { texto: `n = ${n}, r = ${r}° y ángulo medio ${m}°.`, ecuacion: [{ frac: [`sen(${n} · ${r}°/2)`, `sen(${r}°/2)`] }, ` · ${fn} ${m}° = ${fmt(nr2, r2, m)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: doblar y doblar (productorias) ----------
  // Cambia: el ángulo x y cuántos cosenos se multiplican (cada ángulo es el doble del anterior). · Permanece: la
  // circunferencia. · Progresa: la cadena de rayos x, 2x, 4x… · Se reserva: x = 20° con tres factores (la predicción).
  // · Debe verse: que el producto es la altura del último doble entre 2ⁿ veces la primera altura.
  const potencia = n => 2 ** n;
  function dobles(x, n, extra = {}) {
    const ult = potencia(n) * x;
    const rayos = [{ ang: 0, largo: 1, grosor: 'contorno' }];
    for (let k = 0; k < n; k++) rayos.push({ ang: potencia(k) * x, color: k === 0 ? 'o' : null, grosor: k === 0 ? undefined : 'contorno' });
    rayos.push({ ang: ult, color: 'h' });
    return Object.assign({
      circulos: [{ r: 1 }],
      rayos,
      segmentos: [{ de: [cos(x), 0], a: [cos(x), sen(x)], color: 'o', rotulo: 'sen x' }, { de: [cos(ult), 0], a: [cos(ult), sen(ult)], color: 'h', rotulo: `sen ${potencia(n)}x` }],
      alt: `Rayos que doblan el ángulo desde ${f(x)}° hasta ${f(ult)}°; la última altura es ${f(sen(ult))} y la primera ${f(sen(x))}`,
    }, extra);
  }
  const prodCos = (x, n) => Array.from({ length: n }, (_, k) => cos(potencia(k) * x)).reduce((p, v) => p * v, 1);
  const productoria = {
    id: 'doblar-y-doblar',
    titulo: 'Doblar y doblar',
    temas: ['Productorias trigonométricas'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige x y cuántos cosenos multiplicar: cos x · cos 2x · cos 4x… Cada rayo dobla al anterior. Compara el producto con las alturas.',
      voz: 'Mira la primera altura y la del último doble.',
      controles: [
        { id: 'x', etiqueta: 'x', color: 'c-o', min: 15, max: 75, paso: 15, inicio: 15, unidad: '°', decimales: 0 },
        { id: 'n', etiqueta: 'factores', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => ({ datos: dobles(val.x, val.n), estado: {} }),
      lectura: val => [`producto ${f(prodCos(val.x, val.n), 3)}; sen ${potencia(val.n)}x/(${potencia(val.n)} sen x) = ${f(sen(potencia(val.n) * val.x) / (potencia(val.n) * sen(val.x)), 3)}`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuánto vale cos 20° · cos 40° · cos 80°?',
      voz: 'Usa lo que viste entre el producto y las dos alturas.',
      opciones: [
        { id: 'c', texto: '1/8', correcta: true },
        { id: 'suma', texto: 'cos 140°', error: 'PROD-SUMA', siFuera: 'Sumar ángulos sería cierto con flechas que se encadenan. Aquí los cosenos se multiplican.' },
        { id: 'exacto', texto: 'No tiene un valor exacto', error: 'PROD-EXACTO', siFuera: 'Cada factor solo no es exacto, pero el producto sí: las alturas de 20° y 160° son iguales.' },
        { id: 'potencia', texto: '1/6', error: 'PROD-POTENCIA', siFuera: 'Se divide entre 2 por cada factor: 2 · 2 · 2 = 8, no 2 · 3.' },
      ],
      dibujo: { datos: dobles(20, 3, { rayos: dobles(20, 3).rayos.slice(0, 4), segmentos: [] }), estado: {} },
      revelar: { datos: dobles(20, 3), estado: {} },
      coincide: 'Coincide: sen 160° = sen 20°, y el producto es 1/8.',
    },
    mira: {
      datos: Object.assign(dobles(20, 3), {
        rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: 20, color: 'o' }, { ang: 40, grosor: 'contorno', desde: 2 }, { ang: 80, grosor: 'contorno', desde: 3 }, { ang: 160, color: 'h', desde: 4 }],
        segmentos: [{ de: [cos(20), 0], a: [cos(20), sen(20)], color: 'o', rotulo: 'sen 20°', desde: 1 }, { de: [cos(160), 0], a: [cos(160), sen(160)], color: 'h', rotulo: 'sen 160°', desde: 4 }],
      }),
      voz: 'Un seno de ayuda, y el doble aparece una y otra vez.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se multiplica y divide entre sen 20°, que no es cero.', ecuacion: ['P = ', { frac: ['sen 20° cos 20° cos 40° cos 80°', 'sen 20°'] }] },
        { estado: { corte: 2 }, texto: 'sen 20° cos 20° es la mitad de sen 40°.', ecuacion: ['P = ', { frac: ['sen 40° cos 40° cos 80°', '2 sen 20°'] }] },
        { estado: { corte: 3 }, texto: 'Otra vez: sen 40° cos 40° es la mitad de sen 80°.', ecuacion: ['P = ', { frac: ['sen 80° cos 80°', '4 sen 20°'] }, ' = ', { frac: ['sen 160°', '8 sen 20°'] }] },
        { estado: { corte: 4 }, texto: 'sen 160° = sen 20°: las dos alturas son iguales.', ecuacion: ['P = ', { frac: ['1', '8'] }] },
      ],
    },
    regla: {
      texto: 'Un producto de cosenos en que cada ángulo dobla al anterior se reduce con sen 2θ = 2 sen θ cos θ, aplicado una vez por factor.',
      ecuacion: ['cos ', x_, ' · cos 2', x_, ' ⋯ cos ', { sup: ['2', 'n−1'] }, x_, ' = ', { frac: [['sen ', { sup: ['2', 'n'] }, x_], [{ sup: ['2', 'n'] }, ' sen ', x_]] }],
      condicion: 'sen x ≠ 0. Si sen x = 0, la fórmula divide entre cero: se multiplica directamente.',
      voz: 'Un factor, un doble y una mitad.',
    },
    ahoraTu: {
      voz: 'Cuenta los factores: cada uno aporta un 2.',
      generar(sem) {
        const rr = azar(sem);
        // [numerador y denominador de x en π, cantidad de factores]
        const [p, q, n] = rr.uno([[1, 5, 2], [2, 5, 2], [1, 3, 2], [1, 9, 3], [2, 9, 3], [1, 7, 3], [2, 7, 3], [1, 15, 4], [1, 17, 4], [2, 17, 4]]);
        const x = p * 180 / q, val = prodCos(x, n), den = potencia(n);
        const sg = val > 0 ? 1 : -1;
        const mcd = (u, v) => (v ? mcd(v, u % v) : u);
        const piTxt = k => { const a = k * p, g = mcd(a, q), nu = a / g, de = q / g; return `${nu === 1 ? '' : nu}π${de === 1 ? '' : '/' + de}`; };
        const factores = Array.from({ length: n }, (_, k) => `cos ${piTxt(potencia(k))}`).join(' · ');
        const fr = (s, d) => `${s < 0 ? '−' : ''}1/${d}`;
        return {
          pregunta: [`¿Cuánto vale ${factores}?`],
          opciones: opciones(fr(sg, den), [
            { id: 'signo', valor: fr(-sg, den), error: 'PROD-SIGNO', siFuera: `El ${den} está bien. Revisa el signo: sen(${den}x) y sen x ${sg > 0 ? 'son iguales' : 'son opuestos'}.` },
            { id: 'pot', valor: fr(sg, den / 2), error: 'PROD-POTENCIA', siFuera: `Cada factor aporta un 2: con ${n} factores es ${den}.` },
            { id: 'pot2', valor: fr(sg, 2 * den), error: 'PROD-POTENCIA', siFuera: `Son ${n} factores: el divisor es 2 elevado a ${n}, ${den}.` },
          ]),
          solucion: { texto: `sen ${den}x ${sg > 0 ? 'es igual a' : 'es opuesto a'} sen x.`, ecuacion: [{ frac: [`sen(${den} · ${piTxt(1)})`, `${den} sen ${piTxt(1)}`] }, ` = ${fr(sg, den)}`] },
        };
      },
    },
  };

  return {
    unidad: 'trigonometria.transformaciones-trigonometricas',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Antes de las calculadoras, multiplicar números largos era lento. Alrededor del observatorio de Tycho Brahe circuló la prostaféresis: cambiar un producto de cosenos por una suma de dos cosenos que se buscaban en tablas. Varios la usaron y se disputaron la prioridad, así que no tiene un solo inventor. La misma igualdad hoy reorganiza expresiones sin cambiar su valor.',
      pregunta: '¿Por qué sumar sería más fácil que multiplicar?',
      fuente: { titulo: 'Adam Mosley, «Tycho Brahe and Mathematical Techniques», Starry Messenger, University of Cambridge', url: 'https://www.sites.hps.cam.ac.uk/starry/tychomaths.html' },
    },
    ideas: [sumaProducto, productoSuma, sumatoria, productoria],
  };
});
