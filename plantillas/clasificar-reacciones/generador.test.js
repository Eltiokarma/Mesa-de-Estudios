// Pruebas del generador «¿Qué clase de reacción es?»: casos.json (verificados aparte, a ciegas), el papel,
// y un recálculo independiente en 600 problemas. El camino independiente no usa las reglas del generador:
//   - los números de oxidación salen de una tabla escrita a mano (NO) y se comprueba que cada fila sume
//     la carga de la especie;
//   - redox se decide por la variación neta de cada elemento con los coeficientes (electrones perdidos =
//     ganados), con una lista a mano de las que cambian dentro de un mismo elemento (dismutación y la
//     del azufre, donde la variación neta es cero);
//   - las clases por la forma salen de una tabla a mano (FORMAS_MANO), no de las reglas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- Números de oxidación escritos a mano (por átomo; promedio en los orgánicos) ----------
const NO = {
  CH4: { C: -4, H: 1 }, O2: { O: 0 }, CO2: { C: 4, O: -2 }, H2O: { H: 1, O: -2 }, C3H8: { C: -8 / 3, H: 1 },
  C6H12O6: { C: 0, H: 1, O: -2 }, C2H5OH: { C: -2, H: 1, O: -2 }, CO: { C: 2, O: -2 }, C: { C: 0 }, H2: { H: 0 },
  N2: { N: 0 }, NH3: { N: -3, H: 1 }, SO2: { S: 4, O: -2 }, SO3: { S: 6, O: -2 }, CaO: { Ca: 2, O: -2 },
  'Ca(OH)2': { Ca: 2, O: -2, H: 1 }, H2SO4: { H: 1, S: 6, O: -2 }, H2CO3: { H: 1, C: 4, O: -2 }, Mg: { Mg: 0 },
  MgO: { Mg: 2, O: -2 }, Fe: { Fe: 0 }, Fe2O3: { Fe: 3, O: -2 }, Cl2: { Cl: 0 }, HCl: { H: 1, Cl: -1 },
  CH3OH: { C: -2, H: 1, O: -2 }, NO2: { N: 4, O: -2 }, N2O4: { N: 4, O: -2 }, Na: { Na: 0 }, NaCl: { Na: 1, Cl: -1 },
  NH4Cl: { N: -3, H: 1, Cl: -1 }, CaCO3: { Ca: 2, C: 4, O: -2 }, 'Ca(HCO3)2': { Ca: 2, H: 1, C: 4, O: -2 },
  HgO: { Hg: 2, O: -2 }, Hg: { Hg: 0 }, KClO3: { K: 1, Cl: 5, O: -2 }, KCl: { K: 1, Cl: -1 }, H2O2: { H: 1, O: -1 },
  NaHCO3: { Na: 1, H: 1, C: 4, O: -2 }, Na2CO3: { Na: 1, C: 4, O: -2 }, PCl5: { P: 5, Cl: -1 }, PCl3: { P: 3, Cl: -1 },
  KClO4: { K: 1, Cl: 7, O: -2 }, HNO2: { H: 1, N: 3, O: -2 }, HNO3: { H: 1, N: 5, O: -2 }, NO: { N: 2, O: -2 },
  Zn: { Zn: 0 }, CuSO4: { Cu: 2, S: 6, O: -2 }, ZnSO4: { Zn: 2, S: 6, O: -2 }, Cu: { Cu: 0 }, FeSO4: { Fe: 2, S: 6, O: -2 },
  ZnCl2: { Zn: 2, Cl: -1 }, AgNO3: { Ag: 1, N: 5, O: -2 }, 'Cu(NO3)2': { Cu: 2, N: 5, O: -2 }, Ag: { Ag: 0 },
  NaBr: { Na: 1, Br: -1 }, Br2: { Br: 0 }, NaOH: { Na: 1, O: -2, H: 1 }, Al: { Al: 0 }, Al2O3: { Al: 3, O: -2 },
  CuO: { Cu: 2, O: -2 }, AgCl: { Ag: 1, Cl: -1 }, NaNO3: { Na: 1, N: 5, O: -2 }, Na2SO4: { Na: 1, S: 6, O: -2 },
  'Pb(NO3)2': { Pb: 2, N: 5, O: -2 }, KI: { K: 1, I: -1 }, PbI2: { Pb: 2, I: -1 }, KNO3: { K: 1, N: 5, O: -2 },
  CaCl2: { Ca: 2, Cl: -1 }, FeCl3: { Fe: 3, Cl: -1 }, 'Fe(OH)3': { Fe: 3, O: -2, H: 1 }, KOH: { K: 1, O: -2, H: 1 },
  K2SO4: { K: 1, S: 6, O: -2 }, NaHSO4: { Na: 1, H: 1, S: 6, O: -2 }, 'Ba(OH)2': { Ba: 2, O: -2, H: 1 },
  BaSO4: { Ba: 2, S: 6, O: -2 }, CH3COOH: { C: 0, H: 1, O: -2 }, CH3COONa: { C: 0, H: 1, O: -2, Na: 1 },
  'Fe^2+': { Fe: 2 }, 'Fe^3+': { Fe: 3 }, 'OH^-': { O: -2, H: 1 }, '•OH': { O: -1, H: 1 }, NaClO: { Na: 1, Cl: 1, O: -2 },
  H2S: { H: 1, S: -2 }, S: { S: 0 }, MnO2: { Mn: 4, O: -2 }, MnCl2: { Mn: 2, Cl: -1 },
};
// Redox en que la variación neta por elemento es cero (el mismo elemento sube y baja).
const DENTRO = { peroxido: 'O', nitroso: 'N', perclorato: 'Cl', fermentacion: 'C', 'dioxido-nitrogeno': 'N', lejia: 'Cl', azufre: null };
const DISMUTA = Object.fromEntries(Object.entries(DENTRO).filter(([, e]) => e));

