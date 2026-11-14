/*
 * Teoría de «Funciones trigonométricas» (trigonometria.funciones-trigonometricas), 5.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 13), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (trigonometría, pp. 82–100) y las «Precisiones de Geometría y Trigonometría» del expediente (precisión 3: el periodo
 * depende de la función y de su transformación).
 * Forma: contenido/teoria/trigonometria/angulo-trigonometrico.js. Figura: la pieza nueva nucleo/kit/piezas/trig-onda.js
 * (eje x en radianes con marcas de π, asíntotas, llave del periodo).
 * Compañera: Mara (coneja), cercana y rigurosa: el periodo se mide sobre el eje, no se supone.
 * Colores (regla 4): la variable x en naranja (c-o); la función y su altura, y la amplitud A, en rojo (c-h); el
 * coeficiente B de x en turquesa (c-i); el periodo T en verde (c-d). Las curvas de referencia van en tinta, discontinuas.
 * Errores (hipótesis de distractor: docs/investigacion/trigonometria-ideas-erroneas.md no los mide; códigos nuevos
 * de esta unidad): FUN-DOMINIO (x pasa de 2π y «no existe»), FUN-LINEAL, FUN-SIGNO, FUN-CRUCE, PER-FIJO (todo periodo
 * es 2π), PER-MULT (2π · B), PER-AMPLITUD, PER-TAN (tan con 2π/B), TAN-RANGO, TAN-VENTANA, TAN-ASINTOTA,
 * SEC-CONFUNDE, SEC-INVERSO, SEC-ASINTOTA, SEC-RANGO-SENO, SEC-TODO, SEC-SIN-D, PER-MENOR, PER-SUMA.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: cada función trigonométrica se reconoce por su rango, sus asíntotas y su periodo, medido sobre el eje x.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: da dominio, rango y periodo como tres respuestas separadas, también de A sen(Bx + C) + D y de sumas.
 *   Orden de atención: 1.º la curva roja · 2.º la llave verde del periodo · acción: mover el parámetro · fondo: las marcas de π.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿toda función trigonométrica se repite cada 2π, y por qué sec x nunca vale 1/2?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x_ = { v: 'c-o', t: 'x' }, A_ = { v: 'c-h', t: 'A' }, B_ = { v: 'c-i', t: 'B' }, T_ = { v: 'c-d', t: 'T' }, y_ = { v: 'c-h', t: 'y' };
  const PI = Math.PI;
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  // (p/q)·π como texto: 13/6 → «13π/6», −1/2 → «−π/2», 2 → «2π».
  function piQ(p, q = 1) {
    if (p === 0) return '0';
    if (q < 0) { p = -p; q = -q; }
    const g = mcd(p, q), nu = p / g, de = q / g, a = Math.abs(nu);
    return `${nu < 0 ? '−' : ''}${a === 1 ? '' : a}π${de === 1 ? '' : '/' + de}`;
  }
  const qt = (p, q = 1) => { if (q < 0) { p = -p; q = -q; } const g = mcd(p, q) || 1; return `${p < 0 ? '−' : ''}${Math.abs(p / g)}${q / g === 1 ? '' : '/' + q / g}`; };
  // Azar con semilla para «Ahora tú» (el de la unidad de referencia).
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un texto se descartan.
  function opciones(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) {
      if (d.valor === null || d.valor === undefined || vistos.has(d.valor)) continue;
      vistos.add(d.valor);
      ops.push({ id: d.id, texto: d.valor, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const muestra = (fn, a, b, n = 160) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
  // Ramas separadas por las asíntotas: entre cada par de asíntotas, una poligonal; null entre ramas.
  function ramas(fn, a, b, asint, n = 70) {
    const cortes = [a, ...asint.filter(x => x > a && x < b), b], pts = [];
    for (let i = 0; i < cortes.length - 1; i++) {
      const lo = cortes[i] + (asint.includes(cortes[i]) ? 1e-3 : 0), hi = cortes[i + 1] - (asint.includes(cortes[i + 1]) ? 1e-3 : 0);
      pts.push(...muestra(fn, lo, hi, n), null);
    }
    return pts;
  }
  // Valores exactos de sen y cos en múltiplos de π/6 y π/4 (en grados, para no arrastrar decimales).
  const EXACTO = { 0: '0', 30: '1/2', 45: '√2/2', 60: '√3/2', 90: '1' };
  function exacto(fn, g) {
    const m = ((g % 360) + 360) % 360, s = fn === 'sen' ? Math.sin(m * PI / 180) : Math.cos(m * PI / 180);
    if (Math.abs(s) < 1e-9) return '0';
    const ref = Math.round(Math.asin(Math.min(1, Math.abs(s))) * 180 / PI);
    return `${s < 0 ? '−' : ''}${EXACTO[ref]}`;
  }

  // ---------- Idea 1: la altura que gira, desenrollada ----------
  // Cambia: x, de 30° en 30°, en una vuelta. · Permanece: las marcas de π y la franja de alturas entre −1 y 1.
  // Progresa: la curva roja, que se dibuja hasta x. · Se reserva: un x de la segunda vuelta (la predicción).
  // · Debe verse: que la curva no sale de [−1, 1] y que después de 2π vuelve a empezar.
  const FN = { sen: Math.sin, cos: Math.cos };
  const onda1 = (fn, g, extra = {}) => {
    const x = g * PI / 180, F = FN[fn];
    return Object.assign({
      x: { min: 0, max: 2 * PI, cada: 2 }, y: { min: -1.9, max: 1.5, paso: 0.5, decimales: 1 },
      rectas: [{ y: 1, color: 'h' }, { y: -1, color: 'h' }],
      curvas: [...(x > 0 ? [{ puntos: muestra(F, 0, x, Math.max(2, Math.round(g / 3))), color: 'h' }] : []),
        { puntos: [[x, 0], [x, F(x)]], color: 'o' }],
      puntos: [{ x, y: F(x), color: 'h', rotulo: `${fn} x = ${f(F(x))}`, lado: x > 4 ? 'no' : 'ne' }],
      alt: `Gráfica de ${fn} x dibujada de 0 a ${f(g)} grados; su altura en ese punto es ${f(F(x))}`,
    }, extra);
  };
  const senCos = {
    id: 'altura-desenrollada',
    titulo: 'La altura, desenrollada',
    temas: ['Funciones seno y coseno'],
    pieza: 'trig-onda',
    juega: {
      consigna: 'Avanza x y mira cómo la curva roja registra la altura de seno o de coseno. Las líneas rojas marcan 1 y −1.',
      voz: 'Sigue el punto: ¿alguna vez sale de las líneas rojas?',
      controles: [
        { id: 'g', etiqueta: 'x', color: 'c-o', min: 0, max: 360, paso: 30, inicio: 60, unidad: '°', decimales: 0 },
        { id: 'fn', etiqueta: 'Función', opciones: [{ valor: 'sen', texto: 'sen x' }, { valor: 'cos', texto: 'cos x' }], inicio: 'sen' },
      ],
      dibujo: val => ({ datos: onda1(val.fn, val.g), estado: {} }),
      lectura: val => [x_, ` = ${f(val.g)}° = ${piQ(val.g, 180)}; ${val.fn} `, x_, ` = ${f(FN[val.fn](val.g * PI / 180))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['El juego llegó hasta 2π. ¿Cuánto vale sen(13π/6)?'],
      voz: 'Piensa en el giro: 13π/6 es una vuelta y un poco más.',
      opciones: [
        { id: 'c', texto: '1/2, lo mismo que sen(π/6)', correcta: true },
        { id: 'dominio', texto: 'No existe: x pasa de 2π', error: 'FUN-DOMINIO', siFuera: 'El juego paró en 2π, pero el giro sigue: el seno existe para todo x real.' },
        { id: 'lineal', texto: '13/2, trece veces sen(π/6)', error: 'FUN-LINEAL', siFuera: 'Multiplicar sería cierto si el seno fuera proporcional al ángulo. Además, nunca pasa de 1.' },
        { id: 'signo', texto: '−1/2', error: 'FUN-SIGNO', siFuera: 'El valor 1/2 está bien. 13π/6 cae en el primer cuadrante: el seno es positivo.' },
      ],
      dibujo: { datos: onda1('sen', 360, { x: { min: 0, max: 4 * PI, cada: 2 }, puntos: [], curvas: [{ puntos: muestra(Math.sin, 0, 2 * PI), color: 'h' }] }), estado: {} },
      revelar: { datos: onda1('sen', 360, { x: { min: 0, max: 4 * PI, cada: 2 }, curvas: [{ puntos: muestra(Math.sin, 0, 4 * PI), color: 'h' }],
        puntos: [{ x: PI / 6, y: 0.5, color: 'h', rotulo: '1/2', lado: 'n' }, { x: 13 * PI / 6, y: 0.5, color: 'h', rotulo: '1/2', lado: 'n' }],
        periodos: [{ de: PI / 6, a: 13 * PI / 6, y: -1.7, color: 'd', rotulo: '2π' }] }), estado: {} },
      coincide: 'Coincide: después de 2π la curva repite exactamente lo mismo.',
    },
    mira: {
      datos: {
        x: { min: -PI, max: 3 * PI, cada: 2 }, y: { min: -1.9, max: 1.5, paso: 0.5, decimales: 1 },
        rectas: [{ y: 1, color: 'h', desde: 2 }, { y: -1, color: 'h', desde: 2 }],
        curvas: [{ puntos: muestra(Math.sin, -PI, 3 * PI), color: 'h', rotulo: 'sen x', en: [PI / 2, 1], lado: 'n' },
          { puntos: muestra(Math.cos, -PI, 3 * PI), color: 'h', discontinua: true, rotulo: 'cos x', en: [2 * PI, 1], lado: 'n', desde: 4 }],
        periodos: [{ de: 0, a: 2 * PI, y: -1.7, color: 'd', rotulo: 'T = 2π', desde: 3 }],
        alt: 'Gráficas de seno y coseno entre menos pi y 3 pi: entre −1 y 1, se repiten cada 2 pi; el coseno es el seno corrido pi medios',
      },
      voz: 'Dominio, rango y periodo: tres preguntas distintas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada x real es un giro: el seno existe para todo x.', ecuacion: ['Dom = ℝ'] },
        { estado: { corte: 2 }, texto: 'La altura de un punto del círculo va de −1 a 1.', ecuacion: ['Ran = [−1, 1]'] },
        { estado: { corte: 3 }, texto: 'Una vuelta más deja todo igual: se repite cada 2π.', ecuacion: ['sen(', x_, ' + 2π) = sen ', x_] },
        { estado: { corte: 4 }, texto: 'El coseno es la misma onda, adelantada π/2.', ecuacion: ['cos ', x_, ' = sen(', x_, ' + π/2)'] },
        { estado: { corte: 4 }, texto: 'El seno es impar y el coseno es par.', ecuacion: ['sen(−', x_, ') = −sen ', x_, ';   cos(−', x_, ') = cos ', x_] },
      ],
    },
    regla: {
      texto: 'Seno y coseno están definidas para todo x real, toman valores de −1 a 1 y se repiten cada 2π.',
      ecuacion: ['Dom = ℝ;   Ran = [−1, 1];   ', T_, ' = 2π;   cos ', x_, ' = sen(', x_, ' + π/2)'],
      condicion: 'x en radianes; con grados, el periodo es 360°.',
      voz: 'Primero el dominio, después el rango, al final el periodo.',
    },
    ahoraTu: {
      voz: 'Quita vueltas completas antes de buscar el valor.',
      generar(sem) {
        const rr = azar(sem);
        const base = rr.uno([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]);
        const g = base + 360 * rr.uno([1, 2, -1, 3]), fn = sem % 2 ? 'sen' : 'cos', otra = fn === 'sen' ? 'cos' : 'sen';
        const bien = exacto(fn, g), menos = bien.startsWith('−') ? bien.slice(1) : '−' + bien;
        return {
          pregunta: [`¿Cuánto vale ${fn}(${piQ(g, 180)})?`],
          opciones: opciones(bien, [
            { id: 'signo', valor: menos, error: 'FUN-SIGNO', siFuera: `El valor absoluto está bien; revisa el cuadrante de ${piQ(base, 180)}.` },
            { id: 'cruce', valor: exacto(otra, g), error: 'FUN-CRUCE', siFuera: `Ese es el valor de ${otra}; se pide ${fn}.` },
            { id: 'dominio', valor: 'No existe', error: 'FUN-DOMINIO', siFuera: `${fn} existe para todo x real; solo hay que quitar vueltas.` },
          ]),
          solucion: { texto: `Se quitan vueltas de 2π: queda ${piQ(base, 180)}.`, ecuacion: [`${fn}(${piQ(g, 180)}) = ${fn}(${piQ(base, 180)}) = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 2: amplitud, periodo y frecuencia ----------
  // Cambia: A (alto) y B (cuántas ondas por vuelta). · Permanece: el eje de 0 a 2π y la onda sen x de referencia.
  // Progresa: la llave verde del periodo, que se acorta al crecer B. · Se reserva: B = 1/2, que alarga la onda (la
  // predicción). · Debe verse: que A cambia la altura y B cambia la separación, cada uno por su lado.
  // Periodo 2π/B como texto, para B entero o B = 1/2.
  const perTxt = B => (Number.isInteger(B) ? piQ(2, B) : piQ(Math.round(2 / B), 1));
  const onda2 = (A, B, xmax = 2 * PI, ymax = 4, extra = {}) => Object.assign({
    x: { min: 0, max: xmax, cada: 2 }, y: { min: -ymax, max: ymax, paso: 1 },
    curvas: [{ puntos: muestra(Math.sin, 0, xmax), color: null, discontinua: true },
      { puntos: muestra(x => A * Math.sin(B * x), 0, xmax, 240), color: 'h' }],
    periodos: [{ de: 0, a: 2 * PI / B, y: -ymax + 0.45, color: 'd', rotulo: `T = ${perTxt(B)}` }],
    puntos: [{ x: PI / (2 * B), y: A, color: 'h', rotulo: `${f(A)}`, lado: 'e' }],
    alt: `Onda ${f(A)} sen(${f(B)}x): sube hasta ${f(A)} y se repite cada ${perTxt(B)}`,
  }, extra);
  const amplitud = {
    id: 'amplitud-periodo',
    titulo: 'Alto y ancho de la onda',
    temas: ['Amplitud, periodo y frecuencia'],
    pieza: 'trig-onda',
    juega: {
      consigna: 'Mueve A y B en y = A sen(Bx). La discontinua es sen x. Mira qué cambia la altura y qué cambia la llave verde.',
      voz: 'Mueve uno solo a la vez.',
      controles: [
        { id: 'A', etiqueta: 'A', color: 'c-h', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'B', etiqueta: 'B', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: val => ({ datos: onda2(val.A, val.B), estado: {} }),
      lectura: val => ['amplitud ', A_, ` = ${f(val.A)}; periodo `, T_, ` = ${perTxt(val.B)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuál es el periodo de y = 2 sen(x/2), con ', B_, ' = 1/2?'],
      voz: 'Piensa cuánto debe avanzar x para que x/2 dé una vuelta.',
      opciones: [
        { id: 'c', texto: '4π', correcta: true },
        { id: 'mult', texto: 'π, que es 2π · 1/2', error: 'PER-MULT', siFuera: 'Multiplicar por B sería cierto si B alargara el periodo. B divide: T = 2π/B.' },
        { id: 'fijo', texto: '2π, como sen x', error: 'PER-FIJO', siFuera: '2π es el periodo de sen x. Con B ≠ 1, el periodo cambia.' },
        { id: 'amp', texto: '2, el número de adelante', error: 'PER-AMPLITUD', siFuera: 'El 2 de adelante es la amplitud: cambia la altura, no el ancho.' },
      ],
      dibujo: { datos: onda2(2, 0.5, 4 * PI, 4, { curvas: [{ puntos: muestra(Math.sin, 0, 4 * PI), color: null, discontinua: true }], periodos: [], puntos: [] }), estado: {} },
      revelar: { datos: onda2(2, 0.5, 4 * PI), estado: {} },
      coincide: 'Coincide: x/2 completa una vuelta cuando x llega a 4π.',
    },
    mira: {
      datos: {
        x: { min: 0, max: 4 * PI, cada: 2 }, y: { min: -3.5, max: 3.5, paso: 1 },
        curvas: [{ puntos: muestra(Math.sin, 0, 4 * PI), color: null, discontinua: true, rotulo: 'sen x', en: [3 * PI / 2, -1], lado: 's' },
          { puntos: muestra(x => Math.sin(x / 2), 0, 4 * PI), color: 'h', discontinua: true, desde: 2, hasta: 2 },
          { puntos: muestra(x => 2 * Math.sin(x / 2), 0, 4 * PI), color: 'h', desde: 3, rotulo: '2 sen(x/2)', en: [2.3 * PI, 2], lado: 'ne' }],
        periodos: [{ de: 0, a: 2 * PI, y: -1.8, rotulo: '2π', desde: 1, hasta: 1 }, { de: 0, a: 4 * PI, y: -3, color: 'd', rotulo: 'T = 4π', desde: 2 }],
        puntos: [{ x: PI, y: 2, color: 'h', rotulo: 'A = 2', lado: 'e', desde: 3 }],
        alt: 'La onda seno de x medios tarda 4 pi en repetirse; multiplicada por 2 sube hasta 2',
      },
      voz: 'B decide el ancho; A decide el alto.',
      pasos: [
        { estado: { corte: 1 }, texto: 'sen x completa una onda en 2π.', ecuacion: [T_, ' = 2π'] },
        { estado: { corte: 2 }, texto: 'Con x/2, el ángulo avanza a la mitad: la onda tarda el doble.', ecuacion: [B_, ' ', x_, ' = 2π  ⇒  ', x_, ' = ', { frac: ['2π', B_] }, ' = 4π'] },
        { estado: { corte: 3 }, texto: 'El 2 de adelante estira la altura, no el ancho.', ecuacion: ['amplitud = |', A_, '| = 2'] },
        { estado: { corte: 3 }, texto: 'La frecuencia cuenta ondas por unidad de x: es 1/T.', ecuacion: ['f = ', { frac: ['1', T_] }, ' = ', { frac: ['1', '4π'] }] },
      ],
    },
    regla: {
      texto: 'En y = A sen(Bx) o A cos(Bx), la amplitud es |A|, el periodo es 2π/|B| y la frecuencia es su inversa.',
      ecuacion: ['amplitud = |', A_, '|;   ', T_, ' = ', { frac: ['2π', ['|', B_, '|']] }, ';   f = ', { frac: ['1', T_] }],
      condicion: 'A ≠ 0 y B ≠ 0, con x en radianes.',
      voz: 'Alto por un lado, ancho por el otro.',
    },
    ahoraTu: {
      voz: 'Separa los dos números: cada uno decide una cosa.',
      generar(sem) {
        const rr = azar(sem);
        const [p, q] = rr.uno([[2, 1], [3, 1], [4, 1], [1, 2], [1, 3], [2, 3], [3, 2], [1, 4], [6, 1], [5, 2]]);
        const A = rr.uno([1, 2, 3, 4, 5, -2, -3]), fn = rr.uno(['sen', 'cos']);
        const Bt = q === 1 ? `${p}x` : p === 1 ? `x/${q}` : `${p}x/${q}`;
        const expr = `y = ${A === 1 ? '' : A === -1 ? '−' : qt(A) + ' '}${fn}(${Bt})`;
        if (sem % 2 === 0) {
          return {
            pregunta: [`¿Cuál es el periodo de ${expr}?`],
            opciones: opciones(piQ(2 * q, p), [
              { id: 'mult', valor: piQ(2 * p, q), error: 'PER-MULT', siFuera: 'Eso multiplica 2π por B. B divide: T = 2π/|B|.' },
              { id: 'fijo', valor: '2π', error: 'PER-FIJO', siFuera: '2π sería cierto con B = 1. Aquí B cambia el ancho.' },
              { id: 'amp', valor: piQ(2 * q * Math.abs(A), p), error: 'PER-AMPLITUD', siFuera: 'A no cambia el ancho de la onda, solo su altura.' },
            ]),
            solucion: { texto: `B = ${qt(p, q)}; se divide 2π entre B.`, ecuacion: [T_, ' = ', { frac: ['2π', qt(p, q)] }, ` = ${piQ(2 * q, p)}`] },
          };
        }
        return {
          pregunta: [`¿Entre qué valores se mueve ${expr}?`],
          opciones: opciones(`de −${Math.abs(A)} a ${Math.abs(A)}`, [
            { id: 'per', valor: `de −${qt(p, q)} a ${qt(p, q)}`, error: 'PER-AMPLITUD', siFuera: 'B decide el ancho de la onda; la altura la decide A.' },
            { id: 'uno', valor: 'de −1 a 1', error: 'PER-FIJO', siFuera: 'De −1 a 1 sería cierto con A = 1. Aquí A estira la onda.' },
            { id: 'cero', valor: `de 0 a ${Math.abs(A)}`, error: 'PER-AMPLITUD', siFuera: 'La onda baja tanto como sube: va de −|A| a |A|.' },
          ]),
          solucion: { texto: `La amplitud es |A| = ${Math.abs(A)}.`, ecuacion: ['−|', A_, `| ≤ ${expr.slice(4)} ≤ |`, A_, `| = ${Math.abs(A)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: tangente y cotangente ----------
  // Cambia: la función (tan o cot) y el punto x. · Permanece: las asíntotas discontinuas y la ventana de −3 a 3.
  // Progresa: la rama que sube sin tope junto a cada asíntota. · Se reserva: un valor fuera de la ventana (la
  // predicción). · Debe verse: que cada rama toma todos los reales y que las ramas se repiten cada π.
  const tanF = x => Math.tan(x), cotF = x => 1 / Math.tan(x);
  const ASI = { tan: [-PI / 2, PI / 2, 3 * PI / 2], cot: [0, PI, 2 * PI] };
  const ondaTan = (fn, xg, extra = {}) => {
    const F = fn === 'tan' ? tanF : cotF, x = xg * PI / 180, ok = Math.abs(fn === 'tan' ? Math.cos(x) : Math.sin(x)) > 1e-9;
    return Object.assign({
      x: { min: -PI / 2, max: 2 * PI, cada: 2 }, y: { min: -3, max: 3, paso: 1 },
      asintotas: ASI[fn].map(a => ({ x: a })),
      curvas: [{ puntos: ramas(F, -PI / 2, 2 * PI, ASI[fn]), color: 'h' }],
      puntos: ok && Math.abs(F(x)) <= 3 ? [{ x, y: F(x), color: 'o', rotulo: f(F(x)), lado: 'e' }] : [],
      alt: `Gráfica de ${fn} x con asíntotas en ${ASI[fn].map(a => piQ(Math.round(a / PI * 2), 2)).join(', ')}; ramas que toman todos los reales`,
    }, extra);
  };
  const tanIdea = {
    id: 'tangente-ramas',
    titulo: 'Ramas entre asíntotas',
    temas: ['Funciones tangente y cotangente'],
    pieza: 'trig-onda',
    juega: {
      consigna: 'Elige tangente o cotangente y mueve x. Donde la curva no existe hay una asíntota discontinua.',
      voz: 'Mira qué pasa con el punto cerca de cada asíntota.',
      controles: [
        { id: 'g', etiqueta: 'x', color: 'c-o', min: -60, max: 330, paso: 30, inicio: 30, unidad: '°', decimales: 0 },
        { id: 'fn', etiqueta: 'Función', opciones: [{ valor: 'tan', texto: 'tan x' }, { valor: 'cot', texto: 'cot x' }], inicio: 'tan' },
      ],
      dibujo: val => ({ datos: ondaTan(val.fn, val.g), estado: {} }),
      lectura: val => {
        const x = val.g * PI / 180, ok = Math.abs(val.fn === 'tan' ? Math.cos(x) : Math.sin(x)) > 1e-9;
        return [`${val.fn}(${piQ(val.g, 180)}) ${ok ? '= ' + f(val.fn === 'tan' ? Math.tan(x) : 1 / Math.tan(x)) : 'no existe: asíntota'}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: '¿Hay algún x para el que tan x = 1000?',
      voz: 'La ventana llega a 3; la rama sigue fuera de ella.',
      opciones: [
        { id: 'c', texto: 'Sí, muy cerca de una asíntota', correcta: true },
        { id: 'rango', texto: 'No: tan x no pasa de 1', error: 'TAN-RANGO', siFuera: 'Seno y coseno no pasan de 1, pero su cociente sí: crece cuando el coseno se achica.' },
        { id: 'ventana', texto: 'No: la gráfica llega hasta 3', error: 'TAN-VENTANA', siFuera: 'La ventana corta en 3; la rama sigue subiendo fuera de ella.' },
        { id: 'asintota', texto: 'Sí, justo en x = π/2', error: 'TAN-ASINTOTA', siFuera: 'Cerca de π/2 sí; justo en π/2 el coseno es 0 y la tangente no existe.' },
      ],
      dibujo: { datos: ondaTan('tan', 30, { puntos: [] }), estado: {} },
      revelar: { datos: ondaTan('tan', 30, { y: { min: -3, max: 3, paso: 1 }, puntos: [{ x: Math.atan(1000), y: 3, color: 'h', rotulo: 'tan x = 1000 ↑', lado: 'ne' }] }), estado: {} },
      coincide: 'Coincide: en x ≈ 1,5698, un poco antes de π/2, la tangente vale 1000.',
    },
    mira: {
      datos: {
        x: { min: -PI / 2, max: 2 * PI, cada: 2 }, y: { min: -3, max: 3, paso: 1 },
        asintotas: ASI.tan.map(a => ({ x: a, desde: 1 })),
        curvas: [{ puntos: muestra(Math.cos, -PI / 2, 2 * PI), color: null, discontinua: true, rotulo: 'cos x', en: [0, 1], lado: 'n', hasta: 1 },
          { puntos: ramas(tanF, -PI / 2, 2 * PI, ASI.tan), color: 'h', desde: 2, rotulo: 'tan x', en: [1.2, Math.tan(1.2)], lado: 'e' },
          { puntos: ramas(cotF, -PI / 2, 2 * PI, ASI.cot), color: 'h', discontinua: true, desde: 4, rotulo: 'cot x', en: [2.6, 1 / Math.tan(2.6)], lado: 'e' }],
        periodos: [{ de: -PI / 2, a: PI / 2, y: -2.6, color: 'd', rotulo: 'T = π', desde: 3 }],
        alt: 'La tangente tiene asíntotas donde el coseno es cero y se repite cada pi; la cotangente, donde el seno es cero',
      },
      voz: 'Donde el denominador es cero, la función no existe.',
      pasos: [
        { estado: { corte: 1 }, texto: 'tan x = sen x / cos x: falla donde cos x = 0.', ecuacion: [x_, ' ≠ π/2 + kπ'] },
        { estado: { corte: 2 }, texto: 'Cerca de esos x el cociente crece sin tope: toma todos los reales.', ecuacion: ['Ran(tan) = ℝ'] },
        { estado: { corte: 3 }, texto: 'Tras π, seno y coseno cambian ambos de signo: el cociente se repite.', ecuacion: ['tan(', x_, ' + π) = tan ', x_, ';   ', T_, ' = π'] },
        { estado: { corte: 4 }, texto: 'cot x = cos x / sen x: asíntotas donde sen x = 0, y baja.', ecuacion: [x_, ' ≠ kπ;   ', T_, ' = π'] },
      ],
    },
    regla: {
      texto: 'Tangente y cotangente toman todos los reales, se repiten cada π y no existen donde su denominador es 0.',
      ecuacion: ['tan: ', x_, ' ≠ π/2 + kπ;   cot: ', x_, ' ≠ kπ;   Ran = ℝ;   ', T_, ' = π'],
      condicion: 'k entero; x en radianes. La tangente crece en cada rama y la cotangente decrece.',
      voz: 'Una rama por intervalo; entre ramas, una asíntota.',
    },
    ahoraTu: {
      voz: 'Busca dónde se anula el denominador.',
      generar(sem) {
        const rr = azar(sem);
        const fn = sem % 2 ? 'cot' : 'tan';
        // Un x fuera del dominio (asíntota) y tres que sí están.
        const k = rr.ent(-2, 4);
        const malo = fn === 'tan' ? piQ(2 * k + 1, 2) : piQ(k, 1);
        const buenos = fn === 'tan' ? [piQ(k, 1), piQ(4 * k + 1, 4), piQ(3 * k + 1, 3)] : [piQ(2 * k + 1, 2), piQ(4 * k + 1, 4), piQ(6 * k + 1, 6)];
        return {
          pregunta: [`¿Cuál de estos valores de x NO está en el dominio de y = ${fn} x?`],
          opciones: opciones(malo, [
            { id: 'a', valor: buenos[0], error: fn === 'tan' ? 'TAN-ASINTOTA' : 'TAN-ASINTOTA', siFuera: fn === 'tan' ? 'Ahí el seno es 0, y la tangente vale 0: sí existe.' : 'Ahí el coseno es 0, y la cotangente vale 0: sí existe.' },
            { id: 'b', valor: buenos[1], error: 'TAN-RANGO', siFuera: `En ${buenos[1]} el denominador no se anula: ${fn} vale 1 o −1.` },
            { id: 'c2', valor: buenos[2], error: 'TAN-RANGO', siFuera: `En ${buenos[2]} el denominador no se anula: ${fn} existe.` },
          ]),
          solucion: { texto: `${fn === 'tan' ? 'El coseno' : 'El seno'} se anula en ${malo}: ahí hay una asíntota.`, ecuacion: [fn === 'tan' ? `cos(${malo}) = 0` : `sen(${malo}) = 0`] },
        };
      },
    },
  };

  // ---------- Idea 4: secante y cosecante ----------
  // Cambia: la función (sec o csc). · Permanece: la onda de base (cos o sen) discontinua y la franja −1 < y < 1.
  // Progresa: las copas que nacen donde la base toca 1 o −1. · Se reserva: si sec x puede valer 1/2 (la predicción).
  // · Debe verse: que la franja entre −1 y 1 queda vacía.
  const secF = x => 1 / Math.cos(x), cscF = x => 1 / Math.sin(x);
  const ASI2 = { sec: [-PI / 2, PI / 2, 3 * PI / 2], csc: [0, PI, 2 * PI] };
  const ondaSec = (fn, extra = {}) => ({
    x: { min: -PI / 2, max: 2 * PI, cada: 2 }, y: { min: -3.5, max: 3.5, paso: 1 },
    franjas: [],
    rectas: [{ y: 1, color: 'h' }, { y: -1, color: 'h' }],
    asintotas: ASI2[fn].map(a => ({ x: a })),
    curvas: [{ puntos: muestra(fn === 'sec' ? Math.cos : Math.sin, -PI / 2, 2 * PI), color: null, discontinua: true, rotulo: fn === 'sec' ? 'cos x' : 'sen x', en: fn === 'sec' ? [0, 1] : [PI / 2, 1], lado: 's' },
      { puntos: ramas(fn === 'sec' ? secF : cscF, -PI / 2, 2 * PI, ASI2[fn]), color: 'h', rotulo: `${fn} x`, en: fn === 'sec' ? [PI + 0.6, secF(PI + 0.6)] : [PI / 2 + 0.6, cscF(PI / 2 + 0.6)], lado: 'e' }],
    alt: `Gráfica de ${fn} x: copas por encima de 1 y por debajo de −1, con asíntotas donde ${fn === 'sec' ? 'el coseno' : 'el seno'} es cero`,
    ...extra,
  });
  const secIdea = {
    id: 'secante-copas',
    titulo: 'Copas fuera de la franja',
    temas: ['Funciones secante y cosecante'],
    pieza: 'trig-onda',
    juega: {
      consigna: 'Elige secante o cosecante. La discontinua es su base: sec x = 1/cos x y csc x = 1/sen x. Mira dónde nacen las copas.',
      voz: 'Compara cada copa con la onda de su base.',
      controles: [{ id: 'fn', etiqueta: 'Función', opciones: [{ valor: 'sec', texto: 'sec x' }, { valor: 'csc', texto: 'csc x' }, { valor: 'cos', texto: 'cos x' }, { valor: 'sen', texto: 'sen x' }], inicio: 'sec' }],
      dibujo: val => ({ datos: ['sec', 'csc'].includes(val.fn) ? ondaSec(val.fn) : ondaSec(val.fn === 'cos' ? 'sec' : 'csc', { curvas: ondaSec(val.fn === 'cos' ? 'sec' : 'csc').curvas.slice(0, 1).map(c => Object.assign({}, c, { color: 'h', discontinua: false })), asintotas: [] }), estado: {} }),
      lectura: val => [{ sec: 'sec x: |y| ≥ 1; asíntotas donde cos x = 0', csc: 'csc x: |y| ≥ 1; asíntotas donde sen x = 0', cos: 'cos x: entre −1 y 1', sen: 'sen x: entre −1 y 1' }[val.fn]],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Hay algún x para el que sec x = 1/2?',
      voz: 'Piensa qué coseno haría falta.',
      opciones: [
        { id: 'c', texto: 'No: haría falta cos x = 2', correcta: true },
        { id: 'confunde', texto: 'Sí, en x = π/3', error: 'SEC-CONFUNDE', siFuera: 'En π/3 el coseno vale 1/2. La secante es su inversa: vale 2.' },
        { id: 'inverso', texto: 'Sí, donde cos x = 2', error: 'SEC-INVERSO', siFuera: 'La cuenta 1/2 = 1/cos x está bien; pero ningún coseno vale 2.' },
        { id: 'asintota', texto: 'Sí, cerca de una asíntota', error: 'SEC-ASINTOTA', siFuera: 'Cerca de una asíntota la secante es enorme, no pequeña.' },
      ],
      dibujo: { datos: ondaSec('sec', { curvas: ondaSec('sec').curvas.slice(0, 1) }), estado: {} },
      revelar: { datos: ondaSec('sec', { franjas: [{ eje: 'y', de: -1, a: 1, color: 'h' }], rectas: [{ y: 1, color: 'h' }, { y: -1, color: 'h' }, { y: 0.5, rotulo: 'y = 1/2' }] }), estado: {} },
      coincide: 'Coincide: la recta y = 1/2 cae en la franja vacía y no toca ninguna copa.',
    },
    mira: {
      datos: ondaSec('sec', {
        franjas: [{ eje: 'y', de: -1, a: 1, color: 'h', desde: 3 }],
        curvas: [ondaSec('sec').curvas[0], Object.assign({}, ondaSec('sec').curvas[1], { desde: 2 })],
        asintotas: ASI2.sec.map(a => ({ x: a, desde: 1 })),
        periodos: [{ de: -PI / 2, a: 3 * PI / 2, y: -3, color: 'd', rotulo: 'T = 2π', desde: 4 }],
      }),
      voz: 'Inverso de algo pequeño es grande; de algo menor que 1, mayor que 1.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Donde cos x = 0 no hay secante: asíntota.', ecuacion: [x_, ' ≠ π/2 + kπ'] },
        { estado: { corte: 2 }, texto: 'Donde cos x = ±1, sec x = ±1: ahí nacen las copas.', ecuacion: ['sec ', x_, ' = ', { frac: ['1', ['cos ', x_]] }] },
        { estado: { corte: 3 }, texto: 'Como |cos x| ≤ 1, su inverso cumple |sec x| ≥ 1.', ecuacion: ['Ran = ⟨−∞, −1] ∪ [1, +∞⟩'] },
        { estado: { corte: 4 }, texto: 'Se repite cuando se repite el coseno: cada 2π.', ecuacion: [T_, ' = 2π'] },
      ],
    },
    regla: {
      texto: 'sec x = 1/cos x y csc x = 1/sen x nunca toman valores entre −1 y 1, tienen asíntotas donde su base es 0 y se repiten cada 2π.',
      ecuacion: ['Ran = ⟨−∞, −1] ∪ [1, +∞⟩;   ', T_, ' = 2π;   sec: ', x_, ' ≠ π/2 + kπ;   csc: ', x_, ' ≠ kπ'],
      condicion: 'k entero; x en radianes.',
      voz: 'La franja entre −1 y 1 queda vacía.',
    },
    ahoraTu: {
      voz: 'Las copas empiezan en ±|A|; luego se suma D.',
      generar(sem) {
        const rr = azar(sem);
        const A = rr.uno([1, 2, 3, 4, 5]), D = rr.uno([0, 1, 2, -1, -2, 3]), fn = sem % 2 ? 'csc' : 'sec';
        const expr = `y = ${A === 1 ? '' : A + ' '}${fn} x${D ? ` ${D < 0 ? '−' : '+'} ${Math.abs(D)}` : ''}`;
        const R = (a, b) => `⟨−∞, ${qt(a)}] ∪ [${qt(b)}, +∞⟩`;
        return {
          pregunta: [`¿Cuál es el rango de ${expr}?`],
          opciones: opciones(R(D - A, D + A), [
            { id: 'seno', valor: `[${qt(D - A)}, ${qt(D + A)}]`, error: 'SEC-RANGO-SENO', siFuera: `Ese sería el rango de ${A === 1 ? '' : A}${fn === 'sec' ? 'cos' : 'sen'} x${D ? ' más D' : ''}. ${fn} x vive fuera de esa franja.` },
            { id: 'todo', valor: 'ℝ', error: 'SEC-TODO', siFuera: 'ℝ es el rango de la tangente. La franja del centro queda vacía.' },
            { id: 'sinD', valor: D ? R(-A, A) : null, error: 'SEC-SIN-D', siFuera: `La forma está bien; falta mover todo ${Math.abs(D)} hacia ${D > 0 ? 'arriba' : 'abajo'}.` },
            { id: 'sinA', valor: A !== 1 ? R(D - 1, D + 1) : null, error: 'SEC-SIN-D', siFuera: `Las copas empiezan en ±${A}, no en ±1: A estira la gráfica.` },
          ]),
          solucion: { texto: `Las copas empiezan en ±${A} y se suben ${D}.`, ecuacion: [`${D} − ${A} = ${qt(D - A)};   ${D} + ${A} = ${qt(D + A)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: el periodo de una función generalizada ----------
  // Cambia: B y la forma (sen, tan, |sen|). · Permanece: el eje de 0 a 2π y la llave verde. · Progresa: la llave
  // del periodo, que depende de la función y de B. · Se reserva: la suma de dos senos (la predicción).
  // · Debe verse: que una suma se repite donde se repiten las dos a la vez.
  const FORMAS = {
    sen: { fn: (B, x) => Math.sin(B * x), T: 2, txt: B => `sen ${B === 1 ? '' : B}x`, asi: () => [] },
    tan: { fn: (B, x) => Math.tan(B * x), T: 1, txt: B => `tan ${B === 1 ? '' : B}x`, asi: B => Array.from({ length: 2 * B + 1 }, (_, k) => (2 * k + 1) * PI / (2 * B)) },
    abs: { fn: (B, x) => Math.abs(Math.sin(B * x)), T: 1, txt: B => `|sen ${B === 1 ? '' : B}x|`, asi: () => [] },
  };
  const ondaGen = (forma, B, extra = {}) => {
    const F = FORMAS[forma], asi = F.asi(B);
    return Object.assign({
      x: { min: 0, max: 2 * PI, cada: 2 }, y: { min: -2.5, max: 2.5, paso: 1 },
      asintotas: asi.map(a => ({ x: a })),
      curvas: [{ puntos: asi.length ? ramas(x => F.fn(B, x), 0, 2 * PI, asi, 40) : muestra(x => F.fn(B, x), 0, 2 * PI, 240), color: 'h' }],
      periodos: [{ de: 0, a: F.T * PI / B, y: -2.1, color: 'd', rotulo: `T = ${piQ(F.T, B)}` }],
      alt: `Gráfica de ${F.txt(B)}: se repite cada ${piQ(F.T, B)}`,
    }, extra);
  };
  const MS = muestra(x => Math.sin(2 * x) + Math.sin(3 * x), 0, 2 * PI, 300);
  const general = {
    id: 'periodo-general',
    titulo: 'El periodo depende de la función',
    temas: ['Periodo de funciones generalizadas'],
    pieza: 'trig-onda',
    juega: {
      consigna: 'Elige la forma y el coeficiente B. La llave verde mide un periodo. Compara seno, tangente y valor absoluto con el mismo B.',
      voz: 'Con el mismo B, ¿todas se repiten igual?',
      controles: [
        { id: 'B', etiqueta: 'B', color: 'c-i', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'forma', etiqueta: 'Forma', opciones: [{ valor: 'sen', texto: 'sen Bx' }, { valor: 'tan', texto: 'tan Bx' }, { valor: 'abs', texto: '|sen Bx|' }], inicio: 'sen' },
      ],
      dibujo: val => ({ datos: ondaGen(val.forma, val.B), estado: {} }),
      lectura: val => [`${FORMAS[val.forma].txt(val.B)}: periodo `, T_, ` = ${piQ(FORMAS[val.forma].T, val.B)}`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuál es el periodo de y = sen 2x + sen 3x?',
      voz: 'Las dos ondas tienen que volver a empezar a la vez.',
      opciones: [
        { id: 'c', texto: '2π', correcta: true },
        { id: 'menor', texto: '2π/3, el menor de los dos', error: 'PER-MENOR', siFuera: 'En 2π/3 sen 3x vuelve a empezar, pero sen 2x todavía no.' },
        { id: 'suma', texto: '5π/3, que es π + 2π/3', error: 'PER-SUMA', siFuera: 'Sumar periodos no asegura que las dos coincidan: en 5π/3 sen 2x no completó.' },
        { id: 'b', texto: '2π/5, con B = 2 + 3', error: 'PER-MULT', siFuera: 'Sumar los B sería cierto si se sumaran los ángulos, no las ondas.' },
      ],
      dibujo: { datos: { x: { min: 0, max: 2 * PI, cada: 2 }, y: { min: -2.5, max: 2.5, paso: 1 }, curvas: [{ puntos: MS, color: 'h' }], alt: 'Gráfica de seno de 2x más seno de 3x entre 0 y 2 pi' }, estado: {} },
      revelar: { datos: { x: { min: 0, max: 2 * PI, cada: 2 }, y: { min: -2.5, max: 2.5, paso: 1 }, curvas: [{ puntos: MS, color: 'h' }], periodos: [{ de: 0, a: 2 * PI, y: -2.2, color: 'd', rotulo: 'T = 2π' }], alt: 'La suma de seno de 2x y seno de 3x se repite recién en 2 pi' }, estado: {} },
      coincide: 'Coincide: π para sen 2x y 2π/3 para sen 3x coinciden recién en 2π.',
    },
    mira: {
      datos: {
        x: { min: 0, max: 2 * PI, cada: 3 }, y: { min: -2.5, max: 2.5, paso: 1 },
        curvas: [{ puntos: muestra(x => Math.sin(2 * x), 0, 2 * PI), color: null, discontinua: true, desde: 1, hasta: 2 },
          { puntos: muestra(x => Math.sin(3 * x), 0, 2 * PI), color: 'i', discontinua: true, desde: 2, hasta: 3 },
          { puntos: MS, color: 'h', desde: 4 }],
        periodos: [{ de: 0, a: PI, y: 1.6, rotulo: 'π', desde: 1, hasta: 3 }, { de: 0, a: 2 * PI / 3, y: -1.6, color: 'i', rotulo: '2π/3', desde: 2, hasta: 3 }, { de: 0, a: 2 * PI, y: -2.2, color: 'd', rotulo: 'T = 2π', desde: 3 }],
        alt: 'Seno de 2x se repite cada pi, seno de 3x cada 2 pi tercios; la suma se repite cada 2 pi',
      },
      voz: 'Busca el primer momento en que las dos vuelven a empezar.',
      pasos: [
        { estado: { corte: 1 }, texto: 'sen 2x se repite cada π.', ecuacion: [{ frac: ['2π', '2'] }, ' = π'] },
        { estado: { corte: 2 }, texto: 'sen 3x se repite cada 2π/3.', ecuacion: [{ frac: ['2π', '3'] }] },
        { estado: { corte: 3 }, texto: 'El primer múltiplo común: 2 veces π y 3 veces 2π/3.', ecuacion: ['2 · π = 3 · ', { frac: ['2π', '3'] }, ' = 2π'] },
        { estado: { corte: 4 }, texto: 'La suma se repite cada 2π.', ecuacion: [T_, ' = 2π'] },
      ],
    },
    regla: {
      texto: 'El periodo depende de la función y de su transformación: seno y coseno, 2π/|B|; tangente y cotangente, π/|B|. Una suma, el menor múltiplo común.',
      ecuacion: ['A sen(', B_, x_, ' + C) + D:  ', T_, ' = ', { frac: ['2π', ['|', B_, '|']] }, ';   A tan(', B_, x_, ' + C) + D:  ', T_, ' = ', { frac: ['π', ['|', B_, '|']] }],
      condicion: 'A ≠ 0 y B ≠ 0; C y D no cambian el periodo. Sin múltiplo común, la suma no es periódica.',
      voz: 'Ni la altura ni el corrimiento cambian el periodo.',
    },
    ahoraTu: {
      voz: 'Identifica la función antes de dividir.',
      generar(sem) {
        const rr = azar(sem), tipo = sem % 3;
        if (tipo === 2) {
          const [m, n] = rr.uno([[2, 3], [2, 4], [4, 6], [3, 6], [2, 5], [6, 9], [4, 10], [3, 4]]);
          const g = mcd(m, n), [f1, f2] = rr.uno([['sen', 'sen'], ['sen', 'cos'], ['cos', 'cos']]);
          return {
            pregunta: [`¿Cuál es el periodo de y = ${f1} ${m}x + ${f2} ${n}x?`],
            opciones: opciones(piQ(2, g), [
              { id: 'menor', valor: piQ(2, Math.max(m, n)), error: 'PER-MENOR', siFuera: `En ${piQ(2, Math.max(m, n))} solo vuelve a empezar una de las dos.` },
              { id: 'suma', valor: piQ(2 * (m + n), m * n), error: 'PER-SUMA', siFuera: 'Sumar periodos no asegura que coincidan: se busca el menor múltiplo común.' },
              { id: 'b', valor: piQ(2, m + n), error: 'PER-MULT', siFuera: 'Sumar los B sería cierto si se sumaran ángulos, no ondas.' },
              { id: 'fijo', valor: '2π', error: 'PER-FIJO', siFuera: `2π es un periodo común, pero hay uno menor: ${piQ(2, g)}.` },
            ]),
            solucion: { texto: `Periodos ${piQ(2, m)} y ${piQ(2, n)}: el menor común es ${piQ(2, g)}.`, ecuacion: [`${m / g} · ${piQ(2, m)} = ${n / g} · ${piQ(2, n)} = ${piQ(2, g)}`] },
          };
        }
        const B = rr.uno([2, 3, 4, 5, 6]), A = rr.uno([2, 3, 5, -2, -4]), C = rr.uno(['π/3', 'π/4', 'π/6', 'π/2']), D = rr.uno([1, 2, -1, -3]);
        const fn = tipo === 0 ? rr.uno(['sen', 'cos']) : rr.uno(['tan', 'cot']), base = tipo === 0 ? 2 : 1;
        const expr = `y = ${qt(A)} ${fn}(${B}x + ${C}) ${D < 0 ? '−' : '+'} ${Math.abs(D)}`;
        return {
          pregunta: [`¿Cuál es el periodo de ${expr}?`],
          opciones: opciones(piQ(base, B), [
            { id: 'tan', valor: piQ(3 - base, B), error: 'PER-TAN', siFuera: tipo === 0 ? `Eso usa π, el de la tangente. ${fn} se repite cada 2π antes de dividir.` : `Eso usa 2π. ${fn} se repite cada π antes de dividir.` },
            { id: 'mult', valor: piQ(base * B, 1), error: 'PER-MULT', siFuera: 'Eso multiplica por B. B divide: el periodo se acorta.' },
            { id: 'fijo', valor: piQ(base, 1), error: 'PER-FIJO', siFuera: `Ese es el periodo de ${fn} x. Con ${B}x, la onda se repite ${B} veces más rápido.` },
            { id: 'amp', valor: piQ(base, Math.abs(A)), error: 'PER-AMPLITUD', siFuera: 'A cambia la altura, no el ancho; el ancho lo decide B.' },
          ]),
          solucion: { texto: `Solo importa B = ${B}; A, C y D no cambian el periodo.`, ecuacion: [T_, ' = ', { frac: [piQ(base, 1), `${B}`] }, ` = ${piQ(base, B)}`] },
        };
      },
    },
  };

  return {
    unidad: 'trigonometria.funciones-trigonometricas',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-onda.js'],
    historia: {
      texto: 'En 1748, Euler publicó la Introductio in analysin infinitorum, que puso a las funciones en el centro del análisis. Seno y coseno dejaron de ser solo valores de una tabla para resolver triángulos: pasaron a ser funciones que cambian sin fin mientras el ángulo gira, con preguntas nuevas sobre su altura, su repetición y su desplazamiento.',
      pregunta: '¿Qué cambia si piensas el seno como algo que se mueve?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Leonhard Euler», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Euler/' },
    },
    ideas: [senCos, amplitud, tanIdea, secIdea, general],
  };
});
