// Pruebas de «Estados de oxidación, nombres y fórmulas» (nomenclatura-practica): casos.json (calculados aparte, con un
// script que no usa el generador), y en 400 semillas un recálculo independiente de la respuesta a partir de _datos, con
// tablas escritas aquí de nuevo: EO fijos, cargas de iones, raíces y la regla de las terminaciones.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const SUB = '₀₁₂₃₄₅₆₇₈₉', SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const esc = f => { let [c, q] = f.split('^'); c = c.split('·').map((p, i) => (i ? p.replace(/^(\d+)/, '$1|') : p).replace(/([A-Za-z)])(\d+)/g, (m, a, d) => a + [...d].map(x => SUB[+x]).join('')).replace('|', '')).join('·');
  if (!q) return c; const m = q.match(/^(\d*)([+-])$/); return c + (m[1] && m[1] !== '1' ? [...m[1]].map(x => SUP[+x]).join('') : '') + (m[2] === '+' ? '⁺' : '⁻'); };
function at(f) { const c = {}; const parse = (t, k) => { let i = 0; while (i < t.length) { if (t[i] === '(') { let d = 1, j = i + 1; while (d) { if (t[j] === '(') d++; if (t[j] === ')') d--; j++; } const m = t.slice(j).match(/^\d*/)[0]; parse(t.slice(i + 1, j - 1), k * (+m || 1)); i = j + m.length; continue; }
  const m = t.slice(i).match(/^([A-Z][a-z]?)(\d*)/); c[m[1]] = (c[m[1]] || 0) + k * (+m[2] || 1); i += m[0].length; } }; parse(f, 1); return c; }
const V = { O: -2, H: 1, Li: 1, Na: 1, K: 1, Ca: 2, Mg: 2, Ba: 2, Al: 3 };
const q = f => (f.includes('^') ? (+(f.match(/\^(\d*)/)[1] || 1)) * (f.endsWith('+') ? 1 : -1) : 0);
const eo = (f, x) => { const a = at(f.split('^')[0]); if (Object.keys(a).length === 1) return 0; if (f === 'KCl') return -1; let s = 0; for (const e in a) if (e !== x) s += V[e] * a[e]; return (q(f) - s) / a[x]; };
const sg = x => (x > 0 ? `+${x}` : x < 0 ? `−${-x}` : '0');
const ROM = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const NOM = { Co: 'cobalto', Ni: 'níquel', Hg: 'mercurio', Fe: 'hierro', Sn: 'estaño', Pb: 'plomo', Cu: 'cobre', Au: 'oro' };
const RAIZ = { Co: ['cobalt', 'cobált'], Ni: ['niquel', 'niquél'], Hg: ['mercuri', 'mercúr'], Fe: ['ferr', 'férr'], Sn: ['estann', 'estánn'], Pb: ['plumb', 'plúmb'], Cu: ['cupr', 'cúpr'], Au: ['aur', 'áur'] };
const DOS = { Co: [2, 3], Ni: [2, 3], Hg: [1, 2], Fe: [2, 3], Sn: [2, 4], Pb: [2, 4], Cu: [1, 2], Au: [1, 3] };
const NM = { Br: ['brom', [1, 3, 5, 7]], I: ['yod', [1, 3, 5, 7]], Cl: ['clor', [1, 3, 5, 7]], Se: ['selen', [4, 6]], S: ['sulfur', [4, 6]], N: ['nitr', [3, 5]] };
const ACENTO = { brom: 'bróm', yod: 'yód', clor: 'clór', selen: 'selén', sulfur: 'sulfúr', nitr: 'nítr' };
const nombreAcido = (e, w) => { const [r, l] = NM[e], k = l.indexOf(w); if (l.length === 2) return `ácido ${k ? ACENTO[r] + 'ico' : (r === 'selen' ? 'seleni' : r) + 'oso'}`;
  return `ácido ${['hipo' + r + 'oso', r + 'oso', ACENTO[r] + 'ico', 'per' + r + 'ico'][k]}`.replace('peryodico', 'peryódico').replace('perbromico', 'perbrómico').replace('perclorico', 'perclórico'); };
