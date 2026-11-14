/*
 * Teoría de «Estática: equilibrio y torque» (fisica.estatica). Molde: docs/teoria.md y fisica.movimiento-rectilineo.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 4) y las precisiones de física del expediente
 * (el brazo es la distancia perpendicular a la línea de acción; fs se ajusta hasta μs N).
 * Colores (regla 4): peso P verde (c-d); normal N, tensión T y brazo d turquesa (c-i: lo que sostiene o mide desde
 * el apoyo); fuerza aplicada F y fuerza del resorte naranja (c-o); rozamiento f rojo (c-h). x (deformación) va en
 * turquesa como toda longitud. k, μ y τ van en tinta.
 * g = 10 m/s², declarado en cada condición donde se usa.
 * Códigos de error: D11 (dinamica-ideas-erroneas), E1, E4, E8 y E10 (estatica-energia-ideas-erroneas). Nuevos
 * (hipótesis, sin dato): ES-REACCION, N-MG, N-SIGNO, N-F, ST-SENCOS, ST-P, ST-BAJA, RZ-CERO, RZ-MUK, RZ-F,
 * RS-SUMA, RS-CUAD, RS-IGUAL, RS-INV, RS-DOBLE, TQ-BRAZO, TQ-COS, TQ-DIV, TQ-INV, TQ-RESTA, MS-CUERDA, MS-MITAD,
 * MS-SUMA.
 * Estado: completa (14 nov 2026): seis ideas que cubren los ocho temas del catálogo.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: seis relaciones del equilibrio, cada una jugada antes de preguntarla.
 *   Persona y condiciones: postulante de 4.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: arma el DCL, halla N, T, f, x, un brazo de equilibrio y la fuerza de una polea.
 *   Orden de atención: 1.º el cuerpo y sus flechas · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué la normal no siempre es el peso y el rozamiento no siempre es μN?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const P = { v: 'c-d', t: 'P' }, N = { v: 'c-i', t: 'N' }, T = { v: 'c-i', t: 'T' }, F = { v: 'c-o', t: 'F' };
  const fr = { v: 'c-h', t: 'f' }, x = { v: 'c-i', t: 'x' }, d = { v: 'c-i', t: 'd' };
  const fs = { sub: [fr, 's'] }, fk = { sub: [fr, 'k'] }, Fe = { sub: [F, 'e'] };
  const G = 10;
  const rad = g => g * Math.PI / 180;
  function azar(sm) {
    let q = (sm * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = arr => arr[Math.floor(r() * arr.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const o of distractores) {
      if (!Number.isFinite(o.valor) || o.valor < 0) continue;
      const txt = fmt(o.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: o.id, texto: txt, error: o.error, siFuera: o.siFuera });
    }
    return ops.slice(0, 4);
  }
  const caja = (cx, y0, w, h) => ({ puntos: [[cx - w / 2, y0], [cx + w / 2, y0], [cx + w / 2, y0 + h], [cx - w / 2, y0 + h]], cerrado: true });
  const SEN = { 30: 0.5, 37: 0.6, 53: 0.8, 60: Math.sqrt(3) / 2 }, COS = { 30: Math.sqrt(3) / 2, 37: 0.8, 53: 0.6, 60: 0.5 };

  // ---------- Idea 1: el diagrama de cuerpo libre y las parejas ----------
  // Cambia: la masa del libro y el empujón de la mano · Permanece: el libro quieto (ΣF = 0) · Progresa: el DCL, una
  // fuerza por paso · Se reserva: la pareja de cada fuerza, que vive en otro cuerpo · Debe verse: N = P + F, no N = P.
  const K1 = 2; // px por N
  function libro(m, Fm, o = {}) {
    const Pv = m * G, Nv = Pv + Fm;
    return {
      vista: { x0: -2, x1: 2, y0: -1.8, y1: 2.6 }, escalaF: K1,
      alt: o.alt || `Libro de ${f(m, 0)} kg sobre una mesa, empujado hacia abajo con ${f(Fm, 0)} N: peso ${f(Pv, 0)} N, normal ${f(Nv, 0)} N.`,
      poligonos: [{ puntos: [[-1.9, 0], [1.9, 0]], rayado: true }, { ...caja(0, 0, 1.4, 0.45), paso: o.pCaja || 0 }],
      flechas: [
        { de: [-0.25, 0.22], d: [0, -Pv], color: 'd', rotulo: `P = ${f(Pv, 0)} N`, lado: -1, paso: o.pP || 0 },
        ...(Fm > 0 ? [{ de: [0.45, 0.45 + Fm * K1 / 59.1], d: [0, -Fm], color: 'o', rotulo: `F = ${f(Fm, 0)} N`, paso: o.pF || 0 }] : []),
        { de: [-0.25, 0.22], d: [0, Nv], color: 'i', rotulo: `N = ${f(Nv, 0)} N`, lado: -1, paso: o.pN || 0, hasta: o.sinN ? -1 : undefined },
        ...(o.pareja ? [{ de: [1.1, 0], d: [0, -Nv], color: 'i', discontinua: true, rotulo: 'sobre la mesa', lado: -1, paso: o.pareja }] : []),
      ],
    };
  }
  const dcl = {
    id: 'diagrama-y-parejas',
    titulo: 'Cada fuerza tiene su pareja',
    temas: ['Primera y tercera ley de Newton', 'Diagrama de cuerpo libre'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Un libro descansa en la mesa. Elige su masa y cuánto lo aprieta la mano hacia abajo. Mira la normal.',
      voz: 'Aprieta sin cambiar la masa. ¿Qué flecha crece?',
      controles: [
        { id: 'm', etiqueta: 'm', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
        { id: 'F', etiqueta: 'F', color: 'c-o', min: 0, max: 20, paso: 5, inicio: 0, unidad: 'N', decimales: 0 },
      ],
      dibujo: val => ({ datos: libro(val.m, val.F), estado: {} }),
      lectura: val => [N, ` = ${f(val.m * G + val.F, 0)} N · `, P, ` = ${f(val.m * G, 0)} N`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un libro de 2 kg está quieto sobre la mesa. Según la tercera ley, ¿cuál es la pareja de su peso?',
      opciones: [
        { id: 'c', texto: 'El libro atrae a la Tierra con 20 N', correcta: true },
        { id: 'normal', texto: 'La mesa empuja al libro con 20 N', error: 'ES-REACCION', siFuera: 'La normal sí equilibra al peso. Pero las dos actúan sobre el libro: una pareja actúa en cuerpos distintos.' },
        { id: 'ninguna', texto: 'No tiene: el peso no es un empujón', error: 'D11', siFuera: 'El peso no es un contacto, cierto. Igual es una interacción con la Tierra, y tiene pareja.' },
        { id: 'mesa', texto: 'El libro empuja la mesa con 20 N', error: 'ES-REACCION', siFuera: 'Esa es la pareja de la normal: mesa y libro. El peso es una interacción libro–Tierra.' },
      ],
      dibujo: { datos: libro(2, 0, { sinN: true, alt: 'Libro de 2 kg sobre una mesa, con su peso de 20 N hacia abajo.' }), estado: {} },
      revelar: { datos: Object.assign(libro(2, 0), { textos: [{ en: [1.1, -1.4], texto: 'Tierra: 20 N ↑', color: 'd' }] }), estado: {} },
      coincide: 'Coincide: peso y pareja están en el libro y en la Tierra; la normal tiene su propia pareja.',
    },
    mira: {
      datos: libro(2, 10, { pP: 1, pF: 2, pN: 3, pareja: 4 }),
      pasos: [
        { estado: { paso: 0 }, texto: 'Se aísla el libro: solo cuentan las fuerzas sobre él.', ecuacion: ['m = 2 kg'] },
        { estado: { paso: 1 }, texto: 'La Tierra lo atrae: su peso.', ecuacion: [P, ' = m g = 20 N'] },
        { estado: { paso: 2 }, texto: 'La mano lo empuja hacia abajo.', ecuacion: [F, ' = 10 N'] },
        { estado: { paso: 3 }, texto: 'Está quieto: la mesa empuja lo que haga falta para cancelar.', ecuacion: [N, ' = ', P, ' + ', F, ' = 30 N'] },
        { estado: { paso: 4 }, texto: 'La pareja de N es el libro empujando la mesa: otro cuerpo.', ecuacion: ['Σ', F, ' = 0 sobre el libro'] },
      ],
    },
    regla: {
      texto: 'Si un cuerpo está en reposo o en MRU, sus fuerzas suman cero. Cada fuerza tiene una pareja igual y opuesta, en el otro cuerpo.',
      ecuacion: ['Σ', F, ' = 0   ·   ', { sub: [F, 'A sobre B'] }, ' = −', { sub: [F, 'B sobre A'] }],
      condicion: 'el DCL lleva solo las fuerzas sobre el cuerpo aislado; las parejas nunca se cancelan entre sí.',
    },
    ahoraTu: {
      pieza: 'fis-lienzo',
      generar(sm) {
        const r = azar(sm), m = r.ent(1, 4), Fm = r.de([5, 10, 15]), abajo = sm % 2 === 0;
        const Pv = m * G, Nv = abajo ? Pv + Fm : Pv - Fm;
        return {
          pregunta: `Un bloque de ${m} kg está quieto sobre el piso. Una mano lo ${abajo ? 'empuja hacia abajo' : 'jala hacia arriba'} con ${Fm} N. Con g = 10 m/s², ¿cuánto vale la normal?`,
          dibujo: abajo ? { datos: libro(m, Fm, { sinN: true }), estado: {} } : undefined,
          opciones: opciones(Nv, [
            { id: 'mg', valor: Pv, error: 'N-MG', siFuera: 'N = mg es cierto si nadie más empuja. Aquí la mano cambia lo que hace la mesa.' },
            { id: 'signo', valor: abajo ? Pv - Fm : Pv + Fm, error: 'N-SIGNO', siFuera: abajo ? 'Restar sería cierto si la mano jalara hacia arriba.' : 'Sumar sería cierto si la mano empujara hacia abajo.' },
            { id: 'F', valor: Fm, error: 'N-F', siFuera: 'Esa es la fuerza de la mano; la normal equilibra todo lo demás.' },
          ], n => `${f(n, 0)} N`),
          solucion: { texto: abajo ? 'El piso cancela el peso y el empujón.' : 'El piso cancela lo que la mano no sostiene.', ecuacion: [N, ` = ${Pv} ${abajo ? '+' : '−'} ${Fm} = ${f(Nv, 0)} N`] },
        };
      },
    },
  };

  // ---------- Idea 2: el nudo en equilibrio ----------
  // Cambia: el peso de la lámpara y el ángulo de las cuerdas · Permanece: el nudo quieto · Progresa: las partes
  // verticales de T, que sostienen a P · Se reserva: las horizontales, que se cancelan · Debe verse: T crece al
  // aplanar las cuerdas y no es P/2.
  const K2 = 1.25;
  function lampara(Pv, ang, o = {}) {
    const Tv = Pv / (2 * SEN[ang]), A = 2.2, yn = 2 - A * Math.tan(rad(ang)), nudo = [0, yn];
    const u1 = [-COS[ang], SEN[ang]], u2 = [COS[ang], SEN[ang]];
    return {
      vista: { x0: -2.5, x1: 2.5, y0: -3.6, y1: 2.3 }, escalaF: K2,
      alt: o.alt || `Lámpara de ${f(Pv, 0)} N colgada de dos cuerdas a ${ang}° de la horizontal; cada cuerda tira con ${f(Tv, 1)} N.`,
      poligonos: [{ puntos: [[-2.45, 2], [2.45, 2]], rayado: true }, { puntos: [[-A, 2], nudo, [A, 2]] }, { puntos: [nudo, [0, yn - 0.45]] }, caja(0, yn - 0.85, 0.5, 0.4)],
      discos: [{ c: nudo, r: 0.06 }],
      flechas: [
        { de: [0, yn - 0.85], d: [0, -Pv], color: 'd', rotulo: `P = ${f(Pv, 0)} N`, paso: o.pP || 0 },
        { de: nudo, d: [u1[0] * Tv, u1[1] * Tv], color: 'i', rotulo: o.sinT ? undefined : 'T', paso: o.pT || 0, hasta: o.sinT ? -1 : undefined },
        { de: nudo, d: [u2[0] * Tv, u2[1] * Tv], color: 'i', rotulo: o.sinT ? undefined : 'T', paso: o.pT || 0, hasta: o.sinT ? -1 : undefined },
        ...(o.pComp ? [
          { de: [-0.12, yn], d: [0, Tv * SEN[ang]], color: 'i', discontinua: true, rotulo: `${f(Tv * SEN[ang], 0)} N`, lado: -1, paso: o.pComp },
          { de: [0.12, yn], d: [0, Tv * SEN[ang]], color: 'i', discontinua: true, paso: o.pComp },
          { de: nudo, d: [-Tv * COS[ang], 0], color: 'i', discontinua: true, rotulo: `${f(Tv * COS[ang], 0)} N`, paso: o.pH },
          { de: nudo, d: [Tv * COS[ang], 0], color: 'i', discontinua: true, rotulo: `${f(Tv * COS[ang], 0)} N`, paso: o.pH },
        ] : []),
      ],
      arcos: [{ c: [A, 2], rpx: 30, de: 180, a: 180 + ang, rotulo: `${ang}°` }],
      textos: o.sinT ? [] : [{ en: [1.3, -3.2], texto: `T = ${f(Tv, 1)} N`, color: 'i', paso: o.pT || 0 }],
    };
  }
  const nudo = {
    id: 'nudo-en-equilibrio',
    titulo: 'El nudo que no se mueve',
    temas: ['Equilibrio de una partícula', 'Diagrama de cuerpo libre'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Una lámpara cuelga de dos cuerdas iguales. Elige su peso y el ángulo de las cuerdas con el techo.',
      voz: 'Aplana las cuerdas sin cambiar el peso. Mira las flechas T.',
      controles: [
        { id: 'P', etiqueta: 'P', color: 'c-d', min: 20, max: 50, paso: 10, inicio: 30, unidad: 'N', decimales: 0 },
        { id: 'ang', etiqueta: 'Ángulo', opciones: [30, 37, 53, 60].map(k => ({ valor: k, texto: `${k}°` })), inicio: 53 },
      ],
      dibujo: val => ({ datos: lampara(val.P, val.ang), estado: {} }),
      lectura: val => ['Cada cuerda: ', T, ` = ${f(val.P / (2 * SEN[val.ang]), 1)} N`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una lámpara de 40 N cuelga de dos cuerdas iguales a 60° del techo. Si las cuerdas se ponen a 30°, ¿qué pasa con la tensión de cada una?',
      opciones: [
        { id: 'c', texto: 'Aumenta', correcta: true },
        { id: 'mitad', texto: 'Sigue en 20 N: la mitad del peso', error: 'E8', siFuera: 'La mitad sería cierto con cuerdas verticales. Inclinadas, solo una parte de T sostiene.' },
        { id: 'baja', texto: 'Disminuye', error: 'ST-BAJA', siFuera: 'Más inclinada parece más relajada. Pero su parte vertical se achica y T debe crecer.' },
      ],
      dibujo: { datos: lampara(40, 60, { sinT: true, alt: 'Lámpara de 40 N colgada de dos cuerdas a 60° del techo; las tensiones no están dibujadas.' }), estado: {} },
      revelar: { datos: lampara(40, 30), estado: {} },
      coincide: 'Coincide: a 30° cada cuerda tira con 40 N, el doble que con cuerdas verticales.',
    },
    mira: {
      datos: lampara(48, 37, { pP: 1, pT: 2, pComp: 3, pH: 4 }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Sobre el nudo actúa el peso de la lámpara.', ecuacion: [P, ' = 48 N'] },
        { estado: { paso: 2 }, texto: 'Las dos cuerdas tiran a lo largo de sí mismas.', ecuacion: [T, ' = ?'] },
        { estado: { paso: 3 }, texto: 'Hacia arriba solo sostiene la parte vertical de cada T.', ecuacion: ['2 ', T, ' sen 37° = 48   →   ', T, ' = 40 N'] },
        { estado: { paso: 4 }, texto: 'Las partes horizontales son iguales y opuestas: se cancelan.', ecuacion: ['40 cos 37° = 32 N a cada lado'] },
      ],
    },
    regla: {
      texto: 'Un punto está en equilibrio si las fuerzas se cancelan en cada eje. Con cuerdas inclinadas, solo su parte vertical sostiene el peso.',
      ecuacion: ['Σ', { sub: [F, 'x'] }, ' = 0   ·   Σ', { sub: [F, 'y'] }, ' = 0   ·   2 ', T, ' sen θ = ', P],
      condicion: 'cuerdas iguales y simétricas; θ medido desde la horizontal. Por eso, cuerda casi horizontal, tensión enorme.',
    },
    ahoraTu: {
      pieza: 'fis-lienzo',
      generar(sm) {
        const r = azar(sm), Pv = r.de([20, 30, 40, 48, 60, 80, 96]), ang = r.de([30, 37, 53, 60]), Tv = Pv / (2 * SEN[ang]);
        return {
          pregunta: ['Una lámpara de ', P, ` = ${Pv} N cuelga de dos cuerdas iguales, cada una a ${ang}° de la horizontal. ¿Con qué fuerza tira cada cuerda?`],
          dibujo: { datos: lampara(Math.min(Pv, 50), ang, { sinT: true, alt: `Lámpara de ${Pv} N colgada de dos cuerdas a ${ang}° del techo.` }), estado: {} },
          opciones: opciones(Tv, [
            { id: 'mitad', valor: Pv / 2, error: 'E8', siFuera: 'La mitad del peso sería cierta con cuerdas verticales.' },
            { id: 'coseno', valor: Pv / (2 * COS[ang]), error: 'ST-SENCOS', siFuera: 'Eso usa el coseno: sostiene la parte vertical, que va con el seno desde la horizontal.' },
            { id: 'todo', valor: Pv, error: 'ST-P', siFuera: 'Cada cuerda no sostiene todo el peso: son dos.' },
          ], n => `${f(n, 2)} N`),
          solucion: { texto: 'Las partes verticales de las dos cuerdas suman el peso.', ecuacion: ['2 ', T, ` sen ${ang}° = ${Pv}   →   `, T, ` = ${f(Tv, 2)} N`] },
        };
      },
    },
  };

  // ---------- Idea 3: el rozamiento estático se ajusta ----------
  // Cambia: el empuje F · Permanece: la caja y su piso (N fija) · Progresa: f, que copia a F mientras la caja no se
  // mueve · Se reserva: el instante en que F pasa μs N y f cae a μk N · Debe verse: fs no vale siempre μs N.
  const MS = 0.5, MK = 0.3, K3 = 3;
  function cajaRoce(m, Fv, o = {}) {
    const Nv = m * G, max = MS * Nv, desliza = Fv > max + 1e-9, fv = desliza ? MK * Nv : Fv;
    return {
      vista: { x0: -1.7, x1: 1.7, y0: -0.4, y1: 1.3 }, escalaF: K3,
      alt: o.alt || `Caja de ${m} kg empujada con ${f(Fv, 0)} N; el rozamiento vale ${f(fv, 0)} N y la caja ${desliza ? 'desliza' : 'sigue quieta'}.`,
      poligonos: [{ puntos: [[-1.65, 0], [1.65, 0]], rayado: true }, caja(0, 0, 1.1, 0.8)],
      flechas: [
        ...(Fv > 0 ? [{ de: [-0.55 - Fv * K3 / 82.35, 0.5], d: [Fv, 0], color: 'o', rotulo: `F = ${f(Fv, 0)} N`, rotuloEn: 'cola' }] : []),
        ...(fv > 0 && !o.sinF ? [{ de: [-0.55, 0.12], d: [-fv, 0], color: 'h', rotulo: `f = ${f(fv, 0)} N` }] : []),
      ],
      textos: [{ en: [0, 1.05], texto: desliza ? 'desliza' : 'quieta' }],
    };
  }
  const roce = {
    id: 'rozamiento-se-ajusta',
    titulo: 'El rozamiento se ajusta',
    temas: ['Rozamiento estático y cinético'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Empuja una caja de 4 kg con fuerza creciente. Aquí μs = 0,5 y μk = 0,3. Mira la flecha roja.',
      voz: 'Sube F de a poco. ¿La flecha roja crece siempre?',
      controles: [{ id: 'F', etiqueta: 'F', color: 'c-o', min: 0, max: 30, paso: 2, inicio: 4, unidad: 'N', decimales: 0 }],
      dibujo: val => ({ datos: cajaRoce(4, val.F), estado: {} }),
      lectura: val => { const fv = val.F > 20 ? 12 : val.F; return [fr, ` = ${f(fv, 0)} N · máximo estático 20 N`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Otra caja tiene N = 60 N y μs = 0,5. La empujas con 12 N y no se mueve. ¿Cuánto vale el rozamiento?',
      opciones: [
        { id: 'c', texto: '12 N', correcta: true },
        { id: 'max', texto: '30 N', error: 'E10', siFuera: '30 N es el máximo que puede dar. Mientras no desliza, da solo lo necesario.' },
        { id: 'cero', texto: '0 N: no se mueve', error: 'RZ-CERO', siFuera: 'Sin rozamiento, 12 N la moverían. Algo la frena: el rozamiento estático.' },
      ],
      dibujo: { datos: cajaRoce(6, 12, { sinF: true, alt: 'Caja con normal de 60 N empujada con 12 N; el rozamiento no está dibujado.' }), estado: {} },
      revelar: { datos: cajaRoce(6, 12), estado: {} },
      coincide: 'Coincide: la caja está quieta, así que el rozamiento cancela justo los 12 N.',
    },
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 30, paso: 5, nombre: 'F', unidad: 'N', decimales: 0, color: 'o' },
        y: { min: 0, max: 25, paso: 5, nombre: 'f', unidad: 'N', decimales: 0, color: 'h' },
        curvas: [{ puntos: [[0, 0], [20, 20]], color: 'h', desde: 1 }, { puntos: [[20, 12], [30, 12]], color: 'h', desde: 3 }],
        puntos: [{ x: 8, y: 8, color: 'h', rotulo: '8 N', guias: true, desde: 1 }, { x: 20, y: 20, color: 'h', rotulo: 'μs N = 20 N', desde: 2 }, { x: 25, y: 12, color: 'h', rotulo: 'μk N = 12 N', desde: 3 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Quieta: f copia a F. Con 8 N, el rozamiento es 8 N.', ecuacion: [fs, ' = ', F] },
        { estado: { corte: 2 }, texto: 'Puede crecer solo hasta un tope.', ecuacion: [{ sub: [fs, 'máx'] }, ' = 0,5 · 40 = 20 N'] },
        { estado: { corte: 3 }, texto: 'Si F pasa el tope, desliza y f cae a un valor fijo.', ecuacion: [fk, ' = 0,3 · 40 = 12 N'] },
      ],
    },
    regla: {
      texto: 'Quieta, el rozamiento vale lo justo para cancelar, hasta un tope. Deslizando, vale un valor fijo menor.',
      ecuacion: [fs, ' ≤ ', { sub: ['μ', 's'] }, N, '   ·   ', fk, ' = ', { sub: ['μ', 'k'] }, N],
      condicion: 'superficies secas; f se opone al deslizamiento (o a su tendencia). En general μk < μs.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), m = r.ent(2, 6), mus = r.de([0.4, 0.5, 0.6]), muk = Math.round((mus - 0.2) * 10) / 10;
        const Nv = m * G, max = mus * Nv, desl = sm % 2 === 1;
        const Fv = desl ? Math.round(max + r.ent(2, 10)) : Math.max(2, Math.round(max * r.de([0.3, 0.5, 0.7])));
        const fv = desl ? muk * Nv : Fv;
        return {
          pregunta: `Una caja de ${m} kg en el piso (μs = ${f(mus, 1)}, μk = ${f(muk, 1)}) se empuja con ${f(Fv, 0)} N. Con g = 10 m/s², ¿cuánto vale el rozamiento?`,
          opciones: opciones(fv, [
            { id: 'max', valor: max, error: 'E10', siFuera: desl ? 'Ese es el tope estático; ya se superó y desliza.' : 'Ese es el tope. Quieta, da solo lo necesario.' },
            { id: 'otro', valor: desl ? Fv : muk * Nv, error: desl ? 'RZ-F' : 'RZ-MUK', siFuera: desl ? 'Copiar a F vale solo mientras está quieta.' : 'μk N vale si desliza; aquí F no llega al tope.' },
            { id: 'cero', valor: 0, error: 'RZ-CERO', siFuera: 'Hay contacto y tendencia a deslizar: hay rozamiento.' },
          ], n => `${f(n, 0)} N`),
          solucion: {
            texto: desl ? `${f(Fv, 0)} N supera el tope de ${f(max, 0)} N: desliza.` : `${f(Fv, 0)} N no llega al tope de ${f(max, 0)} N: sigue quieta.`,
            ecuacion: desl ? [fk, ` = ${f(muk, 1)} · ${Nv} = ${f(fv, 0)} N`] : [fs, ' = ', F, ` = ${f(fv, 0)} N`],
          },
        };
      },
    },
  };

  // ---------- Idea 4: el resorte se estira en proporción ----------
  // Cambia: k y la masa colgada · Permanece: la longitud natural (línea discontinua) · Progresa: la deformación x,
  // con su cota · Se reserva: la recta F–x, cuya pendiente es k · Debe verse: doble de fuerza, doble de x.
  const K4 = 1.6; // px por N; la figura va a 400 px por metro: 1 cm de estiramiento son 4 px
  function resorte(k, m, o = {}) {
    const xv = m * G / k, L0 = 0.2, top = 0.5, bajo = top - L0 - xv;
    const n = 10, zig = [[0, top], [0, top - 0.02]];
    for (let i = 1; i <= n; i++) zig.push([(i % 2 ? 0.03 : -0.03), top - 0.02 - (L0 + xv - 0.04) * i / (n + 1)]);
    zig.push([0, bajo + 0.02], [0, bajo]);
    return {
      vista: { x0: -0.35, x1: 0.35, y0: -0.1, y1: 0.55 }, escalaF: K4,
      alt: o.alt || `Resorte de k = ${k} N/m con ${f(m, 1)} kg colgados: se estira ${f(xv * 100, 1)} cm.`,
      poligonos: [{ puntos: [[-0.2, top], [0.2, top]], rayado: true }, { puntos: zig, grosor: 'contorno' }, caja(0, bajo - 0.06, 0.08, 0.06)],
      segmentos: [{ de: [-0.2, top - L0], a: [0.12, top - L0], discontinua: true },
        ...(o.sinX ? [] : [{ de: [0.14, top - L0], a: [0.14, bajo], color: 'i', grosor: 'variable', texto: `x = ${f(xv * 100, 1)} cm`, lado: -1 }])],
      flechas: [{ de: [0.02, bajo - 0.06], d: [0, -m * G], color: 'd', rotulo: `P = ${f(m * G, 0)} N` }, { de: [-0.06, bajo - 0.03], d: [0, k * xv], color: 'o', rotulo: 'kx', lado: -1 }],
    };
  }
  const elastica = {
    id: 'resorte-proporcional',
    titulo: 'El resorte estira en proporción',
    temas: ['Fuerza elástica'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Cuelga una masa del resorte y elige su rigidez k. La línea discontinua marca su largo sin carga.',
      voz: 'Duplica la masa con el mismo k. ¿Qué le pasa a x?',
      controles: [
        { id: 'k', etiqueta: 'k', min: 100, max: 400, paso: 100, inicio: 200, unidad: 'N/m', decimales: 0 },
        { id: 'm', etiqueta: 'm', min: 0.5, max: 2, paso: 0.5, inicio: 1, unidad: 'kg', decimales: 1 },
      ],
      dibujo: val => ({ datos: resorte(val.k, val.m), estado: {} }),
      lectura: val => [x, ` = ${f(val.m * G / val.k * 100, 1)} cm · `, Fe, ` = ${f(val.m * G, 0)} N`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un resorte se estira 4 cm con 2 kg colgados. ¿Cuánto se estira con 3 kg?',
      opciones: [
        { id: 'c', texto: '6 cm', correcta: true },
        { id: 'suma', texto: '5 cm', error: 'RS-SUMA', siFuera: 'Sumar 1 cm por kilo sería cierto si 1 kg estirara 1 cm. Aquí cada kilo estira 2 cm.' },
        { id: 'cuad', texto: '9 cm', error: 'RS-CUAD', siFuera: 'Crece, sí, pero no al cuadrado: la fuerza y el estiramiento van en proporción.' },
        { id: 'igual', texto: '4 cm', error: 'RS-IGUAL', siFuera: 'Igual sería si el resorte fuera rígido. Más peso, más estiramiento.' },
      ],
      dibujo: { datos: resorte(500, 2, { sinX: false }), estado: {} },
      revelar: { datos: resorte(500, 3), estado: {} },
      coincide: 'Coincide: 1,5 veces la masa, 1,5 veces el estiramiento.',
    },
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 8, paso: 1, nombre: 'x', unidad: 'cm', decimales: 0, color: 'i' },
        y: { min: 0, max: 40, paso: 10, nombre: 'F', unidad: 'N', decimales: 0, color: 'o' },
        curvas: [{ puntos: [[0, 0], [8, 40]], color: 'o', desde: 2 }],
        puntos: [{ x: 4, y: 20, color: 'o', rotulo: '2 kg', guias: true, desde: 1 }, { x: 6, y: 30, color: 'o', rotulo: '3 kg', guias: true, desde: 3 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Con 2 kg, el resorte sostiene 20 N estirado 4 cm.', ecuacion: [Fe, ' = 20 N   ·   ', x, ' = 0,04 m'] },
        { estado: { corte: 2 }, texto: 'Fuerza y estiramiento van en proporción: la gráfica es una recta por el origen.', ecuacion: ['k = ', { frac: ['20', '0,04'] }, ' = 500 N/m'] },
        { estado: { corte: 3 }, texto: 'Con 30 N, la misma recta da 6 cm.', ecuacion: [x, ' = ', { frac: ['30', '500'] }, ' = 0,06 m = 6 cm'] },
      ],
    },
    regla: {
      texto: 'Un resorte ideal hace una fuerza proporcional a cuánto se deforma, y en contra de esa deformación.',
      ecuacion: [Fe, ' = k ', x],
      condicion: 'x se mide desde el largo natural (sin carga) y el resorte no pasa su límite elástico.',
    },
    ahoraTu: {
      pieza: 'fis-lienzo',
      generar(sm) {
        const r = azar(sm), k = r.de([100, 200, 250, 400, 500]), m = r.de([0.5, 1, 1.5, 2, 3]), xv = m * G / k * 100;
        return {
          pregunta: ['Se cuelgan ', `${f(m, 1)} kg de un resorte de k = ${k} N/m. Con g = 10 m/s², ¿cuánto se estira?`],
          dibujo: { datos: resorte(k, m, { sinX: true, alt: `Resorte de k = ${k} N/m con ${f(m, 1)} kg colgados; el estiramiento no está rotulado.` }), estado: {} },
          opciones: opciones(xv, [
            { id: 'inv', valor: k / (m * G), error: 'RS-INV', siFuera: 'Eso divide k entre el peso. x es el peso entre k.' },
            { id: 'sin-g', valor: m / k * 100, error: 'RS-SUMA', siFuera: 'Eso usa la masa; el resorte sostiene el peso, mg.' },
            { id: 'doble', valor: 2 * xv, error: 'RS-DOBLE', siFuera: 'Ese sería el estiramiento con el doble de masa.' },
          ], n => `${f(n, 2)} cm`),
          solucion: { texto: 'En equilibrio, kx sostiene el peso.', ecuacion: [x, ` = ${f(m * G, 0)} / ${k} = ${f(xv / 100, 4)} m = ${f(xv, 2)} cm`] },
        };
      },
    },
  };

  // ---------- Idea 5: el torque usa el brazo perpendicular ----------
  // Cambia: la masa y la posición del lado derecho · Permanece: 3 kg a 1 m a la izquierda · Progresa: los dos torques,
  // que la barra compara al inclinarse · Se reserva: el brazo perpendicular de una fuerza inclinada ·
  // Debe verse: equilibrio es igual torque, no igual peso ni igual distancia.
  const K5 = 0.9;
  function palanca(m1, d1, m2, d2, o = {}) {
    const t1 = m1 * G * d1, t2 = m2 * G * d2, inc = Math.max(-8, Math.min(8, (t1 - t2) / 3)), c = Math.cos(rad(inc)), s = Math.sin(rad(inc));
    const en = dd => [dd * c, 1 + dd * s]; // punto de la barra a dd m del apoyo (dd < 0 a la izquierda)
    const A = en(-d1), B = en(d2);
    return {
      vista: { x0: -2.6, x1: 2.6, y0: -0.8, y1: 2.2 }, escalaF: K5,
      alt: o.alt || `Barra apoyada al centro: ${m1} kg a ${f(d1, 1)} m a la izquierda y ${m2} kg a ${f(d2, 1)} m a la derecha; ${Math.abs(t1 - t2) < 1e-9 ? 'queda horizontal' : `baja el lado ${t1 > t2 ? 'izquierdo' : 'derecho'}`}.`,
      poligonos: [{ puntos: [[-2.5, 0], [2.5, 0]], rayado: true }, { puntos: [[-0.25, 0], [0.25, 0], [0, 1]], cerrado: true }, { puntos: [en(-2.3), en(2.3)], grosor: 'variable' },
        { puntos: [A, [A[0], A[1] - 0.4]] }, caja(A[0], A[1] - 0.75, 0.4, 0.35), { puntos: [B, [B[0], B[1] - 0.4]] }, caja(B[0], B[1] - 0.75, 0.4, 0.35)],
      segmentos: [{ de: [0, 1.25], a: [-d1 * c, 1.25 - d1 * s], color: 'i', grosor: 'variable', texto: `${f(d1, 1)} m`, paso: o.pd || 0 },
        { de: [0, 1.25], a: [d2 * c, 1.25 + d2 * s], color: 'i', grosor: 'variable', texto: o.sinD2 ? 'd = ?' : `${f(d2, 2)} m`, paso: o.pd || 0 }],
      flechas: [{ de: [A[0], A[1] - 0.75], d: [0, -m1 * G], color: 'd', rotulo: `${m1 * G} N`, paso: o.pP || 0 }, { de: [B[0], B[1] - 0.75], d: [0, -m2 * G], color: 'd', rotulo: `${m2 * G} N`, paso: o.pP || 0 },
        ...(o.pR ? [{ de: [0, 0.5], d: [0, (m1 + m2) * G], color: 'i', rotulo: `R = ${(m1 + m2) * G} N`, paso: o.pR }] : [])],
    };
  }
  function llave(con) {
    const Fv = 50, L = 0.4, ang = 30, punta = [L, 0], u = [Math.cos(rad(180 - ang)), Math.sin(rad(180 - ang))];
    // Línea de acción de F y su pie perpendicular desde el perno: el brazo vale L sen 30° = 0,2 m.
    const pie = [punta[0] + u[0] * (-(punta[0] * u[0] + punta[1] * u[1])), punta[1] + u[1] * (-(punta[0] * u[0] + punta[1] * u[1]))];
    return {
      vista: { x0: -0.25, x1: 0.55, y0: -0.15, y1: 0.35 }, escalaF: 1.6,
      alt: con ? 'Llave de 0,4 m con una fuerza de 50 N a 30° de la llave; el brazo perpendicular desde el perno mide 0,2 m.' : 'Llave de 0,4 m con una fuerza de 50 N aplicada en la punta, a 30° de la llave.',
      poligonos: [{ puntos: [[0, 0], punta], grosor: 'variable' }],
      discos: [{ c: [0, 0], r: 0.03, rotulo: '' }],
      segmentos: [{ de: [0, -0.06], a: [L, -0.06], texto: '0,4 m', lado: -1 },
        ...(con ? [{ de: [punta[0] - u[0] * 0.5, punta[1] - u[1] * 0.5], a: [punta[0] + u[0] * 0.25, punta[1] + u[1] * 0.25], discontinua: true },
          { de: [0, 0], a: pie, color: 'i', grosor: 'variable', texto: 'd = 0,2 m', lado: -1 }] : [])],
      flechas: [{ de: punta, d: [u[0] * Fv, u[1] * Fv], color: 'o', rotulo: 'F = 50 N' }],
      arcos: [{ c: punta, rpx: 26, de: 180 - ang, a: 180, rotulo: '30°' }],
    };
  }
  const torque = {
    id: 'torque-y-brazo',
    titulo: 'El brazo decide el giro',
    temas: ['Torque', 'Equilibrio del cuerpo rígido'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'A la izquierda cuelgan 3 kg a 1 m del apoyo. Elige la masa de la derecha y dónde colgarla.',
      voz: 'Busca dos maneras distintas de dejar la barra horizontal.',
      controles: [
        { id: 'm2', etiqueta: 'm', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
        { id: 'd2', etiqueta: 'd', color: 'c-i', min: 0.5, max: 2, paso: 0.25, inicio: 1, unidad: 'm', decimales: 2 },
      ],
      dibujo: val => ({ datos: palanca(3, 1, val.m2, val.d2), estado: {} }),
      lectura: val => [`τ izquierda = 30 N·m · τ derecha = ${f(val.m2 * G * val.d2, 1)} N·m`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Con una llave de 0,4 m aprietas un perno: aplicas 50 N en la punta, a 30° de la llave. ¿Qué torque haces?',
      opciones: [
        { id: 'c', texto: '10 N·m', correcta: true },
        { id: 'largo', texto: '20 N·m', error: 'TQ-BRAZO', siFuera: '50 · 0,4 vale con F perpendicular a la llave. Inclinada, el brazo es menor.' },
        { id: 'cos', texto: `${f(50 * 0.4 * Math.cos(rad(30)), 2)} N·m`, error: 'TQ-COS', siFuera: 'Va con el seno del ángulo entre F y la llave; el coseno da la parte que empuja al perno.' },
        { id: 'div', texto: '125 N·m', error: 'TQ-DIV', siFuera: 'El torque crece con la distancia: se multiplica, no se divide.' },
      ],
      dibujo: { datos: llave(false), estado: {} },
      revelar: { datos: llave(true), estado: {} },
      coincide: 'Coincide: el brazo es la distancia perpendicular del perno a la línea de F, 0,2 m.',
    },
    mira: {
      datos: palanca(3, 1, 2, 1.5, { pP: 1, pd: 2, pR: 4 }),
      pasos: [
        { estado: { paso: 1 }, texto: 'A la izquierda pesan 30 N; a la derecha, 20 N.', ecuacion: [P, ' = 30 N y 20 N'] },
        { estado: { paso: 2 }, texto: 'Cada peso hace girar la barra con fuerza por brazo.', ecuacion: ['τ = ', F, ' · ', d] },
        { estado: { paso: 3 }, texto: 'Horizontal: los dos giros se cancelan.', ecuacion: ['30 · 1 = 20 · ', d, '   →   ', d, ' = 1,5 m'] },
        { estado: { paso: 4 }, texto: 'Además, el apoyo sostiene todo: las fuerzas también suman cero.', ecuacion: ['R = 30 + 20 = 50 N'] },
      ],
    },
    regla: {
      texto: 'El giro que produce una fuerza es su valor por el brazo perpendicular. Un cuerpo rígido en equilibrio cumple dos condiciones a la vez.',
      ecuacion: ['τ = ', F, ' · ', { sub: [d, '⊥'] }, '   ·   Σ', F, ' = 0   ·   Στ = 0'],
      condicion: 'd⊥ es la distancia perpendicular del eje a la línea de acción de la fuerza, no cualquier distancia.',
    },
    ahoraTu: {
      pieza: 'fis-lienzo',
      generar(sm) {
        const r = azar(sm);
        let m1, d1, m2, d2;
        do { m1 = r.ent(2, 6); d1 = r.de([0.5, 1, 1.5, 2]); m2 = r.ent(1, 6); d2 = m1 * d1 / m2; } while (m1 === m2 || d2 > 2.4 || Math.abs(d2 * 100 - Math.round(d2 * 100)) > 1e-9);
        return {
          pregunta: ['Una barra se apoya en su centro. A la izquierda cuelgan ', `${m1} kg a ${f(d1, 1)} m del apoyo. ¿A qué distancia del apoyo, a la derecha, hay que colgar ${m2} kg para equilibrarla?`],
          dibujo: { datos: palanca(m1, d1, m2, d2, { sinD2: true, alt: `Barra apoyada al centro con ${m1} kg a ${f(d1, 1)} m a la izquierda y ${m2} kg a la derecha.` }), estado: {} },
          opciones: opciones(d2, [
            { id: 'inv', valor: m2 * d1 / m1, error: 'TQ-INV', siFuera: 'Eso invierte la proporción: la masa mayor va más cerca del apoyo.' },
            { id: 'igual', valor: d1, error: 'E1', siFuera: 'Igual distancia equilibra solo masas iguales.' },
            { id: 'resta', valor: Math.abs(m1 - m2) * d1, error: 'TQ-RESTA', siFuera: 'Restar masas no iguala giros; se igualan los productos masa por brazo.' },
          ], n => `${f(n, 2)} m`),
          solucion: { texto: 'Los dos torques deben ser iguales.', ecuacion: [`${m1} · ${f(d1, 1)} = ${m2} · `, d, '   →   ', d, ` = ${f(d2, 2)} m`] },
        };
      },
    },
  };

  // ---------- Idea 6: la polea móvil cambia fuerza por cuerda ----------
  // Cambia: la carga y si hay polea móvil · Permanece: la carga sube 1 m · Progresa: los tramos que sostienen ·
  // Se reserva: la cuerda que hay que jalar, que se duplica · Debe verse: menos fuerza, más cuerda, mismo trabajo.
  const K6 = 0.6;
  function polea(Pv, movil, o = {}) {
    const Fv = movil ? Pv / 2 : Pv;
    const base = {
      vista: { x0: -1.6, x1: 1.6, y0: -1.2, y1: 3.7 }, escalaF: K6,
      alt: o.alt || (movil ? `Polea móvil que sostiene ${Pv} N con dos tramos de cuerda: la mano tira con ${f(Fv, 0)} N.` : `Polea fija: la mano tira con ${f(Fv, 0)} N para sostener ${Pv} N.`),
      poligonos: [{ puntos: movil ? [[-1.5, 3], [0, 3]] : [[-1.5, 3], [1.5, 3]], rayado: true }],
    };
    if (!movil) {
      base.discos = [{ c: [0, 2.6], r: 0.3 }];
      base.poligonos.push({ puntos: [[0, 3], [0, 2.6]] }, { puntos: [[-0.3, 2.6], [-0.3, 0.9]] }, caja(-0.3, 0.4, 0.6, 0.5), { puntos: [[0.3, 2.6], [0.3, 1.2]] });
      base.flechas = [{ de: [-0.3, 0.4], d: [0, -Pv], color: 'd', rotulo: `P = ${Pv} N` }, { de: [0.3, 1.2], d: [0, -Fv], color: 'o', rotulo: `F = ${f(Fv, 0)} N` }];
    } else {
      base.discos = [{ c: [0, 1.5], r: 0.3 }];
      base.poligonos.push({ puntos: [[-0.3, 3], [-0.3, 1.5]] }, { puntos: [[0.3, 1.5], [0.3, 2.85]] }, { puntos: [[0, 1.5], [0, 0.9]] }, caja(0, 0.4, 0.6, 0.5));
      base.flechas = [{ de: [0, 0.4], d: [0, -Pv], color: 'd', rotulo: `P = ${Pv} N` }, { de: [0.3, 2.85], d: [0, Fv], color: 'o', rotulo: `F = ${f(Fv, 0)} N` },
        ...(o.pT ? [{ de: [-0.3, 1.9], d: [0, Pv / 2], color: 'i', discontinua: true, rotulo: 'T', paso: o.pT }, { de: [0.3, 1.9], d: [0, Pv / 2], color: 'i', discontinua: true, rotulo: 'T', paso: o.pT }] : [])];
      if (o.cotas) base.segmentos = [{ de: [-1, 0.4], a: [-1, 1.4], color: 'i', grosor: 'variable', texto: 'sube 1 m', lado: 1, paso: o.cotas },
        { de: [1.1, 2.85], a: [1.1, 0.85], color: 'o', grosor: 'variable', texto: 'jalas 2 m', paso: o.cotas }];
    }
    return base;
  }
  const maquina = {
    id: 'polea-movil',
    titulo: 'Menos fuerza, más cuerda',
    temas: ['Máquinas simples'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Sostén una carga con una polea fija o con una polea móvil. Elige la carga y compara la fuerza de la mano.',
      voz: 'Con la misma carga, cambia de polea. ¿Cuántos tramos sostienen?',
      controles: [
        { id: 'P', etiqueta: 'P', color: 'c-d', min: 40, max: 120, paso: 20, inicio: 80, unidad: 'N', decimales: 0 },
        { id: 'movil', etiqueta: 'Polea', opciones: [{ valor: 0, texto: 'Fija' }, { valor: 1, texto: 'Móvil' }], inicio: 0 },
      ],
      dibujo: val => ({ datos: polea(val.P, val.movil === 1), estado: {} }),
      lectura: val => [F, ` = ${f(val.movil ? val.P / 2 : val.P, 0)} N · `, val.movil ? 'dos tramos sostienen' : 'un tramo sostiene'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Con una polea móvil sostienes 80 N con solo 40 N. Para subir la carga 1 m, ¿cuánta cuerda tienes que jalar?',
      opciones: [
        { id: 'c', texto: '2 m', correcta: true },
        { id: 'uno', texto: '1 m, lo mismo que sube', error: 'MS-CUERDA', siFuera: 'Con polea fija, sí. Aquí cada uno de los dos tramos se acorta 1 m.' },
        { id: 'medio', texto: '0,5 m: la fuerza es la mitad', error: 'MS-MITAD', siFuera: 'La mitad de fuerza no ahorra cuerda: la cambia por más cuerda.' },
      ],
      dibujo: { datos: polea(80, true), estado: {} },
      revelar: { datos: polea(80, true, { cotas: 0 }), estado: {} },
      coincide: 'Coincide: dos tramos se acortan 1 m cada uno. Fuerza a la mitad, cuerda al doble.',
    },
    mira: {
      datos: polea(80, true, { pT: 1, cotas: 3 }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Dos tramos de la misma cuerda sostienen la polea.', ecuacion: ['2 ', T, ' = ', P, ' = 80 N'] },
        { estado: { paso: 2 }, texto: 'La mano tira de un tramo: hace la mitad del peso.', ecuacion: [F, ' = ', T, ' = 40 N'] },
        { estado: { paso: 3 }, texto: 'Para subir 1 m, los dos tramos se acortan: jalas 2 m.', ecuacion: ['cuerda = 2 · 1 m = 2 m'] },
        { estado: { paso: 3 }, texto: 'Fuerza por distancia es igual de los dos lados: no se ahorra trabajo.', ecuacion: ['40 · 2 = 80 · 1 = 80 J'] },
      ],
    },
    regla: {
      texto: 'Una máquina ideal cambia fuerza por distancia: si reduce la fuerza, la mano recorre más. Fuerza por distancia se conserva.',
      ecuacion: [F, ' · ', { sub: [d, 'mano'] }, ' = ', P, ' · ', { sub: [d, 'carga'] }],
      condicion: 'poleas y cuerdas sin masa ni rozamiento. Cada polea móvil reparte la carga entre dos tramos.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), n = r.ent(1, 3), Pv = r.de([80, 120, 160, 240, 320]), pide = sm % 2 ? 'fuerza' : 'cuerda', h = r.de([1, 2, 3]);
        const k = 2 ** n, Fv = Pv / k, cu = h * k;
        const pre = `Un sistema tiene ${n} ${n === 1 ? 'polea móvil' : 'poleas móviles'} en serie (cada una reparte su carga en dos tramos) y sube ${Pv} N`;
        return pide === 'fuerza' ? {
          pregunta: `${pre}. Sin rozamiento, ¿con qué fuerza hay que jalar?`,
          opciones: opciones(Fv, [
            { id: 'mitad-n', valor: Pv / (2 * n), error: 'MS-SUMA', siFuera: 'Eso reparte entre 2n tramos. En serie, cada polea vuelve a dividir entre dos.' },
            { id: 'todo', valor: Pv, error: 'MS-CUERDA', siFuera: 'Eso sería con polea fija: no reparte la carga.' },
            { id: 'una', valor: Pv / 2, error: 'MS-MITAD', siFuera: 'Esa es la fuerza con una sola polea móvil.' },
          ], v => `${f(v, 2)} N`),
          solucion: { texto: `Cada polea divide entre dos: ${n} veces.`, ecuacion: [F, ` = ${Pv} / 2${n > 1 ? `^${n}` : ''} = ${f(Fv, 2)} N`] },
        } : {
          pregunta: `${pre} una altura de ${h} m. Sin rozamiento, ¿cuánta cuerda hay que jalar?`,
          opciones: opciones(cu, [
            { id: 'igual', valor: h, error: 'MS-CUERDA', siFuera: 'Eso sería con polea fija.' },
            { id: 'mitad', valor: h / k, error: 'MS-MITAD', siFuera: 'Menos fuerza no ahorra cuerda: la cuerda se multiplica.' },
            { id: 'suma', valor: 2 * n * h, error: 'MS-SUMA', siFuera: 'Eso suma dos por polea; en serie cada polea duplica.' },
          ], v => `${f(v, 2)} m`),
          solucion: { texto: 'La fuerza baja tantas veces como la cuerda crece.', ecuacion: [`cuerda = ${h} · ${k} = ${f(cu, 0)} m`] },
        };
      },
    },
  };

  return {
    unidad: 'fisica.estatica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/fis-lienzo.js'],
    historia: {
      texto: 'Equilibrar cargas fue un problema práctico mucho antes de la mecánica moderna. Arquímedes relacionó pesos y distancias en la palanca con argumentos geométricos. Siglos después, Stevin estudió cuerpos en planos inclinados. Hoy esas ideas se escriben como dos condiciones: que las fuerzas y los giros se cancelen.',
      pregunta: '¿Por qué una puerta se abre más fácil empujando lejos de las bisagras?',
      fuente: { titulo: 'NYU — Archimedes, The Law of the Lever', url: 'https://math.nyu.edu/Archimedes/Lever/LeverLaw.html' },
    },
    ideas: [dcl, nudo, roce, elastica, torque, maquina],
  };
});
