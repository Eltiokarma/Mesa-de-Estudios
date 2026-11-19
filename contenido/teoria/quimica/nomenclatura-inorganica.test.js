// Prueba propia de «Nomenclatura inorgánica» (etapa 7, 19 nov 2026). Lo que el validador común no ve:
//   - los colores del mapa de la unidad: catión naranja, anión turquesa, EO violeta, carga carmín, sin verde;
//   - lo que el juego reserva para Predice: ninguna especie con dos átomos del elemento que falta (idea 1), sin plomo
//     (idea 2), sin peróxidos (idea 3), sin cloro (idea 4), sin ácidos -oso (idea 5), sin hidratos (idea 6);
//   - cada misión la cumple solo lo que dice;
//   - en 400 semillas de «Ahora tú»: una sola correcta y el EO rehecho con valores fijos propios (no los del motor);
//   - ninguna explicación de un distractor de la idea 1 da una suma que no es la de su valor;
//   - las letras de las respuestas de nivel 3 repartidas (6 de cada una) y el ícono de la unidad sin Fe₂O₃.
const test = require('node:test');
const assert = require('node:assert/strict');
const def = require('./nomenclatura-inorganica.js');
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? (x.t !== undefined ? String(x.t) : x.negrita ? plano(x.negrita) : x.llave ? plano(x.llave) : '') : String(x ?? ''));
const idea = id => def.ideas.find(i => i.id === id);
const casos = i => { const ctrl = i.juega.controles; const lista = [{}]; for (const c of ctrl) { const vals = c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => c.min + k * c.paso);
  const nueva = []; for (const v of lista) for (const x of vals) nueva.push(Object.assign({}, v, { [c.id]: x })); lista.splice(0, lista.length, ...nueva); } return lista; };

test('colores del mapa: EO violeta, carga carmín, catión naranja, anión turquesa; nada en verde', () => {
  const visto = { 'c-f': new Set(), 'c-h': new Set(), 'c-o': new Set(), 'c-i': new Set() }, verde = [];
  const ir = (x, seen = new Set()) => { if (!x || typeof x !== 'object' || seen.has(x)) return; seen.add(x);
    if (x.v && x.t !== undefined) { if (x.v === 'c-d') verde.push(x.t); else if (visto[x.v]) visto[x.v].add(x.m || 'sin-m'); }
    if (x.color === 'd' || x.color === 'c-d') verde.push(JSON.stringify(x).slice(0, 40)); for (const v of Object.values(x)) ir(v, seen); };
  ir(def); for (const i of def.ideas) for (let s = 0; s < 60; s++) { ir(i.ahoraTu.generar(s)); if (i.resuelve) ir(i.resuelve.generar(s)); }
  assert.deepEqual(verde, []);
  assert.deepEqual([...visto['c-f']].filter(m => m !== 'eo' && m !== 'sin-m'), [], 'el violeta es del EO');
  assert.deepEqual([...visto['c-h']].filter(m => m !== 'carga' && m !== 'sin-m'), [], 'el carmín es de la carga');
  assert.deepEqual([...visto['c-o']].filter(m => m !== 'cation' && m !== 'sin-m'), []);
  assert.deepEqual([...visto['c-i']].filter(m => m !== 'anion' && m !== 'sin-m'), []);
});

test('el juego no adelanta la predicción', () => {
  const txt = i => casos(i).map(v => plano(i.juega.lectura(v)) + JSON.stringify(i.juega.dibujo(v).datos)).join(' ') + plano(i.juega.consigna) + plano(i.juega.mision.texto) + JSON.stringify(i.juega.controles);
  const t1 = txt(idea('estados-oxidacion'));
  for (const f of ['Fe₂O₃', 'Fe', 'Cr₂O₇']) assert.ok(!t1.includes(f), `idea 1: el juego muestra ${f}`);
  assert.ok(!/Pb|plomo/.test(txt(idea('tres-nombres'))), 'idea 2: el plomo es de Predice');
  assert.ok(!/O₂²⁻|peróxido|BaO₂|H₂O₂/.test(txt(idea('peroxidos-hidruros'))), 'idea 3: sin peróxidos');
  assert.ok(!/Cl|cloro/.test(txt(idea('arbol-funciones'))), 'idea 4: sin cloro');
  assert.ok(!/ito\b|NO₂⁻|SO₃²⁻/.test(txt(idea('sales'))), 'idea 5: sin aniones -ito');
  assert.ok(!/H₂O|hidrat/.test(txt(idea('sales-acidas-basicas-hidratadas'))), 'idea 6: sin hidratos');
});

test('cada misión: no está cumplida al abrir y la cumple solo lo que dice', () => {
  const quien = { 'estados-oxidacion': v => v.k === 'NH4' && v.eo === -3, 'tres-nombres': v => v.k === 'Cu1', 'peroxidos-hidruros': v => v.k === 'NaH' || v.k === 'CaH2',
    'arbol-funciones': v => v.k === 'N3' || v.k === 'N5', sales: v => v.c === 'Al' && v.a === 'SO4' && v.nc === 2 && v.na === 3, 'sales-acidas-basicas-hidratadas': v => v.k === 'MgOHCl' };
  for (const i of def.ideas) for (const v of casos(i)) assert.equal(!!i.juega.mision.logrado(v), quien[i.id](v), `${i.id} ${JSON.stringify(v)}`);
});

