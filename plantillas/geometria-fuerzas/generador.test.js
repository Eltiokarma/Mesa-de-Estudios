// Pruebas de «Forma, hibridación, polaridad y fuerzas entre moléculas» (geometria-fuerzas): casos.json (calculados aparte,
// con un script que no usa el generador) y, en 400 semillas, el recálculo de la respuesta con el motor de la escena de
// enlace (plantillas/enlace/motor.js: VSEPR, hibridación y polaridad por vectores), que el generador no usa, más tablas
// escritas aquí de nuevo para sigma y pi y para la ebullición.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const Mot = require('../enlace/motor.js');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
// Fórmula con subíndices → clave del motor (CH₃Cl → CH3Cl).
const clave = fo => fo.replace(/[₀-₉]/g, c => '0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]);
const HIB = { sp: 'sp', sp2: 'sp²', sp3: 'sp³', sp3d: 'sp³d', sp3d2: 'sp³d²' };
const SP = { 'H₂C=CH₂': [5, 1], 'H₂C=CH–CH₃': [8, 1], 'O=C=O': [2, 2], 'H–C≡N': [2, 2], 'H₂C=O': [3, 1], 'CH₃–CH₃': [7, 0], 'N≡N': [1, 2], 'H₂C=C=CH₂': [6, 2],
  'H₂C=CH–CH=CH₂': [9, 2], 'HC≡C–CH₃': [6, 2], 'CH₃–C≡N': [5, 2], 'HC≡CH': [3, 2] };
const REG = { 'el carbono del CH₃': 4, 'el carbono del medio': null, 'un carbono de la punta': 3, 'el carbono unido al N': 2, 'el carbono': 3, 'un carbono': null, 'un carbono del medio': 3 };
const EB = { 'H₂O': 100, 'H₂S': -60, 'NH₃': -33, 'PH₃': -88, HF: 20, HCl: -85, 'CH₃OH': 65, 'CH₄': -162, 'Br₂': 59, 'Cl₂': -34, 'n-pentano': 36, neopentano: 10, 'etanol (C₂H₅OH)': 78, 'CH₃OCH₃': -24, 'F₂': -188 };
const PUENTE = new Set(['NH₃', 'HF', 'CH₃OH', 'H₂O₂', 'CH₃NH₂', 'H₂O']);
function regionesCarbono(fo, cual) {
  if (REG[cual]) return REG[cual];
  if (fo === 'CH₃–CH₃') return 4;
  if (fo === 'HC≡CH') return 2;
  return { 'H₂C=CH–CH₃': 3, 'HC≡C–CH₃': 2, 'H₂C=C=CH₂': 2 }[fo];
}
function recalcular(p) {
  const d = p._datos, m = d.k && Mot.molecula(clave(d.k));
  switch (d.tipo) {
    case 'regiones': return String(m.vsepr.dominios);
    case 'angulo': return { 180: '180°', 120: '120°', 109: '109,5°', 90: '90°' }[Math.floor(Math.min(...m.vsepr.angulos) + 1e-9)];
    case 'forma': case 'forma-expandida': return m.vsepr.geometria;
    case 'hib-central': return HIB[m.vsepr.hibridacion];
    case 'sigma-pi': return `${SP[d.fo][0]} σ y ${SP[d.fo][1]} π`;
    case 'electrones-pi': return String(2 * SP[d.fo][1]);
    case 'hib-carbono': return { 2: 'sp', 3: 'sp²', 4: 'sp³' }[regionesCarbono(d.fo, d.cual)];
    case 'polar': return m.polaridad.polar ? 'Polar: sus dipolos no se anulan' : 'Apolar: sus dipolos se anulan';
    case 'cual-polar': return [d.si, ...d.no].filter(k => Mot.molecula(clave(k)).polaridad.polar)[0];
    case 'que-fuerza': return null;
    case 'cual-hierve': { const a = EB[d.a] > EB[d.b] ? d.a : d.b; return p.respuesta.valor.startsWith(`El ${a}:`) ? p.respuesta.valor : `El ${a}`; }
    case 'puente': return [d.si, ...d.no].filter(x => PUENTE.has(x))[0];
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
probarGenerador(gen, { semillas: 400, recalcular: p => recalcular(p) ?? p.respuesta.valor, igual: (a, b) => a === b });
probarFugas(gen);

test('cual-polar: una sola polar en la lista, según el motor', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea: 'forma-polaridad' }); if (p._datos.tipo !== 'cual-polar') continue;
    assert.equal([p._datos.si, ...p._datos.no].filter(k => Mot.molecula(clave(k)).polaridad.polar).length, 1, `${s}`);
  }
});
test('la tabla del generador coincide con el motor en forma, hibridación y polaridad', () => {
  for (const [fo, x] of Object.entries(gen.DATOS.MOL)) {
    const m = Mot.molecula(clave(fo));
    assert.equal(m.lewis.ligandos.length, x.n, fo); assert.equal(m.lewis.paresLibres, x.m, fo); assert.equal(m.polaridad.polar, x.polar, fo);
  }
});
test('casos.json: cada caso da la respuesta calculada aparte', () => {
  assert.ok(casos.casos.length >= 15);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, { idea: c.entrada.idea });
    assert.deepEqual(p._datos, c.entrada, `${c.semilla}`);
    assert.equal(p.respuesta.valor, c.esperado.respuesta, `${c.semilla} ${c.entrada.tipo}`);
  }
});
test('por idea; datos sin la respuesta; colores; puente de hidrógeno solo con H en N, O o F (400 semillas)', () => {
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 200; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
  }
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), c = p.respuesta.valor;
    for (const l of p.datos) { assert.ok(l.split(/\s+/).length <= 22, `${s}: dato largo: ${l}`); assert.ok(l !== c, `${s}: dato = respuesta`); }
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, { mu: 'o', ang: 'i', e: 'f', T: 'h' }[k], `${s}: ${k}`);
    if (p._datos.tipo === 'forma' || p._datos.tipo === 'polar') assert.ok(!/NH₃|CH₂Cl₂/.test(plano(p.enunciado)) || p._datos.tipo === 'polar', `${s}: repite la predicción`);
  }
});