const ANION = { 'BrO3^-': 'bromato', 'SO3^2-': 'sulfito', 'IO^-': 'hipoyodito', 'ClO4^-': 'perclorato', 'NO2^-': 'nitrito', 'SeO4^2-': 'selenato', 'PO4^3-': 'fosfato', 'ClO2^-': 'clorito' };
const CAT = { Mg: ['magnesio', 2], Ba: ['bario', 2], Zn: ['zinc', 2], Cu: ['cobre(II)', 2], Fe: ['hierro(II)', 2], K: ['potasio', 1], Al: ['aluminio', 3] };
const mcd = (a, b) => (b ? mcd(b, a % b) : a);
const RAIZH = { HCl: 'clor', HBr: 'brom', HI: 'yod', HF: 'fluor', H2S: 'sulf', H2Se: 'selen' };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'eo-neutro': case 'eo-ion': case 'eo-dos': return sg(eo(d.f, d.x));
    case 'cual-eo': { const meta = eo(d.meta, d.x), cumplen = d.lista.filter(f => eo(f, d.x) === meta); assert.equal(cumplen.length, 1, 'una sola especie con ese EO'); return esc(d.meta); }
    case 'stock-oxido': { const a = at(d.f), m = Object.keys(a).find(s => s !== 'O'), w = 2 * a.O / a[m]; return `óxido de ${NOM[m]}(${ROM[w]})`; }
    case 'trad-oxido': { const a = at(d.f), m = Object.keys(a).find(s => s !== 'O'), w = 2 * a.O / a[m]; return `óxido ${RAIZ[m][DOS[m].indexOf(w)]}${DOS[m].indexOf(w) ? 'ico' : 'oso'}`; }
    case 'formula-oxido': return esc(d.f);
    case 'formula-peroxido': return esc(d.q === 1 ? `${d.s}2O2` : `${d.s}O2`);
    case 'hidracido': return `ácido ${RAIZH[d.f]}hídrico`;
    case 'eo-raro': { const a = at(d.f), o = Object.keys(a).find(s => s !== d.x); return sg(-V[o] * a[o] / a[d.x]); }
    case 'formula-hidroxido': return esc(d.q === 1 ? `${d.s}OH` : `${d.s}(OH)${d.q}`);
    case 'formula-oxacido': { const a = at(d.f); assert.equal(a.H + d.w - 2 * a.O, 0, 'la suma de EO del oxácido da 0'); return esc(d.f); }
    case 'nombre-oxacido': { const a = at(d.f); assert.equal(a.H + d.w - 2 * a.O, 0); return nombreAcido(d.e, d.w); }
    case 'anion': return ANION[d.a];
    case 'formula-sal': { const qa = -q(d.a), qc = CAT[d.c][1], g = mcd(qc, qa), nc = qa / g, na = qc / g, cu = d.a.split('^')[0]; return esc(`${d.c}${nc > 1 ? nc : ''}${na > 1 ? `(${cu})${na}` : cu}`); }
    case 'nombre-sal': return `${ANION[d.a]} de ${CAT[d.c][0]}`;
    case 'clase-sal': return `Sal ${d.f.includes('·') ? 'hidratada' : d.f.includes('(OH)') ? 'básica' : /^[A-Z][a-z]?H/.test(d.f) ? 'ácida' : 'neutra'}`;
    case 'oxigenos-hidrato': { const [s, ag] = d.f.split('·'); return String((at(s).O || 0) + +ag.match(/^\d+/)[0]); }
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

test('por idea: cada idea da solo sus tipos; los Datos no traen la respuesta; los de nombres llevan la tarjeta de la convención', () => {
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 400; s++) {
      const p = gen.generar(s, { idea }); vistos.add(p._datos.tipo);
      assert.ok(tipos.includes(p._datos.tipo)); assert.equal(p._datos.idea, idea);
      assert.ok(Array.isArray(p.datos) && p.datos.length && p.datos.every(l => l.split(/\s+/).length <= 22), `${idea} ${s}: datos`);
      if (p._datos.tipo !== 'clase-sal') assert.ok(!p.datos.some(l => l.includes(p.respuesta.valor) && p.respuesta.valor.length > 3), `${idea} ${s}: los datos traen la respuesta`);
      assert.equal(p.alternativas.filter(a => a.correcta).length, 1);
      if (['stock-oxido', 'trad-oxido', 'formula-oxido', 'nombre-oxacido', 'nombre-sal'].includes(p._datos.tipo)) assert.deepEqual(p.convenciones, ['nomenclatura-examen']);
    }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
  }
});

// Cierre (19 nov 2026, rutinas/auditoria/quimica.nomenclatura-inorganica.md): el papel cubre las seis ideas con el nivel
// de su rótulo, el −2 del H no se llama «signo cambiado» y el guion no se separa de su terminación.
test('cierre: papel con las seis ideas y niveles 1, 1, 1, 2, 2, 2, 3, 3', () => {
  const G = require('./generador.js'), ps = Array.from({ length: 8 }, (_, i) => G.generar(`papel-${i + 1}`));
  assert.equal(new Set(ps.map(p => p._datos.idea)).size, 6);
  assert.deepEqual(ps.map(p => p._datos.nivel), [1, 1, 1, 2, 2, 2, 3, 3]);
  const papel = require('./papel.json').problemas;
  ps.forEach((p, i) => assert.ok(papel[i].enunciado.startsWith(p.enunciado.join('').slice(0, 20)), `papel p${i + 1} al día`));
});
test('cierre: el −2 del H en un hidruro no lleva el código del signo, y el guion va pegado a -oso, -ico, -uro…', () => {
  const G = require('./generador.js');
  for (let s = 0; s < 400; s++) { const p = G.generar(s, { idea: 'peroxidos-hidruros' });
    for (const a of p.alternativas) if (a.error && a.error.id === 'QM-OX-SIGNO') assert.equal(a.texto, '+1', JSON.stringify(p._datos)); // el signo cambiado del −1 del O; en un hidruro, +1 es QM-OX-H
    const t = [...p.datos, ...p.alternativas.map(a => a.error ? a.error.explicacion : '')].join(' ');
    assert.ok(!/(^|[^A-Za-z0-9_\-])-(oso|ico|uro|ito|ato|hídrico)\b/.test(t), t); }
});

// Verificación de la pasada de redacción (26 nov): la sal sin paréntesis (QM-POLI) multiplica el último subíndice en vez
// de pegar dos («ZnClO₂₂» se leía «42»).
test('redacción: QM-POLI sin subíndices pegados (400 semillas por idea)', () => {
  let n = 0;
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) for (const a of gen.generar(s, { idea }).alternativas)
    if (a.error && a.error.id === 'QM-POLI') { n++; assert.ok(((a.texto).match(/[₀-₉]+/g) || []).every(x => +[...x].map(c => '₀₁₂₃₄₅₆₇₈₉'.indexOf(c)).join('') <= 12), `${s}: ${a.texto}`); }
  assert.ok(n > 10, `${n}`);
});
