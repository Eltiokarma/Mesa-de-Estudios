// Pruebas del generador de estequiometría de examen: casos.json (verificados aparte, a ciegas), un recálculo
// independiente por otro camino en 600 problemas, el balance de cada ecuación y los problemas de papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---- Fórmulas: las masas molares se recalculan desde los átomos (no desde las tablas del generador) ----
const MA = { H: 1, Li: 7, C: 12, N: 14, O: 16, Na: 23, Mg: 24, S: 32, K: 39, Ca: 40, Cr: 52, Fe: 56, Cu: 63.5, Zn: 65, Ag: 108, Ba: 137, Pb: 207 };
const SUB = { '₀': 0, '₁': 1, '₂': 2, '₃': 3, '₄': 4, '₅': 5, '₆': 6, '₇': 7, '₈': 8, '₉': 9 };
function atomos(formula) {
  const s = [...formula].map(c => (c in SUB ? String(SUB[c]) : c)).join('');
  let i = 0;
  function grupo() {
    const cuenta = {};
    while (i < s.length && s[i] !== ')') {
      let parte;
      if (s[i] === '(') { i++; parte = grupo(); i++; }
      else { const m = /^[A-Z][a-z]?/.exec(s.slice(i)); if (!m) throw new Error(`fórmula rara: ${formula}`); i += m[0].length; parte = { [m[0]]: 1 }; }
      const n = /^\d+/.exec(s.slice(i)); const k = n ? Number(n[0]) : 1; if (n) i += n[0].length;
      for (const [e, c] of Object.entries(parte)) cuenta[e] = (cuenta[e] || 0) + c * k;
    }
    return cuenta;
  }
  return grupo();
}
const masaMolar = f => Object.entries(atomos(f)).reduce((s, [e, n]) => s + MA[e] * n, 0);
const cerca = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
// Electrones que pierde cada alcohol al oxidarse (por número de oxidación del carbono que cambia).
const ELECTRONES = { 'etanol-acido': 4, 'etanol-aldehido': 2, metanol: 2, isopropanol: 2 };

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'flotacion') {
    const M = gen.METALES[d.metal].M;
    if (d.sub === 'ley') {
      // Promedio ponderado de las leyes de las dos corrientes que salen (concentrado y relave).
      const masaRelave = d.mena - d.conc, leyRelave = d.relave / masaRelave * 100;
      return (d.conc * d.leyConc + masaRelave * leyRelave) / d.mena;
    }
    if (d.sub === 'relave') return (d.mena * 1000 * d.leyMena / 100) / M - (d.conc * 1000 * d.leyConc / 100) / M;
    return (d.leyConc / d.leyMena) * (d.conc / d.mena) * 100;           // razón de enriquecimiento × rendimiento en masa
  }
  if (d.tipo === 'mineral') {
    const m = gen.MINERALES.find(x => x.id === d.mineral);
    const mol = d.mena * 1e6 * d.pct / 100 / masaMolar(m.f);              // en mol, con la masa en gramos
    return mol * atomos(m.f)[m.metal] * MA[m.metal] * d.rendimiento / 100 / 1000;
  }
  if (d.tipo === 'atomos') {
    const x = gen.FUENTES.find(t => t.id === d.fuente), el = x.gas === 'SO₂' ? 'S' : 'C';
    const gramos = d.masa * (d.kilo ? 1000 : 1) * d.pureza / 100;
    const litros = gramos / masaMolar(x.f) * atomos(x.f)[el] * 22.4;
    return d.kilo ? litros / 1000 : litros;
  }
  if (d.tipo === 'termo') {
    const r = gen.TERMO.find(t => t.id === d.reaccion), dH = -r.dH;
    if (d.sub === 'producto') { const p = r.prods.find(x => x.f === d.producto); return d.masaProducto / (p.c * masaMolar(p.f)) * dH; }
    // Masa del primer producto que da cada reactivo; manda la menor. Luego, calor por gramo de ese producto.
    const p = r.prods[0];
    const porA = d.mA / masaMolar(r.A.f) / r.A.c * p.c * masaMolar(p.f), porB = d.mB / masaMolar(r.B.f) / r.B.c * p.c * masaMolar(p.f);
    const mP = Math.min(porA, porB) * d.rendimiento / 100;
    return mP * dH / (p.c * masaMolar(p.f));
  }
  if (d.tipo === 'redox') {
    // Por electrones: cada Cr pasa de +6 a +3 (gana 3 e⁻); cada alcohol pierde los suyos.
    const r = gen.REDOX.find(t => t.id === d.reaccion);
    const nCr = d.c * d.V / 1000;
    return nCr * 3 / ELECTRONES[d.reaccion] * masaMolar(r.ion[1][1]);
  }
  if (d.tipo === 'hidroxido') {
    const o = gen.OXIDOS.find(t => t.id === d.oxido);
    const metal = Object.keys(atomos(o.f)).find(e => e !== 'O');
    const nMetal = d.masa / masaMolar(o.f) * atomos(o.f)[metal];      // átomos de metal que pasan al hidróxido
    const porHid = atomos(o.hid)[metal], nHid = nMetal / porHid;
    if (d.sub === 'moles') return nHid;
    if (d.sub === 'agua') return nHid * masaMolar(o.hid) - d.masa;        // conservación de la masa
    const carga = atomos(o.hid).O / porHid;                                // OH⁻ por catión = carga del catión
    return nMetal * (1 + carga);
  }
  if (d.tipo === 'grasa') {
    const g = gen.GRASAS.find(t => t.id === d.grasa);
    return d.V * 1.26 / masaMolar('C₃H₈O₃') * masaMolar(g.f) * 100 / d.rendimiento;
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

test('casos.json cubre los siete tipos y todos los subtipos', () => {
  const k = new Set(casos.casos.map(c => c.entrada.tipo + (c.entrada.sub ? ':' + c.entrada.sub : '')));
  for (const t of ['flotacion:ley', 'flotacion:relave', 'flotacion:recuperacion', 'mineral', 'atomos', 'termo:producto', 'termo:limitante',
    'redox', 'hidroxido:moles', 'hidroxido:agua', 'hidroxido:iones', 'grasa']) assert.ok(k.has(t), `falta ${t}`);
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 25);
});

