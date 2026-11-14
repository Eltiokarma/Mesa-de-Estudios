/*
 * Teoría de «Resolución de triángulos oblicuángulos» (trigonometria.triangulos-oblicuangulos), 5.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 16), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (trigonometría, pp. 82–100) y las «Precisiones de Geometría y Trigonometría» del expediente (una inversa exige
 * una rama: el arco seno de la calculadora no agota el caso ambiguo). Forma: angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: conserva qué lado se opone a qué ángulo antes de sustituir.
 * Colores (regla 4): cada lado va con su ángulo opuesto. A y a en naranja (c-o), B y b en turquesa (c-i),
 * C y c en verde (c-d); el radio circunscrito R (y su diámetro 2R) y los rumbos θ en rojo (c-h: no salen juntos).
 * La altura h y las líneas norte-sur van sin color (contorno): son construcciones, no datos.
 * Errores: TR10, TR23, TR24 y TR25 de docs/investigacion/trigonometria-ideas-erroneas.md (hipótesis de aula).
 * Nuevos, hipótesis sin medir: LS-RADIO, LS-LADO-MAYOR, LS-NUMERO, LS-INVERSA, LS-OPUESTO, LS-NINGUNO,
 * LS-SEGUNDO-SIEMPRE, LS-TOCA, LC-SUMA, LC-SUPLE, LC-SENO, LP-SIGNO, LP-AGUDO, LT-SIN-TAN, LT-TAN, LT-INVERSA,
 * RUMBO-RESTA, RUMBO-EXTERIOR, RUMBO-SUMA.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: con tres datos de un triángulo cualquiera, elegir la ley que los usa y contar cuántos triángulos hay.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: resuelve un triángulo con senos o cosenos, detecta el segundo triángulo del caso LLA y traduce rumbos.
 *   Orden de atención: 1.º el par lado–ángulo opuesto (mismo color) · 2.º la construcción (altura, compás, diámetro) ·
 *     acción: mover un ángulo o un lado · fondo: la circunferencia y las líneas de referencia.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué la calculadora da un solo B si a veces hay dos triángulos, y desde dónde se mide un rumbo?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const A = { v: 'c-o', t: 'A' }, a = { v: 'c-o', t: 'a' }, B = { v: 'c-i', t: 'B' }, b = { v: 'c-i', t: 'b' };
  const C = { v: 'c-d', t: 'C' }, c = { v: 'c-d', t: 'c' }, R = { v: 'c-h', t: 'R' }, th = { v: 'c-h', t: 'θ' };
  const RAD = Math.PI / 180;
  const sen = g => Math.sin(g * RAD), cos = g => Math.cos(g * RAD), tan = g => Math.tan(g * RAD);
  const asen = x => Math.asin(x) / RAD, acos = x => Math.acos(Math.max(-1, Math.min(1, x))) / RAD;
  // Azar con semilla para «Ahora tú» (el de la unidad de referencia).
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un texto se descartan.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (typeof d.valor === 'number' && !Number.isFinite(d.valor)) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Geometría en el plano: punto polar, dirección de V a Q en grados, arco del ángulo interior en V.
  const P = (r, t, cx = 0, cy = 0) => [cx + r * cos(t), cy + r * sen(t)];
  const dir = (V, Q) => Math.atan2(Q[1] - V[1], Q[0] - V[0]) / RAD;
  function angulo(V, P1, P2, r, color, rotulo, extra) {
    const d1 = dir(V, P1);
    let s = dir(V, P2) - d1;
    while (s > 180) s -= 360;
    while (s <= -180) s += 360;
    return Object.assign({ cx: V[0], cy: V[1], de: d1, a: d1 + s, r, espiral: 0, flecha: false, color, rotulo }, extra);
  }
  // Marca de ángulo recto en V entre las direcciones a P1 y P2 (dos segmentos finos).
  function recto(V, P1, P2, s, extra) {
    const u = P(1, dir(V, P1)), w = P(1, dir(V, P2));
    const p = [V[0] + s * u[0], V[1] + s * u[1]], q = [V[0] + s * w[0], V[1] + s * w[1]], m = [p[0] + s * w[0], p[1] + s * w[1]];
    return [Object.assign({ de: p, a: m, grosor: 'cuadricula' }, extra), Object.assign({ de: m, a: q, grosor: 'cuadricula' }, extra)];
  }
  const raizTxt = N => (Number.isInteger(Math.sqrt(N)) ? f(Math.sqrt(N)) : `√${f(N)} ≈ ${f(Math.sqrt(N))}`);

  // ---------- Idea 1: cada lado con su seno ----------
  // Cambia: los ángulos A y B y el radio R de la circunferencia. · Permanece: el triángulo inscrito y el color
  // de cada par lado–ángulo opuesto. · Progresa: la forma del triángulo, mientras las tres razones siguen iguales.
  // Se reserva: qué segmento mide la razón común (la predicción: el diámetro). · Debe verse: que a/sen A no
  // depende de la forma del triángulo, solo de la circunferencia que lo rodea.
  function inscrito(Ad, Bd, Rv, extra = {}) {
    const Bp = P(Rv, -90 - Ad), Cp = P(Rv, -90 + Ad), Ap = P(Rv, -90 + Ad + 2 * Bd), ra = 0.3 * Rv;
    return Object.assign({
      ejes: false, ventana: { x: [-2.35, 2.35], y: [-2.35, 2.35] },
      circulos: [{ r: Rv }],
      segmentos: [{ de: Bp, a: Cp, color: 'o', rotulo: 'a' }, { de: Cp, a: Ap, color: 'i', rotulo: 'b' }, { de: Ap, a: Bp, color: 'd', rotulo: 'c' }],
      arcos: [angulo(Ap, Bp, Cp, ra, 'o', 'A'), angulo(Bp, Cp, Ap, ra, 'i', 'B'), angulo(Cp, Ap, Bp, ra, 'd', 'C')],
      alt: `Triángulo de ángulos ${f(Ad)}°, ${f(Bd)}° y ${f(180 - Ad - Bd)}° inscrito en una circunferencia de radio ${f(Rv)}`,
    }, extra);
  }
  // El diámetro que sale de B, el punto A′ y el triángulo rectángulo A′BC (con A < 90°).
  function diametro(Ad, Bd, Rv, desde) {
    const Bp = P(Rv, -90 - Ad), Cp = P(Rv, -90 + Ad), Ap2 = [-Bp[0], -Bp[1]];
    return {
      segmentos: [{ de: Bp, a: Ap2, color: 'h', rotulo: '2R', desde: desde[0] }, { de: Ap2, a: Cp, discontinua: true, desde: desde[1] },
        ...recto(Cp, Bp, Ap2, 0.18 * Rv, { desde: desde[2] })],
      arcos: [angulo(Ap2, Bp, Cp, 0.34 * Rv, 'o', 'A′', { desde: desde[1] })],
    };
  }
  const ley = (Ad, Bd, Rv) => {
    const base = inscrito(Ad, Bd, Rv), d = diametro(Ad, Bd, Rv, [0, 0, 0]);
    return Object.assign(base, { segmentos: base.segmentos.concat(d.segmentos), arcos: base.arcos.concat(d.arcos),
      alt: `${base.alt}; el diámetro 2R sale de B y forma con C un triángulo rectángulo` });
  };
  const senos = {
    id: 'ley-de-senos',
    titulo: 'Cada lado con su seno',
    temas: ['Ley de senos'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Cambia A, B y el tamaño de la circunferencia. Cada lado lleva el color de su ángulo opuesto; la lectura lo divide entre ese seno.',
      voz: 'Conservemos cada lado frente a su ángulo; después comparemos las tres razones.',
      controles: [
        { id: 'A', etiqueta: 'A', color: 'c-o', min: 20, max: 100, paso: 10, inicio: 50, unidad: '°', decimales: 0 },
        { id: 'B', etiqueta: 'B', color: 'c-i', min: 20, max: 60, paso: 10, inicio: 60, unidad: '°', decimales: 0 },
        { id: 'R', etiqueta: 'tamaño', min: 1, max: 2, paso: 0.5, inicio: 1.5, decimales: 1 },
      ],
      dibujo: val => ({ datos: inscrito(val.A, val.B, val.R), estado: {} }),
      lectura: val => [a, '/sen ', A, ' = ', b, '/sen ', B, ' = ', c, '/sen ', C, ` = ${f(2 * val.R)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Las tres razones dan siempre el mismo número, aunque cambie la forma del triángulo. ¿Qué segmento de la figura mide exactamente ese número?',
      voz: 'Piensa en qué no cambió mientras movías los ángulos.',
      opciones: [
        { id: 'c', texto: 'El diámetro de la circunferencia', correcta: true },
        { id: 'radio', texto: 'El radio de la circunferencia', error: 'LS-RADIO', siFuera: 'Bien que depende de la circunferencia. Pero la razón es el doble del radio: el diámetro.' },
        { id: 'mayor', texto: 'El lado más largo del triángulo', error: 'LS-LADO-MAYOR', siFuera: 'Sería cierto si su ángulo opuesto midiera 90°: entonces ese lado es un diámetro.' },
        { id: 'numero', texto: 'Ninguno: es un número sin largo', error: 'LS-NUMERO', siFuera: 'El seno no tiene unidad, pero el lado sí: lado entre seno es un largo.' },
      ],
      dibujo: { datos: inscrito(40, 75, 2), estado: {} },
      revelar: { datos: ley(40, 75, 2), estado: {} },
      coincide: 'Coincide: la razón común es el diámetro, 2R.',
      noCoincide: 'Revisemos con el diámetro dibujado en rojo.',
    },
    mira: {
      datos: (() => {
        const base = inscrito(40, 75, 2), d = diametro(40, 75, 2, [2, 3, 4]);
        return Object.assign(base, { segmentos: base.segmentos.concat(d.segmentos), arcos: base.arcos.concat(d.arcos),
          alt: 'Triángulo inscrito; el diámetro que sale de B forma un triángulo rectángulo con el lado a' });
      })(),
      voz: 'Un trazo por paso; el diámetro hace el trabajo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada lado se divide entre el seno de su ángulo opuesto.', ecuacion: [{ frac: [a, ['sen ', A]] }, ' = ', { frac: [b, ['sen ', B]] }, ' = ', { frac: [c, ['sen ', C]] }] },
        { estado: { corte: 2 }, texto: 'Traza el diámetro que sale de B.', ecuacion: ['BA′ = 2', R] },
        { estado: { corte: 3 }, texto: 'A′ mira el lado a con el mismo ángulo que A.', ecuacion: ['A′ = ', A] },
        { estado: { corte: 4 }, texto: 'Un triángulo con un diámetro por lado es rectángulo en C.', ecuacion: ['sen ', A, ' = ', { frac: [a, ['2', R]] }] },
        { estado: { corte: 4 }, texto: 'Despejando, cada razón es el diámetro.', ecuacion: [{ frac: [a, ['sen ', A]] }, ' = 2', R] },
      ],
    },
    regla: {
      texto: 'En todo triángulo, cada lado dividido entre el seno de su ángulo opuesto da lo mismo: el diámetro de la circunferencia que pasa por los tres vértices.',
      ecuacion: [{ frac: [a, ['sen ', A]] }, ' = ', { frac: [b, ['sen ', B]] }, ' = ', { frac: [c, ['sen ', C]] }, ' = 2', R],
      condicion: 'a, b y c se oponen a A, B y C; el triángulo no es degenerado y R es el radio circunscrito.',
      voz: 'Un lado y su ángulo opuesto forman una pareja: no los separes.',
    },
    ahoraTu: {
      voz: 'Primero marca qué ángulo se opone a cada lado.',
      generar(sem) {
        const rr = azar(sem);
        let Ad, Bd;
        do { Ad = rr.uno([30, 40, 45, 50, 60, 70, 80, 100, 120]); Bd = rr.uno([30, 40, 45, 50, 60, 70, 80, 110]); } while (Ad === Bd || Ad + Bd > 160);
        const Cd = 180 - Ad - Bd, av = rr.ent(4, 15);
        if (sem % 3 === 2) {
          const Rv = av / (2 * sen(Ad));
          return {
            pregunta: ['En un triángulo, ', a, ` = ${f(av)} cm y su ángulo opuesto mide `, A, ` = ${f(Ad)}°. ¿Cuánto mide el radio `, R, ' de la circunferencia circunscrita?'],
            opciones: opciones(Rv, [
              { id: 'diametro', valor: av / sen(Ad), error: 'LS-RADIO', siFuera: 'Esa es la razón a/sen A: el diámetro. El radio es su mitad.' },
              { id: 'producto', valor: av * sen(Ad) / 2, error: 'LS-INVERSA', siFuera: 'Eso multiplica por el seno. El lado se divide entre el seno.' },
              { id: 'lado', valor: av / 2, error: 'LS-LADO-MAYOR', siFuera: `Sería cierto si A midiera 90°: ahí a es un diámetro. Con ${f(Ad)}°, falta el seno.` },
            ], v => `${f(v)} cm`),
            solucion: { texto: 'La razón del lado con su seno es el diámetro.', ecuacion: ['2', R, ` = ${f(av)}/sen ${f(Ad)}° = ${f(av / sen(Ad))}  ⇒  `, R, ` = ${f(Rv)} cm`] },
          };
        }
        const bv = av * sen(Bd) / sen(Ad);
        return {
          pregunta: ['En un triángulo, ', A, ` = ${f(Ad)}°, `, B, ` = ${f(Bd)}° y el lado opuesto a A mide `, a, ` = ${f(av)} cm. ¿Cuánto mide el lado `, b, '?'],
          opciones: opciones(bv, [
            { id: 'proporcional', valor: av * Bd / Ad, error: 'TR10', siFuera: 'Bien que b crece con B. Pero crece con el seno de B, no con B.' },
            { id: 'inversa', valor: av * sen(Ad) / sen(Bd), error: 'LS-INVERSA', siFuera: 'La pareja está invertida: b va con sen B y a con sen A.' },
            { id: 'opuesto', valor: av * sen(Cd) / sen(Ad), error: 'LS-OPUESTO', siFuera: `Ese es el lado c, opuesto a C = ${f(Cd)}°. El lado b se opone a B.` },
          ], v => `${f(v)} cm`),
          solucion: { texto: 'Se igualan las razones de las parejas a–A y b–B.', ecuacion: [b, ` = ${f(av)} · `, { frac: [`sen ${f(Bd)}°`, `sen ${f(Ad)}°`] }, ` = ${f(bv)} cm`] },
        };
      },
    },
  };

  // ---------- Idea 2: el compás del caso ambiguo ----------
  // Cambia: el largo de a, como un compás que cuelga de C. · Permanece: el ángulo A, el lado b y la altura h.
  // Progresa: cuántas veces corta el compás la base (0, 2 o 1). · Se reserva: el valor único que da la calculadora
  // (la predicción). · Debe verse: que dos triángulos distintos cumplen los mismos tres datos.
  // El arco del compás por debajo de C, recortado para no salir de la ventana (la pieza no recorta).
  function arcoCompas(Cp, av, L, desde) {
    const lim = (k, sg) => sg * acos(Math.max(-1, Math.min(1, k)));
    const de = Math.max(-172, lim((-0.7 - Cp[0]) / av, -1)), hasta = Math.min(-8, lim((L - 0.3 - Cp[0]) / av, -1));
    const piso = (-1.1 - Cp[1]) / av, base = { cx: Cp[0], cy: Cp[1], r: av, espiral: 0, flecha: false, color: 'o', grosor: 'contorno', desde };
    if (piso <= -1) return [Object.assign({ de, a: hasta }, base)];
    const t = asen(piso);                  // entre −90° y 0°: por debajo de ahí, el arco saldría por abajo
    return [Object.assign({ de, a: Math.min(hasta, -180 - t) }, base), Object.assign({ de: Math.max(de, t), a: hasta }, base)].filter(x => x.a > x.de + 1);
  }
  function compas(Ad, bv, av, o = {}) {
    const Cp = P(bv, Ad), h = bv * sen(Ad), x0 = bv * cos(Ad), D = av * av - h * h;
    const xs = D < -1e-9 ? [] : Math.abs(D) < 1e-9 ? [x0] : [x0 - Math.sqrt(D), x0 + Math.sqrt(D)].filter(x => x > 1e-9);
    const L = o.L || 12, alto = o.alto || h + 1.2, n = [-sen(Ad), cos(Ad)];
    const datos = {
      ejes: false, ventana: { x: [-0.8, L], y: [-1.3, alto] },
      segmentos: [{ de: [0, 0], a: [L - 0.3, 0], grosor: 'contorno' }, { de: [0, 0], a: Cp, color: 'i' },
        { de: Cp, a: [x0, 0], discontinua: true, desde: o.dh || 0 }],
      // El compás: el arco de radio a que barre la zona de la base (abajo de C).
      arcos: [angulo([0, 0], [1, 0], Cp, 1.6, 'o', `${f(Ad)}°`),
        ...arcoCompas(Cp, av, L, o.dc || 0)],
      puntos: [{ x: Cp[0], y: Cp[1], rotulo: 'C', lado: 'n' }],
      rotulos: [{ x: -0.35, y: -0.55, texto: 'A' }, { x: bv / 2 * cos(Ad) + 0.9 * n[0], y: bv / 2 * sen(Ad) + 0.9 * n[1], texto: `b = ${f(bv)}`, color: 'i', ancla: 'end' },
        { x: x0 - 0.25, y: 0.45 * h, texto: 'h', ancla: 'end', desde: o.dh || 0 }],
      alt: `Ángulo A de ${f(Ad)} grados, lado b = ${f(bv)}, altura ${f(h)} y un compás de radio a = ${f(av)} desde C: ${xs.length === 0 ? 'no toca la base' : xs.length === 1 ? 'un triángulo' : 'dos triángulos'}`,
    };
    xs.forEach((x, k) => {
      const dd = o.dt ? o.dt[k] : 0, ult = k === xs.length - 1;
      datos.segmentos.push({ de: Cp, a: [x, 0], color: 'o', rotulo: ult ? `a = ${f(av)}` : '', desde: dd });
      datos.puntos.push({ x, y: 0, color: 'd', rotulo: xs.length === 2 ? `B${k ? '₂' : '₁'}` : 'B', lado: 's', desde: dd });
    });
    return { datos, xs };
  }
  const cuenta = (Ad, bv, av) => {
    const h = bv * sen(Ad);
    if (av < h - 1e-9) return { n: 0 };
    const B1 = asen(Math.min(1, bv * sen(Ad) / av)), B2 = 180 - B1;
    if (Math.abs(av - h) < 1e-9) return { n: 1, B1: 90 };
    return Ad + B2 < 180 - 1e-9 && av < bv ? { n: 2, B1, B2 } : { n: 1, B1 };
  };
  const ambiguo = {
    id: 'caso-ambiguo',
    titulo: 'Dos triángulos, mismos datos',
    temas: ['Ley de senos'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'El ángulo A y el lado b quedan fijos. Cambia el largo de a: el compás naranja cuelga de C. Cuenta dónde toca la base.',
      voz: 'Mira la altura punteada antes de alargar el compás.',
      controles: [{ id: 'a', etiqueta: 'a', color: 'c-o', min: 1.5, max: 7, paso: 0.5, inicio: 2.5, decimales: 1 }],
      dibujo: val => ({ datos: compas(35, 6, val.a).datos, estado: {} }),
      lectura: val => {
        const k = cuenta(35, 6, val.a);
        return k.n === 0 ? [a, ` = ${f(val.a)}: ningún triángulo`] : k.n === 1 ? [a, ` = ${f(val.a)}: un triángulo, `, B, ` ≈ ${f(k.B1, 1)}°`]
          : [a, ` = ${f(val.a)}: dos triángulos, `, B, ` ≈ ${f(k.B1, 1)}° o ${f(k.B2, 1)}°`];
      },
      minimo: 3,
    },
    predice: (() => {
      const k = cuenta(30, 8, 5);
      return {
        pregunta: `Otro caso: A = 30°, a = 5 y b = 8. La calculadora da B = arcsen 0,8 ≈ ${f(k.B1)}°. ¿Cuántos triángulos cumplen esos datos?`,
        voz: 'La calculadora da un valor; la figura puede tener más.',
        opciones: [
          { id: 'c', texto: `Dos: B ≈ ${f(k.B1)}° o B ≈ ${f(k.B2)}°`, correcta: true },
          { id: 'uno', texto: `Uno: B ≈ ${f(k.B1)}°`, error: 'TR23', siFuera: `${f(k.B1)}° sí sirve. Su suplemento tiene el mismo seno y también cabe con A = 30°.` },
          { id: 'ninguno', texto: 'Ninguno: a es menor que b', error: 'LS-NINGUNO', siFuera: 'Sería cierto si a fuera menor que la altura, 4. Con a = 5, el compás toca la base.' },
          { id: 'recto', texto: 'Uno, rectángulo en B', error: 'TR25', siFuera: 'Sería cierto si a midiera justo la altura, 4. Con a = 5 hay dos cortes.' },
        ],
        dibujo: { datos: compas(30, 8, 5, { L: 12.3, dc: 9, dt: [9, 9] }).datos, estado: {} },
        revelar: { datos: compas(30, 8, 5, { L: 12.3 }).datos, estado: {} },
        coincide: `Coincide: ${f(k.B1)}° y ${f(k.B2)}° tienen el mismo seno, y los dos caben.`,
        noCoincide: 'Revisemos: el compás corta la base en dos puntos.',
      };
    })(),
    mira: (() => {
      const k = cuenta(30, 8, 5);
      return {
        datos: compas(30, 8, 5, { L: 12.3, dh: 2, dc: 3, dt: [4, 5] }).datos,
        voz: 'La altura decide antes que la calculadora.',
        pasos: [
          { estado: { corte: 1 }, texto: 'El ángulo A y el lado b fijan el vértice C.', ecuacion: [A, ' = 30°;  ', b, ' = 8'] },
          { estado: { corte: 2 }, texto: 'La distancia de C a la base es la altura.', ecuacion: ['h = ', b, ' sen ', A, ' = 8 · 0,5 = 4'] },
          { estado: { corte: 3 }, texto: 'El compás mide 5: más que h y menos que b.', ecuacion: ['4 < ', a, ' = 5 < 8'] },
          { estado: { corte: 4 }, texto: 'La ley de senos da el primer ángulo.', ecuacion: ['sen ', B, ' = ', { frac: ['8 · sen 30°', '5'] }, ` = 0,8  ⇒  `, { sub: [B, '1'] }, ` ≈ ${f(k.B1)}°`] },
          { estado: { corte: 5 }, texto: 'El suplemento tiene el mismo seno y también cabe.', ecuacion: [{ sub: [B, '2'] }, ` = 180° − ${f(k.B1)}° = ${f(k.B2)}°;  30° + ${f(k.B2)}° < 180°`] },
        ],
      };
    })(),
    regla: {
      texto: 'Con A agudo y no comprendido, compara a con h = b sen A y con b: a < h, ninguno; h < a < b, dos; a = h o a ≥ b, uno.',
      ecuacion: ['sen ', B, ' = ', { frac: [[b, ' sen ', A], a] }, ';   ', { sub: [B, '2'] }, ' = 180° − ', { sub: [B, '1'] }],
      condicion: 'A es agudo y se opone a a. Cada candidato sirve solo si A + B < 180°.',
      voz: 'El arco seno da una rama; el suplemento puede ser la otra.',
    },
    ahoraTu: {
      voz: 'Calcula la altura primero; después decide cuántos caben.',
      generar(sem) {
        const rr = azar(sem), Ad = rr.uno([30, 35, 40, 45, 50]), bv = rr.ent(6, 12), h = bv * sen(Ad), tipo = sem % 3;
        const av = tipo === 0 ? Math.round((h + (bv - h) * (0.3 + 0.4 * rr())) * 2) / 2 : tipo === 1 ? bv + rr.ent(1, 4) : Math.max(1, Math.floor(h - 0.5 - rr.ent(0, 1)));
        const k = cuenta(Ad, bv, av);
        const preg = ['Con ', A, ` = ${f(Ad)}°, `, a, ` = ${f(av)} y `, b, ` = ${f(bv)}, ¿cuántos triángulos hay y cuánto mide `, B, '?'];
        if (k.n === 0) {
          return {
            pregunta: preg,
            opciones: [
              { id: 'c', texto: 'Ninguno: el compás no llega a la base', correcta: true },
              { id: 'toca', texto: 'Uno, rectángulo en B', error: 'LS-TOCA', siFuera: `Sería cierto si a midiera la altura, ${f(h)}. Aquí a es menor.` },
              { id: 'menor', texto: 'Dos, porque a es menor que b', error: 'LS-SEGUNDO-SIEMPRE', siFuera: `Dos caben cuando a está entre h = ${f(h)} y b. Aquí a no alcanza h.` },
            ],
            solucion: { texto: `a es menor que la altura: sen B pasaría de 1.`, ecuacion: ['h = ', `${f(bv)} · sen ${f(Ad)}° = ${f(h)} > `, a] },
          };
        }
        if (k.n === 2) {
          return {
            pregunta: preg,
            opciones: [
              { id: 'c', texto: `Dos: B ≈ ${f(k.B1, 1)}° o B ≈ ${f(k.B2, 1)}°`, correcta: true },
              { id: 'uno', texto: `Uno: B ≈ ${f(k.B1, 1)}°`, error: 'TR23', siFuera: `${f(k.B1, 1)}° sirve, y su suplemento también cabe: A + B sigue bajo 180°.` },
              { id: 'otro', texto: `Uno: B ≈ ${f(k.B2, 1)}°`, error: 'TR23', siFuera: `El ángulo obtuso sirve, y el agudo de igual seno también.` },
              { id: 'ninguno', texto: 'Ninguno: a es menor que b', error: 'LS-NINGUNO', siFuera: `Sería cierto si a fuera menor que h = ${f(h)}. Aquí a la supera.` },
            ],
            solucion: { texto: 'h < a < b: el compás corta la base dos veces.', ecuacion: ['sen ', B, ` = ${f(bv * sen(Ad) / av, 3)}  ⇒  `, B, ` ≈ ${f(k.B1, 1)}° o ${f(k.B2, 1)}°`] },
          };
        }
        return {
          pregunta: preg,
          opciones: [
            { id: 'c', texto: `Uno: B ≈ ${f(k.B1, 1)}°`, correcta: true },
            { id: 'dos', texto: `Dos: B ≈ ${f(k.B1, 1)}° o B ≈ ${f(180 - k.B1, 1)}°`, error: 'LS-SEGUNDO-SIEMPRE', siFuera: `El suplemento tiene el mismo seno, pero ${f(Ad)}° + ${f(180 - k.B1, 1)}° pasa de 180°.` },
            { id: 'ninguno', texto: 'Ninguno: sen B no existe', error: 'LS-NINGUNO', siFuera: 'Sería cierto si a fuera menor que la altura. Aquí a es mayor que b.' },
          ],
          solucion: { texto: 'a ≥ b: el otro corte cae detrás de A. Queda uno.', ecuacion: ['sen ', B, ` = ${f(bv * sen(Ad) / av, 3)}  ⇒  `, B, ` ≈ ${f(k.B1, 1)}°`] },
        };
      },
    },
  };

  // ---------- Idea 3: Pitágoras con corrección ----------
  // Cambia: el ángulo A entre los lados fijos b y c. · Permanece: b y c, y la base sobre la horizontal.
  // Progresa: el término −2bc cos A, que resta si A es agudo y suma si es obtuso. · Se reserva: el caso de
  // 120° con otros lados (la predicción). · Debe verse: que con 90° la ley queda en Pitágoras.
  const triLC = (Ad, bv, cv, o = {}) => {
    const Cx = bv * cos(Ad), Cy = bv * sen(Ad), av = Math.sqrt(bv * bv + cv * cv - 2 * bv * cv * cos(Ad));
    const puntos = [{ id: 'A', x: 0, y: 0, rotulo: 'A' }, { id: 'B', x: cv, y: 0, rotulo: 'B' }, { id: 'C', x: Cx, y: Cy, rotulo: 'C' }];
    const lados = [{ de: 'A', a: 'B', color: 'd', texto: `c = ${f(cv)}` }, { de: 'A', a: 'C', color: 'i', texto: o.altura ? 'b' : `b = ${f(bv)}`, lado: o.altura ? -1 : undefined },
      { de: 'B', a: 'C', color: 'o', grosor: 'variable', texto: o.aTexto === undefined ? `a ≈ ${f(av)}` : o.aTexto, final: o.aFinal }];
    const angulos = [{ en: 'A', de: 'B', a: 'C', texto: `${f(Ad)}°`, color: 'o' }];
    if (o.altura) {
      puntos.push({ id: 'H', x: Cx, y: 0, rotulo: 'H', paso: o.altura });
      if (Cx < 0) lados.push({ de: 'H', a: 'A', horizontal: true, paso: o.altura, texto: `${f(-Cx)}`, lado: -1 });
      lados.push({ de: 'C', a: 'H', visual: true, texto: `h = ${f(Cy)}`, paso: o.altura });
      angulos.push({ en: 'H', de: 'B', a: 'C', paso: o.altura });
    }
    return { puntos, lados, angulos };
  };
  const cosenos = {
    id: 'ley-de-cosenos',
    titulo: 'Pitágoras con corrección',
    temas: ['Ley de cosenos'],
    pieza: 'triangulo',
    juega: {
      consigna: 'Los lados b y c no cambian. Abre o cierra el ángulo A entre ellos y mira cómo cambia el lado a, frente a A.',
      voz: 'Fíjate en el signo del último término cuando A pasa de 90°.',
      controles: [{ id: 'A', etiqueta: 'A', color: 'c-o', min: 30, max: 130, paso: 20, inicio: 50, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: triLC(val.A, 4, 6), estado: {} }),
      lectura: val => {
        const t = -48 * cos(val.A);
        return [{ sup: [a, '2'] }, ` = 16 + 36 ${t < 0 ? '−' : '+'} ${f(Math.abs(t))} = ${f(52 + t)}`];
      },
      minimo: 3,
    },
    predice: (() => {
      const N = 25 + 64 + 40;
      return {
        pregunta: 'Otro triángulo: b = 5, c = 8 y el ángulo entre ellos mide A = 120°. ¿Cuánto mide el lado a?',
        voz: 'Antes de sustituir, piensa en el signo de cos 120°.',
        opciones: [
          { id: 'c', texto: raizTxt(N), correcta: true },
          { id: 'pita', texto: raizTxt(89), error: 'TR24', siFuera: 'Sería cierto con A = 90°. Con 120° el término −2bc cos A no es cero.' },
          { id: 'signo', texto: raizTxt(49), error: 'TR24', siFuera: 'Ese sería a con A = 60°. Cos 120° es negativo: el término suma.' },
          { id: 'suma', texto: '13', error: 'LC-SUMA', siFuera: 'b + c sería a si A midiera 180°: el triángulo se aplana.' },
        ],
        dibujo: { datos: triLC(120, 5, 8, { aTexto: 'a = ?' }), estado: {} },
        revelar: { datos: triLC(120, 5, 8, { aTexto: `a = ${raizTxt(N)}` }), estado: {} },
        coincide: `Coincide: con A obtuso, a² = 89 + 40 = ${N}.`,
        noCoincide: 'Revisemos el signo con la altura, en «Mira».',
      };
    })(),
    mira: {
      datos: triLC(120, 5, 8, { altura: 2, aTexto: 'a = ?', aFinal: `a = ${raizTxt(129)}` }),
      voz: 'Una altura convierte el problema en Pitágoras.',
      pasos: [
        { estado: { paso: 1 }, texto: 'Se conocen dos lados y el ángulo entre ellos.', ecuacion: [b, ' = 5;  ', c, ' = 8;  ', A, ' = 120°'] },
        { estado: { paso: 2 }, texto: 'La altura desde C cae fuera, detrás de A.', ecuacion: ['h = ', b, ` sen 120° = ${f(5 * sen(120))}`] },
        { estado: { paso: 2 }, texto: 'De H a B hay c más la sombra de b.', ecuacion: ['HB = ', c, ' − ', b, ' cos ', A, ' = 8 + 2,5 = 10,5'] },
        { estado: { paso: 2 }, texto: 'Pitágoras en el triángulo CHB.', ecuacion: [{ sup: [a, '2'] }, ` = ${f(25 * 0.75)} + ${f(110.25)} = 129`] },
        { estado: { paso: 2, final: true }, texto: 'Al desarrollar sale la ley de cosenos.', ecuacion: [{ sup: [a, '2'] }, ' = ', { sup: [b, '2'] }, ' + ', { sup: [c, '2'] }, ' − 2', b, c, ' cos ', A] },
      ],
    },
    regla: {
      texto: 'Con dos lados y el ángulo entre ellos, el tercer lado sale de Pitágoras corregido: el término −2bc cos A resta si A es agudo y suma si es obtuso.',
      ecuacion: [{ sup: [a, '2'] }, ' = ', { sup: [b, '2'] }, ' + ', { sup: [c, '2'] }, ' − 2', b, c, ' cos ', A],
      condicion: 'A es el ángulo comprendido entre b y c, y se opone a a. Con A = 90° queda Pitágoras.',
      voz: 'El coseno trae su signo; no lo cambies a mano.',
    },
    ahoraTu: {
      voz: 'Ubica el ángulo comprendido entre los dos lados.',
      generar(sem) {
        const rr = azar(sem);
        if (sem % 2) {
          // Lados enteros con un ángulo de 60° o 120°: se pide el ángulo.
          const ternas = [];
          for (let x = 2; x <= 10; x++) for (let y = x; y <= 10; y++) for (const s of [1, -1]) {
            const z = Math.sqrt(x * x + y * y - s * x * y);
            if (Number.isInteger(z) && z !== x && z !== y) ternas.push([x, y, z, s > 0 ? 60 : 120]);
          }
          const [bv, cv, av, Ad] = rr.uno(ternas);
          return {
            pregunta: ['Un triángulo tiene lados ', a, ` = ${f(av)}, `, b, ` = ${f(bv)} y `, c, ` = ${f(cv)}. ¿Cuánto mide el ángulo `, A, ', opuesto a a?'],
            opciones: opciones(Ad, [
              { id: 'suple', valor: 180 - Ad, error: 'LC-SUPLE', siFuera: 'Ese ángulo tiene el coseno con el signo cambiado. Revisa el signo de b² + c² − a².' },
              { id: 'recto', valor: 90, error: 'TR25', siFuera: 'Sería cierto si a² = b² + c². Aquí no se cumple: el triángulo no es rectángulo.' },
              { id: 'otro', valor: Ad === 60 ? 30 : 150, error: 'LC-SENO', siFuera: 'Ese ángulo tiene seno 1/2. La ley de cosenos da el coseno, no el seno.' },
            ], v => `${f(v)}°`),
            solucion: { texto: 'Se despeja el coseno de la ley de cosenos.', ecuacion: ['cos ', A, ' = ', { frac: [`${bv * bv} + ${cv * cv} − ${av * av}`, `2 · ${bv} · ${cv}`] }, ` = ${f(cos(Ad), 1)}  ⇒  `, A, ` = ${f(Ad)}°`] },
          };
        }
        const bv = rr.ent(3, 9), cv = rr.ent(3, 9), Ad = rr.uno([60, 120]), N = bv * bv + cv * cv - 2 * bv * cv * cos(Ad);
        const Nr = Math.round(N);
        return {
          pregunta: ['Dos lados de un triángulo miden ', b, ` = ${f(bv)} y `, c, ` = ${f(cv)}, y el ángulo entre ellos es `, A, ` = ${f(Ad)}°. ¿Cuánto mide `, a, '?'],
          opciones: opciones(raizTxt(Nr), [
            { id: 'pita', valor: raizTxt(bv * bv + cv * cv), error: 'TR24', siFuera: `Sería cierto con A = 90°. Con ${f(Ad)}°, el término 2bc cos A no es cero.` },
            { id: 'signo', valor: raizTxt(Math.round(bv * bv + cv * cv + 2 * bv * cv * cos(Ad))), error: 'TR24', siFuera: 'El término lleva el signo del coseno. Así sería con el ángulo suplementario.' },
            { id: 'suma', valor: f(bv + cv), error: 'LC-SUMA', siFuera: 'b + c sería a solo con A = 180°, sin triángulo.' },
          ], v => v),
          solucion: { texto: `cos ${f(Ad)}° = ${f(cos(Ad), 1)}: el término ${Ad < 90 ? 'resta' : 'suma'}.`, ecuacion: [{ sup: [a, '2'] }, ` = ${bv * bv} + ${cv * cv} − 2 · ${bv} · ${cv} · (${f(cos(Ad), 1)}) = ${Nr}`] },
        };
      },
    },
  };

  // ---------- Idea 4: la base es la suma de dos sombras ----------
  // Cambia: los ángulos A y B, con la base c fija. · Permanece: la base y la altura que cae desde C.
  // Progresa: las dos sombras b cos A y a cos B que llenan la base. · Se reserva: B obtuso, con la sombra que
  // cae hacia afuera (la predicción). · Debe verse: que la sombra de a se resta sola, por el signo de cos B.
  const triLP = (Ad, Bd, cv, o = {}) => {
    const bv = cv * sen(Bd) / sen(180 - Ad - Bd), av = cv * sen(Ad) / sen(180 - Ad - Bd);
    const Hx = bv * cos(Ad), Cy = bv * sen(Ad), pa = o.paso || 0;
    return {
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A' }, { id: 'B', x: cv, y: 0, rotulo: 'B' }, { id: 'C', x: Hx, y: Cy, rotulo: 'C' }, { id: 'H', x: Hx, y: 0, rotulo: pa ? 'H' : '', paso: pa }],
      lados: [{ de: 'A', a: 'B', color: 'd', texto: `c = ${f(cv)}` }, { de: 'A', a: 'C', color: 'i', texto: 'b' }, { de: 'B', a: 'C', color: 'o', texto: 'a' },
        { de: 'C', a: 'H', visual: true, paso: pa }, ...(Hx > cv ? [{ de: 'B', a: 'H', horizontal: true, paso: pa }] : [])],
      angulos: [{ en: 'A', de: 'B', a: 'C', texto: `${f(Ad)}°`, color: 'o' }, { en: 'B', de: 'A', a: 'C', texto: `${f(Bd)}°`, color: 'i' }, { en: 'H', de: 'A', a: 'C', paso: pa }],
      cotas: [{ de: 'A', a: 'H', color: 'i', texto: 'b cos A', dist: 32, paso: o.s1 === undefined ? pa : o.s1 },
        { de: 'H', a: 'B', color: 'o', texto: 'a cos B', dist: 56, paso: o.s2 === undefined ? pa : o.s2 }],
      av, bv,
    };
  };
  const proyecciones = {
    id: 'proyecciones-tangentes',
    titulo: 'La base, suma de dos sombras',
    temas: ['Leyes de proyecciones y de tangentes'],
    pieza: 'triangulo',
    juega: {
      consigna: 'La base c mide 6. Cambia A y B: la altura desde C parte la base en dos sombras, de b y de a.',
      voz: 'Suma las dos sombras y compáralas con la base.',
      controles: [
        { id: 'A', etiqueta: 'A', color: 'c-o', min: 30, max: 60, paso: 10, inicio: 40, unidad: '°', decimales: 0 },
        { id: 'B', etiqueta: 'B', color: 'c-i', min: 30, max: 60, paso: 10, inicio: 60, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: triLP(val.A, val.B, 6), estado: {} }),
      lectura: val => {
        const t = triLP(val.A, val.B, 6);
        return [b, ' cos ', A, ' + ', a, ' cos ', B, ` ≈ ${f(t.bv * cos(val.A))} + ${f(t.av * cos(val.B))} = 6`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora B mide 110°: el pie de la altura cae fuera de la base, más allá de B. ¿Sigue valiendo c = b cos A + a cos B?',
      voz: 'Piensa qué pasa con el signo del coseno de un ángulo obtuso.',
      opciones: [
        { id: 'c', texto: 'Sí: a cos B es negativo y se resta solo', correcta: true },
        { id: 'resta', texto: 'No: ahora hay que escribir c = b cos A − a cos B', error: 'LP-SIGNO', siFuera: 'Bien que la sombra de a se resta. Pero cos B ya es negativo: restarlo otra vez la suma.' },
        { id: 'agudo', texto: 'No: solo vale si los ángulos son agudos', error: 'LP-AGUDO', siFuera: 'Con ángulos agudos las sombras caen dentro. Con B obtuso la fórmula sigue, por el signo de cos B.' },
      ],
      dibujo: { datos: triLP(35, 110, 6, { paso: 9 }), estado: { paso: 0 } },
      revelar: { datos: triLP(35, 110, 6), estado: {} },
      coincide: `Coincide: la sombra de a mide ${f(triLP(35, 110, 6).av * cos(110))} y la suma sigue dando 6.`,
      noCoincide: 'Revisemos las dos sombras con su signo.',
    },
    mira: (() => {
      const t = triLP(35, 110, 6, { paso: 1, s1: 2, s2: 3 });
      return {
        datos: t,
        voz: 'Una sombra por paso; el signo viene del coseno.',
        pasos: [
          { estado: { paso: 1 }, texto: 'La altura desde C cae fuera, más allá de B.', ecuacion: [A, ' = 35°;  ', B, ' = 110°'] },
          { estado: { paso: 2 }, texto: 'La sombra de b sobre la base va de A a H.', ecuacion: ['AH = ', b, ` cos 35° ≈ ${f(t.bv * cos(35))}`] },
          { estado: { paso: 3 }, texto: 'La sombra de a va de B a H, hacia atrás.', ecuacion: [a, ` cos 110° ≈ ${f(t.av * cos(110))}`] },
          { estado: { paso: 3 }, texto: 'La base es la suma de las dos, con su signo.', ecuacion: [c, ` ≈ ${f(t.bv * cos(35))} + (${f(t.av * cos(110))}) = 6`] },
          { estado: { paso: 3 }, texto: 'Con la ley de senos, a y b pasan a senos.', ecuacion: [{ frac: [[a, ' − ', b], [a, ' + ', b]] }, ' = ', { frac: [['sen ', A, ' − sen ', B], ['sen ', A, ' + sen ', B]] }] },
          { estado: { paso: 3 }, texto: 'Suma a producto da la ley de tangentes.', ecuacion: [{ frac: [[a, ' − ', b], [a, ' + ', b]] }, ' = ', { frac: [['tan ', { frac: [[A, ' − ', B], '2'] }], ['tan ', { frac: [[A, ' + ', B], '2'] }]] }] },
        ],
      };
    })(),
    regla: {
      texto: 'Cada lado es la suma de las sombras de los otros dos sobre él. La diferencia de dos lados sobre su suma se lee con tangentes de semiángulos.',
      ecuacion: [c, ' = ', a, ' cos ', B, ' + ', b, ' cos ', A, ';   ', { frac: [[a, ' − ', b], [a, ' + ', b]] }, ' = ', { frac: [['tan ', { frac: [[A, ' − ', B], '2'] }], ['tan ', { frac: [[A, ' + ', B], '2'] }]] }],
      condicion: 'Las sombras llevan el signo del coseno: con ángulo obtuso, se restan. En las dos leyes, a se opone a A.',
      voz: 'Una sombra negativa no es un error: dice hacia dónde cae.',
    },
    ahoraTu: {
      voz: 'Revisa si algún ángulo es obtuso antes de sumar.',
      generar(sem) {
        const rr = azar(sem);
        if (sem % 2) {
          const bv = rr.ent(3, 8), av = bv + rr.ent(1, 6), Cd = rr.uno([40, 60, 80, 100]);
          const k = (av - bv) / (av + bv), bien = k / tan(Cd / 2);
          return {
            pregunta: ['En un triángulo, ', a, ` = ${f(av)}, `, b, ` = ${f(bv)} y `, C, ` = ${f(Cd)}°. ¿Cuánto vale tan((A − B)/2)?`],
            opciones: opciones(bien, [
              { id: 'sin', valor: k, error: 'LT-SIN-TAN', siFuera: 'Ese es el lado izquierdo, (a − b)/(a + b). Falta multiplicar por tan((A + B)/2).' },
              { id: 'tan', valor: k * tan(Cd / 2), error: 'LT-TAN', siFuera: `(A + B)/2 no es C/2: es 90° − C/2 = ${f(90 - Cd / 2)}°.` },
              { id: 'inversa', valor: 1 / bien, error: 'LT-INVERSA', siFuera: 'La fracción está invertida: la diferencia de lados va arriba.' },
            ], v => f(v, 3)),
            solucion: { texto: `(A + B)/2 = 90° − C/2 = ${f(90 - Cd / 2)}°.`, ecuacion: [`tan((A − B)/2) = ${f(k, 3)} · tan ${f(90 - Cd / 2)}° ≈ ${f(bien, 3)}`] },
          };
        }
        const Ad = rr.uno([30, 45, 60]);
        let Bd;
        do Bd = rr.uno([30, 45, 60, 100, 120, 135]); while (Ad + Bd >= 170 || Bd === Ad);
        const bv = rr.ent(4, 12), av = Math.round(bv * sen(Ad) / sen(Bd) * 100) / 100, cv = av * cos(Bd) + bv * cos(Ad);
        return {
          pregunta: ['En un triángulo, ', a, ` = ${f(av)}, `, b, ` = ${f(bv)}, `, A, ` = ${f(Ad)}° y `, B, ` = ${f(Bd)}°. ¿Cuánto mide el lado `, c, '?'],
          opciones: opciones(cv, [
            { id: 'abs', valor: Math.abs(av * cos(Bd)) + bv * cos(Ad), error: 'LP-SIGNO', siFuera: Bd > 90 ? 'Bien las dos sombras. Pero B es obtuso: su sombra cae hacia afuera y se resta.' : 'Esa suma vale con ángulos agudos; aquí los dos lo son, revisa los cosenos.' },
            { id: 'cruzado', valor: av * cos(Ad) + bv * cos(Bd), error: 'LP-AGUDO', siFuera: 'Cada lado se proyecta con su ángulo en la base: b con A, a con B.' },
            { id: 'suma', valor: av + bv, error: 'LC-SUMA', siFuera: 'a + b sería c solo si el triángulo se aplanara.' },
          ], v => f(v)),
          solucion: { texto: 'La base es la suma de las dos sombras, con su signo.', ecuacion: [c, ` = ${f(av)} · cos ${f(Bd)}° + ${f(bv)} · cos ${f(Ad)}° ≈ ${f(cv)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: el rumbo se mide desde el norte o el sur ----------
  // Cambia: el ángulo θ del rumbo y el cuadrante (N–E, N–O, S–E, S–O). · Permanece: la rosa de los vientos con
  // N arriba y E a la derecha. · Progresa: el arco que siempre nace en el norte o en el sur. · Se reserva: un viaje
  // de dos tramos y el ángulo interior en el giro (la predicción). · Debe verse: que el ángulo del triángulo se
  // arma con los rumbos y las líneas norte-sur, no se lee directo.
  const estandar = (ns, t, eo) => (ns === 'N' ? (eo === 'E' ? 90 - t : 90 + t) : (eo === 'E' ? -90 + t : -90 - t));
  const rumboTxt = (ns, t, eo) => `${ns} ${f(t)}° ${eo}`;
  const rosa = (ns, t, eo) => {
    const g = estandar(ns, t, eo);
    return {
      ventana: { x: [-1.4, 1.4], y: [-1.4, 1.4] }, nombres: ['E', 'N'],
      circulos: [{ r: 1, discontinua: true }],
      rayos: [{ ang: g, largo: 1, color: 'h', rotulo: rumboTxt(ns, t, eo) }],
      arcos: [{ de: ns === 'N' ? 90 : -90, a: g, r: 0.45, color: 'h', rotulo: `${f(t)}°` }],
      rotulos: [{ x: -1.32, y: 0.08, texto: 'O' }, { x: -0.1, y: -1.35, texto: 'S' }],
      alt: `Rosa de los vientos: rumbo ${rumboTxt(ns, t, eo)}, ${f(t)} grados medidos desde el ${ns === 'N' ? 'norte' : 'sur'} hacia el ${eo === 'E' ? 'este' : 'oeste'}`,
    };
  };
  // Viaje: de A con rumbo r1 y largo b hasta C; de C con rumbo r2 y largo a hasta B.
  function viaje(r1, bv, r2, av) {
    const g1 = estandar(...r1), g2 = estandar(...r2);
    const Cp = P(bv, g1), Bp = P(av, g2, Cp[0], Cp[1]);
    const ang = Math.abs(((dir(Cp, [0, 0]) - g2 + 540) % 360) - 180);
    const cv = Math.hypot(Bp[0], Bp[1]);
    return { Cp, Bp, g1, g2, ang, cv };
  }
  // Rótulo de un tramo, a un lado de su punto medio, del lado contrario al tercer vértice.
  function lado(P1, P2, Opp, texto, color, dist, desde) {
    const mx = (P1[0] + P2[0]) / 2, my = (P1[1] + P2[1]) / 2, L = Math.hypot(P2[0] - P1[0], P2[1] - P1[1]) || 1;
    let nx = -(P2[1] - P1[1]) / L, ny = (P2[0] - P1[0]) / L;
    if (nx * (Opp[0] - mx) + ny * (Opp[1] - my) > 0) { nx = -nx; ny = -ny; }
    return { x: mx + nx * dist, y: my + ny * dist - (ny < -0.4 ? 0.04 * dist * 10 : 0), texto, color, ancla: nx > 0.3 ? 'start' : nx < -0.3 ? 'end' : 'middle', desde };
  }
  function viajeDatos(r1, bv, r2, av, o = {}) {
    const v = viaje(r1, bv, r2, av), xs = [0, v.Cp[0], v.Bp[0]], ys = [0, v.Cp[1], v.Bp[1]];
    const M = Math.max(bv, av), m = 0.22 * M, x0 = Math.min(...xs) - m, x1 = Math.max(...xs) + m, y0 = Math.min(...ys) - m, y1 = Math.max(...ys) + m;
    const d = o.desde || {};
    return {
      ejes: false, ventana: { x: [x0, x1], y: [y0, y1] },
      segmentos: [
        { de: [0, y0 + 0.05 * m], a: [0, y1 - 0.05 * m], discontinua: true, desde: d.n1 || 0 },
        { de: [v.Cp[0], y0 + 0.05 * m], a: [v.Cp[0], y1 - 0.05 * m], discontinua: true, desde: d.n2 || 0 },
        { de: [0, 0], a: v.Cp, color: 'i', punta: true, desde: d.t1 || 0 },
        { de: v.Cp, a: v.Bp, color: 'o', punta: true, desde: d.t2 || 0 },
        { de: [0, 0], a: v.Bp, color: 'd', discontinua: true, desde: d.c || 0 },
      ],
      arcos: [
        { cx: 0, cy: 0, de: r1[0] === 'N' ? 90 : -90, a: v.g1, r: 0.15 * M, color: 'h', rotulo: `${f(r1[1])}°`, desde: d.t1 || 0 },
        { cx: v.Cp[0], cy: v.Cp[1], de: r2[0] === 'N' ? 90 : -90, a: v.g2, r: 0.1 * M, color: 'h', rotulo: `${f(r2[1])}°`, desde: d.t2 || 0 },
        Object.assign(angulo(v.Cp, [0, 0], v.Bp, 0.27 * M, 'd', o.angRot === undefined ? `C = ${f(v.ang)}°` : o.angRot), { desde: d.ang || 0 }),
        { cx: v.Cp[0], cy: v.Cp[1], de: r1[0] === 'N' ? -90 : 90, a: dir(v.Cp, [0, 0]), r: 0.1 * M, color: 'i', rotulo: `${f(r1[1])}°`, flecha: false, espiral: 0, desde: d.alt === undefined ? 99 : d.alt },
      ],
      rotulos: [{ x: 0, y: y1 - 0.02 * m, texto: 'N', desde: d.n1 || 0 }, { x: -0.06 * m, y: -0.12 * m, texto: 'A', ancla: 'end' },
        { x: v.Cp[0] + 0.08 * m, y: v.Cp[1] + 0.1 * m, texto: 'C', ancla: 'start' }, { x: v.Bp[0] + 0.08 * m, y: v.Bp[1], texto: 'B', ancla: 'start' },
        lado([0, 0], v.Cp, v.Bp, `b = ${f(bv)} km`, 'i', 0.1 * M, d.t1 || 0), lado(v.Cp, v.Bp, [0, 0], `a = ${f(av)} km`, 'o', 0.1 * M, d.t2 || 0),
        ...(o.cRot ? [lado([0, 0], v.Bp, v.Cp, o.cRot, 'd', 0.1 * M, d.c || 0)] : [])],
      alt: `Viaje de A a C con rumbo ${rumboTxt(...r1)} y de C a B con rumbo ${rumboTxt(...r2)}; el ángulo en C mide ${f(v.ang)} grados`,
    };
  }
  const rumbos = {
    id: 'rumbos',
    titulo: 'Rumbo: desde norte o sur',
    temas: ['Ángulos horizontales y rumbos'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige el ángulo y hacia dónde se abre. El rumbo se mide desde el norte o el sur, girando hacia el este o el oeste.',
      voz: 'Conservemos la línea norte-sur como lado inicial del rumbo.',
      controles: [
        { id: 't', etiqueta: 'θ', color: 'c-h', min: 10, max: 80, paso: 10, inicio: 30, unidad: '°', decimales: 0 },
        { id: 'q', etiqueta: 'Hacia', opciones: [{ valor: 'NE', texto: 'N…E' }, { valor: 'NO', texto: 'N…O' }, { valor: 'SE', texto: 'S…E' }, { valor: 'SO', texto: 'S…O' }] },
      ],
      dibujo: val => ({ datos: rosa(val.q[0], val.t, val.q[1]), estado: {} }),
      lectura: val => [`${rumboTxt(val.q[0], val.t, val.q[1])}: `, th, ` = ${f(val.t)}° desde el ${val.q[0] === 'N' ? 'norte' : 'sur'}`],
      minimo: 3,
    },
    predice: (() => {
      const r1 = ['N', 40, 'E'], r2 = ['S', 70, 'E'];
      return {
        pregunta: 'Un bote va de A a C con rumbo N 40° E. En C gira y sigue con rumbo S 70° E hasta B. ¿Cuánto mide el ángulo ACB del recorrido?',
        voz: 'Dibuja la línea norte-sur también en C.',
        opciones: [
          { id: 'c', texto: '110°', correcta: true },
          { id: 'resta', texto: '30°', error: 'RUMBO-RESTA', siFuera: 'Restar compara los rumbos desde líneas distintas. En C, uno nace en el sur y el otro llega del sur.' },
          { id: 'exterior', texto: '70°', error: 'RUMBO-EXTERIOR', siFuera: 'Eso mide cuánto gira el bote: el ángulo exterior. El interior es 180° menos ese giro.' },
          { id: 'suma', texto: '150°', error: 'RUMBO-SUMA', siFuera: 'Eso mide desde el este. Los dos rumbos se miden desde la línea norte-sur.' },
        ],
        dibujo: { datos: viajeDatos(r1, 5, r2, 4, { angRot: 'C = ?', desde: { c: 9 } }), estado: {} },
        revelar: { datos: viajeDatos(r1, 5, r2, 4, { desde: { alt: 0, c: 9 } }), estado: {} },
        coincide: 'Coincide: 40° del regreso a A más 70° del nuevo rumbo.',
        noCoincide: 'Revisemos con la línea norte-sur dibujada en C.',
      };
    })(),
    mira: (() => {
      const v = viaje(['N', 40, 'E'], 5, ['S', 70, 'E'], 4);
      return {
        datos: viajeDatos(['N', 40, 'E'], 5, ['S', 70, 'E'], 4, { cRot: `c ≈ ${f(v.cv)} km`, desde: { n1: 1, t1: 1, n2: 2, alt: 3, t2: 4, ang: 5, c: 6 } }),
        voz: 'Cada rumbo, desde su propia línea norte-sur.',
        pasos: [
          { estado: { corte: 1 }, texto: 'En A, el rumbo N 40° E se mide desde el norte.', ecuacion: [th, ' = 40°'] },
          { estado: { corte: 2 }, texto: 'En C se dibuja otra línea norte-sur, paralela.', ecuacion: ['N–S en A ∥ N–S en C'] },
          { estado: { corte: 3 }, texto: 'Mirando de vuelta a A, el rumbo es S 40° O.', ecuacion: ['ángulos alternos: 40°'] },
          { estado: { corte: 4 }, texto: 'El nuevo rumbo S 70° E se mide desde el sur.', ecuacion: [th, ' = 70°'] },
          { estado: { corte: 5 }, texto: 'Los dos están a lados opuestos del sur: se suman.', ecuacion: [C, ' = 40° + 70° = 110°'] },
          { estado: { corte: 6 }, texto: 'Con el ángulo interior, la ley de cosenos da AB.', ecuacion: [{ sup: [c, '2'] }, ` = 25 + 16 − 40 cos 110° ≈ ${f(v.cv * v.cv)}`] },
        ],
      };
    })(),
    regla: {
      texto: 'Un rumbo es un ángulo agudo medido desde el norte o el sur hacia el este o el oeste. El ángulo interior se arma con rumbos y líneas norte-sur.',
      ecuacion: ['N ', th, ' E:  ', th, ' desde el norte hacia el este'],
      condicion: 'Las líneas norte-sur de todos los puntos son paralelas; θ va de 0° a 90°.',
      voz: 'Primero traduce el rumbo; después elige la ley.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Traza la línea norte-sur en el punto de giro.',
      generar(sem) {
        const rr = azar(sem);
        const t1 = rr.uno([20, 30, 40, 50, 60]), t2 = rr.uno([20, 30, 40, 50, 60, 70].filter(x => x !== t1));
        const r1 = ['N', t1, 'E'], r2 = sem % 3 === 0 ? ['S', t2, 'E'] : sem % 3 === 1 ? ['N', t2, 'O'] : ['S', t2, 'O'];
        if (r2[0] === 'S' && r2[2] === 'O' && t2 <= t1) r2[1] = t1 + 20;
        const bv = rr.ent(3, 9), av = rr.ent(3, 9), v = viaje(r1, bv, r2, av);
        const dibujo = { datos: viajeDatos(r1, bv, r2, av, { angRot: 'C = ?', desde: { c: 9 } }), estado: {} };
        if (sem % 2) {
          return {
            pregunta: ['Un dron vuela ', b, ` = ${f(bv)} km con rumbo ${rumboTxt(...r1)} hasta C, y luego `, a, ` = ${f(av)} km con rumbo ${rumboTxt(...r2)}. ¿Cuánto mide el ángulo en C?`],
            dibujo,
            opciones: opciones(v.ang, [
              { id: 'resta', valor: Math.abs(t1 - r2[1]), error: 'RUMBO-RESTA', siFuera: 'Restar sirve si los dos rumbos nacen del mismo lado de la línea en C. Revisa desde dónde.' },
              { id: 'exterior', valor: 180 - v.ang, error: 'RUMBO-EXTERIOR', siFuera: 'Ese es el giro del dron en C. El ángulo del triángulo es su suplemento.' },
              { id: 'suma', valor: t1 + r2[1], error: 'RUMBO-SUMA', siFuera: 'Sumar sirve si quedan a lados opuestos del sur en C. Revisa el dibujo.' },
            ], x => `${f(x)}°`),
            solucion: { texto: `El regreso a A es S ${f(t1)}° O; se compara con ${rumboTxt(...r2)}.`, ecuacion: [C, ` = ${f(v.ang)}°`], dibujo: { datos: viajeDatos(r1, bv, r2, av, { desde: { alt: 0, c: 9 } }), estado: {} } },
          };
        }
        const ext = Math.sqrt(av * av + bv * bv - 2 * av * bv * cos(180 - v.ang));
        return {
          pregunta: ['Un dron vuela ', b, ` = ${f(bv)} km con rumbo ${rumboTxt(...r1)} hasta C, y luego `, a, ` = ${f(av)} km con rumbo ${rumboTxt(...r2)}. ¿A qué distancia `, c, ' queda del inicio?'],
          dibujo,
          opciones: opciones(v.cv, [
            { id: 'pita', valor: Math.hypot(av, bv), error: 'TR25', siFuera: `Pitágoras vale si el ángulo en C mide 90°. Aquí mide ${f(v.ang)}°.` },
            { id: 'exterior', valor: ext, error: 'RUMBO-EXTERIOR', siFuera: 'Eso usa el giro del dron. La ley de cosenos pide el ángulo interior en C.' },
            { id: 'suma', valor: av + bv, error: 'LC-SUMA', siFuera: 'a + b es lo que vuela el dron, no la distancia en línea recta.' },
          ], x => `${f(x)} km`),
          solucion: { texto: `El ángulo interior en C mide ${f(v.ang)}°; después, ley de cosenos.`, ecuacion: [{ sup: [c, '2'] }, ` = ${bv * bv} + ${av * av} − ${2 * av * bv} cos ${f(v.ang)}° ≈ ${f(v.cv * v.cv)}`], dibujo: { datos: viajeDatos(r1, bv, r2, av, { cRot: `c ≈ ${f(v.cv)} km`, desde: { alt: 0 } }), estado: {} } },
        };
      },
    },
  };

  return {
    unidad: 'trigonometria.triangulos-oblicuangulos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js', '/nucleo/kit/piezas/triangulo.js'],
    historia: {
      texto: 'En el siglo XIII, Nasir al-Din al-Tusi ordenó en su Tratado del cuadrilátero las relaciones de senos de la trigonometría plana y esférica, heredadas de la astronomía. Su pregunta sigue viva en cada triángulo oblicuángulo: ¿qué datos bastan para reconstruir la figura? A veces dos lados y un ángulo dejan dos respuestas posibles.',
      pregunta: '¿Tres datos bastan siempre para dibujar un solo triángulo?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Nasir al-Din al-Tusi», MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Al-Tusi_Nasir/' },
    },
    ideas: [senos, ambiguo, cosenos, proyecciones, rumbos],
  };
});