// ---------- Clases por la forma, a mano: 'sí' | 'ambiguas' ----------
const FORMAS_MANO = {
  metano: 'combustion', propano: 'combustion', glucosa: 'combustion', etanol: 'combustion',
  monoxido: 'adicion combustion', carbon: 'adicion combustion', 'metano-incompleta': 'combustion',
  agua: 'adicion | combustion', amoniaco: 'adicion', trioxido: 'adicion | combustion', 'cal-apagada': 'adicion',
  'acido-sulfurico': 'adicion', 'acido-carbonico': 'adicion', magnesio: 'adicion | combustion', herrumbre: 'adicion | combustion',
  'cloruro-hidrogeno': 'adicion', metanol: 'adicion', dimero: '| adicion descomposicion', sal: 'adicion',
  'cloruro-amonio': 'adicion | neutralizacion', 'caliza-disuelta': 'adicion',
  caliza: 'descomposicion', 'oxido-mercurio': 'descomposicion', electrolisis: 'descomposicion', clorato: 'descomposicion',
  peroxido: 'descomposicion', bicarbonato: 'descomposicion', sarro: 'descomposicion | precipitacion', pentacloruro: 'descomposicion',
  perclorato: 'descomposicion', nitroso: 'descomposicion', fermentacion: 'descomposicion',
  'zinc-cobre': 'simple | precipitacion', 'hierro-cobre': 'simple | precipitacion', 'zinc-acido': 'simple',
  'cobre-plata': 'simple | precipitacion', 'cloro-bromuro': 'simple', 'sodio-agua': 'simple', termita: 'simple', 'oxido-cobre': 'simple',
  'plata-cloruro': 'doble precipitacion', 'lluvia-oro': 'doble precipitacion', ablandar: 'doble precipitacion',
  'hierro-hidroxido': 'doble precipitacion', 'neutra-hcl': 'doble neutralizacion', 'neutra-sulfurico': 'doble neutralizacion',
  'sal-acida-carbonato': 'doble neutralizacion', 'sal-acida-sulfato': 'doble neutralizacion',
  'cal-dureza': 'doble precipitacion | neutralizacion', 'bario-neutra': 'doble neutralizacion precipitacion',
  'caliza-acido': 'doble | neutralizacion', 'bicarbonato-acido': 'doble | neutralizacion', vinagre: 'doble | neutralizacion',
  fenton: '', 'dioxido-nitrogeno': '', lejia: '', azufre: '', fotosintesis: '', 'cobre-nitrico': '', 'cloro-lab': '',
};
// Con →, pero solo porque un gas se escapa (o el sólido se separa): ni «reversible» ni «irreversible» sin dudas.
const REVERSIBLE_AMBIGUA = new Set(['sarro', 'caliza-disuelta', 'caliza', 'bicarbonato', 'cloruro-amonio']);
// Qué ecuación explica cada pregunta del agua dura.
const AGUA_MANO = { sarro: 'sarro', bicarbonato: 'caliza-disuelta' };
const FORMAS = ['adicion', 'descomposicion', 'simple', 'doble', 'combustion', 'neutralizacion', 'precipitacion'];
function formasMano(id) {
  const [si, amb = ''] = FORMAS_MANO[id].split('|').map(x => x.trim().split(/\s+/).filter(Boolean));
  return { si: new Set(si), amb: new Set(amb) };
}

