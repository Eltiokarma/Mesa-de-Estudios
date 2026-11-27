// Pruebas de «Moles, masa molar y composición» (mol-practica): casos.json (calculados aparte, con un script que no usa el
// generador), y en 400 semillas un recálculo independiente de la respuesta a partir de _datos, con tablas escritas aquí de
// nuevo: masas atómicas redondeadas, Nₐ = 6,02 × 10²³ y un lector de fórmulas propio.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const MA = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, P: 31, S: 32, K: 39, Ca: 40, Cr: 52, Mn: 55, Fe: 56, Cu: 63.5, Zn: 65, Ba: 137 };
const NAV = 6.02e23;
// Lector propio: expande paréntesis y el agua de un hidrato a mano.
function cuenta(f) {
  const out = {};
  const sumar = (t, k) => {
    // Paréntesis primero: «(SO4)3» → «SO4SO4SO4».
    let s = t; for (let g = 0; g < 5; g++) s = s.replace(/\(([^()]+)\)(\d*)/, (x, a, n) => a.repeat(+n || 1));
    for (const [, e, n] of s.matchAll(/([A-Z][a-z]?)(\d*)/g)) out[e] = (out[e] || 0) + k * (+n || 1);
  };
  const [sal, agua] = f.split('·');
  sumar(sal, 1);
  if (agua) { const [, n, r] = agua.match(/^(\d*)(.*)$/); sumar(r, +n || 1); }
  return out;
}
const M = f => Object.entries(cuenta(f)).reduce((s, [e, k]) => s + MA[e] * k, 0);
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const num = (x, d) => { const r = Math.round(x * 10 ** d * (1 + 1e-12)) / 10 ** d, t = r.toFixed(d); return (d ? t.replace(/0+$/, '').replace(/\.$/, '') : t).replace('.', ','); };
const sci = x => { let e = Math.floor(Math.log10(x)), m = x / 10 ** e; if (+m.toFixed(3) >= 10) { e++; m /= 10; } return `${num(m, 3)} × 10${String(e).split('').map(c => (c === '-' ? '⁻' : SUP[+c])).join('')}`; };
const miles = t => t.replace(/^(\d+)(\d{3})(?=,|$)/, '$1 $2');
const SUBS = '₀₁₂₃₄₅₆₇₈₉';
const esc = f => f.replace(/(\d+)/g, d => d.split('').map(c => SUBS[+c]).join(''));
const mcd = (a, b) => (b ? mcd(b, a % b) : a);
function empirica(pct) {
  const n = Object.fromEntries(Object.entries(pct).map(([e, x]) => [e, x / MA[e]])), mn = Math.min(...Object.values(n));
  for (let k = 1; k <= 6; k++) { const r = Object.values(n).map(x => x / mn * k); if (r.every(x => Math.abs(x - Math.round(x)) < 0.03)) return Object.keys(n).map((e, i) => e + (Math.round(r[i]) === 1 ? '' : Math.round(r[i]))).join(''); }
  throw new Error('sin enteros');
}
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'promedio-dos': case 'promedio-tres': return `${miles(num(d.masas.reduce((s, m, i) => s + m * d.abund[i] / 100, 0), 2))} u`;
    case 'abundancia': { const [a, b] = d.masas; return `${num(100 * (b - d.media) / (b - a), 0)} %`; }
    case 'gramos-moles': return `${miles(num(d.m / M(d.f), 3))} mol`;
    case 'moles-moleculas': return sci(d.n * NAV);
    case 'gramos-moleculas': return sci(d.m / M(d.f) * NAV);
    case 'dosis': return sci(d.mg / 1000 / M(d.f) * NAV);
    case 'moles-elemento': return `${miles(num(d.n * cuenta(d.f)[d.e], 3))} mol`;
    case 'gramos-elemento': return `${miles(num(d.m / M(d.f) * cuenta(d.f)[d.e], 3))} mol`;
    case 'moles-iones': return `${num(d.n * (d.iones[0] + d.iones[1]), 3)} mol`;
    case 'atomos-dosis': return sci(d.k * d.mg / 1000 / M(d.f) * cuenta(d.f)[d.e] * NAV);
    case 'porcentaje': return `${num(100 * cuenta(d.f)[d.e] * MA[d.e] / M(d.f), 1)} %`;
    case 'masa-elemento': return `${miles(num(d.m * cuenta(d.f)[d.e] * MA[d.e] / M(d.f), 2))} g`;
    case 'agua-hidrato': { const x = +d.f.match(/·(\d+)/)[1]; return `${num(100 * 18 * x / M(d.f), 1)} %`; }
    case 'empirica-entera': case 'empirica-medio': return esc(empirica(d.pct));
    case 'molecular': { const k = Math.round(d.M / M(d.emp)); assert.ok(Math.abs(d.M / M(d.emp) - k) < 1e-9); return esc(Object.entries(cuenta(d.emp)).map(([e, n]) => e + (n * k === 1 ? '' : n * k)).join('')); }
    case 'lavoisier': return `${d.a + d.b} g`;
    case 'abierto': return `${num(d.vin + d.b - d.fin, 1)} g`;
    case 'proust': return `${num(d.x1 * d.m / d.m1, 2)} g`;
    case 'dalton': { const g = mcd(d.o1, d.o2); return `${d.o1 / g} : ${d.o2 / g}`; }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
probarGenerador(gen, { semillas: 400, recalcular, igual: (a, b) => a === b });
probarFugas(gen);