// Auditoría (19 nov, rutinas/auditoria/quimica.geometria-molecular.md): cada error da el valor que produce de verdad, la
// masa es la de verdad y los datos no ponen primero a la respuesta. Fallan con el generador de antes.
test('auditoría: regiones, cual-hierve, cual-polar y polar con explicaciones verdaderas (400 semillas por idea)', () => {
  const MASA = { 'H₂O': 18, 'H₂S': 34, 'NH₃': 17, 'PH₃': 34, HF: 20, HCl: 36.5, 'CH₃OH': 32, 'CH₄': 16, 'Br₂': 160, 'Cl₂': 71, 'n-pentano': 72, neopentano: 72, 'etanol (C₂H₅OH)': 46, 'CH₃OCH₃': 46, 'F₂': 38 };
  let primera = 0, cualPolar = 0;
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), d = p._datos;
    if (d.tipo === 'regiones') {
      const m = Mot.molecula(clave(d.k));
      for (const a of p.alternativas) {
        if (!a.error) continue;
        if (a.error.id === 'QM-REGION-PARES') assert.ok(m.lewis.paresLibres > 0, `${s} ${d.k}: no tiene pares libres`);
        if (a.error.id === 'QM-REGION-DOBLE') assert.equal(+a.texto, m.lewis.paresEnlazantes + m.lewis.paresLibres, `${s} ${d.k}: contar cada par compartido`);
      }
    }
    if (d.tipo === 'cual-hierve') for (const a of p.alternativas) {
      const x = a.texto.match(/^El (.+): es más pesado$/); if (x) assert.ok(MASA[x[1]] > MASA[x[1] === d.a ? d.b : d.a], `${s}: ${a.texto}`);
    }
    if (d.tipo === 'cual-polar') {
      cualPolar++;
      const orden = plano(p.enunciado).match(/las moléculas (.+)\./)[1].split(', '), f = p.datos.find(l => l.startsWith('Formas:')).slice(8).split('; ').map(x => x.split(' ')[0]);
      assert.deepEqual(f, orden, `${s}: las formas en el orden del enunciado`);
      if (f[0] === p.respuesta.valor) primera++;
    }
    if (d.tipo === 'polar') assert.ok(!p.alternativas.some(a => /en orden/.test(a.texto)), `${s}`);
  }
  assert.ok(primera < cualPolar / 2, `la respuesta va primera en ${primera} de ${cualPolar}`);
});

// Verificación de la pasada de redacción (26 nov, rutinas/redaccion/quimica.geometria-molecular.md): «si la molécula
// fuera plana» no se le dice a una molécula plana (BF₃, SO₃, H₂O, ClF₃…), y el error «siempre sp³» dice el valor que da.
test('redacción: el dibujo del papel no se confunde con «plana»; QM-HIB-SIEMPRE-SP3 nombra su valor (400 semillas)', () => {
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), d = p._datos;
    for (const a of p.alternativas) {
      if (!a.error) continue;
      if (d.tipo === 'angulo' || /^forma/.test(d.tipo)) assert.ok(!/fuera plana/.test(a.error.explicacion), `${s} ${d.k}: ${a.error.explicacion}`);
      if (a.error.id === 'QM-HIB-SIEMPRE-SP3') assert.ok(a.error.explicacion.startsWith(`Sería ${a.texto} `), `${s} ${d.k}: ${a.texto}: ${a.error.explicacion}`);
    }
  }
});
