/*
 * Teoría de «Inducción electromagnética» (fisica.induccion-electromagnetica). Molde: contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 17), precisiones de física del expediente
 * (docs/teoria/fuentes/teoria-152-unidades.txt: «el cambio genera fem; corriente y luz requieren circuito cerrado»)
 * y docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md (MG3, MG7, MG8, MG9, MG10).
 * Colores (regla 4): B turquesa (c-i), Φ verde (c-d), ε rojo (c-h), v naranja (c-o). I, N, A, t y θ van en tinta.
 * Estado: completa (14 nov 2026): seis ideas, una por tema del catálogo.
 * Códigos de error nuevos (hipótesis, sin dato propio): FL-SIN-COS, FL-SEN, FA-SIN-N, FA-SIN-RESTA, FA-POR,
 * LZ-NADA, BA-SIN-L, AC-PROMEDIO, AC-MITAD, AC-PICO, TR-CONTINUA, TR-INVERSA, TR-CORRIENTE.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: seis relaciones de la inducción, cada una jugada antes de preguntarla.
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: calcula un flujo y una fem, y predice el sentido de la corriente inducida.
 *   Orden de atención: 1.º la figura (espira, barra o gráfica) · 2.º la lectura en vivo · acción: botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué un imán quieto no enciende nada aunque su campo sea enorme?
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // nucleo/fisica3d.js arma la mesa 3D «La espira y su sombra» con el motor de plantillas/induccion (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/fisica3d.js')) : fabrica(root.Kit, root.Fisica3D);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, F3) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const B = { v: 'c-i', t: 'B' }, Phi = { v: 'c-d', t: 'Φ' }, eps = { v: 'c-h', t: 'ε' }, v = { v: 'c-o', t: 'v' };
  const dPhi = ['Δ', Phi];
  const COL = { B: 'i', v: 'o', I: 'tinta', e: 'h', Bi: 'tinta' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
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
  // cos de los ángulos de la convención de academia (37° y 53° con 3-4-5).
  const COS = { 0: 1, 37: 0.8, 53: 0.6, 60: 0.5, 90: 0 };
  const cosG = g => (COS[g] !== undefined ? COS[g] : Math.cos(g * Math.PI / 180));
  // Gesto directo: cada manija usa la geometría que exporta su pieza, con los mismos datos que se dibujan.
  const FLE = () => Kit.piezas.flechas, EJ = () => Kit.piezas.ejes, ESP = () => Kit.piezas['fis-espira'];

  // ---------- Idea 1: el flujo cuenta las líneas que cruzan ----------
  // Cambia: el ángulo de la espira y la intensidad de B · Permanece: el área de la espira (0,5 m²) ·
  // Progresa: la sombra de la espira sobre el piso, perpendicular a B · Se reserva: la espira paralela a B (sombra nula) ·
  // Debe verse: Φ es B por el área que B «ve», A cos θ, con θ medido desde la normal.
  const AREA = 0.5, LADO = 4;
  function flujoDib(Bv, th, conSombra = true, extra = {}) {
    const r = th * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), h = LADO / 2;
    const flechas = [-3.2, -1.6, 1.6, 3.2].map(x => ({ de: [x, -2.6], a: [x, -2.6 + 3 + 2.2 * Bv], color: 'i', grosor: 'contorno' }));
    flechas[3].rotulo = 'B';
    flechas.push({ de: [0, 0], a: [-2.2 * s, 2.2 * c], color: 'tinta', grosor: 'contorno', rotulo: 'n' });
    return Object.assign({
      flechas,
      segmentos: [{ de: [-h * c, -h * s], a: [h * c, h * s], color: 'tinta' }].concat(conSombra ? [{ de: [-h * c, -3.2], a: [h * c, -3.2], color: 'd', texto: `A cos θ = ${f(AREA * cosG(th))} m²` }] : []),
      angulos: th > 0 ? [{ en: [0, 0], de: 90, a: 90 + th, texto: `θ = ${f(th, 0)}°` }] : [],
      guias: [{ de: [0, -2.6], a: [0, 2.8], color: 'tinta' }],
    }, extra);
  }
  const flujoDe = val => val.B * AREA * Math.cos(val.th * Math.PI / 180);   // Wb, lo que lee la mesa
  const flujo = {
    id: 'flujo',
    titulo: 'El flujo cuenta lo que cruza',
    temas: ['Flujo magnético'],
    pieza: 'flechas',
    juega: {
      consigna: 'El segmento es una espira de 0,5 m² vista de canto; n, su normal. Gírala y cambia B. La franja verde es su sombra.',
      voz: 'Mira la sombra, no la espira.',
      controles: [
        { id: 'B', etiqueta: 'B', color: 'c-i', min: 0.2, max: 1, paso: 0.2, inicio: 0.6, unidad: 'T', decimales: 1 },
        { id: 'th', etiqueta: 'θ', min: 0, max: 90, paso: 15, inicio: 30, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: flujoDib(val.B, val.th), estado: { paso: 0 } }),
      lectura: val => [Phi, ` = ${f(flujoDe(val), 3)}\u00a0Wb`],
      minimo: 3,
      // Gira la espira tomando la punta de su normal; estira las flechas de B tomando la de la derecha.
      arrastres: [
        { id: 'normal', etiqueta: 'punta de la normal n (ángulo θ)',
          donde: val => { const g = FLE().geometria(flujoDib(val.B, val.th)), r = val.th * Math.PI / 180; return { x: g.X(-2.2 * Math.sin(r)), y: g.Y(2.2 * Math.cos(r)) }; },
          mover: (pt, val) => { const g = FLE().geometria(flujoDib(val.B, val.th)); return { th: Math.atan2(-g.Xi(pt.x), g.Yi(pt.y)) * 180 / Math.PI }; } },
        { id: 'campo', etiqueta: 'punta de una flecha de B', color: 'c-i',
          donde: val => { const g = FLE().geometria(flujoDib(val.B, val.th)); return { x: g.X(-3.2), y: g.Y(0.4 + 2.2 * val.B) }; },
          mover: (pt, val) => { const g = FLE().geometria(flujoDib(val.B, val.th)); return { B: (g.Yi(pt.y) - 0.4) / 2.2 }; } },
      ],
    },
    predice: {
      pregunta: ['Una espira de 0,5 m² está en un campo ', B, ' = 0,8 T, con su plano paralelo a las líneas (θ = 90° con la normal). ¿Cuánto vale el flujo?'],
      opciones: [
        { id: 'c', texto: '0 Wb', correcta: true },
        { id: 'sin-cos', texto: '0,4 Wb', error: 'FL-SIN-COS', siFuera: '0,4 Wb sería cierto con la espira de frente a B. Así, ninguna línea la cruza.' },
        { id: 'divide', texto: '1,6 Wb', error: 'FA-POR', siFuera: 'Eso divide B entre el área. El flujo multiplica B por el área que cruza.' },
        { id: 'campo', texto: '0,8 Wb', error: 'MG10', siFuera: '0,8 es el campo, en teslas. El flujo depende también del área y del ángulo.' },
      ],
      dibujo: { datos: flujoDib(0.8, 90, false), estado: { paso: 0 } },
      revelar: { datos: flujoDib(0.8, 90, true), estado: { paso: 0 } },
      coincide: 'Coincide: de canto, la espira no tiene sombra y ninguna línea la atraviesa.',
    },
    mira: {
      datos: Object.assign(flujoDib(0.8, 60, true), {
        segmentos: [{ de: [-1, -1.73], a: [1, 1.73], color: 'tinta', paso: 0 }, { de: [-1, -3.2], a: [1, -3.2], color: 'd', texto: 'A cos 60° = 0,25 m²', paso: 2 }],
        angulos: [{ en: [0, 0], de: 90, a: 150, texto: 'θ = 60°', paso: 1 }],
      }),
      pasos: [
        { estado: { paso: 0 }, texto: 'Campo de 0,8 T; espira de 0,5 m².', ecuacion: [B, ' = 0,8 T', '   ·   ', 'A = 0,5 m²'] },
        { estado: { paso: 1 }, texto: 'θ se mide entre B y la normal n de la espira.', ecuacion: ['θ = 60°'] },
        { estado: { paso: 2 }, texto: 'B solo atraviesa la sombra de la espira: A cos θ.', ecuacion: ['A cos θ = 0,5 · 0,5 = 0,25 m²'] },
        { estado: { paso: 2 }, texto: 'El flujo es B por esa sombra.', ecuacion: [Phi, ' = 0,8 · 0,25 = 0,2 Wb'] },
      ],
    },
    regla: {
      texto: 'El flujo magnético mide cuánto campo atraviesa una superficie: B por el área que queda de frente al campo. Se mide en weber (Wb).',
      ecuacion: [Phi, ' = ', B, ' ', { llave: ['A cos θ'], nota: 'la sombra', color: 'c-d' }],
      condicion: 'B es uniforme sobre la espira y θ es el ángulo entre B y la normal, no entre B y el plano.',
    },
    ahoraTu: {
      pieza: 'flechas',
      generar(s) {
        const r = azar(s), Bv = r.de([0.2, 0.4, 0.5, 0.6, 0.8]), A = r.de([0.2, 0.5, 1, 2]), th = r.de([0, 37, 53, 60]);
        const c = cosG(th), fi = Bv * A * c, se = th === 0 ? 0 : th === 37 ? 0.6 : th === 53 ? 0.8 : Math.sqrt(3) / 2;
        return {
          pregunta: ['Una espira de ', `${f(A)} m² está en un campo `, B, ` = ${f(Bv)} T. La normal forma ${f(th, 0)}° con B${th === 37 || th === 53 ? ' (cos 37° = 0,8)' : ''}. ¿Cuánto vale el flujo?`],
          dibujo: { datos: flujoDib(Bv, th, false), estado: { paso: 0 } },
          opciones: opciones(fi, [
            { id: 'sin-cos', valor: Bv * A, error: 'FL-SIN-COS', siFuera: 'Eso vale con la espira de frente a B. Aquí está inclinada.' },
            { id: 'seno', valor: Bv * A * se, error: 'MG3', siFuera: 'Eso usa el seno: el ángulo con el plano, no con la normal.' },
            { id: 'divide', valor: Bv / A, error: 'FA-POR', siFuera: 'Eso divide B entre el área; el flujo los multiplica.' },
          ], n => `${f(n, 3)} Wb`),
          solucion: { texto: 'B por el área de frente al campo.', ecuacion: [Phi, ` = ${f(Bv)} · ${f(A)} · ${f(c, 3)} = ${f(fi, 3)} Wb`], dibujo: { datos: flujoDib(Bv, th, true), estado: { paso: 0 } } },
        };
      },
    },
  };

  // ---------- Idea 2: Faraday, la fem es la rapidez del cambio ----------
  // Cambia: cuánto sube el flujo y en cuánto tiempo · Permanece: la bobina de 50 vueltas y el tramo plano final ·
  // Progresa: la pendiente de cada tramo de Φ–t, con su fem rotulada encima · Se reserva: el tramo plano (Φ grande, ε = 0) ·
  // Debe verse: la fem sale de la pendiente de Φ–t, no de su altura.
  const NV = 50;
  const femSube = (F1, ts) => NV * F1 / ts, femBaja = F1 => NV * F1 / 0.4;   // V: el flujo cae a cero en 0,4 s
  function faradayDib(F1, ts, rot = true, desde = {}) {
    const e1 = femSube(F1, ts), e3 = femBaja(F1), T3 = 1.2;
    return {
      x: { min: 0, max: 2, paso: 0.4, nombre: 't', unidad: 's', decimales: 1 },
      y: { min: 0, max: 1.2, paso: 0.2, nombre: 'Φ', unidad: 'Wb', decimales: 1, color: 'd' },
      curvas: [
        { puntos: [[0, 0], [ts, F1]], color: 'd', desde: desde.a },
        { puntos: [[ts, F1], [T3, F1]], color: 'd', desde: desde.b },
        { puntos: [[T3, F1], [T3 + 0.4, 0], [2, 0]], color: 'd', desde: desde.c },
      ],
      // La fem de cada tramo va en rojo (su color), pegada al tramo: es la pendiente, no la altura.
      puntos: rot ? [
        { x: ts / 2, y: F1 / 2, color: 'h', rotulo: `ε = ${f(e1, 1)} V`, desde: desde.a },
        { x: (ts + T3) / 2, y: F1, color: 'h', rotulo: 'ε = 0', desde: desde.b },
        { x: T3 + 0.3, y: F1 / 4, color: 'h', rotulo: `ε = −${f(e3, 1)} V`, desde: desde.c },
      ] : [],
    };
  }
  const faraday = {
    id: 'faraday',
    titulo: 'La fem nace del cambio',
    temas: ['Ley de Faraday'],
    pieza: 'ejes',
    juega: {
      consigna: 'El flujo de una bobina de 50 vueltas sube, se queda quieto y cae a cero en 0,4 s. Elige cuánto sube y en cuánto.',
      voz: 'Compara la fem del tramo que sube con la del tramo plano.',
      controles: [
        { id: 'F1', etiqueta: 'Φ final', color: 'c-d', min: 0.2, max: 1, paso: 0.2, inicio: 0.4, unidad: 'Wb', decimales: 1 },
        { id: 'ts', etiqueta: 'Sube en', min: 0.2, max: 0.6, paso: 0.2, inicio: 0.4, unidad: 's', decimales: 1 },
      ],
      dibujo: val => ({ datos: faradayDib(val.F1, val.ts), estado: {} }),
      lectura: val => [eps, ` al subir = 50 · ${f(val.F1, 1)} / ${f(val.ts, 1)} = ${f(femSube(val.F1, val.ts), 1)}\u00a0V`],
      minimo: 3,
      // Arrastra la esquina donde el flujo deja de subir: arriba-abajo cambia Φ final; a los lados, cuánto tarda.
      arrastres: [{ id: 'esquina', etiqueta: 'esquina del tramo que sube', color: 'c-d',
        donde: val => { const g = EJ().geometria(faradayDib(val.F1, val.ts)); return { x: g.X(val.ts), y: g.Y(val.F1) }; },
        mover: (pt, val) => { const g = EJ().geometria(faradayDib(val.F1, val.ts)); return { F1: g.Yi(pt.y), ts: g.Xi(pt.x) }; } }],
    },
    predice: {
      pregunta: ['Un imán quieto deja un flujo de ', Phi, ' = 0,8 Wb dentro de una bobina de 50 vueltas, durante 10 s. ¿Qué fem marca el voltímetro?'],
      opciones: [
        { id: 'c', texto: '0 V', correcta: true },
        { id: 'flujo', texto: '40 V: 50 · 0,8', error: 'MG10', siFuera: 'N · Φ es cierto como tamaño del flujo total. La fem pide cuánto cambia por segundo.' },
        { id: 'tiempo', texto: '4 V: 50 · 0,8 / 10', error: 'FA-SIN-RESTA', siFuera: 'Dividir entre el tiempo está bien si Φ cambia. Aquí ΔΦ = 0.' },
        { id: 'campo', texto: 'Depende de lo fuerte del imán', error: 'MG7', siFuera: 'Un imán más fuerte da más flujo, pero si nada cambia, la fem sigue en 0.' },
      ],
      dibujo: { datos: { x: { min: 0, max: 10, paso: 2, nombre: 't', unidad: 's', decimales: 0 }, y: { min: 0, max: 1, paso: 0.2, nombre: 'Φ', unidad: 'Wb', decimales: 1, color: 'd' }, curvas: [{ puntos: [[0, 0.8], [10, 0.8]], color: 'd' }] }, estado: {} },
      revelar: { datos: { x: { min: 0, max: 10, paso: 2, nombre: 't', unidad: 's', decimales: 0 }, y: { min: 0, max: 1, paso: 0.2, nombre: 'Φ', unidad: 'Wb', decimales: 1, color: 'd' }, curvas: [{ puntos: [[0, 0.8], [10, 0.8]], color: 'd', rotulo: 'pendiente 0 → ε = 0', en: [3, 0.9] }] }, estado: {} },
      coincide: 'Coincide: el flujo es grande, pero no cambia; la gráfica está plana.',
    },
    mira: {
      datos: faradayDib(0.6, 0.2, true, { a: 1, b: 2, c: 3 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'El flujo sube 0,6 Wb en 0,2 s: pendiente grande.', ecuacion: [eps, ' = 50 · ', { frac: ['0,6', '0,2'] }, ' = 150 V'] },
        { estado: { corte: 2 }, texto: 'El flujo se queda en 0,6 Wb: pendiente cero.', ecuacion: [dPhi, ' = 0  →  ', eps, ' = 0'] },
        { estado: { corte: 3 }, texto: 'Baja 0,6 Wb en 0,4 s: fem menor y de signo contrario.', ecuacion: [eps, ' = 50 · ', { frac: ['0,6', '0,4'] }, ' = 75 V'] },
      ],
    },
    regla: {
      texto: 'La fem inducida en una bobina es proporcional a la rapidez con que cambia el flujo, multiplicada por sus vueltas.',
      ecuacion: [eps, ' = −N ', { llave: [{ frac: [dPhi, 'Δt'] }], nota: 'el ritmo', color: 'c-d' }],
      condicion: 'Φ es el flujo por una vuelta; el cociente da la fem media en ese intervalo. El signo menos lo explica Lenz.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), N = r.de([10, 20, 50, 100, 200]), Fi = r.de([0, 0.1, 0.2]), dF = r.de([0.1, 0.2, 0.3, 0.5]), dt = r.de([0.1, 0.2, 0.5]);
        const Ff = Fi + dF, e = N * dF / dt;
        return {
          pregunta: [`En una bobina de ${f(N, 0)} vueltas el flujo pasa de `, `${f(Fi, 1)} Wb a ${f(Ff, 1)} Wb en ${f(dt, 1)} s. ¿Qué fem media se induce (en valor)?`],
          opciones: opciones(e, [
            { id: 'sin-n', valor: dF / dt, error: 'FA-SIN-N', siFuera: 'Eso es la fem de una sola vuelta. Hay que multiplicar por las vueltas.' },
            { id: 'sin-resta', valor: N * Ff / dt, error: 'FA-SIN-RESTA', siFuera: 'Eso usa el flujo final; la fem sale del cambio de flujo.' },
            { id: 'por', valor: N * dF * dt, error: 'FA-POR', siFuera: 'Eso multiplica por el tiempo; la fem es cambio por segundo.' },
          ], n => `${f(n, 2)} V`),
          solucion: { texto: 'Cambio de flujo por segundo, por las vueltas.', ecuacion: ['|', eps, `| = ${f(N, 0)} · ${f(dF, 1)} / ${f(dt, 1)} = ${f(e, 2)} V`] },
        };
      },
    },
  };

  // ---------- Idea 3: Lenz, la espira se opone al cambio ----------
  // Cambia: qué polo mira a la espira y si el imán se acerca o se aleja · Permanece: la espira de canto y su eje ·
  // Progresa: B del imán → campo inducido → corriente (⊙ y ⊗) · Se reserva: alejar el imán (la espira lo atrae) ·
  // Debe verse: el campo inducido va contra el cambio de flujo, no siempre contra el campo del imán.
  function lenz(polo, mueve) {
    const dirB = polo === 'N' ? 'der' : 'izq';
    const inducido = mueve === 'quieto' ? null : mueve === 'acerca' ? (dirB === 'der' ? 'izq' : 'der') : dirB;
    const corriente = inducido === 'der' ? 'horario' : inducido === 'izq' ? 'antihorario' : null;
    const cara = inducido === 'izq' ? 'N' : inducido === 'der' ? 'S' : null; // la cara de la espira que mira al imán
    return { inducido, corriente, cara, repele: cara ? cara === polo : null };
  }
  const lenzDib = (polo, mueve, conRespuesta = true) => {
    const L = lenz(polo, mueve);
    return { datos: { modo: 'iman', colores: COL, iman: { x: mueve === 'acerca' ? 0.65 : mueve === 'aleja' ? 0.35 : 0.5, polo, mueve }, corriente: conRespuesta ? L.corriente : null, inducido: conRespuesta ? L.inducido : null }, estado: {} };
  };
  const lenzIdea = {
    id: 'lenz',
    titulo: 'La espira se opone al cambio',
    temas: ['Ley de Lenz'],
    pieza: 'fis-espira',
    juega: {
      consigna: 'Elige qué polo mira a la espira y qué hace el imán. ⊙ es corriente que sale de la pantalla; ⊗, que entra.',
      voz: 'Fíjate hacia dónde apunta el campo de la espira en cada caso.',
      controles: [
        { id: 'polo', etiqueta: 'Polo hacia la espira', opciones: [{ valor: 'N', texto: 'N' }, { valor: 'S', texto: 'S' }] },
        { id: 'mueve', etiqueta: 'El imán', opciones: [{ valor: 'acerca', texto: 'se acerca' }, { valor: 'aleja', texto: 'se aleja' }, { valor: 'quieto', texto: 'quieto' }] },
      ],
      dibujo: val => lenzDib(val.polo, val.mueve),
      lectura: val => {
        const L = lenz(val.polo, val.mueve);
        return L.cara ? [`La espira le muestra un ${L.cara}: ${L.repele ? 'lo repele' : 'lo atrae'}`] : ['Flujo constante: no hay corriente'];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'El polo N de un imán se aleja de la espira. ¿Qué hace la espira con el imán?',
      opciones: [
        { id: 'c', texto: 'Lo atrae: le muestra un polo S', correcta: true },
        { id: 'repele', texto: 'Lo repele: le muestra un polo N', error: 'MG9', siFuera: 'Repeler es lo que pasa al acercarlo. Al alejarlo, el flujo baja y la espira lo retiene.' },
        { id: 'nada', texto: 'Nada: el imán no la toca', error: 'LZ-NADA', siFuera: 'No hay contacto, es cierto. Pero el flujo cambia, y eso basta para inducir corriente.' },
        { id: 'quieto', texto: 'Solo actúa si el imán se acerca', error: 'MG8', siFuera: 'Acercar induce corriente. Alejar también cambia el flujo, en sentido contrario.' },
      ],
      dibujo: lenzDib('N', 'aleja', false),
      revelar: lenzDib('N', 'aleja', true),
      coincide: 'Coincide: el flujo baja y la espira crea un campo en el mismo sentido para sostenerlo.',
    },
    mira: {
      datos: lenzDib('N', 'acerca', true).datos,
      pasos: [
        { estado: { paso: 1 }, texto: 'El N se acerca: más líneas de B cruzan la espira, hacia la derecha.', ecuacion: [Phi, ' aumenta'] },
        { estado: { paso: 2 }, texto: 'La espira crea un campo hacia la izquierda: frena el aumento.', ecuacion: ['B ind. contra el cambio de ', Phi] },
        { estado: { paso: 3 }, texto: 'Ese campo pide corriente: ⊗ arriba y ⊙ abajo.', ecuacion: ['regla de la mano derecha'] },
        { estado: { paso: 3 }, texto: 'Su cara izquierda es un N frente al N: lo repele.', ecuacion: ['acercar → repele', '   ·   ', 'alejar → atrae'] },
      ],
    },
    regla: {
      texto: 'Ley de Lenz: la corriente inducida circula de modo que su propio campo se opone al cambio del flujo que la produce.',
      ecuacion: ['si ', Phi, ' sube, B ind. va contra B', '   ·   ', 'si ', Phi, ' baja, B ind. va con B'],
      condicion: 'se compara con el cambio del flujo, no con el campo: al alejar el imán, el campo inducido acompaña a B.',
    },
    ahoraTu: {
      pieza: 'fis-espira',
      generar(s) {
        const casos = [['N', 'acerca'], ['N', 'aleja'], ['S', 'acerca'], ['S', 'aleja'], ['N', 'quieto'], ['S', 'quieto']];
        const [polo, mueve] = casos[s % casos.length];
        const L = lenz(polo, mueve), r = azar(s);
        const pide = mueve === 'quieto' ? 'efecto' : r.de(['efecto', 'campo']);
        const txtMov = mueve === 'acerca' ? 'se acerca a' : mueve === 'aleja' ? 'se aleja de' : 'está quieto frente a';
        if (pide === 'efecto') {
          const bien = L.cara ? (L.repele ? 'La repele' : 'La atrae') : 'Ni la atrae ni la repele';
          const ops = [{ id: 'c', texto: bien, correcta: true }];
          if (L.cara) ops.push({ id: 'inv', texto: L.repele ? 'La atrae' : 'La repele', error: 'MG9', siFuera: 'Eso pasaría con el movimiento contrario: la espira se opone al cambio, no al imán.' });
          ops.push({ id: 'nada', texto: L.cara ? 'Ni la atrae ni la repele' : 'La repele', error: L.cara ? 'LZ-NADA' : 'MG7', siFuera: L.cara ? 'Sin contacto puede parecer que no pasa nada; pero el flujo cambia.' : 'Repele si se acercara. Quieto, el flujo no cambia: no hay corriente.' });
          if (!L.cara) ops.push({ id: 'atrae', texto: 'La atrae', error: 'MG7', siFuera: 'Atrae si se alejara. Quieto, no hay corriente inducida.' });
          return {
            pregunta: `El polo ${polo} de un imán ${txtMov} una espira. ¿Qué efecto tiene la espira sobre el imán?`,
            dibujo: lenzDib(polo, mueve, false),
            opciones: ops,
            solucion: { texto: L.cara ? `La espira le muestra un ${L.cara} a su ${polo}.` : 'Flujo constante: no hay corriente ni fuerza.', ecuacion: [L.cara ? (mueve === 'acerca' ? 'acercar → repele' : 'alejar → atrae') : [dPhi, ' = 0']].flat(), dibujo: lenzDib(polo, mueve, true) },
          };
        }
        const bien = L.inducido === 'izq' ? 'Hacia el imán (izquierda)' : 'Lejos del imán (derecha)';
        const mal = L.inducido === 'izq' ? 'Lejos del imán (derecha)' : 'Hacia el imán (izquierda)';
        return {
          pregunta: `El polo ${polo} de un imán ${txtMov} una espira. ¿Hacia dónde apunta el campo inducido en el centro de la espira?`,
          dibujo: lenzDib(polo, mueve, false),
          opciones: [
            { id: 'c', texto: bien, correcta: true },
            { id: 'inv', texto: mal, error: 'MG9', siFuera: 'Eso sería cierto con el movimiento contrario: se mira si el flujo sube o baja.' },
            { id: 'cero', texto: 'No hay campo inducido', error: 'MG8', siFuera: 'Sería cierto con el imán quieto. Aquí el flujo cambia.' },
          ],
          solucion: { texto: mueve === 'acerca' ? 'El flujo sube: el campo inducido va contra el del imán.' : 'El flujo baja: el campo inducido acompaña al del imán.', ecuacion: ['B ind. contra el cambio de ', Phi], dibujo: lenzDib(polo, mueve, true) },
        };
      },
    },
  };

  // ---------- Idea 4: la barra que barre área ----------
  // Cambia: la rapidez de la barra y el campo · Permanece: el largo ℓ = 0,5 m y el foco de 2 Ω ·
  // Progresa: el área sombreada que crece cada segundo · Se reserva: la barra detenida dentro del campo ·
  // Debe verse: la fem sale del área que se barre por segundo, ℓ·v, no del campo solo.
  // Hallazgo 9: el juego es la barra sobre los rieles y «Mira» pasa a la recta Φ–t a propósito: el área que la barra
  // barre cada segundo se vuelve la pendiente de esa recta, y la pendiente es la fem (lo que pide Faraday, idea 2).
  // La flecha de v mide 14 px por m/s (escalaV) para que se pueda estirar con el dedo; en el juego la barra está en
  // x = 4 m para que la flecha más larga no llegue a la lupa.
  const ELE = 0.5, RES = 2, EV = 14;
  const barraDib = (Bv, vv, x = 6, rot = true) => {
    const e = Bv * ELE * vv, P = e * e / RES;
    return { datos: { modo: 'barra', colores: COL, barra: { largo: 10, x, l: ELE, sentido: 'entra', v: vv, escalaV: EV, corriente: vv ? 'arriba' : null, brillo: Math.min(1, P / 1.25) }, rotulo: rot ? `ε = ${f(e, 2)} V` : undefined }, estado: {} };
  };
  const barraIdea = {
    id: 'barra-movil',
    titulo: 'La barra que barre área',
    temas: ['Fem en un conductor móvil'],
    pieza: 'fis-espira',
    juega: {
      consigna: 'Una barra de 0,5 m corre sobre dos rieles unidos por un foco. Elige su rapidez y el campo.',
      voz: 'El foco responde a cuánto área se barre cada segundo.',
      controles: [
        { id: 'v', etiqueta: 'v', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 2, unidad: 'm/s', decimales: 0 },
        { id: 'B', etiqueta: 'B', color: 'c-i', min: 0.2, max: 1, paso: 0.2, inicio: 0.6, unidad: 'T', decimales: 1 },
      ],
      dibujo: val => barraDib(val.B, val.v, 4),
      lectura: val => [eps, ` = ${f(val.B, 1)} · 0,5 · ${f(val.v, 0)} = ${f(val.B * ELE * val.v, 2)}\u00a0V`],
      minimo: 3,
      // Estira la flecha de v: más rápida, más área barrida por segundo.
      arrastres: [{ id: 'rapidez', etiqueta: 'punta de la flecha de v', color: 'c-o',
        donde: val => ESP().geometria(barraDib(val.B, val.v, 4).datos).puntaV(val.v),
        mover: (pt, val) => ({ v: ESP().geometria(barraDib(val.B, val.v, 4).datos).vDe(pt) }) }],
    },
    predice: {
      pregunta: ['La barra frena y se queda quieta en el medio del campo, con ', B, ' = 1 T. ¿Qué pasa con el foco?'],
      opciones: [
        { id: 'c', texto: 'Se apaga', correcta: true },
        { id: 'igual', texto: 'Sigue encendido: el campo sigue ahí', error: 'MG7', siFuera: 'El campo sigue, es cierto. Pero el área ya no crece: el flujo no cambia.' },
        { id: 'mas', texto: 'Brilla más: ahora está más adentro', error: 'MG10', siFuera: 'Más adentro hay más flujo, pero la fem pide que el flujo cambie.' },
      ],
      dibujo: barraDib(1, 2, 5, false),
      revelar: barraDib(1, 0, 5, true),
      coincide: 'Coincide: sin movimiento no se barre área, y sin cambio de flujo no hay fem.',
    },
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 3, paso: 1, nombre: 't', unidad: 's', decimales: 0 },
        y: { min: 0, max: 3, paso: 1, nombre: 'Φ', unidad: 'Wb', decimales: 0, color: 'd' },
        curvas: [{ puntos: [[0, 0.6], [3, 2.4]], color: 'd', desde: 1 }],
        puntos: [{ x: 0, y: 0.6, color: 'd', rotulo: '0,6 Wb', desde: 1 }, { x: 1, y: 1.2, color: 'd', rotulo: '1,2 Wb', guias: true, desde: 2 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada segundo la barra barre 0,5 · 2 = 1 m².', ecuacion: ['ΔA = ℓ ', v, ' Δt = 1 m²'] },
        { estado: { corte: 2 }, texto: 'El flujo sube 0,6 · 1 = 0,6 Wb cada segundo: una recta.', ecuacion: [dPhi, ' = ', B, ' ℓ ', v, ' Δt'] },
        { estado: { corte: 2 }, texto: 'Ley de Faraday: la fem es esa pendiente.', ecuacion: [eps, ' = ', { frac: [dPhi, 'Δt'] }, ' = ', B, ' ℓ ', v, ' = 0,6 V'] },
        { estado: { corte: 2 }, texto: 'Con el foco de 2 Ω circula una corriente.', ecuacion: ['I = ', { frac: [eps, 'R'] }, ' = 0,3 A'] },
      ],
    },
    regla: {
      texto: 'Una barra que se mueve en un campo barre área: la fem es B por el largo por la rapidez.',
      ecuacion: [eps, ' = ', B, ' ', { llave: ['ℓ ', v], nota: 'área barrida', color: 'c-o' }, '   ·   ', 'I = ', { frac: [eps, 'R'] }],
      condicion: 'B, la barra y su velocidad son perpendiculares entre sí, y el circuito está cerrado para que haya corriente.',
    },
    ahoraTu: {
      pieza: 'fis-espira',
      generar(s) {
        const r = azar(s), Bv = r.de([0.2, 0.4, 0.5, 0.8, 1]), l = r.de([0.2, 0.4, 0.5, 1]), vv = r.ent(2, 8), R = r.de([1, 2, 4]);
        const e = Bv * l * vv, I = e / R, pide = s % 2 ? 'I' : 'e';
        const bien = pide === 'e' ? e : I, fmt = n => `${f(n, 2)} ${pide === 'e' ? 'V' : 'A'}`;
        return {
          pregunta: ['Una barra de ', `${f(l)} m se mueve a `, v, ` = ${f(vv, 0)} m/s, perpendicular a un campo `, B, ` = ${f(Bv)} T, sobre rieles con R = ${f(R, 0)} Ω. ¿Cuánto vale ${pide === 'e' ? 'la fem' : 'la corriente'}?`],
          opciones: opciones(bien, pide === 'e' ? [
            { id: 'sin-l', valor: Bv * vv, error: 'BA-SIN-L', siFuera: 'Eso olvida el largo: el área barrida por segundo es ℓ·v.' },
            { id: 'div', valor: Bv * l / vv, error: 'FA-POR', siFuera: 'Eso divide entre v; más rapidez barre más área.' },
            { id: 'corr', valor: I, error: 'TR-CORRIENTE', siFuera: 'Ese número ya está dividido entre R: es la corriente.' },
            { id: 'cuad', valor: Bv * l * vv * vv, error: 'FA-POR', siFuera: 'Eso eleva v al cuadrado; la fem crece en proporción a v.' },
          ] : [
            { id: 'fem', valor: e, error: 'TR-CORRIENTE', siFuera: 'Esa es la fem, en voltios; falta dividir entre R.' },
            { id: 'sin-l', valor: Bv * vv / R, error: 'BA-SIN-L', siFuera: 'Eso olvida el largo de la barra.' },
            { id: 'por', valor: e * R, error: 'FA-POR', siFuera: 'Eso multiplica por R; la corriente es ε / R.' },
            { id: 'div', valor: Bv * l / vv / R, error: 'FA-POR', siFuera: 'Eso divide entre v; más rapidez barre más área.' },
          ], fmt),
          solucion: { texto: pide === 'e' ? 'B por el largo por la rapidez.' : 'Primero la fem; después entre la resistencia.', ecuacion: pide === 'e' ? [eps, ` = ${f(Bv)} · ${f(l)} · ${f(vv, 0)} = ${f(e, 2)} V`] : [eps, ` = ${f(e, 2)} V`, '   ·   ', `I = ${f(e, 2)} / ${f(R, 0)} = ${f(I, 2)} A`] },
        };
      },
    },
  };

  // ---------- Idea 5: el generador y el valor eficaz ----------
  // Cambia: el pico de la fem y la frecuencia · Permanece: la forma senoidal y el eje del tiempo ·
  // Progresa: las dos rectas punteadas del valor eficaz, a 0,707 del pico · Se reserva: el promedio cero de un ciclo ·
  // Debe verse: el valor eficaz no es el promedio (que da 0) ni la mitad del pico.
  const sen = (Vm, fr, conEf = true, extra = {}) => {
    const pts = [];
    for (let k = 0; k <= 80; k++) { const t = k / 80; pts.push([t, Vm * Math.sin(2 * Math.PI * fr * t)]); }
    const ef = Vm / Math.SQRT2;
    return Object.assign({
      x: { min: 0, max: 1, paso: 0.25, nombre: 't', unidad: 's', decimales: 2 },
      y: { min: -400, max: 400, paso: 200, nombre: 'ε', unidad: 'V', decimales: 0, color: 'h' },
      curvas: [{ puntos: pts, color: 'h' }].concat(conEf ? [{ puntos: [[0, ef], [1, ef]], color: 'h', discontinua: true, rotulo: `ε ef = ${f(ef, 1)} V`, en: [0.02, ef + 60] }] : []),
    }, extra);
  };
  const generador = {
    id: 'generador',
    titulo: 'Alterna: pico y eficaz',
    temas: ['Generador de corriente alterna y valores eficaces'],
    pieza: 'ejes',
    juega: {
      consigna: 'Una espira gira en un campo y su fem sube y baja. Elige el pico y cuántas vueltas da por segundo.',
      voz: 'La línea punteada no cambia de forma cuando cambias las vueltas.',
      controles: [
        { id: 'Vm', etiqueta: 'ε pico', color: 'c-h', min: 100, max: 340, paso: 20, inicio: 220, unidad: 'V', decimales: 0 },
        { id: 'fr', etiqueta: 'Vueltas por segundo', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'Hz', decimales: 0 },
      ],
      dibujo: val => ({ datos: sen(val.Vm, val.fr), estado: {} }),
      lectura: val => [`Eficaz: ${f(val.Vm, 0)} / √2 = ${f(val.Vm / Math.SQRT2, 1)}\u00a0V`],
      minimo: 3,
      // Toma la primera cresta: arriba-abajo cambia el pico; a los lados, cuántas vueltas por segundo.
      arrastres: [{ id: 'cresta', etiqueta: 'primera cresta de la fem', color: 'c-h',
        donde: val => { const g = EJ().geometria(sen(val.Vm, val.fr)); return { x: g.X(1 / (4 * val.fr)), y: g.Y(val.Vm) }; },
        mover: (pt, val) => { const g = EJ().geometria(sen(val.Vm, val.fr)); return { Vm: g.Yi(pt.y), fr: 1 / (4 * Math.max(0.01, g.Xi(pt.x))) }; } }],
    },
    predice: {
      pregunta: ['La fem de una toma sube hasta un pico de 311 V y baja hasta −311 V. ¿Cuál es su valor eficaz?'],
      opciones: [
        { id: 'c', texto: `${f(311 / Math.SQRT2, 0)} V`, correcta: true },
        { id: 'promedio', texto: '0 V: lo que sube, baja', error: 'AC-PROMEDIO', siFuera: 'El promedio con signo es 0, es cierto. Pero calienta igual en los dos sentidos.' },
        { id: 'mitad', texto: `${f(311 / 2, 1)} V`, error: 'AC-MITAD', siFuera: 'La mitad del pico sería cierto para una forma triangular de media altura; aquí es senoidal.' },
        { id: 'pico', texto: '311 V', error: 'AC-PICO', siFuera: 'El pico dura un instante. El eficaz es el valor continuo que calienta igual.' },
      ],
      dibujo: { datos: sen(311, 2, false), estado: {} },
      revelar: { datos: sen(311, 2, true), estado: {} },
      coincide: 'Coincide: el eficaz es el pico entre √2, como el que se usa en las casas.',
    },
    mira: {
      datos: sen(311, 1, true, {
        areas: [{ puntos: Array.from({ length: 41 }, (_, k) => [k / 80, 311 * Math.sin(2 * Math.PI * k / 80)]), color: 'h', rotulo: '+', desde: 1 },
          { puntos: Array.from({ length: 41 }, (_, k) => [0.5 + k / 80, 311 * Math.sin(2 * Math.PI * (0.5 + k / 80))]), color: 'h', rotulo: '−', desde: 1 }],
        curvas: [{ puntos: Array.from({ length: 81 }, (_, k) => [k / 80, 311 * Math.sin(2 * Math.PI * k / 80)]), color: 'h' },
          { puntos: [[0, 220], [1, 220]], color: 'h', discontinua: true, rotulo: 'ε ef = 220 V', en: [0.55, 290], desde: 3 }],
      }),
      pasos: [
        { estado: { corte: 0 }, texto: 'En un ciclo la fem va de +311 V a −311 V.', ecuacion: [eps, ' = 311 sen(2π f t)'] },
        { estado: { corte: 1 }, texto: 'El área de arriba anula la de abajo: el promedio es 0.', ecuacion: ['promedio de ', eps, ' = 0'] },
        { estado: { corte: 2 }, texto: 'La potencia usa ε², siempre positiva: su promedio es la mitad del pico².', ecuacion: ['promedio de ', { sup: [eps, '2'] }, ' = ', { frac: [{ sup: ['311', '2'] }, '2'] }] },
        { estado: { corte: 3 }, texto: 'El eficaz es la raíz de ese promedio.', ecuacion: [{ sub: [eps, 'ef'] }, ' = ', { frac: ['311', { raiz: '2' }] }, ' ≈ 220 V'] },
      ],
    },
    regla: {
      texto: 'En un generador, una espira que gira con rapidez constante da una fem senoidal. Su valor eficaz es el pico entre √2.',
      ecuacion: [{ sub: [eps, 'ef'] }, ' = ', { llave: [{ frac: [{ sub: [eps, 'máx'] }, { raiz: '2' }] }], nota: 'pico entre √2', color: 'c-h' }, '   ·   ', { sub: ['I', 'ef'] }, ' = ', { frac: [{ sub: ['I', 'máx'] }, { raiz: '2' }] }],
      condicion: 'la señal es senoidal. El eficaz es el valor continuo que daría la misma potencia en una resistencia.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), pide = s % 2 ? 'pico' : 'ef', mag = r.de(['V', 'A']);
        const ef = mag === 'V' ? r.de([110, 120, 220, 230, 380]) : r.de([2, 5, 10, 15]), pico = ef * Math.SQRT2;
        const nom = mag === 'V' ? 'Un voltaje alterno' : 'Una corriente alterna', fmt = n => `${f(n, 1)} ${mag}`;
        const dado = pide === 'ef' ? pico : ef, bien = pide === 'ef' ? ef : pico;
        return {
          pregunta: pide === 'ef' ? `${nom} senoidal tiene un pico de ${f(dado, 1)} ${mag}. ¿Cuál es su valor eficaz?` : `${nom} tiene un valor eficaz de ${f(dado, 0)} ${mag}. ¿Cuál es el valor pico?`,
          dibujo: mag === 'V' && ef <= 280 ? { datos: sen(pico, 2, false), estado: {} } : undefined,
          opciones: opciones(bien, [
            { id: 'invertido', valor: pide === 'ef' ? dado * Math.SQRT2 : dado / Math.SQRT2, error: 'AC-PICO', siFuera: 'Eso aplica √2 al revés: el pico es el valor más alto.' },
            { id: 'mitad', valor: pide === 'ef' ? dado / 2 : dado * 2, error: 'AC-MITAD', siFuera: 'Eso usa 2 en vez de √2.' },
            { id: 'cero', valor: pide === 'ef' ? 0 : dado, error: 'AC-PROMEDIO', siFuera: pide === 'ef' ? 'Ese es el promedio con signo de un ciclo.' : 'Ese es el eficaz; el pico es mayor.' },
          ], fmt),
          solucion: { texto: pide === 'ef' ? 'El pico entre √2.' : 'El eficaz por √2.', ecuacion: pide === 'ef' ? [`${f(dado, 1)} / √2 = ${f(bien, 1)} ${mag}`] : [`${f(dado, 0)} · √2 = ${f(bien, 1)} ${mag}`] },
        };
      },
    },
  };

  // ---------- Idea 6: el transformador ----------
  // Cambia: las vueltas del primario y del secundario, y alterna o continua · Permanece: el núcleo y los 220 V de entrada ·
  // Progresa: Vp y después Vs, con la razón de vueltas · Se reserva: la batería (continua), que da 0 V a la salida ·
  // Debe verse: el voltaje sigue a las vueltas solo si el flujo cambia; la potencia no aumenta.
  const VP = 220;
  const trafoDib = (np, ns, ac = true, conVs = true) => ({ datos: { modo: 'transformador', colores: { v: 'tinta', I: 'tinta' }, bobinas: { np, ns, ac, vp: ac ? `${VP} V alterna` : '12 V continua', vs: conVs ? `${f(ac ? VP * ns / np : 0, 0)} V` : undefined } }, estado: {} });
  const trafo = {
    id: 'transformador',
    titulo: 'Las vueltas fijan el voltaje',
    temas: ['Transformador'],
    pieza: 'fis-espira',
    juega: {
      consigna: 'Entran 220 V alternos por el primario. Elige las vueltas de cada bobina y lee el voltaje de salida.',
      voz: 'Prueba a duplicar las dos bobinas a la vez.',
      controles: [
        { id: 'np', etiqueta: 'Np', min: 100, max: 500, paso: 100, inicio: 200, unidad: '', decimales: 0 },
        { id: 'ns', etiqueta: 'Ns', min: 100, max: 1000, paso: 100, inicio: 400, unidad: '', decimales: 0 },
      ],
      dibujo: val => trafoDib(val.np, val.ns),
      lectura: val => [`Vs = 220 · ${f(val.ns, 0)} / ${f(val.np, 0)} = ${f(VP * val.ns / val.np, 1)}\u00a0V`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Conectas el primario de 100 vueltas a una batería de 12 V. El secundario tiene 400 vueltas. ¿Cuánto marca a la salida, ya conectado?',
      opciones: [
        { id: 'c', texto: '0 V', correcta: true },
        { id: 'sube', texto: '48 V', error: 'TR-CONTINUA', siFuera: '48 V sería cierto con 12 V alternos. Con continua, el flujo no cambia.' },
        { id: 'baja', texto: '3 V', error: 'TR-INVERSA', siFuera: '3 V usa la razón al revés, y además la batería no hace cambiar el flujo.' },
        { id: 'igual', texto: '12 V', error: 'MG7', siFuera: 'Las bobinas no se tocan: solo el flujo variable pasa energía de una a otra.' },
      ],
      dibujo: trafoDib(100, 400, false, false),
      revelar: trafoDib(100, 400, false, true),
      coincide: 'Coincide: con corriente continua el flujo queda fijo y no hay inducción.',
    },
    mira: {
      datos: trafoDib(200, 600).datos,
      pasos: [
        { estado: { paso: 1 }, texto: 'La corriente alterna del primario hace variar el flujo del núcleo.', ecuacion: [{ sub: ['V', 'p'] }, ' = 220 V'] },
        { estado: { paso: 1 }, texto: 'El mismo cambio de flujo cruza cada vuelta de las dos bobinas.', ecuacion: [{ frac: [{ sub: ['V', 'p'] }, { sub: ['N', 'p'] }] }, ' = ', { frac: [{ sub: ['V', 's'] }, { sub: ['N', 's'] }] }] },
        { estado: { paso: 2 }, texto: 'El triple de vueltas da el triple de voltaje.', ecuacion: [{ sub: ['V', 's'] }, ' = 220 · ', { frac: ['600', '200'] }, ' = 660 V'] },
        { estado: { paso: 2 }, texto: 'La potencia no crece: la corriente baja en la misma razón.', ecuacion: [{ sub: ['V', 'p'] }, { sub: ['I', 'p'] }, ' = ', { sub: ['V', 's'] }, { sub: ['I', 's'] }] },
      ],
    },
    regla: {
      texto: 'En un transformador ideal el voltaje de cada bobina es proporcional a sus vueltas, y la potencia que entra es la que sale.',
      ecuacion: [{ frac: [{ sub: ['V', 's'] }, { sub: ['V', 'p'] }] }, ' = ', { llave: [{ frac: [{ sub: ['N', 's'] }, { sub: ['N', 'p'] }] }], nota: 'las vueltas' }, '   ·   ', { sub: ['V', 'p'] }, { sub: ['I', 'p'] }, ' = ', { sub: ['V', 's'] }, { sub: ['I', 's'] }],
      condicion: 'la corriente del primario es alterna (el flujo cambia) y no hay pérdidas en el núcleo ni en los cables.',
    },
    ahoraTu: {
      pieza: 'fis-espira',
      generar(s) {
        const r = azar(s), np = r.de([100, 200, 400, 500, 1000]), k = r.de([0.1, 0.25, 0.5, 2, 4, 5]), ns = np * k;
        const Vp = r.de([110, 220, 440]), Vs = Vp * ns / np, Ip = r.de([1, 2, 5]), Is = Ip * np / ns, pide = s % 2 ? 'I' : 'V';
        if (pide === 'V') return {
          pregunta: `Un transformador ideal tiene ${f(np, 0)} vueltas en el primario y ${f(ns, 0)} en el secundario. Entran ${f(Vp, 0)} V alternos. ¿Qué voltaje sale?`,
          dibujo: { datos: { modo: 'transformador', colores: { v: 'tinta', I: 'tinta' }, bobinas: { np, ns, vp: `${f(Vp, 0)} V` } }, estado: {} },
          opciones: opciones(Vs, [
            { id: 'inv', valor: Vp * np / ns, error: 'TR-INVERSA', siFuera: 'Eso usa la razón al revés: más vueltas en la salida, más voltaje.' },
            { id: 'igual', valor: Vp, error: 'MG7', siFuera: 'Sería cierto con las mismas vueltas en las dos bobinas.' },
            { id: 'cero', valor: 0, error: 'TR-CONTINUA', siFuera: 'Sería cierto con corriente continua. Aquí es alterna.' },
          ], n => `${f(n, 1)} V`),
          solucion: { texto: 'El voltaje sigue a la razón de vueltas.', ecuacion: [{ sub: ['V', 's'] }, ` = ${f(Vp, 0)} · ${f(ns, 0)} / ${f(np, 0)} = ${f(Vs, 1)} V`] },
        };
        return {
          pregunta: `Un transformador ideal tiene ${f(np, 0)} vueltas en el primario y ${f(ns, 0)} en el secundario. Por el primario circulan ${f(Ip, 0)} A eficaces. ¿Qué corriente sale?`,
          dibujo: { datos: { modo: 'transformador', colores: { v: 'tinta', I: 'tinta' }, bobinas: { np, ns } }, estado: {} },
          opciones: opciones(Is, [
            { id: 'como-v', valor: Ip * ns / np, error: 'TR-CORRIENTE', siFuera: 'Esa razón es la del voltaje; la corriente va al revés para conservar la potencia.' },
            { id: 'igual', valor: Ip, error: 'MG7', siFuera: 'Sería cierto con las mismas vueltas en las dos bobinas.' },
            { id: 'suma', valor: Ip * (np + ns) / np, error: 'TR-INVERSA', siFuera: 'Eso suma vueltas; se usa su razón.' },
          ], n => `${f(n, 2)} A`),
          solucion: { texto: 'La potencia se conserva: la corriente va al revés de las vueltas.', ecuacion: [{ sub: ['I', 's'] }, ` = ${f(Ip, 0)} · ${f(np, 0)} / ${f(ns, 0)} = ${f(Is, 2)} A`] },
        };
      },
    },
  };

  // Mesa «rieles con todo suelto»: con B que entra y v hacia la derecha, la corriente sube por la barra; cambiar el
  // sentido de v o de B la invierte (la fuerza sobre las cargas es q v × B).
  const sentidoI = val => (val.v === 0 ? null : (val.v > 0) === (val.s === 'entra') ? 'arriba' : 'abajo');
  const femLibre = val => val.B * val.l * val.v;
  const barraLibre = val => {
    const e = femLibre(val), P = e * e / RES;
    return { datos: { modo: 'barra', colores: COL, barra: { largo: 10, x: 4, l: val.l, sentido: val.s, v: val.v, escalaV: EV, corriente: sentidoI(val), brillo: Math.min(1, P / 6.25) }, rotulo: `ε = ${f(Math.abs(e), 2)} V` }, estado: {} };
  };

  // La espira y su sombra (laboratorio 3D, 15 nov: exploración libre, sin predicciones). Φ = B·A·cos θ lo calcula el motor
  // de plantillas/induccion (flujo) a través de nucleo/fisica3d.js. La sombra verde de la espira en el piso, que el campo
  // vertical atraviesa, mide A·|cos θ|: el flujo es B por esa sombra, con signo.
  const esp3 = val => F3.espira(val);
  const igual = (a, b) => Math.abs(a - b) < 1e-9;
  const mesaSombra = {
    id: 'espira-sombra-3d', titulo: 'La espira y su sombra', pieza: 'fis-espacio-3d',
    consigna: 'Gira la escena con el dedo. Inclina la espira y mira su sombra verde en el piso: eso es lo que cruza el campo.',
    controles: [
      { id: 'th', etiqueta: 'Inclinación θ', min: 0, max: 180, paso: 15, inicio: 30, unidad: '°', decimales: 0 },
      { id: 'B', etiqueta: 'B', color: 'c-i', min: 0.2, max: 1, paso: 0.2, inicio: 0.6, unidad: 'T', decimales: 1 },
      { id: 'A', etiqueta: 'Área A', min: 0.04, max: 0.16, paso: 0.04, inicio: 0.08, unidad: 'm²', decimales: 2 },
    ],
    dibujo: val => ({ datos: esp3(val).datos, estado: {} }),
    lectura: val => [Phi, ' = ', B, `·A·cos ${f(val.th, 0)}° = ${f(esp3(val).Phi, 3)} Wb`],
    invitaciones: [
      { texto: 'Gira la espira hasta que el campo no la cruce.',
        logrado: val => igual(esp3(val).Phi, 0),
        bien: 'De canto, su sombra es una raya: Φ = 0 aunque B siga igual.',
        pista: 'Mira la sombra verde del piso y haz que desaparezca.' },
      { texto: 'Consigue el flujo más grande que permite la mesa.',
        logrado: (val, g, mesa) => igual(esp3(val).Phi, mesa.controles[1].max * mesa.controles[2].max),
        bien: 'Espira grande, campo fuerte y de frente: cos 0° = 1.' },
      { texto: 'Haz que el flujo salga negativo.',
        logrado: val => esp3(val).Phi < -1e-9,
        bien: 'Pasó de 90°: el campo entra por la otra cara de la espira.',
        pista: 'Inclina la espira más allá de 90° y mira la flecha n.' },
      { texto: 'Deja el flujo en la mitad del que daría la espira de frente.',
        logrado: val => igual(esp3(val).cos, 0.5),
        bien: 'A 60°, la sombra mide la mitad del área: cos 60° = 1/2.',
        pista: 'La sombra tiene que medir la mitad de la espira.' },
      { texto: 'Guarda dos casos con el mismo flujo y distinta inclinación.',
        logrado: (val, guardados) => guardados.some(a => guardados.some(b => a.th !== b.th && Math.abs(esp3(a).Phi) > 1e-9 && igual(esp3(a).Phi, esp3(b).Phi))),
        bien: 'Poca área de frente o mucha inclinada: el flujo solo cuenta la sombra.' },
    ],
  };

  return {
    unidad: 'fisica.induccion-electromagnetica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/flechas.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/fis-espira.js',
      '/plantillas/induccion/motor.js', '/nucleo/fisica3d.js', '/nucleo/kit/piezas/fis-espacio-3d.js'],
    // Glosario del tema (docs/teoria.md, 4d). Campo magnético, tesla, espira y solenoide vienen de magnetismo; voltaje y
    // fuerza electromotriz, de circuitos.
    glosario: [
      { termino: 'flujo magnético', simbolo: 'Φ', medida: 'Wb', def: 'Cuánto campo magnético atraviesa una superficie: el campo por el área que queda de frente.',
        formas: ['flujo magnético', 'flujos magnéticos'], ejemplo: 'B = 0,8 T, A = 0,5 m², θ = 60°: Φ = 0,2 Wb.', ver: ['weber', 'campo magnético'] },
      { termino: 'weber', simbolo: 'Wb', def: 'Unidad del flujo magnético en el SI: un tesla que atraviesa de frente un metro cuadrado.',
        ejemplo: '1 Wb = 1 T · 1 m².', ver: ['flujo magnético', 'tesla'] },
      { termino: 'inducción electromagnética', def: 'Aparición de un voltaje en un circuito cuando cambia el campo magnético que lo atraviesa.',
        ver: ['ley de Faraday', 'fem inducida'] },
      { termino: 'ley de Faraday', def: 'La fem inducida es igual a las vueltas por la rapidez con que cambia el flujo.',
        ejemplo: '50 vueltas; Φ sube 0,6 Wb en 0,2 s: ε = 150 V.', ver: ['fem inducida', 'ley de Lenz'] },
      { termino: 'ley de Lenz', def: 'La corriente inducida circula de modo que su campo se opone al cambio de flujo que la produce.',
        ejemplo: 'Acercas un polo N: la espira le muestra otro N y lo repele.', ver: ['corriente inducida', 'ley de Faraday'] },
      { termino: 'fem inducida', simbolo: 'ε', medida: 'V', def: 'Voltaje que aparece en una espira o bobina solo mientras cambia el flujo que la atraviesa.',
        ejemplo: 'Barra de 0,5 m a 2 m/s en 0,6 T: ε = 0,6 V.', ver: ['ley de Faraday'] },
      { termino: 'corriente inducida', def: 'Corriente que circula por un circuito cerrado gracias a una fem inducida.',
        formas: ['corriente inducida', 'corrientes inducidas'], ejemplo: 'ε = 0,6 V con un foco de 2 Ω: I = 0,3 A.', ver: ['ley de Lenz'] },
      { termino: 'bobina', def: 'Alambre enrollado en muchas vueltas. Si el flujo cambia, se suman las fem de todas las vueltas.',
        ver: ['solenoide', 'ley de Faraday'] },
      { termino: 'corriente alterna', def: 'Corriente que cambia de sentido una y otra vez, como la de los enchufes de casa.',
        formas: ['corriente alterna', 'corrientes alternas'], ejemplo: 'En el Perú, 60 Hz: cambia de sentido 120 veces por segundo.', ver: ['valor eficaz', 'generador'] },
      { termino: 'valor eficaz', def: 'Valor continuo que daría la misma potencia media que la señal alterna; en una senoide, el pico entre √2.',
        formas: ['valor eficaz', 'valores eficaces', 'eficaz'], ejemplo: 'Pico de 311 V: eficaz 311/√2 ≈ 220 V.', ver: ['corriente alterna'] },
      { termino: 'generador', def: 'Máquina que hace girar una espira o bobina en un campo magnético para producir corriente alterna.',
        formas: ['generador', 'generadores'], ver: ['corriente alterna', 'inducción electromagnética'] },
      { termino: 'transformador', def: 'Dos bobinas sobre un mismo núcleo de hierro que suben o bajan el voltaje de una corriente alterna.',
        formas: ['transformador', 'transformadores'], ejemplo: 'Bobinas de 200 y 600 vueltas con 220 V de entrada: salen 660 V.', ver: ['bobina'] },
    ],
    // Laboratorio: la barra con todo suelto (también hacia atrás y con el campo al revés: el caso que la idea 4 no deja
    // probar, donde la corriente cambia de sentido), la espira que gira en B y la gráfica Φ–t de Faraday.
    laboratorio: [
      mesaSombra,
      {
        id: 'barra-libre', titulo: 'Rieles con todo suelto', pieza: 'fis-espira',
        consigna: 'Estira la flecha de v hacia adelante o hacia atrás. Cambia B, su sentido y el largo de la barra. Mira hacia dónde va I.',
        controles: [
          { id: 'v', etiqueta: 'v', color: 'c-o', min: -5, max: 5, paso: 1, inicio: 3, unidad: 'm/s', decimales: 0 },
          { id: 'B', etiqueta: 'B', color: 'c-i', min: 0.2, max: 1, paso: 0.2, inicio: 0.6, unidad: 'T', decimales: 1 },
          { id: 'l', etiqueta: 'ℓ', min: 0.2, max: 1, paso: 0.2, inicio: 0.6, unidad: 'm', decimales: 1 },
          { id: 's', etiqueta: 'B', opciones: [{ valor: 'entra', texto: 'entra (⊗)' }, { valor: 'sale', texto: 'sale (⊙)' }] },
        ],
        dibujo: val => barraLibre(val),
        lectura: val => {
          const e = femLibre(val), sube = sentidoI(val);
          return [eps, ` = ${f(Math.abs(e), 2)}\u00a0V · I = ${f(Math.abs(e) / RES, 2)}\u00a0A`, sube ? (sube === 'arriba' ? ' que sube' : ' que baja') : ''];
        },
        arrastres: [{ id: 'rapidez', etiqueta: 'punta de la flecha de v', color: 'c-o',
          donde: val => ESP().geometria(barraLibre(val).datos).puntaV(val.v === 0 ? 1e-9 : val.v),
          mover: (pt, val) => ({ v: ESP().geometria(barraLibre(val).datos).vDe(pt) }) }],
        invitaciones: [
          { texto: 'Apaga el foco sin quitar el campo ni acortar la barra.',
            logrado: val => femLibre(val) === 0 && sentidoI(val) === null,
            bien: 'Barra quieta, flujo quieto: sin cambio no hay fem inducida.' },
          { texto: 'Consigue una fem de 4 V o más.',
            logrado: val => Math.abs(femLibre(val)) >= 4 - 1e-9,
            bien: 'Más campo, más largo y más rapidez: más área barrida por segundo.' },
          { texto: 'Logra exactamente 1 A por el foco de 2 Ω.',
            logrado: val => Math.abs(Math.abs(femLibre(val)) / RES - 1) < 1e-9,
            bien: 'Hay varias maneras de lograr 2 V. ¿Cuántas encuentras?' },
          { texto: 'Guarda dos casos con la misma rapidez y la corriente en sentidos opuestos.',
            logrado: (val, guardados) => sentidoI(val) !== null
              && guardados.some(g => Math.abs(g.v) === Math.abs(val.v) && sentidoI(g) !== null && sentidoI(g) !== sentidoI(val))
              && guardados.some(g => g.v === val.v && g.B === val.B && g.l === val.l && g.s === val.s),
            bien: 'Ir hacia atrás o voltear B invierte la corriente. ¿Y si haces las dos cosas?' },
        ],
      },
      Object.assign({ id: 'espira-gira', titulo: 'La espira que gira', pieza: 'flechas', invitaciones: [
        { texto: 'Gira la espira hasta que ninguna línea de B la atraviese.',
          logrado: val => flujoDe(val) < 1e-9,
          bien: 'Con B en su plano, la sombra desaparece: flujo cero aunque B sea grande.' },
        { texto: 'Consigue un flujo de 0,5 weber.',
          logrado: val => Math.abs(flujoDe(val) - 0.5) < 1e-9,
          bien: 'De frente y con el campo más fuerte: toda el área cuenta.' },
        { texto: 'Logra 0,15 Wb con la espira inclinada.',
          logrado: val => val.th > 0 && Math.abs(flujoDe(val) - 0.15) < 1e-9,
          bien: 'Inclinada a 60°, la sombra es la mitad del área.' },
        { texto: 'Guarda dos casos con el mismo flujo y distinto campo.',
          logrado: (val, guardados) => flujoDe(val) > 1e-9
            && guardados.some(g => g.B !== val.B && Math.abs(flujoDe(g) - flujoDe(val)) < 1e-9)
            && guardados.some(g => g.B === val.B && g.th === val.th),
          bien: 'Más campo pero más inclinada: lo que cuenta es B por la sombra.' },
      ] }, flujo.juega),
      Object.assign({ id: 'flujo-tiempo', titulo: 'Subidas de flujo', pieza: 'ejes', invitaciones: [
        { texto: 'Haz que la fem de subida llegue a 250 V.',
          logrado: val => Math.abs(femSube(val.F1, val.ts) - 250) < 1e-6,
          bien: 'Mucho flujo en poco tiempo: el cambio más brusco da la fem más grande.' },
        { texto: 'Haz que la subida dé el doble de fem que la bajada.',
          logrado: val => Math.abs(femSube(val.F1, val.ts) - 2 * femBaja(val.F1)) < 1e-6,
          bien: 'El mismo cambio de flujo en la mitad del tiempo: doble fem.' },
        { texto: 'Haz que la fem de subida sea 100 V.',
          logrado: val => Math.abs(femSube(val.F1, val.ts) - 100) < 1e-6,
          bien: '¿Es la única forma? Prueba con el doble de flujo.' },
        { texto: 'Guarda dos casos con distinto flujo final y la misma fem de subida.',
          logrado: (val, guardados) => guardados.some(g => g.F1 !== val.F1 && Math.abs(femSube(g.F1, g.ts) - femSube(val.F1, val.ts)) < 1e-6)
            && guardados.some(g => g.F1 === val.F1 && g.ts === val.ts),
          bien: 'Doble flujo en doble tiempo: la ley de Faraday mira el ritmo del cambio.' },
      ] }, faraday.juega),
    ],
    historia: {
      texto: 'Ya se sabía que una corriente mueve una brújula. En 1831, Faraday probó lo inverso con dos bobinas en un anillo de hierro: la aguja se movía solo al conectar o desconectar, nunca mientras la corriente seguía igual. Había hallado la inducción electromagnética: lo que induce no es el magnetismo, sino su cambio.',
      pregunta: '¿Por qué la aguja quedaba quieta con la corriente encendida?',
      fuente: { titulo: 'Royal Institution — Faraday’s ring-coil apparatus', url: 'https://www.rigb.org/explore-science/explore/collection/michael-faradays-ring-coil-apparatus' },
    },
    ideas: [flujo, faraday, lenzIdea, barraIdea, generador, trafo],
  };
});
