// Pruebas del generador de máximos, mínimos y rangos trigonométricos: casos.json (verificados aparte,
// a ciegas), papel.json contra `calc` y un recálculo independiente en cada uno de 600 problemas.
//
// Camino independiente: nada de √(a² + b²), completar cuadrados ni ángulos notables. Se evalúa la
// expresión TAL COMO SE ESCRIBE en el enunciado (radianes, Math.sin/cos/tan) en un barrido fino del
// dominio y se afina el extremo con sección áurea; los rangos se miran punto a punto (qué valores se
// alcanzan), las áreas salen de las coordenadas con la fórmula del cordón y los instantes, de un
// barrido con bisección.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const R = Math.PI / 180;
// Extremos de f en [a; b]: barrido y afinado con sección áurea.
function extremo(f, a, b, signo = 1, N = 20000) {
  let mejor = -Infinity, im = 0;
  const x = i => a + (b - a) * i / N;
  for (let i = 0; i <= N; i++) { const y = signo * f(x(i)); if (y > mejor) { mejor = y; im = i; } }
  let lo = x(Math.max(0, im - 1)), hi = x(Math.min(N, im + 1));
  for (let j = 0; j < 200; j++) {
    const m1 = lo + (hi - lo) * 0.382, m2 = lo + (hi - lo) * 0.618;
    if (signo * f(m1) > signo * f(m2)) hi = m2; else lo = m1;
  }
  const xr = (lo + hi) / 2;
  return { valor: signo * Math.max(mejor, signo * f(xr)), x: signo * f(xr) >= mejor ? xr : x(im) };
}
const maximo = (f, a, b) => extremo(f, a, b, 1).valor;
const minimo = (f, a, b) => extremo(f, a, b, -1).valor;
function pedido(f, a, b, pide) {
  const M = maximo(f, a, b), m = minimo(f, a, b);
  return { max: M, min: m, diferencia: M - m, suma: M + m }[pide];
}
const vuelta = [0, 2 * Math.PI];
const fr = t => { const [n, d] = t.split('/').map(Number); return n / (d || 1); };

// Rango de una función con huecos: ínfimo, supremo y si se alcanzan (en algún punto donde existe).
function rango(f, a, b, ok, N = 20001) {
  let inf = Infinity, sup = -Infinity;
  const xs = [];
  for (let i = 0; i <= N; i++) { const x = a + (b - a) * i / N; if (ok(x)) { const y = f(x); xs.push(y); inf = Math.min(inf, y); sup = Math.max(sup, y); } }
  // Valores especiales donde existe la función: múltiplos de 90°.
  for (const g of [0, 90, 180, 270]) if (ok(g * R)) { const y = f(g * R); xs.push(y); inf = Math.min(inf, y); sup = Math.max(sup, y); }
  // El supremo o ínfimo «de barrido» se redondea al entero o mitad más cercana (los datos son enteros).
  const redondo = y => Math.round(y * 2) / 2;
  const I = redondo(inf), S = redondo(sup);
  const alcanza = y => xs.some(z => Math.abs(z - y) < 1e-12);
  return { inf: I, sup: S, cl: alcanza(I), cr: alcanza(S) };
}
const txt = x => { for (let d = 1; d <= 8; d++) { const n = Math.round(x * d); if (Math.abs(x * d - n) < 1e-9) { const g = (p, q) => (q ? g(q, p % q) : Math.abs(p)); const k = g(n, d) || 1; return `${n / k < 0 ? '−' : ''}${Math.abs(n / k)}${d / k === 1 ? '' : '/' + d / k}`; } } return String(x); };