test('las masas molares de las tablas salen de los átomos', () => {
  for (const m of gen.MINERALES) assert.ok(cerca(m.M, masaMolar(m.f)), m.id);
  for (const x of gen.FUENTES) { assert.ok(cerca(x.M, masaMolar(x.f)), x.id); assert.ok(cerca(x.Mg, masaMolar(x.gas)), x.gas); }
  for (const o of gen.OXIDOS) { assert.ok(cerca(o.M, masaMolar(o.f)), o.id); assert.ok(cerca(o.Mh, masaMolar(o.hid)), o.hid); }
  for (const g of gen.GRASAS) assert.ok(cerca(g.M, masaMolar(g.f)), g.id);
  for (const r of gen.REDOX) { assert.ok(cerca(r.M, masaMolar(r.ion[1][1])), r.id); assert.ok(cerca(r.Mp, masaMolar(r.ion[4][1])), r.id); }
});

test('las ecuaciones están balanceadas (átomos, carga y masa)', () => {
  const balance = lista => {
    const t = {}; let carga = 0;
    for (const [c, fml, q = 0] of lista) { for (const [e, n] of Object.entries(atomos(fml))) t[e] = (t[e] || 0) + c * n; carga += c * q; }
    return { t, carga };
  };
  for (const r of gen.REDOX) {
    const ion = balance(r.ion), mol = balance(r.molecular);
    assert.ok(Object.values(ion.t).every(n => n === 0) && ion.carga === 0, `${r.id}: iónica sin balancear ${JSON.stringify(ion)}`);
    assert.ok(Object.values(mol.t).every(n => n === 0), `${r.id}: molecular sin balancear ${JSON.stringify(mol.t)}`);
    assert.equal(r.ion[1][0], r.alc); assert.equal(-r.ion[3][0], r.cr); assert.equal(-r.molecular[3][0], r.sal);
    assert.equal(r.cr, 2 * r.sal, `${r.id}: cada Cr₂(SO₄)₃ trae 2 Cr³⁺`);
    // electrones: 3 por Cr ganados = los que pierden los alcoholes
    assert.equal(r.cr * 3, r.alc * ELECTRONES[r.id], `${r.id}: electrones`);
  }
  for (const r of gen.TERMO) {
    const lista = [[r.A.c, r.A.f], [r.B.c, r.B.f], ...r.prods.map(p => [-p.c, p.f])];
    assert.ok(Object.values(balance(lista).t).every(n => n === 0), r.id);
    assert.equal(r.A.c * r.A.M + r.B.c * r.B.M, r.prods.reduce((s, p) => s + p.c * p.M, 0), `${r.id}: masa`);
  }
  for (const o of gen.OXIDOS) {
    const lista = [[1, o.f], [1, 'H₂O'], [-o.nh, o.hid]];
    assert.ok(Object.values(balance(lista).t).every(n => n === 0), o.id);
  }
  for (const g of gen.GRASAS) {
    // triglicérido + 3 H₂O → glicerol + 3 ácido: el ácido sale de la resta y debe tener 2 O.
    const a = atomos(g.f), acido = { C: (a.C - 3) / 3, H: (a.H + 6 - 8) / 3, O: (a.O + 3 - 3) / 3 };
    assert.ok(Number.isInteger(acido.C) && Number.isInteger(acido.H) && acido.O === 2, `${g.id}: ${JSON.stringify(acido)}`);
  }
});

