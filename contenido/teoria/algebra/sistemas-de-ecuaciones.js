/*
 * Teoría de «Sistemas de ecuaciones» (algebra.sistemas-de-ecuaciones). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 16), expediente teoria-152-unidades (ficha y
 * «Precisiones» de Álgebra) e historia-ecuaciones (pp. 57–68).
 * Errores: AL17 y AL18 (docs/investigacion/algebra-funciones-ideas-erroneas.md) y TAL-* nuevos (hipótesis de diseño,
 * rutinas/teoria-algebra.md).
 * Colores (regla 4): x naranja (c-o), y turquesa (c-i); la primera ecuación (su recta o su fila) verde (c-d) y la
 * segunda roja (c-h). Los determinantes y rangos van en tinta.
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · resolver un sistema es hallar los pares (o ternas) que cumplen TODAS las ecuaciones a la vez.
 * Persona y condiciones · 4.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · clasifica un sistema (una, ninguna, infinitas), elimina por filas sin olvidar el término
 *   independiente, aplica Cramer solo con Δ ≠ 0, usa rangos y verifica soluciones de sistemas no lineales.
 * Orden de atención · 1.º la figura (rectas, tabla de filas) · 2.º lo que cambia · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué una fila de ceros no es «la solución» y cuándo no se puede usar Cramer.
 * Ronda 2 (14 nov 2026): gesto directo en las ideas 1 y 5 (la recta roja se agarra por su corte con el eje y y por
 * su punto de x = 1, que la inclina); las ideas 2 a 4 se quedan con − y + porque su figura es una tabla de
 * coeficientes: un número de fila no tiene lugar en el plano que agarrar. Llaves en las reglas y laboratorio de
 * tres mesas: dos rectas libres con Δ y el cruce, parábola y recta por dos puntos, y los rangos.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-o', t: 'x' }, y = { v: 'c-i', t: 'y' }, zz = { v: 'c-d', t: 'z' };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let w = a; w = Math.imul(w ^ (w >>> 15), w | 1); w ^= w + Math.imul(w ^ (w >>> 7), w | 61); return ((w ^ (w >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function distintas(ops, max = 4) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const s = Kit.plano(o.texto); if (vistos.has(s) || /NaN|Infinity|undefined/.test(s)) continue; vistos.add(s); out.push(o); }
    return out.slice(0, max);
  }
  const mcd = (p, q) => (q ? mcd(q, p % q) : Math.abs(p));
  function fr(num, den) {
    if (den < 0) { num = -num; den = -den; }
    const g = mcd(Math.abs(num), den) || 1;
    return den / g === 1 ? f(num / g) : `${num < 0 ? '−' : ''}${Math.abs(num) / g}/${den / g}`;
  }
  // a·x + b·y = c como partes de ecuación, con x e y en su color.
  function lineal(a, b, c, vars = [x, y]) {
    const out = [];
    [a, b].forEach((k, i) => {
      if (!k) return;
      out.push(out.length ? (k < 0 ? ' − ' : ' + ') : (k < 0 ? '−' : ''));
      if (Math.abs(k) !== 1) out.push(f(Math.abs(k)));
      out.push(vars[i]);
    });
    return [...(out.length ? out : ['0']), ` = ${f(c)}`];
  }
  const par = (p, q) => `(${f(p)}; ${f(q)})`;
  // Recta a·x + b·y = c dentro de la ventana de los ejes, como dos puntos (o vertical).
  function recta(a, b, c, X0, X1, Y0, Y1) {
    // Recorte de Liang–Barsky de la recta a·x + b·y = c a la ventana [X0, X1] × [Y0, Y1].
    if (!a && !b) return [];
    const P0 = b ? [X0, (c - a * X0) / b] : [c / a, Y0], P1 = b ? [X1, (c - a * X1) / b] : [c / a, Y1];
    const dx = P1[0] - P0[0], dy = P1[1] - P0[1];
    let t0 = 0, t1 = 1;
    for (const [pp, qq] of [[-dx, P0[0] - X0], [dx, X1 - P0[0]], [-dy, P0[1] - Y0], [dy, Y1 - P0[1]]]) {
      if (pp === 0) { if (qq < 0) return []; continue; }
      const t = qq / pp;
      if (pp < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
    }
    return t0 <= t1 ? [[P0[0] + dx * t0, P0[1] + dy * t0], [P0[0] + dx * t1, P0[1] + dy * t1]] : [];
  }
  const VENT = { x: { min: -2, max: 6, paso: 1, nombre: 'x', decimales: 0, color: 'o' }, y: { min: -2, max: 6, paso: 1, nombre: 'y', decimales: 0, color: 'i' } };
  const rectaE = (a, b, c, color, extra = {}) => Object.assign({ puntos: recta(a, b, c, -2, 6, -2, 6), color }, extra);
  // Gesto directo (docs/teoria.md §4b): inversa lineal de la escala de la pieza; el lector ajusta al paso y al rango.
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));
  const EJES = () => Kit.piezas.ejes;

  // ---------- Idea 1: dos rectas, tres destinos ----------
  // Cambia: la segunda recta · Permanece: x + y = 4 · Progresa: el cruce que se mueve, desaparece o se vuelve toda
  // la recta · Se reserva: 2x + 2y = 7, paralela · Debe verse: una solución es un punto común a las dos.
  function clasificar2(a1, b1, c1, a2, b2, c2) {
    const D = a1 * b2 - a2 * b1;
    if (D !== 0) return { tipo: 'una', x: (c1 * b2 - c2 * b1) / D, y: (a1 * c2 - a2 * c1) / D };
    const Dx = c1 * b2 - c2 * b1, Dy = a1 * c2 - a2 * c1;
    return { tipo: Dx === 0 && Dy === 0 ? 'infinitas' : 'ninguna' };
  }
  // Dos manijas para una recta y = n − m·x (escrita mx + y = n): el corte (0; n) y el punto de x = 1, (1; n − m).
  function manijasRecta(ejes, nombre, m, n, color) {
    const g = () => EJES().geometria(ejes), Yi = () => inversa(g().Y, ejes.y.min, ejes.y.max);
    return [
      { id: 'corte', etiqueta: `corte de ${nombre} con el eje y`, color,
        donde: v => ({ x: g().X(0), y: g().Y(v[n]) }), mover: pt => ({ [n]: Yi()(pt.y) }) },
      { id: 'inclina', etiqueta: `punto de x = 1 de ${nombre}: la inclina`, color,
        donde: v => ({ x: g().X(1), y: g().Y(v[n] - v[m]) }), mover: (pt, v) => ({ [m]: v[n] - Yi()(pt.y) }) },
    ];
  }
  const TXT = { una: 'una solución', ninguna: 'ninguna solución', infinitas: 'infinitas soluciones' };
  const dosRectas = {
    id: 'dos-rectas',
    titulo: 'Dos rectas, tres destinos',
    temas: ['Sistemas lineales 2x2 e interpretación gráfica'],
    pieza: 'ejes',
    juega: {
      consigna: 'La recta verde es x + y = 4. Arrastra la roja, ax + y = c, por su corte o por el punto que la inclina.',
      voz: 'Busca a = 1. ¿Qué pasa con el cruce?',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-h', min: -2, max: 2, paso: 1, inicio: -1, decimales: 0 },
        { id: 'c', etiqueta: 'c', color: 'c-h', min: -2, max: 6, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => {
        const k = clasificar2(1, 1, 4, v.a, 1, v.c);
        return { datos: Object.assign({}, VENT, { curvas: [rectaE(1, 1, 4, 'd'), rectaE(v.a, 1, v.c, 'h', { discontinua: k.tipo === 'infinitas' })], puntos: k.tipo === 'una' && k.x >= -2 && k.x <= 6 && k.y >= -2 && k.y <= 6 ? [{ x: k.x, y: k.y, color: 'o', rotulo: par(k.x, k.y), guias: true }] : [], alt: `x + y = 4 y ${v.a}x + y = ${v.c}: ${TXT[k.tipo]}` }), estado: {} };
      },
      lectura: v => { const k = clasificar2(1, 1, 4, v.a, 1, v.c); return [TXT[k.tipo], k.tipo === 'una' ? `: ${par(k.x, k.y)}` : '']; },
      minimo: 4,
      // La recta roja y = c − ax: su corte con el eje y es (0; c) y su punto de x = 1 es (1; c − a). Rango fijo.
      arrastres: manijasRecta(VENT, 'la recta roja', 'a', 'c', 'c-h'),
    },
    predice: {
      pregunta: ['¿Cuántas soluciones tiene el sistema ', ...lineal(1, 1, 3), ' y ', ...lineal(2, 2, 7), '?'],
      opciones: [
        { id: 'c', texto: 'Ninguna', correcta: true },
        { id: 'infinitas', texto: 'Infinitas', error: 'TAL-PROPORCIONAL', siFuera: 'Sería así si la segunda fuera 2x + 2y = 6: la misma recta. Con 7, se corre.' },
        { id: 'una', texto: 'Una', error: 'AL17', siFuera: 'Una solución pide que las rectas se crucen; aquí tienen la misma inclinación.' },
        { id: 'dos', texto: 'Dos', error: 'AL17', siFuera: 'Dos rectas distintas se cruzan a lo más en un punto.' },
      ],
      dibujo: { datos: Object.assign({}, VENT, { curvas: [], alt: 'Plano x, y todavía sin las rectas del sistema' }), estado: {} },
      revelar: { datos: Object.assign({}, VENT, { curvas: [rectaE(1, 1, 3, 'd', { rotulo: 'x + y = 3', en: [-1.9, 4.6] }), rectaE(2, 2, 7, 'h', { rotulo: '2x + 2y = 7', en: [5.9, -1.2] })], alt: 'Dos rectas paralelas: x + y = 3 y 2x + 2y = 7' }), estado: {} },
      coincide: 'Coincide: 2x + 2y = 7 es x + y = 3,5, paralela a x + y = 3.',
    },
    mira: {
      datos: Object.assign({}, VENT, {
        curvas: [rectaE(1, 1, 3, 'd', { rotulo: 'x + y = 3', en: [-1.9, 4.6] }), rectaE(2, 2, 6, 'h', { discontinua: true, desde: 2 }), rectaE(2, 2, 7, 'h', { rotulo: '2x + 2y = 7', en: [5.9, -1.2], desde: 4 })],
        puntos: [[0, 3], [1, 2], [2, 1], [3, 0]].map(([p, q]) => ({ x: p, y: q, color: 'o', desde: 3 })),
        alt: 'x + y = 3 y 2x + 2y = 6 son la misma recta; 2x + 2y = 7 es paralela',
      }),
      voz: 'Creo que conviene mirar la inclinación primero.',
      pasos: [
        { estado: { corte: 1 }, texto: 'x + y = 3 es una recta: cada punto suyo la cumple.', ecuacion: lineal(1, 1, 3) },
        { estado: { corte: 2 }, texto: '2x + 2y = 6 es la misma ecuación por 2: la misma recta.', ecuacion: [...lineal(2, 2, 6), '  ⇔  ', ...lineal(1, 1, 3)] },
        { estado: { corte: 3 }, texto: 'Cada punto (t; 3 − t) cumple las dos: infinitas soluciones.', ecuacion: ['(', x, '; ', y, ') = (t; 3 − t)'] },
        { estado: { corte: 4 }, texto: 'Con 2x + 2y = 7 la recta se corre: paralelas, sin punto común.', ecuacion: [...lineal(1, 1, 3.5), '   ·   ninguna'] },
      ],
    },
    regla: {
      texto: 'Cada ecuación lineal es una recta. Si se cortan, hay una solución; si son paralelas distintas, ninguna; si son la misma recta, infinitas.',
      ecuacion: [{ llave: [{ frac: [{ sub: ['a', '1'] }, { sub: ['a', '2'] }] }, ' = ', { frac: [{ sub: ['b', '1'] }, { sub: ['b', '2'] }] }], nota: 'misma inclinación' }, ' ≠ ', { llave: [{ frac: [{ sub: ['c', '1'] }, { sub: ['c', '2'] }] }], nota: 'otro corte' }, '  ⇒  paralelas'],
      condicion: 'una solución es un par (x; y) que cumple las dos ecuaciones a la vez, no solo una de ellas.',
    },
    ahoraTu: {
      pieza: 'ejes',
      generar(s) {
        const r = azar(s), tipo = ['una', 'ninguna', 'infinitas'][s % 3];
        const a1 = r.ent(1, 3), b1 = r.uno([-2, -1, 1, 2, 3]);
        let a2, b2, x0 = r.ent(0, 4), y0 = r.ent(0, 4);
        if (a1 * x0 + b1 * y0 === 0) x0 += 1;
        const c1 = a1 * x0 + b1 * y0;
        let c2;
        if (tipo === 'una') { do { a2 = r.ent(-2, 3); b2 = r.uno([-2, -1, 1, 2]); } while (a1 * b2 === a2 * b1); c2 = a2 * x0 + b2 * y0; }
        else { const k = r.ent(2, 3); a2 = k * a1; b2 = k * b1; c2 = tipo === 'infinitas' ? k * c1 : k * c1 + r.uno([-2, -1, 1, 2]); }
        const preg = ['Sistema: ', ...lineal(a1, b1, c1), ' y ', ...lineal(a2, b2, c2), '. '];
        const dib = { datos: Object.assign({}, VENT, { curvas: [rectaE(a1, b1, c1, 'd'), rectaE(a2, b2, c2, 'h', { discontinua: tipo === 'infinitas' })], puntos: tipo === 'una' ? [{ x: x0, y: y0, color: 'o', rotulo: par(x0, y0) }] : [], alt: `Las dos rectas del sistema: ${TXT[tipo]}` }), estado: {} };
        if (tipo === 'una') {
          const solo1 = [x0 + b1, y0 - a1];
          return {
            pregunta: [...preg, '¿Cuál es su solución?'],
            opciones: distintas([
              { id: 'c', texto: par(x0, y0), correcta: true },
              { id: 'orden', texto: par(y0, x0), error: 'TAL-PAR-ORDEN', siFuera: `En ${par(y0, x0)} se cambió el orden: primero va x.` },
              { id: 'una-ec', texto: par(...solo1), error: 'AL17', siFuera: `${par(...solo1)} cumple la primera ecuación, pero no la segunda.` },
              { id: 'signo', texto: par(-x0, y0), error: 'TAL-SIGNO', siFuera: `Con x = ${f(-x0)} la primera da ${f(-a1 * x0 + b1 * y0)}, no ${f(c1)}.` },
            ]),
            solucion: { texto: 'El par cumple las dos ecuaciones: es el cruce.', ecuacion: [...lineal(a1, b1, c1), ' ✓', '   ·   ', ...lineal(a2, b2, c2), ' ✓'], dibujo: dib },
          };
        }
        const OP = { una: 'Una', ninguna: 'Ninguna', infinitas: 'Infinitas' };
        const k = a2 / a1;
        return {
          pregunta: [...preg, '¿Cuántas soluciones tiene?'],
          opciones: Object.keys(OP).map(id => (id === tipo ? { id, texto: OP[id], correcta: true } : {
            id, texto: OP[id], error: id === 'una' ? 'AL17' : 'TAL-PROPORCIONAL',
            siFuera: id === 'una' ? `La segunda es la primera por ${f(k)} en x e y: misma inclinación.` : id === 'infinitas' ? `Sería así si ${f(c2)} fuera ${f(k)} · ${f(c1)} = ${f(k * c1)}.` : `${f(c2)} = ${f(k)} · ${f(c1)}: es la misma recta.`,
          })),
          solucion: { texto: tipo === 'infinitas' ? `Toda la segunda ecuación es la primera por ${f(k)}.` : `Los coeficientes están multiplicados por ${f(k)}, pero ${f(c2)} ≠ ${f(k * c1)}.`, ecuacion: [`${f(a2)}/${f(a1)} = ${f(b2)}/${f(b1)}${tipo === 'infinitas' ? ' = ' : ' ≠ '}${f(c2)}/${f(c1)}`], dibujo: dib },
        };
      },
    },
  };

  // ---------- Idea 2: operar filas enteras (Gauss) ----------
  // Cambia: el múltiplo λ · Permanece: la fila 1 · Progresa: la fila 2 que pierde la x · Se reserva: un sistema
  // 3 × 3 escalonado · Debe verse: el término independiente también se opera.
  const fila = (a, b, c) => [f(a), f(b), { t: f(c), fuerte: true }];
  const gauss = {
    id: 'gauss',
    titulo: 'Se opera la fila entera',
    temas: ['Método de Gauss', 'Sistemas 3x3'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Sistema x + y = 5 y 2x + 3y = 13. Elige λ: la nueva fila es F2 menos λ veces F1. Busca que desaparezca x.',
      voz: 'Mira también la última columna.',
      controles: [{ id: 'l', etiqueta: 'λ', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: v => ({ datos: { columnas: ['x', 'y', '='], colorCol: ['o', 'i'], rotulosFila: ['F1', 'F2', `F2 − ${f(v.l)}F1`], separador: { columna: 2 }, filas: [fila(1, 1, 5), fila(2, 3, 13), fila(2 - v.l, 3 - v.l, 13 - 5 * v.l)], resaltes: [{ f: 2, c: 0, ancho: 3, color: v.l === 2 ? 'd' : null }] }, estado: {} }),
      lectura: v => [v.l === 2 ? 'Sin x: ' : 'Nueva fila: ', ...lineal(2 - v.l, 3 - v.l, 13 - 5 * v.l)],
      minimo: 3,
      // Sin arrastre: la figura es una tabla de coeficientes; λ no tiene un lugar en ella que agarrar.
    },
    predice: {
      pregunta: ['En la matriz ampliada de ', ...lineal(1, 2, 4), ' y ', ...lineal(3, 1, 7), ', se hace F2 − 3F1. ¿Cómo queda la fila 2?'],
      pieza: 'alg-tabla',
      opciones: [
        { id: 'c', texto: '0   −5   |   −5', correcta: true },
        { id: 'sin-b', texto: '0   −5   |   7', error: 'AL18', siFuera: 'Así quedaría si el 7 no se operara; la fila entera se resta: 7 − 3 · 4.' },
        { id: 'signo', texto: '0   5   |   5', error: 'TAL-SIGNO', siFuera: '1 − 3 · 2 = −5: el signo se conserva al restar.' },
        { id: 'suma', texto: '6   7   |   19', error: 'TAL-SIGNO', siFuera: 'Eso suma 3F1; para eliminar x hay que restar.' },
      ],
      dibujo: { datos: { columnas: ['x', 'y', '='], colorCol: ['o', 'i'], rotulosFila: ['F1', 'F2', 'F2 − 3F1'], separador: { columna: 2 }, filas: [fila(1, 2, 4), fila(3, 1, 7), [{ t: '?' }, { t: '?' }, { t: '?' }]] }, estado: {} },
      revelar: { datos: { columnas: ['x', 'y', '='], colorCol: ['o', 'i'], rotulosFila: ['F1', 'F2', 'F2 − 3F1'], separador: { columna: 2 }, filas: [fila(1, 2, 4), fila(3, 1, 7), fila(0, -5, -5)], resaltes: [{ f: 2, c: 2, color: 'd' }] }, estado: {} },
      coincide: 'Coincide: 3 − 3 = 0, 1 − 6 = −5 y 7 − 12 = −5. Entonces y = 1.',
    },
    mira: {
      datos: {
        columnas: ['x', 'y', 'z', '='], colorCol: ['o', 'i', 'd'], separador: { columna: 3 },
        rotulosFila: ['F1', 'F2', 'F3', 'F4', 'F5', 'F5−2F4'],
        filas: [
          [...['1', '1', '1'], { t: '6', fuerte: true }],
          [...['2', '1', '−1'], { t: '1', fuerte: true }],
          [...['1', '−1', '2'], { t: '5', fuerte: true }],
          [{ t: '0', desde: 1 }, { t: '−1', desde: 1 }, { t: '−3', desde: 1 }, { t: '−11', desde: 1, fuerte: true }],
          [{ t: '0', desde: 2 }, { t: '−2', desde: 2 }, { t: '1', desde: 2 }, { t: '−1', desde: 2, fuerte: true }],
          [{ t: '0', desde: 3 }, { t: '0', desde: 3 }, { t: '7', desde: 3 }, { t: '21', desde: 3, fuerte: true }],
        ],
        resaltes: [{ f: 5, c: 2, ancho: 2, color: 'd', desde: 4 }],
        alt: 'Eliminación de un sistema 3 × 3 hasta 7z = 21',
      },
      voz: 'Las formas cambian; las soluciones se conservan en cada paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'F4 = F2 − 2F1 quita la x de la segunda ecuación.', ecuacion: ['−', y, ' − 3', zz, ' = −11'] },
        { estado: { corte: 2 }, texto: 'F5 = F3 − F1 quita la x de la tercera.', ecuacion: ['−2', y, ' + ', zz, ' = −1'] },
        { estado: { corte: 3 }, texto: 'F5 − 2F4 quita la y: queda solo z.', ecuacion: ['7', zz, ' = 21  ⇒  ', zz, ' = 3'] },
        { estado: { corte: 4 }, texto: 'Se sube: −y − 9 = −11 da y = 2; luego x = 1.', ecuacion: ['(', x, '; ', y, '; ', zz, ') = (1; 2; 3)'] },
      ],
    },
    regla: {
      texto: 'Restar a una fila un múltiplo de otra no cambia las soluciones, si se opera la fila entera. Se escalona el sistema y se despeja de abajo hacia arriba.',
      ecuacion: [{ sub: ['F', '2'] }, ' ← ', { sub: ['F', '2'] }, ' − ', { llave: ['λ', { sub: ['F', '1'] }], nota: 'la fila entera' }],
      condicion: 'la operación incluye el término independiente; λ es cualquier número real y la fila 1 no cambia.',
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const a = r.uno([1, 2]), l = r.ent(2, 4) * (s % 4 === 0 ? 1 : -1), b = r.ent(-3, 3) || 1, x0 = r.ent(-2, 3), y0 = r.ent(-2, 3);
          const c = a * x0 + b * y0, a2 = l * a, b2 = r.ent(-3, 4), c2 = a2 * x0 + b2 * y0;
          const nb = b2 - l * b, nc = c2 - l * c;
          const fmt = (p, q, w) => `0   ${f(p)}   |   ${f(w)}`.replace('0   ', `${f(q)}   `);
          return {
            pregunta: ['Matriz ampliada de ', ...lineal(a, b, c), ' y ', ...lineal(a2, b2, c2), `. ¿Cómo queda la fila 2 tras F2 ${l < 0 ? '+' : '−'} ${f(Math.abs(l))}F1?`],
            opciones: distintas([
              { id: 'c', texto: fmt(nb, 0, nc), correcta: true },
              { id: 'sin-b', texto: fmt(nb, 0, c2), error: 'AL18', siFuera: `Falta operar el término independiente: ${f(c2)} − (${f(l)}) · ${f(c)}.` },
              { id: 'signo', texto: fmt(b2 + l * b, 2 * a2, c2 + l * c), error: 'TAL-SIGNO', siFuera: 'Eso suma λF1; para eliminar x se resta.' },
              { id: 'solo-x', texto: fmt(b2, 0, c2), error: 'AL18', siFuera: 'Solo se anuló la x; la y y el término independiente también cambian.' },
            ]),
            solucion: { texto: 'Cada número de F2 menos λ veces el de F1, en la misma columna.', ecuacion: [`${f(b2)} − (${f(l)})(${f(b)}) = ${f(nb)}`, '   ·   ', `${f(c2)} − (${f(l)})(${f(c)}) = ${f(nc)}`] },
          };
        }
        // Sistema 3 × 3 ya escalonado: se despeja de abajo hacia arriba.
        const x0 = r.ent(-3, 4), y0 = r.ent(-3, 4), z0 = r.ent(-2, 4), p = r.ent(-2, 3), q = r.ent(-2, 3), w = r.ent(-2, 2) || 1;
        const filas = [[1, p, q, x0 + p * y0 + q * z0], [0, 1, w, y0 + w * z0], [0, 0, 1, z0]];
        return {
          pregunta: ['El sistema ya está escalonado (filas de la tabla, columnas ', x, ', ', y, ', ', zz, '). ¿Cuánto vale ', x, '?'],
          opciones: distintas([
            { id: 'c', texto: f(x0), correcta: true },
            { id: 'sin-sub', texto: f(filas[0][3]), error: 'TAL-SUSTITUYE', siFuera: 'Ese es el término independiente; faltan restar py y qz.' },
            { id: 'y-mal', texto: f(filas[0][3] - p * filas[1][3] - q * z0), error: 'TAL-SUSTITUYE', siFuera: `Se usó y = ${f(filas[1][3])} sin restar ${f(w)}z; primero y = ${f(y0)}.` },
            { id: 'signo', texto: f(filas[0][3] + p * y0 + q * z0), error: 'TAL-SIGNO', siFuera: 'Al pasar py y qz al otro lado cambian de signo.' },
          ]),
          dibujo: { datos: { columnas: ['x', 'y', 'z', '='], colorCol: ['o', 'i', 'd'], separador: { columna: 3 }, filas: filas.map(fl => [...fl.slice(0, 3).map(v => f(v)), { t: f(fl[3]), fuerte: true }]) }, estado: {} },
          solucion: { texto: `De abajo hacia arriba: z = ${f(z0)}, luego y = ${f(y0)}, luego x.`, ecuacion: [x, ` = ${f(filas[0][3])} − (${f(p)})(${f(y0)}) − (${f(q)})(${f(z0)}) = ${f(x0)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: Cramer, solo con Δ ≠ 0 ----------
  // Cambia: k y c de la segunda ecuación · Permanece: 2x + y = 7 · Progresa: Δ, Δx, Δy y el cociente · Se reserva:
  // Δ = 0, donde la división no existe · Debe verse: x = Δx/Δ solo si Δ ≠ 0.
  const det = (a, b, c, d) => a * d - b * c;
  const cramer = {
    id: 'cramer',
    titulo: 'Cramer, solo si Δ ≠ 0',
    temas: ['Regla de Cramer'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Sistema 2x + y = 7 y x + ky = c. Mueve k y c: la tabla calcula los tres determinantes y, si se puede, x e y.',
      voz: 'Busca el k que deja Δ en cero.',
      controles: [
        { id: 'k', etiqueta: 'k', min: -2, max: 3, paso: 0.5, inicio: -1, decimales: 1 },
        { id: 'c', etiqueta: 'c', min: -2, max: 6, paso: 1, inicio: -1, decimales: 0 },
      ],
      dibujo: v => {
        const D = det(2, 1, 1, v.k), Dx = det(7, 1, v.c, v.k), Dy = det(2, 7, 1, v.c);
        return { datos: { columnas: ['Δ', 'Δx', 'Δy'], colorCol: [null, 'o', 'i'], filas: [[f(D), f(Dx), f(Dy)], D ? [{ t: '', fuerte: true }, { t: `x = ${f(Dx / D)}`, color: 'o', fuerte: true }, { t: `y = ${f(Dy / D)}`, color: 'i', fuerte: true }] : [{ t: 'Δ = 0', color: 'h', fuerte: true }, { t: 'no se divide', color: 'h' }, '']] }, estado: {} };
      },
      lectura: v => { const D = det(2, 1, 1, v.k); return [D ? `Δ = ${f(D)}: solución única` : 'Δ = 0: Cramer no se aplica']; },
      minimo: 4,
      // Sin arrastre: tabla de determinantes. El gesto con las dos rectas está en el laboratorio («Dos rectas libres»).
    },
    predice: {
      pregunta: ['¿Qué da la regla de Cramer en ', ...lineal(1, 2, 3), ' y ', ...lineal(2, 4, 5), '?'],
      opciones: [
        { id: 'c', texto: 'No se aplica: Δ = 0', correcta: true },
        { id: 'sin-dividir', texto: [x, ' = 2, ', y, ' = −1'], error: 'TAL-CRAMER-CERO', siFuera: 'Eso son Δx y Δy; habría que dividir entre Δ = 0, y no se puede.' },
        { id: 'infinitas', texto: 'Infinitas soluciones', error: 'TAL-DET-CERO', siFuera: 'Δ = 0 no basta para infinitas: como Δx = 2 ≠ 0, no hay solución.' },
        { id: 'cero', texto: [x, ' = 0, ', y, ' = 0'], error: 'TAL-CRAMER-CERO', siFuera: 'Con x = 0 e y = 0 la primera da 0, no 3.' },
      ],
      dibujo: { datos: { columnas: ['Δ', 'Δx', 'Δy'], colorCol: [null, 'o', 'i'], filas: [['?', '?', '?']] }, estado: {} },
      revelar: { datos: { columnas: ['Δ', 'Δx', 'Δy'], colorCol: [null, 'o', 'i'], filas: [[{ t: f(det(1, 2, 2, 4)), color: 'h', fuerte: true }, f(det(3, 2, 5, 4)), f(det(1, 3, 2, 5))]], pie: 'Δ = 0: no hay división posible' }, estado: {} },
      coincide: 'Coincide: Δ = 1 · 4 − 2 · 2 = 0. El sistema no tiene solución, y eso lo dicen los rangos.',
    },
    mira: {
      datos: {
        columnas: ['Δ', 'Δx', 'Δy'], colorCol: [null, 'o', 'i'],
        filas: [[{ t: '−3', desde: 1, fuerte: true }, { t: '−6', desde: 2, fuerte: true }, { t: '−9', desde: 3, fuerte: true }], [{ t: 'Δ ≠ 0', desde: 4 }, { t: 'x = 2', desde: 4, color: 'o', fuerte: true }, { t: 'y = 3', desde: 4, color: 'i', fuerte: true }]],
        alt: 'Cramer para 2x + y = 7 y x − y = −1: Δ = −3, Δx = −6, Δy = −9',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Sistema 2x + y = 7 y x − y = −1. Δ usa los coeficientes.', ecuacion: ['Δ = 2(−1) − 1 · 1 = −3'] },
        { estado: { corte: 2 }, texto: 'Δx cambia la columna de x por los términos independientes.', ecuacion: ['Δ', x, ' = 7(−1) − 1(−1) = −6'] },
        { estado: { corte: 3 }, texto: 'Δy cambia la columna de y.', ecuacion: ['Δ', y, ' = 2(−1) − 7 · 1 = −9'] },
        { estado: { corte: 4 }, texto: 'Como Δ ≠ 0, se divide.', ecuacion: [x, ' = ', { frac: ['−6', '−3'] }, ' = 2   ·   ', y, ' = ', { frac: ['−9', '−3'] }, ' = 3'] },
      ],
    },
    regla: {
      texto: 'En un sistema cuadrado con Δ ≠ 0, x = Δx/Δ e y = Δy/Δ, donde Δx cambia la columna de x por los términos independientes.',
      ecuacion: [x, ' = ', { frac: [['Δ', x], 'Δ'] }, '   ·   ', y, ' = ', { frac: [['Δ', y], 'Δ'] }, '   ·   ', { llave: ['Δ ≠ 0'], nota: 'si no, rangos' }],
      condicion: 'tantas ecuaciones como incógnitas y Δ ≠ 0. Si Δ = 0, Cramer no decide: se analiza con rangos.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let a, b, c, d;
        do { a = r.ent(1, 4); b = r.uno([-2, -1, 1, 2, 3]); c = r.uno([-1, 1, 2, 3]); d = r.uno([-3, -2, -1, 1, 2]); } while (det(a, b, c, d) === 0);
        const x0 = r.ent(-3, 4), y0 = r.ent(-3, 4), e = a * x0 + b * y0, g = c * x0 + d * y0;
        const D = det(a, b, c, d), Dx = det(e, b, g, d), Dy = det(a, e, c, g), pide = ['x', 'y', 'D'][s % 3];
        const preg = ['Por Cramer, en ', ...lineal(a, b, e), ' y ', ...lineal(c, d, g), ', '];
        if (pide === 'D') return {
          pregunta: [...preg, '¿cuánto vale Δ?'],
          opciones: distintas([
            { id: 'c', texto: f(D), correcta: true },
            { id: 'suma', texto: f(a * d + b * c), error: 'TAL-DET', siFuera: 'El determinante resta los productos cruzados: ad − bc.' },
            { id: 'signo', texto: f(-D), error: 'TAL-DET', siFuera: 'Es diagonal principal menos la otra: ad − bc, en ese orden.' },
            { id: 'dx', texto: f(Dx), error: 'TAL-DET', siFuera: 'Ese es Δx; Δ usa solo los coeficientes.' },
          ]),
          solucion: { texto: 'Diagonal principal menos diagonal secundaria.', ecuacion: [`Δ = ${f(a)}(${f(d)}) − (${f(b)})(${f(c)}) = ${f(D)}`] },
        };
        const num = pide === 'x' ? Dx : Dy, otro = pide === 'x' ? Dy : Dx, V = pide === 'x' ? x : y;
        return {
          pregunta: [...preg, '¿cuánto vale ', V, '?'],
          opciones: distintas([
            { id: 'c', texto: f(num / D), correcta: true },
            { id: 'cruzado', texto: fr(otro, D), error: 'TAL-CRAMER-COLUMNA', siFuera: `Ese cociente usa Δ${pide === 'x' ? 'y' : 'x'}; para ${pide} se cambia su propia columna.` },
            { id: 'sin-div', texto: f(num), error: 'TAL-CRAMER-CERO', siFuera: `Ese es Δ${pide}; falta dividir entre Δ = ${f(D)}.` },
            { id: 'signo', texto: fr(-num, D), error: 'TAL-DET', siFuera: 'Revisa el orden en el determinante: ad − bc.' },
          ]),
          solucion: { texto: `Δ = ${f(D)} y Δ${pide} = ${f(num)}.`, ecuacion: [V, ` = ${f(num)}/${f(D)} = ${f(num / D)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: rango y fila de ceros (Rouché-Frobenius) ----------
  // Cambia: k y m · Permanece: la fila 1 · Progresa: la fila reducida 0, k − 4 | m − 6 y los rangos · Se reserva:
  // 0 0 | 0 con m = 6 · Debe verse: una fila de ceros no es la solución, es una ecuación que ya no dice nada.
  const rangos = (k, m) => {
    const b = k - 4, c = m - 6;
    if (b !== 0) return { rA: 2, rAb: 2, tipo: 'única' };
    if (c !== 0) return { rA: 1, rAb: 2, tipo: 'ninguna' };
    return { rA: 1, rAb: 1, tipo: 'infinitas' };
  };
  const rouche = {
    id: 'rouche',
    titulo: 'Rangos que deciden',
    temas: ['Compatibilidad: Rouché-Frobenius'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Sistema x + 2y = 3 y 2x + ky = m. Mueve k y m: la tabla resta 2 veces la fila 1 y cuenta los rangos.',
      voz: 'Mira qué pasa con k = 4.',
      controles: [
        { id: 'k', etiqueta: 'k', min: 2, max: 6, paso: 1, inicio: 3, decimales: 0 },
        { id: 'm', etiqueta: 'm', opciones: [{ valor: 4, texto: '4' }, { valor: 5, texto: '5' }, { valor: 8, texto: '8' }] },
      ],
      dibujo: v => { const R = rangos(v.k, v.m); return { datos: { columnas: ['x', 'y', '='], colorCol: ['o', 'i'], separador: { columna: 2 }, rotulosFila: ['F1', 'F2 − 2F1'], filas: [fila(1, 2, 3), fila(0, v.k - 4, v.m - 6)], pie: `rango A = ${R.rA}; rango (A|b) = ${R.rAb}` }, estado: {} }; },
      lectura: v => [`Solución: ${rangos(v.k, v.m).tipo}`],
      minimo: 4,
      // Sin arrastre: tabla de filas y rangos, sin lugar que agarrar.
    },
    predice: {
      pregunta: ['Con k = 4 y m = 6, el sistema ', ...lineal(1, 2, 3), ' y ', ...lineal(2, 4, 6), ' deja la fila 0 0 | 0. ¿Cuántas soluciones tiene?'],
      opciones: [
        { id: 'c', texto: 'Infinitas', correcta: true },
        { id: 'unica', texto: 'Una sola', error: 'TAL-FILA-CERO', siFuera: 'La fila 0 0 | 0 no fija nada: queda una ecuación con dos incógnitas.' },
        { id: 'ninguna', texto: 'Ninguna', error: 'TAL-FILA-CERO', siFuera: 'Sería así con 0 0 | 1: 0 = 1 es imposible. Aquí 0 = 0 se cumple.' },
        { id: 'cero', texto: ['Solo ', x, ' = 0, ', y, ' = 0'], error: 'TAL-FILA-CERO', siFuera: 'Con x = 0 e y = 0, la primera da 0, no 3.' },
      ],
      dibujo: { datos: { columnas: ['x', 'y', '='], colorCol: ['o', 'i'], separador: { columna: 2 }, rotulosFila: ['F1', 'F2 − 2F1'], filas: [fila(1, 2, 3), fila(0, 0, 0)] }, estado: {} },
      revelar: { datos: { columnas: ['x', 'y', '='], colorCol: ['o', 'i'], separador: { columna: 2 }, rotulosFila: ['F1', 'F2 − 2F1'], filas: [fila(1, 2, 3), fila(0, 0, 0)], pie: 'rango A = 1 = rango (A|b) < 2 incógnitas', resaltes: [{ f: 1, c: 0, ancho: 3, color: 'd' }] }, estado: {} },
      coincide: 'Coincide: queda solo x + 2y = 3, y cada y da un x: (3 − 2t; t).',
    },
    mira: {
      datos: {
        columnas: ['k, m', 'fila 2', 'rangos', 'tipo'], rotulosFila: ['', '', ''],
        filas: [
          [{ t: '5, 6', desde: 1 }, { t: '0  1 | 0', desde: 1 }, { t: '2 y 2', desde: 1 }, { t: 'única', desde: 1, color: 'd', fuerte: true }],
          [{ t: '4, 7', desde: 2 }, { t: '0  0 | 1', desde: 2 }, { t: '1 y 2', desde: 2 }, { t: 'ninguna', desde: 2, color: 'h', fuerte: true }],
          [{ t: '4, 6', desde: 3 }, { t: '0  0 | 0', desde: 3 }, { t: '1 y 1', desde: 3 }, { t: 'infinitas', desde: 3, color: 'd', fuerte: true }],
        ],
        alt: 'Tres casos de x + 2y = 3 y 2x + ky = m: única, ninguna e infinitas según los rangos',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'k = 5: la fila 2 fija y = 0. Rangos 2 y 2: única.', ecuacion: ['0', x, ' + 1', y, ' = 0'] },
        { estado: { corte: 2 }, texto: 'k = 4, m = 7: la fila dice 0 = 1. Imposible.', ecuacion: ['rango A = 1 < rango (A|b) = 2'] },
        { estado: { corte: 3 }, texto: 'k = 4, m = 6: la fila dice 0 = 0. No aporta.', ecuacion: ['rango A = rango (A|b) = 1 < 2'] },
      ],
    },
    regla: {
      texto: 'Un sistema tiene solución si rango A = rango (A|b). Si ese rango es igual al número de incógnitas, la solución es única; si es menor, hay infinitas.',
      ecuacion: [{ llave: ['r(A)'], nota: 'sin los términos' }, ' = ', { llave: ['r(A|b)'], nota: 'con los términos' }, '  ⇔  hay solución'],
      condicion: 'una fila 0 … 0 | 0 no es una solución: es una ecuación que se cumple siempre.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), a = r.ent(1, 3), b = r.ent(1, 3), c = r.ent(2, 3);
        const tipo = ['única', 'ninguna', 'infinitas'][s % 3];
        const k = tipo === 'única' ? c * a + r.uno([-2, -1, 1, 2]) : c * a;
        const m = tipo === 'infinitas' ? c * b : c * b + r.uno([-2, -1, 1, 2]);
        const OP = { única: 'Una sola', ninguna: 'Ninguna', infinitas: 'Infinitas' };
        const fl = [k - c * a, m - c * b];
        return {
          pregunta: ['¿Cuántas soluciones tiene ', ...lineal(1, a, b), ' y ', ...lineal(c, k, m), '?'],
          opciones: Object.keys(OP).map(id => (id === tipo ? { id, texto: OP[id], correcta: true } : {
            id, texto: OP[id], error: 'TAL-FILA-CERO',
            siFuera: id === 'única' ? `Tras F2 − ${c}F1 queda 0 0 | ${f(fl[1])}: esa fila no fija y.` : fl[0] ? `Tras F2 − ${c}F1 queda 0 ${f(fl[0])} | ${f(fl[1])}: fija un solo valor de y.` : fl[1] ? `Tras F2 − ${c}F1 la fila dice 0 = ${f(fl[1])}: imposible.` : `Tras F2 − ${c}F1 la fila dice 0 = 0: siempre se cumple.`,
          })),
          solucion: { texto: `Se resta ${c} veces la fila 1 y se comparan rangos.`, ecuacion: [`0  ${f(fl[0])} | ${f(fl[1])}  ⇒  ${tipo}`] },
        };
      },
    },
  };

  // ---------- Idea 5: sistemas no lineales ----------
  // Cambia: la recta que corta a la parábola · Permanece: y = x² · Progresa: 2, 1 o 0 puntos comunes · Se reserva:
  // la circunferencia, con dos puntos · Debe verse: cada solución es un punto que cumple las dos.
  const VNL = { x: { min: -4, max: 4, paso: 1, nombre: 'x', decimales: 0, color: 'o' }, y: { min: -2, max: 8, paso: 2, nombre: 'y', decimales: 0, color: 'i' } };
  const cortesPL = (m, n) => { const d = m * m + 4 * n; if (d < 0) return []; if (d === 0) return [m / 2]; const q = Math.sqrt(d); return [(m - q) / 2, (m + q) / 2]; };
  const curvaY = (fn, a, b) => { const out = []; for (let i = 0; i <= 120; i++) { const xx = a + (b - a) * i / 120, yy = fn(xx); out.push(yy >= -2 && yy <= 8 ? [xx, yy] : null); } return out; };
  const VC = { x: { min: -1, max: 8, paso: 1, nombre: 'x', decimales: 0, color: 'o' }, y: { min: -1, max: 7, paso: 1, nombre: 'y', decimales: 0, color: 'i' } };
  const circ = Array.from({ length: 97 }, (_, i) => { const t = i * Math.PI / 48; return [5 * Math.cos(t), 5 * Math.sin(t)]; }).map(([p, q]) => (p >= -1 && q >= -1 ? [p, q] : null));
  const noLineal = {
    id: 'no-lineal',
    titulo: 'Curvas que se cruzan',
    temas: ['Sistemas no lineales'],
    pieza: 'ejes',
    juega: {
      consigna: 'La curva verde es y = x². Arrastra la recta roja y = mx + n por sus dos manijas y cuenta los puntos comunes.',
      voz: 'Busca una recta que solo toque la curva.',
      controles: [
        { id: 'm', etiqueta: 'm', color: 'c-h', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0 },
        { id: 'n', etiqueta: 'n', color: 'c-h', min: -2, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: Object.assign({}, VNL, { curvas: [{ puntos: curvaY(z => z * z, -4, 4), color: 'd' }, { puntos: curvaY(z => v.m * z + v.n, -4, 4), color: 'h' }], puntos: cortesPL(v.m, v.n).map(z => ({ x: z, y: z * z, color: 'o', rotulo: Number.isInteger(z) && cortesPL(v.m, v.n).length < 2 ? par(z, z * z) : undefined })), alt: `y = x² y y = ${v.m}x + ${v.n}: ${cortesPL(v.m, v.n).length} puntos comunes` }), estado: {} }),
      lectura: v => [`Puntos comunes: ${cortesPL(v.m, v.n).length} · Δ = ${f(v.m * v.m + 4 * v.n)}`],
      minimo: 4,
      // Corte (0; n) y punto de x = 1, (1; m + n): aquí la pendiente sube con m, así que se invierte el signo.
      arrastres: [
        { id: 'corte', etiqueta: 'corte de la recta roja con el eje y', color: 'c-h',
          donde: v => { const g = EJES().geometria(VNL); return { x: g.X(0), y: g.Y(v.n) }; },
          mover: pt => ({ n: inversa(EJES().geometria(VNL).Y, -2, 8)(pt.y) }) },
        { id: 'inclina', etiqueta: 'punto de x = 1 de la recta roja: la inclina', color: 'c-h',
          donde: v => { const g = EJES().geometria(VNL); return { x: g.X(1), y: g.Y(v.m + v.n) }; },
          mover: (pt, v) => ({ m: inversa(EJES().geometria(VNL).Y, -2, 8)(pt.y) - v.n }) },
      ],
    },
    predice: {
      pregunta: ['¿Qué soluciones tiene el sistema ', x, '² + ', y, '² = 25 y ', ...lineal(1, 1, 7), '?'],
      opciones: [
        { id: 'c', texto: 'Dos: (3; 4) y (4; 3)', correcta: true },
        { id: 'una', texto: 'Una: (3; 4)', error: 'TAL-PIERDE', siFuera: '(3; 4) sirve, y también (4; 3): la recta corta dos veces.' },
        { id: 'ninguna', texto: 'Ninguna', error: 'TAL-PIERDE', siFuera: '(3; 4) cumple las dos: 9 + 16 = 25 y 3 + 4 = 7.' },
        { id: 'infinitas', texto: 'Infinitas', error: 'AL17', siFuera: 'Una recta y una circunferencia comparten a lo más dos puntos.' },
      ],
      dibujo: { datos: Object.assign({}, VC, { curvas: [{ puntos: circ, color: 'd' }, { puntos: [[0, 7], [7, 0]], color: 'h' }], alt: 'Circunferencia de radio 5 y la recta x + y = 7' }), estado: {} },
      revelar: { datos: Object.assign({}, VC, { curvas: [{ puntos: circ, color: 'd' }, { puntos: [[0, 7], [7, 0]], color: 'h' }], puntos: [{ x: 3, y: 4, color: 'o', rotulo: '(3; 4)' }, { x: 4, y: 3, color: 'o', rotulo: '(4; 3)' }], alt: 'La recta corta a la circunferencia en (3; 4) y (4; 3)' }), estado: {} },
      coincide: 'Coincide: la recta entra y sale de la circunferencia.',
    },
    mira: {
      datos: Object.assign({}, VC, { curvas: [{ puntos: circ, color: 'd' }, { puntos: [[0, 7], [7, 0]], color: 'h' }], puntos: [{ x: 3, y: 4, color: 'o', rotulo: '(3; 4)', desde: 3 }, { x: 4, y: 3, color: 'o', rotulo: '(4; 3)', desde: 3 }], alt: 'Circunferencia x² + y² = 25 y recta x + y = 7 con sus dos cortes' }),
      pasos: [
        { estado: { corte: 1 }, texto: 'De la recta: y = 7 − x. Se reemplaza en la otra.', ecuacion: [x, '² + (7 − ', x, ')² = 25'] },
        { estado: { corte: 2 }, texto: 'Queda una cuadrática en x.', ecuacion: ['2', x, '² − 14', x, ' + 24 = 0  ⇒  ', x, '² − 7', x, ' + 12 = 0'] },
        { estado: { corte: 3 }, texto: 'x = 3 o x = 4; cada x da su y con la recta.', ecuacion: ['(3; 4)   ·   (4; 3)'] },
        { estado: { corte: 3 }, texto: 'Se comprueba cada par en las dos ecuaciones.', ecuacion: ['9 + 16 = 25 ✓   ·   16 + 9 = 25 ✓'] },
      ],
    },
    regla: {
      texto: 'Se despeja una variable en una ecuación y se reemplaza en la otra. Cada solución de la ecuación que resulta da un punto, que se comprueba en las dos.',
      ecuacion: [y, ' = 7 − ', x, '  ⇒  ', x, '² + (7 − ', x, ')² = 25'],
      condicion: 'elevar al cuadrado o dividir puede agregar o perder soluciones: cada par se verifica en el sistema original.',
    },
    ahoraTu: {
      pieza: 'ejes',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) { const p = r.ent(-2, 1), q = p + r.ent(1, 3); return mk(p + q, -p * q, [p, q]); }
        if (tipo === 1) { const p = r.ent(-2, 2); return mk(2 * p, -p * p, [p]); }
        const m = r.uno([-2, 0, 2]);
        return mk(m, -(m * m) / 4 - r.ent(1, 3), []);
        function mk(mm, nn, xs) {
          const cuenta = xs.length;
          const OP = ['Dos puntos', 'Un punto', 'Ningún punto'];
          const bien = OP[2 - cuenta];
          const lado = [mm ? `${Math.abs(mm) === 1 ? (mm < 0 ? '−' : '') : f(mm)}x` : '', nn ? `${mm ? (nn < 0 ? ' − ' : ' + ') : (nn < 0 ? '−' : '')}${f(Math.abs(nn))}` : ''].join('') || '0';
          return {
            pregunta: ['¿En cuántos puntos se cortan ', y, ' = ', x, '² y ', y, ` = ${lado}?`],
            opciones: OP.map((o, i) => (o === bien ? { id: `o${i}`, texto: o, correcta: true } : { id: `o${i}`, texto: o, error: 'TAL-PIERDE', siFuera: `Al igualar queda x² = ${lado}, y su discriminante vale ${f(mm * mm + 4 * nn)}.` })),
            solucion: { texto: 'Se igualan las y: x² = mx + n, y Δ cuenta los cortes.', ecuacion: [xs.length ? `x = ${xs.map(v => f(v)).join(' o ')}` : 'Δ < 0: sin cortes'], dibujo: { datos: Object.assign({}, VNL, { curvas: [{ puntos: curvaY(z => z * z, -4, 4), color: 'd' }, { puntos: curvaY(z => mm * z + nn, -4, 4), color: 'h' }], puntos: xs.map(v => ({ x: v, y: v * v, color: 'o', rotulo: par(v, v * v) })) }), estado: {} } },
          };
        }
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1, más rica que las ideas 1 y 3: las dos rectas se mueven, y la lectura junta lo gráfico con Cramer (Δ y el
  // cruce). Las dos se escriben ax + y = c; cada una con su corte y su punto de x = 1.
  const VL = { x: { min: -4, max: 6, paso: 1, cada: 2, nombre: 'x', decimales: 0, color: 'o' }, y: { min: -4, max: 8, paso: 2, nombre: 'y', decimales: 0, color: 'i' } };
  const rectasLibres = {
    id: 'rectas-libres', titulo: 'Dos rectas libres', pieza: 'ejes',
    consigna: 'Las dos rectas se arrastran. Mira cómo cambia Δ cuando se cruzan, cuando son paralelas y cuando se encima una sobre otra.',
    controles: [
      { id: 'a1', etiqueta: 'a (verde)', color: 'c-d', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0 },
      { id: 'c1', etiqueta: 'c (verde)', color: 'c-d', min: -3, max: 6, paso: 1, inicio: 4, decimales: 0 },
      { id: 'a2', etiqueta: 'a (roja)', color: 'c-h', min: -2, max: 2, paso: 1, inicio: -1, decimales: 0 },
      { id: 'c2', etiqueta: 'c (roja)', color: 'c-h', min: -3, max: 6, paso: 1, inicio: 0, decimales: 0 },
    ],
    dibujo: v => {
      const k = clasificar2(v.a1, 1, v.c1, v.a2, 1, v.c2);
      const r = (a, c, color, extra) => Object.assign({ puntos: recta(a, 1, c, -4, 6, -4, 8), color }, extra);
      return { datos: Object.assign({}, VL, {
        curvas: [r(v.a1, v.c1, 'd'), r(v.a2, v.c2, 'h', { discontinua: k.tipo === 'infinitas' })],
        puntos: k.tipo === 'una' && k.x >= -4 && k.x <= 6 && k.y >= -4 && k.y <= 8 ? [{ x: k.x, y: k.y, color: 'o', guias: true }] : [],
        alt: `${v.a1}x + y = ${v.c1} y ${v.a2}x + y = ${v.c2}: ${TXT[k.tipo]}`,
      }), estado: {} };
    },
    lectura: v => {
      const k = clasificar2(v.a1, 1, v.c1, v.a2, 1, v.c2);
      return [`Δ = ${f(v.a1 - v.a2)} · `, TXT[k.tipo], k.tipo === 'una' ? `: ${par(k.x, k.y)}` : ''];
    },
    arrastres: [
      ...manijasRecta(VL, 'la recta verde', 'a1', 'c1', 'c-d').map(m => Object.assign(m, { id: `${m.id}-verde` })),
      ...manijasRecta(VL, 'la recta roja', 'a2', 'c2', 'c-h').map(m => Object.assign(m, { id: `${m.id}-roja` })),
    ],
  };
  // Mesa 2: la parábola también sube y baja (y = x² + k) y la recta se agarra por dos puntos (x = −1 y x = 1):
  // con las dos cosas moviéndose, el alumno busca la tangente y ve que Δ = 0 la delata.
  const VP = { x: { min: -4, max: 4, paso: 1, nombre: 'x', decimales: 0, color: 'o' }, y: { min: -4, max: 8, paso: 2, nombre: 'y', decimales: 0, color: 'i' } };
  const parabolaRecta = {
    id: 'parabola-recta', titulo: 'Parábola y recta', pieza: 'ejes',
    consigna: 'Sube o baja la parábola y = x² + k por su vértice. La recta roja se arrastra por dos puntos. Busca un solo punto común.',
    controles: [
      { id: 'k', etiqueta: 'k', color: 'c-d', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
      { id: 'm', etiqueta: 'm', color: 'c-h', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
      { id: 'n', etiqueta: 'n', color: 'c-h', min: -3, max: 5, paso: 1, inicio: 2, decimales: 0 },
    ],
    dibujo: v => {
      const xs = cortesPL(v.m, v.n - v.k);
      const cv = fn => { const out = []; for (let i = 0; i <= 120; i++) { const xx = -4 + 8 * i / 120, yy = fn(xx); out.push(yy >= -4 && yy <= 8 ? [xx, yy] : null); } return out; };
      return { datos: Object.assign({}, VP, {
        curvas: [{ puntos: cv(z => z * z + v.k), color: 'd' }, { puntos: cv(z => v.m * z + v.n), color: 'h' }],
        puntos: xs.filter(z => z * z + v.k <= 8).map(z => ({ x: z, y: z * z + v.k, color: 'o' })),
        alt: `y = x² + ${v.k} y y = ${v.m}x + ${v.n}: ${xs.length} puntos comunes`,
      }), estado: {} };
    },
    lectura: v => [`Puntos comunes: ${cortesPL(v.m, v.n - v.k).length} · Δ = ${f(v.m * v.m + 4 * (v.n - v.k))}`],
    arrastres: [
      { id: 'vertice', etiqueta: 'vértice de la parábola', color: 'c-d',
        donde: v => { const g = EJES().geometria(VP); return { x: g.X(0), y: g.Y(v.k) }; },
        mover: pt => ({ k: inversa(EJES().geometria(VP).Y, -4, 8)(pt.y) }) },
      // Dos puntos de la recta: el de x = −1 vale n − m y el de x = 1, n + m. Al mover uno, el otro se queda.
      ...[-1, 1].map(xm => ({ id: `punto${xm < 0 ? '-izq' : '-der'}`, etiqueta: `punto de x = ${xm} de la recta roja`, color: 'c-h',
        donde: v => { const g = EJES().geometria(VP); return { x: g.X(xm), y: g.Y(v.n + xm * v.m) }; },
        mover: (pt, v) => {
          const yv = inversa(EJES().geometria(VP).Y, -4, 8)(pt.y), otro = v.n - xm * v.m;   // el punto de −xm no se mueve
          return { n: (yv + otro) / 2, m: xm * (yv - otro) / 2 };
        } })),
    ],
  };

  return {
    unidad: 'algebra.sistemas-de-ecuaciones',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/alg-tabla.js'],
    historia: {
      texto: 'Los Nueve capítulos, un libro chino de hace unos dos mil años, resolvían problemas con varias cantidades desconocidas ordenando los coeficientes en tablas y eliminando términos. Lo que hoy llamamos eliminación gaussiana es mucho más antiguo que su nombre. La idea que se conserva es transformar el problema sin cambiar sus soluciones, que pueden ser una, ninguna o infinitas.',
      pregunta: '¿Qué cambio de una ecuación no cambia sus soluciones?',
      fuente: { titulo: 'O’Connor y Robertson, Matrices and determinants — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Matrices_and_determinants/' },
    },
    laboratorio: [rectasLibres, parabolaRecta, Object.assign({ id: 'rangos', titulo: 'Rangos que deciden', pieza: 'alg-tabla' }, rouche.juega, { minimo: undefined })],
    ideas: [dosRectas, gauss, cramer, rouche, noLineal],
  };
});
