// Pruebas de «Tipos de enlace, iones y estructuras de Lewis» (enlace-lewis): casos.json (calculados aparte, con un script
// que no usa el generador), y en 400 semillas un recálculo independiente de la respuesta a partir de _datos, con tablas
// escritas aquí de nuevo (no las del generador): electrones de valencia por grupo y electronegatividad de Pauling-Allred.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));

// ---------- Camino independiente ----------
const VAL = { H: 1, Li: 1, Na: 1, K: 1, Cu: 1, Ag: 1, Be: 2, Mg: 2, Ca: 2, Fe: 2, Zn: 2, B: 3, Al: 3, C: 4, Si: 4, N: 5, P: 5, O: 6, S: 6, F: 7, Cl: 7, Br: 7, I: 7, Xe: 8 };
const EN = { H: 2.2, Li: 0.98, B: 2.04, C: 2.55, N: 3.04, O: 3.44, F: 3.98, Na: 0.93, Mg: 1.31, P: 2.19, S: 2.58, Cl: 3.16, K: 0.82, Ca: 1.0, Br: 2.96 };
const METAL = new Set(['Li', 'Na', 'K', 'Be', 'Mg', 'Ca', 'Al', 'Fe', 'Cu', 'Zn', 'Ag']);
const NOMBRE = { H: 'hidrógeno', B: 'boro', C: 'carbono', N: 'nitrógeno', O: 'oxígeno', F: 'flúor', P: 'fósforo', S: 'azufre', Cl: 'cloro', Br: 'bromo', Al: 'aluminio' };
const SUBI = n => (n === 1 ? '' : '₀₁₂₃₄₅₆'[n]);
const SUPI = q => `${Math.abs(q) === 1 ? '' : '⁰¹²³'[Math.abs(q)]}${q > 0 ? '⁺' : '⁻'}`;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const ionQ = s => (METAL.has(s) ? VAL[s] : VAL[s] - 8);
const ORDEN = { 'O₂': 2, 'CO₂': 2, HCN: 3, 'CH₂O': 2, 'Cl₂': 1, 'N₂': 3, HCl: 1, 'CN⁻': 3 };
const OTX = { 1: 'Simple: un par compartido', 2: 'Doble: dos pares compartidos', 3: 'Triple: tres pares compartidos' };
const SUMA = ats => ats.reduce((a, s) => a + VAL[s], 0);
const ESTRUCTURAS = { 'O₃': [3, 2], 'NO₃⁻': [4, 3], 'CO₃²⁻': [4, 3], 'NO₂⁻': [3, 2], 'SO₃': [4, 3], 'HCOO⁻': [3, 2], 'CH₃COO⁻': [3, 2] };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'tipo-elementos': { const m = d.els.filter(s => METAL.has(s)).length, n = d.els.length - m; return m && n ? 'Iónico' : m ? 'Metálico' : 'Covalente'; }
    case 'delta-signo': return `El ${NOMBRE[EN[d.a] > EN[d.b] ? d.a : d.b]}`;
    case 'tipo-den': { const x = Math.abs(EN[d.a] - EN[d.b]); return d.a === d.b ? 'Covalente apolar' : x >= 1.7 - 1e-9 ? 'Iónico' : 'Covalente polar'; }
    case 'tipo-propiedades': return ['Iónico', 'Iónico', 'Metálico', 'Metálico', 'Covalente', 'Covalente'][d.i];
    case 'carga-ion': return `${d.s}${SUPI(ionQ(d.s))}`;
    case 'formula-ionica': { const qm = ionQ(d.m), qx = -ionQ(d.x), g = gcd(qm, qx); return `${d.m}${SUBI(qx / g)}${d.x}${SUBI(qm / g)}`; }
    case 'electrones-transferidos': { const qm = ionQ(d.m), qx = -ionQ(d.x); return String(qm * qx / gcd(qm, qx)); }
    case 'electrones-repartir': return String(SUMA(d.ats) - d.q);
    case 'libres-central': return String((VAL[d.c] - d.n) / 2);
    case 'orden-enlace': return OTX[ORDEN[d.fo]];
    case 'quien-pone': return `El ${{ N: 'nitrógeno', O: 'oxígeno', F: 'flúor', Cl: 'cloro' }[d.pone]}`;
    case 'electrones-central': return String(2 * (d.n + d.l));
    case 'radical': return d.rad;
    case 'cuantas-estructuras': return String(ESTRUCTURAS[d.fo][1]);
    case 'orden-promedio': { const [t, n] = ESTRUCTURAS[d.fo]; return `${t}/${n}`; }
    case 'carga-formal': { const c = d.va - d.li - d.en; return c === 0 ? '0' : `${c > 0 ? '+' : '−'}${Math.abs(c)}`; }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
