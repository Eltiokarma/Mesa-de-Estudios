/*
 * Teoría de «División de polinomios y cocientes notables» (algebra.division-de-polinomios). Molde: docs/teoria.md;
 * forma de Álgebra: logica-y-conjuntos.js. Fuente: docs/teoria/matriz/algebra.json (unidad 8), expediente
 * teoria-152-unidades (Álgebra) y historia-ecuaciones (pp. 57–68). Errores: PO1–PO35 de plantillas/polinomios/
 * (hipótesis del proyecto) y TAL-* nuevos (hipótesis, rutinas/teoria-algebra.md).
 * Colores (regla 4): dividendo P y la raíz a naranja (c-o); divisor D turquesa (c-i); cociente Q verde (c-d);
 * resto R rojo (c-h). En Ruffini, la flecha «multiplica» va en naranja (multiplica por a).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · dividir polinomios sabiendo qué identidad se busca (P = D·Q + R) y leer el resto sin dividir.
 * Persona y condiciones · 3.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · completa Ruffini, ajusta el cociente para kx + b, halla restos con P(a) y términos de cocientes notables.
 * Orden de atención · 1.º la tabla de Ruffini o la gráfica · 2.º la casilla que sigue · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué el cociente de Ruffini para 2x − 2 no es el cociente de la división, y el resto sí lo es.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const P = { v: 'c-o', t: 'P' }, D = { v: 'c-i', t: 'D' }, Q = { v: 'c-d', t: 'Q' }, R = { v: 'c-h', t: 'R' }, a = { v: 'c-o', t: 'a' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r();
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r.noCero = (lo, hi) => { let v = 0; while (v === 0) v = lo + Math.floor(r() * (hi - lo + 1)); return v; };
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = n => String(n).split('').map(c => SUP[c]).join('');
  const pot = (v, e) => (e === 0 ? '' : e === 1 ? v : v + sup(e));
  // Fracción simple para escribir a = 1/2 o cocientes entre k: «½» no; «1/2».
  const mcd = (m, n) => (n ? mcd(n, m % n) : Math.abs(m));
  const fr = (num, den = 1) => { if (den < 0) { num = -num; den = -den; } const g = mcd(num, den) || 1; num /= g; den /= g; return den === 1 ? f(num) : `${num < 0 ? '−' : ''}${Math.abs(num)}/${den}`; };
  function poli(cs, v = 'x', den = 1) {
    const n = cs.length - 1, out = [];
    cs.forEach((c, k) => { if (c !== 0) out.push([c, n - k]); });
    if (!out.length) return '0';
    return out.map(([c, e], i) => {
      const abs = Math.abs(c), lit = pot(v, e);
      const num = den === 1 ? (abs === 1 && lit ? '' : f(abs)) : fr(abs, den) === '1' && lit ? '' : fr(abs, den);
      return (c < 0 ? (i ? ' − ' : '−') : (i ? ' + ' : '')) + (den !== 1 && lit && num.includes('/') ? `(${num})` : num) + lit;
    }).join('');
  }
  const evaluar = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
  const multiplicar = (A, B) => { const out = Array(A.length + B.length - 1).fill(0); A.forEach((u, i) => B.forEach((w, j) => { out[i + j] += u * w; })); return out; };
  // División de un polinomio entre otro mónico: cociente y resto (enteros).
  function dividir(cs, d) {
    const cur = cs.slice(), q = [];
    for (let k = 0; k + d.length <= cur.length; k++) { const c = cur[k] / d[0]; q.push(c); d.forEach((u, i) => { cur[k + i] -= c * u; }); }
    return { q, r: cur.slice(cur.length - (d.length - 1)) };
  }
  // Ruffini de cs entre x − a: fila de abajo b (cociente y, al final, el resto).
  const ruffini = (cs, x) => cs.reduce((b, c, i) => [...b, i ? c + x * b[i - 1] : c], []);

  // ---------- Idea 1: dividir es buscar P = D·Q + R ----------
  // Cambia: el divisor · Permanece: el dividendo x³ + 2x² − x + 5 · Progresa: las filas restadas · Se reserva: la
  // última fila, el resto · Debe verse: se divide hasta que lo que queda tiene menor grado que D.
  const PDIV = [1, 2, -1, 5];
  const DIVISORES = { 'x − 1': [1, -1], 'x + 2': [1, 2], 'x² + 1': [1, 0, 1], 'x² − x': [1, -1, 0] };
  function tablaLarga(cs, d, conPasos = false) {
    const n = cs.length, cols = cs.map((_, k) => (n - 1 - k === 0 ? 'x⁰' : n - 1 - k === 1 ? 'x¹' : pot('x', n - 1 - k)));
    const filas = [cs.map(c => ({ t: f(c), color: 'o', fuerte: true }))], rot = ['P'], colr = ['o'];
    const cur = cs.slice();
    for (let k = 0; k + d.length <= n; k++) {
      const c = cur[k] / d[0], e = n - d.length - k;
      const prod = Array(n).fill(null); d.forEach((u, i) => { prod[k + i] = -c * u; });
      filas.push(prod.map(v => (v === null ? '' : { t: f(v), desde: conPasos ? 2 * k + 1 : 0 })));
      { const t = poli([c, ...Array(e).fill(0)]); rot.push(`−${c < 0 ? `(${t})` : t}·D`); } colr.push('i');
      d.forEach((u, i) => { cur[k + i] -= c * u; });
      const ultimo = k + d.length === n;
      filas.push(cur.map((v, j) => (j <= k ? '' : { t: f(v), desde: conPasos ? 2 * k + 2 : 0, color: ultimo && j >= n - (d.length - 1) ? 'h' : undefined, fuerte: ultimo })));
      rot.push(ultimo ? 'R' : 'queda'); colr.push(ultimo ? 'h' : null);
    }
    const { q, r } = dividir(cs, d);
    return { columnas: cols, filas, rotulosFila: rot, colorFila: colr, alt: `División de ${poli(cs)} entre ${poli(d)}: cociente ${poli(q)}, resto ${poli(r)}` };
  }
  const algoritmo = {
    id: 'algoritmo',
    titulo: 'Dividir es buscar D·Q + R',
    temas: ['Algoritmo de la división'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'P = x³ + 2x² − x + 5. Elige un divisor D: cada fila resta un múltiplo de D hasta que lo que queda es el resto.',
      voz: 'Compara el grado del resto con el de D.',
      controles: [{ id: 'd', etiqueta: 'Divisor D', opciones: Object.keys(DIVISORES).map(t => ({ valor: t, texto: t })) }],
      dibujo: val => ({ datos: tablaLarga(PDIV, DIVISORES[val.d]), estado: {} }),
      lectura: val => { const { q, r } = dividir(PDIV, DIVISORES[val.d]); return [Q, ` = ${poli(q)} · `, R, ` = ${poli(r)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Se divide un ', P, ' de grado 7 entre un ', D, ' de grado 3. ¿Qué grado tiene el cociente ', Q, '?'],
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'suma', texto: '10', error: 'TAL-GRADO-COC', siFuera: '10 sería el grado de P · D. Al dividir, los grados se restan.' },
        { id: 'divisor', texto: '3', error: 'TAL-GRADO-COC', siFuera: '3 es el grado de D. Q cumple D · Q de grado 7.' },
        { id: 'resto', texto: '2', error: 'TAL-RESTO-COC', siFuera: '2 es el grado máximo del resto, no el del cociente.' },
      ],
      dibujo: { datos: { columnas: ['P', 'D', 'Q', 'R'], colorCol: ['o', 'i', 'd', 'h'], rotulosFila: ['grado'], filas: [['7', '3', { t: '?', hueco: true }, { t: '?', hueco: true }]], alt: 'Grados: P 7, D 3, Q y R por hallar' }, estado: {} },
      revelar: { datos: { columnas: ['P', 'D', 'Q', 'R'], colorCol: ['o', 'i', 'd', 'h'], rotulosFila: ['grado'], filas: [['7', '3', { t: '4', color: 'd', fuerte: true }, { t: '≤ 2', color: 'h', fuerte: true }]], alt: 'Grados: P 7, D 3, Q 4 y R a lo más 2' }, estado: {} },
      coincide: 'Coincide: D · Q debe tener grado 7, así que Q tiene grado 7 − 3 = 4.',
    },
    mira: (() => {
      const d = [1, 0, 1], { q, r } = dividir(PDIV, d);
      return {
        datos: tablaLarga(PDIV, d, true),
        voz: 'Las formas cambian; la igualdad se conserva en cada fila.',
        pasos: [
          { estado: { corte: 1 }, texto: 'x³ entre x² da x. Se resta x · D = x³ + x.', ecuacion: [Q, ' empieza con x'] },
          { estado: { corte: 2 }, texto: 'Queda 2x² − 2x + 5, todavía de grado 2.', ecuacion: ['grado 2 = grado ', D] },
          { estado: { corte: 3 }, texto: '2x² entre x² da 2. Se resta 2 · D = 2x² + 2.', ecuacion: [Q, ` = ${poli(q)}`] },
          { estado: { corte: 4 }, texto: 'Queda grado 1, menor que el de D: es el resto.', ecuacion: [R, ` = ${poli(r)}`] },
          { estado: { corte: 4 }, texto: 'Comprobación: D · Q + R reconstruye P.', ecuacion: [`(x² + 1)(${poli(q)}) + (${poli(r)}) = ${poli(PDIV)}`] },
        ],
      };
    })(),
    regla: {
      texto: 'Dividir P entre D es hallar el cociente Q y el resto R con P = D · Q + R, donde el grado de R es menor que el de D.',
      ecuacion: [P, ' = ', D, ' · ', Q, ' + ', R],
      condicion: 'D no es el polinomio cero. El grado de Q es grado de P menos grado de D.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), gP = r.ent(4, 9), gD = r.ent(1, Math.min(4, gP - 1));
        const pideQ = s % 2 === 0;
        const bien = pideQ ? gP - gD : gD - 1;
        return {
          pregunta: ['Se divide un ', P, ` de grado ${gP} entre un `, D, ` de grado ${gD}. ¿Qué grado ${pideQ ? 'tiene el cociente' : 'puede tener, como máximo, el resto'}?`],
          opciones: distintas([
            { id: 'c', texto: f(bien), correcta: true },
            pideQ ? { id: 'suma', texto: f(gP + gD), error: 'TAL-GRADO-COC', siFuera: 'Eso sería el grado de P · D. Al dividir, los grados se restan.' }
              : { id: 'igual', texto: f(gD), error: 'TAL-GRADO-RESTO', siFuera: 'Si el resto tuviera el grado de D, todavía se podría seguir dividiendo.' },
            pideQ ? { id: 'div', texto: f(gD), error: 'TAL-GRADO-COC', siFuera: 'Ese es el grado de D, no el de Q.' }
              : { id: 'coc', texto: f(gP - gD), error: 'TAL-RESTO-COC', siFuera: 'Ese es el grado del cociente; el resto es menor que D.' },
            pideQ ? { id: 'resto', texto: f(gD - 1), error: 'TAL-RESTO-COC', siFuera: 'Ese es el grado máximo del resto.' }
              : { id: 'cero', texto: '0', error: 'TAL-RESTO-CTE', siFuera: 'El resto es constante solo si D es de grado 1.' },
          ]),
          solucion: { texto: pideQ ? 'D · Q debe tener el grado de P.' : 'Se sigue dividiendo mientras lo que queda tenga grado de D o más.', ecuacion: [pideQ ? `${gP} − ${gD} = ${bien}` : `grado R ≤ ${gD} − 1 = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 2: bajar, multiplicar y sumar ----------
  // Cambia: el número a del divisor x − a · Permanece: los coeficientes, con su 0 · Progresa: la fila de abajo,
  // casilla por casilla · Se reserva: la última casilla, el resto · Debe verse: cada casilla nueva sale de las dos de arriba.
  function tablaRuffini(cs, x, { pasos = false, oculta = null, ver = Infinity, resaltar = null, xTexto } = {}) {
    const b = ruffini(cs, x), n = cs.length;
    const desde = k => (pasos ? k + 1 : 0);
    const visible = k => k < ver;
    return {
      filas: [
        ['', ...cs.map(c => ({ t: f(c), color: 'o' }))],
        [{ t: xTexto || f(x), color: 'o', fuerte: true }, '', ...b.slice(0, -1).map((v, k) => (visible(k + 1) ? { t: f(v * x), desde: desde(k + 1) } : ''))],
        ['', ...b.map((v, k) => (k === oculta ? { t: '?', hueco: true } : visible(k) ? { t: f(v), desde: desde(k), fuerte: true, color: k === n - 1 ? 'h' : 'd' } : ''))],
      ],
      separador: { fila: 2 },
      flechas: b.slice(0, -1).map((_, k) => (visible(k + 1) && k + 1 !== oculta ? { de: [2, k + 1], a: [1, k + 2], color: 'o', desde: desde(k + 1) } : null)).filter(Boolean),
      resaltes: resaltar === null ? [] : [{ f: 2, c: resaltar + 1, color: 'd' }],
      alt: `Ruffini de ${poli(cs)} entre x − ${xTexto || f(x)}: fila de abajo ${b.map(v => f(v)).join(', ')}`,
    };
  }
  const PJ = [1, -3, 0, 4], PR = [2, 0, -5, 1];
  const ruffiniIdea = {
    id: 'ruffini',
    titulo: 'Bajar, multiplicar y sumar',
    temas: ['Métodos de Horner y Ruffini'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'P = x³ − 3x² + 4, dividido entre x − a. Elige a: la fila de abajo se arma bajando, multiplicando por a y sumando.',
      voz: 'Sigue una flecha: multiplica por a y suma.',
      controles: [{ id: 'a', etiqueta: 'a', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: tablaRuffini(PJ, val.a), estado: {} }),
      lectura: val => { const b = ruffini(PJ, val.a); return [Q, ` = ${poli(b.slice(0, -1))} · `, R, ` = ${f(b[b.length - 1])}`]; },
      minimo: 3,
    },
    predice: (() => {
      const b = ruffini(PR, 2);
      return {
        pregunta: ['En Ruffini de 2x³ − 5x + 1 entre x − 2 ya van 2 y 4 en la fila de abajo. ¿Qué número va en la casilla «?»'],
        opciones: [
          { id: 'c', texto: f(b[2]), correcta: true },
          { id: 'resta', texto: f(PR[2] - 2 * b[1]), error: 'TAL-RUF-RESTA', siFuera: `${f(PR[2] - 2 * b[1])} resta el producto. En Ruffini se suma: −5 + 8.` },
          { id: 'producto', texto: f(2 * b[1]), error: 'TAL-RUF-PRODUCTO', siFuera: '8 es el producto 4 · 2; falta sumarlo con −5.' },
          { id: 'sin-cero', texto: f(PR[2] + 2 * PR[0]), error: 'PO1', siFuera: '−1 sale sin el 0 de x². Con el 0 en su casilla, va −5 + 8.' },
        ],
        dibujo: { datos: tablaRuffini(PR, 2, { ver: 2, oculta: 2 }), estado: {} },
        revelar: { datos: tablaRuffini(PR, 2, { resaltar: 2 }), estado: {} },
        coincide: `Coincide: 4 · 2 = 8 sube a la columna de −5, y −5 + 8 = ${f(b[2])}.`,
      };
    })(),
    mira: (() => {
      const b = ruffini(PR, 2);
      return {
        datos: tablaRuffini(PR, 2, { pasos: true }),
        pasos: [
          { estado: { corte: 1 }, texto: 'Se escriben todos los coeficientes, con 0 para x². Se baja el 2.', ecuacion: ['2 | 0 | −5 | 1'] },
          { estado: { corte: 2 }, texto: '2 · 2 = 4 sube a la columna del 0; 0 + 4 = 4.', ecuacion: ['0 + 2 · 2 = 4'] },
          { estado: { corte: 3 }, texto: '4 · 2 = 8 sube; −5 + 8 = 3.', ecuacion: ['−5 + 2 · 4 = 3'] },
          { estado: { corte: 4 }, texto: '3 · 2 = 6 sube; 1 + 6 = 7. La última casilla es el resto.', ecuacion: [R, ` = ${f(b[3])}`] },
          { estado: { corte: 4 }, texto: 'Las demás casillas son el cociente, un grado menor.', ecuacion: [Q, ` = ${poli(b.slice(0, -1))}`] },
        ],
      };
    })(),
    regla: {
      texto: 'Para dividir entre x − a, se baja el primer coeficiente; cada casilla nueva es el coeficiente de arriba más a por la casilla anterior. La última es el resto.',
      ecuacion: [{ sub: ['b', 'k'] }, ' = ', { sub: ['c', 'k'] }, ' + ', a, ' · ', { sub: ['b', 'k−1'] }],
      condicion: 'el divisor es x − a; se escriben todos los coeficientes, con 0 en las potencias que faltan. Es el esquema de Horner.',
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s);
        const cs = [r.noCero(-3, 3), r.ent(-4, 4), r.ent(-5, 5), r.ent(-6, 6)];
        if (s % 3 === 0) cs[1] = 0;
        const x = r.noCero(-3, 3), b = ruffini(cs, x), k = r.ent(1, 3);
        const div = x < 0 ? `x + ${-x}` : `x − ${x}`;
        const pideResto = k === 3;
        return {
          pregunta: [`En Ruffini de ${poli(cs)} entre ${div}, ¿qué número va en la casilla «?» de la fila de abajo${pideResto ? ', el resto' : ''}?`],
          dibujo: { datos: tablaRuffini(cs, x, { ver: k, oculta: k }), estado: {} },
          opciones: distintas([
            { id: 'c', texto: f(b[k]), correcta: true },
            { id: 'resta', texto: f(cs[k] - x * b[k - 1]), error: 'TAL-RUF-RESTA', siFuera: 'Eso resta el producto; en Ruffini se suma.' },
            { id: 'signo', texto: f(cs[k] - x * ruffini(cs, -x)[k - 1] === b[k] ? NaN : ruffini(cs, -x)[k]), error: 'PO2', siFuera: `Eso usa ${f(-x)}: para ${div} se usa a = ${f(x)}.` },
            { id: 'producto', texto: f(x * b[k - 1]), error: 'TAL-RUF-PRODUCTO', siFuera: 'Ese es solo el producto; falta sumarle el coeficiente de arriba.' },
            { id: 'arriba', texto: f(cs[k]), error: 'TAL-RUF-BAJA', siFuera: 'Ese es el coeficiente de arriba; solo el primero se baja tal cual.' },
            { id: 'suma-a', texto: f(cs[k] + x + b[k - 1]), error: 'TAL-RUF-PRODUCTO', siFuera: `Eso suma ${f(x)} en vez de multiplicar por ${f(x)}.` },
          ]).slice(0, 4),
          solucion: {
            texto: `Se multiplica la casilla anterior por ${f(x)} y se suma el coeficiente de arriba.`,
            ecuacion: [`${f(cs[k])} + ${x < 0 ? `(${f(x)})` : f(x)} · ${b[k - 1] < 0 ? `(${f(b[k - 1])})` : f(b[k - 1])} = ${f(b[k])}`],
            dibujo: { datos: tablaRuffini(cs, x, { resaltar: k }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 3: con kx + b, el cociente se divide entre k ----------
  // Cambia: k en el divisor k(x − 1) · Permanece: el Ruffini con a = 1 · Progresa: la fila «÷ k» · Se reserva: el
  // resto, que no cambia · Debe verse: Ruffini da k veces el cociente; el resto sale tal cual.
  const PK = [6, 6, 1];
  function tablaK(cs, num, den, k, { dividir: conK = true, pasos = false } = {}) {
    const x = num / den, b = ruffini(cs, x), n = cs.length;
    const xt = fr(num, den);
    return {
      filas: [
        ['', ...cs.map(c => ({ t: f(c), color: 'o' }))],
        [{ t: xt, color: 'o', fuerte: true }, '', ...b.slice(0, -1).map(v => ({ t: fr(Math.round(v * x * den), den) }))],
        ['', ...b.map((v, i) => ({ t: fr(Math.round(v * den), den), fuerte: true, color: i === n - 1 ? 'h' : undefined }))],
        conK ? [{ t: `÷ ${k}`, fuerte: true }, ...b.slice(0, -1).map(v => ({ t: fr(Math.round(v * den), den * k), color: 'd', fuerte: true, desde: pasos ? 2 : 0 })), ''] : ['', '', '', ''].slice(0, n + 1),
      ],
      separador: { fila: 2 },
      alt: `Ruffini con x = ${xt}; el cociente se divide entre ${k}; el resto queda igual`,
    };
  }
  const divisorK = {
    id: 'divisor-k',
    titulo: 'Con kx + b, divide entre k',
    temas: ['Métodos de Horner y Ruffini', 'Algoritmo de la división'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'P = 6x² + 6x + 1 entre kx − k. Ruffini usa x = 1 sin importar k; la última fila divide el cociente entre k.',
      voz: 'Cambia k y mira qué fila se mueve.',
      controles: [{ id: 'k', etiqueta: 'k', opciones: [1, 2, 3, 6].map(v => ({ valor: v, texto: String(v) })) }],
      dibujo: val => ({ datos: tablaK(PK, 1, 1, val.k), estado: {} }),
      lectura: val => { const b = ruffini(PK, 1); return [Q, ` = (${poli(b.slice(0, -1))}) ÷ ${val.k} = ${poli(b.slice(0, -1), 'x', val.k)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Se divide 4x² − 2x + 5 entre 2x − 1. Ruffini con x = 1/2 deja 4 | 0 | 5. ¿Cuál es el cociente ', Q, '?'],
      opciones: [
        { id: 'c', texto: '2x', correcta: true },
        { id: 'sin-k', texto: '4x', error: 'PO3', siFuera: '4x sería el cociente de dividir entre x − 1/2. Para 2x − 1 falta dividir entre 2.' },
        { id: 'con-resto', texto: '2x + 5', error: 'TAL-RESTO-EN-Q', siFuera: 'El 5 de la última casilla es el resto; no forma parte del cociente.' },
        { id: 'por-k', texto: '8x', error: 'TAL-K-MULT', siFuera: '8x multiplica por 2; como el divisor es el doble, el cociente es la mitad.' },
      ],
      dibujo: { datos: tablaK([4, -2, 5], 1, 2, 2, { dividir: false }), estado: {} },
      revelar: { datos: tablaK([4, -2, 5], 1, 2, 2), estado: {} },
      coincide: 'Coincide: (x − 1/2) · 4x = (2x − 1) · 2x. El resto sigue siendo 5.',
    },
    mira: {
      datos: tablaK([1, 0, 1], 1, 1, 2, { pasos: true }),
      voz: 'Yo había comprimido ese paso. Abrámoslo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'x² + 1 entre 2x − 2: la raíz del divisor es x = 1.', ecuacion: ['2x − 2 = 0 → x = 1'] },
        { estado: { corte: 1 }, texto: 'Ruffini con 1 da x + 1 y resto 2: divide entre x − 1.', ecuacion: ['x² + 1 = (x − 1)(x + 1) + 2'] },
        { estado: { corte: 2 }, texto: 'Como 2x − 2 = 2(x − 1), el cociente se divide entre 2.', ecuacion: [Q, ' = (x + 1)/2 = x/2 + 1/2'] },
        { estado: { corte: 2 }, texto: 'El resto no se divide: sigue siendo 2.', ecuacion: ['x² + 1 = (2x − 2)(x/2 + 1/2) + 2'] },
      ],
    },
    regla: {
      texto: 'Para dividir entre kx + b se usa Ruffini con x = −b/k; su cociente Q′ se divide entre k. El resto R′ de Ruffini es el resto, sin dividir.',
      ecuacion: [Q, ' = ', { frac: ['Q′', 'k'] }, '   ·   ', R, ' = ', R, '′'],
      condicion: 'k distinto de 0. El resto queda igual porque solo se reparte el factor k entre el divisor y el cociente.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const k = r.uno([2, 3]), x = r.noCero(-2, 3), Qc = [r.noCero(-3, 3), r.ent(-4, 4)], Rr = r.noCero(-6, 6);
        const div = [k, -k * x];                           // kx − kx₀
        const cs = multiplicar(div, Qc).map((c, i, arr) => (i === arr.length - 1 ? c + Rr : c));
        const pideQ = s % 2 === 0;
        const dTxt = poli(div);
        if (pideQ) {
          return {
            pregunta: ['Divide ', `${poli(cs)} entre ${dTxt}. ¿Cuál es el cociente `, Q, '?'],
            opciones: distintas([
              { id: 'c', texto: poli(Qc), correcta: true },
              { id: 'sin-k', texto: poli(Qc.map(c => c * k)), error: 'PO3', siFuera: `Ese es el cociente entre x ${x < 0 ? '+' : '−'} ${Math.abs(x)}; falta dividir entre ${k}.` },
              { id: 'por-k', texto: poli(Qc, 'x', k), error: 'TAL-K-DOBLE', siFuera: `Eso divide entre ${k} dos veces.` },
              { id: 'signo', texto: poli([Qc[0], -Qc[1]]), error: 'PO2', siFuera: `Eso usa x = ${f(-x)}; la raíz de ${dTxt} es ${f(x)}.` },
            ]),
            solucion: { texto: `Ruffini con x = ${f(x)} y después se divide entre ${k}.`, ecuacion: [Q, ` = (${poli(Qc.map(c => c * k))}) ÷ ${k} = ${poli(Qc)}`] },
          };
        }
        return {
          pregunta: ['Divide ', `${poli(cs)} entre ${dTxt}. ¿Cuál es el resto `, R, '?'],
          opciones: distintas([
            { id: 'c', texto: f(Rr), correcta: true },
            { id: 'div', texto: fr(Rr, k), error: 'PO4', siFuera: `El resto no se divide entre ${k}; solo el cociente.` },
            { id: 'signo', texto: f(evaluar(cs, -x)), error: 'PO8', siFuera: `Ese es P(${f(-x)}); la raíz de ${dTxt} es ${f(x)}.` },
            { id: 'indep', texto: f(cs[cs.length - 1]), error: 'PO27', siFuera: 'Ese es el término independiente de P, no el resto.' },
          ]),
          solucion: { texto: `El resto es P(${f(x)}), sin dividir entre ${k}.`, ecuacion: [R, ` = P(${f(x)}) = ${f(Rr)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: el resto es P(a) ----------
  // Cambia: a en el divisor x − a · Permanece: la curva de P · Progresa: la curva (x − a)·Q, siempre R por debajo o
  // por encima · Se reserva: a = 3, donde R = 0 · Debe verse: en x = a el factor se anula y queda solo R.
  const PT = [1, -2, -3];
  const muestra = (cs, x0, x1) => Array.from({ length: Math.round((x1 - x0) * 10) + 1 }, (_, k) => { const t = x0 + k / 10; return [Math.round(t * 10) / 10, evaluar(cs, t)]; });
  function curvasResto(x, extra = []) {
    const Rv = evaluar(PT, x), sinR = PT.map((c, i) => (i === PT.length - 1 ? c - Rv : c));
    return {
      x: { min: -2, max: 4, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: -10, max: 10, paso: 5, nombre: 'y', decimales: 0 },
      curvas: [{ puntos: muestra(PT, -2, 4), color: 'o', rotulo: 'P', en: [3.8, evaluar(PT, 3.8)] }, { puntos: muestra(sinR, -2, 4), color: 'd', rotulo: '(x − a)Q', discontinua: true, en: [-1.9, evaluar(sinR, -1.9)] }],
      puntos: [{ x, y: Rv, color: 'h', guias: true, rotulo: `R = P(${f(x)}) = ${f(Rv)}` }, ...extra],
      alt: `P(x) = x² − 2x − 3 y (x − ${f(x)})·Q(x): la distancia vertical entre las dos es siempre ${f(Rv)}`,
    };
  }
  const P5 = [1, 0, 0, -3, 0, 7];   // x⁵ − 3x² + 7
  const resto = {
    id: 'teorema-resto',
    titulo: 'El resto es P(a)',
    temas: ['Teorema del resto', 'Divisibilidad de polinomios'],
    pieza: 'ejes',
    juega: {
      consigna: 'P = x² − 2x − 3, dividido entre x − a. La curva punteada es (x − a)·Q; la distancia entre las dos curvas es el resto.',
      voz: 'Busca un a donde las curvas se junten.',
      controles: [{ id: 'a', etiqueta: 'a', min: -2, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: curvasResto(val.a), estado: {} }),
      lectura: val => { const v = evaluar(PT, val.a); return [R, ` = ${f(v)}${v === 0 ? ': x − a es factor de P' : ''}`]; },
      minimo: 4,
    },
    predice: (() => {
      const datos = (con) => ({
        x: { min: -1.5, max: 1.5, paso: 1, nombre: 'x', decimales: 0, color: 'o' }, y: { min: -10, max: 10, paso: 5, nombre: 'P(x)', decimales: 0 },
        curvas: [{ puntos: muestra(P5, -1.5, 1.5), color: 'o', rotulo: 'P' }],
        puntos: con ? [{ x: -1, y: evaluar(P5, -1), color: 'h', guias: true, rotulo: `P(−1) = ${f(evaluar(P5, -1))}` }] : [],
        alt: 'Gráfica de P(x) = x⁵ − 3x² + 7',
      });
      return {
        pregunta: '¿Cuál es el resto de dividir x⁵ − 3x² + 7 entre x + 1?',
        opciones: [
          { id: 'c', texto: f(evaluar(P5, -1)), correcta: true },
          { id: 'signo', texto: f(evaluar(P5, 1)), error: 'PO8', siFuera: `${f(evaluar(P5, 1))} es P(1). Para x + 1 se evalúa en x = −1.` },
          { id: 'indep', texto: '7', error: 'PO27', siFuera: '7 es el término independiente: sería el resto entre x, no entre x + 1.' },
          { id: 'par', texto: f(-1 + 3 + 7), error: 'PO15', siFuera: '(−1)² = 1, no −1: el término −3x² vale −3.' },
        ],
        dibujo: { datos: datos(false), estado: {} },
        revelar: { datos: datos(true), estado: {} },
        coincide: `Coincide: P(−1) = −1 − 3 + 7 = ${f(evaluar(P5, -1))}.`,
      };
    })(),
    mira: {
      datos: Object.assign(curvasResto(1), {
        puntos: [{ x: 1, y: -4, color: 'h', guias: true, rotulo: 'R = −4', desde: 2 }, { x: 3, y: 0, color: 'd', rotulo: 'P(3) = 0', desde: 3 }, { x: -1, y: 0, color: 'd', desde: 4 }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Siempre P = (x − a)·Q + R. Aquí a = 1.', ecuacion: [P, '(x) = (x − 1)·', Q, '(x) + ', R] },
        { estado: { corte: 2 }, texto: 'En x = 1 el factor x − 1 vale 0: solo queda R.', ecuacion: [P, '(1) = 0 · ', Q, '(1) + ', R, ' = −4'] },
        { estado: { corte: 3 }, texto: 'Con a = 3 el resto es P(3) = 0: x − 3 es factor.', ecuacion: [P, '(3) = 9 − 6 − 3 = 0'] },
        { estado: { corte: 4 }, texto: 'También P(−1) = 0. Las dos raíces dan la factorización.', ecuacion: ['x² − 2x − 3 = (x − 3)(x + 1)'] },
      ],
    },
    regla: {
      texto: 'El resto de dividir P(x) entre x − a es P(a). Si P(a) = 0, x − a es factor y P es divisible entre x − a.',
      ecuacion: [P, ' = (x − ', a, ')·', Q, ' + ', P, '(', a, ')'],
      condicion: 'el divisor es de grado 1. Para kx + b se evalúa en x = −b/k.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const cs = [r.noCero(-2, 3), r.ent(-4, 4), r.ent(-4, 4), r.ent(-6, 6)];
          const x = r.noCero(-3, 3), div = x < 0 ? `x + ${-x}` : `x − ${x}`;
          return {
            pregunta: `¿Cuál es el resto de dividir ${poli(cs)} entre ${div}?`,
            opciones: distintas([
              { id: 'c', texto: f(evaluar(cs, x)), correcta: true },
              { id: 'signo', texto: f(evaluar(cs, -x)), error: 'PO8', siFuera: `Ese es P(${f(-x)}); para ${div} se evalúa en x = ${f(x)}.` },
              { id: 'indep', texto: f(cs[3]), error: 'PO27', siFuera: 'Ese es el término independiente; sería el resto entre x.' },
              { id: 'suma', texto: f(evaluar(cs, 1)), error: 'PO7', siFuera: 'Esa es la suma de coeficientes, P(1).' },
            ]).slice(0, 4),
            solucion: { texto: `El resto es P(${f(x)}).`, ecuacion: [R, ` = P(${f(x)}) = ${f(evaluar(cs, x))}`] },
          };
        }
        // Divisibilidad: m para que x − a divida a x³ + m·x² + c·x + d.
        let x, m, c, d;
        do { x = r.noCero(-3, 3); m = r.noCero(-4, 4); c = r.ent(-5, 5); d = -(x ** 3 + m * x * x + c * x); } while (d === 0 || d === m || d === -m);
        const div = x < 0 ? `x + ${-x}` : `x − ${x}`;
        const mMal = (-((-x) ** 3) - c * (-x) - d) / (x * x);
        return {
          pregunta: ['¿Qué valor de m hace que ', `x³ + mx²${c === 0 ? '' : ` ${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}x`} ${d < 0 ? '−' : '+'} ${Math.abs(d)} sea divisible entre ${div}?`],
          opciones: distintas([
            { id: 'c', texto: f(m), correcta: true },
            { id: 'signo', texto: Number.isInteger(mMal) ? f(mMal) : fr(-((-x) ** 3) - c * (-x) - d, x * x), error: 'PO17', siFuera: `Eso usa P(${f(-x)}) = 0; el factor ${div} pide P(${f(x)}) = 0.` },
            { id: 'cero', texto: f(-m), error: 'AL16', siFuera: 'El signo cambió al despejar m.' },
            { id: 'indep', texto: f(d), error: 'PO27', siFuera: 'Ese es el término independiente, no m.' },
          ]).slice(0, 4),
          solucion: { texto: `Divisible significa resto 0: P(${f(x)}) = 0.`, ecuacion: [`${f(x ** 3)} + ${f(x * x)}m ${c * x + d < 0 ? '−' : '+'} ${Math.abs(c * x + d)} = 0 → m = ${f(m)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: cocientes notables ----------
  // Cambia: n y a en (xⁿ − aⁿ) ÷ (x − a) · Permanece: el Ruffini con ceros en medio · Progresa: las potencias de a
  // en la fila de abajo · Se reserva: el resto 0 · Debe verse: x baja de uno en uno y a sube de uno en uno.
  const tablaNotable = (n, x, opc = {}) => tablaRuffini([1, ...Array(n - 1).fill(0), -(x ** n)], x, opc);
  const termino = (n, k, base, signo = 1) => {
    const c = signo * (typeof base === 'number' ? base ** (k - 1) : 1);
    const lit = pot('x', n - k) + (typeof base === 'number' ? '' : pot(base, k - 1));
    if (!lit) return f(c);
    return (c === 1 ? '' : c === -1 ? '−' : f(c)) + lit;
  };
  const notables = {
    id: 'cocientes-notables',
    titulo: 'Un exponente baja, otro sube',
    temas: ['Cocientes notables y término general'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Divide xⁿ − aⁿ entre x − a con Ruffini. Elige n y a: en medio todo es 0, y abajo aparecen las potencias de a.',
      voz: 'Mira el resto cada vez que cambias n.',
      controles: [
        { id: 'n', etiqueta: 'n', min: 2, max: 6, paso: 1, inicio: 3, decimales: 0, color: 'c-o' },
        { id: 'a', etiqueta: 'a', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      ],
      dibujo: val => ({ datos: tablaNotable(val.n, val.a), estado: {} }),
      lectura: val => [Q, ` tiene ${val.n} términos · `, R, ' = 0'],
      minimo: 3,
    },
    predice: {
      pregunta: ['En el cociente de (x⁶ − 64) ÷ (x − 2), ¿cuál es el cuarto término?'],
      opciones: [
        { id: 'c', texto: '8x²', correcta: true },
        { id: 'exp-a', texto: '16x²', error: 'TAL-TK-EXP', siFuera: '16 = 2⁴. En el término 4, a va con exponente 3: el primero lleva a⁰.' },
        { id: 'exp-x', texto: '8x³', error: 'TAL-TK-X', siFuera: 'x³ va en el tercer término; en el cuarto x tiene exponente 6 − 4 = 2.' },
        { id: 'tercero', texto: '4x³', error: 'TAL-CONTEO', siFuera: '4x³ es el tercer término: x⁵, 2x⁴, 4x³, …' },
      ],
      dibujo: { datos: tablaNotable(6, 2, { ver: 1 }), estado: {} },
      revelar: { datos: tablaNotable(6, 2, { resaltar: 3 }), estado: {} },
      coincide: 'Coincide: x⁵, 2x⁴, 4x³, 8x²: el cuarto término es 8x².',
    },
    mira: {
      datos: tablaNotable(6, 2, { pasos: true }),
      pasos: [
        { estado: { corte: 1 }, texto: 'x⁶ − 64 = x⁶ − 2⁶: entre x⁶ y −64 van cinco ceros.', ecuacion: ['1 | 0 | 0 | 0 | 0 | 0 | −64'] },
        { estado: { corte: 3 }, texto: 'Cada casilla es la anterior por 2: potencias de 2.', ecuacion: ['1, 2, 4, …'] },
        { estado: { corte: 6 }, texto: 'Hasta 2⁵ = 32. Son 6 términos, uno por cada potencia.', ecuacion: ['1, 2, 4, 8, 16, 32'] },
        { estado: { corte: 7 }, texto: 'La última da −64 + 64 = 0: la división es exacta.', ecuacion: [R, ' = 0'] },
        { estado: { corte: 7 }, texto: 'El exponente de x baja de 5 a 0; el de 2 sube.', ecuacion: ['x⁵ + 2x⁴ + 4x³ + 8x² + 16x + 32'] },
      ],
    },
    regla: {
      texto: '(xⁿ − aⁿ) ÷ (x − a) tiene n términos: el exponente de x baja de uno en uno y el de a sube desde 0. Así se arma el término k.',
      ecuacion: [{ sub: ['t', 'k'] }, ' = ', { sup: ['x', 'n − k'] }, '·', { sup: [{ v: 'c-i', t: 'a' }, 'k − 1'] }],
      condicion: 'vale para x ≠ a. Con x + a en el divisor, los signos se alternan: +, −, +, …',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const n = r.ent(5, 11), k = r.ent(2, n - 1);
        const conMas = s % 3 === 1;                   // (xⁿ + yⁿ) ÷ (x + y) con n impar
        const nn = conMas && n % 2 === 0 ? n + 1 : n;
        const signo = conMas ? (k % 2 === 1 ? 1 : -1) : 1;
        const enun = conMas ? `(x${sup(nn)} + y${sup(nn)}) ÷ (x + y)` : `(x${sup(nn)} − y${sup(nn)}) ÷ (x − y)`;
        const t = (kk, sg = signo) => termino(nn, kk, 'y', sg);
        return {
          pregunta: `En el cociente de ${enun}, ¿cuál es el término número ${k}?`,
          opciones: distintas([
            { id: 'c', texto: t(k), correcta: true },
            { id: 'exp-a', texto: (signo < 0 ? '−' : '') + pot('x', nn - k) + pot('y', k), error: 'TAL-TK-EXP', siFuera: `En el término ${k}, y lleva exponente ${k - 1}: el primero lleva y⁰.` },
            { id: 'exp-x', texto: (signo < 0 ? '−' : '') + pot('x', nn - k + 1) + pot('y', k - 1), error: 'TAL-TK-X', siFuera: `x baja desde ${nn - 1}: en el término ${k} su exponente es ${nn - k}.` },
            conMas ? { id: 'signo', texto: t(k, -signo), error: 'TAL-TK-SIGNO', siFuera: 'Con x + y los signos se alternan: impares +, pares −.' }
              : { id: 'cuenta', texto: t(k + 1), error: 'TAL-CONTEO', siFuera: `Ese es el término ${k + 1}.` },
          ]),
          solucion: { texto: `x baja desde ${nn - 1} e y sube desde 0${conMas ? '; los signos se alternan' : ''}.`, ecuacion: [{ sub: ['t', String(k)] }, ` = ${t(k)}`] },
        };
      },
    },
  };

  return {
    unidad: 'algebra.division-de-polinomios',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Ordenar los coeficientes para evaluar y dividir rápido no tiene un solo inventor. El llamado método de Horner tiene antecedentes, y su artículo de 1819 ni siquiera trae el procedimiento moderno, que aparece recién en uno de 1830. Más que el nombre, importa por qué funciona: la división entre x − a junta cociente, resto y el valor P(a) en una sola tabla.',
      pregunta: '¿Por qué ordenar los coeficientes ahorra operaciones?',
      fuente: { titulo: 'O’Connor y Robertson, William Horner — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Horner/' },
    },
    ideas: [algoritmo, ruffiniIdea, divisorK, resto, notables],
  };
});
