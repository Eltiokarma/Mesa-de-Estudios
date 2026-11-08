// Pruebas del generador «trig-identidades»: casos.json, papel.json contra calc, y un recálculo
// independiente en cada uno de 600 problemas. El recálculo no usa identidades: resuelve cada problema
// con Math (ángulos de verdad, búsqueda numérica de raíces, barrido de la variable o la geometría del
// triángulo), y solo traduce los ángulos de academia (37° = atan(3/4), etc.) al final.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const RAD = Math.PI / 180, DEG = 180 / Math.PI;
const q = ([n, d]) => n / d;

// Raíces de f en [a, b]: cambios de signo (bisección) y mínimos de |f| que tocan cero (tangencias).
function raices(f, a, b, N = 4000) {
  const xs = [], h = (b - a) / N;
  let x0 = a, f0 = f(a);
  for (let i = 1; i <= N; i++) {
    const x1 = a + i * h, f1 = f(x1);
    if (f0 === 0) xs.push(x0);
    else if (f0 * f1 < 0) {
      let lo = x0, hi = x1;
      for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; }
      xs.push((lo + hi) / 2);
    }
    x0 = x1; f0 = f1;
  }
  for (let i = 1; i < N; i++) {
    const xm = a + i * h, g = x => Math.abs(f(x));
    if (g(xm) <= g(xm - h) && g(xm) <= g(xm + h) && g(xm) < 1e-2) {
      let lo = xm - h, hi = xm + h;
      for (let k = 0; k < 200; k++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (g(m1) < g(m2)) hi = m2; else lo = m1; }
      const r = (lo + hi) / 2;
      if (g(r) < 1e-9) xs.push(r);
    }
  }
  const out = [];
  for (const x of xs.sort((u, w) => u - w)) if (!out.length || Math.abs(x - out[out.length - 1]) > 1e-6) out.push(x);
  return out;
}
// Extremo de f en [a, b] con barrido y refinamiento ternario.
function extremo(f, a, b, signo, N = 4000) {
  const g = x => signo * f(x);
  let mejor = a, h = (b - a) / N;
  for (let i = 0; i <= N; i++) if (g(a + i * h) > g(mejor)) mejor = a + i * h;
  let lo = Math.max(a, mejor - h), hi = Math.min(b, mejor + h);
  for (let k = 0; k < 200; k++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (g(m1) > g(m2)) hi = m2; else lo = m1; }
  return f((lo + hi) / 2);
}
// Ángulo de verdad → ángulo de academia (36,87° → 37°, 16,26° → 16°, …).
const ACAD = [[Math.atan(3 / 4) * DEG, 37], [Math.atan(4 / 3) * DEG, 53], [Math.atan(7 / 24) * DEG, 16], [Math.atan(24 / 7) * DEG, 74]];
function academia(g) {
  if (Math.abs(g - Math.round(g)) < 1e-6) return Math.round(g);
  for (const [real, ac] of ACAD) if (Math.abs(g - real) < 1e-6) return ac;
  return g;
}
const realDe = g => { for (const [real, ac] of ACAD) if (ac === g) return real; return g; };

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'condicional': {
      const A = Math.atan(q(d.tanA)), B = Math.atan(q(d.tanB));
      if (d.suma === 180) return Math.tan(Math.PI - A - B);
      const C = Math.PI / 2 - A - B;
      return d.pide === 'cos' ? Math.cos(C) : Math.sin(C);
    }
    case 'maximo': {
      const L = x => d.m * Math.sin(x) * Math.cos(x) + d.n * (d.cuadrado === 'cos' ? Math.cos(x) ** 2 : Math.sin(x) ** 2) + d.c;
      return extremo(L, 0, Math.PI, d.pide === 'max' ? 1 : -1);
    }
    case 'terreno': {
      // Área de los dos triángulos ABC y ACD como función de x, con coordenadas: A en el origen, B en el eje x,
      // D en el eje y y C = AC·(cos x, sen x).
      const area = x => { const C = [d.AC * Math.cos(x), d.AC * Math.sin(x)]; return (d.AB * C[1]) / 2 + (d.AD * C[0]) / 2; };
      const r = raices(x => area(x) - d.S, 1e-6, Math.PI / 2 - 1e-6);
      assert.equal(r.length, 1, `terreno: ${r.length} soluciones`);
      return academia(r[0] * DEG);
    }
    case 'suma-k': {
      const k = q(d.k), s = d.dato === 'suma' ? 1 : -1;
      const r = raices(x => Math.sin(x) + s * Math.cos(x) - k, (d.cuadrante - 1) * Math.PI / 2 + 1e-9, d.cuadrante * Math.PI / 2 - 1e-9);
      assert.equal(r.length, 1, `suma-k: ${r.length} ángulos en el cuadrante`);
      const sen = Math.sin(r[0]), cos = Math.cos(r[0]);
      if (d.pide === 'producto') return sen * cos;
      if (d.pide === 'tangente') return sen / cos;
      return sen - s * cos;
    }
    case 'triangulo-doble': {
      // B en el origen, C en (a, 0): A queda a altura h; BH = h/tan β y HC = h/tan 2β.
      const r = raices(b => d.h / Math.tan(b) + d.h / Math.tan(2 * b) - d.a, 1e-4, Math.PI / 4 - 1e-6);
      assert.equal(r.length, 1);
      return d.pide === 'tanB' ? Math.tan(r[0]) : Math.tan(2 * r[0]);
    }
    case 'triple-producto': {
      const F = d.F === 'sen' ? Math.sin : Math.cos;
      if (d.modo === 'valor') return d.k * F(d.x * RAD) * F((60 - d.x) * RAD) * F((60 + d.x) * RAD);
      const T = t => { const th = d.k * t * RAD; return d.c + 4 * d.b * Math.cos(th) * Math.cos(Math.PI / 3 - th) * Math.cos(Math.PI / 3 + th); };
      const sg = d.pide === 'maxima' ? 1 : -1;
      let ext = -Infinity;
      for (let i = 1; i <= 24000; i++) ext = Math.max(ext, sg * T(i / 1000));
      for (let i = 1; i <= 24000; i++) if (Math.abs(sg * T(i / 1000) - ext) < 1e-9) return i / 1000;
      return NaN;
    }
    case 'acotar': {
      const E = x => {
        const s = Math.sin(x), c = Math.cos(x);
        return d.modo === 'cuartas' ? d.a * (s ** d.pot + c ** d.pot) + d.c : d.a * (s + (d.signo === 'mas' ? 1 : -1) * c) ** d.pot + d.c;
      };
      let lo = Infinity, hi = -Infinity;
      for (let i = 0; i <= 14400; i++) { const y = E(i * Math.PI / 7200); lo = Math.min(lo, y); hi = Math.max(hi, y); }
      return { dif: hi - lo, suma: hi + lo, min: lo, max: hi }[d.pide];
    }
    case 'cofuncion': {
      const F = {
        'sen-cos': (u, w) => Math.sin(u) - Math.cos(w), 'tan-cot': (u, w) => Math.tan(u) - 1 / Math.tan(w),
        'sec-csc': (u, w) => 1 / Math.cos(u) - 1 / Math.sin(w), 'tan-tan': (u, w) => Math.tan(u) * Math.tan(w) - 1,
        'cos-cos': (u, w) => Math.cos(u) - Math.cos(w),
      }[d.rel];
      const sol = [];
      for (let x = -60; x <= 100; x += 0.25) {
        const u = d.al * x + d.p, w = d.be * x + d.q;
        if (u > 0 && u < 90 && w > 0 && w < 90 && Math.abs(F(u * RAD, w * RAD)) < 1e-9) sol.push(x);
      }
      assert.equal(sol.length, 1, `cofuncion: ${sol}`);
      return sol[0];
    }
    case 'cadena': {
      let E = 1 / Math.tan(d.x * RAD) - Math.tan(d.x * RAD);
      for (let j = 1; j < d.n; j++) E -= 2 ** j * Math.tan(2 ** j * d.x * RAD);
      return E;
    }
    case 'reduccion-doble': {
      const k = Math.floor(d.theta / 90), beta = d.theta - 90 * k, th = (90 * k + realDe(beta)) * RAD;
      return d.op === 'suma' ? Math.tan(th) + 1 / Math.tan(th) : 1 / Math.tan(th) - Math.tan(th);
    }
  }
  return NaN;
}

