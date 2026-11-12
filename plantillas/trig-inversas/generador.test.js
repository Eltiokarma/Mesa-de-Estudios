// Pruebas del generador «trig-inversas»: casos.json, papel.json contra calc, y un recálculo independiente
// en cada uno de 600 problemas. El recálculo no usa las propiedades de las inversas: resuelve cada
// ecuación por búsqueda numérica de raíces, barre el dominio, mide límites y busca puntos del lugar.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const PI = Math.PI;
const q = ([n, d]) => n / d;
const ARC = {
  arcsen: Math.asin, arccos: Math.acos, arctan: Math.atan,
  arccot: u => PI / 2 - Math.atan(u),
  arcsec: u => (Math.abs(u) >= 1 ? Math.acos(1 / u) : NaN),
  arccsc: u => (Math.abs(u) >= 1 ? Math.asin(1 / u) : NaN),
};

function raices(f, a, b, N = 20000) {
  const xs = [], h = (b - a) / N;
  let x0 = a, f0 = f(a);
  for (let i = 1; i <= N; i++) {
    const x1 = a + i * h, f1 = f(x1);
    if (Number.isFinite(f0) && Number.isFinite(f1)) {
      if (f0 === 0) xs.push(x0);
      else if (f0 * f1 < 0 && Math.abs(f0 - f1) < 1) {
        let lo = x0, hi = x1;
        for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; }
        xs.push((lo + hi) / 2);
      }
    }
    x0 = x1; f0 = f1;
  }
  for (const e of [a, b]) if (Math.abs(f(e)) < 1e-12) xs.push(e); // raíz justo en el borde del dominio
  const out = [];
  for (const x of xs.sort((u, w) => u - w)) if (!out.length || Math.abs(x - out[out.length - 1]) > 1e-7) out.push(x);
  return out;
}
// Circunradio de tres puntos.
function circunradio([ax, ay], [bx, by], [cx, cy]) {
  const a = Math.hypot(bx - cx, by - cy), b = Math.hypot(ax - cx, ay - cy), c = Math.hypot(ax - bx, ay - by);
  const area = Math.abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay)) / 2;
  return a * b * c / (4 * area);
}

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'complementaria': {
      const [f, g] = { 'sen-cos': ['arcsen', 'arccos'], 'tan-cot': ['arctan', 'arccot'], 'sec-csc': ['arcsec', 'arccsc'] }[d.par];
      const ecu = d.forma === 'diferencia' ? x => ARC[f](x) - ARC[g](x) - q(d.d) * PI
        : d.forma === 'multiplo' ? x => d.m * ARC[f](x) - d.n * ARC[g](x)
        : d.forma === 'triple' ? x => 2 * ARC[f](x) - ARC[g](x) - q(d.c) * PI
        : x => ARC[f](x) + 2 * ARC[g](x) - q(d.c) * PI;
      const tramos = d.par === 'sen-cos' ? [[-1, 1]] : d.par === 'tan-cot' ? [[-40, 40]] : [[-40, -1], [1, 40]];
      const sol = tramos.flatMap(([a, b]) => raices(ecu, a, b)).filter(x => Math.abs(ecu(x)) < 1e-9);
      assert.equal(sol.length, 1, `complementaria: soluciones ${sol}`);
      return sol[0];
    }
    case 'lugar': {
      if (d.forma === 'recta') {
        // Para dos abscisas con |b·x + c| ≥ 2, busca y con la ecuación original; la recta pasa por esos puntos.
        const pts = [];
        for (const x0 of [5, 9]) {
          const w = d.b * x0 + d.c;
          const ys = raices(y => ARC.arcsec(y - d.a * x0) + ARC.arccsc(w) - PI / 2, -200, 200, 40000);
          assert.equal(ys.length, 1); pts.push([x0, ys[0]]);
        }
        const m = (pts[1][1] - pts[0][1]) / (pts[1][0] - pts[0][0]), n = pts[0][1] - m * pts[0][0];
        return `recta:${Math.round(m)},${Math.round(n)}`;
      }
      const pts = [];
      const U = (x, y) => x * x + y * y + d.c, W = (x, y) => 2 * d.a * x + 2 * d.b * y;
      for (let x = -12; x <= 12 && pts.length < 40; x += 0.37) {
        for (const y of raices(y => U(x, y) - W(x, y), -15, 15, 3000)) {
          if (Math.abs(W(x, y)) >= 1 && Math.abs(ARC.arcsec(U(x, y)) + ARC.arccsc(W(x, y)) - PI / 2) < 1e-9) pts.push([x, y]);
        }
      }
      assert.ok(pts.length >= 3, 'circunferencia: pocos puntos');
      return circunradio(pts[0], pts[Math.floor(pts.length / 2)], pts[pts.length - 1]);
    }
    case 'interseccion': {
      const m = d.m[0] / d.m[1] * Math.sqrt(d.m[2]);
      const ecu = d.par === 'cot-sen' ? x => ARC.arccot(m * x) - Math.asin(x) : x => Math.atan(m * x) - Math.acos(x);
      const xs = raices(ecu, -1, 1);
      assert.equal(xs.length, 1);
      return d.pide === 'x2' ? xs[0] ** 2 : d.pide === 'x' ? xs[0] : (d.par === 'cot-sen' ? Math.asin(xs[0]) : Math.acos(xs[0]));
    }
    case 'transformacion': {
      const f = x => d.a * PI / 4 + d.B * Math.atan(d.C * x + d.D);
      const l1 = f(-1e12), l2 = f(1e12), lo = Math.min(l1, l2), hi = Math.max(l1, l2);
      const crece = f(1) > f(0);
      return `${Math.round(lo / (PI / 4))}|${Math.round(hi / (PI / 4))}|${crece ? 'creciente' : 'decreciente'}|abierto`;
    }
    case 'dominio-puntos': {
      const f = x => { const u = (x - d.h) / d.k; return d.p * ARC[d.F](u) + d.q * ARC[d.G](u); };
      const vals = [];
      for (let i = -10000; i <= 10000; i++) {
        const y = f(i / 1000);
        if (Number.isFinite(y) && !vals.some(w => Math.abs(w - y) < 1e-9)) vals.push(y);
      }
      return vals.reduce((s, x) => s + x, 0);
    }
    case 'sector': {
      const th = d.terminos.reduce((s, t) => s + t.s * ARC[t.f](t.k), 0);
      return d.pide === 'area' ? th * d.R * d.R / 2 : th * d.R;
    }
  }
  return NaN;
}

