/*
 * Teoría de «Funciones» (algebra.funciones). Molde: docs/teoria.md; forma de Álgebra: logica-y-conjuntos.js.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 11), expediente teoria-152-unidades (Álgebra) y
 * historia-ecuaciones (pp. 57–68). Errores: AL22, AL27, AL28 de docs/investigacion/algebra-funciones-ideas-erroneas.md
 * y TAL-* nuevos (hipótesis de diseño, rutinas/teoria-algebra.md).
 * Colores (regla 4): x entrada naranja (c-o), y salida turquesa (c-i), h y a rojo (c-h), k y b verde (c-d).
 * Intervalos con la notación del curso: [a; b] cerrado, ⟨a; b⟩ abierto.
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · leer una función en su gráfica: qué entradas admite, qué salidas da y cómo se mueve al transformarla.
 * Persona y condiciones · 4.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · da dominio y rango, el vértice, el valor de ⌊x⌋ con negativos, una composición y una traslación.
 * Orden de atención · 1.º la curva en el plano · 2.º el punto que se mueve con el control · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué f(x − 2) va a la derecha y por qué el rango no siempre es todo ℝ.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-o', t: 'x' }, y = { v: 'c-i', t: 'y' }, h = { v: 'c-h', t: 'h' }, k = { v: 'c-d', t: 'k' };
  const a = { v: 'c-h', t: 'a' }, b = { v: 'c-d', t: 'b' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r.mezclar = l => { const z = l.slice(); for (let i = z.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [z[i], z[j]] = [z[j], z[i]]; } return z; };
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  // Muestras de una función para la pieza «ejes»: se corta (null) donde no está definida o sale de la ventana.
  function muestra(fn, x0, x1, y0, y1, n = 160) {
    const out = [];
    let dentro = false;
    for (let i = 0; i <= n; i++) {
      const xx = x0 + (x1 - x0) * i / n, yy = fn(xx);
      const ok = Number.isFinite(yy) && yy >= y0 - 1e-9 && yy <= y1 + 1e-9;
      if (ok) { out.push([Math.round(xx * 1000) / 1000, Math.round(yy * 1000) / 1000]); dentro = true; }
      else if (dentro) { out.push(null); dentro = false; }
    }
    return out;
  }
  const signo = v => (v < 0 ? `− ${f(-v)}` : `+ ${f(v)}`);
  const menos = v => (v < 0 ? `+ ${f(-v)}` : `− ${f(v)}`);           // «x − h» con h ya puesto
  const par = (u, v) => `(${f(u)}; ${f(v)})`;
  const ejesBase = (xm, xM, ym, yM, extra = {}) => Object.assign({
    x: { min: xm, max: xM, paso: 1, cada: 1, nombre: 'x', color: 'o', decimales: 0 },
    y: { min: ym, max: yM, paso: 1, cada: 2, nombre: 'y', color: 'i', decimales: 0 },
  }, extra);

  // ---------- Idea 1: entradas permitidas y salidas obtenidas ----------
  // Cambia: h y k de y = √(x − h) + k · Permanece: la forma de la curva · Progresa: el punto de inicio (h; k)
  // · Se reserva: el mínimo de x² + 3, que no es 0 · Debe verse: el rango empieza donde empieza la curva.
  const raiz = (hh, kk) => xx => (xx >= hh ? Math.sqrt(xx - hh) + kk : NaN);
  const dominioRango = {
    id: 'dominio-rango',
    titulo: 'Entradas permitidas, salidas obtenidas',
    temas: ['Dominio y rango'],
    pieza: 'ejes',
    juega: {
      consigna: 'Mueve h y k en y = √(x − h) + k. Mira desde qué x existe la curva y desde qué altura sube.',
      voz: 'Creo que el punto de inicio lo dice todo. Pruébalo.',
      controles: [
        { id: 'h', etiqueta: 'h', color: 'c-h', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'k', etiqueta: 'k', color: 'c-d', min: -2, max: 3, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => ({ datos: ejesBase(-4, 7, -3, 6, {
        curvas: [{ puntos: muestra(raiz(v.h, v.k), -4, 7, -3, 6), color: 'i' }],
        puntos: [{ x: v.h, y: v.k, color: 'h', rotulo: par(v.h, v.k), guias: true }],
      }), estado: {} }),
      lectura: v => [`Dominio [${f(v.h)}; +∞⟩ · Rango [${f(v.k)}; +∞⟩`],
      minimo: 3,
    },
    predice: {
      pregunta: ['La función ', y, ' = ', x, '² + 3 admite cualquier ', x, ' real. ¿Cuál es su rango?'],
      opciones: [
        { id: 'c', texto: '[3; +∞⟩', correcta: true },
        { id: 'todo', texto: 'ℝ, todos los reales', error: 'TAL-RANGO-R', siFuera: 'Sería cierto para una recta inclinada. Aquí x² nunca es negativo: y no baja de 3.' },
        { id: 'cero', texto: '[0; +∞⟩', error: 'TAL-RANGO-BASE', siFuera: 'Ese es el rango de x². El + 3 sube todas las salidas 3 unidades.' },
        { id: 'abierto', texto: '⟨3; +∞⟩', error: 'TAL-BORDE', siFuera: 'Sería cierto si 3 no se alcanzara, pero con x = 0 sale y = 3.' },
      ],
      dibujo: { datos: ejesBase(-3, 3, -1, 12, { puntos: [{ x: 0, y: 3, color: 'i', abierto: true }] }), estado: {} },
      revelar: { datos: ejesBase(-3, 3, -1, 12, {
        curvas: [{ puntos: muestra(xx => xx * xx + 3, -3, 3, -1, 12), color: 'i', rotulo: 'y = x² + 3' }],
        puntos: [{ x: 0, y: 3, color: 'd', rotulo: 'mínimo 3', guias: true }],
      }), estado: {} },
      coincide: 'Coincide: la curva toca 3 en x = 0 y de ahí solo sube.',
    },
    mira: {
      datos: ejesBase(-3, 3, -1, 12, {
        curvas: [{ puntos: muestra(xx => xx * xx + 3, -3, 3, -1, 12), color: 'i', desde: 1 }],
        puntos: [
          { x: 0, y: 3, color: 'd', rotulo: '(0; 3)', guias: true, desde: 2 },
          { x: 2, y: 7, color: 'i', rotulo: '(2; 7)', guias: true, desde: 3 },
        ],
      }),
      voz: 'Primero las entradas; después las salidas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cualquier x real se puede elevar al cuadrado: el dominio es ℝ.', ecuacion: ['Dom = ℝ'] },
        { estado: { corte: 2 }, texto: 'x² nunca es negativo, así que y nunca baja de 3.', ecuacion: [x, '² ≥ 0  ⇒  ', y, ' = ', x, '² + 3 ≥ 3'] },
        { estado: { corte: 3 }, texto: 'Cada altura desde 3 sí se alcanza: y = 7 sale con x = 2.', ecuacion: ['2² + 3 = 7'] },
        { estado: { corte: 3 }, texto: 'El rango son las salidas que de verdad aparecen.', ecuacion: ['Ran = [3; +∞⟩'] },
      ],
    },
    regla: {
      texto: 'El dominio son las entradas permitidas: no se divide entre 0 ni se saca raíz cuadrada de un negativo. El rango son las salidas que de verdad se obtienen.',
      ecuacion: [y, ' = √(', x, ' − ', h, ') + ', k, ':   Dom = [', h, '; +∞⟩,   Ran = [', k, '; +∞⟩'],
      condicion: 'el rango se comprueba: cada valor del rango debe salir de alguna x del dominio, no basta con el codominio.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), p = r.ent(-4, 5), q = r.ent(-3, 4), tipo = s % 4;
        if (tipo === 0 || tipo === 1) {
          const pide = tipo === 0 ? 'dominio' : 'rango';
          const bien = pide === 'dominio' ? p : q, otro = pide === 'dominio' ? q : p;
          return {
            pregunta: ['¿Cuál es el ', pide, ' de ', y, ' = ', ...(p === 0 ? ['√', x] : ['√(', x, ` ${menos(p)})`]), `${q ? ' ' + signo(q) : ''}?`],
            opciones: distintas([
              { id: 'c', texto: `[${f(bien)}; +∞⟩`, correcta: true },
              { id: 'signo', texto: `[${f(-bien)}; +∞⟩`, error: pide === 'dominio' ? 'AL28' : 'TAL-RANGO-SIGNO', siFuera: pide === 'dominio' ? `Sería así con x ${signo(p)}. Aquí la raíz pide x ${menos(p)} ≥ 0.` : 'Eso cambia el signo de lo que se suma afuera de la raíz.' },
              { id: 'cruce', texto: `[${f(otro)}; +∞⟩`, error: 'TAL-DOM-RAN', siFuera: `Ese es el ${pide === 'dominio' ? 'rango' : 'dominio'}: el ${pide} mira ${pide === 'dominio' ? 'las entradas' : 'las salidas'}.` },
              { id: 'abierto', texto: `⟨${f(bien)}; +∞⟩`, error: 'TAL-BORDE', siFuera: `Sería así si ${f(bien)} no se alcanzara; la raíz de 0 sí existe.` },
              { id: 'todo', texto: 'ℝ', error: 'TAL-RANGO-R', siFuera: 'La raíz cuadrada pone un borde: no todo valor sirve.' },
            ]).slice(0, 4),
            solucion: {
              texto: pide === 'dominio' ? 'Lo de adentro de la raíz no puede ser negativo.' : 'La raíz da 0 o más, y luego se suma lo de afuera.',
              ecuacion: pide === 'dominio' ? [x, ` ${menos(p)} ≥ 0  ⇒  `, x, ` ≥ ${f(p)}`] : ['√(…) ≥ 0  ⇒  ', y, ` ≥ ${f(q)}`],
              dibujo: { datos: ejesBase(-5, 8, -4, 8, { curvas: [{ puntos: muestra(raiz(p, q), -5, 8, -4, 8), color: 'i' }], puntos: [{ x: p, y: q, color: 'h', rotulo: par(p, q), guias: true }] }), estado: {} },
            },
          };
        }
        if (tipo === 2) {
          const sube = s % 8 !== 6, m = r.ent(-4, 5);
          return {
            pregunta: ['¿Cuál es el rango de ', y, ` = ${sube ? '' : '−'}`, x, `² ${signo(m)}, con `, x, ' real?'],
            opciones: distintas([
              { id: 'c', texto: sube ? `[${f(m)}; +∞⟩` : `⟨−∞; ${f(m)}]`, correcta: true },
              { id: 'todo', texto: 'ℝ', error: 'TAL-RANGO-R', siFuera: 'Sería cierto para una recta inclinada; x² nunca es negativo.' },
              { id: 'base', texto: sube ? '[0; +∞⟩' : '⟨−∞; 0]', error: 'TAL-RANGO-BASE', siFuera: `Ese es el rango sin el ${signo(m)}; todo se corre ${f(Math.abs(m))}.` },
              { id: 'vuelta', texto: sube ? `⟨−∞; ${f(m)}]` : `[${f(m)}; +∞⟩`, error: 'TAL-RANGO-SENTIDO', siFuera: `Sería así si la parábola abriera hacia ${sube ? 'abajo' : 'arriba'}.` },
            ]),
            solucion: { texto: `${sube ? 'x² ≥ 0' : '−x² ≤ 0'}, y el extremo ${f(m)} se alcanza en x = 0.`, ecuacion: [y, sube ? ' ≥ ' : ' ≤ ', f(m)] },
          };
        }
        const c = r.ent(-4, 5), num = r.uno([1, 2, 3, 5]);
        return {
          pregunta: ['¿Cuál es el dominio de ', y, ' = ', { frac: [String(num), [x, ` ${menos(c)}`]] }, '?'],
          opciones: distintas([
            { id: 'c', texto: `ℝ − {${f(c)}}`, correcta: true },
            { id: 'signo', texto: `ℝ − {${f(-c)}}`, error: 'AL28', siFuera: `Ese valor anularía x ${signo(c)}; aquí el denominador es x ${menos(c)}.` },
            { id: 'todo', texto: 'ℝ', error: 'TAL-DOM-DIV', siFuera: `Con x = ${f(c)} el denominador vale 0, y no se divide entre 0.` },
            { id: 'num', texto: `ℝ − {${f(num)}}`, error: 'TAL-DOM-NUM', siFuera: 'El numerador puede valer lo que sea; el que no puede ser 0 es el denominador.' },
          ]),
          solucion: { texto: 'Se excluye la x que vuelve 0 el denominador.', ecuacion: [x, ` ${menos(c)} = 0  ⇒  `, x, ` = ${f(c)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: el vértice está a mitad de camino ----------
  // Cambia: a, b y c · Permanece: los ejes · Progresa: la parábola y su vértice · Se reserva: a = 0, que la vuelve
  // recta · Debe verse: el vértice queda en el eje de simetría, a mitad de las dos raíces.
  const cuad = (A, B, C) => xx => A * xx * xx + B * xx + C;
  const cuadratica = {
    id: 'cuadratica',
    titulo: 'El vértice, a mitad de camino',
    temas: ['Funciones lineal y cuadrática'],
    pieza: 'ejes',
    juega: {
      consigna: 'Mueve a, b y c en y = ax² + bx + c. Mira hacia dónde abre la curva y dónde queda su vértice. Prueba también a = 0.',
      voz: 'Fíjate qué cambia con el signo de a.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-h', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-d', min: -4, max: 4, paso: 2, inicio: -2, decimales: 0 },
        { id: 'c', etiqueta: 'c', min: -3, max: 3, paso: 1, inicio: -1, decimales: 0 },
      ],
      dibujo: v => {
        const pts = v.a !== 0 ? [{ x: -v.b / (2 * v.a), y: cuad(v.a, v.b, v.c)(-v.b / (2 * v.a)), color: 'd', rotulo: 'vértice', guias: true }] : [{ x: 0, y: v.c, color: 'd', rotulo: `corte en ${f(v.c)}` }];
        return { datos: ejesBase(-5, 5, -8, 8, { curvas: [{ puntos: muestra(cuad(v.a, v.b, v.c), -5, 5, -8, 8), color: 'i' }], puntos: pts.filter(p => Math.abs(p.y) <= 8 && Math.abs(p.x) <= 5) }), estado: {} };
      },
      lectura: v => (v.a === 0 ? [`a = 0: recta de pendiente ${f(v.b)}`] : [`Vértice en x = ${f(-v.b / (2 * v.a))} · abre hacia ${v.a > 0 ? 'arriba' : 'abajo'}`]),
      minimo: 4,
    },
    predice: {
      pregunta: ['En ', y, ' = ', x, '² − 6', x, ' + 5, ¿en qué valor de ', x, ' está el vértice?'],
      opciones: [
        { id: 'c', texto: 'x = 3', correcta: true },
        { id: 'signo', texto: 'x = −3', error: 'TAL-VERTICE-SIGNO', siFuera: 'Sería −3 si fuera + 6x. El vértice está en −b/(2a) = −(−6)/2.' },
        { id: 'c5', texto: 'x = 5', error: 'TAL-CORTE-Y', siFuera: '5 es el valor de y cuando x = 0, no la x del vértice.' },
        { id: 'b', texto: 'x = 6', error: 'TAL-VERTICE-MITAD', siFuera: 'Sería cierto si el vértice estuviera en −b; está en −b dividido entre 2a.' },
      ],
      dibujo: { datos: ejesBase(-1, 7, -5, 7), estado: {} },
      revelar: { datos: ejesBase(-1, 7, -5, 7, {
        curvas: [{ puntos: muestra(cuad(1, -6, 5), -1, 7, -5, 7), color: 'i' }],
        puntos: [{ x: 3, y: -4, color: 'd', rotulo: '(3; −4)', guias: true }],
      }), estado: {} },
      coincide: 'Coincide: −b/(2a) = 6/2 = 3, y ahí la curva da su mínimo.',
    },
    mira: {
      datos: ejesBase(-1, 7, -5, 7, {
        curvas: [{ puntos: muestra(cuad(1, -6, 5), -1, 7, -5, 7), color: 'i' }],
        puntos: [
          { x: 1, y: 0, color: 'h', rotulo: '1', desde: 1 }, { x: 5, y: 0, color: 'h', rotulo: '5', desde: 1 },
          { x: 3, y: -4, color: 'd', rotulo: '(3; −4)', guias: true, desde: 3 },
        ],
        areas: [],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'La curva corta el eje en x = 1 y x = 5.', ecuacion: [x, '² − 6', x, ' + 5 = (', x, ' − 1)(', x, ' − 5)'] },
        { estado: { corte: 2 }, texto: 'La parábola es simétrica: su eje pasa a mitad de camino.', ecuacion: [{ frac: ['1 + 5', '2'] }, ' = 3'] },
        { estado: { corte: 2 }, texto: 'La fórmula da lo mismo sin buscar raíces.', ecuacion: [x, ' = −', { frac: [b, ['2', a]] }, ' = −', { frac: ['−6', '2 · 1'] }, ' = 3'] },
        { estado: { corte: 3 }, texto: 'Como a > 0, abre hacia arriba: el vértice es el mínimo.', ecuacion: [y, '(3) = 9 − 18 + 5 = −4'] },
      ],
    },
    regla: {
      texto: 'En y = ax² + bx + c, el eje de simetría pasa por x = −b/(2a). Con a > 0 el vértice es el mínimo; con a < 0, el máximo.',
      ecuacion: ['vértice en  ', x, ' = −', { frac: [b, ['2', a]] }],
      condicion: 'a ≠ 0 para que sea cuadrática. Con a = 0 queda la función lineal, una recta de pendiente b.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), A = r.uno([1, -1, 2, -2]), H = r.ent(-3, 3) || 2, K = r.ent(-5, 5);
        const B = -2 * A * H, C = A * H * H + K;
        const expr = [y, ` = ${A === 1 ? '' : A === -1 ? '−' : f(A)}`, x, `² ${signo(B)}`, x, ` ${signo(C)}`];
        if (s % 2 === 0) {
          return {
            pregunta: ['En ', ...expr, ', ¿en qué valor de ', x, ' está el vértice?'],
            opciones: distintas([
              { id: 'c', texto: `x = ${f(H)}`, correcta: true },
              { id: 'signo', texto: `x = ${f(-H)}`, error: 'TAL-VERTICE-SIGNO', siFuera: 'Eso olvida el signo menos de −b/(2a).' },
              { id: 'b', texto: `x = ${f(-B)}`, error: 'TAL-VERTICE-MITAD', siFuera: 'Eso es −b; falta dividir entre 2a.' },
              { id: 'c0', texto: `x = ${f(C)}`, error: 'TAL-CORTE-Y', siFuera: `${f(C)} es el valor de y en x = 0.` },
            ]),
            solucion: { texto: 'El vértice está en x = −b/(2a).', ecuacion: [x, ' = −', { frac: [`(${f(B)})`, `2 · (${f(A)})`] }, ` = ${f(H)}`] },
          };
        }
        const max = A < 0;
        return {
          pregunta: ['¿Cuál es el valor ', max ? 'máximo' : 'mínimo', ' de ', ...expr, '?'],
          opciones: distintas([
            { id: 'c', texto: f(K), correcta: true },
            { id: 'corte', texto: f(C), error: 'TAL-CORTE-Y', siFuera: `${f(C)} es y cuando x = 0; el extremo está en x = ${f(H)}.` },
            { id: 'xv', texto: f(H), error: 'TAL-VERTICE-XY', siFuera: `${f(H)} es la x del vértice; se pide su altura y.` },
            { id: 'neg', texto: f(-K), error: 'TAL-RANGO-SIGNO', siFuera: 'Ese valor tiene el signo cambiado; reemplaza la x del vértice.' },
            { id: 'xsigno', texto: f(cuad(A, B, C)(-H)), error: 'TAL-VERTICE-SIGNO', siFuera: `Ese es y en x = ${f(-H)}; el vértice está en x = ${f(H)}.` },
          ]).slice(0, 4),
          solucion: { texto: `Vértice en x = ${f(H)}; ahí se evalúa la función.`, ecuacion: [y, `(${f(H)}) = ${f(K)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: el piso de un negativo ----------
  // Cambia: la familia y la entrada x · Permanece: los ejes y la escala · Progresa: el punto (x; f(x)) · Se reserva:
  // ⌊x⌋ con x negativo no entero · Debe verse: ⌊x⌋ es el entero de la izquierda en la recta, no «quitar decimales».
  const FAM = {
    '|x|': xx => Math.abs(xx), '√x': xx => (xx >= 0 ? Math.sqrt(xx) : NaN),
    'sgn(x)': xx => Math.sign(xx), '⌊x⌋': xx => Math.floor(xx),
  };
  function grafFamilia(nom) {
    if (nom === '⌊x⌋') {
      const curvas = [], puntos = [];
      for (let n = -4; n < 4; n++) {
        curvas.push({ puntos: [[n, n], [n + 1, n]], color: 'i' });
        puntos.push({ x: n, y: n, color: 'i' }, { x: n + 1, y: n, color: 'i', abierto: true });
      }
      return { curvas, puntos };
    }
    if (nom === 'sgn(x)') return { curvas: [{ puntos: [[-4, -1], [0, -1], null, [0, 1], [4, 1]], color: 'i' }], puntos: [{ x: 0, y: -1, color: 'i', abierto: true }, { x: 0, y: 1, color: 'i', abierto: true }, { x: 0, y: 0, color: 'i' }] };
    return { curvas: [{ puntos: muestra(FAM[nom], -4, 4, -4, 4), color: 'i' }], puntos: [] };
  }
  const especiales = {
    id: 'especiales',
    titulo: 'El piso de un negativo',
    temas: ['Valor absoluto, raíz cuadrada, signo y máximo entero'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige una función y una entrada entera x. Mira el punto (x; f(x)). Prueba entradas negativas en las cuatro.',
      voz: 'Creo que √x se niega a algunas entradas. Compruébalo.',
      controles: [
        { id: 'fam', etiqueta: 'Función', opciones: Object.keys(FAM).map(t => ({ valor: t, texto: t })) },
        { id: 'x', etiqueta: 'x', color: 'c-o', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => {
        const g = grafFamilia(v.fam), yy = FAM[v.fam](v.x);
        const pts = Number.isFinite(yy) ? [{ x: v.x, y: yy, color: 'o', rotulo: par(v.x, yy), guias: true }] : [];
        return { datos: ejesBase(-4, 4, -4, 4, { curvas: g.curvas, puntos: [...g.puntos, ...pts] }), estado: {} };
      },
      lectura: v => { const yy = FAM[v.fam](v.x); return Number.isFinite(yy) ? [v.fam.replace('x', f(v.x)), ` = ${f(yy)}`] : [`${v.fam} no existe para x = ${f(v.x)}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: ['⌊', x, '⌋ es el mayor entero menor o igual que ', x, '. ¿Cuánto vale ⌊−1,2⌋?'],
      opciones: [
        { id: 'c', texto: '−2', correcta: true },
        { id: 'trunca', texto: '−1', error: 'TAL-PISO-TRUNCA', siFuera: 'Sería cierto con 1,2: el piso es 1. Pero −1 es mayor que −1,2.' },
        { id: 'abs', texto: '1', error: 'AL22', siFuera: '1 sería el piso de 1,2. El signo menos no se quita.' },
        { id: 'redondeo', texto: '−1,2', error: 'TAL-PISO-ENTERO', siFuera: '−1,2 no es entero; el piso siempre da un entero.' },
      ],
      dibujo: { datos: { min: -4, max: 2, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 1, elementos: [{ tipo: 'punto', x: -1.2, color: 'o', rotulo: '−1,2' }] }, estado: {}, },
      pieza: 'recta',
      revelar: { datos: { min: -4, max: 2, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 1, elementos: [{ tipo: 'punto', x: -1.2, color: 'o', rotulo: '−1,2' }, { tipo: 'salto', a: -1.2, b: -2, color: 'd', rotulo: '⌊−1,2⌋ = −2', fila: 1 }] }, estado: {} },
      coincide: 'Coincide: el entero inmediato a la izquierda de −1,2 es −2.',
    },
    mira: {
      pieza: 'recta',
      datos: {
        min: -4, max: 2, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 3,
        elementos: [
          { tipo: 'punto', x: -1.2, color: 'o', rotulo: '−1,2' },
          { tipo: 'enteros', a: -4, b: -2, color: 'd', rotulo: 'enteros ≤ −1,2', fila: 1, desde: 1 },
          { tipo: 'punto', x: -2, color: 'd', rotulo: 'el mayor: −2', fila: 2, desde: 2 },
          { tipo: 'punto', x: -1, color: 'h', abierto: true, rotulo: 'sin decimales: −1', fila: 3, desde: 3 },
        ],
      },
      pasos: [
        { estado: { corte: 0 }, texto: '−1,2 está entre −2 y −1 en la recta.', ecuacion: ['−2 < −1,2 < −1'] },
        { estado: { corte: 1 }, texto: 'Los enteros menores o iguales que −1,2 son −2, −3, −4…', ecuacion: ['…, −4, −3, −2'] },
        { estado: { corte: 2 }, texto: 'El mayor de ellos es −2: ese es el piso.', ecuacion: ['⌊−1,2⌋ = −2'] },
        { estado: { corte: 3 }, texto: 'Quitar decimales da −1, que queda a la derecha: es mayor.', ecuacion: ['−1 > −1,2'] },
      ],
    },
    regla: {
      texto: '⌊x⌋ es el mayor entero menor o igual que x, también con negativos. |x| es la distancia a 0; √x pide x ≥ 0; sgn(x) da −1, 0 o 1.',
      ecuacion: ['⌊', x, '⌋ = n  ⇔  n ≤ ', x, ' < n + 1'],
      condicion: 'n es entero. Para x positivo, ⌊x⌋ coincide con quitar decimales; para x negativo no entero, no.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let A; do { A = r.ent(-39, 39) / 10; } while (Number.isInteger(A) || (s % 2 === 0 && A > 0) || (s % 3 === 2 && Math.floor(A) === 0));
        const B = r.ent(-6, 6) || -3, piso = Math.floor(A), trunca = Math.trunc(A);
        if (s % 3 !== 2) {
          const bien = piso + Math.abs(B);
          return {
            pregunta: ['¿Cuánto vale ', `⌊${f(A, 1)}⌋ + |${f(B)}|`, '?'],
            opciones: distintas([
              { id: 'c', texto: f(bien), correcta: true },
              { id: 'trunca', texto: f(trunca + Math.abs(B)), error: 'TAL-PISO-TRUNCA', siFuera: `Eso quita decimales a ${f(A, 1)}; el piso va al entero de la izquierda.` },
              { id: 'abs', texto: f(piso + B), error: 'AL22', siFuera: `|${f(B)}| es una distancia: vale ${f(Math.abs(B))}, nunca negativa.` },
              { id: 'redondeo', texto: f(Math.round(A) + Math.abs(B)), error: 'TAL-PISO-REDONDEO', siFuera: `Eso redondea ${f(A, 1)}; el piso no redondea.` },
              { id: 'arriba', texto: f(Math.ceil(A) + Math.abs(B)), error: 'TAL-PISO-TECHO', siFuera: 'Ese es el entero de la derecha; el piso toma el de la izquierda.' },
              { id: 'resta', texto: f(piso - Math.abs(B)), error: 'TAL-ABS-RESTA', siFuera: `|${f(B)}| = ${f(Math.abs(B))} se suma; el valor absoluto no cambia la operación.` },
              { id: 'todo', texto: f(Math.abs(piso) + Math.abs(B)), error: 'AL22', siFuera: `El valor absoluto solo afecta a ${f(B)}; ⌊${f(A, 1)}⌋ conserva su signo.` },
            ]).slice(0, 4),
            solucion: { texto: `⌊${f(A, 1)}⌋ = ${f(piso)} y |${f(B)}| = ${f(Math.abs(B))}.`, ecuacion: [`${f(piso)} + ${f(Math.abs(B))} = ${f(bien)}`] },
          };
        }
        const C = r.uno(piso === 0 ? [-5, -2, 3, 4] : [-5, -2, 0, 3, 4]), sg = Math.sign(C), bien = sg * piso;
        return {
          pregunta: ['¿Cuánto vale ', `sgn(${f(C)}) · ⌊${f(A, 1)}⌋`, '?'],
          opciones: distintas([
            { id: 'c', texto: f(bien), correcta: true },
            { id: 'sgn', texto: f(C * piso), error: 'TAL-SGN', siFuera: `sgn(${f(C)}) no es ${f(C)}: solo dice el signo, ${f(sg)}.` },
            { id: 'trunca', texto: f(sg * trunca), error: 'TAL-PISO-TRUNCA', siFuera: `Eso quita decimales; ⌊${f(A, 1)}⌋ = ${f(piso)}.` },
            { id: 'uno', texto: f(C === 0 ? piso : -bien), error: 'TAL-SGN-CERO', siFuera: C === 0 ? 'sgn(0) = 0, así que el producto es 0.' : 'Revisa el signo de sgn.' },
          ]),
          solucion: { texto: `sgn(${f(C)}) = ${f(sg)} y ⌊${f(A, 1)}⌋ = ${f(piso)}.`, ecuacion: [`${f(sg)} · ${f(piso)} = ${f(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: primero g, después f ----------
  // Cambia: x y el orden de las máquinas · Permanece: f y g · Progresa: la tabla x → g(x) → f(g(x)) · Se reserva:
  // la x que g acepta y f rechaza · Debe verse: el dominio de f∘g mira las dos máquinas.
  const COMP = { f: v => v + 2, g: v => v * v };
  const raizMenos4 = v => (v - 4 >= 0 ? Math.sqrt(v - 4) : NaN);
  const tablaRaiz = (corte0 = 0) => ({
    columnas: ['x', 'g(x) = x − 4', 'f(g(x)) = √(x − 4)'], colorCol: ['o', null, 'i'],
    filas: [2, 4, 8].map(v => [f(v), { t: f(v - 4), desde: corte0 }, Number.isFinite(raizMenos4(v)) ? { t: f(raizMenos4(v)), desde: corte0 + 1, color: 'd', fuerte: true } : { t: 'no existe', desde: corte0 + 1, color: 'h', fuerte: true }]),
    alt: 'Tabla de f(g(x)) = √(x − 4) para x = 2, 4 y 8: con x = 2 no existe',
  });
  const composicion = {
    id: 'composicion',
    titulo: 'Primero g, después f',
    temas: ['Operaciones y composición de funciones'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Con f(x) = x + 2 y g(x) = x², elige x y el orden de las máquinas. La tabla muestra qué sale de cada una.',
      voz: 'Compara las dos columnas finales con la misma x.',
      controles: [
        { id: 'x', etiqueta: 'x', color: 'c-o', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'orden', etiqueta: 'Orden', opciones: [{ valor: 'f∘g', texto: 'f∘g' }, { valor: 'g∘f', texto: 'g∘f' }] },
      ],
      dibujo: v => {
        const g1 = COMP.g(v.x), f1 = COMP.f(v.x);
        return { datos: {
          columnas: ['orden', 'primera', 'segunda'], colorCol: [null, null, 'i'],
          filas: [['f∘g', `g(${f(v.x)}) = ${f(g1)}`, { t: `f(${f(g1)}) = ${f(COMP.f(g1))}`, color: 'i', fuerte: true }], ['g∘f', `f(${f(v.x)}) = ${f(f1)}`, { t: `g(${f(f1)}) = ${f(COMP.g(f1))}`, color: 'i', fuerte: true }]],
          resaltes: [{ f: v.orden === 'f∘g' ? 0 : 1, c: 0, ancho: 3, color: 'o' }],
          alt: `Con x = ${f(v.x)}: f(g(x)) = ${f(COMP.f(g1))} y g(f(x)) = ${f(COMP.g(f1))}`,
        }, estado: {} };
      },
      lectura: v => { const out = v.orden === 'f∘g' ? COMP.f(COMP.g(v.x)) : COMP.g(COMP.f(v.x)); return [`(${v.orden})(`, x, ` = ${f(v.x)}) = ${f(out)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Ahora f(', x, ') = √', x, ' y g(', x, ') = ', x, ' − 4. ¿Cuál es el dominio de f∘g?'],
      opciones: [
        { id: 'c', texto: '[4; +∞⟩', correcta: true },
        { id: 'domf', texto: '[0; +∞⟩', error: 'TAL-COMP-DOM', siFuera: 'Ese es el dominio de f sola. Con x = 2, g da −2 y f no lo acepta.' },
        { id: 'domg', texto: 'ℝ', error: 'TAL-COMP-DOM', siFuera: 'Ese es el dominio de g sola; falta que g(x) entre en f.' },
        { id: 'abierto', texto: '⟨4; +∞⟩', error: 'TAL-BORDE', siFuera: 'Con x = 4 sale √0 = 0, que sí existe.' },
      ],
      dibujo: { datos: tablaRaiz(1), estado: { corte: 0 } },
      revelar: { datos: tablaRaiz(0), estado: { corte: 2 } },
      coincide: 'Coincide: hace falta x − 4 ≥ 0, es decir, x ≥ 4.',
    },
    mira: {
      datos: Object.assign(tablaRaiz(1), { resaltes: [{ f: 0, c: 0, ancho: 3, color: 'h', desde: 3 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Primero entra x a g: le resta 4.', ecuacion: ['g(', x, ') = ', x, ' − 4'] },
        { estado: { corte: 2 }, texto: 'Lo que sale de g entra a f, que saca la raíz.', ecuacion: ['f(g(', x, ')) = √(', x, ' − 4)'] },
        { estado: { corte: 3 }, texto: 'Con x = 2, g da −2: f no acepta negativos.', ecuacion: ['√(−2) no es real'] },
        { estado: { corte: 3 }, texto: 'x debe estar en el dominio de g; g(x), en el de f.', ecuacion: [x, ' − 4 ≥ 0  ⇒  ', x, ' ≥ 4'] },
      ],
    },
    regla: {
      texto: '(f∘g)(x) = f(g(x)): primero actúa g y después f. El orden importa. Las operaciones f + g y f · g se hacen punto a punto.',
      ecuacion: ['(f∘g)(', x, ') = f(g(', x, '))'],
      condicion: 'x debe estar en el dominio de g, y g(x) en el de f. f + g usa el dominio común.',
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s), p = r.ent(1, 5), m = r.ent(2, 3), q = r.ent(-3, 3) || 1, A = r.ent(-3, 3) || 2;
        const F = v => m * v + p, G = v => v * v + q;
        const ft = `f(x) = ${f(m)}x + ${f(p)}`, gt = `g(x) = x² ${signo(q)}`;
        const tipo = s % 4;
        const nom = ['(f∘g)', '(g∘f)', '(f + g)', '(f · g)'][tipo];
        const val = { '(f∘g)': F(G(A)), '(g∘f)': G(F(A)), '(f + g)': F(A) + G(A), '(f · g)': F(A) * G(A) };
        const bien = val[nom];
        const ERR = { '(f∘g)': 'TAL-COMP-ORDEN', '(g∘f)': 'TAL-COMP-ORDEN', '(f + g)': 'TAL-COMP-SUMA', '(f · g)': 'TAL-COMP-PROD' };
        const ops = distintas([{ id: 'c', texto: f(bien), correcta: true }, ...Object.entries(val).filter(([n]) => n !== nom).map(([n, v2], i) => ({ id: `d${i}`, texto: f(v2), error: ERR[n], siFuera: `Ese número es ${n}(${f(A)}). Aquí se pide ${nom}(${f(A)}).` }))]);
        const pasos = tipo === 0 ? `g(${f(A)}) = ${f(G(A))} y f(${f(G(A))}) = ${f(bien)}` : tipo === 1 ? `f(${f(A)}) = ${f(F(A))} y g(${f(F(A))}) = ${f(bien)}` : `f(${f(A)}) = ${f(F(A))} y g(${f(A)}) = ${f(G(A))}`;
        return {
          pregunta: [`Con ${ft} y ${gt}, ¿cuánto vale ${nom}(${f(A)})?`],
          opciones: ops,
          solucion: { texto: tipo < 2 ? 'Se evalúa de adentro hacia afuera.' : 'Se evalúan las dos y se operan los resultados.', ecuacion: [pasos] },
        };
      },
    },
  };

  // ---------- Idea 5: x − h va a la derecha ----------
  // Cambia: k y el reflejo · Permanece: la curva base √x (discontinua) · Progresa: la copia transformada y su punto
  // de inicio · Se reserva: el corrimiento horizontal · Debe verse: f(x − 2) empieza donde x − 2 = 0.
  const BASE = xx => (xx >= 0 ? Math.sqrt(xx) : NaN);
  const REFL = { 'f(x)': (g, xx) => g(xx), '−f(x)': (g, xx) => -g(xx), 'f(−x)': (g, xx) => g(-xx) };
  const traslaciones = {
    id: 'traslaciones',
    titulo: 'Restar adentro corre a la derecha',
    temas: ['Traslaciones y reflexiones de gráficas'],
    pieza: 'ejes',
    juega: {
      consigna: 'La curva discontinua es y = √x. Súmale k y prueba los reflejos −f(x) y f(−x). Sigue el punto que empieza en (4; 2).',
      voz: 'Mira qué eje hace de espejo en cada reflejo.',
      controles: [
        { id: 'k', etiqueta: 'k', color: 'c-d', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
        { id: 'refl', etiqueta: 'Reflejo', opciones: Object.keys(REFL).map(t => ({ valor: t, texto: t })) },
      ],
      dibujo: v => {
        const g = xx => REFL[v.refl](BASE, xx) + v.k;
        const px = v.refl === 'f(−x)' ? -4 : 4, py = (v.refl === '−f(x)' ? -2 : 2) + v.k;
        return { datos: ejesBase(-6, 6, -5, 5, {
          curvas: [{ puntos: muestra(BASE, -6, 6, -5, 5), color: 'o', discontinua: true }, { puntos: muestra(g, -6, 6, -5, 5), color: 'i' }],
          puntos: [{ x: 4, y: 2, color: 'o', abierto: true }, { x: px, y: py, color: 'i', rotulo: par(px, py), guias: true }],
        }), estado: {} };
      },
      lectura: v => [y, ` = ${v.refl.replace('f(x)', '√x').replace('f(−x)', '√(−x)')}${v.k ? ` ${signo(v.k)}` : ''}`],
      minimo: 4,
    },
    predice: {
      pregunta: [y, ' = √', x, ' empieza en (0; 0). ¿Dónde empieza ', y, ' = √(', x, ' − 2) + 1?'],
      opciones: [
        { id: 'c', texto: '(2; 1)', correcta: true },
        { id: 'izq', texto: '(−2; 1)', error: 'AL28', siFuera: 'Sería cierto con √(x + 2). Con x − 2, la raíz vale 0 cuando x = 2.' },
        { id: 'abajo', texto: '(2; −1)', error: 'TAL-K-SIGNO', siFuera: 'El + 1 está afuera de la raíz: sube toda la curva 1.' },
        { id: 'cruce', texto: '(1; 2)', error: 'TAL-HK-CRUCE', siFuera: 'El número de adentro mueve en x; el de afuera, en y.' },
      ],
      dibujo: { datos: ejesBase(-4, 7, -2, 5, { curvas: [{ puntos: muestra(BASE, -4, 7, -2, 5), color: 'o', discontinua: true }], puntos: [{ x: 0, y: 0, color: 'o', rotulo: '(0; 0)' }] }), estado: {} },
      revelar: { datos: ejesBase(-4, 7, -2, 5, {
        curvas: [{ puntos: muestra(BASE, -4, 7, -2, 5), color: 'o', discontinua: true }, { puntos: muestra(xx => BASE(xx - 2) + 1, -4, 7, -2, 5), color: 'i' }],
        puntos: [{ x: 0, y: 0, color: 'o' }, { x: 2, y: 1, color: 'i', rotulo: '(2; 1)', guias: true }],
      }), estado: {} },
      coincide: 'Coincide: x − 2 vale 0 en x = 2, y el + 1 sube la curva.',
    },
    mira: {
      datos: ejesBase(-4, 7, -2, 5, {
        curvas: [
          { puntos: muestra(BASE, -4, 7, -2, 5), color: 'o', discontinua: true },
          { puntos: muestra(xx => BASE(xx - 2), -4, 7, -2, 5), color: 'h', discontinua: true, desde: 2, hasta: 2 },
          { puntos: muestra(xx => BASE(xx - 2) + 1, -4, 7, -2, 5), color: 'i', desde: 3 },
        ],
        puntos: [{ x: 0, y: 0, color: 'o', rotulo: '(0; 0)', hasta: 1 }, { x: 0, y: 0, color: 'o', desde: 2 }, { x: 2, y: 0, color: 'h', rotulo: '(2; 0)', desde: 2, hasta: 2 }, { x: 2, y: 1, color: 'i', rotulo: '(2; 1)', guias: true, desde: 3 }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: '√x empieza donde lo de adentro vale 0: en x = 0.', ecuacion: ['√0 = 0'] },
        { estado: { corte: 2 }, texto: 'En √(x − 2), lo de adentro vale 0 cuando x = 2.', ecuacion: [x, ' − 2 = 0  ⇒  ', x, ' = 2'] },
        { estado: { corte: 3 }, texto: 'El + 1 de afuera sube cada punto una unidad.', ecuacion: [y, ' = √(', x, ' − 2) + 1'] },
        { estado: { corte: 3 }, texto: 'Resultado: 2 a la derecha y 1 arriba.', ecuacion: ['(0; 0)  →  (2; 1)'] },
      ],
    },
    regla: {
      texto: 'y = f(x − h) + k corre la gráfica h a la derecha y k hacia arriba. −f(x) la refleja en el eje x; f(−x), en el eje y.',
      ecuacion: [y, ' = f(', x, ' − ', h, ') + ', k, ':   (', x, '; ', y, ')  →  (', x, ' + ', h, '; ', y, ' + ', k, ')'],
      condicion: 'h se lee en la forma x − h: en f(x + 3), h = −3 y la gráfica va a la izquierda.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), H = r.ent(-4, 4) || 3, K = r.ent(-4, 4) || -1;
        const fam = r.uno([{ t: '(x', fin: ')²', base: 'vértice', p: [0, 0] }, { t: '|x', fin: '|', base: 'vértice', p: [0, 0] }, { t: '√(x', fin: ')', base: 'inicio', p: [0, 0] }]);
        if (s % 3 === 2) {
          const P = [r.ent(1, 4), r.ent(1, 5)], cual = s % 2 ? '−f(x)' : 'f(−x)';
          const bien = cual === '−f(x)' ? [P[0], -P[1]] : [-P[0], P[1]];
          const otro = cual === '−f(x)' ? [-P[0], P[1]] : [P[0], -P[1]];
          return {
            pregunta: [`El punto ${par(...P)} está en la gráfica de y = f(x). ¿Qué punto está en la de y = ${cual}?`],
            opciones: distintas([
              { id: 'c', texto: par(...bien), correcta: true },
              { id: 'otro', texto: par(...otro), error: cual === '−f(x)' ? 'TAL-REFLEJO-Y' : 'TAL-REFLEJO-X', siFuera: `Ese sería de ${cual === '−f(x)' ? 'f(−x)' : '−f(x)'}: refleja en el otro eje.` },
              { id: 'ambos', texto: par(-P[0], -P[1]), error: 'TAL-REFLEJO-AMBOS', siFuera: 'Eso refleja en los dos ejes; aquí cambia solo un signo.' },
              { id: 'igual', texto: par(...P), error: 'TAL-REFLEJO-NADA', siFuera: 'Ese es el punto original; el reflejo lo cambia de lado.' },
            ]),
            solucion: { texto: cual === '−f(x)' ? 'Cambia el signo de y: espejo en el eje x.' : 'Cambia el signo de x: espejo en el eje y.', ecuacion: [`${par(...P)}  →  ${par(...bien)}`] },
          };
        }
        const exprX = `${fam.t} ${menos(H)}${fam.fin}`;
        return {
          pregunta: [`¿Dónde queda el ${fam.base} de y = ${exprX} ${signo(K)}?`],
          opciones: distintas([
            { id: 'c', texto: par(H, K), correcta: true },
            { id: 'izq', texto: par(-H, K), error: 'AL28', siFuera: `Sería así con x ${signo(H)}. Lo de adentro vale 0 en x = ${f(H)}.` },
            { id: 'k', texto: par(H, -K), error: 'TAL-K-SIGNO', siFuera: `El ${signo(K)} de afuera mueve ${K >= 0 ? 'arriba' : 'abajo'}, con su mismo signo.` },
            { id: 'cruce', texto: par(K, H), error: 'TAL-HK-CRUCE', siFuera: 'Lo de adentro mueve en x; lo de afuera, en y.' },
          ]),
          solucion: { texto: `Adentro: x ${menos(H)} = 0 en x = ${f(H)}. Afuera: ${signo(K)}.`, ecuacion: [`(0; 0)  →  ${par(H, K)}`] },
        };
      },
    },
  };

  // ---------- Idea 6: raíces, multiplicidad y extremos ----------
  // Cambia: las tres raíces · Permanece: el signo principal positivo · Progresa: los cortes con el eje · Se reserva:
  // el signo principal negativo · Debe verse: el término de mayor grado decide hacia dónde se van los extremos.
  const cubica = (rs, lider = 1, esc = 1) => xx => lider * rs.reduce((pp, rr) => pp * (xx - rr), 1) / esc;
  const polinomial = {
    id: 'polinomial',
    titulo: 'Raíces y extremos de un polinomio',
    temas: ['Gráfica de una función polinomial'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige las tres raíces de y = (x − r₁)(x − r₂)(x − r₃)/4. Mira dónde corta el eje x. Prueba dos raíces iguales.',
      voz: 'Creo que dos raíces iguales cambian algo. Compruébalo.',
      controles: [
        { id: 'r1', etiqueta: 'r₁', color: 'c-h', min: -3, max: 3, paso: 1, inicio: -2, decimales: 0 },
        { id: 'r2', etiqueta: 'r₂', color: 'c-h', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
        { id: 'r3', etiqueta: 'r₃', color: 'c-h', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => {
        const rs = [v.r1, v.r2, v.r3];
        return { datos: ejesBase(-4, 4, -6, 6, {
          curvas: [{ puntos: muestra(cubica(rs, 1, 4), -4, 4, -6, 6), color: 'i' }],
          puntos: [...new Set(rs)].map(rr => ({ x: rr, y: 0, color: 'h' })),
        }), estado: {} };
      },
      lectura: v => {
        const rs = [v.r1, v.r2, v.r3], d = [...new Set(rs)].sort((p, q) => p - q);
        return [`Cortes en x = ${d.map(z => f(z)).join('; ')}`, d.length < 3 ? ' · una raíz repetida' : ''];
      },
      minimo: 4,
    },
    predice: {
      pregunta: ['En ', y, ' = −(', x, ' − 1)(', x, ' + 1)(', x, ' − 2), cuando ', x, ' crece mucho, ¿qué hace la gráfica?'],
      opciones: [
        { id: 'c', texto: 'Baja sin límite', correcta: true },
        { id: 'sube', texto: 'Sube sin límite', error: 'TAL-SIGNO-PRINCIPAL', siFuera: 'Sería así sin el signo menos: el término principal es −x³.' },
        { id: 'plana', texto: 'Se acerca a 0', error: 'TAL-EXTREMO-PLANO', siFuera: 'Un polinomio no se aplana: su término de mayor grado domina.' },
        { id: 'corta', texto: 'Vuelve a cortar el eje', error: 'TAL-MAS-RAICES', siFuera: 'Solo tiene tres raíces: −1, 1 y 2. Después de 2 no hay más cortes.' },
      ],
      dibujo: { datos: ejesBase(-3, 4, -6, 6, { puntos: [-1, 1, 2].map(rr => ({ x: rr, y: 0, color: 'h', rotulo: f(rr) })) }), estado: {} },
      revelar: { datos: ejesBase(-3, 4, -6, 6, {
        curvas: [{ puntos: muestra(cubica([1, -1, 2], -1), -3, 4, -6, 6), color: 'i' }],
        puntos: [...[-1, 1, 2].map(rr => ({ x: rr, y: 0, color: 'h', rotulo: f(rr) })), { x: 2.5, y: cubica([1, -1, 2], -1)(2.5), color: 'd' }],
      }), estado: {} },
      coincide: 'Coincide: −x³ manda; para x grande, y es muy negativo.',
    },
    mira: {
      datos: ejesBase(-3, 4, -6, 6, {
        curvas: [{ puntos: muestra(cubica([1, -1, 2], -1), -3, 4, -6, 6), color: 'i', desde: 3 }],
        puntos: [
          ...[-1, 1, 2].map(rr => ({ x: rr, y: 0, color: 'h', rotulo: f(rr), desde: 1 })),
          { x: 2.5, y: cubica([1, -1, 2], -1)(2.5), color: 'd', desde: 2 },
          { x: -1.5, y: cubica([1, -1, 2], -1)(-1.5), color: 'd', desde: 2 },
        ],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada factor se anula en una raíz: −1, 1 y 2.', ecuacion: ['(', x, ' − 1)(', x, ' + 1)(', x, ' − 2) = 0'] },
        { estado: { corte: 2 }, texto: `Fuera de las raíces: a la derecha y es negativo; a la izquierda, positivo.`, ecuacion: [y, `(2,5) = ${f(cubica([1, -1, 2], -1)(2.5))}   ·   `, y, `(−1,5) = ${f(cubica([1, -1, 2], -1)(-1.5))}`] },
        { estado: { corte: 3 }, texto: 'Las raíces son simples: la curva cruza el eje en cada una.', ecuacion: ['multiplicidad 1  ⇒  cruza'] },
        { estado: { corte: 3 }, texto: 'El término principal −x³ manda: sube a la izquierda, baja a la derecha.', ecuacion: [y, ' ≈ −', x, '³  para |', x, '| grande'] },
      ],
    },
    regla: {
      texto: 'Las raíces reales son los cortes con el eje x. Con multiplicidad impar la gráfica cruza; con par, toca y rebota. El término de mayor grado decide los extremos.',
      ecuacion: [y, ' = ', a, '(', x, ' − r₁)…(', x, ' − rₙ):  extremos como ', a, x, 'ⁿ'],
      condicion: 'el polinomio está factorizado con raíces reales; una ventana de la gráfica no muestra todo el dominio.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const r1 = r.ent(-3, -1), r2 = r.ent(1, 4), m1 = r.uno([1, 2]), m2 = r.uno([1, 2, 3]), L = r.uno([1, -1, 2, -2]);
        const P = xx => L * (xx - r1) ** m1 * (xx - r2) ** m2;
        const grado = m1 + m2;
        const expr = `y = ${L === 1 ? '' : L === -1 ? '−' : f(L)}(x ${menos(r1)})${m1 > 1 ? '²' : ''}(x ${menos(r2)})${m2 === 2 ? '²' : m2 === 3 ? '³' : ''}`.replace('(x − 0)', 'x').replace('(x + 0)', 'x');
        const tipo = s % 3;
        if (tipo === 0) {
          const bien = P(0);
          return {
            pregunta: [`¿En qué valor corta el eje y la gráfica de ${expr}?`],
            opciones: distintas([
              { id: 'c', texto: f(bien), correcta: true },
              { id: 'sin-l', texto: f(bien / L), error: 'TAL-SIGNO-PRINCIPAL', siFuera: `Eso olvida el factor ${f(L)} de adelante.` },
              { id: 'suma', texto: f(L * (-r1 * m1 - r2 * m2)), error: 'TAL-CORTE-SUMA', siFuera: 'Eso suma las raíces; el corte con y es P(0), un producto.' },
              { id: 'signo', texto: f(-bien), error: 'TAL-CORTE-SIGNO', siFuera: 'Revisa los signos: en x = 0 cada factor vale −r.' },
            ]),
            solucion: { texto: 'El corte con el eje y es el valor en x = 0.', ecuacion: [`P(0) = ${f(bien)}`] },
          };
        }
        if (tipo === 1) {
          const cual = r.uno([[r1, m1], [r2, m2]]);
          const cruza = cual[1] % 2 === 1;
          return {
            pregunta: [`En ${expr}, ¿qué hace la gráfica en x = ${f(cual[0])}?`],
            opciones: [
              { id: 'c', texto: cruza ? 'Cruza el eje x' : 'Toca el eje x y rebota', correcta: true },
              { id: 'otro', texto: cruza ? 'Toca el eje x y rebota' : 'Cruza el eje x', error: 'TAL-MULT', siFuera: `Sería así con multiplicidad ${cruza ? 'par' : 'impar'}; aquí el exponente es ${f(cual[1])}.` },
              { id: 'nada', texto: 'No llega al eje x', error: 'TAL-RAIZ', siFuera: `x = ${f(cual[0])} anula un factor: ahí y = 0.` },
            ],
            solucion: { texto: `El factor de x = ${f(cual[0])} tiene exponente ${f(cual[1])}, ${cruza ? 'impar' : 'par'}.`, ecuacion: [cruza ? 'impar  ⇒  cruza' : 'par  ⇒  rebota'] },
          };
        }
        const derecha = s % 2 === 0, va = derecha ? Math.sign(L) : Math.sign(L) * (grado % 2 ? -1 : 1);
        return {
          pregunta: [`En ${expr}, cuando x se va hacia ${derecha ? '+∞' : '−∞'}, ¿la gráfica sube o baja?`],
          opciones: [
            { id: 'c', texto: va > 0 ? 'Sube sin límite' : 'Baja sin límite', correcta: true },
            { id: 'otro', texto: va > 0 ? 'Baja sin límite' : 'Sube sin límite', error: 'TAL-SIGNO-PRINCIPAL', siFuera: `El término principal es ${L < 0 ? '−' : ''}${Math.abs(L) === 1 ? '' : f(Math.abs(L))}x${'⁰¹²³⁴⁵⁶'[grado]}; revisa su signo ahí.` },
            { id: 'plana', texto: 'Se acerca a 0', error: 'TAL-EXTREMO-PLANO', siFuera: 'Un polinomio no se aplana: su término de mayor grado domina.' },
          ],
          solucion: { texto: `Grado ${grado}, coeficiente principal ${f(L)}: manda ${L < 0 ? '−' : ''}${Math.abs(L) === 1 ? '' : f(Math.abs(L))}x${'⁰¹²³⁴⁵⁶'[grado]}.`, ecuacion: [`x → ${derecha ? '+∞' : '−∞'}  ⇒  `, y, ` → ${va > 0 ? '+∞' : '−∞'}`] },
        };
      },
    },
  };

  return {
    unidad: 'algebra.funciones',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/alg-tabla.js'],
    historia: {
      texto: 'La idea de función no nació completa. Pasó por problemas de curvas y de cálculo, y en el siglo XVIII Euler la escribió como expresión analítica. Después se amplió: una función no tiene que ser una fórmula bonita ni una curva continua. Hoy lo decisivo es que cada entrada de su dominio tenga una única salida.',
      pregunta: '¿Toda tabla de valores describe una función?',
      fuente: { titulo: 'O’Connor y Robertson, The function concept — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Functions/' },
    },
    ideas: [dominioRango, cuadratica, especiales, composicion, traslaciones, polinomial],
  };
});
