// Pruebas del generador de miliequivalentes, ppm y porcentajes: casos.json (verificados aparte, a
// ciegas), papel.json y un recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- Camino independiente ----------
// Las masas molares salen de las masas atómicas de academia y de la fórmula, no de las tablas del
// generador. Todo se cuenta en unidades del SI de química (mol, Eq, L, g) y se pasa a lo que pide la
// pregunta solo al final. Las cargas se cuentan como «moles de carga» del ion.
const AT = { H: 1, C: 12, O: 16, Na: 23, Mg: 24, S: 32, Cl: 35.5, K: 39, Ca: 40, Ag: 108, N: 14 };
const masa = comp => Object.entries(comp).reduce((s, [el, n]) => s + AT[el] * n, 0);
// Sal: catión [elemento o grupo, cuántos, carga], anión [..].
const GRUPO = { Cl: { Cl: 1 }, SO4: { S: 1, O: 4 }, HCO3: { H: 1, C: 1, O: 3 }, Na: { Na: 1 }, K: { K: 1 }, Ca: { Ca: 1 }, Mg: { Mg: 1 } };
const SAL = {
  NaCl: [['Na', 1, 1], ['Cl', 1, -1]], KCl: [['K', 1, 1], ['Cl', 1, -1]], CaCl2: [['Ca', 1, 2], ['Cl', 2, -1]],
  MgCl2: [['Mg', 1, 2], ['Cl', 2, -1]], Na2SO4: [['Na', 2, 1], ['SO4', 1, -2]], K2SO4: [['K', 2, 1], ['SO4', 1, -2]],
  MgSO4: [['Mg', 1, 2], ['SO4', 1, -2]], NaHCO3: [['Na', 1, 1], ['HCO3', 1, -1]],
};
const masaSal = s => SAL[s].reduce((t, [g, n]) => t + n * masa(GRUPO[g]), 0);
const parte = (s, cual) => SAL[s][cual === 'cat' ? 0 : 1];
const eqPorMol = (s, cual) => { const [, n, z] = parte(s, cual); return n * Math.abs(z); };  // Eq del ion por mol de sal
const FORM = { CaCO3: { Ca: 1, C: 1, O: 3 }, Na2CO3: { Na: 2, C: 1, O: 3 }, MgCO3: { Mg: 1, C: 1, O: 3 }, K2CO3: { K: 2, C: 1, O: 3 },
  HCl: { H: 1, Cl: 1 }, H2SO4: { H: 2, S: 1, O: 4 }, dis: { C: 12, H: 22, O: 11 }, glucosa: { C: 6, H: 12, O: 6 } };
const HACIDOS = { HCl: 1, H2SO4: 2 };

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'meq': {
      const mol = d.dado === 'M' ? d.M * d.V / 1000 : (d.pct / 100 * d.V) / masaSal(d.sal);
      return mol * eqPorMol(d.sal, d.ion) * 1000;
    }
    case 'volumen': return (d.N / 1000) / (d.M * eqPorMol(d.sal, d.ion)) * 1000;
    case 'mezcla': {
      const eq = d.M1 * d.V1 / 1000 * eqPorMol(d.s1, d.ion) + d.M2 * d.V2 / 1000 * eqPorMol(d.s2, d.ion);
      return d.sub === 'total' ? eq * 1000 : eq * 1000 / ((d.V1 + d.V2) / 1000);
    }
    case 'preparar': {
      // Sistema 2×2 en litros: catión +2 solo de B; Cl⁻ de A (1 por fórmula) y de B (2 por fórmula).
      const L = d.Vf / 1000, eqCat = d.y / 1000 * L, eqCl = d.w / 1000 * L;
      const a11 = d.MA, a12 = 2 * d.MB, a21 = 0, a22 = 2 * d.MB;   // filas: Cl⁻ y catión +2
      const det = a11 * a22 - a12 * a21;
      const VA = (eqCl * a22 - a12 * eqCat) / det, VB = (a11 * eqCat - a21 * eqCl) / det;
      return (d.sub === 'A' ? VA : VB) * 1000;
    }
    case 'masa': return (d.X / 1000 * d.V / 1000) / eqPorMol(d.sal, 'cat') * masaSal(d.sal) * 1000;
    case 'igualar': {
      const eq = d.X / 1000 * d.Vs / 1000;
      const g = eq / eqPorMol(d.sal, 'cat') * masaSal(d.sal);  // gramos de sal que hacen falta
      return g / (d.p / 100);                                    // el suero trae p/100 g por mL
    }
    case 'precipitacion': {
      const mol = d.c * d.Vt / 1000;
      if (d.sub === 'precipitado') return mol * (AT.Ag + AT.Cl) * 1000;
      return mol * AT.Cl * 1000 / (d.Vm / 1000);
    }
    case 'ppmMasa': {
      const kgAgua = d.V * 1000;                 // 1 m³ de agua ≈ 1000 kg
      if (d.sub === 'ppm') return d.m * 1000 / kgAgua;   // mg por kg
      const mg = d.ppm * kgAgua;
      return d.unidad === 'g' ? mg / 1000 : mg / 1e6;
    }
    case 'ppmGas': {
      const nAire = d.P * 1000 / (0.082 * (d.t + 273));   // mol de aire en 1 m³ = 1000 L
      const mol = nAire * d.X / 1e6;
      return mol * { 'mol/m³': 1, 'mmol/m³': 1e3, 'µmol/m³': 1e6 }[d.unidad];
    }
    case 'volumen-pct': {
      if (d.sub === 'agua') return d.V - d.V * d.a / 100;
      const fr = (d.V1 * d.a1 + d.V2 * d.a2) / 100 / (d.V1 + d.V2);
      return fr * 100;
    }
    case 'jarabe': {
      const M = masa(d.azucar === 'glucosa' ? FORM.glucosa : FORM.dis);
      return d.p * 10 / M;
    }
    case 'carbonato': {
      const molH = 2 * d.n;                                    // CO₃²⁻ toma dos H⁺
      const g = molH / HACIDOS[d.acido] * masa(FORM[d.acido]);
      return g / (d.p / 100);
    }
  }
  throw new Error('tipo desconocido ' + d.tipo);
}
const igual = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a));
probarGenerador(gen, { semillas: 600, recalcular, igual });