probarGenerador(gen, { semillas: 400, recalcular, igual: (a, b) => a === b });
probarFugas(gen);

test('casos.json: cada caso da la respuesta calculada aparte', () => {
  assert.ok(casos.casos.length >= 15);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, { idea: c.entrada.idea });
    for (const [k, x] of Object.entries(c.entrada)) assert.deepEqual(p._datos[k], x, `${c.semilla} ${c.entrada.tipo}: ${k}`);
    assert.equal(p.respuesta.valor, c.esperado.respuesta, `${c.semilla} ${c.entrada.tipo}`);
  }
});

test('por idea: cada idea da solo sus tipos; sin idea salen las cinco', () => {
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 200; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
  }
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ['tres-enlaces', 'enlace-ionico', 'lewis-octeto', 'dativo-excepciones', 'resonancia']);
});

test('datos, colores, una sola correcta y sin nombres de compuestos (400 semillas)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), c = p.respuesta.valor, todo = [p.enunciado, p.pregunta, p.datos, p.solucion, p.alternativas.map(a => [a.texto, a.error && a.error.explicacion])].map(plano).join(' ');
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1, `${s}: sin datos`);
    for (const l of p.datos) {
      assert.ok(l.split(/\s+/).length <= 22, `${s}: dato largo: ${l}`);
      assert.ok(!l.includes(`= ${c}`) && l !== c, `${s}: los datos traen la respuesta «${c}»`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene)/.test(l), `${s}: consejo en datos`);
    }
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, { Z: 'o', EN: 'i', e: 'f', q: 'h' }[k], `${s}: ${k}`);
    assert.ok(!/\b(cloruro|bromuro|yoduro|fluoruro|óxido|hidróxido|sulfuro|nitruro|carbonato|nitrato|nitrito|amonio|hidronio|sulfato|fosfato|perclorato)\b/i.test(todo), `${s}: nombre de compuesto: ${todo.slice(0, 120)}`);
    // Una sola alternativa calza con el recálculo (no hay dos textos que digan lo mismo con otra forma).
    assert.equal(p.alternativas.filter(a => a.texto === recalcular(p)).length, 1, `${s}: ${p._datos.tipo}`);
  }
});

test('los distractores dan el valor que su error produce (fórmula, transferencia y carga formal)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      if (d.tipo === 'formula-ionica' && a.error.id === 'QM-FORM-UNO') assert.equal(a.texto, `${d.m}${d.x}`);
      if (d.tipo === 'electrones-transferidos' && a.error.id === 'QM-TRANSF-UNO') assert.equal(a.texto, String(ionQ(d.m)));
      if (d.tipo === 'electrones-transferidos' && a.error.id === 'QM-TRANSF-SUMA') assert.equal(a.texto, String(ionQ(d.m) - ionQ(d.x)));
      if (d.tipo === 'carga-formal' && a.error.id === 'QM-CF-ENLACES') { const c = d.va - d.li - 2 * d.en; assert.equal(a.texto, c === 0 ? '0' : `${c > 0 ? '+' : '−'}${Math.abs(c)}`); }
      if (d.tipo === 'electrones-repartir' && d.q && a.error.id === 'EN4' && /carga/.test(a.error.explicacion)) assert.equal(a.texto, String(SUMA(d.ats)));
      if (d.tipo === 'libres-central' && a.error.id === 'QM-LIBRES-ELECTRONES') assert.equal(a.texto, String(VAL[d.c] - d.n));
    }
  }
});
