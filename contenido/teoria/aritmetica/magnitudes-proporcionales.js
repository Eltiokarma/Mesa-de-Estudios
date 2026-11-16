/*
 * Teoría de «Magnitudes proporcionales y reparto» (aritmetica.magnitudes-proporcionales). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 4) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR6–AR10 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: reconocer si dos magnitudes conservan el cociente (directa) o el producto (inversa) antes de operar.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja de 360 px, en el aula o en la combi, sin audio.
 *   Resultado observable: resuelve regla de tres simple y compuesta, repartos directos e inversos y regla de compañía.
 *   Orden de atención: 1.º la gráfica o las tiras · 2.º lo que se mantiene (cociente, producto, obra, total) · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · predicción elegida · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿cuándo la regla de tres se hace en cruz y cuándo al revés?».
 * Colores (regla 4): x naranja (c-o), y turquesa (c-i), la constante k verde (c-d); en el reparto, cada parte con su
 * color (c-o, c-i, c-h) y el total T en verde (c-d).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const sol = n => `S/ ${f(n)}`;   // espacio duro: «S/» no se separa de su número
  const x = { v: 'c-o', t: 'x' }, y = { v: 'c-i', t: 'y' }, k = { v: 'c-d', t: 'k' }, T = { v: 'c-d', t: 'T' };
  const wi = { sub: ['w', 'i'] };
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
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor < 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const COL = ['o', 'i', 'h'];
  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría de la pieza (ejes.X/Y, arit-tiras.x/deX).
  const EJES = () => Kit.piezas.ejes, TIRAS = () => Kit.piezas['arit-tiras'];
  const inversa = (escala, p, q) => px => p + (px - escala(p)) * (q - p) / (escala(q) - escala(p));
  // Manija en el borde de abajo de la tira k, en el valor dado (no tapa el rótulo final, que va a media altura).
  const enTira = (datos, k, valor) => { const g = TIRAS().geometria(datos); return { x: g.x(valor), y: g.tiraY(k) + g.altoTira }; };
  const valorEn = (datos, px) => TIRAS().geometria(datos).deX(px);

  // ---------- Idea 1: directa conserva el cociente; inversa, el producto ----------
  // Cambia: x, y el tipo de relación. Permanece: k = 24 (cociente 4 o producto 24) y los ejes.
  // Progresa: el punto recorre la recta por el origen o la curva; el rectángulo x · y no cambia de área.
  // Se reserva: los obreros, donde «más obreros» da «menos días». Debe verse: el área del rectángulo es siempre 24.
  const curvaInversa = (K, x0, x1) => Array.from({ length: 41 }, (_, i) => { const u = x0 + (x1 - x0) * i / 40; return [u, K / u]; });
  const planoJuego = (tipo, xv) => {
    const yv = tipo === 'directa' ? 4 * xv : 24 / xv;
    return {
      x: { min: 0, max: 6, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: 0, max: 24, paso: 4, nombre: 'y', decimales: 0, color: 'i' },
      curvas: [{ puntos: tipo === 'directa' ? [[0, 0], [6, 24]] : curvaInversa(24, 1, 6), color: 'i' }],
      areas: tipo === 'inversa' ? [{ puntos: [[0, yv], [xv, yv]], color: 'd', rotulo: `${f(xv)} · ${f(yv)} = 24` }] : [],
      puntos: [{ x: xv, y: yv, color: 'i', rotulo: `(${f(xv)}; ${f(yv)})`, guias: true }],
      compacto: true,
    };
  };
  const obreros = (corte = {}) => ({
    x: { min: 0, max: 24, paso: 4, nombre: 'obreros', decimales: 0, color: 'o' },
    y: { min: 0, max: 30, paso: 5, nombre: 'días', decimales: 0, color: 'i' },
    curvas: [{ puntos: curvaInversa(180, 6, 24), color: 'i', desde: corte.curva || 0 }],
    areas: [
      { puntos: [[0, 15], [12, 15]], color: 'd', desde: corte.a1 || 0 },
      { puntos: [[0, 9], [20, 9]], color: 'h', desde: corte.a2 === undefined ? 0 : corte.a2 },
    ],
    puntos: [{ x: 12, y: 15, color: 'd', rotulo: '15 días', guias: true, desde: corte.a1 || 0 }, { x: 20, y: 9, color: 'h', rotulo: '9 días', guias: true, desde: corte.a2 === undefined ? 0 : corte.a2 }],
    compacto: true,
  });
  // Los casos de «Ahora tú» y «Así se resuelve» (los mismos textos y cuentas). Credibilidad (ronda 6): la «combi» a
  // 2–12 km/h por hasta 180 horas pasó a una tortuga en metros por minuto; el «auto» de 2 km por litro, a un camión.
  const CASOS_DI = [
    { tipo: 'inversa', a: 'obreros', b: 'días', t: (p, q) => `${p} obreros hacen una obra en ${q} días. Al mismo ritmo, ¿en cuántos días la hacen `,
      regla: 'Con más obreros la obra se termina antes: obreros y días son inversamente proporcionales. Su producto, la obra, no cambia.' },
    { tipo: 'inversa', a: 'm por minuto', b: 'minutos', t: (p, q) => `Una tortuga avanza ${p} m por minuto y tarda ${q} minutos. Por el mismo camino, ¿cuántos minutos tarda a `,
      regla: 'Más rápido se llega antes: rapidez y tiempo son inversamente proporcionales. Su producto, el largo del camino, no cambia.' },
    { tipo: 'directa', a: 'kg', b: 'soles', t: (p, q) => `${p} kg de papa cuestan ${q} soles. Al mismo precio, ¿cuántos soles cuestan `,
      regla: 'Al mismo precio, el doble de kilos cuesta el doble: kilos y soles son directamente proporcionales. Su cociente, el precio del kilo, no cambia.' },
    { tipo: 'directa', a: 'litros', b: 'km', t: (p, q) => `Con ${p} litros un camión recorre ${q} km. Al mismo rendimiento, ¿cuántos km recorre con `,
      regla: 'Con el mismo rendimiento, el doble de litros alcanza para el doble de km: son directamente proporcionales. Su cociente no cambia.' },
  ];
  const directaInversa = {
    id: 'directa-inversa',
    titulo: 'Cociente fijo o producto fijo',
    temas: ['Magnitudes directa e inversamente proporcionales', 'Gráficas de proporcionalidad'],
    pieza: 'ejes',
    // Lee: qué es una magnitud y los dos nombres, sin decir de qué tipo son obreros y días (eso es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Cosas que se miden', texto: 'Los kilos de papa que compras en el mercado, los soles que pagas, las horas de viaje de Juliaca a Puno: todo eso se mide y puede cambiar. Cada una es una magnitud.' },
        { titulo: 'Dos maneras de ir juntas', texto: 'Si al duplicar una magnitud la otra también se duplica, son directamente proporcionales. Si la otra queda en la mitad, son inversamente proporcionales. Hay pares que no son ni lo uno ni lo otro.' },
        { titulo: 'Qué mirar', texto: ['Elige la relación y mueve ', x, '. Sigue el punto turquesa por su gráfica. En la directa, fíjate en la forma de la gráfica; en la inversa, en el área del rectángulo verde.'] },
      ],
    },
    juega: {
      consigna: 'Elige el tipo de relación y mueve x. En la directa mira el cociente; en la inversa, el rectángulo verde.',
      voz: 'Compara la forma de las dos gráficas.',
      controles: [
        { id: 'tipo', etiqueta: 'Relación', opciones: [{ valor: 'directa', texto: 'Directa' }, { valor: 'inversa', texto: 'Inversa' }] },
        { id: 'x', etiqueta: 'x', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: planoJuego(v.tipo, v.x), estado: {} }),
      lectura: v => (v.tipo === 'directa' ? [y, ' ÷ ', x, ` = ${f(4 * v.x)} ÷ ${f(v.x)} = 4`] : [x, ' · ', y, ` = ${f(v.x)} · ${f(24 / v.x)} = 24`]),
      minimo: 3,
      // Se arrastra el punto por su gráfica: el dedo elige x y la gráfica da y.
      arrastres: [
        { id: 'punto', etiqueta: 'el punto sobre la gráfica', color: 'c-o',
          donde: v => { const g = EJES().geometria(planoJuego(v.tipo, v.x)); return { x: g.X(v.x), y: g.Y(v.tipo === 'directa' ? 4 * v.x : 24 / v.x) }; },
          mover: (pt, v) => ({ x: inversa(EJES().geometria(planoJuego(v.tipo, v.x)).X, 0, 6)(pt.x) }) },
      ],
    },
    predice: {
      pregunta: '12 obreros terminan una obra en 15 días. Si todos trabajan al mismo ritmo, ¿en cuántos días la terminan 20 obreros?',
      opciones: [
        { id: 'c', texto: '9 días', correcta: true },
        { id: 'directa', texto: '25 días', error: 'AR8', siFuera: 'Sería cierto si más obreros tardaran más. Con más obreros la obra se reparte.' },
        { id: 'resta', texto: '7 días', error: 'AR6', siFuera: 'Eso resta 8 días por 8 obreros más: trata la relación como una resta.' },
        { id: 'igual', texto: '15 días', error: 'AT-NO-CAMBIA', siFuera: 'Sería cierto si los obreros nuevos no trabajaran.' },
      ],
      dibujo: { datos: obreros({ a2: 9 }), estado: {} },
      revelar: { datos: obreros(), estado: {} },
      coincide: 'Coincide: la obra son 180 días-obrero, y 180 ÷ 20 = 9.',
    },
    // Hallazgo 9: «Mira» usa el mismo plano del juego (ejes): la curva de x · y = k con su rectángulo, ahora con obreros y días.
    mira: {
      datos: obreros({ curva: 3, a1: 1, a2: 2 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'La obra mide 12 obreros por 15 días: 180 días-obrero.', ecuacion: ['12 · 15 = 180'] },
        { estado: { corte: 2 }, texto: 'Con 20 obreros, la misma obra: el mismo rectángulo de área 180.', ecuacion: ['20 · d = 180 → d = 9'] },
        { estado: { corte: 3 }, texto: 'Todo par cumple x · y = 180: la gráfica es curva, no recta.', ecuacion: [x, ' · ', y, ' = 180'] },
      ],
    },
    regla: {
      texto: 'Son directamente proporcionales si su cociente es una constante k: la gráfica es una recta que pasa por el origen. Son inversamente proporcionales si el producto es la constante k.',
      ecuacion: ['directa: ', { llave: [{ frac: [y, x] }], nota: 'cociente' }, ' = ', k, '   ·   ', 'inversa: ', { llave: [x, ' · ', y], nota: 'producto' }, ' = ', k],
      condicion: 'crecer juntas no basta: y = 2x + 3 crece y no es proporcional. En la inversa, x no puede ser 0.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), c = CASOS_DI[s % 4];
        const usa = [2, 3, 4, 5, 6, 8, 10, 12];
        const p1 = r.de(usa), p2 = r.de(usa.filter(v => v !== p1));
        const P = r.de([120, 240, 360]), u = r.ent(2, 9);         // las mismas cuentas de «Ahora tú»
        const dir = c.tipo === 'directa';
        const q1v = dir ? u * p1 : P / p1, res = dir ? u * p2 : P / p2;
        const sube = p2 > p1;
        return {
          enunciado: c.t(f(p1), f(q1v)) + `${f(p2)} ${c.a}?`,
          pasos: [
            { tipo: 'pide', texto: `Piden los ${c.b} que corresponden a ${f(p2)} ${c.a}.` },
            { tipo: 'datos', texto: `Primer caso: ${f(p1)} ${c.a} con ${f(q1v)} ${c.b}. Segundo caso: ${f(p2)} ${c.a}, y no sé los ${c.b}.` },
            { tipo: 'regla', texto: c.regla, ecuacion: dir ? [{ frac: [y, x] }, ' = ', k] : [x, ' · ', y, ' = ', k] },
            { tipo: 'cuentas', texto: dir ? ['Saco ', k, ' del primer caso y lo multiplico por lo nuevo.'] : ['Saco ', k, ' del primer caso y lo divido entre lo nuevo.'],
              ecuacion: dir ? [k, ` = ${f(q1v)} ÷ ${f(p1)} = ${f(u)}   →   `, y, ` = ${f(u)} · ${f(p2)} = ${f(res)}`]
                : [k, ` = ${f(p1)} · ${f(q1v)} = ${f(P)}   →   `, y, ` = ${f(P)} ÷ ${f(p2)} = ${f(res)}`] },
            { tipo: 'sentido', texto: dir ? `Comprueba: ${f(res)} ÷ ${f(p2)} = ${f(u)}, el mismo cociente. Las dos magnitudes ${sube ? 'subieron' : 'bajaron'} juntas.`
              : `Comprueba: ${f(p2)} · ${f(res)} = ${f(P)}, el mismo producto. Una magnitud ${sube ? 'subió' : 'bajó'} y la otra ${sube ? 'bajó' : 'subió'}.` },
          ],
          respuesta: `${f(res)} ${c.b}`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const c = CASOS_DI[s % 4];
        const usa = [2, 3, 4, 5, 6, 8, 10, 12];
        const p1 = r.de(usa), p2 = r.de(usa.filter(v => v !== p1));
        const P = r.de([120, 240, 360]), u = r.ent(2, 9);         // inversa: x · y = P; directa: y = u · x
        const q1v = c.tipo === 'directa' ? u * p1 : P / p1;
        const res = c.tipo === 'directa' ? u * p2 : P / p2;
        const otro = c.tipo === 'directa' ? q1v * p1 / p2 : q1v * p2 / p1;
        return {
          pregunta: c.t(f(p1), f(q1v)) + `${f(p2)} ${c.a === 'obreros' ? 'obreros' : c.a}?`,
          opciones: opciones(res, [
            { id: 'cambia', valor: otro, error: c.tipo === 'inversa' ? 'AR8' : 'AT-INVERSA', siFuera: c.tipo === 'inversa' ? 'Eso la trata como directa; aquí se conserva el producto.' : 'Eso la trata como inversa; aquí se conserva el cociente.' },
            { id: 'resta', valor: q1v + (c.tipo === 'directa' ? 1 : -1) * (p2 - p1), error: 'AR6', siFuera: 'Eso suma la diferencia; la relación es multiplicativa.' },
            { id: 'igual', valor: q1v, error: 'AT-NO-CAMBIA', siFuera: 'Esa es la cantidad del primer caso.' },
          ], n => f(n)),
          solucion: {
            texto: c.tipo === 'directa' ? 'Directa: el cociente se mantiene.' : 'Inversa: el producto se mantiene.',
            ecuacion: c.tipo === 'directa' ? [`${f(q1v)} ÷ ${f(p1)} · ${f(p2)} = ${f(res)}`] : [`${f(p1)} · ${f(q1v)} ÷ ${f(p2)} = ${f(res)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 2: regla de tres compuesta: la obra no cambia ----------
  // Cambia: obreros y horas por día. Permanece: la obra de 120 horas-obrero.
  // Progresa: la tira de la obra se corta en días. Se reserva: el caso de 8 y 12 obreros con horas distintas.
  // Debe verse: más trabajo por día, menos días; la obra es el producto de las tres magnitudes.
  const dias = (obra, porDia, o = {}) => {
    const n = Math.floor(obra / porDia + 1e-9), resto = obra - n * porDia;
    const tramos = Array.from({ length: n }, (_, i) => ({ valor: porDia, color: i % 2 ? 'i' : 'o', relleno: 0.28, texto: o.numerar ? String(i + 1) : undefined, paso: o.paso }));
    if (resto > 1e-9) tramos.push({ valor: resto, color: 'h', relleno: 0.28, paso: o.paso });
    return tramos;
  };
  const obraDatos = (obra, porDia, o = {}) => ({
    max: obra, filas: 2,
    tiras: [
      { rotulo: o.rotObra || `obra: ${f(obra)} horas-obrero`, color: 'd', tramos: [{ valor: obra, color: 'd', relleno: 0.12 }] },
      { rotulo: o.rotDias || `un día = ${f(porDia)} horas-obrero`, color: 'i', paso: o.paso, sinContorno: true, tramos: dias(obra, porDia, { numerar: true, paso: o.paso }) },
    ],
  });
  const OBRA = 120, diasObra = v => OBRA / (v.o * v.h);
  const compuesta = {
    id: 'compuesta',
    titulo: 'La obra se reparte en días',
    temas: ['Regla de tres simple y compuesta'],
    pieza: 'arit-tiras',
    // Lee: la obra como cantidad fija y su unidad, sin decir cómo entran las horas en los días (eso es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Una obra que no cambia', texto: 'Pintar las aulas de un colegio o levantar un muro: en estos problemas la obra es siempre la misma, aunque cambien los obreros o las horas que trabajan cada día.' },
        { titulo: 'Cómo se mide el trabajo', texto: 'Si 3 obreros trabajan 4 horas, hicieron 12 horas-obrero de trabajo. Con esa unidad se mide toda la obra, como los metros miden un largo.',
          ecuacion: ['3 obreros · 4 h = 12 horas-obrero'] },
        { titulo: 'Qué mirar', texto: 'La tira verde de arriba es la obra entera. La de abajo está cortada en pedazos: cada pedazo es lo que se avanza en un día. Cambia obreros y horas, y cuenta los pedazos.' },
      ],
    },
    juega: {
      consigna: 'Una obra necesita 120 horas-obrero. Elige cuántos obreros y cuántas horas al día. Mira en cuántos días se corta la obra.',
      voz: 'Cada pedazo es lo que se avanza en un día.',
      controles: [
        { id: 'o', etiqueta: 'Obreros', color: 'c-o', min: 2, max: 6, paso: 1, inicio: 3, decimales: 0 },
        { id: 'h', etiqueta: 'Horas al día', color: 'c-i', min: 2, max: 10, paso: 2, inicio: 4, decimales: 0 },
      ],
      dibujo: v => ({ datos: obraDatos(OBRA, v.o * v.h), estado: {} }),
      lectura: v => [`${f(v.o)} · ${f(v.h)} = ${f(v.o * v.h)} por día → ${f(diasObra(v))} días`],
      minimo: 3,
      // Se arrastra el fin del primer día: alargarlo es trabajar más horas al día (con los mismos obreros).
      arrastres: [
        { id: 'fin-dia-1', etiqueta: 'fin del primer día: horas al día', color: 'c-i',
          donde: v => enTira(obraDatos(120, v.o * v.h), 1, v.o * v.h),
          mover: (pt, v) => ({ h: valorEn(obraDatos(120, v.o * v.h), pt.x) / v.o }) },
      ],
    },
    predice: {
      pregunta: '8 obreros trabajando 6 horas al día hacen una obra en 10 días. ¿En cuántos días harían la misma obra 12 obreros trabajando 5 horas al día?',
      opciones: [
        { id: 'c', texto: '8 días', correcta: true },
        { id: 'horas-directa', texto: '5,56 días', error: 'AR9', siFuera: 'Eso trata las horas por día como directas: menos horas al día darían menos días.' },
        { id: 'todo-directo', texto: '18 días', error: 'AR8', siFuera: 'Eso trata a los obreros como directos: más obreros tardarían más.' },
        { id: 'solo-obreros', texto: '6,67 días', error: 'AT-OLVIDA', siFuera: 'Eso usa solo a los obreros; las horas también cambiaron.' },
      ],
      dibujo: { datos: obraDatos(480, 60, { paso: 9, rotObra: 'obra: 8 · 6 · 10', rotDias: 'un día: 12 · 5' }), estado: {} },
      revelar: { datos: obraDatos(480, 60, { rotObra: 'obra: 8 · 6 · 10 = 480', rotDias: 'un día: 12 · 5 = 60' }), estado: {} },
      coincide: 'Coincide: 480 horas-obrero se cortan en 8 días de 60.',
    },
    mira: {
      datos: obraDatos(480, 60, { paso: 2, rotObra: 'obra: 8 · 6 · 10 = 480', rotDias: 'un día: 12 · 5 = 60' }),
      pasos: [
        { estado: { paso: 1 }, texto: 'La obra no cambia: obreros por horas por días.', ecuacion: ['8 · 6 · 10 = 480'] },
        { estado: { paso: 2 }, texto: 'Un día nuevo avanza 12 obreros por 5 horas.', ecuacion: ['12 · 5 = 60'] },
        { estado: { paso: 2 }, texto: 'Caben 8 días de 60 en la obra de 480.', ecuacion: ['d = ', { frac: ['480', '60'] }, ' = 8'] },
      ],
    },
    regla: {
      texto: 'En la regla de tres compuesta, si la obra es la misma, obreros por horas diarias por días da lo mismo. Cada magnitud que trabaja es inversa a los días.',
      ecuacion: [{ llave: [{ sub: ['o', '1'] }, { sub: ['h', '1'] }, { sub: ['d', '1'] }], nota: 'la obra' }, ' = ', { llave: [{ sub: ['o', '2'] }, { sub: ['h', '2'] }, { sub: ['d', '2'] }], nota: 'la misma obra' }],
      condicion: 'todos rinden igual y la obra no cambia. Si la obra se duplica, los días se duplican: obra y días son directas.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), o1 = r.de([4, 6, 8, 10, 12]), h1 = r.de([4, 6, 8]), d1 = r.de([6, 9, 10, 12, 15]);
        const o2 = r.de([3, 4, 5, 6, 8, 12, 15, 16, 20].filter(v => v !== o1)), h2 = r.de([4, 5, 6, 8, 10].filter(v => v !== h1));
        const W = o1 * h1 * d1, D = o2 * h2, res = W / D;
        return {
          enunciado: `${o1} obreros, a ${h1} horas diarias, hacen una obra en ${d1} días. ¿En cuántos días la harían ${o2} obreros a ${h2} horas diarias?`,
          dibujo: { datos: obraDatos(W, D, { paso: 9, rotObra: `obra: ${o1} · ${h1} · ${d1}`, rotDias: `un día: ${o2} · ${h2}` }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden los días que tardan ${o2} obreros si trabajan ${h2} horas cada día.` },
            { tipo: 'datos', texto: `Antes: ${o1} obreros, ${h1} horas al día, ${d1} días. Ahora: ${o2} obreros, ${h2} horas al día. La obra es la misma.` },
            { tipo: 'regla', texto: 'La obra se mide en horas-obrero: obreros por horas de cada día por días. Como es la misma obra, ese producto da igual en los dos casos.',
              ecuacion: [{ sub: ['o', '1'] }, { sub: ['h', '1'] }, { sub: ['d', '1'] }, ' = ', { sub: ['o', '2'] }, { sub: ['h', '2'] }, { sub: ['d', '2'] }] },
            { tipo: 'cuentas', texto: 'Mido la obra, mido lo que se avanza en un día nuevo y divido.',
              ecuacion: [`${o1} · ${h1} · ${d1} = ${f(W)}   ·   ${o2} · ${h2} = ${f(D)}   →   d = ${f(W)} ÷ ${f(D)} = ${f(res)}`],
              dibujo: { datos: obraDatos(W, D, { rotObra: `obra: ${f(W)} horas-obrero`, rotDias: `un día = ${f(D)} horas-obrero` }), estado: {} } },
            { tipo: 'sentido', texto: `Comprueba: ${o2} · ${h2} · ${f(res)} = ${f(D * res)} horas-obrero, la misma obra. ${D > o1 * h1 ? 'Se avanza más por día: menos días.' : 'Se avanza menos por día: más días.'}` },
          ],
          respuesta: `${f(res)} días`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), o1 = r.de([4, 6, 8, 10, 12]), h1 = r.de([4, 6, 8]), d1 = r.de([6, 9, 10, 12, 15]);
        const o2 = r.de([3, 4, 5, 6, 8, 12, 15, 16, 20].filter(v => v !== o1)), h2 = r.de([4, 5, 6, 8, 10].filter(v => v !== h1));
        const res = o1 * h1 * d1 / (o2 * h2);
        return {
          pregunta: `${o1} obreros, a ${h1} horas diarias, hacen una obra en ${d1} días. ¿En cuántos días la harían ${o2} obreros a ${h2} horas diarias?`,
          dibujo: { datos: obraDatos(o1 * h1 * d1, o2 * h2, { paso: 9, rotObra: `obra: ${o1} · ${h1} · ${d1}`, rotDias: `un día: ${o2} · ${h2}` }), estado: {} },
          opciones: opciones(res, [
            { id: 'horas-directa', valor: d1 * o1 / o2 * h2 / h1, error: 'AR9', siFuera: 'Eso trata las horas diarias como directas a los días.' },
            { id: 'obreros-directa', valor: d1 * o2 / o1 * h1 / h2, error: 'AR8', siFuera: 'Eso trata a los obreros como directos a los días.' },
            { id: 'solo-obreros', valor: d1 * o1 / o2, error: 'AT-OLVIDA', siFuera: 'Eso usa solo a los obreros; las horas también cambiaron.' },
          ], n => `${f(n)} días`),
          solucion: {
            texto: 'La obra se divide entre lo que se avanza por día.',
            ecuacion: ['d = ', { frac: [`${o1} · ${h1} · ${d1}`, `${o2} · ${h2}`] }, ` = ${f(res)}`],
            dibujo: { datos: obraDatos(o1 * h1 * d1, o2 * h2, { rotObra: `obra: ${f(o1 * h1 * d1)} horas-obrero`, rotDias: `un día = ${f(o2 * h2)} horas-obrero` }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 3: repartir según pesos (directo o inverso) ----------
  // Cambia: los pesos y el modo. Permanece: el total de S/ 240 a la misma escala.
  // Progresa: pesos → partes iguales → montos. Se reserva: el inverso, donde el peso menor recibe más.
  // Debe verse: en el inverso, la parte del 2 es más larga que la del 3.
  const repartoDatos = (total, pesos, inverso, o = {}) => {
    const w = inverso ? pesos.map(p => 1 / p) : pesos;
    const sw = w.reduce((a, b) => a + b, 0);
    return {
      max: total, filas: 2,
      tiras: [
        { rotulo: `total ${sol(total)}`, color: 'd', tramos: [{ valor: total, color: 'd', relleno: 0.12 }] },
        { rotulo: inverso ? 'según 1/peso' : 'según el peso', color: 'o', sinContorno: true, paso: o.paso, tramos: w.map((wv, i) => ({ valor: total * wv / sw, color: COL[i], relleno: 0.3, texto: o.sinMontos ? `peso ${f(pesos[i])}` : f(total * wv / sw) })) },
      ],
    };
  };
  // Lo que recibe la parte 1 y, al revés, el peso 1 que da un corte b del total (con los demás pesos fijos).
  const parte1 = (total, pesos, inverso) => { const w = inverso ? pesos.map(p => 1 / p) : pesos; return total * w[0] / w.reduce((u, z) => u + z, 0); };
  function pesoDesdeCorte(b, total, otros, inverso) {
    const r = Math.min(total - 0.5, Math.max(0.5, b)) / total;      // fracción del total; nunca 0 ni 1
    const resto = [].concat(otros).reduce((u, z) => u + (inverso ? 1 / z : z), 0);
    const w = resto * r / (1 - r);                                   // peso efectivo de la parte 1
    return inverso ? 1 / w : w;
  }
  const reparto = {
    id: 'reparto',
    titulo: 'Repartir según pesos',
    temas: ['Reparto proporcional'],
    pieza: 'arit-tiras',
    // Lee: qué es un peso y los dos nombres; no dice a quién favorece el inverso (eso es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'No siempre en partes iguales', texto: 'Tres primos ayudan en la cosecha de papa y reciben S/ 90. No lo parten en tres partes iguales: lo reparten según las horas que trabajó cada uno. Esas horas son los pesos del reparto.' },
        { titulo: 'Directo o inverso', texto: 'En un reparto directo, cada peso dice cuántas partes iguales del total recibe cada uno. En un reparto inverso, la cuenta usa los pesos de otra manera. Descúbrela en el juego.' },
        { titulo: 'Qué mirar', texto: 'La tira verde es el total de S/ 240. La de abajo está cortada en dos tramos, uno por peso. Deja los mismos pesos, cambia de directo a inverso y mira cómo se mueve el corte.' },
      ],
    },
    juega: {
      consigna: 'Reparte S/ 240 entre dos personas según sus pesos. Cambia los pesos y el modo: directo o inverso.',
      voz: 'En el inverso, mira qué peso se lleva el tramo más grande.',
      controles: [
        { id: 'modo', etiqueta: 'Reparto', opciones: [{ valor: 'directo', texto: 'Directo' }, { valor: 'inverso', texto: 'Inverso' }] },
        { id: 'p', etiqueta: 'Peso 1', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 1, decimales: 0 },
        { id: 'q', etiqueta: 'Peso 2', color: 'c-i', min: 1, max: 5, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: v => ({ datos: repartoDatos(240, [v.p, v.q], v.modo === 'inverso'), estado: {} }),
      lectura: v => { const w = v.modo === 'inverso' ? [1 / v.p, 1 / v.q] : [v.p, v.q], sw = w[0] + w[1]; return [`Recibe ${sol(240 * w[0] / sw)} y ${sol(240 * w[1] / sw)}`]; },
      minimo: 3,
      // Se arrastra el corte entre las dos partes: el dedo fija la parte 1 y de ahí sale el peso 1 (con el peso 2 fijo).
      arrastres: [
        { id: 'corte', etiqueta: 'el corte entre las dos partes: peso 1', color: 'c-o',
          donde: v => enTira(repartoDatos(240, [v.p, v.q], v.modo === 'inverso'), 1, parte1(240, [v.p, v.q], v.modo === 'inverso')),
          mover: (pt, v) => ({ p: pesoDesdeCorte(valorEn(repartoDatos(240, [v.p, v.q], v.modo === 'inverso'), pt.x), 240, v.q, v.modo === 'inverso') }) },
      ],
    },
    predice: {
      pregunta: 'Se reparten S/ 240 en forma inversamente proporcional a 2 y 3. ¿Cuánto recibe la parte que corresponde al 2?',
      opciones: [
        { id: 'c', texto: 'S/ 144', correcta: true },
        { id: 'directo', texto: 'S/ 96', error: 'AR10', siFuera: '96 sería cierto en un reparto directo. Al revés, al número menor le toca más.' },
        { id: 'igual', texto: 'S/ 120', error: 'AT-REPARTE-IGUAL', siFuera: 'Eso reparte en partes iguales, sin usar los pesos.' },
        { id: 'mitad', texto: 'S/ 80', error: 'AT-PARTES', siFuera: 'Eso divide 240 entre 3; los pesos inversos son 1/2 y 1/3.' },
      ],
      dibujo: { datos: repartoDatos(240, [2, 3], true, { paso: 9 }), estado: {} },
      revelar: { datos: repartoDatos(240, [2, 3], true), estado: {} },
      coincide: 'Coincide: con pesos 1/2 y 1/3, el 2 recibe más.',
    },
    mira: {
      datos: repartoDatos(240, [2, 3], true, { paso: 3 }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Inverso a 2 y 3: los pesos son 1/2 y 1/3.', ecuacion: [{ frac: ['1', '2'] }, ' : ', { frac: ['1', '3'] }] },
        { estado: { paso: 2 }, texto: 'Multiplicando por 6 quedan pesos enteros: 3 y 2.', ecuacion: ['6 · ', { frac: ['1', '2'] }, ' = 3', '   ·   ', '6 · ', { frac: ['1', '3'] }, ' = 2'] },
        { estado: { paso: 3 }, texto: 'Son 5 partes de 48: 3 partes y 2 partes.', ecuacion: ['240 ÷ 5 = 48 → 144 y 96'] },
      ],
    },
    regla: {
      texto: 'En el reparto directo, a cada uno le toca el total por su peso entre la suma de pesos. El reparto inverso usa como pesos los inversos.',
      ecuacion: [{ sub: ['x', 'i'] }, ' = ', { llave: [T], nota: 'total', color: 'c-d' }, ' · ', { llave: [{ frac: [wi, ['Σ', 'w']] }], nota: 'su fracción' }, '   ·   ', 'inverso: ', wi, ' → ', { frac: ['1', wi] }],
      condicion: 'los pesos son positivos. Multiplicar todos los pesos por el mismo número no cambia el reparto.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), inverso = s % 2 === 1;
        const pesos = r.de([[2, 3], [3, 4], [2, 3, 6], [1, 2, 3], [3, 6], [2, 5], [4, 6, 12]]);
        const w = inverso ? pesos.map(p => 1 / p) : pesos, sw = w.reduce((a, b) => a + b, 0);
        const mcm = pesos.reduce((m, v) => { const g = (p, q) => (q ? g(q, p % q) : p); return m * v / g(m, v); }, 1);
        const enteros = inverso ? pesos.map(p => mcm / p) : pesos, S = enteros.reduce((a, b) => a + b, 0);
        const T2 = r.de([10, 12, 20, 30, 50]) * S, parte = T2 * w[0] / sw, u = T2 / S;
        const lista = xs => xs.join(', ').replace(/, ([^,]*)$/, ' y $1');
        return {
          enunciado: `Se reparten S/ ${f(T2)} en forma ${inverso ? 'inversamente' : 'directamente'} proporcional a ${lista(pesos)}. ¿Cuánto le toca a la parte del ${pesos[0]}?`,
          dibujo: { datos: repartoDatos(T2, pesos, inverso, { sinMontos: true }), estado: { paso: 9 } },
          pasos: [
            { tipo: 'pide', texto: `Piden lo que le toca a la parte del ${pesos[0]}.` },
            { tipo: 'datos', texto: `Total: ${sol(T2)}. Pesos: ${lista(pesos)}. El reparto es ${inverso ? 'inverso' : 'directo'}.`, ecuacion: [T, ` = ${sol(T2)}`] },
            inverso
              ? { tipo: 'regla', texto: `En el reparto inverso, los pesos que cuentan son los inversos. Para no repartir con fracciones, los multiplico todos por ${mcm}, su MCM.`,
                ecuacion: [...pesos.flatMap((p, j) => [j ? ' : ' : '', { frac: ['1', String(p)] }]), `   →   · ${mcm}   →   ${enteros.join(' : ')}`] }
              : { tipo: 'regla', texto: 'En el reparto directo, cada peso dice cuántas partes iguales del total recibe cada uno.',
                ecuacion: [`${enteros.join(' : ')}   →   ${enteros.join(' + ')} = ${S} partes`] },
            { tipo: 'cuentas', texto: `Son ${S} partes iguales. Divido el total entre ${S}, y la parte del ${pesos[0]} se lleva ${enteros[0]} de ellas.`,
              ecuacion: [T, ` ÷ ${S} = ${f(u)}   →   ${enteros[0]} · ${f(u)} = ${sol(parte)}`],
              dibujo: { datos: repartoDatos(T2, pesos, inverso), estado: {} } },
            { tipo: 'sentido', texto: `Comprueba: ${enteros.map(e => f(e * u)).join(' + ')} = ${f(T2)}. ${inverso ? 'Al peso menor le toca la parte mayor, como en todo reparto inverso.' : 'Al peso menor le toca la parte menor, como en todo reparto directo.'}` },
          ],
          respuesta: sol(parte),
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), inverso = s % 2 === 1;
        const pesos = r.de([[2, 3], [3, 4], [2, 3, 6], [1, 2, 3], [3, 6], [2, 5], [4, 6, 12]]);
        const w = inverso ? pesos.map(p => 1 / p) : pesos, sw = w.reduce((a, b) => a + b, 0);
        const mcm = pesos.reduce((m, v) => { const g = (p, q) => (q ? g(q, p % q) : p); return m * v / g(m, v); }, 1);
        const enteros = inverso ? pesos.map(p => mcm / p) : pesos;            // pesos enteros equivalentes
        const T2 = r.de([10, 12, 20, 30, 50]) * enteros.reduce((a, b) => a + b, 0);
        const i = 0, parte = T2 * w[i] / sw;
        const wo = inverso ? pesos : pesos.map(p => 1 / p), swo = wo.reduce((a, b) => a + b, 0);
        return {
          pregunta: `Se reparten S/ ${f(T2)} en forma ${inverso ? 'inversamente' : 'directamente'} proporcional a ${pesos.join(', ').replace(/, ([^,]*)$/, ' y $1')}. ¿Cuánto le toca a la parte del ${pesos[i]}?`,
          dibujo: { datos: repartoDatos(T2, pesos, inverso, { sinMontos: true }), estado: { paso: 9 } },
          opciones: opciones(parte, [
            { id: 'otro-modo', valor: T2 * wo[i] / swo, error: inverso ? 'AR10' : 'AT-INVERSA', siFuera: inverso ? 'Eso reparte en forma directa; aquí al número menor le toca más.' : 'Eso reparte en forma inversa.' },
            { id: 'igual', valor: T2 / pesos.length, error: 'AT-REPARTE-IGUAL', siFuera: 'Eso reparte en partes iguales.' },
            { id: 'peso', valor: T2 / pesos[i], error: 'AT-PARTES', siFuera: `Eso divide el total entre ${pesos[i]}; falta la suma de pesos.` },
          ], sol),
          solucion: {
            texto: inverso ? `Los inversos, por ${mcm}, dan pesos enteros: ${enteros.join(', ')}.` : 'Su peso entre la suma de pesos.',
            ecuacion: [`${f(T2)} · `, { frac: [String(enteros[i]), enteros.join(' + ')] }, ` = ${sol(parte)}`],
            dibujo: { datos: repartoDatos(T2, pesos, inverso), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 4: regla de compañía: el peso es capital por tiempo ----------
  // Cambia: el capital y los meses del socio A. Permanece: el socio B (S/ 3000, 12 meses) y la ganancia.
  // Progresa: capital → capital × meses → parte. Se reserva: el caso donde más capital no es más ganancia.
  // Debe verse: la tira de cada socio mide capital × meses.
  const compDatos = (ca, ta, cb, tb, G, o = {}) => {
    const wa = ca * ta, wb = cb * tb, s = wa + wb;
    return {
      max: G, filas: 2,
      tiras: [
        { rotulo: `A: ${f(ca)} mil × ${f(ta)} meses = ${f(wa)}`, color: 'o', tramos: [{ valor: G * wa / s, color: 'o', relleno: 0.3, texto: o.sin ? undefined : sol(G * wa / s) }] },
        { rotulo: `B: ${f(cb)} mil × ${f(tb)} meses = ${f(wb)}`, color: 'i', tramos: [{ valor: G * wb / s, color: 'i', relleno: 0.3, texto: o.sin ? undefined : sol(G * wb / s) }] },
      ],
    };
  };
  const compania = {
    id: 'compania',
    titulo: 'Capital por tiempo',
    temas: ['Regla de compañía'],
    pieza: 'arit-tiras',
    // Lee: socios, capital y ganancia; no dice cómo se combinan dinero y meses (eso es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Un negocio entre dos', texto: 'Dos amigas abren una juguería en Juliaca. Cada una pone dinero, su capital, y lo deja en el negocio cierto número de meses. Al cerrar las cuentas, reparten la ganancia.' },
        { titulo: '¿Qué es justo?', texto: '¿Le toca más a quien puso más dinero o a quien lo dejó más tiempo? Para repartir la ganancia hay que decidir qué cuenta. El reparto entre socios se llama regla de compañía.' },
        { titulo: 'Qué mirar', texto: 'Cada tira es un socio: su rótulo dice su capital y sus meses, y su tramo de color es lo que recibe. B queda fijo. Cambia el capital y los meses de A, y compara los dos tramos.' },
      ],
    },
    juega: {
      consigna: 'Dos socios reparten S/ 6000 de ganancia. B puso 3 mil soles durante 12 meses. Cambia el capital y los meses de A.',
      voz: 'Busca un caso donde A pone más y recibe menos.',
      controles: [
        { id: 'c', etiqueta: 'Capital de A', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 4, unidad: 'mil', decimales: 0 },
        { id: 't', etiqueta: 'Meses de A', color: 'c-o', min: 2, max: 12, paso: 2, inicio: 6, decimales: 0 },
      ],
      dibujo: v => ({ datos: compDatos(v.c, v.t, 3, 12, 6000), estado: {} }),
      lectura: v => [`A recibe ${sol(6000 * v.c * v.t / (v.c * v.t + 36))}`],
      minimo: 3,
      // Se arrastra el fin de la parte de A: el dedo fija lo que recibe y de ahí sale el capital (con sus meses fijos).
      arrastres: [
        { id: 'parte-a', etiqueta: 'fin de la parte de A: capital', color: 'c-o',
          donde: v => enTira(compDatos(v.c, v.t, 3, 12, 6000), 0, 6000 * v.c * v.t / (v.c * v.t + 36)),
          mover: (pt, v) => ({ c: pesoDesdeCorte(valorEn(compDatos(v.c, v.t, 3, 12, 6000), pt.x), 6000, 36, false) / v.t }) },
      ],
    },
    predice: {
      pregunta: 'A puso S/ 4000 durante 6 meses y B puso S/ 3000 durante 12 meses. Ganaron S/ 5000. ¿Cuánto le toca a A?',
      opciones: [
        { id: 'c', texto: 'S/ 2000', correcta: true },
        { id: 'capital', texto: 'S/ 2857,14', error: 'AT-SOLO-CAPITAL', siFuera: 'Sería cierto si los dos estuvieran el mismo tiempo. B estuvo el doble.' },
        { id: 'igual', texto: 'S/ 2500', error: 'AT-REPARTE-IGUAL', siFuera: 'Eso reparte a medias, sin pesos.' },
        { id: 'tiempo', texto: 'S/ 1666,67', error: 'AT-SOLO-TIEMPO', siFuera: 'Eso usa solo los meses; también cuenta el capital.' },
      ],
      dibujo: { datos: compDatos(4, 6, 3, 12, 5000, { sin: true }), estado: {} },
      revelar: { datos: compDatos(4, 6, 3, 12, 5000), estado: {} },
      coincide: 'Coincide: los pesos son 24 y 36, como 2 y 3.',
    },
    mira: {
      datos: compDatos(4, 6, 3, 12, 5000),
      pasos: [
        { estado: {}, texto: 'El peso de cada socio es capital por meses.', ecuacion: ['A: 4 · 6 = 24', '   ·   ', 'B: 3 · 12 = 36'] },
        { estado: {}, texto: 'Los pesos 24 y 36 son como 2 y 3: cinco partes.', ecuacion: ['24 : 36 = 2 : 3'] },
        { estado: {}, texto: 'Cada parte vale S/ 1000: A recibe dos.', ecuacion: ['5000 ÷ 5 = 1000 → A = 2000'] },
      ],
    },
    regla: {
      texto: 'En la regla de compañía la ganancia se reparte en forma directa al producto de capital por tiempo de cada socio.',
      ecuacion: [{ sub: ['G', 'A'] }, ' = G · ', { llave: [{ frac: [[{ sub: ['C', 'A'] }, ' · ', { sub: ['t', 'A'] }], 'Σ C · t'] }], nota: 'peso de A' }],
      condicion: 'vale si así lo acordaron y los tiempos se miden en la misma unidad. Si el tiempo es igual, basta el capital.',
    },
    resuelve: {
      generar(s) {
        let r, ca, ta, cb, tb;
        for (let t = s + 900; ; t += 501) {      // como «Ahora tú»: pesos distintos
          r = azar(t); ca = r.ent(2, 8); ta = r.de([3, 4, 6, 8, 12]); cb = r.ent(2, 8); tb = r.de([3, 4, 6, 8, 12]);
          if (ca * ta !== cb * tb) break;
        }
        const wa = ca * ta, wb = cb * tb, G = (wa + wb) * r.de([50, 100, 150, 200]), res = G * wa / (wa + wb);
        return {
          enunciado: `A puso S/ ${f(ca * 1000)} durante ${ta} meses y B, S/ ${f(cb * 1000)} durante ${tb} meses. Ganaron S/ ${f(G)}. ¿Cuánto le toca a A?`,
          dibujo: { datos: compDatos(ca, ta, cb, tb, G, { sin: true }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden la parte de A en una ganancia de ${sol(G)}.` },
            { tipo: 'datos', texto: `A: S/ ${f(ca * 1000)} durante ${ta} meses. B: S/ ${f(cb * 1000)} durante ${tb} meses.` },
            { tipo: 'regla', texto: 'Cuentan el dinero y el tiempo a la vez: el peso de cada socio es su capital por sus meses. La ganancia se reparte en forma directa a esos pesos.',
              ecuacion: [{ sub: ['G', 'A'] }, ' = G · ', { frac: [[{ sub: ['C', 'A'] }, ' · ', { sub: ['t', 'A'] }], 'Σ C · t'] }] },
            { tipo: 'cuentas', texto: `Pesos, con el capital en miles: A, ${ca} · ${ta} = ${wa}; B, ${cb} · ${tb} = ${wb}. A se lleva ${wa} de cada ${wa + wb} partes.`,
              ecuacion: [`${f(G)} · `, { frac: [String(wa), `${wa} + ${wb}`] }, ` = ${sol(res)}`],
              dibujo: { datos: compDatos(ca, ta, cb, tb, G), estado: {} } },
            { tipo: 'sentido', texto: `Comprueba: B recibe ${sol(G - res)}, y ${f(res)} + ${f(G - res)} = ${f(G)}. ${wa > wb ? 'A tiene el peso mayor y recibe más.' : 'A tiene el peso menor y recibe menos.'}` },
          ],
          respuesta: `A recibe ${sol(res)}`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), ca = r.ent(2, 8), ta = r.de([3, 4, 6, 8, 12]), cb = r.ent(2, 8), tb = r.de([3, 4, 6, 8, 12]);
        if (ca * ta === cb * tb) return this.generar(s + 501);
        const wa = ca * ta, wb = cb * tb, G = (wa + wb) * r.de([50, 100, 150, 200]);
        const res = G * wa / (wa + wb);
        return {
          pregunta: `A puso S/ ${f(ca * 1000)} durante ${ta} meses y B, S/ ${f(cb * 1000)} durante ${tb} meses. Ganaron S/ ${f(G)}. ¿Cuánto le toca a A?`,
          opciones: opciones(res, [
            { id: 'capital', valor: G * ca / (ca + cb), error: 'AT-SOLO-CAPITAL', siFuera: 'Eso usa solo el capital; también cuenta el tiempo.' },
            { id: 'tiempo', valor: G * ta / (ta + tb), error: 'AT-SOLO-TIEMPO', siFuera: 'Eso usa solo los meses; también cuenta el capital.' },
            { id: 'igual', valor: G / 2, error: 'AT-REPARTE-IGUAL', siFuera: 'Eso reparte a medias.' },
          ], sol),
          solucion: {
            texto: 'Pesos: capital por meses.',
            ecuacion: [`${f(G)} · `, { frac: [String(wa), `${wa} + ${wb}`] }, ` = ${sol(res)}`],
            dibujo: { datos: compDatos(ca, ta, cb, tb, G), estado: {} },
          },
        };
      },
    },
  };

  // Mesa «tres relaciones»: y = kx, xy = 6k o y = kx + 6 (crece con x, pero no es proporcional).
  const NOMBRE = { directa: 'Directa', inversa: 'Inversa', afin: 'Ninguna' };
  const yLibre = (tipo, kk, xv) => (tipo === 'directa' ? kk * xv : tipo === 'inversa' ? 6 * kk / xv : kk * xv + 6);
  // Lo que leen la lectura y los retos de las mesas: el punto, el reparto entre tres y sus extremos en la grilla.
  const rango = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const yDe = v => yLibre(v.tipo, v.k, v.x);
  const MAX_Y = Math.max(...['directa', 'inversa', 'afin'].flatMap(tipo => rango(1, 6).flatMap(kk => rango(1, 6).map(xv => yLibre(tipo, kk, xv)))));
  const partes3 = v => { const w = [v.p, v.q, v.r].map(z => (v.modo === 'inverso' ? 1 / z : z)), sw = w[0] + w[1] + w[2]; return w.map(z => 600 * z / sw); };
  const MAX_P = Math.max(...['directo', 'inverso'].flatMap(modo => rango(1, 6).flatMap(p => rango(1, 6).flatMap(q => rango(1, 6).map(r => Math.max(...partes3({ modo, p, q, r })))))));
  const casi = (u, w) => Math.abs(u - w) < 1e-9;
  const planoLibre = v => {
    const yv = yLibre(v.tipo, v.k, v.x);
    return {
      x: { min: 0, max: 6, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: 0, max: 42, paso: 6, cada: 2, nombre: 'y', decimales: 0, color: 'i' },
      curvas: [{ puntos: v.tipo === 'inversa' ? curvaInversa(6 * v.k, v.k / 7, 6) : [[0, yLibre(v.tipo, v.k, 0)], [6, yLibre(v.tipo, v.k, 6)]], color: 'i' }],
      areas: v.tipo === 'inversa' ? [{ puntos: [[0, yv], [v.x, yv]], color: 'd' }] : [],
      puntos: [{ x: v.x, y: yv, color: 'i', rotulo: `(${f(v.x)}; ${f(yv)})`, guias: true }],
    };
  };

  return {
    unidad: 'aritmetica.magnitudes-proporcionales',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/arit-tiras.js'],
    // Glosario del tema (docs/teoria.md, 4d). «ganancia» se define en porcentajes, donde es la idea central.
    glosario: [
      { termino: 'fracción', formas: ['fracción', 'fracciones'], def: 'Número que dice cuántas partes iguales de una unidad se toman: a/b, con b distinto de 0.',
        ejemplo: 'Con pesos 1 y 3, a la primera le toca 1/4 del total.' },
      { termino: 'magnitud', def: 'Algo que se puede medir o contar y que cambia de valor: obreros, días, precio, distancia.',
        ejemplo: 'Los días que dura una obra.', ver: ['directamente proporcional', 'inversamente proporcional'] },
      { termino: 'directamente proporcional', formas: ['directamente proporcional', 'directamente proporcionales'],
        def: 'Dos cantidades lo son si su cociente no cambia: si una se duplica, la otra también.',
        ejemplo: 'A S/ 4 el kilo: 2 kg cuestan S/ 8 y 5 kg, S/ 20.', ver: ['constante de proporcionalidad'] },
      { termino: 'inversamente proporcional', formas: ['inversamente proporcional', 'inversamente proporcionales'],
        def: 'Dos cantidades lo son si su producto no cambia: si una se duplica, la otra queda en la mitad.',
        ejemplo: '12 obreros en 15 días o 20 en 9: 12 · 15 = 20 · 9 = 180.', ver: ['constante de proporcionalidad'] },
      { termino: 'constante de proporcionalidad', simbolo: 'k', formas: ['constante de proporcionalidad', 'constante k'],
        def: 'El número fijo de la relación: y ÷ x en la directa, x · y en la inversa.',
        ejemplo: 'y = 4x: k = 4.', ver: ['directamente proporcional', 'inversamente proporcional'] },
      { termino: 'origen', def: 'El punto (0; 0) de una gráfica, donde se cruzan los dos ejes.',
        ejemplo: 'y = 4x pasa por él; y = 2x + 3, no.', ver: ['directamente proporcional'] },
      { termino: 'regla de tres', formas: ['regla de tres', 'regla de tres simple', 'regla de tres compuesta'],
        def: 'Método para hallar un valor que falta entre magnitudes proporcionales. Se llama compuesta si intervienen más de dos.',
        ejemplo: '12 obreros en 15 días; 20 obreros en 12 · 15 ÷ 20 = 9 días.', ver: ['magnitud', 'obra'] },
      { termino: 'obra', def: 'En problemas de trabajo, el total que hay que hacer. No cambia aunque cambien los obreros o las horas.',
        ejemplo: '8 obreros, 6 h al día, 10 días: 8 · 6 · 10 = 480 horas-obrero.', ver: ['horas-obrero'] },
      { termino: 'horas-obrero', formas: ['horas-obrero', 'días-obrero'],
        def: 'Unidad de trabajo: lo que hace un obrero en una hora. Contado por días, es día-obrero.',
        ejemplo: '3 obreros durante 4 horas: 12 horas-obrero.', ver: ['obra'] },
      { termino: 'peso', formas: ['peso', 'pesos'], def: 'Número que dice cuánto le toca o cuánto cuenta cada parte en un reparto o en un promedio.',
        ejemplo: 'S/ 240 con pesos 1 y 3: 4 partes, S/ 60 y S/ 180.', ver: ['reparto directo', 'reparto inverso'] },
      { termino: 'reparto directo', formas: ['reparto directo', 'repartos directos'],
        def: 'Repartir un total en partes proporcionales a unos pesos: el peso mayor recibe más.',
        ejemplo: 'S/ 240 en forma directa a 2 y 3: S/ 96 y S/ 144.', ver: ['peso', 'reparto inverso'] },
      { termino: 'reparto inverso', formas: ['reparto inverso', 'repartos inversos'],
        def: 'Repartir un total usando como pesos los inversos 1/2, 1/3…: el número mayor recibe menos.',
        ejemplo: 'S/ 240 en forma inversa a 2 y 3: S/ 144 y S/ 96.', ver: ['peso', 'reparto directo'] },
      { termino: 'inversos', formas: ['inversos'], def: 'De un número distinto de 0: 1 dividido entre ese número. Multiplicados por él, dan 1.',
        ejemplo: 'Los de 2 y 3 son 1/2 y 1/3.', ver: ['reparto inverso'] },
      { termino: 'regla de compañía', def: 'Reparto de la ganancia entre socios en forma directa a capital por tiempo de cada uno.',
        ejemplo: 'A: S/ 4000 por 6 meses (24); B: S/ 3000 por 12 (36). Se reparte 2 : 3.', ver: ['capital', 'reparto directo'] },
      { termino: 'capital', formas: ['capital', 'capitales'], def: 'Dinero que alguien pone en un negocio, o presta, para que produzca ganancia.',
        ejemplo: 'B puso un capital de S/ 3000 durante 12 meses.', ver: ['regla de compañía'] },
    ],
    // Laboratorio: juego libre, sin preguntas. «Tres relaciones» suma el caso que crece sin ser proporcional (y = kx + 6)
    // y deja elegir la constante; «Reparto entre tres» corta un total en tres partes; la obra es el juego de la idea 2.
    laboratorio: [
      {
        id: 'tres-relaciones', titulo: 'Directa, inversa o ninguna', pieza: 'ejes',
        consigna: 'Elige la relación y la constante k. Arrastra el punto y mira si el cociente o el producto se quedan quietos.',
        controles: [
          { id: 'tipo', etiqueta: 'Relación', opciones: [{ valor: 'directa', texto: 'y = kx' }, { valor: 'inversa', texto: 'xy = 6k' }, { valor: 'afin', texto: 'y = kx + 6' }] },
          { id: 'k', etiqueta: 'k', color: 'c-d', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
          { id: 'x', etiqueta: 'x', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 },
        ],
        dibujo: v => ({ datos: planoLibre(v), estado: {} }),
        lectura: v => {
          const yv = yLibre(v.tipo, v.k, v.x);
          return [`${NOMBRE[v.tipo]}, k = ${f(v.k)}:`, ' ', y, ' ÷ ', x, ` = ${f(yv / v.x)}`, '   ·   ', x, ' · ', y, ` = ${f(v.x * yv)}`];
        },
        arrastres: [
          { id: 'punto', etiqueta: 'el punto sobre la gráfica', color: 'c-o',
            donde: v => { const g = EJES().geometria(planoLibre(v)); return { x: g.X(v.x), y: g.Y(yLibre(v.tipo, v.k, v.x)) }; },
            mover: (pt, v) => ({ x: inversa(EJES().geometria(planoLibre(v)).X, 0, 6)(pt.x) }) },
          { id: 'altura', etiqueta: 'la gráfica en x = 6: cambia k', color: 'c-d',
            donde: v => { const g = EJES().geometria(planoLibre(v)); return { x: g.X(6), y: g.Y(yLibre(v.tipo, v.k, 6)) }; },
            mover: (pt, v) => {
              const yv = inversa(EJES().geometria(planoLibre(v)).Y, 0, 42)(pt.y);
              return { k: v.tipo === 'directa' ? yv / 6 : v.tipo === 'inversa' ? yv : (yv - 6) / 6 };
            } },
        ],
        invitaciones: [
          { texto: 'Pon el punto donde y ÷ x da 4, sin que la relación sea directa.',
            logrado: v => v.tipo !== 'directa' && casi(yDe(v) / v.x, 4),
            bien: 'Un solo punto con cociente 4 no prueba nada: mueve x y mira.' },
          { texto: 'Consigue el punto más alto que deja la mesa.',
            logrado: v => yDe(v) === MAX_Y,
            bien: 'Lo más alto lo da la que suma 6, y no es proporcional.' },
          { texto: 'Haz que el rectángulo verde tenga área 30.',
            logrado: v => v.tipo === 'inversa' && casi(v.x * yDe(v), 30),
            bien: 'Muévete por la curva: el área sigue en 30. Así es la inversa.' },
          { texto: 'Guarda dos puntos distintos de una misma gráfica con el mismo producto x · y.',
            logrado: (v, guardados) => guardados.some(g => g.tipo === v.tipo && g.k === v.k && g.x !== v.x && casi(g.x * yDe(g), v.x * yDe(v))),
            bien: 'Mismo producto en dos puntos de la curva: la constante k no cambió.' },
        ],
      },
      {
        id: 'reparto-tres', titulo: 'Reparto entre tres', pieza: 'arit-tiras',
        consigna: 'Reparte S/ 600 entre tres según sus pesos. Arrastra los dos cortes o cambia los pesos. Prueba directo e inverso con los mismos pesos.',
        controles: [
          { id: 'modo', etiqueta: 'Reparto', opciones: [{ valor: 'directo', texto: 'Directo' }, { valor: 'inverso', texto: 'Inverso' }] },
          { id: 'p', etiqueta: 'Peso 1', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0 },
          { id: 'q', etiqueta: 'Peso 2', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
          { id: 'r', etiqueta: 'Peso 3', color: 'c-h', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 },
        ],
        dibujo: v => ({ datos: repartoDatos(600, [v.p, v.q, v.r], v.modo === 'inverso'), estado: {} }),
        lectura: v => [`${v.modo === 'inverso' ? 'Inverso' : 'Directo'} a ${v.p}, ${v.q}, ${v.r}: ${partes3(v).map(z => f(z)).join('; ')}`],
        arrastres: [
          { id: 'corte-1', etiqueta: 'primer corte: peso 1', color: 'c-o',
            donde: v => enTira(repartoDatos(600, [v.p, v.q, v.r], v.modo === 'inverso'), 1, parte1(600, [v.p, v.q, v.r], v.modo === 'inverso')),
            mover: (pt, v) => ({ p: pesoDesdeCorte(valorEn(repartoDatos(600, [v.p, v.q, v.r], v.modo === 'inverso'), pt.x), 600, [v.q, v.r], v.modo === 'inverso') }) },
          { id: 'corte-2', etiqueta: 'segundo corte: peso 2', color: 'c-i',
            donde: v => enTira(repartoDatos(600, [v.p, v.q, v.r], v.modo === 'inverso'), 1, 600 - parte1(600, [v.r, v.p, v.q], v.modo === 'inverso')),
            mover: (pt, v) => {
              // Lo que queda a la derecha del corte es la parte 3: de ahí sale el peso conjunto de 1 y 2, y el de 2.
              const inv = v.modo === 'inverso';
              const b3 = 600 - valorEn(repartoDatos(600, [v.p, v.q, v.r], inv), pt.x);
              const w3 = inv ? 1 / v.r : v.r;
              const r3 = Math.min(599.5, Math.max(0.5, b3)) / 600;
              const w12 = w3 * (1 - r3) / r3, w2 = w12 - (inv ? 1 / v.p : v.p);
              return { q: w2 > 0 ? (inv ? 1 / w2 : w2) : (inv ? 6 : 1) };
            } },
        ],
        invitaciones: [
          { texto: 'En un reparto inverso, haz que una parte sea justo S/ 300.',
            logrado: v => v.modo === 'inverso' && partes3(v).some(z => casi(z, 300)),
            bien: 'La mitad para uno: en el inverso, al del peso más chico.' },
          { texto: 'Consigue que las tres partes sean iguales.',
            logrado: v => { const z = partes3(v); return casi(z[0], z[1]) && casi(z[1], z[2]); },
            bien: 'Con pesos iguales, directo e inverso dan lo mismo.' },
          { texto: 'Busca la parte más grande que le puede tocar a una sola persona.',
            logrado: v => casi(Math.max(...partes3(v)), MAX_P),
            bien: 'Ni con el peso más extremo se lleva todo: los otros reciben algo.' },
          { texto: 'Guarda el reparto directo y el inverso con los mismos pesos, no todos iguales.',
            logrado: (v, guardados) => !(v.p === v.q && v.q === v.r) && guardados.some(g => g.p === v.p && g.q === v.q && g.r === v.r && g.modo !== v.modo),
            bien: 'Mismos pesos, orden al revés: en el inverso, el peso mayor recibe menos.' },
        ],
      },
      Object.assign({ id: 'obra', titulo: 'La obra se corta en días', pieza: 'arit-tiras',
        invitaciones: [
          { texto: 'Haz que la obra se termine en exactamente 5 días.',
            logrado: v => diasObra(v) === 5,
            bien: 'Hay tres maneras de avanzar 24 por día. ¿Cuáles son?' },
          { texto: 'Elige obreros y horas que terminen la obra en menos días.',
            logrado: v => diasObra(v) === OBRA / (6 * 10),
            bien: 'Con 60 horas-obrero por día, la obra cabe en 2 días.' },
          { texto: 'Consigue que el último día quede incompleto.',
            logrado: v => !Number.isInteger(diasObra(v)),
            bien: 'El pedazo rojo es un día que no se trabaja entero.' },
          { texto: 'Guarda dos casos con los mismos días y distinto número de obreros.',
            logrado: (v, guardados) => guardados.some(g => g.o !== v.o && diasObra(g) === diasObra(v)),
            bien: 'Menos obreros con más horas: lo que se avanza por día quedó igual.' },
        ] }, compuesta.juega),
    ],
    historia: {
      texto: 'El Liber abaci de Fibonacci, de 1202, circuló por el Mediterráneo con métodos que su autor aprendió en el norte de África y en sus viajes. Mostró la utilidad del cálculo para problemas concretos de comercio, sin inventar la proporcionalidad. Repartir un total con criterios explícitos es una necesidad antigua; escribirla con pesos y una suma es la forma moderna.',
      pregunta: '¿Cómo repartirías una ganancia entre socios que pusieron distinto?',
      fuente: { titulo: 'O’Connor y Robertson, Fibonacci — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Fibonacci/' },
    },
    ideas: [directaInversa, compuesta, reparto, compania],
  };
});
