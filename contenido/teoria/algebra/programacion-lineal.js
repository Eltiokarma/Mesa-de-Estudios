/*
 * Teoría de «Programación lineal» (algebra.programacion-lineal). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 17), expediente teoria-152-unidades (Álgebra:
 * «en un polígono factible cerrado, acotado y no vacío hay al menos un óptimo en un vértice; puede haber un lado
 * completo óptimo; los casos inviables o no acotados se analizan») e historia-ecuaciones (pp. 57–68).
 * Errores: los PL de plantillas/programacion-lineal/ (hipótesis) y TAL-* nuevos.
 * Colores (regla 4): x naranja (c-o), y turquesa (c-i), la región y lo que cumple verde (c-d), la recta de nivel
 * y lo que no cumple rojo (c-h).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · ver cada restricción como un semiplano y el óptimo como el último punto que toca una recta que se desliza.
 * Persona y condiciones · 5.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · grafica una región factible, halla sus vértices y decide el óptimo o por qué no lo hay.
 * Orden de atención · 1.º la región verde · 2.º la recta roja que se mueve · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué basta mirar los vértices, y cuándo eso no basta (lado óptimo, no acotada, vacía).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const X = { v: 'c-o', t: 'x' }, Y = { v: 'c-i', t: 'y' }, Z = { v: 'c-h', t: 'Z' };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r.mezclar = l => { const x = l.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  const lim = v => { const r = Math.round(v * 1e6) / 1e6; return Object.is(r, -0) ? 0 : r; };
  const pt = ([x, y]) => `(${f(lim(x))}; ${f(lim(y))})`;

  // ---------- Geometría: semiplanos ax + by ≤ c recortando un polígono (Sutherland–Hodgman) ----------
  const caja = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  function recortar(poli, [a, b, c]) {
    const out = [], dentro = p => a * p[0] + b * p[1] <= c + 1e-9;
    for (let i = 0; i < poli.length; i++) {
      const P = poli[i], Q = poli[(i + 1) % poli.length], dp = dentro(P), dq = dentro(Q);
      if (dp) out.push(P);
      if (dp !== dq) {
        const fp = a * P[0] + b * P[1] - c, fq = a * Q[0] + b * Q[1] - c, t = fp / (fp - fq);
        out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]);
      }
    }
    // Sin vértices repetidos.
    return out.filter((p, i) => { const q = out[(i + 1) % out.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-9; }).map(p => p.map(lim));
  }
  const region = (restr, ventana) => restr.reduce((p, r) => (p.length ? recortar(p, r) : p), ventana);
  // Tramo de la recta ax + by = c dentro de la ventana.
  function tramo([a, b, c], [x0, y0, x1, y1]) {
    const ps = [];
    if (Math.abs(b) > 1e-9) for (const x of [x0, x1]) { const y = (c - a * x) / b; if (y >= y0 - 1e-9 && y <= y1 + 1e-9) ps.push([x, y]); }
    if (Math.abs(a) > 1e-9) for (const y of [y0, y1]) { const x = (c - b * y) / a; if (x >= x0 - 1e-9 && x <= x1 + 1e-9) ps.push([x, y]); }
    const u = ps.filter((p, i) => ps.findIndex(q => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-9) === i);
    return u.length >= 2 ? [u[0], u[1]].map(p => p.map(lim)) : null;
  }
  // Texto de ax + by ≤ c con x e y en su color.
  function desig([a, b, c], signo = '≤') {
    const t = [];
    const termino = (k, v, primero) => {
      if (!k) return;
      const s = k < 0 ? (primero ? '−' : ' − ') : primero ? '' : ' + ';
      t.push(`${s}${Math.abs(k) === 1 ? '' : f(Math.abs(k))}`, v);
    };
    termino(a, X, true); termino(b, Y, !a);
    t.push(` ${signo} ${f(c)}`);
    return t;
  }
  const textoDesig = (r, signo) => Kit.plano(desig(r, signo));
  // Una restricción guardada como ax + by ≤ c, escrita como se lee (−x − y ≤ −3 se escribe x + y ≥ 3).
  const txtR = ([a, b, c]) => (a <= 0 && b <= 0 && (a || b) ? textoDesig([-a, -b, -c], '≥') : textoDesig([a, b, c], '≤'));
  // Ejes con la misma escala en x y en y (254 px de ancho y 170 de alto en la pieza): 1,5 unidades de x por cada de y.
  const EJ = (x0, x1, y0, y1) => ({ x: { min: x0, max: x1, paso: 1, nombre: 'x', decimales: 0, color: 'o' }, y: { min: y0, max: y1, paso: 1, nombre: 'y', decimales: 0, color: 'i' } });
  const Q1 = [0, 0, 9, 6];                                 // primer cuadrante: x de 0 a 9, y de 0 a 6
  const ejQ1 = () => EJ(0, 9, 0, 6);
  const vertices = poli => poli.map(p => p.map(lim));

  // ---------- Idea 1: una desigualdad es un semiplano ----------
  // Cambia: a, b, c y el signo · Permanece: la ventana y el punto de prueba (0; 0) · Progresa: el lado sombreado ·
  // Se reserva: el caso con b negativo, donde «≥» no es «arriba» · Debe verse: el punto de prueba decide el lado.
  const V1 = [-6, -4, 6, 4];
  const semi = (r, signo, o = {}) => {
    const [a, b, c] = r, mayor = signo === '≥' || signo === '>';
    const R = mayor ? [-a, -b, -c] : r;
    const poli = region([R], caja(...V1)), borde = tramo(r, V1);
    const cumple0 = mayor ? 0 >= c : 0 <= c;
    return Object.assign(EJ(-6, 6, -4, 4), {
      areas: poli.length > 2 ? [{ puntos: poli, color: 'd', cerrada: true, desde: o.desdeArea }] : [],
      curvas: borde ? [{ puntos: borde, color: 'd', discontinua: signo === '<' || signo === '>', desde: o.desdeBorde }] : [],
      puntos: [{ x: 0, y: 0, color: cumple0 ? 'd' : 'h', abierto: !cumple0, rotulo: o.sinRotulo ? undefined : cumple0 ? 'cumple' : 'no cumple', desde: o.desdePunto }],
      alt: `Semiplano ${textoDesig(r, signo)}; el origen ${cumple0 ? 'cumple' : 'no cumple'}`,
    });
  };
  const semiplano = {
    id: 'semiplano',
    titulo: 'Una desigualdad, medio plano',
    temas: ['Inecuaciones con dos variables'],
    pieza: 'ejes',
    juega: {
      consigna: 'Arma ax + by con su signo y su número c. La zona verde cumple la desigualdad. El punto (0; 0) dice si cumple o no.',
      voz: 'Prueba b negativo con el signo ≥.',
      controles: [
        { id: 'a', etiqueta: 'a', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
        { id: 'c', etiqueta: 'c', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0 },
        { id: 's', etiqueta: 'Signo', opciones: ['≤', '<', '≥', '>'].map(t => ({ valor: t, texto: t })) },
      ],
      dibujo: val => ({ datos: (val.a || val.b) ? semi([val.a, val.b, val.c], val.s) : Object.assign(EJ(-6, 6, -4, 4), { alt: 'Sin recta: a y b valen 0' }), estado: {} }),
      lectura: val => {
        if (!val.a && !val.b) return ['Con a = b = 0 no hay recta'];
        const mayor = val.s === '≥' || val.s === '>', estricto = val.s === '<' || val.s === '>';
        const ok = (mayor ? (estricto ? 0 > val.c : 0 >= val.c) : (estricto ? 0 < val.c : 0 <= val.c));
        return [`(0; 0): 0 ${val.s} ${f(val.c)} es ${ok ? 'verdadero' : 'falso'}`];
      },
      minimo: 4,
    },
    predice: (() => {
      const r = [2, -1, 4];
      return {
        pregunta: ['¿Qué lado de la recta cumple ', ...desig(r, '≥'), '?'],
        opciones: [
          { id: 'c', texto: 'El de abajo, sin el origen', correcta: true },
          { id: 'arriba', texto: 'El de arriba, porque el signo es ≥', error: 'TAL-MAYOR-ARRIBA', siFuera: 'Sería cierto si y tuviera coeficiente positivo; aquí lleva −y.' },
          { id: 'origen', texto: 'El lado donde está el origen', error: 'PL1', siFuera: `Con (0; 0): 0 ≥ ${r[2]} es falso; el origen queda fuera.` },
          { id: 'recta', texto: 'Solo los puntos de la recta', error: 'PL12', siFuera: 'La recta es el borde; la desigualdad también acepta puntos fuera de ella.' },
        ],
        dibujo: { datos: Object.assign(EJ(-6, 6, -4, 4), { curvas: [{ puntos: tramo(r, V1), color: 'd' }], alt: 'La recta 2x − y = 4, sin sombrear' }), estado: {} },
        revelar: { datos: semi(r, '≥'), estado: {} },
        coincide: 'Coincide: 2x − y ≥ 4 equivale a y ≤ 2x − 4, debajo de la recta.',
      };
    })(),
    mira: (() => {
      const r = [2, -1, 4];
      return {
        datos: Object.assign(semi(r, '≥', { desdeBorde: 1, desdePunto: 2, desdeArea: 3 }), {
          puntos: [{ x: 2, y: 0, color: 'o', desde: 1 }, { x: 0, y: -4, color: 'i', rotulo: '(0; −4)', desde: 1 }, { x: 0, y: 0, color: 'h', abierto: true, rotulo: '0 ≥ 4: no', desde: 2 }],
        }),
        voz: 'Creo que un solo punto de prueba basta. Veamos.',
        pasos: [
          { estado: { corte: 1 }, texto: 'El borde es la recta 2x − y = 4, por (2; 0) y (0; −4).', ecuacion: ['2', X, ' − ', Y, ' = 4'] },
          { estado: { corte: 2 }, texto: 'Se prueba el origen: 2·0 − 0 ≥ 4 es falso.', ecuacion: ['0 ≥ 4  ✗'] },
          { estado: { corte: 3 }, texto: 'Cumple el otro lado. El borde entra porque el signo es ≥.', ecuacion: [...desig(r, '≥'), '  ⇔  ', Y, ' ≤ 2', X, ' − 4'] },
        ],
      };
    })(),
    regla: {
      texto: 'Una desigualdad lineal ax + by ≤ c es un semiplano. La recta ax + by = c es su borde, y un punto de prueba decide qué lado cumple.',
      ecuacion: ['a', X, ' + b', Y, ' ≤ c'],
      condicion: 'con ≤ o ≥ el borde entra (línea continua); con < o > no entra (línea discontinua).',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let a, b, c, signo, si, no, cumple;
        do {
          a = r.ent(-3, 3); b = r.ent(-3, 3); c = r.ent(-4, 6); signo = r.uno(['≤', '≥']);
          cumple = ([x, y]) => (signo === '≤' ? a * x + b * y <= c : a * x + b * y >= c);
          const cand = [];
          for (let k = 0; k < 60 && cand.length < 12; k++) { const q = [r.ent(-3, 4), r.ent(-3, 4)]; if (!cand.some(w => w[0] === q[0] && w[1] === q[1])) cand.push(q); }
          si = cand.filter(cumple); no = cand.filter(q => !cumple(q));
        } while (!a || !b || !si.length || no.length < 3);
        const buena = si[0], malas = no.slice(0, 3);
        const valor = ([x, y]) => a * x + b * y;
        const expr = textoDesig([a, b, c], '≤').split(' ≤ ')[0];
        return {
          pregunta: ['¿Cuál de estos puntos cumple ', ...desig([a, b, c], signo), '?'],
          opciones: distintas([
            { id: 'c', texto: pt(buena), correcta: true },
            ...malas.map((p, k) => ({ id: `m${k}`, texto: pt(p), error: Math.abs(valor(p) - c) <= Math.abs(a) + Math.abs(b) ? 'PL10' : 'PL1', siFuera: `Ahí ${expr} vale ${f(valor(p))}, y ${f(valor(p))} ${signo} ${f(c)} es falso.` })),
          ]),
          solucion: { texto: `Se reemplaza cada punto: ${pt(buena)} da ${f(valor(buena))}.`, ecuacion: [`${f(valor(buena))} ${signo} ${f(c)}  ✓`] },
        };
      },
    },
  };

  // ---------- Idea 2: la región factible es lo que cumple todo ----------
  // Cambia: qué restricciones están activas · Permanece: x ≥ 0 e y ≥ 0 · Progresa: el polígono que se recorta ·
  // Se reserva: la restricción que vacía la región · Debe verse: cada vértice es el cruce de dos bordes.
  const RESTR = { r1: [1, 1, 6], r2: [1, 0, 4], r3: [-1, 2, 6] };          // x + y ≤ 6 · x ≤ 4 · −x + 2y ≤ 6
  const NOMBRE = { r1: 'x + y ≤ 6', r2: 'x ≤ 4', r3: '−x + 2y ≤ 6' };
  const BASE = [[-1, 0, 0], [0, -1, 0]];                                      // x ≥ 0 · y ≥ 0
  const dibRegion = (lista, o = {}) => {
    const poli = region([...BASE, ...lista], caja(...Q1));
    return Object.assign(ejQ1(), {
      areas: poli.length > 2 ? [{ puntos: poli, color: 'd', cerrada: true, desde: o.desdeArea }] : [],
      curvas: lista.map((r, k) => ({ puntos: tramo(r, Q1), color: 'd', discontinua: true, desde: o.desdes ? o.desdes[k] : 0 })).filter(c => c.puntos),
      // Los cortes con el borde del dibujo no son vértices: la región sigue más allá.
      puntos: o.conVertices && poli.length > 2 ? poli.filter(p => p[0] < Q1[2] - 1e-9 && p[1] < Q1[3] - 1e-9).map(p => ({ x: p[0], y: p[1], color: 'd', rotulo: o.rotulos ? pt(p) : undefined, desde: o.desdeVertices })) : [],
      alt: poli.length > 2 ? `Región factible con vértices ${poli.map(pt).join(', ')}` : 'Sin región factible',
    });
  };
  const factible = {
    id: 'region-factible',
    titulo: 'Lo que cumple todo junto',
    temas: ['Sistemas de inecuaciones', 'Región factible'],
    pieza: 'ejes',
    juega: {
      consigna: 'Siempre x ≥ 0 e y ≥ 0. Activa o apaga las otras restricciones y mira cómo se recorta la región verde.',
      voz: 'Cuenta los vértices cada vez.',
      controles: Object.keys(RESTR).map(k => ({ id: k, etiqueta: NOMBRE[k], opciones: [{ valor: 'si', texto: 'activa' }, { valor: 'no', texto: 'apagada' }] })),
      dibujo: val => ({ datos: dibRegion(Object.keys(RESTR).filter(k => val[k] === 'si').map(k => RESTR[k]), { conVertices: true }), estado: {} }),
      lectura: val => {
        const lista = Object.keys(RESTR).filter(k => val[k] === 'si').map(k => RESTR[k]);
        const poli = region([...BASE, ...lista], caja(...Q1));
        const acotada = lista.length && poli.every(p => p[0] < Q1[2] - 1e-9 && p[1] < Q1[3] - 1e-9);
        return [acotada ? `Región cerrada con ${poli.length} vértices` : 'Región abierta, sin borde arriba'];
      },
      minimo: 3,
    },
    predice: (() => {
      const lista = [RESTR.r1, RESTR.r2], extra = [-1, -1, -8];       // se agrega x + y ≥ 8
      const vacia = region([...BASE, ...lista, extra], caja(...Q1)).length < 3;
      return {
        pregunta: ['Con x ≥ 0, y ≥ 0, x + y ≤ 6 y x ≤ 4 se agrega ', ...desig([1, 1, 8], '≥'), '. ¿Qué queda?'],
        opciones: [
          { id: 'c', texto: vacia ? 'Nada: ningún punto cumple todo' : 'Una región más chica', correcta: true },
          { id: 'franja', texto: 'La franja entre x + y = 6 y x + y = 8', error: 'TAL-UNION', siFuera: 'Esa franja cumple x + y ≥ 6, no x + y ≤ 6: falla una restricción.' },
          { id: 'ignora', texto: 'La misma región de antes', error: 'PL23', siFuera: 'Una restricción nueva también se cumple o no: ningún punto de antes llega a 8.' },
          { id: 'abierta', texto: 'Una región abierta hacia arriba', error: 'TAL-NO-ACOTADA', siFuera: 'Hacia arriba crece x + y, pero x + y ≤ 6 sigue activa.' },
        ],
        dibujo: { datos: dibRegion(lista), estado: {} },
        revelar: { datos: Object.assign(dibRegion(lista), { curvas: [...dibRegion(lista).curvas, { puntos: tramo([1, 1, 8], Q1), color: 'h' }], areas: [] }), estado: {} },
        coincide: 'Coincide: x + y no puede ser a la vez menor o igual que 6 y mayor o igual que 8.',
      };
    })(),
    mira: {
      datos: dibRegion([RESTR.r1, RESTR.r2, RESTR.r3], { desdes: [1, 2, 3], desdeArea: 4, conVertices: true, rotulos: true, desdeVertices: 5 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'x + y ≤ 6: todo lo que está debajo de esa recta.', ecuacion: desig(RESTR.r1) },
        { estado: { corte: 2 }, texto: 'x ≤ 4: a la izquierda de la vertical.', ecuacion: desig(RESTR.r2) },
        { estado: { corte: 3 }, texto: '−x + 2y ≤ 6: debajo de la recta que sube.', ecuacion: desig(RESTR.r3) },
        { estado: { corte: 4 }, texto: 'La región factible cumple las cinco: también x ≥ 0 e y ≥ 0.', ecuacion: ['intersección de los semiplanos'] },
        { estado: { corte: 5 }, texto: 'Cada vértice es el cruce de dos bordes.', ecuacion: [region([...BASE, RESTR.r1, RESTR.r2, RESTR.r3], caja(...Q1)).map(pt).join('  ')] },
      ],
    },
    regla: {
      texto: 'La región factible es la intersección de los semiplanos de todas las restricciones. Sus vértices son cruces de dos bordes. Puede ser cerrada, abierta o vacía.',
      ecuacion: ['factible = ', { sub: ['S', '1'] }, ' ∩ ', { sub: ['S', '2'] }, ' ∩ … ∩ ', { sub: ['S', 'n'] }],
      condicion: 'se incluyen las restricciones del contexto, como x ≥ 0 e y ≥ 0 cuando no hay cantidades negativas.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        for (let k = 0; k < 300; k++) {
          const p = r.ent(1, 3), q = r.ent(1, 3), c1 = r.ent(6, 12), m = r.ent(2, 6);
          const lista = [[p, q, c1], s % 2 ? [1, 0, m] : [0, 1, Math.min(m, 5)]];
          const poli = region([...BASE, ...lista], caja(...Q1));
          if (poli.length < 3 || poli.some(v => v[0] >= Q1[2] - 1e-9 || v[1] >= Q1[3] - 1e-9)) continue;
          const pide = s % 3;
          const nombre = lista.map(x => textoDesig(x, '≤')).join(', ');
          if (pide === 0) {
            const ents = []; for (let x = 0; x <= 9; x++) for (let y = 0; y <= 6; y++) ents.push([x, y]);
            const dentro = e => [...BASE, ...lista].every(([a, b, c]) => a * e[0] + b * e[1] <= c + 1e-9);
            const si = r.mezclar(ents.filter(e => dentro(e) && e[0] > 0 && e[1] > 0)), no = r.mezclar(ents.filter(e => !dentro(e)));
            if (!si.length || no.length < 3) continue;
            const falla = e => [...BASE, ...lista].find(([a, b, c]) => a * e[0] + b * e[1] > c + 1e-9);
            return {
              pregunta: [`Con x ≥ 0, y ≥ 0, ${nombre}: ¿qué punto está en la región factible?`],
              opciones: [{ id: 'c', texto: pt(si[0]), correcta: true }, ...no.slice(0, 3).map((e, i) => ({ id: `m${i}`, texto: pt(e), error: 'PL17', siFuera: `Ese punto no cumple ${textoDesig(falla(e), '≤').replace('−x ≤ 0', 'x ≥ 0').replace('−y ≤ 0', 'y ≥ 0')}.` }))],
              solucion: { texto: `${pt(si[0])} cumple todas las restricciones.`, ecuacion: ['factible'], dibujo: { datos: Object.assign(dibRegion(lista, { conVertices: true }), { puntos: [{ x: si[0][0], y: si[0][1], color: 'd', rotulo: pt(si[0]) }] }), estado: {} } },
            };
          }
          const nv = poli.length;
          if (pide === 1) {
            const v = r.uno(poli);
            const otros = r.mezclar([[v[0] + 1, v[1]], [v[0], v[1] + 1], [lim(v[1]), lim(v[0])], [lim(v[0] + 0.5), lim(v[1])]].filter(w => !poli.some(z => Math.hypot(z[0] - w[0], z[1] - w[1]) < 1e-9)));
            return {
              pregunta: [`Con x ≥ 0, y ≥ 0, ${nombre}: ¿cuál de estos puntos es un vértice de la región?`],
              opciones: distintas([{ id: 'c', texto: pt(v), correcta: true }, ...otros.slice(0, 3).map((w, i) => ({ id: `m${i}`, texto: pt(w), error: 'PL10', siFuera: 'Ese punto no es el cruce de dos bordes; resuelve el sistema de los dos.' }))]),
              solucion: { texto: `Los vértices son ${poli.map(pt).join(', ')}.`, ecuacion: [`${nv} vértices`], dibujo: { datos: dibRegion(lista, { conVertices: true }), estado: {} } },
            };
          }
          return {
            pregunta: [`Con x ≥ 0, y ≥ 0, ${nombre}: ¿cuántos vértices tiene la región factible?`],
            opciones: [3, 4, 5, 6].map(k => (k === nv ? { id: 'c', texto: f(k), correcta: true } : { id: `n${k}`, texto: f(k), error: k > nv ? 'TAL-VERTICE-EXTRA' : 'PL7', siFuera: k > nv ? 'Algún cruce de rectas cae fuera de la región: no es vértice.' : 'Falta contar los vértices sobre los ejes o el cruce de las dos rectas.' })),
            solucion: { texto: `Vértices: ${poli.map(pt).join(', ')}.`, ecuacion: [`${nv} vértices`], dibujo: { datos: dibRegion(lista, { conVertices: true }), estado: {} } },
          };
        }
        throw new Error('sin región');
      },
    },
  };

  // ---------- Idea 3: la recta de nivel sale por un vértice ----------
  // Cambia: el valor k de Z · Permanece: la región y la pendiente de las rectas de nivel · Progresa: la recta roja
  // que avanza · Se reserva: el último punto que toca · Debe verse: Z crece hacia afuera y se despide en un vértice.
  const LISTA3 = [[1, 1, 4], [1, 0, 2]];                                       // x + y ≤ 4 · x ≤ 2
  const P3 = region([...BASE, ...LISTA3], caja(...Q1));
  const Zf = (p, q) => ([x, y]) => lim(p * x + q * y);
  const W3 = [0, 0, 6.75, 4.5];                             // ventana ajustada a la región de la idea 3 (misma escala)
  const nivel = (p, q, k, o = {}, V = Q1) => {
    const t = tramo([p, q, k], V);
    return { puntos: t, color: 'h', rotulo: o.rotulo, en: t ? (([a, b]) => [lim(a[0] + 0.85 * (b[0] - a[0])), lim(a[1] + 0.85 * (b[1] - a[1]))])(t[0][1] >= t[1][1] ? [t[0], t[1]] : [t[1], t[0]]) : undefined, discontinua: o.discontinua, desde: o.desde, hasta: o.hasta };
  };
  const dib3 = (p, q, ks, o = {}) => Object.assign(EJ(0, 6.75, 0, 4.5), {
    areas: [{ puntos: P3, color: 'd', cerrada: true }],
    curvas: ks.map(k => nivel(p, q, k.k, k, W3)).filter(c => c.puntos),
    puntos: P3.map(v => ({ x: v[0], y: v[1], color: 'd', rotulo: o.rotulos ? `Z = ${f(Zf(p, q)(v))}` : undefined, desde: o.desdeV })),
    alt: `Región de vértices ${P3.map(pt).join(', ')} y rectas de nivel de Z = ${p}x + ${q}y`,
  });
  const nivelIdea = {
    id: 'recta-de-nivel',
    titulo: 'La recta de nivel se despide',
    temas: ['Función objetivo', 'Método gráfico de optimización'],
    pieza: 'ejes',
    juega: {
      consigna: 'Región: x + y ≤ 4 y x ≤ 2. La recta roja junta los puntos con 3x + 2y = k. Sube k: ¿cuándo deja de tocar la región?',
      voz: 'Las rectas de nivel no giran: solo se corren.',
      controles: [{ id: 'k', etiqueta: 'k', min: 0, max: 14, paso: 1, inicio: 3, decimales: 0, color: 'c-h' }],
      dibujo: val => ({ datos: dib3(3, 2, [{ k: val.k, rotulo: `Z = ${val.k}` }]), estado: {} }),
      lectura: val => {
        const zs = P3.map(Zf(3, 2)), max = Math.max(...zs);
        return [Z, ` = ${val.k}: `, val.k <= max ? 'toca la región' : 'ya no la toca'];
      },
      minimo: 4,
    },
    predice: (() => {
      const zs = P3.map(Zf(3, 2)), imax = zs.indexOf(Math.max(...zs));
      const v = P3[imax];
      const otros = P3.filter((_, i) => i !== imax && !(P3[i][0] === 0 && P3[i][1] === 0));
      return {
        pregunta: ['En esa región, ¿dónde es máximo ', Z, ' = 3', X, ' + 2', Y, '?'],
        opciones: [
          { id: 'c', texto: `En el vértice ${pt(v)}`, correcta: true },
          ...otros.slice(0, 2).map((w, i) => ({ id: `v${i}`, texto: `En el vértice ${pt(w)}`, error: w[0] === 0 || w[1] === 0 ? 'PL7' : 'PL5', siFuera: `Ahí Z = ${f(Zf(3, 2)(w))}; en ${pt(v)} vale ${f(zs[imax])}.` })),
          { id: 'centro', texto: 'En el centro de la región', error: 'PL3', siFuera: 'Desde el centro la recta de nivel todavía puede avanzar: Z sigue creciendo.' },
        ],
        dibujo: { datos: dib3(3, 2, []), estado: {} },
        revelar: { datos: dib3(3, 2, [{ k: zs[imax], rotulo: `Z = ${f(zs[imax])}` }], { rotulos: true }), estado: {} },
        coincide: `Coincide: la última recta que toca la región pasa por ${pt(v)}, con Z = ${f(zs[imax])}.`,
      };
    })(),
    mira: (() => {
      const zs = P3.map(Zf(3, 2)), max = Math.max(...zs);
      return {
        datos: dib3(3, 2, [{ k: 2, discontinua: true, desde: 1 }, { k: 6, discontinua: true, desde: 2 }, { k: max, rotulo: `Z = ${f(max)}`, desde: 3 }], { rotulos: true, desdeV: 4 }),
        voz: 'Creo que el máximo está en una esquina. Comprobemos.',
        pasos: [
          { estado: { corte: 1 }, texto: 'Z = 2: una recta que cruza la región.', ecuacion: ['3', X, ' + 2', Y, ' = 2'] },
          { estado: { corte: 2 }, texto: 'Z = 6: la misma inclinación, más arriba. Z crece hacia afuera.', ecuacion: ['3', X, ' + 2', Y, ' = 6'] },
          { estado: { corte: 3 }, texto: `Z = ${f(max)}: la última recta que toca la región, en un vértice.`, ecuacion: ['3·2 + 2·2 = ', f(max)] },
          { estado: { corte: 4 }, texto: 'Se comprueba evaluando Z en cada vértice.', ecuacion: [P3.map(v => `${f(Zf(3, 2)(v))}`).join(' · ')] },
        ],
      };
    })(),
    regla: {
      texto: 'Las rectas Z = k son paralelas. En una región cerrada, acotada y no vacía, el máximo y el mínimo de Z se alcanzan en vértices: basta evaluarlos.',
      ecuacion: [{ sub: [Z, 'máx'] }, ' = el mayor ', Z, ' de los vértices'],
      condicion: 'si la recta de nivel es paralela a un lado, todo ese lado puede ser óptimo, no solo un vértice.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        for (let k = 0; k < 300; k++) {
          const maxi = s % 3 !== 2;
          const lista = [[r.ent(1, 3), r.ent(1, 3), r.ent(6, 12)], [1, 0, r.ent(2, 5)], ...(maxi ? [] : [[-1, -1, -r.ent(1, 2)]])];
          const poli = region([...BASE, ...lista], caja(...Q1));
          if (poli.length < 4 || poli.some(v => v[0] >= Q1[2] - 1e-9 || v[1] >= Q1[3] - 1e-9 || Math.abs(v[0] - Math.round(v[0])) > 1e-9 || Math.abs(v[1] - Math.round(v[1])) > 1e-9)) continue;
          const p = r.ent(1, 5), q = r.ent(1, 5);
          const zs = poli.map(Zf(p, q)), best = maxi ? Math.max(...zs) : Math.min(...zs);
          if (zs.filter(z => z === best).length > 1) continue;
          const vb = poli[zs.indexOf(best)];
          const nombre = lista.map(txtR).join(', ');
          const otros = poli.filter(v => v !== vb);
          return {
            pregunta: [`Con x ≥ 0, y ≥ 0, ${nombre}: ¿cuál es el valor ${maxi ? 'máximo' : 'mínimo'} de `, Z, ` = ${p === 1 ? '' : p}`, X, ` + ${q === 1 ? '' : q}`, Y, '?'],
            opciones: distintas([
              { id: 'c', texto: f(best), correcta: true },
              ...otros.map((v, i) => ({ id: `v${i}`, texto: f(Zf(p, q)(v)), error: maxi ? 'PL4' : 'PL18', siFuera: `Ese es Z en ${pt(v)}; en ${pt(vb)} vale ${f(best)}.` })),
              { id: 'suma', texto: f(Math.max(...poli.map(v => v[0])) * p + Math.max(...poli.map(v => v[1])) * q), error: 'PL9', siFuera: 'Eso combina el mayor x y el mayor y, que no están en el mismo punto.' },
            ]).slice(0, 4),
            solucion: { texto: `Se evalúa Z en cada vértice; ${maxi ? 'el mayor' : 'el menor'} sale en ${pt(vb)}.`, ecuacion: [poli.map(v => `${pt(v)}→${f(Zf(p, q)(v))}`).join('  ')], dibujo: { datos: Object.assign(ejQ1(), { areas: [{ puntos: poli, color: 'd', cerrada: true }], curvas: [{ puntos: tramo([p, q, best], Q1), color: 'h' }].filter(c => c.puntos), puntos: poli.map(v => ({ x: v[0], y: v[1], color: 'd' })), alt: `Región con vértices ${poli.map(pt).join(', ')}; óptimo en ${pt(vb)}` }), estado: {} } },
          };
        }
        throw new Error('sin caso');
      },
    },
  };

  // ---------- Idea 4: cuando el óptimo no es un solo vértice ----------
  // Cambia: la función objetivo y la región · Permanece: el método (deslizar la recta de nivel) · Progresa: lo que
  // queda resaltado como óptimo · Se reserva: la región abierta sin máximo · Debe verse: lado entero, sin máximo o sin región.
  const LISTA4 = [[1, 1, 4], [1, 0, 3]];                                       // x + y ≤ 4 · x ≤ 3
  const P4 = region([...BASE, ...LISTA4], caja(...Q1));
  const ABIERTA = region([...BASE, [-1, -1, -3]], caja(...Q1));               // x + y ≥ 3, sin techo
  const CASOS = {
    paralela: { p: 1, q: 1, poli: P4, nombre: 'Z = x + y' },
    vertice: { p: 2, q: 1, poli: P4, nombre: 'Z = 2x + y' },
    abierta: { p: 1, q: 1, poli: ABIERTA, nombre: 'Z = x + y, región abierta' },
  };
  const optimo = c => {
    const zs = c.poli.map(Zf(c.p, c.q)), max = Math.max(...zs);
    const abierta = c.poli.some(v => v[0] >= Q1[2] - 1e-9 || v[1] >= Q1[3] - 1e-9);
    const top = c.poli.filter((v, i) => zs[i] === max);
    return { max, abierta, top };
  };
  const dib4 = (c, o = {}) => {
    const { max, abierta, top } = optimo(c);
    const curvas = [];
    if (!abierta) {
      curvas.push(nivel(c.p, c.q, max, { rotulo: `Z = ${f(max)}` }));
      if (top.length > 1) curvas.push({ puntos: top, color: 'd', rotulo: 'todo el lado' });
    } else {
      for (const k of [4, 7, 10]) curvas.push(nivel(c.p, c.q, k, { discontinua: true, rotulo: k === 10 ? 'sigue creciendo' : undefined }));
    }
    return Object.assign(ejQ1(), {
      areas: [{ puntos: c.poli, color: 'd', cerrada: true }],
      curvas: curvas.filter(x => x.puntos && x.puntos.length > 1),
      puntos: abierta ? [] : top.map(v => ({ x: v[0], y: v[1], color: 'h', rotulo: top.length === 1 ? pt(v) : undefined })),
      alt: abierta ? 'Región abierta: las rectas de nivel de Z siguen subiendo sin tope' : top.length > 1 ? `El máximo ${max} se alcanza en todo el lado de ${pt(top[0])} a ${pt(top[1])}` : `El máximo ${max} está en ${pt(top[0])}`,
      ...o,
    });
  };
  const especiales = {
    id: 'casos-especiales',
    titulo: 'Lado entero, sin tope o vacío',
    temas: ['Método gráfico de optimización'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige un caso y busca el máximo de Z. Mira si queda un vértice, un lado entero, o ningún tope.',
      voz: 'Compara la inclinación de Z con la de los lados.',
      controles: [{ id: 'caso', etiqueta: 'Caso', opciones: Object.entries(CASOS).map(([k, c]) => ({ valor: k, texto: c.nombre })) }],
      dibujo: val => ({ datos: dib4(CASOS[val.caso]), estado: {} }),
      lectura: val => { const { max, abierta, top } = optimo(CASOS[val.caso]); return [abierta ? 'Sin máximo: Z crece sin tope' : top.length > 1 ? `Máximo ${f(max)} en todo un lado` : `Máximo ${f(max)} en un vértice`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Con x ≥ 0, y ≥ 0 y x + y ≥ 3 como únicas restricciones, ¿cuál es el máximo de ', Z, ' = ', X, ' + ', Y, '?'],
      opciones: [
        { id: 'c', texto: 'No tiene: Z crece sin tope', correcta: true },
        { id: 'tres', texto: '3, en el borde x + y = 3', error: 'PL22', siFuera: '3 es el mínimo: ahí empieza la región. Hacia arriba no hay borde.' },
        { id: 'vertice', texto: 'El mayor valor en un vértice', error: 'PL16', siFuera: 'Mirar vértices basta en una región cerrada; esta no tiene techo.' },
        { id: 'cero', texto: '0, en el origen', error: 'TAL-ORIGEN', siFuera: 'El origen no cumple x + y ≥ 3: está fuera de la región.' },
      ],
      dibujo: { datos: Object.assign(ejQ1(), { areas: [{ puntos: ABIERTA, color: 'd', cerrada: true }], alt: 'Región x + y ≥ 3 en el primer cuadrante, abierta hacia arriba y a la derecha' }), estado: {} },
      revelar: { datos: dib4(CASOS.abierta), estado: {} },
      coincide: 'Coincide: la región no tiene techo; la recta de nivel nunca se despide.',
    },
    mira: (() => {
      const { max, top } = optimo(CASOS.paralela);
      return {
        datos: Object.assign(ejQ1(), {
          areas: [{ puntos: P4, color: 'd', cerrada: true }],
          curvas: [nivel(1, 1, 2, { discontinua: true, desde: 1 }), nivel(1, 1, max, { rotulo: `Z = ${f(max)}`, desde: 2 }), { puntos: top, color: 'd', desde: 3 }],
          puntos: P4.map(v => ({ x: v[0], y: v[1], color: 'd', rotulo: top.includes(v) ? undefined : `Z = ${f(Zf(1, 1)(v))}`, desde: 3 })),
          alt: `Región con x + y ≤ 4 y x ≤ 3; Z = x + y vale ${f(max)} en todo el lado de ${pt(top[0])} a ${pt(top[1])}`,
        }),
        pasos: [
          { estado: { corte: 1 }, texto: 'Z = x + y tiene la misma inclinación que el lado x + y = 4.', ecuacion: [Z, ' = ', X, ' + ', Y] },
          { estado: { corte: 2 }, texto: `Al subir, llega a Z = ${f(max)} y se apoya en todo el lado.`, ecuacion: [Z, ` = ${f(max)}`] },
          { estado: { corte: 3 }, texto: 'Dos vértices empatan: todo el lado entre ellos es óptimo.', ecuacion: [top.map(v => `Z${pt(v)} = ${f(max)}`).join('  ·  ')] },
          { estado: { corte: 3 }, texto: 'Sin techo puede no haber máximo; sin región, no hay solución.', ecuacion: ['abierta · vacía'] },
        ],
      };
    })(),
    regla: {
      texto: 'Primero se revisa la región: si es vacía no hay solución; si es abierta, puede no haber máximo. Si dos vértices empatan, todo el lado entre ellos es óptimo.',
      ecuacion: [{ sub: [Z, 'máx'] }, ' en un vértice, en un lado, o no existe'],
      condicion: 'con variables enteras se revisan los puntos enteros de la región; redondear el óptimo continuo puede salirse.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 4;
        const RESP = { vertice: 'En un solo vértice', lado: 'En todo un lado', sinTope: 'No tiene máximo: crece sin tope', vacia: 'No hay solución: la región es vacía' };
        let lista, p, q, bien;
        if (tipo === 0) { const c = r.ent(3, 5); lista = [[1, 1, c], [1, 0, c - 1]]; const k = r.uno([1, 2, 3]); p = k; q = k; bien = 'lado'; }
        else if (tipo === 1) { const c = r.ent(4, 5); lista = [[1, 1, c], [1, 0, r.ent(2, c - 1)]]; p = r.ent(2, 4); q = 1; bien = 'vertice'; }
        else if (tipo === 2) { const c = r.ent(2, 5); lista = [[-1, -1, -c]]; p = r.ent(1, 3); q = r.ent(1, 3); bien = 'sinTope'; }
        else { const c = r.ent(3, 5); lista = [[1, 1, c], [-1, -1, -(c + r.ent(1, 3))]]; p = r.ent(1, 3); q = r.ent(1, 3); bien = 'vacia'; }
        const poli = region([...BASE, ...lista], caja(...Q1));
        // Se confirma con la geometría lo que dice el caso.
        const abierta = poli.length > 2 && poli.some(v => v[0] >= Q1[2] - 1e-9 || v[1] >= Q1[3] - 1e-9);
        const zs = poli.map(Zf(p, q)), max = zs.length ? Math.max(...zs) : null;
        const calc = poli.length < 3 ? 'vacia' : abierta ? 'sinTope' : zs.filter(z => z === max).length > 1 ? 'lado' : 'vertice';
        if (calc !== bien) throw new Error(`caso mal armado: ${calc} ≠ ${bien}`);
        const texto = lista.map(([a, b, c]) => (a < 0 ? textoDesig([-a, -b, -c], '≥') : textoDesig([a, b, c], '≤'))).join(', ');
        const POR = { vertice: 'Habría un vértice ganador si un solo vértice tuviera el mayor Z.', lado: 'Habría un lado óptimo si Z fuera paralela a un lado de arriba.', sinTope: 'Eso pasa en regiones sin techo; esta está cerrada o vacía.', vacia: 'Eso pasa si las restricciones se contradicen; aquí sí hay puntos.' };
        return {
          pregunta: [`Con x ≥ 0, y ≥ 0, ${texto}: ¿dónde está el máximo de `, Z, ` = ${p === 1 ? '' : p}`, X, ` + ${q === 1 ? '' : q}`, Y, '?'],
          opciones: Object.keys(RESP).map(k => (k === bien ? { id: 'c', texto: RESP[k], correcta: true } : { id: k, texto: RESP[k], error: { vertice: 'PL9', lado: 'PL21', sinTope: 'PL22', vacia: 'PL20' }[k], siFuera: POR[k] })),
          solucion: {
            texto: { vertice: `Un solo vértice gana: Z = ${f(max)}.`, lado: `Z es paralela a x + y y empata en dos vértices: Z = ${f(max)}.`, sinTope: 'La región sigue hacia arriba y a la derecha: Z crece sin fin.', vacia: 'x + y no puede ser a la vez menor y mayor que esos números.' }[bien],
            ecuacion: [bien === 'vacia' ? 'región vacía' : bien === 'sinTope' ? 'sin techo' : poli.map(v => `${pt(v)}→${f(Zf(p, q)(v))}`).join('  ')],
          },
        };
      },
    },
  };

  return {
    unidad: 'algebra.programacion-lineal',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'La programación lineal nació de planificar con recursos limitados. En 1947, Dantzig formuló el método símplex; «programar» quería decir hacer planes y horarios, no escribir software. El problema junta muchas restricciones con una cantidad que se quiere mejorar. Con dos variables, esa estructura se puede dibujar: primero se ve si hay puntos posibles y después cuál es el mejor.',
      pregunta: '¿Cómo elegirías el mejor plan si hay muchos posibles?',
      fuente: { titulo: 'O’Connor y Robertson, George Dantzig — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Dantzig_George/' },
    },
    ideas: [semiplano, factible, nivelIdea, especiales],
  };
});
