// Prueba propia de «Mol, masa molar y composición» (etapa 8, 20 nov 2026). Lo que el validador común no ve:
//   - los colores del mapa de la unidad: m naranja, M y masa atómica turquesa, n violeta, N y porcentajes carmín, sin verde;
//   - lo que el juego reserva para Predice: sin magnesio (idea 1), sin paréntesis (idea 3), sin metano (idea 4), solo C y H
//     (idea 5), sin CO ni CO₂ (idea 6);
//   - cada misión la cumple solo lo que dice;
//   - en 400 semillas de «Ahora tú» y en «Así se resuelve»: una sola correcta, sin textos rotos, y la respuesta rehecha aquí
//     con tablas propias (masas atómicas redondeadas, Nₐ = 6,02 × 10²³, un lector de fórmulas propio), no con el motor;
//   - las explicaciones que dan un número dan el de su error;
//   - las respuestas de los ejemplos, rehechas aparte; las letras de nivel 3 repartidas (6 de cada una).
const test = require('node:test');
const assert = require('node:assert/strict');
const def = require('./mol-y-composicion.js');
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? (x.t !== undefined ? String(x.t) : x.negrita ? plano(x.negrita) : x.llave ? plano(x.llave) : x.frac ? `${plano(x.frac[0])}/${plano(x.frac[1])}` : x.sub ? plano(x.sub) : '') : String(x ?? ''));
const idea = id => def.ideas.find(i => i.id === id);
const casos = i => { const lista = [{}]; for (const c of i.juega.controles) { const vals = c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => +(c.min + k * c.paso).toFixed(6));
  const nueva = []; for (const v of lista) for (const x of vals) nueva.push(Object.assign({}, v, { [c.id]: x })); lista.splice(0, lista.length, ...nueva); } return lista; };

// ---------- Tablas propias ----------
const MA = { H: 1, C: 12, N: 14, O: 16, F: 19, Na: 23, Mg: 24, Al: 27, P: 31, S: 32, Cl: 35.5, K: 39, Ca: 40, Cr: 52, Mn: 55, Fe: 56, Cu: 63.5, Zn: 65, Ba: 137 };
const NAV = 6.02e23;
const SUBS = '₀₁₂₃₄₅₆₇₈₉', SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const ascii = t => t.replace(/[₀-₉]/g, c => SUBS.indexOf(c));
function at(f) {
  const out = {}; let [sal, agua] = ascii(f).split('·');
  for (let g = 0; g < 5; g++) sal = sal.replace(/\(([^()]+)\)(\d*)/, (x, a, n) => a.repeat(+n || 1));
  for (const [, e, n] of sal.matchAll(/([A-Z][a-z]?)(\d*)/g)) out[e] = (out[e] || 0) + (+n || 1);
  if (agua) { const [, n] = agua.match(/^(\d*)/); out.H = (out.H || 0) + 2 * (+n || 1); out.O = (out.O || 0) + (+n || 1); }
  return out;
}
const M = f => Object.entries(at(f)).reduce((s, [e, k]) => s + MA[e] * k, 0);
const tot = f => Object.values(at(f)).reduce((a, b) => a + b, 0);
const leer = t => +t.replace(/\s/g, '').replace(',', '.');
// «1,505 × 10²⁴» → número
const sci = t => { const m = t.match(/([\d,]+) × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/); return leer(m[1]) * 10 ** +m[2].replace('⁻', '-').replace(/[⁰-⁹¹²³]/g, c => SUPS.indexOf(c)); };
const valor = t => (/× 10/.test(t) ? sci(t) : leer(t.match(/[\d\s]*\d(?:,\d+)?/)[0]));
const cerca = (a, b, rel = 2e-3) => Math.abs(a - b) <= rel * Math.abs(b) + 1e-9;
const ELEM = { hidrógeno: 'H', carbono: 'C', nitrógeno: 'N', oxígeno: 'O', sodio: 'Na', magnesio: 'Mg', aluminio: 'Al', fósforo: 'P', azufre: 'S', potasio: 'K', calcio: 'Ca', cromo: 'Cr', hierro: 'Fe', cobre: 'Cu', zinc: 'Zn', bario: 'Ba' };
const F = '([A-Z(][A-Za-z0-9₀-₉()·]*)';
function empirica(pct) {
  const n = Object.fromEntries(Object.entries(pct).map(([e, x]) => [e, x / MA[e]])), mn = Math.min(...Object.values(n));
  for (let k = 1; k <= 6; k++) { const r = Object.values(n).map(x => x / mn * k); if (r.every(x => Math.abs(x - Math.round(x)) < 0.03)) return Object.fromEntries(Object.keys(n).map((e, i) => [e, Math.round(r[i])])); }
  return null;
}
const igualesAt = (a, b) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());

