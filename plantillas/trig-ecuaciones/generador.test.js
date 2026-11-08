// Pruebas del generador de ecuaciones trigonométricas: casos.json (verificados aparte, a ciegas),
// papel.json contra `calc` y un recálculo independiente en cada uno de 600 problemas.
//
// Camino independiente: no se usan ángulos notables ni fórmulas de transformación. Se evalúa la
// ecuación TAL COMO SE ESCRIBE en el enunciado (en radianes, con Math.sin, Math.cos y Math.tan),
// se buscan sus raíces en el intervalo por barrido fino (cambios de signo y mínimos de |f| para
// las raíces dobles) y se descartan los puntos donde la expresión no existe.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const R = Math.PI / 180;
const NUM = { '0': 0, '1/2': 0.5, '√2/2': Math.SQRT2 / 2, '√3/2': Math.sqrt(3) / 2, '1': 1, '√3': Math.sqrt(3), '√3/3': 1 / Math.sqrt(3) };
const num = k => (k.startsWith('-') ? -NUM[k.slice(1)] : NUM[k]);
const F = { sen: Math.sin, cos: Math.cos, tan: Math.tan };

// Raíces de f en [a, b) (radianes, o la unidad que sea). ok(x): la expresión existe en x.
function raices(f, a, b, ok = () => true, N = 40000) {
  const xs = [], ys = [];
  for (let i = 0; i <= N; i++) { const x = a + (b - a) * i / N; xs.push(x); ys.push(ok(x) ? f(x) : NaN); }
  const out = [];
  const agregar = x => { if (x < a - 1e-12 || x > b - 1e-7 || !ok(x)) return; if (Math.abs(f(x)) < 1e-8) out.push(x); };
  for (let i = 0; i < N; i++) {
    let [x0, x1, y0, y1] = [xs[i], xs[i + 1], ys[i], ys[i + 1]];
    if (!Number.isFinite(y0) || !Number.isFinite(y1)) continue;
    if (y0 === 0) { agregar(x0); continue; }
    if (y0 * y1 < 0) {
      for (let j = 0; j < 80; j++) { const xm = (x0 + x1) / 2, ym = f(xm); if (y0 * ym <= 0) { x1 = xm; y1 = ym; } else { x0 = xm; y0 = ym; } }
      agregar((x0 + x1) / 2);
    }
  }
  for (let i = 1; i < N; i++) {
    const m = Math.abs(ys[i]);
    if (!(m <= Math.abs(ys[i - 1]) && m <= Math.abs(ys[i + 1]) && m < 1e-2)) continue;
    let lo = xs[i - 1], hi = xs[i + 1];
    for (let j = 0; j < 200; j++) {
      const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
      if (Math.abs(f(m1)) < Math.abs(f(m2))) hi = m2; else lo = m1;
    }
    const x = (lo + hi) / 2;
    if (Math.abs(f(x)) < 1e-10) agregar(x);
  }
  if (ok(a) && Math.abs(f(a)) < 1e-12) out.push(a);
  out.sort((p, q) => p - q);
  const r = [];
  for (const x of out) if (!r.length || x - r[r.length - 1] > 1e-5) r.push(x);
  return r;
}
const suma = xs => xs.reduce((p, q) => p + q, 0);
function pedido(xs, pide, j) {
  if (pide === 'cuantas') return xs.length;
  if (pide === 'suma') return suma(xs);
  if (pide === 'kesima') return xs[j - 1];
  if (pide === 'mayor') return xs[xs.length - 1];
  if (pide === 'primera') return xs[0];
  if (pide === 'segunda') return xs[1];
  if (pide === 'menor') return xs.find(x => x > 1e-9);
  return NaN;
}
// Valor en la unidad de la respuesta: x en radianes → grados o radianes; t se deja igual.
const enUnidad = (xs, modo) => (modo === 'grados' ? xs.map(x => x / R) : xs);