test('salen los siete tipos, y el error ES20 aparece cuando el limitante tiene más moles', () => {
  const tipos = new Set(); let es20 = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo);
    if (p.alternativas.some(a => a.error && a.error.id === 'ES20')) es20++;
    for (const a of p.alternativas) assert.ok(!/\d\.\d/.test(a.texto), `semilla ${s}: punto decimal en ${a.texto}`);
  }
  assert.deepEqual([...tipos].sort(), ['atomos', 'flotacion', 'grasa', 'hidroxido', 'mineral', 'redox', 'termo']);
  assert.ok(es20 > 20, `ES20 solo apareció ${es20} veces`);
});

test('ningún id de error se repite dentro de un mismo problema', () => {
  for (let s = 0; s < 1000; s++) {
    const ids = gen.generar(s).alternativas.filter(a => a.error).map(a => a.error.id);
    assert.equal(new Set(ids).size, ids.length, `semilla ${s}: ${ids}`);
  }
});

test('salen todos los errores con nombre: ES21 y los iones de los óxidos', () => {
  const vistos = new Set();
  for (let s = 0; s < 3000; s++) for (const a of gen.generar(s).alternativas) if (a.error) vistos.add(a.error.id);
  for (const id of ['ES6', 'ES19', 'ES20', 'ES21', 'AQ-solo-aniones', 'AQ-oxido-disociado', 'AQ-cuenta-oxido', 'AQ-cuenta-atomos', 'AQ-dh-negativo-absorbe-sin-coeficiente'])
    assert.ok(vistos.has(id), `no salió ${id}`);
});

test('en termoquímica siempre está la opción del signo al revés (se absorbe)', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'termo') continue;
    assert.ok(p.alternativas.some(a => /absorben/.test(a.texto)), `semilla ${s}`);
    assert.ok(p.alternativas.find(a => a.correcta).texto.startsWith('Se liberan'), `semilla ${s}`);
  }
});

// ---- Papel (regla 6) ----
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
const leer = (o, ruta) => ruta.split('.').reduce((x, k) => x[k], o);
test('papel.json: entre 6 y 8 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 6 && papel.problemas.length <= 8);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
    const todo = [p.enunciado, p.respuesta, ...p.pasos].join(' ');
    assert.ok(!/\d\.\d/.test(todo), `${p.id}: coma decimal`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: la respuesta coincide con el generador`, () => {
  for (const x of p.verificar) {
    const r = gen[x.fn](...x.args);
    for (const [k, esp] of Object.entries(x.espera)) {
      const val = leer(r, k);
      if (typeof esp === 'number') assert.ok(Math.abs(val - esp) <= Math.max(0.005, 1e-4 * Math.abs(esp)), `${p.id} ${k}: ${val} ≠ ${esp}`);
      else assert.equal(val, esp, `${p.id} ${k}`);
    }
  }
});