// Coordenadas de los puntos de la circunferencia trigonométrica para un θ dado (radianes).
const PUNTO = {
  O: () => [0, 0], A: () => [1, 0], B: () => [0, 1], "A'": () => [-1, 0], "B'": () => [0, -1],
  P: t => [Math.cos(t), Math.sin(t)], Q: t => [Math.cos(t), 0], T: t => [1, Math.tan(t)],
};
const cordon = ([p, q, r]) => Math.abs((q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1])) / 2;
const RANGOS = { I: [0, 90], II: [90, 180], III: [180, 270], IV: [270, 360] };

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'asenbcos' && d.sub === 'directa') return pedido(x => d.a * Math.sin(x) + d.b * Math.cos(x) + d.c, ...vuelta, d.pide);
  if (d.tipo === 'asenbcos') return pedido(x => 2 * d.A * Math.sin(x) * Math.cos(x) + 2 * d.B * Math.cos(x) ** 2 + d.d, ...vuelta, d.pide);
  if (d.tipo === 'cuadratica' && d.sub === 'hora') {
    const base = d.base === 'sen' ? Math.sin : Math.cos;
    const T = t => d.C + d.B * base(Math.PI * t / d.per) + d.K * Math.cos(2 * Math.PI * t / d.per);
    const fin = 2 * d.per, M = maximo(T, 0, fin);
    if (d.pide === 'max') return M;
    // Primer instante del máximo: el primer pico (máximo local) que llega al valor máximo; luego, al reloj.
    for (let t = 0; t < fin; t += 0.5) { const e = extremo(T, t, t + 0.5, 1, 200); if (Math.abs(e.valor - M) < 1e-9) return (Math.round(e.x * 1e6) / 1e6 + d.ini) % 24; }
    return NaN;
  }
  if (d.tipo === 'cuadratica') {
    const y = d.sub === 'seno' ? (x => d.A * Math.sin(x) ** 2 + d.B * Math.sin(x) + d.C) : (x => d.k * Math.cos(2 * x) + d.B * Math.sin(x) + d.C);
    const [a, b] = d.desde === null ? vuelta : [d.desde * R, d.hasta * R];
    return pedido(y, a, b, d.pide);
  }
  if (d.tipo === 'racional' && d.sub === 'mobius') return pedido(x => (d.a * Math.cos(x) + d.b) / (Math.cos(x) + d.d), ...vuelta, d.pide);
  if (d.tipo === 'racional') {
    const den = x => 1 + d.s * Math.cos(x);
    const r = rango(x => d.m * Math.sin(x) ** 2 / den(x) + d.n, ...vuelta, x => Math.abs(den(x)) > 1e-12);
    return `int:${txt(r.inf)}:${txt(r.sup)}:${r.cl ? 1 : 0}:${r.cr ? 1 : 0}`;
  }
  if (d.tipo === 'secante') {
    const [a, b] = [d.desde * R, d.hasta * R];
    if (d.sub === 'max-f') return pedido(x => d.a / Math.cos(x) + d.b, a, b, d.pide);
    const x0 = extremo(x => 1 / Math.cos(x), a, b, 1).x;
    return d.p * Math.cos(2 * x0) + d.q * Math.tan(x0) ** 2;
  }
  if (d.tipo === 'senoide') {
    const a = d.dato2 === 'min' ? (d.P0 + d.P2) / 2 : d.P2, b = d.dato2 === 'min' ? (d.P0 - d.P2) / 2 : d.P0 - d.P2;
    const g = t => a + b * Math.cos(Math.PI * t / d.L) - d.V;
    const ts = [];
    const N = 24000, T = 2 * d.L;
    for (let i = 0; i < N; i++) {
      let t0 = T * i / N, t1 = T * (i + 1) / N;
      if (t0 > 0 && g(t0) === 0) { ts.push(t0); continue; }
      if (g(t0) * g(t1) < 0) { for (let j = 0; j < 80; j++) { const tm = (t0 + t1) / 2; if (g(t0) * g(tm) <= 0) t1 = tm; else t0 = tm; } ts.push((t0 + t1) / 2); }
    }
    return d.pide === 'primera' ? ts[0] : ts[1];
  }
  if (d.tipo === 'area-ct') {
    const k = p.respuesta.valor.replace('area:', '').split('|').map(fr);
    const [g0, g1] = RANGOS[d.cuadrante];
    for (const u of [0.17, 0.5, 0.83]) {
      const t = (g0 + (g1 - g0) * u) * R;
      const area = cordon(d.vertices.map(n => PUNTO[n](t)));
      const expr = k[0] + k[1] * Math.sin(t) + k[2] * Math.cos(t) + k[3] * Math.sin(t) * Math.cos(t) + k[4] * Math.tan(t);
      if (Math.abs(area - expr) > 1e-9) return `no cuadra en θ = ${t / R}°: área ${area}, expresión ${expr}`;
    }
    return p.respuesta.valor;
  }
  if (d.tipo === 'puerta') {
    const y = x => d.d + 2 * d.A * Math.cos(Math.PI * x / (2 * d.L)) ** 2;
    let lo = 0, hi = d.L; // y baja de 0 a L
    for (let j = 0; j < 100; j++) { const m = (lo + hi) / 2; if (y(m) > d.h) lo = m; else hi = m; }
    return 2 * lo * d.h;
  }
  return NaN;
}
const igual = (a, b) => (typeof b === 'string' ? a === b : Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)));
probarGenerador(gen, { semillas: 600, recalcular, igual });
// Fugas: la correcta no se adivina por ser la central ni por estar en un extremo.
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

test('salen todos los tipos y las alternativas tienen la misma forma', () => {
  const tipos = new Set();
  const forma = t => (/^[[⟨]/.test(t) ? 'int' : /θ/.test(t) ? 'expr' : / m²$/.test(t) ? 'm2' : / °C$/.test(t) ? 'C' : / h$/.test(t) ? 'h' : / mes(es)?$/.test(t) ? 'mes' : /^−?\d+(\/\d+)?$/.test(t) ? 'num' : 'otro');
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo + '-' + p._datos.sub);
    const formas = new Set(p.alternativas.map(a => forma(a.texto)));
    assert.equal(formas.size, 1, `semilla ${s}: mezcla formas (${p.alternativas.map(a => a.texto).join(' | ')})`);
    assert.ok(!formas.has('otro'), `semilla ${s}: forma desconocida (${p.alternativas.map(a => a.texto).join(' | ')})`);
    const usados = Object.values(p.variables).map(x => x.color);
    assert.ok(usados.length <= 4 && new Set(usados).size === usados.length, `semilla ${s}: colores repetidos o más de 4`);
    const todo = [...p.enunciado, ...p.pregunta, ...p.solucion.flat()].map(x => (typeof x === 'string' ? x : x.t)).join('');
    assert.ok(!/(^|[^\w])-\d/.test(todo), `semilla ${s}: guion en vez de signo menos`);
    assert.ok(!/undefined|NaN|null/.test(todo), `semilla ${s}: texto roto`);
  }
  assert.deepEqual([...tipos].sort(), ['area-ct-undefined', 'asenbcos-directa', 'asenbcos-doble', 'cuadratica-coseno-doble', 'cuadratica-hora', 'cuadratica-seno',
    'puerta-undefined', 'racional-mobius', 'racional-simplifica', 'secante-max-f', 'secante-otra', 'senoide-undefined']);
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