// Rehace la respuesta de una pregunta de «Ahora tú» con las tablas de aquí. Devuelve un comprobador del texto correcto.
function esperado(id, p, ok) {
  let m;
  switch (id) {
    case 'masa-atomica-promedio':
      if ((m = p.match(/(\d+) % con número de masa (\d+) y (\d+) % con número de masa (\d+)/))) return cerca(valor(ok), (+m[1] * +m[2] + +m[3] * +m[4]) / 100, 1e-4);
      if ((m = p.match(/números de masa (\d+), (\d+) y (\d+), con abundancias de (\d+) %, (\d+) % y (\d+) %/))) return cerca(valor(ok), (+m[1] * +m[4] + +m[2] * +m[5] + +m[3] * +m[6]) / 100, 1e-4);
      if ((m = p.match(/números de masa (\d+) y (\d+), y su masa atómica es ([\d,]+) u/))) return cerca(valor(ok), 100 * (+m[2] - leer(m[3])) / (+m[2] - +m[1]), 1e-3);
      if ((m = p.match(/pesa (\d+)\/(\d+) de lo|pesa (\d+) veces lo/))) return cerca(valor(ok), 12 * (m[3] ? +m[3] : +m[1] / +m[2]), 1e-3);
      break;
    case 'mol-masa-molar':
      if ((m = p.match(new RegExp(`moles hay en ([\\d,]+) g de ${F}\\?`)))) return cerca(valor(ok), leer(m[1]) / M(m[2]));
      if ((m = p.match(new RegExp(`gramos pesan ([\\d,]+) mol de ${F}\\?`)))) return cerca(valor(ok), leer(m[1]) * M(m[2]));
      if ((m = p.match(new RegExp(`moléculas hay en ([\\d,]+) mol de ${F}\\?`)))) return cerca(valor(ok), leer(m[1]) * NAV);
      if ((m = p.match(new RegExp(`una sola molécula de ${F}\\?`)))) return cerca(valor(ok), M(m[1]) / NAV);
      if ((m = p.match(new RegExp(`${F}, tiene (\\d+) mg`)))) return cerca(valor(ok), +m[2] / 1000 / M(m[1]) * NAV);
      break;
    case 'relaciones-en-formula':
      if ((m = p.match(new RegExp(`átomos de (\\S+) hay en ([\\d,]+) mol de ${F}\\?`))) && /moles/.test(p)) return cerca(valor(ok), leer(m[2]) * at(m[3])[ELEM[m[1]]]);
      if ((m = p.match(new RegExp(`átomos de (\\S+) hay en ([\\d,]+) g de ${F}\\?`)))) return cerca(valor(ok), leer(m[2]) / M(m[3]) * at(m[3])[ELEM[m[1]]]);
      if ((m = p.match(new RegExp(`¿Cuántos átomos de (\\S+) hay en ([\\d,]+) mol de ${F}\\?`)))) return cerca(valor(ok), leer(m[2]) * at(m[3])[ELEM[m[1]]] * NAV);
      if ((m = p.match(new RegExp(`el ${F} se separa en (\\S+) y (\\S+)\\. .* da ([\\d,]+) mol`)))) {
        const IONES = { 'Na2SO4': 3, 'K3PO4': 4, 'Mg(NO3)2': 3, '(NH4)2CO3': 3, 'Mg3(PO4)2': 5, 'Al(NO3)3': 4, 'Ba(OH)2': 3, 'Na3PO4': 4 };
        return cerca(valor(ok), leer(m[4]) * IONES[ascii(m[1])]);
      }
      break;
    case 'composicion-formula-empirica':
      if ((m = p.match(new RegExp(`masa del ${F} es agua\\?`)))) return cerca(valor(ok), 100 * 18 * +ascii(m[1]).match(/·(\d+)/)[1] / M(m[1]), 2e-3);
      if ((m = p.match(new RegExp(`masa del ${F} es (\\S+)\\?`)))) { const e = ELEM[m[2]]; return Math.abs(valor(ok) - 100 * at(m[1])[e] * MA[e] / M(m[1])) <= 0.051; }
      if ((m = p.match(new RegExp(`gramos de (\\S+) hay en ([\\d,]+) g de ${F}\\?`)))) { const e = ELEM[m[1]]; return Math.abs(valor(ok) - leer(m[2]) * at(m[3])[e] * MA[e] / M(m[3])) <= 0.0051; }
      if ((m = p.match(/óxido (\S+), de un metal X, tiene ([\d,]+) % de oxígeno/))) { const nX = /X₂/.test(m[1]) ? 2 : 1, nO = /O₃/.test(m[1]) ? 3 : /O₂/.test(m[1]) ? 2 : 1;
        return Math.abs((16 * nO * 100 / leer(m[2]) - 16 * nO) / nX - valor(ok)) < 0.05; }
      break;
    case 'formula-empirica-molecular':
      if ((m = p.match(/tiene (.+) en masa\. ¿Cuál es su fórmula empírica\?/))) { const pct = Object.fromEntries([...m[1].matchAll(/([\d,]+) % de ([A-Z][a-z]?)/g)].map(x => [x[2], leer(x[1])])); return igualesAt(at(ok), empirica(pct)); }
      if ((m = p.match(new RegExp(`fórmula empírica ${F} y masa molar ([\\d,]+) g/mol`)))) { const k = leer(m[2]) / M(m[1]), e = at(m[1]); return Number.isInteger(Math.round(k)) && cerca(k, Math.round(k)) && igualesAt(at(ok), Object.fromEntries(Object.entries(e).map(([x, n]) => [x, n * Math.round(k)]))); }
      if ((m = p.match(/tiene (.+) en masa, y masa molar ([\d,]+) g\/mol/))) { const pct = Object.fromEntries([...m[1].matchAll(/([\d,]+) % de ([A-Z][a-z]?)/g)].map(x => [x[2], leer(x[1])])); const e = empirica(pct), Me = Object.entries(e).reduce((s, [x, n]) => s + MA[x] * n, 0), k = Math.round(leer(m[2]) / Me);
        return igualesAt(at(ok), Object.fromEntries(Object.entries(e).map(([x, n]) => [x, n * k]))); }
      break;
    case 'leyes-ponderales':
      if ((m = p.match(/arden ([\d,]+) g de carbón con ([\d,]+) g de oxígeno/))) return cerca(valor(ok), leer(m[1]) + leer(m[2]));
      if ((m = p.match(/juntan ([\d,]+) g de vinagre y ([\d,]+) g de bicarbonato\. .* marca ([\d,]+) g/))) return cerca(valor(ok), leer(m[1]) + leer(m[2]) - leer(m[3]));
      if ((m = p.match(/muestra de ([\d,]+) g de .+ tiene ([\d,]+) g de (\S+)\. .* hay en ([\d,]+) g/))) return cerca(valor(ok), leer(m[2]) * leer(m[4]) / leer(m[1]));
      if ((m = p.match(/oxígeno del (\S+) y del (\S+)\?/))) { const o = f => { const a = at(f), x = Object.keys(a).find(e => e !== 'O'); return a.O / a[x]; }; const r = o(m[2]) / o(m[1]); const [a, b] = ok.split(' : ').map(Number); return cerca(b / a, r); }
      break;
  }
  return null;
}

