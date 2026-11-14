/*
 * Teoría de «Suma y diferencia de ángulos» (trigonometria.arcos-compuestos), 5.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 10), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (trigonometría, pp. 82–100) y las «Precisiones de Geometría y Trigonometría» del expediente.
 * Forma: contenido/teoria/trigonometria/angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: cada término de la fórmula sale de una proyección que se ve.
 * Colores (regla 4): el primer ángulo α en naranja (c-o), el segundo ángulo β en turquesa (c-i), el ángulo suma α + β
 * en rojo (c-h) y las piezas que forman la altura (los productos) en verde (c-d). En la idea 3, a (lo que acompaña al
 * seno) en naranja, b (lo que acompaña al coseno) en turquesa y la amplitud R en rojo. En la idea 4, los ángulos del
 * triángulo A, B y C en naranja, turquesa y rojo (C es el que se deduce, como α + β en la idea 1).
 * Errores (hipótesis de distractor: docs/investigacion/trigonometria-ideas-erroneas.md no los mide; códigos nuevos
 * de esta unidad): COMP-DISTRIB (repartir sen o cos sobre la suma), COMP-PROD, COMP-SIGNO (signo del coseno de la
 * suma), COMP-CRUCE (usar la fórmula del seno en el coseno), TANS-DISTRIB, TANS-SIGNO, TANS-CERO (dividir entre cero
 * da 0), AUX-SUMA (amplitud a + b), AUX-CUADRADO (a² + b² sin raíz), AUX-MAYOR, AUX-SIN-K, AUX-SIGNO,
 * TRES-SUPLE (olvidar el signo de 180° − (A + B)), TRES-CERO, TRES-FALTA, TRES-SUMA, TRES-PROD.
 * Ronda 2 (14 nov, noche): manijas en las cuatro ideas (el rayo α y la punta del rayo rojo α + β, que fija β, en las
 * ideas 1 y 2; las crestas de a sen x y b cos x en la 3; el vértice C, que fija A y B, en la 4), llaves en las
 * reglas (las dos piezas de la altura, el denominador, la onda de amplitud R, la suma y el producto), separadores
 * «   ·   » donde había «;» y laboratorio de tres mesas. Hallazgo 9: cada idea usa la misma pieza y la misma escena
 * en «Juega» y en «Mira»; en la idea 1, «Mira» fija α = 45° y β = 30° y descompone la altura del mismo rayo rojo.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: la razón de una suma de ángulos se arma con proyecciones; nunca es la suma de las razones.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: calcula sen, cos y tan de una suma o diferencia, la amplitud de a sen x + b cos x y tan C en un triángulo.
 *   Orden de atención: 1.º el rayo α · 2.º el giro β que sale de él · acción: mover α y β · fondo: la circunferencia.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué sen 75° no es sen 45° + sen 30°, y cuándo la fórmula de la tangente no sirve?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const al = { v: 'c-o', t: 'α' }, be = { v: 'c-i', t: 'β' }, su = { v: 'c-h', t: 'α + β' };
  const A = { v: 'c-o', t: 'A' }, B = { v: 'c-i', t: 'B' }, C = { v: 'c-h', t: 'C' };
  const a_ = { v: 'c-o', t: 'a' }, b_ = { v: 'c-i', t: 'b' }, R_ = { v: 'c-h', t: 'R' };
  const rad = g => g * Math.PI / 180, deg = r => r * 180 / Math.PI;
  const sen = g => Math.sin(rad(g)), cos = g => Math.cos(rad(g)), tan = g => Math.tan(rad(g));
  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría de las piezas. ejes y triangulo no traen
  // inversa: se invierte su escala lineal aquí (como `inversa` en fisica/movimiento-rectilineo.js).
  const TP = () => Kit.piezas['trig-plano'], EJES = () => Kit.piezas.ejes, TRI = () => Kit.piezas.triangulo;
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));
  const punta = (d, gr, L = 1) => TP().enPx(d, L * Math.cos(rad(gr)), L * Math.sin(rad(gr)));
  // Las dos manijas de un giro compuesto: la de α va a 0,6 del centro sobre su rayo y la de β en la punta del rayo
  // α + β (a 1), para que no se tapen aunque β valga 0. Mover la punta de α + β cambia β; α queda quieto.
  const manijasSuma = (datos, A = 'a', B = 'b') => [
    { id: 'rayo-alfa', etiqueta: 'rayo α', color: 'c-o',
      donde: v => punta(datos(v), v[A], 0.6),
      mover: (pt, v) => ({ [A]: TP().anguloDe(datos(v), pt, { cerca: v[A] }) }) },
    { id: 'rayo-suma', etiqueta: 'punta del rayo α + β: cambia β', color: 'c-i',
      donde: v => punta(datos(v), v[A] + v[B]),
      mover: (pt, v) => ({ [B]: TP().anguloDe(datos(v), pt, { cerca: v[A] + v[B] }) - v[A] }) },
  ];
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
      if (d.valor === null || (typeof d.valor === 'number' && !Number.isFinite(d.valor))) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Fracciones exactas [n, d] con d > 0 (las cuentas de «Ahora tú» se hacen sin decimales).
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const m = mcd(n, d) || 1; return [n / m, d / m]; };
  const qs = (x, y) => Q(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
  const qr = (x, y) => Q(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
  const qm = (x, y) => Q(x[0] * y[0], x[1] * y[1]);
  const qd = (x, y) => (y[0] === 0 ? null : Q(x[0] * y[1], x[1] * y[0]));
  const qt = q => (q === null ? 'No existe' : `${q[0] < 0 ? '−' : ''}${Math.abs(q[0])}${q[1] === 1 ? '' : '/' + q[1]}`);
  const qv = q => q[0] / q[1];
  const qp = q => (q[0] < 0 ? `(${qt(q)})` : qt(q));   // entre paréntesis si es negativa (en un producto)

  // ---------- Idea 1: el seno de una suma no se reparte ----------
  // Cambia: α y β, de 20° en 20°. · Permanece: la circunferencia de radio 1 y el lado inicial.
  // Progresa: la torre sen α + sen β, que sobrepasa la altura real del rayo rojo. · Se reserva: el caso 45° + 30°,
  // que el paso de 20° no alcanza (la predicción). · Debe verse: que la altura de α + β no es la torre de las dos alturas.
  const V1 = { x: [-1.1, 1.75], y: [-0.3, 2.05] }, V1m = { x: [-0.75, 1.3], y: [-0.3, 1.25] };
  // Media circunferencia (lo que se ve sobre el eje x): la ventana no baja de −0,3.
  const media = { de: -17, a: 197, r: 1, espiral: 0, flecha: false, color: null, grosor: 'contorno' };
  function suma(a, b, extra = {}) {
    const s = a + b, h = sen(s), hs = sen(a) + sen(b);
    return Object.assign({
      ventana: V1,
      rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: a, color: 'o' }, { ang: s, color: 'h' }],
      arcos: [media, { de: 0, a, r: 0.22, color: 'o', rotulo: 'α', espiral: 0 }, { de: a, a: s, r: 0.36, color: 'i', rotulo: 'β', espiral: 0 }],
      rectas: [{ y: h, color: 'h' }],
      segmentos: [{ de: [cos(s), 0], a: [cos(s), h], color: 'h' },
        { de: [1.3, 0], a: [1.3, sen(a)], color: 'o', rotulo: 'sen α' }, { de: [1.3, sen(a)], a: [1.3, hs], color: 'i', rotulo: 'sen β' }],
      alt: `Giro de ${f(a)}° y después ${f(b)}°: la altura real es ${f(h)} y la torre de las dos alturas mide ${f(hs)}`,
    }, extra);
  }
  // Datos fijos de «Mira»: α = 45°, β = 30°. Q es el pie de la perpendicular desde P sobre el rayo α.
  const M1 = (() => {
    const a = 45, b = 30, s = 75, P = [cos(s), sen(s)], Qp = [cos(b) * cos(a), cos(b) * sen(a)];
    return { a, b, s, P, Q: Qp, h1: Qp[1], h2: P[1] - Qp[1] };
  })();
  const seno = {
    id: 'seno-suma',
    titulo: 'El seno no se reparte',
    temas: ['Seno, coseno y tangente de la suma y la diferencia'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Gira α y después β desde el rayo naranja. La línea roja marca la altura real; la torre apila sen α y sen β.',
      voz: 'Conservemos el origen: β no parte del eje x, parte del rayo α.',
      controles: [
        { id: 'a', etiqueta: 'α', color: 'c-o', min: 20, max: 80, paso: 20, inicio: 20, unidad: '°', decimales: 0 },
        { id: 'b', etiqueta: 'β', color: 'c-i', min: 20, max: 80, paso: 20, inicio: 40, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: suma(val.a, val.b), estado: {} }),
      lectura: val => ['sen(', su, `) = ${f(sen(val.a + val.b))} · sen `, al, ' + sen ', be, ` = ${f(sen(val.a) + sen(val.b))}`],
      minimo: 3,
      // Se arrastran el rayo α y la punta del rayo rojo α + β (que fija β): la torre y la línea roja responden.
      arrastres: manijasSuma(val => suma(val.a, val.b)),
    },
    predice: {
      pregunta: ['Ahora ', al, ' = 45° y ', be, ' = 30°, un par que no probaste. ¿Cuánto vale sen 75°, la altura del rayo rojo?'],
      voz: 'Piensa desde dónde sale el segundo giro.',
      opciones: [
        { id: 'c', texto: 'Cerca de 0,97', correcta: true },
        { id: 'reparte', texto: 'Cerca de 1,21: sen 45° + sen 30°', error: 'COMP-DISTRIB', siFuera: 'Apilar alturas sería cierto si β saliera del eje x. Sale del rayo α: por eso la torre se pasa.' },
        { id: 'producto', texto: 'Cerca de 0,35: sen 45° · sen 30°', error: 'COMP-PROD', siFuera: 'Hay productos en la fórmula, pero mezclan seno y coseno; el producto de dos senos solo no basta.' },
        { id: 'uno', texto: 'Más de 1', error: 'COMP-DISTRIB', siFuera: 'La torre sí pasa de 1. Pero ningún punto de la circunferencia de radio 1 está más alto que 1.' },
      ],
      dibujo: { datos: suma(45, 30, { rectas: [], segmentos: [{ de: [1.3, 0], a: [1.3, sen(45)], color: 'o', rotulo: 'sen α' }, { de: [1.3, sen(45)], a: [1.3, sen(45) + sen(30)], color: 'i', rotulo: 'sen β' }] }), estado: {} },
      revelar: { datos: suma(45, 30, { rotulos: [{ x: -0.55, y: sen(75) + 0.12, texto: `sen 75° ≈ ${f(sen(75))}`, color: 'h' }] }), estado: {} },
      coincide: 'Coincide: la altura real es 0,97; la torre de 1,21 se pasa del círculo.',
      noCoincide: 'Revisemos las dos alturas: la torre y la línea roja están dibujadas.',
    },
    mira: {
      datos: {
        ventana: V1m,
        rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: M1.a, color: 'o', grosor: 'contorno' }, { ang: M1.s, color: 'h' }],
        arcos: [Object.assign({}, media, { a: 133 }), { de: 0, a: M1.a, r: 0.22, color: 'o', espiral: 0 }, { de: M1.a, a: M1.s, r: 0.36, color: 'i', rotulo: 'β', espiral: 0 }],
        rectas: [{ y: M1.P[1], color: 'h', desde: 1 }],
        puntos: [{ x: M1.P[0], y: M1.P[1], color: 'h', rotulo: 'P', lado: 'no', desde: 1 }, { x: M1.Q[0], y: M1.Q[1], rotulo: 'Q', lado: 'e', desde: 2 }],
        segmentos: [
          { de: [0, 0], a: M1.Q, color: 'i', desde: 2 },
          { de: M1.Q, a: M1.P, color: 'i', desde: 2 },
          { de: [M1.Q[0], 0], a: M1.Q, color: 'd', desde: 3 },
          { de: M1.Q, a: [M1.P[0], M1.Q[1]], grosor: 'contorno', discontinua: true, desde: 4 },
          { de: [M1.P[0], M1.Q[1]], a: M1.P, color: 'd', desde: 4 },
          { de: [M1.P[0], 0], a: [M1.P[0], M1.Q[1]], color: 'd', discontinua: true, desde: 5 },
        ],
        rotulos: [
          { x: 0.27, y: 0.08, texto: 'cos β', color: 'i', ancla: 'start', desde: 2 }, { x: 0.6, y: 0.86, texto: 'sen β', color: 'i', ancla: 'start', desde: 2 },
          { x: 0.67, y: 0.27, texto: 'sen α cos β', color: 'd', ancla: 'start', desde: 3 },
          { x: -0.05, y: 0.76, texto: 'cos α sen β', color: 'd', ancla: 'end', desde: 4 },
        ],
        alt: 'La altura del punto P a 75 grados se parte en dos: la altura de Q más la subida de Q a P',
      },
      voz: 'Cada término de la fórmula es un pedazo de altura que se ve.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La altura de P es el seno del ángulo suma.', ecuacion: ['sen(', su, ') = altura de P'] },
        { estado: { corte: 2 }, texto: 'Bajamos de P al rayo α: un triángulo con hipotenusa 1.', ecuacion: ['OQ = cos ', be, '   ·   ', 'QP = sen ', be] },
        { estado: { corte: 3 }, texto: 'Q está sobre el rayo α: su altura es OQ por sen α.', ecuacion: ['altura de Q = sen ', al, ' · cos ', be] },
        { estado: { corte: 4 }, texto: 'QP está inclinado α respecto de la vertical: sube QP por cos α.', ecuacion: ['subida = cos ', al, ' · sen ', be] },
        { estado: { corte: 5 }, texto: 'Las dos piezas apiladas llegan justo a la línea roja.', ecuacion: [`sen 75° = ${f(M1.h1)} + ${f(M1.h2)} = ${f(M1.P[1])}`] },
      ],
    },
    regla: {
      texto: 'El seno y el coseno de una suma mezclan las razones de los dos ángulos. Para la diferencia se cambia el signo de β.',
      ecuacion: ['sen(', al, ' ± ', be, ') = ', { llave: ['sen ', al, ' cos ', be], nota: 'altura de Q', color: 'c-d' }, ' ± ', { llave: ['cos ', al, ' sen ', be], nota: 'subida de Q a P', color: 'c-d' },
        // Espacios duros (\u00a0): el segundo miembro del coseno no se parte; si no cabe, baja entero.
        '   ·   ', 'cos(', al, ' ± ', be, ') = ', ['cos\u00a0', al, '\u00a0cos\u00a0', be, '\u00a0∓\u00a0sen\u00a0', al, '\u00a0sen\u00a0', be]],
      condicion: 'α y β en la misma unidad. En el coseno el signo se invierte: la suma lleva menos.',
      voz: 'Dos ángulos, cuatro razones; ninguna sobra.',
    },
    ahoraTu: {
      voz: 'Escribe primero la fórmula; después pon los números.',
      generar(sem) {
        const rr = azar(sem);
        const ternas = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
        const i = rr.ent(0, 3); let j = rr.ent(0, 2); if (j >= i) j++;
        const t1 = ternas[i], t2 = ternas[j];
        const giro = rr.ent(0, 1), c1 = t1[2], c2 = t2[2];
        const sa = t1[giro], ca = t1[1 - giro] * (rr.ent(0, 3) === 0 ? -1 : 1), sb = t2[1 - giro], cb = t2[giro];
        const tipo = sem % 4, esSen = tipo < 2, mas = tipo % 2 === 0, sg = mas ? 1 : -1, D = c1 * c2;
        const bien = esSen ? Q(sa * cb + sg * ca * sb, D) : Q(ca * cb - sg * sa * sb, D);
        const reparte = esSen ? Q(sa * c2 + sg * sb * c1, D) : Q(ca * c2 + sg * cb * c1, D);
        const signo = esSen ? Q(sa * cb - sg * ca * sb, D) : Q(ca * cb + sg * sa * sb, D);
        const cruce = esSen ? Q(ca * cb - sg * sa * sb, D) : Q(sa * cb + sg * ca * sb, D);
        const op = mas ? ' + ' : ' − ', fn = esSen ? 'sen' : 'cos';
        return {
          pregunta: ['Si sen ', al, ` = ${qt(Q(sa, c1))}, cos `, al, ` = ${qt(Q(ca, c1))}, sen `, be, ` = ${qt(Q(sb, c2))} y cos `, be, ` = ${qt(Q(cb, c2))}, ¿cuánto vale ${fn}(`, al, op, be, ')?'],
          opciones: opciones(bien, [
            { id: 'reparte', valor: reparte, error: 'COMP-DISTRIB', siFuera: `Eso suma ${fn} α y ${fn} β. Sería cierto si β partiera del eje x; parte del rayo α.` },
            { id: 'signo', valor: signo, error: 'COMP-SIGNO', siFuera: esSen ? 'La fórmula es la buena, con el signo de la otra operación: en el seno el signo se conserva.' : 'La fórmula es la buena, pero en el coseno el signo se invierte: la suma lleva menos.' },
            { id: 'cruce', valor: cruce, error: 'COMP-CRUCE', siFuera: esSen ? 'Esa es la fórmula del coseno. El seno mezcla: sen α cos β ± cos α sen β.' : 'Esa es la fórmula del seno. El coseno junta cos con cos y sen con sen.' },
          ], qt),
          solucion: {
            texto: esSen ? 'El seno mezcla las razones y conserva el signo.' : 'El coseno junta cosenos y senos, con el signo invertido.',
            ecuacion: esSen
              ? [`${fn}(`, al, op, be, `) = ${qp(Q(sa, c1))} · ${qp(Q(cb, c2))}${op}${qp(Q(ca, c1))} · ${qp(Q(sb, c2))} = ${qt(bien)}`]
              : [`${fn}(`, al, op, be, `) = ${qp(Q(ca, c1))} · ${qp(Q(cb, c2))}${mas ? ' − ' : ' + '}${qp(Q(sa, c1))} · ${qp(Q(sb, c2))} = ${qt(bien)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 2: la tangente de la suma y su denominador ----------
  // Cambia: α y β, de 20° en 20°. · Permanece: la recta tangente x = 1, donde cada rayo marca su tangente.
  // Progresa: el punto rojo de α + β, que sube rápido y salta abajo al pasar 90°. · Se reserva: α + β = 90° exacto,
  // que el paso no alcanza (la predicción). · Debe verse: que el rayo de 90° es paralelo a la recta tangente.
  const V2 = { x: [-1.2, 2.3], y: [-1.9, 2.3] }, V2m = { x: [-1.2, 2.3], y: [-0.35, 2.3] };
  function puntoTan(g, color, rot, extra = {}) {
    const t = tan(g);
    if (Math.abs(cos(g)) < 1e-9 || Math.abs(t) > 2.2) return [];
    return [Object.assign({ x: 1, y: t, color, rotulo: rot, lado: 'e' }, extra)];
  }
  function rayoLargo(g, color, extra = {}) {
    // El rayo llega hasta la recta x = 1 (o hasta el borde), y si pasa de 90° se prolonga hacia atrás, discontinuo.
    const t = tan(g), c = cos(g);
    const out = [Object.assign({ ang: g, largo: c > 1e-9 ? Math.min(1 / c, 2.25 / Math.abs(Math.sin(rad(g))) || 1 / c) : 1.15, color }, extra)];
    if (c < -1e-9) {
      const L = Math.min(1 / -c, 2.2 / Math.abs(Math.sin(rad(g))) || 1);
      out.push(Object.assign({ ang: g + 180, largo: L, color, discontinua: true, punta: false }, extra));
    }
    return out;
  }
  function tangente(a, b, extra = {}) {
    const s = a + b, ig = Math.abs(a - b) < 1e-9;
    return Object.assign({
      ventana: V2,
      circulos: [{ r: 1 }],
      segmentos: [{ de: [1, V2.y[0]], a: [1, V2.y[1]], grosor: 'contorno' }],
      rayos: [...rayoLargo(a, 'o'), ...(ig ? [] : rayoLargo(b, 'i')), ...rayoLargo(s, 'h')],
      arcos: [{ de: 0, a, r: 0.22, color: 'o', espiral: 0 }, { de: a, a: s, r: 0.34, color: 'i', espiral: 0 }],
      puntos: [...puntoTan(a, 'o', ig ? 'tan α = tan β' : 'tan α'), ...(ig ? [] : puntoTan(b, 'i', 'tan β')), ...puntoTan(s, 'h', 'tan(α+β)')],
      alt: `Rayos de ${f(a)}°, ${f(b)}° y ${f(s)}° cortan la recta tangente x = 1 a la altura de su tangente`,
    }, extra);
  }
  const TA = deg(Math.atan(2)), TB = deg(Math.atan(0.5)), MA = 45, MB = deg(Math.atan(1 / 3)), MS = MA + MB;
  const tangenteIdea = {
    id: 'tangente-suma',
    titulo: 'La tangente y su denominador',
    temas: ['Seno, coseno y tangente de la suma y la diferencia'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Cada rayo corta la recta x = 1 a la altura de su tangente. Gira α y β; sigue el punto rojo de α + β.',
      voz: 'Mira qué hace el punto rojo cuando α + β se acerca a 90°.',
      controles: [
        { id: 'a', etiqueta: 'α', color: 'c-o', min: 0, max: 60, paso: 20, inicio: 20, unidad: '°', decimales: 0 },
        { id: 'b', etiqueta: 'β', color: 'c-i', min: 0, max: 60, paso: 20, inicio: 20, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: tangente(val.a, val.b), estado: {} }),
      lectura: val => ['tan(', su, `) = ${f(tan(val.a + val.b))} · tan `, al, ' + tan ', be, ` = ${f(tan(val.a) + tan(val.b))}`],
      minimo: 3,
      // Se arrastran el rayo α y la punta del rayo rojo α + β: el punto rojo sube por la recta x = 1.
      arrastres: manijasSuma(val => tangente(val.a, val.b)),
    },
    predice: {
      pregunta: ['Ahora tan ', al, ' = 2 y tan ', be, ' = 1/2. ¿Cuánto vale tan(', su, ')?'],
      voz: 'Calcula también el denominador antes de elegir.',
      opciones: [
        { id: 'c', texto: 'No existe', correcta: true },
        { id: 'reparte', texto: '5/2, que es 2 + 1/2', error: 'TANS-DISTRIB', siFuera: 'Sumar tangentes sería cierto si β saliera del eje x. Sale del rayo α.' },
        { id: 'signo', texto: '5/4, que es (2 + 1/2) entre (1 + 1)', error: 'TANS-SIGNO', siFuera: 'El numerador está bien. En el denominador va 1 − tan α tan β, con menos.' },
        { id: 'cero', texto: '0, porque el denominador da 0', error: 'TANS-CERO', siFuera: 'Ves bien que 1 − 2 · 1/2 = 0. Pero dividir entre cero no da 0: no da ningún número.' },
      ],
      dibujo: { datos: tangente(TA, TB, { ventana: V2m, circulos: [], arcos: [media], segmentos: [{ de: [1, V2m.y[0]], a: [1, V2m.y[1]], grosor: 'contorno' }], rayos: [...rayoLargo(TA, 'o'), ...rayoLargo(TB, 'i')], puntos: [...puntoTan(TA, 'o', 'tan α = 2'), ...puntoTan(TB, 'i', 'tan β = 1/2')] }), estado: {} },
      revelar: { datos: tangente(TA, TB, { ventana: V2m, circulos: [], arcos: [media], segmentos: [{ de: [1, V2m.y[0]], a: [1, V2m.y[1]], grosor: 'contorno' }], rayos: [...rayoLargo(TA, 'o'), ...rayoLargo(TB, 'i'), { ang: 90, largo: 2.2, color: 'h' }], puntos: [...puntoTan(TA, 'o', 'tan α = 2'), ...puntoTan(TB, 'i', 'tan β = 1/2')], rotulos: [{ x: -0.6, y: 1.9, texto: 'α + β = 90°', color: 'h' }] }), estado: {} },
      coincide: 'Coincide: α + β = 90°, y ese rayo es paralelo a la recta x = 1.',
      noCoincide: 'Revisemos el denominador: 1 − 2 · 1/2 = 0. El rayo rojo no corta la recta.',
    },
    mira: {
      datos: {
        ventana: V2m,
        arcos: [media],
        segmentos: [{ de: [1, V2m.y[0]], a: [1, V2m.y[1]], grosor: 'contorno' }],
        rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, ...rayoLargo(MA, 'o'), ...rayoLargo(MB, 'i'), ...rayoLargo(MS, 'h', { desde: 4 }), { ang: 90, largo: 2.2, color: 'h', discontinua: true, desde: 5 }],
        puntos: [...puntoTan(MA, 'o', 'tan α = 1'), ...puntoTan(MB, 'i', 'tan β = 1/3'), ...puntoTan(MS, 'h', 'tan(α+β) = 2', { desde: 4 })],
        rotulos: [{ x: -0.62, y: 1.9, texto: 'si α + β = 90°', color: 'h', desde: 5 }],
        alt: 'Rayos con tangentes 1 y un tercio; el rayo suma corta la recta tangente a altura 2',
      },
      voz: 'La tangente viene del seno y del coseno; su fórmula también.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada tangente es la altura donde su rayo corta x = 1.', ecuacion: ['tan ', al, ' = 1', '   ·   ', 'tan ', be, ' = 1/3'] },
        { estado: { corte: 2 }, texto: 'La tangente de la suma es seno sobre coseno de la suma.', ecuacion: ['tan(', su, ') = ', { frac: [['sen ', al, ' cos ', be, ' + cos ', al, ' sen ', be], ['cos ', al, ' cos ', be, ' − sen ', al, ' sen ', be]] }] },
        { estado: { corte: 3 }, texto: 'Se divide arriba y abajo entre cos α · cos β.', ecuacion: ['tan(', su, ') = ', { frac: [['tan ', al, ' + tan ', be], ['1 − tan ', al, ' tan ', be]] }] },
        { estado: { corte: 4 }, texto: 'Con estos valores sale 2: el rayo rojo corta x = 1 a altura 2.', ecuacion: [{ frac: ['1 + 1/3', '1 − 1 · 1/3'] }, ' = ', { frac: ['4/3', '2/3'] }, ' = 2'] },
        { estado: { corte: 5 }, texto: 'Si tan α · tan β = 1, el denominador es 0: α + β = 90°.', ecuacion: ['1 − tan ', al, ' tan ', be, ' = 0  ⇒  tan(', su, ') no existe'] },
      ],
    },
    regla: {
      texto: 'La tangente de una suma o diferencia se arma con las dos tangentes. Si el denominador se anula, no existe: el ángulo resultante mide 90° más vueltas de 180°.',
      ecuacion: ['tan(', al, ' ± ', be, ') = ', { frac: [['tan ', al, ' ± tan ', be], [{ llave: ['1 ∓ tan ', al, ' tan ', be], nota: 'nunca cero', color: 'c-h' }]] }],
      condicion: 'existen tan α y tan β, y 1 ∓ tan α tan β ≠ 0. Si no, se vuelve a seno y coseno.',
      voz: 'Antes de dividir, revisemos que el denominador no sea cero.',
    },
    ahoraTu: {
      voz: 'Calcula el denominador primero: decide si el resultado existe.',
      generar(sem) {
        const rr = azar(sem);
        const vals = [[1, 2], [1, 3], [2, 1], [3, 1], [1, 4], [3, 4], [4, 3], [2, 3], [3, 2], [1, 1], [1, 5], [5, 1], [1, 7]].map(([n, d]) => Q(n, d));
        const mas = sem % 2 === 0;
        const x = rr.uno(vals);
        // Una de cada cuatro sumas trae el caso del denominador nulo (y = 1/x).
        const y = mas && sem % 8 === 0 ? Q(x[1], x[0]) : rr.uno(vals.filter(v => qt(v) !== qt(x)));
        const num = mas ? qs(x, y) : qr(x, y), den = mas ? qr([1, 1], qm(x, y)) : qs([1, 1], qm(x, y));
        const bien = qd(num, den);
        const op = mas ? ' + ' : ' − ';
        const ops = bien === null
          ? opciones('No existe', [
            { id: 'reparte', valor: qt(num), error: 'TANS-DISTRIB', siFuera: 'Ese es el numerador solo. La fórmula también divide entre 1 − tan α tan β.' },
            { id: 'cero', valor: '0', error: 'TANS-CERO', siFuera: 'Ves bien que el denominador es 0. Pero dividir entre cero no da 0.' },
            { id: 'signo', valor: qt(qd(num, qs([1, 1], qm(x, y)))), error: 'TANS-SIGNO', siFuera: 'Para la suma, el denominador lleva menos: 1 − tan α tan β.' },
          ], v => v)
          : opciones(bien, [
            { id: 'reparte', valor: num, error: 'TANS-DISTRIB', siFuera: `Eso ${mas ? 'suma' : 'resta'} las tangentes. Faltaría dividir entre el denominador de la fórmula.` },
            { id: 'signo', valor: qd(num, mas ? qs([1, 1], qm(x, y)) : qr([1, 1], qm(x, y))), error: 'TANS-SIGNO', siFuera: `El numerador está bien. En el denominador va 1 ${mas ? '−' : '+'} tan α tan β.` },
            { id: 'inversa', valor: qd(den, num), error: 'TANS-SIGNO', siFuera: 'Eso pone la fracción de cabeza: arriba van las tangentes, abajo el 1.' },
          ], qt);
        return {
          pregunta: ['Si tan ', al, ` = ${qt(x)} y tan `, be, ` = ${qt(y)}, ¿cuánto vale tan(`, al, op, be, ')?'],
          opciones: ops,
          solucion: {
            texto: bien === null ? 'El denominador se anula: la tangente de la suma no existe.' : 'Numerador y denominador por separado; después se divide.',
            ecuacion: ['tan(', al, op, be, ') = ', { frac: [`${qt(num)}`, `${qt(den)}`] }, bien === null ? '  (no existe)' : ` = ${qt(bien)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 3: a sen x + b cos x es una sola onda ----------
  // Cambia: a y b, enteros. · Permanece: los ejes de 0° a 360° y la escala vertical.
  // Progresa: la onda roja suma, cuya cresta crece como la hipotenusa de a y b. · Se reserva: el par 3 y 4 (la
  // predicción). · Debe verse: que la cresta mide √(a² + b²), no a + b.
  const ondas = (a, b, ymax, extra = {}) => {
    const R = Math.hypot(a, b), xm = ((deg(Math.atan2(a, b)) % 360) + 360) % 360;
    const pts = fn => Array.from({ length: 73 }, (_, i) => [i * 5, fn(i * 5)]);
    return Object.assign({
      x: { min: 0, max: 360, paso: 90, nombre: 'x', unidad: '°', decimales: 0 },
      y: { min: -ymax, max: ymax, paso: 1, cada: ymax > 3 ? 5 : 1, decimales: 0 },
      curvas: [
        { puntos: pts(x => a * sen(x)), color: 'o', discontinua: true, rotulo: `${f(a)} sen x`, en: [150, a * sen(150)] },
        { puntos: pts(x => b * cos(x)), color: 'i', discontinua: true, rotulo: `${f(b)} cos x`, en: [315, b * cos(315)] },
        { puntos: pts(x => a * sen(x) + b * cos(x)), color: 'h' },
      ],
      puntos: [{ x: xm, y: R, color: 'h', rotulo: `máx ${f(R)}`, guias: true }],
    }, extra);
  };
  // Manijas de las crestas: la de a sen x en x = 90° (altura a) y la de b cos x en x = 0° (altura b).
  const crestas = ymax => [
    { id: 'cresta-a', etiqueta: 'cresta de a sen x', color: 'c-o',
      donde: v => { const g = EJES().geometria(ondas(v.a, v.b, ymax)); return { x: g.X(90), y: g.Y(v.a) }; },
      mover: (pt, v) => ({ a: inversa(y => EJES().geometria(ondas(v.a, v.b, ymax)).Y(y), -ymax, ymax)(pt.y) }) },
    { id: 'cresta-b', etiqueta: 'cresta de b cos x', color: 'c-i',
      donde: v => { const g = EJES().geometria(ondas(v.a, v.b, ymax)); return { x: g.X(0), y: g.Y(v.b) }; },
      mover: (pt, v) => ({ b: inversa(y => EJES().geometria(ondas(v.a, v.b, ymax)).Y(y), -ymax, ymax)(pt.y) }) },
  ];
  const aux = {
    id: 'una-sola-onda',
    titulo: 'Dos ondas, una sola cresta',
    temas: ['Identidades auxiliares'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige a y b. La onda roja suma a sen x y b cos x, punto por punto. Fíjate cuánto sube su cresta.',
      voz: 'Compara la cresta roja con a + b.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 2, paso: 1, inicio: 1, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: val => ({ datos: ondas(val.a, val.b, 3), estado: {} }),
      lectura: val => ['cresta ', R_, ` = ${f(Math.hypot(val.a, val.b))} · `, a_, ' + ', b_, ` = ${f(val.a + val.b)}`],
      minimo: 3,
      // Se arrastran las crestas de las dos ondas punteadas (a en x = 90°, b en x = 0°): la onda roja responde.
      arrastres: crestas(3),
    },
    predice: {
      pregunta: '¿Cuál es el mayor valor que toma 3 sen x + 4 cos x, cuando x recorre todos los ángulos?',
      voz: 'Las dos crestas no llegan en el mismo x.',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'suma', texto: '7, que es 3 + 4', error: 'AUX-SUMA', siFuera: 'Sumar crestas sería cierto si las dos ondas llegaran a su máximo en el mismo x. No llegan.' },
        { id: 'cuadrado', texto: '25, que es 3² + 4²', error: 'AUX-CUADRADO', siFuera: 'La suma de cuadrados es el camino; falta sacarle la raíz cuadrada.' },
        { id: 'mayor', texto: '4, el mayor de los dos', error: 'AUX-MAYOR', siFuera: 'Cada onda sola llega a 3 o a 4. Juntas suben más, aunque menos que 7.' },
      ],
      dibujo: { datos: ondas(3, 4, 6, { curvas: ondas(3, 4, 6).curvas.slice(0, 2), puntos: [] }), estado: {} },
      revelar: { datos: ondas(3, 4, 6), estado: {} },
      coincide: 'Coincide: la cresta roja llega a 5, la hipotenusa de 3 y 4.',
    },
    mira: {
      datos: Object.assign(ondas(3, 4, 6), {
        curvas: ondas(3, 4, 6).curvas.map((c, k) => Object.assign({}, c, { desde: k === 2 ? 3 : 0 })),
        puntos: [
          { x: deg(Math.atan2(3, 4)), y: 5, color: 'h', rotulo: `máx 5 en x ≈ ${f(deg(Math.atan2(3, 4)), 1)}°`, guias: true, desde: 4 },
          { x: deg(Math.atan2(3, 4)) + 180, y: -5, color: 'h', guias: true, desde: 4 },
        ],
      }),
      voz: 'Saquemos la raíz como factor común; queda una sola onda.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Las dos ondas tienen su cresta en x distintos.', ecuacion: [a_, ' sen x + ', b_, ' cos x = 3 sen x + 4 cos x'] },
        { estado: { corte: 2 }, texto: 'Se saca de factor común la raíz de a² + b².', ecuacion: ['= 5', { par: [{ frac: ['3', '5'] }, ' sen x + ', { frac: ['4', '5'] }, ' cos x'] }] },
        { estado: { corte: 3 }, texto: '3/5 y 4/5 son el coseno y el seno de φ.', ecuacion: ['= 5(sen x cos φ + cos x sen φ) = 5 sen(x + φ)'] },
        { estado: { corte: 4 }, texto: 'El seno va de −1 a 1: la onda, de −5 a 5.', ecuacion: [`φ ≈ ${f(deg(Math.atan2(4, 3)), 2)}°`, '   ·   ', '−5 ≤ 3 sen x + 4 cos x ≤ 5'] },
      ],
    },
    regla: {
      texto: 'Una suma a sen x + b cos x es una sola onda de amplitud R. Por eso su máximo es R y su mínimo es −R.',
      ecuacion: [a_, ' sen x + ', b_, ' cos x = ', { llave: [R_, '\u00a0sen(x\u00a0+\u00a0φ)'], nota: 'una sola onda', color: 'c-h' }, '   ·   ', R_, ' = ', { raiz: [{ sup: [a_, '2'] }, ' + ', { sup: [b_, '2'] }] }],
      condicion: 'el mismo x en los dos términos; cos φ = a/R y sen φ = b/R. Una constante mueve los dos extremos.',
      voz: 'La raíz junta las dos ondas; el seno decide hasta dónde llega.',
    },
    ahoraTu: {
      voz: 'Primero la amplitud; después la constante que sube o baja todo.',
      generar(sem) {
        const rr = azar(sem);
        const [p, q, r] = rr.uno([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [12, 5, 13], [4, 3, 5]]);
        const a = p * (rr.ent(0, 3) === 0 ? -1 : 1), b = q * (rr.ent(0, 2) === 0 ? -1 : 1), k = rr.ent(-4, 4), pideMax = sem % 2 === 0;
        const bien = pideMax ? r + k : -r + k;
        const exp = `${f(a)} sen x ${b < 0 ? '−' : '+'} ${f(Math.abs(b))} cos x${k ? ` ${k < 0 ? '−' : '+'} ${f(Math.abs(k))}` : ''}`.replace(/^1 sen/, 'sen');
        return {
          pregunta: [`¿Cuál es el ${pideMax ? 'mayor' : 'menor'} valor de y = ${exp}?`],
          opciones: opciones(bien, [
            { id: 'suma', valor: (pideMax ? 1 : -1) * (Math.abs(a) + Math.abs(b)) + k, error: 'AUX-SUMA', siFuera: 'Sumar amplitudes sería cierto si las dos ondas tuvieran su cresta en el mismo x.' },
            { id: 'sin-k', valor: k ? (pideMax ? r : -r) : null, error: 'AUX-SIN-K', siFuera: 'La amplitud está bien; falta sumar la constante, que sube o baja toda la onda.' },
            { id: 'signo', valor: pideMax ? -r + k : r + k, error: 'AUX-SIGNO', siFuera: `Ese es el ${pideMax ? 'menor' : 'mayor'} valor: se piden el otro extremo de la onda.` },
            { id: 'cuadrado', valor: (pideMax ? 1 : -1) * r * r + k, error: 'AUX-CUADRADO', siFuera: 'La suma de cuadrados es el camino; falta sacarle la raíz.' },
          ], v => f(v)),
          solucion: {
            texto: `La amplitud es ${f(r)}; la constante ${f(k)} se suma al extremo.`,
            ecuacion: [R_, ` = √(${f(a * a)} + ${f(b * b)}) = ${f(r)}`, '   ·   ', `y = ${pideMax ? '' : '−'}${f(r)} ${k < 0 ? '−' : '+'} ${f(Math.abs(k))} = ${f(bien)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 4: tres ángulos que suman 180° ----------
  // Cambia: A y B del triángulo, de 20° en 20°; C = 180° − A − B. · Permanece: la base del triángulo.
  // Progresa: la suma y el producto de las tres tangentes, que siempre coinciden. · Se reserva: tan C con tan A = 1
  // y tan B = 2 (la predicción). · Debe verse: que la tercera tangente queda fijada por las otras dos.
  function triangulo(a, b, textos = {}, extra = {}) {
    const c = 180 - a - b, ac = sen(b) / sen(c);
    const P = [{ id: 'A', x: 0, y: 0, rotulo: 'A' }, { id: 'B', x: 1, y: 0, rotulo: 'B' }, { id: 'C', x: ac * cos(a), y: ac * sen(a), rotulo: 'C' }];
    return Object.assign({
      puntos: P,
      lados: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }],
      angulos: [
        { en: 'A', de: 'B', a: 'C', texto: textos.A || `${f(a, 1)}°`, color: 'o' },
        { en: 'B', de: 'C', a: 'A', texto: textos.B || `${f(b, 1)}°`, color: 'i' },
        Object.assign({ en: 'C', de: 'A', a: 'B', texto: textos.C || `${f(c, 1)}°`, color: 'h' }, textos.Cfinal ? { final: textos.Cfinal } : {}),
      ],
    }, extra);
  }
  const T1 = 45, T2 = deg(Math.atan(2));
  // Manija del vértice C: del dedo al punto del problema (inversa de la escala única de la pieza) y de ahí a A y B.
  const verticeC = (datos, A = 'a', B = 'b') => ({
    id: 'vertice-c', etiqueta: 'vértice C: cambia A y B', color: 'c-h',
    donde: v => { const d = datos(v), c = d.puntos[2]; return { x: TRI().geometria(d).X(c.x), y: TRI().geometria(d).Y(c.y) }; },
    mover: (pt, v) => {
      const g = TRI().geometria(datos(v)), x = (pt.x - g.X(0)) / g.s, y = (g.Y(0) - pt.y) / g.s;
      return { [A]: deg(Math.atan2(y, x)), [B]: deg(Math.atan2(y, 1 - x)) };
    },
  });
  const tres = {
    id: 'tres-angulos',
    titulo: 'Tres ángulos que suman 180°',
    temas: ['Suma de tres ángulos'],
    pieza: 'triangulo',
    juega: {
      consigna: 'Elige A y B; el triángulo fija C = 180° − A − B. Compara la suma de las tres tangentes con su producto.',
      voz: 'Prueba un triángulo obtusángulo también.',
      controles: [
        { id: 'a', etiqueta: 'A', color: 'c-o', min: 20, max: 60, paso: 20, inicio: 40, unidad: '°', decimales: 0 },
        { id: 'b', etiqueta: 'B', color: 'c-i', min: 20, max: 60, paso: 20, inicio: 20, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: triangulo(val.a, val.b), estado: {} }),
      lectura: val => {
        const ts = [val.a, val.b, 180 - val.a - val.b].map(tan);
        return [C, ` = ${f(180 - val.a - val.b)}° · suma de tangentes ${f(ts[0] + ts[1] + ts[2])} · producto ${f(ts[0] * ts[1] * ts[2])}`];
      },
      minimo: 3,
      // Se arrastra el vértice C: fija A y B a la vez (la base AB queda quieta).
      arrastres: [verticeC(val => triangulo(val.a, val.b))],
    },
    predice: {
      pregunta: ['En un triángulo, tan ', A, ' = 1 y tan ', B, ' = 2. ¿Cuánto vale tan ', C, '?'],
      voz: 'Usa lo que viste entre la suma y el producto.',
      opciones: [
        { id: 'c', texto: '3', correcta: true },
        { id: 'suple', texto: '−3', error: 'TRES-SUPLE', siFuera: 'tan(A + B) = −3 está bien calculado. Pero C = 180° − (A + B): el signo cambia.' },
        { id: 'cero', texto: '0', error: 'TRES-CERO', siFuera: 'Es cierto que tan 180° = 0, pero eso no hace cero a tan C.' },
        { id: 'falta', texto: 'No se puede saber', error: 'TRES-FALTA', siFuera: 'Faltaría un dato si los ángulos fueran libres. En un triángulo, A y B fijan C.' },
      ],
      dibujo: { datos: triangulo(T1, T2, { A: 'tan 1', B: 'tan 2', C: '¿?' }), estado: {} },
      revelar: { datos: triangulo(T1, T2, { A: 'tan 1', B: 'tan 2', C: 'tan 3' }), estado: {} },
      coincide: 'Coincide: 1 + 2 + 3 = 6 y 1 · 2 · 3 = 6.',
    },
    mira: {
      datos: triangulo(T1, T2, { A: 'tan 1', B: 'tan 2', C: 'C', Cfinal: 'tan 3' }),
      voz: 'Sumemos de dos en dos: primero A + B, después C.',
      pasos: [
        { estado: { paso: 0 }, texto: 'C es lo que les falta a A y B para 180°.', ecuacion: [C, ' = 180° − (', A, ' + ', B, ')', '   ·   ', 'tan ', C, ' = −tan(', A, ' + ', B, ')'] },
        { estado: { paso: 0 }, texto: 'La tangente de A + B, con la fórmula de dos ángulos.', ecuacion: ['tan(', A, ' + ', B, ') = ', { frac: ['1 + 2', '1 − 1 · 2'] }, ' = −3'] },
        { estado: { paso: 0, final: true }, texto: 'Cambia el signo por el suplemento: tan C = 3.', ecuacion: ['tan ', C, ' = −(−3) = 3'] },
        { estado: { paso: 0, final: true }, texto: 'Con tres ángulos que suman 180°, la suma de tangentes iguala al producto.', ecuacion: ['1 + 2 + 3 = 6 = 1 · 2 · 3'] },
      ],
    },
    regla: {
      texto: 'Tres ángulos se suman de dos en dos. Si suman 180°, la tangente del total es 0, y la suma de las tres tangentes iguala su producto.',
      // Con espacios duros (\u00a0) cada miembro queda entero: si no cabe, la línea se parte en el «=».
      ecuacion: [{ llave: ['tan\u00a0', A, '\u00a0+\u00a0tan\u00a0', B, '\u00a0+\u00a0tan\u00a0', C], nota: 'la suma' }, ' = ', { llave: ['tan\u00a0', A, '\u00a0·\u00a0tan\u00a0', B, '\u00a0·\u00a0tan\u00a0', C], nota: 'el producto' }],
      condicion: 'A + B + C = 180° y ninguno mide 90°: si uno mide 90°, su tangente no existe.',
      voz: 'Sumar de dos en dos conserva cada signo.',
    },
    ahoraTu: {
      pieza: 'triangulo',
      voz: 'Primero tan(A + B); después el signo del suplemento.',
      generar(sem) {
        const rr = azar(sem);
        const vals = [[1, 1], [2, 1], [3, 1], [1, 2], [1, 3], [3, 2], [4, 3], [5, 1], [3, 4], [2, 3]].map(([n, d]) => Q(n, d));
        const x = rr.uno(vals);
        const y = rr.uno(vals.filter(v => Math.abs(qv(qm(x, v)) - 1) > 1e-9));
        const bien = qd(qs(x, y), qr(qm(x, y), [1, 1]));   // tan C = (x + y)/(xy − 1)
        const a = deg(Math.atan(qv(x))), b = deg(Math.atan(qv(y)));
        return {
          pregunta: ['En un triángulo ABC, tan ', A, ` = ${qt(x)} y tan `, B, ` = ${qt(y)}. ¿Cuánto vale tan `, C, '?'],
          dibujo: { datos: triangulo(a, b, { A: `tan ${qt(x)}`, B: `tan ${qt(y)}`, C: '¿?' }), estado: {} },
          opciones: opciones(bien, [
            { id: 'suple', valor: Q(-bien[0], bien[1]), error: 'TRES-SUPLE', siFuera: 'Ese es tan(A + B). Como C = 180° − (A + B), el signo cambia.' },
            { id: 'suma', valor: qs(x, y), error: 'TRES-SUMA', siFuera: 'Sumar tangentes no da la del ángulo que falta: la fórmula también divide.' },
            { id: 'prod', valor: qm(x, y), error: 'TRES-PROD', siFuera: 'El producto aparece en la fórmula, pero solo dentro del denominador 1 − tan A tan B.' },
          ], qt),
          solucion: {
            texto: 'tan C es menos la tangente de A + B.',
            ecuacion: ['tan ', C, ' = −', { frac: [`${qt(x)} + ${qt(y)}`, `1 − ${qt(qm(x, y))}`] }, ` = ${qt(bien)}`],
            dibujo: { datos: triangulo(a, b, { A: `tan ${qt(x)}`, B: `tan ${qt(y)}`, C: `tan ${qt(bien)}` }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: suma y diferencia con giros libres (β negativo resta), para seno o coseno: la línea roja es el valor
  // real y la torre apila los dos valores sueltos (vertical para el seno, horizontal para el coseno).
  const VL = { x: [-2.1, 2.1], y: [-2.1, 2.1] };
  function sumaLibre(a, b, fn) {
    const s = a + b, esSen = fn === 'sen', F = esSen ? sen : cos, v1 = F(a), v2 = F(b);
    const torre = esSen
      ? [{ de: [1.6, 0], a: [1.6, v1], color: 'o', rotulo: 'sen α' }, { de: [1.6, v1], a: [1.6, v1 + v2], color: 'i', rotulo: 'sen β' }]
      : [{ de: [0, -1.6], a: [v1, -1.6], color: 'o' }, { de: [v1, -1.6], a: [v1 + v2, -1.6], color: 'i' }];
    // En la torre horizontal, los rótulos van uno abajo y otro arriba, para que no se pisen si un tramo es corto.
    const rot = esSen ? [] : [{ x: v1 / 2, y: -1.95, texto: 'cos α', color: 'o' }, { x: v1 + v2 / 2, y: -1.38, texto: 'cos β', color: 'i' }];
    return {
      ventana: VL, circulos: [{ r: 1 }],
      rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: a, color: 'o' }, { ang: s, color: 'h' }],
      arcos: [{ de: 0, a, r: 0.22, color: 'o', espiral: 0 }, { de: a, a: s, r: 0.36, color: 'i', espiral: 0 }],
      rectas: [esSen ? { y: sen(s), color: 'h' } : { x: cos(s), color: 'h' }],
      segmentos: torre.filter(t => Math.abs(t.a[0] - t.de[0]) + Math.abs(t.a[1] - t.de[1]) > 1e-9), rotulos: rot,
      alt: `Giro de ${f(a)}° y después ${f(b)}°: ${fn} de la suma ${f(F(s))}; ${fn} α + ${fn} β = ${f(v1 + v2)}`,
    };
  }

  return {
    unidad: 'trigonometria.arcos-compuestos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/triangulo.js'],
    // Laboratorio (docs/teoria.md §4b): tres mesas sin preguntas. La primera abre los giros a la diferencia (β
    // negativo) y al coseno, que la idea 1 no deja probar; la segunda mueve la tangente de grado en grado, hasta el
    // caso exacto α + β = 90° (la idea 2 va de 20° en 20°) con el denominador a la vista; la tercera suelta a y b,
    // con negativos y medios, para comparar la cresta R con a + b.
    laboratorio: [
      {
        id: 'suma-diferencia', titulo: 'Suma o diferencia, seno o coseno', pieza: 'trig-plano',
        consigna: 'Arrastra el rayo α y la punta roja; con β negativo, restas. Compara la línea roja con la torre de los dos valores.',
        controles: [
          { id: 'a', etiqueta: 'α', color: 'c-o', min: 0, max: 180, paso: 5, inicio: 50, unidad: '°', decimales: 0 },
          { id: 'b', etiqueta: 'β', color: 'c-i', min: -90, max: 180, paso: 5, inicio: 60, unidad: '°', decimales: 0 },
          { id: 'fn', etiqueta: 'Razón', opciones: [{ valor: 'sen', texto: 'seno' }, { valor: 'cos', texto: 'coseno' }] },
        ],
        dibujo: v => ({ datos: sumaLibre(v.a, v.b, v.fn), estado: {} }),
        lectura: v => {
          const F = v.fn === 'sen' ? sen : cos, s = v.a + v.b;
          return [`${v.fn}(${f(s)}°) = ${f(F(s))} · ${v.fn} `, al, ` + ${v.fn} `, be, ` = ${f(F(v.a) + F(v.b))}`];
        },
        arrastres: manijasSuma(v => sumaLibre(v.a, v.b, v.fn)),
      },
      {
        id: 'tangente-fina', titulo: 'La tangente, grado a grado', pieza: 'trig-plano',
        consigna: 'Arrastra los rayos de grado en grado hasta que α + β llegue a 90°. Mira el denominador de la fórmula.',
        controles: [
          { id: 'a', etiqueta: 'α', color: 'c-o', min: 0, max: 80, paso: 1, inicio: 55, unidad: '°', decimales: 0 },
          { id: 'b', etiqueta: 'β', color: 'c-i', min: 0, max: 80, paso: 1, inicio: 10, unidad: '°', decimales: 0 },
        ],
        dibujo: v => ({ datos: tangente(v.a, v.b), estado: {} }),
        lectura: v => {
          const den = 1 - tan(v.a) * tan(v.b), s = v.a + v.b;
          const t = Math.abs(cos(s)) < 1e-9 ? 'no existe' : f(tan(s));
          return [`α + β = ${f(s)}° · tan = ${t} · denominador ${f(Math.abs(den) < 5e-3 ? 0 : den)}`];
        },
        arrastres: manijasSuma(v => tangente(v.a, v.b)),
      },
      {
        id: 'ondas-libres', titulo: 'Dos ondas, cualquier par', pieza: 'ejes',
        consigna: 'Arrastra las crestas punteadas, también hacia abajo. La lectura compara la cresta roja R con a + b.',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-o', min: -5, max: 5, paso: 0.5, inicio: 3, decimales: 1 },
          { id: 'b', etiqueta: 'b', color: 'c-i', min: -5, max: 5, paso: 0.5, inicio: 4, decimales: 1 },
        ],
        dibujo: v => ({ datos: ondas(v.a, v.b, 8), estado: {} }),
        lectura: v => [a_, ` = ${f(v.a)} · `, b_, ` = ${f(v.b)} · `, R_, ` = ${f(Math.hypot(v.a, v.b))} · `, a_, ' + ', b_, ` = ${f(v.a + v.b)}`],
        arrastres: crestas(8),
      },
    ],
    historia: {
      texto: 'En el Almagesto, Ptolomeo armó una tabla de cuerdas para la astronomía combinando y partiendo arcos ya conocidos. Usaba cuerdas en un círculo grande, no senos en uno de radio 1, pero la idea era la misma: con los valores de dos arcos se obtiene el de su suma. Y nunca sumando sin más las dos cuerdas.',
      pregunta: '¿Cómo sacar un valor nuevo de dos que ya conoces?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Claudius Ptolemy», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Ptolemy/' },
    },
    ideas: [seno, tangenteIdea, aux, tres],
  };
});