probarGenerador(gen, {
  semillas: 600,
  recalcular,
  igual: (a, b) => (typeof a === 'string' || typeof b === 'string' ? a === b : Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(b))),
});
// Fugas: la correcta no se adivina por ser la central ni por estar en un extremo. Las respuestas de
// transformación (rango y sentido, en texto) no se comparan por tamaño.
const { probarFugas } = require('../../nucleo/probar-generador.js');
probarFugas(gen, { valorNumerico: a => (typeof a.valor === 'number' ? a.valor : NaN) });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'string') assert.equal(p.respuesta.valor, c.esperado.respuesta);
    else assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('casos.json cubre todos los tipos', () => {
  assert.deepEqual([...new Set(casos.casos.map(c => c.entrada.tipo))].sort(), [...gen.tipos].sort());
});

test('salen todos los tipos; sin decimales; colores válidos y a lo más 4', () => {
  const tipos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo);
    for (const a of p.alternativas) assert.ok(!/\d,\d/.test(a.texto) && !/\d\.\d/.test(a.texto) && !/NaN|undefined/.test(a.texto), `semilla ${s}: ${a.texto}`);
    const colores = Object.values(p.variables).map(x => x.color);
    assert.ok(colores.length <= 4 && new Set(colores).size === colores.length, `semilla ${s}: colores ${colores}`);
    assert.ok(colores.every(c => ['o', 'i', 'h', 'd'].includes(c)));
    const usados = [...p.enunciado, ...p.pregunta, ...p.solucion.flat()].filter(x => typeof x === 'object').map(x => x.v);
    for (const u of usados) assert.ok(p.variables[u], `semilla ${s}: el color ${u} no está en variables`);
    const todo = [...p.enunciado, ...p.pregunta, ...p.solucion.flat()].map(x => (typeof x === 'string' ? x : x.t)).join(' ');
    assert.ok(!/NaN|undefined|null/.test(todo), `semilla ${s}: texto roto`);
  }
  assert.deepEqual([...tipos].sort(), [...gen.tipos].sort());
});

test('papel.json: entre 5 y 10 problemas, texto plano y verificación contra calc', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const pr of papel.problemas) {
    assert.ok(pr.id && !ids.has(pr.id)); ids.add(pr.id);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(pr.nivel));
    assert.ok(pr.enunciado && pr.respuesta && pr.pasos.length && pr.verificar.length, pr.id);
    assert.ok(!/\d\.\d/.test(pr.enunciado + ' ' + pr.respuesta + ' ' + pr.pasos.join(' ')), `${pr.id}: coma decimal`);
    for (const v of pr.verificar) {
      assert.equal(typeof gen.calc[v.fn], 'function', `${pr.id}: calc.${v.fn} no existe`);
      const r = gen.calc[v.fn](...v.args);
      for (const [k, e] of Object.entries(v.espera)) {
        const x = k === 'valor' ? r : r[k];
        assert.ok(Math.abs(x - e) < 1e-9 * Math.max(1, Math.abs(e)), `${pr.id}: calc.${v.fn} da ${k} = ${x}, se esperaba ${e}`);
      }
    }
  }
});