test('lleva calidad 2 (cerrada el 20 nov tras el lector en frío y el auditor)', () => {
  assert.equal(def.calidad, 2);
});

test('colores del mapa: m naranja, M turquesa, n violeta, N y % carmín; nada en verde', () => {
  const visto = { 'c-o': new Set(), 'c-i': new Set(), 'c-f': new Set(), 'c-h': new Set() }, verde = [];
  const ir = (x, seen = new Set()) => { if (!x || typeof x !== 'object' || seen.has(x)) return; seen.add(x);
    if (x.v && x.t !== undefined) { if (x.v === 'c-d') verde.push(x.t); else if (visto[x.v]) visto[x.v].add(x.m || 'sin-m'); }
    if (x.color === 'd' || x.color === 'c-d') verde.push(JSON.stringify(x).slice(0, 40)); for (const v of Object.values(x)) ir(v, seen); };
  ir(def); for (const i of def.ideas) for (let s = 0; s < 60; s++) { ir(i.ahoraTu.generar(s)); ir(i.resuelve.generar(s)); for (const v of casos(i).slice(0, 30)) { ir(i.juega.lectura(v)); ir(i.juega.dibujo(v)); } }
  assert.deepEqual(verde, []);
  assert.deepEqual([...visto['c-o']].filter(m => m !== 'masa' && m !== 'sin-m'), []);
  assert.deepEqual([...visto['c-i']].filter(m => m !== 'molar' && m !== 'sin-m'), []);
  assert.deepEqual([...visto['c-f']].filter(m => m !== 'mol' && m !== 'sin-m'), []);
  assert.deepEqual([...visto['c-h']].filter(m => m !== 'num' && m !== 'pct' && m !== 'sin-m'), []);
});