// ---------- Lectura de la ecuación (propia del test) ----------
function leer(ec) {
  const rev = ec.includes('<=>');
  const lado = s => s.trim().split(/\s+\+\s+/).map(t => {
    const m = t.match(/^(\d*)(.+?)(\((?:s|l|g|ac)\))?$/);
    return { coef: m[1] ? +m[1] : 1, f: m[2] };
  });
  const [a, b] = ec.split(/<=>|->/);
  return { R: lado(a), P: lado(b), rev };
}
const MM = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, P: 31, S: 32, Cl: 35.5, K: 39, Ca: 40, Mn: 55, Fe: 56,
  Cu: 63.5, Zn: 65, Br: 80, Ag: 108, I: 127, Ba: 137, Hg: 200.6, Pb: 207 };
// Conteo de átomos expandiendo paréntesis a mano: "Ca(HCO3)2" → Ca + 2·(H C O3).
function contarAtomos(f) {
  let s = f.replace(/^•/, '').replace(/\^.*$/, '');
  while (/\(([^()]*)\)(\d*)/.test(s)) s = s.replace(/\(([^()]*)\)(\d*)/, (_, g, k) => g.repeat(k ? +k : 1));
  const r = {};
  for (const [, e, n] of s.matchAll(/([A-Z][a-z]?)(\d*)/g)) r[e] = (r[e] || 0) + (n ? +n : 1);
  return r;
}
const cargaDe = f => { const m = f.match(/\^(\d*)([+-])$/); return m ? (m[2] === '+' ? 1 : -1) * (m[1] ? +m[1] : 1) : 0; };
// Variación neta del número de oxidación por elemento, con los coeficientes.
function variacion(ec) {
  const { R, P } = leer(ec), d = {};
  for (const [lista, s] of [[R, -1], [P, 1]]) for (const t of lista) for (const [e, n] of Object.entries(contarAtomos(t.f))) d[e] = (d[e] || 0) + s * t.coef * n * NO[t.f][e];
  return d;
}
const id2r = id => gen.BANCO.find(r => r.id === id);
const esRedox = id => DENTRO[id] !== undefined || Object.values(variacion(id2r(id).ec)).some(x => Math.abs(x) > 1e-9);
// Roles por la variación neta: el elemento que sube (baja) y el reactivo que lo trae con un valor menor
// (mayor) que el máximo (mínimo) de los productos.
// Donde el mismo elemento sube y baja, la variación neta no dice quién: los papeles van a mano.
const ROLES_DENTRO = {
  peroxido: ['H2O2', 'H2O2', 'O2', 'H2O'], nitroso: ['HNO2', 'HNO2', 'HNO3', 'NO'], perclorato: ['KClO3', 'KClO3', 'KClO4', 'KCl'],
  fermentacion: ['C6H12O6', 'C6H12O6', 'CO2', 'C2H5OH'], 'dioxido-nitrogeno': ['NO2', 'NO2', 'HNO3', 'NO'], lejia: ['Cl2', 'Cl2', 'NaClO', 'NaCl'],
  azufre: ['H2S', 'SO2', 'S', 'S'],
};
function rolesMano(id) {
  if (ROLES_DENTRO[id]) { const [o, r, fo, fr] = ROLES_DENTRO[id].map(x => [x]); return { seOxida: o, seReduce: r, agenteReductor: o, agenteOxidante: r, formaOxidada: fo, formaReducida: fr }; }
  const r = id2r(id), { R, P } = leer(r.ec), d = variacion(r.ec);
  const sube = Object.keys(d).filter(e => d[e] > 1e-9), baja = Object.keys(d).filter(e => d[e] < -1e-9);
  const vals = (l, e) => l.filter(t => NO[t.f][e] !== undefined && contarAtomos(t.f)[e]).map(t => NO[t.f][e]);
  const reac = (e, up) => R.filter(t => contarAtomos(t.f)[e] && (up ? NO[t.f][e] < Math.max(...vals(P, e)) - 1e-9 : NO[t.f][e] > Math.min(...vals(P, e)) + 1e-9)).map(t => t.f);
  const prod = (e, up) => P.filter(t => contarAtomos(t.f)[e] && (up ? NO[t.f][e] > Math.min(...vals(R, e)) + 1e-9 : NO[t.f][e] < Math.max(...vals(R, e)) - 1e-9)).map(t => t.f);
  const u = a => [...new Set(a)];
  const seOxida = u(sube.flatMap(e => reac(e, true))), seReduce = u(baja.flatMap(e => reac(e, false)));
  return { seOxida, seReduce, agenteReductor: seOxida, agenteOxidante: seReduce,
    formaOxidada: u(sube.flatMap(e => prod(e, true))), formaReducida: u(baja.flatMap(e => prod(e, false))) };
}
function claseMano(id, k) {
  const r = id2r(id);
  if (FORMAS.includes(k)) { const f = formasMano(id); return f.si.has(k) ? 'si' : f.amb.has(k) ? 'ambigua' : 'no'; }
  if (k === 'redox') return esRedox(id) ? 'si' : 'no';
  if (k === 'reversible') return r.ec.includes('<=>') ? 'si' : REVERSIBLE_AMBIGUA.has(id) ? 'ambigua' : 'no';
  if (k === 'dismutacion') return DISMUTA[id] ? 'si' : 'no';
  if (r.dH == null) return 'ambigua';
  return (k === 'exotermica') === (r.dH < 0) ? 'si' : 'no';
}
const ROM = ['I', 'II', 'III', 'IV', 'V'];
const sub = f => f.replace(/^[^^]*/, b => b.replace(/(\d+)/g, d => [...d].map(x => '₀₁₂₃₄₅₆₇₈₉'[x]).join('')))
  .replace(/\^(\d*)([+-])$/, (_, n, s) => [...n].map(x => '⁰¹²³⁴⁵⁶⁷⁸⁹'[x]).join('') + (s === '+' ? '⁺' : '⁻'));

