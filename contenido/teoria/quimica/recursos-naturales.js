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
  const hierven = t => FRAC.filter(x => (x.a === null || t >= x.a) && (x.b === null || t <= x.b)).map(x => x.n);
  const destilar = {
    id: 'destilar-separa',
    titulo: 'Destilar separa, craquear transforma',
    temas: ['Petróleo y refinación'],
    pieza: 'recta',
    juega: {
      consigna: 'En la torre, cada plato está a una temperatura. Elige una y mira qué fracciones del petróleo hierven en ese intervalo.',
      voz: 'Fíjate en que cada fracción ocupa un tramo, no un punto.',
      controles: [{ id: 't', etiqueta: 'T', color: 'c-h', min: 0, max: 400, paso: 25, inicio: 100, unidad: '°C', decimales: 0 }],
      dibujo: val => ({ datos: torre([{ tipo: 'punto', x: val.t, color: 'h', rotulo: `${f(val.t, 0)} °C`, fila: 0 }]), estado: {} }),
      lectura: val => [`A ${f(val.t, 0)} °C hierven: ${hierven(val.t).join(' y ') || 'ninguna'}.`],
      minimo: 3,
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
      ecuacion: ['separar ≠ transformar   ·   C₁₀H₂₂ → C₈H₁₈ + C₂H₄'],
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
      consigna: 'Elige un octanaje. La caja muestra la mezcla de referencia: isooctano (naranja, ramificado) y heptano (turquesa, en cadena) que detona igual.',
      voz: 'Cuenta cuántas de las 20 moléculas son isooctano.',
      controles: [{ id: 'o', etiqueta: 'Octanaje', min: 80, max: 100, paso: 5, inicio: 85, decimales: 0 }],
      dibujo: val => lupa([mezcla(val.o, `Detona como ${f(val.o, 0)} octanos`)]),
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
      ecuacion: ['octanaje = % de isooctano en la mezcla patrón que detona igual'],
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
  const leer = (k, o) => { const p = quemar(k, 2, o); return p.co || p.hollin ? `Sale ${p.co ? 'CO' : ''}${p.hollin ? (p.co ? ' y hollín' : 'hollín') : ''}: incompleta.` : `Todo el carbono termina en CO₂: completa${p.sobraO2 ? ', sobra O₂' : ''}.`; };
  const combustionIdea = {
    id: 'combustion',
    titulo: 'Con poco oxígeno sale CO',
    temas: ['Combustión completa e incompleta', 'Gas natural y carbón'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Quema dos moléculas de combustible con el oxígeno que elijas. Compara qué hay antes y después.',
      voz: 'Sigue a los átomos de carbono: ¿dónde terminan?',
      controles: [
        { id: 'k', etiqueta: 'Combustible', opciones: Object.keys(COMB).map(k => ({ valor: k, texto: COMB[k].texto })) },
        { id: 'o', etiqueta: 'O₂ por molécula', opciones: [{ valor: 'justo', texto: 'El justo' }, { valor: 'sobra', texto: 'De sobra' }] },
      ],
      dibujo: val => combustion(val.k, val.k === 'metano' ? (val.o === 'justo' ? 2 : 3) : (val.o === 'justo' ? 1 : 1.5)),
      lectura: val => [leer(val.k, val.k === 'metano' ? (val.o === 'justo' ? 2 : 3) : (val.o === 'justo' ? 1 : 1.5))],
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
      ecuacion: ['CH₄ + 2 O₂ → CO₂ + 2 H₂O   ·   C + O₂ → CO₂'],
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
      consigna: 'De 1 000 kg de mena, la ley dice qué parte es metal y la recuperación, qué parte de ese metal se logra sacar.',
      voz: 'Mira cuánto queda después de cada paso.',
      controles: [
        { id: 'met', etiqueta: 'Metal', opciones: Object.keys(METAL).map(k => ({ valor: k, texto: METAL[k].nombre })) },
        { id: 'ley', etiqueta: 'w', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 2, unidad: '%', decimales: 0 },
        { id: 'rec', etiqueta: 'r', color: 'c-d', min: 70, max: 95, paso: 5, inicio: 90, unidad: '%', decimales: 0 },
      ],
      dibujo: val => barra(val.ley, val.rec, val.met),
      lectura: val => [`Del total de la mena sale el ${f(val.ley * val.rec / 100, 2)} % como ${METAL[val.met].nombre}.`],
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
      ecuacion: [{ sub: [m, 'metal'] }, ' = ', { sub: [m, 'mena'] }, ' · ', w, ' · ', r],
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

  return {
    unidad: 'quimica.recursos-naturales',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/quim-cadena.js', '/nucleo/kit/piezas/quim-particulas.js'],
    historia: {
      texto: 'Cuando creció la demanda de gasolina, la pregunta fue si bastaba separar lo que el petróleo ya traía o si había que transformar sus moléculas. En 1937 empezó a operar a gran escala el craqueo catalítico de Houdry, fruto de un trabajo industrial colectivo. Desde entonces una refinería separa y transforma; son operaciones distintas.',
      pregunta: '¿Alcanzaría la gasolina si solo se separara del crudo?',
      fuente: { titulo: 'EIA, The refining process', url: 'https://www.eia.gov/energyexplained/oil-and-petroleum-products/refining-crude-oil-the-refining-process.php' },
    },
    ideas: [destilar, octanaje, combustionIdea, mena],
  };
});