test('el juego no adelanta la predicción', () => {
  const txt = i => casos(i).map(v => plano(i.juega.lectura(v)) + JSON.stringify(i.juega.dibujo(v).datos)).join(' ') + plano(i.juega.consigna) + plano(i.juega.mision.texto) + JSON.stringify(i.juega.controles);
  assert.ok(!/Mg|magnesio|24,3/.test(txt(idea('masa-atomica-promedio'))), 'idea 1: el magnesio es de Predice');
  assert.ok(!/azúcar[^,]*18 g|342/.test(plano(idea('mol-masa-molar').lee.tarjetas.map(t => t.texto))), 'idea 2: Lee no compara 18 g de azúcar');
  assert.ok(!/\(/.test(idea('relaciones-en-formula').juega.controles[0].opciones.map(o => o.valor).join('')), 'idea 3: sin paréntesis');
  assert.ok(!/CH₄|metano/.test(txt(idea('composicion-formula-empirica'))), 'idea 4: sin metano');
  assert.ok(!/N|O₃|óxido/.test(idea('formula-empirica-molecular').juega.controles.map(c => c.etiqueta).join('') + plano(idea('formula-empirica-molecular').juega.lectura({ x: 2, y: 3 }))), 'idea 5: solo C y H');
  assert.ok(!/CO₂|\bCO\b/.test(txt(idea('leyes-ponderales'))), 'idea 6: sin CO ni CO₂');
});

test('cada misión: no está cumplida al abrir y la cumple solo lo que dice', () => {
  const quien = { 'masa-atomica-promedio': v => v.n35 === 19, 'mol-masa-molar': v => v.k === 'H2O' && v.n === 5, 'relaciones-en-formula': v => v.k === 'H2SO4' && v.u === 2,
    'composicion-formula-empirica': v => v.k === 'SO2', 'formula-empirica-molecular': v => v.x === 1 && v.y === 3, 'leyes-ponderales': v => v.g === 36 };
  for (const i of def.ideas) for (const v of casos(i)) assert.equal(!!i.juega.mision.logrado(v), quien[i.id](v), `${i.id} ${JSON.stringify(v)}`);
  // Y la cuenta que la misión pide es la del juego: 19 de 25 dan 35,45 u; 5 mol de agua pesan 90 g.
  assert.match(plano(idea('masa-atomica-promedio').juega.lectura({ n35: 19 })), /35,45 u/);
  assert.ok(!/35,45/.test(plano(idea('masa-atomica-promedio').juega.lectura({ n35: 10 }))));
  assert.match(plano(idea('mol-masa-molar').juega.lectura({ k: 'H2O', n: 5 })), /= 90 g/);
});

test('Ahora tú y Así se resuelve, 400 semillas: una sola correcta, textos sanos y la respuesta rehecha aparte', () => {
  for (const i of def.ideas) {
    let rehechas = 0;
    for (let s = 0; s < 400; s++) {
      const c = i.ahoraTu.generar(s), d = `${i.id} ${s}`, p = plano(c.pregunta);
      assert.equal(c.opciones.filter(o => o.correcta).length, 1, d);
      assert.ok(c.opciones.length >= 3, `${d}: pocas opciones`);
      assert.equal(new Set(c.opciones.map(o => o.texto)).size, c.opciones.length, `${d}: opciones repetidas`);
      const todo = p + plano(c.opciones.map(o => o.texto + (o.siFuera || ''))) + plano(c.solucion.texto) + plano(c.solucion.ecuacion || '') + (c.datos || []).join(' ');
      assert.ok(!/NaN|undefined|null|\[object|Infinity/.test(todo), `${d}: ${todo.slice(0, 120)}`);
      const r = esperado(i.id, p, c.opciones.find(o => o.correcta).texto);
      assert.notEqual(r, false, `${d}: «${p}» → ${c.opciones.find(o => o.correcta).texto}`);
      if (r === true) rehechas++;
      // Ninguna opción incorrecta es también correcta según el recálculo.
      if (r === true) for (const o of c.opciones.filter(o => !o.correcta)) assert.notEqual(esperado(i.id, p, o.texto), true, `${d}: «${o.texto}» también sale correcta`);
    }
    assert.ok(rehechas >= 390, `${i.id}: solo ${rehechas} de 400 rehechas`);
    for (let s = 0; s < 40; s++) { const c = i.resuelve.generar(s); assert.ok(!/NaN|undefined|\[object/.test(plano(c.enunciado) + plano(c.pasos.map(x => [x.texto, x.ecuacion || ''])) + plano(c.respuesta)), `${i.id} resuelve ${s}`); }
  }
});

test('las explicaciones de los distractores dan el valor de su error', () => {
  for (let s = 0; s < 400; s++) {
    // Idea 1: «Pero 17,5 u sería con los dos igual de abundantes» es el valor de esa opción y el punto medio de las masas.
    const c1 = idea('masa-atomica-promedio').ahoraTu.generar(s);
    for (const o of c1.opciones.filter(o => o.id === 'simple')) { const m = o.siFuera.match(/Pero ([\d,]+) u sería/); if (m) assert.equal(`${m[1]} u`, o.texto); }
    // Idea 5: «C₅H₈ pesaría 68 g/mol» y «Con NO₂, N sería 30,4 %» son ciertos con las tablas de aquí.
    const c5 = idea('formula-empirica-molecular').ahoraTu.generar(s);
    for (const o of c5.opciones.filter(o => !o.correcta)) {
      const m = o.siFuera.match(/(\S+) pesaría ([\d,]+) g\/mol\.$/); if (m) assert.ok(cerca(M(m[1]), leer(m[2]), 1e-3), o.siFuera);
      const q = o.siFuera.match(/Con (\S+), ([A-Z][a-z]?) sería ([\d,]+) %\.$/); if (q) assert.ok(Math.abs(100 * at(q[1])[q[2]] * MA[q[2]] / M(q[1]) - leer(q[3])) < 0.06, o.siFuera);
    }
    // Idea 2: «M no es X» es la suma sin subíndices; idea 4: «el porcentaje de átomos, a de t» con a y t de la fórmula.
    const c4 = idea('composicion-formula-empirica').ahoraTu.generar(s), f4 = plano(c4.pregunta).match(new RegExp(`del ${F} es`));
    for (const o of c4.opciones.filter(o => o.id === 'atomos')) { const m = o.siFuera.match(/(\d+) de (\d+)/); if (m && f4) assert.equal(+m[2], tot(f4[1]), o.siFuera); }
  }
});

// Respuestas de los ejemplos, rehechas con las tablas de aquí (las cuentas «a mano» de cada constante EJEMPLOS_*).
test('ejemplos: las respuestas numéricas rehechas aparte', () => {
  const r = (i, t) => plano(idea(i).ejemplos.find(e => e.titulo === t).respuesta);
  const tiene = (i, t, x, d = 2) => { const s = r(i, t).replace(/^[A-E], /, ''), v = valor(s); assert.ok(/× 10/.test(s) ? cerca(v, x, 2e-3) : Math.abs(v - x) <= 0.5 * 10 ** -d + 1e-9, `${t}: ${r(i, t)} contra ${x}`); };
  const prom = l => l.reduce((s, [m, p]) => s + m * p / 100, 0);
  tiene('masa-atomica-promedio', 'El litio de las baterías', prom([[6.015, 7.59], [7.016, 92.41]]));
  tiene('masa-atomica-promedio', 'El cobre de los cables', prom([[62.930, 69.15], [64.928, 30.85]]));
  tiene('masa-atomica-promedio', 'Tres isótopos del silicio', prom([[27.977, 92.23], [28.976, 4.68], [29.974, 3.09]]));
  tiene('masa-atomica-promedio', 'El neón de los letreros', prom([[20, 90.5], [21, 0.3], [22, 9.2]]));
  tiene('masa-atomica-promedio', 'La masa que falta', (10.8 - 0.2 * 10) / 0.8);
  tiene('mol-masa-molar', 'Moles de agua', 54 / M('H2O'));
  tiene('mol-masa-molar', 'Masa molar con paréntesis', M('Ca(OH)2'));
  tiene('mol-masa-molar', 'La tableta de paracetamol', 500 / M('C8H9NO2'));
  tiene('mol-masa-molar', 'La cafeína de una taza', 0.095 / 194 * NAV);
  tiene('relaciones-en-formula', 'Un paréntesis que multiplica', 2 * at('Ca(NO3)2').O);
  tiene('relaciones-en-formula', 'El agua de un hidrato', 0.5 * at('CuSO4·5H2O').O);
  tiene('relaciones-en-formula', 'El fósforo de los huesos', 62 / M('Ca3(PO4)2') * 2 * NAV);
  tiene('relaciones-en-formula', 'El oxígeno del antibiótico', 1500 / M('C16H19N3O5S') * 5, 1);
  tiene('composicion-formula-empirica', 'El hierro de la herrumbre', 100 * 112 / M('Fe2O3'), 1);
  tiene('composicion-formula-empirica', 'La sal que se seca', 100 * MA.Cu / M('CuSO4'), 1);
  tiene('composicion-formula-empirica', 'El carbono de un flavonoide', 100 * 15 * 12 / M('C15H10O7'), 1);
  tiene('composicion-formula-empirica', 'El oxígeno de una muestra', 25 * 48 / M('CaCO3'));
  assert.ok(igualesAt(at(r('formula-empirica-molecular', 'Una razón de 1,5')), empirica({ Al: 52.9, O: 47.1 })));
  assert.ok(igualesAt(at(r('formula-empirica-molecular', 'El hidrocarburo del examen').replace(/^B, /, '')), empirica({ C: 81.8, H: 18.2 })));
  assert.ok(igualesAt(at(r('formula-empirica-molecular', 'El óxido del imán').replace(/^C, /, '')), empirica({ Fe: 72.4, O: 27.6 })));
  assert.ok(igualesAt(at(plano(idea('formula-empirica-molecular').predice.opciones.find(o => o.correcta).texto)), empirica({ N: 36.8, O: 63.2 })), 'la Predice del N₂O₃');
  tiene('leyes-ponderales', 'Proust al revés', 13 * 8 / 3.2, 1);
  tiene('leyes-ponderales', 'Otra muestra del mismo óxido', 63.5 * 15.9 / 79.5, 1);
});

test('letras de nivel 3 repartidas y nada de fórmulas imposibles en la molecular', () => {
  const n = {}, pos = (e) => { const t = plano(e.respuesta); const L = /^[A-E],/.test(t) ? t[0] : 'ABCDE'[e.alternativas.findIndex(a => t.startsWith(plano(a)))]; return L; };
  for (const i of def.ideas) for (const e of i.ejemplos.filter(e => e.alternativas)) { const L = pos(e); n[L] = (n[L] || 0) + 1; }
  assert.deepEqual(n, { A: 6, B: 6, C: 6, D: 6, E: 6 });
  // Una molecular de hidrocarburo con H impar no existe (C₆H₁₅): los factores k de cada empírica son los de moléculas reales.
  for (let s = 0; s < 400; s++) { const c = idea('formula-empirica-molecular').ahoraTu.generar(s), ok = plano(c.opciones.find(o => o.correcta).texto), a = at(ok);
    if (/molecular/.test(plano(c.pregunta)) && a.C && a.H && !a.O && !a.N) assert.equal(a.H % 2, 0, ok); }
});

// ---------- Cierre (20 nov): auditoría (rutinas/auditoria/quimica.mol-y-composicion.md) y lectores en frío ----------
// Cada prueba falla con la versión anterior (comprobado con una copia en el scratchpad del cierre, viejo/).
const datosDe = c => (c.datos || []).map(plano);
const todosLosDatos = () => { const l = []; for (const i of def.ideas) { for (const e of i.ejemplos) l.push([i.id, datosDe(e)]); l.push([i.id, (i.predice.datos || []).map(plano)]);
  for (let s = 0; s < 400; s++) l.push([i.id, datosDe(i.ahoraTu.generar(s))]); for (let s = 0; s < 12; s++) l.push([i.id, datosDe(i.resuelve.generar(s))]); } return l; };

test('cierre: la N del nitrógeno no se confunde con la N de entidades, y Nₐ se escribe de una sola forma', () => {
  for (const [id, ds] of todosLosDatos()) {
    // Las masas atómicas van sin «=»: «N 14», nunca «N = 14» junto a «N = n · Nₐ».
    for (const d of ds.filter(x => /^Masas atómicas/.test(x))) assert.ok(!/=/.test(d), `${id}: ${d}`);
    for (const d of ds.filter(x => /^N = n/.test(x))) assert.match(d, /N: número de entidades/, `${id}: ${d}`);
  }
  assert.match(plano(idea('mol-masa-molar').regla.texto), /N, el número de entidades/);
  const txt = JSON.stringify(def);
  assert.ok(!/"N","A"|N_A/.test(txt), 'N_A en algún sitio: va Nₐ');
  // «N(N)» no: el nitrógeno contado se nombra en palabras.
  for (let s = 0; s < 400; s++) assert.ok(!/N\(N\)/.test(plano(idea('relaciones-en-formula').ahoraTu.generar(s).solucion.ecuacion)), `semilla ${s}`);
});

// Lee «a · b + c = d» con lo que se ve; «=» solo si da justo d (Etapa 5, regla 1: redondeos con «≈»).
const SUPS_ = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const planoEc = x => (Array.isArray(x) ? x.map(planoEc).join('') : x && typeof x === 'object' ? (x.frac ? `(${planoEc(x.frac[0])})/(${planoEc(x.frac[1])})` : plano(x)) : String(x ?? ''));
function cuentaLeida(t) {
  const e = t.replace(/(\d),(\d)/g, '$1.$2').replace(/(\d) (\d{3})(?!\d)/g, '$1$2').replace(/ × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (x, k) => `e${k.replace('⁻', '-').replace(/[⁰-⁹¹²³]/g, c => SUPS_.indexOf(c))}`)
    .replace(/[×·]/g, '*').replace(/−/g, '-').replace(/\s/g, '');
  if (!/^[\d.e+\-*/()]+$/.test(e) || !/[+\-*/]/.test(e.replace(/e-?\d+/g, ''))) return null;
  return Function(`return (${e})`)();
}
function igualdadesRedondeadas(ec) {
  const malas = [];
  const partes = planoEc(ec).split('   ·   ');
  for (const p of partes) {
    const lados = p.split(/ (=|≈) /);
    for (let k = 0; k + 2 < lados.length; k += 2) {
      if (lados[k + 1] !== '=') continue;
      const izq = lados[k].replace(/^.*?(?=[\d(][\d\s,.()×·+\-−/⁰-⁹⁻]*$)/, ''), der = (lados[k + 2].match(/^([\d\s]*\d(?:,\d+)?(?: × 10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)?)/) || [])[1];
      if (!der) continue; const v = cuentaLeida(izq); if (v === null) continue;
      const d = cuentaLeida(`${der}*1`); if (Math.abs(v - d) > 1e-9 * Math.max(1, Math.abs(d))) malas.push(`${izq} = ${der}`);
    }
  }
  return malas;
}
test('cierre: un resultado redondeado va con «≈», nunca con «=»', () => {
  const malas = [];
  for (const i of def.ideas) {
    for (const e of i.ejemplos) for (const s of e.solucion) malas.push(...igualdadesRedondeadas(s.ecuacion || '').map(x => `${i.id} «${e.titulo}»: ${x}`));
    for (const p of i.mira.pasos) malas.push(...igualdadesRedondeadas(p.ecuacion || '').map(x => `${i.id} mira: ${x}`));
    for (let s = 0; s < 12; s++) for (const p of i.resuelve.generar(s).pasos) malas.push(...igualdadesRedondeadas(p.ecuacion || '').map(x => `${i.id} resuelve: ${x}`));
    for (let s = 0; s < 400; s++) malas.push(...igualdadesRedondeadas(i.ahoraTu.generar(s).solucion.ecuacion || '').map(x => `${i.id} ahoraTu ${s}: ${x}`));
  }
  assert.deepEqual([...new Set(malas)].slice(0, 8), []);
  // Los aportes de un promedio, con sus tres decimales (antes «43,516 + 20,03»).
  assert.match(planoEc(idea('masa-atomica-promedio').ejemplos.find(e => e.titulo === 'El cobre de los cables').solucion.map(x => x.ecuacion || '')), /43,516 \+ 20,030/);
});

test('cierre: la balanza de la idea 2 sin el «1» suelto, con lo que hay en cada platillo y sin fórmulas en la letra sin serifa', () => {
  const Kit = require('../../../nucleo/kit/kit.js'); require('../../../nucleo/kit/piezas/balanza.js');
  const B = Kit.piezas.balanza, i = idea('mol-masa-molar');
  const sueltos = svg => [...svg.matchAll(/<text[^>]*>(\d)<\/text>/g)].map(m => m[1]);
  for (const v of casos(i)) { const d = i.juega.dibujo(v); assert.deepEqual(sueltos(B.dibujar(d.datos, d.estado)), [], JSON.stringify(v)); assert.ok(!/NaCl|CaCO|C₂H|C₁₂/.test(JSON.stringify(d.estado)), JSON.stringify(d.estado)); }
  for (const d of [i.predice.dibujo, i.predice.revelar]) assert.deepEqual(sueltos(B.dibujar(d.datos, d.estado)), []);
  assert.deepEqual(sueltos(B.dibujar(i.mira.datos, i.mira.pasos[0].estado)), []);
  assert.match(plano(i.mira.pasos[0].estado.rastros[0]), /agua.*azúcar/);
  assert.match(plano(i.predice.dibujo.estado.rastros[0]), /izquierda: agua/);
  assert.ok(!/lo mismo/.test(i.predice.voz), 'la voz de Predice repetía la opción «pesan lo mismo»');
  // La regla: la fila de la masa molar no va en la columna «átomo».
  assert.ok(!i.regla.dibujo.datos.filas.some(f => f.el === 'M'));
});

test('cierre: figuras y Datos que regalaban la respuesta', () => {
  // Idea 4, «Así se resuelve»: la barra no da los demás porcentajes (el pedido salía de restar a 100).
  for (let s = 0; s < 12; s++) { const r = idea('composicion-formula-empirica').resuelve.generar(s); const fila = r.dibujo.datos.filas[1];
    for (const t of fila.tramos) assert.ok(!/%/.test(t.texto), `${s}: ${t.texto}`); assert.ok(!/\d+,\d %/.test(r.dibujo.datos.alt), r.dibujo.datos.alt); }
  // Idea 6, Predice: la fila del CO₂ no dibuja el tramo del O (a la misma escala, su largo era 32 g).
  const p6 = idea('leyes-ponderales').predice.dibujo.datos.filas[1];
  assert.equal(p6.tramos.length, 1); assert.match(p6.titulo, /¿cuánto O\?/);
  // El Resumen de la idea 6 (simple del glosario) no dice «1 a 2» antes de la Predice del CO y el CO₂.
  assert.ok(!/1 a 2|2 a 3/.test(def.glosario.find(g => g.termino === 'proporciones múltiples').simple));
  // Idea 1, Predice: la barra del magnesio en orden, 24, 25, 26 (antes 25, 24, 26).
  assert.deepEqual(idea('masa-atomica-promedio').predice.dibujo.datos.filas[0].tramos.map(t => t.texto.slice(0, 4)), ['²⁴Mg', '²⁵Mg', '²⁶Mg']);
});

test('cierre: la regla dice lo que piden los ejercicios', () => {
  // Empírica: los casos dan cocientes de ,5, ,33 y ,67; el Dato y la regla los cubren (antes solo 1,5, 1,33 y 1,25).
  const e = idea('formula-empirica-molecular');
  assert.match(plano(e.regla.texto), /,33 o ,67/);
  for (let s = 0; s < 400; s++) { const c = e.ahoraTu.generar(s); if (/empírica\?$/.test(plano(c.pregunta)) || /masa molar/.test(plano(c.pregunta)) && c.datos.length > 2) assert.ok(c.datos.some(d => /,33 o ,67/.test(d)), `${s}: ${c.datos}`); }
  for (let s = 0; s < 5; s++) assert.ok(e.resuelve.generar(s).datos.some(d => /,5, todo por 2/.test(d)));
  // La lectura del juego simplifica la razón: «C : H = 2 : 4 = 1 : 2».
  assert.match(plano(e.juega.lectura({ x: 2, y: 4 })), /2\s:\s4 = 1\s:\s2/);
  assert.equal(plano(e.juega.lectura({ x: 1, y: 3 })).split('=').length, 2, 'CH₃ ya está simplificada: un solo «=»');
  // Leyes: Dalton con su entero pequeño a la vista y el «Vale si» que dice cuándo vale Lavoisier.
  const l = idea('leyes-ponderales');
  assert.match(plano(l.regla.texto), /enteros pequeños/); assert.match(plano(l.regla.ecuacion), /16 : 32 = 1 : 2/); assert.match(l.regla.condicion, /^el sistema está cerrado, como pide Lavoisier/);
  // Composición: «% = 100 · masa / M», con el 100 adelante (el «· 100» quedaba solo en otro renglón).
  const ec4 = idea('composicion-formula-empirica').regla.ecuacion; assert.equal(plano(ec4[ec4.length - 1].frac[0]).slice(0, 6), '100 · ');
  // Moles de átomos: el «Vale si» presenta el hidrato con un ejemplo.
  assert.match(idea('relaciones-en-formula').regla.condicion, /CuSO₄·5H₂O: 5 aguas por unidad/);
  // Masa atómica, Mira: dice que la lupa redondea 75,76 % a 19 de 25.
  assert.match(plano(idea('masa-atomica-promedio').mira.pasos[0].texto), /19/);
  // Leyes, juego: desde 18 g (con 9 g los rótulos H y O quedaban encimados).
  assert.ok(l.juega.controles[0].min >= 18);
});

test('cierre: tarjetas de ejemplos que el lector no pudo seguir', () => {
  const ej = (i, t) => idea(i).ejemplos.find(e => e.titulo === t), todo = e => plano([e.enunciado, e.datos, e.alternativas, e.solucion.map(s => [s.texto, s.ecuacion || '']), e.respuesta]);
  assert.ok(!/color a la cebolla morada/.test(todo(ej('composicion-formula-empirica', 'El carbono de un flavonoide'))), 'la quercetina no da el morado (son las antocianinas)');
  const zn = ej('leyes-ponderales', 'Proust al revés'); assert.ok(!/masa atómica del zinc/.test(todo(zn)) && !zn.alternativas.includes('65 g'), 'la E usaba la masa del Zn, que no está en Datos');
  assert.ok(!/aguas, 1: 9/.test(todo(ej('relaciones-en-formula', 'El agua de un hidrato'))));
  assert.ok(!/toma 2 mol de fosfato/.test(todo(ej('relaciones-en-formula', 'El fósforo de los huesos'))));
  assert.ok(!/cada masa pesa lo mismo/.test(todo(ej('masa-atomica-promedio', 'Verdadero o falso'))));
  assert.match(todo(ej('leyes-ponderales', 'El oxígeno del agua')), /8 g de oxígeno y 1 g de hidrógeno forman 9 g/);
  // La plata (nivel 2) ya no es la cuenta del cobre (nivel 1): falta una abundancia.
  const ag = ej('masa-atomica-promedio', 'La plata de una medalla'); assert.ok(!ag.datos.some(d => /48,16/.test(d)) && !/48,16/.test(ag.enunciado));
  // La magnetita: los moles con tres cifras, para que 1,725 / 1,293 dé 1,33 (con 1,73 / 1,29 salía 1,34).
  assert.match(todo(ej('formula-empirica-molecular', 'El óxido del imán')), /1,293.*1,725/);
});

// Verificación de la pasada de redacción (26 nov, rutinas/redaccion/quimica.mol-y-composicion.md): la B de la magnetita
// dice el redondeo que le da Fe₂O₃ (2 : 2,67 → 2 : 3); el laboratorio aclara que la molécula de más H del juego no existe;
// la tiza no se da por siempre carbonato; el papel viejo da el 22,4 L/mol que usa.
test('redacción: magnetita, molécula del juego, tiza y el 22,4 L/mol del papel', () => {
  const imán = def.ideas.flatMap(i => i.ejemplos).find(e => e.titulo === 'El óxido del imán');
  assert.match(plano(imán.solucion.map(x => x.texto)), /2 : 2,67 a 2 : 3/);
  const lab = JSON.stringify(def.laboratorio, (k, v) => (typeof v === 'function' ? undefined : v));
  assert.match(lab, /no existe/);
  const todo = JSON.stringify(def, (k, v) => (typeof v === 'function' ? undefined : v));
  assert.ok(!/Una tiza es casi toda carbonato|Toda tiza pura/.test(todo));
  const p10 = require('../../../plantillas/mol-composicion/papel.json').problemas.find(p => p.id === 'p10');
  assert.match(p10.enunciado, /22,4 L por mol/);
});
test('verificación 27 nov: regla de las leyes, Lee del porcentaje y la sal sin agua que pasa de 100 %', () => {
  const l = idea('leyes-ponderales'), r = plano(l.regla.texto);
  // Las leyes son anteriores a la teoría atómica: la regla las enuncia y después dice que los átomos las explican.
  assert.ok(!/no cambia, porque los átomos/.test(r) && /Los átomos lo explican/.test(r), r);
  // El caso del agua (11 g de H en 100 g) delataba la Predice del CH₄: más átomos de H no es más masa.
  const c = idea('composicion-formula-empirica'), lee = JSON.stringify(c.lee);
  assert.ok(!/agua hay unos 11 g de hidrógeno/.test(lee), lee);
  let vistas = 0;
  for (let s = 0; s < 400; s++) {
    const a = c.ahoraTu.generar(s); if (!/es agua\?$/.test(plano(a.pregunta))) continue;
    for (const o of a.opciones.filter(o => o.error === 'QM-HIDRATO-ANHIDRA')) {
      const pasa = +plano(o.texto).replace(',', '.').replace(/\s*%/, '') > 100;
      assert.equal(/no puede pasar de 100 %/.test(o.siFuera), pasa, `${plano(a.pregunta)} ${plano(o.texto)}: ${o.siFuera}`);
      if (pasa) vistas++;
    }
  }
  assert.ok(vistas > 0, 'ninguna semilla dio una sal sin agua de más de 100 %');
});
