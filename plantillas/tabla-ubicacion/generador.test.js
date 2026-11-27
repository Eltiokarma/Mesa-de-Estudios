// Pruebas de «Dónde va cada elemento» (tabla-ubicacion): casos.json (calculados aparte, con un script que no usa el
// generador) y, en 400 semillas, un recálculo independiente de la respuesta a partir de _datos: la tabla escrita fila por
// fila (el grupo sale de la posición en la fila, no de la configuración), y las configuraciones por el diagrama escrito
// como texto, con las cuatro anómalas copiadas de una lista.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const FILAS = ['H He', 'Li Be B C N O F Ne', 'Na Mg Al Si P S Cl Ar', 'K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr',
  'Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe', 'Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn'];
const EL = {}; let z = 0;
FILAS.forEach((f, i) => { const l = f.split(' '), n = l.length; l.forEach((s, k) => { z++;
  const g = i === 0 ? (k ? 18 : 1) : k < 2 ? k + 1 : n - k <= 6 ? 18 - (n - 1 - k) : n === 18 ? k + 1 : k >= 17 ? k - 13 : null;
  EL[z] = { s, p: i + 1, g }; }); });
assert.equal(EL[26].g, 8); assert.equal(EL[79].g, 11); assert.equal(EL[85].g, 17); assert.equal(EL[48].g, 12);
const ROM = { 1: 'IA', 2: 'IIA', 3: 'IIIB', 4: 'IVB', 5: 'VB', 6: 'VIB', 7: 'VIIB', 8: 'VIIIB', 9: 'VIIIB', 10: 'VIIIB', 11: 'IB', 12: 'IIB', 13: 'IIIA', 14: 'IVA', 15: 'VA', 16: 'VIA', 17: 'VIIA', 18: 'VIIIA' };
const FAM = { 1: 'Alcalinos', 2: 'Alcalinotérreos', 16: 'Anfígenos', 17: 'Halógenos', 18: 'Gases nobles' };
const lugar = z => `Periodo ${EL[z].p}, grupo ${EL[z].g} (${ROM[EL[z].g]})`;
const debajo = z => +Object.keys(EL).find(k => EL[k].g === EL[z].g && EL[k].p === EL[z].p + 1);
const DIAG = '1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p'.split(' '), CAP = { s: 2, p: 6, d: 10, f: 14 };
const ANOM = { 24: ['4s', 1, '3d', 5], 29: ['4s', 1, '3d', 10], 47: ['5s', 1, '4d', 10], 79: ['6s', 1, '5d', 10] };
function conf(z) { const m = {}; let e = z; for (const s of DIAG) { if (!e) break; m[s] = Math.min(CAP[s[1]], e); e -= m[s]; } if (ANOM[z]) { m[ANOM[z][0]] = ANOM[z][1]; m[ANOM[z][2]] = ANOM[z][3]; } return m; }
const valencia = z => { const p = EL[z].p, m = conf(z); return (m[`${p}s`] || 0) + (m[`${p}p`] || 0); };
const SEMI = ['B', 'Si', 'Ge', 'As', 'Sb', 'Te'], NOMET = ['H', 'He', 'C', 'N', 'O', 'F', 'Ne', 'P', 'S', 'Cl', 'Ar', 'Se', 'Br', 'Kr', 'I', 'Xe', 'At', 'Rn'];
const NOMBRES = { 11: 'sodio', 12: 'magnesio', 13: 'aluminio', 3: 'litio', 19: 'potasio', 20: 'calcio', 38: 'estroncio', 31: 'galio', 49: 'indio', 37: 'rubidio', 50: 'estaño', 53: 'yodo',
  6: 'carbono', 14: 'silicio', 15: 'fósforo', 16: 'azufre', 51: 'antimonio', 55: 'cesio', 56: 'bario', 81: 'talio' };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'familia-z': return FAM[EL[d.z].g];
    case 'periodo-z': return `Periodo ${EL[d.z].p}`;
    case 'debajo': return String(debajo(d.z));
    case 'largo-periodo': return `${FILAS[d.p - 1].split(' ').length + (d.p === 6 ? 0 : 0)} elementos`;
    case 'ubicar-rep': case 'ubicar-d': case 'anomalo': return lugar(d.z);
    case 'z-lugar': return String(d.z);
    case 'lewis': return `${valencia(d.z)} puntos`;
    case 'par-familia': return gen.confTxt(debajo(d.z));
    case 'bloque': { const g = EL[d.z].g; return `Bloque ${g <= 2 ? 's' : g <= 12 ? 'd' : 'p'}`; }
    case 'a-b': return p.respuesta.valor.startsWith('No:') && EL[d.a].g !== EL[d.b].g ? p.respuesta.valor : 'falla';
    case 'clase': { const s = EL[d.z].s; return `Un ${SEMI.includes(s) ? 'semimetal' : NOMET.includes(s) ? 'no metal' : 'metal'}`; }
    case 'mas-metalico': { const m = d.trio.slice().sort((a, b) => (EL[b].p - EL[a].p) || (EL[a].g - EL[b].g))[0]; return `El ${NOMBRES[m]}`; }
    case 'propiedades': return d.perfil;
    default: throw new Error(d.tipo);
  }
}
probarGenerador(gen, { semillas: 400, recalcular, igual: (a, b) => a === b });
probarFugas(gen);