test('casos.json: cada caso da la respuesta calculada aparte', () => {
  assert.ok(casos.casos.length >= 18);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, { idea: c.entrada.idea });
    for (const [k, x] of Object.entries(c.entrada)) assert.deepEqual(p._datos[k], x, `${c.semilla} ${c.entrada.tipo}: ${k}`);
    assert.equal(p.respuesta.valor, c.esperado.respuesta, `${c.semilla} ${c.entrada.tipo}`);
  }
});

test('por idea: cada idea da solo sus tipos; los Datos no traen la respuesta ni pasan de 22 palabras', () => {
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 400; s++) {
      const p = gen.generar(s, { idea }); vistos.add(p._datos.tipo);
      assert.ok(tipos.includes(p._datos.tipo)); assert.equal(p._datos.idea, idea);
      assert.ok(Array.isArray(p.datos) && p.datos.length && p.datos.every(l => l.split(/\s+/).length <= 22), `${idea} ${s}: datos`);
      assert.ok(!p.datos.some(l => l.includes(p.respuesta.valor) && p.respuesta.valor.length > 3), `${idea} ${s}: los datos traen la respuesta`);
    }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
  }
});

test('papel con las seis ideas y niveles 1, 1, 1, 2, 2, 2, 3, 3', () => {
  const ps = Array.from({ length: 8 }, (_, i) => gen.generar(`papel-${i + 1}`));
  assert.equal(new Set(ps.map(p => p._datos.idea)).size, 6);
  assert.deepEqual(ps.map(p => p._datos.nivel), [1, 1, 1, 2, 2, 2, 3, 3]);
});

// Las explicaciones que dan un número lo dan bien: «pesaría X g/mol» es la masa molar de esa alternativa; «sería X %», el
// porcentaje del primer elemento con esa fórmula; las moléculas de los iónicos no se piden.
test('las explicaciones dan el valor de su error', () => {
  const desc = t => t.replace(/[₀-₉]/g, c => SUBS.indexOf(c));
  for (let s = 0; s < 400; s++) for (const idea of ['formula-empirica-molecular', 'mol-masa-molar']) {
    const p = gen.generar(s, { idea });
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const m = a.error.explicacion.match(/^(.*) (\S+) pesaría ([\d,]+) g\/mol\.$/);
      if (m) assert.equal(num(M(desc(m[2])), 1), m[3], a.error.explicacion);
      const q = a.error.explicacion.match(/Con (\S+), ([A-Z][a-z]?) sería ([\d,]+) %\.$/);
      if (q) assert.equal(num(100 * cuenta(desc(q[1]))[q[2]] * MA[q[2]] / M(desc(q[1])), 1), q[3], a.error.explicacion);
    }
    if (['moles-moleculas', 'gramos-moleculas'].includes(p._datos.tipo)) assert.ok(!/Na|K|Ca|Mg|Fe/.test(p._datos.f), `${p._datos.f}: iónico, sin moléculas`);
  }
});

// Cierre (20 nov, rutinas/auditoria/quimica.mol-y-composicion.md): la N de entidades no se cruza con la del nitrógeno, el
// Dato de la empírica cubre los cocientes que salen (,5, ,33 y ,67) y un resultado redondeado va con «≈».
test('cierre: masas sin «=», N con su glosa, el Dato de la empírica completo y «≈» en lo redondeado', () => {
  const pl = x => (Array.isArray(x) ? x.map(pl).join('') : x && typeof x === 'object' ? String(x.t ?? '') : String(x ?? ''));
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), d = `${idea} ${s}`;
    for (const x of p.datos.filter(x => /^Masas atómicas/.test(x))) assert.ok(!/=/.test(x), `${d}: ${x}`);
    for (const x of p.datos.filter(x => /^N = n/.test(x))) assert.match(x, /N: número de entidades/, d);
    if (/empírica\?/.test(pl(p.pregunta))) assert.ok(p.datos.some(x => /,33 o ,67/.test(x)), d);
    // «N(O) = 0,00852 · 6 · 6,02 × 10²³ = 3,078 × 10²²» era falsa con los números que se ven (da 3,077): va con «≈».
    if (p._datos.tipo === 'atomos-dosis') assert.match(pl(p.solucion[1]), /≈ [\d,]+ × 10/, d);
    if (p._datos.tipo === 'porcentaje') { const t = pl(p.solucion[1]), m = t.match(/100 · ([\d,]+) \/ ([\d,]+) (=|≈) ([\d,]+)/);
      const v = 100 * +m[1].replace(',', '.') / +m[2].replace(',', '.'), r = +m[4].replace(',', '.'); assert.equal(m[3], Math.abs(v - r) < 1e-9 ? '=' : '≈', `${d}: ${t}`); }
  }
});
test('verificación 27 nov: si la alternativa de la sal sin agua pasa de 100 % (MgSO₄·7H₂O, 105 %), su explicación dice que eso ya delata el error', () => {
  let vistas = 0;
  for (let s = 0; s < 3000; s++) {
    const p = gen.generar(s, { idea: 'composicion-formula-empirica' }); if (p._datos.tipo !== 'agua-hidrato') continue;
    for (const a of p.alternativas.filter(a => a.error && a.error.id === 'QM-HIDRATO-ANHIDRA')) {
      const pasa = +a.valor.replace(',', '.').replace(/\s*%/, '') > 100;
      assert.equal(/no puede pasar de 100 %/.test(a.error.explicacion), pasa, `${p._datos.f} ${a.valor}: ${a.error.explicacion}`);
      assert.ok(a.error.explicacion.split(/\s+/).length <= 30, a.error.explicacion);
      if (pasa) vistas++;
    }
  }
  assert.ok(vistas > 0);
});