function recalcular(p) {
  const d = p._datos, ids = d.reacciones.map(r => r.id);
  switch (d.tipo) {
    case 'tipo': return claseMano(ids[0], d.clase) === 'si' ? 'tipo:' + d.clase : 'tipo:?';
    case 'relacionar': return 'rel:' + ids.map(id => { const l = d.clases.map((k, i) => claseMano(id, k) === 'si' ? 'abcd'[i] : null).filter(Boolean); return l.length === 1 ? l[0] : '?'; }).join('');
    case 'redoxSet': return 'set:' + ids.map((id, j) => esRedox(id) ? ROM[j] : null).filter(Boolean).join(',');
    case 'rol': { const r = rolesMano(ids[0])[d.sub]; return r.length === 1 ? 'esp:' + r[0] : 'esp:?'; }
    case 'dismutacion': return 'dis:' + DISMUTA[ids[0]];
    case 'aguaDura': return 'agua:' + AGUA_MANO[d.sub];
    case 'calor': {
      const r = id2r(ids[0]), { R, P } = leer(r.ec), t = [...R, ...P].find(x => x.f === d.sustancia);
      const M = Object.entries(contarAtomos(t.f)).reduce((s, [e, n]) => s + MM[e] * n, 0);
      const Q = Math.abs(r.dH) * (d.masa / M) / t.coef;
      return `q:${r.dH < 0 ? 'libera' : 'absorbe'}:${Math.round(Q * 10) / 10}`;
    }
    case 'tipoEnergia': return claseMano(ids[0], d.clase) === 'si' ? `te:${d.clase}:${id2r(ids[0]).dH < 0 ? 'exo' : 'endo'}` : 'te:?';
    case 'aLaVez': { const b = ids.filter(id => d.pareja.every(k => claseMano(id, k) === 'si')); return b.length === 1 ? 'una:' + b[0] : 'una:?'; }
    case 'vf': {
      const id = ids[0], rl = rolesMano(id);
      return 'vf:' + d.afirmaciones.map(a => {
        if (a === 'Es una reacción redox.') return esRedox(id);
        if (a === 'Es reversible.') { assert.notEqual(claseMano(id, 'reversible'), 'ambigua', id); return claseMano(id, 'reversible') === 'si'; }
        if (a.startsWith('Libera calor')) return id2r(id).dH < 0;
        if (a.startsWith('Absorbe calor')) return id2r(id).dH > 0;
        let m = a.match(/^El (.+) es el agente oxidante\.$/); if (m) return rl.agenteOxidante.length === 1 && sub(rl.agenteOxidante[0]) === m[1];
        m = a.match(/^El (\w+) se oxida y se reduce a la vez\.$/); if (m) return DISMUTA[id] === m[1];
        const NOM = { 'adición': 'adicion', 'descomposición': 'descomposicion', 'desplazamiento simple': 'simple', 'doble desplazamiento': 'doble',
          'combustión': 'combustion', 'neutralización': 'neutralizacion', 'precipitación': 'precipitacion' };
        m = a.match(/^Es una reacción de (.+)\.$/);
        const k = NOM[m[1]], c = claseMano(id, k);
        assert.notEqual(c, 'ambigua', `afirmación ambigua: ${a} (${id})`);
        return c === 'si';
      }).map(x => (x ? 'V' : 'F')).join('');
    }
  }
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

// ---------- El banco ----------
test('el banco tiene de 40 a 60 ecuaciones, con ids únicos, y cada una está en la tabla de formas', () => {
  assert.ok(gen.BANCO.length >= 40 && gen.BANCO.length <= 60, `${gen.BANCO.length}`);
  assert.equal(new Set(gen.BANCO.map(r => r.id)).size, gen.BANCO.length);
  for (const r of gen.BANCO) assert.ok(r.id in FORMAS_MANO, `falta ${r.id} en FORMAS_MANO`);
});

test('cada ecuación está balanceada en átomos y en carga (conteo propio del test)', () => {
  for (const r of gen.BANCO) {
    const { R, P } = leer(r.ec), lado = l => { const s = {}; for (const t of l) for (const [e, n] of Object.entries(contarAtomos(t.f))) s[e] = (s[e] || 0) + t.coef * n; return s; };
    assert.deepEqual(lado(R), lado(P), `${r.id}: átomos`);
    const q = l => l.reduce((s, t) => s + t.coef * cargaDe(t.f), 0);
    assert.equal(q(R), q(P), `${r.id}: carga`);
  }
});

test('la tabla a mano es coherente (Σ átomos × número de oxidación = carga) y el generador da lo mismo', () => {
  for (const r of gen.BANCO) { const { R, P } = leer(r.ec); for (const t of [...R, ...P]) {
    const tab = NO[t.f]; assert.ok(tab, `falta ${t.f} en la tabla`);
    const at = contarAtomos(t.f);
    assert.deepEqual(Object.keys(tab).sort(), Object.keys(at).sort(), t.f);
    assert.ok(Math.abs(Object.entries(at).reduce((s, [e, n]) => s + n * tab[e], 0) - cargaDe(t.f)) < 1e-9, `${t.f}: no suma la carga`);
    const g = gen.oxidacion(t.f);
    for (const e of Object.keys(at)) assert.ok(Math.abs(g[e].n / g[e].d - tab[e]) < 1e-9, `${t.f}: ${e} da ${g[e].n}/${g[e].d}, la tabla ${tab[e]}`);
  } }
});

test('electrones perdidos = ganados en cada redox (variación neta con coeficientes)', () => {
  for (const r of gen.BANCO) {
    const d = variacion(r.ec), sube = Object.values(d).filter(x => x > 0).reduce((s, x) => s + x, 0), baja = Object.values(d).filter(x => x < 0).reduce((s, x) => s + x, 0);
    assert.ok(Math.abs(sube + baja) < 1e-9, `${r.id}: pierde ${sube}, gana ${-baja}`);
    assert.equal(gen.analizar(r).redox, esRedox(r.id), `${r.id}: redox`);
    if (DENTRO[r.id] === undefined && gen.analizar(r).redox) assert.ok(sube > 0, `${r.id}`);
  }
});

test('las clases del generador coinciden con las de la tabla a mano', () => {
  for (const r of gen.BANCO) {
    const a = gen.analizar(r);
    for (const k of [...FORMAS, 'redox', 'reversible', 'dismutacion', 'exotermica', 'endotermica']) assert.equal(a.clases[k], claseMano(r.id, k), `${r.id}: ${k}`);
    if (DISMUTA[r.id]) assert.deepEqual(a.dism, [DISMUTA[r.id]]);
    if (a.redox) for (const s of ['seOxida', 'seReduce', 'formaOxidada', 'formaReducida']) assert.deepEqual([...a.roles[s]].sort(), [...rolesMano(r.id)[s]].sort(), `${r.id}: ${s}`);
  }
});

test('reglas entre clases: combustión ⇒ redox y exotérmica; desplazamiento simple ⇒ redox; neutralización y doble ⇒ no redox', () => {
  for (const r of gen.BANCO) {
    const c = gen.analizar(r).clases;
    if (c.combustion === 'si') { assert.equal(c.redox, 'si', r.id); assert.equal(c.exotermica, 'si', r.id); }
    if (c.simple === 'si') assert.equal(c.redox, 'si', r.id);
    if (c.neutralizacion !== 'no' || c.doble === 'si') assert.equal(c.redox, 'no', r.id);
    if (c.dismutacion === 'si') assert.equal(c.redox, 'si', r.id);
    if (c.precipitacion === 'si') assert.equal(c.redox, 'no', r.id);
  }
});

test('el banco trae lo que piden las trampas: sales ácidas, aguas duras, Fenton, dismutaciones y reversibles', () => {
  const ids = new Set(gen.BANCO.map(r => r.id));
  for (const id of ['sal-acida-carbonato', 'sarro', 'caliza-disuelta', 'acido-carbonico', 'fenton', 'nitroso', 'dioxido-nitrogeno', 'peroxido', 'amoniaco', 'glucosa', 'fermentacion', 'etanol'])
    assert.ok(ids.has(id), id);
  assert.ok(gen.BANCO.filter(r => r.ec.includes('<=>') && gen.analizar(r).redox).length >= 3);
});

// ---------- Opciones incorrectas: nunca defendibles ----------
test('ninguna opción incorrecta es defendible (2000 problemas)', () => {
  for (let s = 0; s < 2000; s++) {
    const p = gen.generar(s), d = p._datos, ids = d.reacciones.map(r => r.id);
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const k = a.valor;
      if (d.tipo === 'tipo') assert.equal(claseMano(ids[0], k.slice(5)), 'no', `semilla ${s}: ${k}`);
      if (d.tipo === 'tipoEnergia') { const [, c, e] = k.split(':'); assert.ok(claseMano(ids[0], c) === 'no' || (e === 'exo') !== (id2r(ids[0]).dH < 0), `semilla ${s}`); }
      if (d.tipo === 'aLaVez') { const id = k.slice(4); assert.ok(d.pareja.some(x => claseMano(id, x) === 'no') && d.pareja.every(x => claseMano(id, x) !== 'ambigua'), `semilla ${s}: ${id}`); }
      if (d.tipo === 'rol') assert.ok(!rolesMano(ids[0])[d.sub].includes(k.slice(4)), `semilla ${s}`);
      if (d.tipo === 'relacionar') for (const [j, id] of ids.entries()) for (const [i, cl] of d.clases.entries()) if (i !== 'abcd'.indexOf(recalcular(p)[4 + j])) assert.equal(claseMano(id, cl), 'no', `semilla ${s}`);
    }
  }
});

