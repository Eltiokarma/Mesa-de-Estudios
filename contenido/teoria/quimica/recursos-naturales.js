/*
 * Teoría de «Recursos naturales» (quimica.recursos-naturales). Molde: docs/teoria.md y contenido/teoria/quimica/materia-y-energia.js.
 * Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 19), historia-ecuaciones-2.pdf y las precisiones de
 * Química del expediente: una fracción del petróleo es una mezcla con un intervalo de ebullición, no un punto;
 * destilar separa y craquear transforma; la ley mineral no es la pureza del metal; el octanaje no es un porcentaje de
 * octano ni la energía por litro. Sin cifras de producción peruana: exigen fuente oficial y año (no se ponen).
 * Errores: docs/investigacion/quimica-ambiente-ideas-erroneas.md (QA); los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: distinguir separar de transformar en el petróleo, leer el octanaje, cuidar el oxígeno de una combustión
 *     y calcular cuánto metal sale de una mena.
 *   Persona y condiciones: postulante de 4.º, celular de 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: dice si un proceso separa o transforma, qué mezcla de referencia tiene un octanaje, qué
 *     sale de una combustión con poco oxígeno y la masa de metal de una mena con su ley y recuperación.
 *   Orden de atención: 1.º la figura · 2.º la lectura en vivo · acción: probar casos · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿la torre fabrica gasolina?, ¿95 octanos es 95 % de algo?, ¿ley 1 % da metal al 1 %?
 *
 * Colores (regla 4): temperatura T rojo c-h; en la combustión, O₂ rojo y C tinta como átomos; masa de mena m
 * turquesa c-i, ley w naranja c-o, recuperación r verde c-d. Isooctano naranja lleno y heptano turquesa hueco.
 * Intervalos de ebullición de las fracciones: aproximados (varían con el crudo y la refinería; no verificados contra
 * una tabla oficial): gases hasta 30 °C, gasolina 30–200, queroseno 150–275, diésel 250–350, residuo sobre 350 °C.
 * Fuentes (no van al alumno): EIA, The refining process y Octane in depth; OpenStax Chemistry 2e §18.2 y §19.1;
 * EPA AP-42 §12.6 (plomo).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const Tt = { v: 'c-h', t: 'T' }, m = { v: 'c-i', t: 'm' }, w = { v: 'c-o', t: 'w' }, r = { v: 'c-d', t: 'r' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const x = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    x.ent = (lo, hi) => lo + Math.floor(x() * (hi - lo + 1));
    x.de = l => l[Math.floor(x() * l.length)];
    return x;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Idea 1: destilar separa, craquear transforma ----------
  // Cambia: la temperatura de un plato de la torre · Permanece: los cinco intervalos de ebullición · Progresa: de los
  // gases arriba (fríos) al residuo abajo (caliente) · Se reserva: el craqueo, que sí cambia moléculas · Debe verse:
  // que los intervalos se traslapan (cada fracción es una mezcla).
  const FRAC = [
    { n: 'gases', a: null, b: 30, ca: false, cb: true }, { n: 'gasolina', a: 30, b: 200, ca: true, cb: true },
    { n: 'queroseno', a: 150, b: 275, ca: true, cb: true }, { n: 'diésel', a: 250, b: 350, ca: true, cb: true }, { n: 'residuo', a: 350, b: null, ca: true, cb: false },
  ];
  const torre = (extra = [], rot = true) => ({
    min: 0, max: 400, paso: 50, cada: 2, variable: 'T', color: 'h', sufijo: ' °C', decimales: 0, filas: 5,
    elementos: [...FRAC.map((x, i) => ({ tipo: 'intervalo', a: x.a, b: x.b, ca: x.ca, cb: x.cb, color: i % 2 ? 'i' : 'o', rotulo: rot ? x.n : undefined, fila: i + 1 })), ...extra],
    alt: 'Intervalos de ebullición aproximados de las fracciones del petróleo: gases hasta 30 °C, gasolina 30 a 200, queroseno 150 a 275, diésel 250 a 350 y residuo sobre 350 °C. Se traslapan: cada fracción es una mezcla.',
  });
  // Geometría de la recta de la torre (min 0, max 400): x(T) y su inversa, para el gesto directo.
  const GR = () => Kit.piezas.recta.geometria(torre());
  const tDeX = x => { const g = GR(); return 400 * (x - g.x(0)) / (g.x(400) - g.x(0)); };
  const hierven = t => FRAC.filter(x => (x.a === null || t >= x.a) && (x.b === null || t <= x.b)).map(x => x.n);
  const destilar = {
    id: 'destilar-separa',
    titulo: 'Destilar separa, craquear transforma',
    temas: ['Petróleo y refinación'],
    pieza: 'recta',
    juega: {
      // Animación (decisión de Gerson, 15 nov): la temperatura recorre la torre de 0 a 400 °C y vuelve, en 8 s por tramo.
      consigna: 'La temperatura del plato sube y baja sola por la torre. Mira qué fracciones hierven en cada momento: los tramos se traslapan.',
      voz: 'Fíjate en que cada fracción ocupa un tramo, no un punto.',
      controles: [{ id: 't', etiqueta: 'T', color: 'c-h', min: 0, max: 400, paso: 25, inicio: 100, unidad: '°C', decimales: 0, auto: { velocidad: 50, modo: 'rebota' } }],
      dibujo: val => ({ datos: torre([{ tipo: 'punto', x: val.t, color: 'h', rotulo: `${f(val.t, 0)} °C`, fila: 0 }]), estado: {} }),
      lectura: val => [`A ${f(val.t, 0)} °C hierven: ${hierven(val.t).join(' y ') || 'ninguna'}.`],
      minimo: 3,
      // Se agarra el punto del plato y se corre por el eje de temperatura: las fracciones que hierven responden.
      arrastres: [{ id: 'plato', etiqueta: 'temperatura del plato', color: 'c-h',
        donde: val => ({ x: GR().x(val.t), y: GR().filaY(0) }),
        mover: pt => ({ t: tDeX(pt.x) }) }],
    },
    predice: {
      pieza: 'quim-cadena',
      pregunta: 'En la torre de destilación, ¿cambian las moléculas del petróleo?',
      voz: 'Piensa en qué hace el calor en una destilación.',
      opciones: [
        { id: 'c', texto: 'No: separa las moléculas que ya estaban, por su volatilidad', correcta: true },
        { id: 'fabrica', texto: 'Sí: el calor fabrica gasolina a partir del crudo', error: 'QA13', siFuera: 'Fabricar gasolina nueva es craquear. En la torre solo se separa la que ya venía.' },
        { id: 'pura', texto: 'No, y cada fracción sale como una sustancia pura', error: 'QM-FRACCION-PURA', siFuera: 'No cambian, bien. Pero cada fracción es una mezcla que hierve en un intervalo.' },
      ],
      dibujo: { datos: { columnas: [{ titulo: 'Destilación', color: 'i', nodos: [{ texto: 'petróleo crudo: mezcla' }, { texto: 'calentar en la torre' }] }] }, estado: {} },
      revelar: { datos: { columnas: [{ titulo: 'Destilación', color: 'i', nodos: [{ texto: 'petróleo crudo: mezcla' }, { texto: 'calentar en la torre' }, { texto: 'fracciones: mezclas con las mismas moléculas' }] }] }, estado: {} },
      coincide: 'Coincide: la destilación separa por volatilidad; las moléculas no cambian.',
      noCoincide: 'La destilación solo separa: cada fracción trae moléculas que ya estaban.',
    },
    // Hallazgo 9 de la auditoría: son dos representaciones a propósito. La recta muestra los intervalos de un plato a
    // la vez; la cadena pone lado a lado separar y craquear, que la recta no puede mostrar (no hay temperatura que
    // fabrique moléculas nuevas).
    mira: {
      pieza: 'quim-cadena',
      datos: { columnas: [
        { titulo: 'Destilar', color: 'i', nodos: [{ texto: 'crudo', desde: 1 }, { texto: 'torre: separa por volatilidad', desde: 1 }, { texto: 'mismas moléculas, en fracciones', desde: 2 }] },
        { titulo: 'Craquear', color: 'o', nodos: [{ texto: 'C₁₀H₂₂ (pesada)', desde: 3 }, { texto: 'calor y catalizador', desde: 3 }, { texto: 'C₈H₁₈ + C₂H₄', desde: 4 }] },
      ] },
      voz: 'Comparemos las dos columnas paso a paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El crudo entra caliente a la torre y sube como vapor.' },
        { estado: { corte: 2 }, texto: 'Cada plato condensa lo que hierve en su intervalo: se separa.' },
        { estado: { corte: 3 }, texto: 'Si sobra fracción pesada, se craquea con calor y catalizador.' },
        { estado: { corte: 4 }, texto: 'El craqueo rompe moléculas: aparecen sustancias nuevas.', ecuacion: ['C₁₀H₂₂ → C₈H₁₈ + C₂H₄'] },
        { estado: { corte: 4 }, texto: 'El reformado reacomoda moléculas sin romperlas en dos.' },
      ],
    },
    regla: {
      texto: 'La destilación fraccionada separa el crudo en fracciones que hierven en intervalos; no cambia moléculas. El craqueo y el reformado sí las transforman.',
      ecuacion: ['separar ≠ transformar', '   ·   ', { llave: ['C₁₀H₂₂ → C₈H₁₈ + C₂H₄'], nota: 'craqueo' }],
      condicion: 'cada fracción es una mezcla de muchos hidrocarburos; sus intervalos dependen del crudo y se traslapan.',
      voz: 'Pregunta siempre: ¿cambió alguna molécula?',
    },
    ahoraTu: {
      voz: 'Decide si alguna molécula cambió.',
      generar(s) {
        const CASOS = [
          ['Calentar el crudo y recoger lo que se condensa entre 150 y 275 °C', 'separa'],
          ['Romper moléculas de C₁₂H₂₆ en otras más cortas con un catalizador', 'transforma'],
          ['Reacomodar heptano en moléculas ramificadas para subir el octanaje', 'transforma'],
          ['Separar el agua y la sal que vienen con el crudo', 'separa'],
          ['Recoger los gases que salen por arriba de la torre', 'separa'],
          ['Calentar un residuo pesado hasta partirlo en gasolina y gases', 'transforma'],
        ];
        const [caso, tipo] = CASOS[s % CASOS.length];
        return {
          pregunta: `${caso}. ¿Este proceso separa o transforma?`,
          opciones: [
            { id: 'c', texto: tipo === 'separa' ? 'Separa: las moléculas no cambian' : 'Transforma: aparecen moléculas nuevas', correcta: true },
            { id: 'otro', texto: tipo === 'separa' ? 'Transforma: aparecen moléculas nuevas' : 'Separa: las moléculas no cambian', error: 'QA13', siFuera: tipo === 'separa' ? 'Sería transformar si se rompieran o reacomodaran moléculas. Aquí solo se reparten.' : 'Sería separar si las moléculas fueran las mismas. Aquí se rompen o se reacomodan.' },
          ],
          solucion: { texto: tipo === 'separa' ? 'Solo se reparte lo que ya había: es una separación.' : 'Se rompen o reacomodan enlaces: hay reacción química.' },
        };
      },
    },
  };

  // ---------- Idea 2: el octanaje es una comparación ----------
  // Cambia: el octanaje · Permanece: 20 moléculas en la caja, isooctano y heptano · Progresa: más isooctano en la
  // mezcla de referencia · Se reserva: la energía por litro, que el octanaje no mide · Debe verse: que es una mezcla patrón.
  const ATO = { I: { color: 'o', estilo: 'lleno', r: 3.8 }, H: { color: 'i', estilo: 'hueco', r: 3.8 }, O: { color: 'h', estilo: 'lleno', r: 6 }, C: { estilo: 'lleno', r: 5 }, Hh: { color: 'i', estilo: 'hueco', r: 4 } };
  const ESP = {
    iso: [['I', -7, 0], ['I', 0, 0], ['I', 7, 0], ['I', 0, -7], ['I', 0, 7], ['I', -7, -6], ['I', 7, 6], ['I', 13, 3]],
    hep: [['H', -12, 2], ['H', -8, -2], ['H', -4, 2], ['H', 0, -2], ['H', 4, 2], ['H', 8, -2], ['H', 12, 2]],
    CH4: [['C', 0, 0], ['Hh', -6, -5], ['Hh', 6, -5], ['Hh', -6, 5], ['Hh', 6, 5]], O2: [['O', -5, 0], ['O', 5, 0]],
    CO2: [['C', 0, 0], ['O', -9, 0], ['O', 9, 0]], CO: [['C', -4, 0], ['O', 5, 0]], H2O: [['O', 0, -1], ['Hh', -6, 4], ['Hh', 6, 4]], Cs: [['C', 0, 0]],
  };
  const lupa = (cajas, extra = {}) => ({ datos: Object.assign({ atomos: ATO, especies: ESP, alto: 150, separacion: 30, cajas }, extra), estado: {} });
  const mezcla = (oct, titulo, desde = 0) => ({ titulo, forma: 'caja', particulas: [{ e: 'iso', n: Math.round(oct / 5), desde }, { e: 'hep', n: 20 - Math.round(oct / 5), desde }] });
  const octanaje = {
    id: 'octanaje',
    titulo: 'El octanaje es una comparación',
    temas: ['Gasolina y octanaje'],
    pieza: 'quim-particulas',
    juega: {
      // Animación: el octanaje sube y baja solo (80 a 100); cada 5 octanos, una molécula de heptano cambia por isooctano.
      // Las moléculas tiemblan (agitación térmica, solo para dar vida: el temblor no es un dato).
      consigna: 'El octanaje sube y baja solo. La caja muestra la mezcla patrón que detona igual: isooctano (naranja) y heptano (turquesa).',
      voz: 'Cuenta cuántas de las 20 moléculas son isooctano.',
      controles: [{ id: 'o', etiqueta: 'Octanaje', min: 80, max: 100, paso: 5, inicio: 85, decimales: 0, auto: { velocidad: 4, modo: 'rebota' } }],
      dibujo: val => lupa([mezcla(val.o, `Detona como ${f(val.o, 0)} octanos`)], { agita: val.o / 4, agitaAmp: 1.5 }),
      lectura: val => [`Mezcla patrón: ${f(val.o, 0)} % isooctano, ${f(100 - val.o, 0)} % heptano.`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una gasolina de 95 octanos y otra de 90 octanos, en el mismo auto. ¿Cuál entrega más energía por litro al quemarse?',
      voz: 'Separa dos preguntas: cuándo detona y cuánta energía trae.',
      opciones: [
        { id: 'c', texto: 'Casi la misma: el octanaje mide la resistencia a detonar', correcta: true },
        { id: 'energia', texto: 'La de 95: más octanos, más energía', error: 'QM-OCTANO-ENERGIA', siFuera: 'Más octanos sí resisten más la detonación. La energía por litro casi no cambia.' },
        { id: 'porcentaje', texto: 'La de 95, porque tiene 95 % de octano', error: 'QM-OCTANO-PORCENTAJE', siFuera: 'El 95 compara con una mezcla patrón; no es el porcentaje de octano de la gasolina.' },
      ],
      dibujo: lupa([mezcla(90, '90 octanos'), mezcla(95, '95 octanos')], { separacion: 26, alto: 170 }),
      revelar: lupa([Object.assign(mezcla(90, '90 octanos'), { rotulo: 'detona antes' }), Object.assign(mezcla(95, '95 octanos'), { rotulo: 'resiste más' })], { separacion: 26, alto: 170 }),
      coincide: 'Coincide: el octanaje dice cuándo detona, no cuánta energía trae.',
      noCoincide: 'El octanaje compara la detonación; la energía por litro es casi igual.',
    },
    mira: {
      datos: lupa([
        { titulo: 'Vale 100', forma: 'caja', particulas: [{ e: 'iso', n: 5, desde: 1 }] },
        { titulo: 'Vale 0', forma: 'caja', particulas: [{ e: 'hep', n: 5, desde: 2 }] },
        Object.assign(mezcla(90, 'Patrón 90', 3), { particulas: [{ e: 'iso', n: 9, desde: 3 }, { e: 'hep', n: 1, desde: 3 }] }),
      ], { separacion: 24, alto: 170 }).datos,
      voz: 'Primero las dos referencias; después, la mezcla.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El isooctano, ramificado, resiste mucho la detonación: vale 100.' },
        { estado: { corte: 2 }, texto: 'El heptano, en cadena, detona fácil: vale 0.' },
        { estado: { corte: 3 }, texto: 'Una gasolina de 90 detona igual que 9 de isooctano por 1 de heptano.' },
        { estado: { corte: 3 }, texto: 'La gasolina no contiene esa mezcla: solo se compara con ella.' },
      ],
    },
    regla: {
      texto: 'El octanaje compara la resistencia a detonar de una gasolina con mezclas de isooctano (100) y heptano (0). Un octanaje de 90 detona como 90 % de isooctano.',
      ecuacion: ['octanaje = % de isooctano en la ', { llave: ['mezcla patrón'], nota: 'isooctano + heptano' }, ' que detona igual'],
      condicion: 'se mide con un método normalizado de motor; no es el porcentaje de octano de la gasolina ni su energía por litro.',
      voz: 'Es una comparación, no una receta.',
    },
    ahoraTu: {
      voz: 'Piensa en la mezcla patrón.',
      generar(s) {
        const x = azar(s), o = x.ent(81, 99);
        return {
          pregunta: `Una gasolina detona en el motor de prueba igual que una mezcla de isooctano y heptano. Si su octanaje es ${f(o, 0)}, ¿qué mezcla patrón es?`,
          opciones: [
            { id: 'c', texto: `${f(o, 0)} % isooctano y ${f(100 - o, 0)} % heptano`, correcta: true },
            { id: 'al-reves', texto: `${f(100 - o, 0)} % isooctano y ${f(o, 0)} % heptano`, error: 'QM-OCTANO-REFERENCIA', siFuera: 'Eso invierte los papeles. El isooctano es el que vale 100.' },
            { id: 'contiene', texto: `La gasolina tiene ${f(o, 0)} % de octano`, error: 'QM-OCTANO-PORCENTAJE', siFuera: 'El número compara con la mezcla patrón; no cuenta lo que contiene la gasolina.' },
          ],
          solucion: { texto: 'El octanaje es el porcentaje de isooctano de la mezcla patrón que detona igual.' },
        };
      },
    },
  };

  // ---------- Idea 3: combustión completa e incompleta ----------
  // Cambia: el combustible y el oxígeno disponible · Permanece: antes a la izquierda, después a la derecha · Progresa:
  // del oxígeno justo al que sobra · Se reserva: el oxígeno escaso, que deja CO · Debe verse: dónde termina cada C.
  const COMB = {
    metano: { texto: 'Metano (gas natural)', fuel: 'CH4', H: 4, C: 1 },
    carbon: { texto: 'Carbono (carbón)', fuel: 'Cs', H: 0, C: 1 },
  };
  // n moléculas de combustible con o O₂ cada una: lo que sale. Primero el H va a agua; el resto del O a CO₂ o CO.
  function quemar(k, n, oPorUno) {
    const c = COMB[k], O = 2 * n * oPorUno, nC = n * c.C, nH2O = n * c.H / 2;
    let quedaO = O - nH2O, co2 = 0, co = 0, hollin = 0, sobraO2 = 0;
    if (quedaO >= 2 * nC) { co2 = nC; sobraO2 = (quedaO - 2 * nC) / 2; }
    else if (quedaO >= nC) { co2 = quedaO - nC; co = nC - co2; }
    else { co = quedaO; hollin = nC - co; }
    return { co2, co, hollin, h2o: nH2O, sobraO2, O2: O / 2 };
  }
  function combustion(k, oPorUno, desde = 0) {
    const n = 2, p = quemar(k, n, oPorUno);
    const despues = [{ e: 'CO2', n: p.co2, desde: desde ? desde + 1 : 0 }, { e: 'CO', n: p.co, desde: desde ? desde + 1 : 0 }, { e: 'Cs', n: p.hollin, desde: desde ? desde + 1 : 0 }, { e: 'H2O', n: p.h2o, desde: desde ? desde + 1 : 0 }, { e: 'O2', n: Math.round(p.sobraO2), desde: desde ? desde + 1 : 0 }].filter(x => x.n > 0);
    return lupa([{ titulo: 'Antes', forma: 'caja', particulas: [{ e: COMB[k].fuel, n, desde }, { e: 'O2', n: p.O2, desde }] }, { titulo: 'Después', forma: 'caja', particulas: despues }], { flechas: true, separacion: 26,
      alt: `Antes: ${n} de ${COMB[k].fuel === 'Cs' ? 'C' : 'CH₄'} y ${f(p.O2, 0)} de O₂. Después: ${f(p.co2, 0)} CO₂, ${f(p.co, 0)} CO, ${f(p.hollin, 0)} C (hollín), ${f(p.h2o, 0)} H₂O y ${f(p.sobraO2, 0)} O₂ que sobra.` });
  }
  // Animación: en cámara lenta, la primera molécula de combustible se quema a 1 s y la segunda a 2 s (t de 0 a 4 s).
  // Cada una se lleva su parte de O₂ y deja sus productos; el O₂ que no se usa queda sin reaccionar. Los conteos salen
  // de quemar() con 1 y 2 moléculas; los tiempos son ilustrativos.
  const quemadas = t => (t === undefined ? 2 : t >= 2 ? 2 : t >= 1 ? 1 : 0);
  function combustionViva(k, oPorUno, t) {
    const j = quemadas(t), tot = quemar(k, 2, oPorUno), p = quemar(k, j, oPorUno), usado = p.O2 - p.sobraO2;
    const queda = [{ e: COMB[k].fuel, n: 2 - j }, { e: 'O2', n: Math.round(tot.O2 - usado) }].filter(x => x.n > 0);
    const sale = [{ e: 'CO2', n: p.co2 }, { e: 'CO', n: p.co }, { e: 'Cs', n: p.hollin }, { e: 'H2O', n: p.h2o }].filter(x => x.n > 0);
    return lupa([{ titulo: 'Sin reaccionar', forma: 'caja', particulas: queda }, { titulo: 'Productos', forma: 'caja', particulas: sale }], { flechas: true, separacion: 26, agita: t, agitaAmp: 1.5,
      alt: `A los ${f(t, 1)} s se quemaron ${j} de 2 moléculas de ${COMB[k].fuel === 'Cs' ? 'C' : 'CH₄'}. Sin reaccionar: ${2 - j} de combustible y ${f(tot.O2 - usado, 0)} de O₂. Productos: ${f(p.co2, 0)} CO₂, ${f(p.co, 0)} CO y ${f(p.h2o, 0)} H₂O.` });
  }
  const leerCorto = (k, o) => { const p = quemar(k, 2, o); return p.co || p.hollin ? 'sale CO: incompleta' : `todo C a CO₂${p.sobraO2 ? ', sobra O₂' : ''}`; };
  const leer = (k, o) => { const p = quemar(k, 2, o); return p.co || p.hollin ? `Sale ${p.co ? 'CO' : ''}${p.hollin ? (p.co ? ' y hollín' : 'hollín') : ''}: incompleta.` : `Todo el carbono termina en CO₂: completa${p.sobraO2 ? ', sobra O₂' : ''}.`; };
  const oDe = val => (val.k === 'metano' ? (val.o === 'justo' ? 2 : 3) : (val.o === 'justo' ? 1 : 1.5));
  const combustionIdea = {
    id: 'combustion',
    titulo: 'Con poco oxígeno sale CO',
    temas: ['Combustión completa e incompleta', 'Gas natural y carbón'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'En cámara lenta, dos moléculas de combustible se queman una tras otra. Elige el oxígeno y mira qué sobra y qué sale.',
      voz: 'Sigue a los átomos de carbono: ¿dónde terminan?',
      controles: [
        { id: 'k', etiqueta: 'Combustible', opciones: Object.keys(COMB).map(k => ({ valor: k, texto: COMB[k].texto })) },
        { id: 'o', etiqueta: 'O₂ por molécula', opciones: [{ valor: 'justo', texto: 'El justo' }, { valor: 'sobra', texto: 'De sobra' }] },
        { id: 't', etiqueta: 't', min: 0, max: 4, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } },
      ],
      dibujo: val => combustionViva(val.k, oDe(val), val.t),
      lectura: val => [`${f(val.t, 1)} s: ${quemadas(val.t)} de 2 quemadas · ${leerCorto(val.k, oDe(val))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una cocina de gas natural arde en un cuarto cerrado y el oxígeno empieza a faltar: 3 O₂ por cada 2 CH₄. ¿Qué gas nuevo aparece?',
      voz: 'Reparte el oxígeno que hay: primero al hidrógeno.',
      opciones: [
        { id: 'c', texto: 'Monóxido de carbono, CO', correcta: true },
        { id: 'co2', texto: 'Solo más CO₂, como siempre', error: 'QM-INCOMPLETA', siFuera: 'Con oxígeno de sobra, sí. Con poco, al carbono no le alcanza para dos oxígenos.' },
        { id: 'nada', texto: 'Ninguno: si falta oxígeno, no arde', error: 'QM-SIN-O2', siFuera: 'Sin nada de oxígeno no arde. Con poco, sigue ardiendo, pero mal.' },
        { id: 'h2', texto: 'Hidrógeno, H₂', error: 'QM-COMB-H2', siFuera: 'El hidrógeno del metano se lleva oxígeno antes que el carbono: forma agua.' },
      ],
      dibujo: lupa([{ titulo: 'Antes', forma: 'caja', particulas: [{ e: 'CH4', n: 2 }, { e: 'O2', n: 3 }] }, { titulo: 'Después', forma: 'caja', particulas: [] }], { flechas: true, separacion: 26 }),
      revelar: combustion('metano', 1.5),
      coincide: 'Coincide: con 3 O₂ el agua se forma igual y al carbono solo le toca un oxígeno.',
      noCoincide: 'El hidrógeno toma su oxígeno primero; al carbono le queda uno: CO.',
    },
    mira: {
      datos: Object.assign(combustion('metano', 1.5, 1).datos, { cajas: combustion('metano', 1.5, 1).datos.cajas.map((c, i) => Object.assign({}, c, { cuenta: [{ e: 'Cs', texto: '2', desde: 3 }, { e: 'O', texto: '6', desde: 3 }, { e: 'Hh', texto: '8', desde: 3 }] })) }),
      voz: 'Llevemos la cuenta de los átomos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Antes: 2 CH₄ y solo 3 O₂.' },
        { estado: { corte: 2 }, texto: 'El hidrógeno forma 4 H₂O; al carbono le quedan 2 oxígenos.', ecuacion: ['2 CH₄ + 3 O₂ → 2 CO + 4 H₂O'] },
        { estado: { corte: 3 }, texto: 'Los átomos se conservan: 2 C, 6 O y 8 H a cada lado.' },
        { estado: { corte: 3 }, texto: 'Con oxígeno de sobra todo el carbono habría salido como CO₂.', ecuacion: ['CH₄ + 2 O₂ → CO₂ + 2 H₂O'] },
      ],
    },
    regla: {
      texto: 'En la combustión completa, el carbono termina en CO₂ y el hidrógeno en H₂O. Con poco oxígeno es incompleta: aparecen CO y hollín.',
      ecuacion: ['CH₄ + 2 O₂ → CO₂ + 2 H₂O', '   ·   ', 'C + O₂ → CO₂'],
      condicion: 'el gas natural es sobre todo metano y el carbón, sobre todo carbono; ambos tienen impurezas que dan otros productos.',
      voz: 'Reparte el oxígeno átomo por átomo.',
    },
    ahoraTu: {
      voz: 'Cuenta los oxígenos que piden el C y el H.',
      generar(s) {
        const n = (s % 8) + 1, h = 2 * n + 2, o2 = (3 * n + 1) / 2;
        const nom = ['metano', 'etano', 'propano', 'butano', 'pentano', 'hexano', 'heptano', 'octano'][n - 1];
        return {
          pregunta: `¿Cuántos mol de O₂ necesita 1 mol de ${nom}, C${n > 1 ? sub(n) : ''}H${sub(h)}, para quemarse por completo?`,
          opciones: opciones(o2, [
            { id: 'solo-c', valor: n, error: 'QM-O2-SOLO-C', siFuera: 'Eso solo alcanza para el carbono. El hidrógeno también pide oxígeno.' },
            { id: 'sin-mitad', valor: 3 * n + 1, error: 'QM-O2-ATOMOS', siFuera: 'Eso cuenta átomos de O. Cada molécula de O₂ trae dos.' },
            { id: 'incompleta', valor: (2 * n + 1) / 2, error: 'QM-INCOMPLETA', siFuera: 'Eso daría CO en vez de CO₂: sería una combustión incompleta.' },
          ], v => `${f(v, 1)} mol`),
          solucion: { texto: `${n} CO₂ piden ${2 * n} O y ${n + 1} H₂O piden ${n + 1} O: en total ${3 * n + 1} átomos de O.`, ecuacion: [`O₂ = (${2 * n} + ${n + 1}) / 2 = ${f(o2, 1)} mol`] },
        };
      },
    },
  };
  const SUBS = '₀₁₂₃₄₅₆₇₈₉';
  function sub(n) { return String(n).split('').map(c => SUBS[+c]).join(''); }

  // ---------- Idea 4: mena, ley y metal ----------
  // Cambia: la ley y la recuperación · Permanece: 1 000 kg de mena · Progresa: de la roca al metal recuperado ·
  // Se reserva: la pureza del metal refinado, que no es la ley · Debe verse: lo poco que queda de la roca.
  const METAL = { Cu: { mineral: 'calcopirita, CuFeS₂', nombre: 'cobre' }, Zn: { mineral: 'esfalerita, ZnS', nombre: 'zinc' }, Pb: { mineral: 'galena, PbS', nombre: 'plomo' } };
  const barra = (ley, rec, met = 'Cu') => ({ datos: { columnas: [{ titulo: `Mena de ${METAL[met].nombre}`, nodos: [
    { texto: `1 000 kg de mena (${METAL[met].mineral} y roca)` },
    { texto: `ley ${f(ley, 0)} %: ${f(10 * ley, 1)} kg de ${METAL[met].nombre} en la roca`, color: 'o' },
    { texto: `recuperación ${f(rec, 0)} %: salen ${f(10 * ley * rec / 100, 1)} kg`, color: 'd' }] }] }, estado: {} });
  const mena = {
    id: 'mena-ley-metal',
    titulo: 'La ley no es la pureza',
    temas: ['Recursos minerales del Perú (solo San Marcos)', 'Metalurgia del Fe, Cu, Pb, Zn, Au y Ag (solo San Marcos)'],
    pieza: 'quim-cadena',
    juega: {
      // Animación: la ley sube y baja sola (1 a 8 %). El juego usa las dos barras de la mesa «La mena en dos barras»
      // (quim-composicion): el tramo naranja crece con la ley; «Mira» y la predicción siguen con la cadena de pasos.
      consigna: 'De 1 000 kg de mena, la ley (sube y baja sola) es la parte que es metal; la recuperación, lo que se logra sacar.',
      voz: 'Mira cuánto queda después de cada paso.',
      pieza: 'quim-composicion',
      controles: [
        { id: 'met', etiqueta: 'Metal', opciones: Object.keys(METAL).map(k => ({ valor: k, texto: METAL[k].nombre })) },
        { id: 'ley', etiqueta: 'w', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 2, unidad: '%', decimales: 1, auto: { velocidad: 1.5, modo: 'rebota' } },
        { id: 'rec', etiqueta: 'r', color: 'c-d', min: 70, max: 95, paso: 5, inicio: 90, unidad: '%', decimales: 0 },
      ],
      dibujo: val => ({ datos: menaBarras(val), estado: {} }),
      lectura: val => [`Ley ${f(val.ley, 1)} %: sale el ${f(val.ley * val.rec / 100, 2)} % de la mena como ${METAL[val.met].nombre}.`],
      // Los dos bordes se arrastran, como en la mesa: arrastrar la ley pausa la animación.
      arrastres: [
        { id: 'ley', etiqueta: 'borde del metal en la mena', color: 'c-o',
          donde: v => { const g = PC().geometria(menaBarras(v)); return { x: g.xDe(0, v.ley), y: g.y(0) + g.hb / 2 }; },
          mover: (pt, v) => ({ ley: PC().geometria(menaBarras(v)).valorEn(0, pt.x) }) },
        { id: 'rec', etiqueta: 'borde de lo recuperado', color: 'c-d',
          donde: v => { const g = PC().geometria(menaBarras(v)); return { x: g.xDe(1, v.rec), y: g.y(1) + g.hb / 2 }; },
          mover: (pt, v) => ({ rec: PC().geometria(menaBarras(v)).valorEn(1, pt.x) }) },
      ],
      minimo: 3,
    },
    predice: {
      pieza: 'quim-cadena',
      pregunta: 'Una mena de cobre tiene ley de 1 %. Después de concentrarla, fundirla y refinarla por electrólisis, ¿qué pureza tiene el cobre que sale?',
      voz: 'Separa lo que mide la ley de lo que mide la pureza.',
      opciones: [
        { id: 'c', texto: 'Más de 99,9 %: la ley describe la roca, no el metal', correcta: true },
        { id: 'uno', texto: '1 %, como la ley', error: 'QM-LEY-PUREZA', siFuera: 'El 1 % es cuánto cobre trae la roca. El cobre separado y refinado ya no lleva roca.' },
        { id: 'noventa', texto: '99 %, porque se le quita la roca', error: 'QM-LEY-PUREZA', siFuera: 'Se quita la roca, bien. La refinación electrolítica limpia todavía más.' },
      ],
      dibujo: { datos: { columnas: [{ titulo: 'Cobre', color: 'i', nodos: [{ texto: 'mena: 1 % de cobre' }, { texto: 'concentrar, fundir, refinar' }] }] }, estado: {} },
      revelar: { datos: { columnas: [{ titulo: 'Cobre', color: 'i', nodos: [{ texto: 'mena: 1 % de cobre' }, { texto: 'concentrar, fundir, refinar' }, { texto: 'cobre de más de 99,9 %' }] }] }, estado: {} },
      coincide: 'Coincide: la ley mide la roca; la refinación da cobre casi puro.',
      noCoincide: 'La ley es cuánto metal trae la roca; el metal refinado sale casi puro.',
    },
    mira: {
      pieza: 'quim-cadena',
      datos: { columnas: [
        { titulo: 'Cobre', color: 'i', nodos: [{ texto: 'calcopirita CuFeS₂', desde: 1 }, { texto: 'flotación: concentrado', desde: 2 }, { texto: 'fundición', desde: 2 }, { texto: 'electrólisis: Cu casi puro', desde: 3 }] },
        { titulo: 'Hierro', color: 'o', nodos: [{ texto: 'hematita Fe₂O₃', desde: 4 }, { texto: 'alto horno con coque', desde: 4 }, { texto: 'Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂', desde: 5 }, { texto: 'acero', desde: 5 }] },
      ] },
      voz: 'Sigamos dos rutas distintas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En el Perú se extrae cobre de minerales como la calcopirita.', ecuacion: [{ sub: [m, 'metal'] }, ' = ', { sub: [m, 'mena'] }, ' · ', w, ' · ', r] },
        { estado: { corte: 2 }, texto: 'Primero se concentra el mineral; después se funde.' },
        { estado: { corte: 3 }, texto: 'La electrólisis refina: el cobre se deposita casi puro.', ecuacion: ['Cu²⁺ + 2e⁻ → Cu'] },
        { estado: { corte: 4 }, texto: 'El hierro sigue otra ruta: el alto horno.' },
        { estado: { corte: 5 }, texto: 'El CO del coque reduce el óxido de hierro.', ecuacion: ['Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂'] },
        { estado: { corte: 5 }, texto: 'Zinc, plomo, plata y oro tienen rutas propias: tostación, lixiviación o electrólisis.' },
      ],
    },
    regla: {
      texto: 'Mineral, mena, ley y metal no son lo mismo. La ley es la fracción de metal en la mena; de ese metal se recupera una parte.',
      ecuacion: [{ sub: [m, 'metal'] }, ' = ', { sub: [m, 'mena'] }, ' · ', { llave: [w, ' · ', r], nota: 'ley · recuperación' }],
      condicion: 'w y r como fracciones; la ruta (fundición, lixiviación o electrólisis) depende del mineral y del metal.',
      voz: 'La ley habla de la roca; la pureza, del metal.',
    },
    ahoraTu: {
      voz: 'Pasa los porcentajes a fracción.',
      generar(s) {
        const x = azar(s), mt = 100 * x.ent(2, 50), ley = x.de([0.5, 0.8, 1.2, 2, 3, 5]), rec = 5 * x.ent(16, 19), mm = mt * ley / 100 * rec / 100;
        const met = ['cobre', 'zinc', 'plomo'][s % 3];
        return {
          pregunta: [`De `, { sub: [m, 'mena'] }, ` = ${f(mt, 0)} kg de mena de ${met} con ley `, w, ` = ${f(ley, 1)} % y recuperación `, r, ` = ${f(rec, 0)} %, ¿cuánto ${met} se obtiene?`],
          opciones: opciones(mm, [
            { id: 'sin-r', valor: mt * ley / 100, error: 'QM-SIN-RECUPERACION', siFuera: 'Ese es todo el metal de la roca. Solo se recupera una parte.' },
            { id: 'sin-ley', valor: mt * rec / 100, error: 'QM-LEY-PUREZA', siFuera: 'Eso trata la mena como si fuera metal puro. La ley dice qué parte es metal.' },
            { id: 'pct', valor: mt * ley * rec / 100, error: 'QM-PORCENTAJE', siFuera: 'Eso olvida dividir un porcentaje entre 100.' },
          ], v => `${f(v, 1)} kg`),
          solucion: { texto: 'La ley da el metal de la roca; la recuperación, la parte que se logra sacar.', ecuacion: [{ sub: [m, 'metal'] }, ` = ${f(mt, 0)} · ${f(ley / 100, 3)} · ${f(rec / 100, 2)} = ${f(mm, 1)} kg`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: dos platos de la torre; entre ellos se recoge lo que hierve en ese tramo.
  const recoge = v => { const a = Math.min(v.a, v.b), b = Math.max(v.a, v.b); return FRAC.filter(x => (x.b === null || x.b >= a) && (x.a === null || x.a <= b)).map(x => x.n); };
  const dosPlatos = v => ({ datos: Object.assign(torre([
    { tipo: 'intervalo', a: Math.min(v.a, v.b), b: Math.max(v.a, v.b), ca: true, cb: true, color: 'h', fila: 0 },
    { tipo: 'punto', x: v.a, color: 'h', fila: 0 }, { tipo: 'punto', x: v.b, color: 'h', fila: 0 }]),
    { alt: `Tramo de la torre entre ${f(Math.min(v.a, v.b), 0)} y ${f(Math.max(v.a, v.b), 0)} °C: se recogen ${recoge(v).join(', ') || 'ninguna fracción'}.` }), estado: {} });
  // Mesa 2: la mena como dos barras de 100 %: arriba, el metal dentro de la roca (ley); abajo, cuánto de ese metal se
  // recupera. Los bordes se arrastran. Rangos más amplios que la idea 4 (ley hasta 20 %, recuperación desde 40 %).
  const PC = () => Kit.piezas['quim-composicion'];
  const menaBarras = v => { const kg = 10 * v.ley, sale = kg * v.rec / 100, n = METAL[v.met].nombre; return { filas: [
    { titulo: `en 1 000 kg: ${f(kg, 1)} kg de ${n}`, tramos: [{ valor: v.ley, texto: `${f(v.ley, 1)} %`, color: 'o' }, { valor: 100 - v.ley, texto: 'roca' }] },
    { titulo: `de ese ${n} se recuperan ${f(sale, 1)} kg`, tramos: [{ valor: v.rec, texto: `${f(v.rec, 0)} %`, color: 'd' }, { valor: 100 - v.rec, texto: 'se pierde' }] },
  ], alt: `Mena de ${n} con ley ${f(v.ley, 1)} % y recuperación ${f(v.rec, 0)} %: de 1 000 kg salen ${f(sale, 1)} kg.` }; };
  // Kilos de metal que salen de 1 000 kg de mena: los usan la lectura y los retos.
  const kgSale = v => 10 * v.ley * v.rec / 100;
  // Mesa 3: la combustión con el oxígeno que el alumno quiera, de muy poco (hollín) a mucho (sobra O₂).
  const leerPocos = (k, o) => { const p = quemar(k, 2, o); return [`${f(2 * o, 0)} O₂ → `, [[p.co2, 'CO₂'], [p.co, 'CO'], [p.hollin, 'C (hollín)'], [p.h2o, 'H₂O'], [p.sobraO2, 'O₂']].filter(([x]) => x > 0).map(([x, t]) => `${f(x, 0)} ${t}`).join(' + ')]; };

  return {
    unidad: 'quimica.recursos-naturales',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/quim-cadena.js', '/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/quim-composicion.js'],
    historia: {
      texto: 'Cuando creció la demanda de gasolina, la pregunta fue si bastaba separar lo que el petróleo ya traía o si había que transformar sus moléculas. En 1937 empezó a operar a gran escala el craqueo catalítico de Houdry, fruto de un trabajo industrial colectivo. Desde entonces una refinería separa y transforma; son operaciones distintas.',
      pregunta: '¿Alcanzaría la gasolina si solo se separara del crudo?',
      fuente: { titulo: 'EIA, The refining process', url: 'https://www.eia.gov/energyexplained/oil-and-petroleum-products/refining-crude-oil-the-refining-process.php' },
    },
    // Laboratorio (docs/teoria.md §4b), sin preguntas. La torre con dos platos (un tramo, no un punto); la mena como
    // dos barras con los bordes arrastrables y rangos más amplios; y la combustión con el oxígeno libre, donde aparece
    // el hollín que la idea 3 no deja ver. Títulos y lecturas dicen las entradas, para que el caso guardado se lea solo.
    glosario: [
      { termino: 'petróleo', def: 'Mezcla líquida de muchos hidrocarburos, formada bajo tierra en millones de años a partir de restos de seres vivos.',
        ver: ['hidrocarburo', 'destilación fraccionada'] },
      { termino: 'destilación fraccionada', def: 'Separación de una mezcla de líquidos en una torre, según el intervalo de temperatura en que hierve cada parte.',
        ejemplo: 'La gasolina se recoge entre 30 y 200 °C.', ver: ['petróleo', 'refinación'] },
      { termino: 'refinación', def: 'Procesos que convierten el petróleo crudo en productos útiles: separar, romper y limpiar sus moléculas.',
        ver: ['destilación fraccionada', 'craqueo'] },
      { termino: 'craqueo', def: 'Ruptura de moléculas grandes del petróleo en otras más chicas, con calor o catalizador, para obtener más gasolina.',
        ejemplo: 'C₁₆H₃₄ → C₈H₁₈ + C₈H₁₆: 34 H a cada lado.', ver: ['refinación'] },
      { termino: 'octanaje', def: 'Número que mide cuánto resiste una gasolina a la detonación, comparada con isooctano (100) y heptano (0).',
        ejemplo: 'Gasolina de 90: detona como 90 % de isooctano y 10 % de heptano.', ver: ['isooctano', 'detonación'] },
      { termino: 'isooctano', def: '2,2,4-trimetilpentano, C₈H₁₈: hidrocarburo ramificado que resiste la detonación; vale 100 en la escala de octanaje.',
        ver: ['octanaje', 'isómero'] },
      { termino: 'detonación', def: 'Encendido espontáneo de la mezcla en el motor antes de que llegue la llama; golpea el pistón.',
        formas: ['detonación', 'detonaciones', 'detona', 'detonan'], ver: ['octanaje'] },
      { termino: 'combustión', def: 'Reacción rápida de una sustancia con oxígeno que libera calor y, casi siempre, luz.',
        ejemplo: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O.', ver: ['combustión completa', 'combustión incompleta'] },
      { termino: 'combustión completa', def: 'La que tiene oxígeno suficiente: todo el carbono termina en CO₂ y el hidrógeno en agua.',
        ejemplo: '2 CH₄ con 4 O₂: salen 2 CO₂ y 4 H₂O.', ver: ['combustión incompleta'] },
      { termino: 'combustión incompleta', def: 'La que tiene poco oxígeno: parte del carbono queda como CO, un gas tóxico, o como hollín.',
        ejemplo: '2 CH₄ con 3 O₂: salen 2 CO y 4 H₂O.', ver: ['hollín', 'combustión completa'] },
      { termino: 'hollín', def: 'Polvo negro de carbono sin quemar que deja una combustión con muy poco oxígeno.' },
      { termino: 'gas natural', def: 'Mezcla de gases del subsuelo, sobre todo metano, CH₄, que se usa como combustible.',
        ver: ['combustión'] },
      { termino: 'mena', def: 'Roca de la que conviene sacar un metal porque lo trae en cantidad suficiente.',
        ejemplo: 'La calcopirita, CuFeS₂, da el cobre de muchas menas peruanas.', formas: ['mena', 'menas'], ver: ['ley del mineral'] },
      { termino: 'ley del mineral', def: 'Porcentaje de metal que trae la mena: cuántos kilos de metal hay en cada 100 kg de roca.',
        ejemplo: 'Ley 2 %: 1 000 kg de mena traen 20 kg de cobre.', formas: ['ley del mineral', 'ley de la mena'], ver: ['mena', 'recuperación'] },
      { termino: 'recuperación', def: 'Porcentaje del metal de la mena que el proceso logra sacar; el resto se pierde en los relaves.',
        ejemplo: 'De 20 kg con 90 %: salen 18 kg.', ver: ['ley del mineral'] },
    ],
    laboratorio: [
      {
        id: 'dos-platos', titulo: 'Dos platos de la torre', pieza: 'recta',
        // Animación: el plato 2 recorre la torre solo (0 a 400 °C y vuelve); el tramo y lo que recoge cambian con él.
        consigna: 'El plato 2 recorre la torre solo. Entre los dos platos se recoge lo que hierve en ese tramo. Corre los platos y prueba.',
        controles: [
          { id: 'a', etiqueta: 'plato 1', color: 'c-h', min: 0, max: 400, paso: 25, inicio: 150, unidad: '°C', decimales: 0 },
          { id: 'b', etiqueta: 'plato 2', color: 'c-h', min: 0, max: 400, paso: 25, inicio: 250, unidad: '°C', decimales: 0, auto: { velocidad: 40, modo: 'rebota' } },
        ],
        dibujo: v => dosPlatos(v),
        lectura: v => [`${f(Math.min(v.a, v.b), 0)} a ${f(Math.max(v.a, v.b), 0)} °C: ${recoge(v).join(', ') || 'nada'}`],
        arrastres: [
          { id: 'plato-1', etiqueta: 'primer plato', color: 'c-h', donde: v => ({ x: GR().x(v.a), y: GR().filaY(0) }), mover: pt => ({ a: tDeX(pt.x) }) },
          { id: 'plato-2', etiqueta: 'segundo plato', color: 'c-h', donde: v => ({ x: GR().x(v.b), y: GR().filaY(0) }), mover: pt => ({ b: tDeX(pt.x) }) },
        ],
        invitaciones: [
          { texto: 'Ajusta un tramo que recoja solo gasolina.',
            logrado: v => { const r = recoge(v); return r.length === 1 && r[0] === 'gasolina'; },
            bien: 'Una sola fracción, pero sigue siendo mezcla: hierve en un intervalo.' },
          { texto: 'Pon los dos platos en la misma temperatura y recoge dos fracciones.',
            logrado: v => v.a === v.b && recoge(v).length >= 2,
            bien: 'A esa temperatura hierven las dos: las fracciones se traslapan.' },
          { texto: 'Recoge todas las fracciones de la torre a la vez.',
            logrado: v => recoge(v).length === FRAC.length,
            bien: 'Un tramo tan ancho recoge todo el crudo: no separa nada.' },
          { texto: 'Guarda dos tramos del mismo ancho que recojan distinto número de fracciones.',
            logrado: (v, guardados) => guardados.some(g => Math.abs(g.a - g.b) === Math.abs(v.a - v.b) && recoge(g).length !== recoge(v).length),
            bien: 'El ancho no basta: importa en qué parte de la torre cae.' },
        ],
      },
      {
        id: 'mena-barras', titulo: 'La mena en dos barras', pieza: 'quim-composicion',
        consigna: 'Arrastra el borde de arriba para cambiar la ley y el de abajo para la recuperación. Mira cuántos kilos de metal salen.',
        controles: [
          { id: 'met', etiqueta: 'Metal', opciones: Object.keys(METAL).map(k => ({ valor: k, texto: METAL[k].nombre })) },
          { id: 'ley', etiqueta: 'w', color: 'c-o', min: 0.5, max: 20, paso: 0.5, inicio: 2, unidad: '%', decimales: 1 },
          { id: 'rec', etiqueta: 'r', color: 'c-d', min: 40, max: 100, paso: 5, inicio: 90, unidad: '%', decimales: 0 },
        ],
        dibujo: v => ({ datos: menaBarras(v), estado: {} }),
        lectura: v => [w, ` = ${f(v.ley, 1)} % · `, r, ` = ${f(v.rec, 0)} % → ${f(kgSale(v), 1)} kg de ${METAL[v.met].nombre}`],
        arrastres: [
          { id: 'ley', etiqueta: 'borde del metal en la mena', color: 'c-o',
            donde: v => { const g = PC().geometria(menaBarras(v)); return { x: g.xDe(0, v.ley), y: g.y(0) + g.hb / 2 }; },
            mover: (pt, v) => ({ ley: PC().geometria(menaBarras(v)).valorEn(0, pt.x) }) },
          { id: 'rec', etiqueta: 'borde de lo recuperado', color: 'c-d',
            donde: v => { const g = PC().geometria(menaBarras(v)); return { x: g.xDe(1, v.rec), y: g.y(1) + g.hb / 2 }; },
            mover: (pt, v) => ({ rec: PC().geometria(menaBarras(v)).valorEn(1, pt.x) }) },
        ],
        invitaciones: [
          { texto: 'Con 90 % de recuperación, busca la menor ley del mineral que dé 10 kg o más.',
            logrado: v => v.rec === 90 && kgSale(v) >= 10 && kgSale(Object.assign({}, v, { ley: v.ley - 0.5 })) < 10,
            bien: 'Ya alcanza, y aun así casi toda la tonelada se queda como roca.' },
          { texto: 'Saca exactamente 50 kg de metal de la tonelada de mena.',
            logrado: v => Math.abs(kgSale(v) - 50) < 1e-9,
            bien: '¿Encontraste otra pareja de ley y recuperación que también dé 50 kg?' },
          { texto: 'Haz que se pierda más metal del que se recupera.',
            logrado: v => 10 * v.ley - kgSale(v) > kgSale(v),
            bien: 'Bajo 50 % de recuperación, el relave se lleva más que la planta.' },
          { texto: 'Guarda dos menas con leyes distintas que den los mismos kilos de metal.',
            logrado: (v, guardados) => guardados.some(g => g.ley !== v.ley && Math.abs(kgSale(g) - kgSale(v)) < 1e-9),
            bien: 'Una mejor recuperación compensa una ley más pobre.' },
        ],
      },
      {
        id: 'oxigeno-libre', titulo: 'Oxígeno a gusto', pieza: 'quim-particulas',
        consigna: 'Dos moléculas de combustible y el oxígeno que quieras. Baja el oxígeno hasta que aparezca hollín y súbelo hasta que sobre.',
        controles: [
          { id: 'k', etiqueta: 'Combustible', opciones: Object.keys(COMB).map(k => ({ valor: k, texto: COMB[k].texto })) },
          { id: 'o', etiqueta: 'O₂ por molécula', color: 'c-h', min: 0.5, max: 3, paso: 0.5, inicio: 2, decimales: 1 },
        ],
        dibujo: v => combustion(v.k, v.o),
        lectura: v => leerPocos(v.k, v.o),
        invitaciones: [
          { texto: 'Baja el oxígeno hasta que aparezca hollín.',
            logrado: v => quemar(v.k, 2, v.o).hollin > 0,
            bien: 'Sin O₂ para todos, parte del carbono queda solo: hollín.' },
          { texto: 'Consigue una combustión incompleta que deje CO y nada de hollín.',
            logrado: v => { const p = quemar(v.k, 2, v.o); return p.co > 0 && p.hollin === 0; },
            bien: 'El CO no se ve ni huele: por eso es tan peligroso.' },
          { texto: 'Con carbón, busca el oxígeno justo: todo a CO₂ y que no sobre O₂.',
            logrado: v => { const p = quemar(v.k, 2, v.o); return v.k === 'carbon' && p.co === 0 && p.hollin === 0 && p.sobraO2 === 0; },
            bien: 'El carbón pide menos O₂ que el metano: no tiene H que quemar.' },
          { texto: 'Guarda metano y carbón con el mismo oxígeno: solo uno suelta CO.',
            logrado: (v, guardados) => { const sucio = x => { const p = quemar(x.k, 2, x.o); return p.co + p.hollin > 0; };
              return guardados.some(g => g.k !== v.k && g.o === v.o && sucio(g) !== sucio(v)); },
            bien: 'El metano gasta parte del O₂ en agua y le falta para su carbono.' },
        ],
      },
    ],
    ideas: [destilar, octanaje, combustionIdea, mena],
  };
});