test('el periodo 6 tiene 32 elementos, aunque la tabla escrita aquí no traiga el 4f entero', () => {
  assert.equal(FILAS[5].split(' ').length, 32);
});
test('las configuraciones del generador cuadran con el diagrama escrito aquí (Z de 1 a 86)', () => {
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', lee = t => Object.fromEntries(t.replace(/^\[\w+\] /, '').split(' ').map(x => [x.slice(0, 2), +[...x.slice(2)].map(c => SUP.indexOf(c)).join('')]));
  for (const zz of [5, 13, 26, 29, 35, 47, 53, 79, 82, 85]) {
    const m = conf(zz), t = lee(gen.confTxt(zz));
    for (const [s, e] of Object.entries(t)) assert.equal(m[s], e, `${zz}: ${s}`);
  }
});
test('por idea: cada idea da solo sus tipos; sin idea salen las cuatro', () => {
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 200; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
  }
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ['periodos-grupos-bloques', 'ubicacion-lewis', 'bloques-transicion', 'metales-no-metales']);
});
test('datos: lista de líneas cortas, sin la respuesta y sin consejos; colores de la unidad (400 semillas)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), c = p.respuesta.valor;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1, `${s}: sin datos`);
    for (const l of p.datos) {
      assert.ok(l.split(/\s+/).length <= 22, `${s}: dato largo: ${l}`);
      assert.ok(!l.includes(c), `${s}: los datos traen la respuesta`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene)/.test(l), `${s}: consejo`);
    }
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, { Z: 'o', per: 'i', gr: 'h', e: 'f' }[k], `${s}: ${k}`);
  }
});
test('casos.json: de 15 a 20 casos verificados aparte, de las cuatro ideas y los tres niveles', () => {
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 20);
  assert.deepEqual([...new Set(casos.casos.map(c => c.entrada.idea))].sort(), Object.keys(gen.TIPOS_POR_IDEA).sort());
  assert.deepEqual([...new Set(casos.casos.map(c => c.entrada.nivel))].sort(), [1, 2, 3]);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, { idea: c.entrada.idea });
    assert.deepEqual(p._datos, c.entrada, `semilla ${c.semilla}: el generador cambió; recalcula casos.json`);
    assert.equal(p.respuesta.valor, c.esperado.respuesta, `semilla ${c.semilla}`);
  }
});

// Auditoría (19 nov): cada prueba falla con la versión de antes.
const EI_NIST = { 3: 520, 6: 1086, 11: 496, 12: 738, 13: 578, 14: 787, 15: 1012, 16: 1000, 17: 1251, 19: 419, 20: 590, 31: 579, 32: 762, 33: 944, 37: 403, 38: 550, 49: 558, 50: 709, 51: 834, 53: 1008, 55: 376, 56: 503, 81: 589 };
test('auditoría: las explicaciones dicen la cuenta de su alternativa, y los tríos de carácter metálico siguen la EI del NIST', () => {
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  for (let s = 0; s < 400; s++) for (const idea of ['ubicacion-lewis', 'metales-no-metales']) {
    const p = gen.generar(s, { idea }), d = p._datos;
    for (const a of p.alternativas.filter(x => x.error && x.error.id === 'QM-D-VALENCIA')) {
      const m = a.texto.match(/\dd([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/), n = a.error.explicacion.match(/Tiene (\d+) electrones d/);
      assert.ok(m && n && +[...m[1]].map(c => SUP.indexOf(c)).join('') === +n[1], `${s}: «${a.error.explicacion}» para ${a.texto}`);
    }
    if (d.tipo === 'z-lugar') for (const a of p.alternativas.filter(x => x.error && x.error.id === 'QM-SOLO-P')) assert.equal(+a.texto, d.z + 2, `${s}: QM-SOLO-P`);
    if (d.tipo === 'lewis') for (const a of p.alternativas.filter(x => x.error && x.error.id === 'QM-LEWIS-NIVEL')) assert.equal(+a.texto.split(' ')[0], EL[d.z].p, `${s}: QM-LEWIS-NIVEL`);
    if (d.tipo === 'mas-metalico') { const o = d.trio.slice().sort((a, b) => (EL[b].p - EL[a].p) || (EL[a].g - EL[b].g)); assert.ok(EI_NIST[o[0]] < EI_NIST[o[1]] && EI_NIST[o[1]] < EI_NIST[o[2]], `${s}: trío ${d.trio}`); }
  }
});

// Verificador de la segunda pasada (27 nov). (1) En «misma familia», la alternativa QM-CUENTA-GRUPO del magnesio y del
// calcio es el escandio o el itrio (ns² y un d): la explicación decía «tiene 2 electrones, no 2». (2) En los cuatro
// anómalos, la alternativa QM-ANOMALO-GRUPO es la suma real más uno (Cr → 7; Cu, Ag, Au → 12), como dice el texto nuevo.
test('par-familia: QM-CUENTA-GRUPO no dice «N electrones, no N»; anomalo: QM-ANOMALO-GRUPO es la suma real más uno', () => {
  let pares = 0, anom = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s, { idea: 'ubicacion-lewis' });
    if (p._datos.tipo === 'par-familia') for (const a of p.alternativas) {
      if (!a.error || a.error.id !== 'QM-CUENTA-GRUPO') continue;
      pares++;
      const m = a.error.explicacion.match(/tiene (\d+) electrones, no (\d+)/);
      if (m) assert.notEqual(m[1], m[2], `${s}: ${a.error.explicacion}`);
    }
    const q = gen.generar(s, { idea: 'bloques-transicion' });
    if (q._datos.tipo === 'anomalo') {
      const a = q.alternativas.find(x => x.error && x.error.id === 'QM-ANOMALO-GRUPO'), z = q._datos.z, real = EL[z].g;
      assert.match(a.error.explicacion, /sumaste un electrón de más/);
      assert.equal(a.texto, `Periodo ${EL[z].p}, grupo ${real + 1} (${ROM[real + 1]})`, `${s} Z = ${z}`);
      anom++;
    }
  }
  assert.ok(pares > 20 && anom > 20, `${pares} ${anom}`);
});
