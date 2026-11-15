/*
 * Teoría de «Campo y fuerza magnética» (fisica.magnetismo). Molde: docs/teoria.md y la unidad de referencia
 * contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 16) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Colores (regla 4): campo B turquesa (c-i), corriente I rojo (c-h), velocidad v naranja (c-o) y fuerza F verde (c-d).
 * Distancias, cargas y ángulos van en tinta. En las vistas de arriba, ⊙ es corriente que sale de la pantalla y ⊗ la
 * que entra; un campo que entra se dibuja con × repetidas.
 * Estado: completa (14 nov 2026): cinco ideas que cubren los cinco temas del catálogo.
 * Códigos de error: MG1 a MG4 y MG6 de docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md. Nuevos
 * (hipótesis, sin dato propio): MG-RADIAL (la aguja apunta hacia el cable), MG-TIERRA (la corriente no puede con el
 * campo de la Tierra), MG-R2 (B del hilo baja con 1/r²), MG-RADIO (el radio del solenoide decide B adentro),
 * MG-ENERGIA (la fuerza magnética acelera la carga), MG-UNID (cm sin pasar a m).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: cinco relaciones entre corrientes, campos y fuerzas magnéticas, cada una jugada antes de preguntarla.
 *   Persona y condiciones: postulante de 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: halla B de un hilo y un solenoide, y la fuerza sobre una carga, un cable y dos cables.
 *   Orden de atención: 1.º la vista de arriba con sus flechas · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué la fuerza magnética nunca apunta hacia donde apunta el campo?
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // nucleo/fisica3d.js arma la mesa 3D «La mano derecha en 3D» con el motor de plantillas/magnetismo (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/fisica3d.js')) : fabrica(root.Kit, root.Fisica3D);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, F3) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const B = { v: 'c-i', t: 'B' }, I = { v: 'c-h', t: 'I' }, v = { v: 'c-o', t: 'v' }, F = { v: 'c-d', t: 'F' };
  const MU = 4 * Math.PI * 1e-7;
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const cien = (n, dd = 2) => {
    if (n === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(n))), m = n / 10 ** e;
    return `${f(m, dd)} × 10${String(e).split('').map(c => SUP[c]).join('')}`;
  };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const x = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    x.ent = (lo, hi) => lo + Math.floor(x() * (hi - lo + 1));
    x.de = xs => xs[Math.floor(x() * xs.length)];
    return x;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const o of distractores) {
      const txt = fmt(o.valor);
      if (vistos.has(txt) || !Number.isFinite(o.valor)) continue;
      vistos.add(txt);
      ops.push({ id: o.id, texto: txt, error: o.error, siFuera: o.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Potencias de 10 en las ecuaciones: '4π×10⁻⁷ · 2' → ['4π × ', { sup: ['10', '−7'] }, ' · 2'] (tipografía, §4b).
  const DIG = { '⁻': '−', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  const pot = txt => txt.split(/\s?×\s?10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/).map((t, k) => (k % 2 ? [' × ', { sup: ['10', t.split('').map(c => DIG[c]).join('')] }] : t)).flat().filter(t => t !== '');
  // Gesto directo (docs/teoria.md §4b): las manijas viven en las coordenadas de fis-lienzo (vistas en cm).
  const LIENZO = () => Kit.piezas['fis-lienzo'];
  // Un cable visto desde arriba: ⊙ si la corriente sale de la pantalla, ⊗ si entra.
  const cable = (x, y, sale, paso) => ({ c: [x, y], r: 0.45, color: 'h', relleno: 0.15, rotulo: sale ? '•' : '×', paso });
  // Campo que entra en la pantalla: una grilla de × en el color de B.
  const grillaX = (x0, x1, y0, y1, k = 1.5, paso) => {
    const out = [];
    for (let x = x0; x <= x1 + 1e-9; x += k) for (let y = y0; y <= y1 + 1e-9; y += k) out.push({ en: [x, y - 0.25], texto: '×', color: 'i', peso: 400, paso });
    return out;
  };

  // ---------- Idea 1: Oersted, el campo da vueltas al cable ----------
  // Cambia: la corriente y la distancia de la brújula · Permanece: el campo de la Tierra hacia el norte ·
  // Progresa: el giro de la aguja · Se reserva: invertir la corriente ·
  // Debe verse: el campo del cable es circular; la aguja suma ese campo y el de la Tierra.
  // Se manipula: la brújula, que se arrastra hacia abajo para alejarla del cable (la distancia).
  const BT = 25;                                  // μT, componente horizontal aproximada en el Perú
  const bHilo = (i, rc) => MU * i / (2 * Math.PI * rc / 100) * 1e6;   // μT
  // px por cm de una vista de fis-lienzo (la misma cuenta que hace la pieza): para dibujar en cm con flechas.
  const escalaDe = w => Math.min(280 / (w.x1 - w.x0), 260 / (w.y1 - w.y0));
  const VISTA1 = { x0: -6.5, x1: 6.5, y0: -8, y1: 2.8 };
  const PXB = 1.2;                                // px por μT (flechas de campo; solo en la explicación, con 10 A a 4 cm)
  function oersted(i, rc, sale = true, o = {}) {
    const bw = bHilo(i, rc) * (sale ? 1 : -1);    // en (0, −r): ⊙ da B hacia +x
    const ang = Math.atan2(bw, BT), L = 1.0;
    const cx = 0, cy = -rc;
    return {
      vista: VISTA1,
      discos: [cable(0, 0, sale)],
      arcos: [
        // Líneas de campo: la de 2 cm entera; las de 4 y 6 cm, solo su parte de abajo (la de arriba no cabe).
        { c: [0, 0], r: 2, de: 0, a: 360, color: 'i', grosor: 'fino', paso: o.circ },
        ...[4, 6].map(rr => ({ c: [0, 0], r: rr, de: 200, a: 340, color: 'i', grosor: 'fino', paso: o.circ })),
        { c: [cx, cy], r: 1.2, de: 0, a: 360 },
      ],
      flechas: [
        { de: [cx - L * Math.sin(ang), cy - L * Math.cos(ang)], d: [2 * L * Math.sin(ang), 2 * L * Math.cos(ang)], escala: escalaDe(VISTA1), color: 'i', rotulo: 'N' },
        ...(o.vectores ? [
          { de: [cx + 2.6, cy - 0.6], d: [0, BT], escala: PXB, color: 'i', rotulo: 'Tierra', paso: o.vectores },
          { de: [cx + 2.6, cy - 0.6], d: [bw, 0], escala: PXB, color: 'i', rotulo: 'cable', discontinua: true, paso: o.vectores },
        ] : []),
      ],
      textos: [{ en: [0, 2.3], texto: `${f(i, 0)} A ${sale ? 'saliendo' : 'entrando'}`, color: 'h', peso: 700 }, { en: [-5.6, 2.3], texto: 'N ↑', peso: 700 }],
      segmentos: [{ de: [-0.6, -0.5], a: [-0.6, -rc + 1.2], texto: `${f(rc, 0)} cm`, lado: -1, grosor: 'fino', discontinua: true }],
      alt: `Vista desde arriba: un cable con ${f(i, 0)} A ${sale ? 'saliendo' : 'entrando'}, sus líneas de campo en círculos y una brújula a ${f(rc, 0)} cm cuya aguja gira ${f(Math.abs(ang * 180 / Math.PI), 0)}° hacia el ${bw >= 0 ? 'este' : 'oeste'}.`,
    };
  }
  const giro = (i, rc) => Math.atan2(bHilo(i, rc), BT) * 180 / Math.PI;
  const oerstedIdea = {
    id: 'oersted',
    titulo: 'La corriente hace girar la brújula',
    temas: ['Imanes y experimento de Oersted', 'Campo de un conductor recto, una espira y un solenoide'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Un cable vertical lleva corriente que sale de la pantalla; la brújula está al sur. La corriente sube y baja sola: mira la aguja.',
      voz: 'Sin corriente, la aguja mira al norte. Mira cuánto se tuerce.',
      controles: [
        { id: 'i', etiqueta: 'I', color: 'c-h', min: 0, max: 20, paso: 5, inicio: 10, unidad: 'A', decimales: 0, auto: { velocidad: 8, modo: 'rebota' } },
        { id: 'r', etiqueta: 'Distancia', min: 2, max: 6, paso: 2, inicio: 4, unidad: 'cm', decimales: 0 },
      ],
      dibujo: val => ({ datos: oersted(val.i, val.r), estado: {} }),
      lectura: val => [B, ` del cable = ${f(bHilo(val.i, val.r), 0)} μT · la aguja gira ${f(giro(val.i, val.r), 0)}°`],
      arrastres: [{
        id: 'brujula', etiqueta: 'brújula (distancia al cable)',
        donde: val => { const g = LIENZO().geometria(oersted(val.i, val.r)); return { x: g.X(0), y: g.Y(-val.r) }; },
        mover: (pt, val) => ({ r: -LIENZO().geometria(oersted(val.i, val.r)).Yi(pt.y) }),
      }],
      minimo: 3,
    },
    predice: {
      pregunta: 'Con 10 A y la brújula a 4 cm, inviertes el sentido de la corriente. ¿Hacia dónde apunta la aguja?',
      opciones: [
        { id: 'c', texto: `Gira ${f(giro(10, 4), 0)}° al otro lado, hacia el oeste`, correcta: true },
        { id: 'igual', texto: 'Igual que antes: manda la Tierra', error: 'MG-TIERRA', siFuera: 'La Tierra sí sigue tirando al norte. Pero el campo del cable cambió de sentido.' },
        { id: 'cable', texto: 'Apunta hacia el cable', error: 'MG-RADIAL', siFuera: 'Sería cierto si el cable atrajera la aguja como un imán. Su campo da vueltas alrededor.' },
        { id: 'norte', texto: 'Vuelve al norte', error: 'MG-TIERRA', siFuera: 'Volvería al norte sin corriente. Invertida, la corriente sigue ahí.' },
      ],
      dibujo: { datos: oersted(10, 4), estado: {} },
      revelar: { datos: oersted(10, 4, false), estado: {} },
      coincide: 'Coincide: al invertir la corriente, las líneas de campo giran al revés y la aguja se tuerce al otro lado.',
    },
    mira: {
      datos: oersted(10, 4, true, { circ: 1, vectores: 3 }),
      pasos: [
        { estado: { paso: 0 }, texto: 'El polo norte de la aguja apunta como el campo magnético de ese punto.', ecuacion: ['aguja ∥ ', B, ' total'] },
        { estado: { paso: 1 }, texto: 'El campo forma círculos: pulgar con la corriente, los dedos dan el giro.', ecuacion: ['regla de la mano derecha'] },
        { estado: { paso: 2 }, texto: 'A 4 cm, el campo del cable vale:', ecuacion: [B, ' = ', { frac: [['μ₀', I], '2π r'] }, ` = ${f(bHilo(10, 4), 0)} μT`] },
        { estado: { paso: 3 }, texto: 'Se suma, como flecha, al campo de la Tierra.', ecuacion: ['tan θ = ', { frac: [`${f(bHilo(10, 4), 0)}`, `${BT}`] }, `  →  θ = ${f(giro(10, 4), 0)}°`] },
      ],
    },
    regla: {
      texto: 'Una corriente crea un campo magnético en círculos alrededor del cable. Su sentido lo da la mano derecha y su valor baja con la distancia.',
      ecuacion: [B, ' = ', { frac: [['μ₀', I], ['2π ', { llave: ['r'], nota: 'distancia al cable' }]] }, '   ·   ', 'μ₀ = 4π × ', { sup: ['10', '−7'] }, ' T·m/A'],
      condicion: 'cable recto y largo comparado con la distancia r, medida desde el centro del cable.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s);
        if (s % 2) {
          const i = x.de([2, 5, 10, 20]), rc = x.de([1, 2, 5, 10]), b = bHilo(i, rc);
          return {
            pregunta: ['¿Qué campo magnético produce un cable recto con ', I, ` = ${f(i)} A a ${f(rc)} cm de él?`],
            opciones: opciones(b, [
              { id: 'cm', valor: b / 100, error: 'MG-UNID', siFuera: 'Esa cuenta deja r en centímetros. Pásalo a metros.' },
              { id: 'r2', valor: MU * i / (2 * Math.PI * (rc / 100) ** 2) * 1e6 / 100, error: 'MG-R2', siFuera: 'Esa cuenta divide entre r²: así cae el campo de una carga, no el de un hilo.' },
              { id: 'sin-pi', valor: MU * i / (rc / 100) * 1e6, error: 'MG-UNID', siFuera: 'Esa cuenta olvida el 2π.' },
            ], n => `${f(n, 1)} μT`),
            solucion: { texto: 'μ₀ I entre 2πr, con r en metros.', ecuacion: [B, ...pot(` = 2×10⁻⁷ · ${f(i)} / ${f(rc / 100)} = ${f(b, 1)} μT`)] },
          };
        }
        const b0 = x.de([20, 40, 60, 100]), k = x.de([2, 3, 4]), lejos = s % 4 === 0;
        const b1 = lejos ? b0 / k : b0 * k;
        return {
          pregunta: ['A cierta distancia de un cable, ', B, ` = ${f(b0)} μT. ¿Cuánto vale a ${lejos ? `${f(k)} veces esa distancia` : `la ${k === 2 ? 'mitad' : k === 3 ? 'tercera parte' : 'cuarta parte'} de esa distancia`}?`],
          opciones: opciones(b1, [
            { id: 'r2', valor: lejos ? b0 / (k * k) : b0 * k * k, error: 'MG-R2', siFuera: 'Esa cuenta usa el cuadrado de la distancia; el campo de un hilo cae con r.' },
            { id: 'inv', valor: lejos ? b0 * k : b0 / k, error: 'MG-RADIAL', siFuera: 'Esa cuenta hace crecer el campo al alejarse.' },
            { id: 'igual', valor: b0, error: 'MG-TIERRA', siFuera: 'Sería cierto si el campo no dependiera de la distancia.' },
          ], n => `${f(n, 2)} μT`),
          solucion: { texto: 'B va con 1/r: el factor de la distancia divide.', ecuacion: [B, ` = ${f(b0)} ${lejos ? '/' : '·'} ${f(k)} = ${f(b1, 2)} μT`] },
        };
      },
    },
  };

  // ---------- Idea 2: espira y solenoide ----------
  // Cambia: cuántas vueltas tiene el solenoide y su largo · Permanece: la corriente (2 A) y su grosor ·
  // Progresa: las flechas de B adentro, iguales en todo el interior · Se reserva: un solenoide más grueso ·
  // Debe verse: B adentro depende de vueltas por metro y de I, no del radio.
  // Se manipula: el extremo derecho del solenoide, que se estira o se encoge (el largo; las vueltas son las mismas).
  const IS = 2;
  const bSol = (n, Lc, i = IS) => MU * n * i / (Lc / 100) * 1000;    // mT
  const VISTA2 = { x0: -0.5, x1: 21.5, y0: -7.2, y1: 6.6 };
  const PXS = 80;                                                    // px por mT
  function solenoide(n, Lc, radio = 2.5, o = {}) {
    const x0 = 1, b = bSol(n, Lc);
    const vueltas = Array.from({ length: n }, (_, k) => {
      const x = x0 + Lc * (k + 0.5) / n;
      return { puntos: [[x - 0.2, -radio], [x + 0.2, radio]], color: 'h', grosor: 'fino', paso: o.vueltas };
    });
    return {
      vista: VISTA2,
      poligonos: [...vueltas, { puntos: [[x0, -radio], [x0 + Lc, -radio], [x0 + Lc, radio], [x0, radio]], cerrado: true, grosor: 'fino', discontinua: true }],
      flechas: [[0.3, 0.9], [0.7, -0.9]].map(([k, y]) => ({ de: [x0 + Lc * k - b * PXS / (2 * escalaDe(VISTA2)), y], d: [b, 0], escala: PXS, color: 'i', rotulo: k === 0.3 ? 'B' : '', paso: o.b })),
      segmentos: [{ de: [x0, -radio - 1.2], a: [x0 + Lc, -radio - 1.2], texto: `${f(Lc, 0)} cm`, lado: -1, grosor: 'fino' }],
      textos: [{ en: [x0, radio + 1.1], texto: `${f(n, 0)} vueltas · ${IS} A`, ancla: 'start', color: 'h', peso: 700 }],
      alt: `Solenoide de ${n} vueltas y ${f(Lc, 0)} cm de largo con ${IS} A; adentro, flechas de campo iguales de ${f(b, 2)} mT.`,
    };
  }
  const solenoideIdea = {
    id: 'espira-solenoide',
    titulo: 'Vueltas por metro deciden B',
    temas: ['Campo de un conductor recto, una espira y un solenoide'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Un solenoide con 2 A: un alambre de muchas vueltas. Se estira y se encoge solo: mira el campo de adentro. Cambia las vueltas.',
      voz: 'Compara las dos flechas de adentro: ¿miden lo mismo?',
      controles: [
        { id: 'n', etiqueta: 'Vueltas', min: 10, max: 30, paso: 10, inicio: 20, unidad: '', decimales: 0 },
        { id: 'L', etiqueta: 'Largo', min: 10, max: 20, paso: 5, inicio: 10, unidad: 'cm', decimales: 0, auto: { velocidad: 4, modo: 'rebota' } },
      ],
      dibujo: val => ({ datos: solenoide(val.n, val.L), estado: {} }),
      lectura: val => [B, ` adentro = ${f(bSol(val.n, val.L), 2)} mT · ${f(val.n / (val.L / 100), 0)} vueltas por metro`],
      arrastres: [{
        id: 'extremo', etiqueta: 'extremo derecho del solenoide (largo)',
        donde: val => { const g = LIENZO().geometria(solenoide(val.n, val.L)); return { x: g.X(1 + val.L), y: g.Y(2.5) }; },
        mover: (pt, val) => ({ L: LIENZO().geometria(solenoide(val.n, val.L)).Xi(pt.x) - 1 }),
      }],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un solenoide de 20 vueltas y 10 cm se cambia por otro con las mismas vueltas y el mismo largo, pero el doble de grueso. ¿Qué pasa con el campo adentro?',
      opciones: [
        { id: 'c', texto: 'No cambia', correcta: true },
        { id: 'mitad', texto: 'Se reduce a la mitad', error: 'MG-RADIO', siFuera: 'Así pasa en el centro de una espira más grande. En un solenoide largo, mandan las vueltas por metro.' },
        { id: 'doble', texto: 'Se duplica', error: 'MG-RADIO', siFuera: 'Más grueso no es más alambre por metro de largo: las vueltas por metro son las mismas.' },
      ],
      dibujo: { datos: solenoide(20, 10, 2.5, { b: 9 }), estado: {} },
      revelar: { datos: solenoide(20, 10, 5), estado: {} },
      coincide: 'Coincide: el campo adentro depende de las vueltas por metro y de la corriente, no del radio.',
    },
    mira: {
      datos: solenoide(20, 10, 2.5, { b: 2 }),
      pasos: [
        { estado: { paso: 0 }, texto: 'Una sola espira hace un campo que en su centro vale:', ecuacion: [B, ' = ', { frac: [['μ₀', I], '2R'] }] },
        { estado: { paso: 1 }, texto: 'Muchas vueltas juntas suman sus campos: adentro queda casi uniforme.', ecuacion: [{ llave: ['n'], nota: 'vueltas por metro' }, ' = ', { frac: ['N', 'L'] }, ' = ', { frac: ['20', '0,1'] }, ' = 200 vueltas/m'] },
        { estado: { paso: 2 }, texto: 'El campo de adentro sale de las vueltas por metro y la corriente.', ecuacion: [B, ` = μ₀ n `, I, ...pot(` = 4π×10⁻⁷ · 200 · 2 = ${f(bSol(20, 10), 2)} mT`)] },
        { estado: { paso: 2 }, texto: 'En la fórmula del solenoide no aparece el radio.', ecuacion: [B, ' = μ₀ ', { frac: ['N', 'L'] }, ' ', I] },
      ],
    },
    regla: {
      texto: 'Una espira concentra el campo en su centro. Un solenoide largo lo hace uniforme adentro, según sus vueltas por metro y su corriente.',
      ecuacion: ['espira: ', B, ' = ', { frac: [['μ₀', I], '2R'] }, '   ·   ', 'solenoide: ', B, ' = μ₀ ', { frac: ['N', 'L'] }, ' ', I],
      condicion: 'el solenoide es mucho más largo que grueso, y B se mide lejos de sus extremos.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s);
        if (s % 2) {
          const n = x.de([100, 200, 500, 1000]), Lc = x.de([10, 20, 25, 50]), i = x.de([1, 2, 4]), b = bSol(n, Lc, i);
          return {
            pregunta: ['Un solenoide de ', `${f(n)} vueltas y ${f(Lc)} cm de largo lleva `, I, ` = ${f(i)} A. ¿Qué campo hay adentro? Usa μ₀ = 4π × 10⁻⁷ T·m/A.`],
            opciones: opciones(b, [
              { id: 'cm', valor: b / 100, error: 'MG-UNID', siFuera: 'Esa cuenta deja el largo en centímetros.' },
              { id: 'sin-n', valor: b / n, error: 'MG-RADIO', siFuera: 'Esa sería con una sola vuelta por largo: faltan las N vueltas.' },
              { id: 'hilo', valor: MU * i / (2 * Math.PI * Lc / 100) * 1000, error: 'MG-RADIO', siFuera: 'Esa es la fórmula del hilo recto, no la del solenoide.' },
            ], v1 => `${f(v1, 3)} mT`),
            solucion: { texto: 'Vueltas por metro por la corriente, por μ₀.', ecuacion: [B, ...pot(` = 4π×10⁻⁷ · ${f(n / (Lc / 100))} · ${f(i)} = ${f(b, 3)} mT`)] },
          };
        }
        const i = x.de([1, 2, 5, 10]), Rc = x.de([2, 5, 10]), b = MU * i / (2 * Rc / 100) * 1e6;
        return {
          pregunta: ['Una espira circular de ', `${f(Rc)} cm de radio lleva `, I, ` = ${f(i)} A. ¿Qué campo hay en su centro?`],
          opciones: opciones(b, [
            { id: 'hilo', valor: MU * i / (2 * Math.PI * Rc / 100) * 1e6, error: 'MG-RADIO', siFuera: 'Esa es la fórmula del hilo recto a esa distancia; la espira rodea el centro.' },
            { id: 'cm', valor: b / 100, error: 'MG-UNID', siFuera: 'Esa cuenta deja el radio en centímetros.' },
            { id: 'diam', valor: b / 2, error: 'MG-RADIO', siFuera: 'Esa cuenta usa el diámetro donde va el radio.' },
          ], v1 => `${f(v1, 1)} μT`),
          solucion: { texto: 'μ₀ I entre el doble del radio.', ecuacion: [B, ...pot(` = 4π×10⁻⁷ · ${f(i)} / (2 · ${f(Rc / 100)}) = ${f(b, 1)} μT`)] },
        };
      },
    },
  };

  // ---------- Idea 3: fuerza sobre una carga que se mueve ----------
  // Cambia: la rapidez del protón y el campo · Permanece: el campo entrando a la pantalla ·
  // Progresa: el radio de la circunferencia que describe · Se reserva: una carga quieta ·
  // Debe verse: F es perpendicular a v; no cambia la rapidez, solo la dirección.
  // Se manipula: la punta de la flecha v, que se estira (la rapidez del protón).
  const MP = 1.67e-27, QE = 1.6e-19;
  const radio = (v5, bt) => MP * v5 * 1e5 / (QE * bt) * 100;   // cm
  const VISTA3 = { x0: -6, x1: 6, y0: -5.6, y1: 5.2 };
  const PXV = 14, PXF = 30;
  const Y0 = -4.5;                                            // el protón entra por abajo: su vuelta sube                                     // px por 10⁵ m/s y px por 10⁻¹⁴ N
  const fCarga = (v5, bt) => QE * v5 * 1e5 * bt / 1e-14;       // en 10⁻¹⁴ N
  // Animación (15 nov): o.t (ns) pone al protón en su vuelta. Gira con ω = qB/m (el período, 2πm/qB, no depende de v):
  // en cámara lenta, un nanosegundo del modelo dura 1/150 s en pantalla. v sigue tangente y F apunta al centro.
  const omega = bt => QE * bt / MP;                                   // rad/s
  const angulo = (bt, tns) => omega(bt) * tns * 1e-9;
  function proton(v5, bt, o = {}) {
    if (o.t) return protonGira(v5, bt, o.t);
    const r = radio(v5, bt), quieto = v5 === 0;
    // El protón está en (0, 0) yendo hacia +x; con B entrando, F = qv×B apunta hacia +y: el centro está arriba.
    return {
      vista: VISTA3,
      textos: [...grillaX(-5.2, 5.2, -4.9, 4.0, 1.6), { en: [-5.8, 4.8], texto: `B = ${f(bt, 2)} T entrando`, ancla: 'start', color: 'i', peso: 700 }],
      arcos: quieto ? [] : [{ c: [0, Y0 + r], r, de: 0, a: 360, discontinua: true, paso: o.camino }],
      discos: [{ c: [0, Y0], r: 0.4, color: 'o', relleno: 0.3, rotulo: '+' }],
      flechas: quieto ? [] : [
        { de: [0.5, Y0], d: [v5, 0], escala: PXV, color: 'o', rotulo: 'v' },
        { de: [0, Y0 + 0.5], d: [0, fCarga(v5, bt)], escala: PXF, color: 'd', rotulo: 'F', paso: o.f },
      ],
      alt: quieto ? 'Un protón quieto dentro de un campo magnético que entra a la pantalla: no hay flecha de fuerza.'
        : `Un protón a ${f(v5, 0)}×10⁵ m/s hacia la derecha en un campo que entra; la fuerza apunta hacia arriba, perpendicular a v, y describe una circunferencia de ${f(r, 1)} cm.`,
    };
  }
  function protonGira(v5, bt, tns) {
    const r = radio(v5, bt), a = angulo(bt, tns), c = [0, Y0 + r], sn = Math.sin(a), cs = Math.cos(a);
    const pos = [c[0] + r * sn, c[1] - r * cs], u = [cs, sn], n = [-sn, cs], Fv = fCarga(v5, bt);
    return {
      vista: VISTA3,
      textos: [...grillaX(-5.2, 5.2, -4.9, 4.0, 1.6), { en: [-5.8, 4.8], texto: `B = ${f(bt, 2)} T entrando`, ancla: 'start', color: 'i', peso: 700 }],
      arcos: [{ c, r, de: 0, a: 360, discontinua: true }],
      discos: [{ c: pos, r: 0.4, color: 'o', relleno: 0.3, rotulo: '+' }],
      flechas: [
        { de: [pos[0] + 0.5 * u[0], pos[1] + 0.5 * u[1]], d: [v5 * u[0], v5 * u[1]], escala: PXV, color: 'o', rotulo: 'v' },
        { de: [pos[0] + 0.5 * n[0], pos[1] + 0.5 * n[1]], d: [Fv * n[0], Fv * n[1]], escala: PXF, color: 'd', rotulo: 'F' },
      ],
      alt: `Un protón a ${f(v5, 0)}×10⁵ m/s da vueltas en un campo que entra: la fuerza apunta siempre al centro de la circunferencia de ${f(r, 1)} cm, perpendicular a v.`,
    };
  }
  // La manija sigue a la punta de la flecha v, donde esté el protón; arrastrarla a lo largo de v cambia la rapidez.
  const puntaV = val => {
    const r = radio(val.v, val.b), a = angulo(val.b, val.t), c = [0, Y0 + r], pos = [c[0] + r * Math.sin(a), c[1] - r * Math.cos(a)];
    const g = LIENZO().geometria(proton(val.v, val.b, { t: val.t })), u = [Math.cos(a), Math.sin(a)];
    return { g, x0: g.X(pos[0] + 0.5 * u[0]), y0: g.Y(pos[1] + 0.5 * u[1]), u };
  };
  const cargaIdea = {
    id: 'fuerza-carga',
    titulo: 'La fuerza va de costado',
    temas: ['Fuerza magnética sobre una carga'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Un protón da vueltas, en cámara lenta, en un campo magnético que entra a la pantalla. Mira hacia dónde apunta F. Cambia su rapidez.',
      voz: 'Fíjate en el ángulo entre la flecha de v y la de F.',
      controles: [
        { id: 'v', etiqueta: 'v, en 10⁵ m/s', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'B', color: 'c-i', min: 0.1, max: 0.2, paso: 0.05, inicio: 0.15, unidad: 'T', decimales: 2 },
        { id: 't', etiqueta: 't', color: 'c-d', min: 0, max: 2000, paso: 25, inicio: 0, unidad: 'ns', decimales: 0, auto: { velocidad: 150 } },
      ],
      dibujo: val => ({ datos: proton(val.v, val.b, { t: val.t }), estado: {} }),
      lectura: val => [F, ` = ${cien(fCarga(val.v, val.b) * 1e-14, 1)} N · radio ${f(radio(val.v, val.b), 1)} cm · giró ${f(angulo(val.b, val.t) * 180 / Math.PI % 360, 0)}°`],
      // La flecha v sale del protón y mide PXV px por cada 10⁵ m/s (fis-lienzo dibuja d · escala px), donde esté.
      arrastres: [{
        id: 'rapidez', etiqueta: 'punta de la flecha de velocidad', color: 'c-o',
        donde: val => { const q = puntaV(val); return { x: q.x0 + val.v * PXV * q.u[0], y: q.y0 - val.v * PXV * q.u[1] }; },
        mover: (pt, val) => { const q = puntaV(val); return { v: ((pt.x - q.x0) * q.u[0] - (pt.y - q.y0) * q.u[1]) / PXV }; },
      }],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora el protón está quieto dentro del mismo campo de 0,1 T. ¿Qué fuerza magnética actúa sobre él?',
      opciones: [
        { id: 'c', texto: 'Ninguna', correcta: true },
        { id: 'qb', texto: 'q·B, hacia adentro de la pantalla', error: 'MG1', siFuera: 'Una carga quieta sí siente fuerza en un campo eléctrico. El magnético solo empuja cargas que se mueven.' },
        { id: 'lado', texto: 'Una fuerza de costado, como antes', error: 'MG1', siFuera: 'De costado, sí, pero respecto de su velocidad. Sin velocidad no hay costado.' },
      ],
      dibujo: { datos: proton(0, 0.1), estado: {} },
      revelar: { datos: Object.assign(proton(0, 0.1), { textos: [...proton(0, 0.1).textos, { en: [1.6, Y0 - 0.2], texto: 'F = 0', color: 'd', ancla: 'start', peso: 700 }] }), estado: {} },
      coincide: 'Coincide: F = qvB sen θ, y con v = 0 la fuerza magnética es cero.',
    },
    mira: {
      datos: proton(4, 0.1, { f: 1, camino: 3 }),
      pasos: [
        { estado: { paso: 0 }, texto: 'El protón va a la derecha; el campo entra a la pantalla.', ecuacion: [v, ' ⊥ ', B] },
        { estado: { paso: 1 }, texto: 'Mano derecha: dedos con v, doblados hacia B; el pulgar da F.', ecuacion: [F, ` = q`, v, B, ` sen 90° = ${cien(fCarga(4, 0.1) * 1e-14, 1)} N`] },
        { estado: { paso: 2 }, texto: 'F siempre es perpendicular a v: cambia la dirección, no la rapidez.', ecuacion: [F, ' ⊥ ', v, '  →  W = 0'] },
        { estado: { paso: 3 }, texto: 'Doblar sin frenar es dar vueltas: una circunferencia.', ecuacion: ['r = ', { frac: [['m', v], ['q', B]] }, ` = ${f(radio(4, 0.1), 1)} cm`] },
      ],
    },
    regla: {
      texto: 'Un campo magnético empuja una carga solo si se mueve. La fuerza es perpendicular a v y a B, así que cambia la dirección sin cambiar la rapidez.',
      ecuacion: [F, ' = |q| ', v, B, ' ', { llave: ['sen θ'], nota: 'ángulo con B' }, '   ·   ', 'r = ', { frac: [['m', v], ['|q|', B]] }],
      condicion: 'θ es el ángulo entre v y B. Hay circunferencia si v es perpendicular a B uniforme. Carga negativa: F al revés.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s);
        if (s % 3 === 2) return {
          pregunta: 'Un electrón se mueve en línea recta a lo largo de las líneas de un campo magnético uniforme, en el mismo sentido que B. ¿Qué fuerza magnética siente?',
          opciones: [
            { id: 'c', texto: 'Cero: v y B son paralelos', correcta: true },
            { id: 'evb', texto: 'e·v·B, hacia donde apunta B', error: 'MG2', siFuera: 'La fuerza magnética nunca apunta hacia B. Y aquí sen 0° = 0.' },
            { id: 'contra', texto: 'e·v·B, contra el movimiento', error: 'MG-ENERGIA', siFuera: 'La fuerza magnética no frena ni acelera: siempre va de costado.' },
          ],
          solucion: { texto: 'Con θ = 0°, sen θ = 0: no hay fuerza.', ecuacion: [F, ' = e', v, B, ' sen 0° = 0'] },
        };
        const v5 = x.de([1, 2, 3, 5]), bt = x.de([0.1, 0.2, 0.5]), th = x.de([90, 30]), fz = QE * v5 * 1e5 * bt * Math.sin(th * Math.PI / 180);
        return {
          pregunta: ['Un protón cruza un campo ', B, ` = ${f(bt, 1)} T a `, v, ` = ${f(v5)}×10⁵ m/s, formando ${f(th)}° con B. ¿Qué fuerza magnética siente?`],
          opciones: opciones(fz, [
            { id: 'cos', valor: QE * v5 * 1e5 * bt * Math.cos(th * Math.PI / 180) || QE * v5 * 1e5 * bt * 2, error: 'MG3', siFuera: 'Esa cuenta usa el coseno; la fuerza magnética va con el seno del ángulo.' },
            { id: 'sin-sen', valor: th === 90 ? QE * v5 * 1e5 * bt / 2 : QE * v5 * 1e5 * bt, error: 'MG3', siFuera: th === 90 ? 'Esa cuenta divide entre 2 sin razón.' : 'Esa sería con v perpendicular a B.' },
            { id: 'sin-v', valor: QE * bt, error: 'MG1', siFuera: 'Esa cuenta olvida la rapidez: sin v no hay fuerza.' },
          ], n => `${cien(n, 1)} N`),
          solucion: { texto: 'F = qvB sen θ.', ecuacion: [F, ...pot(` = 1,6×10⁻¹⁹ · ${f(v5)}×10⁵ · ${f(bt, 1)} · sen ${f(th)}° = ${cien(fz, 1)} N`)] },
        };
      },
    },
  };

  // ---------- Idea 4: fuerza sobre un cable ----------
  // Cambia: la corriente y el ángulo entre el cable y B · Permanece: B = 0,2 T hacia la derecha y L = 0,5 m ·
  // Progresa: el tamaño de la fuerza, que sale de la pantalla · Se reserva: el cable paralelo a B ·
  // Debe verse: solo cuenta la parte de la corriente perpendicular a B.
  // Sin arrastre en el juego: el ángulo es una de tres opciones. En el laboratorio («El cable que gira») se gira el
  // cable con el dedo, de 0° a 180°.
  const BC = 0.2, LC = 0.5;
  const VISTA4 = { x0: -4.5, x1: 4.5, y0: -3.5, y1: 3.6 };
  const fCable = (i, th) => i * LC * BC * Math.sin(th * Math.PI / 180);
  function cableEnB(i, th, o = {}) {
    const a = th * Math.PI / 180, L2 = 2.6, c = Math.cos(a), s = Math.sin(a);
    const fz = fCable(i, th);
    return {
      vista: VISTA4,
      flechas: [
        ...[-2.6, -1.3, 1.3, 2.6].map(y => ({ de: [-4.2, y], d: [8.2, 0], escala: escalaDe(VISTA4), color: 'i', rotulo: y === 2.6 ? 'B' : '' })),
        { de: [-L2 * c, -L2 * s], d: [2 * L2 * c, 2 * L2 * s], escala: escalaDe(VISTA4), color: 'h', rotulo: `I = ${f(i, 0)} A` },
      ],
      arcos: th > 0 ? [{ c: [0, 0], rpx: 26, de: 0, a: th, rotulo: `${f(th, 0)}°`, paso: o.ang }] : [],
      discos: fz > 1e-9 ? [{ c: [0, 0], r: 0.35 + 0.35 * fz / 1, color: 'd', relleno: 0.25, rotulo: '•', paso: o.f }] : [],
      textos: [{ en: [0, -3.15], texto: fz > 1e-9 ? `F = ${f(fz, 2)} N, sale de la pantalla` : 'F = 0', color: 'd', peso: 700, paso: o.f }],
      alt: `Campo B hacia la derecha y un cable de 0,5 m con ${f(i, 0)} A a ${f(th, 0)}° de B; la fuerza ${fz > 1e-9 ? `vale ${f(fz, 2)} N y sale de la pantalla` : 'es cero'}.`,
    };
  }
  const cableIdea = {
    id: 'fuerza-cable',
    titulo: 'Solo empuja lo perpendicular',
    temas: ['Fuerza sobre un conductor'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Un cable de 0,5 m en un campo de 0,2 T. Su corriente sube y baja sola: mira la fuerza. Cambia el ángulo.',
      voz: 'El círculo verde es la fuerza que sale de la pantalla. Mira cuándo crece.',
      controles: [
        { id: 'i', etiqueta: 'I', color: 'c-h', min: 2, max: 10, paso: 2, inicio: 6, unidad: 'A', decimales: 0, auto: { velocidad: 4, modo: 'rebota' } },
        { id: 't', etiqueta: 'Ángulo', opciones: [{ valor: 90, texto: '90°' }, { valor: 60, texto: '60°' }, { valor: 30, texto: '30°' }] },
      ],
      dibujo: val => ({ datos: cableEnB(val.i, val.t), estado: {} }),
      lectura: val => [F, ` = ${f(fCable(val.i, val.t), 2)} N`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Giras el cable hasta que queda paralelo al campo, con 10 A. ¿Qué fuerza magnética recibe?',
      opciones: [
        { id: 'c', texto: '0 N', correcta: true },
        { id: 'max', texto: `${f(10 * LC * BC, 2)} N, la mayor`, error: 'MG3', siFuera: 'Esa sería la fuerza a 90°. Paralelo al campo, sen 0° = 0.' },
        { id: 'empuja', texto: `${f(10 * LC * BC, 2)} N, en el sentido de B`, error: 'MG2', siFuera: 'La fuerza magnética nunca apunta en el sentido de B: es perpendicular a él.' },
      ],
      dibujo: { datos: cableEnB(10, 0, { f: 9 }), estado: {} },
      revelar: { datos: cableEnB(10, 0), estado: {} },
      coincide: 'Coincide: si la corriente va a lo largo de B, el campo no la empuja.',
    },
    mira: {
      datos: cableEnB(6, 30, { ang: 1, f: 2 }),
      pasos: [
        { estado: { paso: 0 }, texto: 'Cable de 0,5 m con 6 A dentro de un campo de 0,2 T.', ecuacion: [I, ' = 6 A', '   ·   ', B, ' = 0,2 T'] },
        { estado: { paso: 1 }, texto: 'Lo que importa es el ángulo entre la corriente y el campo.', ecuacion: ['θ = 30° → sen θ = 0,5'] },
        { estado: { paso: 2 }, texto: 'La fuerza sale de la pantalla: perpendicular al cable y al campo.', ecuacion: [F, ' = ', I, 'L', B, ` sen θ = 6 · 0,5 · 0,2 · 0,5 = ${f(fCable(6, 30), 2)} N`] },
      ],
    },
    regla: {
      texto: 'Un campo magnético empuja un cable con corriente con una fuerza perpendicular al cable y al campo. Es máxima a 90° y nula si son paralelos.',
      ecuacion: [F, ' = ', I, ' L ', B, ' ', { llave: ['sen θ'], nota: 'ángulo con B' }],
      condicion: 'tramo recto de largo L dentro de un campo uniforme; θ es el ángulo entre la corriente y B.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), i = x.de([2, 3, 4, 5, 8]), L = x.de([0.2, 0.5, 1]), bt = x.de([0.1, 0.2, 0.4]), th = x.de([90, 30, 0, 90]);
        const fz = i * L * bt * Math.sin(th * Math.PI / 180);
        return {
          pregunta: ['Un cable de ', `${f(L, 1)} m con `, I, ` = ${f(i)} A forma ${f(th)}° con un campo `, B, ` = ${f(bt, 1)} T. ¿Qué fuerza recibe?`],
          opciones: opciones(fz, [
            { id: 'max', valor: i * L * bt === fz ? i * L * bt / 2 : i * L * bt, error: 'MG3', siFuera: th === 90 ? 'Esa cuenta divide entre 2 sin razón.' : 'Esa sería con el cable perpendicular al campo.' },
            { id: 'cos', valor: th === 90 ? i * L * bt * 2 : i * L * bt * Math.cos(th * Math.PI / 180), error: 'MG3', siFuera: 'Esa cuenta usa el coseno; va el seno del ángulo con B.' },
            { id: 'sin-l', valor: i * bt * Math.sin(th * Math.PI / 180) || i * bt, error: 'MG-UNID', siFuera: 'Esa cuenta olvida el largo del cable.' },
          ], n => `${f(n, 2)} N`),
          solucion: { texto: 'F = ILB sen θ.', ecuacion: [F, ` = ${f(i)} · ${f(L, 1)} · ${f(bt, 1)} · sen ${f(th)}° = ${f(fz, 2)} N`] },
        };
      },
    },
  };

  // ---------- Idea 5: cables paralelos ----------
  // Cambia: la corriente (igual en los dos), su sentido y la separación · Permanece: el largo considerado (1 m) ·
  // Progresa: las flechas de fuerza, hacia adentro o hacia afuera · Se reserva: corrientes distintas ·
  // Debe verse: la fuerza es la misma sobre los dos cables, aunque uno lleve más corriente.
  // Se manipula: el cable de la derecha, que se arrastra de lado (la separación; los dos se separan desde el centro).
  const VISTA5 = { x0: -6.5, x1: 6.5, y0: -3.2, y1: 3.2 };
  const PXF5 = 0.12;                                       // px por μN/m
  const fPar = (i1, i2, dc) => 2e-7 * i1 * i2 / (dc / 100) * 1e6;   // μN por metro
  function paralelos(i1, i2, dc, mismo, o = {}) {
    const fz = fPar(i1, i2, dc), x1 = -dc / 2, x2 = dc / 2, s = mismo ? 1 : -1;   // s = 1: se atraen
    return {
      vista: VISTA5,
      discos: [cable(x1, 0, true), cable(x2, 0, mismo)],
      arcos: [{ c: [x1, 0], r: dc, de: -32, a: 32, color: 'i', grosor: 'fino', discontinua: true, rotulo: 'B₁', paso: o.campo }],
      flechas: [
        { de: [x1 + s * 0.55, 0], d: [s * fz, 0], escala: PXF5, color: 'd', paso: o.f },
        { de: [x2 - s * 0.55, 0], d: [-s * fz, 0], escala: PXF5, color: 'd', paso: o.f },
      ],
      textos: [{ en: [x1, -1.3], texto: `${f(i1, 0)} A`, color: 'h', peso: 700 }, { en: [x2, -1.3], texto: `${f(i2, 0)} A`, color: 'h', peso: 700 },
        { en: [x1, 1.0], texto: `F = ${f(fz, 0)}`, color: 'd', peso: 700, paso: o.f }, { en: [x2, 1.0], texto: `F = ${f(fz, 0)}`, color: 'd', peso: 700, paso: o.f },
        { en: [0, 2.7], texto: `F en μN por metro · ${mismo ? 'mismo sentido' : 'sentidos opuestos'}`, peso: 600 }],
      alt: `Dos cables paralelos a ${f(dc, 0)} cm con ${f(i1, 0)} A y ${f(i2, 0)} A en ${mismo ? 'el mismo sentido: se atraen' : 'sentidos opuestos: se repelen'}, con fuerzas iguales de ${f(fz, 0)} μN por metro.`,
    };
  }
  // El cable de la derecha está en x = d/2 (cm): arrastrarlo cambia la separación d.
  const arrastreSeparacion = datosDe => ({
    id: 'separacion', etiqueta: 'cable de la derecha (separación)',
    donde: val => { const g = LIENZO().geometria(datosDe(val)); return { x: g.X(val.d / 2), y: g.Y(0) }; },
    mover: (pt, val) => ({ d: 2 * LIENZO().geometria(datosDe(val)).Xi(pt.x) }),
  });
  const paralelosIdea = {
    id: 'cables-paralelos',
    titulo: 'Mismo sentido, se atraen',
    temas: ['Fuerza entre cables paralelos'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Dos cables paralelos, vistos desde arriba, con la misma corriente. Se acercan y se alejan solos: mira las fuerzas. Cambia el sentido del segundo.',
      voz: 'Mira hacia dónde apuntan las flechas al cambiar el sentido.',
      controles: [
        { id: 'i', etiqueta: 'I', color: 'c-h', min: 4, max: 8, paso: 2, inicio: 6, unidad: 'A', decimales: 0 },
        { id: 'm', etiqueta: 'Segundo cable', opciones: [{ valor: 1, texto: 'Mismo sentido' }, { valor: 0, texto: 'Opuesto' }] },
        { id: 'd', etiqueta: 'Separación', min: 4, max: 8, paso: 2, inicio: 6, unidad: 'cm', decimales: 0, auto: { velocidad: 2, modo: 'rebota' } },
      ],
      dibujo: val => ({ datos: paralelos(val.i, val.i, val.d, val.m === 1), estado: {} }),
      lectura: val => [F, ` = ${f(fPar(val.i, val.i, val.d), 0)} μN por metro · ${val.m === 1 ? 'se atraen' : 'se repelen'}`],
      arrastres: [arrastreSeparacion(val => paralelos(val.i, val.i, val.d, val.m === 1))],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora las corrientes son distintas: 8 A en uno y 2 A en el otro, en el mismo sentido y a 4 cm. ¿Cuál siente más fuerza?',
      opciones: [
        { id: 'c', texto: 'Los dos sienten la misma', correcta: true },
        { id: 'grande', texto: 'El de 2 A: el otro es más fuerte', error: 'MG6', siFuera: 'El de 8 A crea más campo, pero el de 2 A tiene menos corriente: el producto es igual.' },
        { id: 'chico', texto: 'El de 8 A', error: 'MG6', siFuera: 'El de 8 A tiene más corriente, pero está en el campo más débil, el del cable de 2 A.' },
      ],
      dibujo: { datos: paralelos(8, 2, 4, true, { f: 9 }), estado: {} },
      revelar: { datos: paralelos(8, 2, 4, true), estado: {} },
      coincide: `Coincide: ${f(fPar(8, 2, 4), 0)} μN por metro sobre cada uno. Es una sola interacción.`,
    },
    mira: {
      datos: paralelos(8, 2, 4, true, { campo: 1, f: 2 }),
      pasos: [
        { estado: { paso: 0 }, texto: 'Dos cables con corriente en el mismo sentido.', ecuacion: [{ sub: [I, '1'] }, ' = 8 A', '   ·   ', { sub: [I, '2'] }, ' = 2 A', '   ·   ', 'd = 4 cm'] },
        { estado: { paso: 1 }, texto: 'El campo del primero llega al segundo:', ecuacion: [{ sub: [B, '1'] }, ' = ', { frac: [['μ₀', { sub: [I, '1'] }], '2π d'] }, ` = ${f(bHilo(8, 4), 0)} μT`] },
        { estado: { paso: 2 }, texto: 'El segundo cable, en ese campo, recibe por metro:', ecuacion: [{ frac: [F, 'L'] }, ' = ', { sub: [I, '2'] }, { sub: [B, '1'] }, ` = 2 · ${f(bHilo(8, 4), 0)} μT = ${f(fPar(8, 2, 4), 0)} μN/m`] },
        { estado: { paso: 2 }, texto: 'Al revés da lo mismo: la fórmula tiene el producto I₁I₂.', ecuacion: [{ frac: [F, 'L'] }, ' = ', { frac: [['μ₀', { sub: [I, '1'] }, { sub: [I, '2'] }], '2π d'] }] },
      ],
    },
    regla: {
      texto: 'Dos cables paralelos se atraen si sus corrientes van en el mismo sentido y se repelen si van opuestas, con fuerzas iguales sobre los dos.',
      ecuacion: [{ frac: [F, 'L'] }, ' = ', { frac: [['μ₀', { sub: [I, '1'] }, { sub: [I, '2'] }], ['2π ', { llave: ['d'], nota: 'separación' }]] }],
      condicion: 'cables rectos, largos y paralelos, separados una distancia d en metros.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), i1 = x.de([2, 4, 5, 10]), i2 = x.de([1, 3, 5, 20]), dc = x.de([1, 2, 5, 10]), mismo = s % 2 === 0, fz = fPar(i1, i2, dc);
        if (s % 3 === 1) return {
          pregunta: `Dos cables paralelos llevan ${f(i1)} A y ${f(i2)} A en sentidos ${mismo ? 'iguales' : 'opuestos'}. ¿Qué hacen?`,
          opciones: [
            { id: 'c', texto: mismo ? 'Se atraen con fuerzas iguales' : 'Se repelen con fuerzas iguales', correcta: true },
            { id: 'sentido', texto: mismo ? 'Se repelen con fuerzas iguales' : 'Se atraen con fuerzas iguales', error: 'MG4', siFuera: mismo ? 'Así pasa con corrientes opuestas. Iguales se atraen, al revés que las cargas.' : 'Así pasa con corrientes del mismo sentido.' },
            { id: 'distinta', texto: mismo ? 'Se atraen; empuja más el de más corriente' : 'Se repelen; empuja más el de más corriente', error: 'MG6', siFuera: 'Cada uno recibe la misma fuerza: acción y reacción.' },
          ],
          solucion: { texto: mismo ? 'Mismo sentido: se atraen. La fuerza tiene el producto I₁I₂.' : 'Sentidos opuestos: se repelen.', ecuacion: [{ frac: [F, 'L'] }, ` = ${f(fz, 1)} μN/m sobre cada uno`] },
        };
        return {
          pregunta: ['Dos cables paralelos a ', `${f(dc)} cm llevan `, { sub: [I, '1'] }, ` = ${f(i1)} A y `, { sub: [I, '2'] }, ` = ${f(i2)} A. ¿Qué fuerza por metro se ejercen?`],
          opciones: opciones(fz, [
            { id: 'cm', valor: fz / 100, error: 'MG-UNID', siFuera: 'Esa cuenta deja d en centímetros.' },
            { id: 'suma', valor: 2e-7 * (i1 + i2) / (dc / 100) * 1e6, error: 'MG6', siFuera: 'Esa cuenta suma las corrientes; van multiplicadas.' },
            { id: 'd2', valor: fz / (dc / 100), error: 'MG-R2', siFuera: 'Esa cuenta divide entre d²; aquí es entre d.' },
          ], n => `${f(n, 1)} μN/m`),
          solucion: { texto: '2 × 10⁻⁷ por el producto de corrientes, entre d en metros.', ecuacion: [{ frac: [F, 'L'] }, ...pot(` = 2×10⁻⁷ · ${f(i1)} · ${f(i2)} / ${f(dc / 100)} = ${f(fz, 1)} μN/m`)] },
        };
      },
    },
  };

  // La mano derecha en 3D (laboratorio 3D, 15 nov: exploración libre, sin predicciones). F = q v × B la calcula el motor
  // de plantillas/magnetismo (fuerzaCarga) a través de nucleo/fisica3d.js: la flecha, la lectura y los retos usan el mismo
  // número. B fijo hacia la derecha; v forma el ángulo θ con B y gira alrededor de B. F se mide en veces qvB.
  const lz = val => F3.lorentz(val);
  const mismo = (a, b) => Math.abs(a - b) < 1e-9;
  const mesaMano = {
    id: 'mano-derecha-3d', titulo: 'La mano derecha en 3D', pieza: 'fis-espacio-3d',
    consigna: 'El ángulo entre v y B se abre y se cierra solo: mira cómo cambia F. Gira la escena con el dedo.',
    controles: [
      { id: 'th', etiqueta: 'Ángulo entre v y B', min: 0, max: 180, paso: 15, inicio: 60, unidad: '°', decimales: 0, auto: { velocidad: 30, modo: 'rebota' } },
      { id: 'fi', etiqueta: 'Giro de v alrededor de B', min: 0, max: 315, paso: 45, inicio: 90, unidad: '°', decimales: 0 },
      { id: 'q', etiqueta: 'Carga', opciones: [{ valor: 1, texto: 'Positiva' }, { valor: -1, texto: 'Negativa' }] },
    ],
    dibujo: val => ({ datos: lz(val).datos, estado: {} }),
    lectura: val => [`θ = ${f(val.th, 0)}° · `, F, ` = ${f(lz(val).modulo)} · q`, v, B],
    invitaciones: [
      { texto: 'Haz que la carga se mueva y no sienta ninguna fuerza.',
        logrado: val => mismo(lz(val).modulo, 0),
        bien: 'v va a lo largo de B: no cruza ninguna línea del campo.',
        pista: 'Lleva el ángulo entre v y B a un extremo.' },
      { texto: 'Logra la fuerza más grande que permite la mesa.',
        logrado: val => mismo(lz(val).modulo, 1),
        bien: 'A 90°, toda la velocidad cruza el campo: F = qvB entera.' },
      { texto: 'Con la carga positiva, haz que F apunte hacia arriba.',
        logrado: val => val.q > 0 && lz(val).F[2] > 0.5,
        bien: 'Dedos con v, doblados hacia B: el pulgar sale hacia arriba.',
        pista: 'Deja θ en 90° y prueba otros giros de v alrededor de B.' },
      { texto: 'Logra que F valga justo la mitad de qvB.',
        logrado: val => mismo(lz(val).modulo, 0.5),
        bien: 'sen 30° = 1/2: solo la mitad de v cruza el campo.',
        pista: 'La línea punteada es la parte de v que cruza B. Hazla la mitad de v.' },
      { texto: 'Guarda dos casos con distinto ángulo y la misma fuerza F, en tamaño y sentido.',
        logrado: (val, guardados) => guardados.some(a => guardados.some(b => a.th !== b.th && lz(a).modulo > 0.1
          && lz(a).F.every((c, k) => mismo(c, lz(b).F[k])))),
        bien: 'θ y 180° − θ: la parte de v que cruza B es la misma.' },
    ],
  };

  return {
    unidad: 'fisica.magnetismo',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-lienzo.js', '/plantillas/magnetismo/motor.js', '/nucleo/fisica3d.js', '/nucleo/kit/piezas/fis-espacio-3d.js'],
    // Glosario del tema (docs/teoria.md, 4d): lo que esta unidad estrena. Corriente y voltaje vienen de circuitos.
    glosario: [
      { termino: 'imán', def: 'Objeto que atrae el hierro y tiene dos polos, norte y sur, que no se pueden separar.',
        formas: ['imán', 'imanes'], ver: ['polo magnético', 'campo magnético'] },
      { termino: 'polo magnético', def: 'Cada extremo de un imán, norte o sur. Polos iguales se repelen; distintos se atraen.',
        formas: ['polo magnético', 'polos magnéticos', 'polo norte', 'polo sur'], ejemplo: 'El norte de una brújula apunta hacia el norte geográfico.', ver: ['imán'] },
      { termino: 'campo magnético', simbolo: 'B', medida: 'T', def: 'Lo que un imán o una corriente crea a su alrededor y que empuja cargas en movimiento.',
        formas: ['campo magnético', 'campos magnéticos'], ejemplo: 'Un cable con 10 A, a 4 cm: B = 50 μT.', ver: ['tesla', 'fuerza magnética'] },
      { termino: 'tesla', simbolo: 'T', def: 'Unidad del campo magnético en el SI. El campo de la Tierra es de unas decenas de microteslas.',
        ejemplo: '1 T empuja con 1 N a 1 m de cable con 1 A, a 90°.', ver: ['campo magnético'] },
      { termino: 'experimento de Oersted', def: 'Prueba de 1820: una corriente cercana desvía una brújula. Mostró que la electricidad produce efectos magnéticos.',
        formas: ['experimento de Oersted', 'experimento de Ørsted'], ver: ['campo magnético'] },
      { termino: 'mano derecha', def: 'Truco para hallar sentidos: pulgar con la corriente; los dedos doblados dan el giro del campo.',
        formas: ['regla de la mano derecha', 'mano derecha'], ver: ['campo magnético', 'fuerza magnética'] },
      { termino: 'espira', def: 'Alambre doblado en una sola vuelta cerrada, como un anillo, por donde pasa corriente.',
        ejemplo: 'Radio 5 cm con 10 A: en su centro, B ≈ 126 μT.', ver: ['solenoide'] },
      { termino: 'solenoide', def: 'Alambre enrollado en muchas vueltas seguidas, como un resorte. Adentro produce un campo casi uniforme.',
        ejemplo: '20 vueltas en 10 cm con 2 A: adentro, B ≈ 0,50 mT.', ver: ['espira', 'campo magnético'] },
      { termino: 'fuerza magnética', simbolo: 'F', medida: 'N', def: 'Empuje de un campo magnético sobre una carga que se mueve o un cable con corriente. Siempre va de costado.',
        formas: ['fuerza magnética', 'fuerzas magnéticas'], ejemplo: 'Cable de 0,5 m con 6 A, a 90° de 0,2 T: F = 0,6 N.', ver: ['mano derecha'] },
    ],
    laboratorio: [
      mesaMano,
      {
        // Lo que la idea 4 no deja probar: cualquier ángulo de 0° a 180°, también el cable paralelo a B (F = 0).
        id: 'cable-que-gira', titulo: 'El cable que gira', pieza: 'fis-lienzo',
        consigna: 'Gira el cable con el dedo, de 0° a 180°, y cambia la corriente. ¿Cuándo la fuerza es máxima?',
        controles: [
          { id: 'i', etiqueta: 'I', color: 'c-h', min: 2, max: 10, paso: 2, inicio: 6, unidad: 'A', decimales: 0 },
          { id: 't', etiqueta: 'Ángulo con B', min: 0, max: 180, paso: 15, inicio: 45, unidad: '°', decimales: 0 },
        ],
        dibujo: val => ({ datos: cableEnB(val.i, val.t), estado: {} }),
        lectura: val => [I, ` = ${f(val.i)}\u00a0A a ${f(val.t)}° de `, B, ': ', F, ` = ${f(fCable(val.i, val.t), 2)}\u00a0N`],
        // La punta del cable está a 2,6 cm del centro, en el ángulo θ. Bajo el eje, el ángulo se lee como 0° o 180°.
        arrastres: [{
          id: 'giro', etiqueta: 'punta del cable (ángulo con B)', color: 'c-h',
          donde: val => { const g = LIENZO().geometria(cableEnB(val.i, val.t)), a = val.t * Math.PI / 180; return { x: g.X(2.6 * Math.cos(a)), y: g.Y(2.6 * Math.sin(a)) }; },
          mover: (pt, val) => {
            const g = LIENZO().geometria(cableEnB(val.i, val.t)), x = g.Xi(pt.x), y = g.Yi(pt.y);
            let a = Math.atan2(y, x) * 180 / Math.PI;
            if (a < 0) a = a < -90 ? 180 : 0;
            return { t: a };
          },
        }],
        invitaciones: [
          { texto: 'Con la corriente que elijas, gira el cable hasta la mayor fuerza posible.',
            logrado: val => Math.abs(fCable(val.i, val.t) - val.i * LC * BC) < 1e-9,
            bien: 'Perpendicular al campo empuja más. ¿Qué pasa si sigues girando hasta 180°?' },
          { texto: 'Con corriente en el cable, logra que la fuerza sea cero.',
            logrado: val => val.i > 0 && fCable(val.i, val.t) < 1e-9,
            bien: 'La corriente sigue, pero va a lo largo de B: el campo no la empuja.' },
          { texto: 'Consigue 0,3 N en el campo de 0,2 teslas, sin poner el cable a 90°.',
            logrado: val => val.t !== 90 && Math.abs(fCable(val.i, val.t) - 0.3) < 1e-9,
            bien: 'Inclinado, solo cuenta la parte del cable perpendicular al campo: sen θ.' },
          { texto: 'Guarda dos ángulos distintos, con la misma corriente, que den la misma fuerza.',
            logrado: (val, guardados) => fCable(val.i, val.t) > 1e-9
              && guardados.some(g => g.i === val.i && g.t !== val.t && Math.abs(fCable(g.i, g.t) - fCable(val.i, val.t)) < 1e-9)
              && guardados.some(g => g.i === val.i && g.t === val.t),
            bien: 'θ y 180° − θ tienen el mismo seno: el campo no distingue esos giros.' },
        ],
      },
      {
        // Lo que la idea 5 reserva: corrientes distintas. La fuerza sigue siendo igual sobre los dos cables.
        id: 'cables-distintos', titulo: 'Dos corrientes distintas', pieza: 'fis-lienzo',
        consigna: 'Pon corrientes distintas en los dos cables y arrastra el de la derecha. Compara las dos flechas.',
        controles: [
          { id: 'i1', etiqueta: 'I₁', color: 'c-h', min: 2, max: 10, paso: 2, inicio: 8, unidad: 'A', decimales: 0 },
          { id: 'i2', etiqueta: 'I₂', color: 'c-h', min: 2, max: 10, paso: 2, inicio: 2, unidad: 'A', decimales: 0 },
          { id: 'm', etiqueta: 'Segundo cable', opciones: [{ valor: 1, texto: 'Mismo sentido' }, { valor: 0, texto: 'Opuesto' }], inicio: 1 },
          { id: 'd', etiqueta: 'Separación', min: 4, max: 10, paso: 1, inicio: 4, unidad: 'cm', decimales: 0 },
        ],
        dibujo: val => ({ datos: paralelos(val.i1, val.i2, val.d, val.m === 1), estado: {} }),
        lectura: val => [F, ` = ${f(fPar(val.i1, val.i2, val.d), 0)}\u00a0μN/m sobre cada cable · ${val.m === 1 ? 'se atraen' : 'se repelen'}`],
        arrastres: [arrastreSeparacion(val => paralelos(val.i1, val.i2, val.d, val.m === 1))],
        invitaciones: [
          { texto: 'Pon en un cable cinco veces la corriente del otro. ¿Qué flecha crece más?',
            logrado: val => val.i1 === 5 * val.i2 || val.i2 === 5 * val.i1,
            bien: 'Las dos flechas miden lo mismo: es una sola interacción, acción y reacción.' },
          { texto: 'Busca la menor fuerza posible sin apagar ningún cable.',
            logrado: val => fPar(val.i1, val.i2, val.d) <= fPar(2, 2, 10) + 1e-9,
            bien: 'Poca corriente y mucha separación. ¿Cuál de las dos cosas pesa más?' },
          { texto: 'Logra que se repelan con 100 μN por metro.',
            logrado: val => val.m === 0 && Math.abs(fPar(val.i1, val.i2, val.d) - 100) < 1e-6,
            bien: 'Sentidos opuestos se repelen. ¿Cuántas combinaciones dan esos 100?' },
          { texto: 'Guarda dos casos: el mismo arreglo y luego el doble de corriente en un cable.',
            logrado: (val, guardados) => guardados.some(g => g.m === val.m && g.d === val.d
              && ((g.i1 * 2 === val.i1 && g.i2 === val.i2) || (g.i2 * 2 === val.i2 && g.i1 === val.i1)))
              && guardados.some(g => g.i1 === val.i1 && g.i2 === val.i2 && g.m === val.m && g.d === val.d),
            bien: 'Doble corriente en uno, doble fuerza en los dos. ¿Y si duplicas ambas?' },
        ],
      },
      Object.assign({ id: 'brujula', titulo: 'La brújula junto al cable', pieza: 'fis-lienzo', invitaciones: [
        { texto: 'Antes del experimento de Oersted no había corriente. Apágala y mira la aguja.',
          logrado: val => val.i === 0 && giro(val.i, val.r) === 0,
          bien: 'Sin corriente solo queda la Tierra: la aguja vuelve al norte.' },
        { texto: 'Haz que la aguja gire justo 45°.',
          logrado: val => Math.abs(giro(val.i, val.r) - 45) < 1e-6,
          bien: 'A 45°, el campo del cable iguala al de la Tierra: 25 μT.' },
        { texto: 'Haz que la aguja gire más de 80°.',
          logrado: val => giro(val.i, val.r) > 80,
          bien: 'Aun así no llega a 90°: la Tierra siempre tira un poco al norte.' },
        { texto: 'Guarda dos casos con el mismo giro y distinta corriente.',
          logrado: (val, guardados) => val.i > 0
            && guardados.some(g => g.i !== val.i && Math.abs(giro(g.i, g.r) - giro(val.i, val.r)) < 1e-9)
            && guardados.some(g => g.i === val.i && g.r === val.r),
          bien: 'Doble corriente al doble de distancia, el mismo campo: B va con I/r.' },
      ] }, oerstedIdea.juega),
    ],
    historia: {
      texto: 'La brújula se usaba desde hacía siglos, pero nadie la relacionaba con la electricidad. En 1820, Hans Christian Ørsted notó que una corriente desviaba una aguja imantada cercana, y que el giro no apuntaba hacia el alambre sino alrededor de él. La noticia corrió por Europa: en semanas, Ampère medía fuerzas entre cables con corriente.',
      pregunta: '¿Por qué la aguja no apunta hacia el cable?',
      fuente: { titulo: 'NASA — Oersted and the discovery of electromagnetism', url: 'https://pwg.gsfc.nasa.gov/earthmag/oersted.htm' },
    },
    ideas: [oerstedIdea, solenoideIdea, cargaIdea, cableIdea, paralelosIdea],
  };
});
