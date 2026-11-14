/*
 * Teoría de «Binomio de Newton» (algebra.binomio-de-newton). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 19), expediente teoria-152-unidades (Álgebra) e
 * historia-ecuaciones (pp. 57–68). Errores: BN2, BN3, BN4, BN10 y BN19 de plantillas/binomio-newton (hipótesis);
 * los TAL-* son hipótesis de diseño (rutinas/teoria-algebra.md).
 * Colores (regla 4): a y el exponente de a naranja (c-o), b, k y lo que aporta b turquesa (c-i), el coeficiente o lo
 * que se busca verde (c-d), el error o lo que se aleja rojo (c-h).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · leer cada coeficiente del binomio como un conteo de elecciones y hallar cualquier término sin desarrollar.
 * Persona y condiciones · 5.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · halla un coeficiente, el término k + 1, el término independiente y un coeficiente multinomial;
 *   distingue el desarrollo finito de la serie con exponente no natural.
 * Orden de atención · 1.º la figura (triángulo, tabla de elecciones, gráfica) · 2.º la fila o término marcado · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué el término de lugar k + 1 lleva bᵏ y cuándo un desarrollo deja de ser finito.
 * Gesto (ronda 2) · se arrastra la fila de abajo del triángulo (cambia n), la fila marcada de la tabla de términos
 *   (cambia k) y el punto de la curva exacta (cambia x). La idea 4 queda con controles: es una tabla de números sin
 *   objeto que agarrar. Laboratorio: el triángulo hasta la fila 8 con pares e impares coloreados, el término general de
 *   (xᵖ + c/x^q)⁶ con p, q y c libres, y la serie con α natural, fraccionario o negativo.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const a = { v: 'c-o', t: 'a' }, b = { v: 'c-i', t: 'b' }, k = { v: 'c-i', t: 'k' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function distintas(ops, max = 4) {
    const vistos = new Set(), out = [];
    for (const o of ops) { if (!o) continue; const t = JSON.stringify(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out.slice(0, max);
  }
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const sup = e => String(e).split('').map(c => SUP[c] || c).join('');
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
  const C = (n, j) => (j < 0 || j > n ? 0 : fact(n) / (fact(j) * fact(n - j)));
  const fila = n => Array.from({ length: n + 1 }, (_, j) => C(n, j));
  const pot = (v, e) => (e === 0 ? '' : e === 1 ? v : `${v}${sup(e)}`);
  const lugar = j => `${j}.º`;
  // Gesto directo (docs/teoria.md §4b): en «alg-tabla» la fila f está en geometria(d).cy(f), y la fila 0 no se mueve
  // al agregar filas (y0 fijo), así que arrastrar en vertical elige la fila: f = (y − cy(0)) / alto de fila.
  const TABLA = () => Kit.piezas['alg-tabla'], EJES = () => Kit.piezas.ejes;
  const filaDe = (datos, y) => { const g = TABLA().geometria(datos); return (y - g.cy(0)) / (g.cy(1) - g.cy(0)); };
  const inversa = (escala, a0, b0) => px => a0 + (px - escala(a0)) * (b0 - a0) / (escala(b0) - escala(a0));
  // Fracciones exactas para los coeficientes generalizados.
  const mcd = (x, y) => { x = Math.abs(x); y = Math.abs(y); while (y) [x, y] = [y, x % y]; return x || 1; };
  const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = mcd(n, d); return [n / g, d / g]; };
  const frTxt = ([n, d]) => (d === 1 ? f(n, 0) : `${n < 0 ? '−' : ''}${Math.abs(n)}/${d}`);
  const frPartes = ([n, d]) => (d === 1 ? f(n, 0) : [n < 0 ? '−' : '', { frac: [String(Math.abs(n)), String(d)] }]);
  // Coeficiente generalizado de xʲ en (1 + x)^(p/q): α(α − 1)…(α − j + 1)/j!.
  function coefGen(p, q, j) {
    let num = 1, den = 1;
    for (let i = 0; i < j; i++) { num *= p - i * q; den *= q; }
    return fr(num, den * fact(j));
  }

  // ---------- Idea 1: cada coeficiente cuenta elecciones ----------
  // Cambia: el exponente n · Permanece: el triángulo, fila por fila · Progresa: la fila nueva, suma de la de arriba
  // · Se reserva: la fila 7, que el juego no muestra · Debe verse: el coeficiente cuenta en cuántos órdenes sale bᵏ.
  // Se agarra: la fila verde, por su borde derecho; bajarla agrega filas. «Mira» pasa a la tabla de elecciones de
  // (a + b)³: es otra representación a propósito (de dónde sale cada número), y termina en la fila 3 que se jugó.
  const triangulo = (n, extra = {}) => ({
    triangular: true,
    filas: Array.from({ length: n + 1 }, (_, i) => fila(i).map(c => ({ t: f(c, 0), color: i === n ? 'd' : null, fuerte: i === n }))),
    alt: `Triángulo de Pascal hasta la fila ${n}: ${fila(n).join(', ')}`,
    ...extra,
  });
  // Manija al final de la fila f de un triángulo: arrastrarla en vertical cambia el control que fija la fila.
  function filaManija(datosDe, id, etiqueta, color) {
    return {
      id: `fila-${id}`, etiqueta, color,
      donde: v => { const d = datosDe(v[id]), g = TABLA().geometria(d); return { x: Math.min(306, g.cx(v[id], v[id]) + g.paso * 0.75), y: g.cy(v[id]) }; },
      mover: (pt, v) => ({ [id]: filaDe(datosDe(v[id]), pt.y) }),
    };
  }
  const pascal = {
    id: 'pascal-elecciones',
    titulo: 'Cada coeficiente cuenta elecciones',
    temas: ['Desarrollo del binomio'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Elige el exponente n. La fila verde da los coeficientes de (a + b)ⁿ; cada número suma los dos de arriba.',
      voz: 'Suma los números de cada fila.',
      controles: [{ id: 'n', etiqueta: 'n', min: 0, max: 5, paso: 1, inicio: 2, decimales: 0, color: 'c-d' }],
      dibujo: v => ({ datos: triangulo(v.n), estado: {} }),
      lectura: v => [`(a + b)${sup(v.n)}: ${fila(v.n).join(', ')}; suman ${2 ** v.n}`],
      minimo: 3,
      arrastres: [filaManija(triangulo, 'n', 'fila n: bájala para agregar filas', 'c-d')],
    },
    predice: {
      pregunta: ['En (', a, ' + ', b, ')⁷, ¿qué coeficiente acompaña a ', a, '⁵', b, '²?'],
      opciones: [
        { id: 'c', texto: f(C(7, 2), 0), correcta: true },
        { id: 'n', texto: '7', error: 'BN3', siFuera: '7 sería cierto si b² saliera de un solo par de paréntesis; puede salir de muchos.' },
        { id: 'doble', texto: '14', error: 'TAL-BN-POR', siFuera: '14 es 7 · 2. Se cuentan las formas de elegir 2 paréntesis entre 7.' },
        { id: 'desfase', texto: f(C(7, 3), 0), error: 'BN2', siFuera: `${C(7, 3)} acompaña a a⁴b³: corre un lugar el exponente de b.` },
      ],
      dibujo: { datos: triangulo(5), estado: {} },
      revelar: { datos: triangulo(7, { resaltes: [{ f: 7, c: 2, color: 'd' }] }), estado: {} },
      coincide: `Coincide: en la fila 7, el lugar de b² vale ${C(7, 2)}.`,
    },
    mira: {
      datos: (() => {
        const filas = [], marca = [];
        for (let m = 0; m < 8; m++) {
          const el = [0, 1, 2].map(i => ((m >> (2 - i)) & 1 ? 'b' : 'a'));
          const nb = el.filter(c => c === 'b').length;
          filas.push({ el, nb });
        }
        filas.sort((x, y) => x.nb - y.nb);
        const nombre = ['a³', 'a²b', 'ab²', 'b³'];
        filas.forEach((x, i) => marca.push({ f: i, c: 0, ancho: 4, color: x.nb === 1 ? 'i' : x.nb === 2 ? 'd' : null, desde: x.nb + 1 }));
        return {
          columnas: ['1.er', '2.º', '3.er', 'término'],
          filas: filas.map(x => [...x.el.map(c => ({ t: c, color: c === 'a' ? 'o' : 'i', fuerte: true, desde: x.nb + 1 })), { t: nombre[x.nb], desde: x.nb + 1, fuerte: true }]),
          resaltes: marca.filter(m2 => m2.color), alt: 'Las ocho elecciones de (a + b)³: una da a³, tres dan a²b, tres dan ab² y una da b³',
        };
      })(),
      voz: 'Creo que cada término es una elección. Contemos las elecciones.',
      pasos: [
        { estado: { corte: 1 }, texto: 'De cada paréntesis sale a o b. Con a en los tres: a³.', ecuacion: ['(a + b)(a + b)(a + b)'] },
        { estado: { corte: 2 }, texto: 'Una sola b puede salir de tres paréntesis distintos: 3a²b.', ecuacion: ['C(3, 1) = 3'] },
        { estado: { corte: 3 }, texto: 'Dos b también salen de tres maneras: 3ab².', ecuacion: ['C(3, 2) = 3'] },
        { estado: { corte: 4 }, texto: 'Y b en los tres, de una manera. Son 2³ = 8 elecciones.', ecuacion: ['(a + b)³ = a³ + 3a²b + 3ab² + b³'] },
      ],
    },
    regla: {
      texto: 'Cada término elige a o b en cada paréntesis. El coeficiente de aⁿ⁻ᵏbᵏ cuenta de cuántas maneras se eligen los k paréntesis que dan b.',
      ecuacion: ['(', a, ' + ', b, ')ⁿ = Σ ', { llave: ['C(n, ', k, ')'], nota: 'formas de elegir', color: 'c-d' }, ' ', { sup: [a, ['n − ', k]] }, ' ', { sup: [b, k] }],
      condicion: 'n es entero no negativo; hay n + 1 términos y los coeficientes de la fila n suman 2ⁿ.',
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s), n = r.ent(4, 8), j = r.ent(2, n - 2);
        if (s % 2 === 0) {
          const bien = C(n, j);
          return {
            pregunta: ['En (', a, ' + ', b, `)${sup(n)}, ¿qué coeficiente acompaña a `, pot('a', n - j), pot('b', j), '?'],
            opciones: distintas([{ id: 'c', texto: f(bien, 0), correcta: true },
              { id: 'n', texto: f(n, 0), error: 'BN3', siFuera: `${n} es el exponente; el coeficiente cuenta elecciones de ${j} paréntesis.` },
              { id: 'des', texto: f(C(n, j + 1), 0), error: 'BN2', siFuera: `${C(n, j + 1)} es el siguiente número de la fila: corre un lugar.` },
              { id: 'por', texto: f(n * j, 0), error: 'TAL-BN-POR', siFuera: `${n * j} es ${n} · ${j}; se cuentan elecciones, no se multiplica.` }]),
            solucion: { texto: `Se cuentan las formas de elegir ${j} paréntesis entre ${n}.`, ecuacion: [`C(${n}, ${j}) = ${bien}`], dibujo: { datos: triangulo(Math.min(n, 8), { resaltes: [{ f: n, c: j, color: 'd' }] }), estado: {} } },
          };
        }
        const c = r.uno([2, 3]), bien = C(n, j) * c ** j;
        return {
          pregunta: `En (x + ${c})${sup(n)}, ¿qué coeficiente acompaña a ${pot('x', n - j)}?`,
          opciones: distintas([{ id: 'c', texto: f(bien, 0), correcta: true },
            { id: 'sin', texto: f(C(n, j), 0), error: 'BN4', siFuera: `Falta elevar el ${c}: sale de ${j} paréntesis, así que va ${c}${sup(j)}.` },
            { id: 'una', texto: f(C(n, j) * c, 0), error: 'BN4', siFuera: `El ${c} sale de ${j} paréntesis: se multiplica ${j} veces.` },
            { id: 'des', texto: f(C(n, j + 1) * c ** (j + 1), 0), error: 'BN2', siFuera: 'Ese corresponde a una potencia de x menor: corre un lugar.' }]),
          solucion: { texto: `Para x${sup(n - j)}, el número ${c} sale de ${j} paréntesis.`, ecuacion: [`C(${n}, ${j}) · ${c}${sup(j)} = ${C(n, j)} · ${c ** j} = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 2: el término k + 1 lleva bᵏ ----------
  // Cambia: k · Permanece: el binomio (x + 2)⁶ y su tabla de términos · Progresa: la fila marcada · Se reserva:
  // el exponente de x que se anula · Debe verse: el lugar es k + 1, no k.
  // Se agarra: la fila marcada, por su borde derecho; subirla o bajarla cambia k y el lugar a la vez.
  const tablaTerminos = (kk, desde = {}) => ({
    columnas: ['lugar', 'k', 'C(6, k)', 'xⁿ⁻ᵏ', '2ᵏ', 'coeficiente'], colorCol: [null, 'i', null, 'o', 'i', 'd'],
    filas: [0, 1, 2, 3, 4, 5, 6].map(j => [lugar(j + 1), String(j), f(C(6, j), 0), pot('x', 6 - j) || '1', f(2 ** j, 0), { t: f(C(6, j) * 2 ** j, 0), color: 'd', fuerte: j === kk }]),
    resaltes: kk === null ? [] : [{ f: kk, c: 0, ancho: 6, color: 'i' }],
    alt: 'Los siete términos de (x + 2)⁶: el de lugar k + 1 lleva 2 elevado a k',
    ...desde,
  });
  const general = {
    id: 'termino-general',
    titulo: 'El término k + 1 lleva bᵏ',
    temas: ['Término general'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'En (x + 2)⁶, elige k. La fila marcada es el término que lleva 2 elevado a k. Mira qué lugar ocupa.',
      voz: 'Compara el lugar con k.',
      controles: [{ id: 'k', etiqueta: 'k', min: 0, max: 6, paso: 1, inicio: 2, decimales: 0, color: 'c-i' }],
      dibujo: v => ({ datos: tablaTerminos(v.k), estado: {} }),
      arrastres: [{
        id: 'fila-k', etiqueta: 'fila marcada: súbela o bájala', color: 'c-i',
        donde: v => { const g = TABLA().geometria(tablaTerminos(v.k)); return { x: g.xs[g.nc] - 4, y: g.cy(v.k) }; },
        mover: (pt, v) => ({ k: filaDe(tablaTerminos(v.k), pt.y) }),
      }],
      lectura: v => [`k = ${v.k}: lugar ${lugar(v.k + 1)}, ${f(C(6, v.k) * 2 ** v.k, 0)}${pot('x', 6 - v.k)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['En (x² + ', { frac: ['1', 'x'] }, ')⁶, ¿qué lugar ocupa el término independiente, el que no lleva x?'],
      opciones: [
        { id: 'c', texto: '5.º', correcta: true },
        { id: 'k', texto: '4.º', error: 'BN2', siFuera: '4 es el valor de k; el lugar es k + 1. El 4.º es el central.' },
        { id: 'ultimo', texto: '7.º', error: 'TAL-BN-ULTIMO', siFuera: 'El último es (1/x)⁶ = x⁻⁶: todavía lleva x.' },
        { id: 'no', texto: 'No tiene', error: 'TAL-BN-SIN', siFuera: 'Sí tiene: el exponente 12 − 3k vale 0 con k = 4.' },
      ],
      dibujo: { datos: { columnas: ['lugar', 'k', 'exponente de x'], filas: [0, 1, 2, 3, 4, 5, 6].map(j => [lugar(j + 1), String(j), '?']), alt: 'Siete términos con su exponente de x por calcular' }, estado: {} },
      revelar: { datos: { columnas: ['lugar', 'k', 'exponente de x'], filas: [0, 1, 2, 3, 4, 5, 6].map(j => [lugar(j + 1), String(j), { t: f(12 - 3 * j, 0), color: 12 - 3 * j === 0 ? 'd' : null, fuerte: 12 - 3 * j === 0 }]), resaltes: [{ f: 4, c: 0, ancho: 3, color: 'd' }], alt: 'El exponente de x es 12 − 3k; vale 0 en k = 4, el 5.º término' }, estado: {} },
      coincide: 'Coincide: con k = 4, x² aporta x⁴ y (1/x)⁴ lo cancela.',
    },
    mira: {
      datos: {
        columnas: ['lugar', 'k', 'exponente de x', 'C(6, k)'], colorCol: [null, 'i', 'o', 'd'],
        filas: [0, 1, 2, 3, 4, 5, 6].map(j => [lugar(j + 1), String(j), { t: f(12 - 3 * j, 0), desde: 2, color: 12 - 3 * j === 0 ? 'd' : null, fuerte: 12 - 3 * j === 0 }, { t: f(C(6, j), 0), desde: j === 4 ? 4 : 99 }]),
        resaltes: [{ f: 4, c: 0, ancho: 4, color: 'd', desde: 3 }],
        alt: 'El exponente de x en cada término de (x² + 1/x)⁶ es 12 − 3k',
      },
      voz: 'Creo que conviene escribir el exponente de x en función de k.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El término k + 1 toma k veces 1/x y 6 − k veces x².', ecuacion: ['T', { sub: ['', 'k+1'] }, ' = C(6, k) (x²)', sup('6−k'), ' (1/x)', { sup: ['', 'k'] }] },
        { estado: { corte: 2 }, texto: 'Exponente de x: 2(6 − k) − k = 12 − 3k.', ecuacion: ['12 − 3k'] },
        { estado: { corte: 3 }, texto: 'Sin x significa exponente 0: k = 4, el 5.º término.', ecuacion: ['12 − 3k = 0  →  k = 4'] },
        { estado: { corte: 4 }, texto: 'Su valor es el combinatorio, porque las potencias se cancelan.', ecuacion: [`T₅ = C(6, 4) = ${C(6, 4)}`] },
      ],
    },
    regla: {
      texto: 'El término de lugar k + 1 lleva b elevado a k. Para el término independiente se iguala a cero el exponente total de x.',
      ecuacion: [{ llave: ['T', { sub: ['', [k, ' + 1']] }], nota: 'lugar k + 1', color: 'c-i' }, ' = C(n, ', k, ') ', { sup: [a, ['n − ', k]] }, ' ', { llave: [{ sup: [b, k] }], nota: 'k veces b', color: 'c-i' }],
      condicion: 'k es entero entre 0 y n; si la ecuación del exponente no da un k así, no hay término independiente.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const n = r.ent(5, 8), t = r.ent(2, n), j = t - 1, c = r.uno([1, 2, 3]);
          const coef = j2 => C(n, j2) * c ** j2, mon = j2 => `${coef(j2) === 1 && n - j2 > 0 ? '' : f(coef(j2), 0)}${pot('x', n - j2)}`;
          return {
            pregunta: `En (x + ${c})${sup(n)}, ¿cuál es el término de lugar ${lugar(t)}?`,
            opciones: distintas([{ id: 'c', texto: mon(j), correcta: true },
              { id: 'k', texto: mon(t), error: 'BN10', siFuera: `Ese usa k = ${t}; el lugar ${lugar(t)} tiene k = ${j}.` },
              c > 1 && { id: 'sin', texto: `${f(C(n, j), 0)}${pot('x', n - j)}`, error: 'BN4', siFuera: `Falta elevar el ${c}: va ${c}${sup(j)}.` },
              { id: 'atras', texto: mon(j - 1), error: 'BN2', siFuera: 'Ese es el término anterior: corre un lugar.' },
              { id: 'exp', texto: `${f(coef(j), 0)}${pot('x', j)}`, error: 'TAL-BN-EXP', siFuera: `x lleva n − k = ${n - j}, no k = ${j}.` }]),
            solucion: { texto: `Lugar ${lugar(t)}: k = ${j}.`, ecuacion: [`C(${n}, ${j})${c === 1 ? '' : ` · ${c}${sup(j)}`} · ${pot('x', n - j) || '1'} = ${mon(j)}`] },
          };
        }
        // (xᵖ + 1/x^q)ⁿ: exponente p(n − k) − qk = 0 con k entero.
        let p, q, n, j;
        do { p = r.ent(1, 3); q = r.ent(1, 3); n = r.ent(3, 9); j = p * n / (p + q); } while (!Number.isInteger(j) || j === 0 || j === n || p === q);
        const bien = C(n, j);
        return {
          pregunta: ['¿Cuánto vale el término independiente de (', pot('x', p), ' + ', { frac: ['1', pot('x', q)] }, `)${sup(n)}?`],
          opciones: distintas([{ id: 'c', texto: f(bien, 0), correcta: true },
            { id: 'des', texto: f(C(n, j + 1), 0), error: 'BN2', siFuera: `Ese es C(${n}, ${j + 1}); el exponente se anula con k = ${j}.` },
            { id: 'cent', texto: f(C(n, Math.floor(n / 2)), 0), error: 'BN19', siFuera: 'Ese es el central; el independiente es el que anula el exponente de x.' },
            { id: 'antes', texto: f(C(n, j - 1), 0), error: 'BN2', siFuera: `Ese es C(${n}, ${j - 1}); el exponente se anula con k = ${j}.` },
            { id: 'uno', texto: '1', error: 'TAL-BN-UNO', siFuera: 'Las potencias de x se cancelan, pero queda el combinatorio.' }]),
          solucion: { texto: `Exponente de x: ${p === 1 ? '' : p}(${n} − k) − ${q === 1 ? '' : q}k = 0 da k = ${j}.`, ecuacion: [`C(${n}, ${j}) = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 3: con exponente no natural, la suma no termina ----------
  // Cambia: x y cuántos términos se suman · Permanece: la curva exacta √(1 + x) · Progresa: la curva aproximada que se
  // pega a la exacta · Se reserva: x fuera de |x| < 1 · Debe verse: cerca de 0 se pega; lejos, se separa.
  // Se agarra: el punto verde de la curva exacta, que corre en x. Dos representaciones a propósito: la gráfica muestra
  // dónde se pega la suma para todos los x a la vez; «Predice» y «Mira» usan la tabla de sumas parciales, que da las
  // cifras de un solo x (0,2) que la gráfica no deja leer.
  const ALFA = [1, 2];                               // α = 1/2
  const coefs = j => coefGen(ALFA[0], ALFA[1], j);
  const parcial = (x, m) => { let s2 = 0; for (let j = 0; j < m; j++) { const [n2, d] = coefs(j); s2 += n2 / d * x ** j; } return s2; };
  const muestras = (fn, lo = -0.95, hi = 1.6) => Array.from({ length: 52 }, (_, i) => { const x = lo + (hi - lo) * i / 51; return [x, Math.max(-0.5, Math.min(2.5, fn(x)))]; });
  const ejesSerie = (m, x0, extra = {}) => ({
    x: { min: -1, max: 1.6, paso: 0.5, nombre: 'x', decimales: 1, color: 'o' },
    y: { min: -0.5, max: 2.5, paso: 0.5, nombre: 'y', decimales: 1 },
    curvas: [{ puntos: muestras(x => Math.sqrt(1 + x)), color: 'd', rotulo: '√(1 + x)', en: [1.1, 1.35] },
      { puntos: muestras(x => parcial(x, m)), color: 'h', discontinua: true, rotulo: `${m} términos`, en: [-0.9, parcial(-0.9, m) + 0.35] }],
    puntos: x0 === null ? [] : [{ x: x0, y: Math.sqrt(1 + x0), color: 'd', guias: true }],
    alt: `Curva exacta raíz de 1 + x y la suma de ${m} términos de su serie`,
    ...extra,
  });
  const serie = {
    id: 'exponente-no-natural',
    titulo: 'Con exponente no natural, no termina',
    temas: ['Binomio con exponente no natural'],
    pieza: 'ejes',
    juega: {
      consigna: '√(1 + x), es decir (1 + x) elevado a 1/2, se escribe como una suma infinita. Elige x y cuántos términos sumas; compara las curvas.',
      voz: 'Prueba x cerca de 0 y lejos de 0.',
      controles: [
        { id: 'x', etiqueta: 'x', min: -0.8, max: 1.6, paso: 0.2, inicio: 0.2, decimales: 1, color: 'c-o' },
        { id: 'm', etiqueta: 'Términos', min: 1, max: 5, paso: 1, inicio: 2, decimales: 0, color: 'c-h' },
      ],
      dibujo: v => ({ datos: ejesSerie(v.m, v.x, { puntos: [{ x: v.x, y: Math.sqrt(1 + v.x), color: 'd' }, { x: v.x, y: Math.max(-0.5, Math.min(2.5, parcial(v.x, v.m))), color: 'h', abierto: true }] }), estado: {} }),
      lectura: v => [`suma ${f(parcial(v.x, v.m), 4)} · exacto ${f(Math.sqrt(1 + v.x), 4)}`],
      minimo: 4,
      arrastres: [{
        id: 'punto-x', etiqueta: 'punto de la curva exacta: córrelo en x', color: 'c-o',
        donde: v => { const g = EJES().geometria(ejesSerie(v.m, v.x)); return { x: g.X(v.x), y: g.Y(Math.sqrt(1 + v.x)) }; },
        mover: (pt, v) => ({ x: inversa(EJES().geometria(ejesSerie(v.m, v.x)).X, -1, 1.6)(pt.x) }),
      }],
    },
    predice: (() => {
      const sumas = [1, 2, 3, 4, 5, 6].map(m => parcial(3, m));
      return {
        pregunta: 'Con x = 3, √(1 + x) = 2. Si se suman más y más términos de la serie, ¿la suma se acerca a 2?',
        opciones: [
          { id: 'c', texto: 'No: los términos crecen y la suma no se estabiliza', correcta: true },
          { id: 'si', texto: 'Sí: cada término nuevo la acerca más', error: 'TAL-SERIE-SIEMPRE', siFuera: 'Sería cierto con |x| < 1. Con x = 3, cada término es más grande que el anterior.' },
          { id: 'cinco', texto: 'Sí: con cinco términos ya es exacta', error: 'TAL-TRUNCA', siFuera: 'Una serie cortada es una aproximación; aquí, además, se aleja.' },
        ],
        pieza: 'alg-tabla',
        dibujo: { datos: { columnas: ['términos', 'suma'], filas: sumas.map((_, i) => [String(i + 1), '?']), alt: 'Sumas parciales de la serie en x = 3, por calcular' }, estado: {} },
        revelar: { datos: { columnas: ['términos', 'suma'], filas: sumas.map((v, i) => [String(i + 1), { t: f(v, 3), color: 'h', fuerte: true }]), pie: 'exacto: 2', alt: `Sumas parciales en x = 3: ${sumas.map(v => f(v, 2)).join('; ')}: no se acercan a 2` }, estado: {} },
        coincide: 'Coincide: con x = 3 la serie no converge; las sumas saltan cada vez más.',
      };
    })(),
    mira: (() => {
      const x0 = 0.2, ex = Math.sqrt(1 + x0);
      return {
        pieza: 'alg-tabla',
        datos: {
          columnas: ['n.º', 'coeficiente', 'suma', 'error'], colorCol: [null, 'd', 'h', null],
          filas: [1, 2, 3, 4, 5].map(m => [String(m), { t: frTxt(coefs(m - 1)), desde: m === 1 ? 1 : 2 }, { t: f(parcial(x0, m), 4), desde: m <= 2 ? 1 : 3 }, { t: f(Math.abs(ex - parcial(x0, m)), 5), desde: 4 }]),
          alt: 'Sumas parciales de la serie de raíz de 1,2: el error baja con cada término',
        },
        pasos: [
          { estado: { corte: 1 }, texto: 'Los dos primeros términos: 1 + x/2.', ecuacion: ['1 + ', { frac: ['1', '2'] }, ' · 0,2 = 1,1'] },
          { estado: { corte: 2 }, texto: 'Los coeficientes siguen α(α − 1)…/k!, con α = 1/2.', ecuacion: [{ frac: [['½ · (−½)'], '2!'] }, ' = −', { frac: ['1', '8'] }] },
          { estado: { corte: 3 }, texto: 'Con |x| < 1 cada término es más chico: la suma se acerca.', ecuacion: [`√1,2 ≈ ${f(ex, 5)}`] },
          { estado: { corte: 4 }, texto: 'Cortar la serie deja un error: es una aproximación.', ecuacion: [`error con 5 términos ≈ ${f(Math.abs(ex - parcial(x0, 5)), 6)}`] },
        ],
      };
    })(),
    regla: {
      texto: 'Si α no es natural, (1 + x) elevado a α es una serie infinita. Converge si |x| < 1, y cortarla da una aproximación, no una igualdad.',
      ecuacion: ['(1 + x)', { sup: ['', 'α'] }, ' = 1 + αx + ', { llave: [{ frac: ['α(α − 1)', '2!'] }], nota: 'baja de uno', color: 'c-d' }, 'x² + …'],
      condicion: 'α es real y |x| < 1; en |x| = 1 hace falta otro análisis. Con α natural, la suma termina.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const [p, q] = r.uno([[1, 2], [-1, 1], [-2, 1], [1, 3], [-1, 2], [3, 2], [2, 3]]);
        const j = s % 3 === 2 ? 3 : 2, bien = coefGen(p, q, j);
        const al = q === 1 ? f(p, 0) : `${p < 0 ? '−' : ''}${Math.abs(p)}/${q}`;
        const sinFact = fr(bien[0] * fact(j), bien[1]);
        const solo = fr(p ** j, q ** j * fact(j));
        return {
          pregunta: [`En el desarrollo de (1 + x) elevado a ${al}, ¿qué coeficiente acompaña a ${pot('x', j)}?`],
          opciones: distintas([{ id: 'c', texto: frPartes(bien), correcta: true },
            { id: 'fact', texto: frPartes(sinFact), error: 'TAL-SERIE-FACT', siFuera: `Falta dividir entre ${j}! = ${fact(j)}.` },
            { id: 'pot', texto: frPartes(solo), error: 'TAL-SERIE-POT', siFuera: `Eso eleva α a la ${j}; el numerador baja de uno en uno: α(α − 1)….` },
            { id: 'nat', texto: '0', error: 'TAL-TRUNCA', siFuera: 'Sería 0 si α fuera natural menor que el exponente; aquí la serie no termina.' }]),
          solucion: { texto: `α = ${al}: se multiplican ${j} factores que bajan de uno en uno y se divide entre ${j}!.`, ecuacion: [`coeficiente = ${frTxt(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: la potencia de un trinomio también cuenta órdenes ----------
  // Cambia: los exponentes de a y de b · Permanece: n = 4 y las tres letras · Progresa: el exponente de c que
  // completa n · Se reserva: el término abc de (a + b + c)³ · Debe verse: n! entre los factoriales de cada exponente.
  // Sin arrastre: la figura es una tabla de factoriales sin objeto que agarrar; los exponentes quedan en − y +.
  const tablaMulti = (n, i, j) => {
    const kk = n - i - j, ok = kk >= 0;
    return {
      columnas: ['', 'a', 'b', 'c'], colorCol: [null, 'o', 'i', 'd'],
      filas: [['exponente', String(i), String(j), ok ? String(kk) : '—'], ['factorial', f(fact(i), 0), f(fact(j), 0), ok ? f(fact(kk), 0) : '—']],
      pie: ok ? `${n}!/(${i}! · ${j}! · ${kk}!) = ${f(fact(n) / (fact(i) * fact(j) * fact(kk)), 0)}` : `${i} + ${j} pasa de ${n}: no hay término`,
      alt: `Coeficiente multinomial de a${i} b${j} en la potencia ${n} del trinomio`,
    };
  };
  const multinomio = {
    id: 'potencia-trinomio',
    titulo: 'Un trinomio también cuenta órdenes',
    temas: ['Potencia de un polinomio'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'En (a + b + c)⁴, elige los exponentes de a y de b; el de c completa 4. La tabla calcula el coeficiente del término.',
      voz: 'Mira qué pasa cuando los exponentes se reparten parejo.',
      controles: [
        { id: 'i', etiqueta: 'exponente de a', min: 0, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
        { id: 'j', etiqueta: 'exponente de b', min: 0, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: tablaMulti(4, v.i, v.j), estado: {} }),
      lectura: v => (4 - v.i - v.j >= 0 ? [`${pot('a', v.i)}${pot('b', v.j)}${pot('c', 4 - v.i - v.j)}: coeficiente ${f(fact(4) / (fact(v.i) * fact(v.j) * fact(4 - v.i - v.j)), 0)}`] : [`No hay término: ${v.i} + ${v.j} pasa de 4`]),
      minimo: 3,
    },
    predice: {
      pregunta: '¿Qué coeficiente acompaña a abc en el desarrollo de (a + b + c)³?',
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'uno', texto: '1', error: 'TAL-MULTI-UNO', siFuera: '1 sería cierto si a, b y c salieran siempre del mismo paréntesis; cada uno puede salir de cualquiera.' },
        { id: 'tres', texto: '3', error: 'TAL-MULTI-N', siFuera: '3 es el exponente; se cuentan los órdenes de a, b y c: 3 · 2 · 1.' },
        { id: 'todo', texto: '27', error: 'TAL-MULTI-TOTAL', siFuera: '27 = 3³ son todas las elecciones, no solo las que dan abc.' },
      ],
      dibujo: { datos: { columnas: ['1.er', '2.º', '3.er'], filas: [['?', '?', '?']], alt: 'Tres paréntesis; de cada uno sale a, b o c' }, estado: {} },
      revelar: { datos: { columnas: ['1.er', '2.º', '3.er'], filas: ['abc', 'acb', 'bac', 'bca', 'cab', 'cba'].map(w => w.split('').map(c => ({ t: c, color: c === 'a' ? 'o' : c === 'b' ? 'i' : 'd', fuerte: true }))), pie: '6 órdenes dan abc', alt: 'Los seis órdenes en que a, b y c salen de tres paréntesis' }, estado: {} },
      coincide: 'Coincide: a, b y c pueden salir en 3 · 2 · 1 = 6 órdenes.',
    },
    mira: {
      datos: {
        columnas: ['1.er', '2.º', '3.er', 'término'],
        filas: [...['aab', 'aba', 'baa'].map(w => [...w.split('').map(c => ({ t: c, color: c === 'a' ? 'o' : 'i', fuerte: true, desde: 1 })), { t: 'a²b', desde: 1 }]),
          ...['abc', 'acb', 'bac', 'bca', 'cab', 'cba'].map(w => [...w.split('').map(c => ({ t: c, color: c === 'a' ? 'o' : c === 'b' ? 'i' : 'd', fuerte: true, desde: 2 })), { t: 'abc', desde: 2 }])],
        alt: 'Tres órdenes dan a²b y seis órdenes dan abc en (a + b + c)³',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'a²b: hay que ubicar la única b entre tres paréntesis.', ecuacion: [{ frac: ['3!', '2! · 1!'] }, ' = 3'] },
        { estado: { corte: 2 }, texto: 'abc: tres letras distintas en tres lugares.', ecuacion: [{ frac: ['3!', '1! · 1! · 1!'] }, ' = 6'] },
        { estado: { corte: 2 }, texto: 'Las letras repetidas no cambian el término al permutarse: se divide.', ecuacion: ['(a + b + c)³ = … + 3a²b + … + 6abc + …'] },
      ],
    },
    regla: {
      texto: 'En (a + b + c)ⁿ, el coeficiente de aⁱbʲcᵏ cuenta los órdenes de las letras: n! entre el factorial de cada exponente.',
      ecuacion: [{ llave: [{ frac: ['n!', 'i! · j! · k!'] }], nota: 'órdenes distintos', color: 'c-d' }, '   ·   i + j + k = n'],
      condicion: 'i, j y k son enteros no negativos que suman n. Si una letra lleva un número delante, también se eleva.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.ent(3, 6);
        let i, j;
        do { i = r.ent(1, n); j = r.ent(1, n); } while (n - i - j < 1);
        const kk = n - i - j, c = s % 3 === 1 ? 2 : 1;
        const base = fact(n) / (fact(i) * fact(j) * fact(kk)), bien = base * c ** i;
        const term = `${pot('x', i)}${pot('y', j)}${pot('z', kk)}`;
        return {
          pregunta: `En (${c === 1 ? '' : c}x + y + z)${sup(n)}, ¿qué coeficiente acompaña a ${term}?`,
          opciones: distintas([{ id: 'c', texto: f(bien, 0), correcta: true },
            c > 1 && { id: 'sin', texto: f(base, 0), error: 'BN4', siFuera: `Falta elevar el ${c}: x sale de ${i} paréntesis, va ${c}${sup(i)}.` },
            { id: 'falta', texto: f(fact(n) / (fact(i) * fact(j)) * c ** i, 0), error: 'TAL-MULTI-FACT', siFuera: `Falta dividir entre ${kk}!, el factorial del exponente de z.` },
            { id: 'bin', texto: f(C(n, i) * c ** i, 0), error: 'TAL-MULTI-BIN', siFuera: `Eso solo ubica las x; faltan los órdenes de y y z.` },
            { id: 'uno', texto: f(c ** i, 0), error: 'TAL-MULTI-UNO', siFuera: 'Ese contaría un solo orden; las letras pueden salir de cualquier paréntesis.' }]),
          solucion: { texto: `${n}! entre los factoriales de ${i}, ${j} y ${kk}${c > 1 ? `, por ${c}${sup(i)}` : ''}.`, ecuacion: [`${n}!/(${i}! · ${j}! · ${kk}!)${c > 1 ? ` · ${c}${sup(i)}` : ''} = ${bien}`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: el triángulo hasta la fila 8, con los pares o los múltiplos de 3 marcados. El caso que la idea 1 no muestra:
  // el dibujo que forman (triángulos vacíos dentro del triángulo).
  const trianguloMarcado = (n, m) => ({
    triangular: true,
    filas: Array.from({ length: n + 1 }, (_, i) => fila(i).map(c => ({ t: f(c, 0), color: m > 1 && c % m === 0 ? 'h' : i === n ? 'd' : null, fuerte: i === n || (m > 1 && c % m === 0) }))),
    alt: `Triángulo de Pascal hasta la fila ${n}${m > 1 ? `, con los múltiplos de ${m} en rojo` : ''}`,
  });
  // Mesa 2: el término general de (xᵖ + c/x^q)⁶ con p, q y c libres: el exponente de x es p(6 − k) − qk.
  const N2 = 6;
  const tablaGeneral = v => ({
    columnas: ['lugar', 'k', 'exp. de x', 'coef.'], colorCol: [null, 'i', 'o', 'd'],
    filas: Array.from({ length: N2 + 1 }, (_, j) => {
      const e = v.p * (N2 - j) - v.q * j;
      return [lugar(j + 1), String(j), { t: f(e, 0), color: e === 0 ? 'd' : null, fuerte: e === 0 }, { t: f(C(N2, j) * v.c ** j, 0), color: 'd', fuerte: j === v.k }];
    }),
    resaltes: [{ f: v.k, c: 0, ancho: 4, color: 'i' }],
    alt: `Los siete términos de (x elevado a ${v.p} + ${v.c}/x elevado a ${v.q}) a la 6`,
  });
  const titulo2 = v => `(${pot('x', v.p)} ${v.c < 0 ? '−' : '+'} ${Math.abs(v.c)}/${pot('x', v.q)})⁶`;
  // Mesa 3: la serie de (1 + x) elevado a α, con α natural, fraccionario o negativo. Con α = 2 la suma termina: desde
  // 3 términos es exacta en todo x; con α = −1 es la serie geométrica.
  const ALFAS = { '1/2': [1, 2], '-1/2': [-1, 2], '-1': [-1, 1], '2': [2, 1] };
  const EJ3 = { x: { min: -0.8, max: 1.4, paso: 0.2, cada: 2, nombre: 'x', decimales: 1, color: 'o' }, y: { min: -1, max: 4, paso: 1, nombre: 'y', decimales: 0 } };
  const exacta = (al, xx) => (1 + xx) ** (ALFAS[al][0] / ALFAS[al][1]);
  const parcialA = (al, xx, m) => { let s2 = 0; for (let j = 0; j < m; j++) { const [n2, d] = coefGen(ALFAS[al][0], ALFAS[al][1], j); s2 += n2 / d * xx ** j; } return s2; };
  // Curva muestreada que se corta (null) donde sale de la ventana, sin aplastarla contra el borde.
  const tramo = fn => { const out = []; for (let i = 0; i <= 88; i++) { const xx = -0.8 + 2.2 * i / 88, yy = fn(xx); out.push(yy >= -1 && yy <= 4 ? [xx, yy] : null); } return out; };
  const serieLibre = v => {
    const ye = exacta(v.al, v.x), ys = parcialA(v.al, v.x, v.m), dentro = yy => Math.max(-1, Math.min(4, yy));
    return Object.assign({}, EJ3, {
      curvas: [{ puntos: tramo(xx => exacta(v.al, xx)), color: 'd' }, { puntos: tramo(xx => parcialA(v.al, xx, v.m)), color: 'h', discontinua: true }],
      puntos: [{ x: v.x, y: dentro(ye), color: 'd' }, { x: v.x, y: dentro(ys), color: 'h', abierto: true }],
      alt: `Curva exacta de (1 + x) elevado a ${v.al} y la suma de ${v.m} términos de su serie`,
    });
  };
  const laboratorio = [
    {
      id: 'pascal-colores', titulo: 'El triángulo hasta la fila 8', pieza: 'alg-tabla',
      consigna: 'Arrastra la fila verde hacia abajo y marca los pares o los múltiplos de 3. Mira el dibujo que forman los rojos.',
      controles: [
        { id: 'n', etiqueta: 'n', min: 0, max: 8, paso: 1, inicio: 6, decimales: 0, color: 'c-d' },
        { id: 'm', etiqueta: 'Marcar', opciones: [{ valor: 1, texto: 'nada' }, { valor: 2, texto: 'pares' }, { valor: 3, texto: 'múltiplos de 3' }] },
      ],
      dibujo: v => ({ datos: trianguloMarcado(v.n, v.m), estado: {} }),
      lectura: v => { const fl = fila(v.n), r = v.m > 1 ? fl.filter(c => c % v.m === 0).length : 0; return [`Fila ${v.n}: suma ${2 ** v.n}`, v.m > 1 ? `; ${r} de ${fl.length} son múltiplos de ${v.m}` : '']; },
      arrastres: [{
        id: 'fila-n', etiqueta: 'fila n: bájala para agregar filas', color: 'c-d',
        donde: v => { const d = trianguloMarcado(v.n, v.m), g = TABLA().geometria(d); return { x: Math.min(306, g.cx(v.n, v.n) + g.paso * 0.75), y: g.cy(v.n) }; },
        mover: (pt, v) => ({ n: filaDe(trianguloMarcado(v.n, v.m), pt.y) }),
      }],
    },
    {
      id: 'termino-libre', titulo: 'Término general a medida', pieza: 'alg-tabla',
      consigna: 'Elige los exponentes p y q y el número c del binomio, y arrastra la fila marcada. Busca el término sin x: exponente 0.',
      controles: [
        { id: 'p', etiqueta: 'p', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
        { id: 'q', etiqueta: 'q', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
        { id: 'c', etiqueta: 'c', opciones: [{ valor: 1, texto: '1' }, { valor: 2, texto: '2' }, { valor: -1, texto: '−1' }] },
        { id: 'k', etiqueta: 'k', min: 0, max: N2, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: tablaGeneral(v), estado: {} }),
      lectura: v => { const e = v.p * (N2 - v.k) - v.q * v.k; return [`${titulo2(v)}, k = ${v.k}: ${f(C(N2, v.k) * v.c ** v.k, 0)}`, e === 0 ? ', sin x' : pot('x', e)]; },
      arrastres: [{
        id: 'fila-k', etiqueta: 'fila marcada: súbela o bájala', color: 'c-i',
        donde: v => { const g = TABLA().geometria(tablaGeneral(v)); return { x: g.xs[g.nc] - 4, y: g.cy(v.k) }; },
        mover: (pt, v) => ({ k: filaDe(tablaGeneral(v), pt.y) }),
      }],
    },
    {
      id: 'serie-alfa', titulo: 'La serie con otro exponente', pieza: 'ejes',
      consigna: 'Elige α, cuántos términos sumas y arrastra el punto en x. Con α natural, la suma termina; con los demás, no.',
      controles: [
        { id: 'al', etiqueta: 'α', opciones: [{ valor: '1/2', texto: '1/2' }, { valor: '-1/2', texto: '−1/2' }, { valor: '-1', texto: '−1' }, { valor: '2', texto: '2' }] },
        { id: 'x', etiqueta: 'x', min: -0.8, max: 1.4, paso: 0.2, inicio: 0.4, decimales: 1, color: 'c-o' },
        { id: 'm', etiqueta: 'Términos', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0, color: 'c-h' },
      ],
      dibujo: v => ({ datos: serieLibre(v), estado: {} }),
      lectura: v => [`α = ${v.al.replace('-', '−')}, ${v.m} términos: suma ${f(parcialA(v.al, v.x, v.m), 4)} · exacto ${f(exacta(v.al, v.x), 4)}`],
      arrastres: [{
        id: 'punto-x', etiqueta: 'punto de la curva exacta: córrelo en x', color: 'c-o',
        donde: v => { const g = EJES().geometria(EJ3); return { x: g.X(v.x), y: g.Y(Math.max(-1, Math.min(4, exacta(v.al, v.x)))) }; },
        mover: pt => ({ x: inversa(EJES().geometria(EJ3).X, -0.8, 1.4)(pt.x) }),
      }],
    },
  ];

  return {
    unidad: 'algebra.binomio-de-newton',
    version: '0.2.0',
    laboratorio,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Los coeficientes del binomio son anteriores a Newton: los textos de Yang Hui ya muestran el triángulo aritmético en la tradición china. Newton extendió la idea a exponentes no naturales y a series infinitas, trabajo que él mismo situó en 1665. Conviene separar el desarrollo finito escolar de esa extensión, que exige condiciones de convergencia.',
      pregunta: '¿Qué pasa con el desarrollo si el exponente no es natural?',
      fuente: { titulo: 'Isaac Newton, History of the Method of Fluxions, transcripción diplomática — The Newton Project, Universidad de Oxford', url: 'https://newtonproject.ox.ac.uk/view/texts/diplomatic/NATP00356' },
    },
    ideas: [pascal, general, serie, multinomio],
  };
});