function recalcular(p) {
  const d = p._datos;
  const vuelta = [0, 2 * Math.PI];
  if (d.tipo === 'lineal') {
    const xs = raices(x => F[d.fn](d.a * x + d.b * R) - num(d.k), ...vuelta);
    return pedido(enUnidad(xs, d.modo), d.pide, d.j);
  }
  if (d.tipo === 'horas') {
    const ts = raices(t => d.c + d.p * Math.sin(Math.PI * t / 12) + d.q * Math.cos(Math.PI * t / 12) - d.valor, 0, 24);
    return pedido(ts, d.pide);
  }
  if (d.tipo === 'suma-producto') {
    const der = x => (d.rhs === '0' ? 0 : F[d.rhs.split(' ')[0]](d.m * x));
    const xs = raices(x => F[d.f1](d.p * x) + d.signo * F[d.f2](d.q * x) - der(x), ...vuelta);
    return pedido(enUnidad(xs, d.modo), d.pide);
  }
  if (d.tipo === 'degradar') {
    const g = x => F[d.f1](d.p * x) ** 2 + d.signo * F[d.f2](d.q * x) ** 2 - d.d;
    if (d.modo === 'segundos') return pedido(raices(t => g(Math.PI * t / 6), 0, 12), d.pide);
    return pedido(enUnidad(raices(g, ...vuelta), d.modo), d.pide);
  }
  if (d.tipo === 'cuadratica' && d.sub === 'coseno') {
    const u = t => Math.PI * t / 6;
    return pedido(raices(t => d.alfa * Math.sin(u(t)) ** 2 + d.beta * Math.cos(u(t)) - d.gamma, 0, d.T), d.pide);
  }
  if (d.tipo === 'cuadratica') {
    const x = t => Math.PI * t / 6;
    const s1 = {
      directa: t => d.Aesc * Math.sin(x(t)), 'pi-menos': t => d.Aesc * Math.sin(Math.PI - x(t)),
      'pi-mas': t => d.Aesc * Math.sin(Math.PI + x(t)), 'cos-menos': t => d.Aesc * Math.cos(x(t) - Math.PI / 2),
    }[d.forma];
    return pedido(raices(t => s1(t) + d.B - Math.cos(Math.PI * t / 3), 0, d.T), d.pide);
  }
  if (d.tipo === 'cubica') {
    const xs = raices(x => Math.cos(3 * x) / Math.cos(x) - d.k, ...vuelta, x => Math.abs(Math.cos(x)) > 1e-6);
    if (d.pide === 'cisterna') { const r = suma(xs) / (2 * Math.PI); return Math.PI * r * r * d.h; }
    return pedido(enUnidad(xs, d.modo), d.pide);
  }
  if (d.tipo === 'tangente') {
    const tp = x => Math.tan(d.p * x), tq = x => Math.tan(d.q * x);
    const ok = x => Math.abs(Math.cos(d.p * x)) > 1e-6 && Math.abs(Math.cos(d.q * x)) > 1e-6 && Math.abs(1 - d.signo * tp(x) * tq(x)) > 1e-6;
    const xs = raices(x => (tp(x) + d.signo * tq(x)) / (1 - d.signo * tp(x) * tq(x)) - num(d.k), ...vuelta, ok);
    return pedido(enUnidad(xs, d.modo), d.pide);
  }
  return NaN;
}
const igual = (a, b) => Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b));
probarGenerador(gen, { semillas: 600, recalcular, igual });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y las alternativas tienen la misma forma', () => {
  const tipos = new Set();
  const forma = t => (/°$/.test(t) ? 'g' : /π/.test(t) ? 'pi' : / h$/.test(t) ? 'h' : / s$/.test(t) ? 's' : /(soluci|vez|veces)/.test(t) ? 'n' : 'otro');
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo + (p._datos.sub ? '-' + p._datos.sub : ''));
    const formas = new Set(p.alternativas.map(a => forma(a.texto)));
    assert.equal(formas.size, 1, `semilla ${s}: mezcla formas (${p.alternativas.map(a => a.texto).join(' | ')})`);
    assert.ok(!formas.has('otro'), `semilla ${s}: forma desconocida`);
    const usados = Object.values(p.variables).map(x => x.color);
    assert.ok(usados.length <= 4 && new Set(usados).size === usados.length, `semilla ${s}: colores repetidos o más de 4`);
    const enunciado = p.enunciado.map(x => (typeof x === 'string' ? x : x.t)).join('');
    assert.ok(!/(^|[^\w])-\d/.test(enunciado + p.solucion.flat().map(x => (typeof x === 'string' ? x : x.t)).join('')), `semilla ${s}: guion en vez de signo menos`);
  }
  assert.deepEqual([...tipos].sort(), ['cuadratica-coseno', 'cuadratica-senales', 'cubica', 'degradar', 'horas', 'lineal', 'suma-producto', 'tangente']);
});

// papel.json: cada problema se comprueba con las funciones de cálculo del generador.
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
const campo = (o, k) => k.split('.').reduce((x, c) => (x == null ? undefined : x[c]), o);
function cerca(real, esp, que) {
  if (Array.isArray(esp)) { assert.equal(real.length, esp.length, `${que}: largo`); esp.forEach((e, i) => cerca(real[i], e, `${que}[${i}]`)); return; }
  if (typeof esp === 'number') assert.ok(Math.abs(real - esp) < 1e-6, `${que}: da ${real}, se esperaba ${esp}`);
  else assert.equal(real, esp, que);
}
test('papel.json: entre 6 y 8 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 6 && papel.problemas.length <= 8);
  for (const p of papel.problemas) {
    assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(p.nivel), p.id);
    assert.ok(!/\d\.\d/.test([p.enunciado, p.respuesta, ...p.pasos].join(' ')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: coincide con calc`, () => {
  for (const v of p.verificar) {
    assert.ok(typeof gen.calc[v.fn] === 'function', `${p.id}: no existe calc.${v.fn}`);
    const r = gen.calc[v.fn](...v.args);
    for (const [k, e] of Object.entries(v.espera)) cerca(campo(r, k), e, `${p.id} · ${k}`);
  }
});
