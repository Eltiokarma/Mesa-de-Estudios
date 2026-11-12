// Pruebas del generador de conversiones de química: casos.json (verificados aparte, a ciegas), un recálculo
// independiente por otro camino en 600 problemas y los problemas de papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const cerca = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

// Otro camino para las escalas: el truco del −40 (−40 °C = −40 °F) y K = °C + 273.
const CaF = c => (c + 40) * 9 / 5 - 40, FaC = x => (x + 40) * 5 / 9 - 40;
const lectura = { 'c-f': CaF, 'f-c': FaC, 'c-k': c => c + 273, 'k-c': k => k - 273, 'f-k': x => FaC(x) + 273 };
const RHO = { Al: 2.7, Fe: 7.8, Zn: 7.1, Cu: 8.9, Ag: 10.5, Pb: 11.3, Au: 19.3 };
const PM = { A: 100, nm: 1000, pm: 1, cm: 1e10, m: 1e12 };                 // picómetros por unidad
const mitades = (m, n) => { for (let k = 0; k < n; k++) m /= 2; return m; };

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'delta') {
    if (d.sub === 'f-c') return Math.abs(FaC(32 + d.dF) - FaC(32));           // dos lecturas que difieren en dF
    if (d.sub === 'tabla') { const c = d.a === 'F' ? CaF : (x => x + 273); return c(d.temps[d.j]) - c(d.temps[d.i]); }
    const c = d.sub === 'c-f' ? CaF : (x => x + 273);
    return Math.abs(c(d.T2) - c(d.T1));
  }
  if (d.tipo === 'lectura') return lectura[d.sub](d.valor);
  if (d.tipo === 'densidad') {
    if (d.sub === 'longitud') return d.valor * PM[d.de] / PM[d.a];
    const rhoSI = RHO[d.metal] * 1000;                                       // kg/m³
    if (d.sub === 'volumen') { const m3 = d.masa / 1000 / rhoSI; return m3 * { m3: 1, L: 1000, cm3: 1e6 }[d.unidad]; }
    const m3 = d.unidad === 'L' ? d.volumen / 1000 : d.volumen;
    return m3 * rhoSI;
  }
  if (d.tipo === 'latente') {
    // Por gramo: J/g = (kJ/mol × 1000) / (g/mol).
    if (d.sub === 'inversa') return d.Q * 1000 / (40700 / 18);
    const jPorGramo = (d.sub === 'vaporizar' ? 40700 : 6010) / 18;
    return d.masa * jPorGramo / 1000;
  }
  if (d.tipo === 'vida') {
    if (d.sub === 'queda') return mitades(d.m0, Math.round(d.t / d.tMedia));
    if (d.sub === 'deducir') return mitades(d.m0, Math.round(d.T2 / (d.T1 / d.a)));
    let frac = 1, t = 0; while (frac > 1 / 2 ** d.n + 1e-15) { frac /= 2; t += d.tMedia; } return t;
  }
  throw new Error(`tipo desconocido: ${d.tipo}`);
}
probarGenerador(gen, { semillas: 600, recalcular, igual: cerca });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia * Math.max(1, Math.abs(c.esperado.respuesta)), `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('casos.json cubre los cinco tipos y todos los subtipos', () => {
  const k = new Set(casos.casos.map(c => c.entrada.tipo + ':' + c.entrada.sub));
  for (const t of ['delta:c-f', 'delta:c-k', 'delta:f-c', 'delta:tabla', 'lectura:c-f', 'lectura:f-c', 'lectura:c-k', 'lectura:k-c', 'lectura:f-k',
    'densidad:volumen', 'densidad:masa', 'densidad:longitud', 'latente:vaporizar', 'latente:fundir', 'latente:inversa', 'vida:queda', 'vida:deducir', 'vida:tiempo'])
    assert.ok(k.has(t), `falta ${t}`);
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 25);
});

test('en las variaciones siempre está la trampa del desfase (32 o 273 sumado a un cambio)', () => {
  let n = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'delta') continue;
    n++;
    assert.ok(p.alternativas.some(a => a.error && a.error.id === 'AQ-desfase-en-variacion'), `semilla ${s}`);
  }
  assert.ok(n > 100);
});

test('las alternativas van con coma decimal y la misma unidad', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    const unidades = new Set(p.alternativas.map(a => a.texto.replace(/^[−\d ,×⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+(10[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)?\s*/, '')));
    assert.equal(unidades.size, 1, `semilla ${s}: ${p.alternativas.map(a => a.texto)}`);
    for (const a of p.alternativas) assert.ok(!/\d\.\d/.test(a.texto), `semilla ${s}: ${a.texto}`);
  }
});

test('ningún id de error se repite dentro de un mismo problema, y no hay kelvin negativos', () => {
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const ids = p.alternativas.filter(a => a.error).map(a => a.error.id);
    assert.equal(new Set(ids).size, ids.length, `semilla ${s}: ${ids}`);
    for (const a of p.alternativas) assert.ok(!/^−.* K$/.test(a.texto), `semilla ${s}: ${a.texto}`);
  }
});

test('los datos de temperatura caen en un rango creíble para cada objeto y lugar', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos, txt = p.enunciado.map(x => typeof x === 'string' ? x : x.t).join('');
    if (d.tipo === 'delta' && /agua/.test(txt) && d.sub !== 'f-c') for (const T of d.temps || [d.T1, d.T2]) assert.ok(T >= 0 && T <= 100, `semilla ${s}: ${T}`);
    if (d.tipo === 'lectura' && /congelador/.test(txt)) { const C = gen.convertir(d.valor, d.sub[0].toUpperCase(), 'C'); assert.ok(C >= -40 && C <= -10, `semilla ${s}: ${C}`); }
    if (d.tipo === 'lectura' && /horno/.test(txt)) { const C = gen.convertir(d.valor, d.sub[0].toUpperCase(), 'C'); assert.ok(C >= 150 && C <= 250, `semilla ${s}: ${C}`); }
    if (d.tipo === 'densidad' && d.sub === 'volumen') assert.ok(d.masa <= 15000, `semilla ${s}`);
  }
});

test('notación científica: tres cifras y potencia de diez', () => {
  assert.equal(gen.cient(1.28e-10), '1,28 × 10⁻¹⁰');
  assert.equal(gen.cient(0.0005), '5 × 10⁻⁴');
  assert.equal(gen.cient(186), '186');
  assert.equal(gen.cient(0.186), '0,186');
  assert.equal(gen.cient(9.996e-7), '1 × 10⁻⁶');
});

// ---- Papel (regla 6) ----
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 6 y 8 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 6 && papel.problemas.length <= 8);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
    assert.ok(!/\d\.\d/.test([p.enunciado, p.respuesta, ...p.pasos].join(' ')), `${p.id}: coma decimal`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: la respuesta coincide con el generador`, () => {
  for (const x of p.verificar) {
    let r = gen[x.fn](...x.args);
    if (typeof r === 'number') r = { valor: r };
    for (const [k, esp] of Object.entries(x.espera)) assert.ok(Math.abs(r[k] - esp) <= Math.max(1e-9, 1e-6 * Math.abs(esp)), `${p.id} ${x.fn}.${k}: ${r[k]} ≠ ${esp}`);
  }
});
