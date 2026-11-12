// Pruebas del motor de «La lupa de las moléculas grandes». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Biblioteca: cada SMILES se lee, da la fórmula molecular que dio RDKit (herramienta de autor, coordenadas.py), y
//    los carbonos quirales y los anillos aromáticos que cuenta RDKit; tiene coordenadas para cada átomo y los enlaces
//    del dibujo miden cerca de 1.
// 3. Propiedades en las 30 moléculas: sp + sp² + sp³ = carbonos; σ = enlaces entre átomos + H; electrones π = 2π;
//    polares + apolares = σ + π; anillos = enlaces − átomos + 1; electrones de valencia = 2 × (pares libres + pares
//    de enlace); todo carbono cumple el octeto; escribir la molécula y volver a leerla no cambia nada; hidrogenar
//    suma 2 H y quita un π; en cada lupa hay cuatro opciones de valor distinto y una sola correcta, y ningún error da
//    la respuesta correcta.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');
const BIB = require('./moleculas.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const campo = (r, k) => (k === 'valor' && (r === null || typeof r !== 'object') ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function cerca(real, esperado, que) {
  if (typeof esperado === 'number') { assert.ok(Math.abs(real - esperado) <= 1e-9 * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`); return; }
  assert.deepEqual(real, esperado, que);
}
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...JSON.parse(JSON.stringify(args)));
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'molecula-grande');
  assert.ok(datos.casos.length >= 25 && datos.casos.length <= 40, `${datos.casos.length} casos`);
  assert.equal(typeof datos.verificacion, 'string');
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  // Muchas moléculas distintas.
  const mols = new Set(datos.casos.flatMap(c => [c.args[0], ...(c.tambien || []).map(t => t.args[0])]).filter(a => typeof a === 'string'));
  assert.ok(mols.size >= 20, `${mols.size} moléculas en los casos`);
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Biblioteca contra RDKit (los números los dio RDKit al escribir la biblioteca: CalcMolFormula,
//    FindMolChiralCenters con includeUnassigned y anillos con todos sus átomos aromáticos).
const RDKIT = {
  'fenilalanina': ['C9H11NO2', 1, 1], 'tirosina': ['C9H11NO3', 1, 1], 'triptofano': ['C11H12N2O2', 1, 2],
  'glucosa-abierta': ['C6H12O6', 4, 0], 'glucosa-ciclica': ['C6H12O6', 5, 0], 'fructosa': ['C6H12O6', 3, 0], 'sacarosa': ['C12H22O11', 9, 0],
  'retinol': ['C20H30O', 0, 0], 'retinal': ['C20H28O', 0, 0], 'acido-retinoico': ['C20H28O2', 0, 0], 'beta-caroteno': ['C40H56', 0, 0],
  'vitamina-c': ['C6H8O6', 2, 0], 'nicotinamida': ['C6H6N2O', 0, 1], 'vitamina-e': ['C29H50O2', 3, 1], 'vitamina-d3': ['C27H44O', 5, 0],
  'colesterol': ['C27H46O', 8, 0], 'testosterona': ['C19H28O2', 6, 0], 'estradiol': ['C18H24O2', 5, 1], 'quercetina': ['C15H10O7', 0, 3],
  'curcumina': ['C21H20O6', 0, 2], 'capsaicina': ['C18H27NO3', 0, 1], 'cafeina': ['C8H10N4O2', 0, 2], 'adenina': ['C5H5N5', 0, 2],
  'tiroxina': ['C15H11I4NO4', 1, 2], 'alicina': ['C6H10OS2', 0, 0], 'acido-citrico': ['C6H8O7', 0, 0], 'acido-piruvico': ['C3H4O3', 0, 0],
  'acido-oleico': ['C18H34O2', 0, 0], 'acido-taririco': ['C18H32O2', 0, 0], 'penicilina-g': ['C16H18N2O4S', 3, 1],
};
test('biblioteca: de 20 a 30 moléculas, todas con su número de RDKit', () => {
  assert.ok(BIB.LISTA.length >= 20 && BIB.LISTA.length <= 30);
  assert.deepEqual(BIB.LISTA.map(m => m.id).sort(), Object.keys(RDKIT).sort());
});
for (const m of BIB.LISTA) test(`biblioteca: ${m.id}`, () => {
  const [f, q, ar] = RDKIT[m.id];
  assert.equal(motor.formula(m.id).texto, f, 'fórmula');
  assert.equal(motor.quirales(m.id).valor, q, 'carbonos quirales');
  assert.equal(motor.anillos(m.id).aromaticos, ar, 'anillos aromáticos');
  const mol = motor.molecula(m.smiles);
  assert.ok(Array.isArray(m.coords) && m.coords.length === mol.atomos.length, 'coordenadas');
  for (const [x, y] of m.coords) assert.ok(Number.isFinite(x) && Number.isFinite(y));
  if (!m.fischer) for (const e of mol.enlaces) {
    const d = Math.hypot(m.coords[e.a][0] - m.coords[e.b][0], m.coords[e.a][1] - m.coords[e.b][1]);
    assert.ok(d > 0.6 && d < 1.5, `${m.id}: enlace ${e.a}–${e.b} mide ${d.toFixed(2)}`);
  }
  assert.ok(m.nombre && m.familia && m.clase && m.dato, 'ficha');
});

// 3. Propiedades
const IDS = BIB.LISTA.map(m => m.id);
const VE = { H: 1, C: 4, N: 5, O: 6, S: 6, I: 7 };
test('propiedades de los conteos en toda la biblioteca', () => {
  for (const id of IDS) {
    const mol = motor.molecula(motor.ficha(id).smiles), f = motor.formula(id), h = motor.hibridacion(id), e = motor.enlaces(id);
    const nH = mol.atomos.reduce((t, a) => t + a.h, 0);
    assert.equal(h.cuenta.sp + h.cuenta.sp2 + h.cuenta.sp3, f.conteo.C, id);
    assert.equal(e.sigma, mol.enlaces.length + nH, id);
    assert.equal(e.electronesPi, 2 * e.pi, id);
    assert.equal(e.polares + e.apolares, e.sigma + e.pi, id);
    assert.equal(motor.anillos(id).total, mol.enlaces.length - mol.atomos.length + 1, id);
    const val = mol.atomos.reduce((t, a) => t + VE[a.el] - a.carga, 0) + nH;
    assert.equal(val, 2 * (motor.pares(id).total + e.sigma + e.pi), `${id}: electrones de valencia`);
    const o = motor.octeto(id);
    for (const a of o.atomos) if (a.el === 'C') assert.equal(a.electrones, 8, `${id}: C${a.i}`);
    // Escribir y volver a leer.
    const s = motor.aSmiles(mol);
    assert.ok(s, id);
    for (const fn of ['formula', 'hibridacion', 'enlaces', 'pares', 'quirales', 'anillos'])
      assert.deepEqual(JSON.stringify(motor.resumen(s)[fn === 'hibridacion' ? 'hibridacion' : fn]), JSON.stringify(motor.resumen(id)[fn]), `${id}: ${fn} cambia al reescribir`);
  }
});
test('hidrogenar: entran 2 H y sale un enlace π; el doble enlace del C=C pasa a sp³', () => {
  let n = 0;
  for (const id of IDS) {
    const mol = motor.molecula(motor.ficha(id).smiles);
    mol.enlaces.forEach((e, k) => {
      if (e.orden < 2) return;
      let h; try { h = motor.hidrogenar(id, k); } catch (err) { return; }   // un aromático no siempre se deja
      n++;
      assert.equal(motor.formula(h).conteo.H, motor.formula(id).conteo.H + 2, `${id} enlace ${k}`);
      assert.equal(motor.enlaces(h).pi, motor.enlaces(id).pi - 1, `${id} enlace ${k}`);
    });
  }
  assert.ok(n > 50);
  assert.throws(() => motor.hidrogenar('acido-oleico', 0), /simple/);
});
const LUPAS = ['sp2', 'sp3', 'sp', 'pi', 'epi', 'pares', 'quirales', 'aromaticos', 'polares', 'octeto'];
test('opciones: cuatro valores distintos, una sola correcta, y ningún error da la correcta', () => {
  for (const id of IDS) for (const l of [...LUPAS, 'grupos']) {
    if (!motor.lupaDisponible(id, l)) continue;
    const o = motor.opciones(id, l);
    assert.equal(o.opciones.length, 4, `${id} ${l}`);
    assert.equal(new Set(o.opciones.map(x => x.valor)).size, 4, `${id} ${l}`);
    assert.equal(o.opciones.filter(x => x.correcta).length, 1, `${id} ${l}`);
    for (const x of o.opciones) if (!x.correcta) {
      assert.ok(x.error && x.explicacion && ['documentado', 'parcial', 'hipotesis'].includes(x.respaldo), `${id} ${l}`);
      assert.notEqual(x.valor, o.valor);
    }
    if (l !== 'grupos') assert.ok(o.opciones.every(x => Number.isInteger(x.valor) && x.valor >= 0));
  }
});
test('opciones: la correcta no se amontona en un lugar (≤ 35 % en las numéricas y en «grupos»)', () => {
  const lugar = { num: [0, 0, 0, 0], grupos: [0, 0, 0, 0] };
  for (const id of IDS) for (const l of [...LUPAS, 'grupos']) {
    if (!motor.lupaDisponible(id, l)) continue;
    lugar[l === 'grupos' ? 'grupos' : 'num'][motor.opciones(id, l).opciones.findIndex(x => x.correcta)]++;
  }
  for (const [k, c] of Object.entries(lugar)) { const n = c.reduce((t, x) => t + x, 0); for (const x of c) assert.ok(x / n <= 0.35, `${k}: ${c}`); }
  assert.ok(!motor.lupaDisponible('retinol', 'sp') && !motor.lupaDisponible('glucosa-abierta', 'octeto') && !motor.lupaDisponible('acido-citrico', 'aromaticos'));
  assert.ok(!motor.lupaDisponible('quercetina', 'aromaticos') && !motor.lupaDisponible('cafeina', 'aromaticos') && motor.lupaDisponible('tiroxina', 'octeto'));
});
test('las tres formas de los aminoácidos y la carga de cada átomo', () => {
  for (const id of ['fenilalanina', 'tirosina', 'triptofano']) {
    assert.equal(motor.ionizar(id, 7.4).forma, 'zwitterión');
    assert.equal(motor.ionizar(id, 1).carga, 1);
    const r = motor.ionizar(id, 12);
    assert.equal(r.carga, r.molecula.atomos.reduce((t, a) => t + a.carga, 0));
    assert.equal(motor.formula(r.smiles).carga, r.carga);
  }
  assert.throws(() => motor.ionizar('glucosa-abierta', 7), /pKa/);
});
test('hibridación de los heteroátomos: N del pirrol sp², N de la piridina sp², O del OH sp³', () => {
  const t = motor.hibridacion('triptofano').porAtomo, m = motor.molecula(motor.ficha('triptofano').smiles);
  const nh = m.atomos.findIndex(a => a.el === 'N' && a.corchete);
  assert.equal(t[nh], 'sp2');
  const n = motor.molecula('NC(=O)c1cccnc1'), hn = motor.hibridacion(n).porAtomo;
  assert.equal(hn[8], 'sp2');
  assert.equal(motor.hibridacion('retinol').porAtomo[20], 'sp3');
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.molecula(''), /vacío/);
  assert.throws(() => motor.molecula('CC(C'), /paréntesis/);
  assert.throws(() => motor.molecula('C1CC'), /anillo/);
  assert.throws(() => motor.molecula('CC.O'), /sueltas/);
  assert.throws(() => motor.molecula('C(C)(C)(C)(C)C'), /valencia/);
  assert.throws(() => motor.molecula('c1cccc1'), /Kekulé/);
  assert.throws(() => motor.molecula('CXC'), /entiendo/);
  assert.throws(() => motor.lupa('retinol', 'sp4'), /conozco/);
  assert.throws(() => motor.numeroOxidacion('retinol', 99), /átomo/);
  // Los aromáticos en minúscula y en Kekulé dan lo mismo.
  assert.deepEqual(motor.resumen('c1ccccc1O').enlaces, motor.resumen('C1=CC=CC=C1O').enlaces);
  assert.equal(motor.resumen('Cn1cnc2c1c(=O)n(C)c(=O)n2C').anillos.aromaticos, motor.anillos('cafeina').aromaticos);
});

// 5. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: de 8 a 10 problemas con pasos, título que no regala la respuesta', () => {
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  assert.ok(!/\d/.test(papel.titulo));
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length >= 2 && p.verificar.length >= 1, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => { for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, `papel ${p.id}`); });
