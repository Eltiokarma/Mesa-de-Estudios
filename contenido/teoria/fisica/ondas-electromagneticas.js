/*
 * Teoría de «Ondas electromagnéticas» (fisica.ondas-electromagneticas). Molde: contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 18), precisiones de física del expediente («todas viajan
 * a c» lleva «en vacío»; la onda dibujada representa campos, no la trayectoria del fotón) y
 * docs/investigacion/ondas-electromagneticas-ideas-erroneas.md (OE1: las ondas de radio son sonido).
 * Colores (regla 4): E naranja (c-o), B turquesa (c-i), λ verde (c-d), f rojo (c-h). c, n, t y d van en tinta.
 * Estado: completa (14 nov 2026): cuatro ideas, una por tema del catálogo.
 * Códigos de error nuevos (hipótesis, sin dato propio): OE-LENTO, OE-FREC, OE-POR-C, OE-C2, ES-UNIDAD, ES-INVERSA,
 * ES-POR, ME-FREC, ME-RAPIDEZ, ME-POR-N, ME-TIEMPO.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: cuatro relaciones de la luz y sus parientes, cada una jugada antes de preguntarla.
 *   Persona y condiciones: postulante de 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: relaciona E con B, calcula λ o f con c = λf y predice qué cambia al entrar a un medio.
 *   Orden de atención: 1.º la figura (onda, recta del espectro o gráfica) · 2.º la lectura en vivo · acción: botón fijo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué la radio, la luz y los rayos X son lo mismo y llegan a la vez?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const E = { v: 'c-o', t: 'E' }, B = { v: 'c-i', t: 'B' }, lam = { v: 'c-d', t: 'λ' }, fr = { v: 'c-h', t: 'f' };
  const C = 3e8;
  const E0 = { sub: [E, '0'] }, B0 = { sub: [B, '0'] }, lam0 = { sub: [lam, '0'] };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  // Notación científica en partes de ecuación: 3 × 10⁸ (sin «1 ×» cuando la mantisa es 1).
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function cient(x, dec = 2) {
    if (x === 0) return ['0'];
    const e = Math.floor(Math.log10(Math.abs(x)) + 1e-9), m = x / Math.pow(10, e);
    const mm = Math.round(m * 100) / 100;
    if (e === 0) return [f(mm, dec)];
    const pot = '10' + String(e).split('').map(ch => SUP[ch]).join('');
    return [mm === 1 ? pot : `${f(mm, dec)} × ${pot}`];
  }
  const cientTxt = (x, u, dec = 2) => [...cient(x, dec), ` ${u}`];
  // Opciones con texto en partes; dos opciones con el mismo texto plano se descartan.
  const plano = t => (Array.isArray(t) ? t.map(p => (typeof p === 'string' ? p : JSON.stringify(p))).join('') : String(t));
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([plano(fmt(correcta))]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (!Number.isFinite(d.valor) || d.valor <= 0) continue;
      const txt = plano(fmt(d.valor));
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: fmt(d.valor), error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Idea 1: E y B van juntos y cruzados ----------
  // Cambia: la amplitud de E y la longitud de onda · Permanece: la dirección de avance y la razón E/B = c ·
  // Progresa: E vertical, después B en profundidad, después las crestas a la par · Se reserva: el vacío, sin aire ·
  // Debe verse: E y B son perpendiculares entre sí y a la dirección de avance, y tienen sus máximos en el mismo lugar.
  // La onda se dibuja con fis-onda-em: amplitud relativa a 400 V/m y tantos ciclos como caben en 12 m de eje.
  const ondaEM = (Eamp, L, nota) => ({ amplitud: Eamp / 400, ciclos: 12 / L, rotuloL: `λ = ${f(L, 0)} m`, nota });
  const campos = {
    id: 'campos-cruzados',
    titulo: 'E y B, juntos y cruzados',
    temas: ['Características de las ondas electromagnéticas'],
    pieza: 'fis-onda-em',
    juega: {
      consigna: 'Una onda avanza hacia la derecha. La curva naranja es el campo eléctrico; la turquesa, el magnético, que oscila hacia el fondo.',
      voz: 'Busca la cresta naranja y mira qué hace la turquesa ahí.',
      controles: [
        { id: 'E', etiqueta: 'E₀', color: 'c-o', min: 100, max: 400, paso: 100, inicio: 300, unidad: 'V/m', decimales: 0 },
        { id: 'L', etiqueta: 'λ', color: 'c-d', min: 3, max: 6, paso: 1, inicio: 4, unidad: 'm', decimales: 0 },
      ],
      dibujo: val => ({ datos: ondaEM(val.E, val.L), estado: {} }),
      lectura: val => [B0, ' = ', E0, ' / c = ', ...cient(val.E / C), ' T'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Entre la Tierra y un satélite casi no hay aire. ¿Llegan las ondas de radio que manda la antena?',
      opciones: [
        { id: 'c', texto: 'Sí, y a 3 × 10⁸ m/s', correcta: true },
        { id: 'aire', texto: 'No: necesitan aire, como el sonido', error: 'OE1', siFuera: 'El sonido sí necesita aire. La radio es una onda de campos: no necesita medio.' },
        { id: 'lento', texto: 'Sí, pero más lentas que en el aire', error: 'OE-LENTO', siFuera: 'Un medio frena la onda, no la ayuda. En el vacío va a su máxima rapidez.' },
        { id: 'debil', texto: 'Solo si la antena es muy potente', error: 'OE1', siFuera: 'La potencia decide cuánta energía llega, no si puede viajar sin aire.' },
      ],
      dibujo: { datos: ondaEM(300, 4), estado: {} },
      revelar: { datos: ondaEM(300, 4, 'en el vacío avanza a c'), estado: {} },
      coincide: 'Coincide: las ondas electromagnéticas no necesitan un medio; así nos llega la luz del Sol.',
    },
    mira: {
      datos: ondaEM(300, 4),
      pasos: [
        { estado: { paso: 1 }, texto: 'El campo eléctrico oscila arriba y abajo, de cresta a cresta.', ecuacion: [E0, ' = 300 V/m'] },
        { estado: { paso: 2 }, texto: 'El campo magnético oscila hacia el fondo: perpendicular a E y al avance.', ecuacion: [E, ' ⊥ ', B, ' ⊥ avance'] },
        { estado: { paso: 3 }, texto: 'Sus máximos caen en el mismo lugar: van en fase.', ecuacion: ['cresta de ', E, ' = cresta de ', B] },
        { estado: { paso: 3 }, texto: 'En el vacío, E es c veces B.', ecuacion: [B0, ' = ', { frac: ['300', ['3 × ', { sup: ['10', '8'] }]] }, ' = ', { sup: ['10', '−6'] }, ' T'] },
      ],
    },
    regla: {
      texto: 'Una onda electromagnética son un campo eléctrico y uno magnético que oscilan en fase, perpendiculares entre sí y a su avance.',
      ecuacion: [E, ' = c ', B, '   ·   c = 3 × ', { sup: ['10', '8'] }, ' m/s'],
      condicion: 'vale en el vacío para una onda plana; no necesita medio material, y en un medio va más lenta.',
    },
    ahoraTu: {
      pieza: 'fis-onda-em',
      generar(s) {
        const r = azar(s), pide = s % 2 ? 'E' : 'B';
        const Ev = r.de([30, 60, 90, 150, 300, 600, 900]), Bv = Ev / C;
        const fmt = u => n => cientTxt(n, u);
        if (pide === 'B') return {
          pregunta: ['En el vacío, el campo eléctrico de una onda llega a ', E0, ` = ${f(Ev, 0)} V/m. ¿Cuánto vale `, B0, '?'],
          opciones: opciones(Bv, [
            { id: 'por', valor: Ev * C, error: 'OE-POR-C', siFuera: 'Eso multiplica por c. B es mucho menor: E = cB.' },
            { id: 'c2', valor: Ev / (C * C), error: 'OE-C2', siFuera: 'Eso divide entre c dos veces.' },
            { id: 'igual', valor: Ev, error: 'OE-POR-C', siFuera: 'E y B van en fase, pero no valen lo mismo.' },
          ], fmt('T')),
          solucion: { texto: 'B es E dividido entre c.', ecuacion: [B0, ` = ${f(Ev, 0)} / (3 × 10⁸) = `, ...cient(Bv), ' T'] },
        };
        return {
          pregunta: ['En el vacío, el campo magnético de una onda llega a ', B0, ' = ', ...cient(Bv), ' T. ¿Cuánto vale ', E0, '?'],
          opciones: opciones(Ev, [
            { id: 'div', valor: Bv / C, error: 'OE-POR-C', siFuera: 'Eso divide entre c; E es c veces B.' },
            { id: 'igual', valor: Bv, error: 'OE-POR-C', siFuera: 'E y B van en fase, pero E es c veces B.' },
            { id: 'c2', valor: Bv * C * C, error: 'OE-C2', siFuera: 'Eso multiplica por c dos veces.' },
          ], fmt('V/m')),
          solucion: { texto: 'E es c veces B.', ecuacion: [E0, ' = 3 × 10⁸ · ', ...cient(Bv), ` = ${f(Ev, 0)} V/m`] },
        };
      },
    },
  };

  // ---------- Idea 2: todas viajan a c ----------
  // Cambia: el tipo de onda y el destino · Permanece: la recta d–t, la misma para todas · Progresa: el punto de llegada ·
  // Se reserva: rayos X y radio que llegan a la vez a la Luna · Debe verse: en el vacío la rapidez no depende de f ni de λ.
  const DESTINOS = { gps: { d: 2.02e7, nombre: 'satélite GPS' }, geo: { d: 3.58e7, nombre: 'satélite geoestacionario' }, luna: { d: 3.84e8, nombre: 'la Luna' } };
  const TIPOS = { radio: 'radio', luz: 'luz visible', x: 'rayos X' };
  const rectaC = (puntos = [], extra = {}) => Object.assign({
    x: { min: 0, max: 1.4, paso: 0.2, nombre: 't', unidad: 's', decimales: 1 },
    y: { min: 0, max: 4, paso: 1, nombre: 'd', unidad: '×10⁸ m', decimales: 0 },
    curvas: [{ puntos: [[0, 0], [1.4, 4.2]], color: 'tinta', rotulo: 'todas: d = c t', en: [0.75, 1.1] }],
    puntos,
  }, extra);
  const rapidez = {
    id: 'todas-a-c',
    titulo: 'Todas viajan a c',
    temas: ['Rapidez de la luz'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige qué onda envías y a dónde. La recta muestra cuánto avanza cada segundo en el vacío.',
      voz: 'Cambia el tipo de onda y fíjate si el punto se mueve.',
      controles: [
        { id: 'tipo', etiqueta: 'Onda', opciones: Object.entries(TIPOS).map(([valor, texto]) => ({ valor, texto })) },
        { id: 'dest', etiqueta: 'Destino', opciones: [{ valor: 'gps', texto: 'GPS' }, { valor: 'geo', texto: 'geoestacionario' }, { valor: 'luna', texto: 'Luna' }] },
      ],
      dibujo: val => {
        const D = DESTINOS[val.dest], t = D.d / C;
        return { datos: rectaC([{ x: t, y: D.d / 1e8, color: 'tinta', rotulo: `${TIPOS[val.tipo]}: ${f(t, 3)} s`, guias: true }]), estado: {} };
      },
      lectura: val => [`Llega a ${DESTINOS[val.dest].nombre} en ${f(DESTINOS[val.dest].d / C, 3)} s`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Desde la Tierra salen a la vez un pulso de rayos X y uno de radio hacia la Luna. ¿Cuál llega primero?',
      opciones: [
        { id: 'c', texto: 'Llegan juntos', correcta: true },
        { id: 'x', texto: 'Los rayos X: tienen más frecuencia', error: 'OE-FREC', siFuera: 'Más frecuencia sí da más energía a cada fotón. La rapidez en el vacío es la misma.' },
        { id: 'radio', texto: 'La radio: su onda es más larga', error: 'OE-FREC', siFuera: 'Una onda más larga tiene menos frecuencia, pero avanza igual de rápido en el vacío.' },
      ],
      dibujo: { datos: rectaC(), estado: {} },
      revelar: { datos: rectaC([{ x: 1.28, y: 3.84, color: 'tinta', rotulo: 'X y radio: 1,28 s', guias: true }]), estado: {} },
      coincide: 'Coincide: en el vacío todas las ondas electromagnéticas van a 3 × 10⁸ m/s.',
    },
    mira: {
      datos: rectaC([{ x: 1.28, y: 3.84, color: 'tinta', rotulo: 'Luna: 1,28 s', guias: true, desde: 2 }]),
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada segundo, cualquier onda electromagnética avanza 3 × 10⁸ m en el vacío.', ecuacion: ['c = 3 × ', { sup: ['10', '8'] }, ' m/s'] },
        { estado: { corte: 2 }, texto: 'A la Luna hay 3,84 × 10⁸ m.', ecuacion: ['t = ', { frac: ['3,84 × 10⁸', '3 × 10⁸'] }, ' = 1,28 s'] },
        { estado: { corte: 2 }, texto: 'Radio y rayos X difieren en λ y f, no en su producto.', ecuacion: [lam, ' ', fr, ' = c'] },
      ],
    },
    regla: {
      texto: 'En el vacío todas las ondas electromagnéticas viajan con la misma rapidez c, sea cual sea su frecuencia.',
      ecuacion: ['c = ', lam, ' ', fr, ' = 3 × ', { sup: ['10', '8'] }, ' m/s   ·   d = c t'],
      condicion: 'en el vacío (y casi igual en el aire). En el agua o el vidrio van más lentas, y no todas igual.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), casos = [
          { que: 'la luz del Sol', d: 1.5e11 }, { que: 'una señal de un satélite geoestacionario', d: 3.6e7 },
          { que: 'un pulso de radar que va a la Luna', d: 3.84e8 }, { que: 'una señal de radio a Marte, en su punto más cercano', d: 5.4e10 },
          { que: 'una señal de un satélite GPS', d: 2.0e7 }, { que: 'la luz de Venus, en su punto más cercano', d: 3.9e10 },
        ];
        const c = casos[s % casos.length], t = c.d / C, fmt = n => cientTxt(n, 's', 3);
        void r;
        return {
          pregunta: ['¿Cuánto tarda ', c.que, ' en recorrer ', ...cient(c.d), ' m?'],
          opciones: opciones(t, [
            { id: 'por', valor: c.d * C, error: 'OE-POR-C', siFuera: 'Eso multiplica distancia por rapidez. El tiempo es d entre c.' },
            { id: 'inv', valor: C / c.d, error: 'OE-POR-C', siFuera: 'Eso divide c entre la distancia: está al revés.' },
            { id: 'sonido', valor: c.d / 340, error: 'OE1', siFuera: 'Eso usa la rapidez del sonido; la luz va a 3 × 10⁸ m/s.' },
          ], fmt),
          solucion: { texto: 'Distancia entre c.', ecuacion: ['t = ', ...cient(c.d), ' / (3 × 10⁸) = ', ...cient(t, 3), ' s'] },
        };
      },
    },
  };

  // ---------- Idea 3: el espectro es una sola regla ----------
  // Cambia: la banda elegida · Permanece: la regla de λ en potencias de diez · Progresa: el punto que se mueve por la regla ·
  // Se reserva: la luz visible, una franja angosta · Debe verse: radio, luz y rayos X son la misma onda con otra λ.
  const BANDAS = [
    { id: 'radio', texto: 'radio', a: 0, b: 3, tip: 3 },
    { id: 'micro', texto: 'microondas', a: -3, b: 0, tip: 0.12 },
    { id: 'ir', texto: 'infrarrojo', a: -6.1, b: -3, tip: 1e-5 },
    { id: 'vis', texto: 'visible', a: -6.4, b: -6.1, tip: 5.5e-7 },
    { id: 'uv', texto: 'ultravioleta', a: -8, b: -6.4, tip: 1e-7 },
    { id: 'x', texto: 'rayos X', a: -11, b: -8, tip: 1e-10 },
    { id: 'g', texto: 'gamma', a: -12, b: -11, tip: 1e-12 },
  ];
  const reglaEsp = (marca, extra = {}) => Object.assign({
    min: -12, max: 3, paso: 1, cada: 3, variable: 'log λ', color: 'd', filas: 4, decimales: 0,
    elementos: BANDAS.filter(b => b.id !== 'vis').map((b, i) => ({ tipo: 'intervalo', a: b.a, b: b.b, ca: true, cb: false, color: 'd', rotulo: b.texto, fila: i % 2, desde: 0 }))
      .concat([{ tipo: 'intervalo', a: -6.4, b: -6.1, ca: true, cb: true, color: 'h', rotulo: 'visible', fila: 2, desde: 0 }])
      .concat(marca !== undefined ? [{ tipo: 'punto', x: Math.log10(marca), color: 'o', rotulo: 'λ', fila: 3, desde: 0 }] : []),
  }, extra);
  const espectro = {
    id: 'espectro',
    titulo: 'El espectro es una regla',
    temas: ['Espectro electromagnético'],
    pieza: 'recta',
    juega: {
      consigna: 'La regla marca la longitud de onda en potencias de diez: −6 es 10⁻⁶ m. Elige una banda y lee su frecuencia.',
      voz: 'Fíjate en lo angosta que es la franja visible.',
      controles: [{ id: 'banda', etiqueta: 'Banda', opciones: BANDAS.map(b => ({ valor: b.id, texto: b.texto })) }],
      dibujo: val => ({ datos: reglaEsp(BANDAS.find(b => b.id === val.banda).tip), estado: {} }),
      lectura: val => { const b = BANDAS.find(x => x.id === val.banda); return [lam, ' ≈ ', ...cient(b.tip), ' m · ', fr, ' ≈ ', ...cient(C / b.tip), ' Hz']; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Una radio FM transmite con ', fr, ' = 100 MHz (', { sup: ['10', '8'] }, ' Hz). ¿Qué longitud de onda tiene su señal?'],
      opciones: [
        { id: 'c', texto: '3 m', correcta: true },
        { id: 'mhz', texto: '300 m', error: 'ES-UNIDAD', siFuera: '300 m sería cierto con 1 MHz. Aquí son 100 MHz.' },
        { id: 'inv', texto: '0,33 m', error: 'ES-INVERSA', siFuera: 'Eso divide f entre c; λ es c entre f.' },
        { id: 'por', texto: '3 × 10¹⁶ m', error: 'ES-POR', siFuera: 'Eso multiplica c por f; la onda sería más grande que el sistema solar.' },
      ],
      dibujo: { datos: reglaEsp(), estado: {} },
      revelar: { datos: reglaEsp(3), estado: {} },
      coincide: 'Coincide: 3 × 10⁸ entre 10⁸ da 3 m; cae en la banda de radio.',
    },
    mira: {
      datos: Object.assign(reglaEsp(), { elementos: reglaEsp().elementos.map(e => Object.assign({}, e, { desde: e.color === 'h' ? 2 : 1 })).concat([{ tipo: 'salto', a: 2, b: -11, color: 'h', rotulo: 'más f, más energía', fila: 3, desde: 3 }]) }),
      pasos: [
        { estado: { corte: 1 }, texto: 'De radio a gamma, todas son la misma onda de campos.', ecuacion: ['c = ', lam, ' ', fr] },
        { estado: { corte: 2 }, texto: 'La luz visible es una franja muy angosta: de 400 a 700 nm.', ecuacion: [lam, ' = 4 a 7 × ', { sup: ['10', '−7'] }, ' m'] },
        { estado: { corte: 3 }, texto: 'Hacia la izquierda λ baja y la frecuencia sube.', ecuacion: [fr, ' = ', { frac: ['c', lam] }] },
      ],
    },
    regla: {
      texto: 'El espectro ordena las ondas electromagnéticas por su longitud de onda. Como λf = c, a menor λ, mayor frecuencia.',
      ecuacion: [fr, ' = ', { frac: ['c', lam] }],
      condicion: 'en el vacío. Los límites entre bandas son convenciones: el espectro es continuo.',
    },
    ahoraTu: {
      generar(s) {
        const casos = [
          { que: 'del wifi', f: 2.4e9 }, { que: 'de un horno de microondas', f: 2.45e9 }, { que: 'de una radio AM', f: 1e6 },
          { que: 'de una luz verde', f: 5.6e14 }, { que: 'de una lámpara ultravioleta', f: 1.2e15 }, { que: 'de un equipo de rayos X', f: 3e18 },
          { que: 'de una radio FM', f: 9.6e7 }, { que: 'de un control remoto infrarrojo', f: 3.4e14 },
        ];
        const c = casos[s % casos.length], L = C / c.f, fmt = n => cientTxt(n, 'm', 3);
        return {
          pregunta: ['La onda ', c.que, ' tiene ', fr, ' = ', ...cient(c.f, 3), ' Hz. ¿Cuál es su longitud de onda en el aire?'],
          dibujo: { datos: reglaEsp(), estado: {} },
          opciones: opciones(L, [
            { id: 'inv', valor: c.f / C, error: 'ES-INVERSA', siFuera: 'Eso divide f entre c; λ es c entre f.' },
            { id: 'por', valor: c.f * C, error: 'ES-POR', siFuera: 'Eso multiplica c por f.' },
            { id: 'mil', valor: L * 1000, error: 'ES-UNIDAD', siFuera: 'Eso tiene mil veces de más: revisa los prefijos.' },
          ], fmt),
          solucion: { texto: 'c entre la frecuencia.', ecuacion: [lam, ' = 3 × 10⁸ / ', ...cient(c.f, 3), ' = ', ...cient(L, 3), ' m'], dibujo: { datos: reglaEsp(L), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: al cambiar de medio, f se queda ----------
  // Cambia: el color de la luz y el índice del medio · Permanece: la frecuencia, igual a los dos lados de la frontera ·
  // Progresa: las crestas que se aprietan al entrar · Se reserva: el color, que no cambia aunque λ cambie ·
  // Debe verse: λ y v bajan en la misma razón n; f y el color se conservan.
  const COLORES = { rojo: 700, verde: 530, violeta: 400 };
  function medio(L0nm, n, rot = true) {
    const pts = [], a = L0nm / 100, b = a / n;
    for (let k = 0; k <= 120; k++) { const x = k * 20 / 120; pts.push([x, x < 10 ? Math.sin(2 * Math.PI * (x - 10) / a) : Math.sin(2 * Math.PI * (x - 10) / b)]); }
    return {
      x: { min: 0, max: 20, paso: 5, nombre: 'x', unidad: '×100 nm', decimales: 0 },
      y: { min: -1.6, max: 1.6, paso: 0.8, nombre: 'E', decimales: 1, color: 'o' },
      curvas: [{ puntos: pts, color: 'o' }, { puntos: [[10, -1.6], [10, 1.6]], color: 'tinta', discontinua: true, rotulo: n > 1 ? `aire | n = ${f(n, 2)}` : 'aire | n = 1', en: [6.2, 1.4] }],
      puntos: rot ? [{ x: 0.6, y: -1.35, color: 'd', rotulo: `λ₀ = ${f(L0nm, 0)} nm` }, { x: 10.6, y: -1.35, color: 'd', rotulo: `λ = ${f(L0nm / n, 0)} nm` }] : [],
    };
  }
  const medioIdea = {
    id: 'cambio-de-medio',
    titulo: 'Al entrar, f se queda',
    temas: ['Luz visible', 'Características de las ondas electromagnéticas'],
    pieza: 'ejes',
    juega: {
      consigna: 'Luz que viene por el aire entra a la derecha en un medio transparente. Elige su color y el índice del medio.',
      voz: 'Compara las crestas a cada lado de la línea punteada.',
      controles: [
        { id: 'col', etiqueta: 'Color', opciones: Object.keys(COLORES).map(k => ({ valor: k, texto: k })) },
        { id: 'n', etiqueta: 'n', min: 1, max: 2.4, paso: 0.2, inicio: 1.4, unidad: '', decimales: 1 },
      ],
      dibujo: val => ({ datos: medio(COLORES[val.col], val.n), estado: {} }),
      lectura: val => [lam, ` = ${f(COLORES[val.col], 0)} / ${f(val.n, 1)} = ${f(COLORES[val.col] / val.n, 0)} nm · `, fr, ' igual'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Luz roja pasa del aire al agua. ¿Qué se mantiene igual?',
      opciones: [
        { id: 'c', texto: 'Su frecuencia, y por eso su color', correcta: true },
        { id: 'v', texto: 'Su rapidez', error: 'ME-RAPIDEZ', siFuera: 'La rapidez es la misma para todas en el vacío. En el agua baja a c/n.' },
        { id: 'l', texto: 'Su longitud de onda', error: 'ME-FREC', siFuera: 'λ se mantiene si la rapidez no cambia. Al frenar, las crestas se juntan.' },
        { id: 'nada', texto: 'Nada: cambian las tres', error: 'ME-FREC', siFuera: 'λ y v cambian, es cierto. La frecuencia la fija la fuente, no el medio.' },
      ],
      dibujo: { datos: medio(700, 1.33, false), estado: {} },
      revelar: { datos: medio(700, 1.33, true), estado: {} },
      coincide: 'Coincide: cada cresta que llega a la frontera la cruza; por segundo pasan las mismas.',
    },
    mira: {
      datos: Object.assign(medio(600, 1.5, false), { puntos: [{ x: 0.6, y: -1.35, color: 'd', rotulo: 'λ₀ = 600 nm', desde: 1 }, { x: 10.6, y: -1.35, color: 'd', rotulo: 'λ = 400 nm', desde: 3 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'En el aire, luz naranja de 600 nm.', ecuacion: [lam0, ' = 600 nm'] },
        { estado: { corte: 2 }, texto: 'Las crestas que llegan cada segundo son las que salen: f no cambia.', ecuacion: [fr, ' = ', { frac: ['c', lam0] }, ' = 5 × ', { sup: ['10', '14'] }, ' Hz'] },
        { estado: { corte: 3 }, texto: 'En el vidrio va n veces más lenta: las crestas se juntan.', ecuacion: ['v = ', { frac: ['c', 'n'] }, '   ·   ', lam, ' = ', { frac: ['600', '1,5'] }, ' = 400 nm'] },
      ],
    },
    regla: {
      texto: 'Al pasar de un medio a otro la frecuencia no cambia. La rapidez y la longitud de onda se dividen entre el índice n.',
      ecuacion: ['v = ', { frac: ['c', 'n'] }, '   ·   ', lam, ' = ', { frac: [lam0, 'n'] }, '   ·   ', fr, ' igual'],
      condicion: 'el medio es transparente y la frontera está quieta. n depende un poco del color; aquí se toma fijo.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), med = r.de([['agua', 1.33], ['vidrio', 1.5], ['diamante', 2.4], ['acrílico', 1.5], ['un aceite', 1.6]]);
        const L0 = r.de([400, 480, 520, 600, 640, 700]), n = med[1], pide = s % 2 ? 'v' : 'l';
        if (pide === 'l') {
          const L = L0 / n;
          return {
            pregunta: ['Luz de ', lam0, ` = ${f(L0, 0)} nm en el aire entra en ${med[0]} (n = ${f(n, 2)}). ¿Qué longitud de onda tiene dentro?`],
            opciones: opciones(L, [
              { id: 'igual', valor: L0, error: 'ME-FREC', siFuera: 'Lo que no cambia es la frecuencia; λ sí cambia.' },
              { id: 'por', valor: L0 * n, error: 'ME-POR-N', siFuera: 'Eso alarga la onda; al frenar, se acorta.' },
              { id: 'resta', valor: L0 - n * 100, error: 'ME-POR-N', siFuera: 'El índice divide; no se resta.' },
            ], x => `${f(x, 1)} nm`),
            solucion: { texto: 'Se divide entre el índice.', ecuacion: [lam, ` = ${f(L0, 0)} / ${f(n, 2)} = ${f(L, 1)} nm`] },
          };
        }
        const v = C / n;
        return {
          pregunta: [`¿Con qué rapidez viaja la luz dentro de ${med[0]}, de índice n = ${f(n, 2)}?`],
          opciones: opciones(v, [
            { id: 'vacio', valor: C, error: 'ME-RAPIDEZ', siFuera: 'Esa es la rapidez en el vacío; dentro del medio es menor.' },
            { id: 'por', valor: C * n, error: 'ME-POR-N', siFuera: 'Eso la hace más rápida; el medio la frena.' },
            { id: 'cua', valor: C / (n * n), error: 'ME-POR-N', siFuera: 'Eso divide dos veces entre n.' },
          ], x => cientTxt(x, 'm/s', 3)),
          solucion: { texto: 'c entre el índice.', ecuacion: ['v = 3 × 10⁸ / ', `${f(n, 2)} = `, ...cient(v, 3), ' m/s'] },
        };
      },
    },
  };

  return {
    unidad: 'fisica.ondas-electromagneticas',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-onda-em.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/recta.js'],
    historia: {
      texto: 'Electricidad, magnetismo e inducción parecían temas distintos. En 1865, Maxwell publicó una teoría del campo electromagnético que predecía ondas que avanzan solas, y calculó su rapidez: coincidía con la de la luz. La luz resultó ser una de esas ondas. Las cuatro ecuaciones compactas que se enseñan hoy son una reescritura posterior.',
      pregunta: '¿Qué tendría que medir alguien para saber que la luz es una onda de campos?',
      fuente: { titulo: 'Maxwell, A dynamical theory of the electromagnetic field (1865)', url: 'https://doi.org/10.1098/rstl.1865.0008' },
    },
    ideas: [campos, rapidez, espectro, medioIdea],
  };
});
