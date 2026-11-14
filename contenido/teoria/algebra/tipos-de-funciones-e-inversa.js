/*
 * Teoría de «Tipos de funciones e inversa» (algebra.tipos-de-funciones-e-inversa). Molde: docs/teoria.md; forma de
 * Álgebra: logica-y-conjuntos.js. Fuente: docs/teoria/matriz/algebra.json (unidad 12), expediente teoria-152-unidades
 * («el reflejo es función inversa solo cuando la correspondencia es biyectiva entre dominio y codominio elegidos») e
 * historia-ecuaciones (pp. 57–68). Errores: AL29 (f⁻¹ = 1/f) de docs/investigacion/algebra-funciones-ideas-erroneas.md
 * y TAL-* nuevos (hipótesis de diseño, rutinas/teoria-algebra.md).
 * Colores (regla 4): x entrada naranja (c-o), y salida turquesa (c-i), la recta horizontal o f⁻¹ rojo (c-h),
 * parámetros m y b verde (c-d). Intervalos: [a; b] cerrado, ⟨a; b⟩ abierto. En el laboratorio, el tanque B va en
 * violeta (c-f) para distinguirlo del A.
 * Ronda 2 (14 nov 2026): gesto directo en las cinco ideas (el punto de x = a, los bordes del intervalo, la recta
 * horizontal, el corte y el punto de x = 1 de f, el inicio y el vaciado del tanque), llaves en las reglas y un
 * laboratorio de tres mesas (reflejo con dominio recortable, recta horizontal con dominio, dos tanques).
 * Las cinco ideas usan la pieza «ejes» en el juego y en «Mira» (hallazgo 9: misma representación).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · reconocer en la gráfica qué tipo de función es y cuándo se puede deshacer.
 * Persona y condiciones · 5.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · decide paridad con dominio simétrico, halla extremos en un intervalo, clasifica inyectiva,
 *   sobreyectiva o biyectiva, calcula f⁻¹(c) y fija el dominio de un modelo.
 * Orden de atención · 1.º la curva · 2.º la manija: el punto espejo o la recta de prueba · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué x² no tiene inversa en ℝ y sí en [0; +∞⟩, y por qué f⁻¹ no es 1/f.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-o', t: 'x' }, y = { v: 'c-i', t: 'y' }, m = { v: 'c-d', t: 'm' }, b = { v: 'c-d', t: 'b' };
  const finv = { sup: ['f', '−1'] };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
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
  const par = (u, v) => `(${f(u)}; ${f(v)})`;
  const ejesBase = (xm, xM, ym, yM, extra = {}) => Object.assign({
    x: { min: xm, max: xM, paso: 1, cada: 1, nombre: 'x', color: 'o', decimales: 0 },
    y: { min: ym, max: yM, paso: 1, cada: 2, nombre: 'y', color: 'i', decimales: 0 },
  }, extra);
  // Gesto directo (docs/teoria.md §4b): manijas en coordenadas de la pieza «ejes», con la inversa lineal de su escala.
  // Los juegos con arrastre usan ejes de rango fijo, para que la manija no se escape.
  const invLineal = (escala, p, q) => px => p + (px - escala(p)) * (q - p) / (escala(q) - escala(p));
  const EJES = () => Kit.piezas.ejes;
  const lienzoDe = datos => { const g = EJES().geometria(datos); return { X: g.X, Y: g.Y, aX: invLineal(g.X, datos.x.min, datos.x.max), aY: invLineal(g.Y, datos.y.min, datos.y.max) }; };
  const lienzo = (xm, xM, ym, yM) => lienzoDe(ejesBase(xm, xM, ym, yM));

  // ---------- Idea 1: par e impar piden dominio simétrico ----------
  // Cambia: la función y la entrada a (se arrastra el punto de x = a) · Permanece: los ejes · Progresa: el par de puntos x = a y x = −a · Se reserva:
  // el dominio que no es simétrico · Debe verse: par es espejo en el eje y; impar, giro de media vuelta en el origen.
  const PARES = { 'x²': v => v * v, 'x³': v => v ** 3, 'x³ − 3x': v => v ** 3 - 3 * v, '|x|': v => Math.abs(v), 'x² + x': v => v * v + v, 'x + 1': v => v + 1 };
  const clase = fn => {
    const xs = [0.5, 1, 1.7, 2.3];
    const esPar = xs.every(v => Math.abs(fn(-v) - fn(v)) < 1e-9), esImpar = xs.every(v => Math.abs(fn(-v) + fn(v)) < 1e-9);
    return esPar ? 'par' : esImpar ? 'impar' : 'ninguna';
  };
  const paridad = {
    id: 'paridad',
    titulo: 'Par, impar y su espejo',
    temas: ['Funciones par e impar'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige una función y un valor a. Compara los puntos de x = a y x = −a: ¿misma altura, altura opuesta o ninguna de las dos?',
      voz: 'Creo que el eje y hace de espejo en algunas. Compruébalo.',
      controles: [
        { id: 'fn', etiqueta: 'f(x)', opciones: Object.keys(PARES).map(t => ({ valor: t, texto: t })) },
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 0.5, max: 2, paso: 0.5, inicio: 1, decimales: 1 },
      ],
      dibujo: v => {
        const g = PARES[v.fn];
        return { datos: ejesBase(-3, 3, -8, 8, {
          curvas: [{ puntos: muestra(g, -3, 3, -8, 8), color: 'i' }],
          puntos: [{ x: v.a, y: g(v.a), color: 'o', guias: true }, { x: -v.a, y: g(-v.a), color: 'h', guias: true }],
          alt: `Gráfica de f(x) = ${v.fn} con los puntos de x = ${f(v.a)} y x = −${f(v.a)}`,
        }), estado: {} };
      },
      lectura: v => { const g = PARES[v.fn]; return [`f(−${f(v.a, 1)}) = ${f(g(-v.a))} · f(${f(v.a, 1)}) = ${f(g(v.a))} · ${clase(g)}`]; },
      minimo: 4,
      // Arrastra el punto de x = a por la curva: su espejo en x = −a se mueve solo.
      arrastres: [{ id: 'punto-a', etiqueta: 'punto de x = a', color: 'c-o',
        donde: v => { const g = lienzo(-3, 3, -8, 8); return { x: g.X(v.a), y: g.Y(PARES[v.fn](v.a)) }; },
        mover: pt => ({ a: lienzo(-3, 3, -8, 8).aX(pt.x) }) }],
    },
    predice: {
      pregunta: ['f(', x, ') = ', x, '² con dominio [−1; 3]. ¿Es una función par?'],
      opciones: [
        { id: 'c', texto: 'No: su dominio no es simétrico', correcta: true },
        { id: 'si', texto: 'Sí, porque (−x)² = x²', error: 'TAL-PAR-DOMINIO', siFuera: 'Sería par con dominio [−3; 3]. Aquí x = 2 está y x = −2 no.' },
        { id: 'impar', texto: 'Es impar', error: 'TAL-PAR-IMPAR', siFuera: 'Impar pediría f(−x) = −f(x); x² nunca da alturas opuestas.' },
      ],
      dibujo: { datos: ejesBase(-4, 4, -1, 10, { curvas: [{ puntos: muestra(v => v * v, -1, 3, -1, 10), color: 'i' }], puntos: [{ x: -1, y: 1, color: 'i' }, { x: 3, y: 9, color: 'i' }] }), estado: {} },
      revelar: { datos: ejesBase(-4, 4, -1, 10, {
        curvas: [{ puntos: muestra(v => v * v, -1, 3, -1, 10), color: 'i' }],
        puntos: [{ x: 2, y: 4, color: 'o', rotulo: '(2; 4)', guias: true }, { x: -2, y: 4, color: 'h', abierto: true, rotulo: 'x = −2 no está' }],
      }), estado: {} },
      coincide: 'Coincide: la fórmula es simétrica, pero al dominio le falta la mitad del espejo.',
    },
    mira: {
      datos: ejesBase(-3, 3, -8, 8, {
        curvas: [{ puntos: muestra(PARES['x³ − 3x'], -3, 3, -8, 8), color: 'i', desde: 1 }],
        puntos: [
          { x: 2, y: PARES['x³ − 3x'](2), color: 'o', rotulo: par(2, PARES['x³ − 3x'](2)), guias: true, desde: 2 },
          { x: -2, y: PARES['x³ − 3x'](-2), color: 'h', rotulo: par(-2, PARES['x³ − 3x'](-2)), guias: true, desde: 3 },
        ],
        alt: 'Gráfica de x³ − 3x: el punto de x = −2 es el de x = 2 girado media vuelta en el origen',
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'f(x) = x³ − 3x, con dominio ℝ, que es simétrico.', ecuacion: ['Dom = ℝ'] },
        { estado: { corte: 2 }, texto: `Con x = 2: 8 − 6 = ${f(PARES['x³ − 3x'](2))}.`, ecuacion: [`f(2) = ${f(PARES['x³ − 3x'](2))}`] },
        { estado: { corte: 3 }, texto: 'Con −x, cada potencia impar cambia de signo.', ecuacion: ['f(−', x, ') = −', x, '³ + 3', x, ' = −f(', x, ')'] },
        { estado: { corte: 3 }, texto: 'Alturas opuestas en x y −x: es impar, simétrica respecto al origen.', ecuacion: ['f(−2) = −f(2)'] },
      ],
    },
    regla: {
      texto: 'f es par si f(−x) = f(x): su gráfica es simétrica respecto al eje y. Es impar si f(−x) = −f(x): simétrica respecto al origen.',
      ecuacion: ['f(−', x, ') = ', { llave: ['f(', x, ')'], nota: 'par' }, '  o  ', { llave: ['−f(', x, ')'], nota: 'impar' }],
      condicion: 'el dominio es simétrico: si x está en el dominio, −x también. Sin eso no es par ni impar.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        const c1 = r.ent(2, 4), c2 = r.ent(2, 5), c3 = r.ent(1, 3);
        const FAM = [
          { t: `${f(c1)}x⁴ ${signo(-c2)}x²`, fn: v => c1 * v ** 4 - c2 * v * v },
          { t: `${f(c1)}x³ ${signo(c2)}x`, fn: v => c1 * v ** 3 + c2 * v },
          { t: `x² ${signo(c2)}x`, fn: v => v * v + c2 * v },
          { t: `${f(c1)}x⁵ ${signo(-c2)}x³`, fn: v => c1 * v ** 5 - c2 * v ** 3 },
          { t: `x² ${signo(c3)}`, fn: v => v * v + c3 },
          { t: `x³ ${signo(c3)}`, fn: v => v ** 3 + c3 },
        ];
        const F = FAM[(s >> 1) % FAM.length];
        const asim = tipo === 2;
        const dom = asim ? `[−${c3}; ${c3 + 2}]` : 'ℝ';
        const verdad = asim ? 'ninguna' : clase(F.fn);
        const TX = { par: 'Par', impar: 'Impar', ninguna: 'Ni par ni impar' }, DICE = { par: 'Es par', impar: 'Es impar', ninguna: 'No es par ni impar' };
        const porque = asim ? `el dominio ${dom} no es simétrico` : verdad === 'par' ? 'f(−x) = f(x)' : verdad === 'impar' ? 'f(−x) = −f(x)' : `f(−1) = ${f(F.fn(-1))} y f(1) = ${f(F.fn(1))}`;
        return {
          pregunta: [`f(x) = ${F.t}, con dominio ${dom}. ¿Qué tipo de función es?`],
          opciones: ['par', 'impar', 'ninguna'].map(id => (id === verdad ? { id, texto: TX[id], correcta: true }
            : { id, texto: TX[id], error: asim && id !== 'ninguna' ? 'TAL-PAR-DOMINIO' : 'TAL-PARIDAD', siFuera: asim ? `La fórmula importa, pero ${porque}.` : `Compara f(−1) = ${f(F.fn(-1))} con f(1) = ${f(F.fn(1))}.` })),
          solucion: { texto: `${DICE[verdad]}: ${porque}.`, ecuacion: [`f(−1) = ${f(F.fn(-1))}`, '   ·   ', `f(1) = ${f(F.fn(1))}`] },
        };
      },
    },
  };

  // ---------- Idea 2: monotonía y cotas en un intervalo ----------
  // Cambia: los bordes a y b del intervalo, que se arrastran por la curva · Permanece: la parábola y = x² · Progresa: el tramo resaltado y sus
  // extremos · Se reserva: el mínimo que cae adentro, no en un borde · Debe verse: si no es monótona, mira el vértice.
  const cuadr = v => v * v;
  const tramo = (a, bb, fn = cuadr) => {
    const xs = [a, bb, ...(a < 0 && bb > 0 ? [0] : [])], ys = xs.map(fn);
    return { min: Math.min(...ys), max: Math.max(...ys) };
  };
  const monotona = {
    id: 'monotona',
    titulo: 'Sube, baja y queda acotada',
    temas: ['Funciones monótonas y acotadas'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige los bordes a y b de un intervalo para y = x². ¿El tramo resaltado solo sube, solo baja o hace las dos cosas?',
      voz: 'Fíjate dónde queda el punto más bajo del tramo.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: -3, max: 2, paso: 1, inicio: 1, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-o', min: -2, max: 3, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: v => {
        const a = Math.min(v.a, v.b), bb = Math.max(v.a, v.b);
        return { datos: ejesBase(-4, 4, -1, 10, {
          curvas: [{ puntos: muestra(cuadr, -4, 4, -1, 10), color: 'o', discontinua: true }, ...(bb > a ? [{ puntos: muestra(cuadr, a, bb, -1, 10, 80), color: 'i' }] : [])],
          puntos: [{ x: a, y: a * a, color: 'i' }, { x: bb, y: bb * bb, color: 'i' }],
        }), estado: {} };
      },
      lectura: v => {
        const a = Math.min(v.a, v.b), bb = Math.max(v.a, v.b), t = tramo(a, bb);
        const tipo = a === bb ? 'un solo punto' : bb <= 0 ? 'decreciente' : a >= 0 ? 'creciente' : 'baja y sube';
        return [`[${f(a)}; ${f(bb)}]: ${tipo} · entre ${f(t.min)} y ${f(t.max)}`];
      },
      minimo: 4,
      // Arrastra cada borde por la parábola: a lo ancho mueve a o b.
      arrastres: ['a', 'b'].map(id => ({ id: `borde-${id}`, etiqueta: `borde ${id} del intervalo`, color: 'c-o',
        donde: v => { const g = lienzo(-4, 4, -1, 10); return { x: g.X(v[id]), y: g.Y(v[id] * v[id]) }; },
        mover: pt => ({ [id]: lienzo(-4, 4, -1, 10).aX(pt.x) }) })),
    },
    predice: {
      pregunta: ['¿Cuál es el valor más pequeño de ', y, ' = ', x, '² cuando ', x, ' recorre [−2; 3]?'],
      opciones: [
        { id: 'c', texto: '0', correcta: true },
        { id: 'borde', texto: '4', error: 'TAL-EXTREMO-BORDE', siFuera: '4 es f(−2), un borde. Sería el mínimo si la función solo subiera en todo el tramo.' },
        { id: 'neg', texto: '−4', error: 'TAL-CUADRADO-NEG', siFuera: 'x² nunca es negativo: (−2)² = 4.' },
        { id: 'max', texto: '9', error: 'TAL-MIN-MAX', siFuera: '9 es el valor más grande, en x = 3.' },
      ],
      dibujo: { datos: ejesBase(-4, 4, -1, 10, { puntos: [{ x: -2, y: 4, color: 'i', rotulo: '(−2; 4)' }, { x: 3, y: 9, color: 'i', rotulo: '(3; 9)' }] }), estado: {} },
      revelar: { datos: ejesBase(-4, 4, -1, 10, {
        curvas: [{ puntos: muestra(cuadr, -2, 3, -1, 10), color: 'i' }],
        puntos: [{ x: -2, y: 4, color: 'i', rotulo: '(−2; 4)' }, { x: 3, y: 9, color: 'i', rotulo: '(3; 9)' }, { x: 0, y: 0, color: 'd', rotulo: 'mínimo 0' }],
      }), estado: {} },
      coincide: 'Coincide: el tramo baja hasta x = 0 y después sube; el mínimo está adentro.',
    },
    mira: {
      datos: ejesBase(-4, 4, -1, 10, {
        curvas: [{ puntos: muestra(cuadr, -2, 0, -1, 10), color: 'h', desde: 1 }, { puntos: muestra(cuadr, 0, 3, -1, 10), color: 'd', desde: 2 }],
        puntos: [{ x: 0, y: 0, color: 'd', rotulo: 'mín 0', desde: 3 }, { x: 3, y: 9, color: 'd', rotulo: 'máx 9', desde: 3 }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'De −2 a 0, x² baja: es decreciente en [−2; 0].', ecuacion: ['4 > 1 > 0'] },
        { estado: { corte: 2 }, texto: 'De 0 a 3, x² sube: es creciente en [0; 3].', ecuacion: ['0 < 1 < 4 < 9'] },
        { estado: { corte: 3 }, texto: 'El cambio de sentido deja el mínimo adentro, en x = 0.', ecuacion: ['mín = f(0) = 0', '   ·   ', 'máx = f(3) = 9'] },
        { estado: { corte: 3 }, texto: 'Todos los valores quedan entre 0 y 9: está acotada.', ecuacion: ['0 ≤ ', y, ' ≤ 9'] },
      ],
    },
    regla: {
      texto: 'f es creciente en un intervalo si a mayor x da mayor f(x); decreciente si da menor. Está acotada si sus valores quedan entre dos números fijos.',
      ecuacion: [{ sub: [x, '1'] }, ' < ', { sub: [x, '2'] }, '  ⇒  ', { llave: ['f(', { sub: [x, '1'] }, ') < f(', { sub: [x, '2'] }, ')'], nota: 'creciente', color: 'c-i' }],
      condicion: 'se dice en qué intervalo. Si ahí no es monótona, el mínimo o el máximo puede quedar adentro, no en un borde.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), H = r.ent(-2, 2), K = r.ent(-3, 3);
        const fn = v => (v - H) ** 2 + K;
        let a, bb;
        if (s % 2 === 0) { a = H - r.ent(1, 3); bb = H + r.ent(1, 3); } else { a = H + r.ent(0, 1); bb = a + r.ent(2, 3); }
        const pideMin = s % 3 !== 2;
        const ys = [fn(a), fn(bb), ...(a < H && bb > H ? [fn(H)] : [])];
        const bien = pideMin ? Math.min(...ys) : Math.max(...ys);
        const expr = `${H ? `(x ${H < 0 ? '+ ' + f(-H) : '− ' + f(H)})²` : 'x²'}${K ? ' ' + signo(K) : ''}`;
        return {
          pregunta: [`¿Cuál es el valor ${pideMin ? 'mínimo' : 'máximo'} de f(x) = ${expr} en el intervalo [${f(a)}; ${f(bb)}]?`],
          opciones: distintas([
            { id: 'c', texto: f(bien), correcta: true },
            { id: 'a', texto: f(fn(a)), error: 'TAL-EXTREMO-BORDE', siFuera: `Ese es f(${f(a)}), el borde izquierdo. Revisa si la función cambia de sentido.` },
            { id: 'b', texto: f(fn(bb)), error: 'TAL-EXTREMO-BORDE', siFuera: `Ese es f(${f(bb)}), el borde derecho. Revisa si la función cambia de sentido.` },
            { id: 'k', texto: f(K), error: 'TAL-VERTICE-AFUERA', siFuera: `Ese es el vértice, en x = ${f(H)}; ${a <= H && H <= bb ? 'aquí no es el valor pedido' : 'queda fuera del intervalo'}.` },
            { id: 'otro', texto: f(pideMin ? Math.max(...ys) : Math.min(...ys)), error: 'TAL-MIN-MAX', siFuera: `Ese es el valor ${pideMin ? 'máximo' : 'mínimo'}.` },
          ]).slice(0, 4),
          solucion: { texto: `Se comparan los bordes${a < H && bb > H ? ' y el vértice, que está adentro' : '; el vértice queda afuera'}.`, ecuacion: [`f(${f(a)}) = ${f(fn(a))}, f(${f(bb)}) = ${f(fn(bb))}${a < H && bb > H ? `, f(${f(H)}) = ${f(K)}` : ''}`] },
        };
      },
    },
  };

  // ---------- Idea 3: una recta horizontal decide ----------
  // Cambia: la función y la altura c (se arrastra la recta) · Permanece: los ejes · Progresa: los cortes de y = c con la gráfica · Se
  // reserva: x² con dominio y codominio [0; +∞⟩ · Debe verse: inyectiva = cada altura se toca a lo más una vez.
  const FUNS = { '2x + 1': v => 2 * v + 1, 'x²': v => v * v, 'x³': v => v ** 3, '|x| − 1': v => Math.abs(v) - 1 };
  const cortes = (fn, c, x0 = -4, x1 = 4) => {
    const out = [];
    const N = 800;
    for (let i = 0; i < N; i++) {
      const u = x0 + (x1 - x0) * i / N, w = x0 + (x1 - x0) * (i + 1) / N, du = fn(u) - c, dw = fn(w) - c;
      if (du === 0) out.push(u); else if (du * dw < 0) out.push(u + (w - u) * du / (du - dw));
    }
    return out.filter((z, i, l) => i === 0 || Math.abs(z - l[i - 1]) > 1e-6).map(z => Math.round(z * 100) / 100);
  };
  const inyectiva = {
    id: 'inyectiva',
    titulo: 'Una recta horizontal decide',
    temas: ['Inyectiva, sobreyectiva y biyectiva'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige una función y sube o baja la recta y = c. Cuenta cuántas veces la toca. Busca alturas que se toquen dos veces.',
      voz: 'Creo que contar cortes basta. Probemos varias alturas.',
      controles: [
        { id: 'fn', etiqueta: 'f(x)', opciones: Object.keys(FUNS).map(t => ({ valor: t, texto: t })) },
        { id: 'c', etiqueta: 'c', color: 'c-h', min: -3, max: 5, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => {
        const g = FUNS[v.fn], cs = cortes(g, v.c);
        return { datos: ejesBase(-4, 4, -4, 6, {
          curvas: [{ puntos: muestra(g, -4, 4, -4, 6), color: 'i' }, { puntos: [[-4, v.c], [4, v.c]], color: 'h', discontinua: true }],
          puntos: cs.map(z => ({ x: z, y: v.c, color: 'h' })),
        }), estado: {} };
      },
      lectura: v => { const n = cortes(FUNS[v.fn], v.c).length; return [`y = ${f(v.c)} la toca ${n} ${n === 1 ? 'vez' : 'veces'}`]; },
      minimo: 4,
      // Arrastra la recta horizontal desde su extremo derecho: a lo alto mueve c.
      arrastres: [{ id: 'recta', etiqueta: 'recta horizontal y = c', color: 'c-h',
        donde: v => { const g = lienzo(-4, 4, -4, 6); return { x: g.X(3.5), y: g.Y(v.c) }; },
        mover: pt => ({ c: lienzo(-4, 4, -4, 6).aY(pt.y) }) }],
    },
    predice: {
      pregunta: ['f(', x, ') = ', x, '² va de [0; +∞⟩ a [0; +∞⟩: dominio y codominio son los no negativos. ¿Es biyectiva?'],
      opciones: [
        { id: 'c', texto: 'Sí: cada altura se toca una sola vez', correcta: true },
        { id: 'no-iny', texto: 'No: x² no es inyectiva', error: 'TAL-DOMINIO-OLVIDA', siFuera: 'Sería cierto en todo ℝ, donde −2 y 2 dan 4. Aquí no hay x negativas.' },
        { id: 'no-sob', texto: 'No: no llega a todos los reales', error: 'TAL-CODOMINIO', siFuera: 'Sería cierto con codominio ℝ. Aquí el codominio es [0; +∞⟩ y lo cubre entero.' },
      ],
      dibujo: { datos: ejesBase(-4, 4, -1, 9, { curvas: [{ puntos: muestra(cuadr, -4, 4, -1, 9), color: 'o', discontinua: true }] }), estado: {} },
      revelar: { datos: ejesBase(-4, 4, -1, 9, {
        curvas: [{ puntos: muestra(cuadr, -4, 0, -1, 9), color: 'o', discontinua: true }, { puntos: muestra(cuadr, 0, 4, -1, 9), color: 'i' }, { puntos: [[-4, 4], [4, 4]], color: 'h', discontinua: true }],
        puntos: [{ x: 2, y: 4, color: 'h', rotulo: 'un solo corte' }],
      }), estado: {} },
      coincide: 'Coincide: sin las x negativas, cada altura de 0 hacia arriba se toca una vez.',
    },
    mira: {
      datos: ejesBase(-4, 4, -1, 9, {
        curvas: [
          { puntos: muestra(cuadr, -4, 4, -1, 9), color: 'o', discontinua: true, hasta: 1 },
          { puntos: [[-4, 4], [4, 4]], color: 'h', discontinua: true },
          { puntos: muestra(cuadr, 0, 4, -1, 9), color: 'i', desde: 2 },
        ],
        puntos: [{ x: -2, y: 4, color: 'h', rotulo: '−2', hasta: 1 }, { x: 2, y: 4, color: 'h', rotulo: '2' }, { x: 0, y: 0, color: 'i', desde: 3, rotulo: 'desde 0' }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'En ℝ, la altura 4 se toca dos veces: en −2 y en 2.', ecuacion: ['f(−2) = f(2) = 4'] },
        { estado: { corte: 2 }, texto: 'Si el dominio es [0; +∞⟩, queda una sola rama: un corte.', ecuacion: ['inyectiva en [0; +∞⟩'] },
        { estado: { corte: 3 }, texto: 'Toda altura y ≥ 0 se alcanza, con x = √y.', ecuacion: ['sobreyectiva sobre [0; +∞⟩'] },
        { estado: { corte: 3 }, texto: 'Inyectiva y sobreyectiva a la vez: es biyectiva.', ecuacion: ['biyectiva'] },
      ],
    },
    regla: {
      texto: 'Inyectiva: entradas distintas dan salidas distintas. Sobreyectiva: toda salida del codominio se alcanza. Biyectiva: las dos a la vez.',
      ecuacion: [{ sub: [x, '1'] }, ' ≠ ', { sub: [x, '2'] }, '  ⇒  ', { llave: ['f(', { sub: [x, '1'] }, ') ≠ f(', { sub: [x, '2'] }, ')'], nota: 'salidas distintas', color: 'c-i' }],
      condicion: 'se dicen el dominio y el codominio: la misma fórmula puede ser biyectiva con unos y no con otros.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), k = r.ent(-3, 3) || 2, mm = r.uno([2, 3, -2]);
        // Cada caso: fórmula, dominio (x0, x1) y codominio [c0, c1] (±Infinity). La clase se decide revisando valores.
        const INF = 50;
        const CASOS = [
          { t: `${f(mm)}x ${signo(k)}`, fn: v => mm * v + k, d: [-INF, INF], dt: 'ℝ', c: [-Infinity, Infinity], ct: 'ℝ' },
          { t: `x² ${signo(k)}`, fn: v => v * v + k, d: [-INF, INF], dt: 'ℝ', c: [-Infinity, Infinity], ct: 'ℝ' },
          { t: `x² ${signo(k)}`, fn: v => v * v + k, d: [-INF, INF], dt: 'ℝ', c: [k, Infinity], ct: `[${f(k)}; +∞⟩` },
          { t: `x² ${signo(k)}`, fn: v => v * v + k, d: [0, INF], dt: '[0; +∞⟩', c: [-Infinity, Infinity], ct: 'ℝ' },
          { t: `x² ${signo(k)}`, fn: v => v * v + k, d: [0, INF], dt: '[0; +∞⟩', c: [k, Infinity], ct: `[${f(k)}; +∞⟩` },
          { t: `x³ ${signo(k)}`, fn: v => v ** 3 + k, d: [-INF, INF], dt: 'ℝ', c: [-Infinity, Infinity], ct: 'ℝ' },
          { t: `|x| ${signo(k)}`, fn: v => Math.abs(v) + k, d: [-INF, INF], dt: 'ℝ', c: [k, Infinity], ct: `[${f(k)}; +∞⟩` },
          { t: `2ˣ`, fn: v => 2 ** v, d: [-INF, INF], dt: 'ℝ', c: [-Infinity, Infinity], ct: 'ℝ' },
        ];
        const C = CASOS[s % CASOS.length];
        // Se revisa la función cada 0,5 en el dominio recortado a [−50; 50]. Inyectiva: estrictamente monótona en la muestra.
        // Rango: si en la muestra los valores pasan de ±40, ese lado no tiene tope; si no, el tope es el extremo hallado.
        const x0 = Math.max(C.d[0], -INF), x1 = Math.min(C.d[1], INF);
        const vals = Array.from({ length: 2 * (x1 - x0) + 1 }, (_, i) => C.fn(x0 + i / 2));
        const iny = (vals.every((v, i) => i === 0 || v > vals[i - 1]) || vals.every((v, i) => i === 0 || v < vals[i - 1]));
        const lo = Math.min(...vals), hi = Math.max(...vals);
        const ranLo = lo < -40 ? -Infinity : lo, ranHi = hi > 40 ? Infinity : hi;
        const sobre = ranHi === Infinity && (C.c[0] === -Infinity ? ranLo === -Infinity : Math.abs(ranLo - C.c[0]) < 1e-9);
        const clase3 = iny && sobre ? 'biy' : iny ? 'iny' : sobre ? 'sob' : 'nin';
        const TX = { biy: 'Biyectiva', iny: 'Inyectiva, no sobreyectiva', sob: 'Sobreyectiva, no inyectiva', nin: 'Ni inyectiva ni sobreyectiva' };
        const dosX = !iny ? (C.d[0] === 0 ? null : [1, -1]) : null;
        const motivo = [iny ? 'cada salida viene de una sola x' : `f(${f(dosX[0])}) = f(${f(dosX[1])})`, sobre ? `alcanza todo ${C.ct}` : `no alcanza todo ${C.ct}`];
        return {
          pregunta: [`f(x) = ${C.t}, de ${C.dt} en ${C.ct}. ¿Cómo es f?`],
          opciones: ['biy', 'iny', 'sob', 'nin'].map(id => (id === clase3 ? { id, texto: TX[id], correcta: true }
            : { id, texto: TX[id], error: (id === 'biy' || id === 'iny') !== iny ? 'TAL-INYECTIVA' : 'TAL-CODOMINIO', siFuera: `Revisa las dos cosas: ${motivo[0]}, y ${motivo[1]}.` })),
          solucion: { texto: `Aquí ${motivo[0]}, y ${motivo[1]}.`, ecuacion: [TX[clase3]] },
        };
      },
    },
  };

  // ---------- Idea 4: la inversa deshace ----------
  // Cambia: la pendiente m y el corte b, arrastrando dos puntos de f · Permanece: la recta y = x · Progresa: f, su reflejo f⁻¹ y el par de puntos
  // · Se reserva: f⁻¹(10) frente a 1/f(10) · Debe verse: (a; b) en f se vuelve (b; a) en f⁻¹.
  const inversa = {
    id: 'inversa',
    titulo: 'La inversa deshace',
    temas: ['Función inversa'],
    pieza: 'ejes',
    juega: {
      consigna: 'Mueve m y b en f(x) = mx + b. La curva roja es su reflejo en y = x. Sigue el punto de x = 1.',
      voz: 'Mira qué pasa con las coordenadas del punto al reflejarlo.',
      controles: [
        { id: 'm', etiqueta: 'm', color: 'c-d', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-d', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => {
        const g = u => v.m * u + v.b, gi = u => (u - v.b) / v.m, P = [1, g(1)];
        return { datos: ejesBase(-4, 6, -4, 6, {
          curvas: [{ puntos: [[-4, -4], [6, 6]], color: 'o', discontinua: true }, { puntos: muestra(g, -4, 6, -4, 6), color: 'i' }, { puntos: muestra(gi, -4, 6, -4, 6), color: 'h' }],
          puntos: [{ x: P[0], y: P[1], color: 'i', rotulo: par(...P) }, { x: P[1], y: P[0], color: 'h', rotulo: par(P[1], P[0]) }],
          alt: `f(x) = ${v.m}x + ${v.b}, la recta y = x y su reflejo, la inversa`,
        }), estado: {} };
      },
      lectura: v => [finv, '(', x, ') = ', ...(v.b ? ['(', x, ` ${signo(-v.b)})`] : [x]), `/${f(v.m)}`],
      minimo: 3,
      // Arrastra el corte de f con el eje y (mueve b) o su punto de x = 1 (inclina la recta: mueve m). El reflejo
      // rojo y el punto (m + b; 1) responden solos.
      arrastres: [
        { id: 'corte', etiqueta: 'corte de f con el eje y', color: 'c-d',
          donde: v => { const g = lienzo(-4, 6, -4, 6); return { x: g.X(0), y: g.Y(v.b) }; },
          mover: pt => ({ b: lienzo(-4, 6, -4, 6).aY(pt.y) }) },
        { id: 'pendiente', etiqueta: 'punto de f en x = 1', color: 'c-d',
          donde: v => { const g = lienzo(-4, 6, -4, 6); return { x: g.X(1), y: g.Y(v.m + v.b) }; },
          mover: (pt, v) => ({ m: lienzo(-4, 6, -4, 6).aY(pt.y) - v.b }) },
      ],
    },
    predice: {
      pregunta: ['f(', x, ') = 2', x, ' + 6. ¿Cuánto vale ', finv, '(10)?'],
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'reciproco', texto: '1/26', error: 'AL29', siFuera: '1/26 es 1/f(10). El −1 de f⁻¹ no es un exponente: pide deshacer f.' },
        { id: 'directo', texto: '26', error: 'TAL-INV-DIRECTA', siFuera: '26 es f(10). La inversa busca la x que f lleva a 10.' },
        { id: 'signo', texto: '8', error: 'TAL-INV-SIGNO', siFuera: '8 sería (10 + 6)/2. Para deshacer + 6 se resta 6.' },
      ],
      dibujo: { datos: ejesBase(-2, 11, -2, 11, { curvas: [{ puntos: [[-2, -2], [11, 11]], color: 'o', discontinua: true }, { puntos: muestra(u => 2 * u + 6, -2, 11, -2, 11), color: 'i' }] }), estado: {} },
      revelar: { datos: ejesBase(-2, 11, -2, 11, {
        curvas: [{ puntos: [[-2, -2], [11, 11]], color: 'o', discontinua: true }, { puntos: muestra(u => 2 * u + 6, -2, 11, -2, 11), color: 'i' }, { puntos: muestra(u => (u - 6) / 2, -2, 11, -2, 11), color: 'h' }],
        puntos: [{ x: 2, y: 10, color: 'i', rotulo: '(2; 10)', guias: true }, { x: 10, y: 2, color: 'h', rotulo: '(10; 2)', guias: true }],
      }), estado: {} },
      coincide: 'Coincide: f(2) = 10, así que f⁻¹(10) = 2.',
    },
    mira: {
      datos: ejesBase(-2, 11, -2, 11, {
        curvas: [{ puntos: [[-2, -2], [11, 11]], color: 'o', discontinua: true }, { puntos: muestra(u => 2 * u + 6, -2, 11, -2, 11), color: 'i' }, { puntos: muestra(u => (u - 6) / 2, -2, 11, -2, 11), color: 'h', desde: 3 }],
        puntos: [{ x: 2, y: 10, color: 'i', rotulo: '(2; 10)', guias: true, desde: 2 }, { x: 10, y: 2, color: 'h', rotulo: '(10; 2)', guias: true, desde: 3 }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'f⁻¹(10) es la x que f convierte en 10.', ecuacion: ['2', x, ' + 6 = 10'] },
        { estado: { corte: 2 }, texto: 'Se deshace en orden inverso: resta 6, divide entre 2.', ecuacion: [x, ' = ', { frac: ['10 − 6', '2'] }, ' = 2'] },
        { estado: { corte: 3 }, texto: 'El punto (2; 10) de f se refleja en (10; 2) de f⁻¹.', ecuacion: [finv, '(', x, ') = ', { frac: [[x, ' − 6'], '2'] }] },
        { estado: { corte: 3 }, texto: 'En cambio, 1/f(10) = 1/26: es otro número.', ecuacion: [finv, '(10) = 2  ≠  ', { frac: ['1', 'f(10)'] }] },
      ],
    },
    regla: {
      texto: 'La inversa deshace a f: si f(a) = b, entonces f⁻¹(b) = a. Su gráfica es el reflejo de la de f en la recta y = x.',
      ecuacion: ['f(a) = b  ⇔  ', { llave: [finv], nota: 'deshace f', color: 'c-h' }, '(b) = a'],
      condicion: 'f es biyectiva entre el dominio y el codominio elegidos. f⁻¹ no es 1/f: el −1 no es exponente.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          // x² restringida a x ≥ 0, más k: la inversa es √(x − k).
          const k = r.ent(-3, 4), a = r.ent(1, 5), c = a * a + k;
          return {
            pregunta: [`f(x) = x² ${signo(k)}, con x ≥ 0. ¿Cuánto vale `, finv, `(${f(c)})?`],
            opciones: distintas([
              { id: 'c', texto: f(a), correcta: true },
              { id: 'neg', texto: f(-a), error: 'TAL-INV-RAMA', siFuera: `${f(-a)} también da ${f(c)}, pero el dominio pide x ≥ 0.` },
              { id: 'dir', texto: f(c * c + k), error: 'TAL-INV-DIRECTA', siFuera: `Eso es f(${f(c)}); se pide la x que f lleva a ${f(c)}.` },
              { id: 'rec', texto: `1/${f(c * c + k)}`, error: 'AL29', siFuera: 'Eso es 1/f(…); f⁻¹ deshace a f, no la invierte como fracción.' },
            ]),
            solucion: { texto: `Se busca x ≥ 0 con x² ${signo(k)} = ${f(c)}.`, ecuacion: [x, ` = √(${f(c)} ${signo(-k)}) = ${f(a)}`] },
          };
        }
        const mm = r.uno([2, 3, 4, 5]), bb = r.ent(-6, 8) || 3, a = r.ent(-3, 6), c = mm * a + bb;
        const fc = mm * c + bb;
        return {
          pregunta: [`f(x) = ${f(mm)}x ${signo(bb)}. ¿Cuánto vale `, finv, `(${f(c)})?`],
          opciones: distintas([
            { id: 'c', texto: f(a), correcta: true },
            { id: 'rec', texto: fc ? `1/${f(fc)}` : '0', error: 'AL29', siFuera: `Eso es 1/f(${f(c)}). La inversa busca la x que f lleva a ${f(c)}.` },
            { id: 'dir', texto: f(fc), error: 'TAL-INV-DIRECTA', siFuera: `Eso es f(${f(c)}). Se pide deshacer f.` },
            { id: 'signo', texto: f((c + bb) / mm), error: 'TAL-INV-SIGNO', siFuera: `Para deshacer ${signo(bb)} se hace lo contrario: ${signo(-bb)}.` },
          ]),
          solucion: { texto: `Se deshace en orden inverso: ${signo(-bb)} y luego entre ${f(mm)}.`, ecuacion: [x, ' = ', { frac: [`${f(c)} ${signo(-bb)}`, f(mm)] }, ` = ${f(a)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: el modelo tiene dominio ----------
  // Cambia: el volumen inicial y el caudal (se arrastran el inicio y el punto de vaciado) · Permanece: la forma V(t) = V₀ − rt · Progresa: la recta y su corte con
  // el eje t · Se reserva: los t después de vaciarse · Debe verse: más allá de ese t la fórmula sigue, el tanque no.
  const EJE_TANQUE = { x: { min: 0, max: 30, paso: 5, nombre: 't', unidad: 'min', color: 'o', decimales: 0 }, y: { min: -200, max: 600, paso: 100, cada: 2, nombre: 'V', unidad: 'L', color: 'i', decimales: 0 } };
  // Manijas de un tanque: el punto de partida (0; V₀) a lo alto y el punto de vaciado (V₀/r; 0) a lo ancho.
  const tanqueArrastres = (iv, ir, cv, cr, rot = '') => {
    const g = () => lienzoDe(EJE_TANQUE);
    return [
      { id: `inicio${rot}`, etiqueta: `volumen inicial${rot ? ' de ' + rot : ''}`, color: cv,
        donde: v => ({ x: g().X(0), y: g().Y(v[iv]) }), mover: pt => ({ [iv]: g().aY(pt.y) }) },
      { id: `vacio${rot}`, etiqueta: `instante en que se vacía${rot ? ' ' + rot : ''}`, color: cr,
        donde: v => ({ x: g().X(v[iv] / v[ir]), y: g().Y(0) }), mover: (pt, v) => ({ [ir]: v[iv] / Math.max(0.5, g().aX(pt.x)) }) },
    ];
  };
  const modelacion = {
    id: 'modelacion',
    titulo: 'Un modelo tiene su dominio',
    temas: ['Modelación con funciones'],
    pieza: 'ejes',
    juega: {
      consigna: 'Un tanque se vacía a caudal constante: V(t) = V₀ − rt. Elige V₀ y el caudal r. Mira cuándo llega a 0.',
      voz: 'Creo que la recta sigue bajando aunque el tanque no. Revísalo.',
      controles: [
        { id: 'v0', etiqueta: 'V₀', color: 'c-i', min: 200, max: 600, paso: 100, inicio: 400, unidad: 'L', decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-d', min: 20, max: 80, paso: 20, inicio: 40, unidad: 'L/min', decimales: 0 },
      ],
      dibujo: v => {
        const T = v.v0 / v.r;
        return { datos: {
          ...EJE_TANQUE,
          curvas: [{ puntos: [[0, v.v0], [T, 0]], color: 'i' }, { puntos: [[T, 0], [Math.min(30, (v.v0 + 200) / v.r), Math.max(-200, v.v0 - 30 * v.r)]], color: 'h', discontinua: true }],
          puntos: [{ x: T, y: 0, color: 'd', rotulo: `${f(T)} min` }],
        }, estado: {} };
      },
      lectura: v => [`Se vacía en t = ${f(v.v0 / v.r)} min`],
      minimo: 3,
      // Arrastra el punto de partida (V₀) o el punto donde se vacía (su t fija el caudal r = V₀/t).
      arrastres: tanqueArrastres('v0', 'r', 'c-i', 'c-d'),
    },
    predice: {
      pregunta: ['Un tanque de 600 L pierde 40 L por minuto: V(', x, ') = 600 − 40', x, ', con ', x, ' en minutos. ¿Qué valores de ', x, ' tienen sentido?'],
      opciones: [
        { id: 'c', texto: '[0; 15]', correcta: true },
        { id: 'infinito', texto: '[0; +∞⟩', error: 'TAL-MODELO-DOMINIO', siFuera: 'La fórmula acepta x = 20, pero da −200 L: un volumen negativo no existe.' },
        { id: 'todo', texto: 'ℝ', error: 'TAL-MODELO-DOMINIO', siFuera: 'Antes de abrir la llave (x < 0) el modelo no describe nada.' },
        { id: 'litros', texto: '[0; 600]', error: 'TAL-MODELO-RANGO', siFuera: '[0; 600] son los litros, el rango. El dominio son los minutos.' },
      ],
      dibujo: { datos: { x: { min: 0, max: 25, paso: 5, nombre: 'x', unidad: 'min', color: 'o', decimales: 0 }, y: { min: -400, max: 600, paso: 200, cada: 1, nombre: 'V', unidad: 'L', color: 'i', decimales: 0 }, puntos: [{ x: 0, y: 600, color: 'i' }] }, estado: {} },
      revelar: { datos: {
        x: { min: 0, max: 25, paso: 5, nombre: 'x', unidad: 'min', color: 'o', decimales: 0 }, y: { min: -400, max: 600, paso: 200, cada: 1, nombre: 'V', unidad: 'L', color: 'i', decimales: 0 },
        curvas: [{ puntos: [[0, 600], [15, 0]], color: 'i' }, { puntos: [[15, 0], [25, -400]], color: 'h', discontinua: true, rotulo: 'sin sentido' }],
        puntos: [{ x: 0, y: 600, color: 'i' }, { x: 15, y: 0, color: 'd', rotulo: '15 min' }],
      }, estado: {} },
      coincide: 'Coincide: 600 entre 40 son 15 minutos; después la fórmula da litros negativos.',
    },
    mira: {
      datos: {
        x: { min: 0, max: 25, paso: 5, nombre: 'x', unidad: 'min', color: 'o', decimales: 0 }, y: { min: -400, max: 600, paso: 200, cada: 1, nombre: 'V', unidad: 'L', color: 'i', decimales: 0 },
        curvas: [{ puntos: [[0, 600], [15, 0]], color: 'i', desde: 2 }, { puntos: [[15, 0], [25, -400]], color: 'h', discontinua: true, desde: 4 }],
        puntos: [{ x: 0, y: 600, color: 'i', desde: 1 }, { x: 15, y: 0, color: 'd', rotulo: '15 min', desde: 3 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Al inicio, x = 0, hay 600 L.', ecuacion: ['V(0) = 600'] },
        { estado: { corte: 2 }, texto: 'Cada minuto se van 40 L: la recta baja 40 por minuto.', ecuacion: ['V(', x, ') = 600 − 40', x] },
        { estado: { corte: 3 }, texto: 'Se vacía cuando V = 0.', ecuacion: ['600 − 40', x, ' = 0  ⇒  ', x, ' = 15'] },
        { estado: { corte: 4 }, texto: 'Después de 15 min la fórmula da negativos: ya no describe el tanque.', ecuacion: ['V(20) = −200  ✗'] },
      ],
    },
    regla: {
      texto: 'Modelar es elegir la variable, la fórmula y el dominio que tiene sentido en la situación. Fuera de ese dominio la fórmula da números, pero no describen nada.',
      ecuacion: ['V(', x, ') = ', { llave: [{ sub: ['V', '0'] }], nota: 'al inicio', color: 'c-i' }, ' − r', x, '   ·   ', '0 ≤ ', x, ' ≤ ', { llave: [{ frac: [{ sub: ['V', '0'] }, 'r'] }], nota: 'se vacía', color: 'c-d' }],
      condicion: 'el modelo supone un cambio constante en todo el dominio; no se extrapola sin revisar la situación.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const rr = r.uno([15, 20, 25, 30, 40, 50]), T = r.ent(6, 20), V0 = rr * T, t = r.ent(2, T - 2), V = V0 - rr * t;
          const pideT = s % 4 === 0;
          if (pideT) {
            return {
              pregunta: [`Un tanque de ${f(V0)} L pierde ${f(rr)} L por minuto. ¿En cuántos minutos quedan ${f(V)} L?`],
              opciones: distintas([
                { id: 'c', texto: `${f(t)} min`, correcta: true },
                { id: 'quedan', texto: `${f(V / rr)} min`, error: 'TAL-MODELO-PLANTEO', siFuera: `Eso es lo que falta para vaciarse; se pide cuánto pasó.` },
                { id: 'vacio', texto: `${f(T)} min`, error: 'TAL-MODELO-PLANTEO', siFuera: `En ${f(T)} min el tanque queda vacío, no con ${f(V)} L.` },
                { id: 'div', texto: `${f(V0 / V)} min`, error: 'TAL-MODELO-DIV', siFuera: 'Eso divide litros entre litros; el tiempo sale de lo perdido entre el caudal.' },
              ]),
              solucion: { texto: `Se perdieron ${f(V0 - V)} L a ${f(rr)} L por minuto.`, ecuacion: [`${f(V0)} − ${f(rr)}t = ${f(V)}  ⇒  t = ${f(t)}`] },
            };
          }
          return {
            pregunta: [`V(t) = ${f(V0)} − ${f(rr)}t litros, con t en minutos, describe un tanque que se vacía. ¿Cuál es el dominio con sentido?`],
            opciones: distintas([
              { id: 'c', texto: `[0; ${f(T)}]`, correcta: true },
              { id: 'inf', texto: '[0; +∞⟩', error: 'TAL-MODELO-DOMINIO', siFuera: `Después de ${f(T)} min la fórmula da litros negativos.` },
              { id: 'rango', texto: `[0; ${f(V0)}]`, error: 'TAL-MODELO-RANGO', siFuera: 'Esos son los litros posibles, el rango. El dominio son minutos.' },
              { id: 'caudal', texto: `[0; ${f(rr)}]`, error: 'TAL-MODELO-PLANTEO', siFuera: `${f(rr)} es el caudal; el tiempo final sale de ${f(V0)} entre ${f(rr)}.` },
            ]),
            solucion: { texto: 'Empieza en t = 0 y termina cuando el tanque se vacía.', ecuacion: [`${f(V0)} − ${f(rr)}t = 0  ⇒  t = ${f(T)}`] },
          };
        }
        const base = r.uno([3, 4, 5]), tar = r.uno([1.5, 2, 2.5]), d = r.ent(3, 12);
        const bien = base + tar * d;
        return {
          pregunta: [`Una mototaxi cobra S/ ${f(base)} al subir y S/ ${f(tar)} por km. Con C(d) = ${f(base)} + ${f(tar)}d, ¿cuánto cuesta un viaje de ${f(d)} km?`],
          opciones: distintas([
            { id: 'c', texto: `S/ ${f(bien)}`, correcta: true },
            { id: 'sin-base', texto: `S/ ${f(tar * d)}`, error: 'TAL-MODELO-BASE', siFuera: 'Eso olvida lo que se cobra al subir, que va aunque d = 0.' },
            { id: 'todo', texto: `S/ ${f((base + tar) * d)}`, error: 'TAL-MODELO-BASE', siFuera: 'Eso cobra el monto de subida en cada km; se cobra una sola vez.' },
            { id: 'suma', texto: `S/ ${f(base + tar + d)}`, error: 'TAL-MODELO-PLANTEO', siFuera: 'Eso suma los datos; cada km agrega la tarifa.' },
          ]),
          solucion: { texto: 'El monto fijo una vez y la tarifa por cada km.', ecuacion: [`C(${f(d)}) = ${f(base)} + ${f(tar)} · ${f(d)} = ${f(bien)}`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: el espejo en y = x con curvas que no son inyectivas y un dominio que se puede recortar (lo que la idea 4
  // deja fuera: el reflejo de x² en ℝ no es función; en [0; +∞⟩, sí).
  const ESPEJO = { 'x³ / 4': u => u ** 3 / 4, 'x²': u => u * u, '2ˣ': u => 2 ** u, '|x| − 1': u => Math.abs(u) - 1, 'x/2 + 1': u => u / 2 + 1 };
  const DOMS = { 'ℝ': -4, 'x ≥ 0': 0 };
  const inyectivaEn = (fn, x0) => { const v = Array.from({ length: 81 }, (_, i) => fn(x0 + (4 - x0) * i / 80)); return v.every((z, i) => !i || z > v[i - 1]) || v.every((z, i) => !i || z < v[i - 1]); };
  const mesaEspejo = {
    id: 'espejo', titulo: 'El reflejo en y = x', pieza: 'ejes',
    consigna: 'Elige f y su dominio. Arrastra el punto turquesa por f: su reflejo rojo cambia x por y. ¿El reflejo es una función?',
    controles: [
      { id: 'fn', etiqueta: 'f(x)', opciones: Object.keys(ESPEJO).map(t => ({ valor: t, texto: t })), inicio: 'x²' },
      { id: 'dom', etiqueta: 'Dominio', opciones: Object.keys(DOMS).map(t => ({ valor: t, texto: t })) },
      { id: 'a', etiqueta: 'x del punto', color: 'c-o', min: -2, max: 2, paso: 0.5, inicio: 1.5, decimales: 1 },
    ],
    dibujo: v => {
      const g = ESPEJO[v.fn], x0 = DOMS[v.dom], a = Math.max(v.a, x0), P = [a, g(a)];
      const tramo = muestra(g, x0, 4, -4, 4), refl = tramo.map(p => (p ? [p[1], p[0]] : null));
      return { datos: ejesBase(-4, 4, -4, 4, {
        curvas: [{ puntos: [[-4, -4], [4, 4]], color: 'o', discontinua: true }, { puntos: tramo, color: 'i' }, { puntos: refl, color: 'h' }],
        // Sin rótulos en los puntos: la lectura da las dos coordenadas y los rótulos se tapaban entre sí.
        puntos: [{ x: P[0], y: P[1], color: 'i', guias: true }, { x: P[1], y: P[0], color: 'h', guias: true }],
        alt: `f(x) = ${v.fn} con dominio ${v.dom}, su reflejo en y = x y el punto ${par(...P)} reflejado en ${par(P[1], P[0])}`,
      }), estado: {} };
    },
    lectura: v => {
      const g = ESPEJO[v.fn], a = Math.max(v.a, DOMS[v.dom]);
      return [`${par(a, g(a))} → ${par(g(a), a)} · el reflejo ${inyectivaEn(g, DOMS[v.dom]) ? 'es' : 'no es'} función`];
    },
    arrastres: [{ id: 'punto', etiqueta: 'punto de f', color: 'c-o',
      donde: v => { const g = lienzo(-4, 4, -4, 4), a = Math.max(v.a, DOMS[v.dom]), yy = ESPEJO[v.fn](a); return { x: g.X(a), y: g.Y(Math.max(-4, Math.min(4, yy))) }; },
      mover: pt => ({ a: lienzo(-4, 4, -4, 4).aX(pt.x) }) }],
  };
  // Mesa 2: la recta horizontal con el dominio que se recorta y más funciones (x³ − 3x sube, baja y vuelve a subir).
  const FUNS2 = Object.assign({}, FUNS, { 'x³ − 3x': u => u ** 3 - 3 * u });
  const mesaRecta = {
    id: 'recta-horizontal', titulo: 'Recta horizontal y dominio', pieza: 'ejes',
    consigna: 'Arrastra la recta y = c y recorta el dominio. Busca una altura que toque dos veces y mira si el recorte la arregla.',
    controles: [
      { id: 'fn', etiqueta: 'f(x)', opciones: Object.keys(FUNS2).map(t => ({ valor: t, texto: t })), inicio: 'x²' },
      { id: 'dom', etiqueta: 'Dominio', opciones: Object.keys(DOMS).map(t => ({ valor: t, texto: t })) },
      { id: 'c', etiqueta: 'c', color: 'c-h', min: -3, max: 5, paso: 0.5, inicio: 2, decimales: 1 },
    ],
    dibujo: v => {
      const g = FUNS2[v.fn], x0 = DOMS[v.dom], cs = cortes(g, v.c, x0, 4);
      return { datos: ejesBase(-4, 4, -4, 6, {
        curvas: [...(x0 > -4 ? [{ puntos: muestra(g, -4, x0, -4, 6), color: 'o', discontinua: true }] : []), { puntos: muestra(g, x0, 4, -4, 6), color: 'i' }, { puntos: [[-4, v.c], [4, v.c]], color: 'h', discontinua: true }],
        puntos: cs.map(z => ({ x: z, y: v.c, color: 'h' })),
      }), estado: {} };
    },
    lectura: v => {
      const n = cortes(FUNS2[v.fn], v.c, DOMS[v.dom], 4).length;
      return [`y = ${f(v.c, 1)}: ${n} ${n === 1 ? 'corte' : 'cortes'} · en ${v.dom} ${inyectivaEn(FUNS2[v.fn], DOMS[v.dom]) ? 'es' : 'no es'} inyectiva`];
    },
    arrastres: [{ id: 'recta', etiqueta: 'recta horizontal y = c', color: 'c-h',
      donde: v => { const g = lienzo(-4, 4, -4, 6); return { x: g.X(3.5), y: g.Y(v.c) }; },
      mover: pt => ({ c: lienzo(-4, 4, -4, 6).aY(pt.y) }) }],
  };
  // Mesa 3: dos tanques juntos, para comparar cuál se vacía antes (dos modelos con su dominio).
  const mesaTanques = {
    id: 'dos-tanques', titulo: 'Dos tanques que se vacían', pieza: 'ejes',
    consigna: 'Arrastra el inicio y el punto de vaciado de cada tanque. ¿Cuál se vacía antes? ¿Cuándo tienen lo mismo?',
    controles: [
      { id: 'v0', etiqueta: 'V₀ de A', color: 'c-i', min: 200, max: 600, paso: 100, inicio: 600, unidad: 'L', decimales: 0 },
      { id: 'r', etiqueta: 'r de A', color: 'c-i', min: 20, max: 80, paso: 10, inicio: 40, unidad: 'L/min', decimales: 0 },
      { id: 'v0b', etiqueta: 'V₀ de B', color: 'c-f', min: 200, max: 600, paso: 100, inicio: 300, unidad: 'L', decimales: 0 },
      { id: 'rb', etiqueta: 'r de B', color: 'c-f', min: 20, max: 80, paso: 10, inicio: 20, unidad: 'L/min', decimales: 0 },
    ],
    dibujo: v => {
      const TA = v.v0 / v.r, TB = v.v0b / v.rb;
      const tc = v.r !== v.rb ? (v.v0 - v.v0b) / (v.r - v.rb) : -1;
      const igual = tc > 0 && tc < Math.min(TA, TB) ? [{ x: tc, y: v.v0 - v.r * tc, color: 'o', guias: true, rotulo: `${f(tc)} min` }] : [];
      return { datos: {
        ...EJE_TANQUE,
        curvas: [{ puntos: [[0, v.v0], [TA, 0]], color: 'i', rotulo: 'A', en: [TA / 2, v.v0 / 2] }, { puntos: [[0, v.v0b], [TB, 0]], color: 'f', rotulo: 'B', en: [TB / 2, v.v0b / 2] }],
        puntos: [{ x: TA, y: 0, color: 'i' }, { x: TB, y: 0, color: 'f' }, ...igual],
        alt: `Tanque A: ${f(v.v0)} L a ${f(v.r)} L/min; tanque B: ${f(v.v0b)} L a ${f(v.rb)} L/min`,
      }, estado: {} };
    },
    lectura: v => [`A se vacía en ${f(v.v0 / v.r)} min · B en ${f(v.v0b / v.rb)} min`],
    arrastres: [...tanqueArrastres('v0', 'r', 'c-i', 'c-i', 'A'), ...tanqueArrastres('v0b', 'rb', 'c-f', 'c-f', 'B')],
  };

  return {
    unidad: 'algebra.tipos-de-funciones-e-inversa',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js'],
    // Laboratorio: tres mesas propias con gesto directo; todas suman el dominio como control (o un segundo modelo).
    laboratorio: [mesaEspejo, mesaRecta, mesaTanques],
    historia: {
      texto: 'Al ampliarse la idea de función, se separó la relación entre variables de la fórmula que la describe. Las discusiones sobre qué dependencias admitir mostraron que una misma apariencia algebraica no basta: importan el dominio y las salidas. Para invertir una relación hace falta que cada salida identifique a su entrada. La inversa no sale de cambiar un símbolo ni de tomar el recíproco.',
      pregunta: '¿Se puede deshacer toda correspondencia?',
      fuente: { titulo: 'O’Connor y Robertson, The function concept — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Functions/' },
    },
    ideas: [paridad, monotona, inyectiva, inversa, modelacion],
  };
});
