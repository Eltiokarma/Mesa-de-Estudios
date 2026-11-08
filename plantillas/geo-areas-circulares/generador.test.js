// Pruebas del generador de áreas circulares: casos.json (verificados aparte, a ciegas), papel.json
// contra calc, y un recálculo independiente en cada uno de 600 problemas: integrales numéricas en
// polares para coronas y sectores, conteo en una cuadrícula fina para las regiones sombreadas y las
// lúnulas, bisección para los cuadrantes y la longitud de la cicloide integrando la rapidez del punto.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const PI = Math.PI;
// Valor numérico de una clave «n/d|n/d» = q + p·π.
function deClave(k) {
  const [q, p] = k.split('|').map(f => { const [n, d] = f.split('/').map(Number); return n / d; });
  return q + p * PI;
}
// Simpson en [a, b] con n pasos (n par).
function simpson(f, a, b, n = 2000) {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
}
// Área de un anillo de radios r..R y ángulo t (grados), integrando en polares: ∫∫ ρ dρ dθ.
const piezaPolar = (r, R, t) => simpson(() => simpson(rho => rho, r, R, 200), 0, t * PI / 180, 20);
// Conteo en cuadrícula: área de {(x, y) en [x0, x1] × [y0, y1] : dentro(x, y)}.
function cuadricula(dentro, x0, x1, y0, y1, N = 500) {
  const hx = (x1 - x0) / N, hy = (y1 - y0) / N; let c = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (dentro(x0 + (i + 0.5) * hx, y0 + (j + 0.5) * hy)) c++;
  return c * hx * hy;
}
const enDisco = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;