// ---------- casos.json ----------
for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia * Math.max(1, Math.abs(c.esperado.respuesta)), `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}
test('casos.json cubre todos los tipos y subtipos', () => {
  const k = new Set(casos.casos.map(c => c.entrada.tipo + (c.entrada.sub ? '/' + c.entrada.sub : '')));
  for (const t of ['meq', 'volumen', 'mezcla/porL', 'mezcla/total', 'preparar/A', 'preparar/B', 'masa', 'igualar', 'precipitacion/precipitado',
    'precipitacion/cloruro', 'ppmMasa/masa', 'ppmMasa/ppm', 'ppmGas', 'volumen-pct/agua', 'volumen-pct/mezcla', 'jarabe', 'carbonato']) assert.ok(k.has(t), `falta ${t}`);
});

// ---------- tablas del generador ----------
test('las masas molares del generador salen de las masas atómicas', () => {
  for (const s of Object.keys(gen.SALES)) assert.ok(Math.abs(gen.SALES[s].M - masaSal(s)) < 1e-9, s);
  for (const c of Object.keys(gen.CARB)) assert.equal(gen.CARB[c].M, masa(FORM[c]), c);
  for (const a of Object.keys(gen.ACIDO)) assert.equal(gen.ACIDO[a].M, masa(FORM[a]), a);
  for (const [k, a] of Object.entries(gen.AZUCAR)) assert.equal(a.M, masa(k === 'glucosa' ? FORM.glucosa : FORM.dis), k);
  assert.equal(gen.GAS.CO.M, 28); assert.equal(gen.GAS.SO2.M, 64); assert.equal(gen.GAS.NO2.M, 46); assert.equal(gen.GAS.O3.M, 48);
  // Electroneutralidad: catión y anión aportan los mismos Eq por mol de sal.
  for (const s of Object.keys(SAL)) assert.equal(eqPorMol(s, 'cat'), eqPorMol(s, 'an'), s);
});

// ---------- forma de las alternativas ----------
test('salen los doce tipos, con la misma unidad en todas las alternativas y sin porcentajes imposibles', () => {
  const tipos = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo);
    const u = new Set(p.alternativas.map(a => a.texto.replace(/^[−\d ,]+/, '')));
    assert.equal(u.size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
    assert.equal([...u][0], p.respuesta.unidad, `semilla ${s}`);
    if (p.respuesta.unidad === '% v/v') for (const a of p.alternativas) assert.ok(a.valor < 100, `semilla ${s}: ${a.texto}`);
    // Toda variable usada tiene color, y los colores no se repiten dentro de un problema.
    const cols = Object.values(p.variables).map(x => x.color);
    assert.equal(new Set(cols).size, cols.length, `semilla ${s}: colores repetidos`);
    for (const campo of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of campo) if (x && x.v) assert.ok(p.variables[x.v], `semilla ${s}: variable ${x.v} sin declarar`);
  }
  assert.equal(tipos.size, 12);
});

test('las trampas del examen aparecen: olvidar la carga, el ion común, el volumen final, Cl₂, m³ y °C, el 1:1', () => {
  const vistos = new Set();
  for (let s = 0; s < 1500; s++) for (const a of gen.generar(s).alternativas) if (a.error) vistos.add(a.error.id);
  for (const id of ['SO15', 'SO14', 'SO7', 'ES12', 'BMH5', 'QA-ion-comun-una-sal', 'QA-volumen-final', 'QA-cl2-molecular', 'QA-m3-litros', 'QA-celsius', 'QA-eq-por-meq', 'QA-soluto-solvente'])
    assert.ok(vistos.has(id), `no aparece ${id}`);
});

// ---------- papel.json ----------
test('papel.json: entre 5 y 10 problemas con pasos, y sus cuentas salen con CALC', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const q of papel.problemas) {
    assert.ok(q.enunciado && q.respuesta && q.pasos.length >= 2, q.id);
    for (const ver of q.verificar || []) {
      let r = gen.CALC[ver.fn](...ver.args);
      if (typeof r === 'number') r = { valor: r };
      for (const [k, esp] of Object.entries(ver.espera)) assert.ok(Math.abs(r[k] - esp) <= 1e-6 * Math.max(1, Math.abs(esp)), `${q.id}: ${ver.fn}.${k} = ${r[k]}, se esperaba ${esp}`);
    }
    assert.ok((q.verificar || []).length > 0, `${q.id}: sin verificar`);
  }
});
