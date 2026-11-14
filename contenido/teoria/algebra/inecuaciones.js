/*
 * Teoría de «Inecuaciones» (algebra.inecuaciones). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 5), expediente teoria-152-unidades (Álgebra) y
 * historia-ecuaciones (pp. 57–68). Errores: AL19–AL21 de docs/investigacion/algebra-funciones-ideas-erroneas.md,
 * NR4 de plantillas/numeros-reales y TAL-* nuevos (hipótesis, rutinas/teoria-algebra.md).
 * Colores (regla 4): x naranja (c-o), tramo donde la expresión es positiva turquesa (c-i), negativa o excluida
 * rojo (c-h), conjunto solución verde (c-d).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · resolver una inecuación es encontrar un conjunto: cada paso tiene que conservarlo.
 * Persona y condiciones · 4.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · arma el cuadro de signos, decide cada frontera y no multiplica por algo de signo desconocido.
 * Orden de atención · 1.º la recta con los puntos críticos · 2.º el signo de cada tramo · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué −2x > 8 da x < −4 y por qué x = −2 nunca entra en (x − 1)/(x + 2) ≥ 0.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-o', t: 'x' };
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
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  // Fracción irreducible p/q como texto («−7/2», «3»).
  const mcd = (u, v) => (v ? mcd(v, u % v) : Math.abs(u));
  const fr = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = mcd(p, q) || 1; p /= g; q /= g; return q === 1 ? f(p) : `${p < 0 ? '−' : ''}${Math.abs(p)}/${q}`; };

  // ---------- Motor: conjunto solución de N(x)/D(x) rel 0, con N y D factorizados ----------
  // num, den: [{ r, m }] para (x − r)^m; signo: ±1 delante. Devuelve trozos { a, b, ca, cb } (null = infinito).
  const REL = { '<': v => v < 0, '>': v => v > 0, '≤': v => v <= 0, '≥': v => v >= 0 };
  const valor = (num, den, signo, v) => signo * num.reduce((p, k) => p * (v - k.r) ** k.m, 1) / den.reduce((p, k) => p * (v - k.r) ** k.m, 1);
  function resolver(num, den, signo, rel) {
    const C = [...new Set([...num, ...den].map(k => k.r))].sort((p, q) => p - q);
    const enDen = c => den.some(k => k.r === c);
    const items = [];
    for (let i = 0; i <= C.length; i++) {
      const a = i ? C[i - 1] : null, b = i < C.length ? C[i] : null;
      const mid = a === null ? (b === null ? 0 : b - 1) : b === null ? a + 1 : (a + b) / 2;
      items.push({ seg: true, a, b, ok: REL[rel](valor(num, den, signo, mid)) });
      if (b !== null) items.push({ seg: false, c: b, ok: !enDen(b) && (rel === '≤' || rel === '≥') });
    }
    const trozos = []; let cur = null;
    for (const it of items) {
      if (!it.ok) { if (cur) trozos.push(cur); cur = null; continue; }
      if (it.seg) { if (cur && cur.b === it.a && it.a !== null) { cur.b = it.b; cur.cb = false; } else { if (cur) trozos.push(cur); cur = { a: it.a, ca: false, b: it.b, cb: false }; } }
      else if (cur && cur.b === it.c) cur.cb = true; else { if (cur) trozos.push(cur); cur = { a: it.c, ca: true, b: it.c, cb: true }; }
    }
    if (cur) trozos.push(cur);
    return trozos;
  }
  const texto1 = I => (I.a !== null && I.a === I.b ? `{${f(I.a)}}`
    : `${I.a === null ? '(−∞' : (I.ca ? '[' : '(') + f(I.a)}, ${I.b === null ? '+∞)' : f(I.b) + (I.cb ? ']' : ')')}`);
  const conjunto = l => (!l.length ? '∅' : l.length === 1 && l[0].a === null && l[0].b === null ? 'ℝ' : l.map(texto1).join(' ∪ '));
  const OPUESTA = { '<': '≥', '>': '≤', '≤': '>', '≥': '<' }, ESTRICTA = { '<': '≤', '>': '≥', '≤': '<', '≥': '>' };
  // Signo de la expresión en cada tramo, para la recta: { a, b, mas }.
  function tramos(num, den, signo) {
    const C = [...new Set([...num, ...den].map(k => k.r))].sort((p, q) => p - q);
    const out = [];
    for (let i = 0; i <= C.length; i++) {
      const a = i ? C[i - 1] : null, b = i < C.length ? C[i] : null;
      const mid = a === null ? (b === null ? 0 : b - 1) : b === null ? a + 1 : (a + b) / 2;
      out.push({ a, b, mas: valor(num, den, signo, mid) > 0 });
    }
    return out;
  }
  // Factor (x − r)^m como partes, con x en su color.
  const factor = ({ r, m }) => {
    const base = r === 0 ? [x] : ['(', x, ` ${r > 0 ? '−' : '+'} ${f(Math.abs(r))})`];
    return m > 1 ? (r === 0 ? [{ sup: [x, String(m)] }] : [...base.slice(0, -1), ` ${r > 0 ? '−' : '+'} ${f(Math.abs(r))}`, { sup: [')', String(m)] }]) : base;
  };
  const producto = (l, signo = 1) => [signo < 0 ? '−' : '', ...l.flatMap(factor)];
  // La recta con los signos de cada tramo (fila 1), los puntos críticos (fila 0) y, si se pide, la solución (fila 2).
  function rectaSignos(num, den, signo, rel, o = {}) {
    const C = [...new Set([...num, ...den].map(k => k.r))];
    const lo = Math.min(...C) - 2, hi = Math.max(...C) + 2;
    const sol = rel ? resolver(num, den, signo, rel) : [];
    const els = [
      ...tramos(num, den, signo).map(t => ({ tipo: 'intervalo', a: t.a, b: t.b, ca: false, cb: false, color: t.mas ? 'i' : 'h', rotulo: t.mas ? '+' : '−', fila: 1, desde: o.signosDesde })),
      ...C.map(c => (den.some(k => k.r === c) ? { tipo: 'punto', x: c, color: 'h', abierto: true, rotulo: o.rotular ? 'no entra' : undefined, fila: 0 } : { tipo: 'punto', x: c, fila: 0 })),
      ...(o.solucion ? sol.map((I, k) => (I.a !== null && I.a === I.b ? { tipo: 'punto', x: I.a, color: 'd', fila: 2, rotulo: k ? '' : 'solución', desde: o.solucionDesde }
        : { tipo: 'intervalo', a: I.a, b: I.b, ca: I.ca, cb: I.cb, color: 'd', fila: 2, rotulo: k ? '' : 'solución', desde: o.solucionDesde })) : []),
      ...(o.extra || []),
    ];
    return { min: lo, max: hi, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 2, elementos: els, alt: o.alt || `Signos por tramos con puntos críticos en ${C.sort((p, q) => p - q).join(', ')}${o.solucion ? `; solución ${conjunto(sol)}` : ''}` };
  }

  // ---------- Idea 1: un negativo voltea el sentido (lineales) ----------
  // Cambia: el coeficiente a · Permanece: el lado derecho 6 · Progresa: el tramo solución que salta de lado
  // · Se reserva: la división entre −2 · Debe verse: con a < 0 el sentido se invierte, y un valor de prueba lo confirma.
  const lineales = {
    id: 'lineales',
    titulo: 'Un negativo voltea el sentido',
    temas: ['Inecuaciones lineales'],
    pieza: 'recta',
    juega: {
      consigna: 'Resuelve a·x ≤ 6 para distintos valores de a. En verde, los x que la cumplen. Fíjate hacia dónde apunta el tramo.',
      voz: 'Prueba a positivo, negativo y cero.',
      controles: [{ id: 'a', etiqueta: 'a', color: 'c-i', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0 }],
      dibujo: val => {
        const sol = val.a === 0 ? [{ a: null, b: null }] : val.a > 0 ? [{ a: null, b: 6 / val.a, cb: true }] : [{ a: 6 / val.a, ca: true, b: null }];
        return { datos: { min: -8, max: 8, paso: 1, cada: 2, decimales: 0, variable: 'x', color: 'o', filas: 1, elementos: sol.map(I => ({ tipo: 'intervalo', ...I, color: 'd', fila: 1, rotulo: 'cumplen' })), alt: `Solución de ${val.a}x ≤ 6` }, estado: {} };
      },
      lectura: val => [`${f(val.a)}`, x, ' ≤ 6 → ', ...(val.a === 0 ? ['todo ', x, ' (0 ≤ 6)'] : [x, ` ${val.a > 0 ? '≤' : '≥'} ${fr(6, val.a)}`])],
      minimo: 3,
    },
    predice: {
      pregunta: ['En −2', x, ' + 3 > 11 ya se restó 3 a ambos lados: −2', x, ' > 8. ¿Qué paso sigue?'],
      opciones: [
        { id: 'c', texto: [x, ' < −4'], correcta: true },
        { id: 'no-voltea', texto: [x, ' > −4'], error: 'AL20', siFuera: 'Dividir entre −2 está bien; al ser negativo, el sentido se invierte. Con x = 0: 0 > 8 es falso.' },
        { id: 'signo', texto: [x, ' > 4'], error: 'TAL-SIGNO-DIV', siFuera: '8 entre −2 da −4, no 4. Y además el sentido se invierte.' },
        { id: 'ambos', texto: [x, ' < 4'], error: 'TAL-SIGNO-DIV', siFuera: 'El sentido sí se invierte, pero 8 entre −2 da −4.' },
      ],
      dibujo: { datos: { min: -8, max: 4, paso: 1, cada: 2, decimales: 0, variable: 'x', color: 'o', filas: 1, elementos: [], alt: 'Recta de x sin marcar' }, estado: {} },
      revelar: { datos: { min: -8, max: 4, paso: 1, cada: 2, decimales: 0, variable: 'x', color: 'o', filas: 2, elementos: [
        { tipo: 'intervalo', a: null, b: -4, cb: false, color: 'd', fila: 1, rotulo: 'x < −4' },
        { tipo: 'punto', x: -5, color: 'd', fila: 2, rotulo: '−5: 13 > 11 ✓' }, { tipo: 'punto', x: 0, color: 'h', abierto: true, fila: 2, rotulo: '0: 3 > 11 ✗' },
      ], alt: 'Solución x < −4; x = −5 cumple y x = 0 no' }, estado: {} },
      coincide: 'Coincide: con x = −5, −2(−5) + 3 = 13, que es mayor que 11.',
    },
    mira: {
      datos: { min: -8, max: 4, paso: 1, cada: 2, decimales: 0, variable: 'x', color: 'o', filas: 2, elementos: [
        { tipo: 'punto', x: -4, color: 'o', abierto: true, fila: 0, desde: 2 },
        { tipo: 'intervalo', a: null, b: -4, cb: false, color: 'd', fila: 1, rotulo: 'x < −4', desde: 2 },
        { tipo: 'punto', x: -5, color: 'd', fila: 2, rotulo: '13 > 11 ✓', desde: 3 },
        { tipo: 'punto', x: 0, color: 'h', abierto: true, fila: 2, rotulo: '3 > 11 ✗', desde: 4 },
      ], alt: 'Solución de −2x + 3 > 11: x < −4, comprobada con x = −5 y x = 0' },
      voz: 'Creo que el paso delicado es dividir. Lo comprobamos con valores.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Restar 3 a ambos lados no cambia el sentido.', ecuacion: ['−2', x, ' + 3 > 11  ⇒  −2', x, ' > 8'] },
        { estado: { corte: 2 }, texto: 'Dividir entre −2, que es negativo, invierte el sentido.', ecuacion: [x, ' < ', { frac: ['8', '−2'] }, ' = −4'] },
        { estado: { corte: 3 }, texto: 'Comprobamos con un valor del tramo: x = −5 cumple.', ecuacion: ['−2(−5) + 3 = 13 > 11'] },
        { estado: { corte: 4 }, texto: 'Y uno de fuera, x = 0, no cumple: el tramo está bien.', ecuacion: ['−2(0) + 3 = 3 ≯ 11'] },
      ],
    },
    regla: {
      texto: 'Una inecuación describe un conjunto. Sumar o restar lo conserva; multiplicar o dividir por un positivo, también. Por un negativo, el sentido se invierte.',
      ecuacion: ['−2', x, ' > 8  ⇒  ', x, ' < −4'],
      condicion: 'el número por el que se multiplica tiene signo conocido. Una frontera con ≤ o ≥ entra; con < o >, no.',
    },
    ahoraTu: {
      pieza: 'recta',
      generar(s) {
        const r = azar(s);
        const a = r.uno([-5, -4, -3, -2, 2, 3, 4, 5]) * (s % 3 === 0 ? 1 : -1) * (r() < 0.5 ? 1 : -1), b = r.ent(-6, 6), k = r.ent(-4, 4), c = b + a * k;
        const rel = r.uno(['<', '>', '≤', '≥']);
        const vuelta = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
        const rf = a > 0 ? rel : vuelta[rel];
        const iv = (rr, v) => (rr === '<' || rr === '≤' ? `(−∞, ${f(v)}${rr === '≤' ? ']' : ')'}` : `${rr === '≥' ? '[' : '('}${f(v)}, +∞)`);
        const exp = [a === 1 ? '' : a === -1 ? '−' : f(a), x, b ? ` ${b > 0 ? '+' : '−'} ${f(Math.abs(b))}` : ''];
        return {
          pregunta: ['Resuelve ', ...exp, ` ${rel} ${f(c)}.`],
          opciones: distintas([
            { id: 'c', texto: iv(rf, k), correcta: true },
            { id: 'voltea', texto: iv(vuelta[rf], k), error: a < 0 ? 'AL20' : 'TAL-VOLTEA-POSITIVO', siFuera: a < 0 ? `Al dividir entre ${f(a)}, negativo, el sentido se invierte.` : `Dividir entre ${f(a)}, positivo, no invierte el sentido.` },
            { id: 'borde', texto: iv(ESTRICTA[rf], k), error: 'NR4', siFuera: `El ${f(k)} ${rel === '≤' || rel === '≥' ? 'entra: la inecuación lo permite con el igual' : 'no entra: la desigualdad es estricta'}.` },
            { id: 'signo', texto: iv(rf, -k), error: 'TAL-SIGNO-DIV', siFuera: `La frontera es (${f(c)} ${b < 0 ? '+' : '−'} ${f(Math.abs(b))}) / ${a < 0 ? `(${f(a)})` : f(a)} = ${f(k)}.` },
          ]),
          solucion: { texto: `${b ? `Se ${b > 0 ? 'resta' : 'suma'} ${f(Math.abs(b))} y se` : 'Se'} divide entre ${f(a)}${a < 0 ? ', invirtiendo el sentido' : ''}.`, ecuacion: [x, ` ${rf} ${f(k)}`], dibujo: { datos: { min: k - 6, max: k + 6, paso: 1, cada: 2, decimales: 0, variable: 'x', color: 'o', filas: 1, elementos: [{ tipo: 'intervalo', a: rf === '<' || rf === '≤' ? null : k, b: rf === '<' || rf === '≤' ? k : null, ca: rf === '≥', cb: rf === '≤', color: 'd', fila: 1, rotulo: 'solución' }], alt: `Solución x ${rf} ${f(k)}` }, estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: la parábola decide los signos (cuadráticas) ----------
  // Cambia: las raíces r₁ y r₂ y el sentido · Permanece: la parábola abre hacia arriba · Progresa: el tramo del eje
  // donde la curva queda bajo o sobre el eje · Se reserva: x² < 9, con la raíz negativa · Debe verse: entre raíces, negativa.
  const ejesParabola = (r1, r2, rel, o = {}) => {
    const g = v => (v - r1) * (v - r2), pts = [];
    for (let k = 0; k <= 80; k++) { const v = -5 + k * 10 / 80, w = g(v); pts.push(w > o.ymax + 2 || w < -12 ? null : [v, w]); }
    const sol = rel ? resolver([{ r: r1, m: 1 }, { r: r2, m: 1 }], [], 1, rel) : [];
    const seg = sol.flatMap(I => [[I.a === null ? -5 : I.a, 0], [I.b === null ? 5 : I.b, 0], null]);
    const dentro = [];
    for (let k = 0; k <= 20; k++) { const v = r1 + (r2 - r1) * k / 20; dentro.push([v, g(v)]); }
    return {
      x: { min: -5, max: 5, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: -12, max: o.ymax || 12, paso: 4, nombre: 'y', decimales: 0 },
      curvas: [{ puntos: pts, color: 'i', rotulo: o.rotulo }, ...(rel ? [{ puntos: seg, color: 'd', desde: o.solDesde }] : [])],
      areas: o.area ? [{ puntos: dentro, color: 'h', desde: o.areaDesde }] : [],
      puntos: [{ x: r1, y: 0, color: 'o', rotulo: f(r1), desde: o.raicesDesde }, { x: r2, y: 0, color: 'o', rotulo: f(r2), desde: o.raicesDesde }],
      alt: o.alt || `Parábola con raíces ${f(r1)} y ${f(r2)}${rel ? `; solución de ${rel} 0: ${conjunto(sol)}` : ''}`,
    };
  };
  const cuadraticas = {
    id: 'cuadraticas',
    titulo: 'La parábola decide los signos',
    temas: ['Inecuaciones cuadráticas'],
    pieza: 'ejes',
    juega: {
      consigna: 'La curva es y = (x − r₁)(x − r₂). Mueve las raíces y elige el sentido. En verde, sobre el eje, los x que cumplen.',
      voz: 'Mira dónde la curva queda debajo del eje.',
      controles: [
        { id: 'r1', etiqueta: 'r₁', color: 'c-o', min: -2, max: 0, paso: 1, inicio: -1, decimales: 0 },
        { id: 'r2', etiqueta: 'r₂', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'rel', etiqueta: 'Sentido', opciones: [{ valor: '<', texto: '< 0' }, { valor: '>', texto: '> 0' }] },
      ],
      dibujo: val => ({ datos: ejesParabola(val.r1, val.r2, val.rel, { ymax: 12 }), estado: {} }),
      lectura: val => [...producto([{ r: val.r1, m: 1 }, { r: val.r2, m: 1 }]), ` ${val.rel} 0 → ${conjunto(resolver([{ r: val.r1, m: 1 }, { r: val.r2, m: 1 }], [], 1, val.rel))}`],
      minimo: 4,
    },
    predice: {
      pregunta: ['¿Qué valores de ', x, ' cumplen ', { sup: [x, '2'] }, ' < 9?'],
      opciones: [
        { id: 'c', texto: '(−3, 3)', correcta: true },
        { id: 'una', texto: [x, ' < 3'], error: 'AL19', siFuera: 'x < 3 sería cierto si fuera lineal. Con x = −4: 16 < 9 es falso.' },
        { id: 'fuera', texto: '(−∞, −3) ∪ (3, +∞)', error: 'TAL-EXTERIOR', siFuera: 'Ahí x² es mayor que 9. Menor que 9 es entre las raíces.' },
        { id: 'pm', texto: '(−∞, 3)', error: 'AL19', siFuera: 'Ese tramo incluye x = −5, y (−5)² = 25 no es menor que 9.' },
      ],
      dibujo: { datos: { x: { min: -5, max: 5, paso: 1, nombre: 'x', decimales: 0, color: 'o' }, y: { min: -12, max: 12, paso: 4, nombre: 'y', decimales: 0 }, alt: 'Plano de x e y, todavía sin curva' }, estado: {} },
      revelar: { datos: ejesParabola(-3, 3, '<', { area: true, ymax: 12, rotulo: 'y = x² − 9' }), estado: {} },
      coincide: 'Coincide: x² − 9 queda bajo el eje solo entre −3 y 3.',
    },
    mira: {
      datos: ejesParabola(-3, 3, '<', { area: true, ymax: 12, rotulo: 'y = x² − 9', raicesDesde: 1, areaDesde: 2, solDesde: 3 }),
      voz: 'Creo que hay dos raíces. Busquémoslas antes de decidir.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se pasa todo a un lado y se buscan las raíces.', ecuacion: [{ sup: [x, '2'] }, ' − 9 = (', x, ' + 3)(', x, ' − 3) = 0'] },
        { estado: { corte: 2 }, texto: 'Entre −3 y 3, la parábola queda bajo el eje: negativa.', ecuacion: ['con ', x, ' = 0: 0 − 9 < 0'] },
        { estado: { corte: 3 }, texto: 'Fuera de las raíces queda sobre el eje. Pide < 0: el tramo interior.', ecuacion: [{ sup: [x, '2'] }, ' < 9  ⇔  −3 < ', x, ' < 3'] },
      ],
    },
    regla: {
      texto: 'Si a > 0 y hay dos raíces r₁ < r₂, ax² + bx + c es negativo entre las raíces y positivo fuera de ellas.',
      ecuacion: ['(', x, ' − r₁)(', x, ' − r₂) < 0  ⇔  r₁ < ', x, ' < r₂'],
      condicion: 'si a < 0, los signos se invierten. Si no hay raíces reales, el signo es el de a en toda la recta.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 5 === 4) {
          const k = r.ent(1, 9), rel = r.uno(['<', '>', '≤', '≥']), todo = rel === '>' || rel === '≥';
          return {
            pregunta: ['Resuelve ', { sup: [x, '2'] }, ` + ${k} ${rel} 0.`],
            opciones: [
              { id: 'c', texto: todo ? 'ℝ' : '∅', correcta: true },
              { id: 'otro', texto: todo ? '∅' : 'ℝ', error: 'TAL-SIN-RAICES', siFuera: `${todo ? '∅' : 'ℝ'} sería cierto si la expresión fuera ${todo ? 'negativa' : 'positiva'}; x² + ${k} ≥ ${k} siempre.` },
              { id: 'raiz', texto: `(−${k}, ${k})`, error: 'TAL-RAIZ-FALSA', siFuera: `x² + ${k} no se anula en ningún real: no hay raíces que separen tramos.` },
            ],
            solucion: { texto: `x² + ${k} vale al menos ${k}: siempre es positivo.`, ecuacion: [{ sup: [x, '2'] }, ` + ${k} > 0 para todo `, x] },
          };
        }
        const r1 = r.ent(-5, 2), r2 = r1 + r.ent(1, 6), sg = s % 4 === 1 ? -1 : 1, rel = r.uno(['<', '>', '≤', '≥']);
        const S = (sg2, rl) => conjunto(resolver([{ r: r1, m: 1 }, { r: r2, m: 1 }], [], sg2, rl));
        const b = -(r1 + r2), c = r1 * r2;
        const poli = [sg < 0 ? '−' : '', { sup: [x, '2'] }, b ? ` ${(sg * b) > 0 ? '+' : '−'} ${Math.abs(b) === 1 ? '' : f(Math.abs(b))}` : '', b ? x : '', c ? ` ${(sg * c) > 0 ? '+' : '−'} ${f(Math.abs(c))}` : ''];
        return {
          pregunta: ['Resuelve ', ...poli, ` ${rel} 0.`],
          opciones: distintas([
            { id: 'c', texto: S(sg, rel), correcta: true },
            { id: 'signo', texto: S(sg, OPUESTA[rel]), error: 'TAL-EXTERIOR', siFuera: `Ese conjunto es donde la expresión cumple lo contrario. Prueba x = ${f((r1 + r2) / 2)} en la original.` },
            { id: 'borde', texto: S(sg, ESTRICTA[rel]), error: 'NR4', siFuera: `Las raíces ${rel === '≤' || rel === '≥' ? 'entran: hacen la expresión 0' : 'no entran: la desigualdad es estricta'}.` },
            { id: 'lineal', texto: `(−∞, ${f(r2)})`, error: 'AL19', siFuera: `Eso trata la cuadrática como lineal. Las raíces son ${f(r1)} y ${f(r2)}: hay tres tramos.` },
          ]),
          solucion: { texto: `Raíces ${f(r1)} y ${f(r2)}; ${sg > 0 ? 'abre hacia arriba' : 'abre hacia abajo'}: se mira el signo en cada tramo.`, ecuacion: [...producto([{ r: r1, m: 1 }, { r: r2, m: 1 }], sg), ` ${rel} 0`] },
        };
      },
    },
  };

  // ---------- Idea 3: cada raíz cambia el signo… si es impar ----------
  // Cambia: el punto de prueba t · Permanece: los factores y sus raíces · Progresa: los tramos con su signo
  // · Se reserva: la raíz doble, que no cambia el signo · Debe verse: el signo es constante entre puntos críticos.
  const P3 = [{ r: -2, m: 1 }, { r: 1, m: 1 }, { r: 3, m: 1 }];
  const P3doble = [{ r: -2, m: 1 }, { r: 1, m: 2 }, { r: 3, m: 1 }];
  const sgn = v => (v > 0 ? '+' : v < 0 ? '−' : '0');
  const criticos = {
    id: 'puntos-criticos',
    titulo: 'Raíz impar cambia, raíz par no',
    temas: ['Método de los puntos críticos', 'Inecuaciones de grado superior'],
    pieza: 'recta',
    juega: {
      consigna: 'P(x) = (x + 2)(x − 1)(x − 3). Mueve el punto de prueba t y mira el signo de cada factor y del producto.',
      voz: 'Mira si el signo cambia dentro de un mismo tramo.',
      controles: [{ id: 't', etiqueta: 't', color: 'c-o', min: -4, max: 5, paso: 0.5, inicio: 4, decimales: 1 }],
      dibujo: val => {
        const tr = tramos(P3, [], 1).find(T => (T.a === null || val.t > T.a) && (T.b === null || val.t < T.b));
        const extra = [{ tipo: 'punto', x: val.t, color: 'o', fila: 0, rotulo: 't' }];
        const d = rectaSignos(P3, [], 1, null, { extra });
        d.elementos = d.elementos.filter(e => e.fila !== 1 || (tr && e.a === tr.a && e.b === tr.b));
        d.alt = `Puntos críticos −2, 1 y 3; en t = ${f(val.t, 1)} el producto es ${sgn(valor(P3, [], 1, val.t))}`;
        return { datos: d, estado: {} };
      },
      lectura: val => { const t = val.t; return [`En t = ${f(t, 1)}: (${sgn(t + 2)})(${sgn(t - 1)})(${sgn(t - 3)}) → P ${sgn(valor(P3, [], 1, t))}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: ['Si el factor (', x, ' − 1) se eleva al cuadrado, P(', x, ') = (', x, ' + 2)(', x, ' − 1)²(', x, ' − 3). ¿Qué signos tiene P en (−2, 1) y en (1, 3)?'],
      opciones: (() => {
        const T = tramos(P3doble, [], 1), en = (u, v) => T.find(t => t.a === u && t.b === v).mas ? '+' : '−';
        const bien = `${en(-2, 1)} y ${en(1, 3)}`;
        const todos = ['− y −', '+ y −', '− y +', '+ y +'];
        const ERR = { '+ y −': ['TAL-ALTERNA', 'Eso alterna signos en cada raíz. La raíz doble 1 no cambia el signo.'], '− y +': ['TAL-ALTERNA', 'En (1, 3), (x − 3) es negativo y lo demás positivo: el producto es −.'], '+ y +': ['TAL-CUADRADO-POS', 'El cuadrado es positivo, pero (x − 3) es negativo en los dos tramos.'], '− y −': ['TAL-ALTERNA', 'Revisa el signo de cada factor con un valor de prueba.'] };
        return [{ id: 'c', texto: bien, correcta: true }, ...todos.filter(t => t !== bien).map((t, i) => ({ id: `m${i}`, texto: t, error: ERR[t][0], siFuera: ERR[t][1] }))];
      })(),
      dibujo: { datos: rectaSignos(P3doble, [], 1, null, { signosDesde: 1 }), estado: { corte: 0 } },
      revelar: { datos: rectaSignos(P3doble, [], 1, null), estado: {} },
      coincide: 'Coincide: al cruzar x = 1 el factor al cuadrado no cambia de signo.',
    },
    mira: {
      datos: rectaSignos(P3doble, [], 1, '≤', { solucion: true, signosDesde: 2, solucionDesde: 4 }),
      voz: 'Yo había alternado signos sin mirar el exponente. Abrámoslo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Puntos críticos: los ceros de cada factor, −2, 1 y 3.', ecuacion: ['(', x, ' + 2)(', x, ' − 1)²(', x, ' − 3) ≤ 0'] },
        { estado: { corte: 2 }, texto: 'A la derecha de 3 todos los factores son positivos: +.', ecuacion: [`con ${x.t} = 4: (+)(+)(+) = +`] },
        { estado: { corte: 3 }, texto: 'Cruzar 3 (impar) cambia el signo; cruzar 1 (par), no.', ecuacion: ['(1, 3): −   ·   (−2, 1): −'] },
        { estado: { corte: 4 }, texto: 'Pide ≤ 0: los tramos negativos y los ceros.', ecuacion: [`${conjunto(resolver(P3doble, [], 1, '≤'))}`] },
      ],
    },
    regla: {
      texto: 'Los ceros de los factores parten la recta en tramos de signo constante. Al cruzar una raíz de multiplicidad impar el signo cambia; con multiplicidad par, no.',
      ecuacion: ['(', x, ' − 1)² ≥ 0 a los dos lados de 1'],
      condicion: 'la expresión está factorizada en reales y se conoce el signo del coeficiente principal.',
    },
    ahoraTu: {
      pieza: 'recta',
      generar(s) {
        const r = azar(s);
        const rs = r.mezclar([-4, -3, -2, -1, 0, 1, 2, 3, 4]).slice(0, 3).sort((p, q) => p - q);
        const ms = rs.map(() => 1); ms[r.ent(0, 2)] = s % 3 === 0 ? 1 : r.uno([2, 3]);
        const num = rs.map((v, i) => ({ r: v, m: ms[i] })), rel = r.uno(['<', '>', '≤', '≥']);
        const S = (n, rl) => conjunto(resolver(n, [], 1, rl));
        const simple = num.map(k => ({ r: k.r, m: 1 }));
        return {
          pregunta: ['Resuelve ', ...producto(num), ` ${rel} 0.`],
          dibujo: { datos: rectaSignos(num, [], 1, null, { signosDesde: 1 }), estado: { corte: 0 } },
          opciones: distintas([
            { id: 'c', texto: S(num, rel), correcta: true },
            { id: 'alterna', texto: S(simple, rel), error: 'TAL-ALTERNA', siFuera: 'Eso alterna el signo en cada raíz. Una raíz con exponente par no lo cambia.' },
            { id: 'signo', texto: S(num, OPUESTA[rel]), error: 'TAL-SIGNO', siFuera: 'Ese conjunto es donde se cumple lo contrario. Prueba un valor de cada tramo.' },
            { id: 'borde', texto: S(num, ESTRICTA[rel]), error: 'NR4', siFuera: `Los ceros ${rel === '≤' || rel === '≥' ? 'entran: hacen el producto 0' : 'no entran: la desigualdad es estricta'}.` },
          ]),
          solucion: { texto: 'Signo a la derecha: +. Cambia en cada raíz impar; en la par, no.', ecuacion: [S(num, rel)], dibujo: { datos: rectaSignos(num, [], 1, rel, { solucion: true }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: el denominador nunca entra ----------
  // Cambia: el cero del numerador a y el del denominador b · Permanece: la forma (x − a)/(x − b) · Progresa: los
  // signos por tramos · Se reserva: el punto b, hueco, que nunca entra · Debe verse: b parte la recta pero no es solución.
  const fraccionarias = {
    id: 'fraccionarias',
    titulo: 'El denominador nunca entra',
    temas: ['Inecuaciones fraccionarias'],
    pieza: 'recta',
    juega: {
      consigna: 'Mira los signos de (x − a)/(x − b) por tramos. Mueve a, el cero de arriba, y b, el que anula el denominador.',
      voz: 'Fíjate qué punto queda hueco y en rojo.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-h', min: -3, max: 3, paso: 1, inicio: -1, decimales: 0 },
      ],
      dibujo: val => ({ datos: val.a === val.b
        ? { min: -5, max: 5, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 2, elementos: [{ tipo: 'intervalo', a: null, b: null, color: 'i', rotulo: '+ (vale 1)', fila: 1 }, { tipo: 'punto', x: val.b, color: 'h', abierto: true, fila: 0, rotulo: 'no entra' }], alt: 'La fracción vale 1 salvo en x = b, que no está en el dominio' }
        : rectaSignos([{ r: val.a, m: 1 }], [{ r: val.b, m: 1 }], 1, null, { rotular: true }), estado: {} }),
      lectura: val => ['Cero en ', x, ` = ${f(val.a)} · `, x, ` = ${f(val.b)} anula el denominador`],
      minimo: 4,
    },
    predice: {
      pregunta: ['¿Qué valores de ', x, ' cumplen ', { frac: [['(', x, ' − 1)'], ['(', x, ' + 2)']] }, ' ≥ 0?'],
      opciones: [
        { id: 'c', texto: '(−∞, −2) ∪ [1, +∞)', correcta: true },
        { id: 'den', texto: '(−∞, −2] ∪ [1, +∞)', error: 'TAL-DENOMINADOR', siFuera: 'Con x = −2 el denominador es 0: la fracción no existe ahí.' },
        { id: 'multiplica', texto: '[1, +∞)', error: 'AL21', siFuera: 'Eso multiplica por x + 2 como si fuera positivo. Con x = −3: −4/−1 = 4 ≥ 0.' },
        { id: 'dentro', texto: '(−2, 1]', error: 'TAL-SIGNO', siFuera: 'Ahí la fracción es negativa o cero: con x = 0 vale −1/2.' },
      ],
      dibujo: { datos: { min: -5, max: 4, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 2, elementos: [{ tipo: 'punto', x: -2, color: 'o', fila: 0 }, { tipo: 'punto', x: 1, color: 'o', fila: 0 }], alt: 'Recta con los puntos −2 y 1' }, estado: {} },
      revelar: { datos: rectaSignos([{ r: 1, m: 1 }], [{ r: -2, m: 1 }], 1, '≥', { solucion: true, rotular: true }), estado: {} },
      coincide: 'Coincide: −2 parte la recta, pero no entra; 1 sí, porque ahí la fracción vale 0.',
    },
    mira: {
      datos: rectaSignos([{ r: 1, m: 1 }], [{ r: -2, m: 1 }], 1, '≥', { solucion: true, signosDesde: 2, solucionDesde: 4, rotular: true }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Puntos críticos: 1 anula el numerador; −2, el denominador.', ecuacion: [x, ' − 1 = 0   ·   ', x, ' + 2 = 0'] },
        { estado: { corte: 2 }, texto: 'Signos con un valor de prueba en cada tramo.', ecuacion: ['−3 → +   ·   0 → −   ·   2 → +'] },
        { estado: { corte: 3 }, texto: 'En x = 1 la fracción vale 0: con ≥, entra.', ecuacion: [{ frac: ['0', '3'] }, ' = 0'] },
        { estado: { corte: 4 }, texto: 'En x = −2 no existe: nunca entra.', ecuacion: ['(−∞, −2) ∪ [1, +∞)'] },
      ],
    },
    regla: {
      texto: 'En un cociente, los ceros del numerador y del denominador parten la recta. Los del numerador entran si hay igual; los del denominador, nunca.',
      ecuacion: [{ frac: [['N(', x, ')'], ['D(', x, ')']] }, ' ≥ 0  con  D(', x, ') ≠ 0'],
      condicion: 'no se multiplica por el denominador sin conocer su signo, y simplificar un factor no devuelve el punto excluido.',
      voz: 'Ese valor queda fuera del dominio. Revisemos cuándo apareció.',
    },
    ahoraTu: {
      pieza: 'recta',
      generar(s) {
        const r = azar(s);
        const vals = r.mezclar([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
        const dos = s % 2 === 1;
        const num = dos ? [{ r: Math.min(vals[0], vals[1]), m: 1 }, { r: Math.max(vals[0], vals[1]), m: 1 }] : [{ r: vals[0], m: 1 }];
        const den = [{ r: vals[2], m: 1 }], rel = r.uno(['<', '>', '≤', '≥']);
        const S = (n, d, rl) => conjunto(resolver(n, d, 1, rl));
        return {
          pregunta: ['Resuelve ', { frac: [producto(num), producto(den)] }, ` ${rel} 0.`],
          opciones: distintas([
            { id: 'c', texto: S(num, den, rel), correcta: true },
            { id: 'den', texto: S([...num, ...den], [], rel), error: 'TAL-DENOMINADOR', siFuera: `Ese conjunto incluye x = ${f(vals[2])}, donde el denominador es 0.` },
            { id: 'multiplica', texto: S(num, [], rel), error: 'AL21', siFuera: 'Eso quita el denominador como si fuera siempre positivo. Su signo cambia en la recta.' },
            { id: 'signo', texto: S(num, den, OPUESTA[rel]), error: 'TAL-SIGNO', siFuera: 'Ese conjunto es donde se cumple lo contrario. Prueba un valor de cada tramo.' },
          ]).slice(0, 4),
          solucion: { texto: `Tramos por los ceros; x = ${f(vals[2])} anula el denominador y no entra.`, ecuacion: [S(num, den, rel)], dibujo: { datos: rectaSignos(num, den, 1, rel, { solucion: true, rotular: true }), estado: {} } },
        };
      },
    },
  };

  return {
    unidad: 'algebra.inecuaciones',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Los signos «menor que» y «mayor que» aparecen impresos en la Praxis de 1631, publicada después de la muerte de Thomas Harriot; los historiadores distinguen esa edición de sus manuscritos. La notación corta permitió escribir comparaciones dentro del álgebra. Aquí se trata de algo más que leer signos: transformar una condición sin perder ni agregar valores, y saber cuándo se invierte el orden.',
      pregunta: '¿Qué operación podría dar vuelta una desigualdad?',
      fuente: { titulo: 'O’Connor y Robertson, Thomas Harriot — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Harriot/' },
    },
    ideas: [lineales, cuadraticas, criticos, fraccionarias],
  };
});