function recalcular(p) {
  const d = p._datos;
  const exacto = x => ({ x, tol: 1e-7 });
  const aprox = x => ({ x, tol: 0.012 });
  if (d.tipo === 'corona') {
    if (d.sub === 'radios') return exacto(piezaPolar(d.r, d.R, 360));
    if (d.sub === 'diametros') return exacto(piezaPolar(d.d / 2, d.D / 2, 360));
    if (d.sub === 'razon-suma') { const r = d.S / (1 + d.b / d.a); return exacto(piezaPolar(r, d.S - r, 360)); }
    // Cuerda tangente: con cualquier radio menor (aquí 1 y 7) la corona da lo mismo.
    const a1 = piezaPolar(1, Math.hypot(1, d.c / 2), 360), a7 = piezaPolar(7, Math.hypot(7, d.c / 2), 360);
    assert.ok(Math.abs(a1 - a7) < 1e-6);
    return exacto(a1);
  }
  if (d.tipo === 'sector') {
    if (d.sub === 'semicorona') return exacto(piezaPolar(d.d / 2, d.D / 2, 180));
    if (d.sub === 'trapecio') return exacto(piezaPolar(d.r, d.R, d.t));
    // Perímetro: dos radios más el arco medido como poligonal de 20 000 cuerdas.
    let arco = 0; const N = 20000, T = d.t * PI / 180;
    for (let i = 0; i < N; i++) arco += Math.hypot(d.r * (Math.cos((i + 1) * T / N) - Math.cos(i * T / N)), d.r * (Math.sin((i + 1) * T / N) - Math.sin(i * T / N)));
    return exacto(2 * d.r + arco);
  }
  if (d.tipo === 'concentricas') {
    if (d.sub === 'razon') return exacto(piezaPolar(d.m - 1, d.m, 45) / piezaPolar(0, 1, 45));
    const [r1, r2, r3] = d.radios, t = 360 / d.n;
    return exacto(d.piezas[0] * piezaPolar(0, r1, t) + d.piezas[1] * piezaPolar(r1, r2, t) + d.piezas[2] * piezaPolar(r2, r3, t));
  }
  if (d.tipo === 'cuadrantes') {
    // Bisección: el R con R − r = d cuya franja de 90° mide Spi·π.
    const area = R => piezaPolar(R - d.d, R, 90);
    let lo = d.d, hi = 1000;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (area(m) < d.Spi * PI) lo = m; else hi = m; }
    return { x: lo, tol: 1e-6 };
  }
  if (d.tipo === 'sombreada') {
    if (d.sub === 'rect-tres') { const r = d.r; return aprox(cuadricula((x, y) => !(enDisco(x, y, 2 * r, r, r) || enDisco(x, y, 0, r, r) || enDisco(x, y, 4 * r, r, r)), 0, 4 * r, 0, 2 * r)); }
    if (d.sub === 'cuadrado-cuatro') { const r = d.r; return aprox(cuadricula((x, y) => ![[r, r], [3 * r, r], [r, 3 * r], [3 * r, 3 * r]].some(([a, b]) => enDisco(x, y, a, b, r)), 0, 4 * r, 0, 4 * r)); }
    const l = d.l; return aprox(cuadricula((x, y) => ![[0, 0], [l, 0], [0, l], [l, l]].some(([a, b]) => enDisco(x, y, a, b, l / 2)), 0, l, 0, l));
  }
  if (d.tipo === 'lunulas') {
    if (d.sub === 'flor') { const l = d.l; return aprox(cuadricula((x, y) => [[l / 2, 0], [l / 2, l], [0, l / 2], [l, l / 2]].filter(([a, b]) => enDisco(x, y, a, b, l / 2)).length >= 2, 0, l, 0, l)); }
    if (d.sub === 'dos-cuadrantes') { const l = d.l; return aprox(cuadricula((x, y) => enDisco(x, y, 0, 0, l) && enDisco(x, y, l, l, l), 0, l, 0, l)); }
    if (d.sub === 'cuadrante-dos-semis') { const R = d.R; return aprox(cuadricula((x, y) => enDisco(x, y, 0, 0, R) && !enDisco(x, y, R / 2, 0, R / 2) && !enDisco(x, y, 0, R / 2, R / 2), 0, R, 0, R)); }
    if (d.sub === 'cuadrante-semi') { const R = d.R; return aprox(cuadricula((x, y) => enDisco(x, y, 0, 0, R) && !enDisco(x, y, R / 2, 0, R / 2), 0, R, 0, R)); }
    // Hipócrates: B(0, 0), A(0, a), C(b, 0); semicírculos hacia afuera (x ≤ 0 y y ≤ 0); se quita el disco de diámetro AC.
    const { a, b, c } = d;
    const grande = (x, y) => enDisco(x, y, b / 2, a / 2, c / 2);
    const l1 = cuadricula((x, y) => enDisco(x, y, 0, a / 2, a / 2) && !grande(x, y), -a / 2, 0, 0, a);
    const l2 = cuadricula((x, y) => enDisco(x, y, b / 2, 0, b / 2) && !grande(x, y), 0, b, -b / 2, 0);
    return aprox(l1 + l2);
  }
  // Rueda: P = (rθ − r sen θ, r − r cos θ); se integra su rapidez en θ.
  const n = d.conCentro ? d.Dpi / (2 * d.r) : d.n;
  return exacto(simpson(th => d.r * Math.hypot(1 - Math.cos(th), Math.sin(th)), 0, 2 * PI * n, 20000));
}
const igual = (es, valor) => Math.abs(es.x - deClave(valor)) <= es.tol * Math.max(1, Math.abs(es.x));
probarGenerador(gen, { semillas: 600, recalcular, igual });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(deClave(p.respuesta.valor) - c.esperado.respuesta) <= casos.tolerancia, `da ${deClave(p.respuesta.valor)}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('papel.json: cada verificación cuadra con calc', () => {
  assert.ok(papel.problemas.length >= 6 && papel.problemas.length <= 8);
  for (const pr of papel.problemas) {
    assert.ok(pr.verificar.length, `${pr.id} sin verificación`);
    for (const ver of pr.verificar) {
      const r = gen.calc[ver.fn](...ver.args);
      const x = typeof r === 'number' ? r : gen.calc.valor(r);
      assert.ok(Math.abs(x - ver.espera) < 1e-6 * Math.max(1, Math.abs(ver.espera)), `${pr.id}: ${ver.fn} da ${x}, se esperaba ${ver.espera}`);
    }
  }
});

test('salen todos los tipos y subtipos, y la forma de la correcta no la delata', () => {
  const vistos = new Set();
  const forma = t => (/π/.test(t) ? 'pi' : '') + (/^\(|^\d/.test(t) && !/^\d+π/.test(t) && !/^π/.test(t) ? 'q' : '');
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    vistos.add(p._datos.tipo + '/' + (p._datos.sub || (p._datos.conCentro ? 'centro' : 'vueltas')));
    const fc = forma(p.alternativas.find(a => a.correcta).texto);
    const iguales = p.alternativas.filter(a => !a.correcta && forma(a.texto) === fc).length;
    assert.ok(iguales >= 2, `semilla ${s}: solo ${iguales} distractores con la forma de la correcta`);
    for (const a of p.alternativas) assert.ok(!/,\d/.test(a.texto), `semilla ${s}: decimal en ${a.texto}`);
  }
  for (const t of ['corona/radios', 'corona/diametros', 'corona/razon-suma', 'corona/cuerda', 'sector/semicorona', 'sector/trapecio', 'sector/perimetro',
    'concentricas/suma', 'concentricas/razon', 'cuadrantes/vueltas', 'sombreada/rect-tres', 'sombreada/cuadrado-cuatro', 'sombreada/cuadrado-esquinas',
    'lunulas/flor', 'lunulas/dos-cuadrantes', 'lunulas/cuadrante-dos-semis', 'lunulas/cuadrante-semi', 'lunulas/hipocrates', 'rueda/centro', 'rueda/vueltas']) {
    assert.ok(vistos.has(t), `no salió ${t}`);
  }
});