probarGenerador(gen, {
  semillas: 600,
  recalcular,
  igual: (a, b) => Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(b)),
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('casos.json cubre todos los tipos', () => {
  const tipos = new Set(casos.casos.map(c => c.entrada.tipo));
  assert.deepEqual([...tipos].sort(), [...gen.tipos].sort());
});

test('salen todos los tipos; sin decimales; colores válidos y a lo más 4', () => {
  const tipos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo);
    for (const a of p.alternativas) assert.ok(!/\d,\d/.test(a.texto) && !/\d\.\d/.test(a.texto), `semilla ${s}: decimal en ${a.texto}`);
    const colores = Object.values(p.variables).map(x => x.color);
    assert.ok(colores.length <= 4 && new Set(colores).size === colores.length, `semilla ${s}: colores ${colores}`);
    assert.ok(colores.every(c => ['o', 'i', 'h', 'd'].includes(c)));
    const usados = [...p.enunciado, ...p.pregunta, ...p.solucion.flat()].filter(x => typeof x === 'object').map(x => x.v);
    for (const u of usados) assert.ok(p.variables[u], `semilla ${s}: el color ${u} no está en variables`);
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
    assert.ok(!/\d\.\d/.test(pr.enunciado + pr.respuesta + ' ' + pr.pasos.join(' ')), `${pr.id}: coma decimal`);
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