test('la comproporción del azufre no se llama dismutación y se explica como comproporción', () => {
  const a = gen.analizar(id2r('azufre'));
  assert.equal(a.clases.dismutacion, 'no'); assert.equal(a.clases.redox, 'si');
  const t = gen.porQueNo('dismutacion', a);
  assert.match(t, /comproporción/); assert.match(t, /−2 → 0/); assert.match(t, /\+4 → 0/);
});

test('en rol las opciones llevan su estado y nunca el radical •OH; el calor del enunciado va coloreado', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo === 'rol') for (const a of p.alternativas) { assert.match(a.texto, /\((s|l|g|ac)\)$/, `semilla ${s}: ${a.texto}`); assert.ok(!a.texto.startsWith('•'), `semilla ${s}`); }
    const calor = d.reacciones.some(r => r.calor) && d.tipo !== 'aLaVez';
    if (calor) { assert.ok(p.enunciado.some(x => x && x.v === 'dH'), `semilla ${s}: el calor sin color`); assert.ok(p.variables.dH, `semilla ${s}: falta la variable dH`); }
  }
});

test('salen los diez tipos y los seis papeles redox; hay combustiones en V/F y en redox', () => {
  const tipos = new Set(), subs = new Set(), ids = new Set();
  for (let s = 0; s < 1500; s++) { const p = gen.generar(s); tipos.add(p._datos.tipo); if (p._datos.sub) subs.add(p._datos.sub);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id); }
  assert.deepEqual([...tipos].sort(), ['aLaVez', 'aguaDura', 'calor', 'dismutacion', 'redoxSet', 'relacionar', 'rol', 'tipo', 'tipoEnergia', 'vf']);
  assert.equal(subs.size, 8);
  for (const id of ['AQ-combustion-no-redox', 'AQ-acido-base-redox', 'AQ-tipo-simple', 'AQ-tipo-doble', 'AQ-agente-cruzado', 'EC9-definiciones-al-reves',
    'AQ-dismutacion-un-sentido', 'AQ-calor-en-productos-absorbido', 'AQ-descomposicion-reversible', 'EC9-oxidar-es-ganar-oxigeno', 'AQ-calentar-endotermica', 'AQ-sentido-invertido', 'AQ-redox-sin-cambio'])
    assert.ok(ids.has(id), `no aparece ${id}`);
});

// ---------- casos.json y papel ----------
for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.clave);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('papel.json: entre 5 y 10 problemas con pasos, y sus verificaciones dan lo esperado', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const q of papel.problemas) {
    assert.ok(q.enunciado && q.respuesta && q.pasos.length >= 2, q.id);
    for (const ver of q.verificar || []) {
      if (ver.fn === 'oxidacion') { const g = gen.oxidacion(ver.args[0]); for (const [e, x] of Object.entries(ver.espera)) assert.equal(g[e].n / g[e].d, x, `${q.id}: ${e}`); }
      else if (ver.fn === 'analizar') {
        const a = gen.analizar({ id: 'papel-' + q.id + '-' + ver.args[0], ec: ver.args[0], dH: ver.args[1] ?? null });
        for (const [k, x] of Object.entries(ver.espera)) {
          if (k in a.clases) assert.equal(a.clases[k], x, `${q.id}: ${k}`);
          else assert.deepEqual(a.roles[k], x, `${q.id}: ${k}`);
        }
      } else throw new Error(`fn desconocida ${ver.fn}`);
    }
  }
});