// EO con valores fijos propios: O −2, H +1 (−1 en un hidruro de metal), grupo 1 +1, grupo 2 y Zn +2, Al +3, F −1; un
// grupo SO₄ entero vale −2 cuando se pregunta por otro elemento.
const SUB = '₀₁₂₃₄₅₆₇₈₉', SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const asc = t => t.replace(/[₀-₉]/g, x => SUB.indexOf(x)).replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/, (m, d, q) => `^${d.split('').map(x => SUP.indexOf(x)).join('')}${q === '⁺' ? '+' : '-'}`);
function atomos(f) { const c = {}; const parse = (t, k) => { let i = 0; while (i < t.length) { if (t[i] === '(') { let d = 1, j = i + 1; while (d) { if (t[j] === '(') d++; if (t[j] === ')') d--; j++; } const m = t.slice(j).match(/^\d*/)[0]; parse(t.slice(i + 1, j - 1), k * (+m || 1)); i = j + m.length; continue; }
  const m = t.slice(i).match(/^([A-Z][a-z]?)(\d*)/); if (!m) { i++; continue; } c[m[1]] = (c[m[1]] || 0) + k * (+m[2] || 1); i += m[0].length; } }; parse(f, 1); return c; }
const FIJO = { O: -2, F: -1, Li: 1, Na: 1, K: 1, Ca: 2, Mg: 2, Ba: 2, Zn: 2, Al: 3 }, METAL = Object.keys(FIJO).filter(k => FIJO[k] > 0);
function eo(f, x, z) {
  if (x !== 'S' && /SO4/.test(f)) { const k = f.match(/SO4/g).length; return eo(f.replace(/SO4/g, ''), x, z + 2 * k); }
  const at = atomos(f), els = Object.keys(at), metal = els.some(e => METAL.includes(e));
  if (x === 'O' && els.length === 2 && metal && at.O === 2 && !els.includes('H')) { const m = els.find(e => e !== 'O'); if (FIJO[m] * at[m] === 2) return -1; }
  if (x === 'O' && f === 'H2O2') return -1;
  let s = 0; for (const e of els) if (e !== x) s += (e === 'H' ? (metal && els.length === 2 ? -1 : 1) : FIJO[e]) * at[e];
  return (z - s) / at[x];
}
const sg = v => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0');
const cargaDe = f => (f.includes('^') ? (+(f.match(/\^(\d*)/)[1] || 1)) * (f.endsWith('+') ? 1 : -1) : 0);

test('Ahora tú, 400 semillas: una sola correcta, sin repetidas, y el EO rehecho aparte', () => {
  for (const i of def.ideas) for (let s = 0; s < 400; s++) {
    const c = i.ahoraTu.generar(s), d = `${i.id} ${s}`, p = plano(c.pregunta);
    assert.equal(c.opciones.filter(o => o.correcta).length, 1, d);
    assert.equal(new Set(c.opciones.map(o => o.texto)).size, c.opciones.length, `${d}: opciones repetidas`);
    assert.ok(!/NaN|undefined|null|\[object/.test(p + plano(c.opciones.map(o => o.texto + (o.siFuera || ''))) + plano(c.solucion.texto) + plano(c.solucion.ecuacion || '') + (c.datos || []).join(' ')), d);
    const m = p.match(/tiene el ([A-Z][a-z]?) en el (\S+?)( \(cada átomo\))?\?$/);
    if (m) {
      const f = asc(m[2]), z = cargaDe(f), cu = f.split('^')[0], v = eo(cu, m[1], z), n = atomos(cu)[m[1]], ok = c.opciones.find(o => o.correcta);
      assert.equal(ok.texto, sg(v), `${d}: EO del ${m[1]} en ${m[2]}`);
      for (const o of c.opciones.filter(o => !o.correcta)) { const q = (o.siFuera || '').match(/la suma da(?:ría)? ([+−]?\d+)/);
        if (q) assert.equal(z - v * n + (+o.texto.replace('−', '-')) * n, +q[1].replace('−', '-'), `${d}: siFuera de ${o.texto}`); }
    }
    const q = p.match(/¿En cuál de estas especies el ([A-Z][a-z]?) tiene EO ([+−]?\d+)\?/);
    if (q) { const meta = +q[2].replace('−', '-'), cumplen = c.opciones.filter(o => { const f = asc(o.texto), cu = f.split('^')[0]; return Object.keys(atomos(cu)).length === 1 ? meta === 0 : eo(cu, q[1], cargaDe(f)) === meta; });
      assert.deepEqual(cumplen.map(o => !!o.correcta), [true], d); }
  }
});

test('letras de nivel 3 repartidas y el ícono de la unidad sin la respuesta de la idea 1', () => {
  const n = {}; for (const i of def.ideas) for (const e of i.ejemplos.filter(e => e.alternativas)) { const L = plano(e.respuesta)[0]; n[L] = (n[L] || 0) + 1; }
  assert.deepEqual(n, { A: 6, B: 6, C: 6, D: 6, E: 6 });
  const icono = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', '..', '..', 'app', 'dibujos', 'quimica.js'), 'utf8').match(/'quimica\.nomenclatura-inorganica'[\s\S]*?\n  \/\/ El mol/)[0];
  assert.ok(!/'Fe|Fe₂O₃/.test(icono.split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n')), 'el ícono no muestra Fe₂O₃');
});
