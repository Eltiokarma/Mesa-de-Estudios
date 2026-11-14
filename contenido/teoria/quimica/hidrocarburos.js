/*
 * Teoría de «Química orgánica: hidrocarburos» (quimica.hidrocarburos). Molde: docs/teoria.md y
 * contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 16), su historia y las precisiones de Química del
 * expediente («el nombre no sale solo de la cadena más larga»; girar no crea isómeros). Errores:
 * docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md (HC1–HC4) y atomo-enlace (EN6). Los
 * QM- son hipótesis nuevas de esta unidad.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: leer una estructura de hidrocarburo por sus uniones: cuántos H, qué familia, si es isómero y qué reacción sufre.
 *   Persona y condiciones: postulante de 4.º–5.º, celular de 360 px, sin audio; ya sabe qué es un enlace covalente.
 *   Resultado observable: escribe la fórmula molecular de una cadena o anillo, decide si dos dibujos son la misma
 *     molécula o isómeros, reconoce cis/trans y clasifica adición, sustitución, eliminación y combustión.
 *   Orden de atención: 1.º la estructura (uniones) · 2.º la lectura con la fórmula · acción: cambiar la molécula · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿girar el dibujo crea otra molécula?, ¿por qué un anillo tiene menos H?, ¿toda unión suelta agua?
 *
 * Colores (regla 4): número de carbonos n turquesa c-i, número de H naranja c-o, enlace doble o triple rojo c-h,
 * ángulo verde c-d. Los átomos de las estructuras van en tinta salvo el enlace múltiple y la cadena resaltada.
 * Datos (no van al alumno): ángulos ideales 109,5°, 120° y 180°; longitudes C–C 154 pm, C=C 134 pm, benceno
 * 140 pm, C≡C 120 pm (OpenStax Organic Chemistry §1.8–1.9 y §15.2). Nombres según IUPAC 2013 (P-31, P-44),
 * comprobados a mano: 2-metilbutano, 2,2-dimetilpropano, but-2-eno, 2-metilbut-2-eno, butan-2-ol.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const nC = { v: 'c-i', t: 'n' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    r.mezcla = l => { const x = l.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || d.valor === null || d.valor === undefined || (typeof d.valor === 'number' && !Number.isFinite(d.valor))) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const sb = n => String(n).split('').map(d => SUB[d]).join('');
  const formula = (c, h) => `C${c > 1 ? sb(c) : ''}H${h > 1 ? sb(h) : ''}`;

  // ---------- Estructuras: nodos [id, texto, x, y, color] y enlaces [a, b, orden, color] ----------
  // Coordenadas en unidades de la pieza quim-molecula (y hacia abajo). `mover` las traslada y les da prefijo y paso.
  function mover(est, dx, dy, pref, extra = {}) {
    return {
      atomos: est.n.map(([id, t, x, y, color]) => Object.assign({ id: pref + id, t, x: x + dx, y: y + dy }, color ? { color } : {}, extra)),
      enlaces: est.e.map(([a, b, orden, color]) => Object.assign({ a: pref + a, b: pref + b, orden: orden || 1 }, color ? { color } : {}, extra)),
    };
  }
  function figura(partes, extra = {}) {
    const d = Object.assign({ atomos: [], enlaces: [], escala: 40 }, extra);
    for (const p of partes) { d.atomos.push(...p.atomos); d.enlaces.push(...p.enlaces); }
    return { datos: d, estado: {} };
  }
  const ang = (g, r = 1) => [r * Math.cos(g * Math.PI / 180), r * Math.sin(g * Math.PI / 180)];

  // Fórmulas desarrolladas de C₂: el ángulo dibujado es el real (proyección plana), 0° = hacia el otro carbono.
  function dos(tipo) {
    const L = 1.3, n = [['c1', 'C', 0, 0], ['c2', 'C', L, 0]], e = [['c1', 'c2', { etano: 1, eteno: 2, etino: 3 }[tipo], tipo === 'etano' ? null : 'h']];
    const a = { etano: [109.5, -109.5, 180], eteno: [120, -120], etino: [180] }[tipo];
    a.forEach((g, k) => { const [x, y] = ang(g, 0.95); n.push([`h1${k}`, 'H', x, y]); e.push(['c1', `h1${k}`]); n.push([`h2${k}`, 'H', L - x, y]); e.push(['c2', `h2${k}`]); });
    return { n, e };
  }
  const C2 = {
    etano: { f: 'C₂H₆', lee: 'C₂H₆: solo enlaces simples · sp³ · 109,5°', ang: '109,5°', hib: 'sp³' },
    eteno: { f: 'C₂H₄', lee: 'C₂H₄: un enlace doble · sp² · 120°', ang: '120°', hib: 'sp²' },
    etino: { f: 'C₂H₂', lee: 'C₂H₂: un enlace triple · sp · 180°', ang: '180°', hib: 'sp' },
  };
  function vistaC2(tipo, conAngulo = true) {
    const p = mover(dos(tipo), 0, 0, '');
    const ex = { escala: 52, alto: 170 };
    if (conAngulo && tipo !== 'etino') ex.angulos = [{ en: 'c1', de: 'c2', a: 'h10', texto: C2[tipo].ang, color: 'd' }];
    if (tipo === 'etino') ex.textos = [{ x: 0.65, y: 0.75, t: '180°', color: 'd' }];
    return figura([p], ex);
  }

  // ---------- Idea 1: cuatro enlaces por carbono; la forma sale de los enlaces múltiples ----------
  // Cambia: el enlace entre los dos carbonos · Permanece: dos carbonos y la regla de cuatro enlaces · Progresa: simple,
  // doble, triple: menos H y ángulo más abierto · Se reserva: el propeno, donde cada carbono tiene su propia forma ·
  // Debe verse: que cada C siempre suma cuatro enlaces.
  function propeno(angulos) {
    const n = [['a', 'C', 0, 0], ['b', 'C', 1.3, 0], ['c', 'C', 1.95, 1.13]];
    const e = [['a', 'b', 2, 'h'], ['b', 'c']];
    n.push(['ha', 'H', -0.65, -0.82], ['hb', 'H', -0.65, 0.82], ['hc', 'H', 1.95, -0.82]);
    e.push(['a', 'ha'], ['a', 'hb'], ['b', 'hc']);
    // Carbono del CH₃: su vecino b está a −120°; dos H a 109,5° de ese enlace (dibujados con su ángulo real) y el
    // tercero en proyección.
    for (const [id, g] of [['h3', -10.5], ['h1', 130.5], ['h2', 60]]) { const [x, y] = ang(g, 0.95); n.push([id, 'H', 1.95 + x, 1.13 + y]); }
    e.push(['c', 'h1'], ['c', 'h2'], ['c', 'h3']);
    const extra = { escala: 44, alto: 200 };
    if (angulos) extra.angulos = [{ en: 'c', de: 'b', a: 'h3', texto: '109,5°', color: 'd' }, { en: 'a', de: 'b', a: 'ha', texto: '120°', color: 'd' }];
    return figura([mover({ n, e }, 0, 0, '')], extra);
  }
  const carbono = {
    id: 'carbono-enlaces',
    titulo: 'Cuatro enlaces por carbono',
    temas: ['El carbono e hibridación', 'Alcanos, alquenos y alquinos'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Cambia el enlace entre los dos carbonos. Cuenta los enlaces de cada C y mira el ángulo con sus vecinos.',
      voz: 'Cuenta los enlaces de un carbono: el doble vale dos.',
      controles: [{ id: 't', etiqueta: 'Enlace C–C', opciones: [{ valor: 'etano', texto: 'Simple' }, { valor: 'eteno', texto: 'Doble' }, { valor: 'etino', texto: 'Triple' }] }],
      dibujo: val => vistaC2(val.t),
      lectura: val => [C2[val.t].lee],
      minimo: 3,
    },
    predice: {
      pregunta: 'En el propeno, CH₂=CH–CH₃, un carbono tiene enlace doble y el del CH₃ solo simples. ¿Qué ángulo hay alrededor del carbono del CH₃?',
      voz: 'Mira cada carbono por separado.',
      opciones: [
        { id: 'c', texto: '109,5°, como en el etano', correcta: true },
        { id: 'toda', texto: '120°: el doble enlace manda en toda la molécula', error: 'QM-HIBRIDA-TODO', siFuera: '120° vale para los dos carbonos del doble enlace. El del CH₃ solo tiene enlaces simples.' },
        { id: 'plano', texto: '90°, como se ve en el papel', error: 'EN8', siFuera: 'En el papel puede verse así. La forma real sale de cuatro enlaces separados en el espacio.' },
        { id: 'lineal', texto: '180°', error: 'QM-HIBRIDA-TODO', siFuera: '180° sería con un enlace triple en ese carbono.' },
      ],
      dibujo: propeno(false),
      revelar: propeno(true),
      coincide: 'Coincide: cada carbono toma su forma según sus propios enlaces.',
      noCoincide: 'El carbono del CH₃ solo tiene simples: 109,5°, aunque su vecino tenga un doble.',
    },
    mira: {
      datos: (() => {
        const ps = [mover(dos('etano'), 0, 0, 'a', { desde: 1 }), mover(dos('eteno'), 0, 2.4, 'b', { desde: 2 }), mover(dos('etino'), 0, 4.6, 'c', { desde: 3 })];
        return figura(ps, {
          escala: 36,
          textos: [{ x: 4.4, y: 0, t: 'C₂H₆ · sp³', desde: 1, color: 'o' }, { x: 4.4, y: 2.4, t: 'C₂H₄ · sp²', desde: 2, color: 'o' }, { x: 4.4, y: 4.6, t: 'C₂H₂ · sp', desde: 3, color: 'o' }],
        }).datos;
      })(),
      voz: 'Comparemos las tres moléculas, carbono por carbono.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Solo simples: cada C tiene 4 vecinos a 109,5°. Alcano.', ecuacion: ['C', { sub: ['', [nC]] }, 'H', { sub: ['', ['2', nC, ' + 2']] }] },
        { estado: { corte: 2 }, texto: 'Un doble: el C tiene 3 vecinos a 120°. Alqueno, dos H menos.', ecuacion: ['C', { sub: ['', [nC]] }, 'H', { sub: ['', ['2', nC]] }] },
        { estado: { corte: 3 }, texto: 'Un triple: 2 vecinos en línea, a 180°. Alquino, otros dos H menos.', ecuacion: ['C', { sub: ['', [nC]] }, 'H', { sub: ['', ['2', nC, ' − 2']] }] },
        { estado: { corte: 3 }, texto: 'En los tres, cada carbono suma cuatro enlaces.' },
      ],
    },
    regla: {
      texto: 'Cada carbono forma cuatro enlaces. Con solo simples queda sp³ (109,5°); con un doble, sp² (120°); con un triple, sp (180°). Cada enlace extra quita dos H.',
      ecuacion: ['alcano CₙH₂ₙ₊₂ · alqueno CₙH₂ₙ · alquino CₙH₂ₙ₋₂'],
      condicion: 'las fórmulas generales valen para cadenas abiertas con un solo doble o triple. La hibridación se decide carbono por carbono.',
      voz: 'Primero los enlaces de cada carbono; la forma viene sola.',
    },
    ahoraTu: {
      voz: 'Cuenta los carbonos y fíjate en el enlace.',
      generar(s) {
        const r = azar(s), n = r.ent(3, 9), tipo = ['alcano', 'alqueno', 'alquino'][s % 3];
        const h = { alcano: 2 * n + 2, alqueno: 2 * n, alquino: 2 * n - 2 }[tipo];
        const desc = { alcano: 'solo enlaces simples', alqueno: 'un solo enlace doble', alquino: 'un solo enlace triple' }[tipo];
        return {
          pregunta: ['Una cadena abierta de ', nC, ` = ${n} carbonos tiene ${desc}. ¿Cuál es su fórmula molecular?`],
          opciones: opciones(h, [
            { id: 'alcano', valor: 2 * n + 2, error: 'QM-FORMULA-GENERAL', siFuera: 'Esa es la fórmula con solo enlaces simples. Cada enlace extra quita dos H.' },
            { id: 'alqueno', valor: 2 * n, error: 'QM-FORMULA-GENERAL', siFuera: 'Esa corresponde a un solo enlace doble (o a un anillo).' },
            { id: 'alquino', valor: 2 * n - 2, error: 'QM-FORMULA-GENERAL', siFuera: 'Esa corresponde a un solo enlace triple.' },
            { id: 'cuatro', valor: 4 * n, error: 'QM-4H', siFuera: 'Eso da 4 H a cada carbono. Los enlaces entre carbonos también ocupan lugares.' },
          ], hh => formula(n, hh)),
          solucion: { texto: `Con ${desc}, la familia es ${tipo}.`, ecuacion: [{ alcano: 'CₙH₂ₙ₊₂', alqueno: 'CₙH₂ₙ', alquino: 'CₙH₂ₙ₋₂' }[tipo], ` → ${formula(n, h)}`] },
        };
      },
    },
  };

  // ---------- Fórmulas semidesarrolladas: cadenas y anillos ----------
  const zig = (ts, dx = 1.15, dy = 0.6) => ({ n: ts.map((t, i) => [`k${i}`, t, i * dx, i % 2 ? dy : 0]), e: ts.slice(1).map((_, i) => [`k${i}`, `k${i + 1}`]) });
  function anillo(ts, lado = 1.25, ordenes = []) {
    const k = ts.length, R = lado / (2 * Math.sin(Math.PI / k)), g0 = -90 + (k % 2 ? 0 : 180 / k);
    return { n: ts.map((t, i) => { const [x, y] = ang(g0 + 360 * i / k, R); return [`r${i}`, t, x, y]; }), e: ts.map((_, i) => [`r${i}`, `r${(i + 1) % k}`, ordenes[i] || 1, ordenes[i] > 1 ? 'h' : null]) };
  }
  // Desarrolladas de C₄ (todas las uniones y todos los H).
  function desarrollada(tipo) {
    if (tipo === 'lineal') {
      const n = [], e = [];
      for (let i = 0; i < 4; i++) { n.push([`c${i}`, 'C', i * 1.2, 0], [`a${i}`, 'H', i * 1.2, -0.95], [`b${i}`, 'H', i * 1.2, 0.95]); e.push([`c${i}`, `a${i}`], [`c${i}`, `b${i}`]); if (i) e.push([`c${i - 1}`, `c${i}`]); }
      n.push(['hi', 'H', -0.95, 0], ['hd', 'H', 3.6 + 0.95, 0]); e.push(['c0', 'hi'], ['c3', 'hd']);
      return { n, e };
    }
    if (tipo === 'ramificada') {
      const n = [['c', 'C', 1.2, 0], ['i', 'C', 0, 0], ['d', 'C', 2.4, 0], ['b', 'C', 1.2, 1.2], ['hc', 'H', 1.2, -0.95]], e = [['c', 'i'], ['c', 'd'], ['c', 'b'], ['c', 'hc']];
      n.push(['i1', 'H', -0.95, 0], ['i2', 'H', 0, -0.95], ['i3', 'H', -0.55, 0.8], ['d1', 'H', 3.35, 0], ['d2', 'H', 2.4, -0.95], ['d3', 'H', 2.95, 0.8], ['b1', 'H', 0.3, 1.4], ['b2', 'H', 2.1, 1.4], ['b3', 'H', 1.2, 2.15]);
      e.push(['i', 'i1'], ['i', 'i2'], ['i', 'i3'], ['d', 'd1'], ['d', 'd2'], ['d', 'd3'], ['b', 'b1'], ['b', 'b2'], ['b', 'b3']);
      return { n, e };
    }
    const n = [['c0', 'C', 0, 0], ['c1', 'C', 1.3, 0], ['c2', 'C', 1.3, 1.3], ['c3', 'C', 0, 1.3]], e = [['c0', 'c1'], ['c1', 'c2'], ['c2', 'c3'], ['c3', 'c0']];
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([dx, dy], i) => {
      const [, , x, y] = n[i];
      n.push([`h${i}a`, 'H', x + dx * 0.85, y], [`h${i}b`, 'H', x, y + dy * 0.85]);
      e.push([`c${i}`, `h${i}a`], [`c${i}`, `h${i}b`]);
    });
    return { n, e };
  }
  const SEMI = {
    lineal: zig(['CH₃', 'CH₂', 'CH₂', 'CH₃']),
    ramificada: { n: [['k0', 'CH₃', 0, 0], ['k1', 'CH', 1.15, 0], ['k2', 'CH₃', 2.3, 0], ['k3', 'CH₃', 1.15, 1.1]], e: [['k0', 'k1'], ['k1', 'k2'], ['k1', 'k3']] },
    ciclica: anillo(['CH₂', 'CH₂', 'CH₂', 'CH₂'], 1.35),
  };
  const CADENA = { lineal: ['C₄H₁₀', 'cadena lineal'], ramificada: ['C₄H₁₀', 'cadena ramificada'], ciclica: ['C₄H₈', 'cadena cerrada (anillo)'] };
  const formulas = {
    id: 'formulas-cadenas',
    titulo: 'Una molécula, varias fórmulas',
    temas: ['Tipos de fórmulas y cadenas', 'Cicloalcanos'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Elige una cadena de cuatro carbonos y cómo escribirla. Cuenta los H en la fórmula desarrollada y compáralos con la semidesarrollada.',
      voz: 'Las dos fórmulas dicen lo mismo; una lo dice más corto.',
      controles: [
        { id: 'c', etiqueta: 'Cadena', opciones: [{ valor: 'lineal', texto: 'Lineal' }, { valor: 'ramificada', texto: 'Ramificada' }, { valor: 'ciclica', texto: 'Anillo' }] },
        { id: 'f', etiqueta: 'Fórmula', opciones: [{ valor: 'semi', texto: 'Semidesarrollada' }, { valor: 'des', texto: 'Desarrollada' }] },
      ],
      dibujo: val => figura([mover(val.f === 'des' ? desarrollada(val.c) : SEMI[val.c], 0, 0, '')], { escala: val.f === 'des' ? 40 : 44, alto: 200 }),
      lectura: val => [`${CADENA[val.c][0]} · ${CADENA[val.c][1]}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Unes los dos extremos del pentano (CH₃–CH₂–CH₂–CH₂–CH₃, C₅H₁₂) y formas un anillo con solo enlaces simples, el ciclopentano. ¿Cuál es su fórmula molecular?',
      voz: 'Piensa qué tiene que soltar cada extremo para unirse.',
      opciones: [
        { id: 'c', texto: 'C₅H₁₀', correcta: true },
        { id: 'igual', texto: 'C₅H₁₂, como el pentano', error: 'QM-ANILLO', siFuera: 'Los carbonos son los mismos, cierto. Pero cada extremo suelta un H para unirse con el otro.' },
        { id: 'cuatro', texto: 'C₅H₈', error: 'QM-ANILLO', siFuera: 'C₅H₈ sería un anillo con además un enlace doble. Cerrar el anillo quita solo dos H.' },
        { id: 'uno', texto: 'C₅H₅', error: 'QM-4H', siFuera: 'Un H por carbono dejaría carbonos con tres enlaces. Cada CH₂ del anillo lleva dos H.' },
      ],
      dibujo: figura([mover(zig(['CH₃', 'CH₂', 'CH₂', 'CH₂', 'CH₃']), 0, 0, '')], { escala: 44, alto: 190 }),
      revelar: figura([mover(anillo(['CH₂', 'CH₂', 'CH₂', 'CH₂', 'CH₂']), 0, 0, '')], { escala: 44, alto: 190, textos: [{ x: 0, y: 0.15, t: 'C₅H₁₀', color: 'o' }] }),
      coincide: 'Coincide: el anillo tiene dos H menos que la cadena abierta.',
      noCoincide: 'Cada extremo suelta un H para cerrar el anillo: C₅H₁₂ pasa a C₅H₁₀.',
    },
    mira: {
      datos: figura([
        mover(zig(['CH₃', 'CH₂', 'CH₂', 'CH₃']), -1.7, 0, 'a', { desde: 1, hasta: 2 }),
        mover(anillo(['CH₂', 'CH₂', 'CH₂', 'CH₂'], 1.35), 0, 2.6, 'b', { desde: 3 }),
      ], {
        escala: 44,
        textos: [
          { x: 0, y: -0.9, t: 'butano: C₄H₁₀', color: 'o', desde: 1, hasta: 2 },
          { x: -1.7, y: 1.3, t: '−1 H', color: 'o', desde: 2, hasta: 2 }, { x: 1.75, y: 1.3, t: '−1 H', color: 'o', desde: 2, hasta: 2 },
          { x: 0, y: 2.6, t: 'C₄H₈', color: 'o', desde: 3 },
        ],
      }).datos,
      voz: 'Sigamos el inventario de H mientras se cierra el anillo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Butano: cuatro carbonos en cadena abierta, 10 H.', ecuacion: ['CH₃–CH₂–CH₂–CH₃ = C₄H₁₀'] },
        { estado: { corte: 2 }, texto: 'Para unirse, cada extremo suelta un H.', ecuacion: ['10 − 2 = 8 H'] },
        { estado: { corte: 3 }, texto: 'El anillo: cuatro CH₂, todos iguales. Ciclobutano.', ecuacion: ['C₄H₈ = CₙH₂ₙ'] },
        { estado: { corte: 3 }, texto: 'C₄H₈ también es la fórmula de un buteno: la fórmula sola no distingue.' },
      ],
    },
    regla: {
      texto: 'La fórmula molecular cuenta átomos; la semidesarrollada y la desarrollada muestran las uniones. Cerrar una cadena en anillo quita dos H: un cicloalcano es CₙH₂ₙ.',
      ecuacion: ['CₙH₂ₙ₊₂ (abierta) → CₙH₂ₙ (un anillo)'],
      condicion: 'anillos con solo enlaces simples. La fórmula molecular sola no distingue un anillo de un doble enlace: C₄H₈ puede ser ambos.',
      voz: 'Cuenta los H de cada carbono y súmalos.',
    },
    ahoraTu: {
      voz: 'Suma los H de cada grupo.',
      generar(s) {
        const r = azar(s), n = r.ent(3, 6), cic = s % 2 === 1;
        let est, h;
        if (cic) { est = anillo(Array(n).fill('CH₂')); h = 2 * n; }
        else if (n >= 4 && r() < 0.5) { const ts = ['CH₃', 'CH', ...Array(n - 4).fill('CH₂'), 'CH₃']; est = zig(ts); est.n.push(['m', 'CH₃', 1.15, 1.6]); est.e.push(['k1', 'm']); h = 2 * n + 2; }
        else { est = zig(['CH₃', ...Array(n - 2).fill('CH₂'), 'CH₃']); h = 2 * n + 2; }
        return {
          pregunta: '¿Cuál es la fórmula molecular de esta estructura?',
          dibujo: figura([mover(est, 0, 0, '')], { escala: 42, alto: 190 }),
          opciones: opciones(h, [
            { id: 'abierta', valor: cic ? 2 * n + 2 : 2 * n, error: 'QM-ANILLO', siFuera: cic ? 'Esa sería la cadena abierta. El anillo tiene dos H menos.' : 'Esa sería con un anillo o un doble. Aquí la cadena está abierta, solo con simples.' },
            { id: 'cuatro', valor: 4 * n, error: 'QM-4H', siFuera: 'Eso da 4 H a cada carbono. Los enlaces entre carbonos ocupan lugares.' },
            { id: 'dos', valor: 2 * n - 2, error: 'QM-FORMULA-GENERAL', siFuera: 'Esa tendría un enlace triple o dos anillos. Aquí no los hay.' },
          ], hh => formula(n, hh)),
          solucion: { texto: `Hay ${n} carbonos; sumando los H de cada grupo salen ${h}.`, ecuacion: [formula(n, h), cic ? ' = CₙH₂ₙ (anillo)' : ' = CₙH₂ₙ₊₂'] },
        };
      },
    },
  };

  // ---------- Idea 3: el benceno, un anillo con los dobles repartidos ----------
  // Cambia: la estructura que se mira · Permanece: el hexágono de seis carbonos · Progresa: de dos fórmulas con
  // dobles alternados a una sola molécula con enlaces iguales · Se reserva: la medida de los enlaces (140 pm) · Debe
  // verse: que las dos fórmulas de Kekulé solo cambian dónde se dibujan los dobles.
  const BENZ_A = [2, 1, 2, 1, 2, 1], BENZ_B = [1, 2, 1, 2, 1, 2];
  const ANILLOS = {
    'kekule-a': { est: anillo(Array(6).fill('CH'), 1.2, BENZ_A), lee: 'C₆H₆, benceno: tres dobles alternados en todo el anillo.', arom: true, nombre: 'benceno' },
    'kekule-b': { est: anillo(Array(6).fill('CH'), 1.2, BENZ_B), lee: 'C₆H₆: los mismos átomos, dobles dibujados en el otro lugar.', arom: true, nombre: 'benceno' },
    tolueno: { est: (() => { const a = anillo(['C', 'CH', 'CH', 'CH', 'CH', 'CH'], 1.2, BENZ_A); a.n.push(['m', 'CH₃', 0, -2.35]); a.e.push(['r0', 'm']); return a; })(), lee: 'C₇H₈, tolueno: benceno con un CH₃. Aromático.', arom: true, nombre: 'tolueno' },
    ciclohexano: { est: anillo(Array(6).fill('CH₂'), 1.2), lee: 'C₆H₁₂, ciclohexano: solo simples. Anillo, pero no aromático.', arom: false, nombre: 'ciclohexano' },
    ciclohexeno: { est: anillo(['CH', 'CH', 'CH₂', 'CH₂', 'CH₂', 'CH₂'], 1.2, [2]), lee: 'C₆H₁₀, ciclohexeno: un solo doble. No aromático.', arom: false, nombre: 'ciclohexeno' },
  };
  const vistaAnillo = (k, extra = {}) => figura([mover(ANILLOS[k].est, 0, 0, '')], Object.assign({ escala: 44, alto: 220 }, extra));
  const aromatico = {
    id: 'aromaticos',
    titulo: 'El benceno y sus dobles repartidos',
    temas: ['Aromáticos'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Compara anillos de seis carbonos. Mira cuántos enlaces dobles tiene cada uno y si alternan con simples en todo el anillo.',
      voz: 'Compara dónde van los dobles, no la forma del anillo.',
      controles: [{ id: 'k', etiqueta: 'Anillo', opciones: Object.keys(ANILLOS).map(k => ({ valor: k, texto: { 'kekule-a': 'Benceno A', 'kekule-b': 'Benceno B', tolueno: 'Tolueno', ciclohexano: 'Ciclohexano', ciclohexeno: 'Ciclohexeno' }[k] })) }],
      dibujo: val => vistaAnillo(val.k),
      lectura: val => [ANILLOS[val.k].lee],
      minimo: 3,
    },
    predice: {
      pregunta: 'El benceno se dibuja con tres enlaces dobles y tres simples. Si se miden los seis enlaces C–C de la molécula real, ¿qué se encuentra?',
      voz: 'Antes de medir, decide qué esperas.',
      opciones: [
        { id: 'c', texto: 'Los seis miden lo mismo, entre simple y doble', correcta: true },
        { id: 'tres', texto: 'Tres cortos (dobles) y tres largos (simples)', error: 'EN6', siFuera: 'Así se dibuja una fórmula de Kekulé. La molécula real reparte los dobles en todo el anillo.' },
        { id: 'alterna', texto: 'Cambian de largo, porque los dobles saltan de lugar', error: 'EN6', siFuera: 'Las dos fórmulas no se turnan en el tiempo: describen juntas una sola molécula que no cambia.' },
      ],
      dibujo: vistaAnillo('kekule-a'),
      revelar: vistaAnillo('kekule-a', { textos: [{ x: 0, y: 1.95, t: 'los 6 enlaces: 140 pm', color: 'h' }] }),
      coincide: 'Coincide: los seis enlaces miden 140 pm.',
      noCoincide: 'Medidos, los seis enlaces son iguales: 140 pm.',
    },
    mira: {
      datos: figura([mover(ANILLOS['kekule-a'].est, 0, 0, 'a', { desde: 1 }), mover(ANILLOS['kekule-b'].est, 0, 3.6, 'b', { desde: 2 })], {
        escala: 40,
        flechas: [{ de: [0, 1.25], a: [0, 2.35], doble: true, desde: 2 }],
        textos: [{ x: 0, y: 5.2, t: 'C–C del anillo real: 140 pm', color: 'h', desde: 3 }],
      }).datos,
      voz: 'Comparemos las dos fórmulas lado a lado.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Fórmula de Kekulé: dobles y simples alternados.', ecuacion: ['C₆H₆'] },
        { estado: { corte: 2 }, texto: 'La otra fórmula: mismos átomos, dobles en el otro lugar.', ecuacion: ['A ↔ B (resonancia)'] },
        { estado: { corte: 3 }, texto: 'La molécula real no es A ni B: los seis enlaces son iguales.', ecuacion: ['154 pm > 140 pm > 134 pm'] },
        { estado: { corte: 3 }, texto: 'Ese reparto en todo el anillo es lo que se llama aromático.' },
      ],
    },
    regla: {
      texto: 'En el benceno, los electrones de los tres dobles se reparten por todo el anillo: las dos fórmulas describen una sola molécula, con seis enlaces iguales.',
      ecuacion: ['C₆H₆: enlace C–C de 140 pm, entre simple y doble'],
      condicion: 'aromático exige un anillo plano con dobles alternados en todo el ciclo. No significa «con olor» ni vale para cualquier anillo.',
      voz: 'Un anillo no basta: mira si los dobles alternan en toda la vuelta.',
    },
    ahoraTu: {
      voz: 'Recorre el anillo enlace por enlace.',
      generar(s) {
        const r = azar(s), ks = ['kekule-a', 'tolueno', 'ciclohexano', 'ciclohexeno', 'kekule-b'], k = ks[s % ks.length], a = ANILLOS[k];
        const si = { id: 'si', texto: 'Aromático: dobles alternados en toda la vuelta' };
        const no = { id: 'no', texto: 'No aromático: no alterna dobles en toda la vuelta' };
        const anillo6 = { id: 'anillo', texto: 'Aromático, porque es un anillo de seis', error: 'QM-ANILLO-AROM', siFuera: 'Tener anillo no basta. Sería aromático si los dobles alternaran en toda la vuelta.' };
        const extra = { id: 'extra', texto: 'No aromático, porque lleva un grupo extra', error: 'QM-ANILLO-AROM', siFuera: 'Un grupo unido al anillo no lo cambia: el anillo sigue alternando dobles.' };
        let ops;
        if (a.arom) ops = [Object.assign({ correcta: true }, si), Object.assign({ error: 'QM-ANILLO-AROM', siFuera: 'Sería así si faltara un doble en la vuelta. Aquí alternan en todo el anillo.' }, no), extra];
        else ops = [Object.assign({ correcta: true }, no), Object.assign({ error: 'QM-ANILLO-AROM', siFuera: 'Sería aromático si alternara dobles en toda la vuelta. Aquí faltan dobles.' }, si), anillo6];
        return {
          pregunta: `¿El ${a.nombre} es aromático?`,
          dibujo: vistaAnillo(k),
          opciones: r.mezcla(ops),
          solucion: { texto: a.arom ? 'Tiene tres dobles alternados en todo el anillo.' : 'Su anillo tiene enlaces simples que cortan la alternancia.', ecuacion: [a.lee.split(':')[0]] },
        };
      },
    },
  };

  // ---------- Idea 4: isómeros estructurales: mismas piezas, otras uniones ----------
  // Cambia: la estructura de C₅H₁₂ · Permanece: el inventario C₅H₁₂ · Progresa: de 5 en fila a 4 + 1 y a 3 + 2 ·
  // Se reserva: el pentano doblado, que es el mismo pentano · Debe verse: qué carbono se une con cuál.
  const EST = {
    pentano: zig(['CH₃', 'CH₂', 'CH₂', 'CH₂', 'CH₃']),
    'pentano-doblado': { n: [['k0', 'CH₃', 0, 0], ['k1', 'CH₂', 1.15, 0], ['k2', 'CH₂', 2.3, 0], ['k3', 'CH₂', 2.3, 1.15], ['k4', 'CH₃', 1.15, 1.15]], e: [['k0', 'k1'], ['k1', 'k2'], ['k2', 'k3'], ['k3', 'k4']] },
    metilbutano: { n: [['k0', 'CH₃', 0, 0], ['k1', 'CH', 1.15, 0.6], ['k2', 'CH₂', 2.3, 0], ['k3', 'CH₃', 3.45, 0.6], ['m', 'CH₃', 1.15, 1.75]], e: [['k0', 'k1'], ['k1', 'k2'], ['k2', 'k3'], ['k1', 'm']] },
    dimetilpropano: { n: [['k0', 'CH₃', 0, 0.6], ['k1', 'C', 1.15, 0.6], ['k2', 'CH₃', 2.3, 0.6], ['m1', 'CH₃', 1.15, -0.55], ['m2', 'CH₃', 1.15, 1.75]], e: [['k0', 'k1'], ['k1', 'k2'], ['k1', 'm1'], ['k1', 'm2']] },
    butano: zig(['CH₃', 'CH₂', 'CH₂', 'CH₃']),
    'butano-doblado': { n: [['k0', 'CH₃', 0, 0], ['k1', 'CH₂', 1.15, 0], ['k2', 'CH₂', 1.15, 1.15], ['k3', 'CH₃', 2.3, 1.15]], e: [['k0', 'k1'], ['k1', 'k2'], ['k2', 'k3']] },
    isobutano: SEMI.ramificada,
    propano: zig(['CH₃', 'CH₂', 'CH₃']),
    '1-cloropropano': zig(['CH₂Cl', 'CH₂', 'CH₃']),
    '2-cloropropano': { n: [['k0', 'CH₃', 0, 0], ['k1', 'CH', 1.15, 0], ['k2', 'CH₃', 2.3, 0], ['x', 'Cl', 1.15, 1.1]], e: [['k0', 'k1'], ['k1', 'k2'], ['k1', 'x']] },
    'metilbutano-espejo': { n: [['k0', 'CH₃', 3.45, 0], ['k1', 'CH', 2.3, 0.6], ['k2', 'CH₂', 1.15, 0], ['k3', 'CH₃', 0, 0.6], ['m', 'CH₃', 2.3, 1.75]], e: [['k0', 'k1'], ['k1', 'k2'], ['k2', 'k3'], ['k1', 'm']] },
  };
  const C5 = {
    pentano: { lee: 'C₅H₁₂: los cinco carbonos en una sola fila.', fila: ['k0', 'k1', 'k2', 'k3', 'k4'] },
    metilbutano: { lee: 'C₅H₁₂: cuatro en fila y una rama de un carbono.', fila: ['k0', 'k1', 'k2', 'k3'] },
    dimetilpropano: { lee: 'C₅H₁₂: tres en fila y dos ramas en el centro.', fila: ['k0', 'k1', 'k2'] },
  };
  const isomeros = {
    id: 'isomeros-estructurales',
    titulo: 'Mismos átomos, otras uniones',
    temas: ['Isomería estructural y geométrica'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Las tres estructuras tienen cinco carbonos y doce hidrógenos. Elige una y busca su fila de carbonos más larga.',
      voz: 'Sigue las uniones con el dedo, carbono por carbono.',
      controles: [{ id: 'k', etiqueta: 'Estructura', opciones: [{ valor: 'pentano', texto: 'Pentano' }, { valor: 'metilbutano', texto: '2-metilbutano' }, { valor: 'dimetilpropano', texto: '2,2-dimetilpropano' }] }],
      dibujo: val => figura([mover(EST[val.k], 0, 0, '')], { escala: 44, alto: 190, resaltos: [{ atomos: C5[val.k].fila, color: 'i' }] }),
      lectura: val => [C5[val.k].lee],
      minimo: 3,
    },
    predice: {
      pregunta: 'Esta figura es el pentano dibujado con la cadena doblada. Comparada con el pentano en fila, ¿qué es?',
      voz: 'Compara uniones, no la forma del dibujo.',
      opciones: [
        { id: 'c', texto: 'La misma molécula, dibujada de otra forma', correcta: true },
        { id: 'isomero', texto: 'Un isómero estructural, porque cambió la forma', error: 'QM-GIRO', siFuera: 'Sería isómero si cambiara qué carbono se une con cuál. Aquí la fila sigue siendo de cinco.' },
        { id: 'otra', texto: 'Otro compuesto, con otra fórmula molecular', error: 'HC1', siFuera: 'Sería otro compuesto si cambiara el número de átomos. Sigue siendo C₅H₁₂.' },
      ],
      dibujo: figura([mover(EST['pentano-doblado'], 0, 0, '')], { escala: 44, alto: 190 }),
      revelar: figura([mover(EST['pentano-doblado'], 0, 0, '')], { escala: 44, alto: 190, resaltos: [{ atomos: ['k0', 'k1', 'k2', 'k3', 'k4'], color: 'i', texto: 'cinco en fila' }] }),
      coincide: 'Coincide: las uniones son las mismas, aunque el dibujo se doble.',
      noCoincide: 'Siguiendo las uniones salen cinco carbonos en fila: es el mismo pentano.',
    },
    mira: {
      datos: figura([mover(EST.pentano, 0, 0, 'a', { desde: 1 }), mover(EST.metilbutano, -0.1, 2.0, 'b', { desde: 2 }), mover(EST.dimetilpropano, 0.5, 5.3, 'c', { desde: 3 })], {
        escala: 40,
        resaltos: [{ atomos: ['ak0', 'ak1', 'ak2', 'ak3', 'ak4'], color: 'i', desde: 1 }, { atomos: ['bk0', 'bk1', 'bk2', 'bk3'], color: 'i', desde: 2 }, { atomos: ['ck0', 'ck1', 'ck2'], color: 'i', desde: 3 }],
      }).datos,
      voz: 'Busquemos la fila más larga en cada una.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Pentano: los cinco carbonos en una sola fila.', ecuacion: ['C₅H₁₂'] },
        { estado: { corte: 2 }, texto: '2-metilbutano: fila de cuatro y una rama en el carbono 2.', ecuacion: ['C₅H₁₂'] },
        { estado: { corte: 3 }, texto: '2,2-dimetilpropano: fila de tres y dos ramas en el carbono 2.', ecuacion: ['C₅H₁₂'] },
        { estado: { corte: 3 }, texto: 'Misma fórmula, otras uniones: son tres isómeros estructurales.' },
      ],
    },
    regla: {
      texto: 'Isómeros estructurales: misma fórmula molecular y distintas uniones entre átomos. Girar o doblar el dibujo no cambia ninguna unión: es la misma molécula.',
      ecuacion: ['pentano, 2-metilbutano y 2,2-dimetilpropano: C₅H₁₂'],
      condicion: 'se comparan uniones, no la forma del dibujo. Para nombrar, la cadena principal sigue reglas IUPAC, no solo su largo.',
      voz: 'Si las uniones coinciden, es la misma molécula.',
    },
    ahoraTu: {
      voz: 'Cuenta átomos primero; después compara uniones.',
      generar(s) {
        const PARES = [
          ['butano', 'butano-doblado', 'misma'], ['butano', 'isobutano', 'isomeros'], ['pentano', 'metilbutano', 'isomeros'],
          ['pentano', 'pentano-doblado', 'misma'], ['propano', 'butano', 'distinta'], ['1-cloropropano', '2-cloropropano', 'isomeros'],
          ['metilbutano', 'metilbutano-espejo', 'misma'], ['isobutano', 'dimetilpropano', 'distinta'],
        ];
        const r = azar(s), [a, b, rel] = PARES[s % PARES.length];
        const textos = {
          misma: ['La misma molécula', 'Las uniones de A y B son las mismas; solo cambia el dibujo.'],
          isomeros: ['Isómeros estructurales', 'Tienen la misma fórmula molecular y otras uniones.'],
          distinta: ['Compuestos con distinta fórmula', 'Tienen distinto número de átomos.'],
        };
        const si = {
          misma: 'Sería la misma si cada carbono tuviera los mismos vecinos en A y en B.',
          isomeros: 'Serían isómeros si tuvieran los mismos átomos con otras uniones.',
          distinta: 'Sería otro compuesto si el número de átomos fuera distinto.',
        };
        const err = { misma: 'QM-GIRO', isomeros: 'HC1', distinta: 'HC1' };
        const ops = r.mezcla(Object.keys(textos).map(k => (k === rel ? { id: 'c', texto: textos[k][0], correcta: true } : { id: k, texto: textos[k][0], error: err[rel], siFuera: si[k] })));
        return {
          pregunta: 'Compara las estructuras A y B. ¿Qué relación hay entre ellas?',
          dibujo: figura([mover(EST[a], 0, 0, 'a'), mover(EST[b], 0, 2.7, 'b')], { escala: 42, alto: 270, textos: [{ x: -1.0, y: 0.3, t: 'A', peso: 700 }, { x: -1.0, y: 3.0, t: 'B', peso: 700 }] }),
          opciones: ops,
          solucion: { texto: textos[rel][1], ecuacion: [textos[rel][0]] },
        };
      },
    },
  };

  // ---------- Idea 5: cis, trans y la imagen en el espejo ----------
  // Cambia: los grupos de cada carbono del doble enlace · Permanece: el doble enlace, que no deja girar · Progresa:
  // de cis/trans a un carbono con cuatro grupos distintos · Se reserva: el espejo, al final · Debe verse: si cada C
  // del doble lleva dos grupos distintos.
  function alqueno(g, dobleColor = 'h') {
    // g = [arriba-izq, abajo-izq, arriba-der, abajo-der]
    const n = [['a', 'C', 0, 0], ['b', 'C', 1.3, 0], ['g0', g[0], -0.7, -0.85], ['g1', g[1], -0.7, 0.85], ['g2', g[2], 2.0, -0.85], ['g3', g[3], 2.0, 0.85]];
    return { n, e: [['a', 'b', 2, dobleColor], ['a', 'g0'], ['a', 'g1'], ['b', 'g2'], ['b', 'g3']] };
  }
  const ALQ = {
    cis: { g: ['CH₃', 'H', 'CH₃', 'H'], lee: 'cis-but-2-eno: los dos CH₃ del mismo lado.', nombre: 'but-2-eno', tiene: true },
    trans: { g: ['CH₃', 'H', 'H', 'CH₃'], lee: 'trans-but-2-eno: los CH₃ en lados opuestos.', nombre: 'but-2-eno', tiene: true },
    'but-1-eno': { g: ['H', 'H', 'CH₂CH₃', 'H'], lee: 'but-1-eno: un C del doble tiene dos H iguales.', nombre: 'but-1-eno', tiene: false },
  };
  const QUIRAL = (izq) => {
    const s = izq ? 1 : -1;
    return { n: [['c', 'C', 0, 0], ['h', 'H', 0, -1.0], ['oh', 'OH', s * 1.1, 0], ['m', 'CH₃', 0, 1.0], ['e', 'CH₂CH₃', -s * 1.7, 0]], e: [['c', 'h'], ['c', 'oh'], ['c', 'm'], ['c', 'e']] };
  };
  const geometrica = {
    id: 'cis-trans-optica',
    titulo: 'Cis, trans y el espejo',
    temas: ['Isomería estructural y geométrica', 'Isomería óptica (solo San Marcos)'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Cambia los grupos de cada carbono del doble enlace. Mira si los dos CH₃ quedan del mismo lado o en lados opuestos.',
      voz: 'Mira los dos grupos de cada carbono del doble enlace.',
      controles: [{ id: 'k', etiqueta: 'Molécula', opciones: [{ valor: 'cis', texto: 'cis-but-2-eno' }, { valor: 'trans', texto: 'trans-but-2-eno' }, { valor: 'but-1-eno', texto: 'but-1-eno' }] }],
      dibujo: val => figura([mover(alqueno(ALQ[val.k].g), 0, 0, '')], { escala: 48, alto: 170 }),
      lectura: val => [ALQ[val.k].lee],
      minimo: 3,
    },
    predice: {
      pregunta: 'A temperatura ambiente, ¿puede el cis-but-2-eno volverse trans solo con girar sus carbonos alrededor del doble enlace?',
      voz: 'Piensa en qué deja girar y qué no.',
      opciones: [
        { id: 'c', texto: 'No: el doble enlace no deja girar; son dos isómeros', correcta: true },
        { id: 'gira', texto: 'Sí: girar nunca crea isómeros', error: 'QM-GIRO-DOBLE', siFuera: 'Girar no crea isómeros en un enlace simple. El doble no gira sin romperse.' },
        { id: 'dibujo', texto: 'Sí: cis y trans son el mismo dibujo volteado', error: 'QM-GIRO-DOBLE', siFuera: 'Voltear toda la molécula no cambia nada, cierto. Pero cis no se vuelve trans así.' },
      ],
      dibujo: figura([mover(alqueno(ALQ.cis.g), 0, 0, '')], { escala: 48, alto: 170 }),
      revelar: figura([mover(alqueno(ALQ.cis.g), 0, 0, 'a'), mover(alqueno(ALQ.trans.g), 4.3, 0, 'b')], { escala: 30, alto: 170, textos: [{ x: 0.65, y: 1.5, t: 'cis' }, { x: 4.95, y: 1.5, t: 'trans' }, { x: 2.8, y: -1.35, t: 'el doble no gira', color: 'h' }] }),
      coincide: 'Coincide: el doble enlace fija a los grupos en su lado.',
      noCoincide: 'Para pasar de cis a trans habría que romper el doble enlace: no basta girar.',
    },
    mira: {
      datos: figura([
        mover(alqueno(ALQ.cis.g), 0, 0, 'a', { desde: 1 }), mover(alqueno(ALQ.trans.g), 4.3, 0, 'b', { desde: 1 }),
        mover(QUIRAL(true), 1.0, 3.4, 'c', { desde: 3 }), mover(QUIRAL(false), 4.6, 3.4, 'd', { desde: 3 }),
      ], {
        escala: 34,
        textos: [{ x: 0.65, y: 1.5, t: 'cis', desde: 1 }, { x: 4.95, y: 1.5, t: 'trans', desde: 1 }, { x: 2.8, y: 2.3, t: 'espejo', desde: 3 }],
        flechas: [{ de: [2.8, 2.6], a: [2.8, 4.4], doble: true, desde: 3 }],
        resaltos: [{ atomos: ['ag0', 'ag1'], color: 'd', desde: 2 }, { atomos: ['ag2', 'ag3'], color: 'd', desde: 2 }],
      }).datos,
      voz: 'Revisemos qué condición tiene cada caso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'cis y trans: los mismos átomos y las mismas uniones.', ecuacion: ['C₄H₈'] },
        { estado: { corte: 2 }, texto: 'Cada C del doble lleva dos grupos distintos: CH₃ y H.', ecuacion: ['CH₃ ≠ H en los dos carbonos'] },
        { estado: { corte: 3 }, texto: 'Butan-2-ol: un C con cuatro grupos distintos, y su espejo.', ecuacion: ['H, OH, CH₃, CH₂CH₃'] },
        { estado: { corte: 3 }, texto: 'En el espacio, esas dos versiones no se superponen: isómeros ópticos.' },
      ],
    },
    regla: {
      texto: 'Hay cis y trans si cada carbono del doble enlace lleva dos grupos distintos. Un carbono con cuatro grupos distintos suele dar dos isómeros ópticos, uno espejo del otro.',
      ecuacion: ['cis: mismo lado   ·   trans: lados opuestos'],
      condicion: '«cuatro grupos distintos» es una guía, no un criterio universal: decide que la molécula y su espejo no se superpongan.',
      voz: 'Revisa los dos grupos de cada carbono antes de decidir.',
    },
    ahoraTu: {
      voz: 'Revisa los grupos de cada carbono.',
      generar(s) {
        const r = azar(s);
        const ALQS = [
          ['but-2-eno', ['CH₃', 'H', 'CH₃', 'H'], true], ['but-1-eno', ['H', 'H', 'CH₂CH₃', 'H'], false], ['propeno', ['H', 'H', 'CH₃', 'H'], false],
          ['pent-2-eno', ['CH₃', 'H', 'CH₂CH₃', 'H'], true], ['2-metilbut-2-eno', ['CH₃', 'CH₃', 'CH₃', 'H'], false], ['1,2-dicloroeteno', ['Cl', 'H', 'Cl', 'H'], true],
          ['1,1-dicloroeteno', ['Cl', 'Cl', 'H', 'H'], false],
        ];
        const [nom, g, tiene] = ALQS[s % ALQS.length];
        const si = { id: 'si', texto: 'Sí: cada C del doble tiene dos grupos distintos' };
        const no = { id: 'no', texto: 'No: un C del doble tiene dos grupos iguales' };
        const todo = { id: 'todo', texto: 'Sí: todo doble enlace los tiene', error: 'HC4', siFuera: 'Sería así si cada C del doble llevara dos grupos distintos. Revisa los dos grupos de cada uno.' };
        const ops = tiene
          ? [Object.assign({ correcta: true }, si), Object.assign({ error: 'HC4', siFuera: 'Sería así si un carbono tuviera dos grupos iguales. Aquí cada uno tiene dos distintos.' }, no)]
          : [Object.assign({ correcta: true }, no), Object.assign({ error: 'HC4', siFuera: 'Sería así si cada carbono tuviera dos grupos distintos. Aquí uno repite grupo.' }, si), todo];
        return {
          pregunta: `¿El ${nom} tiene isómeros cis y trans?`,
          dibujo: figura([mover(alqueno(g), 0, 0, '')], { escala: 48, alto: 170 }),
          opciones: r.mezcla(ops),
          solucion: { texto: tiene ? 'Cada carbono del doble lleva dos grupos distintos.' : 'Un carbono del doble lleva dos grupos iguales: no hay cis ni trans.', ecuacion: [`${g[0]}, ${g[1]} | ${g[2]}, ${g[3]}`] },
        };
      },
    },
  };

  // ---------- Idea 6: adición, sustitución, eliminación y combustión ----------
  // Cambia: la reacción · Permanece: reactivos arriba, productos abajo, flecha entre ambos · Progresa: qué enlace se
  // abre, qué átomo se cambia, qué sale · Se reserva: la adición de agua, que la consume y no la suelta · Debe verse:
  // si los productos son una sola molécula o varias.
  // Ancho aproximado de un rótulo, en unidades de la figura (escala 36): para que «+» no pise a nadie.
  const medio = t => 0.12 * String(t).length + 0.2;
  function fila(partes, y, pref, extra) {
    // partes: estructuras y '+', en orden; cada estructura empieza donde terminó el rótulo anterior.
    const out = []; let x = 0, k = 0; const textos = [];
    for (const p of partes) {
      if (p === '+') { textos.push(Object.assign({ x: x + 0.3, y, t: '+', peso: 700 }, extra)); x += 0.6; continue; }
      const izq = Math.min(...p.n.map(a => a[2] - medio(a[1]))), der = Math.max(...p.n.map(a => a[2] + medio(a[1])));
      out.push(mover(p, x - izq, y, `${pref}${k++}`, extra)); x += der - izq;
    }
    return { partes: out, textos, ancho: x };
  }
  const M = {
    eteno: { n: [['a', 'CH₂', 0, 0], ['b', 'CH₂', 1.3, 0]], e: [['a', 'b', 2, 'h']] },
    etano: { n: [['a', 'CH₃', 0, 0], ['b', 'CH₃', 1.3, 0]], e: [['a', 'b']] },
    h2: { n: [['a', 'H', 0, 0], ['b', 'H', 0.8, 0]], e: [['a', 'b']] },
    agua: { n: [['a', 'H', 0, 0], ['o', 'O', 0.8, 0], ['b', 'H', 1.6, 0]], e: [['a', 'o'], ['o', 'b']] },
    etanol: { n: [['a', 'CH₃', 0, 0], ['b', 'CH₂', 1.3, 0], ['c', 'OH', 2.5, 0]], e: [['a', 'b'], ['b', 'c']] },
    metano: { n: [['a', 'CH₄', 0, 0]], e: [] },
    cl2: { n: [['a', 'Cl', 0, 0], ['b', 'Cl', 0.95, 0]], e: [['a', 'b']] },
    clorometano: { n: [['a', 'CH₃', 0, 0], ['b', 'Cl', 1.1, 0]], e: [['a', 'b']] },
    hcl: { n: [['a', 'H', 0, 0], ['b', 'Cl', 0.85, 0]], e: [['a', 'b']] },
    o2: { n: [['a', '2 O₂', 0, 0]], e: [] },
    co2: { n: [['a', 'CO₂', 0, 0]], e: [] },
    agua2: { n: [['a', '2 H₂O', 0, 0]], e: [] },
  };
  const REAC = {
    adicion: { r: [M.eteno, '+', M.h2], p: [M.etano], lee: 'Adición: el doble se abre y todo queda en una molécula.' },
    sustitucion: { r: [M.metano, '+', M.cl2], p: [M.clorometano, '+', M.hcl], lee: 'Sustitución: un H sale y un Cl toma su lugar.' },
    eliminacion: { r: [M.etanol], p: [M.eteno, '+', M.agua], lee: 'Eliminación: salen H y OH vecinos; se forma un doble.' },
    combustion: { r: [M.metano, '+', M.o2], p: [M.co2, '+', M.agua2], lee: 'Combustión: el carbono termina en CO₂ y el hidrógeno en agua.' },
  };
  function reaccion(k, conProductos = true, extra = {}) {
    const R = fila(REAC[k].r, 0, 'r', {}), P = fila(REAC[k].p, 2.4, 'p', conProductos ? {} : { desde: 99 });
    const desplaza = (fl, dx) => fl.partes.forEach(p => p.atomos.forEach(a => { a.x += dx; })) || fl.textos.forEach(t => { t.x += dx; });
    const W = Math.max(R.ancho, P.ancho);
    desplaza(R, (W - R.ancho) / 2); desplaza(P, (W - P.ancho) / 2);
    const fig = figura([...R.partes, ...P.partes], Object.assign({ escala: 36, alto: 190, flechas: [{ de: [W / 2, 0.55], a: [W / 2, 1.85] }], textos: [...R.textos, ...P.textos] }, extra));
    return fig;
  }
  const reacciones = {
    id: 'reacciones-organicas',
    titulo: 'Qué enlace cambia en la reacción',
    temas: ['Tipos de reacciones orgánicas'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Elige una reacción. Arriba están los reactivos y abajo, los productos. Mira qué enlace se abre, qué átomo cambia de lugar y qué sale.',
      voz: 'Haz el inventario: ¿los productos son una molécula o varias?',
      controles: [{ id: 'k', etiqueta: 'Reacción', opciones: [{ valor: 'adicion', texto: 'Adición' }, { valor: 'sustitucion', texto: 'Sustitución' }, { valor: 'eliminacion', texto: 'Eliminación' }, { valor: 'combustion', texto: 'Combustión' }] }],
      dibujo: val => reaccion(val.k),
      lectura: val => [REAC[val.k].lee],
      minimo: 3,
    },
    predice: {
      pregunta: 'El eteno reacciona con agua (CH₂=CH₂ + H₂O) y se forma etanol. ¿Sale alguna molécula pequeña en esta unión?',
      voz: 'Haz el inventario de átomos antes de responder.',
      opciones: [
        { id: 'c', texto: 'No: el agua entra entera y no sale nada', correcta: true },
        { id: 'agua', texto: 'Sí: sale agua, como en toda unión', error: 'QM-AGUA', siFuera: 'Algunas uniones sueltan agua, como la de un ácido con un alcohol. Esta es una adición: no sale nada.' },
        { id: 'h2', texto: 'Sí: sale H₂ del doble enlace', error: 'QM-ADICION', siFuera: 'Saldría algo en una eliminación. Aquí el doble se abre y recibe átomos.' },
      ],
      dibujo: (() => { const R = fila([M.eteno, '+', M.agua], 0, 'r', {}); return figura(R.partes, { escala: 36, alto: 190, textos: R.textos, flechas: [{ de: [R.ancho / 2, 0.55], a: [R.ancho / 2, 1.85] }] }); })(),
      revelar: (() => {
        const R = fila([M.eteno, '+', M.agua], 0, 'r', {}), P = fila([{ n: [['a', 'CH₃', 0, 0], ['b', 'CH₂', 1.3, 0], ['c', 'OH', 2.5, 0]], e: [['a', 'b'], ['b', 'c']] }], 2.4, 'p', {});
        P.partes.forEach(p => p.atomos.forEach(a => { a.x += (R.ancho - P.ancho) / 2; }));
        return figura([...R.partes, ...P.partes], { escala: 36, alto: 190, textos: [...R.textos, { x: R.ancho / 2, y: 3.2, t: 'C₂H₆O: nada sobra', color: 'o' }], flechas: [{ de: [R.ancho / 2, 0.55], a: [R.ancho / 2, 1.85] }] });
      })(),
      coincide: 'Coincide: es una adición; todos los átomos quedan en el etanol.',
      noCoincide: 'Inventario: C₂H₄ + H₂O = C₂H₆O. No sobra ningún átomo.',
    },
    mira: {
      datos: (() => {
        const f1 = reaccion('adicion');
        const d = f1.datos;
        d.atomos.forEach(a => { a.desde = a.id.startsWith('p') ? 3 : a.id.startsWith('r1') ? 2 : 1; });
        d.enlaces.forEach(e => { e.desde = e.a.startsWith('p') ? 3 : e.a.startsWith('r1') ? 2 : 1; });
        d.textos.forEach(t => { t.desde = 2; });
        d.flechas.forEach(fl => { fl.desde = 3; });
        d.textos.push({ x: 1.6, y: 3.2, t: 'C₂H₄ + H₂ = C₂H₆', color: 'o', desde: 4 });
        return d;
      })(),
      voz: 'Sigamos el enlace doble paso a paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El eteno tiene un enlace doble entre sus carbonos.', ecuacion: ['CH₂=CH₂'] },
        { estado: { corte: 2 }, texto: 'Llega una molécula de H₂.', ecuacion: ['CH₂=CH₂ + H₂'] },
        { estado: { corte: 3 }, texto: 'El doble se abre y cada carbono recibe un H.', ecuacion: ['→ CH₃–CH₃'] },
        { estado: { corte: 4 }, texto: 'Inventario: todos los átomos quedan en una sola molécula.', ecuacion: ['C₂H₄ + H₂ → C₂H₆'] },
      ],
    },
    regla: {
      texto: 'Adición: un doble o triple se abre y todo queda en una molécula. Sustitución: un átomo sale y otro toma su lugar. Eliminación: salen átomos vecinos; queda un doble.',
      ecuacion: ['CH₂=CH₂ + H₂ → CH₃–CH₃'],
      condicion: 'la ecuación da el balance global, no el camino; necesita condiciones (calor, luz o catalizador). La combustión es una oxidación completa.',
      voz: 'Mira qué entra, qué sale y qué enlace cambia.',
    },
    ahoraTu: {
      voz: 'Compara reactivos y productos.',
      generar(s) {
        const CASOS = [
          ['CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br', 'adicion'], ['C₂H₆ + Cl₂ → C₂H₅Cl + HCl', 'sustitucion'],
          ['CH₃–CH₂Br + KOH → CH₂=CH₂ + KBr + H₂O', 'eliminacion'], ['C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O', 'combustion'],
          ['HC≡CH + 2 H₂ → CH₃–CH₃', 'adicion'], ['C₆H₆ + Br₂ → C₆H₅Br + HBr', 'sustitucion'],
          ['CH₃–CH(OH)–CH₃ → CH₂=CH–CH₃ + H₂O', 'eliminacion'], ['CH₂=CH₂ + H₂O → CH₃–CH₂OH', 'adicion'],
          ['2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O', 'combustion'],
        ];
        const r = azar(s), [ec, tipo] = CASOS[s % CASOS.length];
        const nom = { adicion: 'Adición', sustitucion: 'Sustitución', eliminacion: 'Eliminación', combustion: 'Combustión' };
        const si = {
          adicion: 'Sería adición si un doble o triple se abriera y todo quedara en una molécula.',
          sustitucion: 'Sería sustitución si un átomo saliera y otro tomara su lugar.',
          eliminacion: 'Sería eliminación si salieran átomos vecinos y se formara un doble.',
          combustion: 'Sería combustión si reaccionara con O₂ y diera CO₂ y agua.',
        };
        const porque = {
          adicion: 'Un enlace múltiple se abre y los átomos que llegan quedan en el producto.',
          sustitucion: 'Un H sale con el halógeno y otro átomo ocupa su lugar.',
          eliminacion: 'Salen dos grupos de carbonos vecinos y aparece un enlace doble.',
          combustion: 'Con O₂ suficiente, el carbono pasa a CO₂ y el hidrógeno a agua.',
        };
        const ops = r.mezcla(Object.keys(nom).map(k => (k === tipo ? { id: 'c', texto: nom[k], correcta: true } : { id: k, texto: nom[k], error: k === 'adicion' && tipo === 'eliminacion' ? 'QM-AGUA' : 'QM-REACCION', siFuera: si[k] })));
        return {
          pregunta: `¿Qué tipo de reacción es ${ec}?`,
          opciones: ops,
          solucion: { texto: porque[tipo], ecuacion: [nom[tipo]] },
        };
      },
    },
  };

  return {
    unidad: 'quimica.hidrocarburos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-molecula.js'],
    historia: {
      texto: 'Conocer la composición de una sustancia orgánica no bastaba para explicar sus propiedades: dos sustancias podían tener la misma fórmula y comportarse distinto. En 1874, van ’t Hoff propuso que los cuatro enlaces del carbono apuntan a los vértices de un tetraedro. Esa idea espacial ayudó a explicar los isómeros. Las fórmulas de cadenas que usamos hoy recogen esa historia.',
      pregunta: '¿Cómo pueden dos sustancias tener la misma fórmula y ser distintas?',
      fuente: { titulo: 'OpenStax, Organic Chemistry, §3.4 y §5.2', url: 'https://openstax.org/books/organic-chemistry/pages/3-4-naming-alkanes' },
    },
    ideas: [carbono, formulas, aromatico, isomeros, geometrica, reacciones],
  };
});
